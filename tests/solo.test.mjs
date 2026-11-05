// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { TIERS, TIER_ORDER, withholding, netPay, passes, deadlineFor } from '../site/js/game/difficulty.js';
import { emptyProfile, newRun, addRun, updateRun, removeRun, listRuns, runLabel, validateProfile, mergeProfiles } from '../site/js/game/save.js';
import { planTasks, tick, visit, decline, summary, active } from '../site/js/game/tasks.js';

// ---------- difficulty ----------
test('higher salary means more work, tighter deadlines and stricter review', () => {
  const t = TIER_ORDER.map((k) => TIERS[k]);
  for (let i = 1; i < t.length; i++) {
    assert.ok(t[i].sideTasks > t[i - 1].sideTasks);
    assert.ok(t[i].deadlineMult < t[i - 1].deadlineMult);
    assert.ok(t[i].qa > t[i - 1].qa);
    assert.ok(t[i].perks.length >= 1);
  }
});

test('10% withholding only above the threshold and only without a commitment form', () => {
  assert.equal(withholding('t0', false), 0);
  assert.equal(withholding('t1', false), 0);
  assert.equal(withholding('t3', false), 0, 'under the 5,000,000 threshold since 1/7/2026');
  assert.equal(withholding('t5', false), 500_000);
  assert.equal(withholding('t5', true), 0);
  assert.equal(netPay('t5', false), 4_500_000);
  assert.equal(netPay('t5', true), 5_000_000);
});

test('review bar and deadlines follow the tier', () => {
  assert.equal(passes('t0', 0.4), true);
  assert.equal(passes('t5', 0.75), false);   // 3/4 fails at Consulting Hell
  assert.equal(passes('t5', 5 / 6), true);    // 5/6 passes
  assert.equal(passes('t3', 2 / 3), true);    // 2/3 passes at 3 triệu
  assert.equal(deadlineFor('t0', 60), 90);
  assert.equal(deadlineFor('t5', 60), 48);
});

// ---------- save ----------
test('starting a new run never deletes an existing one (nhảy công ty)', () => {
  let p = emptyProfile();
  const a = newRun({ name: 'Linh', id: 'a', now: 1 });
  p = addRun(p, a);
  p = updateRun(p, 'a', { tier: 't3', level: 2, day: 3 }, 5);
  const b = newRun({ name: 'Linh', id: 'b', now: 10 });
  p = addRun(p, b);
  assert.equal(Object.keys(p.runs).length, 2);
  assert.equal(p.runs.a.level, 2);
  assert.equal(p.runs.a.tier, 't3');
  assert.equal(p.activeId, 'b');
  assert.deepEqual(listRuns(p).map((r) => r.id), ['b', 'a']);
});

test('run label reads like the menu entry', () => {
  const r = { ...newRun({ name: 'x', id: 'r' }), tier: 't3', level: 2, day: 4 };
  assert.equal(runLabel(r, (t) => TIERS[t].label), 'T&M Partners · 3 triệu · Ngày 4/45');
  assert.equal(runLabel(newRun({ name: 'x', id: 'q' })), 'T&M Partners · Vòng phỏng vấn');
  assert.equal(runLabel({ ...r, status: 'official' }), 'T&M Partners · Nhân viên chính thức · Ngày 4/45');
  assert.equal(runLabel({ ...r, ended: { type: 'finish', day: 45 } }, (t) => t), 'T&M Partners · t3 · Đã kết thúc');
});

test('validateProfile rejects garbage and repairs partial runs', () => {
  assert.equal(validateProfile(null), null);
  assert.equal(validateProfile({ v: 99, runs: {} }), null);
  const p = validateProfile({ v: 1, runs: { z: { id: 'z', name: 'A', st: { uy: 70 } }, bad: { id: 'other' } }, activeId: 'nope' });
  assert.deepEqual(Object.keys(p.runs), ['z']);
  assert.equal(p.runs.z.st.uy, 70);
  assert.equal(p.runs.z.st.nl, 100);
  assert.equal(p.activeId, null);
  // v1 saves are migrated: company defaults to T&M, pocket money and intern status are filled in
  assert.equal(p.runs.z.company, 'tm');
  assert.equal(p.runs.z.status, 'intern');
  assert.equal(p.runs.z.money, 2_000_000);
  assert.deepEqual(p.runs.z.reviews, []);
});

