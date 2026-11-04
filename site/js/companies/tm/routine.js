// T&M Partners — routine beats for ordinary days (engine picks 2–3 per day, no repeats until the pool runs out).
// Short: setup → one choice → consequence. Gated beats only appear once the player has seen what they reference.
// One-off beats (a birthday, a backstory, Bảo's new job…) set a seen-flag so the engine never repeats them when the
// fresh pool runs out (it falls back to the whole pool).

const F = (k) => (r) => !!r.flags[k];
const NOT = (k) => (r) => !r.flags[k];
const tie = (id) => { const key = `tie_${id}`; return (r) => !!r.flags[key]; };

export const ROUTINE = [
  { id: 'r_standup', who: 'dat', obj: 'Daily stand-up ở bảng Scrum', time: '09:00', pos: { dat: 'su_dat', an: 'su1', long: 'su2', trang: 'su3', khang: 'su5' }, scene: [
    ['dat', 'Daily stand-up! Time-box mười lăm phút. Yesterday, Today, Blocker. {ten}, mời em.'],
    ['khang', 'Actually, mình nên time-box chặt hơn. Overseas stand-up chỉ bảy phút.'],
    { c: '_r_standup', o: [
      { t: '"Yesterday: deck. Today: deck. Blocker: deck."', fx: { uy: 1, rel: { an: 1 } }, then: [['an', '(thì thầm) Chuẩn. Đời mình là một cái deck.']] },
      { t: 'Báo cáo chi tiết từng đầu việc, kèm số liệu.', fx: { uy: 2, nl: -3, rel: { dat: 1 } }, then: [['dat', 'Love it. Nhưng lần sau ngắn hơn nha. Time-box là văn hóa.']] },
      { t: '"Blocker của em là… stand-up ạ."', fx: { dr: 2, rel: { long: 1, dat: -1 } }, then: [['dat', 'Ok… cái đó mình đưa vào parking lot.'], ['long', 'Parking lot giờ to hơn bãi xe tòa nhà.']] },
    ] },
    ['nar', 'Stand-up mười lăm phút kết thúc sau ba mươi tám phút. Velocity: "tốt".'],
  ] },
  { id: 'r_tuyet_small', who: 'tuyet', obj: 'Chị Tuyết gọi qua "góp vài ý nhỏ"', time: '11:00', scene: [
    ['tuyet', 'Em ơi, chị xem slide của em rồi. Chị chỉ có một vài ý nhỏ thôi.'],
    ['nar', '(Mười một ý. Ý thứ bảy mâu thuẫn với ý thứ hai.)'],
    { c: '_r_tuyet_small', o: [
      { t: 'Hỏi ý nào ưu tiên nhất.', fx: { uy: 2, rel: { tuyet: 1 } }, then: [['tuyet', 'Ý hai. Còn ý bảy là để em suy nghĩ thôi.']] },
      { t: '"Dạ em sửa hết ạ."', fx: { nl: -6 }, then: [['think', 'Mười một ý. Một buổi chiều. Một linh hồn.']] },
      { t: 'Chỉ ra ý hai và ý bảy mâu thuẫn nhau.', fx: { uy: 1, dr: 1 }, then: [['tuyet', '…Em đọc kỹ đấy. Bỏ ý bảy. Đừng kể với ai là chị viết ý bảy.']] },
    ] },
  ] },
  { id: 'r_han_buzz', who: 'han', obj: 'Chị Hân vẫy tay gọi', time: '14:00', scene: [
    ['han', 'Em ơi, mình cần leverage cái synergy của team để disrupt cái mindset cũ nha. Em hiểu không?'],
    { c: '_r_han_buzz', o: [
      { t: '"Dạ, ý chị là cần một kế hoạch cụ thể ạ?"', fx: { uy: 1, rel: { han: -1 } }, then: [['han', 'Cụ thể thì… để tuần sau. Tuần này mình cứ vision đã.']] },
      { t: 'Gật đầu thật sâu.', fx: { dr: 1, rel: { han: 1 } }, then: [['han', 'Em đúng là có growth mindset!']] },
    ] },
  ] },
  { id: 'r_gam_room', who: 'gam', obj: 'Chị Gấm nhờ xem lịch phòng họp', time: '10:30', scene: [
    ['gam', 'Em ơi, phòng họp chiều nay có ai đặt chưa nhỉ? Chị ghi bút chì nên… hơi mờ.'],
    { if: F('gam_calendar'), then: [['think', 'Phòng họp đặt trên lịch online rồi mà. Nhưng chị Gấm vẫn tin sổ "bản sao lưu" hơn.']] },
    ['nar', 'Trong sổ, cùng một khung giờ có ba cái tên. Một trong số đó là "Mèo KPI".'],
    { c: '_r_gam_room', o: [
      { t: 'Gọi từng người hỏi lại, chốt một tên.', fx: { nl: -3, uy: 1, rel: { gam: 1 } }, then: [['gam', 'Ơ, nhanh ghê. Chị xóa hai tên kia nhé. Trừ Mèo KPI, nó là Employee of the Month.']] },
      { t: '"Chị cứ để ai đến trước dùng trước ạ."', fx: { dr: 2 }, then: [['nar', '15:00, ba nhóm cùng đứng trước cửa phòng họp. Mèo KPI đã ở bên trong.']] },
    ] },
  ] },
  { id: 'r_quynh_receipt', who: 'quynh', obj: 'Chị Quỳnh cần hóa đơn gốc', time: '15:00', scene: [
    ['quynh', 'Hóa đơn taxi tuần trước của em đâu? Bản gốc nhé. Ảnh chụp là không được.'],
    { if: F('spilled_bq'), then: [['quynh', 'Bản gốc. Hai bản. Có chữ ký. Em biết vì sao rồi đấy.']] },
    { if: F('quynh_fast'), then: [['quynh', 'À… mà thôi. Ảnh chụp cũng được. Lần này. Đừng kể ai.']] },
    { c: '_r_quynh', o: [
      { t: 'Lục balo tìm hóa đơn.', fx: { nl: -3, rel: { quynh: 1 } }, then: [['nar', 'Bạn tìm thấy nó, kẹp giữa hai tờ giấy nháp ghi "big pitcher".']] },
      { t: '"Em lỡ làm mất rồi ạ."', fx: { money: -85_000, dr: 1 }, then: [['quynh', 'Vậy em tự chịu khoản này nhé. Quy định là quy định.']] },
    ] },
  ] },
  { id: 'r_trang_help', who: 'trang', obj: 'Trang có vẻ lại đang ôm việc', time: '16:00', scene: [
    ['trang', 'Không sao đâu, mình làm kịp mà… chỉ là hôm nay có chín việc thôi.'],
    { if: F('trang_said_no'), then: [['trang', 'À không. Bảy. Mình vừa trả hai việc. Mình đang luyện.']] },
    { c: '_r_trang', o: [
      { t: 'Giúp Trang một việc nhỏ.', fx: { nl: -5, rel: { trang: 2 } }, then: [['trang', 'Cảm ơn bạn. Thật đấy.']] },
      { t: 'Nhắc Trang trả việc về đúng người.', fx: { uy: 1, rel: { trang: 1, long: 1 } }, then: [['long', 'Đúng rồi. Trả tao việc của tao đi.']] },
    ] },
  ] },
  { id: 'r_binh_update', who: 'binh', obj: 'Laptop tự cập nhật, gọi anh Bình', time: '10:00', scene: [
    ['nar', 'Laptop của bạn hiện: "Đang cập nhật 3%. Đừng tắt máy." Còn 20 phút nữa là họp với khách.'],
    ['binh', 'Em restart máy thử chưa?'],
    ['think', 'Nó đang restart. Đó chính là vấn đề.'],
    { c: '_r_binh', o: [
      { t: 'Mượn máy dự phòng của anh Bình.', fx: { rel: { binh: 1 }, nl: -2 }, then: [['binh', 'Máy này đời 2012. Nó chạy được PowerPoint. Nó không chạy được hy vọng.']] },
      { t: 'Ngồi chờ cập nhật.', fx: { clock: 25, dr: 1 }, then: [['nar', 'Cập nhật xong. Thứ duy nhất thay đổi: biểu tượng thùng rác tròn hơn.']] },
    ] },
  ] },
  { id: 'r_long_dict', who: 'long', obj: 'Long cập nhật "từ điển Hân – Việt"', time: '11:30', when: NOT('seen_r_long_dict'), scene: [
    { fx: { set: { seen_r_long_dict: true } } },
    ['long', 'Bản beta 3 của từ điển Hân – Việt. Mày góp một mục đi. Chị Hân sáng nay nói "mình cần ROI cái culture".'],
    { c: '_r_long', o: [
      { t: '"ROI cái culture" = "team building có ảnh đẹp".', fx: { rel: { long: 2 }, dr: 1 }, then: [['long', 'Duyệt. Mục R, trang 4.']] },
      { t: '"ROI cái culture" = "đo xem mọi người có muốn ở lại không".', fx: { uy: 1, rel: { long: 1 } }, then: [['long', 'Mày dịch hay hơn bản gốc. Đó là vấn đề của mọi bản dịch.']] },
      { t: '"Thôi, mình không dám."', fx: { rel: { long: -1 } }, then: [['long', 'Nhát. Nhưng sống lâu.']] },
    ] },
  ] },
  { id: 'r_kpi_keyboard', who: 'obj:desk', obj: 'Về bàn: Mèo KPI đang nằm trên bàn phím', time: '13:30', scene: [
    ['nar', 'Mèo KPI nằm trên bàn phím của bạn. Trong khung chat với chị Tuyết vừa có tin nhắn "jjjjjjjjjjjjj" gửi lúc 13:12.'],
    ['nar', 'Chị Tuyết đã xem. Chị Tuyết đang soạn tin…'],
    { c: '_r_kpi', o: [
      { t: 'Nhắn: "Dạ em xin lỗi, Mèo KPI vừa họp với chị ạ."', fx: { dr: 1, rel: { tuyet: 1 } }, then: [{ chat: [['tuyet', 'Nó viết rõ ý hơn nhiều người.', true]] }] },
      { t: 'Thu hồi tin nhắn, giả vờ không có gì.', fx: { dr: 2 }, then: [{ chat: [['tuyet', 'Chị thấy rồi.', true]] }] },
    ] },
  ] },
  { id: 'r_phuong_poll', who: 'phuong', obj: 'Chị Phương nhờ bỏ phiếu chủ đề team building', time: '10:00', scene: [
    ['phuong', 'Em vote giúp chị chủ đề team building tháng này nha! "Bonding qua thử thách", "Bonding qua nấu ăn", hay "Bonding qua bonding"?'],
    { if: F('culture_fix'), then: [['phuong', 'Chị thêm lựa chọn thứ tư như em gợi ý: "Bonding qua nghỉ ngơi" 🛏️. Đang dẫn đầu.']] },
    { c: '_r_phuong', o: [
      { t: '"Bonding qua nấu ăn" (ít nhất có cái ăn).', fx: { nl: 3, rel: { phuong: 1 } }, then: [['phuong', 'Yay! Em lo phần rửa bát nha.']] },
      { t: 'Viết thêm lựa chọn: "Bonding qua về sớm".', fx: { dr: 1, rel: { phuong: -1, long: 1 } }, then: [['phuong', 'Ơ… chị sẽ coi đó là một… ý tưởng.']] },
    ] },
  ] },
  { id: 'r_ha_paper', who: 'ha', obj: 'Chị Hạ vừa đọc "một paper rất hay"', time: '15:30', scene: [
    ['ha', 'Em ơi, chị vừa đọc một paper về ảnh hưởng của ánh đèn văn phòng lên năng suất. Em có năm phút không?'],
    ['think', 'Năm phút của chị Hạ đo bằng một đơn vị khác.'],
    { c: '_r_ha', o: [
      { t: 'Ngồi nghe.', fx: { nl: -6, rel: { ha: 2 } }, then: [['nar', 'Bốn mươi phút sau, bạn biết rằng đèn trắng làm người ta làm việc nhanh hơn, và đèn văn phòng T&M là màu vàng.']] },
      { t: '"Chị gửi em, tối em đọc ạ."', fx: { rel: { ha: 1 } }, then: [['ha', 'Chị gửi. Kèm ba paper liên quan. Và phụ lục.']] },
    ] },
  ] },
  { id: 'r_khang_linkedin', who: 'khang', obj: 'Khang nhờ "tương tác" bài LinkedIn', time: '11:00', scene: [
    ['khang', 'Em ơi, anh vừa đăng bài "5 bài học từ overseas". Em like với comment giúp anh. Comment gì deep deep ấy.'],
    { c: '_r_khang', o: [
      { t: 'Comment: "Rất insightful anh ạ!"', fx: { rel: { khang: 2 }, dr: 1 }, then: [['khang', 'Thanks! Chị Hân cũng comment y chang. Hai người hiểu anh.']] },
      { t: 'Comment: "Bài học số 6: overseas là Singapore, ba tháng."', fx: { dr: 3, rel: { khang: -2, long: 2 } }, then: [['long', 'Tao chụp màn hình rồi. Lịch sử sẽ ghi nhận.']] },
      { t: 'Thả tim, không comment.', fx: { rel: { khang: 1 } }, then: [['khang', 'Ok. Heart cũng là engagement.']] },
    ] },
  ] },
  { id: 'r_thu_whodoes', who: 'thu', obj: 'Thư nhờ cập nhật file "Ai làm gì"', time: '14:30', scene: [
    ['thu', 'Không phải việc của mình, nhưng mà… file "Ai làm gì" cần cập nhật. Bạn biết ai đang lo chuyện tưới cây kim tiền không?'],
    ['nar', 'Cây kim tiền ở góc phòng đã héo một nửa. Thẻ treo ghi "Phụ trách: (chưa rõ)".'],
    { c: '_r_thu', o: [
      { t: 'Ghi tên mình vào, và tưới luôn.', fx: { uy: 1, nl: -2, rel: { thu: 1 } }, then: [['thu', 'Bạn là người đầu tiên tự ghi tên mình vào file này. Mình hơi xúc động.']] },
      { t: 'Ghi "Mèo KPI".', fx: { dr: 1, rel: { thu: 1 } }, then: [['thu', 'Hợp lý. Nó là Employee of the Month mà.']] },
    ] },
  ] },
  { id: 'r_nhi_seal', who: 'nhi', obj: 'Nhi hỏi chuyện con dấu', time: '10:30', scene: [
    ['nhi', 'Ủa, sao việc xin dấu công văn cũng đến tay mình vậy? Bạn có biết con dấu đang ở chỗ ai không?'],
    { c: '_r_nhi', o: [
      { t: '"Chắc ở chỗ chị Gấm, Hành chính mà."', fx: { uy: 1, rel: { nhi: 1 } }, then: [['nhi', 'Đúng. Trong két, lau bằng khăn mùi soa trước khi đóng. Bạn đoán giỏi ghê.']] },
      { t: '"Hỏi chị Thư đi."', fx: { rel: { nhi: -1, thu: -1 } }, then: [['nhi', 'Chị Thư bảo hỏi bạn. Vòng tròn khép lại.']] },
    ] },
  ] },
  { id: 'r_dat_retro', who: 'dat', obj: 'Anh Đạt mở Retro "Mad · Sad · Glad"', time: '16:00', pos: { dat: 'su_dat', an: 'su1', linh: 'su2' }, scene: [
    ['dat', 'Retro! Mỗi người ba sticky note: Mad, Sad, Glad. Thành thật nha, đây là safe space.'],
    { if: F('dat_kanban'), then: [['dat', 'Tuần này Kanban có WIP limit 3. An xong việc sớm hai ngày. Anh khóc trong toilet một chút.']] },
    { if: F('defended_dat'), then: [['dat', '(nhỏ) Chị Quỳnh kể em nói tốt cho anh. Anh nợ em một sticky note. Màu vàng, loại xịn.']] },
    { c: '_r_dat', o: [
      { t: 'Glad: "Họp ít hơn tuần trước."', fx: { rel: { dat: 2 } }, then: [['dat', 'Đó là note anh muốn đóng khung.']] },
      { t: 'Mad: "Retro dài hơn sprint."', fx: { dr: 2, rel: { an: 1, dat: -1 } }, then: [['dat', 'Ok. Note này mình sẽ… discuss ở Retro sau.']] },
    ] },
  ] },
  { id: 'r_an_minh', who: 'an', obj: 'An nhờ làm phần của Minh', time: '13:30', scene: [
    ['an', 'Minh lại offline, "đang ôn thi". Em làm giúp anh phần biểu đồ của Minh nhé, chỉ 30 phút thôi.'],
    ['think', '"Chỉ 30 phút" ở T&M là đơn vị đo của một buổi chiều.'],
    { c: '_r_an', o: [
      { t: 'Nhận.', fx: { nl: -6, rel: { an: 2 } }, then: [['nar', 'Hai tiếng sau, bạn xong biểu đồ. Minh online lúc 17:59: "Anh chị ơi em làm xong rồi ạ." Hai bản biểu đồ.']] },
      { t: '"Em nhận, nhưng anh ghi rõ trên bảng là việc của Minh chuyển sang em."', fx: { uy: 2, rel: { an: 1 } }, then: [['an', 'Ghi rõ. Em học từ chị Linh à? Đáng sợ đấy.']] },
    ] },
  ] },
  { id: 'r_mai_scope', who: 'mai', obj: 'Chị Mai: khách xin "thêm một slide nhỏ"', time: '15:00', scene: [
    ['mai', 'Êm Ru nhắn: "Thêm giúp chị một slide nhỏ về đối thủ nhé." Em đoán slide nhỏ đó có bao nhiêu trang?'],
    { c: '_r_mai', o: [
      { t: '"Hỏi lại khách: slide đó để quyết định gì ạ?"', fx: { uy: 2, rel: { mai: 1 } }, then: [['mai', 'Họ trả lời: "để sếp đỡ hỏi". Vậy là một slide thật. Em cứu cả team.']] },
      { t: '"Làm luôn cho khách vui ạ."', fx: { nl: -6, rel: { mai: -1 } }, then: [['nar', 'Slide nhỏ thành mười hai slide. Khách xin thêm "một slide nhỏ" về mười hai slide đó.']] },
    ] },
  ] },
  { id: 'r_bao_trick', who: 'bao', obj: 'Anh Bảo dạy một mẹo', time: '11:00', when: NOT('bao_left'), scene: [
    ['bao', 'Ê, mẹo của tao: dán không định dạng là Ctrl+Shift+V. Ba năm tao sống nhờ phím này.'],
    { c: '_r_bao', o: [
      { t: '"Còn mẹo nào nữa không anh?"', fx: { rel: { bao: 2 } }, then: [['bao', 'Có. Đừng bao giờ là người cuối cùng rời phòng họp. Người cuối cùng phải viết biên bản.']] },
      { t: 'Dạy lại anh Bảo một phím tắt.', fx: { uy: 1, rel: { bao: 1 } }, then: [['bao', '…Ba năm. Tao chưa từng biết cái này. Mày làm tao thấy mình già.']] },
    ] },
  ] },
  { id: 'r_lift_tuyet', who: 'tuyet', obj: 'Đi chung thang máy với chị Tuyết', time: '08:45', pos: { tuyet: 'reception_side' }, scene: [
    ['nar', 'Cửa thang máy đóng. Chỉ có bạn và chị Tuyết. Chín tầng.'],
    ['tuyet', 'Em đang làm gì? Ưu tiên của em hôm nay là gì?'],
    { c: '_r_lift', o: [
      { t: 'Nói một câu: việc chính, hạn, rủi ro.', fx: { uy: 2, rel: { tuyet: 1 } }, then: [['tuyet', 'Tốt. Nhiều người dùng chín tầng để nói "dạ em đang làm ạ".']] },
      { t: '"Dạ em đang làm ạ."', fx: { dr: 1 }, then: [['nar', 'Tầng năm. Tầng sáu. Không ai nói gì thêm. Tầng chín dài nhất cuộc đời.']] },
    ] },
  ] },
  { id: 'r_printer_khang', who: 'obj:printer', obj: 'Máy in đang in… 200 trang màu', time: '14:30', scene: [
    ['nar', 'Máy in đang in trang 87/200, màu, khổ A4: "OVERSEAS INSIGHTS · Khang". Bạn cần in đúng một tờ.'],
    { c: '_r_printer', o: [
      { t: 'Bấm tạm dừng, in tờ của mình, rồi cho chạy tiếp.', fx: { uy: 1, dr: 1 }, then: [['khang', '(từ xa) Ai pause máy in vậy? Overseas người ta có máy in riêng cho mỗi team.']] },
      { t: 'Đứng chờ.', fx: { clock: 20 }, then: [['nar', 'Hai mươi phút. Bạn đã đọc hết năm bài học từ overseas. Bài học số 3: "Kiên nhẫn".']] },
    ] },
  ] },
  { id: 'r_altar', who: 'obj:altar', obj: 'Chị Gấm nhờ thay hoa quả bàn thờ Thần Tài', time: '09:30', scene: [
    ['nar', 'Bàn thờ Thần Tài có một nải chuối, một gói sticky note màu hồng, và một tờ lịch "Hạn nộp hồ sơ thầu".'],
    { c: '_r_altar', o: [
      { t: 'Thay nải chuối mới, giữ gói sticky note.', fx: { money: -20_000, uy: 1, rel: { gam: 1 } }, then: [['gam', 'Em tinh ý ghê. Gói sticky note là của anh Đạt. Anh ấy cầu velocity.']] },
      { t: 'Thắp nén hương xin "deck qua vòng một".', fx: { nl: 2, dr: -1 }, then: [['nar', 'Khói hương bay thẳng lên. Bạn quyết định coi đó là dấu hiệu tốt.']] },
    ] },
  ] },
  { id: 'r_okr', who: 'obj:okr', obj: 'Đọc bảng OKR trong góc', time: '10:00', scene: [
    ['nar', 'Bảng OKR quý: "O1: Excellence. KR1: Eventually." Bên dưới có ai viết thêm bằng bút đỏ: "KR2: Về trước 19h (1 lần/tuần)".'],
    { c: '_r_okr', o: [
      { t: 'Ký tên ủng hộ KR2.', fx: { dr: 1, rel: { long: 1, an: 1 } }, then: [['nar', 'Có bảy chữ ký. Một chữ ký là hình con mèo.']] },
      { t: 'Xóa KR2 trước khi chị Tuyết thấy.', fx: { uy: 1, rel: { long: -1 } }, then: [['long', '(từ xa) Ai xóa KR2 của tao?']] },
    ] },
  ] },
  { id: 'r_birthday', who: 'phuong', obj: 'Chị Phương thu tiền mừng sinh nhật', time: '15:00', when: NOT('seen_r_birthday'), scene: [
    { fx: { set: { seen_r_birthday: true } } },
    ['phuong', 'Em ơi, sinh nhật chị Tuyết tuần sau, mỗi người góp 200 nghìn mua quà nha. Bí mật nhé!'],
    ['nar', 'Group "Sinh nhật chị Tuyết (bí mật)" có 19 thành viên. Một trong số đó là chị Tuyết.'],
    { c: '_r_bday', o: [
      { t: 'Góp 200 nghìn.', fx: { money: -200_000, rel: { phuong: 1, tuyet: 1 } }, then: [['phuong', 'Cảm ơn em! Quà là một cuốn sổ ghi "Ý nhỏ". Bìa da.']] },
      { t: '"Chị ơi, chị Tuyết có trong group đó ạ."', fx: { uy: 1, dr: 1 }, then: [['phuong', 'Ôi trời. Ba năm nay… Thôi, coi như năm nào chị ấy cũng giả vờ bất ngờ.']] },
    ] },
  ] },
  { id: 'r_linh_pantry', who: 'linh', obj: 'Chị Linh đứng một mình ở pantry', time: '16:30', pos: { linh: 'pantry' }, when: NOT('seen_r_linh_pantry'), scene: [
    { fx: { set: { seen_r_linh_pantry: true } } },
    ['linh', 'Em biết không, chị từng là intern ở đây. Mười năm trước. Hồi đó T&M có năm người, ai cũng làm mọi việc.'],
    ['linh', 'Giờ có hai mươi người, và ai cũng làm mọi việc. Tiến bộ ghê.'],
    { c: '_r_linh', o: [
      { t: '"Sao chị ở lại lâu vậy ạ?"', fx: { rel: { linh: 2 } }, then: [
        ['linh', 'Vì chị Tuyết từng đứng ra nhận lỗi thay chị trước khách. Một lần. Người ta ở lại mười năm vì một lần như vậy.'],
        { if: F('took_blame'), then: [['linh', 'Như em hôm khách Êm Ru đến sớm. Em nhận một lỗi không phải của em. Chị nhớ.']] },
      ] },
      { t: 'Pha cho chị Linh ly trà.', fx: { nl: -1, rel: { linh: 1 } }, then: [['linh', 'Cảm ơn em. Trà là thứ duy nhất ở đây không có deadline.']] },
    ] },
  ] },
  { id: 'r_han_minutes', who: 'han', obj: 'Chị Hân nhờ viết biên bản cuộc họp vừa rồi', time: '11:30', scene: [
    ['han', 'Em viết biên bản cuộc họp sáng nay giúp chị nha. Chị nói gì em ghi nấy.'],
    ['nar', 'Ghi âm cuộc họp: 42 phút. Danh từ cụ thể: 3. Từ "synergy": 17.'],
    { c: '_r_han_min', o: [
      { t: 'Ghi 3 quyết định thật, bỏ phần còn lại.', fx: { uy: 2, rel: { han: -1 } }, then: [['han', 'Biên bản ngắn quá… nhưng đúng là chỉ có ba việc thật. Hmm.']] },
      { t: 'Ghi đủ 17 chữ synergy.', fx: { nl: -4, rel: { han: 2 } }, then: [['han', 'Perfect! Đọc lên nghe rất có năng lượng.']] },
    ] },
  ] },
  { id: 'r_quynh_pc', who: 'quynh', obj: 'Máy chị Quỳnh lại treo', time: '09:30', scene: [
    ['quynh', 'Máy chị lại treo. Em gọi Bình giúp chị.'],
    { if: tie('binh_quynh'), then: [['nar', 'Bạn chưa kịp gọi. Anh Bình đã đứng sau lưng chị Quỳnh, cầm sẵn một ly trà nóng.']],
      else: [['nar', 'Bạn chưa kịp gọi. Anh Bình đã đứng sau lưng chị Quỳnh. Máy kế toán luôn là ưu tiên số một.']] },
    { c: '_r_qpc', o: [
      { t: 'Hỏi anh Bình sao biết nhanh vậy.', fx: { dr: 1, rel: { binh: -1 } }, then: [['binh', 'Linh cảm IT. Em restart thử câu hỏi đó chưa?']] },
      { t: 'Lặng lẽ quay về bàn.', fx: { rel: { quynh: 1, binh: 1 } }, then: [['think', 'Có những thứ không cần hỏi.']] },
    ] },
  ] },
  { id: 'r_tuyet_late', who: 'tuyet', obj: 'Chị Tuyết hỏi chuyện tin nhắn tối qua', time: '09:15', when: (r) => r.flags.last_life !== 'tm_tuyet_2347', scene: [
    ['tuyet', 'Tối qua 23:47 chị nhắn em "Em ngủ chưa?". Sao em không trả lời?'],
    { c: '_r_late', o: [
      { t: '"Dạ, em ngủ rồi ạ."', fx: { uy: 1, nl: 3 }, then: [['tuyet', 'Tốt. Chị cũng nên ngủ. Chị chỉ hỏi để chắc là có người đang ngủ.']] },
      { t: '"Em thấy, nhưng em sợ trả lời thì phải làm việc ạ."', fx: { dr: 2, rel: { tuyet: 1 } }, then: [['tuyet', '…Thành thật. Chị ghi nhận. Lần sau chị nhắn lúc 22:59.']] },
    ] },
  ] },
  { id: 'r_trang_cake', who: 'trang', obj: 'Trang mang bánh tới bàn bạn', time: '14:00', scene: [
    ['trang', 'Bạn ăn bánh không? Mình mua dư. Mà… bạn xem giúp mình slide này có ổn không? Không ổn cũng được, mình sửa.'],
    { c: '_r_cake', o: [
      { t: 'Góp ý thật, có cả điểm tốt.', fx: { uy: 1, rel: { trang: 2 } }, then: [['trang', 'Có điểm tốt hả? Mình… chưa ai nói câu đó trước khi nói điểm xấu.']] },
      { t: '"Ổn hết rồi!" và ăn bánh.', fx: { nl: 6, rel: { trang: 1 } }, then: [['trang', 'Thật hả? Vậy mình sửa thêm cho chắc.']] },
    ] },
  ] },
  { id: 'r_bao_postcard', who: 'bao', obj: 'Anh Bảo kể chuyện buổi phỏng vấn mới', time: '17:00', when: (r) => !!r.flags.bao_left && !r.flags.seen_r_bao_postcard, scene: [
    { fx: { set: { seen_r_bao_postcard: true } } },
    ['bao', 'Tao đi phỏng vấn chỗ mới về. Họ hỏi "anh thực tập ba năm để làm gì?". Tao nói "để biết mình không muốn chờ nữa".'],
    { c: '_r_bao_new', o: [
      { t: '"Họ nhận anh chưa?"', fx: { rel: { bao: 1 } }, then: [['bao', 'Nhận. Hợp đồng ký ngay buổi đầu. Tao đọc ba lần vì tưởng có lỗi.']] },
      { t: 'Hỏi anh Bảo có muốn lấy lại sổ tay không.', fx: { rel: { bao: 2 } }, then: [['bao', 'Giữ đi. Ở chỗ mới, máy in không cần mật khẩu. Tao thấy hơi trống trải.']] },
    ] },
  ] },
  { id: 'r_mai_handover', who: 'mai', obj: 'Chị Mai bàn giao một khách khó', time: '10:30', when: F('mai_handover'), scene: [
    ['mai', 'Bàn giao bài số 7: anh trưởng phòng Êm Ru hay nhắn lúc 22 giờ. Em không cần trả lời ngay. Em cần trả lời đúng.'],
    { c: '_r_mai_ho', o: [
      { t: 'Ghi chép lại từng chữ.', fx: { uy: 1, rel: { mai: 1 } }, then: [['mai', 'Đừng chép chữ. Chép lý do. Chữ thì khách đổi, lý do thì không.']] },
      { t: '"Nếu anh ấy nhắn lúc 23:47 thì sao chị?"', fx: { dr: 1, rel: { mai: 1 } }, then: [['mai', 'Thì đó không phải khách. Đó là chị Tuyết. Quy tắc khác.']] },
    ] },
  ] },
  { id: 'r_off_mgmt', who: 'tuyet', obj: 'Họp "Management sync" (bạn là thư ký)', time: '09:30', official: true, pos: { tuyet: 'mr_head', han: 'mr_n1', linh: 'mr_n2' }, scene: [
    ['nar', 'Lần đầu bạn được mời họp ban điều hành. Lý do: cần người ghi biên bản.'],
    ['han', 'Mình cần một initiative thật bold cho Q1.'],
    ['linh', 'Initiative bold nhất là đủ người.'],
    { c: '_r_off_mgmt', o: [
      { t: 'Ghi đúng cả hai câu.', fx: { uy: 1, rel: { linh: 1, han: -1 } }, then: [['tuyet', 'Biên bản trung thực. Hơi nguy hiểm. Chị duyệt.']] },
      { t: 'Ghi: "Thống nhất cần initiative bold và đủ người."', fx: { uy: 2, rel: { tuyet: 1 } }, then: [['tuyet', 'Em vừa biến một cuộc cãi nhau thành một kết luận. Đó là nghề của mình.']] },
    ] },
  ] },
  { id: 'r_off_newintern', who: 'obj:desk', obj: 'Bạn intern mới ngồi chờ ở bàn bạn', time: '10:30', official: true, scene: [
    ['nar', 'Bạn intern mới đứng cạnh bàn, ôm laptop đời 2015: "Anh/chị ơi, bản FINAL nào là bản thật ạ?"'],
    ['think', 'Vòng tròn khép lại.'],
    { c: '_r_off_intern', o: [
      { t: 'Ngồi xuống chỉ cách xem "sửa lần cuối bởi ai".', fx: { nl: -4, uy: 1, rel: { long: 1 } }, then: [['long', '(đi ngang) Truyền thống được truyền lại. Tao xúc động.']] },
      { t: '"Em hỏi Long nhé, anh ấy có bài giảng."', fx: { rel: { long: -1 } }, then: [['long', 'Mày giao việc cho tao. Mày thành chính thức thật rồi.']] },
    ] },
  ] },
];
