// Trend Trễ Agency — an L-shaped creative studio around a rooftop terrace (seen through glass, not walkable).
//   South arm (z 1…10): door + reception lounge (sofa, round coffee table, award cabinet), round creative tables,
//                       a small bar + fridge along the terrace glass, the photo studio at the east end,
//                       the MD's office (SW corner, "gõ cửa 3 lần").
//   West arm (x −14…−2, z −10…1): account / strategy desks, Chị Hồng's timesheet desk, the WIP board + stand-up
//                       circle at the corner of the L, and the pitch room with the big screen at the end of the L.
// Coordinates: x east, z south; spot rotY 0 faces south (+z), PI faces north, PI/2 faces east, −PI/2 west.
import { createKit, FLOORS } from '../kit3d.js';

const PI = Math.PI;
const H = 5.2; // loft: high ceiling, steel beams, long pendant lights

// Three colour tones (preview with ?tone=pop|loft|gallery). All accents are read from the tone.
export const AGENCY_TONES = {
  pop: { name: 'Hồng pop', wall: '#fff0f5', md: '#ff8fab', ceil: '#fbeef3', beam: '#2b2d42', ink: '#2b2d42',
    pink: '#ff5d8f', yellow: '#ffd23f', teal: '#2ec4b6', purple: '#7b5cff', orange: '#ff9f1c',
    floorS: ['planks', '#e8c9a0', '#dfbd92'], floorW: ['terrazzo', '#ffe3ec'], pitch: '#3b3d5c', rug: '#ffd23f', brick: null, s1: '#ffe9a0', s2: '#ffc8dd', s3: '#b8f0d8', s4: '#e8dcff' },
  loft: { name: 'Loft gạch đỏ · xanh rêu', wall: '#f1e8dc', md: '#2d6a4f', ceil: '#2e2e30', beam: '#1f1f1f', ink: '#1f1f1f',
    pink: '#d9532b', yellow: '#f2a71b', teal: '#2d6a4f', purple: '#3d5a80', orange: '#b5673a',
    floorS: ['concrete', '#b9b4ac'], floorW: ['planks', '#8b5e3c', '#7d5233'], pitch: '#2b3a2f', rug: '#f2a71b', brick: '#b5523b', s1: '#f2a71b', s2: '#f6e7c8', s3: '#9cc5a1', s4: '#e9d7b9' },
  gallery: { name: 'Gallery trắng · màu Bauhaus', wall: '#ffffff', md: '#1d4ed8', ceil: '#ffffff', beam: '#111111', ink: '#111111',
    pink: '#e63946', yellow: '#ffbe0b', teal: '#1d4ed8', purple: '#06a77d', orange: '#fb5607',
    floorS: ['concrete', '#ebeae6'], floorW: ['terrazzo', '#f4f3ef'], pitch: '#1d1d1f', rug: '#ffbe0b', brick: null, s1: '#ffbe0b', s2: '#ffffff', s3: '#a8dadc', s4: '#f1f1f1' },
};
const toneFromUrl = () => { try { return new URLSearchParams(location.search).get('tone'); } catch (e) { return null; } };

