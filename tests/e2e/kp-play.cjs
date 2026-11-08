// Khu phố T&M · whole-loop playthrough (phase 1). A picky player moves in, walks the street, buys a bánh mì at the
// cart (walk up + press E), waits for the milk-tea shop to open, works a full shift (perfect play through the debug
// key), sleeps, reads the night report, reloads the page and checks nothing was lost. Several days in a row.
// Asserts: no JS errors, every visible button in an open overlay is clickable (not covered) and ≥ 44 px,
// money / profile / days worked move the right way, the save survives a reload.
// Usage: (cd site && python3 -m http.server 8765) & node tests/e2e/kp-play.cjs [days=3]   env: BASE_URL, SHOTS, MOBILE=1
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const DAYS = Number(process.argv[2] || 3);
const OUT = process.env.SHOTS || null;
const MOBILE = !!process.env.MOBILE;

const COVER = () => {
  const out = [];
  const root = document.querySelector('#kpOverlay:not([hidden])') || document;
  root.querySelectorAll('button').forEach((el) => {
    if (el.disabled || el.closest('[hidden]')) return;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight) return;
    const x = Math.min(innerWidth - 1, r.left + r.width / 2), y = Math.min(innerHeight - 1, Math.max(0, r.top + Math.min(r.height / 2, 12)));
    const top = document.elementFromPoint(x, y);
    if (top && !el.contains(top)) out.push(`${(el.textContent || el.id).trim().slice(0, 24)} ← ${top.className || top.tagName}`);
    if (Math.min(r.width, r.height) < 43.5) out.push(`${(el.textContent || el.id).trim().slice(0, 24)} small ${Math.round(r.width)}×${Math.round(r.height)}`);
  });
  return out;
};

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext(MOBILE ? { ...devices['iPhone 13'] } : { viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errors = [], problems = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const shot = async (n) => { if (OUT) await p.screenshot({ path: `${OUT}/kp_${MOBILE ? 'm_' : ''}${n}.png` }); };
  const audit = async (where) => { const bad = await p.evaluate(COVER); bad.forEach((x) => problems.push(`${where}: ${x}`)); };
  const state = () => p.evaluate(() => { const k = window.__kp.kp; return k && { day: k.time.day, min: k.time.min, money: k.player.money, needs: k.player.needs, days: (k.profile.entries || []).reduce((a, e) => a + (e.daysWorked || 0), 0), where: window.__kp.where, mode: window.__kp.mode }; });
  const frames = (n = 6) => p.waitForTimeout(n * 60);

  await p.goto(BASE + '?kp=1&open=kp&debug=1', { waitUntil: 'networkidle' });
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('tts_letter_v1', '1'); window.__kpShiftSecs = 40; });
  await p.reload({ waitUntil: 'networkidle' });
  await p.evaluate(() => { window.__kpShiftSecs = 40; });
  await p.waitForFunction(() => window.__kp && document.querySelector('#kpOverlay:not([hidden]) #kpGo'));
  await audit('start'); await shot('start');
  await p.fill('#kpName', 'Thảo');
  await p.click('#kpGo');
  await p.waitForFunction(() => window.__kp.where === 'room' && window.__kp.mode === 'play');
  await audit('room HUD'); await shot('room');
  const s0 = await state();
  console.log('moved in:', JSON.stringify(s0));

  for (let d = 0; d < DAYS; d++) {
    // out of the room → street
    await p.evaluate(() => window.__kp.exit('phongtro'));
    await frames();
    // walk up to the bánh mì cart and press E like a player would
    await p.evaluate(() => { const k = window.__kp, dd = k.street.doors.banhmi; k.fp.player.pos.set(dd.x, k.fp.player.eye, dd.z + 1.0); k.fp.player.yaw = 0; k.fp.player.pitch = 0; });
    await frames(8);
    const prompt = await p.evaluate(() => { const el = document.querySelector('#kpPrompt'); return el && !el.hidden ? el.textContent : null; });
    if (!prompt || !/BÁNH MÌ/i.test(prompt)) problems.push(`day ${d + 1}: no prompt at the bánh mì cart (got ${prompt})`);
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(250);
    const opened = await p.evaluate(() => !!document.querySelector('#kpOverlay:not([hidden]) .kp-card'));
    if (opened) {
      await audit('bánh mì panel'); if (d === 0) await shot('banhmi');
      const before = (await state()).money;
      const food = await p.$('#kpOverlay [data-food]');
      if (food) { await food.click(); await p.waitForTimeout(200); const after = (await state()).money; if (!(after < before)) problems.push(`day ${d + 1}: bánh mì cost nothing (${before} → ${after})`); }
      else { await p.click('#kpClose'); problems.push(`day ${d + 1}: bánh mì cart had nothing to sell (closed at ${(await state()).min}?)`); }
    } else problems.push(`day ${d + 1}: pressing E at the cart opened nothing`);
    // wait for the shop to open (9:00), then walk in
    await p.evaluate(() => { const k = window.__kp; if (k.kp.time.min < 9 * 60 + 5) k.world.advance(k.kp, 9 * 60 + 5 - k.kp.time.min, 'idle'); });
    // day 1: Nội Thất Nhà Mình, buy a rug (walk up + E), it must land in the room
    if (d === 0) {
      await p.evaluate(() => { const k = window.__kp, dd = k.street.doors.noithat; k.fp.player.pos.set(dd.x, k.fp.player.eye, dd.z - 1.0); k.fp.player.yaw = Math.PI; k.fp.player.pitch = 0; });
      await frames(8);
      const fp = await p.evaluate(() => { const el = document.querySelector('#kpPrompt'); return el && !el.hidden ? el.textContent : null; });
      if (!fp || !/NỘI THẤT/i.test(fp)) problems.push(`no prompt at the furniture shop (got ${fp})`);
      await p.keyboard.press('KeyE'); await p.waitForTimeout(250);
      const buy = await p.$('#kpOverlay [data-buy="rug_tron"]');
      if (!buy) problems.push('furniture shop did not open or the rug has no buy button');
      else {
        await audit('furniture shop'); await shot('noithat');
        const m0 = (await state()).money; await buy.click(); await p.waitForTimeout(150);
        const m1 = (await state()).money;
        if (!(m1 < m0)) problems.push(`rug cost nothing (${m0} → ${m1})`);
        const placed = await p.evaluate(() => window.__kp.kp.home && window.__kp.kp.home.placed.rug);
        if (placed !== 'rug_tron') problems.push(`rug not placed (${placed})`);
        await p.click('#kpOverlay [data-kp="close2"]'); await p.waitForTimeout(150);
        if (await p.evaluate(() => !document.querySelector('#kpOverlay').hidden)) problems.push('furniture shop did not close');
      }
    }
    await p.evaluate(() => { const k = window.__kp, dd = k.street.doors.trasua; k.fp.player.pos.set(dd.x, k.fp.player.eye, dd.z + 1.0); k.fp.player.yaw = 0; });
    await frames(8);
    await p.keyboard.press('KeyE');
    await p.waitForFunction(() => window.__kp.where === 'trasua', null, { timeout: 5000 }).catch(() => problems.push(`day ${d + 1}: could not enter the tea shop`));
    if (d === 0) { await frames(); await shot('teashop'); }
    // the bar inside the shop must answer E (interactables live in world coordinates)
    await p.evaluate(() => { const k = window.__kp; k.fp.teleport(300 - 0.5, -0.3, 0); });
    await frames(6);
    const barPrompt = await p.evaluate(() => { const el = document.querySelector('#kpPrompt'); return el && !el.hidden ? el.textContent : null; });
    if (!barPrompt || !/Vào ca/i.test(barPrompt)) problems.push(`day ${d + 1}: no prompt at the tea shop bar (got ${barPrompt})`);
    // start the shift (the bar)
    await p.evaluate(() => { window.__kpDebug = null; });
    await p.evaluate(() => window.__kp.startShift());
    await p.waitForTimeout(300);
    const inShift = await p.evaluate(() => !!(window.__kpDebug && window.__kpDebug.state));
    if (!inShift) {
      const why = await p.evaluate(() => (document.querySelector('#kpOverlay .kp-card') || {}).textContent);
      problems.push(`day ${d + 1}: shift did not start: ${why}`);
      await p.evaluate(() => { const b = document.querySelector('#kpOverlay #kpOk'); if (b) b.click(); });
    } else {
      await audit('shift open'); if (d === 0) await shot('shift_open');
      for (const el of await p.locator('.kp-list [data-k]').all()) await el.click();
      await p.locator('[data-go]').click();
      await p.waitForFunction(() => window.__kpDebug.state().phase === 'play');
      let shotMid = d !== 0;
      for (;;) {
        const s = await p.evaluate(() => {
          const D = window.__kpDebug; if (!D) return { phase: 'gone' };
          const st = D.state(); if (st.phase !== 'play') return st;
          for (const t of st.tickets) D.deliver(t.id);
          for (const pl of st.pearls) if (!pl.cooking && (pl.state == null || pl.age > 7 * 60 || pl.grams < 300)) D.cook(pl.kind);
          for (const c of st.chores) if (c.status === 'open') D.chore(c.id);
          return D.state();
        });
        if (s.phase !== 'play') break;
        if (!shotMid && s.tickets && s.tickets.length) { shotMid = true; await audit('shift mid'); await shot('shift_mid'); }
        await p.waitForTimeout(150);
      }
      await p.waitForFunction(() => window.__kpDebug.state().phase === 'close');
      for (const el of await p.locator('.kp-list [data-k]').all()) await el.click();
      await p.locator('[data-go]').click();
      await p.waitForFunction(() => window.__kpDebug.state().phase === 'summary');
      await audit('shift summary'); if (d === 0) await shot('shift_summary');
      const grade = (await p.locator('.kp-grade').textContent()).trim();
      const before = await state();
      await p.locator('[data-done]').click();
      await p.waitForFunction(() => window.__kp.mode === 'play');
      const after = await state();
      if (!(after.money > before.money)) problems.push(`day ${d + 1}: shift paid nothing (${before.money} → ${after.money})`);
      console.log(`day ${d + 1}: shift grade ${grade}, money ${before.money} → ${after.money}, days worked ${after.days}`);
    }
    // read Xóm Ơi, open the profile
    if (MOBILE) await p.click('#kpXomoi'); else await p.keyboard.press('KeyP'); await p.waitForTimeout(200); await audit('xomoi'); if (d === 0) await shot('xomoi');
    await p.evaluate(() => { const b = [...document.querySelectorAll('#kpOverlay button')].find((x) => /đóng|close|✕|xong/i.test(x.textContent + (x.getAttribute('aria-label') || ''))); if (b) b.click(); });
    await p.waitForTimeout(150);
    if (await p.evaluate(() => !document.querySelector('#kpOverlay').hidden)) problems.push(`day ${d + 1}: Xóm Ơi did not close`);
    if (MOBILE) await p.click('#kpProf'); else await p.keyboard.press('KeyH'); await p.waitForTimeout(200); await audit('profile'); if (d === 0) await shot('profile');
    await p.evaluate(() => { const b = [...document.querySelectorAll('#kpOverlay button')].find((x) => /đóng|close|✕|xong/i.test(x.textContent + (x.getAttribute('aria-label') || ''))); if (b) b.click(); });
    await p.waitForTimeout(150);
    // home and sleep
    await p.evaluate(() => window.__kp.exit('trasua'));
    await p.evaluate(() => window.__kp.enter('room'));
    // walk to the room door and press E: back on the street, then come home again
    await p.evaluate(() => { const k = window.__kp; k.fp.teleport(200 + 0.75, 1.7, Math.PI); });
    await frames(6);
    const doorPrompt = await p.evaluate(() => { const el = document.querySelector('#kpPrompt'); return el && !el.hidden ? el.textContent : null; });
    if (!doorPrompt || !/Ra khu phố/i.test(doorPrompt)) problems.push(`day ${d + 1}: no prompt at the room door (got ${doorPrompt})`);
    await p.keyboard.press('KeyE'); await p.waitForTimeout(200);
    if ((await state()).where !== 'street') problems.push(`day ${d + 1}: E at the room door did not go out`);
    await p.evaluate(() => window.__kp.enter('room'));
    // Esc must only free the mouse, never open a menu
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    if (await p.evaluate(() => !document.querySelector('#kpOverlay').hidden)) problems.push(`day ${d + 1}: Esc opened a panel`);
    if (d === 0) {
      await frames(); await shot('room_decor');
      await p.evaluate(() => window.__kp.openDecor()); await p.waitForTimeout(200); await audit('decor panel'); await shot('decor');
      if (!(await p.$('#kpOverlay [data-off="rug"]'))) problems.push('decor panel does not show the placed rug');
      await p.click('#kpOverlay [data-kp="close2"]'); await p.waitForTimeout(150);
    }
    await p.evaluate(() => window.__kp.sleep());
    await p.waitForTimeout(300);
    await audit('night report'); if (d === 0) await shot('night');
    const nightText = await p.evaluate(() => (document.querySelector('#kpOverlay') || {}).innerText || '');
    if (!/tối nay/i.test(nightText)) problems.push(`day ${d + 1}: night report missing ("${nightText.slice(0, 60)}")`);
    await p.evaluate(() => { const b = [...document.querySelectorAll('#kpOverlay button')].pop(); if (b) b.click(); });
    await p.waitForFunction(() => window.__kp.mode === 'play' && window.__kp.where === 'room', null, { timeout: 5000 }).catch(() => problems.push(`day ${d + 1}: did not wake up in the room`));
    console.log(`slept → ${JSON.stringify(await state())}`);
  }

  // reload: the save must come back exactly
  const beforeReload = await state();
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__kp && document.querySelector('#kpOverlay:not([hidden]) #kpGo'));
  await p.click('#kpGo');
  await p.waitForFunction(() => window.__kp.mode === 'play');
  const afterReload = await state();
  if (afterReload.day !== beforeReload.day || afterReload.money !== beforeReload.money || afterReload.days !== beforeReload.days) problems.push(`reload changed the save: ${JSON.stringify(beforeReload)} → ${JSON.stringify(afterReload)}`);
  if (DAYS && (await p.evaluate(() => (window.__kp.kp.home || {}).placed || {})).rug !== 'rug_tron') problems.push('the rug disappeared after reload');
  const solo = await p.evaluate(() => !!JSON.parse(localStorage.getItem('tm_profile_v1')).runs);
  if (!solo) problems.push('the Solo runs object disappeared from the shared profile');

  console.log('RESULT', JSON.stringify({ days: DAYS, final: afterReload }));
  console.log('PROBLEMS', problems.length ? '\n  ' + problems.join('\n  ') : 'none');
  console.log('errors:', JSON.stringify(errors));
  await b.close();
  process.exit(problems.length || errors.length ? 1 : 0);
})();
