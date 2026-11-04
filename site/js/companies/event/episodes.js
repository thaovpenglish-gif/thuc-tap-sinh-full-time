// Đi Đâu Cũng Được — intern episodes (days 1–38) + the official arc (peak season, no days off).
// Flags carried across episodes (main ones):
//   fireworks ('led'|'real'|'asked') · extra50 ('quoted'|'free'|'escalated') · name_check · kv_checked · quang_photo
//   safe_games · risky_game · first_aid · rooming_ok · seaview_swap · envelope ('refused'|'reported'|'hidden')
//   backdrop_ok · backdrop_plan · night_shift · rain_tent ('self'|'raincoats'|'indoor') · gala_saved · speech_cut
//   bus_saved · knows_contract · overbook_fixed · mc_hosted · runsheet_ok · pnr_ok · lost_id_hero
//   clean_invoice · dirty_invoice · pitch_won · lion_tail · wristbands · peak_volunteer
//   official arc: off_owner · off_show3 · poach_offer · told_duy · final ('client'|'burnout'|'ctv'|'mc')

const isTier = (...ids) => (s) => ids.includes(s.tier);
const F = (k) => (s) => !!s.flags[k];
const NF = (k) => (s) => !s.flags[k];
const is = (k, v) => (s) => s.flags[k] === v;
const official = (s) => s.status === 'official';

const BRIEFING_POS = { duy: 'scrum', thao: 'su1', toan: 'su2', ngan: 'su3', khoa: 'su4', hai: 'su5', vy: 'su6', my: 'su7', tien: 'su8' };
const LUNCH_POS = { toan: 'lunch1', hai: 'lunch2', ngan: 'lunch3', vy: 'lunch4', my: 'lunch5' };

// ---------------------------------------------------------------- mini-games
const TIMELINE_MINI = {
  type: 'order', title: 'Vòng đời một cái gala', icon: '📅',
  prompt: 'Anh Duy: "Xếp lại cho anh. Ai xếp nghiệm thu lên đầu là về sớm. Về hẳn."', time: 30, pass: 0.8,
  items: [
    { text: 'Nhận brief của khách', order: 0 },
    { text: 'Gửi proposal & báo giá (và gửi lại 4 lần)', order: 1 },
    { text: 'Ký hợp đồng, thu cọc', order: 2 },
    { text: 'Load-in, setup lúc nửa đêm', order: 3 },
    { text: 'Tổng duyệt (rehearsal)', order: 4 },
    { text: 'Chạy show', order: 5 },
    { text: 'Nghiệm thu & đòi công nợ', order: 6 },
  ],
};

const NAMES_MINI = {
  type: 'pick', title: 'Soát danh sách vé', icon: '🪪',
  prompt: 'Chị Ngân: "Tên trên vé phải khớp căn cước từng dấu. Tìm 3 tên sai."', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'NGUYEN VAN ANH', sub: 'Căn cước: Nguyễn Văn Ánh' },
    { text: 'TRAN THI BE NHO', sub: 'Căn cước: Trần Thị Bé Nhỏ' },
    { text: 'LE QUANG MINH', sub: 'Căn cước: Lê Minh Quang', correct: true },
    { text: 'PHAM THU HA', sub: 'Căn cước: Phạm Thu Hà' },
    { text: 'DO VAN HUNG HUNG', sub: 'Căn cước: Đỗ Văn Hùng', correct: true },
    { text: 'VU THI LAN', sub: 'Căn cước: Vũ Thị Lan' },
    { text: 'NGO BAO CHAU', sub: 'Căn cước: Ngô Bảo Châu Anh', correct: true },
  ],
};

const FEEDBACK_MINI = {
  type: 'quiz', title: 'Dịch feedback của khách', icon: '🔍',
  prompt: 'Email bên khách: "KV sang hơn nhưng đừng sang quá, trẻ trung nhưng chững chạc, logo to hơn nhưng đừng chiếm chỗ."', time: 35, pass: 0.66,
  questions: [
    { q: '"Sang hơn nhưng đừng sang quá" nghĩa là…', options: ['Thêm kim tuyến', 'Bớt màu, thêm khoảng trắng, chữ vàng đồng', 'Đổi sang màu tím'], correct: 1 },
    { q: '"Trẻ trung nhưng chững chạc" nghĩa là…', options: ['Font gọn hiện đại, bố cục cân đối', 'Thêm sticker mèo', 'Dùng Comic Sans'], correct: 0 },
    { q: '"Logo to hơn nhưng đừng chiếm chỗ" thì…', options: ['Logo to gấp đôi', 'Logo đặt chỗ dễ thấy, nhiều khoảng thở quanh nó', 'Bỏ logo'], correct: 1 },
  ],
};

const GAMES_MINI = {
  type: 'pick', title: 'Chọn trò cho đoàn U50', icon: '🏖️',
  prompt: 'Đoàn Dược Khỏe Re: trung bình 48 tuổi, 3 người đau lưng, muốn "sôi động như tụi trẻ". Chọn 3 trò.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: 'Mật thư tìm kho báu quanh resort', correct: true },
    { text: 'Rung chuông vàng về sản phẩm công ty', correct: true },
    { text: 'Xếp tháp bằng ly giấy theo đội', correct: true },
    { text: 'Vẽ tranh tập thể "Khỏe Re 2027"', correct: true },
    { text: 'Kéo co dưới nước', sub: 'ý tưởng của Khoa' },
    { text: 'Nhảy bao bố trên cát lúc 13 giờ' },
    { text: 'Chuyền nước bằng miệng', sub: '"vui mà"' },
    { text: 'Cõng đồng nghiệp chạy 100 mét' },
  ],
};

const ROOMING_MINI = {
  type: 'pick', title: 'Rooming list v7', icon: '🛏️',
  prompt: '120 pax, 60 phòng. Tìm 3 lỗi trước khi gửi khách sạn.', pick: 3, time: 40, pass: 0.66,
  items: [
    { text: 'P.204: Anh Cường (Kinh doanh) + Anh Hùng (Sản xuất)', sub: 'ghi chú của Vy: "năm ngoái hai anh cãi nhau ở gala"', correct: true },
    { text: 'P.208: Chị Thanh Xuân + Anh Thanh Tùng', sub: 'HR khách tưởng "Thanh Xuân" là nam', correct: true },
    { text: 'P.301: 3 người lớn, phòng đôi, không giường phụ', correct: true },
    { text: 'P.112: Anh Thắng (trưởng đoàn), phòng đơn' },
    { text: 'P.215: Hai chị kế toán, phòng hai giường' },
    { text: 'P.310: Gia đình 2 người lớn + 1 bé 4 tuổi, phòng đôi' },
  ],
};

const BACKDROP_MINI = {
  type: 'pick', title: 'Soát bản in backdrop 6 mét', icon: '🖼️',
  prompt: 'Bản in ra xưởng lúc 11:00. Sai một chữ là 6 mét xấu hổ. Tìm 3 lỗi.', pick: 3, time: 35, pass: 0.66,
  items: [
    { text: '"BÊ TÔNG VỮNG CHÃI · 25 NĂM VỮNG BƯỚC"' },
    { text: '"GALA DINNER 2025"', correct: true },
    { text: '"Chủ tịch HĐQT: Ông Nguyễn Văn Quăng"', correct: true },
    { text: 'Logo cũ (bản trước khi đổi nhận diện)', correct: true },
    { text: '"Ngày 11.11.2026 · Vườn Cỏ Xanh"' },
    { text: 'Màu đỏ may mắn theo yêu cầu 23:07' },
  ],
};

const CONTACTS_MINI = {
  type: 'pick', title: 'Danh bạ anh Toàn', icon: '📇',
  prompt: 'Cần xe 45 chỗ trong 1 giờ, gần quận 7. Chọn 2 số đáng gọi nhất.', pick: 2, time: 25, pass: 0.5,
  items: [
    { text: 'Anh Xe Quận 7', sub: '"có 45 chỗ, hay rảnh sáng thứ Hai"', correct: true },
    { text: 'Anh Xe Nhà Bè (vợ là chị Út)', sub: '"anh không nghe thì gọi chị Út"', correct: true },
    { text: 'Anh Xe Bình Dương 2', sub: '"chỉ có xe 16 chỗ"' },
    { text: 'Anh Xe Đám Cưới', sub: '"xe hoa, 4 chỗ"' },
    { text: 'Anh Xe (không nhớ ai)', sub: 'lưu năm 2017' },
  ],
};

const ALLOTMENT_MINI = {
  type: 'quiz', title: 'Hợp đồng allotment · trang 9', icon: '📑',
  prompt: 'Chị Ngân: "Điều khoản quan trọng luôn nằm ở trang 9. Đọc đi em."', time: 35, pass: 0.66,
  questions: [
    { q: 'Khách sạn không đủ phòng đã xác nhận thì phải…', options: ['Xin lỗi là xong', 'Bố trí phòng tương đương nơi khác, chịu chi phí đưa đón', 'Cho ghép phòng'], correct: 1 },
    { q: '"Release date" là…', options: ['Ngày ra mắt khách sạn', 'Hạn trả lại phòng giữ chỗ chưa dùng', 'Ngày khách check-out'], correct: 1 },
    { q: 'Bằng chứng mạnh nhất để đòi quyền lợi là…', options: ['Tin nhắn "ok em"', 'Email xác nhận đặt phòng có số phòng và giá', 'Lời hứa của chị sales'], correct: 1 },
  ],
};

const RUNSHEET_MINI = {
  type: 'order', title: 'Run-sheet hội nghị khách hàng', icon: '📋',
  prompt: 'Anh Duy: "Run-sheet mà sai thứ tự là ông Chủ tịch phát biểu lúc mọi người đang ăn tráng miệng."', time: 30, pass: 0.8,
  items: [
    { text: 'Đón khách, check-in, chụp ảnh', order: 0 },
    { text: 'Khai mạc, giới thiệu đại biểu', order: 1 },
    { text: 'Chủ tịch phát biểu', order: 2 },
    { text: 'Tri ân khách hàng thân thiết', order: 3 },
    { text: 'Tiệc & văn nghệ', order: 4 },
    { text: 'Bốc thăm may mắn', order: 5 },
    { text: 'Bế mạc, cảm ơn', order: 6 },
  ],
};

const MC_MINI = {
  type: 'quiz', title: 'Lớp MC cấp tốc của chị Kiều', icon: '🎤',
  prompt: 'Chị Kiều mất giọng, nên chị viết câu hỏi lên giấy. Chữ rất to.', time: 35, pass: 0.66,
  questions: [
    { q: 'Giới thiệu đại biểu theo thứ tự…', options: ['Ai ngồi gần sân khấu trước', 'Theo chức vụ, khách mời trước chủ nhà', 'Theo bảng chữ cái'], correct: 1 },
    { q: 'Micro rè giữa câu thì…', options: ['Đập micro', 'Bình tĩnh, ra hiệu kỹ thuật, nói tiếp bằng micro dự phòng', 'Hát một bài'], correct: 1 },
    { q: 'Chủ tịch phát biểu quá 10 phút thì…', options: ['Bật nhạc cắt ngang', 'Chờ ngắt câu, cảm ơn thật nồng nhiệt, dẫn sang phần sau', 'Đi ra hiệu bằng tay'], correct: 1 },
  ],
};

const PROPOSAL_MINI = {
  type: 'order', title: 'Cấu trúc proposal đấu thầu', icon: '📑',
  prompt: 'Mỹ: "Khách đọc 3 trang đầu rồi lật thẳng tới trang giá. Xếp sao cho 3 trang đầu đáng đọc."', time: 30, pass: 0.8,
  items: [
    { text: 'Hiểu brief & mục tiêu của khách', order: 0 },
    { text: 'Concept & key visual', order: 1 },
    { text: 'Kịch bản tổng', order: 2 },
    { text: 'Hạng mục & báo giá', order: 3 },
    { text: 'Case study các show đã làm', order: 4 },
    { text: 'Điều khoản thanh toán & hủy', order: 5 },
  ],
};

const LION_MINI = {
  type: 'order', title: 'Bài lân khai trương (bản rút gọn)', icon: '🦁',
  prompt: 'Khoa đọc to thứ tự. Bạn ở khúc đuôi, không thấy gì, chỉ nghe.', time: 25, pass: 0.8,
  items: [
    { text: 'Lân chào khách ba lần', order: 0 },
    { text: 'Múa vòng quanh sân', order: 1 },
    { text: 'Hái lộc treo cao', order: 2 },
    { text: 'Nhả câu đối "Khai trương hồng phát"', order: 3 },
    { text: 'Chào kết, lui vào', order: 4 },
  ],
};

const HEADCOUNT_MINI = {
  type: 'quiz', title: 'Lớp đếm đầu của anh Hải', icon: '🚩',
  prompt: 'Anh Hải: "Đoàn có trẻ con thì đếm khác. Trả lời to lên!"', time: 30, pass: 0.66,
  questions: [
    { q: 'Đếm đoàn lúc nào?', options: ['Chỉ lúc xuất phát', 'Mỗi lần lên xe, xuống xe, và trước khi xe chạy', 'Khi nào nhớ'], correct: 1 },
    { q: 'Đoàn có trẻ em thì nên…', options: ['Vòng tay ghi số điện thoại bố mẹ cho từng bé', 'Dặn bé đứng yên', 'Để bố mẹ tự lo'], correct: 0 },
    { q: 'Thiếu một bé lúc xe sắp chạy thì…', options: ['Cho xe chạy, tìm sau', 'Giữ xe, chia người tìm theo khu, báo bố mẹ ngay', 'Đăng lên group Zalo'], correct: 1 },
  ],
};

