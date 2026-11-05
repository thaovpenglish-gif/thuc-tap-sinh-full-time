// 3D room for an Overdeadline & Overburnout level, built from the level's station list (game/mp/levels.js).
// Everything is simple blocks + canvas textures in the game's pastel sticker style.
import * as THREE from 'three';
import { T, outline, textTexture, canvasTex, INK } from '../art/kit.js';
import { makePerson, makeCat, nameTag } from '../art/people.js';
import { ITEMS } from '../game/mp/engine.js';

const box = (w, h, d, color, ol = 0.03) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), T(color)); if (ol) outline(m, ol); return m; };
const cyl = (rt, rb, h, color, ol = 0.025) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 20), T(color)); if (ol) outline(m, ol); return m; };

export const STATION = { w: 1.15, h: 0.9, d: 0.85 };
const TOP = STATION.h;

function label(text, icon, bg = '#ffffff') {
  const tex = textTexture([`${icon} ${text}`], { w: 512, h: 128, sizes: [64], bg, radius: 40 });
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set(1.3, 0.325, 1);
  sp.renderOrder = 5;
  return sp;
}

/** A progress bar that always faces the camera. set(v 0..1, color) */
export function makeBar(width = 0.9, height = 0.13) {
  const g = new THREE.Group();
  const bg = new THREE.Sprite(new THREE.SpriteMaterial({ color: INK, depthTest: false, transparent: true }));
  bg.scale.set(width + 0.06, height + 0.06, 1);
  const fill = new THREE.Sprite(new THREE.SpriteMaterial({ color: '#9be7c4', depthTest: false, transparent: true }));
  fill.center.set(0, 0.5);
  fill.position.x = -width / 2;
  fill.scale.set(0.001, height, 1);
  bg.renderOrder = 10; fill.renderOrder = 11;
  g.add(bg, fill);
  g.visible = false;
  g.set = (v, color) => {
    g.visible = v > 0.001;
    fill.scale.x = Math.max(0.001, Math.min(1, v)) * width;
    if (color) fill.material.color.set(color);
  };
  return g;
}

// one canvas texture per item type
const itemTex = {};
function itemSprite(type) {
  if (!itemTex[type]) {
    const it = ITEMS[type];
    itemTex[type] = canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = it.color; g.beginPath(); g.arc(w / 2, h / 2, 56, 0, 7); g.fill();
      g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
      g.font = '64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK;
      g.fillText(it.icon, w / 2, h / 2 + 4);
    });
  }
  // drawn on top so a carried item is never hidden behind its carrier
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: itemTex[type], transparent: true, depthWrite: false, depthTest: false }));
  sp.scale.set(0.5, 0.5, 1);
  sp.renderOrder = 6;
  return sp;
}

/** Just the round icon of an item (client speech bubbles). */
export function itemIcon(type) { return itemSprite(type); }

/** A carried / placed item: a little paper stack + a round icon. */
export function makeItem(type) {
  const g = new THREE.Group();
  const paper = box(0.44, 0.1, 0.32, ITEMS[type].color, 0.018);
  paper.position.y = 0.05;
  const icon = itemSprite(type);
  icon.position.y = 0.42;
  g.add(paper, icon);
  g.userData = { type, paper, icon };
  g.setType = (t) => {
    if (g.userData.type === t) return;
    g.userData.type = t;
    paper.material = T(ITEMS[t].color);
    g.remove(g.userData.icon);
    g.userData.icon = itemSprite(t); g.userData.icon.position.y = 0.42; g.add(g.userData.icon);
  };
  return g;
}

