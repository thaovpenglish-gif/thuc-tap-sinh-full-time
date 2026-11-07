// Khu phố T&M · Trà Sữa Full Topping: pure, deterministic shop simulation (design 4.2, tests T3-T9).
// No DOM, no Three.js, never Math.random: every random choice comes from rng(hashSeed(shop.seed, ...)).
// The shop state is JSON-safe (it is saved inside kp.shops.trasua).
//
// Time: { day, min } with day 1 = Thứ Hai 02/11/2026, min = minutes since 00:00. Inside the shop, times that must
// survive midnight (pearl batches, deliveries) are stored as "absolute minutes": absMin(day, min).
//
// ctx (what the shop needs from the outside world; everything is optional):
//   { day, min,                      game time (falls back to kp.time)
//     priceOf(ingredientId) → VND per kg (or per unit for 'ly'/'tem'); ignored when missing or wildly off the base
//     demand(group, min, day) → multiplier ≥ 0 for 'hocsinh'|'vanphong'|'cudan'|'app'|'khachvanglai'. The shop applies
//                                its own hour profile (design 4.2.d): a demand() that honours (min, day) is divided by
//                                the economy's usual hour shape (weather, payday, Tết survive); one that only knows
//                                "now" is ignored and weather + calendar (payday, weekend) are used instead
//     outage: boolean               power cut right now (ice melts during the shift)
//     weather: 'sun'|'rain'|'heavy'|'hot'   optional; rain = counter -40%, app +60% (only if demand() is absent)
//     mood, energy: 0..100          optional player needs (tips, mini-game tolerance)
//     certs: string[]               optional player certificates ('khamsuckhoe', 'attp') for rank checks
//     hearts: { thinh: n }          optional friendship (anh Thịnh 3 tim = gối đầu)
//     rank: n                       optional override of the player's rank at the shop }
// Every exported function that takes `kp` also accepts a ctx object in its place, so tests need no world state.
import { rng as mkRng, hashSeed } from './rng.js';
import {
  INGREDIENTS, SIZES, SUGAR_STEPS, ICE_STEPS, TEAS, MILKS, SUGAR, ICE, CUP, LABEL, PEARLS, PEARL_FRESH_MIN,
  PEARL_HARD_MIN, TOPPINGS, EXTRA_TOPPINGS, EXTRA_TOPPING_PRICE, MENU, MENU_ORDER, TASTES, SLOTS, PATIENCE, NOTES,
  CLIENT_NAMES,
} from '../data/teamenu.js';
import { SUPPLIER } from '../data/suppliers.js';
import { CHANNEL, MAX_CHANNELS } from '../data/channels.js';

export const PLACE_ID = 'trasua';
export const PLACE_NAME = 'Trà Sữa Full Topping';
export const LAW_NOTE = '(thông tin giải trí, không phải tư vấn pháp lý)';
export const OPEN_MIN = 9 * 60, CLOSE_MIN = 22 * 60;
export const DAY_CUPS = 160;           // a normal day of the whole shop (design 4.2.i, [số thiết kế])
export const TAX_THRESHOLD = 1_000_000_000;
export const MIN_WAGE_HOUR = 25_500;   // vùng I 2026 (Nghị định 293/2025)
export const SHIFTS = [
  { id: 'sang', name: 'Ca sáng', start: 9 * 60, end: 13 * 60 },
  { id: 'chieu', name: 'Ca chiều', start: 14 * 60, end: 18 * 60 },
  { id: 'toi', name: 'Ca tối', start: 18 * 60, end: 22 * 60 },
];

/** Ranks of design 4.2.k. `need` = what it takes to REACH this rank. Ranks 6a/6b are phase 2 (shown, locked). */
export const RANKS = [
  { id: 1, key: 'hocviec', name: 'Học việc', wage: 25_500, need: {}, unlock: 'Pha 4 món cơ bản. 3 ca đầu Tú làm mẫu ly đầu.' },
  { id: 2, key: 'nhanvien', name: 'Nhân viên', wage: 26_000, wageEvening: 30_000, need: { shifts: 3, days: 8, avg: 60 }, unlock: 'Đủ thực đơn, % đường, % đá, nhận tip' },
  { id: 3, key: 'chinh', name: 'Nhân viên chính', wage: 28_000, need: { days: 20, avg: 75, cert: 'khamsuckhoe' }, unlock: 'Đơn app, nấu trân châu đúng lịch, được nhờ đi nhập hàng (chợ, Ba & Má, tiện lợi)' },
  { id: 4, key: 'catruong', name: 'Ca trưởng', wage: 32_000, revenuePct: 0.01, need: { days: 40, avg2w: 75, cert: 'attp', trained: true }, unlock: 'Tự nhập hàng 5 nơi, nhờ Bông làm hộ ly, chốt ca, xem lời lỗ' },
  { id: 5, key: 'quanly', name: 'Quản lý cửa hàng', monthly: 12_000_000, wage: Math.round(12_000_000 / 208), need: { days: 60, foodCost: 0.35, stars: 4.3 }, unlock: 'Kênh truyền thông, giá, lịch nhân viên' },
  { id: 6, key: 'moquan', name: 'Mở quán riêng', phase2: true, need: { capital: 80_000_000 }, unlock: 'Thực đơn riêng, tên quán riêng (giai đoạn 2)', text: 'Vốn tự xây thương hiệu 150-170 triệu, hoặc nhận lại cả bộ cửa hàng khoảng 80 triệu' },
  { id: 7, key: 'gopvon', name: 'Góp vốn chi nhánh 2 với chị Nhung', phase2: true, need: { hearts: 4 }, unlock: 'Chia lời 40% (giai đoạn 2)', text: 'Thân chị Nhung 4 tim' },
];
export const RANK = Object.fromEntries(RANKS.map((r) => [r.id, r]));
export const GRADE_MIN = { A: 90, B: 75, C: 60 };
const CERT_ALIASES = { khamsuckhoe: ['khamsuckhoe', 'giaykhamsuckhoe', 'health', 'kham_suc_khoe'], attp: ['attp', 'antoanthucpham', 'food_safety', 'xacnhanattp'] };

// ------------------------------------------------------------------------------------------------ small helpers
export const absMin = (day, min) => (day - 1) * 1440 + min;
export const splitAbs = (a) => ({ day: Math.floor(a / 1440) + 1, min: ((a % 1440) + 1440) % 1440 });
export const weekdayOf = (day) => ((day % 7) + 7) % 7; // 0 = Chủ nhật; day 1 = Thứ Hai
const DAY1_UTC = Date.UTC(2026, 10, 2);
export function dateOfDay(day) { const d = new Date(DAY1_UTC + (day - 1) * 86_400_000); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() }; }
export const yearOf = (day) => dateOfDay(day).y;
export const roundK = (v) => Math.round(v / 1000) * 1000;
const round100 = (v) => Math.round(v / 100) * 100;
const vn = (x) => String(Math.round(x * 10) / 10).replace('.', ',');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const fmtMoney = (v) => `${v < 0 ? '−' : ''}${Math.abs(Math.round(v)).toLocaleString('vi-VN').replace(/,/g, '.')}đ`;
export const fmtTime = (min) => { const m = ((Math.round(min) % 1440) + 1440) % 1440; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };
export const gradeOf = (p) => (p >= GRADE_MIN.A ? 'A' : p >= GRADE_MIN.B ? 'B' : p >= GRADE_MIN.C ? 'C' : 'D');
const snapTo = (steps, v) => steps.reduce((b, s) => (Math.abs(s - v) < Math.abs(b - v) ? s : b), steps[0]);
function weighted(r, ids, weights) {
  const list = ids.map((id) => [id, Math.max(0, (weights && weights[id]) || 1)]);
  const tot = list.reduce((a, x) => a + x[1], 0);
  let u = r() * tot;
  for (const [id, w] of list) { if ((u -= w) < 0) return id; }
  return list[list.length - 1][0];
}
const pickR = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

// ------------------------------------------------------------------------------------------------ ctx
let ECON = null;
/** Optional: bind builder A's economy module (sim/economy.js) so a kp without ctx still gets prices and demand. */
export function useEconomy(mod) { ECON = mod && typeof mod === 'object' ? mod : null; }
/** Build a ctx from kp + an economy module (same shape as above). */
export function ctxFromKp(kp, econ = ECON) {
  const t = (kp && kp.time) || { day: 1, min: OPEN_MIN };
  const c = { day: t.day, min: t.min };
  if (econ && kp && kp.economy) {
    if (econ.priceOf) c.priceOf = (id) => econ.priceOf(kp.economy, id);
    if (econ.demand) c.demand = (g, min = t.min, day = t.day) => econ.demand(kp.economy, day, min, g);
    if (econ.outageAt) { try { c.outage = !!econ.outageAt(kp.economy, t.day, t.min); } catch { /* optional */ } }
  }
  if (kp && kp.economy && kp.economy.weather && (kp.economy.day == null || kp.economy.day === t.day)) c.weather = kp.economy.weather;
  const p = kp && kp.player;
  if (p) { if (p.needs) { c.mood = p.needs.mood; c.energy = p.needs.energy; } if (Array.isArray(p.certs)) c.certs = p.certs; }
  return c;
}
/** Merge (kp | ctx) and an explicit ctx into one ctx with day/min/weekday always set. */
export function resolveCtx(kp, ctx) {
  const looksCtx = kp && !kp.time && Number.isFinite(kp.day);
  const base = looksCtx ? { ...kp } : ctxFromKp(kp);
  const c = { ...base, ...(ctx || {}) };
  if (!Number.isFinite(c.day)) c.day = 1;
  if (!Number.isFinite(c.min)) c.min = OPEN_MIN;
  c.weekday = weekdayOf(c.day);
  if (!c.certs && kp && kp.player && Array.isArray(kp.player.certs)) c.certs = kp.player.certs;
  return c;
}
function priceFor(c, id) {
  const base = INGREDIENTS[id].price;
  try { const p = c && c.priceOf ? Number(c.priceOf(id)) : NaN; if (Number.isFinite(p) && p >= base * 0.3 && p <= base * 3) return Math.round(p); } catch { /* ignore */ }
  return base;
}
// The hour-of-day profile the economy's demand() typically carries (school weekday). The shop applies its own
// profile (design 4.2.d), so a time-shaped demand() is divided by this to keep only weather, payday, Tết, outages.
const REF_SHAPE = {
  vanphong: [[420, 510, 0.8], [510, 690, 0.5], [690, 810, 2.6], [810, 1050, 0.6], [1050, 1140, 0.9], [1140, 1320, 0.25]],
  hocsinh: [[360, 435, 1.2], [435, 960, 0.05], [960, 1050, 3.2], [1050, 1260, 0.8]],
  cudan: [[300, 540, 1], [540, 690, 0.8], [690, 810, 0.7], [810, 960, 0.5], [960, 1050, 0.8], [1050, 1140, 1.1], [1140, 1320, 2], [1320, 1440, 0.5]],
  app: [[390, 630, 0.6], [630, 810, 1.8], [810, 1020, 0.6], [1020, 1260, 1.6], [1260, 1380, 0.8]],
  khachvanglai: [[360, 1320, 1]],
};
const refShape = (g, m) => { for (const [a, b, v] of REF_SHAPE[g] || []) if (m >= a && m < b) return v; return 0.05; };
/** Demand multiplier (≈ 1 on a normal day) for a group at minute `min` of ctx.day. */
function demandOf(c, group, min) {
  if (c && c.demand) {
    try {
      if (c._shaped == null) c._shaped = Number(c.demand('hocsinh', 600, c.day)) !== Number(c.demand('hocsinh', 1000, c.day));
      if (c._shaped) { const v = Number(c.demand(group, min, c.day)); if (Number.isFinite(v) && v >= 0) return clamp(v / refShape(group, min), 0.3, 2.5); }
      // a demand() that only knows "now" carries the hour profile of now: ignore it, use weather + calendar below
    } catch { /* ignore */ }
  }
  let v = 1;
  const w = c && c.weather;
  if (w === 'rain') v *= group === 'app' ? 1.6 : 0.6;
  else if (w === 'heavy') v *= group === 'app' ? 1.9 : 0.45;
  else if (w === 'hot') v *= 1.25;
  const day = c && Number.isFinite(c.day) ? c.day : 1;
  const wd = weekdayOf(day), dm = dateOfDay(day).d;
  if ((wd === 0 || wd === 6) && (group === 'hocsinh' || group === 'vanphong')) v *= group === 'hocsinh' ? 0.4 : 0.3;
  if (group !== 'hocsinh') { if (dm >= 1 && dm <= 5) v *= 1.15; else if (dm >= 25) v *= 0.9; } // lương 7 công ty về ngày 30
  if (c && c.outage) v *= 0.85;
  return v;
}
const hasCert = (certs, key) => Array.isArray(certs) && certs.some((x) => CERT_ALIASES[key].includes(String(x).toLowerCase()));

