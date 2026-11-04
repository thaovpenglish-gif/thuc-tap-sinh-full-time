// Đi Đâu Cũng Được — cast, idle lines, office theme, object lines, hidden ties.
// All people, clients, vendors and brands are fictional.

export const CAT_NAME = 'Mèo Plan B';

export const CAST = {
  kieu: { name: 'Chị Kiều', role: 'Founder & CEO · "Micro Vàng 2009"', emoji: '🎤', color: '#ffcf6b', spot: 'boss',
    look: { shirt: '#ffcf6b', pants: '#5a3a5a', hair: 'wavy', hairColor: '#5a2a1a', phone: true } },
  duy: { name: 'Anh Duy', role: 'Event Producer · "Ba Bộ Đàm"', emoji: '📻', color: '#7fc8a9', spot: 'senior',
    look: { shirt: '#3a3f4a', pants: '#1f2328', hair: 'cap', hairColor: '#1d1d1f', pods: true } },
  thao: { name: 'Chị Thảo', role: 'Sales Lead · "Dạ được ạ"', emoji: '🤝', color: '#ff9fb2', spot: 'n3',
    look: { shirt: '#ff9fb2', pants: '#4a3a5a', hair: 'long', hairColor: '#2b1b14', phone: true } },
  my: { name: 'Mỹ', role: 'Account Executive · team chị Thảo', emoji: '📝', color: '#c9b6ff', spot: 'n2',
    look: { shirt: '#c9b6ff', pants: '#3f3f55', hair: 'pony', hairColor: '#1d1d1f', glasses: true, mug: true } },
  ngan: { name: 'Chị Ngân', role: 'Booking vé & phòng · "Hold chỗ"', emoji: '✈️', color: '#9fd3ff', spot: 'n1',
    look: { shirt: '#9fd3ff', pants: '#3a4a6b', hair: 'bun', hairColor: '#2a2a2a', glasses: true, phone: true } },
  toan: { name: 'Anh Toàn', role: 'Logistics & Ops · "Danh bạ sống"', emoji: '🚚', color: '#f2a65a', spot: 'n5',
    look: { shirt: '#f2a65a', pants: '#4a4a3a', hair: 'short', hairColor: '#1d1d1f', phone: true } },
  tien: { name: 'Anh Tiến', role: 'Designer KV · "Sang hơn chút"', emoji: '🎨', color: '#b8e0d2', spot: 'n4',
    look: { shirt: '#b8e0d2', pants: '#2f3542', hair: 'beanie', hairColor: '#ff9f7a', pods: true } },
  khoa: { name: 'Khoa', role: 'Creative & Quản trò', emoji: '🎲', color: '#ffe08a', spot: 'c1',
    look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'curly', hairColor: '#3b2418', notes: true } },
  hai: { name: 'Anh Hải', role: 'Hướng dẫn viên · "Cờ Vàng"', emoji: '🚩', color: '#ffd166', spot: 'x3',
    look: { shirt: '#ffd166', pants: '#2f4a3a', hair: 'cap', hairColor: '#e63946', tote: true } },
  bich: { name: 'Cô Bích', role: 'Kế toán trưởng · "Hóa đơn đỏ"', emoji: '🧾', color: '#e3d9ff', spot: 'finance',
    look: { shirt: '#e3d9ff', pants: '#5a4a6b', hair: 'bun', hairColor: '#5a5a5a', glasses: true } },
  lan: { name: 'Chị Lan', role: 'Lễ tân · Hành chính · Thủ kho', emoji: '🗝️', color: '#ffc6e0', spot: 'reception',
    look: { shirt: '#ffc6e0', pants: '#8a6a5a', hair: 'wavy', hairColor: '#4a3226', tote: true } },
  quan: { name: 'Anh Quân', role: 'Kỹ thuật AS-AS · "HDMI"', emoji: '🎚️', color: '#aeb7c9', spot: 'it',
    look: { shirt: '#2f3542', pants: '#1f2328', hair: 'quiff', hairColor: '#1d1d1f', pods: true } },
  vy: { name: 'Vy', role: 'Intern · vào trước bạn 1 tháng', emoji: '📱', color: '#a8e6cf', spot: 'c3',
    look: { shirt: '#a8e6cf', pants: '#7d86b3', hair: 'long', hairColor: '#3b2418', clip: true, phone: true } },
  // clients & vendors: phone / Teams only
  quang: { name: 'Anh Quang', role: 'Chủ tịch Bê Tông Vững Chãi · sếp lớn bên khách', emoji: '🏗️', color: '#c9c9c9', body: false },
  huong: { name: 'Chị Hường', role: 'HR bên khách · Bê Tông Vững Chãi', emoji: '💼', color: '#d9d9d9', body: false },
  thang: { name: 'Anh Thắng', role: 'Trưởng đoàn · Dược phẩm Khỏe Re', emoji: '💊', color: '#d9d9d9', body: false },
  loc: { name: 'Anh Lộc Xe', role: 'Nhà xe Lộc Phát · "45 chỗ"', emoji: '🚌', color: '#d9d9d9', body: false },
  diem: { name: 'Chị Diễm', role: 'Sales · Biển Xanh Resort', emoji: '🏨', color: '#d9d9d9', body: false },
  khai: { name: 'MC Khải', role: 'MC tự do · "giọng ấm"', emoji: '🎙️', color: '#d9d9d9', body: false },
  hoa: { name: 'Chị Hoa', role: 'Vendor hoa · Hoa Tươi Mãi', emoji: '💐', color: '#d9d9d9', body: false },
};

