// Khu phố T&M · world orchestrator. This is what the 3D mode calls. Pure (no DOM, no Three.js), JSON-safe state,
// deterministic given (seed, now). Shops (B's tea shop etc.) plug in through registerShop: world.js never imports them.
import { dayRng } from './rng.js';
import { dateOf, realTime, clockLabel, hourLabel, isRentDay, isPhoneBillDay, isPayday, isSunday, monthKey, eventsOn, isTetHoliday, isSchoolDay, seasonOf } from './calendar.js';
import { createEconomy, economyDay, priceOf, portionOf, outageAt, outagesOn, outageText, newsFor, weatherOf, WEATHER_LABEL, householdPower, landlordPower, LANDLORD_POWER } from './economy.js';
import { createPlayer, spend, eat, gainSkill, NEED_LOW, MIN_WAGE_HOUR, SKILL_NAMES } from './player.js';
import { emptyKpProfile, logShift, endEntry, openEntry, importSolo, syncProfile, sanitizeKp, sanitizeResume, REASONS } from './profile.js';
import { messagesFor, LAW_NOTE } from './xomoi.js';
import { PLACES, PLACE, openAt } from '../data/places.js';
import { FOOD } from '../data/food.js';

export const KP_VERSION = 1;
export const RENT = 3_200_000;          // phòng 16 m² (civic.md: 15-20 m² là 3-4 triệu, 2/2026)
export const WATER = 100_000;           // đ/người/tháng (ví dụ có thật, số thiết kế)
export const PHONE = 120_000;           // điện thoại + mạng, ngày 15 [số thiết kế]
export const KWH_PER_NIGHT = 3;         // ~90 số/tháng
export const CLINIC_FEE = 36_500;       // khám ở trạm y tế; có BHYT thì BHYT trả 100% (dưới 379.500đ)
export const DEBT_BUFFER = 800_000;     // keep this much for food before paying the landlord back
export const BROKE = 100_000;           // dưới mức này: cơm chung Chủ nhật, Cô Bánh Mì cho ghi sổ
export const SHIFT_HOURS = 4;
export const DAY_START = 6 * 60 + 30;   // day 1 starts at 6h30
export const WAKE = 6 * 60;             // default wake-up time
export const LATEST = 26 * 60;          // 2h sáng: the player dozes off
const STEP = 15;                        // advance() resolution in game minutes

// ---------- shop registry (loose coupling with teashop.js and future shops) ----------
const registry = new Map();
/** hooks: { create?(seed, kp) → shop state, onAdvance?(shop, kp, from, to) → events[] | void,
 *           onSleep?(shop, kp, day) → { events?, lines?, money? } | events[] | void } */
export function registerShop(placeId, hooks = {}) { registry.set(placeId, hooks); }
export function unregisterShop(placeId) { registry.delete(placeId); }
export const registeredShops = () => [...registry.keys()];
/** Create state for registered shops that kp.shops lacks (call after registering, e.g. on load). */
export function ensureShops(kp) {
  for (const [id, h] of registry) if (!kp.shops[id] && typeof h.create === 'function') kp.shops[id] = h.create(`${kp.seed}:${id}`, kp);
  return kp;
}

// ---------- helpers ----------
const clone = (x) => JSON.parse(JSON.stringify(x));
const num = (x, d = 0) => (typeof x === 'number' && Number.isFinite(x) ? x : d);
export const fmtMoney = (v) => `${Math.round(v).toLocaleString('vi-VN').replace(/,/g, '.')}đ`;
const placeName = (id) => (PLACE[id] ? PLACE[id].name : id);
const placeShort = (id) => (PLACE[id] ? PLACE[id].short : id);

/** Add (or remove, v < 0) money with a reason line in the ledger. */
export function addMoney(kp, v, k, text, extra = {}) {
  v = Math.round(v);
  kp.player.money += v;
  kp.ledger.push({ day: kp.time.day, min: kp.time.min, k, v, text, ...extra });
  if (kp.ledger.length > 400) kp.ledger.splice(0, kp.ledger.length - 400);
  return kp.player.money;
}

