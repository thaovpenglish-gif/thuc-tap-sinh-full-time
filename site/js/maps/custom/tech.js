// Nợ Kỹ Thuật Labs — open-plan startup floor 30 × 20 m, polished concrete, exposed ceiling, neon.
//   South: glass doors, self check-in kiosk (broken face-ID) + Chị Hoa's counter, beanbag lounge (SW), Thần Tài altar.
//   Centre: the glass meeting box "Bún Bò" in the middle of the floor; ping-pong table (E).
//   West: two squad pods (desks back to back). North: Kevin's standing desk + OKR wall, kanban + stand-up circle,
//   Thạc's desk by the window. North-east: glass server room (Anh Lộc). East wall: coffee bar + high table, COO desk + safe.
// Coordinates: x east, z south; spot rotY 0 faces south (+z), PI faces north, PI/2 faces east, −PI/2 west.
import { createKit, FLOORS } from '../kit3d.js';

const PI = Math.PI;
const H = 3.4;

const S = {
  boss: [-6.5, -8.15, 0],          // Kevin at his standing desk, OKR wall behind
  senior: [6.5, -7.75, 0],         // Thạc (CTO) by the window, next to the server room
  corner: [-2.3, -6.6, PI / 2],    // Chị Diệp next to the kanban
  corner2: [-2.4, -5.2, PI / 2],
  n1: [-12.0, -6.35, 0],
  n6: [-10.4, -6.35, 0],           // Khải
  c3: [-8.8, -6.35, 0],            // Tùng
  c1: [-10.4, -4.1, PI],           // Nguyệt
  n5: [-12.0, 0.2, 0],             // Hiếu (BrSE)
  n4: [-10.4, 0.2, 0],             // Vy
  c2: [-8.8, 0.2, 0],              // Châu
  n2: [-10.4, 2.45, PI],           // Duy
  n3: [-8.8, 2.45, PI],
  it: [10.0, -5.85, 0],            // Anh Lộc in the server room doorway
  finance: [12.5, -3.55, 0],       // Chị Thảo (COO) + the "Runway" safe
  hr: [9.5, 6.85, 0],              // Chị Ngân near the door
  reception: [5.0, 7.75, 0],       // Chị Hoa behind the check-in counter
  pantry: [13.5, 5.6, -PI / 2],
  pantry_bao: [11.4, 5.8, PI / 2],
  meeting_head: [-2.3, 0, PI / 2], // glass box: head of the table (west end)
  mr_n1: [-0.6, -1.15, 0],
  mr_n2: [-0.6, 1.15, PI],
  x1: [6.5, -1.6, -PI / 2], x2: [-5.6, 4.4, PI / 2], x3: [1.6, 6.0, PI],
  giao: [-2.4, 8.6, PI],
  reception_side: [3.4, 8.6, -PI / 2],
  window: [3.0, -9.2, PI],
  scrum: [0, -6.9, 0],
  lunch1: [11.4, 2.65, 0], lunch2: [12.0, 2.65, 0], lunch3: [12.6, 2.65, 0], lunch4: [11.4, 4.35, PI], lunch5: [12.6, 4.35, PI],
};
{
  const cx = 0, cz = -5.2, rx = 2.6, rz = 1.65;
  [0.62, 0.78, 0.94, 1.1, 1.26, 0.38, 0.22, 0.06, -0.1, -0.26].forEach((a, i) => {
    const x = cx + rx * Math.cos(a * PI), z = cz + rz * Math.sin(a * PI);
    S['su' + (i + 1)] = [x, z, Math.atan2(cx - x, cz - z)];
  });
}
S.su_dat = S.scrum; S.coach = S.scrum; S.mr_head = S.meeting_head;
Object.assign(S, {
  tuyet: S.boss, thu: S.n1, nhi: S.n2, linh: S.n3, an: S.n4, minh: S.n5, ha: S.n6, long: S.c1, trang: S.c2, bao: S.c3,
  mai: S.senior, han: S.corner, khang: S.corner2, quynh: S.finance, gam: S.reception, binh: S.it, phuong: S.hr, dat: S.scrum,
});

