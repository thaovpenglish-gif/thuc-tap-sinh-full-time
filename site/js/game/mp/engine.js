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
  tea: { label: 'Trà', icon: '🍵', color: '#c7e8b5' },
  contract: { label: 'Hợp đồng nháp', icon: '📃', color: '#fff8ef' },
  contract_print: { label: 'Hợp đồng in', icon: '📜', color: '#ffe9a0' },
  contract_signed: { label: 'Hợp đồng đã ký', icon: '🖋️', color: '#ffd25a' },
  minutes: { label: 'Biên bản họp', icon: '🗒️', color: '#e3f7ee' },
  // Ba & Má
  ga: { label: 'Gà tươi', icon: '🐔', color: '#ffe3c2' },
  bo: { label: 'Bò tươi', icon: '🐄', color: '#ffb3a7' },
  fruit: { label: 'Xoài', icon: '🥭', color: '#ffe08a' },
  ga_uop: { label: 'Gà ướp lá chanh', icon: '🍗', color: '#f6d28b' },
  bo_uop: { label: 'Bò ướp', icon: '🥩', color: '#e8907a' },
  fruit_cut: { label: 'Xoài cắt lát', icon: '🔪', color: '#fff0b3' },
  kho_ga: { label: 'Khô gà (xá)', icon: '🍗', color: '#e8b04a' },
  kho_bo: { label: 'Khô bò (xá)', icon: '🥓', color: '#c96a52' },
  fruit_dry: { label: 'Xoài sấy', icon: '🥭', color: '#f2b134' },
  goi_ga: { label: 'Gói khô gà lá chanh', icon: '🐔', color: '#b8f0d8' },
  goi_bo: { label: 'Gói khô bò', icon: '🐄', color: '#ffc8dd' },
  hop_qua: { label: 'Hộp quà Phú Quý', icon: '🧧', color: '#ff8f8f' },
  hop_tem: { label: 'Hộp quà "dán lại tem"', icon: '🏷️', color: '#ffc2b3' },
  hop_ok: { label: 'Hộp quà Má duyệt', icon: '🎁', color: '#ffd25a' },
  an_thu: { label: 'Gói ăn thử', icon: '🍢', color: '#fff1b8' },
  burnt: { label: 'Khô cháy khét', icon: '🔥', color: '#5a4a42' },
  // Người Đúng Chỗ HR
  cv: { label: 'CV', icon: '📄', color: '#ffffff' },
  cv_ok: { label: 'CV đã lọc (shortlist)', icon: '✅', color: '#b8f0d8' },
  survey: { label: 'Phiếu khảo sát lương', icon: '📋', color: '#fff1b8' },
  survey_xls: { label: 'Bảng lương thô', icon: '📊', color: '#bfe3ff' },
  salary_report: { label: 'Báo cáo lương P50', icon: '📈', color: '#9be7c4' },
  interviewed: { label: 'Ứng viên đã phỏng vấn', icon: '🤝', color: '#ffd3b8' },
  offer_draft: { label: 'Offer nháp', icon: '✉️', color: '#e3d9ff' },
  offer_notes: { label: 'Offer "thêm chữ culture fit"', icon: '✏️', color: '#ffc2b3' },
  offer_signed: { label: 'Offer đã ký', icon: '💌', color: '#ff8fb1' },
  ghost: { label: 'Ứng viên đã ghost', icon: '👻', color: '#e4e4ea' },
  bad_hire: { label: 'Ứng viên "sai người sai chỗ"', icon: '🙅', color: '#ffc2b3' },
  // Trend Trễ Agency
  caption: { label: 'Caption', icon: '✍️', color: '#e3d9ff' },
  caption_fb: { label: 'Caption "trẻ hơn chút"', icon: '🖍️', color: '#ffc2b3' },
  kv: { label: 'Key Visual', icon: '🎨', color: '#ffc8dd' },
  kv_fb: { label: 'KV "logo to lên chút"', icon: '🔍', color: '#ffc2b3' },
  tiktok: { label: 'Video TikTok', icon: '🎬', color: '#bfe3ff' },
  tiktok_fb: { label: 'TikTok "trend này cũ rồi"', icon: '🐢', color: '#ffc2b3' },
  kol_post: { label: 'Bài đăng KOL', icon: '🌟', color: '#ffe08a' },
  deck_draft: { label: 'Deck chiến dịch nháp', icon: '📑', color: '#c9b6ff' },
  deck_pop: { label: 'Deck "chưa pop"', icon: '💥', color: '#ffc2b3' },
  campaign: { label: 'Deck chiến dịch đã duyệt', icon: '🏆', color: '#ffd25a' },
};

