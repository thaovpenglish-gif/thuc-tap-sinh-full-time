// Desk work ("Ngồi vào bàn"): pure rules in site/js/game/desk.js + the payslip bonus and review points in career.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../site/js/game/desk.js';
import { payslip, gradeWeek, emptyWeek, accrue } from '../site/js/game/career.js';
import { newRun } from '../site/js/game/save.js';
import { validateCompany } from './validate-companies.mjs';

const run = (over = {}) => ({ ...newRun({ name: 'x', id: 'd' }), tier: 't1', day: 5, ...over });

test('bonus: only for a passed session, a little more for a perfect one, more once official', () => {
  assert.equal(D.deskBonus('intern', 0.4, false), 0);
  assert.equal(D.deskBonus('intern', 0.7, true), D.BONUS.intern[0]);
  assert.equal(D.deskBonus('intern', 1, true), D.BONUS.intern[1]);
  assert.equal(D.deskBonus('official', 0.7, true), D.BONUS.official[0]);
  assert.ok(D.BONUS.official[0] > D.BONUS.intern[1]);
});

test('three rewarded sessions a day', () => {
  assert.equal(D.canWork(run({ today: { day: 5 } })), true);
  assert.equal(D.canWork(run({ today: { day: 5, desk: D.DESK_PER_DAY - 1 } })), true);
  assert.equal(D.canWork(run({ today: { day: 5, desk: D.DESK_PER_DAY } })), false);
});

test('games do not repeat until the pool runs out, then the least recent comes back', () => {
  const games = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const r = run();
  const seen = [];
  for (let i = 0; i < 3; i++) { const g = D.pickGame(games, { ...r, deskSeen: seen }, 10 + i); assert.ok(!seen.includes(g.id)); seen.push(g.id); }
  assert.equal(D.pickGame(games, { ...r, deskSeen: seen }, 99).id, seen[0]);
});

test('official-only and gated games are skipped for interns', () => {
  const games = [{ id: 'off', official: true }, { id: 'gate', when: (x) => x.flags.ok }, { id: 'free' }];
  for (let s = 0; s < 20; s++) assert.equal(D.pickGame(games, run(), s).id, 'free');
  assert.ok(['off', 'free'].includes(D.pickGame(games, run({ status: 'official' }), 3).id));
});

test('headphones make chatter rarer (drama still happens sometimes)', () => {
  let open = 0, hp = 0;
  for (let s = 0; s < 2000; s++) { if (D.chatterHits(false, s)) open++; if (D.chatterHits(true, s)) hp++; }
  assert.ok(Math.abs(open / 2000 - D.CHATTER_CHANCE) < 0.05, `open ${open / 2000}`);
  assert.ok(Math.abs(hp / 2000 - D.CHATTER_CHANCE_HEADPHONES) < 0.04, `headphones ${hp / 2000}`);
  assert.ok(hp > 0 && hp < open);
});

test('sampling a bank keeps a perfect answer possible', () => {
  const pick = { id: 'p', type: 'pick', pick: 3, show: 6, items: [
    ...[1, 2, 3, 4].map((i) => ({ text: 'r' + i, correct: true })), ...[1, 2, 3, 4, 5].map((i) => ({ text: 'w' + i })),
  ] };
  for (let s = 0; s < 50; s++) {
    const m = D.sampleMini(pick, s);
    assert.equal(m.items.length, 6);
    assert.ok(m.items.filter((x) => x.correct).length >= 3);
    assert.equal(m.id, undefined, 'bank-only fields are stripped');
  }
  const quiz = { type: 'quiz', ask: 3, questions: [1, 2, 3, 4, 5].map((i) => ({ q: 'q' + i, options: ['a', 'b'], correct: 0 })) };
  assert.equal(D.sampleMini(quiz, 1).questions.length, 3);
  const sort = { type: 'sort', show: 4, bins: ['x', 'y'], items: [1, 2, 3, 4, 5, 6].map((i) => ({ text: 't' + i, bin: i % 2 })) };
  assert.equal(D.sampleMini(sort, 1).items.length, 4);
  const order = { type: 'order', items: [{ text: 'a', order: 0 }, { text: 'b', order: 1 }] };
  assert.equal(D.sampleMini(order, 1).items.length, 2);
});

test('the hard-work road to promotion is demanding and closed for a new run', () => {
  assert.equal(D.workPromoReady(run()), false);
  const ready = run({ day: D.WORK_PROMO.minDay, st: { uy: D.WORK_PROMO.uy, dr: 10, nl: 80 }, reviews: [{ grade: 'A' }, { grade: 'A' }], flags: { desk_ok_total: D.WORK_PROMO.deskOk } });
  assert.equal(D.workPromoReady(ready), true);
  assert.equal(D.workPromoReady({ ...ready, flags: { desk_ok_total: D.WORK_PROMO.deskOk - 1 } }), false);
  assert.equal(D.workPromoReady({ ...ready, reviews: [{ grade: 'A' }, { grade: 'B' }] }), false);
  assert.equal(D.workPromoReady({ ...ready, status: 'official' }), false);
});

test('payslip pays the desk bonus on its own line; accrual keeps it', () => {
  const slip = payslip({ accrued: { intern: 1_000_000, official: 0, bonus: 75_000, deskOk: 3 }, tierId: 't1', commit: false });
  assert.equal(slip.net, 1_075_000);
  assert.ok(slip.lines.some((l) => /Thưởng năng suất \(3/.test(l.k) && l.v === 75_000));
  assert.equal(accrue({ ...run({ salary: 2_200_000 }), accrued: { intern: 0, official: 0, bonus: 50_000 } }).bonus, 50_000);
});

test('steady desk work lifts the weekly grade, capped', () => {
  const r = run({ st: { uy: 50, dr: 0, nl: 80 } });
  const base = gradeWeek(emptyWeek(r), r).score;
  const some = gradeWeek({ ...emptyWeek(r), desk: 3, deskOk: 3 }, r).score;
  const lots = gradeWeek({ ...emptyWeek(r), desk: 15, deskOk: 15 }, r).score;
  assert.equal(some, base + 6);
  assert.equal(lots, base + 12);
});

test('the generic desk content (fallback) passes the content checks', async () => {
  for (const g of D.GENERIC_DESK.games) {
    const m = D.sampleMini(g, 3);
    if (m.type === 'pick') assert.ok(m.items.filter((x) => x.correct).length >= (m.pick || 1));
    if (m.type === 'sort') m.items.forEach((x) => assert.ok(x.bin >= 0 && x.bin < m.bins.length));
    if (m.type === 'quiz') m.questions.forEach((q) => assert.ok(q.correct < q.options.length));
  }
  assert.ok(D.GENERIC_DESK.chatter.every((c) => c.chat.length >= 2 && c.scene.some((n) => n.c)));
});

test('T&M desk content validates', async () => {
  const { errors, warns, stats } = await validateCompany('tm');
  assert.deepEqual(errors, []);
  assert.deepEqual(warns.filter((w) => /desk/.test(w)), []);
  assert.ok(stats.deskGames >= 8 && stats.deskChatter >= 6);
});
