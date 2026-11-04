// Legacy office map (Ba Mẹ & Partners story). Pastel, sticker-outlined, cutaway walls for the elevated camera.
import * as THREE from 'three';
import { INK, T, outline, canvasTex, roundRect, textTexture, gradientMap } from '../art/kit.js';

// Named spots: [x, z, rotY]  (rotY 0 = facing +z / south, PI = facing north)
export const SPOTS = {
  reception: [-4, 5.3, 0],
  bay: [7.6, 8.4, Math.PI],
  hung: [-11, -8.5, 0],
  hang: [11, -8.5, 0],
  tu: [13.1, 1.2, -Math.PI / 2],
  khoa: [5, -3.25, 0],
  tuan: [2.4, 3.15, 0],
  son: [2.6, -6.0, -0.4],
  mai: [-4.2, -2.6, 0],
  dung: [-2.2, -2.6, 0],
  ngan: [-2.2, 1.65, Math.PI],
  window: [-2.5, -9.1, Math.PI],
  pantry2: [10.8, 3.6, Math.PI / 2],
  m_head: [-14.2, 0.5, Math.PI / 2],
  m_foot: [-7.8, 0.5, -Math.PI / 2],
  m_n1: [-13, -0.85, 0], m_n2: [-12, -0.85, 0], m_n3: [-11, -0.85, 0], m_n4: [-10, -0.85, 0], m_n5: [-9, -0.85, 0],
  m_s1: [-13, 1.85, Math.PI], m_s2: [-12, 1.85, Math.PI], m_s3: [-11, 1.85, Math.PI], m_s4: [-10, 1.85, Math.PI], m_s5: [-9, 1.85, Math.PI],
  su_son: [0.5, -5.75, 0],
};
// stand-up ring around the Scrum board (gap in the south so the player can walk in)
{
  const cx = 0.5, cz = -4.3, rx = 2.6, rz = 1.65;
  const angles = [0.62, 0.78, 0.94, 1.1, 1.26, 0.38, 0.22, 0.06, -0.1, -0.26];
  angles.forEach((a, i) => {
    const x = cx + rx * Math.cos(a * Math.PI), z = cz + rz * Math.sin(a * Math.PI);
    SPOTS['su' + (i + 1)] = [x, z, Math.atan2(cx - x, cz - z)];
  });
}
export const PLAYER_START = [0, 8.6, 0]; // x, z, yaw (yaw 0 looks north)
export const MEETING_SEAT = [-11, 1.85];

