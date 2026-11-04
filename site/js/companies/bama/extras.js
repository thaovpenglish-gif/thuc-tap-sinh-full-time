// Ba & Má — office theme, weekly review lines (Má), promotion, endings, ties, object lines, food, life events.
import { ARC } from './episodes.js';

export const THEME = {
  logo: ['BA & MÁ', 'Khô gà · Khô heo · Khô bò · Trái cây sấy', '"Khô ngon như nhà làm. Vì nhà làm thiệt."'],
  skyline: 'KHÔ GÀ BA & MÁ',
  bossWall: 'Gia Đình',
  banner: 'CHỐT ĐƠN · CHỐT ĐƠN · CHỐT ĐƠN',
  signs: {
    boss: 'PHÒNG BA', finance: 'PHÒNG MÁ · KÉT', meeting: 'PHÒNG HỌP GIA ĐÌNH',
    standup: 'HỌP SÁNG 8:15 (Ba nói 40 phút)', pantry: 'BẾP CÔ TƯ · Ăn thử free (gói đầu)',
  },
  desks: {
    me: ['Intern · Bạn', ['Excel', 'TonKho_FINAL_Ma.xlsx'], '#e07a5f'],
    c1: ['Út Mi · Live', ['LIVE 🔴', '1.204 mắt xem'], '#ff7a6b'],
    c2: ['Bàn dán tem', ['Tem phụ', 'còn 1.700 cái'], '#f2b134'],
    c3: ['Ngân · Intern', ['HopQuaTet', 'v7_ko_ai_xem'], '#7fb3ff'],
    n1: ['Chị Mai · CSKH', ['Inbox: 312', '"shop ơi…"'], '#ffc59e'],
    n2: ['Đơn sàn', ['Đơn hôm nay', '486 đơn'], '#ff9f7a'],
    n3: ['Hàng hoàn', ['Hoàn về', '47 đơn 😩'], '#c9b6ff'],
    n4: ['Đối soát COD', ['Lệch', '1.240.000đ'], '#b8f0d8'],
    n5: ['Thời vụ (trống)', null, '#9aa0ad'],
    n6: ['Đại lý & công nợ', ['Cô Sáu nợ', '46.000.000đ'], '#e3d9ff'],
    hr: ['Hồ sơ ATTP', ['Phiếu kiểm nghiệm', 'HẠN: ???'], '#ffc8dd'],
    senior: ['Kevin · Growth', ['ROAS 4.2 🚀', 'GMV ↑↑↑'], '#9ee8c8'],
  },
  whiteboard: ['TẾT 2027: x3 ĐƠN', 'Khô gà lá chanh: 10.000 gói', 'Hộp quà Phú Quý: 2.000', '12.12 live tới 2h sáng', '(Má: TẮT QUẠT KHI RA NGOÀI)'],
  scrum: { cols: ['CẦN LÀM', 'ĐANG LÀM', 'XONG (Má chưa duyệt)'], notes: [
    ['30 kịch bản TíchTắc', 'Đòi nợ cô Sáu', 'Gia hạn kiểm nghiệm', 'Đăng ký nhãn hiệu (từ 2012)'],
    ['Live 11.11', 'Dán tem phụ', 'Sửa máy sấy #2'],
    ['Họp 15 phút (40)', 'Cúng Thần Tài'],
  ] },
  board: ['TẾT 2027 🧧 x3', 'Đám giỗ ông nội: Chủ nhật', 'Sinh nhật Má: mua bánh (Má trả)'],
  palette: { wall: '#fff1e0', lilac: '#ffe3c2', peach: '#ffd9c7', mint: '#e3f2d0', butter: '#fff0b3' },
  labels: {
    coffee: 'Bếp cô Tư: ăn thử khô gà', okr: 'Đọc bảng chỉ tiêu Tết', altar: 'Thắp nhang Thần Tài',
    safe: 'Nhìn két của Má', plant: 'Chậu lá chanh của Ba', redchair: 'Ghế đỏ của Má (đừng ngồi)', printer: 'Máy in bill',
  },
  props: [
    { type: 'crates', slot: 'p1', label: 'KHÔ GÀ LÁ CHANH' },
    { type: 'crates', slot: 'p2', label: 'KHÔ BÒ · MÁ ĐẾM RỒI', color: '#ffd3b8' },
    { type: 'dryer', slot: 'p3', label: 'MÁY SẤY #2' },
    { type: 'ringlight', slot: 'p4', label: 'LIVE 20H 🔴', color: '#ffc8dd' },
    { type: 'cabinet', slot: 'p5', label: 'SỔ CỦA MÁ (2 CUỐN)', color: '#ffe0d6' },
    { type: 'standee', slot: 'p6', label: 'BA & MÁ|Từ 2004|Bán chợ|lên sàn', color: '#ffe9a0' },
  ],
};

