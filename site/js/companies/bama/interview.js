// Ba & Má — Buổi đầu tiên (day 0): phỏng vấn kiểu gia đình, deal phụ cấp, ký thỏa thuận, giấy tờ thuế, ăn thử khô.
const isTier = (...ids) => (s) => ids.includes(s.tier);

export const CONTRACT_MINI = {
  type: 'pick', title: 'Thỏa thuận thực tập (Má soạn)', icon: '📄',
  prompt: 'Tìm 3 điều khoản "có vấn đề" trước khi ký. Má đang nhìn.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Bảo mật công thức ướp và thông tin khách hàng.' },
    { text: 'Hỗ trợ xưởng khi cần, kể cả Chủ nhật (người nhà mà).', correct: true },
    { text: 'Được ăn cơm trưa chung do cô Tư nấu.' },
    { text: 'Phụ cấp Má đưa tận tay, trừ hao hụt nếu có.', correct: true },
    { text: 'Mặc áo, đội nón, đeo khẩu trang khi xuống xưởng.' },
    { text: 'Thời gian thực tập: tới khi nào Má thấy được.', correct: true },
    { text: 'Nghỉ phép báo trước cho quản lý trực tiếp.' },
    { text: 'Phụ cấp chi trả hằng tháng theo thỏa thuận.' },
  ],
};

export const TAXFORM_MINI = {
  type: 'quiz', title: 'Bản cam kết thu nhập', icon: '🧾',
  prompt: 'Điền cho đúng. Má không có giấy dư để con điền lại.', time: 40, pass: 0.75,
  questions: [
    { q: 'Ô "Họ và tên"', options: ['Tên con, viết hoa có dấu', 'Tên "con nuôi Ba Má"', 'Ba & Má'], correct: 0 },
    { q: 'Ô "Số định danh cá nhân"', options: ['Số điện thoại', '12 số trên Căn cước', 'Mã sinh viên'], correct: 1 },
    { q: 'Ô "Mã số thuế cá nhân"', options: ['Để trống vì chưa đi làm', 'Mã số thuế cá nhân (thường là số định danh)', 'Số tài khoản ngân hàng'], correct: 1 },
    { q: 'Ô "Ký, ghi rõ họ tên"', options: ['Ký tắt', 'Ký và ghi rõ họ tên', 'Lăn tay bằng dầu khô gà'], correct: 1 },
  ],
};