// ---------------------------------------------------------------- intern episodes
export const EPISODES = [
  {
    id: 'onboarding', day: 1, title: 'Onboarding · Bộ đàm số 4',
    intro: 'Thứ Hai, 8:30. Ngày đầu tiên ở Đi Đâu Cũng Được.\n\nTrên bảng: "LỊCH SỰ KIỆN THÁNG 11". Thứ Năm tuần sau có gala 25 năm của khách lớn nhất công ty.\n\nNgoài việc chính, các anh chị sẽ nhờ bạn vài việc vặt. Xem danh sách ở góc màn hình, làm kịp giờ thì được ghi nhận.',
    steps: [
      {
        who: 'lan', obj: 'Tới lễ tân nhận thẻ và bộ đàm', time: '08:30',
        scene: [
          ['lan', 'Em vào làm hả? Đây: thẻ nhân viên, áo đồng phục size M, và bộ đàm số 4.'],
          ['lan', 'Số 7 đi show rồi không về. Số 4 thì về, nhưng hơi rè. Em đặt hô hiệu đi, cả đội gọi em bằng tên đó.'],
          { c: 'e1_callsign', o: [
            { t: '"Chim Sẻ."', fx: { rel: { lan: 1 }, set: { callsign: 'Chim Sẻ' } }, then: [['lan', 'Dễ thương. Năm ngoái có "Đại Bàng", nghỉ sau hai tuần. Chim sẻ thì bền hơn.']] },
            { t: '"Plan B."', fx: { rel: { duy: 1 }, set: { callsign: 'Plan B' } }, then: [['lan', 'Trùng tên con mèo. Thôi được, mèo không cầm bộ đàm.']] },
            { t: '"Intern 4." Đơn giản, dễ nghe.', fx: { uy: 1, set: { callsign: 'Intern 4' } }, then: [['lan', 'Thực tế. Anh Duy sẽ thích. Anh ấy ghét hô hiệu dài hơn ba chữ.']] },
          ] },
          ['nar', 'Bộ đàm rè lên: "…Kho 1 gọi Sân khấu… ai lấy cuộn băng keo đen cuối cùng… copy…"'],
        ],
      },
      {
        who: 'duy', obj: 'Briefing ở bảng (8:30, bắt đầu lúc 8:45 như mọi khi)', time: '08:45', pos: BRIEFING_POS,
        scene: [
          ['duy', 'Briefing. Ngắn. Thứ Năm tuần sau: Gala 25 năm Bê Tông Vững Chãi, 300 khách, sân cỏ ngoài trời.'],
          ['duy', 'Thứ Hai tuần sau nữa: tour Dược Khỏe Re, 120 pax đi biển. Ngân lo phòng, Toàn lo xe, Hải dẫn đoàn.'],
          ['thao', 'Và em vừa chốt thêm một hội nghị khách hàng ngày 18! Dạ được ạ hết!'],
          ['duy', '…Thảo chốt lúc nào?'],
          ['thao', 'Hôm qua. Chủ Nhật. Lúc anh tắt bộ đàm số ba.'],
          ['duy', 'Intern mới. {ten}. Kiểm tra nhanh: em xếp vòng đời một gala cho anh.'],
          { mini: TIMELINE_MINI,
            good: [['duy', 'Copy. Đúng hết. Kể cả cái phần "và gửi lại 4 lần".'], ['ngan', '(nhỏ) Lần đầu có intern xếp nghiệm thu ở cuối.'], { fx: { uy: 3, rel: { duy: 2 }, set: { timeline_ok: true } } }],
            bad: [['duy', 'Em cho tổng duyệt sau chạy show. Ừ, nhiều khách cũng làm vậy. Nhưng mình thì không.'], { fx: { rel: { duy: -1 } } }],
          },
          ['nar', 'Briefing "ngắn" kết thúc lúc 9:20. Bộ đàm số hai kêu bốn lần trong lúc đó.'],
        ],
      },
      {
        who: 'thao', obj: 'Chị Thảo gọi qua đọc brief gala', time: '10:15',
        scene: [
          ['thao', 'Em ngồi đây. Brief gala 25 năm nè: "sang trọng mà gần gũi, hoành tráng mà tiết kiệm".'],
          ['thao', 'À, chị lỡ hứa với anh Quang bên khách là có pháo hoa lúc nâng ly. Pháo hoa thật. Chị nói "dạ được ạ" theo phản xạ.'],
          ['think', 'Pháo hoa. Giữa sân cỏ. Trong thành phố. Cái này chắc cần giấy phép.'],
          { c: 'e1_fireworks', o: [
            { t: '"Em hỏi anh Duy về giấy phép và chi phí trước khi báo khách ạ."', fx: { uy: 3, rel: { duy: 1 }, set: { fireworks: 'asked' } }, then: [
              ['duy', '(từ xa) Pháo hoa thật cần xin phép, mất thời gian, đội giá. Hai tuần thì quên đi. (thông tin giải trí, không phải tư vấn pháp lý)'],
              ['thao', 'Thôi chết… vậy mình nói với anh Quang sao?'],
              ['me', 'Mình đề xuất pháo giấy và pháo hoa trên màn LED ạ. Đẹp, an toàn, đúng ngân sách.'],
              ['thao', 'Ừ ha. Em cứu chị một bàn thua.'],
              { fx: { rel: { thao: 1 } } },
            ] },
            { t: 'Đề xuất ngay: pháo giấy + hiệu ứng pháo hoa trên màn LED.', fx: { uy: 2, rel: { quan: 1 }, set: { fireworks: 'led' } }, then: [
              ['quan', '(vọng sang) LED làm pháo hoa được. Còn đẹp hơn pháo thật, không ai bị cháy tóc.'],
              ['thao', 'Hay! Chị nói với anh Quang là "pháo hoa công nghệ". Nghe sang.'],
            ] },
            { t: 'Ghi vào báo giá: "Pháo hoa thật x1".', fx: { rel: { thao: 2 }, dr: 3, set: { fireworks: 'real' } }, then: [
              ['thao', 'Đúng rồi! Khách muốn gì mình có nấy.'],
              ['think', 'Mình vừa ghi một dòng mà không ai trong công ty biết làm sao để thực hiện.'],
            ] },
          ] },
        ],
      },
      {
        who: 'toan', obj: 'Giờ trưa! Xuống pantry ăn với mọi người', time: '12:00', pos: LUNCH_POS,
        scene: [
          ['vy', 'Ngồi đây nè. Hôm nay có cơm gà từ gala tối qua. Còn ấm. Gần ấm.'],
          ['toan', 'Em là intern mới hả? Ăn đi. Ở đây ăn được lúc nào thì ăn lúc đó. Lúc chạy show là ăn sau khách.'],
          ['hai', 'MỘT, HAI, BA, BỐN, NĂM, SÁU! Đủ người! …Xin lỗi, thói quen. Bàn nào anh cũng đếm.'],
          ['ngan', 'Chị Ngân, booking. Em nhớ: "hold" và "xuất vé" là hai thứ khác nhau. Một cái giữ chỗ, một cái mất tiền.'],
          ['my', 'Mình là Mỹ. Chị Thảo hứa, mình viết proposal. Hôm qua mình ngủ bốn tiếng nên hôm nay nói chuyện được.'],
          { c: 'e1_lunch', o: [
            { t: 'Hỏi anh Toàn bí quyết "danh bạ sống".', fx: { rel: { toan: 2 }, set: { toan_contacts: true } }, then: [
              ['toan', 'Danh bạ phải có ghi chú. "Anh Xe Quận 7: có 45 chỗ, hay rảnh sáng thứ Hai". Tên không quan trọng. Ghi chú mới quan trọng.'],
              ['toan', 'Và không nghe máy thì gọi vợ. Vợ biết chồng ở đâu. Luôn luôn.'],
            ] },
            { t: 'Hỏi chị Ngân về hold và xuất vé.', fx: { rel: { ngan: 2 }, set: { knows_pnr: true } }, then: [
              ['ngan', 'Hold là giữ chỗ có hạn. Quá hạn là mất, giá mới thì cao hơn. Chị từng mất 30 vé vì đi pha cà phê.'],
              ['ngan', 'Từ đó chị không uống cà phê. Chị uống đồng hồ đếm ngược.'],
            ] },
            { t: 'Hỏi anh Hải vì sao luôn cầm cờ.', fx: { rel: { hai: 2 }, nl: 2 }, then: [
              ['hai', 'Cờ để khách thấy anh từ xa. Giọng để khách nghe anh từ xa hơn. Cả hai để không ai bị bỏ lại.'],
              ['think', 'Câu đó nghe như một lời thề.'],
            ] },
          ] },
          { fx: { nl: 25 } },
          ['nar', 'Mèo Plan B nằm cạnh nồi cơm gà, mắt nhìn ra cửa sổ. Trời trong. Nó vẫn không yên tâm.'],
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân nhờ soát tên trên vé', time: '14:00',
        scene: [
          ['ngan', 'Đoàn hội nghị ngày 18 có 7 người bay ra. Hold hết hạn lúc 16:00. Em soát tên với căn cước giúp chị.'],
          ['ngan', 'Sai một chữ là ra sân bay không lên được máy bay. Rồi khách gọi em. Lúc 5 giờ sáng.'],
          { mini: NAMES_MINI,
            good: [['ngan', 'Ba tên sai, đúng ba tên. Em có mắt booking đấy.'], { fx: { uy: 3, rel: { ngan: 2 }, set: { name_check: true } } }],
            bad: [['ngan', 'Còn sót một tên. "Đỗ Văn Hùng Hùng". Hệ thống không bắt lỗi, khách bắt.'], ['nar', 'Chị Ngân sửa lại trong 40 giây, mắt không rời đồng hồ.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'call:kieu', obj: 'Chị Kiều gọi Teams từ buổi gặp khách!', time: '16:00',
        call: { title: 'Bê Tông Vững Chãi <> ĐĐCĐ · "Một xíu thôi"', people: ['kieu', 'huong', 'thao', 'me'] },
        scene: [
          ['kieu', 'Xin chào cả nhà! Chị đang ngồi với chị Hường bên khách. Em intern ghi biên bản giúp chị nhé.'],
          ['huong', 'Dạ, bên chị muốn thêm 50 khách cho gala. Giá như cũ nhé em. Thêm có 50 người thôi mà.'],
          ['thao', 'Dạ được ạ ch…'],
          ['nar', 'Chị Kiều nhìn thẳng vào camera. Nhìn bạn.'],
          { c: 'e1_extra50', o: [
            { t: '"Dạ, em ghi nhận 50 khách. Em gửi chị báo giá bổ sung phần bàn tiệc trong hôm nay ạ."', fx: { uy: 4, rel: { kieu: 2, thao: -1 }, set: { extra50: 'quoted' } }, then: [
              ['huong', 'Ơ… ừ. Em gửi đi, chị trình sếp.'],
              ['kieu', 'Đúng rồi. Khách luôn đúng. Trừ lúc thanh toán.'],
            ] },
            { t: 'Im lặng, ghi "thêm 50 khách, giá như cũ".', fx: { rel: { thao: 1, huong: 1 }, dr: 2, set: { extra50: 'free' } }, then: [
              ['huong', 'Vậy chốt nhé! Cảm ơn cả nhà.'],
              ['kieu', '(sau khi tắt micro) Năm mươi suất ăn. Ai trả? Em trả à?'],
            ] },
            { t: 'Nhắn riêng anh Duy hỏi có đủ bàn và chỗ không.', fx: { rel: { duy: 1 }, set: { extra50: 'escalated' } }, then: [
              { chat: [['duy', 'sân cỏ chứa max 330. thêm 50 là 350. thiếu 20 chỗ + phải báo giá. nói chị Kiều.', true]] },
              ['me', 'Dạ, bên em kiểm tra sức chứa sân trước rồi báo lại chị Hường trong chiều nay ạ.'],
              ['kieu', 'Ừ, phải check. Thêm người không phải thêm ghế. Là thêm đồ ăn, thêm xe, thêm áo mưa.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: '17:45 Về bàn: ở lại kho hay về?', time: '17:45',
        scene: [
          ['nar', '17:45. Bộ đàm vang lên: "Kho 1 gọi tất cả: ai rảnh xuống kho đếm 300 ghế cho thứ Năm tuần sau. Copy?"'],
          { if: isTier('t5'), then: [{ chat: [['kieu', 'Em về rồi à? 🎤', true]] }, ['think', 'Một cái emoji micro. Không có gì đáng sợ hơn.']] },
          { if: F('contract_blind'), then: [['think', 'Thỏa thuận ghi "kể cả cuối tuần, lễ, Tết". Mình đã ký mà không hỏi.']] },
          { c: 'e1_ot', o: [
            { t: 'Xuống kho đếm ghế cùng mọi người.', fx: { nl: -14, rel: { lan: 1, toan: 1, vy: 1 } }, then: [
              { if: isTier('t3', 't5'), then: [{ fx: { uy: 3 } }] },
              ['lan', 'Hai trăm chín mươi bảy. Thiếu ba. Năm nào cũng thiếu ba. Không ai biết ba cái ghế đó đi đâu.'],
              ['nar', 'Tám giờ tối, cả đội ăn bánh mì trên đống bạt. Mệt, nhưng cười nhiều.'],
            ] },
            { t: 'Về đúng giờ. Còn 44 ngày nữa.', fx: { nl: 18 }, then: [
              { if: isTier('t5'), then: [{ fx: { dr: 5, uy: -2 } }, ['think', 'Năm triệu. Hình như năm triệu có kèm cái kho.']] },
              { if: isTier('t0', 't1'), then: [['duy', 'Về đi. Intern về đúng giờ là quyền. Mùa cao điểm thì… mình nói sau.']] },
            ] },
          ] },
        ],
      },
    ],
    diary: (s) => {
      const b = [];
      b.push(`Hô hiệu của mình là "${s.flags.callsign || 'Intern 4'}".`);
      if (s.flags.fireworks === 'real') b.push('Mình ghi "pháo hoa thật" vào báo giá. Không ai biết làm sao.');
      else b.push('Pháo hoa thật đã thành pháo hoa trên LED. Chị Thảo thở phào.');
      if (s.flags.extra50 === 'free') b.push('Thêm 50 khách, giá như cũ. Chị Kiều hỏi ai trả. Mình không trả lời được.');
      if (s.flags.name_check) b.push('Mình bắt được "Đỗ Văn Hùng Hùng".');
      return `Ngày 1. ${b.join(' ')} Mèo Plan B nhìn trời suốt buổi trưa.`;
    },
  },

  {
    id: 'kv_sang_hon', day: 2, title: 'Sang hơn, nhưng đừng sang quá',
    intro: 'Thứ Ba. Key visual gala 25 năm đã sửa lần thứ tư.\n\nEmail feedback lần thứ năm vừa tới lúc 7:12 sáng. Anh Tiến đọc xong thì đội mũ len trùm kín mắt.',
    steps: [
      {
        who: 'tien', obj: 'Qua bàn anh Tiến đọc feedback KV lần 5', time: '09:00',
        scene: [
          ['tien', 'Em đọc giúp anh. Anh đọc rồi nhưng não anh từ chối hiểu.'],
          ['nar', '"KV sang hơn nhưng đừng sang quá. Trẻ trung nhưng chững chạc. Logo to hơn nhưng đừng chiếm chỗ. Thân, Hường."'],
          ['tien', 'Bốn năm làm designer. Anh vẫn nằm mơ thấy câu "sang hơn chút".'],
          { mini: FEEDBACK_MINI,
            good: [['tien', 'Bớt màu, thêm khoảng thở, chữ vàng đồng… Ừ. Em dịch được tiếng khách. Anh nợ em ly cà phê.'], { fx: { uy: 3, rel: { tien: 2 }, set: { kv_translated: true } } }],
            bad: [['tien', 'Thêm kim tuyến hả? Lần trước anh thêm kim tuyến, khách bảo "sến". Thôi để anh đoán tiếp.'], { fx: { rel: { tien: -1 }, nl: -3 } }],
          },
        ],
      },
      {
        who: 'call:huong', obj: 'Chị Hường bên khách gọi Teams', time: '10:30',
        call: { title: 'KV Gala 25 năm · vòng 5', people: ['huong', 'thao', 'tien', 'me'] },
        scene: [
          ['huong', 'Chị nói thật: anh Quang thích lắm. Nhưng anh muốn thêm… ảnh của anh. Ở giữa backdrop. Cỡ to.'],
          ['tien', '(tắt mic) Backdrop sáu mét. Ảnh chân dung. Cỡ to.'],
          ['thao', 'Dạ được… dạ, để bên em xem ạ.'],
          { c: 'e2_photo', o: [
            { t: '"Dạ, mình đặt ảnh anh Quang lên màn LED lúc anh phát biểu, backdrop giữ logo 25 năm vàng đồng ạ."', fx: { uy: 4, rel: { tien: 2, huong: 1 } }, then: [
              ['huong', 'Ừ… lúc phát biểu ảnh hiện lên to, có nhạc… Anh Quang sẽ thích cái đó hơn. Chốt.'],
              ['tien', '(nhắn riêng) em là thiên thần.'],
            ] },
            { t: '"Dạ được ạ chị."', fx: { rel: { thao: 1, huong: 2, tien: -2 }, dr: 2, set: { quang_photo: true } }, then: [
              ['huong', 'Tuyệt! Ảnh anh Quang chị gửi liền. Ảnh chụp năm 2011, nhưng anh thích tấm đó.'],
              ['nar', 'Anh Tiến tháo mũ len, rồi đội lại.'],
            ] },
            { t: '"Chị cho em hỏi anh Quang muốn khách cảm thấy gì khi nhìn backdrop ạ?"', fx: { uy: 2, rel: { huong: 1 } }, then: [
              ['huong', 'Cảm thấy… công ty vững. Hai mươi lăm năm. Anh ấy đã gây dựng nó.'],
              ['me', 'Vậy mình làm một dòng thời gian 25 năm trên LED lúc mở màn, có ảnh anh từ năm đầu ạ.'],
              ['huong', 'Cái này hay! Hay hơn ảnh to. Để chị thưa anh.'],
              { fx: { rel: { tien: 1 } } },
            ] },
          ] },
        ],
      },
      {
        who: 'my', obj: 'Mỹ cần người phụ bảng báo giá', time: '13:30',
        scene: [
          ['my', 'Bạn ơi phụ mình cái bảng báo giá. Chị Thảo vừa giảm 15% cho khách. Mà chưa nói với ai. Kể cả với Excel.'],
          ['nar', 'Ô "Lợi nhuận" đang hiện màu đỏ: -4.200.000.'],
          { c: 'e2_margin', o: [
            { t: 'Ngồi rà lại từng hạng mục, tìm chỗ tiết kiệm hợp lý.', fx: { nl: -6, rel: { my: 2 }, uy: 2 }, then: [
              ['nar', 'Bạn phát hiện cùng một bộ âm thanh được tính hai lần. Lợi nhuận về +1.800.000.'],
              ['my', 'Bạn vừa cứu mình khỏi cái nhìn của cô Bích. Thật đấy.'],
            ] },
            { t: 'Báo chị Thảo: con số đang lỗ.', fx: { uy: 1, rel: { thao: -1, my: 1 } }, then: [
              ['thao', 'Lỗ hả? Ừ… thì… mình lấy công làm lời. Lần sau khách tăng ngân sách.'],
              ['my', '(nhỏ) Năm nào cũng "lần sau".'],
            ] },
            { t: '"Mình đang bận KV, xin lỗi nha."', fx: { rel: { my: -1 } }, then: [['my', 'Không sao… mình quen rồi.']] },
          ] },
        ],
      },
      {
        who: 'kieu', obj: 'Chị Kiều ghé xem KV', time: '15:00',
        scene: [
          ['kieu', 'Cho chị xem KV nào! …Hmm. Đẹp. Nhưng thiếu cái gì đó. Thiếu… kim tuyến.'],
          ['kieu', 'Gala 2009 chị dẫn, backdrop toàn kim tuyến. Khách khóc vì đẹp.'],
          ['tien', '(nhỏ, với bạn) Khách khóc vì đèn chiếu vào kim tuyến chói mắt.'],
          { c: 'e2_glitter', o: [
            { t: '"Dạ, mình để kim tuyến ở khu photobooth, backdrop sân khấu giữ sạch cho ảnh đẹp ạ."', fx: { uy: 2, rel: { kieu: 1, tien: 1 } }, then: [['kieu', 'Photobooth kim tuyến! Chị thích. Khách sẽ chụp ở đó cả đêm.']] },
            { t: 'Đứng về phía anh Tiến: "KV này khách đã duyệt hướng rồi ạ."', fx: { rel: { tien: 2, kieu: -1 }, uy: 1 }, then: [['kieu', 'Ừ thì… khách duyệt rồi thì thôi. Nhưng chị nhớ đấy nhé.']] },
            { t: '"Dạ, em bảo anh Tiến thêm ạ."', fx: { rel: { kieu: 2, tien: -2 } }, then: [['nar', 'Anh Tiến nhìn bạn như nhìn một email feedback lần sáu.']] },
          ] },
        ],
      },
      {
        who: 'tien', obj: 'Anh Tiến nhờ soát lần cuối trước khi xuất file', time: '17:00',
        scene: [
          ['tien', 'Anh xuất file để chờ in. Em soát giúp anh tên, năm, logo. Anh nhìn file này bốn ngày, mắt anh không còn thấy chữ.'],
          { c: 'e2_check', o: [
            { t: 'Soát kỹ từng chữ, đối chiếu với hồ sơ năng lực của khách.', fx: { nl: -5, uy: 2, rel: { tien: 1 }, set: { kv_checked: true } }, then: [
              ['nar', 'Bạn phát hiện file đang dùng logo cũ của khách. Anh Tiến đổi lại. Ghi chú "nhớ kiểm tra lại nếu khách đổi KV".'],
              ['tien', 'Logo cũ. Trời ạ. Năm ngoái có công ty in logo cũ, mất khách luôn.'],
            ] },
            { t: 'Lướt nhanh, trông ổn.', fx: { nl: 2 }, then: [['tien', 'Ok, anh tin em. Hy vọng không ai đổi gì nữa.'], ['think', 'Câu đó nghe như một lời nguyền.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 2. ${s.flags.kv_translated ? 'Mình dịch được tiếng khách: "sang hơn" là bớt màu.' : 'Mình vẫn chưa hiểu "sang hơn nhưng đừng sang quá".'} ${s.flags.quang_photo ? 'Ảnh anh Quang năm 2011 sẽ nằm giữa backdrop sáu mét.' : 'Ảnh anh Quang sẽ lên LED, không lên backdrop. Anh Tiến sống.'} ${s.flags.kv_checked ? 'Mình bắt được logo cũ.' : ''}`,
  },

  {
    id: 'teambuilding_games', day: 4, title: 'Trò chơi bắt buộc vui',
    intro: 'Thứ Năm. Tour Dược Khỏe Re: 120 khách, 3 ngày 2 đêm ở biển, có team building buổi chiều ngày 2.\n\nKhoa vừa gửi kịch bản trò chơi. Trò đầu tiên tên là "Kéo co dưới nước".',
    steps: [
      {
        who: 'khoa', obj: 'Nghe Khoa pitch kịch bản team building', time: '09:30',
        scene: [
          ['khoa', 'Mình có concept rồi: "Sóng Gió Khỏe Re". Trò một: kéo co dưới nước. Trò hai: nhảy bao bố trên cát. Trò ba: chuyền nước bằng miệng!'],
          ['khoa', 'Không ai muốn chơi. Nhưng ai cũng sẽ nhớ. Đó là định nghĩa team building.'],
          { c: 'e4_pitch', o: [
            { t: '"Đoàn này bao nhiêu tuổi vậy Khoa?"', fx: { uy: 2, rel: { khoa: 1 } }, then: [['khoa', '…Mình chưa hỏi. Mình viết kịch bản theo cảm hứng. Cảm hứng của mình 26 tuổi.']] },
            { t: '"Chuyền nước bằng miệng hả? Thời buổi này?"', fx: { rel: { khoa: -1 }, dr: 1 }, then: [['khoa', 'Ờ… thì mình đổi sang chuyền nước bằng ly. Vẫn vui. Kém vui hơn 40%.']] },
          ] },
        ],
      },
      {
        who: 'call:thang', obj: 'Anh Thắng, trưởng đoàn Khỏe Re, gọi Teams', time: '10:30',
        call: { title: 'Khỏe Re <> ĐĐCĐ · Team building', people: ['thang', 'khoa', 'me'] },
        scene: [
          ['thang', 'Bên anh 120 người, trung bình 48 tuổi. Ba anh đau lưng, một chị mới mổ ruột thừa. Nhưng sếp muốn "sôi động như tụi trẻ".'],
          ['khoa', '(tắt mic) Kéo co dưới nước. Bốn mươi tám tuổi. Đau lưng.'],
          ['thang', 'Với lại đừng có trò nào bắt cởi giày. Năm ngoái mất ba đôi giày da.'],
          { c: 'e4_brief', o: [
            { t: 'Hỏi thêm: ai không chơi vận động được, ai cần chỗ ngồi râm.', fx: { uy: 3, rel: { thang: 2 } }, then: [['thang', 'Em hỏi kỹ ghê. Để anh gửi danh sách. Năm ngoái bên kia không hỏi câu nào.']] },
            { t: '"Dạ, bên em có kịch bản sôi động rồi ạ!"', fx: { rel: { thang: 1 } }, then: [['thang', 'Sôi động mà an toàn nha em. An toàn trước, sôi động sau.']] },
          ] },
        ],
      },
      {
        who: 'obj:okr', obj: 'Ra bảng trắng chọn lại trò chơi', time: '13:30',
        scene: [
          ['nar', 'Khoa dán 8 tờ giấy trò chơi lên bảng. Bạn cầm bút đỏ.'],
          { mini: GAMES_MINI,
            good: [['khoa', 'Mật thư, rung chuông vàng, xếp tháp… Ừ. Không ai ướt. Không ai đi viện. Cũng vui.'], { fx: { uy: 3, rel: { thang: 1 }, set: { safe_games: true } } }],
            bad: [['khoa', 'Bạn giữ "nhảy bao bố trên cát lúc 13 giờ" hả? Cát lúc đó 50 độ đấy.'], { fx: { set: { safe_games: false } } }],
          },
        ],
      },
      {
        who: 'hai', obj: 'Anh Hải (quản trò chính) muốn giữ "đại trò chơi"', time: '15:00',
        scene: [
          ['hai', 'Trò chơi lớn phải có VẬN ĐỘNG! Không chạy, không hét thì gọi gì là team building! Anh đề xuất "Cướp cờ trên cát"!'],
          ['nar', 'Anh Hải nói bình thường. Cửa kính rung nhẹ.'],
          { c: 'e4_bigGame', o: [
            { t: 'Giữ một trò vận động nhẹ, có khởi động 10 phút, túi sơ cứu và đội "không chơi thì cổ vũ".', fx: { uy: 3, rel: { hai: 2 }, set: { first_aid: true } }, then: [['hai', 'ĐƯỢC! Đội cổ vũ cũng có điểm! Anh sẽ hét cho đội cổ vũ!']] },
            { t: 'Bỏ hết trò vận động. An toàn tuyệt đối.', fx: { rel: { hai: -1 }, set: { boring_games: true } }, then: [['hai', 'Ngồi giải mật thư ba tiếng… thôi được. Anh sẽ hét nhỏ.']] },
            { t: 'Giữ "Cướp cờ trên cát" như anh Hải muốn, thêm kéo co.', fx: { rel: { hai: 2, khoa: 1 }, dr: 2, set: { risky_game: true } }, then: [['hai', 'TUYỆT VỜI! Sẽ là trận cướp cờ lớn nhất lịch sử Khỏe Re!'], ['think', 'Lịch sử Khỏe Re có ba người đau lưng.']] },
          ] },
        ],
      },
      {
        who: 'khoa', obj: 'Khoa ngồi một mình ở bàn', time: '16:30',
        scene: [
          ['nar', 'Khoa đang xóa file "KeoCoDuoiNuoc_v3". Chậm. Như tiễn một người bạn.'],
          ['khoa', 'Hồi nhỏ mình hay theo bố đi du lịch công ty. Mình là đứa trẻ duy nhất. Không ai chơi với mình.'],
          ['khoa', 'Nên giờ mình nghĩ trò chơi để không ai phải đứng một mình. Nhưng trò của mình hơi… ướt.'],
          { c: 'e4_khoa', o: [
            { t: '"Trò mật thư là của Khoa mà. Để mình ghi tên Khoa là tác giả trong kịch bản gửi khách."', fx: { rel: { khoa: 3 }, uy: 1 }, then: [['khoa', 'Thật hả? …Cảm ơn bạn. Lần đầu tên mình nằm trên trang bìa.']] },
            { t: '"Giữ kéo co dưới nước cho đoàn sinh viên tháng sau đi."', fx: { rel: { khoa: 2 } }, then: [['khoa', 'Đoàn sinh viên! Đúng rồi! Tụi nó 20 tuổi, tụi nó muốn ướt!']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 4. ${s.flags.safe_games ? 'Kịch bản team building giờ an toàn: mật thư, rung chuông vàng, xếp tháp.' : 'Kịch bản vẫn còn một trò trên cát nóng. Hy vọng trời mát.'} ${s.flags.risky_game ? 'Anh Hải giữ được "Cướp cờ trên cát". Mình hơi lo cho ba anh đau lưng.' : s.flags.first_aid ? 'Có túi sơ cứu và đội cổ vũ.' : ''} Khoa từng là đứa trẻ đứng một mình.`,
  },

  {
    id: 'rooming_list', day: 8, title: 'Rooming list lần 7',
    intro: 'Thứ Hai. Tour Dược Khỏe Re khởi hành sau một tuần nữa. 120 pax, 60 phòng.\n\nBên khách gửi danh sách xếp phòng. Bằng ảnh chụp màn hình Excel. Bị cắt mất cột giới tính.',
    steps: [
      {
        who: 'ngan', obj: 'Chị Ngân giao rooming list', time: '09:00',
        scene: [
          ['ngan', 'Em xem nè. Ảnh chụp màn hình. Cột giới tính bị cắt. Cột số phòng bị mờ. Đây là phiên bản số 7.'],
          ['ngan', 'Khách sạn cần bản chuẩn trước 17:00. Không thì họ thả phòng cho đoàn khác.'],
          { c: 'e8_file', o: [
            { t: 'Nhắn anh Thắng xin file Excel gốc.', fx: { uy: 2, rel: { thang: 1, ngan: 1 } }, then: [
              { chat: [['thang', 'File gốc hả em? Đây. À, file này là năm ngoái, em sửa giúp anh mấy chỗ nhé 🙏', true]] },
              ['think', 'Năm ngoái. Mấy chỗ.'],
            ] },
            { t: 'Gõ lại tay từ ảnh chụp.', fx: { nl: -8, rel: { ngan: 2 } }, then: [['ngan', 'Gõ tay hả? Em là người của chị.']] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Vy có thông tin "nội bộ" về đoàn', time: '10:30',
        scene: [
          ['vy', 'Bạn ơi, mình lướt Facebook gala năm ngoái của Khỏe Re. Có clip hai anh trưởng phòng cãi nhau giữa tiệc.'],
          ['vy', 'Anh Cường kinh doanh với anh Hùng sản xuất. Năm nay hai anh… ở chung phòng 204.'],
          { c: 'e8_gossip', o: [
            { t: '"Cảm ơn Vy! Đây là thông tin vàng."', fx: { rel: { vy: 2 } }, then: [['vy', 'Mình nói rồi mà, TikTok hậu trường là nghiên cứu thị trường.']] },
            { t: '"Bạn nên báo chị Ngân luôn."', fx: { rel: { vy: 1, ngan: 1 }, uy: 1 }, then: [['ngan', 'Vy ơi, lần sau có tin này thì báo chị trước khi đăng TikTok nhé.']] },
          ] },
        ],
      },
      {
        who: 'obj:desk', obj: 'Về bàn soát rooming list', time: '13:30',
        scene: [
          ['nar', 'Sáu mươi phòng. Một trăm hai mươi cái tên. Ba cái tên "Thanh". Bạn mở file.'],
          { mini: ROOMING_MINI,
            good: [['think', 'Tách hai anh trưởng phòng, đổi phòng chị Thanh Xuân, thêm giường phụ cho P.301. Xong.'], { fx: { uy: 3, rel: { ngan: 2 }, set: { rooming_ok: true } } }],
            bad: [['think', 'Mình nghĩ ổn rồi. Có lẽ ổn.'], { fx: { set: { rooming_ok: false } } }],
          },
        ],
      },
      {
        who: 'call:thang', obj: 'Anh Thắng gọi xác nhận danh sách', time: '15:00',
        call: { title: 'Rooming list Khỏe Re · v8', people: ['thang', 'ngan', 'me'] },
        scene: [
          ['thang', 'Danh sách ổn. À, em xếp giúp anh: phòng sếp tổng phải hướng biển. Mà đừng để ai biết là anh xin.'],
          ['ngan', '(tắt mic) Hướng biển hết rồi. Mười phòng hướng biển, mười phòng đã có tên.'],
          { c: 'e8_seaview', o: [
            { t: 'Nhờ chị Ngân hỏi khách sạn nâng hạng miễn phí cho trưởng đoàn, theo chính sách đoàn lớn.', fx: { uy: 2, rel: { ngan: 1, thang: 1 } }, then: [
              ['ngan', 'Đoàn 60 phòng thì họ hay tặng 1 phòng nâng hạng. Để chị xin. Em biết mặc cả đấy.'],
              ['thang', 'Có cả nâng hạng hả? Anh ghi nhận em.'],
            ] },
            { t: 'Lặng lẽ đổi phòng hướng biển của một người khác sang cho sếp tổng.', fx: { rel: { thang: 2 }, dr: 3, set: { seaview_swap: true } }, then: [['thang', 'Gọn! Em làm việc được đấy.'], ['think', 'Ai đó vừa mất view biển mà chưa biết.']] },
            { t: '"Dạ, phòng hướng biển hết rồi anh. Em báo giá nâng hạng được không ạ?"', fx: { uy: 1, rel: { thang: -1 } }, then: [['thang', 'Báo giá hả… thôi, để anh hỏi sếp. Chắc sếp ngủ phòng thường cũng được.']] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân gửi bản v8 cho khách sạn', time: '16:50',
        scene: [
          ['ngan', 'Gửi rồi. 16:52. Rooming list lần 8 xong trước 17:00. Kỷ lục của chị năm nay.'],
          ['ngan', 'Chắc tối nay khách sẽ gửi v9. Họ luôn gửi v9.'],
          { fx: { rel: { ngan: 1 } } },
          { chat: [['thang', 'Em ơi bổ sung thêm 2 người nữa nhé, vợ chồng anh Phát phòng kế toán 🙏 (21:04)', false]] },
          ['think', 'v9.'],
        ],
      },
    ],
    diary: (s) => `Ngày 8. ${s.flags.rooming_ok ? 'Mình tách được hai anh trưởng phòng ghét nhau.' : 'Mình gửi rooming list mà không chắc lắm. Phòng 204 làm mình lo.'} ${s.flags.seaview_swap ? 'Mình đổi lén một phòng hướng biển. Ai đó sẽ phát hiện.' : ''} Rooming list v9 tới lúc 21:04.`,
  },

  {
    id: 'vendor_envelope', day: 9, title: 'Phong bì của chị Hoa',
    intro: 'Thứ Ba. Còn hai ngày tới gala 25 năm.\n\nAnh Toàn giao bạn đi lấy báo giá hoa trang trí. Ba vendor. Một vendor rất, rất thân thiện.',
    steps: [
      {
        who: 'toan', obj: 'Anh Toàn giao việc lấy 3 báo giá hoa', time: '09:00',
        scene: [
          ['toan', 'Hoa cho 35 bàn tiệc với cổng chào. Em lấy ba báo giá. So sánh. Đừng lấy bên rẻ nhất, cũng đừng lấy bên đắt nhất.'],
          ['toan', 'Bên rẻ nhất giao hoa héo. Bên đắt nhất giao hoa héo đẹp hơn.'],
          { c: 'e9_vendor', o: [
            { t: 'Hỏi anh Toàn lịch sử từng vendor trước khi gọi.', fx: { uy: 1, rel: { toan: 2 } }, then: [['toan', 'Đúng rồi. Hoa Tươi Mãi: hoa đẹp, giao đúng giờ, nhưng chị Hoa… hay "cảm ơn". Em sẽ hiểu.']] },
            { t: 'Gọi luôn cả ba bên.', fx: { nl: -3 }, then: [['nar', 'Bên thứ nhất gửi báo giá bằng ảnh chụp tờ giấy viết tay. Bên thứ hai không nghe máy. Bên thứ ba nghe ngay ở hồi chuông đầu.']] },
          ] },
        ],
      },
      {
        who: 'call:hoa', obj: 'Chị Hoa (Hoa Tươi Mãi) gọi lại', time: '10:30',
        call: { title: 'Hoa Tươi Mãi · báo giá gala', people: ['hoa', 'me'] },
        scene: [
          ['hoa', 'Em bên Đi Đâu Cũng Được hả? Dễ thương quá! Chị giảm cho em 5% luôn. Hoa hồng Đà Lạt, cẩm tú cầu, đẹp như cưới.'],
          ['hoa', 'Em chọn bên chị nha. Chị gửi em chút quà cảm ơn. Chuyện nhỏ thôi.'],
          { c: 'e9_call', o: [
            { t: '"Dạ em cảm ơn chị, em gửi báo giá cho anh Toàn duyệt ạ."', fx: { uy: 1, rel: { hoa: 1 } }, then: [['hoa', 'Ừ ừ, chị biết mà. Em ngoan ghê.']] },
            { t: '"Chị ơi, quà gì vậy ạ?"', fx: { dr: 1, rel: { hoa: 2 } }, then: [['hoa', 'Bí mật! Lát em xuống lễ tân nhé.']] },
          ] },
        ],
      },
      {
        who: 'lan', obj: 'Chị Lan gọi: có đồ gửi cho bạn ở lễ tân', time: '11:30',
        scene: [
          ['lan', 'Có người gửi em nè. Một bó hoa nhỏ. Và một phong bì. Chị không mở. Chị không mở phong bì người khác.'],
          ['nar', 'Phong bì màu hồng. Bên trong: năm tờ một trăm nghìn và một tấm thiệp: "Cảm ơn em giới thiệu. Chị Hoa."'],
          { if: (s) => s.money < 600_000, then: [['think', 'Năm trăm nghìn. Đúng bằng tiền ăn một tuần của mình lúc này.']] },
          { c: 'e9_envelope', o: [
            { t: 'Gửi trả phong bì, giữ bó hoa, nhắn cảm ơn chị Hoa.', fx: { uy: 3, rel: { lan: 1 }, set: { envelope: 'refused' } }, then: [
              { chat: [['hoa', 'Ơ… em trả lại hả. Ừ, chị hiểu. Em đàng hoàng ghê. Chị sẽ làm hoa cho em thật đẹp.', true]] },
              ['lan', 'Hồi chị mới vào nghề cũng có người trả lại phong bì. Giờ người đó là giám đốc. Là chị Kiều.'],
            ] },
            { t: 'Nhận, rồi báo anh Duy.', fx: { money: 500_000, rel: { duy: 1 }, set: { envelope: 'reported' } }, then: [
              { chat: [['duy', 'em giữ đi. nhưng từ giờ hoa nhà đó em là người soát giá. hiểu chứ.', true]] },
              ['think', 'Anh Duy vừa cho mình giữ tiền. Và giao mình một nghĩa vụ mãi mãi.'],
            ] },
            { t: 'Nhận và không nói ai.', fx: { money: 500_000, dr: 2, set: { envelope: 'hidden' } }, then: [['nar', 'Bạn bỏ phong bì vào balo. Nó nặng hơn năm tờ giấy.']] },
          ] },
        ],
      },
      {
        who: 'bich', obj: 'Cô Bích kiểm tra báo giá hoa', time: '14:30',
        scene: [
          ['bich', 'Báo giá hoa của em đây. Cô so với ba tháng gần nhất.'],
          { if: is('envelope', 'hidden'), then: [
            ['bich', 'Lạ nhỉ. Chị Hoa giảm 5% cho em, nhưng đơn giá cẩm tú cầu tăng 12% so với tháng trước. Cộng lại vẫn lời cho chị ấy.'],
            ['bich', 'Cô không hỏi em có nhận gì không. Cô chỉ ghi vào sổ. Sổ của cô nhớ lâu lắm.'],
            { fx: { rel: { bich: -2 }, uy: -2 } },
          ], else: [
            ['bich', 'Đơn giá hợp lý. Có đủ ba báo giá. Có chữ ký. Cô duyệt.'],
            { if: is('envelope', 'refused'), then: [['bich', 'Cô nghe chị Lan kể chuyện phong bì. Ở đây cô không khen ai. Nhưng cô ghi nhận.'], { fx: { rel: { bich: 2 } } }] },
          ] },
          { c: 'e9_bich', o: [
            { t: 'Hỏi cô Bích cách đọc báo giá vendor cho chuẩn.', fx: { rel: { bich: 1 }, uy: 1 }, then: [['bich', 'So đơn giá, không so tổng. Tổng thì ai cũng làm đẹp được. Đơn giá thì không nói dối.']] },
            { t: 'Cảm ơn rồi chuồn nhanh.', fx: { nl: 2 }, then: [['bich', 'Đi đi. Nhớ mang hóa đơn đỏ về.']] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy đang ngồi một mình nhìn điện thoại', time: '16:30',
        scene: [
          ['nar', 'Ba cái bộ đàm nằm im trên bàn. Anh Duy nhìn một bức ảnh: một bé gái thổi nến.'],
          ['duy', 'Con gái anh. Sinh nhật ngày 11/11. Ba năm rồi anh không có mặt. Năm nay lại trùng gala.'],
          ['duy', 'Nghề này là vậy. Ngày người ta vui là ngày mình làm.'],
          { c: 'e9_duy', o: [
            { t: '"Lúc tổng duyệt xong, anh gọi video cho bé. Em giữ bộ đàm giúp anh 15 phút."', fx: { rel: { duy: 3 }, set: { cover_duy: true } }, then: [['duy', '…15 phút. Ừ. Em giữ bộ đàm số hai. Số hai là vendor. Đừng hứa gì với ai.']] },
            { t: '"Em ghi nhắc anh đặt bánh gửi về nhà từ hôm nay ạ."', fx: { rel: { duy: 2 } }, then: [['duy', 'Bánh dâu. Bé thích dâu. …Cảm ơn em.']] },
            { t: 'Gật đầu, để anh ấy yên.', fx: { rel: { duy: 1 } }, then: [['nar', 'Anh Duy cất điện thoại, đeo lại bộ đàm. "Copy," anh nói với không ai cả.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 9. ${({ refused: 'Mình trả lại phong bì của chị Hoa.', reported: 'Mình nhận phong bì và báo anh Duy. Giờ mình là người soát giá hoa mãi mãi.', hidden: 'Có năm trăm nghìn trong balo. Cô Bích có một cuốn sổ.' })[s.flags.envelope] || ''} Con gái anh Duy sinh nhật ngày 11/11. Đúng ngày gala.`,
  },

  {
    id: 'backdrop_23h', day: 10, title: '23:07: Sếp khách muốn đổi backdrop',
    intro: 'Thứ Tư. Gala 25 năm là ngày mai. Load-in tối nay lúc 22:00.\n\nTối qua, 23:07, anh Quang bên khách xem gala của một công ty đối thủ trên Facebook. Và có ý tưởng.',
    chatStart: [
      ['thao', '(23:07 tối qua) Anh Quang muốn đổi backdrop từ vàng đồng sang ĐỎ may mắn. Chị "dạ được ạ" rồi 🙏🙏🙏', false],
      ['duy', '(23:15) Thảo. Mai 8:30 họp.', false],
      ['tien', '(23:16) 🫠', false],
    ],
    steps: [
      {
        who: 'thao', obj: 'Họp khẩn với chị Thảo', time: '08:30',
        scene: [
          ['thao', 'Chị biết. Chị biết hết. Nhưng anh Quang nói "đỏ mới là 25 năm". Lúc 23 giờ. Chị không nói "không" được lúc 23 giờ.'],
          ['duy', 'Xưởng in cần file trước 11:00 thì mới kịp in, kịp khô, kịp chở lúc 22:00.'],
          ['tien', 'Đổi màu thì đổi cả KV, đổi cả standee, đổi cả thư mời điện tử. Ba tiếng.'],
          { c: 'e10_plan', o: [
            { t: '"Mình đổi backdrop chính và LED, standee giữ nguyên, thư mời gửi rồi thì thôi ạ."', fx: { uy: 3, rel: { duy: 1, tien: 1 } }, then: [['duy', 'Copy. Ưu tiên cái khách nhìn thấy nhiều nhất. Tiến, đi.']] },
            { t: '"Đổi hết cho đồng bộ ạ."', fx: { nl: -6, rel: { thao: 1, tien: -1 } }, then: [['tien', 'Hết. Ừ. Hết thì hết. Anh không cần ăn trưa.']] },
          ] },
        ],
      },
      {
        who: 'tien', obj: 'Soát bản in backdrop mới trước 11:00', time: '10:15',
        scene: [
          ['tien', 'File đỏ đây. Anh làm trong 90 phút, dựa trên file cũ trong ổ chung. Em soát giúp anh. Lần này phải chuẩn.'],
          { if: F('kv_checked'), then: [['think', 'Ghi chú hôm thứ Ba: "nhớ kiểm tra lại nếu khách đổi KV". Logo. Năm. Tên.']] },
          { mini: BACKDROP_MINI,
            good: [['tien', 'Năm 2025. Tên "Quăng". Logo cũ. Ba lỗi trong file anh lấy từ ổ chung. Ổ chung là kẻ thù.'], ['nar', 'File đúng ra xưởng lúc 10:52.'], { fx: { uy: 4, rel: { tien: 2, duy: 1 }, set: { backdrop_ok: true } } }],
            bad: [['nar', 'File ra xưởng lúc 10:55. Một lỗi vẫn nằm trong đó, ngủ yên, chờ ánh đèn sân khấu.'], { fx: { set: { backdrop_ok: false } } }],
          },
        ],
      },
      {
        who: 'toan', obj: 'Anh Toàn: xưởng in có vấn đề', time: '11:40',
        scene: [
          ['toan', 'Xưởng in nói máy in khổ lớn đang chạy đơn khác. Muốn in gấp thì gấp đôi giá. Ba triệu tiền gấp.'],
          { c: 'e10_print', o: [
            { t: 'Trả gấp đôi, báo chị Kiều xin ghi vào phát sinh khách chịu.', fx: { uy: 1, rel: { toan: 1 }, set: { backdrop_plan: 'rush' } }, then: [['toan', 'Được. Anh gọi xưởng. Chủ xưởng là bạn nhậu anh, nhưng tiền vẫn là tiền.']] },
            { t: 'Bỏ backdrop in, chiếu KV đỏ toàn bộ trên màn LED.', fx: { uy: 2, rel: { quan: 1 }, set: { backdrop_plan: 'led' } }, then: [['toan', 'LED thì anh Quân lo. Không tốn tiền in. Nhưng nếu LED chết điểm ảnh ngay chữ "25" thì…'], ['think', 'Thì mình sẽ khóc.']] },
            { t: 'Giữ backdrop vàng cũ, in đề can đỏ dán viền.', fx: { dr: 2, set: { backdrop_plan: 'patch' } }, then: [['toan', 'Từ xa thì đỏ. Lại gần thì… vàng có viền đỏ. Ảnh zoom là lộ.']] },
          ] },
        ],
      },
      {
        who: 'quan', obj: 'Anh Quân test hình trên LED', time: '14:00',
        scene: [
          ['quan', 'Laptop em cổng gì? Type-C. Màn LED cần HDMI. Khách sạn thì chỉ có VGA. Năm 2026 rồi đấy.'],
          ['nar', 'Anh Quân mở một hộp nhựa chứa 47 loại đầu chuyển. Mỗi cái có nhãn viết tay.'],
          { if: is('backdrop_plan', 'led'), then: [['quan', 'Toàn bộ backdrop lên LED thì anh cần file 7680 x 2160. Em xuất lại giúp anh. Và cầu cho không có điểm ảnh chết.']] },
          { c: 'e10_quan', o: [
            { t: 'Ngồi học anh Quân cách test tín hiệu và mang đầu chuyển dự phòng.', fx: { rel: { quan: 2 }, uy: 1, set: { knows_hdmi: true } }, then: [['quan', 'Luôn mang hai đầu chuyển. Một cái để dùng, một cái để mất.']] },
            { t: 'Để anh Quân lo, quay về việc khác.', fx: { nl: 2 }, then: [['quan', 'Ừ. Tối nay đừng hỏi anh "sao không lên hình" nhé.']] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy: "Đêm nay ai trực sân khấu?"', time: '17:30',
        scene: [
          ['duy', 'Load-in 22:00. Dựng truss, LED, âm thanh tới 3 giờ sáng. Cần một người canh cửa hàng, đếm ghế. Ai?'],
          ['nar', 'Cả văn phòng đột nhiên rất bận nhìn màn hình. Vy nhìn trần nhà.'],
          { if: F('contract_blind'), then: [['think', '"Kể cả cuối tuần, lễ, Tết". Đêm thứ Tư chắc cũng tính.']] },
          { c: 'e10_night', o: [
            { t: '"Em trực ạ."', fx: { nl: -20, uy: 3, rel: { duy: 3, vy: 1 }, set: { night_shift: true } }, then: [
              ['duy', 'Copy. Mang áo khoác. Túi ngủ trong kho, cái màu xanh. Cái màu đỏ là của anh.'],
              ['nar', '2 giờ sáng, bạn nằm trên đống bạt, đếm ghế trong mơ. Hai trăm chín mươi bảy. Thiếu ba.'],
            ] },
            { t: '"Em trực tới 1 giờ rồi Vy thay ạ."', fx: { nl: -10, rel: { duy: 1, vy: 1 } }, then: [['vy', 'Ok, 1 giờ mình tới. Mình quay TikTok luôn. "Setup gala lúc 3 giờ sáng: phần 2".']] },
            { t: 'Nhìn màn hình rất chăm chú.', fx: { nl: 5, rel: { duy: -1 } }, then: [['duy', 'Vy. Em trực.'], ['vy', '…Copy.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 10. ${s.flags.backdrop_ok ? 'Mình bắt được ba lỗi: năm 2025, "Quăng", logo cũ.' : 'File ra xưởng lúc 10:55. Mình có cảm giác đã bỏ sót gì đó.'} ${({ rush: 'Backdrop in gấp, gấp đôi giá.', led: 'Toàn bộ backdrop lên LED.', patch: 'Backdrop vàng dán viền đỏ. Ảnh zoom là lộ.' })[s.flags.backdrop_plan] || ''} ${s.flags.night_shift ? 'Đêm nay mình ngủ trên đống bạt.' : ''}`,
  },

  {
    id: 'gala_rain', day: 11, title: 'Gala 25 năm: trời mưa',
    intro: 'Thứ Năm. 11/11. Gala 25 năm Bê Tông Vững Chãi. 300 khách (hoặc 350). Sân cỏ ngoài trời.\n\nDự báo sáng nay: 30% mưa. Mèo Plan B đã chui vào kho từ 7 giờ.\n\nBạn trực "base" ở văn phòng tới chiều rồi ra venue.',
    steps: [
      {
        who: 'duy', obj: 'Anh Duy ghé văn phòng trước khi ra venue', time: '08:30', pos: { duy: 'x1' },
        scene: [
          { if: F('night_shift'), then: [['duy', 'Em ngủ được mấy tiếng? Một? Đủ rồi. Anh ngủ không tiếng.']] },
          ['duy', 'Dự báo 30% mưa. Khách không chịu dựng rạp, 8 triệu. Chị Thảo hứa với khách "không mưa đâu chị".'],
          ['thao', 'Thì… năm ngoái không mưa mà.'],
          ['duy', 'Năm ngoái tổ chức trong nhà, Thảo.'],
          ['nar', 'Bạn refresh dự báo. 30%. Refresh. 45%. Refresh. 60%.'],
          { c: 'e11_rain', o: [
            { t: 'Đề xuất tự giữ chỗ rạp với vendor, cọc trước, xin khách duyệt sau.', fx: { uy: 2, rel: { duy: 2, thao: -1 }, set: { rain_tent: 'self' } }, then: [
              ['duy', 'Copy. Nếu không mưa, mình mất cọc. Nếu mưa, mình là anh hùng. Anh chọn làm anh hùng nghèo.'],
              ['toan', '(bộ đàm) Rạp 30 x 20 mét, bên anh Tư, 14:00 dựng. Anh gọi rồi.'],
            ] },
            { t: 'Theo ý khách, nhưng mua sẵn 350 áo mưa và dặn Plan B dời bàn.', fx: { uy: 1, money: 0, rel: { thao: 1 }, set: { rain_tent: 'raincoats' } }, then: [
              ['duy', 'Áo mưa thì rẻ. Nhưng 300 khách mặc áo mưa nâng ly… Ừ. Cũng là kỷ niệm.'],
            ] },
            { t: 'Gọi chị Hường đề xuất dời tiệc vào ballroom khách sạn kế bên.', fx: { uy: 3, rel: { huong: 1 }, set: { rain_tent: 'indoor' } }, then: [
              ['huong', 'Ballroom hả em? Anh Quang muốn sân cỏ… nhưng 60% mưa thì… để chị thưa anh. …Anh đồng ý, nhưng "phải sang như sân cỏ".'],
              ['duy', 'Sang như sân cỏ. Trong nhà. Copy. Dời 35 bàn, LED, truss trong 5 tiếng.'],
            ] },
          ] },
        ],
      },
      {
        who: 'obj:printer', obj: 'In 350 thẻ tên khách mời', time: '10:00',
        scene: [
          ['nar', 'Máy in màu chạy thẻ tên. Tờ thứ 112: "Nguyễn Văn Ạnh".'],
          { if: F('name_check'), then: [
            ['think', 'Lại một Đỗ Văn Hùng Hùng. Mình đã quen mắt rồi. Soát lại cả xấp.'],
            ['nar', 'Bạn bắt thêm hai tên sai dấu. Không khách nào cầm thẻ tên của người khác tối nay.'],
            { fx: { uy: 2 } },
          ], else: [
            ['nar', 'Bạn sửa "Ạnh" thành "Ánh". Còn hai tên sai khác thì nằm im trong xấp, chờ tới giờ check-in.'],
            { fx: { dr: 1 } },
          ] },
          { if: is('extra50', 'free'), then: [['think', 'Năm mươi khách thêm. Năm mươi thẻ tên. Năm mươi suất ăn chưa ai trả tiền.']] },
        ],
      },
      {
        who: 'call:quang', obj: 'Anh Quang, sếp lớn bên khách, gọi Teams!', time: '13:30',
        call: { title: 'Anh Quang <> ĐĐCĐ · "Thêm tí thôi"', people: ['quang', 'thao', 'me'] },
        scene: [
          ['quang', 'Anh vừa nghĩ ra: thêm ba tiết mục văn nghệ của phòng kinh doanh. Tụi nó tập rồi. Với phần anh phát biểu: 20 phút.'],
          ['thao', 'Dạ được…'],
          ['think', 'Run-sheet đã chốt. Nhà hàng tính phí quá giờ sau 22:00. Mỗi tiết mục thêm 6 phút.'],
          { c: 'e11_speech', o: [
            { t: '"Dạ anh, mình giữ một tiết mục hay nhất mở màn tiệc, phần anh 7 phút kèm phim 25 năm thì khách nhớ hơn ạ."', fx: { uy: 4, rel: { quang: 2, thao: 1 }, set: { speech_cut: true } }, then: [
              ['quang', 'Phim 25 năm hả? …Có ảnh anh hồi trẻ không?'],
              ['me', 'Dạ có ạ. Ảnh năm 2001, anh đứng cạnh máy trộn bê tông đầu tiên.'],
              ['quang', 'Được. Bảy phút. Phim. Một tiết mục. Em này được.'],
            ] },
            { t: '"Dạ được ạ anh." (theo chị Thảo)', fx: { rel: { quang: 1, thao: 1, duy: -1 }, dr: 2 }, then: [['nar', 'Bộ đàm số hai rè lên tiếng anh Duy: "Ai vừa thêm 38 phút vào run-sheet?"']] },
            { t: 'Xin phép chuyển máy cho chị Kiều.', fx: { rel: { kieu: 1 } }, then: [
              ['kieu', 'Anh Quang ơi! Em Kiều đây. Anh nói hai mươi phút thì khách nghe hai mươi phút, nhưng nhớ có hai câu. Mình làm bảy phút, hai câu đó vang mãi.'],
              ['quang', 'Kiều nói thì anh nghe.'],
              ['kieu', '(nhắn riêng) lần sau em tự làm được nhé. chị không phải lúc nào cũng rảnh 🎤'],
              { fx: { set: { speech_cut: true } } },
            ] },
          ] },
        ],
      },
      {
        who: 'call:duy', obj: 'Bộ đàm từ venue: MƯA!', time: '16:45',
        call: { title: '📻 Kênh Sân Khấu · venue Vườn Cỏ Xanh', people: ['duy', 'hai', 'quan', 'me'] },
        scene: [
          ['nar', 'Tiếng mưa trong bộ đàm to hơn tiếng anh Duy. Khách bắt đầu check-in lúc 17:00.'],
          ['duy', 'Mưa sớm hơn dự báo hai tiếng. Ai nghe báo cáo.'],
          { if: is('rain_tent', 'self'), then: [
            ['toan', 'Rạp dựng xong lúc 16:20! Khô! Khô hết! Anh Tư xứng đáng một bữa nhậu!'],
            ['duy', 'Copy. Tất cả vào rạp. Check-in chuyển vào trong. Không ai ướt.'],
            ['hai', 'MỜI QUÝ KHÁCH VÀO RẠP! LỐI NÀY! LỐI NÀY!'],
            { fx: { uy: 5, rel: { duy: 2, toan: 1 }, set: { gala_saved: true } } },
          ] },
          { if: is('rain_tent', 'indoor'), then: [
            ['duy', 'Ballroom ổn. Hơi chật. LED dựng lệch 20 phân. Không ai biết trừ anh.'],
            ['quan', 'Âm thanh trong nhà ngon hơn ngoài trời. Thề.'],
            { fx: { uy: 4, rel: { duy: 1, huong: 1 }, set: { gala_saved: true } } },
          ] },
          { if: is('rain_tent', 'raincoats'), then: [
            ['hai', 'BA TRĂM NĂM MƯƠI ÁO MƯA ĐANG ĐƯỢC PHÁT! MÀU VÀNG! RẤT ĐỒNG BỘ!'],
            ['duy', 'Bàn tiệc ướt. Sân khấu ướt. LED vẫn sống. Cần một quyết định trong 5 phút.'],
            { c: 'e11_raincoat', o: [
              { t: '"Dời khai mạc vào sảnh khách sạn kế bên, tiệc chờ mưa tạnh rồi ra lại sân cỏ ạ."', fx: { uy: 3, rel: { duy: 2 }, set: { gala_saved: true } }, then: [['duy', 'Copy. Làm hai lần setup trong một tối. Nhưng khách khô. Đi.']] },
              { t: '"Cứ chạy show trong mưa, MC làm cho vui."', fx: { dr: 4, rel: { huong: -1 } }, then: [['nar', 'Ba trăm năm mươi người mặc áo mưa vàng nâng ly. Rất đồng bộ. Không ai vui.']] },
            ] },
          ] },
          { if: (s) => s.flags.backdrop_ok === false, then: [['quan', 'À… backdrop. Có một chữ… ai đó soát lại chưa? Ảnh của khách đang chụp sát vào đó.'], { fx: { dr: 2, uy: -2 } }] },
          { if: is('backdrop_plan', 'patch'), then: [['hai', 'Khách chụp ảnh check-in. Zoom vào thấy viền đề can bị mưa bong. Chị Hường nhìn thấy rồi.'], { fx: { dr: 2, rel: { huong: -1 } } }] },
          { if: F('cover_duy'), then: [['duy', '(nhỏ) Lúc tổng duyệt anh gọi được cho bé rồi. Bé hỏi "bố đang ở trong mưa à". Cảm ơn em đã giữ bộ đàm.'], { fx: { rel: { duy: 1 } } }] },
        ],
      },
      {
        who: 'obj:desk', obj: '17:55 Ôm áo mưa ra venue (gala bắt đầu)', time: '17:55',
        scene: [
          ['nar', 'Bạn ôm hai thùng áo mưa, gọi xe, nhìn bầu trời đen kịt. Ở nhà, mèo Plan B đã ngủ trong kho từ sáng.'],
          { if: F('gala_saved'), then: [
            { chat: [
              ['kieu', 'Khách khen!!! Anh Quang bảo "mưa mà vui hơn năm ngoái" 🎤🎤🎤 Xin một tràng pháo tay cho cả team!', false],
              ['duy', 'good job. 23:00 load-out. ai còn sức thì ở lại.', false],
            ] },
            ['think', 'Ảnh check-in đẹp là khách quên hết lỗi. Hôm nay ảnh rất đẹp.'],
          ], else: [
            { chat: [
              ['kieu', 'Khách hơi buồn. Anh Quang bảo "mưa thì chịu". Mai họp rút kinh nghiệm 9h.', false],
              ['duy', 'load-out 23:00. đừng ai nói gì trên group khách.', false],
            ] },
            ['think', 'Ngày mai là "rút kinh nghiệm". Tức là đổ lỗi có văn hóa.'],
          ] },
          { if: is('fireworks', 'real'), then: [['nar', 'Phần "pháo hoa thật" trong báo giá thì không ai làm. Mưa che đi cho tất cả. Nhưng cô Bích sẽ thấy dòng đó.']] },
        ],
      },
    ],
    diary: (s) => `Ngày 11. Gala 25 năm. Trời mưa lúc 16:40. ${({ self: 'Rạp mình tự giữ chỗ đã cứu cả đêm.', indoor: 'Mình dời tiệc vào ballroom. Chật mà khô.', raincoats: 'Ba trăm năm mươi áo mưa vàng.' })[s.flags.rain_tent] || ''} ${s.flags.speech_cut ? 'Anh Quang phát biểu bảy phút, có phim.' : 'Run-sheet dài thêm 38 phút.'} ${s.flags.gala_saved ? 'Khách khen. Mình ngủ gật trên xe về.' : 'Mai rút kinh nghiệm.'}`,
  },

  {
    id: 'bus_no_show', day: 15, title: 'Xe không tới (đoàn 120 pax)',
    intro: 'Thứ Hai. Tour Dược Khỏe Re khởi hành 9:00 trước trụ sở khách. 120 khách, ba xe 45 chỗ.\n\nAnh Hải ở điểm hẹn từ 7 giờ, cờ vàng phấp phới. Bạn trực ở văn phòng.\n\n8:30. Điện thoại rung.',
    steps: [
      {
        who: 'call:hai', obj: 'Anh Hải gọi từ điểm hẹn!', time: '08:30',
        call: { title: '🚩 Điểm hẹn Khỏe Re · 120 pax', people: ['hai', 'toan', 'me'] },
        scene: [
          ['hai', 'MỘT TRĂM HAI MƯƠI KHÁCH ĐỦ! HAI XE ĐỦ! XE THỨ BA… KHÔNG THẤY!'],
          ['toan', 'Xe ba của anh Lộc. Anh gọi rồi. Thuê bao. Gọi vợ, vợ bảo "ổng đi từ 5 giờ".'],
          ['hai', 'Bốn mươi khách đang đứng nhìn anh. Anh đang cầm cờ. Cờ không chở được người.'],
          { c: 'e15_first', o: [
            { t: '"Anh Hải cho 80 khách lên hai xe xuất phát trước, 40 khách còn lại mời vào sảnh uống nước ạ."', fx: { uy: 3, rel: { hai: 2 } }, then: [['hai', 'ĐÚNG! Đoàn chia hai! Xe một, xe hai, ĐI! Bốn mươi người còn lại: CÀ PHÊ!']] },
            { t: '"Mọi người chờ thêm 15 phút ạ, chắc xe kẹt đường."', fx: { dr: 2, rel: { thang: -1 } }, then: [['hai', 'Mười lăm phút nữa anh sẽ bị 120 người ăn thịt. Nhưng được.']] },
          ] },
        ],
      },
      {
        who: 'toan', obj: 'Qua bàn anh Toàn tìm xe dự phòng', time: '08:50',
        scene: [
          ['toan', 'Danh bạ anh đây. Ba trăm mười hai số nhà xe. Em tìm giúp anh, anh gọi anh Lộc tiếp.'],
          { if: F('toan_contacts'), then: [['think', 'Anh Toàn nói hôm đầu: "Tên không quan trọng. Ghi chú mới quan trọng."']] },
          { mini: CONTACTS_MINI,
            good: [['toan', 'Anh Xe Quận 7! Có xe 45 chỗ, 9:40 tới. Anh nợ ổng một bữa. Giờ nợ hai.'], { fx: { uy: 3, rel: { toan: 2 }, set: { bus_found: true } } }],
            bad: [['toan', 'Anh Xe Đám Cưới hả? Xe hoa bốn chỗ. Đẹp, nhưng chở được bốn người.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'call:loc', obj: 'Anh Lộc Xe cuối cùng cũng nghe máy', time: '09:20',
        call: { title: 'Nhà xe Lộc Phát', people: ['loc', 'toan', 'me'] },
        scene: [
          ['loc', 'Alo, xin lỗi em, xe 45 chỗ hư bơm dầu. Anh điều xe 29 chỗ qua, 10 phút nữa tới. Nhồi tí là vừa.'],
          { if: F('tie_toan_loc'), then: [['toan', 'Anh Lộc! Anh rể mà làm em vậy hả! Tết này em không qua nhà anh nữa!'], ['think', 'Anh rể. Mọi chuyện bắt đầu có nghĩa.']] },
          ['think', '40 khách. Xe 29 chỗ. "Nhồi tí". Chở quá số người quy định là bị phạt, và nguy hiểm. (thông tin giải trí, không phải tư vấn pháp lý)'],
          { c: 'e15_bus', o: [
            { t: '(Có xe dự phòng) "Anh cho xe 29 chỗ về. Bên em có xe 45 chỗ rồi, anh chịu phần chênh."', when: F('bus_found'), fx: { uy: 4, rel: { toan: 1, loc: -1 }, set: { bus_saved: true } }, then: [['loc', 'Ờ… ừ, anh chịu. Lần sau anh báo sớm.'], ['toan', 'Lần sau anh báo trước 5 giờ sáng, không phải sau 9 giờ.']] },
            { t: 'Nhận xe 29 chỗ + gọi thêm 2 xe 7 chỗ cho 11 người còn lại.', fx: { money: 0, uy: 2, rel: { hai: 1 }, set: { bus_saved: true } }, then: [['hai', 'Xe 29 chỗ ĐỦ GHẾ! Mười một người đi xe nhỏ! Không ai đứng! Đi!'], ['bich', '(sau đó, nhắn) Hai xe 7 chỗ ghi vào phát sinh nhà xe chịu. Giữ hóa đơn.']] },
            { t: '"Nhồi tí cũng được ạ, đi cho kịp."', fx: { dr: 5, uy: -4, rel: { thang: -2 } }, then: [['nar', 'Bốn mươi người lên xe 29 chỗ. Tới trạm thu phí, một chú CSGT giơ tay. Xe dừng 50 phút. Phạt. Anh Thắng nhìn đồng hồ.']] },
          ] },
        ],
      },
      {
        who: 'call:thang', obj: 'Anh Thắng gọi từ trên xe', time: '11:00',
        call: { title: 'Khỏe Re · trên đường ra biển', people: ['thang', 'me'] },
        scene: [
          { if: F('bus_saved'), then: [
            ['thang', 'Xe mới thơm ghê em. Khách bên anh còn tưởng mình được nâng hạng. Thôi, coi như không có gì.'],
            { fx: { rel: { thang: 2 } } },
          ], else: [
            ['thang', 'Em ơi, mình trễ gần hai tiếng rồi. Sếp tổng bên anh hỏi "công ty này có ổn không". Anh không biết trả lời sao.'],
            { fx: { rel: { thang: -1 } } },
          ] },
          { c: 'e15_sorry', o: [
            { t: 'Xin lỗi, đề xuất tặng đoàn một buổi tiệc trái cây lúc tới resort.', fx: { uy: 2, rel: { thang: 1 } }, then: [['thang', 'Trái cây hả. Ừ. Khách thích được tặng. Kể cả trái cây.']] },
            { t: 'Giải thích rõ lỗi do nhà xe, có biên bản.', fx: { uy: 1 }, then: [['thang', 'Lỗi ai thì khách cũng nhớ tên công ty em thôi. Nhưng cảm ơn em đã nói rõ.']] },
          ] },
        ],
      },
      {
        who: 'call:hai', obj: 'Anh Hải gọi lúc check-in resort', time: '15:30',
        call: { title: '🚩 Biển Xanh Resort · check-in', people: ['hai', 'ngan', 'me'] },
        scene: [
          ['hai', 'Check-in xong! 60 phòng, 120 khách!'],
          { if: F('rooming_ok'), then: [
            ['hai', 'Không ai cãi nhau! Anh Cường với anh Hùng ở hai đầu hành lang! Chị Thanh Xuân có phòng riêng! Rooming list đẹp như mơ!'],
            { fx: { uy: 3, rel: { hai: 1, ngan: 1 } } },
          ], else: [
            ['hai', 'Phòng 204. Anh Cường. Anh Hùng. Đang cãi nhau ngoài hành lang. Chuyện năm ngoái. Về một cái giải thưởng.'],
            ['ngan', 'Còn phòng 208, chị Thanh Xuân vừa gọi chị. Bằng một giọng rất bình tĩnh. Đáng sợ.'],
            { c: 'e15_fix', o: [
              { t: 'Nhờ chị Ngân xin khách sạn hai phòng trống, mình trả phần chênh rồi đòi lại khách sau.', fx: { uy: 1, rel: { ngan: 1 } }, then: [['ngan', 'Chị xin được. Đắt. Nhưng hành lang yên lặng.']] },
              { t: 'Để anh Hải "hòa giải" hai anh trưởng phòng.', fx: { dr: 3, rel: { hai: -1 } }, then: [['hai', 'ANH ĐÃ HÒA GIẢI! …Bằng cách hét to hơn cả hai. Họ im. Họ vẫn ghét nhau.']] },
            ] },
          ] },
          { if: F('seaview_swap'), then: [['hai', 'À, có một chị phòng 401 hỏi sao năm nay không được phòng hướng biển như đăng ký. Anh nói anh không biết. Anh không biết thật.'], { fx: { dr: 2 } }] },
        ],
      },
    ],
    diary: (s) => `Ngày 15. ${s.flags.bus_saved ? 'Xe thứ ba không tới, nhưng đoàn vẫn đi đủ, không ai đứng.' : 'Xe 29 chỗ, 40 người, một chú CSGT.'} ${s.flags.rooming_ok ? 'Check-in resort êm ru.' : 'Phòng 204 cãi nhau.'} Mình lưu thêm số "Anh Xe Quận 7".`,
  },

  {
    id: 'hotel_overbook', day: 17, title: 'Khách sạn hết 8 phòng',
    intro: 'Thứ Tư. Đoàn Khỏe Re hôm qua đã chơi team building. Hôm nay là đoàn khác: 60 khách của một ngân hàng, đi Nha Trang, check-in 14:00.\n\nChị Ngân đã giữ 30 phòng từ tháng trước. Có email xác nhận. Có cả số phòng.',
    chatStart: [
      ['hai', '(tối qua) Team building xong rồi!', false],
    ],
    steps: [
      {
        who: 'hai', obj: 'Anh Hải về văn phòng kể chuyện team building', time: '08:40', pos: { hai: 'x2' },
        scene: [
          ['hai', 'Anh về chuyến sớm để lấy đồ cho đoàn tuần sau. Kể nhanh team building hôm qua!'],
          { if: F('risky_game'), then: [
            ['hai', 'Cướp cờ trên cát! Rất máu lửa! Một anh trật mắt cá. Anh cõng anh ấy đi trạm y tế. Anh Thắng không cười.'],
            { fx: { dr: 3, uy: -2, rel: { thang: -1 } } },
          ] },
          { if: (s) => !s.flags.risky_game && !!s.flags.safe_games, then: [
            ['hai', 'Mật thư, rung chuông vàng, xếp tháp ly! Ba anh đau lưng giành giải nhất xếp tháp! Anh Thắng khóc vì vui!'],
            { fx: { uy: 3, rel: { thang: 1, khoa: 1 } } },
          ] },
          { if: (s) => !s.flags.risky_game && !s.flags.safe_games, then: [
            ['hai', 'Nhảy bao bố trên cát lúc một giờ chiều. Cát nóng. Khách nhảy rất nhanh. Không phải vì vui.'],
            { fx: { dr: 2 } },
          ] },
          { if: F('first_aid'), then: [['hai', 'Túi sơ cứu dùng hết hai miếng băng cá nhân. Đội cổ vũ hét to hơn đội chơi. Anh thích.']] },
          { c: 'e17_hai', o: [
            { t: 'Ghi lại để làm "bài học kinh nghiệm" cho kịch bản sau.', fx: { uy: 1, rel: { khoa: 1 } }, then: [['hai', 'Khoa sẽ đọc. Khoa sẽ buồn. Rồi Khoa sẽ nghĩ ra trò mới. Ướt hơn.']] },
            { t: 'Mời anh Hải ly cà phê, anh mới đi ba ngày.', fx: { rel: { hai: 2 }, money: -25_000 }, then: [['hai', 'CẢM ƠN EM! …Xin lỗi. Cảm ơn em.']] },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân dạy đọc hợp đồng allotment', time: '10:00',
        scene: [
          ['ngan', 'Đoàn ngân hàng chiều nay check-in. Chị linh cảm. Linh cảm booking không bao giờ sai.'],
          ['ngan', 'Em đọc hợp đồng với khách sạn đi. Điều khoản quan trọng luôn nằm ở trang 9.'],
          { mini: ALLOTMENT_MINI,
            good: [['ngan', 'Đúng. Khách sạn phải bố trí phòng tương đương và chịu xe đưa đón. Em nhớ câu đó. Chiều nay có thể cần.'], { fx: { uy: 2, rel: { ngan: 2 }, set: { knows_contract: true } } }],
            bad: [['ngan', '"Release date" không phải ngày ra mắt. Thôi, chiều nay chị nói, em nghe.'], { fx: { nl: -2 } }],
          },
        ],
      },
      {
        who: 'call:diem', obj: 'Chị Diễm (Biển Xanh Resort) gọi!', time: '14:10',
        call: { title: 'Biển Xanh Resort · Đoàn ngân hàng 60 pax', people: ['diem', 'ngan', 'me'] },
        scene: [
          ['diem', 'Dạ em chào chị Ngân. Bên em rất xin lỗi. Đoàn trước gia hạn thêm một đêm. Bên em thiếu 8 phòng ạ.'],
          ['diem', 'Bên em đề xuất 16 khách ghép phòng ba, có giường phụ, tặng nước suối.'],
          ['ngan', '(tắt mic) Linh cảm. Không bao giờ sai.'],
          ['think', '16 khách ngân hàng. Ghép phòng ba. Với nước suối.'],
          { c: 'e17_overbook', o: [
            { t: '"Theo hợp đồng, chị bố trí 8 phòng tương đương ở khách sạn gần nhất, có xe đưa đón, bên chị chịu ạ."', fx: { uy: 4, rel: { ngan: 2, diem: -1 }, set: { overbook_fixed: true } }, then: [
              { if: F('knows_contract'), then: [['me', 'Điều 7.3, trang 9 ạ. Bên em có email xác nhận số phòng ngày 12 tháng trước.'], ['diem', '…Dạ. Em gửi khách sạn kế bên, cùng hạng, xe điện đưa đón. Bên em chịu.']], else: [['diem', 'Dạ… điều khoản nào ạ?'], ['ngan', 'Trang 9 em ơi. 7.3. Em mở ra đi.'], ['diem', 'Dạ… vâng. Bên em chịu.']] },
            ] },
            { t: 'Chấp nhận ghép phòng, xin thêm buffet tối miễn phí.', fx: { rel: { diem: 1 }, dr: 3 }, then: [['ngan', 'Ngân hàng ghép phòng ba. Chị cá là tối nay có 16 email khiếu nại. Bằng tiếng Anh.']] },
            { t: 'Cho 8 phòng của đội nhân sự công ty (HDV, PG, kỹ thuật) dời sang nhà nghỉ, khách giữ nguyên.', fx: { uy: 2, rel: { hai: -1, diem: 1 }, set: { overbook_fixed: true, staff_motel: true } }, then: [['ngan', 'Khách không biết gì. Đội mình ngủ nhà nghỉ có quạt trần. Ừ, đó là nghề.']] },
          ] },
        ],
      },
      {
        who: 'bich', obj: 'Cô Bích hỏi: chi phí phát sinh ai chịu?', time: '16:30',
        scene: [
          ['bich', 'Cô nghe có vụ hết phòng. Chi phí phát sinh, ai chịu? Có biên bản không?'],
          { if: F('staff_motel'), then: [['bich', 'Nhà nghỉ cho đội mình: 8 phòng, 2 đêm. Ai ký? Hóa đơn đỏ đâu?']] },
          { c: 'e17_bich', o: [
            { t: 'Gửi cô email xác nhận của khách sạn và biên bản phát sinh.', fx: { uy: 2, rel: { bich: 2 } }, then: [['bich', 'Có email, có biên bản. Cô thích những người như em. Cô không nói ra, nhưng cô thích.']] },
            { t: '"Dạ để em hỏi lại chị Ngân ạ."', fx: { rel: { bich: -1 }, nl: -2 }, then: [['bich', 'Hỏi đi. Nhưng lần sau, em là người có biên bản trong tay trước khi cô hỏi.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 17. ${s.flags.overbook_fixed ? 'Khách sạn thiếu 8 phòng, nhưng không khách nào phải ghép phòng ba.' : 'Mười sáu khách ngân hàng ghép phòng ba. Có nước suối.'} ${s.flags.knows_contract ? 'Trang 9, điều 7.3. Mình sẽ nhớ suốt đời.' : ''}`,
  },

  {
    id: 'mc_sick', day: 18, title: 'MC mất giọng. Em lên.',
    intro: 'Thứ Năm. Hội nghị khách hàng của Bê Tông Vững Chãi, 18:30, ballroom khách sạn. 200 khách.\n\nMC Khải đã ký hợp đồng. Chị Kiều là MC dự bị.\n\n8:40. Có một cuộc gọi. Giọng bên kia nghe như cái máy trộn bê tông.',
    steps: [
      {
        who: 'call:khai', obj: 'MC Khải gọi (bằng giọng còn lại)', time: '08:40',
        call: { title: 'MC Khải · "giọng ấm"', people: ['khai', 'duy', 'me'] },
        scene: [
          ['khai', '…khục… anh… mất giọng… tối qua… dẫn ba đám cưới… khục…'],
          ['duy', 'Copy. Anh nghe được chữ "mất". Đủ rồi. Nghỉ đi Khải.'],
          ['duy', 'Chị Kiều dự bị. Anh đi hỏi chị.'],
          { fx: { nl: -2 } },
        ],
      },
      {
        who: 'kieu', obj: 'Qua phòng chị Kiều', time: '09:30',
        scene: [
          ['nar', 'Chị Kiều ngồi quấn khăn quàng cổ, cầm một tờ giấy A4 viết sẵn chữ to: "CHỊ CŨNG MẤT GIỌNG".'],
          { if: F('gala_saved'), then: [['nar', 'Tờ thứ hai: "HÉT TRONG MƯA Ở GALA. ĐÁNG."']], else: [['nar', 'Tờ thứ hai: "KARAOKE. ĐỪNG HỎI."']] },
          ['nar', 'Tờ thứ ba chị viết ngay trước mặt bạn: "EM. LÊN."'],
          ['duy', 'Chị Kiều chọn em. Anh thì… anh tin em đọc run-sheet được.'],
          { if: F('tie_vy_huong'), then: [['vy', '(nhỏ) Cô mình là chị Hường bên khách. Cô bảo anh Quang thích MC trẻ. Bạn lên đi.'], ['think', 'Vy là cháu chị Hường. Cái này giải thích nhiều chuyện.']] },
          ['nar', 'Rồi chị Kiều giơ tờ thứ tư: "CHÁU ANH QUANG CŨNG MUỐN LÀM MC. SINH VIÊN. HỌC MC 2 BUỔI."'],
          { c: 'e18_mc', o: [
            { t: '"Dạ, em lên ạ."', fx: { uy: 2, rel: { kieu: 2, duy: 1 }, set: { mc_path: 'solo' } }, then: [['nar', 'Chị Kiều viết: "TỐT. 3 GIỜ CHIỀU. PHÒNG HỌP. LỚP CẤP TỐC."']] },
            { t: '"Em lên làm MC chính, mời cháu anh Quang làm MC phụ phần bốc thăm ạ."', fx: { uy: 3, rel: { kieu: 2, quang: 1 }, set: { mc_path: 'duo' } }, then: [['nar', 'Chị Kiều đứng dậy, vỗ tay không ra tiếng. Viết: "KHÔN. KHÁCH VUI. EM AN TOÀN."']] },
            { t: '"Em nghĩ Vy hợp hơn ạ, Vy quay TikTok nói rất tự nhiên."', fx: { rel: { vy: 2, kieu: -1 }, set: { mc_path: 'vy' } }, then: [['vy', 'Mình?! …Ok. Ok ok. Bạn phải cầm run-sheet đứng cạnh mình cả tối.'], ['nar', 'Chị Kiều viết: "ĐƯỢC. NHƯNG EM LO CUE."']] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy đưa run-sheet', time: '11:00',
        scene: [
          ['duy', 'Run-sheet. Mỗi phần có cue nhạc, cue đèn, người lên sân khấu. Em xếp lại cho anh, bản này bị Thảo sửa lúc nửa đêm.'],
          { mini: RUNSHEET_MINI,
            good: [['duy', 'Copy. Chủ tịch phát biểu trước tri ân. Bốc thăm cuối để khách ở lại. Em hiểu run-sheet.'], { fx: { uy: 3, rel: { duy: 2 }, set: { runsheet_ok: true } } }],
            bad: [['duy', 'Bốc thăm trước tiệc thì khách trúng xong là về. Không ai nghe Chủ tịch. Sửa lại.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'obj:interview', obj: 'Lớp MC cấp tốc trong phòng họp', time: '15:00', seat: 'mr_seat', pos: { kieu: 'meeting_head', vy: 'mr_n1' },
        scene: [
          ['nar', 'Chị Kiều đứng đầu bàn, cầm micro tắt, ra hiệu bằng tay như nhạc trưởng.'],
          { if: is('mc_path', 'vy'), then: [['vy', 'Mình dẫn, bạn trả lời giúp mình mấy câu này nha. Tay mình run quá.']] },
          { mini: MC_MINI,
            good: [
              ['nar', 'Chị Kiều gật đầu ba lần. Viết: "GIỌNG ĐƯỢC. NHỊP ĐƯỢC. ĐỪNG NÓI XIN MỘT TRÀNG PHÁO TAY QUÁ 3 LẦN."'],
              { fx: { uy: 3, rel: { kieu: 2 }, set: { mc_ready: true } } },
            ],
            bad: [
              ['nar', 'Chị Kiều viết: "RUN. NHƯNG ĐƯỢC. KHÁCH KHÔNG NHỚ LỜI, KHÁCH NHỚ THÁI ĐỘ."'],
              { fx: { nl: -4 } },
            ],
          },
        ],
      },
      {
        who: 'call:duy', obj: 'Bộ đàm từ ballroom: show bắt đầu', time: '17:50',
        call: { title: '📻 Kênh Sân Khấu · Hội nghị khách hàng', people: ['duy', 'quang', 'quan', 'me'] },
        scene: [
          ['duy', 'Standby. Đèn tắt. Nhạc lên. Go.'],
          { if: is('mc_path', 'vy'), then: [
            ['nar', 'Vy cầm micro. Bạn đứng trong cánh gà, cầm run-sheet, thì thầm từng cue qua tai nghe.'],
            ['vy', 'Kính thưa quý vị… (cue tiếp đi bạn)… xin mời Chủ tịch Hội đồng quản trị!'],
          ], else: [
            ['nar', 'Bạn bước ra. Đèn chiếu vào mặt. Hai trăm khuôn mặt. Một cái micro. Tay bạn lạnh.'],
            ['me', 'Kính thưa quý vị đại biểu, kính thưa quý khách hàng thân thiết của Bê Tông Vững Chãi…'],
          ] },
          ['quang', '(giữa chương trình, nói vọng lên) Thêm một bài! Anh hát tặng khách hàng! "Bê tông và em"!'],
          ['quan', '(bộ đàm) Không có beat bài đó. Không có. Bài đó không tồn tại.'],
          { c: 'e18_song', o: [
            { t: 'Mời anh Quang lên, xin ban nhạc đệm guitar mộc, cả hội trường vỗ tay theo nhịp.', fx: { uy: 4, rel: { quang: 2, duy: 1 } }, then: [['nar', 'Anh Quang hát lạc nhịp. Hai trăm người vỗ tay đúng nhịp. Không ai biết bài đó là gì. Ai cũng vui.']] },
            { t: '"Dạ, mình để phần anh hát vào bữa tiệc thân mật sau chương trình ạ!"', fx: { uy: 2, rel: { quang: -1, duy: 2 } }, then: [['duy', '(bộ đàm) Giữ được giờ. Copy. Nhà hàng không phạt quá giờ.']] },
          ] },
          { if: (s) => s.flags.mc_path !== 'vy' && (!!s.flags.mc_ready || !!s.flags.runsheet_ok), then: [{ fx: { set: { mc_hosted: true } } }, ['duy', '(bộ đàm) Hết show. Đúng giờ. Khách khen MC. MC là em. Copy.']] },
          { if: (s) => s.flags.mc_path !== 'vy' && !s.flags.mc_ready && !s.flags.runsheet_ok, then: [['duy', '(bộ đàm) Hết show. Trễ 25 phút. Em gọi nhầm tên một đại biểu. Nhưng em đứng vững. Copy.']] },
          { if: is('mc_path', 'vy'), then: [['duy', '(bộ đàm) Vy dẫn ổn. Cue của em không trễ cái nào. Copy.'], { fx: { rel: { vy: 1, duy: 1 } } }] },
        ],
      },
    ],
    diary: (s) => `Ngày 18. MC Khải mất giọng, chị Kiều cũng mất giọng. ${s.flags.mc_hosted ? 'Mình cầm micro trước 200 khách. Anh Duy nói "khách khen MC".' : s.flags.mc_path === 'vy' ? 'Vy dẫn, mình lo cue trong cánh gà.' : 'Mình dẫn. Gọi nhầm tên một đại biểu. Mình sẽ mơ thấy cái tên đó.'} Anh Quang hát một bài không tồn tại.`,
  },

  {
    id: 'lost_id', day: 22, title: 'Mất giấy tờ ở sân bay',
    intro: 'Thứ Hai. Đoàn 40 khách của Bảo Hiểm An Tâm bay Phú Quốc lúc 10:15.\n\nAnh Hải ở sân bay từ 6 giờ. Chị Ngân và bạn trực ở văn phòng, nhìn màn hình như nhìn đồng hồ bom.',
    steps: [
      {
        who: 'call:hai', obj: 'Anh Hải gọi từ sân bay!', time: '08:30',
        call: { title: '✈️ Sân bay · Đoàn An Tâm 40 pax', people: ['hai', 'ngan', 'me'] },
        scene: [
          ['hai', 'BA MƯƠI CHÍN KHÁCH ĐÃ LÀM THỦ TỤC! KHÁCH THỨ BỐN MƯƠI: TỔNG GIÁM ĐỐC! MẤT VÍ! CĂN CƯỚC NẰM TRONG VÍ!'],
          ['hai', 'Anh ấy tên "An Tâm". Ý anh là công ty tên An Tâm. Anh ấy không an tâm chút nào.'],
          ['ngan', 'Còn 1 tiếng 45 phút tới giờ đóng quầy.'],
          { fx: { nl: -3 } },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân bày phương án', time: '08:45',
        scene: [
          ['ngan', 'Bay nội địa mà mất căn cước thì thường có mấy cách: định danh điện tử trên ứng dụng, hoặc giấy xác nhận nhân thân. (thông tin giải trí, không phải tư vấn pháp lý)'],
          ['ngan', 'Đổi chuyến sau thì mất phí, mà gala tối nay của họ lúc 19:00 ở Phú Quốc.'],
          { if: F('knows_pnr'), then: [['ngan', 'Em nhớ hôm đầu chị nói không? Vé đã xuất rồi. Đổi là mất tiền thật. Không phải hold.']] },
          { c: 'e22_id', o: [
            { t: 'Hướng dẫn anh Hải giúp khách mở định danh điện tử trên điện thoại, đồng thời gọi quầy hỏi trước.', fx: { uy: 3, rel: { ngan: 1, hai: 1 }, set: { id_app: true } }, then: [['ngan', 'Đúng. Làm song song. Chị gọi quầy, em nói với anh Hải.']] },
            { t: 'Đổi khách sang chuyến chiều, có người đi cùng.', fx: { uy: 1, rel: { ngan: 1 } }, then: [['ngan', 'Chuyến 14:30. Phí đổi 900 nghìn. Ai trả thì tính sau. Chị giữ chỗ.']] },
          ] },
        ],
      },
      {
        who: 'call:hai', obj: 'Anh Hải gọi lại: có vấn đề mới', time: '09:20',
        call: { title: '✈️ Sân bay · quầy làm thủ tục', people: ['hai', 'me'] },
        scene: [
          { if: F('id_app'), then: [
            ['hai', 'Ứng dụng có! Nhưng anh ấy quên mật khẩu! Mã OTP gửi về điện thoại! Điện thoại còn 2% pin!'],
            { c: 'e22_otp', o: [
              { t: '"Anh Hải mang sạc dự phòng không? Cắm ngay, đứng sát quầy!"', fx: { uy: 3, rel: { hai: 2 }, set: { lost_id_hero: true } }, then: [
                { if: F('vy_tips'), then: [['think', 'Mẹo của Vy: luôn mang sạc dự phòng. Anh Hải cũng biết mẹo đó.']] },
                ['hai', 'Anh luôn mang hai cục sạc! Một cái để dùng, một cái cho khách! CẮM RỒI! OTP VỀ! VÀO ĐƯỢC!'],
                ['nar', '9:41. Tổng Giám đốc An Tâm qua cửa an ninh. Anh ấy quay lại bắt tay anh Hải hai lần.'],
              ] },
              { t: 'Gọi quầy, xin hướng dẫn thủ tục xác nhận nhân thân tại chỗ.', fx: { uy: 2, clock: 20 }, then: [['hai', 'Họ hướng dẫn rồi! Mất 25 phút! Anh ấy qua cửa lúc 9:58! Kịp sát nút!'], { fx: { set: { lost_id_hero: true } } }] },
            ] },
          ], else: [
            ['hai', 'Đoàn 39 người bay trước. Anh ấy bay chuyến chiều với em CTV. Anh ấy không vui, nhưng tối nay vẫn kịp gala.'],
            { fx: { rel: { hai: 1 } } },
          ] },
        ],
      },
      {
        who: 'ngan', obj: 'Chị Ngân: PNR đoàn tuần sau sắp hết hạn', time: '11:00',
        scene: [
          ['ngan', 'Xong vụ sân bay chưa kịp thở. Đoàn 30 khách tuần sau: hold hết hạn lúc 11:30. Khách còn đổi 2 tên mà chưa gửi.'],
          ['ngan', 'Hết hạn là giá mới, đắt hơn 1,2 triệu một vé. Ba mươi vé. Em tự nhân.'],
          { c: 'e22_pnr', o: [
            { t: 'Gọi thẳng HR khách, xin chốt 2 tên trong 15 phút, rồi xuất vé.', fx: { uy: 4, rel: { ngan: 2 }, set: { pnr_ok: true } }, then: [['ngan', '11:24. Xuất. Chị không uống cà phê, nhưng chị muốn uống mừng.']] },
            { t: 'Xuất vé với tên cũ, đổi tên sau (mất phí đổi).', fx: { uy: 1, rel: { ngan: 1 } }, then: [['ngan', 'Phí đổi tên rẻ hơn mất cả 30 vé. Không đẹp, nhưng đúng.']] },
            { t: 'Chờ khách gửi tên.', fx: { dr: 3, rel: { ngan: -1 } }, then: [['nar', '11:31. Màn hình chuyển đỏ. Chị Ngân nhắm mắt lại, rất lâu.'], ['ngan', 'Chị sẽ nói với chị Kiều. Lần này không phải lỗi em. Nhưng lần sau em là người gọi khách.']] },
          ] },
        ],
      },
      {
        who: 'thao', obj: 'Chị Thảo có tin vui (và một chữ "nhưng")', time: '15:00',
        scene: [
          { if: F('lost_id_hero'), then: [
            ['thao', 'Tổng Giám đốc An Tâm vừa gọi chị! Anh ấy muốn ký luôn year-end party với mình! Anh ấy hỏi "cái anh cầm cờ với cái em trực văn phòng là ai".'],
          ], else: [
            ['thao', 'Bên An Tâm muốn bàn year-end party. Hơi lăn tăn vụ sân bay, nhưng vẫn muốn nghe báo giá.'],
          ] },
          ['thao', 'Nhưng… anh ấy muốn "giá như năm nay của công ty kia". Rẻ hơn mình 20%. Chị suýt nói "dạ được ạ".'],
          { c: 'e22_price', o: [
            { t: '"Chị ơi, mình báo đúng giá, kèm phương án gói gọn hơn nếu anh ấy muốn giảm ạ."', fx: { uy: 3, rel: { thao: 1, bich: 1 } }, then: [['thao', 'Hai phương án. Ừ. Em với Mỹ làm giúp chị. Chị sẽ cố không nói "dạ được ạ" trong 24 giờ.']] },
            { t: '"Dạ được ạ chị."', fx: { rel: { thao: 2 }, dr: 2 }, then: [['nar', 'Chị Thảo ôm bạn. Ở phòng kế toán, cô Bích ngẩng đầu lên như nghe thấy gì đó.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 22. ${s.flags.lost_id_hero ? 'Tổng Giám đốc An Tâm qua cửa an ninh nhờ một cục sạc dự phòng.' : 'Tổng Giám đốc An Tâm bay chuyến chiều.'} ${s.flags.pnr_ok ? 'Ba mươi vé xuất lúc 11:24.' : ''} Chị Ngân suýt uống cà phê.`,
  },

  {
    id: 'invoice_dispute', day: 24, title: 'Nghiệm thu: ai trả tiền rạp?',
    intro: 'Thứ Tư. Hai tuần sau gala 25 năm. Bê Tông Vững Chãi mới thanh toán đợt 1.\n\nHôm nay là buổi nghiệm thu. Theo kinh nghiệm của cô Bích, "nghiệm thu" là từ lịch sự của "cãi nhau về tiền".',
    steps: [
      {
        who: 'bich', obj: 'Cô Bích rà chi phí gala', time: '09:00',
        scene: [
          ['bich', 'Cô rà xong chi phí gala. Em ngồi đây. Cô đọc, em nghe.'],
          { if: is('rain_tent', 'self'), then: [['bich', 'Rạp 8 triệu. Công ty tự cọc. Khách chưa ký duyệt. Cô cần bằng chứng là khách đồng ý, hoặc 8 triệu này là của mình.']] },
          { if: is('extra50', 'free'), then: [['bich', '50 suất ăn thêm. Không có báo giá bổ sung. Khách sẽ nói "em đồng ý rồi mà". Đúng, mình đồng ý thật.'], { fx: { uy: -2 } }] },
          { if: is('extra50', 'quoted'), then: [['bich', '50 suất ăn thêm: có báo giá bổ sung, có email chị Hường "ok em". Tốt. Cái này đòi được.'], { fx: { uy: 2, rel: { bich: 1 } } }] },
          { if: is('fireworks', 'real'), then: [['bich', 'Dòng "Pháo hoa thật x1". Không ai bắn. Khách sẽ đòi trừ. Ai viết dòng này?'], ['think', 'Mình.']] },
          { if: is('backdrop_plan', 'rush'), then: [['bich', 'In gấp 3 triệu. Có email anh Quang đổi ý lúc 23:07. Cái này ghi phát sinh khách chịu.']] },
          { c: 'e24_prep', o: [
            { t: 'Gom đủ email, ảnh chụp màn hình, biên bản cho từng khoản.', fx: { nl: -6, uy: 3, rel: { bich: 2 }, set: { evidence: true } }, then: [['bich', 'Mỗi khoản một bằng chứng. Thế này cô mới dám ngồi với khách.']] },
            { t: '"Khách quý mình mà cô, chắc họ không cãi đâu ạ."', fx: { rel: { bich: -1 } }, then: [['bich', 'Khách quý mình lúc mình làm show. Lúc trả tiền thì khách quý tiền.']] },
          ] },
        ],
      },
      {
        who: 'call:huong', obj: 'Chị Hường gọi Teams nghiệm thu', time: '10:30',
        call: { title: 'Nghiệm thu Gala 25 năm', people: ['huong', 'thao', 'bich', 'me'] },
        scene: [
          ['huong', 'Bên chị ghi nhận gala rất thành công. Anh Quang rất vui. Nên bên chị đề nghị… giảm 10% tổng.'],
          { if: is('rain_tent', 'self'), then: [['huong', 'Rạp thì bên chị không duyệt, nên bên chị không trả.']] },
          { if: (s) => s.flags.rain_tent === 'self' && !!s.flags.evidence, then: [
            ['me', 'Dạ, lúc 16:40 trời mưa, rạp che cho 300 khách. Em có ảnh, có tin nhắn anh Quang khen "mưa mà vui" ạ.'],
            ['huong', '…Ừ. Không có rạp thì anh Quang ướt. Bên chị trả 70%, coi như chia sẻ.'],
            { fx: { uy: 3, rel: { huong: 1 } } },
          ] },
          ['huong', 'À, còn một chuyện nhỏ. Hóa đơn em xuất cao hơn thực tế 40 triệu giúp chị nhé. Phần chênh bên chị "chi khác". Ai cũng làm vậy mà.'],
          ['bich', '(tắt mic, nhìn bạn) …'],
          { if: F('tie_vy_huong'), then: [['think', 'Cô của Vy. Mình sẽ không kể với Vy. Hoặc sẽ kể. Để sau.']] },
          { c: 'e24_invoice', o: [
            { t: '"Dạ, bên em chỉ xuất hóa đơn đúng giá trị thực tế ạ. Em xin phép báo chị Kiều."', fx: { uy: 5, rel: { bich: 3, huong: -2, thao: -1 }, set: { clean_invoice: true } }, then: [
              ['huong', 'Ừ… thôi, chị hỏi chơi thôi. Em nghiêm túc ghê.'],
              ['bich', '(nhắn riêng) Cô đã làm kế toán 30 năm. Câu đó cô nói 30 năm. Hôm nay có người nói thay cô.'],
            ] },
            { t: '"Dạ, để cô Bích quyết ạ."', fx: { rel: { bich: -1, huong: 1 } }, then: [
              ['bich', 'Không. Cô không xuất. Cô không bao giờ xuất.'],
              ['huong', 'Ơ… vậy thôi. Mà em cũng không nói gì nhỉ.'],
              ['think', 'Chị Hường sẽ nghĩ cô Bích là người xấu. Còn mình thì trốn sau lưng cô.'],
              { fx: { set: { clean_invoice: true } } },
            ] },
            { t: '"Dạ được ạ chị."', fx: { dr: 6, uy: -5, rel: { huong: 2, bich: -4 }, set: { dirty_invoice: true } }, then: [
              ['bich', 'Em vừa nói "dạ được" thay cho phòng kế toán. Cô sẽ báo chị Kiều. Và cô sẽ không xuất.'],
            ] },
          ] },
        ],
      },
      {
        who: 'kieu', obj: 'Chị Kiều gọi vào phòng', time: '14:00',
        scene: [
          { if: F('dirty_invoice'), then: [
            ['kieu', 'Cô Bích kể chị nghe rồi. Em biết vì sao chị dẫn gala 15 năm mà không ai nói xấu chị không? Chị chưa bao giờ ký cái gì sai.'],
            ['kieu', 'Lần này chị coi như em là intern. Lần sau thì không có "intern" nữa.'],
            { fx: { rel: { kieu: -2 } } },
          ], else: [
            ['kieu', 'Chị nghe chuyện hóa đơn. Mất 40 triệu doanh thu ảo, giữ được một cái tên thật. Chị lời.'],
            { fx: { rel: { kieu: 2 } } },
          ] },
          ['kieu', 'Giờ chuyện giảm 10%. Em là người theo show từ đầu. Em đề xuất đi.'],
          { c: 'e24_discount', o: [
            { t: '"Mình giảm 3% kèm tặng khách bộ ảnh và clip highlight, đổi lại khách thanh toán trong 7 ngày ạ."', fx: { uy: 4, rel: { kieu: 2, bich: 1 } }, then: [['kieu', 'Giảm ít, tặng thứ không tốn tiền, đổi lấy tiền về sớm. Em đang nói giống chị năm 2012.']] },
            { t: '"Mình giảm 10% để giữ khách năm sau ạ."', fx: { rel: { thao: 1, bich: -1 } }, then: [['kieu', 'Giữ khách bằng cách mất lời. Chị từng làm thế. Năm sau khách vẫn đòi giảm 10%. Ghi nhớ.']] },
          ] },
        ],
      },
      {
        who: 'toan', obj: 'Anh Toàn: vendor gọi đòi tiền', time: '16:00',
        scene: [
          ['toan', 'Anh Tư rạp, anh Lộc xe, chị Hoa hoa. Ba người gọi anh hôm nay. Khách chưa trả, mình chưa trả. Nghề này là một chuỗi chờ.'],
          { c: 'e24_vendor', o: [
            { t: 'Đề xuất cô Bích trả trước 50% cho vendor nhỏ nhất, hẹn ngày rõ cho phần còn lại.', fx: { uy: 2, rel: { toan: 2, bich: 1 } }, then: [['toan', 'Anh Tư rạp là người cứu gala. Trả anh ấy trước. Em hiểu nghề rồi đấy.']] },
            { t: 'Nhắn vendor: "Tuần sau bên em chuyển ạ."', fx: { dr: 2, rel: { toan: -1 } }, then: [['toan', 'Tuần sau. Câu đó anh nói ba năm rồi. Vendor bắt đầu không tin anh. Giờ tới em.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 24. Nghiệm thu. ${s.flags.dirty_invoice ? 'Mình nói "dạ được" với hóa đơn khống. Cô Bích không xuất. Chị Kiều không vui.' : 'Mình không xuất hóa đơn khống. Cô Bích nhắn cho mình một tin dài nhất từ trước tới giờ.'} ${s.flags.evidence ? 'Mỗi khoản một bằng chứng.' : ''}`,
  },

  {
    id: 'pitch_war', day: 29, title: 'Đấu thầu year-end: rẻ hơn 10%',
    intro: 'Thứ Hai. Bê Tông Vững Chãi mở thầu year-end party tháng 12. 500 khách.\n\nĐối thủ: "Sự Kiện Rẻ Vô Địch". Họ báo rẻ hơn 10%. Họ luôn rẻ hơn 10%. Không ai biết họ sống bằng gì.',
    steps: [
      {
        who: 'thao', obj: 'Chị Thảo họp chiến lược đấu thầu', time: '09:00',
        scene: [
          ['thao', 'Chiến lược của chị: giảm 15%, thêm ca sĩ, thêm pháo, thêm photobooth 360. Mình "dạ được ạ" nhiều hơn họ!'],
          ['my', '(nhỏ) Lần trước "dạ được ạ nhiều hơn" thì mình lỗ 4 triệu.'],
          { if: official, then: [['thao', 'Giờ em là nhân viên chính thức rồi, em đứng tên proposal này luôn nha.']] },
          { c: 'e29_strategy', o: [
            { t: '"Mình không đua giá, mình bán cái họ không có: đội đã cứu gala 25 năm trong mưa."', when: F('gala_saved'), fx: { uy: 3, rel: { thao: 1, kieu: 1 }, set: { pitch_story: true } }, then: [['thao', 'Ừ ha! Anh Quang nhắc vụ mưa hoài! Mình kể lại câu chuyện đó!']] },
            { t: '"Mình giảm 5%, bỏ pháo, giữ chất lượng âm thanh ánh sáng ạ."', fx: { uy: 2, rel: { duy: 1 } }, then: [['thao', 'Giảm 5% thôi hả… Ừ, chắc được. Em thuyết phục chị đi.']] },
            { t: '"Dạ, mình theo chiến lược của chị ạ."', fx: { rel: { thao: 2 }, dr: 1 }, then: [['my', '(nhỏ) Mình mở file Excel cho bạn xem số lỗ nha.']] },
          ] },
        ],
      },
      {
        who: 'my', obj: 'Cùng Mỹ dựng proposal', time: '10:30',
        scene: [
          ['my', 'Proposal 40 trang. Khách đọc 3 trang đầu rồi lật thẳng tới trang giá. Xếp sao cho 3 trang đầu đáng đọc.'],
          { mini: PROPOSAL_MINI,
            good: [['my', 'Brief, concept, kịch bản. Ba trang đầu là ba lý do để không lật tới trang giá vội. Bạn hiểu khách ghê.'], { fx: { uy: 3, rel: { my: 2 }, set: { proposal_ok: true } } }],
            bad: [['my', 'Bạn để báo giá lên trang 2. Khách sẽ lật tới đó đầu tiên. Rồi đóng file.'], { fx: { nl: -3 } }],
          },
        ],
      },
      {
        who: 'tien', obj: 'Anh Tiến cần tên concept', time: '11:30',
        scene: [
          ['tien', 'Concept năm nay. Đừng nói "Together We Rise". Anh làm "Together We Rise" bốn năm liền rồi.'],
          { c: 'e29_concept', o: [
            { t: '"Vững Chãi Trong Mọi Thời Tiết" (từ đêm gala mưa).', fx: { uy: 3, rel: { tien: 2 }, set: { concept_rain: true } }, then: [['tien', 'Có câu chuyện. Có cảm xúc. Có cái ô làm key visual. Anh thích.']] },
            { t: '"Bê Tông Hóa Ước Mơ 2027".', fx: { rel: { tien: -1 }, dr: 1 }, then: [['tien', '…Anh Quang sẽ thích. Anh sẽ không bao giờ đưa cái này vào portfolio.']] },
            { t: '"Together We Rise 2027".', fx: { rel: { tien: -2 } }, then: [['nar', 'Anh Tiến đội mũ len trùm kín mắt, gõ "Together We Rise" lần thứ năm trong sự nghiệp.']] },
          ] },
        ],
      },
      {
        who: 'call:quang', obj: 'Thuyết trình với anh Quang (Teams)', time: '15:00',
        call: { title: 'Pitching Year-End 2026 · Bê Tông Vững Chãi', people: ['quang', 'huong', 'kieu', 'thao', 'me'] },
        scene: [
          ['kieu', 'Xin chào anh Quang! Hôm nay em để bạn trẻ trình bày. Em chỉ ngồi nghe. Em hứa.'],
          ['quang', 'Bên kia rẻ hơn 10%. Em nói anh nghe tại sao anh nên trả nhiều hơn.'],
          { c: 'e29_pitch', o: [
            { t: 'Kể lại đêm gala mưa: rạp dựng lúc 16:20, 300 khách khô ráo, rồi mở concept mới.', when: F('gala_saved'), fx: { uy: 4, rel: { quang: 2 }, set: { pitch_won: true } }, then: [
              ['quang', 'Đêm đó anh nhớ. Bên kia thì anh không biết họ làm gì khi trời mưa. Anh không muốn biết.'],
              ['huong', 'Anh Quang chốt rồi đó em.'],
            ] },
            { t: 'Trình bày bảng so sánh hạng mục: rẻ hơn 10% là thiếu những gì.', fx: { uy: 3, rel: { quang: 1, huong: 1 } }, then: [
              { if: F('proposal_ok'), then: [['quang', 'Họ không có máy phát điện dự phòng? Không có rạp mưa? Ừ… anh hiểu rồi.'], { fx: { set: { pitch_won: true } } }], else: [['quang', 'Số liệu nhiều quá. Anh suy nghĩ thêm.']] },
            ] },
            { t: '"Dạ, bên em giảm 15% luôn ạ."', fx: { rel: { quang: 1, bich: -2, thao: 1 }, set: { pitch_won: true, pitch_cheap: true } }, then: [['quang', 'Giảm 15% hả? Chốt! Anh thích những người dễ chịu.'], ['bich', '(nhắn riêng) Em vừa chốt một show lỗ. Cô ghi sổ.']] },
          ] },
          { if: F('concept_rain'), then: [['quang', 'Với lại cái tên "Vững Chãi Trong Mọi Thời Tiết". Anh muốn in lên áo đồng phục.']] },
        ],
      },
      {
        who: 'kieu', obj: 'Chị Kiều gọi vào sau buổi pitch', time: '17:30',
        scene: [
          { if: F('pitch_won'), then: [
            ['kieu', 'XIN MỘT TRÀNG PHÁO TAY! Year-end 500 khách! …Chị đếm rồi, đây là lần thứ ba trong ngày chị nói câu đó.'],
            { if: F('pitch_cheap'), then: [['kieu', 'Nhưng giảm 15% thì tháng 12 mình chạy show… để vui. Lần sau đừng giảm thay chị.']] },
            { fx: { rel: { kieu: 2 } } },
          ], else: [
            ['kieu', 'Anh Quang chưa chốt. Bên kia rẻ hơn. Chị quen rồi. Năm nào cũng có một bên rẻ hơn.'],
          ] },
          { c: 'e29_end', o: [
            { t: '"Chị ơi, em học được nhiều nhất từ đêm gala mưa."', fx: { rel: { kieu: 1 } }, then: [['kieu', 'Chị cũng vậy. Năm 2009. Gala mưa. Chị dẫn trong mưa. Ướt, nhưng dẫn. Từ đó chị lập công ty này.']] },
            { t: 'Về bàn ghi lại mọi thứ vào "sổ case study".', fx: { uy: 2 }, then: [['nar', 'Bạn mở file mới: "CaseStudy_ĐĐCĐ.docx". Trang 1: "Mưa không phải sự cố. Mưa là kịch bản."']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 29. Đấu thầu year-end. ${s.flags.pitch_won ? (s.flags.pitch_cheap ? 'Thắng thầu, nhưng giảm 15%. Cô Bích ghi sổ.' : 'Thắng thầu mà không cần rẻ hơn.') : 'Anh Quang chưa chốt. Bên kia rẻ hơn 10%.'} ${s.flags.concept_rain ? 'Concept: "Vững Chãi Trong Mọi Thời Tiết".' : ''}`,
  },

  {
    id: 'lion_dance', day: 31, title: 'Con lân thiếu một người',
    intro: 'Thứ Tư. Thứ Sáu này khai trương showroom của Nội Thất Ngồi Mãi. Có múa lân.\n\nĐội lân cộng tác viên vừa báo: thiếu một người. Khúc đuôi.\n\nChị Kiều đang nhìn chiều cao của bạn.',
    steps: [
      {
        who: 'lan', obj: 'Chị Lan mang con lân từ kho lên', time: '09:00',
        scene: [
          ['lan', 'Đây. Con lân của công ty. Gãy sừng từ khai trương năm ngoái. Anh Quân dán rồi. Bằng băng keo đen.'],
          { if: F('tie_duy_lan'), then: [['lan', 'Hồi xưa chị với anh Duy dẫn đám cưới chung. Có lần cô dâu đòi múa lân. Anh Duy chui vào đầu lân. Chị ở đuôi.'], ['think', 'Anh Duy. Chị Lan. Đầu lân và đuôi lân. Mình không biết nên cười hay xúc động.']] },
          ['lan', 'Khúc đuôi không cần biết múa. Chỉ cần đi theo, khom lưng, và tin vào khúc đầu.'],
          { fx: { rel: { lan: 1 } } },
        ],
      },
      {
        who: 'kieu', obj: 'Chị Kiều có một "đề xuất"', time: '10:00',
        scene: [
          ['kieu', 'Em cao một mét sáu mấy? Vừa khúc đuôi. Chị đã múa đầu lân năm 2010. Bây giờ lưng chị là lưng của một CEO.'],
          { if: official, then: [['kieu', 'Em là nhân viên chính thức rồi. Nhân viên chính thức ở đây ai cũng từng làm đuôi lân một lần.']] },
          { c: 'e31_lion', o: [
            { t: '"Dạ, em làm đuôi lân ạ."', fx: { nl: -10, rel: { kieu: 2, khoa: 1 }, set: { lion_tail: true } }, then: [['kieu', 'TUYỆT! Xin một tràng pháo tay cho khúc đuôi!']] },
            { t: '"Em làm điều phối cue, chị Kiều làm đầu lân ạ."', fx: { rel: { kieu: -1, duy: 1 }, dr: 1 }, then: [['kieu', '…Lưng của CEO. Thôi được. Một lần cuối. Ai quay clip chị là chị trừ lương.'], ['vy', '(nhỏ) Mình sẽ quay.']] },
            { t: 'Đề xuất lân điện tử trên màn LED kết hợp trống thật.', fx: { uy: 2, rel: { quan: 2, kieu: -1 } }, then: [['quan', 'Lân LED! Không gãy sừng! Không đau lưng!'], ['kieu', 'Khách thích lân thật. Có hơi người. Nhưng thôi, ghi vào phương án B.'], { fx: { set: { lion_tail: true } } }] },
          ] },
        ],
      },
      {
        who: 'khoa', obj: 'Tập bài lân với Khoa', time: '14:00',
        scene: [
          ['khoa', 'Mình từng học múa lân ba tháng. Rồi chuyển sang làm quản trò. Lý do tương tự: không ai muốn đứng một mình.'],
          { if: F('lion_tail'), then: [['nar', 'Bạn chui vào khúc đuôi. Bên trong tối, mùi băng keo và mùi gala năm ngoái.']], else: [['nar', 'Bạn cầm run-sheet, Khoa đọc bài cho chị Kiều. Chị Kiều đội đầu lân, nhìn bạn đầy oán trách.']] },
          { mini: LION_MINI,
            good: [['khoa', 'Đúng nhịp! Hái lộc trước, nhả câu đối sau. Bạn có tố chất… khúc đuôi.'], { fx: { uy: 2, rel: { khoa: 2 }, set: { lion_ok: true } } }],
            bad: [['khoa', 'Lân nhả câu đối trước khi chào khách. Như MC nói "cảm ơn quý vị đã đến" ở đầu chương trình. Tập lại.'], { fx: { nl: -5 } }],
          },
        ],
      },
      {
        who: 'call:duy', obj: 'Anh Duy gọi từ showroom (khảo sát)', time: '16:30',
        call: { title: '📻 Khảo sát showroom Ngồi Mãi', people: ['duy', 'toan', 'me'] },
        scene: [
          ['duy', 'Chủ showroom muốn lân đi vào bằng… cửa sổ tầng hai. Vì "phong thủy, lộc vào từ trên cao".'],
          ['toan', 'Anh có xe nâng. Anh quen chú xe nâng. Nhưng anh không quen con lân nào đi xe nâng.'],
          { c: 'e31_window', o: [
            { t: '"Lân đi cửa chính, mình treo lộc ở cửa sổ tầng hai, lân nhảy lên hái. Lộc vẫn từ trên cao ạ."', fx: { uy: 4, rel: { duy: 2, toan: 1 } }, then: [['duy', 'Copy. An toàn, phong thủy, không ai rơi từ tầng hai. Em nghĩ như producer rồi.']] },
            { t: '"Dạ được ạ, mình thuê xe nâng."', fx: { dr: 3, rel: { duy: -1 } }, then: [['duy', 'Em vừa nói giống Thảo. Anh sẽ nói chuyện với chủ showroom. Em đừng nghe máy ai trong một tiếng.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 31. ${s.flags.lion_tail ? 'Mình là khúc đuôi lân. Bên trong tối và rất tin tưởng.' : 'Chị Kiều đội đầu lân. Vy quay clip.'} Lộc vẫn sẽ vào từ trên cao. Không bằng xe nâng.`,
  },

  {
    id: 'kid_lost', day: 36, title: 'Family day: đếm thiếu một bé',
    intro: 'Thứ Hai. Family day của Dược Khỏe Re ở một khu vui chơi ngoại thành. 120 người, trong đó 34 trẻ em.\n\nAnh Hải dẫn đoàn. Bạn ở văn phòng lo "base".\n\nHôm nay anh Hải đến sớm. Anh không hét. Như vậy là nghiêm trọng.',
    steps: [
      {
        who: 'hai', obj: 'Anh Hải dạy bạn "đếm đầu"', time: '08:30',
        scene: [
          ['hai', 'Đoàn có trẻ con là đoàn khó nhất. Người lớn lạc thì tự gọi. Trẻ con lạc thì đứng khóc ở quầy kem.'],
          { mini: HEADCOUNT_MINI,
            good: [['hai', 'Đúng hết! Em sẽ là HDV giỏi! Nói nhiều, chịu say xe!'], { fx: { uy: 2, rel: { hai: 2 } } }],
            bad: [['hai', 'Không. Không bao giờ cho xe chạy khi đếm thiếu. KHÔNG BAO GIỜ. …Xin lỗi, anh hét.'], { fx: { nl: -2 } }],
          },
          { c: 'e36_prep', o: [
            { t: 'In 34 vòng tay giấy ghi tên bé + số điện thoại bố mẹ.', fx: { nl: -5, uy: 2, rel: { hai: 1 }, set: { wristbands: true } }, then: [['hai', 'Vòng tay! Anh mang theo! Em là người thứ hai trong lịch sử công ty nghĩ ra cái này. Người đầu tiên là anh.']] },
            { t: 'Gửi danh sách trẻ em kèm ảnh vào group Zalo đoàn.', fx: { uy: 1, set: { kid_list: true } }, then: [['hai', 'Group Zalo 120 người. Ảnh sẽ chìm dưới 80 tin hỏi "mấy giờ xe chạy". Nhưng còn hơn không.']] },
          ] },
        ],
      },
      {
        who: 'khoa', obj: 'Khoa chuẩn bị trò chơi trẻ em', time: '10:30',
        scene: [
          ['khoa', 'Trò chơi cho trẻ em! Cuối cùng cũng có khán giả hiểu mình! Không ai muốn chơi kéo co dưới nước bằng một đứa 6 tuổi.'],
          { c: 'e36_kids', o: [
            { t: 'Gợi ý trò "Tìm bố mẹ bằng mật mã" để bé nhớ số điện thoại.', fx: { uy: 2, rel: { khoa: 2 } }, then: [['khoa', 'Vừa chơi vừa an toàn! Mình yêu ý này!']] },
            { t: 'Để Khoa tự do sáng tạo.', fx: { rel: { khoa: 1 } }, then: [['khoa', 'Bóng nước! Ướt một chút thôi! Trẻ con thích ướt!']] },
          ] },
        ],
      },
      {
        who: 'call:hai', obj: 'Anh Hải gọi. Giọng rất nhỏ.', time: '15:20',
        call: { title: '🚩 Khu vui chơi · chuẩn bị lên xe', people: ['hai', 'thang', 'me'] },
        scene: [
          ['hai', 'Đếm: một trăm mười chín. Thiếu một. Bé Na, 6 tuổi, váy vàng. Bố mẹ đang ở xe số hai, tưởng bé ở xe số một.'],
          ['thang', 'Em ơi… làm sao bây giờ…'],
          { c: 'e36_lost', o: [
            { t: '"Giữ tất cả xe. Chia người tìm theo khu: quầy kem, nhà vệ sinh, cổng. Báo bố mẹ ngay, báo bảo vệ khu."', fx: { uy: 4, rel: { hai: 2, thang: 2 } }, then: [['hai', 'GIỮ XE! TẤT CẢ! Đội một quầy kem, đội hai cổng, đội ba nhà vệ sinh! ĐI!']] },
            { t: '"Gọi bố mẹ bé trước để hỏi bé hay đi đâu."', fx: { uy: 1, dr: 2 }, then: [['hai', 'Bố mẹ đang chạy từ xe hai sang, hoảng lắm. Anh giữ xe luôn. Chia người đi tìm.']] },
          ] },
          { if: F('wristbands'), then: [
            ['nar', '15:31. Điện thoại mẹ bé Na rung. Một chị bán kem: "Bé đeo vòng tay có số này, đang ăn kem ở quầy tôi."'],
            { fx: { uy: 3, rel: { hai: 2 }, set: { kid_found_fast: true } } },
          ], else: [
            ['nar', '15:41. Anh Hải tìm thấy bé Na ở quầy kem, tay cầm cây kem dâu, không hề biết cả đoàn đang tìm mình.'],
          ] },
          ['hai', 'Một trăm hai mươi. Đủ. …Anh ngồi xuống một chút.'],
        ],
      },
      {
        who: 'call:thang', obj: 'Anh Thắng gọi lại sau chuyến đi', time: '16:40',
        call: { title: 'Khỏe Re · Family day', people: ['thang', 'me'] },
        scene: [
          { if: F('kid_found_fast'), then: [['thang', 'Mười một phút. Nhờ cái vòng tay. Bố mẹ bé Na muốn gửi lời cảm ơn. Sếp tổng muốn ký family day năm sau.']], else: [['thang', 'Hai mươi mốt phút. Dài nhất đời anh. Nhưng bé an toàn. Cảm ơn em với anh Hải đã giữ xe.']] },
          { c: 'e36_end', o: [
            { t: 'Đề xuất từ nay đoàn nào có trẻ em đều có vòng tay và người phụ trách riêng.', fx: { uy: 3, rel: { thang: 1, duy: 1 } }, then: [['thang', 'Em gửi anh đề xuất. Anh đưa vào quy định đi chơi của công ty luôn.']] },
            { t: 'Cảm ơn anh Thắng, rồi gọi hỏi thăm anh Hải.', fx: { rel: { hai: 2 } }, then: [['hai', 'Anh ổn. Anh chỉ… cần ngồi im một lúc. Đây là lần đầu anh không muốn hét.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 36. Đếm thiếu một bé. ${s.flags.kid_found_fast ? 'Mười một phút, nhờ vòng tay giấy.' : 'Hai mươi mốt phút. Bé ở quầy kem.'} Anh Hải không hét suốt buổi chiều.`,
  },

  {
    id: 'peak_board', day: 38, title: 'Lịch tháng 12 lên bảng',
    intro: 'Thứ Tư. Sáng nay bảng "LỊCH SỰ KIỆN THÁNG 11" đã bị xóa.\n\nThay vào đó: "THÁNG 12". 23 show. Ô ngày 20 ghi "3 SHOW" bằng bút đỏ, không còn dấu hỏi.\n\nDòng cuối: "Nghỉ phép: KHÔNG".',
    steps: [
      {
        who: 'obj:okr', obj: 'Đọc bảng lịch tháng 12', time: '08:40',
        scene: [
          ['nar', 'Tháng 12: 23 show, 4 tour, 2 hội nghị. Ngày 20: ba year-end party cùng một tối. Ngày 24: "Noel, có show". Ngày 31: "Countdown, có show".'],
          ['vy', '(đứng cạnh) Mùa cao điểm. Năm ngoái mình chưa vào. Anh Duy bảo năm ngoái anh ấy ngủ trong kho 11 đêm.'],
          { c: 'e38_board', o: [
            { t: 'Chụp ảnh bảng, lên kế hoạch chuẩn bị đồ từ bây giờ.', fx: { uy: 2, rel: { lan: 1 } }, then: [['lan', 'Em chụp hả? Tốt. Chị đặt thêm 200 áo mưa. Và 3 túi ngủ.']] },
            { t: 'Hỏi Vy: "Nếu mình không ở đây tháng 12 thì sao?"', fx: { rel: { vy: 2 } }, then: [['vy', 'Thì bạn sẽ thấy story của mình lúc 3 giờ sáng. Và bạn sẽ nhớ nơi này. Kỳ lạ vậy đó.']] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy cần người cho show thứ 3 ngày 20/12', time: '10:00',
        scene: [
          ['duy', 'Ngày 20: ba show. Anh show 1, Thảo show 2. Show 3 cần một người giám sát, một mình, ba bộ đàm.'],
          ['duy', 'Anh nói thật. Sau tháng 12 anh tính nghỉ. Con anh lên lớp một. Anh muốn có mặt ít nhất một ngày sinh nhật.'],
          { c: 'e38_show3', o: [
            { t: '"Em nhận show 3 ạ."', fx: { nl: -6, uy: 3, rel: { duy: 2 }, set: { peak_volunteer: true } }, then: [['duy', 'Copy. Anh sẽ dạy em mọi thứ trong ba tuần. Kể cả cách tắt bộ đàm số ba.']] },
            { t: '"Em xin đi kèm show 1 với anh để học trước ạ."', fx: { uy: 2, rel: { duy: 1 } }, then: [['duy', 'Hợp lý. Học trước, chạy sau. Anh sẽ xin chị Kiều thuê thêm CTV. Chị sẽ hỏi "tiền đâu".']] },
            { t: '"Anh nghỉ thật hả anh?"', fx: { rel: { duy: 2 } }, then: [['duy', 'Năm nào anh cũng nói vậy. Năm nay anh nói với một người. Là em. Vậy là thật hơn mọi năm.']] },
          ] },
        ],
      },
      {
        who: 'bich', obj: 'Cô Bích quyết toán phụ cấp show', time: '14:00',
        scene: [
          ['bich', 'Cô tính phụ cấp show của em. Mỗi show có mặt: một khoản. Không có xác nhận thì không tính.'],
          { if: F('contract_fixed'), then: [['bich', 'Thỏa thuận của em có dòng "show hủy vẫn tính nửa phụ cấp". Anh Duy sửa cho em. Cô tính đúng như vậy.']] },
          { c: 'e38_allowance', o: [
            { t: 'Đưa run-sheet có tên mình ở từng show làm xác nhận.', fx: { money: 400_000, rel: { bich: 2 }, uy: 1 }, then: [['bich', 'Có tên, có giờ, có chữ ký anh Duy. Bốn trăm nghìn. Đúng từng đồng.']] },
            { t: '"Cô tính sao cũng được ạ."', fx: { money: 150_000 }, then: [['bich', 'Không có xác nhận thì cô tính một show. Một trăm năm mươi nghìn. Lần sau giữ giấy tờ.']] },
          ] },
        ],
      },
      {
        who: 'kieu', obj: 'Chị Kiều tập hợp cả team', time: '16:30', pos: { kieu: 'coach', duy: 'su1', thao: 'su2', toan: 'su3', ngan: 'su4', hai: 'su5', vy: 'su6', khoa: 'su7', my: 'su8' },
        scene: [
          ['kieu', 'Cả nhà! Tháng 12 tới rồi! 23 show! Chị biết mọi người mệt. Chị cũng mệt. Nhưng xin một tràng pháo tay cho chính mình!'],
          ['nar', 'Lần này có người vỗ tay. Anh Hải vỗ to nhất. Cửa kính rung.'],
          ['kieu', 'Năm 2009, chị dẫn gala trong mưa và nghĩ: mình sẽ lập một công ty mà "đi đâu cũng được", miễn đi cùng nhau.'],
          ['kieu', 'Rồi chị nhận ra "đi đâu cũng được" nghĩa là khách muốn đi đâu cũng phải được. Nhưng thôi. Vẫn đi cùng nhau.'],
          { c: 'e38_speech', o: [
            { t: 'Vỗ tay thật to.', fx: { rel: { kieu: 2 }, nl: 2 }, then: [['kieu', 'Cảm ơn em. Có người vỗ tay thật lòng, chị nghe ra.']] },
            { t: 'Hỏi: "Tháng 12 có ai được nghỉ một ngày không ạ?"', fx: { uy: 1, dr: 2, rel: { duy: 1, kieu: -1 } }, then: [['kieu', '…Câu hỏi hay. Chị sẽ… để chị xem. Ngày 25. Ai không có show ngày 25 thì nghỉ.'], ['duy', '(nhỏ) Ai cũng có show ngày 25.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Ngày 38. Lịch tháng 12: 23 show. ${s.flags.peak_volunteer ? 'Mình nhận giám sát show thứ ba ngày 20/12.' : ''} Anh Duy tính nghỉ sau tháng 12. Chị Kiều nói "đi đâu cũng được, miễn đi cùng nhau".`,
  },

  // ---------------------------------------------------------------- official arc (peak season)
  {
    id: 'off_welcome', official: true, title: 'Chính thức: bộ đàm của riêng em',
    intro: 'Bạn là nhân viên chính thức. Hợp đồng lao động, có bảo hiểm, có lương 10 triệu.\n\nVà có một bộ đàm. Của riêng bạn. Kèm một lịch trực đêm. Cũng của riêng bạn.',
    steps: [
      {
        who: 'lan', obj: 'Chị Lan trao "bộ đồ chính thức"', time: '08:30',
        scene: [
          ['lan', 'Áo đồng phục chữ "STAFF", không còn chữ "INTERN". Danh thiếp 200 cái. Và bộ đàm số 4. Giờ là của em mãi mãi.'],
          ['nar', 'Danh thiếp ghi: "{ten} · Event Executive". Tên bạn bị sai một dấu.'],
          { c: 'eo1_card', o: [
            { t: 'Xin in lại danh thiếp đúng tên.', fx: { uy: 1, rel: { lan: 1 } }, then: [['lan', 'In lại mất một tuần. Trong một tuần đó em sẽ gặp 40 khách. Em tự viết tay sửa nha.']] },
            { t: 'Cười, giữ nguyên làm kỷ niệm.', fx: { rel: { lan: 2 }, nl: 3 }, then: [['lan', 'Ừ. Danh thiếp đầu tiên của chị cũng sai. Chị vẫn giữ.']] },
          ] },
        ],
      },
      {
        who: 'thao', obj: 'Chị Thảo bàn giao khách hàng', time: '10:00',
        scene: [
          ['thao', 'Chị giao em ba khách: An Tâm, Khỏe Re, và Ngồi Mãi. Từ giờ em là người nghe điện thoại lúc 23:00.'],
          ['thao', 'À, chị đã hứa với cả ba là "em này giỏi lắm, cái gì cũng được ạ". Em cố gắng nha.'],
          { c: 'eo1_clients', o: [
            { t: 'Gửi email giới thiệu, nói rõ giờ làm việc và kênh khẩn cấp.', fx: { uy: 3, rel: { thao: -1 }, set: { boundaries: true } }, then: [['thao', 'Giờ làm việc? Khách sẽ… à, ừ. Em thử xem. Chị chưa từng thử.']] },
            { t: '"Dạ, em sẵn sàng 24/7 ạ."', fx: { rel: { thao: 2 }, nl: -5 }, then: [['nar', 'Đêm đó 23:47, anh Thắng nhắn: "Em ơi mai mấy giờ đón?" Lần thứ ba.']] },
          ] },
        ],
      },
      {
        who: 'bich', obj: 'Cô Bích giải thích bảng lương mới', time: '14:00',
        scene: [
          ['bich', 'Lương chính thức 10 triệu. Trừ bảo hiểm phần người lao động 10,5%. Thuế thu nhập cá nhân: mức này sau giảm trừ gia cảnh thì gần như không. (thông tin giải trí, không phải tư vấn pháp lý)'],
          ['bich', 'Và phụ cấp show: không còn nữa. Lương chính thức "đã bao gồm" show. Kể cả show đêm. Kể cả ba show một đêm.'],
          ['think', 'Hồi intern mỗi show có phụ cấp. Giờ chính thức thì show là "đã bao gồm".'],
          { c: 'eo1_pay', o: [
            { t: '"Cô ơi, vậy OT ban đêm tính sao ạ?"', fx: { uy: 1, rel: { bich: 1 }, dr: 1 }, then: [['bich', 'Câu hỏi đúng. Hợp đồng ghi "theo quy định công ty". Quy định công ty… cô đang tìm. Năm năm rồi.']] },
            { t: 'Ký nhận, không hỏi.', fx: { rel: { bich: 1 } }, then: [['bich', 'Ký đẹp. Lần sau đọc trước khi ký. Cô nói với mọi người câu đó, không ai nghe.']] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy: "Đêm nay ai trực?"', time: '17:30',
        scene: [
          ['duy', 'Chúc mừng em lên chính thức. Giờ câu "đêm nay ai trực" không còn là câu hỏi. Là lịch.'],
          ['duy', 'Lịch tháng 12 của em: 14 đêm trực. Anh 16. Mình là đồng đội.'],
          { c: 'eo1_duy', o: [
            { t: '"Copy."', fx: { rel: { duy: 2 }, nl: -4, set: { off_owner: true } }, then: [['duy', 'Em nói "copy" rồi. Hết đường lùi. Chào mừng tới đây thật sự.']] },
            { t: '"Anh ơi, 14 đêm có nhiều quá không ạ?"', fx: { rel: { duy: 1 }, uy: 1 }, then: [['duy', 'Nhiều. Anh biết. Năm ngoái anh 19 đêm. Năm nay anh xin bớt cho em được 3. Đó là điều tốt nhất anh làm được.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Chính thức. Danh thiếp sai một dấu. Bộ đàm số 4 là của mình. ${s.flags.boundaries ? 'Mình gửi khách email ghi giờ làm việc. Không ai đọc dòng đó.' : 'Anh Thắng nhắn lúc 23:47.'} Phụ cấp show giờ đã "bao gồm".`,
  },

  {
    id: 'off_three_shows', official: true, title: 'Ba show một đêm',
    intro: 'Mùa cao điểm. Một tối ba year-end party: anh Duy show 1, chị Thảo show 2.\n\nShow 3, ballroom một khách sạn ở quận 1, 400 khách: bạn. Một mình. Ba bộ đàm.\n\nBạn ở văn phòng tới chiều để chốt mọi thứ, rồi đi thẳng.',
    steps: [
      {
        who: 'quan', obj: 'Anh Quân kiểm tra thiết bị show 3', time: '09:00',
        scene: [
          ['quan', 'Show 1 lấy bộ âm thanh tốt nhất. Show 2 lấy bộ thứ hai. Show 3 của em lấy… bộ còn lại. Bộ có cái micro hay rè.'],
          { c: 'eo2_gear', o: [
            { t: 'Thuê thêm 2 micro không dây ngoài, chấp nhận vượt ngân sách.', fx: { money: 0, uy: 2, rel: { quan: 1, bich: -1 } }, then: [['bich', '(nhắn) Hai micro ngoài ngân sách. Ai duyệt? À, em duyệt. Em là chính thức rồi. Cô ghi tên em.']] },
            { t: 'Mượn micro dự phòng từ show 1 (anh Duy) lúc 20:00.', fx: { rel: { duy: -1 }, dr: 1 }, then: [['duy', '(bộ đàm) Lấy micro của anh lúc 20:00 là lúc anh trao giải. Em… thôi được. Copy.']] },
          ] },
        ],
      },
      {
        who: 'call:thao', obj: 'Chị Thảo gọi: khách show 3 vừa đổi ý', time: '13:30',
        call: { title: 'Show 3 · Year-End Nội Thất Ngồi Mãi', people: ['thao', 'me'] },
        scene: [
          ['thao', 'Khách show 3 muốn thêm "màn cầu hôn bất ngờ" của một nhân viên. Anh ấy xin cue riêng giữa tiệc. Chị lỡ "dạ được ạ".'],
          { c: 'eo2_proposal', o: [
            { t: '"Em sẽ gọi HR bên khách xác nhận, và hỏi bạn gái anh ấy có muốn lên sân khấu không qua bạn thân."', fx: { uy: 4, rel: { thao: 1 } }, then: [['thao', 'Hỏi trước hả? …Ừ. Năm ngoái có màn cầu hôn bị từ chối trước 300 người. Không khí đóng băng như tủ đá.']] },
            { t: '"Dạ được, em chuẩn bị nhạc và đèn."', fx: { dr: 3 }, then: [['think', 'Mình vừa nói "dạ được". Giọng mình giống chị Thảo một cách đáng sợ.']] },
          ] },
        ],
      },
      {
        who: 'call:duy', obj: 'Bộ đàm: ba show cùng lúc', time: '17:50',
        call: { title: '📻 Kênh chung · 3 show', people: ['duy', 'thao', 'quan', 'me'] },
        scene: [
          ['duy', 'Show 1 standby. Show 2?'],
          ['thao', 'Show 2 standby! Ca sĩ chưa tới! Nhưng standby!'],
          ['duy', 'Show 3?'],
          ['nar', 'Ba cái bộ đàm trên thắt lưng bạn cùng rè lên. Đèn ballroom tắt. Bốn trăm người im lặng.'],
          { c: 'eo2_go', o: [
            { t: '"Show 3 standby. Go."', fx: { uy: 4, nl: -15, rel: { duy: 2 }, set: { off_show3: true } }, then: [
              ['nar', 'Bạn chạy show 3 trong 4 tiếng. Micro rè hai lần. Màn cầu hôn thành công. Ăn cơm hộp lúc 23:40 trong cánh gà.'],
              ['duy', '(bộ đàm, 00:15) Ba show. Không ai phàn nàn. Em biết đó là lời khen cao nhất trong nghề này không.'],
            ] },
            { t: '"Show 3… cần hỗ trợ." (gọi thêm CTV ngay)', fx: { uy: 1, nl: -8, money: 0, rel: { kieu: -1 } }, then: [
              ['nar', 'Hai CTV tới lúc 19:00. Show chạy ổn. Hôm sau chị Kiều hỏi: "Ai duyệt thêm hai CTV? Tiền đâu?"'],
            ] },
          ] },
          ['think', 'Ba tuần trước mình còn là intern. Giờ mình là người được gọi là "Show 3".'],
        ],
      },
    ],
    diary: (s) => `Ba show một đêm. ${s.flags.off_show3 ? 'Mình chạy show 3 một mình. Cơm hộp lúc 23:40.' : 'Mình gọi thêm CTV. Chị Kiều hỏi tiền đâu.'} Về nhà lúc 2 giờ sáng. Mai có hai show.`,
  },

  {
    id: 'off_poach', official: true, title: 'Chị Hường mời về',
    intro: 'Mười ngày liền không có ngày nghỉ. Hôm qua bạn ngủ gật trên xe về, cả đoàn chụp ảnh.\n\nSáng nay có hai tin. Một tin từ chị Kiều. Một tin từ chị Hường bên khách.',
    steps: [
      {
        who: 'kieu', obj: 'Chị Kiều họp toàn công ty (ngắn)', time: '08:45', pos: { kieu: 'coach', duy: 'su1', thao: 'su2', bich: 'su3', toan: 'su4', ngan: 'su5' },
        scene: [
          ['kieu', 'Cả nhà. Chị nói nhanh. Ba khách lớn chưa thanh toán đợt 2. Nên lương tháng này… sẽ trả làm hai đợt.'],
          ['bich', 'Đợt một: 60%. Đợt hai: khi khách trả. Cô đã gọi khách 14 lần.'],
          ['nar', 'Không ai nói gì. Anh Hải không hét. Bộ đàm số ba của anh Duy, lần đầu tiên, đang bật.'],
          { c: 'eo3_salary', o: [
            { t: '"Chị ơi, đợt hai có ngày cụ thể không ạ?"', fx: { uy: 2, rel: { bich: 1, kieu: -1 }, dr: 1 }, then: [['kieu', '…Chị hứa trước 15 tháng sau. Chị ghi vào văn bản. Em là người đầu tiên hỏi câu này trong 10 năm.']] },
            { t: 'Im lặng.', fx: { nl: -4 }, then: [['think', 'Hồi intern mình được trả đúng ngày 10. Hồi đó mình không biết đó là một đặc ân.']] },
          ] },
        ],
      },
      {
        who: 'call:huong', obj: 'Chị Hường nhắn: "Em có rảnh nói chuyện riêng không?"', time: '12:30',
        call: { title: 'Gọi riêng · không phải công việc', people: ['huong', 'me'] },
        scene: [
          ['huong', 'Chị nói thật. Bên chị cần một "chuyên viên sự kiện nội bộ". Giờ hành chính. 12 triệu. Cuối tuần nghỉ.'],
          ['huong', 'Anh Quang nhớ em từ đêm gala mưa. Anh nói: "Mời đứa đó về."'],
          { if: F('clean_invoice'), then: [['huong', 'Với lại… vụ hóa đơn. Chị xấu hổ lắm. Chị cần người như em ở bên chị.']] },
          { c: 'eo3_offer', o: [
            { t: '"Em xin suy nghĩ vài ngày ạ."', fx: { set: { poach_offer: true } }, then: [['huong', 'Ừ. Em suy nghĩ đi. Chị chờ tới cuối tháng.']] },
            { t: '"Em cảm ơn chị, nhưng em chưa muốn rời team ạ."', fx: { rel: { huong: 1 }, set: { poach_offer: true, poach_no: true } }, then: [['huong', 'Chị hiểu. Lời mời vẫn còn đó. Đi đâu cũng được mà, phải không em.']] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Anh Duy đang ngồi trong kho', time: '17:00', pos: { duy: 'x2' },
        scene: [
          ['nar', 'Anh Duy ngồi trên đống bạt, ba bộ đàm đặt cạnh nhau. Lần đầu bạn thấy cả ba đều tắt.'],
          ['duy', 'Anh nộp đơn rồi. Nghỉ sau Tết. Con anh không nhớ mặt anh ở sinh nhật nào.'],
          { if: F('poach_offer'), then: [['duy', 'Anh nghe đồn bên Bê Tông mời em. Đừng nhìn anh vậy. Nghề này, tin đồn chạy nhanh hơn xe 45 chỗ.']] },
          { c: 'eo3_duy', o: [
            { t: 'Kể thật với anh Duy về lời mời.', fx: { rel: { duy: 3 }, set: { told_duy: true } }, then: [['duy', 'Em hỏi anh nên đi không? Anh không trả lời được. Anh chỉ nói: đi đâu cũng được, miễn đừng quên sinh nhật ai.']] },
            { t: '"Anh đi rồi ai giữ bộ đàm số ba ạ?"', fx: { rel: { duy: 2 } }, then: [['duy', 'Em. Chị Kiều đã nói với anh từ tuần trước. Chị chưa nói với em thôi.'], ['think', 'Vậy là thêm một bộ đàm.']] },
          ] },
        ],
      },
    ],
    diary: (s) => `Lương trả làm hai đợt. Chị Hường mời về, 12 triệu, cuối tuần nghỉ. ${s.flags.told_duy ? 'Mình kể với anh Duy.' : ''} Anh Duy nộp đơn nghỉ sau Tết. Bộ đàm số ba sắp là của mình.`,
  },

  {
    id: 'off_final', official: true, end: 'quit', noReview: true, title: 'Đêm tất niên của chính mình',
    intro: 'Cuối mùa cao điểm. 23 show đã chạy. Hôm nay là tất niên của chính công ty Đi Đâu Cũng Được.\n\nNgười tổ chức: bạn. Ngân sách: "tùy em, miễn đừng tốn".\n\nBạn đã nghĩ suốt tuần về một quyết định.',
    steps: [
      {
        who: 'kieu', obj: 'Chị Kiều gọi vào phòng', time: '09:00',
        scene: [
          ['kieu', 'Chị nói thẳng. Sau Tết thấp điểm. Ít job. Chị đề xuất… em chuyển sang "cộng tác viên theo show". Linh hoạt hơn. Tự do hơn.'],
          ['think', '"Cộng tác viên theo show". Tức là không có show thì không có lương.'],
          ['kieu', 'Em ký "đơn xin nghỉ tự nguyện" rồi ký hợp đồng cộng tác viên. Mọi người đều làm vậy. Chị không muốn gọi nó là cho nghỉ.'],
          ['nar', '(Chấm dứt hợp đồng lao động có quy định riêng về báo trước và trợ cấp; đây chỉ là chuyện trong game. Thông tin giải trí, không phải tư vấn pháp lý.)'],
          { c: 'eo4_kieu', o: [
            { t: '"Chị ơi, nếu là cho nghỉ thì mình gọi đúng tên và làm đúng quy định ạ."', fx: { uy: 3, rel: { kieu: -1, bich: 2 }, set: { asked_right: true } }, then: [['kieu', '…Em nói giống cô Bích. Ừ. Chị sẽ để cô Bích làm đúng. Em xứng đáng được gọi đúng tên.']] },
            { t: '"Dạ, để em suy nghĩ ạ."', fx: { nl: -4 }, then: [['kieu', 'Suy nghĩ đi. Tối nay tất niên. Chị muốn em vui đã.']] },
          ] },
        ],
      },
      {
        who: 'vy', obj: 'Vy (giờ là intern lâu nhất) phụ bạn setup tất niên', time: '14:00',
        scene: [
          ['vy', 'Mình vẫn là intern. Lâu nhất công ty. Ba tháng. Mình thành "anh Bảo" của chỗ này rồi.'],
          ['vy', 'Bạn biết không, clip "Setup gala lúc 3 giờ sáng" của mình lên 2 triệu view. Có công ty khác nhắn mời mình làm content.'],
          { c: 'eo4_vy', o: [
            { t: '"Vy đi đi. Đừng làm intern ba năm."', fx: { rel: { vy: 3 } }, then: [['vy', 'Bạn cũng đi đi. Mình thấy mắt bạn từ tuần trước rồi.']] },
            { t: '"Ở lại đi, tháng 12 năm sau sẽ khác."', fx: { rel: { vy: 1 } }, then: [['vy', 'Năm nào cũng "năm sau sẽ khác". Mình nghe anh Duy nói câu đó từ ngày đầu.']] },
          ] },
        ],
      },
      {
        who: 'duy', obj: 'Tất niên: anh Duy đưa bạn bộ đàm số ba', time: '17:30', pos: { duy: 'coach', kieu: 'su1', thao: 'su2', toan: 'su3', ngan: 'su4', hai: 'su5', bich: 'su6', khoa: 'su7', lan: 'su8' },
        scene: [
          ['nar', 'Tất niên ở chính văn phòng. Bóng bay gala cũ. Standee "GALA 2026" xoay ngược. Buffet thừa từ show tối qua.'],
          ['kieu', 'XIN MỘT TRÀNG PHÁO TAY CHO NGƯỜI TỔ CHỨC TỐI NAY!'],
          ['nar', 'Cả công ty vỗ tay. Anh Hải hét. Mèo Plan B ngủ trong thùng áo mưa.'],
          ['duy', 'Bộ đàm số ba. Chị Kiều. Anh giữ 7 năm. Anh hay tắt. Giờ của em. Hoặc… của ai đó. Em quyết.'],
          { c: 'eo4_final', o: [
            { t: 'Nhận lời chị Hường: về làm sự kiện nội bộ, giờ hành chính.', when: F('poach_offer'), fx: { set: { final: 'client' } }, then: [
              ['me', 'Anh Duy, em xin phép không nhận bộ đàm. Em nhận lời bên khách rồi.'],
              ['duy', 'Copy. Đi đi. Cuối tuần nhớ ngủ giùm anh.'],
            ] },
            { t: 'Từ chối ký "đơn tự nguyện". Nhận quyết định cho nghỉ đúng quy định, rồi đi.', fx: { set: { final: 'ctv' } }, then: [
              ['me', 'Em không ký đơn tự nguyện ạ. Nếu công ty cho em nghỉ, em xin quyết định đúng tên.'],
              ['bich', 'Cô làm ngay sáng mai. Đúng tên. Đúng quy định. Đủ từng đồng.'],
            ] },
            { t: 'Nộp đơn nghỉ. Mình cần một tháng để nhớ lại cuối tuần là gì.', fx: { set: { final: 'burnout' } }, then: [
              ['me', 'Em xin nghỉ ạ. Không phải vì ai. Vì em nói "copy" trong mơ.'],
              ['duy', 'Anh cũng vậy. Bảy năm. Đi ngủ đi em.'],
            ] },
            { t: 'Làm MC tự do. Lần cuối cầm micro ở đây: dẫn chính đêm tất niên này.', when: F('mc_hosted'), fx: { set: { final: 'mc' } }, then: [
              ['kieu', 'Em muốn làm MC tự do? …Chị năm 2009 cũng vậy. Cầm lấy micro. Dẫn đêm nay đi.'],
              ['me', 'Kính thưa toàn thể gia đình Đi Đâu Cũng Được… xin một tràng pháo tay… cho chính chúng ta.'],
            ] },
          ] },
          ['nar', 'Bộ đàm số ba rè lên một lần, rồi im. Lần này không ai tắt nó. Nó tự hết pin.'],
        ],
      },
    ],
    diary: (s) => `Đêm tất niên của chính mình. ${({ client: 'Mình nhận lời bên khách. Cuối tuần có thật.', ctv: 'Mình không ký đơn tự nguyện.', burnout: 'Mình nghỉ để ngủ.', mc: 'Mình cầm micro lần cuối ở đây.' })[s.flags.final] || 'Mình rời đi.'} Mèo Plan B ngủ trong thùng áo mưa.`,
  },
];
