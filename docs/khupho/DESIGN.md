# Khu phố T&M: tài liệu thiết kế (bản trình Game Owner duyệt)

> Trạng thái: **bản thiết kế, chưa có code**. Ngày viết: 06/11/2026.
> Chế độ mới, tách riêng khỏi Solo và Multiplayer, nằm trong file riêng của nó.
> Nguồn số liệu: `docs/research/khupho/*.md` (mỗi con số thật đều có nguồn ở đó). Số nào ghi **[số thiết kế]** là
> số do nhóm thiết kế tự đặt vì chưa tìm được nguồn, có thể chỉnh khi chơi thử.
> Sơ đồ quan hệ: `docs/khupho/people.json` (157 người, 230 mối quan hệ), sẽ vẽ thành trang tương tác.
> Mọi tên quán, chuỗi, app, ngân hàng trong game đều là tên tự đặt. Không có người thật.
> Câu nào nói về luật là tóm tắt cho vui: "(thông tin giải trí, không phải tư vấn pháp lý)".

## Tóm tắt trong 10 dòng

1. Một khu phố ở TP.HCM, chơi mãi không hết: không có "hết mùa", không có game over.
2. Bạn thuê một phòng trọ, đi làm ở bất kỳ đâu: trà sữa, cơm tấm, bánh mì, quán net, tiệm tóc, chợ, quán nhậu,
   xe ôm, xe ba gác của Chú Bảy, trạm y tế, trường học… và 7 công ty đã có trong Solo.
3. Mỗi nơi là một mini-game "ca làm" riêng, có nấc thang từ nhân viên lên tới mở quán riêng.
4. Quán đầu tiên làm là **trà sữa**: pha đúng ly, đi nhập hàng, chọn kênh quảng cáo, xem lời lỗ mỗi ngày.
5. Các cơ sở mua bán với nhau thật: heo đắt thì cơm tấm đắt, mưa thì app giao hàng đông, cúp điện thì quán trữ đá.
6. **Hồ sơ cá nhân** ghi lại mọi nơi bạn từng làm, mãi mãi, đi theo bạn khi xin việc, lưu trên đám mây.
7. Khu phố có 59 cư dân mới (11 em nhỏ) và cả 98 nhân vật của 7 công ty, nối với nhau bằng 230 sợi dây quan hệ.
8. 28 kịch bản drama "mất não" kiểu phim giờ vàng: vui, không bạo lực thật, không dính trẻ em vào chuyện yêu đương.
9. Lịch khu phố chạy theo năm: Tết, Trung thu, mùa mưa ngập, thi vào 10, cúp điện theo lịch… năm sau khác năm trước.
10. Làm theo 4 giai đoạn. Giai đoạn 1: đi bộ trên phố, phòng trọ, quán trà sữa đầy đủ, hồ sơ cá nhân, nhóm cư dân.

---

## 1. Tầm nhìn

### 1.1 Một câu

**"Khu phố T&M" là một khu phố ấm áp và hơi châm biếm, nơi bạn sống, đi làm, đổi nghề, quen hàng xóm và hóng drama,
mỗi ngày một chút, càng lâu càng thấy khu phố là của mình.**

Mục tiêu duy nhất của chế độ này (Owner yêu cầu 4): người chơi **chơi lâu nhất và nhiều nhất có thể**. Vì vậy mọi
quyết định bên dưới đều trả lời câu hỏi: "cái này có làm người ta muốn quay lại ngày mai không, mà không làm họ
thấy bị ép?"

### 1.2 Giọng văn

- Giống Solo: hài, "đời", hơi cà khịa khi hợp. Cà khịa thói quen, giấy tờ, giá cả; **không** cà khịa người yếu thế.
- Ấm áp là nền: khu phố an toàn, ai cũng có lúc dễ thương. Drama là gia vị, không phải món chính.
- Luật thật được dùng làm chất liệu (lương tối thiểu vùng, thuế hộ kinh doanh, giờ đóng cửa quán net, tiền điện
  chủ trọ…), luôn kèm câu "(thông tin giải trí, không phải tư vấn pháp lý)".

### 1.3 Vì sao người chơi muốn quay lại (8 trụ cột)

Dựa trên `retention.md` (thuyết tự chủ - năng lực - gắn kết của Ryan, Rigby & Przybylski 2006; vòng ngày kiểu game
nông trại; lịch theo mùa; báo cáo "Coziness in Games" 2017; cạm bẫy của chuỗi đăng nhập hằng ngày).

| # | Trụ cột | Trong Khu phố T&M là gì | Vì sao giữ chân |
|---|---|---|---|
| 1 | **Nhịp ngày có "đóng lại"** | Mỗi ngày kết thúc bằng màn hình "Tối nay ở phòng trọ": tiền vào ra, kỹ năng tăng, 1 chuyện khu phố, 1 tin cho ngày mai ("mai cúp điện 8h-17h") | Cảm giác xong một ngày, muốn thêm "một ngày nữa" |
| 2 | **Mục tiêu nhỏ** | Mỗi sáng 3 tin nhắn nhờ vả từ hàng xóm (gợi ý, bỏ qua không mất gì); mỗi ca có 1 thử thách nhỏ | Luôn có việc vừa sức để làm ngay |
| 3 | **Nấc thang dài** | Mỗi nghề 4-6 bậc; mở quán riêng; làm trưởng khu phố; 7 công ty; nghề giáo | Luôn thấy đỉnh tiếp theo |
| 4 | **Sưu tập** | Sổ tay "Món ngon khu phố", "Biên bản khu phố" (các vụ phạt hài hước đã gặp), Danh bạ có độ thân, Album kiểu tóc, Công thức ly trà sữa riêng, Combo khu phố ẩn | Muốn điền cho đủ |
| 5 | **Quan hệ** | 157 người nhớ bạn và phản ứng theo lịch sử; độ thân 0-5 tim; rủ đi nhậu thứ Sáu, ăn trưa cơm tấm | Người ta quay lại vì người, không chỉ vì điểm |
| 6 | **Lịch theo mùa** | Tết, Rằm, Trung thu, 20/11, mùa mưa, thi vào 10, ngày lương, cúp điện theo lịch | Luôn có "sắp tới" để chờ |
| 7 | **Khu phố thay đổi** | Quán đóng, quán mới mở, tụi nhỏ lên lớp, chủ trọ sơn lại nhà, giá cả lên xuống | Quay lại là thấy khác |
| 8 | **Drama nhiều hồi** | 28 kịch bản kéo dài 2-4 hồi qua nhiều ngày, hồi sau tùy lựa chọn hồi trước | "Muốn biết chuyện gì xảy ra tiếp" |

Thêm ba "chất keo" nhỏ:
- **Tự chủ**: đổi nghề lúc nào cũng được (Owner đã đồng ý: được nghỉ để chuyển chỗ làm), không bị phạt.
- **Năng lực thấy được**: mỗi nghề có kỹ năng tăng rõ (pha ly nhanh hơn, ít sai % đường hơn), hiện trên hồ sơ.
- **Combo khu phố**: ghép dịch vụ của 2 nơi (cơm tấm + trà đá miễn phí; photo + trà sữa giờ tan trường) mở khóa
  combo ẩn, ghi vào sổ tay.

### 1.4 Cạm bẫy phải tránh

| Cạm bẫy | Cách tránh trong game |
|---|---|
| **Cày lặp lại (grind)** | Mỗi ca có biến thể theo giờ, mùa, sự kiện; sau khi thạo một nghề (bậc 3) có nút "giao ca cho đồng nghiệp" để tự chạy, nhận 70% công |
| **Phạt khi vắng mặt** | Không có chuỗi đăng nhập. Vắng lâu, khu phố tự sống ở mức trung bình; quán của bạn chạy "ổn"; hộp thư "Chuyện trong lúc bạn đi vắng" |
| **Sợ bỏ lỡ (FOMO)** | Sự kiện theo mùa lặp lại mỗi năm. Drama bỏ lỡ sẽ quay lại ở dạng "phát lại" (người trong cuộc kể lại, vẫn chọn được một lựa chọn nhỏ) |
| **Tiền là tất cả** | Cân bằng bằng độ thân, uy tín khu phố, sưu tập, cấp nghề. Nhiều mở khóa cần độ thân chứ không cần tiền |
| **Ép thời gian thật** | Ngày trong game qua khi bạn đi ngủ. Không có hẹn giờ thật, không có "chờ 4 tiếng" |
| **Drama quá nặng** | Giọng châm biếm, hậu quả nhẹ và sửa được; không ai bị thương thật; trẻ em không bao giờ dính chuyện yêu đương |
| **Kéo dài giả tạo** | Không có tiền ảo, không có mua bằng tiền thật trong thiết kế này |

### 1.5 Không có game over

- Hết tiền: chủ trọ cho nợ 1 tháng, Cô Bánh Mì cho "ghi sổ" ổ bánh mì, khu phố có bữa cơm chung tối Chủ nhật.
- Kiệt sức: xỉu nhẹ, tỉnh dậy ở trạm y tế, mất 1 ca, được bác sĩ Lâm cằn nhằn, khám BHYT 36.500đ (có thẻ thì gần
  như miễn phí).
- Bị cho nghỉ việc: ghi vào hồ sơ với lý do vui vẻ, nơi khác vẫn nhận.
- Phạt hành chính (vỉa hè, tạm trú, tiếng ồn): số tiền theo luật thật nhưng không làm sập tiến trình, ghi vào
  "Biên bản khu phố" như một món sưu tập.

---

## 2. Bản đồ khu phố

### 2.1 Tên và địa danh

- Tên chính thức trong game: **Khu phố 7, phường Tâm Mỹ, TP.HCM** (phường hư cấu). Ở TP.HCM, dưới phường là
  **khu phố** với **Trưởng khu phố** (không còn "tổ dân phố" như cả nước). Có Ban điều hành khu phố, Bí thư chi bộ
  khu phố và Trưởng ban công tác Mặt trận khu phố. Không có "quận" trong địa chỉ (bỏ cấp quận từ 01/07/2025).
- Vì sao gọi "Khu phố T&M": người già bảo là "Tâm Mỹ", T&M Partners bảo là đặt theo tên công ty. Chị Tuyết không
  đính chính. (Một câu đùa chạy suốt game.)
- Cơ quan đúng tên: **Công an phường Tâm Mỹ** (cảnh sát khu vực làm việc trực tiếp với dân), **UBND phường Tâm Mỹ**
  (không có trụ sở trên bản đồ, chỉ nhắc tên), **Điện lực** (phòng giao dịch khu vực), **Trạm y tế phường**.

### 2.2 Sơ đồ (nhìn từ trên xuống)

```
                                  BẮC ↑
┌────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│ TRƯỜNG TIỂU HỌC    │ SÂN CHƠI           │ CHUNG CƯ CŨ LÔ C   │ CAO ỐC TÂM MỸ      │ NHÀ PHỐ 5 TẦNG     │
│ + TRƯỜNG THCS      │ + sân bóng mini    │ tầng 4: Người      │ T3-5 Cân Đối       │ sân thượng:        │
│ (chung cổng,       │ (tụi nhỏ tập       │ Đúng Chỗ HR        │ T7 Nợ Kỹ Thuật     │ Trend Trễ Agency   │
│  mở 6h30)          │  thể dục 17h)      │ (không thang máy)  │ T12 T&M Partners   │ (loft)             │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ BA & MÁ            │ TRẠM Y TẾ PHƯỜNG   │ TRÀ SỮA            │ TIỆN LỢI           │ NET KHÔNG LAG      │
│ nhà phố + xưởng    │ + nhà thuốc        │ FULL TOPPING       │ LUÔN MỞ 24h        │ (8h đến 22h)       │
│ GIÀN PHƠI sân sau  │                    │ (quán bạn làm      │                    │                    │
│ nhìn ra cổng trường│                    │  đầu tiên)         │                    │                    │
╞══════════════════════════════════ ĐƯỜNG TÂM MỸ (đường chính khu phố) ══════════════════════════════════╡
│ CÔNG AN PHƯỜNG     │ VP KHU PHỐ 7 (loa) │ CÀ PHÊ CÓC         │ PHOTO THẦN TỐC     │ TIỆM TÓC           │
│ TÂM MỸ             │ + ĐIỆN LỰC         │ BẢY GHẾ            │                    │ ĐẸP MỖI NGÀY       │
│                    │ (phòng giao dịch)  │ (ngay đối diện     │                    │                    │
│                    │                    │  trà sữa)          │                    │                    │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ HẺM 42:            │ DÃY TRỌ BÌNH AN    │ HẺM 7:             │ QUÁN NHẬU          │ nhà ông Thanh      │
│ xe bánh mì,        │ (phòng của bạn)    │ CƠM TẤM CÔ LÀI     │ MỘT HAI BA DÔ      │ (karaoke)          │
│ bến xe ôm,         │ cô Ba Lành         │                    │                    │ nhà dân, nhà       │
│ xe đạp ôm          │                    │                    │                    │ bà Phấn            │
├────────────────────┴────────────────────┴────────────────────┴────────────────────┴────────────────────┤
│ CHỢ TÂM MỸ: rau Dì Chín · cá Cô Mười · thịt Anh Phú · trái cây Chị Huyền · tạp hoá Cô Sáu              │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ĐẦU MỐI SỈ THUẬN PHÁT (bãi xe tải)    │    KHO + VĂN PHÒNG ĐI ĐÂU CŨNG ĐƯỢC (Event)                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  NAM ↓ đường lớn: ra chợ đầu mối (ba gác 40 phút) · bệnh viện tuyến trên (xe ôm 20 phút)
```

Quy ước: đi bộ qua 1 ô mất khoảng **3 phút game**; từ đầu này sang đầu kia khu phố khoảng **15 phút game**.

### 2.3 Danh sách nơi chốn

| Nơi | Loại | Ai làm ở đó | Giờ mở cửa |
|---|---|---|---|
| Dãy trọ Bình An (phòng của bạn) | Nhà trọ | Cô Ba Lành (chủ), anh Kha, chị Trâm | Cổng khóa 23h, có chìa riêng [số thiết kế] |
| Hẻm 42 và hẻm 7 | Nhà dân | Ông Thanh (karaoke), bà Phấn (admin nhóm cư dân), gia đình tụi nhỏ | Luôn |
| Chung cư cũ Lô C | Nhà ở + văn phòng | Người Đúng Chỗ HR (tầng 4, không thang máy) | HR: 8h30-18h |
| Điện lực (phòng giao dịch) | Công | Anh Vĩnh (thợ điện), chị Oanh (giao dịch viên) | 7h30-16h30, nghỉ Chủ nhật [số thiết kế] |
| Công an phường Tâm Mỹ | Công | Anh Thuận (cảnh sát khu vực) | Trực 24h; tuần tra 21h45-22h15 |
| Văn phòng Khu phố 7 (có loa) | Công | Chú Cường (Trưởng khu phố), cô Nga (Mặt trận), chú Lực (bảo vệ dân phố) | 7h-11h; loa đọc 6h và 17h |
| Trường Tiểu học Tâm Mỹ | Trường | Cô Xuân (hiệu trưởng), cô Đào (5A), chú Tình (bảo vệ) | Cổng mở 6h30, tan 16h-17h |
| Trường THCS Tâm Mỹ | Trường | Thầy Đức (hiệu trưởng), cô Hoài (9A), thầy Kiệt (Tin), thầy Nhân (Thể dục) | Như trên, tan lệch giờ 15 phút |
| Trạm y tế phường + nhà thuốc | Y tế | Bác sĩ Lâm, chị Thủy (điều dưỡng), chị Ánh (dược sĩ) | 7h-17h, trực cấp cứu đêm [số thiết kế] |
| Sân chơi + sân bóng mini | Công viên | Thầy Nhân dạy bóng chiều thứ Ba, Năm | 5h-21h |
| Chợ Tâm Mỹ | Chợ | Dì Chín (rau), cô Mười (cá), anh Phú (thịt), chị Huyền (trái cây), cô Sáu (tạp hoá) | 4h30-12h, chiều 15h-18h |
| Đầu mối sỉ Thuận Phát | Bán sỉ | Anh Thịnh | Nhận hàng 0h-5h, bán sỉ 5h-11h |
| Trà Sữa Full Topping | Quán | Chị Nhung (chủ), Tú (ca trưởng), Bông (part-time) | 9h-22h |
| Cà Phê Cóc Bảy Ghế | Quán | Bà Cẩm | 5h30-11h, chiều 15h-19h |
| Cơm Tấm Cô Lài | Quán | Cô Lài, Thông (nướng sườn) | 6h-10h, 17h-1h |
| Xe bánh mì đầu hẻm 42 | Xe đẩy | Cô Bánh Mì | 5h30-9h30, 16h-19h |
| Tiện lợi Luôn Mở 24h | Cửa hàng | Anh Khôi, Như (ca đêm) | 24/24 |
| Photo Thần Tốc | Tiệm | Chú Tấn | 7h-21h |
| Net Không Lag | Điểm cung cấp dịch vụ trò chơi điện tử công cộng | Anh Hào, Pháo | **8h-22h** (luật: không hoạt động 22h-8h) |
| Tiệm tóc Đẹp Mỗi Ngày | Tiệm | Chị Mận, chú Ninh | 8h-20h, nghỉ thứ Hai buổi sáng |
| Quán nhậu Một Hai Ba Dô | Quán | Anh Mạnh, chị Ly, Tèo | 16h-24h |
| Bến xe ôm đầu hẻm 42 | Giao thông | Chú Lương, ông Quế (xe đạp ôm), anh Vũ (xe app) | 5h-23h |
| Xe ba gác của Chú Bảy | Phương tiện | Chú Bảy (Ba & Má) | 5h-18h, đậu trước Ba & Má |
| Cao ốc Tâm Mỹ | Tòa nhà | Anh Định (bảo vệ sảnh) | 6h30-22h, thang máy kẹt giờ 8h và 12h |
| T&M Partners (tầng 12) | Công ty | Chị Tuyết và 16 người | 8h30-18h (thực tế: tới khi chị Tuyết về) |
| Nợ Kỹ Thuật Labs (tầng 7) | Công ty | Anh Quân "Kevin" và 13 người | 9h30-"deploy xong" |
| Cân Đối & Cộng Sự (tầng 3-5) | Công ty | Anh Phong, chị Thảo và 11 người (đại diện cho ~300) | 8h-17h30, mùa kiểm toán tới 3h sáng |
| Ba & Má (nhà phố + xưởng + giàn phơi) | Công ty | Bác Hùng, cô Hằng và 11 người | Xưởng 6h-17h, cửa hàng 8h-21h |
| Đi Đâu Cũng Được (văn phòng + kho) | Công ty | Chị Kiều, anh Duy và 11 người | 8h30-18h, kho mở khi có sự kiện |
| Người Đúng Chỗ HR (Lô C, tầng 4) | Công ty | Anh Duy và 9 người | 8h30-18h |
| Trend Trễ Agency (loft sân thượng) | Công ty | Anh Tùng và 11 người | 10h-"khi khách duyệt" |

### 2.4 Bảy công ty được đặt ở đâu và vì sao

- **Cao ốc Tâm Mỹ** (12 tầng, có thang máy và bảo vệ sảnh): ba công ty "văn phòng kính" ở chung:
  **Cân Đối & Cộng Sự** tầng 3-5 (công ty lớn nhất, ~300 người), **Nợ Kỹ Thuật Labs** tầng 7, **T&M Partners**
  tầng 12 (cao nhất, đúng tính cách). Thang máy là một "nơi" có sự kiện riêng: kẹt lúc 8h và 12h, gặp sếp trong
  thang máy, anh Thạc ngủ quên trong thang máy (drama 18).
- **Ba & Má**: nhà phố mặt đường kiêm xưởng, **giàn phơi ở sân sau nhìn ra cổng trường** (nên tụi nhỏ mới lẻn vào được),
  xe ba gác của Chú Bảy đậu trước cửa.
- **Đi Đâu Cũng Được**: văn phòng nhỏ + **kho** chứa bàn ghế, sân khấu, loa, ở dãy sau gần đầu mối (xe tải vào được).
- **Người Đúng Chỗ HR**: căn hộ tầng 4 **chung cư cũ Lô C**, không thang máy, ứng viên leo bộ (đúng chất).
- **Trend Trễ Agency**: **loft sân thượng** của một nhà phố 5 tầng đối diện cao ốc, có đèn dây, bàn gỗ pallet.

### 2.5 Ngoài bản đồ (đi bằng xe, hoặc chỉ gọi điện)

- Chợ đầu mối Bình Điền (Anh Thịnh lên lúc nửa đêm; người chơi đi theo được khi làm ở đầu mối).
- Bệnh viện tuyến trên (trạm y tế chuyển khi nặng; đi xe ôm 20 phút; tự đi khám không chuyển tuyến ở cấp chuyên sâu
  thì BHYT trả ít hơn).
- Bình Dương cũ (Hưng, con Cô Bánh Mì), Sa Đéc (bà Thắm).

---

## 3. Một ngày của người chơi

### 3.1 Thời gian

- Ngày trong game bắt đầu **5h30** (bạn tự chọn giờ dậy) và kết thúc khi bạn **đi ngủ** (muộn nhất 2h sáng thì
  tự ngủ gục).
- Ngoài phố: **1 phút game = 1 giây thật** (giống Solo). Đi bộ hết khu phố mất khoảng 15 giây thật.
- **Một ca làm = một mini-game 4-6 phút thật** đại diện cho 4 giờ game; xong ca thì đồng hồ nhảy. Một ngày có
  1-2 ca + đi chợ + ăn + gặp người: khoảng **15-25 phút thật**.
- Lịch: tháng 30 ngày, tuần 7 ngày, năm 12 tháng âm dương đầy đủ. Ngày trôi khi bạn ngủ (xem câu hỏi Q1 ở mục 11).

### 3.2 Chỉ số

| Chỉ số | Thang | Giảm vì | Tăng nhờ | Khi thấp |
|---|---|---|---|---|
| **Đói** | 0-100 (100 = no) | ~0,07/phút game (như Solo), làm ca, đi bộ trời nắng | Ăn (bảng 3.3) | Dưới 35: đi chậm 28%, mini-game ngắn hơn 25%. Dưới 8: xỉu nhẹ |
| **Năng lượng** | 0-100 | Mỗi ca −20 đến −35, thức khuya | Ngủ (+60 đến +100), cà phê (+15, ly thứ ba phản tác dụng), nghỉ ở sân chơi | Dưới 20: sai nhiều hơn trong ca; 0: xỉu, vào trạm y tế |
| **Tâm trạng** | 0-100 | Drama dính tới mình, karaoke hàng xóm lúc ngủ, mưa ngập, bị khách chê | Cắt tóc mới, nhậu với đồng nghiệp, giúp hàng xóm, trúng combo, tin nhắn khen | Thấp: khách ít tip; cao: tốc độ ca +10% |
| **Tiền** | đồng | Ăn, đi lại, tiền trọ, điện nước, nhập hàng | Lương ca, tip, lời quán | Âm: chủ trọ cho nợ 1 tháng |
| **Uy tín khu phố** | 0-100 | Nói dối, bán điêu, làm ồn | Giúp đỡ, góp Ngày hội 18/11, làm ăn tử tế | Mở khóa vai trò công (cộng tác viên khu phố, Trưởng khu phố) |
| **Độ thân** (mỗi người) | 0-5 tim | Từ chối nhờ vả nhiều lần, làm họ mất mặt | Trò chuyện, quà, giúp, làm chung ca | Mở chuyện riêng, giá quen, đi nhờ ba gác, drama |

