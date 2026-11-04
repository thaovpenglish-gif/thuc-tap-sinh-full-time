// 3D office for "Thực Tập Sinh" built entirely from primitives + canvas textures.
import * as THREE from 'three';

// Named spots: [x, z, rotY]  (rotY 0 = facing +z / south, PI = facing north)
export const SPOTS = {
  reception: [-4, 5.3, 0],
  bay: [7.6, 8.4, Math.PI],
  phat: [-11, -8.5, 0],
  hang: [11, -8.5, 0],
  tu: [13.1, 1.2, -Math.PI / 2],
  khoa: [5, -3.25, 0],
  tuan: [2.4, 3.15, 0],
  mai: [-4.2, -2.6, 0],
  dung: [-2.2, -2.6, 0],
  ngan: [-2.2, 1.65, Math.PI],
  window: [0.5, -9.1, Math.PI],
  pantry2: [10.8, 3.6, Math.PI / 2],
  m_head: [-14.2, 0.5, Math.PI / 2],
  m_n1: [-13, -0.85, 0], m_n2: [-12, -0.85, 0], m_n3: [-11, -0.85, 0], m_n4: [-10, -0.85, 0], m_n5: [-9, -0.85, 0],
  m_s1: [-13, 1.85, Math.PI], m_s2: [-12, 1.85, Math.PI], m_s3: [-11, 1.85, Math.PI], m_s4: [-10, 1.85, Math.PI], m_s5: [-9, 1.85, Math.PI],
};
export const PLAYER_START = [0, 8.6, 0]; // x, z, yaw (yaw 0 looks north)
export const MEETING_SEAT = [-11, 1.85];

const loader = { tex: {} };

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function textTexture(lines, { w = 512, h = 256, bg = '#ffffff', fg = '#1b2a4a', font = 'Be Vietnam Pro, Arial, sans-serif', sizes = [], weights = [], align = 'center', pad = 24, border = null } = {}) {
  return canvasTex(w, h, (g) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    if (border) { g.strokeStyle = border; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); }
    g.fillStyle = fg; g.textAlign = align; g.textBaseline = 'middle';
    const n = lines.length;
    const total = lines.reduce((a, _, i) => a + (sizes[i] || 40) * 1.25, 0);
    let y = h / 2 - total / 2;
    lines.forEach((ln, i) => {
      const sz = sizes[i] || 40;
      g.font = `${weights[i] || 700} ${sz}px ${font}`;
      y += sz * 0.625;
      const x = align === 'left' ? pad : align === 'right' ? w - pad : w / 2;
      g.fillText(ln, x, y, w - pad * 2);
      y += sz * 0.625;
    });
    void n;
  });
}

const M = (color, opts = {}) => new THREE.MeshLambertMaterial({ color, ...opts });

