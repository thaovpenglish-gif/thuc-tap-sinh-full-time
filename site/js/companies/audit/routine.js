// Cân Đối & Cộng Sự — routine beats for ordinary days + side-task templates.

const intern = (r) => r.status !== 'official';
const khoaHere = (r) => !r.flags.khoa_left; // anh Khoa quits in the official arc

export const ROUTINE = [
  { id: 'au_r_voice', who: 'khoa', obj: 'Anh Khoa hỏi về voice note', time: '10:00', when: khoaHere, scene: [
    ['khoa', 'Em nghe voice note anh gửi chưa?'],
    ['nar', 'Voice note dài 4 phút 12 giây. Bốn phút đầu là tiếng gõ phím, tiếng thở dài, và một đoạn anh Khoa nói chuyện với cây xương rồng.'],
    { c: '_au_r_voice', o: [
      { t: 'Nghe hết cả 4 phút.', fx: { nl: -4, rel: { khoa: 1 } }, then: [['nar', 'Giây 248: "…nên em ref chéo E200 sang lead nhé." Giây 249: tiếng ngáy.']] },
      { t: 'Tua tới giây cuối.', fx: { nl: -3 }, then: [['nar', 'Giây cuối: "…nhé." Bạn phải nghe lại từ đầu.']] },
    ] },
  ] },
  { id: 'au_r_final', who: 'diep', obj: 'Chị Diệp hỏi ai lưu file "final"', time: '14:00', scene: [
    ['diep', 'Ai lưu file "WP_final_final_v3_REAL_dungsua.xlsx" vào ổ chung vậy?'],
    ['nar', 'Thư mục có 7 file "final". File mới nhất là "final_v2". File cũ nhất là "REAL".'],
    { c: '_au_r_final', o: [
      { t: 'Đề xuất quy tắc đặt tên theo ngày giờ.', fx: { uy: 2, rel: { diep: 2 } }, then: [['diep', 'Ngày_giờ_tênngười. Chị in ra dán lên màn hình mọi người. Bằng giấy cam.']] },
      { t: '"Em nghĩ là của Vy ạ."', when: intern, fx: { dr: 2, rel: { vy: -1 } }, then: [['vy', 'Không phải mình! …Ừ, của mình. Nhưng chữ "REAL" là của anh Tuấn.']] },
      { t: 'Im lặng, tự đổi tên file của mình cho đúng.', fx: { nl: -2 }, then: [['think', 'Không ai thấy. Nhưng ổ chung có thêm một file tên tử tế.']] },
    ] },
  ] },
  { id: 'au_r_charge', who: 'hue', obj: 'Chị Huệ hỏi về timesheet (lần thứ ba)', time: '10:30', scene: [
    ['hue', 'Em charge giờ hôm qua vào job nào?'],
    ['me', 'Dạ em ghi rồi ạ, chị hỏi lần thứ ba trong tuần rồi.'],
    ['hue', 'Lần thứ ba vì hai lần trước em ghi khác nhau.'],
    { c: '_au_r_charge', o: [
      { t: 'Mở timesheet sửa ngay trước mặt chị Huệ.', fx: { uy: 1, rel: { hue: 2 } }, then: [['hue', 'Đúng mã. Đúng giờ. Chị muốn khóc vì hạnh phúc.']] },
      { t: '"Em ghi job nội bộ được không ạ?"', fx: { dr: 1 }, then: [['hue', 'Job nội bộ là "không ai trả tiền". Ghi nhiều thì anh Phong mời đi uống trà.']] },
    ] },
  ] },
  { id: 'au_r_onedong', who: 'thao', obj: 'Chị Thảo cần tìm một đồng', time: '11:00', scene: [
    ['thao', 'Bảng tổng hợp phải thu lệch một đồng. Một đồng thôi. Em tìm giúp chị.'],
    { c: '_au_r_onedong', o: [
      { t: 'Dò từng dòng tìm đồng lệch.', fx: { nl: -8, uy: 2, rel: { thao: 1 } }, then: [['nar', 'Bốn mươi phút sau: một ô làm tròn, một ô không. Một đồng. Bạn thấy chiến thắng hơn cả hôm tốt nghiệp.']] },
      { t: '"Chị ơi, một đồng thì immaterial ạ."', fx: { dr: 2, rel: { thao: -1 } }, then: [['thao', 'Immaterial thì không điều chỉnh. Nhưng phải biết nó từ đâu. Không biết thì một đồng hôm nay là một tỷ năm sau.']] },
    ] },
  ] },
  { id: 'au_r_question', who: 'khoa', obj: 'Anh Khoa nhờ giải mã một dấu hỏi', time: '15:00', when: khoaHere, scene: [
    ['khoa', 'Chị Thảo để note "?" ở WP của anh. Em đoán xem nghĩa là gì?'],
    ['nar', 'Dấu hỏi nằm ở ô "Kết luận". Ô đó trống.'],
    { c: '_au_r_question', o: [
      { t: '"Chị ấy hỏi kết luận đâu ạ."', fx: { uy: 1, rel: { khoa: 1 } }, then: [['khoa', 'Ừ. Đôi khi một dấu hỏi chỉ là dấu hỏi. Đôi khi là cả một cuộc đời.']] },
      { t: '"Chị ấy hỏi anh có ổn không ạ."', fx: { rel: { khoa: 2 } }, then: [['khoa', '…Chưa ai hỏi anh câu đó trong note bao giờ. Em làm anh nhìn lại cái dấu hỏi.']] },
    ] },
  ] },
  { id: 'au_r_partner', who: 'phong', obj: 'Anh Phong (Partner) bất ngờ ghé', time: '10:00', when: (r) => !r.flags.partner_noticed, scene: [
    ['phong', 'Em… Tâm phải không? Thảo bảo em làm tồn kho.'],
    ['me', 'Dạ em là {ten} ạ.'],
    { c: '_au_r_partner', o: [
      { t: 'Cười và nhắc lại tên thật rõ.', fx: { rel: { phong: 1 } }, then: [['phong', '{ten}. Ừ. Lần sau anh nhớ.'], ['nar', 'Anh Phong viết tên bạn lên mu bàn tay. Bằng bút máy.']] },
      { t: 'Nhận luôn là Tâm.', fx: { dr: 2 }, then: [['phong', 'Tốt, Tâm. Làm tốt nhé, Tâm.'], ['think', 'Mình vừa có biệt danh do Partner đặt. Có thể theo mình tới lúc nghỉ hưu.']] },
    ] },
  ] },
  { id: 'au_r_update', who: 'loc', obj: 'Laptop tự update giữa lúc chạy pivot', time: '09:30', scene: [
    ['loc', 'Laptop em vừa tự update giữa lúc chạy pivot à? Anh đã nói không bấm Update.'],
    ['me', 'Em không bấm! Nó tự…'],
    ['loc', 'Nó tự. Ừ. Máy tính cũng có tự do ý chí. Ngồi xuống, anh xem.'],
    { c: '_au_r_update', o: [
      { t: 'Ngồi chờ anh Lộc cứu máy.', fx: { nl: -5, rel: { loc: 1 } }, then: [['nar', 'Hai mươi phút sau, máy lên. Pivot vẫn còn. Anh Lộc gật đầu như vừa đỡ đẻ thành công.']] },
      { t: 'Mượn tạm máy chung ở phòng họp.', fx: { clock: 15, uy: 1 }, then: [['nar', 'Máy chung có mật khẩu dán ngay trên màn hình: "CanDoi@123". Bảo mật cấp độ: thân mật.']] },
    ] },
  ] },
  { id: 'au_r_tb', who: 'diep', obj: 'Khách vừa gửi file TB', time: '10:00', scene: [
    ['diep', 'Khách gửi TB rồi. Em lấy số từ sheet nào?'],
    { mini: { type: 'pick', title: 'File TB_KhachGui.xlsx', icon: '📊', prompt: 'Chọn đúng sheet. Gợi ý: số phải khớp báo cáo khách đã ký.', pick: 1, time: 20, pass: 1, items: [
      { text: 'Sheet1', sub: 'Sửa: tháng trước' },
      { text: 'Sheet1 (2)', sub: 'Sửa: hôm qua 23:50 · tô vàng' },
      { text: 'Đừng dùng', sub: 'Sửa: hôm nay · khớp báo cáo đã ký', correct: true },
      { text: 'TB_final', sub: 'Trống' },
    ] },
      good: [['diep', 'Đúng. Sheet tên "Đừng dùng" là sheet duy nhất đúng. Kế toán khách có khiếu hài hước.'], { fx: { uy: 2, rel: { diep: 1 } } }],
      bad: [['diep', 'Em vừa lấy số tháng trước. Chị biết vì tháng trước chị cũng lấy nhầm.'], { fx: { nl: -3 } }],
    },
  ] },
  { id: 'au_r_fruit', who: 'tuan', obj: 'Tuấn có câu hỏi về… xoài', time: '11:30', scene: [
    ['tuan', 'Kế toán khách mang trái cây sang cho đoàn. Một rổ xoài. Theo quy định độc lập, xoài có tính là quà không?'],
    { c: '_au_r_fruit', o: [
      { t: '"Giá trị nhỏ, mình mời cả khách cùng ăn ạ."', fx: { nl: 6, rel: { tuan: 1 } }, then: [['tuan', 'Đúng tinh thần. Xoài ăn chung là văn hoá. Xoài mang về nhà là độc lập có vấn đề.']] },
      { t: '"Hỏi chị My cho chắc."', fx: { uy: 1, rel: { my: 1 } }, then: [['my', 'Xoài thì được. Sầu riêng thì chị cần ngồi nghĩ.']] },
    ] },
  ] },
  { id: 'au_r_milktea', who: 'thao', obj: 'Chị Thảo đặt trà sữa cho team', time: '15:30', scene: [
    ['nar', 'Chị Thảo đặt trà sữa cho cả team. Mười một ly. Team có mười hai người.'],
    ['thao', 'Ơ, chị tưởng em đi client. Chị không đặt cho em.'],
    { c: '_au_r_milktea', o: [
      { t: '"Không sao chị, em uống trà gừng cô Lụa."', fx: { rel: { thao: 1, lua: 1 } }, then: [['lua', 'Trà gừng không có trân châu, nhưng có tình người.']] },
      { t: 'Nhìn ly trà sữa của chị Thảo thật lâu.', fx: { dr: 1, nl: 5, rel: { thao: 1 } }, then: [['thao', '…Đây. Chị uống nửa rồi. Đừng kể ai.']] },
    ] },
  ] },
  { id: 'au_r_teambuilding', who: 'hue', obj: 'Chị Huệ mời đăng ký team building', time: '14:00', once: true, scene: [
    ['hue', 'Đăng ký team building nhé! Thứ Bảy tuần sau, công viên gần đây. Chủ đề: "Cân bằng cuộc sống".'],
    ['think', 'Team building chủ đề cân bằng cuộc sống, giữa busy season, vào thứ Bảy.'],
    { c: '_au_r_tb', o: [
      { t: 'Đăng ký.', fx: { nl: -2, rel: { hue: 2 } }, then: [['hue', 'Em là người thứ ba. Hai người kia là chị và Mèo Số Dư.']] },
      { t: '"Em xin vắng vì phải clear note ạ."', fx: { uy: 1, rel: { hue: -1 } }, then: [['hue', 'Lý do hợp lệ. Lý do của tất cả mọi người. Chị sẽ tổ chức team building cho một mình chị.']] },
    ] },
  ] },
  { id: 'au_r_shortcut', who: 'tuan', obj: 'Tuấn khoe một phím tắt', time: '10:30', scene: [
    ['tuan', 'Em biết Ctrl + [ chưa? Nhảy tới ô gốc của công thức. Đổi đời luôn.'],
    { c: '_au_r_shortcut', o: [
      { t: 'Thử ngay.', fx: { uy: 1, rel: { tuan: 1 } }, then: [['nar', 'Bạn bấm Ctrl + [. Con trỏ nhảy sang sheet khác, đúng nguồn số. Bạn thấy mình là thiên tài. Cảm giác kéo dài 11 giây.']] },
      { t: '"Anh còn mẹo nào nữa không?"', fx: { rel: { tuan: 2 } }, then: [['tuan', 'F2 để sửa ô. F4 để khoá tham chiếu. Alt + = để cộng nhanh. Và… thôi, mẹo cuối dùng khi chị Thảo gọi lúc 23 giờ. Đừng dùng.']] },
    ] },
  ] },
  { id: 'au_r_hieu', who: 'hieu', obj: 'Anh Hiếu (Tax) đang buồn', time: '14:30', once: true, scene: [
    ['hieu', 'Em ơi, ai hỏi em về thuế thì nói: "tùy trường hợp". Câu đó đúng 100%.'],
    ['hieu', 'Hôm nay anh phát hiện một văn bản anh trích suốt ba tháng đã bị thay thế. Từ bốn tháng trước.'],
    { c: '_au_r_hieu', o: [
      { t: '"Anh có buồn không ạ?"', fx: { rel: { hieu: 2 } }, then: [['hieu', 'Buồn. Nhưng anh có thơ: "Văn bản ơi, em đi đâu / Để anh trích dẫn một câu bị thay."'], ['think', 'Phòng Tax có một thi sĩ.']] },
      { t: '"Làm sao biết văn bản còn hiệu lực ạ?"', fx: { uy: 2, rel: { hieu: 1 } }, then: [['hieu', 'Kiểm tra tình trạng hiệu lực trên nguồn chính thống, đọc cả văn bản sửa đổi. Và đừng tin trí nhớ của anh. (thông tin giải trí, không phải tư vấn pháp lý)']] },
    ] },
  ] },
  { id: 'au_r_sang', who: 'sang', obj: 'Anh Sang cần giúp nghe điện thoại', time: '11:00', scene: [
    ['sang', '(bịt điện thoại) Em ơi, nói giúp anh với chị Bảy là anh đang họp. Chị ấy gọi lần thứ chín.'],
    { c: '_au_r_sang', o: [
      { t: 'Nghe máy, ghi lại câu hỏi giúp anh Sang.', fx: { nl: -3, rel: { sang: 2 } }, then: [
        ['nar', 'Chị Bảy hỏi: "Mua vàng tặng con dâu có tính vào chi phí tiệm không em?" Bạn ghi lại, kèm ba dấu chấm than.'],
        ['sang', 'Không. Quà riêng không phải chi phí kinh doanh. Nhưng anh phải nói "không" theo cách để năm sau chị ấy vẫn thuê anh. (thông tin giải trí, không phải tư vấn pháp lý)'],
      ] },
      { t: '"Anh đâu có họp ạ."', fx: { dr: 1, rel: { sang: -1 } }, then: [['sang', 'Anh đang họp với chính anh. Về sức khỏe tinh thần.']] },
    ] },
  ] },
  { id: 'au_r_initial', who: 'my', obj: 'Chị My (QC) gọi bạn', time: '16:00', scene: [
    ['my', 'Trang 37. Thiếu chữ ký nháy.'],
    ['me', 'Dạ hồ sơ nào ạ?'],
    ['my', 'Hồ sơ nào cũng thiếu trang 37. Chị không biết vì sao. Em ký đi.'],
    { c: '_au_r_initial', o: [
      { t: 'Ký nháy, kiểm tra luôn trang 36 và 38.', fx: { uy: 2, rel: { my: 1 } }, then: [['my', 'Trang 38 cũng thiếu. Em là người đầu tiên tự phát hiện. Chị ghi. Trang "nên làm".']] },
      { t: 'Ký nháy trang 37 rồi đi.', fx: { nl: -1 }, then: [['my', 'Ừ.'], ['think', 'Không biết "ừ" của chị My là khen hay là ghi.']] },
    ] },
  ] },
  { id: 'au_r_stamp', who: 'lua', obj: 'Đóng dấu 60 thư xác nhận chỗ cô Lụa', time: '09:00', scene: [
    ['lua', 'Cháu cần đóng dấu thư xác nhận à? Mấy lá?'],
    ['me', 'Dạ sáu mươi lá ạ.'],
    ['lua', 'Sáu mươi. Mỗi lá cô xem một lần. Con dấu không vội.'],
    { c: '_au_r_stamp', o: [
      { t: 'Ngồi xếp thư giúp cô.', fx: { nl: -4, rel: { lua: 2 } }, then: [['lua', 'Cháu xếp theo số thứ tự à? Ba mươi năm, cháu là người thứ hai làm thế. Người thứ nhất giờ là Partner.']] },
      { t: 'Để thư lại, đi làm việc khác.', fx: { uy: 1 }, then: [['nar', 'Hai tiếng sau, sáu mươi lá thư nằm ngay ngắn, dấu đỏ thẳng hàng tuyệt đối. Cô Lụa không dùng thước.']] },
    ] },
  ] },
  { id: 'au_r_ngan', who: 'ngan', obj: 'Chị Ngân (Advisory) nhờ sửa slide', time: '15:00', scene: [
    ['ngan', 'Em làm đẹp giúp chị slide này. Bên chị gọi là "storyline". Bên em gọi là… gì nhỉ?'],
    ['me', 'Dạ bên em gọi là "thuyết minh" ạ.'],
    { c: '_au_r_ngan', o: [
      { t: 'Làm slide gọn, mỗi slide một thông điệp.', fx: { nl: -5, uy: 2, rel: { ngan: 2 } }, then: [['ngan', 'Đẹp. Em làm audit mà biết storyline. Phí quá. Hay sang bên chị?']] },
      { t: '"Chị ơi, slide này có số chưa ai kiểm tra ạ."', fx: { uy: 2, rel: { ngan: -1, diep: 1 } }, then: [['ngan', '…Em đúng là người bên audit.']] },
    ] },
  ] },
  { id: 'au_r_vydone', who: 'vy', obj: 'Vy lại "xong rồi ạ"', time: '09:00', when: intern, scene: [
    ['vy', 'Em xong rồi ạ! (nói to về phía phòng chị Thảo)'],
    ['nar', 'Chị Thảo không nghe thấy. Cửa phòng đóng. Vy nói lại lần hai, to hơn.'],
    { c: '_au_r_vydone', o: [
      { t: '"Vy ơi, nói to không làm file đúng hơn đâu."', fx: { dr: 1, rel: { vy: -1 } }, then: [['vy', 'Nhưng làm file được nghe thấy hơn.'], ['think', 'Không sai. Đáng buồn là không sai.']] },
      { t: 'Hỏi Vy có cần mình xem lại giúp không.', fx: { nl: -3, rel: { vy: 2 } }, then: [['vy', '…Ừ. Xem giúp mình phần ref chéo. Đừng nói ai.']] },
    ] },
  ] },
  { id: 'au_r_green', who: 'diep', obj: 'Chị Diệp mất bút xanh lá', time: '11:30', scene: [
    ['diep', 'Ai thấy bút xanh lá của chị không? Đừng ai nói chuyện với chị cho tới khi tìm thấy.'],
    { c: '_au_r_green', o: [
      { t: 'Đi lục khắp văn phòng tìm bút.', fx: { nl: -4, rel: { diep: 3 } }, then: [['nar', 'Bút xanh lá nằm dưới Mèo Số Dư. Nó nằm lên đó cả buổi sáng. Có lẽ nó cũng thích màu xanh lá.']] },
      { t: 'Đưa chị bút xanh dương.', fx: { dr: 1, rel: { diep: -1 } }, then: [['diep', 'Xanh dương là "đã lần xuôi". Xanh lá là "đã gửi khách". Em đưa chị cây này là đổi nghĩa cả một ngành.']] },
    ] },
  ] },
  { id: 'au_r_nap', who: 'tuan', obj: 'Tuấn biến mất sau giờ trưa…', time: '13:15', scene: [
    ['nar', 'Tuấn đang ngủ trong phòng lưu trữ, gối đầu lên hộp hồ sơ năm 2019. Chị Thảo đang đi về phía đó.'],
    { c: '_au_r_nap', o: [
      { t: 'Đánh thức Tuấn kịp lúc.', fx: { rel: { tuan: 3 } }, then: [['tuan', '(bật dậy) Em đang… kiểm tra chứng từ năm 2019 ạ!'], ['thao', 'Chứng từ năm 2019 có gối à?']] },
      { t: 'Để Tuấn ngủ. Anh ấy cần.', fx: { dr: 1, rel: { tuan: 1 } }, then: [['thao', 'Tuấn ngủ à. Ừ. Để nó ngủ. Hồi chị A1, chị ngủ trên đúng hộp đó.']] },
    ] },
  ] },
  { id: 'au_r_wedding', who: 'thao', obj: 'Chị Thảo nhờ một việc riêng', time: '16:00', once: true, scene: [
    ['thao', 'Em ơi, chị nhờ chút việc riêng. Bạn chị cưới, chị phải làm slide ảnh. Em làm đẹp giúp chị được không?'],
    { c: '_au_r_wedding', o: [
      { t: 'Nhận làm, ghi chú "việc riêng, không charge giờ".', fx: { nl: -5, rel: { thao: 2 } }, then: [['thao', 'Không charge giờ. Em hiểu văn hoá nhanh quá. Chị hơi lo cho em.']] },
      { t: '"Em xong WP rồi em làm ạ."', fx: { uy: 1, rel: { thao: 1 } }, then: [['thao', 'Ưu tiên đúng. Chị thích. Bạn chị thì không.']] },
    ] },
  ] },
  { id: 'au_r_year', who: 'obj:desk', obj: 'Về bàn rà lại 15 file WP', time: '14:30', once: true, scene: [
    ['nar', 'Tiêu đề cả 15 file WP ghi "Năm tài chính kết thúc 31/12/2024". Bạn copy từ file năm ngoái mà quên đổi năm.'],
    { c: '_au_r_year', o: [
      { t: 'Sửa cả 15 file, kiểm tra luôn công thức.', fx: { nl: -6, uy: 2 }, then: [['think', 'Ba file có công thức trỏ tới sheet không tồn tại. Hồn ma năm cũ ở khắp nơi.']] },
      { t: 'Dùng Find & Replace cho nhanh.', fx: { dr: 1, nl: -3 }, then: [['nar', 'Find & Replace đổi luôn một số tiền có chứa "2024" ở ô doanh thu. Bạn phát hiện ra sau mười phút. May.']] },
    ] },
  ] },
  { id: 'au_r_spicy', who: 'tuan', obj: 'Mùi lạ từ phòng họp…', time: '12:30', scene: [
    ['nar', 'Phòng họp đóng kín. Tuấn đang ăn mì cay cấp 7. Không khí trong phòng có thể dùng làm vũ khí.'],
    ['tuan', 'Vào đi em. Mì cay giúp anh tỉnh. Busy season, cay là cà phê.'],
    { c: '_au_r_spicy', o: [
      { t: 'Ăn thử một đũa.', fx: { nl: 6, dr: 1, rel: { tuan: 2 } }, then: [['nar', 'Bạn khóc. Tuấn khóc. Chị Diệp đi ngang, cũng khóc, vì mùi. Cả đoàn khóc vì những lý do khác nhau.']] },
      { t: 'Mở cửa thông gió.', fx: { uy: 1, rel: { tuan: -1 } }, then: [['tuan', 'Em vừa phá hỏng nghi lễ. Nhưng phòng họp cảm ơn em.']] },
    ] },
  ] },
  { id: 'au_r_cat', who: 'obj:desk', obj: 'Có gì đó nằm trên bàn phím của bạn', time: '11:00', scene: [
    ['nar', 'Mèo Số Dư nằm trên bàn phím của bạn. Ô C47 vừa được điền "0000000000000".'],
    { c: '_au_r_cat', o: [
      { t: 'Nhẹ nhàng nhấc mèo ra, Ctrl+Z.', fx: { rel: { tuan: 1 } }, then: [['nar', 'Bạn Ctrl+Z mười ba lần. Ô C47 trở về. Chênh lệch: đúng 0. Mèo Số Dư tìm ra trước bạn.']] },
      { t: 'Gõ bằng phần bàn phím không có mèo.', fx: { nl: -3, dr: 1 }, then: [['nar', 'Bạn gõ bằng một tay. Mèo ngủ ngon. Năng suất giảm một nửa. Tâm hồn tăng gấp đôi.']] },
    ] },
  ] },
  { id: 'au_r_hong', who: 'call:hong', obj: 'Chị Hồng (Phúc Lộc) gửi voice 3 phút', time: '15:00', when: intern,
    call: { title: 'Zalo · Chị Hồng (Phúc Lộc) · 3 phút 02 giây', people: ['hong', 'me'] }, scene: [
    ['hong', 'Các em kiểm toán hỏi cái hoá đơn này lần thứ tư rồi đấy. Lần nào cũng một câu. Chị không phải tổng đài.'],
    ['nar', 'Bạn kiểm tra: bốn người khác nhau trong đoàn đã hỏi cùng một hoá đơn. Không ai báo ai.'],
    { c: '_au_r_hong', o: [
      { t: 'Xin lỗi, gửi lại một danh sách câu hỏi gộp, đánh số.', fx: { uy: 1, rel: { hong: 2 } }, then: [['hong', 'Có đánh số. Ừ. Thế này chị trả lời một lần là xong.']] },
      { t: 'Forward cho anh Khoa.', fx: { rel: { khoa: 1 } }, then: [['khoa', 'Ừ. Anh gọi chị Hồng. Anh dùng giọng "người không ngủ ba ngày". Giọng đó rất thuyết phục.']] },
    ] },
  ] },
  { id: 'au_r_replyall', who: 'khoa', obj: 'Email "Re: Re: Re: Fw: Re: số dư tiền"', time: '09:30', when: khoaHere, scene: [
    ['nar', 'Email "Re: Re: Re: Fw: Re: số dư tiền" có 47 người nhận. Bạn được cc ở lần forward thứ sáu. Không ai nhớ câu hỏi gốc.'],
    ['khoa', 'Em đọc thread đó rồi trả lời giúp anh câu hỏi gốc nhé.'],
    { c: '_au_r_replyall', o: [
      { t: 'Đọc ngược từ email đầu tiên.', fx: { nl: -5, uy: 2 }, then: [['nar', 'Email gốc, ba tuần trước: "Số dư tiền đã khớp chưa?" Trả lời: rồi. Ba tuần trước. Không ai đọc.']] },
      { t: 'Bấm Reply All: "Dạ đã khớp ạ."', fx: { dr: 3 }, then: [['nar', '47 người nhận được. 12 người reply all "ok". Hộp thư cả phòng ngập trong tiếng "ok".']] },
    ] },
  ] },
  { id: 'au_r_payroll', who: 'obj:desk', obj: 'File khách gửi có một sheet lạ', time: '16:00', once: true, scene: [
    ['nar', 'File chi phí khách gửi có thêm sheet "Lương BGĐ". Bạn vừa biết lương kế toán trưởng. Và của CFO. Và vì sao chị Hồng mệt.'],
    { c: '_au_r_payroll', o: [
      { t: 'Đóng sheet, báo anh Khoa xin khách gửi lại bản không có lương.', fx: { uy: 3, rel: { khoa: 1 } }, then: [['khoa', 'Đúng. Mình chỉ lấy cái mình cần. Biết nhiều quá không phải lợi thế. Là rủi ro.']] },
      { t: 'Nhìn thêm năm giây.', fx: { dr: 2 }, then: [['think', 'Lương CFO gấp mười lăm lần lương chị Hồng. Mình sẽ không bao giờ quên con số này. Đó chính là vấn đề.']] },
    ] },
  ] },
  { id: 'au_r_sun', who: 'khoa', obj: 'Anh Khoa hỏi chuyện thời tiết', time: '12:15', when: khoaHere, scene: [
    ['khoa', 'Em vừa ở ngoài vào hả? Trời thế nào? Kể anh nghe.'],
    { c: '_au_r_sun', o: [
      { t: 'Kể thật chi tiết: nắng, gió, mùi bánh mì.', fx: { rel: { khoa: 2 } }, then: [['khoa', 'Bánh mì… có pa-tê không em?'], ['nar', 'Anh Khoa nhắm mắt nghe như nghe nhạc.']] },
      { t: 'Kéo anh ra cửa sổ năm phút.', fx: { nl: 3, rel: { khoa: 3 } }, then: [['khoa', 'Ồ. Nó vẫn ở đó. Mặt trời. Anh tưởng nó chuyển sang job khác rồi.']] },
    ] },
  ] },
  { id: 'au_r_printscan', who: 'my', obj: 'Chị My phổ biến quy trình mới', time: '14:00', once: true, scene: [
    ['my', 'Quy trình mới: mọi chứng từ điện tử phải in ra, ký nháy, scan lại, rồi upload.'],
    ['think', 'In một file điện tử để biến nó thành file điện tử.'],
    { c: '_au_r_printscan', o: [
      { t: 'Làm đúng quy trình.', fx: { nl: -6, rel: { my: 1 } }, then: [['nar', 'Máy in hết giấy ở trang 112. Bạn mượn giấy phòng Tax. Anh Hiếu hỏi bạn trích dẫn quy định nào.']] },
      { t: 'Đề xuất ký số thay vì in.', fx: { uy: 2, rel: { my: 1 } }, then: [['my', 'Đề xuất tốt. Em viết hướng dẫn cho cả phòng nhé. Hạn thứ Sáu.'], ['think', 'Phần thưởng cho ý tưởng tốt: thêm việc.']] },
    ] },
  ] },
  { id: 'au_r_lift', who: 'lua', obj: 'Cô Lụa báo tin thang máy', time: '08:45', once: true, scene: [
    ['lua', 'Thang máy hôm nay bảo trì. Đi thang bộ nhé cháu. Mười một tầng.'],
    { c: '_au_r_lift', o: [
      { t: 'Leo thang bộ.', fx: { nl: -8, rel: { phong: 1 } }, then: [{ if: (r) => !!r.flags.partner_noticed, then: [['nar', 'Tầng 7, bạn gặp anh Phong đang nghỉ chân. "Chào {ten}," anh nói. Đúng tên. Hai người leo nốt bốn tầng trong im lặng tôn trọng.']], else: [['nar', 'Tầng 7, bạn gặp anh Phong đang nghỉ chân. "Chào… Tâm," anh nói. Hai người leo nốt bốn tầng trong im lặng tôn trọng.']] }] },
      { t: 'Ngồi uống trà gừng chờ thang sửa xong.', fx: { clock: 20, nl: 4, rel: { lua: 1 } }, then: [['lua', 'Ngồi đi. Thang sửa xong lúc nào cô cũng không biết. Nhưng trà thì xong rồi.']] },
    ] },
  ] },
  // official-only
  { id: 'au_r_off_intern', who: 'tuan', obj: 'Intern mới hỏi một câu khó', time: '10:00', official: true, scene: [
    ['tuan', 'Intern mới hỏi anh "tick xong chưa em" nghĩa là gì. Anh chỉ sang em. Em là A1 rồi.'],
    { c: '_au_r_off_intern', o: [
      { t: 'Giải thích tử tế, kèm bảng màu chị Diệp.', fx: { uy: 2, rel: { diep: 1 } }, then: [['diep', 'Em dạy đúng màu. Chị nghỉ hưu được rồi. Đùa đấy. Chị chưa được nghỉ.']] },
      { t: '"Năm ngoái làm thế nào thì năm nay làm thế."', fx: { dr: 2, rel: { tuan: 1 } }, then: [['tuan', 'Em vừa thành anh. Chào mừng. Đáng sợ không?']] },
    ] },
  ] },
  { id: 'au_r_off_budget', who: 'thao', obj: 'Chị Thảo hỏi về budget giờ', time: '15:00', official: true, scene: [
    ['thao', 'Job Vạn Thịnh vượt budget giờ 160%. Em là A1 rồi, em giải thích giúp chị với anh Phong vì sao.'],
    { c: '_au_r_off_budget', o: [
      { t: 'Lập bảng giờ thật, kèm nguyên nhân: PBC trễ, file mất, khách đổi số.', fx: { nl: -5, uy: 3, rel: { thao: 1 } }, then: [['thao', 'Có số, có nguyên nhân. Năm sau chị xin được budget đúng. Có thể. Nếu anh Phong đọc tới dòng hai.']] },
      { t: '"Do em làm chậm ạ."', fx: { dr: 1, rel: { thao: -1 } }, then: [['thao', 'Đừng nhận hết lỗi của một hệ thống vào mình. Hệ thống không cảm ơn em đâu.']] },
    ] },
  ] },
];

