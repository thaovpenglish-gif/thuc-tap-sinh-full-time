// Overdeadline & Overburnout · Nợ Kỹ Thuật Labs (tech) level rules. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, step, setPlayerPos, LEVELS, hintFor } from '../site/js/game/mp/engine.js';

const L = LEVELS.tech;
const st = (id) => L.stations.find((s) => s.id === id);
function goTo(g, pid, id) { const s = st(id); setPlayerPos(g, pid, s.x, s.z + (s.z < 0 ? 0.7 : s.z > 0 ? -0.7 : 0.7)); }
function run(g, secs, dt = 0.1) { const ev = []; for (let t = 0; t < secs; t += dt) ev.push(...step(g, dt)); return ev; }
const game = (seed = 2) => createGame('tech', { seed, players: [{ id: 'P0', name: 'P0' }] });
const holding = (g) => g.items[g.players.P0.held] && g.items[g.players.P0.held].type;
const on = (g, id) => g.stations[id].item && g.items[g.stations[id].item].type;
const burning = (g) => Object.keys(g.fire.burning);
function work(g, station, secs) { goTo(g, 'P0', station); act(g, 'P0'); act(g, 'P0'); run(g, secs); act(g, 'P0'); }

test('ticket → laptop (spec) → laptop (code) → review → deploy → release', () => {
  const g = game();
  goTo(g, 'P0', 'jira'); act(g, 'P0');
  work(g, 'lap1', 2.7); assert.equal(holding(g), 'spec');
  work(g, 'lap2', 3.7); assert.equal(holding(g), 'code', 'put back on a laptop to code it');
  goTo(g, 'P0', 'review'); act(g, 'P0'); run(g, 4.2);
  if (on(g, 'review') === 'code_bug') { act(g, 'P0'); work(g, 'lap3', 2.2); goTo(g, 'P0', 'review'); act(g, 'P0'); run(g, 4.2); }
  assert.equal(on(g, 'review'), 'code_ok');
  act(g, 'P0'); goTo(g, 'P0', 'deploy'); act(g, 'P0'); run(g, 4.2);
  assert.equal(on(g, 'deploy'), 'release');
  assert.equal(burning(g).length, 0);
});

test('deploying unreviewed code sets a server on fire; rollback puts it out', () => {
  const g = game();
  g.items.c = { id: 'c', type: 'code' }; g.players.P0.held = 'c';
  goTo(g, 'P0', 'deploy'); act(g, 'P0'); run(g, 2.2);
  assert.equal(on(g, 'deploy'), 'incident');
  const [rack] = burning(g);
  assert.ok(rack, 'a rack burns');
  assert.equal(g.stations.deploy.off, true, 'no deploys while it burns');
  goTo(g, 'P0', rack); assert.match(hintFor(g, g.players.P0), /Rollback/);
  act(g, 'P0'); assert.ok(burning(g).includes(rack), 'cannot put it out bare-handed');
  goTo(g, 'P0', 'rollback'); act(g, 'P0'); assert.equal(holding(g), 'rollback');
  goTo(g, 'P0', rack); act(g, 'P0');
  assert.equal(burning(g).length, 0);
  assert.equal(g.players.P0.held, null, 'the extinguisher is used up');
  run(g, 0.2);
  assert.equal(g.stations.deploy.off, false);
});

test('fires break out on their own and spread (with a penalty) if nobody acts', () => {
  const g = game();
  run(g, L.fire.at[0] + 0.1, 0.25);
  assert.equal(burning(g).length, 1);
  const money = g.money;
  run(g, L.fire.spread + 0.2, 0.25);
  assert.equal(burning(g).length, 2);
  assert.ok(g.money <= money - L.fire.penalty);
});

test('every tech recipe can be made from the stations on the map', () => {
  const P = L.process;
  const makeable = new Set(L.stations.filter((s) => s.kind === 'source').map((s) => s.gives));
  for (let k = 0; k < 6; k++) {
    for (const table of [P.work, P.auto]) for (const [kind, rules] of Object.entries(table)) {
      if (!L.stations.some((s) => s.kind === kind)) continue;
      for (const [from, r] of Object.entries(rules)) if (makeable.has(from)) makeable.add(r.to);
    }
  }
  for (const r of Object.values(L.recipes)) assert.ok(makeable.has(r.item), r.title);
});