function startDay(kp, events) {
  kp.today = { day: kp.time.day, startMoney: kp.player.money, skills: { ...kp.player.skills }, events: events.filter((e) => e.type !== 'open' && e.type !== 'close') };
  // Xóm Ơi messages for the day
  const day = kp.time.day;
  const ctx = { day, weather: kp.economy.weather, tamTru: kp.player.tamTru, rentTomorrow: isRentDay(day + 1),
    broke: kp.player.money < BROKE || kp.player.rentDebt > 0, drama: !!kp.flags.drama, dramaText: kp.flags.dramaText };
  const evs = events.map((e) => (e.type === 'remodel' ? { ...e, placeName: placeShort(e.placeId) } : e));
  const msgs = messagesFor(evs, ctx, dayRng(kp.seed, day, 'xomoi'));
  for (const m of msgs) kp.xomoi.msgs.push({ day, ...m, seen: false, delivered: false });
  if (kp.xomoi.msgs.length > 200) kp.xomoi.msgs.splice(0, kp.xomoi.msgs.length - 200);
  kp.flags.drama = false; kp.flags.dramaText = null;
  deliver(kp, []);
}

function deliver(kp, events) {
  const { day, min } = kp.time;
  for (const m of kp.xomoi.msgs) {
    if (m.delivered || m.day > day || (m.day === day && m.min > min)) continue;
    m.delivered = true;
    kp.xomoi.unread++;
    events.push({ type: 'xomoi', msg: { from: m.from, text: m.text, min: m.min } });
  }
}

// ---------- game lifecycle ----------
/** → a fresh kp state. profile: an existing personal profile to carry over (the hồ sơ is never reset).
 *  now: real ms timestamp (pass it for deterministic tests; defaults to 0 so the sim never reads the clock). */
export function newGame({ name, seed, now = 0, profile, soloRuns, companyName } = {}) {
  seed = String(seed ?? 'khupho');
  const kp = {
    v: KP_VERSION, seed, created: now, saved: now,
    time: { day: 1, min: DAY_START },
    player: createPlayer(name),
    economy: createEconomy(seed),
    profile: profile ? sanitizeResume(clone(profile)) : emptyKpProfile(),
    xomoi: { msgs: [], unread: 0 },
    job: null, shops: {}, ledger: [], flags: {},
    bills: { meter: 0, rentPaid: monthKey(1), lastBill: 0 },   // November's rent was paid at move-in, with the deposit
    today: null,
  };
  if (soloRuns) importSolo(kp.profile, soloRuns, companyName);
  syncProfile(kp.profile, kp.player);
  ensureShops(kp);
  const events = calendarEvents(1).concat(economyDay(kp.economy, 1));
  startDay(kp, events);
  return kp;
}

/** Accept whatever storage returned. → a playable kp. A broken world restarts but keeps the personal profile. */
export function loadGame(raw, { name, seed, now = 0 } = {}) {
  const kp = sanitizeKp(raw);
  if (!kp) return newGame({ name, seed, now });
  if (kp.broken) return newGame({ name: name || kp.profile.name, seed: seed ?? kp.seed, now, profile: kp.profile });
  kp.bills = kp.bills || { meter: 0, rentPaid: monthKey(kp.time.day), lastBill: 0 };
  kp.today = kp.today || { day: kp.time.day, startMoney: kp.player.money, skills: { ...kp.player.skills }, events: [] };
  ensureShops(kp);
  return kp;
}

/** Stamp before saving (kp.saved decides which device wins in a merge). */
export function stamp(kp, now = Date.now()) {
  kp.saved = now;
  syncProfile(kp.profile, kp.player, now);
  return kp;
}

/** Import finished Solo runs into the personal profile (idempotent). → number added. */
export const importSoloRuns = (kp, soloRuns, companyName) => importSolo(kp.profile, soloRuns, companyName);

function calendarEvents(day) { return eventsOn(day).map((e) => ({ type: 'calendar', id: e.id, name: e.name })); }

// ---------- places ----------
/** Is a place open at kp's current time (or at { day, min })? Uses data/places.js hours. */
export function isOpen(kp, placeId, at = kp.time) {
  const p = PLACE[placeId];
  if (!p || p.offmap) return false;
  const t = realTime(at);
  if (['office', 'warehouse'].includes(p.kind) && isTetHoliday(t.day)) return false;
  if (p.kind === 'school' && !isSchoolDay(t.day)) return false;
  return openAt(p, dateOf(t.day).weekday, t.min);
}
/** Minutes until the place closes (0 if closed; 1440 for 24h places). */
export function minutesUntilClose(kp, placeId, at = kp.time) {
  if (!isOpen(kp, placeId, at)) return 0;
  for (let m = 15; m <= 1440; m += 15) if (!isOpen(kp, placeId, { day: at.day, min: at.min + m })) return m;
  return 1440;
}

