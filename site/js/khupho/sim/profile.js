// Khu phố T&M · hồ sơ cá nhân (DESIGN.md 5). Stored at kp.profile; never deleted, even when the street restarts.
// Rule zero: days worked only ever go up, including when two devices' saves are merged.
import { dateOf } from './calendar.js';

export const KP_PROFILE_VERSION = 1;
export const GRADES = ['A', 'B', 'C', 'D'];
export const REASONS = {
  chuyencho: 'Chuyển chỗ làm', hocthem: 'Nghỉ để học thêm', nghingoi: 'Nghỉ ngơi một thời gian', moquan: 'Nghỉ để mở quán riêng',
  bichonghi: 'Bị cho nghỉ', hetthuctap: 'Hết thực tập', quandong: 'Quán đóng cửa', chuyentro: 'Chuyển trọ',
};
export const KIND_LABEL = { shop: 'Quán', company: 'Công ty (Solo)', civic: 'Việc công', owner: 'Tự làm chủ' };
const MAX_COMMENTS = 3, MAX_HIGHLIGHTS = 8, MAX_ENTRIES = 600;

const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const num = (x, d = 0) => (typeof x === 'number' && Number.isFinite(x) ? x : d);
const str = (x, d = '') => (typeof x === 'string' ? x : d);
const dateLabel = (day) => (num(day, 0) >= 1 ? dateOf(day).label.split(' ').pop() : '');

export function emptyKpProfile() {
  return {
    v: KP_PROFILE_VERSION, name: '', look: {}, home: { place: 'phongtro', room: 5, history: [] },
    tamTru: null, bhyt: null, certs: [], skills: {}, reputation: 50,
    totals: { days: 0, shifts: 0, hours: 0, earned: 0, places: 0 },
    entries: [], rev: 0, updatedAt: 0,
  };
}

function newEntry(profile, { placeId, placeName, kind, role, rank, day, now }) {
  const same = profile.entries.filter((e) => e.placeId === placeId).length;
  let n = same + 1, entryId;
  do { entryId = `kp-${placeId}-${String(n).padStart(2, '0')}`; n++; } while (profile.entries.some((e) => e.entryId === entryId));
  const e = {
    entryId, placeId, placeName: placeName || placeId, kind: kind || 'shop', role: role || '', rank: num(rank, 1), rankHighest: num(rank, 1),
    daysWorked: 0, shifts: 0, hours: 0, earned: 0, lastDay: 0,
    startDay: num(day, 0), startDate: dateLabel(day), startReal: now ?? null, endDay: null, endDate: null, endReal: null,
    ratings: { A: 0, B: 0, C: 0, D: 0 }, comments: [], reasonLeft: null, contacts: [], highlights: [], reference: null,
    rev: 0, updatedAt: now ?? 0,
  };
  profile.entries.push(e);
  if (profile.entries.length > MAX_ENTRIES) profile.entries.splice(0, profile.entries.length - MAX_ENTRIES);
  return e;
}

/** The open (not ended) entry for a place, or null. */
export const openEntry = (profile, placeId) => profile.entries.find((e) => e.placeId === placeId && !e.endDay && !e.soloRunId) || null;
/** The most recent entry for a place (open or closed), or null. */
export function lastEntry(profile, placeId) {
  const list = profile.entries.filter((e) => e.placeId === placeId);
  return list.length ? list.reduce((a, b) => ((b.startDay || 0) >= (a.startDay || 0) ? b : a)) : null;
}

function touch(profile, e, now) {
  e.rev = (e.rev || 0) + 1;
  if (now != null) e.updatedAt = now;
  profile.rev = (profile.rev || 0) + 1;
  if (now != null) profile.updatedAt = now;
  recomputeTotals(profile);
}

/** Log one finished shift: creates or extends the open entry for placeId. → the entry.
 *  extra optional fields: comment (owner's line), contacts [{ id, name, rel, hearts }], highlight, now (real ms). */
