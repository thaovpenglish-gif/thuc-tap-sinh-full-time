// Người Đúng Chỗ HR — routine beats (ordinary days) and side tasks ("việc vặt").
import { STANDUP_POS, ONBOARD_MINI } from './episodes.js';

const DUP_MINI = {
  type: 'order', title: 'Đụng ứng viên: ai gửi trước?', icon: '⏱️',
  prompt: 'Xếp các email theo đúng thứ tự thời gian để chứng minh với khách.', time: 25, pass: 0.6,
  items: [
    { text: '10:42 · Săn Đầu Pro gửi CV cùng ứng viên', order: 2 },
    { text: '09:15 · Ứng viên đồng ý cho bên mình giới thiệu (email)', order: 0 },
    { text: '14:00 · Khách hỏi: "Hai bên gửi cùng một người à?"', order: 3 },
    { text: '09:58 · Bên mình gửi CV cho khách, có tệp đính kèm', order: 1 },
  ],
};

const TRANSLATE_MINI = {
  type: 'quiz', title: 'Dịch JD sang tiếng Anh trong 30 phút', icon: '🌐',
  prompt: 'Khách nước ngoài cần JD trước 11 giờ. Chọn bản dịch đúng.', time: 30, pass: 0.66,
  questions: [
    { q: '"Lương thỏa thuận"', options: ['Negotiable salary', 'Salary agreement (signed)', 'Free salary'], correct: 0 },
    { q: '"Chịu được áp lực cao"', options: ['Able to work under pressure', 'High pressure resistant (like a pipe)', 'Stress lover'], correct: 0 },
    { q: '"Ưu tiên ứng viên có kinh nghiệm"', options: ['Experience preferred', 'Experience priority lane', 'Old people first'], correct: 0 },
  ],
};

