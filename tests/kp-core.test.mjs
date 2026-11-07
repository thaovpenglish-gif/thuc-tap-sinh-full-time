// Khu phố T&M · core sim: calendar, rng, world clock, needs, bills (T15), no game over (T14), Xóm Ơi (T17).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rng, pick, int, hashSeed } from '../site/js/khupho/sim/rng.js';
import * as C from '../site/js/khupho/sim/calendar.js';
import * as W from '../site/js/khupho/sim/world.js';
import { householdPower } from '../site/js/khupho/sim/economy.js';
import { messagesFor, inQuietHours } from '../site/js/khupho/sim/xomoi.js';
import { createPlayer, spend, eat, NEED_LOW } from '../site/js/khupho/sim/player.js';
import { PLACES, PLACE, ENTERABLE, openAt } from '../site/js/khupho/data/places.js';
import { PEOPLE, RELATIONS, peopleAt } from '../site/js/khupho/data/people.js';
import { FOODS } from '../site/js/khupho/data/food.js';

/** Play until the start of `day` (sleeping each night). */
function playTo(kp, day) { const reports = []; while (kp.time.day < day) reports.push(W.sleep(kp)); return reports; }

test('rng: deterministic mulberry32, string seeds, helpers in range', () => {
  const a = rng(42), b = rng(42);
  for (let i = 0; i < 50; i++) assert.equal(a(), b());
  const s1 = rng('khupho'), s2 = rng('khupho');
  assert.equal(s1(), s2());
  assert.notEqual(hashSeed('ab', 'c'), hashSeed('a', 'bc'));
  const r = rng(7);
  for (let i = 0; i < 200; i++) { const x = int(r, 3, 5); assert.ok(x >= 3 && x <= 5 && Number.isInteger(x)); }
  assert.ok(['x', 'y'].includes(pick(r, ['x', 'y'])));
});

test('calendar: day 1 = Thứ Hai 02/11/2026, paydays, rent days, Tết 06/02/2027', () => {
  assert.deepEqual(C.dateOf(1).label, 'Thứ Hai 02/11/2026');
  assert.equal(C.dateOf(1).weekday, 1);
  assert.equal(C.dateOf(7).weekday, 0); // Chủ nhật 08/11
  assert.equal(C.dateOf(30).label, 'Thứ Ba 01/12/2026');
  assert.equal(C.dayOf(2026, 11, 2), 1);
  // paydays: day-of-month 30, or the last day of February
  assert.ok(C.isPayday(C.dayOf(2026, 11, 30)));
  assert.ok(!C.isPayday(C.dayOf(2026, 12, 31)));
  assert.ok(C.isPayday(C.dayOf(2026, 12, 30)));
  assert.ok(C.isPayday(C.dayOf(2027, 2, 28)));
  assert.ok(!C.isPayday(C.dayOf(2027, 2, 27)));
  // rent: day-of-month 5
  assert.ok(C.isRentDay(4)); // 05/11/2026
  assert.ok(C.isRentDay(C.dayOf(2026, 12, 5)));
  assert.ok(!C.isRentDay(5));
  // Tết Đinh Mùi
  const tet = C.dayOf(2027, 2, 6);
  assert.equal(C.dateOf(tet).label, 'Thứ Bảy 06/02/2027');
  assert.ok(C.EVENTS.some((e) => e.date === '2027-02-06' && e.id === 'tet'));
  assert.ok(C.eventsOn(tet).some((e) => e.id === 'tet'));
  assert.ok(C.isTetHoliday(tet) && !C.isTetHoliday(tet + 10));
  assert.ok(C.eventsOn(C.dayOf(2026, 11, 20)).some((e) => e.id === 'nhagiao'));
  assert.ok(C.eventsOn(C.dayOf(2027, 11, 20)).some((e) => e.id === 'nhagiao')); // annual
  // EVENTS sorted, all after the start
  assert.ok(C.EVENTS.every((e, i, a) => i === 0 || a[i - 1].date <= e.date));
  assert.ok(C.EVENTS.every((e) => C.dayOfIso(e.date) >= 1));
  // clock helpers
  assert.equal(C.clockLabel(1530), '01:30');
  assert.deepEqual(C.realTime({ day: 3, min: 1500 }), { day: 4, min: 60 });
  assert.equal(C.powerPeriod(1, 18 * 60), 'peak');
  assert.equal(C.powerPeriod(7, 18 * 60), 'normal'); // Sunday: no peak
  assert.equal(C.powerPeriod(1, 3 * 60), 'low');
});

