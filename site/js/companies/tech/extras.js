// Nợ Kỹ Thuật Labs — side tasks, weekly review (chị Diệp, PM), promotion, endings, pantry option, life events, ties.

// ---------------------------------------------------------------- side tasks ("việc vặt")
export const SIDE_TASKS = [
  { id: 'charge_phones', title: 'Mượn cáp sạc ở góc IT cho 7 điện thoại test của chị Nguyệt', from: 'nguyet', base: 60, when: (r) => !r.flags.loc_left, legs: [
    { npc: 'nguyet', line: ['nguyet', 'Ba máy test hết pin rồi em. Qua anh Lộc mượn giúp chị cáp. Loại cổng cũ. Máy số 5 kén cáp lắm.'] },
    { npc: 'loc', line: ['loc', '🔌🔌🔌 ↩️'] },
    { npc: 'nguyet', line: ['nguyet', 'Ba cáp, có cả cáp cho máy số 5. Anh Lộc dặn gì không? …"↩️" là phải trả. Ok.'] },
  ] },
  { id: 'print_spec', title: 'In spec 200 trang cho buổi họp với khách Nhật', from: 'hieu', base: 90, legs: [
    { npc: 'hieu', line: ['hieu', 'Khách Nhật muốn bản giấy. 200 trang, hai mặt, có đánh số. Ở Nhật, giấy là sự tôn trọng.'] },
    { obj: 'printer', line: ['nar', 'Máy in kẹt ở trang 117. Bạn rút giấy, máy in hiện "Báo lỗi qua Jira". Bạn tắt đi bật lại. Nó chạy tiếp.'] },
    { npc: 'hieu', line: ['hieu', 'Đủ 200 trang. Arigatou. Em vừa cứu anh khỏi Q&A dòng 149.'] },
  ] },
  { id: 'wifi_pw', title: 'Hỏi chị Hoa mật khẩu wifi mới cho Tùng', from: 'tung', base: 50, when: (r) => !r.flags.tung_left, legs: [
    { npc: 'tung', line: ['tung', 'Wifi lại đổi mật khẩu. Em hỏi chị Hoa giúp anh. Anh đang phát 4G cho ba người, điện thoại nóng như bếp từ.'] },
    { npc: 'hoa', line: ['hoa', 'Mật khẩu mới là "FixLater3!". Đừng nói ai. Mà thôi, nói cả công ty luôn đi, đỡ hỏi chị.'] },
    { npc: 'tung', line: ['tung', '"FixLater3". Công ty này có triết lý nhất quán ghê.'] },
  ] },
  { id: 'pizza', title: 'Kiểm tra pizza cho happy hour ở pantry', from: 'ngan', base: 70, legs: [
    { npc: 'ngan', line: ['ngan', 'Em xem giúp chị pizza tới chưa nha. Năm nay mình đặt 6 hộp. Tối ưu chi phí mà vẫn vui!'] },
    { obj: 'coffee', line: ['nar', 'Pantry có 6 hộp pizza. 4 hộp đã trống. Happy hour còn hai tiếng nữa mới bắt đầu.'] },
    { npc: 'ngan', line: ['ngan', 'Hai hộp còn lại hả? Ok. Mình gọi đây là "pizza tinh gọn". Cảm ơn em.'] },
  ] },
  { id: 'sticky', title: 'Xin chị Hoa sticky note cho buổi planning', from: 'diep', base: 80, legs: [
    { npc: 'diep', line: ['diep', 'Hết sticky note rồi. Không có sticky note thì không có planning. Không có planning thì không có framework. Em đi giúp chị.'] },
    { npc: 'hoa', line: ['hoa', 'Sticky note vàng hết rồi, còn màu hồng. Mình là startup mà em.'] },
    { npc: 'diep', line: ['diep', 'Hồng. Ok. Sprint này mình gọi là "Pink Sprint". Chị ghi vào Confluence.'] },
  ] },
  { id: 'cold_brew', title: 'Pha cold brew cho anh Kevin trước call với quỹ', from: 'kevin', base: 45, legs: [
    { npc: 'kevin', line: ['kevin', 'Em pha giúp anh ly cold brew. Không đường, ít đá. Anh sắp có call với quỹ, cần năng lượng founder.'] },
    { obj: 'coffee', line: ['nar', 'Pantry không có cold brew. Bạn pha cà phê gói, thêm đá, đổ vào ly thủy tinh cho trông đắt tiền.'] },
    { npc: 'kevin', line: ['kevin', 'Cold brew ngon! Thấy chưa, mình là startup nhưng chất lượng như Silicon Valley.'] },
  ] },
  { id: 'nudge_pr', title: 'Nhắc Tùng sửa PR cho anh Khải review', from: 'khai', base: 75, when: (r) => !r.flags.tung_left, legs: [
    { npc: 'khai', line: ['khai', 'PR của Tùng mở 6 ngày. Anh comment rồi. Em nhắc Tùng giúp anh. Anh nhắc ba lần, Tùng "seen".'] },
    { npc: 'tung', line: ['tung', 'Sửa rồi mà! Trên máy anh… à chưa push. Ok, push rồi đó.'] },
    { npc: 'khai', line: ['khai', 'Push rồi. Ok. Approve. It depends… không, approve thật.'] },
  ] },
  { id: 'color_ok', title: 'Xin chị Diệp duyệt mã màu nút "Thanh toán" cho Vy', from: 'vy', base: 60, legs: [
    { npc: 'vy', line: ['vy', 'Mình cần chị Diệp duyệt màu #FF6B6B. Mình mà đi thì sẽ thành tranh luận 40 phút. Bạn đi nha.'] },
    { npc: 'diep', line: ['diep', 'Màu này có ảnh hưởng conversion không? …Thôi, duyệt. Chị không có framework nào cho màu.'] },
    { npc: 'vy', line: ['vy', 'Duyệt rồi?! Không cãi?! Bạn là phép màu. Hay là chị Diệp mệt.'] },
  ] },
  { id: 'invoice', title: 'Hỏi anh Hiếu khách Nhật đã nghiệm thu chưa cho chị Thảo', from: 'thao', base: 90, legs: [
    { npc: 'thao', line: ['thao', 'Em hỏi anh Hiếu xem khách Nhật ký biên bản nghiệm thu chưa. Có biên bản chị mới xuất hóa đơn. Có hóa đơn mới có lương.'] },
    { npc: 'hieu', line: ['hieu', 'Tanaka-san ký rồi. Sáng nay. Kèm một câu "otsukaresama". Nghĩa là "vất vả rồi". Anh xúc động.'] },
    { npc: 'thao', line: ['thao', 'Ký rồi? Tốt. Lương tháng này an toàn. Em vừa là người mang tin vui nhất tuần.'] },
  ] },
  { id: 'kol_banner', title: 'Xin Vy banner gấp cho Duy đăng KOL', from: 'duy', base: 55, legs: [
    { npc: 'duy', line: ['duy', 'Anh cần banner cho KOL trong một tiếng. Em xin Vy giúp anh. Vy không nhận tin nhắn của anh từ vụ "confetti".'] },
    { npc: 'vy', line: ['vy', 'Một tiếng? Banner? Ok… nhưng không có chữ "SALE" đỏ chót. Mình có nguyên tắc.'] },
    { npc: 'duy', line: ['duy', 'Đẹp! Không có chữ SALE nhưng nhìn vẫn muốn mua. Đó là phép thuật của designer.'] },
  ] },
  { id: 'water_plant', title: 'Tưới chậu xương rồng "Uptime" cho chị Hoa', from: 'hoa', base: 80, legs: [
    { npc: 'hoa', line: ['hoa', 'Em tưới giúp chị chậu xương rồng ở góc. Một ít thôi. Nó là thứ duy nhất ở đây đạt SLA, đừng làm nó chết.'] },
    { obj: 'plant', line: ['nar', 'Bạn tưới ba muỗng nước. Chậu xương rồng có thẻ: "Uptime 99,9%. Downtime: lần anh Kevin tưới nước tăng lực".'] },
    { npc: 'hoa', line: ['hoa', 'Ba muỗng? Chuẩn. Em có tố chất DevOps.'] },
  ] },
  { id: 'old_server', title: 'Báo anh Lộc: server cũ kêu như máy giặt', from: 'thac', base: 50, when: (r) => !r.flags.loc_left, legs: [
    { npc: 'thac', line: ['thac', 'Server cũ ở góc kêu to hơn bình thường. Em báo Lộc giúp anh. Đừng ai chạm vào nó.'] },
    { npc: 'loc', line: ['loc', '😨 → 🧹 → 🙏'] },
    { npc: 'thac', line: ['thac', 'Lộc thổi bụi rồi hả? Tốt. Server đó chạy từ 2021. Không ai biết nó chạy cái gì. Nhưng tắt nó thì ví sập.'] },
  ] },
];