### 3.3 Ăn gì, bao nhiêu tiền

| Món | Ở đâu | Giá | Đói + | Thời gian |
|---|---|---|---|---|
| Bánh mì thịt | Xe bánh mì đầu hẻm 42 | 25.000-30.000đ (giá 10/2026) | +30 | 5 phút |
| Cơm tấm sườn chả | Cơm Tấm Cô Lài | 35.000đ (thêm trứng 45.000đ) | +55 | 20 phút |
| Cà phê sữa | Cà Phê Cóc Bảy Ghế | 15.000đ [số thiết kế, năm 2024 là 14.000đ] | +5, năng lượng +15 | 10 phút |
| Trà sữa | Full Topping | 25.000-35.000đ | +15, tâm trạng +5 | 5 phút |
| Mì ly + nước | Tiện lợi Luôn Mở | 12.000đ + 10.000đ [số thiết kế] | +25 | 10 phút |
| Tự nấu | Mua ở chợ, nấu ở phòng | ~25.000đ/bữa [số thiết kế] | +45 | 40 phút |
| Nhậu | Quán Một Hai Ba Dô | 150.000-250.000đ/người [số thiết kế] | +40, tâm trạng +15, năng lượng −10 | 2 giờ |
| Cơm chung Chủ nhật | Văn phòng khu phố | Miễn phí (khi hết tiền) | +50 | 1 giờ |

Combo khu phố ví dụ: "Bánh mì + cà phê cóc trước 7h" giảm 5.000đ; "cơm tấm + trà đá" miễn phí trà đá.

### 3.4 Đi lại

| Cách đi | Giá | Thời gian (từ trọ tới cao ốc) | Ghi chú |
|---|---|---|---|
| Đi bộ | 0đ | ~12 phút game | Trời nắng trưa: Đói giảm nhanh gấp 1,5; mưa ngập: chậm gấp đôi |
| Xe ôm truyền thống (chú Lương) | 15.000đ/cuốc trong khu phố [số thiết kế] | ~3 phút + chờ 1 phút | Nghe một tin đồn miễn phí; có giá quen khi thân 3 tim |
| Xe ôm công nghệ (app Xe Tới, anh Vũ) | 13.000đ [số thiết kế; giá cũ 12.000đ cho 2 km đầu]; mưa x1,5 | ~3 phút + chờ 2-5 phút | Giờ mưa hay bị hủy chuyến |
| Xe đạp ôm (ông Quế) | 10.000đ [số thiết kế] | ~7 phút | Nghề hiếm, gần như không còn ngoài đời; chậm nhưng ông kể chuyện xưa (mở khóa Biên bản khu phố cũ) |
| Đi nhờ xe ba gác Chú Bảy | Miễn phí khi thân Chú Bảy 2 tim | Theo lộ trình giao hàng của chú | Ngồi giữa thùng khô gà; vui; tâm trạng +5 |
| Thuê ba gác chuyển trọ | 350.000đ/chuyến [số thiết kế] | Nửa ngày | Dùng khi đổi phòng, dọn đồ |

Lái xe sau khi nhậu: luật nồng độ cồn thật (xe máy mức 1 phạt 2-3 triệu, trừ 4 điểm; xe đạp 100.000-200.000đ).
Quán nhậu luôn gợi ý gọi xe ôm (Owner yêu cầu 13).

### 3.5 Ngày và đêm

| Khung giờ | Khu phố làm gì |
|---|---|
| 4h-6h | Đầu mối giao hàng, chợ bày sạp, Thông nhóm than nướng sườn, Chú Bảy chất hàng lên ba gác |
| 6h-7h30 | Loa khu phố đọc tin 6h; cổng trường mở 6h30, kẹt xe phụ huynh; bánh mì, cà phê cóc đông nhất |
| 8h-11h | Văn phòng vào làm, thang máy kẹt; quán net mở 8h; chợ đông |
| 11h30-13h30 | Giờ ăn trưa: cơm tấm, trà sữa giao lên cao ốc |
| 13h30-16h | Yên ắng; tiệm tóc buôn chuyện; học sinh trong lớp (quán net phải từ chối học sinh) |
| 16h-17h30 | **Sóng tan trường**: trà sữa, tiện lợi, xe bánh mì đông 15-30 phút; công an nhắc vỉa hè |
| 17h30-22h30 | Giờ cao điểm điện (đắt gần gấp 3 giờ thấp điểm); quán nhậu, cơm tấm tối, trà sữa tối; loa 17h |
| 21h45-22h | Quán net nhắc khách; 22h đóng cửa theo luật |
| 22h-2h | Quán nhậu tan, xe ôm cuốc đêm; tiện lợi ca đêm; cơm tấm đêm; karaoke nhà ông Thanh |

### 3.6 Hóa đơn tuần và tháng

| Khoản | Bao nhiêu | Hạn | Ghi chú |
|---|---|---|---|
| Tiền phòng | **3.200.000đ/tháng** (phòng 16 m²; mức 15-20 m² là 3-4 triệu, 2/2026) | Ngày 5 hằng tháng | Cọc 1 tháng khi vào [thông lệ, chưa có nguồn]; phòng có gác 4.500.000đ |
| Tiền điện | Cô Ba Lành thu **4.000đ/số**; dùng ~90 số/tháng = 360.000đ | Ngày 5 | Từ 25/05/2026 thu cao hơn giá quy định bị phạt 20-30 triệu (Nghị định 133/2026). Đăng ký tạm trú ở nhà trọ đạt chuẩn thì tính giá hộ: 90 số x 1.901đ (bậc 1, giá từ 01/11/2026) + VAT 8% = ~185.000đ. Mồi drama 23 |
| Nước | 100.000đ/người/tháng [ví dụ có thật, số thiết kế] | Ngày 5 | |
| Điện thoại + mạng | 120.000đ/tháng [số thiết kế] | Ngày 15 | Wifi trọ "gộp mềm" vào tiền điện, như ngoài đời |
| BHYT | Có hợp đồng từ 1 tháng: nơi làm đóng. Tự mua hộ gia đình: 1.366.200đ/năm (người thứ nhất, từ 01/07/2026) | Tùy | Khám ở trạm y tế 36.500đ/lượt; dưới 379.500đ một lần khám thì BHYT trả 100% |
| Tạm trú | Miễn phí, làm trên VNeID | Trước ngày 30 ở trọ | Không đăng ký: cảnh cáo hoặc phạt; chủ trọ không khai báo người thuê quá 30 ngày phạt 750.000đ (Nghị định 282/2025) |

Mỗi tối thứ Bảy: màn hình "Tuần này" tóm tắt thu chi (như phiếu lương của Solo, nhưng gọn).

### 3.7 Đi ngủ: màn hình "Tối nay ở phòng trọ"

1. Tiền hôm nay: vào, ra, còn lại.
2. Kỹ năng tăng (ví dụ "Pha chế 3 → 4: dập nắp nhanh hơn 0,3 giây").
3. Một chuyện khu phố hôm nay (lấy từ nhóm cư dân).
4. Một tin cho ngày mai (cúp điện, mưa, ngày lương, sinh nhật ai đó).
5. Hồ sơ cá nhân: "+1 ngày ở Trà Sữa Full Topping (tổng 12 ngày)".
6. Lưu game (tự động lên đám mây nếu đã đăng nhập).

Ngủ hồi năng lượng: ngủ đủ 7 tiếng = 100; ít hơn thì tỷ lệ thuận. Karaoke nhà ông Thanh làm mất 10 điểm nếu chưa
giải quyết drama 16.

### 3.8 Điện thoại trong game

- **Xóm Ơi** (app nhóm chat cư dân, tên tự đặt): nhóm "Cư dân KP7 Tâm Mỹ" do bà Phấn quản trị, nhóm phụ huynh
  từng lớp, nhóm nhân viên mỗi quán. Mỗi ngày 3-8 tin; tối không làm phiền trừ khi có drama. Tin xấu lan nhanh.
- **Danh bạ**: ai đã quen, độ thân, sinh nhật, món thích.
- **Ví**: số dư, lịch sử, hóa đơn sắp tới.
- **Hồ sơ cá nhân**: xem mục 5.
- **Sổ tay**: như Solo (suy nghĩ, bài học, nhật ký) cộng các bộ sưu tập.

---

## 4. Việc làm

### 4.1 Luật chung cho mọi chỗ làm

- **Xin việc**: tới tận nơi, nói chuyện với chủ (hoặc qua HR). Chủ đọc **hồ sơ cá nhân** (mục 5) rồi nhận vào ở một
  bậc phù hợp. Không có bài kiểm tra khó ở bậc đầu.
- **Ca làm**: mỗi nơi có 1-3 ca/ngày (sáng, chiều, tối, đêm). Một ngày làm tối đa 2 ca; ca thứ ba chỉ được khi năng
  lượng trên 60 và không được tính thêm kinh nghiệm (tránh cày).
- **Lương giờ không dưới lương tối thiểu vùng I 2026: 25.500đ/giờ** (Nghị định 293/2025). Tin tuyển ngoài đời có
  chỗ ghi 22.000-23.000đ/giờ; trong game nếu chủ trả thấp hơn, người chơi có lựa chọn nhắc luật (chủ sẽ sửa, hơi
  quê). Giờ làm trong khung 22h-6h được cộng 30% phụ cấp đêm (chỉ cho phần giờ nằm trong khung).
- **Đánh giá ca**: A/B/C/D như đánh giá tuần của Solo, từ độ chính xác, tốc độ, khách hài lòng, sự cố.
- **Thăng cấp**: mỗi nơi có điều kiện rõ (số ngày làm, điểm đánh giá trung bình, kỹ năng, đôi khi giấy tờ thật như
  giấy khám sức khỏe, xác nhận kiến thức an toàn thực phẩm). Điều kiện hiện sẵn trên hồ sơ, không giấu.
- **Nghỉ việc**: lúc nào cũng được. Chọn lý do (chuyển chỗ, học thêm, nghỉ ngơi, mở quán riêng…). Ghi vào hồ sơ.
  Quay lại chỗ cũ được, giữ bậc cũ nếu nghỉ chưa quá 60 ngày game.
- **Làm nhiều chỗ một lúc**: được (sáng bánh mì, tối trà sữa). Hồ sơ đếm riêng từng nơi.
- **Giao ca cho đồng nghiệp** (từ bậc 3): ca tự chạy, nhận 70% công, không tăng kỹ năng. Chống cày.

### 4.2 Trà Sữa Full Topping (đặc tả đầy đủ, làm đầu tiên)

#### a. Quán và người

- Chủ: **chị Nhung** (36). Ca trưởng: **Tú** (24, thuộc 41 công thức). Part-time: **Bông** (19, dập nắp nhanh nhất).
- Mặt bằng 12 triệu/tháng (khu ngoài trung tâm 8-20 triệu, gần trường và văn phòng 15-50 triệu; chủ nhà đòi cọc 3-6
  tháng). Đối diện là Cà Phê Cóc Bảy Ghế của bà Cẩm, mẹ chồng chị Nhung (drama 1).
- Khách chính: dân văn phòng cao ốc (trưa), học sinh (16h-17h30), cư dân (tối), đơn app (mưa).

#### b. Một ca trà sữa (mini-game 4-6 phút thật = 4 giờ game)

**Mở ca (30 giây thật, checklist kéo-thả):**
1. Nấu mẻ trân châu đầu (bắt đầu đồng hồ tươi 0h; ngon nhất 4-8 giờ, quá 8 giờ thì "cứng").
2. Ủ trà vào bình ủ (trà đen, ô long, trà lài).
3. Pha sữa nền (bột béo + nước nóng).
4. Cắt trái cây, kiểm topping, đếm tiền đầu ca.

**Mỗi ly (vòng lặp chính):**
1. **Nhận phiếu**: phiếu hiện trên thanh trên cùng, có thanh kiên nhẫn. Quầy (khách đứng chờ) hoặc app (tài xế chờ).
2. **Lấy cốc** đúng size (M hoặc L) ở kệ cốc.
3. **Topping**: múc topping vào đáy ly (trân châu đen, trân châu trắng, thạch, pudding, kem cheese, xoài sấy Ba & Má).
4. **Trà**: rót trà nền từ bình ủ đúng loại.
5. **Sữa/bột**: bơm sữa nền.
6. **Đường %**: bấm bơm siro 0 / 30 / 50 / 70 / 100% (mỗi nấc là một lần bơm, như cơ chế `scale` của Solo: dừng
   đúng vạch).
7. **Đá %**: múc đá 0 / 50 / 100%.
8. **Lắc**: giữ nút, khuấy trong vùng xanh (cơ chế `stir` của Solo).
9. **Dập nắp**: bấm đúng lúc màng ép xuống (lệch là nắp nhăn, ly bị đổ khi giao).
10. **Dán tem** tên khách hoặc mã đơn.
11. **Giao**: đưa khách ở quầy hoặc bỏ túi cho tài xế, trước khi thanh kiên nhẫn hết.

**Trong ca**: nấu mẻ trân châu mới theo lịch (thanh nhắc), rửa bình lắc, lau quầy, nhận hàng giao tới (đếm, ký).

**Đóng ca (30 giây thật):** đổ trân châu và trà quá giờ (tính vào hao hụt), vệ sinh máy dập nắp, kiểm kê, chốt tiền.

**Độ khó tăng dần theo bậc:**

| Bậc | Phiếu có gì | Việc thêm |
|---|---|---|
| Học việc (3 ca đầu) | Size + 1 topping, đường/đá mặc định | Tú làm mẫu ly đầu |
| Nhân viên | Đủ size, đường %, đá %, 1-2 topping | Ghi chú lạ: "ít ngọt nhưng ngọt", "không đá nhưng lạnh" |
| Nhân viên chính | Thêm đơn app, ly đôi, combo | Nấu trân châu đúng lịch |
| Ca trưởng | Như trên + điều phối 1 nhân viên NPC | Nhập hàng, xử lý khiếu nại, chốt ca |
| Quản lý | Như trên | Xếp lịch, chọn kênh truyền thông, đọc lời lỗ, đặt giá |

#### c. Thực đơn và công thức (giai đoạn 1: 8 món)

| Món | Trà nền | Sữa | Topping mặc định | Giá M / L |
|---|---|---|---|---|
| Trà sữa truyền thống | Trà đen | Có | Trân châu đen | 25.000 / 30.000đ |
| Trà sữa ô long | Ô long | Có | Trân châu trắng | 30.000 / 35.000đ |
| Trà sữa đường đen | Trà đen | Có (sữa tươi) | Trân châu đường đen | 32.000 / 37.000đ |
| Trà lài kem cheese | Trà lài | Không | Kem cheese | 30.000 / 35.000đ |
| Trà xoài Sa Đéc | Trà lài | Không | Xoài sấy Ba & Má | 30.000 / 35.000đ |
| Trà đào thạch | Trà đen | Không | Thạch | 28.000 / 33.000đ |
| Sữa tươi trân châu | Không | Sữa tươi | Trân châu đường đen | 30.000 / 35.000đ |
| "Full Topping" (món nhà) | Trà đen | Có | Tất cả, 1 muỗng mỗi loại | 45.000đ (chỉ L) |

Giá nằm trong khoảng 30.000-60.000đ/cốc phân khúc phổ thông. Món mùa: "trà sữa vị bánh nướng" dịp Trung thu,
"trà tắc mật ong" mùa nắng nóng, "trà sữa tri ân" tuần 20/11.

#### d. Khách, kiên nhẫn và giờ cao điểm

Ngoài đời chưa có số liệu "bao nhiêu ly giờ cao điểm" (research ghi rõ), nên các số dưới là **[số thiết kế]**:

| Khung giờ | Tỷ lệ khách trong ngày | Ai tới | Kiên nhẫn |
|---|---|---|---|
| 9h-11h30 | 10% | Cư dân, phụ huynh | Cao |
| 11h30-13h30 | 22% | Văn phòng cao ốc (đơn nhiều ly, giao lên tầng) | Thấp (giờ nghỉ trưa ngắn) |
| 13h30-16h | 10% | Người làm tự do, khách tiệm tóc | Cao |
| 16h-17h30 | 23% | **Sóng tan trường** (15-30 phút dồn dập) | Trung bình, đông |
| 17h30-19h | 10% | Người đi làm về | Trung bình |
| 19h-22h | 25% | Cư dân, hẹn hò, học nhóm | Cao |

Hệ số theo ngày: nắng nóng +25%; mưa: tại quầy −40%, app +60%; ngày 1-5 sau lương (7 công ty trả lương ngày 30)
+15%; tuần thi vào 10 thêm khách "góc học nhóm" tới 21h; tuần Tết −50%; đối thủ giảm giá −15%.

#### e. Chất lượng một ly và đánh giá

Mỗi ly chấm 6 điểm: đúng size, đúng trà, đúng topping, đúng % đường (lệch 1 nấc trừ nửa điểm), đúng % đá, nắp kín.
Cộng/trừ: chờ lâu (trừ), trân châu quá 8 giờ (trừ mạnh, khách nói "nhai như bi"), ly đẹp (cộng tip).

- **Điểm ca** = trung bình điểm ly x hệ số tốc độ → A (≥ 90%), B (≥ 75%), C (≥ 60%), D.
- **Sao trên app bản đồ "Chấm Đỏ"** (tên tự đặt) của quán = trung bình trượt 30 ngày của độ hài lòng khách + sự kiện
  review. 48% người tiêu dùng đọc đánh giá trước khi mua, nên sao quán nhân trực tiếp vào lượng khách mới (từ x0,7
  ở 3 sao tới x1,3 ở 4,8 sao).
- Sự cố có thật: bão 1 sao, clip chê để viral (có khi làm quán đông hơn), khách "tống tiền" bằng 1 sao, đoàn kiểm tra
  an toàn thực phẩm (thiếu giấy khám sức khỏe của người chế biến thì bị phạt và nghỉ bán).

#### f. Kho và định lượng

Công thức tham khảo 1 ly truyền thống: **15 g trà đen, 20 g đường nâu, 60 g bột béo**. Mỗi ly trừ kho đúng như vậy.

| Nguyên liệu | Một ly dùng | Giá nhập | Tiền / ly | Hạn dùng sau khi mở / nấu |
|---|---|---|---|---|
| Bột béo | 60 g | 68.000-80.000đ/kg | ~4.400đ | 3 tháng (khô) |
| Trà đen | 15 g | ~150.000đ/kg [số thiết kế; ô long 200.000-500.000đ/kg] | ~2.250đ | Trà đã ủ: 8 giờ |
| Đường nâu / siro | 20 g | ~30.000đ/kg [số thiết kế] | ~600đ | Lâu |
| Trân châu | 50 g chín (~25 g khô) | ~45.000đ/kg khô [số thiết kế] | ~1.100đ | **4-8 giờ** sau khi nấu |
| Ly + nắp màng + ống hút | 1 bộ | ~1.500đ/bộ [số thiết kế] | 1.500đ | Lâu |
| Đá, tem, túi | | [số thiết kế] | ~600đ | Đá tan nếu cúp điện |
| **Cộng** | | | **~10.500đ/ly** | |

Thiết bị (khi mở quán riêng): bình ủ trà 12 lít ~1 triệu/bình (cần 2-3 bình), máy làm lạnh ~20 triệu, máy dập nắp,
máy lắc. Phần mềm bán hàng 170.000-249.000đ/tháng.

#### g. Nhập hàng: chọn nhà cung cấp

Từ bậc nhân viên chính trở lên, người chơi được nhờ đi nhập hàng; từ ca trưởng thì tự quyết.

| Nhà cung cấp | Có gì | Giá | Chất lượng | Giao hàng | Hạn dùng | Điều kiện / rủi ro |
|---|---|---|---|---|---|---|
| **Chợ Tâm Mỹ** (chị Huyền trái cây, cô Sáu tạp hoá) | Trái cây, sữa tươi, đường, đá | Lẻ, cao hơn sỉ ~10-15% [số thiết kế] | Tươi, thấy tận mắt | Tự đi, 20-30 phút game, mang được ít | Trái cây 2 ngày | Trả giá được; mưa thì rau trái tăng 20-25% |
| **Đầu mối sỉ Thuận Phát** (anh Thịnh) | Bột béo, trà, trân châu khô, ly, nắp, ống hút, đá | Sỉ (bột béo 68.000đ/kg) | Ổn định | Đặt trước 22h, **giao 6h sáng hôm sau** bằng ba gác Chú Bảy | Theo hàng | Đơn tối thiểu 1 triệu [số thiết kế]; thân 3 tim thì gối đầu 7 ngày |
| **Ba & Má** (cô Hằng, Chú Bảy giao) | Xoài sấy, mứt (topping), khô gà (món ăn kèm) | Cao hơn chợ ~10% [số thiết kế] | Đều, có "câu chuyện" để quảng cáo | **Trong buổi chiều** cùng ngày | Xoài sấy 30 ngày | Mua đều thì được "Trà xoài Sa Đéc" độc quyền; dính drama 15 |
| **App sỉ "Kho Sỉ Ngay"** (tên tự đặt) | Bột, trà, ly | Rẻ nhất (−5% so với đầu mối) [số thiết kế] | Có lúc giao sai | 1-2 ngày, mưa thì trễ | Theo hàng | Không gối đầu; 10% đơn bị thiếu món [số thiết kế] |
| **Tiện lợi Luôn Mở** (khẩn cấp) | Sữa đặc, sữa tươi, đá, ly nhựa | Đắt (+30%) [số thiết kế] | Ổn | Ngay, 24/24 | Theo hàng | Cứu cháy khi hết hàng giữa ca |

Hết một nguyên liệu: món dùng nó tự xám trên thực đơn. Tồn quá nhiều: hao hụt (trân châu đổ bỏ, trái cây hư).
Ngày cúp điện (báo trước 5 ngày): phải trữ đá từ tối hôm trước, không thì món đá xám từ 10h.

