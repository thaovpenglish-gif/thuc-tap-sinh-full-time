// Nợ Kỹ Thuật Labs — cast, idle lines, office theme, object lines.
// App chính của công ty: "Lúa" (đi chợ online + ví điện tử + "sắp tới là AI"). Mọi tên người, công ty, quỹ đều hư cấu.

export const CAT_NAME = 'Mèo 404';

export const CAST = {
  kevin: { name: 'Anh Quân "Kevin"', role: 'CEO & Co-founder · Think Big', emoji: '🚀', color: '#ffd166', spot: 'boss',
    look: { shirt: '#ffd166', pants: '#2f3a56', hair: 'quiff', hairColor: '#2a1d14', phone: true } },
  thac: { name: 'Anh Thạc', role: 'CTO & Co-founder · chưa ngủ từ thứ Ba', emoji: '🧯', color: '#9aa7c7', spot: 'senior',
    look: { shirt: '#9aa7c7', pants: '#33384a', hair: 'curly', hairColor: '#1d1d1f', glasses: true, mug: true } },
  diep: { name: 'Chị Diệp', role: 'Senior PM · Framework-first', emoji: '🧭', color: '#c9b6ff', spot: 'corner',
    look: { shirt: '#c9b6ff', pants: '#4a3f66', hair: 'bun', hairColor: '#2a2a2a', glasses: true, notes: true } },
  khai: { name: 'Anh Khải', role: 'Tech Lead Backend · "It depends"', emoji: '🐘', color: '#a8dcc0', spot: 'n6',
    look: { shirt: '#a8dcc0', pants: '#3f4a45', hair: 'short', hairColor: '#1d1d1f', pods: true } },
  nguyet: { name: 'Chị Nguyệt', role: 'QA Lead · Bug Hunter', emoji: '🔎', color: '#ff9fb2', spot: 'c1',
    look: { shirt: '#ff9fb2', pants: '#5a4a6b', hair: 'pony', hairColor: '#3b2418', glasses: true, phone: true } },
  vy: { name: 'Vy', role: 'Product Designer · "Lệch 2px"', emoji: '🎨', color: '#ffb3e6', spot: 'n4',
    look: { shirt: '#ffb3e6', pants: '#f2e6cf', hair: 'wavy', hairColor: '#7a3b1e', clip: true, tote: true } },
  tung: { name: 'Tùng', role: 'Mobile Dev · "Máy em chạy được"', emoji: '📱', color: '#8fd3ff', spot: 'c3', present: (r) => !r.flags.tung_left,
    look: { shirt: '#8fd3ff', pants: '#2f3a56', hair: 'cap', hairColor: '#1d1d1f', pods: true, phone: true } },
  loc: { name: 'Anh Lộc', role: 'DevOps (người duy nhất) · 🔥', emoji: '🔥', color: '#aeb7c9', spot: 'it', present: (r) => !r.flags.loc_left,
    look: { shirt: '#3a3a4a', pants: '#2a2a33', hair: 'beanie', hairColor: '#1d1d1f', pods: true } },
  ngan: { name: 'Chị Ngân', role: 'Head of People & Culture · "Gia đình"', emoji: '💐', color: '#ff9f7a', spot: 'hr',
    look: { shirt: '#ff9f7a', pants: '#6b4a5a', hair: 'long', hairColor: '#3b2418', phone: true } },
  duy: { name: 'Duy', role: 'Growth Lead · Ship đi, test sau', emoji: '📈', color: '#b8f0d8', spot: 'n2',
    look: { shirt: '#b8f0d8', pants: '#3a5a4a', hair: 'side', hairColor: '#4a3226', phone: true } },
  chau: { name: 'Châu', role: 'Intern PM · "Mình nên làm AI"', emoji: '🤖', color: '#ffe08a', spot: 'c2',
    look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'long', hairColor: '#2b1b14', clip: true, tote: true } },
  hieu: { name: 'Anh Hiếu', role: 'BrSE dự án Nhật · Q&A dòng 147', emoji: '🗾', color: '#d9c8ff', spot: 'n5',
    look: { shirt: '#ffffff', pants: '#2f3a56', hair: 'short', hairColor: '#1d1d1f', glasses: true, tie: '#4a5bd8' } },
  thao: { name: 'Chị Thảo', role: 'COO · Người giữ runway', emoji: '🧮', color: '#e3d9ff', spot: 'finance',
    look: { shirt: '#e3d9ff', pants: '#5a4a6b', hair: 'bun', hairColor: '#2a2a2a', glasses: true, mug: true } },
  hoa: { name: 'Chị Hoa', role: 'Office Manager · lễ tân kiêm mọi thứ', emoji: '🌼', color: '#ffe9a0', spot: 'reception',
    look: { shirt: '#ffe9a0', pants: '#8a6a5a', hair: 'curly', hairColor: '#4a3226', phone: true } },
  // không có mặt trong văn phòng: chỉ chat / gọi
  victor: { name: 'Anh Victor', role: 'Partner · quỹ Hạt Giống Ventures', emoji: '💼', color: '#d9d9d9', body: false },
  tanaka: { name: 'Tanaka-san', role: 'Khách hàng Nhật · dự án outsource', emoji: '🇯🇵', color: '#d9d9d9', body: false },
  bot: { name: 'Bot #deploy', role: 'Bot Slack · luôn kèm 🙏', emoji: '🤖', color: '#d9d9d9', body: false },
};

