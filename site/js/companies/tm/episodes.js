// T&M Partners — intern drama days (days 2–40). Day 1 'onboarding' lives in story/tm/day1.js.
// Flags read from earlier days: brief_clarified, brief_ok, long_dict, final_found, triage, trang_no, tax_commit,
// contract_blind, knows_whodoes, bao_tips. Hidden ties: tie_gam_tuyet, tie_khang_han, tie_phuong_friend,
// tie_binh_quynh, tie_bao_driver, tie_dat_mba — every episode works with or without them.
// Running client: Êm Ru Group (nệm, gối) — introduced on day 2 ("Phòng họp ma").

const F = (k) => (r) => !!r.flags[k];
const NOT = (k) => (r) => !r.flags[k];
const ANY = (...ks) => (r) => ks.some((k) => !!r.flags[k]);
const tie = (id) => { const key = `tie_${id}`; return (r) => !!r.flags[key]; };
const LUNCH = { mai: 'lunch1', long: 'lunch2', trang: 'lunch3', thu: 'lunch4', nhi: 'lunch5' };

// ---------- mini-games ----------
const IDEAS_MINI = {
  type: 'pick', title: '27 ý nhỏ: rổ "phải sửa"', icon: '🖍️',
  prompt: 'Chọn 5 comment khách thật sự trả tiền để thấy được sửa. Còn lại là "định hướng cho bản sau".', pick: 5, time: 45, pass: 0.6,
  items: [
    { text: 'Slide 3 chưa trả lời: khách nên làm gì trước?', correct: true },
    { text: 'Số liệu slide 7 lệch với phụ lục', correct: true },
    { text: 'Tiêu đề slide phải là kết luận, không phải "Tổng quan"', correct: true },
    { text: 'Khuyến nghị chưa có chi phí và thời gian', correct: true },
    { text: 'Thiếu nguồn cho số liệu thị trường', correct: true },
    { text: 'Đổi font Arial sang Calibri' },
    { text: 'Logo khách lệch 2px' },
    { text: 'Màu xanh "chưa đủ xanh"' },
    { text: 'Thêm ảnh hai người bắt tay' },
  ],
};

const HAN2_MINI = {
  type: 'quiz', title: 'Từ điển Hân – Việt (bản beta 2)', icon: '📖',
  prompt: 'Long kiểm tra bài: dịch buzzword mới của chị Hân sang tiếng người.', time: 35, pass: 0.66,
  questions: [
    { q: '"Three horizon" trong ý chị Hân là…', options: ['Ba nhóm việc: ngắn hạn, trung hạn, dài hạn', 'Ba đường chân trời vẽ trên slide', 'Ba buổi họp'], correct: 0 },
    { q: '"North start metric" là…', options: ['Một chỉ số chính cả công ty theo dõi (north star)', 'Chỉ số hướng Bắc', 'KPI ngày khởi động'], correct: 0 },
    { q: '"Quick win nhưng mà sustainable" nghĩa là…', options: ['Việc nhanh, thấy kết quả, không phải làm lại', 'Thắng nhanh rồi nghỉ', 'Một loại cà phê'], correct: 0 },
  ],
};

const PAID_MINI = {
  type: 'pick', title: 'Sao kê tuần trước', icon: '🏦',
  prompt: 'Dòng nào là tiền đợt 2 của Êm Ru (186.000.000đ)? Đọc kỹ tên người chuyển.', pick: 1, time: 30, pass: 1,
  items: [
    { text: '+186.000.000 · CTY TNHH EM RUN', sub: 'Thứ Năm · ND: TT HD GIAY CHAY BO' },
    { text: '+168.000.000 · CTY CP NEM EM RU', sub: 'Tháng trước · ND: TT DOT 1 HD 07/TM' },
    { text: '+186.000.000 · CTY CP NEM EM RU', sub: 'Thứ Năm · ND: TT DOT 2 HD 07/TM', correct: true },
    { text: '−186.000 · PHI DICH VU', sub: 'Thứ Năm · ND: PHI CHUYEN TIEN' },
    { text: '+18.600.000 · PHUONG HR', sub: 'Thứ Sáu · ND: HOAN TIEN AO TEAM BUILDING' },
  ],
};

const LIT_MINI = {
  type: 'pick', title: '200 trang → 2 trang', icon: '📚',
  prompt: 'Câu hỏi của khách: có nên bán online mạnh hơn không? Chọn 5 ý trả lời câu hỏi đó.', pick: 5, time: 45, pass: 0.6,
  items: [
    { text: '62% người mua nệm đọc review online trước khi ra cửa hàng', correct: true },
    { text: 'Kênh đại lý của Êm Ru giảm doanh số 3 năm liền', correct: true },
    { text: 'Đối thủ giao nệm trong 24 giờ, Êm Ru mất 6 ngày', correct: true },
    { text: 'Lý do trả hàng số 1: "nệm không giống ảnh"', correct: true },
    { text: 'Chi phí giao hàng chiếm 18% giá bán nệm', correct: true },
    { text: 'Lịch sử giấc ngủ từ thời Ai Cập cổ đại' },
    { text: 'So sánh 14 định nghĩa "chuyển đổi số" trong literature' },
    { text: 'Phụ lục phương pháp phỏng vấn bán cấu trúc' },
    { text: 'Danh mục 47 tài liệu tham khảo' },
  ],
};

const SPRINT_MINI = {
  type: 'quiz', title: 'Sprint 0: còn bao nhiêu giờ làm thật?', icon: '⏱️',
  prompt: 'Tuần 40 giờ. Daily "15 phút" thực tế 45 phút × 5. Planning 3h, Refinement 2h, Retro 1,5h, Demo 1h, họp "sync về ritual" 1h.', time: 45, pass: 0.66,
  questions: [
    { q: 'Tổng thời gian họp nghi thức mỗi tuần?', options: ['12,25 giờ', '8,5 giờ', '4,25 giờ'], correct: 0 },
    { q: 'Vậy còn bao nhiêu giờ làm thật?', options: ['27,75 giờ', '35 giờ', '38,75 giờ'], correct: 0 },
    { q: 'Đề xuất nào có cơ hội được anh Đạt nghe nhất?', options: ['Gộp nghi thức, giữ daily 15 phút thật, đo lại sau 2 sprint', 'Bỏ hết Agile', 'Cho intern đi họp thay mọi người'], correct: 0 },
  ],
};

const OVS_MINI = {
  type: 'pick', title: 'Overseas vs. dữ liệu Êm Ru', icon: '🌍',
  prompt: 'Chọn 3 điều dữ liệu thật sự ủng hộ. Không chọn điều "nghe overseas".', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: '1.200 phiếu đủ lớn để chia 3 phân khúc (sai số khoảng 3%)', correct: true },
    { text: 'Êm Ru chỉ có sổ bảo hành, không có dữ liệu hành vi online', correct: true },
    { text: 'Nhóm "mua nệm cho bố mẹ" chiếm 31% doanh thu, chưa có chiến dịch riêng', correct: true },
    { text: 'Overseas không ai dùng khảo sát nữa' },
    { text: 'Behavioral data có sẵn trong sổ bảo hành' },
    { text: 'Làm lại từ đầu vẫn kịp hạn thứ Sáu' },
    { text: 'Khách sẽ thích chữ "behavioral" trên slide' },
  ],
};

const BAO_MINI = {
  type: 'pick', title: 'Ba năm email của Bảo', icon: '📨',
  prompt: 'Chọn 4 bằng chứng cho thấy Bảo làm việc như một nhân viên thật.', pick: 4, time: 40, pass: 0.75,
  items: [
    { text: 'Chị Linh: "Bảo phụ trách báo cáo tháng cho khách, như mọi tháng"', correct: true },
    { text: 'Bảng chấm công: Bảo làm thêm 61 buổi tối trong năm qua', correct: true },
    { text: 'Chị Hạ: "Nhờ Bảo hướng dẫn 3 bạn intern mới"', correct: true },
    { text: 'Biên bản họp khách: "Đầu mối bên T&M: anh Bảo"', correct: true },
    { text: 'Bảo thắng giải "Áo đẹp nhất team building"' },
    { text: 'Bảo đổi hình nền máy thành ảnh Mèo KPI' },
    { text: 'Bảo ký thiệp sinh nhật chị Tuyết 3 năm liền' },
    { text: 'Bảo xin nghỉ chiều đi thi bằng lái' },
  ],
};

const HALF_MINI = {
  type: 'quiz', title: 'Đếm "một nhân viên rưỡi"', icon: '🧮',
  prompt: 'Bảng nguồn lực team chị Linh. Số thật, không phải số trên sơ đồ.', time: 45, pass: 0.66,
  questions: [
    { q: 'An 1,0 FTE. Minh 0,5 FTE nhưng nghỉ thi cả tuần. Bảo Ngọc 0,3 FTE và offline. Nguồn lực thật tuần này?', options: ['1,0 người (An), cộng intern', '1,8 người', '2,0 người theo sơ đồ'], correct: 0 },
    { q: 'Dự án cũ cần 1,2 người, dự án mới cần 0,8. Thiếu bao nhiêu (chưa tính intern)?', options: ['1,0 người', '0 người, cố là được', '0,2 người'], correct: 0 },
    { q: 'Câu nào nghe như "business implication" nhất?', options: ['Thêm nửa người hoặc lùi hạn 2 tuần; nếu không, rủi ro trễ Êm Ru đợt 3', 'Team rất mệt, mong chị thông cảm', 'Mỗi người làm thêm 4 tiếng mỗi ngày'], correct: 0 },
  ],
};

const MAI_MINI = {
  type: 'pick', title: 'Chị Mai thật sự cần gì?', icon: '🧭',
  prompt: 'Chị Mai liệt kê bảy thứ. Chọn 3 điều chị ấy thật sự cần, không phải điều nghe hay.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Được nói "không" với khách khi brief sai', correct: true },
    { text: 'Một người cùng làm, không phải thêm một dự án', correct: true },
    { text: 'Được ghi nhận bằng chức danh, không chỉ bằng câu "em giỏi quá"', correct: true },
    { text: 'Văn phòng có view sông' },
    { text: 'Danh thiếp mạ vàng' },
    { text: 'Thêm một buổi team building' },
    { text: 'Gấp đôi lương, gấp ba giờ làm' },
  ],
};

const TRANG_MINI = {
  type: 'quiz', title: 'Trả việc của Trang về đúng chủ', icon: '🗂️',
  prompt: 'Bảng trắng có 11 việc mang tên Trang. Trả từng việc về người thật sự phải làm.', time: 40, pass: 0.75,
  questions: [
    { q: '"Dịch brief của chị Hân sang tiếng người"', options: ['Long (tác giả từ điển Hân – Việt)', 'Trang', 'Mèo KPI'], correct: 0 },
    { q: '"Đổi font 40 slide cho anh Khang"', options: ['Anh Khang tự đổi (font là gu cá nhân)', 'Trang', 'Chị Gấm'], correct: 0 },
    { q: '"Đặt phòng họp thứ Hai"', options: ['Chị Gấm (nhắc hai lần)', 'Trang', 'Anh Đạt'], correct: 0 },
    { q: '"Phụ lục literature review 40 trang"', options: ['Chị Hạ và Trang, khi Trang khỏe lại', 'Trang, tối nay', 'Intern, tối nay'], correct: 0 },
  ],
};