// ------------------------------------------------------------------------------------------------ shop state
/** createTeaShop(seed, { day }) → JSON-safe shop state. Stock starts at chị Nhung's par levels. */
export function createTeaShop(seed = 1, opts = {}) {
  const day = opts.day || 1;
  const shop = {
    v: 1, id: PLACE_ID, seed: (typeof seed === 'number' ? seed : hashSeed(seed)) >>> 0,
    cash: 20_000_000,
    stock: {}, lots: {}, avgCost: {},
    pearls: [],       // cooked batches [{ id, kind, cookedMin (abs, ready time), grams, costPerG }]
    deliveries: [],   // [{ id, supplierId, items:{ing:grams}, cost, etaDay, etaMin, missing:[], status }]
    channels: { app: { since: day, until: null, boost: { app: 1 } } }, // chị Nhung already sells on the apps
    rating: { stars: 4.2, hist: [] },
    days: {}, yearRevenue: {},
    tax: { overYear: null, rateFrom: null, reminded: [] },
    me: { rank: 1, shifts: 0, days: [], scores: [], trainedBong: false, trainNext: false, certs: [] },
    autoRestock: true, lastClosed: day - 1, seq: 0, log: [], flags: {}, prices: {},
  };
  for (const [id, ing] of Object.entries(INGREDIENTS)) { shop.stock[id] = 0; shop.avgCost[id] = ing.price; addStock(shop, id, ing.par, day); }
  return shop;
}
const nextId = (shop, p) => `${p}${++shop.seq}`;
const unitCost = (shop, id, amount) => (INGREDIENTS[id].unit === 'g' ? (shop.avgCost[id] || INGREDIENTS[id].price) * amount / 1000 : (shop.avgCost[id] || INGREDIENTS[id].price) * amount);

export function addStock(shop, id, amount, day, pricePerUnit) {
  if (!INGREDIENTS[id] || !(amount > 0)) return;
  const had = shop.stock[id] || 0;
  if (Number.isFinite(pricePerUnit)) shop.avgCost[id] = Math.round(((shop.avgCost[id] || pricePerUnit) * had + pricePerUnit * amount) / (had + amount));
  shop.stock[id] = had + amount;
  const sd = INGREDIENTS[id].shelfDays;
  if (sd) { (shop.lots[id] = shop.lots[id] || []).push({ g: amount, exp: day + sd - 1 }); }
}
function takeStock(shop, id, amount) {
  shop.stock[id] = Math.max(0, (shop.stock[id] || 0) - amount);
  const lots = shop.lots[id];
  if (lots) { let left = amount; while (left > 0 && lots.length) { const l = lots[0]; const t = Math.min(l.g, left); l.g -= t; left -= t; if (l.g <= 0) lots.shift(); } }
}
/** Throw away lots that expired by the end of `day` → { cost, notes[] }. */
export function expireLots(shop, day) {
  let cost = 0; const notes = [];
  for (const [id, lots] of Object.entries(shop.lots)) {
    let g = 0;
    while (lots.length && lots[0].exp <= day) g += lots.shift().g;
    if (g > 0) { const v = Math.round(unitCost(shop, id, g)); cost += v; shop.stock[id] = Math.max(0, (shop.stock[id] || 0) - g); notes.push(`${INGREDIENTS[id].name} hết hạn ${g >= 1000 ? `${vn(g / 1000)} kg` : `${g} g`}`); }
  }
  return { cost, notes };
}

// ------------------------------------------------------------------------------------------------ pearls
/** 'cooking' (not ready yet) | 'fresh' (≤ 4 h) | 'ok' (≤ 8 h) | 'hard' (> 8 h). Times in absolute minutes
 *  (or plain minutes of the same day: only the difference matters). */
export function pearlState(batch, nowMin) {
  if (!batch) return null;
  const age = nowMin - batch.cookedMin;
  if (age < 0) return 'cooking';
  if (age <= PEARL_FRESH_MIN) return 'fresh';
  if (age <= PEARL_HARD_MIN) return 'ok';
  return 'hard';
}
/** Start cooking a batch at absolute minute `at` (ready cookMin later unless opts.ready). → batch | null. */
export function cookPearls(shop, kind, at, opts = {}) {
  const P = PEARLS[kind]; if (!P) return null;
  const wantCooked = opts.grams || P.batch;
  const dry = Math.min(shop.stock[P.dry] || 0, Math.ceil(wantCooked / P.ratio));
  if (dry < 25) return null;
  const costPerG = (shop.avgCost[P.dry] || INGREDIENTS[P.dry].price) / 1000 / P.ratio;
  takeStock(shop, P.dry, dry);
  const batch = { id: nextId(shop, 'p'), kind, cookedMin: opts.ready ? at : at + P.cookMin, grams: dry * P.ratio, costPerG: Math.round(costPerG * 1000) / 1000 };
  shop.pearls.push(batch);
  const { day, min } = splitAbs(at);
  const rec = dayRec(shop, day);
  const band = powerBand(day, min);
  rec.kwh[band] = Math.round((rec.kwh[band] + 0.5) * 10) / 10; // the pot draws ~0.5 kWh [số thiết kế]
  return batch;
}
/** The batch a scoop comes from: oldest ready batch that is not hard; if every ready batch is hard, the hard one. */
export function activeBatch(shop, kind, at, need = 1) {
  const ready = shop.pearls.filter((b) => b.kind === kind && b.grams >= need && pearlState(b, at) !== 'cooking').sort((a, b) => a.cookedMin - b.cookedMin);
  return ready.find((b) => pearlState(b, at) !== 'hard') || ready[0] || null;
}
/** Pour out batches (default: only the hard ones) → { cost, grams }. */
export function discardPearls(shop, at, opts = {}) {
  let cost = 0, grams = 0;
  shop.pearls = shop.pearls.filter((b) => {
    const drop = (!opts.kind || b.kind === opts.kind) && (opts.all || pearlState(b, at) === 'hard');
    if (drop) { cost += Math.round(b.grams * b.costPerG); grams += b.grams; }
    return !drop;
  });
  return { cost, grams };
}
function pearlAvail(shop, kind) {
  const P = PEARLS[kind];
  return shop.pearls.filter((b) => b.kind === kind).reduce((a, b) => a + b.grams, 0) + (shop.stock[P.dry] || 0) * P.ratio;
}

// ------------------------------------------------------------------------------------------------ cups & stock
/** Exact amounts a cup uses → { ings: { id: grams|units }, pearls: { kind: grams } }. */
export function cupNeeds(cup) {
  const ings = {}, pearls = {};
  if (!cup || !SIZES[cup.size]) return { ings, pearls };
  const mul = SIZES[cup.size].mul;
  const add = (id, v) => { if (v > 0) ings[id] = (ings[id] || 0) + v; };
  add(CUP.ing, CUP.n);
  if (cup.labeled) add(LABEL.ing, LABEL.n);
  if (cup.tea && TEAS[cup.tea]) add(TEAS[cup.tea].ing, Math.round(TEAS[cup.tea].g * mul));
  if (cup.milk && MILKS[cup.milk]) add(MILKS[cup.milk].ing, Math.round(MILKS[cup.milk].g * mul));
  if (cup.sugar > 0) add(SUGAR.ing, Math.round(SUGAR.g * snapTo(SUGAR_STEPS, cup.sugar) / 100 * mul));
  if (cup.ice > 0) add(ICE.ing, Math.round(ICE.g * snapTo(ICE_STEPS, cup.ice) / 100 * mul));
  for (const t of cup.toppings || []) {
    const T = TOPPINGS[t]; if (!T) continue;
    if (T.pearl) pearls[T.pearl] = (pearls[T.pearl] || 0) + T.g; else add(T.ing, T.g);
    if (T.extra) for (const [k, v] of Object.entries(T.extra)) add(k, v);
  }
  return { ings, pearls };
}
/** Ingredient cost of a cup at average purchase prices (no stock change). */
export function cupCost(shop, cup) {
  const { ings, pearls } = cupNeeds(cup);
  let v = 0;
  for (const [id, a] of Object.entries(ings)) v += unitCost(shop, id, a);
  for (const [kind, g] of Object.entries(pearls)) v += (shop.avgCost[PEARLS[kind].dry] || INGREDIENTS[PEARLS[kind].dry].price) / 1000 / PEARLS[kind].ratio * g;
  return Math.round(v);
}
/** Deduct the exact recipe amounts of `cup` (design 4.2.f, T4). Nothing is taken unless everything is there.
 *  at = absolute minute (picks the pearl batch). → { ok, missing[], cost, pearl: worst pearl state used | null } */
