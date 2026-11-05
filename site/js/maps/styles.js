// Office styles: the same floor plan (so every story spot stays valid) dressed differently per company:
// floor material, wall tint, ceiling decoration, light tone and two big set pieces in areas no story uses
// (south-west band x −14.5…−7.5, z 5.6…7.4 and the east wall strip x 13.6…14.7, z 5.4…9.6).
import * as THREE from 'three';

export const STYLES = {
  tm:        { floor: 'wood',     wall: null,      light: '#ffffff', ceiling: null },
  workshop:  { floor: 'tile',     wall: '#ffe9cf', light: '#fff1dc', ceiling: 'lanterns' },
  startup:   { floor: 'concrete', wall: '#e4ebf7', light: '#eef4ff', ceiling: 'pipes' },
  studio:    { floor: 'checker',  wall: '#ffe3ef', light: '#fff4fb', ceiling: 'bunting' },
  corporate: { floor: 'carpet',   wall: '#eef1f4', light: '#f4f8ff', ceiling: 'panels' },
  warehouse: { floor: 'darkconcrete', wall: '#e8e2f5', light: '#fff0e6', ceiling: 'stringlights' },
  cozy:      { floor: 'lightwood', wall: '#e9f4e6', light: '#fffaf0', ceiling: 'plants' },
};

/** Paint the floor texture for a style (512×512 canvas, repeated). */
export function paintFloor(kind, g, w, h) {
  const planks = (base, a, b, c, line) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let j = 0; j < 8; j++) {
      const off = (j % 2) * 128;
      for (let i = -1; i < 3; i++) { g.fillStyle = (i + j) % 3 === 0 ? a : (i + j) % 3 === 1 ? b : c; g.fillRect(i * 256 + off + 2, j * 64 + 2, 252, 60); }
    }
    g.strokeStyle = line; g.lineWidth = 3;
    for (let j = 0; j <= 8; j++) { g.beginPath(); g.moveTo(0, j * 64); g.lineTo(w, j * 64); g.stroke(); }
  };
  const grid = (base, line, step, alt) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    if (alt) for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (((x + y) / step) % 2 === 0) { g.fillStyle = alt; g.fillRect(x, y, step, step); }
    g.strokeStyle = line; g.lineWidth = 3;
    for (let x = 0; x <= w; x += step) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y <= h; y += step) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  };
  const speckle = (base, dots, n) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) { g.fillStyle = dots[i % dots.length]; g.fillRect(r() * w, r() * h, 3 + r() * 4, 3 + r() * 4); }
  };
  switch (kind) {
    case 'tile': grid('#fbf4e8', 'rgba(170,140,100,.35)', 128); break;
    case 'concrete': speckle('#d9dde3', ['#c8cdd5', '#e6e9ee', '#bfc5ce'], 900); g.strokeStyle = 'rgba(90,100,120,.25)'; g.lineWidth = 3; g.strokeRect(1, 1, w - 2, h - 2); break;
    case 'darkconcrete': speckle('#b9b4c4', ['#a9a3b6', '#c6c1d0', '#9d97ab'], 900); g.strokeStyle = 'rgba(60,50,80,.25)'; g.lineWidth = 3; g.strokeRect(1, 1, w - 2, h - 2); break;
    case 'checker': grid('#fff3c4', 'rgba(29,29,31,.12)', 128, '#ffd6e6'); break;
    case 'carpet': speckle('#b9c7d8', ['#aebdd0', '#c4d0de', '#a6b6ca'], 2500); grid('rgba(0,0,0,0)', 'rgba(70,90,120,.25)', 256); break;
    case 'lightwood': planks('#fbf0dd', '#f7e9cf', '#fdf5e6', '#f9eedb', 'rgba(170,130,80,.2)'); break;
    default: planks('#f6e3c6', '#f3dcbc', '#f8e8cf', '#f5dfc2', 'rgba(160,110,70,0.25)');
  }
}

