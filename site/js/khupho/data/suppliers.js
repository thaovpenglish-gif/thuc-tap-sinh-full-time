// Khu phố T&M · the five suppliers of Trà Sữa Full Topping (design 4.2.g). Pure data; delivery rules are applied by
// sim/teashop.js placeOrder(). priceMul multiplies the base ingredient price in data/teamenu.js.
// minRank: from Nhân viên chính (3) chị Nhung sends you to buy (chợ, tiện lợi, Ba & Má); from Ca trưởng (4) you decide.

export const SUPPLIERS = [
  {
    id: 'cho', name: 'Chợ Tâm Mỹ', who: 'chị Huyền trái cây, cô Sáu tạp hoá', icon: '🧺',
    items: ['sua_tuoi', 'duong', 'da', 'thach'],
    priceMul: 1.12, priceText: 'Lẻ, cao hơn sỉ khoảng 10-15%',
    quality: 'Tươi, thấy tận mắt', qualityScore: 4,
    delivery: { kind: 'walk', travelMin: 25 }, etaText: 'Tự đi, mất 25 phút game, có hàng ngay',
    maxGrams: 12_000, risk: 'Mang được ít (tối đa 12 kg). Mưa thì rau trái tăng 20-25%.', rainMul: 1.2,
    minOrder: 0, minRank: 3,
  },
  {
    id: 'daumoi', name: 'Đầu mối sỉ Thuận Phát', who: 'anh Thịnh, ba gác Chú Bảy giao', icon: '📦',
    items: ['botbeo', 'tra_den', 'tra_olong', 'tra_lai', 'tcden_kho', 'tctrang_kho', 'duong', 'thach', 'pudding', 'kemcheese', 'ly', 'tem', 'da'],
    priceMul: 1.0, priceText: 'Giá sỉ (bột béo 74.000đ/kg)',
    quality: 'Ổn định', qualityScore: 4,
    delivery: { kind: 'nextMorning', cutoff: 22 * 60, at: 6 * 60 }, etaText: 'Đặt trước 22h, giao 6h sáng hôm sau',
    risk: 'Đơn tối thiểu 1.000.000đ. Thân anh Thịnh 3 tim thì gối đầu 7 ngày.',
    minOrder: 1_000_000, minRank: 4,
  },
  {
    id: 'bama', name: 'Ba & Má', who: 'cô Hằng, Chú Bảy giao', icon: '🥭',
    items: ['xoai_say'],
    priceMul: 1.10, priceText: 'Cao hơn chợ khoảng 10%',
    quality: 'Đều, có câu chuyện để quảng cáo', qualityScore: 5,
    delivery: { kind: 'afternoon', at: 14 * 60, lastCall: 16 * 60, leadMin: 90 }, etaText: 'Giao trong buổi chiều cùng ngày (đặt sau 16h thì chiều mai)',
    risk: 'Mua đều thì giữ được món "Trà xoài Sa Đéc" độc quyền.',
    minOrder: 0, minRank: 3,
  },
  {
    id: 'khosi', name: 'App sỉ "Kho Sỉ Ngay"', who: 'đặt trên điện thoại', icon: '📱',
    items: ['botbeo', 'tra_den', 'tra_olong', 'tra_lai', 'ly', 'tem'],
    priceMul: 0.95, priceText: 'Rẻ nhất (rẻ hơn đầu mối 5%)',
    quality: 'Có lúc giao sai', qualityScore: 3,
    delivery: { kind: 'days', min: 1, max: 2, at: 10 * 60, rainExtra: 1 }, etaText: '1-2 ngày, mưa thì trễ thêm',
    risk: 'Không gối đầu. Khoảng 10% đơn bị thiếu món.', missRate: 0.10,
    minOrder: 0, minRank: 4,
  },
  {
    id: 'tienloi', name: 'Tiện lợi Luôn Mở', who: 'anh Khôi', icon: '🏪',
    items: ['sua_tuoi', 'da', 'ly', 'duong'],
    priceMul: 1.30, priceText: 'Đắt (thêm 30%)',
    quality: 'Ổn', qualityScore: 3,
    delivery: { kind: 'now' }, etaText: 'Có ngay, 24/24',
    risk: 'Cứu cháy khi hết hàng giữa ca.',
    minOrder: 0, minRank: 3,
  },
];
export const SUPPLIER = Object.fromEntries(SUPPLIERS.map((s) => [s.id, s]));
