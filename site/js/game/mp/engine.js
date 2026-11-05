// Overdeadline & Overburnout — co-op order-rush rules (SOS Advisory multiplayer).
// PURE: no DOM, no Three.js, no network. The host runs it; clients only render the state it sends.
// State is plain JSON (safe to broadcast as-is). Functions mutate the state and return events for the UI.
import { LEVELS } from './levels.js';

export { LEVELS };

// ---------- items ----------
export const ITEMS = {
  brief: { label: 'Brief', icon: '📝', color: '#fff1b8' },
  data: { label: 'Data thô', icon: '📊', color: '#bfe3ff' },
  excel: { label: 'Excel sạch', icon: '📗', color: '#b8f0d8' },
  slide: { label: 'Slide', icon: '🖼️', color: '#e3d9ff' },
  print: { label: 'Bản in', icon: '📄', color: '#ffffff' },
  deck: { label: 'Deck', icon: '📚', color: '#c9b6ff' },
  deck_notes: { label: 'Deck "vài ý nhỏ"', icon: '🖍️', color: '#ffc2b3' },
  deck_signed: { label: 'Deck đã ký', icon: '✅', color: '#9be7c4' },
  ruined: { label: 'v3_FINAL_sửa_lần_cuối (hỏng)', icon: '🔥', color: '#9a9a9a' },
};

// work stations: a player stands there and works (burnout goes up)
const WORK = {
  laptop: { data: { to: 'excel', time: 3.5 }, brief: { to: 'slide', time: 3 }, deck_notes: { to: 'deck', time: 2 } },
};
// auto stations: put the item in and it processes by itself
const AUTO = {
  printer: { excel: { to: 'print', time: 5, overdue: 8 } },
  boss: { deck: { to: 'deck_signed', time: 3 } },
};
const COMBOS = [[['slide', 'print'], 'deck']];

export const TUNING = {
  reach: 1.35,        // max distance from a station centre to use it
  floorReach: 1.0,    // max distance to pick an item up from the floor
  workMove: 0.25,     // moving further than this from where you started working stops the work
  burn: { work: 7, carry: 0.8, idle: -1.6, meeting: 3, coffee: -35, jitter: 15 },
  tiredAt: 70,        // ≥ this: slower walking and working
  collapse: 6,        // seconds sitting on the floor at 100 burnout
  afterCollapse: 55,
  coffeeWindow: 45,   // the 3rd coffee within this many seconds backfires
  jitter: 8,
  failPenalty: 20,    // thousand đồng lost when an order expires
};

const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

