// Khu phố 7, phường Tâm Mỹ: the walkable street (first person). Layout follows docs/khupho/DESIGN.md 2.2.
//   North St "Đường Trường Học" (z = −30): school, playground, old apartment block Lô C (HR), Cao ốc Tâm Mỹ, Agency loft.
//   Main St "Đường Tâm Mỹ" (z = 0): north side Ba & Má, trạm y tế, trà sữa, tiện lợi, net; south side công an,
//     VP khu phố, điện lực, cà phê cóc (opposite trà sữa), photo, tiệm tóc.
//   South St "Đường Chợ" (z = +30): north side hẻm 42 houses, dãy trọ Bình An (your room), cơm tấm, quán nhậu,
//     karaoke house; south side Chợ Tâm Mỹ, đầu mối Thuận Phát, the Event warehouse.
//   N-S: west road x = −50, east road x = +50, hẻm 42 (x = −27) and hẻm 7 (x = +9) through the south block,
//     and the school-gate lane (x = −9) through the north block.
// Each enterable place has a door interactable whose id is the place id (data/places.js ids).
// Coordinates: x east, z south. Building fronts face the street they stand on.
import { createKit, FLOORS } from '../../maps/kit3d.js';

const PI = Math.PI;

// [placeId, x1, x2, zFront, facing ('s' = front faces +z/south, 'n' = faces −z/north), depth, height, colour, sign, signBg, signFg]
const LOTS = [
  // north block, facing the main street (front at z = −5)
  ['bama', -47, -29, -5, 's', 10, 8, '#f6d7a7', 'BA & MÁ · KHÔ GÀ', '#c0392b', '#fff3d6'],
  ['tramyte', -27, -13, -5, 's', 10, 7.5, '#e9f4f1', 'TRẠM Y TẾ PHƯỜNG TÂM MỸ', '#ffffff', '#1c7c54'],
  ['trasua', -6, 6, -5, 's', 11, 9, '#ffd8e4', 'TRÀ SỮA FULL TOPPING', '#ff7aa8', '#ffffff'],
  ['tienloi', 8, 20, -5, 's', 10, 7, '#e8f0ff', 'LUÔN MỞ 24H', '#2e6be6', '#ffffff'],
  ['net', 22, 34, -5, 's', 10, 7.5, '#2b2f3a', 'NET KHÔNG LAG', '#141821', '#39ff88'],
  ['house_n1', 36, 47, -5, 's', 10, 10, '#ffe7b3', '', '', ''],
  // north row, facing the school street (front at z = −34)
  ['truong_th', -47, -22, -34, 's', 12, 9, '#ffe08a', 'TRƯỜNG TIỂU HỌC & THCS TÂM MỸ', '#ffffff', '#b8401f'],
  ['congvien', -20, -6, -34, 's', 12, 0, '', 'SÂN CHƠI KHU PHỐ 7', '#3e9b57', '#ffffff'],
  ['chungcu', -4, 10, -34, 's', 12, 15, '#d9d2c3', 'CHUNG CƯ LÔ C', '#7a6a55', '#ffffff'],
  ['toanha', 12, 28, -34, 's', 14, 30, '#9fb8cf', 'CAO ỐC TÂM MỸ', '#1f3a5f', '#ffffff'],
  ['agency', 30, 42, -34, 's', 12, 16, '#f3e4d6', 'TREND TRỄ · TẦNG THƯỢNG', '#ff5d8f', '#ffffff'],
  ['house_n2', 44, 47, -34, 's', 12, 9, '#cfe8d8', '', '', ''],
  // south block, facing the main street (front at z = +5)
  ['congan', -47, -39, 5, 'n', 10, 9, '#f2e6c8', 'CÔNG AN PHƯỜNG TÂM MỸ', '#b8261f', '#ffd25a'],
  ['khupho', -38, -29.5, 5, 'n', 10, 7, '#f7efe0', 'VĂN PHÒNG KHU PHỐ 7', '#ffffff', '#b8261f'],
  ['dienluc', -25, -17, 5, 'n', 10, 7.5, '#e7eef6', 'ĐIỆN LỰC · PHÒNG GIAO DỊCH', '#0b5fa5', '#ffffff'],
  ['house_s1', -16, -7, 5, 'n', 10, 10, '#f5d0c5', '', '', ''],
  ['caphe', -6, 6, 5, 'n', 10, 7, '#e9d3b4', 'CÀ PHÊ CÓC BẢY GHẾ', '#5d4037', '#ffe9a0'],
  ['photo', 11, 22, 5, 'n', 10, 8, '#fff3c4', 'PHOTO THẦN TỐC', '#1d1d1f', '#ffd25a'],
  ['cattoc', 23, 34, 5, 'n', 10, 8.5, '#ffe3ec', 'TIỆM TÓC ĐẸP MỖI NGÀY', '#c2255c', '#ffffff'],
  ['house_s2', 35, 47, 5, 'n', 10, 11, '#d6ecff', '', '', ''],
  // south block, facing the market street (front at z = +26)
  ['hem', -47, -29, 26, 's', 10, 9, '#f0dcc8', 'NHÀ DÂN HẺM 42', '#ffffff', '#5d4037'],
  ['phongtro', -25, -11, 26, 's', 10, 7, '#e3ecd5', 'DÃY TRỌ BÌNH AN', '#3e7b3a', '#ffffff'],
  ['house_s3', -9, 7, 26, 's', 10, 10, '#ffd3b8', '', '', ''],
  ['comtam', 11, 21, 26, 's', 10, 7, '#fff1e0', 'CƠM TẤM CÔ LÀI', '#e67700', '#ffffff'],
  ['quannhau', 22, 34, 26, 's', 10, 6.5, '#ffe9a0', 'QUÁN NHẬU MỘT HAI BA DÔ', '#2b8a3e', '#ffffff'],
  ['karaoke', 35, 47, 26, 's', 10, 10, '#e3d9ff', 'NHÀ ÔNG THANH', '#ffffff', '#5f3dc4'],
  // market row, facing north (front at z = +34)
  ['cho', -47, 10, 34, 'n', 12, 7, '#f2e2c4', 'CHỢ TÂM MỸ', '#b8261f', '#ffd25a'],
  ['daumoi', 12, 28, 34, 'n', 12, 8, '#cfd4da', 'ĐẦU MỐI SỈ THUẬN PHÁT', '#1f3a5f', '#ffd25a'],
  ['event', 30, 47, 34, 'n', 12, 8.5, '#c7ccd3', 'ĐI ĐÂU CŨNG ĐƯỢC · KHO', '#f2a65a', '#ffffff'],
];

