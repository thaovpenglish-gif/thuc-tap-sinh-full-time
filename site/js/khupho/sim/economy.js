// Khu phố T&M · neighbourhood economy (DESIGN.md 6). Pure, JSON-safe, deterministic given the seed.
// The whole street is ticked once per game day (economyDay, called when the player sleeps); hour-level detail
// (demand, outages) is a pure function of (econ, day, min) so shops can ask any time.
import { dayRng, hashSeed, rng, int, pick, chance, shuffle } from './rng.js';
import { dateOf, realTime, isAfterPayday, isBeforePayday, isPayday, isSchoolDay, isTetHoliday, isPreTet,
  seasonOf, monthKey, dayOf, daysInMonth, isWeekend, isSunday, hourLabel, powerPeriod } from './calendar.js';
import { FOOD } from '../data/food.js';

// ---------- base prices (research: economy.md, shops.md, civic.md; [số thiết kế] where no source) ----------
// base: VND per unit at 11/2026. lo/hi: hard bounds as multiples of base. fixed: regulated price, no drift.
export const ITEMS = {
  pork:     { name: 'Thịt heo tươi bán cho quán', unit: 'kg', base: 130000, lo: 0.6, hi: 1.8 },
  beef:     { name: 'Thịt bò', unit: 'kg', base: 180000, lo: 0.6, hi: 1.8 },
  shrimp:   { name: 'Tôm', unit: 'kg', base: 200000, lo: 0.6, hi: 1.8 },
  veg:      { name: 'Rau cải (chợ)', unit: 'kg', base: 30000, lo: 0.5, hi: 2.0 },
  fruit:    { name: 'Trái cây', unit: 'kg', base: 40000, lo: 0.5, hi: 2.0 },
  egg:      { name: 'Trứng gà', unit: 'quả', base: 3500, lo: 0.6, hi: 1.8 },
  rice:     { name: 'Gạo tấm', unit: 'kg', base: 18000, lo: 0.7, hi: 1.6 },
  oil:      { name: 'Dầu ăn', unit: 'lít', base: 45000, lo: 0.7, hi: 1.6 },
  noodles:  { name: 'Mì gói', unit: 'thùng', base: 116000, lo: 0.7, hi: 1.6 },
  peanut:   { name: 'Đậu phộng', unit: 'kg', base: 70000, lo: 0.6, hi: 1.8 },
  coffee:   { name: 'Cà phê nhân', unit: 'kg', base: 89000, lo: 0.6, hi: 1.6 },
  creamer:  { name: 'Bột béo', unit: 'kg', base: 74000, lo: 0.7, hi: 1.6 },
  blacktea: { name: 'Trà đen', unit: 'kg', base: 150000, lo: 0.7, hi: 1.6 },
  oolong:   { name: 'Trà ô long', unit: 'kg', base: 250000, lo: 0.7, hi: 1.6 },
  jasmine:  { name: 'Trà lài', unit: 'kg', base: 160000, lo: 0.7, hi: 1.6 },
  sugar:    { name: 'Đường nâu / siro', unit: 'kg', base: 30000, lo: 0.7, hi: 1.6 },
  pearl:    { name: 'Trân châu khô', unit: 'kg', base: 45000, lo: 0.7, hi: 1.6 },
  cupset:   { name: 'Ly + nắp màng + ống hút', unit: 'bộ', base: 1500, lo: 0.7, hi: 1.6 },
  ice:      { name: 'Đá viên', unit: 'kg', base: 2000, lo: 0.7, hi: 2.0 },
  milk:     { name: 'Sữa tươi', unit: 'lít', base: 35000, lo: 0.7, hi: 1.6 },
  mango:    { name: 'Xoài sấy Ba & Má', unit: 'kg', base: 250000, lo: 0.7, hi: 1.6 },
  beer:     { name: 'Bia thùng 24 lon', unit: 'thùng', base: 360000, lo: 0.8, hi: 1.8 },
  gas:      { name: 'Gas', unit: 'bình', base: 500000, lo: 0.7, hi: 1.6 },
  fuel:     { name: 'Xăng', unit: 'lít', base: 30000, lo: 0.7, hi: 1.6 },
  paper:    { name: 'Giấy in', unit: 'ram', base: 75000, lo: 0.7, hi: 1.6 },
  power_biz:{ name: 'Điện kinh doanh (giờ bình thường)', unit: 'kWh', base: 3089, lo: 1, hi: 1, fixed: true },
  water_biz:{ name: 'Nước kinh doanh', unit: 'm³', base: 21300, lo: 1, hi: 1, fixed: true },
};
/** Other names B's code (or a typo) might use. */
export const ALIASES = { botbeo: 'creamer', bot_beo: 'creamer', tra: 'blacktea', tea: 'blacktea', tra_den: 'blacktea', black_tea: 'blacktea',
  olong: 'oolong', tra_olong: 'oolong', tralai: 'jasmine', tra_lai: 'jasmine', duong: 'sugar', siro: 'sugar', tranchau: 'pearl', tran_chau: 'pearl',
  pearls: 'pearl', ly: 'cupset', cup: 'cupset', cups: 'cupset', da: 'ice', sua: 'milk', sua_tuoi: 'milk', xoai: 'mango', xoai_say: 'mango',
  traicay: 'fruit', trai_cay: 'fruit', heo: 'pork', bo: 'beef', tom: 'shrimp', rau: 'veg', caphe_nhan: 'coffee', xang: 'fuel', bia: 'beer' };