// ---------------------------------------------------------------- weekly review (chị Diệp, Senior PM)
export const REVIEW = {
  A: [
    'Tuần này em làm tốt. Chị chấm theo RICE: Reach cao, Impact cao, Confidence cao, Effort… em hơi cày quá, nghỉ chút đi.',
    'Em có ownership. Ownership đúng việc của em. Hiếm lắm, ở đây người ta toàn ownership việc của người khác.',
    'Anh Thạc nhắc tên em trong #engineering. Anh Thạc không nhắc tên ai. Em hiểu mức độ rồi đó.',
    'Không có gì để chê. Chị có framework 5 bước để góp ý, mà tuần này dừng ở bước 1.',
    'Em làm tốt hơn kỳ vọng. Mà kỳ vọng ban đầu của chị không thấp đâu nha. Chị nói trước.',
    'Ticket của em đóng đúng hạn, có mô tả, có tiêu chí xong. Chị suýt khóc trong Jira.',
  ],
  B: [
    'Ổn. "Ổn" ở startup nghĩa là không có incident nào mang tên em.',
    'Em đặt câu hỏi rất hay. Hơi nhiều thôi. Lần sau gom lại thành một thread nha.',
    'Em làm đúng việc. Giờ chị cần em visible hơn. Không phải đăng LinkedIn đâu. Là nói to hơn ở daily.',
    'Slack em reply nhanh nhất team. Mà sao Jira không cập nhật? Jira cũng là bạn em mà.',
    'Em có growth mindset. Bằng chứng là còn rất nhiều chỗ để grow.',
  ],
  C: [
    'Tuần này chị thấy em bận. Nhưng trên Jira chị chưa thấy gì "Done".',
    'Em rất chủ động. Lần sau chủ động hỏi trước khi chủ động làm nha.',
    'Code em clean lắm. Chỉ là nó chưa chạy. Mình align lại nha.',
    'Em không gây bug nào trên prod. Vì em chưa đưa gì lên prod. Hai cái đó khác nhau.',
    'Chị cần thấy output, không chỉ thấy em online. Online là trạng thái, không phải kết quả.',
  ],
  D: [
    'Em có muốn tiếp tục ở Nợ Kỹ Thuật không? Chị hỏi thật, không phải câu tu từ, cũng không phải framework.',
    'Velocity tuần này của em đang âm. Chị không biết velocity âm được. Giờ thì biết.',
    'Chị sẽ ghi nhận. Theo nghĩa xấu. Có kèm timestamp.',
    'Anh Kevin hỏi chị "bạn đó làm gì vậy". Chị không có câu trả lời. Đó là vấn đề.',
    'Tuần sau em và chị có 1:1 mỗi ngày. Mười lăm phút. Thật sự mười lăm phút.',
  ],
};