function stationMesh(s, L) {
  const g = new THREE.Group();
  g.position.set(s.x, 0, s.z);
  const add = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m; };
  const counter = (top = '#ffffff', body = '#e8dcff') => {
    add(box(STATION.w, TOP - 0.08, STATION.d, body), 0, (TOP - 0.08) / 2, 0);
    add(box(STATION.w + 0.06, 0.08, STATION.d + 0.06, top, 0.02), 0, TOP - 0.04, 0);
  };
  let icon = '🗄️', bg = '#ffffff';
  switch (s.kind) {
    case 'source': {
      const c = ITEMS[s.gives].color;
      counter('#ffffff', '#f6efe3');
      for (let i = 0; i < 3; i++) add(box(0.46, 0.08, 0.34, c, 0.015), (i - 1) * 0.08, TOP + 0.05 + i * 0.09, (i % 2) * 0.05 - 0.05).rotation.y = i * 0.2 - 0.2;
      icon = ITEMS[s.gives].icon; bg = c;
      break;
    }
    case 'laptop': {
      counter('#ffffff', '#d9ecff');
      const base = add(box(0.5, 0.04, 0.34, '#c4c8d4', 0.012), 0, TOP + 0.02, 0.1);
      base.rotation.y = 0;
      const lid = add(box(0.5, 0.32, 0.03, '#c4c8d4', 0.012), 0, TOP + 0.18, -0.08);
      lid.rotation.x = -0.25;
      const scr = add(new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.26), new THREE.MeshBasicMaterial({ color: '#bfe3ff' })), 0, TOP + 0.18, -0.06);
      scr.rotation.x = -0.25;
      icon = '💻'; bg = '#d9ecff';
      break;
    }
    case 'printer': {
      counter('#ffffff', '#e4e4ea');
      add(box(0.7, 0.3, 0.5, '#f4f4f6', 0.02), 0, TOP + 0.15, -0.08);
      add(box(0.5, 0.03, 0.2, '#ffffff', 0.012), 0, TOP + 0.31, 0.22);
      icon = '🖨️'; bg = '#f0f0f4';
      break;
    }
    case 'boss': {
      add(box(STATION.w + 0.4, TOP - 0.08, STATION.d, '#b9a2f0'), 0, (TOP - 0.08) / 2, 0);
      add(box(STATION.w + 0.46, 0.08, STATION.d + 0.06, '#ffffff', 0.02), 0, TOP - 0.04, 0);
      const boss = makePerson((L.boss && L.boss.look) || { shirt: '#ff8fb1', pants: '#3a3f55', hair: 'bun', hairColor: '#2b1d1d', glasses: true });
      boss.position.set(0, 0, -0.85); boss.scale.setScalar(1.05);
      g.add(boss);
      icon = '✍️'; bg = '#ffc8dd';
      break;
    }
    case 'counter': counter('#ffffff', s.z === 0 ? '#fff1b8' : '#f6efe3'); icon = '🗂️'; bg = '#fff1b8'; break;
    case 'deliver': {
      add(box(STATION.w + 0.7, TOP - 0.08, STATION.d, '#9be7c4'), 0, (TOP - 0.08) / 2, 0);
      add(box(STATION.w + 0.76, 0.08, STATION.d + 0.06, '#ffffff', 0.02), 0, TOP - 0.04, 0);
      add(cyl(0.08, 0.12, 0.08, '#ffd25a', 0.015), 0.55, TOP + 0.04, 0.1);
      icon = '🛎️'; bg = '#b8f0d8';
      break;
    }
    case 'trash': {
      add(cyl(0.36, 0.3, 0.75, '#8d93a6'), 0, 0.375, 0);
      add(cyl(0.39, 0.39, 0.06, '#6a6f80', 0.015), 0, 0.78, 0);
      icon = '🗑️'; bg = '#e4e4ea';
      break;
    }
    case 'coffee': {
      counter('#ffffff', '#ffe9a0');
      add(box(0.42, 0.5, 0.36, '#5a4a42', 0.02), -0.15, TOP + 0.25, -0.1);
      add(cyl(0.07, 0.06, 0.12, '#ffffff', 0.012), 0.3, TOP + 0.06, 0.15);
      icon = '☕'; bg = '#ffe9a0';
      break;
    }
  }
  const lb = label(s.label, icon, bg);
  lb.position.set(0, s.kind === 'boss' ? 2.35 : 1.75, s.z > 0 ? -0.1 : 0);
  if (s.kind === 'boss') lb.scale.multiplyScalar(1.15);
  g.add(lb);
  const bar = makeBar();
  bar.position.set(0, 1.35, 0.2);
  g.add(bar);
  const slot = new THREE.Group();
  slot.position.set(0, TOP + (s.kind === 'laptop' ? 0.06 : s.kind === 'printer' ? 0.32 : 0.02), s.kind === 'laptop' ? 0.18 : s.kind === 'printer' ? 0.18 : 0);
  g.add(slot);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.72, 40), new THREE.MeshBasicMaterial({ color: '#ffd25a', transparent: true, opacity: 0.9, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.02, s.z < 0 ? 0.7 : s.z > 0 ? -0.7 : 0.7); ring.visible = false;
  g.add(ring);
  g.userData = { slot, bar, ring, label: lb };
  return g;
}

