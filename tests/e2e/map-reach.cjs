// Reachability audit for the company maps: BFS on a 0.1 m grid from the player start (player radius 0.28), then every
// interactable, every cast member's home spot, the meeting seats and Chị Giáo's spot must be within 2.2 m of a
// reachable cell (pick range is 2.6 m). Callers with body:false (phone-only characters) are skipped.
// Usage: (cd site && python3 -m http.server 8765) & node tests/e2e/map-reach.cjs [company ...]
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const cos = process.argv.slice(2).length ? process.argv.slice(2) : ['tm', 'bama', 'tech', 'agency', 'audit', 'event', 'hr'];

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  let failed = 0;
  for (const co of cos) {
    const p = await b.newPage({ viewport: { width: 800, height: 500 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE + '?debug=1', { waitUntil: 'networkidle' });
    await p.evaluate(() => { localStorage.clear(); localStorage.setItem('tts_letter_v1', '1'); }); await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(500);
    await p.evaluate(() => document.querySelector('#soloBtn').click()); await p.waitForFunction(() => window.__tm && !document.querySelector('#soloMenu').hidden);
    await p.evaluate(() => window.__tm.showCompanies('Cam'));
    await p.evaluate((c) => document.querySelector(`[data-co="${c}"]`).click(), co); await p.waitForTimeout(900);
    const out = await p.evaluate(() => {
      const t = window.__tm, w = t.world, CO = t.CO;
      const bounds = w.bounds || { minX: -14.7, maxX: 14.7, minZ: -9.7, maxZ: 9.85 };
      const start = w.playerStart || [0, 8.6];
      const r = 0.28, st = 0.1;
      const nx = Math.round((bounds.maxX - bounds.minX) / st) + 1, nz = Math.round((bounds.maxZ - bounds.minZ) / st) + 1;
      const free = (x, z) => !w.colliders.some((c) => x > c.minX - r && x < c.maxX + r && z > c.minZ - r && z < c.maxZ + r);
      const seen = new Uint8Array(nx * nz);
      const X = (i) => bounds.minX + i * st, Z = (j) => bounds.minZ + j * st;
      const si = Math.round((start[0] - bounds.minX) / st), sj = Math.round((start[1] - bounds.minZ) / st);
      if (!free(X(si), Z(sj))) return { error: 'player start is inside a collider' };
      const q = [[si, sj]]; seen[sj * nx + si] = 1; const cells = [];
      while (q.length) {
        const [i, j] = q.pop(); cells.push([X(i), Z(j)]);
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const a = i + di, c = j + dj;
          if (a < 0 || c < 0 || a >= nx || c >= nz || seen[c * nx + a] || !free(X(a), Z(c))) continue;
          seen[c * nx + a] = 1; q.push([a, c]);
        }
      }
      const near = (x, z) => { let best = 1e9; for (const [cx, cz] of cells) { const e = Math.hypot(cx - x, cz - z); if (e < best) best = e; } return +best.toFixed(2); };
      const res = [];
      for (const it of w.interactables) res.push(['obj:' + it.id, near(it.pos.x, it.pos.z)]);
      for (const [id, def] of Object.entries(CO.cast)) { if (def.body === false) continue; const sp = w.spots[def.spot]; res.push([id + '@' + def.spot, sp ? near(sp[0], sp[1]) : 'NO SPOT']); }
      for (const k of ['meeting_head', 'mr_n1', 'mr_n2', 'giao']) { const sp = w.spots[k]; res.push([k, sp ? near(sp[0], sp[1]) : 'NO SPOT']); }
      if (w.meetingSeat) res.push(['meetingSeat', near(w.meetingSeat[0], w.meetingSeat[1])]);
      return { area: +(cells.length * st * st).toFixed(1), res };
    });
    const bad = out.error ? [[out.error]] : out.res.filter(([, d]) => typeof d !== 'number' || d > 2.2);
    if (bad.length || errs.length) failed++;
    console.log(`${co}: walkable ${out.area} m², ${out.res ? out.res.length : 0} targets → ${bad.length ? 'UNREACHABLE ' + JSON.stringify(bad) : 'all reachable'}${errs.length ? ' errors ' + JSON.stringify(errs) : ''}`);
    await p.close();
  }
  await b.close();
  process.exit(failed ? 1 : 0);
})();
