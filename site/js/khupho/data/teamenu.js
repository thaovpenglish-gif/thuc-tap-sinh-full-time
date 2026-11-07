// Khu phố T&M · Trà Sữa Full Topping: ingredients, stations and the phase-1 menu (design 4.2.c, 4.2.f).
// Pure data. Money in VND integers. Recipe grams are for one size-M cup at 100% sugar / 100% ice; size L
// multiplies the liquid parts (tea, milk, sugar, ice) by SIZES.L.mul. Numbers marked [số thiết kế] in DESIGN.md
// are design values, the rest come from docs/research/khupho/shops.md.

/** Ingredients. price = VND per kg (or per unit when unit is 'bo' / 'cai'); shelfDays = usable days after delivery
 *  (null = long-lasting); pack = how much one purchase unit holds (grams or units); par = what chị Nhung keeps on hand. */
export const INGREDIENTS = {
  botbeo:      { name: 'Bột béo', unit: 'g', price: 74_000, shelfDays: 90, pack: 1000, packName: 'bao 1 kg', par: 12_000, emoji: '🥛' },
  tra_den:     { name: 'Trà đen', unit: 'g', price: 150_000, shelfDays: null, pack: 1000, packName: 'gói 1 kg', par: 4_000, emoji: '🍂' },
  tra_olong:   { name: 'Trà ô long', unit: 'g', price: 250_000, shelfDays: null, pack: 500, packName: 'gói 500 g', par: 2_000, emoji: '🍃' },
  tra_lai:     { name: 'Trà lài', unit: 'g', price: 180_000, shelfDays: null, pack: 500, packName: 'gói 500 g', par: 2_000, emoji: '🌼' },
  duong:       { name: 'Đường nâu / siro', unit: 'g', price: 30_000, shelfDays: null, pack: 1000, packName: 'bịch 1 kg', par: 6_000, emoji: '🍯' },
  tcden_kho:   { name: 'Trân châu đen (khô)', unit: 'g', price: 45_000, shelfDays: null, pack: 1000, packName: 'bịch 1 kg', par: 5_000, emoji: '⚫' },
  tctrang_kho: { name: 'Trân châu trắng (khô)', unit: 'g', price: 60_000, shelfDays: null, pack: 1000, packName: 'bịch 1 kg', par: 2_500, emoji: '⚪' },
  thach:       { name: 'Thạch', unit: 'g', price: 40_000, shelfDays: 7, pack: 1000, packName: 'hũ 1 kg', par: 3_000, emoji: '🟩' },
  pudding:     { name: 'Pudding', unit: 'g', price: 90_000, shelfDays: 3, pack: 1000, packName: 'hộp 1 kg', par: 2_000, emoji: '🍮' },
  kemcheese:   { name: 'Kem cheese', unit: 'g', price: 140_000, shelfDays: 3, pack: 1000, packName: 'hộp 1 kg', par: 2_000, emoji: '🧀' },
  xoai_say:    { name: 'Xoài sấy Ba & Má', unit: 'g', price: 250_000, shelfDays: 30, pack: 500, packName: 'túi 500 g', par: 1_500, emoji: '🥭' },
  sua_tuoi:    { name: 'Sữa tươi', unit: 'g', price: 32_000, shelfDays: 3, pack: 1000, packName: 'hộp 1 lít', par: 8_000, emoji: '🍼' },
  da:          { name: 'Đá viên', unit: 'g', price: 3_000, shelfDays: 1, pack: 10_000, packName: 'bao 10 kg', par: 40_000, emoji: '🧊' },
  ly:          { name: 'Ly + nắp màng + ống hút', unit: 'bo', price: 1_500, shelfDays: null, pack: 50, packName: 'cây 50 bộ', par: 400, emoji: '🥤' },
  tem:         { name: 'Tem + túi', unit: 'cai', price: 150, shelfDays: null, pack: 100, packName: 'xấp 100', par: 500, emoji: '🏷️' },
};

export const SIZES = {
  M: { id: 'M', name: 'Size M', ml: 500, mul: 1 },
  L: { id: 'L', name: 'Size L', ml: 700, mul: 1.3 },
};
export const SUGAR_STEPS = [0, 30, 50, 70, 100];
export const ICE_STEPS = [0, 50, 100];

