// Khu phố T&M · Trà Sữa Full Topping simulation (design 4.2, acceptance tests T3-T9).
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTeaShop, openShift, shiftTick, serveOrder, closeShift, answerFor, scoreCup, useStock, menuAvailability,
  pearlState, cookPearls, placeOrder, receiveDeliveries, appNet, dayRec, dayPnL, taxFor, closeDay, runChannel,
  recookPearls, doChore, activeBatch, absMin, rankProgress, RANKS, makeOrder, etaFor, trashCup, expireLots,
} from '../site/js/khupho/sim/teashop.js';
import { MENU, INGREDIENTS } from '../site/js/khupho/data/teamenu.js';
import { SUPPLIERS } from '../site/js/khupho/data/suppliers.js';
import { CHANNELS } from '../site/js/khupho/data/channels.js';

const ctxAt = (day, min, extra = {}) => ({ day, min, ...extra });

/** Headless perfect player: serves every ticket the moment it arrives, keeps pearls fresh, does every chore. */
function playPerfect(shop, day, startMin, rank = 2, extra = {}) {
  const shift = openShift(shop, ctxAt(day, startMin, extra), { rank });
  const log = [];
  for (let t = startMin; t <= shift.endMin + 0.001; t += 0.5) {
    for (const e of shiftTick(shop, shift, t)) log.push(e);
    for (const kind of ['den', 'trang']) {
      const b = activeBatch(shop, kind, absMin(day, t), 50);
      const cooking = shop.pearls.some((x) => x.kind === kind && x.cookedMin > absMin(day, t));
      if (!cooking && (!b || absMin(day, t) - b.cookedMin > 7 * 60 || b.grams < 200)) recookPearls(shop, shift, kind, t);
    }
    for (const ch of shift.chores) if (ch.status === 'open') while (!doChore(shop, shift, ch.id).done);
    for (const tk of [...shift.tickets]) { const r = serveOrder(shop, shift, tk.id, answerFor(tk), t); assert.ok(r.ok, r.reason); }
  }
  return { shift, result: closeShift(shop, shift, ctxAt(day, shift.endMin, extra)), log };
}

test('T3: a perfect bot gets grade A on every shift window and rank', () => {
  for (const [startMin, rank] of [[9 * 60, 1], [14 * 60, 2], [18 * 60, 3], [14 * 60, 4]]) {
    const shop = createTeaShop(42);
    const { result } = playPerfect(shop, 3, startMin, rank);
    assert.equal(result.grade, 'A', `start ${startMin} rank ${rank}: ${JSON.stringify(result)}`);
    assert.ok(result.cups >= 6 && result.cups <= 24, `cups ${result.cups}`);
    assert.equal(result.missed, 0);
    assert.equal(result.hours, 4);
    assert.ok(result.pay >= 4 * 25_500, 'never below the regional minimum wage');
  }
});

test('T3: one sugar notch off costs exactly half a point (of 6); two notches cost a whole point', () => {
  const order = { id: 'o1', item: 'truyenthong', size: 'M', sugar: 50, ice: 50, toppings: ['tc_den'], source: 'quay' };
  const perfect = scoreCup(order, answerFor(order));
  assert.equal(perfect.raw, 6);
  assert.equal(perfect.points, 100);
  assert.equal(perfect.grade, 'A');
  for (const s of [30, 70]) {
    const one = scoreCup(order, { ...answerFor(order), sugar: s });
    assert.equal(perfect.raw - one.raw, 0.5);
    assert.ok(Math.abs((perfect.points - one.points) - 100 / 12) < 1e-9);
    assert.ok(one.faults.some((f) => /Đường lệch 1 nấc/.test(f)));
  }
  const two = scoreCup(order, { ...answerFor(order), sugar: 100 });
  assert.equal(perfect.raw - two.raw, 1);
  // wrong size, wrong base, missing lid each cost a whole point
  assert.equal(scoreCup(order, { ...answerFor(order), size: 'L' }).raw, 5);
  assert.equal(scoreCup(order, { ...answerFor(order), tea: 'olong' }).raw, 5);
  assert.equal(scoreCup(order, { ...answerFor(order), sealed: false }).raw, 5);
  assert.equal(scoreCup(order, { ...answerFor(order), sealed: 'wrinkled' }).raw, 5.5);
});

