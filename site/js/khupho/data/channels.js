// Khu phố T&M · the eight marketing channels of a small shop (design 4.2.h, research marketing.md). Pure data; the
// effect model lives in sim/teashop.js runChannel(). All costs are [số thiết kế] unless the design gives a real number.
// boost: demand multiplier added on top of 1 for the listed groups ('all' = every group) while the channel runs.
// days: how long one run lasts (continuous channels have days: null and a daily cost until stopped).

export const MAX_CHANNELS = 3;

export const CHANNELS = [
  {
    id: 'toroi', name: 'Tờ rơi', icon: '📄', how: 'In ở Photo Thần Tốc (chú Tấn), phát quanh 2 hẻm',
    cost: 250_000, costText: '500đ/tờ x 500 tờ + 1 ca phát', boost: { cudan: 0.2 }, days: 3,
    effectText: '+20% khách cư dân trong 3 ngày', risk: 'Rác vỉa hè, tờ in nhầm mặt sau',
  },
  {
    id: 'xomoi', name: 'Nhóm cư dân Xóm Ơi', icon: '💬', how: 'Đăng tin, xin bà Phấn ghim',
    cost: 0, costText: 'Thời gian (và độ thân với bà Phấn)', boost: { cudan: 0.1, khachvanglai: 0.05 }, days: 2,
    effectText: '+10% khách quen, có người đặt trước', risk: 'Quán dưới 3,8 sao thì tin xấu lan nhanh hơn tin tốt',
  },
  {
    id: 'fanpage', name: 'Fanpage', icon: '📣', how: 'Thuê Sương (Trend Trễ) chạy',
    cost: 0, daily: 50_000, costText: '1.500.000đ/tháng (50.000đ/ngày)', boost: { all: 0.08 }, days: null,
    effectText: '+8% khách mới, đều đặn', risk: 'Trả lời bình luận chậm thì bị chê',
  },
  {
    id: 'luotluot', name: 'Video ngắn trên "Lướt Lướt"', icon: '🎬', how: 'Thuê Trend Trễ: anh Phát quay, anh Lộc chạy quảng cáo',
    cost: 4_000_000, costText: '3-5 triệu/clip (tính 4 triệu)', boost: { all: 0.4 }, days: 5, decay: true,
    effectText: 'Viral ngắn hạn: +40% trong 5 ngày rồi giảm dần', risk: '"CPM đang cao": có lúc chỉ được nửa hiệu ứng',
  },
  {
    id: 'koc', name: 'KOC Út Mi (Ba & Má)', icon: '🤳', how: 'Mời uống, trả phí hoặc đổi quảng cáo khô gà',
    cost: 1_000_000, costText: '1 triệu + đồ uống', boost: { hocsinh: 0.6, all: 0.25 }, days: 3, quality: true,
    effectText: 'Đỉnh lớn nhất, nhưng theo chất lượng ly thật', risk: 'Mi review thật lòng: ly dở thì clip dở',
  },
  {
    id: 'app', name: 'App giao đồ ăn (Đói Rồi, Giao Liền)', icon: '🛵', how: 'Bật bán trên app',
    cost: 0, costText: 'Chiết khấu 25%/đơn + VAT 10% trên chiết khấu, góp voucher 5.000đ', boost: { app: 1 }, days: null,
    commission: 0.25, voucher: 5_000, voucherShare: 0.375, appMarkup: 1.27,
    effectText: '+đơn ngày mưa, +khách xa', risk: 'Lời mỏng; giá app cao hơn tại quán 25-35%; bom đơn',
  },
  {
    id: 'khaitruong', name: 'Khai trương mua 1 tặng 1', icon: '🎉', how: 'Chỉ khi mở quán hoặc chi nhánh',
    cost: 0, costText: 'Lỗ 1-3 ngày', boost: { all: 0.8 }, days: 2, needsOwnShop: true,
    effectText: 'Hàng dài, ai cũng biết quán', risk: 'Quá tải, bão 1 sao vì chờ lâu; nên giới hạn 50 khách đầu',
  },
  {
    id: 'tichdiem', name: 'Thẻ tích điểm', icon: '🎟️', how: 'In thẻ ở Photo Thần Tốc, ly thứ 10 miễn phí',
    cost: 300_000, daily: 0, costText: '300.000đ in thẻ + giảm giá dài hạn (khoảng 10% doanh thu khách quen)', boost: { cudan: 0.1, vanphong: 0.06 }, days: null, discount: 0.1,
    effectText: 'Giữ khách quen', risk: 'Chưa có dữ kiện thật (số thiết kế)',
  },
];
export const CHANNEL = Object.fromEntries(CHANNELS.map((c) => [c.id, c]));
