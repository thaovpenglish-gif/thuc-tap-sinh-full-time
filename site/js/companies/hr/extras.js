// Người Đúng Chỗ HR — weekly review lines, the promotion path, endings, pantry food, life events, object lines, ties.

// Said by the manager (chị Ngân) on Friday.
export const REVIEW = {
  A: [
    'Tuần này em gửi ít CV, nhưng CV nào cũng được mời phỏng vấn. Chị không quen khen. Đây là chị đang khen.',
    'Ứng viên em giới thiệu còn gọi lại cảm ơn. Trong nghề này, đó là hiện tượng thiên văn.',
    'Em hỏi đúng câu, đúng lúc, đúng người. Ba cái "đúng". Em hợp với tên công ty hơn cả công ty.',
    'Chị không có gì để sửa đỏ. Chị hơi buồn. Nhưng tốt.',
    'Khách khen em lễ phép. Khách vẫn đòi giảm phí, nhưng lần này họ đòi nhẹ nhàng hơn.',
    'Em làm việc như người có JD. Mà em chưa có JD. Ấn tượng.',
  ],
  B: [
    'Ổn. Pipeline gọn gàng. Gọn hơn cả pipeline thật.',
    'Em có năng khiếu nói chuyện với ứng viên. Giờ học thêm cách để họ nhận offer.',
    'Không có gì sai. Chị sẽ tìm. Chị luôn tìm ra.',
    'Em làm đúng việc. Tuần sau làm đúng việc nhanh hơn một chút.',
    'Anh Duy bảo em có growth mindset. Chị bảo em có deadline. Cả hai đều đúng.',
  ],
  C: [
    'Em gửi sáu mươi CV, khách mời không người nào. Số lượng tốt. Chất lượng… em có thấy không?',
    'Em rất tận tâm, ứng viên còn mời em đi đám cưới. Nhưng họ không nhận offer.',
    'Tuần này chị thấy em bận. Chị chưa thấy em xong.',
    'Em cẩn thận quá. Khách cần đúng người, không cần đúng phông chữ.',
    'Đừng khuyên ứng viên ở lại công ty cũ nữa. Dù em nói đúng.',
  ],
  D: [
    'Một ứng viên chờ em gọi lại từ thứ Ba. Anh ấy nhận việc rồi. Qua bên đối thủ.',
    'Chị hỏi thật, không phải câu tu từ: em có muốn làm nghề này không?',
    'Ứng viên ghost em thì chị hiểu. Em ghost chị thì chị không hiểu.',
    'Chị sẽ ghi nhận tuần này. Theo nghĩa xấu.',
    'Em nhìn KPI như nhìn bảng tuần hoàn. Biết là có, không biết để làm gì.',
  ],
};

// The ONE way to become official: two A reviews, high reputation, a strong bond with chị Ngân, the JD you wrote for
// yourself (culture workshop or chị Ngân's follow-up), pushing back on the discriminatory JD, and not covering the leak.
export const PROMOTION = {
  salary: 10_000_000,
  when: (r) => r.day >= 19
    && (r.reviews || []).filter((x) => x.grade === 'A').length >= 2
    && r.st.uy >= 65
    && (r.rel.ngan || 0) >= 6
    && !!r.flags.wrote_own_jd
    && !!r.flags.jd_pushback
    && !(r.flags.leak_covered && !r.flags.leak_reported),
  offer: [
    ['ngan', 'Em có năm phút không. Vào Talent Room. Không phải chuyện xấu. Chị nói trước để em khỏi tim đập.'],
    ['duy', '{ten}! Còn nhớ cái JD em viết cho chính em không? Tối qua anh đọc lại. Anh nhận ra công ty đang tuyển đúng người đó.'],
    ['ngan', 'Chính thức. Consultant. Mười triệu lương cứng, hoa hồng sau bảo hành. Hợp đồng lao động thật, có bảo hiểm.'],
    ['duy', 'Từ tháng đầu! Anh hứa… à không, Ngân hứa.'],
    ['think', 'Lần đầu tiên ở đây, một lời hứa có người đứng ra bảo lãnh.'],
    { c: '_hr_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, set: { accept_official: true } }, then: [
        ['ngan', 'Tốt. Từ thứ Hai em không còn là intern. Nghĩa là KPI của em có tiền bên cạnh. Và có tên em bên cạnh.'],
      ] },
      { t: '"Em nhận, khi hợp đồng có đủ hai chữ ký trên bàn ạ."', fx: { uy: 6, rel: { ngan: 2 }, set: { accept_official: true, signed_first: true } }, then: [
        ['duy', '…Đúng. Đúng là phải thế. Anh ký ngay. Thảo ơi, in hợp đồng!'],
        ['thao', '(vọng vào) In rồi! Chị in từ hôm qua! Chị biết em sẽ hỏi!'],
      ] },
      { t: '"Em xin phép không nhận ạ."', fx: { set: { accept_official: false } }, then: [
        ['ngan', 'Chị hiểu. Thật đấy. Có khi em là người khôn nhất phòng này.'],
        ['duy', 'Cửa luôn mở! …Theo nghĩa bóng. Cửa thật thì phải gọi chị Thảo.'],
      ] },
    ] },
  ],
  arc: ['off_day1', 'off_inherit', 'off_ai', 'off_restructure'],
};

