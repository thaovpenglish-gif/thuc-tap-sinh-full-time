// Overdeadline & Overburnout: pure rules. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, step, setPlayerPos, starsFor, TUNING, LEVELS, removePlayer, hintFor } from '../site/js/game/mp/engine.js';

const L = LEVELS.tm;
const st = (id) => L.stations.find((s) => s.id === id);
// stand right in front of a station (towards the room centre)
function goTo(g, pid, id) { const s = st(id); setPlayerPos(g, pid, s.x, s.z + (s.z < 0 ? 0.7 : s.z > 0 ? -0.7 : 0.7)); }
function run(g, secs, dt = 0.1) { const ev = []; for (let t = 0; t < secs; t += dt) ev.push(...step(g, dt)); return ev; }
function game(n = 1) {
  return createGame('tm', { seed: 7, players: Array.from({ length: n }, (_, i) => ({ id: 'P' + i, name: 'P' + i })) });
}

test('a report goes Data → laptop (work) → printer (auto) → client', () => {
  const g = game();
  run(g, 2.1); // first order appears
  g.orders = [{ id: 99, recipe: 'report', t: 75, total: 75 }];
  goTo(g, 'P0', 'data'); act(g, 'P0');
  assert.equal(g.items[g.players.P0.held].type, 'data');
  goTo(g, 'P0', 'lap1'); act(g, 'P0'); // place
  act(g, 'P0'); // start working
  assert.equal(g.players.P0.working, 'lap1');
  run(g, 3.7);
  assert.equal(g.items[g.stations.lap1.item].type, 'excel');
  assert.ok(g.players.P0.burnout > 20, 'working builds burnout');
  act(g, 'P0'); // pick excel
  goTo(g, 'P0', 'printer'); act(g, 'P0');
  run(g, 5.2);
  assert.equal(g.items[g.stations.printer.item].type, 'print');
  act(g, 'P0');
  goTo(g, 'P0', 'deliver');
  const before = g.money;
  act(g, 'P0');
  assert.ok(g.money > before + 60 - 1, 'reward + tip');
  assert.equal(g.done, 1);
});

test('walking away stops laptop work', () => {
  const g = game();
  goTo(g, 'P0', 'brief'); act(g, 'P0');
  goTo(g, 'P0', 'lap2'); act(g, 'P0'); act(g, 'P0');
  run(g, 1);
  setPlayerPos(g, 'P0', 0, 2);
  assert.equal(g.players.P0.working, null);
  const p = g.stations.lap2.progress;
  run(g, 2);
  assert.equal(g.stations.lap2.progress, p);
});

test('a print left in the printer too long is ruined', () => {
  const g = game();
  g.items.x = { id: 'x', type: 'excel' }; g.stations.printer.item = 'x';
  run(g, 5.1);
  assert.equal(g.items.x.type, 'print');
  run(g, 8.1);
  assert.equal(g.items.x.type, 'ruined');
});

test('slide + print combine into a deck on a counter, the boss signs it (maybe after "vài ý nhỏ")', () => {
  const g = game();
  g.items.s = { id: 's', type: 'slide' }; g.stations.c1.item = 's';
  g.items.p = { id: 'p', type: 'print' }; g.players.P0.held = 'p';
  goTo(g, 'P0', 'c1'); act(g, 'P0');
  assert.equal(g.items.s.type, 'deck');
  assert.equal(g.items.p, undefined);
  act(g, 'P0'); // pick the deck
  goTo(g, 'P0', 'boss'); act(g, 'P0');
  run(g, 3.2);
  const t = g.items.s.type;
  assert.ok(t === 'deck_signed' || t === 'deck_notes', t);
  if (t === 'deck_notes') {
    act(g, 'P0'); goTo(g, 'P0', 'lap1'); act(g, 'P0'); act(g, 'P0'); run(g, 2.2);
    assert.equal(g.items.s.type, 'deck');
    act(g, 'P0'); goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 3.2);
    assert.equal(g.items.s.type, 'deck_signed', 'notes only once per deck');
  }
});