// ---------- the clock ----------
/** Move the clock by `minutes` doing `activity` ('walk' | 'work' | 'rest' | 'idle').
 *  Decays needs, runs shop hooks (deliveries), emits open/close, outage, xomoi, faint and must_sleep events. → events[] */
export function advance(kp, minutes, activity = 'walk') {
  const events = [];
  let left = Math.max(0, Math.round(num(minutes)));
  if (kp.flags.mustSleep) { events.push({ type: 'must_sleep' }); return events; }
  while (left > 0) {
    const step = Math.min(left, STEP, LATEST - kp.time.min);
    if (step <= 0) break;
    const from = { ...kp.time };
    const to = { day: from.day, min: from.min + step };
    const rt = realTime(from);
    const sunny = kp.economy.weather === 'hot' || (kp.economy.weather === 'sun' && seasonOf(rt.day) === 'hot');
    const hotNoon = activity === 'walk' && sunny && rt.min >= 660 && rt.min < 900;
    spend(kp.player, step, activity, { foodMul: hotNoon ? 1.5 : 1 });
    const wasOpen = PLACES.map((p) => isOpen(kp, p.id, from));
    const wasOut = outageAt(kp.economy, from.day, from.min);
    kp.time = to;
    PLACES.forEach((p, i) => { const now = isOpen(kp, p.id, to); if (now !== wasOpen[i]) events.push({ type: now ? 'open' : 'close', placeId: p.id }); });
    const isOut = outageAt(kp.economy, to.day, to.min);
    if (isOut !== wasOut) events.push({ type: isOut ? 'power_off' : 'power_on' });
    for (const [id, h] of registry) {
      if (typeof h.onAdvance !== 'function' || !kp.shops[id]) continue;
      const res = h.onAdvance(kp.shops[id], kp, from, { ...to });
      if (Array.isArray(res)) events.push(...res.map((e) => ({ placeId: id, ...e })));
    }
    deliver(kp, events);
    left -= step;
    const n = kp.player.needs;
    if (n.energy <= 0 || n.food < 8) { events.push(...faint(kp, n.energy <= 0 ? 'energy' : 'food')); break; }
    if (kp.time.min >= LATEST) { kp.flags.mustSleep = true; events.push({ type: 'must_sleep' }); break; }
  }
  return events;
}

/** Xỉu nhẹ: wake up at the trạm y tế, lose the rest of today's shifts. Never a game over. */
function faint(kp, cause) {
  const p = kp.player;
  const fee = p.bhyt ? 0 : CLINIC_FEE;
  p.at = 'tramyte';
  p.needs.energy = Math.max(p.needs.energy, 35);
  p.needs.food = Math.max(p.needs.food, 40);
  p.needs.mood = Math.max(0, Math.round((p.needs.mood - 10) * 10) / 10);
  if (fee) addMoney(kp, -fee, 'clinic', 'Khám ở trạm y tế phường (chưa có BHYT)');
  else kp.ledger.push({ day: kp.time.day, min: kp.time.min, k: 'clinic', v: 0, text: 'Khám ở trạm y tế phường (BHYT trả 100%)' });
  kp.flags.restDay = kp.time.day;
  kp.flags.clinic = { day: kp.time.day, cause };
  kp.time.min = Math.min(LATEST, kp.time.min + 120);
  const line = cause === 'energy'
    ? 'Bác sĩ Lâm: "Làm gì mà kiệt sức tới xỉu vậy con? Nghỉ hết hôm nay, ca chiều để người khác lo."'
    : 'Bác sĩ Lâm: "Đói tới xỉu là không được. Ăn đi rồi hẵng tính chuyện làm giàu."';
  const evs = [{ type: 'faint', cause, placeId: 'tramyte', fee, text: line }];
  if (kp.time.min >= LATEST) { kp.flags.mustSleep = true; evs.push({ type: 'must_sleep' }); }
  return evs;
}

/** Sit and rest (sân chơi, phòng trọ): energy comes back slowly. */
export const rest = (kp, minutes) => advance(kp, minutes, 'rest');