/** Tea bases brewed into the bình ủ at opening. Brewed tea keeps 8 hours. */
export const TEAS = {
  den: { name: 'Trà đen', ing: 'tra_den', g: 15, color: '#8a4b22' },
  olong: { name: 'Ô long', ing: 'tra_olong', g: 12, color: '#b07a2a' },
  lai: { name: 'Trà lài', ing: 'tra_lai', g: 15, color: '#d8b84a' },
};
/** Milk bases: "sữa nền" = bột béo pha nước nóng; sữa tươi. */
export const MILKS = {
  beo: { name: 'Sữa nền (bột béo)', short: 'Sữa nền', ing: 'botbeo', g: 60 },
  tuoi: { name: 'Sữa tươi', short: 'Sữa tươi', ing: 'sua_tuoi', g: 100 },
};
export const SUGAR = { ing: 'duong', g: 20 }; // 20 g at 100% (design 4.2.f)
export const ICE = { ing: 'da', g: 150 };     // 150 g at 100% [số thiết kế]
export const CUP = { ing: 'ly', n: 1 };
export const LABEL = { ing: 'tem', n: 1 };

/** Pearls are cooked in batches (pearl kind → dry ingredient). 25 g dry → 50 g cooked. */
export const PEARLS = {
  den: { name: 'Trân châu đen', dry: 'tcden_kho', ratio: 2, batch: 1500, cookMin: 30 },
  trang: { name: 'Trân châu trắng', dry: 'tctrang_kho', ratio: 2, batch: 1000, cookMin: 30 },
};
export const PEARL_FRESH_MIN = 4 * 60; // ngon nhất 4 giờ đầu
export const PEARL_HARD_MIN = 8 * 60;  // quá 8 giờ thì "cứng"

/** Topping jars (one scoop each). pearl = taken from a cooked batch; ing = taken from stock. */
export const TOPPINGS = {
  tc_den: { name: 'Trân châu đen', short: 'TC đen', emoji: '⚫', pearl: 'den', g: 50 },
  tc_trang: { name: 'Trân châu trắng', short: 'TC trắng', emoji: '⚪', pearl: 'trang', g: 50 },
  tcdd: { name: 'Trân châu đường đen', short: 'TC đường đen', emoji: '🟤', pearl: 'den', g: 50, extra: { duong: 10 } },
  thach: { name: 'Thạch', short: 'Thạch', emoji: '🟩', ing: 'thach', g: 30 },
  pudding: { name: 'Pudding', short: 'Pudding', emoji: '🍮', ing: 'pudding', g: 30 },
  kemcheese: { name: 'Kem cheese', short: 'Kem cheese', emoji: '🧀', ing: 'kemcheese', g: 25 },
  xoai: { name: 'Xoài sấy Ba & Má', short: 'Xoài sấy', emoji: '🥭', ing: 'xoai_say', g: 15 },
};
export const TOPPING_ORDER = ['tc_den', 'tc_trang', 'tcdd', 'thach', 'pudding', 'kemcheese', 'xoai'];
export const EXTRA_TOPPINGS = ['tc_den', 'tc_trang', 'thach', 'pudding']; // khách gọi thêm, +5.000đ mỗi muỗng
export const EXTRA_TOPPING_PRICE = 5_000;

/** Phase-1 menu: 8 items (design 4.2.c). basic = one of the 4 drinks an apprentice may get. */
export const MENU = {
  truyenthong: { name: 'Trà sữa truyền thống', short: 'TS truyền thống', emoji: '🧋', tea: 'den', milk: 'beo', toppings: ['tc_den'], price: { M: 25_000, L: 30_000 }, basic: true },
  olong: { name: 'Trà sữa ô long', short: 'TS ô long', emoji: '🍵', tea: 'olong', milk: 'beo', toppings: ['tc_trang'], price: { M: 30_000, L: 35_000 }, basic: true },
  duongden: { name: 'Trà sữa đường đen', short: 'TS đường đen', emoji: '🟤', tea: 'den', milk: 'tuoi', toppings: ['tcdd'], price: { M: 32_000, L: 37_000 } },
  laicheese: { name: 'Trà lài kem cheese', short: 'Lài kem cheese', emoji: '🧀', tea: 'lai', milk: null, toppings: ['kemcheese'], price: { M: 30_000, L: 35_000 } },
  xoai: { name: 'Trà xoài Sa Đéc', short: 'Trà xoài', emoji: '🥭', tea: 'lai', milk: null, toppings: ['xoai'], price: { M: 30_000, L: 35_000 } },
  dao: { name: 'Trà đào thạch', short: 'Trà đào thạch', emoji: '🍑', tea: 'den', milk: null, toppings: ['thach'], price: { M: 28_000, L: 33_000 }, basic: true },
  suatuoi: { name: 'Sữa tươi trân châu', short: 'Sữa tươi TC', emoji: '🍼', tea: null, milk: 'tuoi', toppings: ['tcdd'], price: { M: 30_000, L: 35_000 }, basic: true },
  fulltopping: { name: 'Full Topping (món nhà)', short: 'Full Topping', emoji: '🌈', tea: 'den', milk: 'beo', toppings: ['tc_den', 'tc_trang', 'thach', 'pudding', 'kemcheese', 'xoai'], price: { L: 45_000 }, sizes: ['L'] },
};
export const MENU_ORDER = ['truyenthong', 'olong', 'duongden', 'laicheese', 'xoai', 'dao', 'suatuoi', 'fulltopping'];