// Weekly review lines, said by Má (Cô Hằng) on Friday.
export const REVIEW = {
  A: [
    'Tuần này con làm được. Má không khen nhiều, khen nhiều tụi nó đòi tăng lương.',
    'Con siêng mà siêng đúng chỗ. Hiếm lắm. Kevin siêng sai chỗ mười năm rồi.',
    'Tới sớm, tắt quạt, không xin về sớm. Con đúng là người Má cần.',
    'Cô Tư khen con. Cô Tư không khen ai hết. Má ghi nhận.',
    'Má tính rồi: tuần này con làm lời cho công ty nhiều hơn con ăn khô. Vậy là giỏi.',
  ],
  B: [
    'Con không làm gì sai hết. Mà cũng không làm gì để Má nhớ.',
    'Ổn. Ổn ở đây nghĩa là Má chưa thấy con làm hư cái gì.',
    'Con làm báo cáo đẹp quá, Má đọc không hiểu. Lần sau ghi con số to ra.',
    'Ba khen con lễ phép. Má thì khen con… cũng được.',
    'Tuần này tạm. Tuần sau Má muốn thấy con xuống xưởng nhiều hơn ngồi máy lạnh.',
  ],
  C: [
    'Con siêng lắm, mà siêng sai chỗ.',
    'Con ăn nói được, mà nói nhiều quá Má không biết con làm gì.',
    'Má thấy con cầm điện thoại hoài. Trả lời khách hay chơi game, Má không biết. Má chỉ thấy.',
    'Việc giao không xong mà khô ăn thử thì hết. Má đếm rồi.',
    'Con giỏi hơn con Ngân nhiều. Mà tuần này con Ngân làm nhiều hơn con.',
  ],
  D: [
    'Con có muốn đi đại lý không? Đi xa xa một chút. Má hỏi thiệt.',
    'Tuần này trễ việc, mất đơn, tốn khô. Con làm Má nhớ tới Kevin hồi mới về.',
    'Để Má tính. (Ai ở đây lâu đều biết "để Má tính" nghĩa là gì.)',
    'Má không la con. Má ghi vô sổ. Sổ của Má không có trang nào để xóa.',
    'Con làm Ba buồn, làm Má tốn tiền, làm cô Tư nấu dư. Ba tội trong một tuần.',
  ],
};

// The one path to becoming official: two A weeks, Má's trust, and the day you made Ba and Kevin agree
// (or kept Anh Dũng), without ever relabelling dates or faking reviews. Checked on Fridays 19, 26, 33.
const countA = (r) => (r.reviews || []).filter((x) => x.grade === 'A').length;
export const PROMOTION = {
  salary: 10_000_000,
  when: (r) => countA(r) >= 2 && r.day >= 19 && r.day <= 33 && r.st.uy >= 60 && (r.rel.hang || 0) >= 4
    && !!(r.flags.family_bridge || r.flags.dung_stays) && !r.flags.relabel_done && !r.flags.fake_reviews,
  offer: [
    ['nar', 'Má rót cho bạn một ly trà. Má chưa bao giờ rót trà cho ai, trừ Thần Tài.'],
    ['hang', 'Tuần sau con cứ đi làm bình thường nha.'],
    ['think', '"Bình thường" nghĩa là…?'],
    ['me', 'Dạ… vậy là con được nhận chính thức hả Má?'],
    ['hang', 'Ừ. Chính thức. Mười triệu. Hợp đồng thì để cuối năm làm luôn cho đủ giấy tờ.'],
    ['hung', '(từ phòng bên) Người nhà rồi con!'],
    { if: (r) => !!r.flags.family_bridge, then: [['hang', 'Bữa họp đó, con làm hai cha con nó gật đầu cùng lúc. Mười năm Má làm không được.']] },
    { if: (r) => !!r.flags.dung_stays, then: [['hang', 'Con giữ được thằng Dũng. Người ngoài giữ người ngoài. Má để ý.']] },
    { c: 'bm_offer', o: [
      { t: 'Nhận lời. "Dạ con cảm ơn Má."', fx: { uy: 5, rel: { hang: 2 }, set: { accept_official: true } }, then: [['hang', 'Từ thứ Hai con không còn là intern. Nghĩa là không ai tha cho con vì con là intern.'], ['tu', '(từ bếp) Ăn mừng thì ăn khô vụn nha con. Khô nguyên miếng là Má ghi sổ.']] },
      { t: 'Nhận, nhưng xin ký hợp đồng lao động ngay.', fx: { uy: 4, rel: { hang: -1 }, set: { accept_official: true, asked_contract: true } }, then: [['hang', 'Ngay? …Con giống thằng Dũng hồi trẻ. Ừ, để Vy soạn. Má ký… khi Má rảnh.']] },
      { t: '"Dạ con xin hết đợt thực tập rồi mới quyết ạ."', fx: { set: { accept_official: false } }, then: [['hang', 'Được. Má không hỏi lần hai. Người nhà Má hỏi một lần thôi.']] },
    ] },
  ],
  arc: ARC,
};

