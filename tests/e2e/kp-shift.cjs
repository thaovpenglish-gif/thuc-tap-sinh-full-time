// Khu phố T&M · Trà Sữa Full Topping shift e2e (design T3 in a real browser).
// Opens the standalone harness site/khupho-shift-test.html, builds the first cup by hand through the real stations
// (tap tiles, hold the sugar pump to the line, keep the shaker in the green, time the lid press), then plays the rest
// of the shift perfectly through window.__kpDebug. Asserts: grade A, no JS errors, every visible button ≥ 44 px and
// not covered by another element (elementFromPoint), no horizontal page scroll. Runs on desktop and on a 400×860 phone.
// Usage: node tests/e2e/kp-shift.cjs        env: BASE_URL (default http://localhost:8765/), SHOTS (screenshot dir), SECS
const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const OUT = process.env.SHOTS || '/tmp/kp-shots';
const SECS = Number(process.env.SECS) || 120;
fs.mkdirSync(OUT, { recursive: true });

function up(url) { return new Promise((res) => { const r = http.get(url, (x) => { x.resume(); res(x.statusCode < 500); }); r.on('error', () => res(false)); r.setTimeout(1500, () => { r.destroy(); res(false); }); }); }
async function ensureServer() {
  if (await up(BASE)) return null;
  const port = new URL(BASE).port || '8765';
  const srv = spawn('python3', ['-m', 'http.server', port], { cwd: path.join(__dirname, '..', '..', 'site'), stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await up(BASE)); i++) await new Promise((r) => setTimeout(r, 150));
  return srv;
}

// in-page: every visible button inside `sel` is ≥ 44 px and is what elementFromPoint finds at its centre.
// Scrolls every scroll container through its range so off-screen buttons get checked too.
const COVER = async (sel) => {
  const root = document.querySelector(sel);
  const bad = [], small = [];
  let checked = 0;
  const seen = new Set();
  const scrollers = [...root.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 2) || (/(auto|scroll)/.test(cs.overflowX) && n.scrollWidth > n.clientWidth + 2); });
  const check = () => {
    for (const b of root.querySelectorAll('button')) {
      if (b.offsetParent === null) continue;
      const r = b.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(b);
      if (cs.visibility === 'hidden') continue;
      const key = b.dataset.id || b.dataset.ticket || b.dataset.k || b.dataset.hold || b.dataset.tab || b.dataset.chore || b.dataset.cook || b.textContent.trim().slice(0, 24);
      if (Math.min(r.width, r.height) < 43.5 && !seen.has(`s${key}`)) { seen.add(`s${key}`); small.push(`${key} ${Math.round(r.width)}x${Math.round(r.height)}`); }
      // only judge buttons fully inside the viewport and inside every scroll container that holds them
      let inside = r.left >= 0 && r.top >= 0 && r.right <= innerWidth + 0.5 && r.bottom <= innerHeight + 0.5;
      for (let p = b.parentElement; p && inside; p = p.parentElement) {
        if (!scrollers.includes(p)) continue;
        const pr = p.getBoundingClientRect();
        inside = r.left >= pr.left - 0.5 && r.right <= pr.right + 0.5 && r.top >= pr.top - 0.5 && r.bottom <= pr.bottom + 0.5;
      }
      if (!inside) continue;
      const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 6, r.top + 6], [r.right - 6, r.bottom - 6]];
      for (const [x, y] of pts) {
        const hit = document.elementFromPoint(x, y);
        if (!hit || !(hit === b || b.contains(hit))) { if (!seen.has(`c${key}`)) { seen.add(`c${key}`); bad.push(`${key} covered by ${hit ? `${hit.tagName}.${hit.className}` : 'nothing'}`); } break; }
      }
      checked++;
    }
  };
  check();
  for (const s of scrollers) {
    const y0 = s.scrollTop, x0 = s.scrollLeft;
    for (let y = 0; y <= s.scrollHeight; y += Math.max(40, s.clientHeight * 0.6)) { s.scrollTop = y; check(); }
    for (let x = 0; x <= s.scrollWidth; x += Math.max(40, s.clientWidth * 0.6)) { s.scrollLeft = x; check(); }
    s.scrollTop = y0; s.scrollLeft = x0;
  }
  return { bad, small, checked, hscroll: document.documentElement.scrollWidth > innerWidth + 1 };
};

