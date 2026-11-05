// Overdeadline & Overburnout · Trend Trễ Agency level rules. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, step, setPlayerPos, LEVELS, hintFor } from '../site/js/game/mp/engine.js';

const L = LEVELS.agency;
const st = (id) => L.stations.find((s) => s.id === id);
function goTo(g, pid, id) { const s = st(id); setPlayerPos(g, pid, s.x, s.z + (s.z < 0 ? 0.7 : s.z > 0 ? -0.7 : 0.7)); }
function run(g, secs, dt = 0.1) { const ev = []; for (let t = 0; t < secs; t += dt) ev.push(...step(g, dt)); return ev; }
const game = (seed = 3) => createGame('agency', { seed, players: [{ id: 'P0', name: 'P0' }] });
const holding = (g) => g.items[g.players.P0.held] && g.items[g.players.P0.held].type;
const on = (g, id) => g.stations[id].item && g.items[g.stations[id].item].type;
function work(g, station, secs) { goTo(g, 'P0', station); act(g, 'P0'); act(g, 'P0'); run(g, secs); act(g, 'P0'); }

test('key visual: brief → Mac → client; "feedback nhẹ" sends it back once, fixed at the Mac', () => {
  let revised = 0, done = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = game(seed);
    g.orders = [{ id: 1, recipe: 'kv', t: 70, total: 70, client: 0, spot: 0 }];
    goTo(g, 'P0', 'brief'); act(g, 'P0');
    work(g, 'mac1', 3.7); assert.equal(holding(g), 'kv');
    goTo(g, 'P0', 'deliver'); act(g, 'P0');
    if (holding(g) === 'kv_fb') {
      revised++;
      assert.equal(g.done, 0); assert.ok(g.orders.some((o) => o.id === 1 && o.revised), 'the order stays open, marked revised');
      work(g, 'mac2', 2.2); assert.equal(holding(g), 'kv');
      goTo(g, 'P0', 'deliver'); act(g, 'P0');
    }
    assert.equal(g.done, 1, 'never revised twice'); done++;
  }
  assert.ok(revised > 0 && revised < done, `some revisions (${revised}/${done})`);
});

test('TikTok: caption filmed in the studio', () => {
  const g = game();
  goTo(g, 'P0', 'brief'); act(g, 'P0');
  work(g, 'copy', 2.7); assert.equal(holding(g), 'caption');
  work(g, 'studio', 4.2); assert.equal(holding(g), 'tiktok');
});

test('KOL no-show stops the KOL desk until someone calls a backup KOL', () => {
  const g = game();
  g.items.v = { id: 'v', type: 'kv' }; g.stations.kol.item = 'v';
  run(g, L.powerCut.at[0] + 0.1, 0.25);
  assert.equal(g.stations.kol.off, true);
  const before = g.items.v.type;
  run(g, 5);
  assert.equal(g.items.v.type, before, 'nothing posted while the KOL is missing');
  goTo(g, 'P0', 'breaker'); assert.match(hintFor(g, g.players.P0), /KOL/);
  act(g, 'P0');
  run(g, 4.2);
  assert.equal(g.items.v.type, 'kol_post');
});

test('campaign deck: KV + caption → anh Tùng ("chưa pop" once, fixed at the Mac)', () => {
  const g = game();
  g.items.a = { id: 'a', type: 'kv' }; g.stations.c1.item = 'a';
  g.items.b = { id: 'b', type: 'caption' }; g.players.P0.held = 'b';
  goTo(g, 'P0', 'c1'); act(g, 'P0'); assert.equal(on(g, 'c1'), 'deck_draft');
  act(g, 'P0'); goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2);
  if (on(g, 'boss') === 'deck_pop') { act(g, 'P0'); work(g, 'mac1', 2.2); goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2); }
  assert.equal(on(g, 'boss'), 'campaign');
});

test('every agency recipe can be made from the stations on the map', () => {
  const P = L.process;
  const makeable = new Set(L.stations.filter((s) => s.kind === 'source').map((s) => s.gives));
  for (let k = 0; k < 6; k++) {
    for (const table of [P.work, P.auto]) for (const [kind, rules] of Object.entries(table)) {
      if (!L.stations.some((s) => s.kind === kind)) continue;
      for (const [from, r] of Object.entries(rules)) if (makeable.has(from)) makeable.add(r.to);
    }
    for (const [[a, b], out] of P.combos) if (makeable.has(a) && makeable.has(b)) makeable.add(out);
  }
  for (const r of Object.values(L.recipes)) {
    assert.ok(makeable.has(r.item), r.title);
    if (r.revise) assert.ok(Object.values(P.work).some((rules) => rules[r.revise] && rules[r.revise].to === r.item), `${r.title}: revision can be fixed`);
  }
});
