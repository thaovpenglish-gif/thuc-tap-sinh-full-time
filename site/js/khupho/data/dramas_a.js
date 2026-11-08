// Khu phố T&M · dramas 1-14 (DESIGN.md 8.3, format docs/khupho/STORY_FORMAT.md). Plain data.
export const DRAMAS = [
  // ───────────────────────────── Drama 1 ─────────────────────────────
  {
    id: 'd01', no: 1, title: 'Mẹ chồng mở quán đối diện', who: ['kp:cam', 'kp:nhung', 'kp:dinh', 'kp:mit'],
    minDay: 11, startOn: [5],
    acts: [
      {
        gap: 0, place: 'caphe', from: '06:00', to: '09:00', task: 'Có biến ở cà phê cóc: tấm bảng lạ',
        scene: {
          lines: [
            ['nar', 'Sáng nay trước Cà Phê Cóc Bảy Ghế mọc lên tấm bảng đỏ chót: "SẮP KHAI TRƯƠNG: TRÀ SỮA MẸ LÀM".'],
            ['kp:cam', 'Con ngồi đi. Cà phê vẫn 15 nghìn. Từ tuần sau bà bán thêm trà sữa, đường thật, không bột.'],
            ['me', 'Ủa bà, quán trà sữa chị Nhung ở ngay đối diện mà...'],
            ['kp:cam', 'Thì đó. Nó tăng giá 3 nghìn một ly, còn lên fanpage chê cà phê cóc là "cũ". Cũ mà bền nha con.'],
            ['kp:dinh', 'Má ơi, con xin má. Con gác cao ốc chứ con đâu có gác nổi hai quán.'],
            ['kp:cam', 'Định, uống cà phê rồi đi làm. Chuyện buôn bán, đàn ông đừng xen.'],
          ],
          choices: [
            { t: 'Khuyên bà giữ cà phê buổi sáng, trà sữa để chiều', fx: { hearts: { 'kp:cam': 1 }, flag: 'd01_khuyen' },
              say: [['kp:cam', 'Ờ... sáng cà phê, chiều trà sữa. Để bà tính. Mà bà vẫn khai trương nha.']] },
            { t: 'Khen bảng hiệu đẹp, hỏi ngày khai trương', fx: { mood: 2, hearts: { 'kp:cam': 1, 'kp:nhung': -1 } },
              say: [['kp:cam', 'Đầu tuần sau! Con tới bà cho ly đầu tiên.'], ['nar', 'Bên kia đường, rèm Full Topping khẽ động.']] },
            { t: 'Chụp tấm bảng gửi Xóm Ơi', fx: { mood: 1, xomoi: '{ten}: Trước cà phê cóc có bảng "Trà sữa mẹ làm" nha cả nhà, đối diện Full Topping luôn.' },
              say: [['kp:phan', 'Đã ghim! Cả nhóm đang hóng.']] },
          ],
        },
        missed: 'Bà Phấn: Trước cà phê cóc mới dựng bảng "SẮP KHAI TRƯƠNG: TRÀ SỮA MẸ LÀM", ngay đối diện Full Topping. Căng nha cả nhà.',
      },
      {
        gap: 1, place: 'trasua', from: '09:00', to: '11:30', task: 'Full Topping vắng khách sáng: chị Nhung lo',
        scene: {
          lines: [
            ['nar', 'Bên cà phê cóc treo bảng "Trà sữa mẹ làm 15k". Sáng nay Full Topping vắng hẳn một khúc.'],
            ['kp:nhung', 'Mười lăm phần trăm khách sáng chạy qua bên kia. Chị tính rồi, chị tính ra được cả tiền điện của nỗi buồn.'],
            ['kp:tu', 'Chị ơi, hồi nãy khách hỏi mình có "đường thật, không bột" không.'],
            ['kp:nhung', 'Có! Đường mình là đường thật! Bột béo cũng là bột béo thật luôn!'],
            ['kp:mit', 'Con uống nước lọc thôi. Mẹ với nội dặn con không được chọn phe.'],
            ['kp:nhung', '{ten}, em nghĩ coi, chị nên làm sao?'],
          ],
          choices: [
            { t: '(Trà sữa) Giảm giá theo, 15 nghìn luôn', role: 'trasua', fx: { money: -20000, hearts: { 'kp:nhung': 1, 'kp:cam': -1 }, flag: 'd01_chien' },
              say: [['kp:nhung', 'Chiến! Lời mỏng như lá trà nhưng không thua.'], ['nar', 'Bên kia đường, bà Cẩm hạ giá còn 14 nghìn.']] },
            { t: '(Trà sữa) Ra món khác biệt: trà xoài Sa Đéc', role: 'trasua', fx: { mood: 3, hearts: { 'kp:nhung': 2 } },
              say: [['kp:nhung', 'Món mới! Bên đó có đường thật, mình có xoài thật. Huề.']] },
            { t: 'Gợi ý mời bà Cẩm qua dạy món "kiểu xưa"', fx: { hearts: { 'kp:nhung': 1, 'kp:cam': 1 }, flag: 'd01_moi' },
              say: [['kp:nhung', 'Mời má qua dạy? Chị... chị nghĩ đã. Mà ý hay.']] },
            { t: 'Mở bình chọn trên Xóm Ơi: quán nào ngon hơn', fx: { mood: 2, hearts: { 'kp:nhung': -1, 'kp:cam': -1 }, flag: 'd01_chien', xomoi: '{ten}: Bình chọn nè: Trà sữa mẹ làm hay Full Topping? Thả tim bên dưới!' },
              say: [['kp:phan', 'Mới 5 phút đã 41 phiếu, nhóm chia hai phe rồi nha.']] },
          ],
        },
        missed: 'Tú: Sáng nay quán vắng 15% khách, chị Nhung ngồi tính tiền điện của nỗi buồn. Bên cà phê cóc bán trà sữa 15 nghìn.',
      },
      {
        gap: 1, place: 'comtam', from: '17:30', to: '20:30', task: 'Bữa cơm Chủ nhật ở cơm tấm: anh Định kẹt giữa',
        scene: {
          lines: [
            ['nar', 'Bữa cơm Chủ nhật năm nay dời ra Cơm Tấm Cô Lài, vì không ai chịu nấu ở nhà ai.'],
            ['bama:mi', 'Cả nhà ơi, live nè! Anh Định đang cầm hai ly: một ly mẹ làm, một ly vợ làm. Uống ly nào trước?'],
            ['kp:dinh', 'Anh... anh uống cùng lúc.'],
            ['nar', 'Anh Định ngậm hai ống hút một lúc. 1.200 người xem thả tim.'],
            ['kp:cam', 'Ly của má đường thật đó nha.'],
            ['kp:nhung', 'Ly của con topping thật đó nha.'],
            ['kp:mit', 'Con uống nước lọc. Cơm tấm ngon.'],
            ['kp:lai', 'Ăn cơm đi mấy người. Sườn nguội thì khỏi chiến tranh gì hết.'],
          ],
          choices: [
            { t: 'Đứng giữa: "Sáng cà phê ở mẹ, chiều trà sữa ở dâu"', fx: { hearts: { 'kp:dinh': 2, 'kp:cam': 1, 'kp:nhung': 1 }, flag: 'd01_combo' },
              say: [['kp:dinh', 'Đó! Câu này tui nghĩ ba ngày mà không dám nói.'], ['kp:cam', '...Nghe cũng được.']] },
            { t: 'Khen ly của bà Cẩm', fx: { hearts: { 'kp:cam': 2, 'kp:nhung': -1 } },
              say: [['kp:cam', 'Thấy chưa, khách nói đó.'], ['kp:nhung', 'Khách này ăn cơm của ai vậy?']] },
            { t: 'Khen ly của chị Nhung', fx: { hearts: { 'kp:nhung': 2, 'kp:cam': -1 } },
              say: [['kp:nhung', 'Cảm ơn em, mai chị cho thêm trân châu.'], ['kp:cam', 'Hừ.']] },
            { t: 'Cắm cúi ăn cơm tấm, không nói gì', fx: { money: -35000, food: 15, mood: 2 },
              say: [['kp:lai', 'Người khôn nhất bàn.']] },
          ],
        },
        missed: 'Út Mi: Live bữa cơm Chủ nhật nè, anh Định uống hai ly trà sữa cùng lúc. 1.200 người xem, chưa bên nào chịu thua.',
      },
      {
        gap: 1, place: 'caphe', from: '15:00', to: '18:00', task: 'Cà phê cóc chiều nay: hòa hay chiến?',
        scene: {
          lines: [
            ['nar', 'Chiều. Bà Cẩm ngồi đếm ly, bên kia đường chị Nhung cũng đếm ly. Hai bên đếm bằng ánh mắt.'],
            ['kp:cam', 'Bán trà sữa mệt hơn bà tưởng. Lắc tay muốn rụng.'],
            ['kp:nhung', 'Má... con qua có chút chuyện.'],
            ['kp:cam', 'Qua chê nữa hả?'],
            ['kp:nhung', 'Con qua xin lỗi vụ chữ "cũ". Con định viết "cổ điển" mà điện thoại tự sửa chữ.'],
            ['kp:dinh', 'Hai người đang nhìn {ten} kìa. {ten} nói một câu đi.'],
          ],
          choices: [
            { t: 'Đề xuất combo: cà phê sáng ở mẹ, trà sữa chiều ở dâu', fx: { mood: 5, hearts: { 'kp:cam': 2, 'kp:nhung': 2, 'kp:dinh': 1 }, flag: 'd01_hoa', xomoi: 'Bà Phấn: Hòa rồi cả nhà ơi! Combo mới: cà phê sáng ở mẹ, trà sữa chiều ở dâu.' },
              say: [['kp:cam', 'Được. Mà trà xoài thì con dạy má.'], ['kp:nhung', 'Còn má dạy con pha phin nha.']] },
            { t: 'Để hai người tự nói, mình đi về', fx: { hearts: { 'kp:dinh': 1 } },
              say: [['nar', 'Bạn đi được 20 mét thì nghe hai người cười. Chắc là hòa.']] },
            { t: '"Chiến tiếp cho vui đi"', fx: { hearts: { 'kp:cam': -1, 'kp:nhung': -1 }, flag: 'd01_chientranh', xomoi: 'Bà Phấn: Giá chiến hai quán đối diện kéo dài thêm 2 tuần, ai mê ly 14 nghìn thì tranh thủ.' },
              say: [['kp:dinh', '{ten}! Tui tưởng bạn là bạn tui!'], ['nar', 'Giá chiến thêm hai tuần. Lời mỏng, Xóm Ơi chia phe.']] },
          ],
        },
        missed: 'Anh Định: Má với vợ tui ngồi chung một bàn ở cà phê cóc rồi. Tui chưa biết là hòa hay là họp chiến lược.',
      },
    ],
    end: 'Biên bản khu phố: Vụ hai quán đối diện. Sáng cà phê ở mẹ, chiều trà sữa ở dâu, anh Định uống cả hai.',
  },

  // ───────────────────────────── Drama 2 ─────────────────────────────
  // Adapted: there is no second branch yet, so the "khai trương" is Full Topping's anniversary promo day.
  {
    id: 'd02', no: 2, title: 'Người yêu cũ ngày khai trương', who: ['kp:hao', 'kp:nhung', 'kp:dinh', 'bama:mi'],
    minDay: 31, startOn: [5, 6],
    acts: [
      {
        gap: 0, place: 'trasua', from: '08:00', to: '11:00', task: 'Kỷ niệm Full Topping: kệ hoa bí ẩn',
        scene: {
          lines: [
            ['nar', 'Hôm nay Full Topping kỷ niệm 5 năm, mua 1 tặng 1 cả ngày. Giữa cửa có một kệ hoa to nhất từ trước tới giờ.'],
            ['nar', 'Tấm thiệp ghi: "Chúc em mãi như xưa. H."'],
            ['kp:nhung', 'Ai... ai gửi vậy? Tú, em nhận hả?'],
            ['kp:tu', 'Shipper để lại lúc 7h chị. Không ghi số điện thoại.'],
            ['kp:nhung', 'Chiều nay Út Mi qua live. Thiệp này mà lên live là cả khu phố đoán liền.'],
            ['kp:nhung', '{ten}, em xử giùm chị được không?'],
          ],
          choices: [
            { t: 'Gỡ tấm thiệp, cất vào ngăn kéo', fx: { hearts: { 'kp:nhung': 1 }, flag: 'd02_go' },
              say: [['kp:nhung', 'Cảm ơn em. Hoa thì để, hoa đâu có tội.']] },
            { t: 'Để nguyên, hoa đẹp mà', fx: { mood: 1 },
              say: [['kp:nhung', 'Ờ... thì để. Chắc không ai để ý đâu.'], ['nar', 'Ai cũng để ý.']] },
            { t: '(Trà sữa) Làm trò "Đoán H. là ai, đúng được tặng ly"', role: 'trasua', fx: { money: 50000, mood: 3, hearts: { 'kp:nhung': 1 }, flag: 'd02_doan' },
              say: [['kp:nhung', 'Trời, em là thiên tài marketing. Khách đông gấp rưỡi kìa!']] },
          ],
        },
        missed: 'Tú: Kệ hoa ghi "Chúc em mãi như xưa. H." vẫn đứng giữa cửa quán. Chị Nhung đi qua đi lại 14 lần.',
      },
      {
        gap: 0, place: 'trasua', from: '16:00', to: '19:30', task: 'Út Mi live kỷ niệm ở Full Topping',
        scene: {
          lines: [
            ['bama:mi', 'Chào cả nhà, Mi đang ở Full Topping kỷ niệm 5 năm nè! Ủa, kệ hoa gì mà to vậy?'],
            ['nar', 'Thiệp còn hay mất cũng vậy: bà Phấn đã chụp từ sáng. Cả khu phố đều biết có một chữ "H."'],
            ['kp:phan', '(trên Xóm Ơi) "H." là ai? Hưng con Cô Bánh Mì? Anh Hào net? Chị Huyền trái cây?'],
            ['kp:dinh', 'Anh mới tan ca ghé qua. Ai là "H." vậy em?'],
            ['kp:nhung', 'Anh uống trà sữa đi anh. Mua 1 tặng 1.'],
            ['bama:mi', 'Ủa anh Định, mặt anh y chang lúc anh gác sảnh cao ốc vậy?'],
          ],
          choices: [
            { t: 'Đính chính trên Xóm Ơi: hoa của khách quen', fx: { hearts: { 'kp:nhung': 2, 'kp:dinh': 1 }, xomoi: '{ten}: Hoa của khách quen chúc mừng kỷ niệm thôi, cả nhà đừng đoán bậy nha.' },
              say: [['kp:phan', 'Đã ghi nhận. Nhưng vẫn ghim bài đoán.']] },
            { t: 'Nhắn anh Hào: "Anh qua nói một câu đi"', fx: { hearts: { 'kp:hao': 1 }, flag: 'd02_nhanhao' },
              say: [['nar', 'Anh Hào đã xem. Đang gõ... rồi thôi... rồi lại gõ.']] },
            { t: 'Đoán luôn: "Hưng!" cho vui', fx: { mood: 2, hearts: { 'kp:nhung': -1 } },
              say: [['bama:mi', 'Một phiếu cho Hưng! Hưng ở Bình Dương chắc đang hắt xì.']] },
            { t: '(Trà sữa) Mời Út Mi quay món mua 1 tặng 1', role: 'trasua', fx: { money: 30000, hearts: { 'kp:nhung': 1, 'bama:mi': 1 } },
              say: [['bama:mi', 'Ok cả nhà, nhìn ly nè, đừng nhìn hoa!']] },
          ],
        },
        missed: 'Bà Phấn: Út Mi live kỷ niệm Full Topping, cả nhóm đoán "H." là ai: Hưng, Hào hay Huyền? Anh Định đứng như gác sảnh.',
      },
      {
        gap: 1, place: 'trasua', from: '14:00', to: '17:00', task: 'Anh Hào tới Full Topping "bàn chuyện làm ăn"',
        scene: {
          lines: [
            ['kp:hao', 'Chào Nhung. Anh qua bàn chuyện làm ăn: combo "giờ chơi + trà sữa", khách net mua giờ được giảm 5 nghìn một ly.'],
            ['kp:nhung', 'Chỉ là làm ăn hả anh?'],
            ['kp:hao', 'Chỉ là làm ăn. Còn hoa thì... hoa cũng là làm ăn.'],
            ['nar', 'Anh Định đứng sau quầy, tay khoanh trước ngực, đúng tư thế gác sảnh lúc 8h.'],
            ['kp:dinh', 'Anh Hào uống gì? Ở đây có trà, có sữa, có chồng chị Nhung.'],
            ['kp:nhung', '{ten}, em thấy combo này sao?'],
          ],
          choices: [
            { t: 'Đề xuất ký combo, có anh Định làm chứng', fx: { money: 50000, hearts: { 'kp:hao': 2, 'kp:nhung': 1, 'kp:dinh': -1 }, flag: 'd02_combo' },
              say: [['kp:hao', 'Cảm ơn em. Anh Định, em hứa chỉ là làm ăn.'], ['kp:dinh', 'Ừ. Tui ghi nhớ rồi đó.']] },
            { t: 'Bảo anh Hào nhận tấm thiệp cho rõ ràng', fx: { mood: 2, hearts: { 'kp:dinh': 2, 'kp:hao': -1 } },
              say: [['kp:hao', 'Ờ thì... anh gửi. Chúc "mãi như xưa" là chúc quán đông như xưa thôi mà!'], ['kp:dinh', 'Vậy thì được.']] },
            { t: 'Kéo anh Định ra ngoài uống ly trà cho hạ hỏa', fx: { money: -25000, hearts: { 'kp:dinh': 1, 'kp:nhung': 1 } },
              say: [['kp:dinh', 'Bạn tốt. Ly này tui uống từ từ, một ống hút thôi.']] },
          ],
        },
        missed: 'Pháo: Anh Hào qua Full Topping bàn combo "giờ chơi + trà sữa". Anh Định đứng sau quầy suốt buổi, không chớp mắt.',
      },
    ],
    end: 'Biên bản khu phố: Tấm thiệp "Chúc em mãi như xưa. H." Hoa thì để, chữ ký thì đã rõ, anh Định vẫn ghé quán mỗi chiều.',
  },

  // ───────────────────────────── Drama 3 ─────────────────────────────
  {
    id: 'd03', no: 3, title: 'Đánh ghen bằng loa khu phố', who: ['kp:ly', 'kp:manh', 'kp:man', 'kp:cuong'],
    minDay: 4,
    acts: [
      {
        gap: 0, place: 'cho', from: '06:30', to: '10:30', task: 'Có biến ở chợ: chị Ly hỏi khéo',
        scene: {
          lines: [
            ['nar', 'Chợ Tâm Mỹ sáng nay. Chị Ly cầm một xấp biên lai, đi từng sạp như đi thu thuế.'],
            ['kp:ly', 'Dì Chín ơi, chiều thứ Ba nào ổng cũng có biên lai tiệm tóc lúc 3 giờ. Tuần nào cũng đi là đi làm gì?'],
            ['kp:chin', 'Đàn ông đi tiệm tóc thì... hớt tóc chớ làm gì.'],
            ['kp:ly', 'Hớt gì mà tuần nào cũng hớt? Tóc ổng mọc nhanh dữ vậy hả?'],
            ['kp:muoi', 'Tóc mọc nhanh hay tin mọc nhanh? Cá tui sắp ươn rồi nè.'],
            ['kp:ly', '{ten}! Em hay đi ngang tiệm chị Mận đúng không? Em thấy gì nói chị nghe.'],
          ],
          choices: [
            { t: '"Em thấy anh Mạnh đi hớt tóc thôi chị"', fx: { hearts: { 'kp:ly': -1, 'kp:manh': 1 } },
              say: [['kp:ly', 'Hớt tóc thôi? Hớt gì mà 300 nghìn?']] },
            { t: '"Chị hỏi thẳng anh Mạnh đi chị"', fx: { hearts: { 'kp:ly': 1 } },
              say: [['kp:ly', 'Hỏi thẳng thì ổng nói "chuyện đàn ông". Chị hỏi xéo cho chắc.']] },
            { t: 'Mua bó rau, giả vờ không nghe', fx: { money: -10000, food: 5 },
              say: [['kp:chin', 'Mười nghìn. Khôn đó con.']] },
          ],
        },
        missed: 'Dì Chín: Sáng nay chị Ly đi hỏi khắp chợ chuyện biên lai tiệm tóc chiều thứ Ba của anh Mạnh. Cá cô Mười cũng nghe.',
      },
      {
        gap: 1, place: 'khupho', from: '16:30', to: '18:30', task: 'Loa khu phố bị mượn: chị Ly cầm micro',
        scene: {
          lines: [
            ['nar', '17h, giờ loa khu phố đọc thông báo. Chú Cường vừa mở micro thì chị Ly bước vô.'],
            ['kp:ly', 'Chú Cường cho con mượn loa chút xíu, thông báo việc gia đình.'],
            ['kp:cuong', 'Việc gia đình gì con?'],
            ['kp:ly', '(vào loa) Alô alô, ai thấy chồng tôi chiều thứ Ba ở tiệm tóc...'],
            ['nar', 'Chú Cường giật lại micro. Đồng hồ ghi đúng 7 giây.'],
            ['kp:cuong', 'Loa khu phố để thông báo cúp điện, tiêm chủng, họp dân, không dùng việc riêng (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:ly', 'Vậy chú thông báo giùm con: chiều mai 3 giờ, tiệm tóc.'],
          ],
          choices: [
            { t: 'Phụ chú Cường dỗ chị Ly về', fx: { hearts: { 'kp:cuong': 2, 'kp:ly': -1 } },
              say: [['kp:cuong', 'Cảm ơn con. Bảy giây đó chú nhớ suốt đời.']] },
            { t: 'Rủ chị Ly đi uống trà sữa cho bình tĩnh', fx: { money: -25000, hearts: { 'kp:ly': 2 } },
              say: [['kp:ly', 'Ly lớn, nhiều đá. Chị cần đá.']] },
            { t: 'Nhắn chị Mận: "Mai 3 giờ chị Ly tới đó"', fx: { hearts: { 'kp:man': 1 }, flag: 'd03_baotin' },
              say: [['kp:man', 'Trời đất. Cảm ơn em, chị chuẩn bị khăn.']] },
          ],
        },
        missed: 'Bà Phấn: 17h nay loa khu phố phát được 7 giây giọng chị Ly "ai thấy chồng tôi chiều thứ Ba" thì chú Cường giật micro.',
      },
      {
        gap: 1, place: 'cattoc', from: '14:30', to: '16:30', task: 'Tiệm tóc 15h: chị Ly tới, trà sữa đổ',
        scene: {
          lines: [
            ['nar', '15h, tiệm Đẹp Mỗi Ngày. Một vị khách trùm khăn kín đầu, ngồi ghế trong cùng.'],
            ['kp:man', 'Chị Ly! Chị ngồi chờ chút, em đang... ủ tóc cho khách.'],
            ['kp:ly', 'Khách nào ủ tóc mà mang dép của chồng chị?'],
            ['nar', 'Chị Ly giật mình làm rơi ly trà sữa. Trân châu lăn lênh láng. Một khách đang chờ bật livestream.'],
            ['kp:ly', 'Mở khăn ra!'],
            ['nar', 'Khăn mở ra: anh Mạnh, nửa đầu đã nhuộm đen, nửa đầu còn bạc như muối.'],
            ['kp:manh', 'Em... anh... anh nhuộm tóc.'],
          ],
          choices: [
            { t: 'Kéo anh Mạnh vào phòng gội (hơi trễ)', fx: { mood: 2, hearts: { 'kp:manh': 1 } },
              say: [['nar', 'Bạn kéo anh Mạnh đi được hai bước. Nửa đen nửa bạc vẫn rất dễ nhận ra.']] },
            { t: '"Chị ơi, không phải đâu, anh chỉ nhuộm tóc thôi"', fx: { hearts: { 'kp:ly': 1, 'kp:man': 1 } },
              say: [['kp:man', 'Đúng đó chị, thứ Ba nào ảnh cũng nhuộm chân tóc. Bí mật khách hàng mà.']] },
            { t: 'Lau trân châu trước, chuyện người lớn tính sau', fx: { energy: -3, hearts: { 'kp:man': 1 } },
              say: [['kp:man', 'Em là nhân viên trong mơ của chị.']] },
            { t: '(Trà sữa) Ly đổ là ly mình giao: đền chị ly mới', role: 'trasua', fx: { money: -30000, hearts: { 'kp:ly': 2, 'kp:nhung': 1 } },
              say: [['kp:ly', 'Ít đá thôi em. Chị hết cần đá rồi.']] },
          ],
        },
        missed: 'Khách tiệm tóc: Em live nè! Chị Ly mở khăn ra là anh Mạnh, nửa đầu đen nửa đầu bạc. Trà sữa đổ đầy sàn.',
      },
      {
        gap: 0, place: 'quannhau', from: '18:30', to: '22:30', task: 'Quán nhậu tối nay: anh Mạnh thú nhận',
        scene: {
          lines: [
            ['nar', 'Tối. Quán nhậu Một Hai Ba Dô mở cửa như thường, chỉ có ông chủ đội nón kết trong nhà.'],
            ['kp:manh', 'Anh sợ già trước em. Em vẫn trẻ, còn anh mỗi sáng soi gương thấy thêm một sợi bạc.'],
            ['kp:ly', 'Ông khùng hả? Tôi cũng nhuộm! Tôi nhuộm ở nhà, đỡ 300 nghìn mỗi tuần!'],
            ['kp:manh', 'Em cũng nhuộm hả?'],
            ['kp:teo', 'Dạ bàn số 4 gọi thêm đá... mà thôi, để em tự lấy.'],
            ['kp:ly', '{ten}, em nói coi, ai sai?'],
          ],
          choices: [
            { t: '"Hai anh chị đi nhuộm chung đi, có combo"', fx: { hearts: { 'kp:ly': 2, 'kp:manh': 2, 'kp:man': 1 }, flag: 'd03_nhuomchung', xomoi: 'Chị Mận: Tiệm có combo "nhuộm kiểu anh Mạnh" cho vợ chồng, giảm 20% nha cả nhà.' },
              say: [['kp:manh', 'Nhuộm chung! Từ nay khỏi giấu.'], ['kp:ly', 'Mà màu tôi chọn.']] },
            { t: '"Anh sai vì giấu, chị sai vì mượn loa. Huề"', fx: { mood: 2, hearts: { 'kp:cuong': 1 } },
              say: [['kp:ly', 'Ừ thì... huề.'], ['kp:manh', 'Huề! Tèo, nước ngọt cho cả bàn!']] },
            { t: 'Gọi dĩa mực nướng, ăn mừng giùm', fx: { money: -40000, food: 10, mood: 3 },
              say: [['kp:teo', 'Mực nướng, quán bớt nửa giá vì hôm nay vui.']] },
          ],
        },
        missed: 'Tèo: Anh Mạnh thú nhận nhuộm tóc vì sợ già trước vợ. Chị Ly nói chị cũng nhuộm ở nhà. Quán vui cả tối.',
      },
    ],
    end: 'Biên bản khu phố: Từ nay loa khu phố không dùng việc riêng. Tiệm tóc có trào lưu "nhuộm kiểu anh Mạnh".',
  },

  // ───────────────────────────── Drama 4 ─────────────────────────────
  {
    id: 'd04', no: 4, title: 'Ba anh Lộc một cuốn sổ nợ', who: ['kp:ly', 'agency:loc', 'tech:loc', 'audit:loc', 'audit:diep'],
    minDay: 17,
    acts: [
      {
        gap: 0, place: 'quannhau', from: '18:00', to: '22:00', task: 'Quán nhậu: chị Ly đòi nợ "Lộc (trên lầu)"',
        scene: {
          lines: [
            ['nar', 'Sau ngày lương. Chị Ly mở sổ nợ, ngón tay dừng ở dòng: "Lộc (trên lầu) 1.840.000đ".'],
            ['kp:ly', 'Khu này có ba ông Lộc, ông nào cũng làm "trên lầu". Chị gọi cả ba rồi.'],
            ['tech:loc', 'Không phải em. Em ở tầng 7, mà tầng 7 đâu tính là "lầu", tính là "server".'],
            ['agency:loc', 'Không phải em nha chị. Dạo này CPM đang cao, em đâu có tiền đi nhậu.'],
            ['audit:loc', 'Chị có chứng từ không? Không có chứng từ thì khoản này chưa ghi nhận được.'],
            ['kp:ly', 'Chứng từ là cuốn sổ này nè! Chị ghi tên, không ghi họ, ai mà ngờ có tới ba ông Lộc!'],
          ],
          choices: [
            { t: '"Từ nay ghi thêm số điện thoại đi chị"', fx: { hearts: { 'kp:ly': 2 }, flag: 'd04_sdt' },
              say: [['kp:ly', 'Phải rồi! Mà nợ cũ thì sao?']] },
            { t: '"Ba anh chia đều cho nhanh"', fx: { hearts: { 'kp:ly': 1, 'tech:loc': -1, 'agency:loc': -1, 'audit:loc': -1 } },
              say: [['audit:loc', 'Chia đều khi chưa đối chiếu là sai nguyên tắc!'], ['tech:loc', 'Em đồng ý với anh Lộc. Anh Lộc kia thì không.']] },
            { t: 'Gọi dĩa đậu phộng, ngồi xem', fx: { money: -15000, mood: 3 },
              say: [['kp:teo', 'Đậu phộng rang, ghế hàng đầu.']] },
          ],
        },
        missed: 'Tèo: Chị Ly gọi cả ba anh Lộc tới đòi 1.840.000đ của "Lộc (trên lầu)". Ba anh cùng nói "không phải em".',
      },
      {
        gap: 1, place: 'toanha', from: '11:30', to: '13:30', task: 'Cao ốc giờ trưa: ba anh Lộc cãi nhau',
        scene: {
          lines: [
            ['nar', 'Giờ trưa, sảnh cao ốc Tâm Mỹ. Thang máy kẹt, nên ba anh Lộc kẹt chung một chỗ.'],
            ['tech:loc', 'Em đề nghị xem log camera quán nhậu. Camera không biết nói dối, chỉ biết mất kết nối.'],
            ['audit:loc', 'Anh đề nghị quán xuất trình hóa đơn từng bàn. Có hóa đơn mới có sự thật.'],
            ['agency:loc', 'Em đề nghị... mình chạy một chiến dịch tìm người. CPM đang cao nhưng em chịu.'],
            ['kp:dinh', 'Mấy anh cãi nhỏ thôi, thang máy nó nghe nó cũng sợ.'],
            ['me', 'Hình như cả ba anh đều nhớ có nhậu ở đó một tối thứ Sáu...'],
          ],
          choices: [
            { t: '(Nợ Kỹ Thuật) Bênh anh Lộc DevOps của mình', role: 'tech', fx: { hearts: { 'tech:loc': 2, 'audit:loc': -1 } },
              say: [['tech:loc', 'Đúng người đúng việc! Anh chỉ nợ kỹ thuật, không nợ quán nhậu.']] },
            { t: '(Trend Trễ) Bênh anh Lộc Media Buyer của mình', role: 'agency', fx: { hearts: { 'agency:loc': 2, 'tech:loc': -1 } },
              say: [['agency:loc', 'Em hiểu chuyện! Anh sẽ mời em... khi CPM xuống.']] },
            { t: 'Gợi ý nhờ chị Diệp bên Cân Đối soát sổ', fx: { hearts: { 'audit:diep': 1, 'audit:loc': 1 }, flag: 'd04_diep' },
              say: [['audit:loc', 'Chị Diệp có bốn cây bút màu. Chưa cuốn sổ nào sống sót.']] },
            { t: 'Đi thang bộ, kệ ba anh', fx: { energy: -4, mood: 1 },
              say: [['nar', 'Bạn leo bộ. Lên tới nơi vẫn nghe ba anh Lộc cãi vọng lên.']] },
          ],
        },
        missed: 'Anh Định: Trưa nay ba anh Lộc kẹt thang máy cãi nhau: một anh đòi camera, một anh đòi hóa đơn, một anh đòi chạy quảng cáo.',
      },
      {
        gap: 1, place: 'quannhau', from: '18:30', to: '22:30', task: 'Quán nhậu: chị Diệp đối chiếu sổ nợ',
        scene: {
          lines: [
            ['nar', 'Chị Diệp bên Cân Đối tới với bốn cây bút màu và gương mặt mùa kiểm toán.'],
            ['audit:diep', 'Đỏ là món nhậu, xanh là nước, cam là đá, tím là "ghi sổ". Cho em 15 phút.'],
            ['nar', '15 phút sau, cuốn sổ đầy tick-mark như tranh trừu tượng.'],
            ['audit:diep', 'Kết luận: 1.840.000đ là bàn chung tối thứ Sáu của cả ba anh. Anh Lộc nào cũng tưởng anh Lộc kia trả.'],
            ['tech:loc', 'Vậy là... lỗi đồng bộ.'],
            ['agency:loc', 'Vậy là... chiến dịch chung.'],
            ['audit:loc', 'Vậy là có chứng từ. Anh chấp nhận.'],
          ],
          choices: [
            { t: '(Cân Đối) Soát lại sổ, xác nhận tick-mark', role: 'audit', fx: { mood: 3, hearts: { 'audit:diep': 2, 'audit:loc': 1 } },
              say: [['audit:diep', 'Em soát giỏi đó. Mùa kiểm toán chị gọi em.']] },
            { t: 'Đề xuất "Hội Lộc": mỗi tháng nhậu chung, chia đều', fx: { hearts: { 'tech:loc': 1, 'agency:loc': 1, 'audit:loc': 1, 'kp:ly': 1 }, flag: 'd04_hoiloc' },
              say: [['kp:ly', 'Hội Lộc! Bàn số 5, đặt trước, ghi số điện thoại.']] },
            { t: 'Xin chị Ly xóa nợ cho vui', fx: { hearts: { 'kp:ly': -2, 'tech:loc': 2, 'agency:loc': 2, 'audit:loc': 2 } },
              say: [['kp:ly', 'Xóa thì em trả hả em?'], ['nar', 'Chị Ly không xóa. Nhưng chị cười.']] },
          ],
        },
        missed: 'Chị Diệp: Đối chiếu xong: 1.840.000đ là bàn chung tối thứ Sáu của cả ba anh Lộc. Tick-mark 4 màu, khỏi cãi.',
      },
    ],
    end: 'Biên bản khu phố: Quán nhậu đổi luật ghi sổ: tên phải kèm số điện thoại. Ba anh Lộc lập "Hội Lộc", nhậu chung mỗi tháng.',
  },

  // ───────────────────────────── Drama 5 ─────────────────────────────
  {
    id: 'd05', no: 5, title: 'Vợ chồng bí mật lộ ở quán nhậu', who: ['agency:kieu', 'agency:loc', 'kp:ly', 'agency:suong'],
    minDay: 22, needFlag: 'd04_done',
    acts: [
      {
        gap: 0, place: 'quannhau', from: '18:30', to: '22:00', task: 'Quán nhậu: chị Kiều hỏi nợ của "chồng chị"',
        scene: {
          lines: [
            ['nar', 'Ít hôm sau vụ ba anh Lộc. Chị Kiều bên Trend Trễ bước vào, đi thẳng tới quầy.'],
            ['agency:kieu', 'Chị Ly ơi, nợ của chồng chị bao nhiêu em? Anh Lộc Trend Trễ đó.'],
            ['kp:ly', 'Chồng... chị? Anh Lộc "CPM đang cao" là chồng chị hả?'],
            ['nar', 'Bàn bên cạnh, Sương đang ăn ốc. Cây tăm khựng giữa không trung.'],
            ['agency:suong', '...'],
            ['agency:kieu', 'Nói nhỏ thôi em. Công ty không ai biết. Sạch, chị check rồi.'],
          ],
          choices: [
            { t: 'Nói nhỏ: "Để em ghi sổ riêng cho chị"', fx: { hearts: { 'agency:kieu': 2, 'kp:ly': 1 }, flag: 'd05_giu' },
              say: [['agency:kieu', 'Em hiểu chuyện ghê. Chị trả đủ phần ảnh, cộng tiền tip.']] },
            { t: 'Đọc to số nợ cho rõ ràng', fx: { mood: 2, hearts: { 'agency:kieu': -1 } },
              say: [['nar', '"Sáu trăm mười ba nghìn ba trăm ba mươi ba đồng!" Sương ghi âm được trọn câu.']] },
            { t: '(Trend Trễ) Qua bàn Sương, nói chuyện khác cho Sương quên', role: 'agency', fx: { hearts: { 'agency:suong': 1, 'agency:kieu': 2 }, flag: 'd05_giu' },
              say: [['agency:suong', 'Ơ, bạn cũng ăn ốc hả? Ốc ngon ha...'], ['nar', 'Sương quên được đúng 11 phút.']] },
          ],
        },
        missed: 'Tèo: Chị Kiều tới hỏi "nợ của chồng chị bao nhiêu". Chồng là anh Lộc Trend Trễ. Sương ngồi bàn bên, nghe hết.',
      },
      {
        gap: 1, place: 'agency', from: '10:00', to: '13:00', task: 'Trend Trễ: nhóm chat công ty nổ tung',
        scene: {
          lines: [
            ['nar', 'Loft Trend Trễ sáng nay. Nhóm chat công ty có 312 tin chưa đọc. Tin đầu tiên gửi 11 phút sau vụ ở quán nhậu.'],
            ['agency:suong', 'Em thề em chỉ nhắn một câu "mọi người ơi". Phần còn lại là mọi người tự đoán.'],
            ['agency:tung', 'Chuyện này hay. Make it pop.'],
            ['agency:loc', 'Anh Tùng, đây là đời tư của em, không phải chiến dịch.'],
            ['agency:tung', 'Đời tư cũng là nội dung. Mà thôi, chúc mừng hai đứa.'],
            ['agency:kieu', '{ten}, tối qua em có mặt ở quán. Em nói một câu công bằng giùm chị.'],
          ],
          choices: [
            { t: '(Trend Trễ) Tổ chức "tiệc mừng cưới muộn" ở văn phòng', role: 'agency', fx: { money: -30000, hearts: { 'agency:kieu': 2, 'agency:loc': 2, 'agency:tung': 1 }, flag: 'd05_tiec' },
              say: [['agency:tung', 'Duyệt! Bánh kem có logo công ty nha.'], ['agency:kieu', 'Chị cảm động thiệt sự.']] },
            { t: '"Chuyện của anh chị, mọi người đừng đoán nữa"', fx: { hearts: { 'agency:kieu': 1, 'agency:loc': 1, 'agency:suong': -1 } },
              say: [['agency:suong', 'Dạ em xóa tin "mọi người ơi" rồi. Nhưng đã có 40 người chụp màn hình.']] },
            { t: 'Im lặng, uống cà phê', fx: { mood: 1 },
              say: [['nar', 'Bạn im lặng. Nhóm chat thì không.']] },
          ],
        },
        missed: 'Sương: Nhóm chat Trend Trễ nổ 312 tin vì chuyện chị Kiều với anh Lộc. Anh Tùng chỉ nhắn đúng ba chữ: "make it pop".',
      },
      {
        gap: 2, place: 'agency', from: '09:00', to: '11:30', task: 'Trend Trễ: hai người tới công ty chung một xe',
        scene: {
          lines: [
            ['nar', 'Sáng nay, lần đầu tiên, chị Kiều và anh Lộc tới công ty chung một chiếc xe.'],
            ['agency:loc', 'Từ nay khỏi đậu xe cách nhau hai con hẻm nữa.'],
            ['agency:kieu', 'Khỏi giả bộ gặp nhau trong thang máy rồi chào "anh Lộc", "chị Kiều" nữa.'],
            ['agency:suong', 'Em xin lỗi anh chị. Em làm fanpage nên tay nó tự đăng.'],
            ['agency:kieu', 'Thôi, công khai cũng nhẹ người. Mà lần sau em hỏi trước nha.'],
            ['agency:tung', 'Ok mọi người, vô họp. Cặp đôi ngồi chung luôn cho tiện.'],
          ],
          choices: [
            { t: 'Chúc mừng hai anh chị', fx: { mood: 3, hearts: { 'agency:kieu': 1, 'agency:loc': 1 } },
              say: [['agency:loc', 'Cảm ơn em. Tối thứ Sáu Hội Lộc, vợ anh đi chung.']] },
            { t: 'An ủi Sương một câu', fx: { hearts: { 'agency:suong': 2 } },
              say: [['agency:suong', 'Cảm ơn bạn. Từ nay em hỏi trước rồi mới "mọi người ơi".']] },
            { t: '(Trend Trễ) Đề xuất nội dung "Cặp đôi văn phòng", có xin phép', role: 'agency', fx: { hearts: { 'agency:tung': 2, 'agency:kieu': 1 }, flag: 'd05_noidung' },
              say: [['agency:tung', 'Có xin phép! Đúng là thực tập sinh của tui. Make it pop, mà pop có đạo đức.']] },
          ],
        },
        missed: 'Bà Phấn: Sáng nay chị Kiều với anh Lộc đi chung một xe tới Trend Trễ. Hết giấu rồi cả nhà.',
      },
    ],
    end: 'Biên bản khu phố: Quán nhậu có "bàn đặt trước của vợ chồng giấu kín". Giờ hết kín, nhưng vẫn đặt trước.',
  },

  // ───────────────────────────── Drama 6 ─────────────────────────────
  {
    id: 'd06', no: 6, title: 'Trốn học đi net',
    who: ['kp:tom', 'kp:mit', 'kp:hao', 'kp:phao', 'kp:hoai', 'kp:thuan', 'kp:manh', 'kp:ly', 'kp:nhung', 'kp:tinh', 'kp:phan'],
    minDay: 5, startOn: [1, 2, 3, 4],
    acts: [
      {
        gap: 0, place: 'net', from: '08:30', to: '10:00', task: 'Net Không Lag: hai học sinh "trường nghỉ"',
        scene: {
          lines: [
            ['nar', 'Giữa buổi sáng, Net Không Lag. Tôm và Mít bước vào, cặp còn đeo sau lưng.'],
            ['kp:tom', 'Anh Pháo, nạp cho em hai tiếng. Hôm nay trường nghỉ.'],
            ['kp:phao', 'Trường nghỉ mà mặc đồng phục chi vậy em?'],
            ['kp:mit', 'Dạ... cho quen.'],
            ['kp:hao', 'Pháo, hỏi tuổi đi em. Giờ này là giờ học.'],
            ['kp:phao', 'Tài khoản dưới 18 tuổi bị nhà phát hành giới hạn 60 phút mỗi game, 180 phút mỗi ngày (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:tom', 'Tối qua em thua trận xếp hạng. Em phải gỡ!'],
          ],
          choices: [
            { t: 'Khuyên anh Hào từ chối, mời hai đứa về trường', fx: { hearts: { 'kp:hao': 1, 'kp:tom': -1, 'kp:mit': -1 }, flag: 'd06_tuchoi' },
              say: [['kp:hao', 'Đúng. Mất hai tiếng tiền máy, mà giữ được uy tín quán.'], ['nar', 'Tôm và Mít ngồi lì ở ghế chờ cạnh cửa kính, chưa chịu về.']] },
            { t: 'Lén nhắn cô Hoài, chủ nhiệm 9A', fx: { hearts: { 'kp:hoai': 1, 'kp:hao': 1 }, flag: 'd06_goitruong' },
              say: [['kp:hoai', '(tin nhắn) Cảm ơn em. Cô điểm danh xong tiết này là đi liền.']] },
            { t: '"Thôi anh Hào, cho tụi nhỏ chơi chút"', fx: { hearts: { 'kp:tom': 1, 'kp:hao': -1 }, flag: 'd06_imlang' },
              say: [['kp:tom', 'Đỉnh!'], ['nar', 'Pháo nạp giờ, mặt rất không yên tâm.']] },
            { t: '(Trà sữa) Mít gọi giao trà sữa tới net: từ chối giao giờ học', role: 'trasua', fx: { hearts: { 'kp:nhung': 2, 'kp:mit': -1 } },
              say: [['kp:nhung', 'Đúng rồi em. Mà khoan, Mít đặt hả? Giờ này Mít phải ở trường mà!']] },
          ],
        },
        missed: 'Pháo: Sáng nay Tôm với Mít tới quán nói "trường nghỉ", mặc nguyên đồng phục. Anh Hào đang hỏi tuổi.',
      },
      {
        gap: 0, place: 'truong_th', from: '10:00', to: '11:30', task: 'Trường THCS: cô Hoài điểm danh thiếu hai em',
        scene: {
          lines: [
            ['kp:hoai', 'Tiết 3 lớp 9A thiếu Tôm. Bên lớp 7 báo thiếu Mít. Tuần sau thi học kỳ rồi đó!'],
            ['kp:tinh', 'Sau giờ ra chơi tui thấy thằng Tôm leo rào sau. Tui la thì nó chạy nhanh hơn tui la.'],
            ['kp:hoai', 'Cô nhắn phụ huynh rồi. Chị Nhung trả lời liền, còn anh Mạnh chưa xem.'],
            ['kp:ly', '(tin nhắn) Cô ơi, ổng bán quán tới khuya, giờ đang ngủ. Em đang ở chợ, em về liền.'],
            ['kp:hoai', '{ten}, em đi ngang khu này, em có thấy hai đứa không?'],
          ],
          choices: [
            { t: '"Em thấy ở Net Không Lag cô ơi, em dẫn cô đi"', fx: { hearts: { 'kp:hoai': 2, 'kp:tinh': 1 }, flag: 'd06_dantim' },
              say: [['kp:hoai', 'Đi! Cô mang theo đề cương luôn.']] },
            { t: 'Chạy qua gõ cửa đánh thức anh Mạnh', fx: { energy: -3, hearts: { 'kp:manh': 1, 'kp:ly': 1 } },
              say: [['kp:manh', 'Hả? Cái gì? Thằng Tôm? Net? Để anh rửa mặt đã.']] },
            { t: 'Đề xuất thầy Kiệt mở câu lạc bộ game sau giờ học', fx: { hearts: { 'kp:kiet': 2, 'kp:hoai': 1 }, flag: 'd06_clb' },
              say: [['kp:kiet', 'Có giờ giấc, học trước chơi sau. Em ủng hộ! Em từng là tuyển thủ mà.']] },
          ],
        },
        missed: 'Cô Hoài: Tiết 3 lớp 9A thiếu Tôm, lớp 7 thiếu Mít. Cô đã nhắn phụ huynh. Anh Mạnh chưa xem tin vì đang ngủ.',
      },
      {
        gap: 0, place: 'net', from: '11:30', to: '13:30', task: 'Net Không Lag: bà Phấn chụp hình, anh Thuận ghé',
        scene: {
          lines: [
            ['nar', 'Bà Phấn đi chợ về, thấy Tôm và Mít qua cửa kính Net Không Lag. Tách! Ảnh lên Xóm Ơi trước khi bà kịp xách giỏ.'],
            ['kp:phan', 'Ai là phụ huynh hai đứa này? Giờ học mà ở quán net nha!'],
            ['kp:thuan', '(đi tuần ghé vô) Anh Hào, giờ này học sinh ở đây là sao?'],
            ['kp:thuan', 'Quán không hoạt động từ 22h tới 8h, còn giờ học thì phường nhắc chủ quán không để học sinh vô chơi (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:hao', 'Dạ em biết. Em đang... đang khuyên tụi nhỏ về.'],
            ['kp:tom', 'Chú Thuận... con xin lỗi. Tại tối qua con thua.'],
            ['kp:thuan', 'Thua thì tập. Trốn học thì không phải là tập.'],
          ],
          choices: [
            { t: 'Dẫn Tôm và Mít về trường', fx: { energy: -3, hearts: { 'kp:hoai': 1, 'kp:thuan': 1, 'kp:tom': 1 } },
              say: [['kp:mit', 'Dạ đi. Mà con chưa ăn trưa.'], ['nar', 'Bạn mua hai ổ bánh mì dọc đường. Ăn xong mới học, học xong mới chơi.']] },
            { t: 'Nói chuyện với Tôm như người lớn', fx: { hearts: { 'kp:tom': 2 }, flag: 'd06_noichuyen' },
              say: [['kp:tom', 'Em biết sai. Em sợ thi rớt, chơi game thì quên sợ.'], ['me', 'Sợ thì mình ôn chung. Game thì để tối, có giờ.']] },
            { t: 'Nhận phần báo phụ huynh', fx: { hearts: { 'kp:thuan': 1, 'kp:ly': 1 } },
              say: [['kp:thuan', 'Được. Anh Hào, lần này nhắc nhở. Lần sau lập biên bản.'], ['kp:hao', 'Dạ. Em dán nội quy liền.']] },
            { t: 'Nhận là hồi sáng mình bảo "cho chơi chút"', needFlag: 'd06_imlang', fx: { mood: -3, hearts: { 'kp:thuan': -1, 'kp:hao': -1 } },
              say: [['kp:thuan', 'Thành thật là tốt. Mà lần sau đừng "chút" nữa nha.']] },
          ],
        },
        missed: 'Bà Phấn: [ảnh] Tôm với Mít ở Net Không Lag giờ học! Anh Thuận đi tuần ghé quán rồi. Phụ huynh đâu?',
      },
      {
        gap: 1, place: 'truong_th', from: '14:00', to: '16:30', task: 'Trường học: họp ba bên vụ net',
        scene: {
          lines: [
            ['nar', 'Phòng họp Trường THCS Tâm Mỹ. Một bên nhà trường, một bên phụ huynh, một bên anh Hào ôm tờ nội quy.'],
            ['kp:hoai', 'Tuần sau thi học kỳ. Cô không muốn phạt, cô muốn hai em học.'],
            ['kp:manh', 'Tại anh ngủ. Quán bán tới khuya, sáng con đi đâu anh không hay.'],
            ['kp:nhung', 'Còn Mít, từ nay tan học về nhà làm bài xong mới được qua quán.'],
            ['kp:hao', 'Quán em dán nội quy: "Học sinh: sau 16h30". Đứa nào trốn học ghé, em gọi cô liền.'],
            ['kp:tom', 'Con hứa ôn thi đàng hoàng. Mà... tối có được chơi một tiếng không?'],
            ['kp:hoai', '{ten}, em chứng kiến từ đầu. Em đề xuất gì?'],
          ],
          choices: [
            { t: 'Lập câu lạc bộ game sau giờ học, thầy Kiệt phụ trách', fx: { hearts: { 'kp:kiet': 2, 'kp:tom': 2, 'kp:mit': 1, 'kp:hoai': 1 }, flag: 'd06_clblap', xomoi: 'Cô Hoài: Trường mở câu lạc bộ game sau giờ học, có giờ giấc, học trước chơi sau. Thầy Kiệt phụ trách.' },
              say: [['kp:kiet', 'Chiều thứ Sáu. Ai nợ bài thì giải bài trước, rồi mới vô trận.']] },
            { t: 'Lập lịch ôn thi ở góc học nhóm trà sữa', fx: { hearts: { 'kp:nhung': 1, 'kp:tom': 1, 'kp:hoai': 2 } },
              say: [['kp:nhung', 'Chị chừa góc trong cho tụi nhỏ. Nước lọc miễn phí, trà sữa thì học xong mới có.']] },
            { t: '"Một tiếng game buổi tối, sau khi học bài"', fx: { hearts: { 'kp:tom': 1, 'kp:manh': 1, 'kp:ly': 1 } },
              say: [['kp:ly', 'Một tiếng. Mẹ bấm giờ.'], ['kp:tom', 'Dạ! Con chăm học!']] },
          ],
        },
        missed: 'Cô Hoài: Họp ba bên xong. Tôm và Mít hứa ôn thi, quán net dán nội quy "Học sinh: sau 16h30".',
      },
    ],
    end: 'Biên bản khu phố: Vụ net giờ học. Net Không Lag dán nội quy "Học sinh: sau 16h30". Tôm và Mít học trước, chơi sau.',
  },

  // ───────────────────────────── Drama 7 ─────────────────────────────
  {
    id: 'd07', no: 7, title: 'Biệt đội khô gà',
    who: ['kp:cua', 'kp:bap', 'kp:dau', 'bama:tu', 'bama:bay', 'bama:hang', 'bama:hung', 'kp:lam', 'kp:thuan', 'kp:su'],
    minDay: 2,
    acts: [
      {
        gap: 0, place: 'bama', from: '16:00', to: '18:00', task: 'Ba & Má: giàn phơi hụt 3 bịch khô gà',
        scene: {
          lines: [
            ['nar', 'Sân sau Ba & Má. Mẻ khô gà lá chanh mới lên giàn, bảng ghi: "GIÀN PHƠI · đừng ăn vụng".'],
            ['bama:tu', 'Hụt ba bịch! Tui đếm bằng mắt, tui đếm bằng mũi, đều hụt ba bịch!'],
            ['nar', 'Ngoài rào, ba cái đầu nhỏ thụt xuống. Một cái đầu còn dính lá chanh.'],
            ['kp:cua', '(thì thầm) Bắp, rút. Đậu, ngụy trang.'],
            ['kp:dau', 'Con là bụi cây. Con là bụi cây.'],
            ['bama:tu', 'Được. Tui dựng bù nhìn. Đội nón lá. Coi đứa nào dám.'],
          ],
          choices: [
            { t: 'Phụ Cô Tư dựng bù nhìn đội nón lá', fx: { energy: -3, hearts: { 'bama:tu': 2, 'kp:cua': -1 } },
              say: [['bama:tu', 'Đẹp! Giống ông nhà tui hồi trẻ.'], ['kp:cua', 'Bù nhìn thôi mà. Tụi con không sợ... lắm.']] },
            { t: 'Mách Cô Tư: "Bụi cây kia biết nói kìa cô"', fx: { hearts: { 'bama:tu': 1, 'kp:dau': -1 } },
              say: [['bama:tu', 'Đậu! Cô Tư biết rồi nha!'], ['kp:dau', 'Bụi cây rút lui!']] },
            { t: 'Dạy tụi nhỏ dành tiền tiêu vặt mua đàng hoàng', fx: { hearts: { 'kp:cua': 1, 'kp:bap': 1, 'kp:dau': 1, 'kp:su': 1 }, flag: 'd07_tieuvat' },
              say: [['kp:su', 'Con mua đàng hoàng nè, con còn ghi sổ chi tiêu.'], ['kp:cua', 'Su là gián điệp phe người lớn!']] },
            { t: '(Ba & Má) Canh giàn tới tối', role: 'bama', fx: { energy: -5, hearts: { 'bama:tu': 2, 'bama:hang': 1 } },
              say: [['bama:tu', 'Thực tập sinh này canh giỏi hơn camera.']] },
          ],
        },
        missed: 'Cô Tư: Giàn phơi hụt ba bịch khô gà lá chanh. Tui dựng bù nhìn đội nón lá rồi. Đứa nào ăn thì tự thú đi.',
      },
      {
        gap: 1, place: 'bagac', from: '16:30', to: '18:00', task: 'Xe ba gác: Bắp trốn sau thùng xe',
        scene: {
          lines: [
            ['nar', 'Bắp, phó biệt đội, chạy nhanh nhất khu phố, đang trốn sau mấy thùng khô trên xe ba gác.'],
            ['bama:bay', 'Ủa sao thùng khô này có tiếng thở?'],
            ['kp:bap', 'Dạ... thùng khô biết thở.'],
            ['bama:bay', 'Thùng khô biết thở thì chú chở về nhà cho má nó coi. Ngồi chắc vô, đội nón vô.'],
            ['nar', 'Chú Bảy chạy ba gác chở Bắp về tận nhà, chậm rãi, bấm còi chào cả hẻm.'],
            ['kp:bap', 'Lần đầu con được đi ba gác. Vui quá trời mà con đang bị bắt.'],
          ],
          choices: [
            { t: 'Đi bộ theo xe, chào mẹ Bắp giùm', fx: { energy: -2, hearts: { 'bama:bay': 1, 'kp:bap': 1 } },
              say: [['bama:bay', 'Con đi chung cho có nhân chứng.']] },
            { t: 'Mua cho Bắp một bịch khô ráo, dặn lần sau mua chứ đừng lấy', fx: { money: -10000, hearts: { 'kp:bap': 2, 'bama:tu': -1 } },
              say: [['kp:bap', 'Con cảm ơn! Con để dành tiền mua bịch sau.']] },
            { t: 'Báo Cô Tư bắt được "thùng khô biết thở"', fx: { hearts: { 'bama:tu': 1, 'kp:bap': -1 } },
              say: [['bama:tu', 'Ghi sổ: Bắp, một lần, thùng xe ba gác.']] },
          ],
        },
        missed: 'Chú Bảy: Hôm nay thùng khô trên xe ba gác biết thở. Mở ra là thằng Bắp. Chú chở nó về tận nhà rồi.',
      },
      {
        gap: 1, place: 'tramyte', from: '16:00', to: '17:30', task: 'Trạm y tế: Cua đau bụng vì khô chưa ráo',
        scene: {
          lines: [
            ['nar', 'Trạm y tế phường. Cua, thủ lĩnh biệt đội, ôm bụng ngồi băng ghế. Mặt anh hùng, bụng thì không.'],
            ['kp:lam', 'Ăn khô chưa ráo phải không? Khô phơi chưa đủ nắng thì bụng con phơi giùm.'],
            ['kp:cua', 'Dạ... con chỉ nếm một miếng. Ba miếng. Một bịch.'],
            ['bama:hang', 'Cô gọi phụ huynh rồi. Ủa... phụ huynh là công an khu vực hả?'],
            ['kp:thuan', 'Chào bác sĩ, chào chị Hằng. Tôi tới với tư cách... ba của Cua.'],
            ['kp:lam', 'Học sinh có thẻ BHYT hỗ trợ nên khám không lo tiền (thông tin giải trí, không phải tư vấn pháp lý). Uống men tiêu hóa, ăn cháo, mai đi học.'],
          ],
          choices: [
            { t: 'Dặn Cua chỉ ăn khô đã ráo, và mua đàng hoàng', fx: { hearts: { 'kp:lam': 1, 'kp:cua': 1, 'kp:thuan': 1 } },
              say: [['kp:cua', 'Dạ. Biệt đội sẽ chuyển sang... mua hàng.']] },
            { t: 'Mua giùm Cua hộp cháo', fx: { money: -20000, hearts: { 'kp:cua': 2, 'kp:thuan': 1 } },
              say: [['kp:thuan', 'Cảm ơn em. Về nhà chú "lập biên bản" thằng nhỏ bằng một bài giảng.']] },
            { t: 'Gợi ý cô Hằng ra "gói học sinh" cho tụi nhỏ mua', fx: { hearts: { 'bama:hang': 2 }, flag: 'd07_goi' },
              say: [['bama:hang', 'Gói nhỏ, khô ráo, giá vừa tiền tiêu vặt. Ý hay, mai họp.']] },
          ],
        },
        missed: 'Chị Thủy: Cua đau bụng vì ăn khô chưa ráo, bác sĩ Lâm khám rồi, không sao. Phụ huynh tới đón là anh Thuận công an.',
      },
      {
        gap: 1, place: 'bama', from: '09:00', to: '11:30', task: 'Ba & Má họp: ra "gói học sinh"',
        scene: {
          lines: [
            ['nar', 'Phòng họp Ba & Má, kiêm phòng khách, kiêm kho khô.'],
            ['bama:hung', 'Tụi nhỏ mê khô nhà mình tới mức trèo rào. Đó là lời khen, chỉ là lời khen hơi tốn khô.'],
            ['bama:hang', 'Má đề xuất gói học sinh: gói nhỏ, khô đã ráo, bán ở cửa sổ sân sau, không bán ngay cổng trường.'],
            ['bama:tu', 'Bán cũng được. Nhưng giàn phơi tui vẫn canh. Thằng Cua là đối thủ xứng tầm.'],
            ['bama:bay', 'Gửi thêm ở tạp hóa cô Sáu, chú chở cho.'],
            ['bama:hang', '{ten}, con thấy gói bao nhiêu tiền thì vừa tiền tiêu vặt?'],
          ],
          choices: [
            { t: '5.000đ: rẻ, tụi nhỏ mua được mỗi ngày', fx: { hearts: { 'kp:cua': 1, 'kp:bap': 1, 'kp:dau': 1, 'bama:hang': -1 }, flag: 'd07_gia5' },
              say: [['bama:hang', 'Rẻ quá thì mỏng lời, mà thôi, gói nhỏ xíu là được.']] },
            { t: '10.000đ: vừa túi, vừa vốn', fx: { hearts: { 'bama:hang': 2, 'kp:su': 1 }, flag: 'd07_gia10' },
              say: [['kp:su', '10 nghìn, con ghi sổ được. Hợp lý.'], ['bama:hang', 'Chốt!']] },
            { t: '15.000đ: khô ngon phải có giá', fx: { hearts: { 'bama:hung': 1, 'kp:cua': -1 }, flag: 'd07_gia15' },
              say: [['kp:cua', '15 nghìn? Vậy là trèo rào vẫn rẻ hơn!'], ['bama:tu', 'Thấy chưa, tui canh tiếp.']] },
            { t: '(Ba & Má) Vừa bán gói học sinh vừa canh giàn', role: 'bama', fx: { money: 50000, hearts: { 'bama:tu': 1, 'bama:hang': 1 }, flag: 'd07_cahai' },
              say: [['bama:tu', '16h45 canh, 17h bán. Thực tập sinh làm hai ca một lúc.']] },
          ],
        },
        missed: 'Cô Hằng: Ba & Má chính thức ra "gói học sinh" khô gà, bán ở cửa sổ sân sau. Cô Tư vẫn canh giàn.',
      },
    ],
    end: 'Biên bản khu phố: Vụ bù nhìn đội nón lá. Ba & Má có "gói học sinh", Cua và Cô Tư thành cặp "kình mà thân".',
  },

  // ───────────────────────────── Drama 8 ─────────────────────────────
  {
    id: 'd08', no: 8, title: 'Con nuôi của Chú Bảy', who: ['kp:thong', 'bama:bay', 'kp:thinh', 'kp:lai', 'kp:thuan'],
    minDay: 8,
    acts: [
      {
        gap: 0, place: 'comtam', from: '17:00', to: '20:30', task: 'Cơm tấm: Thông cầm tờ giấy hỏi cả khu',
        scene: {
          lines: [
            ['nar', 'Cơm Tấm Cô Lài, giờ cơm chiều. Thông không nướng sườn. Thông cầm một tờ giấy, nhìn nó như nhìn sườn khét.'],
            ['kp:thong', 'Con xin làm bếp chính, cần bản sao giấy tờ. Trong đó ghi "cha nuôi". Là Chú Bảy ba gác hả cô?'],
            ['kp:lai', 'Ờ... thì...'],
            ['kp:thuan', '(đang ăn) Ờ... thì...'],
            ['kp:thong', 'Sao ai cũng "ờ thì"? Cả khu biết hết hả? Chỉ con không biết?'],
            ['kp:lai', 'Con ăn miếng cơm đã. Chuyện dài lắm, ai kể cũng khóc nên không ai kể.'],
          ],
          choices: [
            { t: '"Anh hỏi thẳng Chú Bảy đi"', fx: { hearts: { 'kp:thong': 1 } },
              say: [['kp:thong', 'Tui sợ. Hỏi chú cái gì chú cũng nói "để chú chở".']] },
            { t: '"Anh Thịnh đầu mối biết rõ nhất đó"', fx: { hearts: { 'kp:thong': 1, 'kp:lai': 1 }, flag: 'd08_thinh' },
              say: [['kp:lai', 'Đúng. Mai sáng sớm con lên đầu mối hỏi thằng Thịnh.']] },
            { t: 'Gọi một dĩa sườn, ngồi nghe', fx: { money: -35000, food: 15 },
              say: [['kp:lai', 'Sườn hôm nay cô nướng. Thông đang không có tâm trạng.']] },
          ],
        },
        missed: 'Cô Lài: Thông đọc giấy tờ, thấy dòng "cha nuôi". Cả khu biết, chỉ Thông không. Tối nay sườn cô nướng, hơi khét.',
      },
      {
        gap: 1, place: 'daumoi', from: '05:30', to: '09:30', task: 'Đầu mối: anh Thịnh kể chuyện 26 năm trước',
        scene: {
          lines: [
            ['nar', 'Đầu mối Thuận Phát, trời vừa sáng. Xe tải đổ hàng, anh Thịnh ngồi trên thùng cà chua.'],
            ['kp:thinh', '26 năm trước, ba anh nhặt được một em bé trong thùng xốp ở đầu mối. Trên thùng ghi "HÀNG DỄ VỠ".'],
            ['kp:thinh', 'Em bé khóc to hơn còi xe tải. Chú Bảy đứng đó, bế lên, nói: "Để tui nuôi. Tui chở được."'],
            ['kp:thong', '...Là em hả anh?'],
            ['kp:thinh', 'Là em. Chú không kể vì sợ em buồn. Chú nói đợi em lớn. Em 26 tuổi rồi mà chú vẫn đợi.'],
            ['nar', 'Thông nhìn mấy chồng thùng xốp, không nói gì.'],
          ],
          choices: [
            { t: 'Đi tìm lại cái thùng xốp cũ trong kho', fx: { energy: -5, hearts: { 'kp:thinh': 2, 'kp:thong': 1 }, flag: 'd08_thung' },
              say: [['kp:thinh', 'Còn thiệt! Ba anh giữ, ghi "đừng bỏ". Chữ "HÀNG DỄ VỠ" vẫn còn nguyên.']] },
            { t: 'Đứng cạnh Thông, không nói gì', fx: { hearts: { 'kp:thong': 2 } },
              say: [['kp:thong', 'Cảm ơn. Có người đứng cạnh là được rồi.']] },
            { t: 'Nhắn Chú Bảy: "Thông biết rồi chú"', fx: { hearts: { 'bama:bay': 2 }, flag: 'd08_baochu' },
              say: [['bama:bay', '(tin nhắn) Ừ. Chú biết thế nào cũng có ngày này. Để chú tính.']] },
          ],
        },
        missed: 'Anh Thịnh: Tui kể cho Thông rồi. 26 năm trước, thùng xốp "HÀNG DỄ VỠ", Chú Bảy bế về nuôi. Thông im cả buổi.',
      },
      {
        gap: 1, place: 'comtam', from: '17:00', to: '21:00', task: 'Cơm tấm: Thông nghỉ nướng, sườn khét',
        scene: {
          lines: [
            ['nar', 'Ngày thứ hai Thông nghỉ nướng. Cả hẻm 7 thơm mùi... than.'],
            ['kp:lai', 'Cô nướng thì quên nước mắm, cô canh nước mắm thì quên sườn. Một người không làm nổi hai người.'],
            ['kp:thuan', 'Cô Lài ơi, sườn hôm nay giòn kiểu... tro.'],
            ['kp:lai', 'Ăn đi, coi như ủng hộ tinh thần.'],
            ['kp:lai', '{ten}, con phụ cô một tay được không?'],
          ],
          choices: [
            { t: 'Đứng thay bếp nướng sườn', fx: { energy: -6, money: 40000, hearts: { 'kp:lai': 2 } },
              say: [['nar', 'Bạn nướng. Ba miếng đẹp, hai miếng khét. Cô Lài nói "vậy là giỏi hơn cô".']] },
            { t: 'Đi tìm Thông, khuyên anh quay lại', fx: { hearts: { 'kp:thong': 2, 'kp:lai': 1 }, flag: 'd08_khuyen' },
              say: [['kp:thong', 'Tui không giận chú. Tui giận vì hỏi "sao con không giống chú" thì chú nói "tại con đẹp trai".']] },
            { t: 'Báo Chú Bảy: "Thông nghỉ hai ngày rồi chú"', fx: { hearts: { 'bama:bay': 1 }, flag: 'd08_baochu' },
              say: [['bama:bay', 'Ừ. Mai 3 giờ sáng chú chở nó đi một chỗ.']] },
          ],
        },
        missed: 'Bà Phấn: Thông nghỉ nướng hai ngày, cơm tấm Cô Lài khét cả hẻm. Ai thương Thông thì nhắn một câu.',
      },
      {
        gap: 1, place: 'daumoi', from: '05:30', to: '08:30', task: 'Đầu mối lúc rạng sáng: Chú Bảy và Thông',
        scene: {
          lines: [
            ['nar', 'Chú Bảy chở Thông bằng ba gác lên đầu mối từ 3h sáng. Trời hửng rồi, hai chú cháu vẫn đứng đó.'],
            ['bama:bay', 'Chỗ này nè. Hồi đó là một đống thùng xốp. Con nằm trong cái thứ ba, khóc to hơn xe tải.'],
            ['kp:thong', 'Sao chú không kể?'],
            ['bama:bay', 'Chú định kể năm con 10 tuổi. Rồi 15. Rồi 20. Năm nào cũng "năm sau". Chú chở hàng giỏi, chở lời thì dở.'],
            ['kp:thong', 'Ba.'],
            ['nar', 'Chú Bảy quay đi, nói khói xe tải làm cay mắt. Không có chiếc xe tải nào đang nổ máy.'],
          ],
          choices: [
            { t: 'Đưa hai người cái thùng xốp "HÀNG DỄ VỠ"', needFlag: 'd08_thung', fx: { mood: 6, hearts: { 'bama:bay': 3, 'kp:thong': 3 } },
              say: [['bama:bay', 'Trời đất, còn giữ hả? Đem về, để trên ba gác. Hàng dễ vỡ, chở nhẹ thôi.']] },
            { t: 'Rủ hai người về ăn cơm tấm', fx: { hearts: { 'bama:bay': 1, 'kp:thong': 1, 'kp:lai': 1 } },
              say: [['kp:thong', 'Về! Hôm nay tui nướng. Món mới: "sườn Chú Bảy".']] },
            { t: 'Đề nghị Chú Bảy dạy Thông lái ba gác', fx: { hearts: { 'bama:bay': 2, 'kp:thong': 2 }, flag: 'd08_hoclai' },
              say: [['bama:bay', 'Được. 5 giờ sáng mỗi ngày. Con chở giỏi thì chú để ba gác cho... năm sau.']] },
          ],
        },
        missed: 'Chú Bảy: Sáng nay chú chở Thông lên đầu mối, chỉ chỗ cũ. Nó kêu chú là ba. Khói xe tải làm chú cay mắt quá.',
      },
    ],
    end: 'Biên bản khu phố: Thùng xốp "HÀNG DỄ VỠ" được giữ lại. Cơm tấm có món "sườn Chú Bảy", Thông bắt đầu học lái ba gác.',
  },

  // ───────────────────────────── Drama 9 ─────────────────────────────
  // Adapted: Dì Chín (57) and cô Mười (59) could not be little girls in 1996, so they were lost as kids in the
  // 1978 flood and have been fighting over the stall line since 1996 (30 years).
  {
    id: 'd09', no: 9, title: 'Hai chị em thất lạc ở chợ', who: ['kp:chin', 'kp:muoi', 'kp:man', 'bama:cosau', 'kp:cuong'],
    minDay: 25,
    acts: [
      {
        gap: 0, place: 'cho', from: '06:00', to: '10:00', task: 'Có biến ở chợ: rau đè lên đá cá',
        scene: {
          lines: [
            ['nar', 'Chợ Tâm Mỹ. Từ năm 1996, hai sạp sát vách, một đường ranh không ai thấy ngoài hai người.'],
            ['kp:muoi', 'Bó rau muống của bà lấn qua đá cá của tui 5 phân!'],
            ['kp:chin', 'Đá cá của bà chảy nước qua rau tui 5 phân trước!'],
            ['kp:muoi', 'Năm phân là năm phân! Ba chục năm cộng lại là một mét rưỡi!'],
            ['kp:cuong', 'Thôi thôi hai chị ơi, sáng sớm người ta đi chợ chứ đâu phải đi coi phim.'],
            ['kp:chin', '{ten}, con đứng đây nãy giờ, con thấy ai lấn?'],
          ],
          choices: [
            { t: 'Lấy phấn kẻ vạch giữa hai sạp', fx: { energy: -2, hearts: { 'kp:cuong': 1 } },
              say: [['kp:chin', 'Kẻ thẳng nha con.'], ['kp:muoi', 'Lệch qua bên tui rồi kìa!']] },
            { t: 'Mua cả rau lẫn cá, về nấu canh chua', fx: { money: -45000, food: 10, hearts: { 'kp:chin': 1, 'kp:muoi': 1 } },
              say: [['kp:muoi', 'Cá này nấu canh chua với rau bà Chín là hết sảy.'], ['kp:chin', '...Ờ, rau tui thì ngon thiệt.']] },
            { t: '"Hai cô cãi giống nhau y chang"', fx: { mood: 2, hearts: { 'kp:chin': -1, 'kp:muoi': -1 }, flag: 'd09_giong' },
              say: [['kp:chin', 'Giống hồi nào!'], ['kp:muoi', 'Giống hồi nào!'], ['nar', 'Cùng lúc. Cùng giọng.']] },
          ],
        },
        missed: 'Cô Sáu: Sáng nay Dì Chín với cô Mười lại cãi vụ 5 phân, rau đè lên đá cá. Chú Cường can không nổi.',
      },
      {
        gap: 1, place: 'cattoc', from: '14:00', to: '17:00', task: 'Tiệm tóc: hai khách cùng một nốt ruồi',
        scene: {
          lines: [
            ['nar', 'Chiều nay chị Mận gội cho Dì Chín, nửa tiếng sau gội cho cô Mười. Không ai biết người kia vừa ngồi ghế này.'],
            ['kp:man', 'Lạ ghê. Hai cô cùng có nốt ruồi sau tai trái, y một chỗ.'],
            ['kp:muoi', '(nhắm mắt, hát khẽ) "Ầu ơ... con cá đi xa, nhớ bến đò xưa..."'],
            ['kp:man', 'Ủa? Hồi nãy Dì Chín cũng hát đúng câu này.'],
            ['kp:muoi', 'Câu này má tui hát hồi nhỏ. Ai mà biết được.'],
            ['kp:man', '{ten}, em thấy không? Chị nổi da gà rồi nè.'],
          ],
          choices: [
            { t: '"Chị kể cho cô Mười nghe đi"', fx: { hearts: { 'kp:man': 1, 'kp:muoi': 1 }, flag: 'd09_ke' },
              say: [['kp:muoi', 'Bà Chín cũng có nốt ruồi đó? Cũng biết câu hát đó?'], ['nar', 'Cô Mười ngồi im rất lâu, tóc còn ướt.']] },
            { t: '"Bí mật khách hàng, chị giữ đi"', fx: { hearts: { 'kp:man': 2 } },
              say: [['kp:man', 'Ừ. Mà chị giữ không lâu đâu. Chị là trạm phát tin số hai mà.']] },
            { t: 'Gợi ý hỏi cô Sáu, người ở chợ lâu nhất', fx: { hearts: { 'bama:cosau': 1 }, flag: 'd09_cosau' },
              say: [['kp:man', 'Đúng, cô Sáu nhớ hết. Cô nhớ cả nợ người ta bằng bút chì.']] },
          ],
        },
        missed: 'Chị Mận: Chiều nay chị gội cho Dì Chín với cô Mười. Hai người cùng nốt ruồi sau tai, cùng một câu hát ru. Chị nổi da gà.',
      },
      {
        gap: 1, place: 'cho', from: '07:00', to: '10:30', task: 'Chợ: cô Sáu nhớ chuyện trận lụt năm xưa',
        scene: {
          lines: [
            ['bama:cosau', 'Trận lụt năm 1978 dưới quê, ở bến đò có hai đứa con gái lạc nhau. Một đứa chín tuổi, một đứa mười một.'],
            ['bama:cosau', 'Một đứa theo ghe rau, một đứa theo ghe cá. Lớn lên mỗi đứa một nghề, ai cũng tưởng đứa kia ở xa lắm.'],
            ['kp:chin', 'Cô Sáu kể chuyện gì kỳ vậy...'],
            ['kp:muoi', 'Năm đó tui... tui cũng lạc ở bến đò. Tui nhớ có đứa em hay giành bánh của tui.'],
            ['kp:chin', 'Tui nhớ có bà chị hay giành bánh của tui!'],
            ['bama:cosau', 'Đó. Ba chục năm giành 5 phân sạp, là vì hồi nhỏ giành bánh chưa xong.'],
          ],
          choices: [
            { t: '"Hai cô có tấm ảnh cũ nào không?"', fx: { hearts: { 'kp:chin': 1, 'kp:muoi': 1 }, flag: 'd09_anh' },
              say: [['kp:chin', 'Có! Nửa tấm ảnh rách, tui giữ trong hộp bánh.'], ['kp:muoi', 'Tui... tui cũng có nửa tấm.']] },
            { t: 'Xóa vạch phấn giữa hai sạp', fx: { energy: -2, hearts: { 'kp:chin': 1, 'kp:muoi': 1, 'bama:cosau': 1 } },
              say: [['nar', 'Không ai cản bạn. Lần đầu tiên trong 30 năm.']] },
            { t: 'Mua đòn bánh tét, chia cho hai cô', fx: { money: -30000, hearts: { 'kp:chin': 2, 'kp:muoi': 2 } },
              say: [['kp:muoi', 'Cắt làm đôi. Bằng nhau nha.'], ['kp:chin', 'Bằng nhau.']] },
          ],
        },
        missed: 'Cô Sáu: Tui kể vụ lụt năm 1978, hai đứa nhỏ lạc nhau ở bến đò. Dì Chín với cô Mười nghe xong nhìn nhau rất lâu.',
      },
      {
        gap: 1, place: 'khupho', from: '07:30', to: '10:30', task: 'Văn phòng khu phố: hai nửa tấm ảnh',
        scene: {
          lines: [
            ['nar', 'Văn phòng Khu phố 7. Chú Cường đặt hai nửa tấm ảnh cũ lên bàn. Ghép lại khít như chưa từng rách.'],
            ['kp:cuong', 'Hai bé gái đứng trước bến đò. Một đứa cầm bó rau, một đứa cầm con cá khô.'],
            ['kp:chin', 'Chị Mười...'],
            ['kp:muoi', 'Em Chín...'],
            ['kp:cuong', 'Chú có nên đọc loa không? Chú muốn đọc lắm.'],
            ['kp:cuong', '{ten}, con quyết giùm chú.'],
          ],
          choices: [
            { t: 'Đọc loa cho cả khu phố mừng', fx: { hearts: { 'kp:cuong': 2, 'kp:chin': 1, 'kp:muoi': 1 }, xomoi: 'Chú Cường: Tin vui khu phố: Dì Chín và cô Mười là hai chị em thất lạc từ năm 1978. Chiều nay chợ mừng!' },
              say: [['kp:cuong', '(vào loa) Alô alô, tin vui của khu phố...'], ['nar', 'Lần này không ai giật micro.']] },
            { t: 'Để hai người tự nói với nhau', fx: { hearts: { 'kp:chin': 2, 'kp:muoi': 2 } },
              say: [['nar', 'Bạn và chú Cường ra ngoài. Bên trong, hai chị em vừa khóc vừa cãi ai giành bánh trước.']] },
            { t: 'Đề xuất gộp sạp: "Rau Cá Chín Mười"', fx: { hearts: { 'kp:chin': 1, 'kp:muoi': 1, 'bama:cosau': 1 }, flag: 'd09_gopsap' },
              say: [['kp:muoi', 'Gộp! Mua cá tặng rau nêm canh chua.'], ['kp:chin', 'Bảng hiệu tên tui đứng trước.'], ['kp:muoi', 'Tui lớn hơn!']] },
          ],
        },
        missed: 'Chú Cường: Hai nửa tấm ảnh ghép khít. Dì Chín và cô Mười là chị em thất lạc. Chú muốn đọc loa mà hai bà chưa cho.',
      },
    ],
    end: 'Biên bản khu phố: Vụ 5 phân sạp. Hai sạp gộp thành "Rau Cá Chín Mười", combo nấu canh chua, chợ vui cả ngày.',
  },

  // ───────────────────────────── Drama 10 ─────────────────────────────
  {
    id: 'd10', no: 10, title: 'Tráo nhầm ở trạm y tế', who: ['kp:khoi', 'kp:hao', 'kp:phan', 'kp:thanh', 'kp:lam'],
    minDay: 20,
    acts: [
      {
        gap: 0, place: 'tramyte', from: '07:30', to: '10:30', task: 'Trạm y tế: loa gọi số đọc nhầm sổ sinh cũ',
        scene: {
          lines: [
            ['nar', 'Trạm y tế phường. Bác sĩ Lâm đang số hóa sổ sinh cũ, vừa đọc vừa gõ. Ông quên tắt loa gọi số thứ tự.'],
            ['kp:lam', '(qua loa) "...năm 1992, hai bé trai sinh cùng đêm, vòng tay bị đổi 2 tiếng..." Ủa, loa đang mở hả?'],
            ['kp:thuy', 'Mở từ nãy anh. Phòng chờ 14 người nghe hết rồi.'],
            ['kp:phan', 'Năm 1992. Cùng đêm. Thằng Khôi nhà tui sinh năm 1992.'],
            ['nar', 'Bà Phấn quay sang nhìn anh Hào đang ngồi chờ lấy thuốc. Nhìn thật lâu.'],
            ['kp:hao', 'Dạ... con chào bác Phấn. Con cũng sinh năm 1992.'],
            ['kp:phan', 'Bác biết. Bác biết lâu rồi. Bác chỉ mới thấy hôm nay.'],
          ],
          choices: [
            { t: '"Bác sĩ đọc hết trang đó đi ạ"', fx: { hearts: { 'kp:lam': 1 } },
              say: [['kp:lam', 'Trang sau rách mất rồi. Tôi phải tìm sổ ghi chú của y tá trực năm đó.']] },
            { t: 'Trấn an bà Phấn: "Chắc nhầm thôi bác"', fx: { hearts: { 'kp:phan': 1 } },
              say: [['kp:phan', 'Nhầm thì cũng phải đăng nhóm cái đã.'], ['nar', 'Bà Phấn đăng xong trước khi bạn nói hết câu.']] },
            { t: 'Chụp màn hình bài của bà Phấn gửi anh Khôi', fx: { mood: 2, hearts: { 'kp:khoi': -1 }, xomoi: 'Bà Phấn: Sổ sinh năm 1992 có hai bé trai cùng đêm bị đổi vòng tay 2 tiếng. Ai có thông tin xin nhắn riêng.' },
              say: [['kp:khoi', '(tin nhắn) Má tui lại làm gì nữa vậy?']] },
          ],
        },
        missed: 'Bà Phấn: Loa trạm y tế đọc nhầm sổ sinh năm 1992: hai bé trai cùng đêm, vòng tay bị đổi 2 tiếng. Khôi với Hào cùng năm đó!',
      },
      {
        gap: 1, place: 'hem', from: '19:00', to: '22:00', task: 'Nhà ông Thanh trong hẻm: hai nhà "thử" con',
        scene: {
          lines: [
            ['nar', 'Tối. Nhà ông Thanh trong hẻm, dàn karaoke bật hết cỡ. Hai nhà "thử" con bên kia.'],
            ['kp:thanh', 'Khôi, con hát thử một bài coi. Thằng Hào nhà bác hát như máy cắt cỏ.'],
            ['nar', 'Anh Khôi cầm micro. Anh hát. Cả hẻm im. Ông Thanh làm rơi dĩa đậu phộng.'],
            ['kp:thanh', 'Giọng này... giọng này là giọng nhà tui!'],
            ['kp:phan', 'Còn thằng Hào, bác nhờ duyệt 40 tin chờ trong nhóm cư dân. Năm phút là sạch bong. Đó, giống tui!'],
            ['kp:hao', 'Con làm quản trị quán net mà bác...'],
          ],
          choices: [
            { t: 'Mở bình chọn "Ai giống ai" trên Xóm Ơi', fx: { mood: 3, hearts: { 'kp:phan': 1, 'kp:hao': -1 }, xomoi: '{ten}: Bình chọn nè: anh Khôi giống ông Thanh hay anh Hào giống bà Phấn? Thả tim!' },
              say: [['kp:phan', 'Bình chọn hay! Tui ghim liền.']] },
            { t: 'Rủ anh Khôi và anh Hào song ca', fx: { hearts: { 'kp:khoi': 2, 'kp:hao': 2, 'kp:thanh': 1 }, flag: 'd10_songca' },
              say: [['kp:khoi', 'Anh Hào, anh hát sai nhịp đều ghê.'], ['kp:hao', 'Nhịp của tui là nhịp riêng.'], ['nar', 'Song ca vui nhất hẻm.']] },
            { t: 'Xin một bài, hát luôn cho vui', fx: { mood: 4, energy: -2, hearts: { 'kp:thanh': 2 } },
              say: [['kp:thanh', 'Được! Bài này, tone này. Ủa, con là con nhà ai vậy?']] },
          ],
        },
        missed: 'Ông Thanh: Tối nay thằng Khôi hát ở nhà tui hay bất ngờ. Còn thằng Hào duyệt nhóm cư dân nhanh y bà Phấn. Nghi lắm!',
      },
      {
        gap: 1, place: 'tramyte', from: '08:30', to: '11:30', task: 'Trạm y tế: sổ ghi chú của y tá trực năm 1992',
        scene: {
          lines: [
            ['nar', 'Phòng kho trạm y tế. Bác sĩ Lâm và chị Thủy lục thùng sổ cũ, bụi bay như khói nhang.'],
            ['kp:thuy', 'Đây rồi anh! Sổ ghi chú của y tá trực đêm năm 1992.'],
            ['kp:lam', '"Hai bé trai, vòng tay đổi nhầm lúc 1h. 3h đã đổi lại đúng, mẹ nào con nấy. Ghi chú: hai bé khóc giống nhau."'],
            ['kp:khoi', 'Vậy... con vẫn là con má Phấn.'],
            ['kp:hao', 'Còn con vẫn là con ba Thanh. Hơi tiếc vụ giọng hát.'],
            ['kp:phan', 'Tiếc gì. Hai đứa khóc chung một đêm là chung một đêm. Tui nhận thêm một đứa.'],
            ['kp:thanh', 'Tui cũng nhận thêm một đứa. Đứa hát hay.'],
          ],
          choices: [
            { t: 'Đề xuất hai nhà làm "thông gia danh dự"', fx: { hearts: { 'kp:phan': 2, 'kp:thanh': 2, 'kp:khoi': 1, 'kp:hao': 1 }, flag: 'd10_thonggia' },
              say: [['kp:thanh', 'Thông gia danh dự! Tối thứ Bảy karaoke chung, tui bớt hát một mình.']] },
            { t: 'Rủ anh Khôi và anh Hào đi ăn cơm tấm', fx: { money: -35000, hearts: { 'kp:khoi': 2, 'kp:hao': 2 } },
              say: [['kp:hao', 'Mình là đối thủ giành khách đêm mà ha.'], ['kp:khoi', 'Giờ là anh em cùng đêm. Tui trả.']] },
            { t: '"Để mọi người vui thêm vài ngày rồi hãy công bố"', fx: { mood: 3, hearts: { 'kp:lam': -1 } },
              say: [['kp:lam', 'Không được. Tin sai trên Xóm Ơi đủ nhiều rồi.'], ['nar', 'Bác sĩ Lâm đăng kết quả ngay. Bà Phấn ghim.']] },
          ],
        },
        missed: 'Bác sĩ Lâm: Sổ y tá trực ghi rõ: vòng tay đã đổi lại sau 2 tiếng. Khôi vẫn con bà Phấn, Hào vẫn con ông Thanh. Xin lỗi cả khu.',
      },
    ],
    end: 'Biên bản khu phố: Vụ loa gọi số trạm y tế. Hai nhà thành "thông gia danh dự", karaoke chung tối thứ Bảy.',
  },

  // ───────────────────────────── Drama 11 ─────────────────────────────
  {
    id: 'd11', no: 11, title: 'Tranh thừa kế xe ba gác', who: ['bama:bay', 'bama:tuan', 'bama:mi', 'bama:cautam', 'kp:thong'],
    minDay: 34,
    acts: [
      {
        gap: 0, place: 'bama', from: '09:00', to: '11:30', task: 'Ba & Má: Kevin trình slide "Ba Gác Express"',
        scene: {
          lines: [
            ['nar', 'Ba & Má. Hôm qua Chú Bảy nói đùa: "Năm sau chú về quê, ba gác để cho đứa nào chở giỏi nhất."'],
            ['bama:tuan', 'Slide 1: "Ba Gác Express". Slide 2: app đặt ba gác. Slide 3: gọi vốn.'],
            ['bama:bay', 'Con biết đề ba gác chưa?'],
            ['bama:tuan', 'Dạ chưa. Nhưng con có roadmap.'],
            ['bama:hang', 'Kevin, con trình 37 slide cho một cái xe ba bánh.'],
            ['bama:bay', '{ten}, con thấy sao?'],
          ],
          choices: [
            { t: '"Học lái trước, làm app sau anh Kevin"', fx: { hearts: { 'bama:bay': 2, 'bama:tuan': -1 } },
              say: [['bama:tuan', 'Học lái... cũng có trong roadmap. Quý 3.']] },
            { t: 'Khen slide đẹp', fx: { hearts: { 'bama:tuan': 2 } },
              say: [['bama:tuan', 'Cảm ơn! Slide 18 có biểu đồ hình ba gác nữa.']] },
            { t: '(Ba & Má) Đứng về phe Kevin', role: 'bama', fx: { hearts: { 'bama:tuan': 2, 'bama:mi': -1 }, flag: 'd11_phekevin' },
              say: [['bama:tuan', 'Có đồng minh! Em làm Head of Ba Gác Operations nha.']] },
          ],
        },
        missed: 'Kevin Tuấn: Sáng nay em trình 37 slide "Ba Gác Express". Chú Bảy hỏi em biết đề xe chưa. Dạ chưa.',
      },
      {
        gap: 1, place: 'bagac', from: '15:00', to: '17:30', task: 'Xe ba gác: Út Mi và Cậu Tám cũng muốn',
        scene: {
          lines: [
            ['bama:mi', 'Ba gác này gắn đèn, gắn loa là thành sân khấu live lưu động! Đi tới đâu live tới đó!'],
            ['bama:cautam', 'Live cái gì. Ba gác để chở mối thịt. Sáng 4 giờ cậu chở heo, chiều cậu chở... heo.'],
            ['bama:bay', 'Ba gác này 20 năm chở khô, chở bàn ghế, chở đồ dọn trọ, chở người đi nhờ. Chưa chở sân khấu với heo cùng lúc.'],
            ['kp:thong', 'Chú... à, Ba. Con đang học lái. Con chưa dám xin.'],
            ['bama:bay', 'Ai muốn thì thi. Ngày mốt, chở 20 thùng khô qua hẻm 7 ngập.'],
          ],
          choices: [
            { t: 'Xin làm trọng tài cuộc thi', fx: { hearts: { 'bama:bay': 2 }, flag: 'd11_trongtai' },
              say: [['bama:bay', 'Được. Trọng tài phải đứng giữa hẻm ngập nha.']] },
            { t: 'Bày Thông bí kíp: chở chậm, chở đều', fx: { hearts: { 'kp:thong': 2 }, flag: 'd11_bikip' },
              say: [['kp:thong', 'Chậm mà đều. Như nướng sườn. Hiểu rồi!']] },
            { t: '(Ba & Má) Đứng về phe Út Mi', role: 'bama', fx: { hearts: { 'bama:mi': 2, 'bama:tuan': -1 }, flag: 'd11_phemi' },
              say: [['bama:mi', 'Em lo đèn, chị lo live. Mình là ê-kíp!']] },
            { t: '"Cho Cậu Tám chở heo đi, vậy mới thực tế"', fx: { hearts: { 'bama:cautam': 2, 'bama:mi': -1 } },
              say: [['bama:cautam', 'Đứa này biết chuyện. Mai cậu cho bịch lòng.']] },
          ],
        },
        missed: 'Út Mi: Em muốn ba gác làm sân khấu live, Cậu Tám muốn chở heo. Chú Bảy chốt: ngày mốt thi chở 20 thùng khô qua hẻm 7 ngập.',
      },
      {
        gap: 2, place: 'hem', from: '15:00', to: '17:30', task: 'Hẻm 7 ngập: thi chở 20 thùng khô',
        scene: {
          lines: [
            ['nar', 'Hẻm 7 sau cơn mưa, nước tới mắt cá. Hai mươi thùng khô xếp sẵn. Cả khu phố đứng hai bên như coi đua ghe.'],
            ['bama:tuan', 'Em có app đo tốc độ!'],
            ['nar', 'Kevin đạp được ba mét, ba gác nghiêng, Kevin nhảy xuống ôm thùng khô. Thùng khô khô, Kevin thì ướt.'],
            ['bama:mi', 'Cả nhà ơi, live nè! Mi chạy được 10 mét rồi... đèn sân khấu rớt xuống nước rồi!'],
            ['bama:cautam', 'Để cậu. Cậu chở heo 20 năm.'],
            ['nar', 'Cậu Tám chạy nhanh nhất. Rớt hai thùng.'],
            ['nar', 'Thông chở chậm, chở đều. Qua hết hẻm không rớt thùng nào. Chậm nhất, mà đủ nhất.'],
          ],
          choices: [
            { t: '(Trọng tài) Tuyên bố Thông thắng: đủ hàng mới là giỏi', needFlag: 'd11_trongtai', fx: { hearts: { 'kp:thong': 2, 'bama:bay': 2, 'bama:cautam': -1 }, flag: 'd11_thong' },
              say: [['bama:bay', 'Đúng ý chú. Chở hàng là chở cho đủ, không phải chở cho nhanh.']] },
            { t: 'Hô to: "Thông chở đủ hàng, Thông thắng!"', fx: { hearts: { 'kp:thong': 2, 'bama:bay': 1 }, flag: 'd11_thong' },
              say: [['nar', 'Cả hẻm hô theo. Chú Bảy gật đầu. Kevin vắt áo.']] },
            { t: 'Thi luôn một lượt cho biết', fx: { energy: -8, mood: 4, hearts: { 'bama:bay': 1 } },
              say: [['nar', 'Bạn đạp được nửa hẻm, rớt một thùng, cả khu vỗ tay. Chú Bảy cười: "Có tinh thần!"']] },
            { t: 'Xin Chú Bảy đừng về quê', fx: { hearts: { 'bama:bay': 2, 'bama:tuan': 1, 'bama:mi': 1 } },
              say: [['bama:bay', 'Về quê? Ờ thì... năm sau. Năm nào cũng là năm sau mà.']] },
          ],
        },
        missed: 'Bà Phấn: Thi chở khô qua hẻm 7 ngập: Kevin ướt, đèn của Út Mi rớt, Cậu Tám rớt hai thùng. Thông chậm nhất mà đủ nhất!',
      },
    ],
    end: 'Biên bản khu phố: Cuộc thi ba gác hẻm 7. Chú Bảy không về quê ("năm nào cũng là năm sau"), Thông chạy tuyến chiều, Kevin đi học lái.',
  },

  // ───────────────────────────── Drama 12 ─────────────────────────────
  {
    id: 'd12', no: 12, title: 'Di chúc của cô Ba Lành', who: ['kp:lanh', 'kp:kha', 'kp:tram', 'tm:tuyet'],
    minDay: 14,
    acts: [
      {
        gap: 0, place: 'phongtro', from: '18:00', to: '22:30', task: 'Dãy trọ: "di chúc" của cô Ba bị lộ',
        scene: {
          lines: [
            ['nar', 'Dãy trọ Bình An náo loạn. Ai đó thấy ghi chú trong điện thoại cô Ba: "DI CHÚC: để một phòng cho người thuê trả tiền đúng hạn nhất."'],
            ['kp:tram', 'Sổ thu chi tháng này lạ lắm. Cả dãy đóng tiền sớm. Phòng 2 đóng trước luôn ba tháng.'],
            ['kp:lanh', 'Má khỏe re. Má ghi chơi thôi mà. Sáng nào má cũng đi bộ hai vòng chợ.'],
            ['kp:kha', 'Má ghi chơi mà cả dãy đóng sớm, vậy má ghi thêm vài cái nữa đi má.'],
            ['kp:lanh', '{ten}, con nghe chuyện chưa? Con đừng có đua theo nha.'],
          ],
          choices: [
            { t: 'Đóng tiền phòng sớm luôn cho chắc', fx: { money: -50000, hearts: { 'kp:lanh': 1, 'kp:tram': 2 }, flag: 'd12_dongsom' },
              say: [['kp:tram', 'Ghi nhận! Em đứng hạng 3 bảng "đúng hạn nhất".'], ['kp:lanh', 'Trời ơi, mấy đứa này.']] },
            { t: 'Khuyên cô Ba lập di chúc cho đúng thủ tục', fx: { hearts: { 'kp:lanh': 2 } },
              say: [['me', 'Di chúc phải lập đúng hình thức, có người làm chứng hoặc công chứng mới chắc (thông tin giải trí, không phải tư vấn pháp lý).'], ['kp:lanh', 'Con nói giống luật sư ghê. Mà má chưa tính đi đâu nha.']] },
            { t: 'Nói đùa: "Con xin phòng góc có cửa sổ"', fx: { mood: 3, hearts: { 'kp:lanh': 1 } },
              say: [['kp:lanh', 'Phòng góc là phòng của má. Đi ngủ đi con.']] },
          ],
        },
        missed: 'Chị Trâm: Ghi chú "di chúc" của cô Ba bị lộ, cả dãy đóng tiền sớm. Phòng 2 đóng trước 3 tháng. Cô Ba nói cô khỏe re.',
      },
      {
        gap: 1, place: 'phongtro', from: '18:00', to: '22:00', task: 'Dãy trọ: anh Kha muốn sơn pastel, tăng giá',
        scene: {
          lines: [
            ['kp:kha', 'Con đề xuất: sơn cả dãy màu pastel, lắp khóa vân tay, tiền phòng tăng 300 nghìn. Lên app cho sang.'],
            ['kp:lanh', 'Chừng nào má chết.'],
            ['kp:kha', 'Má! Má nói vậy hoài ai dám làm gì!'],
            ['kp:tram', 'Sổ thu chi nói: sơn thì cần, tăng 300 thì không ai ở. Tăng 200 thì còn bàn.'],
            ['kp:lanh', 'Tường vàng này má sơn năm 2005. Vàng là màu ấm.'],
            ['kp:kha', 'Vàng là màu... cũ, má.'],
            ['kp:lanh', '{ten}, con là người thuê. Con nói đi.'],
          ],
          choices: [
            { t: 'Phe anh Kha: sơn mới, tăng 200 nghìn', fx: { hearts: { 'kp:kha': 2, 'kp:lanh': -1 }, flag: 'd12_phekha' },
              say: [['kp:kha', 'Cảm ơn em! Màu xanh bạc hà nha.'], ['kp:lanh', 'Hừ. Bạc hà là để uống.']] },
            { t: 'Phe cô Ba: sơn lại màu vàng, giữ giá', fx: { hearts: { 'kp:lanh': 2, 'kp:kha': -1 }, flag: 'd12_phecoba' },
              say: [['kp:lanh', 'Ngoan. Má sơn lại màu vàng, mà vàng mới.']] },
            { t: '"Sơn vàng pastel: nửa cũ nửa mới"', fx: { hearts: { 'kp:lanh': 1, 'kp:kha': 1, 'kp:tram': 1 } },
              say: [['kp:tram', 'Vàng pastel. Em ghi vô sổ. Huề.']] },
          ],
        },
        missed: 'Anh Kha: Tui đề xuất sơn pastel và tăng 300 nghìn. Má tui nói "chừng nào má chết". Họp gia đình chưa xong.',
      },
      {
        gap: 2, place: 'phongtro', from: '18:30', to: '21:30', task: 'Dãy trọ: chị Tuyết ghé phòng 3',
        scene: {
          lines: [
            ['nar', 'Một chiếc xe đen đậu đầu hẻm. Chị Tuyết, Chủ tịch T&M Partners, bước vào dãy trọ, dừng trước phòng 3.'],
            ['tm:tuyet', 'Hai mươi năm trước em thuê phòng này làm văn phòng đầu tiên. Một cái bàn, một cái quạt, một cái máy fax.'],
            ['kp:lanh', 'Con nhỏ này! Còn nợ cô một tháng tiền điện đó nha!'],
            ['tm:tuyet', 'Em nhớ. Em xin trả bằng một buổi tư vấn chiến lược cho dãy trọ, miễn phí.'],
            ['kp:kha', 'Tư vấn chiến lược... cho dãy trọ?'],
            ['tm:tuyet', 'Phòng 3 đặt tên "Phòng lịch sử T&M". Người ta sẽ muốn ở nơi một công ty bắt đầu. Đó không phải chiến lược, đó là sự thật.'],
            ['kp:lanh', 'Vậy là khu phố tên T&M là theo tên công ty con hả?'],
            ['tm:tuyet', 'Cô Ba, em không đính chính.'],
          ],
          choices: [
            { t: '(T&M) Soạn slide "Chiến lược dãy trọ Bình An"', role: 'tm', fx: { hearts: { 'tm:tuyet': 2, 'kp:kha': 1, 'kp:lanh': 1 }, flag: 'd12_slide' },
              say: [['tm:tuyet', 'Slide 3 thiếu số liệu, slide 4 thừa chữ. Nhưng em làm trong 20 phút. Tốt.']] },
            { t: 'Đề xuất treo tấm bảng nhỏ trước phòng 3', fx: { hearts: { 'kp:lanh': 2, 'tm:tuyet': 1 } },
              say: [['kp:lanh', 'Bảng gỗ nha. Ghi: "Nơi bắt đầu. Còn nợ một tháng điện."']] },
            { t: 'Hỏi chị Tuyết bí quyết bắt đầu từ phòng trọ', fx: { mood: 4, hearts: { 'tm:tuyet': 1 } },
              say: [['tm:tuyet', 'Trả tiền đúng hạn. Trừ tiền điện tháng đó.']] },
          ],
        },
        missed: 'Cô Ba Lành: Con Tuyết ghé phòng 3, xin trả nợ tiền điện 20 năm trước bằng một buổi "tư vấn chiến lược". Cô chịu.',
      },
    ],
    end: 'Biên bản khu phố: "Di chúc" của cô Ba. Dãy trọ sơn lại, phòng 3 thành "Phòng lịch sử T&M". Cô Ba vẫn khỏe re.',
  },

  // ───────────────────────────── Drama 13 ─────────────────────────────
  {
    id: 'd13', no: 13, title: 'Hôn ước trên tờ giấy ăn', who: ['tm:bao', 'kp:nhu', 'kp:luong'],
    minDay: 38,
    acts: [
      {
        gap: 0, place: 'tienloi', from: '21:00', to: '23:30', task: 'Tiện lợi ca đêm: chú Lương đưa tờ giấy ăn',
        scene: {
          lines: [
            ['nar', 'Tiện lợi Luôn Mở 24h, ca đêm. Chú Lương bước vào, không mua gì, đặt lên quầy một tờ giấy ăn ố vàng.'],
            ['kp:luong', 'Như, con coi nè. Năm 2006, ba với bác Tư tài xế ngồi quán, viết lên tờ giấy ăn: "Gả con cho nhau."'],
            ['kp:nhu', '(đọc) "Con gái Lương, con trai Tư. Ký tên. Kèm một dĩa ốc." Ba ơi, năm đó con còn chưa biết đọc.'],
            ['kp:luong', 'Thì giờ con biết đọc rồi đó. Con trai bác Tư giờ làm ở T&M trên cao ốc, tên Bảo.'],
            ['kp:nhu', '(cười) Ba, con 23 tuổi, con có kế hoạch học lên rồi. Tờ giấy này để lau quầy thì hợp hơn.'],
            ['kp:luong', 'Lời hứa của đàn ông!'],
            ['kp:nhu', 'Lời hứa có dĩa ốc làm chứng.'],
          ],
          choices: [
            { t: 'Che cho Như: "Chú ơi, ca đêm đông khách lắm"', fx: { hearts: { 'kp:nhu': 2, 'kp:luong': -1 } },
              say: [['kp:nhu', 'Cảm ơn nha. Ba về ngủ đi, mai còn chạy xe.']] },
            { t: 'Làm mai: "Anh Bảo dễ thương lắm đó"', fx: { hearts: { 'kp:nhu': -1, 'kp:luong': 2 }, flag: 'd13_lammai' },
              say: [['kp:nhu', 'Bạn đứng về phe ba tui hả?'], ['kp:luong', 'Đứa này biết chuyện!']] },
            { t: 'Mua ly mì, đứng ăn hóng', fx: { money: -12000, food: 6, mood: 2 },
              say: [['kp:nhu', 'Mì ly 12 nghìn. Hóng thì miễn phí.']] },
          ],
        },
        missed: 'Như: Ba tui đem tới tiệm một tờ giấy ăn năm 2006, ghi hai ông bố hứa gả con cho nhau. Tui cười muốn xỉu.',
      },
      {
        gap: 1, place: 'xeom', from: '21:00', to: '23:00', task: 'Bến xe ôm: chú Lương "chở miễn phí" anh Bảo',
        scene: {
          lines: [
            ['nar', 'Bến xe ôm đầu hẻm 42. Bảo tăng ca ở T&M, ra mua mì ly. Chú Lương đã nổ máy chờ sẵn.'],
            ['kp:luong', 'Lên chú chở. Miễn phí. Nói chuyện chút.'],
            ['tm:bao', 'Dạ con ở cách đây có 200 mét...'],
            ['kp:luong', 'Chú chở đường vòng. Con là con thằng Tư tài xế phải không? Con biết tờ giấy ăn năm 2006 không?'],
            ['tm:bao', 'Dạ... ba con có kể. Ba con kể như kể chuyện cười.'],
            ['kp:luong', 'Chuyện cười mà có chữ ký!'],
          ],
          choices: [
            { t: 'Đi theo, nghe chú Lương kể hết', fx: { energy: -2, hearts: { 'kp:luong': 2, 'tm:bao': 1 } },
              say: [['nar', 'Chú chở vòng ba lần quanh khu phố. Bảo về tới nhà thì mì ly đã nở thành bánh canh.']] },
            { t: 'Nhắc chú: "Chú để anh Bảo về ngủ"', fx: { hearts: { 'tm:bao': 2, 'kp:luong': -1 } },
              say: [['tm:bao', 'Cảm ơn bạn. Mai 8h30 chị Tuyết họp.']] },
            { t: '(T&M) Bảo nhắn hỏi ý bạn: "Giờ sao đây?"', role: 'tm', fx: { hearts: { 'tm:bao': 2 }, flag: 'd13_baohoi' },
              say: [['me', 'Anh cứ nói thật với chú: anh quý chú, quý Như, nhưng chuyện đời mình thì mình tự chọn.'], ['tm:bao', 'Ok. Nghe như một slide tốt.']] },
          ],
        },
        missed: 'Chú Lương: Tối nay chú chở thằng Bảo vòng vòng ba lần, kể chuyện tờ giấy ăn. Nó về tới nhà mì ly nở hết.',
      },
      {
        gap: 1, place: 'photo', from: '16:00', to: '20:00', task: 'Photo Thần Tốc: xé tờ giấy, mà có bản sao',
        scene: {
          lines: [
            ['nar', 'Trước Photo Thần Tốc. Như và Bảo hẹn nhau, mỗi người cầm một góc tờ giấy ăn.'],
            ['kp:nhu', 'Mình đâu có quen nhau, mỗi người có kế hoạch riêng. Xé nha?'],
            ['tm:bao', 'Xé. Mà mình làm bạn được. Làm bạn thì khỏi cần chữ ký.'],
            ['nar', 'Roẹt. Tờ giấy ăn năm 2006 thành hai nửa.'],
            ['kp:tan', 'Ủa, xé hả? Hôm qua chú Lương photo 10 bản rồi, còn ép plastic một bản.'],
            ['kp:luong', '(từ bến xe ôm vọng qua) Bản gốc thì xé được, kỷ niệm thì không!'],
          ],
          choices: [
            { t: 'Đề xuất đóng khung một bản, treo ở cà phê cóc', fx: { hearts: { 'kp:luong': 2, 'kp:nhu': 1, 'tm:bao': 1, 'kp:cam': 1 }, flag: 'd13_khung' },
              say: [['kp:cam', 'Treo cạnh bảng giá. Khách đọc xong uống thêm ly nữa.']] },
            { t: 'Chúc hai người làm bạn tốt', fx: { mood: 3, hearts: { 'kp:nhu': 1, 'tm:bao': 1 } },
              say: [['kp:nhu', 'Bạn ca đêm với bạn tăng ca. Hợp lý.'], ['tm:bao', 'Mì ly tui mua, bạn bớt giá nha.']] },
            { t: 'Vẫn cố làm mai thêm một lần', fx: { hearts: { 'kp:nhu': -1, 'tm:bao': -1 } },
              say: [['kp:nhu', 'Không.'], ['tm:bao', 'Không.'], ['nar', 'Lần đầu hai người đồng ý với nhau, và là để từ chối bạn.']] },
          ],
        },
        missed: 'Chú Tấn: Như với Bảo xé tờ giấy ăn trước tiệm. Mà hôm qua chú Lương photo 10 bản, ép plastic một bản rồi.',
      },
    ],
    end: 'Biên bản khu phố: Tờ giấy ăn năm 2006. Bảo và Như thành bạn, bản sao đóng khung ở cà phê cóc, chú Lương chở Bảo giảm giá trọn đời.',
  },

  // ───────────────────────────── Drama 14 ─────────────────────────────
  {
    id: 'd14', no: 14, title: 'Livestream lỡ bật', who: ['bama:mi', 'bama:tuan', 'bama:hang', 'kp:man'],
    minDay: 28,
    acts: [
      {
        gap: 0, place: 'cattoc', from: '14:00', to: '17:00', task: 'Tiệm tóc: điện thoại Út Mi đang live',
        scene: {
          lines: [
            ['nar', 'Tiệm Đẹp Mỗi Ngày. Út Mi nằm gội đầu, điện thoại úp trên ghế. Góc màn hình có chấm đỏ: LIVE, kênh Ba & Má.'],
            ['bama:mi', '(nhắm mắt) Chị Mận ơi, Ba em giấu một bịch khô ngon nhất trong két sắt, ai hỏi cũng nói "hết hàng".'],
            ['kp:man', 'Thiệt hả? Khô gì mà phải bỏ két?'],
            ['bama:mi', 'Khô sợi lá chanh mẻ đặc biệt. Ba ăn một mình lúc coi thời sự. Má mà biết là có chuyện.'],
            ['nar', 'Số người xem: 2.000. Bình luận chạy như mưa: "Bán cho tui bịch trong két!"'],
            ['kp:man', '{ten}, cái chấm đỏ đó là gì vậy em?'],
          ],
          choices: [
            { t: 'Lật điện thoại, tắt live', fx: { hearts: { 'bama:mi': 2, 'kp:man': 1 }, flag: 'd14_tat' },
              say: [['bama:mi', 'Trời ơi! Live từ nãy hả? Cảm ơn em, mà... chắc trễ rồi.']] },
            { t: 'Để chạy, xem bình luận', fx: { mood: 3 },
              say: [['nar', '3.000 người xem. Có người hỏi mua luôn cái két.']] },
            { t: 'Chen vô camera: "Tiệm tóc Đẹp Mỗi Ngày xin chào!"', fx: { mood: 2, hearts: { 'kp:man': 2 }, flag: 'd14_chen' },
              say: [['kp:man', 'Gội đầu 40 nghìn, có combo "nhuộm kiểu anh Mạnh" nha cả nhà!']] },
            { t: 'Chụp màn hình gửi Xóm Ơi', fx: { mood: 2, hearts: { 'bama:mi': -1 }, xomoi: '{ten}: Út Mi đang lỡ live ở tiệm tóc, kể bác Hùng giấu khô ngon trong két sắt!' },
              say: [['kp:phan', 'Ghim! Ghim! Ghim!']] },
          ],
        },
        missed: 'Bà Phấn: Út Mi gội đầu mà quên tắt live, 2.000 người nghe kể bác Hùng giấu khô ngon trong két sắt!',
      },
      {
        gap: 0, place: 'bama', from: '17:30', to: '20:30', task: 'Ba & Má: cô Hằng đã xem hết',
        scene: {
          lines: [
            ['nar', 'Ba & Má, chiều tối. Cô Hằng ngồi trước két sắt, điện thoại đang mở lại đoạn live.'],
            ['bama:hang', 'Két này má giữ chìa. Bịch khô này vô bằng cách nào?'],
            ['bama:hung', '(từ phòng trong) Tui... tui có chìa dự phòng.'],
            ['bama:tuan', 'Má, khoan giận. Đơn đang nhảy kìa. Người ta đặt "khô trong két" 200 bịch rồi.'],
            ['bama:mi', 'Con xin lỗi. Con tưởng tắt live rồi.'],
            ['bama:hang', '{ten}, con là người ngoài, con nói công bằng coi.'],
          ],
          choices: [
            { t: '(Ba & Má) Biến thành flash sale "Khô trong két"', role: 'bama', fx: { money: 60000, hearts: { 'bama:tuan': 2, 'bama:hang': 1, 'bama:mi': 1 }, flag: 'd14_flash' },
              say: [['bama:tuan', 'Flash sale 3 ngày! Bao bì in hình cái két!'], ['bama:hang', 'Lời thì má tha. Lỗ thì Ba ra ngủ ở xưởng.']] },
            { t: 'Xin cô tha cho bác Hùng: ai cũng có món ăn vụng', fx: { hearts: { 'bama:hung': 2, 'bama:hang': -1 } },
              say: [['bama:hung', 'Con hiểu Ba. Con là người hiểu Ba nhất nhà này.'], ['bama:hang', 'Tối nay Ba coi thời sự không có khô.']] },
            { t: 'Khen Út Mi: "Chị nói chuyện thật nên khách thích"', fx: { mood: 2, hearts: { 'bama:mi': 2 } },
              say: [['bama:mi', 'Thật hả? Vậy mai em live... có báo trước.']] },
          ],
        },
        missed: 'Kevin Tuấn: Má coi hết đoạn live rồi. Ba có chìa két dự phòng. Đơn "khô trong két" nhảy 200 bịch.',
      },
      {
        gap: 1, place: 'bama', from: '09:00', to: '12:00', task: 'Ba & Má: đơn tăng vọt vì "chân thật"',
        scene: {
          lines: [
            ['nar', 'Sáng hôm sau, xưởng Ba & Má ngập thùng. Đơn tăng gấp ba, bình luận ghi: "Kênh này chân thật quá."'],
            ['bama:tuan', 'Bài học: nội dung thật bán chạy hơn 37 slide. Con ghi vào roadmap.'],
            ['bama:mi', 'Từ nay em live có mục "Chuyện nhà không kịch bản". Có báo trước, có xin phép Ba.'],
            ['bama:hang', 'Còn tiệm chị Mận, khách trẻ kéo tới hỏi "chỗ Út Mi gội đầu đó hả".'],
            ['kp:man', '(tin nhắn) Chị kín lịch tới thứ Bảy. Cảm ơn bé Mi!'],
            ['bama:hang', '{ten}, phụ cô đóng thùng một chút nha.'],
          ],
          choices: [
            { t: 'Phụ đóng thùng cả buổi', fx: { energy: -6, money: 80000, hearts: { 'bama:hang': 2 } },
              say: [['bama:hang', 'Đóng chắc tay. Cô trả công, cho thêm một bịch... không phải bịch trong két.']] },
            { t: 'Đề nghị luật mới: tắt live trước khi gội đầu', fx: { mood: 2, hearts: { 'bama:mi': 1, 'kp:man': 1 } },
              say: [['bama:mi', 'Quy tắc số 1 của KOC: nằm xuống ghế gội là tắt live.']] },
            { t: '(Ba & Má) Viết kịch bản "Chuyện nhà không kịch bản"', role: 'bama', fx: { hearts: { 'bama:mi': 2, 'bama:tuan': 1 }, flag: 'd14_kichban' },
              say: [['bama:tuan', 'Không kịch bản mà có kịch bản. Đúng chất innovation.']] },
          ],
        },
        missed: 'Cô Hằng: Đơn Ba & Má tăng gấp ba vì "chân thật". Tiệm chị Mận kín lịch khách trẻ. Ba vẫn đang bị cấm khô.',
      },
    ],
    end: 'Biên bản khu phố: Vụ live quên tắt ở tiệm tóc. Ba & Má đắt hàng 3 ngày, tiệm tóc thêm khách trẻ, két sắt đổi khóa.',
  },
];
