// Trend Trễ Agency — side tasks, Friday review lines, the one promotion path + official arc, endings, food, life events.

const f = (k) => (r) => !!r.flags[k];
const A_COUNT = (r) => (r.reviews || []).filter((x) => x.grade === 'A').length;
const IDEA_FLAGS = ['insight_real', 'stopmotion', 'pitch_idea_mine', 'apology_good', 'bin_merge', 'statement_ok'];

// ---------- side tasks ----------
export const SIDE_TASKS = [
  { id: 'resize', title: 'Nhờ Vỹ resize KV ra 27 kích thước cho anh Lộc', from: 'loc', base: 80, legs: [
    { npc: 'loc', line: ['loc', 'Em nhờ Vỹ resize KV ra 27 size giúp anh. Banner, story, cover, cả cái size lạ của app giao đồ ăn.'] },
    { npc: 'vy', line: ['vy', '27 size? …Ok. Size 27 là size "client sẽ đổi ý". Anh làm sẵn rồi. Gửi đi.'] },
    { npc: 'loc', line: ['loc', 'Đủ 27. Giờ chỉ còn đợi CPM bớt cao.'] },
  ] },
  { id: 'print_deck', title: 'In deck 20 trang màu cho chị Diệp đi gặp client', from: 'diep', base: 60, legs: [
    { npc: 'diep', line: ['diep', 'Em in giùm chị deck 20 trang, màu, hai bản. Chị đi gặp client lúc 15:00.'] },
    { obj: 'printer', line: ['nar', 'Máy in đòi mật khẩu. Tờ giấy dán: "TrendTre2016". Trang 7 ra màu cam. Bạn in lại trang 7.'] },
    { npc: 'diep', line: ['diep', 'Hai bản, đủ trang, không cam. Em là người hùng thầm lặng của ngành in ấn.'] },
  ] },
  { id: 'sample', title: 'Lấy 2 thùng mì sample ở pantry cho anh Phát quay', from: 'phat', base: 70, legs: [
    { npc: 'phat', line: ['phat', 'Anh cần hai thùng mì sample làm đạo cụ. Ở pantry, dưới gầm bàn. Đừng để ai ăn mất.'] },
    { obj: 'coffee', line: ['nar', 'Còn đúng hai thùng. Một thùng đã bị khui. Có tờ giấy: "Mượn 1 gói. Sẽ trả. – Vỹ, 2:14 sáng".'] },
    { npc: 'phat', line: ['phat', 'Thùng khui thì quay mặt sau. Production là nghệ thuật giấu thùng khui.'] },
  ] },
  { id: 'screenshot', title: 'Xin Sương ảnh chụp màn hình 12 bài đăng, đưa chị Hồng nghiệm thu', from: 'hong', base: 90, legs: [
    { npc: 'hong', line: ['hong', 'Chị cần ảnh chụp 12 bài đăng tháng này, có ngày giờ. Sương giữ. Không ảnh, không hóa đơn.'] },
    { npc: 'suong', line: ['suong', '12 ảnh đây. Bài số 7 bị admin client xóa nhầm, chị chụp kịp trước đó. Chị luôn chụp kịp.'] },
    { npc: 'hong', line: ['hong', 'Đủ 12. Lương tháng sau của mọi người vừa nhích thêm một bước.'] },
  ] },
  { id: 'kol_sign', title: 'Xin chữ ký anh Tùng trên hợp đồng KOL cho chị Kiều', from: 'kieu', base: 70, legs: [
    { npc: 'kieu', line: ['kieu', 'Em xin chữ ký anh Tùng vào hợp đồng KOL này giúp chị. Đừng để ảnh đọc trang 3.'] },
    { npc: 'tung', line: ['tung', 'Ký đâu? Đây hả? …Trang 3 ghi gì vậy? Thôi kệ, ký. Make it official!'] },
    { npc: 'kieu', line: ['kieu', 'Cảm ơn em. Trang 3 là "phí quản lý". Bình thường thôi. Đừng hỏi.'] },
  ] },
  { id: 'coffee_khai', title: 'Pha cà phê đen không đường cho anh Khải trước internal review', from: 'thi', base: 50, legs: [
    { npc: 'thi', line: ['thi', 'Anh Khải sắp review ý tưởng. Pha giúp mình ly cà phê đen không đường. Anh ấy dịu hơn 12% khi có cà phê.'] },
    { obj: 'coffee', line: ['nar', 'Pantry chỉ có cà phê 3in1. Bạn lọc bỏ phần đường bằng… niềm tin. Không được. Bạn pha ly 3in1 đậm nhất có thể.'] },
    { npc: 'khai', line: ['khai', 'Ngọt. Chưa đủ đau. Nhưng cảm ơn.'] },
  ] },
  { id: 'font_license', title: 'Hỏi Vỹ font trong KV có bản quyền chưa, báo chị Diệp', from: 'diep', base: 80, legs: [
    { npc: 'diep', line: ['diep', 'Client hỏi font trong KV có bản quyền thương mại chưa. Em hỏi Vỹ giúp chị.'] },
    { npc: 'vy', line: ['vy', 'Có. Anh mua rồi. 1 trong 47 font anh có hóa đơn. Hóa đơn tên là "font_bill_THAT.pdf".'] },
    { npc: 'diep', line: ['diep', 'Có hóa đơn. Lần đầu tiên chị được trả lời "có" về bản quyền mà không phải đợi.'] },
  ] },
  { id: 'caption_check', title: 'Nhờ Thi đọc to 6 caption của Sương', from: 'suong', base: 60, legs: [
    { npc: 'suong', line: ['suong', 'Mang 6 caption này qua Thi đọc to giúp chị. Đọc to lên mới thấy chỗ vấp.'] },
    { npc: 'thi', line: ['thi', '(đọc to) …Câu 4 vấp ở chữ "trải nghiệm trọn vẹn". Không ai nói chữ đó ngoài đời. Đổi thành "ngon".'] },
    { npc: 'suong', line: ['suong', '"Ngon." Ngắn hơn, thật hơn. Đăng!'] },
  ] },
  { id: 'po_chase', title: 'Hỏi chị Hồng PO Sen Hồng về chưa, báo chị Diệp', from: 'diep', base: 90, legs: [
    { npc: 'diep', line: ['diep', 'Em hỏi chị Hồng PO của Sen Hồng về chưa giúp chị. Chưa có PO thì đừng làm. (Mình vẫn làm.)'] },
    { npc: 'hong', line: ['hong', 'PO về rồi. Ghi ngày tháng trước. Nghĩa là mình đã làm "trước PO" nguyên một tháng. Như mọi khi.'] },
    { npc: 'diep', line: ['diep', 'Có PO. Chị ngủ ngon được một đêm.'] },
  ] },
  { id: 'ringlight', title: 'Mượn anh Phát cái ringlight cho Linh quay TikTok brand', from: 'linh', base: 60, legs: [
    { npc: 'linh', line: ['linh', 'Bạn mượn giúp mình cái ringlight của anh Phát nha. Mình quay TikTok cho Trà Sữa. Mẹ mình nói ánh sáng là tất cả.'] },
    { npc: 'phat', line: ['phat', 'Mượn được. Trả trước 17:00. Cái ringlight này quay ba TVC, hai livestream và một đám cưới.'] },
    { npc: 'linh', line: ['linh', 'Wow, đẹp ghê. Mặt mình tròn như mặt trăng. Đúng mood.'] },
  ] },
  { id: 'framework_print', title: 'In ma trận 2x2 khổ A3 cho anh Quân', from: 'quan', base: 70, legs: [
    { npc: 'quan', line: ['quan', 'In giúp anh ma trận 2x2 khổ A3. Anh muốn dán ở bàn. Nhìn nó anh thấy bình yên.'] },
    { obj: 'printer', line: ['nar', 'Máy in in ra ma trận 2x2. Rồi in thêm một bản 3x3 mà không ai bấm. Máy in cũng có framework riêng.'] },
    { npc: 'quan', line: ['quan', 'Hai bản? Ồ. 3x3. Máy in này có tư duy chiến lược.'] },
  ] },
  { id: 'altar', title: 'Thắp hương Thần Tài trước giờ trình client cho anh Tùng', from: 'tung', base: 50, legs: [
    { npc: 'tung', line: ['tung', 'Chiều nay trình client lớn. Em thắp giúp anh nén hương Thần Tài. Khấn: "cho client duyệt vòng 1".'] },
    { obj: 'altar', line: ['nar', 'Bạn thắp hương, khấn "cho client duyệt vòng 1". Rồi khấn thêm "hoặc vòng 2 cũng được". Thực tế là quan trọng.'] },
    { npc: 'tung', line: ['tung', 'Khấn vòng 1 hả? Tham vọng! Anh thích!'] },
  ] },
];

