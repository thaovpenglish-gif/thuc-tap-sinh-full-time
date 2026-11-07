// Phase-1 interiors: your room at Dãy trọ Bình An, and Trà Sữa Full Topping (front of house + the bar you work at).
// Each builds into its own root far from the street; the mode shows one place at a time.
import { createKit, FLOORS } from '../../maps/kit3d.js';

const PI = Math.PI;

/** Room 5, Dãy trọ Bình An: 3.5 × 5 m, one window, a ceiling fan, a mattress on the floor. Origin = room centre. */
export function buildRoom(scene, at = [200, 0]) {
  const K = createKit(scene);
  const { box, cyl, sphere, plane, basic, floorZone, ceiling, wall, poster, interact, ceilingFan, textTexture, THREE } = K;
  const [ox, oz] = at;
  K.root.position.set(ox, 0, oz);
  const H = 3.0;
  floorZone(-1.75, -2.5, 1.75, 2.5, FLOORS.tiles('#efe6d6', 'rgba(0,0,0,0.12)'), 0.5);
  ceiling(-1.75, -2.5, 1.75, 2.5, H, '#fbf6ee');
  wall(-1.75, -2.5, 1.75, -2.5, '#e9f0e1', { h: H });
  wall(-1.75, -2.5, -1.75, 2.5, '#e9f0e1', { h: H });
  wall(1.75, -2.5, 1.75, 2.5, '#e9f0e1', { h: H });
  wall(-1.75, 2.5, 1.75, 2.5, '#e9f0e1', { h: H, gaps: [[0.3, 1.2]], doorH: 2.1 });
  box(0.9, 2.1, 0.05, '#8b5a3c', 0.75, 0, 2.5, true, 0, 0.012);
  sphere(0.04, '#ffd25a', 1.1, 1.05, 2.45, 0.004);
  interact('door', 'Ra khu phố', 0.75, 1.1, 2.3);
  // mattress + pillow + blanket
  box(1.4, 0.22, 2.0, '#ffffff', -0.95, 0, -1.3, true, 0, 0.015);
  box(1.3, 0.06, 1.4, '#c9b6ff', -0.95, 0.22, -1.0, false, 0, 0.01);
  box(0.6, 0.12, 0.35, '#fff3d6', -0.95, 0.22, -2.05, false, 0, 0.01);
  interact('bed', 'Đi ngủ (kết thúc ngày)', -0.95, 0.6, -1.3);
  // small desk, laptop, rice cooker, hot plate, water jug
  box(1.0, 0.72, 0.5, '#c98f5a', 1.2, 0, -1.6, true, 0, 0.015);
  box(0.38, 0.02, 0.26, '#dfe6ee', 1.0, 0.72, -1.6, false, 0.2, 0.006);
  cyl(0.14, 0.14, 0.22, '#ffffff', 1.45, 0.72, -1.7, 14, 0.01); sphere(0.04, '#ff5a6e', 1.45, 0.98, -1.7, 0.004);
  box(0.45, 0.12, 0.35, '#2b2b2b', 1.25, 0, 0.6, true, 0, 0.01);
  interact('cook', 'Nấu ăn (cần mua đồ ở chợ)', 1.25, 0.5, 0.6);
  interact('profile', 'Xem hồ sơ cá nhân', 1.0, 1.0, -1.6);
  // window with the neighbour's wall 1 m away (very Saigon)
  plane(1.0, 0.9, new THREE.MeshBasicMaterial({ color: '#b6c2a8' }), -1.72, 1.6, 0.6, PI / 2);
  for (let i = 0; i < 5; i++) box(0.04, 0.9, 0.04, '#7d8590', -1.7, 1.15, 0.2 + i * 0.2, false, 0, 0.004);
  // calendar + landlord notice
  poster(['THÔNG BÁO', 'Đóng tiền phòng mùng 5', 'Cổng khóa 23h', 'Cô Ba Lành'], { w: 512, h: 400, bg: '#fff8ec', fg: '#5d4037', sizes: [46, 32, 32, 30] }, 1.72, 1.6, 1.2, -PI / 2, 0.8, 0.62);
  ceilingFan(0, 0, H, '#ffffff');
  box(0.4, 1.6, 0.4, '#d9a273', -1.45, 0, 1.9, true, 0, 0.012); // wardrobe
  K.lights({ sky: '#fff6e8', ground: '#e8dcc8', hemi: 1.4, amb: 0.45, sun: 0.7 });
  return K.result({ spawn: [ox + 0.75, oz + 1.6, 0], bounds: { minX: ox - 1.5, maxX: ox + 1.5, minZ: oz - 2.25, maxZ: oz + 2.25 }, origin: at });
}

