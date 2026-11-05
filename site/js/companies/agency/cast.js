// Trend Trễ Agency — cast, idle lines, office theme, hidden ties, object lines.
// All names, clients, KOLs and brands are fictional.

export const CAT_NAME = 'Mèo Insight';

export const CAST = {
  tung: { name: 'Anh Tùng', role: 'Managing Director · "Make it pop"', emoji: '💥', color: '#ff5d8f', spot: 'boss',
    look: { shirt: '#ff5d8f', pants: '#2b2d42', hair: 'quiff', hairColor: '#b8b8c0', glasses: true, mug: true } },
  diep: { name: 'Chị Diệp', role: 'Account Manager · 3 điện thoại', emoji: '📱', color: '#ff9f1c', spot: 'senior',
    look: { shirt: '#ff9f1c', pants: '#3d405b', hair: 'bun', hairColor: '#2a1a12', phone: true, tote: true } },
  khai: { name: 'Anh Khải', role: 'Creative Director · "Chưa đủ đau"', emoji: '🖤', color: '#5c5f7a', spot: 'n1',
    look: { shirt: '#2b2d42', pants: '#1d1d1f', hair: 'beanie', hairColor: '#1d1d1f', glasses: true } },
  thi: { name: 'Thi', role: 'Copywriter · nhà thơ', emoji: '🪶', color: '#c77dff', spot: 'c1',
    look: { shirt: '#c77dff', pants: '#4a4e69', hair: 'long', hairColor: '#3b2418', notes: true } },
  vy: { name: 'Vỹ', role: 'Designer · 47 font', emoji: '🎨', color: '#ff6b9a', spot: 'c2',
    look: { shirt: '#ff6b9a', pants: '#22223b', hair: 'curly', hairColor: '#5a3d8a', pods: true } },
  quan: { name: 'Anh Quân', role: 'Strategic Planner · framework', emoji: '🧠', color: '#4a5bd8', spot: 'n3',
    look: { shirt: '#4a5bd8', pants: '#e9e4d4', hair: 'side', hairColor: '#1d1d1f', glasses: true, notes: true } },
  loc: { name: 'Anh Lộc', role: 'Media Buyer · "CPM đang cao"', emoji: '📈', color: '#3a86ff', spot: 'n4',
    look: { shirt: '#3a86ff', pants: '#2b2d42', hair: 'cap', hairColor: '#1d1d1f', mug: true } },
  suong: { name: 'Sương', role: 'Social & Community · không ngủ', emoji: '🌙', color: '#2ec4b6', spot: 'n2',
    look: { shirt: '#2ec4b6', pants: '#3d405b', hair: 'pony', hairColor: '#1d1d1f', phone: true, glasses: true } },
  kieu: { name: 'Chị Kiều', role: 'KOL Manager · "sạch, chị check rồi"', emoji: '🌟', color: '#ff70a6', spot: 'n6',
    look: { shirt: '#ff70a6', pants: '#6d597a', hair: 'wavy', hairColor: '#8a4b2a', phone: true, tote: true } },
  phat: { name: 'Anh Phát', role: 'Producer · "quay được, nhưng…"', emoji: '🎬', color: '#8d99ae', spot: 'n5',
    look: { shirt: '#8d99ae', pants: '#2b2d42', hair: 'short', hairColor: '#1d1d1f', tote: true } },
  linh: { name: 'Khánh Linh', role: 'Intern Account · "Mẹ em nói…"', emoji: '💅', color: '#ffb703', spot: 'c3',
    look: { shirt: '#ffb703', pants: '#f2e6cf', hair: 'long', hairColor: '#7a3b1e', clip: true, phone: true } },
  hong: { name: 'Chị Hồng', role: 'Finance & Traffic · timesheet', emoji: '⏱️', color: '#b8f0d8', spot: 'finance',
    look: { shirt: '#b8f0d8', pants: '#5a4a6b', hair: 'bun', hairColor: '#2a2a2a', glasses: true } },
  // Never in the office: clients, KOLs (Teams / Zalo only)
  nguyet: { name: 'Chị Nguyệt', role: 'Brand Manager · Mì Ông Táo ("Bà Wow")', emoji: '🍜', color: '#ffd166', body: false },
  tuan: { name: 'Anh Tuấn', role: 'Brand Manager · Kem đánh răng Răng Xinh', emoji: '🦷', color: '#bde0fe', body: false },
  bin: { name: 'Bin 🔥', role: '"Designer" · cháu anh Tuấn', emoji: '🖌️', color: '#ffadad', body: false },
  ken: { name: 'Anh Ken', role: 'Quản lý KOL Bông Bơ', emoji: '🕶️', color: '#d9d9d9', body: false },
};

