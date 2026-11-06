// Phá Án Công Sở: rules (game/detective.js) and every case in content/cases.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { newState, present, submit, takeHint, stars, validateCase, evidenceOf, testimonyOf, isBroken, MAX_SUBMITS } from '../site/js/game/detective.js';
import { CASES } from '../site/js/content/cases.js';

const key = (c) => Object.fromEntries(c.questions.map((q) => [q.id, q.answer]));

test('every case is well formed and fully reachable', () => {
  assert.ok(CASES.length >= 3);
  assert.equal(new Set(CASES.map((c) => c.id)).size, CASES.length);
  for (const c of CASES) assert.deepEqual(validateCase(c), []);
});

test('no brute force fits in the allowed tries', () => {
  for (const c of CASES) {
    const combos = c.questions.reduce((n, q) => n * q.options.length, 1);
    assert.ok(combos > 50 * MAX_SUBMITS, `${c.id}: too easy to guess`);
  }
});

test('perfect play: break every statement, then solve with 3 stars', () => {
  for (const c of CASES) {
    const s = newState();
    for (const k of c.contradictions) {
      const ev = k.ev.find((id) => evidenceOf(c, s).some((e) => e.id === id));
      assert.ok(ev, `${c.id}: evidence for ${k.stmt} not open yet (order matters)`);
      assert.ok(testimonyOf(c, s).some((t) => t.id === k.stmt));
      const r = present(c, s, k.stmt, ev);
      assert.equal(r.ok, true);
      assert.ok(isBroken(c, s, k.stmt));
    }
    const r = submit(c, s, key(c));
    assert.equal(r.solved, true);
    assert.equal(stars(s), 3);
  }
});

test('locked items cannot be presented before they are opened', () => {
  for (const c of CASES) {
    const s = newState();
    for (const e of c.evidence.filter((x) => x.locked)) {
      for (const t of c.testimony) assert.equal(present(c, s, t.id, e.id).ok, false);
    }
    assert.equal(s.misses, 0, 'presenting something hidden is not a miss');
  }
});

test('a wrong contradiction is a miss; repeating a found one or using a broken statement costs nothing', () => {
  const c = CASES[0];
  const s = newState();
  const k = c.contradictions[0];
  const wrongEv = c.evidence.find((e) => !e.locked && !k.ev.includes(e.id));
  assert.equal(present(c, s, k.stmt, wrongEv.id).ok, false);
  assert.equal(s.misses, 1);
  assert.equal(present(c, s, k.stmt, k.ev[0]).ok, true);
  assert.equal(present(c, s, k.stmt, k.ev[0]).repeat, true);
  assert.equal(present(c, s, k.stmt, wrongEv.id).invalid, true);
  assert.equal(s.misses, 1);
});

test('conclusion: missing answers are refused, wrong ones only reveal a count, 3 wrong closes the case', () => {
  const c = CASES[1];
  const s = newState();
  assert.equal(submit(c, s, {}).missing, c.questions.length);
  assert.equal(s.wrong, 0);
  const bad = Object.fromEntries(c.questions.map((q) => [q.id, (q.answer + 1) % q.options.length]));
  bad[c.questions[0].id] = c.questions[0].answer;
  const r = submit(c, s, bad);
  assert.equal(r.correct, 1);
  assert.equal(r.left, MAX_SUBMITS - 1);
  assert.equal(r.which, undefined);
  for (let i = 1; i < MAX_SUBMITS; i++) submit(c, s, bad);
  assert.equal(s.gaveUp, true);
  assert.equal(submit(c, s, key(c)).closed, true);
  assert.equal(stars(s), 0);
});

test('hints and slips lower the stars', () => {
  const c = CASES[2];
  const s = newState();
  takeHint(c, s); takeHint(c, s);
  assert.equal(takeHint(c, s).length, 3);
  assert.equal(takeHint(c, s).length, 3, 'no more than the case has');
  submit(c, s, key(c));
  assert.equal(stars(s), 2);
  const s2 = newState();
  s2.misses = 5;
  submit(c, s2, key(c));
  assert.equal(stars(s2), 1);
});

// The hard case hinges on time zones: make sure the files really say what the answer needs.
test('case "drop": the UTC log + VPN table point to one person', () => {
  const c = CASES.find((k) => k.id === 'drop');
  const audit = c.evidence.find((e) => e.id === 'e_audit');
  assert.match(audit.note, /UTC/);
  const drop = audit.table.rows.find((r) => r[3].startsWith('DROP'));
  const [d, hms] = drop[0].split(' ');
  const [hh, mm] = hms.split(':').map(Number);
  const vn = new Date(Date.UTC(2026, Number(d.split('/')[1]) - 1, Number(d.split('/')[0]), hh + 7, mm));
  const at = (txt) => { const [dd, rest] = txt.trim().split(' '); const [h, m] = rest.split(':').map(Number); return Date.UTC(2026, Number(dd.split('/')[1]) - 1, Number(dd.split('/')[0]), h, m); };
  const holders = c.evidence.find((e) => e.id === 'e_vpn').table.rows.filter((r) => {
    let [from, to] = r[0].split('→');
    if (!/\//.test(to)) to = `${from.trim().split(' ')[0]} ${to.trim()}`;
    return r[2] === drop[2] && at(from) <= vn.getTime() && vn.getTime() <= at(to);
  });
  assert.deepEqual(holders.map((r) => r[1]), ['Châu']);
  const q = c.questions.find((x) => x.id === 'ip');
  assert.equal(q.options[q.answer], 'Châu');
});
