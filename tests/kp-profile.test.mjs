// Khu phố T&M · hồ sơ cá nhân: shifts, entries, Solo import (T12), merge rules (T10 at the profile level).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../site/js/khupho/sim/profile.js';
import { newRun } from '../site/js/game/save.js';

const shift = (day, extra = {}) => ({ placeId: 'trasua', placeName: 'Trà Sữa Full Topping', kind: 'shop', role: 'Học việc', rank: 1, day, hours: 4, grade: 'B', pay: 102_000, ...extra });

test('logShift: one entry per stint, days counted once per day, rank never goes down, totals recomputed', () => {
  const p = P.emptyKpProfile();
  P.logShift(p, shift(1));
  P.logShift(p, shift(1, { grade: 'A' }));
  P.logShift(p, shift(2, { rank: 2, role: 'Nhân viên' }));
  P.logShift(p, shift(3, { rank: 1, comment: 'Chị Nhung: "Dập nắp đẹp đó em."', highlight: '50 ly liền không sai %' }));
  assert.equal(p.entries.length, 1);
  const e = p.entries[0];
  assert.equal(e.entryId, 'kp-trasua-01');
  assert.equal(e.daysWorked, 3);
  assert.equal(e.shifts, 4);
  assert.equal(e.hours, 16);
  assert.equal(e.earned, 4 * 102_000);
  assert.equal(e.rankHighest, 2);
  assert.equal(e.rank, 1);
  assert.deepEqual(e.ratings, { A: 1, B: 3, C: 0, D: 0 });
  assert.equal(e.startDate, '02/11/2026');
  assert.equal(P.averageGrade(e), 'B');
  assert.deepEqual(p.totals, { days: 3, shifts: 4, hours: 16, earned: 408_000, places: 1 });
  // leave, then come back: a new entry (the old one keeps its history)
  const closed = P.endEntry(p, 'trasua', { day: 4, reasonCode: 'hocthem' });
  assert.equal(closed.reasonLeft.text, 'Nghỉ để học thêm');
  assert.equal(closed.endDate, '05/11/2026');
  assert.equal(P.endEntry(p, 'trasua', { day: 5 }), null);
  P.logShift(p, shift(10));
  assert.equal(p.entries.length, 2);
  assert.equal(p.entries[1].entryId, 'kp-trasua-02');
  assert.equal(p.totals.days, 4);
  assert.throws(() => P.logShift(p, { day: 1 }));
});

function soloRun(id, { company = 'bama', endType = 'finish', endDay = 45, status = 'intern', grades = ['A', 'B', 'B', 'C'] } = {}) {
  return { ...newRun({ name: 'Vy', company, id, now: 1000 }), tier: 'mid', status, day: endDay,
    reviews: grades.map((g, i) => ({ day: 5 + i * 7, week: i + 1, grade: g, score: 70 })),
    payslips: [{ day: 30, net: 5_000_000, gross: 5_500_000 }], ended: { type: endType, day: endDay }, done: true, updatedAt: 5000 };
}

test('T12: a finished Solo run imports as one entry with company, days, status, grades, end reason; idempotent', () => {
  const p = P.emptyKpProfile();
  const runs = {
    r1: soloRun('r1'),
    r2: soloRun('r2', { company: 'tech', endType: 'layoff', endDay: 26, status: 'official', grades: ['A', 'A', 'D'] }),
    r3: { ...newRun({ name: 'Vy', company: 'tm', id: 'r3' }), day: 12 }, // still playing: not imported
  };
  const names = { bama: 'Ba & Má', tech: 'Nợ Kỹ Thuật Labs', tm: 'T&M Partners' };
  assert.equal(P.importSolo(p, runs, (id) => names[id]), 2);
  assert.equal(p.entries.length, 2);
  const a = p.entries.find((e) => e.soloRunId === 'r1');
  assert.equal(a.entryId, 'solo-r1');
  assert.equal(a.placeId, 'bama');
  assert.equal(a.placeName, 'Ba & Má');
  assert.equal(a.kind, 'company');
  assert.equal(a.soloDays, 45);
  assert.equal(a.daysWorked, 33); // 45 calendar days from a Monday = 33 workdays
  assert.equal(a.status, 'intern');
  assert.equal(a.role, 'Thực tập sinh');
  assert.deepEqual(a.ratings, { A: 1, B: 2, C: 1, D: 0 });
  assert.equal(a.reasonLeft.code, 'hetthuctap');
  assert.equal(a.reasonLeft.type, 'finish');
  assert.equal(a.earned, 5_000_000);
  const b = p.entries.find((e) => e.soloRunId === 'r2');
  assert.equal(b.placeName, 'Nợ Kỹ Thuật Labs');
  assert.equal(b.status, 'official');
  assert.equal(b.rankHighest, 2);
  assert.equal(b.reasonLeft.code, 'bichonghi');
  assert.equal(b.soloDays, 26);
  // idempotent: same runs again change nothing
  const snap = JSON.stringify(p.entries);
  assert.equal(P.importSolo(p, runs, names), 0);
  assert.equal(JSON.stringify(p.entries), snap);
  // array input and a plain company name map also work
  const q = P.emptyKpProfile();
  assert.equal(P.importSolo(q, Object.values(runs), names), 2);
  assert.equal(q.totals.days, 33 + 20);
});

