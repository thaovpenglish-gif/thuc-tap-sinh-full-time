// Authoritative cooperative-work simulation (items, carrying, counters, hand-offs).
// PURE: no DOM, no Three.js, no network. reduce(state, action) -> { state, ok, reason, events }.
// The same reducer runs in Solo and on the multiplayer host; clients only send actions.

export const RULES = {
  reach: 1.6,       // max distance to pick up / place on a counter
  handReach: 1.4,   // max distance between two players for a hand-off
  capacity: 1,      // items a player can carry (configurable per level)
};

const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export function createState({ counters = [], items = [], rules = {} } = {}) {
  const state = {
    rules: { ...RULES, ...rules },
    players: {},
    counters: {},
    items: {},
    nextItem: 1,
  };
  for (const c of counters) state.counters[c.id] = { id: c.id, x: c.x, z: c.z, itemId: null };
  for (const it of items) addItem(state, it);
  return state;
}

function addItem(state, { id, type, version = 1, quality = 1, orderId = null, at }) {
  const itemId = id || `i${state.nextItem++}`;
  state.items[itemId] = { id: itemId, type, version, quality, orderId, loc: at || { kind: 'floor', x: 0, z: 0 } };
  if (at && at.kind === 'counter') state.counters[at.id].itemId = itemId;
  if (at && at.kind === 'player') state.players[at.id].held.push(itemId);
  return itemId;
}

/** World position of an item (floor, counter or carried by a player). */
export function itemPos(state, item) {
  const l = item.loc;
  if (l.kind === 'floor') return { x: l.x, z: l.z };
  if (l.kind === 'counter') return state.counters[l.id];
  if (l.kind === 'player') return state.players[l.id];
  return null;
}

function clone(state) {
  return {
    rules: state.rules,
    nextItem: state.nextItem,
    players: Object.fromEntries(Object.entries(state.players).map(([k, p]) => [k, { ...p, held: [...p.held] }])),
    counters: Object.fromEntries(Object.entries(state.counters).map(([k, c]) => [k, { ...c }])),
    items: Object.fromEntries(Object.entries(state.items).map(([k, i]) => [k, { ...i, loc: { ...i.loc } }])),
  };
}

const fail = (state, reason) => ({ state, ok: false, reason, events: [] });

function detach(s, item) {
  const l = item.loc;
  if (l.kind === 'counter') s.counters[l.id].itemId = null;
  if (l.kind === 'player') { const p = s.players[l.id]; p.held = p.held.filter((x) => x !== item.id); }
}

export function reduce(state, action) {
  const s = clone(state);
  const a = action;
  switch (a.type) {
    case 'join': {
      if (s.players[a.playerId]) { Object.assign(s.players[a.playerId], { x: a.x, z: a.z, online: true }); return { state: s, ok: true, events: [{ type: 'rejoined', playerId: a.playerId }] }; }
      s.players[a.playerId] = { id: a.playerId, x: a.x ?? 0, z: a.z ?? 0, held: [], online: true };
      return { state: s, ok: true, events: [{ type: 'joined', playerId: a.playerId }] };
    }
    case 'leave': {
      const p = s.players[a.playerId];
      if (!p) return fail(state, 'no-player');
      // whatever they carried falls on the floor where they stood, so the team can recover it
      for (const id of p.held) s.items[id].loc = { kind: 'floor', x: p.x, z: p.z };
      p.held = []; p.online = false;
      return { state: s, ok: true, events: [{ type: 'left', playerId: a.playerId }] };
    }
    case 'move': {
      const p = s.players[a.playerId];
      if (!p) return fail(state, 'no-player');
      p.x = a.x; p.z = a.z;
      return { state: s, ok: true, events: [] };
    }
    case 'spawn': {
      const id = addItem(s, a.item);
      return { state: s, ok: true, events: [{ type: 'spawned', itemId: id }] };
    }
    case 'pickup': {
      const p = s.players[a.playerId];
      const it = s.items[a.itemId];
      if (!p || !p.online) return fail(state, 'no-player');
      if (!it) return fail(state, 'no-item');
      if (it.loc.kind === 'player') return fail(state, 'already-held');
      if (p.held.length >= s.rules.capacity) return fail(state, 'hands-full');
      if (dist(p, itemPos(s, it)) > s.rules.reach) return fail(state, 'too-far');
      detach(s, it);
      it.loc = { kind: 'player', id: p.id };
      p.held.push(it.id);
      return { state: s, ok: true, events: [{ type: 'picked', playerId: p.id, itemId: it.id }] };
    }
    case 'drop': {
      const p = s.players[a.playerId];
      const it = s.items[a.itemId];
      if (!p || !it) return fail(state, 'no-target');
      if (!p.held.includes(it.id)) return fail(state, 'not-holding');
      if (a.counterId) {
        const c = s.counters[a.counterId];
        if (!c) return fail(state, 'no-counter');
        if (c.itemId) return fail(state, 'counter-full');
        if (dist(p, c) > s.rules.reach) return fail(state, 'too-far');
        detach(s, it);
        it.loc = { kind: 'counter', id: c.id };
        c.itemId = it.id;
        return { state: s, ok: true, events: [{ type: 'placed', playerId: p.id, itemId: it.id, counterId: c.id }] };
      }
      detach(s, it);
      it.loc = { kind: 'floor', x: p.x, z: p.z };
      return { state: s, ok: true, events: [{ type: 'dropped', playerId: p.id, itemId: it.id }] };
    }
    case 'handoff': {
      const p = s.players[a.playerId];
      const q = s.players[a.toId];
      const it = s.items[a.itemId];
      if (!p || !q || !it || !q.online) return fail(state, 'no-target');
      if (p.id === q.id) return fail(state, 'self');
      if (!p.held.includes(it.id)) return fail(state, 'not-holding');
      if (q.held.length >= s.rules.capacity) return fail(state, 'hands-full');
      if (dist(p, q) > s.rules.handReach) return fail(state, 'too-far');
      detach(s, it);
      it.loc = { kind: 'player', id: q.id };
      q.held.push(it.id);
      return { state: s, ok: true, events: [{ type: 'handed', from: p.id, to: q.id, itemId: it.id }] };
    }
    default:
      return fail(state, 'unknown-action');
  }
}
