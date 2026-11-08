// Khu phố T&M · going to work at the 7 companies (sim/office.js): when you may go in, the way back, the hồ sơ.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as W from '../site/js/khupho/sim/world.js';
import { OFFICES, officesAt, canGoToWork, leaveForWork, finishWorkday, logOfficeDay } from '../site/js/khupho/sim/office.js';
import { importSolo } from '../site/js/khupho/sim/profile.js';
import { PLACE } from '../site/js/khupho/data/places.js';
import { COMPANY_LIST } from '../site/js/companies/index.js';

const fresh = () => W.newGame({ name: 'T', seed: 3, now: 0 });
const at = (kp, min) => { kp.time.min = min; return kp; };

test('every company has an office at a real place on the street', () => {
  for (const c of COMPANY_LIST) { assert.ok(OFFICES[c.id], c.id); assert.ok(PLACE[OFFICES[c.id].place], `${c.id} → ${OFFICES[c.id].place}`); }
  assert.deepEqual(officesAt('toanha').sort(), ['audit', 'tech', 'tm']);
});

test('canGoToWork: office hours, late limit, weekends, once a day', () => {
  const kp = fresh(); // day 1 = Monday
  assert.equal(canGoToWork(at(kp, 5 * 60), 'tm').ok, false, 'too early');
  assert.ok(canGoToWork(at(kp, 8 * 60), 'tm').ok);
  assert.equal(canGoToWork(at(kp, 8 * 60 + 45), 'tm').late, 15);
  assert.equal(canGoToWork(at(kp, 12 * 60), 'tm').ok, false, 'too late');
  assert.ok(canGoToWork(at(kp, 11 * 60), 'agency').ok, 'agency starts at 10h');
  kp.flags.officeDay = 1; assert.equal(canGoToWork(at(kp, 8 * 60), 'tm').ok, false, 'already worked today');
  const sat = fresh(); sat.time.day = 6; assert.match(canGoToWork(at(sat, 8 * 60), 'tm').reason, /Cuối tuần/);
});

test('finishWorkday: clock to closing time, a day of pay, +1 day in the hồ sơ, nobody faints', () => {
  const kp = at(fresh(), 8 * 60 + 20);
  kp.player.needs.food = 10; // came to work hungry
  leaveForWork(kp, 'tm');
  const m0 = kp.player.money;
  const r = finishWorkday(kp, { co: 'tm', coName: 'T&M Partners', runId: 'run1', worked: true, salary: 3_000_000, status: 'intern' });
  assert.ok(r.ok);
  assert.equal(kp.time.day, 1); assert.ok(kp.time.min >= OFFICES.tm.end, `clock ${kp.time.min}`);
  assert.ok(!r.events.some((e) => e.type === 'faint'));
  assert.equal(r.pay, 136000); assert.equal(kp.player.money, m0 + 136000);
  const e = kp.profile.entries.find((x) => x.entryId === 'solo-run1');
  assert.equal(e.daysWorked, 1); assert.equal(e.kind, 'company'); assert.equal(kp.work, null); assert.equal(kp.flags.officeDay, 1);
});

test('interview day: no pay, no day counted; leaving halfway: nothing counted', () => {
  const kp = at(fresh(), 8 * 60);
  leaveForWork(kp, 'bama');
  const r = finishWorkday(kp, { co: 'bama', runId: 'r2', worked: true, interview: true, salary: 1_000_000 });
  assert.equal(r.pay, 0); assert.match(r.lines[0], /phỏng vấn/);
  assert.equal(kp.profile.entries.find((x) => x.entryId === 'solo-r2').daysWorked, 0);
  const k2 = at(fresh(), 8 * 60);
  leaveForWork(k2, 'tm');
  const r2 = finishWorkday(k2, { co: 'tm', runId: 'r3', worked: false });
  assert.equal(r2.pay, 0); assert.ok(!k2.profile.entries.some((x) => x.entryId === 'solo-r3')); assert.notEqual(k2.flags.officeDay, 1);
  // a handoff for another company than the one you left for is ignored
  const k3 = at(fresh(), 8 * 60); leaveForWork(k3, 'tm');
  assert.equal(finishWorkday(k3, { co: 'hr', runId: 'x', worked: true }).ok, false);
});

test('the same run imported from Solo at its end does not double the days', () => {
  const kp = fresh();
  for (let d = 1; d <= 3; d++) logOfficeDay(kp.profile, { co: 'tm', coName: 'T&M Partners', runId: 'rx', day: d, hours: 9, pay: 45000 });
  importSolo(kp.profile, { rx: { id: 'rx', company: 'tm', day: 3, ended: { type: 'quit', day: 3 }, reviews: [], payslips: [] } }, () => 'T&M Partners');
  const list = kp.profile.entries.filter((x) => x.soloRunId === 'rx');
  assert.equal(list.length, 1); assert.equal(list[0].daysWorked, 3);
});
