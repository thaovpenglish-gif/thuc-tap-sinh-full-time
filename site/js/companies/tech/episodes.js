// Nợ Kỹ Thuật Labs — drama days. Day 1 onboarding, intern episodes days 3–38, then the official arc.
// Flags đi xuyên các tập (xem promotion.when trong extras.js): deploy_*, mau_*, oncall_*, exile_*, blame_*, store_*…

const isTier = (...ids) => (s) => ids.includes(s.tier);
const f = (k) => (r) => !!r.flags[k];
const nf = (k) => (r) => !r.flags[k];

export const STANDUP_POS = { diep: 'scrum', khai: 'su1', nguyet: 'su2', tung: 'su3', vy: 'su4', chau: 'su5', duy: 'su6', loc: 'su7' };
export const LUNCH_POS = { tung: 'lunch1', vy: 'lunch2', nguyet: 'lunch3', chau: 'lunch4', hieu: 'lunch5' };
const ALLHANDS_POS = { kevin: 'scrum', thac: 'su1', diep: 'su2', khai: 'su3', nguyet: 'su4', tung: 'su5', vy: 'su6', duy: 'su7', chau: 'su8', ngan: 'su9', thao: 'su10' };

// ---------------------------------------------------------------- mini-games
const STANDUP_MINI = {
  type: 'order', title: 'Daily stand-up', icon: '📌',
  prompt: 'Báo cáo đúng format của chị Diệp: Yesterday → Today → Blocker.', time: 20, pass: 1,
  items: [
    { text: 'Today: em setup máy và đọc code để làm quen.', order: 1 },
    { text: 'Blocker: laptop của em pin còn 40 phút.', order: 2 },
    { text: 'Yesterday (thứ Sáu): em phỏng vấn và ký NDA.', order: 0 },
  ],
};
const CONFLUENCE_MINI = {
  type: 'pick', title: 'Confluence › Onboarding (sửa lần cuối: 2022)', icon: '📚',
  prompt: 'Chọn 3 thông tin CÒN ĐÚNG. Phần còn lại đã lỗi thời từ hai đời CTO.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Trang "Rollback": các bước quay về bản trước trên pipeline.', correct: true },
    { text: 'Không deploy chiều thứ Sáu.', correct: true },
    { text: 'Kênh #incident là nơi báo sự cố production.', correct: true },
    { text: 'Hỏi DevOps anh Phong khi có sự cố.', sub: '(anh Phong nghỉ năm 2023)' },
    { text: 'Team có 12 người, ngồi chung một bàn dài.' },
    { text: 'Lương tháng 13 = 2 tháng lương.', sub: '(đoạn này bị gạch bằng bút đỏ)' },
  ],
};
const TICKET_MINI = {
  type: 'pick', title: 'NKT-1337: "Fix everything before launch"', icon: '🎫',
  prompt: 'Anh Kevin vừa nói 8 thứ. Chọn 4 việc tách được thành ticket làm xong trước launch.', pick: 4, time: 40, pass: 0.75,
  items: [
    { text: 'Sửa crash khi bấm "Thanh toán" bằng ví', correct: true },
    { text: 'Giảm thời gian load trang chủ từ 3 giây', correct: true },
    { text: 'Sửa chính tả nút "Đặt hàg"', correct: true },
    { text: 'Logo to hơn 10%', sub: 'anh Kevin nhắc 3 lần', correct: true },
    { text: 'Làm app "wow" hơn' },
    { text: 'Thêm AI vào mọi màn hình' },
    { text: 'Trở thành siêu app' },
    { text: 'Dark mode toàn hệ thống trong 1 ngày' },
  ],
};
const POKER_MINI = {
  type: 'quiz', title: 'Planning poker', icon: '🃏',
  prompt: 'Đọc ticket, đọc mặt anh Khải, rồi giơ bài.', time: 35, pass: 0.66,
  questions: [
    { q: 'Đổi màu nút "Đặt hàng". Không đụng logic.', options: ['1', '8', '13'], correct: 0 },
    { q: 'Thanh toán trả góp qua ví. Chưa có đối tác ngân hàng.', options: ['3', '5', '"?" — cần spike tìm hiểu trước'], correct: 2 },
    { q: 'AI gợi ý thực đơn. Anh Kevin: "chừng hai tiếng".', options: ['2 (theo anh Kevin)', '13: phải tách nhỏ trước, chưa estimate chắc được', '1, vì anh Kevin nhìn'], correct: 1 },
  ],
};
const BUGREPORT_MINI = {
  type: 'order', title: 'Viết bug report (để không bị "Cannot reproduce")', icon: '🐞',
  prompt: 'Sắp xếp bug report theo format của chị Nguyệt.', time: 30, pass: 0.8,
  items: [
    { text: 'Tiêu đề: Crash khi bấm "Thanh toán" bằng ví', order: 0 },
    { text: 'Thiết bị: Android 9, máy test số 5 (vỏ hồng)', order: 1 },
    { text: 'Các bước: mở giỏ › chọn ví › bấm Thanh toán', order: 2 },
    { text: 'Mong đợi: hiện màn xác nhận', order: 3 },
    { text: 'Thực tế: app tắt, về màn hình chính + video + log', order: 4 },
  ],
};
const ROLLBACK_MINI = {
  type: 'order', title: 'Confluence › Rollback (2022, vẫn đúng)', icon: '⏪',
  prompt: 'App đang lỗi thanh toán. Làm đúng thứ tự, nhanh.', time: 25, pass: 0.8,
  items: [
    { text: 'Báo trên #incident: "Em đang rollback bản 17:02"', order: 0 },
    { text: 'Mở pipeline, chọn bản ổn định trước đó', order: 1 },
    { text: 'Bấm "Redeploy" bản cũ', order: 2 },
    { text: 'Kiểm tra lại thanh toán trên máy test', order: 3 },
    { text: 'Cập nhật #incident: "Đã rollback, đang theo dõi"', order: 4 },
  ],
};
const MAU_MINI = {
  type: 'pick', title: 'SQL: ai là "người dùng hoạt động tháng"?', icon: '📊',
  prompt: 'Theo định nghĩa chuẩn của team Data, chọn 3 nhóm được tính là MAU.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Người đặt ít nhất 1 đơn trong 30 ngày', correct: true },
    { text: 'Người nạp tiền hoặc thanh toán bằng ví', correct: true },
    { text: 'Người mở app và thao tác (xem hàng, thêm giỏ)', correct: true },
    { text: 'Người chỉ nhận push notification', sub: 'anh Kevin muốn tính' },
    { text: 'Người đã gỡ app nhưng còn trong danh sách email' },
    { text: 'Tài khoản test của team QA', sub: '7 điện thoại × 40 tài khoản' },
  ],
};
const UIBUG_MINI = {
  type: 'order', title: 'Checklist UI bug (có ưu tiên)', icon: '📐',
  prompt: 'Xếp theo luật chị Diệp: chặn thanh toán > sai thông tin > sai màu thương hiệu > lệch pixel > trang trí.', time: 30, pass: 0.75,
  items: [
    { text: 'Nút "Thanh toán" bị che trên màn nhỏ', order: 0 },
    { text: 'Sai màu nút chính (#FF6B6C thay vì #FF6B6B)', order: 2 },
    { text: 'Giá tiền bị cắt chữ khi trên 1 triệu', order: 1 },
    { text: 'Lệch 4px ở icon giỏ hàng', order: 3 },
    { text: 'Animation confetti khi đặt hàng', order: 4 },
  ],
};
const LOG_MINI = {
  type: 'quiz', title: '2:09 sáng · đọc log server ví', icon: '📟',
  prompt: 'Mắt mở được 40%. Đọc log, đừng gõ bừa.', time: 30, pass: 0.66,
  questions: [
    { q: '"/var/log/wallet: 41GB · disk 98%". Thủ phạm là gì?', options: ['Log cũ không được dọn', 'Người dùng tăng đột biến', 'Con mèo 404'], correct: 0 },
    { q: 'Runbook bảo xóa gì?', options: ['Log cũ hơn 7 ngày, đã nén', 'Cả thư mục /var', 'Database cho nhẹ'], correct: 0 },
    { q: 'Xong rồi thì làm gì?', options: ['Đi ngủ, sáng tính', 'Báo #incident: đã làm gì, lúc nào', 'Xóa luôn tin nhắn cho đỡ bị hỏi'], correct: 1 },
  ],
};
const HACK_MINI = {
  type: 'pick', title: 'Lúa Hack 24h · MVP "Giỏ Chung"', icon: '🧺',
  prompt: 'Giỏ đi chợ chung cho cả nhà. 24 tiếng. Chọn 3 tính năng làm được và đáng làm.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Mời người nhà vào chung một giỏ bằng link', correct: true },
    { text: 'Mỗi người thêm món, thấy ai thêm gì', correct: true },
    { text: 'Một người bấm thanh toán cho cả giỏ', correct: true },
    { text: 'AI đoán mẹ bạn muốn mua gì', sub: 'Châu đề xuất' },
    { text: 'Blockchain hóa danh sách đi chợ' },
    { text: 'Dark mode + 3D giỏ hàng xoay được' },
  ],
};

// ---------------------------------------------------------------- Day 1
const ONBOARDING = {
  id: 'onboarding', day: 1, title: 'Onboarding (Confluence 2022)',
  intro: 'Thứ Hai, 8:30. Ngày đầu tiên ở Nợ Kỹ Thuật Labs.\n\nTrong túi bạn có: một bản NDA, một sticker "Flat. Fast. Fun." từ buổi phỏng vấn, và lời dặn của Tùng: "Không deploy chiều thứ Sáu."\n\nNgoài việc chính, các anh chị sẽ nhờ bạn vài việc vặt. Xem danh sách ở góc màn hình, làm kịp giờ thì được ghi nhận.',
  steps: [
    {
      who: 'hoa', obj: 'Tới lễ tân nhận thẻ và chỗ ngồi', time: '08:30',
      scene: [
        ['hoa', 'Em đi làm rồi hả! Thẻ của em đây. In tên người khác nhưng quẹt vẫn được. Mình là startup mà em.'],
        ['hoa', 'Bàn em cạnh Tùng. Trước là bàn bạn intern kỳ trước. Bạn ấy để lại cái sticker "It works on my machine".'],
        { c: 'tech_d1_seat', o: [
          { t: '"Dạ em cảm ơn chị. Bạn intern kỳ trước giờ ở đâu ạ?"', fx: { rel: { hoa: 1 } }, then: [
            ['hoa', 'Lên chính thức. Rồi bị quick sync. Rồi qua công ty đối thủ, lương gấp đôi. Ai cũng mừng cho bạn ấy.'],
            ['think', 'Một vòng đời startup trong ba câu.'],
          ] },
          { t: 'Xin chị Hoa cái ghế có lưng tựa.', fx: { nl: 3, rel: { hoa: 2 } }, then: [
            ['hoa', 'Ghế có lưng tựa là đặc quyền senior. Thôi, chị lấy ghế của phòng họp "Phở" cho em. Đừng nói ai.'],
          ] },
        ] },
      ],
    },
    {
      who: 'loc', obj: 'Qua góc IT nhận laptop từ anh Lộc (DevOps)', time: '08:45',
      scene: [
        ['loc', '👋'],
        ['nar', 'Anh Lộc đưa bạn một chiếc MacBook đời 2019, dán sticker "PROPERTY OF NỢ KỸ THUẬT". Pin: 40 phút.'],
        ['loc', '🔋❌ · 🔌✅'],
        { c: 'tech_d1_laptop', o: [
          { t: '"Dạ, ý anh là pin yếu, nhớ cắm sạc ạ?"', fx: { uy: 1, rel: { loc: 2 } }, then: [
            ['loc', '👍'],
            ['nar', 'Anh Lộc gật đầu như vừa gặp người hiểu tiếng mẹ đẻ của mình.'],
          ] },
          { t: '"Anh nói bằng chữ được không ạ?"', fx: { dr: 1, rel: { loc: -1 } }, then: [
            ['nar', 'Anh Lộc gõ rất lâu. Rất, rất lâu. Rồi gửi qua Slack một chữ: "sạc".'],
          ] },
          { t: 'Nhìn qua Tùng cầu cứu.', fx: { rel: { tung: 1 } }, then: [
            ['tung', 'Anh Lộc nói: pin hỏng, cắm sạc. Anh ấy là DevOps duy nhất, mỗi chữ của ảnh là một tài nguyên hữu hạn.'],
          ] },
        ] },
        { if: isTier('t5'), then: [['loc', '🆕💻 ➡️ 📅 tuần sau'], ['think', 'Laptop mới "tuần sau". Ở startup, tuần sau là một khái niệm tâm linh.']] },
      ],
    },
    {
      who: 'diep', obj: '9:30 Daily stand-up ở bảng Scrum', time: '09:30', pos: STANDUP_POS,
      scene: [
        ['diep', 'Ok team, daily! Mười lăm phút. Yesterday, Today, Blocker. Hôm nay có bạn intern mới, welcome {ten}!'],
        ['khai', 'Yesterday: fix bug. Today: fix bug do bug hôm qua. Blocker: không.'],
        ['tung', 'Yesterday: build trên máy em chạy được. Today: tìm hiểu vì sao trên máy người khác không chạy.'],
        ['nar', 'Anh Kevin đi ngang qua, dừng lại "chỉ nghe thôi". Hai mươi phút sau, anh vẫn đang nói về AI.'],
        ['diep', 'Cảm ơn anh Kevin, mình đưa ý này vào parking lot nha. {ten}, your turn!'],
        { mini: STANDUP_MINI,
          good: [['diep', 'Chuẩn format. Ngắn. Có blocker rõ ràng. Mọi người học bạn intern nha.'], ['nguyet', '(nhỏ) Blocker pin 40 phút. Chị có sạc dự phòng.'], { fx: { uy: 3, rel: { diep: 2, nguyet: 1 } } }],
          bad: [['nar', 'Bạn nói Blocker trước Yesterday. Chị Diệp nhíu mày như vừa thấy một user story không có acceptance criteria.'], ['diep', 'Không sao. Format là văn hóa. Mai mình làm lại nha.'], { fx: { rel: { diep: -1 } } }],
        },
        ['nar', 'Daily "mười lăm phút" kết thúc lúc 10:17. Chị Diệp ghi lên bảng: "Timebox: cần cải thiện".'],
      ],
    },
    {
      who: 'khai', obj: 'Gặp mentor: anh Khải (Tech Lead)', time: '10:30',
      scene: [
        ['khai', 'Anh là mentor của em. Tuần đầu em đọc code để làm quen. Có câu hỏi thì hỏi.'],
        ['me', 'Dạ, có tài liệu kiến trúc hệ thống không anh?'],
        ['khai', 'It depends. Có một trang Confluence. Viết năm 2022. Một nửa đúng. Em tự đoán nửa nào.'],
        { mini: CONFLUENCE_MINI,
          good: [['khai', 'Em lọc ra được mấy cái còn sống. Trang Rollback là trang anh viết lúc 3 giờ sáng. Nó chưa bao giờ sai.'], { fx: { uy: 2, rel: { khai: 2 }, set: { read_runbook: true } } }],
          bad: [['khai', 'Anh Phong nghỉ năm 2023 rồi em. Lương tháng 13 cũng nghỉ cùng năm đó.'], { fx: { nl: -3 } }],
        },
        { c: 'tech_d1_mentor', o: [
          { t: '"Em đọc kỹ trang Rollback trước ạ."', fx: { uy: 1, rel: { khai: 1 }, set: { read_runbook: true } }, then: [
            ['khai', 'Đọc trang Rollback trước khi đọc trang Feature. Em sẽ sống lâu ở đây.'],
          ] },
          { t: '"Anh có thể review code em mỗi ngày không ạ?"', fx: { rel: { khai: 1 }, set: { asked_mentor: true } }, then: [
            ['khai', 'Mỗi ngày thì… it depends. Thứ Năm. Thứ Năm nào anh không bị incident.'],
            ['think', 'Tức là không có thứ Năm nào.'],
          ] },
        ] },
      ],
    },
    {
      who: 'tung', obj: 'Giờ trưa! Ra pantry ăn với cả nhóm', time: '12:00', pos: LUNCH_POS,
      scene: [
        ['tung', 'Ngồi đây. Cơm văn phòng 35 nghìn, nước tăng lực free. Chế độ dinh dưỡng của dev Việt Nam.'],
        ['vy', 'Chào bạn. Mình là Vy, Design. Bạn thấy logo app Lúa có bị lệch không? Lệch 2px đó. Không ai tin mình.'],
        ['chau', 'Hi, mình là Châu, intern PM. Mình nghĩ mình nên làm AI. Bạn nghĩ sao?'],
        ['hieu', 'Anh là Hiếu, BrSE dự án Nhật. Nếu tuần sau em thấy anh khóc thì là do Q&A list, không phải do cơm.'],
        ['nguyet', 'Còn chị là Nguyệt, QA. Em có bug nào cứ báo chị. Dev bảo "không phải bug" thì càng phải báo.'],
        ['nar', 'Một con mèo xám nhảy lên bàn, nằm đè lên bàn phím laptop của Tùng.'],
        ['tung', 'Mèo 404. Cần thì không thấy. Không cần thì nó commit hộ anh.'],
        { c: 'tech_d1_lunch', o: [
          { t: 'Hỏi Vy về vụ lệch 2px.', fx: { rel: { vy: 2 } }, then: [
            ['vy', 'Thật hả? Bạn hỏi thật hả? Để mình mở Figma cho bạn xem. Ba mươi phút thôi.'],
            ['think', 'Mình vừa có một người bạn. Và mất ba mươi phút.'],
          ] },
          { t: 'Hỏi Châu vì sao muốn làm AI.', fx: { rel: { chau: 2 } }, then: [
            ['chau', 'Chú mình làm ở quỹ, chú bảo AI là tương lai. Mà nói nhỏ thôi, mọi người hay nghĩ mình vào đây nhờ chú.'],
            ['think', 'Câu "nói nhỏ thôi" được nói khá to.'],
          ] },
          { t: 'Hỏi chị Nguyệt mẹo sống sót.', fx: { rel: { nguyet: 2 }, set: { nguyet_tips: true } }, then: [
            ['nguyet', 'Bug thì luôn quay video. Dev không cãi được video. Họ chỉ cãi được lời nói.'],
          ] },
        ] },
        { fx: { nl: 25 } },
        ['nar', 'Ba mươi phút yên bình. Rồi Slack kêu: "@channel anh có ý tưởng nhỏ". Là anh Kevin.'],
      ],
    },
    {
      who: 'kevin', obj: 'Anh Kevin vẫy tay gọi: "ý tưởng nhỏ"', time: '14:30',
      scene: [
        ['kevin', 'Hey intern mới! Anh có một ý tưởng nhỏ. AI gợi ý thực đơn cho cả nhà. Anh nghĩ đơn giản thôi, chừng hai tiếng.'],
        ['kevin', 'Em note lại giúp anh. Sprint này làm luôn được không?'],
        ['think', 'Sprint này đã chốt từ tuần trước. Chị Diệp đã nói "chốt" ba lần.'],
        { c: 'tech_d1_idea', o: [
          { t: '"Dạ em note vào backlog và tag chị Diệp để đánh giá ở planning sau ạ."', fx: { uy: 3, rel: { diep: 2, kevin: 1 }, set: { idea_backlog: true } }, then: [
            ['kevin', 'Backlog! Chuyên nghiệp. Ok. Mà nhớ là ưu tiên cao nha.'],
            { chat: [['diep', '❤️ cảm ơn em đã không hứa gì với anh Kevin', true]] },
          ] },
          { t: '"Dạ được ạ! Em làm luôn!"', fx: { rel: { kevin: 2, diep: -1 }, nl: -5, set: { idea_yes: true } }, then: [
            ['kevin', 'Love the energy! Anh tạo ticket cho em nhé.'],
            ['diep', '(từ xa) …Ai vừa nhận việc ngoài sprint vậy?'],
          ] },
          { t: '"Anh cho em xin mô tả cụ thể hơn được không ạ?"', fx: { uy: 1, rel: { kevin: -1 } }, then: [
            ['kevin', 'Cụ thể là… AI. Gợi ý. Thực đơn. Wow. Em tự nghĩ thêm đi, intern là để nghĩ.'],
          ] },
        ] },
        ['nar', 'Anh Kevin rời đi, vừa đi vừa quay story: "Day 1 của bạn intern mới. Culture is everything."'],
      ],
    },
    {
      who: 'obj:desk', obj: '17:45 Về bàn: ở lại hay về đúng giờ?', time: '17:45',
      scene: [
        ['nar', '17:45. Nửa văn phòng vẫn sáng màn hình. Tùng đang "merge xong đã". Anh Thạc chưa từng đứng dậy từ sáng.'],
        { if: isTier('t5'), then: [{ chat: [['kevin', 'em ơi', true]] }, ['think', 'Hai chữ. Không có gì theo sau. Đáng sợ hơn mọi email.']] },
        { if: f('nda_blind'), then: [['think', 'NDA có dòng "on-call tự nguyện 24/7". Mình đã ký mà không hỏi.']] },
        { c: 'tech_d1_ot', o: [
          { t: 'Ở lại đọc code cùng mọi người.', fx: { nl: -15, rel: { tung: 1, khai: 1 } }, then: [
            { if: isTier('t3', 't5'), then: [{ fx: { uy: 4 } }] },
            ['tung', 'Gọi trà sữa không? Anh Kevin bao. Ảnh không biết, nhưng ảnh bao.'],
            ['nar', '20:30 cả nhóm ra về. Anh Thạc vẫn ngồi đó.'],
          ] },
          { t: 'Về đúng giờ. Ngày mai còn dài.', fx: { nl: 20 }, then: [
            { if: isTier('t5'), then: [{ fx: { dr: 5, uy: -2 } }, { chat: [['kevin', 'ơ về rồi à 😅', true]] }] },
            { if: isTier('t0', 't1'), then: [['nguyet', 'Về đi em. Intern về đúng giờ là quyền. Bug vẫn sẽ ở đây sáng mai.']] },
          ] },
        ] },
      ],
    },
  ],
  diary: (s) => {
    const b = [];
    b.push(s.flags.read_runbook ? 'Mình đã đọc trang Rollback. Anh Khải bảo nó chưa bao giờ sai.' : 'Confluence viết năm 2022. Mình chưa biết nửa nào còn đúng.');
    if (s.flags.idea_backlog) b.push('Ý tưởng "hai tiếng" của anh Kevin nằm yên trong backlog.');
    if (s.flags.idea_yes) b.push('Mình nhận làm AI gợi ý thực đơn. Hai tiếng. Chắc vậy.');
    return `Ngày 1. ${b.join(' ')} Stand-up mười lăm phút kéo dài bốn mươi bảy phút. Anh Lộc nói chuyện với mình hoàn toàn bằng emoji.`;
  },
};