// What each station kind does with an item. A level may override these with its own `process` table.
//   work: a player stands there and works (burnout goes up) · auto: put the item in and it processes by itself
//   overdue: seconds a finished item may wait before it is ruined · notes: the boss may send it back once
export const DEFAULT_PROCESS = {
  work: {
    laptop: { data: { to: 'excel', time: 3.5 }, brief: { to: 'slide', time: 3 }, deck_notes: { to: 'deck', time: 2 } },
  },
  auto: {
    printer: { excel: { to: 'print', time: 5, overdue: 8 } },
    boss: { deck: { to: 'deck_signed', time: 3, notes: 'deck_notes' } },
  },
  combos: [[['slide', 'print'], 'deck']],
};
const proc = (state) => LEVELS[state.level].process || DEFAULT_PROCESS;
const workRule = (state, kind, type) => { const w = proc(state).work[kind]; return w ? w[type] || null : null; };
const autoRule = (state, kind, type) => { const a = proc(state).auto[kind]; return a ? a[type] || null : null; };
const isWork = (state, kind) => !!proc(state).work[kind];
const isAuto = (state, kind) => !!proc(state).auto[kind];
/** the auto rule that produced this finished item at this station (for the "left too long" timer) */
const madeHere = (state, kind, type) => { const a = proc(state).auto[kind]; return a ? Object.values(a).find((r) => r.to === type && r.overdue) || null : null; };

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
    nextSpawn: 0,
    firstOrders: [...paceFor(L, players.length).first],
    standup: { idx: 0, warn: false, ring: 0 },
    items: {},
    stations: {},
    orders: [],
    players: {},
  };
  for (const s of L.stations) state.stations[s.id] = { id: s.id, kind: s.kind, x: s.x, z: s.z, item: null, progress: 0, overdue: 0, busy: false, off: false };
  state.flashIdx = 0; state.flashWarn = false; state.cutIdx = 0; state.cutWarn = false;
  state.quizzes = {}; // player id -> an interview in progress (HR)
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
    case 'coffee': return def.drink || 'Uống cà phê ☕';
    case 'breaker': return Object.values(state.stations).some((x) => x.off) ? ((LEVELS[state.level].powerCut || {}).fixHint || 'Bật lại cầu dao ⚡') : null;
    case 'deliver': return held ? `Nộp ${ITEMS[held.type].label} cho khách` : null;
    default:
      if (held) {
        if (on) return combine(state, held.type, on.type) ? `Ghép thành ${ITEMS[combine(state, held.type, on.type)].label}` : null;
        if (accepts(state, s.kind, held.type)) return `Đặt ${ITEMS[held.type].label} vào ${def.label}`;
        return null;
      }
      if (s.off && on) return `${def.label} ${(LEVELS[state.level].powerCut || {}).offHint || 'mất điện! Ra cầu dao bật lại ⚡'}`;
      const wr = on && workRule(state, s.kind, on.type);
      if (wr && wr.quiz) return p.working === s.id ? 'Đang phỏng vấn… chọn Cho qua vòng hoặc Loại' : `Phỏng vấn ứng viên 🎤`;
      if (wr) return p.working === s.id ? 'Đang làm…' : `Làm ${ITEMS[on.type].label} → ${ITEMS[wr.to].label}`;
      if (on) return `Lấy ${ITEMS[on.type].label}`;
      return null;
  }
}

