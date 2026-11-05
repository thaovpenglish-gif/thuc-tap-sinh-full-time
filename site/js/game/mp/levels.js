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

// Floor plan shared by the office levels: partitions with doors (x0,z0)→(x1,z1); kind 'glass' is see-through
const TM_WALLS = [
  { x0: -9, z0: -1.2, x1: -6.8, z1: -1.2 }, { x0: -4.2, z0: -1.2, x1: -1, z1: -1.2 },
  { x0: -1, z0: -1.2, x1: -0.2, z1: -1.2 }, { x0: 1.8, z0: -1.2, x1: 3, z1: -1.2 },
  { x0: 3, z0: -1.2, x1: 4.2, z1: -1.2, kind: 'glass' }, { x0: 6.2, z0: -1.2, x1: 9, z1: -1.2, kind: 'glass' },
  { x0: -1, z0: -6, x1: -1, z1: -1.2 },
  { x0: 3, z0: -6, x1: 3, z1: -1.2, kind: 'glass' },
  { x0: -9, z0: 2.2, x1: -7.6, z1: 2.2 }, { x0: -5.8, z0: 2.2, x1: -2.6, z1: 2.2 },
  { x0: -0.8, z0: 2.2, x1: 5.25, z1: 2.2 }, { x0: 7.15, z0: 2.2, x1: 9, z1: 2.2 },
  { x0: -4, z0: 2.2, x1: -4, z1: 6 },
  { x0: 2.6, z0: 2.2, x1: 2.6, z1: 6 },
];
const TM_MATS = [[-5.5, -1.2], [0.8, -1.2], [5.2, -1.2], [-6.7, 2.2], [-1.7, 2.2], [9, 4.4, 'v']];

// Ba & Má people (looks copied from companies/bama/cast.js; distributors and shoppers are new)
const BM = {
  hang: { name: 'Má', look: { shirt: '#ffb3c7', pants: '#8a6a8f', hair: 'bun', hairColor: '#2a2a2a', glasses: true } },
  hung: { name: 'Ba', look: { shirt: '#9fb4ff', pants: '#5d6a9a', hair: 'side', hairColor: '#c9c9c9', glasses: true, tie: '#ff8fa3' } },
  tuan: { name: 'Kevin Tuấn', look: { shirt: '#9ee8c8', pants: '#f2e6cf', hair: 'quiff', hairColor: '#4a3226', pods: true } },
  maicskh: { name: 'Chị Mai CSKH', short: 'Chị Mai', look: { shirt: '#ffc59e', pants: '#8a5a4a', hair: 'wavy', hairColor: '#7a3b1e', phone: true } },
  khoa: { name: 'Anh Khoa', look: { shirt: '#b49cff', pants: '#3f3f55', hair: 'curly', hairColor: '#1d1d1f' } },
  tu: { name: 'Cô Tư', look: { shirt: '#bfe6b5', pants: '#5f7a5a', hair: 'bun', hairColor: '#8a8a8a' } },
  bay: { name: 'Chú Bảy', look: { shirt: '#a8dcc0', pants: '#4a5a52', hair: 'cap', hairColor: '#7fb3ff' } },
  ngan: { name: 'Ngân', look: { shirt: '#a9d8ff', pants: '#5b6b9a', hair: 'pony', hairColor: '#1d1d1f', tote: true } },
  mi: { name: 'Út Mi', look: { shirt: '#ff9fb2', pants: '#f2e6cf', hair: 'long', hairColor: '#5a2b1e', clip: true, phone: true } },
  cautam: { name: 'Cậu Tám', look: { shirt: '#e0b080', pants: '#5a4a3a', hair: 'bald', hairColor: '#555555', phone: true } },
  dung: { name: 'Anh Dũng', look: { shirt: '#b9cfe6', pants: '#4b5566', hair: 'short', hairColor: '#1d1d1f', mug: true } },
  tam: { name: 'Chị Tâm (nhà phân phối)', short: 'Chị Tâm', look: { shirt: '#e7c6a5', pants: '#5a4a3a', hair: 'bun', hairColor: '#2a2a2a', glasses: true, phone: true } },
  sau: { name: 'Cô Sáu Tạp Hóa', short: 'Cô Sáu', look: { shirt: '#f1d7a8', pants: '#6b5a4a', hair: 'curly', hairColor: '#555555', tote: true } },
  shipper: { name: 'Anh shipper', short: 'Shipper', look: { shirt: '#3fbf6f', pants: '#3a3f55', hair: 'cap', hairColor: '#3fbf6f', phone: true } },
  shopoi: { name: 'Khách "shop ơi"', short: 'Shop ơi', look: { shirt: '#c9b6ff', pants: '#5b6b9a', hair: 'pony', hairColor: '#3b2418', phone: true } },
};
const BURNT = '🔥 Khô cháy khét! Cô Tư ngửi thấy từ bếp. Vứt đi làm lại!';

// Người Đúng Chỗ HR people (looks copied from companies/hr/cast.js; client reps and candidates are new)
const HR = {
  duy: { name: 'Anh Duy', look: { shirt: '#c9b6ff', pants: '#3f3f55', hair: 'side', hairColor: '#1d1d1f', phone: true } },
  ngan: { name: 'Chị Ngân', look: { shirt: '#9fb4ff', pants: '#3f4a6b', hair: 'bun', hairColor: '#1d1d1f', glasses: true, mug: true } },
  tuan: { name: 'Anh Tuấn', look: { shirt: '#ffd3b8', pants: '#4b5566', hair: 'quiff', hairColor: '#2a1a12', phone: true, tie: '#c0392b' } },
  vy: { name: 'Vy', look: { shirt: '#ffc6e0', pants: '#7d86b3', hair: 'pony', hairColor: '#3b2418', pods: true } },
  my: { name: 'Chị My', look: { shirt: '#b8f0d8', pants: '#4a5a52', hair: 'short', hairColor: '#1d1d1f', glasses: true, notes: true } },
  khoa: { name: 'Anh Khoa', look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'curly', hairColor: '#4a3226', notes: true } },
  thao: { name: 'Chị Thảo', look: { shirt: '#ffe9a0', pants: '#8a6a5a', hair: 'wavy', hairColor: '#2a2a2a', glasses: true } },
  phat: { name: 'Phát', look: { shirt: '#aeb7c9', pants: '#3a3a4a', hair: 'beanie', hairColor: '#1d1d1f', pods: true } },
  quan: { name: 'Quân', look: { shirt: '#a8dcc0', pants: '#5b6b9a', hair: 'cap', hairColor: '#1d1d1f', tote: true } },
  kimanh: { name: 'Chị Kim Anh (HR Đất Vàng Land)', short: 'Chị Kim Anh', look: { shirt: '#f4a3b5', pants: '#3f3f55', hair: 'long', hairColor: '#1d1d1f', phone: true } },
  tai: { name: 'Ông Tài (Bao Bì Phú Quý)', short: 'Ông Tài', look: { shirt: '#b9cfe6', pants: '#3a3a4a', hair: 'bald', hairColor: '#777777', tie: '#2d3e8a' } },
  son: { name: 'Anh Sơn (ứng viên GĐKD)', short: 'Anh Sơn', look: { shirt: '#9fb4ff', pants: '#2d3e5a', hair: 'short', hairColor: '#1d1d1f', tie: '#c0392b' } },
  yen: { name: 'Chị Yến (ứng viên Marketing)', short: 'Chị Yến', look: { shirt: '#ffb3e6', pants: '#7d5a8a', hair: 'wavy', hairColor: '#7a3b1e', phone: true } },
  nam: { name: 'Anh Nam (ứng viên Kế toán trưởng)', short: 'Anh Nam', look: { shirt: '#c7e8b5', pants: '#4b5566', hair: 'side', hairColor: '#1d1d1f', glasses: true } },
  trinh: { name: 'Chị Trinh (ứng viên CFO)', short: 'Chị Trinh', look: { shirt: '#e3d9ff', pants: '#3f3f55', hair: 'bun', hairColor: '#2a2a2a', glasses: true } },
  hanh: { name: 'Chị Hạnh (Săn Đầu Pro, đối thủ)', short: 'Chị Hạnh 🦈', look: { shirt: '#ff9f7a', pants: '#3a3a4a', hair: 'pony', hairColor: '#1d1d1f', phone: true } },
  banhmi: { name: 'Cô Bánh Mì (gọi nhầm số)', short: 'Cô Bánh Mì', look: { shirt: '#ffe08a', pants: '#8a6a5a', hair: 'curly', hairColor: '#555555', tote: true } },
};