test('T4: 10 traditional cups deduct exactly 150 g tea, 200 g sugar, 600 g creamer; no creamer greys its items', () => {
  const shop = createTeaShop(1);
  cookPearls(shop, 'den', absMin(1, 9 * 60), { ready: true });
  const before = { ...shop.stock };
  const cup = { size: 'M', tea: 'den', milk: 'beo', sugar: 100, ice: 100, toppings: ['tc_den'], shaken: true, sealed: true, labeled: true };
  for (let i = 0; i < 10; i++) assert.ok(useStock(shop, cup, absMin(1, 10 * 60)).ok);
  assert.equal(before.tra_den - shop.stock.tra_den, 150);
  assert.equal(before.duong - shop.stock.duong, 200);
  assert.equal(before.botbeo - shop.stock.botbeo, 600);
  assert.equal(before.ly - shop.stock.ly, 10);
  assert.equal(before.da - shop.stock.da, 1500);
  // out of bột béo: every item that uses it turns grey, the others stay
  shop.stock.botbeo = 30;
  const av = menuAvailability(shop);
  for (const id of Object.keys(MENU)) assert.equal(av[id].ok, MENU[id].milk !== 'beo', id);
  assert.ok(av.truyenthong.missing.includes('botbeo'));
  const fail = useStock(shop, cup, absMin(1, 10 * 60));
  assert.equal(fail.ok, false);
  assert.equal(shop.stock.botbeo, 30, 'nothing is taken when a cup cannot be made');
  // orders only use available items
  const shift = openShift(shop, ctxAt(1, 14 * 60), { rank: 2 });
  for (let i = 0; i < 40; i++) { const o = makeOrder(shift, () => (i * 0.137) % 1); assert.notEqual(MENU[o.item].milk, 'beo'); }
});

test('T5: pearls cooked at 9:00 are hard at 17:01; a cup with them loses points; poured out at close into waste', () => {
  const batch = { kind: 'den', cookedMin: 9 * 60, grams: 1000 };
  assert.equal(pearlState(batch, 9 * 60 + 30), 'fresh');
  assert.equal(pearlState(batch, 13 * 60 + 1), 'ok');
  assert.equal(pearlState(batch, 17 * 60), 'ok');
  assert.equal(pearlState(batch, 17 * 60 + 1), 'hard');
  assert.equal(pearlState({ ...batch, cookedMin: absMin(4, 9 * 60) }, absMin(4, 17 * 60 + 1)), 'hard');
  // in a 14:00 shift the morning pot (9:00) is still in use; serving at 17:01 without re-cooking costs points
  const shop = createTeaShop(5);
  const shift = openShift(shop, ctxAt(2, 14 * 60), { rank: 2 });
  const pot = activeBatch(shop, 'den', absMin(2, 14 * 60), 50);
  assert.equal(pot.cookedMin, absMin(2, 9 * 60));
  shift.tickets.push({ id: 'x1', item: 'truyenthong', size: 'M', sugar: 70, ice: 100, toppings: ['tc_den'], source: 'quay', client: 'T5', at: 17 * 60, patience: 50, price: 25_000 });
  const res = serveOrder(shop, shift, 'x1', answerFor(shift.tickets.at(-1)), 17 * 60 + 1);
  assert.ok(res.ok);
  assert.equal(res.rec.pearl, 'hard');
  assert.equal(res.score.points, 75);
  assert.ok(res.score.faults.some((f) => /nhai như bi/.test(f)));
  shift.now = 18 * 60;
  const out = closeShift(shop, shift, ctxAt(2, 18 * 60));
  assert.ok(out.waste > 0);
  assert.ok(out.wasteNotes.some((n) => /trân châu quá 8 giờ/i.test(n)));
  assert.equal(shop.pearls.filter((b) => b.kind === 'den').length, 0);
});