export const STREET_SPAWN = [-18, 27.6, -PI / 2]; // in front of the boarding house door, looking east along Đường Chợ
export const STREET_BOUNDS = { minX: -52.5, maxX: 52.5, minZ: -36.5, maxZ: 36.5 };
export const ROOM_DOOR = [-18, 27.6];

export function buildStreet(scene) {
  const K = createKit(scene);
  const { THREE, box, cyl, sphere, plane, basic, glow, collideRect, floorZone, sign, poster, interact, canvasTex, textTexture, roundRect, INK } = K;
  const doors = {}; // placeId → { x, z, ry }

  // ---------- ground: asphalt, sidewalks, markings ----------
  const asphalt = (g, w, h) => { g.fillStyle = '#5b6068'; g.fillRect(0, 0, w, h); let s = 9; for (let i = 0; i < 500; i++) { s = (s * 16807) % 2147483647; g.fillStyle = i % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'; g.fillRect(s % w, (s >> 9) % h, 3, 3); } };
  floorZone(-56, -40, 56, 40, '#9aa29b', 1, 0.001); // dirt/grass under everything
  const road = (x1, z1, x2, z2) => floorZone(x1, z1, x2, z2, asphalt, 4, 0.003);
  road(-53.5, -3.5, 53.5, 3.5); road(-53.5, -32.5, 53.5, -27.5); road(-53.5, 27.5, 53.5, 32.5);
  road(-53.5, -32.5, -46.5, 32.5); road(46.5, -32.5, 53.5, 32.5);
  road(-28.5, 3.5, -25.5, 27.5); road(7.5, 3.5, 10.5, 27.5); road(-10.5, -27.5, -7.5, -3.5);
  const walk = (x1, z1, x2, z2) => floorZone(x1, z1, x2, z2, FLOORS.tiles('#d9d3c7', 'rgba(0,0,0,0.12)'), 0.8, 0.004);
  walk(-46.5, -5, 46.5, -3.5); walk(-46.5, 3.5, 46.5, 5); walk(-46.5, -34, 46.5, -32.5); walk(-46.5, -27.5, 46.5, -26);
  walk(-46.5, 26, 46.5, 27.5); walk(-46.5, 32.5, 46.5, 34);
  for (let x = -50; x <= 50; x += 4) { floorZone(x - 1, -0.06, x + 1, 0.06, '#f2f2f2', 1, 0.006); floorZone(x - 0.8, 29.95, x + 0.8, 30.05, '#f2f2f2', 1, 0.006); floorZone(x - 0.8, -30.05, x + 0.8, -29.95, '#f2f2f2', 1, 0.006); }
  for (const cx of [0, -27]) for (let i = 0; i < 6; i++) floorZone(cx - 2.4 + i * 0.9, -3.4, cx - 2.0 + i * 0.9, 3.4, '#f2f2f2', 1, 0.007); // zebra crossings
  // street-name signs
  const streetSign = (text, x, z, ry) => { cyl(0.04, 0.04, 2.6, '#7d8590', x, 0, z, 6, 0.008); poster([text], { w: 512, h: 112, bg: '#1f5e3a', fg: '#ffffff', sizes: [44], border: '#ffffff' }, x, 2.75, z, ry, 1.6, 0.35); };
  streetSign('Đường Tâm Mỹ', -46, -4.4, 0); streetSign('Đường Tâm Mỹ', 46, 4.4, PI);
  streetSign('Đường Trường Học', -12, -26.6, 0); streetSign('Đường Chợ', -30, 26.6, PI);
  streetSign('Hẻm 42', -29.2, 5.4, PI / 2); streetSign('Hẻm 7', 11.2, 5.4, -PI / 2);

  // ---------- buildings ----------
  const glassWin = new THREE.MeshBasicMaterial({ color: '#9fc6e6' });
  const darkWin = new THREE.MeshBasicMaterial({ color: '#3b4252' });
  const nightWins = [];
  function building([id, x1, x2, zf, facing, depth, h, col, label, sbg, sfg]) {
    const w = x2 - x1, cx = (x1 + x2) / 2, dir = facing === 's' ? 1 : -1; // dir: +1 front faces +z
    const zBack = zf - dir * depth, cz = (zf + zBack) / 2;
    if (id === 'congvien') { park(x1, x2, zf, zBack); return; }
    box(w, h, depth, col, cx, 0, cz, true, 0, 0.03);
    const face = zf + dir * 0.02;
    const ry = dir > 0 ? 0 : PI;
    // ground floor: open shopfront (dark recess) or a roller shutter, then upper-floor windows and balconies
    const isHouse = id.startsWith('house') || id === 'hem' || id === 'karaoke';
    const shopW = Math.min(w - 1.2, 7);
    if (!isHouse) {
      plane(shopW, 2.6, darkWin, cx, 1.3, face + dir * 0.005, ry);
      box(shopW + 0.3, 0.12, 0.12, '#2b2b2b', cx, 2.6, face, false, 0, 0.01);
    } else {
      box(1.4, 2.3, 0.06, '#8b5a3c', cx, 0, face, false, 0, 0.012);
      box(w - 1, 0.08, 1.2, col, cx, 2.9, zf + dir * 0.6, false, 0, 0.01); // concrete ledge / small balcony
    }
    const floors = Math.max(0, Math.floor((h - 3.2) / 3));
    const tower = id === 'toanha';
    for (let f = 0; f < floors; f++) {
      const y = 3.6 + f * 3;
      if (tower) { plane(w - 0.6, 2.4, glassWin, cx, y + 1.2, face + dir * 0.01, ry); box(w - 0.4, 0.12, 0.1, '#e6ecf2', cx, y + 2.45, face, false, 0, 0.004); continue; }
      const n = Math.max(1, Math.floor(w / 3.2));
      for (let i = 0; i < n; i++) {
        const wx = x1 + (i + 0.5) * (w / n);
        const pane = plane(1.4, 1.5, glassWin.clone(), wx, y + 1.0, face + dir * 0.01, ry);
        nightWins.push(pane);
        box(1.6, 0.1, 0.25, '#ffffff', wx, y + 0.2, face + dir * 0.1, false, 0, 0.006);
        if ((i + f) % 3 === 0) box(0.6, 0.45, 0.35, '#e6e6e6', wx + 0.9, y + 1.9, face + dir * 0.2, false, 0, 0.006); // AC unit
        if ((i + f) % 4 === 1) for (let k = 0; k < 3; k++) sphere(0.18, '#3e9b57', wx - 0.4 + k * 0.4, y + 0.45, face + dir * 0.25, 0.008); // balcony plants
      }
    }
    if (h > 0 && !tower) box(w, 0.25, depth, '#f3f0ea', cx, h, cz, false, 0, 0.015); // roof slab
    if (label) {
      const sw = Math.min(w - 0.6, Math.max(4, label.length * 0.32));
      poster([label], { w: 1024, h: 180, bg: sbg, fg: sfg, sizes: [label.length > 22 ? 62 : 76], weights: [900] }, cx, 3.05, face + dir * 0.06, ry, sw, sw * 180 / 1024);
    }
    // awning over shops
    if (!isHouse && id !== 'toanha' && id !== 'truong_th' && id !== 'chungcu') {
      const aw = new THREE.Mesh(new THREE.BoxGeometry(shopW + 0.6, 0.06, 1.2), K.T(sbg && sbg !== '#ffffff' ? sbg : '#e67700'));
      aw.position.set(cx, 2.65, zf + dir * 0.6); aw.rotation.x = dir * -0.18; K.root.add(aw);
    }
    // door interactable (centre of the shopfront, on the sidewalk)
    const dz = zf + dir * 0.9;
    doors[id] = { x: cx, z: dz, ry: dir > 0 ? PI : 0 };
    if (!id.startsWith('house')) interact(id, label || id, cx, 1.1, zf + dir * 0.35);
  }
  function park(x1, x2, zf, zb) {
    floorZone(x1, Math.min(zf, zb), x2, Math.max(zf, zb), '#7fbf6a', 1, 0.005);
    const zi = (zf + zb) / 2;
    for (let x = x1; x <= x2; x += 2) box(0.06, 1.0, 0.06, '#2b2b2b', x, 0, zf, false, 0, 0.006);
    box(x2 - x1, 0.05, 0.05, '#2b2b2b', (x1 + x2) / 2, 0.95, zf, false, 0, 0.004);
    collideRect(x1, x2, zf - 0.05, zf + 0.05);
    collideRect(x1, x2, Math.min(zf, zb), Math.max(zf, zb));
    box(5, 0.1, 3, '#d4a373', (x1 + x2) / 2 + 2, 0, zi, false, 0, 0.01);
    for (const gx of [x1 + 1.5, x2 - 1.5]) { box(0.1, 2.2, 0.1, '#ffffff', gx, 0, zi - 3, false, 0, 0.006); box(0.1, 2.2, 0.1, '#ffffff', gx, 0, zi + 3, false, 0, 0.006); box(0.1, 0.1, 6, '#ffffff', gx, 2.2, zi, false, 0, 0.006); }
    for (const [tx, tz] of [[x1 + 3, zi - 3], [x2 - 4, zi + 2]]) tree(tx, tz, 1.3);
    doors.congvien = { x: (x1 + x2) / 2, z: zf + 0.9, ry: PI };
    interact('congvien', 'SÂN CHƠI KHU PHỐ 7', (x1 + x2) / 2, 1.0, zf + 0.35);
  }
  function tree(x, z, s = 1) {
    cyl(0.18 * s, 0.25 * s, 2.4 * s, '#7a5230', x, 0, z, 10, 0.012);
    for (let i = 0; i < 6; i++) sphere(0.9 * s, ['#3e9b57', '#57b36b', '#2f7d3a'][i % 3], x + Math.cos(i) * 0.7 * s, (2.6 + (i % 3) * 0.5) * s, z + Math.sin(i) * 0.7 * s, 0.015);
    K.collideCircle(x, z, 0.3 * s);
  }
  LOTS.forEach(building);

  // tall-tower details: lobby glass doors + the company floor list
  poster(['CAO ỐC TÂM MỸ', 'T3-5 Cân Đối & Cộng Sự', 'T7 Nợ Kỹ Thuật Labs', 'T12 T&M Partners'], { w: 512, h: 400, bg: '#1f3a5f', fg: '#ffffff', sizes: [44, 30, 30, 30] }, 26.5, 1.6, -33.9, 0, 1.6, 1.25);
  // school gate + yard flag
  box(6, 0.4, 0.3, '#b8401f', -34.5, 2.6, -33.6, false, 0, 0.012);
  cyl(0.05, 0.05, 7, '#cccccc', -40, 0, -36, 6, 0.006); plane(1.6, 1.0, new THREE.MeshBasicMaterial({ color: '#da251d', side: THREE.DoubleSide }), -39.2, 6.4, -36, 0);
  // Ba & Má: drying racks in the back yard, seen from the school street
  for (let i = 0; i < 3; i++) {
    const x = -44 + i * 5;
    for (let k = 0; k < 4; k++) box(3.6, 0.04, 1.2, '#d9dee6', x, 0.6 + k * 0.45, -22, false, 0, 0.006);
    for (let k = 0; k < 4; k++) for (let s = 0; s < 10; s++) box(0.22, 0.03, 0.9, ['#a0522d', '#8b3a1a', '#c0703a'][(s + k) % 3], x - 1.6 + s * 0.35, 0.64 + k * 0.45, -22, false, 0, 0);
    collideRect(x - 1.8, x + 1.8, -22.6, -21.4);
  }
  for (let x = -47; x <= -29; x += 1.5) box(0.05, 1.3, 0.05, '#7d8590', x, 0, -26.2, false, 0, 0.004);
  box(18, 0.05, 0.05, '#7d8590', -38, 1.25, -26.2, false, 0, 0.004);
  collideRect(-47, -29, -26.3, -15);
  poster(['GIÀN PHƠI', 'đừng ăn vụng'], { w: 512, h: 220, bg: '#fff1b8', fg: '#8b1a1a', sizes: [56, 40] }, -38, 1.7, -26.15, PI, 1.6, 0.7);
  // market hall: open front with stalls
  for (let i = 0; i < 9; i++) {
    const x = -44 + i * 6;
    box(4.6, 0.85, 1.2, ['#3e9b57', '#e67700', '#c0392b', '#f2c94c', '#2e86de'][i % 5], x, 0, 35, false, 0, 0.012);
    for (let k = 0; k < 6; k++) sphere(0.18, ['#57b36b', '#ff9f1c', '#e74c3c', '#ffe08a'][(i + k) % 4], x - 1.8 + k * 0.7, 1.0, 35, 0.006);
  }

  // ---------- street life: poles + wires, lamps, trees, scooters, carts ----------
  const lamps = [];
  for (const z of [-4.2, 4.2]) for (let x = -44; x <= 44; x += 11) {
    cyl(0.12, 0.14, 7, '#8a8f98', x, 0, z, 8, 0.01);
    box(0.9, 0.08, 0.08, '#8a8f98', x, 5.6, z, false, 0, 0.006);
    for (let k = 0; k < 6; k++) box(0.25, 0.25, 0.25, '#555b66', x + (k % 2 ? 0.25 : -0.25), 4.2 + Math.floor(k / 2) * 0.3, z, false, k * 0.4, 0.004); // the famous cable knots
    const lamp = sphere(0.22, glow('#fff2c4'), x + (z < 0 ? 0 : 0), 7.1, z + (z < 0 ? 1 : -1), 0);
    lamps.push(lamp);
    K.collideCircle(x, z, 0.16);
  }
  const wireM = new THREE.LineBasicMaterial({ color: '#2b2b2b' });
  for (const z of [-4.2, 4.2]) for (let k = 0; k < 4; k++) {
    const pts = [];
    for (let x = -44; x <= 44; x += 1) { const t = ((x + 44) % 11) / 11; pts.push(new THREE.Vector3(x, 5.2 - k * 0.18 - Math.sin(t * PI) * 0.5, z + (k - 1.5) * 0.08)); }
    K.root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireM));
  }
  for (const [x, z] of [[-40, -27], [-14, -27], [16, -27], [38, -27], [-36, 27], [3, 27], [40, 33.5], [-20, 33.5], [-44, 4.6], [44, -4.6]]) tree(x, z, 1.1);
  const scooter = (x, z, ry, col) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; K.root.add(g);
    const add = (geo, m, px, py, pz, rx = 0, rz = 0) => { const mm = new THREE.Mesh(geo, K.T(m)); mm.position.set(px, py, pz); mm.rotation.set(rx, 0, rz); g.add(mm); return mm; };
    add(new THREE.BoxGeometry(0.36, 0.3, 1.2), col, 0, 0.45, 0);
    add(new THREE.BoxGeometry(0.34, 0.14, 0.55), '#1d1d1f', 0, 0.68, -0.15);
    add(new THREE.BoxGeometry(0.1, 0.6, 0.14), col, 0, 0.65, 0.5);
    for (const wz of [-0.45, 0.48]) add(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 14), '#222222', 0, 0.22, wz, 0, PI / 2);
    return g;
  };
  const parked = [[-30, -4.6, 0.2], [-24, -4.5, -0.1], [-3, -4.4, 0.15], [2.5, -4.6, -0.2], [12, -4.5, 0.1], [26, -4.4, 0.2], [-8, 4.6, 0.1], [14, 4.5, -0.2], [29, 4.4, 0.1], [-16, 26.8, 0.2], [24, 26.8, -0.1], [-40, 33.2, 0.1], [-10, 33.2, -0.2]];
  parked.forEach(([x, z, r], i) => { scooter(x, z, PI / 2 + r, ['#e74c3c', '#3498db', '#2c3e50', '#f1c40f', '#ffffff'][i % 5]); K.collideCircle(x, z, 0.5); });
  // moving traffic on the main street (visual only, loops; players walk through like ghosts would be odd, so lanes keep to the middle)
  const traffic = [];
  for (let i = 0; i < 6; i++) {
    const lane = i % 2 ? 1.6 : -1.6, dir = i % 2 ? -1 : 1;
    traffic.push({ g: scooter(-50 + i * 17, lane, dir > 0 ? PI / 2 : -PI / 2, ['#e74c3c', '#3498db', '#2c3e50', '#16a085', '#f39c12', '#8e44ad'][i]), dir, speed: 5 + (i % 3) });
  }
  // xe bánh mì at the mouth of hẻm 42 + bến xe ôm
  box(1.6, 0.9, 0.8, '#ffffff', -29.6, 0.35, 28.6, true, 0, 0.012);
  box(1.6, 0.7, 0.8, new THREE.MeshBasicMaterial({ color: '#e8f6ff', transparent: true, opacity: 0.5 }), -29.6, 1.25, 28.6, false, 0, 0.01);
  for (const dx of [-0.6, 0.6]) { const wl = cyl(0.3, 0.3, 0.08, '#333333', -29.6 + dx, 0, 29.05, 14, 0.006); wl.rotation.x = PI / 2; wl.position.y = 0.3; }
  poster(['BÁNH MÌ', 'Cô Bánh Mì · 25k'], { w: 512, h: 200, bg: '#ffd25a', fg: '#7b1a12', sizes: [60, 34] }, -29.6, 2.15, 28.99, 0, 1.4, 0.55);
  doors.banhmi = { x: -29.6, z: 29.4, ry: PI };
  interact('banhmi', 'XE BÁNH MÌ ĐẦU HẺM 42', -29.6, 1.1, 29.1);
  scooter(-24, 28.6, 0.3, '#2e86de'); scooter(-22.6, 28.8, -0.2, '#e74c3c');
  poster(['XE ÔM', 'Chú Lương · ông Quế (xe đạp)'], { w: 512, h: 200, bg: '#1f5e3a', fg: '#ffffff', sizes: [56, 30] }, -23.3, 2.4, 27.9, 0, 1.4, 0.55);
  cyl(0.04, 0.04, 2.2, '#7d8590', -23.3, 0, 27.9, 6, 0.006);
  doors.xeom = { x: -23.3, z: 28.9, ry: PI };
  interact('xeom', 'BẾN XE ÔM ĐẦU HẺM 42', -23.3, 1.1, 28.6);
  K.collideCircle(-23.3, 28.6, 1.2);
  // xe ba gác of Chú Bảy in front of Ba & Má
  const bagac = new THREE.Group(); bagac.position.set(-34, 0, -6.6); K.root.add(bagac);
  const bg = (w, h, d, c, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), K.T(c)); m.position.set(x, y + h / 2, z); bagac.add(m); };
  bg(2.0, 0.08, 1.3, '#2e86de', 0.5, 0.55, 0); bg(2.0, 0.5, 0.06, '#2e86de', 0.5, 0.6, 0.65); bg(2.0, 0.5, 0.06, '#2e86de', 0.5, 0.6, -0.65); bg(0.06, 0.5, 1.3, '#2e86de', 1.5, 0.6, 0);
  for (let i = 0; i < 4; i++) bg(0.5, 0.35, 0.45, i % 2 ? '#e8c39a' : '#d9a273', 0.1 + (i % 2) * 0.6, 0.63, -0.3 + Math.floor(i / 2) * 0.55);
  bg(0.9, 0.3, 0.3, '#1d1d1f', -0.8, 0.5, 0);
  collideRect(-35.3, -32.5, -7.4, -5.8);
  doors.bagac = { x: -34, z: -7.8, ry: 0 };
  interact('bagac', 'XE BA GÁC CỦA CHÚ BẢY', -34, 1.0, -7.4);
  // cà phê cóc: plastic stools on the sidewalk opposite trà sữa
  for (let i = 0; i < 7; i++) { cyl(0.18, 0.15, 0.32, ['#e74c3c', '#3498db', '#2ecc71'][i % 3], -4.8 + i * 1.5, 0, 4.2, 10, 0.008); }
  // loa phường on a pole by the khu phố office
  cyl(0.08, 0.08, 6.5, '#8a8f98', -33, 0, 4.4, 8, 0.008);
  for (const ry of [0.6, -0.6]) { const l = cyl(0.12, 0.35, 0.6, '#d9d9d9', -33, 5.6, 4.4, 14, 0.008); l.rotation.z = PI / 2 + ry; }

  // ---------- outer limits ----------
  collideRect(-56, -53.5, -40, 40); collideRect(53.5, 56, -40, 40);
  collideRect(-56, 56, -40, -46); collideRect(-56, 56, 46, 48);
  // the gaps between lots are private yards: block them so you walk on streets, hẻm and the school lane
  for (const [x1, x2, z1, z2] of [[-29, -27, -15, -5], [-13, -10.5, -15, -5], [-7.5, -6, -15, -5], [6, 8, -15, -5], [20, 22, -15, -5], [34, 36, -15, -5],
    [-22, -20, -46, -34], [-6, -4, -46, -34], [10, 12, -46, -34], [28, 30, -46, -34], [42, 44, -46, -34],
    [-39, -38, 5, 15], [-29.5, -28.5, 5, 26], [-17, -16, 5, 15], [-7, -6, 5, 15], [6, 7.5, 5, 26], [10.5, 11, 5, 26], [22, 23, 5, 15], [34, 35, 5, 15],
    [-29, -25.5, 16, 26], [-11, -9, 16, 26], [7, 7.5, 16, 26], [21, 22, 16, 26], [34, 35, 16, 26], [-25.5, -25, 5, 26],
    [10, 12, 34, 46], [28, 30, 34, 46], [-29, -10.5, -26, -15], [-7.5, 47, -26, -15],
    [-47, -28.5, 15, 16], [-25.5, 7.5, 15, 16], [10.5, 47, 15, 16]]) collideRect(x1, x2, z1, z2);

  // ---------- sky + lights driven by the game clock ----------
  const sky = new THREE.Mesh(new THREE.SphereGeometry(150, 24, 12), new THREE.MeshBasicMaterial({ color: '#bfe3ff', side: THREE.BackSide, depthWrite: false }));
  K.root.add(sky);
  const hemi = new THREE.HemisphereLight('#ffffff', '#c9b79c', 1.5); K.root.add(hemi);
  const amb = new THREE.AmbientLight('#ffffff', 0.45); K.root.add(amb);
  const sun = new THREE.DirectionalLight('#fff6ea', 1.0); sun.position.set(-20, 40, 10); K.root.add(sun);
  const SKY = [[0, '#0d1530'], [300, '#1b2a55'], [360, '#ffb38a'], [420, '#bfe3ff'], [1020, '#bfe3ff'], [1090, '#ff9a6b'], [1140, '#2b2f5a'], [1440, '#0d1530']];
  const c1 = new THREE.Color(), c2 = new THREE.Color();
  function setTime(min) {
    let i = 0; while (i < SKY.length - 2 && min >= SKY[i + 1][0]) i++;
    const [m0, a] = SKY[i], [m1, b] = SKY[i + 1];
    const t = Math.max(0, Math.min(1, (min - m0) / Math.max(1, m1 - m0)));
    sky.material.color.copy(c1.set(a)).lerp(c2.set(b), t);
    const day = min >= 360 && min <= 1110 ? 1 : min > 300 && min < 360 ? (min - 300) / 60 : min > 1110 && min < 1170 ? 1 - (min - 1110) / 60 : 0;
    hemi.intensity = 0.45 + day * 1.1; amb.intensity = 0.25 + day * 0.25; sun.intensity = day * 1.0;
    const night = day < 0.4;
    lamps.forEach((l) => { l.material.color.set(night ? '#ffe9a8' : '#d9d9d9'); });
    nightWins.forEach((w, k) => { w.material.color.set(night && (k * 7) % 5 < 3 ? '#ffd98a' : '#9fc6e6'); });
    return { day, skyColor: sky.material.color };
  }

  const res = K.result({ doors, bounds: STREET_BOUNDS, spawn: STREET_SPAWN, setTime, lots: LOTS });
  const baseUpdate = res.update;
  res.update = (t, dt = 0.016) => {
    baseUpdate(t);
    for (const c of traffic) { c.g.position.x += c.dir * c.speed * dt; if (c.g.position.x > 52) c.g.position.x = -52; if (c.g.position.x < -52) c.g.position.x = 52; }
  };
  return res;
}
