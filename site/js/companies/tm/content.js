// T&M Partners — episodes after Day 1, routine beats, weekly review lines, promotion arc, endings.
// SEED CONTENT: a small starter set so the engine runs end to end. The T&M writer expands this file.
const isTier = (...ids) => (s) => ids.includes(s.tier);
void isTier;

// Episodes: full 3D drama days. Fields: id, title, intro, day | minDay/maxDay, official?, end?, pos?, steps, diary(run)
export const EPISODES = [];

// Routine beats: short scenes for ordinary days (engine picks 2 per day, never repeating until the pool runs out).
export const ROUTINE = [
  { id: 'r_standup', who: 'dat', obj: 'Daily stand-up ở bảng Scrum', time: '09:00', pos: { dat: 'su_dat', an: 'su1', long: 'su2', trang: 'su3', khang: 'su5' }, scene: [
    ['dat', 'Daily stand-up! Time-box mười lăm phút. Yesterday, Today, Blocker. {ten}, mời em.'],
    { c: '_r_standup', o: [
      { t: '"Yesterday em làm deck. Today em làm deck. Blocker: deck."', fx: { uy: 1, rel: { an: 1 } }, then: [['an', '(thì thầm) Chuẩn. Đời mình là một cái deck.']] },
      { t: 'Báo cáo chi tiết từng đầu việc, kèm số liệu.', fx: { uy: 2, nl: -3, rel: { dat: 1 } }, then: [['dat', 'Love it. Nhưng lần sau ngắn hơn nha. Time-box là văn hóa.']] },
    ] },
    ['nar', 'Stand-up mười lăm phút kết thúc sau ba mươi tám phút. Velocity: "tốt".'],
  ] },
  { id: 'r_tuyet_small', who: 'tuyet', obj: 'Chị Tuyết gọi qua "góp vài ý nhỏ"', time: '11:00', scene: [
    ['tuyet', 'Em ơi, chị xem slide của em rồi. Chị chỉ có một vài ý nhỏ thôi.'],
    ['nar', '(Mười một ý. Ý thứ bảy mâu thuẫn với ý thứ hai.)'],
    { c: '_r_tuyet_small', o: [
      { t: 'Hỏi lại ý nào ưu tiên nhất.', fx: { uy: 2, rel: { tuyet: 1 } }, then: [['tuyet', 'Ý hai. Còn ý bảy là để em suy nghĩ thôi.']] },
      { t: '"Dạ em sửa hết ạ."', fx: { nl: -6 }, then: [['think', 'Mười một ý. Một buổi chiều. Một linh hồn.']] },
    ] },
  ] },
  { id: 'r_han_buzz', who: 'han', obj: 'Chị Hân vẫy tay gọi', time: '14:00', scene: [
    ['han', 'Em ơi, mình cần leverage cái synergy của team để disrupt cái mindset cũ nha. Em hiểu không?'],
    { c: '_r_han_buzz', o: [
      { t: '"Dạ, ý chị là cần một kế hoạch cụ thể ạ?"', fx: { uy: 1, rel: { han: -1 } }, then: [['han', 'Cụ thể thì… để tuần sau. Tuần này mình cứ vision đã.']] },
      { t: 'Gật đầu thật sâu.', fx: { rel: { han: 1 }, dr: 1 }, then: [['han', 'Em đúng là có growth mindset!']] },
    ] },
  ] },
  { id: 'r_gam_room', who: 'gam', obj: 'Chị Gấm nhờ hỏi lịch phòng họp', time: '10:30', scene: [
    ['gam', 'Em ơi, phòng họp chiều nay có ai đặt chưa nhỉ? Chị ghi bút chì nên… hơi mờ.'],
    ['nar', 'Trong sổ, cùng một khung giờ có ba cái tên. Một trong số đó là "Mèo KPI".'],
    { fx: { rel: { gam: 1 }, nl: -2 } },
  ] },
  { id: 'r_quynh_receipt', who: 'quynh', obj: 'Chị Quỳnh cần hóa đơn gốc', time: '15:00', scene: [
    ['quynh', 'Hóa đơn taxi tuần trước của em đâu? Bản gốc nhé. Ảnh chụp là không được.'],
    { c: '_r_quynh', o: [
      { t: 'Lục balo tìm hóa đơn.', fx: { rel: { quynh: 1 }, nl: -3 }, then: [['nar', 'Bạn tìm thấy nó, kẹp giữa hai tờ giấy nháp ghi "big pitcher".']] },
      { t: '"Em lỡ làm mất rồi ạ."', fx: { money: -85_000, dr: 1 }, then: [['quynh', 'Vậy em tự chịu khoản này nhé. Quy định là quy định.']] },
    ] },
  ] },
  { id: 'r_trang_help', who: 'trang', obj: 'Trang có vẻ lại đang ôm việc', time: '16:00', scene: [
    ['trang', 'Không sao đâu, mình làm kịp mà… chỉ là hôm nay có chín việc thôi.'],
    { c: '_r_trang', o: [
      { t: 'Giúp Trang một việc nhỏ.', fx: { nl: -5, rel: { trang: 2 } }, then: [['trang', 'Cảm ơn bạn. Thật đấy.']] },
      { t: 'Nhắc Trang trả bớt việc về đúng người.', fx: { rel: { trang: 1, long: 1 }, uy: 1 }, then: [['long', 'Đúng rồi. Trả tao việc của tao đi.']] },
    ] },
  ] },
];

