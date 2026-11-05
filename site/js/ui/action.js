// Hands-on "cooking game" mini-games drawn on a canvas (mouse + touch + Space). Used by ui/minigame.js type 'action'.
// startAction(host, cfg, { onDone }) -> { score(): 0..1, stop(), win() }.  cfg.game picks the mechanic:
//   shred    · swipe ALONG the grain to tear strips (khô gà xé). Across the grain = crumbs.
//   hold     · hold, release inside the green zone (skin 'seal' = heat-seal a bag, 'balloon' = inflate). Over = burnt/pop.
//   whack    · targets pop up; tap the good ones before they vanish, never the bad ones (cfg.target / cfg.avoid:
//              { emoji, labels[], hit?, miss?, color? }).
//   conveyor · items slide past a zone; tap when one is inside (mode 'stamp': only good ones; mode 'beat': timing).
//   align    · drag blocks into their dashed outlines; optional twist re-shuffles some ("vài ý nhỏ").
// Everything is original sticker-style art: rounded shapes, thick ink outlines, pastel fills, emoji.
import { sfx } from '../core/audio.js';

const INK = '#1d1d1f', CREAM = '#fff8ef', MINT = '#b8f0d8', PEACH = '#ffc2b3', BUTTER = '#ffe9a0', LILAC = '#c9b6ff', SKY = '#bfe3ff', PINK = '#ffc6e0';
const W = 520, H = 300;
const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function rr(g, x, y, w, h, r) {
  g.beginPath();
  if (g.roundRect) { g.roundRect(x, y, w, h, r); return; }
  r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function sticker(g, x, y, w, h, fill, r = 12, line = 3) { rr(g, x + 3, y + 3, w, h, r); g.fillStyle = INK; g.fill(); rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); g.lineWidth = line; g.strokeStyle = INK; g.stroke(); }
function text(g, s, x, y, { size = 14, weight = 800, color = INK, align = 'center', base = 'middle', max } = {}) {
  g.font = `${weight} ${size}px ${FONT}`; g.fillStyle = color; g.textAlign = align; g.textBaseline = base;
  g.fillText(s, x, y, max);
}

