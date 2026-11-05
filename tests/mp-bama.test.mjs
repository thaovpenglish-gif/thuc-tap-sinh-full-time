// Overdeadline & Overburnout · Ba & Má level rules. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, step, setPlayerPos, LEVELS, hintFor } from '../site/js/game/mp/engine.js';

const L = LEVELS.bama;
const st = (id) => L.stations.find((s) => s.id === id);
function goTo(g, pid, id) { const s = st(id); setPlayerPos(g, pid, s.x, s.z + (s.z < 0 ? 0.7 : s.z > 0 ? -0.7 : 0.7)); }
function run(g, secs, dt = 0.1) { const ev = []; for (let t = 0; t < secs; t += dt) ev.push(...step(g, dt)); return ev; }
const game = (n = 1) => createGame('bama', { seed: 11, players: Array.from({ length: n }, (_, i) => ({ id: 'P' + i, name: 'P' + i })) });
const holding = (g) => g.items[g.players.P0.held] && g.items[g.players.P0.held].type;
const on = (g, id) => g.stations[id].item && g.items[g.stations[id].item].type;
function work(g, station) { goTo(g, 'P0', station); act(g, 'P0'); act(g, 'P0'); run(g, 3.2); act(g, 'P0'); }
function dry(g, station = 'dryer1') { goTo(g, 'P0', station); act(g, 'P0'); run(g, 6.2); act(g, 'P0'); }

test('khô gà lá chanh: chicken → marinate → dryer → pack → counter', () => {
  const g = game();
  g.orders = [{ id: 1, recipe: 'ga', t: 95, total: 95, client: 0, spot: 0 }];
  goTo(g, 'P0', 'ga'); act(g, 'P0');
  work(g, 'prep1'); assert.equal(holding(g), 'ga_uop');
  dry(g); assert.equal(holding(g), 'kho_ga');
  work(g, 'pack1'); assert.equal(holding(g), 'goi_ga');
  goTo(g, 'P0', 'deliver'); act(g, 'P0');
  assert.equal(g.done, 1);
});

test('gift box: dried beef pack + dried mango, Má may ask to re-stamp it once', () => {
  const g = game();
  g.items.b = { id: 'b', type: 'goi_bo' }; g.stations.c3.item = 'b';
  g.items.m = { id: 'm', type: 'fruit_dry' }; g.players.P0.held = 'm';
  goTo(g, 'P0', 'c3'); act(g, 'P0');
  assert.equal(on(g, 'c3'), 'hop_qua');
  act(g, 'P0'); goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2);
  if (on(g, 'boss') === 'hop_tem') {
    act(g, 'P0'); work(g, 'pack2'); assert.equal(holding(g), 'hop_qua');
    goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2);
  }
  assert.equal(on(g, 'boss'), 'hop_ok');
});

test('dried food left in the dryer burns', () => {
  const g = game();
  g.items.x = { id: 'x', type: 'fruit_cut' }; g.stations.dryer2.item = 'x';
  run(g, 5.1); assert.equal(g.items.x.type, 'fruit_dry');
  run(g, 9.1); assert.equal(g.items.x.type, 'burnt');
});

test('Má switches the dryers off; the breaker turns them back on', () => {
  const g = game();
  g.items.x = { id: 'x', type: 'ga_uop' }; g.stations.dryer1.item = 'x';
  run(g, L.powerCut.at[0] + 0.1, 0.25);
  assert.equal(g.stations.dryer1.off, true);
  const p = g.stations.dryer1.progress;
  run(g, 2);
  assert.equal(g.stations.dryer1.progress, p, 'no drying without power');
  goTo(g, 'P0', 'breaker');
  assert.match(hintFor(g, g.players.P0), /cầu dao/);
  act(g, 'P0');
  assert.equal(g.stations.dryer1.off, false);
});

test('flash sale: clients rush in at once and pay ×1.5', () => {
  const g = game(4);
  run(g, L.flash.at[0] - 1, 0.25);
  g.orders = [];
  run(g, 1.2);
  const flash = g.orders.filter((o) => o.bonus);
  assert.equal(flash.length, L.flash.count);
  assert.ok(flash.every((o) => L.flash.recipes.includes(o.recipe)));
  // deliver one flash order: reward is boosted
  const o = flash[0];
  const item = L.recipes[o.recipe].item;
  g.orders = [o];
  g.items.z = { id: 'z', type: item }; g.players.P0.held = 'z';
  goTo(g, 'P0', 'deliver');
  const before = g.money; act(g, 'P0');
  assert.ok(g.money - before >= Math.round(L.recipes[o.recipe].reward * 1.5));
});

test('every Ba & Má recipe can be made from the stations on the map', () => {
  const P = L.process;
  const makeable = new Set(L.stations.filter((s) => s.kind === 'source').map((s) => s.gives));
  for (let k = 0; k < 6; k++) {
    for (const table of [P.work, P.auto]) for (const rules of Object.values(table)) for (const [from, r] of Object.entries(rules)) if (makeable.has(from)) makeable.add(r.to);
    for (const [[a, b], out] of P.combos) if (makeable.has(a) && makeable.has(b)) makeable.add(out);
  }
  for (const r of Object.values(L.recipes)) assert.ok(makeable.has(r.item), r.title);
});
