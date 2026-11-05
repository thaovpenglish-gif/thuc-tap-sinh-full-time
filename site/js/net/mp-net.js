// Rooms for Overdeadline & Overburnout.
// One room = one channel. Presence tells who is in the room; broadcast carries positions, actions and host snapshots.
// Transports:
//   'supabase' (default)      — Supabase Realtime, works across devices
//   'local'   (?net=local)    — BroadcastChannel between tabs of the same browser (testing, no network)
//   'none'                    — practice alone, nothing leaves the page
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

// per tab, so two tabs on one computer are two different players
export const myId = Math.random().toString(36).slice(2, 10);

const BAD = ['địt', 'đụ', 'lồn', 'cặc', 'buồi', 'đéo', 'đĩ', 'vcl', 'vkl', 'đmm', 'dmm', 'clm', 'fuck', 'shit'];
export function cleanName(s) {
  let out = String(s || '').replace(/[<>]/g, '').trim().slice(0, 14);
  for (const w of BAD) out = out.replace(new RegExp(w, 'gi'), (m) => '*'.repeat(m.length));
  return out || 'SOS';
}

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I/L
export function newRoomCode() {
  let s = '';
  for (let i = 0; i < 5; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}
export const normCode = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);

let sbPromise = null;
function supabase() {
  if (!sbPromise) {
    sbPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm')
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 20 } },
      }));
  }
  return sbPromise;
}

/**
 * Join a room. meta = { name, color, host }.
 * Returns { id, kind, members(), send(event, payload), on(event, cb), onMembers(cb), update(meta), leave() }.
 * Resolves once connected; rejects on failure.
 */
export async function joinRoom(kind, code, meta) {
  const handlers = {};
  let memberCb = () => {};
  let members = { [myId]: { ...meta, id: myId } };
  const emit = (event, payload) => { (handlers[event] || []).forEach((cb) => cb(payload)); };
  const api = {
    id: myId, kind, code,
    members: () => members,
    on(event, cb) { (handlers[event] ||= []).push(cb); },
    onMembers(cb) { memberCb = cb; cb(members); },
    send() {}, update() {}, leave() {},
  };

  if (kind === 'none') return api;

  if (kind === 'local') {
    const bc = new BroadcastChannel('sos-mp-' + code);
    const seen = {}; // id -> last heartbeat
    let me = { ...meta, id: myId };
    const announce = () => bc.postMessage({ t: 'hello', from: myId, meta: me });
    const refresh = () => {
      const now = Date.now();
      const next = { [myId]: me };
      for (const [id, s] of Object.entries(seen)) if (now - s.at < 3500) next[id] = s.meta;
      const changed = Object.keys(next).sort().join() !== Object.keys(members).sort().join() ||
        Object.values(next).some((m) => JSON.stringify(m) !== JSON.stringify(members[m.id]));
      members = next;
      if (changed) memberCb(members);
    };
    bc.onmessage = (e) => {
      const m = e.data;
      if (!m || m.from === myId) return;
      if (m.t === 'hello') { const isNew = !seen[m.from]; seen[m.from] = { at: Date.now(), meta: m.meta }; if (isNew) announce(); refresh(); return; }
      if (m.t === 'bye') { delete seen[m.from]; refresh(); return; }
      if (m.t === 'ev') emit(m.event, m.payload);
    };
    const hb = setInterval(() => { announce(); refresh(); }, 1000);
    announce();
    api.send = (event, payload) => bc.postMessage({ t: 'ev', from: myId, event, payload });
    api.update = (m) => { me = { ...me, ...m }; announce(); refresh(); };
    api.leave = () => { clearInterval(hb); try { bc.postMessage({ t: 'bye', from: myId }); bc.close(); } catch { /* closed */ } };
    return api;
  }

  // Supabase Realtime
  const sb = await supabase();
  const ch = sb.channel('sos-mp-v1-' + code, { config: { presence: { key: myId }, broadcast: { self: false, ack: false } } });
  let me = { ...meta, id: myId };
  ch.on('presence', { event: 'sync' }, () => {
    const st = ch.presenceState();
    const next = {};
    for (const [id, metas] of Object.entries(st)) if (metas && metas[0]) next[id] = { ...metas[0], id };
    next[myId] = me;
    members = next;
    memberCb(members);
  });
  ch.on('broadcast', { event: 'ev' }, ({ payload }) => { if (payload && payload.from !== myId) emit(payload.event, payload.payload); });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), 9000);
    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') { clearTimeout(timer); await ch.track(me); resolve(); }
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') { clearTimeout(timer); reject(new Error(status)); }
    });
  });
  api.send = (event, payload) => { ch.send({ type: 'broadcast', event: 'ev', payload: { from: myId, event, payload } }); };
  api.update = (m) => { me = { ...me, ...m }; ch.track(me); };
  api.leave = () => { try { ch.untrack(); sb.removeChannel(ch); } catch { /* closed */ } };
  return api;
}
