// Phá Án Công Sở: pure rules for the detective mode (no DOM). Shared by modes/detective.js and the unit tests.
// A case = evidence (hồ sơ) + testimony (lời khai) + contradictions (lời khai X sai với bằng chứng Y) + final questions.
// State is plain JSON so it can be saved in localStorage as is.

export const MAX_SUBMITS = 3; // wrong conclusions allowed before the case is closed for you

export function newState() {
  return { unlocked: [], found: [], misses: 0, hints: 0, wrong: 0, solved: false, gaveUp: false, fresh: [], notes: '', answers: {} };
}

export const isVisible = (item, s) => !item.locked || s.unlocked.includes(item.id);
export const evidenceOf = (c, s) => c.evidence.filter((e) => isVisible(e, s));
export const testimonyOf = (c, s) => c.testimony.filter((t) => isVisible(t, s));
export const isBroken = (c, s, stmtId) => s.found.some((i) => c.contradictions[i].stmt === stmtId);
export const isClosed = (s) => s.solved || s.gaveUp;

// Present evidence `evId` against statement `stmtId`. Mutates `s`.
// → { ok: true, k, unlocked } on a real contradiction; { ok: false } (and one miss) otherwise.
export function present(c, s, stmtId, evId) {
  const t = c.testimony.find((x) => x.id === stmtId);
  const e = c.evidence.find((x) => x.id === evId);
  if (!t || !e || !isVisible(t, s) || !isVisible(e, s) || isClosed(s)) return { ok: false, invalid: true };
  const i = c.contradictions.findIndex((k) => k.stmt === stmtId && k.ev.includes(evId));
  if (i < 0) {
    if (isBroken(c, s, stmtId)) return { ok: false, invalid: true }; // already broken: no penalty, nothing to gain
    s.misses++;
    return { ok: false };
  }
  const k = c.contradictions[i];
  if (s.found.includes(i)) return { ok: true, repeat: true, k, unlocked: [] };
  s.found.push(i);
  const unlocked = [];
  for (const id of k.unlock || []) {
    if (!s.unlocked.includes(id)) { s.unlocked.push(id); s.fresh.push(id); unlocked.push(id); }
  }
  return { ok: true, k, unlocked };
}

// Reveal the next hint (each one costs a point). Returns every hint revealed so far.
export function takeHint(c, s) {
  if (s.hints < c.hints.length && !isClosed(s)) s.hints++;
  return c.hints.slice(0, s.hints);
}

// Lock in the conclusion. Only the number of right answers is told, never which ones.
export function submit(c, s, answers) {
  const total = c.questions.length;
  if (isClosed(s)) return { closed: true, total };
  const missing = c.questions.filter((q) => answers[q.id] == null).length;
  if (missing) return { missing, total };
  const correct = c.questions.filter((q) => answers[q.id] === q.answer).length;
  if (correct === total) { s.solved = true; return { solved: true, correct, total }; }
  s.wrong++;
  if (s.wrong >= MAX_SUBMITS) s.gaveUp = true;
  return { solved: false, correct, total, left: MAX_SUBMITS - s.wrong, gaveUp: s.gaveUp };
}

// 3★: at most 1 slip. A wrong conclusion counts double. Not solved: 0★.
export function penalty(s) { return s.misses + s.hints + 2 * s.wrong; }
export function stars(s) {
  if (!s.solved) return 0;
  const p = penalty(s);
  return p <= 1 ? 3 : p <= 4 ? 2 : 1;
}
export const RANKS = ['Sếp phá án hộ', 'Intern hóng chuyện', 'Thám tử thử việc', 'Thám tử chính thức'];

// Content checks (used by the unit tests): ids, references, answers, and that every locked item and every
// contradiction can actually be reached by playing.
export function validateCase(c) {
  const err = [];
  const need = (cond, msg) => { if (!cond) err.push(`${c.id}: ${msg}`); };
  need(c.id && c.title && c.intro && c.intro.length, 'missing id / title / intro');
  const ids = [...c.evidence, ...c.testimony].map((x) => x.id);
  need(new Set(ids).size === ids.length, 'duplicate evidence/testimony id');
  const ev = new Set(c.evidence.map((e) => e.id));
  const st = new Set(c.testimony.map((t) => t.id));
  for (const t of c.testimony) need(c.people[t.who], `testimony ${t.id}: unknown person ${t.who}`);
  for (const k of c.contradictions) {
    need(st.has(k.stmt), `contradiction: unknown statement ${k.stmt}`);
    need(k.ev.length && k.ev.every((id) => ev.has(id)), `contradiction ${k.stmt}: unknown evidence ${k.ev}`);
    for (const id of k.unlock || []) need(ev.has(id) || st.has(id), `contradiction ${k.stmt}: unknown unlock ${id}`);
    for (const [who] of k.reveal || []) need(who === 'nar' || c.people[who], `contradiction ${k.stmt}: unknown speaker ${who}`);
  }
  for (const q of c.questions) {
    need(q.options.length >= 3, `question ${q.id}: needs 3+ options`);
    need(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `question ${q.id}: answer out of range`);
    need(q.why, `question ${q.id}: missing why`);
  }
  need(new Set(c.questions.map((q) => q.id)).size === c.questions.length, 'duplicate question id');
  need(c.hints.length >= 2, 'needs 2+ hints');
  // Play every contradiction that is reachable until nothing changes: everything must open up.
  const s = newState();
  for (let changed = true; changed;) {
    changed = false;
    c.contradictions.forEach((k, i) => {
      if (s.found.includes(i)) return;
      const evId = k.ev.find((id) => isVisible(c.evidence.find((e) => e.id === id), s));
      if (evId && isVisible(c.testimony.find((t) => t.id === k.stmt), s)) { present(c, s, k.stmt, evId); changed = true; }
    });
  }
  need(s.found.length === c.contradictions.length, 'some contradictions can never be reached');
  for (const x of [...c.evidence, ...c.testimony]) need(isVisible(x, s), `${x.id} stays locked forever`);
  return err;
}