// in-page: build the selected ticket's cup through the hold/timing mechanics (pump, shaker, lid press)
const MECH = async (what) => {
  const D = window.__kpDebug;
  const fire = (el, type) => { const r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 7, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, isPrimary: true })); };
  const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
  if (what.sugar != null) {
    const btn = document.querySelector('[data-hold="sugar"]');
    if (what.sugar > 0) {
      fire(btn, 'pointerdown');
      const t0 = performance.now();
      while (D.state().pump < what.sugar - 1 && performance.now() - t0 < 6000) await frame();
      fire(btn, 'pointerup');
    }
    return D.state().cup.sugarLevel;
  }
  if (what.shake) {
    const btn = document.querySelector('[data-hold="shake"]');
    let held = false;
    const t0 = performance.now();
    while (!D.state().cup.shaken && performance.now() - t0 < 10000) {
      const v = D.state().shake.v;
      if (!held && v < 0.55) { fire(btn, 'pointerdown'); held = true; }
      else if (held && v > 0.66) { fire(btn, 'pointerup'); held = false; }
      await frame();
    }
    if (held) fire(btn, 'pointerup');
    return D.state().cup.shaken;
  }
  if (what.seal) {
    const btn = document.querySelector('[data-id="seal"]');
    const t0 = performance.now();
    while (performance.now() - t0 < 5000) { const s = D.state(); if (Math.abs(s.seal - 0.5) < 0.04) break; await frame(); }
    btn.click();
    return D.state().cup.sealed;
  }
  return null;
};

async function run(browser, name, viewport, extra) {
  const ctx = await browser.newContext({ viewport, ...extra });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  const report = { name, viewport };
  await page.goto(`${BASE}khupho-shift-test.html?debug=1&secs=${SECS}&rank=2&day=2&start=840&seed=7`);
  await page.waitForFunction(() => window.__kpDebug && window.__kpDebug.state().phase === 'open');
  report.openCover = await page.evaluate(COVER, '.kp-shift');
  await page.screenshot({ path: path.join(OUT, `kp-shift-${name}-open.png`) });
  for (const b of await page.locator('.kp-list [data-k]').all()) await b.click();
  await page.locator('[data-go]').click();
  await page.waitForFunction(() => window.__kpDebug.state().phase === 'play');

  // ---- first cup by hand, through the real stations
  await page.waitForFunction(() => window.__kpDebug.state().tickets.length > 0, null, { timeout: 60_000 });
  const order = await page.evaluate(() => window.__kpDebug.state().tickets[0]);
  // meanwhile, a helper serves any OTHER ticket so nobody leaves while we work by hand
  await page.evaluate((keep) => { window.__kpHelper = setInterval(() => { const D = window.__kpDebug; if (!D) return; for (const t of D.state().tickets) if (t.id !== keep) D.deliver(t.id); D.select(keep); }, 120); }, order.id);
  const cup = await page.evaluate((o) => window.__kpDebug.answer(o), order);
  await page.locator(`[data-ticket="${order.id}"]`).click();
  await page.locator(`[data-id="size:${cup.size}"]`).click();
  for (const t of cup.toppings) await page.locator(`[data-id="top:${t}"]`).click();
  if (cup.tea) await page.locator(`[data-id="tea:${cup.tea}"]`).click();
  if (cup.milk) await page.locator(`[data-id="milk:${cup.milk}"]`).click();
  await page.locator('[data-hold="sugar"]').scrollIntoViewIfNeeded();
  report.sugarLevel = await page.evaluate(MECH, { sugar: cup.sugar });
  await page.locator(`[data-id="ice:${cup.ice}"]`).click();
  await page.locator('[data-hold="shake"]').scrollIntoViewIfNeeded();
  report.shaken = await page.evaluate(MECH, { shake: true });
  report.sealed = await page.evaluate(MECH, { seal: true });
  await page.locator('[data-id="label"]').click();
  await page.evaluate(() => { const st = document.querySelector('.kp-st'); st.scrollTop = 0; });
  // mid-shift: coverage + screenshot with a built cup and live tickets
  report.midCover = await page.evaluate(COVER, '.kp-shift');
  await page.screenshot({ path: path.join(OUT, `kp-shift-${name}-mid.png`) });
  await page.locator('[data-id="give"]').click();
  await page.evaluate(() => clearInterval(window.__kpHelper));
  report.handCup = await page.evaluate(() => window.__kpDebug.state().last);
  if (!report.handCup || report.handCup.id !== order.id) throw new Error(`${name}: the hand-made cup was not served: ${JSON.stringify(report.handCup)}`);

  // ---- rest of the shift: perfect play through the debug key (pearls re-cooked before they turn hard, chores done)
  let shotLater = false;
  for (;;) {
    const s = await page.evaluate(() => {
      const D = window.__kpDebug; if (!D) return { phase: 'gone' };
      const st = D.state();
      if (st.phase !== 'play') return st;
      for (const t of st.tickets) D.deliver(t.id);
      for (const p of st.pearls) if (!p.cooking && (p.state == null || p.age > 7 * 60 || p.grams < 300)) D.cook(p.kind);
      for (const c of st.chores) if (c.status === 'open') D.chore(c.id);
      return D.state();
    });
    if (s.phase !== 'play') break;
    if (!shotLater && s.now >= 16 * 60 + 15) { shotLater = true; await page.screenshot({ path: path.join(OUT, `kp-shift-${name}-wave.png`) }); report.waveCover = await page.evaluate(COVER, '.kp-shift'); }
    await page.waitForTimeout(150);
  }
  await page.waitForFunction(() => window.__kpDebug.state().phase === 'close');
  for (const b of await page.locator('.kp-list [data-k]').all()) await b.click();
  await page.locator('[data-go]').click();
  await page.waitForFunction(() => window.__kpDebug.state().phase === 'summary');
  report.summaryCover = await page.evaluate(COVER, '.kp-shift');
  await page.screenshot({ path: path.join(OUT, `kp-shift-${name}-summary.png`), fullPage: false });
  report.gradeText = (await page.locator('.kp-grade').textContent()).trim();
  await page.locator('[data-done]').click();
  await page.waitForFunction(() => window.__kpHarness.ended);
  const res = await page.evaluate(() => window.__kpHarness.result);
  report.result = { grade: res.grade, cups: res.cups, missed: res.missed, points: res.points, speed: res.speedFactor, pay: res.pay, tips: res.tips, waste: res.waste, chores: res.choresDone, choresMissed: res.choresMissed };
  // ---- manager panels after the shift
  report.panels = {};
  for (const tab of ['stock', 'channels', 'pnl', 'ranks']) {
    await page.evaluate((t) => window.__kpHarness.showPanel(t), tab);
    await page.waitForSelector('.kp-panel');
    report.panels[tab] = await page.evaluate(COVER, '.kp-panel');
    await page.screenshot({ path: path.join(OUT, `kp-panel-${name}-${tab}.png`) });
  }
  report.errors = errors;
  await ctx.close();
  return report;
}