// ---------------------------------------------------------------- intern episodes (part 1)
const FIX_EVERYTHING = {
  id: 'fix_everything', day: 3, title: 'Ticket ma: "Fix everything"',
  intro: 'Thứ Tư. Jira gửi bạn một thông báo lúc 7:02 sáng.\n\nAnh Kevin vừa gán cho bạn ticket NKT-1337: "Fix everything before launch". Priority: Highest. Mô tả: (trống). Deadline: hôm qua.',
  chatStart: [['kevin', 'em xem ticket chưa 🚀', true]],
  steps: [
    {
      who: 'obj:desk', obj: 'Mở Jira xem ticket NKT-1337', time: '09:00',
      scene: [
        ['nar', 'NKT-1337. "Fix everything before launch." Assignee: bạn. Reporter: Kevin. Story point: (trống). Mô tả: (trống).'],
        ['nar', 'Có một comment duy nhất, cũng của anh Kevin: "🔥🔥🔥".'],
        ['tung', '(ngó qua) Ồ, ticket ma. Năm ngoái anh cũng bị một cái "Make it better". Nó vẫn đang In Progress.'],
        { c: 'tech_fix_start', o: [
          { t: 'Qua hỏi thẳng anh Kevin.', fx: { uy: 1 }, then: [['think', 'Hỏi người tạo ticket. Đơn giản. Chắc vậy.']] },
          { t: 'Hỏi Tùng nên làm gì với ticket ma.', fx: { rel: { tung: 1 } }, then: [
            ['tung', 'Hỏi anh Kevin cho có, rồi tách nhỏ, rồi đưa chị Diệp. Hoặc để đó, bot dọn backlog sẽ tự đóng sau 14 ngày.'],
          ] },
        ] },
      ],
    },
    {
      who: 'kevin', obj: 'Hỏi anh Kevin "everything" là gì', time: '09:45',
      scene: [
        ['kevin', 'Everything là everything em ạ! App chậm. Logo nhỏ. Nút đặt hàng chưa "wow". Dark mode. Và AI.'],
        ['kevin', 'Thanh toán bằng ví thỉnh thoảng crash. Chữ "Đặt hàg" thiếu chữ n. Và mình phải trở thành siêu app. Làm hết nha.'],
        ['think', 'Tám việc. Ba việc là việc thật. Một việc là tầm nhìn. Một việc là chính tả.'],
        { mini: TICKET_MINI,
          good: [['think', 'Mấy ticket làm được trước launch. Phần còn lại là… cảm xúc của anh Kevin.'], { fx: { uy: 3, set: { ticket_clear: true } } }],
          bad: [['think', 'Mình ghi "Làm app wow hơn" vào ticket. Không ai biết "wow" estimate bao nhiêu point.'], { fx: { nl: -4 } }],
        },
      ],
    },
    {
      who: 'diep', obj: 'Mang ticket ma đến chị Diệp (PM)', time: '11:00',
      scene: [
        ['diep', 'NKT-1337 hả. Chị thấy rồi. Chị đã quyết định không nhìn thấy nó.'],
        ['diep', 'Em định làm gì với nó? Chị muốn nghe framework của em.'],
        { c: 'tech_fix_plan', o: [
          { t: 'Tách thành các ticket nhỏ có tiêu chí "xong", xin chị duyệt theo MoSCoW.', fx: { uy: 4, nl: -4, rel: { diep: 3 }, set: { ticket_split: true } }, then: [
            ['diep', 'MoSCoW! Must: crash ví, load trang chủ. Should: chính tả. Could: logo. Won\'t: siêu app. Em làm chị xúc động.'],
            ['nar', 'Chị Diệp chụp màn hình gửi vào group PM với caption "intern này hiểu chuyện".'],
          ] },
          { t: 'Để đó. Bot sẽ tự đóng sau 14 ngày.', fx: { dr: 2, rel: { diep: -1 }, set: { ticket_ghost: true } }, then: [
            ['diep', 'Chiến lược "chờ bot". Cũng là một framework. Nhưng nếu crash ví xảy ra trên prod thì em là assignee đó.'],
            ['think', 'Assignee. Một chữ mà nặng như một cái tên trên bia.'],
          ] },
          { t: 'Nhờ chị Diệp nói chuyện với anh Kevin giúp.', fx: { rel: { diep: 1 }, nl: -2 }, then: [
            ['diep', 'Chị sẽ "align" với anh Kevin. Lần thứ 41 trong quý. Nhưng em tự viết mô tả ticket trước nha.'],
          ] },
        ] },
      ],
    },
    {
      who: 'nguyet', obj: 'Chị Nguyệt (QA) hỏi test case cho "everything"', time: '14:00',
      scene: [
        ['nguyet', 'Em ơi, chị phải viết test case cho NKT-1337. Test case cho "everything" là gì? Test mọi thứ hả?'],
        { if: f('ticket_split'), then: [
          ['me', 'Em tách ra rồi chị. Có tiêu chí "xong" cho từng cái.'],
          ['nguyet', 'Trời ơi. Acceptance criteria. Lần đầu chị thấy intern viết. Chị in ra dán bàn.'],
          { fx: { rel: { nguyet: 2 }, uy: 1 } },
        ], else: [
          ['nguyet', 'Thôi chị ghi test case: "Mở app. Thấy mọi thứ đã được fix. Pass." Giống mọi khi.'],
          ['think', 'Mình không chắc đó là đùa.'],
        ] },
        ['nguyet', 'Mà em nhớ, crash ví là có thật. Chị gặp ba lần trên máy test số 5. Dev bảo "không phải bug".'],
        { fx: { set: { know_crash: true } } },
      ],
    },
    {
      who: 'call:kevin', obj: 'Anh Kevin đang gọi! (nghe máy)', time: '16:30',
      call: { title: 'Kevin <> Intern · "quick call 2 phút"', people: ['kevin', 'diep', 'me'] },
      scene: [
        { if: f('ticket_split'), then: [
          ['kevin', 'Sao ticket của anh thành 5 ticket vậy em? Anh giao một việc thôi mà.'],
          { c: 'tech_fix_kevin', o: [
            { t: '"Dạ để đo được tiến độ ạ. Anh sẽ thấy cái nào xong trước launch."', fx: { uy: 2, rel: { kevin: 1 } }, then: [
              ['kevin', 'Đo được tiến độ. Hmm. Anh thích chữ "đo được". Nghe như số liệu cho nhà đầu tư.'],
              ['diep', 'Dạ đúng rồi anh. Mình gọi là "investor-ready roadmap".'],
              ['think', 'Chị Diệp vừa dịch một quy trình bình thường sang tiếng Kevin. Đỉnh cao.'],
            ] },
            { t: '"Dạ em xin lỗi, em gộp lại ạ."', fx: { rel: { diep: -2, kevin: 1 } }, then: [
              ['diep', '(tắt mic, rồi bật lại) …Ok. Mình gộp. Cảm ơn em.'],
            ] },
          ] },
        ], else: [
          ['kevin', 'Ticket NKT-1337 sao chưa thấy cập nhật gì em? Launch cận rồi.'],
          { c: 'tech_fix_kevin2', o: [
            { t: '"Dạ em đang tách nhỏ, mai em gửi chị Diệp duyệt ạ."', fx: { uy: 1, nl: -3, set: { ticket_split: true } }, then: [['kevin', 'Ok. Nhanh nha. Startup là tốc độ.']] },
            { t: '"Dạ em đang fix everything ạ."', fx: { dr: 2 }, then: [['kevin', 'Love it! Fix everything! Anh sẽ đăng LinkedIn câu này.'], ['diep', '(tắt mic) …']] },
          ] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.ticket_split ? 'Ticket "Fix everything" thành 5 ticket có tiêu chí xong. Chị Diệp gọi mình là "intern hiểu chuyện". Mình hiểu chuyện, nhưng chưa hiểu anh Kevin.'
    : 'Ticket "Fix everything" vẫn nằm đó, assignee là mình. Chị Nguyệt nói crash ví là có thật. Hơi lo.',
};

const PLANNING_POKER = {
  id: 'planning_poker', day: 8, title: 'Sprint Planning & poker',
  intro: 'Thứ Hai. Sprint mới. Sprint Planning dự kiến 2 tiếng, trong phòng "Bún Bò", máy lạnh hỏng.\n\nTrên bàn có một bộ bài planning poker. Lá "13" bị mòn nhất. Lá "?" còn mới tinh.',
  steps: [
    {
      who: 'diep', obj: '9:30 Sprint Planning ở phòng họp', time: '09:30', pos: { diep: 'meeting_head', khai: 'mr_n1', tung: 'mr_n2' },
      scene: [
        ['diep', 'Ok team. Capacity sprint này là 40 point. Mình kéo vào 52 point. Như mọi khi, mình commit 130%.'],
        ['khai', 'It depends.'],
        ['diep', 'Mình poker từng ticket. {ten}, em ngồi đây, giơ bài cùng mọi người nha. Không ai cười đâu.'],
        { mini: POKER_MINI,
          good: [['khai', 'Em dám giơ "?" và "13" khi chưa biết. Không biết thì nói không biết. Đa số senior không dám.'], { fx: { uy: 3, rel: { khai: 2 } } }],
          bad: [['nar', 'Bài của bạn lệch cả bàn. Cả phòng nhìn bạn như nhìn một người vừa hứa hộ cả team.'], { fx: { dr: 2, rel: { tung: -1 } } }],
        },
        ['nar', 'Cửa mở. Anh Kevin bước vào, tay cầm ly cà phê cold brew.'],
        ['kevin', 'AI gợi ý thực đơn ai giơ 13 vậy? Hai tiếng thôi mà. Mình là startup, mình phải nhanh!'],
        { c: 'tech_poker', o: [
          { t: 'Bênh lá 13, giải thích: chưa có dữ liệu, chưa có thiết kế.', fx: { uy: 4, rel: { kevin: -1, khai: 2, diep: 1 }, set: { poker_honest: true } }, then: [
            ['kevin', 'Hmm. Em nói như CTO vậy. Ok, để anh nghĩ.'],
            ['khai', '(gõ vào Slack riêng cho bạn) cảm ơn.'],
          ] },
          { t: 'Hạ xuống 3 cho anh Kevin vui.', fx: { rel: { kevin: 2, khai: -2, tung: -1 }, dr: 2, set: { poker_follow: true } }, then: [
            ['kevin', 'Thấy chưa! 3 point. Intern hiểu tốc độ startup hơn cả team.'],
            ['tung', '(thì thầm) 3 point đó là của em. Em làm nha.'],
          ] },
          { t: 'Đề xuất một ticket "spike" 2 ngày tìm hiểu trước.', fx: { uy: 5, nl: -3, rel: { diep: 2, kevin: 1 }, set: { poker_spike: true } }, then: [
            ['diep', 'Spike! Time-box hai ngày, có kết luận. Chị yêu framework này.'],
            ['kevin', 'Spike nghe hay đó. Nghe như tên một con chó. Ok, làm đi.'],
          ] },
        ] },
        ['nar', 'Sprint Planning "2 tiếng" kết thúc lúc 12:40. Máy lạnh vẫn hỏng. Mọi người ra khỏi phòng như vừa xông hơi.'],
      ],
    },
    {
      who: 'khai', obj: 'Anh Khải gọi lại bàn', time: '13:45',
      scene: [
        ['khai', 'Em biết vì sao lá "?" còn mới không? Vì ở đây không ai dám nói "không biết" trước mặt anh Kevin.'],
        { if: f('poker_follow'), then: [
          ['khai', 'Em hạ xuống 3. Anh hiểu. Nhưng ba tuần nữa, khi ticket đó trễ, người ta sẽ nhớ con số 3, không nhớ ai ép.'],
          { fx: { rel: { khai: -1 } } },
        ], else: [
          ['khai', 'Hôm nay em nói "không biết" đúng lúc. Anh ghi nhận. Thứ Năm anh review code cho em. Nếu không có incident.'],
          { fx: { rel: { khai: 1 }, set: { khai_review: true } } },
        ] },
        { c: 'tech_khai_q', o: [
          { t: '"Anh làm ở đây từ hồi nào ạ?"', fx: { rel: { khai: 2 } }, then: [
            ['khai', 'Từ hồi công ty có bốn người và một cái router. Bảy mươi phần trăm code là anh viết. Không có docs. Hồi đó chỉ có anh đọc.'],
            ['think', 'Lần đầu anh Khải nói một câu dài hơn "it depends".'],
          ] },
          { t: '"Có cách nào estimate chuẩn hơn không anh?"', fx: { uy: 2 }, then: [['khai', 'Có. Nhân ba. Rồi đừng nói cho anh Kevin.']] },
        ] },
      ],
    },
    {
      who: 'tung', obj: 'Tùng ngoắc bạn qua bàn', time: '15:00',
      scene: [
        ['tung', 'Sprint này anh ôm 18 point. Với cái app freelance bên ngoài nữa là… à quên, em không nghe gì nha.'],
        { c: 'tech_tung_side', o: [
          { t: '"Em không nghe gì hết ạ."', fx: { rel: { tung: 2 }, set: { tung_secret: true } }, then: [
            ['tung', 'Ngoan. Ở startup ai cũng có một kế hoạch B. Anh Kevin có ba, tên là Series B, C và D.'],
          ] },
          { t: '"Anh làm hai nơi có ổn không?"', fx: { rel: { tung: 1 }, uy: 1 }, then: [
            ['tung', 'Ổn. Lương ở đây trễ hai lần năm ngoái. Anh học được là không nên để hết trứng vào một giỏ. Kể cả giỏ Lúa.'],
          ] },
        ] },
      ],
    },
    {
      who: 'vy', obj: 'Vy có vẻ đang giận', time: '16:00',
      scene: [
        ['vy', 'Chị Diệp vừa xếp animation của mình vào "Won\'t have". Lần thứ năm. Animation là cảm xúc của người dùng mà.'],
        { c: 'tech_vy_anim', o: [
          { t: 'Gợi ý Vy làm bản animation nhẹ, đo được, đưa lại vào "Could have".', fx: { uy: 2, rel: { vy: 2, diep: 1 } }, then: [
            ['vy', 'Animation… có số liệu? Nghe phản nghệ thuật. Nhưng chắc chị Diệp chịu. Ok, mình thử.'],
          ] },
          { t: 'Đồng ý với Vy: PM không hiểu cảm xúc.', fx: { rel: { vy: 3, diep: -1 }, dr: 2 }, then: [
            ['vy', 'Đúng không! Cuối cùng cũng có người hiểu. Bạn là đồng minh của mình.'],
            ['think', 'Mình vừa gia nhập một cuộc chiến mà mình không biết ai đang thắng.'],
          ] },
        ] },
      ],
    },
  ],
  diary: (s) => `Sprint Planning hai tiếng thành ba tiếng mười phút. ${s.flags.poker_honest ? 'Mình bênh lá 13 trước mặt anh Kevin. Anh Khải nhắn "cảm ơn".' : s.flags.poker_spike ? 'Mình đề xuất "spike". Anh Kevin nghĩ đó là tên một con chó.' : 'Mình hạ xuống 3 point. Tùng nhìn mình hơi lâu.'} Lá "?" vẫn còn mới tinh.`,
};

const CANNOT_REPRO = {
  id: 'cannot_repro', day: 10, title: '"Cannot reproduce"',
  intro: 'Thứ Tư. Tuần này bạn được luân chuyển sang QA với chị Nguyệt.\n\nTrên bàn chị có bảy chiếc điện thoại test. Ba cái hết pin. Một cái vỏ hồng, màn nứt, chạy Android 9. Chị gọi nó là "máy số 5 huyền thoại".',
  steps: [
    {
      who: 'nguyet', obj: 'Qua bàn chị Nguyệt nhận việc QA', time: '09:00',
      scene: [
        ['nguyet', 'Hôm nay em chạy regression cho bản release thứ Năm. 140 test case. Chị tin em.'],
        ['nar', 'Test case thứ 37. Máy số 5. Bạn chọn ví, bấm "Thanh toán". App tắt cái phụt, về màn hình chính.'],
        ['nguyet', 'Đó. Máy số 5. Lần thứ tư. Dev đóng ticket "Cannot reproduce" ba lần rồi.'],
        { if: f('know_crash'), then: [['think', 'Đúng cái crash ví chị Nguyệt nói hôm trước. Nó có thật.']] },
        { c: 'tech_qa_start', o: [
          { t: 'Thử lại 5 lần, ghi lại chính xác các bước.', fx: { uy: 2, nl: -4, rel: { nguyet: 2 } }, then: [['nar', 'Năm trên năm lần crash. Bug này không trốn. Nó chỉ chờ người đủ kiên nhẫn.']] },
          { t: 'Hỏi chị Nguyệt vì sao dev không tin.', fx: { rel: { nguyet: 1 } }, then: [
            ['nguyet', 'Vì máy dev là máy mới. Trên máy mới thì cái gì cũng chạy. Cuộc đời cũng vậy.'],
          ] },
        ] },
      ],
    },
    {
      who: 'obj:desk', obj: 'Về bàn viết bug report thật chuẩn', time: '10:30',
      scene: [
        ['nar', 'Bạn mở Jira. Ticket cũ NKT-882 đã bị đóng ba lần. Comment cuối của Tùng: "Cannot reproduce. Trên máy em chạy được."'],
        { mini: BUGREPORT_MINI,
          good: [['nguyet', '(đọc qua vai bạn) Có thiết bị, có bước, có video, có log. Ticket này không ai đóng được nữa.'], { fx: { uy: 3, rel: { nguyet: 2 }, set: { bug_report_ok: true } } }],
          bad: [['nguyet', 'Lộn thứ tự rồi em. Report mà đọc không ra thiết bị với các bước là Tùng thử trên iPhone rồi đóng tiếp.'], { fx: { nl: -3 } }],
        },
      ],
    },
    {
      who: 'tung', obj: 'Tùng vừa đóng ticket lần thứ tư', time: '13:30',
      scene: [
        ['tung', 'Ê, ticket crash ví hả? Anh vừa đóng. Cannot reproduce. Máy anh chạy ngon.'],
        ['think', 'Lần thứ tư. Mình mới mở nó lúc 10:45.'],
        { c: 'tech_repro', o: [
          { t: 'Mang máy số 5 đến tận bàn Tùng, mở video và log.', fx: { uy: 4, rel: { tung: -1, nguyet: 1 }, set: { crash_proved: true } }, then: [
            ['nar', 'Bạn bấm "Thanh toán". App tắt. Tùng nhìn màn hình rất lâu.'],
            ['tung', '…Android 9. Ai còn xài Android 9?'],
            ['nguyet', '(từ xa) 8% người dùng của mình. Chị có số.'],
            ['tung', 'Ok. Ok. Anh sửa. Mai có bản.'],
          ] },
          { t: 'Escalate lên chị Diệp và chị Nguyệt.', fx: { uy: 1, rel: { tung: -2, diep: 1 }, set: { crash_escalated: true } }, then: [
            ['diep', 'P1. Tùng ưu tiên cái này trước release nha.'],
            { chat: [['tung', 'méc hay ghê 🙂', true]] },
            ['think', 'Bug được sửa. Mình mất một người cho mượn sạc.'],
          ] },
          { t: 'Thôi, chắc máy cũ quá. Bỏ qua.', fx: { nl: 3, rel: { tung: 1 }, set: { crash_ignored: true } }, then: [
            ['tung', 'Đúng rồi. Máy cũ quá. Ai còn xài.'],
            ['nguyet', '(thở dài, mở file Excel, gõ thêm một dòng)'],
          ] },
        ] },
      ],
    },
    {
      who: 'diep', obj: 'Chị Diệp chốt danh sách release thứ Năm', time: '15:30',
      scene: [
        ['diep', 'Release thứ Năm gồm: giỏ hàng mới, logo to hơn 10%, và… em xác nhận giúp chị trạng thái crash ví.'],
        { if: (r) => r.flags.crash_proved || r.flags.crash_escalated, then: [
          ['me', 'Đã có bản sửa, chị Nguyệt test lại sáng mai ạ.'],
          ['diep', 'Tốt. Ghi vào release note: "Sửa lỗi thanh toán trên một số thiết bị". Một số. Mình không nói tám phần trăm.'],
          { fx: { rel: { diep: 1 } } },
        ], else: [
          ['me', 'Dạ… ticket đã đóng "Cannot reproduce" ạ.'],
          ['diep', 'Đóng là xong. Theo quy trình thì xong.'],
          ['think', 'Theo quy trình thì xong. Theo máy số 5 thì chưa.'],
        ] },
      ],
    },
    {
      who: 'nguyet', obj: 'Chị Nguyệt cho xem một file bí mật', time: '17:00',
      scene: [
        ['nguyet', 'Em muốn xem cái này không? File "Khong_phai_bug.xlsx". 214 dòng. Mỗi lần dev nói "không phải bug", chị ghi lại.'],
        ['nguyet', 'Cột cuối là "Sau này có phải bug không". 197 dòng ghi "Có".'],
        { c: 'tech_nguyet_file', o: [
          { t: '"Sao chị làm QA mà không làm dev ạ?"', fx: { rel: { nguyet: 3 } }, then: [
            ['nguyet', 'Chị từng là dev. Ba năm. Rồi chị nhận ra chị thích tìm lỗi hơn là bị tìm lỗi.'],
            ['nguyet', 'Mà QA lương thấp hơn dev, ai cũng nghĩ QA dễ. Thôi. Bug không quan tâm lương ai cao.'],
          ] },
          { t: '"Chị cho em xin template file này ạ."', fx: { uy: 2, rel: { nguyet: 2 }, set: { nguyet_file: true } }, then: [
            ['nguyet', 'Lấy đi. Nhưng đừng đặt tên giống chị. Mỗi công ty chỉ nên có một người bị dev ghét chính thức.'],
          ] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.crash_proved ? 'Mình mang máy số 5 tới tận bàn Tùng. Bug có thật. Tùng hơi khó chịu nhưng đã sửa.'
    : s.flags.crash_escalated ? 'Mình escalate bug crash ví. Bug được sửa. Tùng gọi mình là "méc".'
    : 'Mình bỏ qua bug crash ví trên Android 9. Chị Nguyệt gõ thêm một dòng vào file Excel. Chắc không sao đâu.',
};

const FRIDAY_DEPLOY = {
  id: 'friday_deploy', day: 12, title: '17:00 thứ Sáu, nút Deploy',
  intro: 'Thứ Sáu. Release lẽ ra lên hôm qua, nhưng trễ.\n\nTrên tường pantry vẫn dán tờ A4: "KHÔNG DEPLOY CHIỀU THỨ SÁU · Thạc, sau Thứ Sáu Đen 2023". Anh Kevin có buổi demo với nhà đầu tư sáng thứ Hai.',
  steps: [
    {
      who: 'diep', obj: '9:30 Daily: release có lên hôm nay không?', time: '09:30', pos: STANDUP_POS,
      scene: [
        ['diep', 'Release trễ một ngày. Anh Kevin muốn lên prod hôm nay để thứ Hai demo cho quỹ. Anh Thạc thì…'],
        { chat: [['thac', 'không deploy thứ Sáu.', false], ['kevin', 'Mình là startup mà anh 😅 move fast!', false], ['loc', '😶', false]] },
        ['diep', 'Mình align lại nha. Ai có ý kiến?'],
        { c: 'tech_fri_rule', o: [
          { t: '"Em nghĩ mình giữ luật, deploy sáng thứ Hai sớm trước demo ạ."', fx: { uy: 2, rel: { thac: 2, kevin: -1 } }, then: [
            ['diep', 'Ý hay. Nhưng anh Kevin đã hứa với quỹ là "đã live". Chị sẽ align. Lần nữa.'],
          ] },
          { t: '"Em theo anh Kevin, move fast ạ."', fx: { rel: { kevin: 2, thac: -1 } }, then: [['khai', '(nhỏ) Nhớ câu này. Lúc 17:20 sẽ có người hỏi.']] },
          { t: 'Im lặng, ghi biên bản.', fx: { nl: -2 }, then: [['think', 'Biên bản: "Team align được là chưa align được."']] },
        ] },
        ['nar', 'Quyết định cuối cùng đến lúc 11:47, qua một cuộc gọi giữa anh Kevin và anh Thạc. Deploy chiều nay. Anh Thạc tắt camera.'],
      ],
    },
    {
      who: 'thac', obj: 'Anh Thạc (CTO) gọi bạn qua', time: '14:00',
      scene: [
        ['thac', 'Em là intern đang chạy regression đúng không. Chiều nay có gì thì em vào #incident. Và đọc trang Rollback.'],
        { if: (r) => r.flags.read_runbook || r.flags.tung_tips, then: [
          ['me', 'Dạ em đọc rồi ạ. Trang viết năm 2022 mà vẫn đúng.'],
          ['thac', '…Em đọc rồi? Ok. Em là người thứ ba trong công ty đọc trang đó.'],
          { fx: { rel: { thac: 2 } } },
        ], else: [
          ['thac', 'Chưa đọc hả. Đọc đi. Trước 17:00.'],
        ] },
        ['nar', 'Anh Thạc uống một ngụm cà phê nguội. Dưới mắt anh có hai quầng thâm hình dashboard.'],
        { c: 'tech_thac_sleep', o: [
          { t: '"Anh ngủ được mấy tiếng rồi ạ?"', fx: { rel: { thac: 2 } }, then: [
            ['thac', 'Tuần này? Mười một. Tổng. Anh không mệt. Anh chỉ quên mất cảm giác không mệt là gì.'],
          ] },
          { t: '"Dạ em sẽ đọc lại Rollback ngay."', fx: { uy: 2, set: { read_runbook: true } }, then: [['thac', 'Tốt. Đọc tới khi thuộc.']] },
        ] },
      ],
    },
    {
      who: 'tung', obj: '17:00 Tùng gọi bạn với giọng rất gấp', time: '17:00',
      scene: [
        ['tung', 'Ê em! Pipeline xanh rồi. Em bấm deploy giùm anh nha, anh có hẹn. Bấm một nút thôi, xanh là ok.'],
        ['think', '17:00. Thứ Sáu. Tờ A4 trên tường pantry đang nhìn mình.'],
        { c: 'tech_fri_press', o: [
          { t: 'Bấm deploy giùm Tùng.', fx: { rel: { tung: 2 }, set: { deploy_pressed: true } }, then: [
            ['nar', 'Bạn bấm. Bot báo: "Deploy succeeded 🙏". Tùng đã ra tới thang máy.'],
          ] },
          { t: '"Anh bấm đi, rồi ở lại 20 phút theo dõi giúp em."', fx: { uy: 2, rel: { tung: -1 } }, then: [
            ['tung', 'Ok ok, anh bấm. Nhưng anh không ở lại được.'],
            ['nar', 'Tùng bấm deploy lúc 17:02 và biến mất lúc 17:03. Bot báo: "Deploy succeeded 🙏".'],
          ] },
          { t: 'Nhắn anh Thạc hỏi trước.', fx: { uy: 1, rel: { thac: 1, tung: -1 } }, then: [
            { chat: [['thac', 'pipeline xanh thì bấm. anh đang theo dõi.', true]] },
            ['nar', 'Tùng bấm deploy lúc 17:02 rồi chạy ra thang máy. Bot báo: "Deploy succeeded 🙏".'],
          ] },
        ] },
        { chat: [['bot', 'Deploy succeeded 🙏 · prod · v4.12.0', false]] },
      ],
    },
    {
      who: 'call:thac', obj: '17:20 #incident: anh Thạc đang gọi!', time: '17:20',
      call: { title: '#incident · Thanh toán lỗi trên prod', people: ['thac', 'loc', 'me'] },
      scene: [
        ['thac', 'Thanh toán bằng ví lỗi 40%. Ai deploy?'],
        ['loc', '🔥🔥🔥'],
        { if: f('crash_ignored'), then: [['nguyet', '(nhắn) và máy Android 9 crash ngay màn thanh toán. đúng cái ticket "Cannot reproduce".'], { fx: { dr: 3 } }] },
        { if: f('deploy_pressed'), then: [['think', 'Log deploy ghi tên mình. Tùng đang trong thang máy.']], else: [['think', 'Tùng đã đi. Trong cuộc gọi chỉ còn mình, anh Thạc và một chuỗi emoji lửa.']] },
        { c: 'tech_fri_incident', o: [
          { t: 'Rollback ngay theo trang Confluence.', fx: { nl: -6 }, then: [
            { mini: ROLLBACK_MINI,
              good: [
                ['nar', '17:31. Thanh toán trở lại bình thường. Bot báo: "Rollback succeeded 🙏🙏".'],
                ['thac', 'Ai rollback vậy? …Intern? Ok. Ghi lại em đã làm gì, mai anh đọc.'],
                { fx: { uy: 7, rel: { thac: 3, khai: 1 }, set: { deploy_rollback: true } } },
              ],
              bad: [
                ['nar', 'Bạn làm lộn một bước, redeploy nhầm bản. Mất thêm mười phút. Anh Lộc vào làm nốt, gửi một emoji 😮‍💨.'],
                ['thac', 'Có làm là tốt. Lần sau đọc kỹ tên bản.'],
                { fx: { uy: 2, rel: { thac: 1 }, set: { deploy_owned: true, rollback_fail: true } } },
              ],
            },
          ] },
          { t: '"Em bấm ạ. Log cho thấy bản này gồm code giỏ hàng mới."', when: f('deploy_pressed'), fx: { uy: 4, rel: { thac: 2, tung: -1 }, set: { deploy_owned: true } }, then: [
            ['thac', 'Cảm ơn. Nói thẳng là đỡ mất hai mươi phút tra log. Lộc, rollback.'],
            ['loc', '👍 ⏪'],
          ] },
          { t: '"Tùng bấm lúc 17:02 ạ, em ở đó. Bản này gồm code giỏ hàng mới."', when: nf('deploy_pressed'), fx: { uy: 4, rel: { thac: 2, tung: -1 }, set: { deploy_owned: true } }, then: [
            ['thac', 'Cảm ơn. Nói thẳng là đỡ mất hai mươi phút tra log. Lộc, rollback.'],
            ['loc', '👍 ⏪'],
          ] },
          { t: 'Im lặng, chờ Tùng trả lời.', fx: { uy: -5, dr: 4, rel: { thac: -2 }, set: { deploy_silent: true } }, then: [
            ['nar', '17:41. Anh Thạc tự tra log.'],
            ['thac', 'Log ghi deploy lúc 17:02. Lần sau có ai hỏi "ai deploy" thì trả lời trong một phút. Kể cả khi không phải mình.'],
          ] },
        ] },
      ],
    },
    {
      who: 'obj:desk', obj: '18:00 Về bàn, đọc lại #incident', time: '18:00',
      scene: [
        ['nar', '18:00. Kênh #incident yên lặng. Anh Kevin đăng LinkedIn: "Ở startup của tôi, chúng tôi ship nhanh và học còn nhanh hơn."'],
        { if: f('deploy_rollback'), then: [
          { chat: [['thac', 'cảm ơn em. thứ Hai mình deploy lại lúc 8h sáng. đúng luật.', true], ['loc', '🫡', true]] },
        ] },
        { if: f('deploy_silent'), then: [['think', 'Mình im lặng hai mươi phút. Hai mươi phút dài nhất đời.']] },
        { chat: [['tung', 'sorry em 🙏 anh tưởng xanh là ok. tuần sau anh bao trà sữa', true]] },
        ['nar', 'Bạn về lúc 19:12. Tờ A4 trên tường pantry có ai đó viết thêm bằng bút đỏ: "(thật đấy)".'],
      ],
    },
  ],
  diary: (s) => s.flags.deploy_rollback ? 'Mình rollback prod lúc 17:31 thứ Sáu theo trang Confluence năm 2022. Anh Thạc nhắn "cảm ơn". Mình sẽ nhớ cảm giác này.'
    : s.flags.rollback_fail ? 'Mình thử rollback theo Confluence, lộn một bước, anh Lộc làm nốt. Anh Thạc bảo có làm là tốt. Lần sau mình sẽ đọc kỹ tên bản.'
    : s.flags.deploy_owned ? `${s.flags.deploy_pressed ? 'Mình nhận là mình bấm deploy.' : 'Mình nói thẳng ai bấm deploy.'} Anh Thạc bảo nói thẳng đỡ mất hai mươi phút. Tùng nợ mình một ly trà sữa.`
    : 'Mình im lặng trong #incident. Anh Thạc tự tra log. Mình học được: câu "ai deploy?" cần trả lời trong một phút.',
};

const MAU_RECALC = {
  id: 'mau_recalc', day: 15, title: 'Tính lại MAU',
  intro: 'Thứ Hai. Demo sáng nay xong, anh Kevin hẹn quỹ Hạt Giống Ventures sáng mai để chốt Series B.\n\nSlide số 3 ghi: "MAU: 1.000.000+". Dashboard của team Data ghi: 212.418.\n\nTuần này bạn được luân chuyển sang Data.',
  steps: [
    {
      who: 'kevin', obj: 'Anh Kevin gọi vào phòng CEO', time: '09:00',
      scene: [
        ['kevin', 'Em đang ở Data đúng không? Perfect. Anh cần em tính lại MAU giúp anh. Con số hiện tại hơi… khiêm tốn.'],
        ['kevin', 'Người nhận push notification cũng là người dùng mà em. Họ thấy chữ "Lúa" mỗi ngày. Đó là engagement.'],
        ['think', 'Theo logic này, người đi ngang biển quảng cáo cũng là người dùng.'],
        { c: 'tech_mau_ask', o: [
          { t: '"Dạ em tính cả hai con số, kèm định nghĩa, để anh chọn ạ."', fx: { uy: 2, rel: { kevin: -1 } }, then: [['kevin', 'Hai con số? Nhà đầu tư thích một con số. To. Nhưng ok, em làm đi.']] },
          { t: '"Dạ em làm ngay ạ."', fx: { rel: { kevin: 2 } }, then: [['kevin', 'Đó! Startup DNA. Trước 3 giờ chiều nha.']] },
        ] },
      ],
    },
    {
      who: 'obj:desk', obj: 'Về bàn viết SQL đếm người dùng hoạt động', time: '10:30',
      scene: [
        ['nar', 'Bảng "users" có 3,4 triệu dòng. Bảng "events" có 900 triệu dòng. Bảng "definitions" có đúng một dòng: "MAU = (hỏi anh Kevin)".'],
        { mini: MAU_MINI,
          good: [['think', 'Định nghĩa chuẩn: 212.418. Nếu cộng cả người chỉ nhận push: 1.038.552. Hai con số. Một sự thật.'], { fx: { uy: 3, set: { mau_sql_ok: true } } }],
          bad: [['think', 'Mình lỡ đếm lẫn một nhóm không được tính. Con số lệch đi. Gần đúng. Gần.'], { fx: { nl: -3 } }],
        },
        { if: f('poker_spike'), then: [['think', 'Bảng "events" này cũng chính là dữ liệu cho cái spike AI gợi ý món. Hai việc, một nỗi buồn.']] },
      ],
    },
    {
      who: 'thao', obj: 'Chị Thảo (COO) cần con số để ký báo cáo', time: '13:30',
      scene: [
        ['thao', 'Em đang làm số MAU cho buổi gặp quỹ hả? Con số nào em đưa thì chị phải ký vào báo cáo gửi nhà đầu tư.'],
        ['thao', 'Chị nói thật nhé. Vòng sau quỹ sẽ làm due diligence, kiểm tra số liệu. Con số nào sai thì nó sẽ quay lại tìm người ký.'],
        { c: 'tech_mau_thao', o: [
          { t: '"Chị muốn ký vào con số nào ạ?"', fx: { rel: { thao: 2 } }, then: [
            ['thao', 'Con số mà chị ngủ được. Chị đã mất ngủ vì runway rồi, đừng thêm cái này.'],
          ] },
          { t: '"Runway mình còn bao lâu ạ?"', fx: { dr: 1, rel: { thao: 1 }, set: { asked_runway: true } }, then: [
            ['thao', '…Em hỏi câu mà cả công ty không ai dám hỏi. Chín tháng. Nếu không có Series B và không có tiền bên Nhật.'],
            ['think', 'Chín tháng. Một thai kỳ. Nghe vừa đúng vừa không hợp lý.'],
          ] },
        ] },
      ],
    },
    {
      who: 'kevin', obj: '15:00 Gửi số MAU cho anh Kevin', time: '15:00',
      scene: [
        ['kevin', 'Số đâu em? Slide đang chờ. Anh đã viết sẵn "1.000.000+" rồi, em chỉ cần xác nhận.'],
        { c: 'tech_mau', o: [
          { t: 'Đưa hai con số kèm định nghĩa: 212 nghìn MAU, 1 triệu "người được tiếp cận".', fx: { uy: 4, rel: { kevin: -2, thac: 2, thao: 2 }, set: { mau_honest: true } }, then: [
            ['kevin', '"Người được tiếp cận"… nghe không sexy. Em biết nhà đầu tư nghĩ gì không?'],
            ['me', 'Dạ, nhà đầu tư sẽ kiểm tra lại số ở vòng due diligence ạ.'],
            ['kevin', '…Ok. Để anh nghĩ. Anh ghét khi intern nói đúng.'],
          ] },
          { t: 'Làm theo, nhưng ghi định nghĩa ở chân slide.', fx: { uy: 1, dr: 2, rel: { kevin: 1 }, set: { mau_footnote: true } }, then: [
            ['nar', 'Anh Kevin đọc chân slide. Rồi chỉnh cỡ chữ chân slide xuống 6.'],
            ['kevin', 'Perfect. Chân slide là để luật sư đọc.'],
          ] },
          { t: 'Xác nhận "1.000.000+", không ghi chú gì.', fx: { dr: 6, rel: { kevin: 3, thao: -2 }, set: { mau_inflated: true } }, then: [
            ['kevin', 'Đó! Một triệu! Anh biết em hiểu mà. Em sẽ đi xa ở đây.'],
            ['think', 'Đi xa. Có thể là đi lên. Có thể là đi giải trình.'],
          ] },
        ] },
      ],
    },
    {
      who: 'thac', obj: 'Anh Thạc nhắn: "qua đây chút"', time: '17:00',
      scene: [
        { if: f('mau_honest'), then: [
          ['thac', 'Anh thấy em gửi hai con số. Có định nghĩa. Anh Kevin vừa gọi anh cằn nhằn mười phút.'],
          ['thac', 'Nghĩa là em làm đúng. Năm 2021 có một bạn data làm giống em. Bạn ấy giờ ở quỹ đầu tư. Bên kia bàn.'],
          { fx: { rel: { thac: 2 }, set: { thac_noticed: true } } },
        ], else: [
          ['thac', 'Slide mai ghi một triệu MAU. Dashboard của anh ghi hai trăm nghìn. Một trong hai cái đó sai, và không phải dashboard.'],
          { if: f('mau_footnote'), then: [['thac', 'Em có ghi chân slide. Cỡ chữ 6. Ít nhất nó tồn tại.']] },
          { if: f('mau_inflated'), then: [['thac', 'Anh không trách em. Em là intern. Nhưng lần sau, có ai đòi một con số, hãy đưa thêm định nghĩa. Định nghĩa cứu người.'], { fx: { rel: { thac: -1 } } }] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.mau_honest ? 'Mình đưa anh Kevin hai con số kèm định nghĩa. Anh ấy "ghét khi intern nói đúng". Anh Thạc thì gật đầu.'
    : s.flags.mau_footnote ? 'MAU một triệu, chân slide cỡ chữ 6. Mình đã nói sự thật. Rất nhỏ.'
    : 'Mình xác nhận một triệu MAU. Anh Kevin bảo mình sẽ đi xa. Đêm nay mình mơ thấy chữ "due diligence".',
};

const FIGMA_WAR = {
  id: 'figma_war', minDay: 16, maxDay: 17, title: 'Chiến tranh Figma: lệch 4px',
  intro: 'Một buổi sáng giữa tuần. Bạn có 61 thông báo Figma.\n\nTất cả đến từ một thread duy nhất trên màn checkout, nơi Vy và chị Diệp cãi nhau từ 23:14 tối qua. Cả hai đều tag bạn.',
  steps: [
    {
      who: 'vy', obj: 'Vy gọi bạn qua xem màn checkout', time: '09:45',
      scene: [
        ['vy', 'Bạn nhìn đi. Nút thanh toán lệch 4px. Màu sai một mã hex. Chị Diệp bảo "không ai để ý". Mình để ý!'],
        ['vy', 'Mình tag bạn vì bạn là người duy nhất chưa cãi với mình trong thread này. Bạn hiểu mà.'],
        { if: f('tie_vy_khai'), then: [['nar', 'Trên màn hình phụ của Vy là cửa sổ chat với anh Khải. Tin cuối: "anh thấy màu này ổn không ạ 🥺". Chưa xem.']] },
        { c: 'tech_figma_vy', o: [
          { t: '"Mình thấy rồi. Để mình gom hết lỗi lại cho rõ."', fx: { uy: 1, rel: { vy: 1 } }, then: [['vy', 'Gom lại? Ok… miễn là đừng gom mất cái animation của mình.']] },
          { t: '"Vy đúng. 4px là 4px."', fx: { rel: { vy: 2 } }, then: [['vy', 'Cảm ơn! Bạn đi nói với chị Diệp đi.']] },
        ] },
      ],
    },
    {
      who: 'diep', obj: 'Chị Diệp muốn "align" về thread Figma', time: '10:45',
      scene: [
        ['diep', 'Chị chấm theo RICE. Reach: mọi người. Impact: 0,3. Confidence: thấp. Effort: Vy muốn làm lại cả màn. Điểm: gần bằng không.'],
        ['diep', 'Chị không ghét design. Chị ghét làm lại cả màn khi checkout còn cả đống bug thật.'],
        { if: f('crash_ignored'), then: [['think', 'Thanh toán bằng ví vẫn crash trên Android 9. Cái mình bỏ qua.']] },
        { c: 'tech_figma_diep', o: [
          { t: '"Có lỗi nào trong thread ảnh hưởng thanh toán không ạ? Mình ưu tiên mấy cái đó."', fx: { uy: 2, rel: { diep: 2 } }, then: [['diep', 'Câu hỏi đúng. Có. Nút bị che trên màn nhỏ. Cái đó chị không cãi.']] },
          { t: '"Chị nói đúng, 4px không ai thấy."', fx: { rel: { diep: 1, vy: -1 } }, then: [['diep', 'Cảm ơn. Đừng nói câu đó gần Vy. Ở gần Vy, 4px là vấn đề đạo đức.']] },
        ] },
      ],
    },
    {
      who: 'tung', obj: 'Tùng (người phải code lại) muốn góp ý', time: '11:30',
      scene: [
        ['tung', 'Anh là người code màn này. Ai mà để ý 4px. Người dùng bấm "Thanh toán" bằng ngón cái, không bằng thước kẹp.'],
        ['tung', 'Mà nói thật, nút bị che trên màn nhỏ là có. Anh test trên máy anh không thấy. Máy anh màn 6,7 inch.'],
        ['think', 'Tất cả bug của Tùng đều có cùng một nguyên nhân: máy của Tùng.'],
        { fx: { rel: { tung: 1 } } },
      ],
    },
    {
      who: 'obj:desk', obj: 'Về bàn: chốt thread 61 comment', time: '14:00',
      scene: [
        ['nar', 'Thread Figma: 61 comment, 3 sticker, 1 comment của anh Kevin lúc 01:12: "chưa wow".'],
        { c: 'tech_figma', o: [
          { t: 'Gom thành checklist UI bug có ưu tiên, gửi cả ba người.', fx: { nl: -4 }, then: [
            { mini: UIBUG_MINI,
              good: [['nar', 'Chị Diệp thả ❤️. Vy thả ❤️. Tùng thả 👍. Lần đầu tiên thread có ba emoji giống nhau.'], { fx: { uy: 5, rel: { diep: 2, vy: 1, tung: 1 }, set: { ui_checklist: true } } }],
              bad: [['nar', 'Checklist xếp lộn ưu tiên. Chị Diệp gửi một dấu chấm hỏi. Vy gửi mười trái tim, cho chắc.'], { fx: { rel: { vy: 2, diep: -1 } } }],
            },
          ] },
          { t: 'Đứng về phía Vy: làm lại pixel-perfect.', fx: { rel: { vy: 3, tung: -2, diep: -1 }, set: { side_vy: true } }, then: [
            ['nar', 'Tùng không trả lời thread. Từ giờ, khi bạn hỏi Tùng về bug, Tùng trả lời "để anh xem" và không bao giờ xem.'],
          ] },
          { t: 'Đứng về phía chị Diệp: ship trước, đẹp sau.', fx: { rel: { diep: 2, tung: 1, vy: -3 }, set: { side_diep: true } }, then: [
            ['nar', 'Vy "seen" tin nhắn của bạn. Không trả lời. Trạng thái Figma của Vy đổi thành: "đang thiết kế cho người có mắt".'],
          ] },
        ] },
      ],
    },
    {
      who: 'vy', obj: 'Vy ngồi một mình ở bàn', time: '16:30',
      scene: [
        { if: f('side_diep'), then: [
          ['vy', 'Không sao. Mình quen rồi. Designer ở startup là người làm đẹp cho một thứ sắp bị pivot.'],
        ], else: [
          ['vy', 'Bạn biết không, mình vào đây vì anh Kevin bảo "design là linh hồn sản phẩm". Rồi linh hồn bị xếp vào "Won\'t have".'],
        ] },
        { c: 'tech_vy_human', o: [
          { t: 'Rủ Vy đi trà sữa, nghe Vy kể.', fx: { nl: -3, money: -40_000, rel: { vy: 3 } }, then: [
            ['vy', 'Mình làm portfolio đêm qua. Không phải để nghỉ. Chỉ là… để nhớ mình từng thích vẽ.'],
          ] },
          { t: 'Khen bản animation nhẹ của Vy.', fx: { rel: { vy: 2 } }, then: [['vy', 'Bạn để ý thật hả? Nó chỉ 300ms. Cảm ơn nha.']] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.ui_checklist ? 'Thread Figma 61 comment thành một checklist năm dòng. Ba người cùng thả tim. Mình nên ghi cái này vào CV.'
    : s.flags.side_vy ? 'Mình đứng về phía Vy. 4px là 4px. Tùng giờ trả lời mình bằng "để anh xem".'
    : s.flags.side_diep ? 'Mình đứng về phía chị Diệp. Vy seen mình. Ship trước, đẹp sau, buồn luôn.'
    : 'Thread Figma vẫn chưa xong. Nhưng ít nhất giờ nó có một checklist, hơi lộn xộn.',
};

const ONCALL = {
  id: 'oncall_2am', day: 18, title: '2:07 sáng, #incident',
  intro: 'Thứ Năm. Đêm qua, 2:07 sáng.\n\nĐiện thoại bạn rung liên tục. Kênh #incident: "🔴 Disk 98% · server ví". Anh Lộc không nghe máy. Intern "không phải on-call", nhưng vẫn ở trong kênh. Và vẫn còn quyền truy cập server "vì lần trước cấp quên thu hồi".',
  steps: [
    {
      who: 'obj:desk', obj: 'Mở laptop: nhớ lại chuyện 2:07 sáng', time: '08:30',
      scene: [
        ['nar', '(Đêm qua. 2:07. Bạn ngồi trên giường, laptop trên đùi, mắt mở được 40%.)'],
        ['nar', '#incident: "Disk 98%". Rồi 99%. Ví Lúa bắt đầu từ chối giao dịch. Anh Lộc: offline. Anh Thạc: offline.'],
        { c: 'tech_oncall', o: [
          { t: 'Mở runbook, dọn log cũ theo hướng dẫn.', fx: { nl: -8 }, then: [
            { mini: LOG_MINI,
              good: [['nar', '2:31. Disk 61%. Giao dịch chạy lại. Bạn viết vào #incident: đã làm gì, lúc nào, xóa những gì.'], { fx: { uy: 6, set: { oncall_saved: true } } }],
              bad: [['nar', 'Bạn xóa nhầm thư mục log đang ghi. Server ví khởi động lại. Ví sập 2 tiếng. Lúc 4:40 anh Thạc online, không nói gì, sửa.'], { fx: { dr: 6, uy: -3, set: { oncall_broke: true } } }],
            },
          ] },
          { t: 'Gọi anh Thạc liên tục tới khi anh dậy.', fx: { nl: -6, uy: 3, set: { oncall_escalated: true } }, then: [
            ['nar', 'Cuộc gọi thứ chín, 2:19. Một giọng khàn: "…ừ". 2:34 server ổn. Anh Thạc nhắn: "đúng người đúng lúc. ngủ đi."'],
          ] },
          { t: 'Copy một lệnh trên diễn đàn: "rm -rf /var/log/*".', fx: { nl: -6, dr: 8, set: { oncall_broke: true } }, then: [
            ['nar', 'Lệnh chạy. Disk 12%. Bạn thở phào. Ba phút sau ví sập hẳn vì dịch vụ không còn chỗ ghi log. Incident 2 tiếng.'],
          ] },
          { t: 'Tắt điện thoại, ngủ tiếp. Mình là intern.', fx: { nl: 8, dr: 3, set: { oncall_slept: true } }, then: [
            ['nar', 'Bạn ngủ ngon. 6:50 anh Thạc online, dọn disk trong 4 phút. Ví đã từ chối 3.100 giao dịch.'],
          ] },
        ] },
      ],
    },
    {
      who: 'thac', obj: 'Anh Thạc gọi bạn qua bàn', time: '09:30',
      scene: [
        { if: f('oncall_saved'), then: [
          ['thac', 'Anh đọc #incident rồi. Em dọn log đúng runbook, ghi lại từng bước. Không hoảng. Anh cảm ơn.'],
          ['thac', 'Và anh thu quyền truy cập server của em ngay bây giờ. Không phải vì em làm sai. Vì em không nên phải làm.'],
          { fx: { rel: { thac: 3 } } },
        ] },
        { if: f('oncall_escalated'), then: [
          ['thac', 'Chín cuộc gọi. Anh tưởng nhà cháy. Nhưng đúng: biết gọi đúng người là kỹ năng của senior. Cảm ơn em.'],
          { fx: { rel: { thac: 2 } } },
        ] },
        { if: f('oncall_broke'), then: [
          ['thac', 'Em xóa nhầm. Anh biết. Hai giờ sáng ai cũng xóa nhầm. Lỗi là của anh vì để intern có quyền đó.'],
          ['thac', 'Postmortem sẽ ghi "quyền truy cập không được thu hồi". Không ghi tên em. Đó là blameless thật, không phải blameless trên giấy.'],
          { fx: { rel: { thac: 1 } } },
        ] },
        { if: f('oncall_slept'), then: [
          ['thac', 'Em ngủ. Ok. Em là intern, em không phải on-call. Anh không trách.'],
          ['thac', 'Nhưng lúc đó em là người duy nhất thức. Anh chỉ nói vậy thôi.'],
          { fx: { rel: { thac: -1 } } },
        ] },
        ['nar', 'Anh Thạc quay lại màn hình. Tab đầu tiên là một bài viết: "Dấu hiệu bạn cần nghỉ ngơi". Đã mở từ tháng trước.'],
      ],
    },
    {
      who: 'loc', obj: 'Anh Lộc (DevOps) vừa tới', time: '11:00',
      scene: [
        ['loc', '🙏'],
        ['nar', 'Anh Lộc đứng đó rất lâu. Rồi, lần đầu tiên, anh nói bằng chữ. Cả câu.'],
        ['loc', 'Đêm qua anh ở bệnh viện với con. Máy hết pin. Anh là DevOps duy nhất ba năm rồi. Anh xin lỗi.'],
        { c: 'tech_loc_human', o: [
          { t: '"Không phải lỗi anh. Một người không thể on-call 365 ngày."', fx: { rel: { loc: 3, thac: 1 } }, then: [['loc', '…❤️'], ['nar', 'Anh Lộc quay đi rất nhanh. Bạn nghĩ anh đang dụi mắt. Hoặc màn hình quá sáng.']] },
          { t: '"Con anh ổn chưa ạ?"', fx: { rel: { loc: 3 } }, then: [['loc', 'Ổn rồi. Sốt thôi. 👶👍'], ['think', 'Hóa ra anh Lộc dùng emoji vì không còn sức để gõ chữ.']] },
        ] },
      ],
    },
    {
      who: 'diep', obj: 'Postmortem "blameless" với chị Diệp', time: '14:00', pos: { diep: 'meeting_head', thac: 'mr_n1', loc: 'mr_n2' },
      scene: [
        ['diep', 'Postmortem. Blameless. Mình dùng 5 Whys. Vì sao disk đầy? Vì log không được dọn. Vì sao? Vì cron job hỏng. Vì sao?'],
        ['loc', '😶'],
        ['diep', 'Vì sao không ai phát hiện? Vì… chỉ có một người on-call. {ten}, em có đề xuất gì không?'],
        { c: 'tech_postmortem', o: [
          { t: 'Đề xuất lịch on-call xoay vòng ít nhất 2 người, kèm cảnh báo disk 80%.', fx: { uy: 4, rel: { loc: 2, thac: 2, diep: 1 }, set: { oncall_rotation: true } }, then: [
            ['thac', 'Đồng ý. Anh sẽ là người thứ hai. Lộc, tuần này anh trực.'],
            ['loc', '🥹'],
          ] },
          { t: '"Em nghĩ do anh Lộc không nghe máy ạ."', fx: { dr: 4, rel: { loc: -3, thac: -2 } }, then: [
            ['diep', '…Ok. Blameless nha em. Blameless.'],
            ['think', 'Mình vừa biến "blameless" thành "blame-Lộc".'],
          ] },
          { t: 'Ghi biên bản, không ý kiến.', fx: { nl: -2 }, then: [['think', 'Biên bản: 5 Whys, 0 Hows.']] },
        ] },
      ],
    },
    {
      who: 'ngan', obj: 'Chị Ngân (People) hỏi thăm', time: '16:30',
      scene: [
        ['ngan', 'Chị nghe nói đêm qua em thức. Em ổn không? Wellbeing của em là ưu tiên của gia đình mình.'],
        ['ngan', 'À mà intern không phải on-call nên không có phụ cấp on-call nha. Nhưng chị gửi em sticker cảm ơn trong #kudos.'],
        { c: 'tech_ngan_oncall', o: [
          { t: '"Dạ, vậy lần sau em có cần dậy không ạ?"', fx: { uy: 2, dr: 1, rel: { ngan: -1 } }, then: [
            ['ngan', 'Ơ… câu hỏi hay. Để chị align với anh Thạc. Chắc là… không? Chị sẽ gửi email.'],
            ['think', 'Chị Ngân sẽ gửi email. Email đó sẽ không bao giờ tới.'],
          ] },
          { t: '"Dạ em cảm ơn chị ạ."', fx: { rel: { ngan: 2 } }, then: [
            { chat: [['ngan', '🎉 Kudos cho {ten} vì tinh thần "ownership" đêm qua! Gia đình mình tự hào 💐', false], ['loc', '🙏', false], ['kevin', 'This is the culture 🚀', false]] },
          ] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.oncall_saved ? 'Hai giờ sáng mình dọn disk theo runbook. Anh Thạc cảm ơn rồi thu quyền của mình. Hợp lý. Mà vẫn hơi tiếc.'
    : s.flags.oncall_escalated ? 'Mình gọi anh Thạc chín cuộc lúc hai giờ sáng. Anh bảo "đúng người đúng lúc". Mình ngủ tiếp lúc 3 giờ.'
    : s.flags.oncall_broke ? 'Mình xóa nhầm log, ví sập hai tiếng. Postmortem không ghi tên mình. Anh Thạc nói lỗi là của hệ thống. Mình vẫn thấy có lỗi.'
    : 'Mình ngủ trong khi ví từ chối 3.100 giao dịch. Mình không phải on-call. Mình biết. Nhưng mình vẫn nghĩ về nó.',
};

const HACKATHON = {
  id: 'hackathon', day: 19, title: 'Lúa Hack 24h ("tự nguyện")',
  intro: 'Thứ Sáu. Hackathon "Lúa Hack 24h" bắt đầu 13:00 chiều nay, kéo tới 13:00 thứ Bảy.\n\nHoàn toàn tự nguyện. Danh sách người tự nguyện do chị Ngân lập sẵn. Tên bạn ở dòng thứ hai.\n\nGiải nhất: voucher app Lúa trị giá 2 triệu.',
  steps: [
    {
      who: 'ngan', obj: 'Chị Ngân phổ biến luật hackathon', time: '09:45',
      scene: [
        ['ngan', 'Hackathon là tự nguyện nha em. Chỉ là ai không tham gia thì… không có trong ảnh nhóm. Ảnh nhóm sẽ lên LinkedIn anh Kevin.'],
        ['ngan', 'Có pizza, có nước tăng lực, có túi ngủ. Túi ngủ là của đợt 2022, chị giặt rồi. Chắc vậy.'],
        { c: 'tech_hack_join', o: [
          { t: 'Tham gia hết mình.', fx: { rel: { ngan: 1, kevin: 1 } }, then: [['ngan', 'Tuyệt! Em là "người tự nguyện tự nguyện" đầu tiên!']] },
          { t: 'Tham gia, nhưng về lúc 22:00.', fx: { uy: 1 }, then: [['ngan', 'Ok, tự nguyện có giờ giấc. Chị ghi là "tự nguyện bán thời gian".']] },
          { t: 'Xin không tham gia. Cuối tuần em có việc gia đình.', fx: { nl: 10, rel: { ngan: -1 }, set: { hack_skip: true } }, then: [
            ['ngan', 'Ừ không sao! Gia đình là quan trọng. Gia đình của em, không phải gia đình mình. Hiểu mà.'],
            ['think', 'Câu đó có hai gia đình, và mình vừa chọn sai một cái.'],
          ] },
        ] },
      ],
    },
    {
      who: 'chau', obj: '13:00 Hackathon bắt đầu: lập đội', time: '13:00', when: nf('hack_skip'),
      scene: [
        ['chau', 'Bạn ơi, chung đội không? Mình có ý tưởng: AI! Còn bạn có ý tưởng gì?'],
        ['me', 'Mình nghĩ tới "Giỏ Chung": một giỏ đi chợ cho cả nhà. Mẹ thêm rau, ba thêm bia, một người trả tiền.'],
        ['vy', '(ngó qua) Giỏ Chung? Dễ thương đó. Mình vẽ được trong hai tiếng.'],
        { c: 'tech_hack_team', o: [
          { t: 'Chung đội với Châu.', fx: { rel: { chau: 2 }, set: { hack_team_chau: true } }, then: [['chau', 'Yay! Giỏ Chung… có AI không? Mình thêm chút AI nha. Một chút thôi.']] },
          { t: 'Chung đội với Vy.', fx: { rel: { vy: 2 }, set: { hack_team_vy: true } }, then: [['vy', 'Deal. Không có confetti. Hứa. Có thể có một chút confetti.']] },
          { t: 'Làm một mình.', fx: { uy: 1, nl: -5, set: { hack_solo: true } }, then: [['think', 'Một người, một ý tưởng, hai mươi bốn tiếng, và một túi ngủ đời 2022.']] },
        ] },
        { fx: { set: { hack_idea: true } } },
      ],
    },
    {
      who: 'obj:desk', obj: 'Code MVP "Giỏ Chung"', time: '14:30', when: nf('hack_skip'),
      scene: [
        ['nar', 'Bảng trắng ghi: "MVP: Minimum Viable Product". Ai đó sửa thành "Minimum Vừa đủ Pizza".'],
        { mini: HACK_MINI,
          good: [['nar', 'Bản demo chạy: mời người nhà bằng link, thêm món, một người thanh toán. Đơn giản. Ai cũng hiểu.'], { fx: { uy: 4, set: { hack_mvp: true } } }],
          bad: [['nar', 'Bạn dành ba tiếng cho một tính năng "wow". Nó rất đẹp. Nó không thanh toán được.'], { fx: { nl: -5 } }],
        },
      ],
    },
    {
      who: 'kevin', obj: '17:30 Pitch thử với giám khảo Kevin', time: '17:30', when: nf('hack_skip'),
      scene: [
        ['kevin', 'Giỏ Chung! Cả nhà đi chợ chung. Wow. Đây chính là "family super app" mà anh luôn nói tới!'],
        { if: f('hack_team_chau'), then: [
          ['chau', 'Dạ, và tụi em sẽ thêm AI để gợi ý món theo khẩu vị cả nhà ạ!'],
          ['kevin', 'AI! Perfect. Châu, mai em trình bày cái này với chú Victor luôn nha.'],
          ['think', 'Chú Victor. Ý tưởng của mình. Người trình bày là Châu.'],
        ] },
        ['kevin', 'Anh sẽ ra mắt cái này. Quý này. Cảm ơn team, rất "ownership".'],
        { c: 'tech_hack_credit', o: [
          { t: '"Dạ anh ghi tên team em trong ticket giúp em ạ."', fx: { uy: 2, rel: { kevin: -1 }, set: { hack_credit_asked: true } }, then: [['kevin', 'Tất nhiên! Mình là gia đình mà. Ticket là ticket của cả công ty.'], ['think', 'Đó không phải câu "có".']] },
          { t: 'Cười, cảm ơn anh Kevin.', fx: { rel: { kevin: 2 } }, then: [['kevin', 'Em có tố chất. Anh sẽ nhớ em. Có thể.']] },
        ] },
      ],
    },
    {
      who: 'obj:desk', obj: '17:55 Ở lại hackathon hay về?', time: '17:55',
      scene: [
        { if: f('hack_skip'), then: [
          ['nar', 'Bạn về đúng giờ. Trên đường về, Slack nổ ảnh: pizza, túi ngủ, anh Kevin giơ ngón cái. Không có bạn trong ảnh.'],
          ['think', 'Mình có một cuối tuần. Và bị mất một tấm ảnh. Nghe vẫn lời.'],
          { fx: { nl: 10, rel: { tung: -1 } } },
        ], else: [
          ['nar', 'Văn phòng sáng đèn. Tùng ngủ trên ghế bi lắc. Mèo 404 ngủ trên Tùng.'],
          { c: 'tech_hack_night', o: [
            { t: 'Ở lại tới sáng hoàn thiện demo.', fx: { nl: -20, uy: 3, rel: { tung: 1, vy: 1 } }, then: [['nar', '13:00 thứ Bảy. Giỏ Chung đoạt giải nhất. Voucher 2 triệu. Ảnh nhóm có bạn, mắt nhắm.'], { fx: { set: { hack_won: true } } }] },
            { t: 'Về ngủ, mai quay lại pitch.', fx: { nl: 5 }, then: [['nar', 'Thứ Bảy Giỏ Chung vẫn đoạt giải nhì. Voucher 1 triệu. Ảnh nhóm có bạn, mắt mở.']] },
          ] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.hack_skip ? 'Mình không đi hackathon. Ảnh nhóm không có mình. Cuối tuần có mình.'
    : `Hackathon. Giỏ Chung là ý tưởng của mình. ${s.flags.hack_team_chau ? 'Châu sẽ trình bày với chú Victor. Mình hơi lo.' : 'Anh Kevin nói "anh sẽ ra mắt cái này". Không nói tên ai.'}`,
};

const IDEA_STOLEN = {
  id: 'idea_stolen', day: 22, title: '"Một đêm mất ngủ, tôi nghĩ ra…"',
  intro: 'Thứ Hai. 7:30 sáng, bài LinkedIn của anh Kevin đã có 3.400 reaction.\n\n"Một đêm mất ngủ, tôi nghĩ ra Giỏ Chung: một giỏ đi chợ cho cả gia đình. Đôi khi ý tưởng lớn nhất đến từ những khoảnh khắc nhỏ nhất. #founder #thinkbig"',
  steps: [
    {
      who: 'duy', obj: 'Duy (Growth) dí điện thoại vào mặt bạn', time: '08:45',
      scene: [
        ['duy', 'Em xem chưa? 3.400 reaction. Anh book luôn 5 KOL cho Giỏ Chung, đăng tối thứ Tư tuần sau. Ship đi, test sau!'],
        ['duy', 'Mà Giỏ Chung code xong chưa em? Anh chưa thấy ticket.'],
        { if: f('hack_skip'), then: [['think', 'Giỏ Chung. Mình từng viết ý này trong file Notion "Ý tưởng intern" tuần đầu. Ai đó đã đọc nó.']], else: [['think', '"Một đêm mất ngủ." Đêm mất ngủ đó là của mình. Và của Mèo 404.']] },
        { c: 'tech_duy_kol', o: [
          { t: '"Anh book KOL khi chưa có ticket ạ?"', fx: { uy: 1, rel: { duy: -1 } }, then: [['duy', 'Growth là phải đi trước sản phẩm em. Nếu sản phẩm đuổi kịp thì tuyệt. Nếu không thì… mình học.']] },
          { t: '"Hay quá anh!"', fx: { rel: { duy: 2 } }, then: [['duy', 'Đúng không! Em có growth mindset. Theo nghĩa đen.']] },
        ] },
      ],
    },
    {
      who: 'chau', obj: 'Châu muốn nói chuyện riêng', time: '10:00',
      scene: [
        { if: f('hack_team_chau'), then: [
          ['chau', 'Bạn ơi… thứ Bảy mình trình bày Giỏ Chung với chú Victor. Mình dùng slide của bạn. Mình có nói "team tụi em". Nhưng…'],
          ['chau', 'Chú Victor chỉ nhớ mặt mình. Rồi anh Kevin đăng bài. Mình xin lỗi. Thật.'],
        ], else: [
          ['chau', 'Bạn ơi, mình nghe anh Kevin nói Giỏ Chung là ý của bạn. Ảnh nói trong phòng, không nói trên LinkedIn.'],
          ['chau', 'Chú Victor hỏi ai nghĩ ra, ảnh bảo "team". Mình thấy… không công bằng.'],
        ] },
        { c: 'tech_chau_bond', o: [
          { t: 'Bỏ qua cho Châu, rủ Châu ăn trưa.', fx: { rel: { chau: 3 }, set: { chau_friend: true } }, then: [
            ['chau', 'Bạn tốt quá. Mình kể bạn nghe một chuyện. Series B… không chắc như anh Kevin nói đâu. Chú mình bảo "đang cân nhắc".'],
            ['think', '"Đang cân nhắc". Tiếng Việt của "kentou shimasu".'],
          ] },
          { t: '"Lần sau Châu ghi tên người làm trong slide nhé."', fx: { uy: 2, rel: { chau: 1 } }, then: [['chau', 'Ừ. Mình hứa. Mình cũng muốn được nhớ vì việc mình làm, không vì chú mình.']] },
          { t: 'Lạnh lùng: "Ok."', fx: { dr: 2, rel: { chau: -2 } }, then: [['chau', '…Ok.'], ['think', 'Mình thắng một cuộc đối thoại. Và thua một người bạn có chú làm quỹ.']] },
        ] },
      ],
    },
    {
      who: 'thac', obj: 'Anh Thạc ngoắc lại bàn', time: '13:30',
      scene: [
        ['thac', 'Anh đọc bài LinkedIn rồi.'],
        ['nar', 'Anh Thạc im một lúc. Ngoài cửa sổ có tiếng khoan. Trong văn phòng có tiếng anh Kevin livestream.'],
        ['thac', 'Anh biết là của em. Anh Kevin cũng biết. Năm 2021 cái ví Lúa là ý của anh. LinkedIn ghi "một đêm mất ngủ" luôn.'],
        { c: 'tech_thac_idea', o: [
          { t: '"Sao anh vẫn ở lại ạ?"', fx: { rel: { thac: 3 } }, then: [
            ['thac', 'Vì có tám mươi người sống bằng hệ thống anh viết. Và vì anh chưa ngủ đủ để nghĩ ra câu trả lời khác.'],
          ] },
          { t: '"Em nên làm gì ạ?"', fx: { uy: 1, rel: { thac: 1 } }, then: [
            ['thac', 'Tùy em. Nhưng ticket Giỏ Chung sẽ ghi em là người đề xuất. Anh vừa sửa. Jira không đăng LinkedIn, nhưng Jira nhớ.'],
            { fx: { set: { thac_credit: true } } },
          ] },
        ] },
      ],
    },
    {
      who: 'obj:desk', obj: 'Về bàn: phản hồi bài LinkedIn thế nào?', time: '15:00',
      scene: [
        ['nar', 'Bài viết: 3.912 reaction. Bình luận top: "Thiên tài! Anh nghĩ ra ý tưởng này thế nào ạ?" Anh Kevin trả lời: "Nhờ gia đình 🙏".'],
        { c: 'tech_linkedin', o: [
          { t: 'Comment: "Rất vui khi ý tưởng Giỏ Chung em đề xuất được anh đưa vào sản phẩm 🙌"', fx: { uy: 4, dr: 2, rel: { kevin: -1 }, set: { idea_tagged: true } }, then: [
            ['nar', 'Comment của bạn được 214 like. Anh Kevin thả tim. Rồi sửa bài: "…và ý tưởng ban đầu từ một bạn trong team". Không ghi tên.'],
          ] },
          { t: 'Im lặng. Jira nhớ là đủ.', fx: { nl: 3, rel: { thac: 1 }, set: { idea_silent: true } }, then: [['think', 'Mình im lặng. Nhưng mình sẽ nhớ. Và anh Thạc nhớ.']] },
          { t: 'Đăng bài riêng kể chuyện Giỏ Chung ra đời, kèm ảnh bản nháp có ngày giờ.', fx: { dr: 8, uy: 2, rel: { kevin: -3, vy: 1 }, set: { idea_viral: true } }, then: [
            ['nar', 'Bài của bạn được 11.000 reaction. Nhiều hơn bài anh Kevin. Đó là vấn đề.'],
          ] },
        ] },
      ],
    },
    {
      who: 'kevin', obj: 'Anh Kevin muốn "quick sync"', time: '16:30',
      scene: [
        { if: f('idea_viral'), then: [
          ['kevin', 'Anh thấy bài của em. Viral ghê. Anh rất vui cho em. Rất vui.'],
          ['kevin', 'Chỉ là lần sau, những gì liên quan tới sản phẩm, mình align với team truyền thông trước nha. Mình là một gia đình.'],
          ['think', 'Team truyền thông là anh Kevin.'],
        ], else: [
          ['kevin', 'Giỏ Chung đang hot. Anh cần em ở squad làm Giỏ Chung. Em hiểu ý tưởng này nhất mà. Haha.'],
          { if: f('idea_tagged'), then: [['kevin', 'Comment của em… dễ thương. Anh sửa bài rồi đó. Fair chưa?']] },
        ] },
        { c: 'tech_kevin_gio', o: [
          { t: '"Dạ, em muốn làm Giỏ Chung ạ."', fx: { rel: { kevin: 1, diep: 1 }, set: { on_gio_chung: true } }, then: [['kevin', 'Perfect. Ra mắt thứ Tư tuần sau. Duy book KOL rồi. Hai tiếng thôi. Haha. Đùa. Một tuần.']] },
          { t: '"Anh có thể ghi credit cho team hackathon trong bài ra mắt không ạ?"', fx: { uy: 2, rel: { kevin: -1 } }, then: [['kevin', 'Để anh suy nghĩ.'], ['think', 'Anh Kevin "suy nghĩ" giống Tanaka-san "kentou shimasu".']] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.idea_viral ? 'Bài của mình viral hơn bài anh Kevin. Đó là một chiến thắng. Và có lẽ là một sai lầm.'
    : s.flags.idea_tagged ? 'Mình comment dưới bài anh Kevin. Anh sửa thành "một bạn trong team". Không tên, nhưng không còn là "một đêm mất ngủ".'
    : 'Mình im lặng. Anh Thạc nói anh biết là của mình. Jira ghi tên mình. Jira không có nút like.',
};

const JP_MINI = {
  type: 'quiz', title: 'Tiếng Nhật công sở cấp tốc (của anh Hiếu)', icon: '🗾',
  prompt: 'Đọc mail của Tanaka-san cho đúng ý. Sai một chữ là sai một hợp đồng.', time: 40, pass: 0.75,
  questions: [
    { q: '"お世話になっております" ở đầu mail nghĩa là…', options: ['Lời chào công việc lịch sự, mail nào cũng có', 'Khách đang rất giận', 'Khách mời đi nhậu'], correct: 0 },
    { q: 'Tanaka-san nói "検討します" (kentou shimasu: sẽ cân nhắc). Thường nghĩa là…', options: ['Đồng ý', 'Không, nhưng lịch sự', 'Mai trả lời'], correct: 1 },
    { q: '"残念です" (zannen desu) trong mail khách nghĩa là…', options: ['Hơi tiếc, không sao', 'Khách rất không hài lòng', 'Khách khen'], correct: 1 },
    { q: '"Hourensou" là…', options: ['Một kiểu cúi chào 45 độ', 'Báo cáo, liên lạc, thảo luận', 'Tên quán ramen gần văn phòng khách'], correct: 1 },
  ],
};
const BLAME_MINI = {
  type: 'pick', title: 'git log --follow voucher.js', icon: '🌳',
  prompt: 'Bug: voucher bị trừ hai lần. Tìm commit thật sự đổi logic (không phải commit format).', pick: 1, time: 25, pass: 1,
  items: [
    { text: 'style: format toàn bộ repo bằng Prettier', sub: 'Bạn · 2 tuần trước · 4.812 dòng' },
    { text: 'fix: typo trong comment', sub: 'Tùng · 3 tuần trước · 1 dòng' },
    { text: 'feat: áp voucher trước khi tính phí ship (tạm)', sub: 'Khải · 2022 · 3:12 sáng', correct: true },
    { text: 'chore: bump version', sub: 'Bot · tuần trước' },
    { text: 'wip', sub: 'Khải · 2022 · 3:40 sáng · chỉ sửa README' },
  ],
};
const STORE_MINI = {
  type: 'order', title: 'Cứu buổi ra mắt: nộp lại bản build', icon: '📲',
  prompt: 'App Store từ chối vì thiếu nút xóa tài khoản. KOL đăng lúc 20:00. Làm đúng thứ tự.', time: 30, pass: 0.8,
  items: [
    { text: 'Thêm nút "Xóa tài khoản" trong Cài đặt', order: 0 },
    { text: 'Chị Nguyệt test luồng xóa trên 2 máy (bản dev)', order: 1 },
    { text: 'Build bản phát hành, tăng số phiên bản', order: 2 },
    { text: 'Nộp lại kèm ghi chú cho người duyệt', order: 3 },
    { text: 'Xin xét duyệt nhanh, báo Duy dời giờ KOL nếu cần', order: 4 },
  ],
};
const AI_MINI = {
  type: 'pick', title: '"AI" gợi ý thực đơn trong 1 ngày', icon: '🍲',
  prompt: 'Muốn demo thật, chỉ dùng dữ liệu đang có. Chọn 3 nguồn dùng được ngay.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Lịch sử mua 3 tháng của người dùng', correct: true },
    { text: 'Món hay được mua chung (rau muống + tỏi)', correct: true },
    { text: 'Mùa vụ: tháng này rau gì rẻ', correct: true },
    { text: 'Khẩu vị cả nhà đoán từ ảnh đại diện' },
    { text: 'Dữ liệu sức khỏe từ đồng hồ thông minh', sub: 'chưa có, chưa xin phép' },
    { text: 'Một mô hình AI "tự học", anh Kevin nghe ở hội thảo' },
  ],
};

const QUICK_SYNC = {
  id: 'quick_sync', day: 24, title: '"Quick sync 15 phút"',
  intro: 'Thứ Tư, 8:47. Lịch của bạn có một cuộc họp mới: "Quick sync 15 phút" với chị Ngân, 9:00, phòng "Bún Bò". Không mô tả.\n\nTrên Slack, avatar của 12 người trong #squad-growth vừa chuyển sang màu xám: "deactivated".',
  noReview: true,
  steps: [
    {
      who: 'obj:desk', obj: '8:50 Về bàn: lịch họp lạ và 12 avatar xám', time: '08:50',
      scene: [
        ['nar', '#random im lặng. Hôm qua kênh này còn bàn chuyện "công ty X vừa layoff 30%". Không ai nhắc tới công ty mình.'],
        ['tung', '(không quay đầu) Em có lịch "quick sync" hả. Anh cũng có. Lúc 9:15. Đừng nhìn anh, anh đang bình tĩnh.'],
        { c: 'tech_qs_before', o: [
          { t: 'Hỏi nhóm Zalo "Lúa Mobile ❌ sếp" xem có ai biết gì.', fx: { dr: 3, rel: { tung: 1 }, set: { layoff_leak: true } }, then: [
            { chat: [['tung', 'nghe nói danh sách có 14 người. growth bay gần hết. squad AI giữ vì anh Kevin thích', false], ['nguyet', 'đừng forward gì ra ngoài nha mấy đứa', false]] },
            ['think', 'Mình biết danh sách trước khi bước vào phòng. Không biết vậy là tốt hay tệ.'],
          ] },
          { t: 'Hít thở. Đi thẳng vào phòng họp.', fx: { nl: -3 }, then: [['think', 'Mười lăm phút. Mười lăm phút thôi.']] },
        ] },
      ],
    },
    {
      who: 'ngan', obj: '9:00 Quick sync với chị Ngân ở phòng họp', time: '09:00', pos: { ngan: 'meeting_head', thao: 'mr_n1' },
      scene: [
        ['ngan', 'Ngồi đi em. Em đừng lo, em không có trong danh sách. Chị chỉ muốn… thông báo một chút thay đổi.'],
        ['thao', 'Công ty tái cấu trúc. 14 người nghỉ hôm nay, chủ yếu Growth và CS. Em được giữ lại.'],
        ['ngan', 'Và vì team mỏng đi, em sẽ hỗ trợ thêm phần việc của hai bạn vừa… chuyển sang hành trình mới.'],
        ['think', 'Được giữ lại. Với tiền thưởng là việc của hai người.'],
        { c: 'tech_quicksync', o: [
          { t: '"Em hỏi thẳng: tiêu chí chọn người nghỉ là gì ạ?"', fx: { uy: 4, dr: 2, rel: { ngan: -1, thao: 2 }, set: { layoff_asked: true } }, then: [
            ['ngan', 'Ơ… tiêu chí là… hiệu quả, chiến lược, và…'],
            ['thao', 'Chi phí. Mảng nào chưa ra tiền thì cắt trước. Không phải do người làm dở. Em có quyền được biết điều đó.'],
            ['ngan', '(nhỏ) Chiều chị gửi email cho cả công ty, ghi rõ tiêu chí. Chị hứa.'],
          ] },
          { t: '"Dạ em hiểu ạ." Nhận việc, không hỏi.', fx: { nl: -8, rel: { ngan: 2 }, set: { layoff_quiet: true } }, then: [
            ['ngan', 'Cảm ơn em. Em đúng là người của gia đình.'],
            ['think', 'Gia đình này vừa cho mười bốn người con ra ở riêng. Lúc 9 giờ sáng.'],
          ] },
          { t: '"Hai bạn đó có được trợ cấp và báo trước đàng hoàng không ạ?"', fx: { uy: 2, rel: { thao: 1 } }, then: [
            ['thao', 'Có. Một tháng lương, chốt sổ bảo hiểm đầy đủ. Ít nhất cái đó chị làm đúng.'],
            ['nar', '(Thông tin giải trí, không phải tư vấn pháp lý: cho nghỉ vì lý do kinh tế phải theo đúng thủ tục và báo trước theo luật.)'],
          ] },
        ] },
        ['nar', 'Quick sync 15 phút kéo dài 15 phút. Lần đầu tiên một cuộc họp ở đây đúng giờ. Đó là điều đáng sợ nhất.'],
      ],
    },
    {
      who: 'duy', obj: 'Duy đứng một mình ở bàn Growth', time: '10:30',
      scene: [
        ['nar', 'Dãy bàn Growth trống. Chỉ còn Duy, một cây xương rồng, và cái standee "We\'re hiring!".'],
        ['duy', 'Anh được giữ lại. Em biết vì sao không? Vì anh book 5 KOL cho Giỏ Chung rồi. Công ty giữ anh để… hủy KOL. Hoặc không hủy.'],
        ['duy', 'Team anh 13 người. Giờ còn anh. "Ship nhanh, test sau". Họ ship luôn cả tụi anh.'],
        { c: 'tech_duy_human', o: [
          { t: 'Ngồi xuống, giúp Duy gửi thư giới thiệu cho từng bạn trong team.', fx: { nl: -6, rel: { duy: 3 }, uy: 1 }, then: [
            ['duy', 'Em… ừ. Làm cái đó đi. Anh viết, em kiểm tra chính tả. Anh hay viết "Đặt hàg".'],
          ] },
          { t: '"Anh có muốn đi ăn trưa với tụi em không?"', fx: { rel: { duy: 2 } }, then: [['duy', 'Có. Lần đầu tiên trong năm anh ăn trưa không nhìn dashboard.']] },
        ] },
      ],
    },
    {
      who: 'hieu', obj: 'Giờ trưa: ăn với cả nhóm ở pantry', time: '12:00', pos: LUNCH_POS,
      scene: [
        ['nar', 'Bữa trưa im lặng nhất từ trước tới giờ. Mèo 404 nằm trên ghế của một người vừa nghỉ.'],
        ['hieu', 'Nói vui cho đỡ buồn: team Nhật không ai bị cắt. Vì tiền lương cả công ty tháng này là tiền của Tanaka-san.'],
        ['nguyet', 'Chị giữ lại 7 cái điện thoại test của bạn CS vừa nghỉ. Bạn ấy dán sticker mèo lên từng cái.'],
        ['vy', 'Mình đang sửa portfolio. Không phải để đi. Chỉ là… cập nhật.'],
        { c: 'tech_qs_lunch', o: [
          { t: 'Đề xuất cả nhóm viết lời giới thiệu LinkedIn cho những người vừa nghỉ.', fx: { uy: 2, rel: { nguyet: 1, vy: 1, hieu: 1 } }, then: [['nar', 'Chiều đó #kudos có 14 bài giới thiệu. Bài nào cũng có ít nhất 20 người ký tên.']] },
          { t: 'Hỏi anh Hiếu về team Nhật.', fx: { rel: { hieu: 2 }, set: { asked_hieu: true } }, then: [['hieu', 'Tốt nhất là em đừng hỏi. Vì có khi mai em được "mượn" qua bên anh.'], ['think', 'Anh Hiếu nói "có khi" bằng giọng của người đã biết chắc.']] },
        ] },
        { fx: { nl: 20 } },
      ],
    },
    {
      who: 'kevin', obj: '16:00 Anh Kevin họp toàn công ty ở bảng Scrum', time: '16:00', pos: ALLHANDS_POS,
      scene: [
        ['kevin', 'Team, hôm nay là một ngày khó khăn. Mình right-size để đi xa hơn. Mình vẫn là một gia đình. Một gia đình gọn hơn.'],
        ['kevin', 'Series B đang ở vòng cuối. Giỏ Chung ra mắt tuần sau. We\'re still winning.'],
        { if: f('layoff_asked'), then: [{ chat: [['ngan', '[Email toàn công ty] Tiêu chí tái cấu trúc: ưu tiên giữ mảng tạo doanh thu. Không đánh giá năng lực cá nhân.', false]] }, ['think', 'Email tới thật. Lần đầu.']] },
        { c: 'tech_qs_allhands', o: [
          { t: 'Vỗ tay cùng mọi người.', fx: { rel: { kevin: 1 } }, then: [['nar', 'Tiếng vỗ tay thưa. Anh Thạc không vỗ. Anh nhìn xuống sàn.']] },
          { t: 'Giơ tay hỏi: "Runway của mình còn bao lâu ạ?"', fx: { uy: 3, dr: 4, rel: { kevin: -2, thac: 1 }, set: { asked_runway_public: true } }, then: [
            ['kevin', 'Câu hỏi hay! Mình sẽ có AMA thứ Sáu tuần sau để trả lời mọi thứ. Flat mà.'],
            ['think', 'Một câu trả lời được hẹn lại chín ngày. Giống một ticket.'],
          ] },
        ] },
      ],
    },
  ],
  diary: (s) => `Hôm nay 14 người nghỉ. Mình được giữ lại, kèm việc của hai người. ${s.flags.layoff_asked ? 'Mình hỏi tiêu chí. Chị Thảo trả lời thật. Chị Ngân gửi email thật.' : 'Mình không hỏi gì. Mình gật đầu.'} Quick sync 15 phút đúng 15 phút. Đáng sợ.`,
};

const OUTSOURCING = {
  id: 'outsourcing', day: 25, title: '"Đi đày": dự án Nhật',
  intro: 'Thứ Năm. Sau "quick sync", bạn được "mượn" sang Nợ Kỹ Thuật Solutions: mảng outsource cho khách Nhật.\n\nAi cũng gọi là "đi đày". Ở đó có 1.200 test case, một Q&A list đã tới dòng 147, và Tanaka-san gửi mail lúc 7:00 sáng giờ Việt Nam: "Why bug?"',
  steps: [
    {
      who: 'hieu', obj: 'Qua bàn anh Hiếu (BrSE) nhận việc', time: '09:00',
      scene: [
        ['hieu', 'Chào mừng em đến với "đày". Ở đây không có anh Kevin, không có LinkedIn. Chỉ có spec 200 trang và deadline là deadline.'],
        ['hieu', 'Mail sáng nay của Tanaka-san. Đọc giúp anh. Anh đọc rồi, nhưng anh muốn có người buồn cùng.'],
        { mini: JP_MINI,
          good: [['hieu', 'Em đọc ra ý khách thật, không đọc nghĩa đen. Em hiểu tiếng Nhật công sở nhanh hơn anh hồi mới vào.'], { fx: { uy: 3, rel: { hieu: 2 }, set: { jp_ok: true } } }],
          bad: [['hieu', 'Đọc nghĩa đen là chết em. Năm 2022 có bạn tưởng "kentou shimasu" là đồng ý, rồi team code ba tuần cho tính năng khách đã từ chối.'], { fx: { nl: -3 } }],
        },
      ],
    },
    {
      who: 'call:hieu', obj: '10:30 Call với Tanaka-san (anh Hiếu dịch)', time: '10:30',
      call: { title: 'Weekly · Tanaka-san <> Nợ Kỹ Thuật Solutions', people: ['tanaka', 'hieu', 'me'] },
      scene: [
        ['tanaka', 'Why bug? Q&A số 147. Màn hình đăng nhập, nút "Login" lệch 2 pixel.'],
        ['think', 'Ở đâu cũng có 2 pixel. Vy sẽ thích Tanaka-san.'],
        ['hieu', 'Tanaka-san hỏi tại sao có lỗi. Và tại sao lỗi này không có trong báo cáo hôm qua.'],
        { c: 'tech_tanaka', o: [
          { t: 'Xin lỗi đúng mực, báo nguyên nhân, hẹn giờ sửa, và hẹn báo cáo lại.', fx: { uy: 3, rel: { hieu: 2 } }, then: [
            ['tanaka', 'Hai, wakarimashita. Hourensou. Good.'],
            ['hieu', '(tắt mic) "Good". Anh làm hai năm mới nghe Tanaka-san nói "good" bốn lần. Em lần đầu đã có.'],
          ] },
          { t: 'Giải thích: spec không ghi kích thước nút ạ.', fx: { dr: 3, rel: { hieu: -1 } }, then: [
            ['tanaka', '…Zannen desu.'],
            ['hieu', '(tắt mic) Em đúng. Nhưng đúng với khách Nhật không cứu được hợp đồng. Hourensou trước, cãi sau.'],
          ] },
          { t: 'Hứa sửa xong trong 30 phút.', fx: { nl: -6, rel: { hieu: 1 } }, then: [
            ['tanaka', 'Thirty minutes. Hai. Matte imasu.'],
            ['nar', 'Bạn sửa xong trong 52 phút. Q&A list có thêm dòng 148: "Về thời gian ước tính".'],
          ] },
        ] },
      ],
    },
    {
      who: 'hieu', obj: 'Anh Hiếu giao 1.200 test case', time: '13:30',
      scene: [
        ['hieu', '1.200 test case thủ công. Nghiệm thu thứ Sáu tuần sau. Ba người làm. Hai người vừa bị kéo về làm Giỏ Chung. Còn em.'],
        { c: 'tech_exile', o: [
          { t: 'Viết script tự động hóa 300 case lặp lại, làm tay phần còn lại.', fx: { nl: -8 }, then: [
            ['hieu', 'Script? Khách Nhật không tin script. Họ tin con người. Người ngồi bấm.'],
            ['nar', 'Chiều thứ Sáu: script chạy 300 case trong 12 phút, bắt được 4 lỗi người làm tay bỏ sót. Anh Hiếu im lặng in kết quả.'],
            { fx: { uy: 6, rel: { hieu: 2, thac: 1 }, set: { exile_script: true } } },
          ] },
          { t: 'Cắm mặt làm tay, học thêm vài câu tiếng Nhật.', fx: { nl: -12, uy: 2, rel: { hieu: 3 }, set: { exile_loyal: true } }, then: [
            ['hieu', 'Em chăm quá. Tanaka-san sẽ thích em. Mà khách thích ai thì… thường bị giữ lại "đày" luôn đó.'],
          ] },
          { t: 'Xin quay về sản phẩm chính.', fx: { uy: -2, rel: { hieu: -2, diep: 1 }, set: { exile_return: true } }, then: [
            ['hieu', 'Ừ. Anh hiểu. Ai cũng muốn về Lúa. Ở đây không có LinkedIn.'],
            ['diep', '(trên Slack) Chị xin được em về từ thứ Hai. Nhưng anh Kevin ghi chú "kén việc". Chị xóa rồi. Anh ấy ghi lại.'],
          ] },
        ] },
      ],
    },
    {
      who: 'thao', obj: 'Chị Thảo (COO) gọi qua phòng', time: '16:30',
      scene: [
        ['thao', 'Em đang ở team Nhật hả. Chị nói em nghe một con số. Lương tháng này của cả công ty: 62% đến từ hợp đồng Tanaka-san.'],
        ['thao', 'App Lúa là giấc mơ. Outsource là cơm. Ở all-hands không ai nhắc tới cơm.'],
        { c: 'tech_thao_rice', o: [
          { t: '"Vậy sao mọi người gọi là đi đày ạ?"', fx: { rel: { thao: 2 } }, then: [['thao', 'Vì không có ảnh trên LinkedIn. Ở đây người ta được nhớ vì giấc mơ, không phải vì cơm.']] },
          { t: '"Em sẽ làm cho xong nghiệm thu ạ."', fx: { uy: 2, rel: { thao: 1, hieu: 1 } }, then: [['thao', 'Cảm ơn em. Nghiệm thu xong chị mới xuất hóa đơn. Hóa đơn xong thì mới có lương. Chuỗi thức ăn.']] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.exile_script ? 'Ngày đi đày. Script của mình chạy 300 case trong 12 phút. Anh Hiếu im lặng in kết quả. Im lặng kiểu tôn trọng.'
    : s.flags.exile_loyal ? 'Ngày đi đày. Mình học được "zannen desu" nghĩa là khách đang rất không vui. Và "hourensou" không phải là rau.'
    : 'Mình xin về sản phẩm chính. Anh Kevin ghi chú "kén việc". Chị Thảo bảo lương công ty là tiền của Tanaka-san.',
};

const PROD_BLAME = {
  id: 'prod_blame', minDay: 29, maxDay: 30, title: 'git blame (blameless)',
  intro: 'Đầu tuần. Cuối tuần qua, voucher trên app Lúa bị trừ hai lần cho 1.300 đơn. Bug P1.\n\nPostmortem "blameless" lúc 14:30. Trong file postmortem, dòng "Nguyên nhân" đã có sẵn một cái tên. Tên bạn.',
  steps: [
    {
      who: 'diep', obj: '9:30 Daily: bug voucher P1', time: '09:30', pos: STANDUP_POS,
      scene: [
        ['diep', 'Daily hôm nay ngắn. Bug voucher P1. Anh Khải đã chạy git blame. Dòng lỗi… hiện tên {ten}.'],
        ['khai', 'Dòng 214, voucher.js. Commit hai tuần trước.'],
        ['think', 'Hai tuần trước mình chạy Prettier format cả repo. 4.812 dòng. Theo git, mình là tác giả của mọi thứ.'],
        ['nguyet', '(thì thầm) Bug này chị đã ghi vào file Excel năm 2023. Dòng 88.'],
        { fx: { dr: 2 } },
      ],
    },
    {
      who: 'obj:desk', obj: 'Về bàn: đào lại lịch sử commit', time: '10:00',
      scene: [
        ['nar', 'Bạn mở terminal. git log --follow. Lịch sử của voucher.js dài như một bộ phim truyền hình.'],
        { mini: BLAME_MINI,
          good: [['think', '"feat: áp voucher trước khi tính phí ship (tạm)". Khải. 2022. 3:12 sáng. Chữ "tạm" đã sống bốn năm.'], { fx: { uy: 2, set: { blame_found: true } } }],
          bad: [['think', 'Mình mở nhầm commit. Đọc diff mười phút mới biết nó không đụng gì tới logic voucher.'], { fx: { nl: -3 } }],
        },
      ],
    },
    {
      who: 'khai', obj: 'Nói chuyện với anh Khải trước postmortem', time: '11:00',
      scene: [
        ['khai', 'Em muốn nói gì trước postmortem?'],
        { if: f('blame_found'), then: [['think', 'Mình có commit gốc. Tên anh Khải. Ba giờ sáng năm 2022.']] },
        { c: 'tech_blame', o: [
          { t: 'Đưa diff: commit của em chỉ là format, logic gốc từ 2022.', when: f('blame_found'), fx: { uy: 4, rel: { khai: -2 }, set: { blame_proved: true } }, then: [
            ['khai', '…Commit của anh. Ba giờ sáng. Hôm đó vợ anh sinh. Anh code trong bệnh viện.'],
            ['khai', 'Ok. Em đúng. Anh sửa postmortem.'],
          ] },
          { t: 'Đề xuất bỏ qua commit format khi blame, và thêm checklist review cho voucher.', fx: { uy: 6, nl: -4, rel: { khai: 2, diep: 2, thac: 1 }, set: { blame_fixed: true } }, then: [
            ['khai', 'File ".git-blame-ignore-revs". Anh biết nó tồn tại. Anh chưa bao giờ có thời gian. Em làm đi, anh review hôm nay.'],
            ['think', '"Hôm nay". Không phải "thứ Năm, nếu không có incident". Tiến bộ.'],
          ] },
          { t: 'Nhận lỗi cho êm.', fx: { uy: -2, rel: { khai: 2 }, set: { blame_took: true } }, then: [
            ['khai', '…Em chắc chứ?'],
            ['think', 'Mình không chắc. Mình chỉ mệt.'],
          ] },
        ] },
      ],
    },
    {
      who: 'thac', obj: 'Postmortem với anh Thạc', time: '14:30', pos: { thac: 'meeting_head', khai: 'mr_n1', diep: 'mr_n2' },
      scene: [
        ['thac', 'Postmortem. Blameless. Tức là mình tìm nguyên nhân hệ thống, không tìm người để treo.'],
        { if: (r) => r.flags.blame_proved || r.flags.blame_fixed, then: [
          ['khai', 'Nguyên nhân: logic tạm từ 2022, không có test. Không phải commit format của {ten}. Anh sửa dòng "Nguyên nhân".'],
          ['thac', 'Cảm ơn Khải. Và cảm ơn em. Đây là lần đầu postmortem ở đây blameless thật.'],
          { fx: { rel: { thac: 2 } } },
        ], else: [
          ['thac', 'File ghi nguyên nhân là commit của em. Em đã nhận. Anh ghi nhận tinh thần. Nhưng anh không tin một commit Prettier làm trừ voucher hai lần.'],
          ['thac', 'Khải, chiều nay xem lại giúp anh.'],
          ['khai', '(không nhìn ai) Ừ.'],
        ] },
        { if: f('blame_fixed'), then: [['diep', 'Checklist review voucher em đề xuất, chị đưa vào Definition of Done luôn. Có tên em ở footer.'], { fx: { uy: 2 } }] },
      ],
    },
    {
      who: 'khai', obj: 'Anh Khải ngồi lại sau giờ', time: '17:00',
      scene: [
        ['khai', 'Bảy mươi phần trăm hệ thống là anh viết. Không có docs. Mỗi lần có bug, git blame là tên anh.'],
        ['khai', 'Nên anh nói "it depends". Vì thật ra anh không còn nhớ hết nó phụ thuộc vào cái gì.'],
        { c: 'tech_khai_docs', o: [
          { t: '"Hay em với anh viết docs cho phần voucher, mỗi tuần một trang?"', fx: { uy: 3, nl: -4, rel: { khai: 3 }, set: { khai_docs: true } }, then: [
            ['khai', 'Một trang một tuần. Ok. Trang đầu tiên tên là "Vì sao voucher có chữ tạm". Em viết, anh kể.'],
          ] },
          { t: '"Anh nghỉ ngơi đi, mai tính tiếp ạ."', fx: { rel: { khai: 1 } }, then: [['khai', 'Ừ. Nghỉ. Cái đó cũng… it depends.']] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.blame_fixed ? 'Git blame ghi tên mình vì commit format. Mình đề xuất bỏ qua commit format khi blame. Postmortem lần đầu blameless thật.'
    : s.flags.blame_proved ? 'Mình đưa diff. Commit gốc của anh Khải, viết đêm vợ anh sinh. Mình đúng, nhưng thấy hơi buồn.'
    : 'Mình nhận lỗi cho một bug viết từ năm 2022. Anh Thạc không tin. Mình cũng không.',
};

const APPSTORE = {
  id: 'appstore_reject', day: 31, title: 'App Store từ chối · KOL 20:00',
  intro: 'Thứ Tư. Ngày ra mắt Giỏ Chung.\n\n5 KOL sẽ đăng bài lúc 20:00. Duy đã chuyển khoản cọc. Anh Kevin đã viết sẵn bài LinkedIn. Bản build iOS đang chờ duyệt.',
  steps: [
    {
      who: 'duy', obj: 'Duy cập nhật kế hoạch ra mắt', time: '09:00',
      scene: [
        ['duy', '20:00 KOL đăng. 20:05 anh Kevin đăng. 20:10 mình ăn mừng. 20:15 mình xem số. Kế hoạch hoàn hảo.'],
        ['duy', 'Sau quick sync anh là cả team Growth. Nên hôm nay mà fail thì… anh là cả cái fail.'],
        { c: 'tech_duy_plan', o: [
          { t: '"Anh có kế hoạch B nếu bản build chưa được duyệt không?"', fx: { uy: 2, rel: { duy: 1 } }, then: [['duy', 'Kế hoạch B là… cầu nguyện. Anh có thắp nhang Thần Tài rồi.']] },
          { t: '"Chắc chắn ổn mà anh!"', fx: { rel: { duy: 2 } }, then: [['duy', 'Đúng! Năng lượng tích cực. Growth chạy bằng năng lượng tích cực và tiền cọc.']] },
        ] },
      ],
    },
    {
      who: 'tung', obj: 'Tùng chạy tới, mặt tái', time: '11:00',
      scene: [
        ['tung', 'App Store từ chối rồi. Lý do: app cho tạo tài khoản mà không cho xóa tài khoản. Thiếu nút "Xóa tài khoản".'],
        ['tung', 'Trên máy em… à không, cái này không liên quan máy em. Lần này là lỗi thật.'],
        ['think', 'Lần đầu Tùng nói "lỗi thật". Đây là một ngày lịch sử.'],
        { fx: { dr: 2 } },
      ],
    },
    {
      who: 'diep', obj: 'Chị Diệp họp khẩn: còn 9 tiếng', time: '13:00',
      scene: [
        ['diep', 'Ok, mình có ba lựa chọn. Chị chấm theo framework "đừng hoảng". Em chọn hướng nào?'],
        { c: 'tech_store', o: [
          { t: 'Làm nhanh nút xóa tài khoản, test, nộp lại xin duyệt gấp.', fx: { nl: -8 }, then: [
            { mini: STORE_MINI,
              good: [['nar', 'Kế hoạch đúng thứ tự. Tùng code nút, chị Nguyệt chuẩn bị sẵn hai máy test. Còn thiếu màn hình từ Vy.'], { fx: { uy: 6, rel: { diep: 2, duy: 2, tung: 1 }, set: { store_fixed: true } } }],
              bad: [['nar', 'Kế hoạch lộn thứ tự. Bản build sẽ được nộp trước khi chị Nguyệt kịp test. Bạn chưa biết điều đó.'], { fx: { uy: 2, dr: 3, set: { store_late: true } } }],
            },
          ] },
          { t: 'Xin KOL dời lịch sang tuần sau.', fx: { rel: { duy: -2, diep: 1 }, uy: 1, set: { kol_delayed: true } }, then: [
            ['duy', 'Dời là mất phí dời. 30% tiền cọc. Anh sẽ phải giải trình với chị Thảo. Ok… ok.'],
          ] },
          { t: 'Để KOL đăng link bản web tạm.', fx: { dr: 2, rel: { duy: 1 }, set: { kol_web: true } }, then: [
            ['nar', 'Bản web tạm không có Giỏ Chung. Người dùng vào, tìm giỏ, không thấy giỏ, mua một bó rau muống, rồi đi.'],
          ] },
        ] },
      ],
    },
    {
      who: 'vy', obj: 'Vy vẽ màn "Xóa tài khoản"', time: '15:30',
      scene: [
        ['vy', 'Anh Kevin vừa nhắn mình: để nút xóa tài khoản ở tầng thứ năm của Cài đặt, chữ xám, cỡ 9. "Retention em ạ".'],
        ['vy', 'Mình vẽ được trong 20 phút. Nhưng bạn nghĩ sao? Mình ghét mấy cái dark pattern.'],
        { c: 'tech_darkpattern', o: [
          { t: 'Để nút rõ ràng trong Cài đặt › Tài khoản. Người ta có quyền rời đi.', fx: { uy: 3, rel: { vy: 3, kevin: -1 }, set: { honest_delete: true } }, then: [
            ['vy', 'Cảm ơn. Mình sẽ làm nó đẹp. Rời đi cũng nên đẹp.'],
          ] },
          { t: 'Theo ý anh Kevin, giấu kỹ.', fx: { dr: 3, rel: { kevin: 1, vy: -2 } }, then: [
            ['vy', 'Ok. Mình vẽ. Nhưng mình đặt tên file là "dark_pattern_theo_yeu_cau.fig". Để lịch sử nhớ.'],
          ] },
        ] },
      ],
    },
    {
      who: 'obj:desk', obj: '17:50 Về bàn chờ kết quả', time: '17:50',
      scene: [
        { if: f('store_fixed'), then: [
          ['nar', '(19:40) Bot #release: "Giỏ Chung · iOS · Ready for Sale 🙏". Duy hét lên một tiếng. Rồi gửi sticker con heo nhảy múa 14 lần.'],
          { chat: [['kevin', 'We shipped! Proud of the team 🚀', false], ['thac', 'cảm ơn em.', true]] },
        ] },
        { if: f('store_late'), then: [['nar', '(18:30) Bị từ chối lần hai: nút xóa tài khoản… không xóa gì. KOL đăng 20:00 với link chưa mở được. 22:10 app lên.'], ['nar', 'Bình luận đầu tiên dưới bài KOL: "app đâu ạ?"']] },
        { if: f('kol_delayed'), then: [['nar', 'Chị Thảo gửi Duy bảng tính phí dời KOL. Duy gửi bạn một emoji 💸. Ít nhất người dùng không vào một app trống.']] },
        { if: f('kol_web'), then: [['nar', 'Số liệu tối nay: 40.000 lượt vào web, 212 đơn, 0 giỏ chung. Anh Kevin đăng LinkedIn: "40K visits in one night".']] },
        ['nar', 'Mèo 404 nằm trên bàn phím của bạn. Màn hình hiện 4.000 chữ "j". Bạn không xóa. Hôm nay nó xứng đáng.'],
      ],
    },
  ],
  diary: (s) => s.flags.store_fixed ? 'Giỏ Chung lên App Store lúc 19:40. KOL đăng đúng giờ. Duy hét. Anh Thạc nhắn "cảm ơn em", không có emoji. Đó là emoji của anh ấy.'
    : s.flags.kol_delayed ? 'Mình chọn dời KOL. Mất 30% tiền cọc. Chị Thảo thở dài. Nhưng không ai vào một cái app trống.'
    : 'Giỏ Chung ra mắt không như kế hoạch. Mình học được một luật mới: luôn có nút "Xóa tài khoản".',
};

const AMA = {
  id: 'ama_runway', day: 33, title: 'All-hands & AMA: "Runway còn bao lâu?"',
  intro: 'Thứ Sáu cuối tháng. All-hands 15:30, sau đó happy hour (pizza, bia).\n\nChị Ngân mở form "Ask Me Anything" ẩn danh. Form tự động thu thập email.',
  steps: [
    {
      who: 'ngan', obj: 'Chị Ngân mời gửi câu hỏi AMA', time: '09:45',
      scene: [
        ['ngan', 'Em gửi câu hỏi cho anh Kevin nha. Ẩn danh hoàn toàn! Form chỉ… ghi email để chị cảm ơn từng người thôi.'],
        { c: 'tech_ama_form', o: [
          { t: '"Chị tắt thu thập email đi rồi em gửi ạ."', fx: { uy: 2, rel: { ngan: 1 } }, then: [['ngan', 'Ơ… có nút đó hả? Ồ. Ok. Chị tắt rồi. Cảm ơn em. Chị thề là chị không biết.']] },
          { t: 'Không gửi. Hỏi trực tiếp nếu cần.', fx: { rel: { ngan: -1 } }, then: [['ngan', 'Can đảm ghê. Văn hóa flat là đây!']] },
        ] },
      ],
    },
    {
      who: 'thao', obj: 'Chị Thảo pha cà phê ở pantry', time: '13:30', pos: { thao: 'pantry' },
      scene: [
        ['thao', 'Chiều nay anh Kevin sẽ chiếu slide "Runway: 18 tháng". Tháng trước là 12. Em biết vì sao runway dài ra không?'],
        ['me', 'Dạ… vì cắt 14 người ạ?'],
        ['thao', 'Và vì cắt luôn ngân sách team building, pizza giảm còn 6 hộp, và lương tháng sau có thể về trễ một tuần.'],
        { if: f('chau_friend'), then: [{ chat: [['chau', 'chú mình bảo quỹ chưa ký Series B. "đang cân nhắc thêm". bạn đừng nói ai nha', true]] }] },
        { fx: { set: { knows_runway: true } } },
      ],
    },
    {
      who: 'kevin', obj: '15:30 All-hands & AMA ở bảng Scrum', time: '15:30', pos: ALLHANDS_POS,
      scene: [
        ['kevin', 'Team! Tháng này: Giỏ Chung ra mắt, MAU tăng, runway 18 tháng. We\'re winning!'],
        ['kevin', 'Anh vừa được mời đi hội thảo công nghệ ở Singapore, đại diện công ty. Giờ là AMA. Hỏi gì cũng được. Flat mà!'],
        ['nar', 'Im lặng. Ba mươi giây. Ai đó ho. Mèo 404 đi ngang qua bảng Scrum.'],
        { c: 'tech_ama', o: [
          { t: 'Giơ tay: "Runway 18 tháng là đã tính Series B chưa ạ?"', fx: { uy: 4, dr: 4, rel: { kevin: -2, thac: 2, thao: 1 }, set: { ama_asked: true } }, then: [
            ['kevin', 'Câu hỏi hay. Ừm. Có tính. Một phần. Series B đang ở vòng cuối. Anh lạc quan.'],
            ['thac', 'Để anh trả lời phần còn lại. Không tính Series B thì là 9 tháng. Mọi người có quyền biết.'],
            ['nar', 'Cả phòng nhìn anh Thạc. Rồi nhìn bạn. Rồi nhìn anh Kevin. Anh Kevin nhìn ring light.'],
          ] },
          { t: '"Chuyến Singapore có dùng ngân sách team building không ạ?"', fx: { dr: 6, rel: { kevin: -3, duy: 1 }, set: { ama_spicy: true } }, then: [
            ['kevin', 'Haha. Chuyến đi là đầu tư cho thương hiệu. Team building là… tinh thần. Cả hai đều quan trọng.'],
            ['duy', '(nhỏ) huyền thoại.'],
          ] },
          { t: 'Vỗ tay, không hỏi.', fx: { nl: 3, rel: { kevin: 1 } }, then: [['nar', 'AMA kết thúc sau 4 phút. Chị Ngân đọc câu hỏi ẩn danh duy nhất: "Pizza hôm nay có mấy hộp?"']] },
        ] },
      ],
    },
    {
      who: 'thac', obj: 'Happy hour: tìm anh Thạc', time: '17:00', pos: { thac: 'pantry' },
      scene: [
        ['nar', 'Pizza đã hết. Còn hai lon bia và một hộp giấy có vết phô mai. Anh Thạc đứng một mình ở pantry.'],
        { if: f('ama_asked'), then: [
          ['thac', 'Câu hỏi hay. Anh định nói con số đó từ ba tháng trước. Anh cần một người hỏi.'],
          { fx: { rel: { thac: 2 }, set: { thac_noticed: true } } },
        ], else: [
          ['thac', 'Hết pizza rồi. Ở đây người làm thật luôn tới sau pizza. Anh cũng vậy, hồi mới mở công ty.'],
        ] },
        { c: 'tech_thac_beer', o: [
          { t: 'Chia anh Thạc một lon bia, hỏi chuyện năm 2021.', fx: { rel: { thac: 2 }, set: { drank_today: true } }, then: [
            ['thac', 'Năm 2021 có bốn người và một cái router. Anh Kevin lúc đó tên Quân, chưa có ring light. Anh nhớ Quân.'],
          ] },
          { t: 'Hỏi anh Thạc có định nghỉ không.', fx: { dr: 1, rel: { thac: 1 } }, then: [['thac', '…Em hỏi câu khó nhất ngày hôm nay. Khó hơn câu runway.'], ['think', 'Anh ấy không trả lời "không".']] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.ama_asked ? 'AMA. Mình hỏi runway. Anh Thạc trả lời thật: 9 tháng nếu không có Series B. Anh Kevin nhìn ring light.'
    : s.flags.ama_spicy ? 'Mình hỏi về chuyến Singapore. Duy gọi mình là huyền thoại. Anh Kevin chắc gọi mình bằng một từ khác.'
    : 'All-hands. Runway 18 tháng. Pizza 6 hộp. Mình vỗ tay. Pizza hết trước khi mình tới.',
};

const SALARY_SHEET = {
  id: 'salary_sheet', minDay: 34, maxDay: 38, title: 'Finance_2026 (anyone with link)',
  intro: 'Một buổi sáng. Bạn tìm file spec cũ trên Google Drive và lạc vào thư mục "Finance_2026".\n\nTrong đó có file "Luong_T10.xlsx". Quyền chia sẻ: "Bất kỳ ai có đường liên kết đều có thể xem".',
  steps: [
    {
      who: 'obj:desk', obj: 'Mở thư mục "Finance_2026" lạ', time: '09:30',
      scene: [
        ['nar', 'Bạn không định mở. Nhưng bạn đã mở. Dòng 47: "Châu · Intern PM · 9.000.000".'],
        ['think', 'Gấp ba phụ cấp của intern bình thường. Cùng ghế. Cùng cái MacBook pin 40 phút.'],
        { c: 'tech_sheet', o: [
          { t: 'Đóng file. Báo chị Ngân tắt quyền chia sẻ, không nói gì thêm.', fx: { uy: 3, rel: { ngan: 3, thao: 2 }, set: { sheet_reported: true } }, then: [['think', 'Mình biết rồi. Nhưng không phải ai cũng cần biết.']] },
          { t: 'Gửi link vào nhóm intern.', fx: { dr: 8, rel: { chau: -3, ngan: -2 }, set: { sheet_leaked: true } }, then: [['nar', 'Ba phút sau nhóm intern có 84 tin nhắn. Bảy phút sau có người đề xuất "đàm phán tập thể".']] },
          { t: 'Giữ lại thông tin cho lúc deal lương.', fx: { dr: 2, set: { sheet_kept: true } }, then: [['think', 'Thông tin là quyền lực. Cũng là một tảng đá trong túi.']] },
        ] },
      ],
    },
    {
      who: 'ngan', obj: 'Chị Ngân tìm bạn', time: '11:00',
      scene: [
        { if: f('sheet_reported'), then: [
          ['ngan', 'Em ơi. Cảm ơn em. Thật. Nếu file đó lộ ra thì chị… chị không biết viết email xin lỗi cả công ty kiểu gì.'],
          ['ngan', 'Chị nợ em một lần. Chị không quên đâu. People & Culture cũng là người.'],
          { fx: { set: { ngan_owes: true } } },
        ] },
        { if: f('sheet_leaked'), then: [
          ['ngan', 'Em có gửi file lương vào nhóm intern không? Chị không hỏi để phạt. Chị hỏi để biết mình đang cháy ở đâu.'],
          { c: 'tech_sheet_admit', o: [
            { t: 'Nhận là mình gửi.', fx: { uy: 1, rel: { ngan: 1 } }, then: [['ngan', 'Cảm ơn em đã nói thật. Lỗi đầu tiên là của chị: để file public. Lỗi thứ hai là của em. Mình cùng dọn.']] },
            { t: '"Em không biết ạ."', fx: { dr: 3, rel: { ngan: -2 } }, then: [['ngan', 'Ừ. Lịch sử truy cập file ghi email của em. Nhưng ok.']] },
          ] },
        ] },
        { if: f('sheet_kept'), then: [
          ['ngan', 'Em có thấy file nào lạ trên Drive không? Chị vừa phát hiện một thư mục để public. Chị đang run.'],
          ['think', 'Mình đã thấy. Và mình đã im lặng.'],
        ] },
      ],
    },
    {
      who: 'chau', obj: 'Châu ngồi ở bàn, mắt đỏ', time: '14:00',
      scene: [
        { if: f('sheet_leaked'), then: [['chau', 'Mọi người biết lương mình rồi. Giờ ai cũng nhìn mình như nhìn một khoản đầu tư sai.']], else: [['chau', 'Bạn ơi… có tin đồn file lương bị lộ. Mình sợ mọi người biết mình nhận nhiều hơn.']] },
        ['chau', 'Mình biết mình vào đây nhờ chú. Mình biết. Nhưng mình cũng muốn được đánh giá thật. Không ai cho mình cơ hội đó.'],
        { c: 'tech_chau_real', o: [
          { t: '"Vậy Châu tự xin chị Diệp review như mọi intern khác đi."', fx: { uy: 2, rel: { chau: 2, diep: 1 } }, then: [['chau', 'Review thật. Có điểm thật. Ừ. Mình sẽ xin. Kể cả nếu mình được C.']] },
          { t: 'Ngồi im bên cạnh Châu một lúc.', fx: { rel: { chau: 3 } }, then: [['nar', 'Hai người ngồi cạnh nhau. Một người lương 9 triệu, một người lương khác. Mèo 404 nằm giữa, không phân biệt ai.']] },
        ] },
      ],
    },
    {
      who: 'thao', obj: 'Chị Thảo gọi qua phòng', time: '16:00',
      scene: [
        ['thao', 'Chuyện file lương chị biết rồi. Lương của Châu là do anh Kevin quyết, nằm ngoài khung. Chị đã phản đối. Bằng email.'],
        ['thao', 'Em nhớ: ở startup, cái gì không có trong email thì chưa từng xảy ra. Cái gì có trong email thì sẽ quay lại.'],
        { c: 'tech_thao_email', o: [
          { t: '"Dạ em hiểu. Em sẽ ghi lại mọi việc quan trọng bằng email."', fx: { uy: 2, rel: { thao: 2 }, set: { email_trail: true } }, then: [['thao', 'Tốt. Đó là bảo hiểm thật của em.'], { if: (r) => r.status !== 'official', then: [['thao', 'Bảo hiểm xã hội thì đợi lên chính thức.']] }] },
          { t: '"Chị có định nghỉ không ạ?"', fx: { rel: { thao: 1 }, dr: 1 }, then: [['thao', 'Chị là người cuối cùng tắt đèn. Người cầm Excel không được bỏ chạy trước.']] },
        ] },
      ],
    },
  ],
  diary: (s) => s.flags.sheet_reported ? 'Mình thấy file lương và báo chị Ngân tắt quyền. Châu nhận gấp ba. Châu cũng không vui. Không ai vui.'
    : s.flags.sheet_leaked ? 'Mình gửi file lương vào nhóm intern. Drama lên như một con bug P0. Châu khóc. Mình không thấy thắng.'
    : 'Mình giữ bí mật file lương trong túi. Nó nặng hơn mình nghĩ.',
};

const AI_DEMO = {
  id: 'ai_demo', day: 36, title: 'Demo day: "AI" gợi ý thực đơn',
  intro: 'Thứ Hai. 15:00 hôm nay anh Kevin demo "AI gợi ý thực đơn" với quỹ Hạt Giống Ventures, lần cuối trước khi quỹ quyết Series B.\n\nAnh Kevin đã hứa tính năng này "hai tuần". Team estimate hai tháng. Đã qua ba tuần.',
  steps: [
    {
      who: 'kevin', obj: 'Anh Kevin gọi vào phòng CEO', time: '09:00',
      scene: [
        ['kevin', 'Hôm nay là ngày quan trọng nhất của công ty. Anh cần AI gợi ý thực đơn chạy được lúc 3 giờ chiều. Chạy được là được.'],
        ['kevin', 'Anh tin em. Em là người hiểu Giỏ Chung nhất. Giỏ Chung cộng AI bằng Series B. Đơn giản.'],
        { if: f('poker_honest'), then: [['think', 'Mình bênh lá 13 cho ticket này từ ngày 8. Hôm nay là ngày trả nợ.']] },
        { c: 'tech_demo_kevin', o: [
          { t: '"Dạ em sẽ làm bản demo trung thực nhất có thể ạ."', fx: { uy: 1, rel: { kevin: 1 } }, then: [['kevin', 'Trung thực và ấn tượng. Cả hai. Nhưng ưu tiên ấn tượng.']] },
          { t: '"Anh có muốn em báo trước với quỹ là bản prototype không ạ?"', fx: { uy: 2, rel: { kevin: -1 } }, then: [['kevin', 'Prototype là từ của người thiếu tự tin. Mình nói "early access".']] },
        ] },
      ],
    },
    {
      who: 'diep', obj: 'Chị Diệp chốt phạm vi demo', time: '10:00',
      scene: [
        ['diep', 'Framework hôm nay là "survive". Em có sáu tiếng. Em định làm gì?'],
        { c: 'tech_demo', o: [
          { t: 'Làm bản nhỏ thật: gợi ý từ lịch sử mua và mùa vụ, không gọi là "AI thần kỳ".', fx: { nl: -6 }, then: [
            { mini: AI_MINI,
              good: [['diep', 'Gợi ý từ lịch sử mua + mua chung + mùa vụ. Chạy thật. Đo được. Chị gọi nó là "AI cấp 1". Trung thực mà vẫn sexy.'], { fx: { uy: 6, rel: { diep: 2, thac: 1 }, set: { demo_small: true } } }],
              bad: [['diep', 'Nguồn này chưa có, nguồn kia chưa xin phép. Thôi. Mình dùng lịch sử mua. Chị làm cùng em.'], { fx: { uy: 2, nl: -4, set: { demo_small: true } } }],
            },
          ] },
          { t: 'Hardcode kết quả cho tài khoản demo. Trơn tru 100%.', fx: { dr: 5, rel: { kevin: 2, khai: -1 }, set: { demo_hardcode: true } }, then: [
            ['khai', 'If user == "demo_kevin" return thực đơn đẹp. Anh từng viết dòng này năm 2022. Nó vẫn còn trong code. Em biết rồi đó.'],
          ] },
          { t: 'Làm demo kèm dòng "Prototype · dữ liệu mẫu" ngay trên màn hình.', fx: { uy: 3, rel: { kevin: -2, thac: 1 }, set: { demo_label: true } }, then: [
            ['diep', 'Dòng chữ đó anh Kevin sẽ xóa. Nhưng ít nhất em đã viết nó.'],
          ] },
        ] },
      ],
    },
    {
      who: 'call:kevin', obj: '15:00 Demo với quỹ: anh Kevin share màn hình', time: '15:00',
      call: { title: 'Nợ Kỹ Thuật Labs <> Hạt Giống Ventures · Demo', people: ['kevin', 'victor', 'me'] },
      scene: [
        ['victor', 'Show me the AI.'],
        { if: f('demo_hardcode'), then: [
          ['nar', 'Thực đơn hiện ra trong 0,2 giây. Hoàn hảo. Quá hoàn hảo.'],
          ['victor', 'Impressive. Khi nào ra mắt cho tất cả người dùng? Tháng sau?'],
          ['kevin', 'Dạ… tháng sau anh.'],
          ['think', 'Tháng sau. Cho một tính năng chỉ chạy với đúng một tài khoản.'],
          { fx: { dr: 4, set: { promised_ai: true } } },
        ] },
        { if: f('demo_label'), then: [
          ['nar', 'Anh Kevin share màn hình. Dòng "Prototype · dữ liệu mẫu" đã bị che bằng một sticker Lúa. Đúng như chị Diệp nói.'],
          ['victor', 'Nice. What\'s the data behind it?'],
          ['me', 'Dạ hiện tại là dữ liệu mẫu ạ. Bản thật cần thêm sáu tuần.'],
          ['victor', 'Thank you for being honest. Hiếm đấy.'],
          { fx: { rel: { victor: 2, kevin: -1 } } },
        ] },
        { if: f('demo_small'), then: [
          ['nar', 'Bạn chọn một người dùng thật. Hệ thống gợi ý: "Canh chua cá lóc: bạn hay mua cá lóc thứ Sáu, và me đang vào mùa".'],
          ['victor', 'Simple. But real. Mấy phần trăm người dùng có đủ dữ liệu để gợi ý?'],
          ['me', 'Dạ 31% ạ. Những người mua từ ba lần trở lên.'],
          ['victor', 'Một con số không tròn. Tôi thích. Ai làm phần này?'],
          { fx: { rel: { victor: 3 }, set: { victor_noticed: true } } },
        ] },
        ['kevin', 'Cảm ơn anh Victor. Team em là một gia đình. Gia đình rất… AI.'],
      ],
    },
    {
      who: 'thac', obj: 'Anh Thạc ngồi ở pantry sau demo', time: '17:00', pos: { thac: 'pantry' },
      scene: [
        { if: f('demo_hardcode'), then: [['thac', 'Tháng sau. Cho tất cả người dùng. Anh vừa thêm một dòng vào danh sách "những lời hứa anh phải trả".']] },
        { if: f('demo_small'), then: [['thac', 'Demo thật. Anh Victor hỏi ai làm. Anh Kevin trả lời "team". Anh trả lời tên em.']] },
        { if: f('demo_label'), then: [['thac', 'Sticker che được dòng chữ, không che được câu trả lời của em. Anh Victor nhớ câu đó. Anh cũng nhớ.']] },
        ['thac', 'Em biết không, anh đang nghĩ một chuyện. Chưa nói được. Nhưng nếu anh nói, anh mong em là người nghe đầu tiên.'],
        { fx: { rel: { thac: 1 } } },
      ],
    },
  ],
  diary: (s) => s.flags.demo_small ? 'Demo "AI cấp 1": canh chua cá lóc, 31% người dùng. Anh Victor hỏi tên mình. Anh Thạc trả lời.'
    : s.flags.demo_label ? 'Mình ghi "Prototype" lên demo. Anh Kevin dán sticker che. Mình vẫn nói thật khi được hỏi.'
    : 'Demo hardcode chạy hoàn hảo. Anh Kevin hứa "tháng sau". Đêm nay mình mơ thấy if user == "demo_kevin".',
};

// ---------------------------------------------------------------- official arc (after promotion)
const OFF_HANDOVER = {
  id: 'off_handover', official: true, title: 'Chính thức: pager thật, bàn giao bằng emoji',
  intro: 'Tuần đầu tiên làm nhân viên chính thức. Hợp đồng lao động, bảo hiểm 10,5%, MacBook (vẫn đời 2019).\n\nVà một món quà: bạn có tên trong lịch on-call. Anh Lộc vừa nộp đơn nghỉ. Bàn giao: hôm nay.',
  steps: [
    {
      who: 'ngan', obj: 'Ký hợp đồng chính thức với chị Ngân', time: '09:00',
      scene: [
        ['ngan', 'Chúc mừng em chính thức về với gia đình! Hợp đồng đây. Và đây là thư ESOP: cliff một năm, vesting bốn năm.'],
        ['ngan', 'Nghĩa là sau một năm em bắt đầu có cổ phần. Giá trị thì… khi công ty IPO. Hoặc được mua lại. Hoặc khi nào đó.'],
        { c: 'tech_off_esop', o: [
          { t: '"ESOP này có giá thực hiện bao nhiêu, và lối ra là gì ạ?"', fx: { uy: 2, rel: { ngan: -1, thao: 1 } }, then: [
            ['ngan', 'Ơ… câu này chị chuyển chị Thảo nha.'],
            { chat: [['thao', 'giá thực hiện: chưa có. lối ra: chưa có. cổ phần: có, trên giấy. em ký hợp đồng lao động trước là quan trọng nhất.', true]] },
          ] },
          { t: 'Ký luôn. ESOP là tương lai.', fx: { rel: { ngan: 2, kevin: 1 } }, then: [['ngan', 'Tuyệt! Một năm nữa em là cổ đông. Nhớ ở lại một năm nha. Chị nói vui thôi.']] },
        ] },
        ['nar', '(Hợp đồng lao động từ đủ 1 tháng trở lên thì đóng BHXH bắt buộc. Thông tin giải trí, không phải tư vấn pháp lý.)'],
      ],
    },
    {
      who: 'loc', obj: 'Nhận bàn giao DevOps từ anh Lộc', time: '10:30',
      scene: [
        ['loc', '📦➡️🫵'],
        ['nar', 'Tài liệu bàn giao của anh Lộc là một tin nhắn Slack: "🔑 = sticky note dưới bàn phím. 🔥 = gọi Thạc. 🙏 = luôn luôn."'],
        { if: f('oncall_rotation'), then: [['loc', 'Lịch xoay vòng em đề xuất hôm postmortem… mấy tuần nay anh được ngủ. Lần đầu sau ba năm. Cảm ơn em.'], { fx: { rel: { loc: 2 } } }] },
        { c: 'tech_off_handover', o: [
          { t: 'Xin anh Lộc ngồi 2 tiếng, quay màn hình, viết runbook cùng nhau.', fx: { uy: 4, nl: -8, rel: { loc: 2, thac: 1 }, set: { handover_doc: true } }, then: [
            ['loc', 'Hai tiếng… ok. Anh nói, em gõ. Anh không gõ được nữa, tay anh chỉ còn emoji.'],
            ['nar', 'Runbook dài 14 trang. Trang 9 có đoạn: "Nếu server cũ kêu như máy giặt: đừng tắt. Không ai biết tại sao."'],
          ] },
          { t: 'Nhận bàn giao bằng emoji.', fx: { rel: { loc: 1 } }, then: [['think', '🔑 dưới bàn phím. 🔥 gọi Thạc. 🙏 luôn luôn. Ok. Mình là DevOps rồi.']] },
        ] },
        ['loc', '🫡 ✌️'],
        { fx: { set: { loc_left: true } } },
      ],
    },
    {
      who: 'kevin', obj: 'Anh Kevin chào mừng "nhân viên chính thức"', time: '14:00',
      scene: [
        ['kevin', 'Welcome to the team for real! Giờ em là full-time. Nghĩa là em được làm full các thứ: Giỏ Chung, AI, và on-call.'],
        ['kevin', 'Lương mười lăm triệu là đầu tư của anh vào em. Anh mong ROI.'],
        { c: 'tech_off_kevin', o: [
          { t: '"Em cần chị Diệp xếp ưu tiên ba việc đó giúp em ạ."', fx: { uy: 2, rel: { diep: 2, kevin: -1 } }, then: [['kevin', 'Ưu tiên là cả ba em ơi. Startup không có chữ "hoặc".']] },
          { t: '"Dạ em sẽ cố hết sức ạ!"', fx: { nl: -6, rel: { kevin: 2 } }, then: [['kevin', 'That\'s the spirit! Anh đăng LinkedIn về em nha. Không ghi tên.']] },
        ] },
        ['nar', '(Lương 15 triệu, trừ 10,5% bảo hiểm, chưa tới mức chịu thuế sau giảm trừ gia cảnh 15,5 triệu. Thông tin giải trí, không phải tư vấn pháp lý.)'],
      ],
    },
    {
      who: 'call:thac', obj: '17:40 Pager kêu: anh Thạc gọi', time: '17:40',
      call: { title: '#incident · Bạn đang on-call', people: ['thac', 'me'] },
      scene: [
        ['thac', 'Disk server cũ 85%. Không gấp. Anh gọi để em biết cảm giác pager kêu khi em là người chịu trách nhiệm thật.'],
        { if: f('handover_doc'), then: [['me', 'Runbook trang 4 ạ. Em dọn log cũ, rồi báo #incident.'], ['thac', 'Có runbook. Lần đầu tiên công ty này có runbook DevOps. Anh suýt khóc.']], else: [['me', 'Dạ… 🔑 dưới bàn phím, 🔥 gọi anh ạ?'], ['thac', 'Đúng. Anh là 🔥. Lại đây, anh chỉ.']] },
        ['thac', 'Chúc mừng em lên chính thức. Anh nói thật: ở đây chính thức nghĩa là không còn ai tha lỗi cho em vì là intern.'],
      ],
    },
  ],
  diary: (s) => `Tuần đầu chính thức. ${s.flags.handover_doc ? 'Mình và anh Lộc viết runbook 14 trang.' : 'Bàn giao DevOps bằng ba emoji.'} Pager kêu lúc 17:40. Không gấp. Nhưng tim mình gấp.`,
};

const OFF_SALARY_LATE = {
  id: 'off_salary_late', official: true, title: 'Lương về trễ "vì gia đình"',
  intro: 'Sáng nay có email từ anh Kevin gửi toàn công ty, tiêu đề: "Một gia đình ❤️".\n\nCùng lúc, LinkedIn anh Kevin đăng ảnh trên một rooftop bar, cầm ly cocktail, caption "Building the future".',
  steps: [
    {
      who: 'obj:desk', obj: 'Đọc email "Một gia đình ❤️"', time: '09:00',
      scene: [
        ['nar', '"Thưa cả nhà, vì vòng gọi vốn cần thêm thời gian, lương tháng này sẽ về trễ 7 ngày. Chúng ta là một gia đình. Xin cả nhà thông cảm."'],
        ['nar', 'Phía dưới email, chữ ký anh Kevin: "CEO · Top 30 Under 30 (đề cử)". Ảnh đại diện mới: anh Kevin cầm ly cocktail.'],
        { c: 'tech_off_email', o: [
          { t: 'Trả lời: "Anh cho em hỏi lương trễ có ảnh hưởng đóng bảo hiểm tháng này không ạ?"', fx: { uy: 2, dr: 3, rel: { kevin: -2, thao: 1 } }, then: [
            { chat: [['thao', 'bảo hiểm chị vẫn đóng đúng hạn. chị ưu tiên cái đó trước cả tiền điện.', true]] },
          ] },
          { t: 'Không trả lời. Mở Excel tính tiền nhà.', fx: { nl: -5, money: -100_000 }, then: [['think', 'Bảy ngày. Chủ trọ của mình không tin vào văn hóa gia đình.']] },
          { t: 'Reply-all: "❤️"', fx: { rel: { kevin: 1 }, dr: 1 }, then: [['nar', '23 người reply-all "❤️". Chị Ngân reply-all "💐". Hộp thư cả công ty nổ tung.']] },
        ] },
      ],
    },
    {
      who: 'thao', obj: 'Chị Thảo đóng cửa phòng, gọi bạn vào', time: '10:30',
      scene: [
        { if: (r) => r.flags.asked_runway || r.flags.asked_runway_public || r.flags.ama_asked, then: [['thao', 'Chị nói với em vì em là người từng hỏi runway.']], else: [['thao', 'Chị nói với em vì giờ em là nhân viên chính thức. Em có quyền biết.']] },
        ['thao', 'Quỹ Hạt Giống trả lời Series B: "cần cân nhắc thêm".'],
        ['thao', 'Không có Series B thì runway thật còn ba tháng. Con số chín tháng là tính cả những khoản "sắp về". Tiền bên Nhật nuôi được một nửa công ty.'],
        { if: f('mau_inflated'), then: [['thao', 'Và họ hỏi lại con số một triệu MAU. Due diligence. Chị đã nói với em là nó sẽ quay lại.'], { fx: { dr: 4 } }] },
        { c: 'tech_off_thao', o: [
          { t: '"Chị có ổn không ạ?"', fx: { rel: { thao: 3 } }, then: [['thao', 'Không. Nhưng chị sẽ là người cuối cùng tắt đèn. Còn em thì đừng là người cuối cùng biết tin.']] },
          { t: '"Em nên chuẩn bị gì ạ?"', fx: { uy: 1, rel: { thao: 1 }, set: { warned: true } }, then: [['thao', 'Cập nhật CV. Lưu email quan trọng. Và hỏi chị Ngân xem sổ bảo hiểm của em đã chốt tới tháng nào.']] },
        ] },
      ],
    },
    {
      who: 'tung', obj: 'Tùng thu dọn bàn', time: '13:30',
      scene: [
        ['tung', 'Anh nghỉ rồi. Cái app freelance thành công ty nhỏ. Lương gấp rưỡi, trả đúng ngày. Không có ring light.'],
        ['tung', 'Bên anh đang cần một người. Không cần giỏi nhất. Cần người đọc trang Rollback trước khi cần nó. Em muốn không?'],
        { c: 'tech_off_tung', o: [
          { t: '"Anh gửi em JD. Em cân nhắc."', fx: { rel: { tung: 2 }, set: { cv_sent: true, tung_left: true } }, then: [['tung', 'Ok. Kentou shimasu hả? Đùa. Anh gửi rồi. Phỏng vấn tối thứ Năm, online, không take-home.']] },
          { t: '"Em ở lại. Em muốn thấy Giỏ Chung đi tới đâu."', fx: { rel: { tung: 1, diep: 1 }, set: { tung_left: true } }, then: [['tung', 'Ừ. Tôn trọng. Nhưng lưu số anh nha. Startup không có chữ "mãi mãi".']] },
        ] },
        ['nar', 'Trên bàn Tùng còn lại sticker "It works on my machine". Tùng bóc nó ra, dán lên bàn bạn.'],
      ],
    },
    {
      who: 'diep', obj: 'Chị Diệp nhờ một việc riêng', time: '16:00',
      scene: [
        ['diep', 'Em… có thể làm người tham chiếu cho chị không? Chị đang phỏng vấn ở một sàn thương mại điện tử. Đừng nói ai.'],
        ['diep', 'Em biết vì sao chị nói toàn framework không? Vì framework không ai cãi được. Còn ý kiến của chị thì ai cũng cãi được.'],
        { c: 'tech_off_diep', o: [
          { t: '"Dạ được ạ. Em sẽ kể vụ thread Figma 61 comment."', when: f('ui_checklist'), fx: { rel: { diep: 3 } }, then: [['diep', 'Cảm ơn em. Đó là ngày chị thấy mình làm PM có ích nhất. Nhờ một intern.']] },
          { t: '"Dạ được ạ. Em sẽ kể chị chặn bao nhiêu ý tưởng "hai tiếng" cho team."', when: nf('ui_checklist'), fx: { rel: { diep: 3 } }, then: [['diep', 'Cảm ơn em. Chị chưa từng nghĩ "chặn" là một thành tích. Chắc là có.']] },
          { t: '"Chị đi rồi thì ai che cho team khỏi anh Kevin ạ?"', fx: { rel: { diep: 1 }, dr: 1 }, then: [['diep', '…Câu hỏi đó chị hỏi mình mỗi tối. Chưa có framework nào trả lời được.']] },
        ] },
      ],
    },
  ],
  diary: (s) => `Lương trễ bảy ngày, anh Kevin đăng ảnh cocktail. ${s.flags.cv_sent ? 'Mình nhận JD của Tùng.' : 'Tùng nghỉ. Mình ở lại.'} Chị Diệp cũng đang phỏng vấn chỗ khác. Startup không có chữ "mãi mãi".`,
};

const OFF_PIVOT = {
  id: 'off_pivot', official: true, title: 'Pivot',
  intro: 'All-hands khẩn lúc 9:30. Lịch họp ghi: "Hướng đi mới 🚀". Không có mô tả.\n\nTrong phòng "Bún Bò", dòng chữ "Pivot? (đừng xóa)" trên bảng trắng đã được tô đậm.',
  steps: [
    {
      who: 'kevin', obj: '9:30 All-hands khẩn ở bảng Scrum', time: '09:30', pos: ALLHANDS_POS,
      scene: [
        ['kevin', 'Team! Mình pivot. Từ hôm nay, Nợ Kỹ Thuật Labs là "AI agent cho doanh nghiệp nhỏ". Đi chợ là quá khứ. AI là tương lai.'],
        ['kevin', 'Squad Giỏ Chung giải thể từ thứ Hai. Không phải do các bạn. Do chiến lược.'],
        ['think', 'Giỏ Chung. Ý tưởng của mình. Sống chưa tới một tháng. Một đêm mất ngủ, rồi một buổi sáng pivot.'],
        { c: 'tech_off_pivot', o: [
          { t: '"Người dùng Giỏ Chung hiện tại thì sao ạ?"', fx: { uy: 2, rel: { kevin: -1, nguyet: 1 } }, then: [['kevin', 'Họ sẽ được… chuyển đổi. Sang trải nghiệm AI. Mình sẽ gửi push notification: "Lúa nhớ bạn 🌾".']] },
          { t: 'Vỗ tay cùng mọi người.', fx: { nl: -3, rel: { kevin: 1 } }, then: [['nar', 'Tiếng vỗ tay nghe như tiếng mưa trên mái tôn. Thưa, và hơi buồn.']] },
        ] },
      ],
    },
    {
      who: 'thac', obj: 'Anh Thạc rủ ra pantry', time: '11:00', pos: { thac: 'pantry' },
      scene: [
        { if: (r) => r.flags.demo_small || r.flags.demo_label || r.flags.demo_hardcode, then: [['thac', 'Anh nói với em đầu tiên, như anh đã hứa hôm demo.']], else: [['thac', 'Anh muốn em là người nghe đầu tiên.']] },
        ['thac', 'Anh nghỉ. Cuối tháng. Anh muốn làm một công ty nhỏ, có lãi, không có ring light.'],
        ['thac', 'Anh cần hai người. Một người đọc runbook trước khi cần nó. Một người dám hỏi runway trước mặt CEO. Em là cả hai.'],
        { c: 'tech_off_cto', o: [
          { t: '"Em muốn nghe thêm ạ."', fx: { rel: { thac: 2 }, set: { cto_offer: true } }, then: [['thac', 'Lương thấp hơn ở đây một chút. Nhưng trả đúng ngày. Và anh sẽ ngủ đủ tám tiếng. Đó là văn hóa công ty.']] },
          { t: '"Em cảm ơn anh, nhưng em chưa sẵn sàng."', fx: { rel: { thac: 1 } }, then: [['thac', 'Ừ. Cửa luôn mở. Cửa nhà anh không có thẻ từ.']] },
        ] },
      ],
    },
    {
      who: 'hieu', obj: 'Anh Hiếu (BrSE) có tin cho bạn', time: '14:00',
      scene: [
        ['hieu', 'Tanaka-san gia hạn hợp đồng một năm. Và khách muốn một người onsite ở Tokyo sáu tháng.'],
        { if: (r) => r.flags.exile_script || r.flags.exile_loyal || r.flags.jp_ok, then: [['hieu', 'Khách nhớ em. Tanaka-san gọi em là "người hourensou". Đó là lời khen cao nhất của ông ấy.']], else: [['hieu', 'Khách chưa biết em. Nhưng anh tin em học nhanh. Mỗi sáng một câu tiếng Nhật, mỗi tối một ly bia.']] },
        { c: 'tech_off_tokyo', o: [
          { t: '"Em muốn đi Tokyo ạ."', fx: { rel: { hieu: 2 }, set: { tokyo_offer: true } }, then: [['hieu', 'Đi đày vĩnh viễn! Đùa. Đi onsite. Anh gửi khách CV của em. Nhớ: kentou shimasu nghĩa là không.']] },
          { t: '"Em xin suy nghĩ ạ."', fx: { rel: { hieu: 1 } }, then: [['hieu', 'Kentou shimasu. Em học nhanh thật.']] },
        ] },
      ],
    },
    {
      who: 'obj:desk', obj: '17:00 Về bàn: con đường tiếp theo', time: '17:00',
      scene: [
        ['nar', 'Trên màn hình, Jira đã chuyển cả board Giỏ Chung sang "Archived". Ticket NKT-1337 "Fix everything" vẫn In Progress.'],
        { c: 'tech_off_path', o: [
          { t: 'Xin vào squad AI. Ở lại tới cùng.', fx: { nl: -6, rel: { kevin: 2 }, set: { path_ai: true } }, then: [['kevin', 'Ownership! Em là AI-native rồi. Hai tiếng thôi, em học được.']] },
          { t: 'Theo anh Thạc ra riêng.', when: f('cto_offer'), fx: { rel: { thac: 2 }, set: { path_cto: true } }, then: [['think', 'Một công ty nhỏ, có lãi, ngủ đủ tám tiếng. Nghe như khoa học viễn tưởng.']] },
          { t: 'Đi onsite Tokyo với dự án Nhật.', when: f('tokyo_offer'), fx: { rel: { hieu: 2 }, set: { path_tokyo: true } }, then: [['think', 'Tokyo. Spec 200 trang. Nhưng có lương đúng ngày, và KitKat trà xanh.']] },
          { t: 'Tiếp tục gửi CV, chờ cơ hội.', fx: { nl: -3, set: { path_cv: true } }, then: [['think', 'Mình cập nhật CV: "Rollback prod lúc 17:31 thứ Sáu". Dòng đẹp nhất.']] },
        ] },
      ],
    },
  ],
  diary: (s) => `Pivot. Giỏ Chung sống chưa tới một tháng. ${s.flags.path_cto ? 'Mình sẽ theo anh Thạc.' : s.flags.path_tokyo ? 'Mình sẽ đi Tokyo.' : s.flags.path_ai ? 'Mình xin vào squad AI. Hai tiếng thôi, anh Kevin bảo.' : 'Mình gửi CV. Lần đầu tiên viết "Rollback prod" vào phần thành tích.'}`,
};

const OFF_FINAL = {
  id: 'off_final', official: true, end: (r) => (r.flags.resigned_first ? 'quit' : 'layoff'), noReview: true, title: '"Quick sync 15 phút" (lần này là bạn)',
  intro: 'Thứ Tư, 8:47. Lịch của bạn có một cuộc họp mới: "Quick sync 15 phút" với chị Ngân. 9:00. Phòng "Bún Bò".\n\nLần này bạn biết. Ai ở đây cũng biết.',
  steps: [
    {
      who: 'obj:desk', obj: '8:50 Về bàn lần cuối', time: '08:50',
      scene: [
        ['nar', 'Slack: 23 avatar chuyển xám trong đêm. Squad AI còn 2 người. Kênh #squad-gio-chung đã bị archive.'],
        { if: f('path_cto'), then: [['think', 'Thư mời của anh Thạc nằm trong email cá nhân. Ngày bắt đầu: thứ Hai tuần sau.']] },
        { if: f('path_tokyo'), then: [['think', 'Visa đang xử lý. Anh Hiếu nhắn: "Tanaka-san đã chọn em. Kentou shimasu không áp dụng."']] },
        { if: (r) => r.flags.path_cv && r.flags.cv_sent, then: [['think', 'Tối qua công ty của Tùng gửi offer. Mình chưa trả lời. Giờ thì chắc là trả lời rồi.']] },
        { if: (r) => r.flags.path_cv && !r.flags.cv_sent, then: [['think', 'Tối qua một công ty nhỏ gửi offer, qua headhunter. Mình chưa trả lời. Giờ thì chắc là trả lời rồi.']] },
        ['nar', 'Bạn nhìn quanh. Tờ A4 "KHÔNG DEPLOY CHIỀU THỨ SÁU" vẫn còn trên tường pantry. Nó sẽ sống lâu hơn công ty này.'],
      ],
    },
    {
      who: 'ngan', obj: '9:00 Quick sync với chị Ngân', time: '09:00', pos: { ngan: 'meeting_head', thao: 'mr_n1' },
      scene: [
        ['ngan', 'Em ngồi đi. Chị… chị không biết bắt đầu thế nào. Chị đã làm cuộc họp này 37 lần trong năm nay.'],
        ['thao', 'Công ty cắt tiếp 40%. Vị trí của em nằm trong danh sách. Không phải do em làm dở. Em biết chị không nói dối em.'],
        ['thao', 'Em được báo trước theo hợp đồng, nhận đủ lương những ngày đã làm, sổ bảo hiểm chốt đầy đủ. Chị làm đúng tới cùng.'],
        ['nar', '(Thông tin giải trí, không phải tư vấn pháp lý: chấm dứt hợp đồng vì lý do kinh tế phải theo thủ tục luật định; trợ cấp tính theo thời gian làm việc.)'],
        { c: 'tech_off_final', o: [
          { t: 'Nộp luôn đơn nghỉ: "Em cũng có một quick sync cho chị."', when: (r) => r.flags.path_cto || r.flags.path_tokyo || r.flags.path_cv, fx: { uy: 3, rel: { thao: 1 }, set: { resigned_first: true } }, then: [
            ['ngan', 'Em… nghỉ trước? Ồ. Ồ. Vậy chị ghi "nghỉ việc" hay "tái cấu trúc"?'],
            ['thao', 'Ghi "tái cấu trúc" cho em hưởng đủ quyền lợi. Còn em, đi đi. Đi trước khi đèn tắt.'],
          ] },
          { t: 'Hỏi rõ từng quyền lợi, xin bằng email.', fx: { uy: 3, rel: { thao: 2 }, set: { layoff_clean: true } }, then: [
            ['thao', 'Chị gửi em trước 12 giờ. Từng dòng. Em là người thứ hai trong năm hỏi như vậy. Người đầu tiên là chị, hồi chị bị layoff ở công ty cũ.'],
          ] },
          { t: 'Ký. Không hỏi gì.', fx: { nl: -10, rel: { ngan: 1 } }, then: [['ngan', 'Cảm ơn em. Em vẫn là gia đình. Chỉ là… gia đình ở xa.']] },
        ] },
      ],
    },
    {
      who: 'nguyet', obj: 'Chị Nguyệt chờ ở bàn QA', time: '10:30',
      scene: [
        ['nguyet', 'Chị cũng có tên. QA thủ công là thứ đầu tiên bị cắt khi người ta tin AI test được mọi thứ.'],
        ['nguyet', 'Chị gửi em file "Khong_phai_bug.xlsx". 231 dòng rồi. Em mang theo. Đi đâu cũng sẽ có người nói "không phải bug".'],
        { c: 'tech_off_nguyet', o: [
          { t: '"Em sẽ mở file Excel riêng của em, chị ạ."', fx: { rel: { nguyet: 3 } }, then: [['nguyet', 'Tốt. Cột cuối luôn là "Sau này có phải bug không". Em sẽ ngạc nhiên vì nó luôn là "Có".']] },
          { t: 'Ôm chị Nguyệt một cái.', fx: { rel: { nguyet: 3 }, nl: 5 }, then: [['nguyet', 'Ơ… ừ. Ok. Bug lớn nhất ở đây không phải trong code. Đi đi em.']] },
        ] },
      ],
    },
    {
      who: 'hoa', obj: 'Trả thẻ và laptop cho chị Hoa', time: '11:30',
      scene: [
        ['hoa', 'Thẻ của em. Laptop của em. Cái sticker "It works on my machine" thì em giữ nha. Mình là startup mà em.'],
        ['hoa', 'Chị làm lễ tân ở đây từ hồi có bốn người. Giờ lại sắp còn bốn người. Vòng tròn.'],
        ['nar', 'Mèo 404 đi ra từ dưới gầm bàn lễ tân. Lần đầu tiên, đúng lúc bạn cần, nó xuất hiện. Nó cọ vào chân bạn một lần.'],
        { fx: { nl: 5 } },
        ['nar', 'Bạn bước ra khỏi coworking. Standee "We\'re hiring!" đã được ai đó dán thêm một tờ giấy: "(not anymore)".'],
      ],
    },
  ],
  diary: (s) => s.flags.resigned_first ? 'Mình nộp đơn nghỉ trong chính buổi quick sync. Chị Thảo vẫn ghi "tái cấu trúc" để mình đủ quyền lợi. Mèo 404 xuất hiện đúng lúc.'
    : 'Quick sync 15 phút. Lần này là mình. Mình mang theo một file Excel, một sticker, và trang Rollback trong đầu.',
};

export const EPISODES = [
  ONBOARDING, FIX_EVERYTHING, PLANNING_POKER, CANNOT_REPRO, FRIDAY_DEPLOY, MAU_RECALC, FIGMA_WAR, ONCALL, HACKATHON,
  IDEA_STOLEN, QUICK_SYNC, OUTSOURCING, PROD_BLAME, APPSTORE, AMA, SALARY_SHEET, AI_DEMO,
  OFF_HANDOVER, OFF_SALARY_LATE, OFF_PIVOT, OFF_FINAL,
];
export const ARC = ['off_handover', 'off_salary_late', 'off_pivot', 'off_final'];