// ---------------------------------------------------------------- promotion: the ONE way to become official
// Cần: ≥ 2 tuần loại A, review ngày 26 hoặc 33 (sau đợt layoff, còn đủ ngày cho arc), quan hệ tốt với chị Diệp và anh Thạc, Uy tín ≥ 65,
// ít nhất 3 "khoảnh khắc đáng tin" (rollback/nhận deploy, MAU trung thực, cứu on-call, script đi đày, blameless, cứu App Store)
// và KHÔNG thổi phồng MAU (anh Thạc không ký cho người làm đẹp số liệu).
export const trustCount = (r) => [
  r.flags.deploy_rollback || r.flags.deploy_owned,
  r.flags.mau_honest,
  r.flags.oncall_saved || r.flags.oncall_escalated,
  r.flags.exile_script,
  r.flags.blame_fixed || r.flags.blame_proved,
  r.flags.store_fixed,
  r.flags.ticket_split && r.flags.ui_checklist,
].filter(Boolean).length;

export const PROMOTION = {
  salary: 15_000_000,
  when: (r) => r.day >= 26 && r.day <= 33
    && (r.reviews || []).filter((x) => x.grade === 'A').length >= 2
    && (r.rel.diep || 0) >= 4 && (r.rel.thac || 0) >= 4
    && r.st.uy >= 65
    && !r.flags.mau_inflated
    && trustCount(r) >= 3,
  offer: [
    ['nar', 'Sau review, chị Diệp không đứng dậy. Anh Thạc bước vào, đóng cửa phòng "Bún Bò".'],
    ['thac', 'Anh nói ngắn. Công ty có đúng một headcount Fresher. Một. Của một bạn vừa bị quick sync.'],
    ['diep', 'Chị và anh Thạc đề xuất em. Anh Kevin đồng ý, vì chị gọi nó là "AI-ready talent". Đừng hỏi.'],
    ['thac', 'Mười lăm triệu. Hợp đồng lao động, đóng bảo hiểm 10,5%, có ESOP "sau một năm". Và có tên trong lịch on-call.'],
    { if: (r) => !!r.flags.deploy_rollback, then: [['thac', 'Anh vẫn nhớ 17:31 thứ Sáu hôm đó.']] },
    { if: (r) => !!r.flags.mau_honest, then: [['thac', 'Và hai con số MAU có định nghĩa. Anh cần người như vậy cạnh dashboard.']] },
    ['think', 'Một headcount. Của một người vừa bị cắt. Lời mời này vừa là lời khen, vừa là một lời nhắc.'],
    { c: '_tech_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, rel: { thac: 1, diep: 1 }, set: { accept_official: true } }, then: [
        ['diep', 'Welcome to full-time. Từ thứ Hai em không còn là intern. Nghĩa là không còn ai tha lỗi cho em vì là intern.'],
        ['thac', 'Và nhớ: chính thức ở startup nghĩa là em được cắt cùng đợt với mọi người. Công bằng mà.'],
      ] },
      { t: '"Em xin suy nghĩ thêm ạ."', fx: { set: { accept_official: false } }, then: [
        ['thac', 'Ok. Hiểu. Ở vị trí em, anh cũng suy nghĩ. Anh suy nghĩ ba năm rồi.'],
        ['diep', 'Headcount này sẽ đóng vào thứ Hai. Chị không hỏi lần hai. Không phải vì chị giận. Vì framework không cho.'],
      ] },
    ] },
  ],
};

