// Khu phố T&M · economy: prices, demand, outages, NPC shops; T13 (365 headless days, deterministic, in bounds).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../site/js/khupho/sim/economy.js';
import * as W from '../site/js/khupho/sim/world.js';
import { dateOf, dayOf } from '../site/js/khupho/sim/calendar.js';
import { FOODS } from '../site/js/khupho/data/food.js';

function runEconomy(seed, days) {
  const e = E.createEconomy(seed);
  const all = [];
  for (let d = 1; d <= days; d++) all.push(...E.economyDay(e, d).map((x) => ({ d, ...x })));
  return { e, all };
}

/** A headless player who eats, works the tea shop most days and sleeps. */
function headless(seed, days) {
  const kp = W.newGame({ name: 'Bot', seed, now: 0 });
  const checks = [];
  for (let d = 1; d <= days; d++) {
    W.advance(kp, 60, 'walk');
    if (W.canBuyFood(kp, 'banhmi').ok) W.buyFood(kp, 'banhmi');
    W.advance(kp, 150, 'walk');
    if (W.canWork(kp, 'trasua').ok && d % 7 !== 0) W.workShift(kp, 'trasua', { hours: 4, pay: 104_000, tips: (d % 5) * 3000, grade: 'ABCD'[d % 4] });
    if (W.canBuyFood(kp, 'comtam').ok) W.buyFood(kp, 'comtam'); else W.buyFood(kp, 'mily');
    W.advance(kp, 240, 'walk');
    if (d % 3 === 0 && W.canWork(kp, 'trasua').ok) W.workShift(kp, 'trasua', { hours: 4, pay: 104_000, grade: 'B' });
    if (W.canBuyFood(kp, 'comtam').ok) W.buyFood(kp, 'comtam'); else W.buyFood(kp, 'mily');
    W.advance(kp, 90, 'idle');
    const rep = W.sleep(kp);
    checks.push({ money: kp.player.money, codes: rep.codes });
  }
  return { kp, checks };
}

test('base prices and electricity numbers from research', () => {
  const e = E.createEconomy('p');
  assert.equal(E.priceOf(e, 'creamer'), 74_000);
  assert.equal(E.priceOf(e, 'botbeo'), 74_000); // alias
  assert.equal(E.priceOf(e, 'power_biz'), 3089);
  assert.equal(E.priceOf(e, 'banhmi'), 25_000);
  assert.equal(E.priceOf(e, 'comtam'), 35_000);
  assert.equal(E.priceOf(e, 'nope'), null);
  assert.equal(E.householdPower(90), 184_800);
  assert.equal(E.householdPower(150), Math.round(((100 * 1901 + 50 * 2289) * 1.08) / 100) * 100);
  assert.equal(E.landlordPower(90), 360_000);
});

test('weather and demand: rain moves walk-ins to the app, school wave at 16h, offices empty on Sunday', () => {
  const e = E.createEconomy('d');
  E.economyDay(e, 1);
  for (const g of E.GROUPS) for (let m = 0; m < 1440; m += 30) assert.ok(E.demand(e, 1, m, g) >= 0);
  const mon = 1, sun = 7;
  assert.ok(E.demand(e, mon, 16 * 60 + 30, 'hocsinh') > 2 * E.demand(e, mon, 10 * 60, 'hocsinh'));
  assert.ok(E.demand(e, mon, 12 * 60, 'vanphong') > 5 * E.demand(e, sun, 12 * 60, 'vanphong'));
  // find a rainy and a sunny weekday with the same shape and compare
  let rain = null, sun2 = null;
  for (let d = 1; d < 60 && !(rain && sun2); d++) {
    const w = E.weatherOf(e, d), wd = dateOf(d).weekday;
    if (wd >= 2 && wd <= 4 && dateOf(d).d > 5 && dateOf(d).d < 25) { if (w === 'rain' && !rain) rain = d; if (w === 'sun' && !sun2) sun2 = d; }
  }
  assert.ok(rain && sun2);
  const r = { ...e, day: -1 }; // force weatherOf lookups
  assert.ok(E.demand(r, rain, 12 * 60, 'app') > E.demand(r, sun2, 12 * 60, 'app'));
  assert.ok(E.demand(r, rain, 12 * 60, 'vanphong') < E.demand(r, sun2, 12 * 60, 'vanphong'));
  assert.equal(E.weatherOf('d', 40), E.weatherOf(e, 40)); // pure function of (seed, day)
});