function combine(state, a, b) {
  for (const [[x, y], out] of proc(state).combos || []) if ((a === x && b === y) || (a === y && b === x)) return out;
  return null;
}
function accepts(state, kind, type) {
  if (kind === 'counter') return true;
  return !!(workRule(state, kind, type) || autoRule(state, kind, type));
}

const say = (to, text, cls = '') => ({ type: 'toast', to, text, cls });

/** The single action button. Returns events. */
export function act(state, id) {
  const p = state.players[id];
  if (!p || state.phase !== 'play') return [];
  if (frozen(p)) return [];
  if (state.quizzes && state.quizzes[id]) return []; // answering an interview: buttons only
  const { station: s, def, floor } = targetOf(state, p);
  const held = p.held ? state.items[p.held] : null;
  if (!s) {
    if (!held && floor) { delete floor.floor; p.held = floor.id; return [{ type: 'sfx', name: 'blip' }]; }
    return [];
  }
  const on = s.item ? state.items[s.item] : null;

  if (s.kind === 'coffee') return drinkCoffee(state, p);
  if (s.kind === 'breaker') {
    const off = Object.values(state.stations).filter((x) => x.off);
    if (!off.length) return [say(id, 'Điện vẫn đang có mà.')];
    off.forEach((x) => { x.off = false; });
    const L = LEVELS[state.level];
    return [{ type: 'sfx', name: 'good' }, { type: 'toast', text: `${(L.powerCut && L.powerCut.icon) || '⚡'} ${p.name} ${(L.powerCut && L.powerCut.fixVerb) || 'bật lại cầu dao'}. ${(L.powerCut && L.powerCut.backLine) || 'Có điện rồi!'}`, cls: 'good' }];
  }
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
      const out = combine(state, held.type, on.type);
      if (!out) return [say(id, `${def.label} đang có đồ rồi.`)];
      if (s.kind !== 'counter') return [say(id, 'Ghép đồ ở bàn ghép nhé.')];
      delete state.items[held.id]; p.held = null;
      on.type = out;
      return [{ type: 'sfx', name: 'good' }, say(id, `Ghép xong ${ITEMS[out].label}!`, 'good')];
    }
    if (!accepts(state, s.kind, held.type)) return [say(id, `${def.label} không nhận ${ITEMS[held.type].label}.`)];
    s.item = held.id; p.held = null; s.progress = 0; s.overdue = 0;
    return [{ type: 'sfx', name: 'blip' }];
  }
  if (!on) return [];
  if (isWork(state, s.kind) && workRule(state, s.kind, on.type) && s.off) return [say(id, `${def.label} ${(LEVELS[state.level].powerCut || {}).offHint || 'mất điện!'}`, 'bad')];
  if (isWork(state, s.kind) && workRule(state, s.kind, on.type)) {
    // take over a laptop someone else stopped working on, or start fresh
    for (const q of Object.values(state.players)) if (q.working === s.id && q.id !== p.id) return [say(id, `${q.name} đang làm máy này.`)];
    p.working = s.id; p.workAt = { x: p.x, z: p.z };
    const wr = workRule(state, s.kind, on.type);
    if (wr.quiz) return startQuiz(state, p, s, wr);
    return [{ type: 'sfx', name: 'choose' }];
  }
  // pick it up (stops processing; a half-done auto job keeps its progress only while it stays in the machine)
  s.item = null; s.progress = 0; s.overdue = 0; s.busy = false;
  p.held = on.id;
  return [{ type: 'sfx', name: 'blip' }];
}