export const LEVELS = {
  tm: {
    id: 'tm',
    client: 'T&M Partners',
    emoji: '📊',
    title: 'Deck cho chị Chủ tịch',
    blurb: 'T&M thuê SOS Advisory làm gấp đề xuất. Người T&M ra sảnh chờ lấy hàng, chị Tuyết duyệt deck, anh Đạt dựng bảng Scrum ngay giữa lối đi.',
    bossName: 'Chị Tuyết',
    quotes: [
      'Chị Tuyết: "Chị nghĩ các em cần nhìn vấn đề này ở góc độ chiến lược hơn."',
      'Chị Tuyết: "Đây là phân tích, nhưng đâu là business implication?"',
      'Chị Tuyết: "Ổn. Chị chỉ có một vài ý nhỏ thôi."',
      'Chị Tuyết: "Business implication rõ rồi. Lần sau T&M lại gọi SOS Advisory."',
    ],
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
    walls: TM_WALLS,
    decor: [
      // work area
      { kind: 'desk', x: -7.6, z: -2.55, npc: 'bao' }, { kind: 'desk', x: -5.9, z: -2.55, npc: 'trang' },
      { kind: 'plant', x: -1.6, z: -1.8 }, { kind: 'window', x: -6, z: -6 }, { kind: 'window', x: -3, z: -6 },
      // print room
      { kind: 'boxes', x: 2.5, z: -1.75 }, { kind: 'boxes', x: -0.4, z: -2.0 },
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
    floorDoorMats: TM_MATS,

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
      { id: 'tea', kind: 'source', gives: 'tea', label: 'Ấm trà', x: -8.2, z: 3.4 },
      { id: 'contracts', kind: 'source', gives: 'contract', label: 'Kệ hồ sơ', x: 1.6, z: -3.4 },
      { id: 'huddle', kind: 'huddle', label: 'Bàn họp nhanh', x: 1.5, z: 3.5 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy lễ tân', x: 6.2, z: 2.2, faces: 'up' },
    ],
    boss: TM.tuyet,

    // clients: T&M people who come to the lobby to pick up the work
    clients: [TM.han, TM.khang, TM.linh, TM.ha, TM.mai, TM.an, TM.quynh, TM.long],
    clientSpots: [{ x: 4.0, z: 3.4 }, { x: 5.6, z: 3.3 }, { x: 6.9, z: 3.3 }, { x: 8.2, z: 3.4 }],
    clientDoor: [{ x: 10, z: 4.4 }, { x: 8.4, z: 4.4 }], // path in from outside (reversed to leave)
    tips: [
      '✋ Một nút làm mọi thứ: đứng sát trạm rồi bấm (lấy, đặt, ghép, làm việc, nộp)',
      '💻 Laptop và Bàn họp nhanh: đặt đồ lên, bấm thêm lần nữa và đứng yên tới khi thanh chạy xong',
      '🖨️ Máy in và chị Tuyết tự làm: đặt vào rồi đi làm việc khác, nhớ quay lại lấy',
      '☕ Burnout gần đầy: ra Pantry uống cà phê (ly thứ 3 trong 45 giây phản tác dụng)',
      '🔔 Nghe chuông stand-up: tránh xa vòng hồng quanh bảng Scrum',
      '🗑️ Đồ hỏng hoặc làm nhầm: vứt ở Thùng rác',
    ],
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
    // what each station kind does here (see DEFAULT_PROCESS in engine.js)
    process: {
      work: {
        laptop: { data: { to: 'excel', time: 3.5 }, brief: { to: 'slide', time: 3 }, deck_notes: { to: 'deck', time: 2 } },
        huddle: { brief: { to: 'minutes', time: 4 } },
      },
      auto: {
        printer: { excel: { to: 'print', time: 5, overdue: 8 }, contract: { to: 'contract_print', time: 4, overdue: 8 } },
        boss: { deck: { to: 'deck_signed', time: 3, notes: 'deck_notes', fixAt: 'Laptop' }, contract_print: { to: 'contract_signed', time: 2.5 } },
      },
      combos: [[['slide', 'print'], 'deck']],
    },
    recipes: {
      // steps: the short chain on the ticket · how: the full guide in the 📖 Công thức book
      tea: { title: 'Trà cho khách', item: 'tea', time: 40, reward: 15, steps: ['🍵 Ấm trà (Pantry)', '🛎️ Quầy'],
        how: ['Vào Pantry, lấy trà ở Ấm trà', 'Mang thẳng ra Quầy lễ tân'] },
      excel: { title: 'File Excel đối chiếu', item: 'excel', time: 60, reward: 35, steps: ['📊 Data', '💻 Laptop', '🛎️ Quầy'],
        how: ['Lấy Data ở Kệ Data', 'Đặt lên Laptop, bấm thêm lần nữa rồi đứng yên làm ~3,5 giây', 'Nộp luôn file Excel ở Quầy lễ tân (đừng mang đi in!)'] },
      minutes: { title: 'Biên bản họp', item: 'minutes', time: 70, reward: 50, steps: ['📝 Brief', '🗣️ Bàn họp nhanh', '🛎️ Quầy'],
        how: ['Lấy Brief ở Kệ Brief', 'Vào Phòng họp, đặt lên Bàn họp nhanh, bấm thêm lần nữa rồi đứng làm ~4 giây', 'Nộp Biên bản họp ở Quầy lễ tân'] },
      contract: { title: 'Hợp đồng ký tên', item: 'contract_signed', time: 90, reward: 90, steps: ['📃 Kệ hồ sơ', '🖨️ In', '✍️ Chị Tuyết ký'],
        how: ['Lấy Hợp đồng nháp ở Kệ hồ sơ (Phòng in)', 'Đặt vào Máy in, chờ ~4 giây rồi lấy ra ngay (để quá 8 giây là hỏng)', 'Mang vào Bàn chị Tuyết để ký', 'Nộp Hợp đồng đã ký ở Quầy lễ tân'] },
      slide: { title: 'Slide nhanh', item: 'slide', time: 55, reward: 30, steps: ['📝 Brief', '💻 Laptop', '🛎️ Quầy'],
        how: ['Lấy Brief ở Kệ Brief', 'Đặt lên Laptop, bấm thêm lần nữa rồi đứng yên làm ~3 giây', 'Lấy Slide ra, nộp ở Quầy lễ tân'] },
      report: { title: 'Báo cáo số liệu', item: 'print', time: 75, reward: 60, steps: ['📊 Data', '💻 Laptop', '🖨️ In'],
        how: ['Lấy Data ở Kệ Data, làm ở Laptop thành Excel', 'Mang Excel vào Máy in, chờ ~5 giây', 'Lấy Bản in ra ngay (để quá 8 giây là hỏng), nộp ở Quầy lễ tân'] },
      deck: { title: 'Deck đề xuất', item: 'deck_signed', time: 120, reward: 140, join: ' · ',
        steps: ['🖼️ Slide (📝→💻)', '📄 Bản in (📊→💻→🖨️)', '🗂️ ghép', '✍️ ký'],
        how: ['Làm Slide: Brief → Laptop', 'Làm Bản in: Data → Laptop → Máy in', 'Đặt một món lên Bàn ghép (hành lang), cầm món kia tới bấm để ghép thành Deck', 'Mang Deck vào Bàn chị Tuyết ký. Bị "vài ý nhỏ" thì mang về Laptop sửa rồi ký lại', 'Nộp Deck đã ký ở Quầy lễ tân'] },
    },
    orderPool: [
      { recipe: 'tea', w: 1.5 },
      { recipe: 'slide', w: 2.5 },
      { recipe: 'excel', w: 2 },
      { recipe: 'report', w: 2.5 },
      { recipe: 'minutes', w: 2, after: 15 },
      { recipe: 'contract', w: 2, after: 35 },
      { recipe: 'deck', w: 2.5, after: 25 },
    ],
    // pacing by team size (1, 2, 3, 4 players): alone = fewer, more patient clients
    pace: [
      { gap: 34, time: 1.4, max: 2, first: [2, 16] },
      { gap: 24, time: 1.15, max: 3, first: [2, 10] },
      { gap: 18, time: 1, max: 4, first: [2, 8] },
      { gap: 14, time: 0.9, max: 4, first: [2, 6] },
    ],
    stars: [200, 450, 700],          // thousand đồng for 1, 2, 3 stars (×0.6 when playing alone)
  },
  bama: {
    id: 'bama',
    client: 'Ba & Má',
    emoji: '🍖',
    title: 'Chốt đơn mùa Tết',
    blurb: 'Nhà phố kiêm xưởng khô gà mùa Tết: Út Mi live hô flash sale liên tục, Má đi tắt lò sấy cho "tiết kiệm điện" (cầu dao ngay sau lưng Má), hộp quà phải qua Má duyệt.',
    bossName: 'Má',
    quotes: [
      'Má: "Thuê tụi con về mà Má phải tự gói hả? Cái này bao nhiêu tiền?"',
      'Ba: "Hồi xưa ba bán ngoài chợ một mình còn nhanh hơn."',
      'Má: "Cũng được. Má ghi sổ rồi, tháng sau tính."',
      'Út Mi: "Chốt đơn kỷ lục luôn cả nhà iu!" Má: "Lần sau gọi SOS tiếp. Nhưng bớt giá nha."',
    ],
    bossLine: 'Cái này bao nhiêu tiền? Dán lại tem cho Má.',
    notesChance: 0.3,
    duration: 180,
    room: { w: 18, d: 12 },
    wall: '#ffd3b8',
    // A family shophouse + workshop (not the office plan of T&M):
    //  z=-6 ┌──────────── XƯỞNG (sơ chế + lò sấy) ───────────┬──────── PHÒNG MÁ · KÉT ─────────┐
    //       │ Tủ gà  Tủ bò  Thùng xoài          Bàn để khô     │ Ba  Két     Bàn Má     Cầu dao   │
    //       │              [Lò sấy 1][Lò sấy 2]  (đảo giữa)    │                                 │
    //       │ Bàn ướp Bàn ướp                                  ├─[cửa]──── kính ─────────────────┤ z=-2.2
    //       │                                              [cửa]│ lối │ GÓC LIVESTREAM (kính)    │
    //  z=1  ├─[cửa bếp]──┬────[mở rộng: sang khu gói]──────────┤ đi  │ Út Mi · đèn ring         │
    //       │ BẾP CÔ TƯ   │ KHU ĐÓNG GÓI: Gói Gói               ├─────┴──────────────────────────┤ z=1
    //       │ ăn thử      │                                     │ lối nhân viên ra quầy          │
    //  z=3.2│ trà đá      │           Ghép Ghép      Rác        ├──────[QUẦY GIAO HÀNG]──────────┤
    //       │             │                                     │ CỬA HÀNG (khách)  ← cửa ra phố │
    //  z=6  └─────────────┴─────────────────────────────────────┴────────────────────────────────┘
    rooms: [
      { name: 'XƯỞNG SƠ CHẾ & SẤY', icon: '🔪', x0: -9, x1: 2, z0: -6, z1: 1, floor: '#f1ece4', sign: [-1.8, 1], color: '#ffe3c2' },
      { name: 'PHÒNG MÁ · KÉT', icon: '💰', x0: 2, x1: 9, z0: -6, z1: -2.2, floor: '#ffe6ef', sign: [3.8, -2.2], color: '#ffb3c7' },
      { name: '', x0: 2, x1: 4.6, z0: -2.2, z1: 1, floor: '#fff8ef' },
      { name: 'GÓC LIVESTREAM', icon: '🔴', x0: 4.6, x1: 9, z0: -2.2, z1: 1, floor: '#ffe3ea', sign: [6.8, 1], color: '#ff9fb2' },
      { name: 'BẾP CÔ TƯ', icon: '🍲', x0: -9, x1: -4.5, z0: 1, z1: 6, floor: '#e3f2d0', sign: [-6.4, 1], color: '#bfe6b5' },
      { name: 'KHU ĐÓNG GÓI', icon: '📦', x0: -4.5, x1: 3, z0: 1, z1: 6, floor: '#fff1e0', sign: [-0.6, 5.95], color: '#ffd3b8' },
      { name: '', x0: 3, x1: 9, z0: 1, z1: 3.2, floor: '#fff8ef' },
      { name: 'CỬA HÀNG', icon: '🛍️', x0: 3, x1: 9, z0: 3.2, z1: 6, floor: '#fff0b3', sign: [4.2, 3.2], color: '#ffe08a' },
    ],
    walls: [
      // workshop | kitchen & packing (door to the kitchen, wide opening to packing)
      { x0: -9, z0: 1, x1: -7.2, z1: 1 }, { x0: -5.6, z0: 1, x1: -3.8, z1: 1 }, { x0: 0.2, z0: 1, x1: 2, z1: 1 },
      { x0: -4.5, z0: 1, x1: -4.5, z1: 6 },
      // workshop | Má's office and the little hall (door at z −1.6…−0.2)
      { x0: 2, z0: -6, x1: 2, z1: -1.6 }, { x0: 2, z0: -0.2, x1: 2, z1: 1 },
      // Má's office: glass, door from the hall (x 3…4.6) — Má sees everything
      { x0: 2, z0: -2.2, x1: 3, z1: -2.2, kind: 'glass' }, { x0: 4.6, z0: -2.2, x1: 9, z1: -2.2, kind: 'glass' },
      // livestream corner: glass to the hall, wall to the staff lane
      { x0: 4.6, z0: -2.2, x1: 4.6, z1: 1, kind: 'glass' }, { x0: 4.6, z0: 1, x1: 9, z1: 1 },
      // shop: counter in the wall between the staff lane and the clients; packing | shop
      { x0: 3, z0: 3.2, x1: 5.25, z1: 3.2 }, { x0: 7.15, z0: 3.2, x1: 9, z1: 3.2 },
      { x0: 3, z0: 3.2, x1: 3, z1: 6 },
    ],
    floorDoorMats: [[-6.4, 1], [2, -0.9, 'v'], [3.8, -2.2], [9, 4.4, 'v']],
    decor: [
      // workshop
      { kind: 'crates', x: -4.0, z: -5.3 }, { kind: 'window', x: -6.5, z: -6 }, { kind: 'window', x: -1.5, z: -6 },
      { kind: 'person', x: 0.9, z: -1.0, npc: BM.cautam, face: -0.6 }, { kind: 'boxes', x: -8.5, z: 0.4 },
      // Má's office: Ba beside the safe, Má's red chair
      { kind: 'safe', x: 8.3, z: -5.3 }, { kind: 'person', x: 7.1, z: -5.2, npc: BM.hung, face: 0.3 },
      { kind: 'redchair', x: 3.2, z: -5.1 }, { kind: 'plant', x: 2.6, z: -2.8 }, { kind: 'window', x: 5.5, z: -6 },
      // livestream corner (seen through the glass)
      { kind: 'livetable', x: 7.0, z: -0.3 }, { kind: 'person', x: 7.0, z: -1.4, npc: BM.mi, face: 0 },
      { kind: 'ringlight', x: 5.3, z: -0.5 }, { kind: 'person', x: 8.5, z: 0.4, npc: BM.khoa, face: -2.4 },
      // kitchen
      { kind: 'fridge', x: -8.4, z: 5.3 }, { kind: 'cafetable', x: -6.2, z: 3.6, cat: true }, { kind: 'person', x: -5.1, z: 5.4, npc: BM.tu, face: -0.8 },
      // packing area
      { kind: 'crates', x: -3.6, z: 5.4 }, { kind: 'plant', x: 2.5, z: 1.5 },
      // shop
      { kind: 'shelfgoods', x: 5.2, z: 5.6 }, { kind: 'altar', x: 3.5, z: 5.6 }, { kind: 'person', x: 8.4, z: 5.6, npc: BM.bay, face: -2.6 },
    ],

    spawns: [{ x: -2.2, z: -0.3 }, { x: -0.6, z: -0.3 }, { x: -2.2, z: 0.4 }, { x: -0.6, z: 0.4 }],
    stations: [
      { id: 'ga', kind: 'source', gives: 'ga', label: 'Tủ đông gà', x: -8.2, z: -5.3 },
      { id: 'bo', kind: 'source', gives: 'bo', label: 'Tủ đông bò', x: -6.8, z: -5.3 },
      { id: 'fruit', kind: 'source', gives: 'fruit', label: 'Thùng xoài', x: -5.4, z: -5.3 },
      { id: 'c_dry', kind: 'counter', label: 'Bàn để khô', x: 0.8, z: -5.3 },
      { id: 'dryer1', kind: 'dryer', label: 'Lò sấy 1', x: -2.9, z: -3.4 },
      { id: 'dryer2', kind: 'dryer', label: 'Lò sấy 2', x: -1.5, z: -3.4 },
      { id: 'prep1', kind: 'prep', label: 'Bàn ướp', x: -7.9, z: -1.8 },
      { id: 'prep2', kind: 'prep', label: 'Bàn ướp', x: -6.5, z: -1.8 },
      { id: 'boss', kind: 'boss', label: 'Bàn Má duyệt', x: 5.6, z: -4.6 },
      { id: 'breaker', kind: 'breaker', label: 'Cầu dao (sau lưng Má)', x: 8.4, z: -3.2 },
      { id: 'pack1', kind: 'pack', label: 'Bàn đóng gói', x: -3.0, z: 2.4 },
      { id: 'pack2', kind: 'pack', label: 'Bàn đóng gói', x: -1.6, z: 2.4 },
      { id: 'c3', kind: 'counter', label: 'Bàn ghép', x: -2.3, z: 4.6 },
      { id: 'c4', kind: 'counter', label: 'Bàn ghép', x: -0.9, z: 4.6 },
      { id: 'trash', kind: 'trash', label: 'Thùng rác', x: 1.8, z: 5.3 },
      { id: 'coffee', kind: 'coffee', label: 'Trà đá cô Tư', drink: 'Uống trà đá cô Tư 🧊', x: -6.6, z: 5.3 },
      { id: 'an_thu', kind: 'source', gives: 'an_thu', label: 'Khô ăn thử', x: -8.3, z: 3.0 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy giao hàng', x: 6.2, z: 3.2, faces: 'up' },
    ],
    boss: BM.hang,

    clients: [BM.tam, BM.sau, BM.tuan, BM.maicskh, BM.ngan, BM.dung, BM.shipper, BM.shopoi],
    clientSpots: [{ x: 4.3, z: 4.3 }, { x: 5.6, z: 4.25 }, { x: 6.8, z: 4.25 }, { x: 8.0, z: 4.3 }],
    clientDoor: [{ x: 10, z: 4.6 }, { x: 8.6, z: 4.6 }],
    clientLines: {
      wait: ['Shop ơi còn hàng hông?', 'Chốt đơn lẹ giùm chị', 'Đơn của chị đâu em?', 'Chị đợi nãy giờ á', 'Có freeship hông em?'],
      happy: ['Khô ngon quá shop ơi!', '5 sao nha!', 'Đúng vị nhà làm!', 'Lần sau chị mua tiếp'],
      angry: ['Hủy đơn!', 'Chị đánh giá 1 sao', 'Bên kia giao nhanh hơn', 'Thôi chị ra chợ mua'],
    },

    // signature events of this level
    flash: {
      at: [50, 112, 158], warn: 4, count: 2, bonus: 1.5, patience: 0.8, recipes: ['an_thu', 'fruit', 'ga'],
      warnText: 'Út Mi: "Cả nhà iu ơi 3, 2, 1… FLASH SALE nè!"',
      text: 'Út Mi: "Chốt đơn! Chốt đơn!"',
    },
    powerCut: {
      at: [80, 140], warn: 3, stations: ['dryer1', 'dryer2'],
      warnText: 'Má đi ngang xưởng, tay cầm sổ…',
      text: 'Má: "Lò sấy chạy mà không ai đứng coi? Tắt! Tốn điện!" Cầu dao ở trong phòng Má, ngay sau lưng Má. Chạy vào bật lại!',
      backLine: 'Má (từ xa): "Ai bật đó?"',
    },

    process: {
      work: {
        prep: { ga: { to: 'ga_uop', time: 3 }, bo: { to: 'bo_uop', time: 3 }, fruit: { to: 'fruit_cut', time: 2.5 } },
        pack: { kho_ga: { to: 'goi_ga', time: 2.5 }, kho_bo: { to: 'goi_bo', time: 2.5 }, hop_tem: { to: 'hop_qua', time: 2 } },
      },
      auto: {
        dryer: {
          ga_uop: { to: 'kho_ga', time: 6, overdue: 9, ruin: 'burnt', ruinText: BURNT },
          bo_uop: { to: 'kho_bo', time: 6, overdue: 9, ruin: 'burnt', ruinText: BURNT },
          fruit_cut: { to: 'fruit_dry', time: 5, overdue: 9, ruin: 'burnt', ruinText: BURNT },
        },
        boss: { hop_qua: { to: 'hop_ok', time: 3, notes: 'hop_tem', fixAt: 'Bàn đóng gói' } },
      },
      combos: [[['goi_bo', 'fruit_dry'], 'hop_qua']],
    },
    recipes: {
      an_thu: { title: 'Gói ăn thử', item: 'an_thu', time: 40, reward: 15, steps: ['🍢 Khô ăn thử (Bếp)', '🛎️ Quầy'],
        how: ['Vào Bếp cô Tư, lấy một gói ở Khô ăn thử', 'Mang thẳng ra Quầy giao hàng'] },
      fruit: { title: 'Xoài sấy (xá)', item: 'fruit_dry', time: 70, reward: 40, steps: ['🥭 Xoài', '🔪 Bàn ướp', '🔥 Sấy'],
        how: ['Lấy Xoài ở Thùng xoài (xưởng)', 'Đặt lên Bàn ướp, bấm thêm lần nữa rồi đứng cắt ~2,5 giây', 'Mang vào Lò sấy (giữa xưởng), chờ ~5 giây rồi lấy ra ngay (để lâu là cháy)', 'Nộp ở Quầy giao hàng'] },
      ga: { title: 'Khô gà lá chanh', item: 'goi_ga', time: 95, reward: 75, steps: ['🐔 Gà', '🔪 Ướp', '🔥 Sấy', '📦 Gói'],
        how: ['Lấy Gà ở Tủ đông gà', 'Đặt lên Bàn ướp, bấm thêm lần nữa rồi đứng ướp ~3 giây', 'Mang vào Lò sấy, chờ ~6 giây rồi lấy ra ngay', 'Đặt lên Bàn đóng gói (khu đóng gói), đứng gói ~2,5 giây', 'Nộp ở Quầy giao hàng'] },
      bo: { title: 'Khô bò miếng', item: 'goi_bo', time: 100, reward: 85, steps: ['🐄 Bò', '🔪 Ướp', '🔥 Sấy', '📦 Gói'],
        how: ['Lấy Bò ở Tủ đông bò', 'Ướp ở Bàn ướp ~3 giây', 'Sấy ở Lò sấy ~6 giây, lấy ra ngay', 'Gói ở Bàn đóng gói ~2,5 giây', 'Nộp ở Quầy giao hàng'] },
      hop: { title: 'Hộp quà Tết Phú Quý', item: 'hop_ok', time: 140, reward: 160, join: ' · ',
        steps: ['📦 Gói khô bò', '🥭 Xoài sấy', '🗂️ ghép', '💰 Má duyệt'],
        how: ['Làm Gói khô bò: Bò → Bàn ướp → Lò sấy → Bàn đóng gói', 'Làm Xoài sấy: Xoài → Bàn ướp → Lò sấy', 'Đặt một món lên Bàn ghép, cầm món kia tới bấm để ghép thành Hộp quà', 'Mang vào Bàn Má duyệt. Má bắt "dán lại tem" thì mang về Bàn đóng gói dán rồi đưa Má lại', 'Nộp ở Quầy giao hàng'] },
    },
    tips: [
      '✋ Một nút làm mọi thứ: đứng sát trạm rồi bấm (lấy, đặt, ghép, làm việc, nộp)',
      '🔪 Bàn ướp và 📦 Bàn đóng gói: đặt đồ lên, bấm thêm lần nữa và đứng yên tới khi thanh chạy xong',
      '🔥 Lò sấy tự chạy: đặt vào rồi đi làm việc khác, nhưng quay lại lấy kịp kẻo khô cháy',
      '🔴 Út Mi hô flash sale: khách ùa vào, trả ×1,5 nhưng ít kiên nhẫn hơn',
      '⚡ Má tắt lò sấy: cầu dao nằm trong phòng Má (góc phải), chạy vào bật lại',
      '🧊 Burnout gần đầy: vào Bếp cô Tư uống trà đá',
    ],
    orderPool: [
      { recipe: 'an_thu', w: 1.5 },
      { recipe: 'fruit', w: 2.5 },
      { recipe: 'ga', w: 3 },
      { recipe: 'bo', w: 2, after: 20 },
      { recipe: 'hop', w: 2, after: 40 },
    ],
    pace: [
      { gap: 34, time: 1.4, max: 2, first: [2, 16] },
      { gap: 24, time: 1.15, max: 3, first: [2, 10] },
      { gap: 18, time: 1, max: 4, first: [2, 8] },
      { gap: 14, time: 0.9, max: 4, first: [2, 6] },
    ],
    stars: [200, 450, 700],
  },
  hr: {
    id: 'hr',
    client: 'Người Đúng Chỗ HR',
    emoji: '🧲',
    title: 'Tuyển gấp mùa cao điểm',
    blurb: 'Công ty tư vấn nhân sự có nhân sự nội bộ… tệ nhất. Bách hứa khách shortlist trong 48 tiếng, ứng viên ghost nếu để lâu, ATS là file Google Sheets 14.000 dòng.',
    bossName: 'Anh Duy',
    bossLine: 'Em thêm chữ "culture fit" vào offer giúp anh.',
    notesChance: 0.3,
    quotes: [
      'Anh Duy: "Mình không phải công ty, mình là gia đình. Gia đình thì… lần sau làm lại."',
      'Chị Ngân: "Ứng viên nói để em suy nghĩ là bảy mươi phần trăm từ chối rồi."',
      'Anh Duy: "Ổn. Anh vừa đăng LinkedIn khen SOS Advisory. 2.000 like."',
      'Anh Tuấn: "Placement kỷ lục! Pantry tối nay lẩu mừng, anh Duy bao." Anh Duy: "…trong tuần."',
    ],
    duration: 180,
    room: { w: 18, d: 12 },
    wall: '#e3d9ff',
    entrance: 'left',
    // A small HR firm around a glass interview room (clients come in from the LEFT this time):
    //  z=-6 ┌─────────── KHU RECRUITER (bàn mở) ───────────────┬── PHÒNG ANH DUY (kính) ──┐
    //       │ Máy in CV  Tủ khảo sát  ATS  ATS  ATS              │        Bàn anh Duy       │
    //       │            ┌─[cửa]─ TALENT ROOM (kính) ─┐           ├────────[cửa]─────────────┤ z=-2
    //       │            │  Ghế PV 1        Ghế PV 2  │  [KPI ·   │ C&B chị My   IT của Phát │
    //       │            └─[cửa]──────────────────────┘ anh Khoa] │                          │
    //  z=1.5├──────[QUẦY TIẾP KHÁCH]──────┬──── (mở) ─────────────┴──────[cửa]─────────────┤
    //  cửa→ │ SẢNH ỨNG VIÊN (khách chờ)    │ KHU GHÉP HỒ SƠ: Ghép Ghép Ghép   Rác │ PANTRY   │
    //  z=6  └──────────────────────────────┴───────────────────────────────────────┴──────────┘
    rooms: [
      { name: 'KHU RECRUITER', icon: '🔎', x0: -9, x1: 4, z0: -6, z1: 1.5, floor: '#f6f1ff', sign: [-8.4, -0.7], color: '#e3d9ff' },
      { name: 'TALENT ROOM', icon: '🎤', x0: -3, x1: 1.4, z0: -3.2, z1: 0.2, floor: '#ffe6ef', sign: [-0.8, 0.2], color: '#ffc8dd' },
      { name: 'PHÒNG ANH DUY', icon: '👔', x0: 4, x1: 9, z0: -6, z1: -2, floor: '#fff3c4', sign: [5.8, -2], color: '#ffe08a' },
      { name: 'C&B · IT', icon: '📈', x0: 4, x1: 9, z0: -2, z1: 1.5, floor: '#e3f7ee', sign: [8.0, -2], color: '#b8f0d8' },
      { name: 'SẢNH ỨNG VIÊN', icon: '🪑', x0: -9, x1: -3.2, z0: 1.5, z1: 6, floor: '#fff0e6', sign: [-4.4, 1.5], color: '#ffd3b8' },
      { name: 'KHU GHÉP HỒ SƠ', icon: '🗂️', x0: -3.2, x1: 4, z0: 1.5, z1: 6, floor: '#fff8ef', sign: [0.4, 5.95], color: '#fff1b8' },
      { name: 'PANTRY', icon: '☕', x0: 4, x1: 9, z0: 1.5, z1: 6, floor: '#fff3c4', sign: [5.6, 1.5], color: '#ffe9a0' },
    ],
    walls: [
      // Talent Room: glass on all sides, a door at the top and one at the bottom (x −1.4…−0.2)
      { x0: -3, z0: -3.2, x1: -1.4, z1: -3.2, kind: 'glass' }, { x0: -0.2, z0: -3.2, x1: 1.4, z1: -3.2, kind: 'glass' },
      { x0: -3, z0: 0.2, x1: -1.4, z1: 0.2, kind: 'glass' }, { x0: -0.2, z0: 0.2, x1: 1.4, z1: 0.2, kind: 'glass' },
      { x0: -3, z0: -3.2, x1: -3, z1: 0.2, kind: 'glass' }, { x0: 1.4, z0: -3.2, x1: 1.4, z1: 0.2, kind: 'glass' },
      // founder's glass office, door to the C&B corner (x 5…6.6)
      { x0: 4, z0: -6, x1: 4, z1: -2, kind: 'glass' }, { x0: 4, z0: -2, x1: 5, z1: -2, kind: 'glass' }, { x0: 6.6, z0: -2, x1: 9, z1: -2, kind: 'glass' },
      // lobby: the reception counter sits in its top wall; solid wall to the filing area
      { x0: -9, z0: 1.5, x1: -6.95, z1: 1.5 }, { x0: -5.05, z0: 1.5, x1: -3.2, z1: 1.5 },
      { x0: -3.2, z0: 1.5, x1: -3.2, z1: 6 },
      // filing area is open to the recruiters (x −3.2…1.5); pantry has a door from the C&B corner and one from filing
      { x0: 1.5, z0: 1.5, x1: 4, z1: 1.5 }, { x0: 4, z0: 1.5, x1: 4.6, z1: 1.5 }, { x0: 6.2, z0: 1.5, x1: 9, z1: 1.5 },
      { x0: 4, z0: 1.5, x1: 4, z1: 3.8 }, { x0: 4, z0: 5.2, x1: 4, z1: 6 },
    ],
    floorDoorMats: [[-0.8, -3.2], [-0.8, 0.2], [5.8, -2], [5.4, 1.5], [4, 4.5, 'v'], [-9, 4.4, 'v']],
    decor: [
      // recruiters at their desks (facing the camera) and the plants of "Culture"
      { kind: 'desk', x: -7.6, z: -2.6, npc: HR.vy }, { kind: 'desk', x: -5.4, z: -2.6, npc: HR.quan },
      { kind: 'plant', x: 3.4, z: -5.4 }, { kind: 'window', x: -6, z: -6 }, { kind: 'window', x: -1, z: -6 },
      // founder's office
      { kind: 'shelf', x: 8.4, z: -4.0 }, { kind: 'plant', x: 4.5, z: -5.4 }, { kind: 'window', x: 6.5, z: -6 },
      // C&B · IT corner: Phát's IT desk
      { kind: 'desk', x: 6.9, z: 1.0, npc: HR.phat },
      // lobby
      { kind: 'sofa', x: -6.1, z: 5.4 }, { kind: 'plant', x: -3.8, z: 5.5 }, { kind: 'reception', x: -8.0, z: 0.4, npc: HR.thao, sign: 'Chị Thảo · lễ tân kiêm mọi thứ', icon: '🧾' },
      // filing area
      { kind: 'crates', x: -2.4, z: 5.4, text: 'HỒ SƠ ỨNG VIÊN', icon: '🗂️' },
      // pantry: Tuấn closes deals on the phone, Mèo Ghost
      { kind: 'fridge', x: 8.4, z: 5.3 }, { kind: 'cafetable', x: 7.6, z: 3.1, cat: true }, { kind: 'person', x: 5.0, z: 5.3, npc: HR.tuan, face: 0.6 },
    ],

    spawns: [{ x: -4.6, z: -0.6 }, { x: 2.4, z: -0.6 }, { x: -4.6, z: 0.6 }, { x: 2.4, z: 0.6 }],
    stations: [
      { id: 'cvprint', kind: 'source', gives: 'cv', label: 'Máy in CV', x: -8.0, z: -5.3 },
      { id: 'survey', kind: 'source', gives: 'survey', label: 'Tủ khảo sát lương', x: -6.6, z: -5.3 },
      { id: 'ats1', kind: 'laptop', label: 'ATS', x: -4.6, z: -5.3 },
      { id: 'ats2', kind: 'laptop', label: 'ATS', x: -3.2, z: -5.3 },
      { id: 'ats3', kind: 'laptop', label: 'ATS', x: -1.8, z: -5.3 },
      { id: 'iv1', kind: 'interview', label: 'Ghế phỏng vấn', x: -1.9, z: -1.5 },
      { id: 'iv2', kind: 'interview', label: 'Ghế phỏng vấn', x: 0.3, z: -1.5 },
      { id: 'boss', kind: 'boss', label: 'Bàn anh Duy', x: 6.5, z: -4.4 },
      { id: 'cb', kind: 'cb', label: 'Bàn C&B · chị My', x: 5.4, z: -0.4, who: HR.my },
      { id: 'breaker', kind: 'breaker', label: 'IT · Phát (restart ATS)', x: 8.4, z: -1.0 },
      { id: 'c1', kind: 'counter', label: 'Bàn ghép', x: -1.8, z: 3.0 },
      { id: 'c2', kind: 'counter', label: 'Bàn ghép', x: -0.4, z: 3.0 },
      { id: 'c3', kind: 'counter', label: 'Bàn ghép', x: 1.0, z: 3.0 },
      { id: 'trash', kind: 'trash', label: 'Thùng rác', x: 3.2, z: 5.3 },
      { id: 'coffee', kind: 'coffee', label: 'Cà phê chốt deal', x: 6.6, z: 5.4 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy tiếp khách', x: -6.0, z: 1.5, faces: 'up' },
    ],
    boss: HR.duy,

    clients: [HR.kimanh, HR.tai, HR.son, HR.yen, HR.nam, HR.trinh, HR.hanh, HR.banhmi],
    clientSpots: [{ x: -8.2, z: 2.6 }, { x: -6.9, z: 2.5 }, { x: -5.4, z: 2.5 }, { x: -4.1, z: 2.6 }],
    clientDoor: [{ x: -10, z: 4.4 }, { x: -8.4, z: 4.4 }],
    clientLines: {
      wait: ['Có shortlist chưa em?', 'Bách hứa 48 tiếng mà', 'Anh còn offer chỗ khác đó', 'Để em suy nghĩ thêm…', 'Bên Săn Đầu Pro nhanh hơn'],
      happy: ['Đúng người đúng chỗ!', 'Tuần sau em đi làm luôn', 'Chị giới thiệu thêm khách cho', 'Quá chuyên nghiệp'],
      angry: ['Thôi chị tự tuyển', 'Em nhận offer khác rồi', 'Seen. (ghost)', 'Phí cao mà chậm'],
    },

    // interview questions: good = this candidate should pass the round
    quiz: [
      { q: 'Vì sao em nghỉ chỗ cũ?', a: 'Sếp cũ không tôn trọng em. Em đăng TikTok nói xấu sếp có ba lần mà sếp vẫn giận.', good: false, why: 'Nói xấu chỗ cũ công khai là red flag.' },
      { q: 'Em mong muốn mức lương bao nhiêu?', a: 'Em tìm hiểu rồi, vị trí này thị trường khoảng 15–18 triệu. Em mong 17 và thương lượng được ạ.', good: true, why: 'Có tìm hiểu thị trường, mong muốn hợp lý.' },
      { q: 'Điểm yếu của em là gì?', a: 'Em hay ôm việc. Giờ em đang học cách chia việc và báo sớm khi bị quá tải.', good: true, why: 'Nhận ra điểm yếu và đang sửa.' },
      { q: 'Điểm yếu của em là gì?', a: 'Em cầu toàn quá ạ. Với lại em hay đi trễ hai tiếng.', good: false, why: 'Đi trễ hai tiếng không phải "cầu toàn".' },
      { q: 'Em biết gì về công ty bên chị?', a: 'Dạ… công ty mình làm về… nhân sự đúng không ạ? Em rải CV 200 chỗ nên hơi lẫn.', good: false, why: 'Không tìm hiểu gì về nơi mình ứng tuyển.' },
      { q: 'Kể một lần em làm sai việc.', a: 'Em gửi nhầm báo giá cho khách. Em gọi xin lỗi ngay, gửi lại bản đúng, từ đó em tự kiểm tra hai lần.', good: true, why: 'Nhận lỗi, sửa nhanh, rút kinh nghiệm.' },
      { q: '5 năm nữa em thấy mình ở đâu?', a: 'Ngồi ghế của chị ạ. Sớm hơn thì càng tốt.', good: false, why: 'Tham vọng thì được, nhưng câu này… hơi đáng sợ.' },
      { q: 'Em có câu hỏi gì cho chị không?', a: 'Dạ, team mình đang gặp khó nhất ở đâu, và ba tháng đầu em cần làm được gì ạ?', good: true, why: 'Hỏi đúng thứ quan trọng.' },
      { q: 'Em có câu hỏi gì cho chị không?', a: 'Dạ không. À mà công ty có cho ngủ trưa ba tiếng không ạ?', good: false, why: 'Câu hỏi duy nhất là về giờ ngủ trưa.' },
      { q: 'Em dùng Excel được không?', a: 'Em làm được VLOOKUP, pivot, có làm dashboard báo cáo tuần ở chỗ cũ. Em gửi chị file mẫu nhé.', good: true, why: 'Có kỹ năng thật, có bằng chứng.' },
      { q: 'CV ghi "thành thạo tiếng Anh" là sao em?', a: 'Dạ em xem phim có phụ đề tiếng Anh ạ.', good: false, why: 'CV "tô hồng" quá đà.' },
      { q: 'Bao giờ em đi làm được?', a: 'Em cần báo trước chỗ cũ 30 ngày theo hợp đồng, xong là em đi làm ngay ạ.', good: true, why: 'Làm đúng hợp đồng với chỗ cũ là chuyên nghiệp.' },
      { q: 'Vì sao em muốn làm ở đây?', a: 'Vì văn phòng gần nhà người yêu em ạ.', good: false, why: 'Lý do không liên quan gì tới công việc.' },
      { q: 'Em làm việc nhóm thế nào?', a: 'Em hay chủ động chia việc theo thế mạnh, chốt deadline chung và cập nhật tiến độ mỗi ngày.', good: true, why: 'Cụ thể, biết phối hợp.' },
    ],

    // signature events of this level
    decay: { types: ['cv_ok', 'interviewed', 'offer_draft'], after: 14, to: 'ghost', text: 'Ứng viên đã ghost. Vứt đi tìm người khác!' },
    powerCut: {
      at: [72, 138], warn: 3, stations: ['ats1', 'ats2', 'ats3'], icon: '💥',
      warnText: 'Phát: "Ai vừa sort một cột trong file ATS 14.000 dòng vậy…"',
      text: 'ATS sập! Google Sheets đứng hình, không lọc được CV. Ra bàn IT của Phát (góc C&B) bấm restart.',
      offSign: 'ATS sập', fixSign: 'Restart ở đây!', offHint: 'đang đứng hình! Ra bàn IT của Phát restart 💥',
      fixHint: 'Restart ATS 💥', fixVerb: 'restart ATS', backLine: 'Phát: "Em restart máy thử chưa? …Rồi, chạy rồi."',
    },
    standup: {
      board: { x: 2.7, z: -2.4 }, radius: 1.7, at: [48, 118], warn: 5, length: 7,
      coach: HR.khoa,
      boardText: ['KPI: 40 CV/NGÀY', 'Đã ghost: 12 😶', 'Placement: 1'],
      warnText: 'Anh Khoa: "Trước khi làm tiếp, mình chơi một icebreaker nhỏ nhé!" Tránh xa bảng KPI!',
      line: 'Anh Khoa: "Ba từ mô tả bản thân. Không được dùng từ mệt."',
    },

    process: {
      work: {
        laptop: { cv: { to: 'cv_ok', time: 2.5 }, survey: { to: 'survey_xls', time: 3 }, offer_notes: { to: 'offer_draft', time: 2 } },
        // quiz: the player reads the candidate's answer and decides pass / reject (see `quiz` below)
        interview: { cv_ok: { to: 'interviewed', time: 4, quiz: true, quizTime: 8 } },
      },
      auto: {
        cb: { survey_xls: { to: 'salary_report', time: 4 } },
        boss: { offer_draft: { to: 'offer_signed', time: 3, notes: 'offer_notes', fixAt: 'ATS' } },
      },
      combos: [[['interviewed', 'salary_report'], 'offer_draft']],
    },
    recipes: {
      cv: { title: 'CV gửi gấp', item: 'cv', time: 40, reward: 15, steps: ['🖨️ Máy in CV', '🛎️ Quầy'],
        how: ['Lấy CV ở Máy in CV (góc trên bên trái)', 'Mang thẳng ra Quầy tiếp khách'] },
      shortlist: { title: 'Shortlist', item: 'cv_ok', time: 60, reward: 35, steps: ['📄 CV', '💻 ATS lọc', '🛎️ Quầy'],
        how: ['Lấy CV ở Máy in CV', 'Đặt lên ATS, bấm thêm lần nữa rồi đứng lọc ~2,5 giây', 'Nộp ngay ở Quầy tiếp khách (để trên bàn lâu là ứng viên ghost)'] },
      interview: { title: 'Ứng viên đã phỏng vấn', item: 'interviewed', time: 90, reward: 70, steps: ['📄 CV', '💻 ATS lọc', '🎤 Talent Room'],
        how: ['Làm CV đã lọc: CV → ATS', 'Vào Talent Room (phòng kính giữa văn phòng), đặt lên Ghế phỏng vấn: ứng viên ngồi vào ghế nóng', 'Bấm thêm lần nữa để phỏng vấn: đọc câu trả lời, trong 8 giây chọn ✅ Cho qua vòng hoặc ❌ Loại', 'Chọn đúng → Ứng viên đã phỏng vấn. Nhận nhầm người tệ → phải vứt. Loại người tệ → CV quay về, lọc người khác. Ngồi im quá 8 giây → ứng viên ghost', 'Nộp ở Quầy tiếp khách'] },
      salary: { title: 'Báo cáo lương', item: 'salary_report', time: 80, reward: 60, steps: ['📋 Tủ khảo sát', '💻 ATS', '📈 Bàn C&B'],
        how: ['Lấy Phiếu khảo sát ở Tủ khảo sát lương', 'Đặt lên ATS, đứng làm ~3 giây thành Bảng lương thô', 'Mang sang Bàn C&B của chị My (góc phải), chị My tự tính ~4 giây', 'Nộp Báo cáo lương ở Quầy tiếp khách'] },
      offer: { title: 'Offer đã ký', item: 'offer_signed', time: 140, reward: 150, join: ' · ',
        steps: ['🤝 Ứng viên đã PV', '📈 Báo cáo lương', '🗂️ ghép', '✍️ anh Duy ký'],
        how: ['Làm Ứng viên đã phỏng vấn (CV → ATS → Talent Room)', 'Làm Báo cáo lương (Khảo sát → ATS → Bàn C&B)', 'Đặt một món lên Bàn ghép, cầm món kia tới bấm để ghép thành Offer nháp (đừng để lâu, ứng viên ghost)', 'Mang vào Bàn anh Duy ký. Bị bắt "thêm chữ culture fit" thì mang về ATS sửa rồi ký lại', 'Nộp Offer đã ký ở Quầy tiếp khách'] },
    },
    tips: [
      '✋ Một nút làm mọi thứ: đứng sát trạm rồi bấm (lấy, đặt, ghép, làm việc, nộp)',
      '🎤 Phỏng vấn: đọc câu trả lời của ứng viên rồi chọn Cho qua vòng / Loại (phím 1 / 2), có 8 giây',
      '👻 CV đã lọc, ứng viên đã phỏng vấn và offer nháp để trên bàn quá 14 giây là ứng viên ghost: làm xong thì mang đi luôn',
      '💥 ATS sập (có người sort cột): ra bàn IT của Phát ở góc C&B bấm restart',
      '🎲 Anh Khoa gọi icebreaker: tránh xa bảng KPI cạnh Talent Room',
      '📈 Bàn C&B của chị My tự chạy: đặt Bảng lương thô vào rồi đi làm việc khác',
      '☕ Burnout gần đầy: vào Pantry uống cà phê (anh Tuấn đang chốt deal trong đó)',
    ],
    orderPool: [
      { recipe: 'cv', w: 1.5 },
      { recipe: 'shortlist', w: 2.5 },
      { recipe: 'interview', w: 2.5, after: 10 },
      { recipe: 'salary', w: 2, after: 15 },
      { recipe: 'offer', w: 2, after: 40 },
    ],
    pace: [
      { gap: 34, time: 1.4, max: 2, first: [2, 16] },
      { gap: 24, time: 1.15, max: 3, first: [2, 10] },
      { gap: 18, time: 1, max: 4, first: [2, 8] },
      { gap: 14, time: 0.9, max: 4, first: [2, 6] },
    ],
    stars: [200, 450, 700],
  },
};
