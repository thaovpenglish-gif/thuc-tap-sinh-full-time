// Ba & Má — routine beats (ordinary days) and side tasks ("việc vặt").
import { STANDUP_POS, LUNCH_POS } from './episodes.js';

const CARTON_MINI = {
  type: 'pick', title: 'Gói nhầm đơn', icon: '🏷️',
  prompt: 'Khách ăn chay đặt mít sấy. Chọn 2 món được phép bỏ vô thùng.', pick: 2, time: 20, pass: 1,
  items: [
    { text: 'Mít sấy 250g', correct: true },
    { text: 'Khô bò miếng 200g' },
    { text: 'Thiệp "Chúc mẹ rằm an lành"', correct: true },
    { text: 'Khô gà lá chanh (tặng kèm)' },
  ],
};

export const ROUTINE = [
  { id: 'r_hoasen', who: 'hung', obj: 'Ba hỏi: "Con thả tim hình hoa sen chưa?"', time: '08:45', scene: [
    ['hung', 'Sáng nay 5 giờ 47 ba gửi hình hoa sen vô nhóm. Mười hai người thả tim. Nhóm có mười bốn người. Con thả chưa?'],
    { c: '_r_hoasen', o: [
      { t: 'Thả tim, kèm một câu "Con chúc Ba ngày mới an lành".', fx: { rel: { hung: 2 } }, then: [['hung', 'Đó! Có chữ nữa! Người còn lại là Kevin. Nó thả cái "haha".']] },
      { t: '"Dạ lúc 5 giờ 47 con đang ngủ ạ."', fx: { uy: 1, rel: { hung: -1 } }, then: [['hung', 'Ngủ tới 5 giờ 47 hả? Hồi xưa giờ đó ba đã gánh khô ra tới chợ.']] },
    ] },
  ] },
  { id: 'r_hopsang', who: 'son', obj: '"Họp sáng 8:15" ở bảng giữa phòng', time: '09:00', pos: STANDUP_POS, scene: [
    ['son', 'Họp sáng! Time-box mười lăm phút. Hôm qua, Hôm nay, Vướng.'],
    ['hung', 'Hôm qua ba nhớ hồi xưa…'],
    ['nar', 'Ba mươi phút sau, câu chuyện hồi xưa tới đoạn "năm 2008 bão lớn". Anh Sơn dán sticky note "BÃO 2008" vào cột "Đang làm".'],
    { c: '_r_hopsang', o: [
      { t: 'Báo cáo của mình trong 3 câu, đúng format.', fx: { uy: 2, rel: { son: 1, hang: 1 } }, then: [['hang', 'Ba câu. Thấy chưa. Ba câu là đủ. Ba của tụi bây cần học.']] },
      { t: 'Hỏi Ba đoạn "bão 2008" ra sao.', fx: { rel: { hung: 2, son: -1 }, nl: -4 }, then: [['son', '(ghi bảng) Velocity: bão.']] },
    ] },
  ] },
  { id: 'r_maylanh', who: 'hang', obj: 'Má hỏi: "Ai mở máy lạnh?"', time: '10:00', scene: [
    ['hang', 'Ai mở máy lạnh? Trời có ba mươi sáu độ.'],
    ['nar', 'Mọi người cùng nhìn lên trần. Không ai nhận. Mèo Khô Gà nằm ngay dưới cửa gió.'],
    { c: '_r_maylanh', o: [
      { t: '"Dạ con mở, cho khô đỡ ẩm ạ."', fx: { uy: 1, rel: { hang: 1 } }, then: [['hang', 'Cho khô… ừ, khô ẩm là mốc. Mở tới 26 độ thôi.'], ['think', 'Lý do duy nhất Má chấp nhận là lý do có liên quan tới hàng hóa.']] },
      { t: 'Chỉ vào con mèo.', fx: { dr: 2, rel: { khoa: 1 } }, then: [['hang', 'Con mèo mở máy lạnh? …Trừ hao hụt con mèo.'], ['kpi', 'Meo.']] },
    ] },
  ] },
  { id: 'r_inbill', who: 'obj:printer', obj: '10:55 Máy in bill kẹt giấy!', time: '10:55', scene: [
    ['nar', 'Máy in bill kêu "rẹt rẹt", rồi im. Đèn đỏ. Còn năm phút nữa xe lấy hàng tới. Còn 46 bill chưa in.'],
    { c: '_r_inbill', o: [
      { t: 'Mở nắp, gỡ giấy nhẹ tay, in lại.', fx: { nl: -4, uy: 2 }, then: [['nar', 'Máy chạy lại. Bạn in xong bill thứ 46 lúc 10:59. Chú Bảy giơ ngón cái từ cửa.']] },
      { t: 'Gọi anh Khoa.', fx: { rel: { khoa: 1 } }, then: [['khoa', 'Tắt đi bật lại.'], ['nar', 'Được thật. Lúc 11:03. Xe lấy hàng chờ ba phút, tài xế thở dài bốn lần.']] },
    ] },
  ] },
  { id: 'r_giaomy', who: 'mai', obj: 'Chị Mai nhờ trả lời inbox', time: '10:30', scene: [
    ['mai', 'Em rep giùm chị khách này. Lần thứ bảy trong tuần có người hỏi "shop ơi có giao Mỹ không".'],
    { c: '_r_giaomy', o: [
      { t: 'Soạn sẵn một câu trả lời mẫu cho cả team dùng.', fx: { uy: 3, rel: { mai: 2 } }, then: [['mai', 'Câu mẫu! Sao chị không nghĩ ra trong bảy năm? À, vì chị bận kể chuyện.']] },
      { t: '"Dạ shop chưa giao Mỹ, nhưng giao tận nhà người thân của chị ở Việt Nam ạ!"', fx: { uy: 1 }, then: [['khach', 'Ok em, giao cho mẹ chị ở Cần Thơ 5 gói. Mẹ chị gửi qua Mỹ.'], ['think', 'Vậy là có giao Mỹ. Bằng mẹ.']] },
    ] },
  ] },
  { id: 'r_kho_lech', who: 'bay', obj: 'Chú Bảy đếm kho lệch số', time: '11:00', scene: [
    ['bay', 'Chú đếm ra một ngàn không trăm hai mươi gói. Máy báo một ngàn một trăm bốn mươi. Hàng còn mà, để chú coi lại.'],
    { c: '_r_kho_lech', o: [
      { t: 'Đếm lại cùng chú Bảy.', fx: { nl: -6, rel: { bay: 2 } }, then: [['nar', 'Một trăm hai mươi gói bị ghi "nhập" hai lần, cùng ngày, cùng chữ ký: cậu Tám.'], ['bay', 'Chú không nói gì đâu. Con cũng đừng nói chú nói.']] },
      { t: '"Dạ chú coi lại nha chú."', fx: { nl: 2 }, then: [['bay', 'Ừ. Để chú coi lại.'], ['think', 'Chú sẽ không coi lại. Cả hai đều biết.']] },
    ] },
  ] },
  { id: 'r_canhchua', who: 'tu', obj: 'Cô Tư nấu canh chua cá lóc', time: '12:00', pos: LUNCH_POS, scene: [
    ['tu', 'Canh chua cá lóc. Ăn chưa con?'],
    ['nar', 'Cả công ty ngồi một bàn. Ba kể chuyện. Má đếm chén. Kevin chụp hình đăng "family business vibes".'],
    { fx: { nl: 25, rel: { tu: 1 } } },
    { c: '_r_canhchua', o: [
      { t: 'Ăn xong rửa chén giùm cô Tư.', fx: { rel: { tu: 2 }, nl: -3 }, then: [['tu', 'Ngoan. Mai cô múc khúc giữa cho con. Khúc giữa là khúc của người tử tế.']] },
      { t: 'Ngủ trưa trên ghế xếp cạnh bao lá chanh.', fx: { nl: 8 }, then: [['nar', 'Bạn mơ thấy mình là một miếng khô gà, đang được sấy ở 65 độ.']] },
    ] },
  ] },
  { id: 'r_meo', who: 'khoa', obj: 'Anh Khoa: Mèo Khô Gà lại ăn vụng', time: '14:00', scene: [
    ['khoa', 'Mèo Khô Gà ăn hết một gói khô bò. Má sẽ hỏi. Anh không muốn trả lời.'],
    ['kpi', '(liếm mép) Meo.'],
    { c: '_r_meo', o: [
      { t: 'Ghi sổ hao hụt: "1 gói · Mèo".', fx: { uy: 1, rel: { hang: 1 } }, then: [['hang', 'Mèo cũng hao hụt. Ừ. Ghi tên nó vô danh sách. Trừ thức ăn mèo tháng sau.']] },
      { t: 'Giấu vỏ gói, coi như chưa thấy.', fx: { dr: 2, rel: { khoa: 2 } }, then: [['khoa', 'Cảm ơn em. Nó trên đầu anh, nên Má nghĩ là anh.']] },
    ] },
  ] },
  { id: 'r_growth_squad', who: 'tuan', obj: 'Kevin lại đổi tên nhóm chat', time: '09:40', scene: [
    { chat: [['tuan', 'Kevin đã đổi tên nhóm thành "BA & MÁ – Growth Squad 🚀"'], ['hang', 'Má đã đổi tên nhóm thành "BA & MÁ – CHÍNH THỨC 🌸"'], ['tuan', '🥲']] },
    ['tuan', 'Bro, em thấy chưa. Mẹ anh resist change. Tên nhóm cũng là văn hóa.'],
    { c: '_r_growth_squad', o: [
      { t: '"Hay anh tạo nhóm riêng cho team online?"', fx: { uy: 1, rel: { tuan: 1 } }, then: [['tuan', 'Nhóm riêng… anh có rồi. Ba thành viên. Anh, em, và con bot.']] },
      { t: 'Thả tim cả hai tin.', fx: { dr: 1, rel: { tuan: 1, hang: 1 } }, then: [['think', 'Chính sách ngoại giao: thả tim cho mọi phe.']] },
    ] },
  ] },
  { id: 'r_khoahoc', who: 'tuan', obj: 'Kevin gửi link khóa học', time: '15:00', scene: [
    ['tuan', 'Anh vừa mua khóa "Bán hàng TíchTắc từ 0 đồng đến 1 tỷ". Em học với anh. Bốn triệu chín. Anh xin Má refund công ty.'],
    { c: '_r_khoahoc', o: [
      { t: '"Bài một nói gì vậy anh?"', fx: { rel: { tuan: 1 } }, then: [['tuan', 'Bài một: "Hãy livestream mỗi ngày". Bài hai: "Mua khóa nâng cao".'], ['think', 'Đó là đường từ 0 đồng tới âm 1 tỷ.']] },
      { t: '"Dạ em xin học bằng sổ của Má trước."', fx: { uy: 2, rel: { hang: 1, tuan: -1 } }, then: [['tuan', 'You\'re becoming my mom.']] },
    ] },
  ] },
  { id: 'r_voice', who: 'hang', obj: 'Má gửi voice 3 phút', time: '10:20', scene: [
    { chat: [['hang', '🎤 Tin nhắn thoại (3:12) · "Con ơi…"', true]] },
    ['nar', 'Bạn bấm nghe. 3 phút 12 giây. Câu đầu: "Con ơi". Câu cuối: "Mai giao hai thùng cho cô Sáu". Ở giữa là tiếng máy hút chân không.'],
    { c: '_r_voice', o: [
      { t: 'Nghe hết, ghi lại thành checklist.', fx: { uy: 2, rel: { hang: 1 }, nl: -3 }, then: [['hang', 'Con nghe hết hả? Đứa đầu tiên. Kevin nghe 10 giây rồi gửi lại "ok mom".']] },
      { t: 'Hỏi lại chị Mai Má nói gì.', fx: { rel: { mai: 1 } }, then: [['mai', 'Hai thùng cô Sáu. Chị nghe Má nói câu đó mỗi thứ Năm suốt bảy năm.']] },
    ] },
  ] },
  { id: 'r_add_nham', who: 'mai', obj: 'Chị Mai: "Em bị add vô nhóm nào kìa?"', time: '11:30', scene: [
    ['nar', 'Bạn được add vào nhóm "GIA ĐÌNH MÌNH ❤️". Tin mới nhất của Kevin: "Mom, chuyện chia cổ phần mình nói sau Tết nha".'],
    ['nar', 'Ba phút sau, bạn bị kick khỏi nhóm.'],
    ['mai', 'Em đọc được gì? Nói chị. Chị hứa chỉ nói cô Tư.'],
    { c: '_r_add_nham', o: [
      { t: '"Dạ em không đọc kịp gì hết chị."', fx: { uy: 2, rel: { mai: -1, hang: 1 } }, then: [['mai', 'Không đọc kịp? Ba phút mà không đọc kịp? …Em giỏi giữ mồm hơn chị nghĩ.']] },
      { t: 'Kể cho chị Mai.', fx: { dr: 5, rel: { mai: 3 } }, then: [['mai', 'CỔ PHẦN? Trời ơi. Chị biết rồi. Giờ chị phải đi… "chăm sóc khách hàng nội bộ".']] },
    ] },
  ] },
  { id: 'r_live_comment', who: 'mi', obj: 'Út Mi hỏi chuyện hôm bữa live', time: '10:10', when: (r) => r.day > 3, scene: [
    ['mi', 'Hôm bữa live có đứa comment "ủa chị trợ live dễ thương vậy". Ba lần. Cùng một nick.'],
    ['mi', 'Em có quen nick đó hông?'],
    { c: '_r_live_comment', o: [
      { t: '"Dạ không chị. Mà chị là host, người ta mua vì chị mà."', fx: { rel: { mi: 2 } }, then: [['mi', 'Ừ. Đúng. Tất nhiên. …Mai em đứng lệch qua trái thêm mười phân nha.']] },
      { t: '"Nick đó là bạn em ạ. Em xin lỗi."', fx: { dr: 2, rel: { mi: -1 } }, then: [['mi', 'Bạn em? Kêu nó comment "host xinh" giùm chị. Năm lần. Huề.']] },
    ] },
  ] },
  { id: 'r_maysay', who: 'dung', obj: 'Anh Dũng: máy sấy #2 lại kêu', time: '14:30', scene: [
    ['dung', 'Máy sấy số hai kêu như máy cày. Cậu Tám nói "để thằng em cậu sửa". Thằng em cậu sửa ba ngày rồi.'],
    { c: '_r_maysay', o: [
      { t: 'Tìm thợ ngoài, sửa trong chiều.', fx: { uy: 3, rel: { dung: 2, cautam: -2 } }, then: [['nar', 'Thợ tới, thay một con ốc, lấy hai trăm nghìn. Cậu Tám nói "thằng em cậu cũng định thay con ốc đó".']] },
      { t: 'Đề xuất chạy ca đêm bằng máy số một.', fx: { nl: -5, rel: { dung: 1 } }, then: [['dung', 'Được. Mà ai trực ca đêm? …Anh biết câu trả lời rồi.']] },
    ] },
  ] },
  { id: 'r_lachanh', who: 'cautam', obj: 'Cậu Tám nhập lá chanh', time: '09:20', scene: [
    ['cautam', 'Lá chanh về rồi nè. Hơi úng chút. Rửa kỹ là được con.'],
    ['nar', 'Một nửa bao lá chanh đã ngả màu nâu. Mùi không còn là mùi lá chanh.'],
    { c: '_r_lachanh', o: [
      { t: 'Đem một nắm cho cô Tư coi.', fx: { uy: 2, rel: { tu: 1, cautam: -1 } }, then: [['tu', 'Cái này bỏ. Ba mà biết khô ba ướp lá úng là ba buồn ba ngày.']] },
      { t: '"Dạ để con rửa kỹ."', fx: { nl: -6, rel: { cautam: 1 } }, then: [['think', 'Rửa kỹ thì sạch. Nhưng úng thì vẫn úng.']] },
    ] },
  ] },
  { id: 'r_hinhnen', who: 'hung', obj: 'Ba gọi vô phòng "việc gấp"', time: '15:20', scene: [
    ['hung', 'Con vô đây. Việc gấp.'],
    ['hung', 'Cái hình nền điện thoại của ba sao nó thành hình thằng Tuấn? Đổi lại hình hoa sen giùm ba.'],
    { c: '_r_hinhnen', o: [
      { t: 'Đổi, chỉ Ba cách tự đổi.', fx: { rel: { hung: 2 }, nl: -2 }, then: [['hung', 'Bấm giữ… rồi chọn… Ừ. Ba làm được. Ba làm được cái này rồi, mai ba học ghim sản phẩm.']] },
      { t: 'Để hình anh Kevin, khen đẹp.', fx: { rel: { hung: 1, tuan: 2 }, dr: 1 }, then: [['hung', '…Ừ. Thôi để. Nó cũng là con ba.']] },
    ] },
  ] },
  { id: 'r_hoan', who: 'bay', obj: 'Bưu cục gọi: 47 đơn hoàn', time: '13:30', scene: [
    ['bay', 'Bưu cục gọi. Bốn mươi bảy đơn hoàn về. Con ra nhận với chú.'],
    ['nar', 'Bốn mươi bảy gói khô đi một vòng thành phố, về móp méo, có gói dính vết bánh xe.'],
    { c: '_r_hoan', o: [
      { t: 'Phân loại: còn bán được, bán "giá sinh viên", hay hủy.', fx: { uy: 3, rel: { bay: 1, hang: 1 }, nl: -5 }, then: [['hang', 'Có phân loại. Ba loại. Má thích con số có ba loại.']] },
      { t: 'Tìm hiểu vì sao hoàn: 30 đơn cùng một số điện thoại.', fx: { uy: 2, dr: 2 }, then: [['mai', 'Bom hàng. Cùng một người. Chị nhớ cái tên này. Đặt lần nữa chị chặn.']] },
    ] },
  ] },
  { id: 'r_unbox', who: 'mai', obj: 'Khách quay video "thiếu 1 gói"', time: '16:00', scene: [
    ['mai', 'Khách gửi video mở hộp, nói thiếu một gói, đòi hoàn trăm phần trăm. Camera đóng gói hôm đó không quay.'],
    { c: '_r_unbox', o: [
      { t: 'Đối chiếu khối lượng trên vận đơn.', fx: { uy: 3, rel: { mai: 1 } }, then: [['nar', 'Vận đơn ghi 1,02 kg. Đúng bằng đủ 4 gói và cái hộp. Khách đổi giọng: "Ủa để em tìm lại dưới gầm ghế".']] },
      { t: 'Hoàn luôn cho nhanh.', fx: { rel: { hang: -1 } }, then: [['hang', 'Hoàn bao nhiêu? Lần sau con hoàn bằng lương con.'], ['think', 'Khách đó tuần sau lại "thiếu".']] },
      { t: 'Đề xuất quay video đóng gói mọi đơn.', fx: { uy: 2 }, then: [['hang', 'Quay bằng điện thoại cũ hả? Tốn pin. …Ừ, quay. Lấy điện thoại cũ của Kevin.']] },
    ] },
  ] },
  { id: 'r_chay', who: 'mai', obj: 'Khách ăn chay nhận nhầm khô bò', time: '11:10', scene: [
    ['mai', 'Khách đặt mít sấy cho mẹ ăn chay ngày rằm. Nhận được khô bò. Đăng bài "shop vô tâm". Em gói lại đơn bù giùm chị.'],
    { mini: CARTON_MINI,
      good: [['mai', 'Đúng rồi. Có thiệp nữa. Khách đăng bài cảm ơn rồi kìa.'], { fx: { uy: 3, rel: { mai: 1 } } }],
      bad: [['mai', 'Em lại bỏ đồ mặn vô đơn ăn chay hả em ơi…'], { fx: { dr: 3 } }],
    },
  ] },
  { id: 'r_bom', who: 'hang', obj: 'Má: "30 đơn bom, ai duyệt?"', time: '14:20', scene: [
    ['hang', 'Ba chục đơn COD bị bom. Phí ship hai chiều. Ai duyệt? Con duyệt. Trừ vô phụ cấp con.'],
    { c: '_r_bom', o: [
      { t: 'Cho Má coi: hệ thống tự duyệt, đề xuất bắt cọc đơn lớn.', fx: { uy: 3, rel: { hang: 1 } }, then: [['hang', 'Hệ thống tự duyệt? Vậy trừ lương hệ thống. …Cọc. Ừ. Đơn trên năm gói thì cọc.']] },
      { t: 'Nhận, im lặng.', fx: { money: -150_000, nl: -5, rel: { hang: 1 } }, then: [['hang', 'Má trừ một trăm rưỡi thôi. Má thương con.']] },
    ] },
  ] },
  { id: 'r_maimoi', who: 'hang', obj: 'Má xếp chỗ ngồi bữa cơm', time: '11:50', scene: [
    ['hang', 'Trưa nay con ngồi kế Kevin. Hai đứa nói chuyện "data" với nhau cho vui.'],
    ['mi', '(nhỏ) Má đang "mai mối" đó hả ta? 👀'],
    { c: '_r_maimoi', o: [
      { t: 'Cười, ngồi, nói chuyện data thật.', fx: { rel: { hang: 1, tuan: 1 }, dr: 3 }, then: [['tuan', 'So… ROAS của em là bao nhiêu?'], ['think', 'Câu tán tỉnh tệ nhất mình từng nghe. Mà anh ấy không tán.']] },
      { t: '"Dạ Má, con ngồi với chị Mai quen rồi ạ."', fx: { uy: 2, rel: { hang: -1, mai: 1 } }, then: [['hang', 'Ừ… tùy con.'], ['nar', 'Má gắp cho bạn một khúc cá. Khúc đuôi.']] },
    ] },
  ] },
  { id: 'r_retro', who: 'son', obj: 'Anh Sơn tổ chức "Retro xưởng"', time: '16:20', scene: [
    ['son', 'Hôm nay mình làm Retro cho xưởng! Mỗi người viết sticky note: Cái gì tốt, cái gì chưa tốt, cái gì thử.'],
    ['nar', 'Sticky note dính mỡ khô gà, không dán lên bảng được. Các chị thời vụ viết: "Tốt: cơm cô Tư. Chưa tốt: không có tăng ca. Thử: tăng ca."'],
    { c: '_r_retro', o: [
      { t: 'Gom ý kiến thời vụ, đưa anh Dũng.', fx: { uy: 2, rel: { dung: 1, son: 1 } }, then: [['dung', 'Mười lăm năm, lần đầu xưởng được hỏi ý kiến. Bằng sticky note dính mỡ. Cũng được.']] },
      { t: 'Viết: "Thử: họp ngắn hơn".', fx: { dr: 2, rel: { son: -1 } }, then: [['son', 'Ý hay! Mình sẽ họp về việc họp ngắn hơn. Thứ Hai, 8:15.']] },
    ] },
  ] },
  { id: 'r_koc', who: 'tuan', obj: 'Kevin: KOC "ăn sample"', time: '10:40', scene: [
    ['tuan', 'Bạn KOC tám chục nghìn follower nhận ba mươi hộp quà mẫu, hứa ba video. Ba tuần rồi. Im.'],
    ['hang', '(từ phòng) Hàng mẫu đâu? Má hỏi lần thứ mười một.'],
    { c: '_r_koc', o: [
      { t: 'Nhắn đòi lịch sự kèm deadline.', fx: { uy: 1, dr: 2 }, then: [['nar', 'KOC đăng một video. Câu cuối: "khô cũng được, hơi mặn". Má nghe "hơi mặn" và nhớ cả tuần.']] },
      { t: 'Đề xuất quy trình: ký thỏa thuận, gửi mẫu theo đợt.', fx: { uy: 3, rel: { tuan: 1 } }, then: [['tuan', 'Anh sẽ present cái này ở họp tuần. Em không phiền nếu anh present chứ?'], ['think', 'Không phiền. Chỉ hơi… mặn.']] },
    ] },
  ] },
  { id: 'r_hoixua', who: 'hung', obj: 'Ba kể chuyện "hồi xưa" lần thứ 11', time: '15:40', scene: [
    ['hung', 'Hồi xưa ba gánh khô ra chợ, hai thúng, một đòn gánh…'],
    { c: '_r_hoixua', o: [
      { t: 'Nghe tử tế, hỏi thêm một câu.', fx: { rel: { hung: 2 }, nl: -4 }, then: [['hung', 'Con hỏi cái thúng làm bằng gì? Không ai hỏi ba câu đó hết. Tre. Ba tự đan.']] },
      { t: 'Gật gù, mở laptop làm tiếp.', fx: { nl: 2, rel: { hung: -1 } }, then: [['hung', 'Ừ. Tụi trẻ bây giờ bận.'], ['think', 'Ba nói câu đó nhẹ như gió. Mà nghe nặng.']] },
    ] },
  ] },
  { id: 'r_happy', who: 'vy', obj: 'Chị Vy tổ chức "Thứ Sáu Hạnh Phúc"', time: '16:10', when: (r) => (r.day - 1) % 7 === 4, scene: [
    ['vy', '"Happiness Friday" nè em! Hoạt động hôm nay: ăn khô vụn và chia sẻ một điều biết ơn.'],
    ['nar', 'Người tham gia: chị Vy, Mèo Khô Gà, và bạn.'],
    { c: '_r_happy', o: [
      { t: '"Em biết ơn chị vì chị cứ tổ chức dù không ai tới."', fx: { rel: { vy: 3 } }, then: [['vy', '…Em làm chị khóc lần thứ ba trong tuần. Lần này là khóc vui.']] },
      { t: 'Ăn khô vụn, chụp hình cho chị Vy báo cáo.', fx: { nl: 8, rel: { vy: 1 } }, then: [['vy', 'Có hình là có báo cáo. Có báo cáo là có "văn hóa". Cảm ơn em.']] },
    ] },
  ] },
  { id: 'r_hotline', who: 'mai', obj: 'Hotline: một bà cụ gọi', time: '14:50', scene: [
    ['khach', 'Alo con hả? Con dâu cô nó không cho cô ăn khô gà, nói mặn. Cô kể con nghe…'],
    ['nar', 'Hai mươi phút. Con dâu, đứa cháu, con chó, cái nồi cơm điện hư.'],
    { c: '_r_hotline', o: [
      { t: 'Nghe hết, giới thiệu khô gà ít muối cho cô.', fx: { uy: 2, nl: -6 }, then: [['khach', 'Có ít muối hả con? Gửi cô ba gói. Gửi luôn cho con dâu một gói, cho nó biết.']] },
      { t: 'Khéo léo chuyển máy cho chị Mai.', fx: { rel: { mai: -1 } }, then: [['mai', '(che máy) Em chuyển bà Năm cho chị hả? Bà Năm gọi mỗi thứ Ba. Chị né được ba tuần rồi.']] },
    ] },
  ] },
  { id: 'r_wifi_trua', who: 'khoa', obj: 'Wifi tắt giờ trưa (lại)', time: '11:40', scene: [
    ['khoa', 'Má tắt router rồi. Khách đang hỏi đơn hỏa tốc trên sàn. Điện thoại anh còn 3%.'],
    { c: '_r_wifi_trua', o: [
      { t: 'Phát 4G điện thoại mình cho anh Khoa.', fx: { money: -20_000, rel: { khoa: 2 } }, then: [['khoa', 'Em hy sinh data cá nhân cho công ty. Anh sẽ ghi vô báo cáo "Data & AI". Data là của em.']] },
      { t: 'Đề xuất Má: tắt máy lạnh phòng họp thay vì router.', fx: { uy: 2, rel: { hang: 1 } }, then: [['hang', 'Phòng họp không ai họp buổi trưa. Ừ. Tắt cái đó. Con biết tiết kiệm đúng chỗ.']] },
    ] },
  ] },
  { id: 'r_thantai', who: 'obj:altar', obj: 'Ba dặn thắp nhang Thần Tài', time: '08:35', scene: [
    ['nar', 'Bàn thờ Thần Tài: một dĩa khô gà, một dĩa xoài sấy, một tờ giấy chữ to của ai đó dán lên: "TỪ CẤM TRÊN LIVE".'],
    ['hung', '(từ xa) Thắp ba cây nghen con. Không ai được bóc lô hàng mới trước khi ba khai trương.'],
    { c: '_r_thantai', o: [
      { t: 'Thắp nhang, khấn: "Cho con qua review thứ Sáu".', fx: { uy: 1, rel: { hung: 1 } }, then: [['nar', 'Khói nhang bay thẳng. Ba nói vậy là Thần Tài đồng ý. Má nói vậy là quạt tắt.']] },
      { t: 'Thắp nhang, rồi lén ăn một miếng xoài sấy.', fx: { nl: 5, dr: 2 }, then: [['tu', '(từ bếp) Cô thấy nha con.']] },
    ] },
  ] },
  { id: 'r_khovun', who: 'tu', obj: 'Cô Tư gọi ra bếp', time: '15:10', scene: [
    ['tu', 'Con. Lại đây. Bịch khô vụn nè. Khô vụn là khô ngon nhất, tại nó thấm gia vị nhất. Má không biết.'],
    { fx: { nl: 12, rel: { tu: 1 } } },
    { c: '_r_khovun', o: [
      { t: '"Sao cô cho con ạ?"', fx: { rel: { tu: 1 } }, then: [['tu', 'Tại con hay rửa chén. Ở đây cô nhớ ai rửa chén. Má nhớ ai làm bể chén.']] },
      { t: 'Chia cho Ngân một nửa.', fx: { rel: { ngan: 2, tu: 1 } }, then: [['ngan', 'Cho mình hả? …Ngon thật. Mình làm ở đây từ đầu tới giờ chưa ai cho mình cái gì mà không ghi sổ.']] },
    ] },
  ] },
  { id: 'r_ngan_cay', who: 'ngan', obj: 'Ngân ngồi một mình ở bàn', time: '13:10', scene: [
    ['ngan', 'Đừng nhìn. Mình không khóc. Tỏi phi của cô Tư cay mắt thôi.'],
    ['ngan', 'Mẹ mình gọi. Mẹ nói tuần này không làm Má vui thì "khỏi về ăn cơm". Nói đùa thôi. Chắc vậy.'],
    { c: '_r_ngan_cay', o: [
      { t: '"Ngân thật sự muốn làm gì?"', fx: { rel: { ngan: 3 }, set: { asked_ngan: true } }, then: [['ngan', '…Vẽ. Bao bì. Mình muốn cái hộp quà Tết không có con gà khóc.']] },
      { t: 'Ngồi im kế bên, đưa khăn giấy.', fx: { rel: { ngan: 2 } }, then: [['ngan', 'Cảm ơn. Cậu là đối thủ tệ nhất mình từng có.']] },
    ] },
  ] },
  { id: 'r_carton', who: 'bay', obj: 'Hết thùng carton!', time: '14:40', scene: [
    ['bay', 'Hết thùng carton. Nhà in hẹn tuần sau. Đơn thì hôm nay.'],
    { c: '_r_carton', o: [
      { t: 'Qua tạp hóa kế bên xin thùng mì gói.', fx: { nl: -4, rel: { bay: 1 } }, then: [['nar', 'Ba chục đơn khô gà đi trong thùng "Mì tôm chua cay". Một khách đánh giá: "Tưởng mì, hóa ra khô. Bất ngờ, 5 sao."']] },
      { t: 'Dời đơn, nhắn xin lỗi khách.', fx: { uy: -1, dr: 1 }, then: [['mai', 'Dời đơn hả? Khách chửi chị, em nhớ chia nửa với chị.']] },
    ] },
  ] },
  { id: 'r_saurieng', who: 'hung', obj: 'Ba đi hội chợ về có "ý tưởng"', time: '10:50', scene: [
    ['hung', 'Ba đi hội chợ về. Mình ra "khô gà lá chanh sầu riêng"! Đang trend!'],
    ['tuan', '(xa) Hoặc khô gà matcha, Dad. Gen Z thích matcha.'],
    { c: '_r_saurieng', o: [
      { t: 'Đề xuất làm poll cho khách chọn.', fx: { uy: 3, rel: { hung: 1, tuan: 1 } }, then: [['nar', 'Poll 3.000 người. Sầu riêng: 12%. Matcha: 9%. "Khô gà bình thường thôi shop ơi": 79%.'], ['hung', 'Thấy chưa! Công thức của ba!'], ['tuan', '…The data has spoken.']] },
      { t: 'Ủng hộ Ba, thử một mẻ.', fx: { rel: { hung: 2 }, nl: -6 }, then: [['nar', 'Mẻ thử khô gà sầu riêng. Cả xưởng ăn trừ cơm ba ngày. Mèo Khô Gà bỏ nhà đi một buổi.']] },
    ] },
  ] },
  // tie-gated beats
  { id: 'r_tie_khoavy', who: 'khoa', obj: 'Anh Khoa ra hiệu nhỏ tiếng', time: '12:40', when: (r) => !!r.flags.tie_khoa_vy, scene: [
    ['khoa', 'Lại đây. Nhỏ tiếng. Nếu em thấy anh với chị Vy đi ăn trưa chung… đừng nói ai.'],
    ['khoa', 'Má đang định mai mối chị Vy cho con trai bạn Má. Chị Mai mà biết thì cả chợ biết.'],
    { c: '_r_tie_khoavy', o: [
      { t: 'Hứa giữ bí mật.', fx: { rel: { khoa: 2, vy: 2 } }, then: [['khoa', 'Cảm ơn em. Mèo Khô Gà cũng biết. Nhưng nó không nói.']] },
      { t: '"Anh với chị Vy nói thẳng với Má đi anh."', fx: { uy: 1, rel: { khoa: 1 } }, then: [['khoa', 'Nói thẳng với Má? …Em can đảm hơn anh. Để anh tập.']] },
    ] },
  ] },
  { id: 'r_tie_mikoc', who: 'mi', obj: 'Út Mi kéo ra góc ringlight', time: '16:40', when: (r) => !!r.flags.tie_mi_koc, scene: [
    ['mi', 'Em giữ bí mật nha. Chị có offer làm KOC tự do. Không Ba, không Má, không ai hỏi "bao nhiêu đơn".'],
    ['mi', 'Mà chị đi thì ai live? Em hả?'],
    { c: '_r_tie_mikoc', o: [
      { t: '"Chị nên đi nếu chị muốn. Em sẽ không dễ thương hơn chị đâu."', fx: { rel: { mi: 3 } }, then: [['mi', 'Ha. Câu đó chị cho em điểm mười.']] },
      { t: '"Chị nói Ba Má trước, đừng để Ba Má nghe từ người khác."', fx: { uy: 2, rel: { mi: 1, hang: 1 } }, then: [['mi', 'Nghe từ người khác… như chị Mai. Ừ. Chị nói trước.']] },
    ] },
  ] },
  // official-only
  { id: 'r_o_chiakhoa', who: 'bay', official: true, obj: 'Chú Bảy dặn về chìa khóa kho', time: '08:40', scene: [
    ['bay', 'Giờ con giữ chìa kho rồi. Chú dặn: cái gì mất, người đầu tiên bị nghi giờ là con. Chú nghỉ hưu được rồi.'],
    { fx: { rel: { bay: 1 }, dr: 1 } },
    ['think', 'Chú Bảy cười. Lần đầu mình thấy chú cười nhẹ người như vậy.'],
  ] },
  { id: 'r_o_tinnhan', who: 'hang', official: true, obj: 'Má nhắn lúc 22:47 (đọc lúc sáng)', time: '08:50', scene: [
    { chat: [['hang', 'Tối nay bao nhiêu đơn con?', true], ['hang', 'Con ngủ rồi hả?', true], ['hang', 'Người nhà mà ngủ sớm.', true]] },
    ['think', 'Ba tin nhắn. Gửi lúc 22:47, 23:15 và 23:58. Hồi intern, Má nhắn tối là chuyện hiếm. Giờ là lịch.'],
    { c: '_r_o_tinnhan', o: [
      { t: 'Trả lời đầy đủ số đơn, xin phép tắt thông báo sau 22 giờ.', fx: { uy: 2, rel: { hang: -1 } }, then: [['hang', 'Tắt thông báo? Lỡ Má cần thì sao?'], ['think', 'Lỡ mình cần ngủ thì sao?']] },
      { t: 'Trả lời: "Dạ con xin lỗi Má, tối nay con sẽ thức."', fx: { nl: -8, rel: { hang: 1 } }, then: [['think', 'Từ "nhân viên chính thức" đến "trực đêm không lương": một tuần.']] },
    ] },
  ] },
];

