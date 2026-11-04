// Level 1 · Ngày 1 — Onboarding. Story beats (sequential) + side tasks spawned by modes/solo.js per salary tier.
// Speakers: keys of CAST (characters.js), plus 'me', 'think', 'nar'.

const isTier = (...ids) => (s) => ids.includes(s.tier);

export const STANDUP_MINI = {
  type: 'order', title: 'Daily stand-up', icon: '📌',
  prompt: 'Báo cáo đúng format của anh Đạt: Yesterday → Today → Blocker.', time: 20, pass: 1,
  items: [
    { text: 'Today: em học quy trình và nhận việc đầu tiên.', order: 1 },
    { text: 'Blocker: em chưa biết ai phụ trách việc gì.', order: 2 },
    { text: 'Yesterday (thứ Sáu): em phỏng vấn và ký thỏa thuận thực tập.', order: 0 },
  ],
};

export const LMS_MINI = {
  type: 'quiz', title: 'E-learning: Văn hóa T&M (bản 2016)', icon: '🎞️',
  prompt: 'Bài kiểm tra cuối video. Đúng 2/3 là qua, nhận chứng chỉ.', time: 30, pass: 0.66,
  questions: [
    { q: 'Giá trị cốt lõi số 1 của T&M là gì?', options: ['Excellence', 'Excellence. Eventually.', 'Ăn trưa đúng giờ'], correct: 0 },
    { q: 'Khi không biết ai phụ trách một việc, em nên…', options: ['Hỏi chị Thư', 'Tra quy trình trên hệ thống', 'Hỏi Mèo KPI'], correct: 1 },
    { q: 'Hệ thống quản lý quy trình của T&M tên là gì?', options: ['T&M Portal 2016', 'File Excel "QuyTrinh_FINAL"', 'Cả hai'], correct: 2 },
  ],
};

export const BRIEF_MINI = {
  type: 'quiz', title: 'Giải mã brief của chị Hân', icon: '🔍',
  prompt: 'Chị Hân nói: "Em làm cho chị cái big pitcher, aligment strategry với perfomance nha." Ý chị là gì?', time: 30, pass: 0.5,
  questions: [
    { q: '"Big pitcher" nghĩa là…', options: ['Một cái bình rất to', 'Bức tranh tổng thể (big picture)', 'Người ném bóng chày'], correct: 1 },
    { q: '"Aligment strategry với perfomance" nghĩa là…', options: ['Gắn chiến lược với các chỉ số kết quả', 'Căn lề slide cho thẳng', 'Đổi font chữ'], correct: 0 },
    { q: 'Vậy sản phẩm cần làm là…', options: ['Slide tổng quan: chiến lược và KPI đi kèm', 'Logo mới cho công ty', 'Báo cáo 200 trang'], correct: 0 },
  ],
};

export const FINAL_MINI = {
  type: 'pick', title: 'Ổ chung > Dự án > Deck', icon: '🗂️',
  prompt: 'Bản nào là bản thật mới nhất? (Gợi ý: anh An sửa lần cuối sáng nay.)', pick: 1, time: 25, pass: 1,
  items: [
    { text: 'Deck_FINAL.pptx', sub: 'Sửa: Thứ Tư tuần trước · Minh' },
    { text: 'Deck_FINAL_v2.pptx', sub: 'Sửa: Thứ Năm tuần trước · Khang' },
    { text: 'Deck_FINAL_REVISED.pptx', sub: 'Sửa: Thứ Sáu 23:41 · chị Linh' },
    { text: 'Deck_FINAL_REAL.pptx', sub: 'Sửa: Hôm nay 10:42 · An', correct: true },
    { text: 'Deck_FINAL_LAST_ONE.pptx', sub: 'Sửa: Hôm nay 09:15 · Khang (chỉ đổi font)' },
  ],
};

export const STANDUP_POS = { dat: 'su_dat', an: 'su1', long: 'su2', trang: 'su3', mai: 'su4', khang: 'su5', bao: 'su6', ha: 'su7' };
export const LUNCH_POS = { mai: 'lunch1', long: 'lunch2', trang: 'lunch3', thu: 'lunch4', nhi: 'lunch5' };