export const ROUTINE = [
  { id: 'r_kpi_monday', who: 'duy', obj: 'Họp KPI: đọc to số CV', time: '08:45', pos: STANDUP_POS, scene: [
    ['duy', 'Quote hôm nay: "Đừng đếm ngày, hãy làm cho ngày đáng đếm." Giờ đếm CV! {ten}?'],
    { c: '_r_kpi', o: [
      { t: 'Báo số CV thật, kèm số người được mời phỏng vấn.', fx: { uy: 2, rel: { ngan: 1 } }, then: [['duy', 'Ít CV mà nhiều người vào vòng. Anh ghi nhận. Bằng bút chì.']] },
      { t: 'Làm tròn lên "khoảng bốn mươi".', fx: { dr: 2, rel: { duy: 1 } }, then: [['vy', '(nhỏ) "Khoảng" là đơn vị đo KPI chính thức của công ty rồi.']] },
    ] },
    ['nar', 'Họp KPI mười lăm phút kéo dài bốn mươi phút. Ba mươi phút trong đó là quote.'],
  ] },
  { id: 'r_inmail_7m', once: true, who: 'vy', obj: 'Vy gọi bạn xem một tin nhắn lạ', scene: [
    ['vy', 'Xem này! Một ứng viên trả lời InMail mình gửi bảy tháng trước: "Dạ bây giờ em mới đọc. Job còn không ạ?"'],
    ['vy', 'Job đó tuyển xong từ tháng Năm. Người được tuyển nghỉ tháng Tám. Nên… job còn thật.'],
    { c: '_r_inmail', o: [
      { t: 'Gợi ý Vy gọi lại ngay.', fx: { uy: 1, rel: { vy: 1 } }, then: [['vy', 'Bảy tháng sau mới trả lời, mà lại vừa khớp. Nghề này là nghề của thời điểm.']] },
      { t: 'Đùa: "Nhanh hơn khách mình trả phí."', fx: { dr: 1, rel: { vy: 2 } }, then: [['vy', 'Câu này mình in ra dán bàn chị Thảo.']] },
    ] },
  ] },
  { id: 'r_gross_net', who: 'call:ungvien', obj: 'Ứng viên gọi hỏi lương (Teams)', call: { title: 'Ứng viên · "Gross hay net ạ?"', people: ['ungvien', 'me'] }, scene: [
    ['ungvien', 'Dạ em hỏi lại chút: mức hai mươi triệu là gross hay net ạ?'],
    ['think', 'Lần thứ ba trong tuần. Cùng một người.'],
    { c: '_r_gross', o: [
      { t: 'Giải thích kỹ: gross trừ bảo hiểm khoảng 10,5% rồi mới ra net, gửi kèm ví dụ.', fx: { uy: 2, nl: -2 }, then: [['ungvien', 'À, giờ em mới hiểu thật. Hai lần trước em gật cho có.']] },
      { t: '"Dạ net ạ." (cho nhanh)', fx: { dr: 3 }, then: [['nar', 'Một tuần sau, ứng viên nhận phiếu lương và gọi lại. Lần này không hỏi. Lần này hét.']] },
    ] },
  ] },
  { id: 'r_cv_pdf', who: 'phat', when: (s) => !s.flags.phat_left, obj: 'Phát cần giúp đổi tên file CV', scene: [
    ['phat', 'Mười hai file. Tất cả tên "CV.pdf". Một file "CV (1).pdf". Một file "CV_final_final.pdf".'],
    ['phat', 'ATS của mình không phân biệt được. Mình cũng không.'],
    { c: '_r_cvpdf', o: [
      { t: 'Đề xuất quy tắc đặt tên: Họ tên_Vị trí_Ngày.', fx: { uy: 2, rel: { phat: 1 } }, then: [['phat', 'Quy tắc! Công ty có quy tắc! Mình ghi vào trang 3 file "Sống sót" của Vy.']] },
      { t: 'Ngồi đổi tên tay cả mười hai file.', fx: { nl: -4, rel: { phat: 2 } }, then: [['nar', 'File thứ chín là CV của một người tên… Phát. Không phải Phát này. Chắc vậy.']] },
    ] },
  ] },
  { id: 'r_cv_wedding', who: 'quan', obj: 'Quân hỏi về một CV 9 trang', scene: [
    ['quan', 'CV này chín trang. Trang một là ảnh cưới. Trang bốn là ảnh con. Kinh nghiệm ở trang bảy.'],
    ['quan', 'Mình gửi khách luôn nhé? Ảnh đẹp mà.'],
    { c: '_r_wedding', o: [
      { t: 'Gợi ý chuyển sang mẫu một trang, bỏ ảnh riêng tư, giữ kinh nghiệm.', fx: { uy: 2, rel: { quan: 1 } }, then: [['quan', 'Một trang. Ừ. Khách đọc được tới phần kinh nghiệm thật.']] },
      { t: '"Gửi đi, cho khách thấy ứng viên hạnh phúc."', fx: { dr: 2, rel: { quan: 1 } }, then: [['nar', 'Khách trả lời: "Ảnh đẹp. Nhưng anh ấy làm được gì?"']] },
    ] },
  ] },
  { id: 'r_banhmi', once: true, who: 'call:banhmi', obj: 'Gọi ứng viên (hình như nhầm số)', call: { title: 'Cuộc gọi ra · số trong ATS', people: ['banhmi', 'me'] }, scene: [
    ['banhmi', 'Alo, bánh mì đầu hẻm 42 nghe. Ai đó?'],
    ['me', 'Dạ… em gọi cho anh Hưng, ứng viên Kế toán ạ.'],
    ['banhmi', 'Hưng là thằng con cô! Nó đi Bình Dương rồi. Mà con ơi, công ty con có tuyển công nhân không? Cháu cô đang tìm việc.'],
    { c: '_r_banhmi', o: [
      { t: 'Ghi số cháu cô, chuyển cho Vy bên RPO.', fx: { uy: 1, rel: { vy: 1 }, set: { banhmi_lead: true } }, then: [['banhmi', 'Ui con dễ thương quá. Mai ghé cô, cô cho ổ bánh mì đặc biệt.']] },
      { t: 'Xin lỗi vì gọi nhầm, cúp máy.', fx: { nl: 1 }, then: [['nar', 'ATS dòng 9.412: "Hưng – Kế toán – SĐT: tiệm bánh mì". Bạn sửa lại. Một dòng trong mười bốn nghìn.']] },
    ] },
  ] },
  { id: 'r_wrong_building', who: 'thao', obj: 'Chị Thảo gọi: ứng viên đi lạc', time: '10:00', scene: [
    ['thao', 'Em ơi, ứng viên phỏng vấn lúc 10 giờ đang đứng ở… tòa nhà đối diện. Bên đó cũng có công ty tên "Đúng Người".'],
    ['thao', 'Họ mời anh ấy vào phỏng vấn luôn rồi.'],
    { c: '_r_building', o: [
      { t: 'Gọi video dẫn đường cho ứng viên.', fx: { nl: -3, uy: 1 }, then: [['nar', 'Ứng viên đến lúc 10:25, cầm theo một offer của tòa đối diện. Lương cao hơn.']] },
      { t: 'Gửi định vị kèm ảnh cửa vào.', fx: { uy: 2 }, then: [['thao', 'Ảnh cửa vào hả? Thông minh. Lần sau chị gửi kèm email mời luôn.']] },
    ] },
  ] },
  { id: 'r_disc', who: 'khoa', obj: 'Anh Khoa muốn "đọc vị" bạn', scene: [
    ['khoa', 'Làm nhanh bài DISC mười câu nhé! Câu một: em thích làm việc một mình hay theo nhóm?'],
    ['khoa', '…Xong! Em là S. Anh Duy lại bảo em thiếu chữ D. D là… à anh quên rồi.'],
    { c: '_r_disc', o: [
      { t: '"Test tính cách để hiểu nhau thì hay, đừng dùng để xếp lương là được ạ."', fx: { uy: 2, rel: { khoa: 1 } }, then: [['khoa', 'Câu này anh đưa vào slide đào tạo. Ghi nguồn: intern.']] },
      { t: 'Tự nhận mình là "D" cho vui.', fx: { dr: 1, rel: { khoa: 1, duy: 1 } }, then: [['duy', '(vọng ra) Anh biết mà! D!']] },
    ] },
  ] },
  { id: 'r_cake', who: 'tuan', obj: 'Anh Tuấn có hộp bánh ở pantry', scene: [
    ['tuan', 'Ứng viên gửi bánh cảm ơn! Hộp hai mươi cái. Cả phòng ăn hết trong ba phút. Còn một cái.'],
    { if: (s) => !!s.flags.tie_tuan_thao, then: [['tuan', 'Cái này… để dành cho chị Thảo. Đừng hỏi. Không có gì đâu. Không có gì thật.']] },
    { c: '_r_cake', o: [
      { t: 'Mang cái cuối cùng cho chị Thảo.', fx: { rel: { thao: 2, tuan: 1 } }, then: [['thao', 'Cho chị à? Ở đây ai cũng quên lễ tân. Lễ tân kiêm kế toán thì càng quên.']] },
      { t: 'Ăn luôn.', fx: { nl: 10 }, then: [['tuan', 'Ăn đi. Retention bắt đầu từ cái bụng.']] },
    ] },
  ] },
  { id: 'r_ats_sort', who: 'phat', when: (s) => !s.flags.phat_left, obj: 'Phát hoảng loạn: ATS', scene: [
    ['phat', 'Có ai vừa sort cột "Tên" không?! Giờ anh Nguyễn Văn A có số điện thoại của chị Trần Thị B!'],
    { c: '_r_sort', o: [
      { t: 'Mở lịch sử phiên bản, khôi phục về 9:59.', fx: { uy: 3, rel: { phat: 2 } }, then: [['phat', 'Bạn… bạn biết "lịch sử phiên bản"? Bạn là IT thật. Mình chỉ là IT danh dự.']] },
      { t: 'Lùi xa khỏi máy tính.', fx: { dr: 1 }, then: [['nar', 'Mười phút sau Vy khôi phục được. Cả phòng thở ra cùng lúc như vừa qua động đất.']] },
    ] },
  ] },
  { id: 'r_own_cv', once: true, who: 'obj:desk', obj: 'Về bàn: tìm ứng viên trong ATS', scene: [
    ['nar', 'Bạn tìm "sinh viên năm cuối" trong ATS. Dòng 3.208 là… CV của chính bạn. Hai năm trước.'],
    ['nar', 'Ghi chú của consultant cũ: "Ứng viên ổn, hơi ít máu lửa. Không phù hợp."'],
    { c: '_r_owncv', o: [
      { t: 'Cập nhật dòng đó: "Đã tuyển. Hiện là người đọc dòng này."', fx: { uy: 1, nl: 2 }, then: [['think', 'Mình vừa đóng một vòng tuyển dụng hai năm.']] },
      { t: 'Gửi ảnh chụp cho Vy.', fx: { dr: 1, rel: { vy: 2 } }, then: [['vy', 'HAHAHA. Dòng của mình là 1.104: "Nói nhiều, có thể làm sales". Họ đúng.']] },
    ] },
  ] },
  { id: 'r_remote50', who: 'bach', obj: 'Bách chuyển một yêu cầu của ứng viên', scene: [
    ['bach', 'Ứng viên muốn: remote một trăm phần trăm, năm mươi triệu, không họp. Khách muốn: lên văn phòng sáu ngày, hai mươi lăm triệu, họp mỗi sáng.'],
    ['bach', 'Anh nghĩ mình gặp nhau ở giữa được. Chắc kèo.'],
    { c: '_r_remote', o: [
      { t: 'Đề xuất bàn cụ thể: hybrid, lương theo khảo sát của chị My, họp hai buổi.', fx: { uy: 2, rel: { my: 1, bach: 1 } }, then: [['bach', 'Có số liệu là khác hẳn. Khách bảo "để chị xem". Ứng viên bảo "để em xem". Tiến bộ.']] },
      { t: '"Ở giữa là ba mươi bảy triệu rưỡi, ba ngày rưỡi, nửa cuộc họp ạ."', fx: { dr: 2, rel: { bach: 2 } }, then: [['bach', 'Ha! Nửa cuộc họp. Anh sẽ đề xuất thật.']] },
    ] },
  ] },
  { id: 'r_sat7am', who: 'bach', obj: 'Bách: khách muốn phỏng vấn 7 giờ sáng thứ Bảy', scene: [
    ['bach', 'Khách muốn phỏng vấn ứng viên lúc bảy giờ sáng thứ Bảy. Em sắp lịch giúp anh, rồi em đi cùng nhé.'],
    { c: '_r_sat', o: [
      { t: 'Đề xuất khách khung chiều thứ Sáu hoặc phỏng vấn online buổi tối.', fx: { uy: 2, rel: { bach: -1 } }, then: [['bach', 'Khách đồng ý tối thứ Năm online. Ứng viên cảm ơn rối rít. Anh thì mất cái cớ đi cà phê sáng thứ Bảy.']] },
      { t: 'Nhận, sắp lịch, đi cùng.', fx: { nl: -6, rel: { bach: 2 } }, then: [['nar', 'Thứ Bảy 7:00. Ứng viên đến. Khách đến lúc 8:40, cầm bánh mì. "Kẹt xe."']] },
    ] },
  ] },
  { id: 'r_duplicate', who: 'vy', obj: 'Vy: "Đụng hàng với Săn Đầu Pro!"', scene: [
    ['vy', 'Khách vừa báo: bên Săn Đầu Pro gửi đúng ứng viên mình gửi. Cách nhau bốn mươi phút.'],
    { if: (s) => !!s.flags.tie_vy_hanh, then: [['vy', '…Bên đó là chị gái mình. Tối nay ăn cơm nhà chắc căng.']] },
    { mini: DUP_MINI,
      good: [['vy', 'Mình gửi trước, có email đồng ý của ứng viên. Khách công nhận bên mình.'], { fx: { uy: 3, rel: { vy: 1 } } }],
      bad: [['vy', 'Timeline lộn xộn. Khách đề nghị chia phí bảy mươi ba mươi. Ba mươi là bên mình.'], { fx: { dr: 2 } }],
    },
  ] },
  { id: 'r_percent', who: 'quan', obj: 'Quân bị ứng viên hỏi khó', scene: [
    ['quan', 'Ứng viên hỏi mình: "Em được bao nhiêu phần trăm khi anh nhận việc?" Mình nói gì giờ?'],
    { c: '_r_percent', o: [
      { t: 'Nói thật: phí do khách trả, ứng viên không mất đồng nào.', fx: { uy: 2, rel: { quan: 1 } }, then: [['quan', 'Ứng viên bảo: "Vậy em tin bên em hơn rồi". Thật thà cũng là kỹ năng chốt.']] },
      { t: '"Bảo là bí mật kinh doanh."', fx: { dr: 2 }, then: [['quan', 'Ứng viên bảo: "Thế thôi em tự nộp." Bí mật thua minh bạch.']] },
    ] },
  ] },
  { id: 'r_linkedin_22h', who: 'obj:desk', obj: '17:30 Anh Duy nhắn tin "nhờ xíu"', time: '17:30', scene: [
    { chat: [['duy', 'Tối nay em viết giúp anh bài "Tôn trọng thời gian nhân viên" nhé. 22h anh đăng 😊', true]] },
    ['think', 'Viết bài về tôn trọng thời gian nhân viên. Lúc 22 giờ. Cho sếp.'],
    { c: '_r_li22', o: [
      { t: '"Em viết bản nháp ngay bây giờ, 18 giờ em gửi anh ạ."', fx: { uy: 2, nl: -4, rel: { duy: 1 } }, then: [['duy', 'Ok! 18 giờ… à, đúng giờ về. Ừ. Hay. Anh đăng bài đó luôn.']] },
      { t: 'Viết lúc 22 giờ như anh nhờ.', fx: { nl: -10, rel: { duy: 2 } }, then: [['nar', 'Bài đăng 22:00, 1.800 like. Câu được share nhiều nhất: "Không ai nên làm việc sau giờ hành chính."']] },
    ] },
  ] },
  { id: 'r_aircon', who: 'duy', obj: 'Máy lạnh hỏng, anh Duy có ý kiến', scene: [
    ['duy', 'Máy lạnh hỏng! Nhưng khó khăn là cơ hội. Cơ hội để mình… mở cửa sổ. Và gắn kết.'],
    ['nar', 'Cửa sổ tòa hạng C không mở được. Mèo Ghost nằm dài dưới gầm bàn chị My, chỗ mát nhất.'],
    { c: '_r_aircon', o: [
      { t: 'Đề xuất dùng "quỹ team building" mua tạm ba cái quạt.', fx: { uy: 2, rel: { thao: 1, duy: -1 } }, then: [['thao', 'Quỹ team building còn bốn trăm nghìn. Ba cái quạt. Duyệt. Chị là kế toán mà.']] },
      { t: 'Chịu nóng, gắn kết.', fx: { nl: -6, rel: { duy: 1 } }, then: [['nar', 'Bạn gắn kết với cái ghế. Theo nghĩa đen, vì mồ hôi.']] },
    ] },
  ] },
  { id: 'r_translate', who: 'ngan', obj: 'Chị Ngân cần dịch JD gấp', time: '10:00', scene: [
    ['ngan', 'Khách nước ngoài cần JD tiếng Anh trước 11 giờ. Em dịch giúp chị. Ba mươi phút.'],
    { mini: TRANSLATE_MINI,
      good: [['ngan', 'Ổn. Không ai bị dịch thành "old people first". Chị gửi.'], { fx: { uy: 3, rel: { ngan: 1 } } }],
      bad: [['ngan', '"High pressure resistant (like a pipe)". Em ơi. Ống nước à. Chị sửa.'], { fx: { dr: 1, nl: -2 } }],
    },
  ] },
  { id: 'r_tuan_mom', who: 'tuan', obj: 'Anh Tuấn đang gọi điện ở pantry', time: '12:15', scene: [
    ['tuan', '…Dạ con ăn rồi mẹ. Dạ, cơm có canh. Dạ con không thức khuya. Dạ, con yêu mẹ.'],
    ['tuan', '(cúp máy) Đừng nhìn anh như thế. Ứng viên quan trọng nhất của anh là mẹ anh. Không bao giờ ghost.'],
    { c: '_r_mom', o: [
      { t: 'Nhắn hỏi thăm mẹ mình.', fx: { nl: 5, rel: { tuan: 1 } }, then: [['nar', 'Mẹ trả lời ngay: "Ăn chưa con?" Ba chữ. Không cần KPI.']] },
      { t: 'Trêu anh Tuấn "chốt deal với mẹ".', fx: { dr: 1, rel: { tuan: 1 } }, then: [['tuan', 'Deal duy nhất anh chưa bao giờ phải nói "cơ hội không đến hai lần".']] },
    ] },
  ] },
  { id: 'r_thao_bhxh', when: (s) => s.status !== 'official', who: 'thao', obj: 'Chị Thảo hỏi một câu lạ', scene: [
    ['thao', 'Em ơi, em có biết làm hồ sơ bảo hiểm xã hội không? Chị hỏi thật.'],
    ['think', 'Mình là intern. Mình còn chưa có bảo hiểm xã hội.'],
    { c: '_r_bhxh', o: [
      { t: 'Ngồi tra cổng dịch vụ công cùng chị.', fx: { nl: -5, rel: { thao: 2 } }, then: [['thao', 'Hai người tra nhanh gấp đôi. Mà sao công ty nhân sự lại cần intern dạy làm hồ sơ nhân sự nhỉ.']] },
      { t: 'Gợi ý chị xin ngân sách thuê dịch vụ, đừng ôm hết một mình.', fx: { uy: 2, rel: { thao: 1 } }, then: [['thao', '"Đừng ôm hết một mình." Chị chép câu này lên giấy note. Dán cạnh màn hình. Cạnh ba tờ khác.']] },
    ] },
  ] },
  { id: 'r_quan_compete', who: 'quan', obj: 'Quân so số CV', scene: [
    ['quan', 'Tuần này mình 210 CV. Bạn bao nhiêu? …Không, đừng nói. Nói đi.'],
    { c: '_r_compete', o: [
      { t: '"Ít hơn nhiều. Nhưng mình rủ bạn so số người vào vòng hai."', fx: { uy: 1, rel: { quan: 1 } }, then: [['quan', 'Vòng hai… của mình là bốn. Của bạn?'], ['quan', '…Ok. Mình hiểu rồi. Đừng nói nữa.']] },
      { t: 'Khen Quân chăm.', fx: { rel: { quan: 2 } }, then: [['quan', 'Cảm ơn. Không ai khen mình chăm cả. Chỉ khen nhanh.']] },
    ] },
  ] },
  { id: 'r_cry', once: true, time: '10:30', who: 'call:ungvien', obj: 'Một ứng viên gọi, giọng khác thường', call: { title: 'Ứng viên · cuộc gọi không hẹn trước', people: ['ungvien', 'me'] }, scene: [
    ['ungvien', 'Em xin lỗi gọi đột ngột. Sáng nay công ty cũ cho em nghỉ. Email lúc 8:02. Em không biết gọi ai.'],
    { c: '_r_cry', o: [
      { t: 'Nghe hết, hẹn chiều nay cùng xem lại CV và các job phù hợp.', fx: { uy: 2, nl: -4 }, then: [['ungvien', 'Cảm ơn em. Không phải vì job. Vì có người nghe.']] },
      { t: 'Gửi link đăng ký hồ sơ online, hứa gọi lại.', fx: { nl: 1 }, then: [['think', 'Link đăng ký. Đúng quy trình. Nhưng quy trình không biết người ta đang khóc.']] },
    ] },
  ] },
  { id: 'r_bach_48h', who: 'bach', obj: 'Bách vừa hứa với khách một thứ', scene: [
    ['bach', 'Anh vừa hứa khách shortlist trong bốn mươi tám tiếng! Vị trí mới, chưa có JD. Ai làm thì… mình họp sau.'],
    { c: '_r_48h', o: [
      { t: 'Xin Bách gửi ngay brief của khách, chốt lại thời hạn khả thi.', fx: { uy: 2, rel: { bach: -1, ngan: 1 } }, then: [['bach', 'Brief… là một tin nhắn Zalo: "tìm người giỏi". Ok, anh hỏi lại khách.']] },
      { t: 'Nhận làm, thức đêm.', fx: { nl: -12, rel: { bach: 2 } }, then: [['nar', 'Bốn mươi bảy tiếng sau, shortlist gửi đi. Khách đọc lúc 23 giờ và trả lời: "Chưa đúng ý."']] },
    ] },
  ] },
  { id: 'r_my_peek', when: (s) => s.status !== 'official', who: 'my', obj: 'Chị My mời xem một biểu đồ', scene: [
    ['my', 'Báo cáo lương thị trường mới ra. Em muốn xem lương intern nhân sự nằm ở đâu không?'],
    ['my', 'Đây là P25. Đây là P50. Còn em… ở ngoài khung hình. Phía trái.'],
    { if: (s) => !!s.flags.tie_my_ngan, then: [['my', 'Lương chị Ngân thì chị biết từ năm nhất. Hồi đó là học bổng. Giờ vẫn… thôi. Bạn thân thì không kể.']] },
    { c: '_r_mypeek', o: [
      { t: '"Lương anh Duy nằm ở đâu ạ?"', fx: { dr: 2, rel: { my: 1 } }, then: [['my', 'Anh Duy không có lương. Anh ấy có "cổ tức kỳ vọng". Cũng nằm ngoài khung. Phía phải… trong tưởng tượng.']] },
      { t: 'Nhờ chị My dạy cách đọc báo cáo lương.', fx: { uy: 2, rel: { my: 2 } }, then: [['my', 'Đọc cỡ mẫu trước. Rồi đọc chức danh. Cuối cùng mới đọc con số. Ai đọc ngược là bị lừa.']] },
    ] },
  ] },
  { id: 'r_ghost_back', who: 'phat', when: (s) => !s.flags.phat_left, obj: 'Phát có một câu hỏi đạo đức', scene: [
    ['phat', 'Ứng viên ghost mình ba tuần. Hôm nay nhắn: "Anh ơi job còn không?" Mình ghost lại được không?'],
    { c: '_r_ghost', o: [
      { t: '"Trả lời đi. Mình là người tuyển, không phải người trả đũa."', fx: { uy: 1, rel: { phat: 1 } }, then: [['phat', 'Ừ. Mình trả lời. Hóa ra ba tuần đó họ nằm viện. Mình suýt ghost một bệnh nhân.']] },
      { t: '"Ghost hai ngày thôi, cho công bằng."', fx: { dr: 2, rel: { phat: 1 } }, then: [['phat', 'Hai ngày. Công bằng. Văn minh. …Mình thấy hơi tệ.']] },
    ] },
  ] },
  { id: 'r_cat', who: 'vy', obj: 'Vy tìm Mèo Ghost', time: '14:00', scene: [
    ['vy', 'Ai thấy Mèo Ghost không? Khách gọi video lúc ba giờ, anh Duy muốn nó ngồi cạnh logo cho "employer branding".'],
    ['kpi', '…'],
    ['nar', 'Không ai thấy nó. Đúng như tên. Bạn chỉ thấy một sợi lông trên ghế nóng phỏng vấn.'],
    { c: '_r_cat', o: [
      { t: 'Đặt một gói pate cạnh logo.', fx: { rel: { vy: 1 } }, then: [['nar', '14:59, Mèo Ghost xuất hiện, ăn pate, nhìn thẳng vào camera, rời đi lúc 15:01. Khách khen "văn hóa rất chill".']] },
      { t: 'Đề xuất dùng ảnh cũ của nó.', fx: { uy: 1 }, then: [['vy', 'Ảnh cũ duy nhất là nó đang quay lưng. Đúng tinh thần công ty.']] },
    ] },
  ] },
  { id: 'r_son_back', once: true, who: 'call:son', obj: 'Anh Sơn gọi lại sau nhiều tuần', when: (s) => !!s.flags.son_counter && s.day >= 24,
    call: { title: 'Anh Sơn · "Em còn nhớ anh không?"', people: ['son', 'me'] }, scene: [
      ['son', 'Em còn nhớ anh không? Sơn đây. Sếp cũ hứa tăng lương ba mươi phần trăm. Tăng được… một tháng. Rồi "tái cấu trúc ngân sách".'],
      { if: (s) => !!s.flags.son_respect, then: [['son', 'Anh gọi em vì em là người duy nhất không mắng anh hôm đó. Anh muốn đi. Lần này thật.']] },
      { c: '_r_sonback', o: [
        { t: 'Chuyển ca cho anh Tuấn, kèm ghi chú đầy đủ.', fx: { uy: 2, rel: { tuan: 3, son: 1 } }, then: [['tuan', 'ANH SƠN?! Em là thiên thần. Cơ hội này… đến hai lần thật!']] },
        { t: 'Hỏi kỹ lý do lần này, rồi báo chị Ngân.', fx: { uy: 3, rel: { ngan: 1, son: 1 } }, then: [['ngan', 'Ứng viên quay lại sau counter-offer. Hiếm mà không hiếm. Lần này mình hỏi kỹ trước khi mời.']] },
      ] },
    ] },
  { id: 'r_yen_ref', once: true, who: 'obj:desk', obj: 'Về bàn: tin nhắn của chị Yến', when: (s) => !!s.flags.yen_grateful, scene: [
    { chat: [['yen', 'Em ơi, chị gửi số ba người bạn nhé. Ai cũng muốn đổi việc. Chị dặn họ: "gặp bạn này, bạn ấy không ép đâu" 😊', true]] },
    ['think', 'Ba lead. Từ một ca thua.'],
    { c: '_r_yenref', o: [
      { t: 'Gọi cả ba trong chiều nay.', fx: { uy: 3, nl: -5, rel: { yen: 1 } }, then: [['nar', 'Một người phù hợp ngay một job của chị Ngân. Chị Ngân nhìn bạn như nhìn một khoản lãi.']] },
      { t: 'Chuyển cho chị Ngân phân bổ.', fx: { uy: 1, rel: { ngan: 1 } }, then: [['ngan', 'Lead từ ứng viên cũ là lead tốt nhất. Em giữ một người, chị lấy hai.']] },
    ] },
  ] },
  { id: 'r_luc', once: true, who: 'khoa', obj: 'Anh Khoa cầm một lá thư', when: (s) => !!s.flags.assess_rigged, scene: [
    ['khoa', 'Ông Lực gửi thư cho công ty mình. Ông ấy đọc được báo cáo. Ông hỏi: "Các anh chị chấm tôi dựa trên khung năng lực nào?"'],
    ['khoa', 'Anh không trả lời được. Vì câu trả lời là "dựa trên ý ông Tài".'],
    { c: '_r_luc', o: [
      { t: 'Đề nghị anh Khoa trả lời thật và xin lỗi ông Lực.', fx: { uy: 2, dr: 2, rel: { khoa: 2 } }, then: [['khoa', 'Ừ. Mất khách thì mất khách. Anh không muốn mất ngủ thêm.']] },
      { t: 'Im lặng.', fx: { dr: 3, rel: { khoa: -1 } }, then: [['nar', 'Lá thư nằm trong ngăn kéo anh Khoa. Mỗi lần mở ngăn kéo, anh nhìn nó một giây.']] },
    ] },
  ] },
  { id: 'r_onboard_draft', who: 'ngan', obj: 'Chị Ngân giao một việc "không ai làm"', when: (s) => !!s.flags.asked_own_jd && !s.flags.wrote_own_jd && s.day >= 18, scene: [
    ['ngan', 'Em hỏi JD của chính em từ ngày đầu. Chị nhớ. Giờ em viết luôn: onboarding và JD intern. Chị review.'],
    ['ngan', 'Đừng nói anh Duy là chị giao. Cứ coi như em tự nguyện. Ở đây cái gì tự nguyện thì mới được làm.'],
    { mini: ONBOARD_MINI,
      good: [['ngan', 'Ổn. Chị gửi anh Duy dưới tên em.'], { fx: { uy: 3, rel: { ngan: 2 }, set: { wrote_own_jd: true } } }],
      bad: [['ngan', 'Thứ tự lộn xộn. Y như công ty mình. Chị sửa, vẫn để tên em.'], { fx: { nl: -6, rel: { ngan: 1 }, set: { wrote_own_jd: true } } }],
    },
  ] },
  // ---- official-only ----
  { id: 'r_off_commission', official: true, once: true, who: 'thao', obj: 'Chị Thảo báo tin về hoa hồng', scene: [
    ['thao', 'Hoa hồng ca của em… ứng viên báo nghỉ rồi. Mới ngày thứ mười chín. Bảo hành sáu mươi ngày. Nên không có hoa hồng.'],
    ['think', 'Ngày mười chín. Còn chưa kịp tới huyền thoại "ngày năm mươi chín".'],
    { c: '_r_offcom', o: [
      { t: 'Gọi ứng viên hỏi lý do nghỉ, để rút kinh nghiệm.', fx: { uy: 2, nl: -3 }, then: [['nar', 'Ứng viên nói: "Sếp ném hồ sơ vào mặt em." Bạn ghi vào hồ sơ khách: "Cần hỏi về văn hóa trước khi gửi người."']] },
      { t: 'Thở dài, mở mì.', fx: { nl: 5 }, then: [['thao', 'Mì gói chị có ba vị. Em lấy vị nào cũng được. Coi như hoa hồng của chị.']] },
    ] },
  ] },
  { id: 'r_off_intern', official: true, once: true, who: 'khoa', obj: 'Anh Khoa: intern mới đến', scene: [
    ['khoa', 'Có intern mới! Em onboard bạn ấy theo cái JD em viết nhé. Anh lo phần icebreaker.'],
    { c: '_r_offintern', o: [
      { t: 'Đưa intern mới đủ hợp đồng, laptop, JD, người hướng dẫn. Đúng thứ tự.', fx: { uy: 3, nl: -4, rel: { khoa: 1 } }, then: [['nar', 'Intern mới hỏi: "Ở đây onboarding chuyên nghiệp vậy ạ?" Cả phòng im lặng một giây.']] },
      { t: 'Đưa laptop có mật khẩu dán dưới đáy, như truyền thống.', fx: { dr: 2 }, then: [['nar', 'Intern mới lật laptop, đọc hai dòng chữ dưới đáy, rồi nhìn bạn rất lâu.']] },
    ] },
  ] },
  { id: 'r_off_kpi', official: true, who: 'duy', obj: 'Anh Duy hỏi placement tháng này', scene: [
    ['duy', 'Placement tháng này của em là… "đang trong pipeline". KPI là ba. Mình cần nhìn lại mindset nhé.'],
    { c: '_r_offkpi', o: [
      { t: 'Đưa số liệu: tháng cuối năm thị trường đóng băng, cả phòng trung bình 0,8.', fx: { uy: 2, rel: { duy: -1, my: 1 } }, then: [['duy', '0,8? Ai tính? …My. Ừ. Anh sẽ nhìn lại mindset của… KPI.']] },
      { t: '"Dạ em sẽ cố hơn ạ."', fx: { nl: -6, rel: { duy: 1 } }, then: [['think', 'Cố hơn trong một tháng không ai nhảy việc. Như chèo thuyền trên đường nhựa.']] },
    ] },
  ] },
];

