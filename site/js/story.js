// Story data for "Thực Tập Sinh" — first-person intern at a 10-person, very dramatic family company.
// Scene node formats:
//   ['speakerId', 'text']                      a line ('me' = player, 'think' = inner voice, 'nar' = narrator)
//   { c:'vote_id', o:[{ t, fx, then:[...], when:(s)=>bool }] }   a choice (vote_id is used for global stats)
//   { if:(s)=>bool, then:[...], else:[...] }   branch
//   { fx:{ uy, dr, nl, rel:{npc:n}, set:{flag:val} } }  effects
//   { chat:[[from, text, dm?], ...] }          phone messages (dm = private message)
//   { move:{ npcId:'spot' } }                  move NPCs

export const CHARS = {
  vy:   { name: 'Chị Vy',    role: 'HR · Admin · Cháu sếp',        emoji: '💁‍♀️', color: '#e86f9a', shirt: '#e86f9a', pants: '#2b2b3a', hair: 'long', hairColor: '#2b1b14' },
  phat: { name: 'Chú Phát',  role: 'Giám đốc · Người sáng lập',     emoji: '🧧', color: '#2d3a63', shirt: '#2d3a63', pants: '#23283d', hair: 'side', hairColor: '#a7a7a7', glasses: true, tie: '#b3242b' },
  hang: { name: 'Cô Hằng',   role: 'Kế toán trưởng · Vợ sếp',       emoji: '🧮', color: '#7b3f8c', shirt: '#7b3f8c', pants: '#2a1f2e', hair: 'bun', hairColor: '#1a1a1a', glasses: true },
  tuan: { name: 'Anh Tuấn',  role: 'Phó GĐ · Con trai sếp · "Kevin"', emoji: '🚀', color: '#169b84', shirt: '#169b84', pants: '#d8cfbd', hair: 'quiff', hairColor: '#3a2a20' },
  dung: { name: 'Anh Dũng',  role: 'Trưởng phòng Kinh doanh · 15 năm', emoji: '🕴️', color: '#56677a', shirt: '#56677a', pants: '#1d2229', hair: 'short', hairColor: '#111111' },
  mai:  { name: 'Chị Mai',   role: 'Sales · Trạm phát sóng',        emoji: '📢', color: '#e8932a', shirt: '#e8932a', pants: '#3b2a24', hair: 'long', hairColor: '#6a2f17' },
  khoa: { name: 'Anh Khoa',  role: 'IT · Kiêm sửa máy in',          emoji: '🖥️', color: '#3a3f47', shirt: '#3a3f47', pants: '#22252b', hair: 'cap', hairColor: '#c23b3b', glasses: true },
  tu:   { name: 'Cô Tư',     role: 'Tạp vụ · Quyền lực ngầm',       emoji: '🧹', color: '#4f8f5a', shirt: '#4f8f5a', pants: '#2c3b2e', hair: 'bun', hairColor: '#6b6b6b' },
  ngan: { name: 'Ngân',      role: 'Thực tập sinh #2 · Đối thủ?',   emoji: '🎨', color: '#5f9fdc', shirt: '#9cc6ee', pants: '#2b3a55', hair: 'pony', hairColor: '#1a1a1a' },
  bay:  { name: 'Chú Bảy',   role: 'Tài xế · Bảo vệ · Em họ sếp',   emoji: '🛵', color: '#2f6b3a', shirt: '#3f7a4a', pants: '#2b2b2b', hair: 'bald', hairColor: '#333333' },
};

// Where each NPC stands by default (spot names are defined in world.js)
export const DEFAULT_POS = {
  vy: 'reception', phat: 'phat', hang: 'hang', tuan: 'tuan', dung: 'dung',
  mai: 'mai', khoa: 'khoa', tu: 'tu', ngan: 'ngan', bay: 'bay',
};

export const STAT_LABEL = { uy: 'Uy tín', dr: 'Drama', nl: 'Năng lượng' };

export const FORTUNES = [
  'Quẻ hôm nay: "Im lặng là vàng. Nói nhiều là… bị trừ lương."',
  'Quẻ hôm nay: "Quý nhân phù trợ đang ở gần. Có thể là người nấu cơm."',
  'Quẻ hôm nay: "Tránh hướng Tây. Tránh luôn ghế đỏ."',
  'Quẻ hôm nay: "Tiền bạc lưu thông. Nhưng không phải tiền của bạn."',
  'Quẻ hôm nay: "Một tin nhắn bị thu hồi sẽ thay đổi tất cả."',
  'Quẻ hôm nay: "Đại cát. Trừ khi bạn mở Excel."',
  'Quẻ hôm nay: "Người hay cười nhất văn phòng biết nhiều nhất văn phòng."',
];

export const IDLE = {
  vy:   ['Em cần gì cứ hỏi chị nha. Trừ chuyện lương. Chuyện lương hỏi cô Hằng. Mà đừng hỏi cô Hằng.', 'Chị vừa in xong 40 tờ thông báo "Vui lòng không in màu". Bằng máy in màu.', 'Ở đây chị là HR, nhưng thật ra là "Họ hàng Relations".'],
  phat: ['Làm ăn quan trọng nhất là chữ Tín. Và chữ Tài. Và hướng ngồi.', 'Con có thấy cây kim tiền héo không? Chú thấy năng lượng phòng này hơi âm.', 'Hồi chú mở công ty, chỉ có chú, cô Hằng, và một cái nồi cơm điện. Giờ thì… vẫn vậy, nhưng nhiều nồi hơn.'],
  hang: ['Cô đang bận. Rất bận. Bận từ năm 1998.', 'Hóa đơn đỏ đâu? Ai lấy hóa đơn đỏ không trả?', 'Con ăn mặc gọn gàng. Tốt. Hôm qua Ngân mặc áo crop-top, cô suýt ngất.'],
  tuan: ['Bro, em có dùng Notion không? Anh muốn cả công ty dùng Notion. Bố anh dùng… sổ tay.', 'Anh đang build một cái dashboard. Chưa ai xem. Nhưng nó đẹp.', 'Synergy. Đó là thứ công ty này thiếu. Và wifi mạnh.'],
  dung: ['Ừ. Chào em.', 'Khách hàng lớn nhất của công ty là anh chăm từ 2011. Không ai nhớ.', 'Cà phê gói thôi em. Cà phê phin bị cắt từ 2020.'],
  mai:  ['Psst… em nghe gì mới chưa? Chưa hả? Từ từ chị tìm cái để kể.', 'Collagen nha em, uống vào da căng như hợp đồng lao động.', 'Chị không nhiều chuyện. Chị chỉ… cập nhật thông tin.'],
  khoa: ['…', 'Máy in lại kẹt. Lần thứ 4 trong ngày. Anh nghĩ nó ghét anh.', 'Đừng bấm vào link "Nhận quà Tết sớm" trong group. Chú Phát đã bấm rồi.'],
  tu:   ['Ăn chưa con?', 'Cô lau cái bàn này 23 năm rồi. Cô biết hết vết cà phê nào của ai.', 'Đừng có ngồi ghế đỏ nha con.'],
  ngan: ['Mình đang làm moodboard. Cô Hằng không biết moodboard là gì.', 'Cậu cũng thấy công ty này kỳ kỳ đúng không? Hay chỉ mình mình?', '…Chào.'],
  bay:  ['Chú đang chơi cờ tướng. Đừng nói chú ngủ nha.', 'Xe chú mua trả góp. Nói trước cho khỏi ai hỏi.', 'Hai mươi năm chở anh Phát. Chú biết đường tắt ra mọi rắc rối.'],
};

