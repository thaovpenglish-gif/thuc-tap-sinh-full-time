// Headless career playthrough for any Solo company. Usage (server on :8765 serving site/):
//   node tests/e2e/solo-career.cjs <company> <tier t0|t1|t3|t5> <first|last|rand> [maxDay=45] [quick=all|routine|none] [tasks]
// Plays: company picker → interview + salary → days (episodes in 3D, routine days quick or 3D) → Friday reviews,
// payslips, weekends, life events → ending. Checks: no JS errors, never stuck, every visible button is clickable
// (not covered by another element), run saved with the right company/tier, ending reached when maxDay=45.
const { chromium, devices } = require('playwright');
const [company = 'tm', tierId = 't1', strategy = 'first', maxDayArg = '45', quickArg = 'routine', tasksArg] = process.argv.slice(2);
const maxDay = Number(maxDayArg);
const doTasks = tasksArg === 'tasks';
const TIERS = ['t0', 't1', 't3', 't5'];
const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const OUT = process.env.SHOTS || '/tmp/claude-0';

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = process.env.MOBILE ? await b.newContext({ ...devices['iPhone 13'] }) : await b.newContext({ viewport: { width: 1280, height: 760 } });
  const p = await ctx.newPage();
  const errs = [], occluded = new Set();
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|supabase|ERR_|net::/i.test(m.text())) errs.push(m.text()); });
  await p.goto(BASE + '?debug=1', { waitUntil: 'networkidle' });
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('tts_letter_v1', '1'); });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(1000);
  await p.evaluate(() => { window.__miniDebug = null; document.querySelector('#soloBtn').click(); });
  await p.waitForFunction(() => window.__tm && !document.querySelector('#soloMenu').hidden, null, { timeout: 20000 });
  await p.fill('#soloName', 'Bot' + tierId);
  await p.evaluate(() => document.querySelector('#soloNew').click());
  await p.waitForTimeout(200);
  await p.evaluate((c) => document.querySelector(`[data-co="${c}"]`).click(), company);

  // every visible, enabled button must be the top element at its centre
  const auditButtons = async (where) => {
    const bad = await p.evaluate(() => {
      const out = [];
      const modal = ['#salary', '#mini', '#incoming', '#overlay', '#phone', '#pause', '#soloMenu', '#companyMenu'].map((s) => document.querySelector(s)).find((m) => m && !m.hidden);
      document.querySelectorAll('button, a.link, summary').forEach((el) => {
        if (el.disabled || el.closest('[hidden]')) return;
        if (modal && !modal.contains(el)) return; // only the open modal is meant to be clickable
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return;
        const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return;
        const x = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
        const top = document.elementFromPoint(x, y);
        if (top && !el.contains(top) && !top.contains(el)) out.push(`${el.id || el.className || el.textContent.trim().slice(0, 20)} ← covered by ${top.id || top.className || top.tagName}`);
      });
      return out;
    });
    bad.forEach((x) => occluded.add(`${where}: ${x}`));
  };

  const miniFails = [];
  let rnd = 7, choices = 0, minis = 0, stuck = 0, days = new Set(), reviews = 0, payslips = 0, lifes = 0, weekends = 0, ended = false, audited = new Set();
  const pickIdx = (n) => { if (strategy === 'last') return n - 1; if (strategy === 'rand') { rnd = (rnd * 16807) % 2147483647; return rnd % n; } return 0; };
  const approach = (kind, id, side) => p.evaluate(([kind, id, side]) => {
    const t = window.__tm;
    const tp = kind === 'obj' ? t.world.interactables.find((x) => x.id === id).pos : t.npcs[id].mesh.position;
    if (side === 0) { t.fp.player.pos.set(tp.x, t.fp.player.eye, tp.z + 1.1); t.fp.player.yaw = 0; } else { t.fp.player.pos.set(tp.x, t.fp.player.eye, tp.z - 1.0); t.fp.player.yaw = Math.PI; }
    t.fp.player.pitch = 0;
  }, [kind, id, side]);
  const press = async (kind, id) => {
    for (const side of [0, 1]) {
      await approach(kind, id, side); await p.waitForTimeout(140); await p.keyboard.press('KeyE'); await p.waitForTimeout(140);
      if ((await p.evaluate(() => window.__tm.mode)) !== 'play') return true;
    }
    return false;
  };

  for (let iter = 0; iter < 20000 && !ended; iter++) {
    const st = await p.evaluate(() => {
      const t = window.__tm, R = t.R, s = R ? t.currentStep() : null;
      const q = (sel) => !!document.querySelector(sel);
      const openTask = R && (R.tasks || []).find((x) => x.status === 'open');
      return {
        mode: t.mode, day: R && R.day, step: R && R.step,
        ov: !document.querySelector('#overlay').hidden,
        sal: q('#salary') && !document.querySelector('#salary').hidden,
        mini: q('#mini') && !document.querySelector('#mini').hidden && !q('#mini .mini-result'),
        ch: document.querySelectorAll('#choices button').length,
        btn: ['#toCompanies', '#payOk', '#lifeOk', '#wkOk', '#nextCard', '#quickDay', '#goDay'].find((x) => q('#ovCard ' + x)) || (q('#ovCard .life-choices [data-i]') ? 'life' : null),
        who: s ? s.who : null, review: !!(s && s.review),
        task: openTask ? openTask.legs[openTask.leg] : null,
      };
    });
    if (st.day) days.add(st.day);
    if (st.sal) { await auditButtons('salary'); const k = TIERS.indexOf(tierId); await p.evaluate((k) => { const c = document.querySelectorAll('.sal-card')[k]; c.click(); c.click(); }, k); await p.waitForTimeout(100); continue; }
    if (strategy !== 'rand') {
      const failed = await p.evaluate(() => { const x = document.querySelector('#mini:not([hidden]) .mini-result'); if (!x || x.dataset.seen) return null; x.dataset.seen = '1'; return x.classList.contains('no') ? x.textContent : ''; });
      if (failed) miniFails.push(`day ${st.day}: perfect play → ${failed}`);
    }
    if (st.mini) {
      minis++;
      if (!audited.has('mini')) { audited.add('mini'); await auditButtons('mini'); }
      // 'first'/'last' play perfectly (from the debug answer key) and MUST pass; 'rand' clicks blindly
      const perfect = strategy !== 'rand';
      const r = await p.evaluate((perfect) => {
        const m = document.querySelector('#mini'), dbg = window.__miniDebug;
        const opts = [...m.querySelectorAll('.mini-opt')];
        if (perfect && dbg) {
          if (dbg.type === 'quiz') { const b = opts[dbg.answer[0]]; if (b && !b.disabled) b.click(); return 'quiz'; }
          for (const k of dbg.answer) { const b = m.querySelector(`.mini-opt[data-k="${k}"]`); if (b && !b.classList.contains('on')) b.click(); }
          const go = m.querySelector('.mini-go'); if (go) go.click();
          return dbg.type;
        }
        const go = m.querySelector('.mini-go'), cnt = m.querySelector('.mini-count');
        if (go && cnt) { const [, a, n] = cnt.textContent.match(/(\d+)\/(\d+)/) || []; if (a && +a >= +n) { go.click(); return 'go'; } }
        const opt = opts.find((x) => !x.disabled && !x.classList.contains('on'));
        if (opt) opt.click();
        return 'blind';
      }, perfect);
      await p.waitForTimeout(r === 'quiz' ? 550 : 250);
      if (perfect && r !== 'quiz') {
        await p.waitForSelector('#mini .mini-result', { timeout: 3000 }).catch(() => {});
        const res = await p.evaluate(() => { const x = document.querySelector('#mini .mini-result'); return x ? x.className + ' ' + x.textContent : 'none'; });
        if (!/ ok /.test(' ' + res + ' ') && !/mini-result ok/.test(res)) miniFails.push(`day ${st.day}: perfect ${r} → ${res}`);
        await p.waitForTimeout(1900);
      }
      continue;
    }
    if (st.ov && st.btn) {
      if (!audited.has(st.btn)) { audited.add(st.btn); await auditButtons('overlay ' + st.btn); await p.screenshot({ path: `${OUT}/career_${company}${process.env.MOBILE ? '_m' : ''}_${st.btn.replace('#', '')}.png` }); }
      if (st.btn === '#toCompanies') { ended = true; break; }
      if (st.btn === 'life') { lifes++; await p.evaluate((k) => { const bs = document.querySelectorAll('#ovCard .life-choices [data-i]'); bs[k % bs.length].click(); }, pickIdx(2)); await p.waitForTimeout(120); continue; }
      if (st.btn === '#payOk') payslips++;
      if (st.btn === '#wkOk') weekends++;
      if (st.btn === '#goDay' || st.btn === '#quickDay') {
        if (st.day > maxDay) break;
        const quick = quickArg === 'all' || (quickArg === 'routine' && st.btn === '#quickDay');
        const sel = quick && (await p.$('#ovCard #quickDay')) ? '#quickDay' : '#goDay';
        await p.evaluate((s) => document.querySelector('#ovCard ' + s).click(), sel);
      } else await p.evaluate((s) => document.querySelector('#ovCard ' + s).click(), st.btn);
      await p.waitForTimeout(180); continue;
    }
    if (st.mode === 'dialog') {
      if (st.review) reviews += 0;
      if (st.ch) { const k = pickIdx(st.ch); await p.evaluate((k) => document.querySelectorAll('#choices button')[k].click(), k); choices++; }
      else { await p.keyboard.press('Space'); await p.keyboard.press('Space'); }
      continue;
    }
    if (st.mode === 'ringing') { await auditButtons('incoming call'); await p.evaluate(() => document.querySelector('#incAccept').click()); continue; }
    if (st.mode === 'pause') { await p.evaluate(() => document.querySelector('#resumeBtn').click()); continue; }
    if (st.mode === 'play' && doTasks && st.task) { await press(st.task.npc ? 'npc' : 'obj', st.task.npc || st.task.obj); continue; }
    if (st.mode === 'play' && st.who && st.who.startsWith('call:')) { await p.waitForTimeout(400); continue; }
    if (st.mode === 'play' && st.who) {
      if (!audited.has('play')) { audited.add('play'); await auditButtons('play HUD'); }
      await p.evaluate(() => window.__tm.place(true));
      const ok = await press(st.who.startsWith('obj:') ? 'obj' : 'npc', st.who.replace('obj:', ''));
      if (!ok && ++stuck > 6) { console.log('STUCK at day', st.day, 'step', st.step, st.who); break; }
      continue;
    }
    await p.waitForTimeout(100);
  }
  const res = await p.evaluate(() => {
    const prof = JSON.parse(localStorage.getItem('tm_profile_v1'));
    const r = Object.values(prof.runs)[0];
    return { company: r.company, tier: r.tier, status: r.status, day: r.day, ended: r.ended, st: r.st, money: r.money, reviews: (r.reviews || []).map((x) => x.grade).join(''), payslips: (r.payslips || []).map((x) => x.net), flags: Object.keys(r.flags).filter((k) => r.flags[k] === true).slice(0, 30) };
  });
  console.log(`${company} ${tierId} ${strategy} quick=${quickArg} → days=${days.size} choices=${choices} minis=${minis} lifeEvents=${lifes} weekends=${weekends} payOk=${payslips} ended=${ended}`);
  console.log(JSON.stringify(res));
  if (miniFails.length) console.log('MINI-GAME FAILS WITH PERFECT ANSWERS:\n  ' + miniFails.join('\n  '));
  if (occluded.size) console.log('OCCLUDED BUTTONS:\n  ' + [...occluded].join('\n  '));
  console.log('errors:', errs.slice(0, 10));
  await p.screenshot({ path: `${OUT}/career_${company}_end.png` }).catch(() => {});
  await b.close();
  const ok = !errs.length && !occluded.size && !miniFails.length && res.company === company && res.tier === tierId && (maxDay < 45 || ended) && stuck <= 6;
  process.exit(ok ? 0 : 1);
})();
