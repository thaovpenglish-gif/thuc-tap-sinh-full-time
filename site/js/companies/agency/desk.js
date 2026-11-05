// Trend Trễ Agency — desk work ("Ngồi vào bàn"): the real work of an agency intern, plus the group-chat drama that
// still finds you while you do it. Engine: game/desk.js + modes/solo.js. Contract: docs/COMPANY_CONTRACT.md §12.
// games (5): 2 hands-on (ui/action.js: cắt clip đúng nhịp, ẩn bình luận xấu) + 3 work sims (ui/sims.js):
//   agency_post    (doc)  soát bài trước giờ lên: giá KM, thể lệ, tag KOL, hashtag đối thủ, claim, nhạc/ảnh bản quyền
//   agency_numbers (doc)  soát báo cáo & báo giá: reach vs impression, CPA, ER, view 3 giây, xác nhận bằng văn bản
//   agency_chat    (chat) khách sửa "lần cuối" ngoài scope, quản lý KOL trễ hạn đòi thêm phí, khách tố "mì có sâu"
// chatter: [castId, text, dm?] messages that land WHILE you play, then a short scene with one choice.
// Advertising-law lines are simplified (thông tin giải trí, không phải tư vấn pháp lý).

const F = (k) => (r) => !!r.flags[k];

