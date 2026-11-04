// Đi Đâu Cũng Được — weekly review lines (said by anh Duy), promotion, endings, food, life events.

export const REVIEW = {
  A: [
    'Tuần này khách không nhắc gì tới em. Trong nghề này, đó là lời khen cao nhất.',
    'Em làm như hai người. Anh chỉ cần tuyển thêm nửa người nữa. Đùa thôi. Anh không có tiền tuyển nửa người.',
    'Vendor gọi em là "em bên Đi Đâu dễ thương mà làm chắc". Anh nghe câu đó sau bảy năm mới có.',
    'Em có Plan B. Plan B của em có Plan C. Anh hơi lo cho em, theo nghĩa tốt.',
    'Em ngủ trên đống bạt mà không than. Anh ghi nhận. Tuần sau ngủ ở nhà.',
    'Tuần này anh tắt bộ đàm số ba được hai lần. Vì có em. Copy.',
  ],
  B: [
    'Ổn. Không ai gọi anh lúc 2 giờ sáng vì em. Ổn.',
    'Em nhanh nhẹn. Nhanh tới mức quên mang micro dự phòng. Tuần sau mang.',
    'Báo giá em làm đẹp. Chỉ là lỗ. Sửa cái phần lỗ.',
    'Kỹ năng xử lý mưa: tốt. Kỹ năng xem dự báo thời tiết: chưa có.',
    'Em làm đúng việc. Giờ anh cần em làm đúng việc trước khi anh phải hỏi.',
  ],
  C: [
    'Rooming list sai một phòng là hai người lạ ngủ chung. Em hiểu ý anh chứ.',
    'Em cần học nói "không" với khách. Nhưng đừng học từ chị Thảo.',
    'Tuần này anh thấy em bận. Anh chưa thấy em xong.',
    'Vendor bảo em dễ thương, nên họ toàn bùng em trước. Dễ thương vừa thôi.',
    'Em sáng tạo. Nhưng sáng tạo mà trễ deadline thì gọi là "ý tưởng cho năm sau".',
  ],
  D: [
    'Ba việc trễ trong một tuần. Trong nghề này, trễ một việc là khách đứng ngoài mưa.',
    'Anh hỏi thật: em có muốn chạy show không? Không phải câu tu từ. Bộ đàm cần người trả lời.',
    'Tuần này anh gọi bộ đàm số 4 mười lần. Không ai trả lời. Anh tưởng em đi show cho công ty khác.',
    'Anh sẽ ghi nhận. Theo nghĩa cô Bích ghi nhận.',
    'Em nhớ cái câu "có Plan B chưa"? Tuần này em không có cả Plan A.',
  ],
};

const countA = (r) => (r.reviews || []).filter((x) => x.grade === 'A').length;

export const PROMOTION = {
  salary: 10_000_000,
  // The one way in: two A weeks, saved the rainy gala, proved yourself on the mic or the no-show bus,
  // and anh Duy trusts you — and early enough (by day 33) for one peak season to play out.
  when: (r) => r.day >= 19 && r.day <= 33 && countA(r) >= 2 && !!r.flags.gala_saved
    && (!!r.flags.mc_hosted || !!r.flags.bus_saved) && (r.rel.duy || 0) >= 6 && r.st.uy >= 65,
  offer: [
    ['nar', 'Review vừa xong thì cửa mở. Chị Kiều bước vào. Không cầm micro. Lần đầu tiên bạn thấy chị không cầm micro.'],
    ['kieu', 'Chị nói ngắn, không cần pháo tay. Chị muốn giữ em lại. Chính thức. Mười triệu. Hợp đồng lao động, có bảo hiểm.'],
    ['duy', 'Kèm bộ đàm số 4 vĩnh viễn. Và anh nói trước: tháng 12 có 23 show. Tháng 12 không có cuối tuần.'],
    { if: (r) => !!r.flags.gala_saved, then: [['kieu', 'Đêm gala mưa, chị đứng dưới cái rạp đó và nhớ năm 2009. Lần này không ai phải ướt. Chị cần người như vậy.']] },
    { if: (r) => !!r.flags.mc_hosted, then: [['kieu', 'Với lại em cầm micro được. Ở đây biết cầm micro là có thêm một nghề dự phòng.']] },
    ['think', 'Mười triệu. Bảo hiểm. Tháng 12 không có cuối tuần.'],
    { c: 'ev_offer', o: [
      { t: 'Nhận lời. "Copy."', fx: { uy: 5, rel: { duy: 2, kieu: 2 }, set: { accept_official: true } }, then: [
        ['duy', 'Copy. Từ thứ Hai em không còn là intern. Nghĩa là không ai tha lỗi cho em vì là intern nữa.'],
        ['kieu', 'XIN MỘT TRÀNG PHÁO TAY! …Chị xin lỗi. Chị nhịn được 40 giây. Kỷ lục.'],
      ] },
      { t: '"Em xin cảm ơn, nhưng em muốn học hết kỳ thực tập đã ạ."', fx: { rel: { duy: 1 }, set: { accept_official: false } }, then: [
        ['kieu', 'Được. Chị không hỏi lần hai. Nhưng chị sẽ nhớ em. Chị nhớ dai lắm. Hỏi anh Quang.'],
        ['duy', '(nhỏ) Khôn đấy. Tháng 12 khó lắm.'],
      ] },
    ] },
  ],
  arc: ['off_welcome', 'off_three_shows', 'off_poach', 'off_final'],
};