// ---------- interviews (HR): a quick "pass or reject" on the candidate's answer ----------
function startQuiz(state, p, s, rule) {
  const bank = LEVELS[state.level].quiz || [];
  if (!bank.length) return [];
  state.quizSeen = state.quizSeen || [];
  let pool = bank.map((_, i) => i).filter((i) => !state.quizSeen.includes(i));
  if (!pool.length) { state.quizSeen = []; pool = bank.map((_, i) => i); }
  const q = pool[Math.floor(rand(state) * pool.length)];
  state.quizSeen.push(q);
  const total = rule.quizTime || 8;
  state.quizzes[p.id] = { station: s.id, q, t: total, total, to: rule.to };
  s.progress = 0;
  return [{ type: 'sfx', name: 'choose' }, { type: 'quiz', to: p.id, q }];
}

/** The interviewer's verdict: pass = true (cho qua vòng) / false (loại). */
export function answerQuiz(state, id, pass) {
  const p = state.players[id];
  const qz = state.quizzes && state.quizzes[id];
  if (!p || !qz || state.phase !== 'play') return [];
  const s = state.stations[qz.station];
  const it = s && s.item && state.items[s.item];
  const Q = LEVELS[state.level].quiz[qz.q];
  delete state.quizzes[id];
  p.working = null; p.workAt = null;
  if (!it) return [{ type: 'quiz-end', to: id }];
  s.progress = 0;
  const right = !!pass === !!Q.good;
  if (right && Q.good) {
    it.type = qz.to;
    return [{ type: 'quiz-end', to: id }, { type: 'sfx', name: 'good' }, say(id, `✅ Chuẩn! ${Q.why}`, 'good')];
  }
  if (right) {
    // rightly rejected: the CV goes back to being a plain CV (find another candidate)
    it.type = 'cv';
    return [{ type: 'quiz-end', to: id }, { type: 'sfx', name: 'good' }, say(id, `👍 Loại là đúng. ${Q.why} Lấy CV khác lọc lại nhé.`, 'good')];
  }
  it.type = pass ? 'bad_hire' : 'cv';
  return [{ type: 'quiz-end', to: id }, { type: 'sfx', name: 'bad' },
    say(id, pass ? `🙅 Nhận nhầm rồi! ${Q.why} Vứt đi làm lại.` : `😬 Loại oan ứng viên tốt! ${Q.why}`, 'bad')];
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
  // "feedback nhẹ": the client may send the work back once, to be fixed and delivered again
  if (R.revise && L.revise && !order.revised && rand(state) < L.revise.chance) {
    order.revised = true;
    held.type = R.revise;
    const lines = L.revise.lines;
    const line = lines[Math.floor(rand(state) * lines.length)];
    return [{ type: 'sfx', name: 'bad' }, { type: 'revise', order: order.id },
      { type: 'toast', text: `✏️ ${who}: "${line}" Mang ${ITEMS[R.revise].label} đi sửa (${R.fixAt || 'chỗ cũ'}) rồi nộp lại.`, cls: 'drama' }];
  }
  const base = Math.round(R.reward * (order.bonus || 1));
  const tip = Math.round(base * 0.5 * (order.t / order.total));
  state.money += base + tip;
  state.done++;
  state.orders = state.orders.filter((o) => o !== order);
  delete state.items[held.id]; p.held = null;
  // lobby empty: the next client walks in soon instead of after a full gap
  if (!state.orders.length && !state.firstOrders.length) state.nextSpawn = Math.min(state.nextSpawn, state.elapsed + 5);
  return [{ type: 'sfx', name: 'good' }, { type: 'served', order: order.id }, { type: 'toast', text: `✅ ${who} nhận ${R.title}: +${base}k${order.bonus ? ' 🔥' : ''}${tip ? ` (+${tip}k tip)` : ''}`, cls: 'good' }];
}

/** The client (from the level's cast) who placed this order. */
export function clientName(state, order) {
  const c = LEVELS[state.level].clients;
  return c && c[order.client] ? c[order.client].name : 'Khách';
}

