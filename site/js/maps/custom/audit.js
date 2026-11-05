// Cân Đối & Cộng Sự — one floor of a corporate tower, 30 × 20 m. Grey carpet, ceiling tiles, fluorescent panels.
//   South-centre: elevator lobby with a long stone reception (Cô Lụa + the locked stamp cabinet), glass doors.
//   Centre: the spine corridor between two cubicle blocks (audit team west, tax / advisory / QC east).
//   North wall, off a cross corridor: archive room · closed meeting room · manager review room (glass) · partner room.
//   South-west: HR & IT helpdesk room. South-east, at the end of the east aisle: the small pantry.
// Coordinates: x east, z south; spot rotY 0 faces south (+z), PI faces north, PI/2 faces east, −PI/2 west.
import { createKit, FLOORS } from '../kit3d.js';

const PI = Math.PI;
const H = 3.0;

const S = {
  boss: [13.4, -7.0, -PI / 2],        // Anh Phong, by the partner-room window (rarely there)
  finance: [3.5, -8.25, 0],           // Chị Thảo in the manager review room
  senior: [-10.4, -3.1, 0],           // Anh Khoa
  c1: [-8.8, -3.1, 0],                // Chị Diệp
  c3: [-7.2, -3.1, 0],                // Tuấn
  c2: [-8.8, -0.95, PI],              // Vy (intern)
  n2: [4.0, -3.1, 0],                 // Anh Sang
  n3: [5.6, -3.1, 0],                 // Anh Hiếu
  n5: [7.2, -3.1, 0],                 // Chị Ngân
  n6: [8.8, -3.1, 0],                 // Chị My (QC)
  n1: [-10.4, -0.95, PI], n4: [4.0, -0.95, PI],
  it: [-12.5, 7.3, 0],                // Anh Lộc at the IT helpdesk counter
  hr: [-8.0, 6.85, 0],                // Chị Huệ
  reception: [-3.0, 5.65, 0],         // Cô Lụa behind the stone reception
  pantry: [13.6, 7.6, -PI / 2],
  pantry_bao: [11.0, 6.0, PI],
  meeting_head: [-7.8, -7.5, PI / 2],
  mr_n1: [-5.0, -8.6, 0],
  mr_n2: [-5.0, -6.4, PI],
  corner: [1.9, -1.0, -PI / 2], corner2: [-1.9, -1.0, PI / 2],
  senior2: [-5.6, -3.1, 0],
  x1: [13.0, -1.0, -PI / 2], x2: [-13.0, -1.0, PI / 2], x3: [2.0, 7.0, PI],
  giao: [-2.3, 8.6, PI],
  reception_side: [-0.9, 6.6, -PI / 2],
  window: [11.5, -9.2, PI],
  scrum: [0, -3.3, 0],
  lunch1: [8.6, 6.4, 0], lunch2: [9.6, 6.4, 0], lunch3: [10.6, 6.4, 0], lunch4: [8.6, 8.6, PI], lunch5: [9.6, 8.6, PI],
};
{
  const cx = 0, cz = -1.2, rx = 2.0, rz = 1.3;
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

export function buildAudit(scene, th) {
  const K = createKit(scene);
  const { THREE, box, cyl, sphere, plane, basic, glow, collideRect, floorZone, ceiling, wall, glassWall, sign, poster, desk, plant, interact, canvasTex, textTexture, roundRect, INK } = K;
  const L = (id, d) => (th.labels && th.labels[id]) || d;
  const signs = th.signs || {};
  const D = th.desks || {};
  const C = { wall: '#eef1f4', navy: '#1f3a5f', mint: '#2fa37a', panel: '#9fb1c7', wood: '#8b5a3c', stone: '#3a3f47', stoneTop: '#e8e4dc' };

  // ---------- floors & ceiling ----------
  floorZone(-15, -10, 15, 10, FLOORS.carpet('#7d8aa3', 'rgba(255,255,255,0.07)'), 1);
  floorZone(-5, 5, 5, 10, FLOORS.terrazzo('#e2ddd5', ['#b9b2a6', '#9a9388', '#cfc8bc']), 1.5, 0.006);   // lobby stone
  floorZone(-1.2, -5, 1.2, 5, FLOORS.carpet('#56627a', 'rgba(255,255,255,0.06)'), 1, 0.006);         // spine corridor
  floorZone(-15, -5, 15, -3.8, FLOORS.carpet('#56627a', 'rgba(255,255,255,0.06)'), 1, 0.006);        // cross corridor
  floorZone(7, -10, 15, -5, FLOORS.planks('#8b5a3c', '#7a4e33'), 1.2, 0.007);                       // partner room
  floorZone(5, 5, 15, 10, FLOORS.checker('#ffffff', '#e1e7ee'), 0.6, 0.007);                         // pantry
  const tiles = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f4f5f6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9ced6'; g.lineWidth = 6; g.strokeRect(0, 0, w, h); let s = 5; for (let i = 0; i < 160; i++) { s = (s * 16807) % 2147483647; g.fillStyle = 'rgba(0,0,0,0.05)'; g.fillRect(s % w, (s >> 8) % h, 3, 3); } });
  tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping; tiles.repeat.set(25, 17);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshBasicMaterial({ map: tiles })); ceil.rotation.x = PI / 2; ceil.position.y = H; K.root.add(ceil);
  const lightM = glow('#fbfdff');
  for (let x = -12; x <= 12; x += 3) for (let z = -8; z <= 8; z += 3.2) { const l = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), lightM); l.rotation.x = PI / 2; l.position.set(x, H - 0.01, z); K.root.add(l); }

  // ---------- outer shell ----------
  wall(-15, 10, 15, 10, C.wall, { h: H });
  wall(-15, -10, -15, 10, C.wall, { h: H });
  wall(15, -10, 15, 10, C.wall, { h: H });
  wall(-15, -10, 15, -10, C.wall, { h: H, gaps: [[-14.5, 14.5]], lintel: false });
  box(29, 0.8, 0.2, '#dfe5ec', 0, 0, -10, true, 0, 0.02);
  box(29, 0.5, 0.2, C.wall, 0, 2.5, -10, false, 0, 0);
  plane(29, 1.7, new THREE.MeshBasicMaterial({ color: '#cfe9ff', transparent: true, opacity: 0.25, depthWrite: false }), 0, 1.65, -10, 0);
  for (let x = -14; x <= 14; x += 2) box(0.08, 1.7, 0.1, '#ffffff', x, 0.8, -10, false, 0, 0.012);
  const city = canvasTex(2048, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#b9d7f2'); grd.addColorStop(1, '#eef4fa');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    let x = 0, n = 0;
    while (x < w) {
      const bw = 120 + ((n * 41) % 120), bh = 260 + ((n * 89) % 240);
      g.fillStyle = ['#8fa3bf', '#a9b8cc', '#7b8fab', '#c3cedd'][n % 4]; g.fillRect(x, h - bh, bw, bh); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(x, h - bh, bw, bh);
      g.fillStyle = 'rgba(255,255,255,0.55)'; for (let wy = h - bh + 12; wy < h - 8; wy += 22) g.fillRect(x + 8, wy, bw - 16, 8);
      x += bw + 8; n++;
    }
  });
  plane(44, 10, new THREE.MeshBasicMaterial({ map: city }), 0, 1.5, -17, 0);

  // ================= ELEVATOR LOBBY (south centre) =================
  wall(-5, 5, -5, 10, '#c9b79c', { h: H });
  wall(5, 5, 5, 10, '#c9b79c', { h: H });
  for (const x of [-3, 0, 3]) {
    box(1.4, 2.3, 0.08, '#c0c6cf', x, 0, 9.9, false, 0, 0.015);
    box(0.02, 2.3, 0.1, '#7d8590', x, 0, 9.86, false, 0, 0);
    box(1.7, 0.3, 0.1, '#7d8590', x, 2.3, 9.9, false, 0, 0.01);
    poster(['▲ ▼'], { w: 128, h: 64, bg: '#1d1d1f', fg: '#ff9f1c', sizes: [36], radius: 8, border: null }, x + 1.0, 1.2, 9.85, PI, 0.18, 0.09);
  }
  poster(['TẦNG 18'], { w: 256, h: 96, bg: '#1d1d1f', fg: '#ffffff', sizes: [52], border: null }, 0, 2.55, 9.84, PI, 0.8, 0.3);
  // long stone reception
  box(3.6, 1.05, 0.8, C.stone, -3.0, 0, 6.4, true);
  box(3.7, 0.06, 0.9, C.stoneTop, -3.0, 1.05, 6.4, false);
  box(3.4, 0.08, 0.02, C.mint, -3.0, 0.5, 6.81, false, 0, 0);
  poster(['CÂN ĐỐI & CỘNG SỰ'], { w: 1024, h: 128, bg: C.stone, fg: '#ffffff', sizes: [58], border: null }, -3.0, 0.75, 6.82, 0, 2.6, 0.32);
  box(0.4, 0.04, 0.28, '#ffffff', -2.4, 1.1, 6.35, false, 0.2, 0.006);
  cyl(0.05, 0.05, 0.1, '#c0392b', -3.6, 1.1, 6.3, 10, 0.006); // the stamp, guarded
  sign(signs.reception || 'LỄ TÂN · VĂN THƯ', '#e8f5ef', -3.0, 2.45, 6.0, 0, 1.7);
  // locked stamp cabinet behind the reception
  box(0.7, 1.4, 0.55, '#5f6b7a', -4.5, 0, 5.45, true);
  poster(['CON DẤU', '🔒 Cô Lụa giữ'], { w: 256, h: 192, bg: '#ffe9a0', sizes: [40, 30] }, -4.5, 0.9, 5.74, 0, 0.5, 0.37);
  interact('safe', L('safe', 'Nhìn tủ khoá con dấu'), -4.5, 0.9, 5.95);
  // logo on the east lobby wall, glass doors to the office
  poster(th.logo || ['CÂN ĐỐI & CỘNG SỰ'], { w: 1024, h: 512, bg: C.navy, fg: '#ffffff', sizes: [76, 36, 32], weights: [900, 700, 500], border: C.mint }, 4.9, 1.6, 7.5, -PI / 2, 3.4, 1.7);
  glassWall(-5, 5, -0.9, 5, { frame: '#7d8590' });
  glassWall(0.9, 5, 5, 5, { frame: '#7d8590' });
  box(1.8, H - 2.6, 0.1, C.wall, 0, 2.6, 5, false, 0, 0);
  for (const [a, b] of [[-5, -0.9], [0.9, 5]]) box(b - a, 0.25, 0.02, '#e8f5ef', (a + b) / 2, 1.2, 5.02, false, 0, 0);
  // altar + money plant in the lobby
  box(1.0, 0.7, 0.55, '#d63031', 4.2, 0, 9.5, true);
  box(1.1, 0.06, 0.62, '#ffe08a', 4.2, 0.7, 9.5, false);
  sphere(0.11, '#ffd25a', 3.95, 0.9, 9.55); sphere(0.11, '#ffd25a', 4.45, 0.9, 9.55);
  const ab = [];
  for (let i = 0; i < 6; i++) ab.push(sphere(0.03, glow('#ff6f8a'), 3.75 + i * 0.18, 1.38, 9.74, 0));
  K.animated.push((t) => ab.forEach((b, i) => b.material.color.set(((Math.floor(t * 3) + i) % 2) ? '#ff6f8a' : '#ffe08a')));
  interact('altar', L('altar', 'Thắp hương Thần Tài'), 4.2, 0.9, 9.3);
  plant(-4.3, 9.3, { s: 1.1, pot: '#ffffff', leaf: '#3e9b57' });
  poster(['ĐÃ KIỂM KÊ', '1 cây · 14 lá'], { w: 256, h: 128, bg: '#ffffff', sizes: [32, 26] }, -4.3, 0.25, 9.05, 0, 0.36, 0.18);
  interact('plant', L('plant', 'Xem cây kim tiền'), -4.3, 0.9, 9.0);

  // ================= CUBICLE BLOCKS =================
  const dk = (x, z, f, slot, chair = '#9fb1c7') => {
    const d = D[slot];
    desk(x, z, f, { plate: d && d[0], screen: d && d[1] ? [d[1], d[2] || C.navy] : null, chair, top: '#f6f7f9', leg: '#8d97a5' });
  };
  const panelM = '#a9b6c8';
  const block = (x0, slotsN, slotsS, zN) => { // a back-to-back row pair with low fabric partitions
    const zS = zN + 0.75;
    slotsN.forEach((sl, i) => dk(x0 + i * 1.6, zN, -1, sl));
    slotsS.forEach((sl, i) => dk(x0 + i * 1.6, zS, 1, sl));
    const n = Math.max(slotsN.length, slotsS.length), x1 = x0 - 0.8, x2 = x0 + (n - 1) * 1.6 + 0.8;
    box(x2 - x1, 1.15, 0.06, panelM, (x1 + x2) / 2, 0, (zN + zS) / 2, false, 0, 0.012);
    for (let i = 0; i <= n; i++) { const x = x1 + i * 1.6; box(0.05, 1.15, 0.72, panelM, x, 0, zN - 0.05, false, 0, 0.01); box(0.05, 1.15, 0.72, panelM, x, 0, zS + 0.05, false, 0, 0.01); }
  };
  block(-10.4, ['senior', 'c1', 'c3', 'x_w1', 'x_w2'], ['n1', 'c2', 'me', 'x_w3', 'x_w4'], -2.4);
  block(-10.4, ['x_w5', 'x_w6', 'x_w7', 'x_w8', 'x_w9'], ['x_wa', 'x_wb', 'x_wc', 'x_wd', 'x_we'], 1.6);
  block(4.0, ['n2', 'n3', 'n5', 'n6', 'x_e1'], ['n4', 'x_e2', 'x_e3', 'x_e4', 'x_e5'], -2.4);
  block(4.0, ['x_e6', 'x_e7', 'x_e8', 'x_e9', 'x_ea'], ['x_eb', 'x_ec', 'x_ed', 'x_ee', 'x_ef'], 1.6);
  interact('desk', L('desk', 'Ngồi vào bàn tick-mark'), -7.2, 0.8, -1.1);
  // busy season: binders and file boxes everywhere
  for (const [x, z] of [[-5.6, -2.4], [-4.0, 1.6], [-8.8, 2.35], [5.6, 1.6], [8.8, 2.35], [10.4, -1.65], [-4.0, -1.65], [7.2, 1.6]]) {
    for (let i = 0; i < 4; i++) box(0.1, 0.3, 0.26, ['#c0392b', '#2e86de', '#27ae60', '#f39c12'][i], x - 0.55 + i * 0.11, 0.78, z, false, 0, 0.006);
    box(0.4, 0.28, 0.3, '#e8d5b0', x + 0.35, 0.78, z, false, 0.1, 0.008);
  }
  for (const [x, z] of [[-11.8, 4.2], [-11.8, -4.4], [11.8, 4.2], [11.8, -4.3]]) for (let k = 0; k < 2; k++) box(0.5, 0.32, 0.38, '#e8d5b0', x, k * 0.32, z, k === 0, 0, 0.012);
  sign('KIỂM TOÁN · AUDIT', '#e8f5ef', -7.2, 2.5, -0.2, 0, 2.2);
  sign('THUẾ · TƯ VẤN · QC', '#e6ecff', 7.2, 2.5, -0.2, 0, 2.2);
  // printer + scanner by the spine
  box(0.6, 0.85, 0.5, '#ffffff', -1.85, 0, 4.4, true); box(0.6, 0.25, 0.5, '#d6f5e8', -1.85, 0.85, 4.4, false);
  box(0.5, 0.12, 0.4, '#c9ced6', -1.85, 1.1, 4.4, false, 0, 0.01);
  interact('printer', L('printer', 'Dùng máy in'), -1.55, 0.9, 4.4);

  // ================= NORTH ROOMS off the cross corridor =================
  // archive (NW)
  wall(-15, -5, -9, -5, '#d9dee6', { h: H, gaps: [[-10.6, -9.6]] });
  wall(-9, -10, -9, -5, '#d9dee6', { h: H });
  for (let r = 0; r < 3; r++) {
    const z = -9.4 + r * 1.4;
    box(4.6, 2.2, 0.45, '#b8c0cc', -12.4, 0, z, true);
    for (let s = 0; s < 4; s++) for (let i = 0; i < 14; i++) box(0.08, 0.36, 0.3, ['#c0392b', '#2e86de', '#27ae60', '#f39c12', '#8e44ad'][(i + s + r) % 5], -14.5 + i * 0.31, 0.15 + s * 0.52, z + 0.1, false, 0, 0);
  }
  sign('LƯU TRỮ · HỒ SƠ 2009–2026', '#e8d5b0', -12.0, 2.55, -4.92, 0, 2.6);
  // meeting room (closed)
  wall(-9, -5, -1, -5, '#dfe6ee', { h: H, gaps: [[-2.8, -1.8]] });
  wall(-1, -10, -1, -5, '#dfe6ee', { h: H });
  box(4.4, 0.06, 1.3, '#f6f7f9', -5.0, 0.72, -7.5, false, 0, 0.02);
  for (const dx of [-1.8, 1.8]) box(0.1, 0.72, 1.1, C.navy, -5.0 + dx, 0, -7.5, false, 0, 0.01);
  collideRect(-7.2, -2.8, -8.15, -6.85);
  for (let i = 0; i < 4; i++) for (const z of [-8.55, -6.45]) { const x = -6.6 + i * 1.05; box(0.45, 0.1, 0.45, C.navy, x, 0.42, z, false); box(0.45, 0.55, 0.08, C.navy, x, 0.5, z + (z < -7.5 ? -0.22 : 0.22), false); }
  box(0.08, 1.0, 1.8, '#111111', -8.9, 1.0, -7.5, false, 0, 0.012);
  poster(['CLOSING MEETING', 'Ý kiến: chấp nhận toàn phần (?)'], { w: 768, h: 432, bg: '#111827', fg: '#ffffff', sizes: [52, 30], border: null }, -8.84, 1.5, -7.5, PI / 2, 1.7, 0.95);
  box(0.5, 0.1, 0.5, C.mint, -2.4, 0.42, -7.5, false); box(0.08, 0.55, 0.5, C.mint, -2.18, 0.5, -7.5, false);
  interact('interview', L('interview', 'Ngồi vào ghế phòng họp'), -2.4, 0.8, -7.5);
  sign(signs.meeting || 'PHÒNG HỌP', '#e6ecff', -5.0, 2.55, -4.92, 0, 2.6);
  // BUSY SEASON whiteboard on the corridor wall
  const wb = textTexture(th.whiteboard || ['BUSY SEASON'], { w: 768, h: 512, bg: '#ffffff', fg: '#c0392b', sizes: [60, 46, 40, 40, 32], weights: [900, 800, 700, 700, 500], align: 'left', pad: 40 });
  box(2.2, 1.3, 0.05, '#ffffff', -7.0, 0.85, -4.9, false, 0, 0.02);
  plane(2.1, 1.2, basic(wb), -7.0, 1.5, -4.86, 0);
  interact('okr', L('okr', 'Đọc bảng BUSY SEASON'), -7.0, 1.4, -4.6);
  sign(signs.standup || 'BUSY SEASON', '#ffe9a0', 0, 2.55, -3.86, 0, 3.0);
  // manager review room (glass)
  glassWall(-1, -5, 0.2, -5, { frame: '#7d8590' });
  glassWall(1.2, -5, 7, -5, { frame: '#7d8590' });
  glassWall(7, -10, 7, -5, { frame: '#7d8590' });
  desk(3.5, -7.5, -1, { plate: 'Thảo · Manager', screen: [['Review note', '#148 (2:58 AM)'], '#c0392b'], chair: '#ff8fa3', top: '#f6f7f9', leg: '#8d97a5', w: 1.8 });
  for (let i = 0; i < 5; i++) box(0.32, 0.04, 0.24, '#ffffff', 2.2 + (i % 3) * 0.2, 0.78 + Math.floor(i / 3) * 0.05, -7.3, false, i * 0.3, 0.004);
  for (let k = 0; k < 3; k++) box(0.5, 0.32, 0.38, '#e8d5b0', 5.8, k * 0.32, -9.3, k === 0, 0, 0.012);
  sign(signs.finance || 'PHÒNG REVIEW', '#ffe0e6', 3.5, 2.55, -4.9, 0, 2.4);
  // partner room (NE corner, wood, window)
  wall(7, -5, 15, -5, '#c9b79c', { h: H, gaps: [[7.4, 8.6]] });
  desk(11.0, -7.6, -1, { plate: 'Phong · Partner', screen: [['Báo cáo', 'chờ ký'], C.navy], chair: null, top: '#6b4a32', leg: '#4a3222', w: 2.2 });
  box(0.7, 0.55, 0.7, '#a61b2b', 11.0, 0, -8.35, false, 0, 0.02); box(0.7, 0.9, 0.15, '#a61b2b', 11.0, 0.55, -8.68, false, 0, 0.02);
  interact('redchair', L('redchair', 'Nhìn ghế của Partner'), 11.0, 0.7, -8.3);
  box(2.0, 0.42, 0.8, '#2b2b2b', 9.0, 0, -5.8, true); box(2.0, 0.45, 0.2, '#2b2b2b', 9.0, 0.42, -5.5, false);
  poster([th.bossWall || 'Cân đối'], { w: 256, h: 768, bg: '#fff3d6', fg: '#8b1a1a', sizes: [96], weights: [900] }, 14.9, 1.6, -7.5, -PI / 2, 0.7, 2.0);
  poster(['"Integrity –', 'Quality –', 'Teamwork"'], { w: 512, h: 384, bg: C.navy, fg: '#ffffff', sizes: [52, 52, 52] }, 11.0, 1.7, -5.1, PI, 1.4, 1.05);
  sign(signs.boss || 'PARTNER', '#e8d5b0', 8.0, 2.55, -4.92, 0, 1.8);
  plant(14.3, -9.3, { s: 1.1, pot: '#ffffff', leaf: '#3e9b57' });

  // ================= HR & IT (south-west) =================
  wall(-15, 5, -5, 5, '#dfe6ee', { h: H, gaps: [[-13.6, -12.4]] });
  desk(-8.0, 7.55, -1, { plate: (D.hr && D.hr[0]) || 'HR', screen: D.hr && D.hr[1] ? [D.hr[1], D.hr[2] || '#ff7a9b'] : null, chair: '#ffc8dd', top: '#f6f7f9', leg: '#8d97a5' });
  poster(['BẢNG VÀNG', 'TIMESHEET', '1. Khoa · 312h', '2. Diệp · 298h', '3. (bạn?)'], { w: 512, h: 512, bg: '#fff3c4', sizes: [48, 44, 34, 34, 34] }, -8.0, 1.6, 9.88, PI, 1.4, 1.4);
  box(2.4, 1.0, 0.6, '#ffffff', -12.5, 0, 8.0, true); box(2.5, 0.05, 0.7, C.navy, -12.5, 1.0, 8.0, false);
  for (let i = 0; i < 3; i++) box(0.36, 0.03, 0.26, '#dfe6ee', -13.3 + i * 0.6, 1.05, 8.0, false, 0, 0.006);
  poster(['IT HELPDESK', '8:00–17:00 (không hơn)'], { w: 768, h: 256, bg: '#e6ecff', sizes: [56, 38] }, -12.5, 1.9, 9.88, PI, 1.8, 0.6);
  sign('HR & ADMIN · IT', '#ffe0e6', -13.0, 2.55, 4.92, PI, 1.8);

  // ================= PANTRY (south-east, end of the east aisle) =================
  wall(5, 5, 15, 5, '#dfe6ee', { h: H, gaps: [[12.3, 13.7]] });
  box(0.7, 0.9, 3.6, '#ffffff', 14.6, 0, 8.0, true); box(0.76, 0.06, 3.7, C.mint, 14.6, 0.9, 8.0, false);
  cyl(0.15, 0.15, 0.3, '#c0392b', 14.6, 0.96, 7.2); box(0.4, 0.45, 0.35, '#c9ced6', 14.6, 0.96, 8.6, false);
  for (let i = 0; i < 4; i++) cyl(0.05, 0.04, 0.1, '#ffffff', 14.5, 0.96, 7.7 + i * 0.12, 8, 0.006);
  interact('coffee', L('coffee', 'Pantry: ăn uống, cà phê'), 14.2, 1.1, 7.7);
  box(0.8, 1.9, 0.75, '#e6ecff', 14.5, 0, 5.7, true);
  box(3.0, 0.72, 1.1, '#f6f7f9', 9.6, 0, 7.5, true);
  for (let i = 0; i < 3; i++) for (const z of [6.6, 8.4]) box(0.42, 0.45, 0.42, C.mint, 8.6 + i * 1.0, 0, z, false, 0, 0.012);
  for (let i = 0; i < 3; i++) box(0.3, 0.2, 0.22, '#ffffff', 8.8 + i * 0.8, 0.72, 7.5, false, 0.2, 0.008);
  poster(['QUỸ ĂN ĐÊM', 'sau 21h · ký sổ'], { w: 512, h: 256, bg: '#ffe9a0', sizes: [52, 38] }, 9.6, 1.7, 9.88, PI, 1.4, 0.7);
  sign(signs.pantry || 'PANTRY', '#d6f5e8', 13.0, 2.55, 4.92, PI, 2.4);
  box(1.0, 1.9, 0.8, '#c0392b', 6.0, 0, 9.4, true);
  poster(['MÌ LY 24/7', 'busy season edition'], { w: 512, h: 256, bg: '#ffffff', fg: '#c0392b', sizes: [56, 30] }, 6.0, 1.45, 8.99, 0, 0.9, 0.45);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) cyl(0.06, 0.05, 0.12, ['#ffd166', '#ff9f1c', '#e63946', '#2fa37a'][(r + i) % 4], 5.65 + i * 0.23, 0.35 + r * 0.25, 9.02, 8, 0.004);
  box(0.5, 0.3, 0.38, '#ffffff', 14.6, 0.96, 9.3, false, 0, 0.01); box(0.3, 0.2, 0.02, '#1d1d1f', 14.4, 1.0, 9.3, false, PI / 2, 0.004);
  poster(['Ai lấy hộp cơm', 'tên "Khoa" xin trả lại 🙏'], { w: 512, h: 256, bg: '#ffe9a0', sizes: [38, 32] }, 14.88, 1.7, 6.9, -PI / 2, 0.8, 0.4);

  K.lights({ sky: '#f4f8ff', ground: '#e3e8ef', hemi: 1.6, amb: 0.5, sun: 1.0 });

  return K.result({
    spots: S,
    bounds: { minX: -14.7, maxX: 14.7, minZ: -9.7, maxZ: 9.75 },
    playerStart: [0, 8.4, 0],
    meetingSeat: [-2.4, -7.5, PI / 2],
    catPath: [[0, 4.0], [0, -4.4], [-6.0, -4.4], [-13.0, -4.4], [-13.0, 3.6], [-13.0, -4.4], [6.0, -4.4], [13.0, -4.4], [13.0, 3.6], [0, 0]],
  });
}
