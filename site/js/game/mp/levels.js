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

// Trend Trễ Agency people (looks copied from companies/agency/cast.js; brand managers are new bodies)
const AG = {
  tung: { name: 'Anh Tùng', look: { shirt: '#ff5d8f', pants: '#2b2d42', hair: 'quiff', hairColor: '#b8b8c0', glasses: true, mug: true } },
  diep: { name: 'Chị Diệp', look: { shirt: '#ff9f1c', pants: '#3d405b', hair: 'bun', hairColor: '#2a1a12', phone: true, tote: true } },
  khai: { name: 'Anh Khải', look: { shirt: '#2b2d42', pants: '#1d1d1f', hair: 'beanie', hairColor: '#1d1d1f', glasses: true } },
  thi: { name: 'Thi', look: { shirt: '#c77dff', pants: '#4a4e69', hair: 'long', hairColor: '#3b2418', notes: true } },
  vy: { name: 'Vỹ', look: { shirt: '#ff6b9a', pants: '#22223b', hair: 'curly', hairColor: '#5a3d8a', pods: true } },
  loc: { name: 'Anh Lộc', look: { shirt: '#3a86ff', pants: '#2b2d42', hair: 'cap', hairColor: '#1d1d1f', mug: true } },
  suong: { name: 'Sương', look: { shirt: '#2ec4b6', pants: '#3d405b', hair: 'pony', hairColor: '#1d1d1f', phone: true, glasses: true } },
  kieu: { name: 'Chị Kiều', look: { shirt: '#ff70a6', pants: '#6d597a', hair: 'wavy', hairColor: '#8a4b2a', phone: true, tote: true } },
  phat: { name: 'Anh Phát', look: { shirt: '#8d99ae', pants: '#2b2d42', hair: 'short', hairColor: '#1d1d1f', tote: true } },
  linh: { name: 'Khánh Linh', look: { shirt: '#ffb703', pants: '#f2e6cf', hair: 'long', hairColor: '#7a3b1e', clip: true, phone: true } },
  nguyet: { name: 'Chị Nguyệt (Mì Ông Táo)', short: 'Chị Nguyệt', look: { shirt: '#ffd166', pants: '#3d405b', hair: 'bun', hairColor: '#2a1a12', phone: true } },
  tuanrx: { name: 'Anh Tuấn (Kem đánh răng Răng Xinh)', short: 'Anh Tuấn', look: { shirt: '#bde0fe', pants: '#2b2d42', hair: 'side', hairColor: '#1d1d1f', tie: '#3a86ff' } },
  bin: { name: 'Bin 🔥 (cháu anh Tuấn)', short: 'Bin 🔥', look: { shirt: '#ffadad', pants: '#1d1d1f', hair: 'cap', hairColor: '#ff5d8f', pods: true } },
  sen: { name: 'Chị Sen (Ngân hàng Sen Hồng)', short: 'Chị Sen', look: { shirt: '#ffc8dd', pants: '#3f3f55', hair: 'long', hairColor: '#1d1d1f', glasses: true } },
  may: { name: 'Chị Mây (Trà Sữa Tâm Trạng)', short: 'Chị Mây', look: { shirt: '#c9b6ff', pants: '#f2e6cf', hair: 'pony', hairColor: '#7a3b1e', phone: true } },
  hai: { name: 'Anh Hải (Bia Hơi Phố)', short: 'Anh Hải', look: { shirt: '#ffe08a', pants: '#4b5566', hair: 'short', hairColor: '#1d1d1f', mug: true } },
  lua: { name: 'Anh Lúa (app Lúa Vàng)', short: 'Anh Lúa', look: { shirt: '#9ee8c8', pants: '#2b2d42', hair: 'quiff', hairColor: '#4a3226', pods: true } },
  ken: { name: 'Anh Ken (quản lý KOL)', short: 'Anh Ken 🕶️', look: { shirt: '#1d1d1f', pants: '#1d1d1f', hair: 'side', hairColor: '#1d1d1f', glasses: true, phone: true } },
};

// Đi Đâu Cũng Được people (looks copied from companies/event/cast.js; clients are new bodies)
const EV = {
  kieu: { name: 'Chị Kiều', look: { shirt: '#ffcf6b', pants: '#5a3a5a', hair: 'wavy', hairColor: '#5a2a1a', phone: true } },
  duy: { name: 'Anh Duy', look: { shirt: '#3a3f4a', pants: '#1f2328', hair: 'cap', hairColor: '#1d1d1f', pods: true } },
  tien: { name: 'Anh Tiến', look: { shirt: '#b8e0d2', pants: '#2f3542', hair: 'beanie', hairColor: '#ff9f7a', pods: true } },
  khoa: { name: 'Khoa', look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'curly', hairColor: '#3b2418', notes: true } },
  lan: { name: 'Chị Lan', look: { shirt: '#ffc6e0', pants: '#8a6a5a', hair: 'wavy', hairColor: '#4a3226', tote: true } },
  quan: { name: 'Anh Quân', look: { shirt: '#2f3542', pants: '#1f2328', hair: 'quiff', hairColor: '#1d1d1f', pods: true } },
  vy: { name: 'Vy', look: { shirt: '#a8e6cf', pants: '#7d86b3', hair: 'long', hairColor: '#3b2418', clip: true, phone: true } },
  hai: { name: 'Anh Hải', look: { shirt: '#ffd166', pants: '#2f4a3a', hair: 'cap', hairColor: '#e63946', tote: true } },
  quang: { name: 'Anh Quang (Chủ tịch Bê Tông Vững Chãi)', short: 'Anh Quang', look: { shirt: '#3a3f55', pants: '#1f2328', hair: 'side', hairColor: '#9a9a9a', tie: '#c0392b' } },
  huong: { name: 'Chị Hường (HR Bê Tông Vững Chãi)', short: 'Chị Hường', look: { shirt: '#ff9fb2', pants: '#3f3f55', hair: 'bun', hairColor: '#1d1d1f', glasses: true, phone: true } },
  thang: { name: 'Anh Thắng (trưởng đoàn Khỏe Re)', short: 'Anh Thắng', look: { shirt: '#9fd3ff', pants: '#3a4a6b', hair: 'short', hairColor: '#1d1d1f', cap: true } },
  loc: { name: 'Anh Lộc Xe (nhà xe 45 chỗ)', short: 'Anh Lộc Xe', look: { shirt: '#f2a65a', pants: '#4a4a3a', hair: 'cap', hairColor: '#3a3f55', phone: true } },
  diem: { name: 'Chị Diễm (Biển Xanh Resort)', short: 'Chị Diễm', look: { shirt: '#b8f0d8', pants: '#5a4a6b', hair: 'long', hairColor: '#2a1a12' } },
  mckhai: { name: 'MC Khải ("giọng ấm")', short: 'MC Khải', look: { shirt: '#ffffff', pants: '#1d1d1f', hair: 'quiff', hairColor: '#1d1d1f', tie: '#ffd25a' } },
  hoa: { name: 'Chị Hoa (Hoa Tươi Mãi)', short: 'Chị Hoa', look: { shirt: '#ffc8dd', pants: '#6b5a4a', hair: 'curly', hairColor: '#5a3a2a', tote: true } },
  codau: { name: 'Cô dâu Thùy (tiệc cưới ngoài trời)', short: 'Cô dâu Thùy', look: { shirt: '#ffffff', pants: '#ffffff', hair: 'bun', hairColor: '#2a1a12', clip: true } },
};

// Cân Đối & Cộng Sự people (looks copied from companies/audit/cast.js; client staff are new bodies)
const AU = {
  phong: { name: 'Anh Phong (Partner)', short: 'Anh Phong', look: { shirt: '#2f4a6b', pants: '#1f2a3a', hair: 'side', hairColor: '#9a9a9a', glasses: true, tie: '#b8f0d8' } },
  thao: { name: 'Chị Thảo', look: { shirt: '#ff8fa3', pants: '#4a3f5a', hair: 'bun', hairColor: '#1d1d1f', glasses: true, mug: true } },
  khoa: { name: 'Anh Khoa', look: { shirt: '#c9d1dc', pants: '#3a3f4a', hair: 'curly', hairColor: '#2a2a2a', pods: true, mug: true } },
  diep: { name: 'Chị Diệp', look: { shirt: '#c9b6ff', pants: '#3f3f55', hair: 'pony', hairColor: '#2b1b14', clip: true, notes: true } },
  vy: { name: 'Vy', look: { shirt: '#ffd166', pants: '#5b6b9a', hair: 'long', hairColor: '#3b2418', phone: true, tote: true } },
  tuan: { name: 'Tuấn', look: { shirt: '#a8dcc0', pants: '#4a5a52', hair: 'cap', hairColor: '#1d1d1f', mug: true } },
  quang: { name: 'Anh Quang (CFO Phúc Lộc Foods)', short: 'Anh Quang', look: { shirt: '#ffffff', pants: '#2f3542', hair: 'side', hairColor: '#1d1d1f', tie: '#c0392b', glasses: true } },
  ketoan: { name: 'Chị Hà (kế toán trưởng khách)', short: 'Chị Hà', look: { shirt: '#ffe9a0', pants: '#5a4a3a', hair: 'bun', hairColor: '#2a2a2a', glasses: true } },
  thukho: { name: 'Chú Ba (thủ kho khách)', short: 'Chú Ba', look: { shirt: '#9fd3ff', pants: '#3a3a4a', hair: 'bald', hairColor: '#777777', notes: true } },
  thue: { name: 'Anh Dũng (cán bộ thuế)', short: 'Anh Dũng', look: { shirt: '#c7e8b5', pants: '#3f3f55', hair: 'short', hairColor: '#1d1d1f', glasses: true } },
  bank: { name: 'Chị Linh (ngân hàng)', short: 'Chị Linh', look: { shirt: '#ffc8dd', pants: '#3f3f55', hair: 'long', hairColor: '#1d1d1f', phone: true } },
  ceo: { name: 'Bà Phúc (CEO Phúc Lộc Foods)', short: 'Bà Phúc', look: { shirt: '#ff9f7a', pants: '#3a3a4a', hair: 'wavy', hairColor: '#5a3a26', glasses: true } },
  nhadautu: { name: 'Anh Kevin (nhà đầu tư)', short: 'Anh Kevin', look: { shirt: '#3a3f55', pants: '#1d1d1f', hair: 'quiff', hairColor: '#4a3226', pods: true } },
  sang: { name: 'Anh Sang (dịch vụ kế toán)', short: 'Anh Sang', look: { shirt: '#ffb38a', pants: '#5a4a3a', hair: 'short', hairColor: '#1d1d1f', phone: true } },
};