export function buildWorld(scene) {
  const colliders = [];
  const interactables = [];
  const animated = [];

  const root = new THREE.Group();
  scene.add(root);

  function box(w, h, d, mat, x, y, z, collide = false, ry = 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof mat === 'string' ? M(mat) : mat);
    m.position.set(x, y + h / 2, z);
    m.rotation.y = ry;
    root.add(m);
    if (collide) {
      const hw = (Math.abs(Math.cos(ry)) * w + Math.abs(Math.sin(ry)) * d) / 2;
      const hd = (Math.abs(Math.sin(ry)) * w + Math.abs(Math.cos(ry)) * d) / 2;
      colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    }
    return m;
  }
  function cyl(rt, rb, h, mat, x, y, z, seg = 16) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), typeof mat === 'string' ? M(mat) : mat);
    m.position.set(x, y + h / 2, z);
    root.add(m);
    return m;
  }
  function sphere(r, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), typeof mat === 'string' ? M(mat) : mat);
    m.position.set(x, y, z);
    root.add(m);
    return m;
  }
  function plane(w, h, mat, x, y, z, ry = 0) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    m.rotation.y = ry;
    root.add(m);
    return m;
  }
  function collideRect(minX, maxX, minZ, maxZ) { colliders.push({ minX, maxX, minZ, maxZ }); }

  // ---------- materials ----------
  const wallMat = M('#efe9df');
  const wallAccent = M('#d9cdb8');
  const wood = M('#9a6b43');
  const woodDark = M('#5e3d24');
  const deskTop = M('#d8c3a0');
  const metal = M('#8a9099');
  const black = M('#22252a');
  const glassMat = new THREE.MeshLambertMaterial({ color: '#bfe3f0', transparent: true, opacity: 0.22, depthWrite: false });
  const frameMat = M('#6d7480');
  const red = M('#c0262d');
  const gold = M('#e2b43b', { emissive: '#3a2a00' });
  const plantGreen = M('#3f8a46');
  const potMat = M('#b8643c');

  // ---------- floor & ceiling ----------
  const floorTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#b9b2a6'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      g.fillStyle = (i + j) % 2 ? '#b3ab9e' : '#beb7ab';
      g.fillRect(i * 128 + 2, j * 128 + 2, 124, 124);
    }
    for (let k = 0; k < 2500; k++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(15, 10);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshLambertMaterial({ map: floorTex }));
  floor.rotation.x = -Math.PI / 2;
  root.add(floor);
  // red carpet runner from the door (very "company opening ceremony")
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 6), M('#9c2a2a'));
  runner.rotation.x = -Math.PI / 2; runner.position.set(0, 0.005, 6.8); root.add(runner);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshBasicMaterial({ color: '#e9e6df' }));
  ceil.rotation.x = Math.PI / 2; ceil.position.y = 3; root.add(ceil);
  const panelMat = new THREE.MeshBasicMaterial({ color: '#fffbea' });
  for (let x = -12; x <= 12; x += 4) for (let z = -8; z <= 8; z += 4) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), panelMat);
    p.rotation.x = Math.PI / 2; p.position.set(x, 2.99, z); root.add(p);
  }

  // ---------- outer walls ----------
  const H = 3, T = 0.2;
  // south wall with door gap x[-1.5,1.5]
  box(13.5, H, T, wallMat, -8.25, 0, 10, true);
  box(13.5, H, T, wallMat, 8.25, 0, 10, true);
  box(3, 0.6, T, wallMat, 0, 2.4, 10, false);
  // glass door frame
  const doorGlass = plane(3, 2.4, glassMat, 0, 1.2, 10.05, 0); void doorGlass;
  collideRect(-1.5, 1.5, 10.05, 10.6);
  // east / west
  box(T, H, 20, wallMat, 15, 0, 0, true);
  box(T, H, 20, wallMat, -15, 0, 0, true);
  // north wall with big window x[-7,7]
  box(8, H, T, wallMat, -11, 0, -10, true);
  box(8, H, T, wallMat, 11, 0, -10, true);
  box(14, 0.9, T, wallAccent, 0, 0, -10, true);
  box(14, 0.4, T, wallMat, 0, 2.6, -10, false);
  plane(14, 1.7, glassMat, 0, 1.75, -10.0, 0);
  for (let x = -7; x <= 7; x += 2) box(0.06, 1.7, 0.1, frameMat, x, 0.9, -10, false);
  // skyline outside
  const skyTex = canvasTex(2048, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#7ec3f0'); grd.addColorStop(0.7, '#cfe8f6'); grd.addColorStop(1, '#f2e6cf');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    let x = 0;
    while (x < w) {
      const bw = 60 + Math.random() * 140, bh = 120 + Math.random() * 330;
      const shade = 150 + Math.floor(Math.random() * 60);
      g.fillStyle = `rgb(${shade - 30},${shade - 20},${shade})`;
      g.fillRect(x, h - bh, bw, bh);
      g.fillStyle = 'rgba(255,255,240,0.55)';
      for (let wy = h - bh + 12; wy < h - 10; wy += 22) for (let wx = x + 8; wx < x + bw - 12; wx += 18) if (Math.random() > 0.35) g.fillRect(wx, wy, 9, 12);
      x += bw + 4 + Math.random() * 20;
    }
    // a giant billboard, because Vietnam
    g.fillStyle = '#c0262d'; g.fillRect(1300, 150, 360, 120);
    g.fillStyle = '#ffe08a'; g.font = '900 54px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText('NỒI CƠM ĐIỆN', 1480, 220);
  });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(40, 10), new THREE.MeshBasicMaterial({ map: skyTex }));
  sky.position.set(0, 1.5, -16); root.add(sky);

  // ---------- Director room (NW): x[-15,-7], z[-10,-4], glass ----------
  function glassWall(x1, z1, x2, z2) {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    const ry = Math.abs(x2 - x1) > Math.abs(z2 - z1) ? 0 : Math.PI / 2;
    plane(len, 2.6, glassMat, cx, 1.3, cz, ry);
    box(ry ? 0.08 : len, 0.08, ry ? len : 0.08, frameMat, cx, 2.6, cz, false);
    box(ry ? 0.08 : len, 0.12, ry ? len : 0.08, frameMat, cx, 0, cz, false);
    if (ry) collideRect(cx - 0.08, cx + 0.08, Math.min(z1, z2), Math.max(z1, z2));
    else collideRect(Math.min(x1, x2), Math.max(x1, x2), cz - 0.08, cz + 0.08);
    box(0.08, 2.6, 0.08, frameMat, x1, 0, z1, false);
    box(0.08, 2.6, 0.08, frameMat, x2, 0, z2, false);
  }
  glassWall(-7, -10, -7, -6.2);
  glassWall(-7, -4.8, -7, -4);
  box(8, H, T, wallMat, -11, 0, -4, true); // shared wall with meeting room
  box(0.08, 0.4, 1.4, frameMat, -7, 2.6, -5.5, false);
  // director desk
  box(2.4, 0.76, 1.0, woodDark, -11, 0, -7.4, true);
  box(2.5, 0.05, 1.1, wood, -11, 0.76, -7.4, false);
  box(0.6, 1.2, 0.6, M('#3b2a22'), -11, 0, -8.9, false); // leather chair back
  // tea set
  cyl(0.1, 0.08, 0.1, M('#7a4a2a'), -11.5, 0.81, -7.3);
  for (let i = 0; i < 3; i++) cyl(0.04, 0.03, 0.05, M('#f0e6d6'), -11.2 + i * 0.12, 0.81, -7.1);
  // calligraphy
  const nhan = textTexture(['Nhẫn'], { w: 256, h: 512, bg: '#f4e7c8', fg: '#2b1b14', sizes: [150], border: '#7a4a2a', font: 'serif' });
  plane(0.8, 1.6, new THREE.MeshLambertMaterial({ map: nhan }), -11, 1.7, -9.88, 0);
  // withered money tree
  cyl(0.22, 0.18, 0.4, potMat, -8, 0, -9.2);
  for (let i = 0; i < 6; i++) sphere(0.16, M('#a49a3a'), -8 + Math.cos(i) * 0.15, 0.6 + i * 0.12, -9.2 + Math.sin(i) * 0.15);
  interactables.push({ id: 'plant', label: 'Xem cây kim tiền', pos: new THREE.Vector3(-8, 1, -9.2) });
  const signGD = textTexture(['GIÁM ĐỐC'], { w: 512, h: 128, bg: '#1b2a4a', fg: '#e8c35a', sizes: [60] });
  plane(1.2, 0.3, new THREE.MeshBasicMaterial({ map: signGD }), -6.92, 2.3, -5.5, Math.PI / 2);

  // ---------- Accounting room (NE): x[7,15], z[-10,-4], solid ----------
  box(T, H, 6, wallMat, 7, 0, -7, true);
  box(1, H, T, wallMat, 7.5, 0, -4, true);
  box(5.5, H, T, wallMat, 12.25, 0, -4, true);
  box(1.5, 0.6, T, wallMat, 8.75, 2.4, -4, false);
  box(2.2, 0.76, 1.0, M('#7d6a55'), 11, 0, -7.4, true);
  box(2.3, 0.05, 1.1, deskTop, 11, 0.76, -7.4, false);
  // ledger books
  for (let i = 0; i < 4; i++) box(0.3, 0.05, 0.22, M(['#b3242b', '#1b5fa8', '#2f7a3a', '#333'][i]), 10.4 + i * 0.05, 0.81 + i * 0.05, -7.2, false);
  // filing cabinets
  for (let i = 0; i < 3; i++) box(0.6, 1.4, 0.6, metal, 8.2 + i * 0.7, 0, -9.5, true);
  // safe
  box(0.8, 1.0, 0.7, M('#3a3d42'), 13.6, 0, -9.2, true);
  cyl(0.12, 0.12, 0.04, M('#c9c9c9'), 13.6, 0.55, -8.83).rotation.x = Math.PI / 2;
  const talisman = textTexture(['PHÁT'], { w: 128, h: 256, bg: '#e8c35a', fg: '#b3242b', sizes: [44] });
  plane(0.18, 0.36, new THREE.MeshBasicMaterial({ map: talisman }), 13.85, 0.75, -8.84, 0);
  interactables.push({ id: 'safe', label: 'Nhìn két sắt', pos: new THREE.Vector3(13.6, 0.8, -8.8) });
  const signKT = textTexture(['KẾ TOÁN'], { w: 512, h: 128, bg: '#1b2a4a', fg: '#e8c35a', sizes: [60] });
  plane(1.2, 0.3, new THREE.MeshBasicMaterial({ map: signKT }), 8.75, 2.25, -3.88, 0);
  // banner on accounting wall facing the open office
  const banner = textTexture(['CÔNG TY LÀ NHÀ  ·  NHÀ LÀ CÔNG TY'], { w: 1024, h: 128, bg: '#c0262d', fg: '#ffe08a', sizes: [58], weights: [900] });
  plane(4.6, 0.58, new THREE.MeshBasicMaterial({ map: banner }), 12.3, 2.35, -3.88, 0);

  // ---------- Meeting room (W): x[-15,-7], z[-4,5], glass ----------
  glassWall(-7, -4, -7, 1);
  glassWall(-7, 2.6, -7, 5);
  box(0.08, 0.4, 1.6, frameMat, -7, 2.6, 1.8, false);
  box(8, H, T, wallMat, -11, 0, 5, true);
  box(5.2, 0.74, 1.5, wood, -11, 0, 0.5, true);
  box(5.3, 0.05, 1.6, M('#b3825a'), -11, 0.74, 0.5, false);
  const chairMat = M('#2f3a4f');
  for (let i = 0; i < 5; i++) {
    const x = -13 + i;
    box(0.45, 0.45, 0.45, chairMat, x, 0, -1.25, false); box(0.45, 0.5, 0.06, chairMat, x, 0.45, -1.47, false);
    box(0.45, 0.45, 0.45, chairMat, x, 0, 2.25, false); box(0.45, 0.5, 0.06, chairMat, x, 0.45, 2.47, false);
  }
  // xôi gấc on the table
  for (let i = 0; i < 4; i++) { cyl(0.16, 0.14, 0.03, M('#f5f5f5'), -12.5 + i, 0.79, 0.5); sphere(0.11, M('#d2402a'), -12.5 + i, 0.86, 0.5); }
  // TV
  box(2, 1.1, 0.06, black, -11, 1.2, 4.85, false);
  const tvTex = textTexture(['HỌP GIA ĐÌNH MỞ RỘNG', 'Tháng 11 · Phát Đạt Lộc'], { w: 1024, h: 560, bg: '#1b2a4a', fg: '#ffffff', sizes: [70, 44], weights: [900, 500] });
  plane(1.9, 1.0, new THREE.MeshBasicMaterial({ map: tvTex }), -11, 1.75, 4.81, Math.PI);
  interactables.push({ id: 'seat', label: 'Ngồi vào ghế trống', pos: new THREE.Vector3(-11, 0.8, 2.2) });
  const signMR = textTexture(['PHÒNG HỌP'], { w: 512, h: 128, bg: '#1b2a4a', fg: '#e8c35a', sizes: [60] });
  plane(1.2, 0.3, new THREE.MeshBasicMaterial({ map: signMR }), -6.92, 2.3, 1.8, Math.PI / 2);

  // ---------- Reception ----------
  box(3.4, 1.05, 0.7, M('#7a1f24'), -4, 0, 6.4, true);
  box(3.5, 0.06, 0.8, M('#e7d8b8'), -4, 1.05, 6.4, false);
  box(4.4, 2.6, 0.2, M('#1b2a4a'), -4, 0, 4.4, true);
  const logo = textTexture(['PHÁT ĐẠT LỘC', 'Uy tín · Chất lượng · Như một gia đình', 'Since 2002'], { w: 1024, h: 512, bg: '#1b2a4a', fg: '#e8c35a', sizes: [120, 40, 32], weights: [900, 500, 400] });
  plane(4.2, 2.1, new THREE.MeshBasicMaterial({ map: logo }), -4, 1.6, 4.51, 0);
  // bell & guestbook
  cyl(0.06, 0.08, 0.06, gold, -3.2, 1.11, 6.3);
  box(0.35, 0.03, 0.25, M('#f0eadc'), -4.6, 1.11, 6.3, false);

  // ---------- Altar (Thần Tài) near entrance ----------
  box(1.0, 0.7, 0.55, red, 4, 0, 9.5, true);
  box(1.1, 0.06, 0.62, gold, 4, 0.7, 9.5, false);
  box(1.0, 0.6, 0.05, M('#8f1a20'), 4, 0.76, 9.78, false);
  sphere(0.11, gold, 3.75, 0.88, 9.55); cyl(0.09, 0.12, 0.14, gold, 3.75, 0.76, 9.55);
  sphere(0.11, gold, 4.25, 0.88, 9.55); cyl(0.09, 0.12, 0.14, gold, 4.25, 0.76, 9.55);
  cyl(0.07, 0.07, 0.08, M('#b38a3a'), 4, 0.76, 9.35);
  const incense = [];
  for (let i = 0; i < 3; i++) { const s = cyl(0.005, 0.005, 0.28, M('#d24a2a'), 3.97 + i * 0.03, 0.84, 9.35); incense.push(s); }
  for (let i = 0; i < 5; i++) sphere(0.05, M(['#e2a32a', '#c63a2a', '#4f9a3a', '#e2a32a', '#c63a2a'][i]), 3.6 + i * 0.2, 0.8, 9.3);
  const altarLamp = new THREE.PointLight('#ff4a3a', 0.8, 3);
  altarLamp.position.set(4, 1.2, 9.2); root.add(altarLamp);
  const bulbs = [];
  for (let i = 0; i < 6; i++) { const b = sphere(0.025, new THREE.MeshBasicMaterial({ color: '#ff3b3b' }), 3.55 + i * 0.18, 1.38, 9.74); bulbs.push(b); }
  animated.push((t) => { bulbs.forEach((b, i) => b.material.color.set(((Math.floor(t * 3) + i) % 2) ? '#ff3b3b' : '#ffd54a')); });
  interactables.push({ id: 'altar', label: 'Thắp hương Thần Tài', pos: new THREE.Vector3(4, 0.9, 9.3) });

  // ---------- Chú Bảy's corner: motorbike + stool ----------
  const bike = new THREE.Group();
  const wheelMat = M('#1a1a1a');
  const w1 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 8, 20), wheelMat); w1.position.set(0, 0.32, 0.6);
  const w2 = w1.clone(); w2.position.z = -0.6;
  w1.rotation.y = w2.rotation.y = Math.PI / 2;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 1.0), M('#1b4fa8')); body.position.set(0, 0.62, 0);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.6), M('#111')); seat.position.set(0, 0.85, -0.15);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.05), metal); bar.position.set(0, 1.0, 0.5);
  bike.add(w1, w2, body, seat, bar); bike.position.set(9.3, 0, 8.3); root.add(bike);
  collideRect(9.0, 9.6, 7.5, 9.1);
  cyl(0.18, 0.2, 0.4, M('#d9302e'), 7.6, 0, 8.9);
  box(0.4, 0.7, 0.4, M('#3d6db0'), 6.6, 0, 9.5, true); // water cooler
  cyl(0.14, 0.14, 0.4, M('#9fd0f0', { transparent: true, opacity: 0.7 }), 6.6, 0.7, 9.5);

  // ---------- Open office desks ----------
  const monitorTex = (lines, bg) => textTexture(lines, { w: 256, h: 160, bg, fg: '#ffffff', sizes: [26, 20], weights: [700, 400] });
  function desk(x, z, facing, nameplate, screen) { // facing: +1 = person sits on +z side looking -z
    box(1.5, 0.05, 0.75, deskTop, x, 0.72, z, false);
    box(0.05, 0.72, 0.7, metal, x - 0.7, 0, z, false);
    box(0.05, 0.72, 0.7, metal, x + 0.7, 0, z, false);
    collideRect(x - 0.75, x + 0.75, z - 0.38, z + 0.38);
    const mz = z - facing * 0.2;
    box(0.06, 0.25, 0.06, black, x, 0.77, mz, false);
    const mon = box(0.62, 0.38, 0.03, black, x, 0.98, mz, false); void mon;
    if (screen) plane(0.58, 0.34, new THREE.MeshBasicMaterial({ map: monitorTex(screen[0], screen[1]) }), x, 1.17, mz + facing * 0.02, facing > 0 ? 0 : Math.PI);
    box(0.45, 0.02, 0.15, M('#30343b'), x, 0.77, z + facing * 0.1, false);
    // chair
    const cz = z + facing * 0.7;
    box(0.48, 0.08, 0.48, M('#2f3a4f'), x, 0.45, cz, false);
    box(0.48, 0.55, 0.06, M('#2f3a4f'), x, 0.5, cz + facing * 0.24, false);
    cyl(0.03, 0.03, 0.45, metal, x, 0, cz);
    if (nameplate) {
      const np = textTexture([nameplate], { w: 256, h: 64, bg: '#ffffff', fg: '#1b2a4a', sizes: [30] });
      plane(0.3, 0.075, new THREE.MeshBasicMaterial({ map: np }), x + 0.45, 0.8, z + facing * 0.37, facing > 0 ? 0 : Math.PI);
    }
  }
  // cluster: north side people face south (facing=-1 means they sit on -z side, looking +z)
  desk(-4.2, -1.65, -1, 'Mai · Sales', [['SALE 50%', 'Collagen nội bộ'], '#e8932a']);
  desk(-2.2, -1.65, -1, 'Dũng · TP KD', [['Excel', 'DS_KhachHang_FINAL'], '#1f7a46']);
  desk(-4.2, 0.85, 1, 'TTS · Bạn', [['Win 7', 'Pin: 11 phút'], '#2a5ea8']);
  desk(-2.2, 0.85, 1, 'TTS · Ngân', [['moodboard', 'Figma'], '#6b4fd8']);
  box(4.1, 0.35, 0.05, M('#c7cdd6'), -3.2, 0.74, -0.4, false); // divider
  interactables.push({ id: 'desk', label: 'Ngồi làm việc ở bàn mình', pos: new THREE.Vector3(-4.2, 0.8, 1.4) });

  // Khoa's IT corner
  desk(5, -2.4, -1, 'IT · Khoa', [['ping 8.8.8.8', 'Request timed out'], '#111111']);
  box(0.7, 2.0, 0.7, black, 6.4, 0, -3.9, true);
  const leds = [];
  for (let i = 0; i < 8; i++) { const l = box(0.04, 0.02, 0.01, new THREE.MeshBasicMaterial({ color: '#33ff66' }), 6.25 + (i % 4) * 0.1, 0.4 + Math.floor(i / 4) * 0.5 + 0.4, -3.54, false); leds.push(l); }
  animated.push((t) => leds.forEach((l, i) => { l.visible = Math.sin(t * (3 + i) + i) > -0.3; }));
  // printer
  box(0.6, 0.8, 0.5, M('#dcdcdc'), 6.4, 0, 4.8, true);
  box(0.6, 0.25, 0.5, M('#bdbdbd'), 6.4, 0.8, 4.8, false);
  interactables.push({ id: 'printer', label: 'Dùng máy in', pos: new THREE.Vector3(6.4, 0.9, 4.5) });

  // Tuấn's "innovation corner"
  box(1.2, 1.05, 0.6, M('#f2f2f2'), 2.4, 0, 3.95, true);
  box(0.5, 0.32, 0.03, black, 2.4, 1.05, 4.05, false);
  const wb = textTexture(['OKR Q4', '10X REVENUE', 'Digital Transformation', 'TikTok???', 'Bố: "để mẹ con quyết"'], { w: 768, h: 512, bg: '#fbfbf7', fg: '#1c64c4', sizes: [64, 50, 40, 40, 34], weights: [900, 800, 600, 600, 500], align: 'left', pad: 40 });
  box(2.0, 1.2, 0.05, M('#e6e6e6'), 4.3, 0.9, 4.6, true);
  plane(1.9, 1.1, new THREE.MeshBasicMaterial({ map: wb }), 4.3, 1.5, 4.57, Math.PI);
  sphere(0.45, M('#ff8c42'), 4.4, 0.3, 3.2); // beanbag
  interactables.push({ id: 'okr', label: 'Đọc bảng OKR', pos: new THREE.Vector3(4.3, 1.4, 4.4) });

  // ---------- Pantry (E): x[9,15], z[-2,5] ----------
  box(0.7, 0.9, 5.2, M('#e8e2d6'), 14.6, 0, 1.6, true);
  box(0.75, 0.05, 5.2, M('#7d7468'), 14.6, 0.9, 1.6, false);
  box(0.8, 1.9, 0.8, M('#e6ebef'), 14.5, 0, -1.6, true); // fridge
  cyl(0.18, 0.18, 0.25, M('#f6f6f6'), 14.6, 0.95, 0.4); // rice cooker
  box(0.35, 0.45, 0.35, M('#2b2b2b'), 14.6, 0.95, 3.6, false); // coffee machine
  interactables.push({ id: 'coffee', label: 'Pha cà phê gói', pos: new THREE.Vector3(14.4, 1.1, 3.6) });
  // dining table + plastic stools + THE red chair
  box(2.0, 0.72, 1.0, M('#e9e2d0'), 11.6, 0, 1.2, true);
  for (let i = 0; i < 3; i++) { cyl(0.17, 0.2, 0.42, M('#3d7fd6'), 10.9 + i * 0.7, 0, 0.35); cyl(0.17, 0.2, 0.42, M('#3d7fd6'), 10.9 + i * 0.7, 0, 2.05); }
  box(0.5, 0.45, 0.5, M('#d11f2a'), 10.2, 0, 1.2, false); box(0.06, 0.6, 0.5, M('#d11f2a'), 9.98, 0.45, 1.2, false);
  interactables.push({ id: 'redchair', label: 'Nhìn chiếc ghế đỏ', pos: new THREE.Vector3(10.2, 0.6, 1.2) });
  // pantry rice pot on the table
  cyl(0.2, 0.18, 0.18, metal, 11.6, 0.72, 1.2);
  const pantrySign = textTexture(['PANTRY · Góp 25k/bữa'], { w: 768, h: 128, bg: '#4f8f5a', fg: '#ffffff', sizes: [56] });
  plane(2.6, 0.43, new THREE.MeshBasicMaterial({ map: pantrySign }), 14.88, 2.35, 1.6, -Math.PI / 2);

  // ---------- decorations ----------
  function plant(x, z, s = 1) {
    cyl(0.2 * s, 0.16 * s, 0.4 * s, potMat, x, 0, z);
    for (let i = 0; i < 5; i++) sphere(0.22 * s, plantGreen, x + Math.cos(i * 1.3) * 0.12 * s, (0.6 + i * 0.12) * s, z + Math.sin(i * 1.3) * 0.12 * s);
    collideRect(x - 0.25, x + 0.25, z - 0.25, z + 0.25);
  }
  plant(-6.3, 9.3); plant(6.3, -9.3); plant(-6.3, -9.3); plant(1.5, 9.4, 0.8);
  // wall clock
  const clockTex = canvasTex(256, 256, (g) => {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill();
    g.strokeStyle = '#1b2a4a'; g.lineWidth = 10; g.stroke();
    g.fillStyle = '#1b2a4a'; g.font = '700 30px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(i, 128 + Math.sin(a) * 90, 128 - Math.cos(a) * 90); }
  });
  plane(0.6, 0.6, new THREE.MeshBasicMaterial({ map: clockTex, transparent: true }), 0, 2.45, 9.88, Math.PI);
  // cork board of company photos
  const board = textTexture(['TẾT 2015', 'Team building Vũng Tàu', 'Sinh nhật cô Hằng'], { w: 512, h: 320, bg: '#c49a63', fg: '#3b2414', sizes: [44, 30, 30] });
  plane(1.6, 1.0, new THREE.MeshLambertMaterial({ map: board }), -8, 1.6, 9.88, Math.PI);

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight('#fffaf0', '#d8cfbf', 1.25));
  scene.add(new THREE.AmbientLight('#ffffff', 0.35));
  const dir = new THREE.DirectionalLight('#fff4dd', 0.9);
  dir.position.set(-4, 8, -12); scene.add(dir);
  [[-10, -7], [10, -7], [-10, 1], [11, 1], [0, 0], [0, 7]].forEach(([x, z]) => {
    const p = new THREE.PointLight('#fff2d8', 0.35, 10); p.position.set(x, 2.7, z); scene.add(p);
  });

  return {
    colliders, interactables,
    update(t) { animated.forEach((f) => f(t)); incense.forEach((s, i) => { s.scale.y = 0.9 + Math.sin(t * 2 + i) * 0.03; }); },
  };
}