export function buildTech(scene, th) {
  const K = createKit(scene);
  const { THREE, box, cyl, sphere, plane, basic, glow, collideRect, floorZone, ceiling, wall, glassWall, sign, poster, desk, plant, ceilingFan, stool, interact, canvasTex, textTexture, roundRect, INK } = K;
  void ceilingFan; void stool;
  const L = (id, d) => (th.labels && th.labels[id]) || d;
  const signs = th.signs || {};
  const D = th.desks || {};
  const C = { wall: '#f4f6fb', dark: '#2b3040', navy: '#1f2a44', blue: '#3d7bff', neon: '#39ff88', pink: '#ff4fa3', purple: '#8a6bff', yellow: '#ffd166' };
  const neon = (text, color, x, y, z, ry, w, h = w / 4, size = 72) => plane(w, h, basic(textTexture([text], { w: 1024, h: Math.round(1024 * h / w), bg: '#1b1f2a', fg: color, sizes: [size], weights: [900], border: color })), x, y, z, ry);

  // ---------- floors & ceiling ----------
  floorZone(-15, -10, 15, 10, FLOORS.concrete('#cfd3da', 'rgba(40,50,70,0.05)'), 3);
  floorZone(-13.2, -7.2, -7.4, -3.0, FLOORS.carpet('#4b67b8'), 1, 0.006);    // squad pod north
  floorZone(-13.2, -0.6, -7.4, 3.4, FLOORS.carpet('#6a55c9'), 1, 0.006);     // squad pod south
  floorZone(-15, 4.8, -8.6, 10, FLOORS.carpet('#2fbf9a'), 1, 0.006);         // lounge
  floorZone(10.2, 0.2, 15, 6.8, FLOORS.planks('#d9b48a', '#cfa77a'), 1.2, 0.006); // coffee bar
  floorZone(9, -10, 15, -5, FLOORS.checker('#e9edf3', '#cfd6e2'), 0.6, 0.006); // server room raised floor
  floorZone(-2.6, -5.2 - 2.2, 2.6, -5.2 + 2.2, '#ffd166', 1, 0.005);          // stand-up spot (yellow)
  floorZone(-2.5, -5.2 - 2.1, 2.5, -5.2 + 2.1, FLOORS.concrete('#e7e1c9'), 2, 0.006);
  ceiling(-15, -10, 15, 10, H, '#3b4150');
  for (const z of [-6, 0, 6]) { const d = cyl(0.17, 0.17, 30, '#b9c0cc', 0, 0, z, 16, 0.01); d.rotation.z = PI / 2; d.position.y = H - 0.22; }
  for (let x = -12; x <= 12; x += 4) for (const z of [-7.5, -3, 3, 7.5]) {
    cyl(0.01, 0.01, 0.6, '#222222', x, H - 0.6, z, 4, 0);
    cyl(0.18, 0.28, 0.25, C.dark, x, H - 0.85, z, 14, 0.012);
    sphere(0.1, glow('#fff3c4'), x, H - 0.88, z, 0);
  }

  // ---------- outer shell ----------
  wall(-15, 10, 15, 10, C.wall, { h: H, gaps: [[-1.5, 1.5]], doorH: 2.6 });
  glassWall(-1.5, 10, 1.5, 10, { h: 2.6, frame: C.dark });
  wall(-15, -10, 15, -10, C.wall, { h: H, gaps: [[-1.5, 8.5]], lintel: false });
  box(10, 0.8, 0.2, '#dfe6f2', 3.5, 0, -10, true, 0, 0.02);             // window sill
  box(10, H - 2.8, 0.2, C.wall, 3.5, 2.8, -10, false, 0, 0);
  plane(10, 2.0, new THREE.MeshBasicMaterial({ color: '#cfe9ff', transparent: true, opacity: 0.25, depthWrite: false }), 3.5, 1.8, -10, 0);
  for (let x = -1.5; x <= 8.5; x += 2) box(0.08, 2.0, 0.1, C.dark, x, 0.8, -10, false, 0, 0.012);
  const city = canvasTex(2048, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#9fd0ff'); grd.addColorStop(1, '#e8f3ff');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    let x = 0, n = 0;
    while (x < w) {
      const bw = 90 + ((n * 53) % 140), bh = 200 + ((n * 97) % 260);
      g.fillStyle = ['#7d8db0', '#9aa7c7', '#6c7aa0', '#b4c0dc'][n % 4]; g.fillRect(x, h - bh, bw, bh); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(x, h - bh, bw, bh);
      g.fillStyle = 'rgba(255,255,255,0.6)'; for (let wy = h - bh + 14; wy < h - 10; wy += 26) for (let wx = x + 10; wx < x + bw - 12; wx += 20) g.fillRect(wx, wy, 9, 14);
      x += bw + 6; n++;
    }
    g.fillStyle = '#ffffff'; roundRect(g, 1200, 70, 560, 110, 18); g.fill(); g.stroke();
    g.fillStyle = INK; g.font = '900 52px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText(th.skyline || 'SHIP NHANH', 1480, 142);
  });
  plane(36, 9, new THREE.MeshBasicMaterial({ map: city }), 3.5, 2.0, -15, 0);
  wall(-15, -10, -15, 10, C.wall, { h: H });
  wall(15, -10, 15, 10, C.wall, { h: H });
  collideRect(-1.5, 1.5, 10.05, 10.5);

  // ================= ENTRANCE (south) =================
  // self check-in kiosk
  box(0.5, 0.06, 0.4, C.dark, 2.2, 0, 8.2, false);
  cyl(0.05, 0.05, 1.0, '#9aa3ad', 2.2, 0, 8.2, 8, 0.01);
  box(0.6, 0.8, 0.08, C.dark, 2.2, 1.0, 8.2, true, 0, 0.02);
  poster(['CHECK-IN', 'Quét khuôn mặt', '⚠ đang lỗi từ T3'], { w: 512, h: 640, bg: '#1b1f2a', fg: C.neon, sizes: [64, 40, 36], border: C.neon }, 2.2, 1.4, 8.25, 0, 0.52, 0.65);
  // Chị Hoa's counter with the "Uptime" cactus
  box(1.6, 1.05, 0.6, '#ffffff', 5.0, 0, 8.4, true);
  box(1.7, 0.05, 0.7, C.yellow, 5.0, 1.05, 8.4, false);
  poster([th.logo ? th.logo[0] : 'NỢ KỸ THUẬT LABS'], { w: 1024, h: 160, bg: C.navy, fg: '#ffffff', sizes: [64] }, 5.0, 0.55, 8.71, 0, 1.5, 0.24);
  cyl(0.09, 0.07, 0.14, '#ff9f7a', 5.6, 1.1, 8.35, 12, 0.01); cyl(0.05, 0.05, 0.22, '#3e9b57', 5.6, 1.24, 8.35, 10, 0.01);
  interact('plant', L('plant', 'Xem cây xương rồng "uptime"'), 5.6, 1.2, 8.35);
  sign(signs.reception || 'LỄ TÂN · HỎI CHỊ HOA', '#ffe9a0', 5.0, 2.4, 8.9, PI, 1.6);
  // the big logo wall behind the door (seen when you walk in)
  const logo = textTexture(th.logo || ['NỢ KỸ THUẬT LABS'], { w: 1024, h: 512, bg: C.navy, fg: '#ffffff', sizes: [86, 40, 32], weights: [900, 700, 500] });
  box(0.12, 2.2, 3.6, C.navy, -14.9, 0.5, 2.6, false, 0, 0.02);
  plane(3.5, 1.75, basic(logo), -14.82, 1.6, 2.6, PI / 2);
  neon(th.banner || 'MOVE FAST · BREAK PROD', C.pink, 0, 2.9, 9.88, PI, 5, 0.55, 64);
  // Thần Tài altar by the door (with the 2022 DB backup)
  box(1.0, 0.7, 0.55, '#d63031', -4.0, 0, 9.5, true);
  box(1.1, 0.06, 0.62, '#ffe08a', -4.0, 0.7, 9.5, false);
  sphere(0.11, '#ffd25a', -4.25, 0.9, 9.55); sphere(0.11, '#ffd25a', -3.75, 0.9, 9.55);
  box(0.12, 0.04, 0.05, '#3d7bff', -4.0, 0.76, 9.35, false, 0.4, 0.006);
  const bulbs = [];
  for (let i = 0; i < 6; i++) bulbs.push(sphere(0.03, glow('#ff6f8a'), -4.45 + i * 0.18, 1.38, 9.74, 0));
  K.animated.push((t) => bulbs.forEach((b, i) => b.material.color.set(((Math.floor(t * 3) + i) % 2) ? '#ff6f8a' : '#ffe08a')));
  interact('altar', L('altar', 'Thắp hương Thần Tài'), -4.0, 0.9, 9.3);

  // ---------- lounge (south-west): beanbags, sofa, TV, hiring standee, foosball ----------
  box(0.9, 0.45, 3.2, C.purple, -14.3, 0, 7.4, true); box(0.25, 0.5, 3.2, C.purple, -14.7, 0.45, 7.4, false);
  for (const [x, z, c] of [[-12.2, 6.2, C.yellow], [-11.4, 8.3, C.pink], [-10.0, 6.6, '#4fd1ff']]) { const b = sphere(0.45, c, x, 0.3, z, 0.02); b.scale.y = 0.65; K.collideCircle(x, z, 0.4); }
  box(1.6, 0.9, 0.06, '#111111', -12.0, 1.2, 9.86, false, 0, 0.015);
  poster(['DEMO DAY 🚀', 'App Lúa v4.0'], { w: 512, h: 288, bg: '#111827', fg: C.neon, sizes: [56, 40], border: null }, -12.0, 1.65, 9.82, PI, 1.5, 0.84);
  const st = (x, z, lines, col) => { box(0.7, 0.06, 0.25, '#333344', x, 0, z, false); plane(0.7, 1.7, basic(textTexture(lines, { w: 256, h: 620, bg: col, sizes: [40, 30, 30, 30] })), x, 0.95, z, 0); collideRect(x - 0.35, x + 0.35, z - 0.15, z + 0.15); };
  st(-9.0, 9.2, ["WE'RE HIRING!", 'Flat. Fast. Fun.', '(đang freeze', 'tuyển dụng)'], '#bfe3ff');
  // foosball table ("ghế bi lắc")
  box(1.3, 0.85, 0.75, '#2e7d32', -6.0, 0, 6.6, true);
  box(1.36, 0.08, 0.8, '#5d4037', -6.0, 0.85, 6.6, false);
  for (let i = 0; i < 6; i++) { const r = cyl(0.015, 0.015, 1.2, '#cccccc', -6.5 + i * 0.2, 0, 6.6, 6, 0.005); r.rotation.x = PI / 2; r.position.y = 0.95; }
  interact('redchair', L('redchair', 'Nhìn bàn bi lắc'), -6.0, 0.9, 6.6);
  neon(th.bossWall || 'Think Big', C.yellow, -14.88, 2.45, 7.4, PI / 2, 3.4, 0.8, 130);
  box(1.2, 0.35, 0.7, '#ffffff', -12.6, 0, 7.4, true); box(1.25, 0.04, 0.75, C.yellow, -12.6, 0.35, 7.4, false);
  for (let i = 0; i < 3; i++) box(0.3, 0.06, 0.22, ['#ff4fa3', '#4fd1ff', '#39d98a'][i], -12.9 + i * 0.3, 0.39, 7.35, false, 0.2, 0.006);
  box(0.4, 1.6, 1.4, '#ffffff', -14.7, 0, 5.4, true);
  for (let s2 = 0; s2 < 3; s2++) for (let i = 0; i < 3; i++) box(0.3, 0.3, 0.3, ['#ffd166', '#ff4fa3', '#8a6bff'][(s2 + i) % 3], -14.6, 0.2 + s2 * 0.5, 4.95 + i * 0.45, false, 0, 0.008);
  plant(-9.0, 5.4, { s: 1.0, pot: '#2b3040', leaf: '#3e9b57' });

  // ================= GLASS MEETING BOX (centre) =================
  glassWall(-3, -2, 3, -2, { frame: C.dark });
  glassWall(-3, -2, -3, 2, { frame: C.dark });
  glassWall(3, -2, 3, 2, { frame: C.dark });
  glassWall(-3, 2, 1.2, 2, { frame: C.dark });
  glassWall(2.6, 2, 3, 2, { frame: C.dark });
  box(6.1, 0.12, 4.1, C.dark, 0, 2.6, 0, false, 0, 0.012);
  box(3.6, 0.06, 1.1, '#ffffff', -0.4, 0.72, 0, false, 0, 0.02);
  for (const dx of [-1.6, 0.8]) box(0.08, 0.72, 0.9, C.dark, -0.4 + dx, 0, 0, false, 0, 0.01);
  collideRect(-2.2, 1.4, -0.55, 0.55);
  for (let i = 0; i < 3; i++) for (const z of [-1.0, 1.0]) { const x = -1.6 + i * 1.1; box(0.45, 0.1, 0.45, ['#3d7bff', '#ff4fa3', '#39d98a'][i], x, 0.42, z, false); box(0.45, 0.5, 0.08, ['#3d7bff', '#ff4fa3', '#39d98a'][i], x, 0.5, z + (z < 0 ? -0.22 : 0.22), false); }
  box(1.6, 0.9, 0.05, '#111111', -0.4, 1.2, -1.95, false, 0, 0.012);
  poster(['SPRINT REVIEW', 'Velocity: ↓ (đổi cách tính)'], { w: 512, h: 288, bg: '#111827', fg: '#ffffff', sizes: [52, 34], border: null }, -0.4, 1.65, -1.91, 0, 1.5, 0.84);
  box(0.45, 0.45, 0.45, C.yellow, 2.0, 0, 0, false, 0, 0.02);
  interact('interview', L('interview', 'Ngồi vào ghế phòng họp kính'), 2.0, 0.8, 0);
  sign(signs.meeting || 'PHÒNG HỌP', '#bfe3ff', 0, 2.95, 2.06, 0, 2.0);
  sign(signs.meeting || 'PHÒNG HỌP', '#bfe3ff', 0, 2.95, -2.06, PI, 2.0);

  // ================= SQUAD PODS (west) =================
  const dk = (x, z, f, slot, chair) => { const d = D[slot]; desk(x, z, f, { plate: d && d[0], screen: d && d[1] ? [d[1], d[2] || '#3d7bff'] : null, chair, top: '#ffffff', leg: C.dark }); };
  dk(-12.0, -5.6, -1, 'n1', '#9aa0ad'); dk(-10.4, -5.6, -1, 'n6', '#3d7bff'); dk(-8.8, -5.6, -1, 'c3', '#4fd1ff');
  dk(-12.0, -4.85, 1, 'spare2', '#8a6bff'); dk(-10.4, -4.85, 1, 'c1', '#ff4fa3'); dk(-8.8, -4.85, 1, 'me', C.yellow);
  interact('desk', L('desk', 'Ngồi vào bàn mình'), -8.8, 0.8, -4.3);
  dk(-12.0, 0.9, -1, 'n5', '#5b6bd8'); dk(-10.4, 0.9, -1, 'n4', '#ff7ac8'); dk(-8.8, 0.9, -1, 'c2', C.yellow);
  dk(-12.0, 1.65, 1, 'spare', '#9aa0ad'); dk(-10.4, 1.65, 1, 'n2', '#39d98a'); dk(-8.8, 1.65, 1, 'n3', '#8a6bff');
  sign('SQUAD LÚA · CORE', '#bfe3ff', -10.4, 2.75, -5.2, 0, 2.0);
  sign('SQUAD GROWTH + AI', '#e3d9ff', -10.4, 2.75, 1.3, 0, 2.0);
  for (const z of [-5.2, 1.3]) { cyl(0.008, 0.008, 0.4, '#222', -11.1, 2.95, z, 4, 0); cyl(0.008, 0.008, 0.4, '#222', -9.7, 2.95, z, 4, 0); }
  // japanese project flag on Hiếu's desk
  cyl(0.008, 0.008, 0.3, '#666', -12.5, 0.78, 0.8, 4, 0); plane(0.2, 0.13, basic(textTexture(['●'], { w: 96, h: 64, bg: '#ffffff', fg: '#e0303a', sizes: [44], border: '#999', radius: 4 })), -12.4, 1.02, 0.8, 0);

  // ================= NORTH: Kevin, OKR wall, kanban + stand-up, Thạc =================
  desk(-6.5, -7.4, -1, { plate: 'Kevin · CEO', screen: [['Pitch deck', 'v47_FINAL'], '#ffd166'], chair: null, top: '#ffffff', leg: C.dark });
  sign(signs.boss || 'CEO', C.yellow, -6.5, 2.6, -9.88, 0, 1.4);
  const okr = textTexture(th.whiteboard || ['OKR'], { w: 768, h: 512, bg: '#ffffff', fg: '#3d4bd8', sizes: [64, 46, 40, 40, 34], weights: [900, 800, 700, 700, 500], align: 'left', pad: 40 });
  box(2.4, 1.5, 0.05, '#ffffff', -3.2, 0.8, -9.86, false, 0, 0.02);
  plane(2.3, 1.4, basic(okr), -3.2, 1.55, -9.82, 0);
  interact('okr', L('okr', 'Đọc OKR quý'), -3.2, 1.4, -9.6);
  // kanban (free-standing)
  const scrum = th.scrum || { cols: ['TODO', 'DOING', 'DONE'], notes: [[], [], []] };
  const kb = canvasTex(1024, 560, (g, w, h) => {
    g.fillStyle = '#ffffff'; roundRect(g, 4, 4, w - 8, h - 8, 26); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    const nc = ['#ffc8dd', '#ffe9a0', '#c9b6ff', '#b8f0d8', '#bfe3ff'];
    scrum.cols.forEach((t, i) => {
      const x = 24 + i * 330;
      g.fillStyle = ['#ffe9a0', '#bfe3ff', '#b8f0d8'][i]; roundRect(g, x, 24, 310, 66, 14); g.fill(); g.lineWidth = 6; g.stroke();
      g.fillStyle = INK; g.font = '900 34px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText(t, x + 155, 68);
      (scrum.notes[i] || []).slice(0, 4).forEach((n, k) => {
        const nx = x + 10 + (k % 2) * 152, ny = 110 + Math.floor(k / 2) * 150;
        g.fillStyle = nc[(i * 2 + k) % nc.length]; g.fillRect(nx, ny, 136, 124); g.lineWidth = 4; g.strokeRect(nx, ny, 136, 124);
        g.fillStyle = INK; g.font = '700 21px Be Vietnam Pro, Arial';
        const words = n.split(' '); let line = '', ly = ny + 30; const out = [];
        words.forEach((wd) => { if ((line + ' ' + wd).trim().length > 11) { out.push(line.trim()); line = wd; } else line += ' ' + wd; });
        out.push(line.trim()); out.slice(0, 4).forEach((l) => { g.fillText(l, nx + 68, ly); ly += 26; });
      });
    });
  });
  box(0.08, 1.9, 0.08, C.dark, -1.5, 0, -7.6, false, 0, 0.012); box(0.08, 1.9, 0.08, C.dark, 1.5, 0, -7.6, false, 0, 0.012);
  box(3.05, 1.7, 0.05, '#ffffff', 0, 0.7, -7.62, false, 0, 0.02);
  plane(3.0, 1.64, basic(kb), 0, 1.55, -7.58, 0);
  collideRect(-1.6, 1.6, -7.75, -7.45);
  sign(signs.standup || 'DAILY 9:30', '#c9b6ff', 0, 2.65, -7.57, 0, 2.6);
  desk(6.5, -7.0, -1, { plate: (D.senior && D.senior[0]) || 'CTO', screen: D.senior && D.senior[1] ? [D.senior[1], D.senior[2] || '#e05a4a'] : null, chair: '#3d7bff', top: '#ffffff', leg: C.dark });
  for (let i = 0; i < 4; i++) cyl(0.04, 0.04, 0.16, ['#39ff88', '#ffd166', '#ff4fa3', '#4fd1ff'][i], 7.0 + i * 0.1, 0.75, -6.85, 8, 0.006);

  // ================= SERVER ROOM (north-east, glass) =================
  glassWall(9, -10, 9, -5, { frame: C.dark, tint: '#bfe3ff' });
  glassWall(9, -5, 9.4, -5, { frame: C.dark, tint: '#bfe3ff' });
  glassWall(10.6, -5, 15, -5, { frame: C.dark, tint: '#bfe3ff' });
  const leds = [];
  for (let r = 0; r < 4; r++) {
    const x = 10.6 + r * 1.1;
    box(0.8, 2.1, 0.8, '#2a2f3a', x, 0, -9.3, true);
    for (let i = 0; i < 10; i++) leds.push(box(0.05, 0.03, 0.01, glow(i % 3 ? '#39ff88' : '#ffcf4a'), x - 0.25 + (i % 5) * 0.12, 0.5 + Math.floor(i / 5) * 0.8, -8.89, false, 0, 0));
  }
  K.animated.push((t) => leds.forEach((l, i) => { l.visible = Math.sin(t * (3 + (i % 7)) + i) > -0.3; }));
  box(0.8, 2.0, 0.8, '#5b6270', 14.3, 0, -7.0, true);
  poster(['SERVER CŨ', 'ĐỪNG TẮT'], { w: 512, h: 256, bg: '#ff9f7a', sizes: [60, 60] }, 14.3, 2.25, -6.58, 0, 0.9, 0.45);
  box(1.2, 0.4, 0.3, '#e9edf3', 12.0, 2.4, -9.8, false, 0, 0.012);
  neon('🔥 ON-CALL: LỘC', '#ff7a4a', 12.8, 2.85, -5.06, 0, 2.2, 0.4, 64);
  box(0.6, 0.8, 0.5, '#ffffff', 8.0, 0, -4.2, true); box(0.6, 0.25, 0.5, '#e3d9ff', 8.0, 0.8, -4.2, false);
  interact('printer', L('printer', 'Dùng máy in'), 8.0, 0.9, -3.85);

  // ================= COO desk + "Runway" safe (east) =================
  desk(12.5, -2.8, -1, { plate: 'Thảo · COO', screen: [['Runway', '18 tháng (?)'], '#8a6bff'], chair: '#8a6bff', top: '#ffffff', leg: C.dark });
  box(0.7, 0.9, 0.6, '#5f6b7a', 14.3, 0, -2.8, true);
  cyl(0.11, 0.11, 0.04, '#ffd25a', 14.3, 0.5, -2.49).rotation.x = PI / 2;
  poster(['RUNWAY'], { w: 256, h: 96, bg: '#ffd166', sizes: [44] }, 14.3, 0.75, -2.48, 0, 0.5, 0.19);
  interact('safe', L('safe', 'Nhìn két "Runway"'), 14.3, 0.8, -2.3);
  sign(signs.finance || 'COO', '#e3d9ff', 12.5, 2.6, -2.2, 0, 1.4);

  // ================= COFFEE BAR (east wall) + high table =================
  box(0.7, 1.0, 5.6, '#ffffff', 14.6, 0, 3.4, true);
  box(0.76, 0.06, 5.7, '#2b3040', 14.6, 1.0, 3.4, false);
  box(0.45, 0.5, 0.4, '#b9c0cc', 14.6, 1.06, 2.2, false); cyl(0.04, 0.04, 0.12, '#222', 14.4, 1.06, 2.2, 8, 0.005);
  for (let i = 0; i < 8; i++) cyl(0.05, 0.05, 0.2, ['#39ff88', '#ffd166', '#4fd1ff'][i % 3], 14.5, 1.06, 3.4 + i * 0.12, 8, 0.006);
  box(0.8, 1.9, 0.75, '#bfe3ff', 14.5, 0, 7.4, true);
  poster(['NƯỚC TĂNG LỰC', 'free · tự giác'], { w: 512, h: 256, bg: '#ffd166', sizes: [50, 36] }, 14.08, 1.3, 7.4, -PI / 2, 0.7, 0.35);
  interact('coffee', L('coffee', 'Pantry: cà phê, nước tăng lực'), 14.2, 1.1, 3.2);
  sign(signs.pantry || 'PANTRY', '#ffe9a0', 14.88, 2.5, 3.4, -PI / 2, 2.6);
  box(2.0, 1.0, 0.9, '#ffffff', 12.0, 0, 3.5, true); box(2.1, 0.05, 1.0, '#d9b48a', 12.0, 1.0, 3.5, false);
  for (let i = 0; i < 3; i++) for (const z of [2.75, 4.25]) cyl(0.17, 0.15, 0.7, ['#3d7bff', '#ff4fa3', '#39d98a'][i], 11.4 + i * 0.6, 0, z, 12, 0.012);
  for (let i = 0; i < 2; i++) box(0.4, 0.06, 0.4, '#ffffff', 11.6 + i * 0.8, 1.05, 3.5, false, 0.2, 0.008);

  // ================= PING-PONG + HR desk (south-east) =================
  box(2.74, 0.06, 1.52, '#1f6fd1', 6.8, 0.72, 4.0, false, 0, 0.02);
  for (const [dx, dz] of [[-1.2, -0.6], [1.2, -0.6], [-1.2, 0.6], [1.2, 0.6]]) box(0.06, 0.72, 0.06, '#333', 6.8 + dx, 0, 4.0 + dz, false, 0, 0.008);
  box(0.02, 0.15, 1.6, '#ffffff', 6.8, 0.78, 4.0, false, 0, 0.006);
  box(2.74, 0.006, 0.02, '#ffffff', 6.8, 0.781, 4.0, false, 0, 0);
  collideRect(5.43, 8.17, 3.24, 4.76);
  sphere(0.03, '#ff9f1c', 7.4, 0.82, 3.7, 0.004);
  dk(9.5, 7.6, -1, 'hr', '#ff7a6b');
  sign('PEOPLE & CULTURE 💐', '#ffc8dd', 9.5, 2.6, 8.0, PI, 1.8);
  plant(13.8, 9.2, { s: 1.1, pot: '#2b3040', leaf: '#3e9b57' });
  plant(-14.2, -9.2, { s: 1.1, pot: '#2b3040', leaf: '#3e9b57' });
  neon('SHIP IT 🚀', C.neon, -10.4, 2.5, -9.88, 0, 2.6, 0.62, 110);

  K.lights({ sky: '#f2f6ff', ground: '#dfe6f2', hemi: 1.6, amb: 0.5, sun: 1.05 });

  return K.result({
    spots: S,
    bounds: { minX: -14.7, maxX: 14.7, minZ: -9.7, maxZ: 9.75 },
    playerStart: [0, 8.8, 0],
    meetingSeat: [2.0, 0, PI / 2],
    catPath: [[0, 6.0], [4.0, 6.0], [6.8, 2.2], [4.5, -3.6], [-4.0, -3.4], [-6.5, 3.4], [-4.0, 6.4]],
  });
}