test('burnout 100 → collapse, the held item falls on the floor, a teammate can pick it up', () => {
  const g = game(2);
  goTo(g, 'P0', 'data'); act(g, 'P0');
  g.players.P0.burnout = 99.99;
  run(g, 0.2);
  assert.ok(g.players.P0.collapsed > 0);
  assert.equal(g.players.P0.held, null);
  const fallen = Object.values(g.items).find((i) => i.floor);
  assert.ok(fallen);
  setPlayerPos(g, 'P1', fallen.floor.x + 0.3, fallen.floor.z);
  assert.match(hintFor(g, g.players.P1), /Nhặt/);
  act(g, 'P1');
  assert.equal(g.players.P1.held, fallen.id);
  run(g, TUNING.collapse + 0.2);
  assert.equal(g.players.P0.collapsed, 0);
  assert.equal(Math.round(g.players.P0.burnout), TUNING.afterCollapse);
});

test('coffee lowers burnout, the third cup backfires', () => {
  const g = game();
  g.players.P0.burnout = 80;
  goTo(g, 'P0', 'coffee');
  act(g, 'P0'); assert.equal(g.players.P0.burnout, 45);
  act(g, 'P0'); assert.equal(g.players.P0.burnout, 10);
  act(g, 'P0'); assert.equal(g.players.P0.burnout, 25);
  assert.ok(g.players.P0.jitter > 0);
});

test('stand-up pulls in players near the board only', () => {
  const g = game(2);
  setPlayerPos(g, 'P0', L.standup.board.x - 1, L.standup.board.z);
  setPlayerPos(g, 'P1', -5, 0);
  run(g, L.standup.at[0] + 0.1);
  assert.ok(g.players.P0.meeting > 0);
  assert.equal(g.players.P1.meeting, 0);
  const x = g.players.P0.x;
  setPlayerPos(g, 'P0', 0, 0);
  assert.equal(g.players.P0.x, x, 'frozen during the meeting');
});

test('orders expire with a penalty; the game ends and gives stars', () => {
  const g = game(2);
  const ev = run(g, L.duration + 0.2, 0.25);
  assert.equal(g.phase, 'over');
  assert.ok(g.failed > 0);
  assert.ok(g.money < 0);
  assert.equal(starsFor(g), 0);
  assert.ok(ev.some((e) => e.type === 'over'));
});

test('a leaving player drops what they carried', () => {
  const g = game(2);
  goTo(g, 'P1', 'brief'); act(g, 'P1');
  const id = g.players.P1.held;
  removePlayer(g, 'P1');
  assert.ok(g.items[id].floor);
  assert.equal(g.players.P1, undefined);
});

test('wrong item at the client counter is refused', () => {
  const g = game();
  g.orders = [{ id: 1, recipe: 'deck', t: 100, total: 120 }];
  goTo(g, 'P0', 'brief'); act(g, 'P0');
  goTo(g, 'P0', 'deliver'); act(g, 'P0');
  assert.ok(g.players.P0.held, 'still holding the brief');
  assert.equal(g.done, 0);
});

test('each waiting order has its own client and its own lobby seat', () => {
  const g = game(4);
  run(g, 120, 0.25);
  const open = g.orders;
  assert.ok(open.length >= 2, 'several orders open');
  assert.equal(new Set(open.map((o) => o.client)).size, open.length, 'no client twice');
  assert.equal(new Set(open.map((o) => o.spot)).size, open.length, 'no seat twice');
  for (const o of open) assert.ok(o.spot < L.clientSpots.length && o.client < L.clients.length);
});