test('data: 32 places with hours, 7 enterable in phase 1, 157 people, foods priced', () => {
  assert.equal(PLACES.length, 32);
  assert.deepEqual([...ENTERABLE].sort(), ['bama', 'cho', 'daumoi', 'phongtro', 'photo', 'tienloi', 'trasua']);
  for (const p of PLACES) { assert.ok(p.name && p.desc && p.hoursText && p.kind, p.id); assert.ok(Array.isArray(p.hours.all), p.id); }
  assert.equal(PEOPLE.length, 157);
  assert.equal(RELATIONS.length, 230);
  assert.ok(peopleAt('trasua').some((p) => p.id === 'kp:nhung'));
  assert.ok(FOODS.every((f) => Number.isInteger(f.price) && f.min > 0));
  // hours: net closes at 22h by law, cơm tấm runs past midnight, tiệm tóc closed Monday morning
  assert.ok(openAt('net', 2, 21 * 60 + 59) && !openAt('net', 2, 22 * 60) && !openAt('net', 2, 7 * 60 + 59));
  assert.ok(openAt('comtam', 3, 30)); // 0h30 Wednesday, yesterday's 17h-1h range
  assert.ok(!openAt('cattoc', 1, 9 * 60) && openAt('cattoc', 2, 9 * 60));
  assert.ok(!openAt('dienluc', 0, 9 * 60) && openAt('dienluc', 6, 9 * 60));
  assert.ok(openAt('tienloi', 0, 3 * 60));
  // no em dash anywhere in the Vietnamese data
  const text = JSON.stringify({ PLACES, FOODS, PEOPLE, RELATIONS });
  assert.ok(!text.includes('\u2014'));
});

test('player: needs decay by activity, clamp 0..100, eat and the third coffee', () => {
  const p = createPlayer('Vy');
  assert.equal(p.money, 3_000_000);
  assert.deepEqual(p.needs, { food: 80, energy: 90, mood: 70 });
  spend(p, 240, 'work');
  assert.ok(p.needs.energy < 70 && p.needs.energy > 50, String(p.needs.energy)); // a 4h shift ≈ −26
  assert.ok(p.needs.food < 80);
  spend(p, 100000, 'walk');
  assert.equal(p.needs.food, 0); assert.equal(p.needs.energy, 0);
  const q = createPlayer('Q'); q.needs.energy = 50;
  eat(q, 'caphe', 15000); eat(q, 'caphe', 15000);
  assert.equal(q.needs.energy, 80);
  eat(q, 'caphe', 15000);
  assert.equal(q.needs.energy, 75); // ly thứ ba phản tác dụng
  assert.equal(q.money, 3_000_000 - 45000);
  assert.equal(eat(q, 'tunau', 0).ok, false); // nothing in the pantry
  eat(q, 'nguyenlieu', 25000);
  assert.equal(eat(q, 'tunau', 0).ok, true);
  assert.ok(NEED_LOW === 25);
});

