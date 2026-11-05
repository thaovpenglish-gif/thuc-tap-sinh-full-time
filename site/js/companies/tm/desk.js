// T&M Partners — desk work ("Ngồi vào bàn"): the real work of a consulting intern, plus the group-chat drama that
// still finds you while you do it. Engine: game/desk.js + modes/solo.js. Contract: docs/COMPANY_CONTRACT.md §12.
// games: mini-game banks (pick/quiz/order/sort; `show`/`ask` = how many items/questions one play draws from the bank)
// chatter: [castId, text, dm?] messages that land WHILE you play, then a short scene with one choice.

const F = (k) => (r) => !!r.flags[k];

export const DESK = {
  games: [
    { id: 'tm_deck_qc', type: 'pick', title: 'Soát deck trước khi gửi khách', icon: '🔎', pick: 3, show: 7, time: 40, pass: 0.66,
      prompt: 'Deck 42 trang gửi khách lúc 17:00. Chọn 3 lỗi BẮT BUỘC phải sửa.',
      items: [
        { text: 'Slide 3 ghi tên khách "Trà Sữa Tâm Trạn"', correct: true },
        { text: 'Biểu đồ doanh thu: trục tung không có đơn vị', correct: true },
        { text: 'Footer vẫn còn logo của khách cũ', correct: true },
        { text: 'Executive summary dài 3 trang', correct: true },
        { text: 'Số tổng ở slide 12 khác slide 30', correct: true },
        { text: 'Font tiêu đề hơi to', sub: 'Chị Linh thích to' },
        { text: 'Màu xanh ngọc thay vì xanh dương', sub: 'Đúng brand guideline' },
        { text: 'Có chữ "synergy" ở slide 5', sub: 'Chị Hân thêm, đừng động vào' },
        { text: 'Slide cảm ơn có ảnh mèo', sub: 'Mèo KPI, đã được duyệt' },
      ] },
    { id: 'tm_han_dict', type: 'quiz', title: 'Từ điển Hân – Việt (bản beta của Long)', icon: '📖', ask: 3, time: 40, pass: 0.66,
      prompt: 'Chị Hân vừa gửi voice. Dịch sang tiếng người trước khi làm.',
      questions: [
        { q: '"Em làm cho chị cái road mát nha"', options: ['Lộ trình (roadmap)', 'Quạt mát cho phòng họp', 'Một con đường có cây'], correct: 0 },
        { q: '"Mình cần một cái frame wok rõ ràng"', options: ['Khung phân tích (framework)', 'Cái chảo xào', 'Khung ảnh cho sảnh'], correct: 0 },
        { q: '"Deadline là EOD nhưng mà flexible nha"', options: ['Hết hôm nay, và chị sẽ hỏi lúc 16:00', 'Tuần sau cũng được', 'Không có deadline'], correct: 0 },
        { q: '"Em check lại cái insight cho nó insightfull hơn"', options: ['Viết rõ nhận định rút ra từ số liệu', 'Thêm icon bóng đèn', 'Đổi chữ thành in đậm'], correct: 0 },
        { q: '"Cái này mình cần align với stakeholder"', options: ['Hỏi ý các bên liên quan trước', 'Căn lề trái', 'Mua thêm cổ phiếu'], correct: 0 },
      ] },
    { id: 'tm_mece', type: 'sort', title: 'Gom ý phỏng vấn khách hàng', icon: '🧩', show: 8, time: 45, pass: 0.6,
      prompt: 'Long ghi chú 30 ý từ phỏng vấn. Mỗi ý thuộc nhóm nào?',
      bins: ['💰 Giá', '🚚 Giao hàng', '🧋 Sản phẩm'],
      items: [
        { text: '"Trà sữa 65 nghìn mà topping tính riêng"', bin: 0 },
        { text: '"Ship tới nơi thì đá tan hết"', bin: 1 },
        { text: '"Vị đường đen ngọt quá"', bin: 2 },
        { text: '"Combo 2 ly không rẻ hơn mua lẻ"', bin: 0 },
        { text: '"Đặt lúc 11:30 mà 13:00 mới tới"', bin: 1 },
        { text: '"Trân châu dai như dây thun"', bin: 2 },
        { text: '"App bắt trả thêm phí đóng gói 5 nghìn"', bin: 0 },
        { text: '"Shipper gọi 4 cuộc vì không thấy tòa nhà"', bin: 1 },
        { text: '"Size L với size M nhìn như nhau"', bin: 2 },
        { text: '"Mã giảm giá chỉ áp dụng sau 22h"', bin: 0 },
        { text: '"Ly bị đổ một nửa trong túi"', bin: 1 },
      ] },
    { id: 'tm_storyline', type: 'order', title: 'Xếp storyline cho deck', icon: '🧵', time: 35, pass: 0.6,
      prompt: 'Chị Linh: "Storyline trước, slide sau." Xếp theo thứ tự kể chuyện.',
      items: [
        { text: 'Bối cảnh: thị trường trà sữa tăng 12%/năm', order: 0 },
        { text: 'Vấn đề: khách hàng của khách giảm 3 quý liền', order: 1 },
        { text: 'Nguyên nhân gốc: giao hàng chậm và giá rối', order: 2 },
        { text: 'Khuyến nghị: gói giá mới + đối tác giao hàng', order: 3 },
        { text: 'Lộ trình 90 ngày và người phụ trách', order: 4 },
      ] },
    { id: 'tm_excel_rev', type: 'quiz', title: 'Mô hình doanh thu của chị Hạ', icon: '📊', ask: 3, time: 45, pass: 0.66,
      prompt: 'File Excel 14 sheet. Chị Hạ hỏi ba câu "nhanh thôi".',
      questions: [
        { q: '120 cửa hàng × 300 ly/ngày × 30 ngày = ? ly/tháng', options: ['1.080.000', '108.000', '10.800.000'], correct: 0 },
        { q: 'Doanh thu tăng từ 80 lên 100 tỷ. Tăng bao nhiêu %?', options: ['25%', '20%', '80%'], correct: 0 },
        { q: 'Biên lợi nhuận 15% trên 200 tỷ doanh thu là?', options: ['30 tỷ', '15 tỷ', '185 tỷ'], correct: 0 },
        { q: 'Ô tổng ra 0 dù cột có số. Kiểm tra gì trước?', options: ['Số có đang bị lưu dạng chữ không', 'Bật tắt máy', 'Hỏi Mèo KPI'], correct: 0 },
        { q: 'Giả định "tăng trưởng 40%/năm trong 10 năm" thì nên…', options: ['Ghi chú nguồn và thử kịch bản thấp hơn', 'Giữ nguyên, cho đẹp', 'Đổi thành 50%'], correct: 0 },
      ] },
    { id: 'tm_inbox', type: 'sort', title: 'Inbox sáng nay', icon: '📥', show: 7, time: 40, pass: 0.6,
      prompt: '47 email chưa đọc. Xử lý nhanh trước stand-up của anh Đạt.',
      bins: ['⚡ Làm ngay', '📌 Để chiều', '🗑️ Lưu/bỏ'],
      items: [
        { text: 'Chị Tuyết: "Em gửi chị bản tóm tắt trước 9h nhé"', bin: 0 },
        { text: 'Khách: "Bên em gửi lại file có số trang được không?"', bin: 0 },
        { text: 'Chị Phương: Khảo sát văn hóa công ty (lần 4 trong tháng)', bin: 1 },
        { text: 'Bình: "Máy in tầng 2 đã chạy lại (tạm thời)"', bin: 2 },
        { text: 'Chị Quỳnh: "Em nộp hóa đơn taxi hôm thứ Ba chưa?"', bin: 1 },
        { text: 'Newsletter: "10 framework mọi consultant phải biết"', bin: 2 },
        { text: 'Chị Linh: "Số liệu slide 7 sai, sửa trước họp 10h"', bin: 0 },
        { text: 'Anh Đạt: Mời họp "Retro của buổi Retro"', bin: 1 },
        { text: 'Reply all: "Dạ em cảm ơn ạ" (lần thứ 19)', bin: 2 },
      ] },
    { id: 'tm_sources', type: 'pick', title: 'Nguồn số liệu cho slide thị trường', icon: '📚', pick: 2, show: 6, time: 35, pass: 0.5,
      prompt: 'Chị Hạ dặn: "Nguồn phải đứng được trước mặt khách." Chọn 2 nguồn dùng được.',
      items: [
        { text: 'Báo cáo ngành của hiệp hội, năm 2026', correct: true },
        { text: 'Số liệu thống kê chính thức, có ghi rõ năm', correct: true },
        { text: 'Báo cáo thường niên của doanh nghiệp niêm yết', correct: true },
        { text: 'Bài đăng "nghe nói thị trường to lắm" trên mạng xã hội' },
        { text: 'Slide cũ của một hãng tư vấn, không rõ năm' },
        { text: 'Anh Khang: "Ở nước ngoài người ta bảo thế"' },
        { text: 'Bình luận dưới video review trà sữa' },
      ] },
    { id: 'tm_meeting_notes', type: 'pick', title: 'Viết biên bản họp', icon: '📝', pick: 3, show: 7, time: 40, pass: 0.66,
      prompt: 'Họp 2 tiếng. Biên bản chỉ cần 3 dòng quan trọng nhất. Chọn 3.',
      items: [
        { text: 'Chốt: gửi khách bản nháp thứ Sáu', correct: true },
        { text: 'An phụ trách phần giá, Long phần khảo sát', correct: true },
        { text: 'Khách muốn thêm phương án giao hàng tự vận hành', correct: true },
        { text: 'Rủi ro: chưa có số liệu tháng 10', correct: true },
        { text: 'Chị Hân kể chuyến networking ở Singapore', sub: '25 phút' },
        { text: 'Anh Khang so sánh với "bên nước ngoài"', sub: 'Lần 3' },
        { text: 'Tranh luận nên gọi là "roadmap" hay "lộ trình"', sub: 'Chưa chốt' },
        { text: 'Mèo KPI đi ngang qua bàn họp', sub: 'Mọi người vỗ tay' },
      ] },
    { id: 'tm_timesheet', type: 'order', title: 'Điền timesheet tuần', icon: '⏱️', time: 30, pass: 0.6,
      prompt: 'Chị Quỳnh cần timesheet để tính phí khách. Xếp các việc theo thứ tự đã làm trong ngày.',
      items: [
        { text: '08:15 Daily stand-up (dự kiến 15 phút)', order: 0 },
        { text: '09:02 Daily stand-up kết thúc', order: 1 },
        { text: '09:10 Sửa deck theo "vài ý nhỏ"', order: 2 },
        { text: '14:00 Phỏng vấn khách hàng', order: 3 },
        { text: '17:45 Sửa deck theo "vài ý nhỏ" (tiếp)', order: 4 },
      ] },
    { id: 'tm_email_tone', type: 'quiz', title: 'Trả lời email khách hàng', icon: '✉️', ask: 3, time: 40, pass: 0.66,
      prompt: 'Khách hàng hơi khó chịu. Chọn câu trả lời ổn nhất.',
      questions: [
        { q: 'Khách: "Sao file vẫn sai tên công ty bên chị?"', options: ['Xin lỗi, gửi bản sửa trong 30 phút', '"Dạ do bên IT ạ"', 'Im lặng chờ khách quên'], correct: 0 },
        { q: 'Khách xin thêm phạm vi "nhỏ thôi" ngoài hợp đồng', options: ['Ghi nhận, báo lại sau khi trao đổi với sếp', '"Dạ được ạ" luôn', '"Không có trong hợp đồng ạ." Hết.'], correct: 0 },
        { q: 'Khách hỏi số liệu mà bạn chưa chắc', options: ['Hẹn giờ trả lời sau khi kiểm tra', 'Đoán một con số cho nhanh', 'Hỏi lại khách số đó là bao nhiêu'], correct: 0 },
        { q: 'Kết thư gửi khách nên là', options: ['"Trân trọng," + tên, chức danh, công ty', '"Thân ái và quyết thắng"', '"Sent from my iPhone"'], correct: 0 },
      ] },
    { id: 'tm_official_budget', type: 'sort', official: true, title: 'Duyệt chi phí dự án', icon: '🧾', show: 7, time: 40, pass: 0.66,
      prompt: 'Lên chính thức rồi, giờ bạn duyệt chi. Chị Quỳnh đang nhìn.',
      bins: ['✅ Duyệt', '❌ Trả lại'],
      items: [
        { text: 'Taxi đi gặp khách, có hóa đơn', bin: 0 },
        { text: 'In 3 bộ deck cho buổi họp với khách', bin: 0 },
        { text: '"Cà phê networking" 2,4 triệu, không ghi gặp ai', bin: 1 },
        { text: 'Mua thêm bàn phím cho intern mới', bin: 0 },
        { text: 'Khóa học "Mindset tỷ phú" của anh Khang', bin: 1 },
        { text: 'Bánh sinh nhật team (đã có trong quỹ)', bin: 0 },
        { text: 'Thuê Agile Coach thứ hai để coach anh Đạt', bin: 1 },
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