const key = (item) => (ITEMS[item] ? item : ALIASES[item] || item);

// ---------- electricity (civic.md; thông tin giải trí, không phải tư vấn pháp lý) ----------
export const POWER_TIERS = [[100, 1901], [200, 2289], [400, 2894], [700, 3456], [Infinity, 3844]]; // from 01/11/2026, before VAT
export const POWER_VAT = 0.08;
export const LANDLORD_POWER = 4000; // đ/số, what cô Ba Lành charges before the room has tạm trú registered
export const BIZ_POWER = { normal: 3089, low: 1880, peak: 5313 };
/** Household tiered price for kwh in one month, VAT included, rounded to 100đ. */
export function householdPower(kwh) {
  let left = Math.max(0, kwh), prev = 0, sum = 0;
  for (const [cap, price] of POWER_TIERS) { const q = Math.min(left, cap - prev); sum += q * price; left -= q; prev = cap; if (left <= 0) break; }
  return Math.round((sum * (1 + POWER_VAT)) / 100) * 100;
}
export const landlordPower = (kwh) => Math.round(Math.max(0, kwh)) * LANDLORD_POWER;

// ---------- shocks (DESIGN 6.5) ----------
export const SHOCKS = [
  { id: 'heo', item: 'pork', pct: 0.15, text: 'Heo về chợ đầu mối giảm một nửa, sườn lên giá' },
  { id: 'bo', item: 'beef', pct: 0.18, text: 'Thịt bò tăng giá' },
  { id: 'tom', item: 'shrimp', pct: 0.1, text: 'Tôm tăng giá' },
  { id: 'gas', item: 'gas', pct: 0.12, text: 'Gas tăng giá, bình nào cũng trên nửa triệu' },
  { id: 'xang', item: 'fuel', pct: 0.1, text: 'Xăng tăng, chú Lương đòi tăng phí chở hàng' },
  { id: 'caphe_len', item: 'coffee', pct: 0.3, text: 'Cà phê nhân lập đỉnh mới' },
  { id: 'caphe_xuong', item: 'coffee', pct: -0.18, text: 'Cà phê nhân rớt giá' },
  { id: 'botbeo', item: 'creamer', pct: 0.12, text: 'Bột béo tăng giá' },
  { id: 'rau', item: 'veg', pct: 0.22, text: 'Mưa kéo dài, rau lên giá' },
  { id: 'duong', item: 'sugar', pct: 0.1, text: 'Đường tăng giá' },
  { id: 'trachau', item: 'pearl', pct: 0.1, text: 'Trân châu khô tăng giá' },
];

