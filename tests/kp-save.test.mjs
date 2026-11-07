// Khu phố T&M · save integration: game/save.js keeps `kp` (T10), save codes round-trip exactly (T11).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyProfile, newRun, addRun, validateProfile, mergeProfiles } from '../site/js/game/save.js';
import * as W from '../site/js/khupho/sim/world.js';
import { logShift } from '../site/js/khupho/sim/profile.js';

const jsonClone = (x) => JSON.parse(JSON.stringify(x));

function playedKp(seed, days, now) {
  const kp = W.newGame({ name: 'Vy', seed, now });
  for (let d = 1; d <= days; d++) {
    W.advance(kp, kp.time.day === 1 ? 150 : 180, 'idle'); // 9h
    W.buyFood(kp, 'mily');
    if (W.canWork(kp, 'trasua').ok) W.workShift(kp, 'trasua', { hours: 4, pay: 104_000, grade: 'A' });
    W.advance(kp, 17 * 60 + 30 - kp.time.min, 'walk');
    W.buyFood(kp, 'comtam');
    W.sleep(kp);
  }
  return W.stamp(kp, now + days);
}

test('T10: validateProfile keeps kp intact; old profiles without kp are unchanged', () => {
  const kp = playedKp('save-1', 5, 1000);
  const prof = { ...addRun(emptyProfile(), newRun({ name: 'Vy', id: 'r1', now: 1 })), kp };
  const v = validateProfile(jsonClone(prof));
  assert.ok(v.kp);
  assert.deepEqual(v.kp, jsonClone(kp));
  assert.equal(v.kp.profile.entries[0].daysWorked, 5);
  // a Solo-only profile does not grow a kp key
  const solo = validateProfile(jsonClone(addRun(emptyProfile(), newRun({ name: 'A', id: 'a', now: 1 }))));
  assert.ok(!('kp' in solo));
  // junk kp is dropped, a damaged one is kept (and flagged) so the hồ sơ survives
  assert.ok(!('kp' in validateProfile({ v: 2, runs: {}, kp: 'garbage' })));
  const damaged = validateProfile({ v: 2, runs: {}, kp: { profile: kp.profile, player: 'x' } });
  assert.equal(damaged.kp.broken, true);
  const reloaded = W.loadGame(damaged.kp, { now: 5 });
  assert.equal(reloaded.time.day, 1);
  assert.equal(reloaded.profile.entries[0].daysWorked, 5); // the street restarts, the hồ sơ does not
});

test('T10: mergeProfiles keeps kp; machine A 12 days vs machine B 9 days on the same entryId → 12', () => {
  const base = W.newGame({ name: 'Vy', seed: 'merge', now: 1 });
  const A = jsonClone(base), B = jsonClone(base);
  for (let d = 1; d <= 12; d++) logShift(A.profile, { placeId: 'trasua', placeName: 'Trà Sữa Full Topping', day: d, hours: 4, grade: 'B', pay: 102_000 });
  for (let d = 1; d <= 9; d++) logShift(B.profile, { placeId: 'trasua', placeName: 'Trà Sữa Full Topping', day: d, hours: 4, grade: 'A', pay: 102_000 });
  A.saved = 100; B.saved = 200; B.player.money = 777; // B is the newer save
  const pa = { ...emptyProfile(), kp: A }, pb = { ...emptyProfile(), kp: B };
  for (const m of [mergeProfiles(pa, pb), mergeProfiles(pb, pa)]) {
    assert.equal(m.kp.profile.entries.length, 1);
    assert.equal(m.kp.profile.entries[0].entryId, 'kp-trasua-01');
    assert.equal(m.kp.profile.entries[0].daysWorked, 12);
    assert.equal(m.kp.player.money, 777);
    assert.equal(m.kp.saved, 200);
  }
  // only one side has kp
  assert.equal(mergeProfiles(pa, emptyProfile()).kp.profile.entries[0].daysWorked, 12);
  assert.equal(mergeProfiles(emptyProfile(), pb).kp.profile.entries[0].daysWorked, 9);
  assert.ok(!('kp' in mergeProfiles(emptyProfile(), emptyProfile())));
  // runs still merge as before
  const local = addRun(emptyProfile(), { ...newRun({ name: 'L', id: 'x', now: 1 }), day: 2, updatedAt: 100 });
  const remote = addRun({ ...emptyProfile(), kp: A }, { ...newRun({ name: 'L', id: 'x', now: 1 }), day: 5, updatedAt: 200 });
  const m = mergeProfiles(local, remote);
  assert.equal(m.runs.x.day, 5);
  assert.equal(m.kp.profile.entries[0].daysWorked, 12);
});

test('T11 (data level): a profile with kp round-trips JSON + validate exactly, and play continues identically', () => {
  const kp = playedKp('roundtrip', 9, 50_000);
  const prof = { ...addRun(emptyProfile(), newRun({ name: 'Vy', id: 'r1', now: 1 })), kp };
  const once = validateProfile(jsonClone(prof));
  const code = JSON.stringify(once);            // what a save code / cloud row carries
  const twice = validateProfile(JSON.parse(code));
  assert.deepEqual(twice, once);
  assert.equal(JSON.stringify(twice.kp), JSON.stringify(jsonClone(kp)));
  // device A keeps playing the original, device B the restored copy: identical streets
  const a = W.loadGame(jsonClone(kp)), b = W.loadGame(twice.kp);
  for (let i = 0; i < 20; i++) {
    W.advance(a, 200, 'walk'); W.advance(b, 200, 'walk');
    if (W.canWork(a, 'trasua').ok) { W.workShift(a, 'trasua', { pay: 110_000, grade: 'A' }); W.workShift(b, 'trasua', { pay: 110_000, grade: 'A' }); }
    W.sleep(a); W.sleep(b);
  }
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});