(async () => {
  const srv = await ensureServer();
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  let fail = false;
  try {
    for (const [name, viewport, extra] of [['desktop', { width: 1280, height: 800 }, {}], ['phone', { width: 400, height: 860 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
      const r = await run(browser, name, viewport, extra);
      const covers = ['openCover', 'midCover', 'waveCover', 'summaryCover'].map((k) => [k, r[k]]).concat(Object.entries(r.panels).map(([k, v]) => [`panel:${k}`, v]));
      const problems = [];
      if (r.result.grade !== 'A' || r.gradeText !== 'A') problems.push(`grade ${r.result.grade} / ${r.gradeText}`);
      if (r.handCup.grade !== 'A') problems.push(`hand-made cup ${r.handCup.grade} ${JSON.stringify(r.handCup.faults)}`);
      for (const [k, c] of covers) {
        if (!c) { problems.push(`${k}: not checked`); continue; }
        if (c.bad.length) problems.push(`${k} covered: ${c.bad.join('; ')}`);
        if (c.small.length) problems.push(`${k} < 44px: ${c.small.join('; ')}`);
        if (c.hscroll) problems.push(`${k}: horizontal page scroll`);
      }
      if (r.errors.length) problems.push(`JS errors: ${r.errors.join(' | ')}`);
      console.log(`[${name} ${r.viewport.width}x${r.viewport.height}] grade ${r.result.grade}, cups ${r.result.cups}, missed ${r.result.missed}, points ${r.result.points}, speed ${r.result.speed}, pay ${r.result.pay}, tips ${r.result.tips}, waste ${r.result.waste}, chores ${r.result.chores}/${r.result.chores + r.result.choresMissed}`);
      console.log(`  hand-made cup: ${r.handCup.grade} (${Math.round(r.handCup.points)} pts) sugar level ${Math.round(r.sugarLevel)} shaken ${r.shaken} sealed ${r.sealed}`);
      console.log(`  buttons checked: ${covers.map(([k, c]) => `${k}=${c ? c.checked : '-'}`).join(' ')}`);
      if (problems.length) { fail = true; console.log(`  FAIL: ${problems.join('\n        ')}`); } else console.log('  OK');
    }
    console.log(`screenshots: ${OUT}`);
  } finally {
    await browser.close();
    if (srv) srv.kill();
  }
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
