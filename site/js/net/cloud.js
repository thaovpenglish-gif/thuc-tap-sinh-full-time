// Cloud saves for Solo (Supabase RPCs, see supabase/cloud_saves.sql). No email is ever sent:
// an account = email (as a username) + a game password. A save code = an 8-character snapshot valid 30 days.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

const TOKEN_KEY = 'tts_cloud_token';
const EMAIL_KEY = 'tts_cloud_email';
const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* private mode */ } };

async function rpc(fn, args) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`cloud ${fn}: HTTP ${res.status}`);
  return res.json();
}

export const cloud = {
  get linked() { return !!get(TOKEN_KEY); },
  get email() { return get(EMAIL_KEY) || ''; },
  async login(email, pass) {
    const r = await rpc('cloud_login', { p_email: email, p_pass: pass });
    if (r.ok) { set(TOKEN_KEY, r.token); set(EMAIL_KEY, String(email).trim().toLowerCase()); }
    return r; // { ok, created, data, updated_at } | { ok:false, error: 'email'|'pass'|'wrong'|'locked' }
  },
  async push(profile) {
    const t = get(TOKEN_KEY); if (!t) return { ok: false, error: 'token' };
    const r = await rpc('cloud_push', { p_token: t, p_data: profile });
    if (!r.ok && r.error === 'token') this.forget();
    return r;
  },
  async pull() {
    const t = get(TOKEN_KEY); if (!t) return { ok: false, error: 'token' };
    const r = await rpc('cloud_pull', { p_token: t });
    if (!r.ok && r.error === 'token') this.forget();
    return r;
  },
  async logout() { const t = get(TOKEN_KEY); this.forget(); if (t) { try { await rpc('cloud_logout', { p_token: t }); } catch { /* offline */ } } },
  forget() { set(TOKEN_KEY, null); set(EMAIL_KEY, null); },
  createCode: (profile) => rpc('save_code_create', { p_data: profile }),
  claimCode: (code) => rpc('save_code_claim', { p_code: code }),
};