export function useStock(shop, cup, at = Infinity) {
  const { ings, pearls } = cupNeeds(cup);
  const missing = [];
  for (const [id, a] of Object.entries(ings)) if ((shop.stock[id] || 0) < a) missing.push(id);
  const plan = [];
  for (const [kind, g] of Object.entries(pearls)) {
    const b = activeBatch(shop, kind, at, g);
    if (!b) missing.push(`pearl_${kind}`); else plan.push([b, g]);
  }
  if (missing.length) return { ok: false, missing, cost: 0, pearl: null };
  let cost = 0, pearl = null;
  const rank = { fresh: 0, ok: 1, hard: 2 };
  for (const [id, a] of Object.entries(ings)) { cost += unitCost(shop, id, a); takeStock(shop, id, a); }
  for (const [b, g] of plan) {
    b.grams -= g; cost += b.costPerG * g;
    const st = pearlState(b, at === Infinity ? b.cookedMin : at);
    if (pearl == null || rank[st] > rank[pearl]) pearl = st;
  }
  shop.pearls = shop.pearls.filter((b) => b.grams > 0);
  return { ok: true, missing: [], cost: Math.round(cost), pearl };
}
/** Which menu items can be made right now (an out-of-stock ingredient greys every item that uses it, T4). */
export function menuAvailability(shop) {
  const out = {};
  for (const id of MENU_ORDER) {
    const m = MENU[id];
    const { ings, pearls } = cupNeeds({ size: (m.sizes || ['M'])[0], tea: m.tea, milk: m.milk, sugar: 0, ice: 0, toppings: m.toppings });
    const missing = [];
    for (const [ing, a] of Object.entries(ings)) if ((shop.stock[ing] || 0) < a) missing.push(ing);
    for (const [kind, g] of Object.entries(pearls)) if (pearlAvail(shop, kind) < g) missing.push(PEARLS[kind].dry);
    out[id] = { ok: missing.length === 0, missing };
  }
  return out;
}
/** Can one portion of a station's ingredient be added right now? (UI greys the tile otherwise.) */
export function canPortion(shop, part, size = 'M', at = Infinity) {
  const mul = (SIZES[size] || SIZES.M).mul;
  if (part.topping) {
    const T = TOPPINGS[part.topping];
    if (T.pearl) return !!activeBatch(shop, T.pearl, at, T.g);
    return (shop.stock[T.ing] || 0) >= T.g;
  }
  if (part.tea) return (shop.stock[TEAS[part.tea].ing] || 0) >= Math.round(TEAS[part.tea].g * mul);
  if (part.milk) return (shop.stock[MILKS[part.milk].ing] || 0) >= Math.round(MILKS[part.milk].g * mul);
  if (part.cup) return (shop.stock.ly || 0) >= 1;
  if (part.label) return (shop.stock.tem || 0) >= 1;
  if (part.sugar) return (shop.stock.duong || 0) >= Math.round(SUGAR.g * mul);
  if (part.ice) return (shop.stock.da || 0) >= Math.round(ICE.g * part.ice / 100 * mul);
  return true;
}

// ------------------------------------------------------------------------------------------------ scoring
/** The perfect cup for an order (what the debug key returns). */
export function answerFor(order) {
  const m = MENU[order.item];
  return { size: order.size, toppings: [...order.toppings], tea: m.tea, milk: m.milk, sugar: order.sugar, ice: order.ice, shaken: true, sealed: true, labeled: true };
}
/** Score one cup (design 4.2.e). Six points: size, base (tea + milk), toppings, sugar % (one notch off = half a
 *  point), ice % (same), lid. points = raw / 6 x 100, then: not shaken -5, no label -3 (app -10), pearls over 8 h -25.
 *  → { points 0..100, raw 0..6, grade, faults[] } */
export function scoreCup(order, cup) {
  const faults = [];
  if (!cup || !SIZES[cup.size]) return { points: 0, raw: 0, grade: 'D', faults: ['Chưa có ly'] };
  const want = MENU[order.item] || {};
  let raw = 0;
  if (cup.size === order.size) raw += 1; else faults.push(`Sai size (khách gọi ${order.size})`);
  const teaOk = (cup.tea || null) === (want.tea || null), milkOk = (cup.milk || null) === (want.milk || null);
  if (teaOk && milkOk) raw += 1; else faults.push(!teaOk ? 'Sai trà nền' : 'Sai sữa nền');
  const need = [...order.toppings], got = [...(cup.toppings || [])];
  let wrong = 0;
  for (const t of need) { const i = got.indexOf(t); if (i >= 0) got.splice(i, 1); else wrong++; }
  wrong += got.length;
  raw += Math.max(0, 1 - 0.5 * wrong);
  if (wrong) faults.push(`Topping sai ${wrong} muỗng`);
  const sd = Math.abs(SUGAR_STEPS.indexOf(snapTo(SUGAR_STEPS, cup.sugar || 0)) - SUGAR_STEPS.indexOf(snapTo(SUGAR_STEPS, order.sugar)));
  raw += Math.max(0, 1 - 0.5 * sd);
  if (sd) faults.push(`Đường lệch ${sd} nấc`);
  const id = Math.abs(ICE_STEPS.indexOf(snapTo(ICE_STEPS, cup.ice || 0)) - ICE_STEPS.indexOf(snapTo(ICE_STEPS, order.ice)));
  raw += Math.max(0, 1 - 0.5 * id);
  if (id) faults.push(`Đá lệch ${id} nấc`);
  if (cup.sealed === true) raw += 1; else if (cup.sealed === 'wrinkled') { raw += 0.5; faults.push('Nắp nhăn, dễ đổ'); } else faults.push('Chưa dập nắp');
  let points = raw / 6 * 100;
  if (!cup.shaken) { points -= 5; faults.push('Chưa lắc, đường lắng đáy'); }
  if (!cup.labeled) { points -= order.source === 'app' ? 10 : 3; faults.push(order.source === 'app' ? 'Không dán tem, tài xế cầm nhầm' : 'Quên dán tem'); }
  if (cup.pearl === 'hard') { points -= 25; faults.push('Trân châu quá 8 giờ: "nhai như bi"'); }
  points = clamp(points, 0, 100);
  return { points, raw, grade: gradeOf(points), faults };
}

// ------------------------------------------------------------------------------------------------ prices
export function itemPrice(shop, item, size) {
  const m = MENU[item]; const p = (shop && shop.prices && shop.prices[item] && shop.prices[item][size]) || m.price[size] || m.price.L;
  return p;
}
export const appPriceOf = (price) => roundK(price * CHANNEL.app.appMarkup);
/** What the shop really gets from one app order (design 4.2.h, T7): gross − commission − 10% VAT on it − voucher. */
export function appNet(gross, commissionRate = CHANNEL.app.commission, voucher = CHANNEL.app.voucher) {
  const fee = Math.round(gross * commissionRate);
  return gross - fee - Math.round(fee * 0.1) - voucher;
}

// ------------------------------------------------------------------------------------------------ demand
const slotAt = (min) => SLOTS.find((s) => min >= s.from && min < s.to) || null;
export const groupAt = (min) => (slotAt(min) || { group: 'khachvanglai' }).group;
/** Share of the day's cups per game minute at `min` (design 4.2.d). The 16:00 school wave is packed into 16:05-16:35. */
export function densityAt(min) {
  const s = slotAt(min); if (!s) return 0;
  const base = s.share / (s.to - s.from);
  if (s.group === 'hocsinh') { const inWave = min >= 16 * 60 + 5 && min < 16 * 60 + 35; return inWave ? s.share * 0.7 / 30 : s.share * 0.3 / 60; }
  return base;
}
export function starMult(stars) { return clamp(0.7 + (stars - 3) / 1.8 * 0.6, 0.6, 1.35); }
export function activeChannels(shop, day) {
  return Object.entries(shop.channels || {}).filter(([, ch]) => ch && (ch.until == null || ch.until >= day) && ch.since <= day).map(([id]) => id);
}
export function channelMult(shop, group, day) {
  let m = 1;
  for (const id of activeChannels(shop, day)) {
    if (id === 'app') continue;
    const ch = shop.channels[id];
    let b = ((ch.boost && ch.boost[group]) || 0) + ((ch.boost && ch.boost.all) || 0);
    if (ch.decay && ch.until != null) { const span = ch.until - ch.since + 1; b *= 1 - (day - ch.since) / span * 0.6; }
    m *= Math.max(0.2, 1 + b);
  }
  return m;
}
const appOn = (shop, day) => activeChannels(shop, day).includes('app');
function appShare(shop, c, min) {
  if (!appOn(shop, c.day)) return 0;
  const counter = demandOf(c, groupAt(min), min), app = demandOf(c, 'app', min);
  const base = 0.25; // 40 of 160 cups on a normal day (design 4.2.i)
  return clamp(base * app / (base * app + (1 - base) * Math.max(0.05, counter)), 0, 0.85);
}

// ------------------------------------------------------------------------------------------------ the shift
/** openShift(shop, kp|ctx, { ctx, startMin, hours, rank, realSeconds }) → shift. Runs the opening checklist
 *  (cook/check pearls, brew tea, receive deliveries) and plans the customers for the 4 game hours. */
