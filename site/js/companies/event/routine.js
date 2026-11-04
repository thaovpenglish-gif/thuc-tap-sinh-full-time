// Đi Đâu Cũng Được — routine beats (ordinary days) and side-task templates.

const F = (k) => (s) => !!s.flags[k];

const ZALO_MINI = {
  type: 'quiz', title: 'Group Zalo đoàn (120 thành viên)', icon: '💬',
  prompt: '80 tin nhắn mới. 79 tin là "mấy giờ xe chạy ạ". Trả lời sao cho tin thứ 81 không xuất hiện?', time: 30, pass: 0.66,
  questions: [
    { q: 'Cách trả lời hiệu quả nhất…', options: ['Trả lời từng người một', 'Ghim một tin: giờ, điểm hẹn, biển số xe, số HDV', 'Rời nhóm'], correct: 1 },
    { q: 'Một khách hỏi lần thứ tư…', options: ['"Em đã gửi 3 lần rồi ạ"', 'Gửi lại tin ghim kèm sticker vui vẻ', 'Thả phẫn nộ'], correct: 1 },
    { q: 'Khách hỏi lúc 23:00…', options: ['Trả lời ngay kẻo khách giận', 'Trả lời sáng mai, trừ khi khẩn cấp', 'Gọi lại cho khách lúc 23:01'], correct: 1 },
  ],
};

const CUT_MINI = {
  type: 'pick', title: 'Khách bảo "bớt chút"', icon: '✂️',
  prompt: 'Chị Thảo: "Khách muốn bớt 10%. Chọn 3 chỗ cắt được mà show vẫn an toàn."', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Standee in 2 mặt → 1 mặt', correct: true },
    { text: '500 bóng bay → 300 bóng bay', correct: true },
    { text: 'Xe VIP cho đội kỹ thuật → xe thường', correct: true },
    { text: 'Bỏ máy phát điện dự phòng' },
    { text: 'Bỏ micro dự phòng' },
    { text: 'Bỏ bảo hiểm du lịch cho khách' },
  ],
};

const CONCEPT_MINI = {
  type: 'quiz', title: 'Đặt tên concept year-end', icon: '💡',
  prompt: 'Khoa: "Khách cấm dùng chữ Rise. Chọn tên KHÔNG có chữ Rise."', time: 20, pass: 0.66,
  questions: [
    { q: 'Chọn một:', options: ['Together We Rise', 'Cùng Nhau Đi Xa', 'Rise Together 2027'], correct: 1 },
    { q: 'Chọn tiếp:', options: ['Bứt Phá Vững Vàng', 'Sunrise Gala', 'We Rise Again'], correct: 0 },
    { q: 'Và cái cuối:', options: ['Rising Stars Night', 'Arise & Shine', 'Đêm Của Những Người Ở Lại'], correct: 2 },
  ],
};