/** What each customer group tends to order (relative weights). */
export const TASTES = {
  hocsinh: { truyenthong: 4, duongden: 3, fulltopping: 2, suatuoi: 2, dao: 1, olong: 1, laicheese: 1, xoai: 1 },
  vanphong: { olong: 3, laicheese: 3, xoai: 2, truyenthong: 2, dao: 2, duongden: 1, suatuoi: 1, fulltopping: 1 },
  cudan: { truyenthong: 3, suatuoi: 2, dao: 2, olong: 2, duongden: 1, xoai: 1, laicheese: 1, fulltopping: 1 },
  khachvanglai: { truyenthong: 2, olong: 2, dao: 2, xoai: 2, laicheese: 1, duongden: 1, suatuoi: 1, fulltopping: 1 },
  app: { truyenthong: 3, duongden: 2, fulltopping: 2, olong: 2, laicheese: 1, xoai: 1, dao: 1, suatuoi: 1 },
};

/** Customer flow by time of day (design 4.2.d, [số thiết kế]): share of the day's cups, who comes, patience. */
export const SLOTS = [
  { from: 9 * 60, to: 11 * 60 + 30, share: 0.10, group: 'cudan', patience: 'cao', label: 'Cư dân, phụ huynh' },
  { from: 11 * 60 + 30, to: 13 * 60 + 30, share: 0.22, group: 'vanphong', patience: 'thap', label: 'Văn phòng cao ốc' },
  { from: 13 * 60 + 30, to: 16 * 60, share: 0.10, group: 'khachvanglai', patience: 'cao', label: 'Làm tự do, khách tiệm tóc' },
  { from: 16 * 60, to: 17 * 60 + 30, share: 0.23, group: 'hocsinh', patience: 'vua', label: 'Sóng tan trường' },
  { from: 17 * 60 + 30, to: 19 * 60, share: 0.10, group: 'vanphong', patience: 'vua', label: 'Người đi làm về' },
  { from: 19 * 60, to: 22 * 60, share: 0.25, group: 'cudan', patience: 'cao', label: 'Cư dân, hẹn hò, học nhóm' },
];
/** Patience in game minutes. */
export const PATIENCE = { cao: 50, vua: 38, thap: 30, app: 40 };

/** Funny ticket notes (rank ≥ 2). The ticket always also shows the real value. */
export const NOTES = [
  { text: 'ít ngọt nhưng ngọt', sugar: 50 },
  { text: 'không đá nhưng lạnh', ice: 0 },
  { text: 'ngọt như người yêu cũ', sugar: 100 },
  { text: 'đá vừa đủ để sống ảo', ice: 50 },
  { text: 'ít đường, em đang giảm cân (chỉ uống size L)', sugar: 30, size: 'L' },
  { text: 'nhiều đá cho lâu hết', ice: 100 },
];

export const CLIENT_NAMES = {
  hocsinh: ['bé Na 9A', 'Tí lớp 8', 'Bin 7C', 'Mít 9B', 'Su lớp 6', 'Bơ 8A', 'Cún 9C', 'Gạo 7A'],
  vanphong: ['anh Minh Lô C', 'chị Thảo kế toán', 'Khang (T&M)', 'chị Vy HR', 'anh Lộc Trend Trễ', 'chị Uyên Cân Đối', 'anh Đạt tầng 7'],
  cudan: ['cô Tư hẻm 7', 'chú Hai', 'bà Phấn', 'anh Toàn', 'chị Diệu', 'ông Thanh', 'cô Nga'],
  khachvanglai: ['khách áo mưa', 'anh shipper', 'chị khách tiệm tóc', 'cậu sinh viên', 'cô bán vé số'],
  app: ['Đói Rồi #', 'Giao Liền #'],
};