export function openShift(shop, kp, opts = {}) {
  const c = resolveCtx(kp, opts.ctx);
  catchUp(shop, c.day, c);
  const day = c.day;
  const startMin = Number.isFinite(opts.startMin) ? opts.startMin : c.min;
  const hours = opts.hours || 4;
  const endMin = startMin + hours * 60;
  const rank = opts.rank || c.rank || shop.me.rank || 1;
  const seed = hashSeed(shop.seed, day, startMin, 'shift', shop.me.shifts);
  const r = mkRng(seed);
  const startAbs = absMin(day, startMin);
  const events = [];
  for (const d of receiveDeliveries(shop, day, startMin)) events.push({ type: 'delivery', text: `${SUPPLIER[d.supplierId].name} đã giao hàng`, delivery: d.id });
  // Tú's morning batch (cooked at 9:00) is still in the pot for an afternoon/evening shift.
  for (const kind of Object.keys(PEARLS)) {
    const has = shop.pearls.some((b) => b.kind === kind && splitAbs(b.cookedMin).day === day);
    if (!has && startMin > OPEN_MIN) cookPearls(shop, kind, absMin(day, OPEN_MIN), { ready: true, grams: Math.round(PEARLS[kind].batch * 0.7) });
  }
  // opening checklist: a pot that is missing or already hard gets a fresh batch, ready when the doors open
  for (const kind of Object.keys(PEARLS)) {
    const b = activeBatch(shop, kind, startAbs, 50);
    if (!b || pearlState(b, startAbs) === 'hard') {
      const dp = discardPearls(shop, startAbs, { kind });
      if (dp.cost) { const rq = dayRec(shop, day); rq.wasteCost += dp.cost; rq.wasteNotes.push(`Đổ ${PEARLS[kind].name} quá 8 giờ`); }
      cookPearls(shop, kind, startAbs, { ready: true });
    }
  }
  const pace = rank <= 1 ? 0.18 : rank === 2 ? 0.24 : 0.28;
  const mood = Number.isFinite(c.mood) ? c.mood : 60;
  const arrivals = [];
  let acc = r(), k = 0;
  const stars = shop.rating.stars;
  for (let m = startMin; m < endMin; m++) {
    const g = groupAt(m);
    const lam = DAY_CUPS * densityAt(m) * pace * demandOf(c, g, m) * starMult(stars) * channelMult(shop, g, day);
    acc += lam;
    while (acc >= 1) {
      acc -= 1;
      const at = m + Math.floor(r() * 60) / 60;
      const source = rank >= 3 && r() < appShare(shop, c, m) ? 'app' : 'quay';
      const pair = source === 'quay' && g === 'vanphong' && m >= 11 * 60 + 30 && m < 13 * 60 + 30 && r() < 0.35 ? 2 : 1;
      arrivals.push({ k: k++, at: Math.round(at * 10) / 10, group: g, source, pair, done: false });
    }
  }
  // keep a 4-6 minute game playable: 6..22 tickets
  while (arrivals.length > 22) arrivals.splice(Math.floor(r() * arrivals.length), 1);
  while (arrivals.length < 6) { const at = startMin + 8 + Math.floor(r() * (hours * 60 - 30)); arrivals.push({ k: k++, at, group: groupAt(at), source: 'quay', pair: 1, done: false }); }
  arrivals.sort((a, b) => a.at - b.at || a.k - b.k);
  const chores = [];
  const chore = (kind, label, at, taps, extra = {}) => chores.push({ id: `c${chores.length + 1}`, kind, label, at, due: at + 40, taps, left: taps, status: 'wait', ...extra });
  chore('rua', 'Rửa bình lắc', startMin + 50, 3);
  if (16 * 60 >= startMin && 16 * 60 < endMin - 20) chore('viahe', 'Dọn bàn ghế vỉa hè (công an nhắc)', 16 * 60, 2);
  chore('lau', 'Lau quầy', startMin + 150, 3);
  for (const d of shop.deliveries) {
    if (d.status !== 'pending') continue;
    const eta = absMin(d.etaDay, d.etaMin);
    if (eta > startAbs && eta < absMin(day, endMin - 15)) chore('kynhan', `Ký nhận hàng: ${SUPPLIER[d.supplierId].name}`, d.etaMin, 2, { deliveryId: d.id });
  }
  chores.sort((a, b) => a.at - b.at);
  const shift = {
    id: nextId(shop, 's'), day, startMin, endMin, now: startMin, rank, seed, hours,
    arrivals, tickets: [], served: [], missed: [], chores, trashed: [], waste: 0, wasteNotes: [], seq: 0,
    outage: !!c.outage, weather: c.weather || null, mood, energy: Number.isFinite(c.energy) ? c.energy : 70,
    available: [], iceOk: true, alerts: {}, events, closed: false, bongBusy: null,
    prices: JSON.parse(JSON.stringify(shop.prices || {})),
  };
  refreshAvailable(shop, shift);
  return shift;
}
function refreshAvailable(shop, shift) {
  const av = menuAvailability(shop);
  shift.available = MENU_ORDER.filter((id) => av[id].ok);
  shift.iceOk = (shop.stock.da || 0) >= ICE.g * SIZES.L.mul;
  return av;
}
/** makeOrder(shift, r, at?, { group, source, client }) → one ticket (design 4.2.b difficulty by rank). */
export function makeOrder(shift, r, at = shift.now, opt = {}) {
  const rank = shift.rank || 1;
  const group = opt.group || groupAt(at);
  const source = opt.source || 'quay';
  let pool = (shift.available && shift.available.length ? shift.available : MENU_ORDER).filter((id) => rank >= 2 || MENU[id].basic);
  if (!pool.length) pool = MENU_ORDER.filter((id) => MENU[id].basic);
  const item = weighted(r, pool, TASTES[source === 'app' ? 'app' : group] || TASTES.cudan);
  const m = MENU[item];
  let size = m.sizes ? m.sizes[0] : r() < 0.4 ? 'L' : 'M';
  let sugar = rank < 2 ? 100 : weighted(r, ['0', '30', '50', '70', '100'], { 0: 0.5, 30: 1.5, 50: 3, 70: 3.5, 100: 2 }) * 1;
  let ice = rank < 2 ? 100 : weighted(r, ['0', '50', '100'], { 0: 1, 50: 3.5, 100: 5.5 }) * 1;
  const toppings = [...m.toppings];
  if (rank >= 2 && item !== 'fulltopping' && r() < 0.25) { const ex = EXTRA_TOPPINGS.filter((t) => !toppings.includes(t)); if (ex.length) toppings.push(pickR(r, ex)); }
  if (rank >= 3 && item !== 'fulltopping' && r() < 0.1) { const ex = EXTRA_TOPPINGS.filter((t) => !toppings.includes(t)); if (ex.length) toppings.push(pickR(r, ex)); }
  let note = null;
  let client = opt.client || (source === 'app' ? `${pickR(r, CLIENT_NAMES.app)}${100 + Math.floor(r() * 900)}` : pickR(r, CLIENT_NAMES[group] || CLIENT_NAMES.cudan));
  if (rank >= 2 && r() < 0.15) {
    const n = pickR(r, NOTES); note = n.text;
    if (n.sugar != null) sugar = n.sugar;
    if (n.ice != null) ice = n.ice;
    if (n.size && !m.sizes) size = n.size;
  }
  if (client === 'Khang (T&M)') { sugar = 100; note = note || 'như mọi ngày: 100% đường'; }
  if (shift.iceOk === false) { ice = 0; note = note || 'hết đá, khách chịu uống không đá'; }
  const slot = slotAt(Math.floor(at));
  let patience = source === 'app' ? PATIENCE.app : PATIENCE[(slot && slot.patience) || 'cao'];
  if (rank < 2) patience = Math.round(patience * 1.3);
  const extras = toppings.length - m.toppings.length;
  const price = itemPrice({ prices: shift.prices }, item, size) + extras * EXTRA_TOPPING_PRICE;
  const order = { id: `o${++shift.seq}`, item, size, sugar, ice, toppings, patience, source, client, note, at, group, price };
  if (source === 'app') { order.appPrice = appPriceOf(price); order.voucher = r() < CHANNEL.app.voucherShare ? CHANNEL.app.voucher : 0; }
  return order;
}
/** Advance the shift clock to nowMin (game minutes of shift.day). → events[] */
export function shiftTick(shop, shift, nowMin) {
  const ev = [];
  if (shift.closed) return ev;
  const prev = shift.now;
  shift.now = Math.max(shift.now, nowMin);
  const now = shift.now, nowAbs = absMin(shift.day, now);
  for (const a of shift.arrivals) {
    if (a.done || a.at > now) continue;
    a.done = true;
    if (a.at >= shift.endMin) continue;
    refreshAvailable(shop, shift);
    const r = mkRng(hashSeed(shift.seed, 'order', a.k));
    const first = makeOrder(shift, r, a.at, { group: a.group, source: a.source });
    shift.tickets.push(first); ev.push({ type: 'arrive', order: first });
    for (let i = 1; i < a.pair; i++) { const o = makeOrder(shift, r, a.at, { group: a.group, source: a.source, client: first.client }); o.note = o.note || `ly ${i + 1} của ${first.client}`; shift.tickets.push(o); ev.push({ type: 'arrive', order: o }); }
  }
  for (const t of [...shift.tickets]) {
    if (now > t.at + t.patience) {
      shift.tickets.splice(shift.tickets.indexOf(t), 1);
      shift.missed.push({ ...t, missedAt: now });
      ev.push({ type: 'leave', order: t, text: t.source === 'app' ? `Tài xế hủy đơn ${t.client}` : `${t.client} bỏ về` });
    }
  }
  for (const ch of shift.chores) {
    if (ch.status === 'wait' && now >= ch.at) { ch.status = 'open'; ev.push({ type: 'chore', chore: ch, text: ch.label }); }
    if (ch.status === 'open' && now > ch.due) { ch.status = 'missed'; ev.push({ type: 'chore_missed', chore: ch, text: `Chưa làm: ${ch.label}` }); }
  }
  for (const kind of Object.keys(PEARLS)) {
    const b = activeBatch(shop, kind, nowAbs, 50);
    if (!b) continue;
    const age = nowAbs - b.cookedMin;
    if (pearlState(b, nowAbs) === 'hard' && !shift.alerts[`hard_${b.id}`]) { shift.alerts[`hard_${b.id}`] = 1; ev.push({ type: 'pearl_hard', kind, text: `${PEARLS[kind].name} đã quá 8 giờ: cứng rồi, nấu mẻ mới!` }); }
    else if (age > PEARL_HARD_MIN - 45 && age <= PEARL_HARD_MIN && !shift.alerts[`soon_${b.id}`]) { shift.alerts[`soon_${b.id}`] = 1; ev.push({ type: 'pearl_soon', kind, text: `${PEARLS[kind].name} sắp cứng (nấu lúc ${fmtTime(splitAbs(b.cookedMin).min)}): nấu mẻ mới, mất 30 phút` }); }
  }
  if (shift.outage && Math.floor(now / 60) > Math.floor(prev / 60)) {
    const melt = Math.round((shop.stock.da || 0) * 0.15);
    if (melt > 0) { takeStock(shop, 'da', melt); const v = Math.round(unitCost(shop, 'da', melt)); shift.waste += v; shift.wasteNotes.push(`Đá tan vì cúp điện ${vn(melt / 1000)} kg`); ev.push({ type: 'melt', text: 'Cúp điện: đá đang tan' }); }
  }
  if (shift.bongBusy && now >= shift.bongBusy.until) {
    const job = shift.bongBusy; shift.bongBusy = null;
    const t = shift.tickets.find((x) => x.id === job.orderId);
    if (t) { const res = serveOrder(shop, shift, t.id, { ...answerFor(t), sealed: 'wrinkled' }, now, { by: 'bong' }); ev.push({ type: 'bong', text: res.ok ? `Bông giao xong ly của ${t.client}` : 'Bông không pha được: hết hàng', res }); }
  }
  return ev;
}
/** Serve the cup to a ticket. Deducts stock, scores, tips. → { ok, reason?, score, tip, left } */
export function serveOrder(shop, shift, orderId, cup, nowMin = shift.now, opts = {}) {
  const t = shift.tickets.find((x) => x.id === orderId);
  if (!t) return { ok: false, reason: 'Phiếu không còn' };
  const at = absMin(shift.day, nowMin);
  const use = useStock(shop, cup, at);
  if (!use.ok) return { ok: false, reason: `Hết ${use.missing.map((m) => (m.startsWith('pearl_') ? PEARLS[m.slice(6)].name : INGREDIENTS[m].name)).join(', ')}`, missing: use.missing };
  const full = { ...cup, pearl: use.pearl };
  const score = scoreCup(t, full);
  const left = clamp(1 - (nowMin - t.at) / t.patience, 0, 1);
  let points = score.points;
  if (left < 0.25) { points = Math.max(0, points - 5); score.faults.push('Khách chờ lâu'); }
  const grade = gradeOf(points);
  let tip = 0;
  if (shift.rank >= 2 && t.source === 'quay' && grade === 'A' && left >= 0.4 && opts.by !== 'bong') {
    const r = mkRng(hashSeed(shift.seed, 'tip', t.id));
    const chance = shift.mood >= 70 ? 0.45 : shift.mood < 30 ? 0.1 : 0.3; // tâm trạng cao: khách tip nhiều hơn
    if (r() < chance) tip = r() < 0.3 ? 5000 : 2000;
  }
  shift.tickets.splice(shift.tickets.indexOf(t), 1);
  const rec = { id: t.id, item: t.item, size: t.size, source: t.source, client: t.client, at: t.at, servedAt: nowMin, left, points, raw: score.raw, grade, faults: score.faults, tip, price: t.price, appPrice: t.appPrice || 0, voucher: t.voucher || 0, cost: use.cost, by: opts.by || 'me', pearl: use.pearl };
  shift.served.push(rec);
  return { ok: true, score: { ...score, points, grade }, tip, left, rec };
}
/** Throw away a half-made (or wrong) cup: its ingredients go to waste. → cost */
export function trashCup(shop, shift, cup, nowMin = shift.now) {
  const use = useStock(shop, cup, absMin(shift.day, nowMin));
  const cost = use.ok ? use.cost : cupCost(shop, { size: cup.size, labeled: false });
  if (!use.ok && SIZES[cup.size] && (shop.stock.ly || 0) > 0) takeStock(shop, 'ly', 1);
  shift.waste += cost; shift.trashed.push({ at: nowMin, cost });
  shift.wasteNotes.push('Ly làm hỏng, đổ bỏ');
  return cost;
}
/** A scoop taken out of the cup again (mis-scooped topping) goes to waste. → cost */
export function wasteTopping(shop, shift, top, nowMin = shift.now) {
  const Tp = TOPPINGS[top]; if (!Tp) return 0;
  const at = absMin(shift.day, nowMin);
  let cost = 0;
  if (Tp.pearl) { const b = activeBatch(shop, Tp.pearl, at, Tp.g); if (b) { b.grams -= Tp.g; cost = Math.round(b.costPerG * Tp.g); shop.pearls = shop.pearls.filter((x) => x.grams > 0); } }
  else if ((shop.stock[Tp.ing] || 0) >= Tp.g) { cost = Math.round(unitCost(shop, Tp.ing, Tp.g)); takeStock(shop, Tp.ing, Tp.g); }
  shift.waste += cost; shift.wasteNotes.push('Múc nhầm topping, bỏ đi');
  return cost;
}
/** Cook a new batch during the shift (ready 30 game minutes later); hard batches of that kind are poured out. */
export function recookPearls(shop, shift, kind, nowMin = shift.now) {
  const at = absMin(shift.day, nowMin);
  const d = discardPearls(shop, at, { kind });
  if (d.cost) { shift.waste += d.cost; shift.wasteNotes.push(`Đổ ${PEARLS[kind].name} quá 8 giờ`); }
  const b = cookPearls(shop, kind, at);
  return b ? { ok: true, batch: b, readyMin: splitAbs(b.cookedMin).min } : { ok: false, reason: `Hết ${INGREDIENTS[PEARLS[kind].dry].name}` };
}
/** One tap on an open chore. → { done } */
export function doChore(shop, shift, choreId) {
  const ch = shift.chores.find((x) => x.id === choreId);
  if (!ch || ch.status !== 'open') return { done: false };
  ch.left = Math.max(0, ch.left - 1);
  if (ch.left === 0) {
    ch.status = 'done';
    if (ch.kind === 'kynhan') receiveDeliveries(shop, shift.day, Math.max(shift.now, ch.at), ch.deliveryId);
  }
  return { done: ch.status === 'done' };
}
/** Hand a ticket to Bông (rank ≥ 4): she brings it 12 game minutes later, lid a bit wrinkled. */
export function askBong(shift, orderId) {
  if (shift.rank < 4 || shift.bongBusy) return { ok: false };
  if (!shift.tickets.some((t) => t.id === orderId)) return { ok: false };
  shift.bongBusy = { orderId, until: shift.now + 12 };
  return { ok: true, until: shift.bongBusy.until };
}

