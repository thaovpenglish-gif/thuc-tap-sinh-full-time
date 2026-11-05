// Người Đúng Chỗ HR — a small renovated apartment, 18 × 12 m. Warm wood, lilac + sage, plants, curtains.
//   South (by the door): small wooden reception (Chị Thảo) + the fee-contract safe, waiting sofa for candidates, altar.
//   Middle: the founder's desk in the middle of the room (with the LinkedIn ring light), two small desk clusters,
//           Chị Ngân by the west window, Phát's "ATS IT" desk by the east window.
//   North: the Talent Room (interview booth #1, doubles as storage), interview booth #2 with the hot seat,
//          the KPI board + stand-up circle, and the small kitchen where Anh Tuấn closes deals on the phone.
// Coordinates: x east, z south; spot rotY 0 faces south (+z), PI faces north, PI/2 faces east, −PI/2 west.
import { createKit, FLOORS } from '../kit3d.js';

const PI = Math.PI;
const H = 2.9;

const S = {
  boss: [0, -0.3, 0],                 // Anh Duy at the founder desk
  senior: [-7.8, 1.9, 0],             // Chị Ngân
  pantry: [6.4, -3.4, PI / 2],        // Anh Tuấn's "office"
  pantry_bao: [7.6, -4.9, PI],
  c1: [-7.6, -1.3, 0],                // Vy
  c3: [-6.0, -1.3, 0],                // Quân
  c2: [-7.6, 0.85, PI],
  n1: [5.2, -1.3, 0],                 // Bách
  n3: [6.8, -1.3, 0],                 // Chị My
  n4: [5.2, 0.85, PI], n5: [6.8, 0.85, PI], n2: [-4.2, 2.6, PI / 2], n6: [3.6, 4.5, PI],
  it: [7.4, 1.9, 0],                  // Phát
  coach: [3.0, 2.0, -0.6],            // Anh Khoa with the icebreaker box
  reception: [-3.5, 3.7, 0],          // Chị Thảo
  hr: [-3.5, 3.7, 0],
  finance: [-3.5, 3.7, 0],
  scrum: [2.0, -5.1, 0],
  meeting_head: [-8.2, -4.3, PI / 2], // Talent Room
  mr_n1: [-6.8, -5.3, 0],
  mr_n2: [-6.8, -3.3, PI],
  corner: [-2.5, -2.2, PI], corner2: [3.6, -1.6, -PI / 2],
  x1: [8.2, -1.0, -PI / 2], x2: [-8.2, 4.4, PI / 2], x3: [1.0, 3.6, PI],
  giao: [1.5, 5.2, PI],
  reception_side: [-1.9, 4.4, -PI / 2],
  window: [-8.4, 0.0, -PI / 2],
  lunch1: [6.3, -2.4, PI], lunch2: [7.1, -2.4, PI], lunch3: [7.9, -2.4, PI], lunch4: [5.6, -4.4, 0], lunch5: [8.4, -3.4, -PI / 2],
};
{
  const cx = 2.0, cz = -3.6, rx = 2.2, rz = 1.25;
  [0.62, 0.78, 0.94, 1.1, 1.26, 0.38, 0.22, 0.06, -0.1, -0.26].forEach((a, i) => {
    const x = cx + rx * Math.cos(a * PI), z = cz + rz * Math.sin(a * PI);
    S['su' + (i + 1)] = [x, z, Math.atan2(cx - x, cz - z)];
  });
}
S.su_dat = S.scrum; S.mr_head = S.meeting_head;
Object.assign(S, {
  tuyet: S.boss, thu: S.n1, nhi: S.n2, linh: S.n3, an: S.n4, minh: S.n5, ha: S.c2, long: S.c1, trang: S.c2, bao: S.c3,
  mai: S.senior, han: S.corner, khang: S.corner2, quynh: S.finance, gam: S.reception, binh: S.it, phuong: S.hr, dat: S.scrum,
});