export const SIDE_TASKS = [
  { id: 'tem', title: 'In 200 tem date cho anh Dũng', from: 'dung', base: 70, legs: [
    { npc: 'dung', line: ['dung', 'Em in giùm anh 200 tem date lô khô gà sáng nay. Kiểm kỹ cái hạn. Kỹ hơn lần trước.'] },
    { obj: 'printer', line: ['nar', 'Máy in date đòi mật khẩu. Tờ giấy dán: "ngày sinh của Ba". Bạn gõ. Máy chạy. Bạn kiểm hạn hai lần.'] },
    { npc: 'dung', line: ['dung', 'Đúng hạn. Cảm ơn em. Em là người duy nhất kiểm hai lần.'] },
  ] },
  { id: 'bill', title: 'In bill đơn sàn cho chị Mai, giao chú Bảy', from: 'mai', base: 60, legs: [
    { npc: 'mai', line: ['mai', 'Ba mươi đơn hỏa tốc! In bill giùm chị, đưa chú Bảy gom trước 11 giờ nha.'] },
    { obj: 'printer', line: ['nar', 'Máy in bill kẹt ở bill thứ 17. Bạn gỡ giấy, in tiếp. 30 bill, thơm mùi mực.'] },
    { npc: 'bay', line: ['bay', 'Kịp. Xe chưa tới. Con giỏi hơn máy in.'] },
  ] },
  { id: 'thung', title: 'Mang 3 thùng khô bò ra xe chú Bảy', from: 'dung', base: 80, legs: [
    { npc: 'dung', line: ['dung', 'Ba thùng khô bò cho cô Sáu. Em mang ra xe chú Bảy. Nhẹ tay, thùng có chữ "Má đếm rồi".'] },
    { npc: 'bay', line: ['bay', 'Ba thùng hả? Chất lên. Ủa thùng này nhẹ hơn hai thùng kia. …Thôi, Má đếm rồi.'] },
    { npc: 'dung', line: ['dung', 'Xong hả? Ừ. Cảm ơn em.'] },
  ] },
  { id: 'nhang', title: 'Thắp nhang Thần Tài giùm Ba', from: 'hung', base: 50, legs: [
    { npc: 'hung', line: ['hung', 'Con thắp giùm ba ba cây nhang Thần Tài. Ba đang bận… coi lại hình hồi xưa.'] },
    { obj: 'altar', line: ['nar', 'Bạn thắp ba cây nhang. Khói bay thẳng lên tờ giấy "TỪ CẤM TRÊN LIVE".'] },
    { npc: 'hung', line: ['hung', 'Khói bay thẳng hả? Tốt. Tuần này bán được.'] },
  ] },
  { id: 'phieuchi', title: 'Mang phiếu chi của chị Vy qua Má ký', from: 'vy', base: 70, legs: [
    { npc: 'vy', line: ['vy', 'Em cầm phiếu chi mua dầu gió cho xưởng qua Má ký giùm chị. Ba mươi nghìn. Má sẽ hỏi.'] },
    { npc: 'hang', line: ['hang', 'Ba mươi nghìn dầu gió? Tháng trước mua rồi. …Ừ, ký. Xưởng nóng.'] },
    { npc: 'vy', line: ['vy', 'Má ký liền hả? Em có phép thuật gì vậy?'] },
  ] },
  { id: 'tra', title: 'Pha trà cho Ba tiếp đại lý', from: 'hung', base: 50, legs: [
    { npc: 'hung', line: ['hung', 'Chú Năm đại lý tới. Con pha giùm ba ấm trà. Trà, không phải cà phê gói.'] },
    { obj: 'coffee', line: ['nar', 'Bạn pha trà. Cô Tư đứng sau lưng, chỉnh lại lượng trà mà không nói một chữ.'] },
    { npc: 'hung', line: ['hung', 'Trà vừa. Chú Năm khen. Chú Năm khen là lấy thêm hàng.'] },
  ] },
  { id: 'mau', title: 'Xin Má 5 gói mẫu gửi KOC cho Kevin', from: 'tuan', base: 80, legs: [
    { npc: 'tuan', line: ['tuan', 'Em xin Má giùm anh năm gói mẫu cho KOC. Anh xin thì Má hỏi ROAS.'] },
    { npc: 'hang', line: ['hang', 'Năm gói? Ba gói. Ghi tên KOC vô sổ. Không ra video thì Má đòi.'] },
    { npc: 'tuan', line: ['tuan', 'Ba gói? …Okay. Ba gói là "lean".'] },
  ] },
  { id: 'wifi', title: 'Xin Má mở lại wifi cho live test', from: 'khoa', base: 60, legs: [
    { npc: 'khoa', line: ['khoa', 'Live test lúc 12 giờ. Má tắt router. Em đi xin. Anh xin thì Má hỏi tiền điện tháng 3 năm ngoái.'] },
    { npc: 'hang', line: ['hang', 'Một tiếng. Một tiếng thôi. Má đếm.'] },
    { npc: 'khoa', line: ['khoa', 'Được thật hả? Em nói gì với Má vậy? …Thôi đừng nói. Anh không muốn biết.'] },
  ] },
  { id: 'ghim', title: 'Nhờ anh Khoa cài nút ghim giỏ hàng cho Út Mi', from: 'mi', base: 70, legs: [
    { npc: 'mi', line: ['mi', 'Nút ghim giỏ hàng trên máy chị bị đơ. Em kêu anh Khoa coi giùm nha, tối live rồi.'] },
    { npc: 'khoa', line: ['khoa', 'Tắt đi bật lại.'] },
    { npc: 'mi', line: ['mi', 'Được rồi! Em là thiên thần. Thiên thần đứng ngoài khung hình.'] },
  ] },
  { id: 'veso', title: 'Gửi chú Bảy mua vé số cho Ba', from: 'hung', base: 90, legs: [
    { npc: 'hung', line: ['hung', 'Con đưa chú Bảy hai chục, mua giùm ba tờ vé số đuôi 04. Năm ba mở chợ.'] },
    { npc: 'bay', line: ['bay', 'Đuôi 04 hả? Hai mươi năm ba mua đuôi 04. Chưa trúng lần nào. Mà vẫn mua.'] },
    { npc: 'hung', line: ['hung', 'Có rồi hả? Để ba cất. Trúng thì ba lì xì con.'] },
  ] },
  { id: 'lachanh', title: 'Đem rổ lá chanh của cậu Tám ra bếp cô Tư', from: 'cautam', base: 60, legs: [
    { npc: 'cautam', line: ['cautam', 'Rổ lá chanh mới. Đem ra cho cô Tư lựa giùm cậu.'] },
    { npc: 'tu', line: ['tu', 'Lá này được. Lần này được. Nói cậu Tám lần sau cũng vậy.'] },
    { npc: 'cautam', line: ['cautam', 'Cô Tư khen hả? …Ừ. Cậu biết mà.'] },
  ] },
  { id: 'sticky', title: 'Lấy sticky note cho anh Sơn ở chỗ chị Vy', from: 'son', base: 80, legs: [
    { npc: 'son', line: ['son', 'Team ơi, hết sticky note! Đây là impediment. Em lấy giúp anh ở chỗ chị Vy.'] },
    { npc: 'vy', line: ['vy', 'Sticky note hả? Màu vàng hết rồi. Còn màu… dính mỡ khô gà.'] },
    { npc: 'son', line: ['son', 'Dính mỡ? Ok. Mình gọi đây là "Greasy Sprint".'] },
  ] },
  { id: 'inhop', title: 'In bản vẽ hộp quà cho Ngân', from: 'ngan', base: 70, legs: [
    { npc: 'ngan', line: ['ngan', 'Cậu in giùm mình bản vẽ hộp quà. Máy in màu ở chỗ IT. Đừng để Má thấy, Má hỏi tiền mực.'] },
    { obj: 'printer', line: ['nar', 'Máy in ra một cái hộp đỏ, lá chanh vàng. Màu hơi lệch, nhưng vẫn đẹp.'] },
    { npc: 'ngan', line: ['ngan', 'Đẹp hơn trên màn hình. Cảm ơn cậu. Thật.'] },
  ] },
];
