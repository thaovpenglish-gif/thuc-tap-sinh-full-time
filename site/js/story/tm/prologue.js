// "Buổi đầu tiên: Vòng phỏng vấn" — mandatory for every run. Ends with a chosen salary tier and a signed contract.
// Node formats: see story/dialogue.js. Mode-specific nodes handled by modes/solo.js:
//   { salary: true }                         4 salary cards, sets run.tier
//   { mini: <config>, good: [...], bad: [...] }   mini-game; good if score passes the tier's review bar (or config.pass)
// Tax/insurance lines follow the rules as of 11/2026 (withholding threshold 5,000,000 VND/payment since 1/7/2026),
// simplified for entertainment and shown with a disclaimer in-game.

const isTier = (...ids) => (s) => ids.includes(s.tier);

export const CONTRACT_MINI = {
  type: 'pick', title: 'Thỏa thuận thực tập', icon: '📄',
  prompt: 'Tìm 3 điều khoản "có vấn đề" trước khi ký.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Thực tập sinh tuân thủ nội quy và văn hóa công ty.' },
    { text: 'OT tự nguyện theo yêu cầu của quản lý.', correct: true },
    { text: 'Thời gian thực tập 3 tháng, có thể gia hạn đến khi có thông báo mới.', correct: true },
    { text: 'Phụ cấp được chi trả vào ngày 10 hằng tháng.' },
    { text: 'Thực tập sinh hỗ trợ các công việc khác khi được yêu cầu.', correct: true },
    { text: 'Bảo mật thông tin khách hàng và tài liệu nội bộ.' },
    { text: 'Được tham gia các buổi đào tạo nội bộ.' },
    { text: 'Nghỉ phép theo thỏa thuận với quản lý trực tiếp.' },
  ],
};

export const TAXFORM_MINI = {
  type: 'quiz', title: 'Bản cam kết thu nhập (mẫu hiện hành)', icon: '🧾',
  prompt: 'Điền đúng từng ô. Bản gốc. Không tẩy xóa.', time: 40, pass: 0.75,
  questions: [
    { q: 'Ô "Họ và tên"', options: ['Tên của em, viết hoa có dấu', 'Tên Facebook của em', 'T&M Partners'], correct: 0 },
    { q: 'Ô "Số định danh cá nhân"', options: ['Số điện thoại', '12 số trên Căn cước', 'Mã sinh viên'], correct: 1 },
    { q: 'Ô "Mã số thuế cá nhân"', options: ['Để trống vì em chưa đi làm', 'Mã số thuế cá nhân (thường là số định danh)', 'Số tài khoản ngân hàng'], correct: 1 },
    { q: 'Ô "Ký, ghi rõ họ tên"', options: ['Ký tắt', 'Ký và ghi rõ họ tên', 'Đóng dấu vân tay'], correct: 1 },
  ],
};

