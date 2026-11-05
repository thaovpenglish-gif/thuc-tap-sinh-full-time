// Career systems: calendar, scheduling, moods, life events, payroll, weekly review.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../site/js/game/career.js';
import { newRun } from '../site/js/game/save.js';
import { tick, shiftTasks, resolveAll, planTasks } from '../site/js/game/tasks.js';

test('calendar: day 1 is Monday, weekends are skipped', () => {
  assert.equal(C.weekdayName(1), 'Thứ Hai');
  assert.equal(C.weekdayName(5), 'Thứ Sáu');
  assert.ok(C.isFriday(5) && C.isFriday(12));
  assert.ok(C.isWeekend(6) && C.isWeekend(7) && !C.isWeekend(8));
  assert.equal(C.nextWorkday(5), 8);
  assert.equal(C.nextWorkday(1), 2);
  assert.equal(C.weekOf(8), 2);
  assert.equal(C.workdaysBetween(1, 45), 33);
});

test('episodes land on workdays, fixed days first, no collisions', () => {
  const eps = [{ id: 'a', day: 1 }, { id: 'b', day: 6 }, { id: 'c', minDay: 2, maxDay: 4 }, { id: 'd' }, { id: 'e' }, { id: 'o', official: true }];
  const plan = C.scheduleEpisodes(eps, 42);
  const days = Object.keys(plan).map(Number);
  assert.equal(plan[1], 'a');
  assert.equal(plan[8], 'b');                       // day 6 is Saturday → moved to Monday 8
  assert.ok(days.every((d) => !C.isWeekend(d) && d <= 45));
  assert.equal(new Set(Object.values(plan)).size, days.length);
  assert.ok(!Object.values(plan).includes('o'));    // official arc is scheduled later
  const cDay = days.find((d) => plan[d] === 'c');
  assert.ok(cDay >= 2 && cDay <= 4);
  assert.deepEqual(C.scheduleEpisodes(eps, 42), plan); // deterministic
});

test('promotion arc is placed after the promotion day, in order, and always keeps the ending', () => {
  const plan = C.scheduleArc(['x', 'y', 'z'], 19, { 23: 'busy', 40: 'later' }, 2);
  const days = ['x', 'y', 'z'].map((id) => Number(Object.keys(plan).find((d) => plan[d] === id)));
  assert.ok(days.every((d) => d > 19 && !C.isWeekend(d)));
  assert.ok(days[0] < days[1] && days[1] < days[2]);
  assert.equal(days[0], 22); // promoted at the Friday-19 review → first arc episode on Monday 22
  assert.equal(plan[40], 'later');
  assert.equal(plan[23], 'busy'); // intern episodes are kept when there is room
  // promoted at the day-40 review: 3 workdays left (43, 44, 45) → gap shrinks to 1, all four cannot fit → first + ending kept
  const late = C.scheduleArc(['a', 'b', 'c', 'end'], 40, {}, 2);
  const vals = Object.values(late);
  assert.ok(vals.includes('a') && vals.includes('end'));
  assert.equal(late[45], 'end');
  assert.equal(Object.keys(late).length, 3);
});

test('moods respect their conditions', () => {
  const r = newRun({ name: 'x', id: 'm' });
  for (let s = 1; s < 60; s++) {
    const id = C.pickMood(r, s);
    assert.notEqual(id, 'broke');   // has 2,000,000
    assert.notEqual(id, 'payday');  // no payslip yet
  }
  assert.equal(C.moodInfo('nope').id, 'meh');
});

test('life events: about half the evenings, never twice in a row, conditional ones filtered', () => {
  const r = newRun({ name: 'x', id: 'l' });
  let n = 0;
  for (let s = 1; s <= 400; s++) { const e = C.pickLifeEvent(r, s * 7919); if (e) { n++; assert.notEqual(e.id, 'csgt_alcohol'); } }
  assert.ok(n > 150 && n < 300, `got ${n}`);
  r.flags.last_life = 'nothing';
  for (let s = 1; s <= 100; s++) { const e = C.pickLifeEvent(r, s * 31); if (e) assert.notEqual(e.id, 'nothing'); }
});