// ---------- People ----------
export function makePerson(def, { ghost = false } = {}) {
  const g = new THREE.Group();
  const op = ghost ? { transparent: true, opacity: 0.45, depthWrite: false } : {};
  const skin = M(def.skin || '#f0c8a0', op);
  const shirt = M(def.shirt || '#5577aa', op);
  const pants = M(def.pants || '#333', op);
  const hairM = M(def.hairColor || '#222', op);
  const shoe = M('#2a2420', op);

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.8, 0.16), pants); legL.position.set(-0.09, 0.4, 0);
  const legR = legL.clone(); legR.position.x = 0.09;
  const fL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.24), shoe); fL.position.set(-0.09, 0.04, 0.04);
  const fR = fL.clone(); fR.position.x = 0.09;
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.45, 4, 10), shirt); torso.position.y = 1.12; torso.scale.z = 0.7;
  const armGeo = new THREE.CapsuleGeometry(0.055, 0.5, 4, 8);
  const armL = new THREE.Mesh(armGeo, shirt); armL.position.set(-0.27, 1.12, 0);
  const armR = new THREE.Mesh(armGeo, shirt); armR.position.set(0.27, 1.12, 0);
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), skin); handL.position.set(0, -0.3, 0); armL.add(handL);
  const handR = handL.clone(); armR.add(handR);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.1, 8), skin); neck.position.y = 1.47;
  const head = new THREE.Group(); head.position.y = 1.62;
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 14), skin); skull.scale.set(1, 1.1, 1);
  head.add(skull);
  const eyeM = M('#1a1a1a', op);
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), eyeM); eL.position.set(-0.05, 0.02, 0.135);
  const eR = eL.clone(); eR.position.x = 0.05;
  head.add(eL, eR);
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.01, 0.01), M('#9a4a3a', op)); mouth.position.set(0, -0.06, 0.145);
  head.add(mouth);
  if (def.glasses) {
    const gm = M('#222', op);
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.007, 6, 14), gm); r1.position.set(-0.05, 0.02, 0.15);
    const r2 = r1.clone(); r2.position.x = 0.05;
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.006, 0.006), gm); br.position.set(0, 0.025, 0.152);
    head.add(r1, r2, br);
  }
  // hair styles
  const hs = def.hair || 'short';
  if (hs !== 'bald') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.158, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hairM);
    cap.position.y = 0.02; cap.rotation.x = -0.25; head.add(cap);
  } else {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 6, 16, Math.PI * 1.3), hairM);
    ring.rotation.x = Math.PI / 2; ring.rotation.z = Math.PI * 0.85; ring.position.y = -0.01; head.add(ring);
  }
  if (hs === 'long') {
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.42, 0.1), hairM); back.position.set(0, -0.12, -0.11); head.add(back);
  } else if (hs === 'bun') {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), hairM); bun.position.set(0, 0.1, -0.15); head.add(bun);
  } else if (hs === 'pony') {
    const pony = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.22, 4, 8), hairM); pony.position.set(0, -0.05, -0.18); pony.rotation.x = 0.4; head.add(pony);
  } else if (hs === 'quiff') {
    const q = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.12), hairM); q.position.set(0, 0.16, 0.06); q.rotation.x = -0.3; head.add(q);
  } else if (hs === 'side') {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.2), hairM); s.position.set(0.02, 0.13, 0.02); s.rotation.z = 0.15; head.add(s);
  } else if (hs === 'cap') {
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.14), hairM); brim.position.set(0, 0.08, 0.17); head.add(brim);
  }
  if (def.tie) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.02), M(def.tie, op)); tie.position.set(0, 1.25, 0.145); g.add(tie);
  }
  g.add(legL, legR, fL, fR, torso, armL, armR, neck, head);
  g.userData.parts = { legL, legR, armL, armR, head, torso };
  return g;
}

export function nameTag(title, subtitle, { color = '#1b2a4a', ghost = false } = {}) {
  const tex = canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = ghost ? 'rgba(80,140,255,0.85)' : 'rgba(255,255,255,0.92)';
    const r = 26; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, r); g.fill();
    g.fillStyle = ghost ? '#fff' : color; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '800 48px Be Vietnam Pro, Arial, sans-serif';
    g.fillText(title, w / 2, subtitle ? 46 : h / 2, w - 30);
    if (subtitle) { g.font = '500 28px Be Vietnam Pro, Arial, sans-serif'; g.fillStyle = ghost ? '#e8f0ff' : '#5a6475'; g.fillText(subtitle, w / 2, 94, w - 30); }
  });
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: true, transparent: true }));
  sp.scale.set(1.0, 0.25, 1);
  sp.position.y = 2.05;
  return sp;
}

export function makeMarker() {
  const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), new THREE.MeshBasicMaterial({ color: '#ffc531' }));
  m.scale.y = 1.6;
  return m;
}
