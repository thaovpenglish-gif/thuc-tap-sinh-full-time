// Người Đúng Chỗ HR — desk work ("Ngồi vào bàn"): the real work of an HR consulting & headhunting intern
// (screening CVs against a JD, shortlists, JDs, interview scheduling, offers), plus the group-chat drama of the
// worst internal HR in the HR business. Engine: game/desk.js + modes/solo.js. Contract: docs/COMPANY_CONTRACT.md §12.
// games: 2 hands-on (ui/action.js) + 3 work sims (ui/sims.js: read a CV against a JD, message candidates and clients)
// chatter: [castId, text, dm?] messages that land WHILE you play, then a short scene with one choice.
// Fair-hiring rule for every game here: age, gender, marital status, religion, hometown, looks are never valid filters.

const F = (k) => (r) => !!r.flags[k];

export const DESK = {
  games: [
    // ---- hands-on (ui/action.js) ----
    { id: 'hr_offer_pack', type: 'action', game: 'scale', title: 'Gói offer trong ngân sách', icon: '📦', time: 60, pass: 0.6, money: true, unitName: 'Offer', icon2: '📦', btn: '✅ GỬI OFFER',
      items: [{ label: 'Lương cứng', emoji: '💰', w: 15000000 }, { label: 'Thưởng KPI', emoji: '🎯', w: 3000000 }, { label: 'Phụ cấp ăn trưa', emoji: '🍱', w: 1000000 }, { label: 'Xăng xe', emoji: '🛵', w: 500000 }],
      targets: [[19500000, 20000000], [24500000, 25000000], [16000000, 16500000], [34000000, 35000000]], okText: 'Trong ngân sách, ứng viên vui!', overText: 'Vượt ngân sách, khách gạch!', underText: 'Thấp quá, ứng viên từ chối!',
      prompt: 'Khách cho khung ngân sách. Bấm từng khoản để gói offer sát trần mà không vượt, lố thì bấm khay bỏ ra, xong thì GỬI OFFER.',
      hint: 'Ứng viên thích offer sát trần. Khách thì không thích vượt trần.' },
    { id: 'hr_ghost', type: 'action', game: 'whack', title: 'Gọi ứng viên trước khi ghost', icon: '👻', time: 45, pass: 0.6, count: 26,
      slotText: 'Pipeline tuần này', bg: '#3a2f55', slot: '#4d4170',
      target: { emoji: '👻', labels: ['Ứng viên Sales', 'Kỹ sư bảo trì', 'Kế toán trưởng', 'Thiết kế UI'], hit: 'Alo! Giữ được', miss: 'Ghost mất rồi', color: '#e3d9ff' },
      avoid: { emoji: '🤖', labels: ['CV do bot gửi', 'Spam headhunt', 'Hồ sơ trùng 5 lần'], hit: 'Gọi nhầm bot!' },
      prompt: 'Ứng viên đang mờ dần, sắp ghost. Bấm 👻 để gọi giữ chân. Đừng gọi 🤖 hồ sơ ảo.' },
    { id: 'hr_screen', type: 'action', game: 'conveyor', mode: 'stamp', title: 'Duyệt CV qua vòng', icon: '📄', time: 55, pass: 0.6, count: 18,
      stampText: 'QUA VÒNG', hit: 'Qua vòng!', wrongHit: 'Duyệt nhầm CV!', miss: 'Lỡ ứng viên tốt!',
      target: { emoji: '📄', labels: ['Đúng kinh nghiệm JD', 'Có portfolio', 'Đủ chứng chỉ', 'Từng làm đúng mảng'] },
      avoid: { emoji: '🗑️', labels: ['Sai ngành hoàn toàn', 'CV để trống', 'Nộp nhầm vị trí', 'Thiếu kỹ năng bắt buộc'] },
      prompt: 'CV chạy trên băng chuyền. Chỉ đóng dấu QUA VÒNG cho CV hợp JD khi nó vào khung đỏ. (Tuổi, giới tính, quê quán không phải tiêu chí.)',
      rule: 'Bấm (hoặc Space) khi CV HỢP JD vào khung đỏ' },
    // ---- work sims (ui/sims.js): real HR & headhunting work ----
    { id: 'hr_cv', type: 'doc', title: 'Đọc CV ứng viên', icon: '📄', time: 80, pass: 0.6,
      prompt: 'Đọc CV, so với JD. Bấm 🚩 vào mọi dòng cần hỏi lại hoặc là vấn đề. Tuổi, giới tính, hôn nhân, quê quán KHÔNG phải vấn đề.',
      docs: [
        { kind: 'cv', head: 'Lê Minh Châu · Kế toán tổng hợp', meta: 'JD: Kế toán tổng hợp · ≥ 3 năm · thành thạo MISA · có chứng chỉ Kế toán trưởng là lợi thế',
          lines: [
            { h: 'Thông tin' },
            'Sinh năm 1996 · Đã kết hôn · Quê Nghệ An',
            { h: 'Kinh nghiệm' },
            '2019–2022 · Kế toán viên · Bao Bì An Phát (toàn thời gian)',
            { t: '2021–2024 · Kế toán tổng hợp · Thép Hưng Thịnh (toàn thời gian)', bad: 'Trùng 2021–2022 với việc cũ, cả hai đều toàn thời gian: phải hỏi rõ.' },
            '2024–nay · Kế toán tổng hợp · Nội Thất Mộc An',
            { t: '"Giảm 80% thuế phải nộp cho công ty bằng các phương pháp sáng tạo"', bad: '"Sáng tạo" với thuế là cờ đỏ: hỏi cụ thể cách làm, có thể là né thuế sai luật.' },
            { h: 'Kỹ năng' },
            'MISA, Excel (Pivot, XLOOKUP), kê khai thuế GTGT hằng tháng',
            { t: 'Chứng chỉ Kế toán trưởng: "đang chờ cấp" từ năm 2019', bad: 'Chờ cấp 5 năm là bất thường: xin bản chụp, hoặc coi như chưa có.' },
            { h: 'Tham chiếu' },
            'Chị Hoàng Lan · Kế toán trưởng Mộc An · có số điện thoại',
          ],
          verdict: { q: 'Bước tiếp theo?', options: ['Mời phỏng vấn, hỏi rõ các điểm đã đánh dấu', 'Gửi thẳng cho khách, CV đẹp mà', 'Loại vì đã kết hôn'], correct: 0,
            why: 'Kinh nghiệm khớp JD nhưng có điểm phải làm rõ. Hôn nhân không bao giờ là tiêu chí.' } },
        { kind: 'cv', head: 'Phạm Quốc Bảo · Trưởng nhóm Sales B2B', meta: 'JD: Trưởng nhóm Sales B2B ngành bao bì · ≥ 5 năm sales B2B · đã quản lý ≥ 3 người · tiếng Anh giao tiếp',
          lines: [
            { h: 'Tóm tắt' },
            { t: '"Năng động, chịu áp lực tốt, vừa làm việc nhóm vừa làm việc độc lập"', bad: 'Câu sáo, không có số liệu: không chứng minh được gì, phải hỏi ví dụ thật.' },
            { h: 'Kinh nghiệm' },
            '2016–2020 · Sales Executive · Bao Bì Đông Á · đạt 115% chỉ tiêu năm 2019',
            '2020–2023 · Sales Supervisor · Nhựa Kim Long · quản lý nhóm 4 người',
            { t: '2023–nay · "Freelance Business Consultant"', bad: 'Khoảng trống được đặt tên đẹp: hỏi cụ thể đã làm gì, cho khách nào.' },
            { t: 'Doanh số cá nhân năm 2022: 120 tỷ, gấp 10 lần doanh thu cả công ty', bad: 'Con số vô lý so với quy mô công ty: phải xác minh qua người tham chiếu.' },
            { h: 'Kỹ năng' },
            'Tiếng Anh: IELTS 6.5 (2021)',
            'Đàm phán hợp đồng khung, theo dõi công nợ khách hàng',
            { t: 'Email liên hệ: lunglinhbaby2000@…', bad: 'Không phải lý do loại, nhưng nên góp ý ứng viên đổi email chuyên nghiệp trước khi gửi khách.' },
            'Lý do chuyển việc: muốn quay lại làm sales toàn thời gian',
          ],
          verdict: { q: 'Gửi CV này cho khách chưa?', options: ['Gọi ứng viên làm rõ trước, rồi mới gửi', 'Gửi luôn, doanh số đẹp thế cơ mà', 'Loại luôn cho nhanh'], correct: 0,
            why: 'Kinh nghiệm quản lý khớp JD, nhưng doanh số và khoảng trống phải xác minh trước khi đặt uy tín công ty mình vào.' } },
        { kind: 'cv', head: 'Trần Thu Hà · Kỹ sư bảo trì', meta: 'JD (khách Nhà máy Giấy Tân Phong): Kỹ sư bảo trì · ≥ 2 năm nhà máy · đọc bản vẽ điện · làm ca',
          lines: [
            { h: 'Thông tin' },
            'Nữ · 27 tuổi · Bình Dương',
            { h: 'Kinh nghiệm' },
            '2021–2023 · Kỹ thuật viên điện · Nhà máy Giấy Sông Bé · làm 3 ca',
            { t: '2023–nay · Kỹ sư bảo trì · Bao Bì Phú Quý (khách hàng đang ký với công ty mình)', bad: 'Quy tắc off-limits: không chủ động săn người đang làm cho chính khách hàng của mình.' },
            'Giảm 18% thời gian dừng máy sau 1 năm (có báo cáo kèm theo)',
            { h: 'Kỹ năng' },
            'Đọc bản vẽ điện, PLC Siemens S7-1200, an toàn điện bậc 4',
            'Sẵn sàng làm ca và tăng ca theo kế hoạch',
            { t: 'Đính kèm: bang_cap_scan.jpg (0 KB)', bad: 'File hỏng: xin lại bản scan bằng cấp trước khi làm bất cứ việc gì tiếp.' },
            'Mức lương mong muốn: 18–20 triệu, có thể thương lượng',
          ],
          verdict: { q: 'Xử lý hồ sơ này thế nào?', options: ['Không chủ động tiếp cận, báo chị Ngân về off-limits', 'Mời phỏng vấn ngay, ứng viên quá hợp', 'Loại vì kỹ sư bảo trì "nên là nam"'], correct: 0,
            why: 'Ứng viên rất hợp, nhưng đang làm cho khách của mình: săn người của khách là mất khách. Giới tính không liên quan.' } },
      ] },

    { id: 'hr_candidate', type: 'chat', title: 'Nhắn tin với ứng viên', icon: '💬', time: 85, pass: 0.6,
      prompt: 'Ứng viên đang nhắn. Trả lời sao cho chuyên nghiệp, thật thà và giữ được người. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Anh Sơn', emoji: '👔', role: 'Giám đốc Kinh doanh · chưa từng nói chuyện', app: 'LinkedIn' },
          start: ['Chào bạn. Bạn là ai, sao lại nhắn tôi?'],
          turns: [
            { options: [
              { t: 'Dạ em là tư vấn tuyển dụng bên Người Đúng Chỗ HR. Em xin anh 2 phút về một vị trí Giám đốc Kinh doanh ạ.', s: 2, react: 'Ok. Nói ngắn gọn.' },
              { t: 'Dạ em có số anh từ danh sách học viên MBA mà đối tác gửi bên em, anh yên tâm là nguồn rất tin cậy ạ.', s: 0, react: 'Danh sách học viên? Ai cho phép vậy?' },
              { t: 'Anh ơi job lương khủng, anh nhảy không ạ? 🔥', s: 1, react: 'Tôi không nhảy việc qua emoji lửa.' },
            ] },
            { them: 'Công ty nào? Lương bao nhiêu?', options: [
              { t: 'Dạ là Bao Bì Phú Quý, ông Tài đang muốn thay giám đốc cũ nên tìm gấp, khung lương rất tốt anh ạ.', s: 0, react: 'Giám đốc cũ biết chưa? Bạn nói hơi nhiều đấy.' },
              { t: 'Dạ một nhà sản xuất bao bì, em được nói tên khi anh đồng ý tìm hiểu. Khung 60–75 triệu + thưởng.', s: 2, react: 'Khung ổn. Giữ kín tên là đúng.' },
              { t: 'Dạ lương thỏa thuận ạ', s: 1, react: '"Thỏa thuận" thường nghĩa là thấp.' },
            ] },
            { them: 'Tôi đang ổn ở chỗ hiện tại. Sao tôi phải đổi?', options: [
              { t: 'Dạ em không ép anh. Em gửi mô tả công việc, hợp thì mình hẹn 20 phút ạ.', s: 2, react: 'Gửi đi. Tối nay tôi đọc.' },
              { t: 'Dạ vì ở lâu một chỗ thì khó lên được nữa ạ, anh cũng nên nghĩ tới lộ trình 5 năm tới của mình chứ ạ.', s: 0, react: 'Bạn đang dạy tôi làm nghề à?' },
              { t: 'Dạ lương cao hơn khoảng 20% ạ', s: 1, react: 'Tiền không phải tất cả. Nhưng tôi nghe.' },
            ] },
            { them: 'Mà bạn đã gửi CV tôi cho ai chưa?', options: [
              { t: 'Dạ chắc là chưa, để em hỏi lại team ạ', s: 1, react: '"Chắc là"?' },
              { t: 'Dạ để giữ chỗ cho anh, em đã gửi trước CV cho 3 công ty đang tuyển vị trí tương tự rồi ạ, anh yên tâm.', s: 0, react: 'Bạn làm gì cơ??' },
              { t: 'Dạ chưa ạ. Em chỉ gửi khi anh đồng ý bằng văn bản.', s: 2, react: 'Tốt. Vậy mới làm việc được.' },
            ] },
          ],
          end: { good: 'Email tôi gửi bạn rồi. Thứ Năm 20h gọi được.', bad: 'Thôi, tôi bận. Đừng nhắn nữa nhé.' } },
        { who: { name: 'Chị Yến', emoji: '💄', role: 'Ứng viên · Trưởng phòng Marketing', app: 'Zalo' },
          start: ['Em ơi chị xin lỗi, sáng mai chị kẹt họp. Dời phỏng vấn được không em?'],
          turns: [
            { options: [
              { t: 'Dạ được chị. 14h thứ Năm hay 9h thứ Sáu ạ? Em chốt với khách trong hôm nay.', s: 2, react: 'Thứ Sáu 9h nhé. Cảm ơn em.' },
              { t: 'Dạ chị cố sắp xếp giúp em nhé, khách bên em rất bận, dời lịch thì ấn tượng đầu không tốt lắm đâu ạ.', s: 0, react: 'Chị xin dời một lần thôi mà em?' },
              { t: 'Dạ để em hỏi khách xem ạ', s: 1, react: 'Ok, có gì em báo chị nhé.' },
            ] },
            { them: 'Khách hỏi lương hiện tại của chị. Chị có bắt buộc phải nói không?', options: [
              { t: 'Dạ khách cần phiếu lương 3 tháng gần nhất để đối chiếu, chị chụp gửi em qua Zalo là được ạ.', s: 0, react: 'Phỏng vấn mà cần cả phiếu lương hả em?' },
              { t: 'Dạ chị nói mức mong muốn là đủ. Em khớp khung với khách ạ.', s: 2, react: 'Vậy chị mong 45 triệu net.' },
              { t: 'Dạ chị nói đại khái cũng được ạ', s: 1, react: 'Đại khái bao nhiêu mới đẹp hả em?' },
            ] },
            { them: 'Chị nghe review công ty này hay chậm lương. Thật không em?', options: [
              { t: 'Dạ không đâu chị, em làm với khách này lâu rồi, công ty siêu tốt, chị cứ yên tâm tuyệt đối nhé.', s: 0, react: 'Câu này chị nghe ba headhunter nói rồi.' },
              { t: 'Dạ em cũng có nghe nói vậy 😅', s: 1, react: 'Ơ… vậy chị có nên đi không?' },
              { t: 'Dạ em không xác nhận tin đồn được. Em hỏi khách giúp chị, chị cũng nên hỏi thẳng khi phỏng vấn.', s: 2, react: 'Em thật thà. Chị thích.' },
            ] },
            { them: 'Nếu chị đậu mà công ty cũ tăng lương giữ chị lại thì sao?', options: [
              { t: 'Dạ quyền của chị ạ. Chị chỉ cần báo em sớm.', s: 2, react: 'Hợp lý. Chị hứa báo sớm.' },
              { t: 'Dạ chị cứ báo hai bên để họ đấu giá, mình được giá cao nhất, em hỗ trợ chị deal tới cùng luôn ạ.', s: 1, react: 'Nghe hơi… chiến thuật quá em.' },
              { t: 'Dạ nhận offer rồi là không được đổi ý đâu chị', s: 0, react: 'Chị đã ký gì đâu em?' },
            ] },
          ],
          end: { good: 'Thứ Sáu 9h nhé. Chị đến sớm 10 phút.', bad: 'Chắc chị tạm dừng tìm việc. Cảm ơn em.' } },
        { who: { name: 'Anh Nam', emoji: '📒', role: 'Ứng viên · Kế toán trưởng · đã phỏng vấn', app: 'Zalo' },
          start: ['Em ơi có kết quả chưa? Anh chờ hai tuần rồi.'],
          turns: [
            { options: [
              { t: 'Dạ khách vẫn đang cân nhắc thêm vài hồ sơ, anh chờ thêm tuần nữa nhé, em nghĩ cơ hội của anh vẫn cao ạ.', s: 0, react: 'Hai tuần rồi vẫn cân nhắc à?' },
              { t: 'Dạ em xin lỗi vì để anh chờ. Lần này khách chọn ứng viên khác ạ.', s: 2, react: 'Ừ. Tiếc nhỉ. Anh hỏi lý do được không?' },
              { t: 'Dạ em gửi email thông báo rồi ạ', s: 1, react: 'Email nào? Anh không thấy.' },
            ] },
            { them: 'Lý do là gì em?', options: [
              { t: 'Dạ em nói thật để anh rút kinh nghiệm: khách thấy anh hơi lớn tuổi so với team trẻ bên họ ạ.', s: 0, react: 'Cái đó mà cũng là lý do à?' },
              { t: 'Dạ khách cần người đã triển khai ERP. Phần thuế thì họ khen anh.', s: 2, react: 'Góp ý cụ thể. Cảm ơn em.' },
              { t: 'Dạ em cũng không rõ lắm ạ', s: 1, react: 'Vậy anh tự đoán vậy.' },
            ] },
            { them: 'Em giữ hồ sơ anh cho vị trí khác được không?', options: [
              { t: 'Dạ được ạ, em gửi hồ sơ anh cho tất cả khách đang tuyển kế toán luôn nhé, càng nhiều nơi càng nhanh ạ.', s: 0, react: 'Không, cảm ơn em.' },
              { t: 'Dạ để em xem ạ', s: 1, react: 'Ừ.' },
              { t: 'Dạ được ạ. Mỗi lần gửi đi em sẽ hỏi ý anh trước.', s: 2, react: 'Đồng ý. Có gì báo anh.' },
            ] },
          ],
          end: { good: 'Cảm ơn em. Có vị trí hợp nhớ anh nhé.', bad: 'Thôi, anh tự tìm vậy. Chào em.' } },
      ] },

    { id: 'hr_client', type: 'chat', title: 'Nhắn tin với khách tuyển dụng', icon: '🏢', time: 85, pass: 0.6,
      prompt: 'Khách hàng doanh nghiệp đang nhắn. Giữ khách, nhưng giữ cả luật và uy tín nghề. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Ông Tài', emoji: '🏭', role: 'Giám đốc · Bao Bì Phú Quý (khách)', app: 'Zalo' },
          start: ['Em tìm cho anh một kế toán. Nữ, dưới 25, chưa chồng, ưa nhìn nhé.'],
          turns: [
            { options: [
              { t: 'Dạ ok anh, em lọc theo đúng các tiêu chí đó luôn, bên em có bộ lọc tuổi và giới tính sẵn trên hệ thống ạ.', s: 0, react: 'Tốt, nhanh lên nhé.' },
              { t: 'Dạ vâng. Anh cần kinh nghiệm, phần mềm, mảng thuế nào ạ?', s: 2, react: 'À… biết MISA, làm được báo cáo thuế.' },
              { t: 'Dạ yêu cầu đó vi phạm luật đấy anh!', s: 1, react: 'Anh nói vui thôi mà. Căng thế.' },
            ] },
            { them: 'Nhưng người có gia đình hay xin nghỉ lắm em ạ.', options: [
              { t: 'Dạ mình ghi rõ giờ làm, mùa quyết toán vào JD. Lọc theo hôn nhân là mất người giỏi ạ.', s: 2, react: 'Ừ, ghi rõ mùa quyết toán phải tăng ca.' },
              { t: 'Dạ đúng ạ, kinh nghiệm bên em cũng thấy vậy, em sẽ ưu tiên người độc thân để anh đỡ lo ngày công ạ.', s: 0, react: 'Ừ.' },
              { t: 'Dạ ai cũng nghỉ mà anh', s: 1, react: 'Thế thì tuyển ai?' },
            ] },
            { them: 'Lương anh trả 8 triệu thôi, nhưng phải 5 năm kinh nghiệm.', options: [
              { t: 'Dạ dễ mà anh, bên em có sẵn 200 hồ sơ kế toán, trong tuần này em đảm bảo có người đi làm ạ.', s: 0, react: 'Tốt! Thứ Hai có người nhé.' },
              { t: 'Dạ chắc khó đấy anh ạ', s: 1, react: 'Khó thì mới thuê headhunter chứ.' },
              { t: 'Dạ 5 năm thường 15–18 triệu. 8 triệu thì mình tìm người 1–2 năm ạ.', s: 2, react: 'Ờ… vậy 12 triệu, 3 năm. Được không?' },
            ] },
          ],
          end: { good: 'Ok, em gửi JD mới để anh duyệt nhé.', bad: 'Thôi, anh tự đăng Facebook tuyển vậy.' } },
        { who: { name: 'Chị Kim Anh', emoji: '🏢', role: 'HR Manager · Đất Vàng Land (khách)', app: 'Teams' },
          start: ['Em ơi, chị cần Trưởng phòng Marketing gấp. Gấp là thứ Hai có người đi làm.'],
          turns: [
            { options: [
              { t: 'Dạ được chị, em hứa thứ Hai có người đi làm, chị cứ báo sếp yên tâm, bên em làm việc rất nhanh ạ.', s: 0, react: 'Tuyệt! Chị báo sếp luôn nhé.' },
              { t: 'Dạ người giỏi thường báo nghỉ 30–45 ngày. Em gửi shortlist trong 5 ngày ạ.', s: 2, react: 'Lâu vậy à… thôi được, 5 ngày nhé.' },
              { t: 'Dạ em cố gắng hết sức ạ', s: 1, react: 'Cố gắng là bao giờ em?' },
            ] },
            { them: 'Săn Đầu Pro gửi chị CV chị Yến rồi. Em có gửi nữa không?', options: [
              { t: 'Dạ em vẫn gửi chị Yến kèm đánh giá chi tiết hơn bên kia, chị so sánh rồi chọn bên nào làm tốt hơn ạ.', s: 0, react: 'Rồi hai bên cùng đòi phí chị à?' },
              { t: 'Dạ bên kia gửi trước thì em không gửi trùng ạ.', s: 2, react: 'Chuyên nghiệp đấy. Chị ghi nhận.' },
              { t: 'Dạ chị Yến là ứng viên của bên em mà chị', s: 1, react: 'Thế ai đúng? Chị đau đầu quá.' },
            ] },
            { them: 'Phí bên em bao nhiêu? Bên kia lấy 15% thôi.', options: [
              { t: 'Dạ chắc cũng tầm đó ạ', s: 1, react: 'Tầm đó là bao nhiêu?' },
              { t: 'Dạ để giữ chị, em giảm còn 10% luôn ạ. Em xin chị Ngân sau, chị cứ yên tâm ký nhé.', s: 0, react: 'Chốt 10% nhé, chị chụp màn hình rồi.' },
              { t: 'Dạ chị Ngân sẽ báo phí theo hợp đồng ạ, có bảo hành 60 ngày.', s: 2, react: 'Ok, chị chờ báo giá.' },
            ] },
          ],
          end: { good: 'Thứ Sáu gửi chị shortlist nhé. Chị tin em.', bad: 'Chị chuyển sang làm với bên khác nhé.' } },
      ] },
  ],

  // errands that lead into the hands-on games (`play` = a desk game id; engine: game/office.js officeGameFor)
  tasks: [
    { id: 'desk_ghost', title: 'Gọi giữ ứng viên trước khi họ ghost', from: 'ngan', base: 50, legs: [
      { npc: 'ngan', line: ['ngan', 'Pipeline tuần này đang mờ dần. Em về máy gọi giữ từng người giúp chị, trước 4 giờ.'] },
      { obj: 'desk', play: 'hr_ghost', line: ['nar', 'Bạn gọi xong. Ba người nghe máy, một người nhắn "đang họp", một người là bot.'] },
      { npc: 'ngan', line: ['ngan', 'Giữ được người là giữ được khách. Tốt.'] },
    ] },
  ],

  chatter: [
    { id: 'hr_ch_kpi', chat: [['quan', 'Mình 52 CV rồi nha 💪'], ['vy', '52 CV mà 3 cái mở ra là ảnh cưới'], ['duy', 'Chất lượng hơn số lượng! …Nhưng mai ai dưới 40 thì họp nhé.'], ['ngan', 'Cái nào gửi khách được thì gửi chị. Còn lại đừng.']],
      scene: [
        ['think', 'Chất lượng hơn số lượng. Nhưng số lượng có cuộc họp riêng.'],
        { c: 'hr_desk_kpi', o: [
          { t: 'Gửi chị Ngân 3 CV mình chắc nhất', fx: { rel: { ngan: 1 }, uy: 2 } },
          { t: 'Gõ "Mình 53" cho Quân tức', fx: { dr: 2, rel: { quan: -1, vy: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'hr_ch_payday', chat: [['thao', 'Lương tháng này về trong tuần nhé cả nhà 💜'], ['quan', 'Tuần nào ạ? Mẹ mình hỏi'], ['thao', 'Tuần… có ngày lương ạ'], ['my', 'Chị biết lương của tất cả mọi người. Chị không biết khi nào nó về.']],
      scene: [
        ['think', 'Công ty tư vấn nhân sự. Lương về "trong tuần". Tuần nào thì là bí mật kinh doanh.'],
        { c: 'hr_desk_payday', o: [
          { t: 'Nhắn riêng chị Thảo: "Em đối chiếu bảng công giúp chị nhé"', fx: { rel: { thao: 2 }, nl: -3 } },
          { t: 'Hỏi lên group: "Tuần có ngày lương là tuần nào ạ?"', fx: { dr: 2, rel: { quan: 1, thao: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'hr_ch_ghost', chat: [['tuan', 'Anh Sơn xác nhận phỏng vấn 9h rồi nhé'], ['tuan', '9h15 rồi'], ['tuan', 'Zalo anh Sơn: "Đã xem"'], ['vy', 'Mèo Ghost cũng vừa đi ngang qua bàn mình. Điềm.'], ['ngan', 'Gọi lại, lịch sự, hỏi lý do. Không ai ghost lại ai.']],
      scene: [
        ['think', 'Ứng viên đã xem. Mèo đã đi qua. Chỉ có cuộc phỏng vấn là chưa tới.'],
        { c: 'hr_desk_ghost', o: [
          { t: 'Soạn giúp anh Tuấn tin nhắn hỏi thăm lịch sự', fx: { rel: { tuan: 1, ngan: 1 }, clock: 5 } },
          { t: 'Thả 👻 vào tin của Vy', fx: { dr: 2, rel: { vy: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'hr_ch_bach', chat: [['bach', 'Tin vui: anh vừa ký khách mới! 🎉'], ['bach', 'Anh hứa shortlist 5 người trong 48 tiếng'], ['vy', 'Vị trí gì ạ'], ['bach', 'Kỹ sư AI biết tiếng Đức, lương 15 triệu. Chắc kèo.'], ['ngan', 'Bách. Vào phòng chị.']],
      scene: [
        ['think', 'Kỹ sư AI, tiếng Đức, mười lăm triệu. Có lẽ phải tìm ở một hành tinh khác.'],
        { c: 'hr_desk_bach', o: [
          { t: 'Nhờ chị My số lương thị trường, gửi chị Ngân', fx: { uy: 2, rel: { my: 1, ngan: 1 }, nl: -2 } },
          { t: 'Gõ "chắc kèo 🔥"', fx: { dr: 2, rel: { bach: 1, ngan: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'hr_ch_linkedin', chat: [['duy', 'Anh vừa đăng: "Sếp giỏi là sếp biết lắng nghe" 🙏'], ['duy', 'Cả nhà like và comment giúp anh nhé. Comment dài dài'], ['khoa', 'Em comment "Rất truyền cảm hứng ạ" lần thứ 31'], ['phat', 'Anh ơi em hỏi về hợp đồng lao động từ tháng 6 ạ'], ['duy', 'Mình nói chuyện đó sau nhé! Lắng nghe là một quá trình.']],
      scene: [
        ['think', 'Bài đăng về lắng nghe. Câu hỏi về hợp đồng. Một trong hai được lắng nghe.'],
        { c: 'hr_desk_linkedin', o: [
          { t: 'Nhắn riêng Phát: "Mình soạn giúp bạn email xin HĐLĐ, có dẫn luật"', fx: { rel: { phat: 2 }, dr: 1, set: { hr_desk_phat_contract: true } } },
          { t: 'Like bài, comment một câu cho xong', fx: { rel: { duy: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'hr_ch_icebreaker', chat: [['khoa', 'Họp kỷ luật 3h chiều nay mở màn bằng icebreaker nhé!'], ['khoa', 'Mỗi người kể một điều mình biết ơn'], ['quan', 'Ai bị kỷ luật ạ 😳'], ['khoa', 'Bí mật. Nhưng người đó cũng phải chơi.'], ['thao', 'Talent Room đang là kho. Ai dọn giúp chị với']],
      scene: [
        ['think', 'Một cuộc họp kỷ luật có trò chơi khởi động. Người bị kỷ luật phải nói mình biết ơn điều gì.'],
        { c: 'hr_desk_icebreaker', o: [
          { t: 'Dọn Talent Room giúp chị Thảo', fx: { rel: { thao: 1, khoa: 1 }, nl: -2 } },
          { t: 'Nhắn riêng anh Khoa: "Anh ơi ai thế ạ?"', fx: { dr: 3 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'hr_ch_ats_sort', chat: [['phat', 'AI VỪA SORT CỘT "TÊN" TRONG ATS'], ['phat', 'Giờ anh Nguyễn Văn A có số điện thoại của ba chị Trần Thị B'], ['quan', 'Mình chỉ muốn xếp theo bảng chữ cái thôi 🥲'], ['vy', 'Lịch sử phiên bản, bản 10:42. Trước khi Quân được sinh ra.']],
      scene: [
        ['think', 'Mười bốn nghìn dòng, một cú sort. Và một nút "Lịch sử phiên bản" chưa ai bấm bao giờ.'],
        { c: 'hr_desk_ats_sort', o: [
          { t: 'Khôi phục bản 10:42, nhắn Phát "xong rồi"', fx: { rel: { phat: 2 }, uy: 1, clock: 5 } },
          { t: 'Thả 😂 vào tin của Quân', fx: { dr: 2, rel: { quan: -1 } } },
          { t: 'Nhắn riêng Quân: "Không sao đâu, ai cũng từng sort"', fx: { rel: { quan: 2 } } },
        ] },
      ] },
    { id: 'hr_ch_milktea', chat: [['tuan', 'Anh mời cả nhà trà sữa mừng placement! 🧋'], ['my', 'Placement còn trong bảo hành. Mừng sớm quá.'], ['tuan', '…Vậy trà sữa có điều kiện. Ứng viên nghỉ thì mọi người trả lại.'], ['my', 'Size L ở quán dưới nhà 55 nghìn. Hơi trên P75 khu này.']],
      scene: [
        ['think', 'Trà sữa có bảo hành 60 ngày. Chị My đã định giá xong trước khi ai kịp đặt.'],
        { c: 'hr_desk_milktea', o: [
          { t: 'Nhận đặt hộ anh Tuấn, ít đường', fx: { rel: { tuan: 1 }, clock: 5 } },
          { t: 'Hỏi chị My: "P75 trà sữa là bao nhiêu ạ?"', fx: { rel: { my: 1 }, dr: 1 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'hr_ch_rival', chat: [['vy', 'Săn Đầu Pro vừa gửi cùng ứng viên cho Đất Vàng 😤'], ['vy', 'Chị Hạnh còn nhắn riêng: "Tối về ăn cơm không em gái"'], ['bach', 'Khách hỏi ai gửi trước. Anh bảo mình. Chắc kèo.'], ['ngan', 'Vy, gửi chị email đồng ý của ứng viên. Có giờ gửi.']],
      scene: [
        ['think', 'Cuộc chiến giành ứng viên. Phe bên kia là chị gái của Vy. Bữa cơm tối nay sẽ dài.'],
        { c: 'hr_desk_rival', o: [
          { t: 'Lục ATS tìm email đồng ý của ứng viên, gửi chị Ngân', fx: { uy: 2, rel: { ngan: 1, vy: 1 }, nl: -2 } },
          { t: 'Nhắn Vy: "Tối nay cơm nhà căng nhỉ"', fx: { rel: { vy: 1 }, dr: 1 } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
  ],

  promoOffer: [
    ['nar', 'Năm giờ kém năm. Chị Ngân gửi shortlist xong, gập laptop, quay ghế về phía bạn.'],
    ['ngan', 'Em có năm phút không. Không phải chuyện xấu. Chị nói trước để em khỏi tim đập.'],
    ['ngan', 'Cả tháng nay phòng này họp kỷ luật có icebreaker, sort hỏng ATS, chờ lương "trong tuần". Còn em thì ngồi vào bàn làm.'],
    ['ngan', 'Chị mở file của em ra để sửa đỏ. Không có gì để sửa. Chị hơi khó chịu. Rồi chị sang gặp anh Duy.'],
    { if: F('hr_desk_phat_contract'), then: [['ngan', 'Phát kể em soạn giúp nó email xin hợp đồng. Một intern dạy công ty nhân sự cách làm nhân sự. Chị ghi nhận.']] },
    ['ngan', 'Chính thức. Consultant. Mười triệu lương cứng, hoa hồng sau bảo hành. Hợp đồng lao động thật, có bảo hiểm.'],
    ['ngan', 'Hợp đồng in sẵn rồi, có đủ chỗ cho hai chữ ký. Chị bắt chị Thảo in trước khi chị nói câu này.'],
    ['think', 'Mười triệu. Một bản hợp đồng có thật. Ở công ty này, đó là phúc lợi lớn nhất.'],
    { c: 'hr_work_offer', o: [
      { t: 'Nhận lời. Ký ngay, đủ hai chữ ký.', fx: { uy: 5, rel: { ngan: 2 }, set: { accept_official: true } }, then: [
        ['ngan', 'Tốt. Thứ Hai em có KPI riêng. Chị vẫn đếm. Nhưng chị đếm placement, không đếm CV.'],
      ] },
      { t: '"Em cảm ơn chị, nhưng em muốn thử sức ở chỗ khác ạ."', fx: { set: { accept_official: false } }, then: [
        ['ngan', 'Chị hiểu. Người đúng chỗ không phải lúc nào cũng ở chỗ này. Chị viết thư giới thiệu cho em.'],
      ] },
    ] },
  ],
};