test('world: newGame, clock, opening hours, buying food, canWork reasons', () => {
  const kp = W.newGame({ name: 'Vy', seed: 'core-1' });
  assert.deepEqual(kp.time, { day: 1, min: 390 });
  assert.equal(kp.player.money, 3_000_000);
  assert.ok(W.isOpen(kp, 'tienloi'));
  assert.ok(!W.isOpen(kp, 'trasua')); // 6h30, opens at 9h
  assert.equal(W.canWork(kp, 'trasua').ok, false);
  assert.equal(W.canWork(kp, 'caphe').ok, false); // no job there in phase 1
  const ev = W.advance(kp, 150, 'walk');
  assert.deepEqual(kp.time, { day: 1, min: 540 });
  assert.ok(ev.some((e) => e.type === 'open' && e.placeId === 'trasua'));
  assert.ok(W.canWork(kp, 'trasua').ok);
  const before = kp.player.money;
  const buy = W.buyFood(kp, 'mily');
  assert.ok(buy.ok);
  assert.equal(kp.player.money, before - buy.price);
  W.advance(kp, 30, 'walk');
  assert.equal(W.buyFood(kp, 'banhmi').ok, false); // 9h40: the cart left at 9h30
  // late night: advance stops at 2h and asks for sleep
  const ev2 = W.advance(kp, 30 * 60, 'idle');
  assert.ok(ev2.some((e) => e.type === 'must_sleep' || e.type === 'faint'));
  assert.ok(kp.time.min <= W.LATEST);
});

test('world: workShift pays (min wage floor), logs the profile, moves the clock, max 2 shifts unless energy > 60', () => {
  const kp = W.newGame({ name: 'Vy', seed: 'core-2' });
  W.advance(kp, 150, 'idle'); // 9h
  const r = W.workShift(kp, 'trasua', { hours: 4, pay: 50_000, tips: 12_000, grade: 'B', rank: 1, role: 'Học việc' });
  assert.equal(r.pay, 4 * 25_500); // floored to the 2026 region-I minimum wage
  assert.equal(kp.player.money, 3_000_000 + 102_000 + 12_000);
  assert.equal(kp.time.min, 540 + 240);
  assert.equal(r.entry.daysWorked, 1);
  assert.equal(kp.job.placeId, 'trasua');
  assert.equal(kp.profile.entries[0].ratings.B, 1);
  W.buyFood(kp, 'comtam_trung'); // cơm tấm closed at 13h → fails, fine
  W.workShift(kp, 'trasua', { hours: 4, pay: 104_000, grade: 'A' });
  assert.equal(kp.profile.entries[0].daysWorked, 1); // same day, still 1 day
  assert.equal(kp.profile.entries[0].shifts, 2);
  kp.player.needs.energy = 40;
  const c = W.canWork(kp, 'trasua');
  assert.equal(c.ok, false);
  assert.match(c.reason, /tối đa 2 ca/);
  W.sleep(kp);
  W.advance(kp, 180, 'idle');
  W.workShift(kp, 'trasua', { hours: 4, pay: 104_000, grade: 'A' });
  assert.equal(kp.profile.entries[0].daysWorked, 2);
});

test('world: registerShop hooks get advance/sleep calls without a static import', () => {
  const calls = { adv: 0, sleep: 0 };
  W.registerShop('trasua', {
    create: (seed) => ({ seed, cash: 0, deliveries: [{ min: 600, item: 'creamer' }] }),
    onAdvance: (shop, kp, from, to) => { calls.adv++; const due = shop.deliveries.filter((d) => d.min > from.min && d.min <= to.min); return due.map((d) => ({ type: 'delivery', item: d.item })); },
    onSleep: (shop, kp, day) => { calls.sleep++; return { lines: [`Quán chốt sổ ngày ${day}`] }; },
  });
  try {
    const kp = W.newGame({ name: 'Vy', seed: 'core-hooks' });
    assert.ok(kp.shops.trasua && kp.shops.trasua.cash === 0);
    const ev = W.advance(kp, 300, 'walk');
    assert.ok(calls.adv > 0);
    assert.ok(ev.some((e) => e.type === 'delivery' && e.placeId === 'trasua'));
    const rep = W.sleep(kp);
    assert.equal(calls.sleep, 1);
    assert.ok(rep.shops.includes('Quán chốt sổ ngày 1'));
  } finally { W.unregisterShop('trasua'); }
});

