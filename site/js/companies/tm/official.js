// T&M Partners — the one path to becoming official, the offer scene, and the 4-episode post-promotion arc.
// Arc: honeymoon → more work, same pay → Hân/Khang politics + Tuyết's midnight "ý nhỏ" → right-sizing (quit or layoff).

const F = (k) => (r) => !!r.flags[k];
const NOT = (k) => (r) => !r.flags[k];
const ANY = (...ks) => (r) => ks.some((k) => !!r.flags[k]);
const tie = (id) => (r) => !!r.flags['tie_' + id];
const countA = (r) => (r.reviews || []).filter((x) => x.grade === 'A').length;

// The final arc episode ends the run as 'quit' or 'layoff' depending on the player's choice (flag tm_final).
// The engine reads `episode.end` (a static field) when the day ends; it has no access to the run there, so each
// step of the final episode remembers the run in its `when`, and `end` is a getter over that run.
// endings.quit / endings.layoff also read tm_final, so the ending text always matches the choice.
const FINAL = { run: null };
const keep = (r) => { FINAL.run = r; return true; };

export const PROMOTION = {
  salary: 15_000_000,
  // ≥ 2 A reviews, at least day 18, solid reputation, AND a mid-game story beat that shows Tuyết you get things done:
  // the Bảo dossier (day 19) or Mai vouching for you (day 24).
  when: (r) => countA(r) >= 2 && r.day >= 18 && r.st.uy >= 60 && !!(r.flags.bao_dossier || r.flags.mai_vouch),
  offer: [
    ['nar', 'Review xong, chị Tuyết không cho bạn về. Chị đứng dậy, tự tay đóng cửa phòng.'],
    ['tuyet', 'Chị nói ngắn. Lần thứ hai trong đời.'],
    { if: F('bao_dossier'), then: [['tuyet', 'Em làm hồ sơ cho Bảo. Ở đây ai cũng thương Bảo, nhưng chỉ em làm giấy tờ. Chị cần người làm giấy tờ.']] },
    { if: F('mai_vouch'), then: [['tuyet', 'Mai nói em biết hỏi khách cần gì. Mai chưa khen ai bao giờ, kể cả chị.']] },
    ['tuyet', 'Chị muốn giữ em lại, chính thức. Mười lăm triệu. Hợp đồng lao động mười hai tháng, có bảo hiểm.'],
    ['think', 'Mười lăm triệu. Có bảo hiểm. Anh Bảo phải chờ ba năm cho câu này.'],
    { c: 'tm_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, set: { accept_official: true } }, then: [
        ['tuyet', 'Tốt. Từ thứ Hai em không còn là intern. Nghĩa là không ai tha lỗi cho em vì là intern nữa.'],
      ] },
      { t: '"Em xin hỏi trước: mô tả công việc và giờ làm thêm thế nào ạ?"', fx: { uy: 2 }, then: [
        ['tuyet', 'Câu hỏi đúng. Mô tả công việc Phương gửi. Giờ làm thêm theo luật, có phiếu, có duyệt. Trên giấy.'],
        ['think', '"Trên giấy."'],
        { c: 'tm_offer_2', o: [
          { t: 'Nhận lời, kèm email xác nhận các điều vừa nói.', fx: { uy: 3, set: { accept_official: true, offer_in_writing: true } }, then: [
            ['tuyet', 'Email thì email. Em đúng là người làm giấy tờ.'],
          ] },
          { t: 'Từ chối. "Trên giấy" là đủ trả lời rồi.', fx: { set: { accept_official: false } }, then: [
            ['tuyet', 'Được. Chị không hỏi lần hai. Nhưng chị sẽ nhớ em đã hỏi.'],
          ] },
        ] },
      ] },
      { t: '"Em xin cảm ơn, nhưng em muốn học hết đợt rồi tính ạ."', fx: { set: { accept_official: false } }, then: [
        ['tuyet', 'Được. Chị không hỏi lần hai. Ở T&M, lời mời chỉ có một lần, giống khách đến sớm 47 phút.'],
      ] },
    ] },
  ],
  arc: ['off_honeymoon', 'off_more_work', 'off_toxic', 'off_final'],
};

