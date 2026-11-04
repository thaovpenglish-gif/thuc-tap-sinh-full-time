// Đi Đâu Cũng Được — Day 0: the interview. Must contain { salary: true }.
// Tax/insurance lines are simplified for entertainment (withholding threshold 5,000,000 VND/payment from 1/7/2026).

const isTier = (...ids) => (s) => ids.includes(s.tier);

const KIT_MINI = {
  type: 'pick', title: 'Xếp túi "event kit"', icon: '🎒',
  prompt: 'Anh Duy: "Team building bãi biển, 120 khách, 6 giờ sáng xuất phát. Chọn 4 món phải có trong túi."', pick: 4, time: 40, pass: 0.75,
  items: [
    { text: 'Băng keo đen + dây rút', sub: 'dán dây, buộc backdrop, sửa đời', correct: true },
    { text: 'Micro dự phòng + pin AA', correct: true },
    { text: '20 áo mưa tiện lợi', sub: 'dự báo: 20% mưa', correct: true },
    { text: 'Run-sheet in giấy, có số điện thoại vendor', correct: true },
    { text: 'Loa kéo karaoke', sub: 'cho "vui"' },
    { text: 'Giày cao gót để chụp ảnh check-in' },
    { text: 'Bánh tráng trộn', sub: 'cho đoàn ăn đỡ' },
    { text: 'Bản in proposal 40 trang để đọc trên xe' },
  ],
};

const CONTRACT_MINI = {
  type: 'pick', title: 'Thỏa thuận thực tập', icon: '📄',
  prompt: 'Tìm 3 điều khoản "có vấn đề" trước khi ký.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Giờ làm việc: theo lịch sự kiện của khách hàng (kể cả cuối tuần, lễ, Tết).', correct: true },
    { text: 'Phụ cấp show không áp dụng nếu show bị hủy vì thời tiết, kể cả khi đã setup xong.', correct: true },
    { text: 'Thực tập sinh sẵn sàng đi tỉnh khi được báo trước tối thiểu 2 giờ.', correct: true },
    { text: 'Thực tập sinh được cấp áo đồng phục và thẻ nhân viên.' },
    { text: 'Bảo mật thông tin khách hàng và giá vendor.' },
    { text: 'Phụ cấp chi trả vào ngày 10 hằng tháng.' },
    { text: 'Được tham gia tổng duyệt và học quy trình chạy show.' },
  ],
};

const TAXFORM_MINI = {
  type: 'quiz', title: 'Bản cam kết thu nhập (mẫu hiện hành)', icon: '🧾',
  prompt: 'Cô Bích: "Điền đúng từng ô. Bút bi xanh. Không tẩy xóa. Cô kiểm bằng kính lúp."', time: 40, pass: 0.75,
  questions: [
    { q: 'Ô "Họ và tên"', options: ['Tên của em, viết hoa có dấu', 'Nghệ danh MC của em', 'Đi Đâu Cũng Được'], correct: 0 },
    { q: 'Ô "Số định danh cá nhân"', options: ['Số điện thoại', '12 số trên Căn cước', 'Mã đặt chỗ vé máy bay'], correct: 1 },
    { q: 'Ô "Mã số thuế cá nhân"', options: ['Để trống vì em còn đi học', 'Mã số thuế cá nhân (thường là số định danh)', 'Số tài khoản ngân hàng'], correct: 1 },
    { q: 'Ô "Ký, ghi rõ họ tên"', options: ['Ký tắt', 'Ký và ghi rõ họ tên', 'Vẽ một trái tim'], correct: 1 },
  ],
};