export function logShift(profile, { placeId, placeName, kind, role, rank, day, hours = 0, grade, pay = 0, comment, contacts, highlight, now } = {}) {
  if (!placeId) throw new Error('logShift: placeId required');
  let e = openEntry(profile, placeId);
  if (!e) e = newEntry(profile, { placeId, placeName, kind, role, rank, day, now });
  if (num(day, 0) && day !== e.lastDay && day > (e.lastDay || 0)) { e.daysWorked += 1; e.lastDay = day; }
  e.shifts += 1;
  e.hours = Math.round((e.hours + num(hours)) * 100) / 100;
  e.earned += Math.round(num(pay));
  if (GRADES.includes(grade)) e.ratings[grade] += 1;
  if (role) e.role = role;
  if (placeName) e.placeName = placeName;
  if (rank != null) { e.rank = num(rank, e.rank); e.rankHighest = Math.max(e.rankHighest, e.rank); }
  if (comment) { e.comments.push(String(comment)); e.comments = e.comments.slice(-MAX_COMMENTS); }
  if (highlight && !e.highlights.includes(highlight)) { e.highlights.push(String(highlight)); e.highlights = e.highlights.slice(-MAX_HIGHLIGHTS); }
  if (Array.isArray(contacts)) e.contacts = mergeContacts(e.contacts, contacts);
  touch(profile, e, now);
  return e;
}

/** Close the open entry at placeId. → the entry, or null if none was open. */
export function endEntry(profile, placeId, { day, reasonCode = 'chuyencho', reasonText, reference, contacts, now } = {}) {
  const e = openEntry(profile, placeId);
  if (!e) return null;
  e.endDay = num(day, e.lastDay || e.startDay || 1);
  e.endDate = dateLabel(e.endDay);
  e.endReal = now ?? null;
  e.reasonLeft = { code: reasonCode, text: reasonText || REASONS[reasonCode] || reasonCode };
  if (reference) e.reference = reference;
  if (Array.isArray(contacts)) e.contacts = mergeContacts(e.contacts, contacts);
  touch(profile, e, now);
  return e;
}

export function recomputeTotals(profile) {
  const t = { days: 0, shifts: 0, hours: 0, earned: 0, places: 0 };
  const places = new Set();
  for (const e of profile.entries) {
    t.days += num(e.daysWorked); t.shifts += num(e.shifts); t.hours += num(e.hours); t.earned += num(e.earned);
    places.add(e.placeId);
  }
  t.hours = Math.round(t.hours * 100) / 100;
  t.places = places.size;
  profile.totals = t;
  return t;
}

/** Average grade letter of an entry ('B+' style), or ''. */
export function averageGrade(e) {
  const r = e.ratings || {};
  const n = GRADES.reduce((s, g) => s + num(r[g]), 0);
  if (!n) return '';
  const avg = (num(r.A) * 4 + num(r.B) * 3 + num(r.C) * 2 + num(r.D)) / n;
  const base = avg >= 3.5 ? 'A' : avg >= 2.5 ? 'B' : avg >= 1.5 ? 'C' : 'D';
  const frac = avg - Math.floor(avg);
  return base + (base !== 'A' && frac >= 0.5 && frac < 0.85 ? '+' : '');
}

/** Copy the shared fields (5.2 "phần chung") from the live player into the profile. */
export function syncProfile(profile, player, now) {
  if (!player) return profile;
  profile.name = player.name || profile.name;
  if (player.home && (player.home.place !== profile.home.place || player.home.room !== profile.home.room)) {
    profile.home.history = [...(profile.home.history || []), { place: profile.home.place, room: profile.home.room }].slice(-20);
    profile.home.place = player.home.place; profile.home.room = player.home.room;
  }
  profile.tamTru = player.tamTru ? { day: player.tamTruDay, date: dateLabel(player.tamTruDay) } : null;
  profile.bhyt = player.bhyt || null;
  profile.certs = mergeCerts(profile.certs, player.certs || []);
  for (const [k, v] of Object.entries(player.skills || {})) profile.skills[k] = Math.max(num(profile.skills[k]), num(v));
  profile.reputation = num(player.reputation, profile.reputation);
  if (now != null) profile.updatedAt = now;
  return profile;
}