export const OFFICIAL_EPISODES = [
  {
    id: 'off_honeymoon', official: true, title: 'Tuần trăng mật',
    intro: 'Ngày đầu tiên làm nhân viên chính thức.\n\nVẫn cái bàn đó, cái laptop đó, phím Shift lỏng đó. Nhưng hôm nay bạn có hợp đồng lao động, có bảo hiểm, và một cảm giác rất lạ: được tin.',
    chatStart: [['phuong', 'Chào mừng thành viên CHÍNH THỨC của gia đình T&M 💖🎉🎂', false]],
    steps: [
      { who: 'gam', obj: 'Chị Gấm có quà cho bạn', time: '08:30', scene: [
        ['gam', 'Danh thiếp của em nè! Chị đặt in từ tuần trước. Chị ghi bút chì rồi mới đưa nhà in.'],
        ['nar', 'Danh thiếp ghi: "{ten} · Intern Chính Thức". Một trăm cái.'],
        { c: 'off_hm_card', o: [
          { t: '"Đẹp quá chị. Em giữ làm kỷ niệm, mình in lại bản sau nhé."', fx: { rel: { gam: 2 } }, then: [
            ['gam', 'Bản sau chị dùng bút bi. Hứa.'],
          ] },
          { t: 'Dùng luôn, coi như chức danh độc nhất.', fx: { dr: 2, uy: -1 }, then: [
            ['long', '"Intern Chính Thức". Mày là một nghịch lý biết đi.'],
          ] },
        ] },
      ] },
      { who: 'quynh', obj: 'Chị Quỳnh giải thích phiếu lương', time: '09:30', scene: [
        ['quynh', 'Ngồi đây chị giải thích. Mười lăm triệu. Trừ 10,5% bảo hiểm phần người lao động, còn khoảng 13,4 triệu.'],
        ['quynh', 'Thuế thu nhập cá nhân: thu nhập sau bảo hiểm thấp hơn mức giảm trừ gia cảnh, nên chưa phải nộp. Chúc mừng, em nghèo vừa đủ.'],
        ['nar', '(Thông tin giải trí, đơn giản hóa, không phải tư vấn pháp lý.)'],
        { if: F('quynh_fast'), then: [['quynh', 'Phiếu tạm ứng của em từ giờ chị duyệt trong ngày. Đặc quyền của người biết giữ bí mật.']] },
        { c: 'off_hm_pay', o: [
          { t: '"Bảo hiểm này em được gì ạ?"', fx: { uy: 1, rel: { quynh: 1 } }, then: [
            ['quynh', 'Ốm có bảo hiểm y tế. Mất việc thì trợ cấp thất nghiệp, nhưng phải đóng đủ mười hai tháng đã. Nhớ nhé. Mười hai.'],
          ] },
          { t: '"13,4 triệu! Em mời cả phòng trà sữa."', fx: { money: -320_000, rel: { long: 1, trang: 1, an: 1, nhi: 1 } }, then: [
            ['nar', 'Hai mươi ly. Chị Quỳnh lấy ly không đường. Anh Bình lấy hai ly, mang một ly vào phòng kế toán.'],
          ] },
        ] },
      ] },
      { who: 'phuong', obj: 'Chị Phương thêm bạn vào các group', time: '11:00', scene: [
        ['phuong', 'Chào mừng thành viên chính thức 💖! Chị đã add em vào 14 group chat.'],
        ['nar', '"T&M Family 💖", "T&M Official Only 🔒", "Ban tổ chức team building (vĩnh viễn)", "Sinh nhật chị Tuyết (bí mật)"…'],
        { c: 'off_hm_groups', o: [
          { t: 'Tắt thông báo 13 group, giữ group dự án.', fx: { uy: 1, nl: 5 }, then: [['think', 'Mười ba cái chuông tắt. Tâm hồn bật lại.']] },
          { t: 'Bật hết, đọc hết.', fx: { nl: -8, dr: 1, rel: { phuong: 2 } }, then: [['nar', 'Bạn đọc 312 tin nhắn. 140 tin là sticker. 2 tin là việc.']] },
        ] },
      ] },
      { who: 'tuyet', obj: 'Chị Tuyết giao việc đầu tiên', time: '14:00', scene: [
        ['tuyet', 'Giờ em không còn là intern. Nghĩa là không ai tha lỗi cho em vì là intern nữa.'],
        ['tuyet', 'Chị giao em Êm Ru giai đoạn 2. Và một bạn intern mới vào thứ Hai. Em hướng dẫn nó.'],
        ['think', 'Tuần trước mình còn là người được hướng dẫn.'],
        { c: 'off_hm_task', o: [
          { t: '"Dạ. Bài đầu tiên em dạy: đừng tin chữ FINAL."', fx: { uy: 1, rel: { tuyet: 1 } }, then: [
            ['tuyet', 'Bài thứ hai: hỏi lại brief của Hân. Chị không nói câu đó. Em tự nghĩ ra.'],
          ] },
          { t: '"Chị cho em xin mô tả công việc bằng văn bản ạ."', fx: { uy: 2, set: { off_jd: true } }, then: [
            ['tuyet', 'Có. Phương sẽ gửi. Phương gửi chậm, nhưng gửi.'],
          ] },
        ] },
      ] },
    ],
    diary: () => 'Ngày đầu làm chính thức. Danh thiếp ghi "Intern Chính Thức". Lương 15 triệu, thực nhận khoảng 13,4. Mười bốn group chat. Một bạn intern mới sắp vào. Tuần trăng mật kéo dài khoảng… một ngày.',
  },

  {
    id: 'off_more_work', official: true, title: 'Thêm việc, không thêm lương',
    intro: 'Tuần thứ hai làm chính thức. Chức danh trên email của bạn tự nhiên dài ra: "Consultant kiêm điều phối Êm Ru kiêm hướng dẫn intern kiêm…"\n\nLương thì không dài ra.',
    chatStart: [['han', 'Em ơi, giờ em official rồi, em ôm giúp chị phần "change management" cho Êm Ru nha ✨', true], ['linh', 'Em hỗ trợ team chị thêm 2 buổi/tuần được không? Minh lại thi.', true]],
    steps: [
      { who: 'obj:desk', obj: 'Hộp thư sáng thứ Hai: 9 việc mới', time: '08:30', scene: [
        ['nar', 'Hộp thư: 47 email, 9 việc mới, 3 người cùng ghi "GẤP". Một người ghi "GẤP (không gấp lắm)".'],
        { if: F('mai_handover'), then: [['nar', 'Trong đó có ba việc chị Mai bàn giao, kèm ghi chú: "Em làm được. Nhưng đừng làm một mình."']] },
        { mini: {
          type: 'order', title: 'Sắp việc theo thứ tự làm', icon: '📥',
          prompt: 'Gấp và quan trọng trước. Không gấp, không quan trọng: cuối cùng (hoặc không bao giờ).', time: 35, pass: 0.6,
          items: [
            { text: 'Gửi Êm Ru biên bản họp (khách chờ từ thứ Sáu)', order: 0 },
            { text: 'Sửa số liệu sai trong deck chị Linh nộp lúc 14:00', order: 1 },
            { text: 'Hướng dẫn intern mới đăng nhập máy', order: 2 },
            { text: 'Slide "change management" cho chị Hân (chưa có hạn)', order: 3 },
            { text: 'Chọn màu áo team building', order: 4 },
          ],
        },
        good: [['think', 'Năm việc, đúng thứ tự. Màu áo team building xếp cuối, như số phận của nó.'], { fx: { uy: 3, set: { off_prioritized: true } } }],
        bad: [['nar', 'Bạn chọn màu áo team building trước. Màu hồng. Biên bản Êm Ru gửi lúc 16:40.'], { fx: { nl: -6, dr: 1 } }],
        },
      ] },
      { who: 'han', obj: 'Chị Hân giao "change management"', time: '10:30', scene: [
        ['han', 'Em ơi phần change management chị cần trước thứ Tư nha. Em official rồi, chị trust em hoàn toàn.'],
        ['han', 'Khang sẽ review cho em. Khang có kinh nghiệm overseas mà.'],
        { c: 'off_mw_han', o: [
          { t: '"Dạ được ạ."', fx: { nl: -8, rel: { han: 2 }, set: { off_yes_han: true } }, then: [['han', 'Love it! Em đúng là người của transformation.']] },
          { t: '"Em đang có ba việc gấp. Chị chọn giúp em bỏ bớt việc nào ạ?"', fx: { uy: 2, rel: { han: -1 }, set: { off_tradeoff: true } }, then: [
            ['han', 'Bỏ… bỏ cái màu áo team building đi. Đừng nói Phương.'],
          ] },
          { t: 'Nhờ Long dịch "change management" theo kiểu chị Hân.', fx: { rel: { long: 1 } }, then: [
            ['long', '"Change management" theo chị Hân = "slide có hình con bướm". Tao không đùa. Tao có ba bản lưu.'],
          ] },
        ] },
      ] },
      { who: 'quynh', obj: 'Chị Quỳnh gọi về bảng chấm công', time: '14:00', scene: [
        ['quynh', 'Em ơi, bảng chấm công tháng này của em: 52 giờ làm thêm.'],
        ['quynh', 'Luật giới hạn làm thêm 40 giờ một tháng, ngày thường trả ít nhất 150%. (Thông tin giải trí, không phải tư vấn pháp lý.)'],
        ['quynh', 'Nhưng không ai duyệt phiếu làm thêm cho em. Vì không ai yêu cầu em làm thêm. Trên giấy.'],
        { c: 'off_mw_ot', o: [
          { t: 'Làm phiếu làm thêm, xin chị Tuyết ký.', fx: { uy: 1, dr: 2, rel: { quynh: 1 }, set: { off_claim_ot: true } }, then: [
            { chat: [['tuyet', 'Ai yêu cầu em làm thêm?', true], ['tuyet', '…Việc yêu cầu. Ừ. Chị ký. Lần sau làm ít đi.', true]] },
            { fx: { money: 450_000 } },
          ] },
          { t: '"Thôi chị, em tự nguyện mà."', fx: { nl: -3, rel: { quynh: -1 }, set: { off_free_ot: true } }, then: [
            ['quynh', '"Tự nguyện" là chữ đắt nhất trong hợp đồng của em.'],
            { if: F('contract_blind'), then: [['think', 'Điều khoản "OT tự nguyện theo yêu cầu" hồi thực tập. Mình ký mà không hỏi. Nó theo mình tới tận đây.']] },
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: '17:40 Bạn intern mới hỏi một câu', time: '17:40', scene: [
        ['nar', '17:40. Bạn intern mới rụt rè: "Anh/chị ơi, em về được chưa ạ?"'],
        ['think', 'Câu này mình từng hỏi. Giờ mình là người phải trả lời.'],
        { c: 'off_mw_home', o: [
          { t: '"Về đi em. Intern về đúng giờ là quyền, không phải đặc ân."', fx: { uy: 1, rel: { mai: 1 }, set: { off_kind: true } }, then: [
            ['nar', 'Bạn intern mới về. Bạn ở lại tới 20:15. Chức danh trên email thêm một chữ "kiêm".'],
          ] },
          { t: '"Ở lại thêm chút, học cách làm việc."', fx: { dr: 2, set: { off_harsh: true } }, then: [
            ['think', 'Mình vừa nói câu mình ghét nhất. Bằng giọng của người khác.'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Tuần hai làm chính thức. Chín việc mới, một mức lương cũ. ${r.flags.off_claim_ot ? 'Mình xin được phiếu làm thêm. Chị Tuyết ký, kèm "lần sau làm ít đi".' : 'Mình làm thêm 52 giờ, "tự nguyện".'}`,
  },

  {
    id: 'off_toxic', official: true, title: 'Ý nhỏ lúc nửa đêm',
    intro: 'Tuần thứ ba làm chính thức. 23:47 tối qua, chị Tuyết nhắn: "Chị có vài ý nhỏ." Rồi im lặng tới sáng.\n\nSáng nay, phân tích Êm Ru giai đoạn 2 của bạn được trình bày ở họp ban giám đốc. Người trình bày: Khang.',
    chatStart: [['tuyet', 'Chị có vài ý nhỏ. (23:47)', true], ['tuyet', 'Thôi để mai. (23:58)', true], ['tuyet', 'Em ngủ chưa? (00:31)', true]],
    steps: [
      { who: 'an', obj: 'An có tin không vui', time: '08:30', scene: [
        ['an', 'Em biết chưa? Họp ban giám đốc sáng nay, Khang trình bày phân tích giai đoạn 2. Slide của em. Font của Khang.'],
        ['an', 'Chị Tuyết khen "phân tích sắc". Khang nói "cảm ơn chị, em làm cả cuối tuần".'],
        { c: 'off_tx_hear', o: [
          { t: 'Hít thở. Mở lịch sử phiên bản file để có bằng chứng.', fx: { uy: 1, set: { off_evidence: true } }, then: [
            ['nar', 'Lịch sử file: bạn sửa 31 tiếng trong 6 ngày. Khang sửa 4 phút, lúc 07:52 sáng nay, đổi font.'],
          ] },
          { t: 'Đi thẳng tới bàn Khang.', fx: { dr: 3, set: { off_angry: true } }, then: [['an', 'Khoan, em… thôi, đi đi. Anh đi theo làm nhân chứng.']] },
          { t: '"Kệ anh ạ, miễn khách vui."', fx: { nl: -5, rel: { an: -1 }, set: { off_swallow: true } }, then: [
            ['an', 'Em nói câu đó vào năm thứ hai là em thành anh đấy.'],
          ] },
        ] },
      ] },
      { who: 'khang', obj: 'Nói chuyện với Khang', time: '10:00', scene: [
        ['khang', 'Hey! Sáng nay chị Tuyết love phân tích lắm. Actually, when I was overseas, credit là của team. Team mình mà.'],
        { if: tie('khang_han'), then: [['khang', 'Với lại dì… chị Hân nói anh nên present, cho nó "có trọng lượng".']] },
        { c: 'off_tx_khang', o: [
          { t: '"Lịch sử file ghi em sửa 31 tiếng, anh 4 phút. Lần sau mình ghi tên cả hai nhé."', when: F('off_evidence'), fx: { uy: 3, rel: { khang: -2 }, set: { off_stood: true } }, then: [
            ['khang', '…Bốn phút đó là bốn phút rất strategic.'],
          ] },
          { t: '"Đúng, credit của team. Vậy anh gửi email cảm ơn team, CC chị Tuyết nhé."', fx: { uy: 2, rel: { khang: -1 }, set: { off_stood: true } }, then: [
            ['khang', '…Ok. Email. Sure.'],
            ['nar', 'Email gửi lúc 10:14. Tên bạn ở dòng thứ tư, sau Khang, chị Hân và "Mèo KPI".'],
          ] },
          { t: 'Cười cho qua.', fx: { dr: 1, rel: { khang: 1 }, set: { off_swallow: true } }, then: [
            ['khang', 'Great teamwork! Overseas người ta gọi đây là "collective ownership".'],
          ] },
        ] },
      ] },
      { who: 'han', obj: 'Chị Hân chia sẻ "T&M 2030"', time: '13:30', scene: [
        ['han', 'Em ơi, ngồi đây. Chị share trước nha: "T&M 2030 Transformation Journey". Mình re-structure cho agile hơn.'],
        ['nar', 'Sơ đồ tổ chức mới. Ô của bạn nằm dưới ô Khang. Ô Khang ghi "Head of Overseas Insight". T&M không có văn phòng nào ở nước ngoài.'],
        { if: tie('khang_han'), then: [['think', 'Chê Khang là chê chị Hân. Giờ báo cáo cho Khang là báo cáo cho… gia đình chị Hân.']] },
        { c: 'off_tx_org', o: [
          { t: '"Em xin báo cáo trực tiếp cho chị Tuyết hoặc chị Linh ạ."', fx: { uy: 1, rel: { han: -2 }, set: { off_refuse_khang: true } }, then: [
            ['han', 'Hmm. Chị note lại nha. "Chưa sẵn sàng cho transformation".'],
          ] },
          { t: '"Dạ, em theo sơ đồ mới ạ."', fx: { nl: -6, rel: { han: 2 }, set: { off_under_khang: true } }, then: [
            ['han', 'Great! Em với Khang sẽ là một dream team.'],
          ] },
          { t: '"Sơ đồ này chị Tuyết duyệt chưa ạ?"', fx: { uy: 2, dr: 2, rel: { han: -1 } }, then: [
            ['han', 'Đang trong quá trình… aligment.'],
          ] },
        ] },
      ] },
      { who: 'mai', obj: 'Chị Mai và Long muốn nói chuyện', time: '15:00', pos: { long: 'x1', mai: 'x2' }, scene: [
        { if: F('mai_handover'), then: [['mai', 'Chị sắp đi rồi, nên chị nói thẳng: chỗ nào cũng có một Khang. Câu hỏi là ở đó có ai đứng về phía em không.']],
          else: [['mai', 'Chị ở lại vì ở đây chị được nói "không". Em cũng có quyền đó. Dùng nó trước khi nó hết hạn.']] },
        ['long', 'Tao dịch giúp: "T&M 2030" = "chị Hân có ngân sách mới". "Agile hơn" = "ít người hơn".'],
        { c: 'off_tx_allies', o: [
          { t: 'Hỏi chị Mai và Long nên làm gì tiếp.', fx: { rel: { mai: 1, long: 1 }, set: { off_allies: true } }, then: [
            ['mai', 'Ghi lại mọi thứ bằng email. Rồi nói chuyện với chị Tuyết, trước khi Hân nói.'],
          ] },
          { t: '"Em ổn. Em chỉ cần ngủ."', fx: { nl: 5 }, then: [['long', 'Ngủ là chiến lược. Tao ủng hộ chiến lược này.']] },
          { t: 'Bắt đầu cập nhật CV.', fx: { dr: 1, set: { off_cv: true } }, then: [
            ['long', 'Tao gửi template. Tao cập nhật CV mỗi tháng một lần. Như tập thể dục.'],
          ] },
        ] },
      ] },
      { who: 'call:tuyet', obj: 'Chị Tuyết gọi Teams (nghe máy)', time: '17:50',
        call: { title: 'Chị Tuyết · "Một ý nhỏ thôi"', people: ['tuyet', 'me'] }, scene: [
        ['tuyet', 'Chị có vài ý nhỏ về phân tích giai đoạn 2. Khang trình bày tốt. Nhưng chị hỏi số thì Khang không trả lời được.'],
        ['tuyet', 'Ai làm bản này?'],
        { c: 'off_tx_tuyet', o: [
          { t: '"Dạ, em làm ạ. Lịch sử file có ghi."', when: ANY('off_evidence', 'off_stood'), fx: { uy: 3, rel: { tuyet: 1, khang: -1 }, set: { off_credit: true } }, then: [
            ['tuyet', 'Chị biết. Chị chỉ muốn nghe em nói.'],
          ] },
          { t: '"Team làm ạ."', fx: { rel: { khang: 1 }, set: { off_swallow: true } }, then: [
            ['tuyet', 'Team không trả lời điện thoại lúc 23:47. Người thì có.'],
          ] },
          { t: '"Em làm. Và em cần nói với chị về sơ đồ tổ chức mới."', fx: { uy: 2, dr: 3, rel: { tuyet: 1, han: -2 }, set: { off_credit: true, off_told_tuyet: true } }, then: [
            ['tuyet', 'Sơ đồ nào?'],
            ['think', 'À.'],
          ] },
        ] },
        ['tuyet', 'Sáng mai 8 giờ gặp chị. Mang theo vài ý nhỏ của em.'],
      ] },
    ],
    diary: (r) => `Tuần ba làm chính thức. Khang trình bày slide của mình. ${r.flags.off_credit ? 'Mình nói với chị Tuyết: bản đó là của mình.' : 'Mình để "team" nhận công.'} Chị Tuyết nhắn lúc 23:47, 23:58 và 00:31. Ý nhỏ không có giờ làm việc.`,
  },

  {
    id: 'off_final', official: true, title: 'Right-sizing',
    get end() { return FINAL.run && FINAL.run.flags.tm_final === 'layoff' ? 'layoff' : 'quit'; },
    intro: 'Lịch Teams có một cuộc họp mới: "1:1 · Hành trình mới 🌱 · chị Hân, chị Phương, bạn". 15:00. Không có agenda.\n\nỞ T&M, cuộc họp không có agenda luôn là cuộc họp quan trọng nhất.',
    steps: [
      { who: 'phuong', obj: 'Chị Phương nhắn "chiều gặp em nha"', time: '08:30', when: keep, scene: [
        ['phuong', 'Em ơi… à không có gì. Chiều gặp em nha.'],
        ['nar', 'Chị Phương không gửi kèm emoji nào. Chị Phương luôn gửi ba emoji.'],
        { c: 'off_fin_phuong', o: [
          { t: '"Chị ơi, cuộc họp chiều nay là gì ạ?"', fx: { rel: { phuong: 1 }, set: { off_warned: true } }, then: [
            ['phuong', 'Chị không được nói. Nhưng… em mang theo hợp đồng lao động nhé.'],
          ] },
          { t: 'Gật đầu, quay về bàn.', fx: { nl: -3 }, then: [['think', 'Không emoji. Mình biết rồi.']] },
        ] },
      ] },
      { who: 'long', obj: 'Long có tin đồn', time: '10:00', when: keep, scene: [
        ['long', 'Tin đồn: chị Hân "right-size" ba vị trí. Ưu tiên người vào sau cùng, lương cao hơn intern, chưa đủ mười hai tháng. Mày đoán xem là ai.'],
        ['long', 'Chưa đủ mười hai tháng thì không có trợ cấp mất việc. Tao tra rồi. (Thông tin giải trí, không phải tư vấn pháp lý.)'],
        { if: F('off_cv'), then: [['long', 'Mày cập nhật CV rồi đúng không? Tốt. Tao tự hào về mày như tự hào về CV của tao.']] },
        { c: 'off_fin_prep', o: [
          { t: 'Đọc lại hợp đồng lao động của mình.', fx: { uy: 1, set: { off_read_contract: true } }, then: [
            ['nar', 'Hợp đồng 12 tháng. Người lao động tự nghỉ: báo trước 30 ngày. Công ty cho nghỉ vì lý do kinh tế: thủ tục dài hơn nhiều. (Thông tin giải trí.)'],
          ] },
          { t: 'Hỏi anh Bảo lời khuyên.', when: NOT('bao_left'), fx: { rel: { bao: 1 } }, then: [
            ['bao', 'Tao chờ ba năm để được ký. Mày được ký rồi. Đừng để ai bắt mày chờ thêm ba năm nữa, theo bất kỳ hướng nào.'],
          ] },
          { t: 'Pha cà phê, nhìn ra cửa sổ.', fx: { nl: 8 }, then: [['nar', 'Ngoài cửa sổ, tòa Bốn Phương Global sáng đèn. Có view sông.']] },
        ] },
      ] },
      { who: 'han', obj: '15:00 Phòng họp: "Hành trình mới 🌱"', time: '15:00', when: keep, pos: { han: 'mr_head', phuong: 'mr_n1' }, scene: [
        ['han', 'Em ngồi đi. Chị share nha: T&M đang right-sizing for the future. Mình cần lean hơn, agile hơn, synergy hơn.'],
        ['phuong', '(nhỏ) Nghĩa là công ty cắt giảm nhân sự, em ạ.'],
        { if: F('off_under_khang'), then: [['han', 'Khang đánh giá em "chưa đủ overseas mindset". Chị rất tiếc.']] },
        { if: ANY('off_refuse_khang', 'off_told_tuyet'), then: [['han', 'Em từng không đồng ý với sơ đồ mới. Chị nghĩ em sẽ hạnh phúc hơn ở một "hành trình" khác.']] },
        ['han', 'Có hai option. Một: em ở lại, kiêm phần của hai bạn bị cắt, lương giữ nguyên, báo cáo cho Khang. Hai: mình chia tay, lương tháng này trả đủ.'],
        { c: 'off_fin_choice', o: [
          { t: '"Em chọn option ba: em nghỉ. Báo trước đúng luật, bàn giao đàng hoàng."', fx: { uy: 3, set: { tm_final: 'quit' } }, then: [
            ['han', 'Ơ… option ba không có trong slide. Nhưng ok. Chị respect.'],
            ['phuong', '(nhỏ) Em làm đúng rồi. Chị sẽ viết giấy xác nhận thật đẹp.'],
          ] },
          { t: '"Em không ký gì hôm nay. Chị gửi quyết định bằng văn bản, đúng thủ tục ạ."', fx: { uy: 2, dr: 3, set: { tm_final: 'layoff', off_by_the_book: true } }, then: [
            ['han', 'Văn bản… Phương, mình có template không?'],
            ['phuong', 'Có, chị. Template năm 2016.'],
          ] },
          { t: '"Dạ… em ở lại ạ."', fx: { nl: -15, dr: 4, set: { tm_final: 'layoff', off_stayed: true } }, then: [
            ['han', 'Great! Welcome to the new journey.'],
            ['nar', 'Ba tuần sau, trong đợt "right-sizing giai đoạn 2", tên bạn nằm ở dòng đầu tiên. Lần này không có option.'],
          ] },
        ] },
      ] },
      { who: 'tuyet', obj: 'Chị Tuyết gọi bạn vào phòng', time: '16:00', when: keep, scene: [
        ['tuyet', 'Chị nghe Hân nói rồi.'],
        { if: F('off_credit'), then: [['tuyet', 'Chị biết phân tích đó là của em. Chị đã nói với Hân. Hân nói "để em align lại". Chị mệt với chữ align rồi.']] },
        { if: (r) => r.flags.tm_final === 'quit', then: [
          ['tuyet', 'Em xin nghỉ. Chị không giữ. Người giỏi ở đây hoặc thành Mai, hoặc thành Bảo. Chị không muốn em thành Bảo.'],
        ], else: [
          ['tuyet', 'Chị không cản được Hân lần này. Ngân sách 2030 là của Hân. Còn chị… chị chỉ có vài ý nhỏ.'],
          ['tuyet', 'Ý nhỏ cuối cùng: đây không phải lỗi của em. Đừng nhớ nhầm.'],
        ] },
        { c: 'off_fin_tuyet', o: [
          { t: '"Em cảm ơn chị đã cho em cơ hội ạ."', fx: { rel: { tuyet: 2 } }, then: [['tuyet', 'Cơ hội là em tự lấy. Chị chỉ không cản.']] },
          { t: '"Chị có một ý nhỏ cuối cho em không ạ?"', fx: { uy: 1, rel: { tuyet: 1 } }, then: [
            ['tuyet', 'Có. Ở chỗ mới, ngày đầu tiên, hỏi lại brief.'],
          ] },
          { t: '"Chị nên nói chuyện với chị Hân về văn hóa ạ."', fx: { dr: 2, rel: { tuyet: 1 } }, then: [
            ['tuyet', 'Chị biết. Chị nói mười năm rồi. Hân nghe bằng tai nghe của Khang.'],
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'Dọn bàn', time: '17:30', when: keep, scene: [
        ['nar', 'Bạn dọn bàn. Cây xương rồng, tờ giấy nhớ "Đừng tin chữ FINAL", danh thiếp "Intern Chính Thức" còn 97 cái.'],
        ['nar', 'Mèo KPI nhảy lên bàn, nằm đúng chỗ laptop vừa để. Employee of the Month. Tháng nào cũng vậy.'],
        { c: 'off_fin_last', o: [
          { t: 'Để lại tờ giấy nhớ cho người ngồi sau.', fx: { uy: 1 }, then: [['think', 'Người sau sẽ cần nó hơn mình từng cần.']] },
          { t: 'Gửi một tin nhắn cuối vào group "T&M Family 💖".', fx: { dr: 1 }, then: [
            { chat: [['phuong', '💖💖💖', false], ['long', 'Đồng chí ra đi, từ điển Hân – Việt ở lại.', false], ['trang', 'Bạn ăn bánh không? Mình mua dư… cho buổi chia tay 🌸', false]] },
          ] },
        ] },
      ] },
    ],
    diary: (r) => (r.flags.tm_final === 'quit' ? 'Ngày cuối. Mình chọn "option ba". Chị Tuyết nói: ở chỗ mới, ngày đầu tiên, hỏi lại brief.'
      : 'Ngày cuối. "Right-sizing for the future". Mình là phần được "size" đi.'),
  },
];