function wageFor(rank, day, startMin) {
  const R = RANK[rank] || RANK[1];
  const wd = weekdayOf(day);
  if (R.wageEvening && (startMin >= 17 * 60 || wd === 0 || wd === 6)) return R.wageEvening;
  return R.wage;
}
function nightHours(startMin, endMin) {
  let n = 0;
  for (let m = startMin; m < endMin; m++) { const x = ((m % 1440) + 1440) % 1440; if (x >= 22 * 60 || x < 6 * 60) n++; }
  return n / 60;
}
/** closeShift(shop, shift, kp|ctx, ctx?) → result { placeId, placeName, kind, role, rank, day, startMin, endMin, hours,
 *  cups, missed, grades{A,B,C,D}, points, speedFactor, score, grade, revenue, tips, waste, wasteNotes, pay, wage,
 *  nightHours, energyCost, promoted, rankProgress, events[] }. Records the shift into the day's books. */
export function closeShift(shop, shift, kp, ctx) {
  if (shift.closed) return shift.result;
  const c = resolveCtx(kp, ctx);
  const day = shift.day;
  const endAbs = absMin(day, Math.max(shift.now, shift.endMin));
  for (const t of shift.tickets) shift.missed.push({ ...t, missedAt: shift.now });
  shift.tickets = [];
  const d = discardPearls(shop, endAbs, {});
  if (d.cost) { shift.waste += d.cost; shift.wasteNotes.push(`Đổ trân châu quá 8 giờ (${Math.round(d.grams)} g)`); }
  receiveDeliveries(shop, day, Math.max(shift.now, shift.endMin));
  const grades = { A: 0, B: 0, C: 0, D: 0 };
  const mine = shift.served.filter((s) => s.by === 'me');
  for (const s of mine) grades[s.grade]++;
  const n = shift.served.length + shift.missed.length;
  const sumPts = shift.served.reduce((a, s) => a + s.points, 0);
  const points = n ? sumPts / n : 0;
  const avgLeft = shift.served.length ? shift.served.reduce((a, s) => a + s.left, 0) / shift.served.length : 0;
  const speedFactor = shift.served.length ? clamp(0.8 + 0.4 * avgLeft, 0.8, 1) : 0.8;
  const choresMissed = shift.chores.filter((x) => x.status !== 'done' && x.status !== 'wait').length;
  const score = clamp(points * speedFactor - choresMissed * 3, 0, 100);
  const grade = n ? gradeOf(score) : 'D';
  const hours = shift.endedEarly ? Math.max(0.5, Math.round((Math.min(shift.now, shift.endMin) - shift.startMin) / 15) / 4) : (shift.endMin - shift.startMin) / 60;
  const wage = wageFor(shift.rank, day, shift.startMin);
  const nh = nightHours(shift.startMin, shift.startMin + hours * 60);
  let revenue = 0, tips = 0;
  const rec = dayRec(shop, day);
  for (const s of shift.served) {
    tips += s.tip;
    if (s.source === 'app') { rec.appCups++; rec.appGross += s.appPrice; if (s.voucher) rec.voucherN++; revenue += s.appPrice; }
    else { rec.counterCups++; rec.counterRevenue += s.price; revenue += s.price; }
    rec.ingredientCups++; rec.ingredientCost += s.cost;
    const h = Math.floor(s.at / 60); rec.hourCups[h] = (rec.hourCups[h] || 0) + 1;
    rec.sat.sum += satOf(s.grade); rec.sat.n++;
  }
  for (const m of shift.missed) { const h = Math.floor(m.at / 60); rec.hourCups[h] = (rec.hourCups[h] || 0) + 1; rec.sat.sum += 1.5; rec.sat.n++; }
  rec.wasteCost += shift.waste; rec.wasteNotes = [...new Set([...rec.wasteNotes, ...shift.wasteNotes])].slice(-8);
  const R = RANK[shift.rank] || RANK[1];
  const pay = Math.round(wage * hours + wage * 0.3 * nh + (R.revenuePct ? revenue * R.revenuePct : 0));
  rec.playerHours += hours; rec.playerPay += pay; rec.tips += tips;
  rec.windows.push([shift.startMin, shift.endMin]);
  const events = [...shift.events];
  addRevenue(shop, day, revenue, events);
  const me = shop.me;
  me.shifts++;
  if (!me.days.includes(day)) me.days.push(day);
  me.scores.push({ day, pts: Math.round(score * 10) / 10 });
  if (me.scores.length > 120) me.scores.splice(0, me.scores.length - 120);
  if (me.trainNext && shift.rank >= 3 && score >= GRADE_MIN.B) { me.trainedBong = true; me.trainNext = false; events.push({ type: 'trained', text: 'Bông học xong một ca với bạn' }); }
  const prog = rankProgress(shop, { ...c, certs: c.certs });
  let promoted = null;
  if (prog.canPromote) { me.rank = prog.next.id; promoted = prog.next; events.push({ type: 'promote', text: `Lên bậc: ${prog.next.name}!` }); }
  shift.closed = true;
  const result = {
    placeId: PLACE_ID, placeName: PLACE_NAME, kind: 'shop', role: (RANK[me.rank] || RANK[1]).name, rank: me.rank, shiftRank: shift.rank, newRank: me.rank,
    skill: 'phache', nightPaid: true, // pay below already holds the 30% night allowance
    comment: `${mine.length} ly, ${shift.missed.length} khách bỏ về, hạng ${n ? gradeOf(score) : 'D'}`,
    highlight: promoted ? `Lên bậc ${promoted.name}` : null,
    day, startMin: shift.startMin, endMin: shift.endMin, hours,
    cups: mine.length, cupsBong: shift.served.length - mine.length, missed: shift.missed.length, grades,
    points: Math.round(points * 10) / 10, speedFactor: Math.round(speedFactor * 100) / 100, score: Math.round(score * 10) / 10, grade,
    revenue, tips, waste: shift.waste, wasteNotes: shift.wasteNotes, pay, wage, nightHours: nh,
    choresDone: shift.chores.filter((x) => x.status === 'done').length, choresMissed,
    energyCost: clamp(20 + Math.round(mine.length * 0.8), 20, 35), foodCost: 12,
    promoted: promoted ? promoted.id : null, rankProgress: rankProgress(shop, c), events,
  };
  shift.result = result;
  return result;
}
export const endShift = closeShift;
const satOf = (g) => ({ A: 5, B: 4.3, C: 3.5, D: 2.5 }[g] || 3);