// ---------- NPC businesses (enough to keep the street honest in a 365-day headless run) ----------
// mode: raise = passes cost on slowly; shrink = keeps the price, trims the portion; hold = never lowers the price.
const NPC = {
  comtam:   { item: 'pork', unitCost: 0.55, price: 35000, mode: 'raise', pass: 0.9, cust: 140, cap: 260, groups: { vanphong: 0.4, cudan: 0.6 }, fixed: 1500000 },
  banhmi:   { item: 'pork', unitCost: 0.5, price: 25000, mode: 'shrink', pass: 0.3, cust: 120, cap: 200, groups: { hocsinh: 0.4, vanphong: 0.3, khachvanglai: 0.3 }, fixed: 700000 },
  caphe:    { item: 'coffee', unitCost: 0.4, price: 15000, mode: 'hold', pass: 0.5, cust: 90, cap: 160, groups: { cudan: 0.6, khachvanglai: 0.4 }, fixed: 400000 },
  tienloi:  { item: 'noodles', unitCost: 0.7, price: 22000, mode: 'raise', pass: 1, cust: 300, cap: 900, groups: { hocsinh: 0.3, cudan: 0.4, khachvanglai: 0.3 }, fixed: 1800000 },
  cho:      { item: 'veg', unitCost: 0.8, price: 25000, mode: 'raise', pass: 1, cust: 400, cap: 900, groups: { cudan: 1 }, fixed: 1600000 },
  photo:    { item: 'paper', unitCost: 0.5, price: 5000, mode: 'raise', pass: 0.5, cust: 120, cap: 600, groups: { hocsinh: 0.5, vanphong: 0.5 }, fixed: 200000 },
  net:      { item: 'power_biz', unitCost: 0.4, price: 10000, mode: 'hold', pass: 0, cust: 80, cap: 9999, groups: { hocsinh: 0.6, khachvanglai: 0.4 }, fixed: 400000, service: true },
  cattoc:   { item: 'power_biz', unitCost: 0.2, price: 40000, mode: 'hold', pass: 0, cust: 25, cap: 9999, groups: { cudan: 1 }, fixed: 600000, service: true },
  quannhau: { item: 'beer', unitCost: 0.55, price: 200000, mode: 'raise', pass: 0.8, cust: 35, cap: 80, groups: { vanphong: 0.7, cudan: 0.3 }, fixed: 2200000 },
};
const WHOLESALE_CAP = 4000; // units the đầu mối can hand out per night (all NPC goods, abstracted)

/** → econ (JSON-safe). Call economyDay(econ, 1) before day 1 starts (world.newGame does). */
export function createEconomy(seed) {
  const idx = {}, lag = {};
  for (const k of Object.keys(ITEMS)) { idx[k] = 1; lag[k] = 1; }
  const npc = {};
  for (const [id, n] of Object.entries(NPC)) {
    npc[id] = { id, price: n.price, basePrice: n.price, portion: 1, stock: n.service ? 0 : Math.round(n.cap * 0.8), cash: 5_000_000, stars: 4.2, lag: 1, remodels: 0, soldYesterday: 0 };
  }
  return { v: 1, seed: String(seed), day: 0, idx, lag, trend: { beer: 1 }, shocks: [], decks: {}, outages: [], planned: [],
    weather: 'sun', npc, wholesale: { stock: WHOLESALE_CAP }, log: [] };
}

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const round = (x, step) => Math.round(x / step) * step;
const r4 = (x) => Math.round(x * 1e4) / 1e4;