export const SIDE_TASKS = [
  { id: 'print_shortlist', title: 'In shortlist cho buổi gặp khách của chị Ngân', from: 'ngan', base: 60, legs: [
    { npc: 'ngan', line: ['ngan', 'In giúp chị năm bộ shortlist. Che số điện thoại ứng viên trước khi in nhé. Khách hay "tiện tay" gọi thẳng.'] },
    { obj: 'printer', line: ['nar', 'Máy in kẹt giấy đúng trang có ảnh cưới của một ứng viên. Bạn gỡ ra, in lại, che số điện thoại bằng bút đen.'] },
    { npc: 'ngan', line: ['ngan', 'Đã che số. Tốt. Em vừa bảo vệ phí của công ty bằng một cây bút dạ.'] },
  ] },
  { id: 'invoice', title: 'Mang đề nghị xuất hóa đơn của Bách qua chị Thảo', from: 'bach', base: 70, legs: [
    { npc: 'bach', line: ['bach', 'Đề nghị xuất hóa đơn cho Mộc Lan. Em đưa chị Thảo giúp anh. Chắc kèo họ trả tháng này.'] },
    { npc: 'thao', line: ['thao', 'Để chị… à, Mộc Lan hả. "Chắc kèo" lần thứ ba rồi. Chị ký nhận.'] },
    { npc: 'bach', line: ['bach', 'Chị Thảo nói gì? …"Chắc kèo lần ba"? Ừ, công bằng.'] },
  ] },
  { id: 'coffee_tuan', title: 'Pha cà phê cho anh Tuấn trước cuộc gọi chốt deal', from: 'tuan', base: 50, legs: [
    { npc: 'tuan', line: ['tuan', 'Pha giúp anh ly cà phê đen. Ba phút nữa anh gọi một ca CFO. Cà phê là đạo cụ.'] },
    { obj: 'coffee', line: ['nar', 'Bạn pha một ly cà phê đen. Hũ cà phê ghi "Quà ứng viên tặng · 2025".'] },
    { npc: 'tuan', line: ['tuan', 'Hoàn hảo. Giờ anh nói câu đó. …Cơ hội này không đến hai lần đâu anh!'] },
  ] },
  { id: 'p50_my', title: 'Hỏi chị My P50 lương Kế toán trưởng cho Vy', from: 'vy', base: 70, legs: [
    { npc: 'vy', line: ['vy', 'Ứng viên hỏi mức lương có hợp lý không. Bạn hỏi chị My P50 Kế toán trưởng giúp mình.'] },
    { npc: 'my', line: ['my', 'P50 ba mươi hai triệu, mẫu bốn mươi người, năm nay. Nói rõ cỡ mẫu với Vy nhé. Chị không muốn thành headline.'] },
    { npc: 'vy', line: ['vy', 'Ba mươi hai, mẫu bốn mươi. Bạn chuẩn như chị My mini.'] },
  ] },
  { id: 'sign_offer', title: 'Xin chữ ký anh Duy cho offer letter', from: 'ngan', base: 80, legs: [
    { npc: 'ngan', line: ['ngan', 'Offer letter cho ứng viên của chị. Em xin chữ ký anh Duy. Đừng để anh ấy đọc xong rồi đăng LinkedIn.'] },
    { npc: 'duy', line: ['duy', 'Ký đây! …Anh chụp ảnh tờ này được không? Che tên đi. Caption: "Một hành trình mới bắt đầu" 💜'] },
    { npc: 'ngan', line: ['ngan', 'Anh ấy chụp à. Thôi, che tên là được. Cảm ơn em.'] },
  ] },
  { id: 'rename_cv', title: 'Đổi tên 30 file "CV.pdf" trong ATS cho Phát', from: 'phat', base: 90, when: (r) => !r.flags.phat_left, legs: [
    { npc: 'phat', line: ['phat', 'Ba mươi file "CV.pdf". Đổi tên theo Họ tên_Vị trí giúp mình. Đừng sort gì cả.'] },
    { obj: 'desk', line: ['nar', 'Ba mươi file. File thứ hai mươi hai là ảnh chụp màn hình một CV. File thứ hai mươi ba là ảnh con mèo.'] },
    { npc: 'phat', line: ['phat', 'Xong rồi á? Bạn nên được trả lương như IT. Mà IT ở đây là mình. Mình cũng không được trả.'] },
  ] },
  { id: 'markers', title: 'Xin chị Thảo bút dạ cho anh Khoa', from: 'khoa', base: 60, legs: [
    { npc: 'khoa', line: ['khoa', 'Anh hết bút dạ! Một buổi đào tạo không có bút dạ là một buổi họp. Em xin chị Thảo giúp anh.'] },
    { npc: 'thao', line: ['thao', 'Bút dạ… văn phòng phẩm là chị, kế toán là chị, nên chị duyệt chị. Đây, ba cây.'] },
    { npc: 'khoa', line: ['khoa', 'Ba cây! Đủ cho một trò icebreaker và nửa trò thứ hai.'] },
  ] },
  { id: 'printer_quan', title: 'Gỡ kẹt máy in cho Quân', from: 'quan', base: 50, legs: [
    { npc: 'quan', line: ['quan', 'Máy in kẹt khi mình in 52 CV. Bạn giúp mình với. Mình đang thi đua.'] },
    { obj: 'printer', line: ['nar', 'Bạn rút ra một tờ CV nhăn nhúm. Dòng đầu: "Dưới đây là bản tóm tắt…". Bạn đặt nó lên trên cùng cho Quân thấy.'] },
    { npc: 'quan', line: ['quan', '…Ơ. Lại còn sót một cái. Cảm ơn. Thật đấy.'] },
  ] },
  { id: 'confirm_iv', title: 'Gọi xác nhận lịch phỏng vấn cho Vy', from: 'vy', base: 70, legs: [
    { npc: 'vy', line: ['vy', 'Ba ứng viên phỏng vấn chiều mai. Bạn gọi xác nhận giúp mình. Gọi đúng tòa nhà nhé.'] },
    { obj: 'desk', line: ['nar', 'Ba cuộc gọi. Một người xác nhận. Một người hỏi gross hay net. Một người nói "mưa to quá em xin dời".'] },
    { npc: 'vy', line: ['vy', 'Một trên ba xác nhận. Tỉ lệ đẹp. Mình đi thắp hương.'] },
  ] },
  { id: 'fee_contract', title: 'Lấy hợp đồng phí với Đất Vàng trong két cho Bách', from: 'bach', base: 60, legs: [
    { npc: 'bach', line: ['bach', 'Khách lại cãi điều khoản. Em lấy giúp anh bản hợp đồng phí gốc trong két. Chìa ở chỗ chị Thảo.'] },
    { obj: 'safe', line: ['nar', 'Két mở. Trong két: ba hợp đồng phí, một hộp bánh trung thu, và một tờ giấy "HĐLĐ nội bộ: (trống)".'] },
    { npc: 'bach', line: ['bach', 'Đây rồi! Điều 4: "sáu tháng". Chắc kèo, có giấy hẳn hoi lần này.'] },
  ] },
  { id: 'water_plant', title: 'Tưới chậu cây "Culture" giúp anh Khoa', from: 'khoa', base: 80, legs: [
    { npc: 'khoa', line: ['khoa', 'Chậu cây "Culture" ghi phụ trách là Culture Team. Culture Team là anh. Mà anh đi đào tạo. Em tưới giúp.'] },
    { obj: 'plant', line: ['nar', 'Bạn tưới cây. Một chiếc lá đứng dậy. Văn hóa công ty có dấu hiệu hồi phục.'] },
    { npc: 'khoa', line: ['khoa', 'Cảm ơn em! Văn hóa cũng như cây: cần tưới, không cần slide.'] },
  ] },
  { id: 'altar', title: 'Thắp hương Thần Tài "xin một placement" cho anh Duy', from: 'duy', base: 70, legs: [
    { npc: 'duy', line: ['duy', 'Tháng này chưa có placement. Em thắp giúp anh nén hương. Đừng đăng LinkedIn phần này.'] },
    { obj: 'altar', line: ['nar', 'Bạn thắp hương. Trên đĩa có một CV gấp gọn và một tờ note: "Xin cho ứng viên đừng nghỉ ngày 59".'] },
    { npc: 'duy', line: ['duy', 'Cảm ơn em. Khoa học và tâm linh. Mình là công ty toàn diện.'] },
  ] },
  { id: 'cake_thao', title: 'Mang hộp bánh ứng viên tặng qua chị Thảo', from: 'tuan', base: 50, legs: [
    { npc: 'tuan', line: ['tuan', 'Ứng viên gửi bánh. Em mang qua chị Thảo trước khi cả phòng ăn hết trong ba phút.'] },
    { npc: 'thao', line: ['thao', 'Cho chị hả? …Ừ, chị cất một cái. Còn lại em mang ra pantry. Nhanh, họ đang tới.'] },
    { npc: 'tuan', line: ['tuan', 'Kịp không? …Kịp. Em có tố chất RPO: tốc độ.'] },
  ] },
];
