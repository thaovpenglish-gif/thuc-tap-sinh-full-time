// Cân Đối & Cộng Sự — cast, idle lines, cat. All names are fictional.
// Spots: see site/js/maps/slots.js (SLOT_HELP). One unique spot per person with a body.

export const CAT_NAME = 'Mèo Số Dư';

export const CAST = {
  phong: { name: 'Anh Phong', role: 'Partner · chỉ xuất hiện để ký', emoji: '🖋️', color: '#2f4a6b', spot: 'boss',
    look: { shirt: '#2f4a6b', pants: '#1f2a3a', hair: 'side', hairColor: '#9a9a9a', glasses: true, tie: '#b8f0d8' } },
  thao: { name: 'Chị Thảo', role: 'Audit Manager · review note lúc 3 giờ sáng', emoji: '🖍️', color: '#ff8fa3', spot: 'finance',
    look: { shirt: '#ff8fa3', pants: '#4a3f5a', hair: 'bun', hairColor: '#1d1d1f', glasses: true, mug: true } },
  khoa: { name: 'Anh Khoa', role: 'Senior In-charge · chưa thấy nắng từ tháng Một', emoji: '🧟', color: '#c9d1dc', spot: 'senior',
    look: { shirt: '#c9d1dc', pants: '#3a3f4a', skin: '#f2e8e0', hair: 'curly', hairColor: '#2a2a2a', pods: true, mug: true } },
  diep: { name: 'Chị Diệp', role: 'Associate 2 · tick-mark 4 màu', emoji: '🖊️', color: '#c9b6ff', spot: 'c1',
    look: { shirt: '#c9b6ff', pants: '#3f3f55', hair: 'pony', hairColor: '#2b1b14', clip: true, notes: true } },
  vy: { name: 'Vy', role: 'Thực tập sinh · "Em xong rồi ạ!"', emoji: '⚡', color: '#ffd166', spot: 'c2',
    look: { shirt: '#ffd166', pants: '#5b6b9a', hair: 'long', hairColor: '#3b2418', phone: true, tote: true } },
  tuan: { name: 'Tuấn', role: 'Associate 1 · admin "Hội Tick Mỏi Tay"', emoji: '😴', color: '#a8dcc0', spot: 'c3',
    look: { shirt: '#a8dcc0', pants: '#4a5a52', hair: 'cap', hairColor: '#1d1d1f', mug: true } },
  hieu: { name: 'Anh Hiếu', role: 'Tax Senior · trích văn bản theo số', emoji: '📜', color: '#f4d58d', spot: 'n3',
    look: { shirt: '#f4d58d', pants: '#5a5040', hair: 'side', hairColor: '#1d1d1f', glasses: true, tie: '#7a5a2a' } },
  ngan: { name: 'Chị Ngân', role: 'Advisory · "bên chị không đi kho"', emoji: '💼', color: '#9fd8ff', spot: 'n5',
    look: { shirt: '#9fd8ff', pants: '#2f3f5a', hair: 'wavy', hairColor: '#5a3a26', phone: true } },
  sang: { name: 'Anh Sang', role: 'Dịch vụ kế toán · sổ thuê cho 40 hộ', emoji: '📞', color: '#ffb38a', spot: 'n2',
    look: { shirt: '#ffb38a', pants: '#5a4a3a', hair: 'short', hairColor: '#1d1d1f', phone: true } },
  my: { name: 'Chị My', role: 'QC & Risk · cửa ải cuối', emoji: '🔍', color: '#d9d9e6', spot: 'n6',
    look: { shirt: '#d9d9e6', pants: '#3a3a4a', hair: 'short', hairColor: '#1d1d1f', glasses: true, notes: true } },
  loc: { name: 'Anh Lộc', role: 'IT Helpdesk · chỉ làm giờ hành chính', emoji: '🔌', color: '#aeb7c9', spot: 'it',
    look: { shirt: '#aeb7c9', pants: '#3a3a4a', hair: 'beanie', hairColor: '#1d1d1f' } },
  hue: { name: 'Chị Huệ', role: 'HR & Admin · cảnh sát timesheet', emoji: '⏱️', color: '#ffc8dd', spot: 'hr',
    look: { shirt: '#ffc8dd', pants: '#6b4a5a', hair: 'long', hairColor: '#3b2418', clip: true } },
  lua: { name: 'Cô Lụa', role: 'Văn thư · người giữ con dấu', emoji: '🔏', color: '#e8d5b0', spot: 'reception',
    look: { shirt: '#e8d5b0', pants: '#6b5a4a', hair: 'bun', hairColor: '#7a7a7a', glasses: true } },

  // client & off-site people (Teams, phone, Zalo only)
  quang: { name: 'Anh Quang', role: 'CFO · Phúc Lộc Foods (khách hàng)', emoji: '🐟', color: '#d9d9d9', body: false },
  hong: { name: 'Chị Hồng', role: 'Kế toán trưởng · Phúc Lộc Foods', emoji: '📒', color: '#d9d9d9', body: false },
  tu: { name: 'Chú Tư', role: 'Thủ kho lạnh · Phúc Lộc Foods', emoji: '🧊', color: '#d9d9d9', body: false },
  may: { name: 'Chị Mây', role: 'Chủ chuỗi Lẩu Bếp Nhà Mây (khách dịch vụ kế toán)', emoji: '🍲', color: '#d9d9d9', body: false },
  meo: { name: 'Mèo Số Dư', role: 'Mèo văn phòng · chưa bao giờ lệch', emoji: '🐈', color: '#d9d9d9', body: false },
};

