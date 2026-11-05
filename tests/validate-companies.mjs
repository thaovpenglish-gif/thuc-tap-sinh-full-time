// Content validator for Solo companies (docs/COMPANY_CONTRACT.md). Pure Node, no browser.
// Usage: node tests/validate-companies.mjs [companyId ...]   → prints problems, exits 1 if any ERROR.
// It also walks every scene path once (all branches of every choice / if) to catch broken references.
import { SPOTS, INTERACTABLE_IDS } from '../site/js/maps/slots.js';
import { COMPANY_LIST } from '../site/js/companies/index.js';
import { newRun } from '../site/js/game/save.js';

const SPECIAL = new Set(['me', 'think', 'nar', 'kpi']);
const FX_KEYS = new Set(['uy', 'dr', 'nl', 'rel', 'set', 'money', 'clock']);
const MINI_TYPES = new Set(['pick', 'quiz', 'order', 'sort', 'action', 'doc', 'chat']);
const ACTION_GAMES = new Set(['shred', 'hold', 'whack', 'conveyor', 'align']); // site/js/ui/action.js
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
  if (co.reviewer && typeof co.reviewer !== 'function') E('reviewer must be a function (run) => castId|null');
  if (!(co.officialSalary >= 5_000_000)) E('officialSalary missing');
  const usedSpots = {};
  for (const [cid, c] of Object.entries(cast)) {
    if (!c.name || !c.role || !c.emoji || !c.color) E(`cast.${cid}: needs name, role, emoji, color`);
    if (c.body !== false) {
      if (!c.look) E(`cast.${cid}: needs look (or body:false)`);
      if (c.spot === 'giao' || cid === 'giao') E(`cast.${cid}: "giao" is reserved for Chị Giáo (engine NPC)`);
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
    if (!MINI_TYPES.has(m.type)) return E(`${at}: mini.type must be pick|quiz|order|sort|action|doc|chat`);
    if (!m.title) E(`${at}: mini.title missing`);
    if (m.pass !== undefined && !(m.pass > 0 && m.pass <= 1)) E(`${at}: pass must be in (0, 1]`);
    if (m.type === 'doc' || m.type === 'chat') {
      const list = m.type === 'doc' ? m.docs : m.convos;
      if (!Array.isArray(list) || list.length < 2) return E(`${at}: ${m.type} needs a bank of ≥ 2 scenarios (${m.type === 'doc' ? 'docs' : 'convos'})`);
      if ((m.time || 30) < 50) W(`${at}: reading games need ≥ 50 s (hunger and mood shorten it)`);
      const long = (t, k, max = 200) => { if (typeof t !== 'string' || !t) E(`${at}.${k}: text missing`); else if (t.length > max) W(`${at}.${k}: ${t.length} chars (max ${max})`); if (/\{ten\}/.test(t || '')) E(`${at}.${k}: no {ten} in mini-games`); };
      list.forEach((d, i) => {
        if (m.type === 'doc') {
          long(d.head, `docs[${i}].head`, 90);
          if (!Array.isArray(d.lines) || d.lines.length < 6 || d.lines.length > 18) E(`${at}.docs[${i}]: 6–18 lines`);
          const rows = (d.lines || []).filter((l) => !(l && l.h));
          const bad = rows.filter((l) => l && l.bad);
          if (bad.length > 5) W(`${at}.docs[${i}]: ${bad.length} problems (aim 2–4)`);
          if (!bad.length && !d.verdict) E(`${at}.docs[${i}]: a clean document needs a verdict`);
          rows.forEach((l, k) => { long(typeof l === 'string' ? l : l.t, `docs[${i}].lines[${k}]`, 140); if (l && l.bad) long(l.bad, `docs[${i}].lines[${k}].bad`, 160); });
          if (d.verdict) { const v = d.verdict; if (!v.q || !Array.isArray(v.options) || v.options.length < 2 || v.options.length > 4 || !(v.correct >= 0 && v.correct < v.options.length)) E(`${at}.docs[${i}].verdict malformed`); }
        } else {
          if (!d.who || !d.who.name) E(`${at}.convos[${i}]: who.name missing`);
          (d.start || []).forEach((t, k) => long(t, `convos[${i}].start[${k}]`));
          if (!Array.isArray(d.turns) || d.turns.length < 3 || d.turns.length > 6) E(`${at}.convos[${i}]: 3–6 turns`);
          (d.turns || []).forEach((t, k) => {
            if (t.them) long(t.them, `convos[${i}].turns[${k}].them`);
            if (!Array.isArray(t.options) || t.options.length < 2 || t.options.length > 3) return E(`${at}.convos[${i}].turns[${k}]: 2–3 options`);
            if (!t.options.some((o) => o.s === 2)) E(`${at}.convos[${i}].turns[${k}]: needs a best option (s: 2)`);
            t.options.forEach((o, n) => { long(o.t, `convos[${i}].turns[${k}].o[${n}]`, 140); if (![0, 1, 2].includes(o.s)) E(`${at}.convos[${i}].turns[${k}].o[${n}]: s must be 0|1|2`); if (o.react) long(o.react, `convos[${i}].turns[${k}].o[${n}].react`); });
          });
          if (!d.end || !d.end.good || !d.end.bad) E(`${at}.convos[${i}]: end { good, bad } missing`);
          // the best reply must not always be the longest one (players would just pick by length)
          const longest = (d.turns || []).filter((t) => (t.options || []).length && [...t.options].sort((x, y) => y.t.length - x.t.length)[0].s === 2).length;
          if ((d.turns || []).length && longest / d.turns.length > 0.7) W(`${at}.convos[${i}]: the best reply is the longest in ${longest}/${d.turns.length} turns (vary lengths)`);
        }
      });
      return;
    }
    if (m.type === 'action') {
      if (!ACTION_GAMES.has(m.game)) return E(`${at}: action.game must be one of ${[...ACTION_GAMES].join('|')}`);
      if (!m.prompt) W(`${at}: action game without a prompt (players need to know what to do)`);
      const lab = (x) => x && Array.isArray(x.labels) && x.labels.length >= 2 && x.labels.every((l) => typeof l === 'string' && l.length <= 32);
      if (m.game === 'whack' && (!lab(m.target) || !lab(m.avoid))) E(`${at}: whack needs target/avoid { emoji, labels[≥2, ≤32 chars] }`);
      if (m.game === 'conveyor' && (m.mode || 'stamp') === 'stamp' && (!lab(m.target) || !lab(m.avoid))) E(`${at}: conveyor stamp needs target/avoid { emoji, labels[≥2, ≤32 chars] }`);
      if (m.game === 'hold' && !['seal', 'balloon'].includes(m.skin || 'seal')) E(`${at}: hold.skin must be seal|balloon`);
      if (m.game === 'align' && m.blocks && (m.blocks.length < 3 || m.blocks.length > 5)) E(`${at}: align needs 3–5 blocks`);
      if ((m.time || 30) < 30) W(`${at}: action games need ≥ 30 s (hunger and mood shorten it)`);
      return;
    }
    // banks (desk games) show only `show` items / `ask` questions per play
    const n = m.type === 'quiz' ? Math.min(m.ask || Infinity, (m.questions || []).length) : Math.min(m.show || Infinity, (m.items || []).length);
    const perItem = m.type === 'quiz' ? 6 : m.type === 'order' ? 2.5 : m.type === 'sort' ? 3.2 : 3;
    if ((m.time || 30) * 0.64 < n * perItem) W(`${at}: time ${m.time || 30}s may be too short for ${n} items when hungry + sleepy (×0.64)`);
    const maxItems = m.show ? 14 : 9;
    if (m.show && (m.items || []).length && m.show > m.items.length) E(`${at}: show ${m.show} > ${m.items.length} items`);
    if (m.show && m.show > 9) E(`${at}: show must be ≤ 9 (keys 1–9)`);
    if (m.type === 'sort') {
      if (!Array.isArray(m.bins) || m.bins.length < 2 || m.bins.length > 4) E(`${at}: sort needs 2–4 bins`);
      if (!Array.isArray(m.items) || m.items.length < 3 || m.items.length > 14) E(`${at}: sort needs 3–14 items`);
      else m.items.forEach((x, i) => { if (!x.text || !(x.bin >= 0 && x.bin < (m.bins || []).length)) E(`${at}: sort item ${i} needs text and a valid bin`); });
      if (m.bins && m.items && m.bins.some((_, b) => !m.items.some((x) => x.bin === b))) W(`${at}: a bin has no item`);
    }
    if (m.type === 'quiz' && m.ask && m.ask > (m.questions || []).length) E(`${at}: ask ${m.ask} > ${(m.questions || []).length} questions`);
    if (m.type === 'pick') { if (!Array.isArray(m.items) || m.items.length < 3 || m.items.length > maxItems) E(`${at}: pick needs 3–${maxItems} items`); else if (!m.items.some((x) => x.correct)) E(`${at}: pick has no correct item`); if ((m.pick || 1) > (m.items || []).filter((x) => x.correct).length) E(`${at}: pick ${m.pick} > correct items: a perfect answer could not reach 100%`); }
    if (m.type === 'quiz') { if (!Array.isArray(m.questions) || !m.questions.length) E(`${at}: quiz needs questions`); else m.questions.forEach((q, i) => { if (!q.q || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4 || !(q.correct >= 0 && q.correct < q.options.length)) E(`${at}: quiz question ${i} malformed`); }); }
    if (m.type === 'pick' && m.show && (m.pick || 1) > m.show) E(`${at}: pick ${m.pick} > show ${m.show}`);
    if (m.type === 'order') { if (m.show) E(`${at}: order games are shown whole (no show)`); if (!Array.isArray(m.items) || m.items.length < 3 || m.items.length > 9) E(`${at}: order needs 3–9 items`); else { const o = m.items.map((x) => x.order).sort((a, b) => a - b); if (o.some((v, i) => v !== i)) E(`${at}: order values must be 0..n-1`); } }
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
    if (s.pos) for (const [k, v] of Object.entries(s.pos)) { if (!bodies.has(k)) E(`${at}: pos for unknown/bodiless "${k}"`); if (!SPOTS[v] && v !== 'away') E(`${at}: pos "${v}" is not a slot`); if (v === 'away' && s.who === k) E(`${at}: "${k}" is away but is the step target`); }
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
    if (e.end && typeof e.end !== 'function' && !['quit', 'layoff'].includes(e.end)) E(`${at}: end must be quit|layoff or (run) => 'quit'|'layoff'|null`);
    if (e.when && typeof e.when !== 'function') E(`${at}: when must be a function`);
    if (e.diary && typeof e.diary !== 'function') E(`${at}: diary must be a function (run) => string`);
    if (e.pos) for (const [k, v] of Object.entries(e.pos)) if ((!SPOTS[v] && v !== 'away') || !bodies.has(k)) E(`${at}: pos ${k}→${v} invalid`);
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
    if (t.when && typeof t.when !== 'function') E(`${at}: when must be a function`);
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
  // desk work (§12): games + chatter (group-chat drama while you work) + optional promoOffer
  const dk = co.desk;
  let deskGames = 0, deskChatter = 0;
  if (!dk) W('no desk content: the generic desk games are used (aim: desk.js with ≥ 8 games, ≥ 6 chatter)');
  else {
    const gIds = new Set(), cIds = new Set();
    (dk.games || []).forEach((g, i) => {
      const at = `desk.games[${i}:${g.id}]`;
      if (!g.id || gIds.has(g.id)) E(`${at}: id missing or duplicate`); gIds.add(g.id);
      checkMini(g, at);
      if (g.when && typeof g.when !== 'function') E(`${at}: when must be a function`);
      walk(g.good || [], `${at}.good`, {}); walk(g.bad || [], `${at}.bad`, {});
    });
    (dk.chatter || []).forEach((c, i) => {
      const at = `desk.chatter[${i}:${c.id}]`;
      if (!c.id || cIds.has(c.id)) E(`${at}: id missing or duplicate`); cIds.add(c.id);
      if (!Array.isArray(c.chat) || c.chat.length < 2) E(`${at}: chat needs ≥ 2 messages`);
      (c.chat || []).forEach((m, k) => { if (!Array.isArray(m) || !cast[m[0]] || typeof m[1] !== 'string') E(`${at}.chat[${k}]: must be [castId, text, dm?]`); else if (m[1].length > MAX_LINE) W(`${at}.chat[${k}]: too long`); });
      walk(c.scene || [], `${at}.scene`, {});
      if (!JSON.stringify(c.scene || []).includes('"c":')) W(`${at}: scene has no choice (the player should react)`);
      if (c.when && typeof c.when !== 'function') E(`${at}: when must be a function`);
    });
    if (dk.promoOffer) { walk(dk.promoOffer, 'desk.promoOffer', {}); if (!JSON.stringify(dk.promoOffer).includes('accept_official')) E('desk.promoOffer must set flag accept_official'); }
    deskGames = (dk.games || []).length; deskChatter = (dk.chatter || []).length;
    if (deskGames < 5) W(`only ${deskGames} desk games (aim ≥ 5)`);
    if (deskChatter < 6) W(`only ${deskChatter} desk chatter (aim ≥ 6)`);
    const types = (dk.games || []).map((g) => g.type);
    if (types.some((t) => !['action', 'doc', 'chat'].includes(t))) W('desk.games: use hands-on (action) and work sims (doc/chat); card games (pick/quiz/order/sort) feel like a test');
    if (types.filter((t) => t === 'action').length < 2) W('desk.games: aim for ≥ 2 hands-on (action) games');
    if (types.filter((t) => t === 'doc' || t === 'chat').length < 3) W('desk.games: aim for ≥ 3 work sims (doc/chat) that need real trade knowledge');
  }

  // flags read in when()/if()/diary()/promotion but never set anywhere (dead branches)
  const setFlags = new Set(['tax_commit', 'accept_official', 'promo_offered', 'official_day', 'paid30', 'drank_today', 'minis', 'minis_ok', 'snack_day', 'coffee_day', 'coffees', 'last_life', 'desk_ok_total', 'promo_by_work']);
  const readFlags = new Map();
  const scanFn = (fn, at) => { if (typeof fn !== 'function') return; for (const m of fn.toString().matchAll(/flags(?:\.|\[['"])(\w+)/g)) if (!readFlags.has(m[1])) readFlags.set(m[1], at); };
  const scanNodes = (nodes, at) => (nodes || []).forEach((n, i) => {
    if (!n || Array.isArray(n)) return;
    if (n.fx && n.fx.set) Object.keys(n.fx.set).forEach((k) => setFlags.add(k));
    scanFn(n.if, `${at}[${i}]`);
    (n.o || []).forEach((o, k) => { if (o.fx && o.fx.set) Object.keys(o.fx.set).forEach((f) => setFlags.add(f)); scanFn(o.when, `${at}[${i}].o[${k}]`); scanNodes(o.then, `${at}[${i}].o[${k}]`); });
    scanNodes(n.then, at); scanNodes(n.else, at); scanNodes(n.good, at); scanNodes(n.bad, at);
  });
  const allSteps = [...(co.interview?.steps || []), ...eps.flatMap((e) => e.steps || []), ...routine];
  allSteps.forEach((s2, i) => { scanFn(s2.when, `step ${s2.who}#${i}`); scanNodes(s2.scene, `step ${s2.who}#${i}`); });
  eps.forEach((e) => scanFn(e.diary, `${e.id}.diary`)); scanFn(co.interview?.diary, 'interview.diary');
  if (pr) { scanFn(pr.when, 'promotion.when'); scanNodes(pr.offer, 'promotion.offer'); }
  if (dk) { (dk.games || []).forEach((g) => { scanFn(g.when, `desk.${g.id}`); scanNodes(g.good, `desk.${g.id}`); scanNodes(g.bad, `desk.${g.id}`); }); (dk.chatter || []).forEach((c) => { scanFn(c.when, `desk.${c.id}`); scanNodes(c.scene, `desk.${c.id}`); }); scanNodes(dk.promoOffer, 'desk.promoOffer'); }
  if (co.endings) Object.values(co.endings).forEach((v) => scanFn(v, 'endings'));
  (co.ties || []).forEach((t) => setFlags.add('tie_' + t.id));
  // T&M Day 1 lives in story files but its flags count as set (scanned above through episodes)
  for (const [f, at] of readFlags) if (!setFlags.has(f)) W(`flag "${f}" is read (${at}) but never set — that branch can never trigger`);
  void where;
  return { errors, warns, stats: { cast: Object.keys(cast).length, bodies: bodies.size, episodes: intern.length, official: official.length, routine: routine.length, sideTasks: st.length, deskGames, deskChatter, lines } };
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
