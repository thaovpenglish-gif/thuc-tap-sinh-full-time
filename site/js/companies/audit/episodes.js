// Cân Đối & Cộng Sự — drama days. Day 1 onboarding, 16 more intern episodes (days 2–40), 4 official-only arc episodes.
// Flags carry across episodes (see promotion.when in extras.js). Speakers: cast ids + me/think/nar.

const isTier = (...ids) => (s) => ids.includes(s.tier);
const F = (k) => (r) => !!r.flags[k];

// ---------- mini-games ----------
export const TICK_MINI = {
  type: 'quiz', title: 'Bảng màu tick-mark của chị Diệp', icon: '🖊️',
  prompt: 'Chị Diệp hỏi, em trả lời. Sai màu là sai đời.', time: 40, pass: 0.75,
  questions: [
    { q: '✓ màu đỏ nghĩa là…', options: ['Đã đối chiếu chứng từ gốc', 'Chị Diệp đang giận', 'Đã xem qua cho có'], correct: 0 },
    { q: 'Σ màu tím nghĩa là…', options: ['Ký hiệu cho đẹp', 'Đã cộng dồn, khớp tổng', 'Tím mộng mơ'], correct: 1 },
    { q: 'Ô đánh dấu "?" màu cam nghĩa là…', options: ['Đã xong', 'Bút đỏ hết mực', 'Cần hỏi lại khách hoặc Senior'], correct: 2 },
    { q: 'Tick-mark không có chú giải (legend) thì…', options: ['Reviewer không hiểu, coi như chưa làm', 'Vẫn đẹp', 'Partner sẽ tự hiểu'], correct: 0 },
  ],
};

export const STOCK_MINI = {
  type: 'pick', title: 'Kho lạnh −18°C · chọn pallet mở thùng', icon: '🧊',
  prompt: 'Ngón tay bạn sắp đông. Chọn 3 pallet đáng ngờ nhất để mở kiểm tra.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Pallet A3', sub: 'Sương phủ đều, tem sản xuất tháng này' },
    { text: 'Pallet B7', sub: 'Gõ vào nghe "bộp bộp" như thùng rỗng', correct: true },
    { text: 'Pallet C1', sub: 'Tem hạn dùng đã qua từ năm ngoái', correct: true },
    { text: 'Pallet D4', sub: 'Xếp sát tường, chỉ thấy mặt trước', correct: true },
    { text: 'Pallet E2', sub: 'Chú Tư đứng chắn: "Khỏi đếm, chú nhớ"', correct: true },
    { text: 'Pallet F5', sub: 'Tem in đẹp, có mã QR' },
    { text: 'Pallet G1', sub: 'Đá bám dày, số lượng khớp sổ' },
  ],
};

export const GHOST_MINI = {
  type: 'quiz', title: 'Tra cứu hoá đơn mẫu 17', icon: '👻',
  prompt: 'Khoản 2,1 tỷ "tư vấn chiến lược theo chỉ đạo". Làm đúng từng bước.', time: 35, pass: 0.66,
  questions: [
    { q: 'Muốn biết hoá đơn điện tử có thật không, em tra ở đâu?', options: ['Hỏi chính người bán', 'Cổng tra cứu hoá đơn của cơ quan thuế', 'Tìm ảnh trên mạng'], correct: 1 },
    { q: 'Kết quả: "Người bán đã ngừng hoạt động". Em ghi vào WP thế nào?', options: ['Ghi rõ kết quả, ngày tra, đính kèm ảnh chụp', 'Ghi "đã kiểm tra ✓"', 'Không ghi cho đỡ rối'], correct: 0 },
    { q: 'Diễn giải "theo chỉ đạo". Bằng chứng còn thiếu là…', options: ['Một chữ ký đẹp hơn', 'Lời giải thích bằng miệng', 'Hợp đồng, biên bản nghiệm thu, sản phẩm tư vấn'], correct: 2 },
  ],
};

export const COPY_MINI = {
  type: 'pick', title: 'Ref chéo WP phải trả của Vy', icon: '🗂️',
  prompt: 'Tìm 3 dấu hiệu cho thấy đây là WP năm ngoái, chỉ đổi số.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Ngày ký của người lập là năm ngoái', correct: true },
    { text: 'Nhà cung cấp đã giải thể từ năm ngoái vẫn còn số dư', correct: true },
    { text: 'Chữ ký nháy "Q.A": intern năm ngoái, đã nghỉ việc', correct: true },
    { text: 'Số dư cuối kỳ khớp TB năm nay' },
    { text: 'Font chữ Arial 11' },
    { text: 'Có tick đỏ ở cột chứng từ' },
  ],
};

export const CONFIRM_MINI = {
  type: 'pick', title: 'Thư xác nhận hồi âm', icon: '✉️',
  prompt: 'Chọn 2 "thư xác nhận" KHÔNG đáng tin.', pick: 2, time: 30, pass: 0.5,
  items: [
    { text: 'Thư ngân hàng gửi thẳng về văn phòng mình, có dấu và chữ ký' },
    { text: 'Email "xác nhận" gửi từ địa chỉ @phucloc của chính khách hàng', correct: true },
    { text: 'Thư khách nợ ký, gửi bưu điện về địa chỉ Cân Đối' },
    { text: 'Bản scan do kế toán khách chuyển tiếp, không có phong bì', correct: true },
    { text: 'Thư ngân hàng có số tham chiếu khớp thư yêu cầu' },
  ],
};

export const TAX_QUIZ = {
  type: 'quiz', title: 'Bài test lúc 2 giờ sáng của anh Hiếu', icon: '📜',
  prompt: 'Ba câu. Anh Hiếu soạn lúc 2 giờ sáng nên hơi… triết.', time: 35, pass: 0.66,
  questions: [
    { q: 'Hoá đơn ghi sai tên người mua. Em làm gì?', options: ['Lấy bút sửa trên bản in', 'Báo Senior, đề nghị người bán xử lý theo quy định về hoá đơn có sai sót', 'Kệ, tiền vẫn là tiền'], correct: 1 },
    { q: 'Anh Hiếu nói "theo Điều 4 khoản 2 điểm c". Em nên…', options: ['Gật gù cho chuyên nghiệp', 'Trích ngược lại Điều 5', 'Hỏi văn bản nào, còn hiệu lực không, rồi đọc bản gốc'], correct: 2 },
    { q: 'Cách tốt nhất để kiểm tra một hoá đơn điện tử?', options: ['Tra cứu trên cổng của cơ quan thuế', 'Nhìn logo có đẹp không', 'Hỏi người bán "thật không anh?"'], correct: 0 },
  ],
};

export const REVIEW_MINI = {
  type: 'pick', title: 'RN – Phúc Lộc – E200 (27 note)', icon: '🖍️',
  prompt: '1:07 sáng. Chọn 3 note phải xử lý trước 8 giờ.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: '"Số dư TK tiền gửi chưa khớp sổ phụ. Giải thích?"', correct: true },
    { text: '"Font tiêu đề nên là Arial 11."' },
    { text: '"Thiếu ref chéo từ lead schedule sang WP chi tiết."', correct: true },
    { text: '"Tick-mark màu cam này nghĩa là gì?"' },
    { text: '"Chọn mẫu 25 hoá đơn nhưng WP chỉ có 23."', correct: true },
    { text: '"?" (ở logo công ty trên trang bìa)' },
    { text: '"Đổi tên sheet cho đẹp."' },
  ],
};

export const SIGN_ORDER = {
  type: 'order', title: 'Ai ký trước, ai ký sau', icon: '✍️',
  prompt: 'Sắp xếp thứ tự ký duyệt một hồ sơ kiểm toán.', time: 30, pass: 0.75,
  items: [
    { text: 'Người lập (em) ký nháy từng trang', order: 0 },
    { text: 'Senior soát xét, ký', order: 1 },
    { text: 'Manager soát xét, clear review note', order: 2 },
    { text: 'QC soát xét độc lập', order: 3 },
    { text: 'Partner ký báo cáo', order: 4 },
  ],
};

export const SIGNOFF_QUIZ = {
  type: 'quiz', title: '"Số này hơi lạ nhỉ?"', icon: '🖋️',
  prompt: 'Anh Phong nhìn bạn. Cả phòng nhìn bạn. Mèo Số Dư cũng nhìn bạn.', time: 30, pass: 0.66,
  questions: [
    { q: 'Tồn kho tăng 40%, doanh thu tăng 5%. Em giải thích thế nào?', options: ['Do thị trường ạ', 'Công ty trữ hàng cho đơn Tết: có hợp đồng bán đã ký, có biên bản kiểm kê', 'Năm ngoái cũng thế ạ'], correct: 1 },
    { q: 'Rủi ro cần lưu ý là gì?', options: ['Hàng tồn lâu, cần đánh giá dự phòng giảm giá', 'Không có rủi ro', 'Cá có thể bơi đi'], correct: 0 },
    { q: 'Bằng chứng nào mạnh nhất?', options: ['Lời chú Tư', 'Email của anh Quang', 'Biên bản kiểm kê có chọn mẫu và ảnh chụp'], correct: 2 },
  ],
};

export const HOTPOT_ORDER = {
  type: 'order', title: 'Sổ kho Lẩu Bếp Nhà Mây', icon: '🍲',
  prompt: 'Đối chiếu nhập – xuất – tồn theo đúng thứ tự.', time: 30, pass: 0.8,
  items: [
    { text: 'Lấy số tồn đầu tháng trên sổ', order: 0 },
    { text: 'Cộng số nhập trong tháng (phiếu nhập)', order: 1 },
    { text: 'Trừ số xuất trong tháng (phiếu xuất)', order: 2 },
    { text: 'So với số kiểm đếm thực tế cuối tháng', order: 3 },
    { text: 'Tìm xem 40 ký chênh lệch đã đi đâu', order: 4 },
  ],
};

export const EXCEL_QUIZ = {
  type: 'quiz', title: 'Excel 400.000 dòng', icon: '📊',
  prompt: 'Chị Ngân kiểm tra xem em có phải "người Excel" không.', time: 30, pass: 0.66,
  questions: [
    { q: 'File 400.000 dòng làm máy treo. Cách đúng nhất?', options: ['Mở lại 14 lần', 'Lọc, gộp dữ liệu (Power Query) trước khi nạp', 'In ra giấy'], correct: 1 },
    { q: '=SUM(A1:A9)+1000000000. Vấn đề là gì?', options: ['Hard-code một số vào công thức', 'Thiếu dấu chấm phẩy', 'Không sao, cho tròn'], correct: 0 },
    { q: 'Tra giá trị theo mã khách hàng giữa hai bảng: dùng…', options: ['Ctrl+F 400.000 lần', 'Mắt thường', 'XLOOKUP hoặc VLOOKUP'], correct: 2 },
  ],
};

const LUNCH_POS = { vy: 'lunch1', tuan: 'lunch2', sang: 'lunch3', diep: 'lunch4', hieu: 'lunch5' };
const MEET_POS = { phong: 'meeting_head', thao: 'mr_n1', khoa: 'mr_n2' };