/** Shared canvas shell: sizing, pointer mapping, loop, floating texts and particles. */
function stage(host, hint) {
  host.innerHTML = `<div class="act-wrap"><canvas class="act-cv"></canvas>${hint ? `<div class="act-hint">${hint}</div>` : ''}</div>`;
  const cv = host.querySelector('canvas');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr;
  const g = cv.getContext('2d'); g.scale(dpr, dpr);
  const pops = [], parts = [];
  const S = {
    cv, g, pops, parts, t: 0, alive: true, shake: 0,
    at(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; },
    pop(x, y, s, color = INK, size = 18) { pops.push({ x, y, s, color, size, life: 1 }); },
    burst(x, y, color, n = 10, sp = 140) { for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), v = rnd(sp * 0.3, sp); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: rnd(0.5, 0.9), r: rnd(2, 5), color }); } },
    fx(dt) {
      for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 320 * dt; if (p.life <= 0) parts.splice(i, 1); else { g.globalAlpha = Math.min(1, p.life * 2); g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fillStyle = p.color; g.fill(); g.lineWidth = 1.2; g.strokeStyle = INK; g.stroke(); } }
      g.globalAlpha = 1;
      for (let i = pops.length - 1; i >= 0; i--) { const p = pops[i]; p.life -= dt * 0.9; p.y -= 30 * dt; if (p.life <= 0) { pops.splice(i, 1); continue; } g.globalAlpha = Math.min(1, p.life * 2); g.lineWidth = 4; g.strokeStyle = '#fff'; g.font = `900 ${p.size}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.strokeText(p.s, p.x, p.y); text(g, p.s, p.x, p.y, { size: p.size, weight: 900, color: p.color }); }
      g.globalAlpha = 1;
    },
    loop(draw) {
      let last = performance.now();
      const frame = (now) => {
        if (!S.alive) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now; S.t += dt;
        g.save();
        if (S.shake > 0) { S.shake -= dt; g.translate(rnd(-4, 4), rnd(-3, 3)); }
        draw(dt);
        S.fx(dt);
        g.restore();
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    },
  };
  return S;
}

function hud(g, left, right) {
  text(g, left, 14, 18, { size: 14, align: 'left' });
  if (right) text(g, right, W - 14, 18, { size: 14, align: 'right' });
}

// ---------------------------------------------------------------------------------------------- shred
function shred(S, cfg, done) {
  const { g, cv } = S;
  const pieces = cfg.pieces || 2, per = cfg.strips || 5, target = pieces * per;
  const label = cfg.item || 'Ức gà luộc';
  let good = 0, bad = 0, combo = 0, piece = 0, left = per, angle = 0, enter = 1, finished = false;
  const flying = [], bowl = [];
  const newPiece = () => { angle = pick([0, -0.38, 0.38, -0.2, 0.2]); left = per; enter = 1; };
  newPiece();
  const CX = 205, CY = 160, PW = 250, PH0 = 140;
  const local = (p) => { const dx = p.x - CX, dy = p.y - CY, c = Math.cos(-angle), s = Math.sin(-angle); return { x: dx * c - dy * s, y: dx * s + dy * c }; };
  let path = null;
  const ph = () => PH0 * (left / per);
  const down = (e) => { if (finished) return; try { cv.setPointerCapture(e.pointerId); } catch { /* synthetic or ended pointer */ } path = [S.at(e)]; };
  const move = (e) => { if (path) { path.push(S.at(e)); if (path.length > 60) path.splice(1, 1); } };
  const up = () => {
    if (!path || finished) { path = null; return; }
    const a = path[0], b = path[path.length - 1];
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
    const inside = path.filter((p) => { const q = local(p); return Math.abs(q.x) < PW / 2 + 10 && q.y > PH0 / 2 - ph() - 14 && q.y < PH0 / 2 + 14; }).length / path.length;
    path = null;
    if (L < 40 || inside < 0.35) { if (L >= 40) S.pop(a.x, a.y - 10, 'Vuốt lên miếng thịt', '#8a5a2a', 14); return; }
    let diff = Math.abs(Math.atan2(dy, dx) - angle) % Math.PI; diff = Math.min(diff, Math.PI - diff);
    if (diff < 0.45 && L >= PW * 0.42) {
      good++; combo++; left--;
      const y = PH0 / 2 - ph() + PH0 / per / 2; // the top band of the piece (local), then to world
      const c = Math.cos(angle), s = Math.sin(angle);
      flying.push({ x: CX - y * s, y: CY + y * c, a: angle, t: 0, w: PW * rnd(0.7, 0.95) });
      sfx.blip(1.2 + combo * 0.08);
      S.pop(b.x, b.y - 14, combo >= 3 ? `Đều tay! x${combo}` : pick(['Xoạt!', 'Sợi đẹp!', 'Ngon!']), '#2f8a4c', combo >= 3 ? 20 : 17);
      if (left <= 0) {
        piece++;
        if (piece >= pieces) { finished = true; sfx.good(); setTimeout(done, 650); }
        else setTimeout(newPiece, 350);
      }
    } else if (diff > 0.8) {
      bad++; combo = 0; S.shake = 0.2; sfx.bad();
      S.burst(b.x, b.y, '#c98a45', 14, 160);
      S.pop(b.x, b.y - 14, 'Ngang thớ! Vụn rồi', '#c0392b', 16);
    } else if (L < PW * 0.42) S.pop(b.x, b.y - 14, 'Vuốt dài hơn', '#8a5a2a', 14);
    else { combo = 0; S.pop(b.x, b.y - 14, 'Xiên quá, đứt sợi', '#8a5a2a', 14); }
  };
  cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  S.loop((dt) => {
    g.fillStyle = CREAM; g.fillRect(0, 0, W, H);
    // cutting board
    sticker(g, 40, 58, 330, 220, '#f2d6a8', 22);
    for (let i = 0; i < 6; i++) { g.strokeStyle = 'rgba(150,100,50,.18)'; g.lineWidth = 2; g.beginPath(); g.moveTo(60, 80 + i * 34); g.lineTo(350, 84 + i * 34); g.stroke(); }
    // bowl
    const BX = 450, BY = 220;
    g.beginPath(); g.ellipse(BX + 3, BY + 3, 62, 40, 0, 0, Math.PI); g.fillStyle = INK; g.fill();
    g.beginPath(); g.ellipse(BX, BY, 62, 40, 0, 0, Math.PI); g.fillStyle = SKY; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
    g.beginPath(); g.ellipse(BX, BY, 62, 14, 0, 0, Math.PI * 2); g.fillStyle = '#e8f4ff'; g.fill(); g.stroke();
    bowl.forEach((b2) => { g.save(); g.translate(BX + b2.x, BY - 4 + b2.y); g.rotate(b2.a); rr(g, -16, -3, 32, 6, 3); g.fillStyle = '#e9b46e'; g.fill(); g.lineWidth = 1.5; g.strokeStyle = INK; g.stroke(); g.restore(); });
    text(g, `Tô: ${good}/${target} sợi`, BX, BY + 54, { size: 13 });
    // the piece (rotated so the grain runs along local x)
    if (!finished || enter > 0) {
      enter = Math.max(0, enter - dt * 4);
      const h = ph();
      if (h > 1) {
        g.save(); g.translate(CX - enter * 260, CY); g.rotate(angle);
        const top = PH0 / 2 - h, bot = PH0 / 2;
        // half-width of the breast at local y: plump in the middle, tapering to the ends (teardrop-ish)
        const half = (y) => { const k = (y + PH0 / 2) / PH0; return PW / 2 * (0.78 + 0.22 * Math.sin(Math.PI * Math.min(1, Math.max(0, k)))); };
        g.beginPath();
        g.moveTo(-half(top) + 4, top + 4);
        for (let y = top + 4; y <= bot - 18; y += 6) g.lineTo(-half(y) + Math.sin(y * 0.3) * 1.5, y);
        g.bezierCurveTo(-half(bot) + 4, bot + 2, -PW * 0.25, bot + 6, 0, bot + 4);
        g.bezierCurveTo(PW * 0.3, bot + 2, half(bot) + 6, bot - 2, half(bot - 18), bot - 18);
        for (let y = bot - 18; y >= top + 4; y -= 6) g.lineTo(half(y) + Math.sin(y * 0.27) * 1.5, y);
        const torn = left < per; // after the first strip the top edge is ragged
        for (let x = half(top) - 4; x > -half(top) + 4; x -= 9) g.lineTo(x, top + (torn ? ((Math.round(x / 9) % 2) ? -2 : 4) + Math.sin(x) * 2 : Math.sin(x * 0.04) * 3));
        g.closePath();
        g.save(); g.translate(3, 4); g.fillStyle = INK; g.fill(); g.restore();
        const grad = g.createLinearGradient(0, top, 0, bot);
        grad.addColorStop(0, '#f7dca6'); grad.addColorStop(0.55, '#efc27f'); grad.addColorStop(1, '#d99a55');
        g.fillStyle = grad; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
        g.save(); g.clip();
        // fibres: short wavy strands along the grain, staggered like real meat
        for (let y = top + 7, row = 0; y < bot; y += 7, row++) {
          for (let x0 = -PW / 2 + (row % 3) * 14; x0 < PW / 2; x0 += 46) {
            g.strokeStyle = row % 2 ? 'rgba(170,105,45,.40)' : 'rgba(255,244,220,.55)'; g.lineWidth = row % 2 ? 2 : 1.6; g.lineCap = 'round';
            g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo(x0 + 16, y + Math.sin(x0 + row) * 2.5, x0 + 34, y + Math.cos(x0) * 1.5); g.stroke();
          }
        }
        // toasty spots + a highlight
        g.fillStyle = 'rgba(160,85,30,.28)'; for (let i = 0; i < 7; i++) { const x = -PW / 2 + 30 + i * 33, y = bot - 22 - ((i * 37) % 50); if (y > top + 8) { g.beginPath(); g.ellipse(x, y, 9, 5, 0.3, 0, 7); g.fill(); } }
        g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-PW * 0.18, Math.max(top + 14, bot - h * 0.7), PW * 0.22, 7, 0, 0, 7); g.fill();
        g.restore();
        // lá chanh shreds on top
        g.fillStyle = '#5a9a3a'; for (let i = 0; i < 6; i++) { const x = -PW / 2 + 32 + i * 37, y = bot - 16 - (i % 3) * 15; if (y > top + 8) { g.beginPath(); g.ellipse(x, y, 6, 1.8, 0.6 + i, 0, 7); g.fill(); } }
        g.restore();
        if (piece === 0 && good === 0) {
          g.save(); g.translate(CX, CY - 4); g.rotate(angle); g.globalAlpha = 0.55 + Math.sin(S.t * 5) * 0.25;
          g.setLineDash([10, 8]); g.lineWidth = 4; g.strokeStyle = '#fff'; g.beginPath(); g.moveTo(-PW / 2 + 20, 0); g.lineTo(PW / 2 - 20, 0); g.stroke();
          g.setLineDash([]); text(g, '⟷ vuốt dọc thớ', 0, -22, { size: 15, weight: 900 }); g.restore(); g.globalAlpha = 1;
        }
      }
    }
    // flying strips → bowl
    for (let i = flying.length - 1; i >= 0; i--) {
      const f = flying[i]; f.t += dt * 2.2;
      const k = Math.min(1, f.t), x = f.x + (BX - f.x) * k, y = f.y + (BY - 6 - f.y) * k - Math.sin(k * Math.PI) * 70;
      g.save(); g.translate(x, y); g.rotate(f.a + k * 2); rr(g, -f.w / 2 * (1 - k * 0.8), -5, f.w * (1 - k * 0.8), 10, 5); g.fillStyle = '#e9b46e'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke(); g.restore();
      if (k >= 1) { flying.splice(i, 1); bowl.push({ x: rnd(-40, 40), y: rnd(-8, 4), a: rnd(-1, 1) }); if (bowl.length > 24) bowl.shift(); }
    }
    if (path && path.length > 1) { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); path.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.stroke(); }
    hud(g, `🍗 ${label} · miếng ${Math.min(pieces, piece + 1)}/${pieces}`, bad ? `Vụn: ${bad}` : '');
  });
  return {
    score: () => clamp01((good - bad * 0.5) / target),
    stop: () => { cv.removeEventListener('pointerdown', down); },
    info: () => ({ angle, cx: CX, cy: CY, pw: PW, h: ph(), good, bad, finished }),
  };
}

// ---------------------------------------------------------------------------------------------- hold
function hold(S, cfg, done) {
  const { g, cv } = S;
  const skin = cfg.skin || 'seal';
  const rounds = cfg.rounds || 5;
  const width = cfg.zone || 0.16;
  let r = 0, p = 0, holding = false, state = 'idle', wait = 0, goods = 0, perfect = 0, rate = 0.5, zone = [0.6, 0.76], result = '';
  const next = () => { p = 0; state = 'idle'; holding = false; rate = rnd(0.38, 0.72) * (1 + r * 0.06); const c = rnd(0.5, 0.82); zone = [c - width / 2, c + width / 2]; };
  next();
  const judge = () => {
    if (state !== 'filling') return;
    holding = false;
    if (p >= zone[0] && p <= zone[1]) {
      goods++; const mid = (zone[0] + zone[1]) / 2, isP = Math.abs(p - mid) < width * 0.18; if (isP) perfect++;
      state = 'ok'; sfx.good(); result = isP ? 'Hoàn hảo!' : (skin === 'seal' ? 'Kín, đẹp!' : 'Vừa đẹp!');
      S.pop(W / 2 - 40, 46, result, '#2f8a4c', 22);
    } else { state = 'under'; sfx.bad(); result = skin === 'seal' ? 'Hở miệng túi!' : 'Còn xẹp quá!'; S.pop(W / 2 - 40, 70, result, '#c0392b', 20); }
    wait = 0.8;
  };
  const press = () => { if (state === 'idle') { state = 'filling'; holding = true; } };
  const down = (e) => { try { cv.setPointerCapture(e.pointerId); } catch { /* synthetic or ended pointer */ } press(); };
  const up = () => { if (holding) judge(); };
  const kd = (e) => { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); if (!e.repeat) press(); } };
  const ku = (e) => { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); up(); } };
  cv.addEventListener('pointerdown', down); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  window.addEventListener('keydown', kd, true); window.addEventListener('keyup', ku, true);

  S.loop((dt) => {
    if (state === 'filling' && holding) {
      p += rate * dt;
      if (p > 1) { state = 'over'; holding = false; sfx.bad(); S.shake = 0.3; wait = 0.9; result = skin === 'seal' ? 'Cháy túi!' : 'BỤP!'; S.pop(W / 2 - 40, 70, result, '#c0392b', 24);
        if (skin === 'seal') S.burst(W / 2 - 40, 110, '#555', 18, 90); else S.burst(W / 2 - 40, 150, cfg.color || PINK, 22, 220); }
    }
    if (wait > 0) { wait -= dt; if (wait <= 0) { r++; if (r >= rounds) { state = 'end'; setTimeout(done, 200); } else next(); } }
    g.fillStyle = CREAM; g.fillRect(0, 0, W, H);
    const cx = W / 2 - 40;
    if (skin === 'seal') {
      // bag with khô gà inside; the sealer jaw on top glows with heat
      const top = 92;
      sticker(g, cx - 80, top, 160, 170, '#f6efe2', 16);
      g.fillStyle = 'rgba(224,161,90,.85)'; rr(g, cx - 62, top + 70, 124, 80, 12); g.fill();
      text(g, cfg.label || 'KHÔ GÀ LÁ CHANH', cx, top + 44, { size: 13, weight: 900 });
      text(g, '200g', cx, top + 112, { size: 12, weight: 800, color: '#fff' });
      const heat = Math.min(1, p);
      const col = state === 'over' ? '#333' : `rgb(${200 + heat * 55},${200 - heat * 130},${190 - heat * 160})`;
      sticker(g, cx - 96, top - 26 + (state === 'filling' ? 10 : 0), 192, 22, col, 8);
      if (state === 'ok') { g.save(); g.translate(cx + 42, top + 132); g.rotate(-0.25); sticker(g, -36, -14, 72, 28, MINT, 8); text(g, 'ĐẠT', 0, 0, { size: 15, weight: 900 }); g.restore(); }
      if (state === 'over') { g.fillStyle = '#333'; rr(g, cx - 80, top, 160, 18, 6); g.fill(); }
      if (state === 'under') { g.fillStyle = '#e0a15a'; for (let i = 0; i < 4; i++) { rr(g, cx - 30 + i * 18, top + 160 + (S.t * 60 % 40), 12, 5, 2); g.fill(); } }
    } else {
      // balloon: radius grows with p, target ring at the zone
      const R = 22 + p * 98, ringA = 22 + zone[0] * 98, ringB = 22 + zone[1] * 98, by = 160;
      g.setLineDash([6, 6]); g.lineWidth = 3; g.strokeStyle = 'rgba(47,138,76,.7)';
      g.beginPath(); g.arc(cx, by, (ringA + ringB) / 2, 0, 7); g.stroke(); g.setLineDash([]);
      g.lineWidth = ringB - ringA; g.strokeStyle = 'rgba(184,240,216,.45)'; g.beginPath(); g.arc(cx, by, (ringA + ringB) / 2, 0, 7); g.stroke();
      if (state !== 'over') {
        const fy = state === 'ok' ? by - (0.8 - wait) * 260 : by;
        g.beginPath(); g.moveTo(cx, fy + R); g.quadraticCurveTo(cx + 10, fy + R + 30, cx - 4, H); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
        g.beginPath(); g.ellipse(cx + 3, fy + 3, R * 0.92, R, 0, 0, 7); g.fillStyle = INK; g.fill();
        g.beginPath(); g.ellipse(cx, fy, R * 0.92, R, 0, 0, 7); g.fillStyle = cfg.color || PINK; g.fill(); g.lineWidth = 3; g.stroke();
        g.beginPath(); g.ellipse(cx - R * 0.35, fy - R * 0.4, R * 0.16, R * 0.26, -0.5, 0, 7); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
        if (cfg.label) text(g, cfg.label, cx, fy, { size: Math.max(10, R * 0.2), weight: 900 });
      }
    }
    // meter
    const mx = W - 92, my = 50, mh = 220;
    sticker(g, mx, my, 34, mh, '#fff', 10);
    g.fillStyle = MINT; g.fillRect(mx + 3, my + mh - zone[1] * mh, 28, (zone[1] - zone[0]) * mh);
    g.fillStyle = state === 'over' ? PEACH : BUTTER; const fh = Math.min(1, p) * (mh - 6); rr(g, mx + 5, my + mh - 3 - fh, 24, fh, 6); g.fill();
    g.lineWidth = 2; g.strokeStyle = INK; g.beginPath(); g.moveTo(mx - 6, my + mh - zone[0] * mh); g.lineTo(mx + 40, my + mh - zone[0] * mh); g.moveTo(mx - 6, my + mh - zone[1] * mh); g.lineTo(mx + 40, my + mh - zone[1] * mh); g.stroke();
    text(g, state === 'idle' ? (skin === 'seal' ? 'GIỮ để hàn' : 'GIỮ để bơm') : state === 'filling' ? 'THẢ ở vùng xanh!' : result, W - 75, my + mh + 18, { size: 12, weight: 900 });
    hud(g, `${skin === 'seal' ? '🔥 Túi' : '🎈 Bóng'} ${Math.min(rounds, r + 1)}/${rounds}`, `Đạt: ${goods}${perfect ? ` · ✨${perfect}` : ''}`);
  });
  return {
    score: () => clamp01(goods / rounds),
    info: () => ({ p, zone, state, r, goods }),
    stop: () => { window.removeEventListener('keydown', kd, true); window.removeEventListener('keyup', ku, true); cv.removeEventListener('pointerdown', down); },
  };
}

// ---------------------------------------------------------------------------------------------- whack
function whack(S, cfg, done) {
  const { g, cv } = S;
  const cols = 3, rows = 3, count = cfg.count || 16;
  const GOOD = cfg.target || { emoji: '🐛', labels: ['Bug'] }, BAD = cfg.avoid || { emoji: '✨', labels: ['Tính năng'] };
  const slots = [];
  const sx = 40, sy = 44, sw = 140, sh = 76, gap = 12;
  for (let rI = 0; rI < rows; rI++) for (let c = 0; c < cols; c++) slots.push({ x: sx + c * (sw + gap), y: sy + rI * (sh + gap), t: null });
  let spawned = 0, goodN = 0, hits = 0, wrong = 0, missed = 0, next = 0.5, combo = 0, ended = false;
  const tap = (e) => {
    const q = S.at(e);
    const s = slots.find((o) => o.t && q.x >= o.x && q.x <= o.x + sw && q.y >= o.y && q.y <= o.y + sh);
    if (!s) return;
    const t = s.t; s.t = null;
    if (t.good) { hits++; combo++; sfx.blip(1 + combo * 0.1); S.burst(s.x + sw / 2, s.y + sh / 2, MINT, 8, 120); S.pop(s.x + sw / 2, s.y + 10, combo >= 3 ? `${GOOD.hit || 'Trúng!'} x${combo}` : (GOOD.hit || 'Trúng!'), '#2f8a4c', 16); }
    else { wrong++; combo = 0; sfx.bad(); S.shake = 0.2; S.pop(s.x + sw / 2, s.y + 10, BAD.hit || 'Ấy, nhầm!', '#c0392b', 16); }
  };
  cv.addEventListener('pointerdown', tap);
  S.loop((dt) => {
    next -= dt;
    const speed = 1 + spawned / count * 0.6;
    if (!ended && spawned < count && next <= 0) {
      const free = slots.filter((o) => !o.t);
      if (free.length) {
        const good = Math.random() < (cfg.goodRate || 0.68);
        const src = good ? GOOD : BAD;
        pick(free).t = { good, emoji: src.emoji, label: pick(src.labels), life: rnd(1.25, 1.6) / speed, age: 0 };
        spawned++; if (good) goodN++;
      }
      next = rnd(0.45, 0.75) / speed;
    }
    for (const s of slots) if (s.t) { s.t.age += dt; if (s.t.age > s.t.life) { if (s.t.good) { missed++; combo = 0; S.pop(s.x + sw / 2, s.y + 10, GOOD.miss || 'Trượt mất', '#8a5a2a', 13); } s.t = null; } }
    if (!ended && spawned >= count && slots.every((o) => !o.t)) { ended = true; setTimeout(done, 300); }
    g.fillStyle = cfg.bg || '#2b2d42'; g.fillRect(0, 0, W, H);
    for (const s of slots) {
      sticker(g, s.x, s.y, sw, sh, cfg.slot || '#3c3f5c', 12, 2.5);
      if (cfg.slotText) text(g, cfg.slotText, s.x + 10, s.y + sh - 10, { size: 10, weight: 700, color: 'rgba(255,255,255,.35)', align: 'left' });
      const t = s.t; if (!t) continue;
      const k = Math.min(1, t.age * 6), fade = 1 - Math.max(0, (t.age - t.life * 0.7) / (t.life * 0.3));
      g.globalAlpha = Math.max(0.15, fade);
      const bx = s.x + 8, by = s.y + 8 + (1 - k) * 20;
      sticker(g, bx, by, sw - 16, sh - 16, t.good ? (GOOD.color || MINT) : (BAD.color || PEACH), 10, 2.5);
      text(g, t.emoji, bx + 22, by + (sh - 16) / 2, { size: 24 });
      text(g, t.label, bx + 42, by + (sh - 16) / 2, { size: 12, weight: 800, align: 'left', max: sw - 64 });
      g.globalAlpha = 1;
    }
    hud(g, '', '');
    text(g, `${cfg.title || ''}  ✅ ${hits}${missed ? `  · lỡ ${missed}` : ''}${wrong ? `  · nhầm ${wrong}` : ''}`, 14, 20, { size: 13, color: '#fff', align: 'left' });
    text(g, `${Math.max(0, count - spawned)} còn lại`, W - 14, 20, { size: 12, color: 'rgba(255,255,255,.7)', align: 'right' });
  });
  return {
    score: () => clamp01((hits - wrong) / Math.max(1, goodN)),
    info: () => ({ slots: slots.map((o) => (o.t ? { x: o.x + sw / 2, y: o.y + sh / 2, good: o.t.good } : null)), hits, wrong, missed, ended }),
    stop: () => cv.removeEventListener('pointerdown', tap),
  };
}

// ---------------------------------------------------------------------------------------------- conveyor
function conveyor(S, cfg, done) {
  const { g, cv } = S;
  const mode = cfg.mode || 'stamp', count = cfg.count || 12;
  const ZX = 330, ZW = mode === 'beat' ? 16 : 92, BELT = mode === 'beat' ? 168 : 170;
  const items = [];
  let spawned = 0, goodN = 0, pts = 0, wrong = 0, next = 0.2, ended = false, stampAnim = 0, combo = 0;
  const speed0 = cfg.speed || (mode === 'beat' ? 170 : 120);
  const act = () => {
    if (ended) return;
    stampAnim = 0.18;
    const inZone = items.filter((it) => !it.done && Math.abs(it.x - ZX) < (mode === 'beat' ? 34 : ZW / 2 + 10)).sort((a, b) => Math.abs(a.x - ZX) - Math.abs(b.x - ZX))[0];
    if (!inZone) { if (mode === 'stamp') { wrong += 0.5; combo = 0; S.pop(ZX, 80, 'Đóng vào không khí', '#8a5a2a', 14); sfx.bad(); } else { combo = 0; S.pop(ZX, 80, 'Lệch nhịp', '#8a5a2a', 14); sfx.bad(); wrong += 0.25; } return; }
    inZone.done = true;
    if (mode === 'beat') {
      const d = Math.abs(inZone.x - ZX);
      const q = d < 9 ? 1 : d < 22 ? 0.7 : 0.35;
      pts += q; combo = q >= 0.7 ? combo + 1 : 0; inZone.stamp = q >= 0.7;
      sfx.blip(1 + q * 0.6);
      S.pop(ZX, 84, q === 1 ? `Perfect cut!${combo >= 3 ? ` x${combo}` : ''}` : q >= 0.7 ? 'Good' : 'Hơi lệch', q === 1 ? '#2f8a4c' : '#8a5a2a', q === 1 ? 18 : 15);
    } else if (inZone.good) { pts++; combo++; inZone.stamp = true; sfx.choose(); S.pop(ZX, 84, combo >= 3 ? `${cfg.hit || 'Cộp!'} x${combo}` : (cfg.hit || 'Cộp!'), '#2f8a4c', 18); }
    else { wrong++; combo = 0; inZone.stamp = 'bad'; sfx.bad(); S.shake = 0.2; S.pop(ZX, 84, cfg.wrongHit || 'Đóng nhầm!', '#c0392b', 17); }
  };
  const down = () => act();
  const kd = (e) => { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); if (!e.repeat) act(); } };
  cv.addEventListener('pointerdown', down); window.addEventListener('keydown', kd, true);
  S.loop((dt) => {
    const speed = speed0 * (1 + spawned / count * 0.35);
    next -= dt;
    if (spawned < count && next <= 0) {
      const good = mode === 'beat' ? true : Math.random() < (cfg.goodRate || 0.62);
      const src = good ? (cfg.target || {}) : (cfg.avoid || {});
      const icon = mode === 'stamp' ? (cfg.icon2 || (cfg.target && cfg.target.emoji) || '📄') : (src.emoji || '📄'); // same icon: read the label
      items.push({ x: -60, good, label: pick(src.labels || ['…']), emoji: icon, done: false, stamp: false });
      spawned++; if (good) goodN++;
      next = mode === 'beat' ? pick([0.45, 0.6, 0.6, 0.9]) * (170 / speed) * 1.6 : rnd(0.9, 1.25) * (120 / speed);
    }
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i]; it.x += speed * dt;
      if (!it.done && it.x > ZX + (mode === 'beat' ? 36 : ZW / 2 + 12)) { it.done = true; if (it.good) { combo = 0; S.pop(ZX + 60, 84, mode === 'beat' ? 'Lỡ nhịp' : (cfg.miss || 'Bỏ sót!'), '#8a5a2a', 14); } }
      if (it.x > W + 80) items.splice(i, 1);
    }
    if (!ended && spawned >= count && !items.length) { ended = true; setTimeout(done, 200); }
    stampAnim = Math.max(0, stampAnim - dt);
    g.fillStyle = mode === 'beat' ? '#26283b' : CREAM; g.fillRect(0, 0, W, H);
    if (mode === 'beat') {
      // a video timeline: waveform track + beat clips, playhead in the middle
      sticker(g, 14, BELT - 46, W - 28, 92, '#34374f', 14, 2.5);
      g.strokeStyle = 'rgba(201,182,255,.5)'; g.lineWidth = 2; g.beginPath();
      for (let x = 20; x < W - 20; x += 4) { const a = Math.abs(Math.sin((x + S.t * speed) * 0.05) * Math.sin((x + S.t * speed) * 0.013)) * 30; g.moveTo(x, BELT - a); g.lineTo(x, BELT + a); }
      g.stroke();
      for (const it of items) { sticker(g, it.x - 14, BELT - 28, 28, 56, it.done ? (it.stamp ? MINT : '#6b6e8a') : LILAC, 8, 2.5); text(g, it.emoji, it.x, BELT, { size: 16 }); }
      g.fillStyle = PINK; rr(g, ZX - 3, BELT - 62, 6, 124, 3); g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
      text(g, '✂️', ZX, BELT - 74 + (stampAnim ? 6 : 0), { size: 22 });
      text(g, cfg.title || 'Cắt đúng nhịp', 14, 20, { size: 13, color: '#fff', align: 'left' });
      text(g, `Điểm ${Math.round(pts * 10) / 10}/${count}`, W - 14, 20, { size: 13, color: '#fff', align: 'right' });
      text(g, 'Bấm (hoặc Space) khi clip chạm vạch hồng', W / 2, H - 22, { size: 12, color: 'rgba(255,255,255,.75)' });
    } else {
      // belt
      sticker(g, -10, BELT + 34, W + 20, 30, '#8d93ab', 6, 3);
      g.strokeStyle = 'rgba(29,29,31,.35)'; g.lineWidth = 3; for (let x = -40 + (S.t * speed) % 40; x < W; x += 40) { g.beginPath(); g.moveTo(x, BELT + 38); g.lineTo(x + 14, BELT + 60); g.stroke(); }
      g.setLineDash([8, 6]); g.lineWidth = 2.5; g.strokeStyle = 'rgba(192,57,43,.6)'; rr(g, ZX - ZW / 2, BELT - 54, ZW, 92, 10); g.stroke(); g.setLineDash([]);
      for (const it of items) {
        g.save(); g.translate(it.x, BELT); g.rotate(Math.sin(it.x * 0.02) * 0.04);
        sticker(g, -44, -50, 88, 84, '#fff', 8, 2.5);
        text(g, it.emoji, 0, -30, { size: 20 });
        const words = it.label.split(' '); const l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
        text(g, l1, 0, -4, { size: 10.5, weight: 800, max: 80 }); text(g, l2, 0, 10, { size: 10.5, weight: 800, max: 80 });
        if (it.stamp) { g.rotate(-0.3); g.lineWidth = 3; g.strokeStyle = it.stamp === 'bad' ? '#c0392b' : '#d43a3a'; rr(g, -36, 14, 72, 22, 5); g.stroke(); text(g, cfg.stampText || 'ĐÃ KIỂM', 0, 25, { size: 11, weight: 900, color: '#d43a3a' }); }
        g.restore();
      }
      // the rubber stamp
      const sy = 22 + (stampAnim ? 34 : 0);
      sticker(g, ZX - 18, sy, 36, 34, '#8a5a2a', 8); sticker(g, ZX - 32, sy + 30, 64, 16, '#d43a3a', 5);
      text(g, cfg.title || 'Đóng dấu', 14, 20, { size: 13, align: 'left' });
      text(g, `✅ ${pts}${wrong ? ` · nhầm ${Math.ceil(wrong)}` : ''}`, W - 14, 20, { size: 13, align: 'right' });
      text(g, cfg.rule || 'Bấm (hoặc Space) khi tờ HỢP LỆ vào khung đỏ', W / 2, H - 16, { size: 12, color: '#555' });
    }
  });
  return {
    score: () => clamp01((pts - wrong) / Math.max(1, mode === 'beat' ? count : goodN)),
    info: () => ({ zx: ZX, items: items.filter((it) => !it.done).map((it) => ({ x: it.x, good: it.good })), pts, wrong, ended }),
    stop: () => { cv.removeEventListener('pointerdown', down); window.removeEventListener('keydown', kd, true); },
  };
}

// ---------------------------------------------------------------------------------------------- align
function align(S, cfg, done) {
  const { g, cv } = S;
  const labels = cfg.blocks || ['Tiêu đề', 'Biểu đồ', '3 ý chính', 'Nguồn'];
  const LAYOUT = [[60, 58, 300, 34], [60, 104, 170, 120], [242, 104, 118, 120], [60, 236, 300, 22], [376, 58, 90, 34]];
  const colors = [LILAC, SKY, BUTTER, MINT, PINK];
  const blocks = labels.slice(0, LAYOUT.length).map((l, i) => {
    const [tx, ty, w, h] = LAYOUT[i];
    return { l, tx, ty, w, h, x: tx + rnd(-60, 60), y: ty + rnd(-30, 30), c: colors[i], ok: false };
  });
  blocks.forEach((b) => { b.x = Math.max(4, Math.min(W - b.w - 4, b.x + (Math.random() < 0.5 ? -1 : 1) * 30)); b.y = Math.max(34, Math.min(H - b.h - 6, b.y)); });
  let drag = null, off = null, snapped = 0, twisted = !cfg.twist, total = blocks.length, bubble = 0, ended = false;
  const down = (e) => {
    const q = S.at(e);
    const b = [...blocks].reverse().find((o) => !o.ok && q.x >= o.x && q.x <= o.x + o.w && q.y >= o.y && q.y <= o.y + o.h);
    if (!b) return; try { cv.setPointerCapture(e.pointerId); } catch { /* synthetic or ended pointer */ }
    drag = b; off = { x: q.x - b.x, y: q.y - b.y }; blocks.splice(blocks.indexOf(b), 1); blocks.push(b);
  };
  const move = (e) => { if (!drag) return; const q = S.at(e); drag.x = q.x - off.x; drag.y = q.y - off.y; };
  const up = () => {
    if (!drag) return;
    const b = drag; drag = null;
    if (Math.hypot(b.x - b.tx, b.y - b.ty) < (cfg.snap || 22)) {
      b.x = b.tx; b.y = b.ty; b.ok = true; snapped++; sfx.choose(); S.pop(b.tx + b.w / 2, b.ty + b.h / 2, 'Tách!', '#2f8a4c', 16);
      if (blocks.every((o) => o.ok)) {
        if (!twisted) {
          twisted = true; bubble = 2.2; sfx.ding();
          const moved = [...blocks].sort(() => Math.random() - 0.5).slice(0, 2);
          moved.forEach((o) => { o.ok = false; o.x = Math.max(4, Math.min(W - o.w - 4, o.tx + rnd(-90, 90))); o.y = Math.max(34, Math.min(H - o.h - 6, o.ty + rnd(-50, 50))); });
          total += moved.length;
        } else if (!ended) { ended = true; sfx.good(); S.pop(W / 2, H / 2, cfg.doneText || 'Thẳng hàng tuyệt đối!', '#2f8a4c', 22); setTimeout(done, 700); }
      }
    }
  };
  cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  S.loop((dt) => {
    g.fillStyle = '#e9e4da'; g.fillRect(0, 0, W, H);
    sticker(g, 40, 40, 440, 236, '#fff', 8);
    g.strokeStyle = 'rgba(201,182,255,.35)'; g.lineWidth = 1; for (let x = 60; x < 470; x += 20) { g.beginPath(); g.moveTo(x, 44); g.lineTo(x, 272); g.stroke(); }
    for (const b of blocks) { g.setLineDash([6, 5]); g.lineWidth = 2; g.strokeStyle = b.ok ? 'rgba(47,138,76,.0)' : 'rgba(29,29,31,.4)'; rr(g, b.tx, b.ty, b.w, b.h, 6); g.stroke(); g.setLineDash([]); }
    for (const b of blocks) {
      sticker(g, b.x, b.y, b.w, b.h, b.c, 6, b.ok ? 2 : 3);
      text(g, (b.ok ? '✓ ' : '') + b.l, b.x + b.w / 2, b.y + b.h / 2, { size: 12, weight: 900, max: b.w - 8 });
    }
    if (bubble > 0) {
      bubble -= dt; g.globalAlpha = Math.min(1, bubble * 2);
      sticker(g, 120, 116, 280, 64, BUTTER, 16); text(g, cfg.twistLine || '"Chị có vài ý nhỏ…"', 260, 140, { size: 15, weight: 900 }); text(g, cfg.twistSub || '(hai khối vừa bị dời chỗ)', 260, 162, { size: 12, weight: 700 });
      g.globalAlpha = 1;
    }
    hud(g, `📐 Căn ${Math.min(snapped, total)}/${total}`, 'Kéo khối vào khung nét đứt');
  });
  return {
    score: () => clamp01(snapped / total),
    info: () => ({ blocks: blocks.map((b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2, tx: b.tx + b.w / 2, ty: b.ty + b.h / 2, ok: b.ok })), bubble, snapped, total }),
    stop: () => cv.removeEventListener('pointerdown', down),
  };
}

const GAMES = { shred, hold, whack, conveyor, align };
export const ACTION_GAMES = Object.keys(GAMES);

export function startAction(host, cfg, { onDone }) {
  const hint = cfg.hint || '';
  const S = stage(host, hint);
  let forced = null, finished = false;
  const done = () => { if (finished) return; finished = true; onDone(); };
  const impl = (GAMES[cfg.game] || shred)(S, cfg, done);
  return {
    score: () => (forced ?? impl.score()),
    stop: () => { S.alive = false; impl.stop(); },
    win: () => { forced = 1; done(); }, // test hook (e2e perfect play)
    info: () => (impl.info ? impl.info() : {}), // test hook (bots in tests/e2e/action-games.cjs)
  };
}
