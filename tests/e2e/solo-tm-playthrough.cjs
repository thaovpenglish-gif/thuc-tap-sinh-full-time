// Headless playthrough of the T&M Solo (Buổi đầu tiên + Ngày 1). Usage: (cd site && python3 -m http.server 8765) then
// node tests/e2e/solo-tm-playthrough.cjs <tier t0|t1|t3|t5> <first|last|rand> [tasks]
// Prints the saved run, any JS errors, and exits 1 on errors / stuck.
const { chromium } = require('playwright');
const tierId = process.argv[2] || 't1';
const strategy = process.argv[3] || 'first';
const doTasks = process.argv[4] === 'tasks';
const TIERS = ['t0', 't1', 't3', 't5'];

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 760 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|supabase|ERR_/i.test(m.text())) errs.push(m.text()); });
  await p.goto(process.env.BASE_URL || 'http://localhost:8765/', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.evaluate(() => document.querySelector('#soloBtn').click());
  await p.waitForFunction(() => window.__tm && !document.querySelector('#soloMenu').hidden, null, { timeout: 20000 });
  await p.fill('#soloName', 'Bot' + tierId);
  await p.evaluate(() => document.querySelector('#soloNew').click());

  let rnd = 7, choices = 0, minis = 0, stuck = 0, daysDone = 0, tasksVisited = 0;
  const pickIdx = (n) => { if (strategy === 'last') return n - 1; if (strategy === 'rand') { rnd = (rnd * 16807) % 2147483647; return rnd % n; } return 0; };
  const approach = async (kind, id, side) => p.evaluate(([kind, id, side]) => {
    const t = window.__tm;
    const tp = kind === 'obj' ? t.world.interactables.find((x) => x.id === id).pos : t.npcs[id].mesh.position;
    if (side === 0) { t.fp.player.pos.set(tp.x, t.fp.player.eye, tp.z + 1.1); t.fp.player.yaw = 0; }
    else { t.fp.player.pos.set(tp.x, t.fp.player.eye, tp.z - 1.0); t.fp.player.yaw = Math.PI; }
    t.fp.player.pitch = 0;
  }, [kind, id, side]);

  for (let iter = 0; iter < 4000; iter++) {
    const st = await p.evaluate(() => {
      const t = window.__tm, s = t.currentStep();
      const R = t.R;
      const openTask = R && R.tasks.find((x) => x.status === 'open');
      return {
        mode: t.mode, ov: !document.querySelector('#overlay').hidden,
        sal: !!document.querySelector('#salary') && !document.querySelector('#salary').hidden,
        mini: !!document.querySelector('#mini') && !document.querySelector('#mini').hidden && !document.querySelector('#mini .mini-result'),
        menu: !document.querySelector('#soloMenu').hidden,
        ch: document.querySelectorAll('#choices button').length,
        who: s ? s.who : null, day: R && R.day,
        task: openTask ? openTask.legs[openTask.leg] : null,
      };
    });
    if (st.menu) break;
    if (st.sal) {
      const k = TIERS.indexOf(tierId);
      await p.evaluate((k) => { const c = document.querySelectorAll('.sal-card')[k]; c.click(); c.click(); }, k);
      await p.waitForTimeout(100); continue;
    }
    if (st.mini) {
      minis++;
      await p.evaluate(() => {
        const m = document.querySelector('#mini');
        const opt = [...m.querySelectorAll('.mini-opt')].find((b) => !b.disabled && !b.classList.contains('on'));
        const go = m.querySelector('.mini-go');
        const cnt = m.querySelector('.mini-count');
        if (go && cnt && /(\d+)\/(\d+)/.test(cnt.textContent)) { const [, a, n] = cnt.textContent.match(/(\d+)\/(\d+)/); if (+a >= +n) { go.click(); return; } }
        if (opt) opt.click();
      });
      await p.waitForTimeout(500); continue;
    }
    if (st.ov) {
      const btn = (await p.$('#goDay')) || (await p.$('#nextDay')) || (await p.$('#toMenu'));
      if (btn) { const id = await btn.evaluate((e) => e.id); if (id !== 'goDay') daysDone++; await btn.evaluate((e) => e.click()); await p.waitForTimeout(250); continue; }
    }
    if (st.mode === 'dialog') {
      if (st.ch) { const k = pickIdx(st.ch); await p.evaluate((k) => document.querySelectorAll('#choices button')[k].click(), k); choices++; }
      else { await p.keyboard.press('Space'); await p.keyboard.press('Space'); }
      continue;
    }
    if (st.mode === 'ringing') { await p.evaluate(() => document.querySelector('#incAccept').click()); continue; }
    if (st.mode === 'pause') { await p.evaluate(() => document.querySelector('#resumeBtn').click()); continue; }
    if (st.mode === 'play' && doTasks && st.task) {
      const kind = st.task.npc ? 'npc' : 'obj', id = st.task.npc || st.task.obj;
      await approach(kind, id, 0); await p.waitForTimeout(150); await p.keyboard.press('KeyE'); await p.waitForTimeout(150);
      if ((await p.evaluate(() => window.__tm.mode)) === 'play') { await approach(kind, id, 1); await p.waitForTimeout(150); await p.keyboard.press('KeyE'); await p.waitForTimeout(150); }
      tasksVisited++;
      continue;
    }
    if (st.mode === 'play' && st.who && st.who.startsWith('call:')) { await p.waitForTimeout(400); continue; }
    if (st.mode === 'play' && st.who) {
      const kind = st.who.startsWith('obj:') ? 'obj' : 'npc', id = st.who.replace('obj:', '');
      // let NPCs walk to their spots first
      await p.evaluate(() => window.__tm.place(true));
      await approach(kind, id, 0); await p.waitForTimeout(150); await p.keyboard.press('KeyE'); await p.waitForTimeout(150);
      if ((await p.evaluate(() => window.__tm.mode)) === 'play') {
        await approach(kind, id, 1); await p.waitForTimeout(150); await p.keyboard.press('KeyE'); await p.waitForTimeout(150);
        if ((await p.evaluate(() => window.__tm.mode)) === 'play') {
          const prompt = await p.evaluate(() => document.querySelector('#promptText').textContent);
          if (++stuck > 4) { console.log('STUCK at day', st.day, st.who, 'prompt:', prompt); break; }
        }
      }
      continue;
    }
    await p.waitForTimeout(100);
  }
  const res = await p.evaluate(() => {
    const prof = JSON.parse(localStorage.getItem('tm_profile_v1'));
    const r = Object.values(prof.runs)[0];
    return { tier: r.tier, level: r.level, day: r.day, step: r.step, st: r.st, flags: Object.keys(r.flags).filter((k) => r.flags[k]), rel: r.rel, chat: r.chat.length, menuRows: document.querySelectorAll('.run-row').length, label: document.querySelector('.run-row small') && document.querySelector('.run-row small').textContent };
  });
  console.log(tierId, strategy, doTasks ? 'tasks' : '', `choices=${choices} minis=${minis} daysDone=${daysDone} taskVisits=${tasksVisited}`);
  console.log(JSON.stringify(res));
  await p.screenshot({ path: `/tmp/claude-0/solo_${tierId}_${strategy}.png` }).catch(() => {});
  console.log('errors:', errs.slice(0, 8));
  await b.close();
  const ok = !errs.length && res.tier === tierId && res.day === 2 && daysDone === 2;
  process.exit(ok ? 0 : 1);
})();
