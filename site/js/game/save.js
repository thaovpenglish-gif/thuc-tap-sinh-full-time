// Career profile with several independent runs ("lượt chơi"). Pure functions; storage lives elsewhere.
// A run = one company + one salary tier + progress. Starting a new run ("nhảy công ty") never deletes old ones.

export const SAVE_VERSION = 1;
const COMPANY_NAMES = { tm: 'T&M Partners' };
const MAX_RUNS = 12;

const randomId = () => Math.random().toString(36).slice(2, 10);

export function emptyProfile() {
  return { v: SAVE_VERSION, runs: {}, activeId: null };
}

export function newRun({ name, company = 'tm', now = Date.now(), id = randomId() }) {
  return {
    id, company, name: String(name || '').slice(0, 16),
    tier: null,           // chosen in the prologue salary negotiation
    level: 1,             // chapter / month
    day: 0,               // 0 = prologue (interview), 1.. = workdays
    step: 0,              // index inside the current day's story beats
    clock: 14 * 60,       // in-game minutes since midnight
    st: { uy: 50, dr: 0, nl: 100 },
    money: 0,
    rel: {}, flags: {}, chat: [], unread: 0, tasks: [],
    createdAt: now, updatedAt: now, done: false,
  };
}

export function addRun(profile, run) {
  const runs = { ...profile.runs, [run.id]: run };
  // keep the profile bounded: drop the oldest finished runs first, then the oldest
  const ids = Object.keys(runs);
  if (ids.length > MAX_RUNS) {
    const sorted = ids.map((k) => runs[k]).sort((a, b) => (a.done === b.done ? a.updatedAt - b.updatedAt : a.done ? -1 : 1));
    for (const r of sorted.slice(0, ids.length - MAX_RUNS)) if (r.id !== run.id) delete runs[r.id];
  }
  return { ...profile, runs, activeId: run.id };
}

export function updateRun(profile, id, patch, now = Date.now()) {
  const cur = profile.runs[id];
  if (!cur) return profile;
  return { ...profile, runs: { ...profile.runs, [id]: { ...cur, ...patch, updatedAt: now } }, activeId: id };
}

export function removeRun(profile, id) {
  const runs = { ...profile.runs };
  delete runs[id];
  return { ...profile, runs, activeId: profile.activeId === id ? null : profile.activeId };
}

export const listRuns = (profile) => Object.values(profile.runs).sort((a, b) => b.updatedAt - a.updatedAt);

export function runLabel(run, tierLabel = (t) => t) {
  const parts = [COMPANY_NAMES[run.company] || run.company, `Level ${run.level}`];
  if (run.tier) parts.push(tierLabel(run.tier));
  parts.push(run.day === 0 ? 'Vòng phỏng vấn' : `Ngày ${run.day}`);
  return parts.join(' · ');
}

const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
const num = (x, d) => (Number.isFinite(x) ? x : d);

/** Accept anything (localStorage, cloud row, save code) and return a safe profile or null. */
export function validateProfile(obj) {
  if (!isObj(obj) || obj.v !== SAVE_VERSION || !isObj(obj.runs)) return null;
  const out = emptyProfile();
  for (const [id, r] of Object.entries(obj.runs)) {
    if (!isObj(r) || typeof r.id !== 'string' || r.id !== id) continue;
    out.runs[id] = {
      ...newRun({ name: r.name, company: r.company || 'tm', now: num(r.createdAt, 0), id }),
      ...r,
      st: { uy: num(r.st?.uy, 50), dr: num(r.st?.dr, 0), nl: num(r.st?.nl, 100) },
      rel: isObj(r.rel) ? r.rel : {}, flags: isObj(r.flags) ? r.flags : {},
      chat: Array.isArray(r.chat) ? r.chat.slice(-150) : [], tasks: Array.isArray(r.tasks) ? r.tasks : [],
      updatedAt: num(r.updatedAt, 0),
    };
  }
  out.activeId = out.runs[obj.activeId] ? obj.activeId : null;
  return out;
}

/** Merge two profiles run-by-run, keeping whichever copy of each run was updated last. */
export function mergeProfiles(a, b) {
  const pa = validateProfile(a) || emptyProfile();
  const pb = validateProfile(b) || emptyProfile();
  const runs = { ...pa.runs };
  for (const [id, r] of Object.entries(pb.runs)) if (!runs[id] || r.updatedAt > runs[id].updatedAt) runs[id] = r;
  const activeId = (pa.activeId && runs[pa.activeId]) ? pa.activeId : (pb.activeId && runs[pb.activeId]) ? pb.activeId : null;
  return { v: SAVE_VERSION, runs, activeId };
}