export const IDLE = {
  kevin: ['Let\'s think big em. Siêu app số một Đông Nam Á. Hoặc Việt Nam. Hoặc quận mình.', 'Anh nghĩ cái này đơn giản thôi, chừng hai tiếng.', 'Em đã follow LinkedIn anh chưa? Bài hôm nay 2.000 reaction.', 'Series B sắp xong rồi. Thật. Lần này thật.'],
  thac: ['Ai deploy?', 'Anh không mệt. Anh chỉ là đã quên cảm giác không mệt là gì.', 'Mật khẩu server cũ hả? Đừng hỏi. Chỉ anh biết, và anh muốn quên.', '(nhìn dashboard, không chớp mắt)'],
  diep: ['Mình align lại nha.', 'Em thử chấm cái này theo RICE xem. Reach, Impact, Confidence, Effort.', 'Đây là Must-have hay Nice-to-have? MoSCoW em ơi.', 'Job-to-be-done của người dùng ở đây là gì?'],
  khai: ['It depends.', 'Cái đó… it depends. Phụ thuộc vào nhiều thứ.', 'Code ai viết mà… à, của anh. Hồi 2022. Không tính.', 'Docs hả? Docs là code. Đọc code đi em.'],
  nguyet: ['Chị reproduce được mà. Em xem video không?', 'Chị có file Excel ghi mọi lần dev nói "không phải bug". 214 dòng.', 'Release êm thì chị mua trà sữa. Chưa mua lần nào.', 'Bug không biến mất. Bug chỉ đi trốn.'],
  vy: ['Lệch 2px rồi anh.', 'Màu này là #FF6B6B, không phải #FF6B6C. Khác nhau đó.', 'Chị Diệp lại cắt animation của em. Animation là cảm xúc mà.', 'Em comment trên Figma rồi. Comment thứ 61.'],
  tung: ['Trên máy em chạy được mà.', 'Đợi anh merge xong đã.', '(đang typing…) ok', 'Android đời cũ hả? Ai còn xài?'],
  loc: ['🔥', '👀', '🙏', '(gõ rất lâu, rồi gửi một chữ:) ok', '🫠'],
  ngan: ['Ở Nợ Kỹ Thuật mình là một gia đình nha em.', 'Em điền khảo sát hạnh phúc chưa? Ẩn danh hoàn toàn. Gần như.', 'Chị chỉ muốn quick sync 15 phút thôi. Không có gì đâu.', 'Wellness Wednesday này mình tập thở nha. Thở là miễn phí.'],
  duy: ['Ship đi em, A/B test sau.', 'Anh book KOL rồi, tính năng code xong chưa?', 'Retention là gì? Mình tập trung acquisition đã.', 'Push notification mới: "Lúa nhớ bạn 🌾". CTR 0,3%. Tuyệt vời.'],
  chau: ['Em nghĩ mình nên làm AI.', 'Hôm qua em ăn tối với chú Victor, chú bảo AI là tương lai.', 'Cái này mình thêm AI vào được không anh?', 'Em đang viết PRD cho "LúaGPT". Bản thứ năm.'],
  hieu: ['Khách hỏi Q&A số 147.', 'Hourensou em nhé: báo cáo, liên lạc, thảo luận.', 'お世話になっております. Câu này copy từ mẫu, nhưng chân thành.', 'Tanaka-san nói "kentou shimasu". Nghĩa là không.'],
  thao: ['Runway hả? Để chị mở Excel. Mà thôi, đừng hỏi.', 'Hóa đơn bên Nhật đã nghiệm thu chưa em? Tiền lương tháng này nằm ở đó.', 'Mỗi tháng mình đốt bằng một căn hộ. Không phải căn to.', 'Chị không phải người xấu. Chị là người cầm Excel.'],
  hoa: ['Mình là startup mà em.', 'Mật khẩu wifi đổi rồi. Chỉ chị biết. Mai chị nghỉ phép.', 'Phòng "Bún Bò" máy lạnh hỏng, em họp "Cơm Tấm" nha.', 'Ghế thiếu thì em ngồi tạm ghế bi lắc.'],
};

