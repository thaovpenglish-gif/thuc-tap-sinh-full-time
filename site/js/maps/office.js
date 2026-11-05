// Office map for Solo (first person). One layout, themed per company (signs, nameplates, palette, props).
// Spots are named slots; T&M cast ids are kept as slot names, generic aliases are added below (boss, n1…n6, c1…c3…).
import * as THREE from 'three';
import { INK, T, outline, canvasTex, roundRect, textTexture, gradientMap } from '../art/kit.js';
import { PROP_SLOTS } from './slots.js';
export { SPOTS, SLOT_HELP, PROP_SLOTS, CAT_PATH, PLAYER_START, MEETING_SEAT, PLAYER_DESK, INTERACTABLE_IDS } from './slots.js';

// T&M theme = the original office. Other companies override any of these fields.
export const DEFAULT_THEME = {
  logo: ['T&M PARTNERS', 'Strategy & Management Consulting', '"We deliver excellence. Eventually."'],
  skyline: 'WE DELIVER EXCELLENCE', bossWall: 'Excellence', banner: 'EXCELLENCE  ·  EVENTUALLY',
  signs: { boss: 'CHAIRPERSON', finance: 'FINANCE', meeting: 'PHÒNG HỌP', standup: 'DAILY STAND-UP · 9:00 · 15 PHÚT (*)', pantry: 'PANTRY · Góp 25k/bữa' },
  desks: {
    c1: ['Long · BA', ['Từ điển', 'Hân – Việt v0.3'], '#62b38a'], c2: ['Trang · Junior', ['Việc đã nhận', 'trang 4/4'], '#ff8fb1'],
    me: ['Intern · Bạn', ['PowerPoint', 'Deck_FINAL?'], '#e07a5f'], c3: ['Bảo · Senior Intern', ['Bảo-pedia', '3 năm · 412 trang'], '#9b7bff'],
    n1: ['Thư · EA', ['Ai làm gì', '(không chính thức)'], '#5b9bd5'], n2: ['Nhi · EA', ['Lịch chị Tuyết', '47 cuộc họp'], '#e0a030'],
    n3: ['Linh · Strategy', ['Cần tuyển', 'từ 2023…'], '#4a5bd8'], n4: ['An · Strategy', ['Deck_FINAL_REAL', '10:42'], '#3a7bd5'],
    n5: ['Minh · part-time', ['Offline', 'Đang thi'], '#9aa0ad'], n6: ['Hạ · Research', ['Literature', 'review (217 tr.)'], '#5a9a5a'],
    hr: ['Phương · HR', ['Team building', 'thứ Bảy #7'], '#ff7a6b'], senior: ['Mai · Senior', ['Proposal', 'đã approve ✓'], '#9b7bff'],
  },
  whiteboard: ['BIG PITCHER 🚀', 'Aligment strategry', 'với perfomance', 'Re-branding mindset', '(Long: big PICTURE ạ)'],
  scrum: { cols: ['TO DO', 'DOING', 'DONE'], notes: [
    ['Big pitcher (??)', 'Literature review rút gọn', 'Tuyển người cho chị Linh', 'Thẻ từ intern mới'],
    ['Deck FINAL_REAL', 'Kanban thật (bí mật)', 'Sửa máy in (lần 4)'],
    ['Stand-up 45 phút', 'Team building #6'],
  ] },
  board: ['TẾT 2015 🧧', 'Team building Vũng Tàu (đã hủy?)', 'Sinh nhật chị Tuyết'],
  palette: {},
  props: [],
  labels: {},
};

