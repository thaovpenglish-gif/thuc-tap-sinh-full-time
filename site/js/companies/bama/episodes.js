// Ba & Má — drama days. 16 intern episodes (day 1 = onboarding) + 4 official-only episodes (promotion arc).
// Flags carry across episodes; see promotion.when in extras.js.
const isTier = (...ids) => (s) => ids.includes(s.tier);
const F = (k) => (r) => !!r.flags[k];
const official = (r) => r.status === 'official';

export const STANDUP_POS = { son: 'scrum', hung: 'su1', hang: 'su2', tuan: 'su3', mi: 'su4', dung: 'su5', mai: 'su6', khoa: 'su7', ngan: 'su8', vy: 'su9', bay: 'su10' };
export const LUNCH_POS = { hung: 'lunch1', hang: 'lunch2', mai: 'lunch3', ngan: 'lunch4', khoa: 'lunch5' };
export const FAMILY_ROOM = { hung: 'meeting_head', hang: 'mr_n1', tuan: 'mr_n2' };
export const LIVE_POS = { mi: 'hr' };

// ---------- mini-games ----------
const D1_STANDUP_MINI = {
  type: 'order', title: 'Họp sáng 8:15 (bắt đầu 9:00)', icon: '📌',
  prompt: 'Báo cáo đúng format anh Sơn: Hôm qua → Hôm nay → Vướng.', time: 20, pass: 1,
  items: [
    { text: 'Hôm nay: con học quy trình xưởng và nhận việc.', order: 1 },
    { text: 'Vướng: con chưa biết ai quyết cái gì.', order: 2 },
    { text: 'Hôm qua (thứ Sáu): con phỏng vấn và ăn thử khô.', order: 0 },
  ],
};
const PROCESS_MINI = {
  type: 'order', title: 'Từ con gà tới gói khô', icon: '🐔',
  prompt: 'Anh Dũng chỉ một lần. Xếp đúng thứ tự quy trình xưởng.', time: 35, pass: 0.7,
  items: [
    { text: 'Sơ chế, luộc và xé gà', order: 0 },
    { text: 'Tẩm ướp (công thức của Ba)', order: 1 },
    { text: 'Sấy, đảo khay', order: 2 },
    { text: 'Để nguội', order: 3 },
    { text: 'Cắt, phân loại (miếng vụn thành "khô giá sinh viên")', order: 4 },
    { text: 'Đóng gói, hút chân không', order: 5 },
    { text: 'In NSX/HSD, dán tem', order: 6 },
  ],
};
const BANNED_MINI = {
  type: 'pick', title: 'Từ cấm trên live', icon: '🚫',
  prompt: 'Chọn 3 câu KHÔNG được nói trên live (sàn khóa live, có khi bị phạt).', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: '"Khô gà ăn giảm cân nha cả nhà"', correct: true },
    { text: '"Thơm lá chanh, xé sợi vừa ăn"' },
    { text: '"Ăn vô bổ thận, hết mất ngủ"', correct: true },
    { text: '"Có ghi NSX, HSD rõ ràng trên bao"' },
    { text: '"Đóng gói hút chân không, zip kéo"' },
    { text: '"Người tiểu đường ăn thoải mái"', correct: true },
  ],
};
const PRICE_MINI = {
  type: 'quiz', title: 'Bài toán hai kênh', icon: '🧮',
  prompt: 'Trước khi vô họp, tính nhanh với anh Dũng.', time: 40, pass: 0.66,
  questions: [
    { q: 'Gói khô gà bán 69K trên sàn, phí sàn khoảng 30%. Công ty thực nhận khoảng?', options: ['69K', 'Khoảng 48K', '75K'], correct: 1 },
    { q: 'Đại lý lấy sỉ 75K, bán lẻ 95K. Khách thấy sàn bán 69K thì…', options: ['Khách mua ở đại lý cho ủng hộ', 'Khách bỏ đại lý, đại lý bỏ mối', 'Không ảnh hưởng'], correct: 1 },
    { q: 'Cách để hai kênh khỏi đánh nhau?', options: ['Bỏ hẳn một kênh', 'Tách sản phẩm: gói online khác size, khác tên', 'Giảm giá cả hai'], correct: 1 },
  ],
};
const FEE_MINI = {
  type: 'quiz', title: 'Sao sàn trừ nhiều vậy?', icon: '🧾',
  prompt: 'Má đưa tờ thông báo phí. Giải thích cho Má bằng con số.', time: 40, pass: 0.66,
  questions: [
    { q: 'Đơn 100K: hoa hồng 10%, phí thanh toán 5%, affiliate 8%, voucher shop 7K. Còn lại khoảng?', options: ['93K', '70K', '50K'], correct: 1 },
    { q: 'Muốn mỗi đơn gánh phí đỡ hơn thì…', options: ['Tăng giá trị đơn: combo 3 gói', 'Bán từng gói lẻ 10K', 'Tắt quạt'], correct: 0 },
    { q: 'Khách quen của Má hỏi mua 20 hộp. Nên…', options: ['Bắt khách lên sàn đặt', 'Nhận đơn trực tiếp, có hóa đơn, khỏi phí sàn', 'Từ chối'], correct: 1 },
  ],
};
const FEFO_MINI = {
  type: 'pick', title: 'Kho: xuất hàng nào trước?', icon: '📦',
  prompt: 'Nguyên tắc FEFO: hết hạn trước thì xuất trước. Chọn 3 thùng phải xuất trước.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Khô gà lô A12', sub: 'HSD 15/01 · để trong cùng', correct: true },
    { text: 'Khô gà lô A31', sub: 'HSD 20/05 · ngay cửa kho' },
    { text: 'Khô heo lô H07', sub: 'HSD 02/01 · dưới đáy chồng', correct: true },
    { text: 'Khô bò lô B19', sub: 'HSD 10/04 · mới nhập' },
    { text: 'Mít sấy lô M03', sub: 'HSD 28/12 · ghi "cậu Tám gửi"', correct: true },
    { text: 'Xoài sấy lô X22', sub: 'HSD 30/06 · đẹp nhất kho' },
  ],
};
const PACK_MINI = {
  type: 'order', title: 'Đóng một đơn cho đúng', icon: '📮',
  prompt: 'Xe lấy hàng tới lúc 11:00. Xếp đúng quy trình đóng đơn.', time: 30, pass: 0.67,
  items: [
    { text: 'In bill', order: 0 },
    { text: 'Nhặt hàng theo bill', order: 1 },
    { text: 'Cân, đối chiếu khối lượng', order: 2 },
    { text: 'Quay video lúc đóng gói', order: 3 },
    { text: 'Dán bill lên thùng', order: 4 },
    { text: 'Giao chú Bảy gom cho shipper', order: 5 },
  ],
};
const WAGE_MINI = {
  type: 'quiz', title: 'Má bấm máy tính', icon: '🧮',
  prompt: 'Má hỏi một câu thôi. Trả lời trong lúc Má bấm máy tính.', time: 25, pass: 1,
  questions: [
    { q: 'Tăng 30 nghìn/ngày cho 6 chị thời vụ, chạy 20 ngày tới Tết. Tốn thêm bao nhiêu?', options: ['360.000đ', '3.600.000đ', '36.000.000đ'], correct: 1 },
  ],
};

// ---------- intern episodes ----------
const EP_D1 = {
  id: 'bm_d1', day: 1, title: 'Ngày đầu làm "con"',
  intro: 'Thứ Hai, 7:45. Bạn tới sớm mười lăm phút. Má đã ngồi trước cửa từ 7:30.\n\nNhóm chat công ty có ba tấm hình hoa sen mới. Ngoài việc chính, các cô chú anh chị sẽ nhờ bạn vài việc vặt. Xem góc màn hình, làm kịp thì được ghi nhận.',
  steps: [
    { who: 'hang', obj: 'Chào Má ở phòng kế toán (Má thấy con rồi)', time: '08:30', scene: [
      ['hang', 'Sao giờ mới tới?'],
      { if: F('early_bird'), then: [['think', 'Mình tới 7 giờ 40 như đã hứa. Má vẫn hỏi.']], else: [['think', 'Giờ làm là 8 giờ. Bây giờ là 7 giờ 50.']] },
      { c: 'bm_d1_late', o: [
        { t: '"Dạ con tới lúc 7 giờ 45 ạ. Con chào Má."', fx: { rel: { hang: 1 } }, then: [['hang', 'Ừ. Mai 7 giờ 40.'], ['think', 'Mục tiêu này sẽ lùi dần cho tới khi mình ngủ luôn ở đây.']] },
        { t: 'Đưa điện thoại có giờ chấm công.', fx: { uy: 2, rel: { hang: -1 } }, then: [['hang', 'Con chấm công cho Má coi hả? Ừ. Má thấy rồi. Má nhớ luôn.']] },
        { t: '"Dạ con xin lỗi Má, mai con tới sớm hơn."', fx: { dr: 1, rel: { hang: 1 } }, then: [['hang', 'Biết lỗi là tốt. Mà con có lỗi gì đâu. Thôi kệ, biết lỗi trước cho quen.']] },
      ] },
      ['hang', 'Ba điều. Một: tắt quạt khi ra ngoài. Hai: khô ăn thử thì ăn thử, đừng ăn no. Ba: cái gì tốn tiền thì hỏi Má trước.'],
      ['hang', 'Áo blouse, nón, khẩu trang ở tủ chị Vy. Xuống xưởng mà không mặc là anh Dũng đuổi lên.'],
    ] },
    { who: 'khoa', obj: 'Qua góc IT nhận laptop', time: '08:40', scene: [
      ['nar', 'Một con mèo vàng nằm trên đầu anh Khoa. Nó đang nhai một sợi khô gà. Anh Khoa không có vẻ gì là để ý.'],
      ['khoa', 'Mèo Khô Gà. Nó tự chọn đầu anh. Đừng hỏi.'],
      ['khoa', 'Laptop của em. Máy cũ của Kevin hồi đi Úc. Mật khẩu là ngày sinh của Ba. Cả công ty đều biết ngày sinh của Ba.'],
      ['khoa', 'Wifi BaVaMa@2004. Mười một giờ rưỡi tới một giờ Má tắt router cho đỡ tiền điện.'],
      { c: 'bm_d1_laptop', o: [
        { t: '"Dạ em cảm ơn anh. Máy nhìn… bền lắm ạ."', fx: { rel: { khoa: 2 } }, then: [['khoa', 'Em là người đầu tiên cảm ơn anh trong ba năm.'], ['kpi', 'Meo.']] },
        { t: '"Sao Ngân được laptop mới tinh vậy anh?"', fx: { dr: 4, set: { ngan_mac: true } }, then: [['khoa', 'Má duyệt. Hỏi Má.'], ['khoa', '…Mà thôi, đừng hỏi.']] },
        { t: '"Live trưa mà tắt wifi thì sao anh?"', fx: { uy: 2, rel: { khoa: 1 } }, then: [['khoa', 'Thì live bằng 4G của anh. Anh là "Data & AI Lead". Data là gói 4G.']] },
      ] },
    ] },
    { who: 'son', obj: '"Họp sáng 8:15" ở bảng giữa phòng (bắt đầu 9:00)', time: '09:00', pos: STANDUP_POS, scene: [
      ['son', 'Ok team! Họp sáng. Time-box mười lăm phút. Mỗi người ba ý: Hôm qua, Hôm nay, Vướng. Let\'s go!'],
      ['hung', 'Để ba nói trước. Hồi xưa ba gánh khô ra chợ…'],
      ['nar', 'Bốn mươi phút sau, Ba vẫn đang ở chợ năm 2004. Kevin chiếu dashboard lên tường không ai nhìn. Má hỏi sao tiền điện tăng.'],
      ['tuan', 'Dad, đây là stand-up, không phải sit-down story.'],
      ['son', 'Cảm ơn bác. Phần đó mình đưa vào "parking lot" nha. {ten}, your turn!'],
      ['hung', 'Parking lot hả? Chú Bảy biết chỗ.'],
      { mini: D1_STANDUP_MINI,
        good: [['son', 'PERFECT format! Mọi người thấy chưa, intern còn chuẩn hơn cả… gia đình.'], ['hang', 'Ngắn. Má thích người nói ngắn.'], { fx: { uy: 3, rel: { son: 2, hang: 1 } } }],
        bad: [['nar', 'Bạn nói "Vướng" trước "Hôm nay". Anh Sơn nhăn mặt như thấy một con gà không có acceptance criteria.'], ['son', 'Không sao, lần sau theo format nha. Format là văn hóa.'], { fx: { rel: { son: -1, hung: 1 } } }],
      },
      ['nar', '"Họp sáng 8:15" kết thúc lúc 9:55. Anh Sơn ghi lên bảng: "Velocity: lá chanh".'],
    ] },
    { who: 'dung', obj: 'Anh Dũng dẫn xuống xưởng một vòng', time: '10:30', scene: [
      ['dung', 'Ừ. Chào em. Mặc áo vô. Đội nón. Khẩu trang. Xưởng là chỗ duy nhất ở đây có quy trình. Do anh viết.'],
      ['nar', 'Phía sau cửa: tám công nhân, ba máy sấy, một rổ lá chanh to bằng cái giường, và mùi tỏi phi đủ làm ai cũng nhớ nhà.'],
      ['dung', 'Anh chỉ một lần. Sáng mai Ba hỏi mà trả lời sai là Ba kể lại từ năm 2004.'],
      { mini: PROCESS_MINI,
        good: [['dung', 'Đúng. Mười lăm năm mới có intern nhớ được bước "để nguội". Ai cũng muốn bỏ bước đó.'], { fx: { uy: 3, rel: { dung: 2 }, set: { knows_process: true } } }],
        bad: [['dung', 'Sấy trước khi ướp thì ra… dép. Không sao. Mai em xé gà với các chị là nhớ.'], { fx: { nl: -4, rel: { dung: 1 } } }],
      },
      { c: 'bm_d1_xuong', o: [
        { t: 'Xắn tay phụ các chị xé gà "ba mươi phút".', fx: { nl: -12, rel: { dung: 1, tu: 1 } }, then: [['nar', 'Ba mươi phút thành hai tiếng. Tay bạn thơm lá chanh. Các chị thời vụ gọi bạn là "con bé/thằng nhỏ văn phòng".']] },
        { t: '"Anh làm ở đây mười lăm năm rồi hả anh?"', fx: { rel: { dung: 2 } }, then: [['dung', 'Mười lăm năm. Bảy mươi phần trăm đại lý là anh mang về. Công ty tên "Ba & Má". Anh không phải Ba, cũng không phải Má.']] },
      ] },
    ] },
    { who: 'tu', obj: 'Giờ cơm! Ra bếp ăn cơm chung', time: '12:00', pos: LUNCH_POS, scene: [
      ['tu', 'Ăn chưa con? Canh chua cá lóc. Ngồi đâu cũng được, trừ ghế đỏ.'],
      ['hung', 'Con có người yêu chưa?'],
      ['hang', 'Ba má con làm gì? Lương bao nhiêu?'],
      ['mai', '(nhỏ) Câu hỏi nhập môn đó em. Ai mới vô cũng bị.'],
      { c: 'bm_d1_lunch', o: [
        { t: 'Trả lời thật, rồi hỏi lại Ba chuyện hồi xưa bán chợ.', fx: { rel: { hung: 2 }, nl: -3 }, then: [['hung', 'Hồi xưa ba gánh khô ra chợ…'], ['nar', 'Cả bàn đồng loạt múc canh. Họ đã nghe chuyện này mười lần. Ba kể lần thứ mười một, mắt sáng rỡ.']] },
        { t: '"Dạ con chưa có người yêu, chỉ có deadline ạ."', fx: { rel: { mai: 1, hang: 1 }, dr: 1 }, then: [['hang', 'Chưa có hả? Ừ…'], ['nar', 'Má liếc sang Kevin. Kevin đang đeo tai nghe. Út Mi cười khúc khích.']] },
        { t: 'Hỏi Ngân hôm nay làm gì.', fx: { rel: { ngan: 2 } }, then: [['ngan', 'Má giao mình đối soát COD. Mình học thiết kế. Chắc Má nghĩ hai cái giống nhau vì đều có… số.']] },
      ] },
      { fx: { nl: 25 } },
      ['nar', 'Bữa cơm ba mươi phút. Mèo Khô Gà ăn hết đầu cá. Má nhìn con mèo như nhìn một khoản hao hụt.'],
    ] },
    { who: 'tuan', obj: 'Kevin gọi qua "quick 1:1 sync"', time: '14:00', scene: [
      ['tuan', 'Hey {ten}! Quick sync. Công ty này stuck ở năm 2004. Ba anh chốt đơn bằng điện thoại bàn. Mẹ anh làm sổ bằng bút bi ba màu.'],
      ['tuan', 'Anh cần ba mươi kịch bản video TíchTắc trong tuần này. "Khô gà lúc 2 giờ sáng", "POV: Má phát lương"… Viral chắc luôn.'],
      { c: 'bm_d1_kevin', o: [
        { t: '"Em làm 5 kịch bản test trước, cái nào ra đơn thì nhân lên được không anh?"', fx: { uy: 4, rel: { tuan: 1 }, set: { kevin_scope: true } }, then: [['tuan', 'Test and learn. Okay. You\'re smarter than my last three interns.'], ['think', 'Ba intern trước đi đâu rồi?']] },
        { t: '"Dạ ba mươi ạ. Em làm liền."', fx: { nl: -8, rel: { tuan: 2 } }, then: [['tuan', 'Love the energy!'], ['think', 'Ba mươi kịch bản. Năm ngày. Một linh hồn thơm lá chanh.']] },
        { t: '"Video có ngân sách quay không anh, hay em hỏi Má?"', fx: { rel: { hang: 1, tuan: -1 }, dr: 2 }, then: [['tuan', 'Đừng. Đừng hỏi Má. Mình làm "organic". Organic nghĩa là… không tốn tiền.']] },
      ] },
    ] },
    { who: 'obj:desk', obj: '17:30 Về bàn: ở lại dán tem hay về?', time: '17:30', scene: [
      ['nar', 'Mười bảy giờ ba mươi. Trên bàn bạn có 300 cái tem date chưa dán, không ai nhớ ai để ở đó.'],
      { chat: [['mi', 'em iu ơi còn ở đó hông, dán giùm chị đống tem nha, tối chị live 😘', true]] },
      { if: F('contract_blind'), then: [['think', 'Thỏa thuận có dòng "hỗ trợ khi cần". Mình đã ký mà không hỏi.']] },
      { c: 'bm_d1_ot', o: [
        { t: 'Ở lại dán tem cùng Út Mi.', fx: { nl: -14, rel: { mi: 2, hang: 1 } }, then: [
          { if: isTier('t3', 't5'), then: [{ fx: { uy: 3 } }] },
          ['mi', 'Em dán thẳng hơn chị nữa. Hông được dán thẳng hơn chị nha.'],
          ['nar', 'Bảy giờ tối, Má đi ngang, tắt quạt chỗ bạn ngồi. Không nói gì. Hình như là một lời khen.'],
        ] },
        { t: 'Về đúng giờ. Tem không có tên mình.', fx: { nl: 18 }, then: [
          { if: isTier('t5'), then: [{ fx: { dr: 5, uy: -2 } }, { chat: [['hang', 'Con về rồi hả?', true]] }, ['think', 'Bốn chữ. Không có dấu chấm hỏi nào nặng hơn.']] },
          { if: isTier('t0', 't1'), then: [['dung', '(ngoài cổng) Về đi em. Intern về đúng giờ là quyền, không phải đặc ân.']] },
        ] },
      ] },
    ] },
  ],
  diary: (s) => {
    const b = [];
    b.push(s.flags.knows_process ? 'Mình xếp đúng quy trình xưởng, anh Dũng gật đầu một cái.' : 'Mình suýt sấy gà trước khi ướp.');
    if (s.flags.kevin_scope) b.push('Mình đổi 30 kịch bản thành 5 cái "test". Kevin gọi đó là growth mindset.');
    if (s.flags.ngan_mac) b.push('Ngân có laptop mới. Mình có máy cũ của Kevin.');
    return `Ngày 1. ${b.join(' ')} Họp sáng 8:15 bắt đầu lúc 9:00 và kết thúc ở chợ năm 2004.`;
  },
};

