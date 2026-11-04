// Chibi characters (sticker outline, pastel toon) + name tags and objective markers.
import * as THREE from 'three';
import { INK, T, outline, canvasTex, roundRect } from './kit.js';

const SKIN = '#fcd9c9';
function part(geo, color, ghost, ol = 0.02) {
  const m = new THREE.Mesh(geo, ghost ? T(color, { transparent: true, opacity: 0.55, depthWrite: false }) : T(color));
  if (ol) outline(m, ol, ghost);
  return m;
}

export function makeCat(ghost = false) {
  const g = new THREE.Group();
  const body = part(new THREE.SphereGeometry(0.13, 16, 12), '#8d8a94', ghost, 0.018); body.scale.set(1.5, 0.75, 0.9); body.position.set(0, 0.07, 0);
  const belly = part(new THREE.SphereGeometry(0.1, 14, 10), '#ffffff', ghost, 0); belly.scale.set(1.3, 0.6, 0.8); belly.position.set(0.03, 0.05, 0.04);
  const head = part(new THREE.SphereGeometry(0.1, 16, 12), '#8d8a94', ghost, 0.018); head.position.set(0.17, 0.13, 0.04);
  const face = part(new THREE.SphereGeometry(0.07, 12, 10), '#ffffff', ghost, 0); face.scale.set(0.6, 0.8, 1); face.position.set(0.21, 0.11, 0.07);
  const earGeo = new THREE.ConeGeometry(0.035, 0.07, 8);
  const e1 = part(earGeo, '#8d8a94', ghost, 0.012); e1.position.set(0.15, 0.23, 0.0);
  const e2 = part(earGeo, '#8d8a94', ghost, 0.012); e2.position.set(0.15, 0.23, 0.09);
  const eyeM = new THREE.MeshBasicMaterial({ color: INK });
  const k1 = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), eyeM); k1.position.set(0.25, 0.15, 0.02);
  const k2 = k1.clone(); k2.position.z = 0.1;
  const tail = part(new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI * 1.1), '#8d8a94', ghost, 0.012);
  tail.position.set(-0.2, 0.15, 0.0); tail.rotation.z = -0.3;
  g.add(body, belly, head, face, e1, e2, k1, k2, tail);
  g.userData.tail = tail;
  return g;
}

