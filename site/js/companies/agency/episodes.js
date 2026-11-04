// Trend Trễ Agency — intern drama days (day 1 onboarding + days 2–40). Flags carry across episodes;
// promotion.when (extras.js) reads crisis_hero, the "idea" flags and the reviews.

const isTier = (...ids) => (s) => ids.includes(s.tier);
const f = (k) => (r) => !!r.flags[k];

const WIP_POS = { diep: 'scrum', khai: 'su1', thi: 'su2', vy: 'su3', quan: 'su4', loc: 'su5', suong: 'su6', kieu: 'su7', linh: 'su8', phat: 'su9' };
const LUNCH_POS = { thi: 'lunch1', vy: 'lunch2', linh: 'lunch3', suong: 'lunch4', phat: 'lunch5' };

// ---------- mini-games ----------
const WIP_MINI = {
  type: 'pick', title: 'Call report: họp WIP', icon: '📝',
  prompt: 'Chị Diệp cần: ai làm gì, deadline, ai chịu trách nhiệm. Chọn 3 dòng đáng ghi.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Ông Táo: Vỹ sửa KV v14, gửi client 15:00 thứ Ba', correct: true },
    { text: 'Sen Hồng: chị Hồng gửi lại báo giá, cần PO trước thứ Năm', correct: true },
    { text: 'Trà Sữa: anh Khải + Thi brainstorm thứ Ba, chốt 3 hướng', correct: true },
    { text: 'Anh Lộc: "CPM đang cao" (để sẵn)' },
    { text: 'Anh Khải: brief Trà Sữa là một lời cầu nguyện' },
    { text: 'Chị Diệp có 3 điện thoại' },
    { text: 'Mèo Insight ngồi lên bàn phím Vỹ' },
  ],
};
const FILE_MINI = {
  type: 'pick', title: 'Ổ chung > Ông Táo > KV', icon: '🗂️',
  prompt: 'Bản nào là bản đã GỬI client tuần trước?', pick: 1, time: 25, pass: 1,
  items: [
    { text: 'KV_Tet_FINAL.psd', sub: 'Sửa: 3 tuần trước · Vỹ' },
    { text: 'KV_Tet_FINAL_final_v7_sualancuoi.psd', sub: 'Sửa: 2 tuần trước · Vỹ' },
    { text: 'KV_Tet_v13_GUI_CLIENT_thu5.psd', sub: 'Sửa: thứ Năm tuần trước 22:47 · Vỹ', correct: true },
    { text: 'KV_Tet_v13_THATSU_dungxoa.psd', sub: 'Sửa: hôm qua · anh Khải (đổi chữ thành màu tím)' },
    { text: 'KV_Tet_v14_nhap.psd', sub: 'Sửa: sáng nay · chưa gửi ai' },
    { text: 'Fonts_47.zip', sub: '2,3 GB · ĐỪNG MỞ' },
  ],
};
const BS_MINI = {
  type: 'pick', title: 'Lọc ý tưởng brainstorm', icon: '🧃',
  prompt: 'Brief: "làm sao cho viral". Chọn 2 ý vừa làm được, vừa không phải năm ngoái.', pick: 2, time: 30, pass: 0.5,
  items: [
    { text: 'Ly trà sữa đổi màu theo tâm trạng', sub: 'cần R&D 6 tháng' },
    { text: 'Menu size theo tâm trạng: S hơi buồn, L thứ Hai, XL deadline', sub: 'rẻ, làm ngay', correct: true },
    { text: 'TVC 3 phút: ly trà sữa đi xuyên vũ trụ', sub: 'ngân sách: 30 triệu' },
    { text: 'Ý tưởng năm ngoái, đổi màu', sub: 'Thi đề xuất, rất thành thật' },
    { text: 'Mời KOL khóc trên livestream rồi uống trà sữa', sub: 'Sương lắc đầu dữ dội' },
    { text: 'Ly giấy in một câu "an ủi" do khách gửi', sub: 'Thi gật đầu rất mạnh', correct: true },
  ],
};
const V1_MINI = {
  type: 'pick', title: 'Đi tìm v1', icon: '🔎',
  prompt: 'Client muốn "quay lại bản đầu tiên". Bản đầu tiên thật là bản nào?', pick: 1, time: 25, pass: 1,
  items: [
    { text: 'KV_v1.psd', sub: 'Sửa: hôm qua · ai đó "lưu đè"' },
    { text: 'KV_v1_goc.psd', sub: 'Tạo: 3 tuần trước · Vỹ · gửi client 14:02', correct: true },
    { text: 'KV_v1_FINAL.psd', sub: 'Thật ra là v4' },
    { text: 'KV_v1_backup_cua_backup.psd', sub: '0 KB' },
    { text: 'KV_v1_ANH_KHAI_SUA.psd', sub: 'Mọi thứ thành màu đen' },
    { text: 'Untitled-1.psd', sub: 'Đừng hỏi' },
  ],
};
const TS_MINI = {
  type: 'quiz', title: 'Timesheet tuần 1', icon: '⏱️',
  prompt: 'Ghi giờ cho đúng client. Chị Hồng đang đứng sau lưng.', time: 35, pass: 0.66,
  questions: [
    { q: 'Nghe voice 6 phút của chị Nguyệt + 1 tiếng ghi ý chính', options: ['Mì Ông Táo', 'Khác', 'Nội bộ – học hỏi'], correct: 0 },
    { q: '2 tiếng họp WIP sáng thứ Hai', options: ['Chia đều cho mọi client', 'Nội bộ (không tính phí)', 'Ông Táo vì được nhắc nhiều nhất'], correct: 1 },
    { q: '45 phút tìm bản v1 giữa sáu bản v1', options: ['Mì Ông Táo', 'Vỹ', 'Thiên tai'], correct: 0 },
  ],
};
const INSIGHT_MINI = {
  type: 'quiz', title: 'Observation hay insight?', icon: '🍜',
  prompt: 'Anh Quân dặn: observation là thứ ai cũng thấy. Insight là thứ ai cũng thấy mà không ai nói.', time: 30, pass: 0.66,
  questions: [
    { q: '"Người ta ăn mì gói vì tiện."', options: ['Observation', 'Insight'], correct: 0 },
    { q: '"Người ta không ngại nấu mì. Người ta ngại rửa nồi."', options: ['Observation', 'Insight'], correct: 1 },
    { q: '"Gói mì là thứ duy nhất trong ngày không đổi ý với mình."', options: ['Observation', 'Insight', 'Thơ của Thi'], correct: 1 },
  ],
};
const PROD_MINI = {
  type: 'order', title: 'Quy trình sản xuất video', icon: '🎬',
  prompt: 'Xếp đúng thứ tự, để chị Diệp hiểu vì sao 10 ngày là không đủ.', time: 30, pass: 0.6,
  items: [
    { text: 'Chốt kịch bản & storyboard', order: 0 },
    { text: 'Báo giá, client duyệt, có PO', order: 1 },
    { text: 'Casting, thuê ekip, xin phép địa điểm', order: 2 },
    { text: 'Quay', order: 3 },
    { text: 'Hậu kỳ (client sửa 14 vòng)', order: 4 },
  ],
};
const DECK_MINI = {
  type: 'order', title: 'Mạch kể deck pitch', icon: '📊',
  prompt: 'Cắt deck 80 trang còn 20. Xếp lại đúng mạch kể.', time: 30, pass: 0.66,
  items: [
    { text: 'Hiểu brief: client thật sự cần gì', order: 0 },
    { text: 'Insight', order: 1 },
    { text: 'Big idea', order: 2 },
    { text: 'Triển khai: KV, TVC, social, KOL', order: 3 },
    { text: 'Timeline & ngân sách', order: 4 },
    { text: 'Slide cảm ơn, logo to (anh Tùng tự thêm)', order: 5 },
  ],
};
const STATEMENT_MINI = {
  type: 'pick', title: 'Thông cáo Mì Ông Táo', icon: '🧯',
  prompt: 'Chọn 3 câu nên có trong thông cáo. Ngắn. Có bằng chứng. Không đổ lỗi.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Chúng tôi đã ghi nhận bài đăng và đang liên hệ người đăng để kiểm tra.', correct: true },
    { text: 'Ảnh trong bài là ảnh năm 2021 của một sản phẩm khác; ảnh so sánh đính kèm.', correct: true },
    { text: 'Mọi thắc mắc xin gọi hotline, chúng tôi phản hồi trong 24 giờ.', correct: true },
    { text: 'Đây là chiêu trò của đối thủ, chúng tôi sẽ kiện tới cùng!!!' },
    { text: 'Nếu có làm ai tổn thương thì chúng tôi… cũng không chắc.' },
    { text: 'Tết nào cũng có Táo! 🎉 Mua 2 tặng 1!' },
    { text: 'Admin xin phép đi ngủ, mai trả lời ạ.' },
  ],
};
const BIN_MINI = {
  type: 'pick', title: 'Soi KV của Bin', icon: '🔥',
  prompt: 'Tìm 3 lỗi "chết người" trước khi trả lời client.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Ảnh nền còn watermark của trang bán ảnh (bản quyền!)', correct: true },
    { text: 'Logo Răng Xinh bị kéo dãn sai tỉ lệ', correct: true },
    { text: 'Sai tên sản phẩm: "Răng Xin"', correct: true },
    { text: 'Màu hồng hơi đậm' },
    { text: 'Có hiệu ứng lửa (lạ, nhưng không phạm luật)' },
    { text: 'Bảy font chữ (xấu, nhưng sửa được)' },
    { text: 'Bin dùng Canva' },
  ],
};
const MEDIA_MINI = {
  type: 'quiz', title: 'Media 101 (năm phút)', icon: '📈',
  prompt: 'Trước khi gặp client, nói được bằng tiếng người.', time: 30, pass: 0.66,
  questions: [
    { q: 'CPM là gì?', options: ['Chi phí cho 1.000 lượt hiển thị', 'Chi phí mỗi tháng', 'Cảm xúc Phập phồng của Media'], correct: 0 },
    { q: 'CPA là gì?', options: ['Chi phí cho mỗi lượt chuyển đổi (vd: đăng ký)', 'Công ty Phát hành Ads', 'Cái anh Lộc đang thở dài'], correct: 0 },
    { q: 'Câu nào nên nói với client?', options: ['"Thuật toán đổi rồi chị ạ"', '"Bên em set sai, đây là số thật và cách bù"', '"CPM đang cao"'], correct: 1 },
  ],
};
const PROOF_MINI = {
  type: 'pick', title: 'Hồ sơ nghiệm thu Răng Xinh', icon: '📎',
  prompt: 'Chọn 3 thứ phải có để xuất hóa đơn.', pick: 3, time: 30, pass: 0.66,
  items: [
    { text: 'Biên bản nghiệm thu có chữ ký hai bên', correct: true },
    { text: 'Ảnh chụp màn hình các bài đã đăng, có ngày giờ', correct: true },
    { text: 'Báo cáo số liệu cuối chiến dịch', correct: true },
    { text: 'Ảnh team chụp ăn mừng' },
    { text: 'Tin nhắn "ok em" của anh Tuấn' },
    { text: 'Sticker 👍 trong nhóm Zalo' },
  ],
};
const APOLOGY_MINI = {
  type: 'pick', title: 'Lời xin lỗi', icon: '🙇',
  prompt: 'Chọn 3 câu. Chị Diệp dặn: không "nếu có", không "hiểu lầm".', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Clip của chúng tôi đã khắc họa định kiến về người phụ nữ ngày Tết. Đó là sai.', correct: true },
    { text: 'Chúng tôi đã gỡ clip và sẽ thay bằng nội dung mới trong tuần.', correct: true },
    { text: 'Cảm ơn mọi người đã góp ý thẳng. Chúng tôi sẽ rà soát kịch bản kỹ hơn.', correct: true },
    { text: 'Nếu có làm ai tổn thương thì chúng tôi rất tiếc.' },
    { text: 'Clip chỉ mang tính giải trí, mong mọi người đừng khắt khe.' },
    { text: 'Tặng mã giảm 20% cho ai share lời xin lỗi này!' },
    { text: 'Chúng tôi xin lỗi vì mọi người đã hiểu lầm.' },
  ],
};
const DEBT_MINI = {
  type: 'pick', title: 'Hồ sơ công nợ Sen Hồng', icon: '🏦',
  prompt: 'Vì sao ba tháng chưa có tiền? Tìm 2 chỗ thiếu trong hồ sơ của MÌNH.', pick: 2, time: 30, pass: 0.5,
  items: [
    { text: 'Biên bản nghiệm thu tháng 8: chưa có chữ ký client', correct: true },
    { text: 'Hóa đơn tháng 9: sai mã số thuế của Sen Hồng', correct: true },
    { text: 'Báo cáo tháng 10: đủ, đã gửi' },
    { text: 'Email cảm ơn của client: có, nhưng không cần' },
    { text: 'Ảnh KV in khổ A0' },
    { text: 'Timesheet của Vỹ' },
  ],
};

