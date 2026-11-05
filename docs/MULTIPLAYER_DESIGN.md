# Overdeadline & Overburnout — Multiplayer (SOS Advisory)

> Trạng thái: **bản thử chơi được, mở trên menu chính** (nhãn "Bản thử", màn T&M). `?mp=0` để ẩn lại. Chỗ nào ghi **[cần chốt]** là chưa quyết.
> Solo vẫn là `docs/GAME_DESIGN.md`. Multiplayer làm song song, không đụng logic Solo.
> Đã chốt với Game Owner: tên công ty **SOS Advisory**, **chỉ hợp tác (co-op)**, cảm giác giống các game nấu ăn
> co-op chơi ngay trong Messenger (kiểu *Ready, Set, Cook!*): bấm link là vào, ván ngắn, chơi tốt trên điện thoại.

## 1. Ý tưởng một câu

2–4 người chơi là nhân viên của **một công ty "giải cứu"** (tư vấn / chữa cháy) được 7 công ty bên Solo thuê về
giải quyết khủng hoảng. Mỗi màn là một công ty khách hàng, chơi kiểu nấu ăn hợp tác (chạy qua lại các trạm, làm theo
"công thức", chuyền đồ cho nhau, kịp deadline), nhưng nguyên liệu là **file, số liệu, slide, chữ ký**, còn kẻ thù là
**deadline** và **burnout**.

- Tên game / chế độ: **Overdeadline & Overburnout**.
- Tên công ty của người chơi: **SOS Advisory** · *"Gọi là tới, tới là trễ"* (đã chốt).
- Chỉ **co-op**: cả đội cùng thắng hoặc cùng bị khách complain. Không có chế độ đấu.
- Cảm giác "game Messenger": gửi link vào group chat → bạn bè bấm là vào phòng (tên đã lưu thì vào thẳng),
  ván 3 phút, một nút làm mọi thứ, chơi dọc trên điện thoại được.
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
- **Phòng**: tạo phòng → mã 5 ký tự hoặc link mời → bạn bè bấm là vào. Presence để thấy ai đang trong phòng.
  Host thoát giữa màn: bản đầu chỉ kết thúc màn; sau này chuyển host.
- **Chơi chung một máy (local co-op)**: chưa làm (xem mục 10). Có chế độ *Tập một mình* thay thế.
- **Điện thoại**: joystick sẵn có trong `core/input.js` + **một** nút LÀM (lấy, đặt, ghép, làm việc, nộp đều chung
  một nút, game tự hiểu theo chỗ đang đứng và thứ đang cầm).
- **File mới, tách hẳn khỏi Solo**:
  ```
  site/js/modes/multi.js        sảnh, phòng, vòng lặp màn
  site/js/net/mp-net.js         channel phòng, presence, gửi/nhận state
  site/js/game/mp/              recipes.js, levels.js, burnout.js, clients.js (thuần, test được bằng node)
  site/js/maps/mp/              bản đồ từng màn (dùng lại art/kit.js, art/people.js)
  tests/mp-*.test.mjs
  ```
- Cờ `mp` trong `flags.js`: mặc định bật (thẻ "Bản thử" trên menu chính); `?mp=0` ẩn lại thành "Sắp ra mắt".
- Chỉ **thêm** vào file dùng chung (`main.js`, `index.html`, `style.css`), không sửa code Solo đang có.

## 8. Bản thử hiện có (màn T&M)

Menu chính → thẻ **Overdeadline & Overburnout** (bản thử).

- **Sảnh**: nhập tên → *Tạo phòng* (mã 5 ký tự + nút "📨 Mời bạn": trên điện thoại mở bảng chia sẻ để gửi qua
  Messenger/Zalo, trên máy tính chép link) · *Vào phòng* bằng mã · *Tập một mình* (không cần mạng).
  Link mời có dạng `?mp=1&room=ABCDE`; tên đã lưu thì bấm link là vào thẳng phòng.
- **Phòng chờ**: tối đa 4 người, màu theo thứ tự vào phòng, host bấm *Bắt đầu*. Ai vào lúc nhóm đang chơi thì
  chờ ván sau. Host rời phòng → mọi người được báo và về sảnh.
- **Một ván**: đếm ngược 3 giây, 3 phút, 7 loại việc:

  | Việc | Cách làm | Tiền |
  | --- | --- | --- |
  | 🍵 Trà cho khách | Ấm trà (Pantry) → quầy | 15k |
  | 🖼️ Slide nhanh | Brief → Laptop | 30k |
  | 📗 File Excel đối chiếu | Data → Laptop | 35k |
  | 🗒️ Biên bản họp | Brief → Bàn họp nhanh (Phòng họp, đứng làm 4 giây) | 50k |
  | 📄 Báo cáo số liệu | Data → Laptop → Máy in | 60k |
  | 🖋️ Hợp đồng ký tên | Kệ hồ sơ (Phòng in) → Máy in → chị Tuyết ký | 90k |
  | ✅ Deck đề xuất | Slide + Bản in ghép ở bàn → chị Tuyết ký (30% bị "vài ý nhỏ" một lần) | 140k |

  Biên bản họp từ 0:15, deck từ 0:25, hợp đồng từ 0:35. Nộp sớm có tip tới +50%, trễ −20k.
