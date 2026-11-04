// Content validator for Solo companies (docs/COMPANY_CONTRACT.md). Pure Node, no browser.
// Usage: node tests/validate-companies.mjs [companyId ...]   → prints problems, exits 1 if any ERROR.
// It also walks every scene path once (all branches of every choice / if) to catch broken references.
import { SPOTS, INTERACTABLE_IDS } from '../site/js/maps/slots.js';
import { COMPANY_LIST } from '../site/js/companies/index.js';
import { newRun } from '../site/js/game/save.js';

const SPECIAL = new Set(['me', 'think', 'nar', 'kpi']);
const FX_KEYS = new Set(['uy', 'dr', 'nl', 'rel', 'set', 'money', 'clock']);
const MINI_TYPES = new Set(['pick', 'quiz', 'order']);
const MAX_LINE = 240;
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function validateCompany(id) {
  const errors = [], warns = [];
  const E = (m) => errors.push(m), W = (m) => warns.push(m);
  let co;
  try { co = (await import(`../site/js/companies/${id}/index.js`)).default; } catch (e) { return { errors: [`cannot import companies/${id}/index.js: ${e.message}`], warns, stats: {} }; }
  if (co.id !== id) E(`id is "${co.id}", expected "${id}"`);
  const cast = co.cast || {};
  const bodies = new Set(Object.entries(cast).filter(([, c]) => c.body !== false && c.look).map(([k]) => k));
  const known = (who) => SPECIAL.has(who) || !!cast[who];
  if (!bodies.has(co.manager)) E(`manager "${co.manager}" must be a cast member with a body`);
  if (!(co.officialSalary >= 5_000_000)) E('officialSalary missing');
  const usedSpots = {};
  for (const [cid, c] of Object.entries(cast)) {
    if (!c.name || !c.role || !c.emoji || !c.color) E(`cast.${cid}: needs name, role, emoji, color`);
    if (c.body !== false) {
      if (!c.look) E(`cast.${cid}: needs look (or body:false)`);
      if (!c.spot || !SPOTS[c.spot]) E(`cast.${cid}: spot "${c.spot}" is not a known slot`);
      else if (usedSpots[c.spot]) E(`cast.${cid}: spot "${c.spot}" already used by ${usedSpots[c.spot]}`);
      else usedSpots[c.spot] = cid;
    }
    if (!co.idle || !co.idle[cid] || !co.idle[cid].length) { if (c.body !== false) W(`idle.${cid}: no idle lines`); }
  }
  if (bodies.size < 7) W(`only ${bodies.size} people in the office (aim for 8–12)`);
  if (bodies.size > 18) E(`${bodies.size} people with bodies: max 18`);

  const voteIds = new Map();
  const where = [];
  function checkFx(fx, at) {
    if (!fx || typeof fx !== 'object') return E(`${at}: fx must be an object`);
    for (const k of Object.keys(fx)) if (!FX_KEYS.has(k)) E(`${at}: unknown fx key "${k}"`);
    if (fx.rel) for (const r of Object.keys(fx.rel)) if (!cast[r]) E(`${at}: fx.rel uses unknown cast "${r}"`);
    for (const k of ['uy', 'dr', 'nl', 'money', 'clock']) if (fx[k] !== undefined && !Number.isFinite(fx[k])) E(`${at}: fx.${k} must be a number`);
  }
  function checkMini(m, at) {
    if (!MINI_TYPES.has(m.type)) return E(`${at}: mini.type must be pick|quiz|order`);
    if (!m.title) E(`${at}: mini.title missing`);
    if (m.pass !== undefined && !(m.pass > 0 && m.pass <= 1)) E(`${at}: pass must be in (0, 1]`);
    const n = m.type === 'quiz' ? (m.questions || []).length : (m.items || []).length;
    const perItem = m.type === 'quiz' ? 6 : m.type === 'order' ? 2.5 : 3;
    if ((m.time || 30) * 0.64 < n * perItem) W(`${at}: time ${m.time || 30}s may be too short for ${n} items when hungry + sleepy (×0.64)`);
    if (m.type === 'pick') { if (!Array.isArray(m.items) || m.items.length < 3 || m.items.length > 9) E(`${at}: pick needs 3–9 items`); else if (!m.items.some((x) => x.correct)) E(`${at}: pick has no correct item`); if ((m.pick || 1) > (m.items || []).filter((x) => x.correct).length) E(`${at}: pick ${m.pick} > correct items: a perfect answer could not reach 100%`); }
    if (m.type === 'quiz') { if (!Array.isArray(m.questions) || !m.questions.length) E(`${at}: quiz needs questions`); else m.questions.forEach((q, i) => { if (!q.q || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4 || !(q.correct >= 0 && q.correct < q.options.length)) E(`${at}: quiz question ${i} malformed`); }); }
    if (m.type === 'order') { if (!Array.isArray(m.items) || m.items.length < 3 || m.items.length > 9) E(`${at}: order needs 3–9 items`); else { const o = m.items.map((x) => x.order).sort((a, b) => a - b); if (o.some((v, i) => v !== i)) E(`${at}: order values must be 0..n-1`); } }
  }
  let lines = 0;
  function walk(nodes, at, ctx) {
    if (!Array.isArray(nodes)) return E(`${at}: scene must be an array`);
    nodes.forEach((n, i) => {
      const here = `${at}[${i}]`;
      if (Array.isArray(n)) {
        lines++;
        if (n.length !== 2 || typeof n[1] !== 'string') return E(`${here}: line must be [speaker, text]`);
        if (!known(n[0])) E(`${here}: unknown speaker "${n[0]}"`);
        if (n[1].length > MAX_LINE) W(`${here}: line is ${n[1].length} chars (max ${MAX_LINE}): "${n[1].slice(0, 50)}…"`);
        if (/\b(TODO|lorem)\b/i.test(n[1])) E(`${here}: placeholder text`);
        return;
      }
      if (!n || typeof n !== 'object') return E(`${here}: unknown node`);
      if (n.c) {
        if (!Array.isArray(n.o) || n.o.length < 2 || n.o.length > 4) E(`${here}: choice "${n.c}" needs 2–4 options`);
        if (!String(n.c).startsWith('_')) { if (voteIds.has(n.c)) E(`${here}: choice id "${n.c}" reused (also at ${voteIds.get(n.c)})`); voteIds.set(n.c, here); }
        if (n.o && n.o.every((o) => o.when)) W(`${here}: every option has a when() — choice may be skipped`);
        (n.o || []).forEach((o, k) => { if (!o.t) E(`${here}.o[${k}]: option text missing`); if (o.fx) checkFx(o.fx, `${here}.o[${k}]`); if (o.then) walk(o.then, `${here}.o[${k}].then`, ctx); });
        return;
      }
      if (n.if) { if (typeof n.if !== 'function') E(`${here}: if must be a function`); if (n.then) walk(n.then, `${here}.then`, ctx); if (n.else) walk(n.else, `${here}.else`, ctx); return; }
      if (n.fx) return checkFx(n.fx, here);
      if (n.chat) { (n.chat || []).forEach((m, k) => { if (!Array.isArray(m) || !known(m[0]) || typeof m[1] !== 'string') E(`${here}.chat[${k}]: must be [castId, text, dm?]`); }); return; }
      if (n.mini) { checkMini(n.mini, here); walk(n.good || [], `${here}.good`, ctx); walk(n.bad || [], `${here}.bad`, ctx); return; }
      if (n.salary) { ctx.salary = true; return; }
      E(`${here}: unknown node ${JSON.stringify(Object.keys(n))}`);
    });
  }
  function checkStep(s, at, prevTime) {
    if (!s.who) return E(`${at}: step needs who`);
    if (!s.obj) E(`${at}: step needs obj (objective text)`);
    if (s.time && !HHMM.test(s.time)) E(`${at}: time "${s.time}" must be HH:MM`);
    if (prevTime && s.time && s.time < prevTime) E(`${at}: time ${s.time} goes backwards (after ${prevTime})`);
    if (s.who.startsWith('obj:')) { if (!INTERACTABLE_IDS.includes(s.who.slice(4))) E(`${at}: unknown object "${s.who}"`); }
    else if (s.who.startsWith('call:')) { if (!cast[s.who.slice(5)]) E(`${at}: unknown caller "${s.who}"`); if (!s.call || !s.call.title || !Array.isArray(s.call.people)) E(`${at}: call steps need call:{title, people[]}`); else s.call.people.forEach((p) => { if (!known(p)) E(`${at}: call person "${p}" unknown`); }); }
    else if (!bodies.has(s.who)) E(`${at}: who "${s.who}" must be a cast member with a body (or obj:/call:)`);
    if (s.pos) for (const [k, v] of Object.entries(s.pos)) { if (!bodies.has(k)) E(`${at}: pos for unknown/bodiless "${k}"`); if (!SPOTS[v]) E(`${at}: pos "${v}" is not a slot`); }
    if (s.seat && s.seat !== 'mr_seat') E(`${at}: seat must be "mr_seat"`);
    walk(s.scene, `${at}.scene`, {});
    return s.time || prevTime;
  }

  // interview
  if (!co.interview || !Array.isArray(co.interview.steps)) E('interview.steps missing');
  else {
    const ctx = { salary: false };
    let t = null;
    co.interview.steps.forEach((s, i) => { t = checkStep(s, `interview.steps[${i}]`, t); });
    const all = JSON.stringify(co.interview.steps, (k, v) => (typeof v === 'function' ? undefined : v));
    if (!all.includes('"salary":true')) E('interview must contain a { salary: true } node');
    if (!co.interview.title || !co.interview.intro) E('interview needs title and intro');
    void ctx;
  }
  // episodes
  const eps = co.episodes || [];
  const epIds = new Set();
  eps.forEach((e, i) => {
    const at = `episodes[${i}:${e.id}]`;
    if (!e.id || epIds.has(e.id)) E(`${at}: id missing or duplicate`); epIds.add(e.id);
    if (!e.title || !e.intro) E(`${at}: needs title and intro`);
    if (!Array.isArray(e.steps) || e.steps.length < 2) E(`${at}: needs ≥2 steps`);
    if (e.day !== undefined && !(e.day >= 1 && e.day <= 45)) E(`${at}: day must be 1..45`);
    if (e.minDay !== undefined && e.maxDay !== undefined && e.minDay > e.maxDay) E(`${at}: minDay > maxDay`);
    if (e.end && !['quit', 'layoff'].includes(e.end)) E(`${at}: end must be quit|layoff`);
    if (e.diary && typeof e.diary !== 'function') E(`${at}: diary must be a function (run) => string`);
    if (e.pos) for (const [k, v] of Object.entries(e.pos)) if (!SPOTS[v] || !bodies.has(k)) E(`${at}: pos ${k}→${v} invalid`);
    let t = null;
    (e.steps || []).forEach((s, k) => { t = checkStep(s, `${at}.steps[${k}]`, t); });
  });
  const intern = eps.filter((e) => !e.official), official = eps.filter((e) => e.official);
  if (intern.length < 10) W(`only ${intern.length} intern episodes (aim 10–20)`);
  // routine
  const routine = co.routine || [];
  const rIds = new Set();
  routine.forEach((b, i) => { const at = `routine[${i}:${b.id}]`; if (!b.id || rIds.has(b.id)) E(`${at}: id missing or duplicate`); rIds.add(b.id); checkStep(b, at, null); });
  if (routine.length < 20) W(`only ${routine.length} routine beats (aim ≥ 24; a run has ~20 routine days × 2–3 beats)`);
  // side tasks
  const st = co.sideTasks || [];
  if (st.length < 6) W(`only ${st.length} side-task templates (aim ≥ 8)`);
  st.forEach((t, i) => {
    const at = `sideTasks[${i}:${t.id}]`;
    if (!t.id || !t.title || !cast[t.from]) E(`${at}: needs id, title, from (cast id)`);
    if (!(t.base >= 30 && t.base <= 120)) W(`${at}: base ${t.base} (minutes before deadline, 30–120)`);
    (t.legs || []).forEach((l, k) => {
      if (l.npc && !bodies.has(l.npc)) E(`${at}.legs[${k}]: npc "${l.npc}" must have a body`);
      if (l.obj && !INTERACTABLE_IDS.includes(l.obj)) E(`${at}.legs[${k}]: obj "${l.obj}" unknown`);
      if (!l.npc && !l.obj) E(`${at}.legs[${k}]: needs npc or obj`);
      if (l.line && !known(l.line[0])) E(`${at}.legs[${k}]: line speaker unknown`);
    });
    if (!(t.legs || []).length) E(`${at}: needs legs`);
  });
  // review
  for (const g of ['A', 'B', 'C', 'D']) if (!co.review || !Array.isArray(co.review[g]) || co.review[g].length < 3) W(`review.${g}: needs ≥3 lines`);
  // promotion
  const pr = co.promotion;
  if (!pr || typeof pr.when !== 'function' || !Array.isArray(pr.offer)) E('promotion needs when(run) and offer[]');
  else {
    const s = JSON.stringify(pr.offer);
    if (!s.includes('accept_official')) E('promotion.offer must set flag accept_official');
    walk(pr.offer, 'promotion.offer', {});
    for (const a of pr.arc || []) if (!eps.find((e) => e.id === a && e.official)) E(`promotion.arc: "${a}" is not an official episode`);
    const last = eps.find((e) => e.id === (pr.arc || []).slice(-1)[0]);
    if ((pr.arc || []).length && !(last && last.end)) E('promotion.arc: last episode must have end: quit|layoff');
    if ((pr.arc || []).length < 2) W('promotion.arc: aim for 3–5 post-promotion episodes');
    // the check must not be trivially true for a fresh run
    try { if (pr.when(newRun({ name: 'x', id: 'v' }))) E('promotion.when is true for a brand-new run'); } catch (e) { E(`promotion.when throws: ${e.message}`); }
  }
  if (official.length && !(pr && (pr.arc || []).length)) W('official episodes exist but promotion.arc is empty');
  // endings
  for (const k of ['finish', 'quit', 'layoff']) {
    const v = co.endings && co.endings[k];
    const val = typeof v === 'function' ? v({ ...newRun({ name: 'x', id: 'e' }) }) : v;
    if (!val || !val.title || !val.text) E(`endings.${k}: needs {title, text} (or a function returning it)`);
  }
  // functions in when/if must not throw on a fresh run
  const fresh = { ...newRun({ name: 'x', id: 'f' }), tier: 't1', day: 3 };
  const probe = (nodes, at) => (nodes || []).forEach((n, i) => {
    if (!n || Array.isArray(n)) return;
    try { if (n.if) n.if(fresh); } catch (e) { E(`${at}[${i}]: if() throws on a fresh run: ${e.message}`); }
    (n.o || []).forEach((o, k) => { try { if (o.when) o.when(fresh); } catch (e) { E(`${at}[${i}].o[${k}]: when() throws: ${e.message}`); } probe(o.then, `${at}[${i}].o[${k}].then`); });
    probe(n.then, `${at}[${i}].then`); probe(n.else, `${at}[${i}].else`); probe(n.good, `${at}[${i}].good`); probe(n.bad, `${at}[${i}].bad`);
  });
  eps.forEach((e) => { (e.steps || []).forEach((s, k) => { try { if (s.when) s.when(fresh); } catch (err) { E(`${e.id}.steps[${k}].when throws`); } probe(s.scene, `${e.id}.steps[${k}]`); }); try { if (e.diary) e.diary(fresh); } catch (err) { E(`${e.id}.diary throws: ${err.message}`); } });
  routine.forEach((b) => { try { if (b.when) b.when(fresh); } catch (err) { E(`${b.id}.when throws`); } probe(b.scene, b.id); });
  void where;
  return { errors, warns, stats: { cast: Object.keys(cast).length, bodies: bodies.size, episodes: intern.length, official: official.length, routine: routine.length, sideTasks: st.length, lines } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : COMPANY_LIST.filter((c) => c.ready).map((c) => c.id);
  let bad = 0;
  for (const id of ids) {
    const { errors, warns, stats } = await validateCompany(id);
    console.log(`\n=== ${id} === ${JSON.stringify(stats)}`);
    errors.forEach((e) => console.log('  ERROR', e));
    warns.forEach((w) => console.log('  warn ', w));
    if (!errors.length) console.log('  OK');
    bad += errors.length;
  }
  process.exit(bad ? 1 : 0);
}
