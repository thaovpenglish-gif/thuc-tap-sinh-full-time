// Company-specific floor layouts. The building shell (outer walls, reception, meeting room, pantry, altar) is shared,
// so story scenes that use the meeting room / pantry / reception keep working. A layout replaces the central
// furniture and the two north rooms' contents, and moves the named seats (slot names stay the same, so the
// company's story data does not change — only where those seats are).
// Spot format: [x, z, rotY] (rotY 0 = facing +z / south, PI = facing north, PI/2 = facing east).

const PI = Math.PI;

export const LAYOUTS = {
  // ---------------------------------------------------------------------------------------------------------
  // Ba & Má — "nhà phố + xưởng": the family eats and works at one long table; the north half is the workshop
  // (drying racks, dryers, packing) with a livestream corner; Ba drinks tea in his room; Má sits by the door next
  // to the safe, watching every đồng that comes in or goes out; the old finance room is the finished-goods store.
  bama: {
    signs: { finance: 'KHO THÀNH PHẨM', boss: 'PHÒNG BA (UỐNG TRÀ)' },
    spots: {
      boss: [-11.6, -7.0, PI / 2],     // Ba at his tea table
      finance: [4.9, 8.0, -PI / 2],    // Má behind her desk by the door, facing the entrance
      n1: [-3.6, -2.25, 0],            // Mai — family table, north side
      c3: [-1.6, -2.25, 0],            // Ngân — family table, north side
      corner: [3.3, -1.2, -PI / 2],    // Kevin — standing at the head of the table with his laptop
      coach: [-5.5, -1.2, PI / 2],     // Sơn — by the "họp sáng" whiteboard at the other end
      c1: [5.0, -8.7, 0],              // Út Mi — livestream corner
      it: [2.4, -6.4, 0],              // Khoa — tech desk next to the livestream
      x1: [-3.9, -6.3, PI],            // Dũng — at the drying racks
      x2: [-0.2, -8.2, PI / 2],        // Cậu Tám — by the dryers
      su_dat: [-5.5, -1.2, PI / 2],
    },
    build(H) {
      const { THREE, box, cyl, sphere, plane, basic, sign, textTexture, collideRect, interactables, P } = H;
      const wood = '#c98f5a', woodDark = '#9c6a3f';
      // ---- family table (bàn ăn dài) ----
      box(7.0, 0.08, 1.3, wood, -1, 0.72, -1.2, false, 0, 0.025);
      for (const [dx, dz] of [[-3.3, -0.5], [3.3, -0.5], [-3.3, 0.5], [3.3, 0.5]]) box(0.1, 0.72, 0.1, woodDark, -1 + dx, 0, -1.2 + dz, false, 0, 0.012);
      collideRect(-4.5, 2.5, -1.85, -0.55);
      const stool = (x, z, c = '#ff5a6e') => { cyl(0.2, 0.18, 0.45, c, x, 0, z, 14, 0.015); };
      for (const x of [-3.6, -1.6, 0.4]) stool(x, -2.15);
      for (const x of [-3.6, -0.6, 1.4]) stool(x, -0.25, x === -0.6 ? '#ffe08a' : '#ff5a6e');
      // things on the table: rice cooker, tea, laptops, a bag of khô
      cyl(0.18, 0.18, 0.28, '#ffffff', -2.6, 0.8, -1.2, 16, 0.015); sphere(0.06, '#ff5a6e', -2.6, 1.1, -1.2, 0.01);
      for (const [x, c] of [[-3.6, '#9fb4ff'], [-1.6, '#ffc8dd'], [-0.6, '#ffe08a']]) box(0.4, 0.02, 0.28, c, x, 0.81, x === -0.6 ? -0.75 : -1.6, false, 0, 0.008);
      box(0.3, 0.32, 0.08, '#ffd25a', 0.6, 0.8, -1.2, false, 0.3, 0.01);
      for (let i = 0; i < 3; i++) cyl(0.04, 0.03, 0.05, '#ffffff', 1.4 + i * 0.12, 0.8, -1.35, 10, 0.008);
      interactables.push({ id: 'desk', label: H.L('desk', 'Ngồi vào chỗ của mình ở bàn gia đình'), pos: new THREE.Vector3(-0.6, 0.8, -0.3) });
      // a red plastic chair, the most Vietnamese object in the office
      box(0.45, 0.06, 0.45, '#ff3b3b', 3.6, 0.42, 0.6, false); box(0.45, 0.5, 0.06, '#ff3b3b', 3.6, 0.45, 0.82, false);
      interactables.push({ id: 'redchair', label: H.L('redchair', 'Nhìn chiếc ghế nhựa đỏ'), pos: new THREE.Vector3(3.6, 0.6, 0.6) });
      // "họp sáng" whiteboard at the west end
      const wb = textTexture(H.th.whiteboard || ['HỌP SÁNG 8:15'], { w: 768, h: 512, bg: '#ffffff', fg: '#c0392b', sizes: [64, 46, 40, 40, 34], weights: [900, 800, 700, 700, 500], align: 'left', pad: 40 });
      box(1.8, 1.2, 0.06, '#ffffff', -6.4, 0.85, -1.2, true, PI / 2);
      plane(1.7, 1.1, basic(wb), -6.36, 1.45, -1.2, PI / 2);
      interactables.push({ id: 'okr', label: H.L('okr', 'Đọc bảng "họp sáng"'), pos: new THREE.Vector3(-6.2, 1.4, -1.2) });

      // ---- workshop (north half) ----
      const workFloor = new THREE.Mesh(new THREE.PlaneGeometry(13.6, 5.4), H.T('#efe6d6')); workFloor.rotation.x = -PI / 2; workFloor.position.set(0, 0.005, -7.3); H.root.add(workFloor);
      sign('XƯỞNG · ĐI DÉP · ĐỘI MŨ', '#ffd3b8', 0, 2.62, -4.62, 0, 2.6);
      const rack = (cx, cz) => {
        for (const dx of [-1.0, 1.0]) for (const dz of [-0.4, 0.4]) box(0.05, 1.9, 0.05, '#b0b8c6', cx + dx, 0, cz + dz, false, 0, 0.008);
        for (let k = 0; k < 5; k++) {
          box(2.1, 0.03, 0.85, '#d9dee6', cx, 0.3 + k * 0.33, cz, false, 0, 0.008);
          for (let s = 0; s < 8; s++) box(0.12, 0.025, 0.65, ['#a0522d', '#8b3a1a', '#c0703a'][(s + k) % 3], cx - 0.85 + s * 0.24, 0.33 + k * 0.33, cz, false, 0, 0);
        }
        collideRect(cx - 1.05, cx + 1.05, cz - 0.45, cz + 0.45);
      };
      rack(-5.0, -7.6); rack(-2.6, -7.6);
      sign('GIÀN PHƠI · đừng ăn vụng', '#fff1b8', -3.8, 2.1, -8.1, 0, 2.4);
      for (const x of [0.4, 1.5]) { box(0.95, 1.6, 0.8, '#cfd6e6', x, 0, -9.3, true); for (let i = 0; i < 5; i++) box(0.8, 0.03, 0.02, '#ff9f7a', x, 0.3 + i * 0.25, -8.88, false, 0, 0); sphere(0.06, new THREE.MeshBasicMaterial({ color: '#7dfc8a' }), x + 0.35, 1.45, -8.88, 0); }
      sign('MÁY SẤY #1 · #2', '#ffe9a0', 0.95, 1.9, -8.86, 0, 1.6);
      // packing table
      box(2.4, 0.85, 0.8, '#c9d1dc', -0.6, 0, -5.6, true); box(2.5, 0.05, 0.9, '#eef2f6', -0.6, 0.85, -5.6, false);
      for (let i = 0; i < 7; i++) box(0.2, 0.28, 0.05, ['#ff9f7a', '#ffd25a', '#9ee8c8', '#ff8fa3'][i % 4], -1.6 + i * 0.32, 0.9, -5.5 + (i % 2) * 0.2, false, 0.2, 0.01);
      box(0.36, 0.1, 0.36, '#ffffff', 0.35, 0.9, -5.6, false);
      // livestream corner
      const live = textTexture(['🔴 LIVE 20:00', 'KHÔ GÀ BA & MÁ', 'Chốt đơn · Freeship'], { w: 768, h: 512, bg: '#ff4d4d', fg: '#ffffff', sizes: [96, 70, 48], weights: [900, 900, 700] });
      box(2.6, 2.0, 0.06, '#ffffff', 5.2, 0.3, -9.75, false);
      plane(2.5, 1.66, basic(live), 5.2, 1.4, -9.7, 0);
      cyl(0.02, 0.02, 1.4, '#333344', 6.0, 0, -7.8, 8, 0.008);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 10, 30), new THREE.MeshBasicMaterial({ color: '#fffbe0' })); ring.position.set(6.0, 1.5, -7.8); ring.rotation.y = -0.5; H.root.add(ring);
      box(0.08, 0.14, 0.01, '#ff8fa3', 6.0, 1.43, -7.82, false, -0.5, 0.006);
      for (let i = 0; i < 6; i++) box(0.22, 0.3, 0.06, ['#ffd25a', '#ff9f7a', '#9ee8c8'][i % 3], 4.3 + (i % 3) * 0.3, 0.9 + Math.floor(i / 3) * 0.35, -9.55, false, 0, 0.01);
      box(1.0, 0.85, 0.35, '#ffffff', 4.6, 0, -9.5, true);
      collideRect(5.85, 6.15, -7.95, -7.65);
      // Khoa's tech desk + printer
      H.desk(2.4, -5.7, -1, 'Khoa · IT + live', [['OBS Studio', '● REC 02:14:55'], '#2b2f3a'], '#bfe3ff');
      box(0.6, 0.8, 0.5, '#ffffff', 3.8, 0, -5.6, true); box(0.6, 0.25, 0.5, '#e3d9ff', 3.8, 0.8, -5.6, false);
      interactables.push({ id: 'printer', label: H.L('printer', 'Dùng máy in tem nhãn'), pos: new THREE.Vector3(3.8, 0.9, -5.2) });

      // ---- Ba's room: tea table instead of a desk ----
      box(1.4, 0.4, 0.8, woodDark, -10.6, 0, -7.0, true); box(1.5, 0.05, 0.9, wood, -10.6, 0.4, -7.0, false);
      cyl(0.09, 0.08, 0.12, '#c98f6a', -10.8, 0.45, -7.0); for (let i = 0; i < 4; i++) cyl(0.04, 0.03, 0.05, '#ffffff', -10.5 + (i % 2) * 0.14, 0.45, -7.15 + Math.floor(i / 2) * 0.3, 10, 0.008);
      for (const z of [-7.0]) { box(0.6, 0.45, 0.6, woodDark, -12.1, 0, z, false); box(0.1, 0.9, 0.6, woodDark, -12.4, 0.45, z, false); }
      box(0.6, 0.45, 0.6, woodDark, -9.1, 0, -7.0, false); box(0.1, 0.9, 0.6, woodDark, -8.8, 0.45, -7.0, false);
      cyl(0.3, 0.26, 0.3, '#8b5a3c', -8.2, 0, -9.2); for (let i = 0; i < 6; i++) sphere(0.14, '#4f8a4f', -8.2 + Math.cos(i) * 0.18, 0.5 + (i % 3) * 0.12, -9.2 + Math.sin(i) * 0.18, 0.012);
      interactables.push({ id: 'plant', label: H.L('plant', 'Ngắm chậu bonsai của Ba'), pos: new THREE.Vector3(-8.2, 0.8, -9.2) });
      const motto = textTexture(['"Làm ăn phải có tâm.', 'Có tâm thì phải có lãi."'], { w: 768, h: 256, bg: '#fff1b8', fg: '#8b1a1a', sizes: [54, 54], weights: [800, 800] });
      plane(2.0, 0.66, basic(motto), -13.5, 1.6, -9.85, 0);

      // ---- Má by the door: small desk, ledger, safe ----
      box(0.6, 0.75, 1.2, wood, 4.1, 0, 8.0, true); box(0.7, 0.05, 1.3, '#e8c39a', 4.1, 0.75, 8.0, false);
      box(0.22, 0.04, 0.3, '#3a6ea5', 4.1, 0.8, 7.8, false, 0, 0.008); box(0.22, 0.03, 0.16, '#ffffff', 4.1, 0.8, 8.25, false, 0, 0.008);
      box(0.6, 0.9, 0.6, '#5f6b7a', 5.8, 0, 7.3, true); cyl(0.11, 0.11, 0.04, '#ffd25a', 5.49, 0.5, 7.3).rotation.z = PI / 2;
      interactables.push({ id: 'safe', label: H.L('safe', 'Nhìn két sắt của Má'), pos: new THREE.Vector3(5.5, 0.8, 7.3) });
      const maSign = textTexture(['QUẦY MÁ', 'Thu · Chi · Hỏi han'], { w: 512, h: 256, bg: '#ffd3b8', sizes: [64, 40] });
      plane(1.0, 0.5, basic(maSign), 3.74, 2.35, 8.0, -PI / 2);

      // ---- finished-goods store (old finance room) ----
      for (let i = 0; i < 6; i++) {
        const x = 8.6 + (i % 3) * 1.3, z = -9.0 + Math.floor(i / 3) * 1.5;
        for (let k = 0; k < 3; k++) box(1.0, 0.45, 0.7, k % 2 ? '#e8c39a' : '#d9a273', x, k * 0.45, z, k === 0, 0, 0.015);
      }
      const lbl = textTexture(['KHÔ GÀ · KHÔ BÒ · XOÀI SẤY'], { w: 1024, h: 128, bg: '#ffe9a0', sizes: [56] });
      plane(3.2, 0.4, basic(lbl), 11, 2.3, -9.85, 0);
      box(0.5, 0.6, 1.4, '#cfd6e6', 13.8, 0, -6.5, true);
      sign('HẠN DÙNG: XEM TRÊN BAO BÌ', '#ffc8dd', 13.8, 1.0, -5.75, 0, 1.6);
      void P; void sphere;
    },
  },
};