/** Add the style's ceiling decoration and set pieces. H = helpers from buildWorld. */
export function decorate(styleId, H) {
  const { box, cyl, sphere, plane, basic, textTexture, canvasTex, roundRect, INK, collideRect, animated, root } = H;
  const st = STYLES[styleId] || STYLES.tm;
  const sign = (lines, bg, w, h, x, y, z, ry, sizes) => plane(w, h, basic(textTexture(lines, { w: 512, h: Math.round(512 * h / w), bg, sizes: sizes || [56, 34] })), x, y, z, ry);
  const glow = (c) => new THREE.MeshBasicMaterial({ color: c });

  // ---------- ceiling ----------
  if (st.ceiling === 'lanterns') {
    for (let i = 0; i < 8; i++) {
      const x = -9 + (i % 4) * 6, z = -5 + Math.floor(i / 4) * 8;
      cyl(0.004, 0.004, 0.5, '#333333', x, 2.5, z, 4, 0);
      const l = sphere(0.28, glow('#ff4d4d'), x, 2.3, z, 0.02); l.scale.y = 1.25;
      cyl(0.16, 0.16, 0.06, '#ffd25a', x, 2.62, z, 12, 0.01); cyl(0.16, 0.16, 0.06, '#ffd25a', x, 1.94, z, 12, 0.01);
      animated.push((t) => { l.rotation.y = Math.sin(t * 0.8 + i) * 0.3; });
    }
  } else if (st.ceiling === 'pipes') {
    for (const z of [-6, 0, 6]) { const p = cyl(0.12, 0.12, 29, '#8c95a6', 0, 2.75, z, 12, 0.015); p.rotation.z = Math.PI / 2; p.position.set(0, 2.75, z); }
    for (let x = -12; x <= 12; x += 6) for (const z of [-3, 3]) { cyl(0.006, 0.006, 0.7, '#333333', x, 2.3, z, 4, 0); const s = cyl(0.25, 0.08, 0.22, '#2b2f3a', x, 2.08, z, 16, 0.015); void s; sphere(0.07, glow('#fff3b0'), x, 2.05, z, 0); }
  } else if (st.ceiling === 'bunting') {
    const cols = ['#ff8fb1', '#ffe08a', '#8fd6ff', '#b8f0d8', '#c9b6ff'];
    for (const z of [-5, 1, 6]) for (let i = 0; i < 26; i++) {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.32, 3), new THREE.MeshBasicMaterial({ color: cols[i % cols.length], side: THREE.DoubleSide }));
      f.rotation.x = Math.PI; f.position.set(-13 + i, 2.62 - Math.sin((i / 25) * Math.PI) * 0.18, z); root.add(f);
    }
  } else if (st.ceiling === 'panels') {
    for (let x = -12; x <= 12; x += 4) for (let z = -8; z <= 8; z += 4) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), glow('#f3fbff')); p.rotation.x = Math.PI / 2; p.position.set(x + 2, 2.98, z + 2); root.add(p); }
  } else if (st.ceiling === 'stringlights') {
    const bulbs = [];
    for (const z of [-6, -1, 4, 8]) for (let i = 0; i < 30; i++) bulbs.push(sphere(0.05, glow(i % 2 ? '#ffd25a' : '#ff9fb8'), -14.5 + i, 2.55 - Math.sin((i / 29) * Math.PI) * 0.25, z, 0));
    animated.push((t) => bulbs.forEach((b, i) => b.material.color.set(((Math.floor(t * 2) + i) % 3) ? '#ffd25a' : '#ff9fb8')));
  } else if (st.ceiling === 'plants') {
    for (let i = 0; i < 9; i++) {
      const x = -10 + (i % 3) * 8, z = -6 + Math.floor(i / 3) * 6;
      cyl(0.004, 0.004, 0.45, '#666666', x, 2.55, z, 4, 0);
      cyl(0.18, 0.14, 0.2, '#ffb39a', x, 2.33, z, 14, 0.015);
      for (let k = 0; k < 5; k++) sphere(0.11, '#7fcf8f', x + Math.cos(k * 1.3) * 0.15, 2.22 - k * 0.07, z + Math.sin(k * 1.3) * 0.15, 0.012);
    }
  }

  // ---------- set pieces ----------
  if (styleId === 'workshop') {
    // packing table with pouches + scale (SW band)
    box(4.2, 0.85, 0.9, '#c9d1dc', -11, 0, 6.5, true); box(4.3, 0.05, 1.0, '#eef2f6', -11, 0.85, 6.5, false);
    const pc = ['#ff9f7a', '#ffd25a', '#9ee8c8', '#ff8fa3'];
    for (let i = 0; i < 10; i++) box(0.22, 0.3, 0.05, pc[i % 4], -12.8 + i * 0.36, 0.9, 6.35 + (i % 2) * 0.25, false, 0.2, 0.01);
    box(0.4, 0.12, 0.4, '#ffffff', -9.3, 0.9, 6.5, false); box(0.3, 0.02, 0.3, '#cfd6e6', -9.3, 1.02, 6.5, false);
    sign(['ĐÓNG GÓI', 'Cân · Hàn miệng · Dán tem'], '#ffe9a0', 2.2, 0.5, -11, 1.8, 5.9, 0, [60, 34]);
    // drying rack with khô strips (east strip)
    for (const z of [5.8, 9.2]) box(0.06, 2.0, 0.06, '#b0b8c6', 14.1, 0, z, false, 0, 0.01);
    collideRect(13.6, 14.7, 5.6, 9.4);
    for (let k = 0; k < 5; k++) {
      box(0.9, 0.03, 3.4, '#d9dee6', 14.1, 0.35 + k * 0.35, 7.5, false, 0, 0.008);
      for (let s = 0; s < 9; s++) box(0.7, 0.025, 0.12, ['#a0522d', '#8b3a1a', '#c0703a'][(s + k) % 3], 14.1, 0.38 + k * 0.35, 6.0 + s * 0.38, false, 0, 0);
    }
    sign(['GIÀN PHƠI KHÔ', 'đừng ăn vụng'], '#ffd3b8', 1.8, 0.45, 14.86, 2.2, 7.5, -Math.PI / 2, [56, 32]);
  } else if (styleId === 'startup') {
    // ping-pong + beanbags (SW band)
    box(2.74, 0.06, 1.52, '#2f8a5f', -11.5, 0.76, 6.5, false); collideRect(-12.9, -10.1, 5.7, 7.3);
    for (const [dx, dz] of [[-1.2, -0.65], [1.2, -0.65], [-1.2, 0.65], [1.2, 0.65]]) box(0.05, 0.76, 0.05, '#333344', -11.5 + dx, 0, 6.5 + dz, false, 0, 0);
    box(0.02, 0.15, 1.52, '#ffffff', -11.5, 0.82, 6.5, false, 0, 0.008);
    box(2.74, 0.01, 0.02, '#ffffff', -11.5, 0.825, 6.5, false, 0, 0);
    for (const [x, c] of [[-8.9, '#ff8fb1'], [-8.0, '#8fd6ff']]) { const b = sphere(0.45, c, x, 0.3, 6.6, 0.02); b.scale.set(1, 0.65, 1); collideRect(x - 0.4, x + 0.4, 6.2, 7.0); }
    // neon wall (east strip)
    const neon = textTexture(['SHIP IT 🚀', 'fix later'], { w: 768, h: 384, bg: '#1f2433', fg: '#7dfcd4', sizes: [110, 60], weights: [900, 700] });
    plane(3.2, 1.6, basic(neon), 14.86, 1.7, 7.4, -Math.PI / 2);
    box(0.5, 1.0, 0.5, '#2b2f3a', 14.3, 0, 5.9, true); box(0.5, 1.0, 0.5, '#2b2f3a', 14.3, 0, 9.0, true);
    sphere(0.1, glow('#7dfcd4'), 14.3, 1.1, 5.9, 0); sphere(0.1, glow('#ff8fb1'), 14.3, 1.1, 9.0, 0);
  } else if (styleId === 'studio') {
    // photo backdrop + softboxes (SW band)
    plane(3.2, 2.4, new THREE.MeshToonMaterial({ color: '#ffd6e6', side: THREE.DoubleSide }), -11, 1.2, 5.65, Math.PI);
    const roll = cyl(0.12, 0.12, 3.4, '#ffffff', -11, 2.45, 5.65, 14, 0.015); roll.rotation.z = Math.PI / 2; roll.position.set(-11, 2.45, 5.65);
    const sweep = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.4), new THREE.MeshToonMaterial({ color: '#ffd6e6' })); sweep.rotation.x = -Math.PI / 2; sweep.position.set(-11, 0.006, 6.35); root.add(sweep);
    for (const x of [-13.2, -8.8]) { cyl(0.02, 0.02, 1.6, '#333344', x, 0, 6.9, 8, 0.008); box(0.6, 0.6, 0.15, '#ffffff', x, 1.45, 6.9, false, x < -11 ? 0.5 : -0.5, 0.015); collideRect(x - 0.3, x + 0.3, 6.6, 7.2); }
    cyl(0.18, 0.18, 0.55, '#ffe08a', -11, 0, 6.4, 14, 0.015);
    collideRect(-12.6, -9.4, 5.55, 5.8);
    // moodboard (east strip)
    const mood = canvasTex(768, 512, (g, w, h) => {
      g.fillStyle = '#ffffff'; roundRect(g, 4, 4, w - 8, h - 8, 24); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
      const cs = ['#ff8fb1', '#ffe08a', '#8fd6ff', '#b8f0d8', '#c9b6ff', '#ffb39a'];
      for (let i = 0; i < 12; i++) { g.fillStyle = cs[i % 6]; g.save(); g.translate(70 + (i % 4) * 180, 90 + Math.floor(i / 4) * 150); g.rotate((i % 5 - 2) * 0.05); g.fillRect(-70, -55, 140, 110); g.strokeRect(-70, -55, 140, 110); g.restore(); }
      g.fillStyle = INK; g.font = '900 44px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText('MOODBOARD v14_FINAL', w / 2, h - 24);
    });
    plane(3.0, 2.0, basic(mood), 14.86, 1.5, 7.5, -Math.PI / 2);
    box(0.8, 0.45, 2.0, '#c9b6ff', 14.1, 0, 7.5, true); box(0.25, 0.5, 2.0, '#b49cff', 14.55, 0.45, 7.5, false);
  } else if (styleId === 'corporate') {
    // binder shelves (SW band)
    const spines = canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, w, h);
      const cs = ['#4a6fa5', '#d9534f', '#5cb85c', '#f0ad4e', '#6f6f8f'];
      for (let r = 0; r < 3; r++) for (let i = 0; i < 16; i++) { g.fillStyle = cs[(i + r) % 5]; g.fillRect(i * 32 + 2, r * 85 + 6, 28, 76); g.fillStyle = '#ffffff'; g.fillRect(i * 32 + 8, r * 85 + 20, 16, 10); }
    });
    for (const x of [-13.2, -11, -8.8]) { box(2.0, 2.0, 0.45, '#ffffff', x, 0, 6.0, true); plane(1.9, 1.85, basic(spines), x, 1.0, 6.235, 0); }
    sign(['HỒ SƠ KIỂM TOÁN', '2023 · 2024 · 2025'], '#e6ecff', 2.0, 0.5, -11, 2.25, 6.24, 0, [58, 36]);
    // shredder + document boxes (east strip)
    box(0.5, 0.75, 0.4, '#3a3f4b', 14.3, 0, 5.9, true); box(0.4, 0.05, 0.08, '#111111', 14.3, 0.75, 5.9, false, 0, 0);
    for (let i = 0; i < 6; i++) box(0.5, 0.32, 0.38, '#e8d3a8', 14.25, (i % 3) * 0.33, 7.0 + Math.floor(i / 3) * 0.6, i % 3 === 0, 0, 0.012);
    sign(['MÁY HỦY TÀI LIỆU', '(đừng hỏi)'], '#ffd3b8', 1.6, 0.4, 14.86, 1.6, 5.9, -Math.PI / 2, [54, 34]);
  } else if (styleId === 'warehouse') {
    // road cases + speakers (SW band)
    for (let i = 0; i < 5; i++) { const x = -13.6 + i * 0.95; const hgt = i % 2 ? 0.7 : 1.0; box(0.85, hgt, 0.75, '#22222a', x, 0, 6.3, true, 0, 0.02); box(0.86, 0.04, 0.76, '#c0c4cc', x, hgt - 0.04, 6.3, false, 0, 0); }
    for (const x of [-8.6, -7.9]) { box(0.55, 1.5, 0.5, '#2b2b33', x, 0, 6.5, true); sphere(0.16, '#555566', x, 1.1, 6.24, 0.01); sphere(0.1, '#555566', x, 0.55, 6.24, 0.01); }
    sign(['KHO ĐẠO CỤ', 'Gala · Hội nghị · Team building'], '#ffe9a0', 2.4, 0.55, -11, 2.0, 5.9, 0, [56, 32]);
    // truss tower + lion head (east strip)
    for (const [dx, dz] of [[0, 0], [0.4, 0], [0, 0.4], [0.4, 0.4]]) cyl(0.025, 0.025, 2.6, '#c0c4cc', 13.9 + dx, 0, 8.4 + dz, 6, 0.006);
    for (let y = 0.3; y < 2.6; y += 0.4) box(0.42, 0.02, 0.42, '#c0c4cc', 14.1, y, 8.6, false, 0, 0);
    collideRect(13.8, 14.4, 8.3, 8.9);
    const lion = sphere(0.45, '#ff4d4d', 14.2, 0.55, 6.3, 0.025); lion.scale.set(1, 0.85, 1.1);
    sphere(0.1, '#ffffff', 13.85, 0.7, 6.15, 0.01); sphere(0.1, '#ffffff', 13.85, 0.7, 6.45, 0.01);
    box(0.25, 0.22, 0.12, '#ffd25a', 14.2, 0.95, 6.3, false, 0, 0.01);
    collideRect(13.7, 14.7, 5.8, 6.8);
    const ball = sphere(0.22, glow('#d9e6ff'), 0, 2.6, 2.0, 0.01); animated.push((t) => { ball.rotation.y = t; });
  } else if (styleId === 'cozy') {
    // two interview pods (SW band)
    for (const [x, n] of [[-12.6, 1], [-9.6, 2]]) {
      box(1.6, 2.2, 0.08, '#b8f0d8', x, 0, 5.62, false); box(0.08, 2.2, 1.6, '#b8f0d8', x - 0.8, 0, 6.4, false); box(0.08, 2.2, 1.6, '#b8f0d8', x + 0.8, 0, 6.4, false);
      box(1.6, 0.1, 1.6, '#ffffff', x, 2.2, 6.4, false);
      plane(1.5, 2.0, new THREE.MeshBasicMaterial({ color: '#cfe9ff', transparent: true, opacity: 0.3, depthWrite: false }), x, 1.1, 7.2, 0);
      box(0.6, 0.45, 0.6, '#ffc8dd', x, 0, 6.2, false);
      collideRect(x - 0.85, x + 0.85, 5.55, 7.25);
      sign([`PHÒNG PHỎNG VẤN ${n}`], '#ffffff', 1.3, 0.3, x, 2.45, 7.25, 0, [64]);
    }
    // culture wall + sofa (east strip)
    const wall = canvasTex(768, 512, (g, w, h) => {
      g.fillStyle = '#fffaf0'; roundRect(g, 4, 4, w - 8, h - 8, 24); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
      g.fillStyle = INK; g.font = '900 54px Be Vietnam Pro, Arial'; g.textAlign = 'center'; g.fillText('WE ARE FAMILY 💜', w / 2, 70);
      const cs = ['#ffd6a5', '#bfe3ff', '#ffc8dd', '#b8f0d8', '#e3d9ff', '#fff1b8'];
      for (let i = 0; i < 8; i++) { const x = 60 + (i % 4) * 170, y = 110 + Math.floor(i / 4) * 180; g.fillStyle = cs[i % 6]; g.fillRect(x, y, 140, 150); g.lineWidth = 6; g.strokeRect(x, y, 140, 150); g.beginPath(); g.arc(x + 70, y + 60, 26, 0, 7); g.fillStyle = '#f6c9a8'; g.fill(); g.stroke(); }
    });
    plane(3.0, 2.0, basic(wall), 14.86, 1.55, 7.5, -Math.PI / 2);
    box(0.85, 0.45, 2.2, '#ffd6a5', 14.15, 0, 7.5, true); box(0.25, 0.55, 2.2, '#ffc28a', 14.6, 0.45, 7.5, false);
  }
  return st;
}
