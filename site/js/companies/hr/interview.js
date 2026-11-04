// Người Đúng Chỗ HR — Day 0: the interview. An HR firm whose own interview is chaotic.
const isTier = (...ids) => (s) => ids.includes(s.tier);

export const CV_MINI = {
  type: 'pick', title: 'Sàng lọc CV: Thực tập sinh Tuyển dụng', icon: '📄',
  prompt: 'JD: sinh viên năm cuối hoặc mới tốt nghiệp, đi làm full-time 3 tháng, giao tiếp tốt. Chọn 3 CV đáng mời phỏng vấn.',
  pick: 3, time: 40, pass: 0.66,
  items: [
    { text: 'Năm cuối ĐH, CTV tuyển dụng CLB 2 năm, full-time được', sub: 'CV 1 trang, có số liệu', correct: true },
    { text: 'Sinh viên năm 3, chỉ đi làm được sáng thứ Bảy', sub: '"Em rất đam mê nhân sự"' },
    { text: 'Giám đốc Nhân sự 12 năm kinh nghiệm', sub: 'Kỳ vọng 60 triệu · "ứng tuyển nhầm"' },
    { text: 'Mới tốt nghiệp, 1 năm bán hàng qua điện thoại', sub: '"Không sợ bị cúp máy"', correct: true },
    { text: 'Thư xin việc mở đầu: "Dưới đây là thư xin việc của bạn"', sub: '(quên xóa dòng AI)' },
    { text: 'Năm cuối ngành Quản trị nhân lực, khóa luận về trải nghiệm ứng viên', sub: 'Full-time 3 tháng', correct: true },
    { text: 'File "CV.pdf": không tên, không số điện thoại', sub: 'Chỉ có ảnh một con mèo' },
  ],
};

export const CONTRACT_MINI = {
  type: 'pick', title: 'Thỏa thuận thực tập (sửa tạm từ mẫu của khách)', icon: '📝',
  prompt: 'Tìm 3 điều khoản "có vấn đề" trước khi ký.', pick: 3, time: 40, pass: 0.66,
  items: [
    { text: 'Bên A: Công ty TNHH Bao Bì Phú Quý', sub: 'Khoan… đây là tên khách', correct: true },
    { text: 'Phụ cấp chi trả "khi khách hàng thanh toán phí dịch vụ"', correct: true },
    { text: 'Thực tập sinh hoàn phí nếu ứng viên mình giới thiệu nghỉ trong 60 ngày', correct: true },
    { text: 'Không làm cho bất kỳ khách hàng nào của Bên A trong 24 tháng', correct: true },
    { text: 'Bảo mật thông tin ứng viên và khách hàng' },
    { text: 'Thời gian thực tập: 45 ngày' },
    { text: 'Có người hướng dẫn là Senior Consultant' },
    { text: 'Nghỉ phép báo trước 1 ngày làm việc' },
  ],
};

export const TAXFORM_MINI = {
  type: 'quiz', title: 'Bản cam kết thu nhập', icon: '🧾',
  prompt: 'Điền đúng từng ô. Chị Thảo chỉ có một bản gốc.', time: 40, pass: 0.75,
  questions: [
    { q: 'Ô "Họ và tên"', options: ['Tên của em, viết hoa có dấu', 'Tên LinkedIn của em', 'Người Đúng Chỗ HR'], correct: 0 },
    { q: 'Ô "Số định danh cá nhân"', options: ['Số điện thoại', '12 số trên Căn cước', 'Mã sinh viên'], correct: 1 },
    { q: 'Ô "Mã số thuế cá nhân"', options: ['Để trống vì chưa đi làm', 'Mã số thuế cá nhân (thường là số định danh)', 'Số tài khoản ngân hàng'], correct: 1 },
    { q: 'Ô "Ký, ghi rõ họ tên"', options: ['Ký tắt', 'Ký và ghi rõ họ tên', 'Thả tim như anh Duy'], correct: 1 },
  ],
};

