// Hands-on "cooking game" mini-games drawn on a canvas (mouse + touch + Space). Used by ui/minigame.js type 'action'.
// startAction(host, cfg, { onDone }) -> { score(): 0..1, stop(), win() }.  cfg.game picks the mechanic:
//   shred    · swipe ALONG the grain to tear strips (khô gà xé). Across the grain = crumbs.
//   hold     · hold, release inside the green zone (skin 'seal' = heat-seal a bag, 'balloon' = inflate). Over = burnt/pop.
//   whack    · targets pop up; tap the good ones before they vanish, never the bad ones (cfg.target / cfg.avoid:
//              { emoji, labels[], hit?, miss?, color? }).
//   conveyor · items slide past a zone; tap when one is inside (mode 'stamp': only good ones; mode 'beat': timing).
//   align    · drag blocks into their dashed outlines; optional twist re-shuffles some ("vài ý nhỏ").
//   printjam · máy in kẹt giấy: drag each scrap out along its arrow, slowly (too fast = it tears), then press IN.
//   collate  · xếp trang & bấm ghim: tap pages 1→N (flip face-down ones first), staple when the rings meet.
//   wires    · cắm lại dây mạng: drag each plug to the port with the same colour and shape.
//   shredder · máy hủy giấy: drag each sheet down into the shredder or right into the filing cabinet.
//   hold has a third skin 'cup' (rót cà phê / trà tới vạch; cfg.orders = notes per cup).
// Everything is original sticker-style art: rounded shapes, thick ink outlines, pastel fills, emoji.
import { sfx } from '../core/audio.js';