export const DAY1 = {
  title: 'Ngày 1 · Thứ Hai',
  subtitle: 'Onboarding',
  intro: 'Thứ Hai, 8:30. Ngày đầu tiên đi làm ở T&M Partners.\n\nTrong túi bạn có: một bản thỏa thuận thực tập, một cây bút, và lời khuyên của Long trong group chat: "Đừng bao giờ tin chữ FINAL."\n\nNgoài việc chính, các anh chị sẽ nhờ bạn vài việc vặt trong ngày. Xem danh sách ở góc màn hình, làm kịp giờ thì được ghi nhận.',
  pos: {},
  sideTasks: true,
  steps: [
    {
      who: 'gam', obj: 'Tới lễ tân nhận thẻ từ', time: '08:30',
      scene: [
        ['gam', 'Ơ, em đi làm hôm nay hả? Thẻ từ của em… chị tưởng tuần sau em mới vào.'],
        ['nar', 'Chị Gấm mở ngăn kéo. Trong đó có mười hai cái thẻ từ, không cái nào có tên.'],
        { c: 'd1_card', o: [
          { t: 'Chờ chị Gấm làm thẻ mới.', fx: { nl: -6, rel: { gam: 2 } }, then: [
            ['nar', 'Mười phút sau, bạn có thẻ từ. Ảnh trên thẻ là ảnh của một người khác. Chị Gấm hứa tuần sau đổi.'],
          ] },
          { t: 'Đi chung thẻ với anh Bảo vừa tới.', fx: { rel: { bao: 2 }, set: { tailgate: true } }, then: [
            ['bao', 'Quẹt thẻ tao. Hồi tao mới vào cũng đi ké thẻ người khác ba tháng.'],
            ['think', 'Ba tháng?'],
          ] },
          { t: 'Nhắn Thư hỏi ai làm thẻ từ.', fx: { uy: 1, rel: { thu: 1 } }, then: [
            { chat: [['thu', 'Cái này không phải việc của mình, nhưng mà… để mình hỏi nhé 🙏', true], ['thu', 'Hóa ra là việc của chị Gấm. Mình nhắc chị ấy rồi nha.', true]] },
            ['gam', 'À, Thư nhắc chị rồi. Đây, thẻ của em. Ảnh hơi mờ, em thông cảm.'],
          ] },
        ] },
      ],
    },
    {
      who: 'binh', obj: 'Qua góc IT nhận laptop', time: '08:45',
      scene: [
        { if: isTier('t5'), then: [['binh', 'Laptop của em đây. Máy mới, đúng như thỏa thuận. Mới, nhưng vẫn phải restart.']],
          else: [['binh', 'Laptop của em đây. Đời 2015. Màn hình hơi tối, phím Shift hơi lỏng.']] },
        ['nar', 'Bạn bật máy. Màn hình đen. Đèn nguồn sáng.'],
        ['binh', 'Em restart máy thử chưa?'],
        { c: 'd1_laptop', o: [
          { t: 'Restart.', fx: { rel: { binh: 2 } }, then: [
            ['nar', 'Máy lên. Anh Bình gật gù như vừa chứng minh một định lý.'],
            ['binh', 'Chín mươi phần trăm là được. Mười phần trăm còn lại thì restart lần hai.'],
          ] },
          { t: 'Kiểm tra dây nguồn và độ sáng màn hình trước.', fx: { uy: 2, rel: { binh: 1 } }, then: [
            ['nar', 'Độ sáng màn hình đang ở mức 0. Bạn bấm F2 vài cái. Máy hiện lên.'],
            ['binh', '…Ừ. Cũng được. Nhưng lần sau cứ restart cho chắc.'],
          ] },
        ] },
        ['binh', 'Wifi là TM_Excellence, mật khẩu Eventually@2016. Đừng hỏi tại sao.'],
      ],
    },
    {
      who: 'dat', obj: '9:00 Daily stand-up ở bảng Scrum', time: '09:00', pos: STANDUP_POS,
      scene: [
        ['dat', 'Ok team! Daily stand-up. Time-box mười lăm phút. Mỗi người ba ý: Yesterday, Today, Blocker. Let\'s go!'],
        ['dat', 'Hôm nay có bạn intern mới. Welcome {ten}! Lát em update theo format nhé.'],
        ['an', 'Yesterday: em làm deck cho chị Linh. Today: em làm tiếp deck cho chị Linh. Blocker: team em có một người full-time. Là em.'],
        ['ha', 'Chị chỉ góp một ý nhỏ về phương pháp nghiên cứu thôi…'],
        ['nar', 'Bảy phút sau, chị Hạ vẫn đang nói về phương pháp nghiên cứu. Long nhìn trần nhà. Trang ghi chép.'],
        ['khang', 'Actually, when I was overseas, stand-up chỉ có bảy phút. Mình nên time-box chặt hơn.'],
        ['dat', 'Cảm ơn Khang. Cái đó mình đưa vào parking lot nhé. {ten}, your turn!'],
        { mini: STANDUP_MINI,
          good: [['dat', 'PERFECT format! Mọi người thấy chưa, intern còn chuẩn hơn cả team.'], ['an', '(nhỏ) Chuẩn thật. Nhanh nữa.'], { fx: { uy: 3, rel: { dat: 2, an: 1 } } }],
          bad: [['nar', 'Bạn nói Today trước Yesterday. Anh Đạt nhăn mặt như vừa thấy một story không có acceptance criteria.'], ['dat', 'Không sao, lần sau mình theo format nha. Format là văn hóa.'], { fx: { rel: { dat: -1, ha: 1 } } }],
        },
        ['nar', 'Daily stand-up "mười lăm phút" kết thúc lúc 9:45. Anh Đạt ghi lên bảng: "Velocity: tốt".'],
      ],
    },
    {
      who: 'phuong', obj: 'Gặp chị Phương học e-learning nhập môn', time: '10:00',
      scene: [
        ['phuong', 'Em ngồi đây xem video "Văn hóa T&M" nhé. Bốn mươi phút thôi. Hơi cũ nhưng giá trị vẫn còn nguyên!'],
        ['nar', 'Video mở đầu bằng logo cũ, nhạc nền piano và câu "T&M Partners: Leading the Future (2016)".'],
        { c: 'd1_lms', o: [
          { t: 'Xem hết 40 phút.', fx: { nl: -8, rel: { phuong: 2 } }, then: [['nar', 'Bạn biết thêm rằng năm 2016 công ty từng có một ban "Chuyển đổi số". Ban đó đã chuyển đổi thành Excel.']] },
          { t: 'Tua nhanh lên câu hỏi cuối.', fx: { dr: 2 }, then: [['phuong', 'Ơ, em tua hả? Hệ thống báo rồi nè. Em xem lại đoạn "Giá trị cốt lõi" nhé.'], { fx: { nl: -3, rel: { phuong: -1 } } }] },
        ] },
        { mini: LMS_MINI,
          good: [['phuong', 'Qua rồi! Đây là chứng chỉ của em. In ra dán bàn cho đẹp nha.'], { fx: { uy: 2, set: { lms_pass: true } } }],
          bad: [['phuong', 'Chưa qua rồi em ơi. Mà thôi, chị ghi là qua. Đừng nói ai nhé.'], { fx: { dr: 2, rel: { phuong: 1 } } }],
        },
      ],
    },
    {
      who: 'han', obj: 'Chị Hân gọi bạn qua giao việc', time: '10:45',
      scene: [
        ['han', 'Hi em! Chị có một task rất strategic cho em. Em làm cho chị cái big pitcher về digital transformation cho khách nha.'],
        ['han', 'Mình cần aligment cái strategry với perfomance. Thứ Sáu nộp. Ok không em?'],
        ['think', 'Mình hiểu từng chữ. Ghép lại thì không hiểu gì.'],
        { c: 'd1_brief', o: [
          { t: '"Chị cho em hỏi lại ý chính và đầu ra cụ thể được không ạ?"', fx: { uy: 2, rel: { han: -1 }, set: { brief_clarified: true } }, then: [
            ['han', 'Ơ… thì là cái big pitcher ấy em. Tổng quan. Có KPI. Đẹp. Ok?'],
            ['think', 'Ít nhất giờ mình có ba từ khóa.'],
            { mini: BRIEF_MINI,
              good: [['think', 'Slide tổng quan: chiến lược và KPI đi kèm. Ok, mình làm được.'], { fx: { uy: 2, set: { brief_ok: true } } }],
              bad: [['think', 'Mình vẫn không chắc lắm. Thôi cứ làm, sai thì sửa.'], { fx: { set: { brief_ok: false } } }],
            },
          ] },
          { t: 'Gật đầu, rồi qua hỏi Long.', fx: { rel: { han: 1, long: 2 } }, then: [
            ['long', 'Để tao dịch cái brief này sang tiếng người. "Big pitcher" là big picture. "Aligment strategry với perfomance" là gắn chiến lược với KPI. Nghĩa là: một slide tổng quan, có số.'],
            ['long', 'Tao đang viết "từ điển Hân – Việt". Mày là người dùng thứ năm.'],
            { fx: { set: { brief_ok: true, long_dict: true } } },
          ] },
          { t: '"Dạ em làm luôn ạ!"', fx: { rel: { han: 2 }, set: { brief_ok: false } }, then: [
            ['han', 'Love the energy! Thứ Sáu nha em.'],
            ['think', 'Không biết mình vừa nhận lời làm cái gì.'],
          ] },
        ] },
      ],
    },
    {
      who: 'mai', obj: 'Giờ trưa! Xuống pantry ăn với nhóm chị Mai', time: '12:00', pos: LUNCH_POS,
      scene: [
        ['mai', 'Em ngồi đây nè. Ngày đầu thấy sao?'],
        ['trang', 'Bạn ăn bánh không? Mình mua dư.'],
        ['nhi', 'Ủa, sáng nay ai gửi file sinh nhật chị Tuyết vào group công ty vậy? Đến tay mình xử lý luôn rồi.'],
        ['thu', 'Không phải việc của mình. Nhưng mà… mình xử lý rồi.'],
        ['long', 'Quy tắc sống sót số một: đừng bao giờ tin chữ FINAL. Số hai: hỏi lại brief chị Hân. Số ba: ăn trưa với tụi tao.'],
        ['long', 'Số bốn: có gì cứ hỏi Mai. Trẻ nhất công ty mà là Senior đấy.'],
        ['nhi', 'Còn cần biết ai thật sự làm việc gì thì tra file "Ai làm gì" của tụi mình nha.'],
        ['nar', 'Mèo KPI nhảy lên ghế trống cạnh bạn, nằm ngủ ngay.'],
        { c: 'd1_lunch', o: [
          { t: 'Hỏi chị Mai cách chị lên Senior khi trẻ nhất công ty.', fx: { rel: { mai: 2 } }, then: [
            ['mai', 'Chị chỉ làm một việc: hỏi "khách thật sự cần gì" trước khi mở PowerPoint. Ở đây hiếm người hỏi câu đó lắm.'],
          ] },
          { t: 'Hỏi Trang hôm nay đang làm mấy việc.', fx: { rel: { trang: 2 } }, then: [
            ['trang', 'Ừm… bảy. Tám, nếu tính việc chị Hạ vừa nhờ. Không sao đâu, mình làm kịp mà.'],
            ['think', '"Mình làm kịp mà" nghe giống một lời cầu cứu.'],
          ] },
          { t: 'Hỏi Thư và Nhi file "Ai làm gì" thật ra là gì.', fx: { rel: { thu: 1, nhi: 1 }, set: { knows_whodoes: true } }, then: [
            ['nhi', 'Suỵt! Là file tụi mình tự làm. Sơ đồ tổ chức thì ghi một kiểu, còn file này ghi ai thật sự làm việc gì.'],
            ['thu', 'Ví dụ "đặt phòng họp": sơ đồ ghi Hành chính. File ghi: chị Gấm, nhưng nhắc hai lần.'],
          ] },
        ] },
        { fx: { nl: 25 } },
        ['nar', 'Bữa trưa ba mươi phút. Không ai nhắc tới deadline. Đây là ba mươi phút yên bình nhất trong ngày.'],
      ],
    },
    {
      who: 'an', obj: 'Anh An cần tìm gấp bản deck mới nhất', time: '14:00',
      scene: [
        ['an', 'Cứu! Chị Linh cần deck gửi khách lúc 17:00, mà chị Tuyết muốn xem trước. Minh part-time hôm nay offline, mà anh không nhớ bản nào là bản thật nữa.'],
        ['linh', 'Chị không phản đối chiến lược. Chị phản đối việc triển khai chiến lược bằng một nhân viên rưỡi.'],
        ['an', 'Em mở ổ chung giúp anh. Tìm đúng bản FINAL thật nhé.'],
        { mini: FINAL_MINI,
          good: [['an', 'Đúng rồi! FINAL_REAL. Sáng nay anh sửa lúc 10:42. Em cứu anh một mạng.'], ['linh', 'Cảm ơn em. Từ mai em ngồi gần team chị một chút nhé.'], { fx: { uy: 4, rel: { an: 2, linh: 2 }, set: { final_found: true } } }],
          bad: [['an', 'Ơ… không phải bản này. Để anh tìm lại. Mất thêm một tiếng.'], { fx: { nl: -4, rel: { an: -1 } } }],
        },
        ['nar', 'Trên Teams, trạng thái của Minh: "Offline · Đang thi cuối kỳ". Trạng thái của Bảo Ngọc: "Đang làm dự án khác, sẽ phản hồi sau".'],
      ],
    },
    {
      who: 'call:tuyet', obj: 'Chị Tuyết đang gọi Teams! (nghe máy)', time: '15:30',
      call: { title: 'Chị Tuyết <> Intern · "Vài ý nhỏ"', people: ['tuyet', 'thu', 'me'] },
      scene: [
        ['tuyet', 'Em có đang làm deck với An không? Chị vừa xem. Chị chỉ có một vài ý nhỏ thôi.'],
        ['nar', 'File deck hiện 27 comment mới, toàn bút đỏ.'],
        ['tuyet', 'Đây là phân tích, nhưng đâu là business implication?'],
        ['tuyet', 'Khách không thiếu dữ liệu. Họ thiếu một lựa chọn. Slide 3 phải trả lời: nên làm gì trước.'],
        { c: 'd1_comments', o: [
          { t: '"Em sẽ sửa hết 27 ý tối nay ạ."', fx: { nl: -10, set: { ot_comments: true } }, then: [
            ['tuyet', 'Chị không cần em sửa hết. Chị cần em sửa đúng.'],
            ['think', 'Câu này nghe quen. Hình như chị ấy nói câu này với tất cả mọi người.'],
          ] },
          { t: 'Nhắn chị Mai nhờ chọn ra 5 ý quan trọng nhất.', fx: { uy: 4, rel: { mai: 2, tuyet: 1 }, set: { triage: true } }, then: [
            { chat: [['mai', 'ok để chị xem. 5 ý in đậm là bắt buộc, 22 ý còn lại là định hướng cho bản sau 😉', true]] },
            ['tuyet', 'Năm ý này đúng là cái chị cần. Ai chỉ em vậy?'],
            ['me', 'Dạ, em có hỏi chị Mai ạ.'],
            ['tuyet', 'Biết hỏi đúng người cũng là một kỹ năng.'],
          ] },
          { t: 'Nhờ Thư hỏi lại thứ tự ưu tiên.', fx: { rel: { thu: 1 }, dr: 2 }, then: [
            ['thu', 'Cái này không phải việc của em, nhưng mà… chị Tuyết ơi, ý nào cần sửa trước ạ?'],
            ['tuyet', 'Ý một, ý bốn, ý mười hai. Còn lại là gợi ý. Ghi lại giúp chị, Thư.'],
          ] },
        ] },
      ],
    },
    {
      who: 'trang', obj: 'Trang có vẻ đang quá tải…', time: '17:00',
      scene: [
        ['nar', 'Bàn Trang có ba laptop đang mở, hai cốc cà phê và một tờ giấy ghi "VIỆC ĐÃ NHẬN (trang 4)".'],
        ['trang', 'Không sao đâu, để em làm cho… à, bạn hả. Mình vừa nhận thêm việc của anh Long và của chị Hân.'],
        ['long', 'Trang, tao nói rồi, cái đó tao tự làm được mà.'],
        { c: 'd1_trang', o: [
          { t: 'Ngồi xuống giúp Trang một phần.', fx: { nl: -10, rel: { trang: 3, long: 1 } }, then: [
            ['trang', 'Thật hả? …Cảm ơn bạn nhiều lắm.'],
            ['nar', 'Hai người làm xong phần của chị Hân lúc 17:40.'],
          ] },
          { t: 'Giúp Trang tập nói "không" với một việc.', fx: { uy: 2, rel: { trang: 2, long: 2 }, set: { trang_no: true } }, then: [
            ['me', 'Việc của anh Long, anh Long tự làm được. Bạn trả lại thử xem?'],
            ['trang', 'Anh Long… việc này… anh tự làm được không ạ?'],
            ['long', 'Được. Tao đợi câu này cả năm rồi.'],
            ['nar', 'Trang thở ra một hơi rất dài, rồi bật cười.'],
          ] },
          { t: 'Để Trang tự xoay xở.', fx: { rel: { trang: -1 } }, then: [
            ['trang', 'Không sao đâu, mình làm kịp mà…'],
          ] },
        ] },
      ],
    },
    {
      who: 'obj:desk', obj: '17:45 Về bàn: OT hay về đúng giờ?', time: '17:45',
      scene: [
        ['nar', 'Đồng hồ chỉ 17:45. Nửa văn phòng vẫn sáng đèn. Nhóm Mai, Long, An còn ngồi lại.'],
        { if: isTier('t5'), then: [{ chat: [['tuyet', 'Em về rồi à?', true]] }, ['think', 'Bốn chữ. Không dấu chấm hỏi nào trên đời nặng hơn dấu này.']] },
        { if: (s) => !!s.flags.contract_blind, then: [['think', 'Bản thỏa thuận có điều khoản "OT tự nguyện theo yêu cầu". Mình đã ký mà không hỏi.']] },
        { c: 'd1_ot', o: [
          { t: 'Ở lại OT cùng mọi người.', fx: { nl: -15, rel: { mai: 1, an: 1, long: 1 } }, then: [
            { if: isTier('t3', 't5'), then: [{ fx: { uy: 4 } }] },
            ['an', 'Ê, anh gọi trà sữa. Mọi người uống gì?'],
            ['nar', 'Chín giờ tối, cả nhóm cùng ra về. Mệt, nhưng cười nhiều.'],
          ] },
          { t: 'Về đúng giờ. Ngày mai còn dài.', fx: { nl: 20 }, then: [
            { if: isTier('t5'), then: [{ fx: { dr: 6, uy: -2 } }, ['think', 'Mình chọn mức Consulting Hell. Hình như "Hell" là có lý do.']] },
            { if: isTier('t0', 't1'), then: [['mai', 'Về đi em. Intern về đúng giờ là quyền, không phải đặc ân.']] },
          ] },
        ] },
      ],
    },
  ],
  diary: (s) => {
    const bits = [];
    bits.push(s.flags.final_found ? 'Mình tìm ra FINAL_REAL giữa năm chữ FINAL.' : 'Mình chọn nhầm bản FINAL. Bài học nhớ đời.');
    if (s.flags.triage) bits.push('Chị Mai dạy mình đọc 27 comment của chị Tuyết: 5 ý in đậm là bắt buộc.');
    if (s.flags.trang_no) bits.push('Trang nói "không" lần đầu tiên. Mình thấy vui lạ.');
    if (s.flags.brief_ok === false) bits.push('Mình vẫn chưa chắc "big pitcher" là gì. Thứ Sáu sẽ biết.');
    return `Ngày 1. ${bits.join(' ')} Stand-up mười lăm phút kéo dài bốn mươi lăm phút. Mèo KPI ngủ cạnh mình lúc trưa.`;
  },
};