export const ENDINGS = {
  finish: (r) => {
    const duy = (r.rel && r.rel.duy) || 0;
    const st = r.st || { uy: 50 };
    const f = r.flags || {};
    if (f.dirty_invoice) return {
      title: 'Hết 45 ngày ở Đi Đâu Cũng Được',
      text: 'Cô Bích ký giấy xác nhận thực tập. Bằng bút bi xanh. Kèm một dòng: "Đã nhắc về hóa đơn." Bạn hiểu dòng đó nghĩa là gì. Bạn sẽ nhớ nó lâu hơn mọi lời khen.',
    };
    if (duy >= 6 && st.uy >= 70) return {
      title: 'Hết 45 ngày: "Có Plan B"',
      text: `Anh Duy viết thư giới thiệu đúng ba dòng: "Đọc brief trước khi cầm micro. Có Plan B. Không bỏ ai lại." Rồi anh tặng bạn bộ đàm số 4.${f.gala_saved ? ' Chị Kiều kẹp kèm một tấm ảnh: 300 khách dưới rạp, mưa bên ngoài.' : ''} "Tháng 12 cần người, em biết số anh rồi."`,
    };
    if (f.mc_hosted) return {
      title: 'Hết 45 ngày: một giọng MC mới',
      text: 'Chị Kiều tặng bạn cái micro cũ của gala 2009. Nó không còn chạy. "Để em nhớ cảm giác cầm micro trước 200 người lần đầu." Bạn đặt nó lên kệ, cạnh giấy xác nhận thực tập.',
    };
    return {
      title: 'Hết 45 ngày ở Đi Đâu Cũng Được',
      text: 'Chị Lan gửi giấy xác nhận thực tập qua email. Tên bạn bị sai một dấu. Vy gửi kèm một clip TikTok: bạn ngủ gật trên xe về, cả đoàn chụp ảnh. 2 triệu view. Bạn được nhớ tới, theo một cách nào đó.',
    };
  },
  quit: (r) => {
    const f = (r && r.flags) || {};
    if (f.final === 'client') return {
      title: 'Bạn chuyển sang "phía khách"',
      text: 'Bạn làm chuyên viên sự kiện nội bộ cho Bê Tông Vững Chãi. Giờ hành chính. Cuối tuần nghỉ. Tháng sau, bạn gửi brief year-end cho Đi Đâu Cũng Được. Chị Thảo trả lời: "Dạ được ạ em!" Bạn bật cười, rồi gửi kèm một trang yêu cầu Plan B.',
    };
    if (f.final === 'ctv') return {
      title: 'Bạn bị cho nghỉ (và được gọi đúng tên)',
      text: 'Thấp điểm sau Tết. Công ty "chuyển em sang cộng tác viên". Bạn không ký đơn tự nguyện. Cô Bích làm quyết định đúng tên, đủ từng đồng. Ba tháng sau, chị Kiều gọi: "Tháng 12 em chạy show 3 giúp chị không? Theo show." Bạn báo giá. Không bớt chút nào.',
    };
    if (f.final === 'mc') return {
      title: 'Bạn thành MC tự do',
      text: 'Bạn rời công ty với một cái micro và danh bạ 40 khách. Show đầu tiên: một đám cưới ở Long An. Mưa. Không có rạp. Bạn dẫn trong mưa, bằng trí nhớ, hai tiếng. Sáng hôm sau chị Kiều nhắn: "Năm 2009 chị cũng vậy. Lập công ty đi em."',
    };
    if (f.final === 'burnout') return {
      title: 'Bạn nghỉ để ngủ',
      text: 'Bạn nghỉ sau mùa cao điểm. Tuần đầu tiên bạn ngủ 14 tiếng mỗi ngày và giật mình mỗi khi nghe tiếng rè. Tuần thứ hai bạn tắt chế độ "copy" trong đầu. Tuần thứ ba anh Duy nhắn: "Anh cũng nghỉ rồi. Hôm nay sinh nhật con anh. Anh có mặt."',
    };
    return {
      title: 'Bạn nghỉ việc ở Đi Đâu Cũng Được',
      text: 'Bạn trả lại bộ đàm số 4 cho chị Lan. Chị ghi vào sổ: "Đã trả. Hiếm." Lúc bạn bước ra cửa, Mèo Plan B chui vào kho. Chiều đó trời mưa. Lần đầu tiên, đó không còn là việc của bạn.',
    };
  },
  layoff: (r) => ({
    title: 'Bạn được "chuyển sang cộng tác viên theo show"',
    text: (r && r.flags && r.flags.dirty_invoice)
      ? 'Công ty "tái cấu trúc sau mùa cao điểm". Cô Bích nhắc lại chuyện hóa đơn trong biên bản. Không ai cãi. Bạn ôm áo đồng phục chữ STAFF về, mặc đi ngủ.'
      : 'Sau Tết ít job. Chị Kiều gọi đây là "linh hoạt". Bạn gọi đây là thất nghiệp có lịch trực. Hai tuần sau công ty gọi bạn chạy show, theo giá cộng tác viên. Bạn nhận. Rồi tăng giá.',
  }),
};

