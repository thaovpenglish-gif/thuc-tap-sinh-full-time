// Khu phố T&M · what you can eat and what it costs (DESIGN.md 3.3). Prices in VND at game start (11/2026).
// driver: the economy price index that slowly pushes this dish's price (see economy.js priceOf).
// pass: how much of a cost rise the owner passes on (0 = Cô Bánh Mì: keeps the price, trims the pa tê).
// food/energy/mood: need changes; min: game minutes it takes. place: where it is sold.
export const FOODS = [
  { id: 'banhmi', name: 'Bánh mì thịt', place: 'banhmi', price: 25000, priceMax: 30000, driver: 'pork', pass: 0.3, food: 30, energy: 0, mood: 0, min: 5,
    line: 'Cô Bánh Mì gói kèm một câu hỏi thăm.' },
  { id: 'comtam', name: 'Cơm tấm sườn chả', place: 'comtam', price: 35000, driver: 'pork', pass: 0.9, food: 55, energy: 0, mood: 2, min: 20,
    line: 'Sườn nướng than, nước mắm "bí mật" đựng trong can không nhãn.' },
  { id: 'comtam_trung', name: 'Cơm tấm sườn chả trứng', place: 'comtam', price: 45000, driver: 'pork', pass: 0.9, food: 62, energy: 0, mood: 4, min: 20,
    line: 'Thêm trứng ốp la cho ngày cần được vỗ về.' },
  { id: 'caphe', name: 'Cà phê sữa', place: 'caphe', price: 15000, driver: 'coffee', pass: 0.5, food: 5, energy: 15, mood: 1, min: 10, coffee: true,
    line: 'Bà Cẩm pha đậm, kèm nhận xét về quán trà sữa đối diện.' },
  { id: 'trasua', name: 'Trà sữa trân châu', place: 'trasua', price: 30000, priceMin: 25000, priceMax: 35000, driver: 'creamer', pass: 0.6, food: 15, energy: 0, mood: 5, min: 5,
    line: 'Full topping, nửa đường, một trăm phần trăm vui.' },
  { id: 'mily', name: 'Mì ly + nước suối', place: 'tienloi', price: 22000, driver: 'noodles', pass: 1, food: 25, energy: 0, mood: 0, min: 10,
    line: 'Ba phút chờ nước sôi là ba phút suy ngẫm.' },
  { id: 'nguyenlieu', name: 'Đồ nấu một bữa (rau, thịt, trứng)', place: 'cho', price: 25000, driver: 'veg', pass: 1, food: 0, energy: 0, mood: 0, min: 10, pantry: 1,
    line: 'Dì Chín bớt hai nghìn vì bạn cười tươi.' },
  { id: 'tunau', name: 'Tự nấu ở phòng', place: 'phongtro', price: 0, needsPantry: true, food: 45, energy: 0, mood: 3, min: 40,
    line: 'Nấu bằng bếp điện mini, cả dãy trọ ngửi thấy.' },
  { id: 'nhau', name: 'Nhậu với đồng nghiệp', place: 'quannhau', price: 200000, priceMin: 150000, priceMax: 250000, driver: 'beer', pass: 0.8, food: 40, energy: -10, mood: 15, min: 120,
    line: 'Một, hai, ba, dô. Quán gợi ý gọi xe ôm về.' },
  { id: 'comchung', name: 'Cơm chung tối Chủ nhật', place: 'khupho', price: 0, food: 50, energy: 0, mood: 6, min: 60, sharedMeal: true,
    line: 'Cô Nga xới cơm, chú Cường kể chuyện loa. Không ai hỏi vì sao bạn tới.' },
];
export const FOOD = Object.fromEntries(FOODS.map((f) => [f.id, f]));
export const foodById = (id) => FOOD[id] || null;
export const foodsAt = (placeId) => FOODS.filter((f) => f.place === placeId);