// ---------- Days ----------
export const DAYS = [
  // ============ DAY 1 ============
  {
    title: 'Thứ Hai',
    subtitle: 'Công ty là nhà',
    intro: '8:00 sáng. Bạn đứng trước cửa Công ty TNHH Thương mại Phát Đạt Lộc: 10 nhân viên, 23 năm tuổi, chuyên phân phối nồi cơm điện và "các giải pháp gia dụng toàn diện".\n\nJD ghi: "Thực tập sinh Marketing. Môi trường trẻ trung, năng động, như một gia đình."\n\nBạn chưa biết câu cuối là một lời cảnh báo.',
    pos: {},
    steps: [
      {
        who: 'vy', obj: 'Gặp chị Vy ở quầy lễ tân để nhận việc', time: '08:05',
        scene: [
          ['vy', 'Ơ, em là {ten} đúng không? Chị là Vy, HR. Kiêm admin. Kiêm marketing. Kiêm lễ tân. Kiêm đi lấy hàng nếu chú Bảy ngủ quên.'],
          ['vy', 'Chào mừng em tới Phát Đạt Lộc! Ở đây mình như một gia đình. Theo nghĩa đen luôn á.'],
          ['think', 'Theo nghĩa đen là sao…?'],
          ['vy', 'Giám đốc là chú Phát, chú ruột chị. Kế toán trưởng là cô Hằng, vợ chú. Phó giám đốc là anh Tuấn, con trai chú. Chú Bảy tài xế là em họ chú. Cô Tư tạp vụ là chị họ cô Hằng.'],
          ['vy', 'Người ngoài thì có anh Dũng, chị Mai, anh Khoa. Và em. Và… Ngân.'],
          { c: 'd1_vy', o: [
            { t: 'Ngân là ai vậy chị?', fx: { dr: 3 }, then: [
              ['vy', 'Thực tập sinh thứ hai, vào cùng ngày với em. Công ty có… đúng một suất nhân viên chính thức cuối tuần này 🙂'],
            ] },
            { t: 'Dạ em hiểu rồi, em sẽ cố gắng hết sức ạ!', fx: { uy: 3, rel: { vy: 1 } }, then: [
              ['vy', 'Thái độ tốt! Giữ nha. À mà, nói trước cho em đỡ sốc: Ngân, thực tập sinh còn lại, vào cùng ngày với em. Và công ty chỉ có một suất chính thức 🙂'],
            ] },
            { t: '"Như một gia đình" có phải là red flag không chị?', fx: { dr: 5, rel: { vy: 1 } }, then: [
              ['vy', '…Chị không được phép trả lời câu đó. Nhưng chị cười, em hiểu mà.'],
              ['vy', 'Nhân tiện: Ngân, thực tập sinh còn lại, vào cùng ngày với em. Một suất chính thức. Hai người. Chúc may mắn!'],
            ] },
          ] },
          ['vy', 'À, Ngân là con gái bạn thân cô Hằng. Nhưng chị tin là mọi thứ sẽ công bằng! …Chắc vậy.'],
          ['vy', 'Việc đầu tiên: qua góc IT gặp anh Khoa lấy laptop. Rồi lên phòng chào chú Phát. Gặp cô Hằng thì chào cô trước, không thì… thôi chị không nói đâu.'],
          { chat: [['vy', 'Cả nhà ơi, chào mừng TTS mới {ten} ạ 🎉🎉'], ['phat', '🙏🌸 Chào con. Chúc con năm mới an khang thịnh vượng'], ['mai', 'welcome emmm 😘 có gì ib chị nha'], ['tuan', 'Welcome onboard! Let\'s sync sometime 🚀'], ['khoa', '👍']] },
        ],
      },
      {
        who: 'khoa', obj: 'Lấy laptop ở góc IT của anh Khoa', time: '08:40',
        scene: [
          ['khoa', '…'],
          ['khoa', 'Laptop của em đây. Đời 2013. Pin giữ được 11 phút. Phím chữ "A" phải bấm mạnh.'],
          ['khoa', 'Wifi là PhatDatLoc@1975. Đừng đổi. Năm ngoái anh đổi, chú Phát bảo đổi pass là mất lộc, bắt anh đổi lại.'],
          { c: 'd1_laptop', o: [
            { t: 'Dạ em cảm ơn anh nhiều! Máy này nhìn… bền lắm ạ.', fx: { rel: { khoa: 2 } }, then: [
              ['khoa', 'Em là người đầu tiên cảm ơn anh trong ba năm.'],
              ['think', 'Anh Khoa trông như sắp khóc.'],
            ] },
            { t: 'Anh ơi máy này chạy được Canva không ạ?', fx: { nl: -5 }, then: [
              ['khoa', 'Được. Nếu em kiên nhẫn. Rất, rất kiên nhẫn.'],
            ] },
            { t: 'Sao Ngân được MacBook mới vậy anh?', fx: { dr: 6, set: { mac: true } }, then: [
              ['khoa', 'Cô Hằng duyệt. Hỏi cô Hằng.'],
              ['khoa', '…Mà thôi, đừng hỏi.'],
            ] },
          ] },
          ['khoa', 'À. Văn phòng có camera khắp nơi. Trừ chỗ bàn thờ Thần Tài. Chú Phát bảo Thần Tài cần riêng tư.'],
        ],
      },
      {
        who: 'phat', obj: 'Lên phòng Giám đốc chào chú Phát', time: '09:20',
        scene: [
          ['phat', 'À, thực tập sinh mới! Vào đi con, ngồi đi. Ấy ấy đừng ngồi ghế đó, ghế đó hướng Tây, kỵ.'],
          ['phat', 'Con tuổi gì?'],
          { c: 'd1_tuoi', o: [
            { t: 'Dạ con tuổi Mão ạ.', fx: { uy: 5, rel: { phat: 2 }, set: { tamhop: true } }, then: [
              ['phat', 'MÃO! Tốt! Chú tuổi Hợi. Hợi, Mão, Mùi: tam hợp! Thần Tài gửi con tới đây rồi.'],
            ] },
            { t: 'Dạ… sao chú hỏi vậy ạ?', fx: { uy: 2, rel: { phat: 1 } }, then: [
              ['phat', 'Tuyển người không xem tuổi thì xem gì? Xem CV à? CV ai mà chẳng ghi "chịu được áp lực cao".'],
            ] },
            { t: 'Dạ con không tin mấy cái đó lắm ạ.', fx: { uy: -3, dr: 5, rel: { phat: -1 } }, then: [
              ['nar', 'Chú Phát im lặng đúng ba giây. Đồng hồ treo tường tích tắc rất to.'],
              ['phat', '…Tuổi trẻ thì cứng. Không sao. Thần Tài sẽ dạy con.'],
            ] },
          ] },
          ['phat', 'Ở công ty này có ba điều. Một: sáng vào thắp hương Thần Tài. Hai: không cãi cô Hằng. Ba: thằng Tuấn nói gì về "chuyển đổi số" thì con cứ gật, rồi quên đi.'],
          ['phat', 'Thôi, rót cho chú chén trà rồi xuống làm việc. Trà Thái Nguyên, chín chục nghìn một lạng, rót cẩn thận.'],
          ['nar', 'Bạn rót trà. Tay hơi run. Một giọt rơi ra bàn. Chú Phát nhìn giọt trà như nhìn một điềm báo.'],
          { fx: { nl: -8 } },
        ],
      },
      {
        who: 'tu', obj: 'Giờ trưa! Qua pantry ăn cơm cô Tư nấu', time: '12:00',
        scene: [
          ['tu', 'Con mới vô hả? Ăn cơm đi con. Hôm nay canh chua cá lóc. Ai ăn thì góp 25 nghìn, ai không góp thì… cô nhớ.'],
          ['tu', 'Ngồi đâu cũng được, trừ cái ghế đỏ. Ghế cô Hằng. Năm 2019 có đứa ngồi, giờ nó đi bán bảo hiểm rồi.'],
          { c: 'd1_com', o: [
            { t: 'Dạ con góp 25 nghìn ạ. Thơm quá cô ơi!', fx: { nl: 25, rel: { tu: 2 } }, then: [
              ['tu', 'Ngoan. Cô múc cho con khúc giữa. Khúc giữa là khúc của người tử tế.'],
            ] },
            { t: 'Dạ con mang cơm hộp rồi ạ.', fx: { nl: 10, rel: { tu: -1 } }, then: [
              ['tu', 'Ừ… cơm hộp. Được.'],
              ['nar', 'Nhiệt độ phòng giảm hai độ.'],
            ] },
            { t: 'Cô ơi, ở đây ai… đáng sợ nhất ạ?', fx: { nl: 20, dr: 4, rel: { tu: 1 }, set: { tu_hint: true } }, then: [
              ['tu', 'Đáng sợ nhất là người mà không ai để ý tới, con à.'],
              ['nar', 'Cô Tư múc thêm cho bạn một muôi cá, không giải thích gì thêm.'],
            ] },
          ] },
          ['tu', 'Ăn đi. Ở đây ai cũng có chuyện. Con cứ ăn, cứ nghe, và đừng kể.'],
          { chat: [['hang', '🎤 Tin nhắn thoại (0:14)'], ['nar', 'Cô Hằng đã thu hồi một tin nhắn.'], ['mai', 'em thấy chưa 👀👀👀', true]] },
        ],
      },
      {
        who: 'mai', obj: 'Về chỗ ngồi. Chị Mai đang vẫy bạn rối rít', time: '14:00',
        scene: [
          ['mai', 'Emmmm qua đây chị nói nè! 👀'],
          ['mai', 'Đọc group chưa? Hồi trưa cô Hằng gửi nhầm voice vào group công ty. Thu hồi rồi nhưng chị nghe kịp.'],
          ['mai', 'Cô nói: "Anh Phát, con Ngân phải được nhận, em hứa với mẹ nó rồi." 😶'],
          ['think', '…Ồ.'],
          ['mai', 'Nhưng mà nha, anh Tuấn thì muốn nhận người biết làm TikTok. Còn anh Dũng thì nói "nhận ai cũng được, đằng nào cũng…" rồi ảnh im luôn. Lạ ha?'],
          { c: 'd1_mai', o: [
            { t: 'Chị Mai kể thêm đi chị!', fx: { dr: 10, rel: { mai: 2 } }, then: [
              ['mai', 'Ôi chị thích em rồi đó. Từ từ, drama công ty này dài như phim Hàn, 16 tập, chị kể dần.'],
            ] },
            { t: 'Thôi chị ơi, em lo làm việc đã.', fx: { uy: 3, rel: { mai: -1 } }, then: [
              ['mai', 'Ừ… ngoan ghê. Mà ngoan quá ở đây là thiệt đó em.'],
            ] },
            { t: 'Sao chị biết nhiều vậy?', fx: { rel: { mai: 1 }, dr: 3 }, then: [
              ['mai', 'Chị làm sales 12 năm. Nghề của chị là nghe. Mà đã nghe thì phải nghe cho hết chớ.'],
            ] },
          ] },
          ['mai', 'À mà em có mua collagen không, chị bán thêm, giá nội bộ…'],
        ],
      },
      {
        who: 'ngan', obj: 'Chào Ngân, thực tập sinh còn lại', time: '16:30',
        scene: [
          ['ngan', 'À. Chào. Mình là Ngân.'],
          ['ngan', 'MacBook này mẹ mình mua chứ không phải công ty đâu nhé. Đừng nghe ai nói gì.'],
          ['think', 'Mình chưa hỏi gì mà.'],
          ['ngan', 'Nói thẳng luôn: mình không muốn cạnh tranh. Nhưng mẹ mình thì… muốn rất nhiều.'],
          { c: 'd1_ngan', o: [
            { t: 'Vậy mình cùng cố gắng, công bằng nha!', fx: { uy: 2, rel: { ngan: 2 } }, then: [
              ['ngan', '…Ừ. Công bằng. Ở đây á?'],
              ['nar', 'Ngân cười. Lần đầu tiên trong ngày.'],
            ] },
            { t: 'Mình sẽ không nhường đâu.', fx: { dr: 5, rel: { ngan: -1 } }, then: [
              ['ngan', 'Tốt. Vậy đỡ khó xử.'],
            ] },
            { t: 'Thế bạn thật sự muốn làm gì?', fx: { rel: { ngan: 1 }, set: { ngan_dream: true } }, then: [
              ['ngan', '…Mình muốn làm designer. Nhưng "designer không phải là nghề". Mẹ mình nói vậy.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 1. Công ty có 10 người, 4 người là họ hàng, 1 bàn thờ Thần Tài, 1 suất chính thức.${s.flags.tamhop ? ' Mình tam hợp với sếp.' : ''} Mình vẫn còn sống.`,
  },

  // ============ DAY 2 ============
  {
    title: 'Thứ Ba',
    subtitle: 'Két sắt hụt 50 triệu',
    intro: '8:00. Văn phòng im lặng bất thường.\n\nCô Hằng đứng giữa phòng, tay cầm sổ quỹ. Két sắt phòng kế toán hụt đúng 50 triệu. Tối thứ Sáu vẫn đủ. Sáng nay thì không.\n\nKhông ai dám thở mạnh.',
    chatStart: [['hang', 'TẤT CẢ CÓ MẶT 8H15. KHÔNG AI ĐƯỢC VỀ.'], ['phat', 'Bình tĩnh em ơi 🙏'], ['hang', 'ANH IM.'], ['tuan', 'Mom, can we discuss this offline pls'], ['hang', 'TUẤN CŨNG IM.']],
    pos: {},
    steps: [
      {
        who: 'obj:altar', obj: 'Thắp hương bàn thờ Thần Tài (luật số 1 của chú Phát)', time: '08:10',
        scene: 'altar',
      },
      {
        who: 'hang', obj: 'Vào phòng Kế toán gặp cô Hằng', time: '08:30',
        scene: [
          ['hang', 'Con là đứa mới. Con chưa kịp ăn cắp gì. Nên cô tin con nhất.'],
          ['hang', 'Chìa két chỉ có cô, chú Phát… và cái chìa dự phòng trong ngăn kéo mà cả công ty đều biết.'],
          ['hang', 'Con giúp cô đối chiếu sổ quỹ được không? Không được nói với ai.'],
          { c: 'd2_help', o: [
            { t: 'Dạ được ạ, con giúp cô.', fx: { uy: 5, nl: -15, rel: { hang: 2 }, set: { hang_help: true } }, then: [
              ['hang', 'Tốt. Cô nhờ Ngân thì nó bảo "con đang bận làm moodboard". Moodboard là cái gì?'],
              ['nar', 'Bạn dò sổ quỹ hai tiếng. Chữ cô Hằng đẹp như thư pháp, nhưng số 1 và số 7 giống hệt nhau.'],
            ] },
            { t: 'Dạ con là thực tập marketing, chắc con không rành kế toán ạ…', fx: { rel: { hang: -1, tuan: 1 } }, then: [
              ['hang', 'Marketing. Ừ. Thằng Tuấn cũng hay nói câu đó y chang.'],
            ] },
            { t: 'Cô ơi… mình báo công an luôn không cô?', fx: { dr: 10, rel: { hang: -2 } }, then: [
              ['hang', 'BÁO CÔNG AN? Rồi công an tới, hàng xóm thấy, mất lộc ai chịu? Chuyện nhà thì xử trong nhà!'],
            ] },
          ] },
          ['hang', 'Đi đi. Mắt mở to vào.'],
        ],
      },
      {
        who: 'mai', obj: 'Chị Mai nhắn: "ra đây chị nói cái này 👀"', time: '10:15',
        scene: [
          ['mai', 'Chị cá 100% là chú Bảy. Tuần trước chú mới mua con Exciter mới cáu. Lương tài xế mà mua Exciter? Hỏi thật?'],
          ['mai', 'Em nói với cô Hằng giùm chị đi. Em là người mới, cô tin em.'],
          { c: 'd2_rumor', o: [
            { t: 'Ok, để em nói với cô Hằng.', fx: { dr: 15, rel: { mai: 1, bay: -2 }, set: { spread_bay: true } }, then: [
              ['nar', 'Bạn nói với cô Hằng. Cô Hằng không nói gì. Cô chỉ ghi chữ "BẢY" vào sổ, rồi gạch chân ba lần.'],
            ] },
            { t: 'Chưa có bằng chứng mà chị. Em không nói đâu.', fx: { uy: 5, rel: { mai: -1 } }, then: [
              ['mai', 'Hừ. Em nói chuyện giống chị Vy ghê. Mà thôi, chị tôn trọng.'],
            ] },
            { t: 'Để em ra hỏi thẳng chú Bảy.', fx: { dr: 5, set: { ask_bay: true } }, then: [
              ['mai', 'Gan! Chị thích! Hỏi xong nhớ kể chị nghe nha 😘'],
            ] },
          ] },
        ],
      },
      {
        who: 'bay', obj: 'Ra cửa gặp chú Bảy', time: '11:00',
        scene: [
          { if: (s) => s.flags.spread_bay, then: [
            ['bay', 'Con nói với cô Hằng là chú lấy tiền hả?'],
            ['bay', 'Chú làm cho anh Phát hai mươi năm. Xe chú mua trả góp 18 tháng, hợp đồng đây nè.'],
            ['nar', 'Chú Bảy chìa ra một tờ hợp đồng nhàu nát, gấp làm tám.'],
            ['bay', 'Thôi. Chú không giận. Người mới mà. Nhưng chú cũng không kể gì cho con đâu.'],
          ], else: [
            ['bay', 'Nghe nói người ta nghi chú hả? Kệ. Chú quen rồi. Cái gì mất trong công ty này, người đầu tiên bị nghi là chú. Năm ngoái mất cây bút bi, cũng nghi chú.'],
            ['bay', 'Chú kể con nghe cái này. Tối thứ Sáu chú về trễ, thấy thằng Tuấn từ phòng kế toán đi ra. Tay cầm phong bì.'],
            ['bay', 'Nó thấy chú, nó cười, nó nói: "Uncle Bảy, you didn\'t see anything ha."'],
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
        who: 'tuan', obj: 'Anh Tuấn mời bạn "sync nhanh 5 phút"', time: '14:30',
        scene: [
          ['tuan', 'Hey {ten}! Ngồi đi, beanbag đó ergonomic lắm. Let\'s sync nhanh 5 phút.'],
          ['tuan', 'Công ty này stuck ở năm 2005. Bố anh vẫn chốt đơn bằng điện thoại bàn. Mẹ anh ghi sổ bằng bút bi ba màu.'],
          ['tuan', 'Anh cần người làm TikTok cho brand mình. Content kiểu "Một ngày ở công ty gia đình". Viral chắc luôn. Nhưng… đừng nói với bố mẹ anh vội. Chưa phải lúc.'],
          { c: 'd2_tiktok', o: [
            { t: 'Em làm! Nhưng bí mật nha anh.', fx: { dr: 5, rel: { tuan: 2 }, set: { tuan_ally: true } }, then: [
              ['tuan', 'YES. That\'s the spirit! Mình sẽ là growth team đầu tiên của Phát Đạt Lộc. Team hai người. Lean.'],
            ] },
            { t: 'Em phải xin phép chú Phát trước ạ.', fx: { uy: 3, rel: { tuan: -1, phat: 1 } }, then: [
              ['tuan', 'Bố anh sẽ hỏi "TikTok là gì, có phải con của Facebook không". Nhưng ok. Respect.'],
            ] },
            { t: 'Anh Tuấn… tối thứ Sáu anh vào phòng kế toán làm gì vậy?', when: (s) => s.flags.clue_tuan, fx: { dr: 10, rel: { tuan: -1 }, set: { tuan_admitted: true } }, then: [
              ['tuan', '…'],
              ['tuan', 'Who told you that?'],
              ['tuan', 'Okay. Okay. Không phải như em nghĩ. Anh… mượn. Anh sẽ trả. Đừng nói với mẹ anh. Please.'],
            ] },
          ] },
          ['tuan', 'Anyway. Think about it. The future is now.'],
        ],
      },
    ],
    diary: (s) => `Ngày 2. Két sắt hụt 50 triệu. ${s.flags.spread_bay ? 'Mình đã chỉ tay vào chú Bảy. Mình không chắc mình đúng.' : s.flags.clue_tuan ? 'Chú Bảy thấy anh Tuấn cầm phong bì. Thú vị.' : 'Ai cũng nghi ai đó.'} Anh Tuấn nói "the future is now" ba lần.`,
  },

  // ============ DAY 3 ============
  {
    title: 'Thứ Tư',
    subtitle: 'Ai cũng có bí mật',
    intro: 'Ngày thứ ba. Vụ 50 triệu chưa có lời giải.\n\nCô Hằng đã đổi khóa két. Chú Phát mời thầy phong thủy tới "xem văn phòng có vong không". Cả văn phòng thơm mùi trầm.\n\nThầy phán: "Có người trong nhà đang giấu chuyện." Thầy nói đúng. Chỉ là không phải một người.',
    chatStart: [['phat', 'Thầy nói phải dời cây kim tiền sang góc Đông Nam. Khoa dời giùm chú.'], ['khoa', 'Dạ.'], ['mai', 'cây kim tiền héo rồi chú ơi 🥲'], ['phat', 'Héo là do năng lượng xấu. Ai làm cây héo?'], ['nar', '(Không ai trả lời.)']],
    pos: { ngan: 'pantry2', dung: 'window' },
    steps: [
      { who: 'obj:altar', obj: 'Thắp hương Thần Tài buổi sáng', time: '08:05', scene: 'altar' },
      {
        who: 'ngan', obj: 'Ngân đang ngồi một mình ở pantry… hình như đang khóc?', time: '08:45',
        scene: [
          ['ngan', 'Đừng nhìn. Mình không khóc. Hành phi của cô Tư cay mắt thôi.'],
          ['ngan', 'Mẹ mình vừa gọi. Mẹ bảo tuần này không được nhận chính thức thì "đừng về nhà ăn cơm". Nói đùa thôi. Chắc vậy.'],
          { if: (s) => s.flags.ngan_dream, then: [['ngan', 'Hôm qua cậu hỏi mình thật sự muốn làm gì. Chưa ai hỏi mình câu đó cả.']] },
          ['ngan', 'Mình có thiết kế lại logo công ty. Cho vui thôi. Không dám cho ai xem.'],
          ['nar', 'Ngân chìa điện thoại: một logo Phát Đạt Lộc tối giản, sạch sẽ, đẹp đến bất ngờ. Không có con rồng nào.'],
          { c: 'd3_ngan', o: [
            { t: 'Đẹp quá! Cậu nên cho anh Tuấn xem.', fx: { rel: { ngan: 2 }, set: { ngan_friend: true } }, then: [
              ['ngan', 'Thật hả? …Cảm ơn. Thật đấy.'],
            ] },
            { t: 'Ừm… cũng được. Nhưng mình nghĩ nên tập trung việc chính.', fx: { uy: 2, rel: { ngan: -1 } }, then: [
              ['ngan', 'Ừ. Biết mà.'],
              ['nar', 'Ngân cất điện thoại. Hành phi hình như cay hơn.'],
            ] },
            { t: 'Hay mình làm TikTok chung với anh Tuấn? Cậu lo hình ảnh!', when: (s) => s.flags.tuan_ally, fx: { dr: 5, rel: { ngan: 3, tuan: 1 }, set: { ngan_friend: true, ngan_team: true } }, then: [
              ['ngan', 'Khoan, công ty này có TikTok á? …Mình tham gia. Đừng nói mẹ mình.'],
              ['think', 'Sao ai ở đây cũng có một người không được nói vậy?'],
            ] },
          ] },
        ],
      },
      {
        who: 'khoa', obj: 'Anh Khoa gọi bạn qua góc IT (lạ ghê, anh ấy chưa gọi ai bao giờ)', time: '10:00',
        scene: [
          ['khoa', 'Lại đây. Nhỏ tiếng.'],
          ['khoa', 'Camera phòng kế toán tối thứ Sáu bị rút điện lúc 19:02. Người rút biết chính xác ổ cắm nằm đâu.'],
          ['khoa', 'Người biết chỗ ổ cắm: anh. Chú Phát. Và người lắp nó cùng anh năm 2019.'],
          ['me', 'Ai lắp vậy anh?'],
          ['khoa', 'Anh Tuấn. Hồi mới về nước, ảnh muốn làm "smart office". Rồi ảnh chán.'],
          { if: (s) => (s.rel.khoa || 0) >= 2, then: [['khoa', 'Anh kể em nghe vì em là người duy nhất cảm ơn anh.']], else: [['khoa', 'Anh kể em nghe vì không ai khác chịu nghe anh nói quá hai câu.']] },
          ['khoa', 'Còn một chuyện. Nếu em thấy anh với chị Vy đi ăn trưa chung… thì đừng nói ai nha. Cô Hằng đang định gả chị Vy cho con trai một đại lý nồi cơm điện ở Bình Dương.'],
          { c: 'd3_khoa', o: [
            { t: 'Em hứa. Chúc anh chị hạnh phúc!', fx: { rel: { khoa: 2, vy: 1 }, set: { keep_khoa: true } }, then: [
              ['khoa', '…Cảm ơn em.'],
              ['nar', 'Anh Khoa gần như mỉm cười. Gần như.'],
            ] },
            { t: 'Chị Mai biết chưa anh?', fx: { dr: 6, rel: { khoa: -1 } }, then: [
              ['khoa', 'Chị Mai mà biết thì cả quận biết.'],
              ['nar', 'Anh Khoa tái mặt.'],
            ] },
            { t: 'Anh cho em xem đoạn camera trước 19:02 được không?', fx: { dr: 4 }, then: [
              { if: (s) => (s.rel.khoa || 0) >= 1, then: [
                ['nar', 'Anh Khoa mở đoạn ghi hình. 19:00:41: một bóng người mặc hoodie xanh ngọc bước vào phòng kế toán, ôm theo cái túi laptop có in chữ "HUSTLE". 19:02: màn hình đen.'],
                ['khoa', 'Cả công ty chỉ có một người mặc hoodie xanh ngọc đi làm.'],
                { fx: { set: { cam_seen: true } } },
              ], else: [
                ['khoa', 'Chưa được. Anh chưa tin em tới mức đó.'],
              ] },
            ] },
          ] },
        ],
      },
      {
        who: 'dung', obj: 'Anh Dũng rủ bạn uống cà phê ở cửa sổ', time: '14:00',
        scene: [
          ['dung', 'Cà phê không? Cà phê gói thôi. Ngân sách cà phê phin bị cắt từ 2020.'],
          ['dung', 'Anh làm ở đây mười lăm năm. Mười lăm năm. Bảy mươi phần trăm khách hàng là anh mở. Rồi thằng Tuấn đi Úc về, tự nhiên anh phải "report OKR" cho nó.'],
          ['dung', 'Nói thật: anh sắp ra riêng. Khách quen sẽ đi theo anh. Anh cần một người trẻ, biết làm online.'],
          ['dung', 'Em lấy giúp anh file "DS_KhachHang_FINAL_final2_moinhat.xlsx" trên ổ chung. Em mới vô, không ai nghi. Qua bên anh, lương gấp đôi.'],
          { c: 'd3_dung', o: [
            { t: 'Dạ… em đồng ý.', fx: { uy: -5, dr: 15, rel: { dung: 3 }, set: { dung_join: true } }, then: [
              ['dung', 'Tốt. Cuối tuần anh nhắn. Đừng lưu file trên máy công ty, thằng Khoa thấy hết.'],
            ] },
            { t: 'Em không làm vậy được anh ạ.', fx: { uy: 5, rel: { dung: -1 } }, then: [
              ['dung', 'Ừ. Anh hiểu. Em còn trẻ, còn tin vào… mấy thứ này.'],
              ['nar', 'Anh Dũng liếc về phía bàn thờ Thần Tài.'],
            ] },
            { t: 'Để em suy nghĩ đã anh.', fx: { dr: 5, set: { dung_maybe: true } }, then: [
              ['dung', 'Nghĩ nhanh. Thứ Sáu là họp tổng kết rồi.'],
            ] },
          ] },
        ],
      },
      {
        who: 'phat', obj: 'Chú Phát gọi bạn lên phòng', time: '16:00',
        scene: [
          ['phat', 'Con ngồi đi. Không, ghế kia. Ừ.'],
          ['phat', 'Thầy phong thủy nói trong nhà có người giấu chuyện. Chú hỏi con, con mới vào, con nhìn khách quan: thằng Dũng dạo này sao?'],
          { c: 'd3_phat', o: [
            { t: 'Dạ, anh Dũng hơi… lạ ạ.', fx: { dr: 6, rel: { phat: 1, dung: -1 }, set: { hint_phat: true } }, then: [
              ['phat', 'Lạ. Ừ. Chú cũng thấy nó lạ. Nó đổi hình đại diện Zalo thành ảnh ngọn núi. Người sắp đi hay đổi ảnh ngọn núi.'],
            ] },
            { t: 'Dạ con không để ý ạ.', then: [
              ['phat', 'Ừ. Con khôn. Ở đây không để ý là một kỹ năng.'],
            ] },
            { t: 'Chú nên nói chuyện với anh Dũng nhiều hơn ạ. Anh ấy thấy mình không được ghi nhận.', fx: { uy: 5, rel: { phat: 1, dung: 1 }, set: { advice_phat: true } }, then: [
              ['phat', '…Ghi nhận. Chú tưởng trả lương đầy đủ là ghi nhận rồi.'],
              ['nar', 'Chú Phát im lặng rất lâu, nhìn ra cửa kính về phía bàn anh Dũng.'],
            ] },
          ] },
          ['phat', 'Thôi, con xuống đi. Nhớ mai thắp hương.'],
        ],
      },
    ],
    diary: (s) => `Ngày 3. Ai cũng có bí mật: Ngân, anh Khoa, chị Vy, anh Dũng${s.flags.cam_seen ? ', và một cái hoodie xanh ngọc' : ''}. ${s.flags.dung_join ? 'Mình vừa nhận lời một việc mà mình không dám ghi vào nhật ký.' : 'Mình bắt đầu hiểu vì sao chị Mai biết nhiều thế.'}`,
  },

  // ============ DAY 4 ============
  {
    title: 'Thứ Năm',
    subtitle: 'Mọi thứ bắt đầu vỡ ra',
    intro: 'Thứ Năm. Ngày mai là "Họp Gia Đình Mở Rộng", truyền thống cuối tháng của Phát Đạt Lộc. Ở buổi họp đó, mọi chuyện hoặc được nói ra, hoặc được chôn xuống.\n\nMai cũng là ngày công bố ai được nhận chính thức.',
    chatStart: [['vy', 'Nhắc cả nhà: mai 9h họp tổng kết tháng ở phòng họp nha. Cô Tư nấu xôi gấc ạ 🥰'], ['tu', '👍'], ['mai', 'xôi gấc là có biến 😳'], ['dung', '.'], ['nar', 'Anh Dũng đã rời nhóm.'], ['nar', 'Chú Phát đã thêm Anh Dũng vào nhóm.'], ['phat', 'Bấm nhầm hả con 🙏']],
    pos: { tu: 'tu' },
    steps: [
      {
        who: 'tu', obj: 'Cô Tư gọi: "Con lên pantry cô nhờ cái này"', time: '08:20',
        scene: [
          ['tu', 'Hôm qua cô lau sau tủ hồ sơ phòng kế toán, thấy cái này.'],
          { if: (s) => (s.rel.tu || 0) >= 2, then: [
            ['nar', 'Cô Tư đưa bạn một mẩu giấy gấp tư. Chữ viết tay, nghiêng nghiêng:\n"Mẹ, con mượn 50tr trả agency quảng cáo. Con sẽ trả trước ngày 30. Đừng nói bố. — T."'],
            ['tu', 'Cô đưa con vì con góp tiền cơm đầy đủ. Ở đời, người ta tin nhau từ mấy cái nhỏ vậy đó.'],
            { fx: { set: { note: true } } },
            ['tu', 'Con định làm gì với nó?'],
            { c: 'd4_note', o: [
              { t: 'Con đưa anh Tuấn, để anh tự nói ra.', fx: { rel: { tu: 1 }, set: { note_to_tuan: true } }, then: [
                ['tu', 'Ừ. Cho người ta cơ hội tự đứng dậy. Tốt.'],
              ] },
              { t: 'Con giữ lại. Mai họp rồi tính.', fx: { dr: 5 }, then: [
                ['tu', 'Giữ thì giữ cho kỹ. Giấy mỏng mà chuyện dày.'],
              ] },
              { t: 'Con trả lại cô. Con không muốn dính vào chuyện nhà người ta.', fx: { rel: { tu: 2 }, set: { note: false, tu_respect: true } }, then: [
                ['tu', '…Biết lúc nào không nên dính vào. Cái đó hiếm lắm, con à.'],
                ['nar', 'Cô Tư nhìn bạn lâu hơn bình thường, rồi cất mẩu giấy vào túi áo.'],
              ] },
            ] },
          ], else: [
            ['tu', '…Mà thôi. Cô đưa con Mai rồi. Nó hỏi trước.'],
            ['think', 'Tức là… cả quận sắp biết.'],
            { fx: { dr: 10, set: { note_mai: true } } },
          ] },
        ],
      },
      {
        who: 'tuan', obj: 'Tìm anh Tuấn', time: '09:30',
        scene: [
          { if: (s) => s.flags.note_to_tuan || s.flags.tuan_admitted || s.flags.cam_seen || s.flags.note_mai, then: [
            { if: (s) => s.flags.note_to_tuan, then: [['nar', 'Bạn đưa anh Tuấn mẩu giấy. Anh đọc. Mặt anh chuyển từ hồng sang trắng sang một màu chưa có tên.']] },
            { if: (s) => s.flags.note_mai && !s.flags.note_to_tuan, then: [['tuan', 'Chị Mai vừa nhìn anh và nói "Con ơi là con". Chị Mai chưa bao giờ gọi anh là con. Em biết gì không?']] },
            ['tuan', '…I\'m so screwed.'],
            ['tuan', 'Anh thuê agency chạy quảng cáo TikTok. Năm mươi triệu. Kết quả: ba đơn. Ba cái nồi cơm điện.'],
            ['tuan', 'Bố mẹ anh làm hai mươi ba năm. Anh chỉ muốn chứng minh là anh cũng làm được gì đó. Mà anh làm được… ba cái nồi.'],
            { c: 'd4_tuan', o: [
              { t: 'Mai họp, anh tự nói ra đi. Em ở đó với anh.', fx: { uy: 5, rel: { tuan: 2 }, set: { tuan_confess: true } }, then: [
                ['tuan', '…Okay. Okay. Anh sẽ nói. Nếu anh ngất, em đỡ anh nha.'],
              ] },
              { t: 'Em sẽ giữ bí mật cho anh.', fx: { dr: 6, rel: { tuan: 1 }, set: { tuan_hide: true } }, then: [
                ['tuan', 'You\'re a legend. Anh sẽ tìm cách trả lại trước khi mẹ phát hiện. Chắc vậy.'],
              ] },
              { t: 'Ba đơn cũng là có khách mua. Mình làm tiếp, rẻ hơn, khôn hơn.', fx: { rel: { tuan: 2 }, set: { tuan_hope: true } }, then: [
                ['tuan', 'Wait. Em nói đúng. Organic content. Không cần agency. Chỉ cần… một câu chuyện thật.'],
                ['tuan', 'Một công ty gia đình mười người, toàn drama. Ai mà không xem?'],
              ] },
            ] },
          ], else: [
            ['tuan', 'Hey. Mẹ anh đang điều tra như phim CSI. Hôm qua mẹ hỏi anh "Con có thấy phong bì nào màu trắng không". Em có nghe gì không?'],
            { c: 'd4_tuan2', o: [
              { t: 'Em không biết gì đâu anh.', then: [['tuan', 'Good. Good. Ý anh là… đáng tiếc. Hy vọng mọi chuyện được làm rõ.']] },
              { t: 'Hình như anh đang lo hơi nhiều đó anh.', fx: { dr: 4, rel: { tuan: -1 } }, then: [['tuan', 'Anh? Lo? No. Anh chill. Anh rất chill.'], ['nar', 'Anh Tuấn uống một ngụm cà phê. Từ cái cốc rỗng.']] },
            ] },
          ] },
        ],
      },
      {
        who: 'mai', obj: 'Có tiếng ồn lớn ở bàn chị Mai…', time: '11:00',
        scene: [
          ['nar', 'Chị Mai đang livestream bán collagen, điện thoại gắn trên giá ba chân. 2.143 người đang xem.'],
          ['mai', 'Các chị ơi collagen này uống vào là da căng như— ủa.'],
          ['nar', 'Chú Phát đứng ngay sau lưng chị Mai. Trong khung hình. Comment chạy ào ào: "chú kia là ai", "chú đẹp lão quá", "chú bán gì thế ạ".'],
          ['phat', 'Cái gì đây?'],
          { c: 'd4_live', o: [
            { t: 'Cứu chị Mai: "Dạ đây là livestream quảng bá nồi cơm điện công ty ạ!"', fx: { uy: 5, rel: { mai: 3, phat: 1 }, set: { live_save: true } }, then: [
              ['nar', 'Chú Phát nhìn bạn. Nhìn điện thoại. Rồi chú bê một cái nồi cơm điện từ kho ra, đặt lên bàn, hắng giọng.'],
              ['phat', 'Bà con cô bác. Nồi cơm Phát Đạt Lộc. Hai mươi ba năm uy tín. Nấu cơm không khê. Ai mua chú tặng thêm cái muôi.'],
              ['nar', 'Ba mươi bảy đơn trong hai mươi phút.'],
              ['phat', 'Cái này… gọi là gì? Livestream à? Tuấn! Sao con không làm cái này?'],
              ['tuan', '(từ xa) BỐ, CON NÓI TỪ NĂM 2021 RỒI MÀ!'],
            ] },
            { t: 'Im lặng, lùi từ từ về chỗ.', fx: { rel: { mai: -1 } }, then: [
              ['nar', 'Chị Mai bị gọi lên phòng giám đốc. Livestream vẫn chạy. 2.143 người được nghe trọn vẹn bài giảng "Đạo đức nghề nghiệp" dài 14 phút.'],
            ] },
            { t: 'Quay lại toàn cảnh, đăng TikTok công ty!', when: (s) => s.flags.tuan_ally, fx: { dr: 10, rel: { tuan: 2, mai: 1 }, set: { viral: true } }, then: [
              ['nar', 'Video "Sếp bắt quả tang nhân viên livestream và cái kết" đạt 340 nghìn view sau ba tiếng. Kho báo hết hàng nồi cơm.'],
              ['tuan', '(nhắn riêng) BRO. BRO. BROOOO 🚀🚀🚀'],
              { chat: [['tuan', 'BRO. 340K VIEWS. Kho hết nồi rồi 😭🚀', true]] },
            ] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Chị Vy cần bạn nộp bản tự đánh giá', time: '14:30',
        scene: [
          ['vy', 'Mai họp xong là công bố. Chị phải nộp đánh giá hai đứa lên cô Hằng. Nói thật: form đánh giá do cô Hằng soạn, mục số một là "Hòa đồng với gia đình".'],
          ['vy', 'Em tự đánh giá đi: tuần này em đóng góp gì nhất?'],
          { c: 'd4_self', o: [
            { t: 'Em giúp cô Hằng đối chiếu sổ quỹ.', when: (s) => s.flags.hang_help, fx: { uy: 5, rel: { hang: 1 } }, then: [['vy', 'Ồ, điểm cộng to đó. Cô Hằng nhớ dai lắm, cả chuyện tốt lẫn chuyện xấu.']] },
            { t: 'Em đề xuất bán hàng online, livestream.', when: (s) => s.flags.live_save || s.flags.viral, fx: { uy: 6, rel: { tuan: 1 } }, then: [['vy', 'Ba mươi bảy cái nồi. Chú Phát kể với cả họ rồi.']] },
            { t: 'Em ăn cơm cô Tư đầy đủ.', fx: { rel: { tu: 1 } }, then: [['vy', 'Em cười đó hả? Thật ra mục đó quan trọng hơn em tưởng.']] },
            { t: 'Em… giữ được bí mật.', when: (s) => s.flags.keep_khoa, fx: { rel: { vy: 2 } }, then: [['vy', '…Anh Khoa kể em rồi hả?'], ['vy', 'Cảm ơn em. Chị sẽ viết thật đẹp.']] },
          ] },
          ['vy', 'Ok, chị ghi hết. Mai mặc đẹp nha, cô Hằng chấm điểm cả áo.'],
        ],
      },
      {
        who: 'dung', when: (s) => s.flags.dung_join || s.flags.dung_maybe, pos: { dung: 'window' },
        obj: 'Anh Dũng đứng chờ bạn ở cửa sổ', time: '16:45',
        scene: [
          ['dung', 'File đâu em?'],
          { c: 'd4_file', o: [
            { t: 'Em gửi anh rồi.', when: (s) => s.flags.dung_join, fx: { dr: 10, set: { file_sent: true } }, then: [['dung', 'Tốt. Mai sau buổi họp, mọi chuyện sẽ khác.']] },
            { t: 'Em đổi ý rồi anh. Em không làm.', fx: { uy: 3, rel: { dung: -2 }, set: { dung_join: false } }, then: [['dung', '…Được. Vậy mai em đừng ngạc nhiên.']] },
            { t: 'Anh ơi, anh nói thẳng với chú Phát đi. Mười lăm năm mà.', fx: { rel: { dung: 1 }, set: { dung_talk: true, dung_join: false } }, then: [
              ['dung', 'Nói gì? "Anh ơi em muốn được tôn trọng"? Ở đây chỉ người trong nhà mới được tôn trọng.'],
              ['nar', 'Nhưng anh không bỏ đi. Anh đứng nhìn ra cửa sổ rất lâu.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 4. ${s.flags.live_save ? 'Chú Phát bán 37 cái nồi trên livestream. ' : ''}${s.flags.viral ? 'Video của bọn mình lên 340K view. ' : ''}${s.flags.note ? 'Mình đang giữ một mẩu giấy có thể làm nổ tung một gia đình. ' : ''}Mai là ngày cuối. Mình mất ngủ.`,
  },

  // ============ DAY 5 ============
  {
    title: 'Thứ Sáu',
    subtitle: 'Họp Gia Đình Mở Rộng',
    intro: '9:00 sáng thứ Sáu. Phòng họp.\n\nXôi gấc. Mười một con người. Một cái bàn dài. Và hai mươi ba năm chuyện chưa nói.',
    chatStart: [['vy', 'Mọi người vào phòng họp nha ạ 🙏'], ['mai', 'chị mang bỏng ngô rồi 🍿', true]],
    pos: { phat: 'm_head', hang: 'm_n1', tuan: 'm_n2', vy: 'm_n3', khoa: 'm_n4', dung: 'm_n5', mai: 'm_s1', ngan: 'm_s2', tu: 'm_s4', bay: 'm_s5' },
    steps: [
      {
        who: 'obj:seat', obj: 'Vào phòng họp và ngồi vào ghế trống', time: '09:00',
        scene: 'meeting',
      },
    ],
    diary: () => '',
  },
];

// ---------- Special scenes ----------
export const MEETING = [
  ['phat', 'Rồi. Họp. Thứ nhất: tháng này doanh thu giảm 12%. Thầy phong thủy nói do cây kim tiền. Đã dời cây.'],
  { if: (s) => s.flags.live_save || s.flags.viral, then: [['vy', 'Dạ… nhưng hôm qua mình bán được thêm 37 nồi qua livestream ạ.'], ['phat', 'Ừ. Cái đó… cũng là do dời cây.']] },
  ['hang', 'Thứ hai: năm mươi triệu. Hôm nay phải ra lẽ. Ai biết gì thì nói. Không ai nói thì trừ lương cả công ty, chia đều. Mỗi người bốn triệu rưỡi.'],
  ['mai', 'Ủa, thực tập sinh cũng bị trừ hả cô?'],
  ['hang', 'Gia đình thì chia đều.'],
  { if: (s) => s.flags.spread_bay, then: [['hang', 'Hôm thứ Ba, {ten} có nói với cô là chú Bảy…'], ['nar', 'Chú Bảy nhìn xuống tờ hợp đồng trả góp gấp làm tám.']] },
  ['nar', 'Mọi ánh mắt quay về phía bạn: người mới, người duy nhất chưa có lý do gì để im lặng.'],
  { c: 'd5_money', o: [
    { t: 'Nói ra sự thật: anh Tuấn mượn tiền trả agency quảng cáo.', when: (s) => (s.flags.note || s.flags.tuan_admitted || s.flags.cam_seen || s.flags.clue_tuan) && !s.flags.tuan_confess, fx: { dr: 10, rel: { tuan: -2, hang: 1 }, set: { truth_out: true, exposed_tuan: true } }, then: [
      ['tuan', 'MOM. I can explain.'],
      ['phat', 'Con… lấy tiền của mẹ con… để mua quảng cáo?'],
      ['tuan', 'TikTok ads, bố! Ba đơn! Ba đơn thật!'],
      ['nar', 'Cô Hằng không la. Cô Hằng không khóc. Cô Hằng chỉ gấp sổ quỹ lại, rất chậm. Đó là điều đáng sợ nhất bạn từng thấy.'],
      { if: (s) => s.flags.live_save || s.flags.viral, then: [['mai', 'Nhưng mà cô ơi, hôm qua chú Phát lên livestream bán được 37 nồi đó! Online nó… có ăn thật mà cô!'], ['hang', '…'], ['hang', 'Tuấn. Tháng sau trả mẹ. Rồi mẹ cho con năm triệu, làm lại, có kế hoạch, có báo cáo. Bằng giấy.']] },
    ] },
    { t: 'Nhìn anh Tuấn, gật đầu: "Anh nói đi."', when: (s) => s.flags.tuan_confess, fx: { uy: 10, rel: { tuan: 2, hang: 1, phat: 1 }, set: { truth_out: true } }, then: [
      ['tuan', 'Bố. Mẹ. Con lấy năm mươi triệu. Con thuê agency chạy quảng cáo. Con muốn chứng minh con làm được gì đó cho công ty. Con xin lỗi.'],
      ['hang', 'Sao con không nói với mẹ?'],
      ['tuan', 'Vì mẹ sẽ nói "chuyện đó để bố con quyết". Và bố sẽ nói "để mẹ con quyết".'],
      ['phat', '…Bố có nói vậy hả?'],
      ['nar', 'Cả phòng đồng thanh: "CÓ."'],
      ['nar', 'Cô Hằng đứng dậy, đi vòng qua bàn, và ôm anh Tuấn. Chị Mai khóc. Chị Mai cũng đang livestream.'],
    ] },
    { t: 'Đổ cho chú Bảy: "Con nghĩ là chú Bảy ạ."', fx: { uy: -20, dr: 25, rel: { bay: -3, khoa: -1 }, set: { blamed_bay: true } }, then: [
      ['nar', 'Chú Bảy đứng dậy, không nói gì, đặt tờ hợp đồng trả góp lên bàn.'],
      ['khoa', 'Khoan. Tối thứ Sáu lúc 19 giờ, chú Bảy ngồi ở cổng. Camera cổng ghi rõ. Chú đang chơi cờ tướng. Và thua.'],
      ['nar', 'Mười cặp mắt quay sang bạn. Xôi gấc nguội dần.'],
    ] },
    { t: 'Im lặng.', fx: { rel: { tu: 2 }, set: { silent: true } }, then: [
      ['nar', 'Bạn im lặng. Mười giây. Hai mươi giây. Đồng hồ treo tường tích tắc rất to.'],
      ['tu', 'Thôi, ăn xôi đi. Tiền mất thì đã mất. Ai lấy thì người đó tự biết. Mà người tự biết thì sẽ tự trả.'],
      ['nar', 'Anh Tuấn nhìn bạn, gật đầu rất khẽ. Chiều hôm đó, một phong bì trắng xuất hiện lại trong két sắt.'],
    ] },
    { t: 'Đứng lên: "Con xin chịu trừ phần của con. Nhưng nhà mình nên nói chuyện với nhau thật lòng."', fx: { uy: 15, rel: { hang: 2, phat: 2, tuan: 1 }, set: { truth_out: true, noble: true } }, then: [
      ['nar', 'Phòng họp im phăng phắc.'],
      ['hang', '…Con mới vào bốn ngày mà nói được câu đó.'],
      ['tuan', '…Không ai phải bị trừ lương cả. Là con. Con lấy. Con xin lỗi bố mẹ.'],
      ['phat', 'Thằng này…'],
      ['nar', 'Chú Phát rút khăn tay. Chú bảo do khói nhang.'],
    ] },
  ] },
  // --- Dũng arc ---
  { if: (s) => s.flags.dung_join && s.flags.file_sent, then: [
    ['dung', 'Nhân tiện. Tôi xin nghỉ. Từ hôm nay.'],
    ['phat', 'Dũng…'],
    ['dung', 'Mười lăm năm. Không ai trong căn phòng này từng hỏi tôi muốn gì.'],
    ['nar', 'Anh Dũng nhìn bạn. Một cái nhìn có nghĩa: "Đi không?"'],
    { c: 'd5_dung', o: [
      { t: 'Đứng dậy, đi theo anh Dũng.', fx: { dr: 10, set: { leave_with_dung: true } }, then: [['nar', 'Bạn đứng dậy. Ngân há hốc mồm. Chị Mai không kịp livestream.']] },
      { t: 'Ngồi yên. Ở lại.', fx: { rel: { dung: -2 } }, then: [['dung', 'Tùy em.'], ['nar', 'Cửa phòng họp đóng lại. Cái bàn dài bỗng có vẻ trống trải.']] },
    ] },
  ], else: [
    { if: (s) => s.flags.dung_talk || s.flags.advice_phat, then: [
      ['phat', 'Còn chuyện nữa. Dũng.'],
      ['dung', 'Dạ?'],
      ['phat', 'Chú… à, anh… cảm ơn em. Mười lăm năm. Anh chưa nói câu đó bao giờ.'],
      ['phat', 'Từ tháng sau, em làm Giám đốc Kinh doanh. Thằng Tuấn báo cáo cho em.'],
      ['tuan', 'WHAT—'],
      ['hang', 'Con im.'],
      ['nar', 'Anh Dũng không nói gì. Anh lấy điện thoại ra, đổi ảnh đại diện Zalo từ ngọn núi về lại ảnh cả công ty chụp Tết 2015.'],
      { fx: { set: { dung_stays: true }, rel: { dung: 2 } } },
    ], else: [
      ['dung', 'Tôi cũng có chuyện. Tôi xin nghỉ cuối tháng.'],
      ['nar', 'Không ai giữ. Chú Phát gật đầu, như đã biết từ lâu. Người sắp đi hay đổi ảnh ngọn núi.'],
    ] },
  ] },
  ['vy', 'Dạ… và giờ là phần cuối: kết quả thực tập ạ.'],
  ['nar', 'Chị Vy mở phong bì. Ngân nắm chặt tay. Chú Bảy ngừng chơi cờ tướng.'],
];

export const ENDINGS = {
  fired: { idx: 0, emoji: '🔥', title: '"Em nghỉ đi, gia đình mình không hợp em"',
    text: (s) => `Drama của bạn: ${s.st.dr}/100. Bạn trở thành nhân vật chính trong câu chuyện mà chị Mai sẽ kể cho mọi thực tập sinh khóa sau.\n\nNgân được nhận. Chú Bảy vẫn ngồi ở cổng, và không nhìn bạn khi bạn bước ra.\n\nBài học: ở công ty gia đình, lời đồn đi nhanh hơn xe Exciter.` },
  dung: { idx: 1, emoji: '🕴️', title: 'Khởi nghiệp cùng anh Dũng',
    text: () => 'Hai tuần sau, "Công ty TNHH Dũng Tiến" ra đời trong một căn phòng 12m². Bạn là Trưởng phòng Marketing, kiêm lễ tân, kiêm sale, kiêm đi lấy hàng.\n\nBạn chợt hiểu chị Vy.\n\nNgày khai trương, anh Dũng lặng lẽ đặt lên bàn… một bàn thờ Thần Tài nhỏ.' },
  tu: { idx: 2, emoji: '🧹', title: 'Người kế nhiệm cô Tư · ENDING BÍ MẬT',
    text: () => 'Chiều thứ Sáu, cô Tư gọi bạn ra pantry, rót cho bạn một chén trà.\n\n"Năm 1998, chú Phát mượn cô 200 triệu mở công ty. Cô giữ 30% cổ phần. Cả nhà này không ai biết, trừ chú."\n\n"Cô cần một người biết nghe, biết im, và biết góp tiền cơm. Từ thứ Hai, con làm trợ lý… của cô."\n\nBạn được nhận chính thức. Không ai trong công ty hiểu vì sao.' },
  tuan: { idx: 3, emoji: '🚀', title: 'Co-founder bất đắc dĩ của "Kevin" Tuấn',
    text: () => 'Chú Phát cho anh Tuấn sáu tháng và một ngân sách nhỏ (lần này có chữ ký duyệt của cô Hằng) để mở mảng bán hàng online.\n\nBạn là thành viên đầu tiên của "growth team". Video đầu tiên: "POV: bạn là thực tập sinh ở công ty gia đình 10 người" đạt 1,2 triệu view.\n\nCô Hằng vào comment: "Mẹ đây".' },
  ngan: { idx: 4, emoji: '🤝', title: 'Hai thực tập sinh cùng ở lại',
    text: () => 'Bạn đứng lên đề xuất: Ngân làm thiết kế, bạn làm nội dung. Công ty cần cả hai.\n\nCô Hằng định phản đối, nhưng logo mới của Ngân đẹp quá. Chú Phát xem tuổi: "Hai đứa tam hợp!" (không phải).\n\nCả hai được nhận. Tối đó, Ngân nói với mẹ: "Con làm designer." Mẹ Ngân… vẫn cho về ăn cơm.' },
  staff: { idx: 5, emoji: '🏠', title: 'Nhân viên chính thức (và con nuôi)',
    text: () => 'Chị Vy đọc tên bạn. Cô Hằng gật đầu. Chú Phát nói: "Con có tướng giữ của."\n\nBạn được thêm vào nhóm Zalo thứ hai: "Phát Đạt Lộc — Gia Đình Thật Sự 🔒", nơi drama thật sự diễn ra.\n\nChào mừng về nhà.' },
  extend: { idx: 6, emoji: '⏳', title: 'Gia hạn thực tập thêm 3 tháng',
    text: () => '"Công ty đánh giá rất cao tiềm năng của em," chị Vy nói. Nghĩa là: chưa.\n\nNgân được nhận. Bạn được thêm ba tháng thực tập, một chiếc ghế hướng Tây, và vô số chuyện để kể.\n\nHẹn gặp lại sáng thứ Hai.' },
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
