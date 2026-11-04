// Cân Đối & Cộng Sự — office theme, weekly review lines, promotion, endings, ties, object lines, food, life events.

export const THEME = {
  logo: ['CÂN ĐỐI & CỘNG SỰ', 'Kiểm toán · Thuế · Tư vấn · Dịch vụ kế toán', '"Integrity – Quality – Teamwork"'],
  skyline: 'TICK XONG CHƯA EM?',
  bossWall: 'Cân đối',
  banner: 'NỢ = CÓ  ·  LUÔN LUÔN',
  signs: {
    boss: 'PARTNER (hiếm khi có mặt)',
    finance: 'PHÒNG REVIEW · MANAGER',
    meeting: 'PHÒNG HỌP · CLOSING MEETING',
    standup: 'BUSY SEASON · KHÔNG HỎI "MẤY GIỜ VỀ"',
    pantry: 'PANTRY · Quỹ ăn đêm sau 21h',
  },
  desks: {
    me: ['Intern · Bạn', ['Excel', 'WP_E200_v3_REAL'], '#2fa37a'],
    c1: ['Diệp · A2', ['Tick-mark', '4 màu · 0 lỗi'], '#9b7bff'],
    c2: ['Vy · Intern', ['"Em xong rồi', 'ạ!" (09:02)'], '#e0a030'],
    c3: ['Tuấn · A1', ['Hội Tick', 'Mỏi Tay (94)'], '#62b38a'],
    n1: ['Bàn trống', ['Senior cũ', 'nghỉ sau Tết'], '#9aa0ad'],
    n2: ['Sang · Kế toán', ['40 khách', '12 cuộc nhỡ'], '#ff8a5b'],
    n3: ['Hiếu · Tax', ['Điều 4', 'khoản 2 điểm c'], '#c9a227'],
    n4: ['Bàn trống', ['Đang tuyển', 'A1 (1 suất)'], '#9aa0ad'],
    n5: ['Ngân · Advisory', ['Valuation', 'kịch bản 3/3'], '#3a7bd5'],
    n6: ['My · QC', ['Trang 37', 'thiếu ký nháy'], '#5a5a6a'],
    hr: ['Huệ · HR', ['Timesheet', '14 người chưa nộp'], '#ff7a9b'],
    senior: ['Khoa · Senior', ['Review note', '27 (1:07 AM)'], '#6b7a99'],
  },
  whiteboard: ['BUSY SEASON ⏳', 'Còn 12 ngày', 'Kiểm kê: 6 kho', 'PBC nhận: 6/42', '(Ai lấy bút xanh lá?)'],
  scrum: { cols: ['CHỜ KHÁCH GỬI', 'ĐANG TICK', 'ĐÃ SIGN-OFF'], notes: [
    ['PBC Phúc Lộc (lần 3)', 'Thư xác nhận 4/30', 'Thư giải trình', 'Hoá đơn 2,1 tỷ ??'],
    ['Phải thu E200', 'Tồn kho kho lạnh', 'Review note ×27'],
    ['Tiền mặt (khớp 1 đồng)'],
  ] },
  board: ['TẤT NIÊN 🧧', 'Bảng vàng timesheet', 'Sinh nhật Mèo Số Dư'],
  palette: { wall: '#f2fbf6', mint: '#d6f5e8', butter: '#fff6cc', lilac: '#e6ecff', peach: '#ffe6dc' },
  labels: {
    coffee: 'Pantry: trà gừng cô Lụa & quỹ ăn đêm',
    okr: 'Đọc bảng BUSY SEASON',
    altar: 'Thắp hương Thần Tài (xin khớp sổ)',
    safe: 'Nhìn tủ khoá con dấu',
    plant: 'Xem cây kim tiền (đã kiểm kê)',
    printer: 'Dùng máy in (in ra → scan lại)',
    redchair: 'Nhìn ghế của Partner',
    desk: 'Ngồi vào bàn tick-mark',
  },
  props: [
    { type: 'cabinet', slot: 'p1', label: 'HỒ SƠ KIỂM TOÁN 2025' },
    { type: 'cabinet', slot: 'p2', label: 'LƯU TRỮ · ĐỪNG MỞ' },
    { type: 'standee', slot: 'p3', label: 'BUSY SEASON|Tick xong|chưa em?|💪', color: '#b8f0d8' },
    { type: 'crates', slot: 'p4', label: 'GIẤY A4 · 40 THÙNG' },
    { type: 'cabinet', slot: 'p5', label: 'WP PHÚC LỘC FOODS' },
    { type: 'rack', slot: 'p6', label: 'Ổ CHUNG · AUDIT TRAIL' },
  ],
};