// Side tasks ("việc vặt") — count per day comes from the salary tier (difficulty.js). `base` = minutes before deadline.
export const SIDE_TASKS = [
  { id: 'sign', title: 'Mang tờ trình của chị Thư qua chị Quỳnh ký', from: 'thu', base: 70, legs: [
    { npc: 'thu', line: ['thu', 'Bạn cầm tờ này qua chị Quỳnh ký giúp mình nha. Không phải việc của bạn, nhưng mà…'] },
    { npc: 'quynh', line: ['quynh', 'Để chị kiểm tra lại file đã nhé… Ừ, ký rồi. Đem về cho Thư.'] },
    { npc: 'thu', line: ['thu', 'Cảm ơn bạn nhiều! 🙏'] },
  ] },
  { id: 'paid', title: 'Hỏi chị Quỳnh khách đã chuyển tiền chưa, báo lại Mai', from: 'mai', base: 90, legs: [
    { npc: 'mai', line: ['mai', 'Khách hỏi hóa đơn. Em hỏi chị Quỳnh giúp chị xem họ đã chuyển tiền chưa nhé.'] },
    { npc: 'quynh', line: ['quynh', 'Khách chuyển chưa thì phải xem sao kê… À đây, chuyển rồi, hôm thứ Năm.'] },
    { npc: 'mai', line: ['mai', 'Tuyệt, chị báo khách luôn. Em nhanh ghê.'] },
  ] },
  { id: 'room', title: 'Nhờ chị Gấm đặt phòng họp 16:00 cho chị Linh', from: 'an', base: 80, legs: [
    { npc: 'an', line: ['an', 'Em đặt giúp anh phòng họp 16:00 cho chị Linh với. Nhắc chị Gấm hai lần nhé.'] },
    { npc: 'gam', line: ['gam', 'Phòng họp 16:00 hả… hôm nay hả? Ơ, chị ghi rồi. Lần này bút bi.'] },
    { npc: 'an', line: ['an', 'Bút bi thật hả? Tốt quá.'] },
  ] },
  { id: 'print', title: 'In 3 bản hợp đồng gốc cho Nhi', from: 'nhi', base: 60, legs: [
    { npc: 'nhi', line: ['nhi', 'Ủa sao cái này cũng đến tay mình vậy… Bạn in giúp mình 3 bản hợp đồng gốc nhé.'] },
    { obj: 'printer', line: ['nar', 'Máy in kẹt giấy. Bạn mở nắp, rút tờ giấy nhăn. Máy đòi mật khẩu, tờ giấy dán trên máy ghi "hỏi anh Bảo". Anh Bảo nói vọng sang: "1234". Máy chạy.'] },
    { npc: 'nhi', line: ['nhi', 'Ba bản, đủ chữ ký. Bạn là ân nhân.'] },
  ] },
  { id: 'tea', title: 'Pha trà mang vào cho chị Tuyết trước giờ họp', from: 'thu', base: 50, legs: [
    { npc: 'thu', line: ['thu', 'Chị Tuyết sắp họp. Bạn pha giúp mình ấm trà nhé. Trà, không phải cà phê.'] },
    { obj: 'coffee', line: ['nar', 'Bạn pha một ấm trà. Pantry có ba loại trà, bạn chọn loại ít bụi nhất.'] },
    { npc: 'tuyet', line: ['tuyet', 'Cảm ơn em. Trà vừa. Em để ý chi tiết đấy.'] },
  ] },
  { id: 'wifi', title: 'Báo anh Bình máy chị Hạ mất mạng', from: 'ha', base: 70, legs: [
    { npc: 'ha', line: ['ha', 'Em ơi máy chị mất mạng đúng lúc đang đọc một paper rất hay. Em báo anh Bình giúp chị nhé.'] },
    { npc: 'binh', line: ['binh', 'Chị Hạ hả? Nhắn chị ấy restart. Nếu không được thì… restart lần hai.'] },
    { npc: 'ha', line: ['ha', 'Restart là được thật! Cảm ơn em. Mà em có biết lịch sử của nút restart không…'] },
  ] },
  { id: 'sticky', title: 'Lấy thêm sticky note cho anh Đạt ở chỗ chị Gấm', from: 'dat', base: 80, legs: [
    { npc: 'dat', line: ['dat', 'Team ơi, mình hết sticky note rồi! Đây là impediment. Em lấy giúp anh ở hành chính nhé.'] },
    { npc: 'gam', line: ['gam', 'Sticky note hả… để chị xem… à đây, màu vàng hết rồi, còn màu hồng.'] },
    { npc: 'dat', line: ['dat', 'Màu hồng? Ok. Mình sẽ gọi đây là "Pink Sprint".'] },
  ] },
];