test('T15: rent on day-of-month 5; electricity at 4.000đ/số before tạm trú, tiered after', () => {
  const a = W.newGame({ name: 'A', seed: 'bills' });
  const b = W.newGame({ name: 'B', seed: 'bills' });
  a.player.money = b.player.money = 20_000_000;
  assert.equal(W.registerTamTru(b).ok, true);
  const dec5 = C.dayOf(2026, 12, 5);
  playTo(a, dec5 - 1); playTo(b, dec5 - 1);
  const ra = W.sleep(a), rb = W.sleep(b);
  assert.equal(a.time.day, dec5);
  const rentA = a.ledger.find((l) => l.k === 'rent' && l.day === dec5);
  assert.equal(rentA.v, -W.RENT);
  const powA = a.ledger.find((l) => l.k === 'power' && l.day === dec5);
  const powB = b.ledger.find((l) => l.k === 'power' && l.day === dec5);
  const kwh = 30 * W.KWH_PER_NIGHT; // 05/11 → 04/12: 30 nights
  assert.equal(powA.v, -kwh * 4000);
  assert.equal(powB.v, -householdPower(kwh));
  assert.equal(householdPower(90), 184_800); // 90 x 1.901 + VAT 8%
  assert.ok(ra.bills.some((x) => x.k === 'rent') && rb.bills.some((x) => x.k === 'power'));
  assert.ok(ra.law && ra.notes.some((n) => n.includes('thông tin giải trí, không phải tư vấn pháp lý')));
  // November's rent was paid at move-in; only electricity on 05/11
  assert.ok(!a.ledger.some((l) => l.k === 'rent' && l.day === 4));
  // nothing on other days
  assert.ok(a.ledger.filter((l) => l.k === 'rent').every((l) => C.isRentDay(l.day)));
});

test('T14: money < 0 → owner credit + shared meal; energy 0 → clinic + lost shift; never a game over', () => {
  const kp = W.newGame({ name: 'Vy', seed: 'broke' });
  kp.player.money = -150_000;
  const rep = W.sleep(kp);
  assert.ok(rep.codes.includes('owner_credit'));
  assert.ok(rep.codes.includes('shared_meal'));
  assert.ok(kp.player.money >= 0);
  assert.ok(kp.player.rentDebt >= 150_000);
  // the shared meal is served on Sunday evening, free
  playTo(kp, 7); // Chủ nhật 08/11
  assert.equal(C.dateOf(kp.time.day).weekday, 0);
  kp.player.needs.food = 60;
  W.advance(kp, 18 * 60 - kp.time.min, 'idle');
  const hungry = kp.player.needs.food;
  const meal = W.buyFood(kp, 'comchung');
  assert.ok(meal.ok, meal.reason);
  assert.equal(meal.price, 0);
  assert.ok(kp.player.needs.food >= hungry + 45);
  assert.equal(W.buyFood(kp, 'comchung').ok, false); // once per Sunday
  // rent day with an empty wallet: cô Ba Lành lets you owe
  const k2 = W.newGame({ name: 'Vy', seed: 'broke-2' });
  playTo(k2, C.dayOf(2026, 12, 5) - 1);
  k2.player.money = 200_000;
  const r2 = W.sleep(k2);
  assert.ok(r2.codes.includes('rent_owed'));
  assert.ok(k2.player.rentDebt >= W.RENT);
  assert.ok(k2.player.money >= 0);
  // exhaustion: faint, wake at the clinic, today's shift is lost
  const k3 = W.newGame({ name: 'Vy', seed: 'tired' });
  W.advance(k3, 180, 'idle'); // 9h30
  k3.player.needs.energy = 2;
  const ev = W.advance(k3, 60, 'work');
  const f = ev.find((e) => e.type === 'faint');
  assert.ok(f && f.placeId === 'tramyte');
  assert.equal(k3.player.at, 'tramyte');
  assert.equal(k3.player.money, 3_000_000 - W.CLINIC_FEE);
  assert.ok(k3.player.needs.energy > 0);
  const c = W.canWork(k3, 'trasua');
  assert.equal(c.ok, false);
  assert.match(c.reason, /Bác sĩ Lâm/);
  const rep3 = W.sleep(k3);
  assert.ok(rep3.codes.includes('clinic'));
  W.advance(k3, 180, 'idle');
  assert.ok(W.canWork(k3, 'trasua').ok); // next day is fine again
  // with BHYT the visit costs nothing
  const k4 = W.newGame({ name: 'Vy', seed: 'tired' });
  k4.player.bhyt = 'self'; k4.player.needs.energy = 1;
  W.advance(k4, 60, 'work');
  assert.equal(k4.player.money, 3_000_000);
});

