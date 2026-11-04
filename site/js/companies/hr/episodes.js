// Người Đúng Chỗ HR — intern drama days (Day 1 … Day 40) and the official-only arc.
// Flags set here are read later (other episodes, routine beats, promotion.when, endings).

const isOfficial = (s) => s.status === 'official';

export const STANDUP_POS = { duy: 'scrum', ngan: 'su1', tuan: 'su2', vy: 'su3', phat: 'su4', quan: 'su5', my: 'su6', khoa: 'su7', bach: 'su8' };
export const LUNCH_POS = { vy: 'lunch1', quan: 'lunch2', phat: 'lunch3', khoa: 'lunch4', my: 'lunch5' };

// ---------------- mini-games ----------------
export const BOOLEAN_MINI = {
  type: 'quiz', title: 'Boolean search trên LinkedIn', icon: '🔎',
  prompt: 'Job: Kế toán trưởng biết tiếng Nhật, không lấy người đang làm ở chính khách hàng (Phú Quý).', time: 35, pass: 0.66,
  questions: [
    { q: 'Chuỗi tìm kiếm nào đúng?', options: ['"Kế toán trưởng" AND (tiếng Nhật OR N2 OR N1)', 'Kế toán trưởng tiếng Nhật giỏi giang dễ thương', '"Kế toán trưởng" NOT tiếng Nhật'], correct: 0 },
    { q: 'Loại người đang làm ở chính khách hàng: thêm…', options: ['AND "Phú Quý"', 'NOT "Phú Quý"', 'OR "Phú Quý"'], correct: 1 },
    { q: 'Dấu ngoặc kép "…" dùng để…', options: ['Tìm đúng nguyên cụm từ', 'Làm câu lệnh trông chuyên nghiệp', 'Báo LinkedIn đây là việc gấp'], correct: 0 },
  ],
};

export const JD_MINI = {
  type: 'pick', title: 'Viết lại JD Trợ lý Giám đốc', icon: '✍️',
  prompt: 'Chọn 3 tiêu chí được đưa vào tin tuyển dụng: đo được, liên quan đến công việc.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Tiếng Anh giao tiếp tốt (có bài test)', correct: true },
    { text: 'Nữ, dưới 25 tuổi' },
    { text: 'Ngoại hình sáng' },
    { text: 'Chưa có ý định sinh con' },
    { text: 'Kinh nghiệm quản lý lịch và hồ sơ cho cấp giám đốc', correct: true },
    { text: 'Thành thạo Word, Excel, soạn thảo văn bản', correct: true },
    { text: '10 năm kinh nghiệm', sub: '(cùng lúc với "dưới 25 tuổi")' },
  ],
};

export const CHIP_MINI = {
  type: 'pick', title: 'Shortlist: Kỹ sư thiết kế vi mạch, tiếng Nhật N2', icon: '🔬',
  prompt: 'Tám hồ sơ từ ATS. Chọn 3 hồ sơ thật sự phù hợp.', pick: 3, time: 40, pass: 0.66,
  items: [
    { text: 'Kỹ sư thiết kế vi mạch 4 năm, JLPT N2', correct: true },
    { text: 'Kỹ sư điện lạnh 10 năm', sub: '"Cũng là mạch"' },
    { text: 'Thông dịch tiếng Nhật N1, chưa làm kỹ thuật' },
    { text: 'Kỹ sư kiểm thử vi mạch 3 năm, N2, từng làm ở Nhật', correct: true },
    { text: 'Sinh viên năm 2 ngành điện tử, thích anime' },
    { text: 'Kỹ sư thiết kế vi mạch 7 năm, N2, sẵn sàng chuyển chỗ', correct: true },
    { text: 'Kỹ sư phần mềm, "biết vi mạch qua YouTube"' },
    { text: 'Vi Mạch Bakery', sub: 'Tiệm bánh. Lọt vào vì tên.' },
  ],
};

export const PCT_MINI = {
  type: 'quiz', title: 'Khảo sát lương: P25 · P50 · P75', icon: '📈',
  prompt: 'Chị My đứng sau lưng bạn. Đừng dùng máy tính bỏ túi, chị ấy sẽ buồn.', time: 40, pass: 0.66,
  questions: [
    { q: 'Bảy mức lương (triệu): 12, 14, 15, 18, 20, 22, 95. Trung vị (P50) là?', options: ['18 triệu', '28 triệu (trung bình)', '95 triệu'], correct: 0 },
    { q: 'Số 95 triệu kéo trung bình lên 28. Báo cáo nên…', options: ['Dùng trung bình cho đẹp', 'Dùng trung vị, ghi chú số ngoại lai', 'Xóa số 95, không ai biết'], correct: 1 },
    { q: 'P75 nghĩa là…', options: ['75% mẫu có lương bằng hoặc thấp hơn mức này', 'Lương của 75 người', 'Lương tăng 75%'], correct: 0 },
  ],
};

export const ICE_MINI = {
  type: 'quiz', title: 'Icebreaker: Hai sự thật, một lời nói dối', icon: '🎲',
  prompt: 'Anh Khoa đọc ba câu về một đồng nghiệp. Câu nào là lời nói dối?', time: 35, pass: 0.66,
  questions: [
    { q: 'Anh Duy: (A) dậy 5:30 đăng LinkedIn (B) từng bị cho nghỉ vì "tái cấu trúc" (C) đã ký hợp đồng lao động cho cả công ty', options: ['(A)', '(B)', '(C)'], correct: 2 },
    { q: 'Chị Thảo: (A) làm kế toán, lễ tân và HR nội bộ (B) nghỉ đủ 12 ngày phép năm ngoái (C) giữ chìa khóa két', options: ['(A)', '(B)', '(C)'], correct: 1 },
    { q: 'Anh Tuấn: (A) chốt deal trong pantry (B) gọi cho mẹ mỗi trưa (C) chưa từng bị ứng viên ghost', options: ['(A)', '(B)', '(C)'], correct: 2 },
  ],
};

export const ONBOARD_MINI = {
  type: 'order', title: 'Onboarding cho chính công ty mình', icon: '🧭',
  prompt: 'Xếp các bước onboarding đúng thứ tự. (Gợi ý: ngược với những gì bạn đã trải qua.)', time: 30, pass: 0.6,
  items: [
    { text: 'Gặp lại sau hai tuần: hỏi người mới cần gì', order: 4 },
    { text: 'Ký thỏa thuận / hợp đồng, đủ hai chữ ký', order: 0 },
    { text: 'Giao việc đầu tiên, có hạn, có người review', order: 3 },
    { text: 'Cấp laptop, tài khoản (không dán mật khẩu dưới đáy máy)', order: 1 },
    { text: 'Giới thiệu người hướng dẫn và JD của vị trí', order: 2 },
  ],
};

export const REF_MINI = {
  type: 'pick', title: 'Ghi chú cuộc gọi tham chiếu', icon: '🤧',
  prompt: 'Chọn 3 điểm đáng ngờ trong cuộc gọi với "anh Tùng".', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: '"Anh Tùng" nói "tôi…" rồi sửa thành "anh ấy"', correct: true },
    { text: 'Tiếng em bé khóc phía sau giống hệt cuộc phỏng vấn anh Nam hôm trước', correct: true },
    { text: 'Số "công ty cũ" là số di động, Zalo tên "Nam Kế Toán"', correct: true },
    { text: '"Anh Tùng" khen anh Nam chăm chỉ, đúng hạn' },
    { text: 'Cuộc gọi lúc 10 giờ sáng, giờ hành chính' },
    { text: '"Anh Tùng" giọng khàn', sub: '(cũng có thể chỉ là bị cảm)' },
  ],
};

export const TIMELINE_MINI = {
  type: 'order', title: 'Dựng lại timeline "đi đường vòng"', icon: '🗓️',
  prompt: 'Xếp các mốc theo thứ tự thời gian để gửi khách.', time: 30, pass: 0.6,
  items: [
    { text: 'Đất Vàng nhắn riêng chị Bảo Châu qua LinkedIn', order: 2 },
    { text: 'Bên mình gửi CV chị Bảo Châu, kèm thỏa thuận phí', order: 0 },
    { text: 'LinkedIn: "Hãy chúc mừng chị Bảo Châu với công việc mới!"', order: 4 },
    { text: 'Chị Kim Anh trả lời email: "Không phù hợp"', order: 1 },
    { text: 'Chị Bảo Châu nhận việc ở Đất Vàng', order: 3 },
  ],
};

export const PAYSLIP_MINI = {
  type: 'pick', title: 'Phiếu lương (bản nháp, vẽ bằng Excel)', icon: '🧾',
  prompt: 'Tìm 3 lỗi trên phiếu phụ cấp của bạn.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Họ tên: "Thực Tập Sinh 2"', correct: true },
    { text: 'Phụ cấp: "theo thỏa thuận"', sub: '(không có con số)', correct: true },
    { text: 'Trừ BHXH 10,5%', sub: '(bạn chưa có hợp đồng lao động)', correct: true },
    { text: 'Trừ "quỹ team building" 200.000đ', sub: '(chưa ai hỏi ý bạn)', correct: true },
    { text: 'Kỳ lương: tháng này' },
    { text: 'Đơn vị chi trả: Người Đúng Chỗ HR' },
    { text: 'Ngày công: 22' },
  ],
};

export const ASSESS_MINI = {
  type: 'quiz', title: 'Đọc kết quả assessment: ông Lực', icon: '📊',
  prompt: 'Giải quyết vấn đề 4,6 · Làm việc nhóm 4,7 · An toàn lao động 4,8 · "Phục tùng cấp trên" 2,0 (thang 5).', time: 35, pass: 0.66,
  questions: [
    { q: 'Ông Lực phù hợp vai trò trưởng ca ở mức…', options: ['Cao: các năng lực cốt lõi đều mạnh', 'Thấp: vì điểm phục tùng thấp', 'Không kết luận được'], correct: 0 },
    { q: '"Phục tùng cấp trên" có trong khung năng lực khách đã duyệt không?', options: ['Không. Khung chỉ có: vấn đề, nhóm, an toàn, giao tiếp', 'Có, ở trang 0'], correct: 0 },
    { q: 'Báo cáo đúng nghề nên…', options: ['Báo điểm thật, kèm gợi ý phát triển', 'Chỉnh điểm theo mong muốn của khách', 'Giấu báo cáo khỏi ông Lực'], correct: 0 },
  ],
};

export const FUNNEL_MINI = {
  type: 'order', title: 'Phễu RPO: tuyển công nhân', icon: '🏭',
  prompt: 'Xếp phễu tuyển dụng theo đúng thứ tự (và chuẩn bị tinh thần cho các con số).', time: 30, pass: 0.6,
  items: [
    { text: 'Hẹn 30 người phỏng vấn', order: 2 },
    { text: 'Đăng tin trên sáu nền tảng', order: 0 },
    { text: '4 người nhận việc', order: 4 },
    { text: 'Gọi 120 số điện thoại', order: 1 },
    { text: '11 người đến (4 người đi nhầm tòa nhà)', order: 3 },
    { text: '2 người đi làm ngày đầu', order: 5 },
  ],
};

export const AI_MINI = {
  type: 'pick', title: 'CVinator 3000: quy tắc AI tự học', icon: '🤖',
  prompt: 'AI học từ dữ liệu tuyển dụng cũ của công ty. Chọn 3 quy tắc có vấn đề.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Ưu tiên ứng viên nam', sub: '(học từ các shortlist cũ)', correct: true },
    { text: 'Trừ điểm CV có khoảng trống 6–12 tháng', sub: '(thường là nghỉ sinh con)', correct: true },
    { text: 'Loại ứng viên trên 35 tuổi', correct: true },
    { text: 'Ưu tiên kinh nghiệm đúng ngành' },
    { text: 'Ưu tiên chứng chỉ liên quan đến vị trí' },
    { text: 'Loại CV có ảnh đại diện là con mèo', sub: '(cái này thì… cũng được)' },
  ],
};