- **Nhịp khách theo số người** (`pace` trong `levels.js`, Game Owner: "1 người thì việc chậm hơn 4 người"):

  | Số người | Khách mới mỗi | Thời gian chờ của khách | Tối đa chờ cùng lúc |
  | --- | --- | --- | --- |
  | 1 | 34 giây | ×1,4 | 2 |
  | 2 | 24 giây | ×1,15 | 3 |
  | 3 | 18 giây | ×1 | 4 |
  | 4 | 14 giây | ×0,9 | 4 |

  Sảnh trống thì khách kế tiếp tới sau 5 giây.
  Luật từng trạm nằm trong `process` của màn (`levels.js`), nên công ty khác có thể có trạm và việc riêng.
- **Bản đồ = văn phòng T&M nhiều phòng** (18 × 12): Khu làm việc (kệ Brief/Data, 2 laptop, Bảo và Trang ngồi
  gõ máy) · Phòng in · Phòng Chủ tịch vách kính (bàn chị Tuyết) · Phòng in có thêm Kệ hồ sơ · hành lang (4 bàn ghép, thùng rác, bảng Scrum
  của anh Đạt chắn giữa lối) · Pantry (cà phê, ấm trà, tủ lạnh, Mèo KPI) · Phòng họp (bàn họp nhanh) · **Sảnh khách** (lễ tân chị Gấm,
  sofa). Mỗi phòng một màu sàn, biển tên treo trên cửa.
- **Khách thật**: mỗi đơn là một người T&M (chị Hân, Khang, chị Linh, chị Hạ, Mai, An, chị Quỳnh, Long) đi từ cửa
  sảnh vào, ngồi chờ ở một trong 4 chỗ, trên đầu có icon món cần và thanh kiên nhẫn; gần hết giờ thì giục
  ("Em ơi xong chưa?"). Nộp ở **Quầy lễ tân** (ô cửa giữa hành lang và sảnh): khách "😍 Quá xịn" rồi về;
  trễ thì "😤 Thôi khỏi!" và bỏ đi. Ticket trên HUD ghi "Chị Hân cần…".
- **Bẫy của màn**: máy in để quá 8 giây thành `v3_FINAL_sửa_lần_cuối` (hỏng) · stand-up lúc 0:55 và 2:00
  (cảnh báo 5 giây, ai trong vòng hồng quanh bảng Scrum bị kẹt họp 7 giây).
- **Burnout**: làm laptop +7/giây, cầm đồ +0,8/giây, rảnh tay −1,6/giây, cà phê −35 (ly thứ 3 trong 45 giây:
  +15 và run tay). ≥ 70 đi và làm chậm hơn; 100 = ngồi gục 6 giây, đồ đang cầm rơi xuống sàn (ai cũng nhặt được).
- **Sao**: 200k / 450k / 700k (chơi một mình ×0,6). **[cần chỉnh sau khi chơi thử thật]**
- **Điều khiển**: `WASD`/mũi tên + `Space`/`E`; điện thoại: cần điều khiển + nút tròn LÀM. Gợi ý hành động hiện
  ở giữa dưới màn hình, trạm đang đứng gần có vòng vàng.
- **📖 Công thức** (nút trên HUD, phím `H`, nút trong phòng chờ): cách làm từng việc từng bước + mẹo. Game vẫn chạy
  khi mở (online không tạm dừng được). Ticket ghi đủ chuỗi, ví dụ Deck: "🖼️ Slide (📝→💻) · 📄 Bản in (📊→💻→🖨️) ·
  🗂️ ghép · ✍️ ký". Dữ liệu: `steps` (ticket), `how` (sổ), `tips` trong `levels.js`.

### File

```
site/js/game/mp/engine.js   luật chơi thuần (host chạy): item, trạm, ticket, burnout, stand-up, sao
site/js/game/mp/levels.js   dữ liệu màn (T&M); thêm công ty = thêm một object ở đây
site/js/net/mp-net.js       phòng: Supabase Realtime (mặc định) · BroadcastChannel (?net=local, test 2 tab) · none
site/js/maps/mp-room.js     dựng văn phòng 3D: phòng, vách (thường/kính), trang trí, trạm, khách
site/js/modes/multi.js      sảnh, phòng chờ, vòng chơi, HUD, kết quả
site/js/ui/mp-style.js      CSS (nằm trong JS để được gắn ?v= khi deploy)
tests/mp-engine.test.mjs    unit test luật chơi (npm test)
tests/e2e/mp-local.cjs      2 người trong 1 trình duyệt: tạo phòng, vào bằng link, làm và nộp đơn, kết quả,
                            chơi lại, host rời (npm run test:mp, cần server cổng 8765)
```