#### h. Truyền thông: chọn kênh

Từ bậc quản lý (hoặc khi chị Nhung nhờ) người chơi chọn tối đa 3 kênh chạy cùng lúc. Chi marketing gợi ý 5-10% chi
phí vận hành.

| Kênh | Làm sao | Chi phí trong game | Hiệu ứng | Rủi ro |
|---|---|---|---|---|
| **Tờ rơi** | In ở Photo Thần Tốc (chú Tấn), phát quanh 2 hẻm | ~500đ/tờ x 500 tờ [số thiết kế] + 1 ca phát | +khách cư dân trong 1-2 hẻm, 3 ngày | Rác vỉa hè; drama 21 (lá thư in nhầm mặt sau) |
| **Nhóm cư dân Xóm Ơi** | Đăng tin, xin bà Phấn ghim | Thời gian (và độ thân với bà Phấn) | +khách quen, đặt trước | Một tin xấu lan nhanh hơn tin tốt |
| **Fanpage** | Thuê Sương (Trend Trễ) chạy | 1,5 triệu/tháng [số thiết kế] | +khách mới đều đặn, nhỏ | Trả lời bình luận chậm thì bị chê |
| **Video ngắn trên app "Lướt Lướt"** | Thuê Trend Trễ (anh Phát quay, anh Lộc chạy quảng cáo) | 3-5 triệu/clip [số thiết kế; giá thật không có nguồn] | Viral ngắn hạn: +40% trong 5 ngày rồi giảm | "CPM đang cao"; clip chê để viral |
| **KOC Út Mi** (Ba & Má) | Mời uống, trả phí hoặc đổi quảng cáo khô gà | 1 triệu + đồ uống [số thiết kế] | Đỉnh lớn nhất nhưng phụ thuộc chất lượng thật | Mi review thật lòng; ly dở thì clip dở; drama 14, 24 |
| **App giao đồ ăn** ("Đói Rồi" và "Giao Liền", tên tự đặt; ngoài đời 2 app chiếm mỗi bên 48%) | Bật bán trên app | **Chiết khấu 20-30%/đơn + VAT 10% trên phần chiết khấu**, góp voucher | +đơn mưa, +khách xa | Lời mỏng; giá app cao hơn tại quán 25-35%; bom đơn |
| **Khai trương mua 1 tặng 1** | Chỉ khi mở quán/chi nhánh | Lỗ 1-3 ngày | Hàng dài, nhận diện | Quá tải, phải đóng cửa sớm, bão 1 sao vì chờ lâu; nên giới hạn 50 khách đầu |
| **Thẻ tích điểm** | In ở photo | Giảm giá dài hạn (ly thứ 10 miễn phí) | Giữ khách quen | Chưa có dữ kiện thật, số thiết kế |

Công thức đơn app: **thực nhận = giá app − chiết khấu − 10% x chiết khấu − voucher góp**. Ví dụ ngoài đời: đơn
85.000đ, quán trả phí nền tảng 17.176đ + voucher 15.000đ, còn ~52.824đ.

#### i. Lời lỗ mỗi ngày (bảng P&L)

Từ bậc ca trưởng, cuối mỗi ngày làm hiện bảng sau (ví dụ một ngày thường của Full Topping, **[số thiết kế]** về số ly):

| Dòng | Cách tính | Tiền |
|---|---|---|
| Bán tại quầy | 120 ly x 30.000đ | 3.600.000đ |
| Bán qua app (giá app) | 40 ly x 38.000đ | 1.520.000đ |
| Trừ chiết khấu app 25% | | −380.000đ |
| Trừ VAT 10% trên chiết khấu | | −38.000đ |
| Trừ voucher quán góp | 15 đơn x 5.000đ | −75.000đ |
| **Thực nhận** | | **4.627.000đ** |
| Nguyên liệu | 160 ly x ~10.500đ | −1.680.000đ |
| Hao hụt | trân châu quá giờ, ly hỏng | −60.000đ |
| Lương | 20 giờ công x 27.000đ + phụ cấp ca trưởng 50.000đ | −590.000đ |
| Điện (giá kinh doanh từ 01/11/2026) | 20 kWh x 3.089đ + 14 kWh giờ cao điểm x 5.313đ + 2 kWh thấp điểm x 1.880đ, + VAT 8% | −151.000đ |
| Nước (giá kinh doanh) | 0,5 m³ x 21.300đ + 30% phí thoát nước + VAT | −14.500đ |
| Mặt bằng | 12.000.000đ / 30 | −400.000đ |
| Gas | bình trên 500.000đ, dùng ~10 ngày | −50.000đ |
| Phần mềm bán hàng | ~200.000đ / 30 | −7.000đ |
| Truyền thông | | −120.000đ |
| Thuế hộ kinh doanh | 4,5% x 5.120.000đ (vì cả năm vượt 1 tỷ, xem j) | −230.400đ |
| **Lời trong ngày** | | **~1.324.100đ** |

Ghi chú cho người chơi (hiện dưới bảng): giờ cao điểm điện 17h30-22h30 (thứ Hai đến thứ Bảy) đắt gần gấp 3 giờ thấp
điểm 0h-6h, nên nấu trân châu sớm là tiết kiệm. Chủ nhượng quyền ngoài đời lời ~30 triệu/tháng và gần 3 năm mới hòa
vốn; khu đông dân có 4-6 cửa hàng cùng chuỗi trên 1 km², nên quán mới mở sẽ thấy cạnh tranh.

#### j. Thuế hộ kinh doanh (luật 2026, đã đổi lớn)

- **Thuế khoán đã bỏ từ 01/01/2026**, bỏ lệ phí môn bài; mọi hộ **tự kê khai, tự nộp**.
- **Doanh thu cả năm ≤ 1 tỷ đồng** (cộng mọi kênh): không nộp thuế GTGT, TNCN; vẫn phải giữ sổ doanh thu (mẫu S1a-HKD)
  và **thông báo doanh thu thực tế chậm nhất 31/01 năm sau**. Trong game: nhắc trên lịch, anh Sang (Cân Đối) làm hộ.
- **Doanh thu > 1 tỷ**: bắt buộc hóa đơn điện tử có mã hoặc máy tính tiền kết nối cơ quan thuế; đăng ký trong 30 ngày
  sau kỳ vượt ngưỡng; dịch vụ ăn uống nộp **3% GTGT + 1,5% TNCN** trên doanh thu.
- Từ 01/03/2026, tài khoản nhận tiền kinh doanh phải đứng tên hộ kinh doanh.
- Game theo dõi doanh thu cộng dồn theo năm dương lịch của mỗi quán người chơi quản lý hoặc làm chủ. Vượt 1 tỷ bật sự
  kiện "Vượt 1 tỷ" (mục 6.6 dòng 27).

#### k. Lương và nấc thang

| Bậc | Lương | Điều kiện lên bậc | Mở khóa |
|---|---|---|---|
| 1. Học việc | 25.500đ/giờ | 3 ca | Pha 4 món cơ bản |
| 2. Nhân viên | 26.000đ/giờ; ca tối, cuối tuần 30.000đ | 8 ngày làm, điểm ca trung bình ≥ C | Đủ thực đơn, tip |
| 3. Nhân viên chính | 28.000đ/giờ | 20 ngày làm, trung bình ≥ B, **giấy khám sức khỏe** (trạm y tế, 160.000đ, BHYT không trả) | Đi nhập hàng; "giao ca" |
| 4. Ca trưởng | 32.000đ/giờ + 1% doanh thu ca [số thiết kế; ngoài đời tổ trưởng ca 8-14 triệu/tháng] | 40 ngày làm, 2 tuần liền trung bình ≥ B, **xác nhận kiến thức an toàn thực phẩm** (lớp ở trạm y tế), đào tạo Bông 1 ca | Nhập hàng, chốt ca, xem P&L |
| 5. Quản lý cửa hàng | 12 triệu/tháng (ngoài đời 10-15 triệu) | 60 ngày làm, giữ chi phí nguyên liệu ≤ 35% doanh thu 2 tuần liền, 4,3 sao trở lên | Kênh truyền thông, giá, lịch nhân viên |
| 6a. Mở quán riêng | Lời của quán | Vốn: tự xây thương hiệu 150-170 triệu, hoặc **nhận lại cả bộ cửa hàng ~80 triệu** (có tin rao thật) | Thực đơn riêng, tên quán riêng, quán tự chạy khi bạn đi làm chỗ khác |
| 6b. Góp vốn chi nhánh 2 với chị Nhung | Chia lời 40% | Thân chị Nhung 4 tim | Drama 2 (khai trương chi nhánh) |

#### l. Sự kiện hay gặp ở quán trà sữa

Giá bột béo tăng (tăng 3.000đ/ly hay bớt topping); cúp điện theo lịch (trữ đá); sóng tan trường + công an nhắc vỉa
hè; bom đơn 1,2 triệu (tài xế chịu thiệt, app bồi hoàn tối đa 1 triệu, quán có mua lại một phần không); bão 1 sao;
KOC tới bất ngờ; khách "100% đường" mỗi ngày (Khang của T&M); mẹ chồng mở quán đối diện (drama 1); người yêu cũ gửi
hoa (drama 2); mùa thi vào 10 mở góc học nhóm tới 21h (mở quá khuya thì phụ huynh phản đối trong nhóm Xóm Ơi).

### 4.3 Các chỗ làm khác

Mỗi chỗ dùng chung "shop engine" (mục 4.5), chỉ khác trạm, công thức và sự kiện.

#### Cơm Tấm Cô Lài
- **Ca**: ca sáng 5h-10h, ca tối 17h-1h. Chiều hôm trước ướp sườn, làm chả trứng, bì; sáng nhóm than, nướng sườn
  (giữ lửa trong vùng xanh, quá tay thì khét), pha nước mắm (công thức bí mật, cơ chế `stir`), đồ chua, mỡ hành.
  Mỗi đĩa: xới cơm → sườn/bì/chả/trứng theo phiếu → mỡ hành, đồ chua, dưa leo → chén nước mắm → canh. Mang đi: hộp
  + túi nước mắm.
- **Giá**: cơm sườn chả 35.000đ tại quán, 46.000đ trên app. Có chủ quán bỏ app vì phần tăng 11.000đ quán chỉ nhận
  3.500đ (đưa thành lựa chọn).
- **Lương**: 26.000đ/giờ, có cơm; sau 22h cộng 30%.
- **Nấc thang**: phụ rửa → đứng bếp (nướng sườn) → bếp chính (được biết công thức nước mắm) → mở xe cơm tấm đêm hoặc
  quán riêng (vốn ít nhất ~200 triệu).
- **Sự kiện**: heo về chợ đầu mối giảm một nửa (sườn đắt, tăng 5.000đ/đĩa hay bớt sườn); kiểm tra an toàn thực phẩm
  trước Tết; tech:hoa đặt 20 phần trưa cho cả công ty; drama 8, 19, 26.

#### Xe bánh mì đầu hẻm 42 (Cô Bánh Mì)
- **Ca**: 5h-9h30 (rạng sáng lấy bánh từ lò, chuẩn bị pate, chả lụa, đồ chua) và 16h-19h. Mỗi ổ: rạch bánh →
  nướng lại → bơ/pate → thịt → đồ chua, dưa leo, ngò, ớt → nước tương → gói giấy. Nhịp nhanh nhất game.
- **Giá**: 25.000-30.000đ/ổ (trước đây ~20.000đ). Cô Bánh Mì chọn **giảm nhân thay vì tăng giá** khi giá thịt lên
  (người chơi được hỏi ý).
- **Lương**: 26.000đ/giờ + bánh mì ăn sáng.
- **Nấc thang**: phụ xe → đứng xe → "cô giao xe cho con" (khi thân 5 tim, Hưng không về) → mở thêm điểm trong hẻm
  (không được bày vỉa hè: TP.HCM ngưng cấp phép mới; phạt bày bán 200.000-250.000đ).
- **Sự kiện**: ra quân vỉa hè (lùi vào, mất 30% khách vãng lai); cổng trường giờ cao điểm 6h30-7h30 không được bán trước
  cổng; Hưng gọi về Chủ nhật; số điện thoại của cô nằm nhầm trong hệ thống tuyển dụng của HR (cười).

#### Cà Phê Cóc Bảy Ghế (bà Cẩm)
- **Ca**: 5h30-10h. Pha phin/ủ cốt mẻ lớn, đập đá, sữa đặc, trà đá miễn phí. Mỗi ly: rót cốt → sữa đặc → khuấy → đá
  → nắp → túi.
- **Giá**: cà phê sữa 15.000đ [số thiết kế]. Giá cà phê nhân lập kỷ lục 2024 (122.000-124.000đ/kg) rồi về ~89.000đ/kg
  cuối 10/2026: bà Cẩm giữ giá lấy lãi hay giảm giá để đánh trà sữa (drama 1).
- **Lương**: 26.000đ/giờ.
- **Nấc thang**: pha chế → quản lý ca → nhận nhượng quán khi bà Cẩm "nghỉ hưu lần thứ 4".

#### Tiện lợi Luôn Mở 24h (anh Khôi)
- **Ca**: sáng, chiều, đêm. Quét mã tính tiền (mini-game tốc độ), hâm đồ ăn nóng, nhận hàng theo chuyến, xếp hàng
  **FIFO**, rút hàng cận date, lau dọn, kiểm kê cuối ca, xử lý khách ca đêm (người say, người hỏi đường, học sinh
  mua nước tăng lực mùa thi).
- **Lương**: 30.500đ/giờ ca ngày, **38.500đ/giờ ca đêm** (tin tuyển của một chuỗi lớn, 2026), có phụ cấp ăn, gửi xe.
- **Nấc thang**: nhân viên → trưởng ca → cửa hàng trưởng (trung bình 12,1 triệu/tháng) → quản lý vùng (35-55 triệu, 5-10
  cửa hàng; trong game là "đi thăm" 3 cửa hàng cùng chuỗi ngoài bản đồ).
- **Sự kiện**: cúp điện theo lịch (kiểm tủ đông); quán net hết mì ly sang mua; Tết làm ca được trả cao; bà Phấn (mẹ
  anh Khôi) livestream cửa hàng trong nhóm cư dân.

#### Photo Thần Tốc (chú Tấn)
- **Ca**: nhận file (USB, tin nhắn, email) → kiểm khổ giấy, số mặt, số bản → in/photo → cắt, đóng gáy lò xo/keo, ép
  plastic, scan → tính tiền. Mini-game: gỡ giấy kẹt, xếp trang, bấm ghim (dùng lại trò máy in của Solo).
- **Giá**: ~300-500đ/mặt A4 đen trắng với số lượng ít.
- **Lương**: 25.500đ/giờ (ngoài đời thuê sinh viên 20.000-25.000đ/giờ: thấp hơn lương tối thiểu, người chơi nhắc được).
- **Nấc thang**: phụ máy → thợ chính (sửa máy) → mở tiệm riêng (máy mới 40-50 triệu hoặc thuê kèm bảo trì 1-2 triệu/tháng).
- **Sự kiện**: đầu năm học và 2 tuần trước thi vào 10 kín đơn đề cương; khách nhờ photo nguyên cuốn sách giáo khoa để
  bán lại (từ chối, hoặc dính vụ "kiểm tra bản quyền" như vụ 48 đầu sách ngoài đời); in tờ rơi trà sữa; drama 21.

#### Net Không Lag (anh Hào): Owner yêu cầu 10
- **Tên pháp lý trên biển hiệu**: "Điểm cung cấp dịch vụ trò chơi điện tử công cộng" (Nghị định 147/2024, hiệu lực
  25/12/2024): có giấy chứng nhận đủ điều kiện, phương án phòng cháy chữa cháy; không còn điều kiện cách cổng trường 200 m.
- **Giờ**: **không hoạt động từ 22h đến 8h sáng** (không phân biệt tuổi).
- **Ca** (8h-15h, 15h-22h): **nạp giờ** (chọn máy, nạp tiền vào tài khoản khách, hỏi tuổi), **bán mì ly, nước**, **dọn
  máy** (lau bàn phím, tai nghe), **xử lý máy treo** (mini-game khởi động lại theo đúng thứ tự, cắm lại dây mạng như Solo),
  báo lỗi mạng, **nhắc khách lúc 21h45**, tắt máy 22h, kiểm tiền cuối ca.
- **Giá giờ chơi**: 8.000-25.000đ/giờ tùy máy; phòng đôi 100.000-200.000đ/giờ.
- **Người dưới 18**: nhà phát hành game giới hạn **60 phút/một game/ngày, tổng 180 phút/ngày**; trong game, máy tự
  hiện cảnh báo khi tài khoản học sinh chạm giới hạn. Quán có lựa chọn từ chối học sinh trong giờ học (8h-16h).
- **Lương**: 26.000đ/giờ [số thiết kế, tham chiếu F&B].
- **Nấc thang**: nhân viên → quản lý ca → tổ chức giải cuối tuần (với Đi Đâu Cũng Được) → chủ quán (giấy tờ, PCCC).
- **Sự kiện**: trốn học đi net (drama 6); cúp điện làm máy treo hàng loạt (thuê máy phát thì ồn); giải đấu tối thứ Bảy
  cho người đi làm 7 công ty; "dự thảo thành luật": nếu một năm trong game có quy định mới "không phục vụ dưới 16 tuổi từ
  21h" (đang là dự thảo ngoài đời, 9/2026) thì doanh thu tối giảm, quán chuyển sang giải cho dân văn phòng.

#### Tiệm tóc Đẹp Mỗi Ngày (chị Mận, chú Ninh): Owner yêu cầu 15
- **Ca**: học việc quét tóc, gội đầu (mini-game massage theo nhịp); thợ phụ gội, ráy tai, cạo mặt; thợ chính cắt, uốn,
  nhuộm (mini-game kéo theo đường kẻ mẫu).
- **Giá**: cắt cơ bản 20.000-30.000đ ngoài đời, trong game 40.000đ năm 2026 [số thiết kế]; nhuộm, uốn vài trăm nghìn.
- **Lương**: học việc 25.500đ/giờ + tip; thợ chính ăn chia 40% tiền dịch vụ [số thiết kế].
- **Nấc thang**: học việc → thợ phụ → thợ chính → mở tiệm (thuê mặt bằng, đăng ký hộ kinh doanh, khai doanh thu).
- **Trung tâm tin đồn thứ hai sau chợ**: mỗi lượt khách, người chơi nghe 1 tin (quán nào sắp đóng, chủ trọ nào tăng giá,
  ai bị phạt vỉa hè). Có xác suất tin sai; tin lan vào nhóm Xóm Ơi; người chơi đính chính được.
- **Đổi kiểu tóc nhân vật**: 11 kiểu (dùng các kiểu `hair` của Solo: short, long, bun, pony, curly, wavy, quiff, side,
  cap, beanie, bald) và 8 màu; tóc mới +10 tâm trạng 3 ngày; Album kiểu tóc là một bộ sưu tập.
- **Sự kiện**: drama 3 (anh Mạnh nhuộm tóc bí mật), 9 (nốt ruồi), 14 (livestream lỡ bật), 25 (ảnh ba chị Diệp).

#### Chợ Tâm Mỹ (phụ sạp): Owner yêu cầu 12
- **Ca**: 3h30-9h. Rạng sáng nhận hàng từ đầu mối, rửa/nhặt rau, chia thịt theo phần, xếp sạp, **cân và tính tiền**
  (cơ chế `scale`), **trả giá** (mini-game chat ngắn), giữ đá cho sạp cá, giao cho quán quen, dọn sạp trưa, ghi sổ nợ.
- **Lương**: 25.500đ/giờ (khung 3h30-6h cộng 30%) + rau mang về.
- **Nấc thang**: phụ sạp → đứng sạp → thuê sạp riêng (giá sạp 2026 chưa có nguồn: [số thiết kế] 3 triệu/tháng).
- **Bối cảnh thật**: sau khi bỏ thuế khoán, tiểu thương lớn tuổi lúng túng với hóa đơn điện tử, có người chi hơn 6 triệu
  mua máy tính tiền; sức mua chợ "người bán nhiều hơn người mua". Người chơi giỏi công nghệ giúp cài, đổi lấy giá rau quen.
- **Sự kiện**: cân điêu (drama 19; ngoài đời mức gian lận 10-20% ở vài chợ); mưa ngập ít khách; trước Tết hàng về đầu mối
  tăng (thịt +60%, rau +88%, hàng khô +200%, hoa +600%), giá tăng 10-20%; drama 9 (hai chị em thất lạc).

#### Đầu mối sỉ Thuận Phát (anh Thịnh)
- **Ca đêm**: 0h-6h. Theo xe tải lên chợ đầu mối (ngoài bản đồ; Bình Điền mỗi đêm hơn 2.500 tấn, ~1.800 thương nhân),
  chia hàng theo đơn của từng quán (mini-game xếp hàng lên ba gác theo tuyến), giao trước giờ quán mở.
- **Lương**: 25.500đ/giờ x 1,3 (phụ cấp đêm) = ~33.200đ/giờ.
- **Nấc thang**: bốc xếp → giao hàng → giữ kho (kế toán kho) → mối lái riêng (bỏ mối cho 5 quán).
- **Sự kiện**: heo về giảm, rau mùa mưa tăng; Kevin vay nóng (drama 27); Chú Bảy bận mùa Tết không chạy được.

#### Quán nhậu Một Hai Ba Dô (anh Mạnh): Owner yêu cầu 13
- **Ca**: 16h-23h. Kê bàn ghế (không lấn vỉa hè), bày đá, nhận món, chạy món (mang nhiều đĩa, giữ thăng bằng), ướp
  bia, **đếm vỏ lon**, tính tiền, dọn bàn, **nhắc khách giữ trật tự** khi khuya, **gọi xe ôm cho khách say** (không để
  khách tự lái).
- **Lương**: 26.000đ/giờ + cơm + tip (ngoài đời ca tối 23.000-30.000đ/giờ; full-time 7-15 triệu/tháng).
- **Luật dùng trong game**: không bán bia cho người dưới 18 tuổi (phạt 1-3 triệu); không ép người khác uống; tiếng ồn,
  karaoke **không còn khung giờ cố định** (Nghị định 282/2025, từ 15/12/2025): gây ồn ảnh hưởng chung bị cảnh cáo hoặc
  phạt 500.000-1.000.000đ bất kể giờ nào, cần chứng cứ (ghi âm, ghi hình, lời hàng xóm). Thuế tiêu thụ đặc biệt bia 65%
  năm 2026, tăng 5% mỗi năm tới 90% năm 2031.
