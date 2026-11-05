// Overdeadline & Overburnout · Cân Đối & Cộng Sự (audit) level rules. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, step, setPlayerPos, LEVELS, hintFor, darkNow } from '../site/js/game/mp/engine.js';

const L = LEVELS.audit;
const st = (id) => L.stations.find((s) => s.id === id);
function goTo(g, pid, id) { const s = st(id); setPlayerPos(g, pid, s.x, s.z + (s.z < 0 ? 0.7 : s.z > 0 ? -0.7 : 0.7)); }
function run(g, secs, dt = 0.1) { const ev = []; for (let t = 0; t < secs; t += dt) ev.push(...step(g, dt)); return ev; }
const game = () => createGame('audit', { seed: 9, players: [{ id: 'P0', name: 'P0' }] });
const holding = (g) => g.items[g.players.P0.held] && g.items[g.players.P0.held].type;
const on = (g, id) => g.stations[id].item && g.items[g.stations[id].item].type;
function work(g, station, secs) { goTo(g, 'P0', station); act(g, 'P0'); act(g, 'P0'); run(g, secs); act(g, 'P0'); }

test('balance sheet: debit and credit ledgers through the laptop, combined (Nợ = Có)', () => {
  const g = game();
  goTo(g, 'P0', 'sono'); act(g, 'P0'); work(g, 'lap1', 3.2); assert.equal(holding(g), 'so_no');
  goTo(g, 'P0', 'c1'); act(g, 'P0');
  goTo(g, 'P0', 'soco'); act(g, 'P0'); work(g, 'lap2', 3.2); assert.equal(holding(g), 'so_co');
  goTo(g, 'P0', 'c1'); act(g, 'P0');
  assert.equal(on(g, 'c1'), 'can_doi');
});

test('stocktake in the client warehouse, then the partner signs the audit report', () => {
  const g = game();
  goTo(g, 'P0', 'phieu'); act(g, 'P0'); work(g, 'count', 4.2); assert.equal(holding(g), 'kiem_ke');
  g.items.c = { id: 'c', type: 'can_doi' }; g.stations.c2.item = 'c';
  goTo(g, 'P0', 'c2'); act(g, 'P0'); assert.equal(on(g, 'c2'), 'bctc_draft');
  act(g, 'P0'); goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2);
  if (on(g, 'boss') === 'bctc_note') { act(g, 'P0'); work(g, 'lap3', 2.2); goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2); }
  assert.equal(on(g, 'boss'), 'bctc_ok');
});

test('lights go out in waves; the light switch turns them back on early', () => {
  const g = game();
  run(g, L.dark.at[0] + 0.1, 0.25);
  assert.ok(darkNow(g));
  goTo(g, 'P0', 'light'); assert.match(hintFor(g, g.players.P0), /đèn/);
  act(g, 'P0');
  assert.ok(!darkNow(g));
  // the next wave ends by itself
  run(g, L.dark.at[1] - L.dark.at[0] + 0.2, 0.25);
  assert.ok(darkNow(g));
  run(g, L.dark.length + 0.3, 0.25);
  assert.ok(!darkNow(g));
});

test('the partner is away for a while, then comes back by himself', () => {
  const g = game();
  g.items.d = { id: 'd', type: 'bctc_draft' }; g.stations.boss.item = 'd';
  g.notesChanceOff = true;
  run(g, L.powerCut.at[0] - 3.2, 0.25); // signed before he leaves
  assert.ok(['bctc_ok', 'bctc_note'].includes(on(g, 'boss')));
  g.items.d.type = 'bctc_draft'; g.items.d.noted = true; g.stations.boss.progress = 0;
  run(g, 3.4, 0.25);
  assert.equal(g.stations.boss.off, true);
  run(g, 3, 0.25);
  assert.equal(on(g, 'boss'), 'bctc_draft', 'no signature while he is away');
  run(g, L.powerCut.autoEnd, 0.25);
  assert.equal(g.stations.boss.off, false);
  run(g, 3.2, 0.25);
  assert.equal(on(g, 'boss'), 'bctc_ok');
});

test('every audit recipe can be made from the stations on the map', () => {
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
