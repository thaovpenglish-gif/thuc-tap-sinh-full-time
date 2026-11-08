// Khu phố T&M · main storyline (docs/khupho/STORY_FORMAT.md). Plain data.
// Spine: a slide "Tâm Mỹ Plaza" leaks, the street fears being torn down, the player gathers the street's stories,
// finds out it was chị Tuyết's surprise (a one-day walking street) wrapped in a cover that was "made to pop",
// and the neighbourhood runs its own Hội chợ Khu phố 7, then a warm Tết.
// Flags: giu_chia_khoa (c2_nhau → c6_sang choice) · hua_coba (c3_coba → c7_mung1 choice) · len_live (c3_cattoc →
// c6_hoicho choice) · tranh_tre_em (c4_truong → c6_trienlam) · bia_goc (c5_agency → c6_poster) ·
// khu_pho_lam_chu / tm_lam_chu (c5_tuyet → c6_haucan / c6_dat).
export const STORY = [
  // ───────────────────────────── Chương 1 · day 1 ─────────────────────────────
  {
    id: 'c1', title: 'Chương 1 · Phòng số 5',
    intro: 'Sáng Thứ Hai, 02/11/2026. Bạn kéo vali tới Khu phố 7, phường Tâm Mỹ. Việc đầu tiên: chào cô chủ trọ.',
    beats: [
      {
        id: 'c1_chao', task: 'Chào cô Ba Lành ở dãy trọ Bình An', hint: 'Dãy trọ Bình An, cạnh hẻm 42. Cứ theo mũi tên.',
        where: 'phongtro',
        scene: {
          lines: [
            ['kp:lanh', 'Con là {ten} hả? Phòng 5 nha. Cửa hơi kẹt, đẩy mạnh là vô. Đẩy mạnh quá là vô luôn phòng 6.'],
            ['kp:lanh', 'Tiền phòng tháng này con đóng kèm cọc rồi. Ngày 5 tháng sau nhớ nha, cô không nhắc đâu. Cô nhắc trên Xóm Ơi.'],
            ['kp:kha', 'Em là Kha, con cô Ba. Dãy trọ có app quản lý rồi nha, quét mã là thấy hóa đơn. Má em thì vẫn ghi sổ.'],
            ['kp:lanh', 'App gì thì app, sổ của cô không bao giờ hết pin.'],
            ['nar', 'Phòng 16 m². Cái quạt trần kêu như đang suy nghĩ chuyện đời. Cửa sổ nhìn thẳng bức tường nhà bên, cách đúng một sải tay.'],
            ['kp:lanh', 'Con đi ăn sáng đi, bánh mì đầu hẻm 42 ngon nhất khu. Rồi lên công an phường đăng ký tạm trú, ở trọ là phải khai báo.'],
            ['kp:lanh', 'Cô 66 tuổi, khỏe re. Nhưng cô có viết di chúc trong điện thoại rồi. Cứ phòng hờ.'],
          ],
          choices: [
            { t: 'Dạ, con cảm ơn cô. Con sẽ ở đây lâu.', fx: { mood: 3, hearts: { 'kp:lanh': 1 } }, say: [['kp:lanh', 'Ở lâu thì nhớ đóng tiền đúng ngày. Còn lại cô thương hết.']] },
            { t: 'Hỏi anh Kha về cái app', fx: { hearts: { 'kp:kha': 1 } }, say: [['kp:kha', 'App tên "Trọ Ơi". Có nút "báo hỏng quạt". Bấm xong là má em lên coi.'], ['kp:lanh', 'Rồi cô nói: quạt còn quay là chưa hỏng.']] },
            { t: 'Đẩy cửa bằng vai cho ngầu', fx: { energy: -3, mood: 2 }, say: [['nar', 'Cửa mở. Vai bạn thì đang suy nghĩ lại.']] },
          ],
        },
      },
      {
        id: 'c1_banhmi', task: 'Ăn ổ bánh mì đầu hẻm 42', hint: 'Xe bánh mì mở 5h30-9h30. Bấm vào xe để mua.',
        where: 'banhmi', from: '05:30', to: '09:30', need: { type: 'eat', count: 1 },
        scene: {
          lines: [
            ['hr:banhmi', 'Mặt lạ hoắc, chắc mới dọn tới. Ổ đầu tiên cô lấy giá người quen tương lai.'],
            ['nar', 'Điện thoại của cô reo. Cô nghe, gật gù, rồi nói: "Không, cô không quan tâm vị trí Giám đốc Tài chính. Cô bán bánh mì."'],
            ['hr:banhmi', 'Số của cô bị một công ty săn người lưu nhầm. Tuần nào cũng có người mời cô làm sếp.'],
            ['hr:banhmi', 'Thằng Hưng nhà cô làm công nhân trên Bình Dương. Nó mà nghe chắc nó bắt cô nhận.'],
            ['me', 'Bánh mì nóng giòn, đồ chua vừa chua, pa tê vừa béo. Khu phố này bắt đầu có điểm cộng.'],
          ],
          choices: [
            { t: 'Khen bánh mì ngon nhất quả đất', fx: { mood: 2, hearts: { 'hr:banhmi': 1 } }, say: [['hr:banhmi', 'Quả đất cô chưa đi hết. Nhưng khu phố này thì chắc rồi.']] },
            { t: 'Hỏi thăm anh Hưng', fx: { hearts: { 'hr:banhmi': 2 } }, say: [['hr:banhmi', 'Chủ nhật nào nó cũng gọi về. Tết mới về tới nơi. Con mà gặp nó thì nhắc nó ăn uống đàng hoàng giùm cô.']] },
          ],
        },
      },
      {
        id: 'c1_tamtru', task: 'Đăng ký tạm trú ở Công an phường', hint: 'Công an phường Tâm Mỹ trực 24h, đầu đường Tâm Mỹ.',
        where: 'congan', need: { type: 'tamtru' },
        scene: {
          lines: [
            ['kp:thuan', 'Chào em, mới dọn tới hả? Ngồi đi. Tạm trú giờ đăng ký trên ứng dụng định danh, miễn phí, anh chỉ cho.'],
            ['kp:thuan', 'Ở trọ thì phải khai báo tạm trú, chủ trọ cũng phải khai báo người thuê (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['nar', 'Bạn chụp ảnh xác thực khuôn mặt. Máy báo: "Không nhận diện được." Trên mép bạn còn dính một cọng đồ chua.'],
            ['kp:thuan', 'Lau miệng rồi chụp lại em. Tuần trước có anh chụp lúc đang ngậm ống hút trà sữa, máy tưởng ảnh con voi.'],
            ['nar', 'Lần thứ hai: thành công. Lần đầu tiên trong đời bạn thấy mặt mình trên màn hình mà không muốn xóa.'],
            ['kp:thuan', 'Có tạm trú ở nhà trọ đạt chuẩn thì tiền điện được tính như giá hộ gia đình (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:thuan', 'À, 22h anh đi tuần quán net. Em mà thấy bé Cua ở đó thì... thôi, bé Cua là con anh. Anh tự lo.'],
          ],
          choices: [
            { t: 'Dạ, cảm ơn anh Thuận', fx: { hearts: { 'kp:thuan': 1 } }, say: [['kp:thuan', 'Có gì cứ ghé. Công an phường mở cửa 24 giờ. Chỉ có anh là không.']] },
            { t: 'Hỏi bé Cua hay đi net hả anh', fx: { mood: 2 }, say: [['kp:thuan', 'Không. Bé Cua mê khô gà. Mê tới mức anh nghi nó có cả một đường dây.']] },
          ],
        },
      },
      {
        id: 'c1_xomoi', task: 'Vào nhóm Xóm Ơi của khu phố', hint: 'Bà Phấn ở hẻm 42. Mở nhóm bằng phím P (hoặc nút điện thoại).',
        where: 'hem', need: { type: 'xomoi' },
        scene: {
          lines: [
            ['kp:phan', 'Người mới phòng 5 dãy cô Ba phải không? Bà là Phấn, quản trị nhóm "Cư dân KP7 Tâm Mỹ" trên Xóm Ơi. Đưa điện thoại bà thêm vô.'],
            ['kp:phan', 'Nội quy có 14 điều. Điều 1: không bán hàng trong nhóm. Điều 2 tới 14: như điều 1, nhưng nói kỹ hơn.'],
            ['nar', 'Điện thoại bạn rung liên tục. 37 tin chào mừng, 12 sticker hoa sen, một người hỏi "ai làm rơi chiếc dép tổ ong ở hẻm 7".'],
            ['kp:phan', 'Có gì lạ thì báo nhóm. Bà chụp màn hình nhanh hơn mọi người gõ phím, nên đừng có xóa tin. Bà thấy hết.'],
            ['kp:thanh', '(từ trong nhà vọng ra) Phấn ơi, tối nay tui hát bài mới nha!'],
            ['kp:phan', 'Ông Thanh đó, bảy tối một tuần. Con mở nhóm ra đọc đi, tối nay thế nào cũng có người than.'],
          ],
          choices: [
            { t: 'Gửi một sticker chào cả nhóm', fx: { mood: 2, xomoi: 'Bà Phấn: Chào mừng bạn mới phòng 5 dãy Bình An! Cả nhà thả tim đi.' }, say: [['kp:phan', 'Ngoan. Bà ghim tin của con lên đầu một tiếng.']] },
            { t: 'Hỏi điều 15 là gì', fx: { hearts: { 'kp:phan': 1 } }, say: [['kp:phan', 'Điều 15 là "bà Phấn luôn đúng". Bà chưa viết ra vì khiêm tốn.']] },
          ],
        },
      },
      {
        id: 'c1_viec', task: 'Kiếm một việc làm', hint: 'Trà Sữa Full Topping nhận ca từ 9h. Hoặc ứng tuyển 1 trong 7 công ty (vào trước 10h30).',
        where: 'trasua', from: '09:00', to: '21:30', need: { type: 'work', count: 1 },
        scene: {
          lines: [
            ['kp:nhung', 'Em tìm việc hả? Chị là Nhung, chủ quán. Đang thiếu người ca sáng. Biết lắc ly không?'],
            ['kp:tu', 'Em là Tú, ca trưởng. Quán có 41 công thức, em thuộc hết. Người mới học 4 món trước, ly đầu em làm mẫu.'],
            ['kp:bong', 'Còn em là Bông, dập nắp nhanh nhất khu phố. Kỷ lục 1,8 giây. Đừng có thi với em.'],
            ['kp:nhung', 'Lương theo giờ, không thấp hơn lương tối thiểu vùng (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:nhung', 'Không mê trà sữa thì qua cao ốc, Ba & Má, kho Đi Đâu Cũng Được, Lô C, loft Trend Trễ. Bảy công ty đang nhận thực tập.'],
            ['nar', 'Bên kia đường, bà Cẩm ở Cà Phê Cóc Bảy Ghế đang nhìn qua quán trà sữa. Ánh mắt của một người mẹ chồng.'],
          ],
          choices: [
            { t: 'Nhận ca thử ở trà sữa', fx: { hearts: { 'kp:nhung': 1, 'kp:tu': 1 } }, say: [['kp:tu', 'Đeo tạp dề vô. Ly đầu em làm, ly thứ hai anh chị làm, ly thứ ba thì cầu nguyện.']] },
            { t: 'Cảm ơn chị, em đi xem các công ty', fx: { mood: 1 }, say: [['kp:nhung', 'Ừ, đi đi. Làm ở đâu thì trưa cũng phải uống trà sữa thôi.']] },
          ],
        },
      },
      {
        id: 'c1_toi', task: 'Ăn tối ở Cơm Tấm Cô Lài', hint: 'Hẻm 7, mở lại từ 17h.',
        where: 'comtam', from: '17:00', to: '23:30',
        scene: {
          lines: [
            ['kp:lai', 'Ngồi đi con. Sườn, bì, chả, trứng. Nước mắm thì đừng hỏi công thức, cô không nói đâu.'],
            ['kp:thong', 'Sườn mới ra lò. Em là Thông, nướng ở đây 8 năm. Than hồng tới mức muỗi không dám bay ngang.'],
            ['nar', 'Bàn bên cạnh, bé Đậu và bé Na đang làm bài tập. Đậu đếm que tính. Na tô chữ "a" tới lần thứ 40.'],
            ['kp:lai', 'Hai đứa cháu ngoại cô. Học xong mới được ăn chè. Luật nhà cô đó.'],
            ['kp:kha', 'Ủa {ten}, ăn ở đây hả. Ngày đầu sao rồi? Má anh nhắc chuyện di chúc chưa?'],
            ['me', 'Ngày đầu tiên: một ổ bánh mì, một tấm ảnh tạm trú, 37 tin nhắn Xóm Ơi. Cũng không tệ.'],
          ],
          choices: [
            { t: 'Gọi dĩa sườn chả (35.000đ)', fx: { money: -35000, food: 20, mood: 3, hearts: { 'kp:lai': 1 } }, say: [['kp:thong', 'Ăn miếng đầu mà không gật gù là em nướng lại.']] },
            { t: 'Ngồi nói chuyện với anh Kha', fx: { hearts: { 'kp:kha': 1 } }, say: [['kp:kha', 'Anh định sơn lại dãy trọ màu pastel. Má anh nói "chừng nào má chết". Mà má anh khỏe lắm.']] },
            { t: 'Khen Đậu và Na học chăm', fx: { mood: 2, hearts: { 'kp:lai': 1 } }, say: [['kp:lai', 'Khen nữa là tụi nó đòi ăn chè trước. Cảm ơn con.']] },
          ],
        },
      },
      {
        id: 'c1_ngu', task: 'Về phòng ngủ một giấc', hint: 'Vào phòng 5 và đi ngủ. Ngày trôi khi bạn ngủ.',
        where: 'phongtro', from: '19:00', to: '23:59', need: { type: 'sleep', count: 1 },
        scene: {
          lines: [
            ['nar', 'Bạn nằm xuống. Quạt trần quay. Bên kia tường, một giọng ca vàng cất lên: "Đêm nay ai đưa em về..."'],
            ['kp:lanh', '(gõ cửa) Ông Thanh đó con. Bảy tối một tuần. Cô cho con cục bông gòn nhét tai.'],
            ['kp:lanh', 'Mai đi làm thì nhớ ăn sáng. Ở đây ai bỏ bữa là cả hẻm biết.'],
            ['nar', 'Điện thoại sáng lên: Xóm Ơi có 4 tin mới. Một tin than ông Thanh hát, ba tin thả tim bài ông Thanh hát.'],
          ],
          choices: [
            { t: 'Nhét bông gòn, ngủ', fx: { energy: 3, hearts: { 'kp:lanh': 1 } }, say: [['nar', 'Tiếng hát nhỏ dần thành tiếng muỗi. Bạn ngủ như chưa từng có tin nhắn nào.']] },
            { t: 'Hát theo một câu', fx: { mood: 4, energy: -2 }, say: [['kp:thanh', '(vọng qua tường) Ai hát bè đó? Hay! Mai qua đây hát chung!']] },
          ],
        },
      },
    ],
    done: 'Ngày đầu ở Khu phố 7: có phòng, có tạm trú, có việc làm, và 37 người quen trên mạng.',
  },

  // ───────────────────────────── Chương 2 · days 2-6 ─────────────────────────────
  {
    id: 'c2', title: 'Chương 2 · Tuần đầu tiên',
    intro: 'Một tuần để quen: đi làm cho quen tay, chào người giữ loa, sắm một món cho phòng, ngồi chung bàn với hàng xóm.',
    beats: [
      {
        id: 'c2_cuong', task: 'Chào chú Cường ở Văn phòng Khu phố 7', hint: 'Văn phòng mở 7h-11h. Chú muốn xem hồ sơ cá nhân của bạn (phím H).',
        where: 'khupho', from: '07:00', to: '11:00', minDay: 2, need: { type: 'profile' },
        scene: {
          lines: [
            ['kp:cuong', 'Alo alo, một hai ba. A, cháu mới phòng 5 hả. Chú là Cường, Trưởng khu phố 7. Cái loa này của chú, cái khu phố này của mọi người.'],
            ['kp:cuong', 'Loa đọc tin 6 giờ sáng và 5 giờ chiều. Ai mất con gà, chỗ nào cúp điện, em nào được học bổng, chú đọc hết.'],
            ['kp:nga', 'Cô là Nga, ban Mặt trận khu phố. Có quỹ học bổng, có quà Tết, có cơm chung tối Chủ nhật cho bà con đang kẹt.'],
            ['kp:cuong', 'Cho chú coi hồ sơ cá nhân của cháu chút. Không phải kiểm tra đâu, chú tò mò thôi. Ở đây ai cũng tò mò.'],
            ['kp:luc', '(từ cổng trường chạy về) Anh Cường, con Mèo KPI lại nằm trên nóc ba gác Chú Bảy nữa rồi.'],
            ['kp:cuong', 'Con mèo đó là của một công ty trên cao ốc. Mà nó ở khu phố còn nhiều hơn ở công ty.'],
          ],
          choices: [
            { t: 'Xin chú dạy đọc loa', fx: { mood: 2, hearts: { 'kp:cuong': 2 } }, say: [['kp:cuong', 'Bài một: đọc chậm. Bài hai: không bao giờ đọc chuyện riêng. Bài ba: tắt mic trước khi hắt xì.']] },
            { t: 'Hỏi cô Nga về bữa cơm chung', fx: { hearts: { 'kp:nga': 1 } }, say: [['kp:nga', 'Ai hết tiền thì cứ tới, không ai hỏi. Ai dư tiền thì cũng cứ tới, rửa chén.']] },
          ],
        },
      },
      {
        id: 'c2_lam', task: 'Đi làm 2 ngày cho quen tay', hint: 'Trà sữa hoặc công ty bạn chọn. Ghé cà phê cóc trước giờ làm cũng được.',
        where: 'caphe', from: '05:30', to: '11:00', need: { type: 'work', count: 2 },
        scene: {
          lines: [
            ['kp:cam', 'Cà phê sữa hả con? 15.000đ. Ở đây có bảy cái ghế, ai tới trước ngồi trước, sếp cũng phải đứng.'],
            ['nar', 'Ba người đeo thẻ nhân viên cao ốc đứng uống cà phê, mắt nhìn đồng hồ, miệng than thang máy kẹt.'],
            ['kp:cam', 'Con làm bên trà sữa con dâu cô hả? Không sao. Sáng uống cà phê mẹ, chiều uống trà sữa dâu. Cô không ghen. Cô chỉ nhớ.'],
            ['kp:cam', 'Đi làm thì làm cho đàng hoàng. Hai ngày đầu là người ta nhớ mặt mình cả năm.'],
          ],
          choices: [
            { t: 'Uống một ly cà phê sữa (15.000đ)', fx: { money: -15000, energy: 10, hearts: { 'kp:cam': 1 } }, say: [['kp:cam', 'Đá ít, sữa vừa, đường thì cô bỏ theo mặt con. Mặt con hôm nay cần ngọt.']] },
            { t: 'Chào bà rồi đi làm luôn', fx: { mood: 1 }, say: [['kp:cam', 'Ừ, đi đi. Người trẻ đi làm đúng giờ là cô thương.']] },
          ],
        },
      },
      {
        id: 'c2_xeom', task: 'Đi một cuốc xe ôm', hint: 'Bến xe ôm đầu hẻm 42 (5h-23h): chú Lương, anh Vũ, ông Quế.',
        where: 'xeom', need: { type: 'ride' },
        scene: {
          lines: [
            ['kp:luong', 'Đi đâu con? Trong khu phố 15.000đ, nghe chuyện miễn phí.'],
            ['kp:que', 'Đi với ông thì 10.000đ. Chậm hơn, mà ông kể chuyện từ hồi hẻm còn đất đỏ.'],
            ['kp:vu', 'Đặt app em cũng được, 13.000đ. Trời mưa là giá nhân rưỡi, đừng trách em, trách mây.'],
            ['kp:luong', 'Mà nghe nè. Hôm qua chú thấy hai người đeo thẻ tầng 12 đo hẻm 42 bằng cái máy bắn tia đỏ. Đo từ xe bánh mì tới cổng dãy trọ.'],
            ['kp:que', 'Đo hẻm làm chi? Hẻm này đo hồi năm 1998 rồi, dài y như cũ.'],
            ['me', 'Hai người lạ đo hẻm bằng tia laser. Chắc là không có gì. Chắc vậy.'],
          ],
          choices: [
            { t: 'Hỏi chú Lương họ đo làm gì', fx: { hearts: { 'kp:luong': 1 } }, say: [['kp:luong', 'Chú hỏi rồi. Họ nói "dạ khảo sát". Hỏi khảo sát gì, họ nói "dạ khảo sát". Người văn phòng nói chuyện như máy đo.']] },
            { t: 'Nghe ông Quế kể chuyện hẻm xưa', fx: { mood: 2, hearts: { 'kp:que': 1 } }, say: [['kp:que', 'Hồi đó mưa xuống là ai đi ngang hẻm cũng cao thêm năm phân, vì dính sình.']] },
          ],
        },
      },
      {
        id: 'c2_dien', task: 'Ngày 5: nghe cô Ba nói chuyện tiền nong', hint: 'Về dãy trọ Bình An. Cô Ba đang gom tiền điện.',
        where: 'phongtro', minDay: 4,
        scene: {
          lines: [
            ['kp:lanh', 'Hôm nay mùng 5. Tiền phòng tháng này con đóng rồi. Tháng sau là ngày 5/12 nha: 3.200.000đ, nước 100.000đ.'],
            ['kp:lanh', 'Điện thì cô tính theo số trên đồng hồ. Bốn ngàn một số, giá tình cảm.'],
            ['kp:kha', 'Má, giá tình cảm giờ có nghị định rồi. Chủ trọ thu tiền điện cao hơn giá quy định là bị phạt (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:lanh', 'Con nói gì má nghe không rõ. Tai má chỉ nghe được tiền vô.'],
            ['kp:tram', 'Em giữ sổ thu chi của dãy. Ai có tạm trú rồi thì em ghi giá hộ gia đình. Má thì để em nói sau.'],
            ['kp:lanh', 'Thôi được. Mà nhớ nha, di chúc của cô có một dòng: phòng nào đóng tiền đúng hạn nhất thì...'],
            ['kp:kha', 'Thì sao má?'],
            ['kp:lanh', 'Thì cô thương nhất. Hết rồi. Đi làm đi.'],
          ],
          choices: [
            { t: 'Dạ, con ghi lịch ngày 5 liền', fx: { hearts: { 'kp:lanh': 1 } }, say: [['kp:lanh', 'Ngoan. Người trẻ có lịch là người trẻ có tương lai.']] },
            { t: 'Cảm ơn chị Trâm đã giữ sổ', fx: { hearts: { 'kp:tram': 1 } }, say: [['kp:tram', 'Sổ của em có hai cột: tiền vô, và lý do má không chịu lấy tiền.']] },
            { t: 'Hỏi cô có di chúc thiệt hả', fx: { mood: 2 }, say: [['kp:lanh', 'Thiệt. Viết trong phần ghi chú điện thoại, ngay dưới danh sách đi chợ.']] },
          ],
        },
      },
      {
        id: 'c2_noithat', task: 'Sắm một món đồ cho phòng', hint: 'Nội Thất Nhà Mình của anh Tín, cạnh tiệm tóc (8h-21h).',
        where: 'noithat', from: '08:00', to: '21:00', need: { type: 'furniture', count: 1 },
        scene: {
          lines: [
            ['kp:tin', 'Mời vô mời vô. Phòng 16 m² hả? Để anh đoán: quạt trần kêu, cửa sổ nhìn tường. Đúng không?'],
            ['kp:tin', 'Anh khuyên một cây xanh ở góc đông nam. Không phải phong thủy đâu, tại góc đó trống.'],
            ['kp:tin', 'Đồ nhỏ thì cầm về. Đồ to thì Chú Bảy chở bằng ba gác, thêm 30.000đ, tặng kèm một bài giảng về logistics.'],
            ['bama:bay', '(ngó vô cửa) Tín ơi có đơn chưa? Ba gác đang trống, chỉ có con Mèo KPI ngồi trên thùng khô gà.'],
            ['nar', 'Chú Bảy tự giới thiệu là "Giám đốc Logistics" của Ba & Má. Bộ phận logistics gồm một chiếc ba gác và chú.'],
          ],
          choices: [
            { t: 'Nghe anh Tín tư vấn phong thủy', fx: { mood: 2, hearts: { 'kp:tin': 1 } }, say: [['kp:tin', 'Mệnh gì cũng hợp cây kim tiền. Nhưng hợp nhất là mệnh "có tiền mua".']] },
            { t: 'Chào Chú Bảy', fx: { hearts: { 'bama:bay': 2 } }, say: [['bama:bay', 'Cần chở gì, chở ai, dọn trọ hay đi nhờ, cứ ra trước Ba & Má kêu chú.']] },
          ],
        },
      },
      {
        id: 'c2_nhau', task: 'Ngồi chung bàn ở quán nhậu Một Hai Ba Dô', hint: 'Quán mở 16h-24h trên đường Tâm Mỹ. Dân văn phòng tan làm là ra đây.',
        where: 'quannhau', from: '17:00', to: '23:30', minDay: 5,
        scene: {
          lines: [
            ['kp:manh', 'Vô vô! Bàn này của dân văn phòng, ngồi chung cho vui. Một, hai, ba, dô!'],
            ['kp:ly', 'Uống gì thì uống, sổ nợ chị ghi tên, không ghi họ. Mà tuần rồi có ba anh tên Lộc, chị chưa biết đòi ai.'],
            ['tm:khang', 'Em là Khang, tầng 12. Tụi em đang làm một dự án lớn cho chính khu phố này. Bí mật. Rất bí mật. Em nói hơi nhiều rồi.'],
            ['tech:thac', 'Anh Thạc, tầng 7. Anh chưa ngủ từ thứ Ba. Deploy xong rồi. Anh tự chạy xe về được. Xe anh màu gì ta?'],
            ['kp:manh', 'Đã uống rượu bia thì đừng lái xe. Xe máy mức nhẹ nhất cũng phạt 2-3 triệu, trừ 4 điểm (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:teo', 'Bàn này 14 lon rồi anh Mạnh. Em đếm nhanh hơn máy.'],
          ],
          choices: [
            { t: 'Giữ chìa khóa xe anh Thạc, gọi xe ôm', fx: { hearts: { 'tech:thac': 2, 'kp:manh': 1 }, flag: 'giu_chia_khoa' }, say: [['tech:thac', 'Em là người tốt. Anh sẽ quên mình làm tầng mấy, nhưng anh nhớ em.'], ['kp:luong', 'Lên xe đi cậu. Nhà ở đâu? Không nhớ hả? Không sao, chú chở đi hỏi.']] },
            { t: 'Gọi một dĩa mồi, uống trà đá (50.000đ)', fx: { money: -50000, food: 15, mood: 5 }, say: [['kp:ly', 'Trà đá miễn phí, mồi tính tiền. Em hiểu chuyện, chị thương.']] },
            { t: 'Hỏi Khang dự án bí mật gì', fx: { hearts: { 'tm:khang': 1 } }, say: [['tm:khang', 'Em chỉ nói được là nó có slide. Rất nhiều slide. Ly trà sữa của em ghi "ít ngọt" đó, đừng tin cái ly.']] },
          ],
        },
      },
      {
        id: 'c2_sinhnhat', task: 'Mừng sinh nhật ông Thanh trong hẻm 42', hint: 'Tiệc nhỏ trong hẻm từ 18h. Hàng xóm đông đủ.',
        where: 'hem', from: '18:00', to: '22:30', minDay: 6,
        scene: {
          lines: [
            ['kp:thanh', 'Cảm ơn bà con! Hôm nay tui 69 tuổi, tui hát 69 bài. Đùa thôi, 12 bài.'],
            ['nar', 'Cả hẻm bày bàn nhựa. Cô Lài mang sườn, chị Nhung mang trà sữa, bà Cẩm mang cà phê. Hai bình nước đặt cách nhau đúng một mét.'],
            ['kp:cuong', 'Chúc mừng sinh nhật ông Thanh. Chú chúc bằng miệng, không dùng loa, vì loa không dùng việc riêng.'],
            ['nar', 'Điện thoại bà Phấn rung. Rồi điện thoại cả hẻm rung theo. Bà vừa đăng một tấm ảnh lên Xóm Ơi.'],
            ['kp:phan', 'Bà con coi nè! Bà nhặt ở tiệm photo: "TÂM MỸ PLAZA · Phương án 2027 · Giải phóng mặt bằng Hẻm 42 và Dãy trọ Bình An".'],
            ['nar', 'Trên ảnh là một tòa nhà kính 40 tầng mọc đúng chỗ dãy trọ. Ngón cái của bà Phấn che mất một góc tờ giấy.'],
            ['kp:lanh', '...Dãy trọ của tui?'],
            ['hr:banhmi', 'Hẻm 42 là chỗ xe bánh mì của tui mà...'],
            ['kp:thanh', '(cầm micro) Tui xin hát tặng bà con bài "Biết đâu nguồn cội".'],
          ],
          choices: [
            { t: 'Trấn an mọi người: chưa có gì chắc', fx: { hearts: { 'kp:lanh': 1, 'kp:cuong': 1 } }, say: [['kp:cuong', 'Cháu nói đúng, chưa có giấy tờ gì hết. Nhưng mà... chú cũng muốn biết.']] },
            { t: 'Phóng to tấm ảnh đọc cho kỹ', fx: { mood: -2, xomoi: 'Bà Phấn: Ai biết gì về "TÂM MỸ PLAZA" báo nhóm liền! Bà chụp màn hình hết rồi, đừng ai xóa gì.' }, say: [['nar', 'Phóng to tới mức thấy cả vân tay bà Phấn. Chữ bị che vẫn bị che.']] },
            { t: 'Rót cho cô Ba ly trà nóng', fx: { hearts: { 'kp:lanh': 2 } }, say: [['kp:lanh', 'Cô không sao. Cô chỉ... về ngủ sớm chút.']] },
          ],
        },
      },
    ],
    done: 'Một tuần ở Khu phố 7: có chỗ quen, món quen, người quen. Và một tấm slide làm cả hẻm mất ngủ.',
  },

  // ───────────────────────────── Chương 3 · days 7-13 ─────────────────────────────
  {
    id: 'c3', title: 'Chương 3 · Tin đồn Tâm Mỹ Plaza',
    intro: 'Tấm ảnh "Tâm Mỹ Plaza" chạy khắp Xóm Ơi. Không ai có giấy tờ gì, nhưng ai cũng có ý kiến.',
    beats: [
      {
        id: 'c3_coba', task: 'Hỏi thăm cô Ba Lành', hint: 'Về dãy trọ Bình An, từ sáng tới tối.',
        where: 'phongtro', from: '06:00', to: '22:30',
        scene: {
          lines: [
            ['kp:lanh', 'Cô không lo. Cô chỉ thức tới 3 giờ sáng đọc Xóm Ơi thôi.'],
            ['kp:lanh', 'Dãy trọ này cô xây năm 1998, từng viên gạch. Phòng 3 hồi đó cho một con nhỏ thuê làm văn phòng, nghèo mà lì lắm.'],
            ['kp:kha', 'Má, nếu có dự án thiệt thì nhà mình được đền bù! Con sơn pastel trước cho được giá.'],
            ['kp:lanh', 'Sơn pastel thì chừng nào má chết. Mà má chưa chết, má còn khỏe lắm.'],
            ['kp:tram', 'Em chỉ lo bé Khoai. Nó mới vô lớp 1, tập thể dục giữa giờ hăng nhất trường. Dời đi chỗ khác nó buồn.'],
            ['kp:lanh', '{ten}, con mới tới, con không phe nào hết. Con đi hỏi giùm cô coi chuyện này thiệt hay giả được không?'],
          ],
          choices: [
            { t: 'Con hứa sẽ tìm ra sự thật', fx: { hearts: { 'kp:lanh': 2 }, flag: 'hua_coba' }, say: [['kp:lanh', 'Hứa thì nhớ nha. Cô không ghi vô di chúc, nhưng cô ghi vô sổ.']] },
            { t: 'Khuyên anh Kha đừng sơn vội', fx: { hearts: { 'kp:lanh': 1, 'kp:kha': -1 } }, say: [['kp:kha', 'Thôi được, anh mua sơn rồi để đó. Sơn đâu có hết hạn. Mà có hả?']] },
            { t: 'Hỏi cô về người thuê phòng 3', fx: { hearts: { 'kp:lanh': 1 } }, say: [['kp:lanh', 'Lâu quá cô quên tên. Chỉ nhớ nó có cái máy fax, đêm nào cũng kêu "tít tít". Giờ chắc giàu rồi.']] },
          ],
        },
      },
      {
        id: 'c3_banhmi', task: 'Ghé xe bánh mì, Cô Bánh Mì đang buồn', hint: 'Xe bánh mì đầu hẻm 42 (5h30-9h30, 16h-19h).',
        where: 'banhmi', from: '05:30', to: '19:00', minDay: 7,
        scene: {
          lines: [
            ['hr:banhmi', 'Con ăn đi, cô lấy nửa giá. Lỡ mai cô không bán ở đây nữa thì con còn nhớ cô.'],
            ['hr:banhmi', 'Cô gọi thằng Hưng rồi. Nó kêu cô lên Bình Dương ở với nó. Mà trên đó cô không quen ai, sáng ra không ai mua bánh mì của cô.'],
            ['nar', 'Điện thoại cô lại reo. "Dạ không, cô không ứng tuyển Giám đốc Vận hành." Cô cúp máy, lau mắt bằng tay áo.'],
            ['hr:banhmi', 'Hai mươi năm, cái xe này đứng đúng chỗ này. Tụi nhỏ trong hẻm lớn lên bằng bánh mì của cô.'],
          ],
          choices: [
            { t: 'Nói với cô: con sẽ tìm hiểu', fx: { hearts: { 'hr:banhmi': 2 } }, say: [['hr:banhmi', 'Ừ. Con hỏi được gì thì nói cô. Cô không biết đọc slide.']] },
            { t: 'Trả đủ tiền, gửi thêm 10.000đ', fx: { money: -10000, mood: 2, hearts: { 'hr:banhmi': 1 } }, say: [['hr:banhmi', 'Cô không lấy tiền dư. Thôi để cô bỏ thêm trứng.']] },
          ],
        },
      },
      {
        id: 'c3_photo', task: 'Hỏi chú Tấn ai đã in tấm slide', hint: 'Photo Thần Tốc (7h-21h), đường Tâm Mỹ.',
        where: 'photo', from: '07:00', to: '21:00',
        scene: {
          lines: [
            ['kp:tan', 'Tấm đó hả? Tiệm chú in. 30 bộ, màu, giấy dày. Một tờ kẹt máy, chú bỏ sọt rác. Bà Phấn tới photo nội quy nhóm, thấy, nhặt.'],
            ['kp:tan', 'Người in là một cậu trẻ đeo thẻ tầng 12, cầm ly trà sữa Full Topping. Ly ghi "ít ngọt" mà cậu uống một hơi không nhăn mặt.'],
            ['kp:tan', 'Tên file chú còn nhớ: TamMyPlaza_v7_FINAL_final_that_su_final. Người văn phòng đặt tên file như viết di chúc.'],
            ['nar', 'Chú Tấn lục sọt giấy vụn, đưa bạn nửa trang thứ hai bị kẹt máy. Chỉ còn một dòng: "Giải phóng mặt bằng Hẻm 42 (xe máy..." rồi rách.'],
            ['me', '"Xe máy..." gì? Xe máy bị giải phóng? Xe máy được đền bù?'],
            ['kp:tan', 'Chú chỉ in thôi, chú không đọc. Đọc là phải tính thêm tiền.'],
          ],
          choices: [
            { t: 'Giữ mẩu giấy làm bằng chứng', fx: { hearts: { 'kp:tan': 1 } }, say: [['kp:tan', 'Giữ đi. Tiệm chú còn giữ một lá thư năm 1989 trong cái máy cũ. Giữ đồ là nghề của chú.']] },
            { t: 'Photo mẩu giấy thêm 10 bản (5.000đ)', fx: { money: -5000, mood: 2 }, say: [['kp:tan', 'Photo luôn bằng chứng. Cháu có tố chất làm thám tử. Hoặc làm kế toán.']] },
          ],
        },
      },
      {
        id: 'c3_lam', task: 'Đi làm 2 ngày, tin đồn không trả tiền phòng', hint: 'Trà sữa hoặc công ty của bạn. Vừa làm vừa nghe ngóng.',
        where: 'trasua', need: { type: 'work', count: 2 },
      },
      {
        id: 'c3_trasua', task: 'Hỏi chị Nhung về vị khách "ít ngọt"', hint: 'Trà Sữa Full Topping (9h-22h).',
        where: 'trasua', from: '09:00', to: '21:30',
        scene: {
          lines: [
            ['kp:nhung', 'Ly ghi "ít ngọt" mà ngọt lịm hả? Khang, tầng 12. Ngày nào cũng 15 giờ, 100% đường, ghi "ít ngọt" cho lịch của ảnh đẹp.'],
            ['kp:tu', 'Em pha cho ảnh 47 ly rồi. Ly nào ảnh cũng nói "hôm nay em giảm đường rồi". Không ai tin, kể cả cái ly.'],
            ['kp:bong', 'Tuần rồi ảnh ngồi đây vẽ sơ đồ hẻm 42 lên giấy lót ly. Có ô vuông, có mũi tên, có chữ "gian".'],
            ['kp:nhung', '"Gian" là gian xảo hay gian hàng? Chị không biết. Chị chỉ biết dãy trọ mà bị dời thì quán chị mất nửa khách.'],
          ],
          choices: [
            { t: '(Trà sữa) Xin giữ tờ giấy lót ly', role: 'trasua', fx: { hearts: { 'kp:bong': 1, 'kp:tu': 1 } }, say: [['kp:bong', 'Em cất trong ngăn kéo, kế bên công thức số 41. Cầm đi.']] },
            { t: 'Gọi một ly ít ngọt thiệt (30.000đ)', fx: { money: -30000, mood: 4 }, say: [['kp:tu', '30% đường, đúng chữ "ít ngọt". Hiếm lắm mới có người ghi đúng.']] },
            { t: 'Cảm ơn chị, em sẽ tìm gặp Khang', fx: { hearts: { 'kp:nhung': 1 } }, say: [['kp:nhung', 'Gặp thì nói ảnh: chị không bán ly 100% đường cho người nói dối lịch nữa. Đùa đó, chị vẫn bán.']] },
          ],
        },
      },
      {
        id: 'c3_cattoc', task: 'Ghé tiệm tóc, có người đang livestream', hint: 'Tiệm tóc Đẹp Mỗi Ngày (8h-20h, nghỉ sáng Thứ Hai).',
        where: 'cattoc', from: '08:00', to: '20:00', minDay: 11,
        scene: {
          lines: [
            ['bama:mi', 'Chào cả nhà, Út Mi đây! Hôm nay live từ tiệm tóc. Tin nóng: Khu phố T&M sắp thành Tâm Mỹ Plaza 40 tầng!'],
            ['kp:man', 'Mi ơi, gội đầu thì đừng cầm điện thoại. Nước vô máy là mất luôn tin nóng.'],
            ['tm:gam', '(đầu đang ủ tóc) Chị không được nói đâu nha. Nhưng tầng 12 tuần nào cũng họp chữ "Tâm Mỹ". Chị Tuyết họp xong là cười một mình.'],
            ['kp:ninh', 'Năm 1990 cũng có tin đồn làm sân bay ở đây. Rốt cuộc chỉ có con diều của thằng Hào bay qua.'],
            ['bama:mi', 'Lượt xem lên 2.000 rồi! Ai biết thêm gì bình luận liền nha!'],
          ],
          choices: [
            { t: 'Xin vào live: chưa có gì chính thức', fx: { hearts: { 'bama:mi': 1, 'kp:man': 1 }, flag: 'len_live', xomoi: 'Bà Phấn: Bạn phòng 5 lên live Út Mi nói chưa có gì chính thức. Bà ghi nhận.' }, say: [['bama:mi', 'Cả nhà ơi, bạn này nói chuyện có lý ghê. Lượt xem tăng thêm 300! Cảm ơn nha!']] },
            { t: 'Hỏi chị Gấm thêm một câu', fx: { hearts: { 'tm:gam': 1 } }, say: [['tm:gam', 'Câu cuối nha: chị Tuyết dặn "làm bất ngờ cho khu phố". Bất ngờ kiểu gì thì chị không biết. Chị chỉ ủ tóc.']] },
            { t: 'Nghe chú Ninh kể chuyện sân bay', fx: { mood: 3, hearts: { 'kp:ninh': 1 } }, say: [['kp:ninh', 'Tin đồn ở khu phố này giống tóc vậy con. Cắt rồi cũng mọc. Mọc thì phải chải.']] },
          ],
        },
      },
      {
        id: 'c3_hop', task: 'Họp khẩn ở sân chơi', hint: 'Chú Cường gọi loa: 18h họp ở sân chơi. Cả khu phố tới.',
        where: 'congvien', from: '18:00', to: '21:00', minDay: 13,
        scene: {
          lines: [
            ['kp:cuong', 'Alo alo. Bà con trật tự. Chú nói trước: phường chưa gửi giấy tờ gì về chuyện Plaza. Không thông báo, không lấy ý kiến, không gì hết.'],
            ['kp:cuong', 'Thu hồi đất thật thì phải có thông báo, có kế hoạch, có lấy ý kiến dân, không phải một tấm slide (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:chin', 'Tui với bà Mười cãi nhau 30 năm, nay tui đứng chung phe bả. Ai dời chợ là đụng hai đứa tui.'],
            ['kp:muoi', 'Lần đầu tiên tui đồng ý với bà Chín. Ghi biên bản giùm tui.'],
            ['bama:bay', 'Nếu phải dời thì chú chở miễn phí cho cả khu phố. Mỗi nhà một chuyến. Chú tính lộ trình rồi.'],
            ['kp:lam', 'Bà con bình tĩnh, giữ huyết áp. Tuần này trạm đo cho 14 người tăng huyết áp vì đọc Xóm Ơi.'],
            ['nar', 'Ở góc sân, đội bóng mini của bé Kem vẫn tập. Quả bóng lăn tới chân chú Cường. Chú sút trả, trúng cột.'],
            ['kp:cuong', 'Vậy giờ mình làm gì? Ai có ý kiến?'],
          ],
          choices: [
            { t: 'Đề xuất làm "Sổ ký ức Khu phố 7"', fx: { hearts: { 'kp:cuong': 2, 'kp:nga': 1 } }, say: [['me', 'Mình đi gom chuyện từng nhà, từng sạp. Lỡ có ai hỏi khu phố này đáng giá gì, mình có cái để đưa ra.'], ['kp:cuong', 'Hay. Chú cho cháu mượn cuốn sổ của văn phòng. Từ nay cháu là "điều tra viên không lương" của khu phố.']] },
            { t: 'Đề xuất lên thẳng tầng 12 hỏi', fx: { hearts: { 'kp:cuong': 1, 'kp:kha': 1 } }, say: [['kp:cuong', 'Đi tay không thì người ta mời uống nước rồi tiễn. Cháu gom chuyện khu phố vô sổ trước, có sổ trong tay rồi lên.'], ['kp:cuong', 'Cháu làm "điều tra viên không lương" nha. Sổ đây.']] },
            { t: 'Đề xuất ông Thanh hát phản đối', fx: { mood: 4, hearts: { 'kp:thanh': 2 } }, say: [['kp:thanh', 'Tui hát liền! "Hẻm 42 của tui, ai lấy tui buồn..."'], ['kp:cuong', 'Thôi ông. Cháu {ten} đi gom chuyện từng nhà giùm chú, làm "điều tra viên không lương". Có sổ trong tay rồi mình lên tầng 12.']] },
          ],
        },
      },
    ],
    done: 'Bạn nhận cuốn "Sổ ký ức Khu phố 7" và một chức danh không lương. Khu phố có hẳn một người đi hỏi chuyện.',
  },

  // ───────────────────────────── Chương 4 · days 15-25 ─────────────────────────────
  {
    id: 'c4', title: 'Chương 4 · Sổ ký ức Khu phố 7',
    intro: 'Mỗi nhà một chuyện, mỗi sạp một ký ức. Gom cho đủ, rồi mới lên tầng 12.',
    beats: [
      {
        id: 'c4_cho', task: 'Xin ký ức ở chợ Tâm Mỹ', hint: 'Chợ mở 4h30-12h. Dì Chín sạp rau, cô Mười sạp cá.',
        where: 'cho', from: '05:00', to: '11:30', minDay: 15,
        scene: {
          lines: [
            ['kp:chin', 'Ký ức hả? Năm 2003 mái chợ dột. Cả khu phố góp tiền lợp lại, mỗi nhà một tấm tôn, ai góp thì ghi tên dưới tấm tôn.'],
            ['kp:muoi', 'Tấm tôn của tui to hơn tấm của bà Chín.'],
            ['kp:chin', 'Tấm của tui dày hơn. Mưa xuống tấm của bà kêu lộp độp, tấm của tui kêu êm như ru.'],
            ['audit:sang', 'Anh là Sang, giữ sổ doanh thu cho 40 hộ trong khu phố. Chủ nhật anh ra chợ dạy cô chú xài app thuế. Tấm tôn thì anh không giữ sổ.'],
            ['audit:sang', 'Nói thiệt, sổ nào anh cũng thấy: tiền chợ chạy qua cơm tấm, qua trà sữa, rồi vòng về chợ. Chợ này nuôi cả khu phố.'],
            ['kp:chin', 'Con ghi vô sổ đi: "Mái chợ Tâm Mỹ có tên 212 nhà". Tên tui viết bằng sơn đỏ.'],
          ],
          choices: [
            { t: 'Mua bó rau muống ủng hộ (15.000đ)', fx: { money: -15000, hearts: { 'kp:chin': 1 } }, say: [['kp:chin', 'Rau mới cắt sáng nay. Nấu canh thì mua thêm cá bà Mười. Nói nhỏ thôi, đừng để bả nghe.']] },
            { t: 'Đếm giùm tên dưới mái tôn', fx: { energy: -5, hearts: { 'kp:chin': 1, 'kp:muoi': 1 } }, say: [['nar', 'Bạn đếm được 212 cái tên. Có tên cô Ba Lành, tên Chú Bảy, và một dòng viết nắn nót: "Tuyết, phòng 3".']] },
            { t: '(Cân Đối) Phụ anh Sang ghi sổ cô Sáu', role: 'audit', fx: { hearts: { 'audit:sang': 2, 'bama:cosau': 1 } }, say: [['audit:sang', 'Sổ cô Sáu ghi bằng bút chì, gôm mòn một cục. Làm Cân Đối là biết: bút chì là kẻ thù của kiểm toán.']] },
          ],
        },
      },
      {
        id: 'c4_tramyte', task: 'Gặp bác sĩ Lâm ở trạm y tế', hint: 'Trạm y tế phường mở 7h-17h.',
        where: 'tramyte', from: '07:00', to: '17:00', minDay: 16,
        scene: {
          lines: [
            ['kp:lam', 'Ngồi đo huyết áp đã rồi nói. 135 trên 85. Cháu đọc Xóm Ơi nhiều quá.'],
            ['kp:lam', 'Ký ức hả? Bác đang số hóa sổ sinh cũ của trạm. Một nửa khu phố này chào đời ở đây, khóc ở đây, chích ngừa ở đây.'],
            ['kp:thuy', 'Có đêm cúp điện, cả hẻm 42 cầm đèn pin đứng ngoài cửa trạm soi cho bác sĩ đỡ đẻ. Sáng ra cả hẻm mất ngủ mà cười.'],
            ['kp:anh', 'Còn quầy thuốc này bán men tiêu hóa cho quán nhậu, băng dán cho tụi nhỏ đá bóng, kẹo ngậm cho ông Thanh sau mỗi đêm hát.'],
            ['kp:lam', 'Khám ở trạm có thẻ bảo hiểm y tế thì gần như không tốn gì, dưới mức quy định là bảo hiểm trả hết (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:lam', 'Nếu khu phố có làm gì cho bà con, nhớ chừa bác một góc đo huyết áp miễn phí nha.'],
          ],
          choices: [
            { t: 'Ghi chuyện đêm đèn pin vào sổ', fx: { mood: 3, hearts: { 'kp:thuy': 1, 'kp:lam': 1 } }, say: [['kp:thuy', 'Ghi đi em. Em bé đêm đó giờ lớn rồi, mỗi lần đi ngang trạm còn ghé chào.']] },
            { t: 'Hứa chừa góc đo huyết áp', fx: { hearts: { 'kp:lam': 2 } }, say: [['kp:lam', 'Hứa rồi đó. Tới bữa đó bác đo cho người hứa trước.']] },
            { t: 'Mua men tiêu hóa phòng hờ (20.000đ)', fx: { money: -20000, hearts: { 'kp:anh': 1 } }, say: [['kp:anh', 'Uống sau khi ăn. Không phải sau khi đọc Xóm Ơi.']] },
          ],
        },
      },
      {
        id: 'c4_truong', task: 'Xem lớp 5A vẽ "Khu phố của em"', hint: 'Cổng trường, giờ tan 16h-17h30.',
        where: 'truong_th', from: '16:00', to: '17:30', minDay: 18,
        scene: {
          lines: [
            ['kp:dao', 'Tiết Mỹ thuật tuần này cô cho lớp vẽ "Khu phố của em". Em coi nè, ba mươi lăm bức, bức nào cũng có xe bánh mì.'],
            ['nar', 'Bé Su vẽ xe bánh mì kèm bảng giá, ghi rõ "đã tăng 2.000đ". Bé Ốc vẽ y chang, thêm một ngôi sao "đẹp hơn bạn Su".'],
            ['kp:su', 'Con vẽ đúng giá thật mà cô.'],
            ['kp:oc', 'Con vẽ thêm ba gác Chú Bảy, có con mèo nằm trên thùng khô gà. Vậy là con nhiều chi tiết hơn.'],
            ['kp:xuan', 'Không có bức nào vẽ tòa nhà 40 tầng hết. Tụi nhỏ vẽ cái tụi nó thương.'],
            ['kp:dao', 'Cô muốn treo tranh cho cả khu phố coi, mà lớp hết bút màu rồi. Trường thì không thu quỹ lớp.'],
          ],
          choices: [
            { t: 'Tặng lớp một hộp bút màu (30.000đ)', fx: { money: -30000, hearts: { 'kp:dao': 2, 'kp:xuan': 1 }, flag: 'tranh_tre_em' }, say: [['kp:dao', 'Cảm ơn em. Lớp sẽ vẽ thêm. Bức nào đẹp cô để dành cho khu phố.']] },
            { t: 'Khen cả hai bức đều 10 điểm', fx: { mood: 3, hearts: { 'kp:su': 1, 'kp:oc': 1 } }, say: [['kp:su', 'Hai bức mười điểm là hòa.'], ['kp:oc', 'Hòa là con thắng, vì con có vẽ con mèo.']] },
          ],
        },
      },
      {
        id: 'c4_net', task: 'Ghé Net Không Lag hỏi chuyện', hint: 'Quán net mở 8h-22h. Buổi tối Bình (IT tầng 12) hay ghé sửa máy.',
        where: 'net', from: '17:00', to: '21:45', minDay: 19,
        scene: {
          lines: [
            ['kp:hao', 'Vô chơi hay vô hỏi? Hỏi thì miễn phí. Quán đóng 22 giờ, mở lại 8 giờ, luật vậy (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['nar', 'Bé Tôm và bé Mít đang đánh một trận, vở bài tập làm xong để kế bàn phím làm bằng chứng. Pháo đứng sau canh đồng hồ.'],
            ['kp:phao', 'Còn 14 phút nữa là tụi em về học bài nha. Anh Hào dặn rồi.'],
            ['tm:binh', 'Em là Bình, IT tầng 12. Em sửa máy cho quán đổi lấy giờ chơi. Chuyện Plaza hả? Em ký cam kết bảo mật rồi.'],
            ['tm:binh', 'Em chỉ nói bằng ánh mắt thôi. Hôm trước em cài lại máy cho chị Hân, thấy một thư mục: "Plaza / Sơ đồ gian hàng / Hẻm 42 (Chủ nhật)".'],
            ['me', 'Gian hàng. Chủ nhật. Ai lại xây tòa nhà 40 tầng vào ngày Chủ nhật?'],
            ['kp:hao', 'Người văn phòng làm gì cũng có thư mục. Tui mở quán net mười năm, chỉ có một thư mục tên "Game".'],
          ],
          choices: [
            { t: 'Mời Bình một chai nước (10.000đ)', fx: { money: -10000, hearts: { 'tm:binh': 2 } }, say: [['tm:binh', 'Em không nói gì hết nha. Em chỉ uống nước. Mắt em thì nói hơi nhiều.']] },
            { t: 'Khen anh Hào giữ giờ cho tụi nhỏ', fx: { hearts: { 'kp:hao': 1, 'kp:phao': 1 } }, say: [['kp:hao', 'Thua trận thì về học bài. Thắng trận cũng về học bài. Luật quán tui.']] },
            { t: '(Nợ Kỹ Thuật) Phụ Bình sửa máy treo', role: 'tech', fx: { energy: -4, hearts: { 'tm:binh': 1, 'kp:hao': 2 } }, say: [['kp:hao', 'Máy số 7 treo ba tháng nay, sửa một phát chạy. Tầng 7 với tầng 12 hợp tác, hiếm à nha.']] },
          ],
        },
      },
      {
        id: 'c4_bama', task: 'Ghé Ba & Má nghe bác Hùng kể chuyện', hint: 'Ba & Má: cửa hàng 8h-21h, xưởng làm tới 17h.',
        where: 'bama', from: '08:00', to: '17:00', minDay: 21,
        scene: {
          lines: [
            ['bama:hung', 'Mẻ khô gà đầu tiên bác bán ở cổng trường, gói bằng giấy báo. Phụ huynh mua cho con, con lớn lên mua cho con của nó.'],
            ['bama:tuan', 'Ba, con làm slide rồi: "Ba & Má x Tâm Mỹ Plaza: chiến lược khu ẩm thực tầng trệt". Mình vô Plaza trước đối thủ!'],
            ['bama:hang', 'Tuấn. Đất là của nhà mình. Plaza thì chưa có. Slide con có 47 trang, má đọc trang 1 là đủ.'],
            ['bama:tu', '(từ sân sau) Cua! Bắp! Cô Tư thấy hết rồi nha! Khô chưa ráo, ăn là đau bụng!'],
            ['nar', 'Hai cái bóng nhỏ chạy vụt qua rào, mỗi đứa ngậm một miếng khô gà. Con bù nhìn đội nón lá đứng nhìn, bất lực.'],
            ['bama:hung', 'Con ghi vô sổ: khu phố này nuôi Ba & Má hai mươi năm. Đi đâu thì đi, giàn phơi phải nhìn ra cổng trường.'],
          ],
          choices: [
            { t: 'Ghi câu của bác Hùng vào sổ', fx: { hearts: { 'bama:hung': 2 } }, say: [['bama:hung', 'Ghi đẹp nha. Chữ bác xấu, nên bác nói cho người khác ghi.']] },
            { t: 'Góp ý slide của Kevin Tuấn', fx: { hearts: { 'bama:tuan': 1, 'bama:hang': 1 } }, say: [['me', 'Slide đẹp, nhưng Plaza chưa có thật. Anh để dành trang 2 tới 47 cho chuyện khác nha.'], ['bama:tuan', 'Ok, em "pivot". Em làm slide về gói học sinh vậy.']] },
            { t: '(Ba & Má) Phụ Cô Tư canh giàn phơi', role: 'bama', fx: { energy: -5, hearts: { 'bama:tu': 2 } }, say: [['bama:tu', 'Có người canh chung là Cô Tư ngồi nghỉ được năm phút. Năm phút đó Cô Tư nếm khô.']] },
          ],
        },
      },
      {
        id: 'c4_que', task: 'Đi một vòng với ông Quế xe đạp ôm', hint: 'Bến xe ôm đầu hẻm 42. Ông Quế chạy chậm, kể nhiều.',
        where: 'xeom', from: '06:00', to: '18:00', minDay: 23,
        scene: {
          lines: [
            ['kp:que', 'Lên đi con, ông chở một vòng. Tiền xe thì tính, tiền ký ức thì không.'],
            ['kp:que', 'Chỗ cao ốc bây giờ hồi xưa là ruộng rau muống. Chỗ trà sữa là tiệm sửa xe. Tiệm tóc thì vẫn là tiệm tóc, chú Ninh hớt từ hồi đó.'],
            ['kp:que', 'Hai mươi năm trước có một cô gái thuê phòng 3 dãy cô Ba. Sáng nào cũng đi xe đạp ôm của ông lên phường làm giấy phép công ty.'],
            ['kp:que', 'Cổ ôm cái máy fax trong lòng, nói "con sẽ làm công ty tư vấn". Ông hỏi tư vấn là gì, cổ nói "là nói cho người ta biết cái người ta đã biết".'],
            ['me', 'Phòng 3. Công ty tư vấn. Tầng 12. Một khu phố tên "T&M".'],
            ['kp:que', 'Tên cổ là Tuyết. Giờ cổ ở trên tầng cao nhất. Không đi xe đạp ôm nữa, nhưng Tết năm nào cũng gửi ông một hộp bánh.'],
          ],
          choices: [
            { t: 'Trả ông 10.000đ, cảm ơn ông', fx: { money: -10000, hearts: { 'kp:que': 2 } }, say: [['kp:que', 'Ông nhận tiền xe. Tiền chuyện thì ông cho.']] },
            { t: 'Hỏi ông: cô Tuyết còn thương khu phố?', fx: { mood: 3, hearts: { 'kp:que': 1 } }, say: [['kp:que', 'Người ta lên cao rồi thì hay nhìn xuống. Nhìn xuống mà còn thấy hẻm 42 là còn thương.']] },
          ],
        },
      },
      {
        id: 'c4_giao', task: 'Đưa Sổ ký ức cho chú Cường', hint: 'Văn phòng Khu phố 7 (7h-11h).',
        where: 'khupho', from: '07:00', to: '11:00', minDay: 25,
        scene: {
          lines: [
            ['kp:cuong', 'Đưa chú coi. Mái chợ 212 cái tên. Đêm đèn pin ở trạm y tế. Khô gà gói giấy báo. Ruộng rau muống...'],
            ['kp:cuong', 'Chú làm Trưởng khu phố mười năm, chưa ai gom lại được như vầy. Đọc mà muốn mượn loa đọc cho cả khu phố nghe.'],
            ['kp:nga', 'Anh Cường, loa không dùng việc riêng.'],
            ['kp:cuong', 'Đây là việc chung mà cô Nga.'],
            ['kp:nga', 'Vậy đọc đi. Mà đọc nhỏ thôi, ông Thanh đang ngủ bù.'],
            ['kp:cuong', 'Còn chuyện cô Tuyết phòng 3, tầng 12... Có sổ trong tay rồi, cháu lên hỏi thẳng giùm chú. Chú già rồi, thang máy kẹt là chú hoảng.'],
          ],
          choices: [
            { t: 'Dạ, con lên tầng 12', fx: { mood: 3, hearts: { 'kp:cuong': 2 } }, say: [['kp:cuong', 'Mặc áo cho đàng hoàng. Trên đó người ta nhìn áo trước rồi mới nhìn sổ.']] },
            { t: 'Xin chú đọc một trang lên loa', fx: { hearts: { 'kp:cuong': 1, 'kp:nga': 1 }, xomoi: 'Bà Phấn: Sáng nay chú Cường đọc loa chuyện mái chợ 212 cái tên. Bà khóc. Cấm ai chụp màn hình bà khóc.' }, say: [['nar', 'Loa phường vang lên chuyện mái tôn năm 2003. Ngoài chợ, dì Chín và cô Mười đứng im nghe. Không ai cãi ai.']] },
          ],
        },
      },
    ],
    done: 'Cuốn sổ dày lên, khu phố hiện ra từng trang. Giờ tới lượt tầng 12 trả lời.',
  },

  // ───────────────────────────── Chương 5 · days 27-35 ─────────────────────────────
  {
    id: 'c5', title: 'Chương 5 · Tầng 12',
    intro: 'Cao ốc Tâm Mỹ, tầng cao nhất: T&M Partners. Thang máy kẹt lúc 8h và 12h. Sự thật thì kẹt lâu hơn.',
    beats: [
      {
        id: 'c5_dinh', task: 'Xin anh Định cho lên tầng 12', hint: 'Sảnh Cao ốc Tâm Mỹ (từ 8h). Tránh giờ kẹt thang máy.',
        where: 'toanha', from: '08:00', to: '18:00', minDay: 27,
        scene: {
          lines: [
            ['kp:dinh', 'Lên tầng 12 hả? Có thẻ không? Không thẻ thì phải có hẹn. Không hẹn thì phải có trà sữa.'],
            ['kp:dinh', 'Vợ anh bán trà sữa bên này đường, mẹ anh bán cà phê bên kia. Anh đứng giữa cả ngày, quen rồi.'],
            ['kp:dinh', 'Tuần trước anh Đạt tầng 12 mượn anh cây thước dây, nói đo hẻm "cho sprint". Sprint là chạy nước rút mà, đo hẻm để chạy hả?'],
            ['nar', 'Thang máy mở ra. Bên trong là chị Gấm, ba ly trà sữa và con Mèo KPI. Con mèo bấm nút tầng 12 bằng đuôi.'],
          ],
          choices: [
            { t: '(T&M) Quẹt thẻ thực tập, lên luôn', role: 'tm', fx: { hearts: { 'kp:dinh': 1, 'tm:gam': 1 } }, say: [['kp:dinh', 'Người nhà T&M! Lên đi. Nhớ đừng đi ngang phòng chị Tuyết lúc chị đang gọi điện.']] },
            { t: 'Mua trà sữa giao lên tầng 12 (30.000đ)', fx: { money: -30000, hearts: { 'kp:dinh': 1 } }, say: [['kp:dinh', 'Giao trà sữa là hợp lệ. Ly 100% đường ghi "ít ngọt" là của Khang, ảnh hẹn em ở quán lúc 15 giờ.']] },
            { t: 'Đợi 15h, chặn Khang ở quán trà sữa', fx: { mood: 2 }, say: [['kp:dinh', 'Thông minh. 15 giờ nào Khang cũng xuống. Đúng như đồng hồ, ngọt như đường.']] },
          ],
        },
      },
      {
        id: 'c5_khang', task: 'Gặp Khang ở quán trà sữa lúc 15h', hint: 'Trà Sữa Full Topping, khoảng 14h30-16h30.',
        where: 'trasua', from: '14:30', to: '16:30',
        scene: {
          lines: [
            ['tm:khang', 'Anh chị hỏi cả tòa nhà tìm em hả? Em biết rồi. Ngồi đi. Em gọi ly 100% đường, à, ly ít ngọt.'],
            ['tm:khang', 'Em không được nói. Nhưng em cho anh chị coi trang 2 bản đầy đủ được. Trang đó là trang công khai, chỉ là chưa công khai.'],
            ['nar', 'Trên điện thoại: "Giải phóng mặt bằng Hẻm 42 (xe máy dời ra đầu hẻm, 7h-22h, một ngày Chủ nhật mỗi tháng)".'],
            ['me', 'Xe máy dời ra đầu hẻm. Một ngày Chủ nhật. Phần trong ngoặc là phần bị ngón cái bà Phấn che mất.'],
            ['tm:khang', 'Plaza là quảng trường. Chị Tuyết muốn hẻm 42 thành phố đi bộ mỗi tháng một ngày: có gian hàng, có đèn, có ghế. Không ai bị dời hết.'],
            ['me', 'Vậy còn tòa nhà kính 40 tầng?'],
            ['tm:khang', 'Cái đó... là ảnh bìa. Bên Trend Trễ làm. Em nói "đừng", anh Tùng nói "make it pop". Rồi nó pop thiệt.'],
          ],
          choices: [
            { t: 'Bật cười, rồi thở phào', fx: { mood: 8, hearts: { 'tm:khang': 1 } }, say: [['tm:khang', 'Anh chị cười là em nhẹ người. Tuần này em uống 100% đường vì stress, không phải vì thích. Hơi thích.']] },
            { t: 'Trách Khang: cả khu phố mất ngủ', fx: { hearts: { 'tm:khang': -1, 'kp:lanh': 1 } }, say: [['tm:khang', 'Em biết. Em xin lỗi. Em có ghi vô lịch "xin lỗi khu phố", mà em ghi nhiều thứ vô lịch rồi để đó.']] },
            { t: 'Hỏi: sao lại giữ bí mật?', fx: { hearts: { 'tm:khang': 1 } }, say: [['tm:khang', 'Chị Tuyết muốn làm bất ngờ. Chị nói khu phố này cho chị bắt đầu, chị muốn trả lại một ngày vui. Rồi slide chạy trước chị.']] },
          ],
        },
      },
      {
        id: 'c5_agency', task: 'Lên loft Trend Trễ hỏi chuyện ảnh bìa', hint: 'Loft sân thượng nhà phố đối diện cao ốc (từ 10h).',
        where: 'agency', from: '10:00', to: '20:00', minDay: 29,
        scene: {
          lines: [
            ['agency:tung', 'Ảnh bìa đó hả? Bản đầu là cái xe bánh mì đầu hẻm 42, nắng sớm, khói bay. Đẹp. Nhưng chưa đủ pop.'],
            ['agency:tung', 'Nên anh thay bằng tòa nhà kính 40 tầng. Khách nhìn vô là "wow". Ai ngờ khu phố nhìn vô cũng "wow", mà wow kiểu khác.'],
            ['agency:vy', 'Em làm 47 phiên bản font cho chữ "Plaza". Không ai chọn bản viết tay. Mà bản viết tay giống chữ trên xe bánh mì nhất.'],
            ['agency:thi', 'Slogan em viết: "Tâm Mỹ Plaza: khi hẻm hóa quảng trường". Em là nhà thơ, em đâu ngờ thơ mình làm cả khu phố đi đo huyết áp.'],
            ['agency:tung', 'Xin lỗi khu phố giùm anh nha. Lần sau anh "make it pop" vừa vừa thôi.'],
          ],
          choices: [
            { t: 'Xin bản bìa gốc có xe bánh mì', fx: { hearts: { 'agency:vy': 2, 'agency:tung': 1 }, flag: 'bia_goc' }, say: [['agency:vy', 'Em gửi file gốc, kèm font viết tay. Cuối cùng cũng có người chọn nó.']] },
            { t: 'Khen câu slogan của Thi', fx: { hearts: { 'agency:thi': 2 } }, say: [['agency:thi', 'Cảm ơn. Em sẽ viết một bài thơ xin lỗi. Dài 47 câu, mỗi câu một font.']] },
            { t: '(Trend Trễ) Đề xuất làm lại bìa "không pop"', role: 'agency', fx: { hearts: { 'agency:tung': 1, 'agency:vy': 1 }, flag: 'bia_goc' }, say: [['agency:tung', 'Một cái bìa không pop. Nghe lạ, nhưng làm đi. Thực tập sinh có quyền đề xuất, anh có quyền ngạc nhiên.']] },
          ],
        },
      },
      {
        id: 'c5_lam', task: 'Đi làm 2 ngày, chờ chị Tuyết đi công tác về', hint: 'Trợ lý Thư báo: chị Tuyết đi công tác vài ngày. Trà sữa hoặc công ty của bạn.',
        where: 'toanha', need: { type: 'work', count: 2 },
      },
      {
        id: 'c5_tuyet', task: 'Chị Tuyết đang đứng trước phòng 3', hint: 'Về dãy trọ Bình An, chiều tối.',
        where: 'phongtro', from: '16:00', to: '22:00', minDay: 33,
        scene: {
          lines: [
            ['nar', 'Trước cửa phòng 3 có một người phụ nữ mặc vest, tay cầm hộp bánh. Chiếc xe đen phải đậu ngoài đường lớn vì không vô lọt hẻm.'],
            ['tm:tuyet', 'Em là {ten} phải không? Ông Quế kể rồi. Chị là Tuyết. Hai mươi năm trước chị ở phòng này, với một cái bàn và một cái máy fax.'],
            ['tm:tuyet', 'Hồi đó chị không có khách, không có tiền. Cô Ba cho chị khất tiền phòng hai tháng. Tiền thì chị trả lâu rồi, còn cái ơn thì chưa.'],
            ['tm:tuyet', 'Người già bảo T&M là Tâm Mỹ, công ty chị bảo là tên công ty. Chị chưa bao giờ đính chính. Chị thích cả hai.'],
            ['tm:tuyet', 'Plaza là món quà chị muốn tặng: mỗi tháng một ngày hẻm 42 thành phố đi bộ, T&M lo đèn, lo rạp. Bất ngờ thì có, mà sai kiểu.'],
            ['kp:lanh', '(mở cửa phòng 1) Con nhỏ máy fax! Hai mươi năm mới về. Vô đây ngồi, đứng ngoài đó muỗi cắn.'],
            ['tm:tuyet', 'Cô Ba... Con xin lỗi cô. Con làm cả khu phố lo.'],
            ['kp:lanh', 'Lo thì có lo. Mà nhờ lo, cả khu phố mới ngồi lại kể chuyện với nhau. Giờ tính sao đây con?'],
          ],
          choices: [
            { t: 'Đề xuất: khu phố tự làm, T&M chỉ phụ', fx: { hearts: { 'kp:lanh': 2, 'tm:tuyet': 1 }, flag: 'khu_pho_lam_chu' }, say: [['me', 'Không phải Plaza. Là Hội chợ Khu phố 7. Khu phố làm chủ, công ty phụ một tay.'], ['tm:tuyet', 'Được. Lần đầu tiên trong hai mươi năm, chị nhận vai phụ. Chị sẽ học.']] },
            { t: 'Đề xuất: để T&M tổ chức cho chuyên nghiệp', fx: { hearts: { 'tm:tuyet': 2 }, flag: 'tm_lam_chu' }, say: [['tm:tuyet', 'Chị cảm ơn. Chị giao cho anh Đạt. Anh Đạt rất muốn "chạy sprint" cho khu phố.'], ['kp:lanh', 'Sprint là cái gì cô không biết, nhưng nghe đã thấy mệt.']] },
            { t: 'Đòi đền: mỗi nhà một ly trà sữa', fx: { mood: 5, hearts: { 'tm:tuyet': 1, 'kp:lanh': 1 }, flag: 'khu_pho_lam_chu' }, say: [['tm:tuyet', 'Đền. Ly ít ngọt thật nha, không phải kiểu của Khang. Còn tổ chức thế nào thì khu phố quyết, chị phụ.']] },
          ],
        },
      },
      {
        id: 'c5_xinloi', task: 'Chị Tuyết đính chính trên loa khu phố', hint: 'Văn phòng Khu phố 7 (7h-11h).',
        where: 'khupho', from: '07:00', to: '11:00',
        scene: {
          lines: [
            ['kp:cuong', 'Alo alo. Hôm nay loa dùng cho việc chung: đính chính chuyện Plaza. Mời chị Tuyết.'],
            ['tm:tuyet', 'Bà con Khu phố 7, tôi là Tuyết, từng thuê phòng 3 dãy Bình An. Không có tòa nhà nào hết, không ai bị dời hết. Tấm ảnh bìa là lỗi của công ty tôi.'],
            ['tm:tuyet', 'Chữ bị che trong ảnh là: "xe máy dời ra đầu hẻm, một ngày Chủ nhật". Tôi xin lỗi vì đã làm bà con mất ngủ.'],
            ['kp:phan', 'Tại ngón cái của tui. Tui xin lỗi luôn. Tui xóa bài rồi, nhưng còn giữ ảnh chụp màn hình để làm bằng chứng là tui đã xóa.'],
            ['kp:kha', 'Vậy là... không có đền bù hả?'],
            ['kp:lanh', 'Có. Đền bù bằng việc con khỏi sơn pastel.'],
            ['kp:cuong', 'Plaza thì không. Nhưng một ngày hội trong hẻm thì được. Mà phải là khu phố làm, không phải slide làm.'],
          ],
          choices: [
            { t: 'Vỗ tay thật to', fx: { mood: 6, hearts: { 'tm:tuyet': 1, 'kp:cuong': 1 }, xomoi: 'Bà Phấn: ĐÍNH CHÍNH. Không có Plaza. Có hội chợ. Ai còn nói Plaza bà mời ra khỏi nhóm.' }, say: [['nar', 'Cả văn phòng khu phố vỗ tay. Ngoài đường, Chú Bảy bóp kèn ba gác ba cái cho có không khí.']] },
            { t: 'An ủi bà Phấn', fx: { hearts: { 'kp:phan': 2 } }, say: [['kp:phan', 'Bà không buồn. Bà chỉ thêm nội quy: điều 15, chụp ảnh thì bỏ ngón cái ra.']] },
          ],
        },
      },
      {
        id: 'c5_banhmi', task: 'Báo tin vui cho Cô Bánh Mì', hint: 'Xe bánh mì đầu hẻm 42 (5h30-9h30, 16h-19h).',
        where: 'banhmi', from: '05:30', to: '19:00', minDay: 35,
        scene: {
          lines: [
            ['hr:banhmi', 'Cô nghe loa rồi. Nghe hai lần cho chắc. Lần thứ hai cô khóc, lần thứ nhất cô chưa hiểu.'],
            ['hr:banhmi', 'Cô gói đồ vô hai thùng các-tông rồi đó. Giờ cô mở ra. Trong thùng có cái chảo, cái ghế nhựa, và tấm bảng giá cũ.'],
            ['nar', 'Điện thoại reo. Lần này không phải công ty săn người. Là Hưng.'],
            ['kp:hung', '(qua điện thoại) Má, con nghe nói hẻm mình không bị dời hả? Vậy Tết con về, má để dành con ổ bánh mì đầu năm nha.'],
            ['hr:banhmi', 'Để dành. Ổ đầu tiên của năm là của con. Ổ thứ hai là của đứa phòng 5 đang đứng đây.'],
          ],
          choices: [
            { t: 'Phụ cô bày lại xe', fx: { energy: -4, hearts: { 'hr:banhmi': 2 } }, say: [['hr:banhmi', 'Bảng giá treo lại chỗ cũ. Giá thì... cô giữ giá cũ thêm một tháng, mừng.']] },
            { t: 'Chúc anh Hưng mạnh khỏe', fx: { mood: 3, hearts: { 'hr:banhmi': 1, 'kp:hung': 1 } }, say: [['kp:hung', 'Cảm ơn bạn đã ở gần má mình. Tết về mình mời bạn ổ bánh mì. À, má mình mời.']] },
          ],
        },
      },
    ],
    done: 'Không có Plaza. Có một chị Tuyết về thăm phòng 3, và một khu phố muốn tự làm ngày hội của mình.',
  },

  // ───────────────────────────── Chương 6 · days 37-51 ─────────────────────────────
  {
    id: 'c6', title: 'Chương 6 · Hội chợ Khu phố 7',
    intro: 'Không slide, không tòa nhà kính. Chỉ có một con hẻm, bảy công ty, và cả khu phố xắn tay áo.',
    beats: [
      {
        id: 'c6_ban', task: 'Họp ban tổ chức hội chợ', hint: 'Văn phòng Khu phố 7 (7h-11h).',
        where: 'khupho', from: '07:00', to: '11:00', minDay: 37,
        scene: {
          lines: [
            ['kp:cuong', 'Ban tổ chức gồm: chú, cô Nga, cháu {ten}, và chị Tuyết làm "thành viên dự bị".'],
            ['tm:tuyet', 'Dự bị là đúng. Chị ngồi đây để học cách khu phố làm việc mà không cần slide.'],
            ['kp:nga', 'Mượn lòng hẻm làm hội chợ một ngày thì khu phố làm văn bản báo phường, chừa lối cho xe cứu thương (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:thanh', '(chạy vô) Tui xin làm MC! Tui chờ ngày này 69 năm rồi!'],
            ['kp:cuong', 'Ông làm MC chung với anh Duy bên Đi Đâu Cũng Được. Mỗi người một micro. Không ai giành của ai.'],
            ['kp:cuong', 'Cháu lo ba việc: mượn bàn ghế, tìm người đứng gian hàng, nhờ người giữ quỹ cho minh bạch. Xong là chú đọc loa ngày hội.'],
          ],
          choices: [
            { t: 'Nhận việc, lập danh sách liền', fx: { mood: 3, hearts: { 'kp:cuong': 1, 'kp:nga': 1 } }, say: [['kp:nga', 'Danh sách viết tay cho chú Cường đọc được nha. Chú không mở được file tên "final".']] },
            { t: 'Ủng hộ ông Thanh làm MC', fx: { hearts: { 'kp:thanh': 2 } }, say: [['kp:thanh', 'Cảm ơn con! Tui hát mở màn, hát giữa giờ, hát bế mạc. Đùa thôi. Hai bài.']] },
          ],
        },
      },
      {
        id: 'c6_haucan', task: 'Nhận băng đỏ "Ban hậu cần"', hint: 'Chú Lực chờ ở hẻm 42.',
        where: 'hem', from: '06:00', to: '22:00', needFlag: 'khu_pho_lam_chu',
        scene: {
          lines: [
            ['kp:luc', 'Băng đỏ của cháu nè: "Ban hậu cần Khu phố 7". Chú đeo băng này phân luồng cổng trường mười năm, giờ tới lượt cháu.'],
            ['kp:nga', 'Khu phố làm chủ thì ai cũng có việc. Bà Phấn lo truyền thông, ông Quế chở người già, Chú Bảy chở đồ.'],
            ['tm:tuyet', 'Còn chị lo tiền đèn. Và đứng sau. Đứng sau khó hơn chị tưởng.'],
          ],
          choices: [
            { t: 'Đeo băng đỏ, chào nghiêm', fx: { mood: 5, hearts: { 'kp:luc': 2 } }, say: [['kp:luc', 'Đứng thẳng. Thổi còi thì thổi ngắn. Thổi dài là người ta tưởng cháy.']] },
            { t: 'Cảm ơn chị Tuyết chịu đứng sau', fx: { hearts: { 'tm:tuyet': 2 } }, say: [['tm:tuyet', 'Đứng sau thì thấy hết. Hai mươi năm trước chị cũng đứng sau cửa phòng 3 nhìn ra hẻm như vầy.']] },
          ],
        },
      },
      {
        id: 'c6_dat', task: 'Giải cứu cơm tấm khỏi "sprint" của anh Đạt', hint: 'Cơm Tấm Cô Lài, hẻm 7 (mở lại từ 17h).',
        where: 'comtam', from: '17:00', to: '23:30', needFlag: 'tm_lam_chu',
        scene: {
          lines: [
            ['tm:dat', 'Chào em! Anh là Đạt, agile coach. Anh dán 64 tờ giấy nhớ lên tường cơm tấm: "Cần làm", "Đang làm", "Xong". Hội chợ chạy sprint 2 tuần!'],
            ['kp:lai', 'Cậu dán lên nồi nước mắm của tôi rồi đó.'],
            ['tm:dat', 'Nồi nước mắm là "Đang làm" mà cô. Mỗi sáng mình họp đứng 15 phút nha.'],
            ['kp:thong', 'Sáng nào em cũng đứng nướng sườn 4 tiếng rồi anh. Đứng thêm 15 phút nữa là em thành cây cột.'],
            ['tm:dat', 'Vậy mình làm "retrospective". Cô Lài, điều gì cô muốn tiếp tục?'],
            ['kp:lai', 'Tôi muốn tiếp tục bán cơm.'],
          ],
          choices: [
            { t: 'Gỡ giấy nhớ khỏi nồi, chừa trên tường', fx: { hearts: { 'kp:lai': 2, 'tm:dat': 1 } }, say: [['tm:dat', 'Thỏa hiệp! Đó chính là tinh thần agile. Anh ghi vô "bài học kinh nghiệm".']] },
            { t: 'Cho anh Đạt đứng gian hàng với cô Lài', fx: { mood: 4, hearts: { 'tm:dat': 2, 'kp:thong': 1 } }, say: [['kp:lai', 'Được. Cậu đứng rửa chén. Rửa xong một chồng thì dời qua cột "Xong".']] },
          ],
        },
      },
      {
        id: 'c6_event', task: 'Mượn bàn ghế ở Đi Đâu Cũng Được', hint: 'Kho + văn phòng Event, dãy sau gần đầu mối (8h30-18h).',
        where: 'event', from: '08:30', to: '18:00', minDay: 40,
        scene: {
          lines: [
            ['event:kieu', 'Bàn ghế hả? Chị có 200 ghế, 40 bàn, 12 cái rạp, một sân khấu nhỏ và cây micro vàng giữ từ năm 2009. Micro vàng thì không cho mượn.'],
            ['event:toan', 'Anh là Toàn, "danh bạ sống". Giá người quen: khu phố mình chỉ tính tiền xăng ba gác. Mà ba gác là của Chú Bảy.'],
            ['bama:bay', 'Chở bàn ghế sự kiện là chuyên môn của chú. Sáu chuyến. Nặng dưới, nhẹ trên, ghế chồng mười cái là đẹp.'],
            ['event:duy', 'Anh làm MC chung với ông Thanh hả? Anh có ba bộ đàm. Ông Thanh có một giọng hát. Cân sức.'],
            ['event:kieu', 'Lần trước dựng đám cưới hẻm 7, mưa tới, rạp bay. Lần này chị buộc dây kỹ. Không có gì bay hết, trừ thời gian.'],
          ],
          choices: [
            { t: 'Phụ Chú Bảy chất ghế lên ba gác', fx: { energy: -8, hearts: { 'bama:bay': 2, 'event:toan': 1 } }, say: [['bama:bay', 'Chất khéo đó con. Có tố chất làm Phó Giám đốc Logistics. Lương thì chưa có.']] },
            { t: 'Xin anh Duy nhường ông Thanh một bài', fx: { hearts: { 'event:duy': 1, 'kp:thanh': 1 } }, say: [['event:duy', 'Một bài. Không hơn. Anh có bộ đàm để báo hết giờ.']] },
            { t: '(Đi Đâu Cũng Được) Lên sơ đồ dựng rạp', role: 'event', fx: { hearts: { 'event:kieu': 2 } }, say: [['event:kieu', 'Thực tập sinh nhà mình! Sơ đồ đẹp. Rạp số 7 đặt cạnh xe bánh mì cho khói bay đúng hướng.']] },
          ],
        },
      },
      {
        id: 'c6_hr', task: 'Tìm người đứng gian hàng ở HR, Lô C tầng 4', hint: 'Người Đúng Chỗ HR, chung cư cũ Lô C (8h30-18h). Không có thang máy.',
        where: 'chungcu', from: '08:30', to: '18:00',
        scene: {
          lines: [
            ['nar', 'Bốn tầng cầu thang. Tới tầng 4 bạn thở như vừa chạy xong một sprint của anh Đạt.'],
            ['hr:tuan', 'Chào! Anh Tuấn, headhunter. Anh đọc hồ sơ cá nhân của cả khu phố như đọc truyện. Cần người đứng gian hàng hả? Năm phút.'],
            ['hr:tuan', 'Cô Lài đứng cơm tấm, có Thông nướng. Bà Cẩm và chị Nhung... anh xếp hai gian sát nhau. Rủi ro cao, lợi nhuận cao.'],
            ['hr:ngan', 'Chú Ninh hớt tóc miễn phí cho người già. Bác sĩ Lâm đo huyết áp. Anh Hào làm góc game cho tụi nhỏ, 20 giờ là tắt máy.'],
            ['hr:tuan', 'Còn em đứng đâu? Hồ sơ em ghi hết rồi. Em làm ở đâu thì đứng gian đó, khỏi phỏng vấn.'],
          ],
          choices: [
            { t: 'Đồng ý xếp bà Cẩm sát chị Nhung', fx: { hearts: { 'hr:tuan': 1, 'kp:cam': 1, 'kp:nhung': 1 } }, say: [['hr:tuan', 'Can đảm. Anh thích ứng viên can đảm. Hôm đó anh đứng gần đó, cầm sẵn bình nước.']] },
            { t: 'Xếp hai người cách nhau một gian', fx: { mood: 2, hearts: { 'hr:ngan': 1 } }, say: [['hr:ngan', 'An toàn. Gian ở giữa là khô gà Ba & Má. Ai cũng thích khô gà, kể cả mẹ chồng nàng dâu.']] },
            { t: '(HR) Tự tay ghép cả danh sách', role: 'hr', fx: { hearts: { 'hr:tuan': 2, 'hr:ngan': 1 } }, say: [['hr:tuan', '31 người vào 31 gian, không ai trùng ca, không ai giận. Em lên lương được rồi đó. Đùa thôi, thực tập mà.']] },
          ],
        },
      },
      {
        id: 'c6_sang', task: 'Nhờ anh Sang giữ quỹ hội chợ', hint: 'Cao ốc Tâm Mỹ, Cân Đối & Cộng Sự tầng 3-5 (8h-17h30).',
        where: 'toanha', from: '08:00', to: '17:30', minDay: 44,
        scene: {
          lines: [
            ['audit:sang', 'Quỹ hội chợ hả? Anh giữ. Thu bao nhiêu, chi bao nhiêu, dán bảng công khai ngay cổng hẻm, tới đồng 1.000 cuối cùng.'],
            ['audit:hieu', 'Anh Hiếu, bên thuế. Gian nào bán hàng thì doanh thu là của hộ đó, hộ đó tự ghi sổ như mọi ngày (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['audit:sang', 'T&M góp tiền đèn, Đi Đâu Cũng Được góp rạp, Ba & Má góp khô gà làm quà. Ai góp gì cũng có tên, như mái chợ năm 2003.'],
            ['nar', 'Thang máy dừng tầng 5. Một người ngủ gục bên trong, ôm laptop. Là anh Thạc tầng 7, lại bấm nhầm tầng.'],
            ['tech:thac', '(tỉnh dậy) Hội chợ hả? Anh làm mã quét góp quỹ cho. Hai mươi phút. Hoặc hai mươi tiếng. Anh chưa ngủ từ thứ Ba nên không chắc.'],
          ],
          choices: [
            { t: 'Cảm ơn anh Sang, giao quỹ cho anh', fx: { hearts: { 'audit:sang': 2 } }, say: [['audit:sang', 'Sổ quỹ khu phố anh ghi bằng bút bi. Bút chì là kẻ thù của minh bạch.']] },
            { t: 'Nhờ anh Thạc làm mã quét góp quỹ', needFlag: 'giu_chia_khoa', fx: { hearts: { 'tech:thac': 2 } }, say: [['tech:thac', 'Em là người giữ chìa khóa xe anh hôm đó! Anh làm miễn phí. Anh đặt tên biến là "nguoi_tot".']] },
            { t: 'Để anh Thạc ngủ tiếp cho khỏe', fx: { mood: 3, hearts: { 'tech:thac': 1 } }, say: [['tech:thac', 'Em hiểu anh. Anh ngủ rồi làm. Hoặc làm trong lúc ngủ.']] },
          ],
        },
      },
      {
        id: 'c6_poster', task: 'In poster hội chợ ở Photo Thần Tốc', hint: 'Photo Thần Tốc (7h-21h). Mang theo bìa gốc có xe bánh mì.',
        where: 'photo', from: '07:00', to: '21:00', needFlag: 'bia_goc',
        scene: {
          lines: [
            ['kp:tan', 'Bìa này đẹp. Xe bánh mì, nắng sớm, khói bay, chữ viết tay. Chú in 200 tờ, không kẹt tờ nào. Chú canh máy như canh nồi cháo.'],
            ['hr:banhmi', '(đứng ngoài cửa) Ủa, cái xe trên poster là xe của cô hả? Cô... cô lên poster hả?'],
            ['kp:tan', 'Cô là gương mặt của hội chợ đó.'],
            ['hr:banhmi', 'Trời ơi, vậy mà sáng nay cô không chải đầu. Tuần sau cô bán bánh mì phải quàng khăn đẹp.'],
          ],
          choices: [
            { t: 'Tặng Cô Bánh Mì một tấm poster', fx: { hearts: { 'hr:banhmi': 3 } }, say: [['hr:banhmi', 'Cô dán lên xe. Không, cô gửi thằng Hưng. Không, cô dán lên xe rồi chụp gửi thằng Hưng.']] },
            { t: 'Dán poster khắp đường Tâm Mỹ', fx: { energy: -5, mood: 4, xomoi: 'Bà Phấn: Poster hội chợ dán khắp đường rồi. Lần này không có tòa nhà kính. Có xe bánh mì!' }, say: [['nar', 'Bạn dán tới tấm thứ 40 thì thấy Mèo KPI nằm ngủ trên tấm thứ 41.']] },
          ],
        },
      },
      {
        id: 'c6_trienlam', task: 'Lấy tranh lớp 5A về treo ở hội chợ', hint: 'Cổng trường, giờ tan 16h-17h30.',
        where: 'truong_th', from: '16:00', to: '17:30', needFlag: 'tranh_tre_em',
        scene: {
          lines: [
            ['kp:dao', 'Tranh xong rồi em. Bốn mươi hai bức "Khu phố của em". Lớp vẽ thêm được nhờ hộp bút màu của em.'],
            ['nar', 'Bé Khoai lớp 1 xin vẽ ké một bức: dãy trọ Bình An, bà nội cô Ba đứng trước cửa, tay cầm cuốn sổ.'],
            ['kp:khoai', 'Bà nội con cầm sổ ghi tiền. Bà nói bà không có di chúc, bà có sổ.'],
            ['kp:xuan', 'Treo ở hội chợ, nhưng cuối ngày nhớ trả lại các em. Tranh của học sinh là của học sinh.'],
          ],
          choices: [
            { t: 'Hứa treo tranh ngay cổng hẻm', fx: { hearts: { 'kp:dao': 1, 'kp:xuan': 1, 'kp:khoai': 1 } }, say: [['kp:xuan', 'Cổng hẻm là đẹp nhất. Ai vô cũng thấy khu phố qua mắt tụi nhỏ.']] },
            { t: 'Khen bức tranh của bé Khoai', fx: { mood: 4, hearts: { 'kp:khoai': 2, 'kp:lanh': 1 } }, say: [['kp:khoai', 'Con vẽ bà nội cao hơn cái nhà. Vì bà nội quan trọng hơn cái nhà.']] },
          ],
        },
      },
      {
        id: 'c6_demtruoc', task: 'Đêm trước hội chợ: dựng rạp trong hẻm 42', hint: 'Hẻm 42, từ 18h.',
        where: 'hem', from: '18:00', to: '23:30', minDay: 50,
        scene: {
          lines: [
            ['nar', 'Hẻm 42 sáng đèn dây. Chú Bảy chở chuyến ghế thứ sáu. Trên đỉnh chồng ghế, Mèo KPI ngồi như chỉ huy.'],
            ['event:toan', 'Rạp số 7 xong! Rạp số 8 thiếu một cây cọc. À không, cây cọc đang được ông Thanh cầm tập làm micro.'],
            ['kp:thanh', 'Kính thưa quý vị, kính thưa... Duy ơi, MC có được nói "kính thưa" ba lần không?'],
            ['event:duy', 'Được chú. Nhưng tới lần thứ tư là bộ đàm của con kêu.'],
            ['kp:nhung', 'Mẹ, gian của mẹ để cà phê bên trái, gian con để trà sữa bên phải, ở giữa là khô gà.'],
            ['kp:cam', 'Ừ. Mai mẹ qua uống thử trà sữa của con một ly. Ly nhỏ thôi.'],
            ['kp:lanh', '{ten}, ngủ sớm đi con. Mai con là người bận nhất khu phố.'],
          ],
          choices: [
            { t: 'Phụ buộc dây rạp lần cuối', fx: { energy: -6, hearts: { 'event:toan': 1, 'kp:luc': 1 } }, say: [['kp:luc', 'Nút đó là nút của dân biển. Mai gió cỡ nào rạp cũng đứng.']] },
            { t: 'Mang trà nóng cho mọi người (20.000đ)', fx: { money: -20000, hearts: { 'kp:lanh': 1, 'kp:cam': 1, 'kp:nhung': 1 } }, say: [['kp:cam', 'Trà ai pha vậy? Ngon. Mai con qua phụ cô bán cà phê nha.']] },
          ],
        },
      },
      {
        id: 'c6_ngu', task: 'Ngủ một giấc, mai là ngày hội', hint: 'Về phòng 5 ngủ sớm.',
        where: 'phongtro', need: { type: 'sleep', count: 1 },
        scene: {
          lines: [
            ['nar', 'Tối nay nhà ông Thanh im lặng. Ông đang tập làm MC ở trong đầu.'],
            ['kp:lanh', '(qua cửa) Áo cô ủi cho con rồi, treo ở cửa. Ngủ đi.'],
            ['me', 'Lần đầu tiên từ khi tới đây, cả hẻm 42 đi ngủ cùng một giờ.'],
          ],
        },
      },
      {
        id: 'c6_hoicho', task: 'Hội chợ Khu phố 7!', hint: 'Hẻm 42, cả ngày từ 7h. Đi một vòng các gian hàng.',
        where: 'hem', from: '07:00', to: '21:00',
        scene: {
          lines: [
            ['kp:cuong', 'Alo alo! Kính mời bà con tới Hội chợ Khu phố 7, lần thứ nhất! Hẻm 42 hôm nay không có xe máy, chỉ có người!'],
            ['nar', 'Cơm tấm thơm khói. Trà sữa và cà phê cóc đứng hai bên, khô gà đứng giữa. Dì Chín và cô Mười bán chung một nồi canh chua.'],
            ['nar', 'Bác sĩ Lâm đo huyết áp, chú Ninh hớt tóc miễn phí cho người già, tụi nhỏ nhảy dây cuối hẻm, góc game của anh Hào đông nghẹt.'],
            ['kp:thanh', 'Kính thưa, kính thưa, kính thưa quý vị!'],
            ['event:duy', '(bộ đàm kêu) Chú Thanh, một bài thôi nha chú.'],
            ['kp:lanh', 'Cắt băng khai mạc mà đưa cô cây kéo cắt rau? Thôi được, kéo nào cũng là kéo.'],
            ['tm:tuyet', '(đứng cuối hẻm, kế phòng 3) Đẹp hơn mọi tấm slide chị từng làm.'],
            ['audit:sang', 'Bảng quỹ dán ở cổng hẻm rồi nha. Thu 6.240.000đ, chi 4.980.000đ. Phần dư chuyển vào quỹ học bổng của cô Nga.'],
          ],
          choices: [
            { t: 'Đứng gian hàng cả buổi sáng', fx: { money: 150000, energy: -10, mood: 8 }, say: [['nar', 'Bạn bán hết hàng lúc 11 giờ. Tiền công khu phố chia đều. Phần vui thì chia hoài không hết.']] },
            { t: 'Đi một vòng chào từng gian', fx: { mood: 10, hearts: { 'kp:cuong': 1, 'hr:banhmi': 1, 'kp:lai': 1, 'kp:nhung': 1 } }, say: [['hr:banhmi', 'Ổ bánh mì này cô làm riêng cho con. Không bán. Tặng.']] },
            { t: 'Lên live hội chợ chung với Út Mi', needFlag: 'len_live', fx: { mood: 6, hearts: { 'bama:mi': 2 }, xomoi: 'Bà Phấn: Live hội chợ của Út Mi có 5.000 người xem. Bạn phòng 5 nói chuyện dễ thương. Bà thả tim.' }, say: [['bama:mi', 'Cả nhà ơi, đây là bạn từng lên live của Mi hồi tin đồn Plaza! Hôm nay không có tin đồn, chỉ có hội chợ thật!']] },
          ],
        },
      },
    ],
    done: 'Hội chợ Khu phố 7 lần thứ nhất: không ai bị dời, không ai bị quên. Chú Cường hứa năm nào cũng làm. Chị Tuyết hỏi nhỏ: tháng nào được không?',
  },

  // ───────────────────────────── Chương 7 · days ~52-97 ─────────────────────────────
  {
    id: 'c7', title: 'Chương 7 · Tết ở Khu phố 7',
    intro: 'Cuối năm, khu phố bận như chợ đầu mối. Năm đầu tiên của bạn ở đây sắp khép lại bằng một cái Tết.',
    beats: [
      {
        id: 'c7_tongket', task: 'Đọc Xóm Ơi: bà Phấn tổng kết hội chợ', hint: 'Mở nhóm Xóm Ơi (phím P). Bà Phấn ở hẻm 42.',
        where: 'hem', need: { type: 'xomoi' },
        scene: {
          lines: [
            ['kp:phan', 'Bà vừa đăng "Biên bản hội chợ": 31 gian, 0 cái rạp bay, 1 con mèo ngủ trên poster, 2 bài của ông Thanh. Ông nói 2, bà đếm 5.'],
            ['kp:phan', 'Bà có mở bình chọn "Người của hội chợ". Bà không nói ai thắng. Con mở nhóm ra coi đi.'],
            ['kp:thanh', '(vọng ra) Phấn ơi, bài 3 tới bài 5 là bài phụ! Không tính!'],
          ],
          choices: [
            { t: 'Cảm ơn bà đã giữ nhóm vui', fx: { hearts: { 'kp:phan': 2 } }, say: [['kp:phan', 'Nhóm vui là nhờ bà con. Nhóm yên là nhờ bà xóa tin.']] },
            { t: 'Đứng về phe ông Thanh: 2 bài', fx: { hearts: { 'kp:thanh': 2, 'kp:phan': -1 } }, say: [['kp:thanh', 'Thấy chưa! Có nhân chứng!'], ['kp:phan', 'Nhân chứng này bà ghi sổ rồi nha.']] },
          ],
        },
      },
      {
        id: 'c7_namoi', task: 'Mừng năm mới với hàng xóm ở hẻm 42', hint: 'Đêm cuối năm dương lịch, hẻm 42 từ 19h.',
        where: 'hem', from: '19:00', to: '23:30', minDay: 60,
        scene: {
          lines: [
            ['kp:cuong', 'Alo alo. Năm mới bà con mạnh khỏe. Chú đọc nhanh vì ông Thanh đang chờ micro.'],
            ['kp:nga', 'Quỹ học bổng từ hội chợ đã trao cho 6 em học chăm. Có cả Gạo lớp 9A, đang ôn thi vào 10.'],
            ['kp:gao', 'Con cảm ơn khu phố. Con về ôn bài tiếp đây ạ.'],
            ['nar', 'Ông Thanh hát đúng một bài, rồi đưa micro cho anh Khôi. Anh Khôi hát hay bất ngờ. Cả hẻm im lặng nghe.'],
            ['tm:tuyet', 'Năm nay chị không làm slide tổng kết. Chị chỉ gửi mỗi nhà một hộp bánh, như ông Quế vẫn nhận hai mươi năm nay.'],
            ['kp:lanh', 'Con ở đây được hai tháng. Cô tính sơ: đóng tiền đúng ngày, hứa gì làm nấy, hàng xóm ai cũng biết mặt. Vậy là đủ.'],
          ],
          choices: [
            { t: 'Chúc cô Ba sống lâu trăm tuổi', fx: { hearts: { 'kp:lanh': 2 } }, say: [['kp:lanh', 'Trăm tuổi thì cô phải sửa di chúc thêm chục lần. Mệt lắm. Chúc cô khỏe là được.']] },
            { t: 'Rủ anh Khôi hát thêm một bài', fx: { mood: 6, hearts: { 'kp:khoi': 1, 'kp:phan': 1 } }, say: [['kp:phan', 'Con trai bà đó. Hát hay giống ai không biết. Bà thì hát dở.']] },
          ],
        },
      },
      {
        id: 'c7_drama', task: 'Hóng trọn hai vụ drama của khu phố', hint: 'Theo mũi tên "Có biến" tới hồi kết. Chị Mận ở tiệm tóc biết hết.',
        where: 'cattoc', from: '08:00', to: '20:00', need: { type: 'drama', count: 2 },
        scene: {
          lines: [
            ['kp:man', 'Hết Plaza rồi, khu phố quay về món đặc sản: drama. Tuần nào cũng có một vụ, như tóc mọc.'],
            ['kp:man', 'Chị giữ bí mật khách gần như luôn luôn. Chữ "gần như" là phần drama đó em.'],
            ['kp:ninh', 'Hóng thì hóng cho trọn, đừng nghe một nửa rồi đi kể. Nửa câu chuyện là một câu chuyện khác.'],
          ],
          choices: [
            { t: 'Gội đầu nghe chị Mận kể (40.000đ)', fx: { money: -40000, mood: 6, hearts: { 'kp:man': 1 } }, say: [['kp:man', 'Gội xong đầu sạch, tai đầy. Dịch vụ trọn gói.']] },
            { t: 'Hứa nghe trọn rồi mới kể', fx: { hearts: { 'kp:ninh': 2 } }, say: [['kp:ninh', 'Được. Người biết nghe là người được kể nhiều nhất.']] },
          ],
        },
      },
      {
        id: 'c7_sang', task: 'Phụ anh Sang nhắc cô Sáu thông báo doanh thu', hint: 'Chợ Tâm Mỹ (4h30-12h), sạp tạp hóa cô Sáu.',
        where: 'cho', from: '05:00', to: '11:30', minDay: 72,
        scene: {
          lines: [
            ['audit:sang', 'Sắp hết tháng Giêng dương lịch rồi. Hộ kinh doanh thông báo doanh thu thực tế năm trước chậm nhất 31/01 (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['bama:cosau', 'Sổ của cô ghi bằng bút chì. Có trang cô gôm rồi viết lại ba lần. Doanh thu thì cô nhớ bằng bụng.'],
            ['audit:sang', 'Bụng cô thì không nộp được cô ơi. Mình chép ra sổ mới, bút bi.'],
            ['bama:cosau', 'Còn khoản nợ Ba & Má 46 triệu thì sao? Ghi luôn hả?'],
            ['audit:sang', 'Cái đó là chuyện của cô với cô Hằng. Mà ghi luôn đi cô, cho nhẹ lòng.'],
          ],
          choices: [
            { t: 'Đọc số cho anh Sang chép', fx: { energy: -5, hearts: { 'audit:sang': 1, 'bama:cosau': 2 } }, say: [['bama:cosau', 'Con đọc rõ ghê. Năm sau cô thuê con đọc, trả bằng mứt.']] },
            { t: 'Mua ủng hộ cô Sáu ít mứt Tết (40.000đ)', fx: { money: -40000, mood: 3, hearts: { 'bama:cosau': 1 } }, say: [['bama:cosau', 'Mứt gừng cay, mứt dừa ngọt. Ăn xong thấy Tết tới sát nách.']] },
            { t: '(Cân Đối) Rà sổ một lượt cho cô', role: 'audit', fx: { hearts: { 'audit:sang': 2, 'bama:cosau': 1 } }, say: [['audit:sang', 'Tick-mark bốn màu luôn hả? Chị Diệp bên mình mà thấy chắc khóc vì tự hào.']] },
          ],
        },
      },
      {
        id: 'c7_lam', task: 'Làm 3 ngày công cuối năm, kiếm tiền sắm Tết', hint: 'Trà sữa hoặc công ty của bạn. Cuối năm ai cũng bận.',
        where: 'trasua', need: { type: 'work', count: 3 },
      },
      {
        id: 'c7_sam', task: 'Sắm một món đón Tết cho phòng', hint: 'Nội Thất Nhà Mình (8h-21h). Lịch Tết treo tường chỉ 45.000đ.',
        where: 'noithat', from: '08:00', to: '21:00', minDay: 84, need: { type: 'furniture', count: 1 },
        scene: {
          lines: [
            ['kp:tin', 'Tết tới rồi! Lịch Tết treo tường, đèn lồng giấy, chậu kim tiền. Anh khuyên: cái gì màu đỏ là hợp.'],
            ['kp:tin', 'Tấm poster được hỏi nhiều nhất năm nay là poster hội chợ có xe bánh mì. Anh không bán, Cô Bánh Mì không cho. Anh chỉ treo.'],
            ['bama:bay', 'Đồ to thì để chú chở. Mà tuần này chú chở mai, chở quất, chở khô gà quà Tết. Ba gác chạy như bay. Không, như ba gác.'],
          ],
          choices: [
            { t: 'Hỏi anh Tín món nào hợp phòng 5', fx: { hearts: { 'kp:tin': 1 } }, say: [['kp:tin', 'Hợp nhất là món làm em muốn về nhà sau giờ làm. Phong thủy của anh chỉ có vậy.']] },
            { t: 'Mời Chú Bảy uống nước nghỉ tay (10.000đ)', fx: { money: -10000, hearts: { 'bama:bay': 2 } }, say: [['bama:bay', 'Năm phút thôi. Logistics mùa Tết không có giờ nghỉ, chỉ có giờ uống nước.']] },
          ],
        },
      },
      {
        id: 'c7_ongtao', task: 'Tiễn ông Táo với cô Ba Lành', hint: 'Dãy trọ Bình An, chiều tối 23 tháng Chạp.',
        where: 'phongtro', from: '16:00', to: '22:00', minDay: 90,
        scene: {
          lines: [
            ['kp:lanh', 'Hai mươi ba tháng Chạp. Cô cúng ông Táo, thả cá chép. Con phụ cô bưng mâm.'],
            ['kp:lanh', 'Ông Táo lên trời báo cáo chuyện nhà. Năm nay có tin đồn Plaza, có hội chợ, có con nhỏ phòng 3 về thăm. Báo cáo dài lắm.'],
            ['kp:kha', 'Má, con không sơn pastel nữa. Con sơn lại màu vàng kem như hồi má mới xây.'],
            ['kp:tram', 'Tiền phòng năm sau giữ nguyên. Em ghi sổ rồi. Má gật rồi, có nhân chứng.'],
            ['kp:lanh', 'Còn cái di chúc... cô sửa rồi. Thêm một dòng. Có tên con.'],
            ['me', 'Dạ?'],
            ['kp:lanh', 'Dòng đó ghi: "Đứa phòng 5 hay giúp hàng xóm, Tết được ăn bánh tét trước." Giỡn mà cũng thiệt. Bưng mâm đi con.'],
          ],
          choices: [
            { t: 'Bưng mâm, thả cá chép với cô', fx: { mood: 6, hearts: { 'kp:lanh': 2 } }, say: [['nar', 'Con cá chép quẫy một cái rồi bơi đi. Cô Ba đứng nhìn lâu, như nhìn một năm trôi qua.']] },
            { t: 'Cảm ơn anh Kha giữ màu cũ', fx: { hearts: { 'kp:kha': 2, 'kp:lanh': 1 } }, say: [['kp:kha', 'Màu cũ thì người cũ nhận ra. Anh học được cái đó năm nay.']] },
          ],
        },
      },
      {
        id: 'c7_giaothua', task: 'Đón giao thừa ở hẻm 42', hint: 'Đêm giao thừa, hẻm 42 từ 21h.',
        where: 'hem', from: '21:00', to: '23:59', minDay: 96,
        scene: {
          lines: [
            ['nar', 'Hẻm 42 đỏ rực lồng đèn. Mâm cơm chung kê dài từ xe bánh mì tới cổng dãy trọ, đúng khúc hẻm từng bị "giải phóng mặt bằng" trên slide.'],
            ['kp:hung', 'Chào bạn phòng 5! Mình là Hưng. Má mình để dành cho bạn ổ bánh mì thứ hai của năm. Ổ đầu là của mình.'],
            ['hr:banhmi', 'Hai đứa ăn đi. Tết mà, cô cho ghi sổ cả năm. Giỡn đó, cô cho luôn.'],
            ['bama:bay', 'Năm nay ba gác chạy 412 chuyến. Chuyến vui nhất là chở cả khu phố đi qua một cái tin đồn.'],
            ['tm:tuyet', 'Chị xin phép cô Ba ngồi bậc thềm phòng 3 tới giao thừa. Hai mươi năm rồi chị mới ngắm pháo hoa lại từ chỗ này.'],
            ['nar', 'Bé Khoai ngủ gục trên đùi bà nội. Đám nhỏ trong hẻm ăn no bánh tét, đã ngủ say trong nhà từ lâu.'],
            ['kp:cuong', 'Alo alo. Còn một phút. Năm nay loa dùng việc chung lần cuối: chúc mừng năm mới Khu phố 7!'],
          ],
          choices: [
            { t: 'Nâng ly trà với cả hẻm', fx: { mood: 10, hearts: { 'kp:cuong': 1, 'bama:bay': 1, 'hr:banhmi': 1 } }, say: [['nar', 'Ba, hai, một. Cả hẻm cùng hô. Ông Thanh hát đúng một câu, rồi tự đưa micro cho chú Cường.']] },
            { t: 'Ngồi cạnh chị Tuyết ở bậc thềm phòng 3', fx: { mood: 6, hearts: { 'tm:tuyet': 2 } }, say: [['tm:tuyet', 'Năm sau chị muốn mỗi tháng một ngày hội. Lần này chị hỏi khu phố trước, rồi mới làm slide.']] },
          ],
        },
      },
      {
        id: 'c7_mung1', task: 'Mùng 1 Tết: xông đất nhà cô Ba', hint: 'Sáng mùng 1, dãy trọ Bình An.',
        where: 'phongtro', from: '05:30', to: '12:00', minDay: 97,
        scene: {
          lines: [
            ['kp:lanh', 'Mùng 1 Tết, cô chọn con xông đất. Người xông đất phải vui tính, chăm làm, đóng tiền đúng hạn. Cả dãy chỉ có mình con đủ ba cái.'],
            ['kp:lanh', 'Bao lì xì này không nhiều. Trong đó có một tờ tiền, và một tờ giấy ghi: "Phòng 5, ở lâu nha con."'],
            ['kp:kha', 'App "Trọ Ơi" năm nay có nút mới: "Chúc Tết chủ trọ". Má em bấm thử rồi, má em nói sổ vẫn hay hơn.'],
            ['nar', 'Ngoài hẻm, loa phường đọc tin mùng 1. Xóm Ơi nhảy tin chúc Tết liên tục. Mèo KPI nằm trên nóc ba gác, đeo một cái nơ đỏ.'],
            ['kp:lanh', 'Năm mới khu phố còn nhiều chuyện lắm. Con ở lại mà coi.'],
          ],
          choices: [
            { t: 'Nhận lì xì, chúc cô năm mới', fx: { money: 100000, mood: 8, hearts: { 'kp:lanh': 2 } }, say: [['kp:lanh', 'Năm mới con mạnh khỏe, làm đâu được đó, và đừng tin slide.']] },
            { t: 'Con giữ lời hứa rồi đó cô', needFlag: 'hua_coba', fx: { money: 100000, mood: 10, hearts: { 'kp:lanh': 3 } }, say: [['kp:lanh', 'Cô nhớ. Con hứa tìm ra sự thật, con tìm ra rồi. Còn tìm ra luôn cả cái khu phố này.']] },
            { t: 'Mời cô ly trà sữa đầu năm (30.000đ)', fx: { money: -30000, hearts: { 'kp:lanh': 2, 'kp:nhung': 1 } }, say: [['kp:lanh', 'Ít đường nha con. Ít thiệt, không phải kiểu thằng Khang.']] },
          ],
        },
      },
    ],
    done: 'Năm đầu tiên ở Khu phố 7 khép lại. Khu phố vẫn ở đây, drama vẫn tới đều, và phòng 5 giờ là nhà.',
  },
];