// ---------- Solo import (5.1: each finished 45-day internship becomes one line) ----------
const END_REASON = { finish: 'hetthuctap', quit: 'chuyencho', layoff: 'bichonghi', resign: 'nghingoi' };
const END_TEXT = { finish: 'Hết 45 ngày thực tập', quit: 'Nghỉ việc sau khi lên chính thức', layoff: 'Bị cho nghỉ (đợt cắt giảm)', resign: 'Tự nghỉ thực tập giữa chừng' };
const workdaysUpTo = (n) => { let c = 0; for (let d = 1; d <= n; d++) if ((d - 1) % 7 < 5) c++; return c; }; // Solo day 1 = Monday
const nameOf = (companyName, id) => (typeof companyName === 'function' ? companyName(id) : isObj(companyName) ? companyName[id] : typeof companyName === 'string' ? companyName : null) || id;

/** One entry per finished Solo run (idempotent by run id). soloRuns: profile.runs object or an array.
 *  companyName: (id) => name, or { id: name }, or a single name. → number of entries added. */
export function importSolo(profile, soloRuns, companyName) {
  const runs = Array.isArray(soloRuns) ? soloRuns : isObj(soloRuns) ? Object.values(soloRuns) : [];
  let added = 0;
  for (const r of runs) {
    if (!isObj(r) || typeof r.id !== 'string' || !(r.ended || r.done)) continue;
    const endType = (isObj(r.ended) && r.ended.type) || 'finish';
    const soloDays = num(isObj(r.ended) ? r.ended.day : 0, 0) || num(r.day, 0);
    const ratings = { A: 0, B: 0, C: 0, D: 0 };
    for (const rv of Array.isArray(r.reviews) ? r.reviews : []) if (rv && GRADES.includes(rv.grade)) ratings[rv.grade]++;
    const official = r.status === 'official';
    const earned = (Array.isArray(r.payslips) ? r.payslips : []).reduce((s, p) => s + num(p && p.net), 0);
    const entryId = `solo-${r.id}`;
    const fresh = {
      entryId, placeId: r.company || 'tm', placeName: nameOf(companyName, r.company || 'tm'), kind: 'company',
      role: official ? 'Nhân viên chính thức' : 'Thực tập sinh', rank: official ? 2 : 1, rankHighest: official ? 2 : 1,
      status: official ? 'official' : 'intern', tier: r.tier || null,
      daysWorked: workdaysUpTo(soloDays), soloDays, shifts: workdaysUpTo(soloDays), hours: 0, earned: Math.round(earned), lastDay: 0,
      startDay: null, startDate: '', startReal: num(r.createdAt, 0) || null, endDay: null, endDate: '', endReal: num(r.updatedAt, 0) || null,
      ratings, comments: [], reasonLeft: { code: END_REASON[endType] || 'chuyencho', text: END_TEXT[endType] || 'Đã kết thúc', type: endType },
      contacts: [], highlights: official ? ['Lên nhân viên chính thức'] : [], reference: null,
      soloRunId: r.id, rev: 1, updatedAt: num(r.updatedAt, 0),
    };
    const cur = profile.entries.find((e) => e.entryId === entryId);
    if (cur) Object.assign(cur, mergeEntry(cur, fresh));
    else { profile.entries.push(fresh); added++; }
  }
  recomputeTotals(profile);
  if (added) profile.rev = (profile.rev || 0) + 1;
  return added;
}

