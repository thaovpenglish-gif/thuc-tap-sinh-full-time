// Nợ Kỹ Thuật Labs — routine beats for ordinary days (engine picks 2–3 per day, no repeats until the pool runs out).
import { STANDUP_POS, LUNCH_POS } from './episodes.js';

const f = (k) => (r) => !!r.flags[k];
const nf = (k) => (r) => !r.flags[k];
const isWed = (r) => (r.day - 1) % 7 === 2;

const EMOJI_MINI = {
  type: 'quiz', title: 'Dịch tiếng anh Lộc', icon: '🔥',
  prompt: 'Anh Lộc trả lời ticket của bạn bằng emoji. Dịch cho đúng.', time: 30, pass: 0.66,
  questions: [
    { q: '"🔥🔥🔥"', options: ['Tuyệt vời', 'Prod đang cháy', 'Anh đang ăn lẩu'], correct: 1 },
    { q: '"👀"', options: ['Anh đang xem', 'Anh không quan tâm', 'Anh bị đau mắt'], correct: 0 },
    { q: '"🙏 ⏪"', options: ['Cầu nguyện rồi rollback', 'Cảm ơn, tua lại video', 'Xin nghỉ phép'], correct: 0 },
  ],
};
const OKR_MINI = {
  type: 'pick', title: 'Viết Key Result cho "Siêu app số 1 Việt Nam"', icon: '🎯',
  prompt: 'Quý còn 6 tuần, team thì mỏng. Chọn 2 KR đo được và làm được.', pick: 2, time: 30, pass: 0.5,
  items: [
    { text: 'Tăng tỉ lệ quay lại sau 30 ngày từ 18% lên 22%', correct: true },
    { text: 'Giảm crash trên Android cũ xuống dưới 1%', correct: true },
    { text: 'Tăng MAU 500%' },
    { text: 'Trở thành siêu app' },
    { text: 'Được nhắc tên trên một tờ báo lớn', sub: 'anh Kevin đề xuất' },
  ],
};
const INTERVIEW_MINI = {
  type: 'quiz', title: 'Ngồi phỏng vấn ứng viên Senior (10 năm kinh nghiệm)', icon: '🎤',
  prompt: 'Thiếu người, bạn được kéo vào hội đồng. Chọn câu hỏi đáng hỏi.', time: 30, pass: 0.66,
  questions: [
    { q: 'Câu mở đầu nên là…', options: ['"Anh kể về một sự cố prod anh từng xử lý"', '"Anh có growth mindset không?"', '"Anh biết anh Kevin không?"'], correct: 0 },
    { q: 'Ứng viên hỏi "Runway công ty còn bao lâu?". Bạn…', options: ['Đọc slide "18 tháng"', 'Chuyển câu hỏi cho chị Thảo', 'Giả vờ mất mạng'], correct: 1 },
    { q: 'Cột "Culture fit" bạn ghi…', options: ['"Có, vì anh ấy chịu được máy lạnh hỏng"', 'Nhận xét cụ thể về cách làm việc nhóm', '"Không, vì quá giỏi"'], correct: 1 },
  ],
};