export const ROUTINE = [
  { id: 'r_briefing', who: 'duy', obj: 'Briefing 8:30 ở bảng', time: '08:45', pos: { duy: 'scrum', thao: 'su1', toan: 'su2', ngan: 'su3', hai: 'su4', vy: 'su5' }, scene: [
    ['duy', 'Briefing. Hôm nay: hai khảo sát venue, một báo giá, một cuộc gọi khách "chỉ hỏi thăm". Ai hỏi thăm là có chuyện.'],
    ['thao', 'Và em vừa nhận thêm một khai trương! Dạ được ạ!'],
    { c: '_r_brief', o: [
      { t: 'Nhận ghi biên bản briefing.', fx: { uy: 2, rel: { duy: 1 }, nl: -2 }, then: [['duy', 'Copy. Gửi group trước 9:30. Gạch đầu dòng. Không emoji.']] },
      { t: 'Hỏi chị Thảo khai trương ngày nào.', fx: { uy: 1, dr: 1 }, then: [['thao', 'Thứ Bảy này. Ơ… thứ Bảy này hả? Ừ, thứ Bảy này.'], ['duy', '…']] },
    ] },
  ] },
  { id: 'r_kieu_mic', who: 'kieu', obj: 'Chị Kiều đang test micro trong văn phòng', scene: [
    ['kieu', 'Alo. Alo. Một hai ba. Xin chào quý vị! …Em nghe có rõ không?'],
    ['nar', 'Cả văn phòng nghe rõ. Cả tòa nhà bên cạnh cũng nghe rõ.'],
    { c: '_r_kieu_mic', o: [
      { t: '"Rõ ạ! Giọng chị vẫn như gala 2009!"', fx: { rel: { kieu: 2 } }, then: [['kieu', 'Em xem clip gala 2009 rồi hả? Không ai xem clip đó ngoài chị!']] },
      { t: '"Hơi rè chị ơi, để em gọi anh Quân."', fx: { uy: 1, rel: { quan: 1 } }, then: [['quan', 'Không rè. Chị Kiều đứng sát loa. Lần nào cũng vậy.']] },
    ] },
  ] },
  { id: 'r_thao_elephant', who: 'thao', obj: 'Chị Thảo có một yêu cầu "nhỏ" từ khách', scene: [
    ['thao', 'Khách khai trương muốn có… voi. Một con voi. Ở quận 3. Chị chưa nói "dạ được ạ". Chị đang cố gắng.'],
    { c: '_r_elephant', o: [
      { t: '"Mình đề xuất mô hình voi hơi khổng lồ để chụp ảnh ạ."', fx: { uy: 2, rel: { thao: 1, tien: 1 } }, then: [['thao', 'Voi hơi! Khách sẽ thích! Không ai phải dắt voi qua cầu!']] },
      { t: '"Chị cứ nói không đi chị."', fx: { rel: { thao: -1 }, uy: 1 }, then: [['thao', 'Không. …Không. Chị tập rồi. Không. Khó quá em ơi.']] },
    ] },
  ] },
  { id: 'r_my_sleep', who: 'my', obj: 'Mỹ ngủ gục trên bàn phím', scene: [
    ['nar', 'Mỹ ngủ gục. Màn hình hiện một dòng chữ "jjjjjjjjjjjjjjjjj" dài 14 trang trong file proposal v6.'],
    { c: '_r_my', o: [
      { t: 'Lưu file giúp Mỹ, đắp áo khoác, để bạn ấy ngủ 15 phút.', fx: { rel: { my: 2 }, nl: -1 }, then: [['my', '(tỉnh dậy) Ai lưu file cho mình vậy… cảm ơn. Mình suýt gửi 14 trang chữ j cho khách.']] },
      { t: 'Gọi Mỹ dậy: chị Thảo đang tới.', fx: { rel: { my: 1 } }, then: [['my', 'Mình không ngủ! Mình đang… nghĩ concept bằng mắt nhắm!']] },
    ] },
  ] },
  { id: 'r_ngan_price', who: 'ngan', obj: 'Chị Ngân nhìn giá vé như nhìn kẻ thù', scene: [
    ['ngan', 'Giá vé lúc 9:00: 1,8 triệu. Chị đi lấy nước. Lúc 9:03: 2,6 triệu. Chị không bao giờ đi lấy nước nữa.'],
    { c: '_r_ngan', o: [
      { t: 'Mang nước tới bàn cho chị Ngân.', fx: { rel: { ngan: 2 }, nl: -1 }, then: [['ngan', 'Em hiểu chị. Từ giờ em là người lấy nước. Giá vé sẽ không tăng nữa. Hy vọng vậy.']] },
      { t: 'Hỏi cách săn giá vé đoàn.', fx: { uy: 1, rel: { ngan: 1 } }, then: [['ngan', 'Đoàn trên 10 người thì gọi thẳng hãng xin giá đoàn. Còn lại là cầu nguyện.']] },
    ] },
  ] },
  { id: 'r_toan_phones', who: 'toan', obj: 'Anh Toàn đang nghe ba điện thoại', scene: [
    ['toan', 'Em cầm giúp anh cái này. Anh Xe Bình Dương 2. Nói "dạ anh Toàn đang bận, 5 phút gọi lại". Đừng hứa gì.'],
    ['nar', 'Đầu dây bên kia: "Em là ai? Em bên Toàn hả? Mai anh có xe 45 chỗ trống, em lấy không?"'],
    { c: '_r_toan', o: [
      { t: '"Dạ, em ghi lại, anh Toàn gọi lại liền ạ."', fx: { uy: 2, rel: { toan: 2 } }, then: [['toan', 'Đúng rồi. Không hứa. Ghi lại. Em học nhanh hơn anh hồi xưa.']] },
      { t: '"Dạ em lấy luôn ạ!"', fx: { dr: 2, rel: { toan: -1 } }, then: [['toan', 'Em vừa đặt một xe 45 chỗ mà không có đoàn nào cần. Thôi, anh xử. Lần sau đừng nhé.']] },
    ] },
  ] },
  { id: 'r_tien_logo', who: 'tien', obj: 'Anh Tiến: "Logo to hơn nữa"', scene: [
    ['tien', 'Khách bảo logo to hơn. Anh làm to hơn. Khách bảo to quá. Anh làm nhỏ lại đúng kích thước ban đầu. Khách bảo: "Đó, vậy đó."'],
    { c: '_r_tien', o: [
      { t: '"Lần sau anh gửi kèm bản cũ, đặt tên là bản mới ạ."', fx: { rel: { tien: 2 }, dr: 1 }, then: [['tien', 'Em hiểu nghề quá sớm. Anh hơi buồn cho em.']] },
      { t: 'Mời anh Tiến ly trà đá.', fx: { rel: { tien: 1 }, money: -10_000 }, then: [['tien', 'Trà đá. Đúng kích thước. Không to hơn, không nhỏ hơn. Cảm ơn em.']] },
    ] },
  ] },
  { id: 'r_khoa_test', who: 'khoa', obj: 'Khoa muốn chơi thử trò mới với bạn', scene: [
    ['khoa', 'Trò mới: "Thổi bóng bay tới khi nổ, đội nào nổ trước thắng". Bạn chơi thử với mình đi!'],
    { c: '_r_khoa', o: [
      { t: 'Chơi thử.', fx: { nl: -4, rel: { khoa: 2 } }, then: [['nar', 'Bóng nổ. Mèo Plan B chạy vào kho. Anh Duy nói qua bộ đàm: "Ai bắn súng trong văn phòng?"']] },
      { t: '"Đoàn U50 có người yếu tim đó Khoa."', fx: { uy: 1, rel: { khoa: -1 } }, then: [['khoa', 'Ừ ha… vậy đổi thành "thổi bóng tới khi đẹp". Kém vui hơn. Nhưng không ai đi viện.']] },
    ] },
  ] },
  { id: 'r_hai_voice', who: 'hai', obj: 'Anh Hải đang "khởi động giọng"', scene: [
    ['hai', 'MỜI QUÝ KHÁCH LÊN XE! MỜI QUÝ KHÁCH LÊN XE! …Anh khởi động giọng. Mai có đoàn.'],
    ['lan', 'Tòa bên cạnh vừa gọi hỏi bên mình có bán hàng rong không.'],
    { c: '_r_hai', o: [
      { t: 'Xin anh Hải dạy cách nói to mà không khàn.', fx: { rel: { hai: 2 }, uy: 1 }, then: [['hai', 'Thở bằng bụng! Nói bằng ngực! Và không bao giờ hét lúc khách đang ngủ trên xe!']] },
      { t: 'Đưa anh Hải cái megaphone cho đỡ mệt.', fx: { rel: { hai: 1, lan: 1 } }, then: [['hai', 'Megaphone hả? Anh không cần. Anh là megaphone.']] },
    ] },
  ] },
  { id: 'r_bich_water', who: 'bich', obj: 'Cô Bích hỏi về thùng nước suối', scene: [
    ['bich', 'Hóa đơn ghi ba thùng nước suối. Biên bản giao hàng ghi hai thùng. Ảnh hậu trường thấy một thùng. Thùng nào là thật?'],
    { c: '_r_bich_water', o: [
      { t: 'Lục ảnh trong máy, đếm lại giúp cô.', fx: { nl: -3, rel: { bich: 2 } }, then: [['nar', 'Ảnh lúc 17:02 có hai thùng. Thùng thứ ba nằm trong cốp xe anh Toàn. Bí ẩn được giải. Một phần.']] },
      { t: '"Chắc khách uống hết rồi cô."', fx: { rel: { bich: -1 } }, then: [['bich', 'Khách không uống cả thùng. Cô hỏi tiếp người khác.']] },
    ] },
  ] },
  { id: 'r_lan_mic', who: 'lan', obj: 'Chị Lan tìm thấy một thứ trong kho', scene: [
    ['lan', 'Em biết cái micro không dây mất từ tháng trước không? Chị tìm thấy trong cuộn bạt cũ. Còn pin.'],
    ['lan', 'Cái bộ đàm số 7 thì vẫn mất.'],
    { c: '_r_lan', o: [
      { t: 'Giúp chị Lan dán nhãn từng thiết bị.', fx: { nl: -4, rel: { lan: 2 }, uy: 1 }, then: [['lan', 'Có nhãn rồi. Giờ chỉ cần mọi người trả lại đúng chỗ. Cái đó thì nhãn không giúp được.']] },
      { t: '"Chị đăng lên group: tìm bộ đàm số 7."', fx: { rel: { lan: 1 }, dr: 1 }, then: [['nar', 'Ba phút sau, anh Hải trả lời: "Số 7 ở trong túi anh. Từ tháng Sáu." Group im lặng.']] },
    ] },
  ] },
  { id: 'r_quan_hdmi', who: 'quan', obj: 'Anh Quân cần một tay', scene: [
    ['quan', 'Khách gửi laptop nhờ test slide. Máy Mac. Cổng duy nhất là cổng sạc. Hộp 47 đầu chuyển của anh không có cái nào vừa.'],
    { c: '_r_quan', o: [
      { t: 'Đề xuất chép slide ra USB, chạy bằng máy công ty.', fx: { uy: 2, rel: { quan: 2 } }, then: [['quan', 'USB! Công nghệ năm 2005 cứu năm 2026. Anh thích.']] },
      { t: 'Chạy đi mua đầu chuyển.', fx: { money: -180_000, nl: -4, rel: { quan: 1 } }, then: [['quan', 'Giữ hóa đơn. Cô Bích sẽ hỏi. Hỏi tới khi em nhớ suốt đời.']] },
    ] },
  ] },
  { id: 'r_vy_tiktok', who: 'vy', obj: 'Vy muốn đăng clip hậu trường', scene: [
    ['vy', 'Clip setup đêm qua đẹp lắm! Mình đăng nha? À, góc trái có cái hộp sản phẩm mới của khách, chưa ra mắt.'],
    { c: '_r_vy', o: [
      { t: '"Che hộp sản phẩm đi, hoặc chờ khách ra mắt rồi đăng."', fx: { uy: 2, rel: { vy: 1 } }, then: [['vy', 'Ừ ha… đăng ra mà lộ sản phẩm là mất khách luôn. Mình làm mờ. Cảm ơn bạn.']] },
      { t: '"Đăng đi, ai mà để ý góc trái."', fx: { dr: 4, uy: -2 }, then: [['nar', 'Ba tiếng sau, chị Thảo gọi Vy và bạn vào phòng. Khách có để ý góc trái. Khách luôn để ý góc trái.']] },
    ] },
  ] },
  { id: 'r_zalo', who: 'obj:desk', obj: 'Group Zalo đoàn có 80 tin nhắn mới', scene: [
    ['nar', 'Group "Khỏe Re Đi Biển 🏖️" có 120 thành viên. 80 tin nhắn mới. Tin gần nhất: "mấy giờ xe chạy ạ?".'],
    { mini: ZALO_MINI,
      good: [['nar', 'Bạn ghim một tin. Group im lặng 40 phút. Kỷ lục.'], { fx: { uy: 2 } }],
      bad: [['nar', 'Bạn trả lời từng người. Tin thứ 81: "mấy giờ xe chạy ạ?".'], { fx: { nl: -4 } }],
    },
  ] },
  { id: 'r_cut', who: 'thao', obj: 'Chị Thảo: khách bảo "bớt chút"', scene: [
    ['thao', 'Khách bảo đắt quá, bớt chút. "Chút" là 10%. Em giúp chị chọn chỗ cắt mà show vẫn sống.'],
    { mini: CUT_MINI,
      good: [['thao', 'Standee một mặt, bóng bay ít đi, xe kỹ thuật thường. Không ai biết. Không ai chết.'], { fx: { uy: 2, rel: { thao: 1, duy: 1 } } }],
      bad: [['duy', '(từ xa) Ai vừa gạch máy phát điện? Mất điện là ai đứng trên sân khấu tối thui?'], { fx: { rel: { duy: -1 } } }],
    },
  ] },
  { id: 'r_concept', who: 'khoa', obj: 'Khoa brainstorm tên concept', scene: [
    ['khoa', 'Khách năm nay cấm dùng chữ "Rise". Mình viết 40 cái tên. 37 cái có chữ Rise. Giúp mình.'],
    { mini: CONCEPT_MINI,
      good: [['khoa', '"Đêm Của Những Người Ở Lại". Hơi buồn. Nhưng không có Rise. Gửi khách!'], { fx: { uy: 2, rel: { khoa: 1, tien: 1 } } }],
      bad: [['tien', '(từ xa) Anh thấy chữ Rise. Anh luôn thấy chữ Rise. Nó ở trong giấc mơ của anh.'], { fx: { nl: -2 } }],
    },
  ] },
  { id: 'r_weather', who: 'obj:okr', obj: 'Kiểm tra dự báo thời tiết cho show cuối tuần', scene: [
    ['nar', 'Bạn mở dự báo. Nắng. Refresh. Mưa dông. Refresh. Nắng có mưa. Refresh. "Thời tiết thay đổi."'],
    { c: '_r_weather', o: [
      { t: 'Giữ chỗ rạp và 50 áo mưa "cho chắc".', fx: { uy: 2, rel: { duy: 1 }, money: 0 }, then: [['duy', 'Có Plan B. Copy. Em bắt đầu suy nghĩ giống anh. Anh xin lỗi.']] },
      { t: 'Hỏi Mèo Plan B.', fx: { nl: 2 }, then: [['nar', 'Mèo Plan B nằm giữa văn phòng, không vào kho. Theo kinh nghiệm cả công ty: cuối tuần nắng.']] },
    ] },
  ] },
  { id: 'r_namecards', who: 'obj:printer', obj: 'In 200 thẻ tên cho hội nghị', scene: [
    ['nar', 'Máy in màu in tới thẻ thứ 63 thì hết mực vàng. Tên khách từ thứ 64 trở đi màu xanh lá cây.'],
    { c: '_r_print', o: [
      { t: 'In lại toàn bộ bằng mực đen, gọn gàng.', fx: { nl: -3, uy: 1 }, then: [['nar', 'Đen trắng. Đơn giản. Sang. Chị Kiều đi ngang khen "tối giản quá". Bạn không giải thích.']] },
      { t: 'Để nguyên, gọi đó là "phân màu theo bàn".', fx: { dr: 1, rel: { khoa: 1 } }, then: [['khoa', 'Phân màu theo bàn! Mình đưa vào kịch bản luôn! Bàn xanh lá đi lấy buffet trước!']] },
    ] },
  ] },
  { id: 'r_vendor_fb', who: 'obj:desk', obj: 'Điện thoại rung: lời mời kết bạn', scene: [
    { chat: [['loc', 'Em ơi anh Lộc Xe đây, kết bạn với anh nha. Có job gì cứ gọi anh. Xe 45 chỗ luôn luôn sẵn sàng 🚌', true]] },
    ['think', '"Luôn luôn sẵn sàng". Mình nhớ cái sáng thứ Hai đó.'],
    { c: '_r_fb', o: [
      { t: 'Chấp nhận, lưu số kèm ghi chú: "hay bùng sáng thứ Hai".', fx: { uy: 1, rel: { toan: 1 } }, then: [['toan', '(nhìn qua vai) Ghi chú chuẩn. Danh bạ của em bắt đầu có giá trị.']] },
      { t: 'Để đó, chưa trả lời.', fx: { nl: 1 }, then: [['nar', 'Anh Lộc gửi thêm một sticker con xe buýt đang vẫy tay.']] },
    ] },
  ] },
  { id: 'r_vegetarian', who: 'call:huong', obj: 'Chị Hường bên khách gọi', call: { title: 'Bê Tông Vững Chãi · "hỏi xíu"', people: ['huong', 'me'] }, scene: [
    ['huong', 'Em ơi, hôm tiệc có một anh ăn chay. Anh ấy nói lúc… đã ăn xong. Giờ anh ấy hỏi có được bù không.'],
    { c: '_r_veg', o: [
      { t: '"Dạ, lần sau bên em gửi phiếu khảo sát ăn uống trước sự kiện ạ."', fx: { uy: 2, rel: { huong: 1 } }, then: [['huong', 'Ừ, hay đó. Anh ấy thì… chắc bù một giỏ trái cây. Anh ấy ăn trái cây được.']] },
      { t: '"Dạ, em xin lỗi chị, để em gửi quà cho anh ấy ạ."', fx: { rel: { huong: 1 }, money: -100_000 }, then: [['huong', 'Em dễ thương quá. Giỏ trái cây nhé. Chị gửi địa chỉ.']] },
    ] },
  ] },
  { id: 'r_kieu_2009', who: 'kieu', obj: 'Chị Kiều kể chuyện gala 2009', scene: [
    ['kieu', 'Năm 2009, chị dẫn gala trong mưa. Micro ướt. Giày ướt. Kịch bản ướt. Chị dẫn bằng trí nhớ. Hai tiếng.'],
    ['kieu', 'Sau đêm đó chị lập công ty này. Để không MC nào phải dẫn trong mưa không có rạp.'],
    { c: '_r_kieu_story', o: [
      { t: '"Vậy sao năm nay mình vẫn hay làm sân cỏ ạ?"', fx: { uy: 1, rel: { kieu: 1 }, dr: 1 }, then: [['kieu', '…Vì khách thích sân cỏ. Và chị thích khách. Câu hỏi hay. Chị không trả lời.']] },
      { t: 'Nghe hết câu chuyện, hỏi thêm chi tiết.', fx: { rel: { kieu: 2 }, nl: -2 }, then: [['kieu', 'Em là người đầu tiên hỏi thêm. Mọi người nghe chuyện này 40 lần rồi.']] },
    ] },
  ] },
  { id: 'r_duy_channel', who: 'duy', obj: 'Anh Duy gọi bạn qua (bộ đàm sai kênh)', scene: [
    ['duy', 'Em vừa nói "copy" trên kênh khách. Khách nghe được. Khách hỏi "copy cái gì".'],
    { c: '_r_channel', o: [
      { t: '"Em xin lỗi, em xem lại cách chuyển kênh ạ."', fx: { uy: 1, rel: { duy: 1 } }, then: [['duy', 'Kênh 1 vendor, kênh 2 nội bộ, kênh 3 khách. Kênh 4 là anh với chị Lan nói chuyện riêng. Đừng vào kênh 4.']] },
      { t: '"Khách có vẻ thích mà anh."', fx: { dr: 1 }, then: [['duy', 'Khách hỏi "copy cái gì" ba lần. Khách không thích. Khách sợ.']] },
    ] },
  ] },
  { id: 'r_toan_banhmi', who: 'toan', obj: 'Anh Toàn mang bánh mì về cho team', time: '11:30', scene: [
    ['toan', 'Bánh mì của anh Xe Long An. Ổng chạy xe, vợ ổng bán bánh mì. Ổng gửi cảm ơn vì đợt rồi anh trả tiền đúng hạn.'],
    { fx: { nl: 15 } },
    { c: '_r_banhmi', o: [
      { t: 'Hỏi bí quyết giữ vendor trung thành.', fx: { rel: { toan: 2 } }, then: [['toan', 'Trả đúng hạn. Nhớ tên vợ con người ta. Và đừng bao giờ gọi lúc 23 giờ nếu không phải cháy nhà.']] },
      { t: 'Ăn trong im lặng hạnh phúc.', fx: { nl: 5 }, then: [['nar', 'Bánh mì ngon. Thế giới tạm ổn trong bảy phút.']] },
    ] },
  ] },
  { id: 'r_rooming9', who: 'ngan', obj: 'Rooming list v9 vừa tới', scene: [
    ['ngan', 'v9. Khách thêm 2 người, bớt 1 người, đổi 4 phòng, và hỏi phòng nào có bồn tắm.'],
    { c: '_r_rooming9', o: [
      { t: 'Ngồi làm cùng chị Ngân.', fx: { nl: -4, rel: { ngan: 2 }, uy: 1 }, then: [['ngan', 'Có em, v9 chỉ mất 40 phút. v10 chắc tới tối nay. Chị chuẩn bị tinh thần.']] },
      { t: 'Đề xuất chốt "danh sách cuối cùng" có chữ ký trưởng đoàn.', fx: { uy: 2, rel: { ngan: 1 } }, then: [['ngan', 'Chữ ký! Ừ. Có chữ ký thì v10 là của họ, không phải của mình.']] },
    ] },
  ] },
  { id: 'r_handwritten', who: 'toan', obj: 'Anh Toàn nhận báo giá viết tay', scene: [
    ['toan', 'Anh âm thanh gửi báo giá. Ảnh chụp tờ giấy viết tay. Có vết cà phê. Em gõ lại thành Excel giúp anh.'],
    ['nar', 'Dòng 4: "Loa 2 cặp — 3tr". Hoặc "8tr". Vết cà phê nằm đúng chỗ đó.'],
    { c: '_r_hand', o: [
      { t: 'Gọi anh âm thanh xác nhận từng dòng.', fx: { uy: 2, rel: { toan: 1 } }, then: [['nar', '"Ba triệu em ơi. Cái vết đó là anh làm đổ. Xin lỗi em." Một con số được cứu.']] },
      { t: 'Đoán là 3 triệu.', fx: { dr: 1 }, then: [['nar', 'Đoán đúng. Lần này. Cô Bích không thích chữ "lần này".']] },
    ] },
  ] },
  { id: 'r_cat', who: 'lan', obj: 'Chị Lan: Mèo Plan B vừa chui vào kho', scene: [
    ['lan', 'Plan B vừa chui vào kho. Em biết nghĩa là gì rồi đấy.'],
    ['kpi', 'Meo.'],
    { c: '_r_cat', o: [
      { t: 'Báo cả team mang áo mưa chiều nay.', fx: { uy: 1, rel: { lan: 1 } }, then: [['nar', '15:20 trời đổ mưa. Cả team khô. Mèo Plan B được thêm một hộp pate.']] },
      { t: 'Cười, con mèo thì biết gì.', fx: { nl: -3 }, then: [['nar', '15:20 trời đổ mưa. Bạn về nhà ướt từ đầu tới chân. Con mèo biết.']] },
    ] },
  ] },
  { id: 'r_hai_tip', who: 'hai', obj: 'Anh Hải có chuyện muốn hỏi', scene: [
    ['hai', 'Đoàn tuần trước tip anh 500 nghìn. Anh nên báo công ty không? Anh hỏi em vì anh hỏi chị Kiều thì chị sẽ hát.'],
    { c: '_r_tip', o: [
      { t: '"Anh cứ báo, minh bạch thì không ai nói được gì."', fx: { uy: 1, rel: { hai: 1, bich: 1 } }, then: [['bich', '(vọng ra) Tip của khách cho cá nhân thì cá nhân giữ, nhưng báo cho cô biết. Cô không lấy. Cô chỉ ghi.']] },
      { t: '"Anh khao cả team trà sữa là xong."', fx: { rel: { hai: 2, vy: 1 }, nl: 6 }, then: [['hai', 'TRÀ SỮA CHO CẢ TEAM! …Xin lỗi. Trà sữa cho cả team.']] },
    ] },
  ] },
  { id: 'r_mc_tip', who: 'kieu', obj: 'Chị Kiều có một mẹo MC cho bạn', when: F('mc_hosted'), scene: [
    ['kieu', 'Hôm hội nghị em dẫn được đấy. Chị cho em một mẹo: lúc run, nhìn vào người mặc áo sáng màu nhất ở hàng thứ ba.'],
    ['kieu', 'Năm 2009 người đó là một chú mặc áo vàng. Chú ấy giờ là anh Quang.'],
    { fx: { rel: { kieu: 2 }, uy: 1 } },
  ] },
  { id: 'r_gala_photo', who: 'tien', obj: 'Anh Tiến khoe ảnh gala lên fanpage', when: F('gala_saved'), scene: [
    ['tien', 'Ảnh gala mưa lên fanpage. Khách share. 2.000 like. Công ty vui một ngày.'],
    ['tien', 'Ảnh đẹp nhất là ảnh 300 người dưới rạp, đèn vàng, mưa bên ngoài. Ai chụp anh không biết. Hình như là em.'],
    { fx: { uy: 2, rel: { tien: 1 } } },
  ] },
  // official-only
  { id: 'r_off_2am', who: 'obj:desk', obj: 'Đọc lại tin nhắn đêm qua', official: true, scene: [
    ['nar', 'Tin nhắn lúc 2:14 sáng, anh Thắng: "Em ơi, mai mấy giờ đón?". Tin lúc 2:15, chị Thảo: "Em trả lời giúp chị nha 🙏".'],
    ['think', 'Hồi intern, giờ này mình đang ngủ. Hồi đó mình không biết đó là một đặc ân.'],
    { c: '_r_off_2am', o: [
      { t: 'Trả lời ngay bây giờ (8:30 sáng), kèm tin ghim.', fx: { uy: 1, nl: -2 }, then: [['nar', 'Anh Thắng trả lời: "ok em". Cả đêm qua bạn mơ thấy chữ "ok em".']] },
      { t: 'Đặt chế độ "Không làm phiền" từ 22:00.', fx: { nl: 5, dr: 1 }, then: [['think', 'Mình sẽ bị gọi là "không nhiệt tình". Mình sẽ được ngủ.']] },
    ] },
  ] },
  { id: 'r_off_intern', who: 'vy', obj: 'Vy hỏi bạn như hỏi một "tiền bối"', official: true, scene: [
    ['vy', 'Giờ bạn là chính thức rồi. Mình hỏi thật: có khác không?'],
    { c: '_r_off_intern', o: [
      { t: '"Khác. Giờ không ai tha lỗi vì mình là intern nữa."', fx: { rel: { vy: 2 } }, then: [['vy', 'Vậy mình làm intern thêm chút nữa. Được tha lỗi cũng là một loại phúc lợi.']] },
      { t: '"Khác. Có bảo hiểm. Không có cuối tuần."', fx: { rel: { vy: 1 }, dr: 1 }, then: [['vy', 'Bảo hiểm để làm gì nếu không có cuối tuần để bị ốm.']] },
    ] },
  ] },
  { id: 'r_off_budget', who: 'bich', obj: 'Cô Bích: ngân sách show do bạn duyệt', official: true, scene: [
    ['bich', 'Giờ em là người duyệt ngân sách show. Ký vào đây. Từ giờ, thùng nước suối thứ ba là trách nhiệm của em.'],
    { c: '_r_off_budget', o: [
      { t: 'Đọc kỹ từng dòng trước khi ký.', fx: { uy: 2, rel: { bich: 2 }, nl: -3 }, then: [['bich', 'Em đọc. Cả công ty này chỉ có hai người đọc trước khi ký. Cô và em.']] },
      { t: 'Ký nhanh, show đang chờ.', fx: { dr: 2 }, then: [['bich', 'Ký nhanh. Cô ghi nhận. Theo nghĩa cô hay ghi nhận.']] },
    ] },
  ] },
];