export function makePerson(def, { ghost = false } = {}) {
  const g = new THREE.Group();
  const skinM = def.skin || SKIN;
  const legGeo = new THREE.CapsuleGeometry(0.075, 0.2, 4, 10);
  const legL = part(legGeo, def.pants || '#6b7a99', ghost); legL.position.set(-0.1, 0.2, 0);
  const legR = part(legGeo, def.pants || '#6b7a99', ghost); legR.position.set(0.1, 0.2, 0);
  const shoeGeo = new THREE.BoxGeometry(0.15, 0.08, 0.22);
  const fL = part(shoeGeo, '#ffffff', ghost, 0.015); fL.position.set(-0.1, 0.04, 0.03);
  const fR = part(shoeGeo, '#ffffff', ghost, 0.015); fR.position.set(0.1, 0.04, 0.03);
  const torso = part(new THREE.CylinderGeometry(0.2, 0.28, 0.5, 20), def.shirt || '#c9b6ff', ghost, 0.025); torso.position.y = 0.62;
  const collar = part(new THREE.TorusGeometry(0.12, 0.05, 8, 18), def.shirt || '#c9b6ff', ghost, 0.015); collar.rotation.x = Math.PI / 2; collar.position.y = 0.87;
  const armGeo = new THREE.CapsuleGeometry(0.07, 0.24, 4, 10);
  const armL = part(armGeo, def.shirt || '#c9b6ff', ghost); armL.position.set(-0.29, 0.66, 0); armL.rotation.z = 0.25;
  const armR = part(armGeo, def.shirt || '#c9b6ff', ghost); armR.position.set(0.29, 0.66, 0); armR.rotation.z = -0.25;
  const hand = new THREE.SphereGeometry(0.06, 10, 8);
  const hL = part(hand, skinM, ghost, 0.012); hL.position.set(0, -0.2, 0); armL.add(hL);
  const hR = part(hand, skinM, ghost, 0.012); hR.position.set(0, -0.2, 0); armR.add(hR);

  const head = new THREE.Group(); head.position.y = 1.15;
  const skull = part(new THREE.SphereGeometry(0.27, 24, 18), skinM, ghost, 0.03); skull.scale.set(1, 0.95, 0.95);
  head.add(skull);
  const eyeM = new THREE.MeshBasicMaterial({ color: INK });
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), eyeM); eL.position.set(-0.085, 0.0, 0.245);
  const eR = eL.clone(); eR.position.x = 0.085;
  const blushM = new THREE.MeshBasicMaterial({ color: '#ffadb9', transparent: true, opacity: 0.75 });
  const bL = new THREE.Mesh(new THREE.CircleGeometry(0.038, 14), blushM); bL.position.set(-0.15, -0.065, 0.225); bL.rotation.y = -0.45;
  const bR = new THREE.Mesh(new THREE.CircleGeometry(0.038, 14), blushM); bR.position.set(0.15, -0.065, 0.225); bR.rotation.y = 0.45;
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.006, 6, 12, Math.PI), eyeM); mouth.position.set(0, -0.075, 0.25); mouth.rotation.z = Math.PI;
  head.add(eL, eR, bL, bR, mouth);
  if (def.glasses) {
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.009, 6, 16), eyeM); r1.position.set(-0.085, 0.0, 0.255);
    const r2 = r1.clone(); r2.position.x = 0.085;
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.008, 0.008), eyeM); br.position.set(0, 0.01, 0.26);
    head.add(r1, r2, br);
  }
  // hair
  const hc = def.hairColor || '#1d1d1f';
  const hs = def.hair || 'short';
  const capHair = () => { const c = part(new THREE.SphereGeometry(0.29, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), hc, ghost, 0.025); c.position.y = 0.02; c.rotation.x = -0.35; return c; };
  if (hs === 'curly') {
    [[0, 0.2, -0.02, 0.15], [-0.15, 0.15, 0.02, 0.12], [0.15, 0.15, 0.02, 0.12], [-0.2, 0.02, -0.08, 0.11], [0.2, 0.02, -0.08, 0.11], [0, 0.12, -0.17, 0.15], [-0.08, 0.2, 0.1, 0.1], [0.09, 0.2, 0.1, 0.1], [-0.17, -0.1, -0.12, 0.09], [0.17, -0.1, -0.12, 0.09]]
      .forEach(([x, y, z, r]) => { const s = part(new THREE.SphereGeometry(r, 12, 10), hc, ghost, 0.022); s.position.set(x, y, z); head.add(s); });
  } else if (hs === 'beanie') {
    const b = part(new THREE.SphereGeometry(0.29, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), hc, ghost, 0.025); b.position.y = 0.04; head.add(b);
    const cuff = part(new THREE.TorusGeometry(0.27, 0.04, 8, 24), hc, ghost, 0.015); cuff.rotation.x = Math.PI / 2; cuff.position.y = 0.06; head.add(cuff);
    const pom = part(new THREE.SphereGeometry(0.06, 10, 8), '#ffffff', ghost, 0.015); pom.position.y = 0.34; head.add(pom);
  } else if (hs === 'cap') {
    const c = part(new THREE.SphereGeometry(0.285, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), hc, ghost, 0.025); c.position.y = 0.03; head.add(c);
    const brim = part(new THREE.BoxGeometry(0.26, 0.03, 0.18), hc, ghost, 0.012); brim.position.set(0, 0.06, 0.32); head.add(brim);
  } else if (hs === 'bald') {
    [-1, 1].forEach((sx) => { const t = part(new THREE.SphereGeometry(0.08, 10, 8), '#9a9a9a', ghost, 0.015); t.position.set(sx * 0.24, 0.0, -0.08); head.add(t); });
  } else {
    head.add(capHair());
    if (hs === 'long') { const b = part(new THREE.CapsuleGeometry(0.22, 0.25, 4, 12), hc, ghost, 0.022); b.position.set(0, -0.15, -0.12); b.scale.z = 0.6; head.add(b); }
    if (hs === 'wavy') [[-0.2, -0.1], [0.2, -0.1], [-0.17, -0.27], [0.17, -0.27], [0, -0.2]].forEach(([x, y]) => { const s = part(new THREE.SphereGeometry(0.11, 12, 10), hc, ghost, 0.02); s.position.set(x, y, -0.12); head.add(s); });
    if (hs === 'bun') { const b = part(new THREE.SphereGeometry(0.1, 12, 10), hc, ghost, 0.02); b.position.set(0, 0.22, -0.18); head.add(b); }
    if (hs === 'pony') { const p = part(new THREE.CapsuleGeometry(0.06, 0.22, 4, 10), hc, ghost, 0.018); p.position.set(0, -0.06, -0.3); p.rotation.x = 0.5; head.add(p); }
    if (hs === 'quiff') { const q = part(new THREE.SphereGeometry(0.13, 12, 10), hc, ghost, 0.02); q.scale.set(1.3, 0.8, 1); q.position.set(0.02, 0.24, 0.12); head.add(q); }
    if (hs === 'side') { const s = part(new THREE.SphereGeometry(0.12, 12, 10), hc, ghost, 0.02); s.scale.set(1.5, 0.6, 1.2); s.position.set(0.08, 0.2, 0.08); head.add(s); }
    if (hs === 'short') { const s = part(new THREE.SphereGeometry(0.1, 12, 10), hc, ghost, 0.02); s.scale.set(1.6, 0.6, 1); s.position.set(0, 0.22, 0.12); head.add(s); }
  }
  if (def.clip) { const c = part(new THREE.BoxGeometry(0.08, 0.03, 0.03), '#ff8fb1', ghost, 0.01); c.position.set(0.18, 0.15, 0.17); c.rotation.z = 0.5; head.add(c); }
  if (def.pods) [-1, 1].forEach((sx) => { const p = part(new THREE.CapsuleGeometry(0.018, 0.04, 4, 6), '#ffffff', ghost, 0.008); p.position.set(sx * 0.27, -0.03, 0); head.add(p); });
  if (def.cat) { const cat = makeCat(ghost); cat.position.set(-0.05, 0.27, -0.03); cat.rotation.y = -0.3; head.add(cat); g.userData.cat = cat; }

  if (def.tie) { const tie = part(new THREE.BoxGeometry(0.06, 0.28, 0.02), def.tie, ghost, 0.012); tie.position.set(0, 0.68, 0.24); tie.rotation.x = -0.12; g.add(tie); }
  if (def.notes) [['#ffc8dd', -0.08, 0.7], ['#b8f0d8', 0.08, 0.62], ['#bfe3ff', -0.02, 0.52]].forEach(([c, x, y]) => { const n = part(new THREE.BoxGeometry(0.09, 0.09, 0.01), c, ghost, 0.008); n.position.set(x, y, 0.25); n.rotation.x = -0.15; g.add(n); });
  if (def.mug) { const m = part(new THREE.CylinderGeometry(0.05, 0.045, 0.1, 12), '#ffffff', ghost, 0.012); m.position.set(0, -0.28, 0.05); armR.add(m); }
  if (def.phone) { const p = part(new THREE.BoxGeometry(0.07, 0.12, 0.015), '#ff8fa3', ghost, 0.01); p.position.set(0, -0.28, 0.06); armR.add(p); }
  if (def.tote) { const t = part(new THREE.BoxGeometry(0.2, 0.22, 0.06), '#fff1b8', ghost, 0.012); t.position.set(-0.05, -0.3, 0); armL.add(t); }

  g.add(legL, legR, fL, fR, torso, collar, armL, armR, head);
  g.userData.parts = { legL, legR, armL, armR, head, torso };
  return g;
}