test('outages: announced at least 5 days ahead, 3 days in a row, and outageAt is true inside the window', () => {
  const { e, all } = runEconomy('outage-seed', 200);
  const notices = all.filter((x) => x.type === 'outage_notice');
  const planned = all.filter((x) => x.type === 'outage' && !x.sudden);
  assert.ok(planned.length >= 2, String(planned.length));
  for (const o of planned) {
    const ns = notices.filter((n) => n.day === o.day && n.from === o.from).map((n) => n.d);
    assert.ok(ns.length === 3 || Math.min(...ns) <= 1, `outage day ${o.day}: notices ${ns}`);
    assert.ok(Math.min(...ns) <= o.day - 5 || Math.min(...ns) === 1);
    assert.deepEqual(ns, ns.slice().sort((a, b) => a - b));
  }
  const fresh = E.createEconomy('outage-seed');
  for (let d = 1; d <= planned[0].day; d++) E.economyDay(fresh, d);
  const o = planned[0];
  assert.ok(E.outageAt(fresh, o.day, o.from + 1));
  assert.ok(!E.outageAt(fresh, o.day, o.to));
  assert.ok(e.outages.length < 10); // old ones are pruned
});

test('shocks and seasons move prices but stay in bounds; Tết pushes food up', () => {
  const { e, all } = runEconomy('shock', 500);
  assert.ok(all.some((x) => x.type === 'price'));
  assert.ok(all.some((x) => x.type === 'tax' && x.item === 'beer'));
  for (const k of Object.keys(E.ITEMS)) {
    const [lo, hi] = E.boundsOf(k);
    const p = E.priceOf(e, k);
    assert.ok(p >= lo - 10 && p <= hi + 10, `${k} ${p}`);
  }
  const t = E.createEconomy('tet');
  const tet = dayOf(2027, 2, 6);
  for (let d = 1; d <= tet - 3; d++) E.economyDay(t, d);
  assert.ok(t.idx.pork > 1.0 || t.idx.veg > 1.0);
});

test('T13: 365 headless days, fixed seed: no negative stock, prices in bounds, no shop dies, deterministic', () => {
  const seed = 'T13-seed';
  const { e } = (() => {
    const e = E.createEconomy(seed);
    for (let d = 1; d <= 365; d++) {
      E.economyDay(e, d);
      for (const k of Object.keys(E.ITEMS)) {
        const [lo, hi] = E.boundsOf(k);
        const p = E.priceOf(e, k);
        assert.ok(Number.isFinite(p) && p >= lo - 10 && p <= hi + 10, `day ${d} ${k}=${p}`);
      }
      for (const f of FOODS) {
        if (!f.price) continue;
        const p = E.priceOf(e, f.id), [lo, hi] = E.boundsOf(f.id);
        assert.ok(p >= lo && p <= hi, `day ${d} ${f.id}=${p}`);
      }
      for (const n of Object.values(e.npc)) {
        assert.ok(n.stock >= 0, `day ${d} ${n.id} stock ${n.stock}`);
        assert.ok(Number.isFinite(n.cash) && n.price > 0 && n.stars >= 3 && n.stars <= 4.9, `day ${d} ${n.id}`);
      }
      assert.ok(e.wholesale.stock >= 0);
    }
    return { e };
  })();
  assert.equal(Object.keys(e.npc).length, 9); // every NPC business is still there
  // whole world, played headless twice with the same seed → identical JSON
  const a = headless(seed, 365), b = headless(seed, 365);
  assert.equal(a.kp.time.day, 366);
  assert.equal(JSON.stringify(a.kp), JSON.stringify(b.kp));
  assert.ok(a.kp.profile.totals.days > 250);
  assert.ok(a.checks.every((c) => c.money >= 0)); // the landlord always covers a negative wallet overnight
  for (const n of Object.values(a.kp.economy.npc)) assert.ok(n.stock >= 0);
  // a different seed gives a different street
  const c = headless('another', 30), d = headless(seed, 30);
  assert.notEqual(JSON.stringify(c.kp.economy.idx), JSON.stringify(d.kp.economy.idx));
});
