// Ba & Má — a Saigon shophouse (nhà phố) 24 × 16 m, not an office.
//   South (z 4…8): the shop front behind a roller door. Retail counter with jars = reception (Chị Vy),
//                  Má's desk + safe watching the door, Thần Tài altar in the corner, Chú Bảy's scooter.
//   Middle (z −2.5…4): Ba's tea room (W) · the family long table (centre, where everybody works and eats)
//                  · the living room with the wooden sofa set = the "meeting room" (E).
//   North (z −8…−2.5): Cô Tư's kitchen (NW) · the workshop with drying racks, dryers, packing table and the
//                  livestream corner (centre) · the finished-goods store (NE).
// Coordinates: x east, z south; spot rotY 0 faces south (+z), PI faces north, PI/2 faces east, −PI/2 west.
import { createKit, FLOORS } from '../kit3d.js';

const PI = Math.PI;
const H = 3.2;

// ---------- named spots (every slot name the engine or content may ask for) ----------
const S = {
  boss: [-10.6, 0.6, PI / 2],          // Ba at his tea table
  finance: [4.8, 5.4, 0],              // Má behind her desk, eyes on the door
  corner: [3.15, 0.8, -PI / 2],        // Kevin at the head of the family table with his laptop
  corner2: [3.2, 2.3, -PI / 2 + 0.3],
  coach: [-5.0, 0.6, PI / 2],          // Sơn by the "họp sáng" whiteboard
  reception: [-4.3, 4.65, 0],          // Chị Vy behind the retail counter
  n1: [-2.4, -0.3, 0],                 // Chị Mai, family table north side
  n2: [1.6, -0.3, 0],
  n3: [-2.4, 2.0, PI],
  n4: [0.6, 2.0, PI],
  n5: [-4.6, -5.3, 0],
  n6: [8.6, -4.6, 0],
  c1: [4.4, -6.55, 0],                 // Út Mi in the livestream corner, facing the ring light
  c2: [-3.0, -2.95, PI],               // the packing table
  c3: [-0.4, -0.3, 0],                 // Ngân, family table north side
  senior: [1.6, 2.0, PI],
  it: [3.6, -4.4, 0],                  // Khoa at the tech desk in the workshop
  x1: [-3.2, -5.45, 0],                // Anh Dũng at the drying racks
  x2: [1.2, -6.35, 0],                 // Cậu Tám by the dryers
  x3: [8.3, 5.5, -PI / 2],             // Chú Bảy by his scooter
  pantry: [-8.6, -6.55, 0],            // Cô Tư at the stove
  hr: [-9.0, 6.0, PI / 2],
  meeting_head: [11.0, 0.8, -PI / 2],  // living room: Ba on the long wooden sofa
  mr_n1: [9.6, -0.45, 0],
  mr_n2: [9.6, 2.05, PI],
  giao: [-2.0, 6.9, PI],
  reception_side: [-2.2, 4.85, -PI / 2],
  pantry_bao: [-9.6, -4.0, PI / 2],
  window: [-0.6, -7.2, PI],
  lunch1: [-3.0, -0.3, 0], lunch2: [-1.4, -0.3, 0], lunch3: [0.6, -0.3, 0], lunch4: [-0.4, 2.0, PI], lunch5: [1.6, 2.0, PI],
};
{
  const cx = -5.6, cz = 0.6, rx = 1.9, rz = 1.7;
  for (let i = 0; i < 10; i++) {
    const a = (-0.42 + i * 0.0933) * PI;
    const x = cx + rx * Math.cos(a), z = cz + rz * Math.sin(a);
    S['su' + (i + 1)] = [x, z, Math.atan2(cx - x, cz - z)];
  }
}
S.su_dat = S.coach; S.scrum = S.coach; S.mr_head = S.meeting_head;
// T&M slot names point at the same seats, so any shared scene still finds a place to stand
Object.assign(S, {
  tuyet: S.boss, thu: S.n1, nhi: S.n2, linh: S.n3, an: S.n4, minh: S.n5, ha: S.n6, long: S.c1, trang: S.c2, bao: S.c3,
  mai: S.senior, han: S.corner, khang: S.corner2, quynh: S.finance, gam: S.reception, binh: S.it, phuong: S.hr, dat: S.coach,
});