- **Nấc thang**: phục vụ → trưởng ca → quản lý → mở quán (rủi ro tiếng ồn, vỉa hè).
- **Sự kiện**: thứ Sáu 18h dân 7 công ty kéo xuống ("dô dô"); say quên đường về (drama 18); **nợ tiền nhậu**, ghi sổ
  tới ngày lương (drama 4); karaoke nhà bên; khách chuyển trọ là mất nợ; thuế bia 01/01 làm giá két tăng.

#### Xe ôm, xe ôm công nghệ, xe đạp ôm: Owner yêu cầu 16
- **Ca**: chọn loại xe → nhận cuốc (khách đứng ở bến, hoặc thông báo app) → chọn đường (hẻm ngắn nhưng ngập, đường
  chính dài nhưng khô) → giữ thăng bằng khi chở hàng (mini-game lái) → thu tiền / app trừ chiết khấu.
- **Ba kiểu**:
  - **Xe đạp ôm**: không cần bằng, chậm, chở trẻ đi học (với giấy phụ huynh), ít tiền, nhiều chuyện. Nghề gần như
    không còn ngoài đời: trong game có đúng một người (ông Quế) và người chơi có thể học ông.
  - **Xe ôm truyền thống**: cần xe máy và bằng lái; tự định giá; ế dần vì xe app (đúng như ngoài đời, kể cả cận Tết).
  - **Xe ôm công nghệ**: đăng ký app "Xe Tới"; app thu ~20% với xe hai bánh; thưởng tuần; xăng gần 30.000đ/lít đầu 2026
    làm thu nhập giảm 1-1,5 triệu/tháng; giờ mưa giá x1,5.
- **Chở hàng**: giao khô gà Ba & Má, trà sữa, cơm tấm (shipper 25.000-35.000đ/đơn nội thành). Bom đơn: tài xế ứng tiền,
  khách biến mất.
- **Nấc thang**: xe đạp ôm → xe ôm truyền thống → xe ôm công nghệ (hoặc giữ truyền thống) → "dịch vụ giao hàng khu phố"
  (thuê 2 tài xế). Định hướng thật: TP.HCM dự kiến từ 2028 yêu cầu shipper, xe công nghệ khu trung tâm dùng xe điện
  (sự kiện tương lai trong lịch).
- **Sự kiện**: cuốc đêm 22h-23h ở quán nhậu (giá cao, khách nôn, quên trả tiền); mưa ngập ế; té xe → trạm y tế.

#### Xe ba gác của Chú Bảy: Owner yêu cầu 17
- **Chở được**: hàng (khô gà, nguyên liệu, **bàn ghế sự kiện** cho Đi Đâu Cũng Được, **đồ dọn trọ**) và **người**
  (đi nhờ, vui: ngồi giữa thùng khô gà, Chú Bảy kể chuyện "Logistics Director").
- **Phụ Chú Bảy** (ca 5h-11h): chất hàng theo tuyến (mini-game xếp khối như Tetris đơn giản, nặng dưới, nhẹ trên), ngồi
  sau giữ hàng qua ổ gà, giao và ký nhận. Công 150.000đ/buổi [số thiết kế].
- **Thuê ba gác chuyển trọ**: 350.000đ [số thiết kế], Chú Bảy chở cả bạn lẫn đồ; nếu thân 4 tim thì miễn phí, đổi lại phụ
  chú một buổi.
- **Nấc thang**: phụ chất hàng → học lái ba gác (với Thông, lúc 5h sáng) → chạy tuyến riêng → "thừa kế" xe (drama 11:
  Chú Bảy không đi đâu cả, nhưng ai thắng thì được chạy tuyến chiều).
- Xe ba gác là "mạch máu" kinh tế: đầu mối, Ba & Má, Event đều thuê. Chú Bảy bận (Tết) thì hàng giao trễ (mục 6.6).

#### Trạm y tế phường: Owner yêu cầu 14
- **Khám**: khi đói lả, kiệt sức, say xỉn, ăn vụng khô gà đau bụng, té xe, say nắng, sốt xuất huyết mùa mưa. Khám BHYT
  ở trạm **36.500đ/lượt**; từ 01/07/2026 một lần khám dưới 379.500đ được BHYT trả 100%; không thẻ thì trả giá dịch vụ.
  Học sinh phổ thông TP.HCM năm học 2026-2027 được hỗ trợ 100% BHYT.
- **Giấy khám sức khỏe đi làm**: 160.000đ (BHYT không trả); cần cho bậc 3 trà sữa, bếp cơm tấm, sạp chợ.
- **Việc làm được**:
  - **Bảo vệ**: giữ xe, giữ trật tự với người say (mini-game nói chuyện dịu).
  - **Lễ tân/tiếp nhận**: quét căn cước/VNeID tra thẻ BHYT, lấy số thứ tự, thu phí dịch vụ (mini-game xếp hàng ưu tiên:
    cấp cứu trước, người già, trẻ em).
  - **Nhân viên nhà thuốc**: phát thuốc BHYT theo đơn (đọc đơn, đúng tên, đúng liều; kiểu sim `doc` của Solo).
  - **Điều dưỡng**: đo huyết áp, nhiệt độ, băng bó (mini-game). Trong game cần "khóa điều dưỡng buổi tối" 60 ngày ở
    trạm (đơn giản hóa; ngoài đời cần đào tạo và chứng chỉ hành nghề thật).
- **Lương**: 26.000-30.000đ/giờ [số thiết kế]; có hợp đồng từ 1 tháng thì được đóng BHXH, BHYT.
- **Nấc thang**: bảo vệ/lễ tân → nhà thuốc → điều dưỡng → điều dưỡng trưởng (không có đường lên bác sĩ trong game).

#### Trường học và nghề giáo viên: Owner yêu cầu 7
Xem chi tiết đời sống trường ở mục 7.5. Nghề:
- **Ca dạy** (một ngày dạy 4-5 tiết, gom thành 3 khúc):
  1. **Soạn kế hoạch bài dạy** (mini-game xếp thứ tự hoạt động: khởi động → bài mới → luyện tập → vận dụng).
  2. **Lên lớp**: hỏi đáp nhanh, giữ trật tự (học sinh ngủ gật, Tôm nhìn ra cửa sổ về phía quán net), gọi bạn lên bảng.
  3. **Chấm bài + nhập học bạ số**, ký số đúng hạn cuối kỳ.
  4. **Nhóm phụ huynh Xóm Ơi** (mini-game chat): tin nhắn sau 21h trừ năng lượng; từ bậc tổ trưởng đề xuất được "khung giờ
     trả lời" để giảm tin đêm.
  5. Trực cổng giờ tan, họp tổ chuyên môn, dự giờ.
- **Định mức**: tiểu học 23 tiết/tuần, THCS 19 tiết/tuần; năm học 42 tuần làm việc, 37 tuần dạy.
- **Lương** (lương cơ sở 2.530.000đ từ 01/07/2026): hệ số khởi điểm 2,34 → 5.920.200đ; **phụ cấp ưu đãi** tiểu học 45%,
  THCS 40% (Nghị định 182/2026, áp dụng từ 01/01/2026, tháng 7 có truy lĩnh). Ví dụ giáo viên THCS mới: ~8,3 triệu/tháng.
- **Vào nghề trong game**: TP.HCM thiếu giáo viên, khó tuyển nhất là âm nhạc, mỹ thuật, tin học (mỹ thuật THCS cần 235,
  chỉ 57 người đăng ký). Người chơi có hồ sơ đủ ngày ở Nợ Kỹ Thuật Labs (Tin học) hoặc Trend Trễ (Mỹ thuật) được mời
  **dạy hợp đồng**. Lên viên chức phải qua thi/xét có **thực hành sư phạm** (Luật Nhà giáo, hiệu lực 01/01/2026).
- **Nấc thang**: bảo vệ trường / giám thị → giáo viên hợp đồng → giáo viên (viên chức) → tổ trưởng chuyên môn → phó
  hiệu trưởng → hiệu trưởng. Luật Nhà giáo bỏ chia hạng I, II, III, thay bằng chức danh theo năng lực.
- **Dạy thêm** (Thông tư 29/2024, sửa bởi Thông tư 19/2026): không dạy thêm có thu tiền với học sinh mình đang dạy;
  không dạy thêm học sinh tiểu học (trừ nghệ thuật, thể thao, kỹ năng sống); dạy thêm ngoài trường phải đăng ký kinh
  doanh và báo hiệu trưởng (kể cả quan hệ với người đứng tên cơ sở); trong trường tối đa 2 tiết/tuần/môn; phường có
  đường dây nóng. Trong game: HR mời dạy buổi tối ở trung tâm (drama 28); dạy học sinh lớp mình là có "tin báo đường dây
  nóng"; báo cáo đầy đủ và dạy học sinh trường khác là hợp lệ, thêm thu nhập.
- **Sự kiện**: 20/11 (trường không nhận hoa quà, chuyển thành học bổng); thi vào 10 (01-02/06); cúp điện trùng hạn
  nhập học bạ số; truy lĩnh phụ cấp tháng 7; khai giảng 5/9.

#### Việc công trong khu phố
- **Cộng tác viên khu phố** (Ban điều hành có khoảng 5 người không chuyên trách): phát thông báo, khảo sát hộ, **đọc loa**
  (mini-game đọc đúng nhịp, không đọc nhầm tin), dựng Ngày hội 18/11. Phụ cấp nhỏ [số thiết kế: 1,5 triệu/tháng; mức thật
  chưa có nguồn].
- **Bảo vệ dân phố**: phân luồng cổng trường 6h30-7h30 và giờ tan (giảm kẹt, giúp quán quanh đó giao hàng đúng giờ).
- **Phụ thợ điện lực** (hợp đồng): ghi chỉ số công tơ (đọc số, nhập app), dán thông báo cúp điện, giải thích giá bậc thang.
- **Trưởng khu phố** (vai trò cuối, không phải việc làm hằng ngày): cần ≥ 21 tuổi, cư trú thường xuyên, uy tín khu phố
  ≥ 80, được bầu (cần ít nhất 50% hộ đồng ý theo kiểu phương án sắp xếp khu phố 2026). Giữ loa, hòa giải drama.
- **Công an phường**: người chơi **không** làm công an. Chỉ tương tác: đăng ký tạm trú, báo tin, tình nguyện phân luồng.

### 4.4 Bảy công ty

Bảy công ty giữ nguyên như Solo: **thực tập 45 ngày, có cốt truyện, phỏng vấn + thỏa thuận lương, đánh giá thứ Sáu,
một đường thăng chức, kết thúc finish / quit / layoff**. Trong Khu phố:

- **Ứng tuyển**: ở bảng tuyển dụng sảnh cao ốc (T&M, Tech, Cân Đối), cửa Ba & Má, kho Event, tầng 4 Lô C (HR, leo bộ),
  sân thượng Agency. Người phỏng vấn đọc hồ sơ cá nhân (mục 5).
- **Ngày làm**: 8h30-17h30 bạn ở trong văn phòng, chơi y như Solo (bản đồ riêng của từng công ty đã có). 17h30 bước ra
  phố, buổi tối và cuối tuần là khu phố. Cách nối kỹ thuật là câu hỏi Q4 (mục 11).
- **Sau 45 ngày** (hoặc khi nghỉ): công ty vẫn ở đó, quay lại được để làm "việc ghé" (freelance, theo buổi), người cũ vẫn nhớ bạn.

| Công ty | Nơi | Việc ghé lại sau thực tập | Mở khóa trong khu phố |
|---|---|---|---|
| T&M Partners | Cao ốc tầng 12 | "Tư vấn chiến lược 1 buổi" cho quán trong khu phố (slide cho cơm tấm, 3 vòng "vài ý nhỏ") | Bảng P&L nâng cao, dự báo khách |
| Ba & Má | Nhà phố + xưởng | Ca xưởng (xé khô gà, cân 200 g, trộn gia vị: dùng lại trò bàn làm việc), **canh giàn phơi**, đứng quầy bán gói học sinh, giao khô bằng ba gác | Topping xoài sấy giá quen; đi nhờ ba gác |
| Nợ Kỹ Thuật Labs | Cao ốc tầng 7 | Sửa máy quán net, làm "app đặt trước" cho trà sữa, hỗ trợ phòng Tin của trường | Kênh đặt trước; dạy hợp đồng môn Tin |
| Trend Trễ Agency | Loft sân thượng | Quay clip, chạy fanpage, quản lý KOC cho quán | Kênh video ngắn rẻ hơn 30%; dạy hợp đồng Mỹ thuật |
| Cân Đối & Cộng Sự | Cao ốc tầng 3-5 | Giữ sổ S1a-HKD, thông báo doanh thu trước 31/01, cài máy tính tiền khi vượt 1 tỷ (với anh Sang) | Tự khai thuế quán mình không cần thuê |
| Đi Đâu Cũng Được | Văn phòng + kho | Dựng sân khấu Ngày hội 18/11, khai giảng 5/9, đám cưới hẻm, giải net tối thứ Bảy | Thuê bàn ghế, loa giá quen |
| Người Đúng Chỗ HR | Lô C tầng 4 | Recruiter part-time: đọc hồ sơ cư dân, ghép người vào ca thiếu (sim chat), săn giáo viên | Xem "điểm hồ sơ" của mọi NPC; được giới thiệu việc bậc cao |

### 4.5 "Shop engine" dùng chung (cho người lập trình)

Một bộ máy, nhiều nơi làm. Ý tưởng mượn từ bản Multiplayer (phiếu = món, trạm, đồ để quá lâu thì hỏng, đồng hồ kiên
nhẫn) nhưng **viết lại cho một người chơi, nằm trong thư mục riêng** (ví dụ `site/js/khupho/`), không đụng file Multiplayer.

| Khối | Là gì | Trà sữa | Cơm tấm | Net |
|---|---|---|---|---|
| `station` | Trạm thao tác | Kệ cốc, topping, bình ủ, bơm sữa, bơm đường, đá, lắc, dập nắp | Nồi cơm, bếp than, bàn sườn, chén nước mắm | Quầy nạp, tủ mì, máy treo |
| `recipe` | Chuỗi bước đúng | 11 bước/ly | 6 bước/đĩa | Nạp giờ: chọn máy → hỏi tuổi → nạp |
| `ticket` | Phiếu khách + kiên nhẫn | Order | Order | Yêu cầu khách |
| `stock` | Kho + hạn dùng | Trân châu 8 giờ | Sườn ướp 24 giờ | Mì ly |
| `supplier` | Nguồn hàng + giá + giao | Chợ, đầu mối, Ba & Má, app sỉ, tiện lợi | Chợ, đầu mối | Tiện lợi, đầu mối |
| `channel` | Kênh kéo khách | 8 kênh | Nhóm cư dân, app | Nhóm cư dân, giải đấu |
| `ledger` | Sổ thu chi + thuế | P&L | P&L | P&L |
| `rank` | Nấc thang + điều kiện | 6 bậc | 4 bậc | 4 bậc |
| `events` | Sự kiện riêng nơi đó | Bão 1 sao | Kiểm tra an toàn thực phẩm | Tuần tra 22h |

Mỗi nơi làm là **một file nội dung thuần dữ liệu** (giống hợp đồng nội dung công ty của Solo), có trình kiểm tra riêng.

---

## 5. Hồ sơ cá nhân (Owner yêu cầu 18)

### 5.1 Nguyên tắc

- Làm ở đâu, dù 1 ca, cũng **ghi vào hồ sơ**. Hồ sơ **không bao giờ bị xóa**, kể cả khi bắt đầu lại khu phố.
- **Số ngày làm luôn được lưu** và **chỉ tăng, không giảm** (kể cả khi gộp dữ liệu từ hai máy).
- Hồ sơ đi theo bạn khắp khu phố: **mọi nhà tuyển dụng đọc nó** khi bạn xin việc; công ty HR đọc kỹ nhất.
- Hồ sơ gộp luôn **lịch sử Solo**: mỗi lượt thực tập 45 ngày ở 7 công ty (trong "Hồ sơ sự nghiệp" của Solo) tự thành
  một dòng trong hồ sơ cá nhân.
- Hồ sơ là để **khoe và mở khóa**, không để phạt. Chỗ xấu (bị cho nghỉ, nhảy việc) chỉ làm nhà tuyển dụng hỏi thêm một
  câu, có cách trả lời tốt.

### 5.2 Các trường được lưu

**Phần chung (một bản cho người chơi):**

| Trường | Ví dụ | Ghi chú |
|---|---|---|
| `name`, `look` | "Thảo Vy", tóc pony nâu | Tóc đổi ở tiệm tóc, có lịch sử kiểu tóc |
| `home` | Dãy trọ Bình An, phòng 5 | Lịch sử chuyển trọ |
| `tamTru` | Đã đăng ký ngày 12/11/2026 (game) | Ảnh hưởng tiền điện, sự kiện công an |
| `bhyt` | Có, qua Trà Sữa Full Topping | Hoặc "tự mua hộ gia đình", hoặc "chưa có" |
| `certs` | Giấy khám sức khỏe (hết hạn sau 12 tháng game), Xác nhận kiến thức an toàn thực phẩm, Bằng lái xe máy, Khóa điều dưỡng, Thực hành sư phạm | Mỗi giấy có ngày cấp, nơi cấp |
| `skills` | Pha chế 4, Nướng 2, Bán hàng 3, Sửa máy 1, Cắt tóc 0, Lái xe 2, Dạy học 0, Cân đo 3, Chăm sóc 1 | 0-10, tăng theo ca |
| `reputation` | Uy tín khu phố 62 | |
| `totals` | 148 ngày làm, 201 ca, 41.250.000đ đã kiếm | Tự tính lại từ các dòng |

**Mỗi dòng làm việc (`entries[]`, một dòng cho mỗi lần làm ở một nơi):**

| Trường | Ví dụ | Ghi chú |
|---|---|---|
| `entryId` | `kp-trasua-01` | Không đổi, dùng để gộp dữ liệu |
| `placeId`, `placeName` | `trasua`, "Trà Sữa Full Topping" | Lưu cả tên lúc đó (quán có thể đổi tên, đóng cửa) |
| `kind` | quán / công ty (Solo) / việc công / tự làm chủ | |
| `role` | Ca trưởng | Vị trí lúc cuối |
| `rankHighest` | Bậc 4: Ca trưởng | Không giảm |
| `daysWorked` | 47 | Số ngày có ít nhất 1 ca. **Chỉ tăng** |
| `shifts`, `hours` | 61 ca, 244 giờ | |
| `startDate`, `endDate` | 03/11/2026 → 21/01/2027 (ngày game), kèm ngày thật | `endDate` trống = đang làm |
| `ratings` | A: 18, B: 30, C: 11, D: 2; trung bình B+; 3 nhận xét gần nhất của chủ | Nhận xét là câu thoại thật của chủ quán |
| `reasonLeft` | "Chuyển sang làm giáo viên Tin hợp đồng" | Mã + câu; các mã: chuyển chỗ, học thêm, nghỉ ngơi, mở quán riêng, bị cho nghỉ, hết thực tập, quán đóng cửa, chuyển trọ |
| `contacts` | Chị Nhung (sếp, 4 tim), Tú (mentor, 3 tim), Bông (đồng nghiệp, 3 tim), Khang (khách quen, 2 tim) | Người quen ở đó và độ thân lúc rời |
| `highlights` | "50 ly liền không sai %", "Cứu ca bão 1 sao", "Đào tạo Bông" | Huy hiệu, tối đa 8 mỗi dòng |
| `reference` | Thư giới thiệu của chị Nhung | Có khi rời đi lúc độ thân ≥ 3 |
| `soloRunId` | (chỉ cho 7 công ty) | Trỏ tới lượt chơi Solo gốc; status intern/official, kết thúc finish/quit/layoff |

### 5.3 Ai đọc hồ sơ và đọc thế nào

Khi xin việc, có một cảnh ngắn **"Chủ quán đang đọc hồ sơ của bạn…"**: chủ nhận xét 1-3 dòng nổi bật (dòng làm lâu
nhất, bậc cao nhất, một lý do nghỉ buồn cười), rồi đề nghị bậc vào làm.

| Điều kiện trong hồ sơ | Nhà tuyển dụng phản ứng |
|---|---|
| Cùng loại việc (ví dụ ăn uống) ≥ 20 ngày | Vào thẳng bậc 2 |
| Từng là ca trưởng ở bất kỳ quán ăn uống nào | Vào bậc 3 (vẫn cần giấy khám sức khỏe còn hạn) |
| Có người quen ở nơi mới (độ thân ≥ 3) | Có "người giới thiệu": bỏ qua ca thử |
| ≥ 3 chỗ làm dưới 5 ngày trong 30 ngày gần nhất | Câu đùa "nhảy việc như nhảy dây", hỏi 1 câu, phải làm 2 ca thử. Không hạ bậc |
| Lý do nghỉ "bị cho nghỉ" | Hỏi chuyện; trả lời thật lòng +1 tim với chủ mới |
| Từng là nhân viên chính thức ở một công ty (Solo) | Công ty đó mời "việc ghé" mức cao; các quán coi như có kỹ năng quản lý thời gian |
| Thư giới thiệu | +1 tim với chủ mới ngay từ đầu |

**Công ty HR (Người Đúng Chỗ HR)** đọc hồ sơ như headhunter: anh Tuấn hoặc chị Ngân đưa ra **3 lời mời việc** khớp với
hồ sơ (phí headhunter 15-30% lương năm do bên tuyển trả, nên người chơi không mất gì), kèm nhận xét kiểu "CV của em
đẹp, nhưng 3 tháng làm 6 chỗ thì khách sẽ hỏi". Nếu làm ở HR, người chơi **đọc hồ sơ của cư dân khác** (mini-game sim
`doc` của Solo: tìm dòng đáng ngờ, ra quyết định).

Người khác cũng đọc hồ sơ:
- **Ngân hàng "Ví Mỏng"** (tên tự đặt) khi vay vốn mở quán: cần ≥ 90 ngày ở một nơi và thu nhập đều.
- **Trường THCS** khi mời dạy hợp đồng: cần dòng Nợ Kỹ Thuật Labs (Tin) hoặc Trend Trễ (Mỹ thuật) ≥ 20 ngày.
- **Chủ trọ** khi thuê phòng tốt hơn: có việc ổn định ≥ 30 ngày thì giảm cọc.
- **Ban điều hành khu phố**: dùng uy tín khu phố và số năm ở khu phố, không dùng chỗ làm.

### 5.4 Hồ sơ mở khóa gì