const INK = '#1d1d1f', CREAM = '#fff8ef', MINT = '#b8f0d8', PEACH = '#ffc2b3', BUTTER = '#ffe9a0', LILAC = '#c9b6ff', SKY = '#bfe3ff', PINK = '#ffc6e0';
const W = 520, H = 300;
const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const shuffleArr = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

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
  const WORDS = {
    seal: { ok: 'Kín, đẹp!', under: 'Hở miệng túi!', over: 'Cháy túi!', hold: 'GIỮ để hàn', unit: '🔥 Túi' },
    balloon: { ok: 'Vừa đẹp!', under: 'Còn xẹp quá!', over: 'BỤP!', hold: 'GIỮ để bơm', unit: '🎈 Bóng' },
    cup: { ok: 'Vừa vạch!', under: 'Lưng ly rồi!', over: 'Tràn ra bàn!', hold: 'GIỮ để rót', unit: '☕ Ly' },
  }[skin] || {};
  let r = 0, p = 0, holding = false, state = 'idle', wait = 0, goods = 0, perfect = 0, rate = 0.5, zone = [0.6, 0.76], result = '';
  const next = () => { p = 0; state = 'idle'; holding = false; rate = rnd(0.38, 0.72) * (1 + r * 0.06); const c = rnd(0.5, 0.82); zone = [c - width / 2, c + width / 2]; };
  next();
  const judge = () => {
    if (state !== 'filling') return;
    holding = false;
    if (p >= zone[0] && p <= zone[1]) {
      goods++; const mid = (zone[0] + zone[1]) / 2, isP = Math.abs(p - mid) < width * 0.18; if (isP) perfect++;
      state = 'ok'; sfx.good(); result = isP ? 'Hoàn hảo!' : WORDS.ok;
      S.pop(W / 2 - 40, 46, result, '#2f8a4c', 22);
    } else { state = 'under'; sfx.bad(); result = WORDS.under; S.pop(W / 2 - 40, 70, result, '#c0392b', 20); }
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
      if (p > 1) { state = 'over'; holding = false; sfx.bad(); S.shake = 0.3; wait = 0.9; result = WORDS.over; S.pop(W / 2 - 40, 70, result, '#c0392b', 24);
        if (skin === 'seal') S.burst(W / 2 - 40, 110, '#555', 18, 90); else if (skin === 'cup') S.burst(W / 2 - 40, 96, cfg.color || '#7a4a2a', 18, 150); else S.burst(W / 2 - 40, 150, cfg.color || PINK, 22, 220); }
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
    } else if (skin === 'cup') {
      // a glass on a saucer: the drink rises with p, the target band is marked on the glass; order note on the left
      const top = 92, bot = 262, tw = 130, bw = 100, lvl = (k) => bot - 8 - Math.min(1.08, k) * (bot - top - 14);
      const xAt = (y, side) => cx + side * (bw / 2 + (tw - bw) / 2 * (bot - y) / (bot - top));
      if (cfg.orders) { const o = cfg.orders[r % cfg.orders.length]; sticker(g, 16, 44, 120, 46, BUTTER, 10, 2.5); text(g, o, 76, 67, { size: 12, weight: 900, max: 110 }); }
      if (state === 'filling') { g.strokeStyle = cfg.color || '#7a4a2a'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx + 8, 40); g.lineTo(cx + 8, lvl(p)); g.stroke(); }
      sticker(g, cx - 40, 34, 80, 26, '#c9c9d6', 8); // the pot / machine spout
      g.beginPath(); g.ellipse(cx + 3, bot + 7, 90, 12, 0, 0, 7); g.fillStyle = INK; g.fill();
      g.beginPath(); g.ellipse(cx, bot + 4, 90, 12, 0, 0, 7); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
      const ly = lvl(p);
      g.beginPath(); g.moveTo(xAt(ly, -1), ly); g.lineTo(xAt(ly, 1), ly); g.lineTo(xAt(bot, 1), bot); g.lineTo(xAt(bot, -1), bot); g.closePath();
      g.fillStyle = cfg.color || '#7a4a2a'; g.fill();
      if (p > 0.05) { g.fillStyle = 'rgba(255,240,220,.55)'; g.fillRect(xAt(ly, -1) + 4, ly, xAt(ly, 1) - xAt(ly, -1) - 8, 6); }
      g.beginPath(); g.moveTo(xAt(top, -1), top); g.lineTo(xAt(bot, -1), bot); g.lineTo(xAt(bot, 1), bot); g.lineTo(xAt(top, 1), top);
      g.lineWidth = 3.5; g.strokeStyle = INK; g.stroke();
      for (const z of zone) { const y = lvl(z); g.setLineDash([6, 4]); g.lineWidth = 2.5; g.strokeStyle = '#2f8a4c'; g.beginPath(); g.moveTo(xAt(y, -1) - 8, y); g.lineTo(xAt(y, 1) + 8, y); g.stroke(); g.setLineDash([]); }
      if (state === 'over') { g.fillStyle = cfg.color || '#7a4a2a'; g.beginPath(); g.ellipse(cx + 60, bot + 6, 40, 7, 0, 0, 7); g.fill(); }
      if (cfg.label) text(g, cfg.label, cx, top - 14, { size: 12, weight: 900 });
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
    text(g, state === 'idle' ? WORDS.hold : state === 'filling' ? 'THẢ ở vùng xanh!' : result, W - 75, my + mh + 18, { size: 12, weight: 900 });
    hud(g, `${WORDS.unit} ${Math.min(rounds, r + 1)}/${rounds}`, `Đạt: ${goods}${perfect ? ` · ✨${perfect}` : ''}`);
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