### Giới hạn đã biết

- Host là máy người tạo phòng. Tab host bị ẩn thì trình duyệt chỉ cho chạy ~1 lần/giây: game vẫn đi nhưng giật.
  Host thoát là hết ván (chưa chuyển host).
- Vị trí do mỗi máy tự gửi (tin nhau, vì là co-op). Hành động (lấy/đặt/nộp) do host quyết.
- Supabase gói miễn phí giới hạn số tin nhắn/giây cả project: mỗi người gửi vị trí 8 lần/giây, host gửi trạng thái
  5 lần/giây. Nhiều phòng cùng lúc có thể chạm giới hạn, cần theo dõi khi mở rộng.
- Đã test trên bản deploy qua Supabase thật (2 trình duyệt riêng: tạo phòng, vào bằng link, bắt đầu, hành động
  của khách tới host). Chưa test trên điện thoại thật qua 4G/wifi.

## 8b. Màn 2: Ba & Má · "Chốt đơn mùa Tết"

Chọn ở sảnh (thẻ "Khách hàng") hoặc host đổi trong phòng chờ; máy của mọi người tự dựng lại văn phòng.

- **Bản đồ** (cùng khung 7 khu với T&M): Xưởng sơ chế (tủ đông gà, tủ đông bò, thùng xoài, 2 bàn ướp, Cậu Tám) ·
  Phòng sấy (2 máy sấy, bàn để khô) · Phòng Má · Két (vách kính: Má thấy hết, két, ghế đỏ) · hành lang (2 bàn đóng
  gói, 2 bàn ghép, thùng rác, bàn thờ Thần Tài, Ba đi tuần, **Cầu dao** cuối hành lang) · Bếp cô Tư (khô ăn thử,
  trà đá, Mèo Khô Gà) · Góc livestream (Út Mi, đèn ring, màn hình LIVE, anh Khoa) · Cửa hàng (kệ khô, xe Chú Bảy,
  quầy giao hàng).
- **Khách**: Chị Tâm (nhà phân phối), Cô Sáu Tạp Hóa, Kevin Tuấn, Chị Mai CSKH, Ngân, Anh Dũng, anh shipper,
  khách "shop ơi".

  | Việc | Cách làm | Tiền |
  | --- | --- | --- |
  | 🍢 Gói ăn thử | Khô ăn thử (Bếp) → quầy | 15k |
  | 🥭 Xoài sấy (xá) | Xoài → Bàn ướp (cắt) → Máy sấy | 40k |
  | 🐔 Khô gà lá chanh | Gà → Bàn ướp → Máy sấy → Bàn đóng gói | 75k |
  | 🐄 Khô bò miếng (từ 0:20) | Bò → Bàn ướp → Máy sấy → Bàn đóng gói | 85k |
  | 🧧 Hộp quà Tết Phú Quý (từ 0:40) | Gói khô bò + Xoài sấy ghép → Má duyệt (30% "dán lại tem" ở Bàn đóng gói) | 160k |

- **Cơ chế riêng**:
  - 🔴 **Flash sale** (0:50, 1:52, 2:38; báo trước 4 giây): Út Mi hô, 2 khách ùa vào cùng lúc (ăn thử, xoài, khô gà),
    trả ×1,5 nhưng kiên nhẫn ×0,8. Ticket có 🔥.
  - ⚡ **Má tắt điện** (1:20, 2:20; báo trước 3 giây): 2 máy sấy ngừng, hiện "⚡ Mất điện"; Cầu dao nhấp nháy
    "Bật lại đây!". Ai bật thì Má hỏi "Ai bật đó?".
  - 🔥 Đồ để trong máy sấy quá 9 giây thành **Khô cháy khét**.
- Kỹ thuật: thêm vào engine `flash`, `powerCut`, trạm `breaker`, `rule.ruin/ruinText`, `rule.fixAt`; mặt bằng
  dùng chung `TM_WALLS`/`TM_MATS`. Test: `tests/mp-bama.test.mjs`.

## 9. Lộ trình

1. ✅ **Bản thử** (`?mp=1`): màn T&M, 3 công thức, burnout, phòng online 1–4 người qua mã/link.
2. Chơi thử thật với 2–4 người → chỉnh tốc độ đơn, thời gian, mốc sao.
3. ✅ Màn Ba & Má + chọn màn. Tiếp: HR, Agency, mở màn theo sao.
4. 3 màn còn lại, âm thanh/hiệu ứng, chuyển host khi host thoát, bỏ cờ `?mp=1`.

## 10. Câu hỏi còn mở

1. Có làm chơi chung một máy (2 người một bàn phím) không? Bản thử chưa làm, vì hướng "game Messenger" là mỗi người một điện thoại.
2. Thứ tự 7 màn và cơ chế riêng từng màn ở bảng mục 5.
3. Mốc sao và độ khó sau buổi chơi thử đầu tiên.
