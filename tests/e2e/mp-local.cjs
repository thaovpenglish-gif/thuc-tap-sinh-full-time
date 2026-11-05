// E2E for Overdeadline & Overburnout: two players in one browser (net=local → BroadcastChannel, no network).
// Needs a server on port 8765:  cd site && python3 -m http.server 8765
// Usage: node tests/e2e/mp-local.cjs [screenshotDir]
const { chromium } = require('playwright');
const BASE = 'http://localhost:8765/';
const SHOTS = process.argv[2] || null;
const assert = (c, m) => { if (!c) throw new Error('ASSERT: ' + m); };

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  const errs = [];
  const watch = (p, tag) => {
    p.on('pageerror', (e) => errs.push(`${tag} pageerror ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(`${tag} console ${m.text()}`); });
  };
  const shot = async (p, name) => { if (SHOTS) await p.screenshot({ path: `${SHOTS}/${name}.png` }); };

  // --- host creates a room
  const A = await ctx.newPage(); watch(A, 'A');
  await A.goto(BASE + '?mp=1&net=local', { waitUntil: 'networkidle' });
  await A.click('[data-soon="mp"]');
  await A.fill('#mpName', 'Host');
  await A.click('#mpCreate');
  await A.waitForSelector('#mpCodeShow');
  const code = (await A.textContent('#mpCodeShow')).trim();
  assert(/^[A-Z0-9]{5}$/.test(code), 'room code ' + code);

  // --- guest opens the invite link
  const B = await ctx.newPage(); watch(B, 'B');
  // same browser = same storage: forget the host's saved name so the invite shows the name field
  await B.addInitScript(() => { try { localStorage.removeItem('mp_name'); localStorage.removeItem('tts_name'); } catch {} });
  await B.goto(`${BASE}?mp=1&net=local&room=${code}`, { waitUntil: 'networkidle' });
  await B.waitForSelector('#mpName');
  assert((await B.inputValue('#mpCode')) === code, 'invite link fills the code');
  await B.fill('#mpName', 'Guest');
  await B.click('#mpJoin');
  await B.waitForSelector('#mpCodeShow', { timeout: 6000 });
  await A.waitForFunction(() => document.querySelectorAll('#mpScreen .mp-member:not(.empty)').length === 2, null, { timeout: 6000 });
  await shot(A, 'mp-room');

  // --- start
  await A.click('#mpStart');
  await B.waitForFunction(() => window.__mp && window.__mp.mode === 'play' && window.__mp.game, null, { timeout: 6000 });
  await A.waitForTimeout(4200); // countdown
  const players = await A.evaluate(() => Object.keys(window.__mp.game.players).length);
  assert(players === 2, 'two players in the host game');

  // --- the guest takes a brief, works it on a laptop, delivers a slide
  const at = (p, x, z) => p.evaluate(([x, z]) => { window.__mp.me.x = x; window.__mp.me.z = z; }, [x, z]);
  const use = (p) => p.evaluate(() => window.__mp.useAction());
  const hostSees = (fn) => A.waitForFunction(fn, null, { timeout: 6000 });

  await at(B, -6.2, -3.3); await B.waitForTimeout(400); await use(B);
  await hostSees(() => { const g = window.__mp.game; const p = Object.values(g.players).find((q) => q.name === 'Guest'); return p && p.held && g.items[p.held].type === 'brief'; });
  await at(B, -2.8, -3.3); await B.waitForTimeout(400); await use(B); await B.waitForTimeout(300); await use(B);
  await hostSees(() => window.__mp.game.stations.lap1.progress > 0);
  await shot(B, 'mp-guest-working');
  await hostSees(() => { const g = window.__mp.game; return g.stations.lap1.item && g.items[g.stations.lap1.item].type === 'slide'; });
  await use(B); // pick up the slide
  // make sure a slide order is open, then deliver
  await A.evaluate(() => { const g = window.__mp.game; if (!g.orders.some((o) => o.recipe === 'slide')) g.orders.push({ id: 999, recipe: 'slide', t: 50, total: 55 }); });
  await at(B, 2.6, 3.3); await B.waitForTimeout(400); await use(B);
  await hostSees(() => window.__mp.game.done >= 1);
  await B.waitForFunction(() => window.__mp.game.done >= 1, null, { timeout: 4000 });
  const money = await B.evaluate(() => window.__mp.game.money);
  assert(money >= 30, 'money reached the guest view: ' + money);

  // --- the host sees the guest walking (position broadcast)
  await at(B, 0, 2.5); await B.waitForTimeout(700);
  const gp = await A.evaluate(() => { const g = window.__mp.game; const p = Object.values(g.players).find((q) => q.name === 'Guest'); return [p.x, p.z]; });
  assert(Math.abs(gp[0]) < 0.2 && Math.abs(gp[1] - 2.5) < 0.2, 'host sees guest position ' + gp);
  await shot(A, 'mp-host-view');

  // --- fast-forward to the end: results on both screens
  await A.evaluate(() => { window.__mp.game.time = 0.3; });
  // (Playwright polls with animation frames, which pause in a background tab: bring each page forward first)
  await A.waitForSelector('.mp-stars', { timeout: 6000 });
  await B.bringToFront(); await B.waitForSelector('.mp-stars', { timeout: 6000 });
  await shot(B, 'mp-results');

  // --- play again: the guest follows the host back into a new game
  await A.bringToFront(); await A.click('#mpAgain');
  await B.bringToFront();
  await B.waitForFunction(() => window.__mp.game && window.__mp.game.phase === 'play' && window.__mp.game.done === 0 && !document.querySelector('#mpScreen:not([hidden])'), null, { timeout: 6000 });

  // --- host leaves: the guest is told
  await A.close();
  await B.waitForFunction(() => /Host đã rời phòng/.test(document.body.innerText), null, { timeout: 8000 });

  if (errs.length) { console.log(errs.join('\n')); process.exitCode = 1; }
  else console.log('mp-local e2e OK · room', code);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