test('T6: supplier delivery times', () => {
  const shop = createTeaShop(9);
  shop.me.rank = 4;
  // đầu mối: before 22:00 → 6:00 next morning; after 22:00 → the morning after
  const a = placeOrder(shop, 'daumoi', { botbeo: 10, tra_den: 3 }, ctxAt(3, 21 * 60 + 59));
  assert.ok(a.ok, a.reason);
  assert.deepEqual([a.etaDay, a.etaMin], [4, 6 * 60]);
  const b = placeOrder(shop, 'daumoi', { botbeo: 10, tra_den: 3 }, ctxAt(3, 22 * 60 + 5));
  assert.deepEqual([b.etaDay, b.etaMin], [5, 6 * 60]);
  assert.equal(placeOrder(shop, 'daumoi', { tem: 1 }, ctxAt(3, 10 * 60)).ok, false, 'min order 1.000.000đ');
  const stock0 = shop.stock.botbeo;
  receiveDeliveries(shop, 4, 5 * 60 + 59);
  assert.equal(shop.stock.botbeo, stock0);
  receiveDeliveries(shop, 4, 6 * 60);
  assert.equal(shop.stock.botbeo, stock0 + 10_000);
  // chợ: right away (you walk 25 minutes)
  const milk0 = shop.stock.sua_tuoi;
  const c = placeOrder(shop, 'cho', { sua_tuoi: 3 }, ctxAt(4, 10 * 60));
  assert.ok(c.ok);
  assert.deepEqual([c.etaDay, c.etaMin, c.travelMin], [4, 10 * 60, 25]);
  assert.equal(shop.stock.sua_tuoi, milk0 + 3000);
  assert.equal(placeOrder(shop, 'cho', { da: 2 }, ctxAt(4, 10 * 60)).ok, false, 'can only carry 12 kg');
  // Ba & Má: this afternoon
  for (const [min, day, eta] of [[9 * 60, 4, 14 * 60], [15 * 60, 4, 16 * 60 + 30], [17 * 60, 5, 14 * 60]]) {
    const d = placeOrder(shop, 'bama', { xoai_say: 1 }, ctxAt(4, min));
    assert.deepEqual([d.etaDay, d.etaMin], [day, eta], `bama at ${min}`);
    if (d.etaDay === 4) assert.ok(d.etaMin >= 13 * 60 && d.etaMin < 18 * 60, 'in the afternoon');
  }
  // app sỉ: 1-2 days (rain adds one)
  const seen = new Set();
  for (let i = 0; i < 30; i++) { const d = placeOrder(shop, 'khosi', { ly: 1 }, ctxAt(4, 10 * 60 + i)); seen.add(d.etaDay - 4); }
  assert.deepEqual([...seen].sort(), [1, 2]);
  assert.ok([2, 3].includes(etaFor('khosi', { day: 4, min: 600 }, () => 0.99, 'rain').etaDay - 4));
  // tiện lợi: now
  const t = placeOrder(shop, 'tienloi', { da: 1 }, ctxAt(4, 23 * 60));
  assert.deepEqual([t.etaDay, t.etaMin], [4, 23 * 60]);
  // rank gate: a Học việc cannot spend the shop's money
  shop.me.rank = 1;
  assert.equal(placeOrder(shop, 'cho', { sua_tuoi: 1 }, ctxAt(4, 10 * 60)).ok, false);
  assert.equal(SUPPLIERS.length, 5);
});

test('T7: app order net = 38.000 − 9.500 − 950 − 5.000 = 22.550đ', () => {
  assert.equal(appNet(38_000, 0.25, 5_000), 22_550);
  assert.equal(appNet(38_000, 0.25, 0), 27_550);
});

