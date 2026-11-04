// T&M Partners — everything after Day 1: episodes, routine beats, side tasks, weekly review lines, promotion arc,
// endings, hidden ties, office object lines, pantry option and after-work life events.
// Episodes: episodes.js (intern, days 2–40) + official.js (promotion offer + 4-episode official arc).
import { SIDE_TASKS as DAY1_SIDE_TASKS } from '../../story/tm/day1.js';
import { INTERN_EPISODES } from './episodes.js';
import { OFFICIAL_EPISODES, PROMOTION } from './official.js';
import { ROUTINE } from './routine.js';

export { ROUTINE, PROMOTION };
export const EPISODES = [...INTERN_EPISODES, ...OFFICIAL_EPISODES];

// Side tasks ("việc vặt"): the 7 Day-1 templates + T&M extras.
const EXTRA_SIDE_TASKS = [
  { id: 'tshirt', title: 'Thu size áo team building của Long cho chị Phương', from: 'phuong', base: 70, legs: [
    { npc: 'phuong', line: ['phuong', 'Em hỏi size áo của Long giúp chị nha! Long né chị ba ngày rồi 💖'] },
    { npc: 'long', line: ['long', 'Size áo hả? Ghi "XL, và không đi". Ghi y chang nhé.'] },
    { npc: 'phuong', line: ['phuong', 'XL! Còn chữ "và không đi" chị coi như em ghi nhầm.'] },
  ] },
  { id: 'hansign', title: 'Xin chữ ký chị Hân vào phiếu chi cho chị Quỳnh', from: 'quynh', base: 80, legs: [
    { npc: 'quynh', line: ['quynh', 'Phiếu chi "workshop mindset" thiếu chữ ký chị Hân. Bản gốc. Em mang qua giúp chị.'] },
    { npc: 'han', line: ['han', 'Ký đây nha. Chị ký kèm ngôi sao cho có năng lượng ✨'] },
    { npc: 'quynh', line: ['quynh', 'Ngôi sao không phải chữ ký. Nhưng thôi, chị chấp nhận. Lần này.'] },
  ] },
  { id: 'toner', title: 'Mang hộp mực từ chỗ chị Gấm ra máy in cho anh Bình', from: 'binh', base: 60, legs: [
    { npc: 'binh', line: ['binh', 'Máy in hết mực. Em lấy giúp anh hộp mực ở chỗ chị Gấm. Đừng restart gì cả.'] },
    { npc: 'gam', line: ['gam', 'Hộp mực hả… để chị xem một tí… đây. Chị ghi sổ: "mực, một hộp, bút chì".'] },
    { obj: 'printer', line: ['nar', 'Bạn lắp hộp mực. Máy in kêu một tiếng hài lòng, rồi in ngay 40 trang "Overseas Insights" của Khang đang chờ trong hàng.'] },
  ] },
  { id: 'paper', title: 'In bài báo khoa học 40 trang cho chị Hạ', from: 'ha', base: 90, legs: [
    { npc: 'ha', line: ['ha', 'Em in giúp chị bài này nhé. Bốn mươi trang thôi. Chị thích đọc giấy, gạch chân được.'] },
    { obj: 'printer', line: ['nar', 'Máy in in hai mặt, nhưng mặt sau lộn ngược. Bạn in lại. Bốn mươi trang, lần hai.'] },
    { npc: 'ha', line: ['ha', 'Cảm ơn em! Em có muốn nghe chị tóm tắt không? Chỉ bốn mươi phút thôi.'] },
  ] },
  { id: 'oatmilk', title: 'Tìm hộp sữa yến mạch của Khang trong pantry', from: 'khang', base: 50, legs: [
    { npc: 'khang', line: ['khang', 'Em thấy hộp oat milk của anh đâu không? Actually, overseas ai cũng uống oat milk.'] },
    { obj: 'coffee', line: ['nar', 'Hộp sữa yến mạch nằm sau ba hộp sữa đặc, dán giấy "KHANG · DON\'T TOUCH · THANKS 🙏".'] },
    { npc: 'khang', line: ['khang', 'Thanks! Em đúng là có overseas mindset.'] },
  ] },
  { id: 'minutes', title: 'Đưa biên bản họp của chị Linh cho An ký xác nhận', from: 'linh', base: 70, legs: [
    { npc: 'linh', line: ['linh', 'Biên bản họp sáng nay. Em đưa An ký xác nhận giúp chị. An là "một" trong "một rưỡi" mà.'] },
    { npc: 'an', line: ['an', 'Ký rồi. Ghi chú: biên bản dài hơn cuộc họp.'] },
    { npc: 'linh', line: ['linh', 'Cảm ơn em. Lưu vào thư mục "Bằng chứng".'] },
  ] },
];
export const SIDE_TASKS = [...DAY1_SIDE_TASKS, ...EXTRA_SIDE_TASKS];