export const EPISODES = [
  // ---------------------------------------------------------------- 1
  {
    id: 'onboarding', day: 1, title: 'Onboarding: "Em ơi" đầu tiên',
    intro: 'Thứ Hai, 9:30. Ngày đầu tiên ở Trend Trễ.\n\nVăn phòng thơm mùi cà phê, mùi mì gói và mùi một deadline đêm qua chưa ai dọn.\n\nNgoài việc chính, các anh chị sẽ nhờ bạn vài việc vặt. Xem danh sách ở góc màn hình, làm kịp giờ thì được ghi nhận.',
    sideTasks: true,
    steps: [
      {
        who: 'hong', obj: 'Qua chị Hồng nhận laptop và tài khoản timesheet', time: '09:30',
        scene: [
          ['hong', 'Laptop của em. Máy cũ của bạn AE vừa nghỉ. Hình nền còn của bạn ấy, em đổi hay giữ tùy.'],
          ['nar', 'Hình nền: ảnh biển, chữ to "NGÀY NÀY NĂM SAU MÌNH SẼ Ở ĐÂY". Ngày chụp: hai năm trước.'],
          ['hong', 'Đây là tài khoản timesheet. Mỗi giờ em làm phải ghi vào một client. Không có ô "ngồi chờ feedback".'],
          { c: 'ag_d1_ts', o: [
            { t: '"Vậy giờ ngồi chờ feedback em ghi vào đâu ạ?"', fx: { uy: 2, rel: { hong: 1 } }, then: [
              ['hong', 'Ghi vào client đã bắt em chờ. Đó là cách duy nhất để client trả tiền cho sự chờ đợi.'],
              ['think', 'Nghe như triết học.'],
            ] },
            { t: 'Đổi hình nền thành logo công ty.', fx: { rel: { hong: 1, tung: 1 } }, then: [
              ['hong', 'Ừ. Anh Tùng sẽ thích. Anh ấy thích mọi thứ có logo to.'],
            ] },
            { t: 'Giữ hình nền biển.', fx: { nl: 3 }, then: [
              ['think', 'Ngày này năm sau mình sẽ ở đâu? Thôi, mở Zalo đã. 128 tin chưa đọc.'],
            ] },
          ] },
        ],
      },
      {
        who: 'diep', obj: '9:45 Họp WIP ở bảng giữa phòng', time: '09:45', pos: WIP_POS,
        scene: [
          ['diep', 'WIP nha mọi người. Ai đang cháy? Giơ tay. …Ok, mọi người hạ tay xuống, chị biết rồi.'],
          ['diep', 'Ông Táo: KV Tết v13, client chưa "wow". Sen Hồng: chờ PO. Răng Xinh: anh Tuấn muốn "trẻ hơn". Trà Sữa: cần viral.'],
          ['loc', 'CPM đang cao.'],
          ['diep', 'Anh Lộc, em chưa hỏi.'],
          ['loc', 'Thì để sẵn.'],
          ['khai', 'Brief Trà Sữa có một dòng: "làm sao cho viral". Đây không phải brief. Đây là lời cầu nguyện.'],
          ['diep', '{ten}, em ghi call report buổi này nha. Chị cần ba thứ: ai làm gì, deadline, ai chịu trách nhiệm.'],
          { mini: WIP_MINI,
            good: [['diep', 'Call report gọn. Có người phụ trách, có deadline. Chị forward cả team luôn.'], { fx: { uy: 3, rel: { diep: 2 }, set: { callreport_ok: true } } }],
            bad: [['diep', 'Em ghi "CPM đang cao" vào call report hả? …Anh Lộc chắc vui lắm.'], ['loc', 'Vui thật.'], { fx: { rel: { diep: -1, loc: 1 } } }],
          },
          ['nar', 'WIP "mười lăm phút" kết thúc sau bốn mươi phút. Không ai hết cháy.'],
        ],
      },
      {
        who: 'vy', obj: 'Vỹ cần tìm gấp file KV đã gửi client', time: '11:00',
        scene: [
          ['vy', 'Cứu. Chị Diệp cần KV Ông Táo bản đã gửi client tuần trước. Ổ chung có sáu file. Em tìm giùm anh.'],
          ['vy', 'Mà khoan, đừng mở cái nào có chữ "Fonts". Anh có 47 font, mở là máy em đứng tới trưa.'],
          { mini: FILE_MINI,
            good: [['vy', 'Đúng nó. Bản gửi client là bản có chữ "GUI_CLIENT". Hệ thống đặt tên hoàn hảo, chỉ mỗi anh hiểu.'], { fx: { uy: 3, rel: { vy: 2 }, set: { file_found: true } } }],
            bad: [['vy', 'Không phải… bản này anh Khải đổi chữ thành màu tím. Gửi nhầm là client hỏi "sao chữ tím". Để anh tìm lại.'], { fx: { nl: -4, rel: { vy: -1 } } }],
          },
        ],
      },
      {
        who: 'thi', obj: 'Giờ trưa! Xuống pantry ăn với team', time: '12:00', pos: LUNCH_POS,
        scene: [
          ['thi', 'Ngồi đây nè. Ăn mì không? Mì Ông Táo, vị "Tết sum vầy". Tụi mình ăn vị này từ tháng Chín.'],
          ['linh', 'Hi bạn! Mình là Linh, intern account. Mẹ mình nói intern agency phải ăn trưa với creative để "lấy vibe".'],
          ['suong', '(vừa ăn vừa lướt) Có người chê bao bì Ông Táo giống bao bì thuốc. 12 like. Chưa sao. Chị canh.'],
          ['phat', 'Ai mượn cuộn băng keo vải của anh chưa trả? Cuộn đó quay ba cái TVC rồi đó.'],
          ['vy', 'Luật: ai ngồi gần anh Khải sau 17 giờ thì bị nghe "chưa đủ đau". Ai ngồi gần chị Diệp sau 17:30 thì bị "em ơi".'],
          { c: 'ag_d1_lunch', o: [
            { t: 'Hỏi Linh mẹ bạn làm ở đâu.', fx: { rel: { linh: 2 }, set: { linh_mom: true } }, then: [
              ['linh', 'Marketing Director bên Bia Hơi Phố. Nhưng đừng nói ai nha, mình muốn người ta đánh giá mình… thật.'],
              ['think', 'Bạn ấy nói "đừng nói ai" ở pantry, trước bốn người.'],
            ] },
            { t: 'Hỏi Thi về bài thơ dán trên tủ lạnh.', fx: { rel: { thi: 2 } }, then: [
              ['nar', 'Tờ giấy trên tủ lạnh: "Client bảo đổi màu / Tôi đổi cả chiều sâu / Cuối cùng client chọn / Bản tôi gửi ban đầu."'],
              ['thi', 'Viết sau vòng sửa thứ 11. Giờ đang vòng 13. Mình để dành bài mới.'],
            ] },
            { t: 'Hỏi anh Phát chuyện quay TVC.', fx: { rel: { phat: 2 } }, then: [
              ['phat', 'Quay được hết. Chỉ là không phải với ngân sách này. Anh nói câu đó nhiều tới mức con anh tập nói chữ đầu là "ngân sách".'],
            ] },
          ] },
          { fx: { nl: 25 } },
          ['nar', 'Ba mươi phút ăn trưa. Có hai cuộc gọi của client, không ai nghe. Luật bất thành văn của pantry.'],
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải gọi: "Viết thử 5 caption Trà Sữa"', time: '14:30',
        scene: [
          ['khai', 'Intern. Viết thử năm caption cho Trà Sữa Tâm Trạng. Mười lăm phút.'],
          ['nar', 'Mười lăm phút sau, anh Khải đọc caption của bạn. Gương mặt không đổi, như đang đọc điều khoản sử dụng.'],
          ['khai', 'Đúng hết. Chỉ không có hồn.'],
          { c: 'ag_d1_caption', o: [
            { t: '"Anh chỉ giúp em câu nào thiếu hồn nhất ạ?"', fx: { uy: 2, rel: { khai: 1 } }, then: [
              ['khai', 'Câu ba. "Trà sữa ngon, uống là mê." Ai uống cũng mê thì sao không ai cảm gì?'],
              ['khai', 'Viết lại: một người cụ thể, một tâm trạng cụ thể.'],
              ['think', 'Lần đầu có người chê mà cho mình cái để sửa.'],
            ] },
            { t: 'Lặng lẽ viết lại cả năm câu.', fx: { nl: -6, dr: 1 }, then: [
              ['khai', 'Giờ có hồn. Hồn ma. Mai làm tiếp.'],
            ] },
            { t: 'Nhờ Thi "đọc to lên".', fx: { rel: { thi: 2 }, set: { size_line: true } }, then: [
              ['thi', '"Hôm nay buồn, size L." …Ơ, câu này được nè. Câu này của bạn hả?'],
              ['khai', 'Câu của ai không quan trọng. Câu đó dùng được.'],
              ['think', 'Câu của mình. Ghi nhớ.'],
            ] },
          ] },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp đi về phía bạn… "Em ơi"', time: '17:45',
        scene: [
          ['nar', '17:45. Chị Diệp đi về phía bạn, điện thoại thứ hai áp tai, điện thoại thứ nhất đang gõ dở.'],
          ['diep', 'Em ơi…'],
          ['think', 'Vỹ nói đúng. Hai chữ. Không cần thêm chữ nào.'],
          ['diep', 'Chị Nguyệt bên Ông Táo vừa họp nội bộ xong. Sếp chị ấy muốn "logo to lên chút". Vỹ sửa, em soát chính tả rồi gửi trước 21:00 nha.'],
          { if: isTier('t5'), then: [['diep', 'Mức của em là mức AE rồi nha. Chị tin em.']] },
          { if: f('contract_blind'), then: [['think', 'Thỏa thuận có dòng "hỗ trợ client ngoài giờ bất cứ khi nào". Mình đã ký mà không hỏi.']] },
          { c: 'ag_d1_ot', o: [
            { t: 'Ở lại với Vỹ tới 21:00.', fx: { nl: -15, rel: { diep: 1, vy: 2 }, set: { d1_ot: true } }, then: [
              { if: isTier('t3', 't5'), then: [{ fx: { uy: 4 } }] },
              ['vy', '"Chút" là bao nhiêu? Anh làm ba bản: chút, chút xíu, và chút của client.'],
              ['nar', '21:04 gửi file. 21:30 chị Nguyệt thả 👍. Không ai biết 👍 là duyệt hay đã xem.'],
            ] },
            { t: '"Em soát từ nhà được không chị? Em gửi trước 21:00."', fx: { uy: 2, nl: 5, rel: { diep: 1 } }, then: [
              ['diep', 'Được. Miễn em seen trước 21:00. Ở đây "online" là một dạng có mặt.'],
              ['nar', '20:52 bạn bắt được chữ "Tết sum vầy" bị gõ thành "Tết sum vây". Đủ để cứu một ngày.'],
            ] },
            { t: 'Về đúng giờ: "Mai 9:30 em soát liền ạ."', fx: { nl: 20 }, then: [
              { if: isTier('t5'), then: [{ fx: { dr: 6, uy: -3 } }, ['think', 'Mình chọn mức năm triệu. Năm triệu thì không có "mai".']] },
              { if: isTier('t0', 't1'), then: [['diep', 'Ok em. Intern về đúng giờ là quyền. Chị nói thật lòng. (Chị nói bằng giọng hơi mệt.)']] },
              { if: isTier('t3'), then: [['diep', 'Ừ… ok. Vậy chị tự soát.'], { fx: { rel: { diep: -1 } } }] },
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => {
      const b = [];
      b.push(s.flags.file_found ? 'Mình tìm ra bản "GUI_CLIENT" giữa sáu file KV.' : 'Mình suýt gửi client bản chữ tím.');
      if (s.flags.size_line) b.push('Câu "Hôm nay buồn, size L" là của mình. Thi nói nó được.');
      if (s.flags.linh_mom) b.push('Mẹ Linh là Marketing Director bên Bia Hơi Phố. Bí mật mà cả pantry biết.');
      b.push(s.flags.d1_ot ? 'Ở lại tới 21:04. Client thả 👍. Không ai biết nghĩa là gì.' : 'Lần đầu nghe "em ơi" lúc 17:45.');
      return `Ngày 1. ${b.join(' ')}`;
    },
  },

  // ---------------------------------------------------------------- 2
  {
    id: 'brainstorm', day: 2, title: 'Brainstorm ba tiếng',
    intro: 'Thứ Ba. Ngày brainstorm.\n\nBrief Trà Sữa Tâm Trạng vẫn chỉ có một dòng: "làm sao cho viral". Anh Khải đã đặt phòng ba tiếng. Anh Quân đã in sẵn bốn framework.',
    steps: [
      {
        who: 'quan', obj: 'Anh Quân "khởi động" bằng framework', time: '10:00',
        scene: [
          ['quan', 'Trước khi brainstorm, mình chạy qua framework. 4P, 7C, AIDA, rồi ma trận 2x2 của anh: trục ngang "Tâm", trục dọc "Trạng".'],
          ['nar', 'Bảng trắng kín bốn khung. Không khung nào có chữ "trà sữa".'],
          ['quan', 'Insight trà sữa là gì? Em nói thử. Nhớ: observation không phải insight.'],
          { c: 'ag_bs_insight', o: [
            { t: '"Người ta mua trà sữa để có cớ rời khỏi bàn làm việc."', fx: { uy: 3, rel: { quan: 2 } }, then: [
              ['quan', '…Cái này gần insight. Gần. Anh vẽ thêm một trục cho nó.'],
            ] },
            { t: '"Giới trẻ thích trà sữa ạ."', fx: { rel: { quan: -1 } }, then: [
              ['quan', 'Đó là observation. Insight là thứ ai cũng thấy mà không ai nói. Cái này thì ai cũng nói.'],
            ] },
            { t: '"Anh cho em một ví dụ insight tốt được không ạ?"', fx: { dr: 2, rel: { quan: 1 } }, then: [
              ['quan', 'Ví dụ… ví dụ là… "người ta… cần… sự thấu hiểu".'],
              ['think', 'Anh ấy vừa định nghĩa insight bằng chính chữ insight.'],
            ] },
          ] },
        ],
      },
      {
        who: 'khai', obj: 'Vào phòng Brainstorm với anh Khải', time: '10:30', pos: { khai: 'meeting_head', thi: 'mr_n1', vy: 'mr_n2' },
        scene: [
          ['khai', 'Luật: không có ý tưởng nào ngu. Chỉ có ý tưởng chưa đủ đau. Bắt đầu.'],
          ['nar', 'Giờ thứ nhất: 41 ý. Giờ thứ hai: 12 ý. Giờ thứ ba: Thi đề xuất lại một ý năm ngoái, đổi màu.'],
          ['khai', 'Chọn đi. Ý nào sống được qua tay client?'],
          { mini: BS_MINI,
            good: [
              ['khai', 'Menu size theo tâm trạng. …"Tâm trạng gì cũng có size". Ai nói câu đó?'],
              { if: f('size_line'), then: [['thi', 'Hôm qua bạn intern viết "Hôm nay buồn, size L". Từ đó ra đó anh.']] },
              ['khai', 'Ừ. Ghi lên bảng.'],
              { fx: { uy: 4, rel: { khai: 2 }, set: { size_idea: true } } },
            ],
            bad: [
              ['khai', 'Ly đổi màu theo tâm trạng. Hay. Client làm sáu tháng, đối thủ làm sáu ngày.'],
              ['nar', 'Cuối buổi, bạn buột miệng: "Hay… tâm trạng gì cũng có size?" Anh Khải quay lại.'],
              ['khai', 'Nói lại.'],
              { fx: { uy: 2, rel: { khai: 1 }, set: { size_idea: true } } },
            ],
          },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải làm slide trình ý tưởng', time: '14:00',
        scene: [
          ['khai', 'Chiều nay anh trình chị Diệp ý "Tâm trạng gì cũng có size". Slide anh làm.'],
          ['nar', 'Bạn liếc màn hình. Slide ghi: "Big idea: Tâm trạng gì cũng có size. — Creative team". Không có tên ai.'],
          { c: 'ag_bs_credit', o: [
            { t: '"Anh ghi giúp em tên ở phần credit được không ạ? Em làm portfolio."', fx: { uy: 2, rel: { khai: -1 }, set: { tagline_named: true } }, then: [
              ['khai', '…Credit là của cả team. Nhưng được. Anh ghi "ý ban đầu: {ten}". Cỡ chữ 8.'],
              ['think', 'Cỡ chữ 8. Nhưng là chữ.'],
            ] },
            { t: 'Im lặng. Ý tưởng là của team.', fx: { rel: { khai: 2 }, set: { tagline_silent: true } }, then: [
              ['khai', 'Tốt. Ở đây ý tưởng không có bố mẹ. Chỉ có người chịu trách nhiệm khi nó chết.'],
            ] },
            { t: 'Nhắn riêng chị Diệp: "Ý đó em nghĩ ra ạ."', fx: { dr: 2, rel: { diep: 1 }, set: { tagline_told_diep: true } }, then: [
              { chat: [['diep', 'chị biết rồi 😌 chị nhớ. nhưng đừng nói anh Khải là em nhắn chị nha', true]] },
            ] },
          ] },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp báo: client duyệt hướng!', time: '16:00',
        scene: [
          ['diep', 'Client Trà Sữa duyệt hướng "Tâm trạng gì cũng có size" rồi! Nhưng muốn thêm "viral". Và "nhiều hashtag".'],
          ['diep', 'Em soạn email recap cho client nha. Ngắn. Client đọc trên điện thoại, trong thang máy.'],
          { c: 'ag_bs_recap', o: [
            { t: 'Email 5 dòng: đã duyệt gì, việc tiếp theo, deadline.', fx: { uy: 3, rel: { diep: 2 } }, then: [
              ['diep', 'Năm dòng. Client đọc hết trong một tầng thang máy. Đỉnh.'],
            ] },
            { t: 'Email 2 trang, đủ mọi chi tiết cho chắc.', fx: { nl: -4, rel: { diep: 1 } }, then: [
              ['diep', 'Client trả lời "ok em". Chị không chắc họ đọc tới đâu. Chắc tới chữ "Kính gửi".'],
            ] },
            { t: 'Gửi voice 3 phút cho thân thiện.', fx: { dr: 3, rel: { diep: -1 } }, then: [
              ['diep', 'Em ơi. Client gửi voice cho mình thì được. Mình gửi voice cho client thì không. Luật vũ trụ.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Brainstorm ba tiếng: 41 ý, còn 1. "Tâm trạng gì cũng có size". ${s.flags.tagline_named ? 'Tên mình nằm trong slide, cỡ chữ 8.' : s.flags.tagline_told_diep ? 'Chị Diệp biết ý đó là của mình. Anh Khải thì không cần biết.' : 'Slide ghi "Creative team". Mình cũng là creative team. Chắc vậy.'}`,
  },

  // ---------------------------------------------------------------- 3
  {
    id: 'rev14', minDay: 3, maxDay: 4, title: 'Vòng sửa thứ 14',
    intro: 'KV Tết Mì Ông Táo đang ở bản 13.\n\nTrong nhóm Zalo có client, chị Nguyệt vừa gửi một tin nhắn thoại dài 6 phút. Mọi người nhìn nhau. Không ai muốn bấm nghe trước.',
    steps: [
      {
        who: 'diep', obj: 'Chị Diệp nhờ nghe voice 6 phút của client', time: '10:00',
        scene: [
          ['diep', 'Em nghe giùm chị cái voice này, ghi ra ý chính. Chị đang nghe hai cái khác.'],
          ['nguyet', '(voice) Em ơi chị thấy… nó chưa wow. Tết mà không cũ, đỏ mà không chói, sang mà gần gũi… logo to lên chút…'],
          ['nguyet', '(voice) …À mà sếp chị nói bản đầu tiên có hồn hơn. Em quay lại bản đầu tiên đi em. Ok em, chị đi họp.'],
          ['think', 'Sáu phút. Một ý chính. Nằm ở mười giây cuối.'],
          { c: 'ag_r14_listen', o: [
            { t: 'Ghi đúng một dòng: "Quay lại v1. Logo to lên chút."', fx: { uy: 3, rel: { diep: 2 } }, then: [
              ['diep', 'Một dòng. Em có tai account đó.'],
            ] },
            { t: 'Gõ lại nguyên văn 6 phút cho đủ.', fx: { nl: -6, rel: { diep: 1 } }, then: [
              ['diep', 'Đủ thật. Chị đọc mất bốn phút. Nhưng đủ.'],
            ] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Báo Vỹ: client muốn quay lại v1', time: '11:00',
        scene: [
          ['vy', 'V1? Bản ba tuần trước? Mười ba vòng sửa, giờ quay lại v1?'],
          ['nar', 'Vỹ nhìn màn hình rất lâu. Rồi bật cười. Tiếng cười nghe như một file PSD bị đóng mà không lưu.'],
          ['vy', 'Được. Nhưng phải tìm ra v1 thật. Anh có… nhiều v1 lắm.'],
          { mini: V1_MINI,
            good: [['vy', 'Đúng nó! Gửi lúc 14:02, ba tuần trước. Anh nhớ vì hôm đó anh còn tin vào cuộc đời.'], { fx: { uy: 3, rel: { vy: 2 }, set: { v1_found: true } } }],
            bad: [['vy', 'Bản này bị lưu đè hôm qua. Mất mười phút lục email cũ mới ra bản gốc.'], { fx: { nl: -4, set: { v1_found: true } } }],
          },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp hỏi: gửi lại v1 kiểu gì?', time: '14:00',
        scene: [
          ['diep', 'Có v1 rồi. Giờ gửi kiểu gì đây em? Gửi y chang thì client biết mình mất ba tuần đi một vòng.'],
          ['khai', '(từ bàn bên) Gửi y chang. Bản đó đúng từ đầu. Mười ba vòng là mười ba vòng client tự đi tìm chính mình.'],
          { c: 'ag_r14_send', o: [
            { t: 'Gửi v1, đổi tên file thành "KV_v15_FINAL".', fx: { dr: 3, rel: { vy: 1 }, set: { v1_renamed: true } }, then: [
              ['nar', '15:20, chị Nguyệt trả lời: "Lần này ổn rồi đó em. Thấy có hồn hẳn."'],
              ['vy', 'Có hồn. Hồn của ba tuần trước.'],
              ['think', 'Bài học quan trọng nhất ngành. Và hơi buồn.'],
            ] },
            { t: 'Gửi v1, nói thật: "Đây là bản đầu tiên như chị yêu cầu ạ."', fx: { uy: 3, rel: { khai: 2 }, set: { v1_honest: true } }, then: [
              ['nguyet', 'À đúng rồi, bản này. Thấy chưa, chị nói mà, bản đầu có hồn. Duyệt nha em.'],
              ['khai', 'Thấy chưa. Nói thật cũng được duyệt. Chỉ ít vui hơn.'],
            ] },
            { t: 'Gửi v1, kèm đề xuất: "Từ nay mỗi KV tối đa 3 vòng, vượt thì tính phí."', fx: { uy: 4, rel: { diep: -1, hong: 2 }, set: { rounds_policy: true } }, then: [
              ['diep', 'Em… gửi luôn đề xuất tính phí cho client hả?'],
              ['hong', '(từ phòng kính) Ai gửi đó? Cho chị ôm một cái.'],
              ['nguyet', 'Bản đầu duyệt nha em. Còn đề xuất thì… để chị hỏi sếp. 😊'],
              ['think', 'Cái mặt cười đó nghe rất lạnh.'],
            ] },
          ] },
        ],
      },
      {
        who: 'hong', obj: 'Chị Hồng hỏi giờ công của 14 vòng sửa', time: '16:00',
        scene: [
          ['hong', 'Hợp đồng Ông Táo ghi ba vòng sửa. Mình đã làm mười bốn. Ai ghi timesheet cho mười một vòng còn lại?'],
          ['hong', 'Không ai. Vì không ai muốn nhìn thấy con số đó.'],
          { c: 'ag_r14_hours', o: [
            { t: 'Tổng hợp giờ công thật của 14 vòng, gửi chị Hồng.', fx: { uy: 3, nl: -4, rel: { hong: 2 }, set: { rev_hours: true } }, then: [
              ['hong', 'Bốn mươi hai giờ của Vỹ. Mười tám giờ của Diệp. Em biết con số này là gì không? Là lý do để đòi tiền.'],
            ] },
            { t: '"Dạ thôi chị, vòng nào cũng là học hỏi ạ."', fx: { rel: { hong: -1 } }, then: [
              ['hong', 'Học hỏi không trả tiền điện, em ạ.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Vòng sửa thứ 14: quay lại v1. ${s.flags.v1_renamed ? 'Mình đổi tên thành v15_FINAL. Client khen "có hồn hẳn".' : s.flags.rounds_policy ? 'Mình đề xuất giới hạn 3 vòng. Chị Hồng muốn ôm mình. Client gửi một cái mặt cười rất lạnh.' : 'Mình nói thật đó là v1. Client vẫn duyệt.'} Vỹ cười như file PSD bị đóng không lưu.`,
  },

  // ---------------------------------------------------------------- 4
  {
    id: 'timesheet', day: 5, title: 'Timesheet sáng tạo',
    intro: 'Thứ Sáu. Ngày của timesheet.\n\nTrên nhóm chat, chị Hồng đã nhắc ba lần: "TIMESHEET!!!". Lần thứ ba có thêm emoji con dao. Chiều nay còn có review tuần đầu với chị Diệp.',
    steps: [
      {
        who: 'hong', obj: 'Chị Hồng đứng sẵn ở bàn bạn', time: '10:00',
        scene: [
          ['hong', 'Timesheet tuần này. Mỗi giờ một client. 17:00 khóa sổ.'],
          ['hong', 'Nhắc trước: ô "Khác" không phải chỗ để giấu sáu tiếng nghe voice client.'],
          { mini: TS_MINI,
            good: [['hong', 'Đúng gần hết. Em là người đầu tiên tuần này không ghi "Khác: 14 giờ".'], { fx: { uy: 2, rel: { hong: 2 } } }],
            bad: [['hong', 'Ghi "Vỹ" là một client hả em? Vỹ có trả tiền đâu. Sửa lại.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp kéo bạn ra góc cửa nói nhỏ', time: '11:30', pos: { diep: 'x3' },
        scene: [
          ['diep', 'Em ơi, nhỏ thôi nha. Sen Hồng vượt mandays rồi. Tuần này em ghi bớt giờ Sen Hồng, chuyển qua Răng Xinh giùm chị.'],
          ['diep', 'Răng Xinh còn dư giờ. Cuối năm không xài cũng mất. Mình chỉ… cân bằng lại thôi.'],
          ['think', 'Tuần này mình làm Sen Hồng mười hai tiếng. Răng Xinh: không phút nào.'],
          { c: 'ag_ts_fake', o: [
            { t: 'Làm theo chị Diệp.', fx: { dr: 2, rel: { diep: 2 }, set: { timesheet_fake: true } }, then: [
              ['diep', 'Cảm ơn em. Chị nợ em một ly trà sữa. Size L, vì tâm trạng.'],
              ['think', 'Mình vừa nhận hối lộ bằng một ly trà sữa. Size L.'],
            ] },
            { t: 'Ghi đúng giờ, kèm ghi chú "Sen Hồng vượt mandays: cần báo client".', fx: { uy: 3, rel: { diep: -2, hong: 2 }, set: { timesheet_honest: true } }, then: [
              ['diep', '…Ừ. Em ghi đúng cũng được. Chị chỉ mong em đừng ghi chú to quá.'],
            ] },
            { t: 'Đề xuất báo Sen Hồng phần việc phát sinh và xin thêm phí.', fx: { uy: 4, nl: -5, rel: { diep: 1 }, set: { scope_fee: true } }, then: [
              ['diep', 'Em… nói đúng. Nhưng ai đi nói với ngân hàng là "các anh xài lố"?'],
              ['diep', '…Em. Thứ Hai em soạn email nháp, chị duyệt.'],
              ['think', 'Mình vừa tự giao việc cho chính mình. Chào mừng tới ngành.'],
            ] },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Anh Tùng gọi cả phòng: thông báo quan trọng', time: '14:00', pos: { tung: 'coach' },
        scene: [
          ['tung', 'Mọi người! Tuần sau nữa mình pitch Bia Hơi Phố. Thắng pitch này, cả nhà đi Đà Lạt!'],
          ['nar', 'Không ai vỗ tay. Anh Phát thì thầm: "Năm ngoái cũng Đà Lạt. Năm kia cũng Đà Lạt. Chưa ai thấy Đà Lạt."'],
          ['tung', 'Pitch này mình làm free nha. Đầu tư cho tương lai. Make it pop!'],
          { c: 'ag_ts_pitch', o: [
            { t: '"Anh ơi, pitch free mà thua thì ý tưởng còn là của mình không ạ?"', fx: { uy: 3, rel: { tung: -1 }, set: { asked_ip: true } }, then: [
              ['tung', '…Câu hỏi hay. Hồng ơi, mình có điều khoản đó không?'],
              ['hong', 'Có. Từ 2019. Chưa ai đọc.'],
            ] },
            { t: 'Vỗ tay một mình.', fx: { dr: 2, rel: { tung: 2 } }, then: [
              ['tung', 'Thấy chưa! Intern có tinh thần! Đà Lạt có em!'],
              ['think', 'Không ai nói gì. Mình vừa trở thành "tinh thần".'],
            ] },
            { t: 'Hỏi nhỏ anh Phát: "Đà Lạt thật không anh?"', fx: { rel: { phat: 2 } }, then: [
              ['phat', 'Thật. Trên moodboard. Anh có slide Đà Lạt đẹp lắm.'],
              { if: f('tie_phat_tung'), then: [['phat', 'Anh Tùng là anh rể anh. Tết nào anh ấy cũng hứa đưa cả nhà đi Đà Lạt. Cả nhà vẫn ở Bình Dương.']] },
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Thứ Sáu đầu tiên. ${s.flags.timesheet_fake ? 'Mình chuyển giờ Sen Hồng sang Răng Xinh. Được hứa một ly trà sữa size L.' : s.flags.scope_fee ? 'Mình đề xuất đòi phí phát sinh. Giờ mình là người phải viết email cho ngân hàng.' : 'Mình ghi timesheet đúng giờ. Chị Hồng gật đầu. Chị Diệp thì không.'} Anh Tùng hứa Đà Lạt. Anh Phát nói Đà Lạt chỉ có trên moodboard.`,
  },

  // ---------------------------------------------------------------- 5
  {
    id: 'kol_noshow', minDay: 8, maxDay: 9, title: 'KOL bùng',
    intro: 'KOL Bông Bơ (1,2 triệu follow) đã nhận cọc 50% để đăng clip Trà Sữa Tâm Trạng lúc 11:00 hôm nay.\n\nChị Kiều nói: "Bạn ấy sạch, chị check rồi." Client cần ảnh chụp màn hình trước 15:00.',
    steps: [
      {
        who: 'kieu', obj: 'Chị Kiều dặn việc canh KOL', time: '09:45',
        scene: [
          ['kieu', 'Em canh clip Bông Bơ giúp chị nha. 11:00 lên. Lên là chụp màn hình gửi chị Diệp, chị Diệp gửi client.'],
          ['kieu', 'Bông Bơ sạch lắm, chị check rồi. Không phốt, không bùng, không đăng nhầm.'],
          ['think', 'Ba chữ "không". Như ba lớp bảo hiểm. Hoặc ba lời nguyền.'],
          { c: 'ag_kol_prep', o: [
            { t: 'Xin số quản lý KOL để dự phòng.', fx: { uy: 2, set: { kol_backup: true } }, then: [
              ['kieu', 'Anh Ken. Mà Ken ít nghe máy lắm. Em nhắn Zalo, đừng gọi. Ken ghét bị gọi.'],
            ] },
            { t: '"Dạ em canh ạ."', fx: { rel: { kieu: 1 } }, then: [
              ['kieu', 'Ngoan. Intern biết tin người là intern sống lâu.'],
            ] },
          ] },
        ],
      },
      {
        who: 'suong', obj: 'Sương: "11:15 rồi, chưa thấy clip"', time: '11:15',
        scene: [
          ['suong', 'Em ơi, 11:15 rồi. Story Bông Bơ đang… ăn lẩu. Không có ly trà sữa nào.'],
          ['suong', 'Kênh bạn ấy vừa đăng clip khác: review nồi chiên không dầu. Gắn tag một brand khác.'],
          { c: 'ag_kol_first', o: [
            { t: 'Nhắn anh Ken ngay.', fx: { uy: 1, nl: -2 }, then: [
              { chat: [['ken', 'bạn ấy đang bận show em, tối mới check brief', true]] },
              ['think', 'Brief? Clip lẽ ra đã lên từ 11:00. Brief cái gì nữa?'],
            ] },
            { t: 'Báo chị Kiều.', fx: { rel: { kieu: 1 }, dr: 1 }, then: [
              ['kieu', 'Chắc bạn ấy lỡ giờ thôi. Bình tĩnh. Đừng báo chị Diệp vội.'],
              ['think', '"Đừng báo vội." Câu này có mùi.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:ken', obj: 'Anh Ken gọi lại! (nghe máy)', time: '13:00',
        call: { title: 'Ken (quản lý Bông Bơ) · gọi lại', people: ['ken', 'kieu', 'me'] },
        scene: [
          ['ken', 'Alo em. Bông Bơ hả? Bạn ấy đang quay show. Clip trà sữa tối đăng. Hoặc mai. Hoặc khi nào bạn ấy có mood.'],
          ['ken', 'Mà nói thật, bên kia trả cao hơn. Muốn đăng hôm nay thì thêm 30%. Chị Kiều biết mà. Lần nào cũng vậy.'],
          ['nar', 'Ô camera của chị Kiều im lặng. Hơi lâu.'],
          { c: 'ag_kol_call', o: [
            { t: '"Hợp đồng ghi 11:00 hôm nay. Em sẽ báo client là KOL vi phạm."', fx: { uy: 3, dr: 2, rel: { kieu: -1 }, set: { kol_firm: true } }, then: [
              ['ken', 'Ờ… thôi để anh nhắc bạn ấy. Đăng liền. Liền liền.'],
            ] },
            { t: '"Em cần trao đổi với chị Kiều trước ạ." Rồi cúp máy.', fx: { rel: { kieu: 1 }, set: { kol_secret: true } }, then: [
              { chat: [['kieu', 'em đừng nói với ai chuyện 30% nha. chị xử lý.', true]] },
            ] },
            { t: '"Anh vừa nói chị Kiều biết… lần nào cũng vậy?"', fx: { dr: 4, rel: { kieu: -3 }, set: { kieu_commission: true } }, then: [
              ['ken', 'Ủa… em không biết hả? Thôi, anh lỡ lời. Anh đi quay đây.'],
              ['think', 'Chị Kiều chọn KOL theo "hoa hồng". Và giờ mình biết.'],
              { if: f('tie_loc_kieu'), then: [['nar', 'Chiều đó bạn thấy anh Lộc và chị Kiều nói chuyện rất nhỏ ở cầu thang. Như vợ chồng cãi nhau. Rất giống.']] },
            ] },
          ] },
        ],
      },
      {
        who: 'diep', obj: 'Báo chị Diệp: client đang chờ ảnh chụp màn hình', time: '15:00',
        scene: [
          ['diep', 'Client hỏi rồi đó em. Ảnh chụp màn hình đâu?'],
          { if: f('kol_firm'), then: [['nar', '14:52 Bông Bơ đăng clip. Caption còn nguyên dòng "[CHÈN HASHTAG CHIẾN DỊCH]". Sương sửa bằng một comment ghim trong 40 giây.']] },
          { c: 'ag_kol_client', o: [
            { t: 'Báo thật với client, đề xuất 3 KOC thay thế, agency bù phí.', fx: { uy: 4, rel: { diep: 2 }, set: { kol_honest: true } }, then: [
              ['diep', 'Client hơi giận, nhưng thích việc mình nói trước khi họ tự phát hiện. Họ hỏi tên em đó.'],
            ] },
            { t: 'Đợi KOL đăng rồi gửi, coi như trễ chút thôi.', fx: { dr: 2, nl: -4 }, then: [
              ['diep', 'Ok… client hỏi sao trễ. Chị nói "thuật toán". Anh Lộc dạy chị câu đó.'],
              ['loc', 'Thuật toán đổi rồi. Lúc nào cũng đúng.'],
            ] },
            { t: 'Kể với chị Diệp chuyện "thêm 30%" của anh Ken.', when: (r) => !!(r.flags.kieu_commission || r.flags.kol_secret), fx: { dr: 3, rel: { diep: 2, kieu: -2 }, set: { told_diep_kol: true } }, then: [
              ['diep', '…Chị nghi lâu rồi. Cảm ơn em. Chuyện này chị nói với anh Tùng. Em đừng nói ai.'],
              ['think', 'Ở agency, mọi bí mật đều kết thúc bằng câu "em đừng nói ai".'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `KOL bùng. ${s.flags.kieu_commission ? 'Mình biết chuyện "hoa hồng" của chị Kiều. Không biết nên vui hay sợ.' : 'Anh Ken nói "tối mới check brief". Clip lẽ ra lên lúc 11:00.'} ${s.flags.kol_honest ? 'Mình báo thật với client. Họ hỏi tên mình.' : 'Client nhận ảnh chụp màn hình trễ. Lý do: thuật toán.'}`,
  },

  // ---------------------------------------------------------------- 6
  {
    id: 'insight9', minDay: 9, maxDay: 11, title: 'Insight thứ 9',
    intro: 'Anh Quân trả slide insight Mì Ông Táo cho bạn. Lần thứ chín.\n\nComment duy nhất, chữ đỏ, cỡ 40: "ĐÂY LÀ OBSERVATION."',
    steps: [
      {
        who: 'quan', obj: 'Anh Quân trả slide lần thứ 9', time: '10:00',
        scene: [
          ['quan', 'Lần thứ chín. Em viết "Người Việt ăn mì gói vì tiện". Tiện là observation. Ai cũng biết. Client biết. Mì cũng biết.'],
          ['quan', 'Insight là sự thật ngầm hiểu. Là cái người ta làm mà không nói ra. Anh cần nó trước 16:00.'],
          { c: 'ag_in9_way', o: [
            { t: 'Lấy insight của một case quốc tế nổi tiếng, đổi "pizza" thành "mì".', fx: { uy: 2, set: { insight_copied: true } }, then: [
              ['quan', '…Hay! Rất hay. Sao nghe quen quen. Thôi kệ, hay là được.'],
              ['think', 'Quen là vì nó đoạt giải năm 2018.'],
            ] },
            { t: 'Xuống pantry phỏng vấn người thật đang ăn mì.', fx: { nl: -4, set: { insight_field: true } }, then: [
              ['quan', 'Phỏng vấn? Không có framework hả? …Thôi được, nhưng mang theo cái ma trận này.'],
            ] },
            { t: '"Anh tìm insight hay nhất của anh bằng cách nào ạ?"', fx: { rel: { quan: 2 }, set: { insight_field: true } }, then: [
              ['quan', '…Anh tìm trong slide của người khác. Đùa thôi. Không đùa đâu. Đi phỏng vấn người thật đi em.'],
            ] },
          ] },
        ],
      },
      {
        who: 'phat', obj: 'Phỏng vấn "người tiêu dùng thật" ở pantry', time: '11:30', when: f('insight_field'),
        pos: { phat: 'lunch1', vy: 'lunch2', thi: 'lunch3' },
        scene: [
          ['nar', 'Pantry. Ba người đang ăn mì Ông Táo. Đây là mẫu nghiên cứu lớn nhất từng có ở Trend Trễ.'],
          ['phat', 'Anh ăn mì vì… nhà có một cái nồi. Rửa nồi mệt. Mì nấu bằng ấm siêu tốc, rót vô ly, khỏi rửa.'],
          ['vy', 'Anh ăn mì lúc 2 giờ sáng vì nó là thứ duy nhất không hỏi anh "sửa xong chưa".'],
          ['thi', 'Mình ăn mì vì gói mì là thứ duy nhất trong ngày có hướng dẫn rõ ràng. "Nấu 3 phút." Không ai đổi ý.'],
          { mini: INSIGHT_MINI,
            good: [['think', '"Người ta không ngại nấu mì. Người ta ngại rửa nồi." Đây rồi.'], { fx: { uy: 3, rel: { phat: 1 }, set: { insight_real: true } } }],
            bad: [['think', 'Ghi được nhiều câu. Không chắc câu nào là insight. Mang hết lên cho anh Quân.'], { fx: { nl: -3, set: { insight_half: true } } }],
          },
        ],
      },
      {
        who: 'quan', obj: 'Nộp insight cho anh Quân trước 16:00', time: '15:30',
        scene: [
          { if: f('insight_real'), then: [
            ['quan', '"Người ta không ngại nấu mì. Người ta ngại rửa nồi."'],
            ['nar', 'Anh Quân im lặng mười giây. Rồi xóa ma trận 2x2 trên bảng.'],
            ['quan', 'Cái này… không cần framework. Anh ghét điều đó. Nhưng nó đúng.'],
            { fx: { uy: 5, rel: { quan: 3 } } },
          ], else: [
            { if: f('insight_copied'), then: [
              ['quan', 'Anh đưa insight của em vào deck. Anh Khải đọc, nói đúng một câu: "Năm 2018, giải Vàng, pizza."'],
              ['quan', '…Em biết không?'],
              { c: 'ag_in9_admit', o: [
                { t: 'Thừa nhận và xin làm lại.', fx: { uy: -1, rel: { quan: 1 }, set: { insight_admitted: true } }, then: [
                  ['quan', 'Ít nhất em nói thật. Anh cũng từng làm vậy. Năm 2019. Cũng pizza.'],
                ] },
                { t: 'Nói là "lấy cảm hứng".', fx: { uy: -3, dr: 3, rel: { quan: -2 } }, then: [
                  ['khai', 'Cảm hứng là khi em đổi cả câu. Em chỉ đổi chữ pizza.'],
                ] },
              ] },
            ], else: [
              ['quan', 'Nhiều câu quá. Nhưng câu "ngại rửa nồi" nằm ở trang 3. Lần sau đưa nó lên trang 1.'],
              { fx: { uy: 2, rel: { quan: 1 } } },
            ] },
          ] },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải đọc insight', time: '16:15', when: f('insight_real'),
        scene: [
          ['khai', 'Insight rửa nồi. Ai tìm ra?'],
          { c: 'ag_in9_credit', o: [
            { t: '"Em, với anh Phát, Vỹ, Thi ở pantry ạ."', fx: { rel: { phat: 1, vy: 1, thi: 1, khai: 1 } }, then: [
              ['khai', 'Ghi tên cả bốn. Pantry là phòng nghiên cứu tốt nhất công ty. Rẻ nhất nữa.'],
            ] },
            { t: '"Anh Quân ạ."', fx: { rel: { quan: 2 }, set: { quan_owes: true } }, then: [
              ['quan', '(nhìn bạn, gật nhẹ) Anh nợ em một lần.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.insight_real ? 'Insight thứ 9: "Người ta không ngại nấu mì. Người ta ngại rửa nồi." Anh Quân xóa ma trận 2x2. Lần đầu mình thấy một planner im lặng.'
      : s.flags.insight_copied ? 'Mình đổi chữ "pizza" thành "mì". Anh Khải nhận ra trong một giây. Bài học: ngành này ai cũng nhớ các case đoạt giải.'
        : 'Insight thứ 9 vẫn nằm ở trang 3. Lần sau mình sẽ đưa nó lên trang 1.'),
  },

  // ---------------------------------------------------------------- 7
  {
    id: 'motorbike', minDay: 10, maxDay: 12, title: 'Xe máy bay qua cầu',
    intro: 'Chị Diệp vừa hứa với Răng Xinh một video viral: "xe máy bay qua cầu, khói trắng thành chữ Răng Xinh". Ngân sách: 30 triệu.\n\nAnh Phát nghe xong, đi pha một ấm trà rất đặc.',
    steps: [
      {
        who: 'diep', obj: 'Chị Diệp hào hứng kể ý tưởng đã hứa với client', time: '10:00',
        scene: [
          ['diep', 'Anh Tuấn bên Răng Xinh mê lắm! Xe máy bay qua cầu, khói trắng thành chữ "Răng Xinh". Viral chắc!'],
          ['diep', 'Mình có 30 triệu và mười ngày. Em qua hỏi anh Phát xem quay sao nha.'],
          { c: 'ag_moto_ask', o: [
            { t: '"Chị hứa với client trước khi hỏi production hả chị?"', fx: { uy: 1, rel: { diep: -1, phat: 1 } }, then: [
              ['diep', '…Ờ. Lúc đó client vui quá. Client vui là chị… quên.'],
            ] },
            { t: '"Dạ em qua hỏi liền."', fx: { rel: { diep: 1 } }, then: [
              ['think', 'Ba mươi triệu. Bằng tiền thuê một cái cần cẩu trong hai tiếng. Mình đoán vậy.'],
            ] },
          ] },
        ],
      },
      {
        who: 'phat', obj: 'Hỏi anh Phát: quay được không?', time: '10:30',
        scene: [
          ['phat', 'Quay được. Không phải với ngân sách này. Không phải với luật giao thông này. Không phải với vật lý này.'],
          ['phat', 'Anh nói hoài: hứa gì với client thì hỏi production trước. Không ai nghe. Như hét vào bể bơi.'],
          { mini: PROD_MINI,
            good: [['phat', 'Đúng thứ tự. Em đưa cái này cho chị Diệp, may ra chị ấy hiểu vì sao anh tóc bạc.'], { fx: { uy: 2, rel: { phat: 2 } } }],
            bad: [['phat', 'Quay trước khi client duyệt kịch bản hả? Em sẽ hợp với nghề này. Theo nghĩa xấu.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải: "Không bao giờ"', time: '14:00',
        scene: [
          ['khai', 'Xe máy bay qua cầu. Không. Không bao giờ. Anh không để tên agency lên một con vịt 3D.'],
          ['diep', '(từ xa) Anh Khải! Em hứa với client rồi!'],
          ['khai', 'Thì em quay đi.'],
          ['nar', 'Hai người cùng quay sang nhìn bạn. Bạn đang đứng đúng giữa. Như luôn luôn.'],
          { c: 'ag_moto', o: [
            { t: 'Đứng về phía chị Diệp: tìm freelancer 3D giá rẻ.', fx: { dr: 2, rel: { diep: 2, khai: -2 }, set: { moto_duck: true } }, then: [
              ['nar', 'Freelancer gửi demo lúc 17:00. Chiếc xe máy bay qua cầu, hơi giống một con vịt. Rất giống.'],
            ] },
            { t: 'Đứng về phía anh Khải: chị Diệp nên nói lại với client.', fx: { rel: { khai: 2, diep: -2 }, set: { moto_refuse: true } }, then: [
              ['diep', '…Ok. Chị đi xin lỗi anh Tuấn. Một mình.'],
              ['think', 'Chị ấy cầm cả ba điện thoại đi ra cầu thang.'],
            ] },
            { t: 'Đề xuất stop-motion: xe máy đồ chơi "bay" qua cây cầu làm bằng bàn chải đánh răng.', fx: { uy: 5, rel: { khai: 2, diep: 2, phat: 2 }, set: { stopmotion: true } }, then: [
              ['khai', '…Bàn chải làm cầu. Kem đánh răng làm khói. Cái này có hồn.'],
              ['phat', 'Quay được. VỚI ngân sách này. Lần đầu trong năm anh nói câu đó.'],
              ['diep', 'Anh Tuấn mê! Ảnh còn hỏi làm TikTok được không!'],
            ] },
          ] },
        ],
      },
      {
        who: 'diep', obj: 'Tìm chị Diệp (chị ấy ra phía cửa thoát hiểm)', time: '16:00', pos: { diep: 'x3' },
        scene: [
          { if: f('moto_refuse'), then: [
            ['nar', 'Chị Diệp ngồi ở bậc cầu thang thoát hiểm. Mắt đỏ. Điện thoại thứ ba vẫn rung.'],
            ['diep', 'Không sao. Chị chỉ ra đây thở. Ở đây sóng yếu, client gọi không tới.'],
            { c: 'ag_moto_stairs', o: [
              { t: 'Ngồi xuống cạnh chị, không nói gì.', fx: { rel: { diep: 3 } }, then: [
                ['diep', 'Cảm ơn em. Năm phút nữa chị tô lại son rồi vô. Đừng kể ai nha.'],
              ] },
              { t: 'Mang cho chị một ly nước.', fx: { nl: -2, rel: { diep: 2 } }, then: [
                ['diep', 'Nước lọc. Ở agency, nước lọc là một cử chỉ rất lãng mạn.'],
              ] },
            ] },
          ], else: [
            { if: f('moto_duck'), then: [
              ['diep', 'Anh Tuấn xem demo. Ảnh hỏi: "Sao xe máy có mỏ?"'],
              ['vy', 'Không phải mỏ. Là đèn pha. Hơi… cong.'],
              { fx: { dr: 2 } },
            ], else: [
              ['diep', 'Anh Tuấn duyệt bản stop-motion rồi. Lần đầu tiên trong năm, chị không phải ra cầu thang.'],
              ['diep', 'Chị ra đây chỉ để gọi cho mẹ. Cảm giác lạ ghê.'],
              { fx: { rel: { diep: 1 } } },
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.stopmotion ? 'Xe máy đồ chơi bay qua cầu bàn chải. Anh Phát nói "quay được, VỚI ngân sách này". Lịch sử.'
      : s.flags.moto_duck ? 'Xe máy 3D có mỏ. Vỹ gọi đó là "đèn pha cong". Client hỏi sao xe có mỏ.'
        : 'Mình đứng về phía anh Khải. Chị Diệp ra cầu thang thoát hiểm. Mình ngồi với chị năm phút.'),
  },

  // ---------------------------------------------------------------- 8
  {
    id: 'pitch_night', minDay: 15, maxDay: 16, title: 'Pitch Bia Hơi Phố',
    intro: 'Ba đêm làm deck pitch Bia Hơi Phố. Miễn phí. Anh Tùng gọi đây là "đầu tư". Chị Hồng gọi đây là "chi phí chìm".\n\nPitch lúc 15:00 hôm nay. Deck đang có 80 trang. Client cho 20 phút.',
    steps: [
      {
        who: 'quan', obj: 'Anh Quân: cắt deck 80 trang còn 20', time: '09:30',
        scene: [
          ['quan', 'Deck 80 trang. Client cho 20 phút. Mỗi trang 15 giây. Không ai đọc kịp chữ nào.'],
          ['quan', 'Trong đó 40 trang là framework của anh. Anh biết. Đừng nhìn anh vậy.'],
          { mini: DECK_MINI,
            good: [['quan', 'Đúng mạch. Anh bỏ được 60 trang framework. Đau. Nhưng đúng.'], { fx: { uy: 3, rel: { quan: 2 } } }],
            bad: [['quan', 'Ngân sách trước insight hả? Client sẽ thấy giá trước khi thấy lý do. Sửa lại.'], { fx: { nl: -4 } }],
          },
        ],
      },
      {
        who: 'linh', obj: 'Linh kéo bạn ra cửa sổ nói nhỏ', time: '11:00', pos: { linh: 'window' },
        scene: [
          ['linh', 'Bạn ơi… tối qua mẹ mình nói bên Bia Hơi Phố chọn agency rồi. Pitch hôm nay là "cho đủ quy trình".'],
          ['linh', 'Nói với anh Tùng thì lộ mẹ mình. Không nói thì cả công ty thức ba đêm cho vui.'],
          { c: 'ag_pitch_leak', o: [
            { t: '"Bạn nói với chị Diệp đi, mình đi cùng."', fx: { rel: { linh: 3, diep: 1 }, set: { pitch_leak_told: true } }, then: [
              ['linh', '…Ok. Bạn đi cùng mình nha.'],
              ['diep', 'Chị đoán vậy lâu rồi. Nhưng anh Tùng vẫn muốn pitch. "Để họ nhớ mặt mình."'],
            ] },
            { t: '"Đừng nói. Lỡ mẹ bạn nghe nhầm thì sao."', fx: { rel: { linh: 1 }, set: { pitch_leak_hidden: true } }, then: [
              ['linh', 'Ừ… chắc vậy. Mẹ mình hay nghe nhầm lắm. Hồi đó mẹ nghe nhầm mình đậu Ngoại thương.'],
            ] },
            { t: '"Vậy mình làm cho thật hay, để lần sau họ chọn mình."', fx: { uy: 2, rel: { linh: 2 }, set: { pitch_spirit: true } }, then: [
              ['linh', 'Bạn nói giống video động lực ghê. Nhưng… ok. Làm cho hay.'],
            ] },
          ] },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải chốt big idea', time: '13:00',
        scene: [
          ['khai', 'Big idea đang là "Bia Hơi Phố: Vỉa hè là của chung". Nghe như biển báo của phường.'],
          ['khai', 'Ai có gì đau hơn không? Năm phút.'],
          { c: 'ag_pitch_idea', o: [
            { t: 'Đề xuất: "Một ly cho người ở lại", về những người không về quê dịp Tết.', fx: { uy: 4, rel: { khai: 3 }, set: { pitch_idea_mine: true } }, then: [
              ['khai', '…Một ly cho người ở lại. Cái này đau. Đau đúng chỗ.'],
              ['thi', 'Mình viết manifesto được. Cho mình hai tiếng và một ly cà phê sữa.'],
              { if: f('asked_ip'), then: [['tung', 'Ghi tên tác giả vào trang ý tưởng nha. Hồng nói mình có điều khoản bản quyền.']] },
            ] },
            { t: 'Để Thi đề xuất, bạn lo slide.', fx: { rel: { thi: 2 } }, then: [
              ['thi', '"Vỉa hè có ghế nhựa, ghế nhựa có chuyện." …Chưa đau lắm. Nhưng đẹp.'],
              ['khai', 'Tạm.'],
            ] },
            { t: 'Đề xuất "Make it pop: tiếng mở lon" cho anh Tùng vui.', fx: { dr: 2, rel: { tung: 2, khai: -2 } }, then: [
              ['tung', 'POP! Anh nói rồi mà!'],
              ['khai', 'Bia hơi không có lon, anh.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:tung', obj: 'Pitch bắt đầu! (vào cuộc gọi)', time: '15:00',
        call: { title: 'Pitch Bia Hơi Phố × Trend Trễ · online', people: ['tung', 'diep', 'khai', 'me'] },
        scene: [
          ['tung', 'Xin chào anh chị Bia Hơi Phố! Hôm nay Trend Trễ mang tới một ý tưởng… rất pop!'],
          ['nar', 'Phía client có bốn ô camera tắt. Một ô bật, quay thẳng lên trần nhà.'],
          ['diep', 'Dạ, mời bạn {ten} trình bày phần insight ạ.'],
          ['think', 'Không ai báo trước là mình trình bày.'],
          { c: 'ag_pitch_present', o: [
            { t: 'Nói ngắn: một insight, một câu chuyện, một con số.', fx: { uy: 4, rel: { diep: 2 }, set: { pitch_spoke: true } }, then: [
              ['nar', 'Ô camera trần nhà bật mic: "Ý này hay. Ai nghĩ vậy em?"'],
              ['think', 'Một câu hỏi. Từ một cái trần nhà. Nhưng là câu hỏi.'],
            ] },
            { t: 'Đọc nguyên văn slide.', fx: { nl: -4 }, then: [
              ['nar', 'Bạn đọc 6 trang. Phía client có ai đó quên tắt mic: "…ừ, xong chưa…"'],
            ] },
            { t: '"Dạ chị Diệp trình bày giúp em ạ."', fx: { rel: { diep: -1 } }, then: [
              ['diep', 'À… ok. (nhắn riêng) lần sau chị báo trước. xin lỗi em.'],
            ] },
          ] },
          ['nar', 'Client nói: "Bên chị sẽ phản hồi trong tuần." Anh Tùng đã bắt đầu tìm homestay Đà Lạt.'],
        ],
      },
      {
        who: 'tung', obj: 'Anh Tùng gọi mọi người: có kết quả pitch', time: '17:30', pos: { tung: 'coach' },
        scene: [
          ['tung', 'Mọi người… Bia Hơi Phố phản hồi rồi. Nhanh hơn dự kiến. Họ chọn agency khác.'],
          ['tung', 'Lý do: "chi phí". Mà pitch mình free… nên chắc là chi phí triển khai.'],
          { if: f('pitch_leak_told'), then: [['diep', '(nhìn bạn và Linh, lắc đầu nhẹ) Ít nhất mình biết trước. Đỡ có người khóc ở cầu thang.']] },
          ['tung', 'Không sao! Kinh nghiệm! Đà Lạt… để quý sau.'],
          ['phat', '(nhỏ) Đà Lạt, quý sau. Lần thứ bảy.'],
          { c: 'ag_pitch_after', o: [
            { t: 'Lưu một bản deck có tên mình vào thư mục cá nhân.', fx: { uy: 1, set: { deck_saved: true } }, then: [
              ['think', 'Ý tưởng này của mình. Dù không ai mua.'],
            ] },
            { t: 'Rủ cả team đi ăn ốc.', fx: { money: -80_000, nl: 10, rel: { thi: 1, vy: 1, phat: 1 } }, then: [
              ['nar', 'Bàn ốc. Không ai nói về pitch. Vỹ vẽ chân dung anh Khải lên giấy lót bàn, ký tên "chưa đủ đau".'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Thua pitch Bia Hơi Phố. ${s.flags.pitch_idea_mine ? '"Một ly cho người ở lại" là ý của mình. Anh Khải nói nó đau đúng chỗ.' : 'Big idea là của cả team. Không đủ đau.'} ${s.flags.pitch_spoke ? 'Một cái trần nhà hỏi "ai nghĩ vậy em?".' : ''} Đà Lạt: quý sau, lần thứ bảy.`,
  },

  // ---------------------------------------------------------------- 9
  {
    id: 'crisis', minDay: 17, maxDay: 18, title: '23:07, "mì có sâu"',
    intro: 'Đêm qua, 23:07. Điện thoại bạn rung. Không phải chị Diệp. Là Sương: "EM ƠI ONLINE KHÔNG".\n\nMột bài đăng tố "mì Ông Táo có sâu" đang lan nhanh: 1.500 share. Chị Diệp offline. Client chưa biết.',
    steps: [
      {
        who: 'obj:desk', obj: 'Về bàn. Nhớ lại đêm qua…', time: '09:30',
        scene: [
          ['nar', '(Đêm qua, 23:07.) Sương gửi link. Ảnh một tô mì, một con sâu, dòng chữ "Mì Ông Táo ăn tới gói thứ ba mới thấy 🤮".'],
          ['suong', '(23:09) Chị đang canh. Share tăng 200 mỗi 10 phút. Chị Diệp tắt máy rồi. Em gọi được ai không?'],
          { c: 'ag_crisis_night', o: [
            { t: 'Gọi chị Diệp (cả ba số) tới khi chị bắt máy.', fx: { nl: -10, uy: 4, rel: { diep: 3 }, set: { crisis_hero: true } }, then: [
              ['diep', '(23:31, giọng ngái ngủ) Alo… Ok. Cảm ơn em. Chị gọi chị Nguyệt liền. Sương soạn thông cáo tạm. Em ngủ đi.'],
              ['think', 'Mình không ngủ được. Nhưng mình đã làm đúng.'],
            ] },
            { t: 'Đợi sáng, 9:30 báo.', fx: { nl: 5, set: { crisis_late: true } }, then: [
              ['nar', 'Bạn úp điện thoại xuống. Ngủ được bốn tiếng. Mơ thấy sâu.'],
            ] },
            { t: 'Tự comment phản bác dưới bài bằng nick cá nhân.', fx: { dr: 6, set: { crisis_nick: true } }, then: [
              ['nar', 'Comment của bạn: "Fake đó mọi người, mì này ngon mà". Ba phút sau: "Ủa bạn này follow page Trend Trễ Agency nè 🤔".'],
            ] },
          ] },
        ],
      },
      {
        who: 'suong', obj: 'Sương: phòng tác chiến ở bàn social', time: '10:00',
        scene: [
          ['suong', 'Kiểm tra rồi. Ảnh con sâu là ảnh năm 2021, của một hãng mì khác. Có người cắt logo dán vào.'],
          { if: f('crisis_hero'), then: [['suong', 'Nhờ em gọi chị Diệp sớm, 1:00 sáng bên Ông Táo đã đăng thông báo đang kiểm tra. Share đứng ở 2.100.']] },
          { if: f('crisis_late'), then: [['suong', 'Share lên 9.000 rồi. Sếp chị Nguyệt đọc báo mới biết. Chị Nguyệt hỏi: "agency làm gì vậy?"'], { fx: { uy: -4, rel: { diep: -1 } } }] },
          { if: f('crisis_nick'), then: [['suong', 'Và… có bài mới: "Agency của Ông Táo dùng nick cãi khách". Ảnh chụp comment của em.'], { fx: { uy: -5, dr: 3, rel: { suong: -1 } } }] },
          ['suong', 'Giờ ra thông cáo. Ngắn, rõ, có bằng chứng. Em chọn câu giúp chị.'],
          { mini: STATEMENT_MINI,
            good: [['suong', 'Ba câu: bằng chứng, không đổ lỗi, có kênh liên hệ. Chị gửi chị Diệp duyệt.'], { fx: { uy: 3, rel: { suong: 2 }, set: { statement_ok: true } } }],
            bad: [['suong', 'Câu "kiện tới cùng" làm khủng hoảng sống thêm ba ngày. Để chị sửa.'], { fx: { dr: 2 } }],
          },
        ],
      },
      {
        who: 'call:nguyet', obj: 'Chị Nguyệt gọi khẩn! (nghe máy)', time: '11:00',
        call: { title: 'Ông Táo × Trend Trễ · KHẨN', people: ['nguyet', 'diep', 'suong', 'me'] },
        scene: [
          ['nguyet', 'Chị cần biết: ai phát hiện, lúc mấy giờ, và tại sao sếp chị biết trước chị.'],
          { if: f('crisis_hero'), then: [
            ['diep', 'Dạ, bạn {ten} phát hiện cùng Sương lúc 23:07, gọi em lúc 23:31. Em gọi chị lúc 23:40 ạ.'],
            ['nguyet', '…Cảm ơn em. Chị nhớ tên em. Lần đầu chị cảm ơn agency lúc 11 giờ sáng.'],
            { fx: { rel: { nguyet: 2 }, set: { client_praised: true } } },
          ], else: [
            ['nguyet', 'Lần sau chị cần biết trước sếp chị. Một tiếng thôi cũng được.'],
          ] },
          { c: 'ag_crisis_call', o: [
            { t: 'Đề xuất: liên hệ người đăng, gửi ảnh so sánh, mời tham quan nhà máy.', fx: { uy: 4, rel: { nguyet: 1 }, set: { crisis_plan: true } }, then: [
              ['nguyet', 'Mời tới nhà máy… ừ, minh bạch. Sếp chị sẽ thích chữ "minh bạch". Làm đi.'],
            ] },
            { t: 'Đề xuất: nhờ KOL đăng bài "mì Ông Táo sạch".', fx: { dr: 3 }, then: [
              ['suong', 'Không. KOL đăng lúc này là đổ dầu. Người ta sẽ hỏi "bao nhiêu tiền?".'],
              ['nguyet', 'Nghe Sương. Không KOL.'],
            ] },
            { t: 'Im lặng, để chị Diệp nói.', fx: { rel: { diep: 1 } }, then: [
              ['diep', 'Dạ bên em gửi kế hoạch trong 30 phút ạ.'],
              ['think', 'Ba mươi phút. Ai làm kế hoạch? À. Mình.'],
            ] },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Anh Tùng muốn "biến khủng hoảng thành cơ hội"', time: '15:00',
        scene: [
          ['tung', 'Mọi người! Khủng hoảng là cơ hội! Mình làm clip thử thách "ăn mì tìm sâu" đi! Make it pop!'],
          ['suong', 'Anh ơi… không.'],
          { c: 'ag_crisis_tung', o: [
            { t: '"Anh ơi, tuần này mình im lặng tử tế. Tuần sau mới vui được ạ."', fx: { uy: 3, rel: { tung: -1, suong: 2 } }, then: [
              ['tung', '…Ừ. Im lặng tử tế. Nghe hay đó. Ghi vô slide.'],
            ] },
            { t: 'Cười cho qua.', fx: { nl: -2 }, then: [
              ['tung', 'Không ai cười hả? Ok. Anh hiểu. Anh đi pha cà phê.'],
            ] },
          ] },
        ],
      },
      {
        who: 'suong', obj: 'Sương gục trên bàn', time: '17:00',
        scene: [
          ['nar', '17:00. Sương gục trên bàn, tay vẫn cầm điện thoại. Màn hình: đường cảm xúc tiêu cực đang đi xuống.'],
          { c: 'ag_crisis_suong', o: [
            { t: 'Đắp áo khoác cho Sương, canh giúp 30 phút.', fx: { nl: -5, rel: { suong: 3 } }, then: [
              ['suong', '(tỉnh dậy) …Em canh giúp chị hả? Lần đầu có người canh giúp. Cảm ơn bé.'],
            ] },
            { t: 'Đánh thức Sương, bảo về ngủ.', fx: { uy: 1, rel: { suong: 1 } }, then: [
              ['suong', 'Về? Ừ… "về" là một khái niệm hay. Chị sẽ thử.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.crisis_hero ? 'Đêm qua mình gọi chị Diệp lúc 23:31. Hôm nay chị Nguyệt nói "chị nhớ tên em". Con sâu là ảnh năm 2021.'
      : s.flags.crisis_nick ? 'Mình comment bằng nick cá nhân. Giờ mình là một bài báo. Bài học: internet nhớ mọi thứ, kể cả người mình follow.'
        : 'Mình đợi tới sáng. Sếp client biết trước client. Lần sau mình sẽ gọi, dù là 23:07.'),
  },

  // ---------------------------------------------------------------- 10
  {
    id: 'nephew', minDay: 19, maxDay: 23, title: 'Cháu sếp làm design',
    intro: 'Anh Tuấn (Răng Xinh) gửi một KV "tham khảo" do cháu ảnh, Bin, 19 tuổi, làm trên Canva.\n\nKèm tin nhắn: "Bin có năng khiếu lắm em. Mình dùng bản này luôn nha, đỡ tốn." Vỹ đã tháo tai nghe. Điều đó chưa từng xảy ra.',
    steps: [
      {
        who: 'vy', obj: 'Vỹ: "Em nhìn cái này đi"', time: '10:00',
        scene: [
          ['vy', 'Bảy font. BẢY. Anh có 47 font và chưa bao giờ dùng quá hai trong một KV.'],
          ['vy', 'Logo bị kéo dãn. Ảnh nền còn watermark. Và có hiệu ứng lửa. Kem đánh răng. Lửa.'],
          { mini: BIN_MINI,
            good: [['vy', 'Watermark, logo, sai tên. Ba cái này mà lên sóng là ra tòa, ra báo, ra đường. Em soi giỏi.'], { fx: { uy: 3, rel: { vy: 2 }, set: { bin_checked: true } } }],
            bad: [['vy', 'Em soi màu hồng? Màu hồng là lỗi nhỏ nhất. Cái watermark mới là cái kéo mình ra tòa.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp: "Trả lời anh Tuấn sao đây?"', time: '11:30',
        scene: [
          ['diep', 'Anh Tuấn thương cháu lắm. Bin học năm hai, muốn "có tên trong một chiến dịch thật".'],
          ['diep', 'Chê thẳng thì mất lòng. Dùng luôn thì mất mặt. Em nghĩ sao?'],
          { c: 'ag_bin', o: [
            { t: 'Giữ bảng màu của Bin, Vỹ làm lại layout, credit "concept màu: Bin".', fx: { uy: 4, rel: { diep: 2, vy: 1, tuan: 1 }, set: { bin_merge: true } }, then: [
              ['vy', '…Màu thì Bin chọn được. Layout là của anh. Ok. Anh chịu được.'],
              ['diep', 'Anh Tuấn vui. Bin vui. Vỹ… im lặng. Im lặng là đồng ý ở level Vỹ.'],
            ] },
            { t: 'Gửi anh Tuấn bảng 3 lỗi pháp lý, lịch sự, kèm bản sửa.', fx: { uy: 3, rel: { diep: 1, tuan: -1 }, set: { bin_legal: true } }, then: [
              ['diep', 'Anh Tuấn trả lời: "Ok em, an toàn là trên hết." Rồi rời nhóm Zalo năm phút. Rồi vào lại.'],
            ] },
            { t: 'Dùng luôn bản của Bin, chỉ xóa watermark.', fx: { dr: 4, rel: { vy: -3, tuan: 2 }, set: { bin_used: true } }, then: [
              ['vy', 'Xóa watermark không làm ảnh đó thành của mình. Anh nói vậy để sau này em nhớ là anh có nói.'],
              ['think', 'Câu đó nghe như một lời tiên tri.'],
            ] },
          ] },
        ],
      },
      {
        who: 'call:tuan', obj: 'Anh Tuấn gọi, có cả Bin (nghe máy)', time: '14:00',
        call: { title: 'Răng Xinh · "Bin muốn góp ý"', people: ['tuan', 'bin', 'diep', 'me'] },
        scene: [
          ['tuan', 'Anh cho Bin vào call luôn nha, cho cháu học hỏi.'],
          ['bin', 'Dạ em chào anh chị. Em thấy KV của bên mình hơi… cũ. Em nghĩ phải có lửa. Gen Z thích lửa.'],
          ['nar', 'Trong ô camera của Vỹ (đang tắt), có tiếng một cây bút chì gãy.'],
          { c: 'ag_bin_call', o: [
            { t: 'Hỏi Bin: "Lửa nói lên điều gì về kem đánh răng hả em?"', fx: { uy: 3, rel: { bin: 2 } }, then: [
              ['bin', '…Ờ. Vì… hơi thở thơm như… lửa? Không. Em không biết. Em chỉ thích lửa.'],
              ['tuan', 'Haha, Bin nó còn non. Thôi mình theo bên agency.'],
              ['think', 'Hỏi một câu đúng còn hơn cãi mười câu.'],
            ] },
            { t: 'Khen Bin cho anh Tuấn vui.', fx: { dr: 1, rel: { tuan: 2 } }, then: [
              ['bin', 'Thật hả? Vậy em làm thêm bản có rồng nha!'],
              { chat: [['diep', 'em vừa mở khóa con rồng. chúc mừng 🐉', true]] },
            ] },
            { t: 'Mời Bin qua agency thực tập một tuần "học nghề".', fx: { rel: { tuan: 3, vy: -1 }, set: { bin_intern: true } }, then: [
              ['tuan', 'Ý hay! Thứ Hai Bin qua nha!'],
              { chat: [['vy', 'em vừa mời một con rồng vào nhà.', true]] },
            ] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Vỹ cần một ly trà sữa', time: '16:00',
        scene: [
          ['vy', 'Anh không cần ôm. Anh cần một ly trà sữa. Size L. Vì tâm trạng.'],
          { if: f('bin_used'), then: [['vy', 'Và một luật sư.']] },
          { c: 'ag_bin_vy', o: [
            { t: 'Mua trà sữa cho Vỹ.', fx: { money: -45_000, rel: { vy: 3 } }, then: [
              ['vy', '…Cảm ơn. Sinh nhật em, anh vẽ chân dung em. Bản không có lửa.'],
            ] },
            { t: 'Rủ Vỹ chơi "đoán font" năm phút.', fx: { nl: 3, rel: { vy: 2 } }, then: [
              ['vy', 'Font này? Helvetica. Font này? Helvetica giả. Font này? …Bin. Font này là Bin.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.bin_merge ? 'Bin có tên trong credit "concept màu". Vỹ giữ được layout. Một ngày hiếm hoi mọi người cùng thắng.'
      : s.flags.bin_used ? 'Mình dùng KV của Bin, chỉ xóa watermark. Vỹ nói đó là lời tiên tri. Mình mong anh ấy sai.'
        : 'Mình gửi anh Tuấn bảng lỗi pháp lý. Anh rời nhóm Zalo năm phút. Rồi vào lại.'),
  },

  // ---------------------------------------------------------------- 11
  {
    id: 'zero', minDay: 22, maxDay: 25, title: 'Thêm một số 0',
    intro: 'Hôm qua anh Lộc nhờ bạn set chiến dịch quảng cáo cho app Lúa Vàng: ngân sách 500.000 đồng mỗi ngày.\n\nSáng nay anh Lộc mở dashboard, rồi đứng im. Như người vừa thấy hóa đơn điện tháng Năm.',
    steps: [
      {
        who: 'loc', obj: 'Anh Lộc gọi bạn lại xem dashboard', time: '09:45',
        scene: [
          ['loc', 'Em. Lại đây. Nhìn số này.'],
          ['nar', 'Ngân sách ngày: 5.000.000 đ. Đã tiêu: 4.812.000 đ. Bạn đếm lại số 0. Có một số 0 không có giấy phép.'],
          ['loc', 'CPM không cao. Thuật toán không đổi. Lần này… là mình.'],
          { c: 'ag_zero', o: [
            { t: '"Em gõ thừa số 0. Mình báo chị Diệp và client luôn anh."', fx: { uy: 3, rel: { loc: 2 }, set: { media_honest: true } }, then: [
              ['loc', 'Ừ. Báo. Anh đi cùng em. Anh từng giấu một lần, năm 2022. Không vui đâu.'],
            ] },
            { t: '"Mình chia đều chi phí vào mấy ngày sau, không ai biết đâu anh."', fx: { dr: 4, rel: { loc: -1 }, set: { media_hidden: true } }, then: [
              ['loc', '…Cuối tháng client đối soát hóa đơn. Họ có Excel. Excel biết hết.'],
              ['think', 'Câu đó nghe như rút ra từ kinh nghiệm cá nhân.'],
            ] },
            { t: 'Xem số trước đã: chi phí mỗi lượt đăng ký thế nào?', fx: { uy: 1, set: { media_analyze: true } }, then: [
              ['loc', '…Khoan. CPA thấp hơn kế hoạch 40%. Tiêu nhiều, nhưng tiêu khéo. Ờ.'],
            ] },
          ] },
        ],
      },
      {
        who: 'loc', obj: 'Anh Lộc dạy nhanh: đọc dashboard', time: '10:30',
        scene: [
          ['loc', 'Trước khi gặp client, em phải nói được bằng tiếng người. Anh hỏi nhanh.'],
          { mini: MEDIA_MINI,
            good: [['loc', 'Ok. Em nói tiếng media được rồi. Giờ nói tiếng người với client.'], { fx: { uy: 2, rel: { loc: 1 } } }],
            bad: [['loc', '"Cái anh Lộc đang thở dài" không phải chỉ số, dù nó cũng đang tăng. Thôi, để anh nói số.'], { fx: { nl: -2 } }],
          },
        ],
      },
      {
        who: 'diep', obj: 'Gặp chị Diệp trước khi báo client', time: '14:00',
        scene: [
          { if: f('media_honest'), then: [
            ['diep', 'Em tự nhận hả? …Ok. Mình xin bù bằng ngân sách tháng sau, agency chịu phí quản lý.'],
            ['diep', 'Lần sau sai, em cũng nhận nhanh vậy nha. Nhận nhanh thì rẻ.'],
            { fx: { rel: { diep: 2 } } },
          ] },
          { if: f('media_hidden'), then: [
            ['diep', 'Anh Lộc nói em muốn "chia đều"? Lúa Vàng là app tài chính. Họ đếm từng đồng. Nghề của họ là đếm.'],
            { fx: { rel: { diep: -2 }, dr: 2 } },
          ] },
          { if: f('media_analyze'), then: [
            ['diep', 'CPA thấp hơn 40%? Vậy mình báo thật, kèm số đẹp. Không gọi là "test có chủ đích". Gọi là "sai, nhưng có bài học".'],
          ] },
          { c: 'ag_zero_client', o: [
            { t: 'Viết email: nhận lỗi, số thật, đề xuất bù.', fx: { uy: 3, set: { zero_email: true } }, then: [
              ['diep', 'Client trả lời: "Cảm ơn bên em minh bạch. CPA tốt đó. Tháng sau tăng lên 1 triệu/ngày nha."'],
              ['loc', 'Tăng ngân sách vì mình sai. Ngành này kỳ lạ thật.'],
            ] },
            { t: 'Để chị Diệp lo, mình đứng sau.', fx: { nl: 3 }, then: [
              ['diep', 'Ok. Lần này chị lo. Lần sau em lo. Người ta lớn lên ở đây như vậy.'],
            ] },
          ] },
        ],
      },
      {
        who: 'hong', obj: 'Chị Hồng hỏi: ai chịu 4,3 triệu tiền ads thừa?', time: '16:00',
        scene: [
          ['hong', 'Bốn triệu ba tiền ads thừa. Client không chịu thì ai chịu?'],
          { c: 'ag_zero_pay', o: [
            { t: '"Em xin chịu một phần ạ."', fx: { money: -300_000, uy: 2, rel: { hong: 1 } }, then: [
              ['hong', 'Ba trăm nghìn. Tượng trưng thôi. Chị không cần tiền em. Chị muốn em nhớ số 0.'],
            ] },
            { t: '"Cái này agency chịu được không chị?"', fx: { rel: { hong: -1 } }, then: [
              ['hong', 'Agency là ai? Agency là lương tháng sau của tất cả mọi người. …Thôi được, lần này.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Một số 0 thừa, 4,8 triệu. ${s.flags.media_honest ? 'Mình nhận lỗi ngay. Client tăng ngân sách. Ngành này kỳ lạ thật.' : s.flags.media_hidden ? 'Mình đề nghị "chia đều". Chị Diệp nói khách hàng là người đếm tiền chuyên nghiệp.' : 'CPA tốt hơn 40%. Sai, nhưng có bài học.'}`,
  },

  // ---------------------------------------------------------------- 12
  {
    id: 'drinks', minDay: 23, maxDay: 26, title: 'Nhậu mừng nghiệm thu',
    intro: 'Chiến dịch Răng Xinh nghiệm thu. Anh Tuấn mời "cả team đi ăn mừng, nhẹ thôi".\n\nTrong ngành này, "nhẹ thôi" là đơn vị đo chưa được quốc tế công nhận.',
    steps: [
      {
        who: 'hong', obj: 'Chị Hồng: hồ sơ nghiệm thu còn thiếu', time: '10:00',
        scene: [
          ['hong', 'Răng Xinh nghiệm thu mà hồ sơ thiếu. Không bằng chứng, không hóa đơn. Không hóa đơn, không tiền.'],
          { mini: PROOF_MINI,
            good: [['hong', 'Đủ bộ. Hóa đơn đi chiều nay. Em vừa cứu lương tháng sau của chị.'], { fx: { uy: 3, rel: { hong: 2 }, set: { acceptance_ok: true } } }],
            bad: [['hong', 'Sticker 👍 không phải chữ ký, em ạ. Dù chị ước nó là vậy.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp dặn trước buổi nhậu', time: '14:00',
        scene: [
          ['diep', 'Tối nay anh Tuấn và sếp ảnh, anh Hưng, sẽ ép uống. Em không uống được thì nói từ đầu. Đừng nói giữa chừng.'],
          ['diep', 'Nếu anh Hưng hỏi "khi nào agency giảm giá", em cười. Cười thôi. Đừng trả lời.'],
          { c: 'ag_drink_plan', o: [
            { t: '"Em sẽ nói luôn là em uống nước ngọt ạ."', fx: { uy: 1, set: { plan_soft: true } }, then: [
              ['diep', 'Tốt. Nói từ đầu thì là chính kiến. Nói giữa chừng thì là… làm mất vui.'],
            ] },
            { t: '"Em uống được chút chút ạ."', fx: { rel: { diep: 1 }, set: { plan_drink: true } }, then: [
              ['diep', '"Chút chút" ở bàn anh Hưng là một đơn vị khác. Cẩn thận nha.'],
            ] },
          ] },
        ],
      },
      {
        who: 'thi', obj: 'Thi có một bài thơ cho buổi nhậu', time: '15:30',
        scene: [
          ['thi', 'Đi nhậu với client hả? Mình có bài thơ: "Ly đầu vì dự án / ly hai vì nể nang / ly ba vì anh Hưng / ly tư… không ai đếm".'],
          { c: 'ag_drink_thi', o: [
            { t: 'Hỏi Thi có đi không.', fx: { rel: { thi: 1 }, set: { thi_novel: true } }, then: [
              ['thi', 'Không. Mình ở lại viết tiểu thuyết. Chương 12: "Agency". Chương 13: "Agency, phần hai".'],
            ] },
            { t: 'Rủ Thi đi cùng cho vui.', fx: { rel: { thi: 2 } }, then: [
              ['thi', '…Ừ thì đi. Nhưng mình uống trà đá và quan sát. Copywriter đi nhậu là đi lấy chất liệu.'],
            ] },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Tập trung ở cửa ra quán', time: '17:30', pos: { tung: 'x3' },
        scene: [
          ['tung', 'Ok team! Đi thôi. Nhớ: hôm nay mình là agency vui vẻ. Make it… pop. Pop nắp bia.'],
          ['nar', '(Quán nướng, 19:00.) Anh Hưng bên Răng Xinh đứng dậy, rót đầy ly bia cho bạn: "Em intern hả? Trăm phần trăm với anh!"'],
          { c: 'ag_drink', o: [
            { t: 'Uống trăm phần trăm.', fx: { nl: -20, rel: { tuan: 2, tung: 1 }, set: { drank_today: true, drank_client: true } }, then: [
              ['nar', 'Anh Hưng vỗ vai bạn: "Được! Agency này được!" Ly thứ hai tới. Rồi ly thứ ba. Rồi bạn mất đếm.'],
            ] },
            { t: '"Dạ em xin phép uống nước ngọt, em chúc anh bằng ly này ạ."', fx: { uy: 3, rel: { tuan: 1 } }, then: [
              ['nar', 'Bàn nhậu "ồ" lên. Anh Hưng nheo mắt, rồi cười: "Được! Có chính kiến! Anh thích!"'],
              ['diep', '(nhỏ) Đẹp. Em vừa làm điều chị mất ba năm mới dám làm.'],
            ] },
            { t: 'Nhìn chị Diệp cầu cứu.', fx: { rel: { diep: 2 }, set: { owe_diep: true } }, then: [
              ['diep', 'Anh Hưng ơi, bé nó còn đi xe. Ly này em uống thay!'],
              ['nar', 'Chị Diệp uống thay bạn hai ly. Rồi ba. Bạn nợ chị một ân tình, và một tô phở sáng mai.'],
            ] },
          ] },
          ['tung', '(cuối buổi) Anh Hưng nói năm sau giao thêm ngân sách! Đà Lạt… vẫn để quý sau.'],
        ],
      },
    ],
    diary: (s) => `Nhậu mừng nghiệm thu. ${s.flags.drank_client ? 'Mình uống trăm phần trăm. Ly thứ ba trở đi thì không nhớ.' : s.flags.owe_diep ? 'Chị Diệp uống thay mình ba ly. Mình nợ chị một tô phở.' : 'Mình uống nước ngọt. Anh Hưng nói "có chính kiến". Chị Diệp nói mình làm được điều chị mất ba năm mới dám.'}`,
  },

  // ---------------------------------------------------------------- 13
  {
    id: 'viral_wrong', minDay: 24, maxDay: 29, title: 'Viral ngược',
    intro: 'Clip Tết của Trà Sữa Tâm Trạng lên sóng tối qua. Cảnh "con dâu lo hết Tết, chồng nằm xem TV" được cài vào làm hài.\n\nSáng nay: 2.000 comment. Không comment nào cười.',
    steps: [
      {
        who: 'suong', obj: 'Sương: đường cảm xúc tiêu cực dựng đứng', time: '09:45',
        scene: [
          ['suong', 'Tiêu cực 78%. Người ta nói clip "cổ xúy bất bình đẳng". Có bài báo mạng rồi.'],
          ['suong', 'Lần này không phải ảnh giả. Lần này là… mình làm thật.'],
          ['think', 'Kịch bản Thi viết. Anh Khải duyệt. Cảnh chồng nằm xem TV là client thêm vào vì "cho đời".'],
          { c: 'ag_vw_first', o: [
            { t: '"Ai duyệt không quan trọng bằng: mình xin lỗi sao cho đúng."', fx: { uy: 3, rel: { suong: 2 } }, then: [
              ['suong', 'Ừ. Tìm người đổ lỗi để sau. Trước tiên là dập lửa.'],
            ] },
            { t: '"Cảnh đó client thêm vào mà!"', fx: { dr: 2, rel: { diep: 1 } }, then: [
              ['suong', 'Đúng. Nhưng cư dân mạng không đọc biên bản họp. Họ chỉ thấy logo.'],
            ] },
          ] },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải họp gấp team creative', time: '10:30',
        scene: [
          ['khai', 'Im lặng chờ qua. Ba ngày là người ta quên. Mình là creative, không phải bên xin lỗi.'],
          ['thi', 'Em viết cảnh đó. Em… thấy không ổn từ đầu, nhưng em không nói.'],
          ['nar', 'Thi nhìn xuống bàn phím. Lần đầu bạn thấy Thi không có câu thơ nào.'],
          { c: 'ag_vw_khai', o: [
            { t: 'Nói với anh Khải: "Im lặng là để báo chí viết thay mình."', fx: { uy: 3, rel: { khai: -1, thi: 2 } }, then: [
              ['khai', '…Em nói như người làm PR mười năm. Được. Không im lặng.'],
            ] },
            { t: 'Đứng cạnh Thi: "Lỗi của cả team, không phải mình Thi."', fx: { rel: { thi: 3, khai: 1 } }, then: [
              ['khai', 'Ừ. Lỗi của anh trước. Anh duyệt.'],
              ['thi', '(nhỏ) Cảm ơn bạn.'],
            ] },
            { t: 'Không nói gì.', fx: { nl: 2, dr: 1, rel: { khai: 1 } }, then: [
              ['think', 'Mình im lặng. Và mình hiểu vì sao Thi đã im lặng.'],
            ] },
          ] },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp: soạn lời xin lỗi cho client đăng', time: '13:00',
        scene: [
          ['diep', 'Client đồng ý xin lỗi. Em với Sương soạn. Ngắn, rõ, nhận trách nhiệm. Chị nhắc: đừng viết "nếu có".'],
          { mini: APOLOGY_MINI,
            good: [['suong', 'Ba câu. Không "nếu có", không "hiểu lầm". Đăng trong 15 phút.'], { fx: { uy: 4, rel: { suong: 2, diep: 1 }, set: { apology_good: true } } }],
            bad: [['suong', 'Em chọn "nếu có làm ai tổn thương"… Câu đó là xăng. Đăng bản này là bị chửi lần hai.'], { fx: { dr: 4, set: { apology_bad: true } } }],
          },
        ],
      },
      {
        who: 'suong', obj: 'Xem phản ứng sau lời xin lỗi', time: '16:00',
        scene: [
          { if: f('apology_good'), then: [['suong', 'Tiêu cực giảm còn 41%. Có người comment: "Xin lỗi vậy mới là xin lỗi." Có báo viết bài khen cách xử lý.'], { fx: { uy: 2 } }] },
          { if: f('apology_bad'), then: [['suong', 'Bị chửi lần hai. Có người làm meme "nếu có". Meme đó share nhiều hơn clip gốc.'], { fx: { dr: 3 } }] },
          ['diep', 'Client hỏi agency có đề xuất gì để "lấy lại thiện cảm" không.'],
          { c: 'ag_vw_after', o: [
            { t: 'Đề xuất clip mới: người chồng vào bếp, không làm màu, không bắt ai "khen chồng".', fx: { uy: 3, rel: { khai: 1, thi: 1 }, set: { vw_fix: true } }, then: [
              ['khai', 'Không làm màu, không cài hài. Khó viết hơn clip cũ. Thi, em viết đi.'],
              ['thi', '…Ừ. Mình viết. Lần này mình sẽ nói khi thấy sai.'],
            ] },
            { t: 'Đề xuất tặng voucher để "lấy lại thiện cảm".', fx: { dr: 2 }, then: [
              ['suong', 'Voucher sau khủng hoảng giống tặng hoa sau khi cãi nhau. Người ta nhận hoa. Nhưng vẫn nhớ.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Viral ngược. ${s.flags.apology_good ? 'Lời xin lỗi ba câu. Có báo khen cách xử lý.' : 'Meme "nếu có" share nhiều hơn clip gốc. Bài học đắt.'} ${s.flags.vw_fix ? 'Thi nói lần sau sẽ lên tiếng khi thấy sai.' : ''}`,
  },

  // ---------------------------------------------------------------- 14
  {
    id: 'award', minDay: 29, maxDay: 33, title: 'Mùa giải thưởng',
    intro: 'Mùa nộp giải thưởng sáng tạo khu vực. Anh Khải lau cái standee "AWARD 2019 (shortlist)" rất kỹ.\n\nAnh muốn nộp chiến dịch Trà Sữa "Tâm trạng gì cũng có size". Người viết case study: bạn.',
    steps: [
      {
        who: 'khai', obj: 'Anh Khải giao viết case study', time: '10:00',
        scene: [
          ['khai', 'Case study 300 chữ. Kết quả phải "đau". Anh có số: reach 30 triệu.'],
          ['nar', 'Bạn mở báo cáo. Số thật: 3 triệu lượt hiển thị. Không phải reach. Và không có số 0 thứ bảy.'],
          ['khai', 'Ai cũng làm tròn. Ban giám khảo biết mà. Viết 30 triệu.'],
          { c: 'ag_award_num', o: [
            { t: 'Viết 30 triệu theo lời anh Khải.', fx: { dr: 3, rel: { khai: 2 }, set: { award_fake: true } }, then: [
              ['khai', 'Tốt. Giờ nó đau rồi.'],
              ['think', 'Nó đau thật. Ở chỗ lương tâm.'],
            ] },
            { t: 'Viết đúng 3 triệu, nhấn vào tỉ lệ chia sẻ cao gấp 4 lần trung bình ngành.', fx: { uy: 3, rel: { khai: -1 }, set: { award_true: true } }, then: [
              ['khai', 'Ba triệu. Nghe như số của một agency nhỏ. …Mà mình là agency nhỏ thật.'],
            ] },
            { t: 'Xin client số bán hàng thật, để có số "đau" mà đúng.', when: (r) => !!(r.flags.client_praised || r.flags.kol_honest || r.flags.vw_fix), fx: { uy: 5, rel: { khai: 2 }, set: { award_real: true } }, then: [
              ['diep', 'Client Trà Sữa gửi số rồi: ly size L tăng 37% trong 6 tuần. Họ nói "vì bên em làm ăn đàng hoàng".'],
              ['khai', 'Ba mươi bảy phần trăm. Số thật. Đau thật. Anh… không quen.'],
            ] },
          ] },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải điền danh sách credit', time: '14:00',
        scene: [
          ['khai', 'Phần credit. Creative Director: Khải. Copywriter: Thi. Designer: Vỹ. Account: Diệp.'],
          ['nar', 'Không có dòng nào cho người nghĩ ra câu "Tâm trạng gì cũng có size".'],
          { if: f('tagline_named'), then: [['think', 'Cỡ chữ 8 trong slide nội bộ. Không có trong case study.']] },
          { c: 'ag_award_credit', o: [
            { t: 'Hỏi riêng: "Anh ơi, ý ban đầu là của em. Em xin một dòng credit."', fx: { uy: 3, set: { credit_asked: true } }, then: [
              { if: (r) => !!(r.flags.tagline_named || r.flags.tagline_told_diep), then: [
                ['khai', '…Anh nhớ. Cỡ chữ 8. Lần này anh ghi cỡ chữ bình thường: "Idea: {ten} (intern)".'],
                { fx: { rel: { khai: 1 }, set: { credit_name: true } } },
              ], else: [
                ['khai', 'Ý ban đầu? Ở đây ý tưởng không có bố mẹ. Nhưng… thôi được. "Additional ideas: {ten}". Dòng cuối.'],
                { fx: { set: { credit_name: true } } },
              ] },
            ] },
            { t: 'Đăng LinkedIn kể "tôi đã nghĩ ra…" trước khi nộp.', fx: { dr: 6, rel: { khai: -4 }, set: { linkedin_rant: true } }, then: [
              ['nar', 'Bài đăng của bạn được 400 like. Một like là của CD agency đối thủ. Anh Khải không like. Anh Khải chụp màn hình.'],
            ] },
            { t: 'Im lặng. Tên mình trong slide nội bộ là đủ.', fx: { rel: { khai: 3 }, set: { credit_silent: true } }, then: [
              ['khai', '(nhìn bạn rất lâu, rồi gật nhẹ) Anh nợ em một lần.'],
            ] },
          ] },
        ],
      },
      {
        who: 'thi', obj: 'Thi kể chuyện cũ về cái standee 2019', time: '15:30',
        scene: [
          ['thi', 'Năm 2019, cái standee shortlist ở góc kia. Ý tưởng của mình. Credit ghi tên anh Khải.'],
          { if: f('tie_khai_thi'), then: [['thi', 'Hồi đó tụi mình… đang yêu nhau. Nên mình không nói. Giờ không yêu nữa, nhưng thói quen im lặng thì còn.']] },
          ['thi', 'Mình không giận. Mình chỉ viết một bài thơ. Sau đó viết thêm bốn mươi bài.'],
          { c: 'ag_award_thi', o: [
            { t: '"Năm nay Thi nói đi. Mình đi cùng."', fx: { rel: { thi: 3 }, set: { thi_brave: true } }, then: [
              ['thi', '…Ừ. Năm nay mình nói. Ít nhất là thử.'],
            ] },
            { t: '"Thi nên in tập thơ đó."', fx: { rel: { thi: 2 } }, then: [
              ['thi', 'Tên tập thơ: "Feedback nhẹ". Bạn thấy sao?'],
            ] },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Anh Tùng: "Nộp giải là đầu tư!"', time: '17:00',
        scene: [
          ['tung', 'Phí nộp giải 12 triệu một hạng mục. Mình nộp năm hạng mục! Thắng là có PR, có client, có Đà Lạt!'],
          ['hong', '(từ phòng kính) Sáu mươi triệu. Bằng phụ cấp của sáu mươi bạn intern một tháng. Mức một triệu.'],
          { c: 'ag_award_fee', o: [
            { t: '"Mình nộp một hạng mục mạnh nhất thôi anh."', fx: { uy: 2, rel: { hong: 2, tung: -1 } }, then: [
              ['tung', 'Một hạng mục… nghe ít pop. Nhưng ok. Hồng đang nhìn anh bằng ánh mắt Excel.'],
            ] },
            { t: '"Nộp hết đi anh! Make it pop!"', fx: { dr: 1, rel: { tung: 2, hong: -2 } }, then: [
              ['tung', 'ĐÚNG! Intern này hiểu anh!'],
              ['hong', 'Chị ghi nhận. Vào sổ. Mực đỏ.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `Mùa giải thưởng. ${s.flags.award_real ? 'Số thật: ly size L tăng 37%. Anh Khải nói anh không quen với số thật.' : s.flags.award_fake ? 'Mình viết "reach 30 triệu". Nó đau. Ở chỗ lương tâm.' : 'Mình viết đúng 3 triệu. Agency nhỏ, số nhỏ, nhưng thật.'} ${s.flags.credit_name ? 'Tên mình có trong credit.' : s.flags.linkedin_rant ? 'Bài LinkedIn được 400 like. Anh Khải chụp màn hình.' : ''}`,
  },

  // ---------------------------------------------------------------- 15
  {
    id: 'stolen', minDay: 31, maxDay: 37, title: 'Ý tưởng trôi',
    intro: 'Sáng nay Bia Hơi Phố tung chiến dịch Tết, do agency thắng pitch làm.\n\nTên chiến dịch nghe rất quen. Quen tới mức Thi làm rơi ly cà phê.',
    steps: [
      {
        who: 'thi', obj: 'Thi đưa điện thoại cho bạn xem', time: '09:45',
        scene: [
          ['thi', 'Nhìn đi. Bia Hơi Phố. Chiến dịch Tết. "Một ly cho người ở lại".'],
          { if: f('pitch_idea_mine'), then: [['thi', 'Câu của bạn. Trang 14 deck pitch của mình. Họ đổi font. Font xấu hơn.']],
            else: [['thi', 'Ý trong deck pitch của mình. Cái ý anh Khải gạch đi vì "chưa đủ đau". Họ làm, và nó đau.']] },
          ['nar', 'Clip của họ có 2 triệu view sau 6 tiếng. Comment top: "Agency nào làm mà tâm vậy?"'],
          { c: 'ag_st_feel', o: [
            { t: 'Đọc hết comment.', fx: { nl: -5, dr: 1 }, then: [['think', '"Tâm vậy." Ừ. Tâm của mình.']] },
            { t: 'Tắt điện thoại.', fx: { nl: 2 }, then: [['think', 'Không đọc. Không đọc. Không… đọc một cái thôi.']] },
          ] },
        ],
      },
      {
        who: 'linh', obj: 'Linh tới, mặt tái', time: '10:30',
        scene: [
          ['linh', 'Mình xin lỗi… Mẹ mình nói bên đó "lấy cảm hứng từ nhiều nguồn". Mẹ mình ngồi trong buổi pitch.'],
          ['linh', 'Mình chỉ muốn được đánh giá thật. Mà giờ mình là con của người duyệt cái ý lấy của bạn.'],
          { c: 'ag_st_linh', o: [
            { t: '"Không phải lỗi của Linh."', fx: { rel: { linh: 3 } }, then: [
              ['linh', '…Cảm ơn. Lần đầu có người ở đây nói chuyện với mình mà không nhắc tới mẹ mình.'],
            ] },
            { t: '"Linh hỏi mẹ một câu cho rõ được không?"', fx: { uy: 1, rel: { linh: 1 }, set: { linh_ask: true } }, then: [
              ['linh', 'Mình sẽ hỏi. Nhưng mẹ mình trả lời mọi câu bằng một câu: "Con còn nhỏ".'],
            ] },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Gặp anh Tùng', time: '13:00',
        scene: [
          ['tung', 'Anh thấy rồi. Chuyện thường ngày ở huyện. Pitch free thì ý tưởng cũng… free.'],
          { if: f('asked_ip'), then: [['hong', 'Điều khoản bản quyền mình có. Nhưng deck không đóng dấu, không ghi tác giả, không NDA. Có luật mà không có giấy.']] },
          { c: 'ag_st', o: [
            { t: 'Đăng Facebook so sánh hai chiến dịch.', fx: { dr: 7, uy: -2, rel: { tung: -2 }, set: { rant_post: true } }, then: [
              ['nar', 'Bài của bạn có 3.000 share. Agency kia im lặng. Một client tiềm năng nhắn Trend Trễ: "Bên em hay đăng chuyện nội bộ lên mạng hả?"'],
              ['tung', 'Em đúng. Nhưng đúng kiểu này tốn tiền.'],
            ] },
            { t: 'Đề xuất: mọi deck pitch từ nay đóng dấu, ghi tác giả, ký NDA trước khi trình.', fx: { uy: 4, rel: { tung: 1, hong: 2 }, set: { nda_process: true } }, then: [
              ['tung', '…Em làm quy trình đó đi. Anh ký. Make it… legal.'],
              ['hong', 'Lần đầu chị nghe anh Tùng nói chữ "legal". Chị ghi ngày.'],
            ] },
            { t: 'Ghi vào portfolio: "Ý tưởng đề xuất, pitch Bia Hơi Phố (không trúng)".', fx: { uy: 2, set: { portfolio_idea: true } }, then: [
              ['tung', 'Ừ. Portfolio là của em. Không ai lấy được dòng đó.'],
              { if: f('deck_saved'), then: [['think', 'May mà mình đã lưu bản deck có tên mình. Ngày ghi trên file là bằng chứng.']] },
            ] },
          ] },
        ],
      },
      {
        who: 'khai', obj: 'Anh Khải ngồi một mình nhìn standee 2019', time: '16:00',
        scene: [
          ['khai', 'Ý tưởng tốt thì bị lấy. Ý tưởng dở thì được duyệt. Mười năm làm nghề, công thức vẫn vậy.'],
          { if: f('pitch_idea_mine'), then: [['khai', 'Câu của em hay. Đủ hay để bị lấy. Đó là một kiểu giải thưởng. Không có cúp.']] },
          { c: 'ag_st_khai', o: [
            { t: '"Anh có bao giờ muốn ra riêng không?"', fx: { rel: { khai: 2 }, set: { khai_dream: true } }, then: [
              ['khai', 'Ngày nào cũng muốn. Rồi nhớ ra ai trả lương cho Thi, cho Vỹ. Rồi lại ngồi đây.'],
            ] },
            { t: 'Đưa anh Khải một ly cà phê, không nói gì.', fx: { nl: -1, rel: { khai: 1 } }, then: [
              ['khai', '…Cà phê gói. Đắng. Đúng tâm trạng. Cảm ơn.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => `"Một ly cho người ở lại" lên sóng. Không phải của mình nữa. ${s.flags.nda_process ? 'Mình viết quy trình NDA cho pitch. Anh Tùng nói "make it legal".' : s.flags.rant_post ? 'Bài Facebook của mình có 3.000 share. Anh Tùng nói đúng kiểu này tốn tiền.' : 'Mình ghi nó vào portfolio. Dòng đó không ai lấy được.'}`,
  },

  // ---------------------------------------------------------------- 16
  {
    id: 'debt', minDay: 36, maxDay: 39, title: 'Client nợ 90 ngày',
    intro: 'Ngân hàng Sen Hồng chưa thanh toán ba tháng. Lương tháng này của nhân viên chính thức có thể trễ.\n\nChị Hồng đã đổi hình nền máy tính thành ảnh một con heo đất bị đập.',
    steps: [
      {
        who: 'hong', obj: 'Chị Hồng nhờ "nhắc khéo" bên Sen Hồng', time: '10:00',
        scene: [
          ['hong', 'Ba tháng. Bốn trăm hai mươi triệu. Em gọi kế toán Sen Hồng nhắc khéo giúp chị. Khéo thôi. Ngân hàng nhạy cảm.'],
          { if: f('tie_hong_diep'), then: [['hong', 'Diệp là em ruột chị. Lương nó trễ là mẹ chị gọi chị. Nên… khéo nhưng nhanh nha em.']] },
          { c: 'ag_debt_way', o: [
            { t: 'Gọi nhắc khéo ngay.', fx: { nl: -3, set: { debt_called: true } }, then: [
              ['nar', 'Kế toán Sen Hồng: "Dạ hồ sơ đang trình ký em ạ." Bạn hỏi trình ai. "Dạ trình… cấp trên." Cuộc gọi bị rớt.'],
            ] },
            { t: 'Soát lại hồ sơ của mình trước khi gọi.', fx: { uy: 2, set: { debt_check: true } }, then: [
              ['hong', 'Ờ… đúng. Đòi tiền mà hồ sơ mình thiếu thì người ta có lý do giữ tiền.'],
            ] },
          ] },
        ],
      },
      {
        who: 'hong', obj: 'Soi hồ sơ thanh toán Sen Hồng', time: '11:00',
        scene: [
          ['hong', 'Đây. Ba tháng hồ sơ. Em tìm giúp chị chỗ nào mình làm thiếu.'],
          { mini: DEBT_MINI,
            good: [
              ['hong', 'Biên bản tháng 8 chưa ký vì… chưa ai gửi. Hóa đơn tháng 9 sai một số. Ba tháng nợ, một nửa là tại mình.'],
              { fx: { uy: 4, rel: { hong: 3 }, set: { debt_fixed: true } } },
            ],
            bad: [['hong', 'Ảnh KV khổ A0 không giúp đòi tiền, em ạ. Để chị soi lại. Mất buổi chiều.'], { fx: { nl: -4 } }],
          },
        ],
      },
      {
        who: 'diep', obj: 'Gặp chị Diệp về hồ sơ tháng 8', time: '14:00',
        scene: [
          { if: f('debt_fixed'), then: [
            ['diep', '…Chị quên gửi biên bản. Tháng 8 chị có bốn chiến dịch và một đám cưới. Của chính chị.'],
            ['diep', 'Chị gửi ngay. Cảm ơn em. Đừng kể với anh Tùng là tại chị nha.'],
            { c: 'ag_debt_diep', o: [
              { t: 'Giữ bí mật cho chị Diệp.', fx: { rel: { diep: 3 }, set: { covered_diep: true } }, then: [
                ['diep', 'Chị nợ em. Lần thứ… chị không đếm nữa.'],
              ] },
              { t: 'Đề xuất checklist nghiệm thu chung cho cả team.', fx: { uy: 3, rel: { diep: 1, hong: 2 }, set: { checklist: true } }, then: [
                ['diep', 'Checklist. Ừ. Để không ai phải nhớ gì nữa. Ở đây quên là bệnh nghề nghiệp.'],
              ] },
            ] },
          ], else: [
            ['diep', 'Sen Hồng nói đang trình ký. Ngân hàng trình ký thì… chắc tới Tết.'],
            ['think', 'Nếu hồ sơ mình đủ, họ còn lý do để trình ký lâu vậy không?'],
            { fx: { nl: -2 } },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Anh Tùng họp nhanh về dòng tiền', time: '16:00', pos: { tung: 'coach' },
        scene: [
          ['tung', 'Mọi người, tháng này lương có thể trễ vài ngày. Không phải agency khó khăn. Là… vũ trụ đang thử thách mình.'],
          { if: f('debt_fixed'), then: [
            ['hong', 'Anh Tùng, Sen Hồng vừa xác nhận chuyển khoản thứ Sáu. Nhờ bạn intern soi ra hồ sơ thiếu.'],
            ['tung', 'Ồ! Intern! Vũ trụ thua rồi!'],
            { fx: { uy: 2, rel: { tung: 2 } } },
          ], else: [
            ['phat', '(nhỏ) Vũ trụ thử thách mình ba tháng rồi.'],
          ] },
          { c: 'ag_debt_tung', o: [
            { t: '"Anh ơi, phụ cấp intern có trễ không ạ?"', fx: { uy: 1, rel: { tung: -1 } }, then: [
              ['tung', 'Intern… à. Phụ cấp intern đi riêng. Hồng đảm bảo. Hồng nhỉ?'],
              ['hong', 'Chị đảm bảo. Bằng tiết kiệm của chị, như năm 2023.'],
            ] },
            { t: 'Im lặng, nhìn chị Hồng.', fx: { rel: { hong: 1 } }, then: [
              ['nar', 'Chị Hồng nháy mắt với bạn. Lần đầu tiên chị Hồng nháy mắt. Có thể là bụi.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.debt_fixed ? 'Ba tháng nợ, một nửa là do hồ sơ của mình thiếu. Mình soi ra. Tiền về thứ Sáu. Vũ trụ thua.'
      : 'Sen Hồng vẫn "đang trình ký". Chị Hồng đổi hình nền thành con heo đất bị đập.'),
  },

  // ---------------------------------------------------------------- 17
  {
    id: 'poach', minDay: 38, maxDay: 40, title: 'Phía bên kia chiến tuyến',
    intro: 'Chị Nguyệt (Mì Ông Táo) nhắn riêng lúc 7:12 sáng:\n\n"Em ơi, bên chị đang tuyển Brand Executive. Lương gấp đôi agency. Em có muốn qua không? Đừng nói ai nha."',
    steps: [
      {
        who: 'obj:desk', obj: 'Về bàn, đọc lại tin nhắn của chị Nguyệt', time: '09:30',
        scene: [
          ['nar', 'Tin nhắn có ba dấu chấm than và một emoji cái nồi. Bạn không chắc cái nồi nghĩa là gì.'],
          ['think', 'Bên client. Giờ hành chính. Không ai "em ơi" mình lúc 23:00. Mình mới là người đi "em ơi".'],
          { c: 'ag_poach_reply', o: [
            { t: 'Trả lời: "Dạ em cảm ơn chị, cho em suy nghĩ ạ."', fx: { nl: -2, rel: { nguyet: 1 }, set: { poach_think: true } } },
            { t: 'Trả lời: "Em muốn làm trọn kỳ ở Trend Trễ trước ạ."', fx: { uy: 1, set: { poach_no: true } } },
            { t: 'Chụp màn hình gửi chị Diệp.', fx: { rel: { diep: 2, nguyet: -1 }, set: { poach_told: true } }, then: [
              { chat: [['diep', 'cảm ơn em đã kể. chị không giận chị Nguyệt. chị chỉ hơi buồn vì chị không trả được gấp đôi.', true]] },
            ] },
          ] },
        ],
      },
      {
        who: 'diep', obj: 'Chị Diệp gọi bạn ra phía cửa', time: '11:00', pos: { diep: 'x3' },
        scene: [
          { if: f('poach_told'), then: [['diep', 'Em kể với chị là em tin chị. Chị cũng tin em. Nên chị nói thật: em qua bên đó cũng không sai.']],
            else: [['diep', 'Chị Nguyệt nhắn em đúng không? Chị biết. Tuần trước chị Nguyệt xin số em.']] },
          ['diep', 'Ở agency, em học nhanh gấp ba. Ở client, em ngủ nhiều gấp ba. Cả hai đều là đời.'],
          { c: 'ag_poach_diep', o: [
            { t: '"Chị ở agency bao lâu rồi ạ?"', fx: { rel: { diep: 2 } }, then: [
              ['diep', 'Tám năm. Ba lần định đi. Ba lần ở lại vì một bạn intern nào đó hỏi đúng câu này.'],
            ] },
            { t: '"Chị nghĩ em hợp ngồi bên kia không?"', fx: { uy: 1 }, then: [
              ['diep', 'Em hợp ngồi bất cứ đâu mà người ta nói thật với nhau. Hiếm lắm. Ở cả hai bên.'],
            ] },
          ] },
        ],
      },
      {
        who: 'linh', obj: 'Linh có tin mới', time: '14:00',
        scene: [
          ['linh', 'Mình quyết rồi. Hết kỳ này mình không về chỗ mẹ. Mình xin vào một agency nhỏ ở Đà Nẵng. Không ai biết mẹ mình là ai.'],
          { c: 'ag_poach_linh', o: [
            { t: '"Mình tin Linh làm được."', fx: { rel: { linh: 3 } }, then: [
              ['linh', 'Bạn là người thứ hai nói câu đó. Người thứ nhất là con mèo. Nó nhìn mình như vậy.'],
            ] },
            { t: '"Linh chắc chưa? Mẹ Linh sẽ…"', fx: { rel: { linh: 1 } }, then: [
              ['linh', 'Mẹ mình sẽ nói "con còn nhỏ". Mình sẽ nói "con 22 tuổi". Hòa.'],
            ] },
          ] },
        ],
      },
      {
        who: 'tung', obj: 'Anh Tùng gọi vào phòng MD', time: '16:00',
        scene: [
          ['tung', 'Nghe nói client săn em. Đừng ngạc nhiên, anh biết hết. Diệp kể. À không, Hồng kể. À không, con mèo.'],
          ['tung', 'Anh chỉ nói một câu: em đi đâu cũng được, nhớ make it pop. Nhưng pop cho đúng người.'],
          ['think', 'Lần đầu câu "make it pop" có nghĩa.'],
          { c: 'ag_poach_final', o: [
            { t: 'Từ chối chị Nguyệt, ở lại tới hết kỳ.', fx: { uy: 2, rel: { tung: 2 }, set: { stay_agency: true } }, then: [
              ['tung', 'Tốt. Anh không hứa Đà Lạt nữa. Anh hứa một cái thư giới thiệu thật.'],
            ] },
            { t: 'Nhận lời chị Nguyệt, bắt đầu sau kỳ thực tập.', fx: { rel: { nguyet: 2, tung: -1 }, set: { go_client: true } }, then: [
              ['tung', 'Ok. Lần sau em làm client của anh, nhớ đừng bắt sửa 14 vòng nha.'],
              ['think', 'Không hứa được.'],
            ] },
            { t: 'Dùng offer để đàm phán với anh Tùng.', fx: { dr: 3, set: { leverage: true } }, then: [
              ['tung', 'Em… đàm phán với anh hả? Hay. Anh thích. Anh không có tiền, nhưng anh thích.'],
              ['hong', '(từ phòng kính) Không có tiền là đúng.'],
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => (s.flags.go_client ? 'Mình nhận lời chị Nguyệt. Sau kỳ này, mình sẽ là người nhắn "em ơi". Mình hứa không nhắn sau 21:00. Mình hứa thử.'
      : s.flags.stay_agency ? 'Mình từ chối offer gấp đôi. Anh Tùng hứa một lá thư giới thiệu thật, không có chữ "pop".'
        : 'Mình đem offer ra đàm phán. Anh Tùng thích. Anh Tùng không có tiền.'),
  },
];