/** Weather of any day: pure function of (seed, day). → 'sun' | 'hot' | 'rain' | 'heavy' */
export function weatherOf(econOrSeed, day) {
  const seed = typeof econOrSeed === 'object' ? econOrSeed.seed : String(econOrSeed);
  const r = dayRng(seed, day, 'weather');
  const { m, d } = dateOf(day);
  const season = seasonOf(day);
  const x = r(), y = r();
  if (season === 'hot') return x < 0.06 ? 'rain' : x < 0.66 ? 'hot' : 'sun';
  if (season === 'rainy') {
    const p = m === 9 || m === 10 ? 0.62 : m === 11 ? 0.35 : 0.5;
    if (x < p) return y < (m >= 9 ? 0.32 : 0.2) ? 'heavy' : 'rain';
    return 'sun';
  }
  return x < 0.08 ? 'rain' : 'sun';
}
export const WEATHER_LABEL = { sun: 'nắng nhẹ', hot: 'nắng nóng', rain: 'mưa', heavy: 'mưa lớn, triều cường' };

// ---------- outages ----------
const OUTAGE_SLOTS = [[480, 1020], [420, 720], [780, 1020], [480, 840], [540, 960]];
function planMonth(econ, y, m) {
  const mk = `${y}-${String(m).padStart(2, '0')}`;
  if (econ.planned.includes(mk)) return;
  econ.planned.push(mk);
  if (econ.planned.length > 6) econ.planned.splice(0, econ.planned.length - 6);
  const r = rng(hashSeed(econ.seed, mk, 'outage'));
  const x = r();
  const n = x < 0.3 ? 0 : x < 0.8 ? 1 : 2;
  const first = dayOf(y, m, 1), last = dayOf(y, m, daysInMonth(y, m));
  const used = new Set();
  for (let i = 0; i < n; i++) {
    const day = int(r, Math.max(first, 7), last); // day ≥ 7 so the first one can still be announced 5 days ahead of day 1+
    const slot = pick(r, OUTAGE_SLOTS);
    if (day < first || used.has(day) || isSunday(day)) continue;
    used.add(day);
    econ.outages.push({ day, from: slot[0], to: slot[1], notice: day - 5 });
  }
  econ.outages.sort((a, b) => a.day - b.day || a.from - b.from);
}
/** Scheduled (or sudden) power cuts on a day. */
export const outagesOn = (econ, day) => econ.outages.filter((o) => o.day === day);
/** true during a power cut. min may be ≥ 1440 (after midnight, same game day). */
export function outageAt(econ, day, min) {
  const t = realTime({ day, min });
  return econ.outages.some((o) => o.day === t.day && t.min >= o.from && t.min < o.to);
}
export const outageText = (o) => `cúp điện ${hourLabel(o.from)}-${hourLabel(o.to)}`;