export const INTERVIEW = {
  title: 'Buổi đầu tiên',
  subtitle: 'Vòng phỏng vấn',
  intro: 'Chiều thứ Sáu, 14:00. Tầng 3 một nhà phố. Tầng trệt là kho: standee, bạt cũ, ghế Chiavari và một con lân gãy sừng.\n\nTấm biển ghi: "ĐI ĐÂU CŨNG ĐƯỢC · Sự kiện · Team building · Tour".\n\nBạn đi phỏng vấn thực tập. Và hôm nay, bạn sẽ phải deal lương.',
  pos: { kieu: 'meeting_head', duy: 'mr_n1', thao: 'mr_n2', vy: 'pantry' },
  steps: [
    {
      who: 'lan', obj: 'Tới quầy lễ tân báo chị Lan em đến phỏng vấn', time: '14:00',
      scene: [
        ['nar', 'Quầy lễ tân bị vây bởi bốn thùng dây đeo thẻ, hai cuộn thảm đỏ và một cái đầu lân.'],
        ['lan', 'Em giao standee hả? Để ở kia, cạnh con lân. Đừng đụng sừng nó.'],
        ['me', 'Dạ không ạ, em là {ten}, em đến phỏng vấn thực tập lúc 14 giờ.'],
        ['lan', 'Ơ. Xin lỗi em. Ở đây ai bước vào cũng đang cầm một cái gì đó để giao.'],
        { c: 'ev_lan', o: [
          { t: 'Phụ chị Lan khiêng thùng dây đeo thẻ vào kho.', fx: { nl: -4, rel: { lan: 2 } }, then: [
            ['lan', 'Trời, em khỏe ghê. Chị ghi nhận. Ở đây biết khiêng là có tương lai.'],
          ] },
          { t: 'Đứng chờ, đọc tấm bảng lịch sự kiện tháng 11.', fx: { uy: 1 }, then: [
            ['nar', 'Ngày 20 ghi "3 show?" kèm một hình mặt khóc vẽ bằng bút đỏ. Bạn quyết định chưa hỏi.'],
          ] },
          { t: 'Hỏi: "Con lân bị gãy sừng thế nào ạ?"', fx: { dr: 1, rel: { lan: 1 } }, then: [
            ['lan', 'Khai trương năm ngoái. Lân húc vào biển quảng cáo. Biển không sao. Người trong lân thì nghỉ một tuần.'],
            ['think', 'Người trong lân. Mình hy vọng đó không phải vị trí đang tuyển.'],
          ] },
        ] },
        ['lan', 'Phòng họp đi thẳng, cửa có dán "PHÒNG NGỦ TRƯA". Vào đi em, chị Kiều đang chờ.'],
      ],
    },
    {
      who: 'obj:interview', obj: 'Vào phòng họp ngồi xuống: buổi phỏng vấn', time: '14:10', seat: 'mr_seat',
      scene: [
        ['kieu', 'XIN CHÀO! Xin một tràng pháo tay chào đón ứng viên của chúng ta! …Ngồi đi em.'],
        ['nar', 'Không ai vỗ tay. Anh ngồi cạnh chị có ba cái bộ đàm treo trên thắt lưng. Cái thứ ba đang rè rè.'],
        ['duy', 'Anh là Duy, Event Producer. Bộ đàm này là vendor. Cái này là khách. Cái này là chị Kiều.'],
        ['kieu', 'Cái đó Duy hay tắt. Chị biết.'],
        ['thao', 'Chị là Thảo, Sales. Em cứ thoải mái, ở đây mình như một gia đình. Một gia đình chạy show.'],
        ['kieu', 'Chị từng là MC. Gala của năm 2009. Nên chị phỏng vấn kiểu MC. Em mở màn một chương trình cho chị nghe.'],
        { c: 'ev_mc', o: [
          { t: '"Kính thưa quý vị đại biểu, thưa toàn thể quý vị khách quý…"', fx: { uy: 2, rel: { kieu: 1 } }, then: [
            ['kieu', 'Chuẩn sách giáo khoa. Hơi buồn ngủ, nhưng không ai bị đuổi việc vì chuẩn.'],
          ] },
          { t: '"XIN CHÀO CẢ NHÀ YÊUUU! Mọi người có vui khônggg?"', fx: { dr: 2, rel: { kieu: 2, duy: -1 } }, then: [
            ['kieu', 'NĂNG LƯỢNG! Chị thích!'],
            ['duy', 'Khách là hội nghị ngân hàng thì em vừa mất hợp đồng.'],
          ] },
          { t: '"Dạ, chương trình của khách nào, khách mời là ai ạ? Em cần biết để mở cho đúng."', fx: { uy: 4, rel: { duy: 2, kieu: 1 }, set: { ask_brief: true } }, then: [
            ['duy', 'Câu hỏi đúng. MC giỏi là MC đọc brief trước khi cầm micro.'],
            ['kieu', 'Chị định nói câu đó. Duy cướp lời chị. Như mọi khi.'],
          ] },
        ] },
        ['duy', 'Câu của anh thực tế hơn. Sáu giờ sáng mai có đoàn đi biển. Em xếp túi đồ nghề giúp anh.'],
        { mini: KIT_MINI,
          good: [
            ['duy', 'Băng keo đen, micro dự phòng, áo mưa, run-sheet giấy. Copy. Em được.'],
            ['thao', 'Ủa không mang loa kéo hả? Khách thích hát lắm.'],
            ['duy', 'Khách thích. Anh không thích.'],
            { fx: { uy: 3, rel: { duy: 2 }, set: { kit_ok: true } } },
          ],
          bad: [
            ['duy', 'Loa kéo với bánh tráng trộn. Đoàn sẽ vui. Cho tới lúc trời mưa và micro hết pin.'],
            ['kieu', 'Thôi, cái này học được. Chị hồi xưa còn mang giày cao gót ra bãi biển.'],
            { fx: { rel: { kieu: 1 } } },
          ],
        },
        ['thao', 'Câu của chị. Khách nói: ngân sách cho 100 người, nhưng đi 200 người, và "đừng để thiếu gì nha em". Em trả lời sao?'],
        { c: 'ev_sales', o: [
          { t: '"Dạ được ạ chị!"', fx: { rel: { thao: 2, duy: -1 }, set: { yes_sayer: true } }, then: [
            ['thao', 'Đúng ý chị! Câu thần chú đấy.'],
            ['duy', '(nhỏ) Rồi ai chạy show? Anh chạy.'],
          ] },
          { t: '"Em gửi hai phương án: giữ ngân sách thì giảm hạng mục, giữ hạng mục thì tăng ngân sách."', fx: { uy: 4, rel: { duy: 1, thao: 1 } }, then: [
            ['thao', 'Ừm… hợp lý. Hơi thẳng. Khách thích được nghe "dạ" trước.'],
            ['kieu', 'Dạ trước, phương án sau. Chị ghi nhận cả hai.'],
          ] },
          { t: '"Em sẽ hỏi chị Kiều ạ."', fx: { rel: { kieu: 1 }, dr: 1 }, then: [
            ['kieu', 'Hỏi chị thì chị sẽ nói: "Khách luôn đúng, trừ lúc thanh toán." Em tự hiểu nhé.'],
          ] },
        ] },
        ['kieu', 'Giờ nói chuyện phụ cấp. Ở đây có phụ cấp, có show, và có những đêm ngủ trên đống bạt. Em muốn mức nào?'],
        { salary: true },
        { if: isTier('t0'), then: [['kieu', 'Không lấy phụ cấp. Em đi vì đam mê. Chị từng như em. Rồi chị đòi lương.'], ['thao', 'Em vẫn được ăn buffet thừa sau mỗi gala nha. Ngon lắm. Hơi nguội.']] },
        { if: isTier('t1'), then: [['kieu', 'Một triệu. Hợp lý. Có việc thật, có người kèm.'], ['duy', 'Kèm là anh. Em sẽ học cách nói "copy".']] },
        { if: isTier('t3'), then: [['kieu', 'Ba triệu là em được giao việc độc lập. Có lúc một mình một show.'], ['duy', 'Một mình một show. Kèm ba cái bộ đàm. Em sẽ hiểu.']] },
        { if: isTier('t5'), then: [['nar', 'Chị Thảo ngừng gõ điện thoại.'], ['thao', 'Em… chắc chưa?'], ['kieu', 'Được! Năm triệu thì em là gương mặt intern mùa cao điểm. Chị sẽ gọi tên em trên bộ đàm. Rất nhiều lần.'], ['think', 'Câu đó vừa là lời khen, vừa là lịch trực đêm.']] },
        ['duy', 'Thỏa thuận thực tập đây. Em đọc nhanh như MC đọc tên nhà tài trợ, nhưng đọc kỹ.'],
        { mini: CONTRACT_MINI,
          good: [
            ['me', 'Anh Duy ơi, em hỏi ba chỗ: giờ làm "theo lịch khách", show hủy vì mưa thì không phụ cấp, và báo trước 2 giờ để đi tỉnh ạ.'],
            ['duy', '…Ba chỗ đó là anh viết lúc hai giờ sáng sau một show bị hủy vì mưa. Anh sửa: báo trước một ngày, show hủy vẫn tính nửa phụ cấp.'],
            ['kieu', 'Đọc kỹ trước khi ký. Khách của mình cũng nên học em.'],
            { fx: { uy: 4, rel: { duy: 1 }, set: { contract_fixed: true } } },
          ],
          bad: [
            ['nar', 'Bạn ký. Chữ ký rất đẹp. Dòng "kể cả cuối tuần, lễ, Tết" nằm im lặng phía trên, như một lời hứa.'],
            { fx: { dr: 2, set: { contract_blind: true } } },
          ],
        },
        ['kieu', 'Chào mừng em đến với Đi Đâu Cũng Được! Xin một tràng… thôi. Qua cô Bích làm giấy tờ nhé.'],
      ],
    },
    {
      who: 'bich', obj: 'Qua phòng kế toán gặp cô Bích làm thủ tục', time: '15:00',
      scene: [
        ['bich', 'Em ngồi đi. Cô là Bích, kế toán trưởng. Ở đây tiền đi đâu cô biết hết. Trừ cái thùng nước suối thứ ba.'],
        ['nar', 'Trên bàn cô Bích có một kính lúp, một máy tính Casio và một xấp biên lai được kẹp theo màu.'],
        { if: isTier('t0'), then: [
          ['bich', 'Em không nhận phụ cấp nên không có gì để khấu trừ. Nhưng vẫn ký xác nhận. Hai bản. Bút bi xanh.'],
          { fx: { rel: { bich: 1 } } },
        ] },
        { if: isTier('t1', 't3'), then: [
          ['bich', 'Phụ cấp của em dưới năm triệu một lần chi, không bị khấu trừ thuế. Em vẫn ký nhận. Hai bản. Bút bi xanh.'],
          { if: isTier('t3'), then: [['bich', 'Đầu năm mức này còn bị trừ đấy. Từ tháng Bảy ngưỡng lên năm triệu. Em may hơn đứa intern năm ngoái.']] },
          { fx: { rel: { bich: 1 } } },
        ] },
        { if: isTier('t5'), then: [
          ['bich', 'Năm triệu đúng bằng ngưỡng. Khoản chi từ năm triệu trở lên, không có hợp đồng lao động, thì công ty khấu trừ 10% thuế thu nhập cá nhân.'],
          ['bich', 'Nếu cả năm em ước tính chưa tới mức phải nộp thuế thì làm bản cam kết, cô không khấu trừ. Em điền luôn nhé?'],
          { c: 'ev_tax', o: [
            { t: 'Điền tờ cam kết ngay.', then: [
              { mini: TAXFORM_MINI,
                good: [['bich', 'Đúng hết. Cô kiểm bằng kính lúp rồi đấy.'], { fx: { rel: { bich: 2 }, set: { tax_commit: true } } }],
                bad: [['bich', 'Sai ô rồi. Em điền lại. Bản gốc. Không tẩy xóa.'], ['nar', 'Lần hai thì đúng. Cô Bích gật đầu như vừa duyệt một hóa đơn đỏ.'], { fx: { nl: -6, rel: { bich: 1 }, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Cô chi cho em 4.990.000 được không ạ?"', fx: { rel: { bich: 1 } }, then: [
              ['bich', 'Em có năng khiếu làm báo giá đấy. Nhưng thỏa thuận ghi năm triệu. Điền cam kết đi.'],
              { mini: TAXFORM_MINI,
                good: [['bich', 'Được. Lần đầu cô thấy intern điền đúng ô mã số thuế.'], { fx: { rel: { bich: 1 }, set: { tax_commit: true } } }],
                bad: [['bich', 'Sai ô. Điền lại.'], { fx: { nl: -6, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Cô cứ khấu trừ 10% ạ, em sợ giấy tờ."', fx: { set: { tax_commit: false } }, then: [
              ['bich', 'Ừ, mỗi tháng em nhận chín mươi phần trăm. Cuối năm tự quyết toán. Đừng làm mất chứng từ.'],
            ] },
          ] },
        ] },
        ['me', 'Còn bảo hiểm thì sao ạ cô?'],
        ['bich', 'Em ký thỏa thuận thực tập, không phải hợp đồng lao động, nên công ty chưa đóng bảo hiểm xã hội cho em.'],
        ['bich', 'Đi tour thì có bảo hiểm du lịch theo đoàn. Em được ghi tên trong đó. Dòng cuối. Sau cái thùng nước.'],
        ['nar', '(Thông tin thuế và bảo hiểm được đơn giản hóa để giải trí, không phải tư vấn pháp lý.)'],
      ],
    },
    {
      who: 'vy', obj: 'Intern Vy vẫy bạn ra pantry', time: '15:30',
      scene: [
        ['vy', 'Ê, bạn là intern mới hả? Mình là Vy. Vào trước bạn đúng một tháng, nên mình là "tiền bối". Ngồi đi.'],
        ['vy', 'Ba điều cần biết. Một: pantry toàn đồ ăn thừa từ gala. Ăn được. Đừng hỏi gala nào.'],
        ['vy', 'Hai: con mèo tên Plan B. Mưa là nó biết trước. Nó chui vào kho là y như rằng chiều mưa.'],
        ['vy', 'Ba: khi anh Duy hỏi "đêm nay ai trực sân khấu", đừng nhìn vào mắt anh ấy.'],
        { c: 'ev_vy', o: [
          { t: '"Bạn có mẹo gì để sống sót không?"', fx: { rel: { vy: 2 }, set: { vy_tips: true } }, then: [
            ['vy', 'Luôn mang sạc dự phòng, áo mưa, một gói xôi. Lưu số anh Toàn. Và đừng tin bản run-sheet nào có chữ FINAL.'],
          ] },
          { t: '"Bạn quay TikTok hậu trường hả? Cho mình xem với."', fx: { rel: { vy: 2 }, dr: 1 }, then: [
            ['vy', 'Clip "Setup gala lúc 3 giờ sáng" 40 nghìn view. Chị Kiều chưa biết. Bạn cũng chưa biết nha.'],
          ] },
        ] },
        { chat: [
          ['kieu', 'Xin một tràng pháo tay chào đón {ten} gia nhập gia đình Đi Đâu Cũng Được 🎤🎉🎉'],
          ['duy', 'welcome. thứ 2 8:30 briefing. mang sạc.'],
          ['thao', 'Welcome em iu 💕 có gì cứ "dạ được ạ" nha'],
          ['toan', 'Chào em. Lưu số anh. Tên lưu là "Anh Toàn Xe". Đừng nhầm với 300 anh xe khác.'],
          ['hai', 'CHÀO EM!!! (anh viết hoa vì giọng anh vậy)'],
          ['nar', 'Group "ĐĐCĐ · Chạy Show 24/7 🎪" có 63 tin nhắn chưa đọc. Tin gần nhất lúc 2:14 sáng.'],
        ] },
      ],
    },
  ],
  diary: (s) => `Buổi đầu tiên. Mình deal được mức ${({ t0: '0 đồng', t1: '1 triệu', t3: '3 triệu', t5: '5 triệu' })[s.tier] || '?'}. ${s.flags.contract_fixed ? 'Mình đọc kỹ thỏa thuận, anh Duy sửa luôn ba điều khoản viết lúc 2 giờ sáng. ' : 'Mình ký hơi nhanh. Dòng "kể cả cuối tuần, lễ, Tết" cứ lởn vởn. '}Chị Kiều nói chuyện như đang cầm micro. Có một con lân gãy sừng ở tầng trệt. Thứ Hai bắt đầu.`,
};
