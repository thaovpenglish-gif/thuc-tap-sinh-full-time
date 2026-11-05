// Levels of Overdeadline & Overburnout. One level = one client company from Solo.
// Coordinates: x right, z towards the camera (screen "up" is −z). The room is centred on (0, 0).
// Station kinds: source (gives an item) · laptop (work) · printer / boss (auto) · counter · deliver · trash · coffee.

export const LEVELS = {
  tm: {
    id: 'tm',
    client: 'T&M Partners',
    emoji: '📊',
    title: 'Deck cho chị Chủ tịch',
    blurb: 'T&M thuê SOS Advisory làm gấp đề xuất cho khách. Chị Tuyết duyệt deck, Scrum Master bấm chuông stand-up bất chợt.',
    bossName: 'Chị Tuyết',
    bossLine: 'Chị chỉ có một vài ý nhỏ thôi.',
    notesChance: 0.3,
    duration: 180,
    room: { w: 15, d: 10 },
    floor: '#f3e9ff', wall: '#c9b6ff',
    spawns: [{ x: -1.5, z: 2 }, { x: 0.5, z: 2 }, { x: -1.5, z: -2 }, { x: 0.5, z: -2 }],
    stations: [
      { id: 'brief', kind: 'source', gives: 'brief', label: 'Kệ Brief', x: -6.2, z: -4 },
      { id: 'data', kind: 'source', gives: 'data', label: 'Kệ Data', x: -4.8, z: -4 },
      { id: 'lap1', kind: 'laptop', label: 'Laptop', x: -2.8, z: -4 },
      { id: 'lap2', kind: 'laptop', label: 'Laptop', x: -1.4, z: -4 },
      { id: 'printer', kind: 'printer', label: 'Máy in', x: 0.6, z: -4 },
      { id: 'c_back', kind: 'counter', label: 'Bàn', x: 2, z: -4 },
      { id: 'boss', kind: 'boss', label: 'Bàn chị Tuyết', x: 4.6, z: -4 },
      { id: 'c1', kind: 'counter', label: 'Bàn ghép', x: -2.4, z: 0 },
      { id: 'c2', kind: 'counter', label: 'Bàn ghép', x: -1.2, z: 0 },
      { id: 'c3', kind: 'counter', label: 'Bàn ghép', x: 0, z: 0 },
      { id: 'c4', kind: 'counter', label: 'Bàn ghép', x: 1.2, z: 0 },
      { id: 'coffee', kind: 'coffee', label: 'Pantry', x: -6.2, z: 4 },
      { id: 'trash', kind: 'trash', label: 'Thùng rác', x: -4.4, z: 4 },
      { id: 'c_front', kind: 'counter', label: 'Bàn', x: -1.2, z: 4 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy khách', x: 2.6, z: 4 },
    ],
    // daily stand-up: a warning, then everyone within `radius` of the board is stuck in the meeting
    standup: {
      board: { x: 6.3, z: 0.8 }, radius: 2.6, at: [55, 120], warn: 5, length: 7,
      warnText: 'Anh Đạt: "Cả nhà ơi 5 giây nữa stand-up nha!" Tránh xa bảng Scrum!',
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
