// Cân Đối & Cộng Sự — Day 0: interview, accounting quiz, salary deal, contract, tax/insurance line.
// Tax/insurance lines are simplified for entertainment and always carry the in-game disclaimer.

const isTier = (...ids) => (s) => ids.includes(s.tier);

export const ACCT_QUIZ = {
  type: 'quiz', title: 'Bài test Nợ – Có của chị Thảo', icon: '🧮',
  prompt: 'Bốn câu. Chị Thảo bấm giờ bằng đồng hồ cát mượn của phòng QC.', time: 40, pass: 0.75,
  questions: [
    { q: 'Công ty mua văn phòng phẩm, trả bằng tiền mặt. Bút toán là…', options: ['Nợ Chi phí / Có Tiền mặt', 'Nợ Tiền mặt / Có Chi phí', 'Nợ Cảm xúc / Có Hy vọng'], correct: 0 },
    { q: 'Tổng phát sinh Nợ phải bằng…', options: ['Tổng nợ thẻ tín dụng của em', 'Tổng phát sinh Có', 'Tùy tâm trạng khách hàng'], correct: 1 },
    { q: 'Bảng cân đối kế toán "cân" khi…', options: ['Tài sản = Nợ phải trả + Vốn chủ sở hữu', 'Manager đã đi ngủ', 'Excel không bị treo'], correct: 0 },
    { q: 'Kế toán khách nói: "Số này đúng mà, em tin chị đi." Kiểm toán viên cần…', options: ['Tin chị', 'Một ly trà sữa', 'Bằng chứng'], correct: 2 },
  ],
};

export const CONTRACT_MINI = {
  type: 'pick', title: 'Thỏa thuận thực tập · bản 2025 (sửa tay)', icon: '📄',
  prompt: 'Tìm 3 điều khoản "có vấn đề" trước khi ký. Cô Lụa đang cầm sẵn con dấu.', pick: 3, time: 40, pass: 0.66,
  items: [
    { text: 'Thực tập sinh tuân thủ quy định về tính độc lập của nghề kiểm toán.' },
    { text: 'Thực tập sinh tham gia kiểm kê kho theo lịch khách hàng, kể cả 2 giờ sáng, lễ, Tết và "khi cần".', correct: true },
    { text: 'Giờ làm việc được ghi nhận theo budget giờ của job, không theo giờ làm thực tế.', correct: true },
    { text: 'Bảo mật thông tin khách hàng, kể cả sau khi kết thúc thực tập.' },
    { text: 'Phụ cấp được chi trả sau khi khách hàng thanh toán phí kiểm toán.', correct: true },
    { text: 'Được một Senior hướng dẫn trong suốt thời gian thực tập.' },
    { text: 'Không nhận quà, tiền hoặc lợi ích từ khách hàng.' },
    { text: 'Nghỉ trưa 60 phút.' },
  ],
};

export const TAXFORM_MINI = {
  type: 'quiz', title: 'Bản cam kết thu nhập', icon: '🧾',
  prompt: 'Điền đúng từng ô. Chị Huệ không nhận bản có vết bút xoá.', time: 40, pass: 0.75,
  questions: [
    { q: 'Ô "Họ và tên"', options: ['Tên em, viết hoa có dấu', 'Tên tài khoản game của em', 'Cân Đối & Cộng Sự'], correct: 0 },
    { q: 'Ô "Số định danh cá nhân"', options: ['Mã sinh viên', '12 số trên Căn cước', 'Số tài khoản ngân hàng'], correct: 1 },
    { q: 'Ô "Mã số thuế cá nhân"', options: ['Để trống vì em còn trẻ', 'Mã số thuế cá nhân (thường là số định danh)', 'Số điện thoại'], correct: 1 },
    { q: 'Ô "Ký, ghi rõ họ tên"', options: ['Ký tắt cho nhanh', 'Đóng tick-mark ✓', 'Ký và ghi rõ họ tên'], correct: 2 },
  ],
};