// ---------------- intern episodes ----------------
export const EPISODES = [
  // ===== Day 1 =====
  {
    id: 'onboarding', day: 1, title: 'Onboarding không có onboarding',
    intro: 'Thứ Hai, 8:30. Ngày đầu tiên ở Người Đúng Chỗ HR, công ty chuyên tư vấn onboarding cho doanh nghiệp.\n\nBạn mang Căn cước bản gốc, một cây bút và rất nhiều kỳ vọng. Một trong ba thứ đó sẽ dùng được.\n\nNgoài việc chính, các anh chị sẽ nhờ bạn vài việc vặt. Xem danh sách ở góc màn hình, làm kịp giờ thì được ghi nhận.',
    steps: [
      {
        who: 'thao', obj: 'Tới lễ tân gặp chị Thảo nhận thẻ và laptop', time: '08:30',
        scene: [
          ['thao', 'Ơ, em đi làm hôm nay hả? Thẻ từ… bên chị không có thẻ từ. Cửa mở bằng cách gọi chị.'],
          ['thao', 'Laptop của em là máy của bạn intern khóa trước. Mật khẩu dán dưới đáy máy.'],
          ['nar', 'Mặt dưới laptop: "Culture@123". Bên cạnh có dòng bút bi: "Chúc bạn may mắn hơn mình."'],
          ['thao', 'Còn tài liệu onboarding thì anh Duy có gửi link. Em mở thử.'],
          ['nar', 'Link "Onboarding_NguoiDungCho_v1". Màn hình: "Bạn cần quyền truy cập".'],
          { c: 'hr_d1_access', o: [
            { t: 'Bấm "Yêu cầu quyền truy cập".', fx: { nl: -2, set: { drive_request: true } }, then: [
              ['nar', 'Yêu cầu đã gửi tới anh Duy. Anh Duy sẽ duyệt lúc 23:47, kèm một sticker trái tim.'],
            ] },
            { t: 'Hỏi Vy xem có tài liệu nào dùng được không.', fx: { rel: { vy: 2 }, set: { vy_notes: true } }, then: [
              { chat: [['vy', 'có nè. file "Sống sót ở NĐC" mình tự viết, 4 trang. quan trọng nhất là trang 3: ĐỪNG SORT ATS', true]] },
              ['think', 'Tài liệu onboarding thật của mọi công ty luôn là file một nhân viên tự viết.'],
            ] },
            { t: '"Chị ơi, JD của vị trí em là gì ạ?"', fx: { uy: 2, rel: { thao: 1 }, set: { asked_own_jd: true } }, then: [
              ['thao', 'JD… của em hả? Bên chị viết JD cho hai trăm khách rồi. JD của mình thì… chưa ai viết.'],
              ['thao', 'Em làm "mọi việc liên quan đến tuyển dụng và các việc khác". Chị đọc trên bài LinkedIn của anh Duy.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: '8:45 Họp KPI: mọi người đọc to số CV', time: '08:45', pos: STANDUP_POS,
        scene: [
          ['duy', 'Good morning gia đình! Quote hôm nay: "Người giỏi không cần quản lý, chỉ cần tầm nhìn." Giờ đọc số CV hôm qua!'],
          ['vy', 'Bốn mươi mốt.'],
          ['phat', 'Mười hai. Ba người ghost. Một người block.'],
          ['quan', 'Năm mươi hai ạ!'],
          ['ngan', 'Ba. Cả ba được mời phỏng vấn.'],
          ['duy', 'Ba hả Ngân? Mình bán người chứ không bán CV, nhưng mà… ba hơi ít.'],
          ['tuan', 'Anh không đếm CV. Anh đếm cuộc gọi. Hôm qua ba mươi hai cuộc, một ứng viên khóc, một ứng viên chốt.'],
          ['duy', 'Welcome {ten}! Hôm nay em đặt mục tiêu bao nhiêu CV?'],
          { c: 'hr_d1_kpi', o: [
            { t: '"Hôm nay em học quy trình trước, để CV em gửi đi là CV đúng ạ."', fx: { uy: 3, rel: { ngan: 2, duy: -1 } }, then: [
              ['duy', 'Học là tốt. Nhưng học nhanh nhé. Thị trường không chờ ai.'],
              ['ngan', '(nhỏ) Câu trả lời chuẩn. Đừng để anh ấy biết chị khen.'],
            ] },
            { t: '"Em sẽ cố bốn mươi ạ!"', fx: { dr: 2, rel: { duy: 2, quan: -1 }, set: { promised_40: true } }, then: [
              ['duy', 'Đấy! Năng lượng! Ghi lên bảng: {ten}: 40.'],
              ['quan', '(nhỏ) Bốn mươi ngay ngày đầu? Gắt.'],
              ['think', 'Mình còn chưa biết ATS nằm ở đâu.'],
            ] },
            { t: '"KPI của intern có ghi trong JD không ạ?"', fx: { uy: 2, dr: 2, rel: { duy: -1, phat: 1 }, set: { asked_own_jd: true } }, then: [
              ['duy', 'JD của em đang được hoàn thiện. Tuần sau. Tầm nhìn có trước, giấy tờ có sau.'],
              ['phat', '(thì thầm) JD của mình cũng "tuần sau". Năm tháng rồi.'],
            ] },
          ] },
          ['nar', 'Họp KPI kết thúc khi anh Duy nghe điện thoại khách. Trên bảng có thêm dòng: "Chất lượng > số lượng (nhưng vẫn đếm)".'],
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân giao job đầu tiên', time: '09:30',
        scene: [
          ['ngan', 'Ngồi đây. Job đầu tiên: Kế toán trưởng biết tiếng Nhật cho Bao Bì Phú Quý. Tuyển được thì khách trả phí hai tháng lương.'],
          ['ngan', '"Tuyển được thì". Đó là chữ quan trọng nhất nghề này. Không tuyển được, mình làm không công.'],
          ['ngan', 'Mở LinkedIn. Chị muốn xem em viết chuỗi tìm kiếm thế nào.'],
          { mini: BOOLEAN_MINI,
            good: [['ngan', 'Ổn. Có ngoặc, có NOT. Em vừa tiết kiệm cho mình ba tiếng đọc CV sai.'], { fx: { uy: 3, rel: { ngan: 1 }, set: { boolean_ok: true } } }],
            bad: [['ngan', 'Chuỗi này ra 14.000 người, trong đó có một ông bán sushi. Chị sửa lại, em nhìn kỹ nhé.'], { fx: { nl: -4 } }],
          },
          { c: 'hr_d1_ngan', o: [
            { t: '"Ứng viên không phải trả phí cho mình đúng không chị?"', fx: { uy: 2, rel: { ngan: 1 } }, then: [
              ['ngan', 'Đúng. Khách trả. Chỗ nào bắt ứng viên trả tiền để được giới thiệu việc thì em tránh xa.'],
              ['ngan', 'Ứng viên không phải khách hàng, nhưng là con người. Nhớ cả hai.'],
            ] },
            { t: '"Chị có tài liệu quy trình không ạ?"', fx: { rel: { ngan: 2 }, set: { ngan_doc: true } }, then: [
              ['ngan', 'Có. Chị viết năm ngoái, mười một trang. Em là người thứ hai mở nó. Người thứ nhất là chị.'],
              ['think', 'Hóa ra công ty có onboarding. Chỉ là không ai biết.'],
            ] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Giờ trưa! Ra pantry ăn với Vy và mọi người', time: '12:00', pos: LUNCH_POS,
        scene: [
          ['vy', 'Ngồi đây nè! Ngày đầu sao? Đếm được mấy tab rồi?'],
          ['khoa', 'Trước khi ăn, icebreaker! Mỗi người nói một điều về mình mà chưa ai biết.'],
          ['my', 'Chị biết lương của mọi người. Đó là điều mọi người không biết là chị biết.'],
          ['phat', '…Mình chưa có hợp đồng lao động. Đó là điều ai cũng biết.'],
          ['quan', 'Mình hôm qua ngủ bốn tiếng vì làm CV!'],
          ['kpi', 'Meo.'],
          ['nar', 'Mèo Ghost nhảy lên ghế trống, ăn mất một miếng chả, rồi biến mất trước khi ai kịp nhìn rõ.'],
          { c: 'hr_d1_lunch', o: [
            { t: 'Hỏi Phát chuyện hợp đồng.', fx: { rel: { phat: 2 }, set: { knows_phat: true } }, then: [
              ['phat', 'Năm tháng. Mỗi lần hỏi, anh Duy bảo "mình là gia đình". Gia đình mình ít ra còn có sổ hộ khẩu.'],
              ['think', 'Công ty nhân sự mà nhân viên không có hợp đồng. Chắc là đùa.'],
              ['phat', 'Không đùa đâu.'],
            ] },
            { t: 'Hỏi chị My: "Lương intern thị trường bao nhiêu ạ?"', fx: { rel: { my: 2 }, set: { my_p25: true } }, then: [
              ['my', 'Em đang ở dưới P25. Đừng buồn. P25 là một cộng đồng rất đông.'],
              ['vy', 'Chị My nói câu này với mọi intern. Và chị ấy đúng với mọi intern.'],
            ] },
            { t: 'Chơi icebreaker của anh Khoa thật nhiệt tình.', fx: { nl: -2, rel: { khoa: 2, vy: 1 } }, then: [
              ['me', 'Em từng bị một công ty ghost sau vòng ba ạ.'],
              ['khoa', 'Tuyệt! Từ trải nghiệm ứng viên, em sẽ thành recruiter có tâm!'],
              ['vy', 'Hoặc thành recruiter ghost lại người khác. Một trong hai.'],
            ] },
          ] },
          { fx: { nl: 25 } },
          ['nar', 'Ba mươi phút ăn trưa. Không ai nhắc KPI. Chỉ có Quân đếm thầm số CV trên ngón tay.'],
        ],
      },
      {
        who: 'tuan', obj: 'Anh Tuấn gọi bạn vào pantry', time: '14:30',
        scene: [
          ['tuan', '…Anh Sơn ơi, mai anh đi làm ở Đất Vàng rồi, em mừng cho anh! Dạ, cơ hội này không đến hai lần!'],
          ['tuan', '(cúp máy) Nghe thấy chưa? Ứng viên Giám đốc Kinh doanh. Phí hai tháng lương. Mai là ngày đi làm đầu tiên.'],
          ['tuan', 'Sáng mai tám giờ em gọi nhắc anh Sơn giúp anh. Giọng tươi.'],
          { c: 'hr_d1_son', o: [
            { t: '"Anh Sơn có vẻ chắc chưa anh?"', fx: { uy: 2, rel: { tuan: 1 }, set: { son_doubt: true } }, then: [
              ['tuan', 'Chắc! …Chắc. Lúc nhắc đến sếp cũ anh ấy im ba giây. Nhưng chắc.'],
              ['think', 'Ba giây im lặng trong nghề này chắc dài lắm.'],
            ] },
            { t: 'Ghi câu "cơ hội không đến hai lần" vào sổ.', fx: { rel: { tuan: 2 } }, then: [
              ['tuan', 'Học nhanh đấy. Nhớ: giọng tươi, mắt cười, dù ứng viên không nhìn thấy em.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: '17:30 Về bàn: anh Duy nhắn tin', time: '17:30',
        scene: [
          ['nar', '17:30. Văn phòng còn sáng đèn. Anh Duy đang livestream LinkedIn trong phòng, cạnh vòng đèn "LIVE 5:30".'],
          { chat: [['duy', 'Em viết giúp anh bài LinkedIn chào mừng em nhé. Kiểu "hành trình gia nhập gia đình". Tối nay đăng 😊', true]] },
          ['think', 'Viết bài chào mừng chính mình. Mình là ứng viên, là recruiter, giờ kiêm luôn phòng truyền thông.'],
          { c: 'hr_d1_post', o: [
            { t: 'Viết ngắn, thật: "Ngày đầu, nhiều thứ để học."', fx: { uy: 2, rel: { ngan: 1 }, set: { post_honest: true } }, then: [
              ['nar', 'Anh Duy sửa thành: "Ngày đầu, nhiều thứ để học và một GIA ĐÌNH để thuộc về 💜🚀". 312 like.'],
            ] },
            { t: 'Viết đúng kiểu anh Duy thích, thêm năm emoji.', fx: { dr: 2, nl: -4, rel: { duy: 2 } }, then: [
              ['nar', 'Bài đăng lúc 22:00: "Từ ứng viên đến người nhà: hành trình của {ten} 💜🔥🚀🙏✨". 1.024 like. Mẹ bạn share.'],
            ] },
            { t: 'Về đúng giờ, mai viết.', fx: { nl: 15 }, then: [
              ['nar', 'Bạn về lúc 17:31. 21:00, anh Duy tự viết và tag bạn. Ảnh minh họa là một người nước ngoài cầm cặp táp.'],
              { fx: { dr: 2 } },
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => {
      const b = [];
      if (s.flags.asked_own_jd) b.push('Mình hỏi JD của chính mình. Công ty viết JD cho hai trăm khách, nhưng chưa có cái nào cho mình.');
      else b.push('Laptop của mình có mật khẩu dán dưới đáy, kèm lời chúc may mắn của intern khóa trước.');
      if (s.flags.knows_phat) b.push('Phát làm năm tháng chưa có hợp đồng.');
      if (s.flags.son_doubt) b.push('Anh Sơn im ba giây khi nhắc sếp cũ. Mai mình gọi nhắc anh ấy.');
      return `Ngày 1. ${b.join(' ')} Mèo Ghost ăn mất miếng chả của mình.`;
    },
  },

  // ===== Day 2 =====
  {
    id: 'ghost_day1', day: 2, title: 'Ứng viên bốc hơi',
    intro: 'Thứ Ba, 8:00. Hôm nay anh Sơn, Giám đốc Kinh doanh do anh Tuấn giới thiệu, đi làm ngày đầu ở Đất Vàng Land.\n\nAnh Tuấn đã đặt lẩu mừng. Việc của bạn chỉ là gọi nhắc anh Sơn. Giọng tươi.',
    chatStart: [['tuan', 'EM ƠI GỌI ANH SƠN CHƯA', true]],
    steps: [
      {
        who: 'tuan', obj: 'Ra pantry gặp anh Tuấn: gọi anh Sơn', time: '08:30',
        scene: [
          ['tuan', 'Em gọi chưa? Anh gọi bốn cuộc rồi. Thuê bao không liên lạc được. Từ tối Chủ Nhật.'],
          ['nar', 'Bạn gọi. "Thuê bao quý khách vừa gọi tạm thời không liên lạc được." Giọng tổng đài còn tươi hơn anh Tuấn.'],
          ['tuan', 'Zalo: đã xem, không trả lời. LinkedIn: vẫn ghi công ty cũ. Ảnh đại diện vừa đổi sang… một bãi biển.'],
          ['think', 'Ảnh bãi biển. Trong nghề này, đó là một tín hiệu.'],
          { if: (s) => !!s.flags.son_doubt, then: [['think', 'Ba giây im lặng hôm qua. Mình đã thấy nó đến.']] },
          { c: 'hr_d2_first', o: [
            { t: 'Nhắn anh Sơn một tin ngắn, lịch sự, không trách.', fx: { uy: 2, set: { son_msg: true } }, then: [
              ['me', '(nhắn) Anh Sơn ơi, em bên Người Đúng Chỗ. Nếu có gì thay đổi anh cứ nói thật, bên em hỗ trợ anh ạ.'],
              ['nar', 'Đã xem. Ba chấm hiện lên. Rồi biến mất.'],
            ] },
            { t: 'Gọi thêm mười cuộc nữa.', fx: { nl: -6, dr: 1, rel: { tuan: 1 } }, then: [
              ['nar', 'Tới cuộc thứ mười một, bạn nhận ra mình đang gọi nhầm số của chính anh Tuấn.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:kimanh', obj: 'Đất Vàng Land đang gọi Teams! (nghe máy)', time: '09:00',
        call: { title: 'Đất Vàng Land <> Người Đúng Chỗ · "Anh Sơn đâu?"', people: ['kimanh', 'tuan', 'me'] },
        scene: [
          ['kimanh', 'Chào em. Anh Sơn đâu? Sếp chị đứng ở sảnh với bó hoa từ 7:45. Hoa bắt đầu héo rồi.'],
          ['tuan', '(tắt mic) Nói gì cũng được, đừng nói là mất liên lạc.'],
          { c: 'hr_d2_kimanh', o: [
            { t: 'Nói thật: chưa liên lạc được, đang xử lý, chiều nay có phương án dự phòng.', fx: { uy: 4, rel: { kimanh: 1, tuan: -1 }, set: { son_honest: true } }, then: [
              ['kimanh', '…Cảm ơn em đã nói thật. Chị ghét nhất là bị nói dối lúc sếp chị đang cầm hoa.'],
              ['tuan', '(nhắn) em làm anh mất mặt. nhưng mà… thôi, đúng.'],
            ] },
            { t: '"Dạ anh ấy đang kẹt xe ạ."', fx: { dr: 4, rel: { tuan: 1 }, set: { son_lied: true } }, then: [
              ['kimanh', 'Kẹt xe hai tiếng? Ok. Chị chờ thêm ba mươi phút.'],
              ['think', 'Ba mươi phút nữa mình sẽ phải bịa thêm một vụ tai nạn giao thông.'],
            ] },
            { t: 'Để anh Tuấn trả lời.', fx: { dr: 2, rel: { tuan: 1 } }, then: [
              ['tuan', 'Dạ chị ơi, anh Sơn… có việc gia đình đột xuất ạ!'],
              ['kimanh', 'Việc gia đình là đi biển à? Chị vừa thấy ảnh đại diện mới.'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân muốn bàn phương án', time: '11:00',
        scene: [
          ['ngan', 'Chị nghe rồi. Ứng viên no-show ngày đầu. Chuyện thường. Cách xử lý thì không thường.'],
          ['ngan', 'Trước giờ trưa em làm được một trong hai việc. Chọn đi.'],
          { c: 'hr_d2_plan', o: [
            { t: 'Ra quán cà phê dưới công ty cũ của anh Sơn, "tình cờ" gặp.', fx: { nl: -12, set: { son_found: true } }, then: [
              ['nar', '12:05. Quán cà phê tầng trệt. Anh Sơn mặc vest, ngồi cạnh một người đàn ông đang vỗ vai anh rất thân thiết.'],
              ['nar', 'Anh Sơn thấy bạn. Anh giật mình như vừa gặp chủ nợ.'],
              ['think', 'Chắc chắn đó là sếp cũ. Và cái vỗ vai kia trị giá ba mươi phần trăm lương.'],
            ] },
            { t: 'Gọi lại ba ứng viên dự phòng trong shortlist cũ, chuẩn bị gửi khách.', fx: { uy: 4, nl: -6, rel: { ngan: 2 }, set: { backup_ready: true } }, then: [
              ['ngan', 'Tốt. Khách không cần mình luôn đúng. Khách cần mình có phương án.'],
              ['nar', 'Hai trong ba người nghe máy. Một người hỏi "lương gross hay net". Vẫn là một khởi đầu.'],
            ] },
            { t: 'Chờ thêm. Có khi chiều anh ấy đến.', fx: { nl: 5, rel: { ngan: -1 } }, then: [
              ['ngan', 'Chờ cũng là một chiến lược. Chiến lược của người sắp mất khách.'],
            ] },
          ] },
        ],
      },
      {
        who: 'my', obj: 'Chị My vẫy bạn qua', time: '14:00',
        scene: [
          ['my', 'Em lo vụ anh Sơn hả? Chị đoán: sếp cũ tăng lương ba mươi phần trăm. Đúng không?'],
          ['me', 'Sao chị biết ạ?'],
          ['my', 'Anh ấy đang ở P50. Tăng ba mươi phần trăm là lên P90. Công ty cũ trả P90 để giữ một người họ chưa từng muốn giữ.'],
          ['my', 'Chị thấy nhiều người nhận counter-offer rồi vẫn đi trong vòng một năm. Lý do họ muốn đi thì chưa đi đâu cả.'],
          { c: 'hr_d2_my', o: [
            { t: 'Ghi lại để vài tháng nữa hỏi thăm anh Sơn.', fx: { rel: { my: 1 }, set: { son_followup: true } }, then: [
              ['my', 'Khôn. Đừng đốt cầu. Ứng viên hôm nay là ứng viên của sáu tháng sau.'],
            ] },
            { t: '"Vậy mình cứ thuyết phục anh ấy đi tiếp ạ?"', fx: { rel: { my: 1 } }, then: [
              ['my', 'Thuyết phục thì được. Ép thì không. Người bị ép thường đi làm ba ngày rồi biến mất lần hai.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:son', obj: 'Anh Sơn gọi lại! (nghe máy)', time: '16:00',
        call: { title: 'Anh Sơn · "Anh xin lỗi"', people: ['son', 'me'] },
        scene: [
          ['son', 'Em ơi, anh xin lỗi. Anh tắt máy vì không dám nghe. Sếp cũ tăng anh ba mươi phần trăm, cho thêm chức "Giám đốc vùng".'],
          { if: (s) => !!s.flags.son_found, then: [['son', 'Lúc trưa em thấy anh rồi đấy. Anh ngại quá.']] },
          ['son', 'Anh biết anh đã ký offer. Anh sai. Em mắng anh đi cho anh đỡ áy náy.'],
          { c: 'hr_d2_son', o: [
            { t: 'Hỏi anh: những lý do anh từng muốn đi là gì?', fx: { uy: 3, rel: { son: 2 }, set: { son_respect: true } }, then: [
              ['son', '…Sếp không nghe ai. Không lộ trình. Lương thấp. Ừ, giờ chỉ có cái lương là thay đổi.'],
              ['son', 'Cho anh thời gian. Nhưng anh nhớ em. Em là người duy nhất không mắng anh.'],
            ] },
            { t: '"Anh làm bên em mất mặt với khách."', fx: { dr: 3, rel: { son: -2, tuan: 2 } }, then: [
              ['son', 'Anh biết. Anh xin lỗi Tuấn giúp anh.'],
              ['nar', 'Anh Sơn cúp máy. Một phút sau, anh ấy chặn số anh Tuấn. Số của bạn thì không.'],
            ] },
            { t: 'Chúc anh may mắn, xin giữ liên lạc.', fx: { uy: 1, rel: { son: 2 }, set: { son_respect: true } }, then: [
              ['son', 'Em tử tế quá. Có job nào hợp anh, em cứ gọi. Anh sẽ nghe máy. Lần này thật.'],
            ] },
          ] },
          { fx: { set: { son_counter: true } } },
          ['tuan', '(vọng từ pantry) Hủy lẩu! …Thôi không hủy. Lẩu an ủi.'],
          { if: (s) => !!s.flags.backup_ready, then: [
            ['nar', 'Cuối ngày, chị Kim Anh hẹn phỏng vấn hai ứng viên dự phòng. Bó hoa được tặng cho chị lễ tân bên đó.'],
            { fx: { rel: { kimanh: 1 } } },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 2. Ứng viên đầu tiên mình theo đã ghost ngày đi làm. Sếp cũ tăng lương ba mươi phần trăm. `
      + (s.flags.son_honest ? 'Mình nói thật với khách. Khách cảm ơn, anh Tuấn thì không. ' : s.flags.son_lied ? 'Mình nói anh ấy kẹt xe. Kẹt xe hai tiếng. ' : '')
      + 'Lẩu an ủi ngon hơn lẩu mừng.',
  },

  // ===== Day 4 =====
  {
    id: 'jd_unicorn', day: 4, title: 'JD kỳ lân',
    intro: 'Thứ Năm. Sau vụ anh Sơn, Đất Vàng Land không bỏ đi. Họ gửi một job mới.\n\nBách gọi đó là "cơ hội gỡ gạc". Bạn đọc JD và gọi đó là "kỳ lân".',
    steps: [
      {
        who: 'bach', obj: 'Bách có "tin vui" ở bàn BD', time: '09:00',
        scene: [
          ['bach', 'Tin vui! Đất Vàng không giận vụ anh Sơn. Họ gửi job mới: Trợ lý Giám đốc. Anh nhận luôn, phí hai tháng lương!'],
          ['bach', 'JD đây. Khách viết kỹ lắm.'],
          ['nar', '"Nữ, dưới 25 tuổi, ngoại hình sáng, chưa có ý định sinh con, 10 năm kinh nghiệm, thạo Anh–Trung–Hàn. Lương 8 triệu (thỏa thuận)."'],
          ['think', 'Dưới 25 tuổi và 10 năm kinh nghiệm. Tức là làm Trợ lý Giám đốc từ năm 15 tuổi.'],
          { c: 'hr_d4_bach', o: [
            { t: '"Anh đã hứa gì với khách rồi ạ?"', fx: { uy: 1, rel: { bach: -1 }, set: { bach_promised: true } }, then: [
              ['bach', 'Anh hứa… shortlist trong bốn mươi tám tiếng. Và "đúng ý". Chắc kèo mà!'],
              ['think', '"Đúng ý" ở đây là một rủi ro pháp lý.'],
            ] },
            { t: '"Dạ, em làm luôn ạ."', fx: { rel: { bach: 2 } }, then: [
              ['bach', 'Đấy! Intern có tinh thần! Em viết tin đăng, chị Ngân duyệt.'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Viết tin tuyển dụng, chị Ngân duyệt', time: '10:00',
        scene: [
          ['ngan', 'Chị đọc JD rồi. Em viết tin đăng giúp chị. Chị muốn xem em xử lý thế nào.'],
          ['ngan', 'Gợi ý: luật lao động cấm phân biệt đối xử vì giới tính, tình trạng hôn nhân, mang thai… (thông tin giải trí, không phải tư vấn pháp lý)'],
          ['ngan', 'Còn "ngoại hình sáng" thì không phải kỹ năng. Trừ khi việc của người ta là làm đèn.'],
          { mini: JD_MINI,
            good: [['ngan', 'Ba tiêu chí, đều đo được, đều liên quan đến việc. Đây mới là JD.'], { fx: { uy: 3, rel: { ngan: 1 }, set: { jd_draft_ok: true } } }],
            bad: [['ngan', 'Em vừa đưa một tiêu chí không đo được vào tin đăng. Xóa. Vy sẽ bị report bài trong mười phút.'], { fx: { dr: 2 } }],
          },
        ],
      },
      {
        who: 'call:kimanh', obj: 'Gọi chốt JD với Đất Vàng (nghe máy)', time: '11:30',
        call: { title: 'Đất Vàng Land · Chốt JD Trợ lý Giám đốc', people: ['kimanh', 'bach', 'ngan', 'me'] },
        scene: [
          ['kimanh', 'Chị xem bản nháp rồi. Sao mất hết tiêu chí của sếp chị? Sếp chị thích người trẻ, ngoại hình sáng, chưa vướng con nhỏ.'],
          ['bach', '(nhắn riêng) gật đi em, khách là thượng đế'],
          ['ngan', '(nhắn riêng) em nói đi. chị đỡ.'],
          { c: 'hr_d4_jd', o: [
            { t: 'Đề xuất tuyển theo năng lực, nói rõ rủi ro pháp lý và đề nghị phỏng vấn có cấu trúc.', fx: { uy: 5, rel: { ngan: 3, kimanh: -1, bach: -1 }, set: { jd_pushback: true } }, then: [
              ['me', 'Dạ, bên em đề xuất tuyển theo việc: quản lý lịch, ngoại ngữ có test, xử lý hồ sơ. Tiêu chí tuổi, giới tính, con cái dễ thành rủi ro cho chính bên chị ạ.'],
              ['kimanh', '…Thế thì bên chị tìm chỗ khác.'],
              ['ngan', 'Chị Kim Anh, bên em gửi người giỏi nhất cho việc đó. Sếp chị không ưng thì bên em không lấy phí. Thử một lần.'],
              ['kimanh', '…Một lần. Bỏ tuổi với con cái. Nhưng chị muốn "tác phong chuyên nghiệp".'],
              ['ngan', '"Tác phong chuyên nghiệp" thì được. Đó là hành vi, không phải khuôn mặt.'],
            ] },
            { t: '"Dạ, bên em vẫn lọc theo ý sếp chị, chỉ không ghi ra văn bản."', fx: { dr: 5, rel: { bach: 2, kimanh: 1, ngan: -3 }, set: { jd_hidden_filter: true, jd_pushback: false } }, then: [
              ['kimanh', 'Thế mới là đối tác! Không ghi gì cả nhé.'],
              ['ngan', '(nhắn riêng) không ghi ra văn bản thì vẫn là việc em làm. nhớ nhé.'],
              ['think', 'Mình vừa phát minh ra một cái phễu lọc không tồn tại. Mà vẫn có người bị lọc.'],
            ] },
            { t: 'Đề nghị nâng lương lên mức thị trường, giữ các tiêu chí khác.', fx: { uy: 1, dr: 2, rel: { kimanh: 1, my: 1 }, set: { jd_pushback: false, jd_salary: true } }, then: [
              ['kimanh', 'Mười hai triệu thì được. Các tiêu chí khác giữ nguyên nhé.'],
              ['ngan', '(nhắn riêng) em sửa được con số. còn cái sai thì vẫn nguyên đó.'],
            ] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Đưa tin tuyển dụng cho Vy đăng', time: '14:30',
        scene: [
          ['vy', 'Tin đăng Trợ lý Giám đốc đây hả? Để mình đăng sáu nền tảng.'],
          { if: (s) => !!s.flags.jd_hidden_filter, then: [
            ['vy', '"Lọc ngầm" là sao? Mình phải mở ảnh đại diện từng người ra chấm điểm à?'],
            ['vy', 'Mình không làm đâu. Lần trước bị report bài, mình lên group "Bóc phốt HR" ba ngày.'],
            { fx: { dr: 2, rel: { vy: -1 } } },
          ], else: [
            { if: (s) => !!s.flags.jd_pushback, then: [
              ['vy', 'Ơn giời, tin đăng sạch. Lần trước có khách ghi "ưu tiên cung Kim Ngưu", mình bị cả mạng hỏi thăm.'],
              { fx: { rel: { vy: 1 } } },
            ], else: [
              ['vy', 'Lương mười hai triệu thì có người nộp. Nhưng tiêu chí kiểu này… đăng xong chắc mình lại bị hỏi thăm.'],
            ] },
          ] },
          { c: 'hr_d4_post', o: [
            { t: 'Ngồi đăng cùng Vy trên sáu nền tảng.', fx: { nl: -6, rel: { vy: 2 } }, then: [
              ['nar', 'Sáu nền tảng, sáu mẫu đăng khác nhau. Một nền tảng bắt xác minh bằng ảnh chân dung. Vy chụp con mèo.'],
            ] },
            { t: 'Để Vy đăng, mình quay lại sàng CV.', fx: { uy: 1 }, then: [
              ['vy', 'Ok. Đi đi. Đừng mở thêm tab nào gần mình.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy gọi vào phòng', time: '16:30',
        scene: [
          { if: (s) => !!s.flags.jd_pushback, then: [
            ['duy', 'Ngân kể rồi! Team mình vừa từ chối phân biệt đối xử. Anh viết bài luôn: "Ở Người Đúng Chỗ, chúng tôi tuyển bằng năng lực."'],
            ['think', 'Sáng nay anh ấy còn chưa đọc JD.'],
          ], else: [
            ['duy', 'Linh hoạt với khách là tốt! Mình là đối tác mà. Nhưng… đừng để ai chụp màn hình nhé.'],
            ['think', 'Câu cuối là câu duy nhất anh ấy nói nhỏ.'],
          ] },
          { c: 'hr_d4_credit', o: [
            { t: 'Xin anh tag cả chị Ngân vào bài.', when: (s) => !!s.flags.jd_pushback, fx: { uy: 2, rel: { ngan: 2, duy: 1 } }, then: [
              ['duy', 'Ngân hả? Ok! Tag cả team. Team là gia đình.'],
              ['nar', 'Bài đăng tag mười người. Một trong số đó là Mèo Ghost. Nó có tài khoản riêng.'],
            ] },
            { t: 'Gật đầu, về bàn.', fx: { rel: { duy: 1 } }, then: [
              ['nar', 'Bài LinkedIn lúc 17:02 có 900 like. Không ai trong bài là người đã gọi điện cho khách.'],
            ] },
            { t: '"Công ty mình có quy định nội bộ về chuyện này không anh?"', fx: { uy: 2, dr: 1, rel: { duy: -1 } }, then: [
              ['duy', 'Quy định nội bộ… à, mình đang soạn. Cùng với JD, sổ tay nhân viên và… mấy thứ khác.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.jd_pushback
      ? 'Ngày 4. Khách muốn "nữ, dưới 25, 10 năm kinh nghiệm". Mình đề xuất tuyển theo năng lực. Chị Ngân đỡ. Khách đồng ý một nửa. Một nửa là nhiều.'
      : 'Ngày 4. Khách muốn "nữ, dưới 25, 10 năm kinh nghiệm". Mình không cãi. Tối nay mình nghĩ về câu của chị Ngân: "Không ghi ra văn bản thì vẫn là việc em làm."'),
  },

  // ===== Day 8 =====
  {
    id: 'kpi_40cv', day: 8, title: 'KPI: 40 CV/ngày',
    intro: 'Thứ Hai, tuần thứ hai. Cuối tuần anh Duy đọc xong một cuốn sách tên "Tăng trưởng gấp mười".\n\nBạn có linh cảm con số trên bảng trắng sắp đổi.',
    steps: [
      {
        who: 'duy', obj: '8:30 Họp KPI đầu tuần', time: '08:30', pos: STANDUP_POS,
        scene: [
          ['duy', 'Gia đình ơi! Từ tuần này, KPI mới: bốn mươi CV mỗi người mỗi ngày. Vì mình là công ty tăng trưởng.'],
          ['duy', 'Job trọng điểm: Kỹ sư thiết kế vi mạch, tiếng Nhật N2, cho Chip Chíp Semicon.'],
          ['vy', 'Anh ơi, cả nước chắc có bốn mươi người như vậy. Gửi một ngày là hết thị trường.'],
          ['duy', 'Đó là tư duy giới hạn, Vy ạ.'],
          { c: 'hr_d8_kpi', o: [
            { t: '"Mình đo số ứng viên vào vòng hai thay vì số CV được không anh?"', fx: { uy: 3, rel: { ngan: 2, vy: 1 }, set: { kpi_proposal: true } }, then: [
              ['duy', 'Ý hay! Rất hay! Vậy mình đo cả hai: bốn mươi CV và số người vào vòng hai.'],
              ['vy', '(nhỏ) Chúc mừng. Bạn vừa tặng cả phòng thêm một KPI.'],
            ] },
            { t: 'Gật đầu. Ghi "40" vào sổ.', fx: { nl: -3, rel: { duy: 1 } }, then: [
              ['nar', 'Cạnh số 40, bạn vẽ một khuôn mặt đang khóc. Rất nhỏ.'],
            ] },
            { t: 'Hỏi anh Tuấn KPI của anh là bao nhiêu.', fx: { dr: 2, rel: { tuan: 1 } }, then: [
              ['tuan', 'Anh không có KPI CV. Anh có KPI tiền. Tháng này anh nợ KPI một cái xe.'],
              ['duy', 'Tuấn là trường hợp đặc biệt.'],
            ] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Vy chỉ cách sourcing (và 412 tab)', time: '10:00',
        scene: [
          ['vy', 'Lại đây, mình chỉ cho. Đây là 412 tab. Mỗi tab một con người. Đừng chạm.'],
          ['nar', 'LinkedIn hiện thông báo: "Bạn đã gửi quá nhiều lời mời kết nối trong tuần này."'],
          ['vy', 'Khóa lần ba rồi. Giờ mình dùng tài khoản thứ hai, ảnh đại diện là Mèo Ghost.'],
          ['vy', 'Còn đây là ATS. Google Sheets, 14.000 dòng. Năm 2022 có người sort một cột. Cả công ty khóc một tuần.'],
          { c: 'hr_d8_vy', o: [
            { t: 'Hỏi Vy cách lọc người phù hợp, không chỉ người nhiều từ khóa.', fx: { uy: 2, rel: { vy: 2 }, set: { vy_trick: true } }, then: [
              ['vy', 'Đọc kinh nghiệm gần nhất trước. Rồi xem họ ở mỗi công ty bao lâu. Từ khóa thì ai cũng nhét được.'],
            ] },
            { t: 'Khen Vy chịu áp lực giỏi ghê.', fx: { rel: { vy: 1 } }, then: [
              ['vy', 'Không chịu được đâu. Mình chỉ chưa có thời gian để sụp đổ. Tối nay có lịch.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn: lọc CV vi mạch', time: '13:30',
        scene: [
          ['nar', 'Bạn lọc ATS theo "vi mạch" + "tiếng Nhật". Ra tám hồ sơ. Một hồ sơ là tiệm bánh "Vi Mạch Bakery".'],
          { mini: CHIP_MINI,
            good: [['think', 'Ba hồ sơ thật sự phù hợp. Ba. Không phải bốn mươi.'], { fx: { uy: 2, set: { chip_ok: true } } }],
            bad: [['think', 'Mình vừa chọn kỹ sư điện lạnh. "Cũng là mạch." Không. Không phải.'], { fx: { dr: 1 } }],
          },
          { c: 'hr_d8_send', o: [
            { t: 'Gửi ba CV chuẩn, kèm ghi chú vì sao từng người phù hợp.', fx: { uy: 4, rel: { ngan: 2, duy: -1 }, set: { kpi_quality: true } }, then: [
              ['nar', 'Ba CV, ba đoạn ghi chú. Trên bảng KPI, cạnh tên bạn: "3 / 40".'],
            ] },
            { t: 'Gửi đủ bốn mươi CV "gần đúng" cho đạt KPI.', fx: { uy: 1, dr: 3, rel: { duy: 2, ngan: -2 }, set: { kpi_spam: true } }, then: [
              ['nar', 'Bốn mươi CV bay đi lúc 15:58. Trong đó có một kỹ sư điện lạnh, một thông dịch viên và một tiệm bánh.'],
            ] },
            { t: 'Gửi ba CV chuẩn, rồi xin Quân chia bớt KPI.', fx: { uy: 2, rel: { quan: -1 }, set: { kpi_quality: true } }, then: [
              ['quan', 'Chia KPI? Không. Mỗi người tự sống sót. Đó là… văn hóa.'],
              ['think', 'Văn hóa mới nhất của công ty: ai lo phận nấy.'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân có phản hồi từ khách', time: '16:00',
        scene: [
          { if: (s) => !!s.flags.kpi_spam, then: [
            ['ngan', 'Chip Chíp vừa gọi. Họ hỏi vì sao có một tiệm bánh trong shortlist kỹ sư.'],
            ['ngan', 'Họ dặn: "Lần sau gửi ít thôi, nhưng đúng." Đúng câu chị nói em sáng nay. Giờ khách nói.'],
          ], else: [
            ['ngan', 'Chip Chíp mời hai trong ba ứng viên của em phỏng vấn. Tỉ lệ sáu mươi sáu phần trăm. Tháng trước cả phòng được hai phần trăm.'],
            ['ngan', 'Đừng kể con số đó với Vy. Vy biết rồi.'],
          ] },
          { c: 'hr_d8_ngan', o: [
            { t: '"Nếu anh Duy hỏi sao em chỉ có ba CV thì sao ạ?"', fx: { rel: { ngan: 2 } }, then: [
              ['ngan', 'Thì em cho anh ấy xem email mời phỏng vấn. Anh Duy thích ảnh chụp màn hình hơn con số.'],
            ] },
            { t: 'Xin chị góp ý cách viết ghi chú ứng viên.', fx: { uy: 2, nl: -3, rel: { ngan: 1 } }, then: [
              ['ngan', 'Bỏ tính từ. Thêm con số. "Nhiệt huyết" không phải bằng chứng. "Ba năm, hai dự án tape-out" mới là bằng chứng.'],
            ] },
          ] },
        ],
      },
      {
        who: 'quan', obj: 'Quân khoe số CV hôm nay', time: '17:30',
        scene: [
          ['quan', 'Hôm nay mình 52 CV! Bạn được mấy?'],
          ['nar', 'Trên màn hình Quân, phần tóm tắt ứng viên thứ 37 bắt đầu bằng: "Dưới đây là bản tóm tắt chuyên nghiệp cho ứng viên của bạn:".'],
          { c: 'hr_d8_quan', o: [
            { t: 'Chỉ nhỏ cho Quân dòng AI quên xóa.', fx: { rel: { quan: 2 }, set: { quan_helped: true } }, then: [
              ['quan', '…Ơ. Cả ba mươi bảy cái đều có dòng đó à? …Cảm ơn. Đừng nói ai nhé.'],
              ['quan', 'Nhà mình kể với cả họ là mình sắp lên chính thức rồi. Mình không được sai.'],
            ] },
            { t: 'Kể với chị Ngân.', fx: { uy: 1, dr: 2, rel: { quan: -2, ngan: 1 } }, then: [
              ['ngan', 'Chị biết rồi. Khách gửi lại ảnh chụp màn hình lúc 16:10. Nhưng cảm ơn em.'],
              ['quan', '(lườm) Ok.'],
            ] },
            { t: 'Không nói gì. Việc ai người nấy lo.', fx: { nl: 2 }, then: [
              ['think', 'Sáng mai sẽ có một khách đọc dòng đó. Mình biết. Mình về.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.kpi_spam
      ? 'Ngày 8. KPI 40 CV/ngày. Mình gửi đủ 40. Một trong số đó là tiệm bánh. Khách nói câu chị Ngân đã nói.'
      : 'Ngày 8. KPI 40 CV/ngày. Mình gửi 3, được mời 2. Trên bảng: "3 / 40". Mình thấy con số đó đẹp hơn bốn mươi.'),
  },

  // ===== Day 10 =====
  {
    id: 'rotation_cb', day: 10, title: 'Luân chuyển C&B: khảo sát lương bảy người',
    intro: 'Thứ Tư. Luân chuyển: tuần này bạn ngồi với chị My, mảng Khảo sát lương & C&B.\n\nChị My biết lương của tất cả mọi người trong phòng. Kể cả của bạn. Đặc biệt là của bạn.',
    steps: [
      {
        who: 'my', obj: 'Qua bàn chị My nhận việc C&B', time: '09:00',
        scene: [
          ['my', 'Chào em. Ngồi đi. Lương em dưới P25 của intern ngành nhân sự. Nói trước để em khỏi tò mò.'],
          ['my', 'Khách: Hiệp hội Logistics Nhanh Như Chớp. Họ mua "Báo cáo lương ngành logistics". Hạn thứ Sáu.'],
          ['my', 'Số phiếu khảo sát thu về: bảy.'],
          ['think', 'Bảy. Một ngành. Bảy người.'],
          ['my', 'Trong đó một phiếu là của cháu ông chủ tịch hiệp hội. Lương chín mươi lăm triệu. Chức danh: "Giám đốc Tầm nhìn".'],
          { c: 'hr_d10_start', o: [
            { t: '"Mình xin thêm dữ liệu được không ạ?"', fx: { uy: 1, rel: { my: 1 } }, then: [
              ['my', 'Được. Bằng cách gọi điện. Từng công ty. Từng người. Rồi em sẽ hiểu vì sao khảo sát lương đắt.'],
            ] },
            { t: '"Lương cháu chủ tịch có tính là ngoại lai không ạ?"', fx: { uy: 2, rel: { my: 2 } }, then: [
              ['my', 'Về thống kê thì có. Về chính trị thì… em sẽ học.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn tính P25 · P50 · P75', time: '10:30',
        scene: [
          ['nar', 'File "BaoCaoLuong_Logistics_FULL.xlsx". Sheet 1: bảy dòng. Sheet 2: biểu đồ vẽ sẵn, rất đẹp, cho một bộ dữ liệu không tồn tại.'],
          { mini: PCT_MINI,
            good: [['my', '(qua vai bạn) Đúng. Trung vị mười tám, không phải hai mươi tám. Em vừa cứu một hiệp hội khỏi ảo tưởng.'], { fx: { uy: 3, rel: { my: 1 }, set: { pct_ok: true } } }],
            bad: [['my', 'Hai mươi tám là trung bình, em ạ. Trung bình là con số biết nói dối. Chị sửa nhé.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'my', obj: 'Chị My: "Giờ phần khó"', time: '13:30',
        scene: [
          ['my', 'Khách muốn báo cáo "đầy đặn": P25, P50, P75 cho mười hai chức danh. Mình có bảy người.'],
          ['my', 'Chị thấy có ba cách. Chị muốn nghe em chọn.'],
          { c: 'hr_d10_survey', o: [
            { t: 'Ghi rõ: mẫu nhỏ, chỉ để tham khảo, không chia mười hai chức danh.', fx: { uy: 3, rel: { my: 2 }, set: { survey_honest: true } }, then: [
              ['my', 'Khách sẽ chê "đắt mà ít". Nhưng không ai kiện mình vì nói thật về cỡ mẫu.'],
            ] },
            { t: '"Ngoại suy" thêm số cho đủ mười hai chức danh.', fx: { uy: 1, dr: 4, rel: { my: -2, duy: 1 }, set: { survey_faked: true } }, then: [
              ['my', '…Được. Em ghi tên em vào sheet "Phương pháp" nhé. Chị không ghi tên chị.'],
              ['think', 'Sheet "Phương pháp" giờ có đúng một dòng: "Ngoại suy (bởi {ten})".'],
            ] },
            { t: 'Gọi thêm hai mươi doanh nghiệp xin dữ liệu. Chậm hơn, nhưng thật.', fx: { uy: 4, nl: -15, rel: { my: 3 }, set: { survey_honest: true, survey_more: true } }, then: [
              ['nar', 'Hai mươi cuộc gọi. Tám người cúp máy. Bốn người hỏi "em bán bảo hiểm à". Sáu người gửi số liệu.'],
              ['my', 'Mười ba phiếu. Vẫn ít. Nhưng gấp đôi. Chị ghi tên em ở dòng cảm ơn.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy cần "một con số headline"', time: '15:30',
        scene: [
          ['duy', 'Báo cáo logistics xong chưa? Anh cần một con số cho LinkedIn. Kiểu: "Lương logistics tăng bốn mươi phần trăm!"'],
          { if: (s) => !!s.flags.survey_faked, then: [['duy', 'Nghe nói em ngoại suy giỏi lắm! Tăng bao nhiêu cũng được, miễn là đẹp.']] },
          { c: 'hr_d10_headline', o: [
            { t: '"Mẫu nhỏ quá anh ạ. Mình đăng về phương pháp khảo sát thì hay hơn."', fx: { uy: 2, rel: { duy: -1, my: 1 } }, then: [
              ['duy', 'Phương pháp… không viral. Nhưng ok, anh đăng: "Minh bạch là giá trị cốt lõi". Kèm ảnh anh.'],
            ] },
            { t: 'Đưa con số trung vị thật, kèm chú thích cỡ mẫu.', fx: { uy: 2, rel: { duy: 1 } }, then: [
              ['duy', '"Trung vị lương chuyên viên logistics: mười tám triệu, mẫu nhỏ." Hơi khô. Anh thêm emoji tên lửa.'],
            ] },
            { t: 'Đưa đúng con số anh Duy muốn.', fx: { dr: 3, rel: { duy: 2, my: -1 }, set: { headline_fake: true } }, then: [
              ['nar', '17:00. Bài đăng: "LƯƠNG LOGISTICS TĂNG 40% 🚀". 3.400 lượt chia sẻ. Hiệp hội gọi điện hỏi số này ở đâu ra.'],
            ] },
          ] },
        ],
      },
      {
        who: 'my', obj: 'Chị My nhờ lưu file báo cáo', time: '17:00',
        scene: [
          ['my', 'Em biết vì sao chị thích làm C&B không? Vì con số không ghost mình.'],
          ['my', 'Nhưng biết lương cả phòng mà không được kể… như biết bí mật của cả nhà. Phát dưới P25. Vy dưới P50. Chị thì… đừng hỏi.'],
          ['my', 'File này có tên công ty khách và lương từng người. Em lưu lên ổ chung giúp chị. Cẩn thận nhé.'],
          { c: 'hr_d10_file', o: [
            { t: 'Đặt mật khẩu cho file, gửi mật khẩu riêng cho chị My.', fx: { uy: 2, rel: { my: 2 }, set: { file_locked: true } }, then: [
              ['my', 'Chị nhắc cả công ty điều này ba năm. Em là người đầu tiên làm.'],
            ] },
            { t: 'Lưu thẳng vào thư mục "Chung_Ai_Cung_Xem".', fx: { nl: 2 }, then: [
              ['my', '…Thư mục tên vậy thật à. Ừ, thôi, chắc không sao.'],
              ['think', 'Nghe như câu cuối cùng trước một vụ lộ dữ liệu.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 10. Báo cáo lương một ngành, bảy người, một "Giám đốc Tầm nhìn". `
      + (s.flags.survey_faked ? 'Mình ngoại suy. Sheet "Phương pháp" có tên mình. ' : 'Mình ghi rõ cỡ mẫu. Chị My bảo con số không ghost mình. ')
      + (s.flags.file_locked ? 'File có mật khẩu.' : 'File nằm trong thư mục "Chung_Ai_Cung_Xem". Mình hơi lo.'),
  },

  // ===== Day 11 =====
  {
    id: 'salary_leak', day: 11, title: 'Gửi nhầm file',
    intro: 'Thứ Năm, 8:15. Quân đứng cạnh bàn bạn, mặt trắng như tờ A4 chưa in.\n\n"Bạn ơi… thu hồi email trên Outlook là làm sao?"',
    steps: [
      {
        who: 'quan', obj: 'Quân cần nói chuyện gấp', time: '08:30',
        scene: [
          ['quan', 'Mình gửi nhầm file "BaoCaoLuong_Logistics_FULL.xlsx". Cho anh Nam, ứng viên Kế toán trưởng. Gõ "Nam" nó tự điền… nhầm Nam.'],
          { if: (s) => !!s.flags.file_locked, then: [
            ['quan', 'File có mật khẩu. Nhưng… mình gửi kèm mật khẩu ở dòng dưới. Cho tiện.'],
            ['think', 'Ổ khóa tốt nhất thế giới, chìa dán ngay trên cửa.'],
          ] },
          { if: (s) => !!s.flags.tie_quan_duy, then: [['quan', 'Đừng nói chú Duy. Chú mà biết thì bố mình biết, rồi cả họ biết.']] },
          ['quan', 'Đừng nói chị Ngân nhé. Mình mới vào. Mình sẽ bị đuổi. Mình sẽ bị… viết lên LinkedIn.'],
          { c: 'hr_d11_leak', o: [
            { t: 'Đi cùng Quân báo chị Ngân ngay bây giờ.', fx: { uy: 3, rel: { quan: -1, ngan: 2 }, set: { leak_reported: true } }, then: [
              ['quan', '…Ok. Ok. Đi. Bạn đi trước.'],
              ['think', 'Báo sớm một phút là cứu được một phút.'],
            ] },
            { t: 'Gọi anh Nam xin xóa trước, rồi báo chị Ngân.', fx: { uy: 2, nl: -4, rel: { quan: 1 }, set: { leak_reported: true, leak_called_first: true } }, then: [
              ['quan', 'Gọi trước rồi báo sau. Vẫn phải báo hả? …Ừ. Phải báo.'],
            ] },
            { t: 'Bấm "thu hồi email" và giữ im lặng giúp Quân.', fx: { dr: 3, rel: { quan: 3 }, set: { leak_covered: true } }, then: [
              ['nar', 'Outlook báo: "Thu hồi không thành công. Người nhận đã mở thư lúc 08:13."'],
              ['quan', 'Thôi, coi như chưa có gì nhé. Cảm ơn bạn. Bạn là người nhà.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:nam', obj: 'Gọi anh Nam về cái file (Teams)', time: '09:30',
        call: { title: 'Gọi anh Nam (ứng viên) · về một file Excel', people: ['nam', 'quan', 'me'] },
        scene: [
          ['nam', 'Alo em! Cảm ơn em gửi file nhé. Hay lắm. Giờ anh biết P75 kế toán trưởng. Anh sẽ deal năm mươi triệu.'],
          ['nam', 'Có cả tên công ty từng người nữa. Phú Quý trả kế toán trưởng cũ ba mươi lăm à? Thú vị.'],
          { c: 'hr_d11_nam', o: [
            { t: 'Giải thích là gửi nhầm, đề nghị anh xóa và xác nhận qua email.', fx: { uy: 3, rel: { nam: 1 }, set: { nam_deleted: true } }, then: [
              ['nam', 'Ừ, anh xóa. Anh xác nhận. Nhưng anh đọc rồi thì… đầu anh không có nút xóa.'],
              ['think', 'Hợp lý. Đáng sợ, nhưng hợp lý.'],
            ] },
            { t: 'Đề nghị anh ký cam kết bảo mật.', fx: { dr: 2, set: { nam_leverage: true } }, then: [
              ['nam', 'Ký cũng được. Nhưng nghe có vẻ file này quan trọng lắm nhỉ. Vậy anh deal năm lăm.'],
              ['think', 'Mình vừa xác nhận với ứng viên rằng thứ anh ấy có rất đáng tiền.'],
            ] },
            { t: 'Dọa: dùng file này là vi phạm, bên em sẽ loại hồ sơ.', fx: { dr: 4, rel: { nam: -2 }, set: { nam_leverage: true } }, then: [
              ['nam', 'Em dọa ứng viên vì lỗi của bên em à? Hay. Anh chụp màn hình cuộc gọi này rồi.'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân gọi cả phòng', time: '11:00',
        scene: [
          { if: (s) => !!s.flags.leak_reported, then: [
            ['ngan', 'Hai đứa báo sớm. Tốt. Chị gọi Hiệp hội xin lỗi rồi, đề nghị giảm phí mười phần trăm. Đắt, nhưng rẻ hơn mất khách.'],
            ['ngan', 'Quân: file có dữ liệu cá nhân thì đặt mật khẩu, gửi mật khẩu qua kênh khác. Không phải dòng dưới.'],
            { fx: { rel: { ngan: 1 } } },
            { c: 'hr_d11_after', o: [
              { t: 'Đề xuất quy định: file lương chỉ gửi qua link có hạn, không đính kèm.', fx: { uy: 2, rel: { ngan: 1, my: 1 } }, then: [
                ['ngan', 'Ghi vào. Công ty mình tư vấn bảo mật dữ liệu cho khách. Giờ mình có một quy định cho chính mình.'],
              ] },
              { t: 'Đứng cạnh Quân, im lặng.', fx: { rel: { quan: 1 } }, then: [
                ['nar', 'Quân không nói gì. Nhưng Quân không đứng một mình.'],
              ] },
            ] },
          ], else: [
            ['ngan', 'Server báo một email ra ngoài lúc 08:12, kèm file 4MB tên "Luong". Có ai biết gì không?'],
            ['quan', '(nhìn bạn, lắc đầu thật khẽ)'],
            { c: 'hr_d11_confess', o: [
              { t: 'Kể thật với chị Ngân.', fx: { uy: 2, dr: 1, rel: { ngan: 1, quan: -3 }, set: { leak_reported: true, leak_covered: false, leak_late: true } }, then: [
                ['ngan', 'Ba tiếng. Ba tiếng là đủ để file đi qua năm cái Zalo. Lần sau báo ngay, dù lỗi của ai.'],
                ['think', 'Quân không nói gì. Đó là câu nặng nhất.'],
              ] },
              { t: '"Em không biết ạ."', fx: { uy: -3, dr: 3, rel: { quan: 1 } }, then: [
                ['ngan', 'Ừ. Chị sẽ tìm ra. Chị luôn tìm ra.'],
                ['think', 'Câu đó không phải đe dọa. Là thống kê.'],
              ] },
            ] },
          ] },
        ],
      },
      {
        who: 'my', obj: 'Chị My hỏi chuyện Hiệp hội', time: '14:00',
        scene: [
          { if: (s) => !!s.flags.leak_reported, then: [
            ['my', 'Hiệp hội không giận lắm. Họ chỉ hỏi "file có cả lương cháu chủ tịch không". Có. Họ giận phần đó.'],
            ['my', 'Cảm ơn em đã báo. Lần đầu tiên có người báo trước khi chị phải đi tìm.'],
            { fx: { rel: { my: 2 } } },
          ], else: [
            ['my', 'Có người bên logistics nhắn chị: "nghe nói bên em có bảng lương cả ngành hả?" Tin đồn đi nhanh hơn email.'],
            ['my', 'Nếu em biết gì, nói sớm. Chị không giận người sai. Chị giận người giấu.'],
            { fx: { dr: 2 } },
          ] },
          { c: 'hr_d11_my', o: [
            { t: 'Hỏi chị My cách xử lý khi dữ liệu đã lọt ra ngoài.', fx: { uy: 1, rel: { my: 1 } }, then: [
              ['my', 'Báo khách, ghi lại ai nhận, xin xóa có xác nhận, rồi sửa quy trình. Xấu hổ thì để sau.'],
            ] },
            { t: 'Hứa sẽ cẩn thận với dữ liệu lương từ giờ.', fx: { rel: { my: 1 } }, then: [
              ['my', 'Ừ. Lương là con số. Nhưng mỗi con số là tiền nhà của một người.'],
            ] },
          ] },
        ],
      },
      {
        who: 'quan', obj: 'Quân rủ ra hành lang', time: '16:30',
        scene: [
          ['quan', 'Bạn có rảnh không. Ra hành lang tí.'],
          ['quan', 'Mình tưởng làm nhân sự thì không ai bị đuổi vì sai. Vì mình là người tuyển người khác mà.'],
          { if: (s) => !!s.flags.leak_covered && !s.flags.leak_reported, then: [
            ['quan', 'Cảm ơn đã giữ bí mật. Mình nợ bạn. Mà… hình như ai cũng nhìn mình.'],
            { fx: { dr: 1 } },
          ], else: [
            ['quan', 'Chị Ngân không đuổi mình. Chị bắt mình viết quy trình gửi file. Ba trang. Mình tự viết, không dùng AI.'],
          ] },
          { c: 'hr_d11_quan', o: [
            { t: 'Rủ Quân đi trà sữa, mình trả.', fx: { money: -35_000, nl: 5, rel: { quan: 2 } }, then: [
              ['quan', 'Lần sau mình trả. Khi lên chính thức. …Nếu.'],
            ] },
            { t: '"Sai thì sửa. Đừng để AI viết hộ lời xin lỗi là được."', fx: { uy: 1, rel: { quan: 1 } }, then: [
              ['quan', 'Lời xin lỗi gửi Hiệp hội là mình tự viết. Hơi sai chính tả. Nhưng thật.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.leak_covered && !s.flags.leak_reported
      ? 'Ngày 11. Quân gửi nhầm file lương cho ứng viên. Mình giữ bí mật. Tin đồn thì không giữ được.'
      : 'Ngày 11. Quân gửi nhầm file lương cho ứng viên. Bọn mình báo chị Ngân. Công ty có thêm một quy định. Mình có thêm một người bạn, hoặc một người hơi giận mình.'),
  },

  // ===== Day 15 =====
  {
    id: 'counter_offer', day: 15, title: 'Cuộc chiến counter-offer',
    intro: 'Thứ Hai, tuần thứ ba. Chị Yến, Trưởng phòng Marketing, đã ký offer với Mỹ Phẩm Mộc Lan.\n\nSáng nay chị nộp đơn nghỉ ở công ty cũ. Mười phút sau, sếp cũ gọi chị vào phòng.',
    steps: [
      {
        who: 'ngan', obj: 'Chị Ngân tóm tắt ca chị Yến', time: '08:30',
        scene: [
          ['ngan', 'Ca của chị, nhưng em theo từ đầu. Chị Yến nộp đơn lúc 8:00. Sếp cũ gọi vào phòng lúc 8:10. Đoán xem.'],
          ['me', 'Counter-offer ạ?'],
          ['ngan', 'Ba mươi phần trăm, thêm chữ "Giám đốc", bỏ chữ "Trưởng phòng". Nghe như thăng chức. Thật ra là đổi biển tên.'],
          { if: (s) => !!s.flags.son_counter, then: [['think', 'Lại giống anh Sơn. Counter-offer có mùa vụ à?']] },
          { c: 'hr_d15_prep', o: [
            { t: 'Hỏi chị Ngân điều gì làm chị Yến muốn đi từ đầu.', fx: { uy: 2, rel: { ngan: 1 }, set: { yen_notes: true } }, then: [
              ['ngan', 'Ghi chú vòng một: "sếp nhận công của team", "ba năm không ngân sách". Em đọc trước khi gọi. Đừng đọc to.'],
            ] },
            { t: 'Chuẩn bị bảng so sánh hai offer.', fx: { nl: -3, rel: { my: 1 } }, then: [
              ['my', '(từ bàn bên) Đưa đây chị xem. Ba mươi phần trăm của cái lương thấp vẫn là cái lương thấp hơn bên Mộc Lan.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:yen', obj: 'Gọi chị Yến lúc 9:30 (Teams)', time: '09:30',
        call: { title: 'Chị Yến · "Em cần thêm thời gian"', people: ['yen', 'ngan', 'me'] },
        scene: [
          ['yen', 'Chào em. Chị biết em gọi vì sao. Sếp chị tăng ba mươi phần trăm. Cho chị làm "Giám đốc Marketing (quyền)".'],
          ['yen', '"Quyền" nghĩa là chưa chính thức. Nhưng nghe vẫn sang. Chị phân vân quá.'],
          { c: 'hr_d15_yen', o: [
            { t: 'Hỏi chị liệt kê ba lý do chị từng muốn đi.', fx: { uy: 4, rel: { yen: 2, ngan: 2 }, set: { yen_reasons: true } }, then: [
              ['yen', 'Một: sếp nhận công của team. Hai: ba năm chưa có ngân sách. Ba: chị không còn thấy mình học được gì.'],
              ['yen', '…Ba mươi phần trăm không sửa được cái nào trong ba cái đó.'],
              ['ngan', '(nhắn riêng) chuẩn. đừng nói thêm. để chị ấy tự nghe mình.'],
            ] },
            { t: '"Chị đã ký offer rồi mà chị."', fx: { dr: 4, rel: { yen: -2 }, set: { yen_pressured: true } }, then: [
              ['yen', 'Chị biết chị ký rồi. Em nhắc chị như nhắc nợ vậy.'],
              ['ngan', '(nhắn riêng) không ai muốn đi làm ở chỗ mà mình bị ép đến.'],
            ] },
            { t: '"Em tôn trọng quyết định của chị, dù là gì."', fx: { uy: 1, rel: { yen: 3 }, set: { yen_released: true } }, then: [
              ['yen', 'Cảm ơn em. Hiếm headhunter nào nói câu đó. Thường họ gửi hoa cho mẹ chị.'],
            ] },
          ] },
        ],
      },
      {
        who: 'tuan', obj: 'Anh Tuấn muốn "chỉ chiêu"', time: '11:00',
        scene: [
          ['tuan', 'Ca chị Yến hả? Chiêu của anh: gửi hoa cho mẹ ứng viên. Kèm thiệp "Con bác sắp làm Trưởng phòng công ty lớn".'],
          ['tuan', 'Mẹ nào cũng muốn con ổn định. Nhưng mẹ nào cũng thích khoe.'],
          { c: 'hr_d15_tuan', o: [
            { t: 'Từ chối: kéo gia đình ứng viên vào là quá tay.', fx: { uy: 2, rel: { tuan: -1, ngan: 1 } }, then: [
              ['tuan', 'Ok, em đạo đức. Mà em đúng. Lần trước mẹ ứng viên gọi ngược lại mắng anh nửa tiếng.'],
            ] },
            { t: 'Đặt hoa thử (tự bỏ tiền).', fx: { money: -150_000, dr: 3, rel: { tuan: 2 }, set: { flowers_sent: true } }, then: [
              ['nar', 'Hoa giao lúc 13:00. 13:20 chị Yến nhắn: "Ai gửi hoa cho mẹ chị vậy? Mẹ chị hỏi chị có bị lừa không."'],
            ] },
          ] },
        ],
      },
      {
        who: 'bach', obj: 'Bách hỏi chuyện tăng offer', time: '14:00',
        scene: [
          ['bach', 'Anh vừa gọi Mộc Lan. Họ có thể tăng offer thêm mười phần trăm. Nhưng họ hơi khó chịu. Mình có đề xuất không?'],
          { c: 'hr_d15_bach', o: [
            { t: 'Không. Vấn đề của chị Yến không phải tiền.', fx: { uy: 2, rel: { bach: -1 }, set: { no_bidding: true } }, then: [
              ['bach', 'Ok, không đấu giá. Anh đỡ phải gọi lại khách. Thật ra anh cũng ngại.'],
            ] },
            { t: 'Có, cứ đề xuất cho chắc.', fx: { dr: 2, rel: { bach: 1 }, set: { bidding: true } }, then: [
              ['bach', 'Mộc Lan đồng ý. Kèm ghi chú: "Nếu bạn này đòi thêm nữa thì thôi." Đấu giá người là thế.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:yen', obj: 'Chị Yến gọi lại: câu trả lời', time: '16:00',
        call: { title: 'Chị Yến · Câu trả lời', people: ['yen', 'ngan', 'me'] },
        scene: [
          { if: (s) => !!s.flags.yen_reasons, then: [
            ['yen', 'Chị đi. Chị nói với sếp: cảm ơn ba mươi phần trăm, nhưng em cần một chỗ mà em còn lớn lên được.'],
            ['yen', 'Em là người làm chị nghe lại chính mình. Cảm ơn em.'],
            { fx: { uy: 4, set: { yen_placed: true } } },
            ['ngan', 'Placement. Phí về sau sáu mươi ngày bảo hành. Nếu chị Yến không nghỉ vào ngày năm mươi chín.'],
          ], else: [
            { if: (s) => !!s.flags.yen_released, then: [
              ['yen', 'Chị ở lại. Chị muốn thử xem chữ "(quyền)" có thành thật không. Chị xin lỗi bên em.'],
              ['yen', 'Nhưng chị nhớ em. Chị có ba người bạn đang muốn đổi việc. Chị gửi số cho em nhé.'],
              { fx: { rel: { yen: 1 }, set: { yen_grateful: true } } },
              ['ngan', 'Mất một placement, được ba lead. Có ngày còn lời hơn.'],
            ], else: [
              ['yen', 'Chị ở lại. Nói thật, cuộc gọi sáng nay làm chị chắc hơn.'],
              ['nar', 'Mười phút sau, chị Yến cập nhật LinkedIn: "Giám đốc Marketing (quyền)". Kèm bài đăng về "lòng trung thành".'],
              { fx: { dr: 2 } },
            ] },
          ] },
          { if: (s) => !!s.flags.flowers_sent, then: [['yen', 'À, và đừng gửi hoa cho mẹ chị nữa nhé. Mẹ chị tưởng chị vào đa cấp.']] },
          { c: '_hr_d15_after', o: [
            { t: 'Ghi lại cả ca vào ATS cho người sau.', fx: { uy: 1, nl: -2 }, then: [
              ['nar', 'Bạn viết mười dòng ghi chú. Mười dòng có ích nhất trong file 14.000 dòng.'],
            ] },
            { t: 'Ra pantry ăn ké lẩu của anh Tuấn.', fx: { nl: 12 }, then: [
              ['tuan', 'Lẩu là lẩu. Mừng hay buồn thì nước dùng vẫn vậy.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.yen_placed
      ? 'Ngày 15. Chị Yến từ chối counter-offer. Mình chỉ hỏi chị ấy ba lý do. Chị ấy tự trả lời phần còn lại.'
      : s.flags.yen_grateful ? 'Ngày 15. Chị Yến ở lại công ty cũ, nhưng gửi mình ba người bạn. Nghề này có lúc thua mà vẫn có quà.'
        : 'Ngày 15. Chị Yến ở lại. Cuộc gọi của mình làm chị ấy chắc hơn. Chắc ở lại.'),
  },

  // ===== Day 17 =====
  {
    id: 'culture_workshop', day: 17, title: 'Workshop "Hạnh phúc nơi làm việc"',
    intro: 'Thứ Tư. Anh Duy vừa đi khóa "Employer Branding" ba ngày ở Đà Lạt về.\n\nLịch công ty: 15:00–19:00, Workshop "Hạnh phúc nơi làm việc". Bắt buộc. Có trà bánh.',
    steps: [
      {
        who: 'duy', obj: 'Anh Duy giới thiệu Culture Deck mới', time: '08:30', pos: STANDUP_POS,
        scene: [
          ['duy', 'Gia đình ơi! Anh vừa về từ Đà Lạt với Culture Deck mới. Bảy giá trị cốt lõi!'],
          ['nar', 'Slide 1: "GIA ĐÌNH · LẮNG NGHE · MINH BẠCH · CÂN BẰNG · TÔN TRỌNG THỜI GIAN · PHÁT TRIỂN · HẠNH PHÚC".'],
          ['duy', 'Chiều nay workshop từ 15 giờ đến 19 giờ. Bắt buộc. Để thực hành giá trị "Cân bằng".'],
          ['vy', '(nhỏ) Bắt buộc ở lại tới 19 giờ để học cân bằng.'],
          { c: 'hr_d17_deck', o: [
            { t: '"Giá trị Tôn trọng thời gian mình áp dụng từ 19 giờ hay từ hôm nay ạ?"', fx: { uy: 2, dr: 3, rel: { duy: -1, vy: 2, phat: 1 } }, then: [
              ['duy', 'Ha ha! Câu hỏi hay! Mình sẽ thảo luận trong workshop. Từ 15 đến 19 giờ.'],
              ['phat', '(thì thầm) huyền thoại'],
            ] },
            { t: 'Vỗ tay.', fx: { rel: { duy: 2 } }, then: [
              ['duy', 'Thấy chưa, năng lượng! Ai cũng như {ten} thì văn hóa tự chạy.'],
            ] },
          ] },
        ],
      },
      {
        who: 'khoa', obj: 'Anh Khoa nhờ chuẩn bị workshop', time: '10:00',
        scene: [
          ['khoa', 'Em ơi, phụ anh! Anh có mười hai trò icebreaker, bốn tiếng đồng hồ, và không có hoạt động nào để mọi người nói thật.'],
          ['khoa', 'Anh Duy dặn: "vui, tích cực, đừng để ai phàn nàn". Anh làm đào tạo tám năm. Anh biết thế nghĩa là gì.'],
          { c: 'hr_d17_khoa', o: [
            { t: 'Đề xuất hoạt động thật: mỗi người viết một vấn đề và một cách sửa.', fx: { uy: 2, rel: { khoa: 3 }, set: { culture_idea: true } }, then: [
              ['khoa', '"Một vấn đề, một giải pháp." Anh dùng. Nếu anh Duy hỏi, anh nói là ý của Đà Lạt.'],
            ] },
            { t: 'Cắt giấy, dán sticky note giúp anh.', fx: { nl: -4, rel: { khoa: 2 } }, then: [
              ['khoa', 'Cảm ơn em. Anh xếp em vào nhóm S. Người giữ nhịp. Người cắt giấy.'],
            ] },
          ] },
        ],
      },
      {
        who: 'khoa', obj: '15:00 Workshop: trò khởi động', time: '15:00',
        pos: { khoa: 'scrum', duy: 'su1', ngan: 'su2', tuan: 'su3', vy: 'su4', phat: 'su5', quan: 'su6', my: 'su7', bach: 'su8', thao: 'su9' },
        scene: [
          ['khoa', 'Trò thứ nhất: Hai sự thật, một lời nói dối! Phiên bản đặc biệt: đoán về đồng nghiệp!'],
          ['duy', 'Anh trước, anh trước!'],
          { mini: ICE_MINI,
            good: [
              ['khoa', 'Đúng cả! Em hiểu nhà mình ghê.'],
              ['duy', '…Câu C là anh định làm. Sắp làm. Tuần sau.'],
              ['thao', '(nhỏ) "Tuần sau" mười tám tháng rồi.'],
              { fx: { uy: 2, rel: { khoa: 1 } } },
            ],
            bad: [
              ['khoa', 'Sai câu của chị Thảo! Năm ngoái chị ấy nghỉ đúng nửa ngày, để đi làm Căn cước.'],
              ['thao', 'Và chiều hôm đó chị vẫn trả lời Zalo.'],
              { fx: { rel: { thao: 1 } } },
            ],
          },
          ['nar', 'Hai tiếng sau, cả phòng đã chơi chín trò icebreaker. Không còn tảng băng nào để phá.'],
          { c: '_hr_d17_ice', o: [
            { t: 'Hỏi anh Duy câu B: anh từng bị cho nghỉ thật ạ?', fx: { rel: { duy: 1 }, set: { duy_story: true } }, then: [
              ['duy', 'Thật. Năm 2019. Một email lúc 17:58 thứ Sáu. Anh mở công ty này để không ai phải nhận email như thế.'],
              ['think', 'Rồi quên ký hợp đồng cho Phát. Con người phức tạp thật.'],
            ] },
            { t: 'Ăn bánh, nghỉ chân.', fx: { nl: 8 }, then: [
              ['nar', 'Bánh workshop là bánh của ứng viên tặng tuần trước. Vẫn ngon.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: '17:00 Workshop: phần "Lắng nghe"', time: '17:00',
        pos: { duy: 'scrum', khoa: 'su1', ngan: 'su2', tuan: 'su3', vy: 'su4', phat: 'su5', quan: 'su6', my: 'su7', bach: 'su8', thao: 'su9' },
        scene: [
          ['duy', 'Giờ đến phần quan trọng nhất: Lắng nghe! Mọi người cứ góp ý thẳng. Anh không giận. Văn hóa mình là văn hóa mở.'],
          ['nar', 'Im lặng. Mèo Ghost ngáp. Phát nhìn xuống giày. Chị Thảo nhìn đồng hồ.'],
          { if: (s) => !!s.flags.culture_idea, then: [['khoa', 'Mình làm "một vấn đề, một giải pháp" nhé. Ai cũng viết. {ten} đọc đầu tiên?']] },
          { c: 'hr_d17_voice', o: [
            { t: 'Nói thẳng, có giải pháp: JD, onboarding, hợp đồng, lịch trả lương. Và xin tự viết bản nháp.', fx: { uy: 4, dr: 3, rel: { duy: -1, ngan: 3, phat: 2, thao: 2 }, set: { culture_honest: true } }, then: [
              ['me', 'Công ty mình viết JD, onboarding, thang lương cho khách. Nội bộ thì chưa có. Em xin viết bản nháp onboarding và JD intern ạ.'],
              ['nar', 'Im lặng ba giây. Trong nghề này, ba giây rất dài.'],
              ['duy', '…Ok! Đây chính là văn hóa lắng nghe! Em viết luôn tối nay nhé. Viết luôn JD cho chính vị trí của em.'],
              ['ngan', 'Chị review cho em. Ngay tối nay.'],
              ['think', 'Mình vừa nhận việc viết JD cho chính mình. Tức là mình đang tự tuyển mình.'],
            ] },
            { t: 'Thả tim lên slide "Lắng nghe", im lặng.', fx: { nl: 2, rel: { duy: 1 } }, then: [
              ['nar', 'Mười người thả tim. Workshop kết luận: "Văn hóa mình rất tốt, chỉ cần thêm năng lượng."'],
            ] },
            { t: 'Góp ý qua Google Form "ẩn danh".', fx: { dr: 4, rel: { duy: -1 }, set: { form_not_anon: true } }, then: [
              ['nar', 'Mười phút sau, anh Duy đọc to: "Cảm ơn {ten} đã góp ý ẩn danh về lịch trả lương nhé!"'],
              ['think', 'Form ẩn danh do chính anh Duy tạo. Có bật "thu thập email".'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Sau workshop: về bàn viết JD cho chính mình', time: '17:50', when: (s) => !!s.flags.culture_honest,
        scene: [
          ['nar', 'Workshop tan lúc 19:00. Bạn mở một file trắng: "JD_ThucTapSinh_NguoiDungCho_v1.docx". Lần đầu tiên công ty này có JD cho chính mình.'],
          { mini: ONBOARD_MINI,
            good: [['ngan', '(nhắn) chị đọc rồi. đúng thứ tự, đủ ý. chị sửa hai chữ. gửi anh Duy đi.'], { fx: { uy: 4, rel: { ngan: 2 }, set: { wrote_own_jd: true } } }],
            bad: [['ngan', '(nhắn) em để "giao việc" trước "ký hợp đồng" kìa. y như công ty mình. chị sửa lại thứ tự, vẫn để tên em.'], { fx: { nl: -8, rel: { ngan: 1 }, set: { wrote_own_jd: true } } }],
          },
          ['think', 'Mình đã viết JD cho vị trí của mình. Giờ chỉ cần ai đó tuyển mình vào đó.'],
        ],
      },
      {
        who: 'obj:desk', obj: 'Workshop xong: về bàn', time: '17:50', when: (s) => !s.flags.culture_honest,
        scene: [
          ['nar', '19:00. Workshop kết thúc. Trên bảng trắng còn dòng chữ: "Hạnh phúc là một lựa chọn".'],
          { c: '_hr_d17_home', o: [
            { t: 'Về nhà. Hạnh phúc là một lựa chọn.', fx: { nl: 10 }, then: [['think', 'Mình chọn về.']] },
            { t: 'Ở lại dọn sticky note với anh Khoa.', fx: { nl: -5, rel: { khoa: 2 } }, then: [
              ['khoa', 'Cảm ơn em. Anh làm workshop văn hóa tám năm. Đây là lần đầu có người ở lại dọn.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.wrote_own_jd
      ? 'Ngày 17. Workshop "Hạnh phúc nơi làm việc" kéo dài tới 19 giờ. Mình nói thật, rồi được giao viết JD cho chính mình. Công ty nhân sự có JD nội bộ đầu tiên. Tác giả: intern.'
      : s.flags.form_not_anon ? 'Ngày 17. Mình góp ý qua form ẩn danh. Anh Duy cảm ơn mình bằng tên, trước cả phòng.'
        : 'Ngày 17. Bốn tiếng workshop, chín trò icebreaker, một kết luận: "Văn hóa mình rất tốt".'),
  },

  // ===== Day 19–23 =====
  {
    id: 'fake_reference', minDay: 19, maxDay: 23, title: 'Người tham chiếu giọng quen quen',
    intro: 'Anh Nam, ứng viên Kế toán trưởng cho Bao Bì Phú Quý, đã qua ba vòng phỏng vấn. Còn một bước: kiểm tra tham chiếu và bằng cấp.\n\nThường thì bước này chỉ là thủ tục. Thường thì.',
    steps: [
      {
        who: 'ngan', obj: 'Chị Ngân giao reference check', time: '09:00',
        scene: [
          ['ngan', 'Hôm nay em làm reference check và background check cho anh Nam. Phí cao, khách gấp.'],
          ['ngan', 'Anh Nam khai: thạc sĩ Đại học Quốc tế Mở Rộng Toàn Cầu (online), lương hiện tại bốn mươi triệu. Tham chiếu: anh Tùng, Giám đốc Tài chính cũ.'],
          { if: (s) => !!s.flags.nam_leverage, then: [
            ['ngan', 'Và giờ anh ấy đòi năm mươi lăm triệu. Chị không biết sự tự tin đó ở đâu ra.'],
            ['think', 'Mình biết. Nó ở trong một file Excel.'],
          ] },
          { c: 'hr_ref_prep', o: [
            { t: 'Chuẩn bị câu hỏi theo hành vi cụ thể, không hỏi "anh ấy có tốt không".', fx: { uy: 2, rel: { ngan: 1 }, set: { ref_prepared: true } }, then: [
              ['ngan', 'Đúng. Hỏi "kể một lần anh ấy xử lý sai sót sổ sách". Người thật có câu chuyện. Người giả có tính từ.'],
            ] },
            { t: 'Gọi luôn cho nhanh.', fx: { nl: 2 }, then: [['ngan', 'Ok. Nhưng ghi chép từng câu nhé.']] },
          ] },
        ],
      },
      {
        who: 'call:tung', obj: 'Gọi người tham chiếu "anh Tùng"', time: '10:00',
        call: { title: 'Reference check · "Anh Tùng"', people: ['tung', 'me'] },
        scene: [
          ['tung', '(khụ khụ) Alo, Tùng đây. Về anh Nam hả? Tôi… à, anh ấy là kế toán trưởng giỏi nhất tôi từng làm cùng.'],
          ['tung', 'Chăm chỉ, đúng hạn, đẹp trai… à không, cái đó không liên quan. (tiếng em bé khóc) Suỵt, bố đang làm tham chiếu!'],
          { if: (s) => !!s.flags.ref_prepared, then: [
            ['me', 'Anh kể giúp em một lần anh Nam xử lý sai sót sổ sách ạ?'],
            ['tung', 'Sai sót… Nam không bao giờ sai sót. Tôi xác nhận. (khụ) Anh ấy cũng xác nhận.'],
          ] },
          { mini: REF_MINI,
            good: [['think', 'Ba điểm. Người tham chiếu này có giọng, có con và có số Zalo của chính ứng viên.'], { fx: { uy: 3, set: { ref_spotted: true } } }],
            bad: [['think', 'Có gì đó sai sai, nhưng mình chưa chỉ ra được. Cần thêm dữ liệu.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'phat', obj: 'Nhờ Phát tra bằng cấp', time: '13:30',
        scene: [
          ['phat', 'Background check hả? Đưa đây. Mình là "IT" của công ty mà. IT theo nghĩa biết Google.'],
          ['phat', 'Đại học Quốc tế Mở Rộng Toàn Cầu: tên miền đăng ký tháng trước. Địa chỉ: một căn hộ. Nhận bằng sau bảy ngày.'],
          { c: 'hr_ref_verify', o: [
            { t: 'Gọi tổng đài công ty cũ của anh Nam để xác minh qua kênh chính thức.', fx: { uy: 3, nl: -5, rel: { phat: 1 }, set: { nam_truth: true } }, then: [
              ['nar', 'Nhân sự công ty cũ xác nhận: anh Nam làm Kế toán tổng hợp, không phải trưởng. Lương hai mươi lăm triệu. Không ai tên Tùng.'],
            ] },
            { t: 'Nhờ Phát tra thêm trên mạng.', fx: { rel: { phat: 2 }, set: { nam_truth: true } }, then: [
              ['phat', 'Tìm thấy ảnh anh Nam đăng "Tốt nghiệp thạc sĩ". Chụp ở… phòng khách nhà anh ấy. Áo thụng thuê.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:nam', obj: 'Gọi anh Nam làm rõ hồ sơ', time: '15:00',
        call: { title: 'Anh Nam · Làm rõ hồ sơ', people: ['nam', 'ngan', 'me'] },
        scene: [
          ['nam', 'Em gọi anh có việc gì? Bên Phú Quý chốt chưa?'],
          { c: 'hr_ref_nam', o: [
            { t: 'Nhẹ nhàng nêu các điểm chưa khớp, hỏi anh giải thích.', fx: { uy: 3, rel: { nam: 1 }, set: { ref_honest: true } }, then: [
              ['nam', '…'],
              ['nam', 'Anh làm kế toán tổng hợp tám năm, không ai cho lên trưởng vì không có bằng. Anh mua một cái bằng. Nhờ em vợ đóng vai sếp.'],
              ['nam', 'Anh rút hồ sơ. Đừng báo ai… à, em phải báo. Anh hiểu. Nghề của em mà.'],
            ] },
            { t: 'Không hỏi anh Nam, báo thẳng khách.', fx: { uy: 2, rel: { tai: 1, nam: -2 }, set: { ref_honest: true } }, then: [
              ['nam', 'Em không hỏi anh câu nào mà đã báo khách? Ừ. Ông Tài vừa nhắn anh.'],
              ['ngan', 'Đúng quy trình. Nhưng nhớ: ứng viên cũng là người. Lần sau hỏi họ một câu trước.'],
            ] },
            { t: 'Bỏ qua. Kỹ năng thật quan trọng hơn tờ bằng.', fx: { dr: 4, rel: { nam: 2, ngan: -3 }, set: { ref_ignored: true } }, then: [
              ['nam', 'Cảm ơn em! Em hiểu chuyện!'],
              ['ngan', 'Kỹ năng thật thì có thể. Nhưng người tham chiếu giả là nói dối. Và em vừa ký tên dưới lời nói dối đó.'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân chốt ca anh Nam', time: '16:30',
        scene: [
          { if: (s) => !!s.flags.ref_ignored, then: [
            ['ngan', 'Chị tự gọi lại công ty cũ. Chị rút hồ sơ anh Nam. Một thời gian em không làm background check một mình.'],
            { fx: { uy: -3 } },
          ], else: [
            ['ngan', 'Mình mất một placement. Nhưng giữ được Phú Quý. Ông Tài sẽ nhớ ai nói thật với ông ấy.'],
            ['ngan', 'Cái mình bán không phải CV. Là niềm tin rằng CV đó thật.'],
          ] },
          { c: '_hr_ref_end', o: [
            { t: '"Có ai giúp anh Nam tìm việc đúng sức anh ấy không chị?"', fx: { uy: 1, rel: { ngan: 2 } }, then: [
              ['ngan', '…Câu hỏi hay. Kế toán tổng hợp tám năm là hồ sơ tốt. Nếu anh ấy nộp bản thật, chị giới thiệu.'],
            ] },
            { t: 'Về bàn ghi biên bản.', fx: { nl: -2 }, then: [
              ['nar', 'Biên bản một trang. Mục "Người tham chiếu": "Không xác minh được (giọng giống ứng viên)".'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.ref_ignored
      ? 'Hôm nay người tham chiếu của anh Nam có giọng của anh Nam. Mình cho qua. Chị Ngân thì không.'
      : 'Hôm nay người tham chiếu của anh Nam có giọng của anh Nam, và tiếng con anh Nam. Mất một placement, giữ một khách. Mình hơi buồn cho anh ấy.'),
  },

  // ===== Day 22–26 =====
  {
    id: 'boss_ex', minDay: 22, maxDay: 26, title: 'Ứng viên CFO và người cũ của sếp',
    intro: 'Mỹ Phẩm Mộc Lan cần một CFO. Ứng viên sáng giá nhất shortlist: chị Trinh.\n\nSáng nay anh Duy đi ngang bàn Phát, thấy ảnh trong CV, và làm đổ nguyên ly cà phê lên bàn phím.',
    steps: [
      {
        who: 'phat', obj: 'Phát vẫy bạn qua (bàn phím còn ướt)', time: '09:00',
        scene: [
          ['phat', 'Bạn thấy chưa? Anh Duy nhìn CV chị Trinh, đổ cà phê, đi thẳng vào phòng, đóng cửa, bật nhạc buồn.'],
          ['phat', 'Bàn phím mình giờ chỉ gõ được chữ "Trinh". Đùa thôi. Nhưng phím T bị dính thật.'],
          { c: 'hr_ex_phat', o: [
            { t: 'Hỏi Phát chuyện gì đang xảy ra.', fx: { dr: 2, rel: { phat: 1 } }, then: [
              ['phat', 'Mình không biết. Nhưng chị My biết. Chị My biết lương, và chị My biết… mọi thứ.'],
            ] },
            { t: '"Thôi, chuyện riêng của anh ấy."', fx: { uy: 1, rel: { phat: 1 } }, then: [
              ['phat', 'Bạn tử tế. Mình thì hóng. Nhưng bạn tử tế.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy gọi vào phòng, đóng cửa', time: '10:00',
        scene: [
          ['duy', 'Em vào đây. Đóng cửa. Ca CFO Mộc Lan em hỗ trợ Ngân đúng không?'],
          ['duy', 'Chị Trinh… anh biết. Ngày xưa. Em đánh giá khách quan nhé. Khách quan… kiểu… em hiểu ý anh mà.'],
          ['think', 'Mình không hiểu ý anh. Có hai cách hiểu, và chúng ngược nhau.'],
          { c: 'hr_ex_duy', o: [
            { t: '"Ý anh là sao ạ? Em cần rõ để không làm sai."', fx: { uy: 3, rel: { duy: 1 }, set: { ex_clarified: true } }, then: [
              ['duy', '…Ý anh là đừng nương tay vì chị ấy quen anh. Cũng đừng đánh trượt vì chị ấy quen anh. Khách quan. Thật.'],
              ['duy', 'Anh nói khó hiểu quá hả? Anh xin lỗi. Anh… lâu rồi không gặp.'],
            ] },
            { t: '"Dạ em hiểu ạ."', fx: { set: { duy_hint: true } }, then: [
              ['think', 'Mình không hiểu. Nhưng lỡ nói hiểu rồi.'],
            ] },
            { t: '"Em nghĩ anh nên khai xung đột lợi ích và đứng ngoài ca này ạ."', fx: { uy: 3, dr: 1, rel: { duy: -1, ngan: 2 }, set: { coi_declared: true } }, then: [
              ['duy', '…Đúng. Đúng là phải thế. Anh dạy khách điều này mà. Anh sẽ không xem hồ sơ chị ấy nữa.'],
            ] },
          ] },
        ],
      },
      {
        who: 'my', obj: 'Chị My biết chuyện', time: '11:30',
        scene: [
          ['my', 'Em muốn biết chuyện anh Duy hả? Không phải chuyện lương nên chị kể được.'],
          ['my', 'Hai người yêu nhau thời đại học. Năm 2019 anh Duy bị cho nghỉ. Chị Trinh bảo anh mở công ty: "Anh đối xử với người khác tốt hơn họ đối xử với anh."'],
          ['my', 'Rồi công ty lớn lên. Anh Duy bận viết về văn hóa. Chị Trinh đi. Anh ấy chưa bao giờ viết về chuyện đó.'],
          ['think', 'Người lập công ty nhân sự vì bị đối xử tệ. Rồi quên ký hợp đồng cho nhân viên.'],
          { c: 'hr_ex_my', o: [
            { t: '"Anh ấy sợ gặp lại chị ấy, hay sợ chị ấy thấy công ty bây giờ?"', fx: { rel: { my: 2 }, set: { ex_insight: true } }, then: [
              ['my', '…Câu này chị chưa nghĩ tới. Có khi cả hai.'],
            ] },
            { t: 'Cảm ơn chị, quay về việc.', fx: { uy: 1 }, then: [
              ['my', 'Ừ. Đánh giá như mọi ứng viên khác. Đó là món quà tốt nhất cho cả hai người.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:trinh', obj: 'Screening call với chị Trinh', time: '14:00',
        call: { title: 'Screening call · Ứng viên CFO', people: ['trinh', 'me'] },
        scene: [
          ['trinh', 'Chào em. Chị chuẩn bị số liệu rồi: ba năm tái cấu trúc nợ, giảm chi phí vốn mười hai phần trăm, đội tài chính mười lăm người.'],
          ['nar', 'Chị Trinh trả lời mọi câu bằng con số, đúng giờ, không thừa. Cột điểm của chị cao nhất shortlist.'],
          ['trinh', 'Chị hỏi một câu ngoài lề nhé. Công ty em… là của anh Duy đúng không? Anh ấy dạo này ổn không?'],
          { c: 'hr_ex_trinh', o: [
            { t: '"Anh ấy ổn ạ. Ca của chị do chị Ngân phụ trách để đảm bảo khách quan."', fx: { uy: 3, rel: { trinh: 2 } }, then: [
              ['trinh', 'Chuyên nghiệp. Anh ấy luôn muốn công ty mình như vậy. Cảm ơn em.'],
            ] },
            { t: '"Anh ấy làm đổ cà phê khi thấy CV chị ạ."', fx: { dr: 4, rel: { trinh: 1, duy: -1 }, set: { told_trinh: true } }, then: [
              ['trinh', '…Vẫn vụng như xưa. (cười) Thôi, mình quay lại số liệu nhé.'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chốt điểm ca CFO với chị Ngân', time: '16:00',
        scene: [
          ['ngan', 'Chốt điểm ca CFO. Em chấm chị Trinh bao nhiêu?'],
          { c: 'hr_ex_score', o: [
            { t: 'Chấm đúng năng lực (cao nhất), ghi rõ anh Duy đứng ngoài ca vì xung đột lợi ích.', fx: { uy: 4, rel: { ngan: 2 }, set: { trinh_fair: true } }, then: [
              ['ngan', 'Đúng quy trình. Chị gửi Mộc Lan, kèm ghi chú xung đột lợi ích. Khách sẽ tôn trọng mình hơn, không kém đi.'],
            ] },
            { t: 'Hạ điểm một chút cho "an toàn" với anh Duy.', when: (s) => !!s.flags.duy_hint, fx: { dr: 5, rel: { ngan: -3 }, set: { trinh_sabotaged: true } }, then: [
              ['ngan', 'Em hạ điểm ứng viên tốt nhất vì đoán ý sếp? Chị giữ bản chấm gốc. Chị sẽ hỏi anh Duy.'],
            ] },
            { t: 'Chấm cao, nhưng xin rút khỏi ca vì thấy khó khách quan.', fx: { uy: 2, rel: { ngan: 1 }, set: { trinh_fair: true } }, then: [
              ['ngan', 'Biết mình không khách quan cũng là một kiểu khách quan. Chị nhận ca.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy muốn nói chuyện', time: '17:30',
        scene: [
          { if: (s) => !!s.flags.trinh_sabotaged, then: [
            ['duy', 'Ngân vừa hỏi anh. Anh đâu có bảo em đánh trượt chị ấy! Anh chỉ… nói khó hiểu.'],
            ['duy', 'Anh làm nghề nhân sự mười năm mà không nói nổi một câu rõ ràng với nhân viên. Anh xin lỗi em.'],
            { fx: { rel: { duy: -1 } } },
          ], else: [
            ['duy', 'Ngân báo anh rồi. Chị Trinh vào vòng cuối. Anh không xem hồ sơ. Anh hứa.'],
            ['duy', 'Hồi anh bị layoff, chị ấy bảo anh mở công ty để "đối xử với người khác tốt hơn". Anh làm được chưa nhỉ?'],
          ] },
          { c: 'hr_ex_end', o: [
            { t: '"Chưa ạ. Nhưng còn kịp. Bắt đầu từ hợp đồng của Phát."', fx: { uy: 2, dr: 2, rel: { duy: 1, phat: 2 }, set: { duy_nudged: true } }, then: [
              ['duy', '…Hợp đồng của Phát. Ừ. Anh biết. Tuần… không. Thứ Sáu này.'],
              ['think', 'Lần đầu tiên "tuần sau" thành "thứ Sáu này".'],
            ] },
            { t: '"Dạ anh làm được nhiều rồi ạ."', fx: { rel: { duy: 2 } }, then: [
              ['duy', 'Cảm ơn em. Anh sẽ viết một bài LinkedIn về… thôi. Không viết bài này.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.trinh_sabotaged
      ? 'Hôm nay mình đoán sai ý sếp, và hạ điểm người giỏi nhất. Anh Duy xin lỗi mình. Mình thì phải xin lỗi chị Trinh, dù chị ấy không biết.'
      : 'Hôm nay mình chấm một ứng viên CFO giỏi nhất shortlist. Chị ấy là người cũ của anh Duy. Mình biết thêm vì sao công ty này tồn tại.'),
  },

  // ===== Day 24–29 =====
  {
    id: 'fee_squeeze', minDay: 24, maxDay: 29, title: 'Khách đi đường vòng',
    intro: 'LinkedIn gửi thông báo: "Hãy chúc mừng chị Bảo Châu với công việc mới: Trợ lý Giám đốc tại Đất Vàng Land!"\n\nBạn nhớ chị Bảo Châu. Bạn gửi CV chị ấy cho Đất Vàng ba tuần trước. Họ trả lời: "Không phù hợp."',
    steps: [
      {
        who: 'vy', obj: 'Vy hét tên bạn từ bàn bên', time: '09:00',
        scene: [
          ['vy', 'Bạn ơi! Bảo Châu! Ứng viên Trợ lý Giám đốc bạn gửi Đất Vàng! Giờ làm ở chính Đất Vàng!'],
          ['vy', 'Khách gọi đây là "đi đường vòng". Mình gọi là "quỵt có kế hoạch".'],
          { if: (s) => !!s.flags.jd_pushback, then: [
            ['vy', 'Mà buồn cười: chị ấy ba mươi hai tuổi, có con nhỏ. Đúng kiểu người bản JD gốc định loại. Sếp họ vẫn chọn.'],
            ['think', 'Hóa ra tiêu chí "tuổi" biến mất khi gặp người giỏi.'],
          ] },
          { c: 'hr_fee_vy', o: [
            { t: 'Chụp màn hình LinkedIn, lưu bằng chứng ngay.', fx: { uy: 2, rel: { vy: 1 }, set: { fee_evidence: true } }, then: [
              ['vy', 'Chuẩn. Mai họ chỉnh chế độ riêng tư là mất.'],
            ] },
            { t: 'Nhắn chúc mừng chị Bảo Châu.', fx: { rel: { vy: 1 }, set: { fee_confession: true } }, then: [
              ['nar', 'Chị Bảo Châu trả lời: "Cảm ơn em! Bên Đất Vàng liên hệ chị trực tiếp, bảo là để đỡ phí cho cả hai bên 😊".'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Dựng timeline với chị Ngân', time: '10:00',
        scene: [
          ['ngan', 'Hợp đồng phí: ứng viên mình giới thiệu, khách tuyển trong vòng sáu tháng thì vẫn tính phí. Em dựng timeline cho chị.'],
          { mini: TIMELINE_MINI,
            good: [['ngan', 'Timeline sạch. Email gửi CV có giờ, có tệp đính kèm. Họ không cãi được.'], { fx: { uy: 3, set: { fee_evidence: true } } }],
            bad: [['ngan', 'Em đảo hai mốc. Gửi thế này họ sẽ nói ứng viên tự ứng tuyển trước. Chị sửa.'], { fx: { nl: -4 } }],
          },
        ],
      },
      {
        who: 'call:kimanh', obj: 'Gọi Đất Vàng về phí dịch vụ', time: '13:30',
        call: { title: 'Đất Vàng Land · "Về phí dịch vụ"', people: ['kimanh', 'ngan', 'bach', 'me'] },
        scene: [
          ['kimanh', 'Bạn Bảo Châu tự ứng tuyển vào bên chị. Không liên quan bên em.'],
          ['kimanh', 'Mà nói thật, kể cả có liên quan thì phí hai tháng lương là cao. Bên chị chỉ trả năm mươi phần trăm.'],
          { if: (s) => !!s.flags.fee_confession, then: [['think', 'Chị Bảo Châu vừa nói với mình điều ngược lại. Bằng chữ. Có emoji.']] },
          { c: 'hr_fee_kimanh', o: [
            { t: 'Bình tĩnh gửi timeline, email gửi CV và điều khoản sáu tháng.', fx: { uy: 4, rel: { ngan: 2, kimanh: -1 }, set: { fee_full: true } }, then: [
              ['kimanh', '…Chị sẽ trình sếp. Chị không hứa thời gian thanh toán.'],
              ['ngan', '(nhắn) họ sẽ trả. chậm hai tháng. nhưng đủ.'],
            ] },
            { t: 'Đề nghị nhận bảy mươi phần trăm để giữ quan hệ.', fx: { uy: 1, rel: { kimanh: 2, ngan: -1 }, set: { fee_70: true } }, then: [
              ['kimanh', 'Bảy mươi. Ok. Bên em dễ thương. Lần sau bên chị lại gửi job.'],
              ['ngan', '(nhắn) "dễ thương" là chữ khách dùng ngay trước lần ép giá tiếp theo.'],
            ] },
            { t: 'Nói sẽ chuyển sang luật sư.', fx: { dr: 5, rel: { kimanh: -3, bach: -2 }, set: { fee_threat: true } }, then: [
              ['kimanh', 'Luật sư à? Ok. Bên chị trả đủ. Và đây là job cuối cùng bên chị gửi bên em.'],
              ['bach', '(tắt mic) Anh vừa mất khách lớn nhất quý.'],
            ] },
          ] },
        ],
      },
      {
        who: 'bach', obj: 'Bách muốn nói nhỏ', time: '15:30',
        scene: [
          ['bach', 'Ra đây anh nói nhỏ. Lúc chào hợp đồng, anh có hứa miệng với chị Kim Anh: "bảo hành sáu tháng, miễn phí thay người".'],
          ['bach', 'Hợp đồng ghi sáu mươi ngày. Nhưng anh nói sáu tháng. Qua Zalo. Có tin nhắn.'],
          ['think', 'Bảo hành là miễn phí. Cho đến khi nó không còn miễn phí.'],
          { c: 'hr_fee_bach', o: [
            { t: 'Khuyên anh tự báo chị Ngân hôm nay, trước khi khách lôi tin nhắn ra.', fx: { uy: 2, rel: { bach: 1, ngan: 1 }, set: { bach_confessed: true } }, then: [
              ['bach', 'Ừ. Anh sợ, nhưng ừ. Chắc kèo… là chắc anh bị mắng.'],
            ] },
            { t: 'Giữ bí mật giúp anh.', fx: { dr: 3, rel: { bach: 2 }, set: { bach_secret: true } }, then: [
              ['bach', 'Cảm ơn em. Anh nợ em một bữa. Hai bữa nếu khách không phát hiện.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy hỏi kết quả vụ Đất Vàng', time: '17:00',
        scene: [
          { if: (s) => !!s.flags.fee_threat, then: [
            ['duy', 'Mất Đất Vàng rồi à? …Anh sẽ viết bài "Biết nói không với khách hàng sai". Nhưng tháng này lương hơi khó.'],
          ], else: [
            { if: (s) => !!s.flags.fee_full, then: [
              ['duy', 'Đất Vàng đồng ý trả đủ! Chậm, nhưng đủ. Tối nay anh đăng bài "Tôn trọng đối tác là tôn trọng hợp đồng".'],
            ], else: [
              ['duy', 'Bảy mươi phần trăm cũng là tiền. Mình là đối tác lâu dài mà.'],
              ['think', 'Lâu dài cho đến lần ép giá tiếp theo.'],
            ] },
          ] },
          { c: '_hr_fee_end', o: [
            { t: 'Đề nghị thêm điều khoản "khách tuyển trực tiếp ứng viên" vào mọi hợp đồng mẫu.', fx: { uy: 2, rel: { duy: 1 } }, then: [
              ['duy', 'Ý hay! …Mà mẫu hợp đồng của mình là mẫu của ai nhỉ? À, của một khách. Ừ, sửa.'],
            ] },
            { t: 'Về bàn cập nhật ATS.', fx: { nl: -2 }, then: [
              ['nar', 'Bạn sửa trạng thái chị Bảo Châu: "Placed (bởi khách, không mời mình)".'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.fee_threat
      ? 'Khách tuyển thẳng ứng viên của mình để né phí. Mình dọa luật sư. Họ trả đủ, rồi đi luôn. Anh Duy nói "lương tháng này hơi khó".'
      : s.flags.fee_full ? 'Khách tuyển thẳng ứng viên của mình để né phí. Timeline và một email cũ cứu cả ca. Chậm hai tháng, nhưng đủ.'
        : 'Khách tuyển thẳng ứng viên của mình để né phí. Mình lấy bảy mươi phần trăm. "Dễ thương" là một từ đắt.'),
  },

  // ===== Day 30 =====
  {
    id: 'payday_late', day: 30, title: 'Ngày lương… dự kiến',
    intro: 'Thứ Ba, ngày 30. Theo thỏa thuận, hôm nay là ngày nhận lương.\n\n8:02, group "Gia Đình Đúng Chỗ 💜" có tin nhắn mới của chị Thảo. Tin nhắn mở đầu bằng: "Cả nhà ơi, chị xin lỗi…".',
    chatStart: [
      ['thao', 'Cả nhà ơi, chị xin lỗi. Lương tháng này sẽ về "trong tuần" do khách chưa thanh toán phí. Chị cũng chưa có lương 🙏'],
      ['duy', 'Khó khăn là cơ hội để mình gắn kết hơn 💜'],
      ['phat', '👍 (thả vì không biết thả gì khác)'],
    ],
    steps: [
      {
        who: 'thao', obj: 'Qua quầy chị Thảo hỏi chuyện lương', time: '08:30',
        scene: [
          ['thao', 'Em đọc group rồi hả. Chị xin lỗi. Chị là kế toán, chị biết lương phải trả đúng hạn. Nhưng tiền không nghe chị.'],
          ['thao', 'Đất Vàng chưa chuyển phí. Phú Quý "đang trình ký". Anh Duy bảo "trong tuần".'],
          { if: (s) => !!s.flags.fee_full, then: [['thao', 'Đất Vàng hứa trả đủ, nhưng chậm hai tháng. Cái "chậm" đó đang nằm trong ví của em.']] },
          { c: 'hr_pay_thao', o: [
            { t: 'Hỏi lịch sự: "Chị cho em một ngày cụ thể được không ạ?"', fx: { uy: 2, rel: { thao: 2 }, set: { pay_polite: true } }, then: [
              ['thao', 'Thứ Sáu. Chị ghi ra giấy, chị ký tên. Không có thì em cầm tờ này vào hỏi anh Duy.'],
            ] },
            { t: 'Nhắn vào group: "Mình có lịch trả lương rõ ràng không ạ?"', fx: { dr: 4, rel: { duy: -2, phat: 2, vy: 2 }, set: { pay_group: true } }, then: [
              ['nar', 'Ba giây sau: Phát thả tim. Vy: "+1". Quân: "+1". Chị My: "+1 (P50 của sự kiên nhẫn đã hết)". Anh Tuấn: "+1 xe".'],
            ] },
            { t: 'Không hỏi. Ăn mì vài hôm.', fx: { nl: -5, set: { pay_silent: true } }, then: [
              ['think', 'Mì tôm chua cay. Vị của tuần cuối tháng.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn: kiểm tra phiếu lương nháp', time: '10:00', when: (s) => !isOfficial(s),
        scene: [
          ['nar', 'Email chị Thảo: "Phiếu lương (bản nháp, vẽ bằng Excel)". Công ty tư vấn C&B cho năm mươi doanh nghiệp. Phiếu lương mình vẽ bằng Excel.'],
          { mini: PAYSLIP_MINI,
            good: [
              ['think', 'Bốn chỗ sai. Mình báo ba. Chỗ thứ tư chắc chị Thảo tự thấy… hy vọng vậy.'],
              ['thao', '(nhắn) em đúng. em chưa có HĐLĐ nên không trừ BHXH. quỹ team building là ý anh Duy, chị bỏ luôn.'],
              { fx: { uy: 2, rel: { thao: 1 }, set: { payslip_fixed: true } } },
            ],
            bad: [
              ['nar', 'Bạn duyệt phiếu lương. Tên bạn: "Thực Tập Sinh 2". Bạn chính thức trở thành một con số.'],
              { fx: { dr: 2, money: -200_000 } },
            ],
          },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn: phiếu lương chính thức đầu tiên', time: '10:00', when: (s) => isOfficial(s),
        scene: [
          ['nar', 'Phiếu lương: "Lương cứng 10.000.000 · Bảo hiểm 10,5% · Hoa hồng: 0 (chờ hết bảo hành 60 ngày)". Có cả tên bạn, đúng chính tả.'],
          ['think', 'Lương chính thức đúng như hợp đồng. Chỉ là chưa về.'],
          { c: '_hr_pay_off', o: [
            { t: 'Hỏi chị Thảo khi nào hoa hồng được tính.', fx: { uy: 1, rel: { thao: 1 } }, then: [
              ['thao', 'Khi ứng viên qua ngày sáu mươi, và khách trả phí. Cái thứ hai mới khó.'],
            ] },
            { t: 'Đóng file, thở dài.', fx: { nl: 2 }, then: [['nar', 'Mèo Ghost nằm lên bàn phím, gõ "fffffff". Nó cũng đồng ý.']] },
          ] },
        ],
      },
      {
        who: 'thao', obj: 'Chị Thảo gọi lại: chuyện giấy tờ', time: '11:00',
        scene: [
          { if: isOfficial, then: [
            ['thao', 'Hợp đồng lao động của em thì đủ chữ ký rồi. Nhưng Phát thì chưa. Sáu tháng. Chị nhắc mười tám lần. Có ghi sổ.'],
          ], else: [
            ['thao', 'Em ơi, chị làm hồ sơ lương thì phát hiện… bản thỏa thuận thực tập của em chưa có chữ ký anh Duy.'],
            { if: (s) => !!s.flags.kept_copy, then: [['think', 'Mình biết. Mình có tấm ảnh chụp "một nửa hợp đồng".']] },
            ['thao', 'Phát cũng vậy. Sáu tháng, chưa có hợp đồng lao động. Chị nhắc mười tám lần. Có ghi sổ.'],
          ] },
          ['thao', 'Nói nhỏ: làm việc có trả công, chịu quản lý, thì dù gọi tên gì cũng có thể bị coi là quan hệ lao động. Điều 13 Bộ luật Lao động. (thông tin giải trí, không phải tư vấn pháp lý)'],
          { c: 'hr_pay_contract', o: [
            { t: 'Hỏi thẳng anh Duy, lịch sự, hôm nay.', fx: { uy: 2, rel: { duy: -1 }, set: { asked_contract: true } }, then: [
              ['duy', '(qua Zalo) Tuần sau anh ký hết nhé! 💜'],
              ['think', '"Tuần sau" kèm một trái tim. Trái tim không có giá trị pháp lý.'],
            ] },
            { t: 'Email anh Duy, cc chị Thảo, kèm điều luật và đề nghị lịch ký cho cả mình lẫn Phát.', fx: { uy: 3, dr: 3, rel: { duy: -2, thao: 2, phat: 3 }, set: { contract_email: true } }, then: [
              ['nar', 'Email gửi 11:14. 11:40, anh Duy trả lời: "Ok em. Thứ Năm ký." Không có trái tim.'],
              ['phat', '(nhắn) bạn cc cả tên mình. mình in email này ra treo đầu giường.'],
            ] },
            { t: 'Để sau, chuyện lương trước đã.', fx: { nl: 2 }, then: [
              ['thao', 'Ừ. Nhưng nhớ: giấy tờ không có thì đến lúc cần là không có.'],
            ] },
          ] },
        ],
      },
      {
        who: 'phat', obj: 'Phát có chuyện muốn nhờ', time: '14:00',
        scene: [
          ['phat', 'Bạn có… hai trăm nghìn không. Mai chủ trọ thu tiền. Lương "trong tuần", mà tuần của chủ trọ là thứ Tư.'],
          ['phat', 'Tháng trước mình giới thiệu một kế toán trưởng lương bốn mươi triệu. Giờ mình đi mượn bạn hai trăm.'],
          { c: 'hr_pay_phat', o: [
            { t: 'Cho Phát mượn 200.000đ.', fx: { money: -200_000, rel: { phat: 3 }, set: { lent_phat: true } }, then: [
              ['phat', 'Thứ Sáu mình trả. Thứ Sáu thật, không phải thứ Sáu kiểu anh Duy.'],
            ] },
            { t: 'Không có tiền, nhưng chia nửa gói mì.', fx: { nl: -2, rel: { phat: 2 } }, then: [
              ['phat', 'Mì tôm chua cay, hai người một gói. Tình đồng chí thời "trong tuần".'],
            ] },
            { t: '"Mình cũng chưa có lương, xin lỗi nhé."', fx: { dr: 1 }, then: [
              ['phat', 'Ừ, hiểu mà. Mình hỏi anh Tuấn. Anh ấy có nửa cái xe.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy gọi vào phòng', time: '16:00',
        scene: [
          { if: (s) => !!(s.flags.pay_group || s.flags.contract_email), then: [
            ['duy', 'Em vào đây chút. Mình là gia đình, có gì sao em không nói riêng với anh?'],
            { c: 'hr_pay_duy', o: [
              { t: '"Mọi người nói riêng rồi ạ. Nhiều lần. Chị Thảo nhắc mười tám lần."', fx: { uy: 2, dr: 2, rel: { duy: -1, thao: 1 } }, then: [
                ['duy', '…Mười tám. Thảo ghi sổ à. Ừ. Anh… biết rồi.'],
              ] },
              { t: '"Em xin lỗi, lần sau em nói riêng."', fx: { dr: -2, rel: { duy: 2 } }, then: [
                ['duy', 'Tốt. Mình giữ hòa khí nhé.'],
                ['think', 'Hòa khí không trả được tiền nhà.'],
              ] },
            ] },
          ], else: [
            ['duy', 'Em ơi, lương cả nhà về tối nay. Anh ứng trước từ thẻ tín dụng của anh. Đừng kể là anh ngại nói từ sáng.'],
            { c: '_hr_pay_duy2', o: [
              { t: '"Cảm ơn anh. Nhưng sao không nói với cả nhà từ sáng ạ?"', fx: { uy: 1, rel: { duy: 1 } }, then: [
                ['duy', 'Vì anh ngại. Founder mà ngại. Ừ, buồn cười nhỉ.'],
              ] },
              { t: 'Cảm ơn anh.', fx: { rel: { duy: 1 } }, then: [
                ['duy', 'Không có gì. Mình là… thôi, anh không nói câu đó nữa.'],
              ] },
            ] },
          ] },
          ['nar', '17:55. Group có tin nhắn của anh Duy: "Lương về trước 0 giờ hôm nay. Anh xin lỗi cả nhà vì chậm." Không có emoji.'],
        ],
      },
    ],
    diary: (s) => `Ngày 30. Lương về lúc 23:58. ${s.flags.contract_email ? 'Mình gửi một email có điều luật. Anh Duy trả lời không có trái tim. ' : ''}${s.flags.lent_phat ? 'Phát mượn mình 200 nghìn. ' : ''}Một công ty tư vấn C&B, và phiếu lương vẽ bằng Excel.`,
  },

  // ===== Day 31–34 =====
  {
    id: 'assessment_rig', minDay: 31, maxDay: 34, title: '"Chấm thấp giúp anh"',
    intro: 'Bao Bì Phú Quý thuê anh Khoa làm assessment center cho mười hai trưởng ca. Hợp đồng lớn nhất năm của mảng Đào tạo.\n\nAnh Khoa mặc sơ mi mới. Anh mang theo bốn mươi cây bút dạ và một nỗi lo chưa nói ra.',
    steps: [
      {
        who: 'khoa', obj: 'Anh Khoa chuẩn bị chấm assessment', time: '08:30',
        scene: [
          ['khoa', 'Hôm nay mình chấm assessment cho mười hai trưởng ca Phú Quý. Nhập vai, thảo luận nhóm, case xử lý sự cố.'],
          ['khoa', 'Anh chuẩn bị ba tuần. Lần đầu khách trả tiền cho phần đào tạo mà không bắt anh chơi icebreaker.'],
          { c: 'hr_as_khoa', o: [
            { t: 'Hỏi anh khung năng lực khách đã duyệt.', fx: { uy: 2, rel: { khoa: 2 }, set: { knows_framework: true } }, then: [
              ['khoa', 'Bốn năng lực: giải quyết vấn đề, làm việc nhóm, an toàn lao động, giao tiếp. Khách ký duyệt từng trang. Em giữ một bản.'],
            ] },
            { t: 'Giúp anh xếp bút dạ theo màu.', fx: { nl: -2, rel: { khoa: 1 } }, then: [
              ['khoa', 'Đỏ là rủi ro, xanh là tiềm năng, vàng là… anh hết màu khác.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:tai', obj: 'Ông Tài (Phú Quý) gọi Teams', time: '10:00',
        call: { title: 'Ông Tài (Phú Quý) · "Một việc nhỏ"', people: ['tai', 'khoa', 'me'] },
        scene: [
          { if: (s) => !!s.flags.ref_honest, then: [['tai', 'Chào em. Vụ anh Nam, cảm ơn bên em đã nói thật. Giờ anh nhờ một việc nhỏ.']] },
          ['tai', 'Ông Lực, trưởng ca B. Cứng đầu. Suốt ngày đòi quyền lợi cho công nhân: quạt, nước, giờ nghỉ.'],
          ['tai', 'Các em chấm ông ấy thấp giúp anh. Có giấy trắng mực đen thì anh có lý do cho nghỉ. Hợp đồng đào tạo năm sau anh vẫn để bên em.'],
          ['nar', 'Anh Khoa im lặng. Cây bút dạ trong tay anh rơi xuống bàn.'],
          { c: 'hr_as_tai', o: [
            { t: '"Dạ, bên em sẽ chấm đúng khung năng lực anh đã duyệt ạ."', fx: { uy: 2, rel: { tai: -1, khoa: 1 } }, then: [
              ['tai', 'Khung là do bên em viết. Em hiểu ý anh mà.'],
            ] },
            { t: 'Im lặng, để anh Khoa trả lời.', fx: { nl: -2 }, then: [
              ['khoa', 'Dạ… anh Tài cho em xem kết quả trước đã ạ.'],
              ['tai', 'Ừ, xem đi. Nhưng anh nói rồi đấy.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn đọc bảng điểm ông Lực', time: '13:00',
        scene: [
          ['nar', 'Bảng điểm ông Lực. Ông là người duy nhất trong mười hai trưởng ca dừng bài nhập vai để hỏi: "Công nhân có được nghỉ không?"'],
          { mini: ASSESS_MINI,
            good: [['think', 'Ông Lực là trưởng ca tốt nhất trong mười hai người. Lý do ông Tài muốn đuổi ông chính là lý do ông giỏi.'], { fx: { uy: 2, set: { assess_read: true } } }],
            bad: [['think', 'Mình đang lẫn giữa "năng lực" và "dễ bảo". Có lẽ ông Tài cũng muốn mình lẫn như vậy.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'khoa', obj: 'Anh Khoa: "Em nghĩ sao?"', time: '14:30',
        scene: [
          ['khoa', 'Anh dạy kỹ năng phỏng vấn tám năm. Lần đầu khách muốn anh dạy cách nói dối bằng biểu đồ.'],
          ['khoa', 'Hợp đồng này nuôi mảng Đào tạo cả năm. Và trả một phần phụ cấp của em. Em nghĩ sao?'],
          { c: 'hr_as_main', o: [
            { t: 'Báo cáo trung thực theo khung năng lực đã duyệt.', fx: { uy: 4, rel: { khoa: 2, tai: -2 }, set: { assess_honest: true } }, then: [
              ['khoa', '…Ừ. Mất hợp đồng thì anh mất hợp đồng. Còn hơn mất nghề.'],
            ] },
            { t: 'Chấm thấp ông Lực theo ý khách.', fx: { dr: 6, rel: { tai: 2, khoa: -3 }, set: { assess_rigged: true } }, then: [
              ['khoa', 'Em làm đi. Anh không ký tên vào bản này.'],
              ['think', 'Báo cáo có một chữ ký. Của mình.'],
            ] },
            { t: 'Báo cáo trung thực, kèm khuyến nghị đào tạo đối thoại cho cả quản lý lẫn trưởng ca.', fx: { uy: 5, rel: { khoa: 3, tai: -1 }, set: { assess_honest: true, assess_bridge: true } }, then: [
              ['khoa', 'Biến một yêu cầu đuổi người thành một gói đào tạo giao tiếp. Em có khiếu bán hàng đấy. Kiểu tốt.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:tai', obj: 'Ông Tài nhận kết quả (Teams)', time: '16:30',
        call: { title: 'Ông Tài · Nhận kết quả assessment', people: ['tai', 'khoa', 'duy', 'me'] },
        scene: [
          { if: (s) => !!s.flags.assess_rigged, then: [
            ['tai', 'Tốt. Thế mới là đối tác. Hợp đồng năm sau anh ký.'],
            ['duy', 'Cảm ơn anh Tài! …(tắt mic) Khoa, sao mặt em vậy?'],
            ['khoa', 'Không có gì anh. Em đang nghĩ đến lúc ông Lực đọc báo cáo này.'],
          ], else: [
            { if: (s) => !!s.flags.assess_bridge, then: [
              ['tai', '…Ông Lực điểm cao nhất? Và các em đề xuất đào tạo đối thoại cho cả quản lý?'],
              ['tai', 'Anh không thích. Nhưng đọc thấy đúng. Ông Lực ở lại. Gói đào tạo… gửi báo giá đi.'],
              { fx: { uy: 2, rel: { tai: 1 } } },
            ], else: [
              ['tai', 'Điểm cao nhất? Các em không hiểu ý anh à. Hợp đồng năm sau anh tìm bên khác.'],
              ['duy', '(tắt mic) …Mất hợp đồng đào tạo. Nhưng anh tự hào. Anh sẽ đăng bài. Tháng sau.'],
            ] },
          ] },
          { c: '_hr_as_end', o: [
            { t: 'Nhắn hỏi thăm anh Khoa cuối ngày.', fx: { rel: { khoa: 2 } }, then: [
              ['khoa', '(nhắn) cảm ơn em. tối nay anh mở một trò icebreaker cho chính mình: ngủ sớm 🎲'],
            ] },
            { t: 'Về đúng giờ.', fx: { nl: 8 }, then: [
              ['nar', 'Trên đường về, bạn nghĩ về một ông trưởng ca bạn chưa từng gặp, người đã hỏi công nhân có được nghỉ không.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.assess_rigged
      ? 'Hôm nay mình chấm thấp một trưởng ca giỏi vì khách muốn đuổi ông ấy. Báo cáo có chữ ký của mình. Anh Khoa không ký.'
      : s.flags.assess_bridge ? 'Hôm nay khách muốn mình "chấm thấp giúp". Mình chấm đúng, và bán thêm được một gói đào tạo đối thoại. Ông Lực ở lại.'
        : 'Hôm nay khách muốn mình "chấm thấp giúp". Mình chấm đúng. Công ty mất một hợp đồng. Anh Khoa ngủ được.'),
  },

  // ===== Day 36–37 =====
  {
    id: 'dinner_rpo', minDay: 36, maxDay: 37, title: 'Bữa cơm chốt deal',
    intro: 'Bao Bì Phú Quý cần 200 công nhân cho mùa cao điểm cuối năm. Hợp đồng RPO lớn nhất lịch sử công ty.\n\nÔng Tài muốn "ăn bữa cơm" trước khi ký. Theo kinh nghiệm của Bách, bữa cơm kết thúc lúc 23 giờ.',
    steps: [
      {
        who: 'bach', obj: 'Bách báo deal lớn', time: '09:00',
        scene: [
          ['bach', 'Deal lớn! RPO 200 công nhân cho Phú Quý trong ba tuần. Phí tính theo đầu người. Chắc kèo… nếu tối nay ăn uống vui vẻ.'],
          { if: (s) => !!s.flags.assess_rigged, then: [
            ['bach', 'Ông Tài quý mình lắm sau vụ assessment. Mà nghe nói ông Lực vừa nghỉ, kéo theo nửa ca B. Nên mới cần 200 người.'],
            ['think', 'Nửa ca B đi theo ông Lực. Một con số mình đã góp phần tạo ra.'],
          ], else: [
            { if: (s) => !!s.flags.assess_honest, then: [['bach', 'Ông Tài vẫn hơi dỗi vụ assessment. Nhưng mùa cao điểm thì dỗi cũng phải tuyển.']] },
          ] },
          { c: 'hr_rpo_bach', o: [
            { t: '"Anh hứa với ông Tài bao nhiêu người, trong bao lâu ạ?"', fx: { uy: 2, rel: { bach: -1 } }, then: [
              ['bach', 'Hai trăm người, ba tuần. Anh nói "chắc kèo". …Em nhìn anh như chị Ngân nhìn anh.'],
            ] },
            { t: '"Hay quá anh!"', fx: { rel: { bach: 2 } }, then: [
              ['bach', 'Đấy! Năng lượng! Tối nay đi ăn với anh nhé.'],
            ] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Vy chỉ cách tính phễu RPO', time: '11:00',
        scene: [
          ['vy', 'Bạn biết RPO tính toán thế nào không? Để mình chỉ. Ngồi xuống trước khi nghe.'],
          { mini: FUNNEL_MINI,
            good: [
              ['vy', 'Đúng. Muốn 200 người đi làm, mình cần gọi khoảng mười hai nghìn cuộc. Ba tuần. Bốn người.'],
              ['think', 'Ba nghìn cuộc mỗi người. Một trăm năm mươi cuộc mỗi ngày. Nếu không ai ngủ.'],
              { fx: { uy: 2, rel: { vy: 1 } } },
            ],
            bad: [['vy', 'Bạn để "nhận việc" trước "đến phỏng vấn" à? Ở RPO thì… cũng có ngày như vậy thật. Nhưng hiếm.'], { fx: { nl: -2 } }],
          },
          { c: 'hr_rpo_plan', o: [
            { t: 'Đề xuất thêm cộng tác viên ở khu công nghiệp, trả theo người đi làm thật.', fx: { uy: 3, rel: { vy: 2 }, set: { rpo_ctv: true } }, then: [
              ['vy', 'Ý hay. Tốn tiền, nhưng tụi mình còn sống. Mình đưa vào báo giá.'],
            ] },
            { t: 'Đăng tin "lương cao, việc nhẹ" cho nhanh.', fx: { dr: 4, rel: { vy: -2 }, set: { rpo_vague: true } }, then: [
              ['vy', 'Rồi người ta đến, biết lương thật, đi về. Mình mất cả ngày để tuyển người nghỉ việc.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy rủ đi ăn với khách', time: '15:00',
        scene: [
          ['duy', 'Tối nay em đi cùng anh với Bách nhé. Em ngồi cạnh ông Tài, nói về quy trình. Khách thích người trẻ nói chuyện có số liệu.'],
          ['duy', 'Nhà hàng hải sản. Ông Tài thích "trăm phần trăm".'],
          { c: 'hr_rpo_dinner', o: [
            { t: 'Đi, nói trước: "Em đi xe máy, em không uống ạ."', fx: { uy: 2, rel: { duy: 1 }, set: { dinner_go: true, dinner_sober: true } }, then: [
              ['duy', 'Ok! Em lo số liệu, anh lo… phần trăm.'],
            ] },
            { t: 'Từ chối lịch sự: "Tối nay em có việc gia đình ạ."', fx: { rel: { duy: -1 }, set: { dinner_skip: true } }, then: [
              ['duy', 'Ừ… không sao. Anh với Bách đi.'],
              ['think', '"Không sao" của anh Duy luôn có chữ "thiếu tinh thần" đứng phía sau.'],
            ] },
            { t: 'Đi, và chiều khách hết mình.', fx: { rel: { duy: 2, bach: 2 }, set: { dinner_go: true, dinner_drunk: true } }, then: [
              ['bach', 'Đấy! Tinh thần! Tối nay chắc kèo!'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: '17:45 Thu dọn đồ: bữa tối với khách', time: '17:45',
        scene: [
          { if: (s) => !!s.flags.dinner_go, then: [
            ['nar', '19:30. Nhà hàng hải sản. Ông Tài nâng ly lần thứ mười một. "Trăm phần trăm vì hai trăm công nhân!"'],
            { if: (s) => !!s.flags.dinner_sober, then: [
              ['nar', 'Bạn uống trà đá và trình bày phễu tuyển. Ông Tài nghe, gật, rồi ký lên khăn giấy: "Đồng ý. Gửi hợp đồng."'],
              { fx: { uy: 3, rel: { tai: 1 }, set: { rpo_signed: true } } },
            ], else: [
              ['nar', 'Bạn uống theo. Tới ly thứ sáu, bạn hứa với ông Tài "ba trăm người trong hai tuần". Bách vỗ tay.'],
              ['nar', 'Ông Tài ký lên khăn giấy. Không ai nhớ ai giữ cái khăn giấy đó.'],
              { fx: { nl: -20, dr: 4, set: { rpo_signed: true, drank_today: true, rpo_overpromise: true } } },
            ] },
          ], else: [
            ['nar', '17:45. Anh Duy và Bách đi ăn. Bạn ở lại soạn phễu tuyển và báo giá.'],
            { chat: [['duy', 'Ký rồi! Ông Tài hỏi "bạn intern có số liệu đâu". Mai em gửi ông ấy file nhé', true]] },
            { fx: { set: { rpo_signed: true } } },
          ] },
          { c: '_hr_rpo_end', o: [
            { t: 'Về ngủ sớm.', fx: { nl: 8 }, then: [['think', 'Hai trăm công nhân. Ba tuần. Mai tính.']] },
            { t: 'Soạn luôn kế hoạch tuyển 200 người.', fx: { uy: 2, nl: -8 }, then: [
              ['nar', 'Kế hoạch dài ba trang. Trang ba chỉ có một dòng: "Cần thêm người tuyển người".'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.dinner_drunk
      ? 'Bữa cơm chốt deal. Mình hứa ba trăm công nhân trong hai tuần. Mình không nhớ đã hứa. Bách nhớ.'
      : s.flags.dinner_sober ? 'Bữa cơm chốt deal. Mình uống trà đá, trình bày phễu tuyển. Ông Tài ký lên khăn giấy.'
        : 'Mình không đi ăn với khách. Deal vẫn được ký. Ông Tài hỏi file số liệu của "bạn intern".'),
  },

  // ===== Day 38–40 =====
  {
    id: 'phat_leaving', minDay: 38, maxDay: 40, title: 'Công ty headhunt bị headhunt',
    intro: 'Sáng nay ảnh đại diện LinkedIn của Phát có thêm viền xanh lá: "#OpenToWork".\n\nTrong một công ty headhunt, đó là tin đồn lan nhanh nhất. Nhanh hơn cả tin lương về.',
    steps: [
      {
        who: 'phat', obj: 'Phát có chuyện muốn nói', time: '09:00',
        scene: [
          ['phat', 'Bạn thấy viền xanh rồi hả. Ừ. Mình đang tìm việc. Sáu tháng không hợp đồng. Mình mệt.'],
          { if: (s) => !!s.flags.contract_email, then: [['phat', 'Nhờ email của bạn, hợp đồng của mình đã được in. Chưa ký. Nhưng đã in. Tiến bộ.']], else: [
            { if: (s) => !!s.flags.duy_nudged, then: [['phat', 'Anh Duy hứa "thứ Sáu này" ký hợp đồng cho mình. Thứ Sáu đó đã qua ba lần.']] },
          ] },
          ['phat', 'Chiều nay 14:00 mình đi phỏng vấn bên Săn Đầu Pro. Bạn nói với mọi người là mình đi khám răng giúp nhé.'],
          { c: 'hr_ph_cover', o: [
            { t: 'Đồng ý giữ bí mật cho Phát.', fx: { rel: { phat: 2 }, set: { cover_phat: true } }, then: [
              ['phat', 'Cảm ơn. 14:00 răng mình sẽ rất đau.'],
            ] },
            { t: 'Khuyên Phát nói thẳng với anh Duy điều mình cần trước khi đi.', fx: { uy: 2, rel: { phat: 1 }, set: { phat_talk: true } }, then: [
              ['phat', 'Nói thì được gì? …Ừ, ít ra anh ấy không phải đọc tin này trên LinkedIn.'],
            ] },
            { t: '"Mình không nói dối giúp được, nhưng sẽ không kể với ai."', fx: { uy: 1, rel: { phat: 1 } }, then: [
              ['phat', 'Công bằng. Vậy mình tự nói là đi khám răng.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy thấy viền xanh', time: '10:30',
        scene: [
          ['duy', 'Em thấy LinkedIn của Phát chưa? Viền xanh! Ở công ty anh! Công ty headhunt bị headhunt!'],
          ['duy', 'Em giúp anh "headhunt ngược" Phát. Dò xem bên kia trả bao nhiêu. Em thân với Phát mà.'],
          { c: 'hr_ph_duy', o: [
            { t: '"Em không dò bạn mình được. Nhưng em giúp anh làm đề nghị giữ chân thật: hợp đồng và lương đúng thị trường."', fx: { uy: 3, rel: { duy: 1, phat: 1 }, set: { retention_plan: true } }, then: [
              ['duy', 'Hợp đồng… và lương thị trường. Anh tư vấn đúng câu này cho khách tuần trước. Ừ. Làm đi.'],
            ] },
            { t: 'Đồng ý dò hộ anh Duy.', fx: { dr: 4, rel: { duy: 2, phat: -3 }, set: { spy_phat: true } }, then: [
              ['duy', 'Tuyệt! Em là người của anh!'],
              ['think', '"Người của anh". Mình vừa được tuyển làm gián điệp nội bộ, không phụ cấp thêm.'],
            ] },
            { t: '"Anh hỏi thẳng Phát đi ạ."', fx: { uy: 1, rel: { duy: -1 } }, then: [
              ['duy', 'Hỏi thẳng… à. Ừ. Cách đó anh chưa thử.'],
            ] },
          ] },
        ],
      },
      {
        who: 'my', obj: 'Chị My có số liệu', time: '13:30',
        scene: [
          ['my', 'Phát á? Chị biết lương Phát từ ngày đầu. Dưới P25 của consultant. Không ai hỏi chị. Chị cũng không được kể.'],
          ['my', 'Bên Săn Đầu Pro chắc trả P50. Không cần cao. Chỉ cần đúng.'],
          { c: 'hr_ph_my', o: [
            { t: 'Nhờ chị My làm bảng so sánh lương thị trường cho vị trí của Phát, gửi anh Duy.', fx: { uy: 2, rel: { my: 2 }, set: { retention_plan: true, my_data: true } }, then: [
              ['my', 'Lần đầu chị làm khảo sát lương cho chính công ty mình. Mẫu: một người. Độ tin cậy: tuyệt đối.'],
            ] },
            { t: 'Hỏi chị My vì sao chị không đi.', fx: { rel: { my: 2 } }, then: [
              ['my', 'Vì chị thích số liệu ở đây. Và vì chị cũng đang bật viền xanh. Chế độ ẩn. Đùa đấy… một nửa.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:hanh', obj: 'Số lạ đang gọi Teams', time: '16:00',
        call: { title: 'Số lạ · "Săn Đầu Pro xin nghe"', people: ['hanh', 'me'] },
        scene: [
          ['hanh', 'Chào em, chị Hạnh bên Săn Đầu Pro. Em là {ten} bên Đúng Chỗ hả? Chị nghe kể về em.'],
          { if: (s) => !!s.flags.tie_vy_hanh, then: [['hanh', 'Vy là em gái chị đấy. Nó khen em suốt.']] },
          ['hanh', 'Bên chị đang cần sourcer. Lương gấp đôi bây giờ. Có hợp đồng từ ngày đầu. Cơ hội này… không đến hai lần.'],
          ['think', 'Câu của anh Tuấn. Đối thủ dùng câu của anh Tuấn.'],
          { c: 'hr_ph_hanh', o: [
            { t: 'Từ chối lịch sự, giữ liên lạc.', fx: { uy: 2, set: { hanh_declined: true } }, then: [
              ['hanh', 'Ok em. Chị lưu số. Ngành này nhỏ, mình còn gặp.'],
            ] },
            { t: 'Nghe hết, hỏi thêm về onboarding bên chị.', fx: { dr: 2, set: { hanh_listened: true } }, then: [
              ['hanh', 'Onboarding bên chị: ngày đầu ký hợp đồng, có laptop, có JD. Nghe lạ không?'],
              ['think', 'Nghe lạ thật. Nghe như một công ty nhân sự.'],
            ] },
            { t: 'Hỏi chị Hạnh có đang tuyển Phát không.', fx: { dr: 2 }, then: [
              ['hanh', 'Chị không bàn về ứng viên. Nhưng nếu một bạn tên Phát đi "khám răng" chiều nay, thì răng bạn ấy rất ổn.'],
            ] },
          ] },
        ],
      },
      {
        who: 'phat', obj: 'Phát quay về từ "khám răng"', time: '17:00',
        scene: [
          { if: (s) => !!s.flags.retention_plan, then: [
            ['phat', 'Anh Duy gọi mình vào. Đưa hợp đồng lao động. Có chữ ký. Lương lên đúng mức thị trường. Kèm cả bảng của chị My.'],
            ['phat', 'Mình ở lại. Không phải vì tiền. Vì lần đầu tiên ở đây có người làm đúng cái nghề mình làm cho người khác.'],
            { fx: { rel: { phat: 2 }, set: { phat_stay: true } } },
          ], else: [
            ['phat', 'Mình nhận offer bên Săn Đầu Pro rồi. Có hợp đồng từ ngày đầu. Bàn của mình… để lại cho ai cần.'],
            { if: (s) => !!s.flags.spy_phat, then: [['phat', 'Anh Duy hỏi mình lương bên kia, đúng con số mình chỉ nói với bạn. Mình hiểu rồi.']] },
            { fx: { set: { phat_left: true } } },
          ] },
          { if: (s) => !!s.flags.lent_phat, then: [['phat', 'À, hai trăm nghìn. Trả bạn. Thứ Sáu thật.'], { fx: { money: 200_000 } }] },
          { c: '_hr_ph_end', o: [
            { t: 'Ôm Phát một cái.', fx: { nl: 2, rel: { phat: 1 } }, then: [['phat', 'Ê, đừng. Mình khóc là ATS khóc theo.']] },
            { t: 'Giúp Phát sắp lại cái ATS 14.000 dòng.', fx: { uy: 1, nl: -4 }, then: [
              ['phat', 'Đừng sort cột nào. Mình nói lần cuối. …Hoặc chưa phải lần cuối.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.phat_stay
      ? 'Phát bật viền xanh. Rồi Phát có hợp đồng lao động, sau sáu tháng. Công ty nhân sự vừa giữ chân được nhân viên đầu tiên của chính mình.'
      : 'Phát bật viền xanh. Rồi Phát đi. Công ty headhunt bị headhunt. Bàn của Phát trống, cạnh tấm standee "WE ARE HIRING".'),
  },
];

// ---------------- official-only arc (after promotion) ----------------
export const OFFICIAL_EPISODES = [
  {
    id: 'off_day1', official: true, title: 'Chính thức (theo bài LinkedIn)',
    intro: 'Ngày đầu làm nhân viên chính thức. Anh Duy đăng bài lúc 5:30: "Từ intern thành người nhà 💜".\n\nBài có 2.300 like. Hợp đồng lao động của bạn thì đang nằm trong khay máy in.',
    steps: [
      {
        who: 'thao', obj: 'Ký hợp đồng lao động với chị Thảo', time: '08:30',
        scene: [
          ['thao', 'Chúc mừng em! Hợp đồng lao động đây. Lần này có chữ ký anh Duy. Chị đứng cạnh lúc anh ấy ký.'],
          ['thao', 'Từ tháng này công ty đóng bảo hiểm cho em. Phần em đóng khoảng 10,5% lương: hưu trí, y tế, thất nghiệp.'],
          ['thao', 'Lương mười triệu, trừ bảo hiểm còn khoảng tám triệu chín trăm năm mươi. Thuế thì chưa tới mức phải nộp. (thông tin giải trí, không phải tư vấn pháp lý)'],
          { c: 'hr_o1_contract', o: [
            { t: 'Đọc kỹ từng điều trước khi ký.', fx: { uy: 2, nl: -3, set: { off_read: true } }, then: [
              ['nar', 'Điều 7: "KPI 3 placement/tháng. Hoa hồng tính sau khi ứng viên qua 60 ngày bảo hành." Điều 8: "Các việc khác".'],
              ['think', '"Các việc khác" lại có mặt. Như một người bạn cũ.'],
            ] },
            { t: 'Ký luôn, cười tươi cho chị Thảo chụp ảnh gửi anh Duy.', fx: { rel: { duy: 1, thao: 1 } }, then: [
              ['nar', 'Ảnh lên LinkedIn lúc 9:02. Caption: "Chúng tôi giữ lời hứa 💜". Phát comment: "😐".'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân bàn giao KPI', time: '09:30',
        scene: [
          ['ngan', 'Chúc mừng. Giờ em không còn là intern. Nghĩa là không ai tha lỗi cho em vì là intern nữa.'],
          ['ngan', 'KPI: ba placement mỗi tháng. Hoa hồng tính sau bảo hành sáu mươi ngày. Tức là tháng thứ ba em mới thấy tiền.'],
          { c: 'hr_o1_ngan', o: [
            { t: '"Chị vẫn review cho em chứ ạ?"', fx: { rel: { ngan: 2 } }, then: [
              ['ngan', 'Có. Nhưng giờ chị review như review đối thủ. Kỹ hơn.'],
            ] },
            { t: '"Em sẽ đạt ba placement ngay tháng đầu."', fx: { dr: 2, rel: { duy: 1 }, set: { off_overpromise: true } }, then: [
              ['ngan', 'Ba placement tháng đầu. Năm thứ năm chị còn chưa làm được. Chị sẽ nhớ câu này.'],
            ] },
          ] },
        ],
      },
      {
        who: 'quan', obj: 'Quân đứng chờ ở bàn bạn', time: '11:00',
        scene: [
          ['quan', 'Chúc mừng bạn. Thật đấy. …Nhà mình kể với cả họ là mình sẽ lên chính thức. Giờ mình phải kể lại.'],
          { c: 'hr_o1_quan', o: [
            { t: 'Giúp Quân viết lại CV, tự tay, không AI, để nộp chỗ khác.', fx: { nl: -5, rel: { quan: 3 } }, then: [
              ['quan', 'CV tự viết. Ừ. Đọc thật hơn. Dòng đầu không còn "Dưới đây là". Cảm ơn bạn.'],
            ] },
            { t: '"Ở đây lên chính thức chưa chắc đã là thắng đâu."', fx: { dr: 1, rel: { quan: 1 } }, then: [
              ['quan', 'Bạn nói câu đó lúc vừa ký hợp đồng. Mình sẽ nhớ để kiểm chứng.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy có "vài việc nhỏ"', time: '16:00',
        scene: [
          ['duy', 'Giờ em là người nhà chính thức rồi. Từ tuần này em kiêm viết LinkedIn cho anh nhé. Mỗi sáng một bài.'],
          ['duy', 'Và onboarding cho intern mới. Em viết JD rồi mà. Em là người phù hợp nhất!'],
          { c: 'hr_o1_duy', o: [
            { t: '"Em nhận onboarding. LinkedIn thì anh tự viết nhé ạ."', fx: { uy: 2, rel: { duy: -1 }, set: { off_boundary: true } }, then: [
              ['duy', 'Ok… anh viết. Nhưng em sửa chính tả.'],
            ] },
            { t: 'Nhận cả hai.', fx: { nl: -8, rel: { duy: 2 }, set: { off_yes_man: true } }, then: [
              ['think', 'Lương chính thức: mười triệu. Việc chính thức: "mọi việc liên quan và các việc khác".'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày đầu chính thức. Hợp đồng có đủ hai chữ ký. ${s.flags.off_boundary ? 'Mình nhận onboarding, trả lại LinkedIn.' : 'Mình nhận thêm LinkedIn và onboarding.'} Lương mười triệu, hoa hồng sau sáu mươi ngày. Sáu mươi ngày là xa.`,
  },
  {
    id: 'off_inherit', official: true, title: 'Thừa kế bốn mươi ứng viên',
    intro: 'Tuần thứ hai làm chính thức. Bạn được giao "chăm" bốn mươi ứng viên của Hiền, consultant đã nghỉ, nằm trong một tab tên "chăm sau".\n\nFile ghi chú cuối cùng của Hiền chỉ có một dòng: "Chăm tiếp nhé. Đừng sort."',
    steps: [
      {
        who: 'ngan', obj: 'Chị Ngân giao tab "chăm sau"', time: '08:30',
        scene: [
          ['ngan', 'Bốn mươi ứng viên. Không ai biết ai đang ở vòng nào. Ba người đã đi làm chỗ khác. Hai người đã đổi số.'],
          ['ngan', 'Một người vẫn nhắn mỗi thứ Hai: "Chị ơi bên kia có tin chưa ạ?" Từ tháng Ba.'],
          { c: 'hr_o2_triage', o: [
            { t: 'Gọi từng người, xin lỗi, cập nhật trạng thái thật.', fx: { uy: 3, nl: -10, rel: { ngan: 1 }, set: { off_cleaned: true } }, then: [
              ['nar', 'Bốn mươi cuộc gọi. Mười hai người cảm ơn vì cuối cùng có người gọi lại. Một người mời bạn đi cà phê vì quá xúc động.'],
            ] },
            { t: 'Gửi email hàng loạt: "Hồ sơ của anh/chị đang được xem xét".', fx: { dr: 3, nl: -2 }, then: [
              ['nar', 'Email đi lúc 9:00. 9:04, người nhắn mỗi thứ Hai trả lời: "Em xem xét từ tháng Ba rồi ạ."'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:tai', obj: 'Ông Tài gọi về "bảo hành"', time: '10:30',
        call: { title: 'Ông Tài (Phú Quý) · "Bảo hành"', people: ['tai', 'bach', 'me'] },
        scene: [
          ['tai', 'Cái cậu giám sát kho bên em giới thiệu nghỉ hôm qua. Ngày thứ sáu mươi mốt. Bên em thay người miễn phí nhé.'],
          ['bach', '(nhắn riêng) hợp đồng ghi 60 ngày. nhưng ông ấy là khách lớn…'],
          { c: 'hr_o2_warranty', o: [
            { t: 'Giữ hợp đồng: bảo hành sáu mươi ngày đã hết, đề nghị giảm phí ca tiếp theo.', fx: { uy: 3, rel: { tai: -1 }, set: { off_discount: true } }, then: [
              ['tai', 'Ngày sáu mươi mốt mà em tính chi li vậy. …Thôi được, giảm ba mươi phần trăm ca sau.'],
            ] },
            { t: 'Thay người miễn phí "vì quan hệ".', fx: { nl: -15, rel: { tai: 2, bach: 1 } }, then: [
              ['think', 'Một job không có tiền, cộng với ba placement KPI. Toán học của tình cảm.'],
            ] },
          ] },
        ],
      },
      {
        who: 'tuan', obj: 'Anh Tuấn rủ ra pantry', time: '13:30',
        scene: [
          ['tuan', 'Chính thức rồi hả. Giờ em là đối thủ của anh. Đùa đấy. Một nửa.'],
          ['tuan', 'Nói em nghe bí mật: cái xe anh hay khoe là xe thuê theo tháng. Tháng nào không có placement thì anh đi xe buýt.'],
          ['tuan', 'Nghề này tháng ăn lẩu, tháng ăn mì. Hoa hồng không phải lương. Đừng tiêu trước.'],
          { c: 'hr_o2_tuan', o: [
            { t: 'Hỏi anh Tuấn vì sao vẫn ở lại nghề.', fx: { rel: { tuan: 2 } }, then: [
              ['tuan', 'Vì có ngày một ứng viên gọi lại khóc: "Em đi làm được một năm rồi anh ạ, cảm ơn anh." Một cuộc như thế đủ ba tháng mì.'],
            ] },
            { t: 'Hỏi mẹo chốt placement nhanh.', fx: { uy: 1, rel: { tuan: 1 } }, then: [
              ['tuan', 'Không có mẹo. Gọi nhiều. Hứa ít. Nghe kỹ. Cơ hội… thôi anh không nói câu đó với em nữa.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy hỏi số placement', time: '16:00',
        scene: [
          ['duy', 'Tháng này em chưa có placement nào. Mình cần nhìn lại mindset.'],
          { if: (s) => !!s.flags.off_overpromise, then: [['ngan', '(đi ngang qua) Ba placement tháng đầu. Chị nhớ mà.']] },
          { c: 'hr_o2_duy', o: [
            { t: 'Đưa anh xem pipeline: bao nhiêu người ở vòng nào, dự kiến khi nào offer.', fx: { uy: 3, rel: { duy: 1, ngan: 1 } }, then: [
              ['duy', 'Pipeline đẹp. Đẹp hơn cả pipeline thật của anh. Ok, anh chờ.'],
            ] },
            { t: '"Anh ơi, KPI ba placement trong tháng đầu có hợp lý không ạ?"', fx: { uy: 1, dr: 3, rel: { duy: -2 }, set: { off_pushback: true } }, then: [
              ['duy', 'Em làm nghề nhân sự mà hỏi KPI có hợp lý không? …Câu hỏi hay. Anh không trả lời được.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Tuần hai chính thức. Bốn mươi ứng viên thừa kế, một khách đòi bảo hành ngày sáu mươi mốt, và một bí mật: xe của anh Tuấn là xe thuê. ${s.flags.off_cleaned ? 'Mình gọi lại cho cả bốn mươi người.' : ''}`,
  },
  {
    id: 'off_ai', official: true, title: 'CVinator 3000',
    intro: 'Anh Duy đi hội thảo "AI trong tuyển dụng" về. Trên bàn anh có một hộp quà: phần mềm CVinator 3000.\n\nTrên hộp in: "Thay thế 80% công việc sàng lọc". Anh Duy nhìn về phía bàn bạn. Rất lâu.',
    steps: [
      {
        who: 'duy', obj: 'Anh Duy demo CVinator 3000', time: '08:30',
        scene: [
          ['duy', 'Xem này! Một nghìn CV, ba giây, xếp hạng xong! Em sourcing một ngày được bao nhiêu?'],
          ['me', 'Dạ, khoảng ba mươi CV đọc kỹ ạ.'],
          ['duy', 'Ba mươi. Ba giây. Em thấy chưa? Giờ em giúp anh "dạy" nó. Đưa nó các shortlist cũ của công ty để nó học.'],
          { c: 'hr_o3_train', o: [
            { t: 'Đồng ý, nhưng xin kiểm tra xem nó học được gì trước khi dùng cho khách.', fx: { uy: 2, rel: { duy: 1 }, set: { ai_audit: true } }, then: [
              ['duy', 'Kiểm tra? Ok, nhanh thôi nhé. Máy thì có gì sai được.'],
            ] },
            { t: '"Anh ơi, có nó rồi thì team sourcing làm gì ạ?"', fx: { dr: 2, rel: { duy: -1 } }, then: [
              ['duy', 'Làm việc có giá trị cao hơn! …Anh chưa nghĩ ra là việc gì. Nhưng chắc chắn có.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn kiểm tra CVinator học được gì', time: '10:30',
        scene: [
          ['nar', 'Bạn mở trang "Quy tắc tự học" của CVinator. Nó đã đọc mười bốn nghìn dòng ATS và năm năm shortlist của công ty.'],
          { mini: AI_MINI,
            good: [['think', 'Nó học đúng những gì công ty từng làm. Kể cả những thứ không ai dám ghi ra văn bản.'], { fx: { uy: 3, set: { ai_bias_found: true } } }],
            bad: [['think', 'Nhìn qua thì quy tắc nào cũng hợp lý. Đó chính là chỗ đáng sợ.'], { fx: { nl: -3 } }],
          },
          { if: (s) => !!s.flags.jd_pushback, then: [['think', 'Giống hệt bản JD Đất Vàng ngày nào. Chỉ là giờ nó chạy ba giây một nghìn người.']] },
        ],
      },
      {
        who: 'my', obj: 'Chị My phát hiện thêm một điều', time: '14:00',
        scene: [
          ['my', 'Em xem này. CVinator còn có tính năng "đề xuất mức offer". Nó học từ dữ liệu lương cũ.'],
          ['my', 'Dữ liệu cũ trả nữ thấp hơn nam cùng vị trí. Nên giờ nó đề xuất offer cho nữ thấp hơn. Rất tự tin. Có biểu đồ.'],
          { c: 'hr_o3_my', o: [
            { t: 'Cùng chị My viết báo cáo rủi ro, gửi anh Duy trước khi bán cho khách.', fx: { uy: 4, dr: 2, rel: { my: 2, duy: -1 }, set: { ai_flagged: true } }, then: [
              ['my', 'Mười ba trang. Kèm ví dụ. Chị đặt tên file "Tại sao không nên bán thứ này (chưa sửa)".'],
            ] },
            { t: 'Tắt tính năng đó đi, không nói ai.', fx: { dr: 1, set: { ai_quiet_fix: true } }, then: [
              ['my', 'Tắt được hôm nay. Bản cập nhật tuần sau nó tự bật lại. Chị đọc điều khoản rồi.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy nói về "tối ưu"', time: '16:30',
        scene: [
          ['duy', 'Có CVinator rồi, mình không cần nhiều người sourcing nữa. Anh đang tính… "tối ưu cơ cấu".'],
          { if: (s) => !!s.flags.ai_flagged, then: [['duy', 'Báo cáo mười ba trang của em với My anh đọc rồi. Anh… sẽ không bán nó cho khách. Nhưng nội bộ vẫn dùng.']] },
          { c: 'hr_o3_duy', o: [
            { t: 'Nói rõ: máy sàng nhanh, nhưng người mới biết ai đáng gọi lại. Đưa số liệu.', fx: { uy: 3, rel: { duy: 1 } }, then: [
              ['duy', 'Em nói đúng. Nhưng em nói với người đang nhìn bảng chi phí. Anh nghe, nhưng anh không hứa.'],
            ] },
            { t: 'Hỏi thẳng: "Em có nằm trong phần được tối ưu không ạ?"', fx: { dr: 3, rel: { duy: -1 }, set: { asked_layoff: true } }, then: [
              ['duy', '…Anh chưa quyết. Em hỏi thẳng quá. Đúng chất người anh tuyển.'],
            ] },
            { t: 'Xin phụ trách vận hành CVinator.', fx: { uy: 1, nl: -5, rel: { duy: 2 }, set: { ai_owner: true } }, then: [
              ['think', 'Mình vừa nhận việc dạy cái máy sẽ thay mình. Một kiểu onboarding mới.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.ai_bias_found
      ? 'CVinator 3000 học từ năm năm shortlist của công ty và học luôn những định kiến không ai ghi ra văn bản. Anh Duy nói "tối ưu cơ cấu". Mình nghe ra tên mình trong đó.'
      : 'CVinator 3000 sàng một nghìn CV trong ba giây. Mình sàng ba mươi trong một ngày. Anh Duy nói "tối ưu cơ cấu".'),
  },
  {
    id: 'off_restructure', official: true, end: (r) => (r.flags.layoff_jump ? 'quit' : 'layoff'), noReview: true, title: 'Tái cấu trúc "vì con người"',
    intro: 'Thị trường đóng băng: ứng viên chờ thưởng Tết, khách cắt ngân sách tuyển, hai khách lớn chưa trả phí.\n\nAnh Duy hẹn bạn 1:1 ở Talent Room. Trên bàn có một hộp khăn giấy. Hộp khăn giấy chưa bao giờ có trên bàn đó.',
    steps: [
      {
        who: 'thao', obj: 'Chị Thảo gọi nhỏ ở quầy', time: '08:30',
        scene: [
          ['thao', 'Em… chị không được nói. Nhưng tuần trước anh Duy nhờ chị tính "chi phí nếu cho một vị trí nghỉ". Vị trí sourcing.'],
          ['thao', 'Em làm chính thức chưa đủ mười hai tháng nên không có trợ cấp mất việc. Nhưng phải được báo trước và trả đủ lương ngày đã làm. (thông tin giải trí, không phải tư vấn pháp lý)'],
          { c: 'hr_o4_thao', o: [
            { t: 'Cảm ơn chị, ghi lại các mốc: ngày ký hợp đồng, ngày bảo hiểm, số ngày phép.', fx: { uy: 2, rel: { thao: 2 }, set: { off_prepared: true } }, then: [
              ['thao', 'Em giống chị. Cái gì cũng ghi sổ. Ở công ty này, cuốn sổ là người bạn duy nhất không ghost mình.'],
            ] },
            { t: '"Chị ơi, chị có ổn không?"', fx: { rel: { thao: 3 } }, then: [
              ['thao', 'Chị là kế toán, lễ tân, HR nội bộ. Giờ chị là người tính tiền cho người khác nghỉ. Chị… ổn. Theo kiểu Excel.'],
            ] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Vào Talent Room: 1:1 với anh Duy', time: '10:00', pos: { duy: 'meeting_head', ngan: 'mr_n1' },
        scene: [
          ['duy', 'Em ngồi đi. Anh… đã viết bài này trong đầu ba lần. Lần nào cũng nghe giống cái email năm 2019 anh từng nhận.'],
          ['duy', 'Công ty tái cấu trúc. Mảng sourcing chuyển sang CVinator. Vị trí của em… không còn phù hợp với chiến lược mới.'],
          ['ngan', 'Chị ngồi đây vì chị yêu cầu được ngồi. Không phải vì chị đồng ý.'],
          ['think', 'Vị trí của mình. Vị trí mà mình tự viết JD.'],
          { c: 'hr_o4_layoff', o: [
            { t: 'Đề nghị bằng văn bản: thông báo trước đúng luật, trả đủ lương, chốt bảo hiểm, thư giới thiệu.', fx: { uy: 4, rel: { ngan: 2 }, set: { layoff_proper: true } }, then: [
              ['duy', 'Văn bản. Đúng. Em làm đúng cái anh dạy khách. Anh ký hết.'],
              ['ngan', 'Thư giới thiệu chị viết. Chị viết thật.'],
            ] },
            { t: 'Nhắc anh câu của chị Trinh: "Đối xử với người khác tốt hơn họ đối xử với anh."', when: (s) => !!(s.flags.trinh_fair || s.flags.duy_nudged || s.flags.ex_insight), fx: { uy: 3, rel: { duy: 2 }, set: { layoff_kind: true } }, then: [
              ['nar', 'Anh Duy im rất lâu. Rồi rút hộp khăn giấy về phía mình.'],
              ['duy', 'Anh sẽ trả thêm cho em một tháng lương, dù luật không bắt. Và anh tự viết thư giới thiệu. Không đăng LinkedIn.'],
            ] },
            { t: '"Em đã định nộp đơn, anh ạ. Bên Săn Đầu Pro mời em từ tháng trước."', when: (s) => !!(s.flags.hanh_declined || s.flags.hanh_listened), fx: { dr: 3, rel: { duy: -1 }, set: { layoff_jump: true } }, then: [
              ['duy', '…Vậy anh vừa cho nghỉ một người đã định nghỉ. Hiệu quả. Anh ghét chữ đó.'],
              ['ngan', '(nhỏ) Chị Hạnh tuyển được người tốt.'],
            ] },
            { t: 'Gật đầu, ký, không hỏi gì.', fx: { nl: -10, set: { layoff_silent: true } }, then: [
              ['duy', 'Cảm ơn em đã… hiểu. Anh xin lỗi.'],
              ['think', 'Mình hiểu. Mình chỉ không đồng ý.'],
            ] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân đợi ở bàn', time: '14:00',
        scene: [
          ['ngan', 'Em biết tài liệu onboarding mười một trang chị viết năm ngoái không? Chị in ra rồi. Ký tên. Tặng em.'],
          ['ngan', 'Ở chỗ mới, em sẽ là người duy nhất có onboarding. Đừng cho ai mượn.'],
          { if: (s) => !!s.flags.wrote_own_jd, then: [['ngan', 'Và JD em viết cho vị trí của em, chị giữ lại. Lần sau công ty tuyển, họ sẽ dùng nó. Tên em ở cuối.']] },
          { c: 'hr_o4_ngan', o: [
            { t: '"Chị có định ở lại không ạ?"', fx: { rel: { ngan: 2 } }, then: [
              ['ngan', 'Chị ở thêm một năm. Có người phải giữ cho cái nghề này còn tử tế ở đây. Rồi chị tính.'],
            ] },
            { t: 'Cảm ơn chị. Thật lòng.', fx: { rel: { ngan: 2 }, nl: 3 }, then: [
              ['ngan', 'Không có gì. Chị review em lần cuối: A. Đừng kể ai chị cho A.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn thu dọn đồ', time: '17:00',
        scene: [
          ['nar', 'Một thùng carton. Một cái cốc. Ba tờ sticky note. Laptop trả lại chị Thảo, vẫn dán "Culture@123" dưới đáy.'],
          ['kpi', 'Meo.'],
          ['nar', 'Mèo Ghost ngồi trên bàn bạn. Lần đầu tiên nó xuất hiện đúng lúc.'],
          { c: 'hr_o4_note', o: [
            { t: 'Dán thêm một dòng dưới đáy laptop cho intern sau: "Hỏi JD trước khi ký."', fx: { uy: 2, set: { left_note: true } }, then: [
              ['nar', 'Dưới đáy laptop giờ có hai dòng: "Chúc bạn may mắn hơn mình." và "Hỏi JD trước khi ký."'],
            ] },
            { t: 'Chụp một tấm ảnh với Mèo Ghost.', fx: { nl: 5 }, then: [
              ['nar', 'Ảnh mờ. Con mèo đã biến mất ở khung hình thứ hai. Đúng là nó.'],
            ] },
          ] },
        ],
      },
    ],
    diary: () => 'Ngày cuối. Một công ty tư vấn nhân sự vừa cho mình nghỉ, đúng quy trình mà mình từng giúp viết.',
  },
];