// small deterministic RNG stored in the state (so a restarted host keeps going the same way)
function rand(state) {
  let t = (state.rng = (state.rng + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const PLAYER_COLORS = ['#c9b6ff', '#b8f0d8', '#ffc2b3', '#bfe3ff'];

/** players: [{ id, name, color? }] */
export function createGame(levelId, { seed = 1, players = [] } = {}) {
  const L = LEVELS[levelId];
  if (!L) throw new Error('unknown level ' + levelId);
  const state = {
    level: levelId,
    phase: 'play',
    time: L.duration,        // seconds left
    elapsed: 0,
    rng: (seed >>> 0) || 1,
    money: 0,
    done: 0, failed: 0,
    nextItem: 1, nextOrder: 1,
    nextSpawn: L.firstOrders[0],
    firstOrders: [...L.firstOrders],
    standup: { idx: 0, warn: false, ring: 0 },
    items: {},
    stations: {},
    orders: [],
    players: {},
  };
  for (const s of L.stations) state.stations[s.id] = { id: s.id, kind: s.kind, x: s.x, z: s.z, item: null, progress: 0, overdue: 0, busy: false };
  players.forEach((p, i) => addPlayer(state, p, i));
  return state;
}

export function addPlayer(state, p, i = Object.keys(state.players).length) {
  const L = LEVELS[state.level];
  const start = L.spawns[i % L.spawns.length];
  state.players[p.id] = {
    id: p.id, name: p.name || 'SOS', color: p.color || PLAYER_COLORS[i % PLAYER_COLORS.length],
    x: start.x, z: start.z, held: null, burnout: 0, working: null, workAt: null,
    collapsed: 0, meeting: 0, jitter: 0, cups: [], online: true,
  };
  return state.players[p.id];
}

export function removePlayer(state, id) {
  const p = state.players[id];
  if (!p) return [];
  dropToFloor(state, p);
  delete state.players[id];
  return [{ type: 'toast', text: `${p.name} đã rời phòng. Việc dang dở rơi xuống sàn.`, cls: 'bad' }];
}

const frozen = (p) => p.collapsed > 0 || p.meeting > 0;
export const isFrozen = frozen;
export const isTired = (p) => p.burnout >= TUNING.tiredAt;
/** walking speed multiplier for the client that moves this player */
export function speedOf(p) {
  if (!p || frozen(p)) return 0;
  return (isTired(p) ? 0.72 : 1) * (p.jitter > 0 ? 1.15 : 1);
}

function newItem(state, type, extra = {}) {
  const id = 'i' + state.nextItem++;
  state.items[id] = { id, type, ...extra };
  return id;
}

function dropToFloor(state, p) {
  if (!p.held) return;
  const it = state.items[p.held];
  if (it) { it.floor = { x: p.x, z: p.z }; }
  p.held = null;
}

export function setPlayerPos(state, id, x, z) {
  const p = state.players[id];
  if (!p || frozen(p)) return;
  p.x = x; p.z = z;
  if (p.working && p.workAt && dist(p, p.workAt) > TUNING.workMove) { p.working = null; p.workAt = null; }
}

/** Nearest usable station (and floor item) for a player — also used by the client to show a hint. */
export function targetOf(state, p) {
  const L = LEVELS[state.level];
  let best = null, bd = Infinity;
  for (const s of L.stations) {
    const d = dist(p, s);
    if (d < bd && d <= TUNING.reach) { bd = d; best = s; }
  }
  let floor = null, fd = Infinity;
  for (const it of Object.values(state.items)) {
    if (!it.floor) continue;
    const d = dist(p, it.floor);
    if (d < fd && d <= TUNING.floorReach) { fd = d; floor = it; }
  }
  // empty hands: an item lying on the floor wins over the station when it is at least as close
  const pickFloor = !!floor && !(p.held) && (!best || fd <= bd + 0.15);
  return { station: best && !pickFloor ? state.stations[best.id] : null, def: pickFloor ? null : best, floor };
}

/** Short hint for the player's single action button ("Space: Lấy Brief"). */
export function hintFor(state, p) {
  if (!p || frozen(p)) return null;
  const { station: s, def, floor } = targetOf(state, p);
  const held = p.held && state.items[p.held];
  if (!s) {
    if (!held && floor) return `Nhặt ${ITEMS[floor.type].label}`;
    return null;
  }
  const on = s.item && state.items[s.item];
  switch (s.kind) {
    case 'source': return held ? null : `Lấy ${ITEMS[def.gives].label}`;
    case 'trash': return held ? `Vứt ${ITEMS[held.type].label}` : null;
    case 'coffee': return 'Uống cà phê ☕';
    case 'deliver': return held ? `Nộp ${ITEMS[held.type].label} cho khách` : null;
    default:
      if (held) {
        if (on) return combine(held.type, on.type) ? `Ghép thành ${ITEMS[combine(held.type, on.type)].label}` : null;
        if (accepts(s.kind, held.type)) return `Đặt ${ITEMS[held.type].label} vào ${def.label}`;
        return null;
      }
      if (on && s.kind === 'laptop' && WORK.laptop[on.type]) return p.working === s.id ? 'Đang làm…' : `Làm ${ITEMS[on.type].label} → ${ITEMS[WORK.laptop[on.type].to].label}`;
      if (on) return `Lấy ${ITEMS[on.type].label}`;
      return null;
  }
}

function combine(a, b) {
  for (const [[x, y], out] of COMBOS) if ((a === x && b === y) || (a === y && b === x)) return out;
  return null;
}
function accepts(kind, type) {
  if (kind === 'counter') return true;
  if (kind === 'laptop') return !!WORK.laptop[type];
  if (AUTO[kind]) return !!AUTO[kind][type];
  return false;
}

const say = (to, text, cls = '') => ({ type: 'toast', to, text, cls });

/** The single action button. Returns events. */
export function act(state, id) {
  const p = state.players[id];
  if (!p || state.phase !== 'play') return [];
  if (frozen(p)) return [];
  const { station: s, def, floor } = targetOf(state, p);
  const held = p.held ? state.items[p.held] : null;
  if (!s) {
    if (!held && floor) { delete floor.floor; p.held = floor.id; return [{ type: 'sfx', name: 'blip' }]; }
    return [];
  }
  const on = s.item ? state.items[s.item] : null;

  if (s.kind === 'coffee') return drinkCoffee(state, p);
  if (s.kind === 'source') {
    if (held) return [say(id, 'Tay đang cầm đồ rồi.')];
    p.held = newItem(state, def.gives);
    return [{ type: 'sfx', name: 'blip' }];
  }
  if (s.kind === 'trash') {
    if (!held) return [];
    delete state.items[held.id]; p.held = null;
    return [{ type: 'sfx', name: 'bad' }, say(id, `Đã vứt ${ITEMS[held.type].label}.`)];
  }
  if (s.kind === 'deliver') {
    if (!held) return [];
    return deliver(state, p, held);
  }

  // counters and processing stations
  if (held) {
    if (on) {
      const out = combine(held.type, on.type);
      if (!out) return [say(id, `${def.label} đang có đồ rồi.`)];
      if (s.kind !== 'counter') return [say(id, 'Ghép đồ ở bàn ghép nhé.')];
      delete state.items[held.id]; p.held = null;
      on.type = out;
      return [{ type: 'sfx', name: 'good' }, say(id, `Ghép xong ${ITEMS[out].label}!`, 'good')];
    }
    if (!accepts(s.kind, held.type)) return [say(id, `${def.label} không nhận ${ITEMS[held.type].label}.`)];
    s.item = held.id; p.held = null; s.progress = 0; s.overdue = 0;
    return [{ type: 'sfx', name: 'blip' }];
  }
  if (!on) return [];
  if (s.kind === 'laptop' && WORK.laptop[on.type]) {
    // take over a laptop someone else stopped working on, or start fresh
    for (const q of Object.values(state.players)) if (q.working === s.id && q.id !== p.id) return [say(id, `${q.name} đang làm máy này.`)];
    p.working = s.id; p.workAt = { x: p.x, z: p.z };
    return [{ type: 'sfx', name: 'choose' }];
  }
  // pick it up (stops processing; a half-done auto job keeps its progress only while it stays in the machine)
  s.item = null; s.progress = 0; s.overdue = 0; s.busy = false;
  p.held = on.id;
  return [{ type: 'sfx', name: 'blip' }];
}

function drinkCoffee(state, p) {
  const ev = [{ type: 'sfx', name: 'ding' }];
  p.cups = p.cups.filter((t) => state.elapsed - t < TUNING.coffeeWindow);
  p.cups.push(state.elapsed);
  if (p.cups.length >= 3) {
    p.jitter = TUNING.jitter;
    p.burnout = Math.min(99, p.burnout + TUNING.burn.jitter);
    p.cups = [];
    ev.push(say(p.id, 'Ly thứ ba… tim đập nhanh hơn deadline 💓', 'bad'));
  } else {
    p.burnout = Math.max(0, p.burnout + TUNING.burn.coffee);
    ev.push(say(p.id, 'Cà phê vào, burnout ra ☕', 'good'));
  }
  return ev;
}

function deliver(state, p, held) {
  const L = LEVELS[state.level];
  const order = state.orders.find((o) => L.recipes[o.recipe].item === held.type);
  if (!order) return [say(p.id, `Không ai đặt ${ITEMS[held.type].label}. Khách: "Cái này là gì em?"`, 'bad'), { type: 'sfx', name: 'bad' }];
  const R = L.recipes[order.recipe];
  const who = clientName(state, order);
  const tip = Math.round(R.reward * 0.5 * (order.t / order.total));
  state.money += R.reward + tip;
  state.done++;
  state.orders = state.orders.filter((o) => o !== order);
  delete state.items[held.id]; p.held = null;
  return [{ type: 'sfx', name: 'good' }, { type: 'served', order: order.id }, { type: 'toast', text: `✅ ${who} nhận ${R.title}: +${R.reward}k${tip ? ` (+${tip}k tip)` : ''}`, cls: 'good' }];
}

/** The client (from the level's cast) who placed this order. */
export function clientName(state, order) {
  const c = LEVELS[state.level].clients;
  return c && c[order.client] ? c[order.client].name : 'Khách';
}

function spawnOrder(state) {
  const L = LEVELS[state.level];
  const pool = L.orderPool.filter((o) => state.elapsed >= (o.after || 0));
  const total = pool.reduce((a, o) => a + o.w, 0);
  let r = rand(state) * total, pick = pool[0];
  for (const o of pool) { r -= o.w; if (r <= 0) { pick = o; break; } }
  const R = L.recipes[pick.recipe];
  // who walks in (not someone already waiting) and where they sit in the lobby
  const n = (L.clients || []).length;
  let client = 0;
  if (n) {
    const busy = new Set(state.orders.map((o) => o.client));
    const free = [...Array(n).keys()].filter((i) => !busy.has(i));
    client = free.length ? free[Math.floor(rand(state) * free.length)] : 0;
  }
  const taken = new Set(state.orders.map((o) => o.spot));
  let spot = 0;
  while (taken.has(spot)) spot++;
  state.orders.push({ id: state.nextOrder++, recipe: pick.recipe, t: R.time, total: R.time, client, spot });
  return [{ type: 'order', recipe: pick.recipe }, { type: 'sfx', name: 'ring' }];
}

function maxOrders(state) {
  const spots = (LEVELS[state.level].clientSpots || []).length || 4;
  return Math.min(spots, 2 + Object.keys(state.players).length);
}
function spawnGap(state) {
  const n = Math.max(1, Object.keys(state.players).length);
  return LEVELS[state.level].spawnGap[Math.min(n, 4) - 1];
}

/** Advance the game by dt seconds. Returns events. */
export function step(state, dt) {
  if (state.phase !== 'play') return [];
  const L = LEVELS[state.level];
  const ev = [];
  state.time = Math.max(0, state.time - dt);
  state.elapsed += dt;

  // orders: spawn and expire
  if (state.firstOrders.length && state.elapsed >= state.firstOrders[0]) {
    state.firstOrders.shift();
    ev.push(...spawnOrder(state));
    state.nextSpawn = state.elapsed + spawnGap(state);
  } else if (!state.firstOrders.length && state.elapsed >= state.nextSpawn) {
    if (state.orders.length < maxOrders(state)) ev.push(...spawnOrder(state));
    state.nextSpawn = state.elapsed + spawnGap(state);
  }
  for (const o of state.orders) o.t -= dt;
  const expired = state.orders.filter((o) => o.t <= 0);
  if (expired.length) {
    state.orders = state.orders.filter((o) => o.t > 0);
    for (const o of expired) {
      state.failed++;
      state.money -= TUNING.failPenalty;
      ev.push({ type: 'gone', order: o.id }, { type: 'toast', text: `😤 ${clientName(state, o)} bỏ về: trễ "${L.recipes[o.recipe].title}". −${TUNING.failPenalty}k`, cls: 'bad' }, { type: 'sfx', name: 'bad' });
    }
  }

  // stand-up meeting (T&M): warn, then everyone near the Scrum board is pulled in
  const su = L.standup;
  if (su && state.standup.idx < su.at.length) {
    const at = su.at[state.standup.idx];
    if (!state.standup.warn && state.elapsed >= at - su.warn) {
      state.standup.warn = true;
      ev.push({ type: 'toast', text: `🔔 ${su.warnText}`, cls: 'drama' }, { type: 'sfx', name: 'ring' }, { type: 'standup-warn' });
    }
    if (state.elapsed >= at) {
      state.standup.idx++; state.standup.warn = false; state.standup.ring = su.length;
      const caught = [];
      for (const p of Object.values(state.players)) {
        if (p.collapsed > 0) continue;
        if (dist(p, su.board) <= su.radius) { p.meeting = su.length; p.working = null; p.workAt = null; caught.push(p.name); }
      }
      ev.push({ type: 'standup', caught });
      ev.push({ type: 'toast', text: caught.length ? `📋 Daily stand-up! ${caught.join(', ')} bị kéo vào họp. ${su.line}` : '📋 Stand-up reo… nhưng không ai đứng gần bảng. Thoát!', cls: caught.length ? 'drama' : 'good' });
    }
  }
  if (state.standup.ring > 0) state.standup.ring = Math.max(0, state.standup.ring - dt);

  // players: work, burnout, collapse, meetings
  for (const p of Object.values(state.players)) {
    if (p.jitter > 0) p.jitter = Math.max(0, p.jitter - dt);
    if (p.meeting > 0) {
      p.meeting = Math.max(0, p.meeting - dt);
      p.burnout = Math.min(100, p.burnout + TUNING.burn.meeting * dt);
    } else if (p.collapsed > 0) {
      p.collapsed = Math.max(0, p.collapsed - dt);
      if (p.collapsed === 0) { p.burnout = TUNING.afterCollapse; ev.push(say(p.id, 'Dậy rồi. Deadline vẫn còn đó 🫠')); }
      continue;
    } else if (p.working) {
      const s = state.stations[p.working];
      const it = s && s.item && state.items[s.item];
      const rule = it && WORK.laptop[it.type];
      if (!rule) { p.working = null; p.workAt = null; }
      else {
        const rate = (isTired(p) ? 0.7 : 1) * (p.jitter > 0 ? 1.25 : 1);
        s.progress += (dt * rate) / rule.time;
        p.burnout += TUNING.burn.work * dt;
        if (s.progress >= 1) {
          it.type = rule.to; s.progress = 0; p.working = null; p.workAt = null;
          ev.push({ type: 'sfx', name: 'good' }, say(p.id, `Xong ${ITEMS[rule.to].label}!`, 'good'));
        }
      }
    } else if (p.held) {
      p.burnout += TUNING.burn.carry * dt;
    } else {
      p.burnout += TUNING.burn.idle * dt;
    }
    p.burnout = Math.max(0, p.burnout);
    if (p.burnout >= 100 && p.collapsed === 0) {
      p.burnout = 100; p.collapsed = TUNING.collapse; p.working = null; p.workAt = null; p.meeting = 0;
      dropToFloor(state, p);
      ev.push({ type: 'toast', text: `🫠 ${p.name} BURNOUT! Ngồi gục ${TUNING.collapse} giây.`, cls: 'bad' }, { type: 'sfx', name: 'bad' });
    }
  }

  // auto stations: printer, boss sign-off
  for (const s of Object.values(state.stations)) {
    const rules = AUTO[s.kind];
    if (!rules || !s.item) continue;
    const it = state.items[s.item];
    const rule = it && rules[it.type];
    if (rule) {
      s.busy = true;
      s.progress += dt / rule.time;
      if (s.progress >= 1) {
        s.progress = 0; s.busy = false;
        if (s.kind === 'boss' && !it.noted && rand(state) < L.notesChance) {
          it.type = 'deck_notes'; it.noted = true;
          ev.push({ type: 'toast', text: `🖍️ ${L.bossName}: "${L.bossLine}" Deck quay về laptop sửa.`, cls: 'drama' }, { type: 'sfx', name: 'bad' });
        } else {
          it.type = rule.to;
          ev.push({ type: 'sfx', name: 'ding' });
          if (s.kind === 'boss') ev.push({ type: 'toast', text: `✍️ ${L.bossName} đã ký!`, cls: 'good' });
        }
      }
    } else if (s.kind === 'printer' && it && it.type === 'print') {
      s.busy = false;
      s.overdue += dt;
      if (s.overdue >= rules.excel.overdue) {
        it.type = 'ruined'; s.overdue = 0;
        ev.push({ type: 'toast', text: '🔥 Máy in kẹt giấy, in nhầm 200 bản. File thành "v3_FINAL_sửa_lần_cuối". Vứt đi làm lại!', cls: 'bad' }, { type: 'sfx', name: 'bad' });
      }
    } else { s.busy = false; }
  }

  if (state.time <= 0) {
    state.phase = 'over';
    ev.push({ type: 'over' });
  }
  return ev;
}

/** 0–3 stars for the final money. */
export function starsFor(state) {
  const L = LEVELS[state.level];
  const n = Math.max(1, Object.keys(state.players).length);
  const scale = n === 1 ? 0.6 : 1;
  return L.stars.filter((s) => state.money >= s * scale).length;
}
export function starGoals(state) {
  const n = Math.max(1, Object.keys(state.players).length);
  const scale = n === 1 ? 0.6 : 1;
  return LEVELS[state.level].stars.map((s) => Math.round(s * scale));
}
