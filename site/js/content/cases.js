// Phá Án Công Sở: the cases. Each one is solvable from the files alone; every name is fictional and comes from
// the Solo companies. Format (checked by validateCase in game/detective.js and tests/detective.test.mjs):
//   people:         { id: { name, emoji, role } }
//   evidence[]:     { id, icon, title, lines?, table?: { head, rows }, note?, locked? }
//   testimony[]:    { id, who, text, locked? }
//   contradictions: { stmt, ev: [evidence ids that break it], reveal: [[who | 'nar', text]], unlock: [ids] }
//   questions[]:    { id, q, options, answer (index), why }
//   hints[]:        from gentle to almost the answer

export const CASES = [
  // ───────────────────────── Vụ 1 · dễ ─────────────────────────
  {
    id: 'oat',
    no: 1,
    title: 'Hộp Oat Milk Vơi Một Nửa',
    company: 'T&M Partners',
    level: 1,
    tagline: 'Pantry, thẻ từ và một ly latte không ai nhận.',
    intro: [
      '11:30 sáng thứ Ba. Khang đứng giữa pantry, giơ hộp sữa yến mạch lên như giơ tang vật ở tòa: "Mười giờ còn gần đầy. Giờ còn một nửa. Ở overseas không ai làm vậy."',
      'Chị Tuyết giao vụ này cho bạn: "Em là intern, em trung lập. Tìm ra ai trước giờ ăn trưa. Chị không muốn nghe chữ overseas thêm lần nào nữa."',
    ],
    people: {
      khang: { name: 'Khang', emoji: '🌍', role: 'Chủ hộp oat milk' },
      phuong: { name: 'Chị Phương', emoji: '🎈', role: 'HR & Culture' },
      binh: { name: 'Bình', emoji: '🔌', role: 'IT Support' },
      long: { name: 'Long', emoji: '🧮', role: 'Business Analyst · team chị Hạ' },
      ha: { name: 'Chị Hạ', emoji: '📚', role: 'Giám đốc Nghiên cứu' },
    },
    evidence: [
      { id: 'e_story', icon: '📸', title: 'Story Instagram của Khang · 10:00', lines: [
        'Ảnh: một ly latte trên bàn pantry, cạnh đó là hộp oat milk 1 lít, còn gần đầy.',
        'Caption: "Morning oat latte ☕ #overseasmindset"',
      ] },
      { id: 'e_badge', icon: '🪪', title: 'Nhật ký thẻ từ cửa pantry', table: { head: ['Giờ', 'Thẻ của'], rows: [
        ['10:12', 'Chị Phương'], ['10:47', 'Bình'], ['11:05', 'Long'], ['11:30', 'Khang'],
      ] }, note: 'Cửa pantry chỉ mở bằng thẻ và tự đóng sau 5 giây. Bình (IT) xác nhận: mỗi lần quẹt chỉ lọt một người.' },
      { id: 'e_machine', icon: '☕', title: 'Lịch sử máy pha cà phê', table: { head: ['Giờ', 'Đồ uống'], rows: [
        ['10:13', 'Espresso'], ['10:48', 'Espresso đôi'], ['11:06', 'Latte · có dùng vòi đánh sữa'],
      ] }, note: 'Máy chỉ ghi lại khi có người bấm nút.' },
      { id: 'e_jug', icon: '🥛', title: 'Ca đánh sữa trên máy pha', lines: [
        'Lúc 11:30 ca inox vẫn còn ấm. Đáy ca còn chút bọt, mùi yến mạch rõ.',
        'Pantry chỉ có hai loại sữa: sữa đặc (lon) và oat milk của Khang. Sữa đặc thì không đánh bọt được.',
      ] },
      { id: 'e_teams', icon: '💬', title: 'Tin nhắn Teams · Chị Hạ → Long · 11:03', locked: true, lines: [
        'Chị Hạ: "Long ơi cho chị mượn thẻ xuống pantry tí, chị để quên thẻ ở nhà 🥲"',
        'Long: "Dạ thẻ em trên bàn, chị cứ lấy nha. Em đang chạy model."',
      ] },
    ],
    testimony: [
      { id: 't_khang', who: 'khang', text: 'Mười giờ anh pha latte, chụp story xong là cất hộp vào tủ lạnh. Từ đó tới 11:30 anh call với khách, không xuống pantry lần nào.' },
      { id: 't_phuong', who: 'phuong', text: 'Chị vào pha espresso, uống đen, chị đang keto. Mà nói nhỏ nha: cả công ty chỉ có chị Hạ dị ứng sữa bò, đi team building toàn phải đặt món riêng.' },
      { id: 't_binh', who: 'binh', text: 'Anh vào làm ly espresso đôi rồi đi sửa máy in. Cà phê đen. Như đời anh.' },
      { id: 't_long', who: 'long', text: 'Sáng nay em không xuống pantry lần nào. Em ngồi chạy model từ 9 giờ, không nhúc nhích.' },
      { id: 't_ha', who: 'ha', text: 'Chị ngồi đọc paper cả buổi sáng, không rời ghế. Đọc paper thì ai mà đi pha cà phê.' },
      { id: 't_ha2', who: 'ha', locked: true, text: 'Chị sẽ mua trả Khang hai hộp. Và xin em đừng ghi chữ "latte art" vào biên bản.' },
    ],
    contradictions: [
      { stmt: 't_long', ev: ['e_badge'], unlock: ['e_teams'], reveal: [
        ['long', 'Ờ… thẻ đó là của em. Nhưng người đi không phải em! Có người nhắn mượn thẻ, em bảo cứ lấy trên bàn. Tin nhắn còn đây nè.'],
        ['nar', 'Long mở Teams cho bạn xem. Một hồ sơ mới được thêm vào.'],
      ] },
      { stmt: 't_ha', ev: ['e_teams'], unlock: ['t_ha2'], reveal: [
        ['ha', '…Thôi được rồi. Chị dị ứng sữa bò, mà thèm latte quá. Chị định dùng một chút thôi.'],
        ['ha', 'Rồi chị thử vẽ latte art. Hỏng. Vẽ lại. Hỏng tiếp. Tới lần thứ tư thì… còn nửa hộp.'],
      ] },
    ],
    questions: [
      { id: 'who', q: 'Ai đã dùng oat milk của Khang?', options: ['Chị Phương', 'Bình', 'Long', 'Chị Hạ'], answer: 3,
        why: 'Thẻ của Long mở cửa lúc 11:05, nhưng tin nhắn 11:03 cho thấy chị Hạ mượn thẻ. Một phút sau, máy pha ra ly latte có đánh sữa.' },
      { id: 'how', q: 'Người đó vào pantry bằng cách nào?', options: ['Bằng thẻ của chính mình', 'Mượn thẻ của Long', 'Đi lọt theo sau Bình', 'Cửa pantry hỏng, không cần thẻ'], answer: 1,
        why: 'Tin nhắn Teams 11:03 và dòng "11:05 · Long" trong nhật ký thẻ. Cửa tự đóng sau 5 giây nên không ai lọt theo được.' },
      { id: 'proof', q: 'Bằng chứng nào cho thấy oat milk được dùng lúc 11:06?', options: [
        'Story Instagram của Khang lúc 10:00',
        'Máy pha ghi "Latte · có dùng vòi đánh sữa" và ca đánh sữa còn mùi yến mạch',
        'Chị Phương đang keto',
        'Bình uống cà phê đen',
      ], answer: 1,
        why: 'Từ 10:00 đến 11:30 chỉ có một đồ uống dùng sữa. Pantry có hai loại sữa, mà sữa đặc thì không đánh bọt được.' },
      { id: 'why', q: 'Vì sao người đó dùng oat milk?', options: ['Muốn chọc tức Khang', 'Dị ứng sữa bò mà thèm latte', 'Pha giúp khách', 'Long nhờ pha hộ'], answer: 1,
        why: 'Chị Phương lỡ miệng: cả công ty chỉ có chị Hạ dị ứng sữa bò. Chị Hạ cũng tự nhận khi bị phản bác.' },
    ],
    hints: [
      'Có người nói "không xuống pantry lần nào", mà nhật ký thẻ lại có tên người đó.',
      'Long chỉ cho mượn thẻ. Đọc tin nhắn vừa mở khóa, rồi so với lời khai của người đã nhắn.',
      'Từ 10:00 đến 11:30 chỉ có MỘT đồ uống dùng sữa. Xem ai quẹt thẻ ngay trước giờ đó.',
    ],
    epilogue: 'Chị Hạ mua trả Khang hai hộp oat milk, kèm giấy note: "Sorry. Very overseas." Khang tha thứ, rồi đăng story về chuyện tha thứ. Chị Tuyết ghi vào sổ: "Intern phá án trong một buổi sáng. Nhanh hơn IT sửa máy in."',
  },

  // ───────────────────────── Vụ 2 · vừa ─────────────────────────
  {
    id: 'email',
    no: 2,
    title: 'Email Lúc 23:47',
    company: 'Trend Trễ Agency',
    level: 2,
    tagline: 'Một slide ghi chú "khó như mẹ chồng" lọt tới tay khách.',
    intro: [
      'Thứ Năm, 23:47. Hộp thư team@trendtre.vn gửi cho chị Nguyệt (Brand Manager, Mì Ông Táo) file "Proposal_FINAL_final_v7.pptx". Phần ghi chú của slide 14 có một dòng: "Khách này khó như mẹ chồng. Cứ đưa 3 phương án, chị ấy sẽ chọn cái tệ nhất."',
      'Sáng thứ Sáu chị Nguyệt trả lời đúng một chữ: "Ok." Không chấm, không icon. Cả agency đông cứng.',
      'Anh Tùng (MD) giao cho bạn: "Tìm ra ai gửi, ai viết, trước 9 giờ. Chiều qua team sản xuất đi quay ở Củ Chi hết, văn phòng chỉ còn 6 người: anh, Khải, Thi, Vỹ, Sương và Diệp."',
    ],
    people: {
      tung: { name: 'Anh Tùng', emoji: '💥', role: 'Managing Director' },
      khai: { name: 'Anh Khải', emoji: '🖤', role: 'Creative Director' },
      thi: { name: 'Thi', emoji: '🪶', role: 'Copywriter' },
      vy: { name: 'Vỹ', emoji: '🎨', role: 'Designer' },
      suong: { name: 'Sương', emoji: '🌙', role: 'Social & Community' },
      diep: { name: 'Chị Diệp', emoji: '📱', role: 'Account Manager' },
    },
    evidence: [
      { id: 'e_mail', icon: '📧', title: 'Email gửi khách', lines: [
        'Từ: team@trendtre.vn · Đến: Chị Nguyệt (Mì Ông Táo)',
        'Khách nhận lúc: Thứ Năm 23:47',
        'Đính kèm: Proposal_FINAL_final_v7.pptx',
        'Nội dung: "Dạ gửi chị bản cuối ạ. Team đã làm tới khuya để kịp cho chị 🙏"',
      ] },
      { id: 'e_header', icon: '🔍', title: 'Chi tiết kỹ thuật của email (Message details)', table: { head: ['Mục', 'Giá trị'], rows: [
        ['Kiểu gửi', 'Gửi theo lịch (Scheduled send)'],
        ['Bấm gửi lúc', 'Thứ Năm 17:02'],
        ['Hẹn giờ gửi', 'Thứ Năm 23:47'],
        ['Thiết bị', 'Outlook for Mac · MAC-CREATIVE-01'],
      ] } },
      { id: 'e_mac', icon: '💻', title: 'Máy chung MAC-CREATIVE-01', lines: [
        'MacBook chung ở góc creative, khóa dây vào bàn, không mang ra ngoài được, không có phần mềm điều khiển từ xa.',
        'Đăng nhập sẵn hộp thư team@. Ai ngồi vào cũng gửi được.',
        'Chiều thứ Năm có một tờ giấy note vàng dán ở mép màn hình: "NHỚ XÓA GHI CHÚ SLIDE 14 TRƯỚC KHI GỬI!!! – K"',
      ] },
      { id: 'e_version', icon: '🕘', title: 'Lịch sử chỉnh sửa file v7', table: { head: ['Thứ Năm', 'Tài khoản', 'Thao tác'], rows: [
        ['14:10', 'thi.copy', 'Sửa tiêu đề slide 3'],
        ['15:20', 'khai.cd', 'Thêm ghi chú slide 14'],
        ['15:45', 'vy.design', 'Đổi font slide 1–20 (lần 3)'],
        ['17:01', 'MAC-CREATIVE-01', 'Mở file'],
      ] }, note: 'Mỗi người sửa file trên máy riêng bằng tài khoản riêng. Máy chung chỉ hiện tên máy.' },
      { id: 'e_meeting', icon: '📅', title: 'Lịch họp Outlook · Thứ Năm', lines: [
        '16:30–17:30 · Phòng Kem Dâu · "Brainstorm Tết: làm sao cho nó POP"',
        'Mời: Anh Tùng, Anh Khải, Thi, Sương. Có bật ghi hình.',
      ] },
      { id: 'e_rec', icon: '🎥', title: 'Ảnh chụp từ bản ghi cuộc họp · 17:01', locked: true, lines: [
        'Khung hình có đủ bốn người: Anh Tùng vẽ chữ POP lên bảng, Anh Khải khoanh tay, Thi ghi biên bản, Sương cầm điện thoại.',
        'Bản ghi chạy liền từ 16:30 tới 17:31. Không ai rời phòng.',
      ] },
      { id: 'e_dentist', icon: '🦷', title: 'Hóa đơn Nha khoa Nụ Cười (Quận 7) · của Vỹ', lines: [
        'Vào khám: 16:40 · Nhổ răng khôn số 8 · Ra về: 17:25',
        'Văn phòng ở Quận 3, đi xe mất khoảng 35 phút.',
      ] },
      { id: 'e_parking', icon: '🛵', title: 'Nhật ký bãi xe tòa nhà (vé tháng) · Thứ Năm', table: { head: ['Giờ ra', 'Chủ xe'], rows: [
        ['16:02', 'Vỹ'], ['17:15', 'Chị Diệp'], ['17:34', 'Anh Tùng'], ['17:36', 'Thi'], ['17:40', 'Anh Khải'], ['19:02', 'Sương'],
      ] } },
      { id: 'e_fanpage', icon: '📲', title: 'Lịch đăng fanpage Mì Ông Táo · Thứ Năm', lines: [
        '23:45 · Sương đăng bài "Đêm khuya rồi, làm gói mì không? 🍜" từ điện thoại.',
        '23:50 · Sương trả lời 37 bình luận.',
      ] },
    ],
    testimony: [
      { id: 't_tung', who: 'tung', text: 'Họp xong năm rưỡi anh về. Chị Nguyệt trả lời "Ok." Em biết "Ok." không chấm nghĩa là gì không? Là ngân sách quý sau đó.' },
      { id: 't_khai', who: 'khai', text: 'Email gửi lúc 23:47. Giờ đó cả công ty chỉ có Sương còn thức. Không cần điều tra nữa.' },
      { id: 't_khai2', who: 'khai', text: 'Còn câu "mẹ chồng" không phải của tôi. Tôi còn chưa mở file v7 lần nào.' },
      { id: 't_thi', who: 'thi', text: 'Em ngồi họp từ bốn rưỡi tới năm rưỡi, em ghi biên bản. Bằng thơ lục bát. Ai cần em đọc.' },
      { id: 't_vy', who: 'vy', text: 'Bốn giờ em đi nhổ răng khôn rồi, giờ nói vẫn chưa rõ. Mà font slide 14 là em chỉnh đó, đẹp không?' },
      { id: 't_suong', who: 'suong', text: '23:47 em đang trực fanpage cho chính khách đó. Em thức là chuyện bình thường. Em không đụng tới cái deck.' },
      { id: 't_diep', who: 'diep', text: 'Chị về lúc 4 giờ 45 để đón con. Chiều đó chị không đụng vào máy chung.' },
      { id: 't_diep2', who: 'diep', locked: true, text: 'Tờ note chữ "K" hả? Chị tưởng K là Khánh Linh. Khánh Linh đi quay rồi, chị nghĩ chắc em ấy xóa rồi. Chị đâu có mở slide 14.' },
    ],
    contradictions: [
      { stmt: 't_khai', ev: ['e_header'], unlock: ['e_rec'], reveal: [
        ['nar', 'Bạn chỉ vào dòng "Gửi theo lịch". Email không được gửi lúc 23:47. Nó được bấm gửi lúc 17:02, trên máy chung, rồi nằm chờ.'],
        ['khai', 'Thì… vậy là ai đó ngồi máy chung lúc 5 giờ chiều. Lúc đó tôi đang họp. Có ghi hình hẳn hoi, tôi gửi cho xem.'],
      ] },
      { stmt: 't_diep', ev: ['e_parking'], unlock: ['t_diep2'], reveal: [
        ['diep', '…Ừ, chị ngồi lại thêm chút. Khách đòi bản cuối, chị hẹn giờ gửi 23:47 cho khách tưởng team làm tới khuya. Agency nào chả làm vậy.'],
        ['diep', 'Chị lấy file trong thư mục FINAL. Chị tưởng đó là bản sạch rồi.'],
      ] },
      { stmt: 't_khai2', ev: ['e_version'], unlock: [], reveal: [
        ['khai', '…Được rồi. Tôi viết lúc 3 giờ chiều, lúc đang bực. Nhưng tôi đã dán giấy nhắc xóa rồi mà! Chữ K to thế cơ mà!'],
      ] },
    ],
    questions: [
      { id: 'when', q: 'Email thật ra được bấm gửi lúc mấy giờ?', options: ['23:47', '17:02', '16:45', '17:15'], answer: 1,
        why: 'Chi tiết kỹ thuật ghi "Gửi theo lịch": bấm gửi 17:02, hẹn giờ 23:47.' },
      { id: 'who', q: 'Ai đã bấm hẹn giờ gửi email?', options: ['Sương', 'Anh Khải', 'Chị Diệp', 'Vỹ'], answer: 2,
        why: 'Lúc 17:02, bốn người đang họp (có bản ghi), Vỹ ở nha khoa Quận 7. Người duy nhất còn ở tòa nhà là chị Diệp: xe ra bãi lúc 17:15, không phải 16:45 như chị nói.' },
      { id: 'wrote', q: 'Ai viết câu "khó như mẹ chồng"?', options: ['Chị Diệp', 'Anh Khải', 'Thi', 'Vỹ'], answer: 1,
        why: 'Lịch sử chỉnh sửa: 15:20, khai.cd thêm ghi chú slide 14. Tờ note nhắc xóa cũng ký "K".' },
      { id: 'why', q: 'Vì sao email lại tới tay khách lúc 23:47?', options: [
        'Sương lỡ tay gửi lúc đang trực fanpage',
        'Hẹn giờ để khách tưởng team làm tới khuya',
        'Máy chủ email bị trễ gần 7 tiếng',
        'Anh Khải cố tình gửi để hại chị Diệp',
      ], answer: 1, why: 'Chị Diệp tự nhận khi bị phản bác. Mẹo quen của agency.' },
      { id: 'alibi', q: 'Bằng chứng nào loại được bốn người đang họp?', options: [
        'Lịch họp Outlook',
        'Ảnh chụp từ bản ghi cuộc họp lúc 17:01',
        'Biên bản bằng thơ lục bát của Thi',
        'Nhật ký bãi xe',
      ], answer: 1,
        why: 'Lịch họp chỉ cho biết ai được mời, không chứng minh ai có mặt. Bản ghi hình chạy liền 16:30–17:31 mới chứng minh.' },
    ],
    hints: [
      'Đọc kỹ "Chi tiết kỹ thuật của email". 23:47 có thật là lúc ai đó ngồi bấm gửi không?',
      'Lúc 17:02, sáu người đang ở đâu? Ai có bằng chứng thật, ai chỉ có lời nói?',
      'Nhật ký bãi xe ghi giờ ra của từng người. So với người nói "về lúc 4 giờ 45". Còn câu "mẹ chồng" thì xem lịch sử chỉnh sửa.',
    ],
    epilogue: 'Anh Tùng gọi cho chị Nguyệt, xin lỗi bằng giọng "make it pop" nhỏ nhất đời. Chị Nguyệt trả lời: "Chị đọc từ tối qua rồi. Slide 14 là slide thật nhất cả deck." Ngân sách quý sau giữ nguyên. Anh Khải bị phạt viết 50 tagline cho Mì Ông Táo. Chị Diệp đổi giờ hẹn gửi thành 6:00 sáng, "cho giống team dậy sớm".',
  },

  // ───────────────────────── Vụ 3 · khó ─────────────────────────
  {
    id: 'drop',
    no: 3,
    title: 'DROP TABLE Lúc 2 Giờ Sáng',
    company: 'Nợ Kỹ Thuật Labs',
    level: 3,
    tagline: 'Log máy chủ, VPN, múi giờ, và một con bot rất chăm.',
    intro: [
      'Thứ Bảy 31/10, 02:05. Bot #deploy hét lên trên Slack: bảng orders của app Lúa biến mất. Bốn mươi nghìn đơn đi chợ online bốc hơi. Anh Lộc khôi phục từ bản sao lưu, mất 6 tiếng và 11 ly cà phê.',
      'Anh Thạc (CTO) giao cho bạn: "Mình làm post-mortem blameless, không đổ lỗi. Nhưng anh vẫn muốn biết chính xác ai. Blameless thôi."',
    ],
    people: {
      thac: { name: 'Anh Thạc', emoji: '🧯', role: 'CTO' },
      khai: { name: 'Anh Khải', emoji: '🐘', role: 'Tech Lead Backend' },
      duy: { name: 'Duy', emoji: '📈', role: 'Growth Lead' },
      tung: { name: 'Tùng', emoji: '📱', role: 'Mobile Dev' },
      chau: { name: 'Châu', emoji: '🤖', role: 'Intern PM' },
      loc: { name: 'Anh Lộc', emoji: '🔥', role: 'DevOps (người duy nhất)' },
    },
    evidence: [
      { id: 'e_alert', icon: '🚨', title: 'Slack #incident', table: { head: ['Giờ', 'Tin nhắn'], rows: [
        ['02:05 · T7 31/10', 'Bot #deploy: "🔥 prod-db: bảng orders không tồn tại. App Lúa sập 🙏"'],
        ['02:31', 'Anh Lộc (điện thoại): "ack. đang dậy."'],
        ['08:40', 'Anh Lộc: "restore xong. đừng ai hỏi gì anh 2 tiếng."'],
      ] }, note: 'Slack hiển thị theo giờ Việt Nam (GMT+7).' },
      { id: 'e_audit', icon: '🗄️', title: 'Audit log máy chủ cơ sở dữ liệu', table: { head: ['Thời điểm', 'Tài khoản', 'IP', 'Lệnh'], rows: [
        ['30/10 12:15:40', 'deploy', '10.8.0.5', 'SELECT 1;'],
        ['30/10 19:03:02', 'deploy', '10.8.0.17', 'SELECT * FROM table_stats;'],
        ['30/10 19:04:51', 'deploy', '10.8.0.17', 'DROP TABLE orders;'],
      ] }, note: 'Máy chủ đặt ở Singapore, để cấu hình mặc định: mọi mốc giờ ghi theo UTC.' },
      { id: 'e_vpn', icon: '🔐', title: 'Nhật ký VPN công ty (giờ Việt Nam)', table: { head: ['Từ → đến', 'Người', 'IP được cấp'], rows: [
        ['30/10 18:50 → 19:40', 'Duy', '10.8.0.17'],
        ['30/10 19:00 → 19:30', 'Anh Thạc', '10.8.0.5'],
        ['30/10 23:10 → 31/10 01:30', 'Tùng', '10.8.0.17'],
        ['31/10 01:52 → 02:40', 'Châu', '10.8.0.17'],
        ['31/10 02:33 → 08:45', 'Anh Lộc', '10.8.0.9'],
      ] }, note: 'Ai ngắt kết nối thì IP được cấp lại cho người vào sau.' },
      { id: 'e_notion', icon: '📄', title: 'Notion · "Onboarding cho intern ✨"', lines: [
        'Sửa lần cuối: Anh Lộc · 02/10',
        'Mục 1. Wifi văn phòng: LuaXanh2024',
        'Mục 4. Không deploy chiều thứ Sáu (trừ khi anh Kevin bảo)',
        'Mục 7. Cần xem dữ liệu thật thì dùng tạm tài khoản deploy, mật khẩu Lua@prod#2024 (cho nhanh, sau này làm quyền riêng)',
      ] },
      { id: 'e_devops', icon: '💬', title: 'Slack #devops · tin cũ', table: { head: ['Giờ', 'Tin nhắn'], rows: [
        ['14/07 23:12', 'Anh Lộc: "Tắt cron cập nhật table_stats cho đỡ tiền server 💸. Tháng sau bật lại."'],
        ['14/07 23:13', 'Anh Kevin: "🙏 tiết kiệm là văn hóa"'],
      ] }, note: 'table_stats: bảng thống kê số lượt truy vấn của từng bảng, do cron cập nhật mỗi đêm.' },
      { id: 'e_agent', icon: '🤖', title: 'Nhật ký ChauBot (agent AI Châu tự viết) · giờ Việt Nam', locked: true, table: { head: ['Giờ', 'ChauBot'], rows: [
        ['01:53', 'Khởi động. Nhiệm vụ từ Châu: "Dọn database cho gọn giùm mọi người, xóa bảng không dùng. Đừng làm phiền ai nha 🙏"'],
        ['01:55', 'Đọc Notion "Onboarding cho intern ✨" → tìm thấy tài khoản deploy.'],
        ['02:03', 'Đọc table_stats: bảng orders có 0 lượt truy vấn trong 30 ngày → đánh dấu "không dùng".'],
        ['02:04', 'Hỏi Châu để xác nhận. 60 giây không trả lời. Chỉ dẫn: "đừng làm phiền ai" → tự quyết.'],
        ['02:04:51', 'DROP TABLE orders; ✅ Đã dọn gọn!'],
        ['02:05', 'Báo cáo: "Database gọn hơn 38%! 🎉"'],
      ] } },
    ],
    testimony: [
      { id: 't_thac', who: 'thac', text: 'Tài khoản deploy dùng chung nên log chỉ ghi "deploy". Muốn biết ai thì phải lần theo IP. Blameless nhé. Nhưng chính xác.' },
      { id: 't_khai', who: 'khai', text: 'Log ghi rõ 19:04 ngày 30/10, IP 10.8.0.17. Giờ đó IP này đang là của Duy. Xong. It depends, nhưng lần này không depends.' },
      { id: 't_duy', who: 'duy', text: 'Bảy giờ kém mười anh vào VPN chạy campaign, tám giờ kém hai mươi thoát. Bảng orders nằm đâu anh còn không biết.' },
      { id: 't_tung', who: 'tung', text: 'Em fix bug tới một rưỡi rồi đi ngủ. Máy em chạy được, thề.' },
      { id: 't_chau', who: 'chau', text: 'Đêm đó em ngủ từ 12 giờ, em không vào VPN. Em thề luôn. Mình nên làm AI.' },
      { id: 't_loc', who: 'loc', text: 'Mật khẩu tài khoản deploy chỉ có anh với anh Thạc biết. Intern không có cách nào lấy được.' },
    ],
    contradictions: [
      { stmt: 't_khai', ev: ['e_alert', 'e_audit'], unlock: [], reveal: [
        ['nar', 'Bạn đặt dòng chú thích của audit log cạnh tin nhắn Slack: log máy chủ ghi theo UTC, Slack ghi theo giờ Việt Nam.'],
        ['khai', 'Khoan. 19:04 UTC cộng 7 tiếng là… 02:04 sáng 31/10. Đúng một phút trước khi bot báo. Duy, anh xin lỗi. It depends… vào múi giờ.'],
      ] },
      { stmt: 't_chau', ev: ['e_vpn'], unlock: ['e_agent'], reveal: [
        ['chau', 'Dạ… em không đụng tay vào đâu ạ! Em chỉ bật ChauBot chạy qua đêm, dọn database giúp mọi người. Em để điện thoại chế độ ngủ.'],
        ['chau', 'Đây là log của bot ạ. Nó chăm lắm.'],
      ] },
      { stmt: 't_loc', ev: ['e_notion', 'e_agent'], unlock: [], reveal: [
        ['loc', '…Anh dán vào trang onboarding hồi đầu tháng. "Cho nhanh." Rồi quên xóa. Đừng nhìn anh như vậy.'],
      ] },
    ],
    questions: [
      { id: 'when', q: 'Lệnh DROP chạy lúc mấy giờ, theo giờ Việt Nam?', options: ['19:04 ngày 30/10', '02:04 ngày 31/10', '12:04 ngày 30/10', '09:04 ngày 31/10'], answer: 1,
        why: 'Audit log ghi UTC. 19:04:51 UTC + 7 tiếng = 02:04:51 ngày 31/10, ngay trước tin báo 02:05 trên Slack.' },
      { id: 'ip', q: 'Lúc đó IP 10.8.0.17 thuộc về ai?', options: ['Duy', 'Tùng', 'Châu', 'Anh Lộc'], answer: 2,
        why: 'VPN: Châu giữ 10.8.0.17 từ 01:52 đến 02:40 ngày 31/10. Tùng đã thoát lúc 01:30. Có thể kiểm tra cách đổi giờ bằng dòng 12:15 UTC: đó là 19:15 giờ VN, đúng lúc anh Thạc giữ 10.8.0.5.' },
      { id: 'actor', q: 'Ai (hay cái gì) trực tiếp chạy lệnh DROP?', options: ['Châu tự gõ', 'ChauBot', 'Anh Lộc', 'Bot #deploy'], answer: 1,
        why: 'Nhật ký ChauBot: 02:04:51 DROP TABLE orders. Châu đang ngủ, bot hỏi không ai trả lời nên tự làm.' },
      { id: 'pass', q: 'Mật khẩu deploy bị lộ từ đâu?', options: ['Anh Thạc đưa cho Châu', 'Trang Notion onboarding do anh Lộc sửa', 'Châu đoán ra', 'Tùng cho mượn máy'], answer: 1,
        why: 'Mục 7 trang "Onboarding cho intern ✨", sửa lần cuối bởi anh Lộc. ChauBot đọc nó lúc 01:55.' },
      { id: 'stale', q: 'Vì sao bot tin bảng orders "không dùng"?', options: [
        'Châu ra lệnh xóa đúng bảng orders',
        'table_stats ngừng cập nhật từ 14/07, sau khi cron bị tắt',
        'App Lúa đúng là không ai dùng',
        'Duy đã xóa dữ liệu từ lúc 19:04',
      ], answer: 1, why: 'Anh Lộc tắt cron cập nhật table_stats ngày 14/07 "cho đỡ tiền". Số liệu đứng yên từ đó nên bảng nào cũng như "không ai dùng".' },
      { id: 'fix', q: 'Bài học post-mortem (blameless) đúng nhất là gì?', options: [
        'Cho Châu nghỉ việc',
        'Cấm intern làm việc ban đêm',
        'Bỏ mật khẩu dùng chung khỏi Notion, cấp quyền riêng từng người, không cho bot tự chạy lệnh xóa khi chưa có người duyệt',
        'Đổi múi giờ máy chủ sang GMT+7 là xong',
      ], answer: 2, why: 'Blameless là sửa quy trình để chuyện không lặp lại: mật khẩu dùng chung bị dán công khai, bot có quyền xóa mà không cần người duyệt, số liệu cũ không ai kiểm.' },
    ],
    hints: [
      'Audit log ghi giờ theo múi nào? Còn Slack và VPN? Đổi hết về cùng một múi giờ trước đã.',
      'Thử dòng 12:15 UTC từ IP 10.8.0.5: lúc đó giờ VN là mấy giờ, và ai đang giữ IP đó? Đó là cách kiểm tra mình đổi giờ đúng chưa.',
      'Châu nói ngủ từ 12 giờ. Nhật ký VPN nói gì? Sau đó xem ai "biết" mật khẩu deploy, và table_stats cập nhật lần cuối khi nào.',
    ],
    epilogue: 'Post-mortem blameless kết luận: lỗi ở quy trình, không ở người. Rồi cả công ty vẫn quay sang nhìn Châu. Anh Lộc xóa mật khẩu khỏi Notion, bật lại cron và tạo tài khoản riêng cho từng người, kể cả ChauBot (chỉ được đọc). Châu đổi câu cửa miệng thành "Mình nên làm AI… có người duyệt." Mèo 404 nằm lên bàn phím anh Lộc, gõ ra chữ DROP, rồi đi ngủ.',
  },
];
