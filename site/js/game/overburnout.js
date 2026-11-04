// Over-burnout and deadline: isolated, content-neutral co-op vertical slice.
// Uses Phase 0's authoritative item reducer. No DOM, Three.js, or Supabase.
import { createState, reduce as reduceItems } from './sim.js';

export const OBD_STATIONS = Object.freeze([
  { id: 'research', label: 'Research', x: -5.2, z: -2.2, color: '#bfe3ff' },
  { id: 'analysis', label: 'Analysis', x: -1.7, z: -2.2, color: '#d9c8ff' },
  { id: 'slides', label: 'Slides', x: 1.8, z: -2.2, color: '#ffcedb' },
  { id: 'delivery', label: 'Delivery', x: 5.3, z: -2.2, color: '#c4f3db' },
  { id: 'buffer', label: 'Bàn trung chuyển', x: 0, z: 1.5, color: '#fff0b0' },
]);

export const OBD_TASKS = Object.freeze({
  'brief-a': {
    title: 'Deliverable A',
    research: { question: 'Chọn dữ liệu có nguồn kiểm chứng được.', choices: ['Tin đồn nội bộ', 'Khảo sát có phương pháp', 'Một câu nói của sếp'], correct: 1 },
    analysis: { question: 'Một insight có ích cần dựa trên điều gì?', choices: ['Bằng chứng liên quan', 'Cảm giác cá nhân', 'Font chữ thật đẹp'], correct: 0 },
    slides: { question: 'Thứ tự lập luận trên slide?', choices: ['Kết luận → không có số liệu', 'Hình minh họa → khẩu hiệu', 'Phát hiện → bằng chứng → đề xuất'], correct: 2 },
  },
  'brief-b': {
    title: 'Deliverable B',
    research: { question: 'Khi nghiên cứu ngân sách, lấy tài liệu nào?', choices: ['Bảng chi phí dự án đã duyệt', 'Báo giá từ dự án khác', 'Tin nhắn không rõ nguồn'], correct: 0 },
    analysis: { question: 'Phương án ngân sách hợp lý?', choices: ['Vượt ngân sách 50%', 'Tổng chi phí không vượt trần đã duyệt', 'Không cần tính tổng'], correct: 1 },
    slides: { question: 'Một slide kế hoạch cần gì?', choices: ['Chỉ cần tên chiến dịch', 'Chỉ cần ảnh meme', 'Hoạt động, thời gian, chi phí'], correct: 2 },
  },
});

const STAGE = ['research', 'analysis', 'slides'];
const DURATIONS = { research: 1800, analysis: 2300, slides: 2600 };
const VALID_MOVEMENT_BOUNDS = { minX: -8.5, maxX: 8.5, minZ: -5.5, maxZ: 5.5 };
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const failed = (state, reason) => ({ state, ok: false, reason, events: [] });
const success = (state, event) => ({ state, ok: true, reason: null, events: event ? [event] : [] });

export function createOverburnout({ durationMs = 300000 } = {}) {
  return {
    status: 'lobby', practice: false, durationMs,
    startedAt: null, endsAt: null, score: null,
    items: createState({
      counters: OBD_STATIONS.map(({ id, x, z }) => ({ id, x, z })),
      items: [
        { id: 'brief-a', type: 'brief', at: { kind: 'floor', x: -1, z: 3.9 } },
        { id: 'brief-b', type: 'brief', at: { kind: 'floor', x: 1, z: 3.9 } },
      ],
    }),
    orders: {
      'brief-a': { stage: 0, delivered: false, returnedOnce: false },
      'brief-b': { stage: 0, delivered: false, returnedOnce: false },
    },
    busy: {}, names: {}, lastMoveAt: {},
    errors: 0, reworks: 0,
  };
}

export function remainingMs(state, now) {
  return state.endsAt === null ? state.durationMs : Math.max(0, state.endsAt - now);
}

export function workPrompt(state, playerId) {
  const player = state.items.players[playerId];
  if (!player || !player.online || state.status !== 'playing') return null;
  for (const stationId of STAGE) {
    const counter = state.items.counters[stationId];
    const orderId = counter.itemId;
    if (!orderId || dist(player, counter) > state.items.rules.reach) continue;
    const order = state.orders[orderId];
    if (!order || order.delivered || STAGE[order.stage] !== stationId || state.busy[stationId]) continue;
    return { stationId, orderId, ...OBD_TASKS[orderId][stationId] };
  }
  return null;
}