// ---------- food ----------
/** Can the player buy/eat foodId right now? → { ok, reason, price } */
export function canBuyFood(kp, foodId) {
  const f = FOOD[foodId];
  if (!f) return { ok: false, reason: 'Món này khu phố chưa bán.' };
  const price = priceOf(kp.economy, foodId) || 0;
  const t = realTime(kp.time);
  if (f.sharedMeal) {
    if (!isSunday(t.day) || t.min < 17 * 60 || t.min >= 20 * 60) return { ok: false, reason: 'Cơm chung có vào tối Chủ nhật, 17h-20h.', price };
    if (kp.flags.sharedMealDay === t.day) return { ok: false, reason: 'Bạn ăn cơm chung rồi, cô Nga để phần người khác nha.', price };
    if (kp.player.money >= BROKE && kp.player.rentDebt <= 0) return { ok: false, reason: 'Cơm chung dành cho bà con đang kẹt tiền. Ví bạn còn dày, nhường phần nha.', price };
    return { ok: true, price: 0 };
  }
  if (f.place !== 'phongtro' && !isOpen(kp, f.place)) return { ok: false, reason: `${placeShort(f.place)} đang đóng cửa (${PLACE[f.place].hoursText}).`, price };
  if (f.needsPantry && kp.player.pantry <= 0) return { ok: false, reason: 'Phòng hết đồ nấu. Ra chợ mua trước đã.', price };
  if (kp.player.money < price) {
    if (foodId === 'banhmi') return { ok: true, price, tab: true, reason: 'Cô Bánh Mì cho ghi sổ.' };
    return { ok: false, reason: 'Ví mỏng quá. Thử xe bánh mì (cô cho ghi sổ) hoặc cơm chung tối Chủ nhật.', price };
  }
  return { ok: true, price };
}
/** Buy and eat (or buy groceries). Moves the clock by the meal time. → { ok, reason?, price, gained, events } */
export function buyFood(kp, foodId) {
  const can = canBuyFood(kp, foodId);
  if (!can.ok) return { ok: false, reason: can.reason, events: [] };
  const f = FOOD[foodId];
  const price = can.price || 0;
  const res = eat(kp.player, foodId, can.tab ? 0 : 0, portionOf(kp.economy, foodId));
  if (!res.ok) return { ok: false, reason: res.reason, events: [] };
  if (can.tab) { kp.flags.banhmiTab = num(kp.flags.banhmiTab) + price; kp.ledger.push({ day: kp.time.day, min: kp.time.min, k: 'food', v: 0, text: `${f.name} (Cô Bánh Mì ghi sổ ${fmtMoney(price)})` }); }
  else if (price) addMoney(kp, -price, 'food', f.name);
  if (f.sharedMeal) kp.flags.sharedMealDay = realTime(kp.time).day;
  const events = advance(kp, f.min, 'idle');
  return { ok: true, price, tab: !!can.tab, gained: { food: res.food, energy: res.energy, mood: res.mood }, line: f.line, events };
}

// ---------- papers ----------
/** Đăng ký tạm trú on VNeID (free). From the next bill, electricity is charged at the household tiered price. */
export function registerTamTru(kp) {
  const p = kp.player;
  if (p.tamTru) return { ok: false, reason: 'Bạn đăng ký tạm trú rồi.' };
  p.tamTru = true; p.tamTruDay = kp.time.day;
  syncProfile(kp.profile, p);
  return { ok: true, text: `Đã đăng ký tạm trú trên VNeID, không mất đồng nào. Từ kỳ sau tiền điện tính theo giá bậc thang hộ gia đình. ${LAW_NOTE}` };
}

// ---------- work ----------
/** → { ok, reason?, hours, third? } */
export function canWork(kp, placeId) {
  const p = PLACE[placeId];
  if (!p) return { ok: false, reason: 'Không tìm thấy nơi này.' };
  if (!p.work) return { ok: false, reason: `${p.short} chưa tuyển người. Bảng "Sắp tuyển" treo trước cửa.` };
  if (kp.flags.mustSleep) return { ok: false, reason: 'Khuya quá rồi, về ngủ thôi.' };
  if (kp.flags.restDay === kp.time.day) return { ok: false, reason: 'Bác sĩ Lâm dặn nghỉ hết hôm nay. Ca này coi như mất.' };
  if (!isOpen(kp, placeId)) return { ok: false, reason: `${p.short} đang đóng cửa (${p.hoursText}).` };
  if (minutesUntilClose(kp, placeId) < 120) return { ok: false, reason: 'Sắp đóng cửa rồi, không kịp vào ca. Mai quay lại nhé.' };
  const n = kp.player.needs, shifts = kp.player.today.shifts || 0;
  if (shifts >= 3) return { ok: false, reason: 'Ba ca một ngày rồi. Khu phố không trao huy chương cho người xỉu.' };
  if (shifts >= 2 && n.energy <= 60) return { ok: false, reason: 'Một ngày tối đa 2 ca; ca thứ ba chỉ khi năng lượng trên 60.' };
  if (n.energy < 10) return { ok: false, reason: 'Năng lượng gần cạn. Ngủ hoặc nghỉ một chút đã.' };
  if (n.food < 8) return { ok: false, reason: 'Đói quá, ăn gì đó trước đã.' };
  return { ok: true, hours: SHIFT_HOURS, third: shifts >= 2, firstTime: !openEntry(kp.profile, placeId) };
}