// ------------------------------------------------------------------------------------------------ suppliers
/** Delivery time per supplier rules (T6). at = { day, min }. → { etaDay, etaMin } */
export function etaFor(supplierId, at, r = () => 0, weather = null) {
  const S = SUPPLIER[supplierId]; const D = S.delivery;
  const { day, min } = at;
  if (D.kind === 'now') return { etaDay: day, etaMin: min };
  if (D.kind === 'walk') return { etaDay: day, etaMin: min, travelMin: D.travelMin };
  if (D.kind === 'nextMorning') return { etaDay: min < D.cutoff ? day + 1 : day + 2, etaMin: D.at };
  if (D.kind === 'afternoon') return min < D.lastCall ? { etaDay: day, etaMin: Math.max(D.at, min + D.leadMin) } : { etaDay: day + 1, etaMin: D.at };
  if (D.kind === 'days') {
    let n = D.min + Math.floor(r() * (D.max - D.min + 1));
    if (weather === 'rain' || weather === 'heavy') n += D.rainExtra || 0;
    return { etaDay: day + n, etaMin: D.at };
  }
  return { etaDay: day + 1, etaMin: 6 * 60 };
}
/** Price of one pack of an ingredient at a supplier today. */
export function packPrice(supplierId, ingId, c) {
  const S = SUPPLIER[supplierId], I = INGREDIENTS[ingId];
  const rain = c && (c.weather === 'rain' || c.weather === 'heavy') && S.rainMul ? S.rainMul : 1;
  const per = priceFor(c, ingId) * S.priceMul * rain;
  return Math.round(I.unit === 'g' ? per * I.pack / 1000 : per * I.pack);
}
/** placeOrder(shop, supplierId, items {ingId: packs} | [{id, packs}], kp|ctx, ctx?) → delivery (ok:true, etaDay, etaMin, ...)
 *  or { ok:false, reason }. Market and convenience store deliver at once; the rest arrive per etaFor(). */