// Said by the Audit Manager (chị Thảo) at the Friday review.
export const REVIEW = {
  A: [
    'Tuần này em làm tốt. Chị không có note nào. Chị hơi bối rối.',
    'Tick-mark đúng màu, ref đủ, giờ ghi thật. Em đang làm chị mất việc review đấy.',
    'Anh Phong hỏi tên em. Lần này anh ấy gọi đúng. Ở đây đó là lời khen lớn nhất.',
    'Em làm như người đã qua một busy season. Chị hỏi nhanh: em có ngủ không?',
    'Không có gì để chê. Chị đã tìm. Kỹ.',
  ],
  B: [
    'Ổn. "Ổn" nghĩa là chị chỉ viết cho em mười hai note.',
    'Em làm đúng. Giờ chị cần em làm đúng nhanh hơn một chút.',
    'Tick-mark đẹp. Chỉ là vài cái tick sai chỗ.',
    'Em làm tốt, nhưng tốt kiểu năm ngoái.',
    'Chị không có gì để chê, nên chị cho B để em có động lực.',
  ],
  C: [
    'Tuần này chị thấy em bận. Chị chưa thấy em xong.',
    'Em clear note nhanh, nhưng clear bằng cách xoá note.',
    'Em chủ động lắm. Chủ động về sớm.',
    'Excel em ổn, nhưng sao lại hard-code một tỷ vào công thức?',
    'Em hỏi nhiều quá. À mà sao cái quan trọng thì em lại không hỏi?',
  ],
  D: [
    'Em có muốn tiếp tục ở Cân Đối không? Chị hỏi thật, không phải câu tu từ.',
    'Ba việc trễ hạn. Không có bằng chứng là em đã làm, nghĩa là em chưa làm.',
    'Chị sẽ ghi nhận. Vào thư quản lý. Của em.',
    'Hồ sơ tuần này của em giống thư xác nhận: chị gửi đi mà không thấy gì quay về.',
    'Nếu em là một khoản mục, chị sẽ đề xuất bút toán điều chỉnh.',
  ],
};

const countA = (r) => (r.reviews || []).filter((x) => x.grade === 'A').length;

// The one path to official: two A weeks, the sign-off (Partner remembers your answer), owning your own error,
// clean independence (no lie about the gift, no client-sent confirmations left unreported, no copied WP),
// a solid relationship with chị Thảo and good standing. Checked at the Friday review from day 33 on.
export const PROMOTION = {
  salary: 15_000_000,
  when: (r) => r.day >= 33 && countA(r) >= 2
    && !!r.flags.signoff_done && !!r.flags.partner_noticed && !!r.flags.owned_error
    && !r.flags.lie_gift && !r.flags.copied_too && !(r.flags.confirm_tainted && !r.flags.taint_owned)
    && (r.rel.thao || 0) >= 5 && r.st.uy >= 65,
  offer: [
    ['nar', 'Sau phần review, chị Thảo chưa cho bạn về. Cửa phòng Partner mở. Anh Phong bước ra, lần này không cầm vali.'],
    ['phong', 'Anh có năm phút. Anh dùng hết cho em.'],
    ['thao', 'Chị nói ngắn. Phòng Assurance có một suất A1. Chị và anh Phong muốn giữ em. Mười lăm triệu. Hợp đồng lao động, có bảo hiểm.'],
    ['phong', 'Người tự báo lỗi sau khi phát hành, anh gặp ít lắm. Người trả lời câu tồn kho bằng bằng chứng cũng ít. Cả hai thì… là em.'],
    { if: (r) => !!r.flags.thao_schedule, then: [['thao', 'Và từ khi em chỉ chị nút hẹn giờ gửi, cả team ngủ thêm được bốn tiếng. Chị tính đó là đóng góp.']] },
    { if: (r) => !!r.flags.stood_ghost, then: [['phong', 'Khoản 2,1 tỷ, em đứng trước anh mà không lùi. Anh nhớ chuyện đó hơn nhớ tên em.']] },
    ['think', 'Mười lăm triệu. Một suất. Busy season năm sau thì mình đã biết trước.'],
    { c: 'au_offer', o: [
      { t: 'Nhận lời. Mình muốn ký tên mình lên hồ sơ.', fx: { uy: 5, rel: { thao: 1, phong: 1 }, set: { accept_official: true } }, then: [
        ['thao', 'Tốt. Từ thứ Hai em là Associate 1. Nghĩa là không còn ai tha lỗi cho em vì là intern.'],
        ['phong', 'Và em sẽ có mã job riêng. Chúc mừng. Đó là thứ đầu tiên em sẽ ghi sai.'],
      ] },
      { t: '"Em cảm ơn, nhưng em muốn thử ở nơi khác ạ."', fx: { set: { accept_official: false } }, then: [
        ['thao', 'Chị ghi nhận. Lần này chị nói thật lòng.'],
        ['phong', 'Cửa phòng anh không mở thường xuyên. Nhưng không khoá.'],
      ] },
    ] },
  ],
  arc: [], // filled in index.js from episodes.ARC
};

