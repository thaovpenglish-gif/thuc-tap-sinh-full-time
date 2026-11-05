// Đi Đâu Cũng Được — small office in front, big props warehouse behind (26 × 20 m).
//   South half (z 0…10, low ceiling): glass door, Chị Lan's counter + key cabinet, the shared long hot desk,
//     Chị Kiều's glass office (SW, "cấm hát"), Cô Bích's accounting corner + deposit safe (SE), the guide's desk.
//   North half (z −10…0, 6 m warehouse): road cases, truss, inflatable arch, banner rolls, folding chairs, tents,
//     the AV rack (Anh Quân), the briefing board + circle, the round standing "meeting" table by the giant event
//     calendar (plus camp beds: phòng họp / phòng ngủ trưa), and the pantry (water, fridge, leftover gala food).
// Coordinates: x east, z south; spot rotY 0 faces south (+z), PI faces north, PI/2 faces east, −PI/2 west.
import { createKit, FLOORS } from '../kit3d.js';

const PI = Math.PI;
const HW = 6;    // warehouse height
const HO = 3.0;  // office ceiling

const S = {
  boss: [-10.5, 8.35, PI],            // Chị Kiều in her glass office
  coach: [-1.0, -3.4, 0],             // Chị Kiều / Anh Duy addressing everyone in the warehouse
  senior: [6.0, 1.25, 0],             // Anh Duy, producer desk by the warehouse opening
  scrum: [2.0, -5.85, 0],             // briefing lead, in front of the board
  n3: [-8.0, 3.05, 0], n2: [-6.0, 3.05, 0], n1: [-4.0, 3.05, 0], n4: [-2.0, 3.05, 0], n5: [0.0, 3.05, 0],
  c1: [-8.0, 4.95, PI], c3: [-4.0, 4.95, PI], n6: [-2.0, 4.95, PI], c2: [0.0, 4.95, PI],
  x3: [-4.6, 7.9, 0],                 // Anh Hải by the guide's desk
  hr: [-4.6, 7.9, 0],
  finance: [9.5, 6.85, 0],            // Cô Bích
  reception: [3.6, 7.6, 0],           // Chị Lan behind the counter
  it: [7.0, -3.1, -PI / 2],           // Anh Quân at the AV rack
  pantry: [10.4, -2.6, PI / 2],
  pantry_bao: [9.0, -3.6, PI / 2],
  meeting_head: [-7.0, -1.15, PI],    // standing table by the event calendar
  mr_n1: [-8.1, -2.1, PI / 2],
  mr_n2: [-5.9, -2.1, -PI / 2],
  x1: [9.5, -6.5, -PI / 2], x2: [-10.0, -6.0, PI / 2],
  corner: [4.5, -3.0, -PI / 2], corner2: [-3.5, -3.0, PI / 2],
  giao: [-2.4, 8.7, PI],
  reception_side: [2.0, 8.0, PI / 2],
  window: [0, -9.0, PI],
  lunch1: [9.0, -4.6, 0], lunch2: [10.0, -4.6, 0], lunch3: [11.0, -4.6, 0], lunch4: [9.0, -6.4, PI], lunch5: [10.0, -6.4, PI],
};
{
  const cx = 2.0, cz = -4.0, rx = 2.6, rz = 1.65;
  [0.62, 0.78, 0.94, 1.1, 1.26, 0.38, 0.22, 0.06, -0.1, -0.26].forEach((a, i) => {
    const x = cx + rx * Math.cos(a * PI), z = cz + rz * Math.sin(a * PI);
    S['su' + (i + 1)] = [x, z, Math.atan2(cx - x, cz - z)];
  });
}
S.su_dat = S.scrum; S.mr_head = S.meeting_head;
Object.assign(S, {
  tuyet: S.boss, thu: S.n1, nhi: S.n2, linh: S.n3, an: S.n4, minh: S.n5, ha: S.n6, long: S.c1, trang: S.c2, bao: S.c3,
  mai: S.senior, han: S.corner, khang: S.corner2, quynh: S.finance, gam: S.reception, binh: S.it, phuong: S.hr, dat: S.scrum,
});