export const ENDINGS = {
  finish: (r) => {
    const f = r.flags || {}, rel = r.rel || {}, st = r.st || {};
    if (f.promo_offered && f.accept_official === false) return {
      title: 'Bạn từ chối lên chính thức',
      text: 'Ngày cuối, chị Ngân đưa bạn giấy xác nhận thực tập và một câu: "Em là người đầu tiên từ chối offer của công ty nhân sự này. Ghi vào CV đi, nghe ngầu đấy."',
    };
    if ((rel.ngan || 0) >= 6) return {
      title: 'Hết 45 ngày ở Người Đúng Chỗ HR',
      text: `Chị Ngân viết thư giới thiệu, ký tay: "Biết hỏi câu khó, và hỏi đúng người." ${f.wrote_own_jd ? 'JD intern bạn viết vẫn được dùng cho đợt sau, tên bạn ở cuối trang.' : 'Anh Duy đăng một bài LinkedIn chia tay bạn. 2.000 like. Bạn được tag sai tên.'}`,
    };
    if ((st.uy || 0) >= 60) return {
      title: 'Hết 45 ngày ở Người Đúng Chỗ HR',
      text: 'Chị Thảo gửi giấy xác nhận thực tập. Bên A ghi đúng tên công ty. Lần đầu tiên. Bạn chụp ảnh lại làm bằng chứng.',
    };
    return {
      title: 'Hết 45 ngày ở Người Đúng Chỗ HR',
      text: 'Giấy xác nhận thực tập gửi qua email, tên bạn bị gõ thành "Thực Tập Sinh 2". Mèo Ghost không ra tiễn. Đúng như tên.',
    };
  },
  quit: (r) => ((r && r.flags && r.flags.layoff_jump) ? {
    title: 'Nghỉ trước khi bị cho nghỉ',
    text: 'Thứ Hai tuần sau, bạn ký hợp đồng với Săn Đầu Pro. Ngày đầu tiên: có laptop, có JD, có hợp đồng. Bạn suýt khóc vì một quy trình onboarding bình thường.',
  } : {
    title: 'Bạn nghỉ việc ở Người Đúng Chỗ HR',
    text: 'Bạn gửi email nghỉ việc lúc 17:59. 18:00 anh Duy đăng bài: "Mỗi cuộc chia tay là một bài học về retention 💜". Bạn được tag.',
  }),
  layoff: (r) => {
    const f = (r && r.flags) || {};
    if (f.layoff_kind) return {
      title: 'Bị cho nghỉ, nhưng tử tế',
      text: 'Anh Duy trả thêm một tháng lương dù luật không bắt, và tự viết thư giới thiệu. Không đăng LinkedIn. Lần đầu tiên, anh ấy làm đúng điều chị Trinh từng nói.',
    };
    if (f.layoff_jump) return {
      title: 'Nghỉ trước khi bị cho nghỉ',
      text: 'Thứ Hai tuần sau, bạn ký hợp đồng với Săn Đầu Pro. Ngày đầu tiên: có laptop, có JD, có hợp đồng. Bạn suýt khóc vì một quy trình onboarding bình thường.',
    };
    if (f.layoff_proper) return {
      title: 'Tái cấu trúc "vì con người"',
      text: 'Mọi thứ có văn bản: báo trước, lương đủ, bảo hiểm chốt, thư giới thiệu của chị Ngân. Chưa đủ mười hai tháng nên không có trợ cấp. Nhưng bạn ra đi với một tập giấy tờ đầy đủ nhất lịch sử công ty.',
    };
    return {
      title: 'Bạn bị cho thôi việc',
      text: 'Vị trí sourcing được thay bằng CVinator 3000. Bạn ký, không hỏi gì. Tối đó CVinator xếp hạng CV của bạn: "Phù hợp 92%". Cho chính vị trí bạn vừa mất.',
    };
  },
};