// Weekly review lines, by grade (Tuyết says two of them). Funny, a little mean, very "đời".
export const REVIEW = {
  A: [
    'Tuần này em làm tốt. Đừng để chị phải nói câu này lần thứ hai nhé, chị không quen.',
    'Em có business sense. Hiếm đấy. Giữ nó, đừng để Hân dạy em buzzword.',
    'Chị chỉ có một ý nhỏ: tiếp tục như vậy.',
    'Chị đọc báo cáo tuần của em mà không phải hỏi "vậy thì sao". Lần đầu trong tháng.',
    'Em làm đúng việc, đúng hạn, và không làm chị phải nhắc. Ở T&M, đó gần như là siêu năng lực.',
    'Khách hỏi tên em. Chị nói tên em. Chị không nói tên ai khác. Hiểu ý chị chứ.',
  ],
  B: [
    'Ổn. "Ổn" ở T&M nghĩa là chị không nhớ em làm sai gì.',
    'Em làm đúng việc. Giờ chị cần em làm đúng việc nhanh hơn.',
    'Không có gì để chê. Nhưng chị sẽ tìm.',
    'Tuần này em có phân tích. Tuần sau chị cần business implication.',
    'Em đi đúng hướng. Hơi chậm, như thang máy tòa này.',
    'Chị chỉ có vài ý nhỏ. Ba ý. Phần còn lại chị giữ cho tuần sau.',
  ],
  C: [
    'Tuần này chị thấy em bận. Nhưng chị chưa thấy em làm ra cái gì.',
    'Em cần nhìn vấn đề này ở góc độ chiến lược hơn. Và đúng giờ hơn.',
    'Chị không cần em có mặt. Chị cần em có kết quả.',
    'Đây là phân tích. Nhưng đâu là business implication? Chị hỏi câu này hơi nhiều với em rồi đấy.',
    'Việc vặt trễ hạn là việc nhỏ. Việc nhỏ trễ hạn nhiều lần là tính cách.',
    'Em làm như người đang chờ ai đó bảo phải làm gì. Ở đây không ai bảo đâu, em phải hỏi.',
  ],
  D: [
    'Em có muốn tiếp tục ở T&M không? Chị hỏi thật, không phải câu tu từ.',
    'Ba việc trễ hạn trong một tuần. Kỷ lục này trước đây là của Bảo.',
    'Chị sẽ ghi nhận. Theo nghĩa xấu.',
    'Chị không có ý nhỏ nào cho tuần này. Đó là tin xấu, em ạ.',
    'Tuần này Mèo KPI hoàn thành nhiều việc hơn em. Nó ngủ mười tám tiếng một ngày.',
    'Chị cần người làm đúng việc. Tuần này em làm đúng một việc: có mặt.',
  ],
};

