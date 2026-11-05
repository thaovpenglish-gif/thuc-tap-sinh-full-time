// Trend Trễ Agency — routine beats for ordinary days (engine picks 2–3 per day, no repeats until the pool runs out).
// Choice ids start with "_" (private, not polled).

const f = (k) => (r) => !!r.flags[k];

const TYPO_MINI = {
  type: 'quiz', title: 'Soát caption trước khi đăng', icon: '🔤',
  prompt: 'Sương sắp bấm đăng. Câu nào đúng chính tả?', time: 30, pass: 0.66,
  questions: [
    { q: 'Caption Ông Táo', options: ['Tết sum vây, mì đầy nồi', 'Tết sum vầy, mì đầy nồi', 'Tết xum vầy, mì đầy nồi'], correct: 1 },
    { q: 'Caption Răng Xinh', options: ['Nụ cười rạng rỡ, tự tin cả ngày', 'Nụ cười rạn rỡ, tự tin cả ngày', 'Nụ cười rạng rở, tự tin cả ngày'], correct: 0 },
    { q: 'Caption Sen Hồng', options: ['Tiết kiệm hôm nay, an tâm ngày mai', 'Tiếc kiệm hôm nay, an tâm ngày mai', 'Tiết kiệm hôm nay, an tâm ngày mây'], correct: 0 },
  ],
};
const HASHTAG_MINI = {
  type: 'pick', title: 'Hashtag cho Trà Sữa', icon: '#️⃣',
  prompt: 'Client muốn "nhiều hashtag". Chọn 2 cái không làm brand xấu hổ.', pick: 2, time: 25, pass: 0.5,
  items: [
    { text: '#TâmTrạngGìCũngCóSize', correct: true },
    { text: '#TràSữaTâmTrạng', correct: true },
    { text: '#viral #trending #fyp #xuhuong #capcut' },
    { text: '#UốngLàGhiềnBỏLàĐiên' },
    { text: '#[CHÈN_HASHTAG]' },
  ],
};