// Extra pantry option (max 1).
export const FOOD = [
  { t: 'Ăn bánh ứng viên tặng (miễn phí, +15, nghe anh Tuấn kể chuyện 15 phút)', fx: { nl: 15, clock: 15 }, then: [
    ['tuan', 'Hộp này của một ứng viên anh đặt năm ngoái. Năm nay anh ấy gửi tiếp. Đó gọi là retention. Ăn đi, anh kể cho nghe ca CFO năm đó…'],
  ] },
];

// Company-flavoured after-work events (same shape as game/career.js LIFE_EVENTS).
export const LIFE_EVENTS = [
  { id: 'hr_candidate_night', emoji: '📱', text: '21:47, một ứng viên nhắn: "Chị ơi bên kia có tin gì chưa ạ? Em hồi hộp không ngủ được."', choices: [
    { t: 'Trả lời ngay, động viên', fx: { nl: -5, uy: 1 }, after: 'Ứng viên gửi một sticker ôm. Bạn ngủ lúc 23:30, cũng hồi hộp theo.' },
    { t: 'Để sáng mai trả lời', fx: { nl: 3 }, after: 'Sáng ra có thêm bốn tin nhắn và một cuộc gọi nhỡ lúc 6:02.' },
  ] },
  { id: 'hr_friend_switch', emoji: '☕', text: 'Đi cà phê với bạn thân. Giữa chuyện, bạn nghe chính mình hỏi: "Dạo này cậu có muốn đổi việc không?"', fx: { dr: 1, money: -45_000 }, after: 'Bạn thân nhìn bạn như nhìn một headhunter. Bạn trả tiền nước để chuộc lỗi.' },
  { id: 'hr_linkedin_lock', emoji: '🔒', text: 'LinkedIn khóa tài khoản của bạn vì "gửi quá nhiều lời mời kết nối".', choices: [
    { t: 'Gửi ảnh Căn cước để xác minh', fx: { nl: -4 }, after: 'Tài khoản mở lại sau 48 giờ. 400 tab của Vy vẫn sống.' },
    { t: 'Lập tài khoản phụ, ảnh đại diện Mèo Ghost', fx: { dr: 2 }, after: 'Sau ba ngày, tài khoản phụ có nhiều kết nối hơn tài khoản chính.' },
  ] },
];

export const OBJ_LINES = {
  printer: [['nar', 'Máy in đang in dở một CV chín trang có ảnh cưới. Trang sáu kẹt giấy, đúng đoạn "Sở thích: du lịch cùng vợ".']],
  desk: [['nar', 'Bàn của bạn. Laptop "Culture@123", tờ note "ĐỪNG SORT ATS" của Vy, và một hộp bánh ứng viên đã hết.']],
  okr: [['nar', 'Bảng KPI: "40 CV/NGÀY". Góc dưới có ai viết bút chì: "Cả nước chỉ có 40 kỹ sư vi mạch N2."']],
  altar: [['nar', 'Bàn thờ Thần Tài. Trên đĩa có một tờ CV gấp gọn, như một lời cầu xin placement.'], { fx: { uy: 1 } }],
  safe: [['nar', 'Két sắt. Tờ giấy dán: "Phí khách chưa trả: xem sổ chị Thảo. Lương: xem lòng anh Duy."']],
  plant: [['nar', 'Chậu cây "Culture". Thẻ treo: "Phụ trách tưới: Culture Team". Culture Team là anh Khoa. Anh Khoa đi đào tạo.']],
  redchair: [['nar', 'Ghế nóng phỏng vấn. Người ngồi đây từng được hỏi "nếu là một con vật, em là con gì". Bạn cũng vậy.']],
  interview: [['nar', 'Talent Room: sáu thùng giấy in, một standee quay mặt vào tường, và bảng trắng ghi "Câu hỏi: em là con vật gì?".']],
};

// Hidden relationships: 2 are drawn per run → flags tie_<id> = true (read in a few scenes).
export const TIES = [
  { id: 'quan_duy', text: 'Quân gọi anh Duy bằng chú' },
  { id: 'tuan_thao', text: 'Anh Tuấn đang thầm thương chị Thảo' },
  { id: 'vy_hanh', text: 'Vy là em gái chị Hạnh bên Săn Đầu Pro' },
  { id: 'my_ngan', text: 'Chị My và chị Ngân là bạn thân từ đại học' },
];