const S = {
  boss: [-11.3, 7.35, PI],          // Anh Tùng in the MD office
  coach: [-9.4, -0.5, 0.5],         // Anh Tùng when he joins the WIP
  scrum: [-7.5, -0.45, 0],          // Chị Diệp runs the WIP
  senior: [-8.5, -2.15, PI],        // Chị Diệp's desk
  n1: [-12.5, -0.55, 0],            // Anh Khải (CD), black desk by the WIP corner
  n2: [-10.5, -2.15, PI],           // Sương
  n3: [-12.5, -4.3, 0],             // Anh Quân
  n4: [-10.5, -4.3, 0],             // Anh Lộc
  n6: [-8.5, -4.3, 0],              // Chị Kiều
  finance: [-6.0, -4.3, 0],         // Chị Hồng (timesheet)
  hr: [-12.5, -2.15, PI],
  n5: [10.4, 5.6, PI / 2],          // Anh Phát behind the camera in the photo studio
  c1: [-5.5, 3.1, 0],               // Thi, creative table A
  c2: [-4.55, 4.0, -PI / 2],        // Vỹ, creative table A
  c3: [-2.0, 3.1, 0],               // Khánh Linh, creative table B
  corner: [1.6, 3.1, 0], corner2: [2.55, 4.0, -PI / 2],
  reception: [3.5, 7.2, 0],
  reception_side: [5.2, 7.6, -PI / 2],
  pantry: [7.0, 2.45, PI],
  pantry_bao: [8.2, 3.2, PI],
  meeting_head: [-12.6, -7.5, PI / 2], // pitch room: head of the table, by the screen
  mr_n1: [-9.0, -8.55, 0],
  mr_n2: [-9.0, -6.45, PI],
  x1: [6.2, 5.8, PI], x2: [-4.0, -1.8, -PI / 2], x3: [0.6, 7.4, PI],
  giao: [-2.4, 8.8, PI],
  window: [-0.6, 1.6, PI],
  lunch1: [4.4, 2.45, PI], lunch2: [5.3, 2.45, PI], lunch3: [6.2, 2.45, PI], lunch4: [7.1, 2.45, PI], lunch5: [3.5, 2.45, PI],
};
{
  const cx = -7.5, cz = 0.6, rx = 2.6, rz = 1.65;
  [0.62, 0.78, 0.94, 1.1, 1.26, 0.38, 0.22, 0.06, -0.1, -0.26].forEach((a, i) => {
    const x = cx + rx * Math.cos(a * PI), z = cz + rz * Math.sin(a * PI);
    S['su' + (i + 1)] = [x, z, Math.atan2(cx - x, cz - z)];
  });
}
S.su_dat = S.scrum; S.mr_head = S.meeting_head;
Object.assign(S, {
  tuyet: S.boss, thu: S.n1, nhi: S.n2, linh: S.n3, an: S.n4, minh: S.n5, ha: S.n6, long: S.c1, trang: S.c2, bao: S.c3,
  mai: S.senior, han: S.corner, khang: S.corner2, quynh: S.finance, gam: S.reception, binh: S.x2, phuong: S.hr, dat: S.scrum,
});