export function placeOrder(shop, supplierId, items, kp, ctx, opts = {}) {
  const c = resolveCtx(kp, ctx);
  const S = SUPPLIER[supplierId];
  if (!S) return { ok: false, reason: 'Không có nhà cung cấp này' };
  const rank = c.rank || shop.me.rank;
  if (!opts.force && rank < S.minRank) return { ok: false, reason: `Từ bậc ${RANK[S.minRank].name} mới được nhập ở ${S.name}` };
  const list = Array.isArray(items) ? items.map((x) => [x.id, x.packs]) : Object.entries(items || {});
  const lines = [];
  let cost = 0, grams = 0;
  for (const [id, packs] of list) {
    const p = Math.floor(Number(packs) || 0);
    if (p <= 0) continue;
    if (!S.items.includes(id)) return { ok: false, reason: `${S.name} không bán ${INGREDIENTS[id] ? INGREDIENTS[id].name : id}` };
    const price = packPrice(supplierId, id, c);
    lines.push({ id, packs: p, amount: p * INGREDIENTS[id].pack, price });
    cost += price * p;
    if (INGREDIENTS[id].unit === 'g') grams += p * INGREDIENTS[id].pack;
  }
  if (!lines.length) return { ok: false, reason: 'Chưa chọn món nào' };
  if (!opts.force && S.maxGrams && grams > S.maxGrams) return { ok: false, reason: `Tự xách được tối đa ${S.maxGrams / 1000} kg` };
  if (!opts.force && S.minOrder && cost < S.minOrder) return { ok: false, reason: `Đơn tối thiểu ${fmtMoney(S.minOrder)}` };
  const credit = supplierId === 'daumoi' && c.hearts && c.hearts.thinh >= 3;
  if (!opts.force && !credit && shop.cash < cost) return { ok: false, reason: 'Quỹ quán không đủ tiền' };
  const r = mkRng(hashSeed(shop.seed, 'order', shop.seq + 1, supplierId, c.day));
  const eta = etaFor(supplierId, c, r, c.weather);
  const missing = [];
  if (S.missRate && lines.length && r() < S.missRate) missing.push(lines[Math.floor(r() * lines.length)].id);
  const refund = lines.filter((l) => missing.includes(l.id)).reduce((a, l) => a + l.price * l.packs, 0);
  const d = {
    id: nextId(shop, 'd'), supplierId, supplierName: S.name, day: c.day, min: c.min, etaDay: eta.etaDay, etaMin: eta.etaMin, travelMin: eta.travelMin || 0,
    items: Object.fromEntries(lines.map((l) => [l.id, l.amount])), unitPrice: Object.fromEntries(lines.map((l) => [l.id, l.price / INGREDIENTS[l.id].pack])),
    cost: cost - refund, missing, status: 'pending', credit: !!credit && shop.cash < cost, auto: !!opts.auto,
  };
  shop.cash -= d.cost;
  shop.deliveries.push(d);
  if (shop.deliveries.length > 60) shop.deliveries = shop.deliveries.filter((x) => x.status === 'pending' || x.day >= c.day - 14);
  if (S.delivery.kind === 'walk' || S.delivery.kind === 'now') receiveDeliveries(shop, c.day, c.min, d.id);
  return { ok: true, ...d };
}
/** Put every delivery that is due by (day, min) into stock (or just `onlyId`). → delivered[] */
export function receiveDeliveries(shop, day, min, onlyId = null) {
  const now = absMin(day, min), out = [];
  for (const d of shop.deliveries) {
    if (d.status !== 'pending') continue;
    if (onlyId ? d.id !== onlyId : absMin(d.etaDay, d.etaMin) > now) continue;
    for (const [id, amount] of Object.entries(d.items)) {
      if (d.missing.includes(id)) continue;
      const unit = INGREDIENTS[id].unit === 'g' ? d.unitPrice[id] * 1000 : d.unitPrice[id];
      addStock(shop, id, amount, day, unit);
    }
    d.status = 'done'; d.gotDay = day; d.gotMin = min;
    out.push(d);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ channels
/** runChannel(shop, channelId, kp|ctx, ctx?) → { ok, reason?, cost, until, effectText, boost } */
export function runChannel(shop, channelId, kp, ctx) {
  const c = resolveCtx(kp, ctx);
  const ch = CHANNEL[channelId];
  if (!ch) return { ok: false, reason: 'Không có kênh này' };
  const rank = c.rank || shop.me.rank;
  if (ch.needsOwnShop && !shop.flags.ownShop) return { ok: false, reason: 'Chỉ khi mở quán riêng hoặc chi nhánh (giai đoạn 2)' };
  if (rank < 5 && !shop.flags.nhungAsks) return { ok: false, reason: 'Từ bậc Quản lý cửa hàng (hoặc khi chị Nhung nhờ) mới chọn kênh' };
  const act = activeChannels(shop, c.day);
  if (act.includes(channelId)) return { ok: false, reason: 'Kênh này đang chạy' };
  if (act.length >= MAX_CHANNELS) return { ok: false, reason: `Tối đa ${MAX_CHANNELS} kênh cùng lúc` };
  if (shop.cash < ch.cost) return { ok: false, reason: 'Quỹ quán không đủ tiền' };
  const r = mkRng(hashSeed(shop.seed, 'channel', channelId, c.day));
  const boost = { ...ch.boost };
  let note = '';
  if (channelId === 'luotluot' && r() < 0.25) { for (const k of Object.keys(boost)) boost[k] /= 2; note = '"CPM đang cao": chỉ được nửa hiệu ứng'; }
  if (channelId === 'xomoi' && shop.rating.stars < 3.8) { for (const k of Object.keys(boost)) boost[k] = -0.1; note = 'Quán đang dưới 3,8 sao: tin xấu lan nhanh hơn'; }
  if (ch.quality) {
    const recent = shop.me.scores.slice(-5);
    const q = recent.length ? recent.reduce((a, s) => a + s.pts, 0) / recent.length : shop.rating.stars * 20;
    if (q < 75) { for (const k of Object.keys(boost)) boost[k] = -0.15; note = 'Mi chê ly dở: clip dở'; }
    else if (q < 90) { for (const k of Object.keys(boost)) boost[k] /= 2; note = 'Mi khen vừa phải'; }
    else note = 'Mi khen thật lòng: ly ngon';
  }
  shop.cash -= ch.cost;
  dayRec(shop, c.day).marketing += ch.cost;
  shop.channels[channelId] = { since: c.day, until: ch.days ? c.day + ch.days - 1 : null, boost, decay: !!ch.decay, note };
  return { ok: true, cost: ch.cost, until: shop.channels[channelId].until, effectText: ch.effectText, boost, note };
}
export function stopChannel(shop, channelId, day) {
  const ch = shop.channels[channelId];
  if (!ch) return { ok: false };
  ch.until = Math.max(ch.since, (day || ch.since) - 1);
  if (ch.until < ch.since) delete shop.channels[channelId];
  return { ok: true };
}

// ------------------------------------------------------------------------------------------------ books
function powerBand(day, min) {
  if (min < 6 * 60) return 'off';
  if (weekdayOf(day) !== 0 && min >= 17 * 60 + 30 && min < 22 * 60 + 30) return 'peak';
  return 'normal';
}
/** The day's ledger record (created with the shop's fixed costs). */
export function dayRec(shop, day) {
  const key = String(day);
  if (!shop.days[key]) {
    const sunday = weekdayOf(day) === 0;
    const tax = shop.tax && shop.tax.rateFrom != null && day >= shop.tax.rateFrom && yearOf(day) === shop.tax.overYear ? 0.045 : 0;
    shop.days[key] = {
      day, counterCups: 0, counterRevenue: 0, appCups: 0, appGross: 0, appCommissionRate: CHANNEL.app.commission,
      voucherN: 0, voucherEach: CHANNEL.app.voucher, ingredientCups: 0, ingredientCost: 0, wasteCost: 0, wasteNotes: [],
      staffHours: 20, staffRate: 27_000, leadBonus: 50_000, playerHours: 0, playerPay: 0, tips: 0,
      kwh: { normal: sunday ? 34 : 20, peak: sunday ? 0 : 14, off: 2 }, waterM3: 0.5, rentMonth: 12_000_000, gasDay: 50_000,
      softwareMonth: 200_000, marketing: 0, taxRate: tax, hourCups: {}, windows: [], sat: { sum: 0, n: 0 }, lost: 0, closed: false,
    };
    const keys = Object.keys(shop.days).map(Number).sort((a, b) => a - b);
    while (keys.length > 35) delete shop.days[String(keys.shift())];
  }
  return shop.days[key];
}
/** Daily P&L table of design 4.2.i (T8). → { day, rows[{ key, label, calc, v, bold? }], net, profit, gross, foodCostPct, notes[] } | null */
export function dayPnL(shop, day) {
  const d = shop.days[String(day)];
  if (!d) return null;
  const fm = (v) => fmtMoney(v);
  const rows = [];
  const row = (key, label, calc, v, bold = false) => rows.push({ key, label, calc, v: Math.round(v) || 0, bold });
  const avgCounter = d.counterCups ? Math.round(d.counterRevenue / d.counterCups) : 0;
  const avgApp = d.appCups ? Math.round(d.appGross / d.appCups) : 0;
  row('counter', 'Bán tại quầy', `${d.counterCups} ly x ${fm(avgCounter)}`, d.counterRevenue);
  row('app', 'Bán qua app (giá app)', `${d.appCups} ly x ${fm(avgApp)}`, d.appGross);
  const fee = Math.round(d.appGross * d.appCommissionRate);
  row('appFee', `Trừ chiết khấu app ${Math.round(d.appCommissionRate * 100)}%`, '', -fee);
  const vat = Math.round(fee * 0.1);
  row('appVat', 'Trừ VAT 10% trên chiết khấu', '', -vat);
  const vouchers = d.voucherN * d.voucherEach;
  row('voucher', 'Trừ voucher quán góp', `${d.voucherN} đơn x ${fm(d.voucherEach)}`, -vouchers);
  const net = d.counterRevenue + d.appGross - fee - vat - vouchers;
  row('net', 'Thực nhận', '', net, true);
  const cups = d.ingredientCups;
  row('ingredients', 'Nguyên liệu', `${cups} ly x ~${fm(cups ? round100(d.ingredientCost / cups) : 0)}`, -d.ingredientCost);
  row('waste', 'Hao hụt', d.wasteNotes.length ? [...new Set(d.wasteNotes)].slice(0, 3).join('; ') : 'trân châu quá giờ, ly hỏng', -d.wasteCost);
  const staffH = Math.max(0, d.staffHours - d.playerHours);
  const labor = staffH * d.staffRate + d.leadBonus + d.playerPay;
  row('labor', 'Lương', `${staffH} giờ công x ${fm(d.staffRate)} + phụ cấp ca trưởng ${fm(d.leadBonus)}${d.playerPay ? ` + bạn ${fm(d.playerPay)}` : ''}`, -labor);
  const power = roundK((d.kwh.normal * 3089 + d.kwh.peak * 5313 + d.kwh.off * 1880) * 1.08);
  row('power', 'Điện (giá kinh doanh từ 01/11/2026)', `${vn(d.kwh.normal)} kWh x 3.089đ + ${vn(d.kwh.peak)} kWh cao điểm x 5.313đ + ${vn(d.kwh.off)} kWh thấp điểm x 1.880đ, + VAT 8%`, -power);
  const water = round100(d.waterM3 * 21_300 * 1.3 * 1.05);
  row('water', 'Nước (giá kinh doanh)', `${String(d.waterM3).replace('.', ',')} m³ x 21.300đ + 30% phí thoát nước + VAT`, -water);
  const rent = roundK(d.rentMonth / 30);
  row('rent', 'Mặt bằng', `${fm(d.rentMonth)} / 30`, -rent);
  row('gas', 'Gas', 'bình trên 500.000đ, dùng khoảng 10 ngày', -d.gasDay);
  const sw = roundK(d.softwareMonth / 30);
  row('software', 'Phần mềm bán hàng', `${fm(d.softwareMonth)} / 30`, -sw);
  row('marketing', 'Truyền thông', '', -d.marketing);
  const gross = d.counterRevenue + d.appGross;
  const tax = Math.round(gross * d.taxRate);
  row('tax', 'Thuế hộ kinh doanh', d.taxRate ? `${String(d.taxRate * 100).replace('.', ',')}% x ${fm(gross)} (cả năm vượt 1 tỷ)` : 'Doanh thu năm chưa vượt 1 tỷ: chưa nộp', -tax);
  const profit = net - d.ingredientCost - d.wasteCost - labor - power - water - rent - d.gasDay - sw - d.marketing - tax;
  row('profit', 'Lời trong ngày', '', profit, true);
  return {
    day, rows, net, profit, gross, foodCostPct: gross ? d.ingredientCost / gross : 0, closed: d.closed,
    notes: [
      'Giờ cao điểm điện 17h30-22h30 (thứ Hai đến thứ Bảy) đắt gần gấp 3 giờ thấp điểm 0h-6h, nên nấu trân châu sớm là tiết kiệm.',
      'Chủ nhượng quyền ngoài đời lời khoảng 30 triệu/tháng và gần 3 năm mới hòa vốn.',
      `Thuế và giá điện theo quy định 2026 ${LAW_NOTE}.`,
    ],
  };
}
/** 2026 household business tax (design 4.2.j, T9). Pure: does not change the shop. */
export function taxFor(shop, yearRevenue, year = null) {
  const y = year || (shop && shop.tax && shop.tax.overYear) || 2026;
  if (!(yearRevenue > TAX_THRESHOLD)) {
    return {
      over: false, rate: 0, vat: 0, pit: 0, due: 0, event: null,
      reminder: `Doanh thu năm ${y} chưa vượt 1 tỷ: không nộp thuế GTGT, TNCN. Vẫn giữ sổ doanh thu (mẫu S1a-HKD) và thông báo doanh thu thực tế chậm nhất 31/01/${y + 1}. Anh Sang (Cân Đối) làm hộ.`,
      note: LAW_NOTE,
    };
  }
  const already = shop && shop.tax && shop.tax.overYear === y;
  return {
    over: true, rate: 0.045, vat: 0.03, pit: 0.015, due: Math.round(yearRevenue * 0.045),
    reminder: 'Doanh thu vượt 1 tỷ: phải dùng hóa đơn điện tử có mã (hoặc máy tính tiền kết nối cơ quan thuế), đăng ký trong 30 ngày, nộp 3% GTGT + 1,5% TNCN trên doanh thu từ kỳ sau.',
    note: LAW_NOTE,
    event: already ? null : { id: 'vuot1ty', type: 'tax', title: 'Vượt 1 tỷ', year: y, text: `Quán vượt 1 tỷ doanh thu năm ${y}: từ kỳ sau nộp 4,5% (3% GTGT + 1,5% TNCN) ${LAW_NOTE}` },
  };
}
function addRevenue(shop, day, amount, events) {
  const y = yearOf(day);
  shop.yearRevenue[y] = (shop.yearRevenue[y] || 0) + amount;
  const t = taxFor(shop, shop.yearRevenue[y], y);
  if (t.event) { shop.tax.overYear = y; shop.tax.rateFrom = day + 1; events.push(t.event); shop.log.push({ day, text: t.event.text }); }
}

/** End of a shop day: the staff (Tú, Bông) sell the hours you did not cover, leftovers are poured out, fixed costs
 *  and channels are booked, stars move, chị Nhung re-orders. Idempotent per day. → { pnl, events[] } */
export function closeDay(shop, day, ctx = {}) {
  const c = resolveCtx(null, { ...(ctx || {}), day, min: CLOSE_MIN });
  const rec = dayRec(shop, day);
  const events = [];
  if (rec.closed) return { pnl: dayPnL(shop, day), events };
  const r = mkRng(hashSeed(shop.seed, 'day', day));
  receiveDeliveries(shop, day, OPEN_MIN);
  const stars = shop.rating.stars;
  let revenue = 0;
  for (let h = 9; h < 22; h++) {
    const covered = rec.windows.some(([a, b]) => h * 60 >= a && h * 60 < b);
    let expect = 0;
    for (let m = h * 60; m < h * 60 + 60; m++) { const g = groupAt(m); expect += DAY_CUPS * densityAt(m) * demandOf(c, g, m) * starMult(stars) * channelMult(shop, g, day); }
    const target = Math.round(expect + (r() - 0.5));
    const npc = covered ? Math.max(0, Math.round(target * 0.72)) : Math.max(0, target - (rec.hourCups[h] || 0));
    const at = absMin(day, h * 60 + 30);
    const av = menuAvailability(shop);
    const pool = MENU_ORDER.filter((id) => av[id].ok);
    for (let i = 0; i < npc; i++) {
      if (!pool.length) { rec.lost++; continue; }
      const app = r() < appShare(shop, c, h * 60);
      const item = weighted(r, pool, TASTES[app ? 'app' : groupAt(h * 60)]);
      const m = MENU[item];
      const size = m.sizes ? m.sizes[0] : r() < 0.4 ? 'L' : 'M';
      const cup = { size, tea: m.tea, milk: m.milk, sugar: 70, ice: (shop.stock.da || 0) > 500 ? 100 : 0, toppings: m.toppings, labeled: true };
      for (const kind of Object.keys(cupNeeds(cup).pearls)) if (!activeBatch(shop, kind, at, 50) || pearlState(activeBatch(shop, kind, at, 50), at) === 'hard') cookPearls(shop, kind, at - 30);
      const u = useStock(shop, cup, at);
      if (!u.ok) { rec.lost++; continue; }
      const price = itemPrice(shop, item, size);
      if (app) { const g = appPriceOf(price); rec.appCups++; rec.appGross += g; revenue += g; if (r() < CHANNEL.app.voucherShare) rec.voucherN++; }
      else { rec.counterCups++; rec.counterRevenue += price; revenue += price; }
      rec.ingredientCups++; rec.ingredientCost += u.cost;
      rec.sat.sum += 4.3 * 0.2; rec.sat.n += 0.2;
    }
  }
  const endAbs = absMin(day, CLOSE_MIN);
  const pd = discardPearls(shop, endAbs, { all: true });
  if (pd.cost) { rec.wasteCost += pd.cost; rec.wasteNotes.push('Trân châu cuối ngày đổ bỏ'); }
  const ex = expireLots(shop, day);
  if (ex.cost) { rec.wasteCost += ex.cost; rec.wasteNotes.push(...ex.notes); }
  let dailyMk = 0;
  for (const id of activeChannels(shop, day)) { const ch = CHANNEL[id]; if (ch && ch.daily) { rec.marketing += ch.daily; dailyMk += ch.daily; } }
  for (const [id, ch] of Object.entries(shop.channels)) if (ch.until != null && ch.until < day + 1) { delete shop.channels[id]; events.push({ type: 'channel_end', text: `Hết đợt: ${CHANNEL[id] ? CHANNEL[id].name : id}` }); }
  addRevenue(shop, day, revenue, events);
  const dt = dateOfDay(day);
  if (dt.m === 1 && dt.d >= 20 && !shop.tax.reminded.includes(dt.y)) {
    shop.tax.reminded.push(dt.y);
    const t = taxFor(shop, shop.yearRevenue[dt.y - 1] || 0, dt.y - 1);
    events.push({ type: 'tax_reminder', text: `${t.reminder} ${LAW_NOTE}` });
  }
  // stars: 30-day sliding average of satisfaction, anchored by 20 old reviews at 4.2
  const sat = rec.sat.n ? rec.sat.sum / rec.sat.n : null;
  if (sat != null) shop.rating.hist.push({ day, sat: Math.round(sat * 100) / 100, n: Math.round(rec.sat.n * 10) / 10 });
  shop.rating.hist = shop.rating.hist.filter((x) => x.day > day - 30);
  const w = shop.rating.hist.reduce((a, x) => a + Math.min(x.n, 40), 0), s = shop.rating.hist.reduce((a, x) => a + x.sat * Math.min(x.n, 40), 0);
  const before = shop.rating.stars;
  shop.rating.stars = Math.round(clamp((4.2 * 60 + s) / (60 + w), 1, 5) * 100) / 100;
  if (Math.abs(shop.rating.stars - before) >= 0.05) events.push({ type: 'stars', text: `Sao trên Chấm Đỏ: ${before.toFixed(1)} → ${shop.rating.stars.toFixed(1)}` });
  const pnl0 = dayPnL(shop, day);
  const rv = (k) => pnl0.rows.find((x) => x.key === k).v; // ingredients, waste and one-off campaigns were paid when bought
  shop.cash += rv('net') + rv('labor') + rv('power') + rv('water') + rv('rent') + rv('gas') + rv('software') + rv('tax') - dailyMk;
  if (shop.autoRestock) {
    const by = { daumoi: {}, bama: {}, cho: {} };
    for (const [id, I] of Object.entries(INGREDIENTS)) {
      const pending = shop.deliveries.filter((d) => d.status === 'pending').reduce((a, d) => a + (d.items[id] || 0), 0);
      const have = (shop.stock[id] || 0) + pending;
      if (have >= I.par * 0.75) continue;
      const packs = Math.ceil((I.par - have) / I.pack);
      const sup = SUPPLIER.daumoi.items.includes(id) ? 'daumoi' : SUPPLIER.bama.items.includes(id) ? 'bama' : 'cho';
      by[sup][id] = packs;
    }
    const t = { day, min: 21 * 60 };
    let spent = 0;
    for (const [sup, items] of Object.entries(by)) {
      if (!Object.keys(items).length) continue;
      const o = placeOrder(shop, sup, items, t, null, { force: true, auto: true });
      if (o.ok) spent += o.cost;
    }
    if (spent) events.push({ type: 'restock', text: `Chị Nhung nhập hàng ${fmtMoney(spent)} (đầu mối giao 6h sáng mai)` });
  }
  rec.wasteNotes = [...new Set(rec.wasteNotes)].slice(-8);
  rec.closed = true;
  shop.lastClosed = Math.max(shop.lastClosed || 0, day);
  return { pnl: dayPnL(shop, day), events };
}
/** Close every day between the last closed one and `day` (exclusive), at most 7, so the shop keeps living even
 *  if nobody called closeDay(). */
export function catchUp(shop, day, ctx = {}) {
  const from = Math.max((shop.lastClosed || 0) + 1, day - 7);
  const out = [];
  for (let d = from; d < day; d++) out.push(...closeDay(shop, d, { weather: ctx.weather }).events);
  if (shop.lastClosed < day - 1) shop.lastClosed = day - 1;
  return out;
}

// ------------------------------------------------------------------------------------------------ ranks
export function rankProgress(shop, kp) {
  const me = shop.me;
  const certs = [...(me.certs || []), ...((kp && (kp.certs || (kp.player && kp.player.certs))) || [])];
  const next = RANK[me.rank + 1] || null;
  if (!next) return { rank: me.rank, next: null, checks: [], canPromote: false };
  const all = me.scores.length ? me.scores.reduce((a, s) => a + s.pts, 0) / me.scores.length : 0;
  const lastDay = me.days.length ? Math.max(...me.days) : 0;
  const wk = (a, b) => { const s = me.scores.filter((x) => x.day > a && x.day <= b); return s.length ? s.reduce((x, y) => x + y.pts, 0) / s.length : null; };
  const checks = [];
  const N = next.need;
  if (N.shifts != null) checks.push({ key: 'shifts', label: `${N.shifts} ca đầu (học việc)`, have: me.shifts, need: N.shifts, ok: me.shifts >= N.shifts });
  if (N.days != null) checks.push({ key: 'days', label: `${N.days} ngày làm`, have: me.days.length, need: N.days, ok: me.days.length >= N.days });
  if (N.avg != null) checks.push({ key: 'avg', label: `Điểm ca trung bình ≥ ${gradeOf(N.avg)}`, have: Math.round(all), need: N.avg, ok: me.scores.length > 0 && all >= N.avg });
  if (N.avg2w != null) {
    const w1 = wk(lastDay - 7, lastDay), w2 = wk(lastDay - 14, lastDay - 7);
    checks.push({ key: 'avg2w', label: '2 tuần liền trung bình ≥ B', have: [w2, w1].map((x) => (x == null ? '-' : Math.round(x))).join(' / '), need: N.avg2w, ok: w1 != null && w2 != null && w1 >= N.avg2w && w2 >= N.avg2w });
  }
  if (N.cert) checks.push({ key: 'cert', label: N.cert === 'khamsuckhoe' ? 'Giấy khám sức khỏe (trạm y tế, 160.000đ, BHYT không trả)' : 'Xác nhận kiến thức an toàn thực phẩm (lớp ở trạm y tế)', have: hasCert(certs, N.cert) ? 1 : 0, need: 1, ok: hasCert(certs, N.cert) });
  if (N.trained) checks.push({ key: 'trained', label: 'Đào tạo Bông 1 ca (điểm ca ≥ B)', have: me.trainedBong ? 1 : 0, need: 1, ok: !!me.trainedBong });
  if (N.foodCost != null) {
    const ds = []; for (let d = (shop.lastClosed || 0) - 13; d <= (shop.lastClosed || 0); d++) { const p = shop.days[String(d)] && shop.days[String(d)].closed ? dayPnL(shop, d) : null; ds.push(p); }
    const ok = ds.every((p) => p && p.gross > 0 && p.foodCostPct <= N.foodCost);
    const worst = ds.filter(Boolean).reduce((a, p) => Math.max(a, p.foodCostPct), 0);
    checks.push({ key: 'foodCost', label: 'Chi phí nguyên liệu ≤ 35% doanh thu 2 tuần liền', have: `${Math.round(worst * 100)}%`, need: '35%', ok });
  }
  if (N.stars != null) checks.push({ key: 'stars', label: `${String(N.stars).replace('.', ',')} sao trở lên trên Chấm Đỏ`, have: shop.rating.stars, need: N.stars, ok: shop.rating.stars >= N.stars });
  if (next.phase2) checks.push({ key: 'phase2', label: next.text || 'Giai đoạn 2', have: 0, need: 1, ok: false });
  return { rank: me.rank, next, checks, canPromote: !next.phase2 && checks.every((x) => x.ok) };
}
export function promote(shop, kp) {
  const p = rankProgress(shop, kp);
  if (!p.canPromote) return { ok: false, progress: p };
  shop.me.rank = p.next.id;
  return { ok: true, rank: shop.me.rank };
}
/** The owner read your profile and starts you at `rank` (1..5). */
export function setRank(shop, rank) { shop.me.rank = clamp(Math.round(rank), 1, 5); return shop.me.rank; }
/** Rank-gated features of the manager panel (design 4.2.g/h/i/k). */
export function permissions(shop, rank = shop.me.rank) {
  return {
    buy: rank >= 3, buyAll: rank >= 4, pnl: rank >= 4, channels: rank >= 5 || !!shop.flags.nhungAsks, autoRestockToggle: rank >= 4,
    suppliers: Object.fromEntries(Object.values(SUPPLIER).map((s) => [s.id, rank >= s.minRank])),
  };
}
