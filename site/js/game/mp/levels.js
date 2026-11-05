// Levels of Overdeadline & Overburnout. One level = one client company from Solo.
// Coordinates: x right, z towards the camera (screen "up" is −z). The map is centred on (0, 0).
// Station kinds: source (gives an item) · laptop (work) · printer / boss (auto) · counter · deliver · trash · coffee.
// rooms / walls / decor / npcs are visual only (walls also block walking); the rules only use stations.

// T&M people (looks copied from story/tm/characters.js so Multiplayer does not depend on Solo code)
const TM = {
  tuyet: { name: 'Chị Tuyết', look: { shirt: '#f4a3b5', pants: '#5b4a6b', hair: 'bun', hairColor: '#1d1d1f', glasses: true } },
  linh: { name: 'Chị Linh', look: { shirt: '#9fb4ff', pants: '#3f4a6b', hair: 'short', hairColor: '#1d1d1f', mug: true } },
  ha: { name: 'Chị Hạ', look: { shirt: '#c7e8b5', pants: '#5f7a5a', hair: 'long', hairColor: '#3b2418', glasses: true } },
  han: { name: 'Chị Hân', look: { shirt: '#ffb3e6', pants: '#7d5a8a', hair: 'wavy', hairColor: '#7a3b1e', phone: true } },
  mai: { name: 'Mai', look: { shirt: '#c9b6ff', pants: '#3f3f55', hair: 'short', hairColor: '#1d1d1f', clip: true, phone: true } },
  long: { name: 'Long', look: { shirt: '#a8dcc0', pants: '#4a5a52', hair: 'short', hairColor: '#1d1d1f', glasses: true } },
  trang: { name: 'Trang', look: { shirt: '#ffc6e0', pants: '#7d86b3', hair: 'long', hairColor: '#3b2418', clip: true } },
  an: { name: 'An', look: { shirt: '#b9cfe6', pants: '#4b5566', hair: 'quiff', hairColor: '#1d1d1f', mug: true } },
  bao: { name: 'Bảo', look: { shirt: '#ffd3b8', pants: '#5b6b9a', hair: 'cap', hairColor: '#7fb3ff' } },
  khang: { name: 'Khang', look: { shirt: '#9ee8c8', pants: '#f2e6cf', hair: 'quiff', hairColor: '#4a3226', pods: true } },
  quynh: { name: 'Chị Quỳnh', look: { shirt: '#e3d9ff', pants: '#5a4a6b', hair: 'bun', hairColor: '#2a2a2a', glasses: true } },
  gam: { name: 'Chị Gấm', look: { shirt: '#ffe9a0', pants: '#8a6a5a', hair: 'wavy', hairColor: '#4a3226' } },
  dat: { name: 'Anh Đạt', look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'beanie', hairColor: '#ff9f7a', notes: true } },
};

