// Cân Đối & Cộng Sự — desk work ("Ngồi vào bàn"): the real work of an audit intern in busy season, plus the
// group-chat drama that still finds you. Engine: game/desk.js + modes/solo.js. Contract: docs/COMPANY_CONTRACT.md §12.
// games (5): 2 hands-on (ui/action.js: đóng dấu chứng từ, bắt lỗi bảng tính) + 3 work sims (ui/sims.js):
//   audit_vouch    doc  · chứng từ chi phí, đối chiếu ngân hàng, tuổi nợ & dự phòng
//   audit_evidence doc  · biên bản kiểm kê kho lạnh, tổng hợp thư xác nhận công nợ
//   audit_client   chat · khách muốn "điều chỉnh cho đẹp", khách chậm chứng từ, CFO "hỏi thăm"
// chatter: [castId, text, dm?] messages that land WHILE you play, then a short scene with one choice.
// Accounting/tax rules are simplified (thông tin giải trí, không phải tư vấn kế toán/thuế/pháp lý).

const F = (k) => (r) => !!r.flags[k];

export const DESK = {
  games: [
    // ---- hands-on (ui/action.js) ----
    { id: 'audit_stamp', type: 'action', game: 'conveyor', mode: 'stamp', title: 'Đóng dấu chứng từ', icon: '🧾', time: 40, pass: 0.6, count: 12,
      stampText: 'ĐÃ KIỂM', hit: 'Cộp!', wrongHit: 'Duyệt nhầm chứng từ lỗi!', miss: 'Bỏ sót chứng từ!',
      target: { emoji: '🧾', labels: ['Hóa đơn có mã số thuế', 'Phiếu chi đủ chữ ký', 'Hợp đồng có dấu đỏ', 'Biên bản có ngày tháng'] },
      avoid: { emoji: '⚠️', labels: ['Hóa đơn viết tay', 'Ảnh chụp màn hình', 'Phiếu chi không ngày', 'Hợp đồng chưa ký'] },
      prompt: 'Chứng từ của khách chạy trên băng chuyền. Chỉ đóng dấu tờ HỢP LỆ khi nó vào khung đỏ.' },
    { id: 'audit_flags', type: 'action', game: 'whack', title: 'Bắt lỗi trên bảng tính', icon: '🚩', time: 35, pass: 0.6, count: 16,
      slotText: 'Sheet "So_lieu_dep"', bg: '#22473a', slot: '#2f5d4c',
      target: { emoji: '🚩', labels: ['Ô #REF!', 'Ngày 31/02', 'Số âm lạ', 'Tổng không khớp', 'Số tròn 1 tỷ'], hit: 'Bắt được!', miss: 'Lọt lỗi' },
      avoid: { emoji: '✅', labels: ['Đã khớp sao kê', '1.250.000', 'Có chứng từ', 'Đúng kỳ'], hit: 'Số đúng mà!' },
      prompt: 'Ô lỗi nhảy lên khắp file. Bấm 🚩 thật nhanh. Đừng bấm ✅ ô đúng, kẻo bị chị Thảo hỏi vì sao.' },
    // ---- work sims (ui/sims.js): real audit work ----
    { id: 'audit_vouch', type: 'doc', title: 'Soát chứng từ và sổ sách', icon: '🧾', time: 80, pass: 0.6,
      prompt: 'Đọc hồ sơ khách gửi. Bấm 🚩 vào mọi dòng sai, thiếu hoặc phải hỏi lại. Dòng trông lạ chưa chắc đã sai. (Đơn giản hóa, thông tin giải trí.)',
      docs: [
        { kind: 'invoice', head: 'Mẫu chọn chi phí tháng 12 · Phúc Lộc Foods', meta: 'Thủ tục: mỗi khoản chi phải khớp hóa đơn, hợp đồng và chứng từ thanh toán. Năm tài chính kết thúc 31/12.',
          lines: [
            { h: 'Mua nguyên liệu' },
            'UNC 1203 · 04/12 · Thủy Sản Minh Hải · 248.400.000đ · HĐ 0001247 ngày 04/12',
            { t: 'UNC 1219 · 18/12 · Thủy Sản Minh Hải · 248.400.000đ · HĐ 0001247 ngày 04/12', bad: 'Cùng một hóa đơn 0001247 được trả tiền và ghi chi phí hai lần: ghi trùng, phải hỏi khách và đòi lại tiền.' },
            'HĐ 0001247 là hóa đơn điện tử, có mã của cơ quan thuế, không chữ ký tươi, không đóng dấu',
            { t: 'PC 0877 · 21/12 · Cá ngừ, Đại lý Bảy Hòa · trả tiền mặt 185.000.000đ', bad: 'Khoản mua lớn trả tiền mặt: không đủ điều kiện khấu trừ VAT, khó được tính chi phí, dễ là chi khống. Phải chuyển khoản.' },
            { h: 'Dịch vụ' },
            { t: 'UNC 1188 · 02/12 · Tư vấn Tầm Nhìn Xa · 66.000.000đ · HĐ 0000092 ngày 27/12', bad: 'Dịch vụ thu tiền trước thì hóa đơn phải lập ngay lúc thu tiền (02/12). Lập 27/12 là sai thời điểm (thông tin giải trí).' },
            { t: 'HĐ 0000092 ghi MST người bán 0312456789, hợp đồng ghi 0312456798', bad: 'MST trên hóa đơn khác hợp đồng: tra trên cổng hóa đơn điện tử của cơ quan thuế xem hóa đơn này thật sự của ai.' },
            'UNC 1230 · 31/12 · Điện lực · tiền điện kho lạnh tháng 12 · 312.000.000đ',
            'Tiền điện tháng 12 gấp 1,4 lần tháng 6: chị Hồng giải thích kho chất đầy hàng Tết, có sổ kho kèm',
            'PC 0901 · 28/12 · Tiếp khách 4.180.000đ · quẹt thẻ công ty · có HĐ nhà hàng Gió Chướng',
          ],
          verdict: { q: 'Kết luận cho mẫu chọn này?', options: ['Ghi các điểm vào WP, gửi chị Hồng danh sách cần giải trình', 'Tick "đã kiểm tra ✓", khoản nào cũng có hóa đơn', 'Tự sửa sổ giúp khách cho nhanh'], correct: 0,
            why: 'Có hóa đơn chưa đủ: phải khớp cả thời điểm, người bán, cách trả tiền. Kiểm toán viên không tự ghi sổ thay khách.' } },
        { kind: 'invoice', head: 'Đối chiếu tiền gửi ngân hàng 31/12 · Phúc Lộc Foods', meta: 'Bảng chị Hồng lập. Hai số dư sau điều chỉnh phải bằng nhau; mỗi khoản điều chỉnh phải có chứng từ.',
          lines: [
            { h: 'Theo ngân hàng' },
            { t: 'Số dư sao kê 31/12: 3.611.900.000đ (ảnh chụp app do chị Hồng gửi qua Zalo)', bad: 'Số dư ngân hàng phải lấy từ sao kê gốc hoặc thư xác nhận ngân hàng gửi thẳng cho kiểm toán, không phải ảnh khách gửi.' },
            '(+) Nộp tiền mặt 16:59 ngày 31/12, sao kê ghi có ngày 02/01: 120.000.000đ',
            '(−) UNC 1230 tiền điện lập 31/12, ngân hàng trừ ngày 02/01: 312.000.000đ',
            { t: '(−) UNC 0921 lập ngày 15/09, "ngân hàng chưa trừ": 45.000.000đ', bad: 'UNC chuyển trong ngày, treo 3,5 tháng là bất thường: có thể đã hủy hoặc là khoản chi không có thật. Phải hỏi và xem chứng từ.' },
            'Số dư điều chỉnh theo ngân hàng: 3.374.900.000đ',
            { h: 'Theo sổ kế toán' },
            'Số dư sổ tiền gửi 31/12: 3.352.000.000đ',
            '(+) Lãi tiền gửi ngân hàng trả 31/12, chưa ghi sổ: 2.300.000đ',
            '(−) Phí chuyển tiền và phí SMS banking, chưa ghi sổ: 1.100.000đ',
            '(+) Khách chuyển khoản thẳng 29/12, chưa ghi sổ: 86.500.000đ',
            { t: 'Số dư điều chỉnh theo sổ: 3.429.700.000đ', bad: 'Cộng lại: 3.352.000.000 + 2.300.000 − 1.100.000 + 86.500.000 = 3.439.700.000đ, không phải 3.429.700.000đ.' },
            { t: 'Chênh lệch còn lại 54.800.000đ: "tạm hạch toán vào chi phí khác"', bad: 'Đối chiếu phải giải thích tới từng đồng. Đẩy chênh lệch vào "chi phí khác" là giấu sai sót, không phải đối chiếu.' },
          ],
          verdict: { q: 'Bảng đối chiếu này?', options: ['Trả lại: cộng lại, giải thích hết chênh lệch, gửi thư xác nhận ngân hàng', 'Chấp nhận, 54,8 triệu chưa tới mức trọng yếu', 'Tự ghi 54,8 triệu vào chi phí khác cho khớp'], correct: 0,
            why: 'Chênh lệch nhỏ có thể là hai sai sót lớn bù trừ nhau. Chưa giải thích được thì chưa kết luận được.' } },
        { kind: 'invoice', head: 'Tuổi nợ phải thu và dự phòng 31/12 · Phúc Lộc Foods', meta: 'Mức dự phòng (đơn giản hóa từ TT 48/2019): quá hạn 6 tháng–dưới 1 năm 30% · 1–dưới 2 năm 50% · 2–dưới 3 năm 70% · từ 3 năm 100%.',
          lines: [
            { h: 'Chi tiết' },
            'Siêu thị Sao Mai · 1.240.000.000đ · chưa đến hạn · dự phòng 0đ',
            'Bếp Ăn KCN Số 3 · 380.000.000đ · quá hạn 45 ngày · đã trả 200 triệu ngày 08/01 (có sao kê)',
            'Chuỗi Cơm Ba Miền · 210.000.000đ · quá hạn 70 ngày · dự phòng 0đ',
            { t: 'Hải Sản Tươi Ngon · 520.000.000đ · quá hạn 400 ngày · dự phòng 0đ', bad: 'Quá hạn từ 1 đến dưới 2 năm: dự phòng 50% = 260.000.000đ. Để 0đ là thổi phồng tài sản và lợi nhuận.' },
            { t: 'Đại lý Chú Bảy · 150.000.000đ · quá hạn 8 tháng · dự phòng 30% = 54.000.000đ', bad: '30% của 150 triệu là 45.000.000đ, không phải 54.000.000đ: tính lại.' },
            { t: 'Nhà hàng Sóng Vỗ · 96.000.000đ · đã giải thể từ tháng 3 · dự phòng 0đ', bad: 'Con nợ đã giải thể thì gần như không thu được: dự phòng theo tổn thất dự kiến, có thể tới 100%, hoặc xử lý xóa nợ.' },
            { h: 'Tổng hợp' },
            'Tổng phải thu: 2.596.000.000đ · tổng dự phòng đã trích: 54.000.000đ',
            'Giải trình chị Hồng: "Hải Sản Tươi Ngon khách quen, sắp trả" (không có lịch trả)',
          ],
          verdict: { q: 'Đề xuất gì?', options: ['Đề xuất bút toán điều chỉnh dự phòng, ghi WP, báo chị Thảo', 'Giữ nguyên, chị Hồng nói khách sắp trả', 'Xóa luôn khoản Hải Sản Tươi Ngon khỏi sổ'], correct: 0,
            why: 'Lời hứa "sắp trả" không phải bằng chứng. Kiểm toán viên đề xuất điều chỉnh; khách là người ghi sổ.' } },
      ] },

    { id: 'audit_evidence', type: 'doc', title: 'Soát kiểm kê và thư xác nhận', icon: '🧊', time: 80, pass: 0.6,
      prompt: 'Bằng chứng kiểm toán phải đáng tin. Bấm 🚩 vào mọi dòng làm nó mất giá trị. Chữ ký run, giấy viết tay chưa chắc đã sai.',
      docs: [
        { kind: 'paper', head: 'Biên bản kiểm kê kho lạnh số 2 · 31/12', meta: 'Thủ tục: chứng kiến kiểm kê, đếm thử, đối chiếu sổ kho. Hàng giữ hộ, hàng hỏng phải ghi riêng.',
          lines: [
            { h: 'Thông tin' },
            'Thời gian: 22:00 ngày 31/12 đến 02:30 ngày 01/01 · nhiệt độ kho −18°C',
            'Thành phần: chú Tư (thủ kho), chị Hồng (kế toán trưởng), kiểm toán viên chứng kiến',
            { t: 'Ghi chú: "Trong lúc đếm vẫn nhập thêm 2 xe cá"', bad: 'Lúc kiểm kê phải ngừng nhập xuất, hoặc tách riêng hàng nhập sau giờ chốt. Không thì đếm trùng, đếm sót.' },
            'Biên bản viết tay, có hai chỗ sửa số, mỗi chỗ có chữ ký nháy của cả ba bên',
            { h: 'Kết quả' },
            'Cá basa phi lê · sổ 1.250 thùng · thực tế 1.180 · thiếu 70 × 400.000đ = 28.000.000đ',
            { t: 'Tôm sú đông lạnh · sổ 820 kg · cân thực tế 800 kg · ghi "khớp"', bad: 'Thiếu 20 kg mà ghi "khớp": mọi chênh lệch phải ghi đúng số rồi tìm nguyên nhân, kể cả khi chênh nhỏ.' },
            { t: 'Mực ống · 300 thùng · trong đó 120 thùng giữ hộ Đại lý Cô Sáu', bad: 'Hàng giữ hộ không phải tài sản của công ty: phải đếm riêng, ghi riêng, không tính vào tồn kho.' },
            'Cá ngừ · sổ 460 thùng · đếm thử 20 thùng chọn ngẫu nhiên, mở 5 thùng, khớp',
            { t: 'Lô 12-07 · 45 thùng cá thu hết hạn từ tháng 10 · vẫn tính theo giá gốc', bad: 'Hàng hết hạn phải ghi riêng để xem xét dự phòng giảm giá: không thể để giá gốc như hàng tốt.' },
            'Chữ ký thủ kho, kế toán trưởng, người chứng kiến ở cuối từng trang',
          ],
          verdict: { q: 'Biên bản này dùng được chưa?', options: ['Chưa: ghi lại đúng các điểm đã đánh dấu, ba bên ký bổ sung', 'Được, có đủ ba chữ ký là xong', 'Tự sửa dòng tôm thành 800 kg rồi ký'], correct: 0,
            why: 'Chữ ký chỉ chứng minh có người ký. Biên bản phải ghi đúng thực tế thì mới là bằng chứng kiểm kê.' } },
        { kind: 'paper', head: 'Tổng hợp thư xác nhận công nợ phải thu · 31/12', meta: 'Quy tắc: kiểm toán viên tự gửi thư và nhận hồi âm trực tiếp. Chênh lệch phải giải thích bằng chứng từ.',
          lines: [
            { h: 'Đã hồi âm' },
            'Thư gửi bưu điện ngày 05/01, do kiểm toán viên tự gửi, có biên lai và mã tra cứu',
            'Siêu thị Sao Mai · sổ 1.240.000.000đ · xác nhận 1.240.000.000đ · khớp',
            'Sao Mai hồi âm bằng email từ tên miền công ty, kèm bản scan có ký, đóng dấu',
            'Bếp Ăn KCN Số 3 · sổ 380.000.000đ · xác nhận 300.000.000đ · lệch 80.000.000đ',
            'Giải thích: khách chuyển khoản 30/12, ngân hàng báo có 02/01 (đã xem sao kê)',
            { t: 'Chuỗi Cơm Ba Miền · hồi âm gửi về email chị Hồng, chị chuyển tiếp cho kiểm toán', bad: 'Hồi âm phải về thẳng kiểm toán viên. Đi qua tay khách thì có thể bị sửa: gửi lại thư.' },
            { t: 'Hải Sản Tươi Ngon · hồi âm qua Zalo chị Hồng: "ok em, đúng rồi"', bad: 'Tin nhắn không có số dư, không rõ người gửi, lại qua tay khách: không phải thư xác nhận.' },
            { h: 'Chưa hồi âm' },
            { t: 'Nhà hàng Sóng Vỗ · 96.000.000đ · không hồi âm · kết luận "chấp nhận số sổ"', bad: 'Thư không về thì làm thủ tục thay thế: xem tiền thu sau ngày khóa sổ, hóa đơn, phiếu giao hàng.' },
            'Đại lý Cô Sáu · 70.000.000đ · không hồi âm · đã kiểm tra: thu đủ ngày 12/01 (sao kê)',
          ],
          verdict: { q: 'Kết luận phần thư xác nhận?', options: ['Gửi lại thư lỗi, làm thủ tục thay thế cho thư không về', 'Đủ rồi, phần lớn đã có hồi âm', 'Nhờ chị Hồng gọi điện xác nhận hộ'], correct: 0,
            why: 'Thư xác nhận chỉ có giá trị khi kiểm toán viên kiểm soát cả đường đi lẫn đường về của thư.' } },
      ] },

    { id: 'audit_client', type: 'chat', title: 'Nhắn tin với khách hàng', icon: '💬', time: 85, pass: 0.6,
      prompt: 'Khách đang nhắn. Lịch sự, giúp được thì giúp, nhưng giữ độc lập và đúng chuẩn mực. (Câu dài chưa chắc đã đúng. Thông tin giải trí.)',
      convos: [
        { who: { name: 'Chị Hồng', emoji: '📒', role: 'Kế toán trưởng · Phúc Lộc Foods (khách)', app: 'Zalo' },
          start: ['Em ơi, doanh thu năm nay hụt chỉ tiêu 3 tỷ.', 'Lô hàng giao 03/01, chị xuất hóa đơn 31/12 rồi. Em ghi vào năm nay giúp chị nha.'],
          turns: [
            { options: [
              { t: 'Dạ hàng giao 03/01 thì doanh thu thuộc năm sau ạ. Em ghi nhận và báo chị Thảo.', s: 2, react: 'Hóa đơn ngày 31/12 mà em… Thôi được, chị hiểu.' },
              { t: 'Dạ được chị, hóa đơn ngày 31/12 là có cơ sở rồi, em cứ theo hóa đơn mà ghi, có gì năm sau kiểm toán điều chỉnh lại cũng được ạ.', s: 0, react: 'Đấy, em hiểu chuyện ghê. Chị báo anh Quang nhé.' },
              { t: 'Dạ để em hỏi chị Thảo ạ', s: 1, react: 'Hỏi làm gì em, chuyện nhỏ mà.' },
            ] },
            { them: 'Ừ. Mà 30 thư xác nhận công nợ, để chị gửi giúp cho nhanh. Chị có sẵn địa chỉ khách.', options: [
              { t: 'Dạ vâng ạ, chị gửi giúp em thì tốt quá, chị dặn khách hồi âm về chị rồi chị chuyển lại em, đỡ cho em chạy bưu điện ạ.', s: 0, react: 'Ok, cuối tuần chị chuyển em một thể.' },
              { t: 'Dạ thư bên em phải tự gửi và nhận ạ. Chị cho em danh sách địa chỉ là được.', s: 2, react: 'Kỹ ghê. Ừ, chị gửi file địa chỉ.' },
              { t: 'Dạ chị gửi cũng được, chị chụp ảnh lúc gửi cho em nhé', s: 1, react: 'Ok, chị chụp cái phong bì.' },
            ] },
            { them: 'Còn khoản dự phòng 260 triệu của Hải Sản Tươi Ngon, em bỏ khỏi danh sách điều chỉnh được không? Anh Quang dặn.', options: [
              { t: 'Dạ khó lắm chị ơi 😅', s: 1, react: 'Khó thì mới nhờ em chứ.' },
              { t: 'Dạ em không tự quyết được ạ. Em ghi lại ý kiến anh Quang để chị Thảo xem.', s: 2, react: 'Ừ, vậy để anh Quang nói với chị Thảo.' },
              { t: 'Dạ anh Quang đã dặn thì em bỏ ra trước, rồi mình ghi một dòng nhỏ trong thuyết minh là được ạ, số liệu đẹp mà vẫn có ghi chú chị nhé.', s: 0, react: 'Tuyệt. Em làm được việc đấy.' },
            ] },
            { them: 'À, file tồn kho hôm qua sai, chị gửi bản mới rồi. Em xóa bản cũ đi giúp chị cho đồng bộ nhé.', options: [
              { t: 'Dạ vâng ạ, em xóa bản cũ để khỏi nhầm, mình dùng bản mới cho thống nhất, bản cũ nhiều lỗi chị đã sửa rồi thì giữ làm gì chị nhỉ.', s: 0, react: 'Đúng rồi. Coi như chưa có bản cũ nhé.' },
              { t: 'Dạ để em xem ạ', s: 1, react: 'Em xem nhanh nhé.' },
              { t: 'Dạ bên em lưu cả hai bản ạ. Chị giải thích giúp em vì sao số thay đổi nhé.', s: 2, react: 'Ừ… để chị gửi bảng giải trình.' },
            ] },
          ],
          end: { good: 'Thôi được. Thứ Sáu chị gửi đủ giải trình. Làm đúng thì chị cũng đỡ lo.', bad: 'Ok em. Có gì chị nói thẳng với anh Phong vậy.' } },
        { who: { name: 'Chị Mây', emoji: '🍲', role: 'Chủ chuỗi Lẩu Bếp Nhà Mây · khách dịch vụ kế toán', app: 'Zalo' },
          start: ['Em ơi chị Mây đây. Chứng từ quý 4 chị chưa gom xong, quán đông quá 😅'],
          turns: [
            { options: [
              { t: 'Dạ chị gửi em trước 15/3 nhé. Hạn nộp quyết toán năm là 31/3 ạ.', s: 2, react: 'Ok, chị ghi lịch. 15/3.' },
              { t: 'Dạ không sao đâu chị, chị cứ từ từ, cuối tháng 3 gửi cũng kịp, bên em làm xuyên đêm quen rồi, chị không phải lo gì đâu ạ.', s: 0, react: 'Vậy 30/3 chị gửi nhé!' },
              { t: 'Dạ chị gửi sớm giúp em ạ', s: 1, react: 'Sớm là bao giờ em?' },
            ] },
            { them: 'Rau với cá chị mua ở chợ, của bà con tự trồng tự đánh bắt, không có hóa đơn. Tính sao em?', options: [
              { t: 'Dạ chị ghi tay một tờ tổng cả quý là bao nhiêu tiền, em nhập vào chi phí cho chị, quán lẩu thì cơ quan thuế ít kiểm tra lắm ạ.', s: 0, react: 'Dễ vậy hả em? Chị ghi 300 triệu nhé.' },
              { t: 'Dạ lập bảng kê mua hàng: tên, địa chỉ, chữ ký người bán, ngày, số tiền ạ.', s: 2, react: 'À, có mẫu hả em? Gửi chị, chị phát cho bếp.' },
              { t: 'Dạ khoản không hóa đơn thì bỏ ạ', s: 1, react: 'Bỏ hết thì chị lỗ trên giấy à em?' },
            ] },
            { them: 'À, chị mua cái tủ đông 48 triệu, trả tiền mặt cho nhanh. Có sao không em?', options: [
              { t: 'Dạ chắc không sao đâu chị', s: 1, react: 'Vậy chị cứ thế nhé.' },
              { t: 'Dạ chị nhờ cửa hàng tách thành nhiều hóa đơn nhỏ cho dưới ngưỡng tiền mặt là ổn ạ, nhiều nơi vẫn làm vậy, không ai để ý đâu chị.', s: 0, react: 'Hay đấy, để chị gọi cửa hàng.' },
              { t: 'Dạ khoản lớn vậy lần sau chị chuyển khoản nhé, tiền mặt thì khó được khấu trừ thuế ạ.', s: 2, react: 'Ồ, chị không biết. Lần sau chị chuyển khoản.' },
            ] },
            { them: 'Năm nay quán lời ít. Em khai giúp chị lỗ luôn cho đỡ thuế được không?', options: [
              { t: 'Dạ em khai đúng số thực tế ạ. Khoản nào được ưu đãi, em tìm giúp chị.', s: 2, react: 'Ừ, đúng là đúng. Có gì được giảm thì em báo chị.' },
              { t: 'Dạ được chị, mình đẩy thêm ít chi phí cuối năm là ra lỗ ngay, quán nhỏ thì ít bị quyết toán lắm, chị cứ yên tâm giao em ạ.', s: 0, react: 'Tuyệt! Em đúng là người của chị.' },
              { t: 'Dạ để em hỏi anh Sang ạ', s: 1, react: 'Ừ, hỏi nhanh nhé em.' },
            ] },
          ],
          end: { good: 'Ok em, thứ Bảy chị mang cả thùng chứng từ lên. Có bảng kê chợ luôn.', bad: 'Thôi chị tìm dịch vụ nào "linh hoạt" hơn vậy.' } },
        { who: { name: 'Anh Quang', emoji: '🐟', role: 'CFO · Phúc Lộc Foods (khách)', app: 'Zalo' },
          start: ['Chào em. Anh hỏi thăm thôi.', 'Bao giờ bên em ký báo cáo? Ngân hàng cần trước thứ Sáu để giải ngân.'],
          turns: [
            { options: [
              { t: 'Dạ anh yên tâm ạ, thứ Sáu chắc chắn có báo cáo, thiếu gì bên em ghi chú lại rồi bổ sung sau khi phát hành cũng được anh ạ.', s: 0, react: 'Tốt. Anh báo ngân hàng luôn nhé.' },
              { t: 'Dạ còn 3 mục chờ chứng từ ạ. Đủ trước thứ Tư thì kịp thứ Sáu.', s: 2, react: 'Ừ, anh bảo chị Hồng gửi ngay.' },
              { t: 'Dạ em không biết ạ, anh hỏi chị Thảo nhé', s: 1, react: 'Anh hỏi em mà em.' },
            ] },
            { them: 'Em gửi anh file Excel làm việc của bên em nhé, anh xem bên em tính dự phòng thế nào.', options: [
              { t: 'Dạ để em hỏi chị Thảo ạ', s: 1, react: 'Hỏi gì, file về công ty anh mà.' },
              { t: 'Dạ hồ sơ làm việc là tài liệu nội bộ bên em ạ. Em gửi anh bảng điều chỉnh đề xuất.', s: 2, react: 'Ừ, bảng điều chỉnh cũng được.' },
              { t: 'Dạ vâng ạ, em gửi anh nguyên folder WP luôn, có cả review note của chị Thảo để anh nắm bên em đang lo khoản nào nhất ạ.', s: 0, react: 'Tốt quá. Anh đọc review note trước.' },
            ] },
            { them: 'Khoản dự phòng 260 triệu, anh thấy không trọng yếu. Bỏ qua cho nhau được không em?', options: [
              { t: 'Dạ 260 triệu so với doanh thu mấy trăm tỷ thì nhỏ thật anh ạ, em nghĩ bỏ qua được, để em ghi "không trọng yếu" luôn cho anh nhé.', s: 0, react: 'Em hiểu chuyện. Vậy coi như xong.' },
              { t: 'Dạ em thấy hơi khó ạ', s: 1, react: 'Khó chỗ nào? Nói anh nghe.' },
              { t: 'Dạ trọng yếu do chị Thảo và anh Phong đánh giá ạ. Em ghi lại ý kiến của anh.', s: 2, react: 'Ừ. Để anh nói chuyện với anh Phong.' },
            ] },
            { them: 'Tết này anh gửi team mỗi người một thùng cá ngừ nhé. Chút lộc thôi.', options: [
              { t: 'Dạ em cảm ơn anh, nhưng bên em không nhận quà từ khách ạ.', s: 2, react: 'Ừ. Năm nào bên em cũng nói câu đó.' },
              { t: 'Dạ để em hỏi team ạ', s: 1, react: 'Hỏi gì, cá thôi mà.' },
              { t: 'Dạ em cảm ơn anh nhiều ạ, quà Tết thì có gì đâu, anh gửi về nhà em cho tiện, đừng gửi lên công ty kẻo mọi người ngại ạ.', s: 0, react: 'Ok, em nhắn anh địa chỉ nhà nhé.' },
            ] },
          ],
          end: { good: 'Ok. Thứ Tư chị Hồng gửi đủ chứng từ. Làm đúng thì ngân hàng cũng yên tâm.', bad: 'Anh sẽ nói chuyện với anh Phong về phí kiểm toán năm sau.' } },
      ] },
  ],

  // errands that lead into the hands-on games (`play` = a desk game id; engine: game/office.js officeGameFor)
  tasks: [
    { id: 'desk_stamp', title: 'Đóng dấu chồng chứng từ trước 5 giờ', from: 'thao', base: 60, legs: [
      { npc: 'thao', line: ['thao', 'Chồng chứng từ này chị cần trước 5 giờ. Tờ nào hợp lệ mới đóng dấu. Tờ nào không, để lại chị xem.'] },
      { obj: 'desk', play: 'audit_stamp', line: ['nar', 'Bạn đóng xong. Tay hơi mỏi, mắt hơi hoa, nhưng không tờ nào lọt.'] },
      { npc: 'thao', line: ['thao', 'Chị soát lại mười tờ ngẫu nhiên. Đúng cả mười. Em được nghỉ năm phút.'] },
    ] },
  ],

  chatter: [
    { id: 'audit_ch_3am', chat: [['thao', '[03:07] Chị gửi 27 review note rồi nhé'], ['thao', 'Không gấp đâu. 8 giờ sáng họp.'], ['khoa', 'Anh chưa ngủ nên anh đọc rồi'], ['tuan', '(sticker con mèo ngất)']],
      scene: [
        ['think', '"Không gấp." Hai mươi bảy note. Họp lúc 8 giờ.'],
        { c: 'audit_desk_3am', o: [
          { t: 'Mở note, nhận phần của mình, trả lời "Em nhận 9 note ạ"', fx: { uy: 2, rel: { thao: 1 }, nl: -3 } },
          { t: '"Chị ơi 3 giờ sáng chị có ngủ không ạ?"', fx: { rel: { thao: 1, tuan: 1 }, dr: 1 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { nl: 1 } },
        ] },
      ] },
    { id: 'audit_ch_black_pen', chat: [['diep', 'Ai dùng bút ĐEN tick vào WP của chị?'], ['diep', 'Đen không nghĩa gì cả. Đen là hư vô.'], ['vy', 'Dạ không phải em ạ! Em dùng xanh than.'], ['tuan', 'Năm ngoái cũng có người tick đen. Giờ người đó làm ngân hàng.']],
      scene: [
        ['think', 'Xanh than có phải là đen không. Câu hỏi sẽ chia rẽ cả phòng Assurance.'],
        { c: 'audit_desk_black_pen', o: [
          { t: 'Gửi chị Diệp bảng chú giải tick-mark mình đã in', fx: { rel: { diep: 2 }, uy: 1 } },
          { t: '"Xanh than là đen hay xanh ạ?" (lập bình chọn)', fx: { dr: 2, rel: { vy: -1, tuan: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'audit_ch_vy_done', chat: [['vy', 'Em xong rồi ạ! 🎉'], ['vy', 'À nhầm group, em định gửi chị Thảo'], ['khoa', 'Vy xong phần nào?'], ['vy', 'Phần… của em ạ']],
      scene: [
        ['think', 'Vy xong. Phần của Vy. Phần nào là phần của Vy thì vẫn là bí ẩn.'],
        { c: 'audit_desk_vy_done', o: [
          { t: 'Nhắn riêng Vy: "Cần mình xem lại phần ref chéo không?"', fx: { rel: { vy: 2 }, nl: -2 } },
          { t: '"Vy ơi phần của Vy là phần nào vậy?" (trong group)', fx: { dr: 2, rel: { vy: -1, khoa: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'audit_ch_it', chat: [['loc', '17:01. Anh về rồi. Máy ai chết thì để mai.'], ['ngan', 'Anh ơi máy em đang chạy model 400.000 dòng'], ['loc', 'Em đã thử tắt đi bật lại chưa?'], ['ngan', 'Tắt là mất 400.000 dòng anh ơi']],
      scene: [
        ['think', 'Laptop chết sau năm giờ là chuyện tâm linh. Anh Lộc đã nói.'],
        { c: 'audit_desk_it', o: [
          { t: 'Chạy qua chỉ chị Ngân lưu bản sao rồi tách file', fx: { rel: { ngan: 2 }, uy: 1, clock: 10 } },
          { t: '"Anh Lộc ơi máy em cũng đang chết dần"', fx: { dr: 2, rel: { loc: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'audit_ch_tax', chat: [['hieu', 'Thông báo: văn bản anh trích hôm qua đã được sửa đổi.'], ['hieu', 'Văn bản sửa đổi cũng sắp được sửa đổi.'], ['sang', 'Vậy chị Bảy tiệm vàng hỏi thì anh trả lời sao?'], ['hieu', '"Tùy trường hợp."']],
      scene: [
        ['think', 'Câu trả lời đúng 100% của ngành thuế.'],
        { c: 'audit_desk_tax', o: [
          { t: 'Hỏi riêng anh Hiếu cách tra tình trạng hiệu lực văn bản', fx: { rel: { hieu: 2 }, uy: 1, clock: 5 } },
          { t: 'Gửi meme "tùy trường hợp" vào group', fx: { dr: 1, rel: { sang: 1, hieu: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'audit_ch_timesheet', chat: [['hue', 'Timesheet tuần này: 6 bạn ghi 8 tiếng/ngày. Camera ghi 14.'], ['hue', 'Ghi đúng giờ nhé. Ghi sai thì sao biết job nào lỗ.'], ['tuan', 'Chị ơi ghi đúng thì job nào cũng lỗ ạ'], ['phong', 'Anh đọc rồi.']],
      scene: [
        ['think', '"Anh đọc rồi." Ba chữ. Cả group im lặng mười phút.'],
        { c: 'audit_desk_timesheet', o: [
          { t: 'Sửa timesheet, ghi đúng giờ thật, đúng mã job', fx: { rel: { hue: 2 }, uy: 1, clock: 5 } },
          { t: 'Nhắn riêng Tuấn: "Anh Phong đọc rồi là sao anh?"', fx: { dr: 2, rel: { tuan: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { nl: 1 } },
        ] },
      ] },
    { id: 'audit_ch_stamp', chat: [['lua', 'Ai mang con dấu ra khỏi phòng cô?'], ['lua', 'Không ai mang được. Cô hỏi để thử lòng thôi.'], ['khoa', 'Cô ơi cháu chỉ cần đóng 60 thư'], ['lua', 'Giấy tờ đi tới con dấu, cháu ạ.']],
      scene: [
        ['think', 'Con dấu không di chuyển. Sáu mươi lá thư phải di chuyển.'],
        { c: 'audit_desk_stamp', o: [
          { t: 'Ôm 60 lá thư xuống chỗ cô Lụa, xếp sẵn theo số', fx: { rel: { lua: 2, khoa: 1 }, nl: -2 } },
          { t: '"Hay mình xin con dấu đi công tác một hôm ạ?"', fx: { dr: 2, rel: { lua: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'audit_ch_pretty_file', chat: [['hong', 'Em ơi bên chị gửi lại file tồn kho nhé, số "đẹp" hơn rồi'], ['hong', 'Bản hôm qua em xóa đi giúp chị'], ['diep', 'Chị Hồng ơi, bên em lưu cả hai bản ạ 🙂'], ['quang', 'Anh hỏi thăm thôi. Số nào thì cũng là số mà.']],
      scene: [
        ['think', 'Tồn kho "đẹp hơn". Qua một đêm. Không ai đếm lại kho.'],
        { c: 'audit_desk_pretty_file', o: [
          { t: 'Lưu cả hai bản, ghi ngày giờ nhận, báo chị Thảo', fx: { uy: 2, rel: { thao: 1, diep: 1 }, set: { audit_desk_kept_both: true } } },
          { t: '"Dạ em xóa ạ" cho chị Hồng vui', fx: { dr: 3, uy: -2, rel: { hong: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { nl: 1 } },
        ] },
      ] },
    { id: 'audit_ch_sunlight', chat: [['khoa', 'Hôm nay ngoài trời có nắng không mọi người?'], ['tuan', 'Nắng anh ạ. Anh ra cửa sổ xem đi'], ['khoa', 'Anh sợ. Từ tháng Một anh chưa thấy nắng.'], ['my', 'Trang 37 vẫn thiếu chữ ký nháy.']],
      scene: [
        ['think', 'Một người hỏi về mặt trời. Một người trả lời bằng trang 37.'],
        { c: 'audit_desk_sunlight', o: [
          { t: 'Chụp ảnh trời nắng gửi riêng anh Khoa', fx: { rel: { khoa: 2 }, nl: 1 } },
          { t: '"Chị My ơi trang 37 của hồ sơ nào ạ? Em ký luôn."', fx: { rel: { my: 1 }, uy: 1, clock: 5 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
  ],

  promoOffer: [
    ['nar', 'Review xong, chị Thảo gập laptop. 17:02. Lần đầu tiên bạn thấy chị gập laptop trước 3 giờ sáng.'],
    ['thao', 'Chị hỏi nhanh thôi nhé. Em biết tháng này "Hội Tick Mỏi Tay" có bao nhiêu tin nhắn không?'],
    ['thao', 'Một nghìn tám trăm. Toàn drama với sticker. Còn WP của em thì ref chéo đủ, tick-mark có chú giải, nộp đúng hạn.'],
    { if: F('audit_desk_kept_both'), then: [['thao', 'Và em giữ cả hai bản file tồn kho của Phúc Lộc. Bản "đẹp" và bản thật. Nghề này chỉ có vậy thôi.']] },
    ['thao', 'Phòng Assurance có một suất A1. Chị muốn giữ em. Mười lăm triệu. Hợp đồng lao động, có bảo hiểm.'],
    ['think', 'Mười lăm triệu. Mình chỉ ngồi vào bàn và làm cho đúng.'],
    { c: 'audit_work_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, rel: { thao: 1 }, set: { accept_official: true } }, then: [
        ['thao', 'Tốt. Từ thứ Hai em có mã job riêng. Và review note lúc 3 giờ sáng sẽ có tên em ở dòng "Người nhận".'],
      ] },
      { t: '"Em cảm ơn chị, nhưng em muốn thử ở nơi khác ạ."', fx: { set: { accept_official: false } }, then: [
        ['thao', 'Chị ghi nhận. Không phải note. Lời thật: người làm cho đúng thì đi đâu cũng có chỗ.'],
      ] },
    ] },
  ],
};