test('payroll: interns, 10% withholding at 5 million, official insurance', () => {
  const t1 = C.payslip({ accrued: { intern: 1_000_000, official: 0 }, tierId: 't1', commit: false });
  assert.equal(t1.net, 1_000_000);
  const t5 = C.payslip({ accrued: { intern: 5_000_000, official: 0 }, tierId: 't5', commit: false });
  assert.equal(t5.net, 4_500_000);
  const t5c = C.payslip({ accrued: { intern: 5_000_000, official: 0 }, tierId: 't5', commit: true });
  assert.equal(t5c.net, 5_000_000);
  const off = C.payslip({ accrued: { intern: 0, official: 15_000_000 }, tierId: 't3', commit: false, officialSalary: 15_000_000 });
  assert.equal(off.net, 15_000_000 - 1_575_000);        // 10.5% insurance, no PIT under the personal deduction
  const r = { ...newRun({ name: 'x', id: 'p' }), salary: 3_000_000 };
  assert.equal(C.accrue(r).intern, Math.round(3_000_000 / 22));
  assert.equal(C.accrue({ ...r, status: 'official', salary: 15_000_000 }).official, Math.round(15_000_000 / 22));
});

test('weekly review grades', () => {
  const r = newRun({ name: 'x', id: 'g' });
  const w = C.emptyWeek(r);
  assert.equal(C.gradeWeek({ ...w, done: 5, minis: 3, minisOk: 3 }, { ...r, st: { ...r.st, uy: 62 } }, 3).grade, 'A');
  assert.equal(C.gradeWeek({ ...w, late: 5, minis: 2, minisOk: 0 }, { ...r, st: { ...r.st, uy: 40, dr: 40 } }, -2).grade, 'D');
  const b = C.gradeWeek(w, r, 0);
  assert.ok(['B', 'C'].includes(b.grade));
});

test('tasks: max open, deadlines shift with clock jumps, fast-forward resolve', () => {
  const tpl = [{ id: 'a', title: 'A', from: 'x', base: 30, legs: [{ npc: 'x' }] }, { id: 'b', title: 'B', from: 'x', base: 30, legs: [{ npc: 'x' }] }];
  let tasks = planTasks({ templates: tpl, count: 2, tierId: 't1', startMin: 600, endMin: 601, seed: 3, scale: 2 });
  assert.ok(tasks.every((t) => t.deadline - t.spawnAt === 72)); // 30 × 1.2 × 2
  const r = tick(tasks, 700, 1);
  assert.equal(r.tasks.filter((t) => t.status === 'open').length, 1);
  const shifted = shiftTasks(r.tasks, 60);
  assert.ok(shifted.every((t, i) => t.deadline === r.tasks[i].deadline + 60));
  const res = resolveAll(shifted, 1);
  assert.deepEqual(res.map((t) => t.status).sort(), ['done', 'late']);
});

test('one run: life events on roughly half the evenings, moods vary from day to day', () => {
  const r = newRun({ name: 'x', id: 'abc12345' });
  const hash = (str) => [...String(str)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  for (const id of ['abc12345', 'zz9', 'q1w2e3r4', 'tech0001']) {
    let n = 0; const moods = new Set();
    for (let d = 1; d <= 45; d++) { if (C.pickLifeEvent({ ...r, id }, hash(id) + d * 13)) n++; moods.add(C.pickMood(r, hash(id) + d * 101)); }
    assert.ok(n >= 12 && n <= 36, `run ${id}: ${n}/45 evenings`);
    assert.ok(moods.size >= 5, `run ${id}: only ${moods.size} different moods`);
  }
});

test('rent is due before day 1 and when month 2 starts; lender is the friendliest colleague', () => {
  assert.equal(C.rentDue(0, 1), true);
  assert.equal(C.rentDue(29, 30), false);
  assert.equal(C.rentDue(30, 31), true);
  assert.equal(C.rentDue(30, 33), true);   // day 30 is Tuesday… but also covers a jump over 31
  assert.equal(C.rentDue(31, 32), false);
  const r = { ...newRun({ name: 'x', id: 'm' }), rel: { a: 1, b: 3, c: -2 } };
  assert.equal(C.lender(r, ['a', 'b', 'c']), 'b');
  assert.equal(C.lender({ ...r, rel: { c: -1 } }, ['a', 'c']), null);
});