export const IDLE = {
  kieu: ['Xin một tràng pháo tay cho… à, em đang hỏi gì nhỉ?', 'Khách luôn đúng. Trừ lúc thanh toán.', 'Hồi chị dẫn gala 2009, mưa to hơn thế này nhiều. Chị vẫn dẫn. Ướt, nhưng dẫn.', 'Đừng bao giờ để micro im quá ba giây. Im lặng là kẻ thù.'],
  duy: ['Copy.', 'Có Plan B chưa em? Plan C thì sao?', 'Bộ đàm số một là khách, số hai là vendor, số ba là chị Kiều. Số ba anh hay tắt.', 'Mấy giờ load-in? Ai trực sân khấu đêm nay?'],
  thao: ['Dạ được ạ chị! …Em ơi, mình làm được không?', 'Khách bảo đắt quá, bớt chút. Chút là ba mươi phần trăm.', 'Chị chưa hứa gì đâu. Chị chỉ nói "chắc được ạ".'],
  my: ['Proposal lần thứ năm. Lần này chỉ đổi màu… và concept… và ngân sách.', 'Chị Thảo hứa, mình viết. Đó là phân công lao động.', 'Mình ngủ ba tiếng. Hôm qua ngủ được bốn, nên vẫn ổn.'],
  ngan: ['Em hold rồi, chưa xuất. Hai thứ đó khác nhau một trời một vực.', 'Giá vé vừa tăng sau khi chị đi pha cà phê. Lần sau chị nhịn cà phê.', 'Rooming list lần bảy. Lần tám chắc là chiều nay.'],
  toan: ['Xe hả? Anh có ba trăm số nhà xe. Hai trăm cái tên là "Anh Xe".', 'Gọi vendor không nghe thì gọi vợ vendor. Vợ không nghe thì gọi mẹ vợ.', 'Ở tỉnh nào anh cũng có một người quen nợ anh một bữa nhậu.'],
  tien: ['"Sang hơn nhưng đừng sang quá." Anh nằm mơ cũng nghe câu đó.', 'Font này sang. Khách bảo chưa sang. Anh đổi lại font cũ. Khách bảo sang rồi.', 'Concept năm nay vẫn là "Together We Rise". Năm ngoái cũng vậy.'],
  khoa: ['Trò mới nè: "Kéo co dưới nước". Không ai muốn chơi, nhưng ai cũng sẽ nhớ.', 'Team building là bắt buộc vui. Chữ "bắt buộc" đứng trước.', 'Mình có 40 trò chơi. 38 trò cần nước, cát, hoặc một người hy sinh.'],
  hai: ['MỘT, HAI, BA… MỘT TRĂM HAI MƯƠI! Đủ! …Khoan, còn anh mặc áo vàng đâu?', 'Giọng anh là giọng megaphone tự nhiên. Không cần pin.', 'Đoàn nào cũng có một người đi lạc. Nhiệm vụ của anh là biết trước đó là ai.'],
  bich: ['Hóa đơn đỏ đâu em? Không có hóa đơn là không có tiền.', 'Hai thùng nước suối mà ghi ba thùng. Cái thùng thứ ba nó đi đâu?', 'Cô kiểm từng tờ biên lai. Cô cũng kiểm cả cảm xúc của em nữa.'],
  lan: ['Em cần gì? Băng keo đen, dây rút, hay tinh thần?', 'Kho có bốn mươi ghế Chiavari và một con lân gãy sừng. Đừng hỏi con lân.', 'Có ai thấy cái bộ đàm số bảy không? Nó đi show rồi không về.'],
  quan: ['Laptop em cổng gì? Type-C hả? Khách sạn chỉ có VGA. Năm 2026 rồi đấy.', 'Âm thanh không có lỗi. Lỗi là ở người cầm micro.', 'Tắt micro đi bật lại. Không được thì đập nhẹ. Nhẹ thôi.'],
  vy: ['Hôm qua mình quay TikTok hậu trường, 40 nghìn view. Chị Kiều chưa biết.', 'Mẹo sống sót: luôn mang sạc dự phòng, áo mưa, và một gói xôi.', 'Bạn ơi, nếu ai hỏi "ai trực đêm" thì đừng nhìn vào mắt anh Duy.'],
};