// ---------- decor ----------
function decorMesh(d, L) {
  const g = new THREE.Group();
  g.position.set(d.x, 0, d.z);
  const add = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m; };
  let col = null; // collider half sizes
  switch (d.kind) {
    case 'desk': {
      add(box(1.3, 0.72, 0.7, '#ffffff'), 0, 0.36, 0);
      // the person sits behind the desk, facing the camera; we see the back of the monitor
      add(box(0.5, 0.34, 0.05, '#3a3f55', 0.012), 0, 0.92, 0.14);
      add(box(0.12, 0.2, 0.08, '#3a3f55', 0.01), 0, 0.8, 0.14);
      add(box(0.36, 0.02, 0.14, '#e4e4ea', 0.008), 0, 0.73, -0.12);
      if (d.npc && TMLOOK(L, d.npc)) {
        const p = makePerson(TMLOOK(L, d.npc).look); p.position.set(0, 0, -0.62); g.add(p);
        g.userData.typer = p;
      }
      col = [0.65, 0.35];
      break;
    }
    case 'plant': {
      add(cyl(0.2, 0.16, 0.36, '#e8a77d'), 0, 0.18, 0);
      for (let i = 0; i < 5; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), T('#7fcf8f')); outline(l, 0.015); l.position.set(Math.cos(i * 1.3) * 0.13, 0.55 + (i % 2) * 0.16, Math.sin(i * 1.3) * 0.13); g.add(l); }
      col = [0.25, 0.25];
      break;
    }
    case 'window': {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9), new THREE.MeshBasicMaterial({ color: '#bfe3ff' }));
      w.position.set(0, 1.15, 0.16); g.add(w);
      const fr = box(1.9, 0.08, 0.05, '#ffffff', 0.01); fr.position.set(0, 1.15, 0.18); g.add(fr);
      const fr2 = box(0.08, 0.95, 0.05, '#ffffff', 0.01); fr2.position.set(0, 1.15, 0.18); g.add(fr2);
      break;
    }
    case 'boxes': {
      add(box(0.5, 0.36, 0.4, '#e8c69a'), 0, 0.18, 0); add(box(0.42, 0.3, 0.36, '#f0d4ae'), 0.05, 0.51, 0.02).rotation.y = 0.3;
      col = [0.3, 0.25];
      break;
    }
    case 'shelf': {
      add(box(0.5, 1.4, 1.2, '#b9a2f0'), 0, 0.7, 0);
      ['#ffd25a', '#ffffff', '#ff8fb1'].forEach((c, i) => add(box(0.3, 0.22, 0.22, c, 0.01), -0.1, 0.45 + i * 0.4, (i - 1) * 0.3));
      col = [0.25, 0.6];
      break;
    }
    case 'chair': add(cyl(0.22, 0.22, 0.45, '#3a3f55', 0.015), 0, 0.22, 0); add(box(0.46, 0.4, 0.08, '#3a3f55', 0.012), 0, 0.62, -0.2); break;
    case 'fridge': add(box(0.8, 1.6, 0.7, '#ffffff'), 0, 0.8, 0); add(box(0.05, 0.4, 0.05, '#c4c8d4', 0.008), 0.3, 1.1, 0.36); col = [0.4, 0.35]; break;
    case 'cafetable': {
      add(cyl(0.55, 0.55, 0.06, '#ffffff', 0.02), 0, 0.72, 0); add(cyl(0.06, 0.06, 0.7, '#6a6f80', 0.01), 0, 0.36, 0);
      [[-0.8, 0], [0.8, 0]].forEach(([x, z]) => add(cyl(0.2, 0.2, 0.42, '#ffe08a', 0.015), x, 0.21, z));
      if (d.cat) { const c = makeCat(); c.position.set(0, 0.76, 0); c.rotation.y = 0.6; g.add(c); g.userData.cat = c; }
      col = [0.6, 0.6];
      break;
    }
    case 'meeting': {
      add(box(3.2, 0.7, 1.3, '#ffffff'), 0, 0.35, 0);
      for (const x of [-1.1, 0, 1.1]) for (const z of [-0.95, 0.95]) add(cyl(0.2, 0.2, 0.42, '#a8dcc0', 0.015), x, 0.21, z);
      const lap = box(0.4, 0.03, 0.28, '#c4c8d4', 0.01); lap.position.set(-0.6, 0.72, 0); g.add(lap);
      col = [1.6, 0.65];
      break;
    }
    case 'tv': {
      add(box(0.12, 0.9, 1.6, '#3a3f55'), 0, 1.2, 0);
      const sc = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.75), new THREE.MeshBasicMaterial({ map: textTexture(['Q4 OKR', 'Synergy ↑ · Burnout ↑'], { w: 512, h: 260, sizes: [70, 34], bg: '#bfe3ff' }) }));
      sc.rotation.y = Math.PI / 2; sc.position.set(0.07, 1.2, 0); g.add(sc);
      col = [0.1, 0.8];
      break;
    }
    case 'sofa': {
      add(box(2.4, 0.4, 0.8, '#c9b6ff'), 0, 0.2, 0); add(box(2.4, 0.5, 0.25, '#b9a2f0'), 0, 0.55, 0.3);
      add(box(0.25, 0.55, 0.8, '#b9a2f0'), -1.2, 0.3, 0); add(box(0.25, 0.55, 0.8, '#b9a2f0'), 1.2, 0.3, 0);
      col = [1.3, 0.4];
      break;
    }
    case 'reception': {
      add(box(1.6, 1.0, 0.6, '#ffe9a0'), 0, 0.5, 0); add(box(1.7, 0.06, 0.7, '#ffffff', 0.015), 0, 1.03, 0);
      if (d.npc && TMLOOK(L, d.npc)) { const p = makePerson(TMLOOK(L, d.npc).look); p.position.set(0, 0, 0.6); p.rotation.y = Math.PI; g.add(p); }
      const sign = label('Lễ tân · Chị Gấm', '🛎️', '#ffe9a0'); sign.position.set(0, 2.2, 0); sign.scale.multiplyScalar(0.9); g.add(sign);
      col = [0.8, 0.3];
      break;
    }
  }
  return { mesh: g, col };
}
// the look of a named T&M person used by decor (receptionist, people at desks)
function TMLOOK(L, id) {
  const all = [...(L.clients || []), L.boss, L.standup && L.standup.coach].filter(Boolean);
  const names = { bao: 'Bảo', trang: 'Trang', gam: 'Chị Gấm' };
  if (names[id]) return EXTRA[id] || all.find((c) => c.name === names[id]);
  return null;
}
const EXTRA = {
  bao: { name: 'Bảo', look: { shirt: '#ffd3b8', pants: '#5b6b9a', hair: 'cap', hairColor: '#7fb3ff' } },
  trang: { name: 'Trang', look: { shirt: '#ffc6e0', pants: '#7d86b3', hair: 'long', hairColor: '#3b2418', clip: true } },
  gam: { name: 'Chị Gấm', look: { shirt: '#ffe9a0', pants: '#8a6a5a', hair: 'wavy', hairColor: '#4a3226' } },
};