// ---------- demand (DESIGN 4.2.d, 6.3) ----------
export const GROUPS = ['hocsinh', 'vanphong', 'cudan', 'app', 'khachvanglai'];
const between = (m, a, b) => m >= a && m < b;
function shape(group, day, m) {
  switch (group) {
    case 'vanphong':
      if (isWeekend(day) || isTetHoliday(day)) return between(m, 540, 1260) ? 0.15 : 0.02;
      if (between(m, 420, 510)) return 0.8;
      if (between(m, 510, 690)) return 0.5;
      if (between(m, 690, 810)) return 2.6;
      if (between(m, 810, 1050)) return 0.6;
      if (between(m, 1050, 1140)) return 0.9;
      if (between(m, 1140, 1320)) return 0.25;
      return 0.03;
    case 'hocsinh':
      if (!isSchoolDay(day)) return between(m, 480, 1290) ? 1.0 : 0.03;
      if (between(m, 360, 435)) return 1.2;
      if (between(m, 435, 960)) return 0.05;   // in class (quán net must refuse them anyway)
      if (between(m, 960, 1050)) return 3.2;   // sóng tan trường
      if (between(m, 1050, 1260)) return 0.8;
      return 0.02;
    case 'cudan':
      if (between(m, 300, 540)) return 1.0;
      if (between(m, 540, 690)) return 0.8;
      if (between(m, 690, 810)) return 0.7;
      if (between(m, 810, 960)) return 0.5;
      if (between(m, 960, 1050)) return 0.8;
      if (between(m, 1050, 1140)) return 1.1;
      if (between(m, 1140, 1320)) return 2.0;
      if (between(m, 1320, 1440)) return 0.5;
      return 0.08;
    case 'app':
      if (between(m, 390, 630)) return 0.6;
      if (between(m, 630, 810)) return 1.8;
      if (between(m, 810, 1020)) return 0.6;
      if (between(m, 1020, 1260)) return 1.6;
      if (between(m, 1260, 1380)) return 0.8;
      return 0.1;
    case 'khachvanglai':
      return between(m, 360, 1320) ? 1.0 : 0.2;
    default: return 0;
  }
}
/** Multiplier ≥ 0 for a customer group at (day, min). 1 ≈ an average open hour for that group. */
export function demand(econ, day, min, group) {
  const t = realTime({ day, min });
  let v = shape(group, t.day, t.min);
  if (v <= 0) return 0;
  const w = econ && econ.day === t.day ? econ.weather : weatherOf(econ, t.day);
  const walkIn = group !== 'app';
  if (w === 'rain') v *= walkIn ? 0.6 : 1.6;
  else if (w === 'heavy') v *= walkIn ? 0.45 : 1.9;
  else if (w === 'hot') v *= 1.25;
  if (isAfterPayday(t.day) && group !== 'hocsinh') v *= 1.15;
  else if (isBeforePayday(t.day) && group !== 'hocsinh') v *= 0.9;
  if (isTetHoliday(t.day)) v *= group === 'cudan' ? 0.7 : 0.5;
  else if (isPreTet(t.day) && group === 'cudan') v *= 1.2;
  if (econ && outageAt(econ, t.day, t.min)) v *= 0.85;
  return Math.round(v * 1000) / 1000;
}
/** Average demand over a whole day (used for NPC sales). */
function dayDemand(econ, day, groups) {
  let s = 0;
  for (const [g, wgt] of Object.entries(groups)) {
    let acc = 0;
    for (let m = 0; m < 1440; m += 60) acc += demand(econ, day, m + 30, g);
    s += wgt * (acc / 15); // ~15 active hours per day
  }
  return s;
}

// ---------- prices ----------
/** Current price (VND) of an ingredient (ITEMS key or alias) or a food (data/food.js id). null if unknown. */
export function priceOf(econ, item) {
  const k = key(item);
  if (ITEMS[k]) {
    const it = ITEMS[k];
    const p = it.base * clamp(econ.idx[k] ?? 1, it.lo, it.hi);
    return round(p, it.base < 10000 ? 10 : 100);
  }
  const f = FOOD[item];
  if (f) {
    if (!f.price) return 0;
    const n = econ.npc[f.place];
    const lag = n ? n.lag : econ.lag[f.driver] ?? 1;
    const mode = NPC[f.place]?.mode;
    let p = f.price * (1 + (f.pass ?? 1) * (lag - 1));
    if (mode === 'shrink') p = f.price;
    if (mode === 'hold') p = Math.max(f.price, p);
    return clamp(round(p, 1000), round(f.price * 0.5, 1000), round(f.price * 2, 1000));
  }
  return null;
}
/** Portion factor (≤ 1) when an owner shrinks instead of raising prices (Cô Bánh Mì). */
export function portionOf(econ, foodId) {
  const f = FOOD[foodId];
  const n = f && econ.npc[f.place];
  return n ? n.portion : 1;
}
/** Price bounds of an item, for tests and UI. */
export function boundsOf(item) {
  const k = key(item);
  if (ITEMS[k]) return [ITEMS[k].base * ITEMS[k].lo, ITEMS[k].base * ITEMS[k].hi];
  const f = FOOD[item];
  return f ? [f.price * 0.5, f.price * 2] : null;
}

