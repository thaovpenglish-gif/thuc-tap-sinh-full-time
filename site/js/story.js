// Story data for "Thực Tập Sinh Full-Time" — Công ty #1: Tuần thực tập tại Ba Mẹ & Partners (management consulting, 10 người, 100 drama)
// Scene node formats:
//   ['speakerId', 'text']                      a line ('me' = player, 'think' = inner voice, 'nar' = narrator)
//   { c:'vote_id', o:[{ t, fx, then:[...], when:(s)=>bool }] }   a choice (vote_id → global stats)
//   { if:(s)=>bool, then:[...], else:[...] }   branch
//   { fx:{ uy, dr, nl, rel:{npc:n}, set:{flag:val} } }  effects
//   { chat:[[from, text, dm?], ...] }          Teams messages (dm = private chat)
// Step `who`: npc id · 'obj:<interactable>' · 'call:<npc>' (incoming Teams call)

export const COMPANY = 'Ba Mẹ & Partners';
export const GAME = 'Thực Tập Sinh Full-Time';

export const CHARS = {
  hung: { name: 'Bác Hùng', role: 'Managing Partner · "Ba"', emoji: '👨‍💼', color: '#9fb4ff', shirt: '#9fb4ff', pants: '#5d6a9a', hair: 'side', hairColor: '#c9c9c9', glasses: true, tie: '#ff8fa3' },
  hang: { name: 'Cô Hằng', role: 'CFO kiêm COO · "Mẹ"', emoji: '🧮', color: '#ffb3c7', shirt: '#ffb3c7', pants: '#8a6a8f', hair: 'bun', hairColor: '#2a2a2a', glasses: true },
  tuan: { name: 'Kevin Tuấn', role: 'Head of Innovation · con trai', emoji: '🚀', color: '#9ee8c8', shirt: '#9ee8c8', pants: '#f2e6cf', hair: 'quiff', hairColor: '#4a3226', pods: true },
  son:  { name: 'Anh Sơn', role: 'Scrum Master (thuê ngoài)', emoji: '📌', color: '#ffe08a', shirt: '#ffe08a', pants: '#6b7a99', hair: 'beanie', hairColor: '#ff9f7a', notes: true },
  vy:   { name: 'Chị Vy', role: 'HR & Chief Happiness Officer', emoji: '💁‍♀️', color: '#ffc6e0', shirt: '#ffc6e0', pants: '#7d86b3', hair: 'long', hairColor: '#3b2418', clip: true },
  dung: { name: 'Anh Dũng', role: 'Principal · 15 năm · người ngoài', emoji: '🕴️', color: '#b9cfe6', shirt: '#b9cfe6', pants: '#4b5566', hair: 'short', hairColor: '#1d1d1f', mug: true },
  mai:  { name: 'Chị Mai', role: 'Senior Consultant · trạm phát sóng', emoji: '📢', color: '#ffc59e', shirt: '#ffc59e', pants: '#8a5a4a', hair: 'wavy', hairColor: '#7a3b1e', phone: true },
  khoa: { name: 'Anh Khoa', role: 'IT kiêm "Data & AI Lead"', emoji: '🖥️', color: '#c7b3ff', shirt: '#b49cff', pants: '#3f3f55', hair: 'curly', hairColor: '#1d1d1f', cat: true },
  tu:   { name: 'Cô Tư', role: 'Pantry · Quyền lực ngầm', emoji: '🍵', color: '#bfe6b5', shirt: '#bfe6b5', pants: '#5f7a5a', hair: 'bun', hairColor: '#8a8a8a' },
  bay:  { name: 'Chú Bảy', role: 'Tài xế · Bảo vệ · "Facility Manager"', emoji: '🛵', color: '#a8dcc0', shirt: '#a8dcc0', pants: '#4a5a52', hair: 'cap', hairColor: '#7fb3ff' },
  ngan: { name: 'Ngân', role: 'Intern #2 · đối thủ?', emoji: '🎨', color: '#a9d8ff', shirt: '#a9d8ff', pants: '#5b6b9a', hair: 'pony', hairColor: '#1d1d1f', tote: true },
  client: { name: 'Chị Tâm', role: 'CEO · Trà Sữa Tâm Trạng (client)', emoji: '🧋', color: '#e7c6a5', noBody: true },
  kpi: { name: 'Mèo KPI', role: 'Chief Morale Officer', emoji: '🐱', color: '#d9d9d9', noBody: true },
};

export const DEFAULT_POS = {
  vy: 'reception', hung: 'hung', hang: 'hang', tuan: 'tuan', dung: 'dung', son: 'son',
  mai: 'mai', khoa: 'khoa', tu: 'tu', ngan: 'ngan', bay: 'bay',
};

// Everyone gathers around the Scrum board
export const STANDUP_POS = {
  son: 'su_son', hung: 'su1', hang: 'su2', tuan: 'su3', vy: 'su4', dung: 'su5', mai: 'su6', khoa: 'su7', ngan: 'su8', tu: 'su9', bay: 'su10',
};

export const FORTUNES = [
  'Quẻ hôm nay: "Im lặng là vàng. Unmute là… drama."',
  'Quẻ hôm nay: "Quý nhân phù trợ đang ở gần. Có thể là người nấu cơm."',
  'Quẻ hôm nay: "Tránh hướng Tây. Tránh luôn ghế đỏ."',
  'Quẻ hôm nay: "Deadline sẽ dời. Nhưng không phải cho bạn."',
  'Quẻ hôm nay: "Một tin nhắn bị thu hồi sẽ thay đổi tất cả."',
  'Quẻ hôm nay: "Đại cát. Trừ khi bạn mở file Excel của cô Hằng."',
  'Quẻ hôm nay: "Người hay cười nhất văn phòng biết nhiều nhất văn phòng."',
  'Quẻ hôm nay: "Story point của số phận: 13. Không thể estimate."',
];

export const IDLE = {
  vy:   ['Em cần gì cứ ping chị nha. Trừ chuyện lương. Chuyện lương ping cô Hằng. Mà đừng ping cô Hằng.', 'Chị vừa tổ chức "Happiness Friday". Chỉ có Mèo KPI tham gia.', 'HR ở đây là "Họ hàng Relations" đó em.'],
  hung: ['Con có thấy cây kim tiền héo không? Chắc do năng lượng của cái Jira.', 'Hồi bác mở công ty, consulting là ngồi uống trà với khách. Giờ phải có "framework". Bác dùng sổ tay 30 năm rồi.', 'Em vào call với bác 5 phút. À đang đứng trước mặt rồi hả. Ok, 5 phút.'],
  hang: ['Cô đang bận. Rất bận. Bận từ năm 1998.', 'Timesheet tuần này của con đâu? Chưa submit là chưa có lương nha.', 'Cái gì cũng "cloud", "SaaS". Tiền là tiền thật đó con.'],
  tuan: ['Bro, em dùng Notion chưa? Anh muốn cả công ty move qua Notion. Bố anh dùng… sổ tay.', 'Anh đang build một cái dashboard real-time. Chưa ai xem. But it\'s beautiful.', 'Mình cần một culture of ownership. Và wifi mạnh hơn.'],
  son:  ['Việc em vừa hỏi anh, estimate mấy point? Ừ, 3 point. Ghi vào backlog nha.', 'Daily stand-up là phải ĐỨNG. Ai ngồi là anti-pattern.', 'Anh có chứng chỉ CSM, PSM, SAFe, và một bằng khen Agile cấp phường.'],
  dung: ['Ừ. Chào em.', 'Client lớn nhất của công ty là anh chăm từ 2011. Không ai nhớ.', 'Cà phê gói thôi em. Ngân sách cà phê phin bị cắt từ 2020.'],
  mai:  ['Psst… em nghe gì mới chưa? Chưa hả? Từ từ chị tìm cái để kể.', 'Collagen nha em, uống vào da căng như timeline dự án.', 'Chị không nhiều chuyện. Chị chỉ "share insight" thôi.'],
  khoa: ['…', 'Em thử tắt đi bật lại chưa?', 'Đừng bấm link "Nhận quà tất niên sớm" trong group. Bác Hùng bấm rồi.', 'Mèo KPI không phải của anh. Nó tự chọn đầu anh.'],
  tu:   ['Ăn chưa con?', 'Cô lau cái bàn này 26 năm rồi. Cô biết vết cà phê nào của ai.', 'Đừng có ngồi ghế đỏ nha con.'],
  ngan: ['Mình đang làm lại template slide. Template cũ dùng font Comic Sans.', 'Cậu cũng thấy công ty này kỳ kỳ đúng không? Hay chỉ mình mình?', '…Chào.'],
  bay:  ['Chú đang chơi cờ tướng. Đừng nói chú ngủ nha.', 'Xe chú mua trả góp. Nói trước cho khỏi ai hỏi.', 'Hai mươi năm chở anh Hùng đi gặp client. Chú biết đường tắt ra mọi rắc rối.'],
  kpi:  ['Meo.', 'Meo. (Mèo KPI nhìn bạn như nhìn một slide không có executive summary.)', 'Prrr… (Mèo KPI nằm im. KPI hôm nay: 0.)'],
};