// ---------- Day 1 ----------
const ONBOARDING = {
  id: 'onboarding', day: 1, title: 'Onboarding', sideTasks: true,
  intro: 'Thứ Hai, 8:30. Ngày đầu ở Cân Đối & Cộng Sự.\n\nTrong balo: CCCD bản gốc, một cây bút bi, và cái áo khoác anh Khoa dặn trong tám giây cuối voice note.\n\nNgoài việc chính, các anh chị sẽ nhờ bạn vài việc vặt. Xem danh sách ở góc màn hình, làm kịp giờ thì được ghi nhận.',
  steps: [
    { who: 'lua', obj: 'Tới quầy cô Lụa nhận thẻ và ký cam kết độc lập', time: '08:30', scene: [
      ['lua', 'Thẻ ra vào của cháu đây. Và đây là bản cam kết độc lập. Cháu đọc rồi ký từng trang.'],
      ['nar', 'Bản cam kết dài sáu trang, kèm danh sách 212 khách hàng. Câu hỏi: "Bạn hoặc người thân có cổ phiếu, khoản vay, quan hệ đặc biệt với khách hàng nào không?"'],
      { c: 'au_d1_indep', o: [
        { t: 'Đọc hết danh sách 212 khách hàng.', fx: { nl: -6, uy: 2, rel: { lua: 1 }, set: { indep_read: true } }, then: [
          ['nar', 'Khách hàng số 147: "Lẩu Bếp Nhà Mây". Bạn từng ăn ở đó ba lần. Bạn quyết định không khai việc ăn lẩu.'],
          ['lua', 'Đọc tới trang sáu. Được. Lần đầu cô thấy intern đọc tới trang sáu.'],
        ] },
        { t: '"Người yêu cũ có tính là người thân không ạ?"', fx: { dr: 2, rel: { lua: 2 } }, then: [
          ['lua', 'Còn liên lạc thì khai. Đã chặn rồi thì… cô cũng không biết. Để cô hỏi chị My.'],
          ['think', 'Câu hỏi của mình vừa được chuyển lên phòng QC.'],
        ] },
        { t: 'Ký nhanh sáu trang.', fx: { set: { indep_fast: true } }, then: [
          ['lua', 'Trang ba chưa có chữ ký nháy kìa. Ký lại.'],
          ['nar', 'Bạn ký lại. Cô Lụa đóng dấu "ĐÃ NHẬN" mạnh tới mức bàn rung.'],
        ] },
      ] },
    ] },
    { who: 'loc', obj: 'Qua góc IT nhận laptop', time: '08:45', scene: [
      { if: isTier('t5'), then: [['loc', 'Laptop của em đây. Máy mới, đúng thỏa thuận. Mới, nhưng đã cài sẵn bản Excel cũ cho đồng bộ.']],
        else: [['loc', 'Laptop của em đây. Đời 2017. Pin 40 phút, quạt kêu như máy bay, nhưng Excel vẫn chạy. Chậm.']] },
      ['loc', 'Quy tắc: không bấm Update. Không mở file trên 50MB. Và anh về lúc năm giờ.'],
      { c: 'au_d1_laptop', o: [
        { t: '"Nếu máy chết sau năm giờ thì sao anh?"', fx: { rel: { loc: 1 }, set: { save_habit: true } }, then: [
          ['loc', 'Thì em cầu nguyện. Hoặc lưu file mỗi mười phút. Cách thứ hai hiệu quả hơn.'],
        ] },
        { t: 'Bấm luôn nút Update cho máy chạy nhanh.', fx: { dr: 3, nl: -5, clock: 20, rel: { loc: -1 } }, then: [
          ['nar', 'Màn hình xanh: "Đang cập nhật 1/47. Đừng tắt máy."'],
          ['loc', '…Anh vừa nói gì nhỉ.'],
        ] },
        { t: 'Cảm ơn, hỏi mật khẩu wifi.', fx: { rel: { loc: 1 } }, then: [
          ['loc', 'Wifi CanDoi_Guest. Mật khẩu NoBangCo2025. Đừng hỏi sao không phải 2026. Không ai dám đổi.'],
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Gặp anh Khoa (Senior) nhận việc đầu tiên', time: '09:15', scene: [
      ['khoa', 'À, em đây rồi. Anh là Khoa, In-charge job Phúc Lộc Foods. Thuỷ sản đông lạnh, kho âm mười tám độ. Em sẽ yêu nó. Rồi em sẽ lạnh.'],
      ['khoa', 'Việc đầu tiên: đối chiếu sổ phụ ngân hàng với sổ tiền gửi. Bank rec. Lệch thì tìm. Lệch một đồng cũng tìm.'],
      ['nar', 'Anh Khoa nói mà không rời mắt khỏi màn hình. Da anh có màu của giấy A4.'],
      { c: 'au_d1_khoa', o: [
        { t: '"Dạ. Mà anh ăn sáng chưa ạ?"', fx: { rel: { khoa: 2 } }, then: [
          ['khoa', 'Ăn sáng… là bữa ăn lúc trời sáng hả em? Anh có nghe nói.'],
          ['nar', 'Anh Khoa nhận gói bánh của bạn như nhận chứng từ gốc: cẩn thận, hai tay.'],
        ] },
        { t: '"Em làm theo file năm ngoái được không anh?"', fx: { rel: { tuan: 1 }, set: { ly_habit: true } }, then: [
          ['khoa', 'Được. Nhưng file năm ngoái có ba lỗi. Nếu em giữ nguyên ba lỗi, anh sẽ biết em copy.'],
          ['tuan', '(từ bàn bên) Bốn lỗi. Anh để lại một lỗi làm kỷ niệm.'],
        ] },
        { t: 'Hỏi rõ deadline và mẫu WP.', fx: { uy: 2, rel: { khoa: 1 } }, then: [
          ['khoa', 'Trước năm giờ chiều. Mẫu trong ổ chung, thư mục "E100_Tien". Đừng mở thư mục "Đừng mở".'],
        ] },
      ] },
    ] },
    { who: 'diep', obj: 'Chị Diệp dạy bảng màu tick-mark', time: '10:15', scene: [
      ['diep', 'Em là intern mới? Ngồi đây. Trước khi tick bất cứ cái gì, em phải thuộc bảng màu của chị.'],
      ['diep', 'Đỏ: đã đối chiếu chứng từ gốc. Xanh dương: đã lần xuôi lên sổ. Tím: đã cộng dồn. Cam: cần hỏi lại. Đen: không bao giờ.'],
      ['think', 'Lần đầu mình thấy một người nói về bút bi bằng giọng của một nhà tu hành.'],
      { mini: TICK_MINI,
        good: [['diep', 'Đúng hết. Em được phép cầm bút đỏ của chị. Đừng làm rơi nắp.'], { fx: { uy: 3, rel: { diep: 2 }, set: { tick_legend: true } } }],
        bad: [['diep', 'Em vừa đánh tick đen vào ô ngày tháng. Chị cần ngồi một mình năm phút.'], { fx: { nl: -3, rel: { diep: -1 } } }],
      },
    ] },
    { who: 'vy', obj: 'Giờ trưa! Xuống pantry ăn với mọi người', time: '12:00', pos: LUNCH_POS, scene: [
      ['vy', 'Bạn là intern mới hả? Ngồi đây nè. Mình là Vy. Mình vào trước bạn một tuần.'],
      ['vy', 'Mình xong bank rec rồi. Lúc 9:02. Bạn xong chưa?'],
      ['tuan', 'Vy ơi, cho người ta ăn đã.'],
      ['hieu', 'Ăn trưa là chi phí được trừ khi tính thuế của… à thôi, anh đang nghỉ trưa.'],
      ['sang', '(nghe điện thoại) Dạ em nghe chị Bảy. Hoá đơn ghi sai tên chồng chị hả? Dạ chị chụp thẳng giúp em, đừng nghiêng.'],
      ['nar', 'Mèo Số Dư nhảy lên ghế trống cạnh bạn, cuộn tròn thành một số 0 hoàn hảo.'],
      { c: 'au_d1_lunch', o: [
        { t: 'Hỏi Vy làm bank rec thế nào mà nhanh vậy.', fx: { rel: { vy: 1 }, set: { vy_curious: true } }, then: [
          ['vy', 'Bí mật nghề nghiệp. Mà thôi, nói luôn: mình mở file năm ngoái. Năm nào ngân hàng chẳng thế.'],
          ['think', 'Ngân hàng thì thế. Số dư thì chắc không.'],
        ] },
        { t: 'Hỏi anh Hiếu làm thuế thì có gì vui.', fx: { rel: { hieu: 2 } }, then: [
          ['hieu', 'Vui nhất là khi văn bản mới thay văn bản cũ mà hướng dẫn chưa kịp ra. Ba tuần đó, cả phòng anh sống bằng niềm tin.'],
        ] },
        { t: 'Hỏi Tuấn đợt này mấy suất chính thức.', fx: { rel: { tuan: 1 }, set: { knows_one_offer: true } }, then: [
          ['tuan', 'Một.'],
          ['vy', '(cười) Một thôi bạn ạ.'],
          ['nar', 'Nhiệt độ bàn ăn giảm hai độ. Không cần đi kho lạnh nữa.'],
        ] },
      ] },
      { fx: { nl: 25 } },
      ['nar', 'Bữa trưa bốn mươi phút. Mười phút anh Sang nghe điện thoại, năm phút chị Diệp im lặng tìm bút xanh lá.'],
    ] },
    { who: 'call:thao', obj: 'Chị Thảo đang gọi Teams! (nghe máy)', time: '15:00',
      call: { title: 'Chị Thảo <> Intern · "Chị hỏi nhanh thôi"', people: ['thao', 'khoa', 'me'] }, scene: [
      ['thao', 'Em làm bank rec Phúc Lộc phải không? Chị vừa mở file. Chị có một note.'],
      ['nar', 'Ô B14 có một comment màu đỏ. Nội dung: "?"'],
      ['thao', 'Em xử lý note đó giúp chị trước năm giờ nhé.'],
      { c: 'au_d1_note', o: [
        { t: '"Chị ơi, dấu hỏi này là chị muốn em giải thích gì ạ?"', fx: { uy: 3, rel: { thao: 1 }, set: { asks_clarify: true } }, then: [
          ['thao', 'Sổ phụ ngày cuối kỳ khác sổ kế toán 1.250.000 đồng. Em ghi "khớp". Dấu hỏi là: khớp kiểu gì?'],
          ['think', 'Một dấu hỏi chứa được cả một đoạn văn. Đây là nghệ thuật.'],
        ] },
        { t: 'Tự đoán và sửa lại công thức.', fx: { nl: -6, dr: 1 }, then: [
          ['nar', 'Bạn sửa ba công thức. Dấu hỏi vẫn ở đó. Giờ có thêm một dấu hỏi thứ hai.'],
          ['khoa', 'Hỏi đi em. Dấu hỏi không tự biến mất. Anh thử rồi.'],
        ] },
        { t: 'Nhắn Tuấn nhờ dịch dấu hỏi.', fx: { rel: { tuan: 1 } }, then: [
          { chat: [['tuan', '"?" ở ô số dư = "em ghi khớp mà không thấy chứng từ". "??" = "em đang đùa à". "???" thì anh chưa thấy ai sống sót.', true]] },
          ['thao', 'Em hiểu rồi chứ? Tốt. Chị offline đây. Chị online lại lúc 3 giờ sáng.'],
        ] },
      ] },
    ] },
    { who: 'obj:desk', obj: '17:45 Về bàn: OT hay về đúng giờ?', time: '17:45', scene: [
      ['nar', '17:45. Anh Lộc đã về đúng 17:00. Anh Khoa vẫn ngồi, ánh màn hình là nguồn sáng duy nhất trên mặt anh.'],
      { if: isTier('t5'), then: [{ chat: [['thao', 'Em về rồi à?', true]] }, ['think', 'Bốn chữ. Không có dấu chấm hỏi nào nặng hơn dấu này.']] },
      { if: F('contract_blind'), then: [['think', 'Thỏa thuận có dòng "kiểm kê kể cả 2 giờ sáng". Mình đã ký mà không hỏi.']] },
      { c: 'au_d1_ot', o: [
        { t: 'Ở lại tìm cho ra 1.250.000 đồng chênh lệch.', fx: { nl: -15, rel: { khoa: 2, thao: 1 }, set: { d1_found: true } }, then: [
          { if: isTier('t3', 't5'), then: [{ fx: { uy: 4 } }] },
          ['nar', '20:40, bạn tìm ra: phí chuyển tiền ngân hàng ghi nhận sang kỳ sau. Sai kỳ. Bạn thấy mình như thám tử.'],
          ['khoa', 'Tìm ra rồi hả? Giờ ghi lại bằng chứng. Không có bằng chứng thì coi như em chưa tìm.'],
        ] },
        { t: 'Về đúng giờ. Sáng mai đến sớm tìm tiếp.', fx: { nl: 20 }, then: [
          { if: isTier('t5'), then: [{ fx: { dr: 6, uy: -2 } }, ['think', 'Mình chọn mức phụ cấp cao nhất. Hình như "cao nhất" là có lý do.']] },
          { if: isTier('t0', 't1'), then: [['khoa', 'Về đi em. Intern về đúng giờ là quyền. Anh thì… không nhớ quyền của anh để đâu.']] },
        ] },
      ] },
    ] },
  ],
  diary: (s) => {
    const b = [];
    b.push(s.flags.tick_legend ? 'Mình thuộc bảng màu của chị Diệp: đỏ, xanh, tím, cam. Không bao giờ đen.' : 'Mình tick đen vào ô ngày tháng. Chị Diệp cần ngồi một mình.');
    if (s.flags.asks_clarify) b.push('Một dấu hỏi của chị Thảo chứa cả một đoạn văn.');
    if (s.flags.d1_found) b.push('20:40 mình tìm ra 1.250.000 đồng. Cảm giác như phá án.');
    if (s.flags.knows_one_offer) b.push('Đợt này chỉ có một suất. Vy biết. Giờ mình cũng biết.');
    return `Ngày 1 ở Cân Đối. ${b.join(' ')} Anh Khoa chưa về khi mình về.`;
  },
};

// ---------- intern episodes ----------
const PBC = {
  id: 'pbc_chase', minDay: 2, maxDay: 4, title: 'PBC lần thứ ba',
  intro: 'Danh sách PBC (tài liệu khách cần chuẩn bị) của Phúc Lộc có 42 dòng. Khách đã gửi 6. Trong 6 cái đó có một ảnh chụp lịch treo tường.\n\nHôm nay bạn được giao một nhiệm vụ cao quý: nhắc lần ba.',
  steps: [
    { who: 'khoa', obj: 'Anh Khoa giao việc: nhắc PBC lần ba', time: '08:45', scene: [
      ['khoa', 'Client chưa gửi PBC à? Thế em cứ ngồi đó chờ.'],
      ['khoa', '…Đùa đấy. Em gọi chị Hồng, kế toán trưởng bên client, nhắc lần ba. Lịch sự. Rất lịch sự. Chị ấy làm việc của ba người.'],
      ['nar', 'File "PBC_PhucLoc_nhac_lan_3_FINAL" dòng 37 ghi: "Hợp đồng tư vấn chiến lược – CHƯA GỬI – (khách bảo: không có)".'],
      { fx: { nl: -2 } },
    ] },
    { who: 'call:hong', obj: 'Gọi chị Hồng (kế toán trưởng Phúc Lộc)', time: '10:00',
      call: { title: 'Phúc Lộc Foods <> Kiểm toán · "Nhắc lần 3"', people: ['hong', 'me'] }, scene: [
      ['hong', 'Alo. Các em kiểm toán lại hỏi gì nữa đấy? Hôm qua chị gửi rồi mà.'],
      ['me', 'Dạ chị gửi 6 mục ạ. Còn 36 mục, trong đó có…'],
      ['hong', 'Em biết chị đang làm cùng lúc báo cáo thuế, lương tháng, và sổ của ba công ty con không? Một mình chị.'],
      { if: F('tie_hong_alum'), then: [['hong', 'Chị cũng từng là "các em kiểm toán". Ở chính Cân Đối, bảy năm trước. Nên chị biết các em cần gì. Và biết các em sẽ hỏi lại.']] },
      { c: 'au_pbc_call', o: [
        { t: 'Gửi lại danh sách đánh số, chia 3 đợt, đợt 1 chỉ 8 mục gấp nhất.', fx: { uy: 3, rel: { hong: 2 }, set: { pbc_polite: true } }, then: [
          ['hong', '…Tám mục thì chị làm được. Em là người đầu tiên chia nhỏ cho chị. Năm ngoái tụi nó gửi 42 dòng một lúc.'],
          ['think', 'Hoá ra kế toán khách cũng là người.'],
        ] },
        { t: '"Dạ để em báo anh Khoa trao đổi với chị ạ."', fx: { rel: { khoa: 1 } }, then: [
          ['hong', 'Ừ, bảo Khoa gọi chị. Khoa còn sống không em? Đợt trước chị thấy Khoa xanh lắm.'],
        ] },
        { t: '"Theo thư hẹn kiểm toán, bên chị có trách nhiệm cung cấp đầy đủ ạ."', fx: { dr: 4, rel: { hong: -3 }, set: { hong_angry: true } }, then: [
          ['nar', 'Đầu dây bên kia im lặng bốn giây.'],
          ['hong', 'Được. Chị sẽ cung cấp đầy đủ. Cho sếp của sếp em.'],
          ['nar', 'Cuộc gọi kết thúc. Bạn thấy một cơn gió lạnh, dù chưa tới kho.'],
        ] },
      ] },
    ] },
    { who: 'sang', obj: 'Anh Sang (Dịch vụ kế toán) gọi bạn qua', time: '11:30', scene: [
      ['sang', 'Em gọi chị Hồng Phúc Lộc hả? Cả phòng nghe thấy.'],
      ['sang', 'Anh làm sổ thuê cho bốn mươi khách. Kế toán nào cũng có một câu: "chị làm một mình". Và tám mươi phần trăm là thật.'],
      { c: 'au_pbc_sang', o: [
        { t: '"Vậy làm sao để khách gửi nhanh hơn anh?"', fx: { rel: { sang: 2 }, set: { sang_tip: true } }, then: [
          ['sang', 'Đừng bắt họ tìm. Hỏi đúng tên file, đúng tháng, đúng số chứng từ. Và nhớ tên con họ. Câu sau quan trọng nhất.'],
        ] },
        { t: '"Nhưng họ chậm thì mình trễ mà anh."', fx: { rel: { sang: 1 } }, then: [
          ['sang', 'Ừ. Rồi mình cũng chậm với khách khác. Nghề này là một chuỗi người chậm nối nhau.'],
          ['think', 'Một chuỗi cung ứng của sự chậm.'],
        ] },
      ] },
    ] },
    { who: 'diep', obj: 'Chứng từ Phúc Lộc vừa về: xem cùng chị Diệp', time: '14:30', scene: [
      ['diep', 'Chứng từ Phúc Lộc về rồi. Em xem giúp chị.'],
      ['nar', 'Hai mươi tấm ảnh chụp hoá đơn. Tất cả nghiêng 45 độ. Một tấm có ngón tay cái che số tiền. Một tấm có con mèo.'],
      { c: 'au_pbc_photo', o: [
        { t: 'Xin lại bản PDF gốc, ghi rõ từng số hoá đơn.', fx: { uy: 2, rel: { diep: 2 } }, then: [
          ['diep', 'Đúng. Ảnh nghiêng không phải chứng từ. Ảnh có mèo càng không.'],
        ] },
        { t: 'Xoay ảnh, phóng to, tick tạm màu cam.', fx: { nl: -4, rel: { diep: 1 } }, then: [
          ['diep', 'Cam là hỏi lại. Em dùng đúng màu. Chị tạm tha.'],
        ] },
        { t: 'Tick đỏ luôn cho nhanh.', fx: { dr: 2, rel: { diep: -2 } }, then: [
          ['diep', 'Đỏ là đã đối chiếu chứng từ GỐC. Đây là ảnh có ngón tay cái. Chị cần ngồi một mình.'],
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo gọi vào phòng review', time: '16:00', scene: [
      { if: F('hong_angry'), then: [
        ['thao', 'Anh Quang, CFO Phúc Lộc, vừa gọi chị. Anh ấy nói "các em hạch sách". Em đã nói gì với chị Hồng vậy?'],
        { c: 'au_pbc_thao', o: [
          { t: 'Kể thật, xin lỗi, nhờ chị gọi lại cho khách.', fx: { rel: { thao: 1, hong: 1 }, set: { hong_soothed: true } }, then: [
            ['thao', 'Nói đúng nhưng sai lúc. Chị gọi lại. Lần sau em đúng thì đúng nhẹ nhàng thôi.'],
          ] },
          { t: '"Em chỉ nói đúng hợp đồng ạ."', fx: { uy: -2, rel: { thao: -1 } }, then: [
            ['thao', 'Đúng. Và giờ chị mất một tiếng để đúng hộ em với khách.'],
          ] },
        ] },
      ], else: [
        { if: F('pbc_polite'), then: [
          ['thao', 'Chị Hồng vừa gửi tám mục. Tám mục trong một ngày. Năm ngoái tám mục mất ba tuần. Em làm gì vậy?'],
          ['me', 'Dạ em chia nhỏ danh sách cho chị ấy ạ.'],
          ['thao', 'Chia nhỏ. Ừ. Có những thứ đơn giản mà mười năm không ai nghĩ ra.'],
          { fx: { uy: 3, rel: { thao: 2 } } },
        ], else: [
          ['thao', 'Khách gửi thêm được vài mục. Ổn. Mai nhắc tiếp nhé. Nhắc lần bốn.'],
          ['think', 'PBC là một bài hát có điệp khúc dài nhất thế giới.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `PBC lần ba. ${s.flags.pbc_polite ? 'Mình chia 42 dòng thành ba đợt, chị Hồng gửi ngay tám mục.' : s.flags.hong_angry ? 'Mình trích hợp đồng với chị Hồng. Anh CFO gọi chị Thảo. Đúng mà vẫn sai.' : 'Khách gửi thêm vài mục. Mai nhắc lần bốn.'} Hai mươi tấm ảnh chụp nghiêng 45 độ, một tấm có mèo.`,
};

const STOCK = {
  id: 'stock_count', minDay: 5, maxDay: 9, title: 'Kho lạnh 2 giờ sáng',
  intro: 'Đêm qua, 1:30 sáng. Kho lạnh âm mười tám độ của Phúc Lộc Foods ở khu công nghiệp ngoại thành. Anh Khoa "kẹt việc". Bạn đi một mình, với một tập phiếu kiểm kê và một cây bút bị đông đá.\n\n8:30 sáng nay, bạn có mặt ở văn phòng, mang theo biên bản kiểm kê và một ngón tay vẫn còn tê.',
  steps: [
    { who: 'obj:desk', obj: 'Ngồi xuống bàn, viết lại biên bản kiểm kê đêm qua', time: '08:30', scene: [
      ['nar', 'Bạn mở tập phiếu. Mực nhoè vì hơi lạnh. Bạn nhớ lại đêm qua…'],
      { if: F('tuan_tips'), then: [['think', 'May mà nghe Tuấn: balo lúc nào cũng có áo khoác. Bảo vệ kho mặc áo mưa, nhìn mình đầy ghen tị.'], { fx: { nl: 5 } }],
        else: [['think', 'Cái áo khoác anh Khoa dặn hôm thứ Hai đang treo ở nhà. Ba tiếng trong kho lạnh, mình hiểu cảm giác của một con cá đông lạnh.'], { fx: { nl: -8 } }] },
      ['nar', '2:10 sáng. Chú Tư, thủ kho, cầm tờ danh sách đã điền sẵn số lượng.'],
      ['tu', 'Khỏi đếm con ơi, chú nhớ hết. Không đếm thì kịp về ngủ trước khi gà gáy.'],
      { c: 'au_sc_count', o: [
        { t: 'Yêu cầu mở thùng kiểm tra ngẫu nhiên.', fx: { nl: -12 }, then: [
          { mini: STOCK_MINI,
            good: [
              ['nar', 'Pallet bạn chọn đều có chuyện. Lần theo đó, bạn gõ cả dãy B. B7 kêu "bộp": bốn mươi thùng rỗng xếp ngoài cùng như một bức tường. Chú Tư gãi đầu rất lâu.'],
              ['think', 'Bốn mươi thùng không khí. Đông lạnh rất chuyên nghiệp.'],
              { fx: { uy: 4, set: { count_strict: true, b7_found: true } } },
            ],
            bad: [
              ['nar', 'Bạn mở ba pallet. Cả ba đầy cá, đúng số. Chú Tư nhìn bạn như nhìn một đứa cháu hư.'],
              ['tu', 'Thấy chưa con. Chú nói chú nhớ mà.'],
              { fx: { nl: -5, set: { count_strict: true } } },
            ],
          },
        ] },
        { t: 'Ghi nhận theo số chú Tư đọc.', fx: { nl: 5, set: { count_lazy: true } }, then: [
          ['tu', 'Ngoan. Về sớm nha con.'],
          ['nar', '3:05 sáng bạn đã về tới nhà. Biên bản đẹp như in. Quá đẹp.'],
        ] },
        { t: 'Chụp ảnh từng pallet làm bằng chứng.', fx: { nl: -8, set: { count_photo: true } }, then: [
          ['nar', 'Bạn chụp 214 ảnh. Pin hết ở ảnh 215. Bạn lỡ chuyến xe về, ngồi chờ ở phòng bảo vệ tới 5 giờ.'],
          ['tu', 'Con chụp làm gì nhiều thế. Cá có đẹp đâu.'],
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Nộp biên bản cho anh Khoa', time: '09:30', scene: [
      ['khoa', 'Em… đi một mình à. Anh xin lỗi. Anh nói "kẹt việc". Thật ra anh ngủ quên. Lần đầu tiên từ tháng Một.'],
      { if: F('tie_thao_khoa'), then: [['khoa', 'Hồi anh với chị Thảo cùng đợt intern, tụi anh đi kho lạnh với nhau. Chị ấy mở thùng, anh đếm. Giờ chị ấy là manager. Anh vẫn đếm.']] },
      { if: F('b7_found'), then: [['khoa', 'Bốn mươi thùng rỗng ở B7? Em làm anh tỉnh hơn ba ly cà phê.'], { fx: { rel: { khoa: 2 } } }], else: [
        { if: F('count_lazy'), then: [['khoa', 'Khớp một trăm phần trăm? Kho lạnh nào cũng lệch. Kho khớp hoàn toàn là kho anh sợ nhất.']],
          else: [['khoa', 'Có ảnh, có biên bản. Ảnh không mở được thùng, nhưng ít ra có bằng chứng em đã ở đó.']] },
      ] },
      { c: 'au_sc_khoa', o: [
        { t: '"Không sao anh. Anh ngủ được là tốt rồi."', fx: { rel: { khoa: 3 }, set: { khoa_trust: true } }, then: [
          ['khoa', '…Cảm ơn em. Người ta hay nói "lần sau anh đi nhé". Em là người đầu tiên nói "ngủ được là tốt".'],
          ['nar', 'Anh Khoa đẩy chậu xương rồng nhỏ sang phía bạn một chút. Có vẻ đó là cử chỉ thân thiện.'],
        ] },
        { t: '"Lần sau anh đi cùng em nhé."', fx: { uy: 1, rel: { khoa: 1 } }, then: [
          ['khoa', 'Ừ. Lần sau anh đi. Anh sẽ đặt mười cái báo thức.'],
        ] },
        { t: 'Báo chị Thảo chuyện anh Khoa vắng mặt.', fx: { rel: { thao: 1, khoa: -3 }, set: { told_on_khoa: true } }, then: [
          ['khoa', 'Ừ. Em làm đúng quy trình. Anh không giận. Anh chỉ… ghi nhận.'],
          ['think', '"Ghi nhận" ở đây nghe như bút toán điều chỉnh.'],
        ] },
      ] },
    ] },
    { who: 'lua', obj: 'Cô Lụa vẫy gọi: trà gừng', time: '11:00', scene: [
      ['lua', 'Cháu đi kho về hả? Mặt xanh như anh Khoa rồi. Uống trà gừng đi. Mùa kiểm kê năm nào cô cũng nấu.'],
      { c: 'au_sc_tea', o: [
        { t: 'Uống một ly, ngồi với cô năm phút.', fx: { nl: 12, rel: { lua: 2 } }, then: [
          ['lua', 'Ba mươi năm cô giữ con dấu ở đây. Đứa nào đi kho về mà còn cười được là ở lâu.'],
        ] },
        { t: 'Xin thêm một ly mang cho anh Khoa.', fx: { nl: 6, rel: { lua: 1, khoa: 2 } }, then: [
          ['nar', 'Anh Khoa nhận ly trà, nhìn nó một lúc như nhìn một tia nắng.'],
          ['khoa', 'Ấm. Lâu rồi anh không cầm cái gì ấm.'],
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo đọc biên bản kiểm kê', time: '14:00', scene: [
      { if: F('b7_found'), then: [
        ['thao', 'Bốn mươi thùng rỗng. Đây là phát hiện thật. Chị sẽ đề xuất điều chỉnh tồn kho và đưa vào thư quản lý.'],
        ['thao', 'Em đi một mình mà vẫn mở thùng. Chị ghi nhận. Theo nghĩa tốt.'],
        { fx: { uy: 4, rel: { thao: 2 } } },
      ], else: [
        { if: F('count_lazy'), then: [
          ['thao', 'Biên bản đẹp. Đẹp tới mức chị lo. Em có mở thùng nào không?'],
          { c: 'au_sc_lazy', o: [
            { t: 'Nói thật: em ghi theo số thủ kho đọc.', fx: { uy: -1, rel: { thao: 1 }, set: { count_confessed: true } }, then: [
              ['thao', 'Thành thật thì còn cứu được. Tuần sau đi lại, đếm chọn mẫu. Lần này Khoa đi cùng. Chị đặt báo thức cho Khoa.'],
            ] },
            { t: '"Dạ có ạ."', fx: { dr: 3, set: { count_lied: true } }, then: [
              ['thao', 'Ừ. Chị tin em.'],
              ['think', 'Câu "chị tin em" chưa bao giờ đáng sợ như vậy.'],
            ] },
          ] },
        ], else: [
          ['thao', 'Có ảnh, có biên bản, có chọn mẫu. Đủ dùng. Lần sau mang sạc dự phòng.'],
          { fx: { uy: 2, rel: { thao: 1 } } },
        ] },
      ] },
    ] },
    { who: 'call:quang', obj: 'CFO Phúc Lộc gọi Teams (nghe máy)', time: '15:30', when: F('b7_found'),
      call: { title: 'Phúc Lộc Foods · CFO · "Anh hỏi thăm"', people: ['quang', 'me'] }, scene: [
      ['quang', 'Chào em. Anh Quang, CFO Phúc Lộc. Nghe nói đêm qua em mở thùng hàng của chú Tư?'],
      ['quang', 'Em làm kỹ quá. Anh thích người kỹ. Mấy thùng rỗng đó là thùng… cân bằng nhiệt. Em hiểu mà.'],
      { c: 'au_sc_quang', o: [
        { t: '"Dạ, em ghi nhận giải thích của anh vào biên bản và báo anh Khoa ạ."', fx: { uy: 3, rel: { quang: -1 }, set: { quang_wary: true } }, then: [
          ['quang', '…Ừ. Ghi nhận đi. Em nói chuyện y như sếp em.'],
        ] },
        { t: '"Thùng cân bằng nhiệt ạ? Em chưa nghe bao giờ."', fx: { dr: 2, rel: { quang: -2 } }, then: [
          ['quang', 'Giờ em nghe rồi đấy.'],
          ['think', 'Ngành đông lạnh có nhiều phát minh mà sách không dạy.'],
        ] },
        { t: '"Dạ em hiểu ạ."', fx: { rel: { quang: 2 }, set: { quang_soft: true } }, then: [
          ['quang', 'Tốt. Người hiểu chuyện thì đi xa. Anh sẽ nhớ em.'],
          ['think', 'Câu đó vừa là lời khen, vừa là… gì đó khác.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Kiểm kê kho lạnh lúc 2 giờ sáng. ${s.flags.b7_found ? 'Pallet B7: bốn mươi thùng rỗng. Mình mở được nó.' : s.flags.count_lazy ? 'Mình ghi theo số chú Tư đọc. Biên bản đẹp. Quá đẹp.' : 'Mình chụp 214 ảnh, mở vài thùng.'} ${s.flags.khoa_trust ? 'Anh Khoa ngủ quên lần đầu từ tháng Một. Mình bảo ngủ được là tốt.' : 'Anh Khoa ngủ quên.'} Ngón tay vẫn tê.`,
};

const GHOST = {
  id: 'ghost_invoice', minDay: 8, maxDay: 11, title: 'Hoá đơn ma 2,1 tỷ',
  intro: 'Anh Khoa giao bạn chọn mẫu 25 khoản "chi phí khác" của Phúc Lộc để đối chiếu chứng từ.\n\nKhoản số 17: "Chi phí tư vấn chiến lược theo chỉ đạo — Công ty TNHH Tư Vấn Sao Mai Rực Rỡ — 2.100.000.000 đồng". Diễn giải đúng chín chữ. Không chữ nào là "hợp đồng".',
  steps: [
    { who: 'khoa', obj: 'Anh Khoa giao 25 mẫu chi phí khác', time: '09:00', scene: [
      ['khoa', 'Hai lăm mẫu, vouching về chứng từ gốc. Mẫu nào thiếu thì tick cam, đừng tick đỏ cho đẹp.'],
      ['khoa', 'Mẫu 17 thì… em cứ tra hoá đơn điện tử trên cổng của cơ quan thuế trước. Anh không nói gì thêm. Anh chỉ nói thế thôi.'],
      ['think', 'Anh ấy nói "không nói gì thêm" bằng giọng của người biết rất nhiều.'],
    ] },
    { who: 'obj:desk', obj: 'Tra cứu hoá đơn điện tử của mẫu 17', time: '10:00', scene: [
      ['nar', 'Bạn nhập mã số thuế người bán, ký hiệu, số hoá đơn. Trang web quay vòng tròn mười giây.'],
      { mini: GHOST_MINI,
        good: [['nar', 'Kết quả: "Người bán đã ngừng hoạt động". Bạn chụp màn hình, ghi ngày giờ tra, lưu vào WP đúng thư mục. Tim đập hơi nhanh.'], { fx: { uy: 3, set: { ghost_checked: true, ghost_shot: true } } }],
        bad: [['nar', 'Bạn nhập nhầm ký hiệu hai lần. Lần thứ ba mới ra: "Người bán đã ngừng hoạt động". Bạn quên chụp màn hình.'], { fx: { nl: -4, set: { ghost_checked: true } } }],
      },
      ['nar', '(Thủ tục trong game được đơn giản hoá, thông tin giải trí, không phải tư vấn pháp lý.)'],
    ] },
    { who: 'tuan', obj: 'Tuấn ra hiệu gọi bạn lại gần', time: '11:30', scene: [
      ['tuan', 'Mẫu 17 hả? (hạ giọng) Đấy là "chi phí của anh Giám đốc". Ai cũng biết. Không ai nói.'],
      ['tuan', 'Năm ngoái anh làm phần này. Anh tick "đã kiểm tra". Rồi mất ngủ một tuần. Busy season thì mất ngủ là chuyện thường, nên không ai để ý.'],
      { c: 'au_gi_tuan', o: [
        { t: '"Sao năm ngoái không ai ghi vào WP hả anh?"', fx: { rel: { tuan: 1 } }, then: [
          ['tuan', 'Vì năm ngoái làm thế nào thì năm nay làm thế. Câu thần chú. Thần chú không cần giải thích.'],
        ] },
        { t: '"Anh có hối hận không?"', fx: { rel: { tuan: 2 }, set: { tuan_regret: true } }, then: [
          ['tuan', '…Có. Nhưng đừng kể ai. Hối hận cũng là thông tin mật.'],
        ] },
      ] },
    ] },
    { who: 'call:hong', obj: 'Gọi chị Hồng xin chứng từ mẫu 17', time: '14:00',
      call: { title: 'Phúc Lộc · hỏi chứng từ mẫu 17', people: ['hong', 'me'] }, scene: [
      { if: F('hong_angry'), then: [['hong', 'Lại em à. Hỏi gì hỏi nhanh.']], else: [['hong', 'Em hả. Chị nghe đây.']] },
      ['me', 'Dạ chị cho em xin hợp đồng, biên bản nghiệm thu và sản phẩm tư vấn của khoản Sao Mai Rực Rỡ ạ.'],
      ['nar', 'Im lặng. Lâu hơn bình thường. Bạn nghe tiếng chị Hồng đóng cửa phòng.'],
      { c: 'au_gi_hong', o: [
        { t: '"Chị ơi, có chuyện gì chị cần nói riêng với em không?"', when: (r) => !r.flags.hong_angry || !!r.flags.hong_soothed, fx: { rel: { hong: 3 }, set: { hong_ally: true } }, then: [
          ['hong', '…Chị không ký cái đó. Người ta ký thay, rồi bảo chị hạch toán. Chị có giữ email. Chị sợ.'],
          ['hong', 'Em đừng nói là chị nói. Chị gửi em email đó. Em dùng sao thì dùng, chỉ đừng để chị mất việc.'],
          ['think', 'Hoá đơn ma có một người thật đứng phía sau. Người đó đang sợ.'],
        ] },
        { t: 'Gửi email yêu cầu chính thức, cc anh Khoa.', fx: { uy: 2 }, then: [
          ['hong', 'Ừ. Gửi email đi. Chị sẽ… chuyển lên trên.'],
          ['think', '"Chuyển lên trên" là nơi chứng từ đi vào và không bao giờ trở ra.'],
        ] },
        { t: '"Thôi không có cũng được ạ, em ghi chú lại."', fx: { set: { gi_soft: true } }, then: [
          ['hong', '(thở ra) Ừ. Cảm ơn em.'],
          ['think', 'Mình vừa làm ai đó nhẹ người. Không chắc là đúng người.'],
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Quyết định ghi gì vào WP mẫu 17', time: '15:30', scene: [
      ['khoa', 'Mẫu 17 em ghi thế nào?'],
      { if: F('hong_ally'), then: [['think', 'Mình có email chị Hồng gửi. Có tên người ký thay.']] },
      { c: 'au_gi_wp', o: [
        { t: 'Ghi đầy đủ: kết quả tra cứu, thiếu hợp đồng, đề xuất đưa vào thư quản lý.', fx: { uy: 4, rel: { khoa: 2, thao: 1 }, set: { ghost_reported: true } }, then: [
          ['khoa', 'Ừ. Ghi thế. Anh đẩy lên chị Thảo. Năm ngoái anh không dám. Năm nay… có em ghi rồi.'],
          { if: F('hong_ally'), then: [['khoa', 'Còn email kia: mình bảo vệ nguồn. Không ai cần biết chị Hồng gửi.']] },
        ] },
        { t: 'Tick "đã kiểm tra ✓" như năm ngoái.', fx: { dr: 4, set: { ghost_hidden: true } }, then: [
          ['khoa', '…Ừ. Em quyết vậy à.'],
          ['nar', 'Anh Khoa quay lại màn hình. Chậu xương rồng có vẻ héo hơn một chút.'],
        ] },
        { t: 'Tick cam "chờ chứng từ", nhờ chị Thảo quyết.', fx: { uy: 2, rel: { thao: 1 }, set: { ghost_reported: true, ghost_escalated: true } }, then: [
          ['khoa', 'Đẩy lên manager. An toàn. Chị Thảo sẽ đọc lúc 3 giờ sáng và em sẽ biết kết quả lúc 3 giờ 01.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Mẫu 17: hoá đơn 2,1 tỷ của một công ty đã ngừng hoạt động. ${s.flags.ghost_hidden ? 'Mình tick "đã kiểm tra" như năm ngoái. Chậu xương rồng của anh Khoa héo thêm.' : 'Mình ghi hết vào WP.'} ${s.flags.hong_ally ? 'Chị Hồng không ký khoản đó. Chị ấy sợ.' : ''}`,
};

const VYCOPY = {
  id: 'vy_copy', minDay: 10, maxDay: 15, title: 'Bản copy năm ngoái',
  intro: '8:45 sáng, Vy tuyên bố đã xong toàn bộ phần phải trả người bán. Phần đó anh Khoa ước tính ba ngày.\n\nTrong văn phòng có hai loại người: người đang ngạc nhiên, và chị Diệp.',
  steps: [
    { who: 'vy', obj: 'Vy có tin vui muốn khoe', time: '08:45', scene: [
      ['vy', 'Em xong phần phải trả rồi ạ! Bạn ơi, bạn xong phải thu chưa?'],
      ['me', 'Mình mới tới mẫu thứ chín.'],
      ['vy', 'Ồ. Mình làm cách khác. Hiệu quả hơn.'],
      { if: F('tie_vy_phong'), then: [['vy', 'Chú mình bảo: kiểm toán giỏi là kiểm toán nhanh. Chú mình là… thôi, không quan trọng.']] },
      { c: 'au_vc_vy', o: [
        { t: '"Hiệu quả kiểu gì, chỉ mình với?"', fx: { rel: { vy: 1 } }, then: [['vy', 'Bí mật. Gợi ý: năm nào thì ngân hàng cũng là ngân hàng.']] },
        { t: '"Chúc mừng Vy."', fx: { rel: { vy: 2 } }, then: [['vy', 'Cảm ơn! Mình nghĩ mình sẽ được giữ lại. Không có ý gì đâu.']] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo họp nhanh cả team', time: '09:30', scene: [
      ['thao', 'Mọi người, Vy xong phải trả trong một buổi. Nhanh. Rất nhanh.'],
      ['thao', '{ten}, em thì sao? Phải thu tới đâu rồi?'],
      { c: 'au_vc_thao', o: [
        { t: '"Dạ em ở mẫu chín, em làm kỹ từng chứng từ ạ."', fx: { uy: 1, rel: { thao: 1 } }, then: [
          ['thao', 'Kỹ là tốt. Nhưng busy season không trả lương cho sự kỹ. À có, nhưng ít.'],
        ] },
        { t: '"Dạ chiều nay em xong ạ."', fx: { nl: -10, set: { vc_rush: true } }, then: [
          ['thao', 'Tốt. Chị ghi nhận lời hứa.'],
          ['think', 'Mình vừa tự tạo ra một deadline. Người ta gọi đây là "chủ động".'],
        ] },
      ] },
    ] },
    { who: 'diep', obj: 'Chị Diệp nhờ ref chéo WP của Vy', time: '11:00', scene: [
      ['diep', 'Em ref chéo WP phải trả của Vy sang lead schedule giúp chị. Chị thấy có gì đó… sai màu.'],
      { mini: COPY_MINI,
        good: [
          ['diep', 'Đúng. Đây là WP năm ngoái, đổi mỗi số dư. Tick cam này là màu của Quang Anh, intern năm ngoái. Quang Anh nghỉ rồi.'],
          ['think', 'Một WP có chữ ký của người đã rời công ty. Hồn ma trong ổ chung.'],
          { fx: { uy: 2, rel: { diep: 2 }, set: { vy_evidence: true } } },
        ],
        bad: [['diep', 'Em không thấy gì à? Thôi được. Chị tự xem. Chị chỉ có cảm giác thôi.'], { fx: { rel: { diep: -1 } } }],
      },
    ] },
    { who: 'tuan', obj: 'Tuấn kéo bạn ra cửa sổ nói chuyện', time: '13:30', scene: [
      ['tuan', 'Copy WP năm ngoái là truyền thống. Copy cả lỗi năm ngoái là… truyền thống xấu.'],
      ['tuan', 'QC bắt thì cả team dính. Em báo thì thành người "đâm sau lưng". Em im thì là đồng phạm có lương thấp.'],
      ['think', 'Một ma trận đẹp. Không ô nào màu xanh.'],
      { fx: { nl: -2 } },
    ] },
    { who: 'vy', obj: 'Nói chuyện với Vy, hoặc nói chuyện về Vy', time: '15:00', scene: [
      ['vy', 'Bạn nhìn gì mình vậy? À, bạn đang ref WP của mình hả. Đẹp không?'],
      { c: 'au_vc_main', o: [
        { t: 'Nhắc riêng Vy: "File của Vy là của năm ngoái. QC sẽ bắt đấy."', fx: { rel: { vy: 2 }, set: { vy_fixed: true } }, then: [
          ['vy', '…Bạn biết à.'],
          ['vy', 'Mẹ mình làm kế toán trưởng. Từ nhỏ mình bị dạy phải nhanh hơn người khác. Mình… sẽ sửa. Tối nay.'],
          ['nar', 'Vy ở lại tới 22 giờ. Lần đầu tiên Vy không nói "em xong rồi".'],
        ] },
        { t: 'Báo anh Khoa, kèm bằng chứng.', fx: { uy: 3, rel: { vy: -3, khoa: 1, tuan: -1 }, set: { reported_vy: true } }, then: [
          { if: F('vy_evidence'), then: [['khoa', 'Có bằng chứng. Ok, anh xử lý. Nhẹ nhàng thôi.']],
            else: [['khoa', 'Em chắc không? Không có bằng chứng thì anh không làm gì được. Anh ghi nhận… cảm giác của em.']] },
          ['nar', 'Một tiếng sau, Vy đi ngang bàn bạn mà không nhìn. Group "Hội Tick Mỏi Tay" im lặng lạ thường.'],
        ] },
        { t: 'Mở file năm ngoái của mình ra, làm cho kịp Vy.', fx: { nl: 10, dr: 3, set: { copied_too: true } }, then: [
          ['nar', 'Bạn xong phải thu lúc 16:10. Nhanh. Rất nhanh. Bạn đổi số dư và… chắc là đổi cả ngày ký.'],
          ['think', 'Năm ngoái làm thế nào thì năm nay làm thế. Câu thần chú hoạt động. Tạm thời.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Vy xong phải trả trong một buổi bằng file năm ngoái. ${s.flags.vy_fixed ? 'Mình nhắc riêng. Vy ở lại sửa tới 22 giờ.' : s.flags.reported_vy ? 'Mình báo anh Khoa. Đúng. Nhưng group chat im lặng.' : s.flags.copied_too ? 'Mình cũng copy. Nhanh thật. Hơi sợ.' : ''}`,
};

const GIFT = {
  id: 'cfo_gift', minDay: 12, maxDay: 17, title: 'Chút lộc của anh CFO',
  intro: 'Sáng nay quầy văn thư có một hộp quà to bằng cái lò vi sóng. Giấy gói đỏ, nơ vàng, thiệp ghi: "Gửi em intern chăm chỉ — Phúc Lộc Foods".\n\nBên trong: khô mực, cá chỉ vàng, và một phong bì đỏ dày hơn mức "chút lộc".',
  steps: [
    { who: 'lua', obj: 'Cô Lụa gọi: có quà gửi bạn', time: '09:00', scene: [
      ['lua', 'Cháu ơi, quà của cháu. Cô không ký nhận giùm đâu nhé. Cô giữ con dấu ba mươi năm không phải để ký nhận khô mực.'],
      ['nar', 'Phong bì đỏ ghi: "Chút lộc đầu xuân". Còn lâu mới tới xuân.'],
    ] },
    { who: 'call:quang', obj: 'Anh Quang (CFO Phúc Lộc) gọi Teams', time: '09:30',
      call: { title: 'Phúc Lộc Foods · "Anh hỏi thăm thôi"', people: ['quang', 'me'] }, scene: [
      ['quang', 'Em nhận quà chưa? Chút cá khô nhà làm thôi. Anh quý người làm việc tử tế.'],
      { if: F('ghost_reported'), then: [['quang', 'À, anh nghe nói em đang hỏi về khoản tư vấn Sao Mai. Em trẻ, chưa hiểu hết chuyện kinh doanh. Anh không trách.']] },
      { if: F('ghost_hidden'), then: [['quang', 'Khoản tư vấn kia em xử lý gọn gàng. Anh cảm ơn. Người hiểu chuyện thì đi xa.']] },
      ['quang', 'Mà nói thật: ra trường về bên anh làm kế toán tổng hợp không? Lương gấp rưỡi bên đó. Anh nói thật đấy.'],
      { c: 'au_cg_call', o: [
        { t: '"Dạ em cảm ơn, nhưng em đang kiểm toán bên anh nên em không bàn chuyện này được ạ."', fx: { uy: 3, rel: { quang: -1 } }, then: [
          ['quang', 'Ừ. Nguyên tắc. Anh thích. Anh sẽ hỏi lại khi em hết nguyên tắc.'],
        ] },
        { t: '"Dạ em xin suy nghĩ ạ."', fx: { rel: { quang: 2 }, set: { cfo_offer: true } }, then: [
          ['quang', 'Cứ suy nghĩ. Cửa bên anh luôn mở. Cửa kho thì… tùy lúc.'],
          ['think', 'Lời mời làm việc từ khách hàng mình đang kiểm toán. Chắc phải khai báo cái này.'],
        ] },
        { t: 'Cười trừ cho qua.', fx: { dr: 1 }, then: [
          ['quang', 'Cười là đồng ý một nửa. Anh hiểu.'],
        ] },
      ] },
    ] },
    { who: 'tuan', obj: 'Tuấn nhìn hộp quà, lắc đầu', time: '10:30', scene: [
      ['tuan', 'Hộp to thế. Năm ngoái anh nhận một hộp khô mực. Chị My phỏng vấn anh hai tiếng. Hộp khô mực đắt nhất đời anh.'],
      ['tuan', 'Quy định là không nhận quà có giá trị từ khách đang kiểm toán. "Có giá trị" là bao nhiêu thì… chị My quyết.'],
    ] },
    { who: 'obj:desk', obj: 'Quyết định số phận hộp quà', time: '14:00', scene: [
      ['nar', 'Hộp quà nằm dưới gầm bàn. Mùi cá chỉ vàng lan ra. Mèo Số Dư ngồi canh như một kiểm soát viên nội bộ.'],
      { c: 'au_cg_main', o: [
        { t: 'Trả lại cả hộp lẫn phong bì, kèm thư cảm ơn, báo chị Thảo.', fx: { uy: 5, rel: { thao: 2, quang: -1, lua: 1 }, set: { gift_refused: true } }, then: [
          ['nar', 'Cô Lụa đóng dấu công văn trả quà. Lần đầu tiên con dấu được dùng cho việc trả lại.'],
          ['lua', 'Cô thích công văn này. Cô sẽ lưu riêng.'],
        ] },
        { t: 'Giữ hộp khô mực chia cả team, trả lại phong bì.', fx: { dr: 2, rel: { tuan: 2, diep: 1 }, set: { gift_half: true } }, then: [
          ['nar', 'Cả team ăn khô mực với trà gừng. Phong bì được trả về kèm lời cảm ơn rất dài. Hộp khô mực hết trong mười phút.'],
          ['diep', 'Ngon. Nhưng chị không ăn miếng nào. Chị chỉ… kiểm tra chất lượng.'],
        ] },
        { t: 'Giữ hết. Phong bì có hai triệu.', fx: { money: 2_000_000, dr: 4, set: { took_gift: true } }, then: [
          ['nar', 'Bạn cất phong bì vào balo. Hai triệu. Bằng hai tháng phụ cấp mức một triệu.'],
          ['think', 'Không ai thấy. Trừ Mèo Số Dư. Và camera hành lang. Và cô Lụa.'],
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo hỏi nhanh về bản cam kết độc lập', time: '15:30', scene: [
      ['thao', 'Chị nghe nói Phúc Lộc gửi quà cho đoàn. Ai nhận gì thì khai vào bản cam kết độc lập nhé. Chị hỏi nhanh thôi.'],
      { if: F('took_gift'), then: [
        { c: 'au_cg_confess', o: [
          { t: 'Khai thật, nộp lại phong bì.', fx: { money: -2_000_000, uy: 2, rel: { thao: 2 }, set: { took_gift: false, gift_confessed: true } }, then: [
            ['thao', 'Khai muộn còn hơn để QC tìm ra. Chị ghi nhận. Lần này theo nghĩa tốt. Gần như tốt.'],
          ] },
          { t: '"Dạ em không nhận gì ạ."', fx: { dr: 5, set: { lie_gift: true } }, then: [
            ['thao', 'Ừ. Tốt.'],
            ['think', 'Phong bì trong balo nặng hơn hai triệu.'],
          ] },
        ] },
      ], else: [
        { if: F('gift_refused'), then: [['thao', 'Công văn trả quà của em, cô Lụa forward cho chị rồi. Đẹp. Chị sẽ dùng làm mẫu cho cả phòng.'], { fx: { rel: { thao: 1 } } }],
          else: [['thao', 'Khô mực thì chị cho qua. Lần sau hỏi chị trước khi mở hộp.']] },
      ] },
      { if: F('cfo_offer'), then: [['think', 'Còn lời mời của anh Quang. Mình chưa khai. Chưa.']] },
    ] },
  ],
  diary: (s) => `Phúc Lộc gửi quà. ${s.flags.gift_refused ? 'Mình trả lại hết, cô Lụa đóng dấu công văn trả quà.' : s.flags.gift_half ? 'Cả team ăn khô mực, phong bì trả về.' : s.flags.gift_confessed ? 'Mình giữ phong bì một tiếng rưỡi rồi khai. Hai triệu đi rồi về rồi đi.' : s.flags.lie_gift ? 'Mình giữ hai triệu và nói "không nhận gì". Ngủ không ngon.' : ''} ${s.flags.cfo_offer ? 'Anh Quang mời mình về làm. Mình chưa khai.' : ''}`,
};

const CONFIRM = {
  id: 'bank_confirm', minDay: 15, maxDay: 19, title: 'Ba mươi lá thư, bốn hồi âm',
  intro: 'Hai tuần trước, đoàn gửi 30 thư xác nhận số dư tới ngân hàng và khách nợ của Phúc Lộc. Hôm nay có 4 thư quay về. Một thư ghi sai tên công ty. Một thư là tờ rơi quảng cáo.\n\nChị Thảo muốn tỷ lệ phản hồi 70% trước thứ Sáu tuần sau.',
  steps: [
    { who: 'thao', obj: 'Chị Thảo hỏi về thư xác nhận', time: '09:00', scene: [
      ['thao', 'Bốn trên ba mươi. Mười ba phần trăm. Chị cần bảy mươi. Chị hỏi nhanh thôi: em có kế hoạch gì?'],
      { c: 'au_bc_plan', o: [
        { t: '"Em gọi từng khách nợ nhắc ạ."', fx: { rel: { thao: 1 } }, then: [
          ['thao', 'Được. Gọi lịch sự. Họ không nợ mình cái gì, kể cả câu trả lời.'],
        ] },
        { t: '"Ai không trả lời, em làm thủ tục thay thế: kiểm tra tiền thu sau ngày khoá sổ ạ."', fx: { uy: 3, rel: { thao: 2 }, set: { bc_alt_plan: true } }, then: [
          ['thao', 'Em đọc sách à. Tốt. Đó là thủ tục thay thế. Làm cả hai.'],
        ] },
      ] },
    ] },
    { who: 'lua', obj: 'Qua cô Lụa xem thư hồi âm', time: '10:00', scene: [
      ['lua', 'Thư về phải qua cô. Đây, sáu thư mới. Một thư ghi "Kính gửi Công ty Cân Đổ". Thiếu chữ "i". Nghe như công ty sắp sập.'],
      { mini: CONFIRM_MINI,
        good: [['lua', 'Cháu nhìn phong bì giỏi đấy. Cô làm văn thư ba mươi năm, cô tin phong bì hơn tin người.'], { fx: { uy: 2, rel: { lua: 1 }, set: { confirm_eye: true } } }],
        bad: [['lua', 'Cái email gửi từ chính khách hàng mà cháu cũng tính à? Cháu cần trà gừng.'], { fx: { rel: { lua: 1 } } }],
      },
    ] },
    { who: 'call:hong', obj: 'Chị Hồng gọi lại về thư xác nhận', time: '11:30',
      call: { title: 'Phúc Lộc · "Để chị gửi giúp"', people: ['hong', 'me'] }, scene: [
      { if: F('hong_ally'), then: [
        ['hong', 'Em ơi. Chị nói nhỏ. Sếp chị bảo chị "gửi giúp" thư xác nhận cho mấy khách nợ, rồi chuyển lại cho em. Em đừng nhận nhé. Chị không muốn làm thế.'],
        { fx: { rel: { hong: 1 } } },
      ], else: [
        ['hong', 'Mấy khách nợ đó chị có email hết. Để chị gửi giúp cho nhanh, chị nhận về rồi chuyển em. Em đỡ phải gọi.'],
      ] },
      { c: 'au_bc_hong', o: [
        { t: '"Dạ cảm ơn chị, nhưng thư xác nhận phải đi thẳng từ bên em ạ."', fx: { uy: 3, rel: { hong: 1 } }, then: [
          ['hong', 'Ừ. Chị biết. Chị chỉ phải hỏi thôi.'],
        ] },
        { t: '"Dạ vâng, chị gửi giúp em với ạ."', when: (r) => !r.flags.hong_ally, fx: { dr: 3, set: { confirm_tainted: true } }, then: [
          ['hong', 'Ok em. Chiều chị gửi.'],
          ['think', 'Nhanh quá. Cái gì nhanh quá ở nghề này thường là…'],
        ] },
        { t: 'Tự gọi điện cho từng khách nợ.', fx: { nl: -15, uy: 1, rel: { hong: 1 }, set: { confirm_called: true } }, then: [
          ['nar', 'Bạn gọi 26 cuộc. 9 người nghe máy. 3 người tưởng bạn bán bảo hiểm. 6 người hứa gửi thư.'],
        ] },
      ] },
    ] },
    { who: 'diep', obj: 'Chị Diệp chỉ thủ tục thay thế', time: '14:30', scene: [
      ['diep', 'Thủ tục thay thế đây. Lấy sổ phụ ngân hàng tháng sau, tìm tiền khách nợ trả sau ngày khoá sổ. Có tiền về là có bằng chứng khoản nợ có thật.'],
      ['diep', 'Tick xanh dương: đã lần tới sổ phụ. Tick tím: đã cộng. Không tick đỏ. Em chưa thấy hoá đơn gốc.'],
      { c: 'au_bc_diep', o: [
        { t: 'Làm cùng chị Diệp tới hết danh sách.', fx: { nl: -10, uy: 2, rel: { diep: 2 }, set: { confirm_alt: true } }, then: [
          ['diep', 'Em tick đúng màu. Chị sẽ mua cho em một bộ bút. Đừng nói ai.'],
        ] },
        { t: 'Hỏi chị Diệp vì sao chị mê tick-mark thế.', fx: { rel: { diep: 3 } }, then: [
          ['diep', 'Hồi intern, chị tick sai một cột, cả team làm lại một đêm. Từ đó chị tin màu sắc hơn tin trí nhớ.'],
          ['think', 'Ai trong văn phòng này cũng có một vết sẹo bằng Excel.'],
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Anh Khoa kiểm tra tỷ lệ phản hồi', time: '16:00', scene: [
      { if: F('confirm_tainted'), then: [
        ['khoa', 'Em ơi. Năm thư xác nhận khách nợ này gửi về từ email @phucloc. Từ chính khách hàng. Em biết nghĩa là gì không?'],
        ['khoa', 'Nghĩa là nó vô giá trị. Tệ hơn: nó trông như mình để khách tự xác nhận cho mình.'],
        { fx: { uy: -6, rel: { khoa: -1, thao: -2 } } },
        { c: 'au_bc_taint', o: [
          { t: 'Tự lên báo chị Thảo, đề xuất gửi lại toàn bộ.', fx: { uy: 2, rel: { thao: 1, khoa: 1 }, set: { taint_owned: true } }, then: [
            ['thao', 'Em tự báo. Tốt. Gửi lại từ đầu, lần này qua cô Lụa. Chị sẽ không nhắc lại chuyện này. Trừ ở review.'],
          ] },
          { t: '"Dạ để em lặng lẽ gửi lại, đừng báo chị Thảo ạ."', fx: { dr: 4, rel: { khoa: -1 } }, then: [
            ['khoa', 'Anh không giấu manager. Anh mệt, nhưng anh không giấu. Em tự đi hay anh đi cùng?'],
          ] },
        ] },
      ], else: [
        { if: (r) => !!r.flags.confirm_alt || !!r.flags.confirm_called, then: [
          ['khoa', 'Bảy mươi phần trăm, tính cả thủ tục thay thế. Em làm đúng sách. Anh sẽ khoe chị Thảo là anh dạy.'],
          { fx: { uy: 3, rel: { khoa: 1 } } },
        ], else: [
          ['khoa', 'Mười thư trên ba mươi. Còn xa bảy mươi. Mai em gọi khách nợ và làm thủ tục thay thế nốt nhé.'],
          ['think', 'Thư xác nhận là loại thư duy nhất mà người gửi phải đi đòi hồi âm.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Thư xác nhận: ${s.flags.confirm_tainted ? 'mình để khách "gửi giúp". Năm thư về từ chính email của khách. Bài học đắt.' : s.flags.confirm_called ? 'mình gọi 26 cuộc, ba người tưởng mình bán bảo hiểm.' : 'mình từ chối nhờ khách gửi giúp.'} ${s.flags.confirm_alt ? 'Thủ tục thay thế với chị Diệp: xanh dương, tím, không đỏ.' : ''}`,
};

const TAX = {
  id: 'tax_loan', minDay: 16, maxDay: 20, title: 'Mượn sang Tax "hai ngày"',
  intro: 'Phòng Thuế thiếu người mùa quyết toán. Anh Hiếu đi ngang bàn bạn, dừng lại, nhìn bạn như nhìn một khoản chi phí được trừ.\n\n"Mượn em hai ngày thôi." Ở Cân Đối, "hai ngày" là đơn vị đo thời gian không xác định.',
  steps: [
    { who: 'hieu', obj: 'Anh Hiếu (Tax) muốn mượn bạn', time: '08:45', scene: [
      ['hieu', 'Chào em. Anh Hiếu, Tax. Anh mượn em hai ngày. Theo quy chế điều động nội bộ, Điều 3… à, quy chế đó đang sửa.'],
      ['hieu', 'Việc: rà soát hoá đơn điện tử đầu vào cho một khách sản xuất. 1.400 hoá đơn. Tìm cái sai tên, sai mã số thuế, sai… cảm xúc.'],
      { c: 'au_tl_hieu', o: [
        { t: '"Dạ, được học thêm thuế thì tốt quá ạ."', fx: { rel: { hieu: 2 } }, then: [
          ['hieu', 'Học thuế là học cách sống với thay đổi. Hôm nay đúng, mai có văn bản mới. Như yêu.'],
        ] },
        { t: '"Anh hỏi chị Thảo chưa ạ?"', fx: { uy: 1, rel: { hieu: -1 } }, then: [
          ['hieu', 'Chưa. Hỏi trước thì chị ấy từ chối. Hỏi sau thì chị ấy "ghi nhận". Anh chọn ghi nhận.'],
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo biết chuyện', time: '09:30', scene: [
      ['thao', 'Hiếu mượn em? Không ai hỏi chị. Thôi được. Nhưng phần phải thu của em vẫn hạn thứ Sáu. Chị hỏi nhanh: em làm cả hai được không?'],
      ['think', 'Câu này không có dấu chấm hỏi thật.'],
      { fx: { nl: -3 } },
    ] },
    { who: 'hieu', obj: 'Làm bài test hoá đơn của anh Hiếu', time: '10:30', scene: [
      ['hieu', 'Trước khi đụng vào 1.400 hoá đơn, em làm bài test của anh. Ba câu.'],
      { mini: TAX_QUIZ,
        good: [['hieu', 'Đúng. Nhất là câu hỏi văn bản nào còn hiệu lực. Ở phòng anh, câu đó cứu nhiều mạng hơn mọi công thức.'], { fx: { uy: 2, rel: { hieu: 2 }, set: { tax_skill: true } } }],
        bad: [['hieu', 'Chưa ổn. Nhớ giúp anh một điều: đừng tin một điều khoản ai trích mà không hỏi văn bản nào. Kể cả anh, em cũng đừng tin.'], { fx: { rel: { hieu: 1 } } }],
      },
      ['nar', '(Nội dung thuế trong game được đơn giản hoá, thông tin giải trí, không phải tư vấn pháp lý.)'],
    ] },
    { who: 'sang', obj: 'Anh Sang nhờ xem một hoá đơn "lạ"', time: '13:30', scene: [
      ['sang', 'Em sang Tax hả? Tiện xem giúp anh: chị Bảy tiệm vàng gửi hoá đơn mua máy lạnh, ghi tên người mua là tên… chồng chị ấy.'],
      { c: 'au_tl_sang', o: [
        { t: 'Hỏi anh Hiếu cách xử lý đúng quy trình.', fx: { rel: { sang: 1, hieu: 1 } }, then: [
          ['hieu', 'Hoá đơn sai thông tin người mua thì người bán xử lý theo quy định về hoá đơn có sai sót. Không phải mình lấy bút sửa.'],
          ['hieu', '(thông tin giải trí, không phải tư vấn pháp lý. Anh nói câu này nhiều hơn câu "chào em".)'],
        ] },
        { t: '"Anh bảo chị Bảy cưới lại theo tên hộ kinh doanh?"', fx: { dr: 2, rel: { sang: 2 } }, then: [
          ['sang', 'Ha. Anh sẽ không chuyển lời câu đó. Nhưng anh sẽ cười cả chiều.'],
        ] },
      ] },
    ] },
    { who: 'hue', obj: 'Chị Huệ hỏi: charge giờ vào job nào?', time: '15:30', scene: [
      ['hue', 'Em charge giờ hôm nay vào job nào? Tax hay Audit? Hệ thống không cho một người ở hai nơi.'],
      { c: 'au_tl_main', o: [
        { t: 'Làm cả hai, chia giờ chính xác, ở lại tối.', fx: { nl: -20, uy: 3, rel: { hieu: 1, thao: 1, hue: 1 }, set: { tax_skill: true, tl_both: true } }, then: [
          ['hue', 'Chia tới từng mười lăm phút. Em là người đầu tiên chị không phải trả timesheet về.'],
          ['nar', 'Bạn về lúc 22:30. Hai bộ hồ sơ, một linh hồn.'],
        ] },
        { t: 'Nhờ chị Huệ quyết giúp em thuộc phòng nào.', fx: { dr: 1, rel: { hue: 1 } }, then: [
          ['hue', 'Các anh chị tự thống nhất nhé. Chị chỉ quản lý mã job, không quản lý con người.'],
          ['think', 'Mình vừa được trả lại cho chính mình.'],
        ] },
        { t: 'Xin ở hẳn bên Tax tuần này.', fx: { rel: { hieu: 3, thao: -2 }, set: { tax_branch: true } }, then: [
          ['hieu', 'Chào mừng em đến phòng Tax. Ở đây không có kho lạnh. Chỉ có văn bản lạnh.'],
          { chat: [['thao', 'Ok em. Chị ghi nhận.', true]] },
          ['think', '"Chị ghi nhận" lần này có ba dấu chấm vô hình.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Bị mượn sang Tax "hai ngày". ${s.flags.tax_skill ? 'Mình học được câu quan trọng nhất của anh Hiếu: văn bản nào, còn hiệu lực không?' : 'Anh Hiếu trích điều khoản như thơ.'} ${s.flags.tax_branch ? 'Mình xin ở lại Tax. Chị Thảo "ghi nhận".' : s.flags.tl_both ? 'Làm cả hai, về lúc 22:30.' : ''}`,
};

const AVALANCHE = {
  id: 'review_avalanche', minDay: 17, maxDay: 22, title: '27 review note lúc 1:07 sáng',
  intro: '1:07 sáng. Điện thoại sáng lên. Email từ chị Thảo, tiêu đề: "RN – Phúc Lộc – E200".\n\nNội dung: "Em clear giúp chị 27 note trước 8h nhé. Chị hỏi nhanh thôi."\n\nBạn nằm nhìn trần nhà. Trần nhà không có note nào. Thật dễ chịu.',
  steps: [
    { who: 'obj:desk', obj: 'Mở file: 27 review note đang chờ', time: '08:30', scene: [
      ['nar', 'Bạn ngồi xuống bàn, nhớ lại đêm qua. Lúc 1:07 sáng, bạn đã quyết định…'],
      { c: 'au_ra_night', o: [
        { t: 'Thức tới 5 giờ clear hết 27 note.', fx: { nl: -30, uy: 2, set: { notes_all: true } }, then: [
          ['nar', '5:12 sáng, note thứ 27 được clear. Note thứ 27 là: "Font tiêu đề nên là Arial 11." Bạn khóc một chút.'],
        ] },
        { t: 'Làm note quan trọng trước, ghi chú rõ hạn cho phần còn lại.', fx: { nl: -10 }, then: [
          { mini: REVIEW_MINI,
            good: [['nar', 'Bạn chọn đúng ba note "đỏ": số dư ngân hàng, ref chéo, cỡ mẫu. Phần còn lại ghi: "Đã ghi nhận, xử lý trước 14h". Rồi đi ngủ.'], { fx: { uy: 3, set: { transparent_notes: true } } }],
            bad: [['nar', 'Bạn dành một tiếng cho note về font chữ. Rồi ngủ gật trên note về số dư ngân hàng.'], { fx: { nl: -5, set: { notes_half: true } } }],
          },
        ] },
        { t: 'Đi ngủ. Sáng mai đến sớm.', fx: { nl: 10, set: { notes_slept: true } }, then: [
          ['nar', 'Bạn ngủ. Trong mơ, chị Thảo cầm bút đỏ đứng cuối giường: "Chị hỏi nhanh thôi."'],
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo xem kết quả clear note', time: '09:00', scene: [
      { if: F('notes_all'), then: [
        ['thao', 'Em clear hết 27 note lúc 5 giờ sáng? …Chị không bảo em thức.'],
        ['thao', 'Thật ra chị có bảo. Nhưng chị không có ý thế. Lần sau làm cái quan trọng trước.'],
        { fx: { rel: { thao: 1 } } },
      ], else: [
        { if: F('transparent_notes'), then: [
          ['thao', 'Ba note quan trọng xong, phần còn lại có hạn rõ ràng. Lần đầu chị đọc một bản clear note mà không muốn viết thêm note.'],
          { fx: { uy: 3, rel: { thao: 3 } } },
        ], else: [
          { if: F('notes_slept'), then: [
            ['thao', '…'],
            ['nar', 'Chị Thảo không nói gì. Chị gật đầu, nhìn màn hình. Im lặng của manager đáng sợ hơn mắng.'],
            { fx: { dr: 3, rel: { thao: -1 } } },
          ], else: [
            ['thao', 'Em làm được một nửa, mà là nửa ít quan trọng. Lần sau đọc hết rồi mới chọn.'],
            { fx: { rel: { thao: -1 } } },
          ] },
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Anh Khoa thì thầm một bí mật', time: '10:30', scene: [
      ['khoa', 'Note số 14 là anh viết hộ chị Thảo đấy. "Tick-mark cam nghĩa là gì?" Anh hỏi thật, vì anh cũng không nhớ.'],
      ['khoa', 'Bí mật: chị Thảo viết note lúc 3 giờ sáng vì con chị ấy ngủ lúc 2 giờ. Đó là giờ duy nhất trong ngày chị ấy là của chị ấy.'],
      { c: 'au_ra_khoa', o: [
        { t: '"Vậy mà em cứ nghĩ chị ấy thích hành người."', fx: { rel: { khoa: 1 }, set: { know_thao_kid: true } }, then: [
          ['khoa', 'Ai cũng nghĩ vậy. Năm đầu anh cũng nghĩ vậy. Năm hai anh bắt đầu thức cùng giờ. Giờ anh là cú.'],
        ] },
        { t: '"Thế còn anh, anh viết note lúc mấy giờ?"', fx: { rel: { khoa: 2 }, set: { know_thao_kid: true } }, then: [
          ['khoa', 'Anh không viết note. Anh sống trong note.'],
        ] },
      ] },
    ] },
    { who: 'diep', obj: 'Chị Diệp hỏi về một note "?"', time: '14:00', scene: [
      ['diep', 'Có một note "?" của chị Thảo ở ô doanh thu tháng Mười Hai. Chỉ có dấu hỏi. Em hiểu là gì không?'],
      ['nar', 'Doanh thu tháng Mười Hai tăng 300% so với tháng trước. Bốn mươi hoá đơn xuất ngày 30–31. Phiếu xuất kho: ngày 5 tháng sau.'],
      { c: 'au_ra_cutoff', o: [
        { t: '"Cut-off ạ. Hàng chưa rời kho mà đã ghi doanh thu."', fx: { uy: 4, rel: { diep: 2 }, set: { cutoff_found: true } }, then: [
          ['diep', 'Đúng. Một dấu hỏi, bốn mươi hoá đơn. Em vừa đọc được tiếng của chị Thảo.'],
        ] },
        { t: '"Chắc khách bán đắt hàng dịp cuối năm ạ."', fx: { rel: { diep: -1 } }, then: [
          ['diep', 'Đắt tới mức hàng tự giao ngược thời gian à? Đọc lại ngày phiếu xuất kho đi em.'],
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Ghé phòng chị Thảo cuối giờ', time: '16:00', scene: [
      ['thao', 'Em nhìn chị lạ thế? À. Khoa kể rồi phải không.'],
      { c: 'au_ra_thao', o: [
        { t: '"Chị ơi, chị viết lúc 3 giờ rồi hẹn giờ gửi lúc 7 giờ được không ạ?"', fx: { rel: { thao: 3 }, set: { thao_schedule: true } }, then: [
          ['thao', '…Hẹn giờ gửi. Có nút đó à?'],
          ['nar', 'Chị Thảo bật cười. Lần đầu bạn thấy chị cười. Trông chị trẻ ra năm tuổi.'],
        ] },
        { t: 'Chỉ hỏi chị có cần em giúp gì không.', fx: { rel: { thao: 1 } }, then: [
          ['thao', 'Có. Clear nốt chỗ note còn lại, đúng thứ tự quan trọng. Nhưng cảm ơn em đã hỏi.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `27 review note lúc 1:07 sáng. ${s.flags.transparent_notes ? 'Mình làm ba note quan trọng trước. Chị Thảo không viết thêm note nào.' : s.flags.notes_all ? 'Mình thức tới 5 giờ. Note cuối cùng là về font chữ.' : s.flags.notes_slept ? 'Mình đi ngủ. Chị Thảo im lặng.' : 'Mình làm nhầm nửa ít quan trọng.'} ${s.flags.thao_schedule ? 'Mình chỉ chị Thảo nút hẹn giờ gửi. Chị cười.' : ''}`,
};

const TIMESHEET = {
  id: 'timesheet', minDay: 18, maxDay: 30, title: 'Ghi 8, làm 14',
  intro: 'Job Phúc Lộc đã vượt budget giờ 140%. Thứ duy nhất chưa vượt budget là timesheet, vì chưa ai dám ghi thật.\n\nSáng nay chị Huệ trả lại timesheet của bạn. Lý do: "sai mã job". Mã job đúng là mã chưa ai từng cho bạn biết.',
  steps: [
    { who: 'hue', obj: 'Chị Huệ trả lại timesheet', time: '09:00', scene: [
      ['hue', 'Timesheet của em bị trả về vì sai mã job. Phúc Lộc năm nay là PL-AUD-03, không phải PL-AUD-02. 02 là năm ngoái. 01 thì… đừng hỏi.'],
      { c: 'au_ts_hue', o: [
        { t: 'Sửa ngay, xin luôn danh sách mã job đúng.', fx: { uy: 2, rel: { hue: 2 } }, then: [
          ['hue', 'Danh sách đây. Em là người thứ hai trong năm hỏi xin. Người thứ nhất là chị.'],
        ] },
        { t: '"Sao hệ thống không tự điền mã ạ?"', fx: { dr: 1, rel: { hue: 1 } }, then: [
          ['hue', 'Hệ thống có tự điền. Nó tự điền mã năm ngoái.'],
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Anh Khoa dặn một chuyện về timesheet', time: '10:00', scene: [
      ['khoa', 'Em ghi timesheet bao nhiêu tiếng một ngày?'],
      ['me', 'Dạ thực tế em làm khoảng 14 tiếng ạ.'],
      ['khoa', 'Ghi 8 thôi em. Job vượt budget rồi. Ghi 14 thì anh Phong hỏi chị Thảo, chị Thảo hỏi anh, anh hỏi… cây xương rồng.'],
    ] },
    { who: 'tuan', obj: 'Tuấn có kinh nghiệm về chuyện này', time: '11:30', scene: [
      ['tuan', 'Năm ngoái anh ghi 8 làm 14. Nghỉ bù: 0. Tiền OT: 0. Kinh nghiệm: vô hạn. Đơn vị của kinh nghiệm là "đêm".'],
      ['tuan', 'Nhưng nói thật: ghi 8 thì năm sau budget vẫn là 8. Rồi intern năm sau lại làm 14.'],
      ['think', 'Một vòng lặp. Excel gọi đây là "tham chiếu vòng".'],
    ] },
    { who: 'obj:desk', obj: 'Điền timesheet tuần này', time: '14:00', scene: [
      ['nar', 'Ô "Giờ làm thực tế" nhấp nháy. Cạnh màn hình có tờ giấy nhớ ai để lại từ năm nào: "Ghi 8 cho đẹp".'],
      { c: 'au_ts_main', o: [
        { t: 'Ghi đúng 14 tiếng/ngày.', fx: { uy: 2, rel: { khoa: -2 }, set: { honest_timesheet: true } }, then: [
          ['nar', 'Bạn bấm Gửi. Hệ thống hỏi: "Cảnh báo: vượt budget. Bạn có chắc không?" Bạn chắc.'],
        ] },
        { t: 'Ghi 8 tiếng như anh Khoa dặn.', fx: { rel: { khoa: 1 }, set: { ts_8: true } }, then: [
          ['nar', 'Bạn ghi 8. Sáu tiếng còn lại biến mất như chưa từng tồn tại. Như một bút toán không chứng từ.'],
        ] },
        { t: 'Ghi 10. Thỏa hiệp.', fx: { set: { ts_10: true } }, then: [
          ['nar', 'Không ai vui. Không ai buồn. Một con số được tạo ra để không ai phải nói chuyện với ai.'],
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo gọi về timesheet', time: '15:30', scene: [
      { if: F('honest_timesheet'), then: [
        ['thao', 'Em ghi 14 tiếng một ngày. Anh Phong vừa hỏi chị. Em có vấn đề gì với team không?'],
        ['me', 'Dạ không ạ. Em chỉ ghi đúng giờ em làm.'],
        ['thao', '…Ừ. Thật ra chị cần đúng con số này. Không có số thật thì chị không xin thêm người được. Lần này chị có số.'],
        { fx: { uy: 2, rel: { thao: 2 }, set: { budget_case: true } } },
      ], else: [
        { if: F('ts_8'), then: [
          ['thao', 'Job vượt budget mà timesheet cả team đẹp như mơ. Chị lại phải nói với anh Phong là "team tự tối ưu". Năm sau budget giữ nguyên.'],
          ['think', 'Mình vừa góp phần giữ nguyên budget cho intern năm sau.'],
        ], else: [
          ['thao', 'Mười tiếng. Con số đẹp. Không giúp được ai, nhưng đẹp.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Timesheet: ${s.flags.honest_timesheet ? 'mình ghi đúng 14 tiếng. Hoá ra chị Thảo cần đúng con số đó để xin người.' : s.flags.ts_8 ? 'mình ghi 8. Sáu tiếng biến mất.' : 'mình ghi 10. Không ai vui, không ai buồn.'} Mã job năm nay là 03.`,
};

const QC = {
  id: 'qc_check', day: 23, title: 'QC trả hồ sơ',
  intro: 'Chị My, phòng QC & Risk, không bao giờ nói to. Chị không cần.\n\nSáng nay hồ sơ Phúc Lộc quay về bàn anh Khoa, kèm một tờ giấy nhớ: "Gặp chị. — M." Cả team im lặng như vừa thấy tên mình trong thư quản lý.\n\nMai anh Phong ký. Hôm nay là cửa ải cuối.',
  steps: [
    { who: 'my', obj: 'Gặp chị My (QC)', time: '09:00', scene: [
      ['my', 'Ngồi đi. Chị hỏi vài câu. Chị không đáng sợ. Hồ sơ của các em mới đáng sợ.'],
      ['my', 'Trang 37 thiếu chữ ký nháy. Trước khi nói chuyện khác, em sắp xếp lại giúp chị thứ tự ký duyệt một hồ sơ.'],
      { mini: SIGN_ORDER,
        good: [['my', 'Đúng. Ai làm ký trước, ai soát ký sau. Partner ký cuối, không phải vì quan trọng nhất. Vì chịu trách nhiệm cuối.'], { fx: { uy: 2, rel: { my: 2 } } }],
        bad: [['my', 'Sai thứ tự. Nghĩa là có người ký lên thứ người trước chưa đọc. Chị ghi câu này lại. Trong sổ.'], { fx: { rel: { my: -1 } } }],
      },
      ['nar', 'Chị My lật một cuốn sổ bìa đen. Bìa ghi: "Những điều không nên làm, tập 6".'],
    ] },
    { who: 'vy', obj: 'Vy vừa từ phòng QC đi ra', time: '10:00', scene: [
      { if: F('copied_too'), then: [
        ['vy', 'Chị My bắt được rồi. WP phải trả của mình là của năm ngoái. Chị ấy hỏi "Quang Anh là ai". Mình không trả lời được.'],
        ['vy', 'Và… chị ấy mở luôn file phải thu của bạn. Ngày ký cũng là năm ngoái.'],
        { fx: { uy: -6, rel: { thao: -2 }, set: { qc_caught: true } } },
        { c: 'au_qc_copy', o: [
          { t: 'Cùng Vy lên nhận lỗi, xin làm lại cả hai file.', fx: { uy: 2, nl: -10, rel: { vy: 2, my: 1 }, set: { copy_confessed: true } }, then: [
            ['my', 'Hai người cùng nhận. Chị ghi cả hai. Ở trang "biết sai biết sửa". Trang đó mỏng, nhưng có.'],
          ] },
          { t: '"Em dùng template của phòng mà chị."', fx: { dr: 4, uy: -2, rel: { my: -2 } }, then: [
            ['my', 'Template không có ngày ký năm ngoái. Template không có chữ ký của Quang Anh. Chị ghi.'],
          ] },
        ] },
      ], else: [
        { if: F('vy_fixed'), then: [
          ['vy', 'Chị My mở file của mình, đọc mười phút, rồi gật đầu. Gật đầu! Bạn biết chị My gật đầu hiếm cỡ nào không?'],
          ['vy', 'Cảm ơn bạn. Mình nợ bạn một lần. Mình ghét nợ, nên mình sẽ trả.'],
          { fx: { rel: { vy: 2 }, set: { vy_owes: true } } },
        ], else: [
          { if: F('reported_vy'), then: [
            ['vy', 'Mình sửa file rồi. Vì anh Khoa bắt. Vì bạn báo. Mình biết.'],
            ['vy', 'Bạn đúng. Mình chỉ… không thích người đúng.'],
            { fx: { rel: { vy: -1 } } },
          ], else: [
            ['vy', 'Chị My bắt được WP của mình. Là file năm ngoái. Mình… tưởng không ai biết.'],
            { c: 'au_qc_vy', o: [
              { t: 'Ngồi với Vy, giúp Vy làm lại.', fx: { nl: -8, rel: { vy: 3 } }, then: [['vy', 'Bạn không phải làm thế. …Cảm ơn.']] },
              { t: '"Mình đã định nói với Vy…"', fx: { rel: { vy: -1 } }, then: [['vy', 'Định thôi à. Ừ. Ai cũng định.']] },
            ] },
          ] },
        ] },
      ] },
    ] },
    { who: 'my', obj: 'Chị My hỏi tiếp: độc lập và mẫu 17', time: '11:30', scene: [
      ['my', 'Hai câu nữa. Câu một: độc lập.'],
      { if: F('lie_gift'), then: [
        ['my', 'Phúc Lộc gửi một hộp quà và một phong bì. Sổ của cô Lụa ghi: "cháu intern tự nhận". Bản cam kết của em ghi: "không nhận gì".'],
        { c: 'au_qc_gift', o: [
          { t: 'Khai thật, nộp lại phong bì.', fx: { money: -2_000_000, uy: -4, rel: { my: 1 }, set: { lie_gift: false, gift_late_confess: true } }, then: [
            ['my', 'Muộn. Nhưng thật. Chị ghi cả hai chữ.'],
          ] },
          { t: '"Chắc cô Lụa ghi nhầm ạ."', fx: { dr: 6, uy: -8, rel: { my: -3, lua: -3 }, set: { qc_caught: true } }, then: [
            ['my', 'Cô Lụa ba mươi năm chưa ghi nhầm một dòng. Chị không hỏi lại lần hai. Chị ghi.'],
          ] },
        ] },
      ], else: [
        { if: F('gift_refused'), then: [['my', 'Công văn trả quà của em, chị đọc rồi. Chị chép vào sổ, ở trang "những điều NÊN làm". Trang đó mỏng lắm.'], { fx: { uy: 2, rel: { my: 2 } } }],
          else: [['my', 'Chị biết chuyện hộp quà. Lần sau báo trước khi mở.']] },
      ] },
      ['my', 'Câu hai: mẫu 17, khoản 2,1 tỷ.'],
      { if: F('ghost_hidden'), then: [
        ['my', 'WP ghi "đã kiểm tra ✓". Không có kết quả tra cứu. Chị tra lại mất ba phút: người bán ngừng hoạt động. Em đã kiểm tra cái gì?'],
        { c: 'au_qc_ghost', o: [
          { t: 'Nhận lỗi, bổ sung kết quả tra cứu và ghi chú đầy đủ ngay.', fx: { uy: -2, nl: -6, rel: { my: 1 }, set: { ghost_hidden: false, ghost_reported: true, ghost_fixed_late: true } }, then: [
            ['my', 'Sửa trước khi ký thì còn là hồ sơ. Sửa sau khi ký thì là sự cố. Em còn kịp.'],
          ] },
          { t: '"Em làm theo file năm ngoái ạ."', fx: { dr: 3, uy: -4, rel: { tuan: -1, my: -1 }, set: { qc_caught: true } }, then: [
            ['my', 'Vậy năm ngoái cũng sai. Giờ chị có hai năm để ghi.'],
          ] },
        ] },
      ], else: [
        ['my', 'Có kết quả tra, ngày tra, ảnh chụp. Đây là cách một WP nên trông. Chị không có note.'],
        ['think', '"Chị không có note." Lời khen cao nhất của phòng QC.'],
        { fx: { uy: 3, rel: { my: 1 } } },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo tổng kết vòng QC', time: '14:30', scene: [
      { if: F('qc_caught'), then: [
        ['thao', 'QC ghi tên team mình vào sổ. Anh Phong sẽ hỏi. Chị sẽ trả lời. Em sẽ làm lại tới khi chị không phải trả lời nữa.'],
        { fx: { nl: -10, rel: { thao: -1 } } },
      ], else: [
        ['thao', 'QC trả về một hồ sơ chỉ thiếu chữ ký nháy trang 37. Chị làm manager mười năm, đây là lần thứ ba.'],
        { fx: { uy: 3, rel: { thao: 2 }, set: { qc_clean: true } } },
      ] },
      ['thao', 'Mai anh Phong ký. Tối nay ai về được thì về. Mai không ai về được.'],
    ] },
    { who: 'tuan', obj: 'Group "Hội Tick Mỏi Tay" có tiệc', time: '15:30', scene: [
      ['tuan', 'Qua cửa QC rồi hả? Hội Tick Mỏi Tay đang mở tiệc ăn mừng. Tiệc gồm: một gói hướng dương.'],
      { if: F('tie_hieu_my'), then: [
        ['nar', 'Bạn thấy anh Hiếu lặng lẽ đặt một ly trà sữa lên bàn chị My rồi đi như chưa từng đến. Chị My… mỉm cười?'],
        ['tuan', 'Em không thấy gì. Anh cũng không. Bí mật cấp phòng.'],
      ] },
      { c: 'au_qc_tuan', o: [
        { t: 'Ăn hướng dương với cả team.', fx: { nl: 8, rel: { tuan: 1, diep: 1 } }, then: [
          ['diep', 'Vỏ hướng dương bỏ vào giấy nháp. Không phải giấy làm việc. Chị nói nghiêm túc.'],
        ] },
        { t: 'Về bàn chuẩn bị cho ngày mai.', fx: { uy: 2, nl: -5, set: { signoff_prep: true } }, then: [
          ['think', 'Mai anh Phong ký. Mình nên thuộc lòng lead schedule hàng tồn kho.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Vòng QC của chị My. ${s.flags.qc_caught ? 'Tên team mình vào sổ đen của chị My. Có phần của mình.' : 'Hồ sơ chỉ thiếu chữ ký nháy trang 37. Chị Thảo bảo đây là lần thứ ba trong mười năm.'} Mai anh Phong ký.`,
};

const SIGNOFF = {
  id: 'signoff_night', day: 24, title: 'Đêm sign-off',
  intro: 'Hôm nay Partner, anh Phong, đến ký báo cáo kiểm toán Phúc Lộc Foods. Anh có mặt mười lăm phút. Cả văn phòng đã chuẩn bị ba tuần cho mười lăm phút đó.\n\nChị Thảo đến từ 7 giờ. Anh Khoa chưa về từ hôm qua. Mèo Số Dư ngồi ngay ngắn như đang dự họp.',
  steps: [
    { who: 'thao', obj: 'Chị Thảo dặn dò trước giờ ký', time: '08:30', scene: [
      ['thao', 'Hôm nay anh Phong ký. Anh ấy hỏi đúng một câu. Mười năm nay không ai đoán trúng câu đó.'],
      ['thao', 'Phần hàng tồn kho là của em. Nếu câu hỏi rơi vào đó, em trả lời. Không nhìn chị. Không nhìn Khoa.'],
      { c: 'au_so_thao', o: [
        { t: '"Dạ em đã chuẩn bị ạ."', when: F('signoff_prep'), fx: { uy: 2, rel: { thao: 1 } }, then: [
          ['thao', 'Tốt. Chị tin em. Lần này theo nghĩa tốt.'],
        ] },
        { t: '"Nếu em không trả lời được thì sao ạ?"', fx: { rel: { thao: 1 } }, then: [
          ['thao', 'Thì em nói "dạ em sẽ kiểm tra lại". Rồi em kiểm tra tới sáng.'],
        ] },
        { t: 'Gật đầu, mặt tái như anh Khoa.', fx: { nl: -3, rel: { khoa: 1 } }, then: [
          ['khoa', 'Chào mừng em đến với màu da của nghề.'],
        ] },
      ] },
    ] },
    { who: 'call:quang', obj: 'Anh Quang gọi: "trao đổi nhanh trước khi ký"', time: '10:00',
      call: { title: 'Phúc Lộc Foods · "Trao đổi nhanh trước khi ký"', people: ['quang', 'thao', 'me'] }, scene: [
      { if: F('ghost_reported'), then: [
        ['quang', 'Chị Thảo, em intern. Khoản điều chỉnh 2,1 tỷ, mình bỏ đi được không? Anh nói chuyện với anh Phong rồi.'],
        ['thao', 'Anh Phong chưa nói gì với em, anh Quang ạ.'],
        ['quang', 'Thì em intern nói đi. Em là người tra mà. Em thấy có cần thiết không?'],
        { c: 'au_so_quang', o: [
          { t: '"Dạ, điều chỉnh do chị Thảo và anh Phong quyết ạ. Em chỉ ghi lại bằng chứng."', fx: { uy: 3, rel: { thao: 2, quang: -1 } }, then: [
            ['quang', '…Ừ. Các em giống nhau quá.'],
            { chat: [['thao', 'Câu trả lời đúng. Đúng cả giọng.', true]] },
          ] },
          { t: '"Dạ, em thấy… chắc cũng không cần lắm ạ."', fx: { dr: 4, rel: { quang: 2, thao: -3 }, set: { wobbled: true } }, then: [
            ['thao', 'Em không có thẩm quyền nói câu đó. Và chị chưa từng nghe em nói câu đó. Rõ chưa?'],
          ] },
          { t: 'Im lặng, để chị Thảo trả lời.', fx: { rel: { thao: 1 } }, then: [
            ['thao', 'Anh Quang, bằng chứng nằm trong hồ sơ. Anh muốn trao đổi thì mời anh gặp anh Phong chiều nay.'],
          ] },
        ] },
      ], else: [
        ['quang', 'Chị Thảo, chiều nay ký nhé. Mọi thứ ổn cả. Em intern làm việc rất hiểu chuyện.'],
        { chat: [['thao', '"Hiểu chuyện." Em đã làm gì để khách khen câu đó?', true]] },
        ['think', 'Mình biết mình đã làm gì. Ô "đã kiểm tra ✓" ở mẫu 17.'],
        { c: 'au_so_hidden', o: [
          { t: 'Nhắn chị Thảo kể thật về mẫu 17.', fx: { uy: 1, rel: { thao: 1 }, set: { ghost_hidden: false, ghost_reported: true, late_honest: true } }, then: [
            { chat: [['thao', 'Cảm ơn em đã nói trước giờ ký. Sau giờ ký thì chị không cứu được.', true]] },
          ] },
          { t: 'Không nói gì.', fx: { dr: 2 }, then: [['think', 'Còn sáu tiếng nữa anh Phong ký.']] },
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Anh Khoa gọi lại tổng duyệt', time: '13:00', scene: [
      ['khoa', 'Tổng duyệt. Anh Phong thích hỏi ba kiểu: "số này tăng sao nhiều thế", "rủi ro là gì", và "năm ngoái thế nào".'],
      { if: (r) => !!r.flags.khoa_trust || !!r.flags.khoa_owes, then: [
        ['khoa', 'Mẹo của anh: trả lời bằng bằng chứng, không bằng tính từ. Đừng nói "do thị trường". Anh Phong ghét chữ "thị trường".'],
        { fx: { set: { khoa_hint: true } } },
      ] },
      { if: (r) => !!r.flags.count_lazy && !r.flags.count_confessed, then: [
        ['khoa', 'Còn biên bản kiểm kê của em… khớp một trăm phần trăm. Anh mong anh Phong không hỏi phần đó.'],
        ['think', 'Mình cũng mong.'],
      ] },
      { c: 'au_so_khoa', o: [
        { t: 'Tập trả lời ba kiểu câu hỏi với anh Khoa.', fx: { nl: -8, uy: 2, set: { signoff_prep: true } }, then: [
          ['khoa', 'Ổn. Em trả lời như người đã ở trong kho. Vì em đã ở trong kho.'],
        ] },
        { t: '"Anh ơi, hôm qua anh có về nhà không?"', fx: { rel: { khoa: 2 } }, then: [
          ['khoa', 'Anh về. Trong mơ.'],
        ] },
      ] },
    ] },
    { who: 'phong', obj: 'Anh Phong đến! Vào phòng họp', time: '16:00', pos: MEET_POS, scene: [
      ['phong', 'Chào cả nhà. Anh có mười lăm phút. À, em là… Tâm phải không?'],
      ['me', 'Dạ em là {ten} ạ.'],
      ['nar', 'Anh Phong gật đầu như đã nhớ. Anh không nhớ.'],
      ['nar', 'Anh lật lead schedule hàng tồn kho đúng năm giây. Rồi dừng lại.'],
      ['phong', 'Tồn kho tăng 40%, doanh thu chỉ tăng 5%. Số này hơi lạ nhỉ?'],
      ['nar', 'Cả phòng quay sang nhìn bạn. Mèo Số Dư cũng quay sang.'],
      { if: F('khoa_hint'), then: [['think', 'Bằng chứng, không phải tính từ. Đừng nói "thị trường".']] },
      { if: F('b7_found'), then: [['think', 'Và bốn mươi thùng rỗng ở pallet B7. Mình đã ở đó.']] },
      { mini: SIGNOFF_QUIZ,
        good: [
          ['phong', 'Hàng tích trữ có hợp đồng, có biên bản. Rủi ro nằm ở dự phòng. Ừ. Em trả lời bằng bằng chứng.'],
          ['phong', '{ten}. Lần này anh nhớ thật.'],
          { fx: { uy: 6, rel: { phong: 3, thao: 2 }, set: { partner_noticed: true } } },
        ],
        bad: [
          ['nar', 'Bạn nói hai câu. Câu thứ hai có chữ "thị trường". Anh Phong nhìn sang anh Khoa.'],
          ['khoa', 'Dạ em bổ sung: khách tích trữ trước Tết, có hợp đồng mua, bọn em đã đánh giá dự phòng ạ.'],
          ['phong', 'Ừ. Lần sau để em ấy nói hết.'],
          { fx: { rel: { khoa: 1 } } },
        ],
      },
      { if: (r) => !!r.flags.count_lazy && !r.flags.count_confessed, then: [
        ['phong', 'Biên bản kiểm kê kho lạnh khớp một trăm phần trăm. Kho lạnh nào khớp một trăm phần trăm?'],
        ['thao', 'Dạ… bọn em sẽ kiểm tra lại ạ.'],
        ['nar', 'Chị Thảo không nhìn bạn. Không nhìn còn đáng sợ hơn nhìn.'],
        { fx: { uy: -5, rel: { thao: -2, phong: -1 }, set: { partner_noticed: false } } },
      ] },
    ] },
    { who: 'phong', obj: 'Anh Phong cầm bút. Ký hay không?', time: '17:30', pos: MEET_POS, scene: [
      { if: F('ghost_reported'), then: [
        ['phong', 'Khoản 2,1 tỷ. Ai là người tra hoá đơn này?'],
        ['me', 'Dạ, em ạ.'],
        { c: 'au_so_ghost', o: [
          { t: '"Dạ em tra trên cổng hoá đơn, có ảnh chụp kết quả, và thiếu hợp đồng, biên bản nghiệm thu ạ."', fx: { uy: 4, rel: { phong: 2 }, set: { stood_ghost: true } }, then: [
            ['phong', 'Đủ. Điều chỉnh vẫn giữ. Khách không đồng ý thì ý kiến ngoại trừ. Anh sẽ nói chuyện với anh Quang.'],
            ['nar', 'Anh Phong ký. Bút máy, mực xanh đen. Anh Khoa thở ra như vừa được thả khỏi kho lạnh.'],
          ] },
          { t: '"Dạ em làm theo hướng dẫn của anh Khoa ạ."', fx: { rel: { khoa: 1 } }, then: [
            ['phong', 'Ừ. Hướng dẫn đúng. Anh giữ điều chỉnh.'],
            ['nar', 'Anh Phong ký. Anh Khoa gật nhẹ với bạn: "Lần sau nhận công của mình đi."'],
          ] },
        ] },
      ], else: [
        ['nar', 'Anh Phong ký nhanh. Bút máy, mực xanh đen. Mẫu 17 nằm im trong hồ sơ với tick "đã kiểm tra ✓".'],
        ['think', 'Báo cáo ký rồi. Không ai hỏi. Không ai hỏi là tốt hay xấu?'],
        { fx: { dr: 3, set: { ghost_signed: true } } },
      ] },
      ['phong', 'Cảm ơn cả nhà. Anh bay lúc bảy giờ. Khoa, về ngủ đi. Đó là chỉ đạo.'],
      { fx: { set: { signoff_done: true } } },
      ['nar', 'Anh Khoa về lúc 17:45. Lần đầu từ tháng Một anh thấy hoàng hôn. Anh chụp gửi vào group. Không ai nói gì. Ai cũng thả tim.'],
    ] },
  ],
  diary: (s) => `Đêm sign-off. ${s.flags.partner_noticed ? 'Anh Phong hỏi "số này hơi lạ nhỉ" và mình trả lời bằng bằng chứng. Lần này anh nhớ tên mình.' : 'Anh Phong hỏi "số này hơi lạ nhỉ". Anh Khoa trả lời thay mình.'} ${s.flags.stood_ghost ? 'Khoản 2,1 tỷ vẫn giữ điều chỉnh.' : s.flags.ghost_signed ? 'Mẫu 17 vẫn "đã kiểm tra ✓". Mình không ngủ được.' : ''} Anh Khoa thấy hoàng hôn.`,
};

const LOSTFILE = {
  id: 'lost_file', minDay: 25, maxDay: 30, title: 'Ai xoá file?',
  intro: 'Phúc Lộc ký xong, đoàn chuyển sang job Vạn Thịnh Land, công ty bất động sản ghi nhận doanh thu "theo cảm xúc".\n\n9 giờ sáng, WP "E200_PhaiThu_VanThinh" biến mất khỏi ổ chung. Anh Khoa đứng giữa phòng, tóc dựng, mắt đỏ.',
  steps: [
    { who: 'khoa', obj: 'Anh Khoa hốt hoảng tìm bạn', time: '09:00', scene: [
      ['khoa', 'File phải thu Vạn Thịnh mất rồi. Ba ngày làm việc. Lần cuối em mở nó đúng không?'],
      ['me', 'Dạ em mở hôm qua lúc 17 giờ…'],
      ['khoa', 'Thì đấy. Em làm gì nó? Anh không trách em, anh chỉ… cần một người để không trách.'],
      { c: 'au_lf_khoa', o: [
        { t: '"Để em nhờ anh Lộc kiểm tra lịch sử ổ chung ạ."', fx: { uy: 2 }, then: [['khoa', 'Ừ. Đi đi. Nhanh.']] },
        { t: '"Em xin lỗi anh…"', fx: { dr: 2, nl: -3 }, then: [
          ['khoa', 'Xin lỗi không khôi phục được file.'],
          ['think', 'Mình xin lỗi cho một việc mình không làm. Thói quen của người mới.'],
        ] },
      ] },
    ] },
    { who: 'loc', obj: 'Nhờ anh Lộc xem audit trail ổ chung', time: '09:45', scene: [
      ['loc', 'Lịch sử ổ chung hả? Hệ thống không biết nói dối. Người thì có. Để anh xem.'],
      ['nar', 'Anh Lộc gõ ba lệnh. Màn hình hiện: "E200_PhaiThu_VanThinh.xlsx — Xoá bởi: khoa.n — 02:14 sáng nay".'],
      ['loc', 'Anh Khoa xoá lúc 2 giờ 14. Chắc ngủ gật đè phím Delete. Phím đó to nhất bàn phím mà.'],
      ['loc', 'Thùng rác ổ chung giữ 30 ngày, anh khôi phục được. Nhưng 17:01 thì anh không khôi phục gì hết, nên em quyết nhanh.'],
      { fx: { rel: { loc: 1 } } },
    ] },
    { who: 'obj:desk', obj: 'Quyết định làm gì với audit trail', time: '11:00', scene: [
      ['nar', 'Bạn có ảnh chụp audit trail. Group team có 14 người. Anh Khoa vẫn đang kể với chị Thảo rằng intern làm mất file.'],
      { c: 'au_lf_main', o: [
        { t: 'Gửi ảnh audit trail vào group team.', fx: { uy: 2, dr: 4, rel: { khoa: -3 }, set: { khoa_shamed: true } }, then: [
          ['nar', 'Ảnh vừa lên, group im lặng. Ba người thả "haha". Một người thả tim. Anh Khoa đọc, rồi úp mặt xuống bàn.'],
        ] },
        { t: 'Gửi riêng cho anh Khoa, nhờ anh Lộc khôi phục file.', fx: { rel: { khoa: 4, loc: 1 }, set: { khoa_owes: true } }, then: [
          ['nar', 'Anh Khoa đọc tin nhắn riêng. Năm phút sau, file trở lại. Anh không nói gì. Anh đặt chậu xương rồng lên bàn bạn.'],
        ] },
        { t: 'Không nói gì, lặng lẽ làm lại từ bản lưu hôm trước.', fx: { nl: -25, set: { redo_silent: true } }, then: [
          ['nar', 'Bạn làm lại ba ngày việc trong tám tiếng. File mới tốt hơn file cũ. Không ai biết bạn bị oan, trừ anh Lộc và audit trail.'],
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Anh Khoa muốn nói chuyện', time: '14:00', scene: [
      { if: F('khoa_owes'), then: [
        ['khoa', 'Anh xin lỗi. Anh ngủ gật trên bàn phím. Anh đổ cho em vì… em là người dễ đổ nhất.'],
        ['khoa', 'Anh nợ em một lần. Anh không quên nợ. Nghề của anh là nhớ nợ.'],
        { fx: { rel: { khoa: 1 } } },
      ], else: [
        { if: F('khoa_shamed'), then: [
          ['khoa', 'Em đúng. Cả group biết em đúng. Anh cũng biết.'],
          ['khoa', 'Lần sau… gửi riêng cho anh trước được không? Anh cũng là người.'],
          { c: 'au_lf_sorry', o: [
            { t: '"Em xin lỗi vì gửi công khai, anh."', fx: { rel: { khoa: 2 } }, then: [['khoa', 'Ừ. Huề. Anh còn nợ em cái chậu xương rồng.']] },
            { t: '"Anh đổ cho em trước, cũng công khai mà."', fx: { uy: 1, rel: { khoa: -1 } }, then: [['khoa', '…Đúng. Anh không cãi được. Anh ghét lúc không cãi được.']] },
          ] },
        ], else: [
          ['khoa', 'File mới của em… đẹp hơn file cũ. Mà file cũ đâu nhỉ? Thôi. Không quan trọng.'],
          ['think', 'Quan trọng với mình.'],
          { fx: { rel: { khoa: 1 } } },
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo hỏi chuyện file', time: '15:30', scene: [
      { if: F('redo_silent'), then: [
        ['thao', 'Em làm lại cả file phải thu trong một ngày? Sao phải làm lại?'],
        { c: 'au_lf_thao', o: [
          { t: 'Kể thật, đưa ảnh audit trail.', fx: { uy: 1, rel: { thao: 1, khoa: -1 } }, then: [
            ['thao', 'Em chịu oan cả ngày rồi mới nói. Lần sau nói sớm. Chị không có thời gian để đoán ai oan.'],
          ] },
          { t: '"Dạ em làm hỏng ạ."', fx: { dr: 2, rel: { khoa: 2 }, set: { covered_khoa: true } }, then: [
            ['thao', 'Ừ. Lần sau lưu file mỗi mười phút.'],
            ['nar', 'Phía sau, anh Khoa nhìn bạn rất lâu. Anh biết.'],
          ] },
        ] },
      ], else: [
        { if: F('khoa_shamed'), then: [['thao', 'Chị thấy ảnh trong group rồi. Em đúng. Nhưng đúng mà làm người khác mất mặt thì em sẽ đúng một mình.']],
          else: [['thao', 'File về rồi à? Tốt. Chị không hỏi chuyện gì xảy ra. Nhìn mặt Khoa là chị biết.'], { fx: { rel: { thao: 1 } } }] },
      ] },
    ] },
  ],
  diary: (s) => `File Vạn Thịnh biến mất. Audit trail: khoa.n, 02:14. ${s.flags.khoa_owes ? 'Mình gửi riêng anh Khoa. Anh nợ mình một lần.' : s.flags.khoa_shamed ? 'Mình gửi vào group. Đúng, nhưng anh Khoa úp mặt xuống bàn.' : 'Mình làm lại cả file trong tám tiếng.'}`,
};

const HOTPOT = {
  id: 'hotpot_count', minDay: 26, maxDay: 31, title: '40 ký bò mất tích',
  intro: 'Bạn được luân chuyển một ngày sang Dịch vụ kế toán với anh Sang. Khách hàng: chuỗi Lẩu Bếp Nhà Mây, ba chi nhánh, chưa tháng nào sổ kho khớp.\n\nTháng này lệch 40 ký thịt bò. Chủ quán nghi có trộm. Bếp trưởng nghi chủ quán đếm sai. Con mèo của quán không nghi ai.',
  steps: [
    { who: 'sang', obj: 'Sang Dịch vụ kế toán làm cùng anh Sang', time: '09:00', scene: [
      ['sang', 'Chào mừng em đến vùng trũng của Cân Đối. Ít OT hơn audit. Nhiều cuộc gọi hơn tổng đài.'],
      ['sang', 'Bếp Nhà Mây lệch 40 ký bò. Em đối chiếu nhập – xuất – tồn giúp anh. Anh nghe điện thoại chị Bảy đã.'],
      ['nar', 'Điện thoại anh Sang reo. Nhạc chuông là tiếng máy tính tiền.'],
    ] },
    { who: 'obj:desk', obj: 'Đối chiếu sổ kho Bếp Nhà Mây', time: '10:30', scene: [
      ['nar', 'Bạn mở sổ kho. Có ba sheet: "Kho", "Kho thật", và "Kho (đừng sửa)".'],
      { mini: HOTPOT_ORDER,
        good: [['nar', 'Tồn đầu + nhập − xuất = 120 ký. Kiểm đếm thực tế: 80 ký. Phiếu xuất ghi lý do: "lẩu". Không ghi lẩu của ai. Tất cả lúc 22:30.'], { fx: { uy: 2, set: { beef_trace: true } } }],
        bad: [['nar', 'Bạn trừ nhập, cộng xuất. Kết quả: quán dư 40 ký bò. Một phép màu kế toán.'], ['sang', 'Em làm ngược dấu rồi. Đừng lo, khách của anh tháng nào cũng làm thế.'], { fx: { nl: -4 } }],
      },
    ] },
    { who: 'call:may', obj: 'Chị Mây (chủ quán lẩu) gọi', time: '13:00',
      call: { title: 'Lẩu Bếp Nhà Mây · Chủ quán', people: ['may', 'sang', 'me'] }, scene: [
      ['may', 'Em kiểm toán hả? Chị nói luôn: có trộm. Chị lắp camera rồi mà vẫn mất.'],
      { if: F('beef_trace'), then: [['think', 'Phiếu xuất "lẩu" mỗi tối 22:30. Giờ đó quán đã đóng. Giờ đó là giờ nhân viên ăn.']] },
      { c: 'au_hp_may', o: [
        { t: '"Chị ơi, có thể là suất ăn nhân viên buổi tối chưa được ghi sổ. Mình nên ghi riêng một khoản."', when: F('beef_trace'), fx: { uy: 4, rel: { sang: 2 }, set: { beef_found: true } }, then: [
          ['may', 'Suất ăn nhân viên… À. Bếp trưởng nấu cho cả quán ăn sau giờ đóng cửa. Chị cho phép mà chị quên.'],
          ['may', 'Vậy là chị không bị trộm. Chị bị… tốt bụng.'],
        ] },
        { t: '"Chị kiểm tra lại camera trong bếp ạ."', fx: { dr: 1, rel: { sang: 1 } }, then: [
          ['may', 'Camera bếp quay vào nồi lẩu. Chị thấy… nhân viên ăn lẩu. Ơ. Ơ khoan.'],
        ] },
        { t: 'Đề nghị điều chỉnh sổ cho khớp rồi tính sau.', fx: { dr: 3, rel: { sang: -1 }, set: { beef_plug: true } }, then: [
          ['sang', 'Không. Mình không "điều chỉnh cho khớp". Mình tìm vì sao không khớp. Đó là khác biệt giữa kế toán và ảo thuật.'],
        ] },
      ] },
    ] },
    { who: 'sang', obj: 'Anh Sang hỏi cảm nghĩ cuối ngày', time: '15:00', scene: [
      ['sang', 'Một ngày dịch vụ kế toán. Thấy sao?'],
      ['sang', 'Anh làm nghề này tám năm. Anh nhớ tên con của bốn mươi khách hàng. Đó là việc không ai thuê anh làm, nhưng anh làm giỏi nhất.'],
      { c: 'au_hp_sang', o: [
        { t: '"Em thấy vui hơn kho lạnh ạ."', fx: { rel: { sang: 2 } }, then: [
          ['sang', 'Vui hơn, nhưng ít được khen hơn. Không ai viết thư quản lý cho một quán lẩu.'],
        ] },
        { t: '"Sao anh không chuyển sang audit ạ?"', fx: { rel: { sang: 1 } }, then: [
          ['sang', 'Audit nhìn sổ sách sau khi mọi chuyện xảy ra. Anh thích ở trong lúc nó đang xảy ra. Và anh thích ngủ.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Một ngày ở Dịch vụ kế toán. ${s.flags.beef_found ? '40 ký bò không bị trộm: đó là bữa tối của nhân viên. Chị Mây bị "tốt bụng".' : s.flags.beef_plug ? 'Mình đề nghị điều chỉnh cho khớp. Anh Sang bảo đó là ảo thuật.' : '40 ký bò vẫn còn là một bí ẩn nhỏ.'} Anh Sang nhớ tên con của bốn mươi khách hàng.`,
};

const ADVISORY = {
  id: 'advisory_model', minDay: 29, maxDay: 32, title: '400.000 dòng',
  intro: 'Chị Ngân bên Advisory cần người cho một thương vụ due diligence. "Bên chị không đi kho," chị nói, như mời bạn lên du thuyền.\n\nĐiều chị không nói: file sổ cái của công ty được định giá có 400.000 dòng, và laptop của bạn sinh năm 2017.',
  steps: [
    { who: 'ngan', obj: 'Chị Ngân (Advisory) mượn bạn', time: '09:00', scene: [
      ['ngan', 'Em là intern audit hả? Chị mượn em hai hôm. Bên chị làm due diligence: khám sức khỏe tài chính trước khi người ta mua công ty.'],
      ['ngan', 'Khác audit ở chỗ: bên chị không đi kho, bên chị đi họp. Và bên chị không tick-mark. Bên chị tô màu nền.'],
      ['nar', 'Chị Diệp, cách đó hai bàn, đặt bút xuống rất chậm.'],
      { c: 'au_am_ngan', o: [
        { t: '"Dạ em thích làm mô hình ạ."', fx: { rel: { ngan: 2 } }, then: [['ngan', 'Tốt. Mô hình là nơi giả định được mặc vest.']] },
        { t: '"Không tick-mark thì sao biết đã kiểm tra ạ?"', fx: { rel: { diep: 2, ngan: -1 } }, then: [
          ['diep', '(từ xa) Cảm ơn em.'],
          ['ngan', 'Thì… bên chị tin nhau. Đùa đấy. Bên chị có comment.'],
        ] },
      ] },
    ] },
    { who: 'loc', obj: 'Laptop treo: tìm anh Lộc', time: '10:00', scene: [
      ['loc', 'Em mở file 400.000 dòng trên con máy 2017? Em đang thử thách nó hay thử thách anh?'],
      ['nar', 'Excel hiện "Không phản hồi". Quạt laptop kêu như máy bay sắp cất cánh.'],
      { c: 'au_am_loc', o: [
        { t: 'Xin mượn máy cấu hình cao của Advisory.', fx: { clock: 30, rel: { loc: 1 }, set: { borrowed_laptop: true } }, then: [
          ['loc', 'Máy Advisory 32GB RAM, dán sticker "ĐỪNG MƯỢN". Anh cho em mượn tới 17:00. Anh về là máy về.'],
        ] },
        { t: '"Anh ơi, Update có giúp không ạ?"', fx: { dr: 2, rel: { loc: -1 } }, then: [
          ['loc', 'Không. Chưa bao giờ. Update là nguyên nhân, không phải giải pháp.'],
        ] },
      ] },
    ] },
    { who: 'obj:desk', obj: 'Xử lý file 400.000 dòng', time: '11:00', scene: [
      ['nar', 'Bạn có ba cách. Cách nào cũng tốn một thứ: giờ ngủ, sự độc lập, hoặc lòng tự trọng của Excel.'],
      { c: 'au_am_main', o: [
        { t: 'Học Power Query qua video, lọc dữ liệu trước khi nạp.', fx: { nl: -15, uy: 2, set: { excel_skill: true } }, then: [
          ['nar', 'Hai tiếng và ba video sau, 400.000 dòng còn 12.000 dòng cần xem. Máy thở lại. Bạn cũng vậy.'],
        ] },
        { t: 'Nhờ công ty được định giá lọc sẵn giúp.', fx: { dr: 2, set: { client_filtered: true } }, then: [
          ['ngan', 'Họ gửi lại file đã lọc. Rất nhanh. Quá nhanh. Em chắc họ không lọc mất cái mình cần tìm chứ?'],
          ['think', 'Lại là "quá nhanh".'],
        ] },
        { t: 'Chia tay file thành 40 file nhỏ.', fx: { nl: -20 }, then: [
          ['nar', '40 file, từ "GL_01" tới "GL_40". File "GL_27" bị hỏng. Không ai biết vì sao.'],
        ] },
      ] },
      { mini: EXCEL_QUIZ,
        good: [['ngan', 'Không hard-code, có tra cứu, có lọc. Em làm Excel như người có tương lai.'], { fx: { uy: 3, rel: { ngan: 2 }, set: { excel_skill: true } } }],
        bad: [['ngan', 'Em vừa cộng thêm một tỷ vào công thức "cho tròn". Chị coi như chưa thấy. Một lần.'], { fx: { rel: { ngan: -1 } } }],
      },
    ] },
    { who: 'ngan', obj: 'Chị Ngân rủ ra pantry nói chuyện', time: '14:30', scene: [
      ['ngan', 'Chị nói thật nhé. Hồi trước chị cũng làm audit. Chị chuyển sang Advisory vì ghét kho lạnh.'],
      ['ngan', 'Giờ chị nhớ kho lạnh. Ở kho, cái gì cũng đếm được. Ở đây, mọi thứ là "kịch bản".'],
      { c: 'au_am_ngan2', o: [
        { t: '"Chị có muốn đi kiểm kê với tụi em lần sau không ạ?"', fx: { rel: { ngan: 3 } }, then: [
          ['ngan', '…Có. Đừng kể ai. Chị sẽ mang cái áo khoác đẹp nhất.'],
        ] },
        { t: '"Vậy Advisory có nhận intern không ạ?"', fx: { rel: { ngan: 1 }, set: { advisory_offer: true } }, then: [
          ['ngan', 'Nhận. Nếu em muốn đổi nhánh, chị nói với chị Thảo. Chị Thảo sẽ "ghi nhận".'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Hai ngày ở Advisory với chị Ngân. ${s.flags.excel_skill ? 'Mình học Power Query, 400.000 dòng còn 12.000.' : 'File 400.000 dòng thắng mình một hiệp.'} Chị Ngân nhớ kho lạnh. Ai cũng nhớ thứ mình từng ghét.`,
};

const OWNERROR = {
  id: 'own_error', day: 33, title: 'Một dòng thuyết minh',
  intro: 'Báo cáo kiểm toán Phúc Lộc đã phát hành. Bản cứng có chữ ký mực xanh đen của anh Phong, đã nằm trong tủ "HỒ SƠ KIỂM TOÁN".\n\nSáng nay, khi mở lại bảng thuyết minh để copy mẫu cho job khác, bạn thấy: tổng cột "Chi phí trả trước" lệch 12.000.000 đồng. Bạn cộng sai. Chính bạn.',
  steps: [
    { who: 'obj:desk', obj: 'Cộng lại cột thuyết minh lần thứ năm', time: '08:45', scene: [
      ['nar', 'Bạn cộng lần thứ năm. Vẫn lệch mười hai triệu. Mức trọng yếu của job là ba tỷ. Mười hai triệu là "immaterial". Nhưng nó là của bạn.'],
      ['think', 'Không ai biết. Báo cáo đã phát hành. Hồ sơ đã khoá.'],
      { fx: { nl: -3 } },
    ] },
    { who: 'tuan', obj: 'Tuấn để ý mặt bạn', time: '09:30', scene: [
      ['tuan', 'Sao mặt em như vừa nhận review note lúc 3 giờ sáng?'],
      { c: 'au_oe_tuan', o: [
        { t: 'Kể cho Tuấn nghe.', fx: { rel: { tuan: 2 } }, then: [
          ['tuan', 'Mười hai triệu trên ba tỷ? Immaterial. Nhưng em biết, và em sẽ nhớ. Anh có một cái như thế từ năm ngoái. Anh vẫn nhớ.'],
          ['tuan', 'Anh không báo. Đến giờ anh vẫn không biết mình đúng hay sai.'],
        ] },
        { t: '"Không có gì đâu anh."', fx: { nl: -3 }, then: [
          ['tuan', 'Ừ. "Không có gì" là câu cả phòng này nói ngay trước khi có gì.'],
        ] },
      ] },
    ] },
    { who: 'khoa', obj: 'Tìm anh Khoa', time: '10:30', scene: [
      ['khoa', 'Em tìm anh? Nhanh nhé, anh đang ở Vạn Thịnh, doanh thu ghi nhận theo cảm xúc.'],
      { c: 'au_oe_main', o: [
        { t: 'Báo ngay anh Khoa và chị Thảo, đề nghị ghi nhận vào hồ sơ.', fx: { uy: 3, rel: { khoa: 2 }, set: { owned_error: true } }, then: [
          ['khoa', '…Em tự tìm ra lỗi của mình, sau khi phát hành, và tự báo. Em biết cả phòng có bao nhiêu người từng làm thế không?'],
          ['khoa', 'Anh đếm được trên một bàn tay. Bàn tay đó còn thiếu ngón.'],
          { if: F('khoa_owes'), then: [['khoa', 'Anh đi cùng em lên gặp chị Thảo. Anh đang trả nợ.']] },
        ] },
        { t: 'Hỏi anh Khoa xem có cần báo không.', fx: { rel: { khoa: 1 }, set: { asked_khoa_error: true } }, then: [
          ['khoa', 'Immaterial. Theo sách thì có thể không cần điều chỉnh. Nhưng em hỏi anh tức là em đã biết câu trả lời rồi.'],
          ['think', 'Hai người chia nhau một nửa áy náy. Mỗi người vẫn còn nguyên một nửa.'],
        ] },
        { t: 'Im lặng. Không ai biết.', fx: { dr: 2, nl: -5, set: { hid_error: true } }, then: [
          ['khoa', 'Ơ, em tìm anh có việc gì?'],
          ['me', 'Dạ không có gì ạ.'],
          ['think', 'Câu "không có gì" nặng mười hai triệu đồng.'],
        ] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo gọi vào phòng', time: '14:00', scene: [
      { if: F('owned_error'), then: [
        ['thao', 'Khoa nói rồi. Mười hai triệu, immaterial, không ảnh hưởng ý kiến kiểm toán. Chị sẽ ghi vào hồ sơ và báo anh Phong.'],
        ['thao', 'Nhưng chị muốn em biết: chị nhớ người tự báo lỗi lâu hơn người không bao giờ sai. Người không bao giờ sai thì chị chưa gặp.'],
        { fx: { uy: 5, rel: { thao: 3 } } },
      ], else: [
        { if: F('asked_khoa_error'), then: [
          ['thao', 'Khoa kể là em hỏi về một dòng thuyết minh. Em muốn nói gì với chị không?'],
          { c: 'au_oe_thao', o: [
            { t: 'Kể hết, xin ghi nhận vào hồ sơ.', fx: { uy: 3, rel: { thao: 2 }, set: { owned_error: true } }, then: [
              ['thao', 'Mười hai triệu. Immaterial. Nhưng giờ nó là "đã biết, đã ghi", không phải "không ai biết". Khác nhau nhiều lắm.'],
            ] },
            { t: '"Dạ không có gì ạ."', fx: { dr: 2 }, then: [['thao', 'Ừ.'], ['think', 'Chị ấy nói "ừ" y hệt cách chị My nói "chị ghi".']] },
          ] },
        ], else: [
          ['thao', 'Chị thấy em mở lại hồ sơ Phúc Lộc sáng nay. Có gì không em?'],
          { c: 'au_oe_thao2', o: [
            { t: 'Nói thật về 12 triệu.', fx: { uy: 2, rel: { thao: 2 }, set: { owned_error: true, hid_error: false } }, then: [
              ['thao', 'Em giấu được nửa ngày. Nửa ngày thì chị cho qua. Một năm thì không.'],
            ] },
            { t: '"Dạ em mở để copy mẫu thôi ạ."', fx: { dr: 2 }, then: [['thao', 'Ừ.'], ['think', 'Chị ấy nói "ừ" y hệt cách chị My nói "chị ghi".']] },
          ] },
        ] },
      ] },
    ] },
    { who: 'vy', obj: 'Vy chờ bạn ở bàn', time: '15:30', scene: [
      ['vy', 'Hôm nay review tuần thứ năm. Nghe nói hôm nay chị Thảo chốt suất chính thức.'],
      { if: F('vy_owes'), then: [['vy', 'Mình nói trước: nếu bạn được, mình sẽ vui. Bảy mươi phần trăm. Ba mươi phần trăm còn lại mình xử lý riêng.']], else: [
        { if: F('reported_vy'), then: [['vy', 'Mình không ghét bạn. Mình chỉ không muốn thua người mình không ghét được.']],
          else: [['vy', 'Chúc bạn may mắn. Mình thì không cần may mắn. Mình cần chị Thảo.']] },
      ] },
      { c: 'au_oe_vy', o: [
        { t: '"Chúc Vy may mắn. Thật đấy."', fx: { rel: { vy: 2 } }, then: [['vy', '…Ừ. Cảm ơn. Thật đấy.']] },
        { t: '"Mình nghĩ mình xứng đáng hơn."', fx: { dr: 2, rel: { vy: -1 } }, then: [['vy', 'Có thể. Nhưng "xứng đáng" không phải mã job.']] },
      ] },
    ] },
  ],
  diary: (s) => `Mười hai triệu đồng trong một bảng thuyết minh đã phát hành. ${s.flags.owned_error ? 'Mình tự báo. Chị Thảo bảo chị nhớ người tự báo lỗi lâu hơn người không bao giờ sai.' : 'Mình không nói. Mười hai triệu nặng hơn mình tưởng.'}`,
};

const YEAREND = {
  id: 'year_end_party', minDay: 36, maxDay: 40, title: 'Tất niên & bảng vàng timesheet',
  intro: 'Busy season chưa hết, nhưng tất niên thì phải đúng ngày. Chị Huệ đặt nhà hàng, in bảng vàng "Người ghi timesheet nhiều giờ nhất", và gửi email: "Không bắt buộc. Có điểm danh."',
  steps: [
    { who: 'hue', obj: 'Chị Huệ phát thư mời tất niên', time: '10:00', scene: [
      ['hue', 'Tối nay tất niên nhé. Không bắt buộc. Chị điểm danh lúc 18:00, 18:30 và 19:00.'],
      ['hue', 'Bảng vàng timesheet năm nay: người ghi nhiều giờ nhất là… anh Khoa. Năm ngoái cũng anh Khoa. Năm kia: anh Khoa.'],
      { if: F('honest_timesheet'), then: [['hue', 'Em đứng thứ hai. Intern đứng thứ hai bảng vàng là lần đầu. Chị không biết nên khen hay nên lo.'], { fx: { uy: 2 } }] },
      { c: 'au_ye_hue', o: [
        { t: '"Có giải gì không chị?"', fx: { rel: { hue: 1 } }, then: [['hue', 'Một voucher spa. Anh Khoa chưa dùng cái nào trong ba năm. Hết hạn cả.']] },
        { t: '"Em xin góp ý: làm nhiều giờ chưa chắc là tốt ạ."', fx: { uy: 1, rel: { hue: 2 } }, then: [['hue', 'Chị biết. Chị làm HR. Chị chỉ in cái bảng thôi.']] },
      ] },
    ] },
    { who: 'lua', obj: 'Ăn trưa với cô Lụa và mọi người', time: '12:00', pos: { lua: 'lunch1', tuan: 'lunch2', diep: 'lunch3', sang: 'lunch4', vy: 'lunch5' }, scene: [
      ['lua', 'Năm nay cô nghỉ hưu rồi đấy. Ba mươi năm giữ con dấu. Tất niên này là cái cuối của cô.'],
      ['tuan', 'Cô nghỉ thì ai giữ con dấu ạ?'],
      ['lua', 'Chị Huệ. Nhưng con dấu chưa đồng ý.'],
      { c: 'au_ye_lua', o: [
        { t: 'Xin cô dạy cách đóng dấu không bị lệch.', fx: { rel: { lua: 3 } }, then: [
          ['lua', 'Hít vào. Đặt xuống. Đừng nhấc vội. Đóng dấu cũng như ký báo cáo: chậm một giây, đúng cả đời.'],
        ] },
        { t: 'Tặng cô tấm thiệp cả team ký nháy.', fx: { nl: -3, rel: { lua: 3, tuan: 1, diep: 1 } }, then: [
          ['lua', 'Ký nháy cả à. Đủ cả. Cô sẽ lưu vào hồ sơ… riêng của cô.'],
        ] },
      ] },
      { fx: { nl: 20 } },
    ] },
    { who: 'phong', obj: 'Anh Phong ghé văn phòng (hiếm có)', time: '15:00', scene: [
      ['phong', 'Chào cả nhà. Anh ghé năm phút. Tối nay anh không đi được, anh có cuộc họp khác.'],
      { if: F('partner_noticed'), then: [['phong', '{ten}. Người trả lời câu tồn kho bằng bằng chứng. Hiếm.'], { fx: { rel: { phong: 1 } } }],
        else: [['phong', 'Em là… người ở kho lạnh phải không? Ai ở đây cũng từng ở kho lạnh.']] },
      ['phong', 'Hồi anh intern, anh đi kiểm kê trang trại heo. Heo không đứng yên để đếm. Gần bốn mươi năm sau, anh vẫn mơ thấy heo.'],
      { c: 'au_ye_phong', o: [
        { t: '"Thế anh đếm heo bằng cách nào ạ?"', fx: { rel: { phong: 2 } }, then: [['phong', 'Đếm lúc chúng ăn. Lúc ăn, ai cũng đứng yên. Heo hay người đều thế.']] },
        { t: '"Partner cũng từng là intern ạ?"', fx: { dr: 1, rel: { phong: 1 } }, then: [['phong', 'Ai cũng là intern. Có người chỉ được ký thay thôi.']] },
      ] },
    ] },
    { who: 'obj:desk', obj: '17:30 Đi tất niên hay ở lại?', time: '17:30', scene: [
      ['nar', '17:30. Cả phòng lục tục thay áo. Trên màn hình bạn, review note Vạn Thịnh vẫn nhấp nháy.'],
      { if: (r) => r.status === 'official', then: [['think', 'Giờ mình là nhân viên chính thức. Tất niên không bắt buộc. Note thì bắt buộc.']] },
      { c: 'au_ye_party', o: [
        { t: 'Đi tất niên, uống ít, về bằng xe ôm công nghệ.', fx: { money: -120_000, nl: 10, rel: { tuan: 1, hue: 1, diep: 1 }, set: { drank_today: true } }, then: [
          ['nar', 'Anh Khoa nhận voucher spa thứ tư. Chị Diệp nhảy. Chị Thảo về sớm vì con. Ai cũng giả vờ không thấy chị My cười.'],
        ] },
        { t: 'Ở lại clear note, nhắn group "mọi người vui nhé".', fx: { nl: -10, uy: 2, rel: { thao: 1 } }, then: [
          ['nar', 'Văn phòng tối. Còn bạn, màn hình, và Mèo Số Dư. Nó nằm lên bàn phím, gõ "aaa". Nó đang chúc mừng năm mới.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Tất niên. Cô Lụa nghỉ hưu, con dấu chưa đồng ý. ${s.flags.drank_today ? 'Mình đi, uống ít, về bằng xe ôm.' : 'Mình ở lại với Mèo Số Dư và review note.'} Anh Phong vẫn mơ thấy heo.`,
};

// ---------- official arc ----------
const OFF1 = {
  id: 'off_honeymoon', official: true, title: 'A1 chính thức: tuần trăng mật',
  intro: 'Ngày đầu với chức danh "Associate 1". Danh thiếp in tên bạn, sai một dấu. Email chào mừng của chị Huệ dài ba dòng; dòng thứ ba là mã job mới.\n\nCảm giác như được lên lớp. Bài tập về nhà cũng lên lớp.',
  steps: [
    { who: 'hue', obj: 'Chị Huệ làm thủ tục nhân viên chính thức', time: '08:45', scene: [
      ['hue', 'Chúc mừng em! Từ tháng này em có hợp đồng lao động, nên có bảo hiểm xã hội, y tế, thất nghiệp. Phần em đóng khoảng 10,5% lương.'],
      ['hue', 'Lương 15 triệu thì sau bảo hiểm và giảm trừ gia cảnh, thuế thu nhập cá nhân của em gần như bằng không. (thông tin giải trí, không phải tư vấn pháp lý)'],
      ['hue', 'Danh thiếp của em đây. In sai một dấu. In lại mất hai tuần. Em dùng tạm nhé.'],
      { c: 'au_oh_hue', o: [
        { t: 'Nhận danh thiếp, cười.', fx: { rel: { hue: 1 } }, then: [['think', 'Trên danh thiếp, tên mình có thêm một dấu hỏi. Rất hợp với nghề.']] },
        { t: '"Chị in lại giúp em được không ạ?"', fx: { uy: 1 }, then: [['hue', 'Được. Hai tuần. Trong hai tuần đó, em là người khác.']] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo giao job đầu tiên của A1', time: '09:30', scene: [
      ['thao', 'Chúc mừng em. Giờ thì chị hỏi nhanh: em nhận ba job cùng lúc được không? Vạn Thịnh, một công ty may, và một dự án ODA.'],
      ['think', 'Tuần trăng mật kéo dài từ 8:45 tới 9:30.'],
      { c: 'au_oh_thao', o: [
        { t: '"Dạ được ạ."', fx: { nl: -10, rel: { thao: 2 }, set: { took_three: true } }, then: [
          ['thao', 'Tốt. Intern thì chị còn thương. Associate thì chị tin. Tin thì giao nhiều.'],
        ] },
        { t: '"Em nhận hai, xin chị lùi giúp em job thứ ba ạ."', fx: { uy: 2, rel: { thao: 1 } }, then: [
          ['thao', 'Biết đàm phán rồi. Được. Job ODA để sau. Nhưng "sau" ở đây là thứ Năm.'],
        ] },
      ] },
    ] },
    { who: 'vy', obj: 'Vy ghé bàn bạn', time: '11:00', scene: [
      { if: (r) => !!r.flags.vy_owes || (r.rel.vy || 0) >= 3, then: [
        ['vy', 'Chúc mừng bạn. Nói thật: mình nhận offer của một công ty sản xuất rồi. Kế toán tổng hợp. Lương cao hơn bạn. Mình sẽ khoe mãi.'],
        ['vy', 'Cảm ơn vụ file năm ngoái. Nhờ bạn mà mình đi với một hồ sơ sạch.'],
      ], else: [
        ['vy', 'Chúc mừng. Mình được gia hạn thực tập "đến khi có thông báo mới". Bạn biết câu đó nghĩa là gì không?'],
        ['think', 'Nghĩa là không có thông báo mới.'],
      ] },
      { c: 'au_oh_vy', o: [
        { t: 'Mời Vy đi ăn trưa.', fx: { money: -80_000, rel: { vy: 2 } }, then: [['vy', 'Bạn trả à? Lương chính thức có khác.']] },
        { t: '"Có gì cần giúp cứ hỏi mình."', fx: { rel: { vy: 1 } }, then: [['vy', 'Ừ. Giờ bạn là người nói "tick xong chưa em" rồi đấy.']] },
      ] },
    ] },
    { who: 'tuan', obj: 'Tuấn chào đồng nghiệp chính thức', time: '14:30', scene: [
      ['tuan', 'Chào đồng nghiệp chính thức! Giờ em có quyền mới trong "Hội Tick Mỏi Tay": quyền than có bảo hiểm.'],
      ['tuan', 'Lời khuyên A1: em sẽ được giao intern mới. Đừng nói "năm ngoái làm thế nào". Anh nói câu đó, và nhìn xem anh thành gì.'],
      { c: 'au_oh_tuan', o: [
        { t: '"Anh thành gì ạ?"', fx: { rel: { tuan: 2 } }, then: [['tuan', 'Thành người giỏi copy. Thời này copy không còn là kỹ năng hiếm.']] },
        { t: '"Em sẽ viết lại hướng dẫn cho intern mới."', fx: { uy: 2, set: { wrote_guide: true } }, then: [['tuan', 'Ý hay. Năm sau intern mới sẽ copy hướng dẫn của em. Vòng lặp tiếp tục.']] },
      ] },
    ] },
  ],
  diary: (s) => `Ngày đầu làm A1. Danh thiếp sai một dấu. ${s.flags.took_three ? 'Mình nhận ba job cùng lúc.' : 'Mình đàm phán được còn hai job.'} Tuần trăng mật kéo dài 45 phút.`,
};

const OFF2 = {
  id: 'off_busy', official: true, title: 'Ngày thứ 19 liên tiếp',
  intro: 'Busy season đạt đỉnh. Văn phòng sáng đèn tới 23 giờ. Quỹ ăn đêm hết từ ngày 12. Máy in kẹt bốn lần trong một ngày, kỷ lục mới.\n\nSáng nay anh Khoa đến với một phong bì trắng. Không phải quà. Đơn nghỉ việc.',
  steps: [
    { who: 'khoa', obj: 'Anh Khoa có chuyện muốn nói', time: '08:45', scene: [
      ['khoa', 'Anh nghỉ. Anh vừa nhận thưởng. Anh đi bán cà phê. Ít nhất ly cà phê thì cân được.'],
      ['khoa', 'Job Vạn Thịnh đang dở 60%. Anh bàn giao cho em. File tên "VanThinh_ban_giao_FINAL_anh_Khoa". Anh xin lỗi vì chữ FINAL.'],
      { if: F('khoa_owes'), then: [['khoa', 'Anh hết nợ em rồi nhé. Anh để lại chậu xương rồng. Nó quang hợp hộ em.']] },
      { c: 'au_ob_khoa', o: [
        { t: '"Anh nhớ ra ngoài nắng nhiều vào nhé."', fx: { rel: { khoa: 3 } }, then: [['khoa', 'Ừ. Mỗi ngày anh sẽ đứng ngoài nắng một tiếng. Như bù timesheet.']] },
        { t: '"Anh bỏ em lại với 60% file à?"', fx: { dr: 2, rel: { khoa: -1 } }, then: [['khoa', 'Năm anh lên A1, anh cũng được bỏ lại với 60% file. Đây là truyền thống.']] },
      ] },
    ] },
    { who: 'thao', obj: 'Chị Thảo cần một in-charge', time: '09:30', scene: [
      ['thao', 'Khoa nghỉ. Chị cần một người làm in-charge tạm cho Vạn Thịnh. Em mới lên A1, nhưng em biết job này.'],
      { c: 'au_ob_main', o: [
        { t: 'Nhận làm in-charge tạm.', fx: { nl: -15, uy: 4, rel: { thao: 2 }, set: { acting_incharge: true } }, then: [
          ['thao', 'Tốt. Nếu xong, chị đề xuất em lên A2 sớm. "Đề xuất" nhé, chị không hứa.'],
        ] },
        { t: '"Em nhận, nhưng xin phụ cấp trách nhiệm ạ."', fx: { uy: 1, set: { acting_incharge: true, asked_allowance: true } }, then: [
          ['thao', 'Để chị xin.'],
          ['think', '"Để chị xin" có cùng tỷ lệ phản hồi với thư xác nhận công nợ.'],
        ] },
        { t: '"Em chưa đủ kinh nghiệm, chị cho người khác ạ."', fx: { rel: { thao: -1 }, set: { refused_incharge: true } }, then: [
          ['thao', 'Ừ. Chị sẽ tìm. Chị sẽ tìm trong gương.'],
          ['think', 'Chị Thảo sẽ tự làm in-charge. Và note lúc 3 giờ sáng sẽ nhiều hơn.'],
        ] },
      ] },
    ] },
    { who: 'diep', obj: 'Chị Diệp gọi bạn qua', time: '12:30', scene: [
      ['diep', 'Em ăn trưa chưa? Chưa? Chị cũng chưa. Đây là bút xanh lá. Chị tặng em. Chị có hai cây.'],
      ['diep', 'Chị nói thật: chị cũng đang viết đơn. Chưa nộp. Viết đơn nghỉ là cách chị thở trong busy season.'],
      { c: 'au_ob_diep', o: [
        { t: '"Chị đừng đi. Ai dạy em màu tick-mark nữa?"', fx: { rel: { diep: 2 } }, then: [['diep', 'Màu thì em thuộc rồi. Cái em chưa thuộc là lúc nào cần dừng tick. Chị cũng chưa.']] },
        { t: '"Em cũng đang viết, trong đầu."', fx: { rel: { diep: 1 }, set: { resign_draft: true } }, then: [['diep', 'Viết ra giấy đi. Viết trong đầu thì nó không có chữ ký nháy.']] },
      ] },
    ] },
    { who: 'loc', obj: 'Anh Lộc đi ngang, nhìn laptop của bạn', time: '16:00', scene: [
      ['loc', 'Năm giờ kém. Laptop em kêu như máy cày. Em muốn anh xem trước khi anh về không?'],
      ['nar', 'Còn một tiếng nữa anh Lộc về. Còn bảy tiếng nữa bạn về.'],
      { c: 'au_ob_loc', o: [
        { t: 'Nhờ anh Lộc dọn máy.', fx: { rel: { loc: 2 } }, then: [['loc', 'Xong. Anh xoá 14GB file tạm. Trong đó 3GB tên "WP_FINAL". Đừng lo, chỉ là bản nháp. Chắc vậy.']] },
        { t: '"Anh ơi, anh có bao giờ ở lại sau năm giờ không?"', fx: { rel: { loc: 1 } }, then: [
          ['loc', 'Một lần. Năm 2019. Anh thấy chị Thảo khóc ở phòng review lúc 23 giờ. Từ đó anh về đúng năm giờ, để công ty còn một người bình thường.'],
        ] },
      ] },
    ] },
  ],
  diary: (s) => `Anh Khoa nghỉ, đi bán cà phê. ${s.flags.acting_incharge ? 'Mình thành in-charge tạm của Vạn Thịnh.' : 'Chị Thảo tự làm in-charge.'} ${s.flags.resign_draft ? 'Chị Diệp bảo viết đơn ra giấy. Mình đang nghĩ.' : ''}`,
};

const OFF3 = {
  id: 'off_client', official: true, title: 'Phúc Lộc dọa đổi kiểm toán',
  intro: 'Phúc Lộc Foods gửi email: năm sau họ "cân nhắc đơn vị kiểm toán khác, linh hoạt hơn". Chữ "linh hoạt" in đậm.\n\nTrong phòng Partner, anh Phong ngồi lâu hơn mười lăm phút. Lần đầu tiên trong lịch sử.',
  steps: [
    { who: 'call:quang', obj: 'Anh Quang gọi riêng', time: '09:00',
      call: { title: 'Anh Quang · "Nói chuyện riêng"', people: ['quang', 'me'] }, scene: [
      ['quang', 'Chào em. Giờ em chính thức rồi. Anh nói thẳng: Phúc Lộc có thể đổi kiểm toán. Trừ khi năm nay các em "linh hoạt" hơn với vài khoản.'],
      ['quang', 'Còn lời mời của anh vẫn còn. Kế toán tổng hợp. Lương gấp rưỡi. Em suy nghĩ đi.'],
      { c: 'au_ocl_quang', o: [
        { t: '"Dạ em phải khai báo lời mời này với công ty theo quy định độc lập ạ."', fx: { uy: 3, rel: { quang: -2 }, set: { declared_offer: true } }, then: [
          ['quang', 'Khai đi. Anh không giấu gì. Anh chỉ… hơi buồn.'],
        ] },
        { t: '"Dạ em sẽ suy nghĩ."', fx: { set: { cfo_offer: true } }, then: [
          ['quang', 'Tốt. Người suy nghĩ thì thường đồng ý.'],
          ['think', 'Mình đang kiểm toán công ty của người mời mình về làm. Chuyện này có tên trong sách. Không phải tên đẹp.'],
        ] },
        { t: 'Từ chối thẳng.', fx: { rel: { quang: -1 }, set: { refused_quang: true } }, then: [
          ['quang', 'Ừ. Anh tôn trọng. Năm sau anh sẽ tôn trọng một đơn vị kiểm toán khác.'],
        ] },
      ] },
    ] },
    { who: 'phong', obj: 'Họp với anh Phong và chị Thảo', time: '10:30', pos: { phong: 'meeting_head', thao: 'mr_n1' }, scene: [
      ['phong', 'Mất Phúc Lộc thì phòng Assurance mất 8% doanh thu. Anh hỏi thẳng: mình giữ khách hay giữ ý kiến?'],
      ['thao', 'Anh biết câu trả lời rồi mà.'],
      ['phong', 'Anh biết. Anh muốn nghe người làm hồ sơ trả lời.'],
      { c: 'au_ocl_main', o: [
        { t: '"Mình giữ ý kiến ạ. Không thì chữ ký của anh không còn đáng tiền."', fx: { uy: 5, rel: { phong: 3, thao: 2 }, set: { stood_firm: true } }, then: [
          ['phong', '…Ừ. Đó là câu anh nói với Partner của anh, hai mươi năm trước. Anh mất khách năm đó. Anh không hối hận.'],
          ['nar', 'Anh Phong ngồi thêm năm phút. Không ai nói gì. Năm phút đắt nhất của phòng Assurance.'],
        ] },
        { t: '"Mình có thể viết thư quản lý nhẹ nhàng hơn ạ."', fx: { rel: { phong: -1 }, set: { soft_letter: true } }, then: [
          ['phong', 'Viết nhẹ thì được. Sửa số thì không. Em phân biệt được hai cái đó là được.'],
        ] },
        { t: '"Em xin để anh chị quyết ạ."', fx: { rel: { thao: -1 } }, then: [
          ['phong', 'Ừ. Câu an toàn. Năm năm nữa em sẽ không được nói câu đó nữa đâu.'],
        ] },
      ] },
    ] },
    { who: 'my', obj: 'Chị My cần bản khai độc lập bổ sung', time: '14:00', scene: [
      ['my', 'Chị cần em ký bản khai độc lập bổ sung. Nghe nói có người mời em về làm cho khách hàng.'],
      { if: F('declared_offer'), then: [['my', 'Em tự khai. Chị đã ghi, ở trang "những điều NÊN làm". Trang đó dày hơn rồi, nhờ em.'], { fx: { uy: 2, rel: { my: 2 } } }], else: [
        { c: 'au_ocl_my', o: [
          { t: 'Khai đầy đủ lời mời của anh Quang.', fx: { uy: 1, rel: { my: 1 }, set: { declared_offer: true } }, then: [['my', 'Muộn một buổi sáng. Chị cho qua. Ký đây.']] },
          { t: '"Dạ không có ai mời ạ."', fx: { dr: 5, rel: { my: -3 }, set: { hid_offer: true } }, then: [['my', 'Chị không hỏi lại lần hai. Chị ghi.']] },
        ] },
      ] },
    ] },
    { who: 'hue', obj: 'Chị Huệ gọi nhỏ', time: '16:00', scene: [
      ['hue', 'Chị báo trước để em không sốc: tháng sau phòng Assurance "tái cấu trúc". Công ty gọi là "tối ưu nguồn lực sau mùa vụ".'],
      ['hue', 'Chị không được nói ai có tên trong danh sách. Chị chỉ được nói là… có danh sách.'],
      { c: 'au_ocl_hue', o: [
        { t: '"Em có trong danh sách không chị?"', fx: { rel: { hue: 1 } }, then: [['hue', 'Chị không được nói. Nhưng chị khuyên em cập nhật CV. Chị khuyên câu này với tất cả mọi người. Kể cả chị.']] },
        { t: '"Cảm ơn chị đã báo trước."', fx: { rel: { hue: 2 } }, then: [['hue', 'HR cũng là người, em ạ. Chỉ là người có quyền mở file lương.']] },
      ] },
    ] },
  ],
  diary: (s) => `Phúc Lộc dọa đổi kiểm toán. ${s.flags.stood_firm ? 'Mình nói "giữ ý kiến". Anh Phong ngồi im năm phút.' : 'Mình chọn câu an toàn.'} Chị Huệ bảo: có danh sách.`,
};

const OFF4 = {
  id: 'off_final', official: true, end: (r) => (r.flags.final_path === 'pushed' ? 'layoff' : 'quit'), title: 'Mùa thưởng và một lá đơn',
  intro: 'Busy season kết thúc. Thưởng về: "một tháng lương, tùy kết quả kinh doanh". Kết quả kinh doanh: mất Phúc Lộc. Thưởng: nửa tháng.\n\nĐêm qua lúc 3:04 sáng, chị Thảo gửi bạn một email. Không có note nào. Chỉ một dòng: "Mai em vào phòng chị một chút nhé."',
  steps: [
    { who: 'obj:desk', obj: 'Đọc lại email 3:04 sáng của chị Thảo', time: '08:45', scene: [
      ['nar', 'Bạn đọc lại email lần thứ mười. Không có dấu hỏi. Lần đầu tiên chị Thảo viết một email không có dấu hỏi.'],
      { if: F('resign_draft'), then: [['think', 'Trong ngăn kéo có lá đơn mình viết từ hôm chị Diệp bảo "viết ra giấy đi". Nó chưa có chữ ký.']] },
      ['nar', 'Bốn mươi hai đêm về sau 22 giờ. Cận tăng 0,75 độ. Một chậu xương rồng thừa kế.'],
      { fx: { nl: -5 } },
    ] },
    { who: 'thao', obj: 'Vào phòng chị Thảo', time: '09:30', scene: [
      ['thao', 'Ngồi đi. Chị hỏi nhanh thôi. Lần này chị hỏi thật nhanh, vì chị không muốn hỏi.'],
      ['thao', 'Danh sách tái cấu trúc có tên em. Không phải vì em làm kém. Vì em là người mới nhất, và Phúc Lộc là job của em.'],
      { if: F('stood_firm'), then: [['thao', 'Em giữ ý kiến, và công ty mất khách vì giữ ý kiến. Đời không công bằng. Kế toán thì công bằng hơn đời.']] },
      ['thao', 'Họ cho em hai lựa chọn: nghỉ "theo nguyện vọng cá nhân", hoặc chờ quyết định cho thôi việc. Cái đầu hồ sơ đẹp hơn. Cái sau… đúng hơn.'],
      { c: 'au_of_thao', o: [
        { t: '"Nếu là chị, chị chọn gì?"', fx: { rel: { thao: 2 } }, then: [
          ['thao', 'Chị năm 25 tuổi thì chọn cái đúng. Chị bây giờ thì chọn cái để con chị có bảo hiểm. Em 25 tuổi.'],
        ] },
        { t: '"Em cảm ơn chị vì đã nói thật."', fx: { rel: { thao: 3 } }, then: [
          ['thao', 'Nói thật là thứ duy nhất chị còn cho em được. Thưởng thì… em biết rồi.'],
        ] },
      ] },
    ] },
    { who: 'tuan', obj: 'Tuấn đợi ở cửa phòng review', time: '11:00', scene: [
      ['tuan', 'Anh nghe rồi. "Hội Tick Mỏi Tay" đang soạn tin chia tay. Mười bốn bản nháp. Bản nào cũng có sticker con mèo.'],
      { if: F('cfo_offer'), then: [['tuan', 'Mà em còn lời mời của anh Quang phải không? Phúc Lộc giờ không còn là khách của mình. Về đó thì hết vướng độc lập.']] },
      { c: 'au_of_tuan', o: [
        { t: '"Anh có định nghỉ không?"', fx: { rel: { tuan: 2 } }, then: [
          ['tuan', 'Anh à? Anh ở đây tới khi thành anh Khoa. Rồi anh mở quán cà phê cạnh quán anh Khoa. Cạnh tranh lành mạnh.'],
        ] },
        { t: '"Em sẽ nhớ cái group này."', fx: { rel: { tuan: 1 } }, then: [
          ['tuan', 'Group không xoá em đâu. Không ai biết cách xoá thành viên. Admin là anh mà anh cũng không biết.'],
        ] },
      ] },
    ] },
    { who: 'hue', obj: 'Qua bàn chị Huệ: quyết định cuối cùng', time: '15:00', scene: [
      ['hue', 'Chị cần em chọn hôm nay để kịp chốt bảo hiểm tháng này. Em quyết thế nào?'],
      ['nar', '(Thông tin về chấm dứt hợp đồng trong game được đơn giản hoá, thông tin giải trí, không phải tư vấn pháp lý.)'],
      { c: 'au_of_main', o: [
        { t: 'Ký đơn nghỉ "theo nguyện vọng". Mình cũng cạn rồi.', fx: { nl: 10, set: { final_path: 'burnout' } }, then: [
          ['hue', 'Chị hiểu. Busy season nào chị cũng nhận mười mấy lá đơn tuần này. Em không phải người đầu, cũng không phải người cuối.'],
        ] },
        { t: 'Nhận lời anh Quang, về Phúc Lộc làm kế toán tổng hợp.', when: F('cfo_offer'), fx: { set: { final_path: 'client' } }, then: [
          ['hue', 'Về làm cho khách cũ. Năm sau đoàn kiểm toán mới gửi PBC cho em. Em sẽ biết cảm giác của chị Hồng.'],
        ] },
        { t: 'Không ký. Chờ quyết định cho thôi việc, nhận đúng quyền lợi.', fx: { uy: 3, set: { final_path: 'pushed' } }, then: [
          ['hue', '…Được. Em đúng. Chị sẽ làm đúng quy trình cho em. Hiếm ai chọn cái này. Ai chọn thì chị nhớ.'],
          ['think', 'Ít nhất mình đã không ký chữ "nguyện vọng".'],
        ] },
      ] },
    ] },
    { who: 'diep', obj: 'Chào chị Diệp trước khi về', time: '17:00', scene: [
      ['diep', 'Em đi hả. Đây. Bộ bút bốn màu. Chị mua từ hồi em làm thư xác nhận. Chị quên đưa.'],
      ['diep', 'Đỏ: đã đối chiếu. Xanh: đã lần xuôi. Tím: đã cộng. Cam: hỏi lại. Mang theo, dùng cho bất cứ việc gì em làm tiếp.'],
      ['nar', 'Ra tới cửa, bạn quay lại. Mèo Số Dư nằm trên bàn bạn, cuộn tròn thành số 0. Cuối cùng, mọi thứ cũng cân.'],
    ] },
  ],
  diary: (s) => `Ngày cuối ở Cân Đối. ${s.flags.final_path === 'client' ? 'Mình về Phúc Lộc.' : s.flags.final_path === 'pushed' ? 'Mình không ký chữ "nguyện vọng".' : 'Mình ký đơn nghỉ. Ngủ trước, tính sau.'} Chị Diệp tặng bộ bút bốn màu.`,
};

export const EPISODES = [
  ONBOARDING, PBC, STOCK, GHOST, VYCOPY, GIFT, CONFIRM, TAX, AVALANCHE, TIMESHEET,
  QC, SIGNOFF, LOSTFILE, HOTPOT, ADVISORY, OWNERROR, YEAREND,
  OFF1, OFF2, OFF3, OFF4,
];
export const ARC = ['off_honeymoon', 'off_busy', 'off_client', 'off_final'];