| Mở khóa | Cần trong hồ sơ |
|---|---|
| Ca trưởng trà sữa | 40 ngày ở trà sữa, giấy khám sức khỏe, xác nhận an toàn thực phẩm |
| Mở quán riêng | 1 dòng có bậc quản lý + vốn (hoặc khoản vay cần 90 ngày ở một nơi) |
| Lái ba gác | 10 buổi phụ Chú Bảy |
| Xe ôm công nghệ | Bằng lái + 15 ngày xe ôm truyền thống hoặc xe đạp ôm |
| Thợ chính tiệm tóc | 30 ngày thợ phụ |
| Giáo viên hợp đồng | Dòng Tech hoặc Agency ≥ 20 ngày + ca thực hành sư phạm |
| Điều dưỡng | 60 ngày khóa điều dưỡng buổi tối + 20 ngày làm ở trạm |
| Quản lý vùng tiện lợi | Cửa hàng trưởng 60 ngày |
| Huy hiệu "Người của khu phố" | Đã làm ở ≥ 8 nơi khác nhau |
| Huy hiệu "Một đời một nghề" | ≥ 365 ngày ở cùng một nơi |

### 5.5 Gắn với lưu đám mây hiện có

- Hồ sơ nằm trong **cùng hồ sơ người chơi** đang lưu ở localStorage `tm_profile_v1` và đẩy lên đám mây (email + mật khẩu
  game; mã lưu 8 ký tự, hạn 30 ngày). Thêm một khóa mới ở cấp ngoài cùng: `kp` (gồm `resume` = hồ sơ cá nhân, `world` =
  trạng thái khu phố).
- **Việc cần làm trong code (đã kiểm tra)**: `validateProfile()` và `mergeProfiles()` trong `site/js/game/save.js` hiện
  **chỉ giữ `v`, `runs`, `activeId`**, nên khóa `kp` sẽ bị mất khi gộp từ đám mây. Phải mở rộng hai hàm này (có test):
  - `resume.entries` gộp theo `entryId`: `daysWorked`, `shifts`, `hours`, `rankHighest` lấy **giá trị lớn hơn**; `endDate`
    lấy bản mới hơn; `contacts` và `highlights` hợp lại.
  - `world` (khu phố) lấy bản có `updatedAt` mới hơn.
  - Dòng Solo được dựng lại từ `runs` mỗi lần mở hồ sơ, nên không cần lưu trùng.
- Kích thước: mỗi dòng ~400 byte; 500 dòng cũng chỉ ~200 KB, vừa với cột `data jsonb` hiện có, không cần đổi bảng Supabase.

---

## 6. Nền kinh tế khu phố

### 6.1 Mô hình (đơn giản, đủ thật)

- **Cầu**: khu phố có ~400 hộ "vô hình" (một khu phố TP.HCM quản lý khoảng 350-450 hộ) chia thành nhóm: học sinh,
  dân văn phòng 7 công ty, người thuê trọ và công nhân, người già, khách vãng lai. Mỗi nhóm có ví (đầy vào ngày lương),
  lịch đi lại (giờ nào ở đâu), món thích.
- **Cung**: mỗi cơ sở có kho, bảng giá, chất lượng, số sao, tiền mặt, nhân viên.
- **Giá gốc**: một bộ chỉ số giá (heo, bò, rau, cá, cà phê nhân, bột béo/trà, bia, xăng, gas, điện, giấy in), khởi đầu bằng số
  thật bên dưới, mỗi ngày dao động nhỏ ±1%, có xu hướng theo mùa và **cú sốc** rút từ một bộ bài sự kiện.
- **Truyền giá**: chủ quán NPC phản ứng chậm 3-7 ngày, mỗi người một kiểu: tăng giá (cơm tấm), **giảm phần thay vì tăng
  giá** (Cô Bánh Mì, như ngoài đời), bỏ app (một kiểu chủ quán cơm tấm), giữ giá lấy lãi (bà Cẩm khi cà phê nhân giảm).
- **Co giãn**: khi giá tăng, khách giảm tần suất (ngoài đời: bún bò tăng giá thì khách giảm từ 3-4 lần/tuần xuống 1-2 lần).
  Bữa sáng co giãn mạnh, trà sữa co giãn vừa [hệ số là số thiết kế].
- **Nhịp tính**: quán người chơi đang đứng tính theo từng giờ; cả khu phố tính một lần lúc người chơi ngủ (nhẹ máy).
- Có **hạt giống ngẫu nhiên** theo ngày để kiểm thử lặp lại được.

### 6.2 Bảng giá gốc (số thật, có nguồn trong research)

| Hàng | Giá | Thời điểm |
|---|---|---|
| Thịt heo sỉ đầu mối: cốt lết / ba chỉ / sườn / nạc | 82.000 / 115.000 / 135.000 / 120.000đ/kg | Lao Động |
| Thịt heo tươi bán cho quán | 120.000 → 130.000đ/kg | 10/2026 |
| Thịt bò | 150.000 → 180.000đ/kg | 10/2026 |
| Tôm | 180.000 → 200.000đ/kg | 10/2026 |
| Rau muống / cải / cà chua (chợ ven) | ~20.000 / 30.000 / 50.000đ/kg | mùa mưa 2026 |
| Cà phê nhân | ~89.000đ/kg (kỷ lục 2024: 122.000-124.000) | cuối 10/2026 |
| Bột béo | 68.000-80.000đ/kg | 2026 |
| Gas | trên 500.000đ/bình | 10/2026 |
| Xăng | gần 30.000đ/lít | đầu 2026 |
| Dầu ăn 1 lít / thùng mì gói / đậu phộng | 45.000 / 116.000 / 70.000đ | 12/2025 |
| Điện kinh doanh: bình thường / thấp điểm / cao điểm | 3.089 / 1.880 / 5.313đ/kWh (chưa VAT) | từ 01/11/2026 |
| Điện sinh hoạt bậc 1-5 | 1.901 / 2.289 / 2.894 / 3.456 / 3.844đ/kWh | từ 01/11/2026 |
| Nước kinh doanh / hộ dân trong định mức | 21.300 / 6.700đ/m³ (+30% thoát nước) | 2026 |
| Bia thùng 24 lon ở đại lý | 325.000-400.000đ (dịp Tết, năm không rõ); thuế tiêu thụ đặc biệt 65% năm 2026 | |

### 6.3 Cầu thay đổi theo giờ, thời tiết, mùa, ngày lương

| Yếu tố | Ảnh hưởng (số thiết kế, chỉnh khi chơi thử) |
|---|---|
| Giờ trong ngày | Theo bảng khung giờ của từng nơi (ví dụ trà sữa ở 4.2.d) |
| Nắng nóng (tháng 3-4) | Đồ uống +25%, đá thiếu, trạm y tế thêm ca say nắng, đi bộ tốn sức |
| Mưa | Ăn tại quán −40%, app +60%, xe ôm truyền thống ế, rau +20-25% trong tháng |
| Triều cường, ngập (đỉnh tháng 10-11) | Hẻm 7 ngập 2 giờ, đường vòng; té xe +; chợ vắng |
| Ngày lương (7 công ty trả ngày 30) | Ngày 1-5: quán nhậu, trà sữa, tiệm tóc +15%; ngày 25-30: −10% |
| Thứ Sáu | Quán nhậu +40% từ 18h |
| Thứ Bảy tối | Quán net giải đấu, đám cưới hẻm |
| Năm học / nghỉ hè | Hè: tụi nhỏ ở nhà, quán net và sân chơi đông, sóng tan trường biến mất |
| Rằm, mùng 1 | Cơm chay ở cơm tấm, chợ hoa quả +; quán nhậu −10% |
| Tết | Tuần trước Tết: chợ, Ba & Má, tiện lợi tăng mạnh; tuần Tết: văn phòng nghỉ, trà sữa −50% |

### 6.4 Chuỗi cung ứng

```
 Chợ đầu mối (đêm, ngoài bản đồ)
        │ xe tải anh Thịnh, 0h-5h
        ▼
 Đầu mối sỉ Thuận Phát ──ba gác Chú Bảy 5h-7h──► Trà sữa · Cơm tấm · Quán nhậu · Tiện lợi · Quán net
        │                                              ▲
        ▼                                              │ trái cây, rau, thịt, cá (sáng)
 Chợ Tâm Mỹ (sạp) ─────────────────────────────────────┘
        ▲
 Ba & Má (xưởng) ──khô gà, xoài sấy──► Trà sữa (topping) · Tạp hoá cô Sáu · cửa sổ "gói học sinh"
        │
        └──ba gác──► Đi Đâu Cũng Được (bàn ghế sự kiện, quà Ngày hội)

 Photo Thần Tốc ──tờ rơi, đề cương──► Trà sữa · Trường
 Trend Trễ ──clip, fanpage, KOC──► mọi quán      Cân Đối ──sổ thuế──► mọi hộ kinh doanh
 Điện lực ──giá điện, lịch cúp──► mọi nơi         App giao hàng ──20-30% + VAT──► quán và tài xế
```

### 6.5 Cú sốc giá (bộ bài, mỗi năm rút khác nhau)

Heo về chợ đầu mối giảm một nửa (sau Tết 2025 chỉ ~2.900-3.000 con/ngày); bò, tôm tăng (10/2026); gas tăng; xăng lên
30.000đ/lít; cà phê nhân lập đỉnh rồi rơi; bột béo tăng; mưa kéo dài làm rau tăng; thuế bia tăng mỗi 01/01; giá điện
đổi (01/11/2026 sinh hoạt bình quân giảm 2%, còn 5 bậc); chủ trọ tăng tiền phòng để bù tiền điện bị siết.

### 6.6 Các tương tác giữa doanh nghiệp (35 dòng)

| # | Nguyên nhân | Hệ quả | Nơi bị ảnh hưởng | Người chơi tác động thế nào |
|---|---|---|---|---|
| 1 | Heo về chợ đầu mối giảm một nửa | Sườn +10%; cơm tấm tăng 5.000đ/đĩa hoặc bớt sườn; khách giảm tần suất | Đầu mối, chợ (anh Phú), Cơm Tấm Cô Lài | Ở cơm tấm: chọn tăng giá / giảm phần / thêm món trứng; ở chợ: tìm mối khác |
| 2 | Mưa lớn + triều cường | Rau +20-25%, xe ôm ế, đơn app tăng, té xe tăng | Chợ, xe ôm, mọi quán có app, trạm y tế | Chạy xe app giờ mưa (x1,5); quán bật app; trữ rau sớm |
| 3 | Giờ tan trường 16h-17h | Sóng khách 15-30 phút; công an nhắc vỉa hè | Trà sữa, tiện lợi, bánh mì | Dọn bàn vỉa hè đúng giờ; chuẩn bị sẵn ly |
| 4 | Cúp điện theo lịch (báo trước 5 ngày, đăng 3 ngày liền) | Trữ đá, tủ đông nguy cơ, photo dời đơn, net máy treo, học bạ số trễ | Trà sữa, tiện lợi, photo, net, trường | Đọc loa/nhóm cư dân, đặt đá từ đầu mối, làm học bạ sớm |
| 5 | Giờ cao điểm điện 17h30-22h30 | Hóa đơn điện tối cao gần gấp 3 thấp điểm | Net, quán nhậu, trà sữa tối | Nấu trân châu trước 6h; thay thiết bị tiết kiệm |
| 6 | Thuế bia tăng 01/01 (65% → 70%…) | Giá két tăng; quán tăng giá lon; khách công ty than | Đầu mối, quán nhậu, 7 công ty | Bán thêm mồi; Trend Trễ đề xuất "happy hour" chiều |
| 7 | Lương 7 công ty về ngày 30 | Ngày 1-5 chi tiêu +15% | Quán nhậu, trà sữa, tiệm tóc | Chạy khuyến mãi đầu tháng, ghi sổ nợ cuối tháng |
| 8 | Giáo viên nhận truy lĩnh phụ cấp tháng 7 (áp dụng từ 01/01/2026) | Tổ bộ môn chiêu đãi | Cơm tấm, quán nhậu, trà sữa | Nhận đặt bàn tổ, combo giáo viên |
| 9 | Thi vào 10 (01-02/06) | Photo kín đơn đề cương; trà sữa góc học nhóm; tiện lợi bán nước tăng lực; net vắng học sinh | Photo, trà sữa, tiện lợi, net, trường | Mở góc học tới 21h (không quá khuya); in đề cương đúng bản quyền |
| 10 | Ba & Má ra "gói học sinh" | Ăn vụng giảm; ca đau bụng giảm; tạp hoá cô Sáu bán ké | Ba & Má, trạm y tế, chợ | Ở Ba & Má: đề xuất giá, đóng gói, mở cửa sổ sân sau |
| 11 | Tụi nhỏ ăn vụng khô gà chưa ráo | Đau bụng → trạm y tế; Ba & Má mất hàng; phụ huynh than | Ba & Má, trạm y tế, nhóm phụ huynh | Canh giàn phơi hay bán gói học sinh (drama 7) |
| 12 | Quán net hết mì ly | Mua tiện lợi (đắt, ngay) hoặc đầu mối (rẻ, sáng mai) | Net, tiện lợi, đầu mối | Nhân viên net chọn nguồn |
| 13 | Combo "giờ chơi + trà sữa" | Đơn trà sữa tăng; giao cho học sinh giờ học → phụ huynh phản ứng | Net, trà sữa, trường | Từ chối giao giờ học (8h-16h) |
| 14 | Giải net tối thứ Bảy (Đi Đâu Cũng Được tổ chức, Trend Trễ quay) | Net doanh thu +; hàng xóm than ồn (Nghị định 282: không còn khung giờ cố định) | Net, Event, Agency, Công an phường | Quản giờ, cách âm, xin phép khu phố |
| 15 | Người review chê quán để viral | Nhóm cư dân bênh quán → 5 sao tăng, quán đông hơn (đã có thật) | Quán bị chê, Agency | Phản hồi bình tĩnh, mời ăn lại |
| 16 | Khai trương mua 1 tặng 1 quá tải | Chờ lâu → bão 1 sao | Quán khai trương | Giới hạn 50 khách đầu, đóng cửa sớm 1 tiếng |
| 17 | Bom đơn trà sữa 1,2 triệu | Tài xế ôm hàng; app bồi hoàn tối đa 1 triệu | Xe ôm công nghệ, trà sữa | Quán mua lại một phần để giữ tài xế quen |
| 18 | Xăng gần 30.000đ/lít | Xe ôm tăng giá; chú Lương đòi tăng phí giao cho tạp hoá; xe đạp ôm thành rẻ nhất | Xe ôm, chợ, tạp hoá | Chọn kiểu giao hàng; học xe đạp ôm |
| 19 | Chủ trọ sợ phạt 20-30 triệu (Nghị định 133/2026) | Hạ giá điện về đúng giá, tăng tiền phòng 200.000đ | Nhà trọ, người thuê, quán ăn (khách bớt tiền) | Đăng ký tạm trú để tính giá hộ; thương lượng (drama 23) |
| 20 | Công an kiểm tra tạm trú (tháng 12) | Chủ trọ chưa khai báo người thuê quá 30 ngày bị phạt 750.000đ | Nhà trọ, Công an phường | Đăng ký trên VNeID trước |
| 21 | Ra quân vỉa hè | Xe bánh mì lùi vào mất 30% khách vãng lai; quán nhậu dọn bàn; tái lấn chiếm bị phạt 200.000-250.000đ | Bánh mì, quán nhậu, trà sữa | Gửi điểm bán vào tiện lợi; bán app |
| 22 | Kiểm tra an toàn thực phẩm trước Tết | Thiếu giấy khám sức khỏe → phạt, nghỉ bán 1 ngày → khách sang quán khác | Cơm tấm, trà sữa, trạm y tế | Làm giấy khám sức khỏe sớm (160.000đ) |
| 23 | Cà phê nhân giảm còn ~89.000đ/kg | Bà Cẩm giảm giá đánh trà sữa hoặc giữ giá lấy lãi | Cà phê cóc, trà sữa | Đề xuất combo sáng-chiều (drama 1) |
| 24 | Tết: hàng về đầu mối tăng 60-600% | Chợ giá +10-20%, hoa +30%; Ba & Má hộp quà; văn phòng nghỉ 5 ngày; tiện lợi ca Tết lương cao | Gần như tất cả | Làm ca Tết; nhập hàng sớm |
| 25 | Ngày hội Đại đoàn kết 18/11 | Event dựng sân khấu; quán góp quà, học bổng; cô Nga vận động | Khu phố, Event, mọi quán | Tài trợ một suất học bổng → uy tín khu phố |
| 26 | 20/11 trường không nhận hoa quà | Hoa quà chuyển thành học bổng hoặc thẻ BHYT học sinh; tiện lợi bán thiệp | Trường, tiện lợi, trà sữa | Giáo viên chọn cách xử lý quỹ phụ huynh (drama 20) |
| 27 | Một quán vượt 1 tỷ doanh thu/năm | Mua máy tính tiền có hóa đơn điện tử trong 30 ngày, nộp 4,5% | Quán đó, Cân Đối (anh Sang) | Tách quán / chấp nhận / thuê dịch vụ |
| 28 | Hạn 31/01 thông báo doanh thu | Tiểu thương nhờ khai; Cân Đối mở gói "khai thuế hộ" | Chợ, mọi hộ kinh doanh | Giúp cô Sáu khai, đổi lấy giá quen |
| 29 | HR săn thầy Kiệt | Trường thiếu giáo viên Tin | Trường, HR, net | Người chơi có hồ sơ Tech được mời dạy hợp đồng (drama 28) |
| 30 | Chú Bảy bận mùa Tết | Ba gác không chạy → đầu mối giao trễ, quán thiếu ly nắp | Đầu mối, trà sữa, Event | Thuê xe ôm chở hàng, hoặc tự chạy ba gác (nếu đã học) |
| 31 | Nắng nóng tháng 3-4 | Trà sữa +25%, thiếu đá, ca say nắng, ông Quế nghỉ | Trà sữa, tiện lợi, trạm y tế, xe đạp ôm | Đặt đá, chở thay ông Quế |
| 32 | Thứ Sáu quán nhậu đông | Cuốc xe ôm đêm giá cao; khách tự lái → kiểm tra nồng độ cồn | Quán nhậu, xe ôm, Công an | Phục vụ gọi xe cho khách; làm xe ôm ca đêm |
| 33 | Lương cơ sở tăng 01/07 | BHYT hộ gia đình tăng; lương giáo viên, công chức +8%; ăn ngoài nhẹ + | Trường, trạm y tế, mọi quán | Không cần làm gì; thấy trong bảng tin |
| 34 | Trend Trễ chạy clip cho một quán | +khách trẻ 2 tuần rồi giảm; quán bên cạnh mất khách | Quán thuê, quán đối thủ | Chọn kênh khôn ngoan; ghép combo với quán bên cạnh |
| 35 | Tin đồn ở tiệm tóc (có thể sai) | Lan vào Xóm Ơi; khách đổi quán theo tin đồn | Tiệm tóc, quán bị đồn | Đính chính, mời người trong cuộc nói |

### 6.7 Người chơi tác động lên nền kinh tế

- **Từ trong**: làm nhân viên giỏi làm quán đông hơn (sao tăng); làm ca trưởng/quản lý thì đặt giá, chọn nhà cung cấp,
  chọn kênh.
- **Từ ngoài**: mua đều ở một nơi (quán đó sống khỏe), giới thiệu khách, viết đánh giá, đăng nhóm cư dân, tài trợ Ngày hội.
- **Làm chủ**: quán của bạn cạnh tranh thật với quán NPC (ví dụ mở trà sữa thứ hai trong khu phố làm Full Topping giảm
  khách; ghép combo thì cả hai cùng lợi).
- **Không có quán nào chết hẳn vì người chơi**: quán NPC lỗ lâu thì "đổi mô hình" (photo thành cà phê, cà phê thành trà
  sữa) chứ không biến mất buồn bã. Khu phố thay đổi nhưng vẫn đầy đủ.

---

## 7. Cư dân và trẻ em

### 7.1 Nhịp sống người lớn (mẫu)

| Nhóm | Sáng | Trưa | Chiều | Tối |
|---|---|---|---|---|
| Dân văn phòng 7 công ty | Bánh mì, cà phê cóc, thang máy kẹt 8h | Cơm tấm, trà sữa giao lên tầng | Họp; mùa kiểm toán Cân Đối ở lại | Thứ Sáu nhậu; tiệm tóc cuối tuần |
| Tiểu thương chợ | 3h30 nhận hàng, bán tới trưa | Ngủ trưa ở sạp | Bán chiều 15h-18h | Ngủ sớm |
| Người thuê trọ, công nhân | Đi làm sớm | Mì ly | Về muộn | Tiện lợi, quán net (người lớn) |
| Người già | Thể dục sân chơi 5h, cà phê cóc | Ở nhà | Tiệm tóc, nhóm cư dân | Karaoke (ông Thanh) |

Mỗi NPC có lịch riêng trong tuần; người chơi gặp họ đúng chỗ đúng giờ (như Solo đặt người theo `pos`).

### 7.2 Trẻ em: chỉ ăn, ngủ, đi học, tập thể dục, chơi game (Owner yêu cầu 9)

Đây là **luật cứng** của nội dung. 11 em (6-15 tuổi) chỉ xuất hiện trong 5 hoạt động này. Không đi làm, không phụ sạp,
không dính tình cảm, không ở quán nhậu.

| Giờ (ngày đi học) | Hoạt động | Ở đâu |
|---|---|---|
| 6h | Ngủ dậy | Nhà |
| 6h15-6h45 | **Ăn** sáng: bánh mì, xôi, cơm tấm | Xe bánh mì, cơm tấm |
| 6h30-7h | Tới trường (đi bộ, xe đạp ôm ông Quế, phụ huynh chở) | Cổng trường |
| 7h-11h | **Đi học** | Trường |
| 11h-13h | **Ăn** trưa bán trú, **ngủ** trưa | Trường |
| 13h-16h30 | **Đi học** | Trường |
| 16h30-17h | Ăn vặt: trà sữa, gói học sinh khô gà (tiền tiêu vặt 10.000-20.000đ/ngày [số thiết kế]) | Trà sữa, cửa sổ Ba & Má |
| 17h-18h | **Tập thể dục**: đá bóng mini, nhảy dây, chạy | Sân chơi |
| 18h30 | **Ăn** tối | Nhà |
| 19h-20h30 | Học bài (**đi học** ở nhà) | Nhà, góc học nhóm trà sữa (học sinh lớp 9 mùa thi) |
| 20h-21h | **Chơi game** (có giới hạn) | Nhà, quán net (trước 22h) |
| 21h30 | **Ngủ** | Nhà |

Cuối tuần: sáng tập thể dục, chơi game, học bài; THCS có thể học thêm (tiểu học không học thêm môn văn hóa, chỉ nghệ
thuật, thể thao, kỹ năng sống). Nghỉ hè: thể dục và game nhiều hơn, sóng tan trường biến mất.