export function buildWorld(scene, themeIn = {}) {
  const th = { ...DEFAULT_THEME, ...themeIn, signs: { ...DEFAULT_THEME.signs, ...(themeIn.signs || {}) }, desks: { ...DEFAULT_THEME.desks, ...(themeIn.desks || {}) }, labels: { ...(themeIn.labels || {}) } };
  const L = (id, d) => th.labels[id] || d;
  const colliders = [];
  const interactables = [];
  const animated = [];
  const root = new THREE.Group();
  scene.add(root);

  const mat = (m) => (typeof m === 'string' ? T(m) : m);
  function box(w, h, d, m, x, y, z, collide = false, ry = 0, ol = 0.025) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(m));
    mesh.position.set(x, y + h / 2, z);
    mesh.rotation.y = ry;
    if (ol) outline(mesh, ol);
    root.add(mesh);
    if (collide) {
      const hw = (Math.abs(Math.cos(ry)) * w + Math.abs(Math.sin(ry)) * d) / 2;
      const hd = (Math.abs(Math.sin(ry)) * w + Math.abs(Math.cos(ry)) * d) / 2;
      colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    }
    return mesh;
  }
  function cyl(rt, rb, h, m, x, y, z, seg = 20, ol = 0.02) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(m));
    mesh.position.set(x, y + h / 2, z);
    if (ol) outline(mesh, ol);
    root.add(mesh);
    return mesh;
  }
  function sphere(r, m, x, y, z, ol = 0.02) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), mat(m));
    mesh.position.set(x, y, z);
    if (ol) outline(mesh, ol);
    root.add(mesh);
    return mesh;
  }
  function plane(w, h, m, x, y, z, ry = 0) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    root.add(mesh);
    return mesh;
  }
  const basic = (tex) => new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  function collideRect(minX, maxX, minZ, maxZ) { colliders.push({ minX, maxX, minZ, maxZ }); }

  // ---------- palette ----------
  const P = {
    wall: '#fff4e6', lilac: '#e3d9ff', peach: '#ffe0d6', mint: '#d6f5e8', butter: '#fff1b8', sky: '#d9eeff',
    desk: '#fffaf2', deskLeg: '#c9b6ff', chair: '#b8f0d8', chair2: '#ffc8dd', wood: '#f2c99a', woodDark: '#d9a273',
    plant: '#8fd6a0', pot: '#ffb39a', ink: INK,
    ...(th.palette || {}),
  };
  const glassMat = new THREE.MeshBasicMaterial({ color: '#cfe9ff', transparent: true, opacity: 0.28, depthWrite: false });

  // ---------- floor & ceiling ----------
  const floorTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#f6e3c6'; g.fillRect(0, 0, w, h);
    for (let j = 0; j < 8; j++) {
      const off = (j % 2) * 128;
      for (let i = -1; i < 3; i++) {
        g.fillStyle = (i + j) % 3 === 0 ? '#f3dcbc' : (i + j) % 3 === 1 ? '#f8e8cf' : '#f5dfc2';
        g.fillRect(i * 256 + off + 2, j * 64 + 2, 252, 60);
      }
    }
    g.strokeStyle = 'rgba(160,110,70,0.25)'; g.lineWidth = 3;
    for (let j = 0; j <= 8; j++) { g.beginPath(); g.moveTo(0, j * 64); g.lineTo(w, j * 64); g.stroke(); }
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(10, 7);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshToonMaterial({ map: floorTex, gradientMap }));
  floor.rotation.x = -Math.PI / 2;
  root.add(floor);
  // pastel rug at the entrance
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.6, 40), T('#ffc8dd'));
  rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.006, 7.4); root.add(rug);
  const rugO = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.66, 40), new THREE.MeshBasicMaterial({ color: INK }));
  rugO.rotation.x = -Math.PI / 2; rugO.position.set(0, 0.007, 7.4); root.add(rugO);
  // stand-up circle on the floor
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.9, 2.0, 48), new THREE.MeshBasicMaterial({ color: '#c9b6ff' }));
  ring.rotation.x = -Math.PI / 2; ring.scale.set(1.35, 0.9, 1); ring.position.set(0.5, 0.006, -4.3); root.add(ring);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshBasicMaterial({ color: '#fffaf3' }));
  ceil.rotation.x = Math.PI / 2; ceil.position.y = 3; root.add(ceil);
  const panelMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  for (let x = -12; x <= 12; x += 4) for (let z = -8; z <= 8; z += 4) {
    const p = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24), panelMat);
    p.rotation.x = Math.PI / 2; p.position.set(x, 2.99, z); root.add(p);
    const r = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.5, 24), new THREE.MeshBasicMaterial({ color: '#e8dcc8', side: THREE.DoubleSide }));
    r.rotation.x = Math.PI / 2; r.position.set(x, 2.985, z); root.add(r);
  }

  // ---------- outer walls ----------
  const H = 3, Tk = 0.2;
  box(13.5, H, Tk, P.wall, -8.25, 0, 10, true, 0, 0);
  box(13.5, H, Tk, P.wall, 8.25, 0, 10, true, 0, 0);
  box(3, 0.6, Tk, P.wall, 0, 2.4, 10, false, 0, 0);
  plane(3, 2.4, glassMat, 0, 1.2, 10.05, 0);
  collideRect(-1.5, 1.5, 10.05, 10.6);
  box(Tk, H, 20, P.wall, 15, 0, 0, true, 0, 0);
  box(Tk, H, 20, P.wall, -15, 0, 0, true, 0, 0);
  // skirting line along the walls (doodle feel)
  box(30, 0.12, 0.04, P.ink, 0, 0, 9.88, false, 0, 0);
  box(0.04, 0.12, 20, P.ink, 14.88, 0, 0, false, 0, 0);
  box(0.04, 0.12, 20, P.ink, -14.88, 0, 0, false, 0, 0);
  // north wall with big window x[-7,7]
  box(8, H, Tk, P.wall, -11, 0, -10, true, 0, 0);
  box(8, H, Tk, P.wall, 11, 0, -10, true, 0, 0);
  box(14, 0.9, Tk, P.sky, 0, 0, -10, true, 0, 0.02);
  box(14, 0.4, Tk, P.wall, 0, 2.6, -10, false, 0, 0);
  plane(14, 1.7, glassMat, 0, 1.75, -10.0, 0);
  for (let x = -7; x <= 7; x += 2) box(0.08, 1.7, 0.1, '#ffffff', x, 0.9, -10, false, 0, 0.015);
  const skyTex = canvasTex(2048, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#bfe3ff'); grd.addColorStop(0.65, '#ffe3ef'); grd.addColorStop(1, '#fff1d6');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    // clouds
    g.fillStyle = '#ffffff';
    [[200, 90], [700, 60], [1250, 110], [1750, 70]].forEach(([cx, cy]) => { for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(cx + k * 40, cy + (k % 2) * 10, 38, 0, 7); g.fill(); } });
    const cols = ['#c9b6ff', '#b8f0d8', '#ffc8dd', '#ffe9a0', '#bfe3ff', '#ffd3b8'];
    let x = 0, n = 0;
    while (x < w) {
      const bw = 70 + ((n * 53) % 130), bh = 150 + ((n * 97) % 260);
      g.fillStyle = cols[n % cols.length];
      roundRect(g, x, h - bh, bw, bh + 20, 14); g.fill();
      g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.75)';
      for (let wy = h - bh + 18; wy < h - 14; wy += 30) for (let wx = x + 12; wx < x + bw - 16; wx += 22) g.fillRect(wx, wy, 10, 14);
      x += bw + 10; n++;
    }
    g.fillStyle = '#ffffff'; roundRect(g, 1280, 150, 420, 110, 20); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    g.fillStyle = INK; g.font = '900 48px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText(th.skyline, 1490, 218);
  });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(40, 10), new THREE.MeshBasicMaterial({ map: skyTex }));
  sky.position.set(0, 1.5, -16); root.add(sky);

  // glass partition helper
  function glassWall(x1, z1, x2, z2) {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    const ry = Math.abs(x2 - x1) > Math.abs(z2 - z1) ? 0 : Math.PI / 2;
    plane(len, 2.6, glassMat, cx, 1.3, cz, ry);
    box(ry ? 0.08 : len, 0.08, ry ? len : 0.08, '#ffffff', cx, 2.6, cz, false, 0, 0.015);
    box(ry ? 0.08 : len, 0.12, ry ? len : 0.08, '#ffffff', cx, 0, cz, false, 0, 0.015);
    if (ry) collideRect(cx - 0.08, cx + 0.08, Math.min(z1, z2), Math.max(z1, z2));
    else collideRect(Math.min(x1, x2), Math.max(x1, x2), cz - 0.08, cz + 0.08);
    box(0.08, 2.6, 0.08, '#ffffff', x1, 0, z1, false, 0, 0.015);
    box(0.08, 2.6, 0.08, '#ffffff', x2, 0, z2, false, 0, 0.015);
  }
  function sign(text, bg, x, y, z, ry, w = 1.4) {
    const tex = textTexture([text], { w: 512, h: 128, bg, sizes: [56] });
    plane(w, w / 4, basic(tex), x, y, z, ry);
  }

  // ---------- Partner Room (NW): lilac ----------
  const lilacFloor = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), T(P.lilac));
  lilacFloor.rotation.x = -Math.PI / 2; lilacFloor.position.set(-11, 0.004, -7); root.add(lilacFloor);
  glassWall(-7, -10, -7, -6.2);
  glassWall(-7, -4.8, -7, -4);
  box(8, H, Tk, P.lilac, -11, 0, -4, true, 0, 0);
  box(0.08, 0.4, 1.4, '#ffffff', -7, 2.6, -5.5, false, 0, 0.015);
  box(2.4, 0.74, 1.0, P.woodDark, -11, 0, -7.4, true);
  box(2.5, 0.06, 1.1, P.wood, -11, 0.74, -7.4, false);
  box(0.7, 1.15, 0.2, '#9fb4ff', -11, 0.25, -9.2, false);
  box(0.7, 0.12, 0.65, '#9fb4ff', -11, 0.45, -8.95, false);
  cyl(0.1, 0.08, 0.1, '#c98f6a', -11.5, 0.8, -7.3);
  for (let i = 0; i < 3; i++) cyl(0.045, 0.035, 0.05, '#ffffff', -11.2 + i * 0.12, 0.8, -7.1, 12, 0.01);
  const nhan = textTexture([th.bossWall], { w: 512, h: 256, bg: '#fff8ef', sizes: [96], weights: [900] });
  plane(1.4, 0.7, basic(nhan), -11, 1.8, -9.88, 0);
  cyl(0.22, 0.18, 0.4, P.pot, -8, 0, -9.2);
  for (let i = 0; i < 6; i++) sphere(0.15, '#d9d47a', -8 + Math.cos(i) * 0.15, 0.6 + i * 0.12, -9.2 + Math.sin(i) * 0.15, 0.015);
  interactables.push({ id: 'plant', label: L('plant', 'Xem cây kim tiền'), pos: new THREE.Vector3(-8, 1, -9.2) });
  sign(th.signs.boss, '#c9b6ff', -6.9, 2.3, -5.5, Math.PI / 2);

  // ---------- Finance (NE): peach ----------
  const peachFloor = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), T(P.peach));
  peachFloor.rotation.x = -Math.PI / 2; peachFloor.position.set(11, 0.004, -7); root.add(peachFloor);
  box(Tk, H, 6, P.peach, 7, 0, -7, true, 0, 0);
  box(1, H, Tk, P.peach, 7.5, 0, -4, true, 0, 0);
  box(5.5, H, Tk, P.peach, 12.25, 0, -4, true, 0, 0);
  box(1.5, 0.6, Tk, P.peach, 8.75, 2.4, -4, false, 0, 0);
  box(2.2, 0.74, 1.0, '#ffd3b8', 11, 0, -7.4, true);
  box(2.3, 0.06, 1.1, P.desk, 11, 0.74, -7.4, false);
  for (let i = 0; i < 4; i++) box(0.3, 0.05, 0.22, ['#ffb3c7', '#9fb4ff', '#b8f0d8', '#ffe08a'][i], 10.4 + i * 0.05, 0.8 + i * 0.05, -7.2, false, 0, 0.01);
  for (let i = 0; i < 3; i++) box(0.6, 1.4, 0.6, '#ffffff', 8.2 + i * 0.7, 0, -9.5, true);
  box(0.8, 1.0, 0.7, '#bfc6d9', 13.6, 0, -9.2, true);
  cyl(0.12, 0.12, 0.04, '#ffe08a', 13.6, 0.55, -8.83).rotation.x = Math.PI / 2;
  const talisman = textTexture(['PHÁT'], { w: 128, h: 256, bg: '#ffe08a', fg: '#e0455f', sizes: [44] });
  plane(0.18, 0.36, basic(talisman), 13.85, 0.75, -8.83, 0);
  interactables.push({ id: 'safe', label: L('safe', 'Nhìn két sắt'), pos: new THREE.Vector3(13.6, 0.8, -8.8) });
  sign(th.signs.finance, '#ffc2b3', 8.75, 2.25, -3.88, 0);
  const banner = textTexture([th.banner], { w: 1024, h: 128, bg: '#ffe9a0', sizes: [54], weights: [900] });
  plane(4.6, 0.58, basic(banner), 12.3, 2.35, -3.88, 0);

  // ---------- War Room (W): mint ----------
  const mintFloor = new THREE.Mesh(new THREE.PlaneGeometry(8, 9), T(P.mint));
  mintFloor.rotation.x = -Math.PI / 2; mintFloor.position.set(-11, 0.004, 0.5); root.add(mintFloor);
  glassWall(-7, -4, -7, 1);
  glassWall(-7, 2.6, -7, 5);
  box(0.08, 0.4, 1.6, '#ffffff', -7, 2.6, 1.8, false, 0, 0.015);
  box(8, H, Tk, P.mint, -11, 0, 5, true, 0, 0);
  box(5.2, 0.72, 1.5, P.desk, -11, 0, 0.5, true);
  box(5.3, 0.06, 1.6, P.wood, -11, 0.72, 0.5, false);
  const chairCols = ['#b8f0d8', '#ffc8dd', '#c9b6ff', '#ffe9a0', '#bfe3ff'];
  for (let i = 0; i < 5; i++) {
    const x = -13 + i;
    box(0.45, 0.1, 0.45, chairCols[i], x, 0.4, -1.25, false); box(0.45, 0.5, 0.08, chairCols[i], x, 0.5, -1.47, false);
    box(0.45, 0.1, 0.45, chairCols[4 - i], x, 0.4, 2.25, false); box(0.45, 0.5, 0.08, chairCols[4 - i], x, 0.5, 2.47, false);
  }
  for (let i = 0; i < 4; i++) { cyl(0.16, 0.14, 0.03, '#ffffff', -12.5 + i, 0.78, 0.5, 20, 0.01); sphere(0.11, '#ff7a6b', -12.5 + i, 0.86, 0.5, 0.015); }
  // retro board on the south wall
  const retroTex = canvasTex(1024, 560, (g, w, h) => {
    g.fillStyle = '#ffffff'; roundRect(g, 4, 4, w - 8, h - 8, 26); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    const cols = [['START', '#b8f0d8'], ['STOP', '#ffc2b3'], ['CONTINUE', '#bfe3ff']];
    cols.forEach(([t, c], i) => {
      const x = 30 + i * 330;
      g.fillStyle = c; roundRect(g, x, 30, 300, 70, 14); g.fill(); g.stroke();
      g.fillStyle = INK; g.font = '900 40px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText(t, x + 150, 78);
      for (let k = 0; k < 3; k++) { g.fillStyle = ['#ffe9a0', '#ffc8dd', '#c9b6ff'][(i + k) % 3]; g.fillRect(x + 20 + (k % 2) * 140, 130 + k * 120, 120, 100); g.strokeRect(x + 20 + (k % 2) * 140, 130 + k * 120, 120, 100); }
    });
  });
  plane(2.4, 1.3, basic(retroTex), -11, 1.7, 4.88, Math.PI);
  interactables.push({ id: 'interview', label: L('interview', 'Ngồi vào ghế phòng họp'), pos: new THREE.Vector3(-11, 0.8, 2.2) });
  sign(th.signs.meeting, '#b8f0d8', -6.9, 2.3, 1.8, Math.PI / 2);

  // ---------- Reception ----------
  box(3.4, 0.82, 0.7, '#ffc8dd', -4, 0, 6.4, true);
  box(3.5, 0.06, 0.8, P.desk, -4, 0.82, 6.4, false);
  box(4.4, 2.6, 0.2, '#c9b6ff', -4, 0, 4.4, true);
  const logo = textTexture(th.logo, { w: 1024, h: 512, bg: '#fff8ef', sizes: [92, 40, 34], weights: [900, 700, 500] });
  plane(4.1, 2.05, basic(logo), -4, 1.6, 4.52, 0);
  cyl(0.06, 0.08, 0.06, '#ffe08a', -3.2, 0.88, 6.3, 12, 0.01);

  // ---------- Altar (Thần Tài) ----------
  box(1.0, 0.7, 0.55, '#ff8fa3', 4, 0, 9.5, true);
  box(1.1, 0.06, 0.62, '#ffe08a', 4, 0.7, 9.5, false);
  box(1.0, 0.6, 0.05, '#ff6f8a', 4, 0.76, 9.78, false, 0, 0.015);
  sphere(0.11, '#ffd25a', 3.75, 0.9, 9.55); cyl(0.09, 0.12, 0.14, '#ffd25a', 3.75, 0.76, 9.55);
  sphere(0.11, '#ffd25a', 4.25, 0.9, 9.55); cyl(0.09, 0.12, 0.14, '#ffd25a', 4.25, 0.76, 9.55);
  cyl(0.07, 0.07, 0.08, '#d9a273', 4, 0.76, 9.35);
  const incense = [];
  for (let i = 0; i < 3; i++) incense.push(cyl(0.006, 0.006, 0.28, '#ff7a6b', 3.97 + i * 0.03, 0.84, 9.35, 6, 0));
  for (let i = 0; i < 5; i++) sphere(0.05, ['#ffd25a', '#ff7a6b', '#8fd6a0', '#ffd25a', '#ff7a6b'][i], 3.6 + i * 0.2, 0.8, 9.3, 0.01);
  const bulbs = [];
  for (let i = 0; i < 6; i++) bulbs.push(sphere(0.03, new THREE.MeshBasicMaterial({ color: '#ff6f8a' }), 3.55 + i * 0.18, 1.38, 9.74, 0));
  animated.push((t) => { bulbs.forEach((b, i) => b.material.color.set(((Math.floor(t * 3) + i) % 2) ? '#ff6f8a' : '#ffe08a')); });
  interactables.push({ id: 'altar', label: L('altar', 'Thắp hương Thần Tài'), pos: new THREE.Vector3(4, 0.9, 9.3) });

  // ---------- HR desk by the entrance (Phương) ----------
  box(0.4, 0.7, 0.4, '#bfe3ff', 6.6, 0, 9.5, true);
  cyl(0.14, 0.14, 0.4, T('#d9f1ff', { transparent: true, opacity: 0.8 }), 6.6, 0.7, 9.5);

  // ---------- Desks ----------
  const screenTex = (lines, bg) => textTexture(lines, { w: 256, h: 160, bg, sizes: [26, 20], weights: [800, 500], radius: 10, border: null });
  function desk(x, z, facing, nameplate, screen, chairCol = P.chair) {
    box(1.5, 0.06, 0.75, P.desk, x, 0.72, z, false);
    box(0.06, 0.72, 0.7, P.deskLeg, x - 0.7, 0, z, false, 0, 0.015);
    box(0.06, 0.72, 0.7, P.deskLeg, x + 0.7, 0, z, false, 0, 0.015);
    collideRect(x - 0.75, x + 0.75, z - 0.38, z + 0.38);
    const mz = z - facing * 0.2;
    box(0.06, 0.22, 0.06, '#ffffff', x, 0.78, mz, false, 0, 0.012);
    box(0.64, 0.4, 0.04, '#ffffff', x, 0.96, mz, false, 0, 0.02);
    if (screen) plane(0.56, 0.33, new THREE.MeshBasicMaterial({ map: screenTex(screen[0], screen[1]) }), x, 1.16, mz + facing * 0.025, facing > 0 ? 0 : Math.PI);
    box(0.45, 0.025, 0.15, '#ffffff', x, 0.78, z + facing * 0.1, false, 0, 0.012);
    const cz = z + facing * 0.7;
    box(0.5, 0.1, 0.5, chairCol, x, 0.42, cz, false);
    box(0.5, 0.55, 0.1, chairCol, x, 0.52, cz + facing * 0.24, false);
    cyl(0.03, 0.03, 0.42, '#ffffff', x, 0, cz, 8, 0.01);
    if (nameplate) {
      const np = textTexture([nameplate], { w: 256, h: 64, bg: '#ffffff', sizes: [28], radius: 12 });
      plane(0.32, 0.08, basic(np), x + 0.45, 0.82, z + facing * 0.38, facing > 0 ? 0 : Math.PI);
    }
  }
  const D = (slot) => th.desks[slot] || ['', null, '#9aa0ad'];
  const dk = (x, z, f, slot, chair) => { const [plate, lines, col] = D(slot); desk(x, z, f, plate, lines ? [lines, col] : null, chair); };
  dk(-4.2, -1.65, -1, 'c1', '#bfe3ff');
  dk(-2.2, -1.65, -1, 'c2', P.chair2);
  dk(-4.2, 0.85, 1, 'me', '#ffe9a0');
  dk(-2.2, 0.85, 1, 'c3', '#c9b6ff');
  // north row (window)
  dk(-5.6, -8.4, -1, 'n1', '#bfe3ff');
  dk(-4.0, -8.4, -1, 'n2', '#ffe9a0');
  dk(-2.4, -8.4, -1, 'n3', '#c9b6ff');
  dk(-0.8, -8.4, -1, 'n4', '#b8f0d8');
  dk(0.8, -8.4, -1, 'n5', '#e3d9ff');
  dk(2.4, -8.4, -1, 'n6', P.chair);
  dk(8.5, 8.2, 1, 'hr', '#ffc8dd');
  box(4.1, 0.35, 0.05, '#ffc8dd', -3.2, 0.74, -0.4, false, 0, 0.015);
  interactables.push({ id: 'desk', label: L('desk', 'Ngồi làm việc ở bàn mình'), pos: new THREE.Vector3(-4.2, 0.8, 1.4) });

  // Mai's desk + Bình's server rack
  dk(5, -2.4, -1, 'senior', '#c9b6ff');
  box(0.7, 2.0, 0.7, '#4a4a5a', 6.4, 0, -3.9, true);
  const leds = [];
  for (let i = 0; i < 8; i++) leds.push(box(0.05, 0.03, 0.01, new THREE.MeshBasicMaterial({ color: '#8fff9f' }), 6.25 + (i % 4) * 0.1, 0.8 + Math.floor(i / 4) * 0.5, -3.54, false, 0, 0));
  animated.push((t) => leds.forEach((l, i) => { l.visible = Math.sin(t * (3 + i) + i) > -0.3; }));
  box(0.6, 0.8, 0.5, '#ffffff', 6.4, 0, 4.8, true);
  box(0.6, 0.25, 0.5, '#e3d9ff', 6.4, 0.8, 4.8, false);
  interactables.push({ id: 'printer', label: L('printer', 'Dùng máy in'), pos: new THREE.Vector3(6.4, 0.9, 4.5) });

  // Hân's corner (standing desk + buzzword whiteboard)
  box(1.2, 1.05, 0.6, '#ffffff', 2.4, 0, 3.95, true);
  box(0.5, 0.32, 0.04, '#ffffff', 2.4, 1.05, 4.05, false);
  const wb = textTexture(th.whiteboard, { w: 768, h: 512, bg: '#ffffff', fg: '#4a5bd8', sizes: [64, 48, 40, 40, 34], weights: [900, 800, 700, 700, 500], align: 'left', pad: 40 });
  box(2.0, 1.2, 0.05, '#ffffff', 4.3, 0.9, 4.6, true);
  plane(1.9, 1.1, basic(wb), 4.3, 1.5, 4.56, Math.PI);
  const bean = sphere(0.45, '#b8f0d8', 4.4, 0.3, 3.2); bean.scale.y = 0.7;
  interactables.push({ id: 'okr', label: L('okr', 'Đọc bảng trắng của chị Hân'), pos: new THREE.Vector3(4.3, 1.4, 4.4) });

  // ---------- Scrum board (centre stage) ----------
  box(0.08, 1.9, 0.08, '#ffffff', -0.9, 0, -6.6, false, 0, 0.015);
  box(0.08, 1.9, 0.08, '#ffffff', 1.9, 0, -6.6, false, 0, 0.015);
  collideRect(-1.0, 2.0, -6.75, -6.45);
  const scrumTex = canvasTex(1024, 560, (g, w, h) => {
    g.fillStyle = '#ffffff'; roundRect(g, 4, 4, w - 8, h - 8, 26); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    const cols = [[th.scrum.cols[0], '#ffe9a0'], [th.scrum.cols[1], '#bfe3ff'], [th.scrum.cols[2], '#b8f0d8']];
    const notes = th.scrum.notes.map((c) => c.slice(0, 4));
    const ncol = ['#ffc8dd', '#ffe9a0', '#c9b6ff', '#b8f0d8', '#ffd3b8'];
    cols.forEach(([t, c], i) => {
      const x = 24 + i * 330;
      g.fillStyle = c; roundRect(g, x, 24, 310, 66, 14); g.fill(); g.lineWidth = 6; g.stroke();
      g.fillStyle = INK; g.font = '900 40px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText(t, x + 155, 70);
      notes[i].forEach((n, k) => {
        const nx = x + 10 + (k % 2) * 152, ny = 110 + Math.floor(k / 2) * 150;
        g.save(); g.translate(nx + 70, ny + 65); g.rotate(((k * 37 + i * 11) % 9 - 4) * 0.012);
        g.fillStyle = ncol[(i * 2 + k) % ncol.length]; g.fillRect(-68, -62, 136, 124); g.lineWidth = 4; g.strokeRect(-68, -62, 136, 124);
        g.fillStyle = INK; g.font = '700 22px Be Vietnam Pro, Arial';
        const words = n.split(' '); let line = '', ly = -30; const lines = [];
        words.forEach((wd) => { if ((line + ' ' + wd).trim().length > 11) { lines.push(line.trim()); line = wd; } else line += ' ' + wd; });
        lines.push(line.trim());
        lines.forEach((l) => { g.fillText(l, 0, ly); ly += 28; });
        g.restore();
      });
    });
  });
  const scrum = plane(3.0, 1.64, basic(scrumTex), 0.5, 1.55, -6.55, 0);
  void scrum;
  const scrumBack = box(3.05, 1.7, 0.05, '#ffffff', 0.5, 0.7, -6.6, false, 0, 0.02); void scrumBack;
  sign(th.signs.standup, '#c9b6ff', 0.5, 2.62, -6.53, 0, 2.6);

  // ---------- Pantry (E): butter ----------
  const butterFloor = new THREE.Mesh(new THREE.PlaneGeometry(6, 7), T(P.butter));
  butterFloor.rotation.x = -Math.PI / 2; butterFloor.position.set(12, 0.004, 1.5); root.add(butterFloor);
  box(0.7, 0.9, 5.2, '#ffffff', 14.6, 0, 1.6, true);
  box(0.75, 0.06, 5.2, '#ffe9a0', 14.6, 0.9, 1.6, false);
  box(0.8, 1.9, 0.8, '#bfe3ff', 14.5, 0, -1.6, true);
  cyl(0.18, 0.18, 0.25, '#ffffff', 14.6, 0.96, 0.4);
  box(0.35, 0.45, 0.35, '#ffc8dd', 14.6, 0.96, 3.6, false);
  interactables.push({ id: 'coffee', label: L('coffee', 'Pantry: ăn uống, cà phê'), pos: new THREE.Vector3(14.4, 1.1, 3.6) });
  box(2.0, 0.72, 1.0, '#ffffff', 11.6, 0, 1.2, true);
  for (let i = 0; i < 3; i++) { cyl(0.17, 0.2, 0.42, '#bfe3ff', 10.9 + i * 0.7, 0, 0.35); cyl(0.17, 0.2, 0.42, '#b8f0d8', 10.9 + i * 0.7, 0, 2.05); }
  box(0.5, 0.1, 0.5, '#ff5a6e', 10.2, 0.4, 1.2, false); box(0.1, 0.6, 0.5, '#ff5a6e', 9.98, 0.45, 1.2, false);
  interactables.push({ id: 'redchair', label: L('redchair', 'Nhìn chiếc ghế đỏ'), pos: new THREE.Vector3(10.2, 0.6, 1.2) });
  cyl(0.2, 0.18, 0.18, '#ffffff', 11.6, 0.72, 1.2);
  const pantrySign = textTexture([th.signs.pantry], { w: 768, h: 128, bg: '#ffe9a0', sizes: [54] });
  plane(2.6, 0.43, basic(pantrySign), 14.88, 2.35, 1.6, -Math.PI / 2);

  // ---------- decorations ----------
  function plant(x, z, s = 1) {
    cyl(0.2 * s, 0.16 * s, 0.4 * s, P.pot, x, 0, z);
    for (let i = 0; i < 5; i++) sphere(0.22 * s, P.plant, x + Math.cos(i * 1.3) * 0.12 * s, (0.6 + i * 0.12) * s, z + Math.sin(i * 1.3) * 0.12 * s, 0.018);
    collideRect(x - 0.25, x + 0.25, z - 0.25, z + 0.25);
  }
  plant(-6.3, 9.3); plant(6.3, -9.3); plant(-6.3, -9.3); plant(1.5, 9.4, 0.8);
  const clockTex = canvasTex(256, 256, (g) => {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 118, 0, 7); g.fill();
    g.strokeStyle = INK; g.lineWidth = 12; g.stroke();
    g.fillStyle = INK; g.font = '800 30px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(i, 128 + Math.sin(a) * 88, 128 - Math.cos(a) * 88); }
  });
  plane(0.6, 0.6, basic(clockTex), 0, 2.45, 9.88, Math.PI);
  const board = textTexture(th.board, { w: 768, h: 420, bg: '#ffd3b8', sizes: [52, 34, 34] });
  plane(1.8, 1.0, basic(board), -8, 1.6, 9.88, Math.PI);

  // ---------- company props (in free prop slots) ----------
  const propTex = (label, bg) => textTexture([label], { w: 512, h: 160, bg, sizes: [52] });
  for (const pr of th.props || []) {
    const at = PROP_SLOTS[pr.slot]; if (!at) continue;
    const [x, z] = at, col = pr.color || '#ffe9a0';
    if (pr.type === 'crates') {
      for (let i = 0; i < 3; i++) box(0.9, 0.55, 0.7, i % 2 ? '#e8c39a' : '#d9a273', x + (i === 2 ? 0.2 : (i - 0.5) * 0.95), i === 2 ? 0.55 : 0, z, i < 2);
      plane(1.3, 0.4, basic(propTex(pr.label || 'HÀNG', col)), x, 0.32, z - 0.37, Math.PI);
    } else if (pr.type === 'rack') {
      box(0.7, 2.0, 0.7, '#4a4a5a', x, 0, z, true);
      for (let i = 0; i < 8; i++) { const l = box(0.05, 0.03, 0.01, new THREE.MeshBasicMaterial({ color: '#8fff9f' }), x - 0.15 + (i % 4) * 0.1, 0.8 + Math.floor(i / 4) * 0.5, z - 0.36, false, 0, 0); animated.push((t) => { l.visible = Math.sin(t * (3 + i) + i) > -0.3; }); }
      if (pr.label) plane(0.9, 0.28, basic(propTex(pr.label, col)), x, 2.15, z - 0.37, Math.PI);
    } else if (pr.type === 'ringlight') {
      cyl(0.02, 0.02, 1.5, '#333344', x, 0, z, 8, 0.008);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 10, 32), new THREE.MeshBasicMaterial({ color: '#fffbe0' }));
      ring2.position.set(x, 1.6, z); root.add(ring2);
      box(0.08, 0.15, 0.01, '#ff8fa3', x, 1.52, z - 0.02, false, 0, 0.008);
      if (pr.label) plane(1.0, 0.31, basic(propTex(pr.label, col)), x, 2.1, z, Math.PI);
    } else if (pr.type === 'balloons') {
      ['#ffc8dd', '#bfe3ff', '#ffe08a', '#b8f0d8'].forEach((c, i) => { const b = sphere(0.22, c, x + (i - 1.5) * 0.28, 1.9 + (i % 2) * 0.25, z); animated.push((t) => { b.position.y = 1.9 + (i % 2) * 0.25 + Math.sin(t * 1.5 + i) * 0.05; }); cyl(0.004, 0.004, 1.7, '#888888', x + (i - 1.5) * 0.28, 0, z, 4, 0); });
      if (pr.label) plane(1.2, 0.37, basic(propTex(pr.label, col)), x, 0.9, z, Math.PI);
    } else if (pr.type === 'cabinet') {
      for (let i = 0; i < 2; i++) box(0.6, 1.4, 0.6, '#ffffff', x + (i - 0.5) * 0.65, 0, z, true);
      if (pr.label) plane(1.2, 0.37, basic(propTex(pr.label, col)), x, 1.65, z - 0.31, Math.PI);
    } else if (pr.type === 'dryer') {
      box(0.9, 1.3, 0.7, '#cfd6e6', x, 0, z, true);
      for (let i = 0; i < 4; i++) box(0.75, 0.03, 0.02, '#ff9f7a', x, 0.3 + i * 0.25, z - 0.36, false, 0, 0);
      if (pr.label) plane(1.1, 0.34, basic(propTex(pr.label, col)), x, 1.5, z - 0.36, Math.PI);
    } else { // standee / rollup banner
      box(0.7, 0.06, 0.25, '#333344', x, 0, z, false);
      plane(0.7, 1.7, basic(textTexture(String(pr.label || '').split('|'), { w: 256, h: 620, bg: col, sizes: [40, 30, 30, 30] })), x, 0.95, z, Math.PI);
      collideRect(x - 0.35, x + 0.35, z - 0.15, z + 0.15);
    }
  }

  // ---------- lights ----------
  root.add(new THREE.HemisphereLight('#ffffff', '#ffe9d6', 1.6));
  root.add(new THREE.AmbientLight('#ffffff', 0.45));
  const dir = new THREE.DirectionalLight('#fff6ea', 1.1);
  dir.position.set(-6, 10, 8); root.add(dir);

  return {
    colliders, interactables, root,
    dispose() { scene.remove(root); root.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.map) o.material.map.dispose(); }); },
    update(t) { animated.forEach((f) => f(t)); incense.forEach((s, i) => { s.scale.y = 0.9 + Math.sin(t * 2 + i) * 0.03; }); },
  };
}

// ---------- People (chibi, sticker outline) ----------