// ---------- episodes ----------
export const INTERN_EPISODES = [
  // 1 · Phòng họp ma ✱ gam_tuyet
  {
    id: 'ghost_room', day: 2, title: 'Phòng họp ma',
    intro: 'Thứ Ba. Lịch phòng họp của T&M nằm trong một cuốn sổ bìa da, viết bằng bút chì, do chị Gấm giữ.\n\nHôm nay khách Êm Ru Group (nệm, gối, "giấc ngủ số hóa") đến họp lúc 10:00. Trên lý thuyết.',
    steps: [
      { who: 'gam', obj: 'Chị Gấm gọi: "Em đọc giúp chị chữ này"', time: '08:30', scene: [
        ['gam', 'Em ơi, em đọc giúp chị dòng này với. Chị ghi bút chì nên… hơi mờ.'],
        ['nar', 'Sổ đặt phòng, trang hôm nay: "9:00–10:30 · chị Linh · họp nội bộ". Ngay bên dưới: "10:00 · khách Êm Ru · chị Mai".'],
        ['think', 'Một phòng họp. Hai cuộc họp. Ba mươi phút chồng lên nhau.'],
        ['gam', 'Ơ… chị ghi hai lần à? Chắc không sao đâu, khách hay đến muộn mà.'],
        { c: 'ep_ghost_book', o: [
          { t: 'Nhắn chị Linh xin cắt ngắn họp nội bộ.', fx: { uy: 2, rel: { linh: 1 }, set: { ghost_warned: true } }, then: [
            { chat: [['linh', 'Ok em. Chị cắt họp còn 45 phút. Cảm ơn đã báo, hiếm ai báo trước ở đây.', true]] },
          ] },
          { t: 'Gợi ý chị Gấm chuyển sang lịch online.', fx: { uy: 1, rel: { gam: -1 } }, then: [
            ['gam', 'Lịch online hả… chị thử rồi. Nó cứ đòi mật khẩu. Sổ thì không đòi gì.'],
            ['think', 'Khó cãi.'],
          ] },
          { t: '"Chắc không sao đâu chị."', fx: { rel: { gam: 1 } }, then: [
            ['gam', 'Ừ. Khách Êm Ru bán nệm mà, chắc họ ngủ dậy muộn.'],
          ] },
        ] },
      ] },
      { who: 'gam', obj: 'Thang máy mở: khách Êm Ru tới sớm 47 phút!', time: '09:13', scene: [
        ['nar', 'Thang máy mở. Ba vị khách Êm Ru bước ra, áo đồng phục in chữ "Ngủ ngon là một chiến lược".'],
        ['nar', 'Đồng hồ chỉ 09:13. Sớm bốn mươi bảy phút.'],
        ['gam', 'Ơ… em ơi. Khách đến rồi à? Phòng họp đang có chị Linh. Chị Mai thì đang trên đường.'],
        { c: 'ep_ghost_guest', o: [
          { t: 'Mời khách vào pantry, tự tay pha trà.', fx: { nl: -4, uy: 2, set: { client_tea: true } }, then: [
            ['nar', 'Bạn pha loại trà ít bụi nhất. Khách hỏi trà gì. Bạn nói "trà tư vấn". Vị khách lớn tuổi bật cười.'],
          ] },
          { t: 'Gọi ngay chị Mai.', fx: { rel: { mai: 1 }, set: { mai_client: true } }, then: [
            { chat: [['mai', 'Chị tới sau 6 phút. Em mời khách ngồi sofa, hỏi họ thích nệm cứng hay mềm. Họ sẽ nói 20 phút.', true]] },
            ['nar', 'Bạn hỏi. Họ nói hai mươi hai phút.'],
          ] },
          { t: 'Đưa khách vào thẳng phòng họp.', fx: { dr: 4, rel: { linh: -2 } }, then: [
            ['nar', 'Bạn mở cửa phòng họp. Trên bảng trắng, chị Linh vừa viết "TEAM CHỈ CÓ 1.5 NGƯỜI". Khách đọc to dòng đó.'],
            ['linh', '…Chào anh chị. Đây là… một bài tập tình huống.'],
          ] },
        ] },
      ] },
      { who: 'linh', obj: 'Dọn phòng họp trong 5 phút: nói chuyện với chị Linh', time: '09:20', pos: { linh: 'mr_head', an: 'mr_n1' }, scene: [
        { if: F('ghost_warned'), then: [
          ['linh', 'Chị cắt họp rồi. Còn năm phút để An đọc nốt ba con số.'],
          ['an', 'Số một: đang trễ. Số hai: trễ hơn. Số ba: em là người duy nhất.'],
          { fx: { rel: { linh: 1, an: 1 } } },
        ], else: [
          ['linh', 'Khách đến rồi? Chị đặt phòng từ thứ Sáu tuần trước mà.'],
          ['an', 'Chị Gấm ghi bút chì đó chị. Bút chì thì… tẩy được.'],
        ] },
        ['think', 'Trên bảng trắng: "TEAM CHỈ CÓ 1.5 NGƯỜI". Khách mà đọc được thì khó giải thích.'],
        { c: 'ep_ghost_room', o: [
          { t: 'Xóa bảng, dọn ly, mời họp nội bộ sang pantry.', fx: { nl: -5, uy: 2, rel: { linh: 1 } }, then: [
            ['linh', 'Pantry cũng được. Ít nhất ở đó có bánh.'],
          ] },
          { t: '"Lỗi tại em không kiểm tra lịch kỹ ạ."', fx: { rel: { linh: 1, gam: 2 }, set: { took_blame: true } }, then: [
            ['linh', 'Em mới vào tuần đầu, lỗi gì của em. Nhưng chị ghi nhận là em không đổ cho ai.'],
          ] },
          { t: '"Chị Gấm ghi trùng lịch ạ."', fx: { uy: 1, dr: 2, rel: { gam: -2 }, set: { blamed_gam: true } }, then: [
            ['linh', 'Chị biết. Ai cũng biết. Không ai nói. Giờ thì em nói rồi đấy.'],
          ] },
        ] },
      ] },
      { who: 'mai', obj: '10:00 Họp với Êm Ru: ghi biên bản cho chị Mai', time: '10:00', pos: { mai: 'mr_head' }, scene: [
        ['mai', 'Cảm ơn anh chị đến sớm. Trước khi mở slide, cho em hỏi: anh chị muốn khách ngủ ngon hơn, hay muốn bán được nhiều nệm hơn?'],
        ['nar', 'Ba vị khách nhìn nhau. Người lớn tuổi nhất nói: "Bán nệm. Nhưng đừng ghi vào biên bản."'],
        { if: F('client_tea'), then: [
          ['nar', 'Ông quay sang bạn: "Trà lúc nãy ngon. Lần sau tôi đến sớm nữa." Chị Mai liếc bạn, mỉm cười.'],
          { fx: { rel: { mai: 1 } } },
        ] },
        ['think', 'Mình đang cầm biên bản. Câu "đừng ghi" vừa được nói rất rõ.'],
        { c: 'ep_ghost_minutes', o: [
          { t: 'Ghi: "Mục tiêu: tăng doanh số nệm."', fx: { uy: 2, rel: { mai: 1 }, set: { minutes_true: true } }, then: [
            ['mai', '(nhỏ) Biên bản nội bộ thì ghi thật. Bản gửi khách chị sửa câu chữ. Em làm đúng.'],
          ] },
          { t: 'Ghi: "Mục tiêu: nâng tầm trải nghiệm giấc ngủ số."', fx: { rel: { han: 1 }, dr: 1 }, then: [
            ['nar', 'Chiều đó chị Hân đọc biên bản và thả ba trái tim. Không ai biết mục tiêu thật là gì.'],
          ] },
          { t: 'Ghi cả hai: một bản nội bộ, một bản "ngôn ngữ đối ngoại".', fx: { uy: 3, rel: { mai: 2 }, set: { minutes_true: true } }, then: [
            ['mai', 'Em học cái này ở đâu vậy? Chị mất một năm mới hiểu.'],
          ] },
        ] },
      ] },
      { who: 'thu', obj: 'Thư hỏi chuyện phòng họp sáng nay', time: '14:00', scene: [
        ['thu', 'Cái này không phải việc của mình, nhưng mà… sáng nay phòng họp có chuyện gì vậy? Chị Tuyết vừa hỏi mình.'],
        { if: tie('gam_tuyet'), then: [
          ['thu', '(thì thầm) Mình nói nhỏ nhé. Chị Gấm là em họ chị Tuyết. Nên ở đây không ai chê chị Gấm. Không ai.'],
          ['think', 'Thì ra cuốn sổ bút chì sống sót được tám năm là có lý do.'],
        ] },
        { c: 'ep_ghost_cover', o: [
          { t: 'Đỡ cho chị Gấm: "Khách đến sớm thôi, không ai sai."', fx: { rel: { gam: 3, thu: 1 }, set: { covered_gam: true } }, then: [
            ['thu', 'Ok, mình báo vậy. Bạn tử tế ghê.'],
          ] },
          { t: 'Kể đúng sự việc, đề xuất đặt phòng trên lịch online.', fx: { uy: 2, set: { told_thu: true } }, then: [
            { if: tie('gam_tuyet'), then: [['thu', 'Bạn dũng cảm thật. Hoặc bạn chưa nghe kỹ mình vừa nói gì.'], { fx: { dr: 3 } }],
              else: [['thu', 'Mình ghi lại rồi. Lịch online thì… để mình hỏi chị Gấm có mật khẩu không.']] },
          ] },
          { t: '"Thư hỏi chị Gấm đi."', fx: { dr: 1, rel: { thu: -1 } }, then: [
            ['thu', 'Mình hỏi rồi. Chị Gấm nói "để chị xem một tí đã". Đó là ba tiếng trước.'],
          ] },
        ] },
      ] },
      { who: 'tuyet', obj: 'Chị Tuyết gọi bạn vào phòng', time: '16:00', scene: [
        { if: ANY('blamed_gam', 'told_thu'), then: [
          { if: tie('gam_tuyet'), then: [
            ['tuyet', 'Chị nghe chuyện sáng nay rồi. Gấm là em họ chị. Chắc em cũng nghe người ta nói.'],
            ['tuyet', 'Chị biết nó chậm. Tám năm nay không ai nói thẳng với chị. Em là người đầu tiên.'],
            ['tuyet', 'Chị không thích nghe. Nhưng chị cần nghe. Từ tuần sau phòng họp đặt trên lịch online, Gấm giữ sổ làm bản sao lưu.'],
            { fx: { uy: 3, dr: 2, rel: { tuyet: 1, gam: -1 }, set: { gam_calendar: true } } },
          ], else: [
            ['tuyet', 'Đặt trùng phòng là chuyện nhỏ. Để khách thấy mình đặt trùng phòng là chuyện lớn.'],
            ['tuyet', 'Từ tuần sau đặt phòng trên lịch online. Em nhắc Gấm giúp chị. Hai lần.'],
            { fx: { uy: 2, rel: { tuyet: 1 }, set: { gam_calendar: true } } },
          ] },
        ], else: [
          ['tuyet', 'Khách Êm Ru gọi chị. Họ đến sớm mà vẫn được đón tử tế. Chị không hỏi chi tiết. Chi tiết là việc của các em.'],
          { if: (r) => r.flags.tie_gam_tuyet && r.flags.covered_gam, then: [
            ['tuyet', 'Gấm kể em đỡ cho nó. Nó là em họ chị đấy. Chị nợ em một lần. Nhưng chị quên nhanh lắm.'],
            { fx: { rel: { tuyet: 1 } } },
          ] },
        ] },
        ['tuyet', 'Câu hỏi cuối: sáng nay khách thật sự cần gì?'],
        { c: 'ep_ghost_need', o: [
          { t: '"Bán được nhiều nệm hơn, nhưng họ ngại nói ra ạ."', fx: { uy: 3, rel: { tuyet: 1 } }, then: [
            ['tuyet', 'Đúng. Đó là business implication. Còn lại là trang trí.'],
          ] },
          { t: '"Một kế hoạch chuyển đổi số toàn diện ạ."', fx: { dr: 1 }, then: [
            ['tuyet', 'Đó là cái mình bán. Không phải cái họ cần. Em nghe giống Hân rồi đấy.'],
          ] },
          { t: '"Một phòng họp không bị đặt trùng ạ."', fx: { dr: 1, rel: { tuyet: 1 } }, then: [
            ['tuyet', 'Chị sẽ coi đó là một câu đùa. Lần này.'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => {
      const b = ['Ngày 2. Khách Êm Ru đến sớm 47 phút.'];
      if (r.flags.client_tea) b.push('Mình pha "trà tư vấn". Ông khách nhớ mình.');
      if (r.flags.covered_gam) b.push('Mình đỡ cho chị Gấm.');
      if (r.flags.tie_gam_tuyet) b.push('Hóa ra chị Gấm là em họ chị Tuyết. Nhiều chuyện giờ mới hiểu.');
      if (r.flags.gam_calendar) b.push('Từ tuần sau phòng họp đặt trên lịch online. Sổ bút chì về hưu, một nửa.');
      return b.join(' ');
    },
  },

  // 2 · 27 ý nhỏ
  {
    id: 'small_ideas', day: 3, title: '27 ý nhỏ',
    intro: 'Thứ Tư. Hôm thứ Hai, team chị Linh sửa xong 27 ý nhỏ của chị Tuyết.\n\n23:41 tối qua, deck v2 có 27 comment mới. Màu đỏ. Định luật bảo toàn ý nhỏ.',
    chatStart: [['tuyet', 'Chị để vài ý nhỏ trong deck v2. Sáng mai các em xem nhé. (23:41)', true], ['an', 'Em ơi 27 comment. Anh đếm 3 lần. Đừng hoảng. Anh hoảng đủ cho cả hai.', true]],
    steps: [
      { who: 'obj:desk', obj: 'Mở deck v2: 27 comment đỏ', time: '08:30', scene: [
        ['nar', 'Comment #1: "Font?". Comment #14: "Slide này để làm gì?". Comment #27: "Chị nghĩ các em cần nhìn vấn đề này ở góc độ chiến lược hơn."'],
        { if: F('triage'), then: [['think', 'Chị Mai dạy rồi: in đậm là bắt buộc. Lần này… không cái nào in đậm. Chị Tuyết học nhanh thật.']],
          else: [['think', 'Hai mươi bảy ý. Tám tiếng. Mỗi ý mười tám phút. Chưa tính đi vệ sinh.']] },
        { c: 'ep_ideas_start', o: [
          { t: 'Sửa lần lượt từ comment #1.', fx: { nl: -6, set: { ideas_linear: true } }, then: [
            ['nar', 'Bốn mươi phút sau, bạn đổi xong font. Comment #2 ghi: "Font cũ đẹp hơn."'],
          ] },
          { t: 'Nhờ chị Mai cùng phân loại.', fx: { rel: { mai: 1 } }, then: [
            { chat: [['mai', 'Qua bàn chị lúc 9:30. Mang theo cà phê, không phải cho chị, cho em.', true]] },
          ] },
          { t: 'Hỏi An chị Tuyết thường đọc deck thế nào.', fx: { rel: { an: 1 } }, then: [
            ['an', 'Chị đọc slide 3 trước, slide cuối sau. Ở giữa là… vùng đệm. Sửa slide 3 trước, em sống.'],
          ] },
        ] },
      ] },
      { who: 'mai', obj: 'Qua bàn chị Mai chia 27 ý vào ba rổ', time: '09:30', scene: [
        ['mai', 'Ba rổ: phải sửa, nên sửa, để bản sau. Khách trả tiền cho rổ thứ nhất.'],
        { if: F('ideas_linear'), then: [['mai', 'Font hả? Font thuộc rổ ba. Rổ ba là nơi các ý nhỏ về hưu.']] },
        { mini: IDEAS_MINI,
          good: [['mai', 'Chuẩn. Năm ý này sửa xong, 22 ý kia tự nhiên bớt quan trọng.'], { fx: { uy: 3, rel: { mai: 1 }, set: { ideas_five: true } } }],
          bad: [['mai', 'Logo lệch 2px là rổ ba nha em. Không sao, chị chỉ lại. Lần sau em tự chia.'], { fx: { nl: -4 } }],
        },
      ] },
      { who: 'han', obj: 'Chị Hân "ghé qua góp thêm 5 ý"', time: '11:30', scene: [
        ['han', 'Chị thấy deck trên ổ chung nha. Chị góp thêm năm ý thôi. Ý một: slide nào cũng nên có chữ synergy.'],
        ['han', 'Ý hai đến năm: như ý một, nhưng in đậm.'],
        { if: F('long_dict'), then: [['think', 'Từ điển Hân – Việt, mục S: "synergy" = "chị chưa đọc kỹ nhưng thấy hay".']] },
        { c: 'ep_ideas_han', o: [
          { t: '"Dạ em ghi nhận, em xin chị Tuyết chốt ưu tiên ạ."', fx: { uy: 2, rel: { han: -1 } }, then: [
            ['han', 'Ừ, chị Tuyết cũng sẽ love synergy thôi.'],
          ] },
          { t: 'Thêm chữ "synergy" vào chân trang mọi slide.', fx: { dr: 2, rel: { han: 2 }, set: { synergy_footer: true } }, then: [
            ['han', 'Perfect! Giờ deck có cái vibe rồi.'],
          ] },
          { t: 'Nhờ Long "dịch" ý chị Hân thành một gợi ý thật.', fx: { uy: 1, rel: { long: 1 } }, then: [
            ['long', 'Chị Hân muốn deck nói rõ các bên phối hợp thế nào. Thêm một slide "ai làm gì" là xong. Synergy, bản tiếng người.'],
          ] },
        ] },
      ] },
      { who: 'call:tuyet', obj: 'Chị Tuyết gọi Teams duyệt deck v3 (nghe máy)', time: '14:00',
        call: { title: 'Duyệt deck v3 · "Một câu hỏi thôi"', people: ['tuyet', 'linh', 'an', 'me'] }, scene: [
        ['tuyet', 'Chị xem v3 rồi. Chị chỉ hỏi một câu.'],
        { if: F('ideas_five'), then: [
          ['tuyet', 'Năm ý chính đã xử lý. Slide 3 trả lời được "làm gì trước". Business implication rõ rồi.'],
          { fx: { uy: 3, rel: { tuyet: 1 } } },
        ], else: [
          ['tuyet', 'Font đẹp hơn. Nhưng slide 3 vẫn chưa nói khách nên làm gì trước. Đây là phân tích, nhưng đâu là business implication?'],
          { fx: { uy: -1 } },
        ] },
        { if: F('synergy_footer'), then: [
          ['tuyet', 'Còn ai thêm chữ "synergy" vào chân trang mười tám slide vậy?'],
          ['think', 'Không ai trả lời. Ai cũng biết.'],
          { fx: { dr: 2 } },
        ] },
        ['tuyet', 'Câu hỏi của chị: nếu khách chỉ có ngân sách làm MỘT việc trong quý này, là việc gì?'],
        { c: 'ep_ideas_answer', o: [
          { t: '"Việc ra doanh thu sớm nhất, có người chịu trách nhiệm và con số theo dõi ạ."', fx: { uy: 3, rel: { tuyet: 1 }, set: { ideas_answer: true } }, then: [
            ['tuyet', 'Đó là một nguyên tắc. Lần sau cho chị cái tên của việc đó. Nhưng đúng hướng.'],
          ] },
          { t: '"Em nghĩ mình cần nghiên cứu thêm ạ."', fx: { dr: 1, rel: { ha: 1 } }, then: [
            ['tuyet', 'Đó là câu của chị Hạ. Chị Hạ được quyền nói câu đó. Em thì chưa.'],
          ] },
          { t: 'Nhường chị Linh trả lời.', fx: { uy: 1, rel: { linh: 2 } }, then: [
            ['linh', 'Việc thứ nhất trên slide 3. Bạn intern vừa sửa xong slide đó sáng nay.'],
            ['think', 'Chị Linh vừa cho mình công. Trước mặt chị Tuyết.'],
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'Còn 22 ý nhỏ: làm tiếp hay để mai?', time: '17:30', scene: [
        ['nar', 'Còn hai mươi hai comment. Hai mươi bảy trừ năm. Toán học ở T&M chính xác một cách tàn nhẫn.'],
        { c: 'ep_ideas_rest', o: [
          { t: 'Ở lại sửa hết.', fx: { nl: -12, rel: { an: 1 } }, then: [
            ['nar', 'Mười giờ tối, xong 22 ý. 23:12, chị Tuyết thêm comment #28: "Tốt."'],
          ] },
          { t: 'Gom 22 ý thành "parking lot", xin chị Tuyết duyệt để bản sau.', fx: { uy: 2, set: { parking_lot: true } }, then: [
            { chat: [['tuyet', 'Ok. Bản sau.', true]] },
            ['think', 'Ba chữ. Không có "ý nhỏ" nào. Đây là chiến thắng.'],
          ] },
          { t: 'Tắt máy về.', fx: { nl: 8, dr: 1 }, then: [
            { if: F('contract_blind'), then: [['think', 'Trong thỏa thuận có điều "OT tự nguyện theo yêu cầu". Hôm nay mình tự nguyện… về.']],
              else: [['think', 'Thỏa thuận ghi rõ: OT tùy em. Mình chọn ngủ.']] },
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 3. 27 ý nhỏ, rồi thêm 5 ý của chị Hân. ${r.flags.ideas_five ? 'Mình chọn đúng 5 ý phải sửa. Chị Tuyết nói "business implication rõ rồi".' : 'Mình sửa font trước. Sai rổ.'} ${r.flags.parking_lot ? 'Phát minh trong ngày: "parking lot" cho ý nhỏ.' : ''}`,
  },

  // 3 · Big Pitcher (phần 2) — reads brief_clarified / brief_ok / long_dict from Day 1
  {
    id: 'big_pitcher2', day: 5, title: 'Big Pitcher (phần 2)',
    intro: 'Thứ Sáu. Hạn nộp "big pitcher" cho chị Hân: 16:00.\n\nBạn có một bản nháp, ba người cần ký duyệt, và một linh cảm rằng chị Hân đã đổi ý từ tối qua.',
    steps: [
      { who: 'han', obj: 'Chị Hân gọi: "Chị nghĩ lại rồi"', time: '08:30', scene: [
        ['han', 'Morning em! Chị nghĩ lại rồi. Big pitcher giờ phải là cái roadmap "three horizon". Mình cần think big hơn nha.'],
        ['think', 'Hạn là 16:00. Hôm nay. Bây giờ là 08:30.'],
        { if: F('brief_clarified'), then: [
          ['me', 'Dạ, thứ Hai em có hỏi lại chị và ghi: "slide tổng quan, chiến lược và KPI đi kèm". Em gửi lại chị ghi chú nhé.'],
          ['han', 'Ơ… chị nói vậy hả? Ừ đúng, chị nói vậy. Vậy giữ nguyên, thêm MỘT slide horizon thôi. Một thôi.'],
          ['think', 'Ghi chú thứ Hai vừa cứu mình nguyên một ngày.'],
          { fx: { uy: 3, set: { pitcher_exempt: true } } },
        ], else: [
          ['han', 'Bản em làm cũng ok, nhưng chưa "wow". Mình làm lại theo three horizon nha. Em làm kịp mà, đúng không?'],
          { if: (r) => r.flags.brief_ok === false, then: [['think', 'Mình còn chưa chắc bản cũ là cái gì. Giờ thêm "three horizon".']] },
        ] },
        { c: 'ep_pitch_redo', o: [
          { t: '"Dạ, em làm lại từ đầu."', when: NOT('pitcher_exempt'), fx: { nl: -12, rel: { han: 2 }, set: { pitch_redo: true } }, then: [
            ['han', 'Love the energy!'],
          ] },
          { t: '"Em giữ khung cũ, thêm một slide horizon được không chị?"', when: NOT('pitcher_exempt'), fx: { uy: 2 }, then: [
            ['han', 'Ok… nếu nó wow.'],
          ] },
          { t: '"Dạ, em thêm một slide trước 11 giờ ạ."', when: F('pitcher_exempt'), fx: { uy: 1, rel: { han: 1 } }, then: [
            ['han', 'Chị thích người có ghi chú. Ghi chú là… documentation!'],
          ] },
          { t: '"Chị cho em hỏi \'three horizon\' là gì ạ?"', fx: { uy: 1, rel: { han: -1 } }, then: [
            ['han', 'Là… ba cái horizon. Em google nha. Chị đang có call.'],
          ] },
        ] },
        ['han', 'À, trước 16:00 em xin ký duyệt của Khang, Mai, rồi chị chốt cuối nha. Quy trình mới đó.'],
      ] },
      { who: 'long', obj: 'Nhờ Long dịch "three horizon"', time: '10:00', scene: [
        ['long', 'Three horizon hả? Lại cập nhật từ điển rồi. Ngồi đây, tao kiểm tra bài mày.'],
        { if: F('long_dict'), then: [['long', 'Người dùng thứ năm quay lại. Bản beta có thêm mười hai mục mới. Cảm ơn chị Hân.']] },
        { mini: HAN2_MINI,
          good: [['long', 'Chuẩn. Mày lên level "phiên dịch viên cấp hai". Lương vẫn vậy.'], { fx: { uy: 2, rel: { long: 1 }, set: { pitch_decoded: true } } }],
          bad: [['long', 'Sai câu north start rồi. Không sao, chị Hân cũng chưa biết nó là gì.'], { fx: { nl: -3 } }],
        },
      ] },
      { who: 'khang', obj: 'Xin chữ ký duyệt #1: Khang', time: '11:30', scene: [
        ['khang', 'Actually, when I was overseas, slide tổng quan nào cũng có một ma trận 2x2. Không có 2x2 là anh không ký.'],
        { if: tie('khang_han'), then: [
          ['khang', 'Với lại dì… à, chị Hân thích 2x2 lắm.'],
          ['think', '"Dì"?'],
          { fx: { set: { heard_khang_di: true } } },
        ] },
        { c: 'ep_pitch_khang', o: [
          { t: 'Thêm ma trận 2x2 "Tác động × Độ dễ".', fx: { nl: -4, rel: { khang: 2 }, set: { khang_signed: true } }, then: [
            ['khang', 'Nice. Giờ trông nó international.'],
          ] },
          { t: '"Slide có trục KPI rồi, thêm 2x2 sẽ lặp ý ạ."', fx: { uy: 2, rel: { khang: -2 }, set: { khang_signed: true } }, then: [
            ['khang', 'Mindset hơi local nha. Nhưng… ok, anh ký. Ghi là anh có góp ý.'],
          ] },
          { t: 'Hỏi Khang ở nước ngoài bao lâu.', fx: { dr: 2, rel: { khang: -1 }, set: { khang_signed: true, asked_overseas: true } }, then: [
            ['khang', 'Singapore. Ba tháng. Exchange. Nhưng ba tháng đó rất intense.'],
            ['khang', 'Thôi, anh ký. Đừng hỏi nữa.'],
          ] },
        ] },
      ] },
      { who: 'mai', obj: 'Xin chữ ký duyệt #2: chị Mai', time: '14:00', scene: [
        ['mai', 'Cho chị xem. … Mười hai slide. Khách đọc được ba. Em giữ ba slide nào?'],
        { c: 'ep_pitch_mai', o: [
          { t: 'Bức tranh tổng thể, 3 việc ưu tiên, KPI đi kèm.', fx: { uy: 3, rel: { mai: 2 }, set: { pitch_tight: true } }, then: [
            ['mai', 'Đúng cái khách cần. Phần còn lại vào phụ lục. Ký.'],
          ] },
          { t: 'Giữ cả 12. Khách có thời gian mà.', fx: { rel: { mai: -1 } }, then: [
            ['mai', 'Khách có thời gian. Khách không có kiên nhẫn. Chị ký, nhưng chị nói trước rồi nhé.'],
          ] },
          { t: '"Chị nghĩ khách thật sự cần gì ạ?"', fx: { uy: 1, rel: { mai: 2 }, set: { pitch_tight: true } }, then: [
            ['mai', 'Hỏi lại chị câu của chị à? Được. Họ cần biết bắt đầu từ đâu. Một slide. Ký.'],
          ] },
        ] },
      ] },
      { who: 'han', obj: '15:45 Chị Hân chốt duyệt cuối', time: '15:45', scene: [
        ['han', 'Cho chị xem nào… Ok. OK. Đây đúng là cái big pitcher chị nghĩ từ đầu!'],
        ['think', '"Từ đầu" là từ hôm thứ Hai, hay từ sáng nay?'],
        { if: F('pitch_redo'), then: [['nar', 'Bản làm lại giống bản cũ khoảng tám mươi phần trăm. Không ai nhắc chuyện đó.']] },
        ['han', 'Chị sẽ present cho khách tuần sau. Chị ghi tên em ở slide cuối nha, phần "Special thanks".'],
        { c: 'ep_pitch_credit', o: [
          { t: '"Dạ, em cảm ơn chị."', fx: { rel: { han: 2 }, set: { pitcher_done: true } }, then: [
            ['han', 'Em có growth mindset thật sự.'],
          ] },
          { t: '"Chị cho em ngồi dự buổi present được không ạ?"', fx: { uy: 2, rel: { han: 1 }, set: { pitcher_done: true, pitch_attend: true } }, then: [
            ['han', 'Of course! Em ngồi ghi biên bản nha.'],
            ['think', 'Đặc ân có kèm việc.'],
          ] },
          { t: '"Em xin ghi tên ở slide đầu ạ."', fx: { dr: 3, rel: { han: -1 }, set: { pitcher_done: true } }, then: [
            ['han', 'Wow, ambitious! Chị thích. Nhưng slide đầu là logo.'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 5. Big pitcher nộp lúc 15:45. ${r.flags.pitcher_exempt ? 'Ghi chú hôm thứ Hai cứu mình: chỉ thêm một slide.' : 'Chị Hân đổi ý lúc 8:30. Mình học được: hỏi lại brief ngay ngày đầu.'} ${r.flags.heard_khang_di ? 'Khang suýt gọi chị Hân là "dì".' : ''}`,
  },

  // 4 · Khách đã chuyển tiền chưa?
  {
    id: 'paid_yet', day: 8, title: 'Khách đã chuyển tiền chưa?',
    intro: 'Thứ Hai tuần thứ hai. Êm Ru gọi: họ cần hóa đơn đợt 2 trước 15:00, và khẳng định "đã chuyển tiền từ thứ Năm".\n\nChị Quỳnh có ba file Excel theo dõi công nợ. Ba file nói ba điều khác nhau.',
    steps: [
      { who: 'nhi', obj: 'Nhi đang nghe điện thoại của khách', time: '08:30', scene: [
        ['nhi', 'Ủa, sao cái này cũng đến tay mình vậy? Khách Êm Ru gọi số mình. Mình đâu có đưa số cho họ.'],
        ['nhi', 'À có. Năm ngoái. Mình nhớ số khách, khách cũng nhớ số mình. Lời nguyền đó.'],
        ['nhi', 'Họ cần hóa đơn trước 15:00, nói đã chuyển 186 triệu. Chị Mai đang ở chỗ khách, nhờ bạn xử lý giúp.'],
        { c: 'ep_paid_start', o: [
          { t: 'Qua thẳng chị Quỳnh.', fx: { rel: { nhi: 1 } }, then: [['nhi', 'Nhanh gọn. Mình thích.']] },
          { t: 'Xin khách gửi ủy nhiệm chi trước.', fx: { uy: 2, set: { has_unc: true } }, then: [
            ['nhi', 'Ý hay. … Họ gửi rồi. Ảnh chụp màn hình, nghiêng ba mươi độ, có ngón tay cái.'],
          ] },
          { t: 'Hỏi file "Ai làm gì" xem ai phụ trách công nợ.', fx: { rel: { nhi: 1, thu: 1 } }, then: [
            ['nhi', '"Công nợ: chị Quỳnh. Hỏi trước 10 giờ. Sau 10 giờ chị ấy đang đối soát với chính mình."'],
          ] },
        ] },
      ] },
      { who: 'quynh', obj: 'Đối soát ba file Excel với sao kê cùng chị Quỳnh', time: '09:15', scene: [
        ['quynh', 'Êm Ru hả? Để chị kiểm tra lại file đã nhé.'],
        ['nar', 'Ba file: "CongNo_2026.xlsx", "CongNo_2026_Quynh.xlsx", "CongNo_2026_BANGOC.xlsx". Cùng một khách, ba con số.'],
        { if: F('tax_commit'), then: [['quynh', 'Em là đứa điền bản cam kết thuế đúng không? Ngồi đây, đối giúp chị với sao kê.']],
          else: [['quynh', 'Em ngồi đây đối giúp chị với sao kê ngân hàng. Đọc kỹ tên người chuyển.']] },
        { if: F('has_unc'), then: [['think', 'Ủy nhiệm chi của khách ghi: "CTY CP NEM EM RU · TT DOT 2 HD 07/TM". Kèm ngón tay cái.']] },
        { mini: PAID_MINI,
          good: [['quynh', 'Đúng dòng này. "Em Run" là công ty giày chạy bộ, tháng nào cũng làm chị suýt xuất nhầm hóa đơn.'], { fx: { uy: 3, rel: { quynh: 2 }, set: { paid_found: true, quynh_trust: true } } }],
          bad: [
            ['quynh', 'Không phải. "Em Run" là công ty giày chạy bộ. Để chị kiểm tra lại. Lần thứ tư.'],
            ['nar', 'Hai mươi phút sau, chị Quỳnh tìm ra dòng đúng. Chị thở dài một hơi dài như file công nợ.'],
            { fx: { nl: -5, rel: { quynh: -1 }, set: { paid_found: true } } },
          ],
        },
      ] },
      { who: 'call:mai', obj: 'Chị Mai gọi từ chỗ khách (nghe máy)', time: '10:30',
        call: { title: 'Mai (ở chỗ khách) · "Tiền về chưa em?"', people: ['mai', 'nhi', 'me'] }, scene: [
        ['mai', 'Chị đang ngồi với kế toán Êm Ru. Họ hỏi lần thứ ba rồi. Tiền về chưa em?'],
        { c: 'ep_paid_confirm', o: [
          { t: '"Về rồi chị, 186 triệu, thứ Năm. Chị Quỳnh đã xem."', fx: { uy: 2, rel: { mai: 2 } }, then: [
            ['mai', 'Tuyệt. Chị báo khách. Em nhanh hơn cả ngân hàng.'],
          ] },
          { t: '"Về rồi, nhưng chờ chị Quỳnh xác nhận bằng văn bản ạ."', fx: { uy: 1, rel: { quynh: 1, mai: 1 } }, then: [
            ['mai', 'Chuẩn quy trình. Khách chờ thêm ba mươi phút, chị mua cho họ ly cà phê.'],
          ] },
          { t: '"Chị hỏi giúp em họ chuyển từ tài khoản đuôi mấy?"', fx: { rel: { mai: 1, nhi: 1 } }, then: [
            ['mai', '…Tài khoản công ty, đuôi 0707. Khớp chưa?'],
            ['think', 'Khớp.'],
          ] },
        ] },
      ] },
      { who: 'quynh', obj: 'Biên bản đối chiếu cần chữ ký chị Tuyết', time: '14:00', scene: [
        ['quynh', 'Hóa đơn xuất rồi. Nhưng biên bản đối chiếu công nợ phải có chữ ký chị Tuyết. Bản gốc.'],
        { if: tie('binh_quynh'), then: [
          ['nar', 'Anh Bình bước vào, đặt ly trà sữa lên bàn chị Quỳnh, rồi lặng lẽ restart máy chị ấy. Máy chị ấy đâu có hỏng.'],
          ['think', 'Hmm.'],
        ], else: [
          ['nar', 'Máy chị Quỳnh treo. Anh Bình chạy qua trong mười giây. Ở T&M, máy kế toán luôn được sửa trước.'],
        ] },
        ['quynh', 'Chị Tuyết họp với chị Hân tới 15:30. Khách cần trước 15:00.'],
        { c: 'ep_paid_sign', o: [
          { t: 'Gõ cửa phòng họp xin chữ ký.', fx: { uy: 2, dr: 2 }, then: [
            ['tuyet', 'Ký đâu? … Đây. Lần sau đưa chị trước giờ họp.'],
          ] },
          { t: 'Nhờ Thư lồng tờ này vào xấp "ký trước 15:00".', fx: { uy: 1, rel: { thu: 2 } }, then: [
            ['thu', 'Không phải việc của mình, nhưng mà… mình có xấp "ký giữa giờ giải lao". Bạn đặt lên trên cùng.'],
          ] },
          { t: 'Gửi khách bản scan, hẹn bản gốc ngày mai.', fx: { rel: { quynh: -1 } }, then: [
            ['quynh', 'Scan là scan. Gốc là gốc. Nhưng thôi, lần này chị đồng ý.'],
          ] },
        ] },
      ] },
      { who: 'nhi', obj: 'Nhi có tin từ khách', time: '16:00', scene: [
        ['nhi', 'Êm Ru vừa gọi lại. Lần đầu tiên trong năm họ gọi để… cảm ơn. Mình suýt làm rơi điện thoại.'],
        { if: F('quynh_trust'), then: [['quynh', '(nói vọng sang) Từ giờ đối soát Êm Ru chị giao cho em. Đừng vui, đây là phạt.']] },
        ['nhi', 'Mình thêm bạn vào file "Ai làm gì" nha? Mục "Đối soát tiền khách".'],
        { c: 'ep_paid_whodoes', o: [
          { t: '"Ghi tên mình. Nhắc một lần là đủ."', fx: { uy: 1, rel: { nhi: 1, thu: 1 }, set: { in_whodoes: true } }, then: [
            ['nhi', '"Nhắc một lần". Mục duy nhất trong file có ghi chú này.'],
          ] },
          { t: '"Ghi chị Quỳnh thôi, mình chỉ hỗ trợ."', fx: { rel: { quynh: 1 } }, then: [
            ['nhi', 'Khiêm tốn ghê. Ở đây khiêm tốn là bị giao thêm việc đó nha.'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 8. ${r.flags.quynh_trust ? 'Mình tìm ra dòng sao kê đúng giữa "Em Ru" và "Em Run". Chị Quỳnh bắt đầu tin mình.' : 'Mình suýt nhận nhầm tiền của công ty giày chạy bộ.'} Khách gọi lại để cảm ơn. Nhi suýt làm rơi điện thoại.`,
  },

  // 5 · Literature review 200 trang
  {
    id: 'lit_review', day: 10, title: 'Literature review 200 trang',
    intro: 'Thứ Tư. Báo cáo nghiên cứu thị trường nệm cho Êm Ru đã xong: 200 trang, 47 tài liệu tham khảo, một chương về lịch sử giấc ngủ.\n\nKhách cần nó lúc 9 giờ sáng mai. Khách đọc tối đa 2 trang.',
    steps: [
      { who: 'ha', obj: 'Chị Hạ gọi bạn qua bàn', time: '08:30', scene: [
        ['ha', 'Em ơi, ngồi đây chị kể. Báo cáo này chị làm ba tuần. Chị chỉ có một ý nhỏ về phương pháp trước khi mình bàn tiếp…'],
        ['nar', 'Mười hai phút sau, ý nhỏ về phương pháp vẫn đang ở phần "các trường phái chọn mẫu".'],
        ['ha', '…vì vậy chị nghĩ khách sẽ trân trọng 200 trang. Nhưng Mai nói khách chỉ đọc 2. Em thấy sao?'],
        { c: 'ep_lit_open', o: [
          { t: '"Giữ 200 trang làm phụ lục, thêm 2 trang tóm tắt ở đầu ạ."', fx: { uy: 2, rel: { ha: 1 } }, then: [
            ['ha', 'Phụ lục… nghe như chị bị xếp vào phụ lục. Nhưng ừ, hợp lý.'],
          ] },
          { t: '"Dạ, 200 trang là đầy đủ nhất ạ."', fx: { dr: 1, rel: { ha: 2 } }, then: [
            ['ha', 'Em hiểu chị!'],
            ['think', 'Mình vừa hứa với một người rằng khách sẽ đọc 200 trang.'],
          ] },
          { t: '"Đọc xong, khách cần quyết định điều gì ạ?"', fx: { uy: 2, rel: { ha: 1 }, set: { lit_question: true } }, then: [
            ['ha', 'Quyết định… có nên bán online mạnh hơn không. Ồ. Câu hỏi hay. Ba tuần rồi chưa ai hỏi chị câu đó.'],
          ] },
        ] },
      ] },
      { who: 'trang', obj: 'Trang đã nhận tóm tắt cả 200 trang…', time: '09:30', scene: [
        ['trang', 'Bạn ơi, chị Hạ giao tóm tắt cả báo cáo. Mình nhận rồi. Mình làm kịp mà.'],
        ['long', 'Trang đang làm sáu việc. Bảy, nếu tính việc này.'],
        { if: F('trang_no'), then: [
          ['trang', 'À… nhưng mình nhớ hôm đầu bạn dạy mình. Mình thử… chỉ nhận một nửa?'],
          ['long', 'Ơ. Ơ! Trang vừa nói "chỉ".'],
          { fx: { rel: { trang: 1 } } },
        ] },
        { c: 'ep_lit_split', o: [
          { t: '"Mình viết tóm tắt, Trang làm danh mục biểu đồ."', fx: { nl: -5, rel: { trang: 2 } }, then: [
            ['trang', 'Biểu đồ thì mình làm được nhanh. Cảm ơn bạn.'],
          ] },
          { t: '"Long làm cùng nhé? Mỗi người một phần."', fx: { uy: 1, rel: { long: -1, trang: 1 } }, then: [
            ['long', 'Tao? … Ừ. Tao nợ Trang ba cái brief.'],
          ] },
          { t: 'Để Trang tự làm, cần gì thì gọi.', fx: { rel: { trang: -1 }, set: { trang_overload: true } }, then: [
            ['trang', 'Không sao đâu, mình làm kịp mà.'],
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'Rút 200 trang thành 5 ý chính', time: '11:00', scene: [
        ['nar', 'Bạn mở file. Mục lục dài bốn trang. Chương 1: "Lịch sử giấc ngủ từ thời Ai Cập cổ đại".'],
        { if: F('lit_question'), then: [['think', 'Câu hỏi của khách: có nên bán online mạnh hơn không. Ý nào không trả lời câu đó thì ra phụ lục.']] },
        { mini: LIT_MINI,
          good: [['think', 'Năm ý. Hai trang. Một câu trả lời: có, và đây là lý do.'], { fx: { uy: 3, set: { exec_summary: true } } }],
          bad: [['think', 'Mình vừa chọn "Lịch sử giấc ngủ" làm ý chính. Khách sẽ ngủ thật.'], { fx: { nl: -4 } }],
        },
      ] },
      { who: 'long', obj: 'Long báo động: chị Hạ thêm 12 trang mới', time: '14:00', scene: [
        ['long', 'Báo động. Chị Hạ vừa thêm mục "Giới hạn của nghiên cứu". Mười hai trang. Vào phần tóm tắt.'],
        ['long', 'Tao dịch: chị Hạ sợ khách hỏi "chắc không". Nên chị viết trước mười hai trang "không chắc lắm".'],
        { c: 'ep_lit_limits', o: [
          { t: 'Rút thành một câu cuối tóm tắt, chi tiết vào phụ lục.', fx: { uy: 2, rel: { long: 1 } }, then: [
            ['long', 'Một câu. Mười hai trang thành một câu. Tao muốn khóc.'],
          ] },
          { t: 'Hỏi thẳng chị Hạ vì sao cần mục đó.', fx: { nl: -3, rel: { ha: 2 }, set: { ha_reason: true } }, then: [
            ['ha', 'Vì lần trước khách nói báo cáo của chị "nghe hay nhưng chắc không". Chị nhớ câu đó hai năm.'],
            ['me', 'Vậy mình để một câu "độ tin cậy" thật rõ ở trang 1, chị nhé?'],
            ['ha', '…Một câu thật rõ. Được.'],
          ] },
          { t: 'Giữ nguyên. Chị Hạ là giám đốc mà.', fx: { dr: 1, rel: { ha: 1 } }, then: [
            ['think', 'Bản tóm tắt hai trang giờ có mười bốn trang.'],
          ] },
        ] },
      ] },
      { who: 'ha', obj: 'Chị Hạ đọc bản tóm tắt', time: '16:30', scene: [
        { if: F('exec_summary'), then: [
          ['ha', 'Chị đọc bản tóm tắt rồi. Hai trang. Chị đọc ba lần. Nó nói đúng cái chị muốn nói mà chị không nói được.'],
          ['ha', 'Chị viết dài vì sợ người ta nghĩ mình chưa đủ kỹ. Cảm ơn em. Thật lòng.'],
          { fx: { uy: 2, rel: { ha: 3 }, set: { ha_thanks: true } } },
        ], else: [
          ['ha', 'Bản tóm tắt… hơi dài, em nhỉ. Không sao, tối nay chị sửa. Chị quen rồi.'],
          ['nar', 'Tối đó, đèn bàn chị Hạ sáng tới 22:40.'],
        ] },
        { c: 'ep_lit_end', o: [
          { t: '"200 trang là nền để 2 trang này đứng được ạ."', fx: { rel: { ha: 2 } }, then: [
            ['ha', 'Em nói câu đó với Mai giúp chị nhé. Nói to.'],
          ] },
          { t: 'Mời chị Hạ đi ăn chè.', fx: { money: -25_000, nl: 8, rel: { ha: 2 } }, then: [
            ['ha', 'Chè! Em biết không, có một paper về văn hóa ăn chè ở doanh nghiệp…'],
            ['think', 'Mình biết.'],
          ] },
          { t: '"Lần sau chị cho em tham gia từ đầu ạ."', fx: { uy: 1, rel: { ha: 1 }, set: { ha_invite: true } }, then: [
            ['ha', 'Từ đầu là từ phần phương pháp đấy. Em chắc chưa?'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 10. 200 trang thành 2 trang. ${r.flags.ha_thanks ? 'Chị Hạ cảm ơn mình, thật lòng. Chị viết dài vì sợ người ta nghĩ chị chưa đủ kỹ.' : 'Bản tóm tắt vẫn dài. Đèn bàn chị Hạ sáng tới khuya.'}`,
  },

  // 6 · Sprint 0 vô tận ✱ dat_mba
  {
    id: 'sprint_zero', day: 12, title: 'Sprint 0 vô tận',
    intro: 'Thứ Sáu. Anh Đạt công bố "Sprint 0": bốn nghi thức mỗi sprint cho team chị Linh, cộng daily stand-up.\n\nTeam chị Linh có một người full-time. Giờ người đó có bốn cuộc họp để báo cáo rằng mình không có thời gian.',
    steps: [
      { who: 'dat', obj: '9:00 Sprint 0 ở bảng Scrum', time: '08:30', pos: { dat: 'su_dat', an: 'su1', linh: 'su2', long: 'su3', khang: 'su5' }, scene: [
        ['dat', 'Team! Chào mừng Sprint 0. Từ tuần sau team chị Linh có: Planning, Refinement, Review, Retro. Cộng daily. Agile là văn hóa!'],
        ['linh', 'Đạt, team chị có một người rưỡi. Bốn nghi thức là bốn buổi sáng.'],
        ['dat', 'Chị Linh, đó là impediment. Mình đưa vào parking lot. Parking lot sẽ được review ở… Retro.'],
        ['an', '(nhỏ) Họp để bàn về việc họp quá nhiều. Đệ quy.'],
        { c: 'ep_sprint_open', o: [
          { t: '"Anh cho em ước tính số giờ làm thật còn lại nhé?"', fx: { uy: 2, rel: { linh: 1 } }, then: [
            ['dat', 'Love it! Data-driven! Em làm đi, Retro mình review.'],
          ] },
          { t: 'Dán sticky note "Họp ít hơn" lên bảng.', fx: { dr: 2, rel: { an: 1 } }, then: [
            ['dat', 'Ai viết cái này? … Ok, mình sẽ discuss nó ở Refinement.'],
          ] },
          { t: 'Im lặng ghi chép.', fx: { rel: { dat: 1 } }, then: [
            ['nar', 'Bạn ghi: "Sprint 0: 4 nghi thức. Sprint 1: ?". Anh Đạt nhìn sổ bạn, gật đầu hài lòng.'],
          ] },
        ] },
      ] },
      { who: 'an', obj: 'Cùng An tính số giờ làm thật', time: '09:45', scene: [
        ['an', 'Tuần 40 giờ. Daily "15 phút" thực tế 45 phút. Em tính với anh xem còn bao nhiêu giờ làm thật.'],
        { if: F('final_found'), then: [['an', 'Em là đứa tìm ra FINAL_REAL hôm đầu. Anh tin con số của em.']] },
        { mini: SPRINT_MINI,
          good: [['an', '27 tiếng 45 phút. Anh in to cỡ chữ 48.'], { fx: { uy: 3, rel: { an: 2, linh: 1 }, set: { hours_calc: true } } }],
          bad: [['an', 'Ơ, em ra 35 tiếng à? Anh mong là vậy. Nhưng không phải.'], { fx: { nl: -3 } }],
        },
      ] },
      { who: 'linh', obj: 'Mang con số cho chị Linh', time: '11:00', scene: [
        { if: F('hours_calc'), then: [['linh', '27 tiếng 45 trên 40. Chị biết là ít, nhưng chưa bao giờ thấy nó in đậm thế này.']],
          else: [['linh', 'Chị không cần số chính xác. Chị chỉ cần ai đó nói với Đạt rằng họp không phải là làm.']] },
        ['linh', 'Chị không phản đối Agile. Chị phản đối việc triển khai Agile bằng một nhân viên rưỡi.'],
        { c: 'ep_sprint_linh', o: [
          { t: '"Em mang số qua anh Đạt, đề xuất gộp nghi thức ạ."', fx: { uy: 2, rel: { linh: 2 } }, then: [
            ['linh', 'Đi đi. Nhẹ nhàng. Đạt là người tốt, chỉ là hơi nhiều sticky note.'],
          ] },
          { t: '"Hay chị báo chị Tuyết luôn ạ?"', fx: { dr: 3, rel: { linh: 1, dat: -2 } }, then: [
            ['linh', 'Báo Tuyết thì Tuyết hỏi Hân. Hân bảo Đạt. Đạt mở thêm một buổi họp. Thôi, em thử Đạt trước.'],
          ] },
          { t: '"Em đi họp thay An để An làm việc."', fx: { nl: -10, rel: { an: 3 } }, then: [
            ['an', 'Em là thiên thần. Một thiên thần đi họp.'],
          ] },
        ] },
      ] },
      { who: 'dat', obj: 'Gặp riêng anh Đạt', time: '14:00', scene: [
        ['dat', 'Em muốn gặp anh? Ngồi đi. Đừng nói em cũng ghét stand-up nha.'],
        { if: F('hours_calc'), then: [
          ['me', 'Anh xem giúp em con số này: team chị Linh còn 27 tiếng làm thật mỗi tuần.'],
          ['dat', '…Hai mươi bảy. Anh tính ra hai mươi sáu lúc hai giờ sáng qua. Anh hy vọng anh tính sai.'],
        ] },
        ['dat', 'Nói em nghe, anh từng code sáu năm. Anh ghét họp hơn ai hết. Anh làm Agile Coach để không ai phải họp vô ích như anh.'],
        ['dat', 'Rồi anh thành người tổ chức họp nhiều nhất công ty. Đời nó vậy.'],
        { c: 'ep_sprint_kanban', o: [
          { t: 'Cùng anh Đạt vẽ Kanban thật: 3 cột, tối đa 3 việc đang làm.', fx: { uy: 3, rel: { dat: 3 }, set: { dat_kanban: true } }, then: [
            ['dat', 'WIP limit 3. Hồi code, team anh sống nhờ cái này. Sao anh quên được nhỉ.'],
          ] },
          { t: 'Đề xuất gộp Review và Retro thành một buổi 45 phút.', fx: { rel: { dat: 1, linh: 1 }, set: { sprint_merge: true } }, then: [
            ['dat', 'Gộp hai ritual… đau, nhưng hợp lý. Gọi là "Retroview". Anh in sticker luôn.'],
          ] },
          { t: '"Anh quay lại code đi anh."', fx: { dr: 1, rel: { dat: 1 } }, then: [
            ['dat', 'Anh quên mật khẩu kho code rồi em. Ba năm. Như quên tên người yêu cũ.'],
          ] },
        ] },
      ] },
      { who: 'quynh', obj: 'Chị Quỳnh hỏi chuyện hợp đồng anh Đạt', time: '15:30', when: tie('dat_mba'), scene: [
        ['quynh', 'Em vừa ngồi với Đạt hả? Em có biết hợp đồng của Đạt ai duyệt không?'],
        ['quynh', 'Chị chưa có phiếu chi nào cho Agile Coach. Ba tháng rồi. Tiền chuyển từ quỹ "Đổi mới sáng tạo" của chị Hân.'],
        ['nar', 'Trên bàn chị Quỳnh có tấm ảnh ai đó để quên: lớp MBA khóa 2014. Hàng đầu: chị Hân. Bên cạnh: anh Đạt, chưa đội mũ len.'],
        { c: 'ep_sprint_mba', o: [
          { t: '"Em không rõ ạ. Chị hỏi chị Hân trực tiếp sẽ rõ nhất."', fx: { uy: 1, rel: { quynh: 1 } }, then: [
            ['quynh', 'Ừ. Chị sẽ hỏi. Bằng văn bản.'],
          ] },
          { t: 'Kể rằng anh Đạt từng là developer và đang cố làm tốt.', fx: { rel: { dat: 2 }, set: { defended_dat: true } }, then: [
            ['quynh', 'Chị không nghi Đạt. Chị nghi cái quỹ. Nhưng ừ, chị nhớ rồi.'],
          ] },
          { t: '"Em sẽ không nói chuyện này với ai."', fx: { dr: 1, rel: { quynh: -1 }, set: { mba_secret: true } }, then: [
            ['quynh', 'Tốt. Chị cũng chưa nói gì.'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 12. Sprint 0. ${r.flags.hours_calc ? 'Team chị Linh còn 27 tiếng 45 phút làm thật mỗi tuần.' : 'Mình tính sai số giờ, nhưng ai cũng biết là ít.'} ${r.flags.dat_kanban ? 'Anh Đạt từng code sáu năm. Hôm nay anh vẽ lại cái Kanban đầu tiên của đời mình.' : 'Anh Đạt từng là developer. Không ai đoán ra.'}`,
  },

  // 7 · Team building thứ Bảy ✱ phuong_friend
  {
    id: 'saturday_tb', day: 15, title: 'Team building thứ Bảy',
    intro: 'Thứ Hai tuần thứ ba. Group "T&M Family 💖" có poll lúc 6 giờ sáng: "Team building thứ Bảy này: Bonding qua thử thách 🔥".\n\nĐây là thứ Bảy thứ bảy liên tiếp của công ty. Intern hết được miễn từ tuần này.',
    chatStart: [['phuong', 'Team building thứ Bảy này nha cả nhà! "Bonding qua thử thách" 🔥💖🎉 Intern vào ban tổ chức nhé!', false]],
    steps: [
      { who: 'phuong', obj: 'Chị Phương mời vào ban tổ chức', time: '08:30', scene: [
        ['phuong', '{ten}! Em vào ban tổ chức nhé. Năm trò chơi, hai bài hát, một màn "nói lời cảm ơn trong nước mắt". Chị lo phần nước mắt.'],
        ['phuong', 'Thứ Bảy thứ bảy liên tiếp đó em! Kỷ lục văn hóa của T&M.'],
        { c: 'ep_tb_join', o: [
          { t: '"Dạ em nhận ạ."', fx: { nl: -3, rel: { phuong: 2 }, set: { tb_org: true } }, then: [
            ['phuong', 'Yay! Em lo phần trò "kéo co bằng dây cáp sạc" nha.'],
          ] },
          { t: '"Mọi người đã đồng ý hết chưa ạ?"', fx: { uy: 1, rel: { phuong: -1 } }, then: [
            ['phuong', 'Poll mà em. 100% đồng ý! … Ba người vote. Chị, anh Đạt, và chị Hân.'],
          ] },
          { t: '"Thứ Bảy em có lịch với gia đình ạ."', fx: { dr: 1, rel: { phuong: -1 } }, then: [
            ['phuong', 'Gia đình T&M cũng là gia đình mà em 💖'],
            ['think', 'Không ai cãi thắng một câu có emoji trái tim.'],
          ] },
        ] },
      ] },
      { who: 'long', obj: 'Long và Trang đang than', time: '10:00', scene: [
        ['long', 'Thứ Bảy nữa hả? Tao không về quê ba tuần rồi. Mẹ tao hỏi tao còn sống không, tao gửi ảnh team building.'],
        ['trang', 'Mình đi được mà… chỉ là deck Êm Ru chưa xong, mình định làm vào thứ Bảy.'],
        { if: F('trang_overload'), then: [['think', 'Trang vẫn đang ôm việc từ tuần trước. Giờ thêm thứ Bảy.']] },
        { c: 'ep_tb_poll', o: [
          { t: 'Làm một poll ẩn danh thật: "Thứ Bảy hay chiều thứ Sáu?"', fx: { uy: 2, rel: { long: 2, trang: 1 }, set: { tb_poll: true } }, then: [
            ['nar', 'Mười bốn phiếu. Mười hai chọn chiều thứ Sáu. Hai chọn "đừng tổ chức nữa". Không ai chọn thứ Bảy.'],
          ] },
          { t: 'Rủ Long và Trang lo trò chơi cùng cho nhanh.', fx: { nl: -4, rel: { long: -1, trang: 1 } }, then: [
            ['long', 'Mày rủ tao tổ chức cái tao ghét. Đây là bonding thật sự.'],
          ] },
          { t: '"Thôi cố thêm tuần này."', fx: { dr: 1, rel: { long: -1 } }, then: [
            ['long', 'Câu này tao nghe bảy tuần rồi.'],
          ] },
        ] },
      ] },
      { who: 'an', obj: 'An nhờ việc cho deck Êm Ru', time: '11:30', scene: [
        ['an', 'Em ơi, chị Linh nhờ em phần phụ lục deck Êm Ru. Hạn sáng thứ Hai tuần sau. Anh biết, trùng thứ Bảy.'],
        { c: 'ep_tb_deck', o: [
          { t: 'Nhận, làm xong trước tối thứ Sáu.', fx: { nl: -5, rel: { an: 1, linh: 1 }, set: { tb_deck: true } }, then: [
            ['an', 'Em lên kế hoạch như người full-time rồi đấy. Đừng để chị Linh biết, chị sẽ tính em là "một".'],
          ] },
          { t: 'Nói thật: thứ Bảy em vướng team building.', fx: { uy: 1, rel: { an: 1 } }, then: [
            ['an', 'Ừ, anh cũng vướng. Hai người vướng cùng một chỗ, gọi là "team".'],
          ] },
        ] },
      ] },
      { who: 'phuong', obj: 'Thuyết phục chị Phương dời lịch', time: '14:00', scene: [
        ['phuong', 'Em muốn nói gì với chị? Nói nhanh nha, chị đang cắt chữ "BONDING" bằng giấy kim tuyến.'],
        { if: tie('phuong_friend'), then: [
          ['nar', 'Trên bàn chị Phương có tấm ảnh: một bé gái ngồi trong lòng chị Tuyết. Chú thích: "Cô Tuyết & bé Phương, 2001".'],
          ['think', 'À. Vì vậy mà team building nào cũng được duyệt.'],
        ] },
        { c: 'ep_tb_move', o: [
          { t: 'Đưa kết quả poll: 12/14 chọn chiều thứ Sáu.', when: F('tb_poll'), fx: { uy: 3, rel: { phuong: 1 }, set: { tb_friday: true } }, then: [
            ['phuong', 'Mười hai trên mười bốn… Chị tưởng mọi người thích thứ Bảy. Không ai nói với chị.'],
          ] },
          { t: '"Chiều thứ Sáu đủ người hơn, ảnh đẹp hơn cho fanpage ạ."', fx: { rel: { phuong: 2 }, set: { tb_friday: true } }, then: [
            ['phuong', 'Ảnh đẹp hơn… Ok, em hiểu chị quá!'],
          ] },
          { t: '"Hay tuần này team building là… ngủ ạ?"', fx: { dr: 3, rel: { phuong: -2 } }, then: [
            ['phuong', 'Văn hóa không có ngày nghỉ, em ạ.'],
          ] },
        ] },
      ] },
      { who: 'tuyet', obj: 'Chị Tuyết gọi về lịch team building', time: '16:00', scene: [
        { if: F('tb_friday'), then: [
          ['tuyet', 'Phương xin dời team building sang chiều thứ Sáu. Nó nói là ý của em.'],
          { if: tie('phuong_friend'), then: [
            ['tuyet', 'Phương là con gái bạn thân chị. Ai nói "không" với team building là nói "không" với nó. Chị biết, nên chị luôn duyệt.'],
            ['tuyet', 'Nhưng nó cần nghe "không" từ người khác ngoài chị. Lần này em nói đúng cách.'],
            { fx: { uy: 1, rel: { tuyet: 1 } } },
          ] },
          ['tuyet', 'Chiều thứ Sáu. Ba tiếng. Không bài hát nào quá năm phút. Chị duyệt.'],
          { fx: { uy: 2, rel: { tuyet: 1, long: 1, trang: 1 } } },
        ], else: [
          ['tuyet', 'Thứ Bảy này team building. Em trong ban tổ chức à? Tốt. Nhớ deck Êm Ru vẫn hạn sáng thứ Hai.'],
          { if: tie('phuong_friend'), then: [['tuyet', 'Phương là con gái bạn chị. Nó làm vì nó thương công ty. Đừng làm nó buồn.']] },
          ['think', 'Một câu vừa là dặn dò, vừa là cảnh báo.'],
          { fx: { nl: -8, dr: 2, set: { tb_saturday: true } } },
        ] },
        { c: 'ep_tb_end', o: [
          { t: '"Dạ em sẽ lo phần trò chơi thật gọn ạ."', fx: { rel: { phuong: 1 } }, then: [
            ['tuyet', 'Gọn là từ chị thích nhất trong tuần.'],
          ] },
          { t: '"Em đề xuất tháng sau thử team building bằng… về sớm ạ."', fx: { uy: 1, dr: 1, set: { suggested_early: true } }, then: [
            ['tuyet', 'Chị sẽ coi đó là một ý nhỏ.'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 15. ${r.flags.tb_friday ? 'Team building dời sang chiều thứ Sáu. Long sẽ được về quê.' : 'Thứ Bảy thứ tám liên tiếp. Mẹ Long sẽ nhận thêm một ảnh team building.'} ${r.flags.tie_phuong_friend ? 'Chị Phương là con gái bạn thân chị Tuyết. Mọi thứ Bảy giờ đều có lời giải thích.' : ''}`,
  },

  // 8 · When I was overseas ✱ khang_han
  {
    id: 'overseas', day: 17, title: 'When I was overseas',
    intro: 'Thứ Tư. Bản phân tích phân khúc khách hàng cho Êm Ru đã xong 90%: 1.200 phiếu khảo sát, An làm hai tuần.\n\nSáng nay Khang đi họp về, tai vẫn đeo tai nghe, miệng nói: "Actually…"',
    steps: [
      { who: 'an', obj: 'An khoe bản phân tích 90%', time: '08:30', scene: [
        ['an', 'Em xem nè. 1.200 phiếu. Ba phân khúc: "ngủ để đi làm", "ngủ để quên đi làm", và "mua nệm cho bố mẹ".'],
        ['an', 'Thứ Sáu nộp. Lần đầu tiên trong năm anh thấy mình về sớm được.'],
        ['think', 'Câu này nghe như câu cuối trong phim, ngay trước khi có chuyện.'],
        { c: 'ep_ovs_an', o: [
          { t: 'Soát số liệu cùng An.', fx: { nl: -4, rel: { an: 1 } }, then: [
            ['an', 'Sai đúng một chỗ: anh gõ "bố mẹ" thành "bố mẹ mẹ". Em cứu anh lần thứ hai.'],
          ] },
          { t: 'Lưu một bản 90% kèm ngày giờ.', fx: { uy: 1, set: { ovs_backup: true } }, then: [
            { if: F('bao_tips'), then: [['think', 'Lời anh Bảo hôm phỏng vấn: lưu file luôn kèm ngày giờ.']], else: [['think', 'Cảm giác bảo mình nên làm vậy.']] },
          ] },
        ] },
      ] },
      { who: 'khang', obj: 'Khang muốn "đổi approach"', time: '09:30', scene: [
        ['khang', 'An, {ten}, mình cần đổi approach. Actually, when I was overseas, không ai segment bằng survey nữa. Người ta dùng behavioral data.'],
        ['an', 'Êm Ru không có behavioral data. Họ có… một cuốn sổ bảo hành.'],
        ['khang', 'Thì mình tạo data. Mindset thôi. Làm lại từ đầu, thứ Sáu vẫn nộp.'],
        { if: tie('khang_han'), then: [
          ['khang', 'Anh nói với dì… với chị Hân rồi. Chị ấy rất excited.'],
          { if: F('heard_khang_di'), then: [['think', 'Lần thứ hai Khang suýt gọi chị Hân là "dì".']], else: [['think', '"Dì"?']] },
        ] },
        { c: 'ep_ovs_first', o: [
          { t: '"Anh cho em cách làm cụ thể, em so với dữ liệu mình có ạ."', fx: { uy: 2 }, then: [
            ['khang', 'Sure. So đi. Data sẽ nói anh đúng.'],
          ] },
          { t: '"Dạ, để em làm lại."', fx: { nl: -8, rel: { khang: 2, an: -2 }, set: { ovs_redo: true } }, then: [
            ['an', '(nhìn bạn rất lâu)'],
          ] },
          { t: '"Anh ở nước ngoài bao lâu ạ?"', fx: { dr: 2, rel: { khang: -1 } }, then: [
            { if: F('asked_overseas'), then: [['khang', 'Em hỏi câu này lần thứ hai rồi đó. Vẫn ba tháng. Vẫn intense.']],
              else: [['khang', 'Ba tháng. Exchange. Nhưng intense.']] },
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'So phương pháp của Khang với dữ liệu thật', time: '11:00', scene: [
        ['nar', 'Bạn mở hai cửa sổ: bản phân tích của An, và một bài báo tiếng Anh Khang gửi, tiêu đề "Survey is dead".'],
        { mini: OVS_MINI,
          good: [['think', 'Ba con số. Không cần "overseas". Chỉ cần đọc kỹ.'], { fx: { uy: 3, set: { ovs_numbers: true } } }],
          bad: [['think', 'Mình vừa đánh dấu "Survey is dead" là sự thật. Khang sẽ vui.'], { fx: { nl: -4 } }],
        },
      ] },
      { who: 'khang', obj: 'Họp chốt phương pháp với Khang', time: '14:00', scene: [
        { if: F('ovs_numbers'), then: [['me', 'Em so ba điểm: mẫu đủ lớn, Êm Ru không có dữ liệu hành vi, và nhóm "mua cho bố mẹ" đang bị bỏ trống. Làm lại thì mất điểm thứ ba.']],
          else: [['me', 'Em nghĩ… làm lại thì không kịp ạ.'], ['khang', 'Đó là mindset "không kịp". Overseas không ai nói "không kịp".']] },
        { if: tie('khang_han'), then: [
          ['han', 'Có chuyện gì vậy các em? Khang đang đề xuất một approach rất insightfull mà.'],
          ['think', 'Chê Khang lúc này là chê chị Hân. Trước mặt chị Hân.'],
        ] },
        { c: 'ep_ovs_push', o: [
          { t: 'Đưa ba con số; "behavioral data" để làm giai đoạn 2.', when: F('ovs_numbers'), fx: { uy: 4, rel: { khang: -1, an: 2 }, set: { pushed_khang: true } }, then: [
            ['khang', '…Giai đoạn 2. Ok. Overseas người ta cũng làm theo phase.'],
            { if: tie('khang_han'), then: [
              ['han', 'Data nói vậy thì… Khang, mình để phase 2 nha con. À, nha em.'],
              ['think', '"Con".'],
              { fx: { set: { knows_khang_han: true } } },
            ] },
          ] },
          { t: 'Để Khang "thắng" slide 2, giữ bản cũ ở slide 1.', fx: { dr: 1, rel: { khang: 1, an: 1 }, set: { ovs_compromise: true } }, then: [
            ['khang', 'Slide 1 bản cũ, slide 2 "overseas vision". Deal. Win-win.'],
          ] },
          { t: 'Đồng ý làm lại.', fx: { nl: -10, rel: { khang: 2, an: -2 }, set: { ovs_redo: true } }, then: [
            ['khang', 'Great mindset! Anh sẽ review vào tối thứ Năm. Anh đi gym trước.'],
          ] },
        ] },
      ] },
      { who: 'an', obj: 'An ở lại bàn', time: '16:00', scene: [
        { if: F('ovs_redo'), then: [
          ['an', 'Mình làm lại từ đầu. Anh đặt trà sữa size L. Cho cả tuần.'],
          ['nar', 'Thứ Sáu, bản "behavioral" nộp lúc 23:58. Nó giống bản survey ở tám mươi phần trăm các slide.'],
          { fx: { nl: -6 } },
        ], else: [
          ['an', 'Em biết không, hai năm nay chưa ai cãi Khang mà thắng. Em làm bằng số. Số thì không ai cãi được.'],
          ['an', 'Anh mời em ly cà phê. Loại có đá, không phải 3in1.'],
          { fx: { nl: 8, rel: { an: 2 } } },
        ] },
        { c: 'ep_ovs_end', o: [
          { t: '"Công là của anh, em chỉ đếm."', fx: { rel: { an: 2 } }, then: [['an', 'Đếm đúng là một nửa công việc. Nửa còn lại là dám nói.']] },
          { t: '"Lần sau mình mời anh Khang vào từ đầu."', fx: { uy: 1, rel: { khang: 1 } }, then: [
            ['an', 'Ý hay. Để anh ấy "overseas" từ ngày đầu, đỡ quay xe ngày cuối.'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 17. ${r.flags.pushed_khang ? 'Mình cãi Khang bằng ba con số. Khang lùi về "phase 2".' : r.flags.ovs_redo ? 'Mình đồng ý làm lại. An nhìn mình rất lâu.' : 'Slide 1 của An, slide 2 của Khang. Hòa.'} ${r.flags.knows_khang_han ? 'Chị Hân gọi Khang là "con". Mọi chuyện giờ đã rõ.' : ''}`,
  },

  // 9 · Bảo, ba năm vẫn intern ✱ bao_driver — key flag bao_dossier (promotion)
  {
    id: 'bao_three', day: 19, title: 'Bảo, ba năm vẫn intern',
    intro: 'Thứ Sáu. Anh Bảo đặt lên bàn bạn một tờ giấy: "Đơn đề nghị ký hợp đồng lao động (lần 7)".\n\n"Lần này tao cần một người làm chứng. Mày rảnh không?"',
    steps: [
      { who: 'bao', obj: 'Anh Bảo cần một người làm chứng', time: '08:30', scene: [
        ['bao', 'Ba năm, ba tháng. Sáu lá đơn trước đều được trả lời: "để chị hỏi".'],
        ['bao', 'Không ai từ chối tao. Chỉ là không ai làm giấy tờ. Tao thực tập lâu tới mức intern mới tưởng tao là quản lý intern.'],
        { if: tie('bao_driver'), then: [
          ['bao', 'Bố tao lái xe cho chị Tuyết mười năm. Hồi tao vào, chị hứa với bố "để chị lo cho nó". Rồi… chị bận.'],
        ] },
        { c: 'ep_bao_help', o: [
          { t: '"Em giúp. Mình làm hồ sơ chứng minh công việc của anh."', fx: { rel: { bao: 2 } }, then: [
            ['bao', 'Hồ sơ. Đúng rồi. Ba năm tao viết đơn, chưa ai bảo tao làm hồ sơ.'],
          ] },
          { t: '"Anh có nghĩ tới chỗ khác chưa?"', fx: { rel: { bao: 1 } }, then: [
            ['bao', 'Nghĩ hằng ngày. Nhưng tao muốn đi khi đã được ký, chứ không phải đi vì không được ký.'],
          ] },
          { t: '"Sao anh không tự làm hồ sơ?"', fx: { dr: 1 }, then: [
            ['bao', 'Tao làm rồi. Sáu lần. Lần này cần người ngoài. Người ngoài thì người ta nghe.'],
          ] },
        ] },
      ] },
      { who: 'thu', obj: 'Hỏi Thư hồ sơ của Bảo đang kẹt ở đâu', time: '09:30', scene: [
        ['thu', 'Hồ sơ hợp đồng của anh Bảo hả? Cái này không phải việc của mình, nhưng mà… mình biết nó kẹt ở đâu.'],
        ['thu', 'Chị Phương nói hồ sơ ở chỗ chị Quỳnh. Chị Quỳnh nói chờ chị Tuyết duyệt. Chị Tuyết nói "để chị hỏi". Hỏi chị Phương.'],
        ['think', 'Một vòng tròn hoàn hảo. Không có điểm đầu, không có điểm cuối. Như sơ đồ Agile.'],
        { if: ANY('knows_whodoes', 'in_whodoes'), then: [['thu', 'File "Ai làm gì" ghi: "Hợp đồng lao động: (trống)". Ba năm rồi không ai điền.']] },
        { c: 'ep_bao_route', o: [
          { t: 'Nhờ Thư xếp 15 phút với chị Tuyết chiều nay.', fx: { rel: { thu: 2 } }, then: [
            ['thu', 'Mình xếp 15:00. Lý do mình ghi là "ý nhỏ". Chị Tuyết không bao giờ từ chối ý nhỏ.'],
          ] },
          { t: 'Tự đặt lịch qua chị Gấm.', fx: { rel: { gam: 1 } }, then: [
            { if: F('gam_calendar'), then: [['gam', 'Lịch chị Tuyết chiều nay hả… chị đặt trên lịch online rồi nhé. Chị học được rồi đó.']],
              else: [['gam', 'Lịch chị Tuyết hả… chị ghi rồi. 15:00. Lần này bút bi.']] },
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'Lục ba năm email tìm bằng chứng cho Bảo', time: '10:30', scene: [
        ['nar', 'Hộp thư chung có 4.112 email nhắc tên Bảo. 3.900 cái là "Bảo ơi máy in".'],
        { mini: BAO_MINI,
          good: [
            ['think', 'Bốn email. Ba năm. Một người làm việc như nhân viên mà được trả như người học việc.'],
            ['nar', '(Thông tin giải trí, không phải tư vấn pháp lý: theo Bộ luật Lao động, việc có trả công, có quản lý, điều hành thì có thể được coi là quan hệ lao động, dù gọi tên là gì.)'],
            { fx: { uy: 3, rel: { bao: 2 }, set: { bao_dossier: true } } },
          ],
          bad: [['think', 'Mình vừa chọn "Áo đẹp nhất team building" làm bằng chứng. Mạnh, nhưng sai hướng.'], { fx: { nl: -4 } }],
        },
      ] },
      { who: 'quynh', obj: 'Hỏi chị Quỳnh về hồ sơ trong ngăn kéo', time: '13:30', scene: [
        ['quynh', 'Hồ sơ của Bảo hả? Chị có. Ngăn kéo thứ ba. Từ năm ngoái. Chỉ thiếu một chữ ký.'],
        ['quynh', 'Chị không ký vì chưa ai duyệt ngân sách. Không ai duyệt vì không ai đưa lên. Không ai đưa lên vì… chị không biết.'],
        { if: F('quynh_trust'), then: [['quynh', 'Em là đứa đối soát Êm Ru đúng không? Chị tin số của em. Chị tính sẵn chi phí cho em mang lên.']] },
        { c: 'ep_bao_quynh', o: [
          { t: '"Chị tính giúp em chi phí nếu ký hợp đồng cho anh Bảo ạ."', fx: { uy: 2, rel: { quynh: 1 }, set: { bao_cost: true } }, then: [
            ['quynh', 'Lương, cộng phần bảo hiểm công ty đóng. Một dòng. Chị in bản gốc.'],
          ] },
          { t: '"Chị đi cùng em lên gặp chị Tuyết được không ạ?"', fx: { rel: { quynh: 1 }, set: { quynh_joins: true } }, then: [
            ['quynh', 'Chị đi. Ba năm rồi, chị cũng muốn đóng cái ngăn kéo này lại.'],
          ] },
        ] },
      ] },
      { who: 'tuyet', obj: '15:00 Gặp chị Tuyết: "ý nhỏ" về anh Bảo', time: '15:00', scene: [
        ['tuyet', 'Em xin chị mười lăm phút. Lịch ghi lý do: "ý nhỏ". Ý nhỏ của em là gì?'],
        { if: F('bao_dossier'), then: [['me', 'Hồ sơ của anh Bảo ạ: bốn bằng chứng anh ấy làm việc như một nhân viên. Chi phí có chị Quỳnh. Chỉ thiếu chữ ký của chị.']],
          else: [['me', 'Dạ, anh Bảo thực tập ba năm rồi ạ. Em nghĩ anh ấy xứng đáng được ký hợp đồng.']] },
        { if: tie('bao_driver'), then: [
          ['tuyet', '…Bố Bảo lái xe cho chị mười năm. Ngày ông nghỉ, chị hứa sẽ lo cho thằng bé.'],
          ['tuyet', 'Rồi chị lo cho khách, cho deck, cho mấy cái ý nhỏ. Ba năm. Chị quên làm đúng một việc.'],
        ] },
        { if: F('bao_dossier'), then: [
          ['tuyet', 'Đây là phân tích. Và đây là business implication: chị đang trả phụ cấp intern cho người làm việc của senior.'],
          ['tuyet', 'Chị ký. Hôm nay. Không "để chị hỏi".'],
          { fx: { uy: 4, rel: { tuyet: 2, bao: 3 }, set: { bao_signed: true } } },
        ], else: [
          ['tuyet', 'Chị hiểu. Để chị hỏi lại Phương và Quỳnh nhé.'],
          ['think', '"Để chị hỏi." Lá đơn thứ bảy, câu trả lời thứ bảy.'],
          { fx: { dr: 2 } },
        ] },
      ] },
      { who: 'bao', obj: 'Anh Bảo đợi ở bàn', time: '16:00', scene: [
        { if: F('bao_signed'), then: [
          ['bao', 'Chị Tuyết ký rồi. Ba năm. Tao… không biết làm gì với hai tay mình.'],
          ['bao', 'Nhưng mày biết không, sáng nay có công ty khác gọi tao. Họ trả hơn. Họ không cần ba năm để tin tao.'],
        ], else: [
          ['bao', '"Để chị hỏi." Tao thuộc câu đó hơn tên mình.'],
          ['bao', 'Sáng nay có công ty khác gọi tao. Tao nghĩ… tới lúc rồi.'],
        ] },
        ['bao', 'Mày nghĩ tao nên ở lại không?'],
        { c: 'ep_bao_stay', o: [
          { t: '"Ở lại. Anh đã đòi được thứ của mình."', when: F('bao_signed'), fx: { rel: { bao: 2 }, set: { bao_official: true } }, then: [
            ['bao', 'Ừ. Tao ở. Để xem chỗ này thay đổi được không. Mà nếu không… tao có hợp đồng để báo trước đúng luật.'],
          ] },
          { t: '"Đi đi anh. Anh xứng đáng với chỗ không bắt anh chờ ba năm."', fx: { rel: { bao: 2 }, set: { bao_left: true, bao_notebook: true } }, then: [
            ['bao', 'Tao làm nốt tới hết đợt của mày rồi đi. Ba năm rồi, thêm vài tuần không sao.'],
            ['bao', 'Cầm lấy. Sổ tay ba năm của tao: mật khẩu, máy in dự phòng, ai thật sự quyết việc gì. Đừng để ai biết mày có nó.'],
          ] },
          { t: '"Anh hỏi lòng mình đi. Em không quyết thay được."', fx: { rel: { bao: 1 } }, then: [
            { if: F('bao_signed'), then: [
              ['bao', 'Lòng tao nói: ở. Lòng tao hơi dại. Nhưng ở.'],
              { fx: { set: { bao_official: true } } },
            ], else: [
              ['bao', 'Lòng tao nói: đi. Tao làm nốt tới hết đợt của mày. Cầm sổ tay của tao này, đừng làm mất.'],
              { fx: { set: { bao_left: true, bao_notebook: true } } },
            ] },
          ] },
        ] },
      ] },
    ],
    diary: (r) => {
      if (r.flags.bao_official) return 'Ngày 19. Anh Bảo được ký hợp đồng sau ba năm. Anh ở lại. Hôm nay mình hiểu: ở đây ai cũng thương Bảo, nhưng không ai làm giấy tờ.';
      if (r.flags.bao_signed) return 'Ngày 19. Chị Tuyết ký cho anh Bảo. Rồi anh Bảo chọn đi. Đôi khi được ký chỉ để có quyền tự chọn.';
      return 'Ngày 19. "Để chị hỏi" lần thứ bảy. Anh Bảo sẽ đi sau đợt của mình. Mình đang giữ sổ tay ba năm của anh.';
    },
  },

  // 10 · Một nhân viên rưỡi
  {
    id: 'one_half', day: 22, title: 'Một nhân viên rưỡi',
    intro: 'Thứ Hai tuần thứ tư. Chị Tuyết giao thêm cho team chị Linh một dự án: "Tái cấu trúc chuỗi cửa hàng Gối Ôm Hạnh Phúc".\n\nMinh nghỉ thi. Bảo Ngọc "đang làm dự án khác". Team chị Linh có An. Và, theo cách tính của chị Linh, một nửa là bạn.',
    chatStart: [['minh', 'Em xin nghỉ hết tuần để thi ạ. Em có mang laptop vào phòng thi nhưng giám thị không cho 😢', false], ['baongoc', 'Mình đang làm dự án khác, sẽ phản hồi sau.', false]],
    steps: [
      { who: 'linh', obj: 'Chị Linh gọi bạn', time: '08:30', scene: [
        ['linh', 'Em ngồi đi. Chị nói thẳng: chị Tuyết giao thêm dự án. Team chị giờ có An, cộng em. Một nhân viên rưỡi.'],
        ['think', 'Mình là "rưỡi".'],
        ['linh', 'Chị cần số liệu workload để nói chuyện với chị Tuyết lúc 15:30. Không phải than. Là số.'],
        { c: 'ep_half_start', o: [
          { t: '"Dạ, em làm bảng workload ngay ạ."', fx: { uy: 1, rel: { linh: 1 } }, then: [['linh', 'Cột cuối ghi "rủi ro nếu không làm gì". Chị Tuyết đọc cột cuối trước.']] },
          { t: '"Em dùng lại số giờ làm thật từ Sprint 0 được không chị?"', when: F('hours_calc'), fx: { uy: 2, rel: { linh: 2 }, set: { half_reuse: true } }, then: [
            ['linh', 'Hai mươi bảy tiếng bốn lăm. Chị dán con số đó lên màn hình rồi.'],
          ] },
          { t: '"Chị có muốn từ chối luôn dự án không ạ?"', fx: { dr: 1, rel: { linh: 1 } }, then: [
            ['linh', 'Ở T&M không ai từ chối dự án. Người ta chỉ "đề xuất phương án nguồn lực".'],
          ] },
        ] },
      ] },
      { who: 'an', obj: 'Đếm nguồn lực thật cùng An', time: '09:30', scene: [
        ['an', 'Đếm nguồn lực thật đi em. Anh đếm hoài ra một con số buồn.'],
        { mini: HALF_MINI,
          good: [['an', 'Thiếu đúng một người. Con số buồn, nhưng là con số thật.'], { fx: { uy: 3, rel: { an: 1 }, set: { half_numbers: true } } }],
          bad: [['an', 'Em ra 1,8 người à? Đó là con số trên sơ đồ. Sơ đồ không đi thi, Minh thì có.'], { fx: { nl: -4 } }],
        },
      ] },
      { who: 'call:minh', obj: 'Minh gọi từ hành lang phòng thi (nghe máy)', time: '11:00',
        call: { title: 'Minh · "Em còn 7 phút"', people: ['minh', 'an', 'me'] }, scene: [
        ['minh', 'Em đang đứng ở hành lang phòng thi. Còn bảy phút. Anh chị cần gì ạ?'],
        ['an', 'Minh, tối nay em làm được hai tiếng không?'],
        { c: 'ep_half_minh', o: [
          { t: '"Minh thi đi. Tuần này mình ghi Minh bằng 0."', fx: { uy: 1, set: { minh_zero: true } }, then: [
            ['minh', 'Cảm ơn anh chị. Thi xong em làm bù. Em hứa.'],
          ] },
          { t: '"Tối nay Minh làm một tiếng thôi được không?"', fx: { dr: 1, rel: { an: 1 } }, then: [
            ['minh', 'Dạ… được ạ. Môn mai là Đạo đức kinh doanh.'],
            ['think', 'Trớ trêu.'],
          ] },
        ] },
      ] },
      { who: 'linh', obj: 'Chốt đề xuất với chị Linh', time: '14:00', scene: [
        ['linh', 'Cho chị xem bảng.'],
        { if: F('half_numbers'), then: [['linh', 'Thiếu đúng một người. Chị cứ nghĩ là thiếu một rưỡi, nhưng chị lấy số của em. Số của em đỡ đau hơn.']],
          else: [['linh', 'Hơi lộn xộn, nhưng chị hiểu ý. Mình sẽ nói bằng câu chuyện thay vì bằng số. Rủi ro hơn.']] },
        { c: 'ep_half_ask', o: [
          { t: 'Xin thêm nửa người (tuyển part-time).', fx: { set: { half_ask_hc: true } }, then: [['linh', 'Nửa người. Nghe như xin nửa cái bánh mì. Nhưng ok.']] },
          { t: 'Xin lùi hạn hai tuần.', fx: { set: { half_ask_deadline: true } }, then: [['linh', 'Thời gian rẻ hơn người. Chị Tuyết thích thứ rẻ.']] },
          { t: 'Đưa cả hai, để chị Tuyết chọn một.', fx: { uy: 1, set: { half_ask_hc: true } }, then: [
            ['linh', 'Cho sếp hai lựa chọn. Em học ai vậy? … Ừ, chị đây.'],
          ] },
        ] },
      ] },
      { who: 'tuyet', obj: '15:30 Phòng họp: chị Linh trình bày với chị Tuyết', time: '15:30', pos: { tuyet: 'mr_head', linh: 'mr_n1' }, scene: [
        ['tuyet', 'Linh, em có mười phút. Đừng nói "team mệt". Ai cũng mệt.'],
        ['linh', 'Không phải mệt. Là thiếu một người. Bảng đây.'],
        ['tuyet', 'Đây là phân tích. Nhưng đâu là business implication?'],
        ['linh', '{ten}, em nói đi.'],
        { c: 'ep_half_impl', o: [
          { t: '"Không thêm người hoặc lùi hạn thì trễ Êm Ru đợt 3, khách đang chuẩn bị trả tiền ạ."', when: F('half_numbers'), fx: { uy: 4, rel: { tuyet: 2, linh: 2 }, set: { linh_win: true } } },
          { t: '"Team chị Linh đang làm hết sức ạ."', fx: { dr: 1, rel: { linh: 1 } }, then: [
            ['tuyet', 'Hết sức không phải là một chỉ số.'],
          ] },
          { t: '"Chị Linh cần nửa người. Em là nửa đó, và em sắp hết thực tập ạ."', when: (r) => r.status !== 'official', fx: { dr: 2, rel: { tuyet: 1, linh: 2 }, set: { linh_win: true } }, then: [
            ['tuyet', 'Lý lẽ kém. Nhưng sự thật thì đúng.'],
          ] },
        ] },
        { if: F('linh_win'), then: [
          { if: F('half_ask_deadline'), then: [['tuyet', 'Lùi hai tuần. Chị gọi khách Gối Ôm.'], { fx: { set: { linh_deadline: true } } }],
            else: [['tuyet', 'Chị cho tuyển một part-time ba tháng. Quỳnh sẽ hỏi ngân sách. Chị trả lời trước.'], { fx: { set: { linh_headcount: true } } }] },
          ['linh', '(nhỏ) Lần đầu tiên trong năm.'],
          { fx: { rel: { linh: 1 } } },
        ], else: [
          ['tuyet', 'Chị cho thêm một tuần. Hết.'],
          ['linh', 'Một tuần còn hơn không tuần nào.'],
        ] },
      ] },
    ],
    diary: (r) => `Ngày 22. Mình là "rưỡi" trong "một nhân viên rưỡi". ${r.flags.linh_headcount ? 'Chị Linh được thêm một part-time. Lần đầu tiên trong năm.' : r.flags.linh_deadline ? 'Chị Linh được lùi hạn hai tuần.' : 'Chị Linh được thêm đúng một tuần.'}`,
  },

  // 11 · Lời mời thứ ba — key flag mai_vouch (promotion)
  {
    id: 'third_offer', day: 24, title: 'Lời mời thứ ba',
    intro: 'Thứ Tư. Chị Mai nhận email lần thứ ba từ Bốn Phương Global, hãng tư vấn lớn nhất khu Tòa Tháp Kính.\n\nLần này họ gửi kèm con số. Chị Mai rủ bạn xuống pantry, nói nhỏ: "Em giúp chị nghĩ."',
    steps: [
      { who: 'mai', obj: 'Chị Mai đợi ở pantry', time: '08:30', pos: { mai: 'pantry' }, scene: [
        ['mai', 'Bốn Phương mời chị lần thứ ba. Lương gấp đôi, chức "Manager", văn phòng nhìn ra sông.'],
        ['mai', 'Hai lần trước chị từ chối vì ở đây chị được làm việc chị thích: hỏi khách thật sự cần gì. Lần này… chị không chắc.'],
        ['mai', 'Em đừng nói ai nhé. Chị trẻ nhất, mà chị mệt nhất.'],
        { c: 'ep_mai_open', o: [
          { t: '"Vậy chị thật sự cần gì ạ?"', fx: { uy: 1, rel: { mai: 2 } }, then: [
            ['mai', '…Hỏi ngược chị câu của chị. Được lắm. Để chị viết ra.'],
          ] },
          { t: '"Gấp đôi lương thì đi luôn chị!"', fx: { dr: 1 }, then: [
            ['mai', 'Ai cũng nói vậy. Đó là lý do chị hỏi em, không hỏi ai cả.'],
          ] },
          { t: '"Chị đi thì em không biết hỏi ai nữa."', fx: { nl: -2, rel: { mai: 1 } }, then: [
            ['mai', 'Hỏi Long. Long dịch được chị Hân thì dịch được cả cuộc đời.'],
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'Đọc danh sách chị Mai gửi', time: '10:00', scene: [
        ['nar', 'Chị Mai gửi bạn một tin nhắn: bảy dòng, không tiêu đề. "Chọn giúp chị ba cái chị thật sự cần."'],
        { mini: MAI_MINI,
          good: [['think', 'Ba điều. Không cái nào là "view sông". Không cái nào cần đổi công ty mới có.'], { fx: { uy: 2, rel: { mai: 1 }, set: { mai_compare: true } } }],
          bad: [['think', 'Mình chọn "view sông". Chị Mai sẽ cười mình. Chị ấy sẽ đúng.'], { fx: { nl: -3 } }],
        },
      ] },
      { who: 'long', obj: 'Giờ trưa ở pantry', time: '12:00', pos: { long: 'lunch2', trang: 'lunch3', thu: 'lunch4', nhi: 'lunch5' }, scene: [
        ['nhi', 'Ủa, sao sáng nay Bốn Phương Global gọi tổng đài hỏi số chị Mai vậy? Đến tay mình luôn.'],
        ['long', 'Bốn Phương? Lần thứ ba rồi. Mai mà đi thì tao phải dịch chị Hân cho khách. Khách sẽ bỏ chạy.'],
        ['thu', 'Không phải việc của mình, nhưng mà… bạn biết gì không?'],
        { c: 'ep_mai_secret', o: [
          { t: '"Mình không biết gì cả."', fx: { rel: { mai: 2, thu: -1 } }, then: [['thu', 'Bạn nói dối dở ghê. Nhưng mình tôn trọng.']] },
          { t: '"Chị Mai đang suy nghĩ. Để chị ấy tự nói."', fx: { uy: 1, rel: { mai: 1, long: 1 } }, then: [['long', 'Câu trả lời của người lớn. Tao ghét nhưng tao công nhận.']] },
          { t: 'Kể hết.', fx: { dr: 4, rel: { mai: -3, thu: 1 }, set: { mai_leak: true } }, then: [
            ['nar', 'Ba phút sau, Nhi đã biết. Năm phút sau, chị Tuyết đã biết. Bảy phút sau, Mèo KPI rời khỏi ghế, như thể nó cũng biết.'],
          ] },
        ] },
      ] },
      { who: 'mai', obj: 'Chị Mai hỏi lời khuyên', time: '14:30', scene: [
        { if: F('mai_leak'), then: [['mai', 'Cả công ty biết rồi. Chị không giận em. Chỉ là giờ chị phải quyết nhanh hơn.']] },
        { if: F('mai_compare'), then: [['mai', 'Ba điều em chọn… đúng. Không có "view sông". Chị buồn cười vì em hiểu chị hơn chị.']] },
        ['mai', 'Vậy em khuyên chị gì?'],
        { c: 'ep_mai_advice', o: [
          { t: '"Chị mang ba điều đó vào gặp chị Tuyết. T&M cho được thì chị ở."', fx: { rel: { mai: 2 }, set: { mai_negotiate: true } }, then: [
            ['mai', 'Đàm phán với chị Tuyết. Đáng sợ hơn phỏng vấn ở Bốn Phương. Nhưng ok.'],
          ] },
          { t: '"Chị đi đi. Chị hỏi khách cần gì cả đời rồi, giờ hỏi chính mình."', fx: { rel: { mai: 2 }, set: { mai_go: true } }, then: [
            ['mai', 'Câu này chị sẽ nhớ lâu. Có thể sẽ in lên cốc.'],
          ] },
          { t: '"Em không biết. Nhưng em sẽ ổn dù chị chọn gì."', fx: { rel: { mai: 1 } }, then: [
            ['mai', 'Câu trả lời hay nhất hôm nay. Vậy chị chọn theo ba điều kia.'],
            { if: F('mai_compare'), then: [{ fx: { set: { mai_negotiate: true } } }], else: [{ fx: { set: { mai_go: true } } }] },
          ] },
        ] },
      ] },
      { who: 'tuyet', obj: 'Chị Tuyết gọi bạn vào', time: '16:00', scene: [
        { if: F('mai_negotiate'), then: [
          ['tuyet', 'Mai vừa vào gặp chị. Ba điều kiện. Chị đồng ý cả ba. Chị không định để Bốn Phương mời ai đi lần thứ ba.'],
          { if: F('mai_compare'), then: [
            ['tuyet', 'Nó nói em giúp nó nghĩ. Em ngồi đó, nói ít, hỏi đúng. Chị nhớ rồi.'],
            { fx: { uy: 2, set: { mai_vouch: true } } },
          ] },
          { fx: { uy: 1, rel: { tuyet: 1, mai: 1 }, set: { mai_stays: true } } },
        ], else: [
          ['tuyet', 'Mai nghỉ. Nó báo trước bốn mươi lăm ngày, đúng luật, bàn giao đàng hoàng. Bốn Phương mời ba lần, chị chỉ giữ được hai.'],
          ['tuyet', 'Nó giới thiệu em tiếp quản liên lạc với Êm Ru. Nó nói: "Em ấy biết hỏi khách cần gì." Em làm được không?'],
        ] },
        { c: 'ep_mai_end', o: [
          { t: '"Dạ được ạ."', when: NOT('mai_negotiate'), fx: { uy: 3, rel: { tuyet: 1 }, set: { mai_left: true, mai_handover: true, mai_vouch: true } }, then: [
            ['tuyet', 'Tốt. Đừng hứa với khách điều em không làm được. Mai chưa từng làm vậy.'],
          ] },
          { t: '"Em mới vào, em sợ làm hỏng ạ."', when: NOT('mai_negotiate'), fx: { rel: { tuyet: -1 }, set: { mai_left: true } }, then: [
            ['tuyet', 'Ai cũng sợ. Mai cũng từng sợ. Thôi, chị giao An.'],
          ] },
          { t: '"Em xin tuần này ngồi cạnh chị Mai để học ạ."', fx: { nl: -3, rel: { mai: 1 } }, then: [
            { if: NOT('mai_negotiate'), then: [
              ['tuyet', 'Học bàn giao trước khi nhận bàn giao. Được. Êm Ru là của em.'],
              { fx: { uy: 2, set: { mai_left: true, mai_handover: true, mai_vouch: true } } },
            ], else: [
              ['tuyet', 'Ngồi cạnh Mai thì học được nhiều hơn ngồi cạnh chị. Đừng nói với ai chị nói câu này.'],
            ] },
          ] },
        ] },
      ] },
    ],
    diary: (r) => (r.flags.mai_stays ? 'Ngày 24. Chị Mai ở lại, với ba điều kiện chị ấy thật sự cần. Chị Tuyết đồng ý cả ba.'
      : r.flags.mai_handover ? 'Ngày 24. Chị Mai sẽ đi. Chị giới thiệu mình tiếp quản Êm Ru. "Em ấy biết hỏi khách cần gì."'
        : 'Ngày 24. Chị Mai sẽ đi Bốn Phương. Công ty vẫn chạy, nhưng chậm hơn một nhịp.'),
  },

  // 12 · Trang học nói không — reads trang_no (Day 1)
  {
    id: 'trang_says_no', day: 26, title: 'Trang học nói không',
    intro: 'Thứ Sáu. Trang đến công ty với khẩu trang, giọng khàn, và một tờ giấy ghi "VIỆC ĐÃ NHẬN (trang 6)".\n\n"Mình hơi sốt thôi. Mình làm kịp mà."',
    steps: [
      { who: 'trang', obj: 'Trang có vẻ không ổn', time: '08:30', scene: [
        ['trang', 'Bạn ơi… mình ổn. 38 độ 5 thôi. Mình làm nốt phần của chị Hạ, anh Long, chị Hân, anh Khang… với đặt phòng họp.'],
        ['nar', 'Tờ giấy có mười một dòng. Dòng cuối ghi "ngủ (nếu kịp)".'],
        { c: 'ep_trang_home', o: [
          { t: '"Bạn về nhà ngay. Mình lo phần còn lại."', fx: { nl: -3, rel: { trang: 2 } }, then: [
            ['trang', 'Nhưng… ừ. Mình về. Bạn đừng làm hết nhé. Hứa đi.'],
          ] },
          { t: 'Pha cho Trang cốc nước gừng trước.', fx: { nl: -2, rel: { trang: 2 } }, then: [
            ['trang', 'Ấm quá… Bạn biết không, chưa ai pha nước cho mình ở đây.'],
            ['nar', 'Mười phút sau Trang gục xuống bàn phím. Màn hình đầy chữ "jjjjjjj". Bạn gọi xe đưa Trang về.'],
          ] },
          { t: 'Báo chị Hạ trước.', fx: { uy: 1, rel: { ha: 1 } }, then: [
            ['nar', 'Chị Hạ chạy sang, sờ trán Trang, rồi đích thân gọi xe. Trang về nhà lúc 08:52.'],
          ] },
        ] },
      ] },
      { who: 'ha', obj: 'Chị Hạ muốn biết Trang đang ôm bao nhiêu việc', time: '09:15', scene: [
        ['ha', 'Trang ôm… mười một việc? Chị chỉ giao ba.'],
        ['ha', 'Ba việc của chị, tám việc của… những người khác. Chị nghĩ mình cần một nghiên cứu về văn hóa nhận việc.'],
        ['think', 'Không. Mình cần một cái bảng.'],
        { c: 'ep_trang_ha', o: [
          { t: '"Chị cho em dùng bảng trắng để chia lại việc nhé."', fx: { uy: 1, rel: { ha: 1 } }, then: [['ha', 'Bảng trắng. Trực quan. Có cơ sở lý thuyết. Chị đồng ý.']] },
          { t: '"Chị nói với cả team: việc của ai người nấy nhận lại ạ."', fx: { rel: { ha: 2 }, set: { ha_speaks: true } }, then: [
            ['ha', 'Chị sẽ nói. Ngắn thôi. Không có phần phương pháp.'],
          ] },
        ] },
      ] },
      { who: 'obj:okr', obj: 'Chia lại 11 việc của Trang trên bảng trắng', time: '10:00', scene: [
        ['nar', 'Bạn xóa bảng, viết "VIỆC CỦA TRANG (THẬT RA LÀ CỦA AI?)". Long đi ngang, đứng lại đọc, rồi lặng lẽ đi chậm hơn.'],
        { mini: TRANG_MINI,
          good: [['nar', 'Mười một việc, mười một cái tên. Tên Trang còn đúng ba lần, đúng như chị Hạ giao.'], { fx: { uy: 3, rel: { trang: 1, long: 1 }, set: { trang_board: true } } }],
          bad: [['nar', 'Bạn giao việc đổi font cho chị Gấm. Chị Gấm nhận. Bằng bút chì.'], { fx: { dr: 1 } }],
        },
        { if: F('ha_speaks'), then: [['ha', '(nói to) Cả nhà ơi, việc ai nấy nhận. Hết. Chị nói ngắn chưa?'], ['long', 'Ngắn nhất lịch sử, chị.']] },
      ] },
      { who: 'khang', obj: 'Khang thấy tên mình trên bảng', time: '11:30', scene: [
        { if: F('trang_board'), then: [['khang', 'Ai ghi tên anh vào cột "Đổi font 40 slide"? Actually, overseas có người làm design riêng.']],
          else: [['khang', 'Trang nghỉ à? Vậy ai đổi font cho anh?']] },
        ['long', '(nói to) Anh Khang, overseas người ta tự đổi font. Em xem YouTube rồi.'],
        { if: tie('khang_han'), then: [['khang', 'Để anh nói chị Hân.'], ['think', '"Chị". Lần này Khang nhớ.']] },
        { c: 'ep_trang_khang', o: [
          { t: 'Gửi Khang cách thay font cả file trong 30 giây.', fx: { uy: 2, rel: { khang: 1 } }, then: [
            ['khang', '…Có cách đó hả? Ok. Overseas chắc cũng dùng cái này.'],
          ] },
          { t: '"Anh tự làm nhé. Trang đang sốt."', fx: { dr: 1, rel: { khang: -2, long: 2 } }, then: [
            ['khang', 'Ok… fine. Anh làm. Nhưng anh ghi nhận là văn hóa ở đây hơi thiếu support.'],
          ] },
          { t: 'Tự đổi font giúp Khang luôn.', fx: { nl: -6, rel: { khang: 2 }, set: { became_trang: true } }, then: [
            ['long', 'Mày vừa thành Trang phiên bản 2. Tao không chúc mừng.'],
          ] },
        ] },
      ] },
      { who: 'call:trang', obj: 'Trang gọi từ nhà (nghe máy)', time: '15:00',
        call: { title: 'Trang (ở nhà) · "Mình sắp nói dạ…"', people: ['trang', 'ha', 'me'] }, scene: [
        ['trang', 'Bạn ơi, mình ở nhà rồi. Chị Hân vừa gọi nhờ mình làm "nhanh một slide". Mình… sắp nói "dạ".'],
        { if: F('trang_no'), then: [['trang', 'Nhưng mình nhớ hôm đầu bạn dạy mình. Mình tập rồi. Bạn nghe mình nói thử nhé?']],
          else: [['trang', 'Mình chưa bao giờ nói "không" với ai. Mình không biết bắt đầu từ đâu.']] },
        { c: 'ep_trang_say', o: [
          { t: '"Nói: \'Em đang ốm. Thứ Hai em làm được không ạ?\'"', fx: { uy: 1, rel: { trang: 3 }, set: { trang_said_no: true } }, then: [
            ['nar', 'Trang tắt mic. Ba mươi giây sau bật lại. "Mình nói rồi. Chị Hân nói: \'Ok em, get well soon\'. Thế thôi á?"'],
          ] },
          { t: '"Để mình làm slide đó thay."', fx: { nl: -8, rel: { trang: 1 }, set: { became_trang: true } }, then: [
            ['trang', 'Thật hả? … Lại là bạn. Mình nợ bạn nhiều quá.'],
          ] },
          { t: '"Ngủ đi. Tắt điện thoại."', fx: { rel: { trang: 2 }, set: { trang_said_no: true } }, then: [
            ['nar', 'Trang tắt máy. Lần đầu tiên trong hai năm, máy Trang tắt trước 22 giờ.'],
          ] },
        ] },
        { if: F('trang_said_no'), then: [
          ['ha', 'Trang vừa nói "không" với chị Hân?'],
          ['nar', 'Trong văn phòng, Long đứng dậy vỗ tay. Rồi An. Rồi chị Hạ. Chị Gấm vỗ tay chậm hơn mọi người ba giây.'],
          { fx: { dr: -2, rel: { trang: 1 } } },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 26. Trang sốt vì ôm mười một việc. ${r.flags.trang_said_no ? 'Chiều nay Trang nói "không" lần đầu tiên. Cả phòng vỗ tay.' : 'Mình nhận thay slide của Trang. Long nói mình là Trang phiên bản 2.'}`,
  },

  // 13 · Máy in và ngày nộp hồ sơ + Bình và Quỳnh ✱ binh_quynh
  {
    id: 'tender_day', day: 30, title: 'Máy in và ngày nộp hồ sơ',
    intro: 'Thứ Ba. Hạn nộp hồ sơ thầu tư vấn cho Tổng công ty Bao Bì Thuận Buồm: 11:00, ba bộ bản gốc, đóng dấu giáp lai.\n\nMáy in của T&M biết điều đó. Máy in đã chuẩn bị tinh thần.',
    steps: [
      { who: 'nhi', obj: 'Nhi giao việc in hồ sơ thầu', time: '08:30', scene: [
        ['nhi', 'Ủa, sao hồ sơ thầu cũng đến tay mình vậy? Ba bộ, mỗi bộ 140 trang. Shipper đến lấy lúc 10:30.'],
        ['nhi', 'Bạn in giúp mình nhé. Mình gọi Thuận Buồm xác nhận địa chỉ. Số tổng đài của họ mình thuộc rồi.'],
        { c: 'ep_tender_plan', o: [
          { t: 'In ngay cả ba bộ.', fx: { nl: -2 }, then: [['nhi', 'Nhanh là tốt. Máy in thì… không đồng ý.']] },
          { t: 'In thử một bộ trước để kiểm tra.', fx: { uy: 1 }, then: [['nhi', 'Người cẩn thận. Hiếm.']] },
          { t: 'Hỏi file nào là bản FINAL thật.', fx: { uy: 1, rel: { nhi: 1 } }, then: [
            ['nhi', '"HoSoThau_FINAL_nop.pdf". Có chữ "nop". Ở T&M, chữ "nop" đáng tin hơn chữ "FINAL".'],
          ] },
        ] },
      ] },
      { who: 'obj:printer', obj: 'Ra máy in: "E-47"', time: '09:00', scene: [
        ['nar', 'Máy in kéo vào trang 37 rồi dừng. Màn hình: "E-47: KẸT GIẤY". Đèn đỏ nhấp nháy như đang cười.'],
        ['nar', 'Tờ giấy dán trên máy: "Kẹt giấy thì đừng giật. Hỏi IT".'],
        { c: 'ep_tender_jam', o: [
          { t: 'Mở nắp, gỡ giấy nhẹ nhàng theo chiều kéo.', fx: { uy: 1, nl: -3 }, then: [
            ['nar', 'Tờ giấy ra nguyên vẹn. Máy in kéo thêm hai trang rồi lại kẹt. Nó không hỏng. Nó có tâm trạng.'],
          ] },
          { t: 'Giật mạnh.', fx: { dr: 2 }, then: [
            ['nar', 'Tờ giấy rách làm đôi. Nửa còn lại nằm sâu trong máy, như một bí mật.'],
          ] },
          { t: 'Restart máy in.', fx: { rel: { binh: 1 } }, then: [
            ['nar', 'Máy in khởi động lại trong bốn phút, in tiếp trang 37, và kẹt ở trang 38.'],
          ] },
        ] },
      ] },
      { who: 'binh', obj: 'Tìm anh Bình ở góc IT', time: '09:20', scene: [
        ['binh', 'Máy in hả? Em restart thử chưa?'],
        ['binh', 'Chờ anh năm phút. Anh vừa sửa máy chị Quỳnh. Máy chị Quỳnh là ưu tiên số một.'],
        { if: tie('binh_quynh'), then: [['nar', 'Anh Bình nói "chị Quỳnh" bằng một giọng hơi khác so với khi nói tên những người khác.']] },
        ['binh', 'Mà máy in này hỏng thật rồi. Linh kiện phải đặt, ba ngày.'],
        { c: 'ep_tender_binh', o: [
          { t: '"Công ty có máy in dự phòng không anh?"', fx: { uy: 1 }, then: [
            ['binh', 'Có. Ở kho. Chỗ nào trong kho thì… chỉ có Bảo biết.'],
          ] },
          { t: 'Chạy ra tiệm photo đầu ngõ.', fx: { dr: 1, clock: 20 }, then: [
            ['nar', 'Tiệm photo đóng cửa. Biển ghi: "Nghỉ đám cưới con gái. Mừng giùm." Bạn quay về.'],
            ['binh', 'Thôi, hỏi Bảo. Máy in dự phòng ở kho, chỉ Bảo biết chỗ.'],
          ] },
        ] },
      ] },
      { who: 'bao', obj: 'Hỏi anh Bảo chỗ cất máy in dự phòng', time: '09:40', when: NOT('bao_left'), scene: [
        ['bao', 'Máy in dự phòng? Kho, kệ thứ ba, sau thùng "Quà Tết 2023 (đừng mở)". Mật khẩu 1234. Hồi tao mới vào ba năm trước, chính tao giấu nó.'],
        { if: F('bao_official'), then: [['bao', 'Giờ tao là nhân viên chính thức rồi, nên tao đi lấy cùng mày. Trách nhiệm.']] },
        { c: 'ep_tender_spare', o: [
          { t: 'Đi cùng anh Bảo khiêng máy.', fx: { nl: -4, rel: { bao: 2 } }, then: [['nar', 'Máy in dự phòng nặng như một deck 200 slide. Nó in ngay lần đầu.']] },
          { t: 'Nhờ anh Bảo lấy giúp, mình chuẩn bị giấy.', fx: { uy: 1, rel: { bao: 1 } }, then: [['bao', 'Phân công hợp lý. Tao bắt đầu thấy mình là quản lý thật.']] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'Mở sổ tay anh Bảo để lại', time: '09:40', when: F('bao_left'), scene: [
        ['nar', 'Anh Bảo đang đi phỏng vấn chỗ mới. Bạn mở cuốn sổ tay anh để lại. Trang 12: "Máy in dự phòng: kho, kệ 3, sau thùng Quà Tết 2023 (đừng mở). MK 1234."'],
        ['nar', 'Bên dưới, chữ nhỏ hơn: "Nếu mày đọc được dòng này, tức là máy in chính lại hỏng. Tao đoán đúng không?"'],
        { c: 'ep_tender_note', o: [
          { t: 'Nhắn cảm ơn anh Bảo.', fx: { rel: { bao: 2 } }, then: [
            { chat: [['bao', 'Biết ngay. Nhớ đừng mở thùng Tết 2023.', true]] },
          ] },
          { t: 'Mở thùng "Quà Tết 2023" xem có gì.', fx: { dr: 2, nl: 5 }, then: [
            ['nar', 'Bên trong: bốn hộp bánh hết hạn và một phong bì ghi "Thưởng Tết intern (chưa phát)". Bạn đóng thùng lại rất nhanh.'],
          ] },
        ] },
      ] },
      { who: 'gam', obj: 'Chị Gấm đóng dấu giáp lai', time: '10:30', scene: [
        ['gam', 'Đóng dấu giáp lai hả em? Ba bộ… để chị xem một tí đã nhé.'],
        ['nar', 'Chị Gấm lấy con dấu khỏi két, lau bằng khăn mùi soa, hà hơi, rồi đóng. Một trang. Rất đẹp. Còn 419 trang.'],
        { if: F('covered_gam'), then: [['gam', 'Hôm trước em đỡ cho chị vụ phòng họp. Hôm nay chị đóng nhanh. Nhanh theo kiểu của chị.'], { fx: { clock: -10 } }] },
        { c: 'ep_tender_stamp', o: [
          { t: 'Giữ giấy, lật trang cho chị Gấm như dây chuyền.', fx: { nl: -5, rel: { gam: 2 }, set: { tender_ok: true } }, then: [
            ['gam', 'Em lật nhanh ghê. Chị đóng theo nhịp em. Như hát karaoke.'],
          ] },
          { t: 'Giục chị Gấm nhanh lên.', fx: { dr: 3, rel: { gam: -2 }, set: { tender_ok: true } }, then: [
            ['gam', 'Chị nhanh rồi mà em…'],
            ['nar', 'Dấu thứ 200 bị nghiêng. Không ai dám nói.'],
          ] },
          { t: 'Hỏi chị Gấm có thể ủy quyền cho người khác đóng không.', fx: { uy: 1, rel: { gam: -1 }, set: { tender_ok: true } }, then: [
            ['gam', 'Con dấu là của chị. Mười năm. Không ai đóng thay chị.'],
            ['nar', 'Nhưng chị đóng nhanh hơn hẳn. Có lẽ vì tự ái.'],
          ] },
        ] },
        ['nar', '10:52, ba bộ hồ sơ vào phong bì. Shipper nhận lúc 10:54. Nhi gọi Thuận Buồm xác nhận lúc 10:58.'],
      ] },
      { who: 'binh', obj: 'Giờ trưa: pantry vắng, chỉ có hai người…', time: '12:30', pos: { binh: 'lunch1', quynh: 'lunch2' }, scene: [
        { if: tie('binh_quynh'), then: [
          ['nar', 'Pantry vắng. Anh Bình và chị Quỳnh ngồi đối diện, chung một hộp cơm. Anh Bình đang gỡ xương cá cho chị Quỳnh.'],
          ['quynh', '…Em! Em vào lúc nào?'],
          ['binh', 'Anh đang… sửa hộp cơm cho chị Quỳnh. Nó bị… lỗi.'],
          ['quynh', 'Bọn chị chưa công khai. Chị Phương mà biết là cả công ty biết trong mười phút, kèm emoji trái tim.'],
        ], else: [
          ['nar', 'Pantry vắng. Anh Bình và chị Quỳnh ngồi đối diện, ở giữa là tờ hóa đơn mực in.'],
          ['quynh', 'Ba hộp mực trong một tháng? Em in cái gì vậy Bình?'],
          ['binh', 'Không phải em. Là anh Khang. "Overseas report", in màu, hai trăm trang.'],
          ['quynh', '…Em đừng kể với ai là chị vừa thở dài nhé.'],
        ] },
        { c: 'ep_bq_lunch', o: [
          { t: '"Em không thấy gì ạ. Em chỉ vào lấy nước."', fx: { rel: { quynh: 2, binh: 2 } }, then: [['binh', 'Em restart trí nhớ thử chưa? … Tốt.']] },
          { t: 'Ngồi xuống ăn cùng.', fx: { nl: 15, rel: { binh: 1, quynh: 1 } }, then: [
            { if: tie('binh_quynh'), then: [['nar', 'Bữa trưa ngượng ngùng nhất đời bạn. Nhưng cá ngon.']],
              else: [['nar', 'Ba người cùng chửi máy in. Bonding thật sự, không cần thứ Bảy.']] },
          ] },
          { t: '"Anh chị đẹp đôi ghê!"', fx: { dr: 2, rel: { binh: 1, quynh: -1 } }, then: [
            { if: tie('binh_quynh'), then: [['nar', 'Chị Quỳnh đỏ mặt tới tận mắt kính. Anh Bình làm rơi đũa.']],
              else: [['quynh', 'Đẹp đôi cái gì. Ba hộp mực!']] },
          ] },
        ] },
      ] },
      { who: 'phuong', obj: 'Chị Phương đang làm "khảo sát kết nối"', time: '15:00', scene: [
        ['phuong', '{ten} ơi! Chị đang vẽ "Bản đồ kết nối T&M" 💖 Em thấy ai trong công ty… thân với ai nhất?'],
        ['phuong', 'Ví dụ thôi nha: anh Bình với chị Quỳnh hay ăn trưa chung đúng không? Chị hỏi để… bonding.'],
        { c: 'ep_bq_phuong', o: [
          { t: '"Em toàn ăn với nhóm chị Mai, không để ý ạ."', fx: { rel: { quynh: 1, binh: 1 }, set: { kept_secret: true, quynh_fast: true } }, then: [
            { if: tie('binh_quynh'), then: [{ chat: [['quynh', 'Cảm ơn em. Phiếu tạm ứng của em chị duyệt rồi. Hôm nay. Không cần bản gốc.', true]] }],
              else: [{ chat: [['quynh', 'Cảm ơn em không kể vụ ba hộp mực. Phiếu tạm ứng của em chị duyệt luôn rồi nhé.', true]] }] },
          ] },
          { t: '"Chị hỏi thẳng anh chị ấy đi ạ."', fx: { uy: 1, rel: { phuong: -1 }, set: { kept_secret: true } }, then: [
            ['phuong', 'Hỏi thẳng thì mất vui!'],
          ] },
          { t: 'Kể những gì mình thấy.', fx: { dr: 4, rel: { phuong: 2, quynh: -3, binh: -2 }, set: { spilled_bq: true } }, then: [
            { if: tie('binh_quynh'), then: [['nar', 'Mười phút sau, group "T&M Family 💖" có sticker hai chú chim cánh cụt ôm nhau. Chị Quỳnh không ngẩng lên khỏi Excel cả chiều.']],
              else: [['nar', 'Mười phút sau, cả công ty biết anh Khang in màu hai trăm trang. Anh Khang đổi ảnh đại diện thành ảnh Singapore.']] },
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 30. Hồ sơ thầu Thuận Buồm nộp lúc 10:54. ${r.flags.bao_left ? 'Sổ tay anh Bảo cứu mình.' : 'Anh Bảo cứu mình bằng một cái máy in giấu sau thùng Tết.'} ${r.flags.tie_binh_quynh ? (r.flags.kept_secret ? 'Anh Bình và chị Quỳnh đang hẹn hò. Mình giữ bí mật.' : 'Bí mật của anh Bình và chị Quỳnh giờ là sticker chim cánh cụt.') : ''}`,
  },

  // 14 · Khảo sát 360° (own episode) ✱ phuong_friend
  {
    id: 'survey_360', minDay: 31, maxDay: 38, title: 'Khảo sát 360° "ẩn danh"',
    intro: 'Email từ chị Phương lúc 8 giờ sáng: "Khảo sát 360° ẨN DANH 💖 · Bắt buộc · Hạn 17:00 hôm nay".\n\nChị Hân sẽ dùng kết quả cho chương trình "T&M 2030: Transformation Journey". Chữ "ẩn danh" được viết hoa. Điều đó làm bạn lo.',
    steps: [
      { who: 'phuong', obj: 'Chị Phương giới thiệu khảo sát', time: '08:30', scene: [
        ['phuong', 'Khảo sát 360 độ nha em! Hoàn toàn ẩn danh. Em cứ thật lòng. Văn hóa mình là văn hóa phản hồi.'],
        ['phuong', 'À, nhớ ghi họ tên và phòng ban ở câu 1 để chị… thống kê.'],
        ['think', 'Ẩn danh. Nhưng ghi họ tên.'],
        { c: 'ep_360_start', o: [
          { t: '"Chị ơi, ghi tên thì không còn ẩn danh ạ."', fx: { uy: 1, rel: { phuong: -1 } }, then: [
            ['phuong', 'Ơ… thì ẩn danh với người được đánh giá! Chỉ chị biết thôi. Và chị Hân. Và chị Tuyết.'],
          ] },
          { t: '"Dạ em làm ngay ạ."', fx: { rel: { phuong: 1 } }, then: [['phuong', 'Ngoan quá! Em là người thứ ba nộp. Hai người kia là chị và anh Đạt.']] },
          { t: 'Hỏi khảo sát này để làm gì.', fx: { rel: { phuong: 1 } }, then: [
            ['phuong', 'Chị Hân cần "data-driven culture insight" cho T&M 2030. Chị cũng không chắc nghĩa là gì, nhưng nghe rất data.'],
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'Làm khảo sát 360°', time: '10:00', scene: [
        ['nar', 'Câu 7: "Chị Tuyết truyền đạt kỳ vọng rõ ràng (1–5)". Câu 8: "Chị Tuyết chỉ có một vài ý nhỏ (1–5)".'],
        ['nar', 'Câu 14: "Bạn có sẵn sàng tham gia team building thứ Bảy? (Có / Rất có)".'],
        { c: 'ep_360_answer', o: [
          { t: 'Trả lời thật lòng, kèm ví dụ cụ thể.', fx: { uy: 1, dr: 2, set: { survey_honest: true } }, then: [
            ['think', 'Câu 8: 2/5. Ví dụ: "27 ý nhỏ, hai lần". Gửi.'],
          ] },
          { t: 'Chấm 5 điểm tất cả.', fx: { dr: -1, rel: { phuong: 1 } }, then: [['think', 'An toàn. Vô nghĩa. Nhưng an toàn.']] },
          { t: 'Viết vào ô "Khác": "Đề nghị thêm đáp án Không cho câu 14".', fx: { uy: 1, dr: 1, rel: { long: 1 } }, then: [
            ['nar', 'Ô "Khác" giới hạn 50 ký tự. Câu của bạn bị cắt thành "Đề nghị thêm đáp án Không cho c".'],
          ] },
        ] },
      ] },
      { who: 'long', obj: 'Long phát hiện điều gì đó', time: '11:30', scene: [
        ['long', 'Ê. Mày nhìn đuôi link khảo sát chưa? Có "?user=" kèm tên mày. Ẩn danh kiểu T&M.'],
        { if: F('survey_honest'), then: [['think', 'Mình vừa chấm chị Tuyết 2/5 ở câu 8. Kèm ví dụ. Có tên.']] },
        { c: 'ep_360_link', o: [
          { t: 'Báo riêng chị Phương để sửa.', fx: { uy: 2, rel: { phuong: 1 }, set: { survey_fixed: true } }, then: [
            ['phuong', 'Ôi chị không biết thật! Chị copy link từ mẫu năm 2016… Chị sửa ngay. Cảm ơn em đã nói riêng.'],
          ] },
          { t: 'Đăng lên group chung.', fx: { dr: 5, rel: { long: 2, phuong: -3 }, set: { survey_public: true } }, then: [
            ['nar', 'Bốn mươi giây sau, mười chín người cùng nộp lại khảo sát. Ai cũng chấm 5 điểm tất cả.'],
          ] },
          { t: 'Im lặng, sửa lại câu trả lời của mình.', fx: { rel: { long: -1 } }, then: [
            { if: F('survey_honest'), then: [['nar', 'Bạn đổi 2/5 thành 4/5. Rồi 3/5. Rồi 4/5. Dân chủ là mệt.']], else: [['long', 'Mày chấm 5 hết rồi thì sửa gì nữa. Đi ăn đi.']] },
          ] },
        ] },
      ] },
      { who: 'han', obj: 'Chị Hân trình bày "insight sơ bộ"', time: '14:00', scene: [
        ['han', 'Team! Mình có insight sơ bộ rồi nè. 87% muốn thêm team building. Đây là data!'],
        ['khang', 'Actually, overseas người ta gọi đây là "engagement signal".'],
        ['think', 'Câu 14 chỉ có hai đáp án: "Có" và "Rất có".'],
        { c: 'ep_360_data', o: [
          { t: '"Câu 14 không có đáp án Không, nên 87% là… 13% bỏ trống ạ."', fx: { uy: 3, rel: { han: -2, khang: -1 }, set: { data_called: true } }, then: [
            ['han', '…Thì 13% đó mình sẽ engage thêm.'],
            ['long', '(thì thầm) Từ điển, mục D: "data" = "cái chị đã tin từ trước".'],
          ] },
          { t: 'Gật đầu.', fx: { dr: 1, rel: { han: 1 } }, then: [['han', 'Thấy chưa, ai cũng đồng ý!']] },
          { t: '"Mình đọc thêm các câu trả lời mở được không ạ?"', fx: { uy: 1, nl: -5, set: { read_open: true } }, then: [
            ['han', 'Câu trả lời mở thì… ai đọc? Bốn trăm câu.'],
            ['think', 'Mình.'],
          ] },
        ] },
      ] },
      { who: 'phuong', obj: 'Chị Phương muốn nói chuyện riêng', time: '16:00', scene: [
        ['phuong', 'Em có năm phút không? Chị đọc mấy câu trả lời mở rồi.'],
        ['phuong', 'Có người viết: "Team building thứ Bảy làm tôi không gặp được con." Chị đọc ba lần.'],
        { if: F('tb_saturday'), then: [['think', 'Thứ Bảy hôm đó mình cũng ở đó, cầm dây cáp sạc kéo co.']] },
        ['phuong', 'Chị làm team building mỗi tuần vì chị sợ. Năm ngoái công ty hai mươi người mà nghỉ chín. Chị nghĩ thân nhau thì sẽ ở lại.'],
        { if: tie('phuong_friend'), then: [['phuong', 'Với lại cô Tuyết tin chị. Mẹ chị dặn "con đừng làm cô buồn". Nên chị làm nhiều hơn mức cần.']] },
        { c: 'ep_360_culture', o: [
          { t: '"Người ta ở lại vì được về đúng giờ, chị ạ. Thử một tháng không có thứ Bảy?"', fx: { uy: 2, rel: { phuong: 2 }, set: { culture_fix: true } }, then: [
            ['phuong', 'Một tháng không thứ Bảy… Chị sẽ gọi nó là "Bonding qua nghỉ ngơi". Có emoji cái giường.'],
          ] },
          { t: '"Chị làm tốt mà, chỉ cần ít hơn một chút."', fx: { rel: { phuong: 3 } }, then: [['phuong', 'Ít hơn một chút. Chị ghi lại. Bằng bút đỏ, cho nhớ.']] },
          { t: '"Em cũng không biết ạ."', fx: { nl: -2, rel: { phuong: 1 } }, then: [['phuong', 'Ừ. Không ai biết. Thế mới khó.']] },
        ] },
      ] },
    ],
    diary: (r) => `Một ngày khảo sát 360° "ẩn danh". ${r.flags.survey_fixed ? 'Mình báo riêng chị Phương sửa link.' : r.flags.survey_public ? 'Mình đăng vụ link lên group. Mười chín người chấm 5 điểm tất cả.' : 'Link khảo sát có tên mình. Mình im lặng.'} Chị Phương làm team building vì sợ mọi người nghỉ.`,
  },

  // 15 · Đánh giá cuối kỳ — the client returns; Tuyết sums up the six weeks
  {
    id: 'final_review', day: 40, title: 'Đánh giá cuối kỳ',
    intro: 'Thứ Sáu tuần thứ sáu. Đợt thực tập của bạn sắp hết.\n\nSáng nay Êm Ru đến nghe bản trình bày cuối. Chiều nay chị Tuyết có lịch "Đánh giá cuối kỳ". Lịch ghi: "15 phút (ý nhỏ)".',
    steps: [
      { who: 'mai', obj: 'Chuẩn bị trình bày cuối với chị Mai', time: '08:30', scene: [
        ['mai', 'Hôm nay Êm Ru nghe bản cuối. Khách cũ, câu hỏi cũ: "Vậy chúng tôi làm gì trước?"'],
        { if: F('mai_handover'), then: [['mai', 'Chị bàn giao rồi. Hôm nay em nói, chị ngồi cuối phòng. Chị chỉ ho khi em nói sai.']],
          else: [['mai', 'Chị nói phần đầu. Phần "làm gì trước" em nói. Em theo dự án này từ ngày khách đến sớm 47 phút mà.']] },
        { c: 'ep_final_prep', o: [
          { t: 'Tập lại câu trả lời ba lần với chị Mai.', fx: { nl: -5, rel: { mai: 1 } }, then: [['mai', 'Lần ba tốt nhất. Đừng tập lần bốn, sẽ nghe như đọc.']] },
          { t: 'Hỏi chị Hân có định đổi ý gì sáng nay không.', fx: { uy: 1, rel: { han: -1 } }, then: [
            { chat: [['han', 'Chị nghĩ nên thêm một slide "big pitcher 2.0" ✨', true]] },
            ['think', 'Đã đoán trước. Không thêm.'],
          ] },
          { t: 'Đi ăn sáng tử tế trước đã.', fx: { nl: 12, money: -30_000 }, then: [['nar', 'Bánh cuốn. Trình bày cuối không nên làm khi đói.']] },
        ] },
      ] },
      { who: 'obj:interview', obj: 'Vào phòng họp: trình bày cuối với Êm Ru', time: '10:00', seat: 'mr_seat', pos: { tuyet: 'mr_head', han: 'mr_n1', mai: 'mr_n2' }, scene: [
        { if: F('client_tea'), then: [['nar', 'Ba vị khách Êm Ru, lần này đúng giờ. Vị lớn tuổi nhất nhìn bạn, gật đầu như nhận ra người pha "trà tư vấn".']],
          else: [['nar', 'Ba vị khách Êm Ru, lần này đúng giờ. Phòng họp không bị đặt trùng. Tiến bộ.']] },
        ['tuyet', 'Mời em.'],
        ['nar', 'Vị khách lớn tuổi hỏi: "Sáu tuần, hai trăm trang, bốn mươi slide. Vậy chúng tôi làm gì trước?"'],
        { c: 'ep_final_answer', o: [
          { t: '"Kênh online cho nhóm \'mua nệm cho bố mẹ\': chưa ai phục vụ họ, và số liệu ủng hộ ạ."', when: ANY('exec_summary', 'ovs_numbers'), fx: { uy: 5, rel: { tuyet: 2 }, set: { final_win: true } }, then: [
            ['nar', 'Vị khách đặt bút xuống. "Cái này tôi mang về họp được." Chị Tuyết không nói gì. Chị Tuyết không nói gì là chị Tuyết hài lòng.'],
          ] },
          { t: '"Chuyển đổi số toàn diện, với một north star metric ạ."', fx: { dr: 1, rel: { han: 2 } }, then: [
            ['nar', 'Vị khách gật đầu lịch sự: "Nghe hay. Nhưng làm gì trước?" Chị Hân vỗ tay một mình.'],
          ] },
          { t: '"Việc ra doanh thu sớm nhất, có người chịu trách nhiệm và con số theo dõi hằng tuần ạ."', fx: { uy: 3, rel: { tuyet: 1 } }, then: [
            ['nar', 'Vị khách ghi lại. "Hợp lý. Gửi tôi tên việc đó trong tuần sau." Chị Mai gật đầu với bạn từ cuối bàn.'],
          ] },
        ] },
      ] },
      { who: 'long', obj: 'Bữa trưa cuối tuần thứ sáu', time: '12:00', pos: LUNCH, scene: [
        ['long', 'Bữa trưa cuối tuần thứ sáu. Tao đề nghị mỗi người nói một câu về {ten}.'],
        { if: F('trang_said_no'), then: [['trang', 'Bạn dạy mình nói "không". Hôm qua mình nói "không" với chị Hân lần thứ ba. Chị ấy quen rồi.']],
          else: [['trang', 'Bạn ăn bánh không? Mình mua dư. Lần này mua dư vì mình muốn, không phải vì ai nhờ.']] },
        ['nhi', 'Mình thêm bạn vào file "Ai làm gì" mục cuối: "Ai hỏi khách thật sự cần gì: Mai, và {ten}".'],
        { if: F('bao_left'), then: [['bao', '(nói vọng từ bàn) Tuần sau tao đi rồi. Nhớ giữ sổ tay của tao.']],
          else: [['bao', '(nói vọng từ bàn) Tao nghe hết đó. Nhân viên chính thức có quyền nghe lén.']] },
        { c: 'ep_final_lunch', o: [
          { t: 'Cảm ơn từng người một.', fx: { rel: { long: 1, trang: 1, thu: 1, nhi: 1, mai: 1 } }, then: [['thu', 'Không phải việc của mình, nhưng mà… mình hơi khóc.']] },
          { t: '"Mình chỉ làm theo lời khuyên số một: đừng tin chữ FINAL."', fx: { dr: -1, rel: { long: 2 } }, then: [['long', 'Học trò giỏi nhất của tao. Và là duy nhất.']] },
        ] },
      ] },
      { who: 'tuyet', obj: '15:00 Đánh giá cuối kỳ với chị Tuyết', time: '15:00', scene: [
        ['tuyet', 'Ngồi đi. Chị nói ngắn. Chị đang tập nói ngắn.'],
        { if: (r) => r.status === 'official', then: [['tuyet', 'Em là nhân viên rồi, nên đây không phải đánh giá thực tập. Nhưng chị vẫn muốn nhìn lại sáu tuần.']] },
        { if: F('bao_signed'), then: [['tuyet', 'Em làm được việc ba năm không ai làm: một bộ hồ sơ cho Bảo.']] },
        { if: F('mai_stays'), then: [['tuyet', 'Mai ở lại. Chị biết em có phần trong đó.']] },
        { if: F('mai_handover'), then: [['tuyet', 'Mai đi, nhưng Êm Ru vẫn ở. Vì em.']] },
        { if: F('linh_win'), then: [['tuyet', 'Linh nói em biến "team mệt" thành một con số. Chị ghét con số đó. Nhưng chị duyệt.']] },
        { if: F('trang_said_no'), then: [['tuyet', 'Hân than dạo này Trang hay nói "không". Chị nghĩ đó là tin tốt.']] },
        { if: F('pushed_khang'), then: [['tuyet', 'Khang nói em "hơi local". Từ Khang, đó là lời khen.']] },
        ['tuyet', 'Chị chỉ có một vài ý nhỏ thôi. Ý một: em hỏi đúng câu. Ý hai: em hỏi hơi muộn. Ý ba: ngủ nhiều hơn.'],
        { c: 'ep_final_talk', o: [
          { t: '"Chị cho em góp một ý nhỏ cuối cùng được không ạ?"', fx: { uy: 2, rel: { tuyet: 1 }, set: { gave_idea: true } }, then: [
            ['tuyet', 'Nói.'],
            ['me', 'Chị nói ngắn như hôm nay, mọi người sẽ sợ chị ít hơn và làm nhanh hơn ạ.'],
            ['tuyet', '…Chị sẽ coi đó là một ý nhỏ. Một ý đúng.'],
          ] },
          { t: '"Em cảm ơn chị đã cho em ở đây sáu tuần ạ."', fx: { rel: { tuyet: 2 } }, then: [['tuyet', 'Sáu tuần ở T&M bằng sáu tháng ở chỗ khác. Chị không biết đó là khen hay chê.']] },
          { t: '"Sau này em có thể quay lại T&M không ạ?"', fx: { rel: { gam: 1, tuyet: 1 }, set: { want_back: true } }, then: [
            ['tuyet', 'Cửa không khóa. Nhưng Gấm giữ chìa. Em biết rồi đấy.'],
          ] },
        ] },
      ] },
      { who: 'obj:desk', obj: 'Quay về bàn', time: '17:15', scene: [
        ['nar', 'Trên bàn có một tờ giấy nhớ mới, nét bút chì: "Cảm ơn em. —G". Bên cạnh là thẻ từ có ảnh của… bạn. Cuối cùng.'],
        { if: F('gam_calendar'), then: [['nar', 'Trên màn hình, lịch phòng họp online hiện: "Đánh giá cuối kỳ — đặt bởi Gấm". Không trùng.']] },
        { c: 'ep_final_desk', o: [
          { t: 'Chụp ảnh tờ giấy nhớ.', fx: { nl: 5 }, then: [['think', 'Thẻ từ có ảnh mình. Sáu tuần. Đáng.']] },
          { t: 'Viết một tờ "Đừng tin chữ FINAL" để lại cho intern sau.', fx: { uy: 1, rel: { long: 1 }, set: { left_note: true } }, then: [
            ['long', '(đi ngang) Truyền thống được giữ gìn. Tao tự hào.'],
          ] },
        ] },
      ] },
    ],
    diary: (r) => `Ngày 40. ${r.flags.final_win ? 'Khách Êm Ru nói: "Cái này tôi mang về họp được." Chị Tuyết im lặng, tức là hài lòng.' : 'Bản trình bày cuối ổn. Khách hỏi "làm gì trước", mình trả lời được một nửa.'} Chị Gấm làm thẻ từ có ảnh của mình. Cuối cùng.`,
  },
];