export const SIDE_TASKS = [
  { id: 'tape', title: 'Lấy 5 cuộn băng keo đen ở kho cho anh Duy', from: 'duy', base: 60, legs: [
    { npc: 'duy', line: ['duy', 'Băng keo đen. Năm cuộn. Kho. Chị Lan. Đi.'] },
    { npc: 'lan', line: ['lan', 'Năm cuộn hả? Chị còn bốn. Cuộn thứ năm anh Duy đang đeo trên tay, ảnh không biết.'] },
    { npc: 'duy', line: ['duy', 'Bốn cuộn với… à, cái này. Copy. Cảm ơn.'] },
  ] },
  { id: 'namecards', title: 'In 40 thẻ tên đoàn cho chị Ngân', from: 'ngan', base: 70, legs: [
    { npc: 'ngan', line: ['ngan', 'In giúp chị 40 thẻ tên đoàn. Soát dấu. Đừng để có "Nguyễn Văn Ạnh".'] },
    { obj: 'printer', line: ['nar', 'Máy in kẹt giấy ở thẻ thứ 17. Bạn rút ra, in lại. Thẻ 17 là "Nguyễn Văn Ạnh". Bạn sửa.'] },
    { npc: 'ngan', line: ['ngan', 'Bốn mươi thẻ, đúng dấu. Em là người của chị.'] },
  ] },
  { id: 'redinvoice', title: 'Đòi hóa đơn đỏ từ anh Toàn cho cô Bích', from: 'bich', base: 80, legs: [
    { npc: 'bich', line: ['bich', 'Anh Toàn nợ cô ba hóa đơn đỏ từ tháng trước. Em đi đòi. Đòi bằng ánh mắt.'] },
    { npc: 'toan', line: ['toan', 'Hóa đơn hả? Ở trong cốp xe. Cạnh thùng nước suối thứ ba. Đây, cầm đi.'] },
    { npc: 'bich', line: ['bich', 'Ba tờ. Đủ dấu. Và… có cả thùng nước suối thứ ba à? Để cô ghi.'] },
  ] },
  { id: 'quote', title: 'Giục Mỹ gửi báo giá v5 cho chị Thảo', from: 'thao', base: 60, legs: [
    { npc: 'thao', line: ['thao', 'Em qua giục Mỹ gửi chị báo giá v5 nhé. Khách đang chờ. Chị đã nói "5 phút nữa ạ" hai lần.'] },
    { npc: 'my', line: ['my', 'v5 đây. Nó giống v4, trừ màu chữ. Chị Thảo bảo khách sẽ thấy khác.'] },
    { npc: 'thao', line: ['thao', 'Cảm ơn em! Khác hẳn luôn!'] },
  ] },
  { id: 'adapter', title: 'Mang đầu chuyển HDMI từ anh Quân cho anh Tiến', from: 'tien', base: 50, legs: [
    { npc: 'quan', line: ['quan', 'Đầu chuyển Type-C sang HDMI. Cái nhãn số 23. Nhớ mang trả. Lần trước nó đi show rồi không về.'] },
    { npc: 'tien', line: ['tien', 'Cảm ơn em. Màn hình phụ lên rồi. Giờ anh nhìn chữ Rise trên hai màn hình.'] },
  ] },
  { id: 'battery', title: 'Tìm pin megaphone cho anh Hải', from: 'hai', base: 60, legs: [
    { npc: 'hai', line: ['hai', 'Megaphone hết pin! Anh không cần nó! Nhưng khách thích thấy anh cầm nó!'] },
    { npc: 'lan', line: ['lan', 'Pin tiểu? Ngăn kéo thứ ba. Ghi vào sổ mượn. Anh Hải chưa trả pin lần trước.'] },
    { npc: 'hai', line: ['hai', 'PIN! …Cảm ơn em. Anh sẽ ghi sổ. Thật.'] },
  ] },
  { id: 'honeytea', title: 'Pha trà mật ong cho giọng chị Kiều', from: 'kieu', base: 50, legs: [
    { npc: 'kieu', line: ['kieu', 'Em ơi, giọng chị hơi khàn. Trà gừng mật ong. Không đường. Giọng là tài sản của công ty.'] },
    { obj: 'coffee', line: ['nar', 'Pantry có gừng, có mật ong, và một hũ bánh quy từ gala tuần trước. Bạn pha trà.'] },
    { npc: 'kieu', line: ['kieu', 'Ấm. Vừa. Xin một tràng pháo tay cho… thôi, chị giữ giọng.'] },
  ] },
  { id: 'flags', title: 'Lấy cờ đội từ kho cho Khoa', from: 'khoa', base: 70, legs: [
    { npc: 'khoa', line: ['khoa', 'Mình cần 8 lá cờ đội cho team building. Ở kho, chỗ con lân.'] },
    { npc: 'lan', line: ['lan', 'Còn 7 lá. Lá thứ tám bị sóng cuốn mất ở Vũng Tàu. Nó đang đi du lịch một mình.'] },
    { npc: 'khoa', line: ['khoa', 'Bảy lá. Ừ. Mình đổi thành 7 đội. Kịch bản linh hoạt.'] },
  ] },
  { id: 'contract', title: 'Đưa hợp đồng vendor cho cô Bích ký nháy', from: 'duy', base: 80, legs: [
    { npc: 'duy', line: ['duy', 'Hợp đồng rạp với anh Tư. Mang qua cô Bích ký nháy. Đừng để cô đọc trang 9 trước khi anh đi.'] },
    { npc: 'bich', line: ['bich', 'Cô đọc trang 9 rồi. Phạt hủy 50%. Cô ký. Nhưng cô ghi chú.'] },
    { npc: 'duy', line: ['duy', 'Cô ghi chú gì? …Thôi, đừng nói. Copy.'] },
  ] },
  { id: 'powerbank', title: 'Tìm sạc dự phòng cho Vy ở bàn bạn', from: 'vy', base: 50, legs: [
    { npc: 'vy', line: ['vy', 'Bạn ơi, sạc dự phòng của mình… hình như mình để ở bàn bạn hôm qua.'] },
    { obj: 'desk', line: ['nar', 'Dưới chồng run-sheet có một cục sạc, một gói xôi đã cứng, và một cái áo mưa. Đúng bộ sinh tồn của Vy.'] },
    { npc: 'vy', line: ['vy', 'Cả gói xôi luôn hả? Ơ… cái đó bạn giữ đi. Coi như quà.'] },
  ] },
  { id: 'hdvroom', title: 'Hỏi anh Hải cần mấy phòng cho đội HDV', from: 'ngan', base: 70, legs: [
    { npc: 'ngan', line: ['ngan', 'Hỏi anh Hải giúp chị: đội HDV với quản trò cần mấy phòng. Đừng để ảnh hét con số.'] },
    { npc: 'hai', line: ['hai', 'BA PHÒNG! …Xin lỗi. Ba phòng. Một phòng cho anh với cái cờ.'] },
    { npc: 'ngan', line: ['ngan', 'Ba phòng. Chị nghe rồi. Cả tầng nghe rồi.'] },
  ] },
  { id: 'altar', title: 'Thắp hương cầu tạnh mưa cho anh Toàn', from: 'toan', base: 40, legs: [
    { npc: 'toan', line: ['toan', 'Cuối tuần có show ngoài trời. Em thắp giúp anh nén hương. Anh không mê tín. Anh chỉ cẩn thận.'] },
    { obj: 'altar', line: ['nar', 'Bàn thờ Thần Tài có ba cái ô gấp làm lễ vật. Bạn đặt thêm một cái áo mưa.'] },
    { npc: 'toan', line: ['toan', 'Cảm ơn em. Giờ thì gọi đặt rạp. Thần Tài lo tiền, không lo mưa.'] },
  ] },
];