// ---------------------------------------------------------------- endings
export const ENDINGS = {
  finish: (r) => {
    const diep = (r.rel && r.rel.diep) || 0, thac = (r.rel && r.rel.thac) || 0;
    if (r.flags.accept_official === false) return { title: 'Hết 45 ngày ở Nợ Kỹ Thuật Labs (từ chối lên chính thức)', text: 'Bạn từ chối headcount duy nhất. Hai tuần sau công ty cắt thêm 40%. Anh Thạc nhắn: "Em đúng. Anh mất ba năm để hiểu điều em hiểu trong một tuần."' };
    if (thac >= 5 && diep >= 4) return { title: 'Hết 45 ngày ở Nợ Kỹ Thuật Labs', text: 'Anh Thạc viết thư giới thiệu: "Đọc runbook trước khi cần. Hỏi runway trước mặt CEO. Tuyển ngay." Chị Diệp thêm: "Framework: RICE. Điểm: 10."' };
    if ((r.st && r.st.uy) >= 70) return { title: 'Hết 45 ngày ở Nợ Kỹ Thuật Labs', text: 'Chị Ngân gửi giấy xác nhận thực tập qua email, kèm sticker 💐. Tên bạn đúng chính tả. Lần đầu tiên công ty này làm gì đó đúng ngay lần đầu.' };
    if (r.flags.mau_inflated) return { title: 'Hết 45 ngày ở Nợ Kỹ Thuật Labs', text: 'Giấy xác nhận thực tập về đúng hạn. Một tuần sau, quỹ due diligence gửi email hỏi về "1.000.000 MAU". Người nhận CC: bạn.' };
    return { title: 'Hết 45 ngày ở Nợ Kỹ Thuật Labs', text: 'Giấy xác nhận thực tập ghi: "Hoàn thành tốt nhiệm vụ: Fix everything." Ticket NKT-1337 vẫn In Progress. Nó sẽ sống lâu hơn công ty.' };
  },
  // OFF_FINAL ends with 'quit' when the player resigned first (path_cto / path_tokyo / path_cv), else 'layoff'.
  quit: (r) => {
    const f = (r && r.flags) || {};
    if (f.path_cto) return { title: 'Bạn rời Nợ Kỹ Thuật Labs: theo anh Thạc ra riêng', text: 'Công ty mới có sáu người, một cái router và không có ring light. Lương trả đúng ngày 5. Anh Thạc ngủ đủ tám tiếng. Trang đầu tiên trên wiki: "Rollback".' };
    if (f.path_tokyo) return { title: 'Bạn rời Nợ Kỹ Thuật Labs: "đi đày" Tokyo', text: 'Sáu tháng onsite với Tanaka-san. Họp 30 phút kết thúc ở phút thứ 30. Bạn học được một chữ quý giá: "otsukaresama". Vất vả rồi.' };
    if (f.path_cv && f.cv_sent) return { title: 'Bạn rời Nợ Kỹ Thuật Labs: nhảy việc', text: 'Bạn qua công ty của Tùng. Lương gấp rưỡi, không take-home, không LinkedIn. Trên bàn mới có một sticker: "It works on my machine".' };
    if (f.path_cv) return { title: 'Bạn rời Nợ Kỹ Thuật Labs: nhảy việc', text: 'Bạn nhận offer qua headhunter. Lương trả đúng ngày, không ring light. Ngày đầu, bạn hỏi: "Trang Rollback ở đâu ạ?" Cả team quay lại nhìn bạn, đầy tôn trọng.' };
    return { title: 'Bạn nghỉ việc ở Nợ Kỹ Thuật Labs', text: 'Bạn nộp đơn nghỉ ngay trong buổi quick sync. Chị Thảo vẫn ghi "tái cấu trúc" để bạn đủ quyền lợi. Gia đình thì không trả lương trễ.' };
  },
  layoff: (r) => {
    const f = (r && r.flags) || {};
    if (f.path_ai) return { title: 'Nợ Kỹ Thuật Labs "right-size" lần hai', text: 'Bạn đã xin vào squad AI. Squad AI không cứu được bạn, và một tuần sau chính nó cũng bị cắt. Anh Kevin đăng LinkedIn: "Những quyết định khó khăn nhất làm nên founder." Bạn bấm "unfollow".' };
    return { title: 'Nợ Kỹ Thuật Labs "tái cấu trúc"', text: 'Anh Kevin gọi đây là "right-sizing for the future". Bạn gọi đây là thất nghiệp. Mèo 404 cọ vào chân bạn lần cuối, rồi biến mất. Như mọi khi.' };
  },
};