// Endings. The final arc episode sets tm_final = 'quit' | 'layoff'; both endings read it, so the text always matches.
const quitText = (r) => {
  const f = r.flags, rel = r.rel || {};
  const bits = ['Bạn gửi thông báo nghỉ việc, báo trước đúng 30 ngày, bàn giao đủ ba thư mục và một tờ giấy nhớ "Đừng tin chữ FINAL".'];
  if (f.off_credit) bits.push('Chị Tuyết viết cho bạn thư giới thiệu dài nhất chị từng viết. Không có ý nhỏ nào. Chỉ có ý lớn.');
  else if ((rel.tuyet || 0) >= 5) bits.push('Chị Tuyết trả lời email: "Chị có vài ý nhỏ." Rồi gửi kèm thư giới thiệu.');
  else bits.push('Chị Tuyết trả lời email lúc 23:47: "Ok em." Bạn chưa bao giờ hiểu hết hai chữ đó.');
  if (f.mai_stays) bits.push('Chị Mai hẹn bạn cà phê tuần sau: "Chị có một khách cần người biết hỏi đúng câu."');
  else if (f.mai_handover) bits.push('Chị Mai, giờ ở Bốn Phương, nhắn: "Bên chị đang tuyển. View sông. Lần này em là người được mời ba lần."');
  if (f.off_kind) bits.push('Bạn intern mới gửi bạn tin nhắn: "Em về đúng giờ được hai tuần rồi ạ. Cảm ơn anh/chị."');
  if (f.tie_khang_han) bits.push('Khang thả tim email nghỉ việc của bạn. Dì Khang thì không.');
  return { title: 'Bạn nghỉ việc ở T&M', text: bits.join(' ') };
};
const layoffText = (r) => {
  const f = r.flags;
  const bits = [];
  if (f.off_stayed) bits.push('Bạn ở lại, kiêm việc của hai người, báo cáo cho Khang. Ba tuần sau, trong "right-sizing giai đoạn 2", tên bạn nằm ở dòng đầu tiên.');
  else if (f.off_by_the_book) bits.push('Bạn đòi quyết định bằng văn bản. Hai tuần sau chị Phương gửi, dùng template năm 2016, kèm khoản bồi thường cho những ngày báo trước còn thiếu.');
  else bits.push('Chị Hân gọi đây là "right-sizing for the future". Bạn gọi đây là thất nghiệp.');
  bits.push('Chưa đủ mười hai tháng nên không có trợ cấp mất việc, cũng chưa đủ điều kiện trợ cấp thất nghiệp. (Thông tin giải trí, không phải tư vấn pháp lý.)');
  if (f.bao_official) bits.push('Anh Bảo, giờ là nhân viên chính thức, đứng chờ ở thang máy: "Ba năm tao chờ để được ký. Mày được ký rồi bị cắt. Đời công bằng theo kiểu lạ."');
  else if (f.bao_left) bits.push('Anh Bảo nhắn từ chỗ làm mới: "Bên tao đang tuyển. Hợp đồng ký ngay buổi đầu. Thật."');
  if ((r.rel || {}).long >= 4) bits.push('Long gửi bạn bản đầy đủ "Từ điển Hân – Việt". Mục R: "right-sizing" = "chị cần ngân sách cho Khang".');
  return { title: 'T&M "tái cấu trúc"', text: bits.join(' ') };
};