// ---------- Friday review (manager: Chị Diệp, Account Manager) ----------
export const REVIEW = {
  A: [
    'Tuần này em làm tốt. Client nhắc tên em trong email. Nhớ là client khen, không phải chị. Nhưng chị cũng khen.',
    'Em có tố chất account: ai chửi cũng cười, mà cười xong vẫn sửa đúng.',
    'Em không bao giờ để chị phải "em ơi" lần hai. Em biết điều đó hiếm cỡ nào không?',
    'Call report của em gọn tới mức client đọc xong không đổi ý. Chuyện chưa từng có.',
    'Chị không có feedback. Chị hơi hoảng. Thôi, feedback nhẹ: giữ vậy.',
    'Anh Khải nói em "tạm được". Đó là lời khen cao nhất anh ấy từng nói với một người còn sống.',
  ],
  B: [
    'Ổn. Ở agency, "ổn" nghĩa là tuần này không ai phải ra cầu thang vì em.',
    'Em làm nhanh lắm. Nhanh hơn cả lúc client đổi ý. Giờ làm đúng thêm chút nữa.',
    'Caption em viết đúng hết, chỉ chưa có hồn. Hồn thì từ từ, chính tả thì phải ngay.',
    'Deck em đẹp, 40 trang. Client cần 8. Lần sau cắt giùm chị.',
    'Em có insight, mà là insight của em, chưa phải của người tiêu dùng. Gần rồi.',
  ],
  C: [
    'Tuần này chị thấy em bận. Nhưng chị không thấy file nào em gửi đi.',
    'Em có đam mê. Đam mê thì công ty không trả thêm, nhưng việc trễ thì client trừ tiền.',
    'Em ghi call report kỹ quá, client đọc xong đổi ý luôn. Kỹ đúng chỗ thôi em.',
    'Chị không cần em thức tới sáng. Chị cần em gửi trước 15:00.',
    'Em làm tốt hơn intern năm ngoái. Intern năm ngoái nghỉ sau hai tuần. Đó không phải lời khen.',
  ],
  D: [
    'Em ơi… lần này không phải "em ơi" kiểu deadline. Là "em ơi" kiểu mình cần nói chuyện.',
    'Ba việc trễ trong một tuần. Client chưa phàn nàn, vì client chưa biết. Chị thì biết.',
    'Em biết từ chối, cái đó hiếm. Nhưng em từ chối nhầm người: là chị.',
    'Ý tưởng em táo bạo. Táo bạo tới mức tuần này không có gì gửi được.',
    'Chị sẽ ghi nhận. Theo kiểu timesheet: chính xác từng giờ em không có mặt.',
  ],
};