**"Trẻ em phải chăm chỉ học hành"** (Owner yêu cầu 7): mỗi em có thanh **Chăm học**; khu phố khen khi em lên lớp, đậu
vào 10 (loa đọc tên, nhóm cư dân thả tim, Ban công tác Mặt trận trao học bổng 18/11). Người chơi giúp được: giáo viên
dạy tốt, quán trà sữa mở góc học nhóm, nhân viên net từ chối học sinh giờ học, hàng xóm nhắc nhở.

### 7.3 Khô gà: ăn vụng và mua bằng tiền tiêu vặt (Owner yêu cầu 8)

- **Giàn phơi** ở sân sau Ba & Má có bảng **"GIÀN PHƠI · đừng ăn vụng"** (đã có trong bản đồ Ba & Má của Solo). Sân sau
  nhìn ra cổng trường.
- **Ăn vụng**: 16h45-17h30, biệt đội Cua (11), Bắp (9), Đậu (8) lẻn qua rào. Khô chưa ráo thì đau bụng → trạm y tế
  (học sinh có BHYT hỗ trợ 100%, nên bác sĩ Lâm cằn nhằn chứ không thu tiền).
- **Mua đàng hoàng**: Su (10) mua và ghi sổ chi tiêu. Ba & Má có thể ra **"gói học sinh"**: gói 30 g giá 10.000đ
  [số thiết kế], bán ở **cửa sổ sân sau** (trong nhà mình, không lấn vỉa hè, không bán đúng cổng trường giờ cao điểm
  6h30-7h30, vì công an và bảo vệ dân phố đang dẹp hàng rong cổng trường), và gửi bán ở tạp hoá cô Sáu.
- **Nếu người chơi làm ở Ba & Má**, mỗi chiều có ca "giàn phơi" với hai cách:
  - **Canh giàn**: mini-game soi đèn, dựng bù nhìn của Cô Tư, đuổi nhẹ (không ai bị đánh, chỉ "Cô Tư biết rồi nha!").
    Giữ hàng, Cô Tư +1 tim, tụi nhỏ "kình" vui với bạn.
  - **Bán cho tụi nhỏ**: mở cửa sổ gói học sinh, thu tiền tiêu vặt. Doanh thu +, tụi nhỏ +1 tim, ca đau bụng giảm. Chị Huệ
    (mẹ Su, Cân Đối) đòi hóa đơn.
  - Làm cả hai được: canh giờ 16h45, bán giờ 17h.
- Hậu quả lâu dài: nếu gói học sinh thành công, cô Hằng đưa vào danh mục chính thức (sản phẩm mới trong cửa hàng Ba & Má,
  nhắc lại trong nội dung Solo của Ba & Má nếu Owner muốn).

### 7.4 Trốn học đi net (Owner yêu cầu 11): luật thật áp dụng

- Quán net (điểm cung cấp dịch vụ trò chơi điện tử công cộng) **không hoạt động 22h-8h**, không phân biệt tuổi.
- Người dưới 18: nhà phát hành game giới hạn **60 phút/một game/ngày, 180 phút/ngày** (máy trong quán hiện cảnh báo).
- **Dự thảo** (chưa hiệu lực, 9/2026): không phục vụ dưới 16 tuổi từ 21h; dưới 16 tối đa 60 phút/ngày; UBND phường cấp và
  kiểm tra giấy phép. Game ghi rõ đây là dự thảo; có thể thành "luật mới" trong một năm game sau.
- Công an phường kiểm tra, tuyên truyền, nhắc chủ quán không để học sinh chơi trong giờ học. Ngoài đời, phạt mở quá giờ
  thường được kể là 3-5 triệu (lời kể, chưa có văn bản), dự thảo xử phạt đến 15 triệu với quán gần trường sai quy định.
- Vai và lựa chọn: xem drama 6 ở mục 8.

### 7.5 Đời sống trường học

- **Giờ**: cổng mở 6h30, tiết đầu 7h, chiều 13h-13h30, tan 16h-17h (không tan trước 16h), hai trường tan lệch giờ.
- **Nhóm phụ huynh** trên Xóm Ơi: phụ huynh đòi báo cáo chi tiết, nhắn tối muộn; có giáo viên bị chụp màn hình tin nhắn
  đăng lên mạng (ngoài đời). 70% giáo viên trong một khảo sát thấy áp lực từ phụ huynh. Trong game, áp lực thể hiện bằng
  tin nhắn sau 21h trừ năng lượng giáo viên, và nút "đề xuất khung giờ trả lời" ở họp phụ huynh.
- **Quỹ lớp**: nhiều trường TP.HCM không thu quỹ phụ huynh, chỉ góp khi cần (photo tài liệu, pin micro). Ban đại diện cha
  mẹ không được vận động tài trợ.
- **20/11**: ngành giáo dục TP.HCM nhiều năm không tổ chức tiếp khách, không nhận hoa quà, khuyến khích thiệp điện tử; nhiều
  trường xin chuyển hoa quà thành học bổng hoặc thẻ BHYT học sinh. Drama 20.
- **Thi vào 10** (TP.HCM 2026: 01-02/06; gần 170.000 học sinh lớp 9; chỉ tiêu công lập 118.955; tối đa 8 nguyện vọng):
  Tôm và Gạo (9A) có một **mùa ôn thi** kéo dài từ tháng 3: góc học nhóm, photo đề cương, cô Hoài dạy phụ đạo trong trường
  (tối đa 2 tiết/tuần/môn), không được dạy thêm có thu tiền chính lớp mình. Ngày có điểm: cả khu phố chờ loa.
- **Học bạ số**: giáo viên nhập điểm, nhận xét, ký số cuối kỳ (100% tiểu học, THCS từ năm học 2025-2026).
- **Khám sức khỏe đầu năm** ở trạm y tế; **khai giảng 5/9** (Event dựng sân khấu; làm quá phô trương thì phụ huynh hỏi quỹ).
- **Thiếu giáo viên** Tin, Mỹ thuật, Âm nhạc: cửa vào nghề giáo của người chơi (4.3).

### 7.6 Tụi nhỏ lớn lên

- Mỗi 5/9 trong game, mọi em lên một lớp. Lớp 9 thi vào 10 rồi học THPT ngoài khu phố (vẫn ở nhà, vẫn xuất hiện buổi tối).
- Khi một em tròn 18 tuổi trong game, em thành người lớn (được đi làm), nhưng **mang dấu "từng là trẻ em" vĩnh viễn: không
  bao giờ được đưa vào drama tình cảm**. Như vậy không có chuyện "chờ lớn rồi yêu".
- Thỉnh thoảng có gia đình mới chuyển tới (em mới, tuổi 6), để khu phố luôn có trẻ con.
- (Q5 ở mục 11: Owner có muốn tụi nhỏ lớn lên không, hay giữ tuổi mãi.)

### 7.7 Luật an toàn nội dung

1. Không có nội dung yêu đương, hẹn hò, "cặp đôi", tỏ tình nào liên quan người dưới 18, kể cả đùa. Trình kiểm tra
   `people.json` chặn mọi quan hệ romance/crush/ex chạm tới người dưới 18.
2. Quan hệ của trẻ chỉ có: gia đình, bạn bè, bạn cùng lớp, thầy cô, hàng xóm, "đối thủ" vui (Su và Ốc tranh hạng nhất).
3. Không bạo lực thật: "đánh ghen" = la lối, mượn loa, livestream, trà sữa đổ; không ai bị thương.
4. Không người thật, không thương hiệu thật, không nội dung thù ghét, không cà khịa nhóm yếu thế.
5. Rượu bia, cờ bạc: không bao giờ gắn với trẻ em; quán nhậu từ chối bán cho người dưới 18.

---

## 8. Drama khu phố "mất não" (Owner yêu cầu 6)

### 8.1 Luật viết drama

- Vui, kiểu phim giờ vàng: tình tiết quá đà, lời thoại sến, nhưng **không bạo lực thật**. "Đánh ghen" = la lối, mượn loa,
  livestream, trà sữa đổ.
- **Không bao giờ** có trẻ em trong chuyện yêu đương. Trẻ em chỉ xuất hiện khi đang ăn, ngủ, học, tập thể dục, chơi game.
- Không người thật, không thương hiệu thật, không nội dung thù ghét, không cà khịa người yếu thế.
- Hậu quả nhẹ, sửa được. Không ai mất nhà, mất việc vĩnh viễn, bị thương.
- Quan hệ ngầm của 7 công ty (TIES) dùng đúng nghĩa gốc. Drama dựa trên một quan hệ ngầm chỉ chạy khi quan hệ đó "đúng"
  trong lượt chơi này (xem Q2).

### 8.2 Hệ thống drama

- **Mồi châm**: một điều kiện (quan hệ tồn tại + thời điểm trong năm + một sự kiện kinh tế hoặc hành động của người chơi).
- **Hồi**: 2-4 hồi, mỗi hồi là một cảnh ở một nơi và giờ cụ thể, cách nhau 1-3 ngày.
- **Vai**: lựa chọn tùy người chơi đang là ai lúc đó (nhân viên quán nào, giáo viên, hàng xóm, phụ xe…) và đang đứng đâu.
  Không có mặt thì hồi đó tự diễn theo hướng mặc định và lên nhóm Xóm Ơi; hồi sau vẫn chọn được.
- **Hậu quả**: đổi độ thân, đổi quan hệ trong sơ đồ (rival thành friend, bỏ chữ "bí mật"), đổi kinh tế (giá, khách, sản
  phẩm mới), thêm món vào Biên bản khu phố, tin trên Xóm Ơi.
- **Nhịp**: tối đa 2 drama cùng lúc; khoảng 5 ngày game có một drama mới; mỗi năm ~20 trong 28 kịch bản chạy, phần còn lại
  để năm sau. Drama đã xong có thể có "phần 2" năm sau. Drama lỡ thì quay lại dạng "kể lại" (vẫn có một lựa chọn nhỏ).
- Mọi người và quan hệ dưới đây có trong `people.json` (quan hệ có `origin: "drama:<số>"`).

### 8.3 28 kịch bản

#### Drama 1: Mẹ chồng mở quán đối diện
- **Ai**: bà Cẩm (`kp:cam`), chị Nhung (`kp:nhung`), anh Định (`kp:dinh`), Mít (`kp:mit`, chỉ được uống nước).
- **Mồi châm**: chị Nhung tăng giá 3.000đ/ly sau sự kiện "bột béo tăng" và lỡ đăng fanpage chê cà phê cóc "cũ". Quan hệ mẹ chồng và nàng dâu.
- **Các hồi**: (1) Bảng "SẮP KHAI TRƯƠNG: TRÀ SỮA MẸ LÀM" dựng trước cà phê cóc. (2) Bà Cẩm bán 15.000đ "đường thật, không bột"; Full Topping mất 15% khách buổi sáng. (3) Bữa cơm Chủ nhật, anh Định phải uống hai ly cùng lúc trước điện thoại đang live của Út Mi. (4) Hòa hoặc chiến tranh lạnh.
- **Lựa chọn theo vai**: *Nhân viên trà sữa*: giảm giá theo / ra món khác biệt (trà xoài Sa Đéc) / mời bà Cẩm qua dạy món "kiểu xưa". *Làm ở cà phê cóc*: khuyên bà giữ cà phê, chỉ bán trà sữa buổi chiều. *Hàng xóm*: mở bình chọn trên Xóm Ơi (đổ dầu) / rủ hai bên ăn cơm tấm. *Bạn anh Định*: đứng giữa.
- **Hậu quả**: hòa thì có combo "cà phê sáng ở mẹ, trà sữa chiều ở dâu" (cả hai +10%); chiến thì giá chiến 2 tuần, lời mỏng, Xóm Ơi chia phe; độ thân với hai bên đổi.

#### Drama 2: Người yêu cũ ngày khai trương
- **Ai**: anh Hào (`kp:hao`), chị Nhung, anh Định, Út Mi (`bama:mi`).
- **Mồi châm**: Full Topping khai trương chi nhánh 2 (khi người chơi góp vốn hoặc làm quản lý). Quan hệ người yêu cũ bí mật Hào và Nhung.
- **Các hồi**: (1) Kệ hoa to nhất giữa cửa: "Chúc em mãi như xưa. H." (2) Út Mi live khai trương quay trúng tấm thiệp; Xóm Ơi đoán "H." là ai (Hưng? Hào? Huyền?). (3) Anh Hào tới đề nghị combo "giờ chơi + trà sữa", "chỉ là làm ăn"; anh Định đứng sau quầy với vẻ mặt bảo vệ cao ốc.
- **Lựa chọn theo vai**: *Quản lý*: gỡ thiệp trước giờ live / để nguyên / biến thành trò "đoán H. là ai, đúng được tặng ly". *Nhân viên net*: nhắc anh Hào. *Hàng xóm*: đính chính trên Xóm Ơi.
- **Hậu quả**: thành trò đoán thì khai trương +30% khách; combo ký thì net và trà sữa cùng lợi, nhưng anh Định −1 tim với người đề xuất; tấm thiệp vào Biên bản khu phố.

#### Drama 3: Đánh ghen bằng loa khu phố
- **Ai**: chị Ly (`kp:ly`), anh Mạnh (`kp:manh`), chị Mận (`kp:man`), chú Cường (`kp:cuong`).
- **Mồi châm**: chị Ly thấy biên lai tiệm tóc thứ Ba 15h, tuần nào cũng có. Quan hệ bí mật Mạnh và Mận.
- **Các hồi**: (1) Chị Ly hỏi khéo cả chợ. (2) Chị Ly mượn loa khu phố "thông báo việc gia đình"; chú Cường giật lại micro sau 7 giây. (3) Chị Ly tới tiệm tóc, ly trà sữa đổ lênh láng, khách livestream; tấm khăn mở ra: anh Mạnh nửa đầu đang nhuộm đen. (4) Anh Mạnh thú nhận sợ già trước vợ.
- **Lựa chọn theo vai**: *Thợ phụ tiệm tóc*: giữ bí mật khách / nhắn chị Ly "không phải đâu chị" / giấu anh Mạnh vào phòng gội. *Phục vụ quán nhậu*: nói thật hay kéo dài. *Giao trà sữa*: ly đổ là ly của bạn, đền hay không.
- **Hậu quả**: tiệm tóc có trào lưu "nhuộm kiểu anh Mạnh"; khu phố có quy định "loa không dùng việc riêng"; vợ chồng đi nhuộm chung (quán nhậu vui cả tuần).

#### Drama 4: Ba anh Lộc một cuốn sổ nợ
- **Ai**: chị Ly, anh Lộc Trend Trễ (`agency:loc`), anh Lộc Nợ Kỹ Thuật (`tech:loc`), anh Lộc Cân Đối (`audit:loc`), chị Diệp Cân Đối (`audit:diep`).
- **Mồi châm**: sau ngày lương, chị Ly đòi dòng "Lộc (trên lầu) 1.840.000đ". Quan hệ nợ.
- **Các hồi**: (1) Chị Ly gọi cả ba, ai cũng "không phải em". (2) Lộc Cân Đối đòi chứng từ; Lộc Nợ Kỹ Thuật đòi xem log camera; Lộc Trend Trễ nói "CPM đang cao". (3) Chị Diệp tick-mark 4 màu đối chiếu sổ với hóa đơn: là bàn chung tối thứ Sáu của cả ba.
- **Lựa chọn theo vai**: *Phục vụ*: từ nay ghi số điện thoại / chia đều / xóa nợ lấy lòng. *Thực tập ở một trong ba công ty*: bênh "anh Lộc của mình". *Làm ở Cân Đối*: tự soát sổ.
- **Hậu quả**: quán nhậu đổi luật ghi sổ (quỵt nợ giảm); "Hội Lộc" nhậu chung mỗi tháng; nếu quan hệ ngầm Lộc và Kiều đúng thì nối sang drama 5.

#### Drama 5: Vợ chồng bí mật lộ ở quán nhậu
- **Ai**: chị Kiều (`agency:kieu`), anh Lộc (`agency:loc`), chị Ly, Sương (`agency:suong`).
- **Mồi châm**: chỉ khi quan hệ ngầm "Anh Lộc và chị Kiều là vợ chồng, giấu cả công ty" đúng. Sau drama 4, chị Kiều tới: "Nợ của chồng chị bao nhiêu em?"
- **Các hồi**: (1) Sương ngồi bàn bên nghe hết. (2) 11 phút sau nhóm chat Trend Trễ nổ; anh Tùng nhắn "make it pop". (3) Sáng thứ Hai hai người tới công ty chung một xe.
- **Lựa chọn theo vai**: *Phục vụ*: nói nhỏ "để em ghi sổ riêng" (cứu bí mật) / đọc to. *Thực tập ở Trend Trễ*: ngăn Sương / im lặng / tổ chức "tiệc mừng cưới muộn".
- **Hậu quả**: đặt cờ cho nội dung Trend Trễ nếu người chơi đang thực tập ở đó; quán nhậu có "bàn đặt trước của vợ chồng giấu kín".

#### Drama 6: Trốn học đi net (Owner yêu cầu 11)
- **Ai**: Tôm (`kp:tom`, 14, 9A), Mít (`kp:mit`, 12), anh Hào, Pháo (`kp:phao`), cô Hoài (`kp:hoai`), anh Thuận (`kp:thuan`), anh Mạnh và chị Ly (bố mẹ Tôm), chị Nhung (mẹ Mít), chú Tình (`kp:tinh`), bà Phấn.
- **Mồi châm**: tuần trước thi học kỳ; Tôm thua trận xếp hạng tối qua; chú Tình thấy Tôm leo rào sau giờ ra chơi.
- **Các hồi**: (1) 9h30 Tôm và Mít vào Net Không Lag, nói "hôm nay trường nghỉ". (2) 10h cô Hoài điểm danh, nhắn phụ huynh; anh Mạnh đang ngủ (quán bán đêm). (3) 11h bà Phấn chụp hai đứa qua cửa kính, đăng nhóm cư dân; anh Thuận đi tuần ghé quán. (4) Hôm sau họp ba bên ở trường.
- **Luật thật dùng**: quán không hoạt động 22h-8h; người dưới 18 bị nhà phát hành giới hạn 60 phút/game/ngày và 180 phút/ngày; công an phường nhắc chủ quán không để học sinh chơi trong giờ học.
- **Lựa chọn theo vai**: *Nhân viên quán net*: hỏi tuổi và từ chối trong giờ học (doanh thu −, uy tín +) / cho chơi nhưng gọi trường / cho chơi im lặng (anh Thuận tới thì quán bị lập biên bản, bạn mất uy tín). *Giáo viên*: đi tìm / gọi phụ huynh / đề xuất "câu lạc bộ game sau giờ học" có giờ giấc do thầy Kiệt phụ trách. *Phụ huynh hàng xóm*: đánh thức anh Mạnh / dẫn tụi nhỏ về trường / nói chuyện với Tôm như người lớn. *Nhân viên trà sữa*: Mít gọi giao trà sữa tới quán net giờ học, từ chối giao. *Xe ôm*: chở Tôm về trường (chú Lương giảng một bài).
- **Hậu quả**: thanh Chăm học của Tôm và Mít; quán net dán nội quy "Học sinh: sau 16h30"; câu lạc bộ game của trường (nếu chọn) thành giải cuối tuần có giờ giấc; Xóm Ơi tranh cãi 2 ngày; nếu Tôm đậu vào 10, cả khu phố nhắc "vụ net".

#### Drama 7: Biệt đội khô gà (Owner yêu cầu 8)
- **Ai**: Cua (`kp:cua`, 11), Bắp (`kp:bap`, 9), Đậu (`kp:dau`, 8), Cô Tư (`bama:tu`), Chú Bảy (`bama:bay`), cô Hằng (`bama:hang`), bác Hùng, bác sĩ Lâm, anh Thuận (bố Cua), Su (`kp:su`, 10).
- **Mồi châm**: mẻ khô gà lá chanh mới lên giàn chiều thứ Năm. Quan hệ "kình vui" Cô Tư và Cua.
- **Các hồi**: (1) Hụt 3 bịch; Cô Tư dựng bù nhìn đội nón lá. (2) Bắp trốn sau thùng xe ba gác, Chú Bảy chở luôn về tận nhà. (3) Cua đau bụng (khô chưa ráo), bác sĩ Lâm khám; cô Hằng gọi phụ huynh, mà phụ huynh là… công an khu vực. (4) Ba & Má họp: ra gói học sinh.
- **Lựa chọn theo vai**: *Làm ở Ba & Má*: canh giàn / bán gói học sinh / cả hai; đề xuất giá gói (5.000, 10.000, 15.000đ). *Làm ở trạm y tế*: khám, dặn chỉ ăn khô đã ráo, báo phụ huynh. *Hàng xóm*: mách Cô Tư / dạy tụi nhỏ dành tiền tiêu vặt mua.
- **Hậu quả**: gói học sinh thành sản phẩm (kinh tế dòng 10); ca đau bụng giảm; Cua và Cô Tư thành "kình mà thân"; Biên bản khu phố: "Vụ bù nhìn đội nón lá".

#### Drama 8: Con nuôi của Chú Bảy
- **Ai**: Thông (`kp:thong`), Chú Bảy, anh Thịnh (`kp:thinh`), cô Lài, anh Thuận.
- **Mồi châm**: Thông xin làm bếp chính, cần bản sao giấy khai sinh và đăng ký tạm trú, đọc thấy dòng "cha nuôi". Quan hệ gia đình bí mật Bảy và Thông.
- **Các hồi**: (1) Thông hỏi cả khu phố: ai cũng biết, chỉ Thông không. (2) Anh Thịnh kể: 26 năm trước bố anh nhặt được một bé trong thùng xốp ghi "HÀNG DỄ VỠ" ở đầu mối, Chú Bảy xin về nuôi. (3) Thông giận, nghỉ nướng 2 ngày (cơm tấm khét). (4) Chú Bảy chở Thông bằng ba gác lên đầu mối lúc 3h sáng, chỉ chỗ cũ.
- **Lựa chọn theo vai**: *Đồng nghiệp cơm tấm*: đứng thay bếp (khét hay không tùy kỹ năng) / khuyên Thông. *Phụ Chú Bảy*: báo chú là Thông đã biết. *Làm ở đầu mối*: tìm lại cái thùng xốp (vẫn còn!).
- **Hậu quả**: Thông học lái ba gác (nối drama 11); cơm tấm thêm món "sườn Chú Bảy"; quan hệ bỏ chữ "bí mật".