// Weekly review lines, by grade (the manager says two of them). Funny, a little mean, very "đời".
export const REVIEW = {
  A: ['Tuần này em làm tốt. Đừng để chị phải nói câu này lần thứ hai nhé, chị không quen.', 'Em có business sense. Hiếm đấy. Giữ nó, đừng để Hân dạy em buzzword.', 'Chị chỉ có một ý nhỏ: tiếp tục như vậy.'],
  B: ['Ổn. "Ổn" ở T&M nghĩa là chị không nhớ em làm sai gì.', 'Em làm đúng việc. Giờ chị cần em làm đúng việc nhanh hơn.', 'Không có gì để chê. Nhưng chị sẽ tìm.'],
  C: ['Tuần này chị thấy em bận. Nhưng chị chưa thấy em làm ra cái gì.', 'Em cần nhìn vấn đề này ở góc độ chiến lược hơn. Và đúng giờ hơn.', 'Chị không cần em có mặt. Chị cần em có kết quả.'],
  D: ['Em có muốn tiếp tục ở T&M không? Chị hỏi thật, không phải câu tu từ.', 'Ba việc trễ hạn trong một tuần. Kỷ lục này trước đây là của Bảo.', 'Chị sẽ ghi nhận. Theo nghĩa xấu.'],
};

// Exactly one way to become official. The offer scene must set flag accept_official true/false.
export const PROMOTION = {
  salary: 15_000_000,
  when: (r) => (r.reviews || []).filter((x) => x.grade === 'A').length >= 2 && r.day >= 15 && r.st.uy >= 70,
  offer: [
    ['tuyet', 'Chị nói ngắn. Chị muốn giữ em lại, chính thức. Mười lăm triệu. Hợp đồng lao động, có bảo hiểm.'],
    ['think', 'Đây là lần đầu tiên chị Tuyết nói ngắn.'],
    { c: '_tm_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, set: { accept_official: true } }, then: [['tuyet', 'Tốt. Từ thứ Hai, em không còn là intern. Nghĩa là không còn ai tha lỗi cho em vì là intern.']] },
      { t: '"Em xin suy nghĩ thêm ạ."', fx: { set: { accept_official: false } }, then: [['tuyet', 'Được. Nhưng chị không hỏi lần hai.']] },
    ] },
  ],
  arc: [],
};

export const ENDINGS = {
  finish: (r) => ({
    title: 'Hết 45 ngày thực tập ở T&M',
    text: (r.rel.tuyet || 0) >= 4 ? 'Chị Tuyết ký giấy xác nhận và viết thêm một dòng tay: "Có tư duy. Cần ngủ nhiều hơn." Thư giới thiệu này đáng giá hơn bạn nghĩ.'
      : 'Chị Thư gửi giấy xác nhận thực tập qua email, tên bạn bị gõ sai một chữ. "Không phải việc của mình, nhưng mà… mình sửa rồi nha."',
  }),
  quit: { title: 'Bạn nghỉ việc ở T&M', text: 'Bạn gửi email nghỉ việc lúc 17:59. Chị Tuyết trả lời lúc 18:00: "Chị có vài ý nhỏ về email này."' },
  layoff: { title: 'T&M "tái cấu trúc"', text: 'Chị Hân gọi đây là "right-sizing for the future". Bạn gọi đây là thất nghiệp.' },
};

// Hidden family ties: each T&M run draws 2 at random; flags tie_<id> become true and episodes may reveal them.
export const TIES = [
  { id: 'gam_tuyet', text: 'Chị Gấm là em họ chị Tuyết' },
  { id: 'khang_han', text: 'Khang là cháu chị Hân' },
  { id: 'phuong_friend', text: 'Chị Phương là con gái bạn thân chị Tuyết' },
  { id: 'binh_quynh', text: 'Anh Bình và chị Quỳnh sắp cưới' },
];

export const OBJ_LINES = {};
export const FOOD = null;
export const LIFE_EVENTS = [];