export function buildEvent(scene, th) {
  const K = createKit(scene);
  const { THREE, box, cyl, sphere, plane, basic, glow, collideRect, collideCircle, floorZone, ceiling, wall, glassWall, sign, poster, plant, interact, canvasTex, textTexture, roundRect, INK, stool, plasticChair } = K;
  const L = (id, d) => (th.labels && th.labels[id]) || d;
  const signs = th.signs || {};
  const D = th.desks || {};
  const C = { wall: '#fff3d6', metal: '#9aa3ad', orange: '#f2a65a', teal: '#3fa37a', yellow: '#ffd166', pink: '#ff7a9a', navy: '#24304a', wood: '#c98f5a' };

  // ---------- floors & ceilings ----------
  floorZone(-13, 0, 13, 10, FLOORS.planks('#d9b48a', '#cfa77a'), 1.3);
  floorZone(-13, -10, 13, 0, FLOORS.concrete('#b7b3ab', 'rgba(0,0,0,0.06)'), 3);
  floorZone(-13, 6, -8, 10, FLOORS.carpet('#ff9fb2'), 1, 0.006);
  for (const [x1, z1, x2, z2] of [[-12.6, -9.6, -12.5, -0.4], [12.5, -9.6, 12.6, -0.4], [-4, -9.0, 4, -8.9]]) floorZone(x1, z1, x2, z2, C.yellow, 1, 0.007);
  ceiling(-13, 0, 13, 10, HO, '#fffaf0');
  ceiling(-13, -10, 13, 0, HW, '#5a6170');
  for (let x = -10; x <= 10; x += 5) { box(0.25, 0.35, 10, '#3a3f4b', x, HW - 0.35, -5, false, 0, 0.01); cyl(0.01, 0.01, 1.6, '#222', x, HW - 1.6, -5, 4, 0); cyl(0.2, 0.55, 0.35, '#3a3f4b', x, HW - 1.95, -5, 16, 0.012); sphere(0.14, glow('#fff3c4'), x, HW - 1.98, -5, 0); }
  for (let x = -12; x <= 12; x += 4) for (const z of [2.5, 7.5]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.5), glow('#ffffff')); l.rotation.x = PI / 2; l.position.set(x, HO - 0.01, z); K.root.add(l); }

  // ---------- shell ----------
  wall(-13, 10, 13, 10, C.wall, { h: HO, gaps: [[-1.5, 1.5]], doorH: 2.6 });
  glassWall(-1.5, 10, 1.5, 10, { h: 2.6, frame: C.navy });
  collideRect(-1.5, 1.5, 10.05, 10.5);
  wall(-13, 0, -13, 10, C.wall, { h: HO });
  wall(13, 0, 13, 10, C.wall, { h: HO });
  // corrugated warehouse walls
  const corr = canvasTex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#a7b0ba' : '#8f98a3'; g.fillRect(i * w / 8, 0, w / 8, h); } });
  corr.wrapS = corr.wrapT = THREE.RepeatWrapping;
  const corrM = (rx, ry) => { const t = corr.clone(); t.needsUpdate = true; t.repeat.set(rx, ry); return new THREE.MeshToonMaterial({ map: t }); };
  wall(-13, -10, -13, 0, C.metal, { h: HW }); wall(13, -10, 13, 0, C.metal, { h: HW });
  wall(-13, -10, 13, -10, C.metal, { h: HW, gaps: [[-3, 3]], doorH: 4.0 });
  plane(10, HW, corrM(10, 1), -12.91, HW / 2, -5, PI / 2); plane(10, HW, corrM(10, 1), 12.91, HW / 2, -5, -PI / 2);
  // big roller door on the loading side, half open, daylight outside
  box(6, 1.8, 0.12, '#c0c6cf', 0, 2.2, -10, false, 0, 0.015);
  for (let i = 0; i < 6; i++) box(6, 0.03, 0.14, '#8f98a3', 0, 2.25 + i * 0.3, -10, false, 0, 0);
  plane(6, 2.2, glow('#fff6d6'), 0, 1.1, -10.3, 0);
  collideRect(-3, 3, -10.5, -10.05);
  poster(['KHU BỐC XẾP', 'xe tải vào lúc 4h sáng'], { w: 512, h: 256, bg: C.yellow, sizes: [52, 34] }, 4.6, 2.4, -9.9, 0, 1.6, 0.8);
  // partition between office and warehouse, wide opening in the middle
  wall(-13, 0, 13, 0, C.wall, { h: HW, gaps: [[-3, 3]], doorH: HO });
  for (let i = 0; i < 9; i++) box(0.7, 0.06, 0.04, i % 2 ? C.yellow : INK, -2.8 + i * 0.7, HO - 0.12, -0.1, false, 0.6, 0);
  sign('KHO ĐẠO CỤ · ĐỘI MŨ KHI BÊ TRUSS', '#ffe9a0', 0, 2.55, 0.1, 0, 3.2);
  poster([th.banner || 'CÓ PLAN B CHƯA?'], { w: 1024, h: 128, bg: C.orange, fg: '#ffffff', sizes: [56], weights: [900] }, 0, 3.8, -0.1, PI, 6, 0.75);

  // ================= OFFICE (south) =================
  // Chị Lan's counter + key cabinet
  box(2.2, 1.0, 0.65, C.teal, 3.6, 0, 8.3, true); box(2.3, 0.05, 0.75, '#fff3d6', 3.6, 1.0, 8.3, false);
  poster(th.logo ? [th.logo[0]] : ['ĐI ĐÂU CŨNG ĐƯỢC'], { w: 1024, h: 160, bg: C.teal, fg: '#ffffff', sizes: [64] }, 3.6, 0.55, 8.64, 0, 2.0, 0.31);
  box(0.9, 0.9, 0.12, '#8b5a3c', 5.6, 1.1, 9.88, false, 0, 0.015);
  for (let i = 0; i < 12; i++) sphere(0.035, '#ffd25a', 5.25 + (i % 4) * 0.23, 1.3 + Math.floor(i / 4) * 0.25, 9.8, 0.004);
  poster(['CHÌA KHÓA KHO', 'ký sổ khi mượn'], { w: 512, h: 160, bg: '#fff3d6', sizes: [40, 30] }, 5.6, 2.2, 9.86, PI, 1.0, 0.31);
  sign(signs.reception || 'LỄ TÂN · THỦ KHO', '#d6f5e8', 3.6, 2.45, 8.0, 0, 1.6);
  poster(th.logo || ['ĐI ĐÂU CŨNG ĐƯỢC'], { w: 1024, h: 384, bg: C.orange, fg: '#ffffff', sizes: [92, 38, 32], weights: [900, 700, 500] }, -4.0, 1.9, 9.88, PI, 3.6, 1.35);
  // altar + plant by the door
  box(1.0, 0.7, 0.55, '#d63031', 7.2, 0, 9.5, true);
  box(1.1, 0.06, 0.62, '#ffe08a', 7.2, 0.7, 9.5, false);
  sphere(0.11, '#ffd25a', 6.95, 0.9, 9.55); sphere(0.11, '#ffd25a', 7.45, 0.9, 9.55);
  box(0.12, 0.2, 0.08, '#ffffff', 7.2, 0.76, 9.35, false, 0, 0.006);
  const ab = [];
  for (let i = 0; i < 6; i++) ab.push(sphere(0.03, glow('#ff6f8a'), 6.75 + i * 0.18, 1.38, 9.74, 0));
  K.animated.push((t) => ab.forEach((b, i) => b.material.color.set(((Math.floor(t * 3) + i) % 2) ? '#ff6f8a' : '#ffe08a')));
  interact('altar', L('altar', 'Thắp hương Thần Tài'), 7.2, 0.9, 9.3);
  plant(2.2, 9.4, { s: 1.0, pot: C.orange, leaf: '#3e9b57' });
  interact('plant', L('plant', 'Xem cây'), 2.2, 0.8, 9.1);
  // the shared long hot desk
  box(10.4, 0.07, 1.4, '#fffaf2', -4.0, 0.72, 4.0, false, 0, 0.025);
  for (const x of [-9.0, -4.0, 1.0]) for (const dz of [-0.55, 0.55]) box(0.1, 0.72, 0.1, C.navy, x, 0, 4.0 + dz, false, 0, 0.01);
  collideRect(-9.2, 1.2, 3.3, 4.7);
  const seat = (x, z, slot, face, chair) => {
    const d = D[slot] || [];
    box(0.42, 0.02, 0.3, '#dfe6ee', x, 0.79, z + face * 0.4, false, 0, 0.006);
    if (d[1]) plane(0.4, 0.25, new THREE.MeshBasicMaterial({ map: textTexture(d[1], { w: 256, h: 160, bg: d[2] || C.navy, fg: '#ffffff', sizes: [26, 20], radius: 10, border: null }), side: THREE.DoubleSide }), x, 0.95, z + face * 0.25, face < 0 ? 0 : PI);
    if (d[0]) poster([d[0]], { w: 256, h: 64, bg: '#ffffff', sizes: [28], radius: 12 }, x + 0.35, 0.82, z + face * 0.69, face < 0 ? PI : 0, 0.3, 0.075);
    plasticChair(x, z + face * 1.05, face < 0 ? PI : 0, chair);
  };
  // north side (people face south), south side (people face north)
  [['n3', -8], ['n2', -6], ['n1', -4], ['n4', -2], ['n5', 0]].forEach(([sl, x]) => seat(x, 4.0, sl, -1, C.teal));
  [['c1', -8], ['me', -6], ['c3', -4], ['n6', -2], ['c2', 0]].forEach(([sl, x]) => seat(x, 4.0, sl, 1, sl === 'me' ? C.orange : C.yellow));
  interact('desk', L('desk', 'Ngồi vào chỗ của mình ở bàn dài'), -6.0, 0.8, 4.6);
  for (let i = 0; i < 5; i++) box(0.14, 0.14, 0.14, ['#222', '#222', C.yellow, '#222', C.pink][i], -8.6 + i * 2.3, 0.79, 3.9, false, 0, 0.006); // tape rolls, walkie
  sign('BÀN CHUNG · AI TỚI TRƯỚC NGỒI TRƯỚC', '#ffe9a0', -4.0, 2.5, 4.0, 0, 3.4);
  for (let i = 0; i < 6; i++) { const x = -9 + i * 2; cyl(0.006, 0.006, 0.5, '#222', x, HO - 0.5, 4.0, 4, 0); cyl(0.05, 0.3, 0.25, [C.orange, C.teal, C.yellow][i % 3], x, HO - 0.75, 4.0, 16, 0.01); sphere(0.07, glow('#fff3c4'), x, HO - 0.76, 4.0, 0); }
  // printer
  box(0.6, 0.8, 0.5, '#ffffff', 2.5, 0, 5.6, true); box(0.6, 0.25, 0.5, '#ffd3b8', 2.5, 0.8, 5.6, false);
  for (let i = 0; i < 3; i++) box(0.3, 0.02, 0.2, '#ffffff', 2.5, 1.06 + i * 0.02, 5.6, false, i * 0.3, 0.004);
  interact('printer', L('printer', 'Dùng máy in màu'), 2.5, 0.9, 5.25);
  // guide's desk (flags, megaphone, raincoats)
  box(1.4, 0.75, 0.7, C.wood, -4.6, 0, 8.6, true);
  cyl(0.008, 0.008, 1.6, '#666', -5.1, 0.75, 8.6, 4, 0); plane(0.4, 0.28, basic(textTexture(['🚩'], { w: 128, h: 96, bg: C.yellow, sizes: [60], border: null, radius: 4 })), -4.9, 2.2, 8.6, 0);
  cyl(0.1, 0.16, 0.3, '#ffffff', -4.2, 0.75, 8.5, 12, 0.01).rotation.z = PI / 2;
  poster([(D.hr && D.hr[0]) || 'Bàn HDV'], { w: 256, h: 64, bg: '#ffffff', sizes: [28], radius: 12 }, -4.6, 0.6, 8.96, 0, 0.5, 0.12);
  // Chị Kiều's glass office (SW)
  glassWall(-13, 6, -8, 6, { h: HO, frame: C.navy });
  glassWall(-8, 6, -8, 7.2, { h: HO, frame: C.navy });
  glassWall(-8, 8.4, -8, 10, { h: HO, frame: C.navy });
  K.desk(-10.5, 7.6, 1, { plate: 'Kiều · CEO', screen: [['Lịch show', 'tháng 12: 23'], C.orange], chair: C.pink, top: '#fffaf2', leg: C.navy, w: 1.8 });
  cyl(0.08, 0.1, 0.12, '#c9a227', -11.8, 0.78, 7.5, 10, 0.008); cyl(0.03, 0.03, 0.3, '#c9a227', -11.8, 0.9, 7.5, 8, 0.006); sphere(0.07, '#ffd25a', -11.8, 1.26, 7.5, 0.006);
  poster([th.bossWall || 'MC Gala 2009', '🎤 Micro Vàng'], { w: 768, h: 384, bg: '#2b2b2b', fg: C.yellow, sizes: [56, 44], border: '#c9a227' }, -12.9, 1.7, 8.0, PI / 2, 1.8, 0.9);
  box(0.5, 0.8, 0.45, '#1d1d1f', -12.5, 0, 6.5, true); cyl(0.14, 0.14, 0.02, '#555', -12.5, 0.5, 6.27, 16, 0.006).rotation.x = PI / 2;
  sign(signs.boss || 'PHÒNG CHỊ KIỀU', '#ffc8dd', -7.9, 2.55, 7.8, PI / 2, 1.8);
  // Cô Bích's accounting corner + deposit safe (SE)
  K.desk(9.5, 7.6, -1, { plate: 'Bích · Kế toán', screen: [['Hóa đơn đỏ', 'thiếu 7 tờ'], '#c0392b'], chair: '#e3d9ff', top: '#fffaf2', leg: C.navy });
  box(0.7, 0.9, 0.6, '#5f6b7a', 11.8, 0, 8.6, true); cyl(0.11, 0.11, 0.04, '#ffd25a', 11.8, 0.5, 8.29, 12, 0.008).rotation.x = PI / 2;
  poster(['TIỀN CỌC'], { w: 256, h: 96, bg: C.yellow, sizes: [44] }, 11.8, 0.75, 8.28, 0, 0.5, 0.19);
  interact('safe', L('safe', 'Nhìn két tiền cọc'), 11.8, 0.8, 8.0);
  sign(signs.finance || 'KẾ TOÁN', '#e3d9ff', 9.5, 2.5, 9.88, PI, 2.8);
  for (let k = 0; k < 3; k++) box(0.45, 0.3, 0.35, '#e8d5b0', 11.9, k * 0.3, 6.4, k === 0, 0, 0.01);
  // Anh Duy's producer desk + walkie-talkie charging rack, by the opening
  K.desk(6.0, 2.0, -1, { plate: 'Duy · Producer', screen: [['Run-sheet', 'Standby…'], C.teal], chair: C.teal, top: '#fffaf2', leg: C.navy });
  box(0.9, 0.3, 0.3, '#2b2b2b', 7.2, 0.78, 2.0, false, 0, 0.01);
  for (let i = 0; i < 3; i++) { box(0.08, 0.26, 0.06, '#1d1d1f', 6.9 + i * 0.3, 1.08, 2.0, false, 0, 0.005); sphere(0.02, glow(i === 2 ? '#ff4d4d' : '#39ff88'), 6.9 + i * 0.3, 1.38, 2.03, 0); }

  // ================= WAREHOUSE (north) =================
  // shelving along the walls
  const rack = (x, z, w, d, ry = 0) => {
    for (let s = 0; s < 4; s++) box(w, 0.05, d, '#f2a65a', x, 0.4 + s * 1.1, z, false, ry, 0.01);
    for (const dx of [-w / 2, w / 2]) for (const dz of [-d / 2, d / 2]) box(0.06, 4.0, 0.06, '#24304a', x + dx, 0, z + dz, false, 0, 0.008);
    collideRect(x - w / 2, x + w / 2, z - d / 2, z + d / 2);
    for (let s = 0; s < 3; s++) for (let i = 0; i < Math.floor(w / 0.6); i++) box(0.5, 0.6, d * 0.8, ['#e8c39a', '#d9a273', '#c9d1dc', '#ffd3b8'][(i + s) % 4], x - w / 2 + 0.35 + i * 0.6, 0.45 + s * 1.1, z, false, 0, 0.01);
  };
  rack(-12.4, -5.5, 1.0, 7.0); // west wall (rotated in effect: long along z)
  rack(-9.0, -9.4, 5.0, 0.9);
  rack(8.0, -9.4, 6.0, 0.9);
  poster(['ÁO MƯA 500 CÁI', 'PLAN B'], { w: 512, h: 256, bg: C.yellow, sizes: [50, 40] }, -9.0, 4.6, -9.88, 0, 1.8, 0.9);
  // road cases + truss + LED panels
  for (let i = 0; i < 6; i++) box(1.0, 0.7, 0.7, '#1d1d1f', -9.6 + (i % 3) * 1.05, Math.floor(i / 3) * 0.7, -4.5, i < 3, 0, 0.015);
  for (let i = 0; i < 3; i++) box(1.0, 0.04, 0.7, '#c0c6cf', -9.6 + i * 1.05, 0.68, -4.5, false, 0, 0);
  poster(['ÂM THANH', 'FRAGILE'], { w: 256, h: 128, bg: '#ffffff', sizes: [40, 28] }, -9.6, 0.4, -4.14, 0, 0.7, 0.35);
  const truss = (x, z, len) => {
    for (const dy of [0.15, 0.55]) for (const dz of [-0.2, 0.2]) { const t = cyl(0.03, 0.03, len, '#d0d4da', x, 0, z + dz, 6, 0.006); t.rotation.z = PI / 2; t.position.y = dy; }
    for (let i = 0; i <= len / 0.4; i++) box(0.03, 0.4, 0.4, '#d0d4da', x - len / 2 + i * 0.4, 0.15, z, false, 0, 0.004);
    collideRect(x - len / 2, x + len / 2, z - 0.25, z + 0.25);
  };
  truss(-4.0, -7.6, 4.0); truss(-4.0, -8.3, 4.0);
  for (let i = 0; i < 4; i++) box(0.5, 0.5, 0.08, '#2b2f3a', 5.2 + (i % 2) * 0.55, 0.4 + Math.floor(i / 2) * 0.55, -6.0, i === 0, 0, 0.01);
  // inflatable arch "cổng hơi"
  const arch = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.35, 12, 40, PI), K.T('#ff5a5a')); arch.position.set(-1.0, 0, -9.0); K.root.add(arch);
  poster(['CỔNG HƠI', 'GALA 25 NĂM'], { w: 512, h: 192, bg: C.yellow, sizes: [50, 36] }, -1.0, 2.25, -8.62, 0, 1.6, 0.6);
  collideCircle(-3.2, -9.0, 0.4); collideCircle(1.2, -9.0, 0.4);
  // banner rolls + folding chair stacks + tents
  for (let i = 0; i < 5; i++) { const r = cyl(0.12, 0.12, 2.0, [C.orange, C.teal, C.pink, C.yellow, '#ffffff'][i], 11.6, 0, -1.2 - i * 0.3, 10, 0.008); r.rotation.x = PI / 2; r.position.y = 0.12 + (i % 2) * 0.24; }
  collideRect(11.0, 12.2, -2.6, -0.2);
  for (let s = 0; s < 2; s++) for (let k = 0; k < 8; k++) box(0.45, 0.05, 0.5, '#e74c3c', 10.0 + s * 0.6, 0.05 + k * 0.07, -8.3, k === 0, 0, 0.004);
  K.plasticChair(9.4, -7.4, 0.4, '#e74c3c');
  interact('redchair', L('redchair', 'Nhìn chồng ghế nhựa đỏ'), 9.4, 0.6, -7.4);
  const tent = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.2, 4), K.T('#3fa37a')); tent.position.set(-10.2, 0.6, -7.6); tent.rotation.y = PI / 4; K.root.add(tent); collideCircle(-10.2, -7.6, 0.75);
  // AV rack (Anh Quân)
  box(0.8, 1.9, 0.7, '#2a2f3a', 7.9, 0, -3.1, true);
  const leds = [];
  for (let i = 0; i < 8; i++) leds.push(box(0.05, 0.03, 0.01, glow(i % 2 ? '#39ff88' : '#4fd1ff'), 7.53, 0.6 + i * 0.15, -3.3 + (i % 3) * 0.15, false, 0, 0));
  K.animated.push((t) => leds.forEach((l, i) => { l.visible = Math.sin(t * (2 + i) + i) > -0.2; }));
  poster(['HDMI', 'dây nào cũng "chắc chắn là dây này"'], { w: 512, h: 256, bg: '#e6ecff', sizes: [56, 26] }, 7.48, 2.3, -3.1, -PI / 2, 1.0, 0.5);
  // briefing board + circle
  const scrum = th.scrum || { cols: ['TODO', 'DOING', 'DONE'], notes: [[], [], []] };
  const kb = canvasTex(1024, 560, (g, w, h) => {
    g.fillStyle = '#ffffff'; roundRect(g, 4, 4, w - 8, h - 8, 26); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    const nc = ['#ffc8dd', '#ffe9a0', '#c9b6ff', '#b8f0d8', '#bfe3ff'];
    scrum.cols.forEach((t, i) => {
      const x = 24 + i * 330;
      g.fillStyle = ['#ffd3b8', '#ffe9a0', '#b8f0d8'][i]; roundRect(g, x, 24, 310, 66, 14); g.fill(); g.lineWidth = 6; g.stroke();
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
  box(0.08, 1.9, 0.08, C.navy, 0.5, 0, -6.6, false, 0, 0.012); box(0.08, 1.9, 0.08, C.navy, 3.5, 0, -6.6, false, 0, 0.012);
  box(3.05, 1.7, 0.05, '#ffffff', 2.0, 0.7, -6.62, false, 0, 0.02);
  plane(3.0, 1.64, basic(kb), 2.0, 1.55, -6.58, 0);
  collideRect(0.4, 3.6, -6.75, -6.45);
  sign(signs.standup || 'BRIEFING 8:30', C.yellow, 2.0, 2.65, -6.57, 0, 2.6);
  const ringM = new THREE.Mesh(new THREE.RingGeometry(1.9, 2.0, 48), new THREE.MeshBasicMaterial({ color: C.orange }));
  ringM.rotation.x = -PI / 2; ringM.scale.set(1.35, 0.85, 1); ringM.position.set(2.0, 0.009, -4.0); K.root.add(ringM);
  // giant event calendar on the partition + round standing table (meeting) + camp beds (nap room)
  const cal = textTexture(th.whiteboard || ['LỊCH SỰ KIỆN'], { w: 1024, h: 640, bg: '#ffffff', fg: C.navy, sizes: [70, 48, 48, 48, 44], weights: [900, 800, 800, 800, 900], align: 'left', pad: 50 });
  box(4.2, 2.6, 0.06, '#ffffff', -7.0, 0.7, -0.12, false, 0, 0.02);
  plane(4.1, 2.5, basic(cal), -7.0, 2.0, -0.16, PI);
  interact('okr', L('okr', 'Đọc lịch sự kiện'), -7.0, 1.6, -0.6);
  cyl(0.6, 0.6, 0.05, '#fffaf2', -7.0, 1.05, -2.1, 28, 0.015); cyl(0.06, 0.08, 1.05, C.navy, -7.0, 0, -2.1, 10, 0.01);
  collideCircle(-7.0, -2.1, 0.55);
  box(0.36, 0.04, 0.26, '#ffffff', -7.1, 1.1, -2.1, false, 0.3, 0.006);
  cyl(0.2, 0.2, 0.75, C.orange, -7.0, 0, -3.05, 14, 0.012);
  interact('interview', L('interview', 'Đứng vào bàn họp tròn'), -7.0, 1.0, -3.0);
  sign(signs.meeting || 'PHÒNG HỌP', '#ffc8dd', -7.0, 3.5, -0.18, PI, 3.0);
  for (let i = 0; i < 2; i++) { box(1.9, 0.35, 0.7, '#3fa37a', -11.6, 0, -1.2 - i * 0.9, true, 0, 0.012); box(0.5, 0.12, 0.5, '#ffffff', -12.2, 0.35, -1.2 - i * 0.9, false, 0, 0.008); }
  poster(['GIƯỜNG XẾP', 'ngủ trưa 20 phút', '(đặt báo thức!)'], { w: 512, h: 288, bg: '#d6f5e8', sizes: [44, 32, 28] }, -12.9, 1.6, -1.6, PI / 2, 1.2, 0.68);
  // pantry in the warehouse: water + fridge + leftover gala food
  box(0.4, 0.9, 0.4, '#ffffff', 12.3, 0, -3.6, true); cyl(0.17, 0.17, 0.45, new THREE.MeshToonMaterial({ color: '#bfe3ff', transparent: true, opacity: 0.8 }), 12.3, 0.9, -3.6);
  box(0.8, 1.9, 0.75, '#e8f6ff', 12.4, 0, -5.0, true);
  box(2.6, 0.75, 1.0, '#fffaf2', 10.0, 0, -5.5, true);
  for (let i = 0; i < 4; i++) { box(0.5, 0.06, 0.35, '#c0c6cf', 9.1 + i * 0.6, 0.75, -5.5, false, 0, 0.006); sphere(0.1, ['#ff9f1c', '#e74c3c', '#2ecc71', '#f1c40f'][i], 9.1 + i * 0.6, 0.86, -5.5, 0.006); }
  interact('coffee', L('coffee', 'Pantry: ăn uống, cà phê'), 11.9, 1.0, -3.6);
  sign(signs.pantry || 'PANTRY', '#ffe9a0', 12.88, 2.6, -4.5, -PI / 2, 2.8);
  poster(th.board || ['YEAR-END'], { w: 768, h: 420, bg: '#ffd3b8', sizes: [52, 36, 36] }, 12.88, 1.5, -7.5, -PI / 2, 1.8, 1.0);

  K.lights({ sky: '#fff6e8', ground: '#e9dcc8', hemi: 1.6, amb: 0.5, sun: 1.0 });

  return K.result({
    spots: S,
    bounds: { minX: -12.7, maxX: 12.7, minZ: -9.7, maxZ: 9.75 },
    playerStart: [0, 8.8, 0],
    meetingSeat: [-7.0, -3.05, PI],
    catPath: [[0, 6.5], [4.5, 5.8], [5.0, 1.0], [0, -1.5], [-4.5, -4.0], [3.0, -1.6], [-1.0, 1.2], [-5.0, 6.2]],
  });
}