/** Trà Sữa Full Topping: 12 × 8 m. Customers' side south, the bar across the middle, stations along the back wall. */
export function buildTeaShop(scene, at = [300, 0]) {
  const K = createKit(scene);
  const { box, cyl, sphere, plane, basic, floorZone, ceiling, wall, glassWall, poster, sign, interact, textTexture, THREE, glow } = K;
  const [ox, oz] = at;
  K.root.position.set(ox, 0, oz);
  const H = 3.2, pink = '#ff7aa8', mint = '#9be7c4';
  floorZone(-6, -4, 6, 4, FLOORS.checker('#ffffff', '#ffe3ec'), 0.6);
  ceiling(-6, -4, 6, 4, H, '#fff5f8');
  wall(-6, -4, 6, -4, '#ffd8e4', { h: H });
  wall(-6, -4, -6, 4, '#ffd8e4', { h: H });
  wall(6, -4, 6, 4, '#ffd8e4', { h: H });
  wall(-6, 4, 6, 4, '#ffd8e4', { h: H, gaps: [[-1.2, 1.2]], doorH: 2.4 });
  glassWall(-1.2, 4, 1.2, 4, { h: 2.4, frame: '#ffffff' });
  K.collideRect(-1.2, 1.2, 4.05, 4.4);
  interact('door', 'Ra khu phố', 0, 1.1, 3.6);
  // bar
  box(8.5, 1.05, 0.7, pink, -0.5, 0, -0.6, true, 0, 0.02);
  box(8.6, 0.05, 0.8, '#ffffff', -0.5, 1.05, -0.6, false, 0, 0.012);
  poster(['TRÀ SỮA FULL TOPPING', 'trân châu nấu mỗi 4 tiếng'], { w: 1024, h: 220, bg: '#ffffff', fg: pink, sizes: [76, 40] }, -0.5, 0.55, -0.24, 0, 3.2, 0.69);
  box(0.5, 0.25, 0.35, '#1d1d1f', 2.6, 1.08, -0.6, false, 0, 0.01); // POS
  // back stations: cups, tea urns, creamer, sugar pump, ice bin, shaker, sealer
  const st = (x, label, col, h = 1.0) => { box(1.0, h, 0.6, col, x, 0, -3.5, true, 0, 0.012); poster([label], { w: 256, h: 80, bg: '#ffffff', sizes: [30] }, x, h + 0.25, -3.18, 0, 0.8, 0.25); };
  st(-4.6, 'CỐC M / L', '#ffffff'); for (let i = 0; i < 4; i++) cyl(0.09, 0.07, 0.5, '#ffffff', -4.85 + i * 0.17, 1.0, -3.5, 10, 0.006);
  st(-3.4, 'TRÀ Ủ', '#c98f5a'); for (let i = 0; i < 3; i++) cyl(0.14, 0.14, 0.45, ['#7b3f00', '#c49a6c', '#9bc27a'][i], -3.7 + i * 0.3, 1.0, -3.5, 12, 0.008);
  st(-2.2, 'TOPPING', '#fff1b8'); for (let i = 0; i < 6; i++) box(0.16, 0.12, 0.2, ['#1d1d1f', '#f5f5f5', '#9be7c4', '#ffd25a', '#ffe9a0', '#ff9f1c'][i], -2.55 + (i % 3) * 0.3, 1.0, -3.6 + Math.floor(i / 3) * 0.22, false, 0, 0.004);
  st(-1.0, 'SỮA NỀN', '#ffffff'); cyl(0.16, 0.16, 0.4, '#fff3d6', -1.0, 1.0, -3.5, 12, 0.008);
  st(0.2, 'ĐƯỜNG %', '#ffe3ec'); cyl(0.07, 0.07, 0.35, '#ffffff', 0.2, 1.0, -3.5, 10, 0.006);
  st(1.4, 'ĐÁ', '#bfe3ff'); for (let i = 0; i < 5; i++) box(0.12, 0.12, 0.12, '#e8f6ff', 1.2 + (i % 3) * 0.15, 1.0 + Math.floor(i / 3) * 0.12, -3.5, false, i, 0.004);
  st(2.6, 'LẮC', '#e3d9ff'); cyl(0.08, 0.06, 0.3, '#c0c6cf', 2.6, 1.0, -3.5, 10, 0.006);
  st(3.8, 'DẬP NẮP', '#d9d9d9', 1.3); box(0.5, 0.35, 0.4, '#5f6b7a', 3.8, 1.3, -3.5, false, 0, 0.01);
  st(5.0, 'NỒI TRÂN CHÂU', '#2b2b2b'); cyl(0.25, 0.22, 0.3, '#b0b8c6', 5.0, 1.0, -3.5, 14, 0.01);
  interact('shift', 'Vào ca làm (bắt đầu ca)', -0.5, 1.1, -1.6);
  interact('manage', 'Bảng quản lý: kho, nhập hàng, lời lỗ', 4.6, 1.1, -1.6);
  // menu board
  const menu = textTexture(['MENU', 'Trà sữa truyền thống 25k', 'Trà sữa trân châu đường đen 32k', 'Hồng trà kem cheese 32k', 'Trà đào cam sả 30k', 'Trà sữa xoài sấy Ba & Má 35k', 'Ô long sữa 30k', 'Trà lài vải 28k', 'Sữa tươi trân châu 30k'], { w: 768, h: 768, bg: '#2b2b2b', fg: '#ffffff', sizes: [70, 36, 36, 36, 36, 36, 36, 36, 36], align: 'left', pad: 40 });
  plane(2.6, 2.6, basic(menu), -0.5, 2.1, -3.82, 0);
  // customer side: high table, stools, neon
  box(2.4, 1.05, 0.5, '#ffffff', -3.6, 0, 2.6, true, 0, 0.012);
  for (let i = 0; i < 3; i++) cyl(0.17, 0.15, 0.75, [pink, mint, '#ffd25a'][i], -4.4 + i * 0.8, 0, 2.0, 12, 0.01);
  poster(['đường 0% · đá 0% · topping 100%'], { w: 1024, h: 140, bg: '#1d1d1f', fg: '#ff9ec4', sizes: [56], border: '#ff9ec4' }, 3.5, 2.2, 3.88, PI, 3.2, 0.44);
  cyl(0.25, 0.2, 0.4, '#3e9b57', 5.3, 0, 3.4, 14, 0.01); for (let i = 0; i < 5; i++) sphere(0.22, '#57b36b', 5.3 + Math.cos(i) * 0.15, 0.6 + i * 0.12, 3.4 + Math.sin(i) * 0.15, 0.01);
  K.collideCircle(5.3, 3.4, 0.3);
  for (const x of [-3, 0, 3]) { cyl(0.006, 0.006, 0.6, '#222', x, H - 0.6, 1, 4, 0); cyl(0.05, 0.3, 0.25, pink, x, H - 0.85, 1, 14, 0.01); sphere(0.07, glow('#fff3c4'), x, H - 0.86, 1, 0); }
  K.lights({ sky: '#fff6fa', ground: '#ffe3ec', hemi: 1.55, amb: 0.5, sun: 0.8 });
  // staff spot: chị Nhung behind the bar; you stand at the bar from the customer side when not working
  return K.result({ spawn: [ox, oz + 3.0, 0], bounds: { minX: ox - 5.7, maxX: ox + 5.7, minZ: oz - 3.7, maxZ: oz + 3.7 }, origin: at, staff: { nhung: [ox + 3.2, oz - 1.5, 0] } });
}