export const THEME = {
  logo: ['ĐI ĐÂU CŨNG ĐƯỢC', 'Sự kiện · Team building · Tour · MICE', '"Có Plan B. Plan C đang in."'],
  skyline: 'ĐI ĐÂU CŨNG ĐƯỢC',
  bossWall: 'MC Gala của năm 2009',
  banner: 'CÓ PLAN B CHƯA? · CÓ PLAN B CHƯA?',
  signs: { boss: 'PHÒNG CHỊ KIỀU (CẤM HÁT)', finance: 'KẾ TOÁN · Không hóa đơn, không tiền', meeting: 'PHÒNG HỌP / PHÒNG NGỦ TRƯA', standup: 'BRIEFING 8:30', pantry: 'PANTRY · Đồ ăn thừa từ gala' },
  desks: {
    me: ['Intern · Bạn', ['Run-sheet', 'Gala_v9_FINAL'], '#f2a65a'],
    n1: ['Ngân · Booking', ['PNR hết hạn', 'còn 02:14:09'], '#4fa3e0'],
    n2: ['Mỹ · AE', ['Proposal', 'lần 5 (mới)'], '#9b7fe0'],
    n3: ['Thảo · Sales', ['Khách mới', '"Dạ được ạ"'], '#ff7a9a'],
    n4: ['Tiến · Design', ['KV_sanghon', '_dungsangqua'], '#5fb89a'],
    n5: ['Toàn · Ops', ['Danh bạ', '312 Anh Xe'], '#e08a3a'],
    n6: ['Bàn CTV', ['Ai tới trước', 'ngồi trước'], '#bbbbbb'],
    c1: ['Khoa · Quản trò', ['40 trò chơi', '38 trò ướt'], '#e0b84a'],
    c2: ['Bàn CTV 2', ['Đồ trò chơi', 'đừng ngồi'], '#bbbbbb'],
    c3: ['Vy · Intern', ['TikTok', '40K view'], '#5fc89a'],
    hr: ['Bàn HDV', ['Cờ · Loa', 'Áo mưa'], '#ffd166'],
    senior: ['Duy · Producer', ['Run-sheet', 'Standby…'], '#3fa37a'],
  },
  whiteboard: ['LỊCH SỰ KIỆN THÁNG 11', '11/11 Gala Bê Tông 25 năm', '15/11 Tour Khỏe Re 120 pax', '18/11 Hội nghị khách hàng', 'Mưa: CÓ PLAN B'],
  scrum: {
    cols: ['CHỜ KHÁCH DUYỆT', 'ĐANG CHẠY', 'ĐÃ NGHIỆM THU'],
    notes: [['KV lần 4', 'Báo giá "bớt chút"', 'Rooming list v7'], ['Gala 25 năm', 'Tour 120 pax', 'Hội nghị KH'], ['Khai trương Q7', '(chưa thu tiền)']],
  },
  board: ['YEAR-END 2026 🎉', 'Tháng 12: 23 show', 'Nghỉ phép: KHÔNG'],
  palette: { wall: '#fff6e0', lilac: '#e6dcff', peach: '#ffe3cc', mint: '#d9f5e6', butter: '#fff0a8' },
  labels: { coffee: 'Pantry: buffet thừa từ gala', okr: 'Đọc lịch sự kiện tháng 11', altar: 'Thắp hương Thần Tài (cầu trời tạnh mưa)', safe: 'Nhìn két tiền cọc' },
  props: [
    { type: 'balloons', slot: 'p1', label: 'BÓNG BAY GALA' },
    { type: 'crates', slot: 'p2', label: 'ĐỒ TEAM BUILDING' },
    { type: 'standee', slot: 'p3', label: 'GALA|2026|TOGETHER WE RISE' },
    { type: 'rack', slot: 'p4', label: 'ÁO ĐỒNG PHỤC ĐOÀN' },
    { type: 'cabinet', slot: 'p5', label: 'BACKDROP CŨ' },
    { type: 'ringlight', slot: 'p6', label: 'MC KIỀU 2009' },
  ],
};