export const ENDINGS = {
  finish: (r) => {
    const ma = (r.rel && r.rel.hang) || 0, uy = (r.st && r.st.uy) || 0, f = r.flags || {};
    if (f.relabel_done || f.fake_reviews) return { title: 'Hết 45 ngày ở Ba & Má', text: 'Má ký giấy xác nhận thực tập, ghi: "Biết nghe lời." Bạn đọc ba lần. Ở nhà này, đó vừa là lời khen vừa là lời nhắc: bạn từng làm điều mình không muốn làm.' };
    if (ma >= 5 && uy >= 60) return { title: 'Hết 45 ngày ở Ba & Má', text: 'Má đưa bạn bao thư và hai ký khô gà: "Nói ba má con là Má gửi." Giấy xác nhận ghi "Siêng, tiết kiệm, không ăn cắp". Ở Ba & Má, đó là huân chương.' };
    if (f.ngan_free) return { title: 'Hết 45 ngày ở Ba & Má', text: 'Ngày cuối, Ngân tặng bạn một cái hộp quà Tết tự vẽ, bên trong có tờ giấy: "Cảm ơn cậu đã hỏi mình muốn làm gì." Hộp quà đẹp nhất công ty không bán.' };
    return { title: 'Hết 45 ngày ở Ba & Má', text: 'Chị Vy gửi giấy xác nhận thực tập, tên bạn bị gõ sai một chữ. Cô Tư dúi cho bạn bịch khô vụn. Tóc bạn thơm lá chanh thêm ba ngày nữa.' };
  },
  quit: (r) => {
    const f = r.flags || {};
    if (f.end_pushed) return { title: 'Nghỉ "tự nguyện" ở Ba & Má', text: 'Đơn ghi "tự nguyện". Bạn không đuổi ai, Má cũng không đuổi ai. Không ai đuổi ai mà bạn vẫn đứng ngoài cổng, ôm một bịch khô vụn. Gia đình là vậy.' };
    if (f.end_dung) return { title: 'Ra riêng với anh Dũng', text: 'Ba tháng sau, một shop khô nhỏ lên sàn: không có chữ "Ba", không có chữ "Má". Đại lý đầu tiên đặt hàng là cô Sáu. Cô vẫn trả chậm.' };
    return { title: 'Bạn nghỉ việc ở Ba & Má', text: 'Bạn bàn giao chìa khóa kho cho chú Bảy. Ba gửi tấm hình hoa sen lúc 5 giờ 47: "Con đi mạnh giỏi." Lần đầu tiên bạn thả tim mà mắt cay. Không phải tại tỏi phi.' };
  },
  layoff: (r) => ((r.flags || {}).end_pushed ? { title: 'Nghỉ "tự nguyện" ở Ba & Má', text: 'Đơn ghi "tự nguyện". Bạn không đuổi ai, Má cũng không đuổi ai. Không ai đuổi ai mà bạn vẫn đứng ngoài cổng, ôm một bịch khô vụn. Gia đình là vậy.' } : { title: 'Ba & Má "thu gọn"', text: 'Sàn tăng phí, Tết qua, Má nói "công ty thu gọn lại cho người nhà làm". Bạn là người ngoài đầu tiên được thu gọn. Kèm hai ký khô gà.' }),
};

// Hidden relationships: 2 drawn per run → flags tie_<id>. Used by routine beats and episodes.
export const TIES = [
  { id: 'khoa_vy', text: 'Anh Khoa và chị Vy đang hẹn hò lén' },
  { id: 'mi_koc', text: 'Út Mi sắp nghỉ để làm KOC tự do' },
  { id: 'tam_commission', text: 'Cậu Tám ăn hoa hồng của mối thịt' },
  { id: 'kevin_loan', text: 'Kevin lén vay tiền chạy quảng cáo' },
  { id: 'recipe_sadec', text: 'Công thức "gia truyền" của Ba học từ một bà bán khô ở Sa Đéc' },
];