export const INTERVIEW = {
  title: 'Buổi đầu tiên',
  subtitle: 'Vòng phỏng vấn',
  intro: 'Chiều thứ Sáu, 14:00. Tầng 11 một tòa nhà kính, thang máy chỉ dừng tầng chẵn.\n\nBiển ở sảnh: "CÂN ĐỐI & CỘNG SỰ · Integrity – Quality – Teamwork". Ai đó dán thêm tờ giấy nhớ: "Tick xong chưa em?"\n\nBạn đến phỏng vấn thực tập kiểm toán. Bạn mang theo CV, máy tính cầm tay, và một niềm tin rằng mọi thứ đều có thể cân.',
  pos: { thao: 'meeting_head', hue: 'mr_n1', khoa: 'mr_n2' },
  steps: [
    {
      who: 'lua', obj: 'Tới quầy văn thư báo cô Lụa em đến phỏng vấn', time: '14:00',
      scene: [
        ['lua', 'Cháu đến nộp chứng từ cho đoàn kiểm toán hay đến phỏng vấn?'],
        ['me', 'Dạ cháu là {ten}, cháu đến phỏng vấn thực tập lúc 14 giờ ạ.'],
        ['lua', 'Phỏng vấn thì ký sổ khách. Sổ khách có ba cột: tên, giờ đến, và "đã có chữ ký nháy".'],
        ['nar', 'Cô Lụa đẩy cuốn sổ sang. Bên cạnh là một con dấu tròn được đặt trên khăn nhung, như một báu vật.'],
        { c: 'a0_lua', o: [
          { t: 'Ký đủ ba cột, kèm chữ ký nháy ở góc.', fx: { uy: 2, rel: { lua: 2 } }, then: [
            ['lua', 'Ký nháy luôn. Được. Cháu có tương lai trong nghề này.'],
          ] },
          { t: '"Cô ơi, chữ ký nháy là gì ạ?"', fx: { rel: { lua: 1 } }, then: [
            ['lua', 'Là chữ ký nhỏ ở góc trang, để chứng minh cháu đã đọc trang đó. Ở đây thiếu nó thì như chưa sống.'],
          ] },
          { t: 'Chụp ảnh con dấu cho đẹp.', fx: { dr: 3, rel: { lua: -2 } }, then: [
            ['lua', 'Không chụp con dấu. Con dấu không phải người mẫu.'],
            ['think', 'Ngày đầu tiên. Đã bị cấm một việc.'],
          ] },
        ] },
        ['tuan', 'Phỏng vấn hả? Phòng họp đi thẳng, cửa bên trái. Đừng ngồi ghế có vết cà phê, đó là ghế của Partner.'],
        ['me', 'Anh là…?'],
        ['tuan', 'Tuấn. Năm ngoái anh cũng đứng đúng chỗ này. Giờ anh là Associate 1. Tức là intern có lương.'],
        { fx: { rel: { tuan: 1 } } },
      ],
    },
    {
      who: 'obj:interview', obj: 'Vào phòng họp ngồi xuống: buổi phỏng vấn', time: '14:10', seat: 'mr_seat',
      scene: [
        ['hue', 'Chào em! Chị là Huệ, HR & Admin. Ở Cân Đối mình làm việc có quy trình, ăn trưa cũng có quy trình.'],
        ['thao', 'Chị là Thảo, Audit Manager. Chị hỏi nhanh thôi nhé. Mình làm một bài test nhỏ về Nợ – Có.'],
        ['nar', 'Chị Thảo lật một chiếc đồng hồ cát. Trên đó dán nhãn "TÀI SẢN CỦA PHÒNG QC – KHÔNG MANG RA NGOÀI".'],
        { mini: ACCT_QUIZ,
          good: [
            ['thao', 'Đúng cả. Đặc biệt câu cuối. Khách nói "tin chị đi" là lúc mình phải tin chị ít nhất.'],
            { fx: { uy: 5, rel: { thao: 2 }, set: { acct_quiz: true } } },
          ],
          bad: [
            ['thao', 'Sai vài câu. Không sao, Nợ – Có thì học được. Cái khó học là sự nghi ngờ nghề nghiệp.'],
            ['think', 'Mình vừa bị đánh giá là… quá tin người.'],
            { fx: { uy: 1, set: { acct_quiz: false } } },
          ],
        },
        ['thao', 'Câu hỏi thật: khách hàng tặng em một hộp quà Tết rất đẹp, "chút lộc thôi em". Em làm gì?'],
        { c: 'a0_gift', o: [
          { t: '"Em từ chối khéo, rồi báo Senior ạ."', fx: { uy: 4, rel: { thao: 2 }, set: { indep_minded: true } }, then: [
            ['thao', 'Đúng. Độc lập không phải khẩu hiệu. Là lý do người ta trả tiền cho chữ ký của mình.'],
          ] },
          { t: '"Em nhận rồi chia cho cả đoàn ạ."', fx: { dr: 2 }, then: [
            ['thao', 'Thế là cả đoàn cùng mất độc lập. Tinh thần đồng đội thì tốt, nhưng sai chỗ.'],
          ] },
          { t: '"Tùy hộp to hay nhỏ ạ."', fx: { dr: 4, rel: { thao: -1, hue: 1 } }, then: [
            ['nar', 'Chị Huệ bật cười, rồi kịp nín.'],
            ['thao', '…Thành thật. Chị sẽ nhớ câu này. Theo nghĩa đáng lo.'],
          ] },
        ] },
        ['nar', 'Cửa phòng họp mở hé. Một người đàn ông xanh xao bước vào, nheo mắt như vừa ra khỏi hang.'],
        ['khoa', 'Xin lỗi, anh ngồi nhờ năm phút. Phòng anh hết ghế. Mà… mấy giờ rồi em? Ngoài kia còn nắng không?'],
        { c: 'a0_khoa', o: [
          { t: '"Dạ 2 giờ chiều, nắng đẹp lắm anh ạ."', fx: { rel: { khoa: 2 } }, then: [
            ['khoa', 'Nắng à. Anh nhớ nắng. Lần cuối anh thấy nắng là tháng Một. Năm ngoái.'],
            ['thao', 'Khoa là Senior In-charge. Nếu em vào, em sẽ theo Khoa.'],
            ['think', 'Mình sẽ theo một người không thấy nắng từ tháng Một.'],
          ] },
          { t: '"Anh có cần em mở rèm giúp không ạ?"', fx: { rel: { khoa: 1 }, dr: 1 }, then: [
            ['khoa', 'Đừng. Mắt anh chưa sẵn sàng.'],
          ] },
        ] },
        ['thao', 'Giờ nói chuyện phụ cấp. Chị nói trước: phụ cấp cao thì việc nhiều. Phụ cấp thấp thì… việc vẫn nhiều, nhưng em ngủ được.'],
        { salary: true },
        { if: isTier('t0'), then: [['thao', 'Không lấy phụ cấp. Em tự tin nhỉ. Kinh nghiệm busy season đáng giá hơn tiền. Chị nói thế vì chị phải nói thế.'], ['hue', 'Em vẫn có trà gừng của cô Lụa và giấy xác nhận thực tập nhé.']] },
        { if: isTier('t1'), then: [['thao', 'Hợp lý. Có job thật, có Senior kèm.'], ['hue', 'Có cả vé gửi xe tháng. Tầng hầm B3, đi bộ lên mười một tầng thì tốt cho sức khỏe.']] },
        { if: isTier('t3'), then: [['thao', 'Ba triệu thì em sẽ có tên trên working paper. Sai thì người ta cũng thấy tên em.'], ['hue', 'Lát em qua bàn chị làm giấy tờ nhé.']] },
        { if: isTier('t5'), then: [['nar', 'Chị Huệ đặt bút xuống.'], ['hue', 'Em… chắc chưa?'], ['thao', 'Được. Năm triệu thì em đi kiểm kê đầu tiên, clear note cuối cùng. Chị sẽ nhớ tên em.'], ['khoa', '(thì thầm) Chào mừng đến với hang.']] },
        ['hue', 'Đây là thỏa thuận thực tập. Em đọc kỹ rồi ký nhé. Ở đây ai cũng đọc kỹ. Trừ thỏa thuận của chính mình.'],
        { mini: CONTRACT_MINI,
          good: [
            ['me', 'Chị ơi, em hỏi ba chỗ: kiểm kê "khi cần", giờ làm "theo budget", và phụ cấp "sau khi khách thanh toán" nghĩa là sao ạ?'],
            { if: isTier('t0'), then: [['hue', 'Ơ… em soi như soi chứng từ. Phụ cấp của em 0 đồng, nhưng chị vẫn sửa: 0 đồng cũng không chờ khách trả phí. Giờ làm thì… ghi đúng. Chị ghi tay nhé.']],
              else: [['hue', 'Ơ… em soi như soi chứng từ. Phụ cấp thì chị sửa: trả theo tháng, không chờ khách trả phí. Giờ làm thì… ghi đúng. Chị ghi tay nhé.']] },
            ['thao', 'Đọc kỹ trước khi ký. Tốt. Khách hàng của mình mà như em thì đỡ bao nhiêu thư quản lý.'],
            { fx: { uy: 4, rel: { thao: 1 }, set: { contract_fixed: true } } },
            ['nar', 'Ngoài cửa, Tuấn thì thầm: "Điều khoản kiểm kê thì không sửa được đâu. Kho không biết đọc hợp đồng."'],
          ],
          bad: [
            ['nar', 'Bạn ký. Chữ ký rất đẹp. Dòng "kiểm kê kể cả 2 giờ sáng" nằm im lặng ngay phía trên.'],
            { fx: { dr: 2, set: { contract_blind: true } } },
          ],
        },
        ['thao', 'Chào mừng em đến Cân Đối & Cộng Sự. Qua bàn chị Huệ làm nốt thủ tục nhé.'],
      ],
    },
    {
      who: 'hue', obj: 'Qua bàn chị Huệ (HR) làm thủ tục', time: '15:00', pos: { hue: 'hr' },
      scene: [
        ['hue', 'Ngồi đi em. Chị mở file nhân sự… file thứ ba. Hai file kia là của năm ngoái, không ai dám xoá.'],
        { if: isTier('t0'), then: [
          ['hue', 'Em không nhận phụ cấp nên không có gì để khấu trừ. Nhưng vẫn ký xác nhận. Hai bản.'],
          { fx: { rel: { hue: 1 } } },
        ] },
        { if: isTier('t1', 't3'), then: [
          ['hue', 'Phụ cấp của em dưới năm triệu một lần chi, nên công ty không khấu trừ thuế. Nhưng vẫn ký nhận. Hai bản. Bản gốc.'],
          { fx: { rel: { hue: 1 } } },
        ] },
        { if: isTier('t5'), then: [
          ['hue', 'Năm triệu đúng bằng ngưỡng. Khoản chi từ năm triệu trở lên mà em không có hợp đồng lao động thì công ty khấu trừ 10% thuế thu nhập cá nhân.'],
          ['hue', 'Nếu cả năm em ước tính thu nhập chưa tới mức phải nộp thuế, em làm bản cam kết, chị sẽ không khấu trừ. Em điền luôn nhé?'],
          { c: 'a0_tax', o: [
            { t: 'Điền bản cam kết ngay.', then: [
              { mini: TAXFORM_MINI,
                good: [['hue', 'Chuẩn rồi. Em điền đúng ô mã số thuế ngay lần đầu. Kiểm toán có khác.'], { fx: { rel: { hue: 2 }, set: { tax_commit: true } } }],
                bad: [
                  ['hue', 'Em điền nhầm ô rồi. Điền lại giúp chị nhé, bản gốc, không bút xoá.'],
                  ['nar', 'Lần thứ hai thì đúng. Bạn hiểu vì sao chị Huệ có ba hộp bút bi trên bàn.'],
                  { fx: { nl: -6, rel: { hue: 1 }, set: { tax_commit: true } } },
                ],
              },
            ] },
            { t: '"Hay chị chi cho em 4.999.999 đồng ạ?"', fx: { uy: 1, rel: { hue: 1 } }, then: [
              ['hue', 'Em vừa nghĩ ra cách mà một nửa khách hàng của mình đang làm đấy. Không nhé. Điền đi.'],
              { mini: TAXFORM_MINI,
                good: [['hue', 'Xong. Gọn.'], { fx: { set: { tax_commit: true } } }],
                bad: [['hue', 'Sai ô. Lại nhé.'], { fx: { nl: -6, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Chị cứ khấu trừ 10% ạ, em sợ giấy tờ."', fx: { set: { tax_commit: false } }, then: [
              ['hue', 'Một người sắp làm kiểm toán mà sợ giấy tờ. Thôi được. Mỗi lần nhận em được chín mươi phần trăm. Cuối năm tự quyết toán nhé.'],
            ] },
          ] },
        ] },
        ['me', 'Còn bảo hiểm thì sao ạ?'],
        ['hue', 'Em ký thỏa thuận thực tập, không phải hợp đồng lao động, nên công ty chưa đóng bảo hiểm xã hội cho em.'],
        ['hue', 'Đi kiểm kê thì công ty mua bảo hiểm tai nạn theo chuyến. Nhớ mang áo khoác. Bảo hiểm không chi trả cho việc lạnh.'],
        ['nar', '(Thông tin thuế và bảo hiểm trong game được đơn giản hóa, thông tin giải trí, không phải tư vấn pháp lý.)'],
      ],
    },
    {
      who: 'tuan', obj: 'Tuấn đợi ở pantry để dẫn đi một vòng', time: '15:30', pos: { tuan: 'pantry' },
      scene: [
        ['tuan', 'Xong thủ tục rồi hả? Ba điều cần nhớ.'],
        ['tuan', 'Một: "Tick xong chưa em?" không phải câu hỏi. Là lời chào.'],
        ['tuan', 'Hai: con mèo tên Số Dư. Nó nằm đâu thì chỗ đó cân. Đừng đuổi nó khỏi bàn phím, có lần nó gõ ra đúng số chênh lệch.'],
        ['tuan', 'Ba: email của chị Thảo gửi lúc 3 giờ sáng thì đọc lúc 7 giờ. Đừng trả lời lúc 3 giờ. Trả lời lúc 3 giờ là chị nhớ.'],
        { c: 'a0_tuan', o: [
          { t: '"Đợt này nhận bao nhiêu intern lên chính thức anh?"', fx: { rel: { tuan: 1 }, set: { knows_one_offer: true } }, then: [
            ['tuan', 'Một. Đợt này có hai intern. Em và Vy. Vy vào sớm hơn em một tuần, và nhanh hơn em một tuần.'],
            ['think', 'Một suất. Hai người. Một bảng cân đối không cân.'],
          ] },
          { t: '"Có mẹo gì để sống sót busy season không anh?"', fx: { uy: 1, rel: { tuan: 2 }, set: { tuan_tips: true } }, then: [
            ['tuan', 'Lưu file kèm giờ. Tick bằng đúng màu chị Diệp quy định. Và luôn có áo khoác trong balo. Kho lạnh không báo trước.'],
          ] },
        ] },
        { chat: [
          ['hue', 'Chào mừng {ten} đến với Cân Đối & Cộng Sự 🎉 Thứ Hai 8:30 có mặt, nhớ mang CCCD bản gốc nhé.'],
          ['tuan', 'Đã add em vào group "Hội Tick Mỏi Tay". Quy tắc: không nói chuyện công việc. Chỉ than.'],
          ['vy', 'Chào bạn intern mới 👋 Mình là Vy. Mình đã đọc hết hồ sơ năm ngoái rồi, có gì hỏi mình nha 😊'],
          ['khoa', '[Voice note 3:58] …'],
          ['nar', 'Bạn nghe voice note của anh Khoa. Ba phút năm mươi giây đầu là tiếng gõ phím. Tám giây cuối: "Thứ Hai mang áo khoác nhé."'],
        ] },
      ],
    },
  ],
  diary: (s) => `Buổi đầu tiên ở Cân Đối. Mình deal được mức ${({ t0: '0 đồng', t1: '1 triệu', t3: '3 triệu', t5: '5 triệu' })[s.tier] || '?'}. ${s.flags.acct_quiz ? 'Bài test Nợ – Có qua gọn. ' : 'Bài test Nợ – Có hơi run. '}${s.flags.contract_fixed ? 'Mình đọc kỹ thỏa thuận và đòi sửa được một dòng. ' : 'Mình ký thỏa thuận hơi nhanh. Có chữ "2 giờ sáng" ở đâu đó. '}Anh Khoa chưa thấy nắng từ tháng Một. Thứ Hai mang áo khoác.`,
};