export const PROLOGUE = {
  title: 'Buổi đầu tiên',
  subtitle: 'Vòng phỏng vấn',
  intro: 'Chiều thứ Sáu, 14:00. Tầng 9 một tòa văn phòng ở trung tâm.\n\nTấm biển mạ vàng ghi: "T&M PARTNERS · We deliver excellence. Eventually."\n\nBạn chỉnh lại cổ áo, hít một hơi thật sâu. Hôm nay bạn đi phỏng vấn thực tập. Và cũng hôm nay, bạn sẽ phải deal lương.',
  pos: { tuyet: 'mr_head', phuong: 'mr_n1', bao: 'reception_side', han: 'han' },
  steps: [
    {
      who: 'gam', obj: 'Tới quầy lễ tân báo chị Gấm em đến phỏng vấn', time: '14:00',
      scene: [
        ['gam', 'Ơ… chào em. Em tìm ai nhỉ?'],
        ['me', 'Dạ em là {ten}, em đến phỏng vấn thực tập lúc 14 giờ ạ.'],
        ['gam', 'Phỏng vấn hôm nay hả? Chị tưởng thứ Sáu tuần sau…'],
        ['think', 'Hôm nay đúng là thứ Sáu.'],
        ['nar', 'Chị Gấm mở một cuốn sổ bìa da, lật từng trang rất chậm. Rất, rất chậm.'],
        { c: 'p_gam', o: [
          { t: 'Đứng chờ, mỉm cười lịch sự.', fx: { nl: -5, rel: { gam: 2 } }, then: [
            ['nar', 'Bốn phút sau, chị Gấm tìm thấy tên bạn. Viết bằng bút chì. Ở trang thứ Sáu tuần sau.'],
            ['gam', 'À đây rồi! Chị ghi nhầm tuần. Em đợi chút nhé, chị rót nước cho em.'],
          ] },
          { t: '"Chị xem giúp em email mời phỏng vấn được không ạ?"', fx: { uy: 2, rel: { gam: 1 } }, then: [
            ['gam', 'Email hả… à đây, có thật này. Ơ, chị xin lỗi em nhé.'],
            ['nar', 'Chị Gấm cười ngượng, rót cho bạn một ly trà đá.'],
          ] },
          { t: 'Nhắn Teams cho người trong thư mời.', fx: { dr: 2, rel: { thu: 1 } }, then: [
            { chat: [['thu', 'Cái này không phải việc của mình, nhưng mà… để mình hỏi nhé. Bạn chờ 2 phút ạ 🙏', true]] },
            ['gam', 'Ơ, Thư vừa nhắn chị. Có lịch thật. Em vào luôn nhé.'],
          ] },
        ] },
        ['bao', 'Phỏng vấn hả? Theo tao. Hồi tao mới vào đây ba năm trước cũng đứng đúng chỗ này.'],
        ['me', 'Anh là…?'],
        ['bao', 'Bảo. Senior Intern. Ba năm. Đừng hỏi tại sao. Phòng họp đi thẳng vào trong, cửa kính bên trái, chỗ tấm bảng "We deliver excellence" bị bong một chữ.'],
        { fx: { rel: { bao: 1 } } },
      ],
    },
    {
      who: 'obj:interview', obj: 'Vào phòng họp ngồi xuống: buổi phỏng vấn', time: '14:10', seat: 'mr_seat',
      scene: [
        ['phuong', 'Chào em! Chị là Phương, HR & Culture. Ở T&M mình như một gia đình á em. Ngồi đi, đừng run.'],
        ['tuyet', 'Chị là Tuyết, Chủ tịch T&M. Mình vào việc luôn nhé. Chị có hai câu hỏi.'],
        ['tuyet', 'Câu một: theo em, tư vấn chiến lược khác viết một báo cáo nghiên cứu ở chỗ nào?'],
        { c: 'p_q1', o: [
          { t: '"Báo cáo cho biết chuyện gì đang xảy ra. Tư vấn phải nói doanh nghiệp nên làm gì, và vì sao."', fx: { uy: 6, rel: { tuyet: 2 } }, then: [
            ['tuyet', 'Đúng. Phân tích thì nhiều người làm được. Business implication mới là thứ khách trả tiền.'],
          ] },
          { t: '"Tư vấn dùng nhiều framework hơn ạ: SWOT, PESTEL, 5 Forces…"', fx: { uy: 1 }, then: [
            ['tuyet', 'Framework là công cụ, không phải câu trả lời. Nhưng ít nhất em biết tên chúng.'],
          ] },
          { t: '"Tư vấn thì slide đẹp hơn ạ."', fx: { dr: 4, rel: { tuyet: -1, phuong: 1 } }, then: [
            ['nar', 'Chị Phương bật cười, rồi kịp nín.'],
            ['tuyet', '…Thành thật. Chị ghi nhận.'],
          ] },
        ] },
        ['tuyet', 'Câu hai: nếu chị và giám đốc trực tiếp của em giao hai việc ngược nhau, cùng deadline, em làm gì?'],
        { c: 'p_q2', o: [
          { t: '"Em hỏi lại cả hai để chốt ưu tiên, và xin xác nhận bằng văn bản."', fx: { uy: 5, rel: { tuyet: 1 }, set: { clarifier: true } }, then: [
            ['tuyet', 'Tốt. Ở đây cái gì không có văn bản thì coi như chưa từng tồn tại.'],
          ] },
          { t: '"Em làm theo chị ạ. Chị là Chủ tịch."', fx: { uy: 2, dr: 3 }, then: [
            ['tuyet', 'Nghe thì an toàn. Nhưng giám đốc của em sẽ không vui. Rồi em sẽ thấy.'],
          ] },
          { t: '"Em làm cả hai ạ. Em làm xuyên đêm."', fx: { uy: 1, nl: -5, set: { hero: true } }, then: [
            ['tuyet', 'Chị không cần người làm xuyên đêm. Chị cần người làm đúng việc.'],
            ['think', 'Sao nghe như câu này đã được nói với rất nhiều người.'],
          ] },
        ] },
        ['nar', 'Cửa phòng họp bật mở.'],
        ['han', 'Sorry sorry, mình chỉ ghé 5 giây thôi! Bạn intern mới hả? Em có growth mindset không?'],
        ['han', 'Bên chị đang cần người aligment được với cái big pitcher của công ty. Em hiểu ý chị chứ?'],
        { c: 'p_han', o: [
          { t: '"Dạ, ý chị là bức tranh tổng thể, và gắn chiến lược với kết quả kinh doanh ạ?"', fx: { uy: 3, rel: { han: 1 } }, then: [
            ['han', 'Exactly! Em hiểu chị ghê. Big pitcher. Bức… tranh. Đúng rồi.'],
            ['think', 'Chị ấy vừa hiểu nghĩa của từ đó cùng lúc với mình.'],
          ] },
          { t: 'Gật đầu thật tự tin: "Dạ hoàn toàn ạ."', fx: { dr: 2, rel: { han: 2 }, set: { nod_han: true } }, then: [
            ['han', 'Love it! Em có cái energy mà chị cần.'],
          ] },
          { t: '"Big pitcher là… cái bình to ạ?"', fx: { dr: 5, rel: { han: -1 } }, then: [
            ['han', '…'],
            ['tuyet', 'Picture, Hân ạ. Big picture.'],
            ['han', 'Thì chị nói picture mà.'],
          ] },
        ] },
        ['nar', 'Bốn phút small talk sau, chị Hân rời đi, để lại mùi nước hoa và hai buzzword mới trên bảng trắng.'],
        ['tuyet', 'Về câu trả lời của em, chị chỉ có một vài ý nhỏ thôi.'],
        ['nar', '(Bảy ý. Bạn ghi kịp bốn.)'],
        ['tuyet', 'Ý cuối: chị nghĩ các em cần nhìn vấn đề này ở góc độ chiến lược hơn.'],
        ['tuyet', 'Giờ nói chuyện phụ cấp. Em muốn mức nào? Nói trước: lương nào việc nấy.'],
        { salary: true },
        { if: isTier('t0'), then: [['tuyet', 'Không lấy phụ cấp. Em tự tin nhỉ. Chị thích.'], ['phuong', 'Em vẫn được ăn trưa miễn phí ở pantry nha. Và có giấy xác nhận thực tập.']] },
        { if: isTier('t1'), then: [['tuyet', 'Hợp lý. Có việc thật, có người hướng dẫn.'], ['phuong', 'Có cả vé gửi xe tháng nữa nha em!']] },
        { if: isTier('t3'), then: [['tuyet', 'Ba triệu thì em được giao việc độc lập. Sai thì em chịu trách nhiệm.'], ['phuong', 'Lát em qua chị Quỳnh ký giấy tờ nhé.']] },
        { if: isTier('t5'), then: [['nar', 'Chị Phương đặt bút xuống.'], ['phuong', 'Em… chắc chưa?'], ['tuyet', 'Được. Năm triệu thì từ thứ Hai, em là gương mặt của đợt intern này. Chị sẽ nhớ tên em.'], ['think', 'Câu đó vừa là lời khen, vừa là lời đe dọa.']] },
        ['phuong', 'Đây là thỏa thuận thực tập. Em đọc kỹ rồi ký nhé. Chị cho em… ba mươi giây. Đùa thôi. Nhưng em đọc nhanh nha.'],
        { mini: CONTRACT_MINI,
          good: [
            ['me', 'Chị Phương ơi, em hỏi ba chỗ: OT "tự nguyện theo yêu cầu", "gia hạn đến khi có thông báo mới", và "hỗ trợ các công việc khác" nghĩa là sao ạ?'],
            ['phuong', 'Ơ… em đọc kỹ ghê. OT thì… tùy em. Thật mà. Còn gia hạn thì chị ghi rõ tối đa 3 tháng nhé.'],
            ['tuyet', 'Đọc kỹ trước khi ký. Tốt. Khách hàng của mình cũng nên như em.'],
            { fx: { uy: 4, set: { contract_fixed: true } } },
            ['nar', 'Qua khe cửa, Bảo thì thầm: "Gia hạn đến khi có thông báo mới. Tao là thông báo mới đây."'],
          ],
          bad: [
            ['nar', 'Bạn ký. Chữ ký rất đẹp. Điều khoản "OT tự nguyện theo yêu cầu" nằm im lặng ngay phía trên.'],
            { fx: { dr: 2, set: { contract_blind: true } } },
          ],
        },
        ['tuyet', 'Chào mừng em đến với T&M Partners. Qua chị Quỳnh làm nốt thủ tục nhé.'],
      ],
    },
    {
      who: 'quynh', obj: 'Qua bàn chị Quỳnh (Kế toán) làm thủ tục', time: '15:00',
      scene: [
        ['quynh', 'Em là bạn intern mới hả? Ngồi đi. Để chị kiểm tra lại file đã nhé.'],
        ['nar', 'Chị Quỳnh mở ba file Excel cùng lúc. Không file nào có tên bạn.'],
        ['quynh', 'À, chị thêm em vào file thứ tư.'],
        { if: isTier('t0'), then: [
          ['quynh', 'Em không nhận phụ cấp nên không có gì để khấu trừ. Nhưng vẫn ký xác nhận. Ba bản.'],
          { fx: { rel: { quynh: 1 } } },
        ] },
        { if: isTier('t1', 't3'), then: [
          ['quynh', 'Phụ cấp của em dưới năm triệu một lần chi, không bị khấu trừ thuế. Nhưng em vẫn phải ký nhận. Ba bản. Bản gốc.'],
          { if: isTier('t3'), then: [['quynh', 'Hồi đầu năm mức này còn bị trừ đấy. Từ tháng Bảy ngưỡng lên năm triệu rồi. Em may.']] },
          { fx: { rel: { quynh: 1 } } },
        ] },
        { if: isTier('t5'), then: [
          ['quynh', 'Năm triệu đúng bằng ngưỡng. Khoản chi từ năm triệu trở lên mà em không có hợp đồng lao động thì công ty phải khấu trừ 10% thuế thu nhập cá nhân.'],
          ['quynh', 'Nếu cả năm em ước tính thu nhập chưa tới mức phải nộp thuế thì em làm bản cam kết, chị sẽ không khấu trừ. Em điền luôn nhé?'],
          { c: 'p_tax', o: [
            { t: '"Hay chị chi cho em 4.990.000 đồng ạ?"', fx: { uy: 1, rel: { quynh: 1 } }, then: [
              ['nar', 'Chị Quỳnh nhìn bạn ba giây, rồi bật cười.'],
              ['quynh', 'Em có business sense đấy. Nhưng thỏa thuận ghi năm triệu rồi em ạ. Điền bản cam kết đi.'],
              { mini: TAXFORM_MINI,
                good: [['quynh', 'Chuẩn rồi.'], { fx: { rel: { quynh: 1 }, set: { tax_commit: true } } }],
                bad: [['quynh', 'Em điền nhầm ô rồi. Em điền lại giúp chị nhé, bản gốc.'], { fx: { nl: -6, set: { tax_commit: true } } }],
              },
            ] },
            { t: 'Điền tờ cam kết ngay.', then: [
              { mini: TAXFORM_MINI,
                good: [['quynh', 'Chuẩn rồi. Hiếm intern nào điền đúng ô mã số thuế ngay lần đầu.'], { fx: { rel: { quynh: 2 }, set: { tax_commit: true } } }],
                bad: [
                  ['quynh', 'Em điền nhầm ô rồi. Em điền lại giúp chị nhé, bản gốc.'],
                  ['nar', 'Lần thứ hai thì đúng. Bạn bắt đầu hiểu vì sao chị Quỳnh luôn trông mệt.'],
                  { fx: { nl: -6, rel: { quynh: 1 }, set: { tax_commit: true } } },
                ],
              },
            ] },
            { t: '"Chị cứ khấu trừ 10% ạ, em không rành giấy tờ."', fx: { set: { tax_commit: false } }, then: [
              ['quynh', 'Ừ, vậy mỗi tháng em nhận chín mươi phần trăm nhé. Cuối năm em tự quyết toán.'],
            ] },
          ] },
        ] },
        ['me', 'Còn bảo hiểm thì sao ạ?'],
        ['quynh', 'Em ký thỏa thuận thực tập, không phải hợp đồng lao động, nên công ty chưa đóng bảo hiểm xã hội cho em.'],
        ['quynh', 'Bảo hiểm của em là… Mai. Có gì khẩn cấp cứ tìm Mai.'],
        ['nar', '(Thông tin thuế và bảo hiểm trong game được đơn giản hóa để giải trí, không phải tư vấn pháp lý.)'],
      ],
    },
    {
      who: 'bao', obj: 'Bảo đợi ở pantry để dẫn đi một vòng', time: '15:30', pos: { bao: 'pantry_bao' },
      scene: [
        ['bao', 'Xong thủ tục rồi hả? Ba điều cần nhớ ở đây.'],
        ['bao', 'Một: pantry là vùng trung lập. Không ai được giao việc ở đây. Trên lý thuyết.'],
        ['bao', 'Hai: con mèo tên KPI. Nó là Employee of the Month. Đừng ngồi ghế nó.'],
        ['bao', 'Ba: đừng bao giờ hỏi "ai phụ trách việc này". Câu trả lời luôn là chị Thư. Mà chị Thư không phụ trách.'],
        { c: 'p_bao', o: [
          { t: '"Anh thực tập ba năm thật hả?"', fx: { rel: { bao: 2 } }, then: [
            ['bao', 'Ba năm, hai tháng, mười bốn ngày. Mỗi lần xin ký hợp đồng thì người ta bảo "để chị hỏi".'],
            ['think', 'Câu "để chị hỏi" ở đây có vẻ là một thế lực siêu nhiên.'],
          ] },
          { t: '"Có mẹo gì để sống sót không anh?"', fx: { uy: 1, rel: { bao: 1 }, set: { bao_tips: true } }, then: [
            ['bao', 'Lưu file luôn kèm ngày giờ. Luôn hỏi lại brief của chị Hân. Và trưa nào cũng ngồi với nhóm Mai, Long, Trang.'],
          ] },
        ] },
        { chat: [
          ['phuong', 'Chào mừng {ten} đến với gia đình T&M 💖🎉 Thứ Hai gặp nhau nha!'],
          ['mai', 'welcome em 👋 thứ Hai có gì cứ hỏi chị'],
          ['long', 'Chào đồng chí. Lời khuyên đầu tiên: đừng bao giờ tin chữ FINAL.'],
          ['trang', 'Welcome bạn ơi 🌸'],
          ['han', 'Welcome onboard! Let\'s synergy 🚀'],
          ['nar', 'Group "T&M Family 💖" có 47 tin nhắn chưa đọc.'],
        ] },
      ],
    },
  ],
  diary: (s) => `Buổi đầu tiên. Mình deal được mức ${({ t0: '0 đồng', t1: '1 triệu', t3: '3 triệu', t5: '5 triệu' })[s.tier] || '?'}. ${s.flags.contract_fixed ? 'Mình đọc kỹ thỏa thuận và đòi sửa được một điều khoản. ' : 'Mình ký thỏa thuận hơi nhanh. Hy vọng không sao. '}Anh Bảo thực tập ba năm rồi. Chị Gấm ghi nhầm lịch. Thứ Hai bắt đầu.`,
};