// ---------- daily tick ----------
function drawDeck(econ, y) {
  if (econ.decks[y]) return;
  const r = rng(hashSeed(econ.seed, y, 'shocks'));
  const n = int(r, 2, 3);
  const picks = shuffle(r, SHOCKS).slice(0, n);
  const first = Math.max(econ.day + 3, dayOf(y, 1, 1)), last = dayOf(y, 12, 20);
  econ.decks[y] = picks.map((s) => ({ id: s.id, day: int(r, Math.min(first, last), last), len: int(r, 20, 45) }));
}

/** Advance the street to `day` (the day that is starting). Mutates econ; → events[] for that day. Idempotent per day. */
export function economyDay(econ, day) {
  if (day <= econ.day) return [];
  // catch up silently on skipped days
  while (econ.day < day - 1) tick(econ, econ.day + 1, true);
  return tick(econ, day, false);
}

function tick(econ, day, quiet) {
  econ.day = day;
  const r = dayRng(econ.seed, day, 'econ');
  const events = [];
  const { y, m, d } = dateOf(day);
  // plan outages this month and next (so 5-day notices can land in the previous month)
  planMonth(econ, y, m);
  const nx = dateOf(day + 12); planMonth(econ, nx.y, nx.m);
  // yearly decks + the beer tax step (thuế bia tăng theo lộ trình tới 2031)
  drawDeck(econ, y);
  if (m === 12 && d >= 20) drawDeck(econ, y + 1);
  if (m === 1 && d === 1 && y <= 2031) { econ.trend.beer = r4((econ.trend.beer || 1) * 1.03); events.push({ type: 'tax', item: 'beer', pct: 3, text: 'Thuế tiêu thụ đặc biệt với bia tăng theo lộ trình' }); }

  // weather
  econ.weather = weatherOf(econ, day);
  events.push({ type: 'weather', v: econ.weather });

  // shocks starting today
  for (const s of econ.decks[y] || []) {
    if (s.day !== day) continue;
    const def = SHOCKS.find((x) => x.id === s.id);
    econ.shocks.push({ id: s.id, item: def.item, pct: def.pct, until: day + s.len });
    econ.idx[def.item] = clamp(econ.idx[def.item] * (1 + def.pct / 2), ITEMS[def.item].lo, ITEMS[def.item].hi);
    events.push({ type: 'price', item: def.item, pct: Math.round(def.pct * 100), text: def.text, shock: s.id });
  }
  econ.shocks = econ.shocks.filter((s) => s.until > day);

  // price indexes: ±1%/day noise, mean-reverting to a seasonal target
  const season = seasonOf(day);
  const preTet = isPreTet(day);
  for (const [k, it] of Object.entries(ITEMS)) {
    if (it.fixed) { econ.idx[k] = 1; continue; }
    let target = econ.trend[k] || 1;
    if (k === 'veg' && season === 'rainy') target *= 1.12;
    if (k === 'ice' && season === 'hot') target *= 1.15;
    if (preTet && ['pork', 'beef', 'shrimp', 'veg', 'fruit', 'egg'].includes(k)) target *= 1.15;
    for (const s of econ.shocks) if (s.item === k) target *= 1 + s.pct;
    let v = econ.idx[k] * (1 + (r() - 0.5) * 0.02) + (target - econ.idx[k]) * 0.06;
    if (k === 'veg' && econ.weather === 'heavy') v *= 1.02;
    econ.idx[k] = r4(clamp(v, it.lo, it.hi));
    econ.lag[k] = r4(econ.lag[k] + (econ.idx[k] - econ.lag[k]) * 0.2); // owners react 3-7 days late
  }

  // outages: notices 5 days ahead, repeated 3 days; sudden cuts in heavy rain
  for (const o of econ.outages) {
    if (day >= o.notice && day < o.notice + 3 && !o.sudden) events.push({ type: 'outage_notice', day: o.day, from: o.from, to: o.to });
    if (o.day === day) events.push({ type: 'outage', day, from: o.from, to: o.to, sudden: !!o.sudden });
  }
  if (econ.weather === 'heavy' && chance(r, 0.08)) {
    const from = int(r, 14, 19) * 60, o = { day, from, to: from + int(r, 1, 2) * 60, notice: day, sudden: true };
    econ.outages.push(o);
    events.push({ type: 'outage', day, from: o.from, to: o.to, sudden: true });
  }
  econ.outages = econ.outages.filter((o) => o.day >= day - 2);

  // calendar-driven
  if (isPayday(day)) events.push({ type: 'payday' });

  // NPC businesses: sell, restock from đầu mối, never die (DESIGN 6.7: "đổi mô hình" instead)
  econ.wholesale.stock = WHOLESALE_CAP; // anh Thịnh's truck came in at night
  for (const [id, def] of Object.entries(NPC)) {
    const n = econ.npc[id];
    n.lag = r4(n.lag + ((econ.idx[def.item] ?? 1) - n.lag) * 0.2);
    if (def.mode === 'raise') n.price = clamp(round(n.basePrice * (1 + def.pass * (n.lag - 1)), 1000), round(n.basePrice * 0.5, 1000), round(n.basePrice * 2, 1000));
    else if (def.mode === 'hold') n.price = Math.max(n.basePrice, clamp(round(n.basePrice * (1 + def.pass * (n.lag - 1)), 1000), n.basePrice, n.basePrice * 2));
    else n.portion = Math.round(clamp(1 / Math.max(1, n.lag), 0.7, 1) * 100) / 100; // shrink: same price, smaller portion
    const elastic = Math.pow(n.price / n.basePrice, -0.8) * (0.7 + (n.stars - 3) * 0.33);
    const want = Math.max(0, Math.round(def.cust * dayDemand(econ, day, def.groups) * elastic * (0.9 + r() * 0.2)));
    const sold = def.service ? want : Math.min(n.stock, want);
    if (!def.service) n.stock -= sold;
    const cost = def.unitCost * n.basePrice * (econ.idx[def.item] ?? 1);
    n.cash = Math.round(n.cash + sold * (n.price - cost) - def.fixed);
    n.soldYesterday = sold;
    const shortage = want - sold;
    n.stars = Math.round(clamp(n.stars + (4.2 - n.stars) * 0.05 + (shortage > 0 ? -0.03 : 0.004) + (r() - 0.5) * 0.04, 3, 4.9) * 100) / 100;
    if (!def.service && n.stock < def.cap * 0.5) {
      const need = def.cap - n.stock, got = Math.min(need, econ.wholesale.stock);
      econ.wholesale.stock -= got; n.stock += got;
    }
    if (n.cash < -20_000_000) { // lỗ lâu: đổi mô hình, cắt giảm, chạy tiếp
      n.cash = 2_000_000; n.remodels++; n.stars = 4;
      events.push({ type: 'remodel', placeId: id });
    }
    if (n.cash > 30_000_000) n.cash = 30_000_000; // the owner takes the profit home
  }

  if (!quiet) {
    econ.log.push(...events.filter((e) => e.type !== 'weather').map((e) => ({ day, ...e })));
    if (econ.log.length > 80) econ.log.splice(0, econ.log.length - 80);
  }
  return quiet ? [] : events;
}

/** Short Vietnamese news lines about `day` (used for "tin cho ngày mai" in the night report). */
export function newsFor(econ, day) {
  const lines = [];
  for (const o of outagesOn(econ, day)) if (!o.sudden) lines.push(`Mai ${outageText(o)} (điện lực đã báo trước 5 ngày).`);
  const w = weatherOf(econ, day);
  if (w === 'rain') lines.push('Mai có mưa: khách ngồi quán ít, đơn app nhiều.');
  if (w === 'heavy') lines.push('Mai mưa lớn, triều cường: hẻm 7 dễ ngập, đi đường vòng.');
  if (w === 'hot') lines.push('Mai nắng nóng: trà sữa đắt hàng, nhớ uống nước.');
  if (isPayday(day)) lines.push('Mai 7 công ty trả lương: quán xá chuẩn bị đông.');
  return lines;
}
