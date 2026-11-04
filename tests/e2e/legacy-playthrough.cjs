// Headless playthrough of the hidden legacy story. Usage: (cd site && python3 -m http.server 8765) then
// node tests/e2e/legacy-playthrough.cjs first|last|rand|mid   -> prints the ending reached and any JS errors.
const { chromium } = require('playwright');
const strategy = process.argv[2] || 'first';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 760 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto((process.env.BASE_URL || 'http://localhost:8765/') + '?legacy=1', { waitUntil: 'networkidle' });
  await p.evaluate(()=>localStorage.clear());
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.fill('#nameInput', 'Bot' + strategy);
  await p.evaluate(()=>document.querySelector('#startBtn').click());
  let n = 0, choicesMade = 0, rnd = 1;
  for (let iter = 0; iter < 3000; iter++) {
    const st = await p.evaluate(() => ({ mode: window.__tts.mode, ov: !document.querySelector('#overlay').hidden, ch: document.querySelectorAll('#choices button').length, step: window.__tts.currentStep() ? window.__tts.currentStep().who : null, day: window.__tts.S && window.__tts.S.day }));
    if (st.ov) {
      if (await p.$('#againBtn')) break;
      const btn = (await p.$('#goDay')) || (await p.$('#nextDay'));
      if (btn) { await btn.evaluate(e=>e.click()); await p.waitForTimeout(200); continue; }
    }
    if (st.mode === 'dialog') {
      if (st.ch) {
        let k = 0;
        if (strategy === 'last') k = st.ch - 1;
        else if (strategy === 'rand') { rnd = (rnd * 16807) % 2147483647; k = rnd % st.ch; }
        else if (strategy === 'mid') k = Math.min(1, st.ch - 1);
        await p.evaluate((k)=>document.querySelectorAll('#choices button')[k].click(), k); choicesMade++;
      } else { await p.keyboard.press('Space'); await p.keyboard.press('Space'); }
      continue;
    }
    if (st.mode === 'play' && st.step && st.step.startsWith('call:')) { await p.waitForTimeout(400); continue; }
    if (st.mode === 'play' && st.step) {
      await p.evaluate(() => {
        const t = window.__tts, s = t.currentStep();
        let tp;
        if (s.who.startsWith('obj:')) tp = t.world.interactables.find(x => 'obj:' + x.id === s.who).pos;
        else tp = t.npcs[s.who].target;
        // stand 1.2m away, facing target
        const pl = t.player; pl.pos.set(tp.x + 0.0, 0, tp.z + 1.1);
        pl.face = Math.PI;
      });
      await p.waitForTimeout(150);
      const cur = await p.evaluate(()=>{ const t=window.__tts; return document.querySelector('#promptText').textContent; });
      await p.keyboard.press('KeyE'); n++;
      await p.waitForTimeout(150);
      const m2 = await p.evaluate(()=>window.__tts.mode);
      if (m2 === 'play') {
        // maybe collider pushed us; try directly calling via other side
        await p.evaluate(() => { const t = window.__tts, s = t.currentStep(); let tp = s.who.startsWith('obj:') ? t.world.interactables.find(x => 'obj:' + x.id === s.who).pos : t.npcs[s.who].mesh.position; t.player.pos.set(tp.x, 0, tp.z - 1.0); t.player.face = 0; });
        await p.waitForTimeout(150);
        await p.keyboard.press('KeyE');
        await p.waitForTimeout(150);
        if (await p.evaluate(()=>window.__tts.mode) === 'play') { console.log('STUCK at', st.day, st.step, 'prompt:', cur); break; }
      }
      continue;
    }
    if (st.mode === 'ringing') { await p.waitForTimeout(300); if (strategy==='last' && !global.declined) { global.declined=1; await p.evaluate(()=>document.querySelector('#incDecline').click()); } else await p.evaluate(()=>document.querySelector('#incAccept').click()); continue; }
    if (st.mode === 'play' && st.step && st.step.startsWith('call:')) { await p.waitForTimeout(400); continue; }
    if (st.mode === 'pause') { await p.evaluate(()=>document.querySelector('#resumeBtn').click()); continue; }
    await p.waitForTimeout(100);
  }
  const res = await p.evaluate(() => ({ ending: window.__tts.S.ending, st: window.__tts.S.st, flags: Object.keys(window.__tts.S.flags).filter(k=>window.__tts.S.flags[k]), rel: window.__tts.S.rel, chat: window.__tts.S.chat.length }));
  console.log(strategy, 'choices', choicesMade, JSON.stringify(res));
  await p.screenshot({ path: `/tmp/legacy_end_${strategy}.png` });
  console.log('errors:', errs.slice(0,5));
  await b.close();
})();