test('serving and expiring tell the lobby which client leaves', () => {
  const g = game();
  g.orders = [{ id: 5, recipe: 'slide', t: 50, total: 55, client: 1, spot: 0 }, { id: 6, recipe: 'report', t: 0.05, total: 75, client: 2, spot: 1 }];
  g.items.s = { id: 's', type: 'slide' }; g.players.P0.held = 's';
  goTo(g, 'P0', 'deliver');
  assert.ok(act(g, 'P0').some((e) => e.type === 'served' && e.order === 5));
  assert.ok(step(g, 0.1).some((e) => e.type === 'gone' && e.order === 6));
});

test('new T&M tasks: tea, excel, meeting minutes, signed contract', () => {
  const g = game();
  g.orders = [
    { id: 1, recipe: 'tea', t: 40, total: 40, client: 0, spot: 0 },
    { id: 2, recipe: 'minutes', t: 70, total: 70, client: 1, spot: 1 },
    { id: 3, recipe: 'contract', t: 90, total: 90, client: 2, spot: 2 },
  ];
  // tea: straight from the pantry
  goTo(g, 'P0', 'tea'); act(g, 'P0');
  assert.equal(g.items[g.players.P0.held].type, 'tea');
  goTo(g, 'P0', 'deliver'); act(g, 'P0');
  assert.equal(g.done, 1);
  // minutes: brief worked at the huddle table
  goTo(g, 'P0', 'brief'); act(g, 'P0');
  goTo(g, 'P0', 'huddle'); act(g, 'P0'); act(g, 'P0');
  assert.equal(g.players.P0.working, 'huddle');
  run(g, 4.2);
  assert.equal(g.items[g.stations.huddle.item].type, 'minutes');
  act(g, 'P0'); goTo(g, 'P0', 'deliver'); act(g, 'P0');
  assert.equal(g.done, 2);
  // contract: shelf → printer → boss
  goTo(g, 'P0', 'contracts'); act(g, 'P0');
  goTo(g, 'P0', 'printer'); act(g, 'P0'); run(g, 4.2);
  assert.equal(g.items[g.stations.printer.item].type, 'contract_print');
  act(g, 'P0'); goTo(g, 'P0', 'boss'); act(g, 'P0'); run(g, 2.7);
  assert.equal(g.items[g.stations.boss.item].type, 'contract_signed', 'contracts never get "vài ý nhỏ"');
  act(g, 'P0'); goTo(g, 'P0', 'deliver'); act(g, 'P0');
  assert.equal(g.done, 3);
});

test('a signed contract left in the printer too long is ruined too', () => {
  const g = game();
  g.items.k = { id: 'k', type: 'contract' }; g.stations.printer.item = 'k';
  run(g, 4.1); assert.equal(g.items.k.type, 'contract_print');
  run(g, 8.1); assert.equal(g.items.k.type, 'ruined');
});

test('alone: clients come less often, wait longer, fewer at once than with 4 players', () => {
  const spawned = (n) => { const g = game(n); let max = 0; for (let t = 0; t < 180; t += 0.25) { step(g, 0.25); max = Math.max(max, g.orders.length); } return { count: g.nextOrder - 1, max }; };
  const solo = spawned(1), four = spawned(4);
  assert.ok(solo.count < four.count, `solo ${solo.count} < four ${four.count}`);
  assert.ok(solo.max <= 2 && four.max >= 3, `waiting at once: solo ${solo.max}, four ${four.max}`);
  const g1 = game(1), g4 = game(4);
  run(g1, 2.1); run(g4, 2.1);
  assert.ok(g1.orders[0].total > g4.orders[0].total, 'more patient clients when alone');
});

test('when the lobby is empty the next client arrives within seconds', () => {
  const g = game(1);
  run(g, 17); // both opening orders are in
  g.orders = [{ id: 50, recipe: 'tea', t: 40, total: 40, client: 0, spot: 0 }];
  g.nextSpawn = g.elapsed + 30;
  goTo(g, 'P0', 'tea'); act(g, 'P0'); goTo(g, 'P0', 'deliver'); act(g, 'P0');
  assert.equal(g.orders.length, 0);
  run(g, 5.3);
  assert.equal(g.orders.length, 1);
});