#### Drama 9: Hai chị em thất lạc ở chợ
- **Ai**: Dì Chín (`kp:chin`), cô Mười (`kp:muoi`), chị Mận, cô Sáu (`bama:cosau`), chú Cường.
- **Mồi châm**: lấn ranh sạp 5 cm. Quan hệ đối thủ 30 năm.
- **Các hồi**: (1) Cãi nhau, rau đè lên đá cá. (2) Ở tiệm tóc, chị Mận gội cho hai người cùng ngày thứ Hai: cùng nốt ruồi sau tai, cùng một câu hát ru. (3) Cô Sáu nhớ trận lụt năm 1996, hai bé gái lạc ở bến đò. (4) Tấm ảnh cũ ở hai nhà là hai nửa của một tấm.
- **Lựa chọn theo vai**: *Phụ sạp*: tiếp tục kẻ vạch phấn / mang tấm ảnh tới. *Thợ tiệm tóc*: kể hay giữ bí mật khách. *Cộng tác viên khu phố*: đọc loa thông báo hay để hai người tự nói.
- **Hậu quả**: hai sạp gộp thành "Rau Cá Chín Mười" (combo nấu canh chua); Gạo có thêm dì; chợ có một ngày vui (khách +20%).

#### Drama 10: Tráo nhầm ở trạm y tế
- **Ai**: anh Khôi (`kp:khoi`), anh Hào, bà Phấn (`kp:phan`), ông Thanh (`kp:thanh`), bác sĩ Lâm (`kp:lam`).
- **Mồi châm**: bác sĩ Lâm số hóa sổ sinh cũ, đọc nhầm ra loa: "hai bé trai cùng đêm năm 1992, vòng tay bị đổi 2 tiếng".
- **Các hồi**: (1) Xóm Ơi nổ; bà Phấn nhìn anh Hào thật lâu. (2) Hai nhà "thử" con bên kia: anh Khôi hát karaoke hay bất ngờ ở nhà ông Thanh; anh Hào quản trị nhóm cư dân giỏi bất ngờ. (3) Sổ ghi chú của y tá trực năm đó: vòng tay đã đổi lại sau 2 tiếng.
- **Lựa chọn theo vai**: *Nhân viên trạm y tế*: tìm sổ ghi chú / để mọi người vui thêm vài ngày. *Nhân viên tiện lợi hoặc net*: làm cầu nối hai anh. *Hàng xóm*: bình chọn "ai giống ai".
- **Hậu quả**: hai nhà thành "thông gia danh dự", karaoke chung tối thứ Bảy (ông Thanh bớt hát một mình, giúp drama 16); Khôi và Hào từ đối thủ thành bạn.

#### Drama 11: Tranh thừa kế xe ba gác
- **Ai**: Chú Bảy, Kevin Tuấn (`bama:tuan`), Út Mi, Cậu Tám (`bama:cautam`), Thông.
- **Mồi châm**: Chú Bảy nói đùa "năm sau chú về quê, ba gác để cho đứa nào chở giỏi nhất".
- **Các hồi**: (1) Kevin làm slide "Ba Gác Express". (2) Út Mi muốn sân khấu live lưu động; Cậu Tám muốn chở mối thịt. (3) Cuộc thi chở 20 thùng khô qua hẻm 7 ngập.
- **Lựa chọn theo vai**: *Phụ Chú Bảy*: làm trọng tài / thi luôn (nếu đã học lái) / bày Thông bí kíp. *Làm ở Ba & Má*: chọn phe Kevin hoặc Mi.
- **Hậu quả**: Chú Bảy không về quê ("năm nào cũng là năm sau"); người thắng chạy tuyến chiều, giá giao hàng chiều đổi; Kevin hiểu ra phải học lái trước khi làm app.

#### Drama 12: Di chúc của cô Ba Lành
- **Ai**: cô Ba Lành (`kp:lanh`), anh Kha, chị Trâm, chị Tuyết (`tm:tuyet`), người thuê (có bạn).
- **Mồi châm**: "di chúc" trong ghi chú điện thoại của cô Ba (rất khỏe) bị lộ: để một phòng cho "người thuê trả tiền đúng hạn nhất".
- **Các hồi**: (1) Cả dãy đóng tiền sớm, có người đóng trước 3 tháng. (2) Anh Kha muốn sơn pastel và tăng giá; cô Ba: "chừng nào má chết". (3) Chị Tuyết ghé: 20 năm trước thuê phòng 3 làm văn phòng đầu tiên, còn nợ một tháng điện, trả bằng một buổi "tư vấn chiến lược" cho dãy trọ.
- **Lựa chọn theo vai**: *Người thuê*: thi đóng sớm / khuyên cô làm di chúc đúng thủ tục (thông tin giải trí) / đứng về phía anh Kha. *Thực tập ở T&M*: soạn slide cho dãy trọ.
- **Hậu quả**: dãy trọ sơn lại (tiền phòng +200.000đ hoặc giữ nguyên tùy phe); phòng 3 thành "phòng lịch sử T&M" (nối câu đùa tên khu phố).

#### Drama 13: Hôn ước trên tờ giấy ăn
- **Ai**: Bảo (`tm:bao`), Như (`kp:nhu`), chú Lương (`kp:luong`).
- **Mồi châm**: chỉ khi quan hệ ngầm "Bảo là con của bác tài xế cũ của chị Tuyết" đúng. Chú Lương tìm thấy tờ giấy ăn năm 2006: hai ông bố tài xế hứa gả con cho nhau.
- **Các hồi**: (1) Chú Lương đưa tờ giấy cho Như ở ca đêm tiện lợi; Như cười. (2) Bảo mua mì ly lúc 1h sáng, được chú Lương "chở miễn phí, nói chuyện chút". (3) Cả hai (đều đã lớn, đều có kế hoạch riêng) cùng xé tờ giấy… nhưng chú Lương đã photo ở Photo Thần Tốc.
- **Lựa chọn theo vai**: *Nhân viên tiện lợi*: che cho Như / làm mai (cả hai từ chối, bạn −1 tim mỗi bên). *Xe ôm*: chở Bảo đường vòng cho chú Lương nói hết. *Thực tập ở T&M*: Bảo hỏi ý bạn.
- **Hậu quả**: Bảo và Như thành bạn; tờ giấy được đóng khung ở cà phê cóc; chú Lương giảm giá cho Bảo trọn đời.

#### Drama 14: Livestream lỡ bật
- **Ai**: Út Mi, Kevin Tuấn, cô Hằng, chị Mận.
- **Mồi châm**: Út Mi gội đầu ở tiệm, điện thoại đang live kênh Ba & Má úp trên ghế.
- **Các hồi**: (1) 2.000 người xem nghe Mi kể chuyện nhà: nếu quan hệ ngầm đúng thì là chuyện Kevin vay tiền chạy quảng cáo hoặc Mi sắp làm KOC tự do; nếu không, là chuyện Ba giấu khô ngon trong két. (2) Cô Hằng đang xem. (3) Đơn hàng tăng vọt vì "chân thật".
- **Lựa chọn theo vai**: *Thợ tiệm tóc*: lật điện thoại tắt live / để chạy / chen "tiệm tóc Đẹp Mỗi Ngày xin chào". *Làm ở Ba & Má*: biến thành flash sale. *Hàng xóm*: chụp màn hình gửi Xóm Ơi.
- **Hậu quả**: Ba & Má +đơn 3 ngày; cờ "đã lộ" cho nội dung Ba & Má; tiệm tóc thêm khách trẻ.

#### Drama 15: Bà Thắm Sa Đéc lên phố
- **Ai**: bà Thắm (`kp:tham`), bác Hùng (`bama:hung`), cô Hằng, Cô Tư, cô Sáu.
- **Mồi châm**: chỉ khi quan hệ ngầm "Công thức gia truyền của Ba học từ một bà bán khô ở Sa Đéc" đúng. Cô Sáu nhận gửi bán một mẻ khô Sa Đéc, vị y chang Ba & Má.
- **Các hồi**: (1) Bác Hùng tránh đi chợ 3 ngày. (2) Cô Tư tổ chức nếm khô bịt mắt giữa chợ. (3) Bà Thắm không đòi tiền, chỉ muốn "ghi tên tui một dòng nhỏ trên bao bì".
- **Lựa chọn theo vai**: *Làm ở Ba & Má*: thuyết phục Ba ghi tên / im. *Phụ sạp*: làm trọng tài nếm. *Trà sữa*: ra "Trà xoài Sa Đéc" tôn vinh bà.
- **Hậu quả**: bao bì mới "Công thức học từ bà Thắm, Sa Đéc", Ba & Má được khen; bà Thắm thành nhà cung cấp mùa Tết.

#### Drama 16: Đêm karaoke vô tận
- **Ai**: ông Thanh, cô Hoài, chú Cường, anh Thuận, anh Hào.
- **Mồi châm**: tuần chấm bài giữa kỳ; nhà cô Hoài sát vách.
- **Các hồi**: (1) 21h-0h ông Thanh hát; cô Hoài chấm sai 3 bài. (2) Xóm Ơi chia phe "để ông vui" và "để người ta ngủ". (3) Chú Cường nhắc lần ba; anh Thuận giải thích: từ 15/12/2025 không còn khung giờ 22h-6h, gây ồn ảnh hưởng chung bất kể giờ nào có thể bị cảnh cáo hoặc phạt 500.000-1.000.000đ, cần ghi âm, ghi hình làm chứng cứ. (4) Hóa ra ông Thanh chỉ muốn được làm MC.
- **Lựa chọn theo vai**: *Hàng xóm*: ghi âm gửi công an / mang trà sữa qua nói chuyện / tặng ông tai nghe. *Cộng tác viên khu phố*: đề cử ông làm MC Ngày hội 18/11. *Giáo viên*: chấm bài ở góc học nhóm trà sữa.
- **Hậu quả**: ông Thanh làm MC Ngày hội (tranh micro với anh Duy, nối drama 17); giấc ngủ của người chơi không còn bị trừ; Biên bản khu phố.

#### Drama 17: Cặp MC đám cưới tái xuất
- **Ai**: anh Vũ (`kp:vu`), chị Huyền (`kp:huyen`), anh Duy và chị Lan (`event:duy`, `event:lan`), anh Toàn (`event:toan`), ông Thanh, Chú Bảy.
- **Mồi châm**: anh Vũ và chị Huyền cưới trong hẻm 7; anh Toàn lo hậu cần giá người quen. Quan hệ ngầm "Anh Duy và chị Lan từng là một cặp MC đám cưới" nếu đúng thì hồi 2 có thêm chuyện cũ.
- **Các hồi**: (1) Chở bàn ghế bằng ba gác dưới mưa. (2) Anh Duy và chị Lan tái hợp MC (chị Lan đòi tập 3 lần; nhắc vụ múa lân người đầu người đuôi). (3) Ông Thanh giành micro "một bài thôi".
- **Lựa chọn theo vai**: *Phụ ba gác*: chở kịp trước mưa. *Làm ở Đi Đâu Cũng Được*: dựng rạp. *Phục vụ*: bưng mâm. *Hàng xóm*: chia micro cho ông Thanh một bài.
- **Hậu quả**: Event có hợp đồng đám cưới hẻm; anh Vũ chở bạn miễn phí 1 tuần; ông Thanh và anh Duy làm hòa.

#### Drama 18: Đêm say quên đường về (Owner yêu cầu 13)
- **Ai**: anh Thạc (`tech:thac`), anh Mạnh, chú Lương, anh Định, Chú Bảy.
- **Mồi châm**: thứ Sáu; anh Thạc chưa ngủ từ thứ Ba, nhậu mừng deploy.
- **Các hồi**: (1) 22h30 anh Thạc đòi tự chạy xe về. (2) Được chở tới cao ốc, bấm nhầm tầng, ngủ trong thang máy tầng 5 (Cân Đối). (3) 5h sáng anh Định tìm thấy; Chú Bảy chở anh về nhà giữa hai thùng khô gà.
- **Lựa chọn theo vai**: *Phục vụ quán nhậu*: giữ chìa khóa xe và gọi xe ôm (luật: xe máy mức 1 phạt 2-3 triệu, trừ 4 điểm, có thể tạm giữ xe tới 7 ngày) / để anh tự đi (sự kiện kiểm tra nồng độ cồn). *Xe ôm*: chở tới đâu khi khách không nhớ tầng. *Trực thay anh Định ở sảnh*: gọi ai.
- **Hậu quả**: anh Thạc +tim với bạn; quán nhậu treo bảng "Giữ chìa khóa giúp bạn"; Cân Đối có chuyện "người lạ trong thang máy".

#### Drama 19: Cân điêu ở sạp thịt
- **Ai**: anh Phú (`kp:phu`), Cậu Tám, cô Lài, bà Phấn, Thông.
- **Mồi châm**: Thông cân lại 10 ký sườn, ra 9.
- **Các hồi**: (1) Bà Phấn đăng clip lên Xóm Ơi. (2) Anh Phú nói cân hỏng; Cậu Tám bênh hơi nhiệt tình. (3) Nếu quan hệ ngầm "Cậu Tám ăn hoa hồng của mối thịt" đúng thì lộ luôn chuyện hoa hồng; nếu không, chỉ là cái cân bị "độ".
- **Lựa chọn theo vai**: *Phụ sạp anh Phú*: sửa cân / tố cáo / im lặng. *Làm ở cơm tấm*: đổi mối (đắt hơn 5%) hay cho anh Phú cơ hội. *Làm ở Ba & Má*: báo cô Hằng.
- **Hậu quả**: chợ có lại "cân đối chứng"; giá thịt mối mới; uy tín anh Phú giảm, hồi lại sau 30 ngày bán đúng cân.

#### Drama 20: Nhóm phụ huynh lúc 23 giờ (Owner yêu cầu 7)
- **Ai**: cô Đào (`kp:dao`), chị Huệ (`audit:hue`, mẹ Su), chị Thủy (`kp:thuy`, mẹ Ốc), cô Xuân (`kp:xuan`), Su, Ốc.
- **Mồi châm**: tuần trước 20/11; chị Huệ lập bảng tính "quỹ quà 20/11", nhắn lúc 23h.
- **Các hồi**: (1) 47 tin nhắn sau 21h; cô Đào trả lời tới 0h. (2) Cô Xuân nhắc trường không nhận hoa quà; chị Thủy đề xuất chuyển thành học bổng hoặc thẻ BHYT học sinh. (3) Chị Huệ soát quỹ như soát timesheet, phát hiện lệch 12.000đ (tiền photo).
- **Lựa chọn theo vai**: *Giáo viên*: từ chối quà, chuyển học bổng / im lặng / đề xuất khung giờ trả lời. *Phụ huynh hàng xóm*: ủng hộ phe học bổng. *Làm ở photo*: in biên nhận 12.000đ.
- **Hậu quả**: lớp 5A có "giờ yên tĩnh sau 21h"; có quỹ học bổng 20/11 (uy tín khu phố +); Su và Ốc vẫn tranh hạng nhất, không dính chuyện người lớn.

#### Drama 21: Lá thư trong máy photocopy
- **Ai**: chú Tấn (`kp:tan`), cô Nga (`kp:nga`), chú Cường, chị Nhung.
- **Mồi châm**: chú Tấn thay máy photo cũ; trong khay là lá thư năm 1989 gửi "Nga", chưa từng gửi.
- **Các hồi**: (1) Máy cũ in thử, lá thư in nhầm mặt sau 500 tờ rơi trà sữa. (2) Cả khu phố đọc: "Nga" là ai? (3) Cô Nga nhận ra nét chữ; chú Tấn trốn trong tiệm 2 ngày.
- **Lựa chọn theo vai**: *Phát tờ rơi*: thu hồi / phát tiếp. *Làm ở photo*: giữ bí mật / đưa thư tận tay. *Cộng tác viên khu phố*: rủ hai người cùng dựng Ngày hội.
- **Hậu quả**: tờ rơi trà sữa hiệu quả gấp 3 trong tuần đó; hai người ngoài 50 tuổi uống cà phê cóc mỗi sáng; Biên bản khu phố.

#### Drama 22: Giả nhân viên điện lực
- **Ai**: cô Ba Lành, chị Oanh (`kp:oanh`), anh Vĩnh (`kp:vinh`), anh Kha.
- **Mồi châm**: cuộc gọi "điện lực đây, chuyển khoản ngay không cắt điện chiều nay" (hiện tượng lừa đảo có thật, ngành điện đã cảnh báo).
- **Các hồi**: (1) Cô Ba định chuyển 3 triệu. (2) Người chơi ở trọ nghe được. (3) Chị Oanh xác nhận: thông báo tiền điện qua app chăm sóc khách hàng và tổng đài chính thức; cắt điện không khẩn cấp phải báo trước ít nhất 5 ngày.
- **Lựa chọn theo vai**: *Người thuê*: lịch sự giữ điện thoại / gọi anh Kha / dẫn cô ra phòng giao dịch. *Làm ở điện lực*: dán thông báo cảnh báo khắp hẻm.
- **Hậu quả**: cô Ba +2 tim (giảm tiền phòng 1 tháng hoặc tha nợ điện); loa phát tin cảnh báo; drama 23 dễ hòa hơn.

#### Drama 23: Đại chiến tiền điện 4.000 đồng
- **Ai**: cô Ba Lành, anh Kha (`kp:kha`), anh Vĩnh, người thuê trọ (có bạn).
- **Mồi châm**: hóa đơn tháng ghi 4.000đ/số; anh Vĩnh ghé ghi chỉ số.
- **Các hồi**: (1) Anh Vĩnh giải thích Nghị định 133/2026 (từ 25/05/2026): thu cao hơn giá quy định bị phạt 20-30 triệu và hoàn chênh lệch; cứ 4 người tính 1 hộ để có định mức. (2) Cô Ba giảm giá điện, anh Kha đề xuất tăng tiền phòng 200.000đ. (3) Họp dãy trọ.
- **Lựa chọn theo vai**: *Người thuê*: đăng ký tạm trú để tính giá hộ / thương lượng giữ tiền phòng / phản ánh tổng đài (cô Ba buồn). *Làm ở điện lực*: hướng dẫn kê khai số người.
- **Hậu quả**: tiền điện của bạn giảm từ ~360.000đ xuống ~185.000đ/tháng; tiền phòng có thể tăng; độ thân với cô Ba tùy cách làm.

#### Drama 24: Bão 1 sao ngày mua 1 tặng 1
- **Ai**: chị Nhung, Sương (`agency:suong`), Út Mi, chị Kiều (`agency:kieu`), bà Phấn.
- **Mồi châm**: chọn kênh "khai trương mua 1 tặng 1" mà không giới hạn số khách.
- **Các hồi**: (1) Hàng dài tới cổng trường, chờ 40 phút. (2) 60 đánh giá 1 sao trong 2 giờ. (3) Bà Phấn kêu cư dân chấm 5 sao "bênh quán nhà"; Út Mi được mời review.
- **Lựa chọn theo vai**: *Quản lý*: xin lỗi công khai + phiếu mời lại / đóng cửa sớm 1 tiếng / báo cáo đánh giá ảo. *Làm ở Trend Trễ*: viết thông cáo. *KOC*: Mi review thật lòng.
- **Hậu quả**: sao xuống rồi lên tùy cách xử lý; Sổ tay ghi "giới hạn 50 khách đầu"; chị Kiều muốn quản lý Út Mi (nối quan hệ ngầm "Út Mi sắp làm KOC tự do" nếu đúng).

#### Drama 25: Ba chị Diệp
- **Ai**: chị Diệp Nợ Kỹ Thuật (`tech:diep`), chị Diệp Trend Trễ (`agency:diep`), chị Diệp Cân Đối (`audit:diep`), chị Hồng (`agency:hong`), chị Mận.
- **Mồi châm**: chị Mận treo tấm ảnh sinh nhật năm 1998: ba bé gái, áo ghi "DIỆP".
- **Các hồi**: (1) Tin đồn "sinh ba thất lạc". (2) Ba chị gặp nhau ở tiệm: một người cầm 3 điện thoại, một người tick-mark 4 màu, một người nói framework. (3) Chị Hồng (chị ruột chị Diệp Trend Trễ) kể: ba bé tên Diệp vì cùng xem một bộ phim năm đó; ảnh là sinh nhật chung lớp mẫu giáo.
- **Lựa chọn theo vai**: *Thợ tiệm tóc*: dàn dựng cuộc gặp / để tin đồn tự tắt. *Thực tập ở một trong ba công ty*: giúp chị Diệp của mình "điều tra". *Làm ở Cân Đối*: đối chiếu giấy tờ.
- **Hậu quả**: lập "Hội Diệp" họp mỗi quý; tiệm tóc thêm 3 khách trung thành.

#### Drama 26: Bí mật can nước mắm
- **Ai**: cô Lài (`kp:lai`), bà Cẩm, Thông, anh Đạt (`tm:dat`), cô Sáu.
- **Mồi châm**: bà Cẩm bán thêm "cơm sáng"; nước mắm y chang Cô Lài.
- **Các hồi**: (1) Cô Lài nghi Thông lộ công thức (Thông hay ăn sáng ở cà phê cóc). (2) Anh Đạt đến "chạy retrospective" miễn phí, dán giấy nhớ lên nồi. (3) Cả hai mua cùng một loại can nước mắm ở tạp hoá cô Sáu; "bí mật" là đường thốt nốt, cô Lài có, bà Cẩm không.
- **Lựa chọn theo vai**: *Làm ở cơm tấm*: bênh Thông / thử nếm mù / nhờ anh Đạt (nhận 3 vòng "vài ý nhỏ"). *Làm ở cà phê cóc*: khuyên bà Cẩm đừng bán cơm.
- **Hậu quả**: cô Lài ghi "nước mắm đường thốt nốt" lên bảng (khách +); anh Đạt có "case study agile thành công"; Thông được tin lại.

#### Drama 27: Kevin vay nóng
- **Ai**: Kevin Tuấn, anh Thịnh, cô Hằng, anh Lộc Trend Trễ.
- **Mồi châm**: chỉ khi quan hệ ngầm "Kevin lén vay tiền chạy quảng cáo" đúng. Quảng cáo cháy ngân sách, anh Lộc báo "CPM đang cao", anh Thịnh nhắn đòi nợ.
- **Các hồi**: (1) Anh Thịnh đề nghị trừ nợ bằng khô gà. (2) Kevin nhờ người chơi chở 20 bịch khô ra đầu mối lúc 5h, trước khi Má dậy. (3) Má đếm kho.
- **Lựa chọn theo vai**: *Làm ở Ba & Má*: giúp Kevin / báo Má / đề xuất trả góp từ lương. *Làm ở đầu mối*: nhận khô hay đòi tiền mặt. *Làm ở Trend Trễ*: tối ưu lại quảng cáo cho Kevin.
- **Hậu quả**: khô Ba & Má có mặt ở đầu mối (kênh bán sỉ mới); chuyện lộ hay không tùy lựa chọn (cờ cho nội dung Ba & Má).

