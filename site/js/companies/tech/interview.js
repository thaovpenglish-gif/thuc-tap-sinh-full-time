// Nợ Kỹ Thuật Labs — Day 0: phỏng vấn. Take-home test, culture fit, deal phụ cấp, NDA, thuế/bảo hiểm.
// Thuế/bảo hiểm: đơn giản hóa để giải trí (ngưỡng khấu trừ 10% cho khoản chi từ 5 triệu/lần từ 1/7/2026).

const isTier = (...ids) => (s) => ids.includes(s.tier);

export const NDA_MINI = {
  type: 'pick', title: 'NDA + Thỏa thuận thực tập (v7_final)', icon: '📄',
  prompt: 'Tìm 3 điều khoản "có vấn đề" trước khi ký. Chị Ngân đang mỉm cười rất rộng.', pick: 3, time: 40, pass: 0.66,
  items: [
    { text: 'Bảo mật mã nguồn và dữ liệu người dùng của app Lúa.' },
    { text: 'Mọi ý tưởng thực tập sinh nghĩ ra, kể cả ngoài giờ và trong mơ, thuộc sở hữu công ty.', correct: true },
    { text: 'Thực tập sinh tham gia on-call tự nguyện 24/7 khi được yêu cầu.', correct: true },
    { text: 'Không làm việc cho bất kỳ công ty công nghệ nào trong 24 tháng sau khi kết thúc thực tập.', correct: true },
    { text: 'Phụ cấp được chuyển khoản vào ngày 5 hằng tháng.' },
    { text: 'Được cấp laptop và tài khoản công ty trong thời gian thực tập.' },
    { text: 'Không chia sẻ thông tin vòng gọi vốn ra bên ngoài.' },
    { text: 'Có người hướng dẫn (mentor) trong suốt kỳ thực tập.' },
  ],
};

export const TAXFORM_MINI = {
  type: 'quiz', title: 'Bản cam kết thu nhập (để chưa bị khấu trừ 10%)', icon: '🧾',
  prompt: 'Chị Thảo đưa form. Điền đúng từng ô, bản gốc, không tẩy xóa.', time: 40, pass: 0.75,
  questions: [
    { q: 'Ô "Họ và tên"', options: ['Tên của em, viết hoa có dấu', 'Username GitHub của em', 'Nợ Kỹ Thuật Labs'], correct: 0 },
    { q: 'Ô "Số định danh cá nhân"', options: ['Số điện thoại', '12 số trên Căn cước', 'Mã sinh viên'], correct: 1 },
    { q: 'Ô "Ước tính thu nhập cả năm"', options: ['Ghi trung thực, dưới mức phải nộp thuế', 'Ghi "Series B xong thì nhiều"', 'Để trống cho bí ẩn'], correct: 0 },
    { q: 'Ô "Ký, ghi rõ họ tên"', options: ['Ký tắt', 'Ký và ghi rõ họ tên', 'Dán emoji ✍️'], correct: 1 },
  ],
};