export const OBJ_LINES = {
  printer: [['nar', 'Máy in bill. Tờ giấy dán: "Kẹt giấy lúc 10:55 là chuyện bình thường. Đừng khóc. Gọi anh Khoa."']],
  desk: [['nar', 'Bàn của bạn. Một laptop cũ của Kevin, một cuộn tem date, và một sợi lá chanh không biết từ đâu tới.']],
  okr: [['nar', 'Bảng chỉ tiêu Tết: "x3". Dưới góc có nét chữ Má: "x3 đơn, không x3 tiền điện".']],
  altar: [['nar', 'Bàn thờ Thần Tài. Một dĩa khô gà, một dĩa xoài sấy. Ai đó dán tờ "TỪ CẤM TRÊN LIVE" kế bên ông Địa.'], { fx: { uy: 1 } }],
  safe: [['nar', 'Két sắt của Má. Tờ giấy dán: "Muốn hỏi tiền thì hỏi Má. Đừng hỏi két. Két không trả lời. Má cũng vậy."']],
  plant: [['nar', 'Chậu lá chanh của Ba. Thẻ treo: "Ai hái là Má biết."']],
  redchair: [['nar', 'Chiếc ghế đỏ. Ghế của Má. Mèo Khô Gà là sinh vật duy nhất dám ngồi.']],
  interview: [['nar', 'Phòng họp gia đình. Trên bảng còn hai cột chưa xóa: "ĐẠI LÝ (Ba)" và "ONLINE (Kevin)". Ở giữa ai đó vẽ một dấu hỏi.']],
};

// Extra pantry option: "free" tasting — free the first time.
export const FOOD = [
  { t: 'Ăn thử khô gà "free" của cô Tư (+20)', fx: { nl: 20 }, then: [
    { if: (r) => !!r.flags.kho_free_used, then: [
      ['tu', 'Ăn tiếp hả con? Ăn đi.'],
      ['hang', '(vọng ra từ phòng kế toán) Gói thứ hai là 35 nghìn nha con. Má ghi sổ rồi.'],
      { fx: { money: -35_000 } },
      ['think', '"Free" ở đây là free một lần. Như tuổi trẻ.'],
    ], else: [
      ['tu', 'Mẻ mới nè. Ăn đi con, free.'],
      ['nar', 'Ngon thật. Ba phút sau bạn thấy tên mình trong sổ của Má, cột "Hao hụt".'],
      { fx: { set: { kho_free_used: true } } },
    ] },
  ] },
];

export const LIFE_EVENTS = [
  { id: 'bama_voice', emoji: '🎙️', text: '22:47. Má gửi tin nhắn thoại 3 phút 12 giây, bắt đầu bằng "Con ơi…".', choices: [
    { t: 'Nghe hết', fx: { nl: -6, rel: { hang: 1 } }, after: 'Mười giây đầu: "Mai con tới sớm chút." Ba phút còn lại là Má nói chuyện với cô Tư mà quên tắt máy.' },
    { t: 'Để mai nghe', fx: { nl: 4, dr: 1 }, after: '7:41 sáng, Má hỏi: "Con nghe voice Má chưa?" Bạn chưa.' },
  ] },
  { id: 'bama_kho_ve', emoji: '🎁', text: 'Má dúi cho bạn một bịch khô gà: "Đem về cho ba má con. Nói Má gửi."', when: (r) => (r.rel.hang || 0) >= 3, fx: { nl: 8, rel: { hang: 1 } }, after: 'Mẹ bạn ăn một miếng, rồi hỏi: "Chỗ này còn tuyển không con?"' },
  { id: 'bama_lachanh', emoji: '🍃', text: 'Trên xe buýt, người ngồi cạnh hít hít: "Em làm ở xưởng khô gà hả?" Tóc bạn thơm lá chanh tới ngày thứ ba.', choices: [
    { t: 'Giới thiệu shop luôn, xin đơn', fx: { uy: 1 }, after: 'Chị ấy đặt ba gói. Bạn vừa chốt đơn ngoài giờ làm. Không ai trả hoa hồng.' },
    { t: 'Đeo khẩu trang, im lặng', fx: { nl: 2 }, after: 'Mùi lá chanh xuyên qua khẩu trang. Khô gà không phải công việc. Khô gà là một lối sống.' },
  ] },
];