// ---------------------------------------------------------------------------------------------- printjam
// Máy in kẹt giấy: drag each crumpled scrap out along its arrow. Pull too fast and it tears (a stub stays behind).
function printjam(S, cfg, done) {
  const { g, cv } = S;
  const TEAR = cfg.tear || 650; // logical px per second, averaged over the last ~120 ms (single events are too jumpy)
  const dirs = [[0, 1], [0, 1], [-1, 0.25], [1, 0.25], [0, 1]];
  const scraps = Array.from({ length: cfg.jams || 3 }, (_, i) => {
    const [dx, dy] = dirs[(i + Math.floor(Math.random() * 5)) % dirs.length]; const L = Math.hypot(dx, dy);
    return { x: 150 + i * 95 + rnd(-10, 10), y: 150, dx: dx / L, dy: dy / L, pulled: 0, need: 90, size: 1, out: false, fly: 0, seed: Math.random() * 9 };
  });
  let samples = [];
  let grab = null, last = null, tears = 0, phase = 'pull', printT = 0, tension = 0, finished = false;
  const at = (sc) => ({ x: sc.x + sc.dx * sc.pulled, y: sc.y + sc.dy * sc.pulled });
  const down = (e) => {
    const q = S.at(e);
    if (phase === 'print') { if (Math.hypot(q.x - 420, q.y - 64) < 34) { phase = 'printing'; sfx.choose(); } return; }
    const sc = scraps.find((o) => !o.out && Math.hypot(q.x - at(o).x, q.y - at(o).y) < 40 * o.size + 10);
    if (!sc) return;
    try { cv.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
    grab = sc; last = { ...q, t: performance.now() }; samples = [];
  };
  const move = (e) => {
    if (!grab) return;
    const q = S.at(e), now = performance.now();
    const along = (q.x - last.x) * grab.dx + (q.y - last.y) * grab.dy;
    samples.push({ t: now, d: Math.max(0, along) });
    while (samples.length && now - samples[0].t > 120) samples.shift();
    const v = samples.reduce((a, x) => a + x.d, 0) / 0.12; // px/s over a fixed 120 ms window
    tension = tension * 0.6 + Math.min(1.4, v / TEAR) * 0.4;
    last = { ...q, t: now };
    if (v > TEAR) { // checked before the pull counts: a fast yank tears even on its last centimetre
      // torn: the pulled part comes away, a smaller stub stays stuck
      tears++; sfx.bad(); S.shake = 0.2; S.pop(at(grab).x, at(grab).y - 20, 'Roẹt! Rách rồi', '#c0392b', 16);
      S.burst(at(grab).x, at(grab).y, '#fff', 10, 120);
      grab.size = Math.max(0.45, grab.size * 0.7); grab.pulled = 0; grab = null; tension = 0;
      return;
    }
    if (along > 0) grab.pulled = Math.min(grab.need, grab.pulled + along);
    if (grab.pulled >= grab.need) { grab.out = true; grab.fly = 0.01; sfx.blip(1.4); S.pop(at(grab).x, at(grab).y - 20, 'Ra rồi!', '#2f8a4c', 16); grab = null; tension = 0; if (scraps.every((o) => o.out)) { phase = 'print'; sfx.ding(); } }
  };
  const up = () => { grab = null; tension = 0; };
  cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  S.loop((dt) => {
    g.fillStyle = CREAM; g.fillRect(0, 0, W, H);
    // printer body with the front panel open
    sticker(g, 60, 40, 400, 230, cfg.color || '#d9dcef', 22);
    sticker(g, 90, 92, 340, 130, '#3a3d55', 12, 2.5);
    for (const y of [138, 162]) { g.fillStyle = '#1f2133'; rr(g, 100, y - 9, 320, 18, 9); g.fill(); g.strokeStyle = '#555a7a'; g.lineWidth = 2; for (let x = 108 + (S.t * 30 % 14); x < 418; x += 14) { g.beginPath(); g.moveTo(x, y - 7); g.lineTo(x, y + 7); g.stroke(); } }
    text(g, cfg.label || 'MÁY IN TẦNG 2', 160, 64, { size: 13, weight: 900 });
    // print button
    const pulse = phase === 'print' ? 1 + Math.sin(S.t * 8) * 0.08 : 1;
    g.save(); g.translate(420, 64); g.scale(pulse, pulse);
    g.beginPath(); g.arc(2, 2, 22, 0, 7); g.fillStyle = INK; g.fill();
    g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fillStyle = phase === 'pull' ? '#bbb' : MINT; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
    text(g, 'IN', 0, 1, { size: 13, weight: 900 }); g.restore();
    // scraps
    for (const sc of scraps) {
      const p = at(sc);
      if (sc.out) { sc.fly += dt * 1.5; if (sc.fly > 1) continue; g.globalAlpha = 1 - sc.fly; }
      const ox = sc.out ? sc.dx * sc.fly * 160 : 0, oy = sc.out ? sc.dy * sc.fly * 160 - sc.fly * 60 : 0;
      g.save(); g.translate(p.x + ox, p.y + oy); g.rotate(Math.sin(sc.seed) * 0.4 + (sc.out ? sc.fly * 3 : 0)); g.scale(sc.size, sc.size);
      g.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, rr2 = 30 + Math.sin(k * 2.3 + sc.seed) * 7; g.lineTo(Math.cos(a) * rr2 * 1.1, Math.sin(a) * rr2 * 0.8); } g.closePath();
      g.fillStyle = '#fff'; g.fill(); g.lineWidth = 2.5; g.strokeStyle = INK; g.stroke();
      g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1.5; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(-18 + k * 6, -10 + k * 7); g.lineTo(14 - k * 4, -6 + k * 9); g.stroke(); }
      g.restore(); g.globalAlpha = 1;
      if (!sc.out) {
        // arrow showing which way to pull
        const ax = p.x + sc.dx * 48, ay = p.y + sc.dy * 48, a = Math.atan2(sc.dy, sc.dx);
        g.save(); g.translate(ax, ay); g.rotate(a); g.globalAlpha = 0.6 + Math.sin(S.t * 6) * 0.3;
        g.fillStyle = BUTTER; g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-10, -7); g.lineTo(6, -7); g.lineTo(6, -13); g.lineTo(20, 0); g.lineTo(6, 13); g.lineTo(6, 7); g.lineTo(-10, 7); g.closePath(); g.fill(); g.stroke();
        g.restore(); g.globalAlpha = 1;
      }
    }
    // tension meter while pulling
    if (grab) { const p = at(grab); const t = Math.min(1, tension); sticker(g, p.x - 34, p.y - 58, 68, 12, '#fff', 6, 2); g.fillStyle = t > 0.85 ? '#e74c3c' : t > 0.55 ? '#f5b041' : '#58d68d'; rr(g, p.x - 32, p.y - 56, 64 * t, 8, 4); g.fill(); }
    if (phase === 'printing') {
      printT += dt;
      for (let k = 0; k < 4; k++) { const tt = Math.min(1, Math.max(0, printT * 2 - k * 0.35)); if (tt > 0) sticker(g, 200 + k * 6, 230 + tt * 40 - k * 4, 120, 20, '#fff', 3, 2); }
      if (printT > 1.3 && !finished) { finished = true; sfx.good(); S.pop(260, 200, tears ? 'In xong (hơi nhàu)' : 'In xong, phẳng phiu!', '#2f8a4c', 20); setTimeout(done, 500); }
    }
    hud(g, `🖨️ Gỡ giấy kẹt · còn ${scraps.filter((o) => !o.out).length}`, tears ? `Rách: ${tears}` : 'Kéo TỪ TỪ theo mũi tên');
    if (phase === 'print') text(g, 'Bấm IN →', 360, 64, { size: 13, weight: 900, color: '#2f8a4c' });
  });
  return {
    score: () => clamp01(1 - tears * 0.25) * (phase === 'pull' ? scraps.filter((o) => o.out).length / scraps.length : 1),
    stop: () => cv.removeEventListener('pointerdown', down),
    info: () => ({ phase, tears, scraps: scraps.map((o) => ({ ...at(o), dx: o.dx, dy: o.dy, out: o.out, left: o.need - o.pulled })) }),
  };
}