// Nợ Kỹ Thuật Labs people (looks copied from companies/tech/cast.js; users and partners are new bodies)
const TE = {
  kevin: { name: 'Anh Quân "Kevin"', short: 'Kevin', look: { shirt: '#ffd166', pants: '#2f3a56', hair: 'quiff', hairColor: '#2a1d14', phone: true } },
  thac: { name: 'Anh Thạc', look: { shirt: '#9aa7c7', pants: '#33384a', hair: 'curly', hairColor: '#1d1d1f', glasses: true, mug: true } },
  diep: { name: 'Chị Diệp', look: { shirt: '#c9b6ff', pants: '#4a3f66', hair: 'bun', hairColor: '#2a2a2a', glasses: true, notes: true } },
  khai: { name: 'Anh Khải', look: { shirt: '#a8dcc0', pants: '#3f4a45', hair: 'short', hairColor: '#1d1d1f', pods: true } },
  nguyet: { name: 'Chị Nguyệt', look: { shirt: '#ff9fb2', pants: '#5a4a6b', hair: 'pony', hairColor: '#3b2418', glasses: true, phone: true } },
  vy: { name: 'Vy', look: { shirt: '#ffb3e6', pants: '#f2e6cf', hair: 'wavy', hairColor: '#7a3b1e', clip: true, tote: true } },
  tung: { name: 'Tùng', look: { shirt: '#8fd3ff', pants: '#2f3a56', hair: 'cap', hairColor: '#1d1d1f', pods: true, phone: true } },
  loc: { name: 'Anh Lộc (DevOps)', short: 'Anh Lộc', look: { shirt: '#3a3a4a', pants: '#2a2a33', hair: 'beanie', hairColor: '#1d1d1f', pods: true } },
  chau: { name: 'Châu', look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'long', hairColor: '#2b1b14', clip: true, tote: true } },
  victor: { name: 'Anh Victor (quỹ Hạt Giống Ventures)', short: 'Anh Victor', look: { shirt: '#ffffff', pants: '#1d1d1f', hair: 'side', hairColor: '#4a3226', glasses: true, tie: '#3a86ff' } },
  tanaka: { name: 'Tanaka-san (khách Nhật)', short: 'Tanaka-san', look: { shirt: '#ffffff', pants: '#2f3a56', hair: 'short', hairColor: '#1d1d1f', glasses: true, tie: '#4a5bd8' } },
  user1: { name: 'Chị Mai (user đánh giá 1 sao)', short: 'User 1 sao', look: { shirt: '#ffc6e0', pants: '#5a4a6b', hair: 'long', hairColor: '#3b2418', phone: true } },
  po: { name: 'Chị Hằng (PO bên khách)', short: 'Chị Hằng PO', look: { shirt: '#b8f0d8', pants: '#3f3f55', hair: 'bun', hairColor: '#1d1d1f', notes: true } },
  shark: { name: 'Shark Hùng (gọi vốn)', short: 'Shark Hùng', look: { shirt: '#2f3542', pants: '#1d1d1f', hair: 'bald', hairColor: '#777777', tie: '#ffd25a' } },
  bacnam: { name: 'Bác Năm ("app này bấm đâu")', short: 'Bác Năm', look: { shirt: '#c7e8b5', pants: '#5a4a3a', hair: 'side', hairColor: '#c9c9c9', glasses: true } },
  api: { name: 'Anh Bảo (đối tác API)', short: 'Anh Bảo', look: { shirt: '#9fb4ff', pants: '#2f3a56', hair: 'cap', hairColor: '#1d1d1f', pods: true } },
  bank: { name: 'Chị Linh (ngân hàng đối tác)', short: 'Chị Linh', look: { shirt: '#ffd3b8', pants: '#3f3f55', hair: 'wavy', hairColor: '#2a1a12', phone: true } },
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
      warnText: 'Anh Đạt: "5 giây nữa stand-up!" Tránh xa bảng Scrum',
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
      warnText: 'Út Mi: "3, 2, 1… FLASH SALE!"',
      text: 'Chốt đơn!',
    },
    powerCut: {
      at: [80, 140], warn: 3, stations: ['dryer1', 'dryer2'],
      warnText: 'Má đang đi ngang xưởng…',
      text: 'Má tắt lò sấy! Cầu dao ở phòng Má',
      backLine: 'Có điện lại. Má: "Ai bật đó?"',
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
    decay: { types: ['cv_ok', 'interviewed', 'offer_draft'], after: 14, to: 'ghost', text: 'Ứng viên ghost!' },
    powerCut: {
      at: [72, 138], warn: 3, stations: ['ats1', 'ats2', 'ats3'], icon: '💥',
      warnText: 'Phát: "Ai vừa sort cột vậy…"',
      text: 'ATS sập! Restart ở bàn IT của Phát',
      offSign: 'ATS sập', fixSign: 'Restart ở đây!', offHint: 'đang đứng hình! Ra bàn IT của Phát restart 💥',
      fixHint: 'Restart ATS 💥', fixVerb: 'restart ATS', backLine: 'ATS chạy lại rồi',
    },
    standup: {
      board: { x: 2.7, z: -2.4 }, radius: 1.7, at: [48, 118], warn: 5, length: 7,
      coach: HR.khoa,
      boardText: ['KPI: 40 CV/NGÀY', 'Đã ghost: 12 😶', 'Placement: 1'],
      warnText: 'Anh Khoa: "Icebreaker nhé!" Tránh xa bảng KPI',
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
  agency: {
    id: 'agency',
    client: 'Trend Trễ Agency',
    emoji: '📣',
    title: 'Sửa lần cuối (lần thứ 14)',
    blurb: 'Agency trong một căn villa cũ có giếng trời. Client "feedback nhẹ" liên tục, KOL bùng vào phút chót, anh Tùng muốn mọi thứ phải "pop".',
    bossName: 'Anh Tùng',
    bossLine: 'Cái này được, nhưng chưa pop. Em hiểu ý anh chứ? Pop!',
    notesChance: 0.3,
    quotes: [
      'Anh Tùng: "Cái này được, nhưng chưa pop. Lần sau làm lại từ brief."',
      'Anh Khải: "Chưa đủ đau."',
      'Chị Diệp: "Client seen 👍. Không phải chê, nhưng cũng không phải khen."',
      'Anh Tùng: "POP! Thắng pitch rồi, cả nhà đi Đà Lạt. Lần này thật."',
    ],
    duration: 180,
    room: { w: 18, d: 12 },
    wall: '#ffc8dd',
    // An old villa around a light well (players run circles around the tree):
    //  z=-6 ┌──── PHÒNG CREATIVE ─────────┬──── PHÒNG ANH TÙNG ────┬──── MEDIA & KOL ─────────┐
    //       │ Brief  Mac(Vỹ)  Mac  Copy(Thi)│     Bàn anh Tùng       │ Bàn KOL (Kiều)    Đt dự phòng│
    //  z=-2 ├───[cửa]──────────────────────┴──[cửa]────────────────┴──[cửa]────────────────────┤
    //       │ Ghép Ghép     ┌──── GIẾNG TRỜI (cây, ghế đá, guitar) ────┐   [Bảng WIP · Diệp]   │
    //       │ Rác           └──────────────────────────────────────────┘                        │
    //  z=2.5├──[cửa]───────┬───────[cửa]────────────┬──────────[QUẦY CLIENT]─────────────────────┤
    //       │ STUDIO QUAY   │ PANTRY · Mì Ông Táo free │ PHÒNG CLIENT (khách chờ)    ← cửa vào      │
    //  z=6  └───────────────┴──────────────────────────┴────────────────────────────────────────┘
    rooms: [
      { name: 'PHÒNG CREATIVE', icon: '🎨', x0: -9, x1: -2, z0: -6, z1: -2, floor: '#fff0f6', sign: [-5.8, -2], color: '#ffc8dd' },
      { name: 'PHÒNG ANH TÙNG', icon: '💥', x0: -2, x1: 3, z0: -6, z1: -2, floor: '#f1ecff', sign: [0.5, -2], color: '#ff9fb2' },
      { name: 'MEDIA & KOL', icon: '🌟', x0: 3, x1: 9, z0: -6, z1: -2, floor: '#e8f4ff', sign: [6.2, -2], color: '#bfe3ff' },
      { name: '', x0: -9, x1: 9, z0: -2, z1: 2.5, floor: '#fbf6ee' },
      { name: 'STUDIO QUAY', icon: '🎬', x0: -9, x1: -3.5, z0: 2.5, z1: 6, floor: '#eef3ff', sign: [-6.2, 2.5], color: '#bfe3ff' },
      { name: 'PANTRY', icon: '🍜', x0: -3.5, x1: 2.5, z0: 2.5, z1: 6, floor: '#fff3c4', sign: [-0.8, 2.5], color: '#ffe9a0' },
      { name: 'PHÒNG CLIENT', icon: '🤝', x0: 2.5, x1: 9, z0: 2.5, z1: 6, floor: '#f6efe3', sign: [3.4, 2.5], color: '#ffd3b8' },
    ],
    walls: [
      { x0: -9, z0: -2, x1: -6.8, z1: -2 }, { x0: -4.8, z0: -2, x1: -2, z1: -2 },
      { x0: -2, z0: -2, x1: -0.5, z1: -2 }, { x0: 1.5, z0: -2, x1: 3, z1: -2 },
      { x0: 3, z0: -2, x1: 5.2, z1: -2 }, { x0: 7.2, z0: -2, x1: 9, z1: -2 },
      { x0: -2, z0: -6, x1: -2, z1: -2 }, { x0: 3, z0: -6, x1: 3, z1: -2 },
      { x0: -9, z0: 2.5, x1: -7.2, z1: 2.5 }, { x0: -5.2, z0: 2.5, x1: -3.5, z1: 2.5 },
      { x0: -3.5, z0: 2.5, x1: -1.8, z1: 2.5 }, { x0: 0.2, z0: 2.5, x1: 2.5, z1: 2.5 },
      { x0: 2.5, z0: 2.5, x1: 4.85, z1: 2.5 }, { x0: 6.75, z0: 2.5, x1: 9, z1: 2.5 },
      { x0: -3.5, z0: 2.5, x1: -3.5, z1: 6 }, { x0: 2.5, z0: 2.5, x1: 2.5, z1: 6 },
    ],
    floorDoorMats: [[-5.8, -2], [0.5, -2], [6.2, -2], [-6.2, 2.5], [-0.8, 2.5], [9, 4.4, 'v']],
    decor: [
      // light well in the middle of the villa
      { kind: 'courtyard', x: 0, z: 0.25, w: 5.2, d: 2.4, text: 'GIẾNG TRỜI · guitar không ai đánh' },
      // creative room
      { kind: 'person', x: -2.7, z: -3.0, npc: AG.khai, face: -0.8 }, { kind: 'window', x: -6, z: -6 },
      { kind: 'crates', x: -8.4, z: -2.8, text: 'IDEAS BỊ GIẾT · 312', icon: '🗃️' },
      // MD room
      { kind: 'shelf', x: 2.4, z: -4.4 }, { kind: 'plant', x: -1.4, z: -5.4 }, { kind: 'window', x: 0.5, z: -6 },
      // media & KOL
      { kind: 'tv', x: 8.6, z: -4.4, text: ['CPM ĐANG CAO', 'Thuật toán đổi rồi'] }, { kind: 'person', x: 3.7, z: -2.7, npc: AG.loc, face: 0.6 },
      { kind: 'person', x: 6.2, z: -5.5, npc: AG.suong, face: 0 },
      // studio
      { kind: 'ringlight', x: -4.4, z: 4.7 }, { kind: 'person', x: -8.3, z: 5.2, npc: AG.phat, face: 0.8 }, { kind: 'person', x: -4.4, z: 5.7, npc: AG.linh, face: Math.PI },
      // pantry
      { kind: 'crates', x: -2.8, z: 5.4, text: 'MÌ ÔNG TÁO · FREE', icon: '🍜' }, { kind: 'fridge', x: 1.9, z: 5.3 }, { kind: 'cafetable', x: 0.4, z: 4.0, cat: true },
      // client room
      { kind: 'sofa', x: 5.3, z: 5.4 }, { kind: 'plant', x: 3.0, z: 5.5 },
    ],

    spawns: [{ x: -4.0, z: -1.4 }, { x: 3.8, z: -1.4 }, { x: -4.0, z: 2.0 }, { x: 3.4, z: 2.0 }],
    stations: [
      { id: 'brief', kind: 'source', gives: 'brief', label: 'Kệ Brief · chị Diệp', x: -8.2, z: -4.9 },
      { id: 'mac1', kind: 'mac', label: 'Mac · Vỹ', x: -6.6, z: -4.9, who: AG.vy },
      { id: 'mac2', kind: 'mac', label: 'Mac', x: -5.2, z: -4.9 },
      { id: 'copy', kind: 'copy', label: 'Bàn copy · Thi', x: -3.4, z: -4.9, who: AG.thi },
      { id: 'boss', kind: 'boss', label: 'Bàn anh Tùng', x: 0.5, z: -4.4 },
      { id: 'kol', kind: 'kol', label: 'Bàn KOL · chị Kiều', x: 5.0, z: -4.6, who: AG.kieu },
      { id: 'breaker', kind: 'breaker', label: 'Đt dự phòng (gọi KOL khác)', x: 8.3, z: -3.0 },
      { id: 'c1', kind: 'counter', label: 'Bàn ghép', x: -6.6, z: 0.2 },
      { id: 'c2', kind: 'counter', label: 'Bàn ghép', x: -5.2, z: 0.2 },
      { id: 'trash', kind: 'trash', label: 'Thùng rác', x: -8.5, z: 1.6 },
      { id: 'studio', kind: 'studio', label: 'Studio quay TikTok', x: -6.2, z: 4.0 },
      { id: 'coffee', kind: 'coffee', label: 'Cà phê + mì Ông Táo', drink: 'Ăn gói mì Ông Táo free 🍜', x: -1.0, z: 5.3 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy client', x: 5.8, z: 2.5, faces: 'up' },
    ],
    boss: AG.tung,

    clients: [AG.nguyet, AG.tuanrx, AG.bin, AG.sen, AG.may, AG.hai, AG.lua, AG.ken],
    clientSpots: [{ x: 3.8, z: 3.6 }, { x: 5.1, z: 3.55 }, { x: 6.5, z: 3.55 }, { x: 7.8, z: 3.6 }],
    clientDoor: [{ x: 10, z: 4.4 }, { x: 8.4, z: 4.4 }],
    clientLines: {
      wait: ['Sửa lần cuối thôi em', 'Làm sao cho viral nhé', 'Sếp chị chưa duyệt đâu', 'Có bản nháp chưa em?', 'Bên kia báo giá rẻ hơn'],
      happy: ['Ưng quá, chốt!', 'Viral rồi em ơi', 'Sếp chị khen', 'Lần này không sửa nữa'],
      angry: ['Thôi chị tìm agency khác', 'Trễ deadline rồi em', 'Chị chưa trả phí đâu nha', 'Để chị nói anh Tùng'],
    },

    // signature events of this level
    revise: {
      chance: 0.4,
      lines: ['Feedback nhẹ thôi: logo to lên chút', 'Trẻ hơn chút được không em?', 'Sếp chị muốn màu khác', 'Lần cuối thật, chị hứa', 'Bin cháu anh Tuấn góp ý tí', 'Làm sao cho nó viral hơn'],
    },
    powerCut: {
      at: [66, 132], warn: 3, stations: ['kol'], icon: '🌟',
      warnText: 'Chị Kiều: "KOL không seen…"',
      text: 'KOL bùng! Gọi KOL dự phòng (góc Media)',
      offSign: 'KOL bùng', fixSign: 'Gọi KOL khác!', offHint: 'đang bị KOL bùng! Gọi KOL dự phòng ở góc Media 📞',
      fixHint: 'Gọi KOL dự phòng 📞', fixVerb: 'gọi được KOL dự phòng', backLine: 'Có KOL mới rồi',
    },
    standup: {
      board: { x: 5.6, z: 0.2 }, radius: 1.5, at: [50, 120], warn: 5, length: 7,
      coach: AG.diep,
      boardText: ['WIP 9:45', 'AI ĐANG CHÁY?', 'Ông Táo: KV v14'],
      warnText: 'Chị Diệp: "WIP 5 phút nha!" Tránh xa bảng WIP',
      line: 'Chị Diệp: "Em ơi… à không, chị chỉ hỏi tiến độ thôi."',
    },

    process: {
      work: {
        mac: { brief: { to: 'kv', time: 3.5 }, kv_fb: { to: 'kv', time: 2 }, deck_pop: { to: 'deck_draft', time: 2 } },
        copy: { brief: { to: 'caption', time: 2.5 }, caption_fb: { to: 'caption', time: 1.5 } },
        studio: { caption: { to: 'tiktok', time: 4 }, tiktok_fb: { to: 'tiktok', time: 2.5 } },
      },
      auto: {
        kol: { kv: { to: 'kol_post', time: 4 } },
        boss: { deck_draft: { to: 'campaign', time: 3, notes: 'deck_pop', fixAt: 'Máy Mac' } },
      },
      combos: [[['kv', 'caption'], 'deck_draft']],
    },
    recipes: {
      caption: { title: 'Caption x30', item: 'caption', time: 50, reward: 25, revise: 'caption_fb', fixAt: 'Bàn copy',
        steps: ['📝 Brief', '✍️ Bàn copy', '🛎️ Quầy'],
        how: ['Lấy Brief ở Kệ Brief (phòng creative)', 'Đặt lên Bàn copy của Thi, bấm thêm lần nữa rồi đứng viết ~2,5 giây', 'Nộp ở Quầy client. Bị "trẻ hơn chút" thì mang về Bàn copy sửa rồi nộp lại'] },
      kv: { title: 'Key Visual', item: 'kv', time: 70, reward: 45, revise: 'kv_fb', fixAt: 'Máy Mac',
        steps: ['📝 Brief', '🎨 Mac', '🛎️ Quầy'],
        how: ['Lấy Brief', 'Đặt lên Mac, đứng thiết kế ~3,5 giây', 'Nộp ở Quầy client. Bị "logo to lên chút" thì mang về Mac sửa ~2 giây rồi nộp lại'] },
      tiktok: { title: 'Video TikTok', item: 'tiktok', time: 90, reward: 70, revise: 'tiktok_fb', fixAt: 'Studio',
        steps: ['📝 Brief', '✍️ Copy', '🎬 Studio quay'],
        how: ['Làm Caption: Brief → Bàn copy', 'Mang Caption xuống Studio quay (góc dưới bên trái), đứng quay ~4 giây', 'Nộp ở Quầy client. Bị "trend này cũ rồi" thì về Studio quay lại ~2,5 giây'] },
      kol: { title: 'Bài đăng KOL', item: 'kol_post', time: 90, reward: 80,
        steps: ['🎨 Key Visual', '🌟 Bàn KOL (tự chạy)', '🛎️ Quầy'],
        how: ['Làm Key Visual: Brief → Mac', 'Đặt KV lên Bàn KOL của chị Kiều, chị tự lo ~4 giây', 'KOL bùng thì ra Điện thoại dự phòng ở góc Media gọi KOL khác', 'Nộp Bài đăng KOL ở Quầy client'] },
      campaign: { title: 'Deck chiến dịch', item: 'campaign', time: 140, reward: 150, join: ' · ',
        steps: ['🎨 KV', '✍️ Caption', '🗂️ ghép', '💥 anh Tùng duyệt'],
        how: ['Làm Key Visual (Brief → Mac) và Caption (Brief → Bàn copy)', 'Đặt một món lên Bàn ghép (hành lang trái), cầm món kia tới bấm để ghép thành Deck nháp', 'Mang vào Bàn anh Tùng. Bị "chưa pop" thì mang về Mac sửa rồi đưa anh lại', 'Nộp Deck chiến dịch ở Quầy client'] },
    },
    tips: [
      '✋ Một nút làm mọi thứ: đứng sát trạm rồi bấm (lấy, đặt, ghép, làm việc, nộp)',
      '✏️ Client "feedback nhẹ": món bị trả lại vào tay bạn, mang đi sửa ở đúng chỗ rồi nộp lại (mỗi đơn chỉ bị sửa một lần)',
      '🌟 KOL bùng: Bàn KOL ngừng, ra Điện thoại dự phòng ở góc Media gọi KOL khác',
      '📋 Chị Diệp gọi WIP: tránh xa bảng WIP cạnh Quầy client',
      '🌳 Giếng trời ở giữa: chạy vòng quanh nó, đừng đâm vào cây',
      '🍜 Burnout gần đầy: vào Pantry ăn gói mì Ông Táo free',
    ],
    orderPool: [
      { recipe: 'caption', w: 2 },
      { recipe: 'kv', w: 2.5 },
      { recipe: 'tiktok', w: 2.5, after: 12 },
      { recipe: 'kol', w: 2, after: 20 },
      { recipe: 'campaign', w: 2, after: 40 },
    ],
    pace: [
      { gap: 34, time: 1.4, max: 2, first: [2, 16] },
      { gap: 24, time: 1.15, max: 3, first: [2, 10] },
      { gap: 18, time: 1, max: 4, first: [2, 8] },
      { gap: 14, time: 0.9, max: 4, first: [2, 6] },
    ],
    stars: [200, 450, 700],
  },
  event: {
    id: 'event',
    client: 'Đi Đâu Cũng Được',
    emoji: '🎪',
    title: 'Mưa giữa sự kiện',
    blurb: 'Gala ngoài trời cho Bê Tông Vững Chãi. Mưa kéo tới theo đợt: đồ để ngoài sân là ướt sũng, cất vào lều Plan B. Khách còn đổi ý phút chót.',
    bossName: 'Chị Kiều',
    bossLine: 'Có Plan B chưa em?',
    notesChance: 0.3,
    quotes: [
      'Chị Kiều: "Plan B đâu? Plan C đâu? Thôi về in lại hết."',
      'Anh Duy (qua bộ đàm): "Âm thanh rè, ánh sáng tắt, khách về sớm. Over."',
      'Chị Kiều: "Cũng ổn. Mưa mà vẫn chạy được là giỏi rồi."',
      'Anh Quang: "Năm sau Bê Tông Vững Chãi lại đặt SOS. Vững như bê tông!"',
    ],
    duration: 180,
    room: { w: 18, d: 12 },
    wall: '#ffe08a',
    //  z=-6 ┌── KHO ĐẠO CỤ ──────────────┬──── VĂN PHÒNG ─────────────────────┬── PHÒNG CHỊ KIỀU ──┐
    //       │ Thùng quà  Kho loa  Gói quà │ Hồ sơ tour  Brief BD  Laptop Laptop │    Bàn chị Kiều    │
    //       │                             │            Máy in khổ lớn          │                     │
    //  z=-2 ├────[cửa]───────────────────┴──────[cửa]────────────────────────┴───[cửa]────────────┤ (mái hiên)
    //       │ ⛺ LỀU PLAN B (khô):         SÂN SỰ KIỆN NGOÀI TRỜI (mưa theo đợt)                   │
    //       │    Bàn ghép  Bàn ghép        Bàn test âm thanh         ┌── hàng rào ── QUẦY CHECK-IN ┤
    //       │ ⛺ lều 2: nước, rác    [ SÂN KHẤU GALA ]               │ khu khách (← cổng)           │
    //  z=6  └────────────────────────────────────────────────────────┴──────────────────────────────┘
    rooms: [
      { name: 'KHO ĐẠO CỤ', icon: '📦', x0: -9, x1: -3, z0: -6, z1: -2, floor: '#f1ece4', sign: [-6.2, -2], color: '#ffe3c2' },
      { name: 'VĂN PHÒNG', icon: '💻', x0: -3, x1: 3.6, z0: -6, z1: -2, floor: '#f6f1ff', sign: [0.2, -2], color: '#e3d9ff' },
      { name: 'PHÒNG CHỊ KIỀU', icon: '🎤', x0: 3.6, x1: 9, z0: -6, z1: -2, floor: '#fff3c4', sign: [6.4, -2], color: '#ffcf6b' },
      { name: '', x0: -9, x1: 4, z0: -2, z1: 6, floor: '#cdebb5' },
      { name: '', x0: 4, x1: 9, z0: -2, z1: 2.5, floor: '#cdebb5' },
      { name: 'KHU KHÁCH', icon: '🎟️', x0: 4, x1: 9, z0: 2.5, z1: 6, floor: '#e6f4d8', sign: [4.6, 2.5], color: '#b8f0d8' },
    ],
    walls: [
      { x0: -9, z0: -2, x1: -7, z1: -2 }, { x0: -5.4, z0: -2, x1: -3, z1: -2 },
      { x0: -3, z0: -2, x1: -0.6, z1: -2 }, { x0: 1.0, z0: -2, x1: 3.6, z1: -2 },
      { x0: 3.6, z0: -2, x1: 5.6, z1: -2 }, { x0: 7.2, z0: -2, x1: 9, z1: -2 },
      { x0: -3, z0: -6, x1: -3, z1: -2 }, { x0: 3.6, z0: -6, x1: 3.6, z1: -2 },
      // the guests' area is fenced; the check-in counter sits in the fence
      { x0: 4, z0: 2.5, x1: 5.25, z1: 2.5 }, { x0: 7.15, z0: 2.5, x1: 9, z1: 2.5 }, { x0: 4, z0: 2.5, x1: 4, z1: 6 },
    ],
    floorDoorMats: [[-6.2, -2], [0.2, -2], [6.4, -2], [9, 4.4, 'v']],
    decor: [
      // indoor
      { kind: 'crates', x: -4.4, z: -3.0, text: 'ĐẠO CỤ TEAM BUILDING', icon: '🎈' }, { kind: 'window', x: -6, z: -6 }, { kind: 'window', x: 0.2, z: -6 },
      { kind: 'person', x: -2.4, z: -2.8, npc: EV.vy, face: 0.6 }, { kind: 'shelf', x: 8.4, z: -4.2 }, { kind: 'plant', x: 4.2, z: -5.4 },
      // outdoor: tents, the gala stage, Anh Duy with three walkie-talkies, Khoa the game host
      { kind: 'tent', x: -6.3, z: 0.6, w: 4.6, d: 3.4, text: 'LỀU PLAN B · khô' },
      { kind: 'tent', x: -7.5, z: 4.6, w: 3, d: 2.6, text: 'LỀU NƯỚC' },
      { kind: 'stage', x: -0.6, z: 4.6, w: 4.4, d: 2.0 },
      { kind: 'person', x: 2.6, z: 4.4, npc: EV.duy, face: -0.6 }, { kind: 'person', x: -2.2, z: 3.2, npc: EV.khoa, face: 0.3 },
      { kind: 'plant', x: 3.4, z: 0.2 }, { kind: 'plant', x: -3.4, z: 0.2 },
    ],

    spawns: [{ x: -2.0, z: -1.2 }, { x: 1.6, z: -1.2 }, { x: -2.0, z: 1.4 }, { x: 2.0, z: 1.6 }],
    stations: [
      { id: 'qua', kind: 'source', gives: 'qua', label: 'Thùng quà', x: -8.2, z: -5.2 },
      { id: 'loa', kind: 'source', gives: 'loa', label: 'Kho loa đài', x: -6.8, z: -5.2 },
      { id: 'wrap', kind: 'wrap', label: 'Bàn gói quà · chị Lan', x: -4.8, z: -5.2, who: EV.lan },
      { id: 'tour', kind: 'source', gives: 'tour_brief', label: 'Hồ sơ tour', x: -2.2, z: -5.2 },
      { id: 'bd', kind: 'source', gives: 'bd_brief', label: 'Brief backdrop', x: -0.8, z: -5.2 },
      { id: 'lap1', kind: 'laptop', label: 'Laptop', x: 0.6, z: -5.2 },
      { id: 'lap2', kind: 'laptop', label: 'Laptop · anh Tiến', x: 2.0, z: -5.2, who: EV.tien },
      { id: 'bigprint', kind: 'bigprint', label: 'Máy in khổ lớn', x: 1.2, z: -3.3 },
      { id: 'boss', kind: 'boss', label: 'Bàn chị Kiều', x: 6.4, z: -4.4 },
      { id: 'sound', kind: 'sound', label: 'Test âm thanh (ngoài trời)', x: 0.2, z: 0.4, who: EV.quan },
      { id: 'c1', kind: 'counter', label: 'Bàn ghép (trong lều)', x: -7.3, z: 0.6 },
      { id: 'c2', kind: 'counter', label: 'Bàn ghép (trong lều)', x: -5.5, z: 0.6 },
      { id: 'c3', kind: 'counter', label: 'Bàn (ngoài trời)', x: 2.8, z: -0.6 },
      { id: 'coffee', kind: 'coffee', label: 'Nước suối', drink: 'Uống chai nước suối 💧', x: -7.6, z: 5.2 },
      { id: 'trash', kind: 'trash', label: 'Thùng rác', x: -8.5, z: 3.8 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy check-in', x: 6.2, z: 2.5, faces: 'up' },
    ],
    boss: EV.kieu,

    clients: [EV.quang, EV.huong, EV.thang, EV.loc, EV.diem, EV.mckhai, EV.hoa, EV.codau],
    clientSpots: [{ x: 4.8, z: 3.6 }, { x: 5.9, z: 3.55 }, { x: 7.0, z: 3.55 }, { x: 8.1, z: 3.6 }],
    clientDoor: [{ x: 10, z: 4.4 }, { x: 8.4, z: 4.4 }],
    clientLines: {
      wait: ['Mấy giờ khai mạc em?', 'Có Plan B chưa?', 'Sếp anh tới rồi', 'Mưa vậy sao em?', 'Đổi giờ được không?'],
      happy: ['Quá đẹp luôn!', 'Mưa mà vẫn chạy!', 'Năm sau đặt tiếp', 'Đúng chất gala'],
      angry: ['Hủy hợp đồng!', 'Khách về hết rồi', 'Thôi khỏi', 'Ướt hết rồi em ơi'],
    },

    // signature events of this level
    rain: {
      at: [42, 102, 150], warn: 4, length: 16, wetAfter: 5, slow: 0.72,
      zone: { x0: -9, x1: 9, z0: -2, z1: 6 },
      cover: [{ x0: -8.6, x1: -4.0, z0: -1.1, z1: 2.3 }, { x0: -9, x1: -6, z0: 3.3, z1: 6 }, { x0: 4, x1: 9, z0: 2.5, z1: 6 }],
      dry: ['wet', 'ruined'],
      warnText: 'Trời tối sầm… mưa sắp tới!', text: 'Mưa! Cất đồ vào lều Plan B', endText: 'Tạnh mưa',
    },
    revise: {
      chance: 0.35,
      lines: ['Đổi giờ khai mạc nha', 'Thêm 20 khách được không?', 'Sang hơn chút em', 'Sếp anh muốn màu khác'],
    },

    process: {
      work: {
        wrap: { qua: { to: 'qua_goi', time: 2.5 } },
        laptop: { tour_brief: { to: 'lich_trinh', time: 3 }, bd_brief: { to: 'file_bd', time: 3 }, lich_fb: { to: 'lich_trinh', time: 2 }, bd_fb: { to: 'file_bd', time: 2 }, stage_planb: { to: 'stage_kit', time: 2 } },
        sound: { loa: { to: 'loa_ok', time: 3.5 } },
      },
      auto: {
        bigprint: { file_bd: { to: 'backdrop', time: 5, overdue: 9, ruin: 'ruined', ruinText: '🖨️ In lem! Vứt đi in lại' } },
        boss: { stage_kit: { to: 'stage_ok', time: 3, notes: 'stage_planb', fixAt: 'Laptop' } },
      },
      combos: [[['backdrop', 'loa_ok'], 'stage_kit']],
    },
    recipes: {
      qua: { title: 'Quà tặng gói sẵn', item: 'qua_goi', time: 50, reward: 30, steps: ['🎁 Thùng quà', '🎀 Gói', '🛎️ Quầy'],
        how: ['Lấy quà ở Thùng quà (kho)', 'Đặt lên Bàn gói quà, đứng gói ~2,5 giây', 'Nộp ở Quầy check-in (đi qua sân, coi chừng mưa)'] },
      lich: { title: 'Lịch trình tour', item: 'lich_trinh', time: 60, reward: 40, revise: 'lich_fb', fixAt: 'Laptop',
        steps: ['🗺️ Hồ sơ tour', '💻 Laptop', '🛎️ Quầy'],
        how: ['Lấy Hồ sơ tour', 'Làm ở Laptop ~3 giây', 'Nộp ở Quầy check-in. Khách đổi giờ thì về Laptop sửa'] },
      loa: { title: 'Loa đã test', item: 'loa_ok', time: 75, reward: 55, steps: ['🔈 Kho loa', '🔊 Test (ngoài sân)', '🛎️ Quầy'],
        how: ['Lấy loa ở Kho loa đài', 'Mang ra Bàn test âm thanh giữa sân, đứng test ~3,5 giây ("alo alo 1 2 3")', 'Nộp ở Quầy check-in'] },
      backdrop: { title: 'Backdrop in', item: 'backdrop', time: 85, reward: 65, revise: 'bd_fb', fixAt: 'Laptop rồi in lại',
        steps: ['📐 Brief', '💻 Laptop', '🖨️ In khổ lớn'],
        how: ['Lấy Brief backdrop, làm ở Laptop ~3 giây', 'Đặt vào Máy in khổ lớn, chờ ~5 giây, lấy ra ngay', 'Nộp ở Quầy check-in. Bị "sang hơn chút" thì về Laptop sửa rồi in lại'] },
      stage: { title: 'Bộ sân khấu', item: 'stage_ok', time: 140, reward: 150, join: ' · ',
        steps: ['🖼️ Backdrop', '🔊 Loa', '⛺ ghép', '🎤 chị Kiều duyệt'],
        how: ['Làm Backdrop in và Loa đã test', 'Ghép ở Bàn ghép trong Lều Plan B (khô ráo)', 'Mang vào Bàn chị Kiều. Bị hỏi "có Plan B chưa?" thì về Laptop viết rồi đưa lại', 'Nộp ở Quầy check-in'] },
    },
    tips: [
      '🌧️ Mưa tới theo đợt: đồ để ngoài sân hoặc rơi dưới đất ~5 giây là ướt sũng, cầm trên tay thì ướt chậm hơn',
      '⛺ Lều Plan B và lều nước khô ráo: ghép đồ trong lều',
      '🐢 Đi ngoài mưa chậm hơn: chờ tạnh hoặc chạy nhanh qua',
      '✏️ Khách đổi ý: món bị trả lại vào tay, mang về Laptop sửa',
      '💧 Burnout gần đầy: uống chai nước suối trong lều nước',
    ],
    orderPool: [
      { recipe: 'qua', w: 2 },
      { recipe: 'lich', w: 2.5 },
      { recipe: 'loa', w: 2.5, after: 10 },
      { recipe: 'backdrop', w: 2, after: 18 },
      { recipe: 'stage', w: 2, after: 40 },
    ],
    pace: [
      { gap: 34, time: 1.4, max: 2, first: [2, 16] },
      { gap: 24, time: 1.15, max: 3, first: [2, 10] },
      { gap: 18, time: 1, max: 4, first: [2, 8] },
      { gap: 14, time: 0.9, max: 4, first: [2, 6] },
    ],
    stars: [200, 450, 700],
  },
  audit: {
    id: 'audit',
    client: 'Cân Đối & Cộng Sự',
    emoji: '🧮',
    title: 'Kiểm kê kho lúc 2 giờ sáng',
    blurb: 'Busy season. Đèn cảm ứng cứ tắt, phải chạy ra công tắc bật lại. Partner hiếm khi có mặt để ký. Nợ phải bằng Có.',
    bossName: 'Anh Phong',
    bossLine: 'Số này hơi "sáng tạo" đó em.',
    notesChance: 0.3,
    quotes: [
      'Chị Thảo: "Review note: 47 cái. Mai 8 giờ nộp lại nhé."',
      'Anh Khoa: "Chưa thấy nắng từ tháng Một. Giờ thấy luôn bình minh."',
      'Anh Phong: "Ổn. Tick đủ chưa em? Tick đủ thì anh ký."',
      'Anh Quang (CFO): "Không có ngoại trừ! Năm sau mời SOS tiếp." Chị Thảo: "Đi ngủ thôi cả nhà."',
    ],
    duration: 180,
    room: { w: 18, d: 12 },
    wall: '#b8f0d8',
    //  z=-6 ┌──── KHU AUDIT (2 giờ sáng) ──────────────────────────────┬──── PHÒNG PARTNER ────┐
    //       │ Tủ chứng từ  Sổ Nợ  Sổ Có  Laptop Laptop Laptop  Máy photo │      Bàn anh Phong    │
    //       │      Bàn tick   Bàn tick        (Anh Khoa, Vy)            │                       │
    //  z=-1 ├────[cửa]───────────────────[cửa]──────────────────────────┴────[cửa]──────────────┤
    //       │ Rác     Ghép  Ghép  Ghép      hành lang                           Công tắc đèn 💡 │
    //  z=2  ├──[cửa]──────────┬────[cửa]──────────┬──────────[QUẦY]──────────────────────────────┤
    //       │ KHO KHÁCH (tối) │ PANTRY 2h sáng     │ PHÒNG KHÁCH HÀNG                ← cửa vào   │
    //       │ kệ hàng, phiếu  │                    │                                             │
    //  z=6  └─────────────────┴────────────────────┴────────────────────────────────────────────┘
    rooms: [
      { name: 'KHU AUDIT', icon: '🧮', x0: -9, x1: 4, z0: -6, z1: -1, floor: '#eef6f2', sign: [-6.6, -1], color: '#b8f0d8' },
      { name: 'PHÒNG PARTNER', icon: '🏛️', x0: 4, x1: 9, z0: -6, z1: -1, floor: '#eef0f6', sign: [6.4, -1], color: '#bfe3ff' },
      { name: '', x0: -9, x1: 9, z0: -1, z1: 2, floor: '#f6f6f2' },
      { name: 'KHO KHÁCH', icon: '📦', x0: -9, x1: -2.6, z0: 2, z1: 6, floor: '#e9e3d8', sign: [-6.6, 2], color: '#ffe3c2' },
      { name: 'PANTRY 2H SÁNG', icon: '☕', x0: -2.6, x1: 2.6, z0: 2, z1: 6, floor: '#fff3c4', sign: [-0.5, 2], color: '#ffe9a0' },
      { name: 'PHÒNG KHÁCH HÀNG', icon: '🤝', x0: 2.6, x1: 9, z0: 2, z1: 6, floor: '#f6efe3', sign: [3.8, 2], color: '#ffd3b8' },
    ],
    walls: [
      { x0: -9, z0: -1, x1: -7.4, z1: -1 }, { x0: -5.8, z0: -1, x1: -1.6, z1: -1 }, { x0: 0, z0: -1, x1: 4, z1: -1 },
      { x0: 4, z0: -1, x1: 5.6, z1: -1, kind: 'glass' }, { x0: 7.2, z0: -1, x1: 9, z1: -1, kind: 'glass' },
      { x0: 4, z0: -6, x1: 4, z1: -1, kind: 'glass' },
      { x0: -9, z0: 2, x1: -7.4, z1: 2 }, { x0: -5.8, z0: 2, x1: -2.6, z1: 2 },
      { x0: -2.6, z0: 2, x1: -1.4, z1: 2 }, { x0: 0.4, z0: 2, x1: 2.6, z1: 2 },
      { x0: 2.6, z0: 2, x1: 5.25, z1: 2 }, { x0: 7.15, z0: 2, x1: 9, z1: 2 },
      { x0: -2.6, z0: 2, x1: -2.6, z1: 6 }, { x0: 2.6, z0: 2, x1: 2.6, z1: 6 },
    ],
    floorDoorMats: [[-6.6, -1], [-0.8, -1], [6.4, -1], [-6.6, 2], [-0.5, 2], [9, 4.4, 'v']],
    decor: [
      // auditors at their desks, review notes everywhere
      { kind: 'desk', x: 2.0, z: -2.5, npc: AU.khoa }, { kind: 'person', x: 3.4, z: -3.8, npc: AU.vy, face: -0.8 },
      { kind: 'crates', x: -8.3, z: -2.5, text: 'HỘP HỒ SƠ · 2019–2026', icon: '🗃️' }, { kind: 'window', x: -5, z: -6 },
      // partner's glass office
      { kind: 'shelf', x: 8.4, z: -4.2 }, { kind: 'plant', x: 4.6, z: -5.4 },
      // corridor: Chị Thảo with the review notes
      { kind: 'person', x: 4.6, z: 0.4, npc: AU.thao, face: -0.4 },
      // the client's warehouse: rows of shelves
      { kind: 'shelfgoods', x: -6.3, z: 4.9 }, { kind: 'shelfgoods', x: -5.2, z: 3.3 }, { kind: 'person', x: -3.3, z: 5.5, npc: AU.tuan, face: 2.6 },
      // pantry: instant coffee at 2 a.m.
      { kind: 'fridge', x: 2.0, z: 5.3 }, { kind: 'cafetable', x: 1.0, z: 3.7, cat: true },
      // client room
      { kind: 'sofa', x: 5.6, z: 5.4 },
    ],

    spawns: [{ x: -4.2, z: 0.0 }, { x: 1.6, z: 0.0 }, { x: -4.2, z: 1.3 }, { x: 1.6, z: 1.3 }],
    stations: [
      { id: 'ctu', kind: 'source', gives: 'chung_tu', label: 'Tủ chứng từ', x: -8.2, z: -5.2 },
      { id: 'sono', kind: 'source', gives: 'so_no_raw', label: 'Sổ cái Nợ', x: -6.8, z: -5.2 },
      { id: 'soco', kind: 'source', gives: 'so_co_raw', label: 'Sổ cái Có', x: -5.4, z: -5.2 },
      { id: 'lap1', kind: 'laptop', label: 'Laptop', x: -3.6, z: -5.2 },
      { id: 'lap2', kind: 'laptop', label: 'Laptop', x: -2.2, z: -5.2 },
      { id: 'lap3', kind: 'laptop', label: 'Laptop', x: -0.8, z: -5.2 },
      { id: 'photo', kind: 'photocopy', label: 'Máy photo', x: 1.2, z: -5.2 },
      { id: 'tick1', kind: 'tick', label: 'Bàn tick · chị Diệp', x: -6.4, z: -2.6, who: AU.diep },
      { id: 'tick2', kind: 'tick', label: 'Bàn tick', x: -4.8, z: -2.6 },
      { id: 'boss', kind: 'boss', label: 'Bàn Partner', x: 6.4, z: -4.2 },
      { id: 'c1', kind: 'counter', label: 'Bàn ghép', x: -3.4, z: 0.5 },
      { id: 'c2', kind: 'counter', label: 'Bàn ghép', x: -2.0, z: 0.5 },
      { id: 'c3', kind: 'counter', label: 'Bàn ghép', x: -0.6, z: 0.5 },
      { id: 'trash', kind: 'trash', label: 'Thùng rác', x: -8.4, z: 0.5 },
      { id: 'light', kind: 'lightswitch', label: 'Công tắc đèn', x: 8.4, z: 0.6 },
      { id: 'phieu', kind: 'source', gives: 'phieu_kk', label: 'Phiếu kiểm kê', x: -8.3, z: 5.2 },
      { id: 'count', kind: 'count', label: 'Bàn đếm hàng', x: -4.2, z: 5.0 },
      { id: 'coffee', kind: 'coffee', label: 'Cà phê 2h sáng', drink: 'Pha gói cà phê 3in1 ☕', x: -1.0, z: 5.3 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy khách hàng', x: 6.2, z: 2, faces: 'up' },
    ],
    boss: AU.phong,

    clients: [AU.quang, AU.ketoan, AU.thukho, AU.thue, AU.bank, AU.ceo, AU.nhadautu, AU.sang],
    clientSpots: [{ x: 3.8, z: 3.1 }, { x: 5.1, z: 3.05 }, { x: 6.5, z: 3.05 }, { x: 7.8, z: 3.1 }],
    clientDoor: [{ x: 10, z: 4.4 }, { x: 8.4, z: 4.4 }],
    clientLines: {
      wait: ['Bao giờ có số em?', 'Mai họp HĐQT rồi', 'Ngân hàng hỏi kìa', 'Tick xong chưa em?', 'Nợ có bằng Có chưa?'],
      happy: ['Không ngoại trừ!', 'Số đẹp quá', 'Cảm ơn team', 'Nợ = Có!'],
      angry: ['Trễ hạn nộp rồi', 'Thuế phạt đó em', 'Thôi đổi kiểm toán', 'Số lệch kìa'],
    },

    // signature events of this level
    dark: { at: [38, 98, 148], warn: 3, length: 18, radius: 3.4, warnText: 'Đèn cảm ứng sắp tắt…', text: 'Tắt đèn! Ra công tắc (cuối hành lang)' },
    powerCut: {
      at: [64, 128], warn: 3, stations: ['boss'], icon: '✈️', autoEnd: 14,
      warnText: 'Anh Phong sắp đi gặp khách…', text: 'Partner đi vắng, chờ anh ấy về ký',
      offSign: 'Partner đi vắng', offHint: 'đi vắng, chờ chút… ✈️', backLine: 'Partner về rồi',
    },

    process: {
      work: {
        tick: { chung_tu: { to: 'chung_tu_tick', time: 2.5 } },
        laptop: { so_no_raw: { to: 'so_no', time: 3 }, so_co_raw: { to: 'so_co', time: 3 }, bctc_note: { to: 'bctc_draft', time: 2 } },
        count: { phieu_kk: { to: 'kiem_ke', time: 4 } },
      },
      auto: {
        photocopy: { chung_tu: { to: 'photo', time: 3 } },
        boss: { bctc_draft: { to: 'bctc_ok', time: 3, notes: 'bctc_note', fixAt: 'Laptop' } },
      },
      combos: [[['so_no', 'so_co'], 'can_doi'], [['can_doi', 'kiem_ke'], 'bctc_draft']],
    },
    recipes: {
      photo: { title: 'Chứng từ photo', item: 'photo', time: 45, reward: 20, steps: ['🧾 Chứng từ', '📠 Photo', '🛎️ Quầy'],
        how: ['Lấy Chứng từ ở Tủ chứng từ', 'Đặt vào Máy photo, chờ ~3 giây', 'Nộp ở Quầy khách hàng'] },
      tick: { title: 'Chứng từ đã tick', item: 'chung_tu_tick', time: 55, reward: 35, steps: ['🧾 Chứng từ', '✔️ Bàn tick', '🛎️ Quầy'],
        how: ['Lấy Chứng từ', 'Đặt lên Bàn tick, đứng tick ~2,5 giây', 'Nộp ở Quầy khách hàng'] },
      candoi: { title: 'Bảng cân đối', item: 'can_doi', time: 90, reward: 75, join: ' · ',
        steps: ['📕 Nợ → 💻', '📗 Có → 💻', '⚖️ ghép'],
        how: ['Lấy Sổ cái Nợ, làm ở Laptop ~3 giây thành Bảng Nợ', 'Lấy Sổ cái Có, làm ở Laptop thành Bảng Có', 'Đặt một bảng lên Bàn ghép, cầm bảng kia tới ghép: Nợ = Có', 'Nộp ở Quầy khách hàng'] },
      kiemke: { title: 'Biên bản kiểm kê kho', item: 'kiem_ke', time: 80, reward: 70, steps: ['📋 Phiếu (kho)', '🔢 Đếm hàng', '🛎️ Quầy'],
        how: ['Vào Kho khách (góc dưới bên trái), lấy Phiếu kiểm kê', 'Đặt lên Bàn đếm hàng, đứng đếm ~4 giây', 'Nộp ở Quầy khách hàng'] },
      bctc: { title: 'Báo cáo kiểm toán', item: 'bctc_ok', time: 150, reward: 160, join: ' · ',
        steps: ['⚖️ Cân đối', '📦 Kiểm kê', '🗂️ ghép', '🏛️ Partner ký'],
        how: ['Làm Bảng cân đối và Biên bản kiểm kê kho', 'Ghép ở Bàn ghép thành Báo cáo nháp', 'Mang vào Bàn Partner ký (Partner đi vắng thì chờ). Bị chê "số sáng tạo" thì về Laptop sửa', 'Nộp ở Quầy khách hàng'] },
    },
    tips: [
      '🌑 Đèn cảm ứng tắt: chỉ thấy quanh mình, chạy ra Công tắc đèn cuối hành lang bật lại',
      '✈️ Partner đi vắng một lúc: làm việc khác rồi quay lại ký',
      '⚖️ Bảng cân đối = Bảng Nợ + Bảng Có ghép lại',
      '☕ Burnout gần đầy: pha cà phê 3in1 trong pantry',
    ],
    orderPool: [
      { recipe: 'photo', w: 2 },
      { recipe: 'tick', w: 2.5 },
      { recipe: 'kiemke', w: 2, after: 12 },
      { recipe: 'candoi', w: 2.5, after: 18 },
      { recipe: 'bctc', w: 2, after: 45 },
    ],
    pace: [
      { gap: 34, time: 1.4, max: 2, first: [2, 16] },
      { gap: 24, time: 1.15, max: 3, first: [2, 10] },
      { gap: 18, time: 1, max: 4, first: [2, 8] },
      { gap: 14, time: 0.9, max: 4, first: [2, 6] },
    ],
    stars: [200, 450, 700],
  },
  tech: {
    id: 'tech',
    client: 'Nợ Kỹ Thuật Labs',
    emoji: '💻',
    title: 'Deploy chiều thứ Sáu',
    blurb: 'Startup "flat, fast, fun". Ticket → code → review → deploy. Deploy code chưa review là cháy server; lửa lan nếu không ai cầm 🧯 rollback.',
    offHint: 'chưa chạy được: server đang cháy! Dập lửa trước 🧯',
    bossName: 'Chị Nguyệt',
    bossLine: 'Có bug nè: lệch 2px…',
    notesChance: 0.3,
    quotes: [
      'Anh Thạc: "Prod sập ba lần. Thứ Hai họp postmortem 4 tiếng."',
      'Anh Khải: "It depends. Mà chắc là… không ổn."',
      'Chị Nguyệt: "Không có bug nghiêm trọng. Chỉ lệch 2px thôi."',
      'Kevin: "Ship nhanh, không cháy! Vòng gọi vốn này chắc kèo." Anh Lộc: "Cho em ngủ cuối tuần nha."',
    ],
    duration: 180,
    room: { w: 18, d: 12 },
    wall: '#bfe3ff',
    //  z=-6 ┌──── OPEN SPACE ("flat, fast, fun") ──────────────┬──── SERVER ROOM (kính) ────┐
    //       │ Jira  Deck gọi vốn  Laptop Laptop Laptop  Review   │ Rack  Rack  Rack           │
    //       │                                                   │ Deploy           🧯Rollback │
    //       │  ghế lười   [bàn bóng bàn]   [bảng Daily]         ├──────[cửa]────────────────┤ z=-1.5
    //       │ Rác                       Bàn   Bàn              │  hành lang                 │
    //  z=1.5├──── kính ────┬────[cửa]──────────┬─────────[QUẦY HỖ TRỢ]──────────────────────┤
    //       │ PHÒNG KEVIN  │ PANTRY tăng lực   │ KHU KHÁCH (nhà đầu tư, user, đối tác)  ← cửa │
    //  z=6  └──────────────┴───────────────────┴────────────────────────────────────────────┘
    rooms: [
      { name: 'OPEN SPACE', icon: '💻', x0: -9, x1: 3.5, z0: -6, z1: 1.5, floor: '#eef5ff', sign: [-8.4, -0.6], color: '#bfe3ff' },
      { name: 'SERVER ROOM', icon: '🗄️', x0: 3.5, x1: 9, z0: -6, z1: -1.5, floor: '#e4e8f0', sign: [7.0, -1.5], color: '#c4c8d4' },
      { name: '', x0: 3.5, x1: 9, z0: -1.5, z1: 1.5, floor: '#f6f6f2' },
      { name: 'PHÒNG KEVIN · THINK BIG', icon: '🚀', x0: -9, x1: -3.5, z0: 1.5, z1: 6, floor: '#fff3c4', sign: [-6.2, 1.5], color: '#ffd166' },
      { name: 'PANTRY', icon: '⚡', x0: -3.5, x1: 2.5, z0: 1.5, z1: 6, floor: '#e3f7ee', sign: [-1.0, 1.5], color: '#b8f0d8' },
      { name: 'KHU KHÁCH', icon: '🤝', x0: 2.5, x1: 9, z0: 1.5, z1: 6, floor: '#f6efe3', sign: [3.6, 1.5], color: '#ffd3b8' },
    ],
    walls: [
      // server room: glass, door from the hall (x 6.2…7.8)
      { x0: 3.5, z0: -6, x1: 3.5, z1: -1.5, kind: 'glass' }, { x0: 3.5, z0: -1.5, x1: 6.2, z1: -1.5, kind: 'glass' }, { x0: 7.8, z0: -1.5, x1: 9, z1: -1.5, kind: 'glass' },
      // Kevin's glass room (no door: he comes out only for photos); pantry door x −1.8…−0.2; support counter
      { x0: -9, z0: 1.5, x1: -3.5, z1: 1.5, kind: 'glass' }, { x0: -3.5, z0: 1.5, x1: -1.8, z1: 1.5 }, { x0: -0.2, z0: 1.5, x1: 2.5, z1: 1.5 },
      { x0: 2.5, z0: 1.5, x1: 5.25, z1: 1.5 }, { x0: 7.15, z0: 1.5, x1: 9, z1: 1.5 },
      { x0: -3.5, z0: 1.5, x1: -3.5, z1: 6, kind: 'glass' }, { x0: 2.5, z0: 1.5, x1: 2.5, z1: 6 },
    ],
    floorDoorMats: [[7.0, -1.5], [-1.0, 1.5], [9, 4.4, 'v']],
    decor: [
      // open space: bean bags, ping-pong, devs
      { kind: 'beanbag', x: -7.8, z: -2.4, color: '#ff9fb2' }, { kind: 'beanbag', x: -6.9, z: -1.6, color: '#9fd3ff' }, { kind: 'beanbag', x: -7.9, z: -0.8, color: '#ffe08a' },
      { kind: 'pingpong', x: -3.6, z: -2.2 }, { kind: 'person', x: -2.0, z: -2.2, npc: TE.tung, face: -Math.PI / 2 },
      { kind: 'person', x: 1.0, z: -3.0, npc: TE.vy, face: 0.4 }, { kind: 'window', x: -5, z: -6 }, { kind: 'plant', x: 3.0, z: 0.9 },
      // server room
      { kind: 'person', x: 8.4, z: -5.4, npc: TE.thac, face: -0.6 },
      // Kevin's room
      { kind: 'tv', x: -8.7, z: 3.8, text: ['THINK BIG', 'runway: 3 tháng'] }, { kind: 'person', x: -6.2, z: 4.0, npc: TE.kevin, face: 0.3 }, { kind: 'sofa', x: -5.8, z: 5.5 },
      // pantry
      { kind: 'fridge', x: 1.9, z: 5.3 }, { kind: 'cafetable', x: 0.4, z: 3.8, cat: true }, { kind: 'person', x: -2.8, z: 5.3, npc: TE.chau, face: 0.8 },
      // clients
      { kind: 'plant', x: 3.0, z: 5.5 },
    ],

    spawns: [{ x: -1.0, z: 0.2 }, { x: 2.0, z: 0.2 }, { x: -1.0, z: 1.0 }, { x: 4.6, z: 0.2 }],
    stations: [
      { id: 'jira', kind: 'source', gives: 'ticket', label: 'Jira', x: -8.2, z: -5.2 },
      { id: 'deck', kind: 'source', gives: 'deck_von', label: 'Deck gọi vốn (Kevin)', x: -6.8, z: -5.2 },
      { id: 'lap1', kind: 'laptop', label: 'Laptop · anh Khải', x: -5.0, z: -5.2, who: TE.khai },
      { id: 'lap2', kind: 'laptop', label: 'Laptop', x: -3.6, z: -5.2 },
      { id: 'lap3', kind: 'laptop', label: 'Laptop', x: -2.2, z: -5.2 },
      { id: 'review', kind: 'review', label: 'Review · chị Nguyệt', x: 1.6, z: -5.2, who: TE.nguyet },
      { id: 'rack1', kind: 'rack', label: 'Server 1', x: 4.6, z: -5.2 },
      { id: 'rack2', kind: 'rack', label: 'Server 2', x: 6.0, z: -5.2 },
      { id: 'rack3', kind: 'rack', label: 'Server 3', x: 7.4, z: -5.2 },
      { id: 'deploy', kind: 'deploy', label: 'Deploy · anh Lộc', x: 5.2, z: -2.9, who: TE.loc },
      { id: 'rollback', kind: 'source', gives: 'rollback', label: 'Bình rollback 🧯', x: 8.4, z: -2.9 },
      { id: 'c1', kind: 'counter', label: 'Bàn', x: 0.0, z: 0.3 },
      { id: 'c2', kind: 'counter', label: 'Bàn', x: 1.4, z: 0.3 },
      { id: 'trash', kind: 'trash', label: 'Thùng rác', x: -8.4, z: 0.8 },
      { id: 'coffee', kind: 'coffee', label: 'Tăng lực free', drink: 'Uống lon tăng lực ⚡', x: -1.0, z: 5.3 },
      { id: 'deliver', kind: 'deliver', label: 'Quầy hỗ trợ', x: 6.2, z: 1.5, faces: 'up' },
    ],
    boss: TE.kevin,

    clients: [TE.victor, TE.tanaka, TE.user1, TE.po, TE.shark, TE.bacnam, TE.api, TE.bank],
    clientSpots: [{ x: 3.8, z: 2.6 }, { x: 5.1, z: 2.55 }, { x: 6.5, z: 2.55 }, { x: 7.8, z: 2.6 }],
    clientDoor: [{ x: 10, z: 4.4 }, { x: 8.4, z: 4.4 }],
    clientLines: {
      wait: ['App crash rồi em', 'Khi nào có bản mới?', 'Có AI chưa em?', 'Deadline là thứ Sáu', 'Bấm đâu vậy con?'],
      happy: ['Mượt quá!', '5 sao nha', 'Rót vốn thôi', 'Sugoi!'],
      angry: ['Gỡ app!', 'Trễ sprint rồi', 'Thôi khỏi rót vốn', '1 sao!'],
    },

    // signature events of this level
    fire: {
      racks: ['rack1', 'rack2', 'rack3'], at: [46, 108, 152], warn: 3, spread: 9, penalty: 10, blocks: ['deploy'],
      warnText: 'Server nóng quá…', text: 'Server cháy! Lấy 🧯 Rollback dập',
    },
    standup: {
      board: { x: 0.6, z: -1.6 }, radius: 1.6, at: [56, 126], warn: 5, length: 7,
      coach: TE.diep,
      boardText: ['DAILY 9:30', '15 PHÚT (*)', '(*) không bao gồm thảo luận'],
      warnText: 'Chị Diệp: "Daily nhanh nha!" Tránh xa bảng Daily',
      line: '',
    },

    process: {
      work: {
        laptop: { ticket: { to: 'spec', time: 2.5 }, spec: { to: 'code', time: 3.5 }, code_bug: { to: 'code', time: 2 }, deck_von: { to: 'pitch', time: 2.5 } },
      },
      auto: {
        review: { code: { to: 'code_ok', time: 4, notes: 'code_bug', fixAt: 'Laptop' } },
        deploy: { code_ok: { to: 'release', time: 4 }, code: { to: 'incident', time: 2, ignite: true } },
      },
      combos: [],
    },
    recipes: {
      pitch: { title: 'Slide gọi vốn "có AI"', item: 'pitch', time: 50, reward: 30, steps: ['📊 Deck', '💻 Laptop', '🛎️ Quầy'],
        how: ['Lấy Deck gọi vốn của Kevin', 'Làm ở Laptop ~2,5 giây (thêm chữ AI vào mọi slide)', 'Nộp ở Quầy hỗ trợ'] },
      spec: { title: 'Ticket đã làm rõ', item: 'spec', time: 55, reward: 30, steps: ['🎫 Jira', '💻 Laptop', '🛎️ Quầy'],
        how: ['Lấy Ticket ở Jira', 'Làm rõ ở Laptop ~2,5 giây', 'Nộp ở Quầy hỗ trợ'] },
      code: { title: 'Bản build thử', item: 'code', time: 75, reward: 45, steps: ['🎫 Jira', '💻 ×2 (spec → code)', '🛎️ Quầy'],
        how: ['Ticket → Laptop làm rõ, lấy ra', 'Đặt lại lên Laptop, đứng code ~3,5 giây', 'Nộp Code chưa review ở Quầy hỗ trợ (đừng mang đi deploy!)'] },
      review: { title: 'Code đã review', item: 'code_ok', time: 95, reward: 70, steps: ['💻 Code', '🔍 Review (tự chạy)', '🛎️ Quầy'],
        how: ['Làm Code (Ticket → Laptop → Laptop)', 'Đặt lên Bàn review của chị Nguyệt, chờ ~4 giây', 'Bị "lệch 2px" thì về Laptop sửa rồi review lại', 'Nộp Code đã review'] },
      release: { title: 'Deploy chiều thứ Sáu', item: 'release', time: 130, reward: 120, steps: ['✅ Code đã review', '🚀 Deploy', '🛎️ Quầy'],
        how: ['Làm Code đã review', 'Vào Server room, đặt lên Deploy, chờ ~4 giây', 'Server đang cháy thì không deploy được: dập lửa trước', 'Deploy code CHƯA review là cháy server!', 'Nộp Bản phát hành ở Quầy hỗ trợ'] },
    },
    tips: [
      '🔥 Server cháy: lấy Bình rollback 🧯 (góc server room) rồi bấm vào tủ đang cháy',
      '🧯 Mỗi bình dập được một tủ. Để lâu lửa lan sang tủ khác và bị trừ tiền',
      '🚫 Đang cháy thì không deploy được. Deploy code chưa review là tự châm lửa',
      '📋 Chị Diệp gọi Daily: tránh xa bảng Daily giữa open space',
      '⚡ Burnout gần đầy: uống lon tăng lực free trong pantry',
    ],
    orderPool: [
      { recipe: 'pitch', w: 1.5 },
      { recipe: 'spec', w: 2.5 },
      { recipe: 'code', w: 2, after: 10 },
      { recipe: 'review', w: 2.5, after: 18 },
      { recipe: 'release', w: 2, after: 35 },
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

// Client companies announced in the picker but not playable yet ("to be developed").
export const COMING_SOON = [
];
