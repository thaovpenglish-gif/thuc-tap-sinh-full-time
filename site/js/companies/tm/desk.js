// T&M Partners — desk work ("Ngồi vào bàn"): the real work of a consulting intern, plus the group-chat drama that
// still finds you while you do it. Engine: game/desk.js + modes/solo.js. Contract: docs/COMPANY_CONTRACT.md §12.
// games: 2 hands-on (ui/action.js: căn lề slide, lọc thông báo) + 3 work sims (ui/sims.js): soát deck & mô hình số liệu,
// soát biên bản phỏng vấn chuyên gia / biên bản họp / email gửi khách, nhắn tin với khách (scope, số chưa kiểm, tô hồng).
// chatter: [castId, text, dm?] messages that land WHILE you play, then a short scene with one choice.

const F = (k) => (r) => !!r.flags[k];

export const DESK = {
  games: [
    // ---- hands-on (ui/action.js) ----
    { id: 'tm_align', type: 'action', game: 'align', title: 'Căn lề slide', icon: '📐', time: 45, pass: 0.6, twist: true,
      blocks: ['Tiêu đề: Thị trường trà sữa', 'Biểu đồ doanh thu', '3 insight', 'Nguồn: Hiệp hội 2026', 'Logo khách'],
      twistLine: '"Chị có vài ý nhỏ…" (chị Tuyết)', twistSub: '(hai khối vừa bị dời chỗ)',
      prompt: 'Chị Linh: "Slide lệch 2 pixel là khách mất niềm tin." Kéo từng khối vào đúng khung nét đứt.',
      hint: 'Kéo thả bằng chuột hoặc ngón tay. Gần đúng chỗ là khối tự hít vào.',
      good: [['linh', 'Thẳng. Chị không tìm được lỗi nào. Hơi khó chịu.']] },
    { id: 'tm_ping', type: 'action', game: 'whack', title: 'Lọc thông báo trước 9h', icon: '🔔', time: 35, pass: 0.6, count: 16,
      slotText: 'Teams · T&M', bg: '#2c2a4a', slot: '#3d3a63',
      target: { emoji: '📌', labels: ['Chị Tuyết: tóm tắt?', 'Khách: số trang?', 'Chị Linh: sửa slide 7', 'Họp 10h đổi phòng'], hit: 'Xử lý!', miss: 'Lỡ việc gấp' },
      avoid: { emoji: '🎈', labels: ['Team building tự nguyện', 'Ai ăn hộp cơm hồng?', 'Sticker mèo', 'Khảo sát văn hóa #4'], hit: 'Sa vào drama!' },
      prompt: 'Teams nổ tung lúc 8:55. Bấm 📌 việc gấp để xử lý. Đừng bấm 🎈 drama, bấm vào là mất 20 phút.' },
    // ---- work sims (ui/sims.js): real consulting work ----
    { id: 'tm_deck', type: 'doc', title: 'Soát deck và số liệu trước khi gửi khách', icon: '🔎', time: 80, pass: 0.6,
      prompt: 'Tài liệu sắp gửi khách. Bấm 🚩 vào mọi dòng sai số, thiếu nguồn, thiếu so-what hoặc làm khách hiểu sai. Dòng lạ chưa chắc đã sai.',
      docs: [
        { kind: 'paper', head: 'Deck gửi Êm Ru Group · Slide 2–6 · Tóm tắt cho Ban Giám đốc', meta: 'Brief: Êm Ru (nệm, gối) mất doanh số kênh đại lý. Khảo sát T&M 1.200 người, tháng 9/2026. Gửi khách 17:00.',
          lines: [
            { h: 'Slide 2 · Executive summary' },
            { t: 'Doanh thu kênh đại lý giảm 18% năm 2026, từ 350 xuống 300 tỷ đồng', bad: '350 xuống 300 là giảm 14,3%, không phải 18%. Khách tự bấm máy ra số khác là mất tin cả deck.' },
            'Online tăng ~15%/năm, mới chiếm 9% doanh thu (30 tỷ đồng)',
            { h: 'Slide 3 · Thị trường' },
            { t: '"Thị trường nệm Việt Nam đạt 1 tỷ USD" (nguồn: internet)', bad: '"Internet" không phải nguồn. Số đưa khách phải ghi tổ chức, năm, cách tính, hoặc tự tính và ghi giả định.' },
            'Nguồn: Khảo sát T&M, n = 1.200, tháng 9/2026, 6 tỉnh thành',
            { h: 'Slide 4 · Insight' },
            { t: '"62% người mua nệm trên 35 tuổi."', bad: 'Mới là số liệu, chưa phải insight: thiếu so-what, tức điều đó nghĩa là gì và Êm Ru nên làm gì.' },
            'Giao nệm mất 6 ngày là lý do số 1 khách bỏ đơn → cần giao trong 48 giờ',
            { h: 'Slide 5 · Biểu đồ' },
            { t: 'Biểu đồ cột doanh thu đại lý 2025–2026: trục tung bắt đầu từ 280 tỷ', bad: 'Biểu đồ cột phải bắt đầu từ 0. Cắt trục ở 280 làm mức giảm 14% nhìn như mất hơn 70%.' },
            'Chú thích: số 2026 là ước tính cả năm, dựa trên 9 tháng đầu năm',
            { h: 'Slide 6 · Khuyến nghị' },
            'Ưu tiên 1: giao trong 48 giờ ở Hà Nội và TP.HCM, thí điểm 90 ngày',
            'Footer: Bảo mật · Chỉ dành cho Êm Ru Group',
          ],
          verdict: { q: 'Còn 40 phút tới 17:00. Làm gì?', options: ['Gửi đúng giờ, lỗi thì sửa ở bản sau', 'Xin lùi sang tuần sau để làm lại cả deck', 'Sửa 4 lỗi, nhờ chị Linh duyệt, báo khách trễ 30 phút nếu cần'], correct: 2,
            why: 'Số sai và biểu đồ gây hiểu lầm không "sửa ở bản sau" được. Trễ 30 phút có báo trước vẫn hơn đúng giờ mà sai.' } },
        { kind: 'code', head: 'Mô hình quy mô thị trường nệm · sheet "Sizing" · bản của Long', meta: 'Top-down: số hộ × tỷ lệ mua mỗi năm × giá trung bình. Chị Hạ dặn: "Số nào cũng phải có nguồn và đơn vị."',
          lines: [
            { h: 'Giả định' },
            'Số hộ gia đình: 27 triệu (nguồn: Tổng điều tra dân số 2019)',
            'Chu kỳ thay nệm 8 năm → mỗi năm 1/8 số hộ mua, tức 12,5%',
            'Giá nệm trung bình: 6 triệu đồng/chiếc (khảo sát 40 cửa hàng, tháng 9/2026)',
            { t: 'Tăng trưởng thị trường 15%/năm · ô C14 gõ tay, không ghi nguồn', bad: 'Giả định gõ cứng, không nguồn là điểm yếu nhất mô hình: ghi nguồn và chạy thêm kịch bản thấp/cao.' },
            { h: 'Tính toán' },
            'Số nệm bán mỗi năm = 27 triệu × 12,5% = 3,375 triệu chiếc',
            { t: 'Quy mô thị trường = 3,375 triệu chiếc × 6 triệu đồng = 2.025 tỷ đồng', bad: '3,375 triệu × 6 triệu đồng = 20.250 tỷ đồng. Lệch 10 lần vì nhầm đơn vị: luôn ghi đơn vị cạnh mỗi ô.' },
            { t: 'Online Êm Ru: 15 tỷ (2021) → 30 tỷ (2026) = tăng trưởng 20%/năm', bad: 'Gấp đôi sau 5 năm là CAGR ≈ 14,9%/năm. 20% là lấy 100% chia 5: sai cách tính tăng trưởng kép.' },
            { h: 'Kiểm tra chéo' },
            'Bottom-up: doanh thu 5 hãng lớn cộng lại ≈ 9.000 tỷ đồng',
            'Đơn vị cả sheet: tỷ đồng, giá danh nghĩa, đã gồm VAT',
          ],
          verdict: { q: 'Chị Hạ cần số thị trường cho deck. Gửi số nào?', options: ['Khoảng 20.000 tỷ đồng (~0,8 tỷ USD), kèm giả định và nguồn', '2.025 tỷ đồng, đúng như ô trong file', '1 tỷ USD như trên internet, cho tròn'], correct: 0,
            why: 'Sửa đơn vị xong thì top-down khớp bottom-up (5 hãng lớn ≈ 45% thị trường là hợp lý). Số gửi khách luôn đi kèm giả định.' } },
      ] },

    { id: 'tm_notes', type: 'doc', title: 'Soát biên bản và email gửi khách', icon: '📝', time: 80, pass: 0.6,
      prompt: 'Biên bản và email sắp gửi khách. Bấm 🚩 vào dòng sai sự thật, lộ thông tin, hứa ngoài hợp đồng hoặc không ai chịu trách nhiệm.',
      docs: [
        { kind: 'paper', head: 'Biên bản phỏng vấn chuyên gia · Ngành nệm', meta: 'Chuyên gia: cựu Giám đốc Kênh của một hãng nệm đối thủ, nghỉ từ 2024. Biên bản sẽ gửi kèm cho khách Êm Ru.',
          lines: [
            { h: 'Thông tin' },
            'Ngày 14/10/2026 · 45 phút · chị Hạ hỏi, Long ghi',
            { t: 'Chuyên gia: anh Trần Văn Lực, SĐT 0908 xxx, cựu GĐ Kênh Nệm Sao Mai', bad: 'Biên bản gửi khách phải ẩn danh chuyên gia: chỉ ghi "cựu GĐ Kênh, hãng nệm top 5".' },
            'Thù lao: 3.000.000đ qua expert network, có hợp đồng và cam kết bảo mật',
            { h: 'Nội dung' },
            'Đại lý nệm thường hưởng chiết khấu 25–35% giá bán lẻ',
            'Ý kiến cá nhân: khách dưới 30 tuổi chọn nệm qua review, ít ra cửa hàng',
            { t: '"Sao Mai sẽ giảm giá 20% toàn hệ thống từ 1/12, chưa công bố"', bad: 'Kế hoạch chưa công bố của công ty khác là thông tin mật: không ghi, không dùng, báo ngay trưởng nhóm.' },
            { t: 'Long: "Êm Ru đang lỗ kênh đại lý nên mới thuê bọn em"', bad: 'Nói tên khách và tình hình của khách với người ngoài là vi phạm bảo mật trong hợp đồng tư vấn.' },
            'Thời gian giao nệm trung bình ngành: 2–4 ngày ở thành phố lớn',
            { h: 'Kết luận' },
            { t: '"Khách hàng không thích mua qua đại lý" (theo 1 chuyên gia)', bad: 'Một ý kiến không phải kết luận: đối chiếu với khảo sát 1.200 người hoặc thêm 2–3 chuyên gia nữa.' },
            'Việc tiếp theo: đối chiếu với dữ liệu bảo hành của Êm Ru',
          ],
          verdict: { q: 'Biên bản này?', options: ['Xóa hết cho an toàn, coi như chưa phỏng vấn', 'Bỏ tin mật, ẩn danh chuyên gia, báo chị Hạ vụ lộ tên khách', 'Gửi khách nguyên văn, có tin mật càng có giá'], correct: 1,
            why: 'Tư vấn bán sự tin cậy: dùng tin mật của đối thủ hay lộ chuyện của khách là mất cả hai. Lỗi báo sớm thì sửa được.' } },
        { kind: 'contract', head: 'Biên bản họp · Êm Ru × T&M · Workshop 2', meta: 'Họp 9:00–11:00 ngày 22/10/2026. Gửi tất cả người dự trong 24 giờ. Chị Linh dặn: quyết định, việc, người, hạn.',
          lines: [
            { h: 'Thành phần' },
            'Êm Ru: anh Phong (GĐ Kinh doanh), chị Diệp (GĐ Tài chính), anh Vĩnh (Kênh đại lý)',
            'T&M: chị Linh, Mai, An',
            { h: 'Quyết định' },
            'Chọn Hà Nội và TP.HCM thí điểm giao nệm trong 48 giờ',
            { t: 'Đã chốt ngân sách thí điểm 5 tỷ đồng', bad: 'Chị Diệp mới nói "sẽ trình HĐQT". Ghi "đã chốt" là tạo ra cam kết mà khách chưa đưa ra.' },
            { h: 'Việc tiếp theo' },
            'An · gửi mô hình chi phí giao 48 giờ · trước 30/10',
            'Anh Vĩnh (Êm Ru) · gửi dữ liệu bán hàng 40 đại lý · trước 27/10',
            { t: 'Làm rõ số liệu đại lý miền Trung · "các bên" · "sớm"', bad: 'Việc không có một người phụ trách và một ngày cụ thể thì sẽ không ai làm.' },
            { h: 'Ghi chú' },
            'Chị Diệp: ngân sách thí điểm sẽ trình HĐQT ngày 16/11',
            { t: 'Anh Vĩnh có vẻ phòng thủ, chắc sợ mất ghế', bad: 'Biên bản gửi khách chỉ ghi sự việc và quyết định, không ghi nhận xét cá nhân về người dự họp.' },
            'Đính kèm: slide workshop 2, bản cuối, 24 trang',
          ],
          verdict: { q: 'Biên bản này?', options: ['Gửi luôn cho kịp 24 giờ', 'Chỉ lưu nội bộ, khách không cần biên bản', 'Sửa 3 dòng, đưa chị Linh xem, gửi trong hôm nay'], correct: 2,
            why: 'Biên bản là bằng chứng hai bên đã thống nhất gì. Ghi sai một quyết định là cãi nhau lúc nghiệm thu.' } },
        { kind: 'post', head: 'Email nháp gửi anh Phong · Êm Ru Group', meta: 'Hợp đồng giai đoạn 1: chẩn đoán kênh đại lý, 6 tuần, 3 workshop. Mai soạn, nhờ bạn soát trước khi gửi.',
          lines: [
            'Kính gửi anh Phong,',
            { t: 'Cảm ơn anh và đội Gối Mây đã tham gia workshop 2 sáng 22/10.', bad: 'Sai tên khách (Gối Mây là khách dự án trước). Lỗi copy-paste làm khách nghĩ mình làm qua loa.' },
            { h: 'Tóm tắt' },
            'Kết luận chính: 41% khách bỏ đơn vì thời gian giao, cao nhất trong 6 lý do',
            { t: '"Theo số sơ bộ, doanh thu online của Êm Ru sẽ tăng gấp 3 năm 2027."', bad: 'Dự báo chưa kiểm, chưa có giả định thì không đưa vào email: khách sẽ trích lại như một cam kết.' },
            { h: 'Việc tiếp theo' },
            'T&M gửi đề xuất mô hình giao 48 giờ trước 17:00 thứ Sáu 30/10',
            { t: '"Như anh đề nghị, T&M sẽ làm thêm khảo sát miền Trung (miễn phí)."', bad: 'Ngoài phạm vi hợp đồng: phải báo chị Linh, làm phụ lục hoặc báo giá. Không hứa "miễn phí" trong email.' },
            'Đính kèm: Workshop2_EmRu.pdf (mật khẩu gửi riêng qua tin nhắn)',
            'CC: chị Linh, Giám đốc Chiến lược, T&M Partners',
            'Trân trọng, · Mai · Senior Consultant · T&M Partners',
          ],
          verdict: { q: 'Email này?', options: ['Sửa tên khách, bỏ dự báo, tách phần miền Trung thành báo giá riêng', 'Gửi luôn, Mai viết rồi', 'Gửi, thêm câu "nếu có sai sót mong anh bỏ qua"'], correct: 0,
            why: 'Email gửi khách là văn bản có giá trị: hứa gì, nói số gì là khách giữ lại. Ngoài hợp đồng thì tách riêng, có giá.' } },
      ] },

    { id: 'tm_client', type: 'chat', title: 'Nhắn tin với khách hàng', icon: '💬', time: 85, pass: 0.6,
      prompt: 'Khách Êm Ru đang nhắn. Giữ khách, nhưng giữ cả hợp đồng, số liệu và uy tín nghề. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Anh Phong', emoji: '🛏️', role: 'GĐ Kinh doanh · Êm Ru Group (khách)', app: 'Zalo' },
          start: ['Em ơi, nhân tiện làm thêm giúp anh phân tích đối thủ miền Trung nhé. Nhỏ thôi, tuần sau anh cần.'],
          turns: [
            { options: [
              { t: 'Dạ được anh, việc nhỏ mà, em làm luôn trong tuần sau, anh không cần báo chị Linh đâu ạ, em tự sắp xếp thời gian được.', s: 0, react: 'Tốt quá! Tiện làm luôn miền Bắc nhé em.' },
              { t: 'Dạ em ghi nhận. Phần này ngoài phạm vi giai đoạn 1, em báo chị Linh gửi anh phương án ạ.', s: 2, react: 'Ngoài phạm vi à? Anh tưởng tư vấn là trọn gói.' },
              { t: 'Dạ để em hỏi lại ạ', s: 1, react: 'Hỏi ai? Anh cần câu trả lời.' },
            ] },
            { them: 'Anh cần gấp. Cứ làm trước, phí tính sau được không?', options: [
              { t: 'Dạ chiều nay em gửi anh khung phạm vi và phí. Anh duyệt là team bắt đầu ngay ạ.', s: 2, react: 'Được. Rõ ràng vậy anh dễ trình sếp.' },
              { t: 'Dạ được ạ, phí tính sau.', s: 0, react: 'Ok. Chưa nói phí thì anh hiểu là miễn phí nhé.' },
              { t: 'Dạ em nghĩ chắc làm được anh ạ, để em xem lịch team rồi tối nay em nhắn lại, kịp thì em bắt đầu luôn từ mai cho anh.', s: 1, react: 'Tối nay nhé. Mà phí thì sao?' },
            ] },
            { them: 'Phần miền Trung thì bao lâu xong?', options: [
              { t: 'Dạ nhanh thôi anh', s: 1, react: 'Nhanh là mấy ngày?' },
              { t: 'Dạ 3 ngày thôi anh, team em làm xuyên đêm ạ.', s: 0, react: 'Ba ngày nhé. Anh báo sếp rồi đấy.' },
              { t: 'Dạ khoảng 2 tuần, nếu anh gửi được số liệu 40 đại lý. Lịch chi tiết em gửi kèm đề xuất ạ.', s: 2, react: 'Hai tuần cũng được, miễn là rõ ràng.' },
            ] },
            { them: 'Tiện em gửi anh file khảo sát gốc 1.200 người nhé, đội sales anh gọi lại chào hàng.', options: [
              { t: 'Dạ em gửi anh bảng tổng hợp ạ. File gốc có thông tin cá nhân người trả lời, em không gửi được.', s: 2, react: 'À, đúng. Bảng tổng hợp là đủ.' },
              { t: 'Dạ file nặng lắm anh ạ', s: 1, react: 'Nặng thì nén lại.' },
              { t: 'Dạ em gửi anh luôn qua Zalo nha, đủ tên với số điện thoại 1.200 người, đội anh gọi ai cũng được, khảo sát là của anh mà.', s: 0, react: 'Tiện quá. Mà người ta đồng ý cho gọi chưa nhỉ?' },
            ] },
          ],
          end: { good: 'Ok, anh chờ đề xuất. Làm với bên em rõ ràng thật.', bad: 'Thứ Hai anh cần có đủ. Anh nói với chị Tuyết rồi đấy.' } },
        { who: { name: 'Chị Diệp', emoji: '💼', role: 'GĐ Tài chính · Êm Ru Group (khách)', app: 'Teams' },
          start: ['Em gửi chị thị phần của Êm Ru năm nay nhé. Chị đang họp HĐQT, cần trong 10 phút.'],
          turns: [
            { options: [
              { t: 'Dạ khoảng 12% chị, chị dùng tạm nhé.', s: 0, react: 'Ok 12%. Chị đưa lên slide rồi.' },
              { t: 'Dạ hiện em chưa có số trong tay, file do anh Long giữ, anh ấy đi gặp khách tới chiều mới về nên em chưa hỏi được ạ.', s: 1, react: 'Vậy chị chờ đến chiều à?' },
              { t: 'Dạ số đó team đang kiểm chéo. Số đã kiểm em gửi chị trong 30 phút được không ạ?', s: 2, react: 'Chị cần trong 10 phút. Có số sơ bộ không?' },
            ] },
            { them: 'Có số sơ bộ không em?', options: [
              { t: 'Dạ sơ bộ là 11–13%, chưa kiểm. Chị ghi rõ "sơ bộ" giúp em ạ.', s: 2, react: 'Được. Chị ghi "sơ bộ, T&M đang kiểm".' },
              { t: 'Dạ chị dùng 15% cho đẹp nhé, thị phần thật chắc còn cao hơn vì khảo sát chưa tính đại lý nhỏ ở tỉnh, HĐQT sẽ thích ạ.', s: 0, react: '15%? Em lấy số đó ở đâu?' },
              { t: 'Dạ để em hỏi anh Long ạ', s: 1, react: 'Còn 8 phút.' },
            ] },
            { them: 'Thị phần đó tính theo doanh thu hay số chiếc nệm?', options: [
              { t: 'Dạ cái này không quan trọng lắm đâu chị, doanh thu hay số chiếc thì cũng ra gần như nhau, HĐQT chắc không hỏi sâu vậy ạ.', s: 0, react: 'HĐQT có một ông cựu kiểm toán. Ông ấy hỏi đúng câu đó.' },
              { t: 'Dạ theo doanh thu nệm bán lẻ, không gồm gối. Em ghi chú vào file gửi chị ạ.', s: 2, react: 'Tốt. Định nghĩa rõ thì chị trả lời được.' },
              { t: 'Dạ chắc là theo doanh thu ạ', s: 1, react: '"Chắc"?' },
            ] },
            { them: 'Lỡ số chính thức khác số sơ bộ thì sao em?', options: [
              { t: 'Dạ chắc chênh ít thôi chị', s: 1, react: 'Ít là bao nhiêu?' },
              { t: 'Dạ có số đã kiểm em báo chị ngay, ghi rõ chênh bao nhiêu và vì sao ạ.', s: 2, react: 'Ok. Chị thà sửa sớm còn hơn bị hỏi vặn.' },
              { t: 'Dạ mình cứ giữ số sơ bộ cho thống nhất ạ.', s: 0, react: 'Giữ số sai cho thống nhất? Chị không làm vậy được.' },
            ] },
          ],
          end: { good: 'Cảm ơn em. Số có nguồn, có định nghĩa. Chị không bị hỏi vặn.', bad: 'Chị phải đính chính trước HĐQT. Chị sẽ nói với chị Tuyết.' } },
        { who: { name: 'Anh Vĩnh', emoji: '🏪', role: 'Trưởng phòng Kênh đại lý · Êm Ru Group (khách)', app: 'Zalo' },
          start: ['Em ơi, slide 4 ghi kênh đại lý "kém hiệu quả nhất". Sếp anh đọc là anh mất việc.', 'Sửa nhẹ giúp anh nhé?'],
          turns: [
            { options: [
              { t: 'Dạ được anh, em đổi thành "kênh đại lý đang phát triển ổn định", còn số liệu em để ở phụ lục cho ít người xem ạ.', s: 0, react: 'Tuyệt, em hiểu chuyện ghê.' },
              { t: 'Dạ em hiểu anh lo. Số liệu em không sửa được, nhưng cách trình bày mình bàn được ạ.', s: 2, react: 'Vậy trình bày sao cho anh đỡ chết?' },
              { t: 'Dạ cái này chị Linh quyết ạ', s: 1, react: 'Thì em nói giúp anh với chị Linh.' },
            ] },
            { them: 'Em có cách nào không?', options: [
              { t: 'Dạ em thử đổi "kém hiệu quả nhất" thành "còn nhiều dư địa cải thiện" cho nhẹ nhàng, số liệu vẫn giữ nguyên, anh thấy được không ạ?', s: 1, react: 'Cũng đỡ… nhưng sếp anh vẫn sẽ hỏi vì sao.' },
              { t: 'Dạ mình nêu đúng số, kèm nguyên nhân là giao 6 ngày, không phải đội đại lý, rồi đưa giải pháp ạ.', s: 2, react: 'Nói nguyên nhân thì anh trình được.' },
              { t: 'Dạ mình bỏ 2 tỉnh số xấu ra khỏi mẫu là đẹp ạ.', s: 0, react: 'Ý này hay. Em làm luôn nhé?' },
            ] },
            { them: 'Anh có file số đại lý anh tự tổng hợp, đẹp hơn nhiều. Em dùng nhé?', options: [
              { t: 'Dạ anh gửi em cả file và cách tính. Em đối chiếu, khớp thì em đưa vào ạ.', s: 2, react: 'Được. Anh gửi cả nguồn.' },
              { t: 'Dạ anh gửi đi, em thay luôn vào slide 4 cho kịp họp, số anh tự tổng hợp chắc chắn sát thực tế hơn khảo sát bên em ạ.', s: 0, react: 'Gửi rồi nhé. Thay hết giúp anh.' },
              { t: 'Dạ thôi anh, mình dùng số cũ ạ', s: 1, react: 'Em không thèm xem à?' },
            ] },
          ],
          end: { good: 'Ok. Có nguyên nhân với giải pháp thì anh trình được. Cảm ơn em.', bad: 'Sếp anh hỏi sao số khác bản nháp. Anh bảo em sửa. Chào em.' } },
      ] },
  ],

  // errands that lead into the hands-on games (`play` = a desk game id; engine: game/office.js officeGameFor)
  tasks: [
    { id: 'desk_canle', title: 'Căn lại lề slide cho chị Linh', from: 'linh', base: 60, legs: [
      { npc: 'linh', line: ['linh', 'Slide 7 lệch hai pixel. Khách sẽ thấy. Em căn lại giúp chị, ở máy em ấy.'] },
      { obj: 'desk', play: 'tm_align', line: ['nar', 'Bạn căn xong. Rồi căn lại lần nữa vì "vài ý nhỏ".'] },
      { npc: 'linh', line: ['linh', 'Thẳng. Chị không tìm được lỗi nào. Hơi khó chịu.'] },
    ] },
  ],

  chatter: [
    { id: 'tm_ch_minor', chat: [['tuyet', 'Chị có vài ý nhỏ cho deck nha'], ['tuyet', '(đính kèm: Y_kien_nho.docx · 11 trang)'], ['linh', '11 trang là nhỏ ạ chị?'], ['an', '🫠']],
      scene: [
        ['think', 'Group dự án vừa nhận "vài ý nhỏ". Mười một trang.'],
        { c: 'tm_desk_minor', o: [
          { t: 'Mở file đọc ngay, ghi lại việc của mình', fx: { uy: 2, nl: -3, clock: 10 } },
          { t: 'Thả tim cho tin nhắn của chị Tuyết', fx: { rel: { tuyet: 1 }, dr: 1 } },
          { t: 'Nhắn riêng An: "Anh ơi 11 trang á?"', fx: { rel: { an: 1 }, dr: 2 } },
        ] },
      ] },
    { id: 'tm_ch_teambuilding', chat: [['phuong', 'Cả nhà ơi, thứ Bảy này mình team building nha 🎈 Tự nguyện ạ'], ['phuong', 'Ai không đi nhắn riêng chị lý do nha'], ['bao', 'Tự nguyện mà phải giải trình 🙂'], ['khang', 'Overseas thì team building là trong giờ làm.']],
      scene: [
        ['think', '"Tự nguyện". Có giải trình.'],
        { c: 'tm_desk_teambuilding', o: [
          { t: 'Đăng ký đi, cho yên chuyện', fx: { rel: { phuong: 1 }, nl: -2 } },
          { t: 'Nhắn riêng chị Phương xin vắng, lý do thật', fx: { uy: 1, dr: 1 } },
          { t: 'Thả "haha" vào tin của Bảo', fx: { dr: 2, rel: { bao: 1, phuong: -1 } } },
        ] },
      ] },
    { id: 'tm_ch_lunchbox', chat: [['trang', 'Ai lấy nhầm hộp cơm hồng của mình không ạ 🥲'], ['long', 'Không phải tao'], ['binh', 'Camera pantry hỏng từ tháng 3'], ['mai', 'Hôm qua chị thấy anh Khang cầm hộp màu hồng 👀'], ['khang', 'It was a misunderstanding.']],
      scene: [
        ['think', 'Vụ án hộp cơm hồng. Group chat có thêm 12 thành viên đang gõ.'],
        { c: 'tm_desk_lunchbox', o: [
          { t: 'Nhắn riêng Trang: "Chiều mình mua bánh mì cho nha"', fx: { rel: { trang: 2 }, money: -20_000 } },
          { t: 'Hóng tiếp, gõ "👀" theo phong trào', fx: { dr: 2 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tm_ch_minh', chat: [['linh', 'Có ai thấy Minh online không?'], ['an', 'Minh online lần cuối 3 ngày trước'], ['linh', 'Vậy phần số liệu của Minh ai làm?'], ['an', '…'], ['linh', 'An?']],
      scene: [
        ['think', 'Có một khoảng lặng rất dài trong group. Và tên của An.'],
        { c: 'tm_desk_minh', o: [
          { t: '"Em làm phụ anh An được ạ"', fx: { rel: { an: 2, linh: 1 }, nl: -4, uy: 1 } },
          { t: 'Giả vờ chưa đọc', fx: { dr: 1 } },
          { t: 'Gửi chị Linh link file "Ai làm gì" của chị Thư', fx: { rel: { linh: 1, thu: -1 }, dr: 2 } },
        ] },
      ] },
    { id: 'tm_ch_wifi', chat: [['khang', 'Wifi chậm quá. Overseas thì…'], ['binh', 'Anh restart máy chưa ạ'], ['khang', 'It is not my laptop. It is the system.'], ['binh', 'Anh đang ngồi cạnh lò vi sóng ạ']],
      scene: [
        ['think', 'Bình đã giải quyết được vụ án, bằng một câu.'],
        { c: 'tm_desk_wifi', o: [
          { t: 'Thả tim cho tin của Bình', fx: { rel: { binh: 1 } } },
          { t: '"Em cũng chậm, chắc tại hệ thống ạ"', fx: { rel: { khang: 1, binh: -1 }, dr: 1 } },
          { t: 'Không nói gì, kéo ghế ra xa lò vi sóng', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tm_ch_salary_leak', chat: [['nhi', 'Ủa ai gửi nhầm file "Luong_T11_draft" vào group vậy ạ'], ['nhi', 'À thu hồi rồi'], ['bao', 'Tao thấy rồi 🙂'], ['bao', 'Ba năm. Tao thấy hết rồi.']],
      scene: [
        ['think', 'Tin nhắn đã thu hồi. Nhưng không ai thu hồi được trí nhớ của Bảo.'],
        { c: 'tm_desk_salary_leak', o: [
          { t: 'Nhắn riêng Bảo: "Anh ổn không?"', fx: { rel: { bao: 2 }, dr: 1, set: { tm_desk_bao_ok: true } } },
          { t: 'Nhắn riêng Nhi hỏi file đó là gì', fx: { dr: 3, rel: { nhi: -1 } } },
          { t: 'Coi như chưa thấy gì', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tm_ch_agile', chat: [['dat', 'Team ơi, mình thêm một buổi sync để chuẩn bị cho buổi stand-up nha'], ['long', 'Họp để chuẩn bị họp ạ?'], ['dat', 'Đúng rồi, time-box 30 phút thôi'], ['ha', 'Chị có một paper về hiệu quả của họp, để chị gửi']],
      scene: [
        ['think', 'Một buổi họp để chuẩn bị cho buổi họp 15 phút kéo dài 47 phút.'],
        { c: 'tm_desk_agile', o: [
          { t: 'Accept lịch, mang laptop theo làm việc', fx: { rel: { dat: 1 }, nl: -2 } },
          { t: '"Anh ơi mình gộp vào stand-up luôn được không ạ?"', fx: { uy: 2, rel: { dat: -1, long: 1 } } },
          { t: 'Đọc paper của chị Hạ cho có', fx: { rel: { ha: 1 }, clock: 10 } },
        ] },
      ] },
    { id: 'tm_ch_birthday', chat: [['gam', 'Hôm nay sinh nhật chị Quỳnh nha cả nhà 🎂'], ['quynh', 'Cảm ơn mọi người. Ai chưa nộp hóa đơn taxi tháng này thì nộp làm quà nhé.'], ['an', '🫡'], ['trang', 'Chúc mừng sinh nhật chị ạ 🎉']],
      scene: [
        ['think', 'Món quà sinh nhật chị Quỳnh muốn là hóa đơn. Rất thực tế.'],
        { c: 'tm_desk_birthday', o: [
          { t: 'Nộp ngay hóa đơn còn thiếu', fx: { rel: { quynh: 2 }, uy: 1, clock: 5 } },
          { t: 'Gửi sticker bánh kem', fx: { rel: { quynh: 1 } } },
          { t: 'Góp 50 nghìn mua bánh với chị Gấm', fx: { money: -50_000, rel: { gam: 1, quynh: 1 }, dr: -1 } },
        ] },
      ] },
    { id: 'tm_ch_han_voice', chat: [['han', '🎤 Voice message (4:12)'], ['han', 'Em nghe hết rồi làm cho chị nha, gấp lắm'], ['long', 'Chị ơi cho em xin bản chữ được không ạ'], ['han', 'Nghe đi em, có cảm xúc trong đó']],
      scene: [
        ['think', 'Bốn phút mười hai giây cảm xúc. Không có bản chữ.'],
        { c: 'tm_desk_hanvoice', o: [
          { t: 'Nghe hết, ghi lại 3 việc cần làm', fx: { rel: { han: 1 }, uy: 1, clock: 10 } },
          { t: 'Nhờ Long dịch giúp (bằng một ly trà)', fx: { rel: { long: 1 }, money: -25_000 } },
          { t: 'Nghe ở tốc độ 2x cho nhanh', fx: { dr: 1, nl: -2 } },
        ] },
      ] },
  ],

  promoOffer: [
    ['nar', 'Review xong, chị Tuyết gập laptop lại. Chị đứng dậy, tự tay đóng cửa phòng.'],
    ['tuyet', 'Chị có vài ý nhỏ. Lần này nhỏ thật.'],
    ['tuyet', 'Cả tháng, ai cũng bận drama. Chị mở ổ chung ra thì thấy tên em ở cuối gần hết các file. File đúng tên, đúng số, đúng giờ.'],
    { if: F('tm_desk_bao_ok'), then: [['tuyet', 'Bảo kể em là người duy nhất hỏi nó có ổn không. Chị cũng chưa hỏi bao giờ.']] },
    ['tuyet', 'Chị muốn giữ em lại, chính thức. Mười lăm triệu. Hợp đồng mười hai tháng, có bảo hiểm.'],
    ['think', 'Mười lăm triệu. Mình chỉ ngồi vào bàn và làm việc thôi mà.'],
    { c: 'tm_work_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, set: { accept_official: true } }, then: [
        ['tuyet', 'Tốt. Từ thứ Hai em vẫn ngồi bàn đó. Chỉ là "vài ý nhỏ" sẽ gửi thẳng cho em.'],
      ] },
      { t: '"Em cảm ơn chị, nhưng em muốn học thêm ở chỗ khác ạ."', fx: { set: { accept_official: false } }, then: [
        ['tuyet', 'Được. Người làm ra việc thì đi đâu cũng có chỗ. Chị chỉ tiếc cái ổ chung thôi.'],
      ] },
    ] },
  ],
};