export const THEME = {
  logo: ['NỢ KỸ THUẬT LABS', 'App Lúa · Đi chợ · Ví · "và sắp có AI"', '"Flat. Fast. Fun." (Phẳng lương. Nhanh nghỉ.)'],
  skyline: 'SHIP NHANH · FIX SAU', bossWall: 'Think Big', banner: 'MOVE FAST · BREAK PROD',
  signs: { boss: 'CEO · KEVIN', finance: 'COO · RUNWAY', meeting: 'PHÒNG "BÚN BÒ"', standup: 'DAILY 9:30 · 15 PHÚT (*)', pantry: 'PANTRY · Nước tăng lực free' },
  desks: {
    me: ['Intern · Bạn', ['Jira', '0 ticket (?)'], '#4a8bd8'],
    c1: ['Nguyệt · QA', ['"Không phải bug"', '214 dòng'], '#ff6b8b'],
    c2: ['Châu · Intern PM', ['Notion', 'Ý tưởng AI #37'], '#e0a030'],
    c3: ['Tùng · Mobile', ['Build: OK', '(máy em)'], '#3a9bd5'],
    n1: ['Bàn trống', ['Slack:', 'deactivated'], '#9aa0ad'],
    n2: ['Duy · Growth', ['DAU ↑ 3%', '(đổi định nghĩa)'], '#3fbf7f'],
    n3: ['Squad AI (3 người)', ['LúaGPT', 'v0.0.1-alpha'], '#8a6bd8'],
    n4: ['Vy · Design', ['Figma', '61 comment'], '#ff7ac8'],
    n5: ['Hiếu · BrSE', ['Q&A list', 'dòng 147/300'], '#5b6bd8'],
    n6: ['Khải · BE Lead', ['TODO: viết docs', '(2022)'], '#3f9a6a'],
    hr: ['Ngân · People', ['Khảo sát', 'hạnh phúc*'], '#ff7a6b'],
    senior: ['Thạc · CTO', ['#incident', '3 cảnh báo'], '#e05a4a'],
  },
  whiteboard: ['OKR Q4 🚀', 'O: Siêu app số 1 VN', 'KR1: MAU x5 (??)', 'KR2: Chốt Series B', '(runway: đừng hỏi)'],
  scrum: { cols: ['BACKLOG', 'IN PROGRESS', 'DONE (?)'], notes: [
    ['AI gợi ý món', 'Fix everything', 'Viết docs (2022)', 'Refactor ví'],
    ['Hotfix thanh toán', 'Dark mode (CEO)', 'Nút xóa tài khoản'],
    ['Stand-up 47 phút', 'Đổi logo lần 6'],
  ] },
  board: ['ALL-HANDS THỨ 6 🍕', 'Runway: 18 tháng (?)', 'Hackathon: tự nguyện*'],
  palette: { wall: '#eef3ff', lilac: '#dfe6ff', peach: '#ffe3d1', mint: '#d8f7ec', butter: '#fff3c4', sky: '#d6ecff', deskLeg: '#8fb6ff', chair: '#bfe3ff', chair2: '#ffd166' },
  labels: {
    coffee: 'Pantry: nước tăng lực, cà phê', okr: 'Đọc OKR quý của anh Kevin', altar: 'Thắp hương Thần Tài (cầu deploy êm)',
    safe: 'Nhìn két "Runway"', plant: 'Xem cây xương rồng "uptime"', redchair: 'Nhìn ghế bi lắc', desk: 'Ngồi vào bàn mình',
    printer: 'Dùng máy in', interview: 'Ngồi vào ghế phòng "Bún Bò"',
  },
  props: [
    { type: 'standee', slot: 'p1', label: 'WE\'RE HIRING!|Flat. Fast. Fun.|(đang freeze|tuyển dụng)', color: '#bfe3ff' },
    { type: 'balloons', slot: 'p2', label: 'SERIES B SẮP XONG', color: '#ffe08a' },
    { type: 'rack', slot: 'p3', label: 'SERVER CŨ · ĐỪNG TẮT', color: '#ff9f7a' },
    { type: 'cabinet', slot: 'p4', label: '7 ĐIỆN THOẠI TEST', color: '#b8f0d8' },
    { type: 'crates', slot: 'p5', label: 'NƯỚC TĂNG LỰC', color: '#ffd166' },
    { type: 'standee', slot: 'p6', label: 'KEVIN|Top 30 Under 30|(đề cử)|(tự đề cử)', color: '#ffd166' },
  ],
};