test('T17: a game week has ≥ 7 Xóm Ơi messages, none between 23:00 and 06:00 unless drama', () => {
  const kp = W.newGame({ name: 'Vy', seed: 'phone' });
  playTo(kp, 8);
  const week = kp.xomoi.msgs.filter((m) => m.day >= 1 && m.day <= 7);
  assert.ok(week.length >= 7, String(week.length));
  for (let d = 1; d <= 7; d++) { const n = week.filter((m) => m.day === d).length; assert.ok(n >= 3 && n <= 8, `day ${d}: ${n}`); }
  assert.ok(week.every((m) => !inQuietHours(m.min)));
  assert.ok(week.every((m) => !m.text.includes('\u2014')));
  assert.ok(week.filter((m) => m.law).every((m) => m.text.includes('thông tin giải trí, không phải tư vấn pháp lý')));
  // drama is the only exception
  const r = rng(5);
  const withDrama = messagesFor([{ type: 'weather', v: 'rain' }], { day: 10, drama: true }, r);
  assert.ok(withDrama.some((m) => m.drama && inQuietHours(m.min)));
  assert.ok(withDrama.filter((m) => !m.drama).every((m) => !inQuietHours(m.min)));
  // an outage notice reaches the group
  const notice = messagesFor([{ type: 'outage_notice', day: 20, from: 480, to: 1020 }], { day: 15 }, rng(1));
  assert.ok(notice.some((m) => /cúp điện 8h-17h/.test(m.text)));
  // messages are delivered as the clock passes them
  const k2 = W.newGame({ name: 'Vy', seed: 'phone-2' });
  const ev = W.advance(k2, 16 * 60, 'idle');
  assert.ok(ev.filter((e) => e.type === 'xomoi').length >= 1);
  assert.ok(W.status(k2).unread >= 2);
  W.markXomoiRead(k2);
  assert.equal(W.status(k2).unread, 0);
});

test('night report: money in/out with reasons, tomorrow news, profile line', () => {
  const kp = W.newGame({ name: 'Vy', seed: 'night' });
  W.advance(kp, 150, 'idle');
  W.workShift(kp, 'trasua', { hours: 4, pay: 104_000, tips: 5_000, grade: 'A' });
  W.buyFood(kp, 'mily');
  const rep = W.sleep(kp);
  assert.equal(rep.day, 1);
  assert.equal(rep.date, 'Thứ Hai 02/11/2026');
  assert.ok(rep.money.in.some((l) => l.k === 'pay' && l.v === 104_000));
  assert.ok(rep.money.in.some((l) => l.k === 'tip'));
  assert.ok(rep.money.out.some((l) => l.k === 'food'));
  assert.equal(rep.money.net, 104_000 + 5_000 - rep.money.out.reduce((s, l) => s - l.v, 0));
  assert.ok(rep.profile.some((s) => s.includes('Trà Sữa Full Topping') && s.includes('tổng 1 ngày')));
  assert.ok(Array.isArray(rep.tomorrow));
  assert.ok(rep.needs.energy >= 90);
  assert.equal(kp.time.day, 2);
  assert.equal(kp.time.min, W.WAKE);
  // a scheduled outage appears in tomorrow's news the night before
  const k2 = W.newGame({ name: 'Vy', seed: 'night-out' });
  let found = null;
  for (let i = 0; i < 90 && !found; i++) {
    const day = k2.time.day + 1;
    const r = W.sleep(k2);
    if (k2.economy.outages.some((o) => o.day === day && !o.sudden)) found = r;
  }
  assert.ok(found, 'an outage within 90 days');
  assert.ok(found.tomorrow.some((s) => /^Mai cúp điện \d+h(\d\d)?-\d+h/.test(s)), JSON.stringify(found.tomorrow));
});