// ---------- Days ----------
export const DAYS = [
  // ============ DAY 1 ============
  {
    title: 'Thứ Hai',
    subtitle: 'Onboarding (aka thử thách sinh tồn)',
    intro: '8:00 sáng. Bạn đứng trước cửa Ba Mẹ & Partners: công ty tư vấn quản lý, 10 nhân viên, 26 năm tuổi. Chuyên "chuyển đổi số" cho doanh nghiệp vừa và nhỏ.\n\nJD ghi: "Business Analyst Intern. Môi trường năng động, agile, như một gia đình."\n\nBạn chưa biết cả "agile" lẫn "gia đình" ở đây đều mang nghĩa đen.',
    pos: {},
    steps: [
      {
        who: 'vy', obj: 'Gặp chị Vy ở quầy lễ tân để onboarding', time: '08:05',
        scene: [
          ['vy', 'Hi em! Em là {ten} đúng không? Chị là Vy, HR. Kiêm admin. Kiêm Chief Happiness Officer. Kiêm lễ tân. Kiêm đi lấy hàng nếu chú Bảy ngủ quên.'],
          ['vy', 'Welcome to Ba Mẹ & Partners! Ở đây mình như một gia đình. Theo nghĩa đen luôn á.'],
          ['think', 'Theo nghĩa đen là sao…?'],
          ['vy', 'Managing Partner là bác Hùng, bác ruột chị. CFO là cô Hằng, vợ bác. Head of Innovation là anh Kevin Tuấn, con trai bác. Chú Bảy tài xế là em họ bác. Cô Tư pantry là chị họ cô Hằng.'],
          ['vy', 'Người ngoài thì có anh Dũng, chị Mai, anh Khoa, anh Sơn Scrum Master thuê ngoài. Và em. Và… Ngân.'],
          { c: 'd1_vy', o: [
            { t: 'Ngân là ai vậy chị?', fx: { dr: 3 }, then: [
              ['vy', 'Intern thứ hai, onboard cùng ngày với em. Công ty có… đúng một headcount full-time cuối tuần này 🙂'],
            ] },
            { t: 'Dạ em hiểu rồi, em sẽ cố gắng hết sức ạ!', fx: { uy: 3, rel: { vy: 1 } }, then: [
              ['vy', 'Love the energy! Giữ nha. À nói trước cho đỡ sốc: Ngân, intern còn lại, onboard cùng ngày với em. Một headcount thôi 🙂'],
            ] },
            { t: '"Như một gia đình" có phải là red flag không chị?', fx: { dr: 5, rel: { vy: 1 } }, then: [
              ['vy', '…Chị không được phép comment. Nhưng chị cười, em hiểu mà.'],
              ['vy', 'Nhân tiện: Ngân, intern còn lại. Một headcount. Hai người. Good luck!'],
            ] },
          ] },
          ['vy', 'À, Ngân là con gái bạn thân cô Hằng. Nhưng chị tin mọi thứ sẽ fair! …Chắc vậy.'],
          ['vy', 'Next step: qua góc IT gặp anh Khoa lấy laptop với account Teams. 9h là daily stand-up, đừng trễ, anh Sơn sẽ… estimate em.'],
          { chat: [['vy', 'Mọi người ơi welcome intern mới {ten} nha 🎉🎉'], ['hung', '🙏🌸 Chào con. Chúc con năm mới an khang thịnh vượng'], ['mai', 'welcome emmm 😘 có gì ib chị nha'], ['tuan', 'Welcome onboard! Let\'s sync sometime 🚀'], ['son', 'Welcome! Nhớ 9:00 daily stand-up nha. 9:00 không phải 9:01 ⏰'], ['khoa', '👍']] },
        ],
      },
      {
        who: 'khoa', obj: 'Lấy laptop và account Teams ở góc IT', time: '08:35',
        scene: [
          ['khoa', '…'],
          ['nar', 'Một con mèo xám trắng đang nằm trên đầu anh Khoa. Nó nhìn bạn. Anh Khoa không có vẻ gì là để ý.'],
          ['khoa', 'Đó là Mèo KPI. Chief Morale Officer. Nó tự chọn đầu anh. Đừng hỏi.'],
          ['khoa', 'Laptop của em đây. Đời 2015. Pin 11 phút. Teams mở mất 4 phút. Phím "A" phải bấm mạnh.'],
          ['khoa', 'Wifi là BaMe@1998. Đừng đổi. Năm ngoái anh đổi, bác Hùng bảo đổi pass là "mất kết nối với khách hàng", bắt đổi lại.'],
          { c: 'd1_laptop', o: [
            { t: 'Dạ em cảm ơn anh nhiều! Máy này nhìn… bền lắm ạ.', fx: { rel: { khoa: 2 } }, then: [
              ['khoa', 'Em là người đầu tiên cảm ơn anh trong ba năm.'],
              ['nar', 'Mèo KPI kêu "meo" một tiếng. Hình như là đồng ý.'],
            ] },
            { t: 'Anh ơi máy này chạy nổi PowerPoint 200 slide không ạ?', fx: { nl: -5 }, then: [
              ['khoa', 'Nổi. Nếu em kiên nhẫn. Rất, rất kiên nhẫn. Save mỗi 2 phút.'],
            ] },
            { t: 'Sao Ngân được MacBook mới vậy anh?', fx: { dr: 6, set: { mac: true } }, then: [
              ['khoa', 'Cô Hằng approve. Hỏi cô Hằng.'],
              ['khoa', '…Mà thôi, đừng hỏi.'],
            ] },
          ] },
          ['khoa', 'À. Văn phòng có camera khắp nơi. Trừ chỗ bàn thờ Thần Tài. Bác Hùng bảo Thần Tài cần privacy.'],
        ],
      },
      {
        who: 'son', obj: '9:00 Daily stand-up ở bảng Scrum! Đừng trễ', time: '09:00', pos: STANDUP_POS,
        scene: [
          ['son', 'Ok team, 9:00:00. Daily stand-up. Mười lăm phút. Mỗi người ba câu: yesterday, today, blockers. Let\'s go!'],
          ['son', 'Hôm nay có intern mới, welcome {ten}! Lát em giới thiệu ngắn rồi update theo format nha.'],
          ['tuan', 'Yesterday: anh research về OKR. Today: anh research tiếp về OKR. Blocker: không ai dùng OKR.'],
          ['hung', 'Hôm qua bác gặp khách. Hôm nay bác gặp khách. Blocker là cái Jira. Bác không biết mở.'],
          ['son', 'Bác ơi cái đó là impediment, không phải blocker. Mình log vào parking lot nha bác.'],
          ['hung', 'Ừ. Parking lot. Chú Bảy biết chỗ.'],
          ['mai', 'Yesterday em follow-up client. Today em follow-up tiếp. Blocker: không có.'],
          ['nar', 'Chị Mai vừa nói vừa bấm điện thoại. Trên màn hình là một đơn collagen.'],
          ['son', 'Ok, {ten}, your turn!'],
          { c: 'd1_standup', o: [
            { t: '"Yesterday: em chưa vào làm. Today: em onboard. Blocker: laptop pin 11 phút ạ."', fx: { uy: 4, rel: { son: 1, khoa: 1 } }, then: [
              ['son', 'PERFECT format! Mọi người thấy chưa, intern còn làm đúng hơn cả team. Blocker pin laptop, anh log vào backlog, estimate 5 points.'],
              ['khoa', '(nhỏ) Không có cục pin nào estimate được đâu.'],
            ] },
            { t: '"Dạ em là {ten}, em rất vui được làm việc trong một môi trường agile và năng động…"', fx: { nl: -5, rel: { son: -1, hung: 1 } }, then: [
              ['nar', 'Bạn nói ba phút. Anh Sơn nhìn đồng hồ hai lần. Bác Hùng gật gù: "Con nói hay. Giống văn khấn."'],
            ] },
            { t: '"Blocker của em là… em chưa biết blocker là gì ạ."', fx: { dr: 4, rel: { tuan: 1, mai: 1 } }, then: [
              ['tuan', 'Hahaha honestly same. Nobody knows, bro.'],
              ['son', 'Anh sẽ book cho em 2 tiếng training "Agile fundamentals". Estimate 8 points.'],
            ] },
          ] },
          ['nar', 'Daily stand-up "mười lăm phút" kết thúc lúc 9:47. Không ai đứng. Trừ anh Sơn.'],
        ],
      },
      {
        who: 'call:hung', obj: 'Bác Hùng đang gọi Teams! (nghe máy)', time: '10:30',
        call: { title: 'Bác Hùng <> Intern · "5 phút thôi"', people: ['hung', 'me'] },
        scene: [
          ['hung', 'Alo? Alo? Con nghe bác không? Bác không bật camera được, cái nút nó ở đâu…'],
          ['hung', 'Thôi khỏi. Con tuổi gì?'],
          { c: 'd1_tuoi', o: [
            { t: 'Dạ con tuổi Mão ạ.', fx: { uy: 5, rel: { hung: 2 }, set: { tamhop: true } }, then: [
              ['hung', 'MÃO! Tốt! Bác tuổi Hợi. Hợi, Mão, Mùi: tam hợp! Đúng là synergy!'],
            ] },
            { t: 'Dạ… sao bác hỏi vậy ạ?', fx: { uy: 2, rel: { hung: 1 } }, then: [
              ['hung', 'Tuyển người không xem tuổi thì xem gì? Xem CV à? CV ai mà chẳng ghi "chịu được áp lực cao".'],
            ] },
            { t: 'Dạ con không tin mấy cái đó lắm ạ.', fx: { uy: -3, dr: 5, rel: { hung: -1 } }, then: [
              ['nar', 'Im lặng ba giây. Trên Teams hiện "Bác Hùng is typing…" rồi tắt.'],
              ['hung', '…Tuổi trẻ thì cứng. Không sao. Thần Tài sẽ coach con.'],
            ] },
          ] },
          ['hung', 'Ở công ty này có ba điều. Một: sáng thắp hương Thần Tài. Hai: không cãi cô Hằng. Ba: thằng Tuấn nói gì về "Agile" thì con cứ gật, rồi quên đi.'],
          ['hung', 'Giờ con làm cho bác cái slide giới thiệu công ty. Một slide thôi. Có logo, có ma trận BCG, có phong thủy. Năm phút.'],
          ['nar', 'Cuộc gọi "năm phút" kéo dài 52 phút. 40 phút trong đó bác Hùng kể về năm 1998.'],
          { fx: { nl: -8 } },
        ],
      },
      {
        who: 'tu', obj: 'Giờ trưa! Qua pantry ăn cơm cô Tư nấu', time: '12:00',
        scene: [
          ['tu', 'Con mới vô hả? Ăn cơm đi con. Hôm nay canh chua cá lóc. Ai ăn thì góp 25 nghìn, ai không góp thì… cô nhớ.'],
          ['tu', 'Ngồi đâu cũng được, trừ cái ghế đỏ. Ghế cô Hằng. Năm 2019 có đứa ngồi, giờ nó qua làm Big4 rồi. Nghe nói khổ lắm.'],
          { c: 'd1_com', o: [
            { t: 'Dạ con góp 25 nghìn ạ. Thơm quá cô ơi!', fx: { nl: 25, rel: { tu: 2 } }, then: [
              ['tu', 'Ngoan. Cô múc cho con khúc giữa. Khúc giữa là khúc của người tử tế.'],
            ] },
            { t: 'Dạ con order GrabFood rồi ạ.', fx: { nl: 10, rel: { tu: -1 } }, then: [
              ['tu', 'Ừ… Grab. Được.'],
              ['nar', 'Nhiệt độ pantry giảm hai độ.'],
            ] },
            { t: 'Cô ơi, ở đây ai… đáng sợ nhất ạ?', fx: { nl: 20, dr: 4, rel: { tu: 1 }, set: { tu_hint: true } }, then: [
              ['tu', 'Đáng sợ nhất là người mà không ai để ý tới, con à.'],
              ['nar', 'Cô Tư múc thêm cho bạn một muôi cá, không giải thích gì thêm.'],
            ] },
          ] },
          ['tu', 'Ăn đi. Ở đây ai cũng có chuyện. Con cứ ăn, cứ nghe, và đừng kể.'],
          { chat: [['hang', '🎤 Voice message (0:14)'], ['nar', 'Cô Hằng đã thu hồi một tin nhắn.'], ['mai', 'em thấy chưa 👀👀👀', true]] },
        ],
      },
      {
        who: 'mai', obj: 'Về chỗ ngồi. Chị Mai đang vẫy bạn rối rít', time: '14:00',
        scene: [
          ['mai', 'Emmmm qua đây chị share cái insight nè! 👀'],
          ['mai', 'Đọc group Teams chưa? Hồi trưa cô Hằng gửi nhầm voice vào group "BM&P All Hands". Thu hồi rồi nhưng chị nghe kịp.'],
          ['mai', 'Cô nói: "Anh Hùng, con Ngân phải được nhận, em hứa với mẹ nó rồi." 😶'],
          ['think', '…Ồ.'],
          ['mai', 'Nhưng mà nha, Kevin thì muốn nhận người biết làm content LinkedIn. Còn anh Dũng thì nói "nhận ai cũng được, đằng nào cũng…" rồi ảnh im luôn. Sus ha?'],
          { c: 'd1_mai', o: [
            { t: 'Chị Mai kể thêm đi chị!', fx: { dr: 10, rel: { mai: 2 } }, then: [
              ['mai', 'Ôi chị thích em rồi đó. Từ từ, drama công ty này dài như dự án chuyển đổi số, 16 sprint, chị kể dần.'],
            ] },
            { t: 'Thôi chị ơi, em lo task trước đã.', fx: { uy: 3, rel: { mai: -1 } }, then: [
              ['mai', 'Ừ… ngoan ghê. Mà ngoan quá ở đây là thiệt đó em.'],
            ] },
            { t: 'Sao chị biết nhiều vậy?', fx: { rel: { mai: 1 }, dr: 3 }, then: [
              ['mai', 'Chị làm consulting 12 năm. Nghề của chị là "stakeholder interview". Mà đã interview thì phải interview cho hết chớ.'],
            ] },
          ] },
          ['mai', 'À mà em có mua collagen không, chị bán thêm, giá nội bộ…'],
        ],
      },
      {
        who: 'ngan', obj: 'Chào Ngân, intern còn lại', time: '16:30',
        scene: [
          ['ngan', 'À. Chào. Mình là Ngân.'],
          ['ngan', 'MacBook này mẹ mình mua chứ không phải công ty đâu nhé. Đừng nghe ai nói gì.'],
          ['think', 'Mình chưa hỏi gì mà.'],
          ['ngan', 'Nói thẳng luôn: mình không muốn compete. Nhưng mẹ mình thì… muốn rất nhiều.'],
          { c: 'd1_ngan', o: [
            { t: 'Vậy mình cùng cố gắng, fair play nha!', fx: { uy: 2, rel: { ngan: 2 } }, then: [
              ['ngan', '…Ừ. Fair. Ở đây á?'],
              ['nar', 'Ngân cười. Lần đầu tiên trong ngày.'],
            ] },
            { t: 'Mình sẽ không nhường đâu.', fx: { dr: 5, rel: { ngan: -1 } }, then: [
              ['ngan', 'Tốt. Vậy đỡ awkward.'],
            ] },
            { t: 'Thế bạn thật sự muốn làm gì?', fx: { rel: { ngan: 1 }, set: { ngan_dream: true } }, then: [
              ['ngan', '…Mình muốn làm designer. Nhưng "designer không phải là career path". Mẹ mình nói vậy.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 1. Công ty có 10 người, 5 người là họ hàng, 1 con mèo, 1 bàn thờ Thần Tài, 1 headcount.${s.flags.tamhop ? ' Mình tam hợp với Managing Partner.' : ''} Daily stand-up 15 phút kéo dài 47 phút. Mình vẫn còn sống.`,
  },

  // ============ DAY 2 ============
  {
    title: 'Thứ Ba',
    subtitle: 'Quỹ team building bốc hơi',
    intro: '8:00. Văn phòng im lặng bất thường.\n\nCô Hằng đứng giữa phòng, tay cầm file Excel in ra giấy. Quỹ team building đi Vũng Tàu hụt đúng 50 triệu. Tối thứ Sáu vẫn đủ. Sáng nay thì không.\n\nAnh Sơn vẫn quyết: "Stand-up vẫn diễn ra. Agile là phải adapt."',
    chatStart: [['hang', 'TẤT CẢ CÓ MẶT 9H. KHÔNG AI ĐƯỢC WFH.'], ['hung', 'Bình tĩnh em ơi 🙏'], ['hang', 'ANH MUTE ĐI.'], ['tuan', 'Mom, can we take this offline pls'], ['hang', 'TUẤN CŨNG MUTE.'], ['son', 'Stand-up vẫn 9:00 nha mọi người 🙏']],
    pos: {},
    steps: [
      {
        who: 'son', obj: '9:00 Daily stand-up (không khí rất căng)', time: '09:00', pos: STANDUP_POS,
        scene: [
          ['son', 'Ok team, daily stand-up. Yesterday, today, blockers—'],
          ['hang', 'Blocker của cô là năm mươi triệu.'],
          ['son', 'Dạ… cô ơi cái đó mình đưa vào parking lot—'],
          ['hang', 'Parking lot cũng không có năm mươi triệu.'],
          ['nar', 'Cả team im lặng. Mèo KPI nhảy khỏi đầu anh Khoa, chui xuống gầm bàn.'],
          ['hang', 'Quỹ team building đi Vũng Tàu. Một trăm hai mươi triệu. Giờ còn bảy mươi. Ai biết gì thì nói.'],
          ['nar', 'Kevin nhìn trần nhà rất chăm chú.'],
          ['son', '{ten}, em có gì muốn update không?'],
          { c: 'd2_standup', o: [
            { t: '"Today em sẵn sàng support cô Hằng đối chiếu sổ quỹ ạ."', fx: { uy: 3, rel: { hang: 1 } }, then: [['hang', 'Được. Lát lên phòng Finance.']] },
            { t: '"Blocker: không khí ạ."', fx: { dr: 5, rel: { mai: 1, tuan: 1 } }, then: [['nar', 'Chị Mai cười sặc, giả vờ ho.'], ['son', 'Ok! Mình log "không khí" vào risk register nha.']] },
            { t: 'Im lặng, gật đầu.', fx: { rel: { tu: 1 } }, then: [['nar', 'Cô Tư đứng cuối hàng, gật đầu lại với bạn.']] },
          ] },
        ],
      },
      {
        who: 'hang', obj: 'Lên phòng Finance gặp cô Hằng', time: '10:00',
        scene: [
          ['hang', 'Con là đứa mới. Con chưa kịp lấy gì. Nên cô tin con nhất.'],
          ['hang', 'Chìa két chỉ có cô, bác Hùng… và cái chìa dự phòng trong ngăn kéo mà cả công ty đều biết.'],
          ['hang', 'Con giúp cô reconcile sổ quỹ được không? Confidential. Không được nói với ai.'],
          { c: 'd2_help', o: [
            { t: 'Dạ được ạ, con giúp cô.', fx: { uy: 5, nl: -15, rel: { hang: 2 }, set: { hang_help: true } }, then: [
              ['hang', 'Tốt. Cô nhờ Ngân thì nó bảo "con đang làm lại template slide". Template là cái gì? Slide nào chả là slide.'],
              ['nar', 'Bạn dò sổ quỹ hai tiếng. Có một dòng ghi bằng bút chì, đã bị tẩy: "K. — tư vấn ngoài — 50tr".'],
              { fx: { set: { pencil_clue: true } } },
            ] },
            { t: 'Dạ con là Business Analyst, chắc con không rành kế toán ạ…', fx: { rel: { hang: -1, tuan: 1 } }, then: [
              ['hang', 'Business Analyst. Analyst mà không analyze được tiền. Ừ. Thằng Tuấn cũng hay nói câu đó.'],
            ] },
            { t: 'Cô ơi… mình báo công an luôn không cô?', fx: { dr: 10, rel: { hang: -2 } }, then: [
              ['hang', 'BÁO CÔNG AN? Rồi client biết, lên báo, "công ty tư vấn quản lý không quản lý được quỹ"? Chuyện nhà, xử trong nhà!'],
            ] },
          ] },
          ['hang', 'Đi đi. Mắt mở to vào.'],
        ],
      },
      {
        who: 'mai', obj: 'Chị Mai nhắn Teams: "ra đây chị nói cái này 👀"', time: '11:00',
        scene: [
          ['mai', 'Chị cá 100% là chú Bảy. Tuần trước chú mới mua con Exciter mới cáu. Lương tài xế mà mua Exciter? Hỏi thật?'],
          ['mai', 'Em nói với cô Hằng giùm chị đi. Em là người mới, cô trust em.'],
          { c: 'd2_rumor', o: [
            { t: 'Ok, để em nói với cô Hằng.', fx: { dr: 15, rel: { mai: 1, bay: -2 }, set: { spread_bay: true } }, then: [
              ['nar', 'Bạn nói với cô Hằng. Cô Hằng không nói gì. Cô chỉ gõ chữ "BẢY" vào một ô Excel, tô đỏ, in đậm.'],
            ] },
            { t: 'Chưa có data mà chị. Em không nói đâu.', fx: { uy: 5, rel: { mai: -1 } }, then: [
              ['mai', 'Hừ. Nói chuyện như consultant thứ thiệt. Mà thôi, chị respect.'],
            ] },
            { t: 'Để em ra hỏi thẳng chú Bảy.', fx: { dr: 5, set: { ask_bay: true } }, then: [
              ['mai', 'Gan! Chị thích! Hỏi xong debrief chị nha 😘'],
            ] },
          ] },
        ],
      },
      {
        who: 'bay', obj: 'Ra cửa gặp chú Bảy', time: '11:30',
        scene: [
          { if: (s) => s.flags.spread_bay, then: [
            ['bay', 'Con nói với cô Hằng là chú lấy tiền hả?'],
            ['bay', 'Chú làm cho anh Hùng hai mươi năm. Xe chú mua trả góp 18 tháng, hợp đồng đây nè.'],
            ['nar', 'Chú Bảy chìa ra một tờ hợp đồng nhàu nát, gấp làm tám.'],
            ['bay', 'Thôi. Chú không giận. Người mới mà. Nhưng chú cũng không kể gì cho con đâu.'],
          ], else: [
            ['bay', 'Nghe nói người ta nghi chú hả? Kệ. Chú quen rồi. Cái gì mất trong công ty này, người đầu tiên bị nghi là chú. Năm ngoái mất cái sạc laptop, cũng nghi chú.'],
            ['bay', 'Chú kể con nghe. Tối thứ Sáu chú về trễ, thấy thằng Tuấn từ phòng Finance đi ra. Tay cầm phong bì.'],
            ['bay', 'Nó thấy chú, nó cười, nó nói: "Uncle Bảy, you didn\'t see anything, okay?"'],
            ['bay', 'Chú không biết tiếng Anh. Nhưng chú hiểu.'],
            { fx: { set: { clue_tuan: true }, rel: { bay: 1 } } },
            { c: 'd2_bay', o: [
              { t: 'Chú có định nói với cô Hằng không?', then: [
                ['bay', 'Nói rồi ai tin? Tài xế đi nói con trai sếp lấy tiền? Chú còn muốn làm tới lúc về hưu.'],
              ] },
              { t: 'Con tin chú.', fx: { rel: { bay: 2 } }, then: [
                ['bay', '…Cảm ơn con. Ở đây lâu lắm rồi mới có người nói câu đó.'],
              ] },
            ] },
          ] },
        ],
      },
      {
        who: 'tuan', obj: 'Kevin Tuấn mời bạn "1:1 sync nhanh 5 phút"', time: '14:30',
        scene: [
          ['tuan', 'Hey {ten}! Ngồi đi, beanbag đó ergonomic lắm. Quick 1:1 sync nha.'],
          ['tuan', 'Honestly, công ty này stuck ở năm 2005. Bố anh vẫn chốt deal bằng điện thoại bàn. Mẹ anh làm báo cáo tài chính bằng bút bi ba màu.'],
          ['tuan', 'Mình đi tư vấn chuyển đổi số cho người ta, mà chính mình chưa chuyển đổi. Ironic, right?'],
          ['tuan', 'Anh cần một người làm employer branding: LinkedIn, TikTok, "A day in the life of a consultant". Viral chắc luôn. Nhưng… đừng nói với bố mẹ anh vội. Not yet.'],
          { c: 'd2_tiktok', o: [
            { t: 'Em làm! Nhưng bí mật nha anh.', fx: { dr: 5, rel: { tuan: 2 }, set: { tuan_ally: true } }, then: [
              ['tuan', 'YES. That\'s the spirit! Mình là squad Innovation đầu tiên của Ba Mẹ & Partners. Squad hai người. Lean.'],
            ] },
            { t: 'Em phải xin phép bác Hùng trước ạ.', fx: { uy: 3, rel: { tuan: -1, hung: 1 } }, then: [
              ['tuan', 'Bố anh sẽ hỏi "TikTok là gì, có phải con của Facebook không". But okay. Respect.'],
            ] },
            { t: 'Anh Kevin… tối thứ Sáu anh vào phòng Finance làm gì vậy?', when: (s) => s.flags.clue_tuan || s.flags.pencil_clue, fx: { dr: 10, rel: { tuan: -1 }, set: { tuan_admitted: true } }, then: [
              ['tuan', '…'],
              ['tuan', 'Who told you that?'],
              ['tuan', 'Okay. Okay. Không phải như em nghĩ. Anh… borrow. Anh sẽ trả. Đừng nói với mẹ anh. Please.'],
            ] },
          ] },
          ['tuan', 'Anyway. Think about it. Disrupt or be disrupted.'],
        ],
      },
    ],
    diary: (s) => `Ngày 2. Quỹ team building hụt 50 triệu. ${s.flags.spread_bay ? 'Mình đã chỉ tay vào chú Bảy. Mình không chắc mình đúng.' : s.flags.clue_tuan ? 'Chú Bảy thấy Kevin cầm phong bì. Interesting.' : 'Ai cũng nghi ai đó.'} Kevin nói "disrupt" bốn lần. Mèo KPI vẫn trốn dưới gầm bàn.`,
  },

  // ============ DAY 3 ============
  {
    title: 'Thứ Tư',
    subtitle: 'Ai cũng có bí mật',
    intro: 'Ngày thứ ba. Vụ 50 triệu chưa có lời giải.\n\nCô Hằng đổi khóa két. Bác Hùng mời thầy phong thủy tới "audit năng lượng văn phòng". Anh Sơn dán thêm 40 tờ sticky note lên bảng Scrum.\n\nThầy phán: "Có người trong nhà đang giấu chuyện." Thầy nói đúng. Chỉ là không phải một người.',
    chatStart: [['hung', 'Thầy nói phải dời cây kim tiền sang góc Đông Nam. Khoa dời giùm bác.'], ['khoa', 'Dạ.'], ['mai', 'cây kim tiền héo rồi bác ơi 🥲'], ['hung', 'Héo là do năng lượng xấu. Ai làm cây héo?'], ['son', 'Mình có thể đưa "cây héo" vào retro không ạ 🙏'], ['nar', '(Không ai trả lời.)']],
    pos: { ngan: 'pantry2' },
    steps: [
      {
        who: 'son', obj: '9:00 Daily stand-up', time: '09:00', pos: { ...STANDUP_POS, ngan: 'pantry2' },
        scene: [
          ['son', 'Team ơi, hôm nay mình thử format mới: mỗi người update bằng một emoji! Agile là phải experiment!'],
          ['hung', '🙏'],
          ['hang', '💰❓'],
          ['tuan', '🚀🚀🚀'],
          ['mai', '👀'],
          ['dung', '🏔️'],
          ['think', 'Anh Dũng chọn ngọn núi. Ai sắp nghỉ việc cũng hay đổi avatar thành ngọn núi.'],
          ['son', 'Ngân đâu? Ngân vắng không báo… À thôi. {ten}, emoji của em?'],
          { c: 'd3_standup', o: [
            { t: '🫡', fx: { uy: 2, rel: { son: 1, hung: 1 } }, then: [['son', 'Commitment! Anh thích.']] },
            { t: '🍿', fx: { dr: 6, rel: { mai: 2 } }, then: [['mai', '(nhỏ) Em là người của chị rồi đó.'], ['hang', 'Bỏng ngô là ý gì?']] },
            { t: '🐱', fx: { rel: { khoa: 1 } }, then: [['nar', 'Mèo KPI từ dưới gầm bàn bò ra, nhảy lại lên đầu anh Khoa. Cả team vỗ tay. Không khí đỡ căng hẳn.']] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Ngân đang ngồi một mình ở pantry… hình như đang khóc?', time: '09:45',
        scene: [
          ['ngan', 'Đừng nhìn. Mình không khóc. Hành phi của cô Tư cay mắt thôi.'],
          ['ngan', 'Mẹ mình vừa gọi. Mẹ bảo tuần này không được convert thì "đừng về nhà ăn cơm". Nói đùa thôi. Chắc vậy.'],
          { if: (s) => s.flags.ngan_dream, then: [['ngan', 'Hôm qua cậu hỏi mình thật sự muốn làm gì. Chưa ai hỏi mình câu đó cả.']] },
          ['ngan', 'Mình có làm lại template slide cho công ty. Cho vui thôi. Không dám cho ai xem.'],
          ['nar', 'Ngân chìa laptop: bộ slide pastel, sạch, có hệ thống icon riêng. Không còn Comic Sans. Không còn WordArt cầu vồng. Đẹp đến bất ngờ.'],
          { c: 'd3_ngan', o: [
            { t: 'Đẹp quá! Cậu nên show cho Kevin xem.', fx: { rel: { ngan: 2 }, set: { ngan_friend: true } }, then: [
              ['ngan', 'Thật hả? …Cảm ơn. Thật đấy.'],
            ] },
            { t: 'Ừm… cũng được. Nhưng mình nghĩ nên focus task chính.', fx: { uy: 2, rel: { ngan: -1 } }, then: [
              ['ngan', 'Ừ. Biết mà.'],
              ['nar', 'Ngân gập laptop. Hành phi hình như cay hơn.'],
            ] },
            { t: 'Hay mình join squad của Kevin? Cậu lo design!', when: (s) => s.flags.tuan_ally, fx: { dr: 5, rel: { ngan: 3, tuan: 1 }, set: { ngan_friend: true, ngan_team: true } }, then: [
              ['ngan', 'Khoan, công ty này có "squad" á? …Mình join. Đừng nói mẹ mình.'],
              ['think', 'Sao ai ở đây cũng có một người không được nói vậy?'],
            ] },
          ] },
        ],
      },
      {
        who: 'khoa', obj: 'Anh Khoa gọi bạn qua góc IT (lạ ghê, anh ấy chưa gọi ai bao giờ)', time: '10:30',
        scene: [
          ['khoa', 'Lại đây. Nhỏ tiếng.'],
          ['khoa', 'Camera phòng Finance tối thứ Sáu bị rút điện lúc 19:02. Người rút biết chính xác ổ cắm nằm đâu.'],
          ['khoa', 'Người biết: anh. Bác Hùng. Và người lắp nó cùng anh năm 2019.'],
          ['me', 'Ai lắp vậy anh?'],
          ['khoa', 'Kevin. Hồi mới về nước, ảnh muốn làm "smart office". Rồi ảnh chán. Như mọi thứ khác.'],
          { if: (s) => (s.rel.khoa || 0) >= 2, then: [['khoa', 'Anh kể em nghe vì em là người duy nhất cảm ơn anh.']], else: [['khoa', 'Anh kể em nghe vì không ai khác chịu nghe anh nói quá hai câu.']] },
          ['khoa', 'Còn một chuyện. Nếu em thấy anh với chị Vy đi ăn trưa chung… thì đừng nói ai nha. Cô Hằng đang định mai mối chị Vy cho con trai một đại lý nồi cơm điện.'],
          ['nar', 'Mèo KPI trên đầu anh Khoa nhìn bạn rất nghiêm túc. Như một điều khoản NDA.'],
          { c: 'd3_khoa', o: [
            { t: 'Em hứa. Chúc anh chị hạnh phúc!', fx: { rel: { khoa: 2, vy: 1 }, set: { keep_khoa: true } }, then: [
              ['khoa', '…Cảm ơn em.'],
              ['nar', 'Anh Khoa gần như mỉm cười. Gần như.'],
            ] },
            { t: 'Chị Mai biết chưa anh?', fx: { dr: 6, rel: { khoa: -1 } }, then: [
              ['khoa', 'Chị Mai mà biết thì cả LinkedIn biết.'],
              ['nar', 'Anh Khoa tái mặt. Mèo KPI xù lông.'],
            ] },
            { t: 'Anh cho em xem đoạn camera trước 19:02 được không?', fx: { dr: 4 }, then: [
              { if: (s) => (s.rel.khoa || 0) >= 1, then: [
                ['nar', 'Anh Khoa mở footage. 19:00:41: một bóng người mặc hoodie xanh mint, đeo AirPods, ôm túi laptop in chữ "HUSTLE", bước vào phòng Finance. 19:02: màn hình đen.'],
                ['khoa', 'Cả công ty chỉ có một người mặc hoodie xanh mint đi làm.'],
                { fx: { set: { cam_seen: true } } },
              ], else: [
                ['khoa', 'Chưa được. Anh chưa trust em tới mức đó.'],
              ] },
            ] },
          ] },
        ],
      },
      {
        who: 'call:hung', obj: 'Bác Hùng gọi Teams lần nữa…', time: '13:30',
        call: { title: 'Bác Hùng <> Intern · "Hỏi nhanh thôi"', people: ['hung', 'me'] },
        scene: [
          ['hung', 'Alo con. Lần này bác bật được camera rồi nè. Con thấy bác không?'],
          ['nar', 'Bạn thấy trọn vẹn lỗ mũi của bác Hùng. Camera đặt từ dưới cằm.'],
          ['hung', 'Thầy phong thủy nói trong nhà có người giấu chuyện. Bác hỏi con, con mới vào, con nhìn objective: thằng Dũng dạo này sao?'],
          { c: 'd3_hung', o: [
            { t: 'Dạ, anh Dũng hơi… lạ ạ.', fx: { dr: 6, rel: { hung: 1, dung: -1 }, set: { hint_hung: true } }, then: [
              ['hung', 'Lạ. Ừ. Bác cũng thấy. Nó đổi avatar Teams thành ngọn núi. Người sắp đi hay đổi ảnh ngọn núi.'],
            ] },
            { t: 'Dạ con không để ý ạ.', then: [
              ['hung', 'Ừ. Con khôn. Ở đây "không để ý" là một core competency.'],
            ] },
            { t: 'Bác nên 1:1 với anh Dũng ạ. Anh ấy thấy mình không được ghi nhận.', fx: { uy: 5, rel: { hung: 1, dung: 1 }, set: { advice_hung: true } }, then: [
              ['hung', '…Ghi nhận. Bác tưởng trả lương đầy đủ, Tết có bao lì xì là ghi nhận rồi.'],
              ['nar', 'Bác Hùng im lặng rất lâu. Lâu đến mức Teams hỏi "Are you still there?"'],
            ] },
          ] },
          ['hung', 'Thôi con làm việc đi. Nhớ thắp hương. Bác thoát kiểu gì đây, nút đỏ hả con?'],
        ],
      },
      {
        who: 'dung', obj: 'Anh Dũng rủ bạn uống cà phê ở cửa sổ', time: '15:00', pos: { dung: 'window' },
        scene: [
          ['dung', 'Cà phê không? Cà phê gói thôi.'],
          ['dung', 'Anh ở đây mười lăm năm. Bảy mươi phần trăm client là anh mang về. Tên công ty là "Ba Mẹ & Partners". Mười lăm năm, anh vẫn là "partners" không viết hoa.'],
          ['dung', 'Năm ngoái anh xin lên Partner. Bác Hùng bảo: "Partner thì phải là người nhà, em hiểu mà." Anh hiểu. Hiểu rất rõ.'],
          ['dung', 'Nói thật: anh sắp ra riêng. Client quen sẽ đi theo anh. Anh cần một người trẻ, biết làm data.'],
          ['dung', 'Em lấy giúp anh file "Client_Master_FINAL_v7_dungxoa.xlsx" trên SharePoint. Em mới vào, không ai nghi. Qua bên anh, lương gấp đôi.'],
          { c: 'd3_dung', o: [
            { t: 'Dạ… em đồng ý.', fx: { uy: -5, dr: 15, rel: { dung: 3 }, set: { dung_join: true } }, then: [
              ['dung', 'Tốt. Cuối tuần anh nhắn. Đừng lưu file trên máy công ty, thằng Khoa thấy hết.'],
            ] },
            { t: 'Em không làm vậy được anh ạ.', fx: { uy: 5, rel: { dung: -1 } }, then: [
              ['dung', 'Ừ. Anh hiểu. Em còn trẻ, còn tin vào… mấy thứ này.'],
              ['nar', 'Anh Dũng liếc về phía bàn thờ Thần Tài.'],
            ] },
            { t: 'Để em suy nghĩ đã anh.', fx: { dr: 5, set: { dung_maybe: true } }, then: [
              ['dung', 'Nghĩ nhanh. Thứ Sáu là Retro rồi.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 3. Ai cũng có bí mật: Ngân, anh Khoa, chị Vy, anh Dũng${s.flags.cam_seen ? ', và một cái hoodie xanh mint' : ''}. ${s.flags.dung_join ? 'Mình vừa nhận lời một việc mà mình không dám ghi vào nhật ký.' : 'Mình bắt đầu hiểu vì sao chị Mai biết nhiều thế.'} Thầy phong thủy tính phí 5 triệu. Không ai thấy lạ.`,
  },

  // ============ DAY 4 ============
  {
    title: 'Thứ Năm',
    subtitle: 'Client call thảm họa',
    intro: 'Thứ Năm. 14:00 hôm nay là buổi pitch qua Teams với "Trà Sữa Tâm Trạng": chuỗi 40 cửa hàng, hợp đồng lớn nhất năm.\n\nNgày mai là Sprint Retro kiêm "Họp Gia Đình Mở Rộng", nơi mọi chuyện hoặc được nói ra, hoặc được chôn xuống. Cũng là ngày công bố ai được convert lên full-time.',
    chatStart: [['vy', 'Nhắc cả nhà: 14:00 pitch Trà Sữa Tâm Trạng, mọi người MUTE khi không nói nha 🙏'], ['vy', 'Mai 9h Retro ở War Room, cô Tư nấu xôi gấc ạ 🥰'], ['tu', '👍'], ['mai', 'xôi gấc là có biến 😳'], ['dung', '.'], ['nar', 'Anh Dũng đã rời nhóm.'], ['nar', 'Bác Hùng đã thêm Anh Dũng vào nhóm.'], ['hung', 'Bấm nhầm hả con 🙏']],
    pos: {},
    steps: [
      {
        who: 'tu', obj: 'Cô Tư gọi: "Con lên pantry cô nhờ cái này"', time: '08:30',
        scene: [
          ['tu', 'Hôm qua cô lau sau tủ hồ sơ phòng Finance, thấy cái này.'],
          { if: (s) => (s.rel.tu || 0) >= 2, then: [
            ['nar', 'Cô Tư đưa bạn một tờ hóa đơn: "SƠN AGILE COACHING · Gói Agile Transformation 3 tháng · 50.000.000đ". Mặt sau, chữ viết tay:\n"Mẹ, con mượn quỹ trả coach. Con sẽ trả trước ngày 30. Đừng nói bố. — K."'],
            ['tu', 'Cô đưa con vì con góp tiền cơm đầy đủ. Ở đời, người ta trust nhau từ mấy cái nhỏ vậy đó.'],
            { fx: { set: { note: true } } },
            ['think', 'Khoan. Anh Sơn được trả bằng tiền quỹ team building? Anh Sơn có biết không?'],
            ['tu', 'Con định làm gì với nó?'],
            { c: 'd4_note', o: [
              { t: 'Con đưa Kevin, để anh ấy tự nói ra.', fx: { rel: { tu: 1 }, set: { note_to_tuan: true } }, then: [
                ['tu', 'Ừ. Cho người ta cơ hội tự đứng dậy. Tốt.'],
              ] },
              { t: 'Con giữ lại. Mai Retro rồi tính.', fx: { dr: 5 }, then: [
                ['tu', 'Giữ thì giữ cho kỹ. Giấy mỏng mà chuyện dày.'],
              ] },
              { t: 'Con trả lại cô. Con không muốn dính vào chuyện nhà người ta.', fx: { rel: { tu: 2 }, set: { note: false, tu_respect: true } }, then: [
                ['tu', '…Biết lúc nào không nên dính vào. Cái đó hiếm lắm, con à.'],
                ['nar', 'Cô Tư nhìn bạn lâu hơn bình thường, rồi cất tờ hóa đơn vào túi áo.'],
              ] },
            ] },
          ], else: [
            ['tu', '…Mà thôi. Cô đưa con Mai rồi. Nó hỏi trước.'],
            ['think', 'Tức là… cả LinkedIn sắp biết.'],
            { fx: { dr: 10, set: { note_mai: true } } },
          ] },
        ],
      },
      {
        who: 'tuan', obj: 'Tìm Kevin Tuấn', time: '09:30',
        scene: [
          { if: (s) => s.flags.note_to_tuan || s.flags.tuan_admitted || s.flags.cam_seen || s.flags.note_mai, then: [
            { if: (s) => s.flags.note_to_tuan, then: [['nar', 'Bạn đưa Kevin tờ hóa đơn. Anh đọc. Mặt anh chuyển từ hồng sang trắng sang một màu chưa có trong bảng màu pastel.']] },
            { if: (s) => s.flags.note_mai && !s.flags.note_to_tuan, then: [['tuan', 'Chị Mai vừa nhìn anh và nói "Con ơi là con". Chị Mai chưa bao giờ gọi anh là con. Em biết gì không?']] },
            ['tuan', '…I\'m so screwed.'],
            ['tuan', 'Anh thuê anh Sơn làm Agile coach. Năm mươi triệu. Mẹ không duyệt budget, nên anh… "tạm ứng" từ quỹ team building.'],
            ['tuan', 'Anh Sơn không biết gì đâu. Ảnh tưởng công ty approve rồi.'],
            ['tuan', 'Bố mẹ anh build công ty này hai mươi sáu năm. Anh chỉ muốn chứng minh anh cũng build được gì đó. Và anh build được… một cái bảng sticky note.'],
            { c: 'd4_tuan', o: [
              { t: 'Mai Retro, anh tự nói ra đi. Em ở đó với anh.', fx: { uy: 5, rel: { tuan: 2 }, set: { tuan_confess: true } }, then: [
                ['tuan', '…Okay. Okay. Anh sẽ own it. Nếu anh xỉu, em đỡ anh nha.'],
              ] },
              { t: 'Em sẽ giữ bí mật cho anh.', fx: { dr: 6, rel: { tuan: 1 }, set: { tuan_hide: true } }, then: [
                ['tuan', 'You\'re a legend. Anh sẽ tìm cách trả lại trước khi mẹ phát hiện. Chắc vậy.'],
              ] },
              { t: 'Thật ra cái bảng Scrum giúp team nói chuyện với nhau nhiều hơn đó anh.', fx: { rel: { tuan: 2, son: 1 }, set: { tuan_hope: true } }, then: [
                ['tuan', 'Wait. Really?'],
                ['tuan', 'Ừ ha… stand-up dù dài, nhưng là lần đầu cả nhà đứng chung một chỗ mỗi sáng. Kể cả bố.'],
              ] },
            ] },
          ], else: [
            ['tuan', 'Hey. Mẹ anh đang điều tra như phim CSI. Hôm qua mẹ hỏi anh "Con có biết phong bì trắng nào không". Em có nghe gì không?'],
            { c: 'd4_tuan2', o: [
              { t: 'Em không biết gì đâu anh.', then: [['tuan', 'Good. Good. Ý anh là… đáng tiếc. Hy vọng mọi chuyện được làm rõ.']] },
              { t: 'Hình như anh đang lo hơi nhiều đó anh.', fx: { dr: 4, rel: { tuan: -1 } }, then: [['tuan', 'Anh? Lo? No. Anh chill. Anh rất chill.'], ['nar', 'Kevin uống một ngụm cold brew. Từ cái ly rỗng.']] },
            ] },
          ] },
        ],
      },
      {
        who: 'call:hung', obj: '14:00 Pitch qua Teams với Trà Sữa Tâm Trạng! (vào call)', time: '14:00',
        call: { title: 'BM&P x Trà Sữa Tâm Trạng · Digital Transformation Pitch', people: ['client', 'hung', 'mai', 'tuan', 'me'] },
        scene: [
          ['client', 'Chào anh chị Ba Mẹ & Partners. Bên chị có 40 cửa hàng mà vẫn chốt đơn bằng giấy note dán tủ lạnh. Chị cần chuyển đổi số.'],
          ['hung', 'Dạ chị Tâm yên tâm. Bên em có framework độc quyền. Gọi là… gọi là…'],
          ['tuan', '(nhắn riêng cho bạn) BRO slide 4 đâu, bố anh quên tên framework rồi'],
          ['nar', 'Đột nhiên, một giọng nói vang lên to rõ trong call: "CÁC CHỊ ƠI COLLAGEN NÀY UỐNG VÀO LÀ DA CĂNG NHƯ DEADLINE, CHỐT ĐƠN EM GỬI LINK—"'],
          ['think', 'Chị Mai. Quên mute. Đang livestream bán collagen. Trong buổi pitch.'],
          ['nar', 'Cùng lúc đó, camera bác Hùng tự bật: bác đang mặc áo ba lỗ, cầm quạt mo, sau lưng là bàn thờ Thần Tài.'],
          ['client', '…'],
          { c: 'd4_live', o: [
            { t: 'Unmute, cứu call: "Dạ đó là case study livestream commerce mà bên em đề xuất cho chị ạ!"', fx: { uy: 6, rel: { mai: 3, hung: 1 }, set: { live_save: true } }, then: [
              ['client', '…Livestream commerce?'],
              ['me', 'Dạ, 40 cửa hàng của chị, mỗi chiều live 30 phút, chốt đơn qua link. Chị Mai đang demo live đó ạ. Hôm qua chị ấy chốt 37 đơn.'],
              ['mai', '(unmute) ĐÚNG RỒI Ạ! 37 đơn! Em demo cho chị xem!'],
              ['hung', '(vẫn mặc áo ba lỗ) Còn bác đây là… demo "văn hóa doanh nghiệp gần gũi" ạ.'],
              ['client', 'Hahaha. Được. Bên chị chưa ai dám làm vậy. Gửi chị proposal trước thứ Hai nhé.'],
              ['tuan', '(nhắn riêng) BRO. BRO. WE WON?? 🚀🚀🚀'],
              { chat: [['tuan', 'BRO. Trà Sữa Tâm Trạng muốn proposal!!! 🚀🧋', true]] },
            ] },
            { t: 'Im lặng, tắt camera, cầu nguyện.', fx: { rel: { mai: -1 } }, then: [
              ['client', 'Bên chị cần suy nghĩ thêm. Chị phải đi họp. Bye anh chị.'],
              ['nar', '"Chị Tâm has left the meeting." Trong call chỉ còn lại tiếng quạt mo của bác Hùng.'],
              ['hung', 'MAI. LÊN PHÒNG BÁC.'],
            ] },
            { t: 'Chụp màn hình, làm content TikTok cho squad của Kevin!', when: (s) => s.flags.tuan_ally, fx: { dr: 10, rel: { tuan: 2, mai: 1 }, set: { viral: true } }, then: [
              ['nar', 'Video "Khi sếp quên tắt camera giữa buổi pitch triệu đô" đạt 340 nghìn view sau ba tiếng. Chị Tâm cũng xem. Chị Tâm cũng share.'],
              ['client', '(nhắn sau đó) Chị thích team bên em. Real. Gửi chị proposal nhé 🧋'],
              { chat: [['tuan', 'BRO. 340K VIEWS. Và client vẫn muốn proposal 😭🚀', true]] },
            ] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Chị Vy cần bạn nộp self-review', time: '16:00',
        scene: [
          ['vy', 'Mai Retro xong là công bố. Chị phải nộp đánh giá hai đứa lên cô Hằng. Nói thật: form do cô Hằng soạn, tiêu chí số một là "Hòa đồng với gia đình".'],
          ['vy', 'Em tự đánh giá đi: tuần này em contribute gì nhất?'],
          { c: 'd4_self', o: [
            { t: 'Em giúp cô Hằng reconcile sổ quỹ.', when: (s) => s.flags.hang_help, fx: { uy: 5, rel: { hang: 1 } }, then: [['vy', 'Ồ, điểm cộng to đó. Cô Hằng nhớ dai lắm, cả chuyện tốt lẫn chuyện xấu.']] },
            { t: 'Em cứu buổi pitch Trà Sữa Tâm Trạng.', when: (s) => s.flags.live_save || s.flags.viral, fx: { uy: 6, rel: { tuan: 1 } }, then: [['vy', 'Bác Hùng kể với cả họ rồi. Kể cả đoạn áo ba lỗ.']] },
            { t: 'Em ăn cơm cô Tư đầy đủ.', fx: { rel: { tu: 1 } }, then: [['vy', 'Em cười đó hả? Thật ra tiêu chí đó quan trọng hơn em tưởng.']] },
            { t: 'Em… giữ được bí mật.', when: (s) => s.flags.keep_khoa, fx: { rel: { vy: 2 } }, then: [['vy', '…Anh Khoa kể em rồi hả?'], ['vy', 'Cảm ơn em. Chị sẽ viết thật đẹp.']] },
          ] },
          ['vy', 'Ok, chị note hết. Mai mặc đẹp nha, cô Hằng chấm điểm cả outfit.'],
        ],
      },
      {
        who: 'dung', when: (s) => s.flags.dung_join || s.flags.dung_maybe, pos: { dung: 'window' },
        obj: 'Anh Dũng đứng chờ bạn ở cửa sổ', time: '17:00',
        scene: [
          ['dung', 'File đâu em?'],
          { c: 'd4_file', o: [
            { t: 'Em gửi anh rồi.', when: (s) => s.flags.dung_join, fx: { dr: 10, set: { file_sent: true } }, then: [['dung', 'Tốt. Mai sau Retro, mọi chuyện sẽ khác.']] },
            { t: 'Em đổi ý rồi anh. Em không làm.', fx: { uy: 3, rel: { dung: -2 }, set: { dung_join: false } }, then: [['dung', '…Được. Vậy mai em đừng ngạc nhiên.']] },
            { t: 'Anh ơi, anh nói thẳng với bác Hùng đi. Mười lăm năm mà.', fx: { rel: { dung: 1 }, set: { dung_talk: true, dung_join: false } }, then: [
              ['dung', 'Nói gì? "Anh ơi em muốn được làm Partner"? Ở đây chỉ người trong nhà mới được viết hoa.'],
              ['nar', 'Nhưng anh không bỏ đi. Anh đứng nhìn ra cửa sổ rất lâu.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 4. ${s.flags.live_save ? 'Mình cứu buổi pitch bằng một câu bịa ra tại chỗ. Consulting là vậy hả? ' : ''}${s.flags.viral ? 'Video áo ba lỗ của bác Hùng lên 340K view. ' : ''}${s.flags.note ? 'Mình đang giữ một tờ hóa đơn có thể làm nổ tung một gia đình. ' : ''}Mai là Retro. Mình mất ngủ.`,
  },

  // ============ DAY 5 ============
  {
    title: 'Thứ Sáu',
    subtitle: 'Sprint Retro kiêm Họp Gia Đình',
    intro: '9:00 sáng thứ Sáu. War Room.\n\nXôi gấc. Mười hai con người, một con mèo. Một bảng Start / Stop / Continue. Và hai mươi sáu năm chuyện chưa nói.',
    chatStart: [['son', 'Retro 9:00 War Room nha mọi người. Nhớ mang sticky note 🟨🟩🟥'], ['mai', 'chị mang bỏng ngô rồi 🍿', true]],
    pos: { hung: 'm_head', hang: 'm_n1', tuan: 'm_n2', vy: 'm_n3', khoa: 'm_n4', dung: 'm_n5', mai: 'm_s1', ngan: 'm_s2', tu: 'm_s4', bay: 'm_s5', son: 'm_foot' },
    steps: [
      { who: 'obj:seat', obj: 'Vào War Room và ngồi vào ghế trống', time: '09:00', scene: 'meeting' },
    ],
    diary: () => '',
  },
];

// ---------- Retro / meeting ----------
export const MEETING = [
  ['son', 'Welcome to Sprint Retro! Hôm nay mình làm Start / Stop / Continue. Safe space nha mọi người. Không ai bị judge.'],
  ['hang', 'Cô judge.'],
  ['son', '…Dạ. Gần như safe space.'],
  ['hung', 'Rồi. Thứ nhất: tháng này doanh thu giảm 12%. Thầy phong thủy nói do cây kim tiền. Đã dời cây.'],
  { if: (s) => s.flags.live_save || s.flags.viral, then: [['vy', 'Dạ… nhưng Trà Sữa Tâm Trạng vừa xin proposal ạ. Nhờ buổi pitch hôm qua.'], ['hung', 'Ừ. Cái đó… cũng là do dời cây.']] },
  ['hang', 'Thứ hai: năm mươi triệu. Hôm nay phải ra lẽ. Ai biết gì thì nói. Không ai nói thì trừ lương cả công ty, chia đều. Mỗi người bốn triệu rưỡi.'],
  ['mai', 'Ủa, intern cũng bị trừ hả cô?'],
  ['hang', 'Gia đình thì chia đều.'],
  ['son', 'Cô ơi… mình đưa cái này vào cột "Stop" được không ạ? Stop: mất tiền.'],
  { if: (s) => s.flags.spread_bay, then: [['hang', 'Hôm thứ Ba, {ten} có nói với cô là chú Bảy…'], ['nar', 'Chú Bảy nhìn xuống tờ hợp đồng trả góp gấp làm tám.']] },
  ['nar', 'Mọi ánh mắt quay về phía bạn: người mới, người duy nhất chưa có lý do gì để im lặng. Mèo KPI cũng quay sang.'],
  { c: 'd5_money', o: [
    { t: 'Nói ra sự thật: Kevin lấy quỹ trả phí Agile coach cho anh Sơn.', when: (s) => (s.flags.note || s.flags.tuan_admitted || s.flags.cam_seen || s.flags.clue_tuan || s.flags.pencil_clue) && !s.flags.tuan_confess, fx: { dr: 10, rel: { tuan: -2, hang: 1 }, set: { truth_out: true, exposed_tuan: true } }, then: [
      ['tuan', 'MOM. I can explain.'],
      ['son', 'Khoan… em tưởng hợp đồng của em được approve rồi?'],
      ['hung', 'Con… lấy tiền đi Vũng Tàu của cả nhà… để thuê người dạy… đứng họp?'],
      ['tuan', 'Agile, bố! Đó là AGILE!'],
      ['nar', 'Cô Hằng không la. Cô Hằng không khóc. Cô Hằng chỉ đóng file Excel lại, rất chậm. Đó là điều đáng sợ nhất bạn từng thấy.'],
      { if: (s) => s.flags.live_save || s.flags.viral, then: [['mai', 'Nhưng cô ơi, nếu không có mấy cái "đứng họp" đó, hôm qua team không phối hợp cứu được buổi pitch đâu!'], ['hang', '…'], ['hang', 'Tuấn. Tháng sau trả mẹ. Rồi mẹ cấp con mười triệu, làm lại, có kế hoạch, có báo cáo. Bằng giấy.']] },
    ] },
    { t: 'Nhìn Kevin, gật đầu: "Anh nói đi."', when: (s) => s.flags.tuan_confess, fx: { uy: 10, rel: { tuan: 2, hang: 1, hung: 1, son: 1 }, set: { truth_out: true } }, then: [
      ['tuan', 'Bố. Mẹ. Con lấy năm mươi triệu trả phí coach cho anh Sơn. Anh Sơn không biết. Con muốn công ty mình làm được cái mình đi tư vấn cho người khác. Con xin lỗi.'],
      ['hang', 'Sao con không nói với mẹ?'],
      ['tuan', 'Vì mẹ sẽ nói "chuyện đó để bố con quyết". Và bố sẽ nói "để mẹ con quyết".'],
      ['hung', '…Bố có nói vậy hả?'],
      ['nar', 'Cả phòng đồng thanh: "CÓ."'],
      ['nar', 'Cô Hằng đứng dậy, đi vòng qua bàn, và ôm Kevin. Anh Sơn lặng lẽ viết lên sticky note xanh: "Continue: nói thật với nhau". Chị Mai khóc. Chị Mai cũng đang livestream.'],
    ] },
    { t: 'Đổ cho chú Bảy: "Con nghĩ là chú Bảy ạ."', fx: { uy: -20, dr: 25, rel: { bay: -3, khoa: -1 }, set: { blamed_bay: true } }, then: [
      ['nar', 'Chú Bảy đứng dậy, không nói gì, đặt tờ hợp đồng trả góp lên bàn.'],
      ['khoa', 'Khoan. Tối thứ Sáu lúc 19 giờ, chú Bảy ngồi ở cổng. Camera cổng ghi rõ. Chú đang chơi cờ tướng. Và thua.'],
      ['nar', 'Mười một cặp mắt người và một cặp mắt mèo quay sang bạn. Xôi gấc nguội dần.'],
    ] },
    { t: 'Im lặng.', fx: { rel: { tu: 2 }, set: { silent: true } }, then: [
      ['nar', 'Bạn im lặng. Mười giây. Hai mươi giây. Anh Sơn định nói "time-box" rồi thôi.'],
      ['tu', 'Thôi, ăn xôi đi. Tiền mất thì đã mất. Ai lấy thì người đó tự biết. Mà người tự biết thì sẽ tự trả.'],
      ['nar', 'Kevin nhìn bạn, gật đầu rất khẽ. Chiều hôm đó, một phong bì trắng xuất hiện lại trong két sắt.'],
    ] },
    { t: 'Đứng lên: "Con xin chịu trừ phần con. Nhưng nhà mình nên nói thật với nhau. Cho vào cột Start ạ."', fx: { uy: 15, rel: { hang: 2, hung: 2, tuan: 1, son: 1 }, set: { truth_out: true, noble: true } }, then: [
      ['nar', 'War Room im phăng phắc. Anh Sơn từ từ dán một sticky note vàng lên cột Start.'],
      ['hang', '…Con mới vào bốn ngày mà nói được câu đó.'],
      ['tuan', '…Không ai phải bị trừ lương cả. Là con. Con lấy, để trả anh Sơn. Con xin lỗi bố mẹ.'],
      ['hung', 'Thằng này…'],
      ['nar', 'Bác Hùng rút khăn tay. Bác bảo do khói nhang.'],
    ] },
  ] },
  // --- Dũng arc ---
  { if: (s) => s.flags.dung_join && s.flags.file_sent, then: [
    ['dung', 'Nhân tiện. Cột "Stop" của tôi: Stop làm ở đây. Tôi nghỉ. Từ hôm nay.'],
    ['hung', 'Dũng…'],
    ['dung', 'Mười lăm năm. Không ai trong phòng này từng hỏi tôi muốn gì.'],
    ['nar', 'Anh Dũng nhìn bạn. Một cái nhìn có nghĩa: "Đi không?"'],
    { c: 'd5_dung', o: [
      { t: 'Đứng dậy, đi theo anh Dũng.', fx: { dr: 10, set: { leave_with_dung: true } }, then: [['nar', 'Bạn đứng dậy. Ngân há hốc mồm. Mèo KPI nhảy theo hai bước, rồi quay lại.']] },
      { t: 'Ngồi yên. Ở lại.', fx: { rel: { dung: -2 } }, then: [['dung', 'Tùy em.'], ['nar', 'Cửa War Room đóng lại. Cái bàn dài bỗng có vẻ trống trải.']] },
    ] },
  ], else: [
    { if: (s) => s.flags.dung_talk || s.flags.advice_hung, then: [
      ['hung', 'Còn một chuyện. Dũng.'],
      ['dung', 'Dạ?'],
      ['hung', 'Anh… cảm ơn em. Mười lăm năm. Anh chưa nói câu đó bao giờ.'],
      ['hung', 'Từ tháng sau, công ty đổi tên: "Ba Mẹ & Dũng & Partners". Em làm Partner. Partner thật, viết hoa.'],
      ['tuan', 'WAIT. Tên dài quá bố ơi, logo không vừa—'],
      ['hang', 'Con im.'],
      ['nar', 'Anh Dũng không nói gì. Anh mở Teams, đổi avatar từ ngọn núi về lại ảnh cả công ty chụp Tết 2015.'],
      { fx: { set: { dung_stays: true }, rel: { dung: 2 } } },
    ], else: [
      ['dung', 'Cột "Stop" của tôi: Stop làm ở đây. Tôi xin nghỉ cuối tháng.'],
      ['nar', 'Không ai giữ. Bác Hùng gật đầu, như đã biết từ lâu. Người sắp đi hay đổi ảnh ngọn núi.'],
    ] },
  ] },
  ['vy', 'Dạ… và giờ là phần cuối: kết quả thực tập ạ.'],
  ['nar', 'Chị Vy mở phong bì. Ngân nắm chặt tay. Chú Bảy ngừng chơi cờ tướng. Mèo KPI ngừng liếm chân.'],
];

// No game over: every ending closes this company's chapter and points to where the career goes next.
export const ENDINGS = {
  fired: { idx: 0, emoji: '📦', title: '"Not a culture fit" · Ôm thùng carton đi tiếp',
    text: (s) => `Drama của bạn: ${s.st.dr}/100. Bạn trở thành case study mà chị Mai sẽ kể cho mọi intern khóa sau.\n\nBạn ôm thùng carton bước ra cửa. Chú Bảy không nhìn bạn. Nhưng Mèo KPI đi theo tới tận thang máy.\n\nLesson learned: ở công ty gia đình, tin đồn chạy nhanh hơn Exciter. Không sao. LinkedIn của bạn vừa có thêm một dòng "Open to work".`,
    next: 'Một công ty mới đang tuyển intern… và nghe nói ở đó còn drama hơn.' },
  dung: { idx: 1, emoji: '🕴️', title: 'Spin-off cùng anh Dũng',
    text: () => 'Hai tuần sau, "Dũng & Associates" ra đời trong một co-working space 12m². Bạn là Senior Analyst, kiêm lễ tân, kiêm sale, kiêm IT.\n\nBạn chợt hiểu chị Vy.\n\nNgày khai trương, anh Dũng lặng lẽ đặt lên bàn… một bàn thờ Thần Tài nhỏ.',
    next: 'Công ty tiếp theo: Dũng & Associates, startup 2 người. Đối thủ: Ba Mẹ & Partners.' },
  tu: { idx: 2, emoji: '🍵', title: 'Silent Partner\'s Apprentice · ENDING BÍ MẬT',
    text: () => 'Chiều thứ Sáu, cô Tư gọi bạn ra pantry, rót cho bạn một chén trà.\n\n"Năm 1998, anh Hùng mượn cô 200 triệu mở công ty. Cô giữ 30% cổ phần. Cả nhà này không ai biết, trừ anh ấy."\n\n"Cô cần một người biết nghe, biết im, và biết góp tiền cơm. Từ thứ Hai, con làm trợ lý… của cô."\n\nBạn được convert. Không ai trong công ty hiểu vì sao.',
    next: 'Chương tiếp theo ở Ba Mẹ & Partners: cuộc chiến kế nghiệp, và bạn cầm lá phiếu của cô Tư.' },
  tuan: { idx: 3, emoji: '🚀', title: 'Co-founder Innovation Lab của Kevin',
    text: () => 'Bác Hùng cho Kevin sáu tháng và một budget nhỏ (lần này có chữ ký duyệt của cô Hằng) để mở "BM&P Innovation Lab".\n\nBạn là thành viên đầu tiên. Anh Sơn được ký hợp đồng thật. Video đầu tiên: "POV: bạn là intern ở công ty tư vấn gia đình" đạt 1,2 triệu view.\n\nCô Hằng vào comment: "Mẹ đây".',
    next: 'Chương tiếp theo: dự án Trà Sữa Tâm Trạng, chạy theo kiểu Kevin. Sprint 1 bắt đầu thứ Hai.' },
  ngan: { idx: 4, emoji: '🤝', title: 'Hai intern cùng ở lại',
    text: () => 'Bạn đứng lên propose: Ngân làm Design Lead, bạn làm Analyst. Công ty đi tư vấn chuyển đổi số thì cần cả hai.\n\nCô Hằng định phản đối, nhưng template slide của Ngân đẹp quá. Bác Hùng xem tuổi: "Hai đứa tam hợp!" (không phải).\n\nCả hai được convert. Tối đó, Ngân nói với mẹ: "Con làm designer." Mẹ Ngân… vẫn cho về ăn cơm.',
    next: 'Chương tiếp theo: bạn và Ngân làm dự án đầu tay. Mẹ Ngân bắt đầu ghé văn phòng "thăm con".' },
  staff: { idx: 5, emoji: '🏠', title: 'Business Analyst chính thức (và con nuôi)',
    text: () => 'Chị Vy đọc tên bạn. Cô Hằng gật đầu. Bác Hùng nói: "Con có tướng làm Partner." (Ai cũng biết câu đó không có nghĩa gì.)\n\nBạn được add vào group Teams thứ hai: "BM&P Family Only 🔒", nơi drama thật sự diễn ra.\n\nWelcome home.',
    next: 'Chương tiếp theo: group "Family Only" có 400 tin nhắn chưa đọc. Và Big4 vừa nhắn LinkedIn cho bạn.' },
  extend: { idx: 6, emoji: '⏳', title: 'Gia hạn intern thêm 3 tháng',
    text: () => '"Công ty đánh giá rất cao potential của em," chị Vy nói. Nghĩa là: chưa.\n\nNgân được convert. Bạn được thêm ba tháng thực tập, một chiếc ghế hướng Tây, và vô số chuyện để kể.',
    next: 'Ba tháng nữa ở Ba Mẹ & Partners… hoặc nộp CV chỗ khác. Lựa chọn là của bạn.' },
};

export function computeEnding(s) {
  const r = (k) => s.rel[k] || 0;
  if (s.flags.blamed_bay || s.st.dr >= 75) return 'fired';
  if (s.flags.leave_with_dung) return 'dung';
  if ((s.flags.silent || s.flags.tu_respect) && r('tu') >= 3 && s.st.dr < 50) return 'tu';
  if (s.flags.tuan_ally && s.flags.truth_out && r('tuan') >= 3) return 'tuan';
  if (s.flags.ngan_friend && r('ngan') >= 3 && s.st.uy >= 55) return 'ngan';
  if (s.st.uy >= 60) return 'staff';
  return 'extend';
}