export const LEVELS = {
  tm: {
    id: 'tm',
    client: 'T&M Partners',
    emoji: '📊',
    title: 'Deck cho chị Chủ tịch',
    blurb: 'T&M thuê SOS Advisory làm gấp đề xuất. Người T&M ra sảnh chờ lấy hàng, chị Tuyết duyệt deck, anh Đạt dựng bảng Scrum ngay giữa lối đi.',
    bossName: 'Chị Tuyết',
    bossLine: 'Chị chỉ có một vài ý nhỏ thôi.',
    notesChance: 0.3,
    duration: 180,
    room: { w: 18, d: 12 },
    wall: '#c9b6ff',

    // ---- floor plan ----
    //  z=-6 ┌ Khu làm việc ─────────┬ Phòng in ─┬ Phòng chị Tuyết (kính) ┐
    //       │ Brief Data  Lap Lap    │ In  Bàn   │        Bàn chị Tuyết   │
    //  z=-1.2 ──[cửa]───────────────────[cửa]────────[cửa]────────────────
    //       │ Rác     Bàn ghép ×4                 [Bảng Scrum]            │  hành lang
    //  z=2.2 ──[cửa]──────┬──[cửa]────────────┬────[QUẦY LỄ TÂN]─────────
    //       │ Pantry      │ Phòng họp          │ Sảnh khách (khách chờ) ← cửa vào
    //  z=6  └─────────────┴────────────────────┴─────────────────────────┘
    rooms: [
      { name: 'KHU LÀM VIỆC', icon: '💻', x0: -9, x1: -1, z0: -6, z1: -1.2, floor: '#efe7ff', sign: [-5.5, -1.2], color: '#e3d9ff' },
      { name: 'PHÒNG IN', icon: '🖨️', x0: -1, x1: 3, z0: -6, z1: -1.2, floor: '#e3f1ff', sign: [0.8, -1.2], color: '#d9ecff' },
      { name: 'PHÒNG CHỦ TỊCH', icon: '👑', x0: 3, x1: 9, z0: -6, z1: -1.2, floor: '#ffe6ef', sign: [5.2, -1.2], color: '#ffc8dd' },
      { name: '', x0: -9, x1: 9, z0: -1.2, z1: 2.2, floor: '#fff8ef' },
      { name: 'PANTRY', icon: '☕', x0: -9, x1: -4, z0: 2.2, z1: 6, floor: '#fff3c4', sign: [-6.7, 2.2], color: '#ffe9a0' },
      { name: 'PHÒNG HỌP', icon: '🗣️', x0: -4, x1: 2.6, z0: 2.2, z1: 6, floor: '#e3f7ee', sign: [-1.7, 2.2], color: '#b8f0d8' },
      { name: 'SẢNH KHÁCH', icon: '🛋️', x0: 2.6, x1: 9, z0: 2.2, z1: 6, floor: '#f6efe3', sign: [4.0, 2.2], color: '#ffd3b8' },
    ],
    // axis-aligned wall segments (x0,z0)→(x1,z1); kind 'glass' is see-through
    walls: [
      { x0: -9, z0: -1.2, x1: -6.8, z1: -1.2 }, { x0: -4.2, z0: -1.2, x1: -1, z1: -1.2 },
      { x0: -1, z0: -1.2, x1: -0.2, z1: -1.2 }, { x0: 1.8, z0: -1.2, x1: 3, z1: -1.2 },
      { x0: 3, z0: -1.2, x1: 4.2, z1: -1.2, kind: 'glass' }, { x0: 6.2, z0: -1.2, x1: 9, z1: -1.2, kind: 'glass' },
      { x0: -1, z0: -6, x1: -1, z1: -1.2 },
      { x0: 3, z0: -6, x1: 3, z1: -1.2, kind: 'glass' },
      { x0: -9, z0: 2.2, x1: -7.6, z1: 2.2 }, { x0: -5.8, z0: 2.2, x1: -2.6, z1: 2.2 },
      { x0: -0.8, z0: 2.2, x1: 5.25, z1: 2.2 }, { x0: 7.15, z0: 2.2, x1: 9, z1: 2.2 },
      { x0: -4, z0: 2.2, x1: -4, z1: 6 },
      { x0: 2.6, z0: 2.2, x1: 2.6, z1: 6 },
    ],
    decor: [
      // work area
      { kind: 'desk', x: -7.6, z: -2.55, npc: 'bao' }, { kind: 'desk', x: -5.9, z: -2.55, npc: 'trang' },
      { kind: 'plant', x: -1.6, z: -1.8 }, { kind: 'window', x: -6, z: -6 }, { kind: 'window', x: -3, z: -6 },
      // print room
      { kind: 'boxes', x: 2.3, z: -2.2 }, { kind: 'boxes', x: -0.4, z: -2.0 },
      // boss room
      { kind: 'plant', x: 8.3, z: -5.3 }, { kind: 'shelf', x: 8.3, z: -3.2 }, { kind: 'window', x: 6, z: -6 },
      // corridor
      { kind: 'plant', x: -8.5, z: 1.7 }, { kind: 'plant', x: 8.5, z: -0.6 },
      // pantry
      { kind: 'fridge', x: -8.4, z: 5.2 }, { kind: 'cafetable', x: -5.4, z: 4.6, cat: true },
      // meeting room
      { kind: 'meeting', x: -0.7, z: 4.6 }, { kind: 'tv', x: -3.7, z: 4.3 },
      // lobby
      { kind: 'sofa', x: 4.6, z: 5.4 }, { kind: 'plant', x: 3.1, z: 5.5 }, { kind: 'reception', x: 7.6, z: 5.3, npc: 'gam' },
    ],
    floorDoorMats: [[-5.5, -1.2], [0.8, -1.2], [5.2, -1.2], [-6.7, 2.2], [-1.7, 2.2], [9, 4.4, 'v']],

    spawns: [{ x: -6, z: 0.5 }, { x: 1.6, z: 0.6 }, { x: -6, z: 1.6 }, { x: 1.6, z: 1.6 }],
    stations: [
      { id: 'brief', kind: 'source', gives: 'brief', label: 'Kệ Brief', x: -8, z: -5.3 },
      { id: 'data', kind: 'source', gives: 'data', label: 'Kệ Data', x: -6.6, z: -5.3 },
      { id: 'lap1', kind: 'laptop', label: 'Laptop', x: -4.6, z: -5.3 },
      { id: 'lap2', kind: 'laptop', label: 'Laptop', x: -3.1, z: -5.3 },
      { id: 'printer', kind: 'printer', label: 'Máy in', x: 0.4, z: -5.3 },
      { id: 'c_back', kind: 'counter', label: 'Bàn', x: 1.8, z: -5.3 },
      { id: 'boss', kind: 'boss', label: 'Bàn chị Tuyết', x: 6, z: -4.4 },
      { id: 'c1', kind: 'counter', label: 'Bàn ghép', x: -3.6, z: 0.5 },
      { id: 'c2', kind: 'counter', label: 'Bàn ghép', x: -2.4, z: 0.5 },
      { id: 'c3', kind: 'counter', label: 'Bàn ghép', x: -1.2, z: 0.5 },
      { id: 'c4', kind: 'counter', label: 'Bàn ghép', x: 0, z: 0.5 },
      { id: 'trash', kind: 'trash', label: 'Thùng rác', x: -8.3, z: 0.2 },
      { id: 'coffee', kind: 'coffee', label: 'Cà phê', x: -6.6, z: 5.3 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy lễ tân', x: 6.2, z: 2.2, faces: 'up' },
    ],
    boss: TM.tuyet,

    // clients: T&M people who come to the lobby to pick up the work
    clients: [TM.han, TM.khang, TM.linh, TM.ha, TM.mai, TM.an, TM.quynh, TM.long],
    clientSpots: [{ x: 4.0, z: 3.4 }, { x: 5.6, z: 3.3 }, { x: 6.9, z: 3.3 }, { x: 8.2, z: 3.4 }],
    clientDoor: [{ x: 10, z: 4.4 }, { x: 8.4, z: 4.4 }], // path in from outside (reversed to leave)
    clientLines: {
      wait: ['Em ơi xong chưa?', 'Chị chờ 5 phút thôi nha', 'Gấp lắm em', 'Khách đang hỏi kìa', 'Có bản nháp chưa?'],
      happy: ['Cảm ơn SOS!', 'Đúng ý chị luôn', 'Nhanh ghê', 'Quá xịn'],
      angry: ['Thôi khỏi!', 'Trễ quá rồi', 'Để chị báo chị Tuyết', 'Lần sau gọi chỗ khác'],
    },

    // daily stand-up: a warning, then everyone within `radius` of the board is stuck in the meeting
    standup: {
      board: { x: 3.4, z: 0.4 }, radius: 2.0, at: [55, 120], warn: 5, length: 7,
      coach: TM.dat,
      warnText: 'Anh Đạt: "Cả nhà ơi 5 giây nữa stand-up nha!" Tránh xa bảng Scrum giữa hành lang!',
      line: 'Anh Đạt: "15 phút thôi."',
    },
    recipes: {
      slide: { title: 'Slide nhanh', item: 'slide', time: 55, reward: 30, steps: ['📝 Brief', '💻 Laptop'] },
      report: { title: 'Báo cáo số liệu', item: 'print', time: 75, reward: 60, steps: ['📊 Data', '💻 Laptop', '🖨️ In'] },
      deck: { title: 'Deck đề xuất', item: 'deck_signed', time: 120, reward: 140, steps: ['🖼️ Slide', '+ 📄 Bản in', '✍️ Chị Tuyết ký'] },
    },
    orderPool: [
      { recipe: 'slide', w: 3 },
      { recipe: 'report', w: 3 },
      { recipe: 'deck', w: 3, after: 25 },
    ],
    firstOrders: [2, 9],
    spawnGap: [26, 20, 16, 14],      // seconds between new orders for 1, 2, 3, 4 players
    stars: [200, 450, 700],          // thousand đồng for 1, 2, 3 stars (×0.6 when playing alone)
  },
};
