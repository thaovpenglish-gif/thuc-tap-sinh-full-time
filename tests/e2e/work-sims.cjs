// Bots play every work sim (doc / chat, ui/sims.js) of every company, every scenario, through the real mini-game UI
// (server on :8765 serving site/). Usage: node tests/e2e/work-sims.cjs [company ...]
// Checks: no JS error; perfect play passes the bar; careless play fails; reasonable duration; screenshots (SHOTS dir).
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const OUT = process.env.SHOTS || '/tmp/claude-0';
const COS = process.argv.slice(2).length ? process.argv.slice(2) : ['tm', 'bama', 'tech', 'agency', 'audit', 'event', 'hr'];

const PLAY = async ({ co, id, scenario, mode }) => {
  const { runMinigame } = await import('./js/ui/minigame.js');
  const { sampleMini } = await import('./js/game/desk.js');
  const { DESK } = await import(`./js/companies/${co}/desk.js`);
  document.querySelectorAll('body > *').forEach((e) => { if (!['mini', 'toasts'].includes(e.id) && e.tagName !== 'SCRIPT') e.style.display = 'none'; });
  const game = DESK.games.find((g) => g.id === id);
  const cfg = { ...sampleMini({ ...game, scenario }, 1), pass: game.pass ?? 0.6 };
  window.__miniDebug = null;
  const t0 = performance.now();
  const res = runMinigame(cfg);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const m = () => document.querySelector('#mini');
  await sleep(150);
  window.__shot = false;
  if (cfg.type === 'doc') {
    const info = window.__miniDebug.info();
    const lines = [...m().querySelectorAll('.doc-line')];
    const pickIdx = mode === 'perfect' ? info.bad : lines.map((b) => Number(b.dataset.i)).filter((i) => !info.bad.includes(i)).slice(0, 3);
    for (const i of pickIdx) { m().querySelector(`.doc-line[data-i="${i}"]`).click(); await sleep(120); }
    window.__shot = true; await sleep(500);
    m().querySelector('.mini-go').click(); await sleep(200);
    if (info.verdict !== null) { const n = m().querySelectorAll('[data-v]').length; m().querySelector(`[data-v="${mode === 'perfect' ? info.verdict : (info.verdict + 1) % n}"]`).click(); }
  } else {
    let turns = 0;
    while (performance.now() - t0 < (cfg.time || 60) * 1000) {
      const opts = m().querySelectorAll('.chat-opt');
      if (opts.length) {
        const s = window.__miniDebug.info().options;
        const k = mode === 'perfect' ? s.indexOf(Math.max(...s)) : s.indexOf(Math.min(...s));
        opts[k].click(); turns++;
        if (turns === 2) window.__shot = true;
      }
      if (m().querySelector('.mini-result')) break;
      await sleep(150);
    }
  }
  while (!m().querySelector('.mini-result')) await sleep(100);
  const ms = Math.round(performance.now() - t0);
  window.__shot = 'result'; await sleep(400);
  const close = m().querySelector('.mini-close'); if (close) close.click();
  const { score } = await res;
  return { score, pass: cfg.pass, ms, time: cfg.time };
};

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = process.env.MOBILE ? await b.newContext({ ...devices['iPhone 13'] }) : await b.newContext({ viewport: { width: 1100, height: 800 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const fails = [];
  for (const co of COS) {
    const sims = await p.evaluate(async (co) => (await import(`./js/companies/${co}/desk.js`)).DESK.games.filter((g) => g.type === 'doc' || g.type === 'chat').map((g) => ({ id: g.id, n: (g.docs || g.convos).length })), co);
    for (const { id, n } of sims) for (let sc = 0; sc < n; sc++) {
      const shots = (async () => {
        await p.waitForFunction(() => window.__shot === true, null, { timeout: 90000 }).catch(() => {});
        if (sc === 0) await p.locator('#mini .mini-card').screenshot({ path: `${OUT}/sim_${id}${process.env.MOBILE ? '_m' : ''}.png` }).catch(() => {});
        await p.waitForFunction(() => window.__shot === 'result', null, { timeout: 90000 }).catch(() => {});
        if (sc === 0) await p.locator('#mini .mini-card').screenshot({ path: `${OUT}/sim_${id}${process.env.MOBILE ? '_m' : ''}_result.png` }).catch(() => {});
      })();
      const good = await p.evaluate(PLAY, { co, id, scenario: sc, mode: 'perfect' });
      await shots;
      const bad = await p.evaluate(PLAY, { co, id, scenario: sc, mode: 'careless' });
      const slow = good.ms > good.time * 1000 * 0.6; // must fit when hungry + sleepy (×0.64)
      const ok = good.score >= good.pass - 1e-9 && bad.score < good.pass && !slow;
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${`${id}#${sc}`.padEnd(22)} perfect ${good.score.toFixed(2)} (${good.ms}ms of ${good.time}s${slow ? ' TOO SLOW' : ''}) · careless ${bad.score.toFixed(2)} · pass ${good.pass}`);
      if (!ok) fails.push(`${id}#${sc}`);
    }
  }
  console.log('errors:', errs.slice(0, 10));
  await b.close();
  process.exit(fails.length || errs.length ? 1 : 0);
})();
