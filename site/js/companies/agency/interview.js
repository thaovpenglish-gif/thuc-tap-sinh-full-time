// Trend Trễ Agency — day 0: the interview. Portfolio roast, 30-second slogan brainstorm, salary, contract, tax.
// Tax/insurance lines are simplified (withholding threshold 5,000,000 VND/payment since 1/7/2026) and carry a disclaimer.

const isTier = (...ids) => (s) => ids.includes(s.tier);

export const SLOGAN_MINI = {
  type: 'pick', title: 'Brainstorm 30 giây', icon: '💡',
  prompt: 'Mì Ông Táo cần slogan Tết. Chọn 3 câu "dùng được". Anh Khải đang bấm giờ.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Ông Táo lên trời, mì Ông Táo ở lại.', sub: 'gắn tên brand với Tết', correct: true },
    { text: 'Hương vị đỉnh cao, chất lượng tuyệt hảo.', sub: 'câu của mọi brand trên đời' },
    { text: 'Về nhà, nấu một gói, thêm một người.', sub: 'có người, có chuyện', correct: true },
    { text: 'Ăn Mì Hảo Hạng, Tết Hảo Hạng.', sub: 'tên của đối thủ' },
    { text: 'Tết nào cũng có Táo.', sub: 'ngắn, dễ nhớ', correct: true },
    { text: 'Sáng tạo không giới hạn.', sub: 'nhìn quen quen…' },
  ],
};

export const CONTRACT_MINI = {
  type: 'pick', title: 'Thỏa thuận thực tập (mẫu 2019)', icon: '📄',
  prompt: 'Tìm 3 điều khoản "có vấn đề" trước khi ký.', pick: 3, time: 40, pass: 0.66,
  items: [
    { text: 'Thực tập sinh bảo mật thông tin client và tài liệu pitch.' },
    { text: 'Mọi ý tưởng phát sinh trong và ngoài giờ làm, kể cả trong mơ, thuộc về công ty.', correct: true },
    { text: 'Thực tập sinh sẵn sàng hỗ trợ client ngoài giờ bất cứ khi nào client cần.', correct: true },
    { text: 'Phụ cấp (nếu có) chi trả vào ngày 10 hằng tháng.' },
    { text: 'Thời gian thực tập 3 tháng, có thể kéo dài đến khi chiến dịch Tết kết thúc.', correct: true },
    { text: 'Được tham gia brainstorm và các buổi review nội bộ.' },
    { text: 'Ghi timesheet trung thực vào thứ Sáu hằng tuần.' },
    { text: 'Nghỉ phép báo trước cho quản lý trực tiếp.' },
  ],
};

export const TAX_MINI = {
  type: 'quiz', title: 'Bản cam kết thu nhập (mẫu hiện hành)', icon: '🧾',
  prompt: 'Điền đúng từng ô. Bản gốc. Không tẩy xóa. Không sticker.', time: 40, pass: 0.75,
  questions: [
    { q: 'Ô "Họ và tên"', options: ['Tên em, viết hoa có dấu', 'Tên TikTok của em', 'Trend Trễ Agency'], correct: 0 },
    { q: 'Ô "Số định danh cá nhân"', options: ['Số điện thoại', '12 số trên Căn cước', 'Mã số sinh viên'], correct: 1 },
    { q: 'Ô "Mã số thuế cá nhân"', options: ['Để trống vì em chưa đi làm', 'Mã số thuế cá nhân (thường là số định danh)', 'Mã giảm giá trà sữa'], correct: 1 },
    { q: 'Ô "Ký, ghi rõ họ tên"', options: ['Ký và ghi rõ họ tên', 'Vẽ chữ ký bằng font Vỹ chọn', 'Thả sticker 👍'], correct: 0 },
  ],
};