export const ROUTINE = [
  { id: 'r_emoi_offline', who: 'diep', obj: 'Chị Diệp: "Client nhắn em ơi rồi offline"', time: '11:05', scene: [
    ['diep', 'Chị Nguyệt nhắn "Em ơi" lúc 9:02. Rồi offline. Hai tiếng rồi. Chị không dám làm gì khác.'],
    ['think', '"Em ơi" không có gì phía sau. Như một bộ phim chỉ có trailer.'],
    { c: '_r_emoi', o: [
      { t: 'Nhắn lại: "Dạ em đây ạ, chị cần gì em chuẩn bị trước ạ."', fx: { uy: 1, rel: { diep: 1 } }, then: [['diep', 'Hay. Đặt bóng về phía client. Chị học được rồi.']] },
      { t: 'Cùng chị Diệp nhìn màn hình chờ.', fx: { nl: -4, rel: { diep: 1 } }, then: [['nar', '11:14, chị Nguyệt online: "À chị nhầm nhóm." Hai tiếng của hai người, ghi timesheet vào đâu?']] },
    ] },
  ] },
  { id: 'r_final_file', who: 'vy', obj: 'Vỹ không mở được file', time: '11:00', scene: [
    ['vy', 'File "KV_FINAL_final_v7_sualancuoi_THATSU.psd" không mở được. Báo lỗi: "File bị hỏng". Như anh.'],
    { c: '_r_final', o: [
      { t: 'Tìm bản tự động lưu trong thư mục tạm.', fx: { uy: 2, rel: { vy: 2 } }, then: [['vy', 'Có bản lưu lúc 2:14 sáng. Anh không nhớ mình thức tới 2:14. Nhưng cảm ơn em.']] },
      { t: '"Anh thử restart máy chưa?"', fx: { rel: { vy: -1 } }, then: [['vy', 'Em nói giống IT ở công ty cũ của anh. Công ty đó giờ không còn.']] },
    ] },
  ] },
  { id: 'r_wrong_group', who: 'obj:desk', obj: 'Về bàn: bạn đang gõ dở một tin nhắn…', time: '15:30', scene: [
    ['nar', 'Bạn vừa gõ "chị Nguyệt lại đổi ý rồi mọi người ơi 🙄" và bấm gửi. Rồi nhìn tên nhóm: "[Ông Táo × Trend Trễ] Tết 2027".'],
    ['think', 'Có client. CÓ CLIENT.'],
    { c: '_r_wrong', o: [
      { t: 'Thu hồi ngay trong 3 giây.', fx: { nl: -3, dr: 1 }, then: [['nar', 'Thu hồi kịp. Dòng "Bạn đã thu hồi một tin nhắn" nằm đó, như một vết sẹo. Chị Nguyệt thả 😮.']] },
      { t: 'Gửi tiếp: "…là em đùa thôi, ý tưởng mới của chị hay lắm ạ!"', fx: { dr: 4, rel: { nguyet: -1 } }, then: [['nguyet', 'Ừ em. Chị biết em đùa. Chị cũng đùa khi đổi ý. 🙂']] },
    ] },
  ] },
  { id: 'r_sticker', who: 'diep', obj: 'Chị Diệp: "Client thả 👍 là duyệt hay đã xem?"', time: '14:00', scene: [
    ['diep', 'Chị Nguyệt thả 👍 vào KV. Duyệt hay đã xem? Câu hỏi triết học lớn nhất ngành mình.'],
    { c: '_r_sticker', o: [
      { t: 'Nhắn hỏi lại: "Chị duyệt bản này để mình đi in nha chị?"', fx: { uy: 2, rel: { diep: 1 } }, then: [['nguyet', 'Ơ chưa em, chị mới xem thôi. Sếp chị chưa xem.'], ['diep', 'Em vừa cứu mình khỏi in 5.000 tờ sai.']] },
      { t: 'Coi như duyệt, gửi nhà in.', fx: { dr: 3 }, then: [['nar', 'Chiều đó chị Nguyệt nhắn: "Ủa chị chưa duyệt mà em?" Năm nghìn tờ poster bắt đầu trở thành giấy gói xôi.']] },
    ] },
  ] },
  { id: 'r_lofi', who: 'khai', obj: 'Anh Khải bật nhạc lo-fi rất to', time: '10:30', scene: [
    ['nar', 'Loa của anh Khải đang phát "lo-fi beats to get rejected to". Rất to. Cả phòng nghe.'],
    ['khai', 'Để sáng tạo. Đừng tắt.'],
    { c: '_r_lofi', o: [
      { t: 'Đeo tai nghe chống ồn.', fx: { nl: 2 }, then: [['think', 'Thế giới im lặng. Chỉ còn tiếng Zalo rung trong túi.']] },
      { t: 'Xin anh Khải đổi bài.', fx: { rel: { khai: 1 }, dr: 1 }, then: [['khai', 'Được. Bài này tên là "Client đổi ý lúc 23 giờ". Cũng lo-fi.']] },
    ] },
  ] },
  { id: 'r_brief_viral', who: 'tung', obj: 'Anh Tùng có "brief mới" cho bạn', time: '10:00', scene: [
    ['tung', 'Em ơi, có brief mới! Client bên app học tiếng Anh. Brief là: "làm sao cho viral". Hết.'],
    ['think', 'Không đối tượng. Không ngân sách. Không deadline. Chỉ có "viral".'],
    { c: '_r_brief', o: [
      { t: 'Gửi lại 4 câu hỏi: đối tượng, mục tiêu, ngân sách, deadline.', fx: { uy: 3, rel: { tung: -1, diep: 1 } }, then: [['tung', 'Bốn câu hỏi… nghe như brief ngược. Ok, anh hỏi client. Make it… clear.']] },
      { t: 'Ngồi nghĩ 20 ý viral luôn.', fx: { nl: -5, rel: { tung: 2 } }, then: [['tung', 'Hai mươi ý! Năng suất! …Mà client là app gì nhỉ? Anh quên rồi.']] },
    ] },
  ] },
  { id: 'r_quangcao', who: 'kieu', obj: 'Chị Kiều nhờ duyệt caption KOL', time: '11:30', scene: [
    ['kieu', 'Em duyệt giùm chị caption nháp của KOL nha. Bạn ấy viết tự nhiên lắm.'],
    ['nar', 'Caption mở đầu: "#quangcao Hôm nay mình được nhãn hàng trả tiền để nói là mình rất thích sản phẩm này."'],
    { c: '_r_quangcao', o: [
      { t: '"Ghi rõ quảng cáo là đúng, nhưng viết lại câu sau cho tự nhiên ạ."', fx: { uy: 2, rel: { kieu: 1 } }, then: [['kieu', 'Ừ đúng. Minh bạch mà không… quá thật. Em có khiếu đó.']] },
      { t: 'Duyệt luôn, vì nó thật thà.', fx: { dr: 2 }, then: [['suong', 'Bài lên được 40.000 like. Comment: "Lần đầu thấy KOL thật thà vậy." Client chưa biết nên vui hay buồn.']] },
    ] },
  ] },
  { id: 'r_meta_reject', who: 'loc', obj: 'Anh Lộc: quảng cáo bị từ chối', time: '14:30', scene: [
    ['loc', 'Quảng cáo Mì Ông Táo bị nền tảng từ chối. Lý do: "nội dung nhạy cảm". Hình: một tô mì.'],
    ['loc', 'Chắc tại sợi mì… hơi cong.'],
    { c: '_r_meta', o: [
      { t: 'Đổi góc chụp tô mì, gửi duyệt lại.', fx: { uy: 1, rel: { loc: 1 } }, then: [['loc', 'Duyệt rồi. Thuật toán thích mì thẳng. Ghi nhận.']] },
      { t: 'Gửi khiếu nại kèm lời giải thích dài 2 trang.', fx: { nl: -4 }, then: [['loc', 'Họ trả lời sau 5 ngày. Lúc đó mùa Tết qua rồi. Nhưng họ xin lỗi rất lịch sự.']] },
    ] },
  ] },
  { id: 'r_pizza', who: 'diep', obj: 'Có pizza! Client gửi tặng sau khi duyệt KV', time: '15:30', scene: [
    ['diep', 'Răng Xinh duyệt KV lúc 1 giờ sáng kèm "thanks em, ngủ ngon". Giờ họ gửi pizza tới. Ăn đi em.'],
    ['nar', 'Pizza vị hải sản. Ăn xong, theo thói quen nghề nghiệp, mọi người đi đánh răng bằng sample Răng Xinh.'],
    { c: '_r_pizza', o: [
      { t: 'Ăn hai miếng.', fx: { nl: 15 } },
      { t: 'Chụp ảnh pizza, đăng story tag client cảm ơn.', fx: { nl: 8, uy: 1, rel: { diep: 1 } }, then: [['diep', 'Biết cảm ơn công khai. Tố chất account.']] },
    ] },
  ] },
  { id: 'r_wifi', who: 'tung', obj: 'Anh Tùng: wifi sập giữa buổi trình bày', time: '14:00', scene: [
    ['tung', 'Wifi sập! Đang trình bày online cho client! Ai biết mật khẩu cục phát dự phòng?'],
    ['nar', 'Trên cục phát có dán giấy: "Mật khẩu: MakeItPop2016". Chữ đã mờ gần hết.'],
    { c: '_r_wifi', o: [
      { t: 'Phát 4G từ điện thoại cho anh Tùng.', fx: { nl: -2, uy: 2, rel: { tung: 2 } }, then: [['tung', 'Cứu tinh! Anh sẽ ghi tên em vào… cái gì đó. Một slide nào đó.']] },
      { t: 'Đọc to mật khẩu mờ: "MakeItPop2016".', fx: { rel: { tung: 1 }, dr: 1 }, then: [['tung', 'Sai… à đúng, phải viết hoa cả chữ POP. POP luôn viết hoa.']] },
    ] },
  ] },
  { id: 'r_quote_cut', who: 'hong', obj: 'Chị Hồng: client ép giá 30%', time: '15:00', scene: [
    ['hong', 'Răng Xinh xin giảm báo giá 30%. Kèm câu: "Lần sau chị gửi job nhiều." Câu này chị nghe từ năm 2017.'],
    { c: '_r_quote', o: [
      { t: 'Đề xuất giảm 10%, bớt một hạng mục tương ứng.', fx: { uy: 2, rel: { hong: 2 } }, then: [['hong', 'Giảm giá kèm giảm việc. Lần đầu có người ở đây nói câu đó. Chị muốn khóc.']] },
      { t: '"Mình chiều client một lần đi chị."', fx: { rel: { hong: -1, tung: 1 } }, then: [['hong', 'Một lần. Lần thứ bốn mươi mốt.']] },
    ] },
  ] },
  { id: 'r_props_desk', who: 'phat', obj: 'Anh Phát: bàn bạn đang là bối cảnh quay', time: '09:45', scene: [
    ['phat', 'Bàn em hôm nay là bối cảnh "văn phòng hạnh phúc" cho clip Sen Hồng. Em ngồi tạm pantry nha.'],
    ['nar', 'Trên bàn bạn: một bình hoa giả, một ly cà phê không có cà phê, và laptop của bạn được thay bằng một cái laptop bìa carton.'],
    { c: '_r_props', o: [
      { t: 'Ngồi pantry làm việc.', fx: { nl: 3, rel: { phat: 1 } }, then: [['nar', 'Pantry yên tĩnh. Gần mì. Bạn làm việc hiệu quả hơn mọi ngày. Hơi đáng lo.']] },
      { t: 'Xin đóng vai quần chúng trong clip.', fx: { rel: { phat: 2 }, dr: 1 }, then: [['phat', 'Được. Vai: "nhân viên hạnh phúc". Diễn khó nhất là chỗ đó.']] },
    ] },
  ] },
  { id: 'r_hacked', who: 'suong', obj: 'Sương: fanpage client bị hack!', time: '11:00', scene: [
    ['suong', 'Fanpage Sen Hồng bị hack! Đang đăng bài bán đồng hồ! Admin là ai? Ai có quyền admin?'],
    ['nar', 'Danh sách admin: một bạn AE đã nghỉ năm 2023, một tài khoản tên "Test", và anh Tùng (không nhớ mật khẩu).'],
    { c: '_r_hacked', o: [
      { t: 'Liên hệ bạn AE cũ qua LinkedIn.', fx: { uy: 2, rel: { suong: 2 } }, then: [['suong', 'Bạn ấy trả lời sau 10 phút! Lấy lại được page. Bạn ấy nói: "Mình biết ngày này sẽ tới."']] },
      { t: 'Gọi anh Tùng nhớ lại mật khẩu.', fx: { nl: -3 }, then: [['tung', 'Mật khẩu là… MakeItPop gì đó. 2016? 2018? Anh đổi theo năm thắng giải. Mà mình chưa thắng.']] },
    ] },
  ] },
  { id: 'r_mute', who: 'diep', obj: 'Chị Diệp vừa họp online xong, mặt trắng bệch', time: '16:00', scene: [
    ['diep', 'Lúc nãy anh Lộc quên tắt mic. Client nghe được câu "bà này lại đổi ý". Chị Nguyệt im 5 giây rồi nói tiếp như chưa có gì.'],
    ['diep', 'Giờ chị phải nhắn gì đó. Em gợi ý giúp chị.'],
    { c: '_r_mute', o: [
      { t: '"Nhắn xin lỗi thẳng, ngắn, không giải thích vòng vo ạ."', fx: { uy: 2, rel: { diep: 1 } }, then: [['nguyet', 'Ừ em. Chị biết bên em mệt. Chị cũng mệt. Mai mình làm tiếp.']] },
      { t: '"Nói là anh Lộc đang nói về… bà chủ nhà ạ."', fx: { dr: 3, rel: { loc: 1 } }, then: [['loc', 'Bà chủ nhà anh cũng hay đổi ý thật. Không tính là nói dối.']] },
    ] },
  ] },
  { id: 'r_timesheet_ping', who: 'hong', obj: 'Chị Hồng nhắc timesheet lần thứ ba', time: '16:00', when: (r) => r.day >= 8, scene: [
    ['hong', 'Lần ba. Timesheet. Tuần trước em ghi "Khác: 6 giờ". Khác là gì?'],
    { c: '_r_ts', o: [
      { t: 'Sửa lại, ghi rõ từng client.', fx: { uy: 1, nl: -2, rel: { hong: 2 } }, then: [['hong', 'Đẹp. Timesheet đẹp là timesheet thật. Hiếm như brief rõ ràng.']] },
      { t: '"Khác là… chờ client feedback ạ."', fx: { rel: { hong: 1 }, dr: 1 }, then: [['hong', 'Vậy ghi vào client đã bắt em chờ. Chị dặn từ ngày đầu rồi mà.']] },
    ] },
  ] },
  { id: 'r_crop', who: 'thi', obj: 'Thi gửi ảnh team trên LinkedIn', time: '12:30', scene: [
    ['thi', 'Anh Tùng đăng ảnh team lên LinkedIn: "Gia đình Trend Trễ ❤️". Bạn ở mép. Bị cắt mất nửa mặt.'],
    ['thi', 'Mình cũng bị cắt. Ở agency, intern và copywriter luôn đứng ở mép.'],
    { c: '_r_crop', o: [
      { t: 'Comment "Nửa mặt còn lại đang làm deck ạ 😄".', fx: { rel: { tung: 1, thi: 1 }, dr: 1 }, then: [['tung', '(reply) HAHA. Ghim comment này!']] },
      { t: 'Thả tim và lướt qua.', fx: { nl: 1 } },
    ] },
  ] },
  { id: 'r_memory_card', who: 'phat', obj: 'Anh Phát: freelancer làm mất thẻ nhớ', time: '15:00', scene: [
    ['phat', 'Freelancer quay phim báo mất thẻ nhớ. Bốn tiếng quay Sen Hồng. Trong đó có cảnh anh giám đốc ngân hàng cười. Ổng không bao giờ cười.'],
    { c: '_r_card', o: [
      { t: 'Gợi ý kiểm tra túi áo, xe, ba lô của freelancer.', fx: { uy: 1, rel: { phat: 2 } }, then: [['phat', 'Tìm thấy. Trong túi áo khoác. Của anh. Đừng kể ai.']] },
      { t: 'Đề xuất xin quay lại một cảnh ngắn.', fx: { nl: -3, rel: { phat: 1 } }, then: [['phat', 'Quay lại thì được. Nhưng anh giám đốc không cười lần hai. Ổng đã dùng hết nụ cười cả năm.']] },
    ] },
  ] },
  { id: 'r_brainstorm_old', who: 'quan', obj: 'Anh Quân: brainstorm ra ý cũ', time: '14:30', scene: [
    ['quan', 'Brainstorm ba tiếng, ra một ý: "Tết này về nhà". Anh tra lại. Đó là ý của mình năm ngoái. Và năm kia.'],
    { c: '_r_old', o: [
      { t: '"Vậy insight không đổi, chỉ cách kể phải đổi anh ạ."', fx: { uy: 2, rel: { quan: 2 } }, then: [['quan', '…Em vừa nói một câu anh định viết thành framework. Anh xin bản quyền.']] },
      { t: 'Đề xuất đổi thành "Tết này đừng về".', fx: { dr: 2, rel: { quan: 1 } }, then: [['quan', 'Ngược. Gây tranh cãi. Client sẽ sợ. Anh thích. Nhưng không.']] },
    ] },
  ] },
  { id: 'r_print_color', who: 'obj:printer', obj: 'Máy in đang in poster đỏ… thành cam', time: '11:30', scene: [
    ['nar', 'Poster Tết màu đỏ của Ông Táo đi ra từ máy in với màu cam. Rất cam. Như mì để quá ba phút.'],
    { c: '_r_print', o: [
      { t: 'Kiểm tra hộp mực, thay ống mực đỏ.', fx: { uy: 1, nl: -2 }, then: [['nar', 'Ống mực đỏ đã hết từ tháng Chín. Bạn thay. Poster ra màu đỏ. Cả phòng vỗ tay nhẹ.']] },
      { t: 'Ghi chú lên poster: "màu thật đỏ hơn".', fx: { dr: 1 }, then: [['vy', 'Em vừa phát minh ra cách in rẻ nhất ngành.']] },
    ] },
  ] },
  { id: 'r_trend_late', who: 'suong', obj: 'Sương: "Trend mới! Làm liền đi em!"', time: '17:30', scene: [
    ['suong', 'Trend mới nổi! Âm thanh "ơ kìa" đang hot. Làm liền cho Trà Sữa đi em, mai là hết trend!'],
    { c: '_r_trend', o: [
      { t: 'Ở lại làm liền một clip 15 giây.', fx: { nl: -10, uy: 2, rel: { suong: 2 } }, then: [['suong', 'Đăng lúc 19:40! Mười nghìn view! Mà trend này… hơi trễ. Đúng chất công ty mình.']] },
      { t: '"Mai em làm bản kỹ hơn nha chị."', fx: { nl: 5 }, then: [['suong', 'Mai thì trend chết. Nhưng không sao. Tên công ty là Trend Trễ mà.']] },
    ] },
  ] },
  { id: 'r_voice_tuan', who: 'diep', obj: 'Anh Tuấn gửi voice: "trẻ hơn"', time: '10:30', scene: [
    ['tuan', '(voice 4 phút) …nói chung là trẻ hơn em. Trẻ mà không trẻ con. Gen Z mà sếp anh 55 tuổi vẫn hiểu.'],
    ['diep', 'Em dịch giùm chị câu đó sang brief cho creative nha.'],
    { c: '_r_tuan', o: [
      { t: 'Brief: "Màu tươi, câu ngắn, không dùng tiếng lóng."', fx: { uy: 2, rel: { diep: 1 } }, then: [['khai', 'Brief này đọc được. Ai viết vậy? …Intern hả. Ừ.']] },
      { t: 'Brief: "Trẻ hơn (theo anh Tuấn)."', fx: { rel: { khai: -1 } }, then: [['khai', 'Đây không phải brief. Đây là trích dẫn.']] },
    ] },
  ] },
  { id: 'r_wellness', who: 'hong', obj: 'Chị Hồng phát thông báo "Tuần lễ sức khỏe tinh thần"', time: '09:45', when: (r) => r.status !== 'official' && !r.flags.wellness_seen, scene: [
    { fx: { set: { wellness_seen: true } } },
    ['hong', 'Anh Tùng muốn tổ chức "Tuần lễ sức khỏe tinh thần". Giữa mùa Tết. Mỗi ngày 5 phút thiền lúc 17:45.'],
    ['think', '17:45. Đúng giờ "em ơi".'],
    { c: '_r_well', o: [
      { t: 'Đề xuất dời sang 12:30 cho mọi người tham gia được.', fx: { uy: 1, rel: { hong: 1 } }, then: [['hong', 'Ừ. Dời. Mà 12:30 là giờ ăn. Vậy mình thiền bằng cách… ăn. Được đó.']] },
      { t: 'Đăng ký tham gia.', fx: { nl: 4 }, then: [['nar', 'Buổi thiền đầu tiên: năm phút. Có ba cuộc gọi của client. Cả phòng thở đều theo nhịp chuông Zalo.']] },
    ] },
  ] },
  { id: 'r_wedding_card', who: 'diep', obj: 'Chị Diệp: client nhờ "tiện" làm thiệp cưới', time: '15:30', scene: [
    ['diep', 'Chị Nguyệt nhắn: "Tiện thiết kế giùm chị cái thiệp cưới nha em. Nhanh thôi." Thiệp cưới. Của chị Nguyệt.'],
    { c: '_r_wedding', o: [
      { t: 'Gợi ý: "Mình tặng chị thiệp, coi như quà cưới của cả team."', fx: { rel: { diep: 1, nguyet: 1, vy: -1 } }, then: [['vy', 'Quà cưới bằng sức lao động của anh. Anh sẽ ký tên nhỏ ở góc.']] },
      { t: 'Gợi ý: báo giá nhẹ, như một job ngoài.', fx: { uy: 1, rel: { hong: 1 } }, then: [['diep', 'Chị Nguyệt nói "ok em" rồi tự làm trên Canva. Thiệp có hiệu ứng lửa và bảy font.']] },
    ] },
  ] },
  { id: 'r_rival_like', who: 'loc', obj: 'Anh Lộc đang lướt tin tuyển dụng', time: '13:30', scene: [
    ['nar', 'Màn hình anh Lộc: tin tuyển "Media Lead" của một agency đối thủ. Anh Lộc vừa bấm like. Rồi bấm bỏ like. Rồi like lại.'],
    ['loc', 'Em không thấy gì hết nha.'],
    { c: '_r_rival', o: [
      { t: '"Em không thấy gì ạ. Mà lương bên đó bao nhiêu anh?"', fx: { rel: { loc: 2 }, dr: 1 }, then: [['loc', 'Hơn 30%. Nhưng CPM bên đó còn cao hơn. Anh đùa. Anh không biết nữa.']] },
      { t: 'Im lặng quay đi.', fx: { rel: { loc: 1 } } },
    ] },
  ] },
  { id: 'r_whiteboard', who: 'obj:okr', obj: 'Ai đó vừa viết thêm lên bảng trắng', time: '10:00', scene: [
    ['nar', 'Ai đó vừa vẽ một con kỳ lân cạnh dòng "BRIEF RÕ RÀNG LÀ MỘT HUYỀN THOẠI" trên bảng trắng.'],
    { c: '_r_wb', o: [
      { t: 'Viết thêm: "Feedback nhẹ cũng vậy."', fx: { rel: { khai: 1, thi: 1 }, dr: 1 }, then: [['khai', '(từ xa) Ai viết đó? …Đúng.']] },
      { t: 'Xóa trước khi client ghé.', fx: { uy: 1, rel: { diep: 1 } }, then: [['diep', 'Cảm ơn em. Tuần trước chị Nguyệt suýt đọc được câu "Bà Wow sắp tới".']] },
    ] },
  ] },
  { id: 'r_cat_keyboard', who: 'vy', obj: 'Vỹ: Mèo Insight vừa nằm lên bàn phím', time: '14:00', scene: [
    ['vy', 'Mèo Insight nằm lên bàn phím anh. Nó vừa gõ "ggggggggggg" vào layer chữ và… nhìn đẹp hơn bản của anh.'],
    ['kpi', '(ngáp, rồi nằm im như một insight chưa ai nói ra)'],
    { c: '_r_cat', o: [
      { t: 'Gợi ý giữ lại cái nhịp chữ đó.', fx: { rel: { vy: 1 }, uy: 1 }, then: [['vy', 'Credit: "Typography: Mèo Insight". Anh nói thật, không đùa.']] },
      { t: 'Bế con mèo ra ghế đỏ.', fx: { nl: 2 } },
    ] },
  ] },
  { id: 'r_linh_late', who: 'linh', obj: 'Linh tới trễ, nhờ bạn một việc', time: '10:15', scene: [
    ['linh', 'Bạn ơi, nãy WIP mình tới trễ. Chị Diệp có hỏi mình không? Bạn nói giúp mình là mình… đi gặp client được không?'],
    { c: '_r_linh', o: [
      { t: '"Mình không nói dối giúp được. Nhưng mình gửi bạn call report."', fx: { uy: 1, rel: { linh: 1 } }, then: [['linh', 'Ừ… hợp lý. Cảm ơn bạn. Mình sẽ tự nói với chị Diệp.']] },
      { t: 'Nói đỡ giúp Linh.', fx: { dr: 2, rel: { linh: 2, diep: -1 } }, then: [['diep', 'Gặp client nào? Client nào gặp lúc 9:45? …Thôi được. Lần này.']] },
    ] },
  ] },
  { id: 'r_thi_poem', who: 'thi', obj: 'Thi đọc bài thơ mới', time: '16:30', scene: [
    ['thi', 'Bài mới: "Em ơi lúc năm giờ / anh ơi lúc nửa đêm / client ơi lúc nào / cũng là lúc mình mềm". Bạn thấy sao?'],
    { c: '_r_poem', o: [
      { t: '"Câu cuối phải đọc to lên mới thấy."', fx: { rel: { thi: 2 } }, then: [['thi', 'Bạn trích lời mình! Bạn hiểu mình!']] },
      { t: 'Góp ý: "Đổi chữ mềm thành mệt?"', fx: { uy: 1, rel: { thi: 1 } }, then: [['thi', '"Mệt" thì thật quá. Thơ không cần thật. Thơ cần… ừ, đổi đi.']] },
    ] },
  ] },
  { id: 'r_framework', who: 'quan', obj: 'Anh Quân khoe framework mới', time: '11:00', scene: [
    ['quan', 'Framework mới của anh: T.R.E.N.D. Target, Reason, Emotion, Need, Deadline. Tên là ăn theo công ty.'],
    { c: '_r_fw', o: [
      { t: '"Thiếu chữ T thứ hai: Trễ ạ."', fx: { rel: { quan: 1, khai: 1 }, dr: 1 }, then: [['quan', 'T.R.E.N.D.T. …Không đọc được. Nhưng đúng.']] },
      { t: 'Xin áp dụng thử cho brief Răng Xinh.', fx: { uy: 2, nl: -3, rel: { quan: 2 } }, then: [['quan', 'Em là người đầu tiên áp dụng framework của anh. Kể cả anh cũng chưa.']] },
    ] },
  ] },
  { id: 'r_ai_hands', who: 'vy', obj: 'Vỹ: "Dùng AI cho rẻ, rồi chê AI"', time: '15:00', scene: [
    ['vy', 'Client cắt 40% ngân sách, bảo "dùng AI làm hình đi em". Anh làm. Giờ họ chê: "Nhìn AI quá, tay bảy ngón".'],
    { c: '_r_ai', o: [
      { t: 'Đề xuất: chụp thật sản phẩm, AI chỉ làm nền.', fx: { uy: 2, rel: { vy: 2 } }, then: [['vy', 'Sản phẩm thật, nền AI, tay người thật. Năm ngón. Anh đếm rồi.']] },
      { t: 'Sửa tay thành năm ngón rồi gửi lại.', fx: { nl: -4 }, then: [['vy', 'Năm ngón rồi. Giờ client nói "không có hồn". AI không có hồn, mà người sửa AI cũng mất hồn luôn.']] },
    ] },
  ] },
  { id: 'r_kol_price', who: 'kieu', obj: 'Chị Kiều: KOL đổi giá phút chót', time: '13:00', scene: [
    ['kieu', 'KOL Bé Mây đổi giá phút chót. Tăng 50% "vì đang hot". Clip ngày mai lên.'],
    { c: '_r_kolprice', o: [
      { t: 'Kiểm tra hợp đồng: giá đã chốt bằng văn bản chưa?', fx: { uy: 2, rel: { kieu: -1 } }, then: [['kieu', 'Có hợp đồng… chị quên. Ừ. Giá cũ. Em làm chị nhớ ra mình có giấy tờ.']] },
      { t: 'Đề xuất đổi sang 3 KOC nhỏ cùng ngân sách.', fx: { uy: 1, rel: { kieu: 1 } }, then: [['kieu', 'Ba KOC nhỏ, review thật. Tương tác còn cao hơn. Chị biết, chỉ là… KOC không có quản lý gửi quà Tết.']] },
    ] },
  ] },
  { id: 'r_typo', who: 'suong', obj: 'Sương nhờ soát caption trước khi đăng', time: '11:30', scene: [
    ['suong', 'Ba caption cho ba client, đăng trong năm phút. Em soát giúp chị. Lần trước chị đăng "Tết sum vây".'],
    { mini: TYPO_MINI,
      good: [['suong', 'Sạch. Không vây, không rạn, không mây. Em có mắt.'], { fx: { uy: 2, rel: { suong: 2 } } }],
      bad: [['suong', 'Đăng rồi… có người comment sửa chính tả. 300 like cho comment đó. Hơn bài gốc.'], { fx: { dr: 2 } }],
    },
  ] },
  { id: 'r_hashtag', who: 'diep', obj: 'Chị Diệp: client muốn "nhiều hashtag"', time: '14:30', when: f('size_idea'), scene: [
    ['diep', 'Trà Sữa muốn "nhiều hashtag" cho bài Tâm trạng gì cũng có size. Chọn giúp chị cái nào không làm brand xấu hổ.'],
    { mini: HASHTAG_MINI,
      good: [['diep', 'Hai hashtag, sạch, có tên chiến dịch. Client hỏi "ít vậy em?". Chị nói "ít mà chất".'], { fx: { uy: 2, rel: { diep: 1 } } }],
      bad: [['diep', 'Hashtag rác, hashtag "ghiền/điên" là tự bôi đen brand đó em. Còn #[CHÈN_HASHTAG] là lỗi của KOL, không phải lựa chọn.'], { fx: { dr: 1 } }],
    },
  ] },
  { id: 'r_diep_bday', who: 'thi', obj: 'Thi rủ: sinh nhật bất ngờ cho chị Diệp', time: '17:15', when: (r) => !r.flags.diep_bday_done, scene: [
    { fx: { set: { diep_bday_done: true } } },
    ['thi', 'Hôm nay sinh nhật chị Diệp. Chị đang deadline. Tụi mình định bưng bánh ra lúc chị đang gọi client. Bạn tham gia không?'],
    { c: '_r_bday', o: [
      { t: 'Góp tiền mua bánh, cầm nến.', fx: { money: -50_000, rel: { diep: 2, thi: 1 } }, then: [['nar', 'Chị Diệp vừa nói "dạ em sửa liền ạ" thì thấy bánh. Chị cười, rồi khóc, rồi vẫn sửa file. Ba việc cùng lúc. Chuyên nghiệp.']] },
      { t: 'Đề xuất đợi chị cúp máy rồi hãy ra.', fx: { uy: 1, rel: { diep: 1 } }, then: [['nar', 'Đợi 40 phút. Nến tàn một nửa. Chị Diệp nói đó là chiếc bánh "đúng chất agency" nhất chị từng có.']] },
    ] },
  ] },
  // ---- official-only beats ----
  { id: 'r_off_groups', who: 'obj:desk', obj: 'Về bàn: cả chục nhóm Zalo đang sáng', time: '10:00', official: true, scene: [
    ['nar', 'Số nhóm Zalo của bạn giờ nhiều hơn số ngón tay. Ba nhóm cùng tên "Răng Xinh Tết". Một nhóm có client. Bạn không nhớ nhóm nào.'],
    { c: '_r_off_groups', o: [
      { t: 'Đổi tên tất cả nhóm nội bộ thành "🔒 NỘI BỘ".', fx: { uy: 2, nl: -3 }, then: [['think', 'Mười phút. Cứu được một sự nghiệp. Có thể là của mình.']] },
      { t: 'Tắt thông báo hết, đọc khi rảnh.', fx: { nl: 5, dr: 2 }, then: [['nar', 'Bạn không bao giờ rảnh. Ba tiếng sau, anh Tuấn gọi điện hỏi "em có đọc Zalo không".']] },
    ] },
  ] },
  { id: 'r_off_new_intern', who: 'linh', obj: 'Linh hỏi bạn như hỏi "anh chị"', time: '15:00', official: true, scene: [
    ['linh', 'Bạn… à không, giờ phải gọi là "anh/chị" hả? Mình hỏi: intern như mình có được về trước 18:00 không?'],
    { c: '_r_off_intern', o: [
      { t: '"Được. Về đi. Intern về đúng giờ là quyền."', fx: { rel: { linh: 2 }, nl: -2 }, then: [['think', 'Mình vừa nói câu chị Diệp từng nói. Bằng giọng hơi mệt.']] },
      { t: '"Không. Không ai về trước 18:00 hết."', fx: { rel: { linh: -1 }, dr: 1 }, then: [['think', 'Mình nghe thấy giọng mình. Nó giống giọng một người mình từng sợ.']] },
    ] },
  ] },
];
