// Overdeadline & Overburnout · Người Đúng Chỗ HR level rules. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, step, setPlayerPos, LEVELS, hintFor } from '../site/js/game/mp/engine.js';

const L = LEVELS.hr;
const st = (id) => L.stations.find((s) => s.id === id);
function goTo(g, pid, id) { const s = st(id); setPlayerPos(g, pid, s.x, s.z + (s.z < 0 ? 0.7 : s.z > 0 ? -0.7 : 0.7)); }
function run(g, secs, dt = 0.1) { const ev = []; for (let t = 0; t < secs; t += dt) ev.push(...step(g, dt)); return ev; }
const game = (n = 1) => createGame('hr', { seed: 5, players: Array.from({ length: n }, (_, i) => ({ id: 'P' + i, name: 'P' + i })) });
const holding = (g) => g.items[g.players.P0.held] && g.items[g.players.P0.held].type;
const on = (g, id) => g.stations[id].item && g.items[g.stations[id].item].type;
function work(g, station, secs) { goTo(g, 'P0', station); act(g, 'P0'); act(g, 'P0'); run(g, secs); act(g, 'P0'); }

test('interviewed candidate: CV → ATS → Talent Room → counter', () => {
  const g = game();
  g.orders = [{ id: 1, recipe: 'interview', t: 90, total: 90, client: 2, spot: 0 }];
  goTo(g, 'P0', 'cvprint'); act(g, 'P0');
  work(g, 'ats1', 2.7); assert.equal(holding(g), 'cv_ok');
  work(g, 'iv1', 4.2); assert.equal(holding(g), 'interviewed');
  goTo(g, 'P0', 'deliver'); act(g, 'P0');
  assert.equal(g.done, 1);
});

test('signed offer: interviewed + salary report → anh Duy (may want "culture fit" once)', () => {
  const g = game();
  goTo(g, 'P0', 'survey'); act(g, 'P0');
  work(g, 'ats2', 3.2); assert.equal(holding(g), 'survey_xls');
  goTo(g, 'P0', 'cb'); act(g, 'P0'); run(g, 4.2);
  assert.equal(on(g, 'cb'), 'salary_report');
  act(g, 'P0');
  g.items.i = { id: 'i', type: 'interviewed' }; g.stations.c1.item = 'i';
  goTo(g, 'P0', 'c1'); act(g, 'P0'); assert.equal(on(g, 'c1'), 'offer_draft');
  act(g, 'P0'); goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2);
  if (on(g, 'boss') === 'offer_notes') {
    act(g, 'P0'); work(g, 'ats3', 2.2); assert.equal(holding(g), 'offer_draft');
    goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2);
  }
  assert.equal(on(g, 'boss'), 'offer_signed');
});

test('candidates left lying around ghost; held or in a machine they do not', () => {
  const g = game();
  g.items.a = { id: 'a', type: 'cv_ok' }; g.stations.c2.item = 'a';
  g.items.b = { id: 'b', type: 'interviewed' }; g.players.P0.held = 'b';
  g.items.c = { id: 'c', type: 'cv_ok' }; g.stations.iv2.item = 'c';
  g.items.d = { id: 'd', type: 'cv' }; g.stations.c3.item = 'd';
  run(g, L.decay.after + 0.3);
  assert.equal(g.items.a.type, 'ghost');
  assert.equal(g.items.b.type, 'interviewed', 'held');
  assert.equal(g.items.c.type, 'cv_ok', 'waiting in the interview chair');
  assert.equal(g.items.d.type, 'cv', 'raw CVs never ghost');
});

test('ATS crash: no screening until someone restarts it at Phát\'s desk', () => {
  const g = game();
  run(g, L.powerCut.at[0] + 0.1, 0.25);
  assert.ok(['ats1', 'ats2', 'ats3'].every((id) => g.stations[id].off));
  goTo(g, 'P0', 'cvprint'); act(g, 'P0');
  goTo(g, 'P0', 'ats1'); act(g, 'P0'); act(g, 'P0');
  assert.equal(g.players.P0.working, null, 'cannot work on a frozen ATS');
  assert.match(hintFor(g, g.players.P0), /đứng hình/);
  goTo(g, 'P0', 'breaker'); assert.match(hintFor(g, g.players.P0), /Restart/);
  act(g, 'P0');
  assert.ok(['ats1', 'ats2', 'ats3'].every((id) => !g.stations[id].off));
});

test('icebreaker traps players near the KPI board', () => {
  const g = game(2);
  setPlayerPos(g, 'P0', L.standup.board.x - 0.5, L.standup.board.z + 0.8);
  setPlayerPos(g, 'P1', -6, 0.8);
  run(g, L.standup.at[0] + 0.1, 0.25);
  assert.ok(g.players.P0.meeting > 0);
  assert.equal(g.players.P1.meeting, 0);
});

test('every HR recipe can be made from the stations on the map', () => {
  const P = L.process;
  const makeable = new Set(L.stations.filter((s) => s.kind === 'source').map((s) => s.gives));
  for (let k = 0; k < 6; k++) {
    for (const table of [P.work, P.auto]) for (const [kind, rules] of Object.entries(table)) {
      if (!L.stations.some((s) => s.kind === kind)) continue;
      for (const [from, r] of Object.entries(rules)) if (makeable.has(from)) makeable.add(r.to);
    }
    for (const [[a, b], out] of P.combos) if (makeable.has(a) && makeable.has(b)) makeable.add(out);
  }
  for (const r of Object.values(L.recipes)) assert.ok(makeable.has(r.item), r.title);
});