export const FOOD = [
  { t: 'Ăn buffet thừa từ gala tối qua (miễn phí, +20, hơi nguội)', fx: { nl: 20, clock: 10 }, then: [
    ['nar', 'Một hộp nhựa: nem rán, gỏi ngó sen, một miếng bánh kem có chữ "25 NĂ". Bạn không hỏi gala nào.'],
    { if: (r) => Math.floor(r.clock || 0) % 3 === 0, then: [['nar', 'Món gỏi hơi chua. Chua theo kiểu không nên chua. Bụng bạn phản đối nhẹ.'], { fx: { nl: -8 } }] },
  ] },
];

export const LIFE_EVENTS = [
  { id: 'ev_zalo_23h', emoji: '📱', text: '23:04. Khách nhắn: "Em ơi mai mấy giờ đón?" Bạn đã gửi lịch ba lần. Có ảnh. Có ghim.', choices: [
    { t: 'Trả lời lần thứ tư, thật lịch sự', fx: { nl: -4 }, after: 'Khách trả lời "ok em" kèm sticker. Bạn mất ngủ 40 phút vì tức.' },
    { t: 'Để sáng mai trả lời', fx: { nl: 3, dr: 1 }, after: 'Sáng mai khách nhắn: "Em ngủ sớm vậy". Bạn ngủ đủ. Đáng.' },
  ] },
  { id: 'ev_buffet_home', emoji: '🍱', text: 'Bạn mang hai hộp buffet thừa từ show về phòng trọ. Bạn cùng phòng nhìn bạn như nhìn một anh hùng.', fx: { nl: 8, money: 40_000 }, after: 'Tiết kiệm được hai bữa tối. Nghề sự kiện có những phúc lợi không ghi trong hợp đồng.' },
  { id: 'ev_bat_dream', emoji: '🛌', text: 'Đêm nay bạn mơ thấy mình đếm ghế Chiavari. Hai trăm chín mươi bảy. Thiếu ba. Bạn đếm lại.', when: (r) => !!r.flags.night_shift, fx: { nl: -6 }, after: 'Bạn tỉnh dậy lúc 4 giờ sáng và nói "copy" với cái quạt.' },
  { id: 'ev_raincoat', emoji: '🌧️', text: 'Trời đổ mưa trên đường về. Trong balo bạn có… một cái áo mưa tiện lợi lấy từ kho.', fx: { nl: 2 }, after: 'Người qua đường ướt hết. Bạn khô. Mèo Plan B đã dạy bạn điều này.' },
];
