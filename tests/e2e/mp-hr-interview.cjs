// E2E: HR level interview card over the network (net=local, two tabs). Server on port 8765.
// Usage: node tests/e2e/mp-hr-interview.cjs [screenshotDir]
const { chromium } = require('playwright');
const BASE = 'http://localhost:8765/';
const SHOTS = process.argv[2] || null;
const assert = (c, m) => { if (!c) throw new Error('ASSERT: ' + m); };

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  const errs = [];
  const watch = (p, tag) => p.on('pageerror', (e) => errs.push(`${tag} ${e.message}`));
  const A = await ctx.newPage(); watch(A, 'A');
  await A.goto(BASE + '?mp=1&net=local', { waitUntil: 'networkidle' });
  await A.click('[data-soon="mp"]'); await A.fill('#mpName', 'Host'); await A.click('[data-level="hr"]'); await A.click('#mpCreate');
  await A.waitForSelector('#mpCodeShow');
  const code = (await A.textContent('#mpCodeShow')).trim();
  const B = await ctx.newPage(); watch(B, 'B');
  await B.addInitScript(() => { try { localStorage.removeItem('mp_name'); } catch {} });
  await B.goto(`${BASE}?mp=1&net=local&room=${code}`, { waitUntil: 'networkidle' });
  await B.fill('#mpName', 'Guest'); await B.click('#mpJoin');
  await B.waitForFunction(() => window.__mp && window.__mp.level === 'hr', null, { timeout: 6000 });
  await A.waitForFunction(() => document.querySelectorAll('#mpScreen .mp-member:not(.empty)').length === 2, null, { timeout: 6000 });
  await A.click('#mpStart');
  await B.waitForFunction(() => window.__mp.game && window.__mp.mode === 'play', null, { timeout: 6000 });
  await A.waitForTimeout(4200);

  // host puts a screened CV on interview chair 1; the guest walks there and starts the interview
  await A.evaluate(() => { const g = window.__mp.game; g.items.k = { id: 'i900', type: 'cv_ok' }; g.items.i900 = g.items.k; delete g.items.k; g.stations.iv1.item = 'i900'; });
  await B.bringToFront();
  await B.evaluate(() => { window.__mp.me.x = -1.9; window.__mp.me.z = -0.8; });
  await B.waitForTimeout(500);
  await B.evaluate(() => window.__mp.useAction());
  await B.waitForSelector('#mpQuiz:not([hidden])', { timeout: 6000 });
  if (SHOTS) await B.screenshot({ path: `${SHOTS}/hr-interview.png` });
  const good = await A.evaluate(() => { const g = window.__mp.game; const q = Object.values(g.quizzes)[0]; return q && !!window.__mpLevelQuiz(q.q); });
  await B.keyboard.press(good ? 'Digit1' : 'Digit2');
  await A.waitForFunction(() => window.__mp.game.items.i900.type !== 'cv_ok', null, { timeout: 6000 });
  const t = await A.evaluate(() => window.__mp.game.items.i900.type);
  assert(t === (good ? 'interviewed' : 'cv'), 'right call: ' + t);
  await B.waitForSelector('#mpQuiz[hidden]', { state: 'attached', timeout: 4000 });
  if (errs.length) { console.log(errs.join('\n')); process.exitCode = 1; } else console.log('mp-hr-interview e2e OK ·', good ? 'passed a good candidate' : 'rejected a bad one');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
