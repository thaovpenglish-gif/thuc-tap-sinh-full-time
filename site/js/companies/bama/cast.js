// Ba & Má — cast (reuses the legacy "Ba Mẹ & Partners" family, now selling khô gà) + idle lines.
// Looks follow the legacy CAST block (story/legacy/ba-me-partners.js). New: Út Mi (host live), Cậu Tám (mối thịt).

export const CAT_NAME = 'Mèo Khô Gà';

export const CAST = {
  hung: { name: 'Bác Hùng', role: 'CEO · Nhà sáng lập · "Ba"', emoji: '👨‍🍳', color: '#9fb4ff', spot: 'boss',
    look: { shirt: '#9fb4ff', pants: '#5d6a9a', hair: 'side', hairColor: '#c9c9c9', glasses: true, tie: '#ff8fa3' } },
  hang: { name: 'Cô Hằng', role: 'CFO kiêm COO · "Má" · giữ két', emoji: '🧮', color: '#ffb3c7', spot: 'finance',
    look: { shirt: '#ffb3c7', pants: '#8a6a8f', hair: 'bun', hairColor: '#2a2a2a', glasses: true } },
  tuan: { name: 'Kevin Tuấn', role: 'Head of Innovation · con trai', emoji: '🚀', color: '#9ee8c8', spot: 'corner',
    look: { shirt: '#9ee8c8', pants: '#f2e6cf', hair: 'quiff', hairColor: '#4a3226', pods: true } },
  son: { name: 'Anh Sơn', role: 'Agile Consultant · Kevin thuê về', emoji: '📌', color: '#ffe08a', spot: 'coach',
    look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'beanie', hairColor: '#ff9f7a', notes: true } },
  vy: { name: 'Chị Vy', role: 'HR & Chief Happiness Officer · kiêm hồ sơ ATTP', emoji: '💁‍♀️', color: '#ffc6e0', spot: 'reception',
    look: { shirt: '#ffc6e0', pants: '#7d86b3', hair: 'long', hairColor: '#3b2418', clip: true } },
  dung: { name: 'Anh Dũng', role: 'Quản lý xưởng & đại lý · 15 năm · người ngoài', emoji: '🕴️', color: '#b9cfe6', spot: 'x1',
    look: { shirt: '#b9cfe6', pants: '#4b5566', hair: 'short', hairColor: '#1d1d1f', mug: true } },
  mai: { name: 'Chị Mai', role: 'Sales & CSKH · trạm phát sóng', emoji: '📢', color: '#ffc59e', spot: 'n1',
    look: { shirt: '#ffc59e', pants: '#8a5a4a', hair: 'wavy', hairColor: '#7a3b1e', phone: true } },
  khoa: { name: 'Anh Khoa', role: 'IT kiêm "Data & AI Lead" kiêm kỹ thuật live', emoji: '🖥️', color: '#c7b3ff', spot: 'it',
    look: { shirt: '#b49cff', pants: '#3f3f55', hair: 'curly', hairColor: '#1d1d1f', cat: true } },
  tu: { name: 'Cô Tư', role: 'Bếp & nếm thử · quyền lực ngầm', emoji: '🍵', color: '#bfe6b5', spot: 'pantry',
    look: { shirt: '#bfe6b5', pants: '#5f7a5a', hair: 'bun', hairColor: '#8a8a8a' } },
  bay: { name: 'Chú Bảy', role: 'Giao hàng · Kho · "Logistics Director"', emoji: '🛵', color: '#a8dcc0', spot: 'x3',
    look: { shirt: '#a8dcc0', pants: '#4a5a52', hair: 'cap', hairColor: '#7fb3ff' } },
  ngan: { name: 'Ngân', role: 'Intern #2 · con bạn thân Má', emoji: '🎨', color: '#a9d8ff', spot: 'c3',
    look: { shirt: '#a9d8ff', pants: '#5b6b9a', hair: 'pony', hairColor: '#1d1d1f', tote: true } },
  mi: { name: 'Út Mi', role: 'Host livestream · con gái út', emoji: '🎤', color: '#ff9fb2', spot: 'c1',
    look: { shirt: '#ff9fb2', pants: '#f2e6cf', hair: 'long', hairColor: '#5a2b1e', clip: true, phone: true } },
  cautam: { name: 'Cậu Tám', role: 'Em Má · mối thịt · "cố vấn xưởng"', emoji: '🥩', color: '#e0b080', spot: 'x2',
    look: { shirt: '#e0b080', pants: '#5a4a3a', hair: 'bald', hairColor: '#555555', phone: true } },

  // phone / chat only
  chitam: { name: 'Chị Tâm', role: 'Nhà phân phối lớn · khách sộp', emoji: '🏬', color: '#e7c6a5', body: false },
  cosau: { name: 'Cô Sáu Tạp Hóa', role: 'Đại lý chợ · nợ 46 triệu', emoji: '🧺', color: '#f1d7a8', body: false },
  doan: { name: 'Trưởng đoàn kiểm tra', role: 'Đoàn liên ngành ATTP', emoji: '📋', color: '#d9d9d9', body: false },
  khach: { name: 'Khách "shop ơi"', role: 'Khách hàng online', emoji: '📱', color: '#d9d9d9', body: false },
};