/** Minutes of [startMin, endMin) inside 22:00-06:00 (night allowance window). */
function nightMinutes(startMin, endMin) {
  let n = 0;
  for (let m = startMin; m < endMin; m++) { const x = ((m % 1440) + 1440) % 1440; if (x >= 1320 || x < 360) n++; }
  return n;
}

/** Apply a finished shift (from teashop.closeShift): pay, tips, profile line, skills, needs and clock.
 *  result: { hours=4, pay, tips, grade 'A'..'D', rank, role, comment, highlight, skill='phache', nightPaid? }
 *  Pay is floored at the 2026 region-I minimum wage; 30% night allowance for hours in 22h-6h unless result.nightPaid. */
export function workShift(kp, placeId, result = {}) {
  const p = PLACE[placeId] || { id: placeId, name: placeId, short: placeId, kind: 'shop' };
  const hours = num(result.hours, SHIFT_HOURS);
  const day = kp.time.day, start = kp.time.min;
  const sameJob = kp.job && kp.job.placeId === placeId;
  const rank = num(result.rank, sameJob ? kp.job.rank : 1);
  const role = result.role || (sameJob && kp.job.role) || 'Học việc';
  const third = (kp.player.today.shifts || 0) >= 2;
  const lines = [];
  let pay = Math.round(num(result.pay, hours * MIN_WAGE_HOUR));
  const floor = Math.round(hours * MIN_WAGE_HOUR);
  if (pay < floor) { lines.push(`Chủ quán bù cho đủ lương tối thiểu vùng I (25.500đ/giờ) ${LAW_NOTE}`); pay = floor; }
  if (!result.nightPaid) {
    const nm = nightMinutes(start, start + hours * 60);
    if (nm) { const extra = Math.round((pay / (hours * 60)) * nm * 0.3); pay += extra; lines.push(`Phụ cấp làm đêm 30%: +${fmtMoney(extra)} ${LAW_NOTE}`); }
  }
  const tips = Math.max(0, Math.round(num(result.tips)));
  addMoney(kp, pay, 'pay', `Lương ca ${hours} giờ ở ${p.short}`);
  if (tips) addMoney(kp, tips, 'tip', `Tiền tip ở ${p.short}`);
  const entry = logShift(kp.profile, { placeId, placeName: p.name, kind: p.kind === 'shop' ? 'shop' : p.kind, role, rank, day, hours,
    grade: result.grade, pay: pay + tips, comment: result.comment, highlight: result.highlight, contacts: result.contacts });
  kp.player.today.shifts = (kp.player.today.shifts || 0) + 1;
  if (!third) {
    const g = { A: 0.1, B: 0.075, C: 0.05, D: 0.025 }[result.grade] ?? 0.05;
    const skill = result.skill || 'phache';
    const slow = (id) => Math.max(0.15, 1 - (kp.player.skills[id] || 0) / 11); // harder near the top
    gainSkill(kp.player, skill, g * slow(skill));
    gainSkill(kp.player, 'banhang', (g / 2) * slow('banhang'));
  }
  if (!sameJob) kp.job = { placeId, rank, role, since: day };
  else { kp.job.rank = rank; kp.job.role = role; }
  const events = advance(kp, hours * 60, 'work');
  const line = `+1 ca ở ${p.name} (tổng ${entry.daysWorked} ngày, ${entry.shifts} ca)`;
  return { ok: true, pay, tips, entry: { entryId: entry.entryId, daysWorked: entry.daysWorked, shifts: entry.shifts }, line, lines, events };
}

