// 3D room for an Overdeadline & Overburnout level, built from the level's station list (game/mp/levels.js).
// Everything is simple blocks + canvas textures in the game's pastel sticker style.
import * as THREE from 'three';
import { T, outline, textTexture, canvasTex, INK } from '../art/kit.js';
import { makePerson } from '../art/people.js';
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
      const boss = makePerson({ shirt: '#ff8fb1', pants: '#3a3f55', hair: 'bun', hairColor: '#2b1d1d', glasses: true });
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

export function buildRoom(scene, L) {
  const root = new THREE.Group();
  const W = L.room.w, D = L.room.d;
  // floor with a soft tile pattern
  const floorTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = L.floor; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(29,29,31,.08)'; g.lineWidth = 4;
    for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); }
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(W / 4, D / 4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.6, D + 0.6), new THREE.MeshToonMaterial({ map: floorTex }));
  floor.rotation.x = -Math.PI / 2;
  root.add(floor);
  // walls: tall at the back, low at the sides, none in front (the camera side)
  const wallH = 1.7;
  const back = box(W + 0.6, wallH, 0.3, L.wall); back.position.set(0, wallH / 2, -D / 2 - 0.15); root.add(back);
  const sideH = 0.7;
  const left = box(0.3, sideH, D, L.wall); left.position.set(-W / 2 - 0.15, sideH / 2, 0); root.add(left);
  const right = box(0.3, sideH, D, L.wall); right.position.set(W / 2 + 0.15, sideH / 2, 0); root.add(right);
  const front = box(W + 0.6, 0.25, 0.3, L.wall); front.position.set(0, 0.125, D / 2 + 0.15); root.add(front);
  // company sign on the back wall
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.7), new THREE.MeshBasicMaterial({ map: textTexture([`${L.emoji} ${L.client.toUpperCase()} × SOS ADVISORY`], { w: 1024, h: 170, sizes: [70], bg: '#fff8ef' }), transparent: true }));
  sign.position.set(-1.2, wallH + 0.4, -D / 2 - 0.12);
  root.add(sign);

  const colliders = [];
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

  // Scrum board + danger zone for the stand-up
  let standup = null;
  if (L.standup) {
    const b = L.standup.board;
    const board = new THREE.Group();
    board.position.set(b.x, 0, b.z);
    const legs = box(0.1, 1.2, 0.1, '#6a6f80', 0.015); legs.position.set(0, 0.6, 0); board.add(legs);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 1.7), [T('#ffffff'), T('#ffffff'), T('#ffffff'), T('#ffffff'), T('#ffffff'), T('#ffffff')]);
    outline(panel, 0.025);
    panel.position.set(0, 1.55, 0); board.add(panel);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ map: textTexture(['SCRUM', 'TODO · DOING · DONE', 'Stand-up 15 phút (*)'], { w: 512, h: 320, sizes: [80, 34, 30], bg: '#ffffff' }) }));
    face.rotation.y = -Math.PI / 2; face.position.set(-0.07, 1.55, 0); board.add(face);
    root.add(board);
    colliders.push({ minX: b.x - 0.15, maxX: b.x + 0.15, minZ: b.z - 0.85, maxZ: b.z + 0.85 });
    const zone = new THREE.Mesh(new THREE.CircleGeometry(L.standup.radius, 48), new THREE.MeshBasicMaterial({ color: '#ffc2b3', transparent: true, opacity: 0.22, depthWrite: false }));
    zone.rotation.x = -Math.PI / 2; zone.position.set(b.x, 0.015, b.z);
    root.add(zone);
    const coach = makePerson({ shirt: '#ffd25a', pants: '#3a3f55', hair: 'short', hairColor: '#1d1d1f', notes: true });
    coach.position.set(b.x - 0.5, 0, b.z + 1.3); coach.rotation.y = -Math.PI / 2 + 0.4;
    root.add(coach);
    standup = { zone, coach };
  }

  root.add(new THREE.HemisphereLight('#ffffff', '#ffe9d6', 1.6));
  root.add(new THREE.AmbientLight('#ffffff', 0.45));
  const dir = new THREE.DirectionalLight('#fff6ea', 1.1);
  dir.position.set(4, 10, 6);
  root.add(dir);

  scene.add(root);
  const bounds = { minX: -W / 2 + 0.3, maxX: W / 2 - 0.3, minZ: -D / 2 + 0.3, maxZ: D / 2 - 0.3 };
  return { root, stations, colliders, bounds, standup, dispose() { scene.remove(root); } };
}