export const IDLE = {
  phong: ['Anh chỉ ghé ký thôi. Mười lăm phút nữa anh có cuộc họp khác.', 'Số này hơi lạ nhỉ. Không, anh hỏi vu vơ thôi.', 'Hồi anh làm intern, tick-mark bằng bút chì. Tẩy được. Bây giờ thì không.'],
  thao: ['Chị hỏi nhanh thôi nhé.', 'Em ref chéo giúp chị chưa?', 'Lệch có một đồng thôi, nhưng phải tìm ra một đồng đó.', 'Chị gửi note rồi đấy. Lúc 3 giờ. Em đọc chưa?'],
  khoa: ['Mấy giờ rồi em? Ngoài trời còn sáng không?', 'Tick xong chưa em?', 'Anh gửi voice note rồi. Ý chính ở giây cuối.', 'Cái cây xương rồng này quang hợp hộ anh.'],
  diep: ['Đỏ là đã đối chiếu chứng từ. Xanh là lần xuôi lên sổ. Tím là cộng dồn. Cam là hỏi lại. Đừng dùng đen.', 'Chị hết bút xanh lá. Đừng ai nói chuyện với chị.', 'Tick-mark không có chú giải là tick-mark mồ côi.'],
  vy: ['Em xong rồi ạ! À, mình đang nói với chị Thảo, không phải bạn.', 'Đợt này chỉ có một suất offer thôi đó. Bạn biết chưa?', 'Mẹ mình làm kế toán trưởng. Mình sinh ra đã biết Nợ – Có.'],
  tuan: ['Năm ngoái làm thế nào thì năm nay làm thế. Trừ lỗi. Lỗi thì giữ nguyên cho đồng bộ.', 'Ngủ được thì ngủ. Busy season không báo trước.', 'Group "Hội Tick Mỏi Tay" có 94 tin chưa đọc. Toàn sticker.'],
  hieu: ['Theo Điều 4, khoản 2, điểm c… à, cái đó vừa được sửa. Theo cái sửa nó… cũng sắp được sửa.', 'Em hỏi thuế hả? Câu trả lời luôn là "tùy trường hợp".', 'Anh không nói đùa về thuế. Thuế tự nó đã đủ buồn cười.'],
  ngan: ['Bên chị không đi kho. Bên chị đi họp.', 'Mô hình này có 14 sheet, 3 kịch bản và 1 giả định không ai dám hỏi.', 'Valuation là nghệ thuật. Audit là… kế toán.'],
  sang: ['Dạ em nghe, chị Bảy tiệm vàng ạ. Hoá đơn ghi sai tên chồng chị hả chị?', 'Bốn mươi khách. Bốn mươi bộ sổ. Một cái điện thoại.', 'Khách của anh gửi chứng từ bằng ảnh chụp nghiêng 45 độ. Nghệ thuật lắm.'],
  my: ['…', 'Trang 37 thiếu chữ ký nháy.', 'Chị không đáng sợ. Hồ sơ của em mới đáng sợ.'],
  loc: ['Em đã thử tắt đi bật lại chưa?', 'Năm giờ chiều anh về. Laptop chết sau năm giờ là chuyện tâm linh.', 'Đừng bấm Update. Anh xin em đấy.'],
  hue: ['Em charge giờ vào job nào?', 'Thứ Bảy này team building nhé. Không bắt buộc. Nhưng chị điểm danh.', 'Timesheet tuần trước của em bị trả về vì sai mã job.'],
  lua: ['Con dấu không đi đâu hết. Giấy tờ đi tới con dấu.', 'Cháu uống trà gừng không? Mùa kiểm kê ai cũng lạnh.', 'Thư xác nhận gửi đi phải qua cô. Về cũng phải qua cô.'],
};
