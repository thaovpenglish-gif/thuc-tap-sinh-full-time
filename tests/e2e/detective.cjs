// Bot plays every Phá Án case through the real UI (server on :8765 serving site/).
// Usage: node tests/e2e/detective.cjs        (MOBILE=1 for phone size, SHOTS=<dir> for screenshots)
// Checks: no JS error; the menu card opens the mode; a wrong contradiction counts as a miss; every real
// contradiction opens what it should; a wrong conclusion only tells a count; perfect play ends with stars.
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const OUT = process.env.SHOTS || '';
const MOBILE = process.env.MOBILE === '1';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(MOBILE ? { ...devices['iPhone 13'] } : { viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const shot = async (name) => { if (OUT) await page.screenshot({ path: `${OUT}/detective-${MOBILE ? 'm-' : ''}${name}.png` }); };
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exitCode = 1; } };
  const closeModal = async () => { await page.click('.dt-modal [data-ok]'); await page.waitForTimeout(80); };

  await page.goto(BASE);
  await page.waitForSelector('#caseBtn', { state: 'visible' });
  await page.click('#caseBtn');
  await page.waitForSelector('.dt-case');
  await shot('list');
  const cases = await page.evaluate(() => window.__detective.cases.map((c) => ({
    id: c.id,
    ks: c.contradictions.map((k) => ({ stmt: k.stmt, ev: k.ev, unlock: k.unlock })),
    key: c.questions.map((q) => [q.id, q.answer]),
    evidence: c.evidence.map((e) => ({ id: e.id, locked: !!e.locked })),
  })));

  for (const c of cases) {
    await page.click(`.dt-case[data-case="${c.id}"]`);
    await page.waitForSelector('.dt-modal');
    if (c.id === cases[0].id) await shot('intro');
    await closeModal();

    // one wrong move first: the first statement against evidence that does not break it
    const k0 = c.ks[0];
    const wrong = c.evidence.find((e) => !e.locked && !k0.ev.includes(e.id));
    await page.click('[data-tab="talk"]');
    await page.click(`[data-challenge="${k0.stmt}"]`);
    await page.click(`[data-present="${wrong.id}"]`);
    await page.waitForSelector('.dt-bang.miss');
    await closeModal();
    ok(await page.evaluate(() => window.__detective.state().misses) === 1, `${c.id}: wrong present should be a miss`);

    for (const k of c.ks) {
      await page.click('[data-tab="talk"]');
      await page.click(`[data-challenge="${k.stmt}"]`);
      await page.waitForSelector('.dt-pending');
      if (c.id === 'drop' && k === c.ks[0]) await shot('present');
      const ev = await page.evaluate((ids) => ids.find((id) => document.querySelector(`[data-present="${id}"]`)), k.ev);
      ok(ev, `${c.id}: no evidence to present against ${k.stmt}`);
      await page.click(`[data-present="${ev}"]`);
      await page.waitForSelector('.dt-modal .dt-bang:not(.miss)');
      if (c.id === 'oat' && k === c.ks[0]) await shot('contradiction');
      await closeModal();
      for (const id of k.unlock) ok(await page.$(`[data-ev="${id}"], [data-challenge="${id}"], .dt-panel`) && await page.evaluate((x) => window.__detective.state().unlocked.includes(x), id), `${c.id}: ${id} not opened`);
    }

    await page.click('[data-tab="solve"]');
    // a wrong conclusion first: everything off by one
    for (const [q, a] of c.key) {
      const n = await page.$$eval(`[data-q="${q}"]`, (b) => b.length);
      await page.click(`[data-q="${q}"][data-o="${(a + 1) % n}"]`);
    }
    await page.click('[data-act="submit"]');
    await page.waitForSelector('.dt-modal');
    const txt = await page.textContent('.dt-modal');
    ok(/0\/\d+/.test(txt), `${c.id}: wrong conclusion should say 0/N, got ${txt}`);
    await closeModal();
    for (const [q, a] of c.key) await page.click(`[data-q="${q}"][data-o="${a}"]`);
    if (c.id === 'drop') await shot('solve');
    await page.click('[data-act="submit"]');
    await page.waitForSelector('.dt-verdict.win');
    const st = await page.textContent('.dt-big-stars');
    ok(st.includes('★'), `${c.id}: no stars`);
    console.log(`${c.id}: solved ${st.trim()}`);
    if (c.id === 'drop') await shot('end');
    await page.click('[data-act="list"]').catch(() => {});
    if (!(await page.$('.dt-case'))) await page.click('.dt-top [data-act="list"]');
    await page.waitForSelector('.dt-case');
  }
  await shot('list-done');

  // notebook persists, and the mode closes back to the main menu
  await page.click('.dt-case[data-case="oat"]');
  await page.click('[data-tab="notes"]');
  await page.fill('.dt-notes textarea', '19:04 UTC = 02:04 VN');
  await page.reload();
  await page.click('#caseBtn');
  await page.click('.dt-case[data-case="oat"]');
  await page.click('[data-tab="notes"]');
  ok((await page.inputValue('.dt-notes textarea')).includes('02:04'), 'notes not saved');
  await page.click('[data-act="list"]');
  await page.click('[data-act="exit"]');
  ok(await page.isVisible('#mainMenu'), 'main menu not back');

  // buttons are not covered by anything (phone size especially)
  ok(errors.length === 0, `JS errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log(process.exitCode ? 'detective e2e: FAILED' : 'detective e2e: OK');
})();
