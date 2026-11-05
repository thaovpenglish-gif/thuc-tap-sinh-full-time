// Ba & Má — desk work ("Ngồi vào bàn"): the real work of a family dried-food shop (nhãn, phiếu giao đại lý, kịch bản live,
// khách khiếu nại, mối thịt), plus the family group chat that never sleeps. Engine: game/desk.js + modes/solo.js.
// Contract: docs/COMPANY_CONTRACT.md §12. Reference for work sims: companies/hr/desk.js.
// games: 2 hands-on (ui/action.js: xé khô gà, hàn túi) + 3 work sims (ui/sims.js): soát nhãn / phiếu giao đại lý /
// kịch bản live, trả lời khách khiếu nại, nhắn tin với đại lý và mối thịt. Rules are simplified (thông tin giải trí).

const F = (k) => (r) => !!r.flags[k];

export const DESK = {
  games: [
    // ---- hands-on (ui/action.js) ----
    { id: 'bama_shred', type: 'action', game: 'shred', title: 'Xé khô gà', icon: '🍗', time: 45, pass: 0.6,
      pieces: 2, strips: 5, item: 'Ức gà luộc',
      prompt: 'Cô Tư vừa luộc xong mẻ ức gà. Vuốt DỌC theo thớ để xé sợi. Vuốt ngang thớ là ra vụn, Má mà thấy là Má buồn.',
      hint: 'Kéo chuột hoặc vuốt tay theo hướng các đường thớ trên miếng thịt.',
      good: [['tu', 'Sợi đều, không vụn. Con xé giống cô hồi trẻ.']], bad: [['tu', 'Vụn thế này chỉ làm chà bông thôi con ơi.']] },
    { id: 'bama_seal', type: 'action', game: 'hold', skin: 'seal', title: 'Hàn miệng túi khô gà', icon: '🔥', time: 40, pass: 0.6,
      rounds: 5, label: 'KHÔ GÀ LÁ CHANH',
      prompt: 'Giữ để máy hàn nóng lên, thả ra khi kim vào vùng xanh. Non tay thì hở túi, quá tay thì cháy túi.',
      hint: 'Giữ chuột / chạm giữ màn hình (hoặc giữ Space), thả ra đúng lúc.' },
    // ---- work sims (ui/sims.js): real work of a dried-food producer ----
    { id: 'bama_papers', type: 'doc', title: 'Soát giấy tờ trước khi Má ký', icon: '🏷️', time: 80, pass: 0.6,
      prompt: 'Má đưa xấp giấy: "Con coi kỹ rồi Má mới ký." Bấm 🚩 vào dòng sai luật, sai số hoặc sai quy trình. Dòng lạ chưa chắc đã sai. (Quy định rút gọn, thông tin giải trí.)',
      docs: [
        { kind: 'paper', head: 'Bản in thử nhãn · Khô gà lá chanh 200g', meta: 'Lô in 5.000 nhãn. Sản xuất 05/11/2026, hạn dùng 6 tháng. Nhãn phải khớp bản tự công bố. Ngân thiết kế, Ba duyệt "đẹp rồi".',
          lines: [
            { h: 'Mặt trước' },
            'KHÔ GÀ LÁ CHANH · Ba & Má · "Ngon như Má làm"',
            { t: '"100% tự nhiên · KHÔNG chất bảo quản"', bad: 'Thành phần có kali sorbat (202), là chất bảo quản: ghi "không chất bảo quản" là công bố sai sự thật.' },
            { t: 'Trọng lượng: 220g (tính cả túi zip)', bad: 'Nhãn phải ghi khối lượng tịnh, tức phần khô trong túi, không cộng bao bì.' },
            { h: 'Mặt sau' },
            'Thành phần: ức gà 80%, lá chanh, ớt, tỏi, đường, muối, nước mắm, mè rang',
            'Phụ gia: chất điều vị (621), chất bảo quản kali sorbat (202)',
            { t: 'Thông tin dị ứng: không có', bad: 'Có mè (vừng) và nước mắm (cá), đều là chất dễ gây dị ứng: phải cảnh báo, không được ghi "không có".' },
            'NSX: 05/11/2026 · Mã lô: KG-1105',
            { t: 'HSD: 05/11/2027', bad: 'Hạn 6 tháng tính từ 05/11/2026 là 05/05/2027. In sai hạn là cả lô 5.000 nhãn phải dán lại.' },
            'Bảo quản nơi khô ráo, tránh nắng. Sau khi mở, đóng kín zip, dùng trong 3 ngày.',
            'Cơ sở sản xuất: Ba & Má · Hẻm Lá Chanh, TP.HCM · Xuất xứ: Việt Nam',
            'Số tự công bố: 05/BAMA/2025 · Mã vạch: 893 4567 000 128',
          ],
          verdict: { q: 'Lô in 5.000 nhãn này?', options: ['In tiếp, lỗi nhỏ sửa ở lô sau', 'Dừng in, sửa 4 dòng, đưa chị Vy đối chiếu bản tự công bố', 'Chỉ xóa chữ "100%", còn lại giữ nguyên'], correct: 1,
            why: 'Nhãn sai là bị phạt và có thể phải thu hồi cả lô. Mọi chữ trên nhãn phải khớp hồ sơ tự công bố (thông tin giải trí, không phải tư vấn pháp lý).' } },
        { kind: 'invoice', head: 'Phiếu giao hàng & đề nghị thanh toán · Đại lý chú Năm (Biên Hòa)', meta: 'Bảng giá sỉ 2026: khô gà 200g 75.000đ · khô bò cay 200g 95.000đ · xoài sấy 250g 48.000đ. Đơn từ 10 triệu: chiết khấu 3%. Công nợ tối đa 15 ngày.',
          lines: [
            { h: 'Hàng giao' },
            'Khô gà lá chanh 200g · 60 gói × 75.000đ = 4.500.000đ',
            'Khô bò cay 200g · 40 gói × 95.000đ = 3.800.000đ',
            'Xoài sấy 250g · 50 gói × 48.000đ = 2.400.000đ',
            'Tặng kèm 10 gói trà lá chanh (chương trình tháng 11) · 0đ',
            { h: 'Thanh toán' },
            { t: 'Cộng tiền hàng: 10.500.000đ', bad: '4.500.000 + 3.800.000 + 2.400.000 = 10.700.000đ. Tổng sai là cả phiếu sai, rồi sổ công nợ sai theo.' },
            'Chiết khấu 3% (đơn từ 10 triệu): −321.000đ',
            { t: 'Chiết khấu thêm 5% "anh Dũng hứa miệng": −535.000đ', bad: 'Không có trong bảng giá, không có giấy: chiết khấu ngoài chính sách phải được Má duyệt bằng văn bản.' },
            { t: 'Hạn thanh toán: 45 ngày kể từ ngày giao', bad: 'Chính sách công nợ tối đa 15 ngày. Kéo 45 ngày là Ba & Má cho đại lý vay không lãi.' },
            'Chuyển khoản: tài khoản công ty Ba & Má · nội dung "DL Nam 1611"',
            'Người nhận ký: chú Năm · đủ 150 gói hàng và 10 gói tặng',
          ],
          verdict: { q: 'Gửi phiếu cho chú Năm chưa?', options: ['Gửi luôn, chú Năm quen mà', 'Gửi trước, cuối tháng đối chiếu sau', 'Sửa tổng, bỏ 5% chờ Má duyệt, sửa hạn 15 ngày rồi mới gửi'], correct: 2,
            why: 'Phiếu giao là chứng từ công nợ: sai một con số là cãi nhau cả tháng. Chiết khấu 3% đúng chính sách thì giữ.' } },
        { kind: 'post', head: 'Kịch bản live 20:00 · Út Mi · "Đêm khô gà"', meta: 'Khô gà lá chanh 200g: giá thường 89.000đ, giá live 79.000đ tới 22:00. Tồn kho 300 gói. Có kali sorbat, hạn dùng 6 tháng.',
          lines: [
            { h: 'Mở live' },
            'Chào cả nhà iu! Tối nay khô gà lá chanh mẻ mới, sấy sáng nay',
            'Giá thường 89.000đ, riêng live 79.000đ, chỉ tới 22:00 tối nay',
            { t: '"Ăn khô gà giảm mỡ bụng, bác sĩ khuyên dùng luôn nha!"', bad: 'Thực phẩm thường không được quảng cáo công dụng giảm cân, chữa bệnh. Mượn danh "bác sĩ" còn nặng hơn.' },
            { t: '"Rẻ nhất thị trường, ngon nhất Việt Nam!"', bad: 'Quảng cáo dùng chữ "nhất" phải có tài liệu chứng minh hợp lệ. Không có thì không nói.' },
            'Nhắc nhẹ: khô có mè và nước mắm, ai dị ứng đọc nhãn giúp Mi nha',
            { h: 'Chốt đơn' },
            'Chốt qua giỏ hàng ghim trên live, không chốt qua comment cho khỏi sót',
            { t: '"Chỉ còn 20 gói cuối cùng thôi, nhanh tay!" (kho còn 300)', bad: 'Báo sai số tồn để hối khách là thông tin gian dối: khách và sàn đều có thể khiếu nại.' },
            'Freeship đơn từ 2 gói, áp dụng nội thành TP.HCM',
            { t: '"Không chất bảo quản, để cả năm không hư!"', bad: 'Sai hai lần: có kali sorbat, và hạn dùng chỉ 6 tháng. Nói trên live phải khớp với nhãn.' },
            'Mèo Khô Gà có thể xuất hiện lúc 21:00 (không hứa trước)',
          ],
          verdict: { q: 'Kịch bản này?', options: ['Bỏ 4 câu sai, giữ giá live và giờ kết thúc, rồi lên sóng', 'Lên sóng luôn, câu nào cũng chốt đơn tốt', 'Bỏ luôn giá giảm cho an toàn'], correct: 0,
            why: 'Giảm giá thật, có giờ kết thúc rõ là hợp lệ. Công dụng chữa bệnh, chữ "nhất" không chứng minh, số tồn ảo thì không (thông tin giải trí).' } },
      ] },

    { id: 'bama_cskh', type: 'chat', title: 'Trả lời khách khiếu nại', icon: '📱', time: 85, pass: 0.6,
      prompt: 'Khách online đang nhắn, và đang bực. Xử lý thật thà, đúng quy trình, giữ được khách. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Chị Phương Thảo', emoji: '😤', role: 'Khách mua 3 bịch khô gà', app: 'Chat sàn' },
          start: ['Shop ơi khô gà chị mới mua bị mềm, có mấy chấm trắng xanh. Bán vậy hả?'],
          turns: [
            { options: [
              { t: 'Dạ khô bên em sấy kỹ lắm chị, chắc chị để gần chỗ ẩm hoặc mở ra không đóng zip lại nên mới vậy đó ạ, chị kiểm tra lại giúp em nha.', s: 0, react: 'Giờ lỗi tại chị hả?' },
              { t: 'Dạ em xin lỗi chị. Chị đừng ăn nữa nha. Chị chụp giúp em mặt sau bịch, chỗ có mã lô ạ.', s: 2, react: 'Đây. Lô KG-1105. Chị mới mở hôm qua.' },
              { t: 'Dạ chị gửi ảnh em xem ạ', s: 1, react: 'Ảnh đây. Rồi sao nữa?' },
            ] },
            { them: 'Giờ shop tính sao? Chị mua 3 bịch, mới mở 1.', options: [
              { t: 'Dạ em tặng chị mã giảm 20% cho đơn sau, 2 bịch kia chị cứ ăn bình thường, lô đó bên em bán cả trăm bịch chưa ai phản ánh ạ.', s: 0, react: 'Em kêu chị ăn tiếp lô bị mốc?' },
              { t: 'Dạ em gửi bù chị 1 bịch mới nha', s: 1, react: 'Còn 2 bịch cùng lô kia thì sao?' },
              { t: 'Dạ em hoàn tiền bịch đã mở, đổi 2 bịch kia sang lô khác, phí ship em chịu ạ.', s: 2, react: 'Vậy được. Đổi cả lô là đúng.' },
            ] },
            { them: 'Chị đánh 1 sao rồi đó. Hoàn tiền thì chị có phải xóa đánh giá không?', options: [
              { t: 'Dạ không ạ. Hoàn tiền là quyền của chị. Đánh giá em trả lời công khai bên dưới.', s: 2, react: 'Ờ. Vậy chị sửa thành 3 sao, ghi shop xử lý nhanh.' },
              { t: 'Dạ chị xóa đánh giá giúp em thì em hoàn ngay trong 5 phút, không thì phải chờ sàn duyệt hơi lâu, mong chị thương shop nhỏ ạ.', s: 0, react: 'À, ra là đổi tiền lấy sao.' },
              { t: 'Dạ tùy chị ạ', s: 1, react: 'Ừ.' },
            ] },
            { them: 'Mà hôm qua chị lỡ ăn 2 miếng rồi. Có sao không em?', options: [
              { t: 'Dạ chắc không sao đâu chị, mới có 2 miếng thôi, nhưng chị uống nhiều nước và theo dõi thêm giúp em vài hôm cho chắc nha.', s: 1, react: 'Theo dõi gì? Lỡ có chuyện thì sao em?' },
              { t: 'Dạ mốc ngoài mặt thôi, hơ lửa là ăn được ạ.', s: 0, react: 'Em là bác sĩ hả?' },
              { t: 'Dạ nếu chị đau bụng, sốt thì đi khám ngay nha chị. Em báo xưởng kiểm cả lô ạ.', s: 2, react: 'Chị vẫn khỏe. Cảm ơn em nhắc.' },
            ] },
          ],
          end: { good: 'Ok shop. Chị vẫn mua tiếp, nhưng em kiểm lô kỹ nha.', bad: 'Chị báo sàn rồi. Khỏi nhắn nữa.' } },
        { who: { name: 'Anh Hoàng', emoji: '📦', role: 'Khách đặt quà biếu · đơn 5 gói', app: 'Chat sàn' },
          start: ['Đơn 5 gói khô bò mà anh nhận có 4. Shop ăn bớt hả?'],
          turns: [
            { options: [
              { t: 'Dạ anh kiểm tra kỹ lại giúp em nha', s: 1, react: 'Kiểm ba lần rồi.' },
              { t: 'Dạ em xin lỗi anh. Anh cho em xin ảnh kiện hàng và tem vận đơn để em đối chiếu ạ.', s: 2, react: 'Đây. Tem ghi 1,1 kg.' },
              { t: 'Dạ không có đâu anh, bên em đóng hàng có camera hết, chắc anh kiểm lại trong túi hoặc người nhà lấy ăn trước rồi, vụ này hay gặp lắm ạ.', s: 0, react: 'Em nói nhà anh ăn vụng hả?' },
            ] },
            { them: 'Tem ghi 1,1 kg đó. Vậy là sao em?', options: [
              { t: 'Dạ 1,1 kg là đúng 5 gói rồi anh, vậy chắc chắn bên em đóng đủ, gói mất là do vận chuyển, anh khiếu nại bên đó giúp em là được hoàn ạ.', s: 0, react: 'Anh mua của shop chứ đâu mua của shipper.' },
              { t: 'Dạ cân đó khớp 5 gói. Em gửi bù anh trước, phần khiếu nại vận chuyển em lo ạ.', s: 2, react: 'Vậy được. Xử lý nhanh ghê.' },
              { t: 'Dạ để em hỏi kho ạ', s: 1, react: 'Hỏi nhanh giùm anh.' },
            ] },
            { them: 'Mai Chủ nhật anh cần biếu rồi. Kịp không em?', options: [
              { t: 'Dạ em gửi hỏa tốc nội thành, sáng mai tới. Em gửi anh mã vận đơn để theo dõi ạ.', s: 2, react: 'Được. Gửi mã giúp anh.' },
              { t: 'Dạ chắc chắn kịp, trễ em hoàn gấp đôi ạ!', s: 0, react: 'Gấp đôi nha. Anh chụp màn hình rồi.' },
              { t: 'Dạ em cố gắng ạ', s: 1, react: 'Cố gắng là kịp hay không?' },
            ] },
          ],
          end: { good: 'Nhận đủ rồi em. Shop làm ăn đàng hoàng, anh mua tiếp.', bad: 'Thôi anh trả hàng, báo sàn luôn.' } },
        { who: { name: 'Khánh Linh', emoji: '🌶️', role: 'Khách mua lần đầu · khô bò cay', app: 'Messenger' },
          start: ['Khô cay quá ăn không nổi. Shop hoàn tiền đi, không thì mình review cho cả nhóm 50 nghìn thành viên biết.'],
          turns: [
            { options: [
              { t: 'Dạ shop nhỏ lắm bạn ơi, mới mở mấy tháng, một review xấu là bên em khó bán lắm, bạn thương tình đừng đăng giúp em nha 🥺', s: 1, react: 'Vậy thì hoàn tiền đi.' },
              { t: 'Dạ ăn rồi thì không hoàn đâu bạn.', s: 0, react: 'Ok, vậy review nhé.' },
              { t: 'Dạ em tiếc vì món chưa hợp với bạn. Bạn đã mở mấy bịch rồi ạ?', s: 2, react: 'Ăn nửa bịch. Còn 2 bịch chưa mở.' },
            ] },
            { them: 'Vậy hoàn hết 3 bịch đi.', options: [
              { t: 'Dạ 2 bịch chưa mở em đổi vị ít cay hoặc hoàn tiền, tùy bạn. Bịch đã mở không lỗi nên em không hoàn ạ.', s: 2, react: 'Ừ… vậy cũng hợp lý.' },
              { t: 'Dạ thôi em hoàn hết cả 3 bịch cho bạn, khỏi gửi lại gì hết, chỉ cần bạn đừng đăng bài lên nhóm là được nha bạn.', s: 0, react: 'Dễ vậy. Mình kể nhóm là cứ dọa là được hoàn nha.' },
              { t: 'Dạ em hoàn 50% nha bạn', s: 1, react: '50% theo chính sách nào?' },
            ] },
            { them: 'Mình vẫn đăng review đó. Shop cấm được à?', options: [
              { t: 'Dạ đăng sai sự thật là em kiện đó bạn.', s: 0, react: 'Chụp màn hình rồi. Cảm ơn shop đã cho mình thêm nội dung.' },
              { t: 'Dạ bạn đăng nhẹ nhàng thôi nha', s: 1, react: 'Để xem.' },
              { t: 'Dạ đánh giá là quyền của bạn ạ. Em chỉ mong bạn ghi đúng là vị cay, không phải hàng lỗi.', s: 2, react: 'Công bằng. Mình ghi "cay thật, shop xử lý ổn".' },
            ] },
          ],
          end: { good: 'Đổi 2 bịch ít cay nhé. Lần sau mình đọc kỹ cấp độ cay.', bad: 'Bài đăng lên nhóm rồi. Bye shop.' } },
      ] },

    { id: 'bama_b2b', type: 'chat', title: 'Nhắn tin với đại lý và mối hàng', icon: '🤝', time: 85, pass: 0.6,
      prompt: 'Đại lý ép giá, mối thịt ép ký. Giữ quan hệ, nhưng giữ cả bảng giá, sổ công nợ và an toàn thực phẩm. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Chị Tâm', emoji: '🏬', role: 'Nhà phân phối lớn nhất · 6 năm', app: 'Zalo' },
          start: ['Em ơi, trên sàn bán 69K mà chị lấy sỉ 75K. Tháng này chị cần chiết khấu thêm 8%, không thì chị nhập bên khác.'],
          turns: [
            { options: [
              { t: 'Dạ em hiểu chị ạ, chị là đối tác lớn nhất nên em đồng ý thêm 8% luôn, để em báo Má sau, chị cứ yên tâm đặt hàng như cũ nha chị.', s: 0, react: 'Chị chụp màn hình rồi nha. 8%.' },
              { t: 'Dạ gói trên sàn là size khác, giá sỉ của chị không đổi. Tháng này chị dự kiến lấy bao nhiêu ạ?', s: 2, react: 'Size khác à? Ừ… tháng này chị lấy chắc 800 gói.' },
              { t: 'Dạ em không quyết được, chị chờ em ạ', s: 1, react: 'Vậy ai quyết? Gọi người đó cho chị.' },
            ] },
            { them: 'Mà đại lý chú Năm lấy giá bao nhiêu? Nói thật chị nghe.', options: [
              { t: 'Dạ giá từng đại lý em không nói được ạ. Giá của chị em cũng giữ kín như vậy.', s: 2, react: 'Ừ… em nói cũng phải.' },
              { t: 'Dạ nói nhỏ chị thôi nha, chú Năm lấy 73K vì trả tiền mặt, mà chú cũng hay nợ lắm chị ơi, em kể chị nghe chuyện hôm trước…', s: 0, react: 'À, chú Năm 73K. Vậy chị cũng phải 73K.' },
              { t: 'Dạ chắc cũng như chị thôi ạ', s: 1, react: '"Chắc"? Em không biết giá nhà em à?' },
            ] },
            { them: '800 gói thì em cho chị được gì?', options: [
              { t: 'Dạ em tặng thêm chị 20 gói khô gà mẻ mới, coi như quà cảm ơn chị gắn bó 6 năm, chị bán thêm được chút lời ạ.', s: 1, react: '20 gói là mấy phần trăm? Em tính chưa?' },
              { t: 'Dạ em giảm 8% luôn cho chị ạ.', s: 0, react: 'Vậy mà nãy giờ vòng vo.' },
              { t: 'Dạ theo bảng giá, từ 500 gói là thêm 2%. Chị trả trong 7 ngày thì thêm 1% ạ.', s: 2, react: 'Ba phần trăm. Chưa đủ 8, nhưng chị nghe được.' },
            ] },
            { them: 'Ok. Em gửi chị cái gì để chị chốt?', options: [
              { t: 'Dạ em gửi chị báo giá có chữ ký Má trong hôm nay ạ.', s: 2, react: 'Ok. Chị chờ báo giá.' },
              { t: 'Dạ chị cứ chuyển cọc 50% vào tài khoản riêng của em cho nhanh, tài khoản công ty xử lý chậm, em báo Má sau ạ.', s: 0, react: 'Tài khoản riêng? Chị gọi Má em đây.' },
              { t: 'Dạ chị đặt qua Zalo là được ạ', s: 1, react: 'Zalo thì sau này cãi nhau lấy gì làm bằng?' },
            ] },
          ],
          end: { good: 'Chị chốt 800 gói. Gửi báo giá, chị ký liền.', bad: 'Thôi tháng này chị nhập thử bên khác.' } },
        { who: { name: 'Cậu Tám', emoji: '🥩', role: 'Mối thịt · em Má', app: 'Zalo' },
          start: ['Con ơi cậu giao 120 ký ức gà rồi đó. Ký nhận giùm cậu, cậu chạy mối khác.'],
          turns: [
            { options: [
              { t: 'Dạ cậu là người nhà mà, con ký luôn cho cậu đi kịp mối, chắc chắn thịt cậu lấy là thịt tốt rồi, con kiểm tra sau cũng được cậu.', s: 0, react: 'Đó, con hiểu chuyện ghê. Má con mà được như con.' },
              { t: 'Dạ cậu chờ con hỏi anh Dũng ạ', s: 1, react: 'Hỏi lẹ nghen, cậu kẹt mối.' },
              { t: 'Dạ con đo nhiệt độ và coi giấy kiểm dịch rồi ký liền cậu.', s: 2, react: 'Giấy… để mai cậu gửi. Thịt tốt mà con.' },
            ] },
            { them: 'Đá tan chút xíu thôi. Đo chi cho mệt.', options: [
              { t: 'Dạ thôi sấy kỹ là vi khuẩn chết hết cậu.', s: 0, react: 'Đó! Con nói giống cậu.' },
              { t: 'Dạ thịt đang 11°C cậu ơi, phải dưới 4°C. Mấy thùng đó con không đưa vô sấy được.', s: 2, react: 'Trời đất. Có ba thùng thôi mà.' },
              { t: 'Dạ chắc không sao đâu cậu', s: 1, react: 'Thấy chưa. Ký đi con.' },
            ] },
            { them: 'Con làm vậy Má con buồn đó. Người nhà mà.', options: [
              { t: 'Dạ con xin lỗi cậu', s: 1, react: 'Xin lỗi thì ký đi.' },
              { t: 'Dạ con ghi biên bản, chụp hình gửi Má. Thùng đạt con nhận, thùng kia cậu đổi giúp con.', s: 2, react: 'Ừ… thì đổi. Mà con kỹ y chang Má.' },
              { t: 'Dạ vậy con nhận hết cho cậu vui, mấy miếng nhớt con tự lọc bỏ, không cần báo Má đâu cho Má khỏi lo, chuyện nhỏ mà cậu.', s: 0, react: 'Đó, vậy mới là cháu cậu.' },
            ] },
            { them: 'Còn giấy kiểm dịch thì sao? Cậu lấy mối này mười năm rồi.', options: [
              { t: 'Dạ hay cậu viết tay một tờ "thịt sạch", ký tên vô, con kẹp vào hồ sơ, đoàn kiểm tra tới cũng chịu thôi ạ.', s: 0, react: 'Ý hay! Cậu viết liền.' },
              { t: 'Dạ không có giấy thì con chưa nhập kho được. Cậu gửi hình giấy trước 10h là con nhận ạ.', s: 2, react: 'Rồi rồi. Cậu gọi lò mổ chụp gửi liền.' },
              { t: 'Dạ để con hỏi chị Vy coi giấy này có cách nào bổ sung sau không, chị Vy rành hồ sơ lắm, chắc chiều nay là có câu trả lời ạ.', s: 1, react: 'Vy lại đòi in A3 cho coi.' },
            ] },
          ],
          end: { good: 'Thôi được. Cậu đổi 3 thùng, 9h gửi hình giấy. Con kỹ giống Má.', bad: 'Ký rồi nghen. Cậu đi đây. (Chiều đó cô Tư ngửi mẻ khô, im lặng rất lâu.)' } },
        { who: { name: 'Cô Sáu Tạp Hóa', emoji: '🧺', role: 'Đại lý chợ · nợ 46 triệu', app: 'Zalo' },
          start: ['Con ơi gửi cô thêm 3 thùng khô gà nghen. Tiền cô gửi luôn cuối tháng.'],
          turns: [
            { options: [
              { t: 'Dạ con hỏi Má rồi báo cô ạ', s: 1, react: 'Má con là "để coi". Con quyết đi.' },
              { t: 'Dạ dạ cô, người nhà mà tính chi, con gửi cô 3 thùng liền chiều nay, tiền khi nào cô tiện thì gửi, con ghi sổ cho Má sau ạ.', s: 0, react: 'Đó, con dễ thương. Gửi lẹ nghen.' },
              { t: 'Dạ khoản 46 triệu của cô quá hạn rồi. Cô trả bớt phần cũ là con giao đơn mới liền ạ.', s: 2, react: 'Trời, con tính kỹ dữ. Cô chuyển 20 triệu rồi đó.' },
            ] },
            { them: 'Mà con lấy lại giùm cô 40 gói khô bò, còn 1 tháng là hết hạn.', options: [
              { t: 'Dạ cô bóc tem cũ, con gửi tem hạn mới ạ.', s: 0, react: 'Ý hay! Gửi tem cho cô liền.' },
              { t: 'Dạ còn nguyên tem, còn hạn thì con đổi theo chính sách ạ. Lần sau cô bán gói cũ trước nghen.', s: 2, react: 'Ừ. Gói mới cô toàn để ngoài, gói cũ nằm trong.' },
              { t: 'Dạ cô giảm giá xả bớt đi cô', s: 1, react: 'Giảm là cô lỗ, con bù không?' },
            ] },
            { them: 'Rồi, con ghi sổ đi. Khỏi giấy tờ, cô với Má con quen hai chục năm.', options: [
              { t: 'Dạ con ghi vô sổ của Má liền, có ngày giờ, số thùng đàng hoàng, cô yên tâm, sổ Má thì không ai cãi được đâu cô.', s: 1, react: 'Sổ Má thì cô đâu có coi được.' },
              { t: 'Dạ vậy con ghi miệng thôi cô nha, con nhớ giùm cô, để Má biết lại hỏi tới hỏi lui cô mệt, tháng sau cô trả gộp cũng được ạ.', s: 0, react: 'Con nhớ giùm cô nha. Nhớ kỹ đó.' },
              { t: 'Dạ con gửi cô biên bản đối chiếu công nợ qua Zalo, cô xác nhận giúp con là xong ạ.', s: 2, react: 'Ừ, gửi đi. Rõ ràng cũng tốt.' },
            ] },
          ],
          end: { good: 'Cô xác nhận đối chiếu rồi. Mai cho chú Bảy chở hàng nghen con.', bad: 'Thôi để cô lấy hàng bên khác cho đỡ phiền.' } },
      ] },
  ],

  // errands that lead into the hands-on games (`play` = a desk game id; engine: game/office.js officeGameFor)
  tasks: [
    { id: 'desk_xega', title: 'Phụ cô Tư xé gà cho mẻ sấy chiều', from: 'tu', base: 60, legs: [
      { npc: 'tu', line: ['tu', 'Con rảnh hông? Xé phụ cô hai miếng ức gà. Xé dọc thớ nghe, xé ngang là thành chà bông.'] },
      { obj: 'coffee', play: 'bama_shred', line: ['nar', 'Bạn xé xong hai miếng. Tay thơm mùi gà luộc và lá chanh.'] },
      { npc: 'tu', line: ['tu', 'Sợi được. Mai cô cho con xé tiếp. Đó là lời khen đó.'] },
    ] },
    { id: 'desk_hantui', title: 'Hàn túi cho đơn livestream tối nay', from: 'mi', base: 70, legs: [
      { npc: 'mi', line: ['mi', 'Tối nay live mà túi chưa hàn! Ra xưởng hàn giúp em năm túi với, anh Dũng chỉ chỗ.'] },
      { npc: 'dung', play: 'bama_seal', line: ['dung', 'Máy hàn đây. Nghe tiếng "xèo" là thả. Nghe tiếng "khét" là trễ.'] },
      { npc: 'mi', line: ['mi', 'Năm túi đẹp! Tối nay em khoe trên live là "đóng gói thủ công".'] },
    ] },
  ],

  chatter: [
    { id: 'bama_ch_dashboard', chat: [['tuan', 'Team ơi dashboard real-time live rồi 🚀 Đơn, ROAS, tồn kho, all in one'], ['hang', 'Cái này bao nhiêu tiền?'], ['tuan', 'Free trial 14 ngày, Mom'], ['hang', 'Ngày thứ 15 Má tắt.'], ['khoa', 'Ngày thứ 15 là Chủ nhật. Router cũng tắt.']],
      scene: [
        ['think', 'Kevin có dashboard. Má có cái sổ. Cái sổ không có free trial.'],
        { c: 'bama_desk_dashboard', o: [
          { t: 'Mở dashboard, khen đúng một biểu đồ cụ thể', fx: { rel: { tuan: 2 }, clock: 5 } },
          { t: '"Dạ con chép số trên đó vô sổ của Má luôn ạ"', fx: { uy: 1, rel: { hang: 1, tuan: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'bama_ch_video', chat: [['hung', '🎥 "Ba & Má – Hành trình 26 năm" (7:42)'], ['hung', 'Mọi người chia sẻ về trang cá nhân giùm ba. Ai chia sẻ ba biết.'], ['mi', 'Ba ơi phút thứ 3 là con hồi 5 tuổi khóc vì khô cay 😭 cắt giùm con'], ['hang', 'Chia sẻ thì được. Đừng ai tag Má.']],
      scene: [
        ['think', 'Bảy phút bốn mươi hai giây. Ba phút đầu là cảnh gánh khô ra chợ, quay lại bằng diễn viên là Ba.'],
        { c: 'bama_desk_video', o: [
          { t: 'Chia sẻ, kèm caption "26 năm, một công thức"', fx: { rel: { hung: 2 }, clock: 5 } },
          { t: 'Nhắn riêng Út Mi: "Đoạn phút thứ 3 dễ thương mà chị"', fx: { rel: { mi: 1 }, dr: 2 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'bama_ch_kep', chat: [['mi', 'AI THẤY KẸP TÓC HỒNG CỦA CHỊ KHÔNG 🚨 8 giờ live rồi'], ['mai', 'Hôm qua chị thấy Mèo Khô Gà tha cái gì màu hồng vô kho 👀'], ['bay', 'Kho không có gì màu hồng. Chú kiểm rồi. Đừng ai nghi chú.'], ['khoa', 'Con mèo không phải của anh.']],
      scene: [
        ['think', 'Bùa chốt đơn mất tích. Nghi phạm: một con mèo. Nhân chứng: chị Mai. Người bị nghi theo thói quen: chú Bảy.'],
        { c: 'bama_desk_kep', o: [
          { t: 'Chạy ra kho tìm cùng chú Bảy', fx: { rel: { bay: 1, mi: 2 }, nl: -2, clock: 10 } },
          { t: '"Chị chốt đơn bằng thực lực mà, cần gì bùa!"', fx: { rel: { mi: 1 }, dr: 1 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'bama_ch_haohut', chat: [['cautam', 'Lô thịt sáng nay hao hụt 3 ký nha. Trời nóng, thịt nó… bay hơi.'], ['hang', 'Thịt bay hơi? Bay đi đâu?'], ['cautam', 'Bay theo gió chị. Chuyện bình thường.'], ['dung', 'Cân lúc nhận là 20 ký. Có phiếu.'], ['tu', '(sticker con mèo đang nhai)']],
      scene: [
        ['think', 'Mình đang giữ ảnh phiếu cân sáng nay. Chữ ký cậu Tám, nét rất tự tin.'],
        { c: 'bama_desk_haohut', o: [
          { t: 'Gửi Má ảnh phiếu cân lúc nhận hàng', fx: { uy: 2, dr: 1, rel: { hang: 1, cautam: -2 }, set: { bama_desk_weighed: true } } },
          { t: 'Thả "haha" vào chữ "bay hơi"', fx: { dr: 2, rel: { cautam: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'bama_ch_tag', chat: [['son', 'Team ơi group mình đang có "communication debt". Từ nay mỗi tin gắn tag [HÔM QUA] [HÔM NAY] [VƯỚNG] nha'], ['hung', '[HÔM QUA] Ba nhớ hồi xưa…'], ['son', 'Dạ bác ơi, tag [VƯỚNG] mới là chỗ ghi khó khăn ạ'], ['hung', '[VƯỚNG] Ba vướng hồi xưa.']],
      scene: [
        ['think', 'Scrum đã chạm tới group chat gia đình. Group chat gia đình đã đánh trả bằng hồi xưa.'],
        { c: 'bama_desk_tag', o: [
          { t: 'Gắn tag đúng format cho tin báo cáo của mình', fx: { uy: 1, rel: { son: 2 } } },
          { t: 'Hỏi Ba "hồi xưa" là năm nào', fx: { rel: { hung: 1, son: -1 }, dr: 1, nl: -2 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'bama_ch_kiemnghiem', chat: [['vy', 'Nhắc lần 4: phiếu kiểm nghiệm khô bò hết hạn thứ Sáu. Chị in A3 dán cửa phòng Ba rồi nha 🙏'], ['hung', 'Thấy rồi. To quá ba tưởng lịch Tết.'], ['hang', 'Kiểm nghiệm lại bao nhiêu tiền?'], ['vy', 'Dạ rẻ hơn bị phạt ạ.'], ['hang', '…Ừ. Làm đi.']],
      scene: [
        ['think', 'Chị Vy vừa thắng Má bằng một câu bảy chữ. Lịch sử sẽ ghi lại.'],
        { c: 'bama_desk_kiemnghiem', o: [
          { t: 'Nhắn chị Vy: "Em gom mẫu gửi lab giúp chị"', fx: { uy: 1, rel: { vy: 2 }, nl: -3 } },
          { t: 'Thả tim cho câu "rẻ hơn bị phạt"', fx: { rel: { vy: 1 }, dr: 1 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'bama_ch_aoui', chat: [['mai', 'Psst. Em nghe gì chưa?', true], ['mai', 'Anh Dũng mặc áo sơ mi ủi thẳng. Thứ Ba. Ai mặc áo ủi ngày thứ Ba?', true], ['mai', 'Đi phỏng vấn chỗ khác chứ gì nữa 👀', true], ['dung', 'Chiều nay anh xin nghỉ 2 tiếng. Việc riêng.']],
      scene: [
        ['think', 'Chị Mai đã giải xong vụ án bằng một cái áo. Anh Dũng chưa biết mình là vụ án.'],
        { c: 'bama_desk_aoui', o: [
          { t: 'Nhắn riêng anh Dũng: "Chiều anh cần em trông xưởng giúp không?"', fx: { rel: { dung: 2 }, nl: -2 } },
          { t: 'Trả lời chị Mai: "Thật hả chị? Kể nữa đi"', fx: { dr: 3, rel: { mai: 2 } } },
          { t: 'Không trả lời, làm tiếp', fx: { uy: 1, rel: { mai: -1 } } },
        ] },
      ] },
    { id: 'bama_ch_cosau', chat: [['cosau', 'Má ơi tuần này cô lấy thêm 3 thùng nha, cuối tháng cô gửi luôn một lần'], ['hang', 'Cuối tháng nào? Cô nói câu này từ hồi tháng Ba.'], ['cosau', 'Cuối tháng này. Thiệt.'], ['bay', 'Xe chú nổ máy rồi. Chở hay không chở?']],
      scene: [
        ['think', 'Bốn mươi sáu triệu, tám cái "cuối tháng này", và một chiếc xe trả góp đang nổ máy.'],
        { c: 'bama_desk_cosau', o: [
          { t: 'Đề xuất: giao 3 thùng khi cô Sáu chuyển trước 5 triệu', fx: { uy: 2, rel: { hang: 1, cosau: -1 } } },
          { t: 'Gửi sticker "Người nhà mà" vào nhóm', fx: { dr: 2, rel: { hang: -1, hung: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'bama_ch_hop', chat: [['ngan', '(đã gửi một ảnh) hop_qua_tet_nhap.png'], ['ngan', 'Xin lỗi, gửi nhầm nhóm. Định gửi riêng cho cậu thôi.'], ['tuan', 'Wait. Cái này đẹp hơn hộp hiện tại. Gen Z vibes.'], ['hang', 'In cái này tốn mực bao nhiêu?'], ['ngan', '…']],
      scene: [
        ['think', 'Hộp mới không có con gà khóc. Ngân thì sắp khóc.'],
        { c: 'bama_desk_hop', o: [
          { t: 'Khen thật lòng một chi tiết trong bản vẽ', fx: { rel: { ngan: 2 } } },
          { t: 'Gửi Má bảng so giá in hai mẫu hộp', fx: { uy: 2, rel: { hang: 1, ngan: 1 }, nl: -2, clock: 10 } },
          { t: 'Thả sticker con gà đang khóc', fx: { dr: 2, rel: { ngan: -1 } } },
        ] },
      ] },
  ],

  promoOffer: [
    ['nar', 'Review xong, Má không gập sổ. Má lật tới một trang có tên bạn, kín chữ bằng mực tím.'],
    ['hang', 'Con biết trang này là gì không? Sổ chấm công. Má tự ghi. Máy chấm công không biết ai ngồi làm thiệt.'],
    ['hang', 'Cả tháng, nhà này lo cãi nhau. Ba với Kevin, Mai với khách, cậu Tám với cái cân. Má ngó ra thì thấy con ngồi đối soát đơn, kiểm tem, tính giá vốn.'],
    { if: F('bama_desk_weighed'), then: [['hang', 'Cái phiếu cân bữa thịt "bay hơi", Má cất trong két rồi. Đứa nào giữ con số cho Má, Má giữ đứa đó.']] },
    ['hang', 'Má nhận con chính thức. Mười triệu một tháng. Hợp đồng lần này Má kêu Vy soạn liền, khỏi đợi cuối năm.'],
    ['think', 'Mười triệu, và một hợp đồng "soạn liền". Ở Ba & Má, đó gần như là lời thề.'],
    { c: 'bama_work_offer', o: [
      { t: '"Dạ con cảm ơn Má. Con nhận ạ."', fx: { uy: 5, rel: { hang: 2 }, set: { accept_official: true } }, then: [
        ['hang', 'Ừ. Thứ Hai con vẫn ngồi bàn đó. Chỉ là giờ sai một con số, Má ghi tên con, không ghi "intern".'],
        ['hung', '(từ phòng bên) Người nhà rồi con! Mai nhớ thả tim hình hoa sen nghen!'],
      ] },
      { t: '"Dạ con xin hết đợt thực tập rồi mới quyết ạ."', fx: { set: { accept_official: false } }, then: [
        ['hang', 'Được. Má không hỏi lần hai. Nhưng trang sổ này Má không xé.'],
      ] },
    ] },
  ],
};