export function buildHR(scene, th) {
  const K = createKit(scene);
  const { THREE, box, cyl, sphere, plane, basic, glow, collideRect, collideCircle, floorZone, ceiling, wall, sign, poster, desk, plant, interact, canvasTex, textTexture, roundRect, INK, plasticChair } = K;
  const L = (id, d) => (th.labels && th.labels[id]) || d;
  const signs = th.signs || {};
  const D = th.desks || {};
  const C = { wall: '#f5efe6', lilac: '#c9b6ff', sage: '#a8c5a0', wood: '#c98f5a', woodDark: '#8b5a3c', cream: '#fff8ec', plum: '#6b4c8a' };

  // ---------- floors & ceiling ----------
  floorZone(-9, -6, 9, 6, FLOORS.planks('#d6ad7f', '#c99e70'), 0.9);
  floorZone(5, -6, 9, -2, FLOORS.checker('#ffffff', '#dfe8dc'), 0.5, 0.006);           // kitchen tiles
  floorZone(1.6, 3.9, 5.6, 6, FLOORS.carpet('#c9b6ff', 'rgba(255,255,255,0.12)'), 1, 0.006); // waiting rug
  floorZone(-9, -6, -4.2, -2.6, FLOORS.carpet('#a8c5a0'), 1, 0.006);                   // talent room
  floorZone(-1.8, -1.6, 1.8, 1.6, FLOORS.carpet('#e8dcff'), 1, 0.006);                  // founder rug
  ceiling(-9, -6, 9, 6, H, '#fffaf2');
  for (const [x, z] of [[-6.8, -0.4], [0, 0.2], [6.0, -0.4], [-3.5, 4.0], [3.6, 4.8], [2.0, -3.6]]) { cyl(0.006, 0.006, 0.6, '#222', x, H - 0.6, z, 4, 0); cyl(0.06, 0.32, 0.26, [C.lilac, C.sage, '#ffd3b8'][Math.abs(Math.round(x)) % 3], x, H - 0.86, z, 16, 0.01); sphere(0.08, glow('#fff3c4'), x, H - 0.88, z, 0); }

  // ---------- shell: apartment walls, windows with curtains ----------
  wall(-9, 6, 9, 6, C.wall, { h: H, gaps: [[-1, 1]], doorH: 2.2 });
  box(2.0, 2.2, 0.06, '#8b5a3c', 0, 0, 6.12, false, 0, 0.015);           // the apartment door (closed behind you)
  sphere(0.05, '#ffd25a', 0.75, 1.05, 6.06, 0.006);
  collideRect(-1, 1, 6.0, 6.4);
  wall(-9, -6, 9, -6, C.wall, { h: H });
  wall(-9, -6, -9, 6, C.wall, { h: H });
  wall(9, -6, 9, 6, C.wall, { h: H });
  const winTex = canvasTex(512, 512, (g, w, h) => { const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#a8d8ff'); grd.addColorStop(1, '#e9f5ff'); g.fillStyle = grd; g.fillRect(0, 0, w, h); g.fillStyle = '#7fb069'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(60 + i * 80, h - 40, 60, 0, 7); g.fill(); } g.strokeStyle = '#ffffff'; g.lineWidth = 18; g.strokeRect(0, 0, w, h); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); });
  const win = (x, z, ry) => {
    plane(1.6, 1.4, new THREE.MeshBasicMaterial({ map: winTex }), x, 1.6, z, ry);
    const off = ry === PI / 2 ? [0, 1] : [0, 1];
    for (const s of [-1, 1]) { const c = plane(0.4, 2.0, new THREE.MeshToonMaterial({ color: C.lilac, side: THREE.DoubleSide }), x + (ry ? 0.03 * Math.sign(-x) : s * 1.0), 1.5, z + (ry ? s * 1.0 : 0.03), ry); void c; void off; }
    box(ry ? 0.1 : 1.8, 0.05, ry ? 1.8 : 0.1, '#ffffff', x + (ry ? 0.05 * Math.sign(-x) : 0), 0.88, z + (ry ? 0 : 0.05), false, 0, 0.008);
  };
  win(-8.9, 0.0, PI / 2); win(-8.9, 3.4, PI / 2); win(8.9, 1.2, -PI / 2); win(-2.6, -5.9, 0); win(6.8, -5.9, 0);

  // ================= SOUTH: reception, safe, waiting sofa, altar =================
  box(2.2, 1.0, 0.6, C.woodDark, -3.5, 0, 4.4, true);
  box(2.3, 0.05, 0.7, C.wood, -3.5, 1.0, 4.4, false);
  poster([th.logo ? th.logo[0] : 'NGƯỜI ĐÚNG CHỖ HR'], { w: 1024, h: 160, bg: C.plum, fg: '#ffffff', sizes: [58] }, -3.5, 0.55, 4.71, 0, 2.0, 0.31);
  box(0.36, 0.03, 0.26, '#ffffff', -3.0, 1.05, 4.35, false, 0.2, 0.006); cyl(0.05, 0.05, 0.1, '#ffd166', -4.1, 1.05, 4.3, 10, 0.006);
  sign(signs.finance || 'KẾ TOÁN · HÀNH CHÍNH · HR NỘI BỘ', C.sage, -3.5, 2.35, 4.1, 0, 2.4);
  box(0.65, 0.9, 0.55, '#5f6b7a', -5.4, 0, 3.9, true);
  cyl(0.1, 0.1, 0.04, '#ffd25a', -5.4, 0.5, 4.19, 12, 0.008).rotation.x = PI / 2;
  poster(['PHÍ CHƯA THU'], { w: 256, h: 96, bg: '#ffe9a0', sizes: [36] }, -5.4, 0.75, 4.18, 0, 0.5, 0.19);
  interact('safe', L('safe', 'Nhìn két'), -5.4, 0.8, 4.4);
  // waiting area
  box(2.6, 0.42, 0.8, C.lilac, 3.6, 0, 5.5, true); box(2.6, 0.5, 0.2, C.lilac, 3.6, 0.42, 5.85, false);
  for (const x of [2.7, 3.6, 4.5]) box(0.8, 0.12, 0.6, '#e8dcff', x, 0.42, 5.45, false, 0, 0.01);
  cyl(0.45, 0.45, 0.05, '#ffffff', 3.6, 0.4, 4.5, 24, 0.012); cyl(0.05, 0.05, 0.4, C.woodDark, 3.6, 0, 4.5, 8, 0.008); collideCircle(3.6, 4.5, 0.42);
  for (let i = 0; i < 3; i++) box(0.22, 0.02, 0.3, ['#ffffff', '#ffe9a0', '#ffc8dd'][i], 3.3 + i * 0.3, 0.46, 4.5, false, i * 0.4, 0.004);
  poster([(D.n6 && D.n6[0]) || 'Ghế chờ ứng viên', ...(((D.n6 && D.n6[1]) || []))], { w: 512, h: 256, bg: '#fff8ec', sizes: [38, 30, 30] }, 3.6, 1.6, 5.9, PI, 1.2, 0.6);
  poster(th.logo || ['NGƯỜI ĐÚNG CHỖ HR'], { w: 1024, h: 384, bg: C.plum, fg: '#ffffff', sizes: [80, 34, 28], weights: [900, 700, 500] }, -4.8, 1.7, 5.9, PI, 3.0, 1.12);
  box(1.0, 0.7, 0.55, '#d63031', 7.6, 0, 5.5, true);
  box(1.1, 0.06, 0.62, '#ffe08a', 7.6, 0.7, 5.5, false);
  sphere(0.11, '#ffd25a', 7.35, 0.9, 5.55); sphere(0.11, '#ffd25a', 7.85, 0.9, 5.55);
  const ab = [];
  for (let i = 0; i < 6; i++) ab.push(sphere(0.03, glow('#ff6f8a'), 7.15 + i * 0.18, 1.38, 5.74, 0));
  K.animated.push((t) => ab.forEach((b, i) => b.material.color.set(((Math.floor(t * 3) + i) % 2) ? '#ff6f8a' : '#ffe08a')));
  interact('altar', L('altar', 'Thắp hương Thần Tài'), 7.6, 0.9, 5.3);
  plant(-1.6, 5.4, { s: 1.0, pot: C.sage, leaf: '#3e9b57' });
  poster(['CULTURE'], { w: 256, h: 96, bg: '#ffffff', sizes: [40] }, -1.6, 0.25, 5.14, 0, 0.36, 0.14);
  interact('plant', L('plant', 'Xem chậu cây "Culture"'), -1.6, 0.9, 5.1);
  box(0.6, 0.8, 0.5, '#ffffff', -7.9, 0, 5.3, true); box(0.6, 0.25, 0.5, '#e8dcff', -7.9, 0.8, 5.3, false);
  for (let i = 0; i < 4; i++) box(0.3, 0.02, 0.21, '#ffffff', -7.9, 1.06 + i * 0.02, 5.3, false, i * 0.25, 0.004);
  interact('printer', L('printer', 'Dùng máy in'), -7.6, 0.9, 5.0);

  // ================= MIDDLE: founder desk, desk clusters =================
  desk(0, 0.4, -1, { plate: 'Duy · Founder', screen: [['LinkedIn', 'bài #847 · 5:30 AM'], C.plum], chair: C.plum, top: '#fff8ec', leg: C.woodDark, w: 1.8 });
  cyl(0.02, 0.02, 1.5, '#333344', 1.3, 0, -0.4, 8, 0.008);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 10, 30), glow('#fffbe0')); ring.position.set(1.3, 1.6, -0.4); ring.rotation.y = -0.6; K.root.add(ring);
  collideCircle(1.3, -0.4, 0.12);
  poster([th.bossWall || 'People First'], { w: 768, h: 192, bg: C.plum, fg: '#ffe08a', sizes: [96], weights: [900], border: '#ffe08a' }, 0, 2.2, 1.25, 0, 1.8, 0.45);
  box(1.9, 0.06, 0.06, C.woodDark, 0, 2.5, 1.25, false, 0, 0.006);
  for (const x of [-0.8, 0.8]) cyl(0.006, 0.006, 0.4, '#222', x, 2.5, 1.25, 4, 0);
  sign(signs.boss || 'FOUNDER', '#e8dcff', 0, 2.7, -0.4, PI, 2.2);
  const dk = (x, z, f, slot, chair) => { const d = D[slot]; desk(x, z, f, { plate: d && d[0], screen: d && d[1] ? [d[1], d[2] || C.plum] : null, chair, top: '#fff8ec', leg: C.woodDark }); };
  dk(-7.6, -0.6, -1, 'c1', C.lilac); dk(-6.0, -0.6, -1, 'c3', C.sage);
  dk(-7.6, 0.15, 1, 'c2', '#cfcfcf'); dk(-6.0, 0.15, 1, 'me', '#ffd3b8');
  interact('desk', L('desk', 'Ngồi vào bàn mình'), -6.0, 0.8, 0.7);
  dk(5.2, -0.6, -1, 'n1', '#bfe3ff'); dk(6.8, -0.6, -1, 'n3', C.sage);
  dk(5.2, 0.15, 1, 'n4', '#cfcfcf'); dk(6.8, 0.15, 1, 'n5', '#cfcfcf');
  poster(['ĐÃ NGHỈ', 'ngày thứ 59'], { w: 256, h: 128, bg: '#ffffff', sizes: [34, 26] }, 6.8, 1.25, 0.37, 0, 0.4, 0.2);
  desk(-7.8, 2.6, -1, { plate: (D.senior && D.senior[0]) || 'Senior', screen: D.senior && D.senior[1] ? [D.senior[1], D.senior[2] || '#9b7bff'] : null, chair: C.lilac, top: '#fff8ec', leg: C.woodDark });
  desk(7.4, 2.6, -1, { plate: 'Phát · "IT" ATS', screen: [['ATS', '14.000 dòng · lỗi 3'], '#5a6170'], chair: '#aeb7c9', top: '#fff8ec', leg: C.woodDark });
  desk(-4.2, 2.0, 1, { plate: (D.n2 && D.n2[0]) || 'Bàn trống', screen: D.n2 && D.n2[1] ? [D.n2[1], '#9aa0ad'] : null, chair: null, top: '#fff8ec', leg: C.woodDark });
  box(0.6, 0.4, 0.45, '#ffd166', 3.6, 0, 2.0, true);
  poster(['ICEBREAKER', '57 trò · 0 ai thích'], { w: 512, h: 256, bg: '#ffe08a', sizes: [48, 32] }, 3.6, 0.22, 2.23, 0, 0.55, 0.27);
  plant(-8.4, -2.0, { s: 1.1, pot: C.sage, leaf: '#3e9b57' });
  plant(8.4, -1.4, { s: 0.9, pot: C.lilac, leaf: '#3e9b57' });

  // ================= NORTH: talent room, booth 2, KPI board, kitchen =================
  wall(-9, -2.6, -4.2, -2.6, C.sage, { h: H, gaps: [[-5.6, -4.6]] });
  wall(-4.2, -6, -4.2, -2.6, C.sage, { h: H });
  cyl(0.55, 0.55, 0.05, '#ffffff', -6.8, 0.72, -4.3, 24, 0.015); cyl(0.06, 0.08, 0.72, C.woodDark, -6.8, 0, -4.3, 8, 0.008); collideCircle(-6.8, -4.3, 0.5);
  for (const [x, z] of [[-8.0, -4.3], [-6.8, -5.4], [-6.8, -3.25]]) box(0.45, 0.45, 0.45, C.plum, x, 0, z, false, 0, 0.012);
  box(0.45, 0.45, 0.45, '#ffd166', -5.5, 0, -4.3, false, 0, 0.012);
  interact('interview', L('interview', 'Ngồi vào ghế Talent Room'), -5.5, 0.8, -4.3);
  for (let i = 0; i < 6; i++) box(0.55, 0.4, 0.45, i % 2 ? '#e8c39a' : '#d9a273', -8.5 + (i % 3) * 0.6, Math.floor(i / 3) * 0.4, -5.65, i < 3, 0, 0.012);
  poster(['HỒ SƠ ỨNG VIÊN', '2019–2026 (đừng mở)'], { w: 512, h: 256, bg: '#fff8ec', sizes: [42, 30] }, -7.9, 1.5, -5.9, 0, 1.1, 0.55);
  sign(signs.meeting || 'TALENT ROOM', C.sage, -5.1, 2.5, -2.5, 0, 2.2);
  // booth 2 (hot seat)
  wall(-4.2, -3.2, -0.8, -3.2, '#e8dcff', { h: H, gaps: [[-2.0, -1.2]] });
  wall(-0.8, -6, -0.8, -3.2, '#e8dcff', { h: H });
  box(0.8, 0.72, 0.6, '#fff8ec', -2.5, 0, -4.7, true);
  box(0.45, 0.45, 0.45, C.lilac, -2.5, 0, -5.4, false, 0, 0.012);
  plasticChair(-2.5, -3.95, PI, '#e63946');
  interact('redchair', L('redchair', 'Nhìn chiếc ghế nóng phỏng vấn'), -2.5, 0.6, -3.95);
  sign('PHỎNG VẤN 2 · ghế nóng', '#ffc8dd', -2.6, 2.5, -3.1, 0, 1.9);
  // KPI board + circle
  const wb = textTexture(th.whiteboard || ['KPI'], { w: 768, h: 512, bg: '#ffffff', fg: C.plum, sizes: [60, 44, 40, 40, 30], weights: [900, 800, 700, 700, 500], align: 'left', pad: 40 });
  box(2.4, 1.4, 0.05, '#ffffff', 2.0, 0.75, -5.9, false, 0, 0.02);
  plane(2.3, 1.3, basic(wb), 2.0, 1.45, -5.86, 0);
  interact('okr', L('okr', 'Đọc bảng KPI'), 2.0, 1.4, -5.6);
  sign(signs.standup || 'HỌP KPI 8:30', '#ffe9a0', 2.0, 2.45, -5.85, 0, 2.6);
  const ringM = new THREE.Mesh(new THREE.RingGeometry(1.9, 2.0, 48), new THREE.MeshBasicMaterial({ color: C.lilac }));
  ringM.rotation.x = -PI / 2; ringM.scale.set(1.15, 0.66, 1); ringM.position.set(2.0, 0.009, -3.6); K.root.add(ringM);
  // kitchen
  box(0.65, 0.9, 3.4, '#ffffff', 8.6, 0, -4.2, true); box(0.7, 0.06, 3.5, C.sage, 8.6, 0.9, -4.2, false);
  box(0.4, 0.4, 0.35, '#5d4037', 8.6, 0.96, -5.3, false, 0, 0.01); cyl(0.16, 0.16, 0.26, '#ffffff', 8.6, 0.96, -3.4, 14, 0.01);
  for (let i = 0; i < 4; i++) cyl(0.05, 0.04, 0.1, ['#ffffff', C.lilac, '#ffd166', C.sage][i], 8.5, 0.96, -4.6 + i * 0.15, 8, 0.006);
  interact('coffee', L('coffee', 'Pantry: ăn uống, cà phê'), 8.3, 1.1, -4.5);
  box(0.75, 1.8, 0.7, '#e8f6ff', 5.6, 0, -5.55, true);
  box(2.0, 1.0, 0.7, '#fff8ec', 7.1, 0, -3.1, true); box(2.1, 0.05, 0.8, C.wood, 7.1, 1.0, -3.1, false);
  for (let i = 0; i < 3; i++) cyl(0.17, 0.15, 0.7, [C.lilac, C.sage, '#ffd3b8'][i], 6.3 + i * 0.8, 0, -2.4, 12, 0.012);
  sign(signs.pantry || 'PANTRY', '#e8f5ef', 7.2, 2.5, -5.88, 0, 2.6);
  poster(th.board || ['NHÀ MÌNH'], { w: 768, h: 420, bg: '#ffe0e6', sizes: [52, 30, 30] }, 8.88, 1.6, 0.8, -PI / 2, 1.6, 0.9);

  K.lights({ sky: '#fff6ee', ground: '#f0e2d0', hemi: 1.6, amb: 0.5, sun: 1.0 });

  return K.result({
    spots: S,
    bounds: { minX: -8.7, maxX: 8.7, minZ: -5.7, maxZ: 5.75 },
    playerStart: [0, 5.2, 0],
    meetingSeat: [-5.5, -4.3, PI / 2],
    catPath: [[0, 3.4], [3.0, 3.2], [4.2, -1.8], [0.5, -1.9], [-3.0, -1.7], [-3.0, 1.6], [-1.0, 3.0]],
  });
}