function spawnOrder(state, flash = null) {
  const L = LEVELS[state.level];
  const pool = L.orderPool.filter((o) => state.elapsed >= (o.after || 0) && (!flash || !flash.recipes || flash.recipes.includes(o.recipe)));
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
  // fewer players → clients are more patient
  const time = Math.round(R.time * pace(state).time * (flash ? flash.patience || 1 : 1));
  const order = { id: state.nextOrder++, recipe: pick.recipe, t: time, total: time, client, spot };
  if (flash) order.bonus = flash.bonus || 1.5;
  state.orders.push(order);
  return [{ type: 'order', recipe: pick.recipe }, { type: 'sfx', name: 'ring' }];
}

// Order pacing by team size: the level's `pace` has one row per player count (1–4).
//   gap: seconds between new clients · time: × each recipe's patience · max: clients waiting at once · first: opening orders
const PACE_DEFAULT = [
  { gap: 34, time: 1.4, max: 2, first: [2, 16] },
  { gap: 24, time: 1.15, max: 3, first: [2, 10] },
  { gap: 18, time: 1, max: 4, first: [2, 8] },
  { gap: 14, time: 0.9, max: 4, first: [2, 6] },
];
function paceFor(L, n) {
  const rows = L.pace || PACE_DEFAULT;
  return rows[Math.max(1, Math.min(rows.length, n)) - 1];
}
export function pace(state) { return paceFor(LEVELS[state.level], Object.keys(state.players).length); }
function maxOrders(state) {
  const spots = (LEVELS[state.level].clientSpots || []).length || 4;
  return Math.min(spots, pace(state).max);
}
function spawnGap(state) { return pace(state).gap; }

/** Advance the game by dt seconds. Returns events. */
export function step(state, dt) {
  if (state.phase !== 'play') return [];
  const L = LEVELS[state.level];
  const ev = [];
  state.time = Math.max(0, state.time - dt);
  state.elapsed += dt;
  state.dtLast = dt;

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

  ev.push(...levelEvents(state));

  for (const [pid, qz] of Object.entries(state.quizzes || {})) {
    const p = state.players[pid];
    if (!p || p.working !== qz.station) {
      delete state.quizzes[pid];
      const s = state.stations[qz.station]; if (s) s.progress = 0;
      ev.push({ type: 'quiz-end', to: pid });
    }
  }

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
      const rule = it && !s.off && workRule(state, s.kind, it.type);
      const qz = state.quizzes[p.id];
      if (!rule) { p.working = null; p.workAt = null; }
      else if (rule.quiz) {
        // an interview: the answer comes from the player (answerQuiz); here only the clock runs
        if (!qz || qz.station !== s.id) { p.working = null; p.workAt = null; }
        else {
          qz.t = Math.max(0, qz.t - dt);
          s.progress = 1 - qz.t / qz.total;
          p.burnout += TUNING.burn.work * 0.6 * dt;
          if (qz.t <= 0) {
            it.type = 'ghost'; s.progress = 0; p.working = null; p.workAt = null; delete state.quizzes[p.id];
            ev.push({ type: 'quiz-end', to: p.id }, say(p.id, '👻 Ứng viên ngồi chờ bạn nghĩ lâu quá… ghost luôn rồi.', 'bad'), { type: 'sfx', name: 'bad' });
          }
        }
      }
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
    if (!isAuto(state, s.kind) || !s.item || s.off) continue;
    const it = state.items[s.item];
    const rule = it && autoRule(state, s.kind, it.type);
    const made = it && !rule && madeHere(state, s.kind, it.type);
    if (rule) {
      s.busy = true;
      s.progress += dt / rule.time;
      if (s.progress >= 1) {
        s.progress = 0; s.busy = false;
        if (rule.notes && !it.noted && rand(state) < L.notesChance) {
          it.type = rule.notes; it.noted = true;
          ev.push({ type: 'toast', text: `🖍️ ${L.bossName}: "${L.bossLine}" ${ITEMS[rule.notes].label}: mang về ${rule.fixAt || 'Laptop'} sửa.`, cls: 'drama' }, { type: 'sfx', name: 'bad' });
        } else {
          it.type = rule.to;
          ev.push({ type: 'sfx', name: 'ding' });
          if (s.kind === 'boss') ev.push({ type: 'toast', text: `✍️ ${L.bossName} đã ký ${ITEMS[rule.to].label}!`, cls: 'good' });
        }
      }
    } else if (made) {
      s.busy = false;
      s.overdue += dt;
      if (s.overdue >= made.overdue) {
        it.type = made.ruin || 'ruined'; s.overdue = 0;
        ev.push({ type: 'toast', text: made.ruinText || '🔥 Máy in kẹt giấy, in nhầm 200 bản. File thành "v3_FINAL_sửa_lần_cuối". Vứt đi làm lại!', cls: 'bad' }, { type: 'sfx', name: 'bad' });
      }
    } else { s.busy = false; }
  }

  if (state.time <= 0) {
    state.phase = 'over';
    ev.push({ type: 'over' });
  }
  return ev;
}