export const OBJ_LINES = {
  printer: [['nar', 'Máy in có dán QR code "Báo lỗi máy in qua Jira". Ticket gần nhất mở từ năm 2023, trạng thái: "Won\'t fix".']],
  desk: [['nar', 'Bàn của bạn. Một MacBook đời 2019 pin còn 40 phút, một sticker "It works on my machine", và tờ giấy nhớ "Đừng deploy thứ Sáu".']],
  okr: [['nar', 'Bảng OKR. Objective: "Siêu app số 1 Việt Nam". Ai đó viết bút chì bên dưới: "trong quận".'], ['think', 'Key Result 1 bị xóa đi viết lại bốn lần. Lần nào con số cũng to hơn.']],
  altar: [['nar', 'Bàn thờ Thần Tài. Bên cạnh nải chuối có một chiếc USB ghi "BACKUP DB 2022". Không ai dám dời nó đi.'], { fx: { uy: 1 } }],
  safe: [['nar', 'Két sắt của chị Thảo. Tờ giấy dán: "Không có tiền trong này. Tiền nằm trong slide của anh Kevin."']],
  plant: [['nar', 'Một chậu xương rồng tên "Uptime 99,9%". Nó còn sống. Là thứ duy nhất ở đây đạt SLA.']],
  redchair: [['nar', 'Bàn bi lắc. Mua năm 2021 để "xây văn hóa". Hiện được dùng làm chỗ để hộp pizza.']],
  interview: [['nar', 'Phòng "Bún Bò". Trên bảng trắng còn sót: "Pivot? (đừng xóa)". Máy lạnh kêu như một con server sắp chết.']],
};