function validatedItemAction(state, action, now) {
  const player = state.items.players[action.playerId];
  if (action.type === 'join') {
    if (!action.playerId || typeof action.playerId !== 'string' || action.playerId.length > 80) return failed(state, 'invalid-player');
    const online = Object.values(state.items.players).filter(p => p.online);
    if (!state.items.players[action.playerId] && online.length >= 4) return failed(state, 'room-full');
    if (state.status === 'won' || state.status === 'lost') return failed(state, 'session-ended');
  } else if (!player || !player.online) {
    return failed(state, 'not-connected');
  }
  if (action.type === 'move') {
    if (!Number.isFinite(action.x) || !Number.isFinite(action.z) || action.x < VALID_MOVEMENT_BOUNDS.minX || action.x > VALID_MOVEMENT_BOUNDS.maxX || action.z < VALID_MOVEMENT_BOUNDS.minZ || action.z > VALID_MOVEMENT_BOUNDS.maxZ) return failed(state, 'out-of-bounds');
    const delta = dist(player, action);
    const elapsed = Math.max(0, Math.min(500, now - (state.lastMoveAt[action.playerId] ?? now)));
    if (delta > Math.max(0.35, elapsed * 0.0075 + 0.12)) return failed(state, 'movement-too-fast');
  }
  if (action.type === 'pickup') {
    const item = state.items.items[action.itemId];
    if (item?.loc.kind === 'counter' && state.busy[item.loc.id]) return failed(state, 'station-busy');
  }
  if (action.type === 'drop' && action.counterId && STAGE.includes(action.counterId)) {
    const order = state.orders[action.itemId];
    if (!order || STAGE[order.stage] !== action.counterId) return failed(state, 'wrong-station');
  }
  if (action.type === 'drop' && action.counterId === 'delivery') {
    const order = state.orders[action.itemId];
    if (!order || order.stage !== 3) return failed(state, 'not-ready');
  }
  const r = reduceItems(state.items, action);
  if (!r.ok) return failed(state, r.reason);
  const next = { ...state, items: r.state };
  if (action.type === 'join') next.names = { ...state.names, [action.playerId]: String(action.name || 'Intern').slice(0, 18) };
  if (action.type === 'move') next.lastMoveAt = { ...state.lastMoveAt, [action.playerId]: now };
  return { state: next, ok: true, reason: null, events: r.events };
}

export function updateOverburnout(state, action, now = Date.now()) {
  if (!action || typeof action.type !== 'string' || !Number.isFinite(now)) return failed(state, 'invalid-action');
  if (action.type === 'join' || action.type === 'leave' || action.type === 'move') return validatedItemAction(state, action, now);
  if (state.status !== 'playing' && action.type !== 'start') return failed(state, 'not-playing');
  if (action.type === 'start') {
    if (state.status !== 'lobby') return failed(state, 'already-started');
    const online = Object.values(state.items.players).filter(p => p.online);
    if (online.length < (action.practice ? 1 : 2)) return failed(state, 'need-teammates');
    return success({ ...state, status: 'playing', practice: !!action.practice, startedAt: now, endsAt: now + state.durationMs }, { type: 'started' });
  }
  if (action.type === 'tick') {
    const next = structuredClone(state);
    for (const [stationId, work] of Object.entries(next.busy)) {
      if (work.until > now) continue;
      if (next.orders[work.orderId] && next.items.counters[stationId].itemId === work.orderId) {
        next.orders[work.orderId].stage += 1;
        next.items.items[work.orderId].type = next.orders[work.orderId].stage === 3 ? 'deck' : STAGE[next.orders[work.orderId].stage];
      }
      delete next.busy[stationId];
    }
    if (now >= next.endsAt && next.status === 'playing') next.status = 'lost';
    return success(next, { type: next.status === 'lost' ? 'deadline-missed' : 'tick' });
  }
  if (state.endsAt <= now) return failed(state, 'deadline-missed');
  if (['pickup', 'drop', 'handoff'].includes(action.type)) return validatedItemAction(state, action, now);
  if (action.type === 'work') {
    const prompt = workPrompt(state, action.playerId);
    if (!prompt || prompt.orderId !== action.orderId || prompt.stationId !== action.stationId) return failed(state, 'work-not-ready');
    if (!Number.isInteger(action.answer) || action.answer !== prompt.correct) return success({ ...state, errors: state.errors + 1 }, { type: 'wrong-answer', orderId: action.orderId });
    const next = { ...state, busy: { ...state.busy, [action.stationId]: { orderId: action.orderId, until: now + DURATIONS[action.stationId] } } };
    return success(next, { type: 'processing', orderId: action.orderId, stationId: action.stationId });
  }
  if (action.type === 'deliver') {
    const player = state.items.players[action.playerId];
    const counter = state.items.counters.delivery;
    if (!player?.online || dist(player, counter) > state.items.rules.reach) return failed(state, 'too-far');
    const orderId = counter.itemId;
    const order = state.orders[orderId];
    if (!order || order.stage !== 3) return failed(state, 'not-ready');
    const next = structuredClone(state);
    if (orderId === 'brief-a' && !order.returnedOnce) {
      next.orders[orderId].returnedOnce = true;
      next.orders[orderId].stage = 2;
      next.items.items[orderId].type = 'rework';
      next.reworks += 1;
      return success(next, { type: 'review-returned', orderId });
    }
    next.orders[orderId].delivered = true;
    delete next.items.items[orderId];
    next.items.counters.delivery.itemId = null;
    if (Object.values(next.orders).every(o => o.delivered)) {
      next.status = 'won';
      const rem = remainingMs(next, now);
      next.score = { stars: rem >= 120000 && next.errors === 0 ? 3 : rem >= 30000 ? 2 : 1, remainingMs: rem, reworks: next.reworks, errors: next.errors };
    }
    return success(next, { type: 'delivered', orderId });
  }
  return failed(state, 'unknown-action');
}