export const ENDINGS = {
  finish: (r) => {
    const f = r.flags || {}, rel = r.rel || {}, st = r.st || {};
    const bits = [];
    if (f.promo_offered && f.accept_official === false) bits.push('Bạn từ chối lời mời chính thức của chị Tuyết và học cho hết 45 ngày. Chị Tuyết không hỏi lần hai, đúng như đã nói.');
    if ((rel.tuyet || 0) >= 5 && (st.uy || 0) >= 70) bits.push('Chị Tuyết ký giấy xác nhận thực tập và viết thêm một dòng tay: "Có tư duy. Biết hỏi đúng câu. Cần ngủ nhiều hơn." Thư này đáng giá hơn bạn nghĩ.');
    else if ((rel.tuyet || 0) >= 2) bits.push('Chị Tuyết ký giấy xác nhận thực tập, kèm "một vài ý nhỏ": bảy ý. Ý cuối là "Chúc em may mắn".');
    else bits.push('Thư gửi giấy xác nhận thực tập qua email, tên bạn bị gõ sai một chữ. "Không phải việc của mình, nhưng mà… mình sửa rồi nha."');
    if (f.bao_official) bits.push('Anh Bảo, nhân viên chính thức năm đầu tiên sau ba năm thực tập, tiễn bạn ra thang máy.');
    else if (f.bao_left) bits.push('Bạn và anh Bảo cùng rời T&M trong một tuần. Sổ tay ba năm của anh nằm trong balo bạn.');
    if (f.trang_said_no) bits.push('Trang tặng bạn một hộp bánh. "Mình mua dư. Cố ý."');
    if (f.mai_stays) bits.push('Chị Mai ở lại T&M với ba điều kiện. Chị nói một trong ba điều đó là nhờ bạn.');
    if (f.culture_fix) bits.push('Tháng sau T&M thử một tháng không team building thứ Bảy. Chị Phương gọi nó là "Bonding qua nghỉ ngơi".');
    if (f.final_win) bits.push('Êm Ru ký tiếp giai đoạn 2. Trong email cảm ơn có tên bạn, đúng chính tả.');
    if (f.tie_gam_tuyet && f.covered_gam) bits.push('Chị Gấm, em họ chị Tuyết, giữ cho bạn một tấm thẻ từ. "Lúc nào quay lại thì dùng. Chị ghi bút bi."');
    return { title: 'Hết 45 ngày thực tập ở T&M', text: bits.join(' ') };
  },
  quit: (r) => ((r.flags || {}).tm_final === 'layoff' ? layoffText(r) : quitText(r)),
  layoff: (r) => ((r.flags || {}).tm_final === 'quit' ? quitText(r) : layoffText(r)),
};

// Hidden relationships: each T&M run draws 2 at random; flags tie_<id> become true and episodes may reveal them.
export const TIES = [
  { id: 'gam_tuyet', text: 'Chị Gấm là em họ chị Tuyết' },
  { id: 'khang_han', text: 'Khang gọi chị Hân bằng dì' },
  { id: 'phuong_friend', text: 'Chị Phương là con gái bạn thân chị Tuyết' },
  { id: 'binh_quynh', text: 'Anh Bình và chị Quỳnh đang hẹn hò bí mật' },
  { id: 'bao_driver', text: 'Bảo là con của bác tài xế cũ của chị Tuyết' },
  { id: 'dat_mba', text: 'Anh Đạt là bạn học MBA của chị Hân' },
];

