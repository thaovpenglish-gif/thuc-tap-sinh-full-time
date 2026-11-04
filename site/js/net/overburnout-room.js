// Short-lived public Supabase Realtime transport. NOT private or durable.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function randomRoomCode() {
  const b = new Uint8Array(7);
  crypto.getRandomValues(b);
  return Array.from(b, n => CHARS[n % CHARS.length]).join('');
}
export function normalizeRoomCode(code) {
  return String(code || '').toUpperCase().replace(/[^A-Z2-9]/g, '').slice(0, 7);
}

export async function openPreviewRoom({ code, id, name, isHost, onPeers, onSnapshot, onAction, onError }) {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false }, realtime: { params: { eventsPerSecond: 20 } } });
  const channel = client.channel('obd-preview:' + code, { config: { presence: { key: id }, broadcast: { self: false } } });
  let peers = {}, closed = false;
  function sync() {
    const all = {};
    for (const [key, entries] of Object.entries(channel.presenceState())) {
      if (entries?.[0]) all[key] = { id: key, name: entries[0].name, isHost: !!entries[0].isHost };
    }
    peers = all;
    onPeers?.(all);
  }
  channel
    .on('presence', { event: 'sync' }, sync)
    .on('broadcast', { event: 'snapshot' }, ({ payload }) => { if (!isHost && payload?.state) onSnapshot?.(payload.state); })
    .on('broadcast', { event: 'action' }, ({ payload }) => {
      if (isHost && payload?.action && peers[payload.playerId]) onAction?.(payload.action, payload.playerId);
    });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Realtime timeout')), 12000);
      channel.subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          try { await channel.track({ name: String(name).slice(0,18), isHost }); clearTimeout(timer); resolve(); }
          catch (e) { clearTimeout(timer); reject(e); }
        }
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timer); reject(new Error('Realtime: ' + status));
        }
      });
    });
  } catch (e) {
    closed = true; await client.removeChannel(channel); throw e;
  }
  sync();
  return {
    id, code, isHost,
    get peers() { return peers; },
    async sendAction(action) {
      if (closed) return;
      const { error } = await channel.send({ type: 'broadcast', event: 'action', payload: { playerId: id, action: { ...action, playerId: id } } });
      if (error) onError?.(error);
    },
    async sendSnapshot(state) {
      if (closed || !isHost) return;
      const { error } = await channel.send({ type: 'broadcast', event: 'snapshot', payload: { state } });
      if (error) onError?.(error);
    },
    async close() { closed = true; await client.removeChannel(channel); },
  };
}