// ---------------------------------------------------------------------------------------------- collate
// Xếp trang & bấm ghim: tap the pages 1 → N (face-down ones must be flipped first), then staple when the ring hits.
function collate(S, cfg, done) {
  const { g, cv } = S;
  const sets = cfg.sets || 2, N = Math.min(6, cfg.pages || 5);
  let set = 0, nextN = 1, pages = [], mistakes = 0, phase = 'pages', ring = 0, stapled = 0, wait = 0, finished = false;
  const deal = () => {
    // two rows that never overlap (pages are 82 × 100), left of the stack area
    const slots = shuffleArr([[24, 40], [122, 36], [220, 42], [56, 166], [154, 170], [252, 164]]).slice(0, N);
    pages = slots.map(([x, y], i) => ({ n: i + 1, x: x + rnd(-5, 5), y: y + rnd(-4, 4), a: rnd(-0.15, 0.15), down: Math.random() < 0.3, done: false, fly: 0 }));
    nextN = 1; phase = 'pages';
  };
  deal();
  const hit = (q) => [...pages].reverse().find((p) => !p.done && q.x >= p.x && q.x <= p.x + 82 && q.y >= p.y && q.y <= p.y + 100);
  const tap = (e) => {
    const q = S.at(e);
    if (phase === 'staple') {
      const d = Math.abs(ring - 22);
      if (d < 9) { stapled++; sfx.choose(); S.pop(400, 120, 'Cạch! Ghim đẹp', '#2f8a4c', 18); }
      else { mistakes++; sfx.bad(); S.pop(400, 120, 'Ghim lệch!', '#c0392b', 17); }
      phase = 'wait'; wait = 0.6; return;
    }
    if (phase !== 'pages') return;
    const p = hit(q); if (!p) return;
    if (p.down) { p.down = false; sfx.blip(0.8); return; } // flip it over first
    if (p.n === nextN) { p.done = true; p.fly = 0.01; nextN++; sfx.blip(1 + nextN * 0.08); if (nextN > N) { phase = 'staple'; ring = 70; } }
    else { mistakes++; sfx.bad(); S.shake = 0.15; S.pop(p.x + 40, p.y - 6, `Chưa tới trang ${p.n}!`, '#c0392b', 14); }
  };
  const kd = (e) => { if (e.code === 'Space' && phase === 'staple') { e.preventDefault(); e.stopPropagation(); tap({ clientX: -1, clientY: -1 }); } };
  cv.addEventListener('pointerdown', tap); window.addEventListener('keydown', kd, true);
  S.loop((dt) => {
    if (phase === 'staple') { ring -= dt * 55; if (ring < 8) { mistakes++; sfx.bad(); S.pop(400, 120, 'Lỡ nhịp ghim!', '#c0392b', 16); phase = 'wait'; wait = 0.6; } }
    if (phase === 'wait') { wait -= dt; if (wait <= 0) { set++; if (set >= sets) { if (!finished) { finished = true; setTimeout(done, 200); } phase = 'end'; } else deal(); } }
    g.fillStyle = '#e8dcc8'; g.fillRect(0, 0, W, H);
    for (let y = 30; y < H; y += 26) { g.strokeStyle = 'rgba(120,90,50,.12)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y + 4); g.stroke(); }
    // the stack area
    const sx = 360, sy = 110;
    g.setLineDash([6, 5]); g.lineWidth = 2; g.strokeStyle = 'rgba(29,29,31,.35)'; rr(g, sx, sy, 82, 100, 6); g.stroke(); g.setLineDash([]);
    const stacked = pages.filter((p) => p.done && p.fly >= 1).length;
    for (let k = 0; k < stacked; k++) sticker(g, sx + k * 1.5, sy - k * 1.5, 82, 100, '#fff', 4, 2);
    if (stacked) text(g, String(Math.min(N, stacked)), sx + 41 + stacked * 1.5, sy + 50 - stacked * 1.5, { size: 26, weight: 900, color: '#bbb' });
    for (const p of pages) {
      if (p.done) { p.fly = Math.min(1, p.fly + dt * 3); if (p.fly >= 1) continue; }
      const k = p.done ? p.fly : 0, x = p.x + (sx - p.x) * k, y = p.y + (sy - p.y) * k;
      g.save(); g.translate(x + 41, y + 50); g.rotate(p.a * (1 - k));
      sticker(g, -41, -50, 82, 100, p.down ? '#c9cde3' : '#fff', 4, 2.5);
      if (p.down) text(g, '↺', 0, 0, { size: 30, weight: 900, color: '#6b6e8a' });
      else { for (let l = 0; l < 5; l++) { g.fillStyle = '#d6d6de'; g.fillRect(-30, -34 + l * 10, l === 0 ? 40 : 60, 4); } text(g, String(p.n), 0, 26, { size: 26, weight: 900 }); }
      g.restore();
    }
    if (phase === 'staple') {
      g.beginPath(); g.arc(sx + 10, sy + 10, 22, 0, 7); g.fillStyle = 'rgba(184,240,216,.6)'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#2f8a4c'; g.stroke();
      g.beginPath(); g.arc(sx + 10, sy + 10, Math.max(1, ring), 0, 7); g.lineWidth = 3; g.strokeStyle = '#c0392b'; g.stroke();
      text(g, 'Bấm khi vòng đỏ khớp vòng xanh!', sx + 40, sy - 22, { size: 12, weight: 900 });
    }
    hud(g, `📑 Bộ ${Math.min(sets, set + 1)}/${sets} · tới trang ${Math.min(N, nextN)}`, mistakes ? `Lỗi: ${mistakes}` : 'Lật trang úp ↺ trước');
  });
  return {
    score: () => clamp01((Math.min(set, sets) / sets) - mistakes * 0.12 + (phase === 'end' ? 0 : 0)),
    stop: () => { cv.removeEventListener('pointerdown', tap); window.removeEventListener('keydown', kd, true); },
    info: () => ({ phase, nextN, ring, pages: pages.map((p) => ({ n: p.n, x: p.x + 41, y: p.y + 50, down: p.down, done: p.done })) }),
  };
}

// ---------------------------------------------------------------------------------------------- wires
// Cắm lại dây mạng: drag from each left plug to the port of the same colour + shape on the right.
function wires(S, cfg, done) {
  const { g, cv } = S;
  const KINDS = [['#e74c3c', '●'], ['#3498db', '▲'], ['#f1c40f', '■'], ['#2ecc71', '◆'], ['#9b59b6', '★']].slice(0, cfg.count || 4);
  const left = KINDS.map((k, i) => ({ k: i, x: 90, y: 70 + i * (190 / (KINDS.length - 1 || 1)), done: false }));
  const order = shuffleArr(KINDS.map((_, i) => i));
  const right = order.map((k, i) => ({ k, x: 430, y: 70 + i * (190 / (KINDS.length - 1 || 1)) }));
  let drag = null, pos = null, mistakes = 0, links = 0, finished = false;
  const down = (e) => { const q = S.at(e); const l = left.find((o) => !o.done && Math.hypot(q.x - o.x, q.y - o.y) < 26); if (!l) return; try { cv.setPointerCapture(e.pointerId); } catch { /* synthetic */ } drag = l; pos = q; };
  const move = (e) => { if (drag) pos = S.at(e); };
  const up = (e) => {
    if (!drag) return; const q = e ? S.at(e) : pos; const l = drag; drag = null;
    const rp = right.find((o) => Math.hypot(q.x - o.x, q.y - o.y) < 30);
    if (!rp) return;
    if (rp.k === l.k && !left.some((o) => o.done && o.k === rp.k)) { l.done = true; l.to = rp; links++; sfx.choose(); S.burst(rp.x, rp.y, MINT, 8, 100); S.pop(rp.x - 40, rp.y - 18, 'Tách! Đèn xanh', '#2f8a4c', 14); if (left.every((o) => o.done) && !finished) { finished = true; sfx.good(); setTimeout(done, 600); } }
    else { mistakes++; sfx.bad(); S.shake = 0.2; S.burst(rp.x, rp.y, '#f5b041', 10, 140); S.pop(rp.x - 40, rp.y - 18, 'Chập! Sai cổng', '#c0392b', 14); }
  };
  cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', () => { drag = null; });
  const cable = (a, b, col) => { g.strokeStyle = INK; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(a.x, a.y); g.bezierCurveTo(a.x + 120, a.y, b.x - 120, b.y, b.x, b.y); g.stroke(); g.strokeStyle = col; g.lineWidth = 5; g.stroke(); };
  S.loop(() => {
    g.fillStyle = '#2b2d42'; g.fillRect(0, 0, W, H);
    sticker(g, 360, 40, 120, 240, '#3c3f5c', 14, 2.5); text(g, cfg.label || 'SWITCH', 420, 30, { size: 12, color: '#fff' });
    sticker(g, 40, 40, 100, 240, '#3c3f5c', 14, 2.5); text(g, cfg.from || 'DÂY', 90, 30, { size: 12, color: '#fff' });
    for (const l of left) if (l.done) cable(l, l.to, KINDS[l.k][0]);
    if (drag && pos) cable(drag, pos, KINDS[drag.k][0]);
    for (const r2 of right) { const lit = left.some((o) => o.done && o.k === r2.k); sticker(g, r2.x - 22, r2.y - 16, 44, 32, lit ? '#1e8449' : '#1f2133', 6, 2.5); text(g, KINDS[r2.k][1], r2.x, r2.y + 1, { size: 16, color: KINDS[r2.k][0] }); g.beginPath(); g.arc(r2.x + 32, r2.y, 4, 0, 7); g.fillStyle = lit ? '#58d68d' : '#555'; g.fill(); }
    for (const l of left) { g.beginPath(); g.arc(l.x + 2, l.y + 2, 17, 0, 7); g.fillStyle = INK; g.fill(); g.beginPath(); g.arc(l.x, l.y, 17, 0, 7); g.fillStyle = KINDS[l.k][0]; g.fill(); g.lineWidth = 2.5; g.strokeStyle = INK; g.stroke(); text(g, KINDS[l.k][1], l.x, l.y + 1, { size: 14, color: '#fff' }); }
    text(g, `🔌 ${cfg.title || 'Cắm lại dây mạng'} · ${links}/${left.length}`, W / 2, 18, { size: 13, color: '#fff' });
    text(g, mistakes ? `Chập: ${mistakes}` : 'Kéo từ dây trái sang cổng cùng màu, cùng hình', W / 2, H - 12, { size: 12, color: 'rgba(255,255,255,.75)' });
  });
  return {
    score: () => clamp01(links / left.length - mistakes * 0.2),
    stop: () => cv.removeEventListener('pointerdown', down),
    info: () => ({ left: left.map((o) => ({ x: o.x, y: o.y, k: o.k, done: o.done })), right: right.map((o) => ({ x: o.x, y: o.y, k: o.k })) }),
  };
}

// ---------------------------------------------------------------------------------------------- shredder
// Máy hủy giấy: one sheet at a time — drag it DOWN into the shredder or RIGHT into the filing cabinet.
function shredder(S, cfg, done) {
  const { g, cv } = S;
  const SH = cfg.target || { labels: ['Bản nháp có số CCCD', 'Bảng lương in thừa', 'Mật khẩu viết trên giấy', 'CV hết hạn lưu trữ', 'Báo giá cũ đã hủy'] };
  const KEEP = cfg.avoid || { labels: ['Hợp đồng gốc đã ký', 'Hóa đơn tháng này', 'Biên bản bàn giao', 'Giấy bảo hành máy'] };
  const count = cfg.count || 8;
  const deck = Array.from({ length: count }, () => { const s2 = Math.random() < 0.55; return { shred: s2, label: pick((s2 ? SH : KEEP).labels) }; });
  let i = 0, x = 0, y = 0, drag = null, right = 0, wrong = 0, anim = null, strips = [], finished = false;
  const HX = 200, HY = 140;
  const down = (e) => { if (anim || i >= deck.length) return; const q = S.at(e); if (Math.abs(q.x - (HX + x)) < 80 && Math.abs(q.y - (HY + y)) < 70) { try { cv.setPointerCapture(e.pointerId); } catch { /* synthetic */ } drag = { x: q.x - x, y: q.y - y }; } };
  const move = (e) => { if (!drag) return; const q = S.at(e); x = q.x - drag.x; y = q.y - drag.y; };
  const up = () => {
    if (!drag) return; drag = null;
    const to = y > 60 && y > x ? 'shred' : x > 80 ? 'keep' : null;
    if (!to) { x = 0; y = 0; return; }
    const d = deck[i], ok = (to === 'shred') === d.shred;
    if (ok) { right++; sfx.choose(); S.pop(to === 'shred' ? 200 : 420, 120, to === 'shred' ? 'Rẹt rẹt!' : 'Lưu rồi!', '#2f8a4c', 16); }
    else { wrong++; sfx.bad(); S.shake = 0.2; S.pop(to === 'shred' ? 200 : 420, 120, d.shred ? 'Giấy mật mà để lại!' : 'Hủy nhầm hồ sơ gốc!', '#c0392b', 15); }
    anim = { to, t: 0 };
  };
  cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  S.loop((dt) => {
    g.fillStyle = CREAM; g.fillRect(0, 0, W, H);
    // shredder (bottom) and cabinet (right)
    sticker(g, 110, 236, 180, 60, '#8d93ab', 10); g.fillStyle = INK; rr(g, 130, 236, 140, 8, 3); g.fill(); text(g, '🗑️ MÁY HỦY ↓', 200, 272, { size: 13, color: '#fff' });
    sticker(g, 400, 70, 100, 170, '#c9a27a', 10); for (let k = 0; k < 3; k++) { sticker(g, 412, 84 + k * 50, 76, 40, '#e0bf98', 6, 2); g.fillStyle = INK; rr(g, 440, 100 + k * 50, 20, 6, 3); g.fill(); } text(g, 'TỦ LƯU →', 450, 58, { size: 13 });
    for (let k = strips.length - 1; k >= 0; k--) { const s2 = strips[k]; s2.y += dt * 120; s2.life -= dt; if (s2.life <= 0) { strips.splice(k, 1); continue; } g.fillStyle = '#fff'; g.strokeStyle = INK; g.lineWidth = 1; rr(g, s2.x, s2.y, 5, 22, 2); g.fill(); g.stroke(); }
    if (anim) {
      anim.t += dt * 3;
      if (anim.to === 'shred') { y = 60 + anim.t * 120; if (Math.random() < 0.6) strips.push({ x: 140 + Math.random() * 120, y: 244, life: 0.6 }); } else { x = 80 + anim.t * 220; }
      if (anim.t >= 1) { anim = null; i++; x = 0; y = 0; if (i >= deck.length && !finished) { finished = true; setTimeout(done, 300); } }
    }
    if (i < deck.length) {
      const d = deck[i];
      g.save(); if (anim && anim.to === 'shred') { g.beginPath(); g.rect(0, 0, W, 240); g.clip(); }
      g.translate(HX + x, HY + y); g.rotate(x * 0.002);
      sticker(g, -70, -62, 140, 124, '#fff', 6, 2.5);
      for (let l = 0; l < 4; l++) { g.fillStyle = '#e1e1ea'; g.fillRect(-54, 10 + l * 10, l === 3 ? 60 : 108, 4); }
      const words = d.label.split(' '); const half = Math.ceil(words.length / 2);
      text(g, words.slice(0, half).join(' '), 0, -34, { size: 13, weight: 900, max: 124 }); text(g, words.slice(half).join(' '), 0, -16, { size: 13, weight: 900, max: 124 });
      g.restore();
      if (!anim) text(g, `Tờ ${i + 1}/${deck.length}`, HX, 218, { size: 12, color: '#777' });
    }
    hud(g, `🗂️ ${cfg.title || 'Hủy hay lưu?'}`, `✅ ${right}${wrong ? ` · sai ${wrong}` : ''}`);
  });
  return {
    score: () => clamp01((right - wrong) / deck.length),
    stop: () => cv.removeEventListener('pointerdown', down),
    info: () => ({ i, n: deck.length, cur: deck[i] ? { shred: deck[i].shred, x: HX + x, y: HY + y } : null, busy: !!anim }),
  };
}

const GAMES = { shred, hold, whack, conveyor, align, printjam, collate, wires, shredder };
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