test('merge keeps the most recently updated copy of each run', () => {
  const local = addRun(emptyProfile(), { ...newRun({ name: 'L', id: 'x', now: 1 }), day: 2, updatedAt: 100 });
  const remote = addRun(addRun(emptyProfile(), { ...newRun({ name: 'L', id: 'x', now: 1 }), day: 5, updatedAt: 200 }), newRun({ name: 'M', id: 'y', now: 50 }));
  const m = mergeProfiles(local, remote);
  assert.equal(m.runs.x.day, 5);
  assert.ok(m.runs.y);
});

test('removing a run clears it from the active slot', () => {
  let p = addRun(emptyProfile(), newRun({ name: 'A', id: 'a' }));
  p = removeRun(p, 'a');
  assert.equal(p.activeId, null);
  assert.equal(Object.keys(p.runs).length, 0);
});

// ---------- tasks ----------
const TEMPLATES = [
  { id: 'sign', title: 'Ký tờ trình', from: 'thu', base: 60, legs: [{ npc: 'thu' }, { npc: 'quynh' }] },
  { id: 'paid', title: 'Khách chuyển tiền chưa', from: 'mai', base: 90, legs: [{ npc: 'mai' }, { npc: 'quynh' }, { npc: 'mai' }] },
  { id: 'tea', title: 'Trà cho chị Tuyết', from: 'thu', base: 40, legs: [{ obj: 'coffee' }, { npc: 'tuyet' }] },
];

test('the number of side tasks follows the tier and is reproducible from a seed', () => {
  const a = planTasks({ templates: TEMPLATES, count: 3, tierId: 't3', startMin: 540, endMin: 1020, seed: 7 });
  const b = planTasks({ templates: TEMPLATES, count: 3, tierId: 't3', startMin: 540, endMin: 1020, seed: 7 });
  assert.equal(a.length, 3);
  assert.deepEqual(a, b);
  for (const t of a) { assert.ok(t.spawnAt >= 540 && t.spawnAt < 1020); assert.ok(t.deadline > t.spawnAt); }
});

test('tasks spawn on time, advance leg by leg, and finish', () => {
  let tasks = planTasks({ templates: [TEMPLATES[1]], count: 1, tierId: 't1', startMin: 600, endMin: 700, seed: 3 });
  let r = tick(tasks, 599); assert.equal(r.events.length, 0);
  r = tick(tasks, tasks[0].spawnAt); tasks = r.tasks;
  assert.equal(r.events[0].type, 'spawned');
  assert.equal(active(tasks).length, 1);
  r = visit(tasks, { npc: 'quynh' }); assert.equal(r.events.length, 0, 'wrong order does nothing');
  r = visit(tasks, { npc: 'mai' }); tasks = r.tasks; assert.equal(r.events[0].type, 'leg');
  r = visit(tasks, { npc: 'quynh' }); tasks = r.tasks;
  r = visit(tasks, { npc: 'mai' }); tasks = r.tasks; assert.equal(r.events[0].type, 'done');
  assert.equal(summary(tasks).done, 1);
});

test('overdue tasks become late; declined tasks never spawn', () => {
  let tasks = planTasks({ templates: TEMPLATES, count: 2, tierId: 't5', startMin: 600, endMin: 700, seed: 9 });
  tasks = decline(tasks, tasks[1].id);
  tasks = tick(tasks, 2000).tasks; // spawns the first one
  const r = tick(tasks, 2001);
  assert.equal(r.events[0].type, 'late');
  assert.equal(summary(r.tasks).late, 1);
  assert.equal(summary(r.tasks).declined, 1);
});