/** A client (T&M person) who walks into the lobby; bubble + patience bar above the head. */
export function makeClient(c) {
  const p = makePerson(c.look);
  const tag = nameTag(c.name, null, { size: 'top' });
  tag.position.y = 1.95; tag.scale.multiplyScalar(0.85);
  p.add(tag);
  const bar = makeBar(0.8, 0.1);
  bar.position.y = 2.25;
  p.add(bar);
  p.userData.bar = bar;
  return p;
}

export function buildRoom(scene, L) {
  const root = new THREE.Group();
  const W = L.room.w, D = L.room.d;
  const colliders = [];
  // floors, one per room, with a soft tile pattern
  const tile = (color) => {
    const t = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(29,29,31,.07)'; g.lineWidth = 3;
      for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * w / 4, 0); g.lineTo(i * w / 4, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / 4); g.lineTo(w, i * h / 4); g.stroke(); }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  };
  for (const r of L.rooms) {
    const w = r.x1 - r.x0, d = r.z1 - r.z0;
    const t = tile(r.floor); t.repeat.set(w / 2, d / 2);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshToonMaterial({ map: t }));
    f.rotation.x = -Math.PI / 2; f.position.set((r.x0 + r.x1) / 2, 0, (r.z0 + r.z1) / 2);
    root.add(f);
    // room name on a sign above its door
    if (r.name && r.sign) {
      const sg = label(r.name, r.icon || '', r.color || '#ffffff');
      sg.position.set(r.sign[0], 1.55, r.sign[1]);
      sg.scale.set(1.55, 0.39, 1);
      root.add(sg);
    }
  }
  // outer walls: tall at the back, low at the sides, a kerb in front (the camera side) with the lobby entrance
  const wallH = 1.7, sideH = 0.9;
  const back = box(W + 0.6, wallH, 0.3, L.wall); back.position.set(0, wallH / 2, -D / 2 - 0.15); root.add(back);
  const left = box(0.3, sideH, D, L.wall); left.position.set(-W / 2 - 0.15, sideH / 2, 0); root.add(left);
  // right wall with the lobby door (z 3.6–5.2)
  const rTop = box(0.3, sideH, 3.6 + D / 2, L.wall); rTop.position.set(W / 2 + 0.15, sideH / 2, (-D / 2 + 3.6) / 2); root.add(rTop);
  const rBot = box(0.3, sideH, D / 2 - 5.2, L.wall); rBot.position.set(W / 2 + 0.15, sideH / 2, (5.2 + D / 2) / 2); root.add(rBot);
  const front = box(W + 0.6, 0.25, 0.3, L.wall); front.position.set(0, 0.125, D / 2 + 0.15); root.add(front);
  // company sign on the back wall
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.72), new THREE.MeshBasicMaterial({ map: textTexture([`${L.emoji} ${L.client.toUpperCase()} × SOS ADVISORY`], { w: 1024, h: 170, sizes: [70], bg: '#fff8ef' }), transparent: true }));
  sign.position.set(1, wallH + 0.42, -D / 2 - 0.12);
  root.add(sign);

  // inner walls (partitions); glass ones are see-through
  const partH = 1.05;
  for (const w of L.walls || []) {
    const horiz = w.z0 === w.z1;
    const len = horiz ? Math.abs(w.x1 - w.x0) : Math.abs(w.z1 - w.z0);
    const cx = (w.x0 + w.x1) / 2, cz = (w.z0 + w.z1) / 2;
    const sx = horiz ? len : 0.15, sz = horiz ? 0.15 : len;
    let m;
    if (w.kind === 'glass') {
      m = new THREE.Mesh(new THREE.BoxGeometry(sx, partH + 0.3, sz), new THREE.MeshBasicMaterial({ color: '#bfe3ff', transparent: true, opacity: 0.35, depthWrite: false }));
      m.position.set(cx, (partH + 0.3) / 2, cz);
      const rail = box(horiz ? len : 0.17, 0.06, horiz ? 0.17 : len, '#ffffff', 0.012); rail.position.set(cx, partH + 0.33, cz); root.add(rail);
    } else {
      m = box(sx, partH, sz, '#e3d9ff', 0.02);
      m.position.set(cx, partH / 2, cz);
      const cap = box(horiz ? len + 0.02 : 0.19, 0.05, horiz ? 0.19 : len + 0.02, '#ffffff', 0.01); cap.position.set(cx, partH + 0.025, cz); root.add(cap);
    }
    root.add(m);
    colliders.push({ minX: cx - sx / 2, maxX: cx + sx / 2, minZ: cz - sz / 2, maxZ: cz + sz / 2 });
  }
  // door mats
  for (const [x, z, v] of L.floorDoorMats || []) {
    const mat = new THREE.Mesh(new THREE.PlaneGeometry(v ? 0.6 : 1.5, v ? 1.5 : 0.6), new THREE.MeshBasicMaterial({ color: '#d9c7ff', transparent: true, opacity: 0.8 }));
    mat.rotation.x = -Math.PI / 2; mat.position.set(x - (v ? 0.4 : 0), 0.01, z); root.add(mat);
  }
  // decor
  const typers = [];
  let cat = null;
  for (const d of L.decor || []) {
    const { mesh, col } = decorMesh(d, L);
    root.add(mesh);
    if (mesh.userData.typer) typers.push(mesh.userData.typer);
    if (mesh.userData.cat) cat = mesh.userData.cat;
    if (col) colliders.push({ minX: d.x - col[0], maxX: d.x + col[0], minZ: d.z - col[1] - (d.kind === 'desk' && d.npc ? 0.6 : 0), maxZ: d.z + col[1] });
  }

  const stations = {};
  for (const s of L.stations) {
    const m = stationMesh(s, L);
    root.add(m);
    stations[s.id] = m;
    const w = s.kind === 'deliver' ? STATION.w + 0.7 : s.kind === 'boss' ? STATION.w + 0.4 : s.kind === 'trash' ? 0.75 : STATION.w;
    const d = s.kind === 'trash' ? 0.75 : STATION.d;
    colliders.push({ minX: s.x - w / 2, maxX: s.x + w / 2, minZ: s.z - d / 2, maxZ: s.z + d / 2 });
  }
  // the boss sits behind her desk: block that strip too
  const bossDef = L.stations.find((s) => s.kind === 'boss');
  if (bossDef) colliders.push({ minX: bossDef.x - 0.8, maxX: bossDef.x + 0.8, minZ: -D / 2, maxZ: bossDef.z });

  // Scrum board (free-standing in the corridor, facing the camera) + danger zone for the stand-up
  let standup = null;
  if (L.standup) {
    const b = L.standup.board;
    const board = new THREE.Group();
    board.position.set(b.x, 0, b.z);
    [-0.75, 0.75].forEach((x) => { const leg = box(0.08, 1.15, 0.08, '#6a6f80', 0.012); leg.position.set(x, 0.58, 0); board.add(leg); });
    const panel = box(1.7, 1.05, 0.1, '#ffffff', 0.025); panel.position.set(0, 1.55, 0); board.add(panel);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.95), new THREE.MeshBasicMaterial({ map: textTexture(['SCRUM', 'TODO · DOING · DONE', 'Stand-up 15 phút (*)'], { w: 512, h: 300, sizes: [78, 32, 28], bg: '#ffffff' }) }));
    face.position.set(0, 1.55, 0.06); board.add(face);
    root.add(board);
    colliders.push({ minX: b.x - 0.85, maxX: b.x + 0.85, minZ: b.z - 0.1, maxZ: b.z + 0.1 });
    const zone = new THREE.Mesh(new THREE.CircleGeometry(L.standup.radius, 48), new THREE.MeshBasicMaterial({ color: '#ffc2b3', transparent: true, opacity: 0.22, depthWrite: false }));
    zone.rotation.x = -Math.PI / 2; zone.position.set(b.x, 0.015, b.z);
    root.add(zone);
    const coach = makePerson((L.standup.coach && L.standup.coach.look) || { shirt: '#ffd25a', pants: '#3a3f55', hair: 'short', hairColor: '#1d1d1f', notes: true });
    coach.position.set(b.x + 1.15, 0, b.z + 0.35); coach.rotation.y = -0.5;
    root.add(coach);
    colliders.push({ minX: b.x + 0.85, maxX: b.x + 1.45, minZ: b.z + 0.05, maxZ: b.z + 0.65 });
    standup = { zone, coach };
  }

  root.add(new THREE.HemisphereLight('#ffffff', '#ffe9d6', 1.6));
  root.add(new THREE.AmbientLight('#ffffff', 0.45));
  const dir = new THREE.DirectionalLight('#fff6ea', 1.1);
  dir.position.set(4, 10, 6);
  root.add(dir);

  scene.add(root);
  const bounds = { minX: -W / 2 + 0.3, maxX: W / 2 - 0.3, minZ: -D / 2 + 0.3, maxZ: D / 2 - 0.3 };
  return {
    root, stations, colliders, bounds, standup,
    // little life in the office: people typing, the cat breathing
    animate(t) {
      typers.forEach((p, i) => { const a = p.userData.parts; if (a) { a.armL.rotation.x = -1 + Math.sin(t * 18 + i) * 0.15; a.armR.rotation.x = -1 - Math.sin(t * 18 + i) * 0.15; } });
      if (cat) cat.scale.y = 1 + Math.sin(t * 2) * 0.04;
    },
    dispose() { scene.remove(root); },
  };
}