export const INTERVIEW = {
  title: 'Buổi đầu tiên',
  subtitle: 'Phỏng vấn ở nhà Ba Má',
  intro: 'Chiều thứ Sáu, 14:00. Một căn nhà phố ba tầng, tầng trệt là văn phòng, phía sau là xưởng. Mùi lá chanh bay ra tới tận lề đường.\n\nTấm bảng ghi: "BA & MÁ · Khô ngon như nhà làm. Vì nhà làm thiệt."\n\nJD ghi: "Môi trường như một gia đình." Bạn chưa biết chữ "như" ở đây là thừa.',
  pos: {},
  steps: [
    {
      who: 'vy', obj: 'Vào quầy lễ tân báo chị Vy em tới phỏng vấn', time: '14:00',
      scene: [
        ['vy', 'Hi em! Em là {ten} đúng hông? Chị là Vy. HR. Kiêm lễ tân. Kiêm Chief Happiness Officer. Kiêm giữ hồ sơ an toàn thực phẩm.'],
        ['vy', 'Ở Ba & Má mình như một gia đình. Theo nghĩa đen luôn á em.'],
        ['vy', 'CEO là Ba, tức bác Hùng. CFO là Má, tức cô Hằng. Kevin là con trai. Út Mi live là con gái. Cậu Tám là em Má. Chú Bảy là em họ Ba.'],
        ['vy', 'Người ngoài thì có anh Dũng, chị Mai, anh Khoa, anh Sơn. Với chị. Và em, nếu em đậu.'],
        { c: 'bm_iv_vy', o: [
          { t: '"Vậy ai quyết chuyện gì vậy chị?"', fx: { uy: 2, rel: { vy: 1 } }, then: [
            ['vy', 'Câu hay. Ba quyết sản phẩm. Má quyết những gì tốn tiền. Mà cái gì cũng tốn tiền.'],
            ['think', 'Vậy là Má quyết hết.'],
          ] },
          { t: '"Như một gia đình" có phải red flag không chị?', fx: { dr: 3, rel: { vy: 1 } }, then: [
            ['vy', 'Chị không được phép comment. Nhưng chị cười. Em hiểu mà.'],
          ] },
          { t: 'Hít một hơi mùi lá chanh, khen thơm.', fx: { rel: { vy: 1, tu: 1 } }, then: [
            ['vy', 'Thơm ba ngày không hết đó em. Bồ cũ chị chia tay vì cái mùi này.'],
          ] },
        ] },
        ['vy', 'À, còn một bạn intern nữa: Ngân, con gái bạn thân Má. Nhưng chị tin mọi thứ sẽ fair. …Chắc vậy.'],
        ['vy', 'Vô phòng họp đi em. Ba, Má với Kevin chờ trong đó. Nhớ chào Ba trước, Má sau. Đừng chào Kevin bằng tiếng Việt, ảnh buồn.'],
      ],
    },
    {
      who: 'obj:interview', obj: 'Vào phòng họp ngồi xuống: phỏng vấn gia đình', time: '14:10', seat: 'mr_seat',
      pos: { hung: 'meeting_head', hang: 'mr_n1', tuan: 'mr_n2' },
      scene: [
        ['nar', 'Trên bàn họp: một dĩa khô gà, ba ly trà đá, một cuốn sổ bìa đỏ của Má và một cái máy tính bảng của Kevin. Không ai nhìn CV của bạn.'],
        ['hung', 'Ngồi đi con. Ăn miếng khô đi đã. Ăn rồi nói chuyện mới thiệt.'],
        { c: 'bm_iv_taste', o: [
          { t: 'Ăn một miếng, khen thật lòng: "Thơm lá chanh mà không gắt ạ."', fx: { rel: { hung: 2 } }, then: [
            ['hung', 'Đó! Người biết ăn! Hai mươi năm ba ướp kiểu này. Không ai chép được.'],
            ['tuan', '(nhỏ) Actually có shop chép rồi Ba…'],
          ] },
          { t: '"Dạ con xin phép, con đang phỏng vấn ạ."', fx: { uy: 1, rel: { hang: 1, hung: -1 } }, then: [
            ['hung', 'Phỏng vấn mà không ăn thì sao biết mình bán cái gì con?'],
            ['hang', 'Nó không ăn là đỡ một gói. Má thích.'],
          ] },
        ] },
        ['hung', 'Con quê đâu?'],
        { c: 'bm_iv_que', o: [
          { t: '"Dạ con dưới miền Tây ạ."', fx: { rel: { hung: 2 } }, then: [
            ['hung', 'Miền Tây! Hồi xưa ba gánh khô ra chợ Sa Đéc. Ủa mà thôi, chuyện đó để bữa cơm kể.'],
            ['think', 'Bác vừa định kể, rồi kịp dừng. Như người giấu chuyện.'],
            { fx: { set: { iv_mientay: true } } },
          ] },
          { t: '"Dạ con ngoài Bắc vô ạ."', fx: { rel: { hung: 1, hang: 1 } }, then: [
            ['hung', 'Ngoài Bắc ăn khô ít ngọt hơn. Con nếm thử lô sau rồi góp ý cho ba.'],
            ['hang', 'Góp ý thôi. Đừng đòi đổi công thức. Đổi là tốn tiền.'],
          ] },
          { t: '"Dạ con dân thành phố, quê con là… chung cư ạ."', fx: { dr: 2, rel: { tuan: 1 } }, then: [
            ['tuan', 'Haha, I like this one.'],
            ['hung', 'Ai cũng có quê. Không có thì lấy quê ba. Ba cho mượn.'],
          ] },
        ] },
        ['hang', 'Má hỏi một câu thôi. Con ở trọ, một tháng con xài hết bao nhiêu tiền?'],
        { c: 'bm_iv_tien', o: [
          { t: '"Dạ khoảng 4 triệu: 2 triệu trọ, còn lại ăn uống, xăng ạ."', fx: { uy: 3, rel: { hang: 2 } }, then: [
            ['hang', 'Có con số. Tốt. Đứa trước nói "dạ con xài vừa đủ". Vừa đủ là bao nhiêu? Ai biết.'],
          ] },
          { t: '"Dạ con không để ý lắm ạ."', fx: { rel: { hang: -2 } }, then: [
            ['hang', 'Không để ý tiền mình thì sao để ý tiền công ty.'],
            ['nar', 'Má ghi vào sổ đỏ một chữ. Bạn không đọc được, nhưng nó ngắn và có vẻ xấu.'],
          ] },
          { t: '"Dạ con ăn mì gói là chính, tiết kiệm lắm ạ."', fx: { rel: { hang: 1 }, dr: 1 }, then: [
            ['hang', 'Siêng tiết kiệm. Được. Mà ăn mì hoài đau bao tử, đau bao tử là nghỉ, nghỉ là tốn.'],
          ] },
        ] },
        ['nar', 'Kevin xoay máy tính bảng về phía bạn. Trên màn hình: một slide tên "BA & MÁ 2.0: FROM CHỢ TO CLOUD".'],
        ['tuan', 'My turn. Em hiểu gì về growth hacking? Mình bán khô gà, nhưng mindset phải là tech startup.'],
        { c: 'bm_iv_growth', o: [
          { t: '"Thử nhanh, đo kỹ: test vài combo, giữ cái ra đơn thật, bỏ cái chỉ ra view."', fx: { uy: 4, rel: { tuan: 2 } }, then: [
            ['tuan', 'YES. "Ra đơn thật." Mom, did you hear that?'],
            ['hang', 'Má nghe. Má thích chữ "đơn thật". Mấy chữ còn lại Má không hiểu.'],
          ] },
          { t: '"Dạ là… hack cho khô gà lớn lên ạ?"', fx: { dr: 4, rel: { hung: 1, tuan: -1 } }, then: [
            ['hung', 'Ha! Con này nói đúng ý ba. Khô gà phải lớn miếng!'],
            ['tuan', 'Dad, that is not what it means.'],
          ] },
          { t: 'Gật đầu thật sâu: "Dạ hoàn toàn ạ. Scale lên ạ."', fx: { rel: { tuan: 2, hang: -1 }, set: { iv_nod_kevin: true } }, then: [
            ['tuan', 'Love it. Em có cái energy mà anh cần.'],
            ['hang', 'Energy thì tốn điện. Má ghi nhận.'],
          ] },
        ] },
        ['hang', 'Rồi. Nói chuyện tiền. Con muốn bao nhiêu? Nói trước: lương nào việc nấy, mà việc thì nhiều.'],
        { salary: true },
        { if: isTier('t0'), then: [['hang', 'Không lấy đồng nào? …Má nghi. Nhưng Má thích.'], ['hung', 'Có cơm trưa cô Tư nấu. Với khô ăn thử. Ăn thử chứ không phải ăn no nghen con.']] },
        { if: isTier('t1'), then: [['hang', 'Một triệu. Hợp lý. Một triệu là hai mươi tám gói khô gà, con biết hông?'], ['think', 'Từ giờ mọi số tiền trong đời mình sẽ được quy ra gói khô gà.']] },
        { if: isTier('t3'), then: [['hang', 'Ba triệu thì con làm việc thiệt. Sai thì con chịu. Má không chịu dùm ai hết, trừ Kevin.'], ['tuan', 'Mom!']] },
        { if: isTier('t5'), then: [['nar', 'Má đặt cây bút xuống. Ba ngừng nhai.'], ['hang', 'Năm triệu. Con biết năm triệu là bao nhiêu ký khô gà không? Mười bốn ký.'], ['hang', 'Được. Năm triệu thì Má nhớ tên con. Mỗi ngày.'], ['think', 'Câu đó vừa là lời khen, vừa là lời hăm.']] },
        ['hang', 'Đây là thỏa thuận thực tập. Má tự soạn. Con đọc đi rồi ký. Đọc nhanh, giấy in tốn mực.'],
        { mini: CONTRACT_MINI,
          good: [
            ['me', 'Dạ Má ơi, con hỏi ba chỗ: "kể cả Chủ nhật", "trừ hao hụt", với "tới khi nào Má thấy được" là sao ạ?'],
            ['hang', '…Con đọc kỹ ghê. Ừ, Chủ nhật thì "nếu con muốn". Hao hụt thì… để Má tính. Còn thời gian, ghi lại: tối đa ba tháng.'],
            ['hung', 'Đọc kỹ trước khi ký. Tốt. Hồi đó ba mua công thức… à không, ba ký hợp đồng mặt bằng mà không đọc, khổ mấy năm.'],
            { fx: { uy: 4, rel: { hang: 1 }, set: { contract_fixed: true } } },
          ],
          bad: [
            ['nar', 'Bạn ký. Chữ ký rất đẹp. Dòng "Hỗ trợ xưởng khi cần, kể cả Chủ nhật" nằm im lặng ngay phía trên.'],
            ['hang', 'Ký lẹ. Má thích người ký lẹ.'],
            { fx: { dr: 2, set: { contract_blind: true } } },
          ],
        },
        ['hung', 'Thôi, chào mừng con về nhà… à, về công ty. Qua phòng Má làm giấy tờ đi con.'],
      ],
    },
    {
      who: 'hang', obj: 'Qua phòng Má (kế toán) làm giấy tờ', time: '15:00',
      scene: [
        ['nar', 'Phòng Má có một cái két sắt, hai cuốn sổ, một cái máy tính bỏ túi và một bức ảnh Thần Tài đang cười.'],
        ['hang', 'Ngồi. Má làm giấy tờ cho con. Má làm kế toán ba mươi năm, chưa sai một đồng. Có sai thì là người khác sai.'],
        { if: isTier('t0'), then: [
          ['hang', 'Con không lấy phụ cấp nên không có gì để khấu trừ. Nhưng vẫn ký xác nhận. Hai bản. Má giữ một, Má giữ luôn bản kia.'],
          { fx: { rel: { hang: 1 } } },
        ] },
        { if: isTier('t1', 't3'), then: [
          ['hang', 'Phụ cấp của con dưới năm triệu một lần chi, nên không bị khấu trừ thuế. Nhưng vẫn ký nhận. Bản gốc.'],
          { if: isTier('t3'), then: [['hang', 'Hồi đầu năm mức này còn bị trừ đó. Từ tháng Bảy ngưỡng lên năm triệu rồi. Con hên hơn Kevin.']] },
          { fx: { rel: { hang: 1 } } },
        ] },
        { if: isTier('t5'), then: [
          ['hang', 'Năm triệu là đúng ngưỡng. Chi từ năm triệu trở lên mà không có hợp đồng lao động thì công ty phải khấu trừ 10% thuế.'],
          ['hang', 'Nếu cả năm con ước thu nhập chưa tới mức phải nộp thuế thì làm bản cam kết, Má không trừ. Má không thích nộp thuế dùm ai.'],
          { c: 'bm_iv_tax', o: [
            { t: '"Hay Má đưa con 4.990.000 cho chẵn… lẻ ạ?"', fx: { uy: 1, rel: { hang: 2 } }, then: [
              ['nar', 'Má nhìn bạn ba giây. Rồi Má cười. Lần đầu tiên trong ngày.'],
              ['hang', 'Con này có máu buôn. Nhưng thỏa thuận ghi năm triệu rồi. Điền cam kết đi.'],
              { mini: TAXFORM_MINI,
                good: [['hang', 'Đúng hết. Được.'], { fx: { rel: { hang: 1 }, set: { tax_commit: true } } }],
                bad: [['hang', 'Sai ô rồi. Điền lại. Tờ này Má trừ hai trăm đồng tiền giấy. Giỡn. …Giỡn thiệt.'], { fx: { nl: -6, set: { tax_commit: true } } }],
              },
            ] },
            { t: 'Điền bản cam kết ngay.', then: [
              { mini: TAXFORM_MINI,
                good: [['hang', 'Hiếm đứa nào điền đúng ô mã số thuế lần đầu. Kevin điền ba lần.'], { fx: { rel: { hang: 2 }, set: { tax_commit: true } } }],
                bad: [['hang', 'Sai ô rồi con. Điền lại, bản gốc. Đừng tẩy, Má ghét vết tẩy.'], { fx: { nl: -6, rel: { hang: 1 }, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Má cứ khấu trừ 10% ạ, con không rành giấy tờ."', fx: { set: { tax_commit: false } }, then: [
              ['hang', 'Ừ. Vậy mỗi tháng con nhận chín phần mười. Cuối năm con tự đi quyết toán. Má không đi dùm.'],
            ] },
          ] },
        ] },
        ['me', 'Còn bảo hiểm thì sao Má?'],
        ['hang', 'Con ký thỏa thuận thực tập, không phải hợp đồng lao động, nên công ty chưa đóng bảo hiểm xã hội cho con.'],
        ['hang', 'Bảo hiểm của con là cô Tư với hộp dầu gió. Té ở xưởng thì kêu cô Tư.'],
        ['nar', '(Thông tin thuế và bảo hiểm trong game được đơn giản hóa để giải trí, không phải tư vấn pháp lý.)'],
        ['hang', 'Thứ Hai tới lúc 7 giờ 45. Giờ làm là 8 giờ, nhưng Má tới 7 giờ 45. Con hiểu ý Má không?'],
        { c: 'bm_iv_gio', o: [
          { t: '"Dạ con tới 7 giờ 40 ạ."', fx: { rel: { hang: 2 }, nl: -3, set: { early_bird: true } }, then: [['hang', 'Được. Má sẽ nhớ cái 7 giờ 40 này.']] },
          { t: '"Dạ giờ làm 8 giờ thì con tới 8 giờ ạ."', fx: { uy: 2, rel: { hang: -1 } }, then: [['hang', 'Đúng luật. Má không cãi luật. Má chỉ nhớ thôi.']] },
        ] },
      ],
    },
    {
      who: 'tu', obj: 'Cô Tư gọi ra bếp ăn thử khô', time: '15:30',
      scene: [
        ['tu', 'Con mới vô hả? Ăn chưa con? Lại đây, cô cho miếng khô gà mẻ sáng nay. Mẻ này cô nếm rồi, ngon.'],
        ['tu', 'Ở đây có ba điều. Một: đừng ngồi ghế đỏ, ghế Má. Hai: đừng chê khô trước mặt Ba. Ba: cái gì thấy trong xưởng thì nói với cô trước.'],
        { c: 'bm_iv_tu', o: [
          { t: '"Sao lại nói với cô trước ạ?"', fx: { rel: { tu: 2 }, set: { tu_trust: true } }, then: [
            ['tu', 'Tại cô nấu cơm cho cả nhà hai mươi sáu năm. Má hỏi ý cô trước khi quyết ai ở ai đi. Con hiểu chưa?'],
            ['think', 'Quyền lực thật sự của công ty này đang cầm cái muỗng canh.'],
          ] },
          { t: 'Ăn miếng khô, xin thêm miếng nữa.', fx: { nl: 10, rel: { tu: 1 } }, then: [
            ['tu', 'Ăn được là có phước. Mà đừng để Má thấy, Má ghi sổ "hao hụt".'],
          ] },
        ] },
        ['nar', 'Một con mèo vàng nhảy lên bàn bếp, nhìn đĩa khô gà như nhìn tài sản thừa kế.'],
        ['tu', 'Mèo Khô Gà. Nó ở đây lâu hơn Kevin. Nó cũng ăn vụng ít hơn Kevin.'],
        { chat: [
          ['vy', 'Cả nhà ơi welcome intern mới {ten} nha 🎉🎉'],
          ['hung', '🌸🙏 Chào con. Chúc con một ngày an lành, buôn may bán đắt.'],
          ['tuan', 'Welcome onboard! Let\'s sync sometime 🚀'],
          ['mi', 'welcome em iu 💕 thứ 4 trợ live chị nha 😘'],
          ['son', 'Welcome! Họp sáng 8:15 thứ Hai. 8:15 không phải 8:16 ⏰'],
          ['mai', 'welcome emmm 😘 có gì ib chị, chị kể cho nghe hết'],
          ['khoa', '👍'],
          ['nar', 'Nhóm "BA & MÁ – CHÍNH THỨC 🌸" có 63 tin nhắn chưa đọc. 40 tin là ảnh hoa sen.'],
        ] },
      ],
    },
  ],
  diary: (s) => `Buổi đầu tiên. Mình deal được mức ${({ t0: '0 đồng', t1: '1 triệu', t3: '3 triệu', t5: '5 triệu' })[s.tier] || '?'}, tức là ${({ t0: '0', t1: '28', t3: '85', t5: '142' })[s.tier] || '?'} gói khô gà. ${s.flags.contract_fixed ? 'Mình đọc kỹ thỏa thuận, gạch được vụ "kể cả Chủ nhật". ' : 'Mình ký hơi nhanh. Có dòng nào đó về Chủ nhật… chắc không sao. '}Ba cho ăn khô trước khi hỏi CV. Tóc mình giờ thơm lá chanh.`,
};
