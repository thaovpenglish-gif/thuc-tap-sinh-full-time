// Đi Đâu Cũng Được — desk work ("Ngồi vào bàn"): the real work of an event & travel intern, plus the group-chat
// drama that still finds you. Engine: game/desk.js + modes/solo.js. Contract: docs/COMPANY_CONTRACT.md §12.
// games (5): 2 hands-on (ui/action.js: bơm bóng cổng chào, soát vé check-in) + 3 work sims (ui/sims.js):
//   event_contract doc  · hợp đồng resort, kế hoạch đón đoàn, báo giá gala
//   event_client   chat · khách đổi ý lúc 23h trước ngày diễn
//   event_vendor   chat · nhà cung cấp âm thanh / nhà xe báo trễ ngày diễn
// chatter: [castId, text, dm?] messages that land WHILE you play, then a short scene with one choice.
// Legal/safety rules are simplified (thông tin giải trí, không phải tư vấn pháp lý).

const F = (k) => (r) => !!r.flags[k];

export const DESK = {
  games: [
    // ---- hands-on (ui/action.js) ----
    { id: 'event_balloon', type: 'action', game: 'hold', skin: 'balloon', title: 'Bơm bóng cổng chào', icon: '🎈', time: 40, pass: 0.6,
      rounds: 5, color: '#ffe08a', label: 'KHỎE RE',
      prompt: 'Khách muốn cổng chào 500 quả bóng "to vừa, đừng to quá". Giữ để bơm, thả ra khi bóng chạm vòng xanh.',
      hint: 'Giữ chuột / chạm giữ màn hình (hoặc giữ Space). Bơm quá là BỤP.' },
    { id: 'event_checkin', type: 'action', game: 'conveyor', mode: 'stamp', title: 'Soát vé check-in', icon: '🎟️', time: 40, pass: 0.6, count: 12,
      stampText: 'MỜI VÀO', hit: 'Mời vào!', wrongHit: 'Cho nhầm người vào!', miss: 'Khách hợp lệ bị bỏ sót!',
      target: { emoji: '🎟️', labels: ['Vé có tên trong danh sách', 'Vé QR còn hạn', 'Thẻ VIP đúng ngày', 'Khách mời có thư mời'] },
      avoid: { emoji: '⚠️', labels: ['Vé sự kiện năm ngoái', 'Ảnh chụp vé người khác', 'Không có tên trong danh sách', 'Vé in từ ảnh mờ'] },
      prompt: 'Khách xếp hàng dài. Chỉ đóng dấu MỜI VÀO cho vé hợp lệ khi vé chạy vào khung đỏ.',
      rule: 'Bấm (hoặc Space) khi vé HỢP LỆ vào khung đỏ' },
    // ---- work sims (ui/sims.js): real event & travel work ----
    { id: 'event_contract', type: 'doc', title: 'Soát hợp đồng và kế hoạch', icon: '📑', time: 80, pass: 0.6,
      prompt: 'Đọc kỹ trước khi ký hoặc gửi khách. Bấm 🚩 vào mọi dòng sai số, thiếu phương án hoặc là rủi ro. Dòng trông lạ chưa chắc đã sai.',
      docs: [
        { kind: 'contract', head: 'Hợp đồng dịch vụ · Biển Xanh Resort', meta: 'Đoàn Dược Khỏe Re · 120 khách · 3 ngày 2 đêm · 60 phòng đôi · gala tối ngày 2 ngoài bãi biển',
          lines: [
            { h: 'Phòng và tiệc' },
            '60 phòng đôi tiêu chuẩn × 2 đêm × 1.400.000đ = 168.000.000đ · gồm ăn sáng',
            'Tặng 1 phòng FOC cho hướng dẫn viên, ngoài 60 phòng trên',
            'Nhận phòng 14:00 · trả phòng 12:00 · theo tiêu chuẩn của resort',
            'Gala tối ngày 2 tại bãi biển · 120 suất × 650.000đ = 78.000.000đ',
            { t: 'Trời mưa: "xử lý tùy tình hình thực tế"', bad: 'Tiệc ngoài trời phải ghi rõ phương án mưa: sảnh trong nhà nào, chốt trước mấy giờ, ai chịu chi phí chuyển.' },
            { h: 'Thanh toán và hủy' },
            { t: 'Tổng giá trị hợp đồng: 264.000.000đ', bad: '168 triệu + 78 triệu = 246 triệu, không phải 264 triệu. Sai tổng thì cọc, hóa đơn, quyết toán sai theo.' },
            'Đặt cọc 30% khi ký: 246.000.000đ × 30% = 73.800.000đ',
            'Phần còn lại thanh toán trong 7 ngày sau sự kiện, có hóa đơn VAT',
            'Chốt số khách trước 7 ngày · được giảm tối đa 10% số khách không bị phạt',
            { t: 'Bên mình hủy: phạt 100% giá trị hợp đồng, bất kể thời điểm hủy', bad: 'Phạt hủy phải chia theo mốc ngày (càng gần ngày càng cao). 100% ở mọi thời điểm là rủi ro không giới hạn.' },
            { t: 'Resort được chuyển đoàn sang khách sạn "tương đương" không cần báo trước', bad: 'Đổi địa điểm phải được bên mình đồng ý bằng văn bản. "Tương đương" mà không có tiêu chí thì ai cũng tự nói được.' },
          ],
          verdict: { q: 'Ký hợp đồng này chưa?', options: ['Chưa: gửi chị Diễm đề nghị sửa các điều khoản đã đánh dấu', 'Ký luôn, chị Diễm dặn "ký nhanh giúp chị nha"', 'Ký trước, sửa sau bằng tin nhắn Zalo'], correct: 0,
            why: 'Sửa trước khi ký thì dễ. Ký rồi thì điều khoản phạt 100% đã ràng buộc (thông tin giải trí, không phải tư vấn pháp lý).' } },
        { kind: 'paper', head: 'Kế hoạch đón đoàn Khỏe Re · ngày 1', meta: '120 khách + 2 HDV · khởi hành 09:00 trước trụ sở khách · resort cách 150 km, khoảng 3 tiếng kể cả nghỉ · resort nhận phòng 14:00',
          lines: [
            { h: 'Di chuyển' },
            { t: 'Xe: 2 xe 45 chỗ của nhà xe Lộc Phát', bad: '122 người mà 2 xe 45 chỗ chở tối đa 90: cần ít nhất 3 xe. Không ai được đứng hay ngồi ghế nhựa ở lối đi.' },
            '07:30 · Anh Hải có mặt điểm hẹn, phát nước, điểm danh theo danh sách',
            '09:00 · Khởi hành · 10:30 dừng trạm nghỉ 20 phút',
            { t: '12:00 · Đến resort, cả đoàn nhận phòng ngay, cất đồ', bad: 'Resort nhận phòng 14:00: đến 12:00 là 120 người đứng chờ ở sảnh. Xếp ăn trưa trước, hoặc xin nhận phòng sớm bằng văn bản.' },
            '13:00 · Ăn trưa set menu tại nhà hàng resort · 122 suất',
            '14:30 · Tự do tắm biển · khu có cứu hộ trực đến 17:00',
            { h: 'Buổi tối' },
            '18:30 · Tiệc nướng bãi biển · mưa thì chuyển vào sảnh Hoàng Hôn (đã giữ chỗ)',
            { t: '21:00 · Cả đoàn tắm biển đêm sau tiệc "cho vui"', bad: 'Tắm biển đêm: không có cứu hộ, nhiều bãi cấm, lại sau tiệc có bia. Không đưa vào chương trình.' },
            '22:00 · Anh Hải trực sảnh · số điện thoại khẩn cấp đã gửi cả đoàn',
            { h: 'Hồ sơ đoàn' },
            { t: 'Danh sách đoàn: mới có họ tên, chưa có số CCCD và ngày sinh', bad: 'Thiếu thông tin để mua bảo hiểm du lịch cho khách và để resort khai báo lưu trú: phải có trước ngày đi.' },
            'Bác sĩ đi theo đoàn ở phòng riêng (đúng hợp đồng)',
            'Anh Cường và anh Hùng tự đăng ký ở chung phòng (năm ngoái có cãi nhau)',
          ],
          verdict: { q: 'Gửi kế hoạch này cho anh Thắng chưa?', options: ['Chưa: sửa số xe, giờ nhận phòng, bỏ tắm đêm, xin đủ danh sách', 'Gửi luôn, anh Hải xử lý tại chỗ được', 'Gửi, ghi thêm "có thể thay đổi"'], correct: 0,
            why: 'Kế hoạch gửi khách là lời hứa. Lỗi nào sửa được trên giấy thì đừng để anh Hải sửa giữa đường.' } },
        { kind: 'contract', head: 'Báo giá Gala 25 năm · Bê Tông Vững Chãi', meta: '300 khách · sân cỏ ngoài trời · 18:00–22:00 · ngân sách khách duyệt 550 triệu, chưa gồm VAT',
          lines: [
            { h: 'Hạng mục' },
            'Sân khấu, màn LED 40 m², âm thanh, ánh sáng: 120.000.000đ',
            'Tiệc buffet: 300 suất × 850.000đ = 255.000.000đ',
            'MC Khải và ban nhạc: 35.000.000đ',
            'Hoa, backdrop, cổng chào bóng bay: 28.000.000đ',
            { t: 'Pháo hoa nổ tầm cao bắn từ sân cỏ: 30.000.000đ', bad: 'Pháo hoa nổ phải được cơ quan có thẩm quyền cho phép và do đơn vị được phép bắn: không báo giá như hạng mục thường.' },
            'Rạp che mưa 1.200 m²: đã giữ chỗ, hủy trước 48 giờ không mất phí',
            { h: 'Tổng và điều khoản' },
            { t: 'Tạm tính: 478.000.000đ', bad: '120 + 255 + 35 + 28 + 30 = 468 triệu, không phải 478. Cộng sai một dòng là khách nghi cả bảng giá.' },
            'Phí quản lý 10%: 46.800.000đ',
            'Tổng chưa VAT: 514.800.000đ',
            { t: 'Ghi chú: "Giá trên đã bao gồm mọi phát sinh"', bad: 'Báo giá phải ghi rõ cái gì không gồm và phát sinh tính thế nào. "Mọi phát sinh" là tự ôm hết các lần khách đổi ý lúc 23h.' },
            'Load-in 22:00 hôm trước · trả sân cỏ sạch lúc 06:00 hôm sau sự kiện',
            'Hiệu lực báo giá 15 ngày · cọc 50% khi ký hợp đồng',
          ],
          verdict: { q: 'Gửi báo giá cho chị Hường chưa?', options: ['Chưa: sửa tổng, bỏ pháo hoa nổ, ghi rõ cách tính phát sinh', 'Gửi luôn, khách chỉ đọc dòng tổng', 'Gửi, giảm thêm 10% cho khách vui'], correct: 0,
            why: 'Báo giá là cam kết. Sai một con số hay một câu điều khoản thì lúc quyết toán, mình là người trả.' } },
      ] },

    { id: 'event_client', type: 'chat', title: 'Khách đổi ý lúc 23h', icon: '🌙', time: 85, pass: 0.6,
      prompt: 'Khách nhắn đêm trước ngày diễn. Giữ khách, nhưng mọi thay đổi phải khả thi, có giá và có xác nhận. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Chị Hường', emoji: '💼', role: 'HR · Bê Tông Vững Chãi (khách)', app: 'Zalo' },
          start: ['23:07 rồi, chị xin lỗi em 🙏', 'Anh Quang vừa xem gala bên đối thủ. Anh muốn thêm 50 khách và đổi backdrop sang đỏ. Cho mai luôn nhé em.'],
          turns: [
            { options: [
              { t: 'Dạ em ghi nhận ạ. Em kiểm tra suất ăn, chỗ ngồi, xưởng in rồi báo chị chi phí trước 8h sáng.', s: 2, react: 'Ok em. Có số trước 8h là chị yên tâm.' },
              { t: 'Dạ được chị ơi, chị cứ báo anh Quang là bên em lo hết, thêm bao nhiêu khách cũng được, backdrop em cho in lại ngay trong đêm ạ.', s: 0, react: 'Tuyệt, chị báo anh Quang là xong hết rồi nhé!' },
              { t: 'Dạ muộn quá rồi chị ơi 😥', s: 1, react: 'Chị biết. Nhưng anh Quang là Chủ tịch em ạ.' },
            ] },
            { them: 'Chi phí bao nhiêu em? Anh Quang bảo "chắc không đáng bao nhiêu".', options: [
              { t: 'Dạ chắc tầm vài chục triệu ạ', s: 1, react: 'Vài chục là bao nhiêu? Anh Quang hỏi số.' },
              { t: 'Dạ 50 suất × 850.000đ = 42,5 triệu, backdrop in gấp 12 triệu. Em gửi phụ lục để chị duyệt ạ.', s: 2, react: 'Rõ ràng. Chị chuyển anh Quang luôn.' },
              { t: 'Dạ chắc không đáng bao nhiêu đâu chị, sau sự kiện mình tính chung một thể, giờ khuya rồi em không muốn làm phiền chị với anh Quang thêm ạ.', s: 0, react: 'Ừ, vậy coi như không phát sinh nhé em.' },
            ] },
            { them: 'Ok em. Chị nhắn Zalo đồng ý là được chứ? Giờ này chị không ký được.', options: [
              { t: 'Dạ không cần đâu chị, tin chị mà, chị dạ một tiếng là bên em làm luôn, giấy tờ để sau sự kiện cô Bích bên em lo, chị cứ nghỉ đi ạ.', s: 0, react: 'Ok, chị đi ngủ đây.' },
              { t: 'Dạ chị gửi email xác nhận phụ lục giúp em, sáng mai mình ký bổ sung ạ.', s: 2, react: 'Ok, chị gửi email ngay.' },
              { t: 'Dạ chị thả tim tin nhắn này là được ạ', s: 1, react: 'Thả tim cũng tính hả em? 😅' },
            ] },
            { them: 'À, anh Quang hỏi thêm: lúc cắt bánh bắn pháo hoa được không em?', options: [
              { t: 'Dạ để em hỏi anh Duy ạ', s: 1, react: 'Ok em, nhanh nhé.' },
              { t: 'Dạ được chị, anh Toàn bên em quen một chỗ có pháo hoa, mình bắn nhanh vài phút lúc cắt bánh thôi, chắc không ai kiểm tra đâu ạ.', s: 0, react: 'Hay quá! Anh Quang sẽ thích lắm.' },
              { t: 'Dạ pháo hoa nổ phải xin phép, đêm nay không kịp ạ. Em đề xuất pháo hoa lạnh trên sân khấu.', s: 2, react: 'À, vậy pháo hoa lạnh. Chị báo anh Quang.' },
            ] },
          ],
          end: { good: 'Chị gửi email xác nhận rồi nhé. Cảm ơn em, mai gặp lúc load-in.', bad: 'Anh Quang hỏi sao mai không giống như anh nghĩ. Chị cũng không biết trả lời sao.' } },
        { who: { name: 'Anh Thắng', emoji: '💊', role: 'Trưởng đoàn · Dược phẩm Khỏe Re (khách)', app: 'Zalo' },
          start: ['23:15. Em ơi anh Thắng đây.', 'Có 6 người xin đi thêm. Mai đi luôn được không em?'],
          turns: [
            { options: [
              { t: 'Dạ được anh, cứ cho các anh chị ấy ra điểm hẹn lúc 7h30, lên xe là đi thôi ạ, bảo hiểm với phòng ốc em xử lý dần trên đường anh nhé.', s: 0, react: 'Nhanh gọn! Anh báo 6 người luôn.' },
              { t: 'Dạ chắc được anh ạ', s: 1, react: 'Chắc là được, hay là được?' },
              { t: 'Dạ xe còn ghế ạ. Anh gửi em họ tên, CCCD, ngày sinh để mua bảo hiểm và hỏi resort thêm phòng.', s: 2, react: 'Ok, anh gửi danh sách liền.' },
            ] },
            { them: 'Resort báo hết phòng đôi. Hay mỗi phòng đôi ghép thêm 1 người, cho đỡ phức tạp?', options: [
              { t: 'Dạ ghép phải có giường phụ và hỏi ý người trong phòng ạ. Em tìm thêm phòng gần resort.', s: 2, react: 'Ừ, hỏi ý người ta là đúng.' },
              { t: 'Dạ để em hỏi chị Ngân ạ', s: 1, react: 'Ừ, mà nhanh nhé em.' },
              { t: 'Dạ được anh, mỗi phòng đôi thêm một người là ổn, giường đôi rộng mà, mình không cần báo resort đâu ạ, cho đỡ tiền giường phụ.', s: 0, react: 'Ok. Mà resort hỏi thì sao em?' },
            ] },
            { them: 'Còn bữa trưa, anh muốn đổi sang quán hải sản của bạn anh, ngon mà rẻ.', options: [
              { t: 'Dạ nhà hàng cũ đã cọc và chốt suất ạ. Đổi bây giờ là mất cọc, em báo anh số tiền trước nhé.', s: 2, react: 'Mất cọc à? Thôi giữ chỗ cũ.' },
              { t: 'Dạ được anh, em hủy nhà hàng cũ ngay tối nay, mai cả đoàn ghé quán bạn anh, quán quen thì chắc vệ sinh an toàn rồi, khỏi cần hợp đồng ạ.', s: 0, react: 'Tốt, để anh báo bạn anh nấu 128 suất.' },
              { t: 'Dạ ok anh', s: 1, react: 'Ok là đổi được hả em? Nhanh vậy?' },
            ] },
            { them: 'Phí cho 6 người thêm tính sao em? Có giảm không?', options: [
              { t: 'Dạ thêm có 6 người thôi mà anh, em không tính phí đâu ạ, coi như quà công ty em tặng đoàn mình, chị Thảo bên em chắc cũng đồng ý thôi ạ.', s: 0, react: 'Tuyệt vời! Anh khen em với chị Kiều.' },
              { t: 'Dạ tính theo đơn giá hợp đồng ạ. Em gửi phụ lục, anh duyệt là mình chốt.', s: 2, react: 'Ok, đúng giá hợp đồng là được.' },
              { t: 'Dạ để em hỏi chị Thảo ạ', s: 1, react: 'Ừ, em hỏi rồi báo anh.' },
            ] },
          ],
          end: { good: 'Ok em. Danh sách 6 người anh gửi rồi. 7h30 gặp nhé.', bad: 'Thôi anh bảo 6 người tự đi xe riêng vậy. Có gì anh nói với chị Kiều.' } },
      ] },

    { id: 'event_vendor', type: 'chat', title: 'Nhà cung cấp báo trễ', icon: '📞', time: 85, pass: 0.6,
      prompt: 'Ngày diễn, nhà cung cấp nhắn tin xấu. Giải quyết nhanh, an toàn, đúng hợp đồng, và báo đúng người. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Anh Bảo', emoji: '🔊', role: 'Âm thanh Sấm Sét · nhà cung cấp', app: 'Zalo' },
          start: ['Em ơi anh Bảo âm thanh đây.', 'Xe thiết bị hỏng giữa đường, chắc 16h mới tới. Lịch test 14h, khách vào 18h.'],
          turns: [
            { options: [
              { t: 'Dạ trời ơi sao lại thế anh 😭', s: 1, react: 'Anh cũng muốn khóc đây em.' },
              { t: 'Dạ anh gửi em vị trí xe và giờ tới chính xác ạ. Em báo anh Duy chỉnh lịch.', s: 2, react: 'Anh gửi định vị rồi. Xe ở đầu cầu.' },
              { t: 'Dạ không sao đâu anh, 18h khách mới vào mà, anh cứ từ từ, 17h30 tới test nhanh cũng kịp, bên em quen chạy nước rút rồi anh ạ.', s: 0, react: 'Ok, vậy anh không vội nữa nhé.' },
            ] },
            { them: 'Hay anh điều xe khác, nhưng phát sinh 5 triệu tiền xe. Bên em chịu nhé?', options: [
              { t: 'Dạ vâng anh cứ điều xe đi ạ, 5 triệu em tự quyết được, có gì em báo cô Bích sau, cô dễ tính lắm, không cần báo giá hay phụ lục gì đâu ạ.', s: 0, react: 'Ok, anh ghi vào hóa đơn nhé.' },
              { t: 'Dạ hợp đồng ghi vận chuyển do bên anh lo ạ. Anh điều xe ngay giúp em nhé.', s: 2, react: 'Ừ… đúng là hợp đồng ghi vậy. Anh điều xe.' },
              { t: 'Dạ để em hỏi anh Duy ạ', s: 1, react: 'Nhanh nhé em, xe đang đứng giữa đường.' },
            ] },
            { them: 'Ok, 15h xe tới. Test âm thanh chắc chỉ còn khoảng 1 tiếng.', options: [
              { t: 'Dạ mình test micro MC và nhạc khai mạc trước ạ. Anh nhớ mang micro dự phòng.', s: 2, react: 'Chuẩn. Anh mang 4 micro dự phòng.' },
              { t: 'Dạ một tiếng chắc đủ ạ', s: 1, react: 'Đủ, nếu không có gì hỏng thêm.' },
              { t: 'Dạ vậy mình bỏ test luôn cho kịp anh nhé, thiết bị bên anh xịn mà, khách vào là bật lên chạy, có gì anh Quân bên em chữa cháy tại chỗ ạ.', s: 0, react: 'Ok, bỏ test. Hy vọng không hú.' },
            ] },
            { them: 'Lần sau anh giảm giá cho em. Mà em đừng kể với anh Duy chuyện trễ nhé.', options: [
              { t: 'Dạ vâng anh, em giữ kín cho anh, coi như hôm nay mọi thứ đúng giờ, em không ghi vào báo cáo sự kiện đâu, lần sau anh giảm cho em là được ạ.', s: 0, react: 'Em được việc ghê. Anh nhớ em.' },
              { t: 'Dạ để em xem ạ', s: 1, react: 'Xem gì em, chuyện nhỏ mà.' },
              { t: 'Dạ em phải báo anh Duy để chỉnh run-sheet ạ. Cảm ơn anh điều xe nhanh.', s: 2, react: 'Ừ, em nói đúng. Anh tự gọi Duy xin lỗi.' },
            ] },
          ],
          end: { good: '15:02 anh tới rồi. Micro MC test trước nhé em.', bad: '17:40 anh mới tới. Em nói anh Duy giúp là anh xin lỗi nhé.' } },
        { who: { name: 'Anh Lộc Xe', emoji: '🚌', role: 'Nhà xe Lộc Phát · nhà cung cấp', app: 'Zalo' },
          start: ['6:10 sáng. Em ơi anh Lộc đây.', 'Xe số 3 hỏng máy lạnh. Anh đổi sang xe 29 chỗ nhé, cho vài người đứng.'],
          turns: [
            { options: [
              { t: 'Dạ không cho khách đứng được anh ạ. Anh đổi xe 29 chỗ kèm thêm xe 16 chỗ nhé.', s: 2, react: 'Ừ, 29 với 16 là đủ 45. Để anh tìm.' },
              { t: 'Dạ thôi cũng được anh, đi có 3 tiếng thôi mà, mấy anh chị trẻ đứng hoặc ngồi ghế nhựa ở lối đi một chút cũng không sao, miễn kịp giờ ạ.', s: 0, react: 'Ok, anh mang thêm ghế nhựa.' },
              { t: 'Dạ để em hỏi anh Toàn ạ', s: 1, react: 'Hỏi nhanh nhé, 7h30 đón khách rồi.' },
            ] },
            { them: 'Có xe 16 chỗ của bạn anh. Xe hết hạn đăng kiểm tuần trước, nhưng chạy vẫn ngon.', options: [
              { t: 'Dạ được anh, mới hết hạn có một tuần thôi, chạy quốc lộ chắc không bị kiểm tra đâu, anh dặn tài xế đi cẩn thận một chút là ổn ạ.', s: 0, react: 'Ok, anh cho xe chạy luôn.' },
              { t: 'Dạ xe hết hạn đăng kiểm thì không được chở khách ạ. Anh tìm xe khác giúp em.', s: 2, react: 'Ừ, để anh gọi chỗ khác.' },
              { t: 'Dạ em không chắc, để em hỏi anh Toàn ạ', s: 1, react: 'Toàn đang ngủ em ơi.' },
            ] },
            { them: 'Tìm được xe 16 chỗ khác rồi, 7h15 tới. Mà phát sinh 2,5 triệu nhé em.', options: [
              { t: 'Dạ đắt thế anh', s: 1, react: 'Sáng sớm thế này mà em.' },
              { t: 'Dạ được anh, phát sinh bao nhiêu em cũng chịu, miễn có xe, anh khỏi gửi gì cả, cuối tháng anh báo cô Bích con số tổng là cô chuyển khoản ạ.', s: 0, react: 'Ok em, cuối tháng anh tính luôn.' },
              { t: 'Dạ xe bên anh hỏng nên phần phát sinh bên anh chịu ạ. Anh gửi em biển số và tên tài xế nhé.', s: 2, react: 'Ừ… thôi anh chịu. Biển số anh gửi liền.' },
            ] },
          ],
          end: { good: '7:12. Xe 29 chỗ và xe 16 chỗ tới rồi. Biển số anh gửi em rồi nhé.', bad: 'Xe tới rồi em… mà cảnh sát giao thông đang đứng ở đầu ngõ.' } },
      ] },
  ],

  // errands that lead into the hands-on games (`play` = a desk game id; engine: game/office.js officeGameFor)
  tasks: [
    { id: 'desk_bong', title: 'Bơm bóng mẫu cho cổng chào', from: 'duy', base: 60, legs: [
      { npc: 'duy', line: ['duy', 'Khách muốn xem mẫu cổng chào. Em bơm thử năm quả, to vừa, đừng to quá. Copy?'] },
      { obj: 'desk', play: 'event_balloon', line: ['nar', 'Năm quả bóng nằm ngay ngắn. Một quả hơi xẹp, bạn giấu nó ra sau.'] },
      { npc: 'duy', line: ['duy', 'Copy. Gửi ảnh cho khách. Plan B là bóng giấy, mong không phải dùng.'] },
    ] },
  ],

  chatter: [
    { id: 'event_ch_2307', chat: [['thao', 'Khách Bê Tông nhắn 23:07 tối qua: đổi backdrop sang "đỏ may mắn" ạ 🙏'], ['thao', 'Chị dạ được rồi'], ['tien', 'Backdrop in xong từ 18h hôm qua chị ơi'], ['duy', 'Plan B?'], ['thao', 'Plan B là… Tiến?']],
      scene: [
        ['think', 'Plan B của chị Thảo có tên, có tuổi, và đang đội mũ len.'],
        { c: 'event_desk_2307', o: [
          { t: 'Gửi Tiến số xưởng in chạy đêm từ danh bạ anh Toàn', fx: { rel: { tien: 1, toan: 1 }, uy: 1, nl: -2 } },
          { t: 'Thả "🙏" theo chị Thảo', fx: { rel: { thao: 1 }, dr: 1 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'event_ch_rain', chat: [['vy', 'App thời tiết báo 80% mưa ngày 11 😭'], ['kieu', 'Năm 2009 chị dẫn trong mưa. Hai tiếng. Không rạp.'], ['duy', 'Không ai dẫn trong mưa nữa. Toàn, rạp đâu?'], ['toan', 'Anh Rạp không nghe máy. Anh đang gọi vợ anh Rạp.']],
      scene: [
        ['think', 'Chuỗi liên lạc khẩn cấp của ngành sự kiện: anh Rạp, vợ anh Rạp, mẹ vợ anh Rạp.'],
        { c: 'event_desk_rain', o: [
          { t: 'Mở file Plan B, soát lại sơ đồ rạp và lối đi', fx: { uy: 2, nl: -2, rel: { duy: 1 } } },
          { t: 'Hỏi chị Kiều: "Năm 2009 rồi sao nữa ạ?"', fx: { rel: { kieu: 2 }, clock: 15, dr: 1 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'event_ch_walkie7', chat: [['lan', 'BỘ ĐÀM SỐ 7 ĐÃ VỀ!!!'], ['lan', 'Nó nằm trong thùng đồ team building. Cạnh con lân.'], ['khoa', 'Ơ mình tưởng đó là đạo cụ trò "Truy tìm tín hiệu" 😅'], ['duy', 'Ai vừa vào kênh 4?']],
      scene: [
        ['think', 'Bộ đàm số 7 về. Và ai đó vừa vào kênh 4. Không phải mình. Chưa phải mình.'],
        { c: 'event_desk_walkie7', o: [
          { t: 'Thả tim cho chị Lan, đề nghị dán nhãn đạo cụ', fx: { rel: { lan: 2 } } },
          { t: 'Mở thử kênh 4 xem có gì', fx: { dr: 3, rel: { duy: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'event_ch_water', chat: [['bich', 'Hóa đơn ghi 3 thùng nước suối. Biên bản ghi 2. Ai giải thích?'], ['toan', 'Thùng thứ ba anh tặng anh Lộc Xe ạ'], ['loc', 'Dạ em uống rồi cô ơi, hôm đó nóng quá'], ['bich', 'Uống rồi thì vẫn cần hóa đơn.']],
      scene: [
        ['think', 'Thùng nước thứ ba đã đi vào lịch sử. Và vào bụng anh Lộc.'],
        { c: 'event_desk_water', o: [
          { t: 'Gửi cô Bích ảnh biên bản giao nhận có chữ ký', fx: { rel: { bich: 2 }, clock: 5 } },
          { t: 'Gõ "#JusticeForThungThuBa"', fx: { dr: 2, rel: { toan: 1, bich: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'event_ch_teambuilding', chat: [['khoa', 'Thông báo: thứ Bảy này team building nội bộ! Bắt buộc vui 🎉'], ['khoa', 'Trò mở màn: kéo co dưới nước'], ['my', 'Thứ Bảy mình có proposal lần 6…'], ['kieu', 'Vui là bắt buộc. Proposal là tùy chọn.'], ['my', '🙂']],
      scene: [
        ['think', 'Một công ty chuyên tổ chức team building cho người khác, giờ tự tổ chức cho mình.'],
        { c: 'event_desk_teambuilding', o: [
          { t: 'Nhắn riêng Mỹ: "Mình làm phụ slide proposal cho bạn"', fx: { rel: { my: 2 }, nl: -3 } },
          { t: 'Đăng ký đi, mang theo áo mưa', fx: { rel: { khoa: 1, kieu: 1 }, nl: -2 } },
          { t: 'Thả "haha" vào tin chị Kiều', fx: { dr: 2, rel: { kieu: -1, my: 1 } } },
        ] },
      ] },
    { id: 'event_ch_tiktok', chat: [['vy', 'Clip hậu trường setup lên 120 nghìn view rồi 😳'], ['tien', 'Sao KV trong clip là bản chưa duyệt'], ['thao', 'Khách vừa hỏi sao trên mạng có KV của họ'], ['duy', 'Vy. Gỡ. Copy?'], ['vy', 'Copy 🥲']],
      scene: [
        ['think', '120 nghìn view. Và một khách hàng đang xem đi xem lại.'],
        { c: 'event_desk_tiktok', o: [
          { t: 'Nhắn riêng Vy: "Mình giúp bạn làm mờ KV rồi đăng lại"', fx: { rel: { vy: 2 }, clock: 10 } },
          { t: 'Vào thả tim clip trước khi nó bị gỡ', fx: { dr: 2, rel: { vy: 1, tien: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'event_ch_pnr', chat: [['ngan', 'PNR đoàn Khỏe Re còn 02:14 là hết hạn hold'], ['ngan', 'Cô Bích ơi duyệt chi xuất vé giúp em'], ['bich', 'Ủy nhiệm chi tiền cọc của khách đâu?'], ['thao', 'Khách bảo chiều chuyển ạ… chắc được ạ'], ['ngan', 'Giá vé vừa tăng. Em còn chưa đi lấy nước!']],
      scene: [
        ['think', 'Đồng hồ đếm ngược, một khoản cọc "chắc được", và giá vé tăng dù không ai đi lấy nước.'],
        { c: 'event_desk_pnr', o: [
          { t: 'Nhắn anh Thắng xin ủy nhiệm chi, chuyển cô Bích', fx: { uy: 2, rel: { ngan: 1, bich: 1 }, nl: -2 } },
          { t: 'Đi lấy nước hộ chị Ngân "cho may"', fx: { rel: { ngan: 1 }, clock: 5 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'event_ch_headcount', chat: [['hai', 'ĐOÀN ĐỦ 120!'], ['hai', 'Khoan. 119.'], ['hai', 'Anh áo vàng đâu?'], ['thang', 'Anh đây, anh đang ở quầy bánh pía'], ['hai', 'ANH THẮNG ANH LÀ TRƯỞNG ĐOÀN MÀ ANH ĐI LẠC']],
      scene: [
        ['think', 'Người đi lạc năm nay là trưởng đoàn. Anh Hải đã đoán sai lần đầu tiên trong sự nghiệp.'],
        { c: 'event_desk_headcount', o: [
          { t: 'Gửi anh Hải danh sách số điện thoại cả đoàn', fx: { rel: { hai: 2 }, uy: 1 } },
          { t: 'Cá với Vy lần sau ai lạc', fx: { dr: 2, rel: { vy: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'event_ch_alo', chat: [['kieu', 'Alo alo. Một hai ba. Xin chào quý vị!'], ['duy', 'Chị ơi đây là group có khách'], ['kieu', 'Vậy xin một tràng pháo tay cho quý khách!'], ['huong', '👏👏?']],
      scene: [
        ['think', 'Chị Kiều vừa test micro trong group có khách. Chị Hường bên khách đã vỗ tay, có dấu hỏi.'],
        { c: 'event_desk_alo', o: [
          { t: 'Nhắn riêng anh Duy: "Em gửi khách lại run-sheet bản sạch nhé"', fx: { uy: 2, rel: { duy: 1 }, set: { event_desk_clean_runsheet: true } } },
          { t: 'Thả 👏 cho đỡ ngượng', fx: { rel: { kieu: 1 } } },
          { t: 'Chụp màn hình gửi Vy', fx: { dr: 3, rel: { vy: 1 } } },
        ] },
      ] },
  ],

  promoOffer: [
    ['nar', 'Briefing chiều vừa tan. Anh Duy tắt cả ba bộ đàm. Lần đầu tiên bạn thấy cả ba cùng im.'],
    ['duy', 'Ngồi đi. Anh nói ngắn.'],
    ['duy', 'Tháng này cả công ty bận drama: thùng nước thứ ba, bộ đàm số 7, clip TikTok. Còn em thì ngồi vào bàn.'],
    ['duy', 'Run-sheet em làm, không ai phải sửa. Thùng đồ em soạn, show không thiếu cuộn băng keo nào. Nghề này thế là hiếm.'],
    { if: F('event_desk_clean_runsheet'), then: [['duy', 'Hôm chị Kiều "alo alo" vào group khách, em gửi lại run-sheet sạch trong ba phút. Anh nhớ.']] },
    ['duy', 'Anh đề xuất chị Kiều rồi. Chính thức. Mười triệu. Hợp đồng lao động, có bảo hiểm. Kèm bộ đàm số 4.'],
    ['duy', 'Nói trước: tháng 12 có 23 show. Tháng 12 không có cuối tuần.'],
    ['think', 'Mười triệu. Bộ đàm số 4. Và một tháng 12 không có cuối tuần.'],
    { c: 'event_work_offer', o: [
      { t: 'Nhận lời. "Copy."', fx: { uy: 5, rel: { duy: 2 }, set: { accept_official: true } }, then: [
        ['duy', 'Copy. Từ thứ Hai em có kênh riêng. Đừng vào kênh 4.'],
      ] },
      { t: '"Em cảm ơn anh, nhưng em muốn thử sức ở chỗ khác ạ."', fx: { rel: { duy: 1 }, set: { accept_official: false } }, then: [
        ['duy', 'Copy. Người có Plan B thì đi đâu cũng được. Tên công ty mình đấy.'],
      ] },
    ] },
  ],
};