export const INTERVIEW = {
  title: 'Buổi đầu tiên',
  subtitle: 'Phỏng vấn ở Trend Trễ',
  intro: 'Chiều thứ Sáu, 14:00. Một căn nhà phố cải tạo thành văn phòng, tầng trệt dán decal hồng neon.\n\nTấm biển nhấp nháy: "TREND TRỄ · Bắt trend. Hơi trễ. Nhưng bắt."\n\nTrong balo bạn có một portfolio in màu, ba ý tưởng "để dành" và một chút tự tin. Hôm nay phỏng vấn thực tập, và deal phụ cấp.',
  pos: { diep: 'meeting_head', khai: 'mr_n1', suong: 'reception' },
  steps: [
    {
      who: 'suong', obj: 'Tới quầy lễ tân báo em đến phỏng vấn', time: '14:00',
      scene: [
        ['nar', 'Quầy lễ tân không có lễ tân. Chỉ có Sương, ba cái điện thoại và một ly cà phê đá đã tan hết đá.'],
        ['suong', 'Chờ chị xíu… "Dạ bên em xin lỗi vì trải nghiệm chưa trọn vẹn ạ 🥺"… rồi. Em tìm ai?'],
        ['me', 'Dạ em là {ten}, em đến phỏng vấn thực tập lúc 14 giờ ạ.'],
        ['suong', 'À intern! Chị Diệp có dặn. Mà chị Diệp đang nghe hai cuộc gọi cùng lúc, em đợi chị ấy cúp một cái.'],
        ['suong', 'Chị ngồi đây vì wifi chỗ này mạnh nhất. Fanpage khách mà rớt mạng năm phút là có người chửi mười phút.'],
        { c: 'ag_i_suong', o: [
          { t: 'Hỏi chị đang trả lời comment gì vậy.', fx: { rel: { suong: 2 } }, then: [
            ['suong', 'Khách chê mì mặn. Chị trả lời "Dạ bên em ghi nhận khẩu vị đậm đà của mình ạ".'],
            ['suong', 'Nghề này là nghề dịch chửi thành cảm ơn.'],
          ] },
          { t: 'Chỉ chị một lỗi chính tả trong câu đang gõ.', fx: { uy: 2, rel: { suong: 1 } }, then: [
            ['nar', 'Trên màn hình: "Dạ bên em xin lỗi vì sự bất tiện nài ạ."'],
            ['suong', 'Ơ chết! Cảm ơn em. Em có mắt copywriter đó. Hoặc mắt kế toán.'],
          ] },
          { t: 'Ngồi xuống lướt fanpage của agency.', fx: { nl: -3, dr: 1 }, then: [
            ['nar', 'Bài ghim trên fanpage Trend Trễ: "Chúc mừng Trung thu 2024!". Hôm nay là tháng Mười Một năm 2026.'],
            ['think', 'Đúng tên công ty thật.'],
          ] },
        ] },
        ['suong', 'Rồi, chị Diệp cúp máy rồi. Phòng Brainstorm, cửa dán "ĐANG SÁNG TẠO, ĐỪNG GÕ". Em cứ gõ.'],
      ],
    },
    {
      who: 'obj:interview', obj: 'Vào phòng Brainstorm ngồi xuống: buổi phỏng vấn', time: '14:10', seat: 'mr_seat',
      scene: [
        ['diep', 'Hi em! Chị là Diệp, Account Manager. Chị úp điện thoại xuống nha, không là nó rung tới sáng.'],
        ['nar', 'Chị Diệp úp một cái điện thoại. Cái thứ hai vẫn sáng. Cái thứ ba ở trong túi, rung nhẹ như đang thở.'],
        ['khai', 'Khải. Creative Director. Đưa portfolio đây.'],
        ['nar', 'Anh Khải lật portfolio của bạn. Rất nhanh. Như lật menu của một quán anh không định ăn.'],
        ['khai', 'Trang 3: poster câu lạc bộ trường. Font mặc định. Trang 7: ý ổn, nhưng chưa đủ đau.'],
        ['khai', 'Trang 12: "Sáng tạo không giới hạn". Ai cũng viết câu này. Câu này chính là giới hạn.'],
        { c: 'ag_i_roast', o: [
          { t: '"Dạ trang nào anh thấy đỡ nhất ạ?"', fx: { uy: 3, rel: { khai: 2 } }, then: [
            ['khai', '…Trang 9. Tờ rơi tiệm sửa xe. Nó biết nó đang bán cái gì.'],
            ['diep', 'Wow. Anh Khải vừa khen. Chị ghi lại ngày giờ.'],
          ] },
          { t: 'Bảo vệ portfolio: "Trang 12 em cố tình viết sáo ạ."', fx: { dr: 2, rel: { khai: 1 } }, then: [
            ['khai', 'Cố tình sáo thì vẫn là sáo. Nhưng có gan cãi. Tốt.'],
          ] },
          { t: 'Cười gượng, gật đầu liên tục.', fx: { nl: -4, rel: { khai: -1 } }, then: [
            ['khai', 'Đừng gật. Gật là dấu hiệu của account.'],
            ['diep', 'Ê. Chị nghe đó nha.'],
          ] },
        ] },
        ['diep', 'Ok, vô bài test. Client Mì Ông Táo cần slogan Tết. Em có ba mươi giây.'],
        ['khai', 'Ba câu. Không cần hay. Cần dùng được.'],
        { mini: SLOGAN_MINI,
          good: [
            ['khai', '"Ông Táo lên trời, mì Ông Táo ở lại." Câu này… tạm.'],
            ['diep', '"Tạm" là mức cao nhất anh Khải từng nói trong một buổi phỏng vấn đó em.'],
            { fx: { uy: 4, rel: { khai: 1 }, set: { slogan_ok: true } } },
          ],
          bad: [
            ['khai', 'Em chọn câu có tên đối thủ. Client sẽ gọi lúc 23 giờ chỉ để hỏi "em có đùa chị không".'],
            ['diep', 'Không sao. Intern năm ngoái còn chọn "Sáng tạo không giới hạn".'],
            { fx: { dr: 2 } },
          ],
        },
        ['nar', 'Cửa bật mở. Một người đàn ông áo hồng neon thò đầu vào, tay cầm ly cà phê in chữ "POP".'],
        ['tung', 'Ứng viên hả? Hi em, anh Tùng, MD. Một câu thôi: em làm sao cho một cái quảng cáo "pop"?'],
        { c: 'ag_i_pop', o: [
          { t: '"Em hỏi lại: pop với ai, để họ làm gì ạ?"', fx: { uy: 4, rel: { diep: 2 }, set: { pop_clarify: true } }, then: [
            ['tung', '…Câu hỏi hay. Anh không có câu trả lời, nhưng hay.'],
            ['diep', '(nhỏ) Em được việc rồi đó.'],
          ] },
          { t: '"Màu nổi, chữ to, nhạc trend ạ."', fx: { dr: 1, rel: { tung: 2 } }, then: [
            ['tung', 'Đúng! Make it pop! Em có cái vibe đó.'],
            ['khai', '(thở dài rất dài)'],
          ] },
          { t: '"Pop là… tiếng mở lon bia ạ?"', fx: { dr: 3, rel: { tung: 1, khai: 1 } }, then: [
            ['tung', 'HAHA. Ghi lại! Cái này dùng cho pitch Bia Hơi Phố được đó.'],
            ['think', 'Hình như mình vừa đóng góp không công cho một buổi pitch.'],
          ] },
        ] },
        ['tung', 'Ok anh chạy đây, client chờ. Diệp, chốt nhanh nha. Make it pop!'],
        ['diep', 'Giờ nói chuyện phụ cấp. Agency thì… em biết rồi đó. Nhưng chị muốn em tự nói con số.'],
        { salary: true },
        { if: isTier('t0'), then: [
          ['diep', 'Không lấy phụ cấp. Chị nói thật: ở agency, câu "cơ hội học hỏi" đắt lắm. Em giữ quyền về đúng giờ nha.'],
          ['khai', 'Và em có pantry mì Ông Táo miễn phí. Vô hạn. Đó là phúc lợi, và cũng là lời cảnh báo.'],
        ] },
        { if: isTier('t1'), then: [
          ['diep', 'Một triệu. Hợp lý. Em làm việc thật, có người kèm, được về khi xong việc.'],
          ['think', '"Khi xong việc." Ở agency, việc có bao giờ xong không?'],
        ] },
        { if: isTier('t3'), then: [
          ['diep', 'Ba triệu thì chị giao em một client nhỏ, theo từ đầu tới cuối. Sai thì em đứng ra nói với khách.'],
          ['khai', 'Và em được ngồi brainstorm. Được chê thẳng mặt. Đó là đặc quyền.'],
        ] },
        { if: isTier('t5'), then: [
          ['nar', 'Chị Diệp ngừng gõ. Cả ba điện thoại im lặng, như cũng đang nghe.'],
          ['diep', 'Năm triệu… ngang lương thử việc một bạn AE. Được. Vậy em làm như AE. Client nhắn 23 giờ, em là người seen đầu tiên.'],
          ['think', 'Câu đó vừa là offer, vừa là lời nguyền.'],
        ] },
        ['diep', 'Đây là thỏa thuận thực tập. Mẫu chị Hồng soạn từ 2019, có vài chỗ… em đọc kỹ nha.'],
        { mini: CONTRACT_MINI,
          good: [
            ['me', 'Chị ơi, em hỏi ba chỗ: ý tưởng "kể cả trong mơ", "hỗ trợ client ngoài giờ bất cứ khi nào", và "kéo dài tới hết Tết" ạ.'],
            ['diep', '…"Trong mơ" là chị Hồng thêm năm 2020, sau vụ một bạn designer nằm mơ ra cái logo. Chị gạch nha.'],
            ['diep', 'Ngoài giờ thì chị ghi lại: "chỉ khi khẩn cấp, có thỏa thuận". Còn Tết năm nào cũng kéo dài. Chị ghi tối đa 3 tháng.'],
            { fx: { uy: 4, set: { contract_fixed: true } } },
          ],
          bad: [
            ['nar', 'Bạn ký. Ngay phía trên chữ ký là dòng "kể cả trong mơ". Tối nay bạn sẽ ngủ hơi dè chừng.'],
            { fx: { dr: 2, set: { contract_blind: true } } },
          ],
        },
        ['diep', 'Welcome to Trend Trễ! Qua chị Hồng làm giấy tờ nha. Phòng kính, cửa dán "TIMESHEET LÀ SỰ THẬT".'],
      ],
    },
    {
      who: 'hong', obj: 'Qua phòng chị Hồng (Finance) làm giấy tờ', time: '15:00',
      scene: [
        ['hong', 'Ngồi. Chị là Hồng: Finance, kiêm Traffic, kiêm người nhắc timesheet.'],
        ['hong', 'Điều đầu tiên: thứ Sáu nào cũng điền timesheet. Giờ thật. Chị biết hết. Chị biết cả giờ em đi vệ sinh.'],
        ['think', 'Câu cuối chắc là đùa. Chắc vậy.'],
        { if: isTier('t0'), then: [
          ['hong', 'Em không nhận phụ cấp nên không có gì để khấu trừ. Nhưng em vẫn ký xác nhận thực tập. Hai bản.'],
          { fx: { rel: { hong: 1 } } },
        ] },
        { if: isTier('t1', 't3'), then: [
          ['hong', 'Phụ cấp của em dưới năm triệu mỗi lần chi, nên công ty không khấu trừ thuế thu nhập cá nhân.'],
          { if: isTier('t3'), then: [['hong', 'Đầu năm nay mức ba triệu còn bị trừ mười phần trăm đó. Từ tháng Bảy ngưỡng lên năm triệu rồi. Em may.']] },
          { fx: { rel: { hong: 1 } } },
        ] },
        { if: isTier('t5'), then: [
          ['hong', 'Năm triệu đúng ngưỡng. Khoản chi từ năm triệu trở lên mà không có hợp đồng lao động thì công ty khấu trừ 10% thuế thu nhập cá nhân.'],
          ['hong', 'Nếu em ước tính cả năm chưa tới mức phải nộp thuế, em làm bản cam kết thì chị không khấu trừ.'],
          { c: 'ag_i_tax', o: [
            { t: 'Điền bản cam kết ngay.', then: [
              { mini: TAX_MINI,
                good: [['hong', 'Chuẩn. Hiếm ai điền đúng ô mã số thuế ngay lần đầu.'], { fx: { rel: { hong: 2 }, set: { tax_commit: true } } }],
                bad: [['hong', 'Thả sticker vào ô chữ ký hả em? Điền lại. Bản gốc.'], { fx: { nl: -6, rel: { hong: 1 }, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Chị chi cho em 4.999.000 được không ạ?"', fx: { rel: { hong: 1 } }, then: [
              ['hong', 'Em có tố chất account đó. Nhưng không. Thỏa thuận ghi năm triệu rồi. Điền cam kết đi.'],
              { mini: TAX_MINI,
                good: [['hong', 'Chuẩn rồi.'], { fx: { rel: { hong: 1 }, set: { tax_commit: true } } }],
                bad: [['hong', 'Sai ô rồi em. Điền lại giúp chị, bản gốc.'], { fx: { nl: -6, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Chị cứ khấu trừ ạ, cuối năm em tự quyết toán."', fx: { set: { tax_commit: false } }, then: [
              ['hong', 'Ok. Mỗi tháng em nhận chín mươi phần trăm. Cuối năm tự quyết toán. Chị không nhắc đâu. Chị chỉ nhắc timesheet.'],
            ] },
          ] },
        ] },
        ['me', 'Còn bảo hiểm thì sao ạ?'],
        ['hong', 'Thỏa thuận thực tập không phải hợp đồng lao động, nên công ty chưa đóng bảo hiểm xã hội cho em. Lên chính thức mới có.'],
        ['hong', 'Bảo hiểm tinh thần của em là cái pantry. Mì Ông Táo free, vì client gửi sample dư.'],
        ['nar', '(Thông tin thuế và bảo hiểm trong game được đơn giản hóa để giải trí, không phải tư vấn pháp lý.)'],
      ],
    },
    {
      who: 'thi', obj: 'Thi đợi ở pantry để dẫn đi một vòng', time: '15:30', pos: { thi: 'pantry' },
      scene: [
        ['thi', 'Xong giấy tờ rồi hả? Mình là Thi, copywriter. Ba điều cần nhớ. Đọc to lên mới thấm.'],
        ['thi', 'Một: "lần cuối" của client nghĩa là "lần đầu của một chuỗi". Hai: không bao giờ đặt tên file là FINAL.'],
        ['thi', 'Ba: con mèo tên Insight. Nó ngồi đúng chỗ mọi người cần, đúng lúc không ai muốn. Như insight thật.'],
        { c: 'ag_i_thi', o: [
          { t: '"Thi viết copy lâu chưa?"', fx: { rel: { thi: 2 } }, then: [
            ['thi', 'Bốn năm. Ba trăm tagline được duyệt, một nghìn hai bị giết. Mình đặt tên cho từng đứa bị giết.'],
            ['think', 'Người này đáng sợ theo một cách rất thơ.'],
          ] },
          { t: '"Có mẹo gì để sống sót không?"', fx: { uy: 1, rel: { thi: 1 }, set: { thi_tips: true } }, then: [
            ['thi', 'Chụp màn hình mọi feedback. Hỏi lại "sếp chị muốn đổi hết hay chỉ đổi màu?". Và đừng ngồi gần anh Khải lúc 17 giờ.'],
          ] },
        ] },
        { chat: [
          ['diep', 'Welcome {ten} nha 🎉 Thứ Hai 9:30 nha em, WIP 9:45. Đừng tới sớm, không ai mở cửa đâu 😂'],
          ['tung', 'Welcome to the family! Make it pop 💥'],
          ['suong', 'welcome bé 🌙 group "Trend Trễ - ALL" ồn lắm, tắt thông báo nha'],
          ['linh', 'hi bạn, mình cũng intern nè 💅 mẹ mình nói agency này vui lắm'],
          ['nar', 'Bạn được thêm vào 6 nhóm Zalo. Một nhóm tên "Ông Táo – NỘI BỘ (KHÔNG CÓ CLIENT!!!)".'],
        ] },
      ],
    },
  ],
  diary: (s) => `Buổi đầu tiên. Mình deal được mức ${({ t0: '0 đồng', t1: '1 triệu', t3: '3 triệu', t5: '5 triệu' })[s.tier] || '?'}. ${s.flags.contract_fixed ? 'Mình gạch được dòng "ý tưởng kể cả trong mơ thuộc về công ty". ' : 'Mình ký hơi nhanh. Hình như có dòng gì đó về giấc mơ. '}Anh Khải chê portfolio. Anh Tùng nói "pop" bốn lần. Thứ Hai bắt đầu.`,
};