const EP_TROLIVE = {
  id: 'bm_trolive', day: 3, title: 'Trợ live đầu đời',
  intro: 'Thứ Tư. Kevin đọc trên mạng rằng "12 giờ trưa là giờ vàng", nên hôm nay live trưa.\n\nBạn là trợ live: đứng ngoài khung hình, cầm miếng khô cho cận cảnh, ghim sản phẩm, đọc comment. Nghe đơn giản.',
  pos: LIVE_POS,
  steps: [
    { who: 'mi', obj: 'Út Mi brief trợ live ở góc ringlight', time: '09:00', scene: [
      ['mi', 'Em iu! Quy tắc số một: đứng ngoài khung hình. Trừ khi em dễ thương hơn chị. Mà không có đâu.'],
      ['mi', 'Quy tắc số hai: chị nói "chốt" là em ghim giỏ hàng. Chậm một giây là khách chạy qua shop khác.'],
      ['mi', 'Quy tắc số ba: có mấy câu cấm nói. Nói là sàn khóa live. Em học đi, chị không nhớ hết.'],
      { mini: BANNED_MINI,
        good: [['mi', 'Giỏi! Em thuộc hơn chị. Đừng nói ai nha.'], { fx: { uy: 3, rel: { mi: 1 }, set: { banned_words_known: true } } }],
        bad: [['mi', 'Ờ… "người tiểu đường ăn thoải mái" là cấm đó em. Chị bị cảnh cáo vụ đó rồi.'], { fx: { rel: { mi: 1 } } }],
      },
    ] },
    { who: 'khoa', obj: 'Anh Khoa setup live (mà wifi trưa bị tắt)', time: '10:30', scene: [
      ['khoa', 'Có vấn đề. Live 12 giờ. Má tắt router lúc 11 giờ 30.'],
      { c: 'bm_tl_wifi', o: [
        { t: 'Qua xin Má để router chạy thêm 1 tiếng.', fx: { rel: { hang: 1, khoa: 1 }, nl: -3 }, then: [['hang', 'Một tiếng wifi bao nhiêu tiền? …Thôi được. Nhưng tắt quạt bù.'], ['khoa', 'Em thương lượng được với Má. Anh làm ở đây ba năm chưa thắng lần nào.']] },
        { t: 'Live bằng 4G của anh Khoa.', fx: { rel: { khoa: 2 } }, then: [['khoa', 'Được. Anh còn 2GB. Cầu cho khách đừng xem lâu.']] },
        { t: 'Kéo dây mạng từ phòng Ba qua.', fx: { uy: 2, dr: 2 }, then: [['nar', 'Dây mạng băng ngang lối đi. Chú Bảy vấp hai lần. Ba nói dây này "cản tài lộc".']] },
      ] },
    ] },
    { who: 'mi', obj: '12:00 LIVE! Đứng cạnh Út Mi trợ live', time: '12:00', scene: [
      ['mi', 'Chào cả nhà iu! Khô gà lá chanh Ba & Má, nhà làm thiệt nha! Chốt đơn nha cả nhà!'],
      ['nar', 'Comment chạy: "shop ơi có giao Mỹ không". "chị trợ live dễ thương vậy". "Chị ơi giá nhiêu". "có giao Mỹ không shop".'],
      ['mi', '(cười cứng) Trợ live của chị nha. Không bán.'],
      ['nar', 'Đúng lúc đó, Ba đi ngang qua, ghé vô khung hình, cầm một miếng khô lên.'],
      ['hung', 'Khô này ba làm hai chục năm. Ăn vô bổ thận, ngủ ngon, hết đau lưng!'],
      ['nar', 'Góc màn hình hiện một cái chuông vàng: "Cảnh báo nội dung".'],
      { c: 'bm_tl_ba', o: [
        { t: 'Chen vô: "Dạ ý Ba là ăn ngon miệng, bữa cơm vui ạ!"', fx: { uy: 4, rel: { mi: 1 } }, then: [
          { if: F('banned_words_known'), then: [['think', 'Hai từ cấm trong một câu. May mà mình vừa học.'], { fx: { uy: 2 } }] },
          ['nar', 'Cái chuông vàng biến mất. Út Mi nhìn bạn như nhìn một cái phao.'],
          { fx: { set: { live_saved: true } } },
        ] },
        { t: 'Tắt mic một giây, ghé tai Ba nhắc.', fx: { rel: { hung: -1 }, uy: 2 }, then: [['hung', 'Nói thật mà cũng cấm hả con?'], ['nar', 'Live mất tiếng mười giây. Khách comment: "ủa mất tiếng". Nhưng không bị khóa.']] },
        { t: 'Đứng im. Ba là CEO.', fx: { dr: 5, rel: { hung: 1 } }, then: [['nar', 'Sàn cảnh cáo. Live bị giới hạn hiển thị. Út Mi cười đến hết buổi, nụ cười của người sắp khóc.'], { fx: { set: { live_warned: true } } }] },
      ] },
    ] },
    { who: 'hung', obj: 'Ba gọi vô phòng sau buổi live', time: '14:00', scene: [
      ['hung', 'Hồi xưa ba bán ngoài chợ, nói gì khách cũng nghe. Giờ nói có câu mà cái máy nó la.'],
      { c: 'bm_tl_after', o: [
        { t: 'Viết cho Ba một tờ "từ cấm", chữ to.', fx: { rel: { hung: 1 }, uy: 2, set: { ba_words: true } }, then: [['hung', 'Chữ to. Được. Ba dán lên bàn thờ Thần Tài cho nhớ.'], ['think', 'Ít nhất Thần Tài cũng biết luật sàn.']] },
        { t: 'Đề xuất Ba quay clip "kể chuyện hồi xưa" thay vì live.', fx: { rel: { hung: 3 }, set: { ba_story_clip: true } }, then: [['hung', 'Kể chuyện hồi xưa hả? Cái đó ba làm được. Ba làm giỏi nhất công ty luôn.'], ['tuan', '(vọng vào) That\'s… actually not bad.']] },
        { t: 'Im lặng, gật gù.', fx: { nl: 2 }, then: [['hung', 'Ừ. Con im lặng giỏi. Ở đây im lặng là một kỹ năng.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Má hỏi: "Live bao nhiêu đơn?"', time: '16:00', scene: [
      ['hang', 'Live trưa nay bao nhiêu đơn?'],
      { if: F('live_warned'), then: [['me', 'Dạ… 41 đơn ạ. Bị giới hạn hiển thị.']], else: [['me', 'Dạ 86 đơn, 1.200 người xem ạ.']] },
      ['hang', 'Một ngàn hai người coi mà mấy chục đơn? Còn lại coi chùa hả?'],
      { c: 'bm_tl_ma', o: [
        { t: 'Báo đủ: đơn, đơn hoàn dự kiến, phí sàn, tiền 4G.', fx: { uy: 3, rel: { hang: 2 } }, then: [['hang', 'Có trừ phí. Có trừ hoàn. Đứa đầu tiên báo cho Má con số thật.'], ['tuan', '(xa xa) Mom, GMV mới là…'], ['hang', 'GMV không trả tiền điện.']] },
        { t: 'Báo GMV theo cách của Kevin: "Tăng trưởng 300% so với tuần trước ạ!"', fx: { rel: { tuan: 2, hang: -1 } }, then: [['hang', 'Tuần trước bao nhiêu?'], ['me', 'Dạ… 21 đơn.'], ['hang', 'Ừ. Ba trăm phần trăm của hai mươi mốt. Má hiểu rồi.']] },
      ] },
    ] },
  ],
  diary: (s) => `Ngày trợ live đầu tiên. ${s.flags.live_saved ? 'Ba nói "bổ thận" trên live, mình đỡ kịp.' : s.flags.live_warned ? 'Ba nói "bổ thận" trên live. Sàn cảnh cáo.' : 'Live mất tiếng mười giây vì mình tắt mic Ba.'} ${s.flags.ba_story_clip ? 'Ba hào hứng vụ quay clip kể chuyện hồi xưa.' : ''} Có người khen trợ live dễ thương. Út Mi không vui.`,
};

const EP_TEM = {
  id: 'bm_tem', day: 4, title: 'Tem phụ',
  intro: 'Thứ Năm. 2.000 gói khô gà đã đóng thùng chờ giao chị Tâm, nhà phân phối lớn nhất.\n\nChị Vy cầm một gói lên soi, mặt tái mét. Hạn sử dụng in trên bao dài hơn hồ sơ công bố ba tháng. Máy in date bị ai đó chỉnh nhầm.',
  steps: [
    { who: 'vy', obj: 'Chị Vy cầm gói khô, mặt tái mét', time: '08:30', scene: [
      ['vy', 'Em coi nè. Hồ sơ tự công bố ghi hạn sáu tháng. Bao in chín tháng. 2.000 gói.'],
      ['vy', 'Chị báo chuyện máy in date ba lần rồi. Lần thứ tư chị định in thông báo khổ A3.'],
      ['nar', '(Ghi nhãn sai so với hồ sơ công bố là chuyện có thể bị xử phạt. Thông tin giải trí, không phải tư vấn pháp lý.)'],
      { c: 'bm_tem_vy', o: [
        { t: '"Mình kiểm xem lô nào bị, lô nào không đã chị."', fx: { uy: 3, rel: { vy: 2 } }, then: [['nar', 'Hai người lật từng thùng. 1.500 gói in sai, 500 gói lô sáng nay in đúng.'], { fx: { set: { tem_checked: true } } }] },
        { t: '"Ai chỉnh máy in date vậy chị?"', fx: { dr: 3 }, then: [['vy', 'Không ai nhận. Nhưng sáng thứ Hai cậu Tám có "xem giùm" cái máy.']] },
      ] },
    ] },
    { who: 'cautam', obj: 'Cậu Tám có "giải pháp"', time: '09:30', scene: [
      ['cautam', 'Chuyện nhỏ con ơi. Dán tem phụ đè lên là xong. Tem phụ cậu in rồi nè, đẹp hơn date cũ.'],
      ['cautam', 'Hủy bao bì là ba triệu. Ba triệu là mấy ký thịt, con biết hông?'],
      { c: 'bm_tem_tam', o: [
        { t: 'Phụ cậu dán tem đè, cho kịp giao.', fx: { rel: { cautam: 2 }, nl: -8, set: { tem_cover: true } }, then: [['nar', 'Một tiếng sau, 300 gói đã có lớp tem mới. Bóc ra thì vẫn thấy date cũ, nếu ai đó muốn bóc.']] },
        { t: '"Dạ để con hỏi Ba Má trước ạ."', fx: { rel: { cautam: -1 }, uy: 1 }, then: [['cautam', 'Hỏi thì hỏi. Má con là chị cậu. Cậu biết chị cậu nói gì: "Bao nhiêu tiền?"']] },
        { t: '"Tem phụ dán đè để che date sai là không được đâu cậu."', fx: { rel: { cautam: -2, vy: 1 }, uy: 2 }, then: [['cautam', 'Ủa con là intern hay thanh tra?'], ['vy', '(nhỏ) Cảm ơn em.']] },
      ] },
    ] },
    { who: 'dung', obj: 'Anh Dũng báo: chị Tâm đang hối hàng', time: '10:30', scene: [
      ['dung', 'Chị Tâm hẹn xe lấy hàng 4 giờ chiều. Chị ấy là NPP lớn nhất. Trễ một lần là chị ấy nhớ một năm.'],
      ['dung', 'Anh không quyết được. Chuyện bao bì là chuyện tiền. Chuyện tiền là chuyện nhà.'],
      { c: 'bm_tem_dung', o: [
        { t: '"Anh giúp em gọi chị Tâm xin lùi được không?"', fx: { rel: { dung: 1 } }, then: [['dung', 'Anh gọi được. Nhưng người nói lý do phải là người quyết. Em đi hỏi Má đi.']] },
        { t: '"Anh nghĩ nên làm sao, anh nói thật đi."', fx: { rel: { dung: 2 } }, then: [['dung', 'Nói thật thì: giao đúng. Hàng sai mà tới tay đại lý, đại lý bóc ra, mười lăm năm của anh mất trong một buổi.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Họp gấp ở phòng Má: 2.000 gói xử sao?', time: '13:30', scene: [
      ['hang', 'Bao bì mới ba triệu. Đóng lại mất hai ngày. Trễ hàng chị Tâm. Con nói đi, con thấy sao?'],
      { if: F('tem_cover'), then: [['cautam', '(đứng sau Má) Cậu với nó dán được ba trăm gói rồi chị.']] },
      { c: 'bm_tem_decide', o: [
        { t: 'Giao trước 500 gói in đúng, 1.500 gói đóng lại bao mới, gọi chị Tâm xin lùi.', when: F('tem_checked'), fx: { uy: 6, rel: { hang: 1, vy: 2, cautam: -1 }, set: { tem_split: true } }, then: [['hang', 'Giao một phần, sửa một phần. Tốn ít hơn. Ừ. Được.'], ['vy', 'Em cứu chị một mạng.']] },
        { t: 'Ủng hộ chị Vy: hủy bao, đóng lại toàn bộ.', fx: { uy: 4, rel: { vy: 2, hang: -2 }, set: { tem_redo: true } }, then: [['hang', 'Ba triệu. Má ghi tên con kế bên con số này.'], ['vy', 'Chị chịu một nửa tiếng chửi với em.']] },
        { t: 'Dán tem phụ hết cho kịp.', fx: { rel: { hang: 1, cautam: 1 }, dr: 4, set: { tem_cover: true } }, then: [['hang', 'Kịp hàng, đỡ tiền. Ừ.'], ['vy', '…'], ['think', 'Chị Vy không nói gì. Đó là câu nói to nhất trong phòng.']] },
        { t: 'Báo thẳng Ba.', fx: { uy: 3, rel: { cautam: -3, hung: 1 }, dr: 3, set: { tem_ba: true, tem_redo: true } }, then: [['nar', 'Ba gọi cả xưởng lên họp. Ba hỏi ai chỉnh máy in date. Cậu Tám nhìn bạn rất lâu.'], ['hung', 'Đóng lại hết. Ba & Má không bán date giả.']] },
      ] },
    ] },
    { who: 'call:chitam', obj: 'Chị Tâm (NPP) gọi hỏi hàng', time: '15:00', call: { title: 'Chị Tâm · NPP <> Ba & Má', people: ['chitam', 'hang', 'me'] }, scene: [
      ['chitam', 'Alo. Hàng chị đâu? Xe chị chạy tới rồi nha.'],
      { if: (r) => !!(r.flags.tem_split || r.flags.tem_redo), then: [
        ['me', 'Dạ chị, lô này in sai hạn nên tụi em đóng lại bao mới. Tụi em xin lùi, giao đúng mới dám giao.'],
        ['chitam', 'Nói thật vậy chị quý. Đại lý chị ghét nhất là bóc tem ra thấy date khác. Lùi hai ngày, không hơn.'],
        { fx: { rel: { hang: 1 }, set: { chitam_trust: true } } },
      ], else: [
        ['me', 'Dạ chị, hàng sẵn rồi ạ, chiều nay giao đủ.'],
        ['chitam', 'Ừ, tốt. Chị nói trước: hàng chị mà có gì là chị biết. Đại lý chị bóc tem ra coi hết đó.'],
        ['think', 'Mình hy vọng không ai rảnh để bóc tem.'],
      ] },
    ] },
  ],
  diary: (s) => `2.000 gói in sai hạn. ${s.flags.tem_split ? 'Mình đề xuất giao 500 gói đúng, đóng lại phần sai. Má gật.' : s.flags.tem_redo ? 'Đóng lại hết. Má ghi tên mình cạnh con số ba triệu.' : 'Tụi mình dán tem phụ đè lên. Mình cứ nghĩ tới cái móng tay của đại lý.'} ${s.flags.tem_ba ? 'Cậu Tám nhìn mình lâu lắm.' : ''}`,
};

const EP_THIT = {
  id: 'bm_thit', day: 8, title: 'Thịt rẻ của cậu Tám',
  intro: 'Thứ Hai. Sáng nay cậu Tám chở về bốn thùng xốp thịt bò đông lạnh. "Rẻ hơn mối cũ 40%. Bên khác ai cũng xài."\n\nGiấy kiểm dịch dán trên thùng mờ tới mức chỉ đọc được chữ "dịch".',
  steps: [
    { who: 'cautam', obj: 'Cậu Tám nhờ ký nhận hàng', time: '08:45', scene: [
      ['cautam', 'Con ký nhận giùm cậu vô sổ nhập hàng. Anh Dũng đi đại lý rồi. Ký cho có người ký thôi.'],
      ['nar', 'Sổ nhập: "Thịt bò đông lạnh · 200kg · giá: (để trống)".'],
      { c: 'bm_thit_ky', o: [
        { t: '"Dạ con chưa có quyền ký ạ. Để anh Dũng về ký."', fx: { uy: 2, rel: { cautam: -1 } }, then: [['cautam', 'Cẩn thận ghê. Giống Má con.'], ['think', 'Má không phải má mình. Nhưng thôi.']] },
        { t: 'Ký đại.', fx: { rel: { cautam: 2 }, dr: 2, set: { meat_signed: true } }, then: [['cautam', 'Giỏi. Người nhà là phải tin nhau.'], ['think', 'Tên mình giờ nằm cạnh 200 ký thịt không có giá.']] },
        { t: '"Cậu cho con xin hóa đơn với giấy kiểm dịch bản rõ ạ."', fx: { uy: 3, rel: { cautam: -2 } }, then: [['cautam', 'Hóa đơn… để mối gửi sau. Giấy kiểm dịch thì đây, nó mờ chứ đâu có mất.']] },
      ] },
    ] },
    { who: 'tu', obj: 'Cô Tư gọi ra bếp, nhỏ giọng', time: '09:30', scene: [
      ['tu', 'Lại đây con. Cô rã đông một miếng rồi. Con nhìn thớ thịt nè.'],
      ['tu', 'Cô nấu bò ba chục năm. Cái này thớ to, màu sẫm, mỡ trắng như sáp. Không phải bò.'],
      ['think', 'Báo từng đưa tin mấy vụ "khô bò" làm từ thịt trâu, bán ầm ầm trên sàn.'],
      { c: 'bm_thit_tu', o: [
        { t: 'Chụp hình, cắt một mẫu nhỏ cất tủ đông.', fx: { uy: 2, rel: { tu: 2 }, set: { meat_photo: true } }, then: [['tu', 'Khôn. Cô giữ mẫu cho. Không ai mở tủ đông của cô, kể cả Má.']] },
        { t: '"Cô ơi lỡ con nhìn nhầm thì sao?"', fx: { rel: { tu: 1 } }, then: [['tu', 'Con thì nhầm được. Cô thì không. Ba mươi năm rồi.']] },
      ] },
    ] },
    { who: 'dung', obj: 'Hỏi anh Dũng về mối thịt', time: '10:30', scene: [
      ['dung', 'Mối thịt là chuyện nhà. Cậu Tám là em Má. Anh người ngoài, anh mở miệng là anh dọn đồ.'],
      { if: F('tie_tam_commission'), then: [['dung', '(rất nhỏ) Mà em biết không… mối nào cậu đưa về, cậu cũng có "hoa hồng". Anh nói vậy thôi, anh không nói.']] },
      { c: 'bm_thit_dung', o: [
        { t: '"Anh đi với em lên gặp Má được không?"', fx: { rel: { dung: 1 } }, then: [['dung', 'Anh đứng ngoài cửa. Đứng ngoài là chuyên môn của anh.']] },
        { t: '"Em hiểu. Em tự lo."', fx: { rel: { dung: 2 }, nl: -3 }, then: [['dung', 'Ừ. Nếu Má hỏi, mối cũ có hóa đơn đầy đủ. Anh giữ bản sao mười năm.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Lên phòng Má: nói hay không nói?', time: '14:00', scene: [
      ['hang', 'Con lên chi? Má đang tính tiền điện.'],
      { c: 'bm_thit_decide', o: [
        { t: 'Đưa hình, mẫu thịt, đề xuất gửi lab kiểm nghiệm trước khi đưa vô sấy.', when: F('meat_photo'), fx: { uy: 5, rel: { hang: 1, cautam: -3, tu: 1 }, set: { meat_reported: true } }, then: [
          ['hang', 'Gửi lab hai triệu.'],
          ['me', 'Dạ, còn nếu lên báo "khô bò làm từ trâu" thì bao nhiêu triệu ạ?'],
          ['nar', 'Má nhìn bạn rất lâu. Rồi Má bấm máy tính. Rồi Má gọi cậu Tám lên.'],
          ['hang', 'Bốn thùng này trả lại. Mối cũ đặt lại. Chuyện nhà, xử trong nhà. Con không nói ai.'],
        ] },
        { t: 'Nói miệng với Má là thịt "có vẻ lạ".', fx: { uy: 2, rel: { cautam: -2 }, set: { meat_reported: true, meat_weak: true } }, then: [['hang', '"Có vẻ" là bao nhiêu phần trăm? …Thôi được, Má hỏi thằng Tám.'], ['nar', 'Chiều đó, hai thùng bị trả lại. Hai thùng còn lại "để làm khô vụn".']] },
        { t: 'Im lặng. "Dạ con lên hỏi Má có cần gì không ạ."', fx: { rel: { cautam: 1 }, set: { meat_silent: true } }, then: [['hang', 'Cần con tắt quạt trên đường xuống.'], ['think', 'Bốn thùng thịt đang rã đông dưới xưởng.']] },
        { t: 'Hỏi thẳng cậu Tám trước mặt Má.', fx: { dr: 6, rel: { cautam: -4, hang: -1 }, uy: 2, set: { meat_confront: true, meat_reported: true } }, then: [['cautam', 'Con nói cậu bán thịt dỏm hả? Trước mặt chị cậu?'], ['hang', 'Hai đứa im. Thịt trả lại. Con xuống làm việc.']] },
      ] },
    ] },
    { who: 'cautam', obj: 'Cậu Tám chặn ở cửa xưởng', time: '16:00', scene: [
      { if: F('meat_reported'), then: [
        ['cautam', 'Con giỏi. Giỏi lắm. Mai con xuống kho phụ chú Bảy luôn đi, khỏi lên văn phòng.'],
        { c: 'bm_thit_exile', o: [
          { t: '"Dạ, Má giao gì con làm nấy ạ."', fx: { uy: 2, rel: { cautam: -1, bay: 1 } }, then: [['cautam', 'Má… ừ. Má.'], ['think', 'Cậu Tám vừa nhớ ra cậu không phải người phân việc.']] },
          { t: '"Con làm vậy để công ty khỏi lên báo thôi cậu."', fx: { rel: { cautam: 1 } }, then: [['cautam', '…Lên báo thì cậu cũng không vui. Thôi. Lần này thôi.']] },
        ] },
      ], else: [
        ['cautam', 'Nè. Bịch khô bò, quà của cậu. Người nhà mà.'],
        { c: 'bm_thit_gift', o: [
          { t: 'Nhận, cảm ơn cậu.', fx: { nl: 8, rel: { cautam: 2 }, set: { took_gift: true } }, then: [['think', 'Khô bò này làm từ lô nào vậy ta?']] },
          { t: '"Dạ con ăn khô ăn thử đủ rồi cậu."', fx: { uy: 1 }, then: [['cautam', 'Khách sáo. Giống Má con.']] },
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Thịt rẻ của cậu Tám. ${s.flags.meat_reported ? (s.flags.meat_weak ? 'Mình nói nửa vời. Hai thùng bị trả, hai thùng thành "khô vụn".' : 'Mình đưa bằng chứng cho Má. Thịt bị trả lại. Cậu Tám ghét mình.') : 'Mình im lặng. Bốn thùng thịt lạ đã vào máy sấy.'} Cô Tư nói: "Con thì nhầm được, cô thì không."`,
};

const EP_1111 = {
  id: 'bm_1111', day: 10, title: 'Đêm 11.11',
  intro: 'Thứ Tư, 11.11. Đêm sale lớn nhất tháng. Kevin đặt mục tiêu 3.000 đơn. Út Mi uống nước la hán từ sáng.\n\nTới 9 giờ, giọng Út Mi nghe như cái quạt trần sắp hư. Live mở màn lúc 17:30.',
  pos: LIVE_POS,
  steps: [
    { who: 'mi', obj: 'Út Mi mất giọng! Qua góc live', time: '09:00', scene: [
      ['mi', '(thì thào) Em… lên… thay… chị.'],
      ['think', 'Mình? Lên hình? Đêm 11.11?'],
      { c: 'bm_11_who', o: [
        { t: 'Nhận lời.', fx: { rel: { mi: 2 }, set: { host_1111: true } }, then: [['mi', '(thì thào) Đừng… dễ thương… hơn chị.']] },
        { t: '"Hay anh Kevin lên? Ảnh là Head of Innovation mà."', fx: { dr: 3, rel: { tuan: -1 } }, then: [['tuan', 'Me? On camera? Không. Anh là người đứng sau data.'], ['nar', 'Rốt cuộc vẫn là bạn.'], { fx: { set: { host_1111: true } } }] },
        { t: '"Rủ Ngân lên chung cho đỡ run."', fx: { rel: { ngan: 2, mi: 1 }, set: { host_1111: true, ngan_cohost: true } }, then: [['ngan', 'Mình hả? Mẹ mình mà biết mình lên live bán khô chắc… Ừ. Lên.']] },
      ] },
    ] },
    { who: 'tuan', obj: 'Kevin đưa kịch bản live', time: '10:30', scene: [
      ['tuan', 'Script đây. Anh A/B test rồi. Câu này conversion cao nhất: "Khô gà lá chanh ăn giảm cân, đẹp da, người tiểu đường ăn thoải mái."'],
      { if: F('banned_words_known'), then: [['think', 'Ba từ cấm trong một câu. Kỷ lục.']], else: [['think', 'Nghe… kêu quá. Có đúng không ta?']] },
      { c: 'bm_11_script', o: [
        { t: 'Sửa kịch bản ngay: bỏ hết câu công dụng.', fx: { uy: 3, rel: { tuan: -1 }, set: { script_fixed: true } }, then: [['tuan', 'Conversion sẽ giảm đó.'], ['me', 'Dạ, còn hơn conversion về 0 vì bị khóa live ạ.'], ['tuan', '…Fair.']] },
        { t: 'Giữ nguyên. Kevin có data.', fx: { rel: { tuan: 2 } }, then: [['tuan', 'Trust the data!'], ['think', 'Data không phải đứa lên hình.']] },
      ] },
    ] },
    { who: 'ngan', obj: 'Ngân làm phông nền live', time: '14:00', scene: [
      ['ngan', 'Mình làm phông nền mới. Phông cũ có con gà đang khóc. Không ai để ý suốt hai năm.'],
      ['ngan', 'Mẹ mình gọi. Mẹ nói Má hứa giữ mình lại. Mẹ nói đêm nay mà cậu live hay hơn mình thì mình… thua.'],
      { c: 'bm_11_ngan', o: [
        { t: '"Phông này đẹp thiệt. Lát mình nói khách là Ngân vẽ."', fx: { rel: { ngan: 3 }, set: { ngan_credit_live: true } }, then: [['ngan', 'Thật hả? …Cảm ơn. Chưa ai nói tên mình trên cái gì hết.']] },
        { t: '"Mình không thi với Ngân đâu."', fx: { rel: { ngan: 1 } }, then: [['ngan', 'Cậu không thi. Mẹ mình thi. Khác nhau đó.']] },
      ] },
    ] },
    { who: 'mi', obj: '17:30 LIVE 11.11! Lên hình', time: '17:30', scene: [
      ['nar', 'Đèn ringlight bật. 2.300 người xem. Út Mi ngồi ngoài khung, giơ tấm bảng "CHỐT!!!".'],
      { if: F('ngan_cohost'), then: [['ngan', '(run) Chào… cả nhà. Mình là Ngân. Phông nền mình vẽ.']] },
      { c: 'bm_11_live', o: [
        { t: 'Đọc đúng kịch bản của Kevin.', when: (r) => !r.flags.script_fixed, fx: { dr: 8, rel: { tuan: 1, mi: -1 }, set: { live_locked: true } }, then: [['nar', 'Phút thứ bảy: "Phiên live bị tạm ngưng do vi phạm chính sách nội dung." Đêm 11.11. Màn hình đen.'], ['tuan', 'What? Data nói…'], ['mi', '(thì thào) …']] },
        { t: 'Ứng biến, nói thật: "Ăn không giảm cân đâu cả nhà, mà vui. Vui là được."', fx: { uy: 6, dr: 2, rel: { mi: 1, hung: 1 }, set: { honest_live: true } }, then: [['nar', 'Comment: "trời ơi shop thật thà". "chốt 3 gói vì câu này". Clip cắt đoạn đó được share 40 nghìn lần.'], ['mi', '(thì thào, vừa mừng vừa ghen) …Hay. Hay quá. Ghét.']] },
        { t: 'Đọc kịch bản đã sửa, đều đều, an toàn.', when: F('script_fixed'), fx: { uy: 3, rel: { hang: 1 } }, then: [['nar', 'Không viral. Không bị khóa. 1.100 đơn. Má gật đầu một lần, rất nhẹ.'], { fx: { set: { safe_live: true } } }] },
        { t: 'Từ chối lên hình, chỉ trợ live, để Út Mi thì thào.', fx: { rel: { tuan: -2, mi: -1 }, nl: 5 }, then: [['nar', 'Út Mi thì thào chốt đơn suốt ba tiếng. Khách tưởng là ASMR. 600 đơn.'], ['tuan', 'Hôm nay số thấp vì trợ live không support.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Má đứng chờ: "Bao nhiêu đơn?"', time: '17:55', scene: [
      ['hang', 'Bao nhiêu đơn?'],
      { if: F('live_locked'), then: [['me', 'Dạ… live bị khóa 24 tiếng ạ.'], ['hang', 'Khóa? Đêm 11.11? Ai viết câu đó?'], ['tuan', '…Data.'], ['hang', 'Data là ai? Kêu nó lên đây.'], { fx: { rel: { hang: -1 } } }] },
      { if: F('honest_live'), then: [['me', 'Dạ, 2.400 đơn, đang tăng ạ. Có clip bị share nhiều.'], ['hang', 'Bị share là tốt hay xấu?'], ['mi', '(thì thào) Tốt… Má.'], ['hang', 'Vậy mai đóng hàng. Ai đóng? Con.'], { fx: { rel: { hang: 2 }, nl: -5 } }] },
      { if: F('safe_live'), then: [['hang', 'Một ngàn mốt đơn mà không ai bị khóa, không ai bị chửi. Má thích con số này.']] },
    ] },
  ],
  diary: (s) => `Đêm 11.11. ${s.flags.live_locked ? 'Mình đọc câu "ăn giảm cân" và live bị khóa. Bài học đắt nhất tháng.' : s.flags.honest_live ? 'Mình nói thật trên live, "ăn không giảm cân đâu, mà vui". Clip bị share 40 nghìn lần.' : 'Live an toàn. Không ai khóc. Trừ Út Mi, vì mất giọng.'} ${s.flags.ngan_cohost ? 'Ngân lên live chung. Ngân run, nhưng phông nền đẹp.' : ''}`,
};

const EP_CONGNO = {
  id: 'bm_congno', day: 11, title: 'Đòi nợ cô Sáu',
  intro: 'Thứ Năm, ngày đi giao đại lý. Má đưa bạn một cuốn sổ nhỏ: "Cô Sáu Tạp Hóa · 46.000.000 · 4 tháng".\n\nMá dặn đúng một câu: "Không thu được thì đừng về."',
  steps: [
    { who: 'hang', obj: 'Má giao sổ công nợ', time: '08:30', scene: [
      ['hang', 'Cô Sáu nợ bốn mươi sáu triệu, bốn tháng. Bả sẽ mời con ăn xoài. Ăn xoài xong là con quên đòi. Đừng ăn xoài.'],
      { c: 'bm_cn_brief', o: [
        { t: '"Má cho con biết lịch sử đơn hàng với cô Sáu được không ạ?"', fx: { uy: 2, rel: { hang: 1 } }, then: [['hang', 'Bả lấy mình từ hồi chợ. Trả chậm mà chưa quỵt. Bốn tháng là lâu nhất. Má lo.']] },
        { t: '"Dạ không thu được thì con… ngủ ở chợ ạ?"', fx: { dr: 2, rel: { hang: 1 } }, then: [['hang', 'Má nói giỡn. Mà con thu không được thì Má không giỡn nữa.']] },
      ] },
    ] },
    { who: 'bay', obj: 'Ra xe chú Bảy', time: '09:00', scene: [
      ['bay', 'Lên xe con. Cô Sáu hả? Bạn chợ của Ba hồi xưa. Hồi Ba còn gánh khô, cô Sáu cho Ba để gánh trước sạp.'],
      { c: 'bm_cn_bay', o: [
        { t: '"Chú có mẹo gì không chú?"', fx: { rel: { bay: 2 }, set: { bay_tip: true } }, then: [['bay', 'Đừng nhìn sổ. Nhìn kệ hàng. Kệ hàng nói thật hơn người.']] },
        { t: 'Đeo tai nghe, tập câu đòi nợ trong đầu.', fx: { nl: 3 }, then: [['nar', 'Chú Bảy mở radio cải lương. Câu đòi nợ trong đầu bạn bắt đầu có vọng cổ.']] },
      ] },
    ] },
    { who: 'bay', obj: 'Tới sạp cô Sáu ở chợ (chú Bảy chờ ngoài xe)', time: '10:30', scene: [
      ['nar', 'Sạp cô Sáu: hai mươi mét vuông, ba quạt máy, một con chó vàng. Bạn được mời ngồi ghế nhựa đỏ.'],
      ['cosau', 'Con của Hằng hả? Ngồi đi con. Ăn miếng xoài.'],
      { if: F('bay_tip'), then: [['think', 'Nhìn kệ hàng. Khô gà Ba & Má: còn ít, bám bụi. Bên cạnh: một hàng khô gà bao bì y chang, tên "BA & MẸ", giá rẻ hơn 15 nghìn.'], { fx: { set: { saw_copycat: true } } }] },
      { c: 'bm_cn_deal', o: [
        { t: 'Từ chối xoài, ngồi lì tới chiều.', fx: { nl: -15, rel: { hang: 1 }, set: { debt_sit: true } }, then: [['cosau', 'Con này lì giống Hằng hồi trẻ.'], ['nar', '4 giờ chiều, cô Sáu đưa mười triệu và một bịch xoài. Bạn không ăn. Chú Bảy ăn.']] },
        { t: 'Thương lượng: trả góp 3 đợt, lấy lại hàng cận date đổi hàng mới.', fx: { uy: 5, rel: { hang: 1 }, set: { debt_deal: true } }, then: [['cosau', 'Trả góp hả? Được. Hàng cũ đổi hàng mới thì cô bán được. Con biết làm ăn ghê.'], ['nar', 'Cô Sáu ký giấy hẹn và chuyển luôn đợt một: mười lăm triệu.']] },
        { t: 'Hỏi thẳng về hàng "BA & MẸ" trên kệ.', when: F('saw_copycat'), fx: { dr: 3, uy: 3, set: { asked_copycat: true } }, then: [['cosau', 'Tụi nó mới tới mời, rẻ hơn mười lăm nghìn. Cô lấy thử. Ai cũng phải sống mà con.'], ['think', 'Bao bì chép y chang. Chỉ đổi một chữ.']] },
      ] },
    ] },
    { who: 'hung', obj: 'Về báo Ba chuyện cô Sáu', time: '14:00', scene: [
      ['hung', 'Con gặp bà Sáu hả? Bả khỏe không? Hồi xưa bả cho ba để gánh trước sạp. Không lấy tiền.'],
      ['nar', 'Ba nhìn ra cửa sổ, như thấy lại cái chợ năm 2004.'],
      { if: F('saw_copycat'), then: [
        ['me', 'Dạ Ba… trên kệ cô Sáu có hàng tên "BA & MẸ", bao bì giống mình y chang, rẻ hơn mười lăm nghìn.'],
        ['hung', 'Ba & Mẹ? Nó chép tên ba? Ba làm hai chục năm…'],
        { c: 'bm_cn_tm', o: [
          { t: '"Mình đã đăng ký nhãn hiệu chưa Ba?"', fx: { uy: 4, rel: { hung: 1 }, set: { trademark: true } }, then: [['hung', 'Đăng ký… cái đó năm 2012 ba định làm. Rồi Tết. Rồi bận.'], ['hung', 'Làm. Làm liền. Con làm hồ sơ với Vy.']] },
          { t: '"Hay mình gọi cô Sáu cắt hàng tụi nó?"', fx: { rel: { hung: 1 }, dr: 2 }, then: [['hung', 'Bả cũng phải sống. Mình làm ngon hơn là được. …Mà tụi nó chép bao bì thì ba không chịu.']] },
        ] },
      ], else: [
        { c: 'bm_cn_ba', o: [
          { t: 'Ngồi nghe Ba kể chuyện chợ năm 2004.', fx: { rel: { hung: 2 }, nl: -3 }, then: [['hung', 'Con là đứa đầu tiên nghe hết mà không coi điện thoại.']] },
          { t: '"Ba có muốn ghé thăm cô Sáu không, con đặt lịch cho Ba."', fx: { rel: { hung: 3 } }, then: [['hung', 'Ừ… thứ Bảy. Đừng nói Má. Má hỏi đi chợ tốn bao nhiêu xăng.']] },
        ] },
      ] },
    ] },
    { who: 'hang', obj: 'Về báo Má tiền thu được', time: '16:00', scene: [
      { if: F('debt_deal'), then: [['hang', 'Mười lăm triệu đợt một, giấy hẹn hai đợt nữa, đổi hàng cận date. Ừ.'], ['think', 'Má không khen. Nhưng Má cất giấy hẹn vô két. Két là chỗ Má cất những gì Má quý.']] },
      { if: F('debt_sit'), then: [['hang', 'Mười triệu. Còn ba mươi sáu. Con ngồi lì được, Má ghi nhận. Mà xoài đâu?'], ['think', 'Chú Bảy ăn hết rồi.']] },
      { if: (r) => !r.flags.debt_deal && !r.flags.debt_sit, then: [['hang', 'Con hỏi chuyện hàng nhái mà quên đòi tiền hả?'], ['me', 'Dạ cô Sáu hứa thứ Hai chuyển mười triệu ạ.'], ['hang', 'Hứa. Má nghe chữ "hứa" ba mươi năm rồi.'], { fx: { rel: { hang: -1 } } }] },
    ] },
  ],
  diary: (s) => `Đi đòi nợ cô Sáu. ${s.flags.debt_deal ? 'Mình thương lượng trả góp và đổi hàng cận date. Má cất giấy hẹn vào két.' : s.flags.debt_sit ? 'Mình ngồi lì tới chiều, thu được mười triệu. Chú Bảy ăn hết xoài.' : 'Mình chưa thu được đồng nào.'} ${s.flags.saw_copycat ? 'Trên kệ có hàng "BA & MẸ" chép bao bì mình.' : ''} Ba kể chuyện cái chợ năm 2004, lần này mình nghe hết.`,
};

const EP_FAMILY = {
  id: 'bm_family', day: 15, title: 'Họp gia đình: ai đúng?',
  intro: 'Thứ Hai. Kevin chạy flash sale khô gà 69K trên sàn, trong khi giá sỉ cho đại lý là 75K.\n\nCuối tuần, ba đại lý gọi điện chửi Ba. Sáng nay Ba tới sớm. Ba chưa bao giờ tới sớm.',
  steps: [
    { who: 'son', obj: '"Họp sáng 8:15" (hôm nay căng)', time: '08:30', pos: STANDUP_POS, scene: [
      ['son', 'Ok team, họp sáng. Time-box mười lăm phút. Hôm qua, Hôm nay, Vướng…'],
      ['hung', 'Vướng là đại lý bỏ mối mình! Time-box cái gì!'],
      ['tuan', 'Dad, sale 69K là để acquire khách mới. Đó là marketing cost.'],
      ['hung', 'Cost của ai? Của bà Ba Bến Tre, bả đi với ba mười năm!'],
      ['son', 'Mình… đưa cái này vào parking lot nha mọi người.'],
      ['hang', 'Parking lot đầy rồi. Mười giờ, phòng họp. Cả nhà. Với con.'],
      ['nar', 'Má nhìn bạn. Bạn chưa hiểu sao mình là "cả nhà".'],
    ] },
    { who: 'dung', obj: 'Tính nhanh với anh Dũng trước giờ họp', time: '09:00', scene: [
      ['dung', 'Em sắp bị hỏi. Anh biết. Hồi xưa anh cũng bị hỏi. Ngồi xuống, tính với anh.'],
      { mini: PRICE_MINI,
        good: [['dung', 'Đúng. Em có con số rồi. Ở nhà này, ai có con số thì Má nghe. Ai có cảm xúc thì Ba nghe.'], { fx: { uy: 3, rel: { dung: 2 }, set: { data_ready: true } } }],
        bad: [['dung', 'Sai một câu cũng không sao. Vô đó nói chậm, nói thật.'], { fx: { rel: { dung: 1 } } }],
      },
    ] },
    { who: 'tuan', obj: 'Kevin kéo ra nói riêng', time: '09:30', scene: [
      ['tuan', 'Bro. Data nói online lời hơn. Mình bỏ đại lý, all-in sàn. Em đứng về phía tương lai, right?'],
      { c: 'bm_fam_kevin', o: [
        { t: '"Dashboard của anh đã trừ phí sàn với hàng hoàn chưa anh?"', fx: { uy: 3, rel: { tuan: -1 } }, then: [['tuan', '…Chưa. That\'s phase 2.'], ['think', 'Phase 2 là phần có tiền thật.']] },
        { t: '"Em nghe hết hai bên rồi mới nói anh."', fx: { rel: { tuan: 1 } }, then: [['tuan', 'Diplomatic. Okay. Nhưng nhớ ai cho em laptop.'], ['think', 'Máy cũ pin 11 phút.']] },
      ] },
    ] },
    { who: 'obj:interview', obj: '10:00 Phòng họp: họp gia đình', time: '10:00', seat: 'mr_seat', pos: FAMILY_ROOM, scene: [
      ['nar', 'Ba ngồi đầu bàn. Má cầm sổ đỏ. Kevin mở máy tính bảng. Không ai uống trà.'],
      ['hung', 'Đại lý là gốc. Không có đại lý thì không có Ba & Má.'],
      ['tuan', 'Online là ngọn. Không có ngọn thì cây chết khô. Pun intended.'],
      ['hung', 'Con nói khô là chết hả? Khô là nghề của nhà này!'],
      ['nar', 'Mười phút. Hai cha con nói cùng lúc. Má đặt cây bút xuống bàn, rất nhẹ. Cả phòng im.'],
      ['hang', 'Con. Con người ngoài. Con nói đi. Ai đúng?'],
      { c: 'bm_fam_who', o: [
        { t: '"Dạ con nghĩ Ba đúng. Đại lý là người đi với mình từ đầu."', fx: { rel: { hung: 3, tuan: -3 }, set: { side_ba: true } }, then: [['hung', 'Đó! Người ngoài còn thấy!'], ['tuan', 'Okay. Noted.'], ['think', 'Kevin sẽ nhớ chữ "noted" này lâu hơn mình.']] },
        { t: '"Dạ con nghĩ anh Kevin đúng. Khách mới nằm trên sàn hết rồi."', fx: { rel: { tuan: 3, hung: -3 }, set: { side_kevin: true } }, then: [['tuan', 'Thank you!'], ['hung', '…'], ['nar', 'Ba đứng dậy, đi thắp nhang Thần Tài. Lâu hơn bình thường.']] },
        { t: '"Giữ cả hai: gói online khác size, khác tên; giá sỉ đại lý giữ nguyên. Đo thử ba tháng."', fx: { uy: 6, rel: { hang: 2, hung: 1, tuan: 1 }, set: { family_bridge: true, sku_split: true } }, then: [
          { if: F('data_ready'), then: [['me', 'Sàn bán 69K, trừ phí còn khoảng 48K. Đại lý 75K. Hai kênh đánh nhau thì cả hai đều lỗ ạ.']] },
          ['nar', 'Ba nhìn Kevin. Kevin nhìn Ba. Má nhìn sổ.'],
          ['hang', 'Ba tháng. Má đo. Hai cha con nghe chưa?'],
          ['hung', '…Ừ.'], ['tuan', '…Okay.'],
          ['think', 'Lần đầu tiên hai người này nói cùng một chữ trong cùng một giây.'],
        ] },
        { t: '"Dạ con là intern, con không dám nói ạ."', fx: { dr: 4, rel: { hang: -1 } }, then: [['hang', 'Intern cũng có miệng. Thôi. Họp tiếp.'], ['nar', 'Họp tiếp thêm bốn mươi phút. Không ai thắng. Má tắt quạt ra về.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Má gọi vô phòng kế toán sau họp', time: '14:00', scene: [
      ['hang', 'Hai cha con nó cãi nhau từ hồi Kevin đi Úc về. Má ngồi giữa mười năm. Ngồi giữa mỏi lưng lắm con.'],
      ['think', 'Lần đầu tiên Má nói một câu không có con số.'],
      { c: 'bm_fam_ma', o: [
        { t: 'Ngồi im nghe Má nói.', fx: { rel: { hang: 2 } }, then: [['hang', 'Thôi. Đi làm đi. Đừng kể ai Má nói câu này. Nhất là cô Tư.']] },
        { t: '"Chi phí quảng cáo của anh Kevin Má có duyệt không ạ?"', fx: { uy: 2, dr: 2 }, then: [['hang', 'Má duyệt mười triệu một tháng. Sao con hỏi?'], ['think', 'Tháng rồi dashboard của Kevin ghi chi ads ba mươi hai triệu.'], { fx: { set: { ads_gap: true } } }] },
      ] },
    ] },
    { who: 'tuan', obj: 'Kevin ghé bàn', time: '16:00', scene: [
      { if: F('family_bridge'), then: [['tuan', 'Honestly… that was smart. Ba gật đầu với anh lần đầu từ 2019. Ba tháng. Anh sẽ làm cho nó đẹp.']] },
      { if: F('side_ba'), then: [['tuan', 'Từ mai em khỏi làm kịch bản cho anh. Anh tự làm. Ba mươi cái. Một mình.']] },
      { if: F('side_kevin'), then: [['tuan', 'You\'re on the right side of history, bro. Mà… đừng đi ngang phòng Ba tuần này.']] },
      { if: (r) => !r.flags.family_bridge && !r.flags.side_ba && !r.flags.side_kevin, then: [['tuan', 'Em im lặng. Smart. Coward, but smart.']] },
      ['nar', 'Trong nhóm chat, Kevin đổi tên nhóm thành "BA & MÁ – Growth Squad 🚀". Ba phút sau, Má đổi lại.'],
    ] },
  ],
  diary: (s) => `Họp gia đình. Má hỏi: "Con người ngoài, con nói đi, ai đúng?" ${s.flags.family_bridge ? 'Mình nói giữ cả hai, tách sản phẩm, đo ba tháng. Ba và Kevin cùng gật đầu, lần đầu từ 2019.' : s.flags.side_ba ? 'Mình đứng về phía Ba. Kevin "noted".' : s.flags.side_kevin ? 'Mình đứng về phía Kevin. Ba đi thắp nhang rất lâu.' : 'Mình không dám nói. Má nói intern cũng có miệng.'} Má bảo ngồi giữa mười năm mỏi lưng lắm.`,
};

const EP_5SAO = {
  id: 'bm_5sao', day: 17, title: '30 cái 5 sao',
  intro: 'Thứ Tư. Shop dính ba đánh giá 1 sao liên tiếp: "Giao chậm", "Khô dai như dép", "Shipper không đẹp trai".\n\nKevin gửi bạn một file tên "nick_phu.xlsx". Mười tài khoản. Mật khẩu đều là ngày sinh của Ba.',
  steps: [
    { who: 'tuan', obj: 'Kevin giao "task growth"', time: '09:00', scene: [
      ['tuan', 'Điểm shop rớt xuống 4.6. Dưới 4.7 là sàn không cho vô campaign 12.12. Em viết giùm anh ba mươi cái 5 sao. Có hình nha.'],
      ['tuan', 'It\'s not fake. It\'s… proactive social proof.'],
      { c: 'bm_5s_task', o: [
        { t: 'Làm. Ba mươi review, mười nick.', fx: { rel: { tuan: 2 }, nl: -8, set: { fake_reviews: true } }, then: [['nar', 'Review thứ 27, bạn hết cách khen. Bạn viết: "Khô ngon như tình đầu, dai như tình cũ".']] },
        { t: 'Từ chối, đề xuất xin review thật từ khách quen kèm voucher.', fx: { uy: 4, rel: { tuan: -2 }, set: { real_reviews: true } }, then: [['tuan', 'Chậm lắm. Real reviews take weeks.'], ['me', 'Dạ, còn review giả bị sàn quét thì mất cả năm ạ.'], ['tuan', '…Okay. Làm đi. Nhưng nhanh.']] },
        { t: 'Làm cho có, mỗi review một câu y chang.', fx: { dr: 6, set: { meme_reviews: true } }, then: [['nar', 'Mười nick, cùng ngày sinh, cùng câu "Khô ngonnn quá xá shop ơi", cùng lúc 9:14.']] },
      ] },
    ] },
    { who: 'mai', obj: 'Chị Mai giữ ba khách 1 sao', time: '10:30', scene: [
      ['mai', 'Để chị xử, em đừng rep. Em rep là khách đòi gặp em hoài, chị mệt.'],
      ['mai', 'Mà nè, ba cái 1 sao: một cái là đối thủ, một cái là khách khó. Còn cái "dai như dép" là… thiệt. Chị ăn rồi.'],
      { c: 'bm_5s_mai', o: [
        { t: '"Vậy mình xin lỗi công khai cái thật, còn hai cái kia báo sàn."', fx: { uy: 3, rel: { mai: 1 } }, then: [['mai', 'Ừ. Em nói giống chị nghĩ. Chị chỉ chưa nói vì chưa ai hỏi.']] },
        { t: '"Chị Mai biết vụ gì mới không?"', fx: { rel: { mai: 2 }, dr: 2 }, then: [['mai', 'Biết chớ. Kevin xài ads vượt ngân sách Má duyệt. Ba lần. Chị không nói đâu. Chị chỉ "share insight".']] },
      ] },
    ] },
    { who: 'tu', obj: 'Đem gói "dai như dép" cho cô Tư nếm', time: '14:00', scene: [
      ['tu', 'Đưa cô.'],
      ['nar', 'Cô Tư nhai. Nhai lâu. Nhai lâu hơn mức một miếng khô nên được nhai.'],
      ['tu', 'Lô này sấy quá tay. Máy sấy số hai, nhiệt kế hư. Cô nói anh Dũng hai lần rồi. Cậu Tám nói "để thằng em sửa".'],
      { c: 'bm_5s_dryer', o: [
        { t: 'Tìm thợ ngoài trên mạng, báo anh Dũng, sửa nhiệt kế trong chiều.', fx: { uy: 4, rel: { tu: 1, dung: 1, cautam: -2 }, set: { dryer_fixed: true } }, then: [['nar', 'Thợ tới lúc 15 giờ, sửa hai mươi phút. Cậu Tám đứng nhìn, nói "thằng em cậu cũng làm được vậy".']] },
        { t: 'Ghi lại, báo cậu Tám.', fx: { rel: { cautam: 1 } }, then: [['cautam', 'Ừ, để thằng em cậu sửa. Nó bận đám cưới, tuần sau.']] },
      ] },
    ] },
    { who: 'tuan', obj: 'Kevin gọi gấp: điểm shop', time: '16:00', scene: [
      { if: F('fake_reviews'), then: [['tuan', 'Sàn quét. Xóa hết ba mươi review. Gửi cảnh cáo "đánh giá không trung thực". Điểm shop 4.4.'], ['tuan', 'How did they know?'], ['think', 'Mười nick cùng ngày sinh của Ba.'], { fx: { dr: 5, uy: -4, rel: { tuan: -1 } } }] },
      { if: F('meme_reviews'), then: [['tuan', 'Khách chụp màn hình mười review y chang, đăng lên group "Review Đồ Ăn". Caption: "shop tự khen hay gì".'], ['nar', 'Bài đăng 3.000 like. Người ta chế meme "Khô ngonnn quá xá" lên hình con gà.'], { fx: { dr: 6, uy: -3 } }] },
      { if: F('real_reviews'), then: [['tuan', 'Mười hai review thật. Có hình mẹ khách ăn khô với cơm. Điểm 4.7. Vừa đủ vô campaign.'], ['tuan', 'Slow. But… it worked. Đừng nói ai anh nói vậy.'], { fx: { uy: 3, rel: { tuan: 2, hang: 1 } } }] },
      { c: 'bm_5s_own', o: [
        { t: 'Nhận phần của mình trong kết quả, nói rõ với Kevin.', fx: { uy: 2, rel: { tuan: 1 } }, then: [['tuan', 'Okay. Lần sau anh hỏi Má trước… không, lần sau anh hỏi em trước.']] },
        { t: 'Rút kinh nghiệm, không nói gì thêm.', fx: { nl: 3 }, then: [['think', 'Mình học được một điều: sàn không đọc review. Sàn đọc ngày sinh.']] },
      ] },
    ] },
  ],
  diary: (s) => `Ba mươi cái 5 sao. ${s.flags.fake_reviews ? 'Mình viết review giả. Sàn quét sạch, shop bị cảnh cáo.' : s.flags.meme_reviews ? 'Mình viết review cho có. Giờ mình là một cái meme.' : 'Mình xin review thật. Chậm, nhưng đủ điểm vô campaign.'} ${s.flags.dryer_fixed ? 'Mình kêu thợ sửa nhiệt kế máy sấy #2.' : 'Máy sấy #2 vẫn đang chờ "thằng em cậu Tám".'}`,
};

const EP_PHISAN = {
  id: 'bm_phisan', day: 18, title: 'Sàn tăng phí',
  intro: 'Thứ Năm. Sàn Xốp Pi và TíchTắc Shop cùng gửi thông báo "điều chỉnh biểu phí". Chị Mai chửi một câu rồi im.\n\nMá in thông báo ra giấy, đọc bằng kính lúp, rồi gọi bạn vô phòng.',
  steps: [
    { who: 'hang', obj: 'Má gọi: "Sao sàn trừ nhiều vậy?"', time: '08:30', scene: [
      ['hang', 'Đơn một trăm nghìn mà tiền về có bảy chục. Ba chục kia đi đâu? Con giải thích cho Má.'],
      { mini: FEE_MINI,
        good: [['hang', 'Hoa hồng, thanh toán, affiliate, voucher. Bốn đứa ăn chia với Má. Má hiểu rồi. Má không vui, nhưng Má hiểu.'], { fx: { uy: 3, rel: { hang: 2 }, set: { fee_math: true } } }],
        bad: [['hang', 'Con nói Má nghe không hiểu. Kevin nói Má cũng không hiểu. Má bắt đầu nghĩ là không ai hiểu.'], { fx: { rel: { hang: -1 } } }],
      },
    ] },
    { who: 'tuan', obj: 'Kevin có "chiến lược"', time: '10:00', scene: [
      ['tuan', 'Không tăng giá. Tăng ads. Volume sẽ cover fee. Scale, bro.'],
      { c: 'bm_fee_kevin', o: [
        { t: '"Tiền ads tháng rồi lấy từ đâu vậy anh? Má duyệt mười triệu mà."', when: (r) => !!(r.flags.ads_gap || r.flags.tie_kevin_loan), fx: { dr: 4, set: { kevin_loan_known: true } }, then: [['tuan', '…Who told you?'], ['tuan', 'Anh vay. Bạn anh ở Úc. Anh sẽ trả khi ROAS lên. Đừng nói Má. Please.']] },
        { t: '"Volume tăng thì phí cũng tăng theo mà anh."', fx: { uy: 2, rel: { tuan: -1 } }, then: [['tuan', 'Ugh. You sound like my mom.'], ['think', 'Đó là lời khen hay lời chê, chính Kevin cũng không biết.']] },
        { t: '"Dạ anh nói đúng ạ. Scale."', fx: { rel: { tuan: 2 } }, then: [['tuan', 'Finally, someone gets it.']] },
      ] },
    ] },
    { who: 'khoa', obj: 'Anh Khoa có file Excel "thật"', time: '11:00', scene: [
      ['khoa', 'Lại đây. Nhỏ tiếng.'],
      ['khoa', 'Dashboard của Kevin không trừ phí sàn, không trừ hoàn. Anh tính lại bằng Excel. Bốn mươi phần trăm doanh thu sàn đi vô phí.'],
      ['khoa', 'Anh là "Data & AI Lead". Data là Excel. AI là anh.'],
      { c: 'bm_fee_khoa', o: [
        { t: '"Anh cho em mang file này vô họp, ghi tên anh."', fx: { uy: 2, rel: { khoa: 3 }, set: { khoa_data: true } }, then: [['khoa', 'Ghi tên anh hả? …Ba năm rồi chưa ai ghi tên anh vô cái gì.']] },
        { t: '"Anh tự đưa Má đi, em sợ."', fx: { rel: { khoa: 1 } }, then: [['khoa', 'Anh cũng sợ. Đó là lý do file này nằm trong máy anh tám tháng.']] },
      ] },
    ] },
    { who: 'hung', obj: 'Phòng Ba: chốt phương án', time: '14:00', scene: [
      ['hung', 'Hồi xưa ba bán chợ có cần sàn đâu. Giờ sàn ăn ba chục phần trăm. Bỏ sàn!'],
      { if: F('khoa_data'), then: [['me', 'Dạ, số của anh Khoa: sàn ra khách mới, nhưng khách cũ thì mình đang trả phí oan.']] },
      { c: 'bm_fee_plan', o: [
        { t: 'Combo 3 gói tăng giá trị đơn, tăng giá lẻ 5K.', fx: { uy: 4, rel: { hang: 1, tuan: 1 }, set: { fee_solution: 'combo' } }, then: [['hung', 'Ba gói một lần. Ừ, hồi xưa ở chợ ba cũng bán "ba bịch hai chục".'], ['think', 'Mọi ý tưởng mới ở đây đều đã có ở chợ năm 2004.']] },
        { t: 'Khách quen đặt trực tiếp qua Má, sàn chỉ để kéo khách mới.', fx: { uy: 4, rel: { hang: 2, hung: 1 }, set: { fee_solution: 'direct' } }, then: [['hang', 'Khách quen về Má. Má thích. Má nhắn từng người.'], ['tuan', 'Okay, đó là… CRM. Ba Má làm CRM bằng điện thoại. Fine.']] },
        { t: 'Bỏ sàn luôn như Ba nói.', fx: { rel: { hung: 3, tuan: -3 }, dr: 4, set: { fee_solution: 'cut' } }, then: [['tuan', 'Dad, NO.'], ['hung', 'Ba nói rồi. Người ngoài cũng thấy.'], ['think', 'Mình vừa tạo ra một cuộc họp gia đình mới.']] },
      ] },
    ] },
    { who: 'tuan', obj: 'Kevin chặn ở hành lang', time: '16:00', scene: [
      { if: F('kevin_loan_known'), then: [
        ['tuan', 'About the loan… Please. Nếu Má biết, Má cắt anh khỏi công ty. Mà anh không biết làm gì khác ngoài cái này.'],
        { c: 'bm_fee_loan', o: [
          { t: 'Giữ bí mật.', fx: { rel: { tuan: 3 }, set: { keep_kevin_secret: true } }, then: [['tuan', 'I owe you one. Big one.']] },
          { t: '"Anh tự nói với Má đi. Em đi với anh."', fx: { uy: 4, rel: { tuan: 1, hang: 1 }, set: { kevin_confess: true } }, then: [['nar', 'Kevin đứng trước cửa phòng Má năm phút. Rồi gõ cửa. Hai mươi phút sau, Kevin đi ra, mắt đỏ, nhưng nhẹ người.'], ['hang', '(vọng ra) Trả góp. Mỗi tháng. Má ghi sổ.']] },
          { t: 'Báo Má.', fx: { rel: { tuan: -4, hang: 2 }, dr: 5, set: { told_loan: true } }, then: [['nar', 'Chiều đó cả công ty nghe tiếng Má qua hai lớp cửa. Ba đi thắp nhang. Kevin không nhìn bạn suốt tuần.']] },
        ] },
      ], else: [
        ['tuan', 'Anyway. Nếu sàn tăng phí nữa, anh sẽ… anh không biết. Anh chỉ biết làm sàn.'],
        ['think', 'Lần đầu Kevin nói "anh không biết". Nghe giống người thật.'],
        { fx: { rel: { tuan: 1 } } },
      ] },
    ] },
  ],
  diary: (s) => `Sàn tăng phí. ${s.flags.fee_math ? 'Mình giải thích cho Má từng khoản phí.' : 'Má vẫn không hiểu tiền đi đâu. Mình cũng vậy.'} ${({ combo: 'Chốt combo 3 gói.', direct: 'Khách quen về đặt thẳng với Má.', cut: 'Ba muốn bỏ sàn. Kevin muốn bỏ nhà.' })[s.flags.fee_solution] || ''} ${s.flags.kevin_confess ? 'Kevin tự khai vụ vay tiền với Má.' : s.flags.keep_kevin_secret ? 'Mình giữ bí mật của Kevin.' : ''}`,
};

const EP_MOC = {
  id: 'bm_moc', day: 22, title: 'Clip "khô có lông xanh"',
  intro: 'Thứ Hai. Một clip trên TíchTắc: gói khô gà mở ra có một lớp lông xanh. 300 nghìn lượt xem. Comment top: "ăn vô nhập viện luôn".\n\nSố lô in trên bao là của tuần máy sấy #2 bị hư.',
  steps: [
    { who: 'mai', obj: 'Chị Mai: inbox nổ tung', time: '08:30', scene: [
      ['mai', 'Ba trăm tin nhắn từ 6 giờ sáng. Có người hỏi "shop còn sống không". Chị đang sống. Hơi thôi.'],
      ['mai', 'Đừng rep gì hết. Chưa có lệnh của nhà.'],
      { c: 'bm_moc_mai', o: [
        { t: '"Mình xin số lô từ khách trước đã chị."', fx: { uy: 2, rel: { mai: 1 } }, then: [['mai', 'Có rồi. Lô G-0917. Tuần máy sấy #2 hư.']] },
        { t: '"Chị cho em đọc comment với."', fx: { nl: -5 }, then: [['nar', 'Comment thứ 4: "bữa tui ăn khô shop này ngon lắm mà?" Comment thứ 5: "chắc mua nhầm Ba Và Mẹ á".']] },
      ] },
    ] },
    { who: 'tuan', obj: 'Kevin có "kế hoạch xử lý khủng hoảng"', time: '09:00', scene: [
      ['tuan', 'Plan: inbox riêng khách, xin gỡ clip, tặng năm hộp quà. Silent, fast, clean.'],
      { c: 'bm_moc_plan', o: [
        { t: 'Rep công khai: xin lỗi, xin số lô, hoàn tiền và gửi bù.', fx: { uy: 5, dr: -2, rel: { tuan: -1, mai: 1 }, set: { mold_public: true } }, then: [['tuan', 'Public? Mình nhận lỗi trước 300 nghìn người?'], ['me', 'Dạ, 300 nghìn người đã thấy lỗi rồi. Giờ họ chờ coi mình làm gì.']] },
        { t: 'Làm theo Kevin: inbox riêng, đổi quà lấy gỡ clip.', fx: { rel: { tuan: 2 }, set: { mold_bribe: true } }, then: [['nar', 'Bạn gửi tin nhắn. Khách xem lúc 9:12. Không trả lời.']] },
        { t: 'Truy lô trong kho trước, chưa nói gì.', fx: { uy: 2, set: { mold_trace: true } }, then: [['tuan', 'Okay but fast. Internet không chờ ai.']] },
      ] },
    ] },
    { who: 'bay', obj: 'Xuống kho truy lô với chú Bảy', time: '10:30', scene: [
      ['bay', 'Lô G-0917 hả? Cậu Tám kêu xuất trước. Cậu nói lô đó "sấy bù bằng phơi gió" nên phải bán lẹ.'],
      ['bay', 'Chú nói rồi đó. Đừng nói chú nói. Cái gì hư, người đầu tiên bị nghi là chú.'],
      ['nar', 'Kho không xếp theo hạn. Thùng mới ngay cửa, thùng cũ nằm trong cùng. Mít sấy "cậu Tám gửi" nằm riêng một góc.'],
      { mini: FEFO_MINI,
        good: [['bay', 'Con xếp vậy chú mới thấy: hàng cũ nằm trong cùng hai tháng nay. Từ giờ chú xếp theo hạn.'], { fx: { uy: 3, rel: { bay: 2 }, set: { fefo_fixed: true } } }],
        bad: [['bay', 'Ừ… để chú coi lại. Mà chú không bao giờ coi lại. Con biết mà.'], { fx: { rel: { bay: 1 } } }],
      },
    ] },
    { who: 'hang', obj: 'Má hỏi: lỗi của ai?', time: '14:00', scene: [
      ['hang', 'Kho là của Bảy. Hàng mốc ra từ kho. Vậy lỗi của Bảy.'],
      ['nar', 'Ngoài cửa, chú Bảy đứng nghe. Chú không vào.'],
      { c: 'bm_moc_blame', o: [
        { t: 'Bênh chú Bảy: lô này cậu Tám ra lệnh xuất, máy sấy #2 hư nhiệt kế.', fx: { uy: 3, rel: { bay: 4, cautam: -2, hang: -1 }, set: { bay_defended: true } }, then: [['hang', 'Thằng Tám kêu xuất? …Ừ. Má hỏi nó.'], ['nar', 'Chú Bảy đi khỏi cửa. Lát sau, trên bàn bạn có một ly cà phê sữa đá, không ai nhận là của ai.']] },
        { t: 'Im lặng.', fx: { rel: { bay: -2 } }, then: [['hang', 'Vậy Bảy bị trừ một tuần lương.'], ['think', 'Chú Bảy đã nói: cái gì hư, người đầu tiên bị nghi là chú.']] },
        { t: '"Dạ lỗi là quy trình kho không theo hạn, Má. Con đã xếp lại rồi."', when: F('fefo_fixed'), fx: { uy: 4, rel: { hang: 1, bay: 2 } }, then: [['hang', 'Quy trình. Ừ. Quy trình thì không trừ lương được. Thôi.']] },
      ] },
    ] },
    { who: 'call:khach', obj: 'Gọi lại cho khách đăng clip', time: '16:00', call: { title: 'Ba & Má <> Khách (clip lông xanh)', people: ['khach', 'mai', 'me'] }, scene: [
      { if: F('mold_bribe'), then: [
        ['khach', 'Em là người nhắn tin xin gỡ clip đổi năm hộp quà hả? Chị chụp màn hình rồi. Phần 2 lên lúc 7 giờ tối nha.'],
        ['nar', 'Phần 2: "Shop đòi mua chuộc". 900 nghìn lượt xem.'],
        { fx: { dr: 8, uy: -4 } },
      ], else: [
        ['khach', 'Chị thấy shop xin lỗi rồi. Chị chỉ muốn biết sao lại mốc.'],
        ['me', 'Dạ, lô đó sấy lúc máy bị hư nhiệt kế, kho xuất sai thứ tự. Tụi em đã sửa máy và xếp kho theo hạn. Em gửi chị hoàn tiền và gói mới.'],
        ['khach', 'Nói thật vậy thì được. Chị đăng cập nhật cho mọi người biết.'],
        { fx: { uy: 4, dr: -2, set: { mold_ok: true } } },
      ] },
    ] },
  ],
  diary: (s) => `Clip lông xanh. ${s.flags.mold_bribe ? 'Mình làm theo Kevin, xin gỡ clip đổi quà. Giờ có phần 2: "shop đòi mua chuộc".' : 'Mình nói thật với khách. Khách đăng cập nhật.'} ${s.flags.bay_defended ? 'Mình bênh chú Bảy. Trên bàn có ly cà phê sữa đá.' : ''} ${s.flags.fefo_fixed ? 'Kho giờ xếp theo hạn.' : ''}`,
};

const EP_CANDATE = {
  id: 'bm_candate', day: 24, title: 'Làm mới hàng cận date',
  intro: 'Thứ Tư. Kiểm kho xong, còn 800 gói khô heo cháy tỏi cận date. Má nhìn con số như nhìn đứa con đi lạc.\n\n"Khô mà con. Để lâu có sao đâu. Bóc nhãn, đóng túi mới, in date mới."',
  steps: [
    { who: 'hang', obj: 'Má giao việc "làm mới" 800 gói', time: '08:30', scene: [
      ['hang', 'Tám trăm gói, mỗi gói bốn chục nghìn. Ba mươi hai triệu. Má không vứt ba mươi hai triệu vô thùng rác.'],
      ['hang', 'Bóc nhãn, đóng túi mới, in date mới. Chiều xong.'],
      { c: 'bm_cd_order', o: [
        { t: '"Dạ để con tính phương án, trưa con báo Má."', fx: { uy: 2 }, then: [['hang', 'Phương án gì? Má có phương án rồi. …Thôi được, trưa.']] },
        { t: '"Dạ con làm liền."', fx: { rel: { hang: 1 }, nl: -5, set: { relabel_start: true } }, then: [['nar', 'Bạn bóc được hai mươi gói. Mùi tỏi cháy và cảm giác tội lỗi bám vào tay.']] },
        { t: '"Má ơi, cái này phạm luật đó Má."', fx: { rel: { hang: -2 }, uy: 2 }, then: [['hang', 'Luật nào? Luật của ai? Luật có trả ba mươi hai triệu cho Má không?']] },
      ] },
    ] },
    { who: 'vy', obj: 'Chị Vy kéo ra góc lễ tân', time: '09:30', scene: [
      ['vy', 'Em nghe chị. Đổi date là ghi nhãn sai sự thật. Lộ ra là phạt nặng, có khi bị tịch thu, đình chỉ. Chị là người ký hồ sơ.'],
      ['nar', '(Thông tin giải trí, không phải tư vấn pháp lý.)'],
      ['vy', 'Nếu Má bắt làm, chị nghỉ. Chị nói thiệt. Chief Happiness Officer cũng có giới hạn hạnh phúc.'],
      { c: 'bm_cd_vy', o: [
        { t: '"Chị đừng nghỉ. Để em tìm cách khác."', fx: { rel: { vy: 2 } }, then: [['vy', 'Ừ. Em có hai tiếng. Sau đó chị viết đơn.']] },
        { t: '"Chị nói với Má giùm em được không?"', fx: { rel: { vy: 1 } }, then: [['vy', 'Chị nói rồi. Ba lần. Má nghe chị như nghe radio.']] },
      ] },
    ] },
    { who: 'mi', obj: 'Út Mi có ý tưởng', time: '10:30', scene: [
      ['mi', 'Em ơi, live "xả cận date"! Ghi rõ hạn, giá một nửa. Shop khác làm, khách khen thật thà, chốt ầm ầm.'],
      ['mi', 'Chị nói Má thì Má nói "con Út biết gì". Em nói đi. Má nghe em hơn.'],
      { c: 'bm_cd_mi', o: [
        { t: 'Lên kịch bản live "xả cận date" với Út Mi.', fx: { uy: 2, rel: { mi: 2 }, set: { clearance_plan: true } }, then: [['mi', 'Tiêu đề: "Khô heo sắp hết hạn, nhưng tình mình thì chưa". Ok không?'], ['think', 'Không ok. Nhưng sẽ bán được.']] },
        { t: '"Hay tặng kèm cho đơn combo?"', fx: { rel: { mi: 1 } }, then: [['mi', 'Cũng được. Nhưng tám trăm gói thì tặng tới Tết năm sau.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Trưa: báo Má phương án', time: '13:30', scene: [
      ['hang', 'Sao? Phương án của con đâu?'],
      { c: 'bm_cd_decide', o: [
        { t: 'Làm theo Má: đóng túi mới, in date mới.', fx: { rel: { hang: 2 }, dr: 8, nl: -10, set: { relabel_done: true } }, then: [['hang', 'Vậy đó. Có gì đâu.'], ['nar', 'Chiều đó chị Vy dọn bàn. Chị Vy không nói gì. Chị Vy để lại cho bạn cây bút.'], { fx: { rel: { vy: -3 } } }] },
        { t: 'Live "xả cận date": ghi rõ hạn, giá một nửa.', when: F('clearance_plan'), fx: { uy: 6, rel: { hang: 1, mi: 2, vy: 2 }, set: { clearance_live: true } }, then: [['hang', 'Bán nửa giá? Mười sáu triệu.'], ['me', 'Dạ, mười sáu triệu, không ai bị phạt, khách khen mình thật thà ạ.'], ['hang', '…Còn hơn bán cho chuột. Ừ.']] },
        { t: 'Giảm giá, ghi rõ hạn, bán cho đại lý bán lẻ nhanh.', when: (r) => !r.flags.clearance_plan, fx: { uy: 4, rel: { hang: 1, dung: 1 }, set: { clearance_live: true } }, then: [['dung', 'Mấy đại lý chợ lấy hết. Họ bán trong tuần. Ghi rõ hạn, không ai chửi.'], ['hang', 'Ừ. Đỡ hơn bỏ.']] },
        { t: 'Nói Má: chị Vy sẽ nghỉ nếu làm.', fx: { rel: { hang: -3, vy: 2 }, dr: 3, set: { vy_threat: true } }, then: [['hang', 'Vy dọa Má hả? …Thôi. Không làm. Bỏ.'], ['think', 'Má rút lệnh. Nhưng Má ghi một dòng vô sổ đỏ. Dòng đó có tên mình.']] },
      ] },
    ] },
    { who: 'bay', obj: 'Cuối ngày ở kho', time: '17:00', scene: [
      { if: F('relabel_done'), then: [['bay', 'Chú làm theo lệnh. Nhưng chú ghi số lô cũ vô sổ riêng. Lỡ mai mốt có ai hỏi.'], ['think', 'Ở đây ai cũng có một cuốn sổ riêng.']] },
      { if: F('clearance_live'), then: [['bay', 'Tám trăm gói đi hết rồi. Kho thoáng. Chú thở được.'], { fx: { rel: { bay: 1 } } }] },
      { if: F('vy_threat'), then: [['bay', 'Chị Vy nói cảm ơn con. Mà Má nói tên con hai lần trong bữa cơm chiều. Không phải khen.']] },
      { if: (r) => !r.flags.relabel_done && !r.flags.clearance_live && !r.flags.vy_threat, then: [['bay', 'Tám trăm gói vẫn nằm đó. Má nói "để tính". Để tính là để tới hết hạn luôn.']] },
    ] },
  ],
  diary: (s) => `800 gói cận date. ${s.flags.relabel_done ? 'Mình đã in date mới. Chị Vy để lại cho mình cây bút.' : s.flags.clearance_live ? 'Mình đề xuất bán xả, ghi rõ hạn. Hết sạch, không ai bị phạt.' : s.flags.vy_threat ? 'Má rút lệnh vì chị Vy. Má ghi tên mình vào sổ đỏ.' : 'Chưa ai quyết gì.'}`,
};

const EP_KIEMTRA = {
  id: 'bm_kiemtra', day: 25, title: 'Đoàn kiểm tra tới sớm',
  intro: 'Thứ Năm, 8:40. Ba người áo sơ mi trắng, kẹp hồ sơ, đứng ở quầy lễ tân: "Đoàn kiểm tra liên ngành về an toàn thực phẩm."\n\nPhiếu kiểm nghiệm khô bò hết hạn hai tuần. Chị Vy đã nhắc ba lần.',
  steps: [
    { who: 'vy', obj: 'Ra quầy lễ tân: đoàn kiểm tra tới', time: '08:40', scene: [
      ['doan', 'Chào em. Đoàn kiểm tra định kỳ. Cho anh xem giấy chứng nhận cơ sở đủ điều kiện, hồ sơ tự công bố, phiếu kiểm nghiệm.'],
      ['vy', '(thì thào) Phiếu khô bò hết hạn hai tuần. Chị nhắc ba lần. Ba lần!'],
      ['nar', 'Trong phòng kế toán, Má đứng dậy. Má đứng dậy rất ít khi.'],
    ] },
    { who: 'hang', obj: 'Má ra hiệu gọi vô phòng', time: '08:50', scene: [
      ['hang', '(nhỏ) Con ra nói Vy đi vắng, hồ sơ Vy giữ, chiều quay lại. Đi.'],
      { c: 'bm_kt_lie', o: [
        { t: 'Làm theo Má.', fx: { rel: { hang: 1 }, dr: 6, set: { inspect_lie: true } }, then: [['doan', 'Chị Vy đi vắng? Chị Vy đang đứng sau em mà.'], ['vy', '…Dạ em đây.'], ['doan', 'Ghi biên bản: cơ sở không hợp tác. Em mở hồ sơ ra cho anh.']] },
        { t: 'Đưa hồ sơ thật, nhận thiếu sót, xin gia hạn bổ sung.', fx: { uy: 5, rel: { vy: 3, hang: -2 }, set: { inspect_honest: true } }, then: [['doan', 'Phiếu hết hạn hai tuần. Có thiếu sót, ghi biên bản nhắc nhở, yêu cầu bổ sung. Em làm việc rõ ràng, anh ghi nhận.'], ['hang', '(trong phòng) …']] },
        { t: 'Đi pha trà mời đoàn, câu giờ.', fx: { nl: -6, rel: { tu: 1 } }, then: [
          ['tu', 'Để cô. Trà cô pha, ai uống cũng ngồi thêm ba mươi phút.'],
          ['nar', 'Đoàn uống trà. Ba mươi phút. Rồi trưởng đoàn đặt ly xuống: "Giờ mình xem hồ sơ nha."'],
          { c: 'bm_kt_lie2', o: [
            { t: 'Đưa hồ sơ thật.', fx: { uy: 4, rel: { vy: 2, hang: -1 }, set: { inspect_honest: true } }, then: [['doan', 'Có thiếu sót, ghi nhắc nhở. Trà ngon.']] },
            { t: 'Nói chị Vy đi vắng.', fx: { dr: 6, set: { inspect_lie: true } }, then: [['doan', 'Chị Vy vừa rót trà cho anh mà em.']] },
          ] },
        ] },
      ] },
    ] },
    { who: 'tu', obj: 'Đoàn kiểm tra bếp và mẫu lưu', time: '09:30', scene: [
      ['doan', 'Mẫu lưu đâu? Sổ theo dõi nhiệt độ máy sấy đâu?'],
      ['tu', 'Mẫu lưu tủ này. Có nhãn ngày. Bếp này cô lau hai mươi sáu năm.'],
      { if: F('dryer_fixed'), then: [['doan', 'Máy sấy số hai có biên bản sửa nhiệt kế. Tốt.'], { fx: { uy: 2 } }], else: [['doan', 'Nhiệt kế máy sấy số hai hư? Ghi.'], { fx: { dr: 2 } }] },
      { if: F('relabel_done'), then: [
        ['doan', 'Gói khô heo này, túi mới, date mới, mà số lô in dưới đáy là lô tháng Năm. Giải thích giùm anh.'],
        ['nar', 'Không ai giải thích được. Chú Bảy nhìn xuống đất. Má nhìn lên trần.'],
        { fx: { dr: 12, uy: -6, set: { caught_relabel: true } } },
      ] },
    ] },
    { who: 'dung', obj: 'Đoàn xuống xưởng xem nguyên liệu', time: '11:00', scene: [
      ['doan', 'Hóa đơn, chứng từ nguồn gốc thịt nhập tháng này.'],
      { if: F('meat_reported'), then: [
        ['dung', 'Mối cũ, hóa đơn đầy đủ, giấy kiểm dịch bản rõ. Anh giữ bản sao mười năm.'],
        ['doan', 'Đầy đủ. Tốt.'],
        { fx: { uy: 3, rel: { dung: 1 } } },
      ], else: [
        ['nar', 'Trong góc tủ đông có hai thùng xốp, giấy kiểm dịch mờ tới mức chỉ đọc được chữ "dịch".'],
        ['doan', 'Hai thùng này giấy tờ đâu?'],
        ['cautam', 'Dạ… mối gửi sau ạ.'],
        ['doan', 'Niêm phong. Lấy mẫu. Ghi biên bản.'],
        { fx: { dr: 10, uy: -3, set: { caught_meat: true } } },
      ] },
    ] },
    { who: 'hung', obj: 'Đoàn về. Ba gọi vô phòng', time: '15:00', scene: [
      { if: (r) => !!(r.flags.caught_relabel || r.flags.caught_meat), then: [
        ['hung', 'Biên bản dày ba trang. Ba làm khô hai mươi năm, lần đầu có biên bản dày hơn sổ của Má.'],
        ['hung', 'Ba không trách con. Ba trách cái nhà này. Mà cái nhà này là ba.'],
        { fx: { rel: { hung: 1 } } },
      ], else: [
        ['hung', 'Biên bản nhắc nhở một trang. Ba đọc rồi.'],
        { if: F('inspect_honest'), then: [['hung', 'Má giận con. Kệ. Ba thấy con đưa hồ sơ thật. Hồi xưa ba bán chợ, ba cũng không giấu cân.'], { fx: { rel: { hung: 3 } } }] },
      ] },
      { c: 'bm_kt_after', o: [
        { t: 'Đề xuất gửi kiểm nghiệm ngay, lập lịch nhắc hạn giấy tờ cho chị Vy.', fx: { uy: 4, rel: { vy: 2, hung: 1 }, set: { lab_renewed: true } }, then: [['hung', 'Làm. Lịch nhắc dán lên tường. Dán kế bên tờ "từ cấm" của ba.']] },
        { t: '"Dạ để anh Kevin note lại, quý sau mình xử ạ."', fx: { dr: 3, rel: { tuan: 1 } }, then: [['tuan', '(vọng vào) Noted! Q1 next year!'], ['think', 'Quý sau. Như lần trước. Như lần trước nữa.']] },
      ] },
    ] },
  ],
  diary: (s) => `Đoàn kiểm tra tới. ${s.flags.inspect_honest ? 'Mình đưa hồ sơ thật. Biên bản nhắc nhở, Má giận, Ba âm thầm khen.' : s.flags.inspect_lie ? 'Mình nói chị Vy đi vắng trong khi chị Vy đứng ngay sau lưng.' : ''} ${s.flags.caught_relabel ? 'Gói khô heo date mới bị phát hiện.' : ''} ${s.flags.caught_meat ? 'Hai thùng thịt của cậu Tám bị niêm phong.' : ''} ${s.flags.lab_renewed ? 'Phiếu kiểm nghiệm đã gửi làm lại.' : ''}`,
};

const EP_BOCPHOT = {
  id: 'bm_bocphot', day: 29, title: 'Bóc phốt "thịt trâu"',
  intro: 'Thứ Hai. Một nick tên "Review Có Tâm 2026" đăng bài: "BA & MÁ DÙNG THỊT TRÂU GIẢ BÒ", kèm ảnh một cái xưởng. Không phải xưởng của mình.\n\nBài được chia sẻ 4.000 lần. Shop "Ba Và Mẹ" vào comment đầu tiên: "Tụi mình thì chỉ dùng bò thật nha."',
  steps: [
    { who: 'mai', obj: 'Chị Mai: "Em coi chưa?!"', time: '08:30', scene: [
      ['mai', 'Em coi chưa?! Chị coi từ 5 giờ sáng. Chị đọc hết 1.200 comment. Chị là trạm phát sóng mà hôm nay chị bị phát sóng ngược.'],
      ['mai', 'Nick này lập ba ngày trước. Bài đầu tiên. Bạn bè duy nhất là… admin shop Ba Và Mẹ.'],
      { c: 'bm_bp_mai', o: [
        { t: '"Chị chụp màn hình hết lại giùm em, đừng comment gì."', fx: { uy: 2, rel: { mai: 1 } }, then: [['mai', 'Chụp rồi. Chị chụp từ trước khi em hỏi. Chị là chuyên gia.']] },
        { t: '"Chị đừng đăng gì lên trang cá nhân nha."', fx: { rel: { mai: -1 }, dr: -1 }, then: [['mai', '…Chị mới xóa cái story. Hai phút. Có 40 người xem.']] },
      ] },
    ] },
    { who: 'khoa', obj: 'Anh Khoa lần ra nguồn ảnh', time: '09:30', scene: [
      ['khoa', 'Ảnh xưởng trong bài lấy từ một bài báo năm 2024, về một cơ sở khác. Anh tìm ra trong bảy phút.'],
      ['khoa', 'Anh là "Data & AI Lead". Hôm nay anh xứng đáng với cái chức đó.'],
      { fx: { rel: { khoa: 1 }, set: { photo_traced: true } } },
    ] },
    { who: 'cautam', obj: 'Cậu Tám đứng ngồi không yên', time: '10:30', scene: [
      { if: F('meat_silent'), then: [
        ['cautam', '(nhỏ) Con… lô thịt hồi đó… nó vô khô bò lô B19 rồi. Bán gần hết rồi.'],
        ['think', 'Bài bóc phốt dùng ảnh giả. Nhưng nó có thể đúng một nửa.'],
        { fx: { set: { twist_meat: true } } },
      ], else: [
        ['cautam', 'Hên mà con báo hồi đó. Lô thịt kia cậu trả rồi. Giờ ai hỏi, giấy tờ mình đủ.'],
        ['cautam', 'Cậu… cảm ơn. Đừng nói ai cậu nói câu này.'],
        { fx: { rel: { cautam: 3 } } },
      ] },
    ] },
    { who: 'obj:interview', obj: 'Phòng họp: cả nhà họp khẩn', time: '14:00', seat: 'mr_seat', pos: FAMILY_ROOM, scene: [
      ['hung', 'Ba làm khô hai chục năm. Lần đầu có người nói ba bán đồ giả.'],
      ['tuan', 'Mình cần response trong 2 tiếng. Sau 2 tiếng là thuật toán quyết thay mình.'],
      ['hang', 'Con nói đi. Lần này Má nghe con trước.'],
      { c: 'bm_bp_plan', o: [
        { t: 'Đăng clip quy trình xưởng thật, hóa đơn thịt, phiếu kiểm nghiệm, và nguồn gốc ảnh giả.', fx: { uy: 4, rel: { hung: 2 }, set: { bp_transparent: true } }, then: [
          { if: (r) => !!(r.flags.lab_renewed || r.flags.inspect_honest), then: [['nar', 'Phiếu kiểm nghiệm mới còn thơm mực. Clip được chia sẻ nhiều hơn bài bóc phốt. Comment: "shop đưa giấy tờ luôn, xịn".'], { fx: { uy: 6, dr: -4 } }],
            else: [['nar', 'Clip đẹp, nhưng có người zoom vô phiếu kiểm nghiệm: "phiếu hết hạn rồi shop ơi". Nửa thắng, nửa thua.'], { fx: { dr: 3 } }] },
        ] },
        { t: 'Đăng bài đanh đá chửi lại "Ba Và Mẹ".', fx: { dr: 10, rel: { mi: 1, hang: -1 }, set: { bp_fight: true } }, then: [['nar', 'Hai shop chửi nhau ba ngày. Báo mạng viết bài "Drama khô gà". Đơn của cả hai shop đều tăng. Ba không vui.']] },
        { t: 'Báo cáo sàn vi phạm và nộp hồ sơ nhãn hiệu.', fx: { uy: 3, nl: -5, set: { bp_report: true } }, then: [
          { if: F('trademark'), then: [['nar', 'Hồ sơ nhãn hiệu đã nộp từ tuần trước nhờ vụ cô Sáu. Sàn gỡ bài và gỡ luôn gian hàng "Ba Và Mẹ" vì chép bao bì.'], { fx: { uy: 5 } }],
            else: [['nar', 'Sàn trả lời: "Đã tiếp nhận, xử lý trong 7–15 ngày làm việc." Bài vẫn được chia sẻ.']] },
        ] },
        { t: 'Nói thật với Ba Má về lô thịt cậu Tám trước, rồi mới tính.', when: F('twist_meat'), fx: { uy: 6, dr: 5, rel: { hung: 2, hang: 1, cautam: -4 }, set: { told_meat: true } }, then: [['nar', 'Phòng họp im lặng một phút. Má gỡ kính ra. Ba đứng dậy.'], ['hung', 'Thu hồi lô B19. Hoàn tiền hết. Ba tự quay clip xin lỗi.'], ['hang', 'Thu hồi… bao nhiêu tiền? …Thôi. Làm đi.']] },
      ] },
    ] },
    { who: 'hung', obj: 'Ba ngồi một mình ở phòng', time: '16:30', scene: [
      ['nar', 'Ba ngồi trước dĩa khô gà, không ăn.'],
      { if: (r) => !!(r.flags.iv_mientay || r.flags.tie_recipe_sadec), then: [['hung', 'Ba kể con nghe. Công thức này… ba học của một bà bán khô ở Sa Đéc. Ba gọi là gia truyền vì bả coi ba như con.'], ['hung', 'Ba sợ người ta nói ba giả. Vì có một phần… ba cũng thấy mình giả.']] },
      { c: 'bm_bp_ba', o: [
        { t: '"Ba học công thức, nhưng hai mươi năm làm ngon là của Ba."', fx: { rel: { hung: 3 } }, then: [['hung', '…Con nói câu đó, Má nghe chắc Má trừ lương con vì nói hay quá.']] },
        { t: 'Đề xuất Ba quay clip kể chuyện hồi xưa, thật hết.', fx: { uy: 3, rel: { hung: 2 }, set: { ba_clip: true } }, then: [
          { if: F('ba_story_clip'), then: [['hung', 'Con nói vụ này từ hồi live. Ba nhớ.']] },
          ['nar', 'Tối đó, Ba quay một clip: "Hồi xưa ba gánh khô ra chợ…". Lần đầu tiên câu đó không làm ai thở dài. 1,2 triệu lượt xem.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Bị bóc phốt "thịt trâu". ${s.flags.told_meat ? 'Mình nói thật lô thịt của cậu Tám. Ba thu hồi lô B19.' : s.flags.bp_transparent ? 'Mình đề xuất đưa hết giấy tờ ra.' : s.flags.bp_fight ? 'Hai shop chửi nhau ba ngày. Báo gọi là "Drama khô gà".' : 'Mình báo sàn.'} ${s.flags.ba_clip ? 'Clip "hồi xưa" của Ba được 1,2 triệu lượt xem.' : ''} Ba nói ông học công thức ở Sa Đéc.`,
};

const EP_DUNG = {
  id: 'bm_dung', day: 31, title: 'Anh Dũng và ngọn núi',
  intro: 'Thứ Tư. Anh Dũng đổi ảnh đại diện thành một ngọn núi. Chị Mai nói người sắp nghỉ hay đổi ảnh ngọn núi.\n\nChiều qua, bạn thấy anh Dũng in danh sách 140 đại lý, rồi bỏ vô cặp.',
  steps: [
    { who: 'mai', obj: 'Chị Mai có "insight" mới', time: '09:00', scene: [
      ['mai', 'Em ơi. Đối thủ mời anh Dũng. Lương hơn ba mươi phần trăm. Có hợp đồng thiệt. Chị nghe từ bạn của bạn của vợ anh Dũng.'],
      { c: 'bm_dg_mai', o: [
        { t: '"Chị đừng kể ai nữa nha chị."', fx: { rel: { dung: 1, mai: -1 } }, then: [['mai', 'Chị chỉ kể em. Với cô Tư. Với… thôi chị ngưng.']] },
        { t: '"Rồi sao nữa chị?"', fx: { dr: 3, rel: { mai: 2 } }, then: [['mai', 'Rồi ổng sẽ đem theo đại lý. Mười lăm năm, đại lý tin ổng hơn tin Ba.']] },
      ] },
    ] },
    { who: 'dung', obj: 'Gặp anh Dũng ở cửa xưởng', time: '10:30', scene: [
      ['dung', 'Cà phê không? Cà phê gói thôi.'],
      ['dung', 'Năm ngoái anh xin làm phó giám đốc. Ba nói: "Phó giám đốc phải là người nhà, em hiểu mà." Anh hiểu. Hiểu mười lăm năm.'],
      { c: 'bm_dg_talk', o: [
        { t: '"Danh sách đại lý anh in hôm qua là để đi hả anh?"', fx: { uy: 2, rel: { dung: -1 } }, then: [['dung', 'Em thấy hả. …Anh in để coi lại. Mười lăm năm. Anh muốn biết mình đã làm được gì.'], ['think', 'Câu trả lời thật, hay câu trả lời đẹp?']] },
        { t: '"Em hiểu. Anh có muốn ở lại không, nếu có hợp đồng thật?"', fx: { rel: { dung: 3 }, set: { dung_open: true } }, then: [['dung', 'Muốn chứ. Đây là nhà anh. Chỉ là cái nhà không có tên anh.']] },
        { t: 'Uống cà phê, không hỏi gì.', fx: { rel: { dung: 2 }, nl: 5 }, then: [['dung', 'Em là người đầu tiên uống hết ly cà phê gói của anh mà không chê.']] },
      ] },
    ] },
    { who: 'tuan', obj: 'Kevin cũng biết', time: '14:00', scene: [
      ['tuan', 'You heard about Dũng? Honestly, nếu ảnh đi, kênh đại lý chết. Ba buộc phải all-in online. That\'s a win for me.'],
      { c: 'bm_dg_kevin', o: [
        { t: '"Anh Dũng đi thì xưởng cũng không ai quản đó anh."', fx: { uy: 2, rel: { tuan: -1 } }, then: [['tuan', '…Xưởng. Right. I forgot we make things.']] },
        { t: '"Dạ em không tham gia vụ này."', fx: { rel: { tuan: -1, dung: 1 } }, then: [['tuan', 'Fine. Neutral is boring.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Má hỏi: "Thằng Dũng dạo này sao?"', time: '15:00', scene: [
      ['hang', 'Con thấy thằng Dũng dạo này sao? Nó đổi hình núi. Ba nói người sắp đi hay đổi hình núi.'],
      { c: 'bm_dg_ma', o: [
        { t: 'Báo Má chuyện anh Dũng in danh sách đại lý.', fx: { rel: { hang: 2, dung: -4 }, nl: -10, dr: 4, set: { told_dung: true } }, then: [['hang', 'In danh sách? …Kêu nó lên đây.'], ['nar', 'Hai mươi phút sau, anh Dũng ra khỏi phòng Má, ôm một thùng carton. Thùng carton là của công ty. Má bắt trả lại.']] },
        { t: 'Đề xuất Má giữ anh Dũng: chức danh rõ, hợp đồng thật, lương xứng.', fx: { uy: 4, rel: { dung: 2 }, set: { dung_pitch: true } }, then: [
          { if: (r) => !!(r.flags.family_bridge || (r.rel.hang || 0) >= 5), then: [['hang', 'Người ngoài mà đòi chức… Con nói thì Má nghe. Lần trước con nói, nhà này êm được ba tuần.'], { fx: { set: { dung_stays: true }, rel: { hang: 1 } } }],
            else: [['hang', 'Chức là cho người nhà. Lương thì… để Má tính.'], ['think', '"Để Má tính." Ai ở đây lâu đều biết câu đó nghĩa là gì.']] },
        ] },
        { t: '"Dạ con không để ý ạ."', fx: { rel: { dung: 2 } }, then: [['hang', 'Con không để ý. Ừ. Ở đây "không để ý" là một kỹ năng.']] },
      ] },
    ] },
    { who: 'dung', obj: 'Cuối ngày: anh Dũng', time: '17:00', scene: [
      { if: F('dung_stays'), then: [['dung', 'Má gọi anh vô. "Phó quản lý xưởng, hợp đồng không thời hạn, tăng lương." Không phải phó giám đốc. Nhưng có tên anh.'], ['dung', 'Mười lăm năm. Một intern làm được. Anh không biết nên vui hay nên buồn.'], { fx: { rel: { dung: 3 } } }] },
      { if: F('told_dung'), then: [['dung', 'Anh không giận em. Em làm đúng việc của người làm cho Má. Anh chỉ… làm cho Ba & Má lâu quá.'], ['nar', 'Anh Dũng còn hai tuần bàn giao. Cái ly cà phê vẫn để trên bàn.']] },
      { if: (r) => !r.flags.dung_stays && !r.flags.told_dung, then: [['dung', 'Anh chưa quyết. Cảm ơn em đã không nói gì. Ở nhà này, im lặng đúng lúc là một kiểu tử tế.']] },
    ] },
  ],
  diary: (s) => `Anh Dũng và ngọn núi. ${s.flags.dung_stays ? 'Má cho anh Dũng hợp đồng thật. Anh nói một intern làm được điều mười lăm năm không làm được.' : s.flags.told_dung ? 'Mình báo Má. Anh Dũng ôm thùng carton, Má bắt trả lại thùng.' : 'Mình không nói gì. Anh Dũng chưa quyết.'}`,
};

const EP_NGAN = {
  id: 'bm_ngan', day: 32, title: 'Hộp quà của Ngân',
  intro: 'Thứ Năm. Chị Tâm, nhà phân phối lớn nhất, đặt 500 hộp quà Tết "Phú Quý Đầy Nhà" in logo công ty khách của chị.\n\nHộp in xong hôm qua. Sáng nay Ngân đến sớm, mắt thâm, ôm một xấp giấy vẽ.',
  steps: [
    { who: 'ngan', obj: 'Ngân có gì muốn cho coi', time: '08:30', scene: [
      ['ngan', 'Mình… vẽ lại hộp quà Tết. Cho vui thôi. Hộp cũ có con gà đang khóc, không ai để ý.'],
      ['nar', 'Bản vẽ của Ngân: một cái hộp đỏ, lá chanh vàng, chữ "Ba & Má" viết tay. Đẹp. Đẹp thật.'],
      { c: 'bm_ng_show', o: [
        { t: '"Đẹp quá. Mình đưa Má coi đi, mình đi chung."', fx: { rel: { ngan: 3 }, set: { ngan_show: true } }, then: [['ngan', 'Đưa Má hả? Má sẽ hỏi "bao nhiêu tiền". …Ừ. Đi.']] },
        { t: '"Để mình gửi ẩn danh cho Kevin."', fx: { rel: { ngan: 1 } }, then: [['ngan', 'Ẩn danh cũng được. Ít nhất có người coi.']] },
      ] },
    ] },
    { who: 'call:chitam', obj: 'Chị Tâm gọi: đổi logo!', time: '10:00', call: { title: 'Chị Tâm · NPP <> Ba & Má · Hộp quà Tết', people: ['chitam', 'hang', 'me'] }, scene: [
      ['chitam', 'Khách chị đổi logo mới. Sếp mới duyệt hôm qua. Năm trăm hộp, logo mới, giao đúng hẹn nha em.'],
      ['hang', '(tắt mic) Năm trăm hộp in rồi! Ai chịu?'],
      { if: F('chitam_trust'), then: [['chitam', 'Chị nói trước: vụ tem date lần trước em nói thật, chị nhớ. Em đề xuất gì chị nghe.']] },
      { c: 'bm_ng_logo', o: [
        { t: 'Dán sticker logo mới phủ lên, tính thêm phí dán.', fx: { uy: 3, rel: { hang: 2 } }, then: [['chitam', 'Phí dán bao nhiêu? …Ok, chị chịu.'], ['hang', 'Biết tính tiền. Được.'], { fx: { set: { box_sticker: true } } }] },
        { t: 'In lại toàn bộ, công ty chịu.', fx: { nl: -15, rel: { hang: -2 } }, then: [['nar', 'Cả kho thức tới 11 giờ đêm dán hộp mới. Má tính tiền in lại ba lần, lần nào cũng ra con số buồn.']] },
        { t: 'Đề xuất hộp mới theo mẫu của Ngân, in logo mới, giao trễ 3 ngày.', when: F('ngan_show'), fx: { uy: 5, rel: { ngan: 3, hang: 1 }, set: { ngan_box: true } }, then: [['chitam', 'Mẫu này đẹp hơn mẫu cũ. Trễ ba ngày chị chịu được. Ai vẽ vậy?'], ['me', 'Dạ Ngân, intern bên em ạ.'], ['nar', 'Ngân nghe thấy tên mình qua loa. Ngân ngồi thẳng lưng lên.']] },
        { t: 'Hỏi khách có muốn bản "giới hạn logo cũ" giảm giá không.', fx: { uy: 3, dr: 1 }, then: [['chitam', 'Bản giới hạn logo cũ? Ha. Để chị hỏi. …Họ lấy 200 hộp, còn 300 dán sticker.'], { fx: { set: { box_sticker: true } } }] },
      ] },
    ] },
    { who: 'tuan', obj: 'Kevin thấy bản vẽ của Ngân', time: '11:30', scene: [
      ['tuan', 'Ai vẽ cái hộp này? Đẹp. Anh sẽ present nó ở buổi họp Tết như "Innovation team output".'],
      ['ngan', '(nhỏ) …'],
      { c: 'bm_ng_credit', o: [
        { t: '"Ngân vẽ đó anh. Anh present thì ghi tên Ngân."', fx: { uy: 2, rel: { ngan: 3, tuan: -1 }, set: { ngan_credit: true } }, then: [['tuan', 'Of course. Ngân. Innovation team… member. Ngân.']] },
        { t: 'Để Kevin present.', fx: { rel: { tuan: 1, ngan: -2 } }, then: [['ngan', 'Ừ. Quen rồi.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Phòng Má: Ngân có chuyện muốn nói', time: '14:00', scene: [
      ['hang', 'Ngân. Má hứa với mẹ con rồi. Cuối đợt con ở lại, Má cho con làm kế toán với Má.'],
      ['ngan', 'Dạ…'],
      ['nar', 'Ngân nhìn bạn. Ánh mắt của người đứng trên mép hồ bơi lần đầu.'],
      { c: 'bm_ng_free', o: [
        { t: 'Gật đầu với Ngân: nói đi.', fx: { rel: { ngan: 3 }, set: { ngan_free: true } }, then: [['ngan', 'Má ơi… con không muốn làm kế toán. Con muốn làm bao bì. Con vẽ cái hộp đó.'], ['hang', '…'], ['hang', 'Vẽ hộp có ra tiền không?'], ['me', 'Dạ, hộp mới của Ngân vừa giữ được đơn năm trăm hộp ạ.'], ['hang', '…Ừ. Để Má nói mẹ con.']] },
        { t: 'Đứng ngoài, chuyện riêng của Ngân.', fx: { nl: 2 }, then: [['ngan', 'Dạ con cảm ơn Má.'], ['think', 'Ngân vừa cảm ơn một cái tương lai Ngân không muốn.']] },
      ] },
    ] },
    { who: 'ngan', obj: 'Ngân ở bàn, cuối ngày', time: '16:00', scene: [
      { if: F('ngan_free'), then: [['ngan', 'Mình nói rồi. Tay mình còn run. Chưa ai hỏi mình thật sự muốn làm gì. Cậu là người đầu tiên.'], ['ngan', 'Mà nè… vậy là suất "người nhà" Má hứa, giờ trống rồi đó. Cậu lấy đi.']], else: [['ngan', 'Mình sẽ làm kế toán. Mẹ mình vui. Má vui. Mình… cũng sẽ vui. Chắc vậy.']] },
      ['nar', 'Mèo Khô Gà nằm lên xấp giấy vẽ của Ngân, ngủ ngon lành.'],
    ] },
  ],
  diary: (s) => `Hộp quà của Ngân. ${s.flags.ngan_box ? 'Chị Tâm chọn mẫu hộp của Ngân.' : s.flags.box_sticker ? 'Dán sticker logo mới lên 500 hộp.' : 'In lại 500 hộp. Má tính ba lần.'} ${s.flags.ngan_free ? 'Ngân nói với Má: con muốn làm bao bì.' : 'Ngân sẽ làm kế toán.'}`,
};

const EP_TET = {
  id: 'bm_tet', day: 36, title: 'Mùa Tết: 1.800 đơn',
  intro: 'Thứ Hai. Mùa Tết bắt đầu thật sự. Đêm 12.12 về 1.800 đơn. Xưởng chạy hai ca. Bảng trắng ghi "x3".\n\n8 giờ sáng, sáu chị thời vụ đứng ở cửa xưởng: "Tăng 50 nghìn một ngày, không thì tụi chị về quê."',
  steps: [
    { who: 'dung', obj: 'Cửa xưởng: thời vụ đòi tăng lương', time: '08:30', scene: [
      ['dung', 'Sáu chị thời vụ. Đóng gói nhanh nhất xưởng. Đòi thêm năm chục một ngày. Má nói "cho về hết".'],
      ['dung', 'Cho về hết thì ai đóng 1.800 đơn? Văn phòng. Tức là em.'],
      { c: 'bm_tet_tv', o: [
        { t: 'Ra nói chuyện: đề xuất thêm 30 nghìn và bao cơm trưa.', fx: { uy: 2, rel: { dung: 1 }, set: { tv_offer: true } }, then: [['nar', 'Chị tổ trưởng nhìn bạn từ đầu tới chân. "Ba chục với bao cơm cô Tư? Cơm cô Tư thì được."']] },
        { t: 'Gọi bạn bè sinh viên vô làm thời vụ.', fx: { dr: 4, set: { tv_friends: true } }, then: [['nar', 'Ba bạn tới lúc 10 giờ. Một bạn quay clip TíchTắc ở xưởng: "POV: đi làm thêm ở chỗ bạn thực tập". 200 nghìn view.']] },
        { t: 'Đứng ngoài. Chuyện của Má.', fx: { nl: 2 }, then: [['nar', 'Sáu chị thời vụ dắt xe ra cổng. Anh Dũng nhìn theo, không nói gì.'], { fx: { set: { tv_gone: true } } }] },
      ] },
    ] },
    { who: 'hang', obj: 'Má bấm máy tính', time: '09:30', scene: [
      { if: F('tv_offer'), then: [
        ['hang', 'Ba chục một ngày. Sáu người. Tới Tết. Bao nhiêu? Con nói, Má bấm.'],
        { mini: WAGE_MINI,
          good: [['hang', 'Ba triệu sáu. Ít hơn tiền in lại năm trăm hộp. Được. Giữ.'], { fx: { uy: 4, rel: { hang: 2 }, set: { kept_seasonal: true } } }],
          bad: [['hang', 'Sai. Ba triệu sáu. …Mà ba triệu sáu thì được. Giữ.'], { fx: { rel: { hang: 1 }, set: { kept_seasonal: true } } }],
        },
      ], else: [
        ['hang', 'Thiếu người thì văn phòng xuống. Má xuống. Ba xuống. Kevin xuống. Ai cũng xuống.'],
        ['tuan', '(xa) Mom, I have a meeting—'],
        ['hang', 'Meeting dưới xưởng.'],
        { fx: { nl: -6 } },
      ] },
    ] },
    { who: 'bay', obj: '10:45 Gom đơn kịp xe lấy hàng 11:00', time: '10:45', scene: [
      ['bay', 'Xe lấy hàng tới 11 giờ. Còn hai trăm đơn chưa đóng. Máy in bill kẹt lúc 10 giờ 55 như mọi ngày. Lẹ con!'],
      { mini: PACK_MINI,
        good: [['bay', 'Kịp! Có video đóng gói, khách nào nói thiếu là mình có bằng chứng.'], { fx: { uy: 3, rel: { bay: 2 }, set: { pack_pro: true } } }],
        bad: [['bay', 'Dán bill trước khi nhặt hàng hả con? …Thôi, đóng lại. Trễ xe này, đi xe chiều.'], { fx: { nl: -6, dr: 2 } }],
      },
    ] },
    { who: 'tu', obj: 'Giờ cơm: cô Tư nấu cho 30 người', time: '12:30', scene: [
      ['tu', 'Ăn đi con. Mùa Tết năm nào cô cũng nấu cho ba chục người. Năm nay có con.'],
      ['tu', 'Cô nói con nghe. Mùa này ai cũng thương con. Qua Tết ai cũng quên. Con nhớ ăn cho no.'],
      { fx: { nl: 25, rel: { tu: 1 } } },
      ['nar', 'Mèo Khô Gà ngủ trên thùng carton hộp quà Tết. Không ai dám đuổi. Cô Tư nói nó "giữ lộc".'],
    ] },
    { who: 'hang', obj: '17:30 Má gom cả văn phòng', time: '17:30', scene: [
      ['hang', 'Tối nay cả văn phòng ở lại đóng hàng tới một giờ sáng. Có bánh mì với nước tăng lực. Người nhà mà, tính chi OT.'],
      { if: official, then: [['hang', 'Con chính thức rồi. Chính thức là người nhà.']] },
      { c: 'bm_tet_ot', o: [
        { t: 'Ở lại tới 1 giờ sáng.', fx: { nl: -25, rel: { hang: 2, tu: 1 } }, then: [['nar', 'Một giờ sáng. Bạn đóng xong đơn thứ 1.800. Má đưa bạn ổ bánh mì cuối cùng. Má không ăn.']] },
        { t: 'Ở tới 23 giờ rồi xin về vì hết xe buýt.', fx: { nl: -12, rel: { hang: -1 } }, then: [['hang', 'Ừ.'], ['think', 'Chữ "ừ" của Má có mười hai nghĩa. Cái này là nghĩa thứ chín.']] },
        { t: 'Đề xuất chia hai ca và thuê ba bạn part-time trả theo đơn.', fx: { uy: 5, rel: { hang: 1, dung: 1 }, nl: -8, set: { shift_plan: true } }, then: [['hang', 'Trả theo đơn… Má trả cho cái đơn, không trả cho cái ghế. Ừ. Má thích cái này.'], ['nar', 'Ca hai về lúc 11 giờ. Không ai ngủ gục ngày mai. Má nhớ tên bạn, lần này không phải để hăm.']] },
      ] },
    ] },
  ],
  diary: (s) => `Mùa Tết. ${s.flags.kept_seasonal ? 'Giữ được sáu chị thời vụ với ba chục nghìn và cơm cô Tư.' : s.flags.tv_friends ? 'Bạn mình vô làm thời vụ, một đứa quay clip TíchTắc ở xưởng.' : 'Thời vụ về quê hết.'} ${s.flags.shift_plan ? 'Mình đề xuất chia ca. Má nhớ tên mình.' : 'Tóc mình giờ thơm lá chanh vĩnh viễn.'}`,
};

// ---------- official-only episodes (promotion arc) ----------
const EP_O1 = {
  id: 'bm_o_nguoinha', official: true, title: 'Người nhà',
  intro: 'Thứ Hai đầu tiên là nhân viên chính thức. Không có buổi lễ. Không có email. Chỉ có cái tên bạn trong nhóm chat "GIA ĐÌNH MÌNH ❤️".\n\nVà một chùm chìa khóa kho trên bàn.',
  steps: [
    { who: 'hang', obj: 'Má gọi vô phòng: "chính thức"', time: '08:30', scene: [
      ['hang', 'Chìa khóa kho. Đừng làm mất. Mất là thay ổ, thay ổ là tốn.'],
      ['hang', 'Má add con vô nhóm nhà rồi. Đọc thôi, đừng nói. Nhóm nhà ai nói nhiều là Má kick.'],
      { c: 'bm_o1_contract', o: [
        { t: '"Dạ Má, hợp đồng lao động của con khi nào ký ạ?"', fx: { uy: 2, rel: { hang: -1 }, set: { asked_contract: true } }, then: [['hang', 'Để cuối năm làm luôn cho đủ giấy tờ. Người nhà mà, gấp chi.'], ['think', 'Mình là người nhà từ lúc 8:30. Hợp đồng là người ngoài.']] },
        { t: '"Dạ con cảm ơn Má."', fx: { rel: { hang: 2 } }, then: [['hang', 'Cảm ơn gì. Người nhà mà.'], ['think', 'Chữ "người nhà" bắt đầu có trọng lượng. Cỡ một thùng khô.']] },
      ] },
    ] },
    { who: 'hung', obj: 'Ba mời "chuyện nhà"', time: '10:00', scene: [
      ['hung', 'Chủ nhật này đám giỗ ông nội dưới quê. Con đi nghen. Con là người nhà mà.'],
      { c: 'bm_o1_gio', o: [
        { t: 'Đi.', fx: { rel: { hung: 3, hang: 1 }, nl: -10, set: { went_gio: true } }, then: [['nar', 'Chủ nhật. Bạn rửa chén cho mười hai mâm. Các bác khen "đứa này ngoan". Một bác hỏi lương. Bạn nói. Bác cười.']] },
        { t: 'Từ chối khéo: Chủ nhật con có hẹn với gia đình.', fx: { rel: { hung: -1, hang: -1 } }, then: [['hung', 'Gia đình… à, gia đình bên con. Ừ.'], ['think', 'Ba nói chữ "gia đình bên con" như nói "chi nhánh".']] },
      ] },
    ] },
    { who: 'dung', obj: 'Anh Dũng đứng ở cửa xưởng', time: '14:00', scene: [
      ['dung', 'Chúc mừng em. Nhân viên chính thức. Đi đám giỗ chưa?'],
      ['dung', 'Anh mời em vô nhóm "Hội anh chị em ngoài". Không có Ba Má. Chỗ duy nhất người ta nói thật.'],
      { c: 'bm_o1_group', o: [
        { t: 'Vô nhóm.', fx: { rel: { dung: 2, mai: 1 }, set: { outsider_group: true } }, then: [{ chat: [['mai', 'welcome em vô hội 🥲 ở đây toàn người bị trừ lương', true], ['khoa', '👍', true], ['vy', 'Chief Happiness Officer xin báo: ở đây không happy nhưng thật 🫠', true]] }] },
        { t: '"Em giờ là người nhà rồi anh."', fx: { rel: { dung: -1, hang: 1 } }, then: [['dung', 'Ừ. Anh cũng từng nói câu đó. Năm 2012.']] },
      ] },
    ] },
    { who: 'mai', obj: 'Chị Mai ghé bàn', time: '16:00', scene: [
      ['mai', 'Chính thức rồi hả em? Chị bảy năm chưa có hợp đồng. Mỗi Tết Má nói "để cuối năm".'],
      ['mai', 'Bảy cái "cuối năm". Chị đếm.'],
      { fx: { dr: 2 } },
    ] },
  ],
  diary: (s) => `Ngày đầu chính thức. Mình có chìa khóa kho, có tên trong nhóm "Gia đình mình". ${s.flags.asked_contract ? 'Hợp đồng thì "để cuối năm".' : 'Mình chưa hỏi hợp đồng.'} ${s.flags.went_gio ? 'Chủ nhật mình rửa chén mười hai mâm.' : ''}`,
};

const EP_O2 = {
  id: 'bm_o_luong', official: true, title: 'Lương "Má đưa tay"',
  intro: 'Ngày lĩnh lương chính thức đầu tiên. Má phát lương bằng bao thư, không có bảng lương, không có phiếu lương.\n\nBao thư của bạn ghi bằng bút bi đỏ: "9.200.000 · cố gắng hơn".',
  steps: [
    { who: 'hang', obj: 'Má phát bao thư lương', time: '09:00', scene: [
      ['hang', 'Mười triệu, trừ tám trăm: con làm bể hũ mít sấy, với đi trễ hai bữa.'],
      ['think', 'Hai bữa đó mình tới 7 giờ 58.'],
      ['hang', 'Bảo hiểm thì Má đóng theo mức tối thiểu. Đóng nhiều chi, tốn tiền con mà tốn tiền Má.'],
      ['nar', '(Theo luật, mức đóng BHXH tính trên tiền lương ghi trong hợp đồng, không thấp hơn lương tối thiểu vùng. Thông tin giải trí, không phải tư vấn pháp lý.)'],
      { c: 'bm_o2_env', o: [
        { t: 'Hỏi lại nhẹ nhàng, đưa giờ chấm công và hóa đơn hũ mít.', fx: { uy: 3, money: 500_000, rel: { hang: -1 } }, then: [['hang', 'Con chấm công cho Má coi nữa hả? …Ừ. Trả con năm trăm. Ba trăm Má giữ, gọi là "bài học".'], ['think', 'Bài học trị giá ba trăm nghìn. Ở trường mình học phí còn rẻ hơn.']] },
        { t: 'Nhận, im lặng.', fx: { nl: -6, rel: { hang: 1 } }, then: [['hang', 'Ngoan.'], ['think', 'Ngoan quá ở đây là thiệt.']] },
      ] },
    ] },
    { who: 'mai', obj: 'Chị Mai thấy bao thư', time: '11:00', scene: [
      ['mai', 'Bao thư ghi "cố gắng hơn" hả? Của chị ghi "cố gắng hơn" bảy năm. Chị sưu tầm.'],
      ['mai', 'Năm ngoái chị bị trừ vì "nói nhiều". Má đo bằng cái gì chị không biết.'],
      { fx: { rel: { mai: 1 }, dr: 2 } },
    ] },
    { who: 'vy', obj: 'Hỏi chị Vy (HR) về hợp đồng', time: '14:00', scene: [
      ['vy', 'Chị là HR, nhưng HR ở đây là "Họ hàng Relations". Chị nói thật nha em.'],
      ['vy', 'Làm việc có trả lương, có người quản lý thì là quan hệ lao động, nên phải có hợp đồng. Từ đủ một tháng là đóng bảo hiểm bắt buộc.'],
      ['nar', '(Thông tin giải trí, không phải tư vấn pháp lý.)'],
      { c: 'bm_o2_vy', o: [
        { t: '"Chị soạn giùm em bản hợp đồng, em trình Má."', fx: { uy: 3, rel: { vy: 2 }, set: { contract_draft: true } }, then: [['vy', 'Chị soạn rồi. Từ hồi em lên chính thức. Chị biết thế nào em cũng hỏi.']] },
        { t: '"Thôi chị, để cuối năm."', fx: { rel: { hang: 1 } }, then: [['vy', 'Ừ. Cuối năm. Chị có bảy bản hợp đồng soạn sẵn "để cuối năm" trong ngăn kéo.']] },
      ] },
    ] },
    { who: 'hung', obj: 'Ba nhắc chuyện Chủ nhật', time: '16:00', scene: [
      ['hung', 'Chủ nhật này xưởng chạy. Con xuống phụ nghen. Người nhà mà.'],
      { c: 'bm_o2_sun', o: [
        { t: 'Đi.', fx: { nl: -12, rel: { hung: 2 }, set: { sunday1: true } }, then: [['nar', 'Chủ nhật, 6 giờ sáng tới 3 giờ chiều. Không chấm công. Má cho một bịch khô vụn "bồi dưỡng".']] },
        { t: '"Dạ Chủ nhật có tính tăng ca không Ba?"', fx: { uy: 2, rel: { hung: -2 }, dr: 3 }, then: [['hung', 'Tăng ca? Người nhà mà tính tăng ca hả con?'], ['think', 'Người nhà thì không tính. Người ngoài thì không được vào. Mình đứng ở đâu?']] },
      ] },
    ] },
  ],
  diary: (s) => `Lương "Má đưa tay". ${s.flags.contract_draft ? 'Chị Vy đã soạn sẵn hợp đồng cho mình.' : ''} ${s.flags.sunday1 ? 'Chủ nhật đầu tiên ở xưởng, không chấm công.' : 'Mình hỏi Ba chuyện tăng ca. Ba nhìn mình như nhìn người lạ.'} Bao thư ghi "cố gắng hơn".`,
};

const EP_O3 = {
  id: 'bm_o_tranguong', official: true, title: 'Trần kính gia đình',
  intro: 'Thứ Hai. Kevin chiếu sơ đồ tổ chức mới, vẽ bằng app thiết kế, lên tường phòng họp sáng.\n\nỞ ô "Trưởng phòng Online" có một cái tên. Không phải tên bạn.',
  steps: [
    { who: 'son', obj: 'Họp sáng: sơ đồ tổ chức mới', time: '08:30', pos: STANDUP_POS, scene: [
      ['son', 'Team ơi, mình có org chart mới! Rất Agile. Có cả swimlane.'],
      { if: F('ngan_free'), then: [['tuan', 'Trưởng phòng Online: Bo. Con cậu Tám. Vừa ra trường. Rất high potential.'], ['think', 'Bo. Người mình chưa gặp bao giờ. Đang ngủ ở nhà.']], else: [['tuan', 'Trưởng phòng Online: Ngân. Má đã hứa với mẹ Ngân.'], ['ngan', '(nhỏ) Mình không xin. Thật.']] },
      ['tuan', 'Còn em, {ten}: "Nhân viên văn phòng". Tức là sàn, CSKH, kho, trợ live. Tùy hôm.'],
      { c: 'bm_o3_chart', o: [
        { t: '"Dạ, vậy con báo cáo cho ai ạ?"', fx: { uy: 2, dr: 2 }, then: [['son', 'Câu hay! Mình đưa vô parking lot.'], ['hang', 'Báo cáo cho Má. Như cũ. Sơ đồ là của Kevin, công ty là của Má.']] },
        { t: 'Im lặng, chụp lại sơ đồ.', fx: { nl: -4 }, then: [['think', 'Ô của mình có chữ "Tùy hôm". Mình chưa thấy chức danh nào thật thà vậy.']] },
      ] },
    ] },
    { who: 'tuan', obj: 'Kevin cần "số liệu phe mình"', time: '10:00', scene: [
      ['tuan', 'Ba muốn cắt sàn lần nữa. Em làm giùm anh báo cáo cho thấy online là tương lai. Chỉ số đẹp thôi nha.'],
      ['nar', 'Mười phút sau, Ba nhắn: "Con làm cho ba cái báo cáo đại lý lời hơn. Đừng nói thằng Tuấn."'],
      { c: 'bm_o3_side', o: [
        { t: 'Làm một báo cáo, số thật, gửi cả hai.', fx: { uy: 4, rel: { hung: -1, tuan: -1 } }, then: [['nar', 'Ba đọc, nói "con bênh thằng Tuấn". Kevin đọc, nói "em bênh Ba". Hai người nói cùng lúc, lần thứ hai trong năm.']] },
        { t: 'Làm cho Kevin.', fx: { rel: { tuan: 2, hung: -3 } }, then: [['hung', 'Ba nhờ con một việc. Con làm việc của người khác.'], ['think', 'Từ hôm đó Ba không gọi mình vô phòng nữa.']] },
        { t: 'Làm cho Ba.', fx: { rel: { hung: 2, tuan: -3 } }, then: [['tuan', 'Okay. I see where you stand.'], ['think', 'Kevin xóa mình khỏi nhóm "Growth Squad". Nhóm đó có ba người.']] },
      ] },
    ] },
    { who: 'hang', obj: 'Hỏi Má về vai trò, lương', time: '14:00', scene: [
      ['hang', 'Con giỏi hơn nó nhiều. Mà nó là người nhà.'],
      ['think', 'Mình cũng là "người nhà". Từ lúc 8:30 thứ Hai tuần trước.'],
      { c: 'bm_o3_ask', o: [
        { t: 'Đưa bảng việc mình làm, xin chức danh rõ và thang lương.', fx: { uy: 3, rel: { hang: -2 }, set: { asked_scale: true } }, then: [['hang', 'Thang lương? Nhà mình không có thang. Nhà mình có Má.'], ['hang', 'Để Má tính.']] },
        { t: '"Dạ con hiểu ạ."', fx: { rel: { hang: 1 }, nl: -8 }, then: [['hang', 'Con hiểu chuyện. Má thương con.'], ['think', 'Thương thì có. Thang thì không.']] },
      ] },
    ] },
    { who: 'dung', obj: 'Anh Dũng đưa ly cà phê gói', time: '17:00', scene: [
      ['dung', 'Thấy chưa. Anh ở mười lăm năm mới hiểu. Em hiểu trong ba tuần. Em học nhanh hơn anh.'],
      { if: F('dung_stays'), then: [['dung', 'Anh có hợp đồng là nhờ em. Mà anh vẫn không có tên trên bảng hiệu. Có những cái trần, mình đứng thẳng là đụng.']] },
      { fx: { rel: { dung: 1 } } },
    ] },
  ],
  diary: (s) => `Sơ đồ tổ chức mới. Ô của mình ghi "Nhân viên văn phòng (tùy hôm)". ${s.flags.asked_scale ? 'Mình xin thang lương. Má nói nhà không có thang, nhà có Má.' : ''} Anh Dũng nói mình học nhanh hơn anh.`,
};

const EP_O4 = {
  id: 'bm_o_chunhat', official: true, end: (r) => (r.flags.end_pushed ? 'layoff' : 'quit'), title: 'Chủ nhật ở xưởng',
  intro: 'Thứ Hai trước Tết. Trên bảng trắng có thêm một dòng chữ Má viết: "Từ giờ tới Tết: Chủ nhật cả nhà xuống xưởng."\n\n"Cả nhà" có bạn. Bảng lương thì không có chữ "Chủ nhật".',
  steps: [
    { who: 'hang', obj: 'Má: "Chủ nhật cả nhà xuống xưởng"', time: '08:30', scene: [
      ['hang', 'Bảy Chủ nhật nữa là Tết. Chủ nhật nào cũng xuống. Người nhà mà, tính chi.'],
      { if: F('contract_fixed'), then: [['think', 'Hồi ký thỏa thuận thực tập, mình đã gạch dòng "kể cả Chủ nhật". Giờ là nhân viên chính thức, dòng đó quay lại bằng miệng.']] },
      { if: F('contract_blind'), then: [['think', 'Dòng "kể cả Chủ nhật". Mình đã ký nó từ ngày đầu.']] },
      { c: 'bm_o4_sun', o: [
        { t: '"Dạ Má, Chủ nhật con xin được tính tăng ca theo luật."', fx: { uy: 3, rel: { hang: -3 }, set: { asked_ot: true } }, then: [['hang', 'Luật. Lại luật. Luật có ăn cơm cô Tư nấu không?'], ['nar', '(Làm thêm vào ngày nghỉ hằng tuần được trả ít nhất 200% lương. Thông tin giải trí, không phải tư vấn pháp lý.)']] },
        { t: '"Dạ con đi ạ."', fx: { nl: -15, rel: { hang: 2 } }, then: [['think', 'Bảy Chủ nhật. Mình đếm như đếm ngược. Không biết ngược tới cái gì.']] },
      ] },
    ] },
    { who: 'tu', obj: 'Cô Tư gọi ra bếp', time: '10:00', scene: [
      ['tu', 'Ăn chưa con? Ngồi đây.'],
      ['tu', 'Cô ở đây hai mươi sáu năm. Cô thấy nhiều đứa vô làm "người nhà". Đứa nào ở lại thì mất cái nhà của nó.'],
      ['tu', 'Cô thương con nên cô nói. Con giỏi. Đi chỗ nào người ta trả tiền cho cái giỏi của con.'],
      { fx: { rel: { tu: 2 }, nl: 10 } },
      ['nar', 'Mèo Khô Gà dụi đầu vào chân bạn. Lần đầu tiên nó làm vậy với ai không cầm khô.'],
    ] },
    { who: 'hung', obj: 'Ba gọi vô phòng', time: '14:00', scene: [
      ['hung', 'Con muốn gì? Ba hỏi thiệt. Ba không biết hỏi câu này với người nhà, nên ba hỏi con.'],
      { c: 'bm_o4_ba', o: [
        { t: '"Dạ con muốn có hợp đồng, có Chủ nhật, và có tên trên cái gì đó con làm."', fx: { rel: { hung: 1 } }, then: [['hung', 'Ba cho được cái tên. Hợp đồng là Má. Chủ nhật là… cái nhà này không có Chủ nhật từ năm 2004.']] },
        { t: '"Dạ con muốn Ba Má với anh Kevin bớt cãi nhau."', fx: { rel: { hung: 2, tuan: 1 } }, then: [['hung', 'Cái đó ba cũng muốn. Hai mươi năm rồi.'], ['think', 'Lần đầu Ba nói một câu không có "hồi xưa".']] },
      ] },
    ] },
    { who: 'obj:desk', obj: 'Về bàn: viết email hay không?', time: '16:30', scene: [
      ['nar', 'Bàn của bạn. Một chùm chìa khóa kho, một bịch khô vụn, một bao thư ghi "cố gắng hơn".'],
      { if: F('asked_ot'), then: [{ chat: [['hang', 'Con không muốn xuống Chủ nhật thì con viết đơn tự nguyện nghỉ đi, cho đẹp. Má không đuổi ai hết.', true]] }, ['think', 'Má không đuổi. Má chỉ soạn sẵn chữ "tự nguyện".']] },
      { c: 'bm_o4_end', o: [
        { t: 'Viết đơn nghỉ, cảm ơn Ba Má, xin ở tới hết tuần bàn giao.', fx: { uy: 3, set: { end_grace: true } }, then: [['hang', 'Ừ. Bàn giao cho đàng hoàng. …Mang khô về cho ba má con.'], ['nar', 'Má nói câu đó mà không nhìn bạn. Má nhìn sổ. Sổ không có trang nào để xóa tên bạn.']] },
        { t: 'Ký tờ "đơn tự nguyện" Má soạn sẵn.', when: F('asked_ot'), fx: { dr: 4, set: { end_pushed: true } }, then: [['nar', 'Chữ "tự nguyện" in đậm. Chữ ký của bạn thì không.'], ['vy', '(nhắn riêng) Chị xin lỗi. Chị là HR mà chị chỉ biết in giấy.']] },
        { t: 'Nhắn anh Dũng: "Anh còn cần người trẻ biết làm sàn không?"', when: (r) => !r.flags.told_dung, fx: { uy: 2, rel: { dung: 3 }, set: { end_dung: true } }, then: [['dung', '(nhắn lại) Cần. Anh với em mở shop khô riêng. Không tên Ba, không tên Má. Tên mình.']] },
      ] },
    ] },
  ],
  diary: (s) => `Ngày cuối ở Ba & Má. ${s.flags.end_pushed ? 'Mình ký đơn "tự nguyện" Má soạn sẵn.' : s.flags.end_dung ? 'Mình nhắn anh Dũng. Tụi mình sẽ mở shop khô riêng.' : 'Mình viết đơn nghỉ, cảm ơn Ba Má.'} Cô Tư nói: đi chỗ nào người ta trả tiền cho cái giỏi của con.`,
};

export const EPISODES = [
  EP_D1, EP_TROLIVE, EP_TEM, EP_THIT, EP_1111, EP_CONGNO, EP_FAMILY, EP_5SAO, EP_PHISAN,
  EP_MOC, EP_CANDATE, EP_KIEMTRA, EP_BOCPHOT, EP_DUNG, EP_NGAN, EP_TET,
  EP_O1, EP_O2, EP_O3, EP_O4,
];
export const ARC = [EP_O1.id, EP_O2.id, EP_O3.id, EP_O4.id];
