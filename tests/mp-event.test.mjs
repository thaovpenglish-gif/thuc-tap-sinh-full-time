// Overdeadline & Overburnout · Đi Đâu Cũng Được (event) level rules. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, step, setPlayerPos, LEVELS, speedOf, inRain } from '../site/js/game/mp/engine.js';

const L = LEVELS.event;
const st = (id) => L.stations.find((s) => s.id === id);
function goTo(g, pid, id) { const s = st(id); setPlayerPos(g, pid, s.x, s.z + (s.z < 0 ? 0.7 : s.z > 0 ? -0.7 : 0.7)); }
function run(g, secs, dt = 0.1) { const ev = []; for (let t = 0; t < secs; t += dt) ev.push(...step(g, dt)); return ev; }
const game = () => createGame('event', { seed: 4, players: [{ id: 'P0', name: 'P0' }] });
const holding = (g) => g.items[g.players.P0.held] && g.items[g.players.P0.held].type;
function work(g, station, secs) { goTo(g, 'P0', station); act(g, 'P0'); act(g, 'P0'); run(g, secs); act(g, 'P0'); }

test('rain soaks what is left out in the open; tents keep things dry', () => {
  const g = game();
  g.items.out = { id: 'out', type: 'loa_ok' }; g.stations.c3.item = 'out';     // open-air table
  g.items.tent = { id: 'tent', type: 'backdrop' }; g.stations.c1.item = 'tent'; // under the Plan B tent
  assert.ok(inRain(L, st('c3').x, st('c3').z) && !inRain(L, st('c1').x, st('c1').z));
  run(g, L.rain.at[0] + L.rain.wetAfter + 0.5, 0.25);
  assert.equal(g.items.out.type, 'wet');
  assert.equal(g.items.tent.type, 'backdrop');
});

test('carrying something through the rain soaks it more slowly, and you walk slower', () => {
  const g = game();
  g.items.h = { id: 'h', type: 'qua_goi' }; g.players.P0.held = 'h';
  setPlayerPos(g, 'P0', 0, 2.0);
  const dry = speedOf(g.players.P0, g);
  run(g, L.rain.at[0] + L.rain.wetAfter + 0.3, 0.25);
  assert.equal(g.items.h.type, 'qua_goi', 'half rate: not soaked yet');
  assert.ok(speedOf(g.players.P0, g) < dry, 'slower in the rain');
  run(g, L.rain.wetAfter + 0.5, 0.25);
  assert.equal(g.items.h.type, 'wet');
});

test('the rain stops after a while and nothing else gets wet', () => {
  const g = game();
  run(g, L.rain.at[0] + L.rain.length + 0.5, 0.25);
  g.items.x = { id: 'x', type: 'qua_goi' }; g.stations.c3.item = 'x';
  run(g, 6);
  assert.equal(g.items.x.type, 'qua_goi');
});

test('backdrop: brief → laptop → wide printer; "sang hơn chút" means fix and print again', () => {
  for (let seed = 1; seed <= 8; seed++) {
    const g = createGame('event', { seed, players: [{ id: 'P0', name: 'P0' }] });
    g.orders = [{ id: 1, recipe: 'backdrop', t: 85, total: 85, client: 0, spot: 0 }];
    goTo(g, 'P0', 'bd'); act(g, 'P0');
    work(g, 'lap1', 3.2); assert.equal(holding(g), 'file_bd');
    goTo(g, 'P0', 'bigprint'); act(g, 'P0'); run(g, 5.2); act(g, 'P0');
    assert.equal(holding(g), 'backdrop');
    goTo(g, 'P0', 'deliver'); act(g, 'P0');
    if (holding(g) === 'bd_fb') {
      work(g, 'lap2', 2.2); assert.equal(holding(g), 'file_bd');
      goTo(g, 'P0', 'bigprint'); act(g, 'P0'); run(g, 5.2); act(g, 'P0');
      goTo(g, 'P0', 'deliver'); act(g, 'P0');
    }
    assert.ok(g.done >= 1);
  }
});

test('every event recipe can be made from the stations on the map', () => {
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