// size: 'fp' (first-person Solo, default) or 'top' (bigger, for the elevated multiplayer camera)
export function nameTag(title, subtitle, { color = INK, ghost = false, size = 'fp' } = {}) {
  const tex = canvasTex(512, 140, (g, w, h) => {
    g.fillStyle = ghost ? '#cfe0ff' : '#ffffff';
    roundRect(g, 6, 6, w - 12, h - 12, 30); g.fill();
    g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '900 50px Be Vietnam Pro, Arial, sans-serif';
    g.fillText(title, w / 2, subtitle ? 52 : h / 2, w - 40);
    if (subtitle) { g.font = '600 28px Be Vietnam Pro, Arial, sans-serif'; g.fillStyle = '#6a6f80'; g.fillText(subtitle, w / 2, 100, w - 40); }
    if (color && !ghost) { g.fillStyle = color; g.beginPath(); g.arc(40, h / 2, 14, 0, 7); g.fill(); g.lineWidth = 4; g.stroke(); }
  });
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: true, transparent: true }));
  if (size === 'top') { sp.scale.set(1.45, 0.4, 1); sp.position.y = 1.95; }
  else { sp.scale.set(0.95, 0.26, 1); sp.position.y = 1.78; }
  return sp;
}

export function makeMarker() {
  const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.11), T('#ffd25a'));
  outline(m, 0.02);
  m.scale.y = 1.5;
  return m;
}