export const INTERVIEW = {
  title: 'Buổi đầu tiên',
  subtitle: 'Phỏng vấn ở một công ty… chuyên phỏng vấn',
  intro: 'Chiều thứ Sáu, 14:00. Tầng 4 một tòa văn phòng hạng C, thang máy chỉ dừng ở tầng chẵn.\n\nTấm biển mica: "NGƯỜI ĐÚNG CHỖ HR · Right People. Right Place."\n\nĐây là công ty tư vấn tuyển dụng cho hàng trăm doanh nghiệp. Bạn nghĩ: chắc buổi phỏng vấn ở đây sẽ chuyên nghiệp nhất đời mình.',
  pos: { duy: 'meeting_head', ngan: 'mr_n1' },
  steps: [
    {
      who: 'thao', obj: 'Tới quầy lễ tân báo chị Thảo em đến phỏng vấn', time: '14:00',
      scene: [
        ['thao', 'Người Đúng Chỗ HR xin nghe… à không, em đứng trước mặt chị. Em tìm ai?'],
        ['me', 'Dạ em là {ten}, em đến phỏng vấn thực tập lúc 14 giờ ạ.'],
        ['thao', 'Phỏng vấn? Bên chị tuyển thực tập hả? …À, anh Duy đăng LinkedIn lúc 23 giờ tối qua. Chị đọc lúc 6 giờ sáng.'],
        ['nar', 'Chị Thảo kẹp điện thoại vào vai, tay trái gõ Excel, tay phải lục giấy. Trên bàn có ba tấm biển: "Lễ tân", "Kế toán", "HR".'],
        ['thao', 'Em điền giúp chị phiếu thông tin ứng viên nhé. Mẫu này của khách, em gạch logo bên đó đi là được.'],
        { c: 'hr_p_form', o: [
          { t: 'Điền phiếu, gạch logo khách thật cẩn thận.', fx: { nl: -4, rel: { thao: 2 } }, then: [
            ['nar', 'Phiếu ba trang. Câu số 7: "Anh/chị có chịu được ca đêm tại xưởng không?"'],
            ['think', 'Mình ứng tuyển thực tập văn phòng mà.'],
          ] },
          { t: '"Chị ơi, công ty mình không có mẫu riêng ạ?"', fx: { uy: 2, rel: { thao: 1 }, set: { asked_form: true } }, then: [
            ['thao', 'Có chứ. Mẫu riêng là… mẫu của khách, đã gạch logo. Bên chị làm mẫu biểu cho năm mươi công ty mà.'],
            ['thao', 'Cái gì làm cho khách thì đẹp lắm. Làm cho mình thì… để sau.'],
          ] },
          { t: 'Gửi CV qua Zalo cho nhanh.', fx: { dr: 2, rel: { thao: -1 } }, then: [
            ['thao', 'Zalo chị có 99 tin chưa đọc. Em vừa thành tin thứ 100. Thôi em điền giấy đi.'],
            { fx: { nl: -4 } },
          ] },
        ] },
        ['tuan', '(vọng ra từ pantry) Anh ơi, cơ hội này không đến hai lần đâu anh! …Dạ, em chờ.'],
        ['thao', 'Anh Tuấn đấy, đang chốt deal. Em vào Talent Room, cửa kính bên trái. Phòng họp kiêm kho, em đừng ngồi lên thùng giấy in.'],
      ],
    },
    {
      who: 'obj:interview', obj: 'Vào Talent Room ngồi xuống: buổi phỏng vấn', time: '14:10', seat: 'mr_seat',
      scene: [
        ['nar', 'Talent Room: một bàn họp, sáu thùng giấy in và một standee "WE ARE HIRING" quay mặt vào tường.'],
        ['duy', 'Chào em! Anh là Duy, Founder & Chief People Officer. Ở đây mình không phỏng vấn. Mình "trò chuyện để thấu hiểu".'],
        ['ngan', 'Chị là Ngân, Senior Consultant. Anh Duy ơi, CV của bạn ấy đâu ạ?'],
        ['duy', 'Anh để trong… LinkedIn. Không sao, mình nói chuyện bằng năng lượng. Câu một: nếu là một con vật, em là con gì?'],
        { c: 'hr_p_animal', o: [
          { t: '"Con ong ạ: chăm, làm theo nhóm, và biết tìm đúng hoa."', fx: { uy: 3, rel: { duy: 2 } }, then: [
            ['duy', 'Ong! Culture fit! Anh sẽ quote câu này lên LinkedIn.'],
            ['ngan', '(nhỏ) Anh ấy quote thật đấy. Em chuẩn bị tinh thần.'],
          ] },
          { t: '"Con mèo ạ. Độc lập và ngủ đủ giấc."', fx: { dr: 2, rel: { ngan: 1 } }, then: [
            ['duy', 'Mèo… hơi thiếu máu lửa. Mà văn phòng mình có một con mèo rồi, tên Ghost.'],
            ['ngan', 'Nó ghost cả anh Duy.'],
          ] },
          { t: '"Anh cho em hỏi, câu này đánh giá năng lực gì ạ?"', fx: { uy: 4, rel: { ngan: 2, duy: -1 }, set: { asked_why: true } }, then: [
            ['duy', 'Ờ… năng lực… tự nhận thức.'],
            ['ngan', 'Câu này không đánh giá gì cả. Bạn ấy hỏi đúng đấy anh.'],
            ['think', 'Ít nhất trong phòng có một người từng đọc sách tuyển dụng.'],
          ] },
        ] },
        ['ngan', 'Câu của chị, thật: ứng viên nhận offer xong nói "để em suy nghĩ thêm". Em hiểu là gì, và em làm gì?'],
        { c: 'hr_p_think', o: [
          { t: '"Thường là họ còn lựa chọn khác. Em hỏi khéo điều gì làm họ phân vân, rồi chốt mốc trả lời."', fx: { uy: 5, rel: { ngan: 2 }, set: { good_instinct: true } }, then: [
            ['ngan', 'Đúng. Đừng ép, đừng buông. Hỏi lý do, chốt thời gian.'],
          ] },
          { t: '"Em gửi thêm ba email nhắc ạ."', fx: { uy: 1 }, then: [
            ['ngan', 'Ba email là đủ để người ta chặn em. Nhưng ít ra em chăm.'],
          ] },
          { t: '"Là họ đồng ý rồi ạ, chỉ ngại thôi."', fx: { dr: 3, rel: { tuan: 1 } }, then: [
            ['tuan', '(vọng từ pantry) Chuẩn! Tư duy chốt!'],
            ['ngan', 'Anh Tuấn nghe lén từ pantry. Và anh ấy sai. "Để em suy nghĩ" thường là từ chối, em ạ.'],
          ] },
        ] },
        ['ngan', 'Giờ làm thử. Đây là bảy CV cho chính vị trí em đang ứng tuyển: Thực tập sinh Tuyển dụng. Chọn ba CV đáng mời.'],
        ['think', 'Mình đang sàng lọc… đối thủ của chính mình.'],
        { mini: CV_MINI,
          good: [['ngan', 'Ba CV đúng. Em đọc JD trước khi nhìn ảnh đại diện. Hiếm đấy.'], { fx: { uy: 4, rel: { ngan: 2 }, set: { screen_ok: true } } }],
          bad: [['ngan', 'Em vừa mời một bạn quên xóa dòng "Dưới đây là thư xin việc của bạn". Đọc kỹ dòng đầu nhé.'], { fx: { dr: 2 } }],
        },
        ['nar', 'Cửa bật mở. Một người cầm bút dạ và tờ giấy A0 bước vào, như thể đây là phòng riêng của anh ấy.'],
        ['khoa', 'Ơ, đang phỏng vấn hả? Anh Khoa, Training. Anh vào tìm bút dạ thôi. Mà đã vào rồi thì… em thuộc nhóm DISC nào?'],
        { c: 'hr_p_disc', o: [
          { t: '"Em chưa làm bài test ạ. Anh đoán thử?"', fx: { rel: { khoa: 2 } }, then: [
            ['khoa', 'S! Steady! Nhìn cách em ngồi là biết.'],
            ['duy', 'Anh thấy em hơi thiếu chữ D. D là Dám. Dám OT.'],
            ['think', 'Mình khá chắc D không phải là "Dám".'],
          ] },
          { t: '"Dạ D ạ: Dứt khoát."', fx: { dr: 1, rel: { duy: 2, khoa: 1 } }, then: [
            ['duy', 'D! Như anh!'],
            ['khoa', 'Anh Duy tự chấm mình D. Bài test của anh ấy ra C.'],
          ] },
          { t: '"Em nghĩ test tính cách không nên dùng để loại ứng viên ạ."', fx: { uy: 3, rel: { khoa: -1, ngan: 1 } }, then: [
            ['khoa', '…Đúng. Nhưng em nói nhỏ thôi, anh đang bán gói test cho ba khách.'],
            ['ngan', 'Anh Khoa, bút dạ ở thùng thứ tư.'],
          ] },
        ] },
        ['duy', 'Ok! Giờ đến phần quan trọng: phụ cấp. Bên anh tư vấn thang lương cho năm mươi doanh nghiệp. Thang lương của mình thì… em cứ đề xuất.'],
        ['ngan', '(nhỏ) Nói trước: lương nào việc nấy. Mức cao thì KPI cao. Thật đấy.'],
        { salary: true },
        { if: isTier('t0'), then: [['duy', 'Không lấy phụ cấp! Tinh thần đầu tư cho bản thân. Anh sẽ viết một bài LinkedIn về em.'], ['ngan', 'Em vẫn được ăn bánh ứng viên tặng ở pantry. Nhiều hơn em nghĩ.']] },
        { if: isTier('t1'), then: [['duy', 'Hợp lý! Có người hướng dẫn, KPI nhẹ: hai mươi CV một ngày.'], ['ngan', '"Nhẹ" là theo chuẩn của anh Duy.']] },
        { if: isTier('t3'), then: [['ngan', 'Ba triệu thì em tự chạy một job. Ứng viên ghost em thì em tự gọi lại.'], ['duy', 'Và có tên em trong email gửi khách! Ở cuối. Cỡ chữ 8.']] },
        { if: isTier('t5'), then: [
          ['nar', 'Anh Duy ngừng gõ LinkedIn.'],
          ['duy', 'Năm triệu. Ok. Vậy em chạy KPI bốn mươi CV một ngày như Vy, và đi gặp khách cùng anh.'],
          ['ngan', 'Chị sẽ review em kỹ. Kỹ theo đúng nghĩa em đang nghĩ.'],
          ['think', 'Câu này vừa là lời hứa, vừa là lời đe dọa.'],
        ] },
        ['ngan', 'Giờ ký thỏa thuận thực tập. Chị Thảo ơi, mẫu thỏa thuận của mình đâu ạ?'],
        ['thao', '(vọng vào) Mình không có mẫu riêng! Lấy tạm mẫu của khách, sửa tên là được!'],
        ['ngan', '…Em đọc kỹ giúp chị. Bản này "sửa tạm" từ hợp đồng của khách. Chị cho em ba mươi giây.'],
        { mini: CONTRACT_MINI,
          good: [
            ['me', 'Chị ơi, Bên A đang ghi Bao Bì Phú Quý, phụ cấp trả "khi khách thanh toán phí", và intern phải hoàn phí nếu ứng viên nghỉ ạ.'],
            ['ngan', '…Em vừa tìm ra ba lỗi mà chị dùng mẫu này hai năm chưa thấy. Chị sửa ngay.'],
            ['duy', 'Thấy chưa, culture fit! À, điều khoản hoàn phí là anh thêm vào cho vui thôi.'],
            { fx: { uy: 4, rel: { ngan: 2 }, set: { contract_fixed: true } } },
          ],
          bad: [
            ['nar', 'Bạn ký. Bên A của bạn hiện là "Công ty TNHH Bao Bì Phú Quý". Về giấy tờ, bạn vừa thành thực tập sinh của một xưởng bao bì.'],
            { fx: { dr: 2, set: { contract_blind: true } } },
          ],
        },
        ['duy', 'Chào mừng em đến với gia đình Người Đúng Chỗ! Qua chị Thảo làm nốt thủ tục nhé. Chị Thảo là… mọi phòng ban.'],
      ],
    },
    {
      who: 'thao', obj: 'Qua quầy chị Thảo làm thủ tục (Kế toán kiêm mọi thứ)', time: '15:00',
      scene: [
        ['thao', 'Ngồi đi em. Giờ chị là kế toán nên chị nói chuyện tiền. Hai phút thôi, chị còn phải làm lễ tân.'],
        { if: isTier('t0'), then: [['thao', 'Em không nhận phụ cấp nên không có gì để khấu trừ. Nhưng vẫn ký ba bản xác nhận. Bản gốc.'], { fx: { rel: { thao: 1 } } }] },
        { if: isTier('t1', 't3'), then: [
          ['thao', 'Phụ cấp của em dưới năm triệu một lần chi, nên không bị khấu trừ thuế. Em ký nhận ba bản.'],
          { if: isTier('t3'), then: [['thao', 'Hồi đầu năm mức này còn bị trừ đấy. Từ tháng Bảy ngưỡng lên năm triệu rồi. Em may.']] },
          { fx: { rel: { thao: 1 } } },
        ] },
        { if: isTier('t5'), then: [
          ['thao', 'Năm triệu là đúng ngưỡng. Khoản chi từ năm triệu một lần cho người không có hợp đồng lao động thì công ty khấu trừ 10%.'],
          ['thao', 'Nếu cả năm em ước tính chưa tới mức phải nộp thuế thì làm bản cam kết, chị tạm không trừ. Em điền luôn nhé?'],
          { c: 'hr_p_tax', o: [
            { t: 'Điền bản cam kết ngay.', then: [
              { mini: TAXFORM_MINI,
                good: [['thao', 'Chuẩn. Em điền đúng ô mã số thuế ngay lần đầu. Anh Duy điền ba lần chưa đúng.'], { fx: { rel: { thao: 2 }, set: { tax_commit: true } } }],
                bad: [['thao', 'Nhầm ô rồi em. Điền lại giúp chị, bản gốc nhé.'], { fx: { nl: -6, rel: { thao: 1 }, set: { tax_commit: true } } }],
              },
            ] },
            { t: '"Chị cứ trừ 10% ạ, em sợ giấy tờ."', fx: { set: { tax_commit: false } }, then: [
              ['thao', 'Ok, mỗi lần chi em nhận chín mươi phần trăm. Cuối năm em tự quyết toán nhé.'],
            ] },
          ] },
        ] },
        ['me', 'Còn bảo hiểm thì sao ạ?'],
        ['thao', 'Em ký thỏa thuận thực tập, không phải hợp đồng lao động, nên công ty chưa đóng bảo hiểm xã hội cho em.'],
        ['thao', 'Nói nhỏ: Phát làm năm tháng rồi cũng chưa có hợp đồng. Chị nhắc anh Duy mỗi thứ Hai. Anh ấy thả tim.'],
        ['nar', '(Thông tin thuế và bảo hiểm được đơn giản hóa: thông tin giải trí, không phải tư vấn pháp lý.)'],
        { c: 'hr_p_paper', o: [
          { t: 'Xin một bản thỏa thuận đã ký để giữ.', fx: { uy: 2, rel: { thao: 1 }, set: { kept_copy: true } }, then: [
            ['thao', 'Bản có chữ ký anh Duy hả? …Anh ấy ký sau. Chị chụp tạm bản em ký cho em.'],
            ['think', 'Một bản hợp đồng có một chữ ký. Một nửa hợp đồng.'],
          ] },
          { t: 'Cảm ơn chị, không hỏi thêm.', fx: { rel: { thao: 1 } }, then: [
            ['thao', 'Em dễ thương. Ở đây ai hỏi nhiều là bị giao viết quy trình.'],
          ] },
        ] },
      ],
    },
    {
      who: 'tuan', obj: 'Anh Tuấn vẫy tay gọi bạn vào pantry', time: '15:30',
      scene: [
        ['tuan', '…Dạ anh cứ suy nghĩ, nhưng em nói thật: cơ hội này không đến hai lần. Dạ, chào anh!'],
        ['tuan', 'Intern mới hả? Ngồi đi. Anh Tuấn. Pantry này là văn phòng của anh. Ba điều cần nhớ.'],
        ['tuan', 'Một: không ai được giao việc ở pantry. Trừ anh giao việc cho ứng viên.'],
        ['tuan', 'Hai: con mèo tên Ghost. Nó biến mất đúng lúc em cần nó nhất. Giống ứng viên.'],
        ['tuan', 'Ba: ở đây ai cũng tư vấn nhân sự cho người khác. Đừng hỏi ai tư vấn cho mình.'],
        { c: 'hr_p_tuan', o: [
          { t: '"Anh có mẹo gì để ứng viên không ghost không ạ?"', fx: { rel: { tuan: 2 }, set: { tuan_tips: true } }, then: [
            ['tuan', 'Có. Gọi họ sau giờ làm. Nhớ tên con họ. Và đừng bao giờ hứa cái mình không chắc.'],
            ['think', 'Câu cuối nghe ngược hẳn với cuộc điện thoại anh vừa nói.'],
          ] },
          { t: '"Câu cơ hội không đến hai lần, anh nói mấy lần một ngày ạ?"', fx: { dr: 1, rel: { tuan: 1 } }, then: [
            ['tuan', 'Hôm nay mới mười một lần. Cơ hội thì không đến hai lần. Câu nói thì đến mười một lần.'],
          ] },
        ] },
        { chat: [
          ['duy', 'Chào mừng {ten} gia nhập Gia Đình Đúng Chỗ 💜 "Người đúng, chỗ đúng, thời điểm đúng." 🚀'],
          ['vy', 'welcome bạn 👋 thứ Hai mình chỉ cách mở 400 tab mà máy không chết'],
          ['phat', 'chào bạn. wifi là DungNguoi@2019. đừng hỏi vì sao chưa đổi'],
          ['quan', 'Chào bạn. Mình là Quân, intern, vào trước bạn một tuần. Tuần này mình 187 CV. Hẹn gặp 😊'],
          ['thao', 'Thứ Hai em nhớ mang Căn cước bản gốc nhé.'],
          ['nar', 'Group "Gia Đình Đúng Chỗ 💜" có 63 tin nhắn chưa đọc. 40 trong số đó là quote của anh Duy.'],
        ] },
      ],
    },
  ],
  diary: (s) => `Buổi đầu tiên ở Người Đúng Chỗ HR. Mình deal được mức ${({ t0: '0 đồng', t1: '1 triệu', t3: '3 triệu', t5: '5 triệu' })[s.tier] || '?'}. `
    + (s.flags.contract_fixed ? 'Thỏa thuận thực tập của mình suýt ghi tên một xưởng bao bì. Mình bắt được. ' : 'Mình ký hơi nhanh. Hình như Bên A là một xưởng bao bì. ')
    + 'Công ty tư vấn tuyển dụng, nhưng không ai đọc CV của mình. Thứ Hai bắt đầu.',
};