// What office objects say in T&M when they are not part of the current story step.
export const OBJ_LINES = {
  printer: [['nar', 'Máy in T&M. Tờ giấy dán: "Kẹt giấy thì đừng giật. Hỏi IT". Bên dưới, nét khác: "IT sẽ bảo restart". Bên dưới nữa: "MK: hỏi Bảo".']],
  desk: [
    ['nar', 'Bàn của bạn. Laptop đời 2015, chậu xương rồng ai đó để lại, và tờ giấy nhớ "Đừng tin chữ FINAL".'],
    { if: (r) => !!r.flags.bao_notebook, then: [['nar', 'Trong ngăn kéo là cuốn sổ tay ba năm của anh Bảo. Trang đầu: "Ai thật sự quyết việc gì (cập nhật liên tục)".']] },
  ],
  okr: [['nar', 'Bảng OKR quý: "O1: Excellence. KR1: Eventually." Có người vẽ thêm con mèo ở góc, ghi "KR của KPI: ngủ".']],
  altar: [['nar', 'Bàn thờ Thần Tài đèn nhấp nháy. Lễ vật hôm nay: một nải chuối, một gói sticky note hồng của anh Đạt, và bản in "deck_FINAL_REAL".']],
  safe: [['nar', 'Két sắt. Bên trong có con dấu công ty và chiếc khăn mùi soa của chị Gấm. Tờ giấy dán: "Muốn hỏi tiền, hỏi chị Quỳnh. Đừng hỏi két."']],
  plant: [
    ['nar', 'Cây kim tiền. Thẻ treo: "Phụ trách tưới: (chưa rõ)".'],
    { if: (r) => !!r.flags.knows_whodoes, then: [['think', 'File "Ai làm gì" cũng ghi "(chưa rõ)". Ít nhất là nhất quán.']] },
  ],
  redchair: [['nar', 'Chiếc ghế đỏ không ai ngồi. Ghế của Mèo KPI, Employee of the Month mười tám tháng liền. Không ai dám tranh cử.']],
  interview: [['nar', 'Phòng họp. Trên bảng trắng còn chữ chưa xóa: "Synergy?? → hỏi Long". Ai đó vẽ thêm mũi tên chỉ tới "→ Long cũng không biết".']],
};

// One extra pantry option (shown first in the pantry menu).
export const FOOD = [
  { t: 'Bánh mì còn dư từ workshop khách (miễn phí, +18)', fx: { nl: 18, dr: 1 }, then: [
    ['nar', 'Bánh mì pate, túi giấy in chữ "Workshop Êm Ru". Còn ấm theo nghĩa nhiệt độ phòng.'],
    ['nar', 'Năm phút sau, chị Tuyết đi qua pantry: "Ai thấy cái bánh mì của chị không?" Bạn nhai chậm lại.'],
  ] },
];

// After-work life events with a T&M flavour (mixed into the shared pool).
export const LIFE_EVENTS = [
  { id: 'tm_family_group', emoji: '💖', text: '23:12. Group "T&M Family 💖": chị Phương gửi poll chủ đề team building, kèm mười bốn sticker và một bài thơ.', choices: [
    { t: 'Vote cho xong rồi ngủ', fx: { nl: -3 }, after: 'Bạn vote "Bonding qua nấu ăn". Lúc 23:40 chị Phương thả tim cho từng phiếu.' },
    { t: 'Tắt thông báo group', fx: { nl: 5, dr: 1 }, after: 'Sáng mai bạn có 212 tin nhắn chưa đọc và một giấc ngủ trọn vẹn.' },
  ] },
  { id: 'tm_tuyet_2347', emoji: '🌙', text: 'Điện thoại sáng lúc 23:47. Chị Tuyết: "Em ngủ chưa?"', choices: [
    { t: '"Dạ chưa ạ."', fx: { nl: -12, uy: 1 }, after: 'Ba ý nhỏ, tới 0:40. Ý thứ ba là "thôi mai nói".' },
    { t: 'Giả vờ đã ngủ', fx: { nl: 4, dr: 1 }, after: 'Sáng mai chị Tuyết không nhắc gì. Điều đó còn đáng sợ hơn.' },
  ] },
  { id: 'tm_linkedin', emoji: '🌍', text: 'Khang tag bạn vào bài LinkedIn: "Teamwork, overseas-style 🌏". Ảnh minh họa là bàn làm việc của bạn, chụp lúc bạn đi vệ sinh.', choices: [
    { t: 'Thả tim cho yên chuyện', fx: { dr: 1 }, after: 'Bài viết có 41 lượt thích. 38 lượt từ nhân viên T&M, 3 lượt từ chị Hân, dùng ba tài khoản.' },
    { t: 'Gỡ tag', fx: { nl: 2, dr: 2 }, after: 'Sáng mai Khang hỏi: "Em gỡ tag hả? Overseas người ta không gỡ tag đâu."' },
  ] },
];
