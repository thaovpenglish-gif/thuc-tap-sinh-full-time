// Shared 3D building kit for the per-company office maps (toon materials + sticker outlines).
// createKit(scene) returns drawing helpers that all add to one root group and collect colliders / interactables /
// per-frame animations, so a company map is just a list of calls.
import * as THREE from 'three';
import { INK, T, outline, canvasTex, roundRect, textTexture, gradientMap } from '../art/kit.js';

export { INK, T, canvasTex, roundRect, textTexture };

export function createKit(scene) {
  const root = new THREE.Group();
  scene.add(root);
  const colliders = [];
  const interactables = [];
  const animated = [];
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
  const glow = (color) => new THREE.MeshBasicMaterial({ color });
  function collideRect(minX, maxX, minZ, maxZ) { colliders.push({ minX, maxX, minZ, maxZ }); }
  function collideCircle(x, z, r) { collideRect(x - r, x + r, z - r, z + r); }

  /** A floor rectangle: a colour, or a painter (g, w, h) => void with a texture repeat. */
  function floorZone(x1, z1, x2, z2, look, repeat = 1, y = 0.004) {
    const w = Math.abs(x2 - x1), d = Math.abs(z2 - z1);
    let m;
    if (typeof look === 'function') {
      const tex = canvasTex(512, 512, look);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(Math.max(1, Math.round(w / repeat)), Math.max(1, Math.round(d / repeat)));
      m = new THREE.MeshToonMaterial({ map: tex, gradientMap });
    } else m = T(look);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
    root.add(mesh);
    return mesh;
  }
  function ceiling(x1, z1, x2, z2, h, color = '#fffaf3') {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(x2 - x1), Math.abs(z2 - z1)), new THREE.MeshBasicMaterial({ color }));
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set((x1 + x2) / 2, h, (z1 + z2) / 2);
    root.add(mesh);
    return mesh;
  }

  /**
   * Axis-aligned wall from (x1,z1) to (x2,z2) with door gaps [[from, to], …] measured along the wall,
   * a lintel above each gap (doorH) and an ink skirting line on both faces.
   */
  function wall(x1, z1, x2, z2, color, { h = 3, t = 0.16, gaps = [], doorH = 2.3, skirt = true, lintel = true } = {}) {
    const alongX = Math.abs(x2 - x1) >= Math.abs(z2 - z1);
    const a0 = alongX ? Math.min(x1, x2) : Math.min(z1, z2), a1 = alongX ? Math.max(x1, x2) : Math.max(z1, z2);
    const fixed = alongX ? z1 : x1;
    const sorted = gaps.map(([g0, g1]) => [Math.min(g0, g1), Math.max(g0, g1)]).sort((p, q) => p[0] - q[0]);
    const segs = []; let cur = a0;
    for (const [g0, g1] of sorted) { if (g0 > cur) segs.push([cur, g0]); cur = Math.max(cur, g1); }
    if (cur < a1) segs.push([cur, a1]);
    const seg = (s0, s1, y, hh, collide) => {
      const len = s1 - s0, mid = (s0 + s1) / 2;
      if (len <= 0.001) return;
      if (alongX) box(len, hh, t, color, mid, y, fixed, collide, 0, 0);
      else box(t, hh, len, color, fixed, y, mid, collide, 0, 0);
    };
    for (const [s0, s1] of segs) {
      seg(s0, s1, 0, h, true);
      if (skirt) for (const side of [-1, 1]) {
        const off = side * (t / 2 + 0.012), len = s1 - s0, mid = (s0 + s1) / 2;
        if (alongX) box(len, 0.11, 0.02, INK, mid, 0, fixed + off, false, 0, 0);
        else box(0.02, 0.11, len, INK, fixed + off, 0, mid, false, 0, 0);
      }
    }
    if (lintel) for (const [g0, g1] of sorted) if (h > doorH) seg(g0, g1, doorH, h - doorH, false);
  }

  function glassWall(x1, z1, x2, z2, { h = 2.6, frame = '#ffffff', tint = '#cfe9ff', opacity = 0.28 } = {}) {
    const gm = new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide });
    const len = Math.hypot(x2 - x1, z2 - z1);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    const ry = Math.abs(x2 - x1) > Math.abs(z2 - z1) ? 0 : Math.PI / 2;
    plane(len, h, gm, cx, h / 2, cz, ry);
    box(ry ? 0.08 : len, 0.08, ry ? len : 0.08, frame, cx, h, cz, false, 0, 0.015);
    box(ry ? 0.08 : len, 0.12, ry ? len : 0.08, frame, cx, 0, cz, false, 0, 0.015);
    if (ry) collideRect(cx - 0.08, cx + 0.08, Math.min(z1, z2), Math.max(z1, z2));
    else collideRect(Math.min(x1, x2), Math.max(x1, x2), cz - 0.08, cz + 0.08);
    box(0.08, h, 0.08, frame, x1, 0, z1, false, 0, 0.015);
    box(0.08, h, 0.08, frame, x2, 0, z2, false, 0, 0.015);
  }

  /** Text sign (plane). ry: 0 faces +z (south), PI faces north, PI/2 faces east, -PI/2 faces west. */
  function sign(text, bg, x, y, z, ry, w = 1.4, fg) {
    const lines = Array.isArray(text) ? text : [text];
    const tex = textTexture(lines, { w: 512, h: lines.length > 1 ? 256 : 128, bg, fg, sizes: lines.length > 1 ? [52, 36, 32] : [56] });
    return plane(w, lines.length > 1 ? w / 2 : w / 4, basic(tex), x, y, z, ry);
  }
  function poster(lines, opts, x, y, z, ry, w, h) {
    return plane(w, h, basic(textTexture(lines, opts)), x, y, z, ry);
  }

  /** Office desk with monitor + chair. facing -1: the person sits north of the desk and looks south. */
  const screenTex = (lines, bg) => textTexture(lines, { w: 256, h: 160, bg, sizes: [26, 20], weights: [800, 500], radius: 10, border: null });
  function desk(x, z, facing, { plate, screen, chair = '#b8f0d8', top = '#fffaf2', leg = '#c9b6ff', w = 1.5 } = {}) {
    box(w, 0.06, 0.75, top, x, 0.72, z, false);
    box(0.06, 0.72, 0.7, leg, x - w / 2 + 0.05, 0, z, false, 0, 0.015);
    box(0.06, 0.72, 0.7, leg, x + w / 2 - 0.05, 0, z, false, 0, 0.015);
    collideRect(x - w / 2, x + w / 2, z - 0.38, z + 0.38);
    const mz = z - facing * 0.2;
    box(0.06, 0.22, 0.06, '#ffffff', x, 0.78, mz, false, 0, 0.012);
    box(0.64, 0.4, 0.04, '#ffffff', x, 0.96, mz, false, 0, 0.02);
    if (screen) plane(0.56, 0.33, new THREE.MeshBasicMaterial({ map: screenTex(screen[0], screen[1]) }), x, 1.16, mz + facing * 0.025, facing > 0 ? 0 : Math.PI);
    box(0.45, 0.025, 0.15, '#ffffff', x, 0.78, z + facing * 0.1, false, 0, 0.012);
    if (chair) {
      const cz = z + facing * 0.7;
      box(0.5, 0.1, 0.5, chair, x, 0.42, cz, false);
      box(0.5, 0.55, 0.1, chair, x, 0.52, cz + facing * 0.24, false);
      cyl(0.03, 0.03, 0.42, '#ffffff', x, 0, cz, 8, 0.01);
    }
    if (plate) {
      const np = textTexture([plate], { w: 256, h: 64, bg: '#ffffff', sizes: [28], radius: 12 });
      plane(0.32, 0.08, basic(np), x + w / 2 - 0.3, 0.82, z + facing * 0.38, facing > 0 ? 0 : Math.PI);
    }
  }
  function plant(x, z, { s = 1, pot = '#ffb39a', leaf = '#8fd6a0', collide = true } = {}) {
    cyl(0.2 * s, 0.16 * s, 0.4 * s, pot, x, 0, z);
    for (let i = 0; i < 5; i++) sphere(0.22 * s, leaf, x + Math.cos(i * 1.3) * 0.12 * s, (0.6 + i * 0.12) * s, z + Math.sin(i * 1.3) * 0.12 * s, 0.018);
    if (collide) collideCircle(x, z, 0.25 * s);
  }
  /** Red paper lantern hanging from the ceiling at height top. */
  function lantern(x, z, top = 3, color = '#e74c3c') {
    cyl(0.004, 0.004, 0.45, '#333333', x, top - 0.45, z, 4, 0);
    const l = sphere(0.26, color, x, top - 0.72, z, 0.018); l.scale.y = 1.15;
    cyl(0.12, 0.12, 0.05, '#ffd25a', x, top - 0.47, z, 12, 0.01);
    cyl(0.12, 0.12, 0.05, '#ffd25a', x, top - 1.02, z, 12, 0.01);
    for (let i = 0; i < 3; i++) cyl(0.004, 0.004, 0.22, '#ffd25a', x - 0.04 + i * 0.04, top - 1.25, z, 4, 0);
    animated.push((t) => { l.rotation.y = Math.sin(t * 0.7 + x) * 0.2; });
  }
  function ceilingFan(x, z, top = 3, color = '#ffffff') {
    cyl(0.025, 0.025, 0.45, '#888888', x, top - 0.45, z, 6, 0.008);
    cyl(0.12, 0.12, 0.1, color, x, top - 0.55, z, 14, 0.012);
    const blades = new THREE.Group(); blades.position.set(x, top - 0.5, z); root.add(blades);
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.02, 0.14), mat(color)); outline(b, 0.01);
      b.position.set(Math.cos(i * 2.094) * 0.42, 0, Math.sin(i * 2.094) * 0.42); b.rotation.y = -i * 2.094; blades.add(b);
    }
    animated.push((t) => { blades.rotation.y = t * 5; });
  }
  function stool(x, z, c = '#ff5a6e', h = 0.45) { cyl(0.2, 0.17, h, c, x, 0, z, 14, 0.015); }
  function plasticChair(x, z, ry = 0, c = '#ff3b3b') {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; root.add(g);
    const add = (w, h, d, px, py, pz) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); outline(m, 0.015); m.position.set(px, py + h / 2, pz); g.add(m); };
    add(0.45, 0.06, 0.45, 0, 0.42, 0); add(0.45, 0.5, 0.06, 0, 0.45, -0.22);
    for (const [lx, lz] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) add(0.05, 0.42, 0.05, lx, 0, lz);
    return g;
  }
  /** Interactable registration: { id, label, pos: [x, y, z] } */
  function interact(id, label, x, y, z) { interactables.push({ id, label, pos: new THREE.Vector3(x, y, z) }); }

  function lights({ sky = '#ffffff', ground = '#ffe9d6', hemi = 1.6, amb = 0.45, sun = 1.1 } = {}) {
    root.add(new THREE.HemisphereLight(sky, ground, hemi));
    root.add(new THREE.AmbientLight('#ffffff', amb));
    const dir = new THREE.DirectionalLight('#fff6ea', sun);
    dir.position.set(-6, 10, 8); root.add(dir);
  }

  function result(extra) {
    return {
      colliders, interactables, root, ...extra,
      dispose() { scene.remove(root); root.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.map) o.material.map.dispose(); }); },
      update(t) { animated.forEach((f) => f(t)); },
    };
  }

  return {
    THREE, root, colliders, interactables, animated,
    box, cyl, sphere, plane, basic, glow, collideRect, collideCircle, floorZone, ceiling, wall, glassWall, sign, poster,
    desk, plant, lantern, ceilingFan, stool, plasticChair, interact, lights, result, canvasTex, textTexture, roundRect, INK, T,
  };
}

