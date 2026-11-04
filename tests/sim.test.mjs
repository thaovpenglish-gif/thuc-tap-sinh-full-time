// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, reduce } from '../site/js/game/sim.js';

function setup() {
  let s = createState({
    counters: [{ id: 'c1', x: 2, z: 0 }],
    items: [{ id: 'brief', type: 'brief', at: { kind: 'floor', x: 0, z: 0 } }],
  });
  s = reduce(s, { type: 'join', playerId: 'A', x: 0, z: 0.5 }).state;
  s = reduce(s, { type: 'join', playerId: 'B', x: 0.5, z: 0.5 }).state;
  return s;
}

test('a player picks up an item within reach', () => {
  const r = reduce(setup(), { type: 'pickup', playerId: 'A', itemId: 'brief' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.state.players.A.held, ['brief']);
  assert.equal(r.state.items.brief.loc.kind, 'player');
});

test('the same item cannot be picked up twice (no duplication)', () => {
  let s = reduce(setup(), { type: 'pickup', playerId: 'A', itemId: 'brief' }).state;
  const r = reduce(s, { type: 'pickup', playerId: 'B', itemId: 'brief' });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'already-held');
  assert.deepEqual(r.state.players.B.held, []);
});

test('reducer does not mutate the previous state', () => {
  const s = setup();
  reduce(s, { type: 'pickup', playerId: 'A', itemId: 'brief' });
  assert.deepEqual(s.players.A.held, []);
  assert.equal(s.items.brief.loc.kind, 'floor');
});

test('carrying capacity is enforced', () => {
  let s = setup();
  s = reduce(s, { type: 'spawn', item: { id: 'data', type: 'data', at: { kind: 'floor', x: 0, z: 0 } } }).state;
  s = reduce(s, { type: 'pickup', playerId: 'A', itemId: 'brief' }).state;
  const r = reduce(s, { type: 'pickup', playerId: 'A', itemId: 'data' });
  assert.equal(r.reason, 'hands-full');
});

test('items far away cannot be picked up', () => {
  let s = reduce(setup(), { type: 'move', playerId: 'A', x: 8, z: 8 }).state;
  assert.equal(reduce(s, { type: 'pickup', playerId: 'A', itemId: 'brief' }).reason, 'too-far');
});

test('placing on a counter, then a teammate picks it up from there', () => {
  let s = reduce(setup(), { type: 'pickup', playerId: 'A', itemId: 'brief' }).state;
  s = reduce(s, { type: 'move', playerId: 'A', x: 1.2, z: 0 }).state;
  let r = reduce(s, { type: 'drop', playerId: 'A', itemId: 'brief', counterId: 'c1' });
  assert.equal(r.ok, true);
  assert.equal(r.state.counters.c1.itemId, 'brief');
  s = reduce(r.state, { type: 'move', playerId: 'B', x: 2.5, z: 0.5 }).state;
  r = reduce(s, { type: 'pickup', playerId: 'B', itemId: 'brief' });
  assert.equal(r.ok, true);
  assert.equal(r.state.counters.c1.itemId, null);
});

test('a full counter rejects another item', () => {
  let s = setup();
  s = reduce(s, { type: 'spawn', item: { id: 'x', type: 'data', at: { kind: 'counter', id: 'c1' } } }).state;
  s = reduce(s, { type: 'pickup', playerId: 'A', itemId: 'brief' }).state;
  s = reduce(s, { type: 'move', playerId: 'A', x: 1.2, z: 0 }).state;
  assert.equal(reduce(s, { type: 'drop', playerId: 'A', itemId: 'brief', counterId: 'c1' }).reason, 'counter-full');
});

test('hand-off works only when players stand close together', () => {
  let s = reduce(setup(), { type: 'pickup', playerId: 'A', itemId: 'brief' }).state;
  let r = reduce(s, { type: 'handoff', playerId: 'A', toId: 'B', itemId: 'brief' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.state.players.B.held, ['brief']);
  s = reduce(r.state, { type: 'move', playerId: 'A', x: 6, z: 6 }).state;
  r = reduce(s, { type: 'handoff', playerId: 'B', toId: 'A', itemId: 'brief' });
  assert.equal(r.reason, 'too-far');
});

test('a disconnecting player drops what they carried on the floor', () => {
  let s = reduce(setup(), { type: 'pickup', playerId: 'A', itemId: 'brief' }).state;
  s = reduce(s, { type: 'move', playerId: 'A', x: 3, z: 1 }).state;
  const r = reduce(s, { type: 'leave', playerId: 'A' });
  assert.deepEqual(r.state.items.brief.loc, { kind: 'floor', x: 3, z: 1 });
  assert.equal(r.state.players.A.online, false);
});

test('unknown actions are rejected', () => {
  assert.equal(reduce(setup(), { type: 'teleport' }).ok, false);
});