test('T8: the P&L example of design 4.2.i, line by line, ends at 1.324.100đ', () => {
  const shop = createTeaShop(3);
  const day = 10; // a Wednesday
  Object.assign(dayRec(shop, day), {
    counterCups: 120, counterRevenue: 3_600_000, appCups: 40, appGross: 1_520_000, voucherN: 15,
    ingredientCups: 160, ingredientCost: 1_680_000, wasteCost: 60_000, marketing: 120_000, taxRate: 0.045,
    kwh: { normal: 20, peak: 14, off: 2 }, waterM3: 0.5,
  });
  const p = dayPnL(shop, day);
  const v = Object.fromEntries(p.rows.map((r) => [r.key, r.v]));
  assert.deepEqual(v, {
    counter: 3_600_000, app: 1_520_000, appFee: -380_000, appVat: -38_000, voucher: -75_000, net: 4_627_000,
    ingredients: -1_680_000, waste: -60_000, labor: -590_000, power: -151_000, water: -14_500, rent: -400_000,
    gas: -50_000, software: -7_000, marketing: -120_000, tax: -230_400, profit: 1_324_100,
  });
  assert.equal(p.profit, 1_324_100);
  assert.match(p.rows.find((r) => r.key === 'counter').calc, /120 ly x 30\.000đ/);
  assert.match(p.rows.find((r) => r.key === 'app').calc, /40 ly x 38\.000đ/);
  assert.ok(p.notes.some((n) => n.includes('(thông tin giải trí, không phải tư vấn pháp lý)')));
});

test('T9: household tax 2026: ≤ 1 tỷ none + 31/01 reminder; above → event and 4,5% from the next period', () => {
  const low = taxFor(null, 1_000_000_000, 2026);
  assert.equal(low.over, false);
  assert.equal(low.rate, 0);
  assert.equal(low.event, null);
  assert.match(low.reminder, /31\/01\/2027/);
  const high = taxFor(null, 1_000_000_001, 2026);
  assert.equal(high.over, true);
  assert.equal(high.rate, 0.045);
  assert.equal(high.vat + high.pit, 0.045);
  assert.equal(high.event.id, 'vuot1ty');
  assert.match(high.event.text, /thông tin giải trí, không phải tư vấn pháp lý/);
  // crossing the line during a shift: event now, tax from the next day
  const shop = createTeaShop(11);
  shop.yearRevenue[2026] = 999_990_000;
  const { result } = playPerfect(shop, 1, 18 * 60, 3);
  assert.ok(result.events.some((e) => e.id === 'vuot1ty'));
  assert.equal(dayRec(shop, 1).taxRate, 0);
  assert.equal(dayPnL(shop, 1).rows.find((r) => r.key === 'tax').v, 0);
  assert.equal(dayRec(shop, 2).taxRate, 0.045);
  const p6 = (() => { Object.assign(dayRec(shop, 2), { counterCups: 10, counterRevenue: 300_000 }); return dayPnL(shop, 2); })();
  assert.equal(p6.rows.find((r) => r.key === 'tax').v, -13_500);
  assert.equal(taxFor(shop, shop.yearRevenue[2026], 2026).event, null, 'the event fires once a year');
  // under the threshold the day-close in late January reminds about the declaration
  const s2 = createTeaShop(12);
  const jan20 = 80; // 02/11/2026 + 79 days = 20/01/2027
  const ev = closeDay(s2, jan20).events;
  assert.ok(ev.some((e) => e.type === 'tax_reminder' && /31\/01\/2027/.test(e.text)));
});

test('determinism: same seed → same shift and same days; different seed → different', () => {
  const run = (seed) => {
    const shop = createTeaShop(seed);
    const a = playPerfect(shop, 2, 14 * 60, 3).result;
    for (let d = 2; d <= 9; d++) closeDay(shop, d);
    return JSON.stringify({ a, shop });
  };
  assert.equal(run(77), run(77));
  assert.notEqual(run(77), run(78));
  // the sim never calls Math.random
  const orig = Math.random;
  Math.random = () => { throw new Error('Math.random used in the sim'); };
  try { run(5); } finally { Math.random = orig; }
});