export const ENDINGS = {
  finish: (r) => {
    const f = r.flags || {}, thao = (r.rel || {}).thao || 0, uy = (r.st || {}).uy || 0;
    if (f.accept_official === false) return { title: 'Bạn từ chối suất A1', text: 'Bạn từ chối offer. Chị Thảo nói "chị ghi nhận" lần cuối, nhưng lần này nghe như lời chúc. Bạn rời Cân Đối với giấy xác nhận thực tập và một cuộc đời chưa ai kiểm toán.' };
    if (f.lie_gift || f.hid_offer) return { title: 'Hết 45 ngày ở Cân Đối', text: 'Giấy xác nhận thực tập có thêm một dòng tay của chị My: "Cần cải thiện: tính độc lập." Dòng đó đi theo bạn lâu hơn hộp khô mực.' };
    if (thao >= 6) return { title: 'Hết 45 ngày ở Cân Đối', text: `Chị Thảo ký giấy xác nhận, viết thêm tay: "Biết hỏi. Biết dừng. Biết nhận lỗi. Cần ngủ." Email gửi lúc 3:02 sáng${f.thao_schedule ? ', hẹn giờ tới 7:00' : ''}. Thư giới thiệu này đáng giá hơn bạn nghĩ.` };
    if (uy >= 70) return { title: 'Hết 45 ngày ở Cân Đối', text: 'Không có suất chính thức, nhưng anh Hiếu và chị Ngân cùng nhắn hỏi bạn có muốn quay lại sau khi tốt nghiệp không. Cô Lụa đóng dấu giấy xác nhận thẳng hàng tuyệt đối.' };
    return { title: 'Hết 45 ngày ở Cân Đối', text: 'Chị Huệ gửi giấy xác nhận thực tập qua email. Mã job ghi sai. Tên bạn đúng. Bạn coi đó là một chiến thắng nhỏ của busy season.' };
  },
  quit: (r) => {
    const p = (r.flags || {}).final_path;
    if (p === 'client') return { title: 'Bạn sang phe khách hàng', text: 'Bạn làm kế toán tổng hợp ở Phúc Lộc Foods, lương gấp rưỡi. Tuần đầu, đoàn kiểm toán mới gửi PBC 42 dòng. Bạn chia ba đợt, đợt đầu tám mục. Intern bên kia gọi cảm ơn. Bạn suýt khóc.' };
    if (p === 'pushed') return { title: 'Bạn bị "tối ưu nguồn lực"', text: 'Bạn không ký chữ "nguyện vọng". Quyết định ghi "lý do kinh tế". Bạn nhận trợ cấp đúng quy định và một thư giới thiệu anh Phong viết tay: "Giữ ý kiến khi khó giữ." (thông tin giải trí, không phải tư vấn pháp lý)' };
    return { title: 'Bạn nghỉ việc sau busy season', text: 'Bạn nộp đơn sau khi nhận nửa tháng thưởng, cùng một nửa phòng Assurance. Ngủ ba ngày liền. Ngày thứ tư bạn mơ thấy tick-mark màu cam. Nghĩa là: hỏi lại. Bạn hỏi lại cuộc đời. Nó chưa trả lời.' };
  },
  layoff: { title: 'Cân Đối "tái cấu trúc"', text: 'Email ghi "tối ưu nguồn lực sau mùa vụ". Bạn đọc lại ba lần, như đọc một review note không có dấu hỏi. Rồi bạn hiểu: lần này không cần clear.' },
};

