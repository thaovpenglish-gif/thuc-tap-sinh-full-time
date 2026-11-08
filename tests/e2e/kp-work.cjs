// Khu phố T&M · going to work at a company (the 7 Solo companies live in the neighbourhood).
// Morning in the room → walk to the company door → E → "Ứng tuyển" → the interview plays in Solo (same page, bridge) →
// back on the street at closing time with the day logged → sleep → next morning "Vào làm" → a full Solo workday →
// back again: wallet +1 day of pay, hồ sơ cá nhân +1 day at that company.
// Usage: (cd site && python3 -m http.server 8765) & node tests/e2e/kp-work.cjs [company=tm] [tier=t1]   env: BASE_URL, MOBILE=1
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const CO = process.argv[2] || 'tm';
const TIER = process.argv[3] || 't1';
const TIERS = ['t0', 't1', 't3', 't5'];
const PLACE = { tm: 'toanha', tech: 'toanha', audit: 'toanha', bama: 'bama', agency: 'agency', event: 'event', hr: 'chungcu' };

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = process.env.MOBILE ? await b.newContext({ ...devices['iPhone 13'] }) : await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errors = [], problems = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|supabase|ERR_|net::/i.test(m.text())) errors.push('console: ' + m.text()); });
  const kpState = () => p.evaluate(() => { const k = window.__kp && window.__kp.kp; if (!k) return null; const e = (k.profile.entries || []).find((x) => x.kind === 'company'); return { day: k.time.day, min: k.time.min, money: k.player.money, where: window.__kp.where, mode: window.__kp.mode, work: k.work, officeDay: k.flags.officeDay, entry: e && { placeId: e.placeId, days: e.daysWorked, earned: e.earned, role: e.role } }; });

  await p.goto(BASE + '?kp=1&open=kp&debug=1', { waitUntil: 'networkidle' });
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('tts_letter_v1', '1'); });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__kp && document.querySelector('#kpOverlay:not([hidden]) #kpGo'));
  await p.fill('#kpName', 'Thảo'); await p.click('#kpGo');
  await p.waitForFunction(() => window.__kp.mode === 'play' && window.__kp.where === 'room');

  // drive one Solo day (interview or workday) until the page goes back to the neighbourhood
  async function playSoloDay(label) {
    await p.waitForFunction(() => window.__tm && window.__tm.R, null, { timeout: 30000 });
    let stuck = 0;
    for (let i = 0; i < 4000; i++) {
      if (await p.evaluate(() => !!window.__kp).catch(() => false)) return true;
      const st = await p.evaluate(() => {
        const t = window.__tm; if (!t) return { gone: true };
        const R = t.R, s = R ? t.currentStep() : null, q = (sel) => document.querySelector(sel);
        return {
          mode: t.mode, sal: q('#salary') && !q('#salary').hidden,
          mini: q('#mini') && !q('#mini').hidden && !q('#mini .mini-result'),
          ch: document.querySelectorAll('#choices button').length,
          btn: ['#toKp', '#payOk', '#rentOk', '#brokeOk', '#lifeOk', '#wkOk', '#nextCard', '#quickDay', '#goDay'].find((x) => q('#ovCard ' + x)) || (q('#ovCard .life-choices [data-i]') ? 'life' : null),
          ov: !q('#overlay').hidden, who: s ? s.who : null, deskPick: q('#deskPick') && !q('#deskPick').hidden,
        };
      }).catch(() => ({ gone: true }));
      if (st.gone) { await p.waitForTimeout(400); continue; }
      if (st.deskPick) { await p.evaluate(() => document.querySelector('#deskPick [data-any]').click()); continue; }
      if (st.sal) { await p.evaluate((k) => { const c = document.querySelectorAll('.sal-card')[k]; c.click(); c.click(); }, TIERS.indexOf(TIER)); await p.waitForTimeout(100); continue; }
      if (st.mini) {
        await p.evaluate(() => {
          const m = document.querySelector('#mini'), dbg = window.__miniDebug; if (!dbg) return;
          if (dbg.type === 'quiz') { const bb = m.querySelectorAll('.mini-opt')[dbg.answer[0]]; if (bb && !bb.disabled) bb.click(); return; }
          if (dbg.type === 'action') { dbg.win(); return; }
          if (dbg.type === 'sort') { const bb = m.querySelector(`.mini-bin[data-b="${dbg.answer[0]}"]`); if (bb && !bb.disabled) bb.click(); return; }
          for (const k of dbg.answer) { const bb = m.querySelector(`.mini-opt[data-k="${k}"]`); if (bb && !bb.classList.contains('on')) bb.click(); }
          const go = m.querySelector('.mini-go'); if (go) go.click();
        });
        await p.waitForTimeout(2200); continue;
      }
      if (st.ov && st.btn) {
        if (st.btn === 'life') await p.evaluate(() => document.querySelector('#ovCard .life-choices [data-i]').click());
        else await p.evaluate((s) => { const el = document.querySelector('#ovCard ' + (s === '#goDay' && document.querySelector('#ovCard #quickDay') ? '#quickDay' : s)); el.click(); }, st.btn);
        await p.waitForTimeout(250); continue;
      }
      if (st.mode === 'dialog') { if (st.ch) await p.evaluate(() => document.querySelectorAll('#choices button')[0].click()); else { await p.keyboard.press('Space'); await p.keyboard.press('Space'); } continue; }
      if (st.mode === 'ringing') { await p.evaluate(() => document.querySelector('#incAccept').click()); continue; }
      if (st.mode === 'pause') { await p.evaluate(() => document.querySelector('#resumeBtn').click()); continue; }
      if (st.mode === 'play' && st.who && !st.who.startsWith('call:')) {
        const ok = await p.evaluate((who) => {
          const t = window.__tm; t.place(true);
          const tp = who.startsWith('obj:') ? (t.world.interactables.find((x) => 'obj:' + x.id === who) || {}).pos : t.npcs[who] && t.npcs[who].mesh.position;
          if (!tp) return false; t.fp.player.pos.set(tp.x, t.fp.player.eye, tp.z + 1.1); t.fp.player.yaw = 0; t.fp.player.pitch = 0; return true;
        }, st.who);
        await p.waitForTimeout(150); await p.keyboard.press('KeyE'); await p.waitForTimeout(150);
        if (!ok && ++stuck > 8) { problems.push(`${label}: stuck at ${st.who}`); return false; }
        continue;
      }
      await p.waitForTimeout(120);
    }
    problems.push(`${label}: never came back to the neighbourhood`);
    return false;
  }

  async function goToWork(label, expectBtn) {
    // walk up to the company door and press E
    await p.evaluate((place) => { const k = window.__kp; if (k.where !== 'street') k.exit('phongtro'); const d = k.street.doors[place]; k.fp.teleport(d.x, d.z + (d.ry === Math.PI ? 1.0 : -1.0), d.ry === Math.PI ? 0 : Math.PI); }, PLACE[CO]);
    await p.waitForTimeout(500);
    await p.keyboard.press('KeyE'); await p.waitForTimeout(250);
    const btn = await p.$(`#kpOverlay [data-work="${CO}"]`);
    if (!btn) { problems.push(`${label}: no work button at the ${PLACE[CO]} door`); return false; }
    const txt = (await btn.textContent()).trim();
    if (!new RegExp(expectBtn).test(txt)) problems.push(`${label}: work button says "${txt}", expected ${expectBtn}`);
    await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle' }), btn.click()]);
    return playSoloDay(label);
  }
  async function backOnStreet(label) {
    await p.waitForFunction(() => window.__kp && window.__kp.mode === 'overlay' && document.querySelector('#kpOverlay #kpOk'), null, { timeout: 20000 })
      .catch(() => problems.push(`${label}: no "Tan làm" card after coming back`));
    const card = await p.evaluate(() => (document.querySelector('#kpOverlay') || {}).innerText || '');
    await p.click('#kpOverlay #kpOk').catch(() => {});
    await p.waitForTimeout(200);
    return { card, s: await kpState() };
  }

  // morning of day 1 (Monday): go before office hours end, apply → interview
  await p.evaluate(() => { const k = window.__kp; k.world.advance(k.kp, 8 * 60 + 10 - k.kp.time.min, 'idle'); });
  const m0 = (await kpState()).money;
  await goToWork('interview', 'Ứng tuyển');
  const a = await backOnStreet('interview');
  console.log('after interview:', JSON.stringify(a.s));
  if (!/phỏng vấn/i.test(a.card)) problems.push(`interview card: "${a.card.slice(0, 80)}"`);
  if (a.s.work) problems.push('kp.work not cleared after the interview');
  if (!(a.s.min >= 17 * 60)) problems.push(`clock did not move to closing time (${a.s.min})`);
  if (a.s.where !== 'street') problems.push('not back on the street');
  // same day again: refused
  await p.evaluate((place) => { const k = window.__kp; const d = k.street.doors[place]; k.fp.teleport(d.x, d.z + (d.ry === Math.PI ? 1.0 : -1.0), d.ry === Math.PI ? 0 : Math.PI); }, PLACE[CO]);
  // sleep, next morning: work for real
  await p.evaluate(() => { window.__kp.enter('room'); window.__kp.sleep(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => { const b = [...document.querySelectorAll('#kpOverlay button')].pop(); if (b) b.click(); });
  await p.waitForFunction(() => window.__kp.mode === 'play');
  await p.evaluate(() => { const k = window.__kp; k.world.advance(k.kp, Math.max(0, 8 * 60 + 15 - k.kp.time.min), 'idle'); });
  const m1 = (await kpState()).money;
  await goToWork('workday', 'Vào làm');
  const w = await backOnStreet('workday');
  console.log('after workday:', JSON.stringify(w.s));
  if (!/Tan làm/i.test(w.card)) problems.push(`workday card: "${w.card.slice(0, 80)}"`);
  if (!w.s.entry || w.s.entry.days < 1 || w.s.entry.placeId !== CO) problems.push(`hồ sơ has no company day: ${JSON.stringify(w.s.entry)}`);
  if (TIER !== 't0' && !(w.s.money > m1 - 5000)) problems.push(`no pay for the workday (${m1} → ${w.s.money})`);
  // a second visit the same day is refused
  await p.evaluate((place) => { const k = window.__kp; const d = k.street.doors[place]; k.fp.teleport(d.x, d.z + (d.ry === Math.PI ? 1.0 : -1.0), d.ry === Math.PI ? 0 : Math.PI); }, PLACE[CO]);
  await p.waitForTimeout(400); await p.keyboard.press('KeyE'); await p.waitForTimeout(250);
  const again = await p.$(`#kpOverlay [data-work="${CO}"]`);
  if (again) { await again.click(); await p.waitForTimeout(300); if (await p.evaluate(() => !!window.__tm && !window.__kp)) problems.push('went to work twice in one day'); }
  console.log('money', m0, '→', w.s.money);
  console.log('PROBLEMS', problems.length ? '\n  ' + problems.join('\n  ') : 'none');
  console.log('errors:', JSON.stringify(errors.slice(0, 10)));
  await b.close();
  process.exit(problems.length || errors.length ? 1 : 0);
})();