export function buildWorld(scene) {
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

  // ---------- outer walls ----------
  const H = 1.3, Tk = 0.2; // cutaway walls for the elevated camera
  box(13.5, H, Tk, P.wall, -8.25, 0, 10, true, 0, 0);
  box(13.5, H, Tk, P.wall, 8.25, 0, 10, true, 0, 0);
  plane(3, 1.2, glassMat, 0, 0.6, 10.05, 0);
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
  plane(14, 0.4, glassMat, 0, 1.1, -10.0, 0);
  for (let x = -7; x <= 7; x += 2) box(0.08, 0.4, 0.1, '#ffffff', x, 0.9, -10, false, 0, 0.015);

  // glass partition helper
  function glassWall(x1, z1, x2, z2) {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    const ry = Math.abs(x2 - x1) > Math.abs(z2 - z1) ? 0 : Math.PI / 2;
    plane(len, 1.3, glassMat, cx, 0.65, cz, ry);
    box(ry ? 0.08 : len, 0.08, ry ? len : 0.08, '#ffffff', cx, 1.3, cz, false, 0, 0.015);
    box(ry ? 0.08 : len, 0.12, ry ? len : 0.08, '#ffffff', cx, 0, cz, false, 0, 0.015);
    if (ry) collideRect(cx - 0.08, cx + 0.08, Math.min(z1, z2), Math.max(z1, z2));
    else collideRect(Math.min(x1, x2), Math.max(x1, x2), cz - 0.08, cz + 0.08);
    box(0.08, 1.3, 0.08, '#ffffff', x1, 0, z1, false, 0, 0.015);
    box(0.08, 1.3, 0.08, '#ffffff', x2, 0, z2, false, 0, 0.015);
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
  box(2.4, 0.74, 1.0, P.woodDark, -11, 0, -7.4, true);
  box(2.5, 0.06, 1.1, P.wood, -11, 0.74, -7.4, false);
  box(0.7, 1.15, 0.2, '#9fb4ff', -11, 0.25, -9.2, false);
  box(0.7, 0.12, 0.65, '#9fb4ff', -11, 0.45, -8.95, false);
  cyl(0.1, 0.08, 0.1, '#c98f6a', -11.5, 0.8, -7.3);
  for (let i = 0; i < 3; i++) cyl(0.045, 0.035, 0.05, '#ffffff', -11.2 + i * 0.12, 0.8, -7.1, 12, 0.01);
  const nhan = textTexture(['Synergy'], { w: 512, h: 256, bg: '#fff8ef', sizes: [96], weights: [900] });
  plane(1.4, 0.7, basic(nhan), -11, 1.8, -9.88, 0);
  cyl(0.22, 0.18, 0.4, P.pot, -8, 0, -9.2);
  for (let i = 0; i < 6; i++) sphere(0.15, '#d9d47a', -8 + Math.cos(i) * 0.15, 0.6 + i * 0.12, -9.2 + Math.sin(i) * 0.15, 0.015);
  interactables.push({ id: 'plant', label: 'Xem cây kim tiền', pos: new THREE.Vector3(-8, 1, -9.2) });
  sign('PARTNER ROOM', '#c9b6ff', -6.9, 2.3, -5.5, Math.PI / 2);

  // ---------- Finance (NE): peach ----------
  const peachFloor = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), T(P.peach));
  peachFloor.rotation.x = -Math.PI / 2; peachFloor.position.set(11, 0.004, -7); root.add(peachFloor);
  box(Tk, H, 6, P.peach, 7, 0, -7, true, 0, 0);
  box(1, H, Tk, P.peach, 7.5, 0, -4, true, 0, 0);
  box(5.5, H, Tk, P.peach, 12.25, 0, -4, true, 0, 0);
  box(2.2, 0.74, 1.0, '#ffd3b8', 11, 0, -7.4, true);
  box(2.3, 0.06, 1.1, P.desk, 11, 0.74, -7.4, false);
  for (let i = 0; i < 4; i++) box(0.3, 0.05, 0.22, ['#ffb3c7', '#9fb4ff', '#b8f0d8', '#ffe08a'][i], 10.4 + i * 0.05, 0.8 + i * 0.05, -7.2, false, 0, 0.01);
  for (let i = 0; i < 3; i++) box(0.6, 1.4, 0.6, '#ffffff', 8.2 + i * 0.7, 0, -9.5, true);
  box(0.8, 1.0, 0.7, '#bfc6d9', 13.6, 0, -9.2, true);
  cyl(0.12, 0.12, 0.04, '#ffe08a', 13.6, 0.55, -8.83).rotation.x = Math.PI / 2;
  const talisman = textTexture(['PHÁT'], { w: 128, h: 256, bg: '#ffe08a', fg: '#e0455f', sizes: [44] });
  plane(0.18, 0.36, basic(talisman), 13.85, 0.75, -8.83, 0);
  interactables.push({ id: 'safe', label: 'Nhìn két sắt', pos: new THREE.Vector3(13.6, 0.8, -8.8) });
  sign('FINANCE', '#ffc2b3', 8.75, 2.25, -3.88, 0);
  const banner = textTexture(['CLIENT LÀ NHÀ  ·  NHÀ LÀ CLIENT'], { w: 1024, h: 128, bg: '#ffe9a0', sizes: [54], weights: [900] });
  plane(4.6, 0.58, basic(banner), 12.3, 2.35, -3.88, 0);

  // ---------- War Room (W): mint ----------
  const mintFloor = new THREE.Mesh(new THREE.PlaneGeometry(8, 9), T(P.mint));
  mintFloor.rotation.x = -Math.PI / 2; mintFloor.position.set(-11, 0.004, 0.5); root.add(mintFloor);
  glassWall(-7, -4, -7, 1);
  glassWall(-7, 2.6, -7, 5);
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
  interactables.push({ id: 'seat', label: 'Ngồi vào ghế trống', pos: new THREE.Vector3(-11, 0.8, 2.2) });
  sign('WAR ROOM', '#b8f0d8', -6.9, 2.3, 1.8, Math.PI / 2);

  // ---------- Reception ----------
  box(3.4, 0.82, 0.7, '#ffc8dd', -4, 0, 6.4, true);
  box(3.5, 0.06, 0.8, P.desk, -4, 0.82, 6.4, false);
  box(4.4, 1.5, 0.2, '#c9b6ff', -4, 0, 4.4, true);
  const logo = textTexture(['BA MẸ & PARTNERS', 'Management Consulting · Since 1998', '"We treat clients like family."'], { w: 1024, h: 512, bg: '#fff8ef', sizes: [92, 40, 34], weights: [900, 700, 500] });
  plane(2.9, 1.45, basic(logo), -4, 0.78, 4.52, 0);
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
  interactables.push({ id: 'altar', label: 'Thắp hương Thần Tài', pos: new THREE.Vector3(4, 0.9, 9.3) });

  // ---------- Chú Bảy's corner ----------
  const bike = new THREE.Group();
  const wheel = (z) => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.08, 10, 24), T('#3a3a44')); w.position.set(0, 0.32, z); w.rotation.y = Math.PI / 2; outline(w, 0.015); return w; };
  const bBody = outline(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.35, 1.0), T('#9fb4ff')), 0.02); bBody.position.set(0, 0.62, 0);
  const bSeat = outline(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.6), T('#3a3a44')), 0.015); bSeat.position.set(0, 0.85, -0.15);
  const bBar = outline(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.05), T('#ffffff')), 0.012); bBar.position.set(0, 1.0, 0.5);
  bike.add(wheel(0.6), wheel(-0.6), bBody, bSeat, bBar); bike.position.set(9.3, 0, 8.3); root.add(bike);
  collideRect(9.0, 9.6, 7.5, 9.1);
  cyl(0.18, 0.2, 0.4, '#ff8fa3', 7.6, 0, 8.9);
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
  desk(-4.2, -1.65, -1, 'Mai · Senior', [['47 unread', 'Teams + Shopee'], '#ffb38a'], P.chair2);
  desk(-2.2, -1.65, -1, 'Dũng · Principal', [['Client_Master', 'FINAL_v7.xlsx'], '#62b38a'], '#bfe3ff');
  desk(-4.2, 0.85, 1, 'Intern · Bạn', [['PowerPoint', '200 slides · 11%'], '#e07a5f'], '#ffe9a0');
  desk(-2.2, 0.85, 1, 'Intern · Ngân', [['Template v2', 'no Comic Sans'], '#9b7bff'], '#c9b6ff');
  box(4.1, 0.35, 0.05, '#ffc8dd', -3.2, 0.74, -0.4, false, 0, 0.015);
  interactables.push({ id: 'desk', label: 'Ngồi làm việc ở bàn mình', pos: new THREE.Vector3(-4.2, 0.8, 1.4) });

  // Khoa's IT corner
  desk(5, -2.4, -1, 'IT · Khoa', [['Teams', 'Reconnecting…'], '#5b5fc7'], '#c9b6ff');
  box(0.7, 2.0, 0.7, '#4a4a5a', 6.4, 0, -3.9, true);
  const leds = [];
  for (let i = 0; i < 8; i++) leds.push(box(0.05, 0.03, 0.01, new THREE.MeshBasicMaterial({ color: '#8fff9f' }), 6.25 + (i % 4) * 0.1, 0.8 + Math.floor(i / 4) * 0.5, -3.54, false, 0, 0));
  animated.push((t) => leds.forEach((l, i) => { l.visible = Math.sin(t * (3 + i) + i) > -0.3; }));
  box(0.6, 0.8, 0.5, '#ffffff', 6.4, 0, 4.8, true);
  box(0.6, 0.25, 0.5, '#e3d9ff', 6.4, 0.8, 4.8, false);
  interactables.push({ id: 'printer', label: 'Dùng máy in', pos: new THREE.Vector3(6.4, 0.9, 4.5) });

  // Kevin's innovation corner
  box(1.2, 1.05, 0.6, '#ffffff', 2.4, 0, 3.95, true);
  box(0.5, 0.32, 0.04, '#ffffff', 2.4, 1.05, 4.05, false);
  const wb = textTexture(['OKR Q4 🚀', '10X REVENUE', 'Agile Transformation', 'Innovation Lab???', 'Bố: "để mẹ con quyết"'], { w: 768, h: 512, bg: '#ffffff', fg: '#4a5bd8', sizes: [64, 48, 40, 40, 34], weights: [900, 800, 700, 700, 500], align: 'left', pad: 40 });
  box(2.0, 1.2, 0.05, '#ffffff', 4.3, 0.9, 4.6, true);
  plane(1.9, 1.1, basic(wb), 4.3, 1.5, 4.56, Math.PI);
  const bean = sphere(0.45, '#b8f0d8', 4.4, 0.3, 3.2); bean.scale.y = 0.7;
  interactables.push({ id: 'okr', label: 'Đọc bảng OKR', pos: new THREE.Vector3(4.3, 1.4, 4.4) });

  // ---------- Scrum board (centre stage) ----------
  box(0.08, 1.9, 0.08, '#ffffff', -0.9, 0, -6.6, false, 0, 0.015);
  box(0.08, 1.9, 0.08, '#ffffff', 1.9, 0, -6.6, false, 0, 0.015);
  collideRect(-1.0, 2.0, -6.75, -6.45);
  const scrumTex = canvasTex(1024, 560, (g, w, h) => {
    g.fillStyle = '#ffffff'; roundRect(g, 4, 4, w - 8, h - 8, 26); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    const cols = [['TO DO', '#ffe9a0'], ['DOING', '#bfe3ff'], ['DONE', '#b8f0d8']];
    const notes = [
      ['Học Jira (bác Hùng)', 'Dời cây kim tiền', 'Tìm 50 triệu??', 'Mua pin laptop'],
      ['Deck Trà Sữa', 'Template slide v2', 'Sửa máy in (lần 4)'],
      ['Ăn cơm cô Tư', 'Thắp hương'],
    ];
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
  sign('DAILY STAND-UP · 9:00 · 15 PHÚT (*)', '#c9b6ff', 0.5, 2.62, -6.53, 0, 2.6);

  // ---------- Pantry (E): butter ----------
  const butterFloor = new THREE.Mesh(new THREE.PlaneGeometry(6, 7), T(P.butter));
  butterFloor.rotation.x = -Math.PI / 2; butterFloor.position.set(12, 0.004, 1.5); root.add(butterFloor);
  box(0.7, 0.9, 5.2, '#ffffff', 14.6, 0, 1.6, true);
  box(0.75, 0.06, 5.2, '#ffe9a0', 14.6, 0.9, 1.6, false);
  box(0.8, 1.9, 0.8, '#bfe3ff', 14.5, 0, -1.6, true);
  cyl(0.18, 0.18, 0.25, '#ffffff', 14.6, 0.96, 0.4);
  box(0.35, 0.45, 0.35, '#ffc8dd', 14.6, 0.96, 3.6, false);
  interactables.push({ id: 'coffee', label: 'Pha cà phê gói', pos: new THREE.Vector3(14.4, 1.1, 3.6) });
  box(2.0, 0.72, 1.0, '#ffffff', 11.6, 0, 1.2, true);
  for (let i = 0; i < 3; i++) { cyl(0.17, 0.2, 0.42, '#bfe3ff', 10.9 + i * 0.7, 0, 0.35); cyl(0.17, 0.2, 0.42, '#b8f0d8', 10.9 + i * 0.7, 0, 2.05); }
  box(0.5, 0.1, 0.5, '#ff5a6e', 10.2, 0.4, 1.2, false); box(0.1, 0.6, 0.5, '#ff5a6e', 9.98, 0.45, 1.2, false);
  interactables.push({ id: 'redchair', label: 'Nhìn chiếc ghế đỏ', pos: new THREE.Vector3(10.2, 0.6, 1.2) });
  cyl(0.2, 0.18, 0.18, '#ffffff', 11.6, 0.72, 1.2);
  const pantrySign = textTexture(['PANTRY · Góp 25k/bữa'], { w: 768, h: 128, bg: '#ffe9a0', sizes: [54] });
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
  const board = textTexture(['TẾT 2015 🧧', 'Team building Vũng Tàu (đã hủy?)', 'Sinh nhật cô Hằng'], { w: 768, h: 420, bg: '#ffd3b8', sizes: [52, 34, 34] });
  plane(1.8, 1.0, basic(board), -8, 1.6, 9.88, Math.PI);

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight('#ffffff', '#ffe9d6', 1.6));
  scene.add(new THREE.AmbientLight('#ffffff', 0.45));
  const dir = new THREE.DirectionalLight('#fff6ea', 1.1);
  dir.position.set(-6, 10, 8); scene.add(dir);

  return {
    colliders, interactables,
    update(t) { animated.forEach((f) => f(t)); incense.forEach((s, i) => { s.scale.y = 0.9 + Math.sin(t * 2 + i) * 0.03; }); },
  };
}

// ---------- People (chibi, sticker outline) ----------
