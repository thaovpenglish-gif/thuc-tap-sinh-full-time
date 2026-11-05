# Overdeadline & Overburnout — Multiplayer (bản nháp thiết kế)

> Trạng thái: **nháp để Game Owner duyệt.** Chỗ nào ghi **[cần chốt]** là chưa quyết.
> Solo vẫn là `docs/GAME_DESIGN.md`. Multiplayer làm song song, không đụng logic Solo.

## 1. Ý tưởng một câu

2–4 người chơi là nhân viên của **một công ty "giải cứu"** (tư vấn / chữa cháy) được 7 công ty bên Solo thuê về
giải quyết khủng hoảng. Mỗi màn là một công ty khách hàng, chơi kiểu nấu ăn hợp tác (chạy qua lại các trạm, làm theo
"công thức", chuyền đồ cho nhau, kịp deadline), nhưng nguyên liệu là **file, số liệu, slide, chữ ký**, còn kẻ thù là
**deadline** và **burnout**.

- Tên game / chế độ: **Overdeadline & Overburnout**.
- Tên công ty của người chơi: **[cần chốt]**. Gợi ý: "Chữa Cháy Consulting", "Cứu Hỏa & Partners",
  "SOS Advisory · Gọi là tới, tới là trễ".
- Góc nhìn: camera nhìn chéo từ trên (`core/camera.js`), khác góc nhìn thứ nhất của Solo.

## 2. Vòng lặp chơi (một màn ~4 phút)

```
Yêu cầu của khách (ticket, có đồng hồ) hiện trên cùng màn hình
   ▼
Lấy "nguyên liệu" ở kệ (Data thô, Brief, Chứng từ, CV…)
   ▼
Xử lý ở trạm (giữ nút / đứng chờ thanh tiến độ):  Laptop → Excel sạch  ·  Laptop → Slide  ·  Máy in → Bản in
   ▼
Ghép ở bàn ghép (vd. Excel sạch + Slide = Deck)
   ▼
Xin chữ ký sếp (trạm Sếp, có lúc sếp đi vắng)
   ▼
Nộp ở quầy Khách → được tiền + KPI.  Trễ → ticket mất, khách complain.
```

- **Ticket = món ăn.** Mỗi ticket có công thức (vd. "Báo cáo tuần = Data → Excel sạch → In → Ký → Nộp").
- **Trạm (stations)** dùng chung mọi màn: Kệ nguyên liệu · Laptop (xử lý) · Máy in (hay kẹt giấy) · Bàn ghép ·
  Sếp ký · Quầy khách · Thùng rác (hủy bản lỗi) · **Pantry** (hồi burnout).
- **Phiên bản file thay cho "khét"**: để file ở laptop quá lâu sau khi xong → thành `v2_final_final` rồi
  `v3_FINAL_sửa_lần_cuối` (giảm chất lượng). Quá nữa → file hỏng, phải vứt.
- **Chuyền đồ**: ném/đưa file cho đồng đội qua bàn hoặc đưa tận tay (đã có sẵn trong `game/sim.js`: `handoff`).

## 3. Burnout (thanh riêng của mỗi người)

- Tăng khi xử lý ở trạm, khi cầm đồ chạy, khi bị sếp gọi. Giảm khi đứng ở Pantry (cà phê +, ly thứ 3 phản tác dụng
  giống Solo) hoặc đứng yên.
- **≥ 70**: chạy chậm, xử lý chậm, nhân vật bốc khói trên đầu.
- **100 = BURNOUT**: ngồi gục 6–8 giây, làm rơi đồ đang cầm. Đồng đội đưa cà phê tận tay thì dậy sớm hơn.
- Ý đồ: buộc cả đội luân phiên nghỉ, không ai ôm hết việc. Đây là chữ "Overburnout" trong tên.

## 4. Điểm và kết màn

- Mỗi ticket nộp đúng hạn: tiền (+ tip nếu nộp sớm). Trễ / mất: trừ tiền, khách complain.
- Kết màn chấm **1–3 ⭐ KPI**. Mở màn tiếp cần tổng số sao.
- Màn kết thúc bằng "buổi họp tổng kết" ngắn: khách (nhân vật từ Solo) nói một câu theo số sao, kiểu
  Tuyết: "Chị chỉ có một vài ý nhỏ thôi."

## 5. Bảy màn = bảy công ty khách hàng

Mỗi màn có **một cơ chế riêng** (giống mỗi bếp có một mẹo riêng), lấy từ chính drama của công ty đó bên Solo.

