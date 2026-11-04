// Art kit: canvas textures, toon materials and sticker outlines shared by every map and character.
import * as THREE from 'three';

export const INK = '#1d1d1f';

export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function roundRect(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }

export function textTexture(lines, { w = 512, h = 256, bg = '#ffffff', fg = INK, font = 'Be Vietnam Pro, Arial, sans-serif', sizes = [], weights = [], align = 'center', pad = 24, border = INK, radius = 28 } = {}) {
  return canvasTex(w, h, (g) => {
    if (bg) {
      g.fillStyle = bg; roundRect(g, 4, 4, w - 8, h - 8, radius); g.fill();
      if (border) { g.strokeStyle = border; g.lineWidth = 8; g.stroke(); }
    }
    g.fillStyle = fg; g.textAlign = align; g.textBaseline = 'middle';
    const total = lines.reduce((a, _, i) => a + (sizes[i] || 40) * 1.25, 0);
    let y = h / 2 - total / 2;
    lines.forEach((ln, i) => {
      const sz = sizes[i] || 40;
      g.font = `${weights[i] || 800} ${sz}px ${font}`;
      y += sz * 0.625;
      const x = align === 'left' ? pad : align === 'right' ? w - pad : w / 2;
      g.fillText(ln, x, y, w - pad * 2);
      y += sz * 0.625;
    });
  });
}

// ---------- toon materials + sticker outline ----------
export const gradientMap = (() => {
  const t = new THREE.DataTexture(new Uint8Array([150, 215, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
})();
const matCache = new Map();
export function T(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!opts.transparent && matCache.has(key)) return matCache.get(key);
  const m = new THREE.MeshToonMaterial({ color, gradientMap, ...opts });
  if (!opts.transparent) matCache.set(key, m);
  return m;
}
const outlineMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
const outlineGhost = new THREE.MeshBasicMaterial({ color: '#4a6bd8', side: THREE.BackSide, transparent: true, opacity: 0.5, depthWrite: false });
export function outline(mesh, t = 0.025, ghost = false) {
  const g = mesh.geometry;
  if (!g.boundingBox) g.computeBoundingBox();
  const s = new THREE.Vector3(); g.boundingBox.getSize(s);
  const o = new THREE.Mesh(g, ghost ? outlineGhost : outlineMat);
  o.scale.set(s.x > 1e-4 ? (s.x + 2 * t) / s.x : 1, s.y > 1e-4 ? (s.y + 2 * t) / s.y : 1, s.z > 1e-4 ? (s.z + 2 * t) / s.z : 1);
  o.raycast = () => {};
  mesh.add(o);
  return mesh;
}