/** Leave a job (any time, no penalty). reasonCode: see profile.REASONS. */
export function quitJob(kp, placeId = kp.job && kp.job.placeId, reasonCode = 'chuyencho', reasonText) {
  if (!placeId) return null;
  const e = endEntry(kp.profile, placeId, { day: kp.time.day, reasonCode, reasonText: reasonText || REASONS[reasonCode] });
  if (kp.job && kp.job.placeId === placeId) kp.job = null;
  return e;
}

// ---------- the night ----------
function payBill(kp, amount, k, text, report, landlord) {
  if (amount <= 0) return;
  const p = kp.player;
  if (p.money >= amount) { addMoney(kp, -amount, k, text, { bill: true }); report.bills.push({ k, v: -amount, text }); return; }
  if (landlord) {
    const first = p.rentDebt === 0;
    p.rentDebt += amount;
    kp.ledger.push({ day: kp.time.day, min: kp.time.min, k, v: 0, text: `${text} (cô Ba Lành cho nợ)`, bill: true });
    report.bills.push({ k, v: 0, owed: amount, text: `${text}: cô Ba Lành cho nợ` });
    if (!report.codes.includes('rent_owed')) {
      report.codes.push('rent_owed');
      report.notes.push(first ? 'Cô Ba Lành: "Kẹt thì cô cho nợ một tháng. Tháng sau gom trả cô nha con."'
        : 'Cô Ba Lành gia hạn thêm, không đuổi ai, nhưng nhìn bạn lâu hơn bình thường một chút.');
      if (!first) p.reputation = Math.max(0, p.reputation - 3);
    }
    return;
  }
  addMoney(kp, -amount, k, text, { bill: true }); // phone: goes negative, the landlord covers it below
  report.bills.push({ k, v: -amount, text });
}