export const TIES = [
  { id: 'vy_phong', text: 'Vy là cháu gọi anh Phong bằng chú' },
  { id: 'hieu_my', text: 'Anh Hiếu và chị My đang hẹn hò bí mật' },
  { id: 'thao_khoa', text: 'Chị Thảo và anh Khoa từng cùng một đợt intern' },
  { id: 'hong_alum', text: 'Chị Hồng (Phúc Lộc) từng là intern ở Cân Đối' },
];

export const OBJ_LINES = {
  printer: [['nar', 'Máy in có dán giấy: "Quy trình: in ra → ký nháy → scan → upload. Đừng hỏi tại sao. — Phòng QC".']],
  desk: [['nar', 'Bàn của bạn. Một laptop đời 2017, bộ bút bốn màu (thiếu xanh lá), và tờ giấy nhớ: "Tick xong chưa em?"']],
  okr: [['nar', 'Bảng BUSY SEASON: "Còn 12 ngày". Ai đó đã sửa số 12 bốn lần. Lần nào cũng thành số lớn hơn.']],
  altar: [['nar', 'Bàn thờ Thần Tài. Lễ vật hôm nay: một bản TB đã cân và một gói hướng dương. Ai đó khấn: "Xin cho thư xác nhận về."'], { fx: { uy: 1 } }],
  safe: [['nar', 'Tủ khoá con dấu. Chìa khoá chỉ cô Lụa có. Trên tủ dán: "Con dấu không đi đâu hết. Giấy tờ đi tới con dấu."']],
  plant: [['nar', 'Cây kim tiền có thẻ kiểm kê: "Số lượng: 1. Tình trạng: héo nhẹ. Người kiểm: Diệp." Tick đỏ.']],
  redchair: [['nar', 'Ghế của Partner. Có một vết cà phê từ năm 2019. Không ai dám lau, sợ mất bằng chứng.']],
  interview: [['nar', 'Phòng họp. Bảng trắng còn dòng chữ từ buổi họp kết thúc: "Số này hơi lạ nhỉ?" Ai đó vẽ thêm mặt cười.']],
};

export const FOOD = [
  { t: 'Claim suất ăn đêm từ quỹ busy season (45.000đ, +30, cần hoá đơn đúng tên)', fx: { nl: 30, money: -45_000, clock: 15 }, then: [
    ['nar', 'Bạn đặt cơm, xin hoá đơn điện tử. Hoá đơn ghi "Công ty Cân Đổ". Chị Huệ trả về: sai tên, và chưa tới 21 giờ. Cơm thì đã ăn rồi.'],
  ] },
];

export const LIFE_EVENTS = [
  { id: 'audit_stockcall', emoji: '🧊', text: 'Nửa đêm, anh Khoa nhắn: "Cuối tuần có lịch kiểm kê kho phân bón lúc 4 giờ sáng. Mang khẩu trang. Và áo khoác. Và niềm tin."', choices: [
    { t: 'Đi ngủ ngay cho chắc', fx: { nl: 5 }, after: 'Bạn ngủ lúc 22:30. Mơ thấy pallet. Pallet trong mơ cũng không khớp.' },
    { t: 'Xem nốt một tập phim', fx: { nl: -10, dr: 1 }, after: 'Một tập thành ba tập. Sáng ra bạn có đôi mắt của anh Khoa.' },
  ] },
  { id: 'audit_acca', emoji: '📚', text: 'Bạn mở sách ACCA định học hai tiếng. Sách mở bạn ra và ru bạn ngủ ở trang 3.', choices: [
    { t: 'Pha cà phê, học tiếp', fx: { nl: -12, uy: 1 }, after: 'Bạn học xong chương "Ethics". Ngày mai bạn sẽ nhìn hộp khô mực bằng con mắt khác.' },
    { t: 'Gối đầu lên sách ngủ', fx: { nl: 8 }, after: 'Sách ACCA là cái gối đắt nhất bạn từng mua.' },
  ] },
  { id: 'audit_latecall', emoji: '📞', text: '22:47. Chị Thảo gọi: "Chị hỏi nhanh thôi."', when: (r) => r.day > 3, choices: [
    { t: 'Nghe máy', fx: { nl: -10, uy: 1 }, after: 'Cuộc gọi "nhanh thôi" dài 38 phút. Câu cuối: "Thôi em ngủ đi." Bạn không ngủ được nữa.' },
    { t: 'Để máy rung, sáng gọi lại', fx: { dr: 2, nl: 3 }, after: 'Sáng ra chị Thảo nhắn: "Không sao, chị tự tìm ra rồi." Không sao là có sao.' },
  ] },
];
