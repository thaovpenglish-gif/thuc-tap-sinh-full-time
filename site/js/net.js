// Supabase: realtime presence (other interns walking around), confession wall, global choice stats.
// Everything degrades gracefully: if Supabase is unreachable the game is fully playable offline.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

let sb = null;
try {
  sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false }, realtime: { params: { eventsPerSecond: 12 } } });
} catch (e) { console.warn('Supabase unavailable', e); }

const BAD = ['địt', 'đụ', 'lồn', 'cặc', 'buồi', 'đéo', 'đĩ', 'vcl', 'vkl', 'đmm', 'dmm', 'clm', 'fuck', 'shit'];
export function clean(s) {
  let out = String(s);
  for (const w of BAD) out = out.replace(new RegExp(w, 'gi'), (m) => '*'.repeat(m.length));
  return out;
}

const myId = (() => {
  try {
    let id = localStorage.getItem('tts_pid');
    if (!id) { id = Math.random().toString(36).slice(2, 10); localStorage.setItem('tts_pid', id); }
    return id;
  } catch { return Math.random().toString(36).slice(2, 10); }
})();

let office = null;
let joined = false;
let myName = 'TTS';
const handlers = { peers: () => {}, pos: () => {}, leave: () => {} };

export const net = {
  get ok() { return !!sb; },
  myId,

  async vote(choiceId, idx) {
    if (!sb) return null;
    try {
      const { data, error } = await sb.rpc('cast_vote', { p_choice: choiceId, p_option: idx });
      if (error) throw error;
      return data; // [{option_idx, n}]
    } catch (e) { console.warn('vote failed', e); return null; }
  },

  async stats(choiceId) {
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('choice_counts').select('option_idx,n').eq('choice_id', choiceId);
      if (error) throw error;
      return data;
    } catch { return null; }
  },

  async loadConfessions(limit = 60) {
    if (!sb) return [];
    try {
      const { data, error } = await sb.from('confessions').select('id,nickname,body,created_at').order('created_at', { ascending: false }).limit(limit);
      if (error) throw error;
      return data || [];
    } catch (e) { console.warn(e); return []; }
  },

  async postConfession(nickname, body) {
    if (!sb) throw new Error('offline');
    const { error } = await sb.from('confessions').insert({ nickname: clean(nickname).slice(0, 24), body: clean(body).slice(0, 280) });
    if (error) throw error;
  },

  onConfession(cb) {
    if (!sb) return;
    sb.channel('confessions-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'confessions' }, (p) => cb(p.new))
      .subscribe();
  },

  joinOffice(name, { onPeers, onPos, onLeave }) {
    if (!sb || office) return;
    handlers.peers = onPeers; handlers.pos = onPos; handlers.leave = onLeave;
    office = sb.channel('office-v1', { config: { presence: { key: myId }, broadcast: { self: false } } });
    office
      .on('presence', { event: 'sync' }, () => {
        const st = office.presenceState();
        const peers = {};
        for (const [id, metas] of Object.entries(st)) if (metas && metas[0]) peers[id] = metas[0];
        handlers.peers(peers);
      })
      .on('presence', { event: 'leave' }, ({ key }) => handlers.leave(key))
      .on('broadcast', { event: 'pos' }, ({ payload }) => { if (payload && payload.id !== myId) handlers.pos(payload); })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') { joined = true; if (name) myName = clean(name).slice(0, 16); await office.track({ name: myName, at: Date.now() }); }
      });
  },

  sendPos(x, z, ry, name) {
    if (!office) return;
    office.send({ type: 'broadcast', event: 'pos', payload: { id: myId, x: +x.toFixed(2), z: +z.toFixed(2), r: +ry.toFixed(2), n: name } });
  },

  async setName(name) {
    myName = clean(name).slice(0, 16);
    if (office && joined) { try { await office.track({ name: myName, at: Date.now() }); } catch {} }
  },
};