export const DESK = {
  games: [
    // ---- hands-on (ui/action.js) ----
    { id: 'agency_cut', type: 'action', game: 'conveyor', mode: 'beat', title: 'Cắt clip đúng nhịp', icon: '🎬', time: 35, pass: 0.6, count: 14,
      target: { emoji: '🎵' },
      prompt: 'Khách muốn clip "bắt trend, cắt theo nhạc". Bấm (hoặc Space) đúng lúc mỗi đoạn chạm vạch hồng.' },
    { id: 'agency_mod', type: 'action', game: 'whack', title: 'Ẩn bình luận xấu', icon: '🧹', time: 35, pass: 0.6, count: 16,
      slotText: 'Bình luận · Răng Xinh', bg: '#3b2440', slot: '#553460',
      target: { emoji: '🙈', labels: ['Link lạ nhận quà', 'Chửi thề', 'Bóc phốt bịa', 'Spam bán sim'], hit: 'Ẩn!', miss: 'Lọt bình luận xấu' },
      avoid: { emoji: '💬', labels: ['Hỏi giá', 'Khen thật lòng', 'Góp ý lịch sự', 'Tag bạn vào xem'], hit: 'Ẩn nhầm khách thật!' },
      prompt: 'Livestream đang chạy, bình luận ào ào. Bấm 🙈 để ẩn bình luận xấu. Đừng ẩn 💬 khách thật.' },
    // ---- work sims (ui/sims.js): real agency work ----
    { id: 'agency_post', type: 'doc', title: 'Soát bài trước giờ lên', icon: '🔍', time: 80, pass: 0.6,
      prompt: 'So bài với brief. Bấm 🚩 vào mọi dòng sai giá, thiếu thể lệ, sai người, vi phạm bản quyền hay claim quá đà. Dòng đúng brief thì để yên.',
      docs: [
        { kind: 'post', head: 'Fanpage Mì Ông Táo · 19:00 · Minigame Tết', meta: 'Brief đã duyệt: 5.000đ/gói, giảm 20% từ 15/12 đến 31/12 · KOL: Tí Tẹo · hashtag #MìÔngTáo #TếtĐầyNồi',
          lines: [
            { h: 'Caption' },
            'Tết này nồi nào cũng đầy! 🍜 Mì Ông Táo giảm giá cả tháng 12 cho cả nhà.',
            { t: 'Chỉ còn 3.500đ/gói (giảm 20%) tại mọi cửa hàng tiện lợi!', bad: '5.000đ giảm 20% là 4.000đ, không phải 3.500đ. Sai giá trên bài là khách có quyền đòi đúng giá đã đăng.' },
            'Minigame: comment món mì nhà bạn ngày Tết, 10 bạn được chọn nhận mỗi bạn 1 thùng mì.',
            { t: 'Thể lệ chi tiết: cập nhật sau nha cả nhà 😘', bad: 'Khuyến mại phải công bố đủ thể lệ: thời hạn, cách chọn, ngày công bố, cách nhận quà (thông tin giải trí, không phải tư vấn pháp lý).' },
            { t: 'Vào bếp cùng KOL nhà mình nhé! @BongBo.Official', bad: 'Tag nhầm Bông Bơ (đã hủy hợp đồng) thay vì Tí Tẹo: sai người, còn quảng cáo không công cho KOL khác.' },
            { t: '#MìÔngTáo #TếtĐầyNồi #MìNgọcBếp', bad: '#MìNgọcBếp là hashtag của đối thủ: đẩy người xem sang trang người ta. Chỉ dùng hashtag trong brief.' },
            { h: 'Hình & giờ đăng' },
            'Ảnh: KV Tết v14 (chị Nguyệt duyệt bằng email ngày 12/12)',
            'Emoji: 🍜 🧧 (2 cái, guideline cho tối đa 3)',
            'Giờ đăng: 19:00, Sương canh comment tới 22:00',
          ],
          verdict: { q: '18:52. Bấm đăng lúc 19:00?', options: ['Hoãn, sửa xong gửi chị Diệp duyệt lại', 'Đăng trước, sửa sau bằng nút chỉnh sửa', 'Đăng, rồi ghim comment đính chính giá'], correct: 0,
            why: 'Sai giá và thiếu thể lệ thì không đăng. Trễ 30 phút rẻ hơn nhiều so với một cuộc khủng hoảng.' } },
        { kind: 'post', head: 'Video TikTok · Răng Xinh × Mây Mây · "Thơm 12 giờ"', meta: 'Brief: sinh viên · thông điệp "thơm miệng 12 giờ" (có thử nghiệm TN-07) · không so sánh đối thủ · KOL được trả phí',
          lines: [
            { h: 'Kịch bản' },
            'Cảnh 1: Mây Mây ngủ dậy trễ, deadline thuyết trình lúc 8 giờ sáng.',
            'Cảnh 2: chải Răng Xinh 2 phút, chạy tới lớp kịp giờ.',
            { t: 'Thoại: "Kem đánh răng số 1 Việt Nam, nha sĩ nào cũng khuyên dùng!"', bad: '"Số 1", "nha sĩ nào cũng" là khẳng định tuyệt đối: cần số liệu kiểm chứng, không có thì không được nói (thông tin giải trí).' },
            'Thoại: "Thơm suốt 12 giờ, tới tối vẫn tự tin nói chuyện gần."',
            { t: 'Chữ trên màn hình: "Chải 7 ngày, hết sâu răng"', bad: 'Kem đánh răng là mỹ phẩm, không được quảng cáo như thuốc chữa bệnh (thông tin giải trí, không phải tư vấn pháp lý).' },
            { h: 'Âm thanh & hình' },
            { t: 'Nhạc nền: bản hit K-pop đang trend, tải từ YouTube', bad: 'Nhạc thương mại không có license: video thương hiệu dễ bị tắt tiếng hoặc gỡ. Dùng thư viện nhạc thương mại của nền tảng.' },
            'Ảnh sản phẩm: bộ ảnh studio anh Phát chụp tháng 10 (agency giữ quyền sử dụng)',
            { h: 'Caption & đăng' },
            'Deadline 8 giờ sáng, hơi thở vẫn thơm tới 8 giờ tối 😮‍💨 #RăngXinh #Thơm12Giờ',
            { t: 'Nhãn "Hợp tác trả phí": tắt (Mây Mây muốn nhìn tự nhiên)', bad: 'KOL nhận tiền thì phải ghi rõ là quảng cáo, bật nhãn trả phí. Giấu đi là đánh lừa người xem (thông tin giải trí).' },
            'Lịch đăng: 20:00 thứ Năm, sau khi anh Tuấn duyệt bằng email',
          ],
          verdict: { q: 'Gửi bản này cho anh Tuấn duyệt?', options: ['Sửa thoại, chữ, nhạc, bật nhãn trả phí rồi mới gửi', 'Gửi luôn, anh Tuấn thích chữ "số 1"', 'Gửi, để pháp chế bên khách tự soát'], correct: 0,
            why: 'Agency chịu trách nhiệm phần mình làm ra. Claim sai và nhạc không license là rủi ro cho cả khách lẫn mình.' } },
        { kind: 'post', head: 'Facebook · Trà Sữa Tâm Trạng · Minigame size Mood L', meta: 'Brief: size Mood L giá 45.000đ · 20 ly miễn phí · 12 cửa hàng TP.HCM · ngân sách quà 900.000đ',
          lines: [
            { h: 'Caption' },
            'Hôm nay bạn mood gì? Size Mood L chính thức có mặt, chỉ 45.000đ!',
            { t: 'Cách chơi: like trang, SHARE bài lên trang cá nhân và tag 3 bạn bè', bad: 'Facebook cấm bắt share lên trang cá nhân hay tag bạn bè để tham gia: bài dễ bị hạn chế. Chỉ yêu cầu comment.' },
            'Giải thưởng: 20 voucher 1 ly Mood L (tổng trị giá 900.000đ)',
            'Thời gian: từ 18/11 đến 23:59 ngày 24/11 · công bố kết quả 26/11 trên fanpage',
            { t: 'Cách chọn: admin chọn những bình luận "có tâm trạng nhất"', bad: 'Tiêu chí mơ hồ, không ai kiểm chứng được: dễ bị tố xử ép. Ghi rõ: quay số ngẫu nhiên có quay màn hình.' },
            'Áp dụng tại 12 cửa hàng TP.HCM, danh sách ở comment ghim',
            { h: 'Hình' },
            { t: 'Ảnh 1: ly trà sữa đẹp lấy trên Pinterest, đã che logo quán khác', bad: 'Ảnh trên mạng có tác giả, che logo không thành của mình, lại là sản phẩm quán khác. Tự chụp hoặc mua ảnh.' },
            'Ảnh 2: menu size mới do Vỹ thiết kế (khách duyệt bằng email 15/11)',
            'Màu chủ đạo: tím pastel đúng bộ nhận diện',
          ],
          verdict: { q: 'Xử lý thế nào?', options: ['Đổi cách chơi thành comment, ghi rõ cách chọn, thay ảnh rồi đăng', 'Giữ "share + tag 3 bạn" cho viral', 'Bỏ minigame, chỉ đăng ảnh menu'], correct: 0,
            why: 'Minigame vẫn chạy được, chỉ cần thể lệ đúng luật nền tảng, minh bạch, ảnh hợp lệ. Bỏ hẳn là bỏ luôn mục tiêu của brief.' } },
      ] },

    { id: 'agency_numbers', type: 'doc', title: 'Soát số trước khi gửi client', icon: '📈', time: 85, pass: 0.6,
      prompt: 'Cầm máy tính lên. Bấm 🚩 vào mọi dòng tính sai, dùng sai chỉ số hoặc thiếu căn cứ. Số đúng thì để yên, kể cả khi nó xấu.',
      docs: [
        { kind: 'paper', head: 'Báo cáo quảng cáo · Răng Xinh · tuần 2', meta: 'Anh Lộc làm, gửi anh Tuấn 17:00 · CPM = chi phí ÷ hiển thị × 1.000 · CTR = nhấp ÷ hiển thị · CPA = chi phí ÷ đơn',
          lines: [
            { h: 'Số liệu' },
            'Ngân sách đã chi: 30.000.000đ',
            'Lượt hiển thị (impression): 1.500.000',
            { t: 'Lượt tiếp cận (reach): 1.800.000 người', bad: 'Reach (số người) không thể lớn hơn impression (số lần hiển thị): mỗi người thấy ít nhất 1 lần. Số bị nhập nhầm.' },
            'CPM: 20.000đ',
            'Lượt nhấp: 15.000 · CTR 1%',
            { t: 'Đơn hàng trên sàn: 300 · CPA 10.000đ', bad: '30.000.000đ ÷ 300 đơn = 100.000đ/đơn, không phải 10.000đ. Thiếu một số 0 là khách tưởng mình rẻ gấp mười.' },
            { h: 'Nhận xét' },
            { t: '"CPM tăng do thuật toán đổi" (không có số tuần trước)', bad: 'Nhận xét phải có số so sánh và nguyên nhân kiểm chứng được. "Thuật toán đổi" không phải là phân tích.' },
            'Tuần 3: chuyển 20% ngân sách sang nhóm quảng cáo có CTR cao nhất (1,6%)',
            'Đính kèm: ảnh chụp trình quản lý quảng cáo, có ngày giờ',
          ],
          verdict: { q: '16:45. Gửi anh Tuấn lúc 17:00?', options: ['Báo anh Lộc sửa reach, CPA, nhận xét rồi mới gửi', 'Gửi luôn, khách không soi đâu', 'Xóa dòng CPA cho đỡ bị hỏi'], correct: 0,
            why: 'Một số sai làm khách nghi cả báo cáo. Sửa số cho đúng, không giấu số xấu.' } },
        { kind: 'paper', head: 'Báo cáo KOL · Trà Sữa Tâm Trạng · ra mắt Mood L', meta: 'ER (tỉ lệ tương tác) = tương tác ÷ follower · chi phí mỗi lượt xem = tổng phí ÷ lượt xem',
          lines: [
            { h: 'Từng KOL' },
            'Mây Mây · 300.000 follower · 9.000 tương tác · ER 3%',
            { t: 'Tí Tẹo · 80.000 follower · 4.000 tương tác · ER 0,5%', bad: '4.000 ÷ 80.000 = 5%, không phải 0,5%. Ghi sai là đánh giá thấp đúng KOL hiệu quả nhất.' },
            'Bé Lười · 90.000 follower · 2.700 tương tác · ER 3%',
            'Phí: Mây Mây 15 triệu · Tí Tẹo 6 triệu · Bé Lười 8 triệu · tổng 29 triệu',
            { h: 'Tổng hợp' },
            { t: 'Tổng reach 3 KOL: 470.000 người (cộng follower của 3 bạn)', bad: 'Follower không phải reach, khán giả các KOL lại trùng nhau nên không cộng dồn được. Lấy reach thật của từng bài.' },
            { t: 'Lượt xem hết video: 210.000 (lấy từ số "view 3 giây")', bad: 'View 3 giây không phải xem hết. Đổi tên chỉ số cho đẹp là gây hiểu sai; ghi đúng: 210.000 lượt xem 3 giây.' },
            'Chi phí mỗi lượt xem: 29.000.000đ ÷ 210.000 ≈ 138đ',
            { h: 'Đề xuất' },
            'Đợt 2: tăng ngân sách cho Tí Tẹo (ER cao nhất, phí thấp nhất)',
          ],
          verdict: { q: 'Bước tiếp theo?', options: ['Sửa ER Tí Tẹo, bỏ "tổng reach", ghi đúng tên chỉ số', 'Gửi luôn, số càng to khách càng vui', 'Bỏ hết số, chỉ gửi ảnh chụp bài đăng'], correct: 0,
            why: 'Chỉ số phải đúng định nghĩa: reach là người thật, follower không phải reach, view 3 giây không phải xem hết.' } },
        { kind: 'invoice', head: 'Báo giá phát sinh · Răng Xinh · tháng 11', meta: 'Hợp đồng: 20 bài/tháng, bài thêm 1.500.000đ · phí quản lý 10% · anh Tuấn xin thêm qua Zalo',
          lines: [
            { h: 'Hạng mục' },
            '10 bài đăng (caption + thiết kế) × 1.500.000đ = 15.000.000đ',
            '3 video ngắn × 4.000.000đ = 12.000.000đ',
            'Ảnh sản phẩm: 0đ (dùng lại bộ ảnh tháng 10, agency đã có quyền sử dụng)',
            { t: 'Phí KOL Mây Mây: "chị Kiều báo sau"', bad: 'Báo giá không được có ô "báo sau": khách ký rồi mới biết giá là cãi nhau. Ghi số, hoặc tách báo giá riêng.' },
            { h: 'Tổng' },
            { t: 'Tạm tính: 15.000.000 + 12.000.000 = 37.000.000đ', bad: '15 + 12 = 27 triệu, không phải 37. Sai một phép cộng là khách nghi cả những số đúng.' },
            'Phí quản lý 10% trên 27.000.000đ: 2.700.000đ',
            'Tổng cộng (chưa VAT): 29.700.000đ',
            { h: 'Điều khoản' },
            { t: 'Khách xác nhận: anh Tuấn đã thả 👍 trong group Zalo', bad: '👍 không phải chấp thuận. Phát sinh phải có xác nhận bằng văn bản (email, phụ lục) trước khi làm.' },
            'Thanh toán: 50% khi ký phụ lục, 50% sau nghiệm thu',
            'Báo giá có hiệu lực 15 ngày',
          ],
          verdict: { q: 'Gửi báo giá này?', options: ['Sửa tổng, điền phí KOL, xin email xác nhận rồi mới làm', 'Gửi luôn, anh Tuấn đã 👍 rồi', 'Làm trước 10 bài, báo giá sau'], correct: 0,
            why: 'Phát sinh phải có giá rõ và xác nhận bằng văn bản trước khi làm. Chị Hồng sẽ hỏi đúng ba thứ đó.' } },
      ] },

    { id: 'agency_chat', type: 'chat', title: 'Nhắn tin với khách, KOL, cư dân mạng', icon: '💬', time: 85, pass: 0.6,
      prompt: 'Người ngoài đang nhắn. Giữ khách, giữ scope, giữ luật, và đừng đổ thêm dầu vào lửa. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Chị Nguyệt', emoji: '🍜', role: 'Brand Manager · Mì Ông Táo (khách)', app: 'Zalo' },
          start: ['Em ơi, KV Tết chị duyệt rồi nhưng sếp chị muốn đổi sang tông xanh. Sửa lần cuối nha, chiều nay có nha em.'],
          turns: [
            { options: [
              { t: 'Dạ em ghi nhận ạ. Chị gửi em góp ý của sếp bằng chữ, em gom một lần cho đội sửa ạ.', s: 2, react: 'Ok, chị gõ list rồi gửi. Sếp chị nói hơi nhiều.' },
              { t: 'Dạ được chị, em bảo Vỹ bỏ hết việc khác làm ngay, chiều nay có bản mới, chị cứ báo sếp yên tâm, đổi mấy lần cũng được ạ.', s: 0, react: 'Thích em quá. Vậy đổi luôn font với bố cục nhé.' },
              { t: 'Dạ lại sửa ạ? 😅', s: 1, react: 'Em than với chị đó hả?' },
            ] },
            { them: 'Mà sửa cái này có tính tiền không em? Chị nghĩ là trong gói mà.', options: [
              { t: 'Dạ thôi không tính đâu chị, mình làm vì tình cảm, em không báo chị Hồng là được, chị đừng lo chuyện tiền nong nha.', s: 0, react: 'Vậy em sửa luôn cả TVC nha 😘' },
              { t: 'Dạ hợp đồng gồm 2 vòng sửa, mình dùng hết rồi. Vòng này em gửi chị báo giá phát sinh ạ.', s: 2, react: 'Ừ… để chị xin sếp. Gửi chị báo giá nha.' },
              { t: 'Dạ để em hỏi chị Diệp ạ', s: 1, react: 'Ok, hỏi nhanh nha em.' },
            ] },
            { them: 'Vậy em cho in luôn 2.000 poster theo bản mới nhé, chị 👍 rồi đó.', options: [
              { t: 'Dạ chị đã 👍 thì em đẩy file sang nhà in ngay tối nay luôn, mai là có hàng, khỏi trễ Tết ạ.', s: 0, react: '…Ủa khoan, sếp chị chưa xem bản in.' },
              { t: 'Dạ 👍 là duyệt rồi đúng không chị?', s: 1, react: 'Thì 👍 là được chứ sao.' },
              { t: 'Dạ chị xác nhận bản in cuối qua email giúp em. Có email là em gửi nhà in ngay.', s: 2, react: 'Khó tính ghê. Mà được, chị gửi liền.' },
            ] },
            { them: 'À Tết rồi, em làm giúp chị thêm 10 bài đăng nữa nha, nhỏ thôi.', options: [
              { t: 'Dạ ngoài scope tháng này ạ. Em gửi chị lịch và báo giá trong hôm nay ạ.', s: 2, react: 'Ừ, rõ ràng vậy chị dễ trình sếp.' },
              { t: 'Dạ được chị, 10 bài thì nhỏ thôi, em tự viết buổi tối cũng xong, không cần báo giá hay báo team, coi như quà Tết ạ.', s: 0, react: 'Quà Tết thì năm sau chị lại xin nhé.' },
              { t: 'Dạ chắc được ạ', s: 1, react: '"Chắc được" là mai có nha em.' },
            ] },
          ],
          end: { good: 'Ok em. Chị gửi email xác nhận với PO luôn nhé. Làm với em yên tâm.', bad: 'Poster in sai rồi em ơi. Sếp chị hỏi ai duyệt…' } },
        { who: { name: 'Chị Trâm', emoji: '💁', role: 'Quản lý KOL Mây Mây', app: 'Zalo' },
          start: ['Em ơi, Mây Mây chưa quay kịp clip Răng Xinh. Hẹn đăng 20h tối nay mà chắc phải tối mai.'],
          turns: [
            { options: [
              { t: 'Dạ em cảm ơn chị báo sớm. Trưa mai chị gửi bản nháp để duyệt nhé, em báo khách dời lịch.', s: 2, react: 'Ok em, trưa mai nha.' },
              { t: 'Dạ không sao chị, lúc nào tiện thì đăng, khỏi gửi bản nháp đâu ạ, Mây Mây quay gì cũng đẹp, em tin tuyệt đối luôn ạ.', s: 0, react: 'Em dễ thương ghê. Vậy bạn ấy tự quay tự đăng nha.' },
              { t: 'Dạ sao trễ vậy chị?', s: 1, react: 'Bạn ấy chạy show em ơi.' },
            ] },
            { them: 'À clip này chắc view cao lắm, bên chị xin thêm 5 triệu nha em.', options: [
              { t: 'Dạ để em hỏi chị Kiều với khách xem có thêm ngân sách không, chắc tối nay hoặc sáng mai em báo lại chị nha.', s: 1, react: 'Ok, nhớ hỏi nha.' },
              { t: 'Dạ phí đã chốt trong hợp đồng là 15 triệu ạ. Thêm hạng mục thì em gửi báo giá riêng.', s: 2, react: 'Ừ, giữ 15 triệu. Chị hỏi thử thôi.' },
              { t: 'Dạ được chị, tối nay em chuyển thêm 5 triệu luôn, khỏi phụ lục hay báo chị Kiều, mình làm nhanh cho tiện nha chị.', s: 0, react: 'Nhanh gọn ghê. Lần sau chị xin 10 nha.' },
            ] },
            { them: 'Mây Mây không thích ghi chữ "quảng cáo" đâu em, nhìn kém tự nhiên.', options: [
              { t: 'Dạ vậy mình khỏi ghi chị, để tự nhiên như review thật cho người xem tin hơn, khách cũng thích kiểu đó lắm ạ.', s: 0, react: 'Đó, em hiểu nghề ghê.' },
              { t: 'Dạ bài trả phí phải bật nhãn quảng cáo, hợp đồng có ghi ạ. Còn nội dung cứ tự nhiên chị nhé.', s: 2, react: 'Ừ, chị quên vụ đó. Bật nhãn.' },
              { t: 'Dạ ghi nhỏ nhỏ thôi cũng được chị', s: 1, react: 'Nhỏ cỡ nào em?' },
            ] },
            { them: 'Bản nháp nè em. Mây Mây nói "Răng Xinh trị dứt sâu răng", nghe mạnh lắm!', options: [
              { t: 'Dạ câu đó phải bỏ ạ, kem đánh răng không được nói chữa bệnh. Dùng câu "thơm 12 giờ" nhé chị.', s: 2, react: 'Ok, chị bảo bạn ấy thu lại câu đó.' },
              { t: 'Dạ quá hay luôn chị, câu này chắc viral, mình giữ nguyên rồi đăng ngay tối nay, khỏi gửi khách duyệt cho đỡ mất thời gian ạ.', s: 0, react: 'Ok đăng liền!' },
              { t: 'Dạ hay đó chị, để em hỏi lại khách', s: 1, react: 'Hỏi nhanh nha, tối đăng.' },
            ] },
          ],
          end: { good: 'Ok em. Trưa mai có bản sửa, bật nhãn quảng cáo. Đăng 20h mai nha.', bad: 'Clip lên rồi nha em. Ủa sao khách gọi chị dữ vậy?' } },
        { who: { name: 'Anh Hùng', emoji: '😡', role: 'Người mua · bình luận trên fanpage Mì Ông Táo', app: 'Messenger' },
          start: ['Gói mì Ông Táo nhà tôi mua có con sâu! Ảnh đây. Các người cho người ta ăn cái gì vậy?'],
          turns: [
            { options: [
              { t: 'Dạ ảnh này có thể là ảnh ghép hoặc lấy trên mạng ạ, mì bên em sản xuất trên dây chuyền khép kín, không thể có sâu đâu ạ.', s: 0, react: 'Ảnh ghép? Tôi quay video cho các người xem!' },
              { t: 'Dạ em rất tiếc. Nhà mình có ai không khỏe không ạ? Anh cho em xin số lô in trên gói nhé.', s: 2, react: 'Không ai sao. Lô 2411-B, hạn 05/2027.' },
              { t: 'Dạ anh inbox page giúp em ạ', s: 1, react: 'Inbox là để giấu đi chứ gì?' },
            ] },
            { them: 'Giờ các người tính sao?', options: [
              { t: 'Dạ em chuyển bộ phận chất lượng xác minh lô này, 24 giờ em báo anh. Anh giữ giúp em gói mì nhé.', s: 2, react: 'Được. Tôi giữ nguyên gói.' },
              { t: 'Dạ em xin lỗi anh, lỗi hoàn toàn do nhà máy bên em, cả lô đó chắc chắn có vấn đề, em đăng thông báo thu hồi luôn ạ.', s: 0, react: 'Vậy là các người biết từ trước? Tôi gửi báo luôn.' },
              { t: 'Dạ để em hỏi sếp ạ', s: 1, react: 'Hỏi bao lâu?' },
            ] },
            { them: 'Tôi sẽ đăng lên group 300.000 người cho mọi người biết.', options: [
              { t: 'Dạ anh đừng đăng mà anh 🥺', s: 1, react: 'Sao lại không?' },
              { t: 'Dạ em gửi anh 5 thùng mì và 500 nghìn, anh xóa bình luận và đừng đăng group giúp em, mình giải quyết riêng thôi ạ.', s: 0, react: 'À, mua chuộc. Tôi chụp màn hình rồi.' },
              { t: 'Dạ đó là quyền của anh. Em chỉ xin 24 giờ để có kết quả kiểm tra ạ.', s: 2, react: 'Được. 24 giờ.' },
            ] },
            { them: 'Còn bình luận của tôi trên page, các người định xóa à?', options: [
              { t: 'Dạ không ạ. Em trả lời công khai dưới bình luận là đang xác minh cùng anh.', s: 2, react: 'Ừ. Vậy mới đàng hoàng.' },
              { t: 'Dạ để page gọn cho mọi người, em ẩn tạm bình luận của anh và chặn tài khoản, có kết quả kiểm tra em mở lại ngay ạ.', s: 0, react: 'Ẩn à? Tôi có ảnh chụp hết rồi nhé.' },
              { t: 'Dạ việc ẩn hay giữ bình luận phải chờ chị quản lý fanpage quyết, em chưa trả lời anh được ạ.', s: 1, react: 'Vậy tôi chờ xem các người giấu kiểu gì.' },
            ] },
          ],
          end: { good: 'Ok. Tôi chờ kết quả. Ít ra các bạn trả lời như người.', bad: 'Group 300.000 người đang đọc đoạn chat này đó.' } },
      ] },
  ],

  // errands that lead into the hands-on games (`play` = a desk game id; engine: game/office.js officeGameFor)
  tasks: [
    { id: 'desk_cut', title: 'Cắt lại clip theo nhịp cho khách', from: 'diep', base: 60, legs: [
      { npc: 'diep', line: ['diep', 'Khách bảo clip "chưa bắt nhịp". Em cắt lại theo nhạc giúp chị, khách cần trước 5 giờ.'] },
      { obj: 'desk', play: 'agency_cut', line: ['nar', 'Bạn cắt xong. Clip giờ nhảy theo nhạc. Khách sẽ bảo "ok nhưng thử nhạc khác".'] },
      { npc: 'diep', line: ['diep', 'Gửi rồi. Khách thả tim. Một tim. Như vậy là duyệt.'] },
    ] },
  ],

  chatter: [
    { id: 'agency_ch_v14', chat: [['vy', '(đính kèm: KV_v14_FINAL_THATSU_dungsua.psd)'], ['diep', 'Chị Nguyệt bảo sửa lần cuối nha Vỹ'], ['vy', 'Lần cuối thứ mấy ạ?'], ['thi', 'Lần cuối là một trạng thái, không phải con số.']],
      scene: [
        ['think', 'Group "[Ông Táo] KV Tết" vừa sang tên file thứ mười lăm. Vẫn là "lần cuối".'],
        { c: 'agency_desk_v14', o: [
          { t: 'Nhắn riêng Vỹ: "Em gom feedback thành một list cho anh nha"', fx: { rel: { vy: 2 }, nl: -2 } },
          { t: 'Mở cá cược: "Trước Tết có v20 không mọi người?"', fx: { dr: 2, rel: { thi: 1, diep: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'agency_ch_kol', chat: [['kieu', 'KOL mới cho Trà Sữa sạch lắm nha, chị check rồi 🌟'], ['suong', 'Chị ơi bạn ấy vừa đăng story chê nhãn hàng cũ'], ['kieu', 'Story 24 giờ là hết mà em'], ['loc', 'CPM đang cao. Đừng thêm drama.']],
      scene: [
        ['think', '"Sạch, chị check rồi." Lần thứ ba trong tháng.'],
        { c: 'agency_desk_kol', o: [
          { t: 'Chụp story lại, gửi riêng chị Kiều để chị cân nhắc', fx: { uy: 1, rel: { kieu: 1, suong: 1 } } },
          { t: 'Thả "🫢" vào tin của Sương', fx: { dr: 2, rel: { kieu: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'agency_ch_pop', chat: [['tung', 'Cả nhà ơi deck pitch Bia Hơi Phố make it pop hơn nha 💥'], ['khai', 'Pop là gì, anh định nghĩa giúp em'], ['tung', 'Pop là… khi em nhìn vào thì em thấy pop'], ['quan', 'Để em làm ma trận 3x3 cho chữ pop. 2x2 lỗi thời rồi.']],
      scene: [
        ['think', 'Định nghĩa của "pop" là "pop". Ma trận đang được vẽ.'],
        { c: 'agency_desk_pop', o: [
          { t: 'Gửi anh Tùng 3 ảnh tham khảo: "Pop kiểu này ạ?"', fx: { rel: { tung: 2 }, nl: -2, clock: 5 } },
          { t: 'Hỏi anh Quân ô nào trong ma trận là "pop"', fx: { dr: 2, rel: { quan: 1, khai: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'agency_ch_dalat', chat: [['tung', 'Thắng pitch này cả nhà đi Đà Lạt! Lần này thật!'], ['hong', 'Anh ơi lần thứ sáu rồi ạ. Chưa có dòng nào trong ngân sách.'], ['linh', 'Mẹ mình nói Đà Lạt mùa này đẹp lắm'], ['phat', 'Đi được. Không phải với ngân sách này.']],
      scene: [
        ['think', 'Đà Lạt của Trend Trễ: tồn tại trong group chat từ 2019.'],
        { c: 'agency_desk_dalat', o: [
          { t: 'Thả tim cho anh Tùng: "Em làm deck hết sức ạ"', fx: { rel: { tung: 1 }, uy: 1 } },
          { t: 'Lập bình chọn "Đà Lạt hay Vũng Tàu?"', fx: { dr: 2, rel: { linh: 1, hong: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'agency_ch_timesheet', chat: [['hong', '12 người chưa nộp timesheet. Chị biết hết.'], ['hong', 'Ô "Khác" tuần này có 41 tiếng. Ai giải thích?'], ['loc', '3 tiếng của em là nhìn dashboard lúc 3 giờ sáng ạ'], ['suong', 'Của em là "canh comment trong lúc ngủ"']],
      scene: [
        ['think', 'Bốn mươi mốt tiếng "Khác". Một tuần làm việc nằm trong một ô.'],
        { c: 'agency_desk_timesheet', o: [
          { t: 'Nộp timesheet ngay, ghi đúng client', fx: { rel: { hong: 2 }, uy: 1, clock: 5 } },
          { t: '"Chị ơi ô Khác của em là… cảm xúc ạ"', fx: { dr: 2, rel: { hong: -1, suong: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { nl: 1 } },
        ] },
      ] },
    { id: 'agency_ch_bin', chat: [['tuan', 'Bin có vài góp ý cho KV nha các em'], ['bin', 'Thêm lửa 🔥 + chữ vàng + 3 font nữa cho nó cháy'], ['vy', '…'], ['diep', 'Vỹ bình tĩnh. Chị đang gõ.']],
      scene: [
        ['think', 'Ba chấm của Vỹ nặng hơn mọi bài văn.'],
        { c: 'agency_desk_bin', o: [
          { t: 'Nhắn riêng Vỹ: "Em lọc góp ý nào dùng được rồi gửi anh"', fx: { rel: { vy: 2 }, nl: -2 } },
          { t: 'Thả 🔥 vào tin của Bin', fx: { dr: 2, rel: { tuan: 1, vy: -2 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'agency_ch_tiktok', chat: [['linh', 'Mình vừa đăng TikTok "một ngày của intern agency" 🎥'], ['linh', 'Có quay màn hình group client, nhưng mình làm mờ rồi nha'], ['suong', 'Mờ có 60% thôi Linh ơi. Chị đọc được chữ "Bà Wow".'], ['diep', 'Linh gỡ ngay giúp chị. Ngay.']],
      scene: [
        ['think', 'Bốn nghìn view. Một nickname client. Mười phút trước giờ chị Nguyệt online.'],
        { c: 'agency_desk_tiktok', o: [
          { t: 'Nhắn riêng Linh: "Gỡ đi, mình giúp bạn dựng lại bản không có màn hình"', fx: { rel: { linh: 2, diep: 1 }, nl: -2 } },
          { t: 'Share clip vào group bạn thân "để lưu niệm"', fx: { dr: 3, rel: { linh: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'agency_ch_idea47', chat: [['khai', 'Ngăn kéo có 312 ý tưởng đã chết. Ai lấy ý số 47?'], ['thi', 'Ý đó là của mình mà anh'], ['khai', 'Ý đó chưa đủ đau nên anh giết rồi'], ['thi', 'Vậy sao nó đang nằm trong deck của anh Quân?'], ['quan', 'Đó mới là observation. Insight là của anh.']],
      scene: [
        ['think', 'Ý tưởng số 47 vừa sống lại. Dưới một cái tên khác.'],
        { c: 'agency_desk_idea47', o: [
          { t: 'Nhắn riêng Thi: "Mình còn giữ bản nháp có ngày giờ của bạn"', fx: { rel: { thi: 2 }, uy: 1, set: { agency_desk_thi_draft: true } } },
          { t: 'Gõ "🍿" vào group', fx: { dr: 2, rel: { quan: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'agency_ch_suong', chat: [['suong', 'Có 1 comment chê bao bì Răng Xinh. 12 like. Chưa sao. Chị canh.'], ['suong', '40 like.'], ['suong', '400 like 🙂'], ['loc', 'Đừng nhìn dashboard nữa Sương. Nó nhìn lại em đó.']],
      scene: [
        ['think', 'Sương không hoảng. Sương chỉ gửi số. Đó là cách Sương hoảng.'],
        { c: 'agency_desk_suong', o: [
          { t: 'Gửi Sương mẫu trả lời đã duyệt, nhận canh nửa inbox', fx: { rel: { suong: 2 }, uy: 1, nl: -3 } },
          { t: 'Tag anh Tuấn vào: "Anh ơi bao bì bị chê nè"', fx: { dr: 3, rel: { tuan: -1, suong: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { nl: 1 } },
        ] },
      ] },
  ],

  promoOffer: [
    ['nar', 'Review xong, chị Diệp úp cả ba chiếc điện thoại xuống bàn. Lần đầu tiên bạn thấy chị làm thế.'],
    ['diep', 'Em ơi… Lần này là "em ơi" có câu phía sau.'],
    ['diep', 'Cả tháng group nổ liên tục: KOL bùng, v14, Bin, Đà Lạt. Mà chị mở ổ chung ra, file nào đúng tên, đúng hạn cũng có tên em.'],
    { if: F('agency_desk_thi_draft'), then: [['diep', 'Thi kể em giữ bản nháp có ngày giờ giúp nó. Agency này thiếu nhất là người giữ được sự thật.']] },
    ['diep', 'Chị với anh Tùng muốn giữ em. Account Executive. Mười triệu. Hợp đồng lao động, có bảo hiểm.'],
    ['think', 'Mười triệu. Mình chỉ ngồi vào bàn, tắt thông báo, và làm.'],
    { c: 'agency_work_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, rel: { diep: 1 }, set: { accept_official: true } }, then: [
        ['diep', 'Tốt. Từ thứ Hai em có client riêng. Và nếu em muốn, chị cho mượn một trong ba cái điện thoại.'],
      ] },
      { t: '"Em cảm ơn chị, nhưng em muốn thử ở chỗ khác ạ."', fx: { set: { accept_official: false } }, then: [
        ['diep', 'Chị hiểu. Người làm ra việc thì không cần bắt trend. Đi đâu cũng có chỗ.'],
      ] },
    ] },
  ],
};