test('a long run keeps stock non-negative and the shop alive (60 days)', () => {
  const shop = createTeaShop(2026);
  for (let d = 1; d <= 60; d++) {
    if (d % 3 === 0) playPerfect(shop, d, 14 * 60, 3);
    closeDay(shop, d, { weather: d % 5 === 0 ? 'rain' : 'sun' });
    for (const [id, v] of Object.entries(shop.stock)) assert.ok(v >= 0 && Number.isFinite(v), `${id} = ${v} on day ${d}`);
    const p = dayPnL(shop, d);
    assert.ok(p.gross > 2_000_000, `day ${d} sold ${p.gross}`);
  }
  assert.ok(shop.rating.stars >= 3.5 && shop.rating.stars <= 5);
  assert.ok(Object.keys(shop.days).length <= 40);
});

test('channels: 8 of them, rank-gated, at most 3 at once', () => {
  assert.equal(CHANNELS.length, 8);
  const shop = createTeaShop(4);
  assert.equal(runChannel(shop, 'toroi', ctxAt(2, 10 * 60)).ok, false, 'needs Quản lý');
  shop.me.rank = 5;
  assert.equal(runChannel(shop, 'khaitruong', ctxAt(2, 10 * 60)).ok, false, 'only when opening a shop');
  const cash = shop.cash;
  const r1 = runChannel(shop, 'toroi', ctxAt(2, 10 * 60));
  assert.ok(r1.ok, r1.reason);
  assert.equal(shop.cash, cash - 250_000);
  assert.ok(runChannel(shop, 'fanpage', ctxAt(2, 10 * 60)).ok); // app is already on: 3 now
  const r4 = runChannel(shop, 'xomoi', ctxAt(2, 10 * 60));
  assert.equal(r4.ok, false);
  assert.match(r4.reason, /Tối đa 3/);
  assert.equal(dayRec(shop, 2).marketing, 250_000);
});

test('ranks: 5 playable + 2 locked; promotion needs the listed conditions', () => {
  assert.ok(RANKS.filter((r) => !r.phase2).length >= 5);
  for (const r of RANKS.filter((x) => x.wage)) assert.ok(r.wage >= 25_500, r.name);
  const shop = createTeaShop(8);
  for (let d = 1; d <= 8; d++) playPerfect(shop, d, 14 * 60, 1);
  assert.equal(shop.me.rank, 2, 'Học việc → Nhân viên after 3 shifts, 8 days, average ≥ C');
  const p = rankProgress(shop, { certs: [] });
  assert.equal(p.next.name, 'Nhân viên chính');
  assert.equal(p.checks.find((c) => c.key === 'cert').ok, false);
});

test('trashing a cup puts its cost into waste; Ba & Má mangoes expire after 30 days', () => {
  const shop = createTeaShop(13);
  const shift = openShift(shop, ctxAt(2, 9 * 60), { rank: 2 });
  const cost = trashCup(shop, shift, { size: 'L', tea: 'den', milk: 'beo', sugar: 50, ice: 0, toppings: [] }, 9 * 60 + 5);
  assert.ok(cost > 0 && shift.waste === cost);
  const s2 = createTeaShop(14);
  const m0 = s2.stock.xoai_say;
  assert.ok(!expireLots(s2, 29).notes.some((n) => /Xoài sấy/.test(n)));
  assert.equal(s2.stock.xoai_say, m0);
  const ex = expireLots(s2, 30);
  assert.ok(ex.cost > 0 && ex.notes.some((n) => /Xoài sấy/.test(n)));
  assert.equal(s2.stock.xoai_say, 0);
  assert.ok(INGREDIENTS.xoai_say.shelfDays === 30);
});