export function buildAgency(scene, th) {
  const K = createKit(scene);
  const { THREE, box, cyl, sphere, plane, basic, glow, collideRect, collideCircle, floorZone, ceiling, wall, glassWall, sign, poster, desk, plant, interact, canvasTex, textTexture, roundRect, INK } = K;
  const L = (id, d) => (th.labels && th.labels[id]) || d;
  const signs = th.signs || {};
  const D = th.desks || {};
  const C = AGENCY_TONES[toneFromUrl()] || AGENCY_TONES[th.tone] || AGENCY_TONES.loft;
  const fl = (f) => (f[0] === 'planks' ? FLOORS.planks(f[1], f[2]) : f[0] === 'concrete' ? FLOORS.concrete(f[1]) : FLOORS.terrazzo(f[1], [C.pink, C.yellow, C.teal, C.purple]));

  // ---------- floors & ceiling ----------
  floorZone(-14, 1, 14, 10, fl(C.floorS), 1.4);           // south arm: light wood
  floorZone(-14, -10, -2, 1, fl(C.floorW), 2); // west arm
  floorZone(9, 1, 14, 10, '#f4f4f4', 1, 0.006);                                 // photo studio
  floorZone(-14, -10, -2, -5, FLOORS.carpet(C.pitch), 1, 0.006);              // pitch room
  floorZone(-14, 5, -8, 10, FLOORS.carpet(C.md), 1, 0.006);                // MD office
  floorZone(1.8, 6.6, 6.8, 10, FLOORS.carpet(C.rug), 1, 0.006);             // reception rug
  // the terrace outside (inside the L): deck, planters, string lights, sky
  floorZone(-2, -10, 14, 1, FLOORS.planks('#b98b5e', '#a97b50'), 1.0, 0.002);
  ceiling(-14, -10, -2, 1, H, C.ceil);
  ceiling(-2, 1, 14, 10, H, C.ceil);
  ceiling(-14, 1, -2, 10, H, C.ceil);
  // exposed steel beams + ducts under the high ceiling
  for (let x = -12; x <= 12; x += 4) box(0.25, 0.4, 9, C.beam, x, H - 0.4, 5.5, false, 0, 0.012);
  for (let z = -8; z <= 0; z += 4) box(12, 0.4, 0.25, C.beam, -8, H - 0.4, z, false, 0, 0.012);
  { const d = cyl(0.3, 0.3, 28, '#b9c0cc', 0, 0, 3.0, 16, 0.012); d.rotation.z = PI / 2; d.position.y = H - 0.9; }
  { const d = cyl(0.3, 0.3, 11, '#b9c0cc', -11.5, 0, -4.5, 16, 0.012); d.rotation.x = PI / 2; d.position.y = H - 0.9; }
  // clerestory windows high on the outer walls
  const hiWin = new THREE.MeshBasicMaterial({ color: '#bfe3ff' });
  for (let x = -12; x <= 12; x += 3.2) { plane(2.4, 1.1, hiWin, x, H - 1.6, 9.9, PI); box(2.5, 0.06, 0.08, C.ink, x, H - 2.18, 9.88, false, 0, 0.008); }
  for (let z = -8; z <= 8; z += 3.2) { plane(2.4, 1.1, hiWin, -13.9, H - 1.6, z, PI / 2); box(0.08, 0.06, 2.5, C.ink, -13.88, H - 2.18, z, false, 0, 0.008); }
  if (C.brick) { // exposed brick on the two outer walls (around the door)
    const brick = (w, h, x, y, z, ry) => {
      const t = canvasTex(512, 512, FLOORS.brick(C.brick)); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 2, h / 1.2);
      plane(w, h, new THREE.MeshToonMaterial({ map: t }), x, y, z, ry);
    };
    brick(28, H - 2.6, 0, 2.6 + (H - 2.6) / 2, 9.905, PI);
    brick(12.5, 2.6, -7.75, 1.3, 9.905, PI); brick(12.5, 2.6, 7.75, 1.3, 9.905, PI);
    brick(20, H, -13.905, H / 2, 0, PI / 2);
  }
  const sky = canvasTex(1024, 512, (g, w, h) => { const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#8ecbff'); grd.addColorStop(1, '#ffe4f0'); g.fillStyle = grd; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff'; [[160, 120], [520, 80], [820, 150]].forEach(([x, y]) => { for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + k * 36, y + (k % 2) * 8, 34, 0, 7); g.fill(); } }); });
  const skyM = new THREE.MeshBasicMaterial({ map: sky, side: THREE.DoubleSide });
  const skyTop = new THREE.Mesh(new THREE.PlaneGeometry(16, 11), skyM); skyTop.rotation.x = PI / 2; skyTop.position.set(6, 6, -4.5); K.root.add(skyTop);
  plane(16, 8, skyM, 6, 3, -10.2, 0);
  plane(11, 8, skyM, 14.2, 3, -4.5, -PI / 2);
  for (const [x, z] of [[1, -1], [5, -1.5], [10, -1], [12.5, -6], [3, -8.5], [8, -8.6]]) {
    box(1.2, 0.6, 0.6, '#8b5a3c', x, 0, z, false, 0, 0.015);
    for (let i = 0; i < 5; i++) sphere(0.3, ['#3e9b57', '#57b36b', '#2f7d3a'][i % 3], x - 0.4 + i * 0.2, 0.85 + (i % 2) * 0.15, z, 0.015);
  }
  const bulbs = [];
  for (let i = 0; i < 14; i++) bulbs.push(sphere(0.07, glow('#fff3a0'), -1 + i * 1.1, 2.5 - Math.sin(i / 13 * PI) * 0.35, -4.5, 0));
  K.animated.push((t) => bulbs.forEach((b, i) => b.material.color.set(Math.sin(t * 2 + i) > 0 ? '#fff3a0' : '#ffd0e0')));
  // giant rooftop letters on the terrace, facing the door
  const big = textTexture([th.logo ? th.logo[0] : 'TREND TRỄ'], { w: 1024, h: 256, bg: null, fg: C.pink, sizes: [180], weights: [900] });
  box(7.4, 1.0, 0.4, C.ink, 6, 0, -3.2, false, 0, 0.02);
  plane(7.2, 1.8, basic(big), 6, 1.95, -3.0, 0);
  const tag = textTexture([th.logo ? th.logo[2] || '' : ''], { w: 1024, h: 128, bg: C.yellow, fg: C.ink, sizes: [44] });
  plane(5.0, 0.62, basic(tag), 6, 0.5, -2.98, 0);

  // ---------- shell ----------
  wall(-14, 10, 14, 10, C.wall, { h: H, gaps: [[-1.5, 1.5]], doorH: 2.6 });
  glassWall(-1.5, 10, 1.5, 10, { h: 2.6, frame: C.ink });
  collideRect(-1.5, 1.5, 10.05, 10.5);
  wall(-14, -10, -14, 10, C.wall, { h: H });
  wall(-14, -10, -2, -10, C.wall, { h: H });
  wall(14, 1, 14, 10, C.wall, { h: H });
  // the terrace glass, with mullions
  glassWall(-2, -10, -2, 1, { h: H, frame: C.ink, tint: '#d9f0ff', opacity: 0.2 });
  glassWall(-2, 1, 14, 1, { h: H, frame: C.ink, tint: '#d9f0ff', opacity: 0.2 });
  for (let z = -8; z <= 0; z += 2) box(0.08, H, 0.08, C.ink, -2, 0, z, false, 0, 0.012);
  for (let x = 0; x <= 12; x += 2) box(0.08, H, 0.08, C.ink, x, 0, 1, false, 0, 0.012);

  // ================= RECEPTION LOUNGE by the door =================
  box(2.8, 0.42, 0.85, C.pink, 3.5, 0, 9.4, true); box(2.8, 0.55, 0.22, C.pink, 3.5, 0.42, 9.78, false);
  for (const x of [2.3, 3.5, 4.7]) box(0.7, 0.12, 0.6, C.md, x, 0.42, 9.35, false, 0, 0.01);
  cyl(0.6, 0.6, 0.06, '#ffffff', 3.5, 0.42, 8.0, 28, 0.015); cyl(0.06, 0.06, 0.42, C.ink, 3.5, 0, 8.0, 8, 0.01);
  collideCircle(3.5, 8.0, 0.55);
  for (let i = 0; i < 3; i++) box(0.25, 0.02, 0.33, [C.yellow, C.teal, C.purple][i], 3.2 + i * 0.3, 0.48, 7.95, false, 0.3 * i, 0.006);
  cyl(0.25, 0.22, 0.42, C.teal, 2.2, 0, 7.6, 16, 0.015); cyl(0.25, 0.22, 0.42, C.yellow, 4.8, 0, 7.6, 16, 0.015);
  // award cabinet ("tủ cúp")
  box(1.2, 1.9, 0.5, '#ffffff', 6.2, 0, 9.6, true);
  const gm = new THREE.MeshBasicMaterial({ color: '#e8f6ff', transparent: true, opacity: 0.35, depthWrite: false });
  const gc = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 0.05), gm); gc.position.set(6.2, 1.05, 9.33); K.root.add(gc);
  for (let s = 0; s < 3; s++) for (let i = 0; i < 3; i++) { const x = 5.85 + i * 0.35, y = 0.3 + s * 0.55; cyl(0.06, 0.08, 0.1, '#c9a227', x, y, 9.55, 10, 0.008); sphere(0.08, s === 2 && i === 1 ? '#ffd23f' : '#c0c6cf', x, y + 0.2, 9.55, 0.008); }
  poster(['AWARD 2019', '(shortlist)'], { w: 512, h: 256, bg: C.yellow, sizes: [54, 40] }, 6.2, 2.05, 9.34, PI, 0.9, 0.45);
  interact('safe', L('safe', 'Nhìn tủ cúp giải thưởng'), 6.2, 0.9, 9.2);
  // neon logo above the sofa
  poster(th.logo || ['TREND TRỄ'], { w: 1024, h: 384, bg: C.ink, fg: '#ffffff', sizes: [110, 40, 32], weights: [900, 700, 500], border: C.pink }, 3.5, 2.15, 9.88, PI, 3.2, 1.2);
  plant(1.95, 9.5, { s: 0.9, pot: C.yellow, leaf: '#3e9b57' });

  // ================= along the south wall: altar, brief whiteboard, printer =================
  box(1.0, 0.7, 0.55, '#d63031', -7.2, 0, 9.5, true);
  box(1.1, 0.06, 0.62, '#ffe08a', -7.2, 0.7, 9.5, false);
  sphere(0.11, '#ffd25a', -7.45, 0.9, 9.55); sphere(0.11, '#ffd25a', -6.95, 0.9, 9.55);
  const ab = [];
  for (let i = 0; i < 6; i++) ab.push(sphere(0.03, glow('#ff6f8a'), -7.65 + i * 0.18, 1.38, 9.74, 0));
  K.animated.push((t) => ab.forEach((b, i) => b.material.color.set(((Math.floor(t * 3) + i) % 2) ? '#ff6f8a' : '#ffe08a')));
  interact('altar', L('altar', 'Thắp hương Thần Tài'), -7.2, 0.9, 9.3);
  const wb = textTexture(th.whiteboard || ['BRIEF'], { w: 768, h: 512, bg: '#ffffff', fg: C.pink, sizes: [56, 52, 38, 38, 34], weights: [900, 900, 700, 700, 500], align: 'left', pad: 40 });
  box(2.2, 1.4, 0.05, '#ffffff', -5.0, 0.8, 9.88, false, 0, 0.02);
  plane(2.1, 1.3, basic(wb), -5.0, 1.5, 9.84, PI);
  interact('okr', L('okr', 'Đọc bảng trắng'), -5.0, 1.4, 9.6);
  box(0.6, 0.8, 0.5, '#ffffff', -3.0, 0, 9.5, true); box(0.6, 0.25, 0.5, '#ffc8dd', -3.0, 0.8, 9.5, false);
  interact('printer', L('printer', 'Dùng máy in'), -3.0, 0.9, 9.15);
  poster([th.banner || 'BRIEF · DECK · FEEDBACK'], { w: 1024, h: 128, bg: C.yellow, sizes: [48], weights: [900] }, -4.2, 2.75, 9.88, PI, 4.6, 0.58);

  // ================= MD OFFICE (south-west corner) =================
  wall(-14, 5, -8, 5, C.md, { h: 3.2 });
  wall(-8, 5, -8, 10, C.md, { h: 3.2, gaps: [[5.6, 6.8]] });
  box(6, 0.08, 5, C.md, -11, 3.2, 7.5, false, 0, 0.015); // MD office is a box with its own lid under the loft
  desk(-11.3, 6.6, 1, { plate: 'Tùng · MD', screen: [['KV v14', '"chưa pop"'], C.pink], chair: C.ink, top: '#ffffff', leg: C.ink, w: 1.8 });
  box(0.75, 0.45, 2.0, C.ink, -13.5, 0, 7.6, true); box(0.2, 0.5, 2.0, C.ink, -13.8, 0.45, 7.6, false);
  poster([th.bossWall || 'Make it POP'], { w: 1024, h: 256, bg: C.ink, fg: C.yellow, sizes: [130], weights: [900], border: C.yellow }, -11.3, 2.1, 9.88, PI, 3.0, 0.75);
  sign(signs.boss || 'MD', C.s2, -7.9, 2.6, 6.2, PI / 2, 1.5);
  const mood = canvasTex(768, 512, (g, w, h) => {
    g.fillStyle = '#ffffff'; roundRect(g, 4, 4, w - 8, h - 8, 22); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    const cs = ['#ff5d8f', '#ffd23f', '#2ec4b6', '#7b5cff', '#ff9f1c', '#e63946', '#3a86ff', '#2b2d42'];
    for (let i = 0; i < 8; i++) { g.fillStyle = cs[i]; g.save(); g.translate(90 + (i % 4) * 180, 130 + Math.floor(i / 4) * 220); g.rotate(((i * 37) % 9 - 4) * 0.03); g.fillRect(-70, -80, 140, 160); g.lineWidth = 5; g.strokeRect(-70, -80, 140, 160); g.restore(); }
    g.fillStyle = INK; g.font = '900 40px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText('MOODBOARD: "POP hơn nữa"', w / 2, h - 18);
  });
  plane(2.4, 1.6, basic(mood), -11.0, 1.6, 5.1, 0);
  for (let i = 0; i < 4; i++) { const x = -9.2 + i * 0.01; box(0.5, 0.35, 0.4, [C.pink, C.yellow, C.teal, C.purple][i], x, i * 0.35, 9.5, i === 0, 0, 0.012); }
  poster(['CLIENT GIFT', '(chưa mở)'], { w: 256, h: 128, bg: C.yellow, sizes: [40, 30] }, -9.2, 1.6, 9.28, PI, 0.6, 0.3);

  // ================= CREATIVE ROUND TABLES (south arm, centre) =================
  const roundTable = (x, z, col) => {
    cyl(0.78, 0.78, 0.06, '#ffffff', x, 0.72, z, 32, 0.02);
    cyl(0.07, 0.1, 0.72, C.ink, x, 0, z, 10, 0.01);
    collideCircle(x, z, 0.72);
    for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4; cyl(0.2, 0.18, 0.45, col[i % col.length], x + Math.cos(a) * 1.05, 0, z + Math.sin(a) * 1.05, 14, 0.015); }
  };
  roundTable(-5.5, 4.0, [C.pink, C.yellow, C.teal, C.purple]);
  roundTable(-2.0, 4.0, [C.yellow, C.teal, C.pink, C.orange]);
  roundTable(1.6, 4.0, [C.teal, C.purple, C.yellow, C.pink]);
  const laptop = (x, z, ry, lines, bg) => {
    box(0.4, 0.02, 0.28, '#dfe6ee', x, 0.78, z, false, ry, 0.006);
    const scr = plane(0.38, 0.24, new THREE.MeshBasicMaterial({ map: textTexture(lines, { w: 256, h: 160, bg, fg: '#ffffff', sizes: [26, 20], radius: 10, border: null }), side: THREE.DoubleSide }), x - Math.sin(ry) * 0.13, 0.92, z - Math.cos(ry) * 0.13, ry);
    return scr;
  };
  const scr = (slot, d) => (D[slot] && D[slot][1]) || d;
  const col = (slot, d) => (D[slot] && D[slot][2]) || d;
  laptop(-5.5, 3.6, PI, scr('c1', ['Copy']), col('c1', C.purple));
  laptop(-4.95, 4.0, -PI / 2, scr('c2', ['Design']), col('c2', C.pink));
  laptop(-2.0, 3.6, PI, scr('c3', ['TikTok']), col('c3', C.yellow));
  laptop(-2.0, 4.45, 0, scr('me', ['Zalo']), col('me', '#ff8fb1'));
  interact('desk', L('desk', 'Ngồi vào chỗ của mình ở bàn tròn'), -2.0, 0.8, 4.5);
  poster([(D.me && D.me[0]) || 'Intern · Bạn'], { w: 256, h: 64, bg: '#ffffff', sizes: [28], radius: 12 }, -2.0, 0.8, 4.79, 0, 0.32, 0.08);
  // table C: brainstorm, with the red chair
  for (let i = 0; i < 6; i++) box(0.12, 0.01, 0.12, ['#ffe9a0', '#ffc8dd', '#b8f0d8'][i % 3], 1.3 + (i % 3) * 0.25, 0.79, 3.8 + Math.floor(i / 3) * 0.3, false, i * 0.4, 0.004);
  K.plasticChair(1.6, 5.15, PI, '#e63946');
  interact('redchair', L('redchair', 'Ghế đỏ "brainstorm"'), 1.6, 0.6, 5.15);
  sign('KHU SÁNG TẠO · nói to lên', C.s1, -2.0, 2.75, 4.0, 0, 2.6);
  // pendant lamps over the tables
  for (const x of [-5.5, -2.0, 1.6]) { cyl(0.008, 0.008, H - 2.3, '#222', x, 2.3, 4.0, 4, 0); cyl(0.05, 0.45, 0.4, [C.pink, C.yellow, C.teal][Math.round((x + 5.5) / 3.5)], x, 2.0, 4.0, 18, 0.012); sphere(0.11, glow('#fff3c4'), x, 1.98, 4.0, 0); }

  // ================= BAR + FRIDGE along the terrace glass =================
  box(4.0, 1.0, 0.55, C.ink, 5.8, 0, 1.6, true);
  box(4.1, 0.05, 0.65, '#ffffff', 5.8, 1.0, 1.6, false);
  for (let i = 0; i < 5; i++) cyl(0.18, 0.15, 0.72, [C.pink, C.yellow, C.teal, C.purple, C.orange][i], 3.5 + i * 0.9, 0, 2.35, 12, 0.012);
  for (let i = 0; i < 4; i++) box(0.12, 0.16, 0.12, '#ffd23f', 4.4 + i * 0.3, 1.05, 1.55, false, 0, 0.006);
  poster(['MÌ ÔNG TÁO', 'sample · free'], { w: 512, h: 256, bg: '#ffd166', sizes: [52, 38] }, 5.1, 1.35, 1.6, 0, 0.6, 0.3);
  box(0.8, 1.9, 0.75, '#bfe3ff', 8.4, 0, 1.55, true);
  box(0.04, 0.5, 0.06, '#ffffff', 8.0, 0.9, 1.95, false, 0, 0.006);
  interact('coffee', L('coffee', 'Pantry: ăn uống, cà phê'), 7.0, 1.1, 1.95);
  sign(signs.pantry || 'PANTRY', C.s1, 5.8, 2.7, 1.12, 0, 2.6);

  // ================= PHOTO STUDIO (east end) =================
  wall(9, 1, 9, 5.6, C.ink, { h: 3.4 });
  for (const z0 of [5.75, 9.6]) for (let i = 0; i < 3; i++) plane(0.18, 2.7, new THREE.MeshToonMaterial({ color: '#3a3a4a', side: THREE.DoubleSide }), 9.0 + (i - 1) * 0.06, 1.35, z0 + (z0 < 7 ? i : -i) * 0.12, PI / 2 + (i % 2 ? 0.5 : -0.5));
  box(0.06, 0.06, 4.4, '#888888', 9.0, 2.72, 7.8, false, 0, 0.006);
  sign('STUDIO · ĐANG QUAY 🔴', '#ff5d8f', 8.88, 2.6, 3.3, -PI / 2, 2.0);
  // cyclorama: white wall + curved sweep onto the floor
  plane(8.6, H, new THREE.MeshBasicMaterial({ color: '#ffffff' }), 13.85, H / 2, 5.5, -PI / 2);
  const sweep = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 8.6, 16, 1, true, 0, PI / 2), new THREE.MeshBasicMaterial({ color: '#f7f7f7', side: THREE.DoubleSide }));
  sweep.rotation.x = PI / 2; sweep.rotation.y = PI; sweep.position.set(12.85, 1, 5.5); K.root.add(sweep);
  floorZone(11.5, 1.2, 13.9, 9.8, '#ffffff', 1, 0.008);
  collideRect(12.6, 14, 1, 10);
  box(0.9, 0.7, 0.6, '#ffffff', 12.2, 0, 5.5, true);
  for (let i = 0; i < 5; i++) box(0.16, 0.26, 0.1, ['#ffd166', '#ff9f1c', '#e63946'][i % 3], 11.9 + (i % 3) * 0.2, 0.7, 5.35 + Math.floor(i / 3) * 0.25, false, 0.3, 0.008);
  for (const z of [3.6, 7.4]) {
    cyl(0.02, 0.02, 1.7, '#333', 11.0, 0, z, 6, 0.006);
    box(0.7, 0.7, 0.2, '#ffffff', 11.0, 1.6, z, false, z < 5 ? -0.6 : 0.6, 0.015);
    collideCircle(11.0, z, 0.15);
  }
  cyl(0.02, 0.02, 1.3, '#333', 11.0, 0, 5.5, 6, 0.006); box(0.3, 0.2, 0.25, '#1d1d1f', 11.0, 1.3, 5.5, false, 0, 0.01); collideCircle(11.0, 5.5, 0.15);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 10, 30), glow('#fffbe0')); ring.position.set(10.0, 1.55, 8.6); ring.rotation.y = PI / 2; K.root.add(ring);
  cyl(0.02, 0.02, 1.5, '#333', 10.0, 0, 8.6, 6, 0.006);
  // the prop plant (watered for every shoot)
  cyl(0.22, 0.18, 0.4, '#ffffff', 12.3, 0, 8.6); for (let i = 0; i < 5; i++) sphere(0.2, '#57b36b', 12.3 + Math.cos(i * 1.3) * 0.12, 0.6 + i * 0.12, 8.6 + Math.sin(i * 1.3) * 0.12, 0.015);
  interact('plant', L('plant', 'Tưới cây (đạo cụ quay)'), 12.0, 0.8, 8.6);

  // ================= WEST ARM: account / strategy desks =================
  const dk = (x, z, f, slot, chair) => { const d = D[slot]; desk(x, z, f, { plate: d && d[0], screen: d && d[1] ? [d[1], d[2] || C.pink] : null, chair, top: '#ffffff', leg: C.ink }); };
  dk(-12.5, -3.6, -1, 'n3', C.purple); dk(-10.5, -3.6, -1, 'n4', '#3a86ff'); dk(-8.5, -3.6, -1, 'n6', C.pink);
  dk(-12.5, -2.85, 1, 'hr', '#9aa0ad'); dk(-10.5, -2.85, 1, 'n2', C.teal); dk(-8.5, -2.85, 1, 'senior', C.orange);
  desk(-12.5, 0.15, -1, { plate: (D.n1 && D.n1[0]) || 'CD', screen: [(D.n1 && D.n1[1]) || ['IDEAS'], '#2b2d42'], chair: '#1d1d1f', top: '#2b2d42', leg: '#1d1d1f' });
  dk(-6.0, -3.6, -1, 'finance', '#b8f0d8');
  box(0.6, 1.4, 1.2, '#ffffff', -2.45, 0, -1.8, true);
  poster(['TIMESHEET', '2016–2026'], { w: 512, h: 256, bg: C.s3, sizes: [52, 40] }, -2.76, 1.0, -1.8, -PI / 2, 1.0, 0.5);
  sign(signs.finance || 'TIMESHEET', C.s3, -6.0, 2.65, -4.85, 0, 2.2);
  box(0.6, 1.8, 0.6, '#2a2f3a', -2.45, 0, -3.3, true);
  poster(['Ổ CỨNG CHUNG', '98% đầy'], { w: 512, h: 256, bg: C.s2, sizes: [46, 40] }, -2.76, 2.0, -3.3, -PI / 2, 0.7, 0.35);
  sign('ACCOUNT · STRATEGY · MEDIA · KOL', C.s4, -10.5, 2.75, -3.2, 0, 3.4);
  // WIP board at the corner of the L + floor ring
  const scrum = th.scrum || { cols: ['TODO', 'DOING', 'DONE'], notes: [[], [], []] };
  const kb = canvasTex(1024, 560, (g, w, h) => {
    g.fillStyle = '#ffffff'; roundRect(g, 4, 4, w - 8, h - 8, 26); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    const nc = ['#ffc8dd', '#ffe9a0', '#c9b6ff', '#b8f0d8', '#bfe3ff'];
    scrum.cols.forEach((t, i) => {
      const x = 24 + i * 330;
      g.fillStyle = ['#ffc8dd', '#ffe9a0', '#b8f0d8'][i]; roundRect(g, x, 24, 310, 66, 14); g.fill(); g.lineWidth = 6; g.stroke();
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
  box(0.08, 1.9, 0.08, C.ink, -9.0, 0, -1.2, false, 0, 0.012); box(0.08, 1.9, 0.08, C.ink, -6.0, 0, -1.2, false, 0, 0.012);
  box(3.05, 1.7, 0.05, '#ffffff', -7.5, 0.7, -1.22, false, 0, 0.02);
  plane(3.0, 1.64, basic(kb), -7.5, 1.55, -1.18, 0);
  collideRect(-9.1, -5.9, -1.35, -1.05);
  sign(signs.standup || 'WIP', C.s2, -7.5, 2.65, -1.17, 0, 2.6);
  const ringM = new THREE.Mesh(new THREE.RingGeometry(1.9, 2.0, 48), new THREE.MeshBasicMaterial({ color: C.pink }));
  ringM.rotation.x = -PI / 2; ringM.scale.set(1.35, 0.85, 1); ringM.position.set(-7.5, 0.009, 0.6); K.root.add(ringM);

  // ================= PITCH ROOM (end of the L, north) =================
  glassWall(-14, -5, -4.2, -5, { frame: C.ink, h: 3.4 });
  glassWall(-2.9, -5, -2, -5, { frame: C.ink, h: 3.4 });
  box(1.3, 0.8, 0.12, C.ink, -3.55, 2.6, -5, false, 0, 0.01);
  box(12, 0.08, 5, C.ink, -8, 3.4, -7.5, false, 0, 0.015); // pitch room lid under the loft
  box(7.0, 0.06, 1.2, '#ffffff', -8.5, 0.72, -7.5, false, 0, 0.02);
  for (const dx of [-3, 3]) box(0.1, 0.72, 1.0, C.ink, -8.5 + dx, 0, -7.5, false, 0, 0.01);
  collideRect(-12.0, -5.0, -8.1, -6.9);
  for (let i = 0; i < 5; i++) for (const z of [-8.55, -6.45]) { const x = -11.0 + i * 1.25; box(0.45, 0.1, 0.45, [C.pink, C.yellow, C.teal, C.purple, C.orange][i], x, 0.42, z, false); box(0.45, 0.5, 0.08, [C.pink, C.yellow, C.teal, C.purple, C.orange][i], x, 0.5, z + (z < -7.5 ? -0.22 : 0.22), false); }
  box(0.12, 1.6, 2.8, '#111111', -13.9, 0.8, -7.5, false, 0, 0.015);
  poster(['PITCH: BIA HƠI PHỐ', 'slide 1/80 · "Insight: người Việt thích vui"'], { w: 1024, h: 576, bg: '#111827', fg: '#ffffff', sizes: [70, 34], border: null }, -13.82, 1.6, -7.5, PI / 2, 2.7, 1.52);
  box(0.45, 0.45, 0.45, C.yellow, -3.8, 0, -7.5, false, 0, 0.02);
  interact('interview', L('interview', 'Ngồi vào ghế phòng pitch'), -3.8, 0.8, -7.5);
  sign(signs.meeting || 'PHÒNG PITCH', C.s1, -8.5, 2.95, -4.94, 0, 2.6);
  sign(signs.meeting || 'PHÒNG PITCH', C.s1, -8.5, 2.95, -5.06, PI, 2.6);
  for (const x of [-10.5, -6.5]) { cyl(0.008, 0.008, H - 2.5, '#222', x, 2.5, -7.5, 4, 0); cyl(0.3, 0.3, 0.1, '#ffffff', x, 2.4, -7.5, 20, 0.012); }
  plant(-13.4, -4.4, { s: 1.0, pot: C.pink, leaf: '#3e9b57' });
  plant(-2.6, 0.4, { s: 1.0, pot: C.yellow, leaf: '#3e9b57' });

  K.lights({ sky: '#fff6fa', ground: '#ffe9d6', hemi: 1.6, amb: 0.5, sun: 1.05 });

  return K.result({
    spots: S,
    bounds: { minX: -13.7, maxX: 13.7, minZ: -9.7, maxZ: 9.75 },
    playerStart: [0, 8.8, 0],
    meetingSeat: [-3.8, -7.5, PI / 2],
    catPath: [[0, 6.5], [4.0, 5.6], [7.5, 4.2], [-0.4, 2.2], [-4.0, 1.6], [-4.0, -1.8], [-7.5, 2.8], [-4.5, 6.6]],
  });
}