// ---------- merge (two devices) ----------
const newer = (a, b, key = 'updatedAt') => (num(b[key]) > num(a[key]) ? b : a);
function mergeContacts(a = [], b = []) {
  const map = new Map();
  for (const c of [...a, ...b]) {
    if (!isObj(c)) continue;
    const k = c.id || c.name;
    const prev = map.get(k);
    map.set(k, prev ? { ...prev, ...c, hearts: Math.max(num(prev.hearts), num(c.hearts)) } : c);
  }
  return [...map.values()];
}
function mergeCerts(a = [], b = []) {
  const map = new Map();
  for (const c of [...a, ...b]) {
    if (!isObj(c) && typeof c !== 'string') continue;
    const k = typeof c === 'string' ? c : c.id || c.name;
    if (!map.has(k)) map.set(k, c);
  }
  return [...map.values()];
}
/** Two copies of the same entry → one. Counters take the max; the newer copy wins for end date, reason, role. */
export function mergeEntry(a, b) {
  const nw = (num(b.rev) > num(a.rev) || (num(b.rev) === num(a.rev) && num(b.updatedAt) > num(a.updatedAt))) ? b : a;
  const out = { ...a, ...b, ...nw };
  for (const k of ['daysWorked', 'shifts', 'hours', 'earned', 'rankHighest', 'lastDay', 'soloDays', 'rev', 'updatedAt']) {
    if (k in a || k in b) out[k] = Math.max(num(a[k]), num(b[k]));
  }
  out.ratings = {};
  for (const g of GRADES) out.ratings[g] = Math.max(num(a.ratings?.[g]), num(b.ratings?.[g]));
  out.contacts = mergeContacts(a.contacts, b.contacts);
  out.highlights = [...new Set([...(a.highlights || []), ...(b.highlights || [])])].slice(-MAX_HIGHLIGHTS);
  out.comments = (nw.comments || []).slice(-MAX_COMMENTS);
  return out;
}
/** Merge two personal profiles (kp.profile). */
export function mergeResume(pa, pb) {
  if (!isObj(pa)) return isObj(pb) ? clone(pb) : emptyKpProfile();
  if (!isObj(pb)) return clone(pa);
  const nw = (num(pb.updatedAt) > num(pa.updatedAt) || (num(pb.updatedAt) === num(pa.updatedAt) && num(pb.rev) > num(pa.rev))) ? pb : pa;
  const out = clone({ ...pa, ...pb, ...nw });
  const byId = new Map();
  const order = [];
  for (const e of [...(pa.entries || []), ...(pb.entries || [])]) {
    if (!isObj(e) || typeof e.entryId !== 'string') continue;
    if (!byId.has(e.entryId)) { byId.set(e.entryId, clone(e)); order.push(e.entryId); } else byId.set(e.entryId, mergeEntry(byId.get(e.entryId), e));
  }
  out.entries = order.map((id) => byId.get(id));
  out.skills = { ...(pa.skills || {}) };
  for (const [k, v] of Object.entries(pb.skills || {})) out.skills[k] = Math.max(num(out.skills[k]), num(v));
  out.certs = mergeCerts(pa.certs, pb.certs);
  out.rev = Math.max(num(pa.rev), num(pb.rev));
  out.updatedAt = Math.max(num(pa.updatedAt), num(pb.updatedAt));
  recomputeTotals(out);
  return out;
}
/** Merge two kp states: the newer one (by kp.saved) wins for everything except the personal profile,
 *  whose history is merged so days, shifts and hours only go up. Accepts null on either side. */
export function mergeKp(a, b) {
  if (!isObj(a)) return isObj(b) ? clone(b) : null;
  if (!isObj(b)) return clone(a);
  const base = newer(a, b, 'saved');
  const out = clone(base);
  out.profile = mergeResume(a.profile, b.profile);
  return out;
}

const clone = (x) => JSON.parse(JSON.stringify(x));

