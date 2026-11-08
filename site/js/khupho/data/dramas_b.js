// Khu phố T&M · dramas 15-28 (DESIGN.md 8.3, format docs/khupho/STORY_FORMAT.md). Plain data.
export const DRAMAS = [
  // ───────────────────────── Drama 15 ─────────────────────────
  {
    id: 'd15', no: 15, title: 'Bà Thắm Sa Đéc lên phố',
    who: ['kp:tham', 'bama:hung', 'bama:hang', 'bama:tu', 'bama:cosau'],
    minDay: 33,
    acts: [
      {
        gap: 0, place: 'cho', from: '07:00', to: '11:00',
        task: 'Có biến ở chợ: khô Sa Đéc vị y chang Ba & Má',
        scene: {
          lines: [
            ['nar', 'Sạp tạp hoá cô Sáu có thêm một mâm khô gà, bao giấy ghi tay: "Khô bà Thắm, Sa Đéc".'],
            ['bama:cosau', 'Bà Thắm gửi bán ké một mẻ. Ai nếm cũng nói giống khô Ba & Má, mà rẻ hơn mười ngàn.'],
            ['me', '(nếm thử) Ủa... giống thiệt. Giống tới cái độ cay tới trễ ba giây.'],
            ['bama:hung', '(đi ngang, thấy chữ "Sa Đéc") ... Ờ. Bác quên tắt bếp. Bác về.'],
            ['nar', 'Bác Hùng quay đầu nhanh như ba gác Chú Bảy lúc trễ hàng, bỏ quên bó rau muống đã trả tiền.'],
            ['bama:cosau', 'Ổng né cái mâm này như né hóa đơn. Có gì đó. Có gì đó nha con.'],
          ],
          choices: [
            { t: 'Cầm bó rau muống chạy theo trả bác', fx: { energy: -3, hearts: { 'bama:hung': 1 } },
              say: [['bama:hung', 'Cảm ơn con. Mà... con đừng kể là bác đi ngang cái sạp đó nha.']] },
            { t: 'Mua một bịch khô Sa Đéc về nghiên cứu', fx: { money: -35000, food: 5, hearts: { 'bama:cosau': 1 } },
              say: [['bama:cosau', 'Bà Thắm 78 tuổi rồi, tự phơi tự nướng. Ăn đi rồi con hiểu vì sao ổng chạy.']] },
            { t: '(Ba & Má) Hỏi nhỏ bác Hùng có quen bà Thắm không', role: 'bama', fx: { hearts: { 'bama:hung': 1 }, flag: 'd15_hoi_ba' },
              say: [['bama:hung', 'Quen... hồi bác còn đạp xe bán khô dạo miền Tây. Thôi, chuyện cũ. Đừng nói Má.']] },
          ],
        },
        missed: 'Cô Sáu Tạp Hóa: Bác Hùng đi ngang sạp khô Sa Đéc rồi quay đầu cái rụp, bỏ quên bó rau muống. Ba ngày nay bác không ra chợ.',
      },
      {
        gap: 2, place: 'cho', from: '07:00', to: '11:00',
        task: 'Cô Tư tổ chức nếm khô bịt mắt giữa chợ',
        scene: {
          lines: [
            ['bama:tu', 'Bếp Ba & Má không sợ ai. Đem khăn ra đây, nếm bịt mắt, công khai giữa chợ!'],
            ['nar', 'Một bà cụ nhỏ xíu, nón lá, giỏ đệm, bước xuống xe khách. Cả chợ tự dạt ra như có loa khu phố.'],
            ['kp:tham', 'Tui là Thắm, ở Sa Đéc. Nghe nói có người nếm khô của tui. Cho tui nếm luôn khô bên kia.'],
            ['kp:tham', '(nếm khô Ba & Má) Rang lửa riu riu, lá chanh xắt sợi, ớt hiểm phơi một nắng... Công thức của tui mà.'],
            ['bama:tu', 'Công thức của bếp tui! Tui nếm bốn chục năm nay rồi nha bà!'],
            ['kp:chin', 'Hai bà nói vậy là hòa. Mà ai làm trọng tài? Tui bán rau, tui chỉ phân biệt được rau muống.'],
          ],
          choices: [
            { t: 'Xung phong làm trọng tài nếm', fx: { food: 5, hearts: { 'kp:tham': 1, 'bama:tu': 1 } },
              say: [['me', 'Kết quả: hai dĩa giống nhau 99%. 1% còn lại là dĩa bên trái bị con ăn hết.'], ['kp:tham', 'Trọng tài này công bằng. Ăn nhiều mà công bằng.']] },
            { t: 'Đứng xa hóng, lâu lâu vỗ tay', fx: { mood: 3 },
              say: [['nar', 'Bạn vỗ tay đúng lúc Cô Tư bị ớt hiểm phơi một nắng đánh gục. Cô Tư liếc bạn. Bạn ngưng vỗ.']] },
            { t: '(Trà sữa) Mời hai bà ly trà xoài cho dịu cay', role: 'trasua', fx: { money: -30000, hearts: { 'kp:tham': 2, 'bama:tu': 1 }, flag: 'd15_tra_xoai' },
              say: [['kp:tham', 'Xoài này ngon. Mà xoài Sa Đéc ngon hơn. Con muốn tui gửi lên không?']] },
          ],
        },
        missed: 'Dì Chín: Cô Tư với bà Thắm đấu nếm khô bịt mắt giữa chợ, hòa. Bà Thắm nói đúng một câu "công thức của tui" rồi cả chợ im re.',
      },
      {
        gap: 1, place: 'bama', from: '08:00', to: '17:00',
        task: 'Bà Thắm tới Ba & Má: chỉ xin một dòng chữ',
        scene: {
          lines: [
            ['nar', 'Phòng khách Ba & Má. Bác Hùng ngồi thẳng lưng như đang chờ kiểm tra an toàn thực phẩm.'],
            ['kp:tham', 'Hùng. Hồi đó mày đạp xe theo tui ba tháng học rang khô. Giờ mày có xưởng. Tui mừng.'],
            ['bama:hung', 'Dạ... con xin lỗi bà. Con định nói hoài mà cái bao bì nó in sẵn rồi.'],
            ['kp:tham', 'Tui không đòi tiền. Tui chỉ muốn ghi tên tui một dòng nhỏ trên bao bì. Nhỏ thôi, cỡ hạt mè.'],
            ['bama:hang', '(bấm máy tính) In lại bao bì là tốn... Thôi, Má tính rồi. Tốn ít hơn mất uy tín.'],
            ['bama:hung', '(mắt đỏ) Khô gà cay quá. Không phải bác khóc đâu.'],
          ],
          choices: [
            { t: 'Thuyết phục bác Hùng ghi tên bà thật to', fx: { mood: 5, hearts: { 'kp:tham': 2, 'bama:hung': 1 }, flag: 'd15_ghi_ten', xomoi: 'Cô Sáu Tạp Hóa: Bao bì khô Ba & Má mới có dòng "Công thức học từ bà Thắm, Sa Đéc". Ai thấy thì khen một tiếng nha.' },
              say: [['bama:hung', 'Ghi. Ghi to. Ghi cỡ hạt đậu phộng luôn.']] },
            { t: 'Ngồi im, để hai người tự nói với nhau', fx: { hearts: { 'kp:tham': 1, 'bama:hang': 1 } },
              say: [['nar', 'Im lặng mười phút. Rồi bác Hùng tự lấy bút, viết lên mẫu bao bì: "Học từ bà Thắm". Hơi nhỏ. Nhưng có.']] },
            { t: '(Ba & Má) Đề xuất mời bà làm nhà cung cấp mùa Tết', role: 'bama', fx: { hearts: { 'kp:tham': 2, 'bama:hang': 2 }, flag: 'd15_ghi_ten' },
              say: [['bama:hang', 'Hay. Ghi tên bà trên bao, lấy khô bà bán Tết. Má thích cái gì vừa có tình vừa có lời.']] },
            { t: '(Trà sữa) Hứa ra món "Trà xoài Sa Đéc" tôn vinh bà', role: 'trasua', fx: { hearts: { 'kp:tham': 3 }, flag: 'd15_tra_xoai' },
              say: [['kp:tham', '78 tuổi có món nước mang tên mình. Để tui về khoe cả xóm Sa Đéc.']] },
          ],
        },
        missed: 'Cô Hằng: Bà Thắm có ghé xưởng. Ba con ngồi im 10 phút rồi tự viết lên mẫu bao bì "Học từ bà Thắm". Má đã duyệt chi phí in.',
      },
    ],
    end: 'Biên bản khu phố: Bao bì khô Ba & Má có thêm dòng "Công thức học từ bà Thắm, Sa Đéc". Ba & Má được khen, bà Thắm thành nhà cung cấp mùa Tết, bác Hùng đi chợ lại.',
  },

  // ───────────────────────── Drama 16 ─────────────────────────
  {
    id: 'd16', no: 16, title: 'Đêm karaoke vô tận',
    who: ['kp:thanh', 'kp:hoai', 'kp:cuong', 'kp:thuan', 'kp:hao'],
    minDay: 9, startOn: [6],
    acts: [
      {
        gap: 0, place: 'hem', from: '21:00', to: '23:59',
        task: 'Có biến ở hẻm: ông Thanh hát tới khuya',
        scene: {
          lines: [
            ['nar', '21h47. Từ nhà ông Thanh vang lên bài thứ mười bốn. Cái loa kéo có đèn bảy màu, đèn đỏ đang chớp theo nhịp tim cả hẻm.'],
            ['kp:thanh', '"Đêm nay trăng sáng quáaaa..." Hàng xóm ơi, vỗ tay đi! Điểm máy chấm 98!'],
            ['nar', 'Sát vách, cô Hoài ngồi trước cửa, chồng bài kiểm tra giữa kỳ cao tới đầu gối.'],
            ['kp:hoai', 'Bài em Tôm: "Lão Hạc nuôi một con chó tên Cậu Vàng". Cô cho 3. Khoan... là 8. Cái loa làm cô nhìn ra số 3.'],
            ['kp:hoai', 'Đây là bài thứ ba cô chấm sai tối nay. Cô không giận ông. Cô chỉ muốn cái loa đi ngủ.'],
            ['kp:thanh', 'Bài tiếp theo: "Một bài thôi"! (đây là bài thứ mười lăm)'],
          ],
          choices: [
            { t: 'Mở điện thoại ghi âm, để dành làm chứng cứ', fx: { mood: -2, flag: 'd16_ghi_am' },
              say: [['nar', 'File ghi âm dài 47 phút. Máy bạn tự đặt tên: "Đêm nay trăng sáng quá (bản cả hẻm)".']] },
            { t: 'Mang trà sữa qua nói chuyện với ông', fx: { money: -30000, hearts: { 'kp:thanh': 2 }, flag: 'd16_tra_sua' },
              say: [['kp:thanh', 'Ai cũng đóng cửa, chỉ có con mang nước qua. Ông hát bài cuối tặng con nha. Bài cuối thiệt.']] },
            { t: 'Rủ cô Hoài ra quán trà sữa ngồi chấm cho yên', fx: { money: -25000, hearts: { 'kp:hoai': 2 } },
              say: [['kp:hoai', 'Góc học nhóm ở quán yên quá. Cô sửa lại ba bài rồi. Em Tôm được 8, đúng của em.']] },
            { t: 'Tặng ông cái tai nghe để ông hát một mình', fx: { money: -50000, hearts: { 'kp:thanh': 1, 'kp:hoai': 1 } },
              say: [['nar', 'Ông Thanh đeo tai nghe, vẫn hát to như cũ, nhưng nhạc nền thì chỉ mình ông nghe. Cả hẻm nghe a cappella.']] },
          ],
        },
        missed: 'Bà Phấn: Tối qua ông Thanh hát 14 bài, tới 0h. Cô Hoài chấm sai 3 bài, sáng nay đi sửa điểm lại.',
      },
      {
        gap: 1, place: 'phongtro', from: '19:00', to: '23:30',
        task: 'Xóm Ơi chia phe vụ karaoke, mở điện thoại xem',
        scene: {
          lines: [
            ['nar', 'Bạn vừa về phòng, điện thoại rung 63 lần. Nhóm Xóm Ơi đang nóng hơn nồi lẩu thái.'],
            ['kp:phan', 'BÌNH CHỌN: (1) Để ông vui, ông lớn tuổi rồi. (2) Để người ta ngủ, mai còn đi làm. Mỗi nhà một phiếu, không gian lận.'],
            ['kp:hao', 'Ba tui đó. Tui chỉnh nhỏ loa rồi, ổng vặn lại. Ổng nói nhỏ quá thì "không ra cảm xúc".'],
            ['kp:hoai', 'Cô không bình chọn. Cô chỉ xin từ 21h trở đi, cảm xúc của ông nhỏ lại một chút.'],
            ['kp:thanh', 'Tui bình chọn phương án (3): cho tui hát chung với mọi người!'],
          ],
          choices: [
            { t: 'Bình chọn "để người ta ngủ"', fx: { hearts: { 'kp:hoai': 1, 'kp:thanh': -1 } },
              say: [['kp:phan', 'Phe "để người ta ngủ" đang dẫn một phiếu. Phiếu đó của {ten}. Tui ghi nhận.']] },
            { t: 'Bình chọn "để ông vui"', fx: { hearts: { 'kp:thanh': 1, 'kp:hoai': -1 } },
              say: [['kp:thanh', 'Con {ten} hiểu nghệ thuật! Tối mai ông hát tặng con bài "Phòng trọ thân thương".']] },
            { t: 'Đề xuất: ông hát tới 21h, sau đó đổi qua đọc thơ', fx: { mood: 2, hearts: { 'kp:hoai': 1, 'kp:hao': 1 }, flag: 'd16_de_xuat' },
              say: [['kp:hao', 'Ý hay. Thơ thì không cần loa. Tui gỡ dây loa lúc 21h, nói là "cập nhật phần mềm".']] },
          ],
        },
        missed: 'Bà Phấn: Bình chọn xong: 23 phiếu "để người ta ngủ", 22 phiếu "để ông vui", 1 phiếu "cho tui hát chung". Phiếu đó là ông Thanh.',
      },
      {
        gap: 1, place: 'khupho', from: '07:00', to: '11:00',
        task: 'Văn phòng Khu phố: chú Cường nhắc ông Thanh lần ba',
        scene: {
          lines: [
            ['kp:cuong', 'Anh Thanh, đây là lần nhắc thứ ba. Lần một tôi nhắc bằng miệng, lần hai bằng loa, lần ba tôi mời anh Thuận.'],
            ['kp:thuan', 'Từ 15/12/2025 không còn khung giờ 22h-6h nữa. Gây ồn ảnh hưởng chung bất kể giờ nào có thể bị cảnh cáo hoặc phạt 500.000-1.000.000đ (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:thuan', 'Muốn xử lý thì cần ghi âm, ghi hình làm chứng cứ. Nhưng tôi mong khỏi tới bước đó (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:thanh', '(cúi đầu) Tui hát... vì tui muốn có người nghe. Hồi trẻ tui làm MC đám cưới khắp miền Tây. Giờ không ai mời.'],
            ['kp:hao', 'Ba... sao ba không nói sớm. Con tưởng ba chỉ thích cái loa đèn bảy màu.'],
            ['kp:cuong', 'Ngày hội đại đoàn kết 18/11 khu phố đang thiếu MC. Mà ai đề cử đây?'],
          ],
          choices: [
            { t: 'Đề cử ông Thanh làm MC Ngày hội', fx: { mood: 4, hearts: { 'kp:thanh': 3, 'kp:cuong': 1 }, flag: 'd16_mc', xomoi: 'Chú Cường: Ngày hội 18/11 có MC là ông Thanh. Ông hứa tối nào cũng tắt loa lúc 21h để giữ giọng.' },
              say: [['kp:thanh', 'MC! Tui! Từ giờ tui tắt loa lúc 21h, giữ giọng cho Ngày hội. MC chuyên nghiệp phải biết nghỉ.']] },
            { t: 'Nhờ anh Hào gắn hẹn giờ tắt loa lúc 21h', fx: { hearts: { 'kp:hao': 2, 'kp:hoai': 1 } },
              say: [['kp:hao', 'Gắn rồi. 21h loa tự tắt, hiện chữ "Chúc ba ngủ ngon". Ba tui đọc xong không nỡ bật lại.']] },
            { t: 'Đưa file ghi âm cho anh Thuận lập biên bản', needFlag: 'd16_ghi_am', fx: { hearts: { 'kp:thuan': 1, 'kp:thanh': -2 } },
              say: [['kp:thuan', 'Tôi nhận, lập biên bản nhắc nhở lần đầu. Ông Thanh ký, ký xong hỏi "biên bản có cho hát kèm không".']] },
          ],
        },
        missed: 'Chú Cường: Đã nhắc ông Thanh lần ba, có anh Thuận. Hóa ra ông chỉ muốn được làm MC. Ông nhận MC Ngày hội 18/11, hứa tắt loa lúc 21h.',
      },
    ],
    end: 'Biên bản khu phố: Ông Thanh làm MC Ngày hội, tắt loa lúc 21h để "giữ giọng". Cô Hoài chấm lại đúng điểm. Giấc ngủ của bạn không còn bị trừ.',
  },

  // ───────────────────────── Drama 17 ─────────────────────────
  {
    id: 'd17', no: 17, title: 'Cặp MC đám cưới tái xuất',
    who: ['kp:vu', 'kp:huyen', 'event:duy', 'event:lan', 'event:toan', 'kp:thanh', 'bama:bay'],
    minDay: 26, startOn: [4],
    acts: [
      {
        gap: 0, place: 'bagac', from: '14:00', to: '17:30',
        task: 'Chở bàn ghế đám cưới anh Vũ trước khi mưa',
        scene: {
          lines: [
            ['nar', 'Trời đen như màn hình tắt. Trước Ba & Má, ba gác Chú Bảy chất 40 cái ghế nhựa đỏ và 6 cái bàn tròn.'],
            ['event:toan', 'Bàn ghế anh lấy giá người quen. Người quen của người quen của anh. Đừng làm trầy là được.'],
            ['kp:vu', 'Tui chạy xe app mười năm, chưa bao giờ sợ mưa. Nay sợ. Mai tui cưới mà ghế ướt thì chị Huyền ngồi đâu.'],
            ['bama:bay', 'Ba gác này chở khô gà, chở tủ lạnh, chở người say. Chở ghế đám cưới là lần đầu. Ai phụ tui chằng bạt?'],
            ['nar', 'Một hạt mưa rơi trúng mũi bạn. Rồi hạt thứ hai, kéo theo cả gia đình nó.'],
          ],
          choices: [
            { t: 'Phụ Chú Bảy chằng bạt, chạy kịp trước mưa', fx: { energy: -8, hearts: { 'bama:bay': 2, 'kp:vu': 1 }, flag: 'd17_kip_mua' },
              say: [['bama:bay', 'Kịp! Ghế khô, bàn khô, chỉ có tui với con là ướt. Ướt vậy mới ra phụ ba gác.']] },
            { t: 'Đi bộ theo, cầm dù che mấy cái bàn', fx: { energy: -3, mood: 2, hearts: { 'kp:vu': 1 } },
              say: [['nar', 'Cây dù che được một cái bàn rưỡi. Bàn rưỡi đó được anh Vũ đặt làm bàn cô dâu.']] },
            { t: '(Đi Đâu Cũng Được) Gọi kho xuất thêm bạt, dựng rạp luôn', role: 'event', fx: { energy: -5, hearts: { 'event:toan': 2, 'kp:vu': 1 }, flag: 'd17_kip_mua' },
              say: [['event:toan', 'Thực tập sinh này biết gọi kho! Rạp lên trong 20 phút, đứng vững hơn hợp đồng của anh.']] },
          ],
        },
        missed: 'Chú Bảy: Chở bàn ghế đám cưới anh Vũ, mắc mưa giữa đường. Ghế ướt, lau tới tối. Ai rảnh mai phụ tui lau nha.',
      },
      {
        gap: 1, place: 'hem', from: '17:00', to: '20:00',
        task: 'Hẻm 7: hai MC đám cưới tập dượt lần thứ ba',
        scene: {
          lines: [
            ['nar', 'Rạp đám cưới hẻm 7 đã dựng. Trên sân khấu, anh Duy đeo ba bộ đàm, chị Lan cầm kịch bản bọc nhựa.'],
            ['event:lan', 'Tập lần ba. Lần một anh vào trễ nửa nhịp, lần hai anh vào sớm nửa nhịp. Lần này vào đúng nhịp giùm em.'],
            ['event:duy', 'Lần trước tụi mình làm MC chung là đám cưới năm 2017, có tiết mục múa lân...'],
            ['event:lan', 'Đừng nhắc. Anh cầm đầu lân, em cầm đuôi, anh rẽ trái, em rẽ phải. Con lân bị chia hai.'],
            ['kp:huyen', 'Hai anh chị tập kỹ vậy làm em hồi hộp quá. Anh Vũ hồi hộp tới mức rửa xe ba lần.'],
            ['event:toan', 'Thiếu người đứng làm cô dâu chú rể đóng thế cho hai MC tập. Ai rảnh không?'],
          ],
          choices: [
            { t: 'Đứng đóng thế cô dâu chú rể cho hai MC tập', fx: { energy: -3, mood: 3, hearts: { 'event:lan': 2, 'event:duy': 1 } },
              say: [['event:lan', 'Tốt. Bước tới ba bước, cúi chào, đừng nhìn vô ống kính tưởng tượng. Lần này hoàn hảo.']] },
            { t: 'Nhắc khéo: lần này đừng có tiết mục lân nha', fx: { hearts: { 'event:lan': 1, 'event:duy': -1 } },
              say: [['event:duy', 'Không có lân. Chỉ có... một con rồng nhỏ. Đùa thôi. Không có con gì hết.']] },
            { t: '(Đi Đâu Cũng Được) Cầm bộ đàm thứ tư chạy cue nhạc', role: 'event', fx: { energy: -4, hearts: { 'event:duy': 2, 'event:lan': 1 }, flag: 'd17_cue' },
              say: [['event:duy', 'Bộ đàm số bốn nghe rõ không? Rõ thì nói "rõ". Đừng nói "dạ có em", nghe như điểm danh.']] },
          ],
        },
        missed: 'Chị Huyền: Hai MC tập dượt 3 lần, lần thứ ba anh Duy cầm micro như cầm đầu lân. Cả hẻm vỗ tay mà không hiểu vì sao.',
      },
      {
        gap: 1, place: 'hem', from: '18:00', to: '22:00',
        task: 'Đám cưới hẻm 7: ông Thanh xin micro "một bài thôi"',
        scene: {
          lines: [
            ['nar', 'Đám cưới anh Vũ và chị Huyền. Đèn dây vàng, lẩu thái, 40 ghế đỏ khô ráo hoặc đã lau.'],
            ['event:lan', 'Xin mời cô dâu chú rể tiến vào lễ đài!'],
            ['event:duy', '(đúng nhịp lần đầu tiên trong đời) ...và tiếng vỗ tay của bà con hẻm 7!'],
            ['kp:thanh', '(đứng dậy, tay cầm micro không biết lấy ở đâu) Tui xin một bài thôi. Một bài tặng cô dâu chú rể!'],
            ['event:duy', 'Bác ơi, kịch bản không có tiết mục này. Micro đó là micro dự phòng của em mà.'],
            ['kp:vu', '(nhìn bạn cầu cứu) Đám cưới tui mà, ai cũng vui là được... đúng không?'],
          ],
          choices: [
            { t: 'Chia cho ông Thanh đúng một bài', fx: { mood: 4, hearts: { 'kp:thanh': 2, 'event:duy': 1, 'kp:vu': 1 }, flag: 'd17_mot_bai' },
              say: [['nar', 'Ông Thanh hát một bài. Anh Duy hát bè. Hai người song ca thêm hai bài nữa. "Một bài thôi" bằng ba bài.']] },
            { t: 'Giúp anh Duy giữ micro, kịch bản là kịch bản', fx: { hearts: { 'event:duy': 1, 'kp:thanh': -1 } },
              say: [['kp:thanh', 'Thôi được. Tui ngồi ăn lẩu. Mà lẩu này nêm nhạt, giống MC chưa có ông.']] },
            { t: 'Đi bưng mâm phụ, ăn ké một chén lẩu', fx: { energy: -4, food: 15, hearts: { 'kp:vu': 1, 'kp:huyen': 1 } },
              say: [['kp:huyen', 'Cảm ơn {ten}. Mâm nào cũng tới đúng bàn, trừ mâm bạn tự ăn. Mâm đó cũng đúng.']] },
          ],
        },
        missed: 'Anh Vũ: Đám cưới xong rồi! Ông Thanh giành micro "một bài thôi", rồi song ca với anh Duy thêm hai bài. Cảm ơn cả hẻm.',
      },
    ],
    end: 'Biên bản khu phố: Đi Đâu Cũng Được có thêm hợp đồng đám cưới hẻm. Anh Vũ chở bạn miễn phí một tuần. Ông Thanh và anh Duy làm hòa, hẹn song ca đám sau.',
  },

  // ───────────────────────── Drama 18 ─────────────────────────
  {
    id: 'd18', no: 18, title: 'Đêm say quên đường về',
    who: ['tech:thac', 'kp:manh', 'kp:luong', 'kp:dinh', 'bama:bay'],
    minDay: 3, startOn: [5],
    acts: [
      {
        gap: 0, place: 'quannhau', from: '21:30', to: '23:59',
        task: 'Có biến ở quán nhậu: anh Thạc đòi tự chạy xe về',
        scene: {
          lines: [
            ['nar', '22h30, bàn số 4 quán Một Hai Ba Dô. Anh Thạc nâng ly thứ mười một: "Mừng deploy! Production sống rồi!"'],
            ['tech:thac', 'Tui chưa ngủ từ thứ Ba. Giờ tui về. Tui tự chạy. Tui là CTO.'],
            ['kp:manh', 'Anh Thạc, anh đang cầm chìa khóa nhà mà cắm vô ổ khóa xe đó.'],
            ['kp:manh', 'Xe máy có nồng độ cồn mức 1: phạt 2-3 triệu, trừ 4 điểm, có thể tạm giữ xe tới 7 ngày nha anh (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:luong', 'Xe ôm đây. Chú chở, năm chục, khuyến mãi cho người mừng deploy.'],
            ['tech:thac', 'Nhà tui... nhà tui ở đâu ta. Chỗ nào có thang máy là nhà.'],
          ],
          choices: [
            { t: 'Giữ chìa khóa xe, gọi chú Lương chở anh về', fx: { hearts: { 'tech:thac': 2, 'kp:manh': 1, 'kp:luong': 1 }, flag: 'd18_giu_chia' },
              say: [['kp:luong', 'Lên xe. Nhà ở đâu? "Chỗ có thang máy". Rồi, cả khu phố có một chỗ có thang máy. Cao ốc.']] },
            { t: 'Để anh tự đi, chắc không sao đâu', fx: { mood: -4, hearts: { 'tech:thac': -1 } },
              say: [['nar', 'Đầu hẻm có chốt kiểm tra nồng độ cồn. Anh Thạc thổi một hơi, máy kêu như build lỗi. Xe về bãi tạm giữ, anh Thạc đi bộ.']] },
            { t: '(Nợ Kỹ Thuật) Nhắn chị Thảo COO: "CTO mình đang ở quán"', role: 'tech', fx: { hearts: { 'tech:thac': 1, 'tech:thao': 1 }, flag: 'd18_giu_chia' },
              say: [['nar', 'Chị Thảo trả lời trong 4 giây: "Giữ chìa khóa. Runway không có dòng nào cho tiền phạt."']] },
          ],
        },
        missed: 'Chú Lương: Tối qua anh Thạc nhậu mừng deploy, đòi tự chạy. Anh Mạnh giữ chìa khóa, tui chở ổng tới cao ốc vì ổng chỉ nhớ "chỗ có thang máy".',
      },
      {
        gap: 1, place: 'toanha', from: '06:30', to: '09:30',
        task: 'Cao ốc: có người ngủ trong thang máy tầng 5',
        scene: {
          lines: [
            ['kp:dinh', 'Em ơi, phụ anh với. 5h sáng anh thấy một ông ngủ trong thang máy, cửa mở ra đóng vô ở tầng 5 bốn chục lần.'],
            ['kp:dinh', 'Tầng 5 là Cân Đối. Bên đó lên làm sớm, thấy ổng, tưởng khách hàng tới kiểm kê.'],
            ['tech:thac', '(ngủ, nói mớ) Đừng merge... để tui review... cái nút này lệch 2 pixel...'],
            ['nar', 'Anh Thạc ôm cái cặp laptop như ôm gấu bông. Trên trán dính tờ giấy nhớ: "Tầng 7. Không phải tầng 5."'],
            ['kp:dinh', 'Anh phải trực sảnh, mà giờ cao điểm thang máy sắp kẹt. Em gọi ai giùm anh?'],
          ],
          choices: [
            { t: 'Gọi Chú Bảy chở anh Thạc về bằng ba gác', fx: { hearts: { 'bama:bay': 1, 'tech:thac': 1, 'kp:dinh': 1 }, flag: 'd18_ba_gac' },
              say: [['bama:bay', 'Lên đi, nằm giữa hai thùng khô gà. Đừng ăn vụng nha, khô đếm rồi.'], ['tech:thac', '(vẫn ngủ) ...mùi này... deploy thành công...']] },
            { t: 'Mua ly cà phê sữa đá dựng anh dậy', fx: { money: -20000, hearts: { 'tech:thac': 2 } },
              say: [['tech:thac', 'Tui đang ở đâu? Tầng 5? Tầng 5 không có bug của tui. Cảm ơn em, ly này tui nợ.']] },
            { t: 'Đắp áo cho anh, để ngủ thêm 30 phút', fx: { energy: -2, hearts: { 'kp:dinh': 1 } },
              say: [['kp:dinh', 'Bên Cân Đối vừa ghi vào sổ: "Phát hiện: người lạ trong thang máy. Mức độ: trọng yếu."']] },
          ],
        },
        missed: 'Anh Định: 5h sáng tui thấy anh Thạc ngủ trong thang máy tầng 5. Chú Bảy chở ổng về nhà giữa hai thùng khô gà.',
      },
      {
        gap: 0, place: 'quannhau', from: '17:00', to: '22:00',
        task: 'Anh Thạc quay lại quán nhậu cảm ơn',
        scene: {
          lines: [
            ['nar', 'Chiều tối. Anh Thạc tỉnh táo, tắm rửa, mặc áo thun ghi "Ship it". Tay cầm hộp bánh bò.'],
            ['tech:thac', 'Tui nghe kể hết rồi. Chìa khóa, xe ôm, thang máy, ba gác, khô gà. Tui xin lỗi và cảm ơn.'],
            ['kp:manh', 'Không sao. Mà từ nay quán tui tính treo một cái bảng. Chưa nghĩ ra chữ.'],
            ['kp:luong', 'Tối thứ Sáu tui đậu xe trước cửa quán từ 22h tới 23h. Ai say thì có xe, khỏi phải tìm thang máy.'],
            ['tech:thac', 'Tui hứa: deploy xong là đi ngủ. Không deploy luôn cái gan.'],
          ],
          choices: [
            { t: 'Gợi ý bảng "Giữ chìa khóa giúp bạn"', fx: { mood: 3, hearts: { 'kp:manh': 2 }, flag: 'd18_bang', xomoi: 'Anh Mạnh: Quán Một Hai Ba Dô treo bảng "Giữ chìa khóa giúp bạn". Uống rồi thì gửi chìa, chú Lương chở về.' },
              say: [['kp:manh', 'Hay! "Giữ chìa khóa giúp bạn". Tui in to, treo ngay chỗ tính tiền.']] },
            { t: 'Nhận một miếng bánh bò, ngồi nghe anh kể vụ deploy', fx: { food: 6, mood: 2, hearts: { 'tech:thac': 2 } },
              say: [['tech:thac', 'Vụ deploy là vầy: 3 giờ sáng, một dấu chấm phẩy... (kể 40 phút, bạn hiểu được 2 phút đầu)']] },
            { t: '(Nợ Kỹ Thuật) Nhắc anh Thạc: tối nay ngủ, đừng mở laptop', role: 'tech', fx: { hearts: { 'tech:thac': 3 } },
              say: [['tech:thac', 'Thực tập sinh dám nhắc CTO đi ngủ. Tui thích. Mai lên tầng 7 tui review code cho em, nhẹ tay.']] },
          ],
        },
        missed: 'Anh Mạnh: Anh Thạc có ghé quán cảm ơn, mang bánh bò. Quán tui treo bảng "Giữ chìa khóa giúp bạn" từ nay.',
      },
    ],
    end: 'Biên bản khu phố: Quán nhậu treo bảng "Giữ chìa khóa giúp bạn". Sổ Cân Đối ghi: "người lạ trong thang máy, đã đối chiếu, là CTO tầng 7".',
  },

  // ───────────────────────── Drama 19 ─────────────────────────
  {
    id: 'd19', no: 19, title: 'Cân điêu ở sạp thịt',
    who: ['kp:phu', 'bama:cautam', 'kp:lai', 'kp:phan', 'kp:thong'],
    minDay: 29,
    acts: [
      {
        gap: 0, place: 'comtam', from: '06:00', to: '10:00',
        task: 'Cơm tấm: 10 ký sườn cân lại chỉ còn 9',
        scene: {
          lines: [
            ['kp:thong', 'Cô Lài ơi, mười ký sườn sáng nay con cân lại ra chín. Cân hai lần vẫn chín.'],
            ['kp:lai', 'Chín? Hay là cái cân nhà mình mệt? Đưa cô cái bao gạo năm ký coi thử.'],
            ['nar', 'Bao gạo năm ký lên cân: năm ký. Cái cân nhà cô Lài khỏe re.'],
            ['kp:phan', '(đang ăn sáng, điện thoại đã giơ lên) Quay lại đi Thông. Cân lại cho bà quay. Bà không đăng đâu. Bà chỉ lưu.'],
            ['kp:lai', 'Sườn này là của sạp anh Phú. Mối lâu năm. Cô không muốn nghi oan ai hết.'],
          ],
          choices: [
            { t: 'Xin bà Phấn khoan đăng, chờ hỏi anh Phú đã', fx: { hearts: { 'kp:lai': 1, 'kp:phan': -1 } },
              say: [['kp:phan', 'Được. Bà chờ. Bà chờ tới 9h. 9h01 là bà đăng.']] },
            { t: 'Phụ Thông cân lại từng miếng cho chắc', fx: { energy: -4, hearts: { 'kp:thong': 2 }, flag: 'd19_can_lai' },
              say: [['nar', 'Cân từng miếng, cộng lại: 9 ký 05. Thông ghi sổ, chữ run như than mới nhóm.']] },
            { t: 'Ăn dĩa sườn, coi như chưa thấy gì', fx: { money: -35000, food: 15 },
              say: [['nar', 'Dĩa sườn ngon. Cảm giác chưa thấy gì thì không ngon bằng.']] },
          ],
        },
        missed: 'Bà Phấn: (clip 47 giây) Mười ký sườn cân lại ra chín! Sạp nào thì mọi người tự hiểu. Tui không nói tên, tui chỉ quay cái bảng hiệu.',
      },
      {
        gap: 1, place: 'cho', from: '06:00', to: '11:00',
        task: 'Sạp thịt anh Phú: "cân hỏng", Cậu Tám bênh hơi to',
        scene: {
          lines: [
            ['kp:phu', 'Cân hỏng! Cái cân này cũ rồi, lò xo nó mỏi. Tui đâu có biết.'],
            ['bama:cautam', 'Đúng rồi! Anh Phú làm ăn đàng hoàng! Mối này tui giới thiệu cho xưởng Ba & Má, có phần trăm đàng hoàng!'],
            ['nar', 'Cả dãy sạp im lặng. Cô Mười ngưng làm cá. Chữ "phần trăm" bay lơ lửng như mùi mỡ hành.'],
            ['kp:phu', '(nói nhỏ) Cậu Tám... đừng nói nữa...'],
            ['kp:chin', 'Phần trăm gì? Tui bán rau ba chục năm chưa ai cho tui phần trăm.'],
            ['bama:cautam', 'À... phần trăm... nạc! Phần trăm nạc trong ba rọi! Ý tui vậy đó!'],
          ],
          choices: [
            { t: 'Đề nghị đem cân đi sửa, kèm một cân đối chứng', fx: { hearts: { 'kp:phu': 1, 'kp:chin': 1 }, flag: 'd19_doi_chung' },
              say: [['kp:phu', 'Được. Tui sửa. Đặt cân đối chứng ngay đầu sạp, ai nghi thì cân lại.']] },
            { t: 'Hỏi thẳng: cân hỏng hay cân bị "độ"?', fx: { hearts: { 'kp:phu': -1, 'kp:phan': 1 } },
              say: [['kp:phu', '...Thằng cháu tui nó "chỉnh" hồi tháng trước. Tui biết mà làm lơ. Tui sai.']] },
            { t: 'Im lặng mua nửa ký ba rọi rồi đi', fx: { money: -45000, food: 8 },
              say: [['bama:cautam', 'Ba rọi này phần trăm nạc cao lắm nha con. Tin tui.']] },
            { t: '(Ba & Má) Nhắn báo cô Hằng chuyện "phần trăm"', role: 'bama', fx: { hearts: { 'bama:hang': 2, 'bama:cautam': -2 }, flag: 'd19_bao_ma' },
              say: [['nar', 'Cô Hằng đọc tin, trả lời một chữ: "Ừ." Cậu Tám tự nhiên thấy lạnh sống lưng giữa trời 34 độ.']] },
          ],
        },
        missed: 'Dì Chín: Anh Phú nói cái cân hỏng. Cậu Tám bênh to quá, lỡ miệng chữ "phần trăm" rồi sửa thành "phần trăm nạc". Cả chợ nghe.',
      },
      {
        gap: 1, place: 'comtam', from: '17:00', to: '21:00',
        task: 'Cô Lài quyết: đổi mối thịt hay cho anh Phú cơ hội',
        scene: {
          lines: [
            ['kp:lai', 'Có mối mới chào sườn, đắt hơn 5% mà cân đủ. Còn anh Phú bán cho cô mười năm.'],
            ['kp:phu', '(đứng ngoài cửa, ôm cái cân mới) Chị Lài, tui xin lỗi. Cân mới, có tem kiểm định. Tui trả lại một ký thiếu.'],
            ['kp:thong', 'Con chỉ muốn sáng nào cân cũng đủ. Đủ ký thì sườn con nướng mới đủ ngọt.'],
            ['kp:phan', 'Bà có clip, bà có lượt xem, bà có quyền bình luận. Nhưng quyết là quyền chị Lài.'],
            ['kp:lai', '{ten}, con nói thử coi. Con hay ăn ở đây, con có phần.'],
          ],
          choices: [
            { t: 'Cho anh Phú một cơ hội, cân trước mặt mỗi sáng', fx: { hearts: { 'kp:phu': 2, 'kp:lai': 1, 'kp:thong': 1 } },
              say: [['kp:phu', 'Tui bán đúng cân 30 ngày, ai cũng cân lại được. Hết 30 ngày mà còn thiếu một lạng, tui tự dẹp sạp.']] },
            { t: 'Khuyên đổi mối, đắt hơn 5% mà yên tâm', fx: { hearts: { 'kp:lai': 1, 'kp:phu': -2 } },
              say: [['kp:lai', 'Ừ, đổi. Dĩa sườn lên 2.000đ, cô ghi lên bảng: "lên giá vì cân đủ".']] },
            { t: 'Đề xuất chợ đặt "cân đối chứng" ở đầu dãy', fx: { mood: 3, hearts: { 'kp:phan': 1, 'kp:lai': 1, 'kp:phu': 1 }, flag: 'd19_doi_chung', xomoi: 'Bà Phấn: Chợ Tâm Mỹ đặt lại "cân đối chứng" đầu dãy. Ai nghi thì cân lại, khỏi quay clip. (Tui vẫn quay.)' },
              say: [['kp:phan', 'Cân sai bị xử phạt đó, có cân đối chứng là ai cũng yên (thông tin giải trí, không phải tư vấn pháp lý).']] },
          ],
        },
        missed: 'Cô Lài: Anh Phú mang cân mới tới xin lỗi, trả lại ký thiếu. Cô cho anh bán thử đúng cân 30 ngày.',
      },
    ],
    end: 'Biên bản khu phố: Chợ có lại "cân đối chứng". Anh Phú bán đúng cân 30 ngày để lấy lại uy tín. Cậu Tám được Má mời lên "họp riêng" về chữ "phần trăm".',
  },

  // ───────────────────────── Drama 20 ─────────────────────────
  {
    id: 'd20', no: 20, title: 'Nhóm phụ huynh lúc 23 giờ',
    who: ['kp:dao', 'audit:hue', 'kp:thuy', 'kp:xuan', 'kp:su', 'kp:oc'],
    minDay: 7, startOn: [0, 1, 2, 3, 4],
    acts: [
      {
        gap: 0, place: 'phongtro', from: '21:30', to: '23:59',
        task: 'Nhóm phụ huynh 5A nổ 47 tin, mở điện thoại xem',
        scene: {
          lines: [
            ['nar', 'Chị Thủy (mẹ Ốc) thêm bạn vào nhóm "Phụ huynh 5A" để "phụ đếm quỹ". Bạn đồng ý lúc 21h. Giờ là 23h, có 47 tin.'],
            ['audit:hue', 'Chị gửi bảng tính "Quỹ quà 20/11 v3 FINAL (sửa)". 6 tab. Mời các phụ huynh điền cột F trước 23h30.'],
            ['audit:hue', 'Tab 4 là đối chiếu. Tab 5 là đối chiếu của đối chiếu. Tab 6 chị chưa đặt tên.'],
            ['kp:dao', 'Dạ cô nhận được rồi ạ. Dạ cô cảm ơn. Dạ cô xem tab 2 rồi ạ. (23h41)'],
            ['kp:thuy', 'Cô Đào ơi, cô đi ngủ đi, sáng mai cô còn dạy. Mấy cái này để mai được mà.'],
            ['audit:hue', 'Để mai thì số liệu nó nguội. Chị quen làm khuya rồi, mùa kiểm toán chị nhắn 3 giờ sáng.'],
          ],
          choices: [
            { t: 'Đề xuất "giờ yên tĩnh sau 21h" cho cả nhóm', fx: { hearts: { 'kp:dao': 2, 'kp:thuy': 1, 'audit:hue': -1 }, flag: 'd20_gio_yen' },
              say: [['kp:dao', 'Dạ cô... cô cảm ơn em. Thật lòng. (đã xem, rồi không trả lời nữa, vì cô đi ngủ)']] },
            { t: 'Thả tim từng tin cho đủ 47 cái', fx: { energy: -5, mood: -2, hearts: { 'audit:hue': 1 } },
              say: [['audit:hue', 'Có một phụ huynh tương tác 100%. Chị ghi nhận vào tab 6. Tab 6 giờ tên là "Người tích cực".']] },
            { t: 'Tắt thông báo, đi ngủ', fx: { energy: 5, mood: 2 },
              say: [['nar', 'Bạn ngủ ngon. Sáng dậy có 112 tin. Có một tin hỏi "ai là {ten}".']] },
          ],
        },
        missed: 'Chị Thủy: Tối qua nhóm 5A có 47 tin sau 21h. Cô Đào trả lời tới 0h. Bảng tính "quỹ quà 20/11" của chị Huệ có 6 tab.',
      },
      {
        gap: 1, place: 'truong_th', from: '15:30', to: '17:30',
        task: 'Cổng trường: cô Xuân nhắc chuyện quà 20/11',
        scene: {
          lines: [
            ['nar', 'Giờ tan trường. Su và Ốc ngồi ghế đá giải chung một bài toán, cãi nhau xem ai ra đáp số trước.'],
            ['kp:su', 'Mình ra 48 trước! Mình viết số 4 trước khi bạn viết số 8!'],
            ['kp:oc', 'Nhưng mình viết số 8 đẹp hơn! Tuần này mình hạng nhất!'],
            ['kp:xuan', 'Thưa các phụ huynh, nhà trường nhắc lại: trường không nhận hoa quà dịp 20/11 (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:thuy', 'Vậy mình chuyển quỹ thành học bổng cho các em khó khăn, hoặc mua thẻ BHYT học sinh. Ai đồng ý không?'],
            ['audit:hue', 'Đồng ý cũng được. Nhưng chị cần đổi tên tab. Và chứng từ. Chứng từ là trên hết.'],
          ],
          choices: [
            { t: 'Ủng hộ chuyển quỹ thành học bổng 20/11', fx: { mood: 3, hearts: { 'kp:thuy': 2, 'kp:xuan': 1 }, flag: 'd20_hoc_bong' },
              say: [['kp:xuan', 'Học bổng mang tên "Quỹ 20/11 lớp 5A". Cô Đào nhận lời cảm ơn, không nhận quà. Vậy là đẹp.']] },
            { t: 'Ủng hộ mua thẻ BHYT học sinh cho bạn khó khăn', fx: { mood: 3, hearts: { 'kp:thuy': 2, 'kp:dao': 1 }, flag: 'd20_hoc_bong' },
              say: [['kp:thuy', 'Làm điều dưỡng, chị thấy cái thẻ đó quý lắm. Cảm ơn em.']] },
            { t: '(Cân Đối) Xin chị Huệ cho phụ đối chiếu quỹ', role: 'audit', fx: { hearts: { 'audit:hue': 3 } },
              say: [['audit:hue', 'Thực tập sinh bên chị? Tốt. Em giữ tab 4. Tab 5 chị giữ. Tab 6 là bí mật.']] },
          ],
        },
        missed: 'Cô Xuân: Nhà trường nhắc lại không nhận hoa quà 20/11. Phụ huynh 5A đang bàn chuyển quỹ thành học bổng (thông tin giải trí, không phải tư vấn pháp lý).',
      },
      {
        gap: 1, place: 'photo', from: '08:00', to: '20:00',
        task: 'Photo Thần Tốc: quỹ lớp 5A lệch đúng 12.000đ',
        scene: {
          lines: [
            ['audit:hue', 'Quỹ thu 3.240.000đ. Chi 3.228.000đ. Lệch 12.000đ. Chị không ngủ được vì 12.000đ.'],
            ['kp:dao', 'Dạ... hình như là tiền cô photo đề cương cho cả lớp. Cô quên xin biên nhận ạ.'],
            ['kp:tan', 'Đúng rồi, hôm đó cô Đào photo 60 bản. 200 đồng một mặt, hai mặt. Tui nhớ vì máy kẹt giấy ở bản thứ 31.'],
            ['audit:hue', 'Nhớ thôi chưa đủ. Phải có chứng từ. Không có chứng từ thì 12.000đ là một bí ẩn.'],
            ['kp:dao', '(nhỏ giọng) Cô dạy học mười năm, chưa bao giờ bị soát như soát timesheet...'],
          ],
          choices: [
            { t: 'Nhờ chú Tấn in lại biên nhận 12.000đ', fx: { money: -2000, hearts: { 'audit:hue': 2, 'kp:dao': 1, 'kp:tan': 1 } },
              say: [['kp:tan', 'Biên nhận đây, có ghi "máy kẹt bản 31". In biên nhận tốn thêm 2.000đ, tui tính em.'], ['audit:hue', 'Khớp. Chị ngủ được rồi.']] },
            { t: 'Bù 12.000đ cho xong chuyện', fx: { money: -12000, hearts: { 'kp:dao': 2 } },
              say: [['audit:hue', 'Bù thì quỹ khớp, nhưng sổ phải ghi "phụ huynh bù". Chị ghi. Cảm ơn em.']] },
            { t: '(Cân Đối) Đóng tick-mark xanh lên biên nhận', role: 'audit', fx: { hearts: { 'audit:hue': 3, 'kp:dao': 1 } },
              say: [['audit:hue', 'Xanh là đã đối chiếu chứng từ. Em học nhanh. Lớp 5A giờ sạch hơn báo cáo tài chính quý 3.']] },
          ],
        },
        missed: 'Chú Tấn: Chị Huệ soát quỹ lớp 5A, lệch 12.000đ. Là tiền photo đề cương của cô Đào. Tui đã in biên nhận, có ghi máy kẹt bản 31.',
      },
    ],
    end: 'Biên bản khu phố: Lớp 5A có "giờ yên tĩnh sau 21h" và quỹ học bổng 20/11. Lệch 12.000đ đã có biên nhận. Su và Ốc vẫn tranh hạng nhất môn Toán.',
  },

  // ───────────────────────── Drama 21 ─────────────────────────
  {
    id: 'd21', no: 21, title: 'Lá thư trong máy photocopy',
    who: ['kp:tan', 'kp:nga', 'kp:cuong', 'kp:nhung'],
    minDay: 17,
    acts: [
      {
        gap: 0, place: 'photo', from: '08:00', to: '20:00',
        task: 'Photo Thần Tốc: máy cũ in thử ra một lá thư lạ',
        scene: {
          lines: [
            ['nar', 'Chú Tấn thay máy photo mới. Máy cũ in thử lần cuối 500 tờ rơi trà sữa, rồi tắt hẳn như một lời chào.'],
            ['kp:nhung', 'Chú Tấn, mặt sau tờ rơi của con có chữ viết tay. "Nga ơi, sáng mai anh đợi ở quán cóc bảy ghế..."'],
            ['nar', 'Trong khay máy cũ kẹt một tờ giấy ố vàng, ngày 14/02/1989. Máy đã in nó ra mặt sau cả 500 tờ.'],
            ['kp:tan', '(giật tờ giấy, mặt đỏ như mực in lỗi) Cái này... của khách. Khách bỏ quên. Năm 1989.'],
            ['kp:nhung', 'Thư chưa gửi hả chú? "Nếu em tới, mình đi coi phim. Nếu em không tới, anh vẫn đợi". Trời ơi.'],
            ['kp:tan', 'In lại thì tốn mực. Mà phát ra thì... thì... Chú đi uống nước.'],
          ],
          choices: [
            { t: 'Phụ chú Tấn thu hồi 500 tờ, in lại', fx: { energy: -6, hearts: { 'kp:tan': 2 }, flag: 'd21_thu_hoi' },
              say: [['kp:tan', 'Cảm ơn con. Còn thiếu 37 tờ, bay đâu mất rồi. Thôi, 37 tờ thì chắc không ai đọc đâu.']] },
            { t: 'Khuyên chị Nhung cứ phát, tờ rơi có thêm văn học', fx: { hearts: { 'kp:nhung': 1, 'kp:tan': -1 }, flag: 'd21_phat' },
              say: [['kp:nhung', 'Một mặt khuyến mãi, một mặt tình yêu. Chị thấy đây là chiến lược.']] },
            { t: '(Trà sữa) Đem đi phát giờ tan trường, chị Nhung trả công', role: 'trasua', fx: { energy: -5, money: 40000, hearts: { 'kp:nhung': 2 }, flag: 'd21_phat' },
              say: [['nar', 'Phát hết 500 tờ trong 40 phút. Người lớn lật mặt sau đọc, tụi nhỏ chỉ đọc chữ "mua 2 tặng topping".']] },
          ],
        },
        missed: 'Chị Nhung: 500 tờ rơi trà sữa có lá thư tình năm 1989 in mặt sau. Đã phát. Khách tới hỏi "Nga là ai" nhiều hơn hỏi menu.',
      },
      {
        gap: 1, place: 'trasua', from: '09:00', to: '21:00',
        task: 'Cả khu phố đọc tờ rơi: "Nga" là ai?',
        scene: {
          lines: [
            ['kp:nhung', 'Tờ rơi hiệu quả gấp ba! Khách vô hỏi "Nga là ai" xong tiện mua luôn hai ly.'],
            ['kp:cuong', '(cầm tờ rơi) Khu phố mình có ba người tên Nga, một chiếc ghe tên Nga, và cô Nga Mặt trận.'],
            ['kp:cuong', 'Chữ này nghiêng nghiêng, chữ "g" có cái đuôi cong... Tui thấy quen quen mà không nhớ ở đâu.'],
            ['nar', 'Đối diện, trên bảng hiệu Photo Thần Tốc, chữ "g" trong "Thần Tốc... giá rẻ" có cái đuôi cong y chang.'],
            ['kp:nhung', '{ten} thấy không? Em thấy giống chữ ai không?'],
          ],
          choices: [
            { t: 'Giữ bí mật cho chú Tấn, nói không biết', fx: { hearts: { 'kp:tan': 2 }, flag: 'd21_giu_bi_mat' },
              say: [['nar', 'Bên kia đường, chú Tấn kéo cửa cuốn xuống một nửa. Rồi xuống thêm một chút.']] },
            { t: 'Chỉ vào bảng hiệu photo: "chữ g giống ghê"', fx: { hearts: { 'kp:cuong': 1, 'kp:tan': -1 } },
              say: [['kp:cuong', 'Ủa... ỦA. Thôi tui không nói. Tui là Trưởng khu phố, tui giữ loa, tui không giữ chuyện tình.']] },
            { t: 'Gợi ý chị Nhung in thêm 500 tờ, mặt sau để trống', fx: { hearts: { 'kp:nhung': 2 } },
              say: [['kp:nhung', 'Mặt sau để trống, ghi "Viết điều bạn chưa từng gửi". Trời, chị là thiên tài marketing.']] },
          ],
        },
        missed: 'Chú Cường: Cả khu phố đang đoán "Nga" là ai. Có ba cô tên Nga, một chiếc ghe tên Nga, và cô Nga Mặt trận thì không bình luận.',
      },
      {
        gap: 1, place: 'khupho', from: '07:00', to: '11:00',
        task: 'Văn phòng Khu phố: cô Nga nhận ra nét chữ',
        scene: {
          lines: [
            ['kp:nga', '(cầm tờ rơi, đọc rất lâu) Năm 1989, quán cóc bảy ghế. Hồi đó bà Cẩm mới có năm ghế.'],
            ['kp:nga', 'Sáng hôm đó cô có tới. Cô ngồi đợi tới trưa, rồi nghĩ người ta đổi ý. Hóa ra thư chưa bao giờ được gửi.'],
            ['kp:cuong', 'Chú Tấn hai ngày nay không ra khỏi tiệm. Ai cần photo phải nhét giấy qua khe cửa.'],
            ['kp:nga', 'Nét chữ đó cô nhận ra. Cái đuôi chữ "g" cong như vậy, cả khu phố chỉ có một người.'],
            ['kp:cuong', 'Ngày hội khu phố đang thiếu người lo bàn trà nước với in băng rôn. Tui cần hai người. Đúng hai.'],
          ],
          choices: [
            { t: 'Mang lá thư bản gốc đưa tận tay cô Nga', fx: { mood: 5, hearts: { 'kp:nga': 2, 'kp:tan': 1 }, flag: 'd21_trao_thu' },
              say: [['kp:nga', 'Cảm ơn con. Sáng mai cô ra quán cóc. Lần này cô đợi lâu hơn một chút cũng được.']] },
            { t: 'Rủ cô Nga và chú Tấn cùng dựng Ngày hội', fx: { mood: 3, hearts: { 'kp:cuong': 1, 'kp:nga': 1, 'kp:tan': 1 }, flag: 'd21_ngay_hoi' },
              say: [['kp:cuong', 'Cô Nga lo trà nước, chú Tấn in băng rôn. Hai người họp chung mỗi sáng ở quán cóc. Tui sắp xếp hết rồi.']] },
            { t: 'Để chuyện cũ ngủ yên, đi làm việc khác', fx: { mood: -1 },
              say: [['nar', 'Chiều đó cô Nga tự đi ngang tiệm photo. Cửa cuốn kéo lên. Không ai nói gì, nhưng có hai ly trà đá.']] },
          ],
        },
        missed: 'Cô Nga: Cô nhận ra nét chữ rồi. Sáng mai cô ra quán cóc bảy ghế, ngồi ghế thứ sáu. Ai ngồi ghế thứ bảy thì cô biết.',
      },
    ],
    end: 'Biên bản khu phố: Tờ rơi trà sữa hiệu quả gấp 3 tuần đó. Mỗi sáng quán cóc có hai người ngoài 50 tuổi ngồi ghế thứ sáu và thứ bảy, uống chung bình trà.',
  },

  // ───────────────────────── Drama 22 ─────────────────────────
  {
    id: 'd22', no: 22, title: 'Giả nhân viên điện lực',
    who: ['kp:lanh', 'kp:oanh', 'kp:vinh', 'kp:kha'],
    minDay: 14, startOn: [1, 2, 3, 4, 5],
    acts: [
      {
        gap: 0, place: 'phongtro', from: '17:00', to: '21:30',
        task: 'Dãy trọ: cô Ba nhận cuộc gọi "điện lực" lạ',
        scene: {
          lines: [
            ['nar', 'Bạn vừa vô cổng, thấy cô Ba Lành đứng giữa sân, điện thoại bật loa ngoài, tay kia cầm thẻ ngân hàng.'],
            ['nar', '(giọng trong điện thoại) "Điện lực đây! Cô nợ 3 triệu tiền điện. Chuyển khoản ngay, không 19h cắt điện!"'],
            ['kp:lanh', 'Trời đất, cắt điện thì tủ lạnh có nồi cá kho của cô... Con ơi, chuyển khoản là bấm chỗ nào?'],
            ['me', '(Điện lực gì mà gọi lúc 18h, đòi chuyển vô tài khoản tên "Nguyen Van Dien Luc"?)'],
            ['nar', '(giọng trong điện thoại) "Nhanh lên cô! Còn 15 phút! Không được cúp máy!"'],
          ],
          choices: [
            { t: 'Lịch sự xin cầm điện thoại, hỏi mã khách hàng', fx: { hearts: { 'kp:lanh': 2 }, flag: 'd22_chan' },
              say: [['me', 'Dạ anh cho em xin mã khách hàng với số hóa đơn ạ.'], ['nar', 'Đầu dây im 3 giây, rồi "tút tút tút". Điện lực thiệt không sợ câu hỏi đó.']] },
            { t: 'Chạy lên gọi anh Kha xuống liền', fx: { energy: -2, hearts: { 'kp:kha': 1, 'kp:lanh': 1 }, flag: 'd22_chan' },
              say: [['kp:kha', 'Má! Cúp máy! Tiền điện dãy mình con trả qua app tháng trước rồi mà. Má lưu số con mà không gọi con.']] },
            { t: 'Để cô chuyển, chắc là điện lực thiệt', fx: { mood: -3, hearts: { 'kp:lanh': -1 } },
              say: [['nar', 'Cô Ba bấm chuyển. App ngân hàng hỏi: "Người nhận lạ. Cô chắc không?". Cô Ba không chắc. Cô để mai hỏi.']] },
          ],
        },
        missed: 'Anh Kha: Tối qua má tui suýt chuyển 3 triệu cho "điện lực" qua điện thoại. May app ngân hàng hỏi lại, má tui để mai tính.',
      },
      {
        gap: 1, place: 'dienluc', from: '07:30', to: '11:30',
        task: 'Phòng giao dịch điện lực: chị Oanh xác minh',
        scene: {
          lines: [
            ['kp:lanh', 'Cô Oanh ơi, hôm qua có người xưng điện lực, đòi cô chuyển 3 triệu không thì cắt điện.'],
            ['kp:oanh', 'Dạ cô, điện lực báo tiền điện qua app chăm sóc khách hàng và tổng đài chính thức, không bắt chuyển khoản qua điện thoại (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:oanh', 'Cắt điện không khẩn cấp thì phải báo trước ít nhất 5 ngày. Không có chuyện "15 phút nữa cắt" đâu cô (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:vinh', 'Tháng này phường mình có sáu nhà bị gọi y chang. Tụi nó còn mặc áo giống áo tui đi chụp hình.'],
            ['kp:lanh', 'Vậy mà cô suýt tin. Già rồi, nghe chữ "cắt điện" là tim cô cắt trước.'],
          ],
          choices: [
            { t: 'Xin chị Oanh tờ cảnh báo, dán khắp hẻm', fx: { energy: -5, hearts: { 'kp:oanh': 2, 'kp:vinh': 1 }, flag: 'd22_dan_canh_bao', xomoi: 'Chị Oanh (điện lực): Điện lực không gọi đòi chuyển khoản. Có ai gọi vậy thì cúp máy, ra quầy hỏi nha cả nhà.' },
              say: [['kp:oanh', 'Đây, 30 tờ. Dán chỗ nào người lớn tuổi hay đi: chợ, quán cóc, cổng trạm y tế.']] },
            { t: 'Cài cho cô Ba app chăm sóc khách hàng chính thức', fx: { hearts: { 'kp:lanh': 2, 'kp:oanh': 1 } },
              say: [['kp:lanh', 'Cái app này có hình bóng đèn. Cô nhớ rồi: bóng đèn thì tin, giọng hối thì không.']] },
            { t: 'Nhờ anh Vĩnh báo chú Cường đọc loa cảnh báo', fx: { hearts: { 'kp:vinh': 2 } },
              say: [['kp:vinh', 'Để tui. Chú Cường đọc loa 17h, đọc chậm, đọc hai lần cho các cụ nghe kịp.']] },
          ],
        },
        missed: 'Chị Oanh: Cô Ba Lành ra quầy hỏi rồi. Điện lực không gọi đòi chuyển khoản, cắt điện không khẩn cấp phải báo trước ít nhất 5 ngày (thông tin giải trí, không phải tư vấn pháp lý).',
      },
      {
        gap: 0, place: 'phongtro', from: '17:30', to: '22:30',
        task: 'Cô Ba Lành chờ ở dãy trọ, có nồi chè',
        scene: {
          lines: [
            ['nar', 'Cô Ba Lành ngồi trước phòng bạn, bên cạnh là nồi chè đậu trắng và một cuốn sổ ghi số tổng đài điện lực, viết to bằng bút lông.'],
            ['kp:lanh', '{ten}, cô cảm ơn con. 3 triệu đó là tiền cô để dành đi Sa Đéc thăm bà con.'],
            ['kp:kha', 'Con cài cho má chặn số lạ rồi. Má mà nghe giọng ai hối là má gọi con trước.'],
            ['kp:lanh', 'Tháng này cô bớt tiền điện cho con. Không cãi. Cô Ba nói là cô Ba làm.'],
          ],
          choices: [
            { t: 'Dạ, con cảm ơn cô', fx: { money: 120000, hearts: { 'kp:lanh': 2 } },
              say: [['kp:lanh', 'Ngoan. Ăn chè đi. Chè này không có ai gọi điện hối hết.']] },
            { t: 'Từ chối, xin cô nấu chè cho cả dãy ăn chung', fx: { food: 10, mood: 4, hearts: { 'kp:lanh': 3, 'kp:kha': 1 } },
              say: [['nar', 'Tối đó cả dãy trọ ăn chè ngoài sân. Anh Kha kể lại vụ lừa ba lần, mỗi lần tên lừa đảo nói nhanh hơn một chút.']] },
          ],
        },
        missed: 'Cô Ba Lành: Cô cảm ơn mấy đứa trong dãy. Cô dán số tổng đài điện lực lên tủ lạnh rồi. Ai gọi hối là cô cúp máy.',
      },
    ],
    end: 'Biên bản khu phố: Loa khu phố đọc tin cảnh báo cuộc gọi giả điện lực. Cô Ba Lành dán số tổng đài chính thức lên tủ lạnh, ngay trên nồi cá kho.',
  },

  // ───────────────────────── Drama 23 ─────────────────────────
  {
    id: 'd23', no: 23, title: 'Đại chiến tiền điện 4.000 đồng',
    who: ['kp:lanh', 'kp:kha', 'kp:vinh', 'kp:tram'],
    minDay: 6, startOn: [1, 2, 3, 4, 5],
    acts: [
      {
        gap: 0, place: 'phongtro', from: '16:00', to: '20:30',
        task: 'Dãy trọ: anh Vĩnh ghé ghi chỉ số điện',
        scene: {
          lines: [
            ['nar', 'Anh Vĩnh điện lực ghé ghi chỉ số cuối ca. Thấy tờ "Bảng giá dãy trọ" dán trên cột, anh đứng lại đọc hai lần.'],
            ['kp:vinh', 'Cô Ba, điện ghi 4.000đ/số hả cô? Cô biết Nghị định 133/2026 chưa?'],
            ['kp:vinh', 'Từ 25/05/2026, chủ trọ thu tiền điện cao hơn giá quy định có thể bị phạt 20-30 triệu và phải hoàn chênh lệch (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:vinh', 'Cứ 4 người thuê tính là 1 hộ để có định mức bậc thang. Muốn vậy phải kê khai số người (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:lanh', '(im lặng 15 giây, kỷ lục của cô) ...Cô tính 4.000 vì hồi đó ai cũng tính 4.000.'],
            ['kp:tram', '(mở sổ thu chi) Tháng rồi phòng 5 xài 90 số. 90 nhân 4.000 là 360.000đ. Dạ.'],
          ],
          choices: [
            { t: 'Hỏi anh Vĩnh: vậy tính đúng thì bao nhiêu?', fx: { hearts: { 'kp:vinh': 1 }, flag: 'd23_hoi_gia' },
              say: [['kp:vinh', 'Tính giá hộ theo bậc thì phòng em chừng 185.000đ một tháng. Gần nửa. Đó, ghi vô sổ đi chị Trâm.']] },
            { t: 'Mời hai bên ly trà đá, xin bình tĩnh', fx: { money: -10000, hearts: { 'kp:lanh': 1, 'kp:vinh': 1 } },
              say: [['kp:lanh', 'Con nói đúng. Uống trà đá đã. Trà đá thì chưa có nghị định nào.']] },
            { t: 'Gật gù, tính nhẩm mấy tháng qua đã trả bao nhiêu', fx: { mood: -3 },
              say: [['me', '(Ba tháng, mỗi tháng dư 175.000đ. Bằng... 21 ly trà sữa size L. Đau.)']] },
          ],
        },
        missed: 'Chị Trâm: Anh Vĩnh ghé ghi điện, thấy dãy mình ghi 4.000đ/số, giảng một bài Nghị định 133. Má chồng tui im lặng 15 giây, kỷ lục.',
      },
      {
        gap: 1, place: 'dienluc', from: '08:00', to: '11:30',
        task: 'Điện lực: anh Kha hỏi kê khai, đòi tăng phòng',
        scene: {
          lines: [
            ['kp:kha', 'Anh Vĩnh, chỉ em kê khai số người với. Dãy em 11 người, 4 người một hộ là... 2,75 hộ?'],
            ['kp:vinh', 'Làm tròn theo hướng dẫn, kèm giấy tạm trú từng người. Ai chưa đăng ký tạm trú thì đi đăng ký trước.'],
            ['kp:kha', 'Rồi. Nhưng điện giảm thì dãy em hụt thu. Em tính tăng tiền phòng 200.000đ cho công bằng.'],
            ['kp:tram', '(nhắn bạn) Anh Kha mở bảng tính lúc 1h sáng. Chị không cản được. Em tới họp tối mai nha.'],
            ['kp:vinh', 'Tăng tiền phòng là chuyện của dãy, điện lực không quản. Nhưng nói trước với người thuê cho đàng hoàng.'],
          ],
          choices: [
            { t: 'Hỏi anh Kha: tăng 200 ngàn là tính sao?', fx: { hearts: { 'kp:kha': 1 } },
              say: [['kp:kha', 'Sơn lại cổng, thay bóng đèn hành lang, wifi lên gói nhanh. Em có slide 14 trang. Tối mai trình.']] },
            { t: 'Nhờ anh Vĩnh in sẵn tờ hướng dẫn kê khai', fx: { hearts: { 'kp:vinh': 2, 'kp:tram': 1 }, flag: 'd23_huong_dan' },
              say: [['kp:vinh', 'Đây. Có ô cho số người, ô cho tạm trú, ô cho chữ ký. Không có ô cho "4.000đ" nha.']] },
            { t: 'Nhắn chị Trâm: "em tới, em mang trà sữa"', fx: { hearts: { 'kp:tram': 2 } },
              say: [['kp:tram', 'Ít đường nha. Họp với anh Kha là đủ ngọt rồi.']] },
          ],
        },
        missed: 'Anh Kha: Dãy trọ Bình An sẽ tính điện theo giá hộ. Tui đề xuất tăng tiền phòng 200.000đ, sẽ trình bày ở cuộc họp dãy trọ (có slide).',
      },
      {
        gap: 1, place: 'phongtro', from: '19:00', to: '22:30',
        task: 'Họp dãy trọ Bình An: điện và tiền phòng',
        scene: {
          lines: [
            ['nar', 'Sân dãy trọ. Mười một người thuê, một cái quạt, một máy chiếu mượn, slide của anh Kha đang ở trang 3/14.'],
            ['kp:kha', 'Tóm lại: điện giảm 175.000đ, phòng tăng 200.000đ. Người thuê vẫn lời... âm 25.000đ. Em sẽ làm tròn.'],
            ['kp:lanh', 'Kha, con im. Cô tính sai thì cô sửa. Mà dãy này cô giữ 20 năm, cô không muốn ai phải dọn đi.'],
            ['kp:tram', 'Má, sổ còn dư một chút. Mình tăng ít hơn, hoặc người thuê phụ sơn cổng thì khỏi tăng.'],
            ['kp:lanh', '{ten}, con ở phòng 5, con nói trước đi.'],
          ],
          choices: [
            { t: 'Đi đăng ký tạm trú đủ người để tính giá hộ', fx: { hearts: { 'kp:lanh': 2, 'kp:kha': 1 }, flag: 'd23_tam_tru' },
              say: [['kp:lanh', 'Đúng. Giấy tờ đủ thì điện đúng giá, cô không lo bị phạt. Con ngoan.']] },
            { t: 'Thương lượng giữ tiền phòng, cả dãy phụ sơn cổng', fx: { energy: -8, hearts: { 'kp:kha': 1, 'kp:tram': 2, 'kp:lanh': 1 } },
              say: [['kp:kha', 'Chủ nhật sơn cổng. Màu gì? Em có 3 phương án trong slide trang 12.']] },
            { t: 'Phản ánh lên tổng đài điện lực, đòi hoàn chênh lệch', fx: { money: 150000, hearts: { 'kp:lanh': -2, 'kp:kha': -1 } },
              say: [['kp:lanh', 'Ừ. Đúng luật thì cô trả. Cô không giận. Cô chỉ... buồn chút xíu thôi.']] },
            { t: 'Nhắc cô Ba: "lần này là điện lực thiệt nha cô"', needFlag: 'd22_done', fx: { mood: 3, hearts: { 'kp:lanh': 2 } },
              say: [['kp:lanh', 'Ha ha. Cô biết. Điện lực thiệt thì không hối, còn ngồi uống trà đá với mình.']] },
          ],
        },
        missed: 'Chị Trâm: Họp dãy trọ xong. Điện tính theo giá hộ, mỗi phòng tầm 185.000đ. Tiền phòng tăng ít hơn đề xuất. Anh Kha chưa kịp chiếu tới trang 14.',
      },
    ],
    end: 'Biên bản khu phố: Dãy trọ Bình An tính điện theo giá hộ. Tiền điện của bạn từ khoảng 360.000đ còn khoảng 185.000đ một tháng. Cô Ba treo bảng "Điện đúng giá".',
  },

  // ───────────────────────── Drama 24 ─────────────────────────
  {
    id: 'd24', no: 24, title: 'Bão 1 sao ngày mua 1 tặng 1',
    who: ['kp:nhung', 'agency:suong', 'bama:mi', 'agency:kieu', 'kp:phan'],
    minDay: 11, startOn: [1, 2, 3, 4, 5],
    acts: [
      {
        gap: 0, place: 'trasua', from: '15:00', to: '18:30',
        task: 'Có biến ở Full Topping: mua 1 tặng 1, hàng dài',
        scene: {
          lines: [
            ['nar', 'Sương đăng fanpage: "MUA 1 TẶNG 1, KHÔNG GIỚI HẠN!!!". Ba dấu chấm than. Không ai đọc kỹ chữ "không giới hạn".'],
            ['nar', 'Hàng dài từ quán tới tận cổng trường. Tụi nhỏ tan học xếp hàng mua trà sữa, cầm vở làm bài trong lúc chờ.'],
            ['kp:nhung', 'Chờ 40 phút rồi! Trân châu nấu không kịp! Nồi thứ năm rồi! Tú đâu? Bông đâu?'],
            ['agency:suong', '(nhắn) Chị ơi bài đăng lên 2.000 lượt chia sẻ! Em có nên đăng thêm "còn 2 tiếng nữa" không?'],
            ['kp:nhung', 'KHÔNG. Sương, em đừng đăng gì nữa hết. Em đi ngủ đi.'],
            ['kp:phan', '(đứng thứ 37 trong hàng) Tui đứng đây mà quên mình mua cho ai.'],
          ],
          choices: [
            { t: 'Nhảy vô quầy phụ lắc ly', fx: { energy: -10, hearts: { 'kp:nhung': 2 } },
              say: [['kp:nhung', 'Em lắc đều tay ghê! Hàng ngắn lại được... 3 người. Lắc tiếp!']] },
            { t: 'Đi dọc hàng phát nước lọc, xin lỗi khách', fx: { money: -20000, mood: 2, hearts: { 'kp:nhung': 1, 'kp:phan': 1 } },
              say: [['kp:phan', 'Có nước lọc là bà nhớ ra rồi: bà mua cho bà.']] },
            { t: '(Trà sữa) Chốt "50 khách đầu", phát số thứ tự', role: 'trasua', fx: { energy: -5, hearts: { 'kp:nhung': 3 }, flag: 'd24_gioi_han' },
              say: [['kp:nhung', 'Số 51 trở đi nhận phiếu mua 1 tặng 1 ngày mai. Em cứu chị rồi. Ghi vô sổ tay quán liền.']] },
          ],
        },
        missed: 'Bà Phấn: Full Topping mua 1 tặng 1, hàng dài từ quán tới cổng trường, chờ 40 phút. Tui đứng xếp hàng mà quên mình mua cho ai.',
      },
      {
        gap: 1, place: 'trasua', from: '09:00', to: '13:00',
        task: 'Full Topping: 60 đánh giá 1 sao trong 2 giờ',
        scene: {
          lines: [
            ['kp:nhung', '(nhìn điện thoại, mắt thâm) 60 đánh giá 1 sao trong 2 giờ. Quán từ 4,8 sao xuống 3,1.'],
            ['agency:suong', 'Có cái ghi: "Ngon quá. Chờ lâu quá. 1 sao vì tui đói." Cái này là khen hay chê chị?'],
            ['agency:suong', 'Có cái khác: "Trân châu dai như mối tình đầu, chờ lâu như mối tình đầu." 1 sao.'],
            ['kp:nhung', 'Chị muốn đóng cửa, trùm mền, đổi tên quán thành "Trà Sữa Không Topping".'],
          ],
          choices: [
            { t: 'Viết lời xin lỗi công khai, kèm phiếu mời lại', fx: { hearts: { 'kp:nhung': 2 }, flag: 'd24_xin_loi' },
              say: [['kp:nhung', '"Quán xin lỗi vì để mọi người chờ. Mang phiếu này tới, quán mời lại một ly." Gửi.']] },
            { t: 'Đóng cửa sớm 1 tiếng cho cả quán nghỉ thở', fx: { mood: 4, energy: 5, hearts: { 'kp:nhung': 1 } },
              say: [['nar', 'Cả quán ngồi ăn bánh tráng trộn, không ai nhìn điện thoại. Sao không lên, nhưng tim thì lên.']] },
            { t: '(Trend Trễ) Viết thông cáo "Chúng tôi đã nghe"', role: 'agency', fx: { hearts: { 'agency:suong': 2, 'kp:nhung': 1 }, flag: 'd24_xin_loi' },
              say: [['agency:suong', 'Em duyệt! Không có dấu chấm than nào. Lần đầu em thấy một bài đăng bình tĩnh vậy.']] },
            { t: '(Trà sữa) Lọc ra mấy đánh giá ảo để báo cáo', role: 'trasua', fx: { energy: -4, hearts: { 'kp:nhung': 2 } },
              say: [['nar', 'Có 9 đánh giá 1 sao từ tài khoản tên "Trà Sữa Đối Thủ 1" tới "Trà Sữa Đối Thủ 9". Đã báo cáo.']] },
          ],
        },
        missed: 'Sương: 60 đánh giá 1 sao trong 2 giờ. Có một cái ghi "ngon quá, chờ lâu quá, 1 sao vì tui đói". Chị Nhung đang trùm mền.',
      },
      {
        gap: 1, place: 'trasua', from: '14:00', to: '19:00',
        task: 'Bà Phấn kêu chấm 5 sao, Út Mi tới review',
        scene: {
          lines: [
            ['kp:phan', '(trong nhóm Xóm Ơi) Cả khu phố vô chấm 5 sao bênh quán nhà! Ai chưa uống cũng chấm, tui cho phép!'],
            ['bama:mi', '(đeo đèn livestream) Chào cả nhà! Hôm nay Mi review Full Topping. Thật lòng nha, Mi không nhận tiền.'],
            ['agency:kieu', '(đứng sau, tay cầm danh thiếp) Út Mi, em sạch, chị check rồi. Lúc nào ra riêng thì gọi chị quản lý cho.'],
            ['kp:nhung', '{ten}, chị rối quá. Bà Phấn kêu cả xóm chấm sao, Mi thì live, chị Kiều thì phát danh thiếp. Chị làm sao đây?'],
          ],
          choices: [
            { t: 'Can bà Phấn: kêu chấm sao ảo là không nên', fx: { hearts: { 'kp:phan': -1, 'kp:nhung': 1 } },
              say: [['me', 'Bà ơi, kêu người chưa uống chấm 5 sao là trái quy định của app đánh giá đó bà (thông tin giải trí, không phải tư vấn pháp lý).'], ['kp:phan', 'Vậy bà chấm 5 sao thật. Bà uống rồi. Hôm qua bà xếp hàng 40 phút.']] },
            { t: 'Mời Út Mi review thật lòng, khen chê đủ cả', fx: { mood: 3, hearts: { 'bama:mi': 2, 'kp:nhung': 1 } },
              say: [['bama:mi', 'Trân châu 10 điểm. Chờ 40 phút thì 2 điểm. Nhưng quán xin lỗi đàng hoàng nên Mi cộng 5. Ghé đi cả nhà!']] },
            { t: '(Ba & Má) Gợi ý Mi review combo trà sữa và khô gà', role: 'bama', fx: { hearts: { 'bama:mi': 2, 'agency:kieu': 1 } },
              say: [['bama:mi', 'Combo mặn ngọt! Lượt xem lên 3.000. Má mà thấy chắc Má cười, rồi Má hỏi tiền đâu.']] },
          ],
        },
        missed: 'Út Mi: Mi review Full Topping thật lòng rồi nha: trân châu 10 điểm, chờ 40 phút 2 điểm, xin lỗi đàng hoàng cộng 5. Sao quán lên lại rồi đó.',
      },
    ],
    end: 'Biên bản khu phố: Sổ tay quán ghi "Khuyến mãi giới hạn 50 khách đầu". Sao Full Topping rớt rồi lên lại. Chị Kiều đã đưa danh thiếp cho Út Mi.',
  },

  // ───────────────────────── Drama 25 ─────────────────────────
  {
    id: 'd25', no: 25, title: 'Ba chị Diệp',
    who: ['tech:diep', 'agency:diep', 'audit:diep', 'agency:hong', 'kp:man'],
    minDay: 23,
    acts: [
      {
        gap: 0, place: 'cattoc', from: '09:00', to: '19:00',
        task: 'Tiệm tóc treo tấm ảnh lạ: ba bé gái tên Diệp',
        scene: {
          lines: [
            ['nar', 'Trên tường tiệm tóc Đẹp Mỗi Ngày có thêm một tấm ảnh: sinh nhật năm 1998, ba bé gái mặc áo ghi chữ "DIỆP".'],
            ['kp:man', 'Ảnh này khách gửi lâu rồi, chị dọn tủ mới thấy. Treo lên cho tiệm có không khí hoài niệm.'],
            ['tm:gam', '(đang hấp tóc) Khoan. Khu phố mình có ba chị Diệp. Tầng 7 một chị, loft sân thượng một chị, tầng 3 một chị.'],
            ['tm:gam', 'Ba chị Diệp, ba bé Diệp. Sinh ba thất lạc! Chị nói trước, chị là người đầu tiên phát hiện.'],
            ['kp:man', 'Trời ơi chị Gấm. Mà... nhìn kỹ thì bé bên trái cũng cầm hai cái điện thoại đồ chơi thiệt.'],
          ],
          choices: [
            { t: 'Hỏi chị Mận ảnh này ai gửi', fx: { hearts: { 'kp:man': 1 } },
              say: [['kp:man', 'Chị nhớ là một chị khách lớn tuổi hơn, làm kế toán... hay tài chính gì đó. Chị quên tên.']] },
            { t: 'Đăng Xóm Ơi: "Ai biết ba bé này không?"', fx: { mood: 2, hearts: { 'kp:man': 1 }, xomoi: '{ten}: (ảnh) Ai biết ba bé gái tên Diệp trong ảnh sinh nhật năm 1998 này không? Ảnh treo ở tiệm tóc.' },
              say: [['nar', 'Bài đăng có 84 bình luận trong 10 phút. 80 cái ghi "sinh ba thất lạc". 4 cái hỏi tiệm có gội đầu dưỡng sinh không.']] },
            { t: 'Không bình luận, gội đầu thư giãn thôi', fx: { money: -40000, mood: 5, energy: 3 },
              say: [['kp:man', 'Gội đầu xong thấy đầu nhẹ chưa? Nhẹ để chứa tin đồn đó em.']] },
          ],
        },
        missed: 'Bà Phấn: Tiệm tóc treo tấm ảnh năm 1998, ba bé gái áo ghi "DIỆP". Cả khu phố đang đồn sinh ba thất lạc. Tui chưa xác nhận, tui chỉ đồn.',
      },
      {
        gap: 1, place: 'cattoc', from: '17:00', to: '20:00',
        task: 'Ba chị Diệp gặp nhau ở tiệm tóc',
        scene: {
          lines: [
            ['nar', 'Ba chị Diệp tình cờ đặt lịch cùng giờ (chị Mận thề là tình cờ). Ba ghế liền nhau.'],
            ['agency:diep', '(một tay một điện thoại, tay thứ ba cũng đang cầm điện thoại) Chị nghe nói chị có hai em gái. Chị check lại liền.'],
            ['audit:diep', '(đánh tick-mark 4 màu lên tờ báo) Theo tài liệu hiện có, khả năng sinh ba là chưa đủ bằng chứng.'],
            ['tech:diep', 'Mình nên dựng một framework xác minh. Bước 1: đối chiếu tên. Ba người đều tên Diệp. Đạt.'],
            ['kp:man', '(thì thầm) {ten}, giờ sao? Chị dựng cuộc gặp này rồi, giờ chị sợ.'],
          ],
          choices: [
            { t: 'Mời ba chị chụp chung một tấm, tạo dáng y ảnh cũ', fx: { mood: 4, hearts: { 'kp:man': 2, 'agency:diep': 1 } },
              say: [['nar', 'Ảnh mới chụp xong. Ba chị đứng y vị trí năm 1998. Chị Mận treo cạnh ảnh cũ. Khách đứng xem kín cửa.']] },
            { t: 'Để tin đồn tự tắt, đi pha trà mời khách', fx: { hearts: { 'audit:diep': 1 } },
              say: [['audit:diep', 'Cảm ơn em. Ly trà này là bằng chứng duy nhất hôm nay chị tick xanh được.']] },
            { t: '(Nợ Kỹ Thuật) Giúp chị Diệp tầng 7 chạy framework điều tra', role: 'tech', fx: { hearts: { 'tech:diep': 3 }, flag: 'd25_dieu_tra' },
              say: [['tech:diep', 'Bước 2: phỏng vấn nhân chứng. Bước 3: retrospective. Em ghi biên bản giúp chị nha.']] },
            { t: '(Cân Đối) Xin đối chiếu giấy khai sinh của ba chị', role: 'audit', fx: { hearts: { 'audit:diep': 3 }, flag: 'd25_dieu_tra' },
              say: [['audit:diep', 'Ba ngày sinh khác nhau, ba bệnh viện khác nhau. Chị đánh dấu đỏ: "không phải sinh ba". Nhưng còn tấm ảnh...']] },
          ],
        },
        missed: 'Chị Mận: Ba chị Diệp gặp nhau ở tiệm. Một chị cầm 3 điện thoại, một chị tick 4 màu, một chị nói framework. Cả ba cùng nói "để chị check lại".',
      },
      {
        gap: 1, place: 'cattoc', from: '17:00', to: '20:00',
        task: 'Chị Hồng tới tiệm tóc kể sự thật tấm ảnh',
        scene: {
          lines: [
            ['agency:hong', '(bước vào, cầm timesheet) Ảnh này chị gửi chị Mận đó. Chị là chị ruột của Diệp bên Trend Trễ.'],
            ['agency:hong', 'Năm đó có một bộ phim truyền hình, nhân vật chính tên Diệp. Cả xóm sinh con gái đều đặt tên Diệp.'],
            ['agency:hong', 'Còn ảnh là sinh nhật chung lớp mẫu giáo. Cô giáo in áo chữ "DIỆP" vì lớp có ba bé tên Diệp, cho dễ gọi.'],
            ['tech:diep', 'Vậy không phải sinh ba. Mình là... cùng lớp mẫu giáo. Framework xác nhận.'],
            ['audit:diep', 'Kết luận: không sai sót trọng yếu. Nhưng chị vẫn muốn gặp lại hai người mỗi quý.'],
            ['agency:diep', '(cất cả ba điện thoại vô túi, lần đầu tiên trong năm) Chị cũng vậy.'],
          ],
          choices: [
            { t: 'Đề xuất lập "Hội Diệp", họp mỗi quý ở tiệm', fx: { mood: 5, hearts: { 'kp:man': 2, 'tech:diep': 1, 'agency:diep': 1, 'audit:diep': 1 }, flag: 'd25_hoi_diep', xomoi: 'Chị Mận: Chính thức thành lập "Hội Diệp", họp mỗi quý ở tiệm tóc Đẹp Mỗi Ngày. Không phải sinh ba. Là bạn mẫu giáo.' },
              say: [['kp:man', 'Hội Diệp! Họp mỗi quý, gội đầu giảm 10%. Tiệm có thêm ba khách ruột rồi.']] },
            { t: 'Hơi tiếc: "vậy không phải sinh ba hả chị?"', fx: { mood: -1, hearts: { 'agency:hong': 1 } },
              say: [['agency:hong', 'Không. Nhưng ba đứa nó giống nhau ở chỗ: không đứa nào nộp timesheet đúng hạn.']] },
            { t: '(Trend Trễ) Nhận viết caption cho Hội Diệp', role: 'agency', fx: { hearts: { 'agency:diep': 2, 'agency:hong': 1 } },
              say: [['agency:diep', '"Không cùng máu, cùng tên, cùng tiệm." Em viết được đó. Chị duyệt, không cần check lại.']] },
          ],
        },
        missed: 'Chị Hồng: Ảnh đó chị gửi. Ba bé tên Diệp vì cùng xem một bộ phim năm đó, ảnh là sinh nhật chung lớp mẫu giáo. Không có sinh ba nha cả nhà.',
      },
    ],
    end: 'Biên bản khu phố: Lập "Hội Diệp", họp mỗi quý ở tiệm tóc Đẹp Mỗi Ngày. Tiệm thêm 3 khách trung thành. Tin đồn sinh ba được đóng, có biên bản.',
  },

  // ───────────────────────── Drama 26 ─────────────────────────
  {
    id: 'd26', no: 26, title: 'Bí mật can nước mắm',
    who: ['kp:lai', 'kp:cam', 'kp:thong', 'tm:dat', 'bama:cosau'],
    minDay: 20,
    acts: [
      {
        gap: 0, place: 'comtam', from: '06:00', to: '10:00',
        task: 'Cơm tấm: cô Lài nghi lộ công thức nước mắm',
        scene: {
          lines: [
            ['nar', 'Cô Lài cầm một hộp cơm sáng mua bên cà phê cóc bà Cẩm. Nếm muỗng nước mắm. Đặt muỗng xuống rất chậm.'],
            ['kp:lai', 'Y chang. Nước mắm của bà Cẩm y chang của cô. Công thức này cô giữ hai mươi năm.'],
            ['kp:lai', 'Thông. Sáng nào con cũng ăn sáng bên đó. Con có kể gì không?'],
            ['kp:thong', 'Con... con chỉ ăn xôi! Con thề trên cái lò than! Con chưa từng nói chữ "nước mắm" bên đó!'],
            ['kp:lai', 'Vậy sao nó giống? Nước mắm đâu có tự đi qua đường.'],
          ],
          choices: [
            { t: 'Bênh Thông: "Ảnh ăn sáng chứ đâu có khai báo"', fx: { hearts: { 'kp:thong': 2, 'kp:lai': -1 } },
              say: [['kp:thong', 'Cảm ơn {ten}. Mai con mời {ten} dĩa sườn nướng tay con. Sườn này không có bí mật gì hết.']] },
            { t: 'Đề xuất nếm mù hai chén cho công bằng', fx: { food: 3, hearts: { 'kp:lai': 1 }, flag: 'd26_nem_mu' },
              say: [['kp:lai', '(nếm mù) Chén này... giống 95%. Thiếu một cái gì đó ngọt ngọt. Ủa?']] },
            { t: 'Ăn một dĩa cơm tấm để "nghiên cứu"', fx: { money: -35000, food: 15 },
              say: [['nar', 'Nước mắm cô Lài ngọt hậu. Bạn không biết vì sao. Bạn chỉ biết là muốn thêm chén nữa.']] },
          ],
        },
        missed: 'Thông: Cô Lài nghi tui lộ công thức nước mắm vì tui hay ăn sáng ở cà phê cóc. Tui chỉ ăn xôi, tui thề trên cái lò than.',
      },
      {
        gap: 1, place: 'comtam', from: '17:00', to: '21:00',
        task: 'Anh Đạt tới cơm tấm "chạy retrospective" miễn phí',
        scene: {
          lines: [
            ['tm:dat', 'Chào cô Lài! Em là Agile Coach. Em nghe có xung đột nhóm. Em chạy retrospective miễn phí. Không ai nhờ, nhưng em tới.'],
            ['nar', 'Anh Đạt dán giấy nhớ vàng lên nồi cơm, giấy nhớ xanh lên lò than, giấy nhớ hồng lên trán Thông.'],
            ['tm:dat', 'Ba cột: Cái gì tốt, cái gì chưa tốt, cái gì làm khác. Thông, cột "chưa tốt" của em là gì?'],
            ['kp:thong', 'Bị nghi oan. Và giấy nhớ trên trán.'],
            ['kp:lai', 'Anh Đạt, giấy nhớ trên lò than sắp cháy rồi đó.'],
            ['tm:dat', 'Đó là "học hỏi"! Mình ghi vào cột "làm khác": không dán giấy gần lửa. Tốt lắm!'],
          ],
          choices: [
            { t: 'Nhờ anh Đạt giúp, chấp nhận 3 vòng "vài ý nhỏ"', fx: { energy: -6, hearts: { 'tm:dat': 2, 'kp:lai': 1 }, flag: 'd26_retro' },
              say: [['tm:dat', 'Vòng 1 xong. Vài ý nhỏ: nên có bảng Kanban cho sườn. Vòng 2 sau 15 phút nữa nha.']] },
            { t: 'Gỡ giấy nhớ khỏi lò than trước khi cháy', fx: { hearts: { 'kp:lai': 2, 'kp:thong': 1 } },
              say: [['kp:lai', 'Con cứu cái lò của cô. Giấy nhớ thì cô giữ lại, ghi đơn gọi món cũng tiện.']] },
            { t: '(T&M) Xin anh Đạt cho làm Scrum Master phụ', role: 'tm', fx: { energy: -4, hearts: { 'tm:dat': 3 } },
              say: [['tm:dat', 'Thực tập sinh T&M có tinh thần agile! Em giữ đồng hồ. Mỗi người nói đúng 2 phút, kể cả nồi cơm.']] },
          ],
        },
        missed: 'Anh Đạt: Retrospective ở cơm tấm xong. Đã dán 31 giấy nhớ, 2 cái rơi vào nồi mỡ hành. Mình gọi đó là "học hỏi".',
      },
      {
        gap: 1, place: 'cho', from: '07:00', to: '11:00',
        task: 'Sạp tạp hoá cô Sáu: lộ bí mật can nước mắm',
        scene: {
          lines: [
            ['nar', 'Sáng ở chợ. Cô Lài và bà Cẩm cùng đứng trước sạp cô Sáu, mỗi người tay xách một can nước mắm y chang nhau.'],
            ['bama:cosau', 'Hai bà mua cùng một loại can, của cùng một nhà thùng, mười năm nay rồi. Tui tưởng hai bà biết.'],
            ['kp:cam', 'Vậy là tui đâu có ăn cắp công thức. Tui mua nước mắm, pha theo trí nhớ thôi.'],
            ['kp:lai', 'Khoan. Vậy cái ngọt hậu của cô... là đường thốt nốt. Bà Cẩm không có đường thốt nốt.'],
            ['bama:cosau', 'Đường thốt nốt tui chỉ bán cho cô Lài, vì không ai khác hỏi. Bí mật là ở đó.'],
            ['kp:cam', '(cười) Hai mươi năm cãi nhau vì một ký đường. Đời buồn cười ghê.'],
          ],
          choices: [
            { t: 'Khuyên cô Lài ghi "nước mắm đường thốt nốt" lên bảng', fx: { mood: 3, hearts: { 'kp:lai': 2, 'kp:thong': 1 }, flag: 'd26_bang' },
              say: [['kp:lai', 'Ghi! Bí mật mà ghi lên bảng thì thành đặc sản. Thông, con viết chữ đẹp, con viết.']] },
            { t: 'Khuyên bà Cẩm giữ cà phê, đừng bán cơm nữa', fx: { hearts: { 'kp:cam': 1, 'kp:lai': 1 } },
              say: [['kp:cam', 'Ừ. Bán cơm cực quá, tui 64 tuổi rồi. Cà phê thôi, cơm để cô Lài.']] },
            { t: 'Rủ hai bà làm combo "cà phê cóc + cơm tấm"', fx: { mood: 4, hearts: { 'kp:cam': 2, 'kp:lai': 2 }, flag: 'd26_combo' },
              say: [['nar', 'Combo mới: uống cà phê bên bà Cẩm, qua cô Lài ăn cơm giảm 3.000đ. Đã ghi vào sổ tay "Combo khu phố".']] },
          ],
        },
        missed: 'Cô Sáu Tạp Hóa: Cô Lài với bà Cẩm mua cùng một loại can nước mắm ở sạp tui. Bí mật là đường thốt nốt, cô Lài có, bà Cẩm không. Hết giận rồi.',
      },
    ],
    end: 'Biên bản khu phố: Cô Lài ghi "nước mắm đường thốt nốt" lên bảng, khách tăng. Thông được tin lại. Anh Đạt có thêm "case study agile thành công" (không ai hỏi).',
  },

  // ───────────────────────── Drama 27 ─────────────────────────
  {
    id: 'd27', no: 27, title: 'Kevin vay nóng',
    who: ['bama:tuan', 'kp:thinh', 'bama:hang', 'agency:loc'],
    minDay: 42,
    acts: [
      {
        gap: 0, place: 'daumoi', from: '06:00', to: '11:00',
        task: 'Đầu mối Thuận Phát: Kevin bị đòi nợ quảng cáo',
        scene: {
          lines: [
            ['nar', 'Bãi xe đầu mối. Kevin Tuấn đội nón, đeo khẩu trang, đeo kính râm, vẫn bị nhận ra vì áo ghi "Head of Innovation".'],
            ['kp:thinh', 'Kevin. Tháng rồi em vay anh một khoản chạy quảng cáo. Nay tới hạn.'],
            ['bama:tuan', '(nhìn điện thoại) Anh Lộc bên Trend Trễ nói "CPM đang cao". Em không hiểu lắm nhưng nghe cao là biết tốn.'],
            ['kp:thinh', 'Anh không cần tiền mặt. Trả bằng khô gà Ba & Má. 20 bịch. Đầu mối anh đang thiếu món ăn vặt.'],
            ['bama:tuan', 'Khô gà là của Má. Má đếm kho mỗi sáng thứ Hai. Má đếm bằng mắt, không cần bảng tính.'],
          ],
          choices: [
            { t: 'Hỏi anh Thịnh: khô gà bán sỉ ở đây chạy không?', fx: { hearts: { 'kp:thinh': 1, 'bama:tuan': 1 } },
              say: [['kp:thinh', 'Chạy. Tạp hoá mấy chợ quanh đây hỏi hoài. Có khô Ba & Má là anh lấy đều.']] },
            { t: 'Khuyên Kevin nói thật với Má ngay từ đầu', fx: { hearts: { 'bama:tuan': -1, 'bama:hang': 1 }, flag: 'd27_noi_that' },
              say: [['bama:tuan', 'Nói thật với Má... Em thà deploy production thứ Sáu. Mà thôi, để em suy nghĩ.']] },
            { t: '(Trend Trễ) Mở trình quản lý quảng cáo, tối ưu lại cho Kevin', role: 'agency', fx: { hearts: { 'agency:loc': 1, 'bama:tuan': 2 }, flag: 'd27_toi_uu' },
              say: [['agency:loc', 'Em tắt mấy nhóm quảng cáo nhắm "mọi người, mọi tuổi, mọi nơi" rồi. CPM... vẫn cao, nhưng đỡ cháy.']] },
          ],
        },
        missed: 'Anh Thịnh: Có người nợ tui một khoản chạy quảng cáo, đề nghị trả bằng khô gà. Tui đồng ý. Tui không nói tên, tên bắt đầu bằng "Ke".',
      },
      {
        gap: 1, place: 'bagac', from: '06:00', to: '08:00',
        task: 'Sáng sớm: Kevin nhờ chở 20 bịch khô ra đầu mối',
        scene: {
          lines: [
            ['nar', '6h sáng trước Ba & Má. Kevin đứng cạnh ba gác Chú Bảy, ôm 20 bịch khô gà như ôm bí mật quốc gia.'],
            ['bama:tuan', 'Phụ em chở ra đầu mối trước 7h30 nha. Má dậy 7h30. Chú Bảy đi giao hàng rồi, chìa khóa em mượn rồi.'],
            ['bama:tuan', 'Em sẽ trả lại kho từ lương. Từ từ. Rất từ từ. Má sẽ không biết.'],
            ['nar', 'Trên lầu, rèm cửa phòng Má khẽ động. Có thể là gió. Có thể không.'],
          ],
          choices: [
            { t: 'Phụ Kevin chở 20 bịch khô ra đầu mối', fx: { energy: -8, hearts: { 'bama:tuan': 2, 'kp:thinh': 1 }, flag: 'd27_giup' },
              say: [['kp:thinh', 'Đủ 20 bịch. Nợ xong. Kevin, lần sau chạy quảng cáo thì nhắm ai mua khô, đừng nhắm cả thế giới.']] },
            { t: 'Từ chối, khuyên Kevin lên nói với Má', fx: { hearts: { 'bama:tuan': -1, 'bama:hang': 1 }, flag: 'd27_noi_that' },
              say: [['bama:tuan', 'Được rồi... được rồi. Để em uống ly cà phê cho đủ can đảm. Ly thứ ba.']] },
            { t: '(Ba & Má) Đề xuất trả góp từ lương, báo Má đàng hoàng', role: 'bama', fx: { hearts: { 'bama:hang': 2, 'bama:tuan': 1 }, flag: 'd27_noi_that' },
              say: [['bama:tuan', 'Trả góp 12 tháng, có bảng, có chữ ký. Má thích giấy tờ. Đi, mình lên trình Má.']] },
          ],
        },
        missed: 'Chú Bảy: Sáng nay ba gác của tui bị mượn lúc 6h. Về thì thơm mùi khô gà, kho thiếu 20 bịch. Tui không hỏi, tui chỉ ghi sổ.',
      },
      {
        gap: 1, place: 'bama', from: '08:00', to: '17:00',
        task: 'Ba & Má: Má đếm kho khô gà',
        scene: {
          lines: [
            ['bama:hang', '(đứng giữa kho, không cầm sổ) 20 bịch. Thiếu đúng 20 bịch khô gà.'],
            ['bama:hang', 'Má không cần camera. Má không cần bảng tính. Má nhìn kệ là biết kệ đang buồn.'],
            ['bama:tuan', '(mồ hôi như đứng trước lò rang) Má... con giải thích được. Con có slide.'],
            ['kp:thinh', '(gọi tới) Chị Hằng, khô nhà chị bán ở đầu mối chạy quá. Chị cho em lấy thêm 50 bịch được không?'],
            ['bama:hang', '...Đầu mối? Bán chạy? (quay qua nhìn Kevin rất lâu)'],
          ],
          choices: [
            { t: 'Đứng cạnh Kevin, cùng khai thật với Má', fx: { hearts: { 'bama:hang': 1, 'bama:tuan': 2 } },
              say: [['bama:hang', 'Nói thật thì Má bớt giận một nửa. Nửa còn lại trừ lương. Con với bạn đi rửa 200 cái hũ.']] },
            { t: 'Đề xuất Má mở luôn kênh bán sỉ ở đầu mối', fx: { mood: 3, hearts: { 'bama:hang': 2, 'kp:thinh': 1 }, flag: 'd27_kenh_si' },
              say: [['bama:hang', 'Kênh sỉ... được. Giá sỉ Má tính. Kevin không được đụng vô giá. Kevin đi rửa hũ.']] },
            { t: '(Ba & Má) Trình bảng trả góp nợ từ lương của Kevin', role: 'bama', fx: { hearts: { 'bama:hang': 3, 'bama:tuan': 1 } },
              say: [['bama:hang', 'Bảng này ai làm? Thực tập sinh làm? Gọn. Kevin, học bạn đi.']] },
          ],
        },
        missed: 'Cô Hằng: Kho thiếu 20 bịch khô. Má biết hết rồi. Kevin trả góp từ lương. Khô Ba & Má bán ở đầu mối luôn, Má tính giá.',
      },
    ],
    end: 'Biên bản khu phố: Khô Ba & Má có mặt ở đầu mối Thuận Phát, thành kênh bán sỉ mới. Kevin trả nợ góp từ lương. Anh Lộc ghi chú: "CPM vẫn cao".',
  },

  // ───────────────────────── Drama 28 ─────────────────────────
  {
    id: 'd28', no: 28, title: 'Săn đầu người thầy giáo Tin',
    who: ['kp:kiet', 'hr:tuan', 'hr:hanh', 'kp:duc', 'kp:hao'],
    minDay: 37, startOn: [1, 2, 3],
    acts: [
      {
        gap: 0, place: 'caphe', from: '06:00', to: '10:30',
        task: 'Cà phê cóc: hai headhunter cùng săn thầy Kiệt',
        scene: {
          lines: [
            ['nar', 'Cà phê cóc bảy ghế. Thầy Kiệt ngồi ghế giữa. Bên trái anh Tuấn (Người Đúng Chỗ), bên phải chị Hạnh (Săn Đầu Pro).'],
            ['hr:tuan', 'Thầy Kiệt, trung tâm tư bên anh trả gấp đôi lương hợp đồng. Có máy lạnh. Có máy chiếu không nhấp nháy.'],
            ['hr:hanh', 'Bên chị trả gấp đôi cộng thưởng Tết. Và không bắt thầy đứng lớp tiết 1 thứ Hai.'],
            ['kp:kiet', 'Tiền thì em cần thật. Mà học trò em đang ôn thi Tin cấp phường. Em đi giữa chừng thì tụi nhỏ ôn với ai.'],
            ['kp:cam', '(rót thêm trà) Hai đứa này ngồi đây từ 6h, mỗi đứa mới gọi một ly. Săn người mà không săn cà phê.'],
          ],
          choices: [
            { t: 'Hỏi thầy Kiệt: thầy muốn gì nhất?', fx: { hearts: { 'kp:kiet': 2 } },
              say: [['kp:kiet', 'Em muốn đủ tiền thuê phòng có cửa sổ. Và muốn dạy tụi nhỏ viết được con game đầu tiên.']] },
            { t: 'Nhắc khéo: học trò thầy sắp thi Tin cấp phường', fx: { hearts: { 'kp:kiet': 1, 'hr:tuan': -1, 'hr:hanh': -1 } },
              say: [['hr:hanh', 'Ừ thì... chị chờ thầy thi xong. Chị kiên nhẫn. Chị đặt nhắc lịch rồi.']] },
            { t: '(Người Đúng Chỗ) Giành ứng viên cho anh Tuấn', role: 'hr', fx: { hearts: { 'hr:tuan': 2, 'hr:hanh': -2 }, flag: 'd28_hr_gianh' },
              say: [['hr:tuan', 'Thực tập sinh bên anh! Gửi thầy bản mô tả công việc. Font đẹp. Có logo. Chị Hạnh không có logo.']] },
          ],
        },
        missed: 'Bà Cẩm: Sáng nay có hai đứa headhunter ngồi hai bên thầy Kiệt, mỗi đứa gọi đúng một ly. Thầy Kiệt chưa trả lời ai.',
      },
      {
        gap: 1, place: 'net', from: '16:00', to: '21:30',
        task: 'Net Không Lag: anh Hào mời thầy Kiệt làm HLV',
        scene: {
          lines: [
            ['nar', 'Net Không Lag. Tôm đang chơi một ván chiến thuật, tay nhanh hơn cả máy. Thầy Kiệt đứng sau xem.'],
            ['kp:hao', 'Kiệt, hồi đó mày với tao chung đội. Giờ tao mở giải net cuối tuần, cần huấn luyện viên. Mày làm không?'],
            ['kp:kiet', 'Tôm, em xoay góc nhìn sớm hơn nửa giây. Đó, giống vòng lặp, bắt đầu sớm thì xong sớm.'],
            ['kp:tom', 'Dạ! Thầy dạy Tin mà chơi game cũng giỏi hả thầy?'],
            ['kp:hao', 'Câu lạc bộ có giờ giấc: thứ Bảy, Chủ nhật, 14h tới 17h. Net đóng lúc 22h, không hoạt động 22h-8h, đúng luật (thông tin giải trí, không phải tư vấn pháp lý).'],
          ],
          choices: [
            { t: 'Ủng hộ câu lạc bộ game có giờ giấc', fx: { mood: 3, hearts: { 'kp:hao': 2, 'kp:kiet': 1 }, flag: 'd28_clb' },
              say: [['kp:kiet', 'Ba giờ một tuần, cuối tuần, có giờ về. Được. Mà Tôm phải làm xong bài tập mới được vô.'], ['kp:tom', 'Dạ... dạ được.']] },
            { t: 'Lo lắng: giải net có làm tụi nhỏ trễ học không?', fx: { hearts: { 'kp:kiet': 1 } },
              say: [['kp:hao', 'Không. Luật câu lạc bộ: điểm Tin dưới 7 là ngồi ghế dự bị. Thầy Kiệt chấm.']] },
            { t: 'Thử một ván với Tôm, thua trong 4 phút', fx: { money: -10000, mood: 4, energy: -2 },
              say: [['kp:tom', 'Anh chị chơi được mà! 4 phút là lâu hơn anh Pháo đó.']] },
          ],
        },
        missed: 'Anh Hào: Tui mời thầy Kiệt làm huấn luyện viên giải net cuối tuần, có giờ giấc đàng hoàng. Thầy nói học trò phải làm xong bài tập mới được vô.',
      },
      {
        gap: 1, place: 'truong_th', from: '15:30', to: '17:30',
        task: 'Trường THCS: thầy Đức hỏi bạn chuyện dạy thay',
        scene: {
          lines: [
            ['kp:duc', 'Em là {ten} hả? Thầy nghe nói em hay ngồi với thầy Kiệt. Trường đang có nguy cơ mất giáo viên Tin.'],
            ['kp:duc', 'Dạy thêm thì được, nhưng phải báo hiệu trưởng, và không dạy thêm có thu tiền học sinh lớp mình đang dạy chính khóa (thông tin giải trí, không phải tư vấn pháp lý).'],
            ['kp:kiet', 'Dạ em hiểu. Nếu dạy buổi tối ở trung tâm, dạy học sinh trường khác, có báo thầy, thì em ở lại được.'],
            ['kp:duc', 'Còn nếu em ấy đi, trường cần người dạy hợp đồng. Em có kinh nghiệm công nghệ không? Dạy thay được không?'],
          ],
          choices: [
            { t: 'Khuyên thầy Kiệt ở lại, dạy buổi tối hợp lệ', fx: { mood: 4, hearts: { 'kp:duc': 2, 'kp:kiet': 2 }, flag: 'd28_o_lai' },
              say: [['kp:kiet', 'Ban ngày dạy trường, tối dạy trung tâm, cuối tuần làm huấn luyện viên. Em hết thời gian ngủ, nhưng có cửa sổ.']] },
            { t: 'Chúc thầy Kiệt đi trung tâm, trường sẽ tìm người', fx: { hearts: { 'kp:kiet': 1, 'kp:duc': -1 } },
              say: [['kp:duc', 'Thầy tôn trọng. Thầy dán thông báo tuyển giáo viên Tin hợp đồng. Ai có hồ sơ công nghệ thì tới gặp thầy.']] },
            { t: '(Nợ Kỹ Thuật) Nhận dạy hợp đồng thay một buổi mỗi tuần', role: 'tech', fx: { energy: -5, hearts: { 'kp:duc': 3, 'kp:kiet': 1 }, flag: 'd28_day_thay' },
              say: [['kp:duc', 'Hồ sơ Nợ Kỹ Thuật hả? Tốt. Bài đầu tiên: dạy tụi nhỏ vì sao "máy em chạy được" là chưa đủ.']] },
            { t: '(Người Đúng Chỗ) Chốt hợp đồng cho trung tâm, nhận phí', role: 'hr', fx: { money: 150000, hearts: { 'hr:tuan': 2, 'kp:duc': -1 }, flag: 'd28_hr_phi' },
              say: [['hr:tuan', 'Chốt! Phí về công ty, em có thưởng nóng. Thầy Đức nhìn em hơi lâu, em cứ mỉm cười.']] },
          ],
        },
        missed: 'Thầy Đức: Thầy Kiệt chọn ở lại trường, tối dạy trung tâm có báo hiệu trưởng, cuối tuần làm huấn luyện viên câu lạc bộ game ở net.',
      },
    ],
    end: 'Biên bản khu phố: Vụ săn thầy Kiệt khép lại. Trường có lịch dạy Tin rõ ràng, dạy thêm có báo hiệu trưởng. Net Không Lag có câu lạc bộ game cuối tuần, có giờ về.',
  },
];