/** End the day: shop closes, sleep, economy tick, bills, Xóm Ơi digest. → nightReport (see ui/night.js). opts.wake (min). */
export function sleep(kp, opts = {}) {
  const p = kp.player;
  const endedDay = kp.time.day;
  const report = { day: endedDay, date: dateOf(endedDay).label, nextDay: endedDay + 1, nextDate: dateOf(endedDay + 1).label,
    money: null, needs: null, slept: 0, skills: [], story: null, tomorrow: [], profile: [], shops: [], bills: [], notes: [], codes: [], law: false, week: null };

  // 1. shops close their day (P&L etc.)
  for (const [id, h] of registry) {
    if (typeof h.onSleep !== 'function' || !kp.shops[id]) continue;
    const res = h.onSleep(kp.shops[id], kp, endedDay);
    if (Array.isArray(res)) report.shops.push(...res.filter((x) => typeof x === 'string'));
    else if (res && typeof res === 'object') {
      if (Array.isArray(res.lines)) report.shops.push(...res.lines);
      if (num(res.money)) addMoney(kp, res.money, 'shop', res.moneyText || `Quán ${placeShort(id)}`);
    }
  }

  // 2. today's money (bills shown separately, they are charged at dawn)
  const todays = kp.ledger.filter((l) => l.day === endedDay && !l.bill);
  const start = kp.today && kp.today.day === endedDay ? kp.today.startMoney : p.money - todays.reduce((s, l) => s + l.v, 0);
  report.money = { start, in: todays.filter((l) => l.v > 0).map(({ k, v, text }) => ({ k, v, text })), out: todays.filter((l) => l.v < 0).map(({ k, v, text }) => ({ k, v, text })) };
  for (const l of todays) if (l.v === 0 && l.k === 'food') report.notes.push(l.text);

  // 3. skills and profile lines of the day
  const before = (kp.today && kp.today.skills) || {};
  for (const [id, v] of Object.entries(p.skills)) {
    const a = Math.floor(num(before[id])), b = Math.floor(v);
    if (b > a) report.skills.push({ id, name: SKILL_NAMES[id] || id, from: a, to: b });
  }
  for (const e of kp.profile.entries) if (e.lastDay === endedDay) report.profile.push(`+1 ngày ở ${e.placeName} (tổng ${e.daysWorked} ngày)`);

  // 4. a story of the day from Xóm Ơi
  const todayMsgs = kp.xomoi.msgs.filter((m) => m.day === endedDay && m.fromId !== 'kp:cuong');
  if (todayMsgs.length) { const m = todayMsgs[Math.floor(dayRng(kp.seed, endedDay, 'story')() * todayMsgs.length)]; report.story = { from: m.from, text: m.text }; }
  if (kp.flags.clinic && kp.flags.clinic.day === endedDay) { report.codes.push('clinic'); report.notes.push('Hôm nay bạn xỉu nhẹ và tỉnh dậy ở trạm y tế. Mất một ca, không mất gì khác.'); }

  // 5. sleep
  const wake = num(opts.wake, WAKE);
  const sleepAt = kp.time.min;
  const wakeAbs = Math.max(1440 + wake, sleepAt + 240);
  const slept = wakeAbs - sleepAt;
  spend(p, slept, 'sleep');
  p.needs.energy = Math.max(p.needs.energy, Math.round(100 * Math.min(1, slept / 420)));
  report.slept = Math.round((slept / 60) * 10) / 10;
  kp.bills.meter += KWH_PER_NIGHT; // fan, lights, phone charger: ~90 số a month
  p.at = 'phongtro';

  // 6. a new day
  const day = endedDay + 1;
  kp.time = { day, min: wakeAbs - 1440 };
  p.today = { coffee: 0, shifts: 0, ate: 0 };
  kp.flags.mustSleep = false;
  const events = calendarEvents(day).concat(economyDay(kp.economy, day));

  // 7. bills at dawn
  if (isRentDay(day)) {
    const mk = monthKey(day);
    if (kp.bills.rentPaid !== mk) {
      payBill(kp, RENT, 'rent', `Tiền phòng tháng ${dateOf(day).m}`, report, true);
      payBill(kp, WATER, 'water', 'Tiền nước (100.000đ/người)', report, true);
      kp.bills.rentPaid = mk;
    }
    const kwh = kp.bills.meter;
    if (kwh > 0) {
      const v = p.tamTru ? householdPower(kwh) : landlordPower(kwh);
      const text = p.tamTru ? `Tiền điện ${kwh} số, giá bậc thang hộ gia đình (đã có tạm trú)` : `Tiền điện ${kwh} số x ${fmtMoney(LANDLORD_POWER)} (giá cô Ba Lành)`;
      payBill(kp, v, 'power', text, report, true);
      kp.bills.meter = 0;
      report.law = true;
      if (!p.tamTru) report.notes.push(`Đăng ký tạm trú ở nhà trọ đạt chuẩn thì được tính giá điện như hộ gia đình (90 số chỉ khoảng 185.000đ). ${LAW_NOTE}`);
    }
    kp.bills.lastBill = day;
  }
  if (isPhoneBillDay(day)) payBill(kp, PHONE, 'phone', 'Cước điện thoại + mạng', report, false);
  if (kp.job && num(kp.job.monthly) > 0 && isPayday(day)) addMoney(kp, kp.job.monthly, 'salary', `Lương tháng ở ${placeShort(kp.job.placeId)}`);

  // 8. no game over: the landlord covers a negative wallet; pay debts back when there is room
  if (p.money < 0) {
    const owe = -p.money;
    p.rentDebt += owe;
    addMoney(kp, owe, 'credit', 'Cô Ba Lành ứng trước, ghi vào sổ nợ', { bill: true });
    report.codes.push('owner_credit');
    report.notes.push(`Ví âm ${fmtMoney(owe)}. Cô Ba Lành ứng trước và ghi sổ: "Ở đây không ai bị bỏ đói, chỉ bị nhắc nợ."`);
  }
  if (p.rentDebt > 0 && p.money > DEBT_BUFFER && !isRentDay(day)) { // pay back what is above a small buffer
    const v = Math.min(p.rentDebt, p.money - DEBT_BUFFER);
    p.rentDebt -= v;
    addMoney(kp, -v, 'debt', p.rentDebt ? 'Trả bớt nợ cô Ba Lành' : 'Trả hết nợ cô Ba Lành', { bill: true });
    report.bills.push({ k: 'debt', v: -v, text: p.rentDebt ? 'Trả bớt nợ cô Ba Lành' : 'Trả hết nợ cô Ba Lành' });
    report.codes.push('debt_paid');
  }
  if (num(kp.flags.banhmiTab) > 0 && p.money >= kp.flags.banhmiTab + 200_000) {
    addMoney(kp, -kp.flags.banhmiTab, 'debt', 'Trả sổ bánh mì cho Cô Bánh Mì', { bill: true });
    report.bills.push({ k: 'debt', v: -kp.flags.banhmiTab, text: 'Trả sổ bánh mì cho Cô Bánh Mì' });
    kp.flags.banhmiTab = 0;
  }
  if (p.money < BROKE || p.rentDebt > 0) {
    let sun = day; while (!isSunday(sun)) sun++;
    kp.flags.sharedMeal = sun;
    report.codes.push('shared_meal');
    report.notes.push(sun === day ? 'Tối nay Chủ nhật có cơm chung ở văn phòng khu phố, 17h-20h. Cứ ghé.' : `Tối Chủ nhật (${dateOf(sun).short}) có cơm chung ở văn phòng khu phố. Cô Nga để phần.`);
  }

  // 9. papers: BHYT through a job held ≥ 30 days; police check of tạm trú in December
  if (kp.job && !p.bhyt && day - kp.job.since >= 30) { p.bhyt = 'job'; report.notes.push(`Làm đủ một tháng ở ${placeShort(kp.job.placeId)}: được đóng BHYT qua nơi làm. ${LAW_NOTE}`); report.law = true; }
  const dd = dateOf(day);
  if (dd.m === 12 && dd.d === 8) {
    events.push({ type: 'police_check' });
    if (!p.tamTru) {
      report.codes.push('tamtru_warning');
      kp.flags.bienban = [...(kp.flags.bienban || []), { day, text: 'Anh Thuận nhắc nhở vì chưa đăng ký tạm trú (cảnh cáo, chưa phạt)' }];
      report.notes.push(`Công an phường kiểm tra tạm trú: anh Thuận nhắc nhở, ghi vào "Biên bản khu phố". Đăng ký trên VNeID là xong. ${LAW_NOTE}`);
      report.law = true;
    }
  }

  // 10. tomorrow
  report.tomorrow.push(...newsFor(kp.economy, day));
  for (const e of events) {
    if (e.type === 'calendar') report.tomorrow.push(`Mai: ${e.name}.`);
    if (e.type === 'price' && e.text) report.tomorrow.push(`${e.text}.`);
    if (e.type === 'outage_notice' && e.day > day) report.tomorrow.push(`Điện lực báo ${outageText(e)} ngày ${dateOf(e.day).short}.`);
  }
  for (const o of outagesOn(kp.economy, day + 1)) if (!o.sudden) report.tomorrow.push(`Ngày kia ${outageText(o)}: quán nào có tủ đông thì trữ đá từ tối mai.`);
  if (isRentDay(day + 1)) report.tomorrow.push('Ngày kia mùng 5: tiền phòng, điện, nước.');
  report.tomorrow = [...new Set(report.tomorrow)].slice(0, 6);
  report.weather = WEATHER_LABEL[kp.economy.weather];

  // 11. week summary on Saturday night
  if (dateOf(endedDay).weekday === 6) {
    const week = kp.ledger.filter((l) => l.day > endedDay - 7 && l.day <= endedDay);
    report.week = { in: week.filter((l) => l.v > 0).reduce((s, l) => s + l.v, 0), out: -week.filter((l) => l.v < 0).reduce((s, l) => s + l.v, 0) };
  }

  report.needs = { ...p.needs };
  report.money.end = p.money;
  report.money.rentDebt = p.rentDebt;
  report.money.net = report.money.in.reduce((s, l) => s + l.v, 0) + report.money.out.reduce((s, l) => s + l.v, 0);
  syncProfile(kp.profile, p);
  startDay(kp, events);
  return report;
}

// ---------- read helpers for the HUD ----------
export function status(kp) {
  const t = realTime(kp.time);
  const d = dateOf(t.day);
  return {
    day: kp.time.day, date: dateOf(kp.time.day).label, clock: clockLabel(kp.time.min), late: kp.time.min >= 1440,
    weekday: d.weekday, money: kp.player.money, rentDebt: kp.player.rentDebt, needs: { ...kp.player.needs },
    low: Object.entries(kp.player.needs).filter(([, v]) => v < NEED_LOW).map(([k]) => k),
    weather: kp.economy.weather, weatherLabel: WEATHER_LABEL[kp.economy.weather], outage: outageAt(kp.economy, kp.time.day, kp.time.min),
    unread: kp.xomoi.unread, job: kp.job, mustSleep: !!kp.flags.mustSleep,
  };
}
export function markXomoiRead(kp) { for (const m of kp.xomoi.msgs) if (m.delivered) m.seen = true; kp.xomoi.unread = 0; return kp; }
/** Delivered messages, newest last. */
export const xomoiFeed = (kp) => kp.xomoi.msgs.filter((m) => m.delivered);
export { priceOf, weatherOf, hourLabel };