export const SIDE_TASKS = [
  { id: 'au_stamp', title: 'Mang thư xác nhận của anh Khoa qua cô Lụa đóng dấu', from: 'khoa', base: 70, when: khoaHere, legs: [
    { npc: 'khoa', line: ['khoa', 'Em mang tập thư này qua cô Lụa đóng dấu giúp anh. Đừng giục cô. Giục là cô đóng chậm hơn.'] },
    { npc: 'lua', line: ['lua', 'Thư của Khoa à. Ừ. Dấu đỏ, thẳng hàng. Mang về cho nó.'] },
    { npc: 'khoa', line: ['khoa', 'Thẳng hàng thật. Cô Lụa là thước kẻ sống.'] },
  ] },
  { id: 'au_print', title: 'In 200 trang chứng từ vouching cho chị Diệp', from: 'diep', base: 60, legs: [
    { npc: 'diep', line: ['diep', 'In giúp chị 200 trang chứng từ mẫu. Hai mặt. Không phải một mặt. Hai mặt.'] },
    { obj: 'printer', line: ['nar', 'Máy in kẹt ở trang 87. Bạn mở nắp, rút tờ giấy nhăn. Trên máy dán: "In ra → ký nháy → scan → upload". Máy chạy tiếp.'] },
    { npc: 'diep', line: ['diep', 'Hai mặt thật. Em là người tử tế.'] },
  ] },
  { id: 'au_charger', title: 'Xin anh Lộc sạc laptop cho Tuấn', from: 'tuan', base: 80, legs: [
    { npc: 'tuan', line: ['tuan', 'Laptop anh còn 3%. Em qua anh Lộc xin cái sạc giúp anh. Anh không dám đi, anh đang ở 3%.'] },
    { npc: 'loc', line: ['loc', 'Sạc à. Còn một cái, dây hơi xoắn. Xoắn nhưng vẫn yêu.'] },
    { npc: 'tuan', line: ['tuan', '4%… 5%… em cứu một mạng người.'] },
  ] },
  { id: 'au_timesheet', title: 'Xin chữ ký chị Thảo duyệt timesheet cho chị Huệ', from: 'hue', base: 90, legs: [
    { npc: 'hue', line: ['hue', 'Em xin chị Thảo ký duyệt timesheet tuần này giúp chị. Chị Thảo chỉ ký khi có người đứng trước mặt.'] },
    { npc: 'thao', line: ['thao', 'Timesheet à. Chị hỏi nhanh: ai ghi 8 tiếng mà làm 14? …Thôi, chị ký.'] },
    { npc: 'hue', line: ['hue', 'Ký rồi! Kỷ lục: trước 12 giờ trưa.'] },
  ] },
  { id: 'au_circular', title: 'In văn bản hướng dẫn mới cho anh Hiếu', from: 'hieu', base: 60, legs: [
    { npc: 'hieu', line: ['hieu', 'In giúp anh văn bản hướng dẫn vừa ban hành. Anh muốn cầm bản giấy trước khi nó bị thay thế.'] },
    { obj: 'printer', line: ['nar', 'Bạn in 46 trang. Trang cuối ghi: "Văn bản này có hiệu lực kể từ ngày ký". Anh Hiếu sẽ thích dòng này.'] },
    { npc: 'hieu', line: ['hieu', 'Cảm ơn em. Anh sẽ đọc tối nay. Như đọc thơ.'] },
  ] },
  { id: 'au_coffee', title: 'Pha cà phê cho anh Khoa (anh chưa rời ghế từ hôm qua)', from: 'khoa', base: 50, when: khoaHere, legs: [
    { npc: 'khoa', line: ['khoa', 'Em pha giúp anh một ly cà phê. Đen. Không đường. Như tương lai của job này.'] },
    { obj: 'coffee', line: ['nar', 'Bạn pha cà phê. Pantry có ba gói cà phê và một tờ giấy: "Quỹ ăn đêm chỉ claim sau 21h".'] },
    { npc: 'khoa', line: ['khoa', 'Đắng. Ấm. Cảm ơn em. Anh vừa cảm nhận được thời gian.'] },
  ] },
  { id: 'au_pivot', title: 'Nhờ chị Diệp soát pivot cho chị Ngân', from: 'ngan', base: 80, legs: [
    { npc: 'ngan', line: ['ngan', 'Em nhờ Diệp xem giúp chị cái pivot này. Diệp mà gật thì chị yên tâm. Đừng nói chị nhờ.'] },
    { npc: 'diep', line: ['diep', 'Của Ngân à. Chị biết ngay vì tô màu nền. Ừ, đúng. Thiếu một dòng tổng. Bảo Ngân chị không thấy gì.'] },
    { npc: 'ngan', line: ['ngan', 'Diệp gật rồi à? Tốt. Chị sẽ không kể với Diệp là chị vui.'] },
  ] },
  { id: 'au_initials', title: 'Xin chữ ký nháy anh Khoa cho chị My', from: 'my', base: 70, when: khoaHere, legs: [
    { npc: 'my', line: ['my', 'Hồ sơ này thiếu chữ ký nháy của Khoa ở trang 37. Em mang qua.'] },
    { npc: 'khoa', line: ['khoa', 'Lại trang 37. Anh nghĩ trang 37 bị nguyền.'] },
    { npc: 'my', line: ['my', 'Đủ rồi. Chị ghi. Trang "đã xong".'] },
  ] },
  { id: 'au_receipt', title: 'Lấy giấy biên nhận thư bảo đảm ở cô Lụa cho anh Sang', from: 'sang', base: 80, legs: [
    { npc: 'sang', line: ['sang', 'Em qua cô Lụa lấy giúp anh biên nhận thư bảo đảm gửi chị Bảy. Chị ấy bảo chưa nhận được, anh cần bằng chứng.'] },
    { npc: 'lua', line: ['lua', 'Biên nhận đây. Ngày gửi, giờ gửi, chữ ký bưu tá. Bằng chứng là thứ duy nhất không biết cãi.'] },
    { npc: 'sang', line: ['sang', 'Có cái này thì chị Bảy hết cãi. Chị ấy sẽ chuyển sang hỏi chuyện khác.'] },
  ] },
  { id: 'au_binder', title: 'Lấy hồ sơ năm ngoái trong tủ khoá cho Vy', from: 'vy', base: 70, legs: [
    { npc: 'vy', line: ['vy', 'Bạn lấy giúp mình hồ sơ năm ngoái trong tủ khoá được không? Mình chỉ… tham khảo. Thật.'] },
    { obj: 'safe', line: ['nar', 'Tủ khoá chỉ mở khi có cô Lụa. Cô mở, nhìn bạn: "Tham khảo thôi nhé." Cô nhấn mạnh chữ "thôi".'] },
    { npc: 'vy', line: ['vy', 'Cảm ơn! Tham khảo. Chỉ tham khảo thôi.'] },
  ] },
  { id: 'au_partner_tea', title: 'Pha trà mang vào cho anh Phong trước giờ ký', from: 'lua', base: 50, legs: [
    { npc: 'lua', line: ['lua', 'Anh Phong sắp đến. Cháu pha giúp cô ấm trà. Trà, không phải cà phê. Anh Phong ký bằng trà.'] },
    { obj: 'coffee', line: ['nar', 'Bạn pha một ấm trà. Pantry có ba loại trà, bạn chọn loại có hạn dùng còn xa nhất.'] },
    { npc: 'phong', line: ['phong', 'Trà vừa. Cảm ơn em. Ký bằng trà thì chữ ký mềm hơn một chút.'] },
  ] },
  { id: 'au_greenpen', title: 'Xin chị Huệ một cây bút xanh lá cho chị Diệp', from: 'diep', base: 80, legs: [
    { npc: 'diep', line: ['diep', 'Chị hết bút xanh lá. Em xin chị Huệ giúp chị một cây. Đây là chuyện khẩn cấp.'] },
    { npc: 'hue', line: ['hue', 'Bút xanh lá à? Cả công ty chỉ Diệp dùng. Chị nhập riêng một hộp cho Diệp. Lấy hai cây đi.'] },
    { npc: 'diep', line: ['diep', 'Hai cây. Em vừa cứu thế giới tick-mark.'] },
  ] },
];