export const OBJ_LINES = {
  printer: [['nar', 'Máy in màu. Trên máy dán tờ giấy: "In thẻ tên thì kiểm tra dấu trước. Nguyễn Văn Ạnh là có thật."']],
  desk: [['nar', 'Bàn của bạn. Một laptop, ba cuộn băng keo đen, một áo mưa gấp sẵn và tờ run-sheet có chữ FINAL bị gạch.']],
  okr: [['nar', 'Bảng "LỊCH SỰ KIỆN THÁNG 11". Mỗi ô có ba màu bút. Ô ngày 20 ghi "3 show?" và một hình mặt khóc.']],
  altar: [['nar', 'Bàn thờ Thần Tài. Có ai đó đặt một cái ô gấp làm lễ vật, kèm giấy: "Xin đừng mưa ngày 11".'], { fx: { uy: 1 } }],
  safe: [['nar', 'Két đựng tiền cọc. Tờ giấy dán: "Khách cọc ít, vendor đòi nhiều. Két này là ranh giới."']],
  plant: [['nar', 'Một chậu trầu bà trồng trong cái thùng loa cũ. Nó sống khỏe hơn mọi người trong mùa cao điểm.']],
  redchair: [['nar', 'Một chiếc ghế Chiavari mạ vàng bị gãy chân. Không ai dám vứt. Nó từng ở gala 2009.']],
  interview: [['nar', 'Phòng họp. Trên bàn có ba cái túi ngủ cuộn tròn và một tờ giấy: "Phòng họp từ 9h. Phòng ngủ từ 2h sáng."']],
};

// Hidden ties: 2 drawn per run → flags tie_<id> = true.
export const TIES = [
  { id: 'thao_kieu', text: 'Chị Thảo là em gái chị Kiều' },
  { id: 'toan_loc', text: 'Anh Lộc Xe là anh rể anh Toàn' },
  { id: 'vy_huong', text: 'Vy là cháu gái chị Hường bên khách' },
  { id: 'duy_lan', text: 'Anh Duy và chị Lan từng là một cặp MC đám cưới' },
];
