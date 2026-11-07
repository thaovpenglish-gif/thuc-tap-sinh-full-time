// Khu phố T&M · Nội Thất Nhà Mình (anh Tín): things you buy to make room 5 at Dãy trọ Bình An feel like yours.
// Each item sits in one SLOT of the room (one item per slot shows at a time; everything bought stays yours).
// cozy: how much it adds to the room's "ấm cúng" score (mood bonus every night, see sim/home.js).
// big: delivered by Chú Bảy's ba gác (DELIVERY_FEE), otherwise you carry it home. Prices are [số thiết kế].

export const DELIVERY_FEE = 30000;

export const SLOTS = {
  rug: 'Thảm sàn', bedding: 'Ga gối', curtain: 'Rèm cửa sổ', wallart: 'Tranh, poster', lights: 'Đèn trang trí',
  plant: 'Cây xanh', shelf: 'Kệ', seat: 'Chỗ ngồi', desklamp: 'Đèn bàn', fan: 'Quạt đứng', mirror: 'Gương',
};

export const FURNITURE = [
  { id: 'rug_tron', slot: 'rug', name: 'Thảm tròn hồng', price: 120000, cozy: 2, color: '#ff9ec4', desc: 'Đường kính 1 mét. Đủ chỗ ngồi xếp bằng ăn mì.' },
  { id: 'rug_long', slot: 'rug', name: 'Thảm lông trắng', price: 280000, cozy: 4, color: '#f4f1ea', desc: 'Êm như mây, hút bụi như máy hút bụi.' },
  { id: 'rug_carô', slot: 'rug', name: 'Thảm caro xanh', price: 160000, cozy: 3, color: '#7fb3d5', desc: 'Kẻ ô vuông, hợp người thích mọi thứ thẳng hàng.' },
  { id: 'ga_hoa', slot: 'bedding', name: 'Bộ ga gối hoa nhí', price: 190000, cozy: 3, color: '#ffd6e0', desc: 'Hoa nhí nhỏ xíu, ngủ ngon to đùng.' },
  { id: 'ga_kesoc', slot: 'bedding', name: 'Bộ ga kẻ sọc xanh', price: 170000, cozy: 2, color: '#a8d8ea', desc: 'Kẻ sọc như vở ô li.' },
  { id: 'ga_meo', slot: 'bedding', name: 'Bộ ga hình mèo', price: 220000, cozy: 4, color: '#ffe08a', desc: 'Có in Mèo KPI. Bản quyền: không rõ.' },
  { id: 'rem_vang', slot: 'curtain', name: 'Rèm voan vàng', price: 150000, cozy: 2, color: '#ffe9a0', desc: 'Che bức tường nhà bên cách cửa sổ 1 mét.' },
  { id: 'rem_xanh', slot: 'curtain', name: 'Rèm cản nắng xanh lá', price: 210000, cozy: 3, color: '#8fd3a6', desc: 'Ngủ trưa được cả khi nắng 38 độ.' },
  { id: 'poster_phim', slot: 'wallart', name: 'Poster phim cũ', price: 60000, cozy: 1, color: '#c0392b', desc: 'Một bộ phim không ai trong dãy trọ từng xem.' },
  { id: 'tranh_saigon', slot: 'wallart', name: 'Tranh Sài Gòn mưa', price: 180000, cozy: 3, color: '#3d5a80', desc: 'Vẽ khu phố lúc mưa. Có cả cái loa phường.' },
  { id: 'lich_to', slot: 'wallart', name: 'Lịch Tết treo tường', price: 45000, cozy: 1, color: '#e63946', desc: 'Lịch ngân hàng, có câu chúc "Phát tài".' },
  { id: 'den_day', slot: 'lights', name: 'Đèn dây đom đóm', price: 85000, cozy: 3, color: '#fff3a0', desc: 'Bật lên là phòng 16 m² thành quán cà phê.' },
  { id: 'den_long', slot: 'lights', name: 'Đèn lồng giấy', price: 130000, cozy: 3, color: '#ff7a6b', desc: 'Treo quanh năm, tới Trung thu thì đúng mùa.' },
  { id: 'cay_luoi_ho', slot: 'plant', name: 'Chậu lưỡi hổ', price: 95000, cozy: 2, color: '#3e9b57', desc: 'Khó chết. Hợp người hay quên tưới.' },
  { id: 'cay_kim_tien', slot: 'plant', name: 'Chậu kim tiền', price: 150000, cozy: 3, color: '#2f7d3a', desc: 'Anh Tín bảo hợp mệnh. Mệnh gì cũng hợp.' },
  { id: 'cay_gia', slot: 'plant', name: 'Cây giả (không cần tưới)', price: 70000, cozy: 1, color: '#57b36b', desc: 'Xanh quanh năm, kể cả lúc bạn bỏ đi Bình Dương.' },
  { id: 'ke_sach', slot: 'shelf', name: 'Kệ sách gỗ 3 tầng', price: 350000, cozy: 3, color: '#c98f5a', big: true, desc: 'Chứa sách, đồ lưu niệm, và chồng hóa đơn.' },
  { id: 'ke_treo', slot: 'shelf', name: 'Kệ treo tường', price: 120000, cozy: 2, color: '#d9a273', desc: 'Không khoan tường, cô Ba Lành an tâm.' },
  { id: 'ghe_luoi', slot: 'seat', name: 'Ghế lười hạt xốp', price: 420000, cozy: 5, color: '#c3a6e8', big: true, desc: 'Ngồi vào là không muốn đi làm.' },
  { id: 'ghe_nhua', slot: 'seat', name: 'Ghế nhựa đỏ', price: 35000, cozy: 1, color: '#e63946', desc: 'Chuẩn quốc dân. Có thể mang ra cà phê cóc.' },
  { id: 'den_ban', slot: 'desklamp', name: 'Đèn bàn kẹp', price: 140000, cozy: 2, color: '#ffffff', desc: 'Ánh sáng vàng, hợp làm báo cáo lúc khuya.' },
  { id: 'quat_dung', slot: 'fan', name: 'Quạt đứng', price: 380000, cozy: 2, color: '#bfe3ff', big: true, desc: 'Quạt trần đã kêu như đang suy nghĩ, giờ có thêm đồng minh.' },
  { id: 'guong_dung', slot: 'mirror', name: 'Gương đứng', price: 260000, cozy: 2, color: '#e6ecf2', big: true, desc: 'Soi xong rồi hãy ra tiệm tóc chị Mận.' },
];
export const FURN = Object.fromEntries(FURNITURE.map((f) => [f.id, f]));