// Scheduled level events (each optional):
//   flash    — a livestream flash sale: several clients rush in at once, paying more but less patient
//   powerCut — someone switches the power off: listed stations stop until a player flips the breaker
function levelEvents(state) {
  const L = LEVELS[state.level];
  const ev = [];
  const F = L.flash;
  if (F && state.flashIdx < F.at.length) {
    const at = F.at[state.flashIdx];
    if (!state.flashWarn && state.elapsed >= at - (F.warn || 4)) {
      state.flashWarn = true;
      ev.push({ type: 'toast', text: `🔴 ${F.warnText}`, cls: 'drama' }, { type: 'sfx', name: 'ring' });
    }
    if (state.elapsed >= at) {
      state.flashIdx++; state.flashWarn = false;
      const spots = (L.clientSpots || []).length || 4;
      let n = 0;
      for (let i = 0; i < (F.count || 2) && state.orders.length < spots; i++) { ev.push(...spawnOrder(state, F)); n++; }
      ev.push({ type: 'toast', text: n ? `🔥 ${F.text} (+${n} đơn, tiền ×${F.bonus || 1.5})` : `🔥 ${F.text} Nhưng sảnh hết chỗ, khách đứng ngoài!`, cls: 'drama' });
    }
  }
  // decay: some items "ghost" when they lie around (on a counter or the floor) for too long
  const D = L.decay;
  if (D) {
    const busy = new Set();
    for (const p of Object.values(state.players)) if (p.held) busy.add(p.held);
    for (const s of Object.values(state.stations)) if (s.item && s.kind !== 'counter') busy.add(s.item);
    for (const it of Object.values(state.items)) {
      if (!D.types.includes(it.type)) continue;
      if (busy.has(it.id)) { it.idle = 0; continue; }
      it.idle = (it.idle || 0) + state.dtLast;
      if (it.idle >= D.after) {
        const was = ITEMS[it.type].label;
        it.type = D.to; it.idle = 0;
        ev.push({ type: 'toast', text: `👻 ${was} để lâu quá… ${D.text}`, cls: 'bad' }, { type: 'sfx', name: 'bad' });
      }
    }
  }
  const P = L.powerCut;
  if (P && state.cutIdx < P.at.length) {
    const at = P.at[state.cutIdx];
    if (!state.cutWarn && state.elapsed >= at - (P.warn || 3)) {
      state.cutWarn = true;
      ev.push({ type: 'toast', text: `👀 ${P.warnText}`, cls: 'drama' });
    }
    if (state.elapsed >= at) {
      state.cutIdx++; state.cutWarn = false;
      for (const id of P.stations) if (state.stations[id]) state.stations[id].off = true;
      ev.push({ type: 'toast', text: `${P.icon || '⚡'} ${P.text}`, cls: 'bad' }, { type: 'sfx', name: 'bad' }, { type: 'power', on: false });
    }
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