export const INTERVIEW = {
  title: 'Buổi đầu tiên',
  subtitle: 'Vòng phỏng vấn (sau bài take-home "nhỏ thôi")',
  intro: 'Chiều thứ Sáu, 14:00. Một coworking ở quận 1. Cửa kính dán decal: "NỢ KỸ THUẬT LABS · Flat. Fast. Fun."\n\nTuần trước bạn nhận bài take-home "nhỏ thôi, làm 2 tiếng". Đề bài: dựng lại toàn bộ app Lúa, có thanh toán.\n\nHôm nay là vòng phỏng vấn. Và cũng hôm nay, bạn sẽ phải deal phụ cấp.',
  pos: { diep: 'meeting_head', khai: 'mr_n1', ngan: 'mr_n2' },
  steps: [
    {
      who: 'hoa', obj: 'Tới quầy lễ tân báo chị Hoa em đến phỏng vấn', time: '14:00',
      scene: [
        ['hoa', 'Em phỏng vấn hả? Ngồi đợi xíu nha. Phòng họp đang bận, anh Kevin đang quay video LinkedIn trong đó.'],
        ['nar', 'Qua vách kính, một người đàn ông mặc hoodie đứng trước ring light, nói vào điện thoại: "Failure is just data."'],
        ['hoa', 'Em ngồi tạm ghế bi lắc nha. Mình là startup mà em.'],
        { c: 'p_tech_hoa', o: [
          { t: 'Ngồi ghế bi lắc, mỉm cười.', fx: { nl: -3, rel: { hoa: 2 } }, then: [
            ['nar', 'Ghế bi lắc không có lưng tựa. Bạn ngồi thẳng như đang thuyết trình trước hội đồng.'],
            ['hoa', 'Em ngồi chuẩn ghê. Nước tăng lực không? Free. Cái gì free ở đây là nước tăng lực.'],
          ] },
          { t: 'Hỏi chị Hoa wifi để mở lại bài take-home.', fx: { uy: 1, rel: { hoa: 1 } }, then: [
            ['hoa', 'Wifi "NoKyThuat_5G", mật khẩu "ShipFirst!". Hôm qua đổi, nên chắc là "FixLater!".'],
            ['think', 'Mật khẩu là "FixLater!". Mình bắt đầu hiểu công ty này.'],
          ] },
          { t: 'Xem standee "We\'re hiring!" cạnh cửa.', fx: { dr: 1 }, then: [
            ['nar', 'Dòng chữ nhỏ dưới cùng standee: "(đang freeze tuyển dụng)". Ai đó dán băng keo lên chữ "freeze", nhưng không kín.'],
          ] },
        ] },
        ['tung', 'Ê, ứng viên hả? Phòng họp xong rồi kìa. Vào đi. Đừng nhắc chữ "deploy", anh Khải đang nhạy cảm.'],
        { fx: { rel: { tung: 1 } } },
      ],
    },
    {
      who: 'obj:interview', obj: 'Vào phòng "Bún Bò" ngồi xuống: buổi phỏng vấn', time: '14:10', seat: 'mr_seat',
      scene: [
        ['diep', 'Chào em, chị là Diệp, Senior PM. Đây là anh Khải, Tech Lead. Mình đi theo framework STAR nha: Situation, Task, Action, Result.'],
        ['khai', 'Chào em.'],
        ['diep', 'Bài take-home của em. Đề là "dựng lại app Lúa trong 2 tiếng". Em làm thế nào?'],
        { c: 'p_tech_takehome', o: [
          { t: '"Em làm 2 tiếng đúng hạn: một màn đi chợ chạy được, kèm README ghi rõ phần chưa làm."', fx: { uy: 5, rel: { diep: 2, khai: 1 }, set: { takehome_scope: true } }, then: [
            ['diep', 'Scope hóa đề bài. Đúng tư duy MVP. Chị chấm em Must-have.'],
            ['khai', 'README có ghi phần chưa làm. Hiếm. Ở đây người ta chỉ ghi phần đã làm. Hoặc không ghi gì.'],
          ] },
          { t: '"Em làm ba ngày ba đêm, có cả thanh toán và dark mode ạ."', fx: { uy: 2, nl: -5, rel: { khai: 1 }, set: { takehome_hero: true } }, then: [
            ['khai', 'Ba ngày cho bài hai tiếng. Em estimate giống team mình. Em sẽ hợp ở đây.'],
            ['think', 'Không biết đó là lời khen hay lời cảnh báo.'],
          ] },
          { t: '"Em hỏi lại bên tuyển dụng phạm vi trước khi làm, nhưng không ai trả lời ạ."', fx: { uy: 3, dr: 1, rel: { diep: 1 } }, then: [
            ['diep', 'Hỏi lại requirement là tốt. Không ai trả lời là… đặc trưng văn hóa. Em sẽ quen.'],
          ] },
        ] },
        ['khai', 'Câu kỹ thuật. Một API trả về chậm 3 giây. Em xử lý sao?'],
        { c: 'p_tech_api', o: [
          { t: '"Đo trước đã ạ: log, xem chậm ở database, mạng hay code, rồi mới sửa."', fx: { uy: 5, rel: { khai: 2 } }, then: [
            ['khai', 'Đúng. Đo trước. Em biết không, câu trả lời chuẩn là "it depends". Nhưng của em cũng được.'],
          ] },
          { t: '"Thêm cache ạ."', fx: { uy: 2 }, then: [['khai', 'Cache là đáp án cho mọi câu hỏi. Và là nguyên nhân của một nửa số bug. It depends.']] },
          { t: '"It depends ạ."', fx: { dr: 2, rel: { khai: 2 } }, then: [
            ['nar', 'Anh Khải nhìn bạn rất lâu. Lần đầu tiên trong buổi, anh mỉm cười.'],
            ['khai', 'Em học nhanh đấy.'],
          ] },
        ] },
        ['nar', 'Cửa phòng bật mở. Người đàn ông mặc hoodie bước vào, tay vẫn cầm ring light.'],
        ['kevin', 'Hi! Anh là Kevin. Quân cũng được, nhưng nhà đầu tư gọi Kevin. Anh chỉ hỏi một câu culture fit thôi.'],
        ['kevin', 'Ở đây mình "flat". Không sếp, không lính. Em có sẵn sàng làm việc trong môi trường flat không?'],
        { c: 'p_tech_flat', o: [
          { t: '"Dạ flat thì ai là người ra quyết định cuối cùng ạ?"', fx: { uy: 3, dr: 2, rel: { kevin: -1, diep: 1 } }, then: [
            ['kevin', 'Cả team! Dân chủ hoàn toàn. Rồi anh chốt.'],
            ['think', 'Flat. Như một kim tự tháp nhìn từ trên xuống.'],
          ] },
          { t: '"Em sẵn sàng ạ! Em thích không có sếp."', fx: { rel: { kevin: 2 }, set: { flat_fan: true } }, then: [
            ['kevin', 'Love it! Em có startup DNA. Anh sẽ nhắc tên em trong bài LinkedIn tối nay. Không ghi tên, nhưng nhắc.'],
          ] },
          { t: '"Flat là lương cũng flat ạ?"', fx: { dr: 4, rel: { kevin: -1, khai: 1 } }, then: [
            ['nar', 'Anh Khải ho một tiếng để che tiếng cười.'],
            ['kevin', 'Haha. Hài. Mình có ESOP em ạ. ESOP là… tương lai.'],
          ] },
        ] },
        ['kevin', 'Ok anh phải đi call với quỹ đây. Let\'s think big!'],
        ['nar', 'Anh Kevin đi, để lại ring light vẫn sáng. Không ai tắt nó.'],
        ['diep', 'Giờ mình nói về phụ cấp. Chị theo framework "lương nào việc nấy". Em chọn mức nào?'],
        { salary: true },
        { if: isTier('t0'), then: [['diep', 'Không phụ cấp. Ok. Em vẫn có nước tăng lực free và giấy xác nhận thực tập.'], ['khai', 'Và không ai bắt em on-call. Chắc vậy.']] },
        { if: isTier('t1'), then: [['diep', 'Hợp lý. Có mentor, có ticket thật. Mentor là anh Khải, khi anh ấy rảnh. Tức là thỉnh thoảng.']] },
        { if: isTier('t3'), then: [['diep', 'Ba triệu thì em nhận ticket độc lập. Em sẽ được add vào kênh #incident. Chỉ để đọc. Ban đầu.']] },
        { if: isTier('t5'), then: [['nar', 'Anh Khải tháo một bên tai nghe.'], ['khai', 'Em chắc chưa?'], ['diep', 'Năm triệu thì em là intern "full-stack": BA, QA, dev, slide cho anh Kevin. Chị ghi Must-have.'], ['think', 'Full-stack. Mình vừa nhận lời làm cả cái stack.']] },
        ['diep', 'Chị Ngân bên People sẽ đưa em NDA và thỏa thuận thực tập. Đọc kỹ nha.'],
        ['ngan', 'Chào em! Chị là Ngân, People & Culture. Ở đây mình là một gia đình. Em ký giúp chị nha, bản này là v7_final.'],
        { mini: NDA_MINI,
          good: [
            ['me', 'Chị ơi, em hỏi ba chỗ: ý tưởng "trong mơ" thuộc công ty, on-call "tự nguyện 24/7", và cấm làm công ty công nghệ 24 tháng ạ?'],
            ['ngan', 'Ơ… bản này copy từ template công ty Mỹ. Chị gạch ba dòng đó nha. Giấc mơ của em là của em.'],
            ['khai', 'Đọc NDA kỹ hơn đọc code review. Tốt.'],
            { fx: { uy: 4, rel: { khai: 1 }, set: { nda_fixed: true } } },
          ],
          bad: [
            ['nar', 'Bạn ký. Ở trang 6, dòng chữ "kể cả trong mơ" nằm im lặng.'],
            ['think', 'Từ tối nay, chắc mình nên mơ ít lại.'],
            { fx: { dr: 2, set: { nda_blind: true } } },
          ],
        },
        ['diep', 'Welcome to Nợ Kỹ Thuật Labs. Qua chị Thảo làm nốt thủ tục nha.'],
      ],
    },
    {
      who: 'thao', obj: 'Qua phòng chị Thảo (COO) làm thủ tục', time: '15:00',
      scene: [
        ['thao', 'Em ngồi đi. Chị là Thảo, COO. Ở đây chị lo tiền, lo giấy tờ, lo luôn việc không ai lo.'],
        ['nar', 'Màn hình chị Thảo mở một file Excel tên "Runway_v12_KHONG_GUI_KEVIN.xlsx". Chị kéo cửa sổ xuống rất nhanh.'],
        { if: isTier('t0'), then: [
          ['thao', 'Em không nhận phụ cấp nên không có gì để khấu trừ. Ký xác nhận một bản. Bản mềm cũng được, mình là startup.'],
          { fx: { rel: { thao: 1 } } },
        ] },
        { if: isTier('t1', 't3'), then: [
          ['thao', 'Phụ cấp của em dưới năm triệu mỗi lần chi nên không bị khấu trừ thuế thu nhập cá nhân. Ký nhận là xong.'],
          { if: isTier('t3'), then: [['thao', 'Đầu năm nay mức này còn bị trừ đấy. Từ tháng Bảy ngưỡng lên năm triệu một lần chi rồi.']] },
          { fx: { rel: { thao: 1 } } },
        ] },
        { if: isTier('t5'), then: [
          ['thao', 'Năm triệu đúng ngưỡng. Khoản chi từ năm triệu một lần cho người không có hợp đồng lao động thì công ty khấu trừ 10%.'],
          ['thao', 'Nếu cả năm em ước tính chưa tới mức phải nộp thuế thì làm bản cam kết, chị tạm chưa khấu trừ. Em điền không?'],
          { c: 'p_tech_tax', o: [
            { t: 'Điền bản cam kết ngay.', then: [
              { mini: TAXFORM_MINI,
                good: [['thao', 'Chuẩn. Em điền form còn kỹ hơn team điền Jira.'], { fx: { rel: { thao: 2 }, set: { tax_commit: true } } }],
                bad: [['thao', 'Em điền nhầm ô rồi. Điền lại nha, bản gốc. Ở đây code thì sửa được, giấy thuế thì không.'], { fx: { nl: -6, rel: { thao: 1 }, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Chị chi 4.990.000 cho tròn được không ạ?"', fx: { uy: 1, rel: { thao: 1 } }, then: [
              ['thao', 'Em có tư duy tối ưu chi phí. Chị thích. Nhưng hợp đồng ghi năm triệu rồi. Điền cam kết đi.'],
              { mini: TAXFORM_MINI,
                good: [['thao', 'Xong. Gọn.'], { fx: { set: { tax_commit: true } } }],
                bad: [['thao', 'Sai một ô. Điền lại giúp chị.'], { fx: { nl: -6, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Chị cứ khấu trừ 10% ạ."', fx: { set: { tax_commit: false } }, then: [
              ['thao', 'Ừ. Mỗi tháng em nhận chín mươi phần trăm. Cuối năm em tự quyết toán nhé.'],
            ] },
          ] },
        ] },
        ['me', 'Còn bảo hiểm thì sao ạ?'],
        ['thao', 'Thỏa thuận thực tập không phải hợp đồng lao động, nên công ty chưa đóng bảo hiểm xã hội cho em.'],
        ['thao', 'Lên chính thức thì em đóng 10,5%: 8% hưu trí, 1,5% y tế, 1% thất nghiệp. Còn giờ bảo hiểm của em là… cẩn thận.'],
        ['nar', '(Thông tin thuế và bảo hiểm trong game được đơn giản hóa: thông tin giải trí, không phải tư vấn pháp lý.)'],
      ],
    },
    {
      who: 'tung', obj: 'Tùng đợi ở pantry để dẫn đi một vòng', time: '15:30', pos: { tung: 'pantry' },
      scene: [
        ['tung', 'Xong thủ tục rồi hả? Ba luật sống sót ở Nợ Kỹ Thuật.'],
        ['tung', 'Một: không deploy chiều thứ Sáu. Luật có từ "Thứ Sáu Đen" năm 2023. Không ai kể chi tiết. Anh Thạc vẫn còn run.'],
        ['tung', 'Hai: con mèo tên 404. Cần nó thì không bao giờ thấy. Không cần thì nó nằm trên bàn phím.'],
        ['tung', 'Ba: anh Kevin nói "chừng hai tiếng" thì nhân mười. Anh Khải nói "it depends" thì nghĩa là không.'],
        { c: 'p_tech_tung', o: [
          { t: '"Anh làm ở đây lâu chưa?"', fx: { rel: { tung: 2 } }, then: [
            ['tung', 'Hai năm. Lâu thứ ba công ty. Ở startup hai năm là lão làng. Ba năm là cổ đông. Mà không có cổ phần.'],
          ] },
          { t: '"Có mẹo gì để sống sót không anh?"', fx: { uy: 1, rel: { tung: 1 }, set: { tung_tips: true } }, then: [
            ['tung', 'Đọc trang Confluence "Rollback" trước khi cần nó. Viết năm 2022 nhưng vẫn đúng. Là tài liệu duy nhất còn đúng.'],
            ['think', 'Ghi nhớ: Confluence, "Rollback". Nghe như một câu thần chú.'],
          ] },
        ] },
        { chat: [
          ['ngan', 'Welcome {ten} đến với gia đình Nợ Kỹ Thuật 💐🎉 Thứ Hai gặp nhau nha!'],
          ['kevin', 'Welcome onboard! Let\'s think big 🚀🚀🚀'],
          ['loc', '🔥'],
          ['nguyet', 'welcome em. thứ Hai chị cho em mượn 7 cái điện thoại test 😌'],
          ['bot', 'Deploy succeeded 🙏 (staging)'],
          ['nar', 'Kênh #general có 112 tin nhắn chưa đọc. 80 cái là "+1".'],
        ] },
      ],
    },
  ],
  diary: (s) => `Buổi đầu tiên. Mình deal được mức ${({ t0: '0 đồng', t1: '1 triệu', t3: '3 triệu', t5: '5 triệu' })[s.tier] || '?'}. ${s.flags.nda_fixed ? 'Mình đọc kỹ NDA và giữ lại được giấc mơ của mình. ' : 'Mình ký NDA hơi nhanh. Từ giờ chắc mơ cũng phải có ticket. '}Anh Kevin nói "flat" ba lần. Mật khẩu wifi là "FixLater!".`,
};