test('merge (T10 at profile level): 12 vs 9 days on the same entryId → 12; newest wins for the rest', () => {
  const base = P.emptyKpProfile();
  P.logShift(base, shift(1));
  const A = JSON.parse(JSON.stringify(base)), B = JSON.parse(JSON.stringify(base));
  for (let d = 2; d <= 12; d++) P.logShift(A, shift(d, { now: 100 + d }));
  for (let d = 2; d <= 9; d++) P.logShift(B, shift(d, { now: 500 + d, rank: 2 }));
  P.endEntry(B, 'trasua', { day: 9, reasonCode: 'chuyencho', now: 600 });
  assert.equal(A.entries[0].daysWorked, 12);
  assert.equal(B.entries[0].daysWorked, 9);
  for (const m of [P.mergeResume(A, B), P.mergeResume(B, A)]) {
    assert.equal(m.entries.length, 1);
    const e = m.entries[0];
    assert.equal(e.daysWorked, 12);
    assert.equal(e.shifts, 12);
    assert.equal(e.rankHighest, 2);
    assert.equal(m.totals.days, 12);
  }
  // kp level: days only go up, the rest comes from the newer kp.saved
  const kpA = { v: 1, saved: 10, time: { day: 13, min: 400 }, player: { money: 1 }, profile: A, flags: { from: 'A' } };
  const kpB = { v: 1, saved: 20, time: { day: 10, min: 400 }, player: { money: 2 }, profile: B, flags: { from: 'B' } };
  const m = P.mergeKp(kpA, kpB);
  assert.equal(m.flags.from, 'B');
  assert.equal(m.player.money, 2);
  assert.equal(m.profile.entries[0].daysWorked, 12);
  assert.deepEqual(P.mergeKp(kpB, kpA), m);
  assert.equal(P.mergeKp(null, null), null);
  assert.equal(P.mergeKp(null, kpA).profile.entries[0].daysWorked, 12);
  // entries only on one side survive; contacts and highlights union
  const C1 = P.emptyKpProfile(), C2 = P.emptyKpProfile();
  P.logShift(C1, shift(1, { contacts: [{ id: 'kp:tu', name: 'Tú', hearts: 2 }], highlight: 'Cứu ca bão 1 sao' }));
  const C3 = JSON.parse(JSON.stringify(C1));
  P.logShift(C3, shift(2, { contacts: [{ id: 'kp:tu', name: 'Tú', hearts: 3 }, { id: 'kp:bong', name: 'Bông', hearts: 1 }], highlight: 'Đào tạo Bông' }));
  P.logShift(C2, { ...shift(1), placeId: 'cho', placeName: 'Chợ Tâm Mỹ' });
  const u = P.mergeResume(P.mergeResume(C1, C2), C3);
  assert.equal(u.entries.length, 2);
  const t = u.entries.find((e) => e.placeId === 'trasua');
  assert.deepEqual(t.contacts.map((c) => [c.id, c.hearts]).sort(), [['kp:bong', 1], ['kp:tu', 3]]);
  assert.deepEqual(t.highlights.sort(), ['Cứu ca bão 1 sao', 'Đào tạo Bông']);
});

test('sanitize: repairs types, keeps unknown fields, never loses the hồ sơ', () => {
  const p = P.emptyKpProfile();
  P.logShift(p, shift(1));
  p.custom = { keep: true };
  p.entries[0].future = 'x';
  const s = P.sanitizeResume(JSON.parse(JSON.stringify(p)));
  assert.deepEqual(s, p);
  const bad = P.sanitizeResume({ entries: [{ entryId: 'kp-a-01', placeId: 'a', daysWorked: '7', ratings: 'x' }, { nope: 1 }, 5], skills: { a: 2, b: 'z' } });
  assert.equal(bad.entries.length, 1);
  assert.equal(bad.entries[0].daysWorked, 0);
  assert.deepEqual(bad.entries[0].ratings, { A: 0, B: 0, C: 0, D: 0 });
  assert.deepEqual(bad.skills, { a: 2 });
  assert.equal(P.sanitizeKp('nope'), null);
  const broken = P.sanitizeKp({ profile: p, extra: 1 });
  assert.equal(broken.broken, true);
  assert.equal(broken.extra, 1);
  assert.equal(broken.profile.entries[0].daysWorked, 1);
});