// ---------- promotion: the one way to become official ----------
// Two A weeks, day ≥ 26, high reputation, Chị Diệp trusts you, you called her at 23:07 during the crisis,
// at least two "real ideas" landed, and you never went public against your own team.
export const PROMOTION = {
  salary: 10_000_000,
  when: (r) => r.day >= 26 && A_COUNT(r) >= 2 && r.st.uy >= 70 && (r.rel.diep || 0) >= 6
    && !!r.flags.crisis_hero && IDEA_FLAGS.filter((k) => r.flags[k]).length >= 2
    && !r.flags.linkedin_rant && !r.flags.rant_post && !r.flags.crisis_nick,
  offer: [
    ['nar', 'Sau review, chị Diệp không đứng dậy. Anh Tùng mở cửa bước vào, tay cầm ly "POP".'],
    ['tung', 'Anh nói ngắn, theo kiểu agency: tụi anh muốn giữ em. Account Executive. Mười triệu. Hợp đồng lao động, có bảo hiểm.'],
    ['diep', 'Chị nói thêm phần anh Tùng không nói: em sẽ nhận client riêng. Client đó là Răng Xinh. Có anh Tuấn. Có Bin.'],
    { if: f('client_praised'), then: [['diep', 'Chị Nguyệt bên Ông Táo cũng hỏi tên em. Hai lần. Nên tụi chị phải giữ em trước khi client giữ.']] },
    ['think', 'Mười triệu. Có bảo hiểm. Và một con rồng.'],
    { c: '_ag_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, rel: { diep: 1, tung: 1 }, set: { accept_official: true } }, then: [
        ['tung', 'Welcome to the team! Chính thức! Make it pop!'],
        ['diep', 'Từ thứ Hai em không còn là intern. Nghĩa là "em ơi" lúc 23:00 sẽ là "em ơi" thật.'],
        ['nar', '(Lên chính thức: hợp đồng lao động, đóng BHXH, BHYT, BHTN. Thông tin giải trí, không phải tư vấn pháp lý.)'],
      ] },
      { t: '"Em xin làm trọn kỳ thực tập rồi tính ạ."', fx: { set: { accept_official: false } }, then: [
        ['tung', 'Ok… nhưng offer agency như trend vậy. Qua là qua.'],
        ['diep', 'Chị hiểu. Chị cũng từng ước mình nói được câu đó.'],
      ] },
    ] },
  ],
  arc: ['off_handover', 'off_scope', 'off_burnout', 'off_final'],
};