// ---------------------------------------------------------------- pantry option (max 1)
export const FOOD = [
  { t: 'Uống lon nước tăng lực "free" (+20, tim đập 140)', fx: { nl: 20, dr: 1 }, then: [['nar', 'Lon thứ 3.418 của công ty trong tháng. Bạn bỗng muốn refactor cả hệ thống. Rồi cảm giác đó qua đi sau 40 phút.']] },
];

// ---------------------------------------------------------------- after-work life events (company flavour)
export const LIFE_EVENTS = [
  { id: 'tech_kevin_2314', emoji: '🌙', text: '23:14. Slack: anh Kevin: "em ơi". Rồi im. Mười phút. Hai mươi phút. Không có tin nhắn thứ hai.', choices: [
    { t: 'Trả lời "Dạ anh?"', fx: { nl: -8 }, after: '00:41 anh Kevin trả lời: "à không có gì, anh gửi nhầm". Bạn nằm nhìn trần nhà tới 2 giờ.' },
    { t: 'Tắt thông báo, đi ngủ', fx: { nl: 5, dr: 1 }, after: 'Sáng hôm sau anh Kevin không nhắc lại. Có lẽ "em ơi" chỉ là cách anh ấy nói "chúc ngủ ngon".' },
  ] },
  { id: 'tech_headhunter', emoji: '💼', text: 'Một headhunter nhắn LinkedIn: "Bên em có vị trí Fresher 18 triệu, remote, lương trả đúng ngày. Em quan tâm không?"', choices: [
    { t: 'Trả lời: "Em quan tâm ạ"', fx: { nl: -3, dr: 1 }, after: 'Bạn cập nhật CV tới 1 giờ sáng. Dòng đầu tiên: "Có kinh nghiệm làm việc trong môi trường flat (rất flat)".' },
    { t: 'Để "seen", ngủ', fx: { nl: 5 }, after: 'Bạn ngủ ngon. Trong mơ, ai đó gọi bạn vào "quick sync 15 phút".' },
  ] },
  { id: 'tech_pager_night', emoji: '📟', text: '2:00 sáng. Pager kêu: "Disk 92% · server cũ". Bạn là on-call.', when: (r) => r.status === 'official', choices: [
    { t: 'Dậy xử lý theo runbook', fx: { nl: -15 }, after: '2:26 ổn định. Bạn ghi vào #incident. Anh Thạc thả một ❤️ lúc 2:27. Anh cũng chưa ngủ.' },
    { t: 'Gọi anh Thạc', fx: { nl: -10, dr: 2 }, after: 'Anh Thạc bắt máy sau một hồi chuông. "Em là on-call mà." Rồi anh vẫn dậy làm cùng bạn.' },
  ] },
];

// ---------------------------------------------------------------- hidden ties (2 drawn per run → flags tie_<id>)
export const TIES = [
  { id: 'vy_khai', text: 'Vy thích anh Khải (anh Khải không biết, hoặc it depends)' },
  { id: 'chau_victor', text: 'Châu là cháu ruột anh Victor của quỹ Hạt Giống' },
  { id: 'thao_kevin', text: 'Chị Thảo và anh Kevin là bạn cấp ba, cùng vay tiền nhà mở công ty' },
  { id: 'tung_freelance', text: 'Tùng đang nhận freelance cho một startup đối thủ' },
];