export const IDLE = {
  hung: ['Hồi xưa ba bán ngoài chợ có cần sàn siếc gì đâu con.', 'Ăn thử đi rồi biết. Không ngon ba đi đầu xuống đất.', 'Cái này ba làm hai chục năm rồi. Con mới làm hai chục ngày.', 'Con có thả tim tấm hình hoa sen sáng nay chưa?'],
  hang: ['Cái này bao nhiêu tiền?', 'Tắt quạt khi ra ngoài nghen con.', 'Người nhà mà, tính chi. (Má vẫn ghi sổ.)', 'Con tới lúc mấy giờ? Má thấy hết đó.'],
  tuan: ['Bro, mình phải scale lên. Ba anh vẫn nghĩ "scale" là cái cân.', 'ROAS 4.2 là ok rồi. Mẹ anh hỏi ROAS ăn được không.', 'Con số không biết nói dối. Trừ sổ của Má.', 'Anh đang build dashboard real-time. Chưa ai xem. But it\'s beautiful.'],
  son: ['Stand-up là phải ĐỨNG. Bác Hùng ngồi ghế nhựa là anti-pattern.', 'Việc này estimate mấy ký? À nhầm, mấy point.', 'Anh có chứng chỉ CSM, PSM và một giấy khen "Agile cấp phường".', 'Sprint này mục tiêu là… 10.000 gói khô gà. Velocity: lá chanh.'],
  vy: ['Em cần gì cứ ping chị. Trừ chuyện lương. Lương là chuyện của két.', 'HR ở đây là "Họ hàng Relations" đó em.', 'Chị nhắc ba lần rồi: phiếu kiểm nghiệm sắp hết hạn. Lần thứ tư chị in khổ A3.', 'Chief Happiness Officer mà tuần này chị khóc hai lần. KPI vẫn đạt.'],
  dung: ['Ừ. Chào em.', 'Đại lý lớn nhất là anh chăm từ 2011. Không ai nhớ.', 'Mười lăm năm. Anh vẫn là "người ngoài". Ngoài tới mức đứng ngoài xưởng.', 'Cà phê gói thôi em. Cà phê phin bị cắt từ 2020.'],
  mai: ['Psst… em nghe gì mới chưa? Chưa hả? Từ từ chị kiếm cái kể.', 'Để chị xử, em đừng rep khách. Khách chửi là chị nghe, em non lắm.', 'Chị không nhiều chuyện. Chị chỉ "chăm sóc khách hàng nội bộ".', 'Collagen nha em. Giá nội bộ. Uống vô da căng như khô bò.'],
  khoa: ['…', 'Em thử tắt đi bật lại chưa?', 'Mèo Khô Gà không phải của anh. Nó tự chọn đầu anh.', 'Wifi trưa bị tắt. Má nói tiết kiệm điện. Live thì xài 4G của anh.'],
  tu: ['Ăn chưa con?', 'Cô nếm khô cho Ba hai mươi sáu năm. Mặn một hột muối cô cũng biết.', 'Đừng ngồi ghế đỏ nha con. Ghế của Má.', 'Ai đúng ai sai cô không biết. Cô biết ai ăn vụng khô bò.'],
  bay: ['Chú đang kiểm kho. Đừng nói chú ngủ nha.', 'Xe giao hàng là xe chú, mua trả góp. Nói trước cho khỏi ai hỏi.', 'Cái gì mất trong kho, người đầu tiên bị nghi là chú. Quen rồi.', 'Hai mươi năm chở khô đi khắp chợ. Chú biết đường tắt ra mọi rắc rối.'],
  ngan: ['…Chào.', 'Mình đang vẽ lại hộp quà Tết. Hộp cũ có hình con gà đang… khóc.', 'Cậu cũng thấy chỗ này kỳ kỳ đúng không? Hay chỉ mình mình?', 'Mẹ mình nói Má "hứa rồi". Mình không biết Má hứa cái gì.'],
  mi: ['Chốt đơn nha cả nhà iu! …À, chưa live. Quen miệng.', 'Đừng đứng vô khung hình nha. Trừ khi em dễ thương hơn chị. Mà không có đâu.', 'Bán được thì "con Út giỏi". Ế thì "tại sàn". Chị thuộc lòng rồi.', 'Có ai thấy cái kẹp tóc màu hồng của chị không? Nó là bùa chốt đơn.'],
  cautam: ['Xưởng là của cậu. Giấy tờ là của Má. Tiền là của… thôi bỏ đi.', 'Hao hụt là chuyện bình thường con ơi.', 'Thịt cậu lấy là thịt tốt. Giấy tờ hơi mờ thôi. Mờ chứ đâu có mất.', 'Con có người yêu chưa? Cậu có đứa cháu bên ngoại…'],
};