export const IDLE = {
  tung: ['Cái này được, nhưng chưa pop. Em hiểu ý anh chứ? Pop!', 'Thắng pitch này cả nhà đi Đà Lạt. Lần này thật.', 'Logo to lên chút. Không phải của mình. Anh tập nói giống client cho quen.', 'Em có biết cái quảng cáo đầu tiên anh làm không? Tờ rơi quán phở của mẹ anh. Vẫn treo trong phòng.'],
  diep: ['Em ơi… à không, chị chỉ chào thôi. Phản xạ.', 'Chị đang nghe hai cuộc gọi. Em nói vào cái điện thoại thứ ba nha.', 'Client feedback lần cuối rồi. Lần cuối thật. Chị hứa. (Chị không hứa.)', 'Nếu không thấy chị ở bàn thì chị ở cầu thang. Đừng tìm.'],
  khai: ['Không.', 'Chưa đủ đau.', 'Brief như không brief.', 'Ai đặt tên file là FINAL_final? Đứng lên.', 'Ngăn kéo này có 312 ý tưởng bị giết. Một nửa là của anh.'],
  thi: ['Câu này phải đọc to lên mới thấy.', '"Client bảo đổi màu / tôi đổi cả chiều sâu"… bạn thấy câu sau nên là gì?', 'Mình đang viết chương 12. Tên chương: "Feedback nhẹ".', 'Một nghìn hai trăm tagline bị giết. Mình nhớ tên từng đứa.'],
  vy: ['Đừng đụng vào layout của anh.', 'Font này có 9 weight. Anh dùng weight thứ 7. Đừng hỏi tại sao.', 'Anh có 47 font. Client chọn Arial.', 'Logo to lên chút là bao nhiêu? Ai đó định nghĩa "chút" giùm anh.'],
  quan: ['Đây là observation, chưa phải insight.', 'Mình chạy qua framework trước đã. Framework nào? Tất cả.', 'Anh vừa nghĩ ra ma trận 3x3. 2x2 lỗi thời rồi.', 'Insight là thứ ai cũng thấy mà không ai nói. Như việc anh chưa có insight nào.'],
  loc: ['CPM đang cao.', 'Thuật toán đổi rồi.', 'Đợi qua mùa sale đi em, giờ ads đắt như vàng.', 'Đừng nhìn dashboard lúc 3 giờ sáng. Nó nhìn lại em.'],
  suong: ['Trend này bắt liền!', 'Chị online 24/7. Không phải vì chăm. Vì sợ.', 'Có người chê bao bì. 12 like. Chưa sao. Chị canh.', 'Chị ngủ lúc nào? Hỏi hay. Chị cũng đang hỏi.'],
  kieu: ['KOL này sạch, chị check rồi.', 'Bạn ấy đang bận show, tối mới check brief.', 'Giá KOL không cố định em ạ. Nó theo… mood.', 'Chị có 64 nhóm Zalo với quản lý KOL. Nhóm nào cũng tên "anh Ken".'],
  phat: ['Quay được. Không phải với ngân sách này.', 'Ai mượn băng keo vải của anh chưa trả?', 'Hứa gì với client thì hỏi production trước. Không ai nghe. Như hét vào bể bơi.', 'Thẻ nhớ ở đâu? À, trong túi. Hôm nay may.'],
  linh: ['Mẹ mình nói vầy nè…', 'Ủa WIP 9:45 hả? Mình tưởng 10:30.', 'Mình muốn được đánh giá thật. Nhưng mà… đừng đánh giá mình sáng thứ Hai.', 'Bạn có ringlight không? Mình đang làm TikTok "một ngày của intern agency".'],
  hong: ['Timesheet tuần này em chưa nộp.', 'Chưa có PO đừng làm. Mọi người vẫn làm. Chị biết hết.', 'Ô "Khác" không phải chỗ để giấu sáu tiếng nghe voice client.', 'Hóa đơn, nghiệm thu, ảnh chụp màn hình. Ba thứ đó là lương của em.'],
};