export const ROUTINE = [
  { id: 'r_standup', who: 'diep', obj: '9:30 Daily stand-up ở bảng Scrum', time: '09:30', pos: STANDUP_POS, scene: [
    ['diep', 'Daily! Mười lăm phút. Yesterday, Today, Blocker. Mình đi nhanh nha.'],
    ['khai', 'Blocker: đang chờ anh review PR của chính anh.'],
    { c: '_r_tech_standup', o: [
      { t: '"Blocker: em chờ anh Khải review ạ."', fx: { uy: 1, rel: { khai: -1 } }, then: [['khai', 'Thứ Năm. Nếu không có incident.']] },
      { t: 'Báo cáo ngắn gọn, đúng format, 30 giây.', fx: { uy: 2, rel: { diep: 1 } }, then: [['diep', 'Ba mươi giây. Em là người duy nhất tôn trọng timebox.']] },
    ] },
    ['nar', 'Daily kết thúc sau 41 phút. Anh Kevin "chỉ ghé nghe" chiếm 26 phút.'],
  ] },
  { id: 'r_kevin_idea', who: 'kevin', obj: 'Anh Kevin có "ý tưởng nhỏ"', time: '10:30', scene: [
    ['kevin', 'Em ơi, tối qua anh đọc một bài về AI agent. Mình làm một con cho app Lúa nhé? Đơn giản thôi, chừng hai tiếng.'],
    { c: '_r_tech_kidea', o: [
      { t: '"Em note vào backlog để chị Diệp đánh giá ở planning sau ạ."', fx: { uy: 2, rel: { diep: 1 } }, then: [['kevin', 'Backlog! Ok. Nhưng ưu tiên cao nha.'], ['think', 'Backlog: nghĩa địa của những ý tưởng "ưu tiên cao".']] },
      { t: '"Dạ hay quá anh!"', fx: { nl: -6, rel: { kevin: 2 } }, then: [['kevin', 'Đó! Em làm prototype thứ Sáu nha. Anh đăng LinkedIn trước.']] },
    ] },
  ] },
  { id: 'r_khai_depends', who: 'khai', obj: 'Hỏi anh Khải một câu kỹ thuật', time: '11:00', scene: [
    ['me', 'Anh ơi, chỗ này nên dùng queue hay gọi API trực tiếp ạ?'],
    ['khai', 'It depends.'],
    { c: '_r_tech_depends', o: [
      { t: '"Depends vào những gì ạ? Anh cho em ba yếu tố."', fx: { uy: 2, rel: { khai: 2 } }, then: [['khai', 'Ba yếu tố. Tải, độ trễ chấp nhận được, và ai sẽ trực lúc nó hỏng. Cái thứ ba quan trọng nhất.']] },
      { t: 'Tự đọc code để tìm câu trả lời.', fx: { nl: -5, uy: 1 }, then: [['nar', 'Code có comment duy nhất: "// tạm, sửa sau (2022)". Bạn hiểu "it depends" nghĩa là gì.']] },
    ] },
  ] },
  { id: 'r_flaky', who: 'obj:desk', obj: 'CI đỏ: test "flaky" lại fail', time: '14:00', scene: [
    ['nar', 'Pipeline chạy 40 phút. Fail ở test "checkout_should_work". Lần trước nó pass. Lần trước nữa nó fail. Nó có tâm trạng.'],
    { c: '_r_tech_flaky', o: [
      { t: 'Bấm "Retry". Lại 40 phút.', fx: { nl: -4 }, then: [['nar', 'Lần này pass. Không ai biết vì sao. Không ai muốn biết.']] },
      { t: 'Đào xem vì sao nó lúc pass lúc fail.', fx: { nl: -8, uy: 3, rel: { khai: 1 } }, then: [['nar', 'Test phụ thuộc giờ hệ thống. Sau 14:00 nó fail vì "giờ cao điểm" được hardcode. Bạn sửa một dòng.'], ['khai', '…Test đó anh viết. Cảm ơn.']] },
    ] },
  ] },
  { id: 'r_plus_one', who: 'obj:desk', obj: 'Slack: thread 80 người nổ tung', time: '10:00', scene: [
    ['nar', '#general: chị Hoa hỏi "Ai để quên áo khoác xanh ở pantry?". 80 người trả lời "+1". Không ai nhận áo.'],
    { c: '_r_tech_plus', o: [
      { t: 'Reply "+1" cho vui.', fx: { dr: 1 }, then: [['nar', 'Bạn là "+1" thứ 81. Chị Hoa gửi một emoji 😑.']] },
      { t: 'Mute thread, làm việc tiếp.', fx: { nl: 2, uy: 1 }, then: [['think', 'Kỹ năng quan trọng nhất ở startup: biết thread nào cần mute.']] },
    ] },
  ] },
  { id: 'r_loc_emoji', who: 'loc', obj: 'Anh Lộc trả lời ticket bằng emoji', time: '11:30', when: (r) => !r.flags.loc_left, scene: [
    ['loc', '🔥🔥🔥 · 👀 · 🙏⏪'],
    { mini: EMOJI_MINI,
      good: [['loc', '👍👍'], ['nar', 'Anh Lộc giơ hai ngón cái. Bạn vừa đạt chứng chỉ "Lộc-ngữ" cấp 1.'], { fx: { uy: 2, rel: { loc: 2 } } }],
      bad: [['loc', '🫠'], ['nar', 'Bạn dịch sai emoji của anh Lộc. Prod đã cháy 12 phút trước khi bạn hiểu ra.'], { fx: { dr: 2 } }],
    },
  ] },
  { id: 'r_nguyet_late_bug', who: 'nguyet', obj: 'Chị Nguyệt tìm ra bug 30 phút trước release', time: '15:30', when: nf('tung_left'), scene: [
    ['nguyet', 'Em ơi, còn 30 phút release, chị tìm ra bug: thanh toán xong mà đơn vẫn "đang chờ". Chị reproduce được. Có video.'],
    ['tung', '(từ xa) Không phải bug, đó là "trạng thái trung gian".'],
    { c: '_r_tech_latebug', o: [
      { t: 'Ủng hộ chị Nguyệt: dời release một tiếng.', fx: { uy: 2, rel: { nguyet: 2, tung: -1 } }, then: [['nguyet', 'Cảm ơn em. Chị ghi vào file "Không phải bug": dòng 215, "trạng thái trung gian". Cột "Sau này có phải bug": chắc chắn "Có".']] },
      { t: 'Giữ lịch release, ghi "known issue".', fx: { dr: 2, rel: { tung: 1 } }, then: [['nar', 'Hai tiếng sau, CS nhận 40 cuộc gọi: "Tôi trả tiền rồi sao đơn chưa chạy?".']] },
    ] },
  ] },
  { id: 'r_vy_2px', who: 'vy', obj: 'Vy nhờ "nhìn giúp một chút"', time: '14:30', scene: [
    ['vy', 'Bạn nhìn hai bản này đi. Bản A và bản B. Thấy khác nhau không?'],
    ['think', 'Hai bản giống hệt nhau.'],
    { c: '_r_tech_vy', o: [
      { t: '"Bản B… thoáng hơn?"', fx: { rel: { vy: 2 } }, then: [['vy', 'ĐÚNG! Bản B rộng hơn 2px! Bạn có mắt designer!'], ['think', 'Mình đoán. Và mình đúng. Đời là vậy.']] },
      { t: '"Mình không thấy khác. Khác ở đâu?"', fx: { uy: 1, rel: { vy: -1 } }, then: [['vy', 'Ừ… người dùng cũng không thấy. Đó là vấn đề. Hoặc không phải vấn đề. Mình không biết nữa.']] },
    ] },
  ] },
  { id: 'r_duy_kol', who: 'duy', obj: 'Duy cần "một chút copywriting"', time: '13:30', scene: [
    ['duy', 'Em viết giúp anh push notification. Mục tiêu: người dùng mở app. Ngân sách: không. Thời gian: mười phút.'],
    { c: '_r_tech_push', o: [
      { t: '"Lúa nhớ bạn 🌾 Rau muống hôm nay giảm 20%."', fx: { uy: 2, rel: { duy: 2 } }, then: [['duy', 'Có giảm giá, có rau muống. CTR 2,1%. Gấp bảy lần bản của anh. Anh ghét em một chút.']] },
      { t: '"Bạn ơi, mình chia tay thật sao? 💔"', fx: { dr: 3, rel: { duy: 1 } }, then: [['nar', 'CTR 6%. Đánh giá 1 sao: "App đi chợ mà nhắn như người yêu cũ". Duy in ra dán tường.']] },
    ] },
  ] },
  { id: 'r_ngan_survey', who: 'ngan', obj: 'Chị Ngân nhắc điền "khảo sát hạnh phúc"', time: '10:45', scene: [
    ['ngan', 'Em điền khảo sát hạnh phúc chưa? Ẩn danh hoàn toàn nha! Chị chỉ xem tổng thôi.'],
    ['nar', 'Câu đầu tiên của form: "Email của bạn (bắt buộc)".'],
    { c: '_r_tech_survey', o: [
      { t: 'Điền thật lòng: "Mình cần thêm người, ít họp hơn."', fx: { uy: 1, rel: { ngan: 1 } }, then: [['ngan', '(hai tiếng sau) Chị đọc rồi. Ẩn danh nha. Nhưng chị đồng ý với em.']] },
      { t: 'Chấm 10/10 mọi câu.', fx: { dr: 1, rel: { ngan: 2 } }, then: [['ngan', 'Wow, team mình hạnh phúc ghê! 98% hài lòng!'], ['think', '98%. Bằng cách đếm MAU của anh Kevin.']] },
    ] },
  ] },
  { id: 'r_tanaka_mail', who: 'hieu', obj: 'Anh Hiếu nhờ đọc mail khách Nhật', time: '09:45', scene: [
    ['hieu', 'Mail Tanaka-san lúc 7:00 sáng. Một dòng: "Why bug?" Kèm ảnh chụp màn hình. Đó là bản staging, không phải prod.'],
    { c: '_r_tech_tanaka', o: [
      { t: 'Soạn trả lời: cảm ơn, giải thích đây là staging, hẹn báo cáo lúc 17:00.', fx: { uy: 2, rel: { hieu: 2 } }, then: [['hieu', 'Có cảm ơn, có giải thích, có giờ hẹn. Hourensou. Em tốt nghiệp khóa BrSE cấp tốc.']] },
      { t: '"Anh trả lời: không phải bug đâu ạ."', fx: { dr: 2, rel: { hieu: -1 } }, then: [['hieu', 'Với khách Nhật, "không phải bug" là bắt đầu của Q&A 148, 149, 150…']] },
    ] },
  ] },
  { id: 'r_chau_ai', who: 'chau', obj: 'Châu có một PRD mới', time: '11:15', scene: [
    ['chau', 'Bạn đọc PRD của mình đi. "LúaGPT: AI hỏi bạn hôm nay ăn gì". Bản thứ sáu.'],
    { c: '_r_tech_chau', o: [
      { t: 'Hỏi Châu: "Người dùng đang khổ vì điều gì?"', fx: { uy: 2, rel: { chau: 1, diep: 1 } }, then: [['chau', 'Khổ vì… không biết ăn gì? Ừm. Hay khổ vì giao hàng trễ? Để mình đi hỏi người dùng thật.']] },
      { t: '"Thêm AI vào nữa đi!"', fx: { rel: { chau: 2 }, dr: 1 }, then: [['chau', 'Đúng không! Bạn hiểu mình. AI trong AI. AI-ception.']] },
    ] },
  ] },
  { id: 'r_pr_nits', who: 'khai', obj: 'PR của bạn có 47 comment "nit:"', time: '15:00', scene: [
    ['nar', 'PR #812 của bạn: 47 comment. "nit: đổi tên biến". "nit: thừa dấu cách". "nit: anh không thích chữ data". Mở được 9 ngày.'],
    { c: '_r_tech_nit', o: [
      { t: 'Hẹn anh Khải 15 phút, đề xuất tách PR làm ba.', fx: { uy: 3, rel: { khai: 2 } }, then: [['khai', 'Tách ba. Ok. Ba PR nhỏ, anh review trong một buổi chiều. Sao không ai làm vậy trước đây nhỉ.']] },
      { t: 'Nhờ Tùng approve "cho nhanh".', when: nf('tung_left'), fx: { dr: 3, rel: { khai: -2, tung: 1 } }, then: [['tung', 'LGTM 🚀'], ['khai', '(một tiếng sau, trong channel) Ai approve PR #812 mà không đọc?']] },
      { t: 'Sửa hết 47 cái, không cãi.', fx: { nl: -8, uy: 1, rel: { khai: 1 } }, then: [['khai', 'Approve. Nit cuối: lần sau đừng sửa hết. Một nửa là anh viết lúc buồn.']] },
    ] },
  ] },
  { id: 'r_db_balance', who: 'duy', obj: 'Duy (kiêm CS) nhờ "sửa số dư giùm"', time: '16:00', scene: [
    ['duy', 'Em ơi, khách VIP bị trừ ví hai lần, 480 nghìn. Em có quyền DB đúng không? Sửa thẳng giùm anh. Ticket thì lâu lắm.'],
    { c: '_r_tech_db', o: [
      { t: 'Từ chối sửa tay. Tạo ticket P1, gọi anh Khải.', fx: { uy: 3, rel: { khai: 1, duy: -1 } }, then: [['khai', 'Đúng. Sửa tay vào ví là cách nhanh nhất để chị Thảo hỏi chuyện ba tuần sau.'], ['nar', 'Hai tiếng sau khách được hoàn tiền, có log, có người duyệt.']] },
      { t: 'Sửa thẳng trong DB cho nhanh.', fx: { dr: 4, rel: { duy: 2 } }, then: [['nar', 'Ba ngày sau, chị Thảo đối soát: "Sao ví khách này tự nhiên có 480 nghìn không có giao dịch?" Mọi ánh mắt nhìn bạn.']] },
    ] },
  ] },
  { id: 'r_ai_ban', who: 'khai', obj: 'Quy định mới: cấm dán code vào chatbot AI', time: '13:45', scene: [
    ['nar', 'Email từ anh Thạc: "Cấm dán code công ty vào chatbot AI bên ngoài vì bảo mật." Gửi lúc 9:00.'],
    ['nar', 'Lúc 13:40, bạn đi ngang bàn anh Khải. Trên màn hình anh: một chatbot, và nguyên file voucher.js.'],
    { c: '_r_tech_aiban', o: [
      { t: 'Coi như không thấy.', fx: { rel: { khai: 2 } }, then: [['khai', '(không quay lại) …Em không thấy gì. Anh nợ em một lần.']] },
      { t: 'Đề xuất công ty mua bản AI doanh nghiệp, có bảo mật.', fx: { uy: 3, nl: -4, rel: { khai: 1, thac: 1 } }, then: [['thac', 'Viết đề xuất một trang. Có giá. Có điều khoản dữ liệu. Anh trình chị Thảo.']] },
    ] },
  ] },
  { id: 'r_interview_senior', who: 'diep', obj: 'Bị kéo vào phỏng vấn ứng viên Senior', time: '14:15', pos: { diep: 'meeting_head' }, scene: [
    ['diep', 'Thiếu người, em vào ngồi phỏng vấn cùng chị. Ứng viên mười năm kinh nghiệm. Em ghi chú "culture fit" giúp chị.'],
    { mini: INTERVIEW_MINI,
      good: [['nar', 'Ứng viên trả lời rất hay. Cuối buổi anh hỏi: "Em vào công ty bao lâu rồi? Câu hỏi tốt đấy."'], { fx: { uy: 3, rel: { diep: 1 } } }],
      bad: [['nar', 'Câu hỏi của bạn làm ứng viên mười năm kinh nghiệm nhìn bạn rất lâu. Chị Diệp ghi gì đó vào sổ.'], { fx: { dr: 2 } }],
    },
  ] },
  { id: 'r_wifi', who: 'hoa', obj: 'Wifi đổi mật khẩu, chỉ chị Hoa biết', time: '09:15', when: (r) => !r.flags.loc_left && !r.flags.tung_left, scene: [
    ['nar', 'Wifi "NoKyThuat_5G" từ chối mọi người. Cả văn phòng phát 4G từ điện thoại. Tùng phát cho ba người.'],
    ['hoa', 'Chị đổi mật khẩu vì bảo mật. Mật khẩu mới là… chị ghi trong sổ. Sổ ở nhà.'],
    { c: '_r_tech_wifi', o: [
      { t: 'Gợi ý chị Hoa dán mật khẩu khách ở pantry, mật khẩu nội bộ đưa anh Lộc giữ.', fx: { uy: 2, rel: { hoa: 2, loc: 1 } }, then: [['loc', '👍🔐'], ['hoa', 'Hai mật khẩu. Một cho khách, một cho mình. Chuyên nghiệp ghê. Mình là… startup có quy trình!']] },
      { t: 'Đoán: "FixLater2!"', fx: { dr: 1, rel: { hoa: 1 } }, then: [['nar', 'Đúng. Cả văn phòng vỗ tay. Bảo mật của công ty phụ thuộc vào khả năng đoán của một intern.']] },
    ] },
  ] },
  { id: 'r_cake', who: 'tung', obj: 'Bánh kem bí ẩn ở pantry', time: '15:45', pos: { tung: 'pantry' }, when: (r) => !r.flags.tung_left, scene: [
    ['tung', 'Có bánh kem trong tủ lạnh. Không ghi tên. Không ai biết sinh nhật ai. Theo luật startup: bánh không tên là bánh của công ty.'],
    { c: '_r_tech_cake', o: [
      { t: 'Ăn một miếng.', fx: { nl: 12, rel: { tung: 1 } }, then: [['nar', 'Mười phút sau chị Hoa hỏi trong #general: "Ai ăn bánh sinh nhật của Mèo 404?"']] },
      { t: 'Hỏi trong #general bánh của ai trước đã.', fx: { uy: 1, rel: { hoa: 1 } }, then: [['hoa', 'Bánh sinh nhật Mèo 404! Ba tuổi. Ăn đi mọi người, mèo không ăn kem.']] },
    ] },
  ] },
  { id: 'r_staging_off', who: 'thao', obj: 'Chị Thảo muốn "tối ưu chi phí server"', time: '11:45', when: nf('loc_left'), scene: [
    ['thao', 'Hóa đơn cloud tháng này cao. Server staging chạy 24/7. Em tắt nó buổi tối được không? Cho đỡ tốn.'],
    { c: '_r_tech_staging', o: [
      { t: 'Hỏi anh Lộc, đề xuất hẹn giờ tắt 22:00 – 7:00, trừ ngày release.', fx: { uy: 3, rel: { thao: 2, loc: 1 } }, then: [['loc', '⏰👍'], ['thao', 'Tiết kiệm 30%. Không ai chết. Chị muốn khóc vì hạnh phúc.']] },
      { t: 'Tắt luôn cho nhanh.', fx: { dr: 3, rel: { thao: 1, khai: -2 } }, then: [['khai', 'Ai tắt staging? Anh đang test dở. Ba tiếng dữ liệu.'], ['think', 'Tiết kiệm được 40 nghìn. Mất ba tiếng của anh Khải.']] },
    ] },
  ] },
  { id: 'r_one_star', who: 'duy', obj: 'Đánh giá 1 sao cần trả lời', time: '16:30', scene: [
    ['duy', 'Đánh giá mới: ⭐ "App đi chợ mà không bán rau muống. Gỡ." Em trả lời giúp anh, giọng thương hiệu.'],
    { c: '_r_tech_review', o: [
      { t: '"Dạ Lúa xin lỗi ạ 🌾 Rau muống về lại từ thứ Hai, Lúa tặng bạn mã giao miễn phí."', fx: { uy: 2, rel: { duy: 1 } }, then: [['nar', 'Khách sửa thành 4 sao: "Biết lỗi. Có rau muống. Ok."']] },
      { t: '"Bạn có thể dùng rau lang thay thế ạ."', fx: { dr: 2 }, then: [['nar', 'Bình luận được 3.000 like. Không ai biết đó là khen hay chê. Duy chụp màn hình làm "case study".']] },
    ] },
  ] },
  { id: 'r_okr', who: 'obj:okr', obj: 'Anh Kevin nhờ viết lại Key Result', time: '10:15', scene: [
    ['nar', 'Bảng OKR: "O: Trở thành siêu app số 1 Việt Nam". Phía dưới trống trơn. Anh Kevin dán sticky note: "Em viết KR giúp anh nha 🚀".'],
    { mini: OKR_MINI,
      good: [['diep', '(đi ngang) KR này đo được, làm được. Lần đầu bảng OKR có thứ để đo. Chị chép vào Notion luôn.'], { fx: { uy: 3, rel: { diep: 2 } } }],
      bad: [['kevin', '(đi ngang) KR gì mà khiêm tốn vậy em? Ghi thêm "Tăng MAU 500%" cho anh! Tham vọng!'], ['nguyet', '(thì thầm) 500% của MAU nào? Của anh hay của dashboard?'], { fx: { rel: { kevin: 1 }, dr: 2 } }],
    },
  ] },
  { id: 'r_wellness', who: 'ngan', obj: 'Wellness Wednesday: yoga 15 phút', time: '16:00', pos: { ngan: 'meeting_head' }, when: isWed, scene: [
    ['ngan', 'Wellness Wednesday! Yoga mười lăm phút trong phòng "Bún Bò". Thở vào: biết ơn. Thở ra: deadline.'],
    { c: '_r_tech_yoga', o: [
      { t: 'Tham gia hết mình.', fx: { nl: 8, rel: { ngan: 2 } }, then: [['nar', 'Tư thế "chó úp mặt". Điện thoại rung: #incident. Bạn thở ra rất dài.']] },
      { t: 'Xin phép làm nốt ticket.', fx: { uy: 1, rel: { ngan: -1 } }, then: [['ngan', 'Ok em. Nhưng nhớ: burnout không có story point.']] },
    ] },
  ] },
  { id: 'r_kitkat', who: 'hieu', obj: 'Anh Hiếu đi onsite Nhật về', time: '11:30', scene: [
    ['hieu', 'Quà Tokyo. KitKat vị trà xanh. Mỗi người một thanh. Đừng hỏi về chuyến đi. Spec dày thêm 40 trang.'],
    { c: '_r_tech_kitkat', o: [
      { t: 'Cảm ơn, hỏi anh thích nhất điều gì ở Tokyo.', fx: { nl: 6, rel: { hieu: 2 } }, then: [['hieu', 'Ở Tokyo, họp 30 phút thì kết thúc ở phút thứ 30. Anh đã khóc trong toilet vì xúc động.']] },
      { t: 'Ăn luôn hai thanh.', fx: { nl: 10, dr: 1 }, then: [['nar', 'Thanh thứ hai là của anh Kevin. Anh Kevin không biết. Bạn mang bí mật này theo cả đời.']] },
    ] },
  ] },
  { id: 'r_admin_prod', who: 'loc', obj: 'Bạn vừa được cấp quyền admin production', time: '14:45', when: (r) => r.status === 'intern', scene: [
    ['nar', 'Email tự động: "Bạn đã được cấp quyền: PRODUCTION ADMIN". Không ai giải thích.'],
    ['loc', '😳'],
    { c: '_r_tech_admin', o: [
      { t: 'Báo ngay anh Lộc thu hồi.', fx: { uy: 3, rel: { loc: 2, thac: 1 } }, then: [['loc', '🙏🔒'], ['nar', 'Quyền bị thu hồi sau 4 phút. Anh Lộc gửi thêm 🫡. Bạn đoán đó là "cảm ơn, em là người tốt".']] },
      { t: 'Giữ quyền, phòng khi cần.', fx: { dr: 3 }, then: [['think', 'Mình có quyền tắt cả công ty. Mình sẽ không dùng. Nhưng mình có.']] },
    ] },
  ] },
  { id: 'r_thac_coffee', who: 'thac', obj: 'Anh Thạc nhờ pha giúp ly cà phê', time: '15:15', scene: [
    ['thac', 'Em pha giúp anh ly cà phê. Đen, không đường. Anh không đứng dậy được, đang canh dashboard.'],
    { c: '_r_tech_thaccoffee', o: [
      { t: 'Pha cà phê, kèm một lon nước suối: "Anh uống nước nữa ạ."', fx: { rel: { thac: 2 }, nl: -2 }, then: [['thac', 'Nước suối. Anh quên mất nó tồn tại. Cảm ơn em.']] },
      { t: 'Pha cà phê, rồi hỏi về dashboard.', fx: { uy: 2, rel: { thac: 1 } }, then: [['thac', 'Đường đỏ là độ trễ thanh toán. Nó đỏ thì anh không ngủ. Nó xanh thì anh cũng không ngủ, vì sợ nó đỏ.']] },
    ] },
  ] },
  { id: 'r_typing', who: 'obj:desk', obj: 'Slack: "Tùng is typing…"', time: '16:15', when: (r) => !r.flags.tung_left, scene: [
    ['nar', 'Bạn hỏi Tùng: "Anh ơi API đổi format rồi hả?". "Tùng is typing…" hiện suốt năm phút.'],
    ['nar', 'Rồi tin nhắn tới: "ok".'],
    { c: '_r_tech_typing', o: [
      { t: 'Đi thẳng qua bàn Tùng hỏi.', fx: { uy: 1, rel: { tung: 1 } }, then: [['tung', 'À, anh gõ dài lắm rồi xóa. Tóm lại: đổi rồi, anh quên báo. Sorry. Trà sữa nha.']] },
      { t: 'Reply: "ok là đổi hay chưa ạ?"', fx: { nl: -2 }, then: [['nar', '"Tùng is typing…" Mười phút. "đổi rồi". Bạn đã mất một buổi chiều.']] },
    ] },
  ] },
  { id: 'r_leadership', who: 'obj:desk', obj: 'Bạn bị thêm nhầm vào kênh #leadership', time: '10:20', when: (r) => r.day < 24, scene: [
    ['nar', 'Bạn được thêm vào #leadership. Tin nhắn ghim trên cùng: file "Q4_toi_uu_nhan_su.xlsx". Hai phút sau bạn bị xóa khỏi kênh.'],
    { c: '_r_tech_leader', o: [
      { t: 'Không mở file. Nhắn chị Ngân: "Em bị thêm nhầm ạ."', fx: { uy: 2, rel: { ngan: 2 } }, then: [['ngan', 'Cảm ơn em. Em… không thấy gì đâu nhỉ? Không có gì để thấy đâu. Thật.']] },
      { t: 'Kể cho Tùng.', fx: { dr: 3, rel: { tung: 1 } }, then: [['tung', 'Tối ưu nhân sự. Nghĩa là layoff. Nghĩa là anh nên cập nhật CV. Cảm ơn em.']] },
    ] },
  ] },
  { id: 'r_api_key', who: 'thac', obj: 'Bot bảo mật gửi cảnh báo cho bạn', time: '11:50', scene: [
    ['nar', 'Bot bảo mật: "Phát hiện khóa API trong một repo công khai của bạn." Đó là repo bài tập cũ. File .env. Bạn quên xóa.'],
    { c: '_r_tech_apikey', o: [
      { t: 'Báo ngay anh Thạc, xin xoay khóa.', fx: { uy: 3, rel: { thac: 2 }, nl: -3 }, then: [['thac', 'Báo trong năm phút. Xoay khóa trong một tiếng. Postmortem có tên em, kèm chữ "trung thực". Hiếm đấy.']] },
      { t: 'Lẳng lặng xóa repo.', fx: { dr: 6 }, then: [['nar', 'Khóa vẫn nằm trong lịch sử commit. Ba ngày sau có 12 giao dịch lạ lúc 3 giờ sáng. Anh Thạc lại không ngủ.']] },
    ] },
  ] },
  { id: 'r_vy_khai', who: 'vy', obj: 'Vy nhờ một lời khuyên "không liên quan công việc"', time: '17:00', when: f('tie_vy_khai'), scene: [
    ['vy', 'Bạn nghĩ anh Khải có thích màu pastel không? Hỏi vì… design system. Chỉ vì design system thôi.'],
    { c: '_r_tech_vykhai', o: [
      { t: '"Anh Khải sẽ trả lời: it depends."', fx: { rel: { vy: 2 }, dr: 1 }, then: [['vy', 'Trời ơi đúng. Depends vào cái gì cơ chứ.'], ['think', 'Mình vừa thành quân sư tình yêu. Không có trong JD.']] },
      { t: '"Vy hỏi thẳng anh ấy đi. Về design system."', fx: { rel: { vy: 1, khai: 1 } }, then: [['nar', 'Chiều đó anh Khải comment trên Figma của Vy lần đầu tiên: "đẹp". Vy chụp màn hình 4 lần.']] },
    ] },
  ] },
  { id: 'r_coffee_machine', who: 'obj:coffee', obj: 'Máy pha cà phê có tờ giấy lạ', time: '09:50', when: nf('loc_left'), scene: [
    ['nar', 'Máy pha cà phê dán nhãn: "BEDROCK INFRASTRUCTURE · KHÔNG ĐƯỢC TẮT · Lộc". Bên dưới: "Nếu nó chết, công ty chết."'],
    { c: '_r_tech_machine', o: [
      { t: 'Pha một ly, rửa luôn bình cho mọi người.', fx: { nl: 12, rel: { loc: 1, hoa: 1 } }, then: [['loc', '☕❤️']] },
      { t: 'Pha một ly, đi.', fx: { nl: 10 }, then: [['nar', 'Cà phê ngon. Máy kêu như server cũ. Có lẽ đây chính là server cũ.']] },
    ] },
  ] },
  // official-only beats
  { id: 'r_off_pager', who: 'obj:desk', obj: 'Pager kêu giữa giờ trưa', time: '12:30', official: true, scene: [
    ['nar', 'Pager: "Độ trễ thanh toán 2,4 giây". Bạn đang ăn dở hộp cơm. Bạn là on-call. Giờ người nhận "🔥" là bạn.'],
    { c: '_r_tech_offpager', o: [
      { t: 'Bỏ cơm, xử lý theo runbook.', fx: { nl: -8, uy: 3, rel: { thac: 1 } }, then: [['nar', '12:51 ổn định. Cơm nguội. Đây là cảm giác "chính thức".']] },
      { t: 'Ăn nốt 3 phút rồi xử lý.', fx: { nl: 5, dr: 1 }, then: [['nar', 'Ba phút. Độ trễ lên 3,1 giây. Anh Kevin nhắn: "app chậm à em?". Bạn nuốt miếng cơm cuối như nuốt một ticket.']] },
    ] },
  ] },
  { id: 'r_off_1on1', who: 'diep', obj: '1:1 với chị Diệp (lần đầu, bị dời 3 lần)', time: '15:00', official: true, scene: [
    ['diep', 'Cuối cùng cũng có 1:1. Em muốn phát triển theo hướng nào? Chị có framework "career ladder" 7 bậc.'],
    { c: '_r_tech_off1on1', o: [
      { t: '"Em muốn được ngủ đủ 7 tiếng ạ."', fx: { rel: { diep: 1 }, dr: 1 }, then: [['diep', 'Bậc đó không có trong framework. Chị sẽ thêm. Bậc 0.']] },
      { t: '"Em muốn làm PM như chị."', fx: { rel: { diep: 2 } }, then: [['diep', 'Đừng. Đùa thôi. Bắt đầu bằng việc nói "không" với anh Kevin một lần mỗi tuần.']] },
    ] },
  ] },
];