export function buildBama(scene, th) {
  const K = createKit(scene);
  const { THREE, box, cyl, sphere, plane, basic, glow, collideRect, floorZone, ceiling, wall, sign, poster, desk, plant, lantern, ceilingFan, stool, plasticChair, interact, canvasTex, textTexture, roundRect, INK } = K;
  const L = (id, d) => (th.labels && th.labels[id]) || d;
  const signs = th.signs || {};

  const C = {
    wall: '#f7dcc0', kitchen: '#cfeee3', tea: '#e9c9a0', work: '#e8e3d8', store: '#e3d3bc', living: '#fde2c4',
    wood: '#c98f5a', woodDark: '#8b5a2b', red: '#c0392b', gold: '#ffd25a', cream: '#fff3d6',
  };

  // ---------- floors & ceiling ----------
  floorZone(-12, 4, 12, 8, FLOORS.gachBong('#c0392b', '#f6e7cf', '#2e6b5e'), 0.8);       // shop front
  floorZone(-6, -2.5, 6, 4, FLOORS.terrazzo('#efe5d4'), 2);                              // family area
  floorZone(-12, -2.5, -6, 4, FLOORS.planks('#b57c4a', '#a56d3e'), 1.2);                 // Ba's tea room
  floorZone(-12, -8, -6, -2.5, FLOORS.checker('#ffffff', '#cfe6e0'), 0.6);               // kitchen
  floorZone(-6, -8, 6, -2.5, FLOORS.concrete('#c9c6bf'), 2);                             // workshop
  floorZone(6, -8, 12, -2.5, FLOORS.concrete('#bdb7ab'), 2);                             // store
  floorZone(6, -2.5, 12, 4, FLOORS.gachBong('#2e5e8c', '#f3ead8', '#c9a227'), 0.8);       // living room
  floorZone(-14, 8, 14, 12, FLOORS.tiles('#d8d2c6'), 1, 0.002);                          // sidewalk outside
  // yellow safety line around the workshop machines
  for (const [x, z, w, d] of [[0, -6.1, 3.6, 0.06], [-1.8, -7.05, 0.06, 1.9], [1.8, -7.05, 0.06, 1.9]]) floorZone(x - w / 2, z - d / 2, x + w / 2, z + d / 2, '#f1c40f', 1, 0.007);
  ceiling(-12, -8, 12, 8, H, '#fff6e8');
  for (let x = -10; x <= 10; x += 4) box(0.18, 0.16, 16, '#d9b48a', x, H - 0.16, 0, false, 0, 0.01); // ceiling beams

  // ---------- outer shell ----------
  wall(-12, -8, 12, -8, C.wall, { h: H });
  wall(-12, -8, -12, 8, C.wall, { h: H });
  wall(12, -8, 12, 8, C.wall, { h: H });
  wall(-12, 8, 12, 8, C.wall, { h: H, gaps: [[-3, 3]], doorH: 2.7 });
  collideRect(-3, 3, 8.05, 8.5); // the open roller door: you can see the street, you cannot leave mid-shift
  // roller shutter rolled up above the door + its rails
  cyl(0.28, 0.28, 6.2, '#9aa3ad', 0, 2.62, 8.0, 18, 0.02).rotation.z = PI / 2;
  for (const x of [-3, 3]) box(0.1, 2.7, 0.14, '#7d8790', x, 0, 8.0, false, 0, 0.012);
  // the street outside: tube houses, wires, scooters
  const street = canvasTex(2048, 640, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#bfe3ff'); sky.addColorStop(1, '#ffe9cf');
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    const cols = ['#ffd3b8', '#c9e8d6', '#ffe9a0', '#f5c2c7', '#cfd8ff', '#f9d69b', '#d6f0ff'];
    let x = 0, n = 0;
    while (x < w) {
      const bw = 150 + ((n * 61) % 90), top = 60 + ((n * 83) % 120);
      g.fillStyle = cols[n % cols.length]; g.fillRect(x, top, bw, h - top); g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(x, top, bw, h - top);
      for (let fy = top + 30; fy < h - 180; fy += 90) { g.fillStyle = '#ffffff'; g.fillRect(x + 22, fy, bw - 44, 50); g.strokeRect(x + 22, fy, bw - 44, 50); g.fillStyle = '#7fb069'; g.fillRect(x + 18, fy + 50, bw - 36, 10); }
      g.fillStyle = ['#c0392b', '#2e86de', '#27ae60', '#f39c12'][n % 4]; g.fillRect(x + 8, h - 175, bw - 16, 34); g.strokeRect(x + 8, h - 175, bw - 16, 34);
      x += bw; n++;
    }
    g.strokeStyle = '#333'; g.lineWidth = 3;
    for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(0, 90 + k * 9); g.quadraticCurveTo(w / 2, 150 + k * 14, w, 80 + k * 11); g.stroke(); }
    g.fillStyle = '#9aa0a6'; g.fillRect(0, h - 70, w, 70);
    for (let i = 0; i < 9; i++) { const sx = 90 + i * 225; g.fillStyle = ['#e74c3c', '#3498db', '#2c3e50', '#f1c40f'][i % 4]; roundRect(g, sx, h - 120, 120, 50, 18); g.fill(); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(sx + 20, h - 66, 18, 0, 7); g.arc(sx + 100, h - 66, 18, 0, 7); g.fill(); }
  });
  plane(30, 9.4, new THREE.MeshBasicMaterial({ map: street }), 0, 4.0, 12, PI);

  // ---------- interior walls ----------
  wall(-12, -2.5, -6, -2.5, C.kitchen, { h: H });                                   // kitchen | tea room
  wall(-6, -8, -6, -2.5, C.kitchen, { h: H, gaps: [[-3.8, -2.5]] });                // kitchen | workshop (door)
  wall(-6, -2.5, -6, 4, C.tea, { h: H, gaps: [[2.2, 3.5]] });                       // tea room | family (door)
  wall(-12, 4, -6, 4, C.tea, { h: H });                                             // tea room | shop
  wall(-6, -2.5, 6, -2.5, C.work, { h: H, gaps: [[-6, -4.7], [-1.1, 1.1]] });       // workshop | family
  wall(6, -8, 6, -2.5, C.store, { h: H, gaps: [[-4.4, -3.0]] });                    // workshop | store (door)
  wall(6, -2.5, 12, -2.5, C.store, { h: H });                                       // store | living room
  wall(6, -2.5, 6, 4, C.living, { h: H, gaps: [[-0.9, 2.5]], doorH: 2.5 });         // family | living room (wide arch)
  wall(6, 4, 12, 4, C.living, { h: H });                                            // living room | shop
  // a wooden beam over the open shop front, carrying the shop sign
  box(12, 0.5, 0.3, C.woodDark, 0, H - 0.5, 4, false, 0, 0.02);
  const logo = textTexture(th.logo || ['BA & MÁ'], { w: 1024, h: 256, bg: C.red, fg: '#fff3d6', sizes: [96, 34, 30], weights: [900, 700, 600] });
  plane(3.6, 0.9, basic(logo), 0, 2.5, 4.17, 0);
  const banner = textTexture([th.banner || 'CHỐT ĐƠN'], { w: 1024, h: 128, bg: C.gold, fg: '#7b1a12', sizes: [54], weights: [900] });
  plane(5.2, 0.65, basic(banner), 0, 2.45, 3.84, PI);

  // ================= SHOP FRONT (south) =================
  // retail counter = reception: wooden counter, glass case with jars, scale, price board
  box(3.2, 0.95, 0.7, '#7a4a26', -4.3, 0, 5.5, true);
  box(3.0, 0.6, 0.02, C.red, -4.3, 0.2, 5.86, false, 0, 0);
  box(3.3, 0.05, 0.8, '#e8c39a', -4.3, 0.95, 5.5, false);
  const glassM = new THREE.MeshBasicMaterial({ color: '#e8f6ff', transparent: true, opacity: 0.35, depthWrite: false });
  const gcase = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.5, 0.5), glassM); gcase.position.set(-4.6, 1.25, 5.5); K.root.add(gcase);
  const fill = ['#8b3a1a', '#a0522d', '#e1a23c', '#c0703a', '#f39c12'];
  for (let i = 0; i < 5; i++) { const x = -5.5 + i * 0.45; cyl(0.12, 0.12, 0.28, fill[i], x, 1.0, 5.5, 14, 0.012); cyl(0.13, 0.13, 0.05, C.gold, x, 1.28, 5.5, 14, 0.01); }
  box(0.36, 0.08, 0.3, '#dfe6ee', -2.95, 1.0, 5.45, false, 0, 0.01); box(0.3, 0.18, 0.06, '#dfe6ee', -2.95, 1.0, 5.33, false, 0, 0.01);
  poster(['BÁN LẺ · ĂN THỬ', 'Khô gà 120k · Khô bò 180k'], { w: 768, h: 256, bg: C.gold, fg: '#7b1a12', sizes: [64, 44] }, -4.3, 0.55, 5.88, 0, 1.6, 0.53);
  sign(signs.reception || 'QUẦY BÁN LẺ', '#ffe3b0', -4.3, 2.0, 5.2, 0, 1.6);
  // shelves of product along the west wall of the shop
  for (let k = 0; k < 2; k++) {
    const z = 5.0 + k * 1.6;
    box(0.5, 2.0, 1.4, '#9c6a3f', -11.7, 0, z, true);
    for (let s = 0; s < 4; s++) for (let i = 0; i < 4; i++) box(0.22, 0.28, 0.12, ['#ff9f7a', C.gold, '#9ee8c8', '#ff8fa3'][(s + i + k) % 4], -11.5, 0.15 + s * 0.45, z - 0.5 + i * 0.32, false, 0, 0.008);
  }
  sign('KHÔ GÀ · KHÔ BÒ · XOÀI SẤY', '#ffe9a0', -11.5, 2.3, 5.8, PI / 2, 2.2);
  // drink cooler by the counter
  box(0.8, 1.7, 0.6, '#e74c3c', -8.2, 0, 7.5, true); plane(0.62, 1.2, new THREE.MeshBasicMaterial({ color: '#d6f0ff' }), -8.2, 0.95, 7.19, PI);
  for (let i = 0; i < 6; i++) cyl(0.05, 0.05, 0.18, ['#2ecc71', '#e67e22', '#3498db'][i % 3], -8.4 + (i % 3) * 0.2, 0.55 + Math.floor(i / 3) * 0.4, 7.25, 8, 0.006);
  // Tết kumquat trees flanking the door
  for (const x of [-3.7, 3.7]) {
    cyl(0.3, 0.24, 0.5, '#8b3a1a', x, 0, 7.4, 16);
    for (let i = 0; i < 7; i++) sphere(0.26, '#2f7d3a', x + Math.cos(i) * 0.22, 0.85 + (i % 3) * 0.22, 7.4 + Math.sin(i) * 0.22, 0.015);
    for (let i = 0; i < 12; i++) sphere(0.05, '#ff9f1c', x + Math.cos(i * 1.7) * 0.38, 0.8 + (i % 4) * 0.18, 7.4 + Math.sin(i * 1.7) * 0.38, 0);
    K.collideCircle(x, 7.4, 0.32);
  }
  lantern(-1.6, 6.2, H); lantern(1.6, 6.2, H); lantern(-7.5, 5.6, H, '#ff6b4a'); lantern(7.5, 5.6, H, '#ff6b4a');

  // Má's desk: ledger, calculator, cash bag — she sees everyone who comes in or goes out
  box(1.4, 0.75, 0.7, C.wood, 4.8, 0, 6.15, true);
  box(1.5, 0.05, 0.8, '#e8c39a', 4.8, 0.75, 6.15, false);
  box(0.4, 0.04, 0.3, '#3a6ea5', 4.5, 0.8, 6.15, false, 0.1, 0.008); box(0.16, 0.03, 0.22, '#333333', 5.0, 0.8, 6.1, false, 0, 0.008);
  box(0.28, 0.18, 0.18, '#8e44ad', 5.3, 0.8, 6.2, false, 0, 0.01);
  box(0.5, 0.1, 0.5, '#d35400', 4.8, 0.42, 5.45, false); box(0.5, 0.5, 0.08, '#d35400', 4.8, 0.47, 5.2, false);
  poster(['QUẦY MÁ', 'Thu · Chi · Hỏi han'], { w: 512, h: 256, bg: '#ffd3b8', sizes: [64, 40] }, 4.8, 0.5, 6.56, 0, 1.0, 0.5);
  // the safe, against the living-room wall, right behind Má
  box(0.65, 0.95, 0.6, '#5f6b7a', 6.6, 0, 4.45, true);
  cyl(0.11, 0.11, 0.04, C.gold, 6.6, 0.55, 4.77).rotation.x = PI / 2;
  poster(['PHÁT'], { w: 128, h: 256, bg: C.gold, fg: '#e0455f', sizes: [44] }, 6.85, 0.75, 4.76, 0, 0.18, 0.36);
  interact('safe', L('safe', 'Nhìn két của Má'), 6.6, 0.8, 4.85);
  sign(signs.finance || 'PHÒNG MÁ · KÉT', '#ffcc66', 5.6, 2.5, 4.18, 0, 1.6);
  // Má's red chair next to her desk
  plasticChair(3.55, 5.7, 0.3, '#ff3b3b');
  interact('redchair', L('redchair', 'Nhìn chiếc ghế nhựa đỏ'), 3.55, 0.6, 5.7);

  // Chú Bảy's scooter + orders waiting to go out
  const scooter = (x, z) => {
    box(1.3, 0.35, 0.36, '#2e86de', x, 0.3, z, true);
    box(0.5, 0.18, 0.34, '#1d1d1f', x - 0.2, 0.68, z, false, 0, 0.012);
    box(0.12, 0.65, 0.2, '#2e86de', x + 0.55, 0.45, z, false, 0, 0.012);
    box(0.06, 0.06, 0.6, '#555555', x + 0.6, 1.1, z, false, 0, 0.01);
    for (const dx of [-0.5, 0.55]) { const w = cyl(0.22, 0.22, 0.12, '#222222', x + dx, 0.0, z - 0.06, 16, 0.01); w.rotation.x = PI / 2; w.position.y = 0.22; }
    box(0.5, 0.4, 0.45, '#e8c39a', x - 0.55, 0.65, z, false, 0, 0.012);
  };
  scooter(9.3, 6.2);
  for (let i = 0; i < 5; i++) box(0.6, 0.4, 0.45, i % 2 ? '#e8c39a' : '#d9a273', 10.6 + (i % 2) * 0.65, Math.floor(i / 2) * 0.4, 4.55, false, 0, 0.015);
  collideRect(10.25, 11.55, 4.3, 4.8);
  sign('ĐƠN CHỜ GIAO', '#bfe3ff', 11.0, 1.55, 4.8, 0, 1.2);

  // Thần Tài altar on the floor in the corner, facing the door
  box(0.6, 0.7, 1.0, '#d63031', 11.6, 0, 6.8, true);
  box(0.66, 0.06, 1.06, C.gold, 11.6, 0.7, 6.8, false);
  box(0.05, 0.6, 1.0, '#ff6f8a', 11.88, 0.76, 6.8, false, 0, 0.015);
  sphere(0.11, '#ffd25a', 11.6, 0.9, 6.55); cyl(0.09, 0.12, 0.14, '#ffd25a', 11.6, 0.76, 6.55);
  sphere(0.11, '#ffd25a', 11.6, 0.9, 7.05); cyl(0.09, 0.12, 0.14, '#ffd25a', 11.6, 0.76, 7.05);
  cyl(0.07, 0.07, 0.08, '#d9a273', 11.4, 0.76, 6.8);
  for (let i = 0; i < 3; i++) cyl(0.006, 0.006, 0.28, '#ff7a6b', 11.4, 0.84, 6.77 + i * 0.03, 6, 0);
  const bulbs = [];
  for (let i = 0; i < 6; i++) bulbs.push(sphere(0.03, glow('#ff6f8a'), 11.86, 1.38, 6.35 + i * 0.18, 0));
  K.animated.push((t) => bulbs.forEach((b, i) => b.material.color.set(((Math.floor(t * 3) + i) % 2) ? '#ff6f8a' : '#ffe08a')));
  interact('altar', L('altar', 'Thắp nhang Thần Tài'), 11.25, 0.9, 6.8);

  // ================= FAMILY AREA (centre) =================
  // the long family table: work, lunch, arguments
  box(5.6, 0.08, 1.3, C.wood, -0.4, 0.72, 0.8, false, 0, 0.025);
  for (const [dx, dz] of [[-2.65, -0.5], [2.65, -0.5], [-2.65, 0.5], [2.65, 0.5]]) box(0.1, 0.72, 0.1, C.woodDark, -0.4 + dx, 0, 0.8 + dz, false, 0, 0.012);
  collideRect(-3.2, 2.4, 0.15, 1.45);
  for (const x of [-2.4, -0.4, 1.6]) stool(x, -0.05, '#ff5a6e');
  for (const x of [-2.4, -1.4, 0.6, 1.6]) stool(x, 1.75, x === -1.4 ? '#ffe08a' : '#ff5a6e');
  // things on the table
  cyl(0.18, 0.18, 0.28, '#ffffff', -1.8, 0.8, 0.8, 16, 0.015); sphere(0.06, '#ff5a6e', -1.8, 1.1, 0.8, 0.01);
  cyl(0.09, 0.08, 0.12, '#c98f6a', 0.2, 0.8, 0.75); for (let i = 0; i < 4; i++) cyl(0.04, 0.03, 0.05, '#ffffff', 0.4 + (i % 2) * 0.12, 0.8, 0.6 + Math.floor(i / 2) * 0.25, 10, 0.008);
  box(0.4, 0.02, 0.28, '#9fb4ff', -2.4, 0.81, 0.4, false, 0, 0.008);
  box(0.4, 0.02, 0.28, '#ffc8dd', -0.4, 0.81, 0.4, false, 0, 0.008);
  box(0.3, 0.32, 0.08, C.gold, 1.2, 0.8, 0.8, false, 0.3, 0.01);
  // the intern's place: a laptop with Má's spreadsheet
  const me = (th.desks && th.desks.me) || ['Intern · Bạn', ['Excel', 'TonKho_FINAL_Ma.xlsx'], '#e07a5f'];
  box(0.42, 0.02, 0.3, '#dfe6ee', -1.4, 0.81, 1.2, false, 0, 0.008);
  const meScreen = textTexture(me[1] || ['Excel'], { w: 256, h: 160, bg: me[2] || '#e07a5f', sizes: [26, 20], weights: [800, 500], radius: 10, border: null });
  const lid = plane(0.4, 0.26, new THREE.MeshBasicMaterial({ map: meScreen }), -1.4, 0.96, 1.05, 0); lid.rotation.x = -0.2;
  poster([me[0]], { w: 256, h: 64, bg: '#ffffff', sizes: [28], radius: 12 }, -0.95, 0.84, 1.46, 0, 0.32, 0.08);
  interact('desk', L('desk', 'Ngồi vào chỗ của mình ở bàn gia đình'), -1.4, 0.8, 1.3);
  // Kevin's laptop stand at the head of the table
  box(0.5, 0.2, 0.35, '#dfe6ee', 2.1, 0.8, 0.8, false, 0, 0.01); box(0.4, 0.26, 0.02, '#1d1d1f', 2.1, 1.0, 0.95, false, 0, 0.01);
  // "họp sáng" whiteboard on Ba's wall, at the west end of the table
  const wb = textTexture(th.whiteboard || ['HỌP SÁNG 8:15'], { w: 768, h: 512, bg: '#ffffff', fg: C.red, sizes: [60, 44, 40, 40, 32], weights: [900, 800, 700, 700, 500], align: 'left', pad: 40 });
  box(0.06, 1.2, 1.9, '#ffffff', -5.88, 0.85, 0.3, false, 0, 0.02);
  plane(1.8, 1.1, basic(wb), -5.84, 1.45, 0.3, PI / 2);
  sign(signs.standup || 'HỌP SÁNG 8:15', '#ffcc66', -5.86, 2.35, 0.3, PI / 2, 1.9);
  interact('okr', L('okr', 'Đọc bảng "họp sáng"'), -5.75, 1.4, 0.3);
  // task board (sticky notes) on the workshop wall, facing the table
  const scrum = th.scrum || { cols: ['CẦN LÀM', 'ĐANG LÀM', 'XONG'], notes: [[], [], []] };
  const kb = canvasTex(1024, 560, (g, w, h) => {
    g.fillStyle = '#d9a273'; roundRect(g, 4, 4, w - 8, h - 8, 22); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    const nc = ['#ffe9a0', '#ffc8dd', '#b8f0d8', '#bfe3ff', '#ffd3b8'];
    scrum.cols.forEach((t, i) => {
      const x = 24 + i * 330;
      g.fillStyle = '#fff3d6'; roundRect(g, x, 22, 310, 62, 12); g.fill(); g.lineWidth = 5; g.stroke();
      g.fillStyle = INK; g.font = '900 32px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText(t, x + 155, 64);
      (scrum.notes[i] || []).slice(0, 4).forEach((n, k) => {
        const nx = x + 12 + (k % 2) * 152, ny = 104 + Math.floor(k / 2) * 150;
        g.fillStyle = nc[(i + k) % nc.length]; g.fillRect(nx, ny, 136, 124); g.lineWidth = 4; g.strokeRect(nx, ny, 136, 124);
        g.fillStyle = INK; g.font = '700 21px Be Vietnam Pro, Arial';
        const words = n.split(' '); let line = '', ly = ny + 30; const out = [];
        words.forEach((wd) => { if ((line + ' ' + wd).trim().length > 11) { out.push(line.trim()); line = wd; } else line += ' ' + wd; });
        out.push(line.trim()); out.slice(0, 4).forEach((l) => { g.fillText(l, nx + 68, ly); ly += 26; });
      });
    });
  });
  plane(2.6, 1.42, basic(kb), -3.0, 1.55, -2.4, 0);
  // family calendar + clock
  poster(th.board || ['LỊCH NHÀ MÌNH'], { w: 768, h: 420, bg: '#fff3d6', fg: '#7b1a12', sizes: [52, 34, 34] }, 3.4, 1.6, -2.4, 0, 1.8, 1.0);
  const clockTex = canvasTex(256, 256, (g) => {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 118, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 12; g.stroke();
    g.fillStyle = INK; g.font = '800 30px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i / 12 * PI * 2; g.fillText(i, 128 + Math.sin(a) * 88, 128 - Math.cos(a) * 88); }
  });
  plane(0.55, 0.55, basic(clockTex), 0, 2.62, -2.4, 0);
  // water dispenser by the workshop door
  box(0.4, 0.9, 0.4, '#ffffff', 1.9, 0, -2.15, true); cyl(0.17, 0.17, 0.45, new THREE.MeshToonMaterial({ color: '#bfe3ff', transparent: true, opacity: 0.8 }), 1.9, 0.9, -2.15);
  ceilingFan(-1.6, 0.8, H); ceilingFan(1.4, 0.8, H);

  // ================= BA'S TEA ROOM (west) =================
  box(1.5, 0.42, 0.9, C.woodDark, -9.4, 0, 0.6, true); box(1.6, 0.05, 1.0, C.wood, -9.4, 0.42, 0.6, false);
  cyl(0.09, 0.08, 0.12, '#c98f6a', -9.6, 0.47, 0.6); for (let i = 0; i < 4; i++) cyl(0.04, 0.03, 0.05, '#ffffff', -9.2 + (i % 2) * 0.14, 0.47, 0.45 + Math.floor(i / 2) * 0.3, 10, 0.008);
  for (const [x, ry] of [[-10.8, PI / 2], [-8.0, -PI / 2]]) { // two carved wooden armchairs
    box(0.65, 0.45, 0.65, C.woodDark, x, 0, 0.6, false);
    box(0.1, 0.95, 0.65, C.woodDark, x + (ry > 0 ? -0.3 : 0.3), 0.45, 0.6, false);
  }
  collideRect(-8.35, -7.65, 0.25, 0.95);
  const scroll = textTexture([th.bossWall || 'Gia Đình'], { w: 256, h: 768, bg: '#fff3d6', fg: '#8b1a1a', sizes: [96], weights: [900] });
  plane(0.7, 2.0, basic(scroll), -11.9, 1.6, 0.6, PI / 2);
  poster(['"Làm ăn phải có tâm.', 'Có tâm thì phải có lãi."'], { w: 768, h: 256, bg: '#fff1b8', fg: '#8b1a1a', sizes: [54, 54], weights: [800, 800] }, -9.0, 1.8, -2.4, 0, 2.0, 0.66);
  // trophy shelf: certificates from 2009
  box(2.2, 0.06, 0.3, C.woodDark, -9.2, 1.0, 3.8, false);
  for (let i = 0; i < 4; i++) box(0.35, 0.45, 0.04, i % 2 ? C.gold : '#ffffff', -10.0 + i * 0.55, 1.06, 3.85, false, 0, 0.01);
  poster(['HÀNG VIỆT NAM', 'CHẤT LƯỢNG CAO 2009'], { w: 512, h: 256, bg: C.red, fg: C.gold, sizes: [46, 34] }, -9.2, 2.1, 3.9, PI, 1.6, 0.8);
  // fish tank (feng shui, of course)
  const tankM = new THREE.MeshBasicMaterial({ color: '#7fd3ff', transparent: true, opacity: 0.45, depthWrite: false });
  box(0.6, 0.8, 1.5, C.woodDark, -11.6, 0, 2.6, true);
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 1.4), tankM); tank.position.set(-11.6, 1.1, 2.6); K.root.add(tank);
  const fish = [0, 1, 2].map((i) => sphere(0.06, ['#ff7a00', '#ff3b3b', C.gold][i], -11.6, 1.0 + i * 0.12, 2.6, 0));
  K.animated.push((t) => fish.forEach((f, i) => { f.position.z = 2.6 + Math.sin(t * (0.6 + i * 0.2) + i) * 0.55; }));
  // Ba's lime plant
  cyl(0.3, 0.26, 0.35, '#8b5a3c', -7.0, 0, -1.8); for (let i = 0; i < 7; i++) sphere(0.16, '#4f8a4f', -7.0 + Math.cos(i) * 0.2, 0.55 + (i % 3) * 0.15, -1.8 + Math.sin(i) * 0.2, 0.012);
  K.collideCircle(-7.0, -1.8, 0.32);
  interact('plant', L('plant', 'Ngắm chậu lá chanh của Ba'), -7.0, 0.8, -1.8);
  sign(signs.boss || 'PHÒNG BA', '#ffcc66', -5.9, 2.65, 2.85, PI / 2, 1.3);

  // ================= KITCHEN (north-west) =================
  box(4.6, 0.9, 0.7, '#ffffff', -9.3, 0, -7.55, true);
  box(4.7, 0.06, 0.78, '#9fb4c0', -9.3, 0.9, -7.55, false);
  box(0.8, 0.06, 0.5, '#333333', -10.6, 0.96, -7.55, false, 0, 0.01);
  cyl(0.22, 0.2, 0.3, '#b0b8c6', -10.8, 1.0, -7.55); cyl(0.18, 0.16, 0.18, '#b0b8c6', -10.3, 1.0, -7.6);
  cyl(0.18, 0.18, 0.28, '#ffffff', -9.4, 0.96, -7.55, 16, 0.015);
  cyl(0.12, 0.12, 0.3, '#5d4037', -7.6, 0.96, -7.5, 14, 0.012); box(0.35, 0.3, 0.3, '#ffc8dd', -8.1, 0.96, -7.55, false);
  interact('coffee', L('coffee', 'Bếp: ăn uống, cà phê'), -7.7, 1.1, -7.1);
  for (let i = 0; i < 5; i++) sphere(0.06, i % 2 ? '#ffffff' : '#e74c3c', -9.8 + i * 0.25, 2.2 - (i % 2) * 0.1, -7.85, 0.008);
  box(0.8, 1.9, 0.75, '#9fd3f0', -11.5, 0, -5.4, true); box(0.04, 0.5, 0.06, '#ffffff', -11.08, 0.9, -5.15, false, 0, 0.006); box(0.04, 0.3, 0.06, '#ffffff', -11.08, 1.45, -5.15, false, 0, 0.006);
  box(1.0, 0.72, 1.0, '#ffffff', -9.0, 0, -4.6, true); box(1.1, 0.05, 1.1, '#ffe08a', -9.0, 0.72, -4.6, false);
  for (const [x, z] of [[-9.8, -4.6], [-8.2, -4.6]]) stool(x, z, '#bfe3ff');
  for (let i = 0; i < 4; i++) box(0.18, 0.22, 0.05, ['#ff9f7a', C.gold, '#9ee8c8', '#ff8fa3'][i], -9.3 + i * 0.2, 0.77, -4.6, false, 0.2, 0.008);
  sign(signs.pantry || 'BẾP CÔ TƯ', '#ffe9a0', -9.3, 2.45, -7.88, 0, 2.6);
  sign('BẾP →', '#ffe9a0', -5.9, 2.55, -3.15, PI / 2, 0.9);

  // ================= WORKSHOP (north centre) =================
  // plastic strip curtain on the doorway
  for (let i = 0; i < 9; i++) plane(0.24, 2.25, new THREE.MeshBasicMaterial({ color: '#dff3ff', transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }), -0.98 + i * 0.245, 1.15, -2.5, 0);
  sign('XƯỞNG · ĐI DÉP · ĐỘI MŨ', '#ffd3b8', 0, 2.7, -2.4, 0, 2.4);
  // drying racks
  const rack = (cx, cz) => {
    for (const dx of [-1.0, 1.0]) for (const dz of [-0.4, 0.4]) box(0.05, 1.9, 0.05, '#b0b8c6', cx + dx, 0, cz + dz, false, 0, 0.008);
    for (let k = 0; k < 5; k++) {
      box(2.1, 0.03, 0.85, '#d9dee6', cx, 0.3 + k * 0.33, cz, false, 0, 0.008);
      for (let s = 0; s < 8; s++) box(0.12, 0.025, 0.65, ['#a0522d', '#8b3a1a', '#c0703a'][(s + k) % 3], cx - 0.85 + s * 0.24, 0.33 + k * 0.33, cz, false, 0, 0);
    }
    collideRect(cx - 1.05, cx + 1.05, cz - 0.45, cz + 0.45);
  };
  rack(-4.4, -6.7); rack(-2.0, -6.7);
  sign('GIÀN PHƠI · đừng ăn vụng', '#fff1b8', -3.2, 2.3, -7.9, 0, 2.4);
  // dryers
  for (const x of [0.6, 1.8]) {
    box(0.95, 1.6, 0.8, '#cfd6e6', x, 0, -7.4, true);
    for (let i = 0; i < 5; i++) box(0.8, 0.03, 0.02, '#ff9f7a', x, 0.3 + i * 0.25, -6.99, false, 0, 0);
    sphere(0.06, glow('#7dfc8a'), x + 0.35, 1.45, -6.98, 0);
  }
  sign('MÁY SẤY #1 · #2', '#ffe9a0', 1.2, 1.95, -6.97, 0, 1.6);
  // packing table with bags and a tape gun
  box(2.4, 0.85, 0.8, '#c9d1dc', -3.0, 0, -3.7, true); box(2.5, 0.05, 0.9, '#eef2f6', -3.0, 0.85, -3.7, false);
  for (let i = 0; i < 7; i++) box(0.2, 0.28, 0.05, ['#ff9f7a', C.gold, '#9ee8c8', '#ff8fa3'][i % 4], -4.0 + i * 0.32, 0.9, -3.75 + (i % 2) * 0.2, false, 0.2, 0.01);
  box(0.36, 0.1, 0.36, '#ffffff', -2.0, 0.9, -3.7, false);
  // high louvre windows on the north wall
  for (const x of [-4, 0, 4]) { box(1.6, 0.6, 0.05, '#bfe3ff', x, 2.35, -7.9, false, 0, 0.015); for (let i = 0; i < 4; i++) box(1.6, 0.04, 0.08, '#ffffff', x, 2.4 + i * 0.14, -7.88, false, 0, 0); }
  // livestream corner
  const desks = th.desks || {};
  const live = textTexture(['🔴 LIVE 20:00', 'KHÔ GÀ BA & MÁ', 'Chốt đơn · Freeship'], { w: 768, h: 512, bg: '#ff4d4d', fg: '#ffffff', sizes: [96, 70, 48], weights: [900, 900, 700] });
  box(2.4, 2.0, 0.06, '#ffffff', 4.4, 0.3, -7.88, false);
  plane(2.3, 1.55, basic(live), 4.4, 1.4, -7.84, 0);
  box(1.4, 0.8, 0.5, '#ffffff', 4.4, 0, -7.5, true);
  for (let i = 0; i < 6; i++) box(0.22, 0.3, 0.06, [C.gold, '#ff9f7a', '#9ee8c8'][i % 3], 3.9 + (i % 3) * 0.5, 0.8, -7.5 + Math.floor(i / 3) * 0.15, false, 0, 0.01);
  cyl(0.02, 0.02, 1.4, '#333344', 4.4, 0, -5.6, 8, 0.008);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 10, 30), glow('#fffbe0')); ring.position.set(4.4, 1.5, -5.6); K.root.add(ring);
  box(0.08, 0.14, 0.01, '#ff8fa3', 4.4, 1.43, -5.62, false, 0, 0.006);
  K.collideCircle(4.4, -5.6, 0.15);
  if (desks.c1 && desks.c1[1]) poster(desks.c1[1], { w: 256, h: 160, bg: desks.c1[2] || '#ff7a6b', fg: '#ffffff', sizes: [30, 22], radius: 12 }, 3.4, 1.15, -7.25, 0, 0.5, 0.31);
  // Khoa's tech desk + label printer
  desk(3.6, -3.6, -1, { plate: (desks.it && desks.it[0]) || 'Khoa · IT + live', screen: [['OBS Studio', '● REC 02:14:55'], '#2b2f3a'], chair: '#bfe3ff', top: '#f2d2a9', leg: C.woodDark });
  box(0.6, 0.8, 0.5, '#ffffff', 2.2, 0, -3.55, true); box(0.6, 0.25, 0.5, '#e3d9ff', 2.2, 0.8, -3.55, false);
  box(0.3, 0.02, 0.2, '#ffffff', 2.2, 1.05, -3.35, false, 0, 0.006);
  interact('printer', L('printer', 'Dùng máy in tem nhãn'), 2.2, 0.9, -3.2);

  // ================= STORE (north-east) =================
  for (let i = 0; i < 8; i++) {
    const x = 7.4 + (i % 4) * 1.25, z = -7.2 + Math.floor(i / 4) * 1.5;
    for (let k = 0; k < 3; k++) box(1.0, 0.45, 0.7, k % 2 ? '#e8c39a' : '#d9a273', x, k * 0.45, z, k === 0, 0, 0.015);
  }
  sign('KHÔ GÀ · KHÔ BÒ · XOÀI SẤY', '#ffe9a0', 9.0, 2.3, -7.88, 0, 3.0);
  box(0.5, 1.8, 2.4, '#9aa3ad', 11.6, 0, -4.2, true);
  for (let s = 0; s < 3; s++) for (let i = 0; i < 5; i++) box(0.2, 0.25, 0.3, ['#ff9f7a', C.gold, '#9ee8c8'][(s + i) % 3], 11.45, 0.4 + s * 0.5, -5.1 + i * 0.45, false, 0, 0.008);
  poster(['HẠN DÙNG:', 'XEM TRÊN BAO BÌ'], { w: 512, h: 256, bg: '#ffc8dd', sizes: [48, 40] }, 11.33, 2.2, -4.2, -PI / 2, 1.2, 0.6);
  sign('KHO THÀNH PHẨM →', '#e8a87c', 5.9, 2.6, -3.7, -PI / 2, 1.5);

  // ================= LIVING ROOM = MEETING ROOM (east) =================
  // wooden sofa set (bộ trường kỷ) around a low table
  box(0.75, 0.45, 2.4, C.woodDark, 11.45, 0, 0.8, true);
  box(0.12, 0.6, 2.4, C.woodDark, 11.82, 0.45, 0.8, false);
  for (const z of [-0.4, 2.0]) box(0.75, 0.25, 0.1, C.woodDark, 11.45, 0.45, z, false);
  for (const [z, back] of [[-0.75, -0.3], [2.35, 0.3]]) { box(0.7, 0.45, 0.7, C.woodDark, 9.6, 0, z, true); box(0.7, 0.6, 0.1, C.woodDark, 9.6, 0.45, z + back, false); }
  box(1.4, 0.42, 1.0, C.wood, 9.6, 0, 0.8, true); box(1.5, 0.05, 1.1, '#e8c39a', 9.6, 0.42, 0.8, false);
  cyl(0.18, 0.15, 0.08, '#ffffff', 9.4, 0.47, 0.8); for (let i = 0; i < 5; i++) sphere(0.05, ['#ff9f1c', '#e74c3c', '#2ecc71'][i % 3], 9.35 + (i % 3) * 0.06, 0.58, 0.75 + Math.floor(i / 3) * 0.08, 0.006);
  cyl(0.09, 0.08, 0.12, '#c98f6a', 9.9, 0.47, 0.8);
  stool(8.2, 0.8, '#d35400', 0.42);
  interact('interview', L('interview', 'Ngồi xuống ghế đẩu ở phòng khách'), 8.2, 0.8, 0.8);
  // ancestral altar shelf high on the north wall
  box(1.8, 0.08, 0.5, C.red, 9.6, 1.9, -2.15, false, 0, 0.02);
  box(1.8, 0.35, 0.06, C.gold, 9.6, 1.55, -2.38, false, 0, 0.012);
  for (let i = 0; i < 2; i++) box(0.28, 0.36, 0.04, '#5d4037', 9.2 + i * 0.8, 1.98, -2.3, false, 0, 0.01);
  cyl(0.08, 0.08, 0.1, C.gold, 9.6, 1.98, -2.2); sphere(0.06, '#ff7a00', 9.4, 2.04, -2.15, 0.006); sphere(0.06, '#ff7a00', 9.8, 2.04, -2.15, 0.006);
  for (const x of [8.75, 10.45]) { const c = sphere(0.05, glow('#ff4d4d'), x, 2.05, -2.15, 0); K.animated.push((t) => { c.scale.setScalar(1 + Math.sin(t * 3 + x) * 0.15); }); }
  // family photos on the south wall
  for (let i = 0; i < 4; i++) box(0.5, 0.4, 0.04, ['#ffe3b0', '#bfe3ff', '#ffc8dd', '#d6f5e8'][i], 7.6 + i * 0.9, 1.4 + (i % 2) * 0.25, 3.9, false, 0, 0.012);
  poster(['CHÚC MỪNG', 'NĂM MỚI'], { w: 512, h: 256, bg: C.red, fg: C.gold, sizes: [56, 56] }, 11.9, 2.0, 2.6, -PI / 2, 1.0, 0.5);
  sign(signs.meeting || 'PHÒNG HỌP GIA ĐÌNH', '#f5b37a', 6.1, 2.75, 0.8, PI / 2, 1.8);
  sign(signs.meeting || 'PHÒNG HỌP GIA ĐÌNH', '#f5b37a', 5.9, 2.75, 0.8, -PI / 2, 1.8);
  ceilingFan(9.4, 0.8, H, '#c98f5a');
  plant(6.6, 3.5, { s: 0.9, pot: '#8b5a3c', leaf: '#4f8a4f' });

  K.lights({ sky: '#fff1dc', ground: '#ffd9b0', hemi: 1.55, amb: 0.5, sun: 1.0 });

  return K.result({
    spots: S,
    bounds: { minX: -11.7, maxX: 11.7, minZ: -7.7, maxZ: 7.75 },
    playerStart: [0, 7.2, 0],
    meetingSeat: [8.2, 0.8, -PI / 2],
    catPath: [[0, 3.0], [3.6, 3.0], [4.2, 5.0], [-1.0, 6.4], [-5.0, 3.4], [-4.4, -1.5], [0.2, -1.5], [3.8, -1.2]],
  });
}