export const THEME = {
  logo: ['TREND TRỄ', 'Creative Agency · Since 2016', '"Bắt trend. Hơi trễ. Nhưng bắt."'],
  skyline: 'TREND TRỄ · MAKE IT POP', bossWall: 'Make it POP', banner: 'BRIEF · DECK · FEEDBACK NHẸ · v14',
  signs: { boss: 'MD · Gõ cửa 3 lần', finance: 'TIMESHEET LÀ SỰ THẬT', meeting: 'BRAINSTORM · ĐỪNG GÕ', standup: 'WIP 9:45 · AI ĐANG CHÁY?', pantry: 'PANTRY · Mì Ông Táo free' },
  desks: {
    me: ['Intern · Bạn', ['Zalo: 6 nhóm', '128 tin chưa đọc'], '#ff8fb1'],
    c1: ['Thi · Copy', ['Tagline_v50', '"đọc to lên"'], '#c77dff'],
    c2: ['Vỹ · Design', ['Fonts (47)', 'KV_v13.psd'], '#ff6b9a'],
    c3: ['Linh · Intern', ['TikTok', 'đang quay…'], '#ffb703'],
    n1: ['Khải · CD', ['IDEAS_REJECTED', '312 files'], '#2b2d42'],
    n2: ['Sương · Social', ['Social listening', '🔴 LIVE 24/7'], '#2ec4b6'],
    n3: ['Quân · Planner', ['Framework', '4P × 7C × AIDA'], '#4a5bd8'],
    n4: ['Lộc · Media', ['CPM', '↑ đang cao'], '#3a86ff'],
    n5: ['Phát · Producer', ['Call sheet', 'v6 (chưa chốt)'], '#8d99ae'],
    n6: ['Kiều · KOL', ['KOL list', '200 bạn "sạch"'], '#ff70a6'],
    hr: ['AE cũ · đã nghỉ', ['Out of office', 'mãi mãi'], '#9aa0ad'],
    senior: ['Diệp · AM', ['Zalo × 3', '"Em ơi…"'], '#ff9f1c'],
  },
  whiteboard: ['BRIEF RÕ RÀNG', 'LÀ MỘT HUYỀN THOẠI', 'Ông Táo: KV v13 → v14?', 'Sen Hồng: chờ PO', 'Đà Lạt: quý sau (lần 6)'],
  scrum: { cols: ['BRIEF', 'ĐANG SỬA', 'CHỜ DUYỆT'], notes: [
    ['Trà Sữa: "làm sao cho viral"', 'Pitch Bia Hơi Phố (free)', 'Răng Xinh: "trẻ hơn"'],
    ['KV Ông Táo v13', 'Caption x30', 'Resize 27 size', 'Deck 80 trang'],
    ['Client seen 👍 (?)', 'Timesheet tuần trước'],
  ] },
  board: ['TẾT 2027 🧧', 'Pitch Bia Hơi Phố: tuần 3', 'Sinh nhật chị Diệp (đừng quên)'],
  palette: { wall: '#fff0f5', lilac: '#e8dcff', peach: '#ffe0e9', mint: '#d9f7ef', butter: '#fff3c4' },
  labels: { coffee: 'Pantry: mì Ông Táo free', okr: 'Đọc bảng trắng', altar: 'Thắp hương Thần Tài (xin client duyệt)', safe: 'Nhìn tủ cúp giải thưởng', plant: 'Tưới cây (đạo cụ quay)', redchair: 'Ghế đỏ "brainstorm"' },
  props: [
    { type: 'ringlight', slot: 'p1', label: 'RINGLIGHT · ĐỪNG ĐỤNG', color: '#ffc8dd' },
    { type: 'crates', slot: 'p2', label: 'SAMPLE MÌ ÔNG TÁO', color: '#ffe08a' },
    { type: 'standee', slot: 'p3', label: 'AWARD 2019|(shortlist)|Trend Trễ|★', color: '#fff3c4' },
    { type: 'balloons', slot: 'p4', label: 'KV v15 FINAL 🎉', color: '#bfe3ff' },
    { type: 'cabinet', slot: 'p5', label: 'TIMESHEET 2016–2026', color: '#b8f0d8' },
    { type: 'rack', slot: 'p6', label: 'Ổ CỨNG CHUNG (98%)', color: '#ffc8dd' },
  ],
};

// Hidden relationships: two are drawn per run (flags tie_<id>); some scenes react to them.
export const TIES = [
  { id: 'khai_thi', text: 'Anh Khải và Thi từng yêu nhau (hồi năm 2019)' },
  { id: 'loc_kieu', text: 'Anh Lộc và chị Kiều là vợ chồng, giấu cả công ty' },
  { id: 'phat_tung', text: 'Anh Phát là em vợ anh Tùng' },
  { id: 'hong_diep', text: 'Chị Hồng là chị ruột chị Diệp' },
];

export const OBJ_LINES = {
  printer: [['nar', 'Máy in màu. Tờ giấy dán: "In màu phải ghi timesheet. Đỏ in ra cam là chuyện bình thường, đừng báo IT, mình không có IT."']],
  desk: [['nar', 'Bàn của bạn. Một laptop, một ly mì đã nguội, và tờ giấy nhớ của Thi: "Lần cuối = lần đầu của một chuỗi".']],
  okr: [['nar', 'Bảng trắng: "BRIEF RÕ RÀNG LÀ MỘT HUYỀN THOẠI". Bên dưới, chữ anh Khải: "Đồng ý." Bên dưới nữa, chữ chị Diệp: "Xóa đi trước khi client tới."']],
  altar: [['nar', 'Bàn thờ Thần Tài. Lễ vật: một gói mì Ông Táo và bản in KV v1. Ai đó vừa khấn "cho client duyệt".'], { fx: { uy: 1 } }],
  safe: [['nar', 'Tủ cúp. Bên trong có một chiếc cúp nhựa "Agency vui tính nhất 2018" và một chỗ trống ghi "dành cho Cannes".']],
  plant: [['nar', 'Chậu cây kim tiền. Thật ra là đạo cụ quay TVC năm ngoái. Nó vẫn sống. Hơn nhiều người ở đây.']],
  redchair: [['nar', 'Ghế đỏ "brainstorm". Ai ngồi vào đây phải nói một ý tưởng. Mèo Insight ngồi suốt. Nó chưa nói gì.']],
  interview: [['nar', 'Phòng Brainstorm. Bảng trắng còn chữ: "41 ý → 12 ý → 1 ý (của năm ngoái)".']],
};