// ---------- validation (used by game/save.js) ----------
function sanitizeEntry(e) {
  if (!isObj(e) || typeof e.entryId !== 'string' || !e.entryId) return null;
  const out = { ...e };
  out.placeId = str(e.placeId, 'unknown'); out.placeName = str(e.placeName, out.placeId);
  for (const k of ['daysWorked', 'shifts', 'hours', 'earned', 'rank', 'rankHighest', 'rev', 'updatedAt', 'lastDay']) out[k] = Math.max(0, num(e[k], 0));
  const r = isObj(e.ratings) ? e.ratings : {};
  out.ratings = { A: num(r.A), B: num(r.B), C: num(r.C), D: num(r.D) };
  out.comments = Array.isArray(e.comments) ? e.comments.filter((x) => typeof x === 'string').slice(-MAX_COMMENTS) : [];
  out.highlights = Array.isArray(e.highlights) ? e.highlights.filter((x) => typeof x === 'string').slice(-MAX_HIGHLIGHTS) : [];
  out.contacts = Array.isArray(e.contacts) ? e.contacts.filter(isObj) : [];
  out.reasonLeft = isObj(e.reasonLeft) ? e.reasonLeft : null;
  return out;
}
/** Sanity-check a personal profile; keeps unknown fields. Never returns null (an empty profile at worst). */
export function sanitizeResume(p) {
  if (!isObj(p)) return emptyKpProfile();
  const base = emptyKpProfile();
  const out = { ...base, ...p };
  out.v = num(p.v, KP_PROFILE_VERSION);
  out.name = str(p.name, '');
  out.home = isObj(p.home) ? { ...base.home, ...p.home, history: Array.isArray(p.home.history) ? p.home.history : [] } : base.home;
  out.certs = Array.isArray(p.certs) ? p.certs : [];
  out.skills = isObj(p.skills) ? Object.fromEntries(Object.entries(p.skills).filter(([, v]) => Number.isFinite(v))) : {};
  out.reputation = num(p.reputation, 50);
  out.entries = Array.isArray(p.entries) ? p.entries.map(sanitizeEntry).filter(Boolean) : [];
  out.rev = num(p.rev, 0); out.updatedAt = num(p.updatedAt, 0);
  recomputeTotals(out);
  return out;
}
/** Sanity-check a whole kp state from storage. Keeps unknown fields; repairs types. null only if not an object.
 *  A broken world (no usable player/time) is flagged with kp.broken = true; world.loadGame then restarts the street
 *  but keeps kp.profile (the hồ sơ is never lost). */
export function sanitizeKp(kp) {
  if (!isObj(kp)) return null;
  const out = { ...kp };
  out.v = num(kp.v, 1);
  out.saved = num(kp.saved, 0);
  out.profile = sanitizeResume(kp.profile);
  out.xomoi = isObj(kp.xomoi) ? { ...kp.xomoi, msgs: Array.isArray(kp.xomoi.msgs) ? kp.xomoi.msgs.filter(isObj).slice(-200) : [], unread: Math.max(0, num(kp.xomoi.unread, 0)) } : { msgs: [], unread: 0 };
  out.ledger = Array.isArray(kp.ledger) ? kp.ledger.filter(isObj).slice(-400) : [];
  out.flags = isObj(kp.flags) ? kp.flags : {};
  out.shops = isObj(kp.shops) ? kp.shops : {};
  out.job = isObj(kp.job) ? kp.job : null;
  const t = isObj(kp.time) ? kp.time : null;
  const okTime = t && Number.isFinite(t.day) && t.day >= 1 && Number.isFinite(t.min);
  const p = isObj(kp.player) ? kp.player : null;
  const okPlayer = p && Number.isFinite(p.money) && isObj(p.needs);
  if (okTime) out.time = { ...t, day: Math.floor(t.day), min: Math.max(0, Math.min(26 * 60, t.min)) };
  if (okPlayer) {
    const n = p.needs, c = (x, d) => Math.max(0, Math.min(100, num(x, d)));
    out.player = { ...p, needs: { ...n, food: c(n.food, 60), energy: c(n.energy, 60), mood: c(n.mood, 60) }, rentDebt: Math.max(0, num(p.rentDebt, 0)),
      certs: Array.isArray(p.certs) ? p.certs : [], skills: isObj(p.skills) ? p.skills : {}, today: isObj(p.today) ? p.today : { coffee: 0, shifts: 0, ate: 0 } };
  }
  if (!okTime || !okPlayer || !isObj(kp.economy)) out.broken = true; else delete out.broken;
  return out;
}