// ---------- official-only episodes (the honeymoon ends) ----------
export const OFFICIAL_EPISODES = [
  {
    id: 'off_handover', official: true, title: 'Client của em',
    intro: 'Ngày đầu chính thức. Bạn nhận bàn giao Răng Xinh từ bạn AE cũ (đã nghỉ, để lại file "BAN_GIAO.txt" dài đúng một dòng).\n\nKèm 14 nhóm Zalo. Và tin nhắn của anh Tuấn lúc 7:02: "Em ơi".',
    steps: [
      {
        who: 'diep', obj: 'Chị Diệp bàn giao Răng Xinh', time: '09:30',
        scene: [
          ['diep', 'File bàn giao của bạn AE cũ đây. Một dòng: "Chúc bạn may mắn. Đừng tin chữ cuối."'],
          ['diep', 'Răng Xinh: retainer 40 triệu/tháng, hợp đồng ghi 12 bài, thực tế 30. Anh Tuấn feedback bằng voice. Bin gửi "ý tưởng" mỗi tối.'],
          { c: 'ag_off_scope', o: [
            { t: 'Đọc lại hợp đồng, liệt kê việc ngoài phạm vi.', fx: { uy: 3, nl: -4, set: { off_scope_list: true } }, then: [
              ['diep', 'Mười tám việc ngoài phạm vi. Em vừa tìm ra lý do bạn AE cũ nghỉ.'],
            ] },
            { t: 'Cứ làm như bạn cũ, từ từ tính.', fx: { nl: -2, rel: { diep: 1 } }, then: [
              ['diep', 'Ừ. Từ từ. Ở đây "từ từ" kéo dài ba năm.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn: 14 nhóm Zalo, 312 tin chưa đọc', time: '11:00',
        scene: [
          ['nar', 'Nhóm "[Răng Xinh × Trend Trễ] Tết 2027": 47 thành viên. Sáu người bạn không biết là ai. Một người tên "Bin 🔥".'],
          ['nar', 'Bạn vừa gõ vào một nhóm: "anh Tuấn lại đổi ý rồi 🙄". Ngón tay đang đặt trên nút gửi.'],
          ['think', 'Khoan. Nhóm này… có chữ "NỘI BỘ" không? Mắt mình mỏi quá.'],
          { c: 'ag_off_group', o: [
            { t: 'Kiểm tra lại tên nhóm trước khi gửi.', fx: { uy: 2 }, then: [
              ['nar', 'Đúng là nhóm có client. Bạn xóa tin. Tim đập mất mười giây.'],
            ] },
            { t: 'Gửi luôn, mệt rồi.', fx: { dr: 5, rel: { tuan: -2 }, set: { off_wrong_group: true } }, then: [
              ['nar', 'Đó là nhóm có client. Anh Tuấn seen. Gõ "…". Rồi xóa. Rồi gõ "Ok em".'],
              ['think', '"Ok em" chưa bao giờ đáng sợ đến vậy.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:tuan', obj: 'Anh Tuấn gọi WIP tuần (nghe máy)', time: '14:00',
        call: { title: 'Răng Xinh · WIP tuần', people: ['tuan', 'bin', 'me'] },
        scene: [
          { if: f('off_wrong_group'), then: [['tuan', 'Em ơi, anh có đổi ý thật. Nhưng anh không thích bị nói sau lưng. Mà lại nói ngay trước mặt anh.']] },
          ['tuan', 'KV Tết: anh muốn trẻ hơn, nhưng sang hơn, nhưng gần gũi hơn. Bin có ý này.'],
          ['bin', 'Em nghĩ phải có rồng. Năm nay không phải năm rồng, nhưng rồng thì lúc nào cũng hot.'],
          { c: 'ag_off_dragon', o: [
            { t: 'Đề xuất: một con rồng làm bằng kem đánh răng, chỉ một khung hình cuối clip.', fx: { uy: 3, rel: { tuan: 2, bin: 2 } }, then: [
              ['bin', '…Rồng kem đánh răng! Em chịu!'],
              ['tuan', 'Chốt nha em. Lần đầu Bin chịu ý của người khác.'],
            ] },
            { t: '"Dạ không có rồng ạ."', fx: { uy: 1, rel: { tuan: -2 } }, then: [
              ['tuan', 'Ok em. Nhưng tuần sau anh hỏi lại. Và tuần sau nữa.'],
            ] },
          ] },
        ],
      },
      {
        who: 'hong', obj: 'Chị Hồng: timesheet "thật" đầu tiên', time: '17:00',
        scene: [
          ['hong', 'Chúc mừng em lên chính thức. Quà của em: timesheet giờ dùng để tính lợi nhuận client của em. Của em.'],
          ['hong', 'Tuần này em làm Răng Xinh 52 giờ. Hợp đồng chỉ trả cho 30. Em ghi bao nhiêu?'],
          { c: 'ag_off_ts', o: [
            { t: 'Ghi 52, kèm báo cáo phần việc ngoài phạm vi.', fx: { uy: 3, rel: { hong: 2 }, set: { off_ts_true: true } }, then: [
              ['hong', 'Đúng. Có số này, tháng sau em mới có cớ đàm phán.'],
            ] },
            { t: 'Ghi 30 cho đẹp.', fx: { dr: 2, rel: { diep: 1 } }, then: [
              ['hong', 'Ừ. 22 giờ còn lại đi đâu? Đi vào… em.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày đầu chính thức. Mười bốn nhóm Zalo. ${s.flags.off_wrong_group ? 'Mình gửi nhầm nhóm. Anh Tuấn nói "Ok em". Đáng sợ nhất năm.' : 'Suýt gửi nhầm nhóm. Kịp.'} Bin muốn có rồng.`,
  },
  {
    id: 'off_scope', official: true, title: 'Tiện làm giùm anh',
    intro: 'Tuần thứ hai chính thức. Anh Tuấn nhắn: "Em ơi, tiện làm giùm anh cái thiệp cưới nha. Của em gái anh. Nhanh thôi."\n\nCùng lúc đó, lương tháng này trễ ba ngày vì một client khác chưa trả tiền.',
    steps: [
      {
        who: 'vy', obj: 'Vỹ nghe tin thiệp cưới', time: '10:00',
        scene: [
          ['vy', 'Thiệp cưới? Cho client? Anh thiết kế KV kem đánh răng, giờ thiết kế đám cưới cho em gái người bán kem đánh răng.'],
          ['vy', 'Em là AE. Em quyết. Anh chỉ hỏi: font cưới anh có 12 cái. Em muốn cái nào?'],
          { c: 'ag_off_wedding', o: [
            { t: 'Nhận làm, coi như giữ quan hệ.', fx: { nl: -6, rel: { tuan: 2, vy: -2 }, set: { off_free_work: true } }, then: [
              ['vy', 'Ok. Anh làm. File tên "thiep_cuoi_NGOAI_PHAM_VI_lan1".'],
            ] },
            { t: 'Báo giá thiệp cưới như một job riêng.', fx: { uy: 3, rel: { tuan: -1, hong: 2 }, set: { off_bill: true } }, then: [
              ['tuan', 'Ơ… có tính phí hả em? Ừ… được. Rẻ thôi nha.'],
              ['hong', 'Có PO thì chị cưới luôn cũng được.'],
            ] },
            { t: 'Từ chối khéo, giới thiệu một freelancer.', fx: { uy: 2, rel: { vy: 2 } }, then: [
              ['tuan', 'Ok em. Freelancer của em có làm rồng được không?'],
            ] },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Anh Tùng: "Răng Xinh sắp gia hạn retainer"', time: '11:30',
        scene: [
          ['tung', 'Răng Xinh sắp gia hạn retainer! Em cứ "yes" với mọi thứ tới khi họ ký. Ký xong mình "yes" tiếp. Make it pop!'],
          ['think', '"Yes" là chiến lược. Không phải câu trả lời.'],
          { c: 'ag_off_yes', o: [
            { t: '"Anh ơi, yes mọi thứ thì phạm vi sẽ thành 50 bài/tháng."', fx: { uy: 2, rel: { tung: -2 } }, then: [
              ['tung', '…Thì năm sau mình tăng giá! Năm sau là năm của tăng giá!'],
            ] },
            { t: '"Dạ."', fx: { nl: -3, rel: { tung: 2 } }, then: [
              ['tung', 'Thấy chưa, AE giỏi là AE nói "dạ".'],
            ] },
          ] },
        ],
      },
      {
        who: 'hong', obj: 'Chị Hồng: lương trễ', time: '14:00',
        scene: [
          ['hong', 'Lương tháng này trễ ba ngày. Sen Hồng lại chưa trả. Chị xin lỗi. Chị không ứng được nữa, tiết kiệm chị hết rồi.'],
          { if: f('debt_fixed'), then: [['hong', 'Lần trước em soi hồ sơ giúp chị. Lần này hồ sơ đủ hết. Họ chỉ… chưa muốn trả.']] },
          { c: 'ag_off_salary', o: [
            { t: 'Hỏi chị Hồng có cần giúp gì không.', fx: { nl: 5, rel: { hong: 3 } }, then: [
              ['hong', 'Em đi ăn trưa với chị. Chị không muốn ăn trưa một mình với file công nợ.'],
            ] },
            { t: 'Nhắn nhóm toàn công ty: "lương đâu mọi người?"', fx: { dr: 4, rel: { tung: -2 } }, then: [
              ['nar', 'Ba mươi người thả tim. Không ai trả lời. Anh Tùng đổi ảnh đại diện thành dòng chữ "Patience is POP".'],
            ] },
          ] },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp: "Em ơi" (bản chính thức)', time: '17:30',
        scene: [
          ['diep', 'Em ơi… chị không giao việc. Chị chỉ nói: chị nhận offer agency khác. Cuối tháng chị đi.'],
          ['diep', 'Em sẽ là người lớn nhất team account. Chị xin lỗi. Chị ở lại tám năm vì những người như em. Lần này chị đi vì chính chị.'],
          { c: 'ag_off_diep', o: [
            { t: '"Chị đi đi. Chị xứng đáng."', fx: { rel: { diep: 3 } }, then: [
              ['diep', 'Cảm ơn em. Ba cái điện thoại, chị để lại hai cho em. Đùa đó. Để lại một.'],
            ] },
            { t: '"Chị đi rồi em làm sao?"', fx: { nl: -3, rel: { diep: 1 } }, then: [
              ['diep', 'Em sẽ làm như chị. Rồi một ngày em sẽ nói câu này với một bạn intern khác.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Thiệp cưới cho em gái client. ${s.flags.off_bill ? 'Mình báo giá. Chị Hồng nói có PO thì cưới luôn cũng được.' : s.flags.off_free_work ? 'Mình nhận làm free. Vỹ đặt tên file "NGOAI_PHAM_VI_lan1". Lần 1.' : 'Mình giới thiệu freelancer.'} Lương trễ ba ngày. Chị Diệp sắp đi.`,
  },
  {
    id: 'off_burnout', official: true, title: 'Tuần lễ sức khỏe tinh thần',
    intro: 'Chị Diệp đã nghỉ. Bạn giờ ôm Răng Xinh, một nửa Ông Táo và 22 nhóm Zalo.\n\nĐêm qua chị Hồng gửi email toàn công ty: "Tuần lễ sức khỏe tinh thần: mỗi ngày 5 phút thiền." Gửi lúc 23:40.',
    steps: [
      {
        who: 'hong', obj: 'Chị Hồng phát "bộ quà sức khỏe tinh thần"', time: '09:45',
        scene: [
          ['hong', 'Mỗi người một bộ: một gói trà hoa cúc, một quả bóng bóp tay, một tờ hướng dẫn thở.'],
          ['hong', 'Anh Tùng chọn. Chị chỉ phát. Chị cũng không biết thở theo tờ này có kịp deadline không.'],
          { c: 'ag_off_wellness', o: [
            { t: 'Bóp bóng ngay tại chỗ.', fx: { nl: 3, rel: { hong: 1 } }, then: [
              ['nar', 'Quả bóng xẹp ở lần bóp thứ ba. Như một deck v14.'],
            ] },
            { t: '"Có chế độ nghỉ bù OT không chị?"', fx: { uy: 2, rel: { tung: -1 } }, then: [
              ['hong', 'Có trong quy chế. Trang 14. Chưa ai đọc tới trang 14.'],
            ] },
          ] },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải: "Anh ra riêng"', time: '11:00',
        scene: [
          ['khai', 'Anh sắp ra riêng. Agency nhỏ, năm người. Thi đi cùng. Vỹ đang nghĩ.'],
          { if: f('credit_name'), then: [['khai', 'Anh muốn em đi cùng. Người dám xin một dòng credit thì sẽ dám nói "không" với client. Anh cần người như vậy.']],
            else: [['khai', 'Anh hỏi em. Không phải vì em giỏi nhất. Vì em là người hiếm hoi ở đây chưa khóc ở cầu thang.']] },
          { c: 'ag_off_khai', o: [
            { t: '"Cho em suy nghĩ ạ."', fx: { nl: -2, rel: { khai: 1 }, set: { off_khai_maybe: true } }, then: [
              ['khai', 'Suy nghĩ đi. Ý tưởng hay thì cần thời gian. Ý tưởng dở thì cần client.'],
            ] },
            { t: '"Em ở lại với Trend Trễ."', fx: { rel: { tung: 2 }, set: { off_stay_loyal: true } }, then: [
              ['khai', 'Ừ. Phải có người ở lại tắt đèn.'],
            ] },
          ] },
        ],
      },
      {
        who: 'suong', obj: 'Sương không ổn', time: '15:00',
        scene: [
          ['suong', 'Em ơi. Chị ngủ ba tiếng một đêm, sáu tháng rồi. Hôm qua chị mơ thấy comment chửi. Chị trả lời nó trong mơ.'],
          ['suong', 'Chị xin nghỉ một tuần. Anh Tùng nói "tuần lễ sức khỏe tinh thần mà nghỉ thì kỳ lắm".'],
          { c: 'ag_off_suong', o: [
            { t: 'Nhận canh fanpage thay Sương một tuần.', fx: { nl: -10, rel: { suong: 3 }, set: { off_cover_suong: true } }, then: [
              ['suong', '…Thật hả? Cảm ơn bé. Mật khẩu chị gửi riêng. Đừng hỏi vì sao nó có chữ "ngungu".'],
            ] },
            { t: 'Đi cùng Sương gặp anh Tùng.', fx: { uy: 2, rel: { suong: 2, tung: -2 } }, then: [
              ['tung', '…Ok. Nghỉ đi. Anh không biết là ngủ ba tiếng sáu tháng. Anh tưởng Sương là… chatbot.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn: 22 nhóm Zalo đang sáng', time: '17:45',
        scene: [
          ['nar', '17:45. Màn hình có 22 nhóm Zalo. Tin mới nhất từ anh Tuấn: "Em ơi".'],
          ['think', 'Hồi intern, mình sợ hai chữ này vì nó nghĩa là OT. Giờ mình sợ vì mình là người phải trả lời.'],
          { c: 'ag_off_night', o: [
            { t: 'Trả lời ngay, làm tới 23:00.', fx: { nl: -15, rel: { tuan: 2 }, set: { off_burn: true } }, then: [
              ['nar', '23:04 bạn gửi file. 23:40 anh Tuấn: "Em ơi anh thấy bản đầu ổn hơn."'],
            ] },
            { t: 'Nhắn: "Dạ 9:30 sáng mai em gửi anh ạ."', fx: { uy: 2, nl: 10, set: { off_boundary: true } }, then: [
              ['tuan', 'Ok em. (Thật ra anh cũng không gấp. Anh chỉ quen nhắn giờ này.)'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Tuần lễ sức khỏe tinh thần. Quả bóng bóp tay xẹp. ${s.flags.off_boundary ? 'Mình nhắn "9:30 sáng mai". Anh Tuấn nói anh cũng không gấp.' : 'Mình làm tới 23:04. Anh Tuấn thích bản đầu hơn.'} Anh Khải sắp ra riêng.`,
  },
  {
    id: 'off_final', official: true, noReview: true, title: 'Mất Ông Táo',
    // you resign first (client offer / Khải's new agency) → quit; otherwise you are on the list → layoff
    end: (r) => (r.flags.fin_client || r.flags.fin_khai ? 'quit' : 'layoff'),
    intro: 'Mì Ông Táo, 35% doanh thu của Trend Trễ, gửi email một dòng: "Bên chị chuyển sang agency khác từ quý sau."\n\nAnh Tùng gọi họp toàn công ty lúc 10:00. Lần đầu tiên anh không mang ly "POP".',
    steps: [
      {
        who: 'tung', obj: 'Họp toàn công ty', time: '10:00',
        pos: { tung: 'coach', khai: 'su1', thi: 'su2', vy: 'su3', quan: 'su4', loc: 'su5', suong: 'su6', kieu: 'su7', linh: 'su8', phat: 'su9', hong: 'su10' },
        scene: [
          ['tung', 'Mọi người… Ông Táo đi rồi. Mình phải "right-size". Tiếng Anh nghe cho nhẹ. Tiếng Việt là cắt tám người.'],
          ['nar', 'Không ai nói gì. Mèo Insight nhảy lên bàn, nằm đúng giữa. Lần này không ai đuổi nó.'],
          ['tung', 'Danh sách anh báo riêng từng người chiều nay. Anh xin lỗi. Anh không có câu "make it pop" nào cho chuyện này.'],
          { c: 'ag_fin_meeting', o: [
            { t: 'Hỏi: "Tiêu chí cắt là gì ạ?"', fx: { uy: 2, dr: 2 }, then: [
              ['tung', '…Theo team của client mất. Và theo chi phí. Người mới… cũng tính.'],
              ['think', 'Mình làm Ông Táo và Răng Xinh. Mình mới. Mình biết câu trả lời rồi.'],
            ] },
            { t: 'Im lặng, nhìn quanh.', fx: { nl: -3 }, then: [
              ['nar', 'Vỹ tháo tai nghe. Anh Phát gỡ băng keo khỏi tay. Thi gấp một tờ giấy thành con hạc. Không ai nhìn ai.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:nguyet', obj: 'Chị Nguyệt gọi riêng (nghe máy)', time: '13:00',
        call: { title: 'Chị Nguyệt · gọi riêng', people: ['nguyet', 'me'] },
        scene: [
          ['nguyet', 'Chị xin lỗi. Quyết định không phải của chị. Sếp mới muốn agency "to hơn".'],
          ['nguyet', 'Nhưng chị vẫn cần một Brand Executive. Lương gấp đôi. Giờ hành chính. Thật.'],
          { if: f('go_client'), then: [['nguyet', 'Em từng nhận lời chị một lần rồi mà. Lần này chị giữ chỗ cho em thật.']] },
          { c: 'ag_fin_nguyet', o: [
            { t: 'Nhận lời chị Nguyệt.', fx: { rel: { nguyet: 3 }, set: { fin_client: true } }, then: [
              ['nguyet', 'Thứ Hai em qua nha. Chị hứa không "em ơi" sau 21:00. Chị hứa thử.'],
            ] },
            { t: '"Em cảm ơn chị, nhưng em chưa muốn qua bên kia."', fx: { uy: 1, set: { fin_decline: true } }, then: [
              ['nguyet', 'Ừ. Em vẫn còn tin agency. Chị từng như em. Giữ được bao lâu thì giữ.'],
            ] },
          ] },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải đang đóng thùng carton', time: '15:00',
        scene: [
          ['khai', 'Anh không bị cắt. Anh tự đi. Agency nhỏ, tên "Đủ Đau". Thi, Vỹ đi cùng.'],
          { if: f('off_khai_maybe'), then: [['khai', 'Em nói em suy nghĩ. Giờ là lúc trả lời.']] },
          { if: f('fin_client'), then: [['khai', 'Nghe nói em qua bên client. Ừ. Vậy lần sau anh pitch cho em. Nhớ đừng bắt sửa 14 vòng.']] },
          { c: 'ag_fin_khai', o: [
            { t: 'Đi cùng anh Khải.', when: (r) => !r.flags.fin_client, fx: { rel: { khai: 3 }, set: { fin_khai: true } }, then: [
              ['khai', 'Không có Đà Lạt. Không có ly POP. Có ý tưởng, và một cái bàn hơi lung lay.'],
            ] },
            { t: '"Em có hướng riêng ạ."', fx: { rel: { khai: 1 }, set: { fin_alone: true } }, then: [
              ['khai', 'Tốt. Ai rồi cũng phải có agency của riêng mình. Kể cả khi agency đó chỉ có một người.'],
            ] },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Phòng MD: lá thư của bạn', time: '17:00',
        scene: [
          { if: (r) => !!(r.flags.fin_client || r.flags.fin_khai), then: [
            ['tung', 'Em ngồi đi. Anh định báo em có tên trong danh sách. Nhưng đơn nghỉ việc của em tới trước. Nhanh hơn cả lúc client đổi ý.'],
            { if: f('fin_client'), then: [['tung', 'Qua bên client cũ. Đi trước khi anh kịp cắt. Thông minh. Anh ghen tị.']] },
            { if: f('fin_khai'), then: [['tung', 'Theo Khải. Ừ, anh đoán vậy. Nói Khải nhớ trả cái standee 2019. Đó là của công ty.']] },
            ['tung', 'Anh vẫn viết thư giới thiệu cho em. Viết thật. Không có chữ "pop".'],
          ], else: [
            ['tung', 'Em ngồi đi. Em có tên trong danh sách. Không phải vì em làm dở. Vì em làm Ông Táo, mà Răng Xinh cũng vừa xin giảm phí.'],
            ['tung', 'Em được báo trước, có trợ cấp theo luật, và một thư giới thiệu. Anh viết thật. Không có chữ "pop".'],
          ] },
          { c: 'ag_fin_last', o: [
            { t: '"Em cảm ơn anh. Em học được nhiều."', fx: { rel: { tung: 2 } }, then: [
              ['tung', 'Em học được nhiều thì agency còn làm được một việc đúng.'],
            ] },
            { t: '"Anh ơi, còn Đà Lạt thì sao ạ?"', fx: { dr: 2, rel: { tung: 1 } }, then: [
              ['tung', '…Haha. Đà Lạt. Quý sau. Thật đó. Lần này anh đi một mình.'],
            ] },
          ] },
          ['nar', '(Chấm dứt hợp đồng vì lý do kinh tế có quy định riêng về báo trước và trợ cấp. Thông tin giải trí, không phải tư vấn pháp lý.)'],
        ],
      },
    ],
    diary: (s) => (s.flags.fin_client ? 'Ông Táo đi. Mình cũng đi, qua chính Ông Táo. Phía bên kia chiến tuyến.'
      : s.flags.fin_khai ? 'Ông Táo đi. Mình theo anh Khải qua "Đủ Đau". Cái bàn hơi lung lay.'
        : 'Ông Táo đi. Mình có tên trong danh sách. Một tháng trợ cấp, một thư giới thiệu thật.'),
  },
];

// ---------- endings ----------
export const ENDINGS = {
  finish: (r) => {
    const credit = r.flags.credit_name ? ' Case study nộp giải có tên bạn ở một dòng, cỡ chữ bình thường.' : '';
    if (r.flags.go_client) return { title: 'Hết kỳ thực tập · qua bên kia chiến tuyến', text: `Bạn ôm giấy xác nhận thực tập và một offer từ Mì Ông Táo. Thứ Hai tới, bạn sẽ là người nhắn "em ơi". Bạn hứa không nhắn sau 21:00. Bạn hứa thử.${credit}` };
    if ((r.rel.diep || 0) >= 6) return { title: 'Hết 45 ngày ở Trend Trễ', text: `Chị Diệp ký giấy xác nhận và viết thêm một dòng tay: "Biết hỏi lại. Biết nói thật. Cần ngủ." Anh Tùng ký thêm, vẽ một tia sét "POP".${credit}` };
    if (r.st.uy >= 70) return { title: 'Hết 45 ngày ở Trend Trễ', text: `Giấy xác nhận thực tập có dấu đỏ và một dòng: "Tham gia chiến dịch Tâm trạng gì cũng có size". Dòng đó đáng giá hơn cái standee shortlist ở góc.${credit}` };
    return { title: 'Hết 45 ngày ở Trend Trễ', text: `Chị Hồng gửi giấy xác nhận thực tập qua email lúc 23:40. Tên bạn bị gõ sai một chữ. Chị sửa trong 30 giây, gọi đó là "phong cách agency".${credit}` };
  },
  quit: (r) => {
    if (r.flags.fin_client) return { title: 'Qua bên kia chiến tuyến', text: 'Bạn nộp đơn nghỉ trước khi tên mình kịp lên danh sách cắt giảm. Thứ Hai, bạn ngồi bàn Brand Executive của Mì Ông Táo. Agency mới gửi KV v1. Bạn gõ "Em ơi…", rồi xóa, rồi gõ: "Bản này ổn rồi."' };
    if (r.flags.fin_khai) return { title: '"Đủ Đau" Agency', text: 'Bạn nghỉ Trend Trễ và theo anh Khải sang một agency năm người. Không pantry, không ringlight. Có một cái bàn lung lay và tấm biển viết tay: "Brief rõ ràng hoặc về."' };
    return { title: 'Bạn nghỉ việc ở Trend Trễ', text: r.flags.off_boundary ? 'Bạn gửi email nghỉ việc lúc 17:44, một phút trước giờ "em ơi". Lần đầu tiên bạn tắt 22 nhóm Zalo mà không thấy có lỗi.'
      : 'Bạn gửi email nghỉ việc lúc 23:40. Anh Tùng trả lời sau một phút: "Ok em. Nhưng email này hơi chưa pop."' };
  },
  layoff: (r) => ({
    title: 'Trend Trễ "right-sizing"',
    text: `Anh Tùng gọi đây là "right-sizing". Bạn gọi đây là: trợ cấp theo luật, một thư giới thiệu thật, và một buổi tối không có "em ơi".${r.flags.off_boundary ? ' Bạn tắt 22 nhóm Zalo. Từng nhóm một. Rất chậm.' : ''}`,
  }),
};

// ---------- pantry (max 1 extra option) ----------
export const FOOD = [
  { t: 'Nấu mì Ông Táo sample (miễn phí, +18, mất 10 phút)', fx: { nl: 18, clock: 10 }, then: [
    ['nar', 'Mì Ông Táo vị "Tết sum vầy". Nấu bằng ấm siêu tốc, ăn trong ly giấy, khỏi rửa nồi. Insight sống động nhất bạn từng trải nghiệm.'],
  ] },
];

// ---------- after-work life events (agency flavour) ----------
export const LIFE_EVENTS = [
  { id: 'ag_wedding_call', emoji: '📹', text: 'Tối nay bạn đi đám cưới bạn thân. 21:00, client gọi video: "Chút xíu thôi em, sửa giùm chị 2 chữ."', choices: [
    { t: 'Trốn vào nhà vệ sinh sửa trên điện thoại', fx: { nl: -8, dr: 2 }, after: 'Bạn sửa 2 chữ, sai thêm 1 chữ. Lỡ luôn màn cô dâu chú rể cắt bánh.' },
    { t: 'Nhắn: "Em đang có việc gia đình, 10h sáng mai em gửi ạ."', fx: { uy: 1, nl: 3 }, after: 'Client: "Ok em." Thật ra cũng không gấp. Bạn ăn hết đĩa gà.' },
  ] },
  { id: 'ag_3am_post', emoji: '⏰', text: 'Bài đăng hẹn giờ của client tự lên lúc 3:00 sáng thay vì 15:00. Sương nhắn bạn lúc 3:02.', fx: { nl: -10 }, after: 'AM với PM. Hai chữ cái. Một đêm mất ngủ.' },
  { id: 'ag_trend_22', emoji: '🔥', text: '22:00, một trend mới nổi. Sương nhắn: "Làm liền đi em, mai là hết trend!"', choices: [
    { t: 'Làm liền, đăng lúc 23:30', fx: { nl: -12, uy: 1 }, after: 'Bài được 8.000 like. Sáng mai trend đã cũ. Bạn bắt kịp. Hơi trễ. Nhưng bắt.' },
    { t: '"Mai mình làm bản hay hơn nha chị."', fx: { nl: 4 }, after: 'Sáng mai trend chết. Không sao. Tên công ty là Trend Trễ mà.' },
  ] },
];
