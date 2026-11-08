// Khu phố T&M · play the main story like a player who only follows the HUD ("📌 Việc chính"): walk to the place it
// points at, press E, read the scene and pick a choice; when the beat asks for an action (work, eat, sleep, tạm trú,
// furniture, Xóm Ơi, hồ sơ, xe ôm), do it the normal way. Dramas met on the way are played too.
// Asserts: no JS errors, the HUD always has a story objective with a reachable door, no beat stuck for more than
// 3 game days, chapters advance, scenes render with clickable choices.
// Usage: (cd site && python3 -m http.server 8765) & node tests/e2e/kp-story.cjs [chapters=2] [maxDays=20]   env: BASE_URL, SHOTS, MOBILE=1
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const CHAPTERS = Number(process.argv[2] || 2);
const MAX_DAYS = Number(process.argv[3] || 20);
const OUT = process.env.SHOTS || null;

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = process.env.MOBILE ? await b.newContext({ ...devices['iPhone 13'] }) : await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errors = [], problems = [], log = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|supabase|ERR_|net::/i.test(m.text())) errors.push('console: ' + m.text()); });
  const shot = async (n) => { if (OUT) await p.screenshot({ path: `${OUT}/story_${process.env.MOBILE ? 'm_' : ''}${n}.png` }); };
  await p.goto(BASE + '?kp=1&open=kp&debug=1', { waitUntil: 'networkidle' });
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('tts_letter_v1', '1'); window.__kpShiftSecs = 30; });
  await p.reload({ waitUntil: 'networkidle' });
  await p.evaluate(() => { window.__kpShiftSecs = 30; });
  await p.waitForFunction(() => window.__kp && document.querySelector('#kpOverlay:not([hidden]) #kpGo'));
  await p.fill('#kpName', 'Thảo'); await p.click('#kpGo');
  await p.waitForFunction(() => window.__kp.mode !== 'menu');
  await p.waitForTimeout(600);

  const S = () => p.evaluate(() => {
    const k = window.__kp, kp = k.kp, q = (s) => document.querySelector(s);
    return { mode: k.mode, where: k.where, day: kp.time.day, min: kp.time.min, money: kp.player.money, beat: k.story.beat(), obj: !q('#kpObj').hidden && q('#kpObj').innerText,
      scene: !!q('#kpOverlay:not([hidden]) #kpSceneLog'), ov: !q('#kpOverlay').hidden, chapters: (kp.story.chDone || []).length, tamTru: kp.player.tamTru,
      dramas: { active: kp.dramas.active.map((a) => a.id + '@' + a.act), done: kp.dramas.done.length } };
  });
  const doorOf = (place) => ({ phongtro: 'phongtro' }[place] || place);
  async function goTo(place) {
    await p.evaluate((place) => {
      const k = window.__kp; if (k.where !== 'street') k.exit(k.where === 'room' ? 'phongtro' : k.where);
      const d = k.street.doors[place]; k.fp.teleport(d.x, d.z + (d.ry === Math.PI ? 1.0 : -1.0), d.ry === Math.PI ? 0 : Math.PI);
    }, doorOf(place));
    await p.waitForTimeout(350);
    await p.keyboard.press('KeyE'); await p.waitForTimeout(300);
  }
  let scenes = 0, choicesSeen = 0, audited = false;
  async function playOverlay() {
    for (let i = 0; i < 60; i++) {
      const st = await p.evaluate(() => {
        const q = (s) => document.querySelector(s), ov = q('#kpOverlay');
        if (ov.hidden) return 'none';
        if (q('#kpOverlay #kpSceneLog')) return q('#kpOverlay [data-c]') ? 'choices' : 'scene';
        return 'card';
      });
      if (st === 'none') return;
      if (st === 'choices') {
        choicesSeen++;
        if (!audited) {
          audited = true; await shot('scene');
          const bad = await p.evaluate(() => [...document.querySelectorAll('#kpOverlay [data-c]')].filter((b) => { const r = b.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return r.height < 43.5 || (t && !b.contains(t)); }).map((b) => b.textContent.slice(0, 30)));
          bad.forEach((x) => problems.push(`choice not clickable or < 44px: ${x}`));
        }
        await p.locator('#kpOverlay [data-c]').first().click();
      } else if (st === 'scene') { const n = p.locator('#kpOverlay #kpSceneNext'); if (await n.count()) { const t = await n.textContent(); await n.click(); if (/Xong/.test(t)) scenes++; } }
      else {
        // chapter card, door panel, night report, shop panel: take the primary way out
        const did = await p.evaluate(() => {
          const pick = (s) => document.querySelector('#kpOverlay ' + s);
          const b = pick('#kpOk') || pick('[data-kp="next"]') || pick('#kpClose') || pick('[data-kp="close2"]') || pick('[data-kp="close"]') || pick('#kpRes');
          if (b) { b.click(); return true; } return false;
        });
        if (!did) return;
      }
      await p.waitForTimeout(160);
    }
  }
  async function sleepNow() { await p.evaluate(() => { const k = window.__kp; if (k.where !== 'room') { if (k.where !== 'street') k.exit(k.where); k.enter('room'); } }); await p.waitForTimeout(300); await playOverlay(); await p.evaluate(() => window.__kp.sleep()); await p.waitForTimeout(300); await playOverlay(); await p.waitForTimeout(400); await playOverlay(); }
  async function waitUntil(min) { await p.evaluate((m) => { const k = window.__kp; if (k.kp.time.min < m) k.world.advance(k.kp, m - k.kp.time.min, 'idle'); k.kp.player.needs.food = Math.max(k.kp.player.needs.food, 40); }, min); }
  async function shift() {
    await waitUntil(9 * 60 + 5);
    await p.evaluate(() => { const k = window.__kp; if (k.where !== 'street') k.exit(k.where === 'room' ? 'phongtro' : k.where); k.enter('trasua'); });
    await p.waitForTimeout(300); await playOverlay();
    await p.evaluate(() => { window.__kpDebug = null; window.__kp.startShift(); }); await p.waitForTimeout(300);
    if (!(await p.evaluate(() => !!(window.__kpDebug && window.__kpDebug.state)))) { await playOverlay(); return false; }
    for (const el of await p.locator('.kp-list [data-k]').all()) await el.click();
    await p.locator('[data-go]').click();
    for (let i = 0; i < 400; i++) {
      const ph = await p.evaluate(() => { const D = window.__kpDebug; const st = D.state(); if (st.phase !== 'play') return st.phase; for (const t of st.tickets) D.deliver(t.id); for (const pl of st.pearls) if (!pl.cooking && (pl.state == null || pl.age > 420 || pl.grams < 300)) D.cook(pl.kind); for (const c of st.chores) if (c.status === 'open') D.chore(c.id); return 'play'; });
      if (ph !== 'play') break; await p.waitForTimeout(150);
    }
    await p.waitForFunction(() => window.__kpDebug.state().phase === 'close');
    for (const el of await p.locator('.kp-list [data-k]').all()) await el.click();
    await p.locator('[data-go]').click();
    await p.waitForFunction(() => window.__kpDebug.state().phase === 'summary');
    await p.locator('[data-done]').click(); await p.waitForTimeout(300); await playOverlay();
    return true;
  }
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  let lastKey = '', sameSince = 0, steps = 0;
  for (; steps < 400; steps++) {
    await playOverlay();
    const s = await S();
    if (s.chapters >= CHAPTERS || !s.beat) break;
    if (s.day > MAX_DAYS) { problems.push(`story not past chapter ${s.chapters + 1} by day ${MAX_DAYS} (at "${s.beat.task}")`); break; }
    const key = s.beat.id;
    if (key !== lastKey) { lastKey = key; sameSince = s.day; log.push(`d${s.day} ${String(Math.floor(s.min / 60)).padStart(2, '0')}h · ${s.beat.chapter} · ${s.beat.task}${s.beat.need ? ' [' + s.beat.need.type + ']' : ''}`); }
    else if (s.day - sameSince > 3) { problems.push(`stuck on "${s.beat.task}" since day ${sameSince}`); break; }
    if (!s.obj || !/Việc chính|📌/.test(s.obj + '📌')) problems.push(`day ${s.day}: HUD shows no objective`);
    if (steps === 2) await shot('hud');
    const bt = s.beat;
    // time window for the scene
    if (bt.scene && !bt.seen && (bt.from || bt.minDay)) {
      if (bt.minDay && s.day < bt.minDay) { await sleepNow(); continue; }
      if (bt.from && s.min < toMin(bt.from)) { await waitUntil(toMin(bt.from) + 1); continue; }
      if (bt.to && s.min > toMin(bt.to)) { await sleepNow(); continue; }
    }
    if (bt.scene && !bt.seen) {
      await goTo(bt.where);
      if (bt.where === 'phongtro' || bt.where === 'trasua') await p.waitForTimeout(500);
      const st2 = await S();
      if (!st2.ov) { // the door led inside (room / tea shop) or opened nothing: try the scene directly
        const played = await p.evaluate((w) => window.__kp.story.playScenes(w), bt.where);
        if (!played) { problems.push(`day ${s.day}: no scene for "${bt.task}" at ${bt.where} (${Math.floor(s.min / 60)}h)`); await sleepNow(); }
      }
      await playOverlay();
      continue;
    }
    const need = bt.need || {};
    switch (need.type) {
      case 'tamtru': await goTo('congan'); await playOverlay(); await goTo('congan'); { const t = p.locator('#kpOverlay #kpTamTru'); if (await t.count()) await t.click(); } await playOverlay(); break;
      case 'work': case 'shift': case 'office': if (!(await shift())) await sleepNow(); break;
      case 'eat': await waitUntil(7 * 60); await goTo('banhmi'); await playOverlay(); await goTo('banhmi'); { const f = p.locator('#kpOverlay [data-food]').first(); if (await f.count()) await f.click(); } await playOverlay(); break;
      case 'furniture': await waitUntil(9 * 60); await p.evaluate(() => { window.__kp.kp.player.money += 300000; window.__kp.openFurniture(); }); await p.waitForTimeout(200); {
        const where = await p.evaluate(() => { const bt = document.querySelector('#kpOverlay [data-buy]'); if (!bt) return null; const r = bt.getBoundingClientRect(), ov = document.querySelector('#kpOverlay'); return { top: Math.round(r.top), h: Math.round(r.height), vh: innerHeight, ovTop: Math.round(ov.getBoundingClientRect().top), ovScroll: ov.scrollTop, kids: ov.children.length, first: ov.firstElementChild && ov.firstElementChild.className }; });
        if (where && (where.top < 0 || where.top + where.h > where.vh)) { problems.push('furniture buy button off screen: ' + JSON.stringify(where)); await shot('noithat_offscreen'); }
        await p.evaluate(() => { const bt = document.querySelector('#kpOverlay [data-buy]'); if (bt) bt.click(); });
      } await playOverlay(); break;
      case 'sleep': case 'day': case 'drama': case 'money': case 'cozy': await sleepNow(); break;
      case 'xomoi': await p.evaluate(() => window.__kp.story.openXomoi()); await p.waitForTimeout(200); await playOverlay(); break;
      case 'profile': await p.evaluate(() => window.__kp.story.openProfile()); await p.waitForTimeout(200); await playOverlay(); break;
      case 'ride': await p.evaluate(() => { window.__kp.kp.player.money += 20000; window.__kp.story.rideMenu(); }); await p.waitForTimeout(200); await p.locator('#kpOverlay [data-go]').first().click(); await playOverlay(); break;
      case 'visit': await goTo(bt.where); await playOverlay(); break;
      default: problems.push(`unknown beat shape "${bt.task}"`); await sleepNow();
    }
    if (need.type === 'cozy') await p.evaluate(() => { window.__kp.kp.player.money += 2000000; });
    if (need.type === 'money') await p.evaluate((v) => { window.__kp.kp.player.money = Math.max(window.__kp.kp.player.money, v); }, need.atLeast || 0);
    // keep the bot alive: a real player eats
    await p.evaluate(() => { const n = window.__kp.kp.player.needs; n.food = Math.max(n.food, 35); });
  }
  const end = await S();
  await shot('end');
  console.log(log.join('\n'));
  console.log('RESULT', JSON.stringify({ day: end.day, chapters: end.chapters, beat: end.beat && end.beat.task, scenes, choicesSeen, dramas: end.dramas }));
  if (end.chapters < CHAPTERS && end.beat) problems.push(`only ${end.chapters} chapters done`);
  if (scenes < 3) problems.push(`only ${scenes} scenes played`);
  console.log('PROBLEMS', problems.length ? '\n  ' + problems.join('\n  ') : 'none');
  console.log('errors:', JSON.stringify(errors.slice(0, 10)));
  await b.close();
  process.exit(problems.length || errors.length ? 1 : 0);
})();
