// Bots play every hands-on desk game (ui/action.js) of every company in a real browser (server on :8765 serving site/).
// Usage: node tests/e2e/action-games.cjs [company ...]
// Checks per game: no JS error; a perfect bot scores ≥ the game's pass bar; a careless bot scores less; screenshots.
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const OUT = process.env.SHOTS || '/tmp/claude-0';
const COS = process.argv.slice(2).length ? process.argv.slice(2) : ['office', 'tm', 'bama', 'tech', 'agency', 'audit', 'event', 'hr'];
// 'office' = the shared equipment games (game/office.js): printer legs, pantry pour, desk shredder / network

// runs in the page: mount one game, let a bot play it through synthetic pointer events, resolve with the score
const PLAY = async ({ co, id, mode, shot }) => {
  const { startAction } = await import('./js/ui/action.js');
  const games = co === 'office' ? await (async () => { const o = await import('./js/game/office.js'); return [...o.PRINTER_GAMES, o.pourGame('Pha cà phê cho sếp'), o.pourGame('Pha một ấm trà'), ...o.DESK_OFFICE_GAMES].map((g, i) => (g.id === 'off_pour' ? { ...g, id: `off_pour${i}` } : g)); })()
    : (await import(`./js/companies/${co}/desk.js`)).DESK.games;
  const cfg = games.find((g) => g.id === id);
  let host = document.getElementById('actTest');
  if (!host) { host = document.createElement('div'); host.id = 'actTest'; host.style.cssText = 'position:fixed;left:20px;top:20px;width:560px;z-index:9999;background:#fff;padding:10px;border:3px solid #000;border-radius:20px'; document.body.appendChild(host); }
  let over = false;
  const game = startAction(host, cfg, { onDone: () => { over = true; } });
  const cv = host.querySelector('canvas');
  const toPage = (x, y) => { const r = cv.getBoundingClientRect(); return { clientX: r.left + x * r.width / 520, clientY: r.top + y * r.height / 300 }; };
  const ev = (type, x, y) => cv.dispatchEvent(new PointerEvent(type, { ...toPage(x, y), pointerId: 1, bubbles: true }));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = performance.now(), limit = (cfg.time || 30) * 1000;
  let shotDone = false;
  const maybeShot = async () => { if (!shotDone && performance.now() - t0 > 2500) { shotDone = true; window.__shotReady = true; await sleep(350); } };
  const g = cfg.game;
  while (!over && performance.now() - t0 < limit) {
    const s = game.info();
    if (g === 'shred') {
      if (s.finished || s.h < 1) { await sleep(120); continue; }
      const a = mode === 'perfect' ? s.angle : s.angle + Math.PI / 2;
      const ly = 70 - s.h / 2, cx = s.cx - Math.sin(s.angle) * ly, cy = s.cy + Math.cos(s.angle) * ly;
      const L = mode === 'perfect' ? s.pw * 0.45 : 60;
      ev('pointerdown', cx - Math.cos(a) * L, cy - Math.sin(a) * L);
      for (let k = 1; k <= 8; k++) { ev('pointermove', cx + Math.cos(a) * L * (k / 4 - 1), cy + Math.sin(a) * L * (k / 4 - 1)); await sleep(12); }
      ev('pointerup', cx + Math.cos(a) * L, cy + Math.sin(a) * L);
      await sleep(260);
    } else if (g === 'hold') {
      if (s.state !== 'idle') { await sleep(30); continue; }
      ev('pointerdown', 200, 150);
      const target = mode === 'perfect' ? (s.zone[0] + s.zone[1]) / 2 : 1.2;
      while (!over && game.info().state === 'filling' && game.info().p < target) await sleep(8);
      ev('pointerup', 200, 150);
      await sleep(60);
    } else if (g === 'whack') {
      for (const t of s.slots) if (t && (mode === 'perfect' ? t.good : !t.good)) ev('pointerdown', t.x, t.y);
      await sleep(mode === 'perfect' ? 120 : 400);
    } else if (g === 'conveyor') {
      const beat = cfg.mode === 'beat';
      const it = s.items.find((x) => Math.abs(x.x - s.zx) < (beat ? 5 : 20) && (mode === 'perfect' ? x.good : true));
      if (it && (mode === 'perfect' || Math.random() < 0.5)) { ev('pointerdown', 200, 150); await sleep(40); }
      else if (mode !== 'perfect' && Math.random() < 0.03) ev('pointerdown', 200, 150);
      await sleep(6);
    } else if (g === 'printjam') {
      if (s.phase === 'print') { ev('pointerdown', 420, 64); await sleep(200); continue; }
      if (s.phase !== 'pull') { await sleep(100); continue; }
      const sc = s.scraps.find((o) => !o.out);
      if (sc) {
        ev('pointerdown', sc.x, sc.y);
        const step = mode === 'perfect' ? 5 : 45, gap = mode === 'perfect' ? 30 : 8;
        let x = sc.x, y = sc.y;
        for (let k = 0; k < 40; k++) { x += sc.dx * step; y += sc.dy * step; ev('pointermove', x, y); await sleep(gap); const n = game.info().scraps.find((o) => Math.abs(o.dx - sc.dx) < 1e-6 && !o.out); if (!n || n.left >= sc.left + 1 || game.info().tears !== s.tears) break; }
        ev('pointerup', x, y);
      }
      await sleep(60);
    } else if (g === 'collate') {
      if (s.phase === 'staple') { if (mode !== 'perfect' || Math.abs(s.ring - 22) < 3) ev('pointerdown', 10, 10); await sleep(10); continue; }
      if (s.phase !== 'pages') { await sleep(60); continue; }
      const p2 = mode === 'perfect' ? s.pages.find((o) => !o.done && o.n === s.nextN) : s.pages.find((o) => !o.done && o.n !== s.nextN) || s.pages.find((o) => !o.done);
      if (p2) { ev('pointerdown', p2.x, p2.y); await sleep(80); if (p2.down && mode === 'perfect') { ev('pointerdown', p2.x, p2.y); await sleep(80); } }
      await sleep(80);
    } else if (g === 'wires') {
      const l = s.left.find((o) => !o.done);
      if (l) {
        const r2 = s.right.find((o) => (mode === 'perfect' ? o.k === l.k : o.k !== l.k));
        ev('pointerdown', l.x, l.y);
        for (let k = 1; k <= 6; k++) { ev('pointermove', l.x + (r2.x - l.x) * k / 6, l.y + (r2.y - l.y) * k / 6); await sleep(15); }
        ev('pointerup', r2.x, r2.y);
      }
      await sleep(120);
    } else if (g === 'shredder') {
      if (!s.cur || s.busy) { await sleep(60); continue; }
      const down = mode === 'perfect' ? s.cur.shred : !s.cur.shred;
      const tx = s.cur.x + (down ? 0 : 160), ty = s.cur.y + (down ? 120 : 0);
      ev('pointerdown', s.cur.x, s.cur.y);
      for (let k = 1; k <= 6; k++) { ev('pointermove', s.cur.x + (tx - s.cur.x) * k / 6, s.cur.y + (ty - s.cur.y) * k / 6); await sleep(15); }
      ev('pointerup', tx, ty);
      await sleep(450);
    } else if (g === 'align') {
      if (s.bubble > 0) { await sleep(100); continue; }
      const b = s.blocks.find((x) => !x.ok);
      if (b) {
        ev('pointerdown', b.x, b.y);
        const dx = mode === 'perfect' ? b.tx : b.tx + 70, dy = mode === 'perfect' ? b.ty : b.ty + 40;
        for (let k = 1; k <= 6; k++) { ev('pointermove', b.x + (dx - b.x) * k / 6, b.y + (dy - b.y) * k / 6); await sleep(15); }
        ev('pointerup', dx, dy);
        if (mode !== 'perfect') { await sleep(500); break; }
      }
      await sleep(80);
    }
    if (shot) await maybeShot();
  }
  if (shot && !shotDone) { window.__shotReady = true; await sleep(350); } // finished before the screenshot moment
  const score = game.score(); game.stop();
  return { score, pass: cfg.pass ?? 0.5, over, ms: Math.round(performance.now() - t0) };
};

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 900, height: 700 } })).newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE + '?debug=1', { waitUntil: 'networkidle' });
  const fails = [];
  for (const co of COS) {
    const ids = co === 'office'
      ? ['off_jam', 'off_collate', 'off_net', 'off_pour0', 'off_pour1', 'off_shred', 'off_net_desk'].map((x) => x.replace('off_pour0', 'off_pour3').replace('off_pour1', 'off_pour4'))
      : await p.evaluate(async (co) => (await import(`./js/companies/${co}/desk.js`)).DESK.games.filter((g) => g.type === 'action').map((g) => g.id), co);
    for (const id of ids) {
      const shotP = (async () => { await p.waitForFunction(() => window.__shotReady, null, { timeout: 60000 }).catch(() => {}); await p.locator('#actTest').screenshot({ path: `${OUT}/act_${id}.png` }).catch(() => {}); })();
      const good = await p.evaluate(PLAY, { co, id, mode: 'perfect', shot: true });
      await shotP; await p.evaluate(() => { window.__shotReady = false; });
      const bad = await p.evaluate(PLAY, { co, id, mode: 'careless', shot: false });
      const ok = good.score >= good.pass - 1e-9 && bad.score < good.pass;
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${id.padEnd(16)} perfect ${good.score.toFixed(2)} (${good.ms}ms, ended=${good.over}) · careless ${bad.score.toFixed(2)} · pass ${good.pass}`);
      if (!ok) fails.push(id);
    }
  }
  console.log('errors:', errs.slice(0, 10));
  await b.close();
  process.exit(fails.length || errs.length ? 1 : 0);
})();