#### Drama 28: Săn đầu người thầy giáo Tin
- **Ai**: thầy Kiệt (`kp:kiet`), anh Tuấn (`hr:tuan`), chị Hạnh (`hr:hanh`), thầy Đức (`kp:duc`), anh Hào.
- **Mồi châm**: giữa năm học, trung tâm tư cần giáo viên Tin; HR và Săn Đầu Pro cùng săn.
- **Các hồi**: (1) Hai lời mời; thầy Kiệt muốn tiền nhưng thương học trò. (2) Anh Hào mời thầy làm huấn luyện viên giải net cuối tuần. (3) Thầy Đức hỏi người chơi (nếu hồ sơ có Nợ Kỹ Thuật ≥ 20 ngày): "em dạy hợp đồng thay được không?"
- **Lựa chọn theo vai**: *Làm ở HR*: giành ứng viên (phí cao) / khuyên thầy ở lại và dạy buổi tối hợp lệ (báo hiệu trưởng, không thu tiền học sinh lớp mình). *Có hồ sơ Tech*: nhận dạy hợp đồng (mở nghề giáo). *Nhân viên net*: ủng hộ câu lạc bộ game có giờ giấc (nối drama 6).
- **Hậu quả**: thầy Kiệt ở lại và dạy thêm hợp lệ, hoặc đi và trường thiếu người (cửa cho người chơi); HR được hoặc mất phí; câu lạc bộ game.

---

## 9. Lịch khu phố (chạy mãi, năm sau khác năm trước)

### 9.1 Nhịp tuần

| Ngày | Khu phố |
|---|---|
| Thứ Hai | Chợ đông nhất sáng sớm; tiệm tóc nghỉ sáng; văn phòng họp đầu tuần, thang máy kẹt nặng |
| Thứ Ba | Thầy Nhân dạy bóng chiều ở sân chơi; chị Mận nghe nhiều tin nhất (khách quen) |
| Thứ Tư | Ngày "giao hàng lớn" của đầu mối; Ba & Má phơi mẻ lớn |
| Thứ Năm | Thầy Nhân dạy bóng; mẻ khô mới lên giàn (mồi drama 7) |
| Thứ Sáu | Đánh giá tuần ở 7 công ty; 18h quán nhậu "dô dô"; xe ôm cuốc đêm |
| Thứ Bảy | Đám cưới hẻm, giải net 18h-22h, khách tiệm tóc; giờ cao điểm điện vẫn tính |
| Chủ nhật | Không có giờ cao điểm điện; cơm chung ở văn phòng khu phố; Hưng gọi về cho Cô Bánh Mì; họp khu phố Chủ nhật đầu tháng [số thiết kế] |

### 9.2 Nhịp tháng

- **Ngày 30**: 7 công ty trả lương → **ngày 1-5** chi tiêu +15%, quán nhậu đòi sổ nợ.
- **Ngày 5**: tiền trọ, điện, nước. **Ngày 10**: thông báo tiền điện qua app. **Ngày 15**: tiền điện thoại.
- **Mùng 1 và Rằm** âm lịch: cơm chay, hoa quả, thắp nhang Thần Tài ở mọi quán.
- **Cúp điện theo lịch**: mỗi tháng 0-2 lần ngẫu nhiên, **báo trước ít nhất 5 ngày, đăng 3 ngày liền**; sự cố thì cắt ngay báo sau.
- **Họp khu phố** Chủ nhật đầu tháng: chú Cường đọc tin, xử lý 1 kiến nghị (vỉa hè, tiếng ồn, rác).

### 9.3 Năm (ví dụ năm đầu, bắt đầu từ tháng 11/2026)

| Tháng | Cố định | Mùa / thời tiết |
|---|---|---|
| 11 | 01/11 giá điện mới (sinh hoạt còn 5 bậc); **18/11 Ngày hội Đại đoàn kết** ở khu dân cư; **20/11** Ngày Nhà giáo | Mưa kết thúc sớm nửa đầu tháng 11 (dự báo 2026); triều cường đỉnh tháng 10-11 |
| 12 | Công an phường kiểm tra tạm trú; kiểm tra an toàn thực phẩm trước Tết; mùa kiểm toán cuối năm ở Cân Đối; Giáng sinh | Mùa khô, mát |
| 1 | **01/01**: lương tối thiểu vùng mới, thuế bia tăng 5%; **31/01** hạn thông báo doanh thu năm trước; 23 tháng Chạp đưa ông Táo | Khô |
| 2 | **Tết Đinh Mùi: mùng 1 = 06/02/2027** (giao thừa 05/02), nghỉ Tết hưởng lương 5 ngày; trước Tết chợ đầu mối hàng tăng 60-600%; Rằm tháng Giêng | Khô |
| 3 | Bắt đầu mùa ôn thi vào 10; 8/3 | **Nắng nóng** 3-4 |
| 4 | 30/4 và 1/5 nghỉ | Nắng nóng, thiếu đá |
| 5 | Photo kín đơn đề cương | **Mùa mưa** bắt đầu (tháng 5-11) |
| 6 | 1/6 Thiếu nhi; **thi vào 10** (năm 2026 là 01-02/06); thi tốt nghiệp THPT (2026: 11-12/06); nghỉ hè | Mưa, rau tăng 20-25% |
| 7 | **01/07**: lương cơ sở mới (2026: 2.530.000đ), BHYT hộ gia đình đổi; truy lĩnh phụ cấp giáo viên; có điểm thi | Mưa |
| 8 | Rằm tháng 7 (Vu Lan) | Mưa |
| 9 | 2/9; **5/9 khai giảng**, tụi nhỏ lên lớp; **Trung thu** (2026 là 25/09) | Mưa tăng mạnh |
| 10 | 20/10 | Triều cường, ngập hẻm 7 |

### 9.4 Làm sao để năm nào cũng khác

- **Cố định** (lễ, ngày luật đổi) luôn có, như cột mốc.
- **Bộ bài mùa**: mỗi mùa có 8 sự kiện, rút 3 (ví dụ mùa mưa: "cây đổ ở hẻm 42", "đơn app gấp đôi", "sốt xuất huyết", "ngập
  đúng ngày cưới", …).
- **Bộ bài cú sốc giá**: mỗi năm rút 2-3 (heo, cà phê, gas, xăng, bột béo…).
- **Drama**: mỗi năm ~20 trong 28 chạy theo quan hệ đang có; drama xong có "phần 2" năm sau (năm 2 mẹ chồng nàng dâu hợp tác
  mở quán thứ ba; năm 2 "Hội Lộc" có anh Lộc thứ tư chuyển tới).
- **Khu phố đổi**: mỗi năm 1-2 cơ sở đổi mô hình (photo thêm góc cà phê; chuỗi trà sữa giá rẻ "Kem Ly 10K" mở rồi đóng), một gia
  đình chuyển tới, một gia đình chuyển đi (không phải nhân vật chính).
- **"Năm luật mới"**: mỗi năm game có 1-2 thay đổi lấy từ lộ trình hay dự thảo có thật (thuế bia +5% mỗi năm tới 90% năm 2031; giờ
  net cho dưới 16 tuổi nếu dự thảo thành luật; shipper khu trung tâm dùng xe điện từ 2028; đề xuất nâng ngưỡng thuế hộ lên 2-2,5 tỷ).
  Luôn ghi "trong game".
- **Thời tiết năm**: năm mưa nhiều hay ít, năm nóng hay mát.
- **Tụi nhỏ lớn lên** (nếu Owner đồng ý, Q5).

---

## 10. Lộ trình làm

### Giai đoạn 1: "Một con phố, một ly trà sữa"

Mục tiêu: chơi được một vòng ngày đầy đủ quanh một nghề, có hồ sơ và kinh tế thật.

1. Thẻ "Khu phố T&M" trên menu chính (nhãn "Bản thử"), thư mục riêng `site/js/khupho/`, không đụng Solo và Multiplayer.
2. **Trang sơ đồ quan hệ tương tác** từ `people.json` cho Owner xem (Owner yêu cầu 5): lọc theo nhóm, bấm một người thấy mọi sợi dây,
   bật/tắt quan hệ bí mật, lọc theo drama.
3. **Con phố đi bộ được**: đủ 32 nơi có mặt tiền và bảng tên; vào được bên trong: phòng trọ, Trà Sữa Full Topping, chợ, đầu mối,
   tiện lợi, photo, cửa hàng Ba & Má. Nơi khác: NPC đứng trước cửa nói chuyện, bảng "Sắp tuyển".
4. **Phòng trọ** + đồng hồ + 4 chỉ số + ăn uống (bảng 3.3) + đi bộ (xe ôm làm sau) + ngủ + màn hình "Tối nay ở phòng trọ" + hóa đơn tháng.
5. **Nghề trà sữa đủ 5 bậc** (học việc tới quản lý; mở quán riêng để giai đoạn 2): ca, 8 món, kho, hạn dùng trân châu.
6. **Nhập hàng** 5 nhà cung cấp; **8 kênh truyền thông**; **bảng P&L** và **thuế hộ kinh doanh 2026**.
7. **Hồ sơ cá nhân** đầy đủ trường, nhập lịch sử Solo, lưu đám mây (mở rộng `validateProfile`/`mergeProfiles`).
8. **Kinh tế cơ bản**: chỉ số giá, 5 nhóm khách, thời tiết, ngày lương, cúp điện theo lịch; các dòng 3, 4, 5, 7, 9, 13, 15, 16, 17, 23,
   27 của bảng 6.6 (những dòng chạm tới trà sữa).
9. **Nhóm cư dân Xóm Ơi** với tin tự sinh từ sự kiện; một sự kiện drama nhỏ ở quán (drama 24, bão 1 sao).

**Kiểm thử nghiệm thu giai đoạn 1** (đều phải tự động hóa được, giống `npm test` và e2e hiện có):

| # | Kiểm thử | Đạt khi |
|---|---|---|
| T1 | Không ảnh hưởng chế độ cũ | `npm test`, `validate-companies`, e2e Solo và legacy vẫn qua |
| T2 | Đi tới được mọi nơi | Kiểm tra kiểu `map-reach`: từ cửa phòng trọ đi bộ tới cửa của cả 32 nơi |
| T3 | Ly đúng công thức | Với khóa đáp án debug (như `__miniDebug`), bot chơi hoàn hảo 1 ca đạt điểm A; sai % đường 1 nấc thì trừ đúng nửa điểm |
| T4 | Trừ kho đúng định lượng | 10 ly truyền thống trừ đúng 150 g trà, 200 g đường, 600 g bột béo; hết bột béo thì món dùng bột tự xám |
| T5 | Hạn dùng trân châu | Trân châu nấu lúc 9h, tới 17h01 thành "cứng", ly dùng nó bị trừ điểm; đổ bỏ cuối ca vào hao hụt |
| T6 | Giao hàng nhà cung cấp | Đặt đầu mối trước 22h thì hàng tới 6h hôm sau; chợ có ngay; Ba & Má tới trong chiều; app sỉ 1-2 ngày |
| T7 | Công thức đơn app | Đơn 38.000đ, chiết khấu 25%, voucher 5.000đ → thực nhận đúng 22.550đ (38.000 − 9.500 − 950 − 5.000) |
| T8 | P&L ví dụ | Đưa vào dữ liệu ngày ở mục 4.2.i, bảng ra đúng từng dòng và lời ~1.324.100đ |
| T9 | Thuế | Doanh thu cộng dồn năm ≤ 1 tỷ: không trừ thuế, có nhắc 31/01; vượt 1 tỷ: bật sự kiện, trừ 4,5% từ kỳ sau |
| T10 | Hồ sơ không giảm | Gộp hai bản lưu (máy A 12 ngày, máy B 9 ngày cùng `entryId`) ra 12; khóa `kp` còn nguyên sau `validateProfile` |
| T11 | Mã lưu 8 ký tự | Tạo mã ở máy A, nhận ở máy B: hồ sơ cá nhân và trạng thái khu phố giống hệt |
| T12 | Lịch sử Solo vào hồ sơ | Một lượt Solo đã kết thúc hiện thành một dòng với đúng công ty, số ngày, cấp, đánh giá, lý do kết thúc |
| T13 | Kinh tế ổn định | Chạy không giao diện 365 ngày game với hạt giống cố định: không kho âm, giá trong biên, không quán nào "chết", kết quả lặp lại được |
| T14 | Không game over | Tiền âm → chủ trọ cho nợ 1 tháng, có bữa cơm chung; năng lượng 0 → trạm y tế, mất 1 ca |
| T15 | Hóa đơn | Ngày 5 trừ tiền trọ; tiền điện 4.000đ/số khi chưa đăng ký tạm trú, giá bậc thang khi đã đăng ký |
| T16 | Nội dung | Kiểm tra `people.json` (đã có, mục 12.2) qua; không có ký tự gạch dài; mọi câu luật có ghi chú "thông tin giải trí" |
| T17 | Điện thoại | Một tuần game có ≥ 7 tin Xóm Ơi, không có tin nào lúc 23h-6h trừ khi có drama |

### Giai đoạn 2: "Shop engine" cho cả con phố

Tách bộ máy trà sữa thành shop engine dùng chung; thêm cơm tấm, bánh mì, cà phê cóc, tiện lợi, photo, quán net, tiệm tóc (đổi kiểu
tóc), phụ sạp chợ, đầu mối, quán nhậu. Mở quán riêng (vốn, vay ngân hàng, thuê mặt bằng). Combo khu phố. Toàn bộ bảng 6.6.
Sổ tay "Món ngon khu phố".

### Giai đoạn 3: Khu phố "công" và đời sống

Văn phòng khu phố + loa, công an phường (tạm trú, tuần tra), điện lực (cúp điện, ghi chỉ số), trạm y tế (khám, BHYT, 4 việc làm),
trường học (nghề giáo, tụi nhỏ và lịch 5 hoạt động, nhóm phụ huynh, thi vào 10), khô gà và gói học sinh, xe ôm 3 kiểu, xe ba gác Chú
Bảy (chở hàng, chở người, chuyển trọ). Lịch năm đầy đủ (mục 9).

### Giai đoạn 4: Bảy công ty, drama, quan hệ

Nối 7 công ty (thực tập 45 ngày trong khu phố + việc ghé lại), hệ thống drama với 28 kịch bản, độ thân và danh bạ, sơ đồ quan hệ
trong game (mở dần khi bạn quen người), Biên bản khu phố, tụi nhỏ lớn lên, "phần 2" của drama năm sau.

---

## 11. Câu hỏi cho Owner (cần quyết)

| # | Câu hỏi | Đề xuất của nhóm thiết kế |
|---|---|---|
| Q1 | **Lịch chạy thế nào?** Ngày trong game trôi khi ngủ (một ngày ~15-25 phút thật, năm game dài vài chục giờ chơi), hay theo ngày thật ngoài đời? | Ngày trôi khi ngủ. Lễ lớn (Tết, Trung thu) vẫn tới theo lịch game, không theo ngày thật |
| Q2 | **Quan hệ ngầm của 7 công ty** trong Khu phố: giữ kiểu Solo (mỗi lượt rút ngẫu nhiên vài cái là "thật") hay coi tất cả là thật? | Mỗi bản lưu khu phố rút ngẫu nhiên một nửa là thật, nửa kia là "tin đồn sai"; drama hé lộ dần |
| Q3 | **Góc nhìn**: đi phố góc nhìn thứ nhất như Solo, còn ca làm ở quán nhìn từ trên xuống (kiểu nấu ăn, giống Multiplayer)? Hay ca làm cũng góc nhìn thứ nhất? | Phố: thứ nhất. Ca làm: nhìn từ trên xuống (dễ thao tác 11 bước trên điện thoại) |
| Q4 | **Thực tập 45 ngày ở 7 công ty**: chơi ngay trong khu phố (8h30-17h30 ở văn phòng, tối ra phố), hay vẫn chơi ở Solo và chỉ nhập kết quả vào hồ sơ? | Giai đoạn 1-3: nhập kết quả từ Solo. Giai đoạn 4: chơi ngay trong khu phố |
| Q5 | **Tụi nhỏ có lớn lên** theo năm game không (lên lớp mỗi 5/9, có ngày thành người lớn nhưng không bao giờ có drama tình cảm)? | Có lớn lên |
| Q6 | **Mức châm biếm với cơ quan nhà nước** (công an phường, điện lực, UBND, trường công): chỉ cười thủ tục và luật, hay được trêu cả người làm công vụ? | Chỉ cười thủ tục và luật; người làm công vụ trong game đều tử tế, có tính cách riêng |

---

## 12. Bảng đối chiếu yêu cầu của Owner

| # | Yêu cầu (tóm tắt) | Ở đâu trong tài liệu |
|---|---|---|
| 1 | Khu phố T&M có nhà trọ, điện lực, công an phường, khu phố (tổ dân phố), đồ ăn, đồ uống và 7 công ty | 2.1 (tên đúng: khu phố, Trưởng khu phố), 2.2 bản đồ, 2.3 bảng nơi chốn, 2.4 bảy công ty |
| 2 | Làm nhân viên ở mọi cửa hàng; trà sữa: lấy cốc, topping, trà, bán, nhập hàng, chọn truyền thông | 4.1 luật chung, 4.2 trà sữa (b ca làm 11 bước, g nhập hàng, h truyền thông), 4.3 các nơi khác |
| 3 | Mọi doanh nghiệp tương tác (mua bán, giá, sự kiện chung) | 6.1-6.5 mô hình, 6.6 bảng 35 tương tác, 6.7 |
| 4 | Mục tiêu: chơi lâu nhất, không giới hạn thời gian | 1.1, 1.3 tám trụ cột, 1.4 cạm bẫy, 1.5 không game over, 9.4 năm nào cũng khác |
| 5 | Sơ đồ quan hệ (kể cả quan hệ ngầm 7 công ty), trang tương tác | `people.json` (28 quan hệ ngầm, 230 quan hệ), 12.2 phụ lục, 10 giai đoạn 1 mục 2 |
| 6 | Drama "mất não" (đánh ghen, con nuôi, thất lạc, thừa kế, hôn ước…) | 8.1 luật, 8.2 hệ thống, 8.3 28 kịch bản |
| 7 | Trường học + nghề giáo viên; trẻ em chăm học | 4.3 "Trường học và nghề giáo viên", 7.2 thanh Chăm học, 7.5 đời sống trường, drama 20, 28 |
| 8 | Trẻ em ăn vụng khô gà, mua khô gà, gói học sinh, canh giàn phơi hay bán | 7.3, drama 7, 6.6 dòng 10-11, 4.4 việc ghé Ba & Má |
| 9 | Trẻ em chỉ ăn, ngủ, đi học, tập thể dục, chơi game | 7.2 (lịch ngày), 7.7 luật an toàn, kiểm tra trong `people.json` |
| 10 | Quán net, người chơi làm nhân viên (nạp giờ, mì ly, dọn máy, máy treo) | 4.3 "Net Không Lag" |
| 11 | Drama trốn học đi net, nhiều vai, luật hiện hành về giờ và trẻ em | 7.4 luật thật, drama 6 |
| 12 | Chợ, phụ sạp, trả giá, buôn chuyện | 4.3 "Chợ Tâm Mỹ", drama 9, 19, 6.2 giá |
| 13 | Quán nhậu, phục vụ, say xỉn, nợ tiền nhậu, karaoke, nồng độ cồn | 4.3 "Quán nhậu", 3.4 (nồng độ cồn), drama 3, 4, 5, 16, 18 |
| 14 | Bệnh viện / trạm y tế, khám, BHYT, làm việc (điều dưỡng, lễ tân, bảo vệ, nhà thuốc) | 4.3 "Trạm y tế phường", 1.5, 3.6 BHYT, 2.5 bệnh viện tuyến trên |
| 15 | Tiệm cắt tóc, thợ phụ lên thợ chính, buôn chuyện, đổi kiểu tóc | 4.3 "Tiệm tóc", 5.2 `look`, drama 3, 9, 14, 25 |
| 16 | Xe ôm và xe đạp ôm, đi lại tốn tiền nhanh hơn, làm tài xế, chở hàng | 3.4 đi lại, 4.3 "Xe ôm, xe ôm công nghệ, xe đạp ôm" |
| 17 | Xe ba gác Chú Bảy chở hàng và người, phụ chú, thuê khi chuyển trọ | 4.3 "Xe ba gác của Chú Bảy", 3.4, 6.4 chuỗi cung ứng, drama 8, 11, 18 |
| 18 | Hồ sơ cá nhân lưu vĩnh viễn, đủ trường, nhà tuyển dụng và HR đọc, gắn lưu đám mây | 5.1-5.5 (đã kiểm tra `save.js`: cần mở rộng `validateProfile`/`mergeProfiles`) |
| Quyết định tạm | Chế độ tách khỏi Solo; quán làm đầu tiên là trà sữa; được nghỉ để chuyển chỗ làm | Đầu tài liệu, 4.2, 4.1 "Nghỉ việc", 10 giai đoạn 1 |

### 12.2 Phụ lục: `people.json`

- Cấu trúc: `{"places":[{id,name,kind}], "people":[{id,name,role,place,group,age,note}], "relations":[{a,b,type,label,secret,origin}]}`.
- Người của 7 công ty có id `<công ty>:<id trong cast>` (ví dụ `bama:hung`, `agency:loc`); đủ mọi người có thân hình trong 7 cast, cộng
  6 người chỉ gọi điện nhưng quan trọng (cô Sáu Tạp Hóa, Cô Bánh Mì, chị Hạnh Săn Đầu Pro, chị Hồng Phúc Lộc, chị Hường, anh Lộc Xe).
  Người mới có id `kp:<id>`.
- `origin`: `tie:<công ty>:<id>` cho 28 quan hệ ngầm có sẵn (giữ nguyên câu gốc, `secret: true`); `drama:<số>` cho quan hệ của drama;
  `khupho` cho quan hệ đời thường.
- Số lượng: **32 nơi, 157 người** (98 của 7 công ty, 59 người mới trong đó 11 em nhỏ 6-15 tuổi), **230 quan hệ** (28 quan hệ ngầm + 202 mới),
  **155 quan hệ nối hai nhóm khác nhau**, trong đó **115 nối hai loại khác nhau** (công ty, quán, công, trường, cư dân, trẻ em); 28 drama có quan hệ riêng.
- Trình kiểm tra (chạy bằng `node`, đã qua): mọi đầu mối quan hệ tồn tại; nơi của mỗi người tồn tại; không có quan hệ romance/crush/ex nào
  chạm người dưới 18; quan hệ của trẻ chỉ thuộc family, friend, classmate, teacher, neighbour, rival; trẻ có tuổi là số từ 6 tới 15; đủ 28
  quan hệ ngầm của 7 công ty, giữ câu gốc; đủ mọi người có thân hình trong cast 7 công ty; người mới không trùng tên với người cũ (trừ khi
  ghi chú phân biệt).