| # | Khách hàng | Khủng hoảng | Ticket / nguyên liệu | Cơ chế riêng của màn |
|---|---|---|---|---|
| 1 | 📊 T&M Partners | Deck chiến lược cho khách, chị Chủ tịch "vài ý nhỏ" | Brief → Slide → Deck → Ký | **Daily stand-up bất chợt**: chuông reo, ai đứng gần bảng Scrum phải vào họp 10 giây (đứng im). Màn hướng dẫn. |
| 2 | 🍖 Ba & Má | Đơn livestream dồn tới tối | Khô gà / khô bò / trái cây sấy → Cân → Đóng gói → Dán đơn → Giao | **Băng chuyền xưởng** chạy ngang bản đồ; Má gọi "chốt đơn!" làm ticket tới dồn dập. |
| 3 | 💻 Nợ Kỹ Thuật Labs | Deploy chiều thứ Sáu, prod sập | Ticket Jira → Code → Review → Deploy | **Server cháy**: deploy sai là một ô server bốc lửa, phải cầm "rollback" dập trước khi lan. |
| 4 | 📣 Trend Trễ Agency | Khách sửa "lần cuối" lần thứ 14 | Brief → Thiết kế → Caption → Duyệt | **Feedback quay về**: nộp xong có xác suất ticket bay ngược lại kèm "feedback nhẹ", phải sửa lại. KOL bùng = mất một trạm. |
| 5 | 🧮 Cân Đối & Cộng Sự | Busy season, kiểm kê kho 2 giờ sáng | Chứng từ → Tick → Đối chiếu → Ký | **Mất điện / tối**: bản đồ tối dần, chỉ thấy quanh người cầm đèn pin; kệ chứng từ bị đổ phải nhặt lại. |
| 6 | 🎪 Đi Đâu Cũng Được | Sự kiện ngoài trời gặp mưa | Backdrop / âm thanh / quà → Dựng sân khấu | **Mưa giữa sự kiện**: theo đợt, nửa bản đồ ngoài trời bị mưa (chạy chậm, đồ để ngoài bị ướt); phải chuyển sang "Plan B" trong nhà. |
| 7 | 🧲 Người Đúng Chỗ HR | Tuyển gấp 20 vị trí | CV → Lọc → Phỏng vấn → Offer | **Phân loại CV**: CV rơi ra từ máy in theo màu, bỏ đúng ô vị trí; ứng viên "ghost" tự biến mất nếu để lâu. |

Thứ tự độ khó gợi ý: T&M (hướng dẫn) → HR → Ba & Má → Agency → Event → Audit → Tech. **[cần chốt]**

## 6. Nối với Solo (nhẹ, không phụ thuộc code)

- Khách hàng là **nhân vật từ Solo** (chỉ mượn tên, ngoại hình, câu thoại kinh điển). Multiplayer **không import**
  `career.js`, `companies/*`, `modes/solo.js`. Cần nhân vật nào thì copy dữ liệu tối thiểu sang `game/mp/clients.js`.
- (Sau này) huy hiệu chéo: qua màn công ty X bên Multiplayer thì có sticker trong sổ tay Solo. **[cần chốt]**

## 7. Kỹ thuật

- **Mạng**: Supabase Realtime, mỗi phòng một channel `mp:<mã phòng>`. Người tạo phòng là **host**, chạy mô phỏng
  (`game/sim.js` mở rộng thêm: trạm xử lý có tiến độ, ticket, đồng hồ, burnout) và gửi trạng thái ~10 lần/giây.
  Client chỉ gửi input/hành động. Không cần server riêng.
- **Phòng**: tạo phòng → mã 5 ký tự → bạn bè nhập mã. Presence để thấy ai đang trong phòng. Host thoát giữa màn:
  bản đầu chỉ kết thúc màn; sau này chuyển host.
- **Chơi chung một máy (local co-op)**: 2 người một bàn phím (WASD / phím mũi tên). Rất tiện để test và cho người
  không có bạn online. **[cần chốt có làm ở bản đầu không]**
- **Điện thoại**: joystick sẵn có trong `core/input.js` + 2 nút (Cầm/Đặt, Làm việc).
- **File mới, tách hẳn khỏi Solo**:
  ```
  site/js/modes/multi.js        sảnh, phòng, vòng lặp màn
  site/js/net/mp-net.js         channel phòng, presence, gửi/nhận state
  site/js/game/mp/              recipes.js, levels.js, burnout.js, clients.js (thuần, test được bằng node)
  site/js/maps/mp/              bản đồ từng màn (dùng lại art/kit.js, art/people.js)
  tests/mp-*.test.mjs
  ```
- **Ẩn sau cờ `?mp=1`** trong `flags.js` cho tới khi duyệt. Không có cờ thì nút vẫn hiện "Sắp ra mắt".
- Chỉ **thêm** vào file dùng chung (`main.js`, `index.html`, `style.css`), không sửa code Solo đang có.

## 8. Lộ trình

1. **Prototype** (`?mp=1`): 1 màn T&M, 2 công thức, burnout, chơi online 2–4 người qua mã phòng. Hình khối đơn giản.
2. Thêm 3 màn (HR, Ba & Má, Agency) + chấm sao + mở màn.
3. 3 màn còn lại + local co-op + điện thoại.
4. Âm thanh, hiệu ứng, cân bằng độ khó, bỏ cờ `?mp=1`.

## 9. Câu hỏi cần Game Owner chốt

1. Tên công ty "giải cứu" của người chơi.
2. Chỉ hợp tác (co-op), hay có thêm chế độ đấu 2 đội (2v2, hai công ty tư vấn giành cùng một khách)?
3. Có làm chơi chung một máy ngay từ bản đầu không?
4. Thứ tự 7 màn và cơ chế riêng của từng màn ở bảng mục 5.