// ---------- floor painters (512×512 canvas, one tile) ----------
export const FLOORS = {
  /** Vietnamese encaustic cement tile (gạch bông). */
  gachBong: (c1 = '#c0392b', c2 = '#f6e7cf', c3 = '#2e6b5e') => (g, w, h) => {
    g.fillStyle = c2; g.fillRect(0, 0, w, h);
    g.fillStyle = c1;
    for (const [cx, cy] of [[0, 0], [w, 0], [0, h], [w, h]]) { g.beginPath(); g.arc(cx, cy, w * 0.28, 0, 7); g.fill(); }
    g.fillStyle = c3; g.beginPath(); g.moveTo(w / 2, h * 0.18); g.lineTo(w * 0.82, h / 2); g.lineTo(w / 2, h * 0.82); g.lineTo(w * 0.18, h / 2); g.closePath(); g.fill();
    g.fillStyle = c2; g.beginPath(); g.arc(w / 2, h / 2, w * 0.13, 0, 7); g.fill();
    g.fillStyle = c1; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; g.beginPath(); g.arc(w / 2 + Math.cos(a) * w * 0.2, h / 2 + Math.sin(a) * h * 0.2, w * 0.045, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 4; g.strokeRect(0, 0, w, h);
  },
  terrazzo: (base = '#e9e2d6', chips = ['#b9a68c', '#7d6e5d', '#d9c7a8', '#9b9083']) => (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 260; i++) { g.fillStyle = chips[i % chips.length]; g.beginPath(); g.arc(r() * w, r() * h, 2 + r() * 6, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 3; g.strokeRect(0, 0, w, h);
  },
  planks: (a = '#c98f5a', b = '#b57c4a') => (g, w, h) => {
    for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(0, i * h / 4, w, h / 4); }
    g.strokeStyle = 'rgba(60,30,10,0.35)'; g.lineWidth = 4;
    for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(0, i * h / 4); g.lineTo(w, i * h / 4); g.stroke(); }
    for (let i = 0; i < 4; i++) { const x = ((i * 197) % w); g.beginPath(); g.moveTo(x, i * h / 4); g.lineTo(x, (i + 1) * h / 4); g.stroke(); }
  },
  concrete: (base = '#c9c6bf', spot = 'rgba(0,0,0,0.06)') => (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    let s = 11; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 90; i++) { g.fillStyle = spot; g.beginPath(); g.arc(r() * w, r() * h, 6 + r() * 26, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 3; g.strokeRect(0, 0, w, h);
  },
  checker: (a = '#ffffff', b = '#d9e4ea') => (g, w, h) => {
    g.fillStyle = a; g.fillRect(0, 0, w, h); g.fillStyle = b; g.fillRect(0, 0, w / 2, h / 2); g.fillRect(w / 2, h / 2, w / 2, h / 2);
    g.strokeStyle = 'rgba(0,0,0,0.15)'; g.lineWidth = 3; g.strokeRect(0, 0, w, h);
  },
  tiles: (base = '#f4efe6', grout = 'rgba(0,0,0,0.14)') => (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h); g.strokeStyle = grout; g.lineWidth = 6; g.strokeRect(0, 0, w, h);
  },
  carpet: (base = '#8b9bb4', fleck = 'rgba(255,255,255,0.08)') => (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    let s = 3; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 900; i++) { g.fillStyle = fleck; g.fillRect(r() * w, r() * h, 3, 3); }
  },
};
