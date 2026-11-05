# Research: "Bắp Labs": startup công nghệ / app khoảng 80 người

> Tài liệu nghiên cứu bối cảnh cho một chương của *Thực Tập Sinh Full-Time*. Mọi công ty, nhân vật và tình huống đều **hư cấu**. Các chi tiết thị trường (layoff, gọi vốn, OT, Agile kiểu Việt) dựa trên nguồn ở cuối file.
>
> Ký hiệu hậu quả: **UT** = Uy tín, **DR** = Drama, **NL** = Năng lượng, **QH(X)** = quan hệ với nhân vật X.

---

## 0. Bức tranh nhanh

- **Công ty:** Bắp Labs (app **"Bắp"**: đi chợ online, ví điện tử, "và sắp tới là AI"). Thành lập năm 2021, gọi được Seed và Series A trong cơn sốt 2021–2022. Đang chật vật gọi Series B.
- **Quy mô:** khoảng 80 người, trong đó 45 Engineering (BE, FE, Mobile, QA, DevOps, Data), 8 Product (PM, BA), 5 Design, 10 Growth/Marketing, 7 Ops/CS, 5 HR/Finance/Admin.
- **"Bí mật" kinh doanh:** có thêm mảng **Bắp Solutions** nhận outsource cho khách Nhật và khách Úc để "nuôi" sản phẩm chính. Khoảng 20 dev bị luân chuyển qua lại giữa hai bên, ai cũng gọi là "đi đày".
- **Văn phòng:** coworking hai tầng ở quận 1 (hoặc Cầu Giấy). Có bàn bi lắc không ai chơi, tủ lạnh đầy nước tăng lực, phòng họp đặt tên theo món ăn: "Phở", "Bún Bò", "Cơm Tấm".
- **Khẩu hiệu tuyển dụng:** "Flat. Fast. Fun." Nhân viên gọi vui là "Phẳng (lương). Nhanh (nghỉ). Phấn (khích lúc đầu)."
- **Mâu thuẫn trung tâm:** runway còn 9 tháng. CEO bán giấc mơ, CTO giữ cho hệ thống không sập, PM kẹt giữa. Intern là người đầu tiên được dùng và cũng là người đầu tiên bị quên.

### Dàn nhân vật gợi ý (archetype, hư cấu)

| Nhân vật | Vai | Câu cửa miệng | Móc drama |
|---|---|---|---|
| **Anh Đăng "David"** | CEO & Co-founder, từng làm ở thung lũng Silicon 2 năm | "Let's think big." | Đã hứa với nhà đầu tư số MAU mà app chưa từng đạt |
| **Anh Tú** | CTO & Co-founder | "Ai deploy?" | Là người duy nhất biết mật khẩu server cũ |
| **Chị Vân** | Senior PM | "Mình align lại nha." | Đang phỏng vấn ở một sàn TMĐT lớn |
| **Anh Khôi** | Tech Lead Backend | "Code ai viết mà…" (thường là code của anh ấy) | Viết 70% hệ thống, không viết dòng tài liệu nào |
| **Chị Hằng QA** | QA Lead | "Em reproduce được mà anh." | Có file Excel ghi mọi bug dev từng nói "không phải bug" |
| **Minh "Mobile"** | Mobile dev, 25 tuổi | "Trên máy em chạy được." | Đang làm freelance song song |
| **Lan Design** | Product Designer | "Lệch 2px rồi anh." | Thích anh Khôi |
| **Anh Phong DevOps** | DevOps duy nhất | (không nói gì, chỉ thả emoji 🔥) | Sắp nghỉ, chưa bàn giao |
| **Chị Thu "People"** | Head of People & Culture | "Mình là một gia đình." | Đang soạn danh sách layoff |
| **Anh Sato / Bảo BrSE** | BrSE dự án Nhật | "Khách hỏi Q&A số 147." | Khách Nhật sắp cắt hợp đồng |
| **Kiên "Growth"** | Growth Lead | "Ship nhanh đi, A/B test sau." | Đã book KOL cho tính năng chưa code xong |
| **Bảo Ngọc** | Intern PM, cháu một nhà đầu tư | "Em nghĩ mình nên làm AI." | Được mời dự họp board mà intern khác không được |

---

## 1. Văn hoá và quy mô

### 1.1 Tổ chức

- **C-level:** CEO (gọi vốn, đi sự kiện, đăng LinkedIn), CTO (kỹ thuật), COO (vận hành và tiền), Head of Product.
- **Squad theo sản phẩm** (học theo "mô hình Spotify" trong một bài Medium): Squad Đi Chợ, Squad Ví, Squad Growth, Squad "AI" (mới lập, 3 người, CEO quan tâm nhất).
- **Chapter theo chuyên môn:** Backend, Frontend, Mobile, QA, Design, Data.
- **Bắp Solutions (outsource):** team Nhật (BrSE, comtor, dev) và team Úc. Doanh thu ổn định nhất công ty mà không ai nhắc tới trong all-hands.
- **Thực tế:** sơ đồ thì phẳng, nhưng quyết định thật đến từ một cuộc gọi lúc 23h giữa CEO và CTO.

### 1.2 Bộ phận intern có thể bị luân chuyển qua

1. **Backend / Frontend / Mobile (intern dev):** fix bug nhỏ, viết unit test, "đọc code để làm quen" 2 tuần. Sau đó được giao feature thật mà không ai review kịp.
2. **QA (intern tester):** viết test case, test hồi quy (regression) trước mỗi release, chạy test thủ công trên 7 chiếc điện thoại cũ, cãi với dev rằng bug là bug.
3. **Product (intern PM/BA):** viết user story, ghi biên bản họp, cập nhật Jira, làm slide, phỏng vấn người dùng, làm "người chuyển lời" giữa CEO và dev.
4. **Design (intern UI/UX):** vẽ màn hình, làm icon, xuất asset, sửa "logo to hơn" theo ý CEO.
5. **Data:** kéo số liệu SQL cho CEO trước buổi gặp nhà đầu tư. Định nghĩa "MAU" thay đổi theo người hỏi.
6. **DevOps / On-call:** đọc log, xem dashboard, học hiểu tại sao "prod chết".
7. **Outsource dự án Nhật:** dịch spec, test thủ công, trả lời Q&A list, học câu "hourensou" (báo cáo, liên lạc, thảo luận).
8. **Growth / CS:** trả lời ticket khách, làm event, viết push notification ("Bắp nhớ bạn 🌽").

### 1.3 Giờ giấc

- **Chính thức:** 9h–18h, thứ Hai–thứ Sáu, hybrid "2 ngày WFH" (bị siết lại còn 1 ngày khi "văn hoá đi xuống").
- **Daily stand-up:** 9h30 "15 phút". Thực tế kéo 30–50 phút vì PM hỏi chi tiết, tech lead giải thích kỹ thuật ngay tại chỗ và CEO ghé vào "chỉ nghe thôi". Viblo có nhiều bài về đúng các lỗi này: timebox bị trượt khi người ngoài sprint góp ý kỹ thuật ngay trong buổi họp.
- **Ngày release:** thứ Ba hoặc thứ Năm (luật "không deploy thứ Sáu" có từ sau "Sự cố Thứ Sáu Đen" năm 2023).
- **On-call:** xoay vòng theo tuần, 24/7. Intern "không phải on-call" nhưng vẫn được add vào kênh #incident.
- **OT:** không ai bắt OT, nhưng ai về lúc 18h thì Slack có người nhắn "ơ về rồi à?". Mùa release và tuần trước buổi gặp nhà đầu tư, văn phòng sáng đèn tới 22h. Dự án Nhật thì OT theo múi giờ khách và hạn bàn giao.
- **Nghi lễ:** all-hands thứ Sáu cuối tháng (CEO chiếu slide "We're winning"), happy hour cùng ngày (pizza và bia), team building một lần một năm (bị huỷ năm gọi vốn khó).

### 1.4 Xưng hô

- Tất cả là **anh/chị/em** theo tuổi, kể cả với CEO ("anh Đăng"). CEO tự xưng **"anh"** và thích được gọi **"David"** khi có nhà đầu tư nước ngoài.
- Gọi theo nick Slack: "Minh Mobile", "Hằng QA", "Khôi BE".
- Dự án Nhật: gọi khách là **"khách"** hoặc "bên Nhật". Email bắt đầu bằng "お世話になっております" copy từ mẫu.
- Intern bị gọi là **"bạn intern"** trong 2 tuần đầu, rồi "em" khi đã sửa được bug đầu tiên.

### 1.5 Kênh chat và công cụ

- **Slack** (hoặc Teams nếu khách Nhật yêu cầu): #general (thông báo sinh nhật), #random (meme), #standup-async (không ai viết), #incident (nơi mọi người tỉnh dậy lúc 2h sáng), #deploy (bot báo mỗi lần deploy, kèm emoji 🙏), #ceo-ideas (kênh không chính thức, ai cũng mute), #kudos (lời cảm ơn công khai, đếm để xét thưởng).
- **Zalo** vẫn sống: nhóm "Bắp Fam" (tiệc tùng, góp tiền sinh nhật), nhóm "Bắp Mobile ❌ sếp" (không có sếp).
- **Jira** (ticket, sprint board), **Confluence** (tài liệu viết một lần rồi để đó), **Figma** (design và comment cãi nhau), **GitLab/GitHub** (code), **Google Meet / Zoom** (họp), **Notion** (tài liệu OKR của CEO).

### 1.6 Câu cửa miệng

- *"Quick sync 5 phút nha."* (45 phút)
- *"Let's take this offline."* (không bao giờ được bàn lại)
- *"Trên máy em chạy được mà."*
- *"Cái này không phải bug, đây là feature."*
- *"Ticket đâu? Không có ticket là không làm."*
- *"Mình ship trước, fix sau."*
- *"Ai deploy giờ này vậy?"*
- *"Anh nghĩ cái này đơn giản thôi, chừng 2 tiếng."* (CEO, về một tính năng mất 3 tuần)
- *"Mình là startup mà em."* (đáp án cho mọi câu hỏi về quy trình, lương, ghế ngồi)
- *"Có ai thấy tin nhắn của anh không?"*
- *"Đợi anh merge xong đã."*
- *"Mình align lại scope nha."*

### 1.7 Jargon

| Từ | Nghĩa (và nghĩa thật) |
|---|---|
| **Sprint** | Chu kỳ làm việc 2 tuần. Thực tế: cuộc chạy marathon được gọi là "nước rút". |
| **Backlog** | Danh sách việc cần làm. Nghĩa thật: nghĩa địa ý tưởng. |
| **Ticket / task** | Một đầu việc trên Jira. "Không có ticket thì không tồn tại." |
| **User story** | "Là người dùng, tôi muốn…". Intern PM viết 50 cái một tuần. |
| **Story point** | Đơn vị ước lượng độ phức tạp. Bị dùng sai thành giờ làm hoặc KPI. |
| **Estimate** | Ước lượng thời gian. CEO coi đó là lời hứa. |
| **Planning poker** | Cả team giơ số để estimate. Ai giơ số cao bị nhìn. |
| **Daily / stand-up** | Họp đứng hằng ngày, 15 phút trên lý thuyết. |
| **Retro** | Họp nhìn lại sprint: Start / Stop / Continue. Hay thành buổi đổ lỗi. |
| **Blocker** | Thứ đang chặn mình. Thường là "đợi anh Khôi review". |
| **PR / MR** | Pull/Merge request: xin gộp code. |
| **Code review** | Người khác đọc code của mình. Nơi senior thể hiện. |
| **LGTM** | "Looks good to me": duyệt, đôi khi duyệt mà không đọc. |
| **nit:** | Góp ý vụn vặt (đặt tên biến, dấu cách). Có thể có 40 cái. |
| **Merge conflict** | Code hai người đụng nhau. |
| **Deploy / release** | Đưa code lên môi trường chạy thật. |
| **Staging / UAT / Prod** | Môi trường thử, môi trường để khách nghiệm thu, môi trường thật. "Trên staging chạy được mà." |
| **Hotfix** | Bản sửa gấp trên production. |
| **Rollback / revert** | Quay về bản cũ khi bản mới làm sập. |
| **Regression** | Test lại toàn bộ để chắc sửa cái này không vỡ cái kia. |
| **Bug P0 / P1** | Mức độ nghiêm trọng. P0 là "bỏ hết mọi thứ". |
| **Incident** | Sự cố production. |
| **On-call** | Trực sự cố, điện thoại phải bật chuông. |
| **Postmortem** | Biên bản sau sự cố, "blameless" trên giấy. |
| **Tech debt** | Nợ kỹ thuật: code tạm bợ để kịp deadline. |
| **Refactor** | Viết lại cho sạch. Từ dev hay xin mà PM hay từ chối. |
| **Feature flag** | Công tắc bật/tắt tính năng. Cứu tinh khi demo. |
| **A/B test** | Thử hai phiên bản. Hay bị gọi tên mà không làm. |
| **MVP** | Sản phẩm khả dụng tối thiểu. Thường là "tối thiểu", ít khi "khả dụng". |
| **MAU / DAU** | Người dùng hoạt động tháng/ngày. Định nghĩa co giãn. |
| **Churn / retention** | Tỉ lệ người dùng bỏ đi / ở lại. |
| **OKR** | Objectives & Key Results. "Become #1 super app in Vietnam" với 80 người. |
| **KPI** | Chỉ số đánh giá. Khác OKR ở chỗ có ảnh hưởng tới lương. |
| **Runway** | Số tháng công ty còn tiền để sống. |
| **Burn rate** | Tốc độ đốt tiền mỗi tháng. |
| **Seed / Series A / B** | Các vòng gọi vốn. |
| **Pivot** | Đổi hướng kinh doanh. Từ đáng sợ nhất ở all-hands. |
| **BrSE** | Bridge System Engineer: kỹ sư cầu nối với khách Nhật. |
| **Q&A list** | File Excel câu hỏi qua lại với khách Nhật. Có thể tới 300 dòng. |
| **Spec** | Tài liệu đặc tả. Với khách Nhật dày 200 trang, với CEO là một tin nhắn voice. |
| **Onsite** | Cử sang làm tại văn phòng khách (Nhật, Úc). |
| **1:1** | Họp riêng với quản lý. Nếu HR tham gia thì không phải 1:1 nữa. |
| **Brownbag** | Buổi chia sẻ kiến thức giờ trưa, có pizza. |
| **Hackathon** | Code xuyên cuối tuần "tự nguyện". |
| **Vesting / ESOP** | Cổ phần nhân viên. Thứ khiến người ta ở lại mà không ai hiểu. |

---

## 2. Flow làm việc

### 2.1 Một ngày của intern dev/QA/PM

| Giờ | Intern Dev | Intern QA | Intern PM/BA |
|---|---|---|---|
| 9h00 | Pull code, build hỏng vì ai đó đổi config | Mở 7 điện thoại test, 3 cái hết pin | Đọc 74 tin nhắn Slack từ tối qua |
| 9h30 | Stand-up: "Hôm qua em đọc code, hôm nay em đọc tiếp" | Stand-up: "Em còn 4 bug đợi dev confirm" | Ghi biên bản stand-up, không ai đọc |
| 10h30 | Bị gọi vào "quick sync" về một bug không phải của mình | Viết test case cho tính năng chưa có spec | Họp với chị Vân về roadmap quý (thứ 3 trong tháng) |
| 12h00 | Ăn trưa, cả team bàn chuyện "công ty X vừa layoff" | Ăn trưa | Ăn trưa với CEO, nghe ý tưởng mới |
| 13h30 | Code, rồi chờ review | Regression test bản release | Viết lại user story theo ý tưởng mới |
| 15h00 | PR bị 23 comment "nit:" | Báo bug, dev reply "works on my machine" | Cập nhật Jira, đổi sprint |
| 17h00 | Sửa PR | Quay video bằng chứng bug | Làm slide cho CEO "chỉ 5 slide" (thành 22) |
| 18h00 | Ngại về, ngồi tới 19h | Về | CEO nhắn "em ơi" |
| 23h00 | Ánh đèn #incident nhấp nháy | – | Sửa slide |

### 2.2 Một sprint (2 tuần)

- **Ngày 1 (thứ Hai): Sprint Planning** 2–3 tiếng. Estimate, kéo ticket vào sprint, cam kết nhiều hơn khả năng 30%.
- **Ngày 2–8:** code, review, test. Giữa sprint CEO chèn "việc gấp", PM đổi scope, có người nói "mình align lại nha".
- **Ngày 9: Code freeze** (đóng băng code) trên lý thuyết. Thực tế vẫn có PR "nhỏ thôi" lọt vào.
- **Ngày 10 (thứ Năm tuần 2): Release** lên staging, QA chạy regression, fix, release prod buổi chiều. Ai cũng ở lại.
- **Ngày 10, chiều: Sprint Review / Demo**, tính năng demo bằng feature flag và dữ liệu giả.
- **Ngày 10, cuối ngày: Retro.** Bảng Start/Stop/Continue lặp lại y như sprint trước: "Stop: đổi scope giữa sprint".

### 2.3 Một tháng / quý

- **Tuần 1:** chốt OKR quý (đầu quý). CEO viết lại Objective lần thứ 4.
- **Giữa tháng:** báo cáo số liệu cho nhà đầu tư (monthly investor update). Data intern kéo số lúc 23h.
- **Cuối tháng:** all-hands, happy hour, kudos. Kết quả KPI tháng. Lương về (đôi khi trễ vài ngày năm khó khăn).
- **Cuối quý:** performance review (6 tháng một lần cho nhân viên, cuối kỳ thực tập cho intern), xét lương. "Ngân sách năm nay hơi khó."
- **Mùa gọi vốn:** cả công ty "chạy demo", đếm MAU, dọn văn phòng đón nhà đầu tư, cấm mặc dép.
- **Dự án Nhật:** mốc nghiệm thu theo hợp đồng, "deadline là deadline". OT cuối giai đoạn, tuần nghiệm thu Q&A list dày lên.
- **Sự kiện năm:** hackathon (tháng 6), year-end party (tháng 1), review lương (tháng 3), layoff (không lên lịch, nhưng thường sau một vòng gọi vốn thất bại).

---

## 3. Performance review

### 3.1 Startup đánh giá intern thế nào

- **Form 360 trên Google Form**, 15 câu chấm 1–5: "Ownership", "Growth mindset", "Communication", "Bias for action"… (copy giá trị cốt lõi của một hãng công nghệ Mỹ).
- **Mentor** là một dev senior bận rộn, gặp intern 1:1 hai lần trong 2 tháng. Nhận xét viết 15 phút trước buổi review.
- **Tiêu chí ngầm:** (1) có tự xử lý được không mà không hỏi quá nhiều, (2) có "visible" với CEO không, (3) có ở lại khi team OT không, (4) có số PR/ticket đóng được đếm trên Jira không.
- **Kết quả:** "Offer Fresher" (phổ biến khi công ty đang tuyển), "gia hạn thực tập 2 tháng" (khi không chắc hoặc hết headcount), hoặc "cảm ơn em, mình giữ liên lạc nhé" (khi đang freeze tuyển dụng).
- **Tình hình thị trường:** sau làn sóng layoff công nghệ, có công ty hủy offer đúng ngày đi làm hoặc phỏng vấn xong rồi im lặng tới khi có hợp đồng khách. Vì vậy intern "được offer" chưa chắc đã được đi làm.

### 3.2 Câu feedback "đời"

1. "Em rất chủ động. Lần sau chủ động hỏi trước khi chủ động deploy nhé."
2. "Code em clean lắm, chỉ là nó không chạy."
3. "Em có growth mindset tốt. Bằng chứng là còn rất nhiều chỗ để grow."
4. "Em giao tiếp tốt, Slack em reply nhanh nhất team. Mà sao Jira không cập nhật?"
5. "Em không gây ra bug nào trên prod. Vì em chưa deploy gì lên prod."
6. "Em rất được việc. Cho nên sprint sau anh giao thêm cho em việc của Minh."
7. "Em có ownership cao, ownership luôn cả bug của người khác."
8. "Em đặt câu hỏi rất hay, hơi nhiều thôi."
9. "Test case em viết kỹ quá, dev đọc không nổi."
10. "Slide em đẹp, anh Đăng thích. Cái đó quan trọng hơn em nghĩ."
11. "Em rất 'culture fit'. Mình chưa có headcount cho culture fit."
12. "Em làm tốt hơn kỳ vọng. Kỳ vọng ban đầu hơi thấp."
13. "Feedback chung: em cần visible hơn. Ví dụ đăng LinkedIn về công ty."
14. "Em đóng được 34 ticket. Ticket nào cũng size S, nhưng con số đẹp."

---

## 4. Tình huống drama

1. **Thứ Sáu 17h, deploy.** Minh nhờ intern bấm deploy "giùm anh, pipeline xanh rồi" rồi đi về. 17h20 app báo lỗi thanh toán, CTO hỏi trong #incident: "Ai deploy?"
   - A) Nhận là mình bấm, đưa log cho thấy là code của Minh → CTO tôn trọng, Minh ghim [UT++, QH(Minh)−].
   - B) Im lặng chờ Minh trả lời → 20 phút sau CTO tra log thấy tên intern [UT−−].
   - C) Rollback ngay theo hướng dẫn trên Confluence (tài liệu cũ nhưng vẫn đúng) → cứu được, rồi giải thích [UT+++, NL−].

2. **git blame oan.** Một bug P1 từ dòng code mà `git blame` hiện tên intern, vì intern chỉ chạy format code. Tech lead nhắc tên intern trong postmortem "blameless".
   - A) Đưa diff chứng minh → anh Khôi im, hai tuần sau giao việc khó hơn [QH(Khôi)−, UT+].
   - B) Nhận lỗi cho êm → được tiếng "chịu trách nhiệm", nhưng hồ sơ có vết [UT±].
   - C) Đề xuất sửa quy trình (bỏ qua commit format khi blame) → được ghi nhận ở retro [UT++].

3. **Lời hứa 2 tuần.** CEO hứa với nhà đầu tư tính năng "AI gợi ý thực đơn" trong 2 tuần. Team estimate 2 tháng. PM bảo intern "làm prototype demo được là được".
   - A) Làm demo bằng dữ liệu cứng (hardcode) → demo trơn tru, nhà đầu tư hỏi "khi nào ra mắt?" [DR++].
   - B) Ghi rõ "prototype, chưa có thật" trong slide → CEO xoá dòng đó [QH(CEO)−].
   - C) Đề xuất bản nhỏ: chỉ gợi ý theo lịch sử mua → làm được trong 2 tuần [UT+++].

4. **Stand-up 15 phút, 47 phút.** Stand-up thứ ba trong tuần kéo dài 47 phút vì anh Khôi và chị Vân tranh luận API. Intern có lịch test với khách lúc 10h.
   - A) Rời họp giữa chừng → bị nhắc "thiếu tôn trọng team" [QH(Vân)−].
   - B) Ngồi lại, trễ khách → khách Nhật gửi email "残念です" [UT−].
   - C) Nhẹ nhàng đề xuất "parking lot" (ghi lại chủ đề, bàn sau) → được làm Scrum Master bất đắc dĩ [UT+, NL−].

5. **"Không reproduce được."** Intern QA báo bug crash trên một dòng Android đời cũ. Minh đóng ticket "Cannot reproduce" ba lần.
   - A) Quay video, gửi log, mang điện thoại tới tận bàn Minh → Minh sửa, mặt khó chịu [UT+].
   - B) Escalate lên chị Hằng → Minh nói intern "méc" [QH(Minh)−−].
   - C) Bỏ qua → bản release crash với 8% người dùng [DR+++].

6. **Pixel-perfect vs "khó làm".** Lan Design phát hiện màn checkout lệch 4px và sai màu. Minh bảo "ai mà để ý". Hai người tag intern vào thread Figma 60 comment.
   - A) Đứng về phía Design → Minh không giúp intern debug nữa [QH(Minh)−].
   - B) Đứng về phía Dev → Lan "seen" intern một tuần [QH(Lan)−].
   - C) Gom thành checklist "UI bug" có ưu tiên → cả hai đồng ý, PM thích [UT++].

7. **CEO đọc một bài báo.** 22h Chủ nhật, CEO gửi link về "AI agent" vào #general: "Team nghĩ sao nếu sprint này mình làm cái này?" Sprint đã chốt.
   - A) Reply hào hứng → được giao làm nghiên cứu, mất cuối tuần [QH(CEO)+, NL−−].
   - B) Không reply → thứ Hai bị hỏi "team mình có ai đọc #general không?" [hài].
   - C) Reply "em note vào backlog để mình đánh giá ở planning sau" → PM thả tim, CEO thấy "chuyên nghiệp" [UT+].

8. **Dashboard "đẹp".** Trước buổi gặp quỹ, CEO nhờ intern data "tính lại MAU", tính cả người chỉ mở thông báo đẩy.
   - A) Làm theo, ghi chú định nghĩa ở chân slide → CEO xoá chân slide [DR+].
   - B) Từ chối, đưa hai con số kèm định nghĩa → CEO giận, CTO âm thầm ủng hộ [QH(CEO)−, QH(Tú)+].
   - C) Làm theo không ghi chú → sau này due diligence phát hiện, intern bị gọi giải trình [DR++++].

9. **"Quick sync 15 phút".** Thứ Tư 9h, intern nhận lời mời họp 15 phút với chị Thu (People). Slack của 12 người trong kênh #squad-ai đã chuyển "deactivated".
   - A) Vào họp → hoá ra intern được giữ, nhưng phải gánh việc của 2 người vừa bị cắt [NL−−−].
   - B) Hỏi trước trên Zalo → biết danh sách, rò rỉ cho đồng nghiệp [DR++].
   - C) Vào họp, hỏi thẳng tiêu chí layoff → chị Thu lúng túng, sau đó thông báo minh bạch hơn [UT+].

10. **2h sáng, PagerDuty.** Server ví bị đầy ổ, anh Phong DevOps không nghe máy. Intern có quyền truy cập vì "lần trước cấp quên thu hồi".
    - A) Tự xoá log cũ theo hướng dẫn → cứu được, sáng ra CTO vừa cảm ơn vừa thu quyền [UT++].
    - B) Gọi liên tục cho CTO → CTO dậy, sửa, ghi nhận intern "biết escalate" [UT+].
    - C) Xoá nhầm thư mục → incident 2 tiếng [DR++++].

11. **OKR "trở thành số 1".** Intern PM được giao viết Key Result cho Objective "Trở thành siêu ứng dụng số 1 Việt Nam" với quý còn 6 tuần.
    - A) Viết KR "tăng 500% MAU" → CEO thích, team chửi [QH(CEO)+, QH(team)−].
    - B) Viết KR thực tế → CEO chê "thiếu tham vọng" [QH(CEO)−].
    - C) Viết hai bản, "Moonshot" và "Commit" → được khen, giờ phải theo dõi cả hai [UT+, NL−].

12. **"Đi đày" dự án Nhật.** Intern bị điều sang test thủ công 1.200 test case cho khách Nhật, Q&A list tới dòng 147. Khách gửi mail "Why bug?" lúc 7h sáng giờ Việt Nam.
    - A) Chăm chỉ làm, học vài câu tiếng Nhật → BrSE muốn giữ lại, sản phẩm chính quên mất intern [QH(BrSE)++].
    - B) Xin quay về sản phẩm chính → bị đánh giá "kén việc" [UT−].
    - C) Viết script tự động hoá 300 case → bị nghi "làm ẩu", tới khi kết quả chuẩn hơn người làm tay [UT+++].

13. **Cháu nhà đầu tư.** Bảo Ngọc, intern PM, được mời dự họp board và lấy mất phần trình bày roadmap mà intern chuẩn bị. Ngọc trình bày tốt nhờ đọc slide của intern.
    - A) Lên tiếng sau họp với chị Vân → chị Vân thông cảm nhưng không làm gì [NL−].
    - B) Kết thân với Ngọc → về sau Ngọc kể bí mật vòng gọi vốn [QH(Ngọc)++, mở bí mật].
    - C) Đăng "status ẩn ý" → bị hỏi chuyện [DR++].

14. **Hackathon "tự nguyện".** Hackathon thứ Bảy, Chủ nhật, giải nhất là voucher app Bắp 2 triệu. Không đi thì "thiếu tinh thần".
    - A) Đi, làm hết sức → đoạt giải, ý tưởng bị CEO "sẽ ra mắt" nhưng không ghi tên [UT+, NL−−].
    - B) Không đi → không ai nói gì, nhưng ảnh nhóm không có mình [QH(team)−].
    - C) Đi, làm dự án hài "Bắp tình duyên" → viral nội bộ, CEO ghi nhớ mặt [QH(CEO)+, hài].

15. **"Văn hoá phẳng".** Trong buổi Ask Me Anything, CEO nói "ai cũng có thể góp ý anh". Intern hỏi thật: "Runway còn bao lâu ạ?"
    - A) CEO trả lời vòng vo → cả phòng nhìn intern [DR++, UT+ với nhân viên].
    - B) CEO trả lời thật → không khí chùng xuống, CTO nhắn "câu hỏi hay" [UT++].
    - C) Intern rút câu hỏi → không gì xảy ra [NL+].

16. **Code review "nit" vô tận.** PR đầu tiên của intern nhận 47 comment "nit:", để mở 9 ngày, chặn cả squad.
    - A) Sửa hết, không cãi → học được nhiều, chậm sprint [NL−, UT+].
    - B) Hẹn 1:1 với anh Khôi, đề xuất tách PR → được duyệt trong 1 ngày [UT++].
    - C) Nhờ người khác approve "cho nhanh" → anh Khôi biết [QH(Khôi)−−].

17. **Dev bị giao làm slide.** Intern dev bị CEO giao "làm giúp anh pitch deck, em có mắt thẩm mỹ", deadline sáng mai. Ticket code cũng deadline sáng mai.
    - A) Làm slide → CEO thích, sprint trễ, Tech Lead phàn nàn [QH(CEO)+, QH(Khôi)−].
    - B) Làm ticket → CEO tự làm slide xấu, nhắc chuyện này ở review [QH(CEO)−].
    - C) Hỏi CEO ưu tiên cái nào bằng tin nhắn có tag PM → PM đứng ra xử [UT+].

18. **Ticket ma.** Jira có ticket "Fix everything before launch" do CEO tạo, gán cho intern, không mô tả, priority Highest.
    - A) Hỏi CEO cụ thể là gì → CEO "em tự nghĩ đi" [NL−].
    - B) Tách ra 15 ticket cụ thể, xin PM duyệt → thành "người hiểu ý CEO" [UT++].
    - C) Để đó → ticket tự chuyển "Done" do bot dọn backlog [hài].

19. **Crush trên Slack.** Intern và Lan Design nhắn DM về Figma tới 23h đêm. Hôm sau team trêu "hai bạn sync hơi nhiều nhỉ".
    - A) Hẹn đi cà phê ngoài giờ → mối quan hệ ngọt, dễ thành drama nếu Lan rời đi [QH(Lan)++].
    - B) Giữ chuyên nghiệp → Lan hơi hụt hẫng [QH(Lan)±].
    - C) Phát hiện Lan thích anh Khôi → chuyển thành "quân sư tình yêu" [DR+, hài].

20. **Lộ API key.** Intern push nhầm file `.env` có key thanh toán lên repo public cá nhân. Bot bảo mật gửi cảnh báo 30 phút sau.
    - A) Báo ngay CTO → xoay key trong 1 tiếng, postmortem có tên nhưng được khen trung thực [UT+].
    - B) Lẳng lặng xoá repo → key vẫn còn trong lịch sử, 3 ngày sau có giao dịch lạ [DR++++].
    - C) Hỏi Minh → Minh bảo "anh cũng từng bị", giúp xử lý êm [QH(Minh)++].

21. **Bảng lương công khai.** Intern mở thư mục Google Drive "Finance 2025", thấy file lương "anyone with link can view". Biết intern PM (Ngọc) nhận gấp 3 lần mình.
    - A) Báo HR tắt quyền chia sẻ, không nói gì thêm → HR mang ơn [QH(Thu)++].
    - B) Kể cho nhóm intern → cả đám đòi đàm phán lại [DR+++].
    - C) Dùng làm đòn bẩy khi đàm phán offer → hiệu quả nhưng hiểm [UT±].

22. **Quay lại văn phòng 5 ngày.** Công ty bỏ hybrid, bắt check-in bằng app lúc 9h. App check-in là sản phẩm do intern làm, đang lỗi định vị.
    - A) Sửa bug app → được khen, mọi người ghét app [UT+, QH(team)−].
    - B) "Quên" sửa một tuần → mọi người check-in từ nhà [hài, DR+].
    - C) Báo cáo dữ liệu cho thấy năng suất không đổi khi WFH → CEO "để anh suy nghĩ" [UT+].

23. **Ý tưởng bị nhận vơ.** Tính năng "giỏ đi chợ chung cho cả nhà" do intern đề xuất ra mắt thành công. CEO đăng LinkedIn: "Một đêm mất ngủ, tôi nghĩ ra…".
    - A) Comment "rất vui được góp phần" kèm tag → CEO thả tim, team biết [UT+].
    - B) Im lặng → CTO nói riêng "anh biết là của em" [QH(Tú)+].
    - C) Đăng bài riêng kể chuyện → viral, CEO khó chịu [DR+++].

24. **"Sửa số dư giùm."** CS nhờ intern backend "sửa trực tiếp trong DB" số dư ví của một khách VIP bị trừ sai, vì "ticket thì lâu lắm".
    - A) Làm → đúng số, nhưng không có log kiểm toán, finance hỏi tới [DR++].
    - B) Từ chối, tạo ticket P1 và gọi tech lead → chậm 2 tiếng, đúng quy trình [UT+].
    - C) Làm, nhưng ghi đầy đủ vào ticket và xin duyệt sau → nửa đúng [UT±].

25. **Cấm dùng AI, trừ sếp.** Công ty ra quy định cấm dán code vào chatbot AI vì bảo mật. Intern thấy anh Khôi làm đúng việc đó. Hôm sau intern bị bắt gặp dùng AI viết test.
    - A) Nhận lỗi, không khai anh Khôi → anh Khôi nợ intern một lần [QH(Khôi)++].
    - B) "Anh Khôi cũng dùng mà" → hai người cùng bị nhắc, anh Khôi cạch mặt [QH(Khôi)−−].
    - C) Đề xuất công ty mua bản AI doanh nghiệp → được giao viết đề xuất [UT+, NL−].

26. **Retro thành phiên toà.** Retro sau sprint thất bại. Chị Vân viết lên bảng: "Stop: intern merge không hỏi".
    - A) Giải thích bằng bằng chứng (anh Khôi đã approve) → không khí căng [DR+].
    - B) Nhận một phần, đề xuất checklist merge → được ghi nhận [UT+].
    - C) Viết lên bảng "Stop: đổi scope giữa sprint" → cả team vỗ tay, PM đỏ mặt [UT++ với team, QH(Vân)−].

27. **App Store từ chối.** Ngày ra mắt tính năng mới, App Store từ chối bản build vì thiếu nút xoá tài khoản. Growth đã book 5 KOL đăng lúc 20h.
    - A) Xin KOL dời lịch → mất phí dời, Growth ghét intern [QH(Kiên)−].
    - B) Làm nhanh nút xoá tài khoản, gửi duyệt nhanh → kịp 22h, KOL đăng trễ 2 tiếng [UT++, NL−−].
    - C) Để KOL đăng link web tạm → chuyển đổi kém [UT±].

28. **Pivot.** Sau họp board, CEO thông báo pivot từ "đi chợ" sang "AI agent cho doanh nghiệp nhỏ". Squad Đi Chợ, nơi intern đang làm, giải thể từ thứ Hai.
    - A) Xin vào squad AI → phải học lại từ đầu, được CEO chú ý [QH(CEO)+, NL−].
    - B) Xin sang Bắp Solutions (outsource) → an toàn, nhàm [UT±].
    - C) Bắt đầu nộp CV nơi khác → cảnh kết thúc chương "nhảy việc" mở ra [kết thúc].

29. **Lương trễ.** Ngày 5 lương chưa về. CEO gửi email "Chúng ta là một gia đình, xin mọi người thông cảm thêm 7 ngày". Cùng ngày CEO đăng ảnh đi hội nghị công nghệ ở Singapore.
    - A) Im lặng chờ → lương về ngày 12 [NL−].
    - B) Hỏi trong AMA → nhân viên cảm ơn intern, CEO nhớ mặt [UT+ (team), QH(CEO)−].
    - C) Nói chuyện với chị Thu → biết sắp có layoff, phải chọn kể hay không [DR++].

30. **Intern phỏng vấn senior.** Thiếu người, intern được kéo vào ngồi phỏng vấn ứng viên senior 10 năm kinh nghiệm, ghi chú "culture fit".
    - A) Hỏi câu kỹ thuật thật → ứng viên tôn trọng, sau thành mentor [QH(mới)+].
    - B) Chỉ ghi chép → ứng viên hỏi "em là intern à?", không khí ngượng [hài].
    - C) Chấm "không fit" vì ứng viên nói xấu startup → ứng viên viết review công ty trên mạng [DR+].

---

## 5. Sự kiện ngày thường

1. Build CI chạy 40 phút rồi fail vì một test "flaky" (lúc pass lúc fail). [NL−]
2. Wi-Fi văn phòng sập, cả công ty phát 4G từ điện thoại. [NL−]
3. CEO nhắn "em ơi" lúc 23h14, rồi im. [NL−]
4. Bot #deploy báo "Deploy failed 🙏". [DR+]
5. Một người reply "+1" vào thread 80 người. [hài]
6. Stand-up kéo dài, bị lố giờ ăn trưa. [NL−]
7. Máy lạnh phòng "Bún Bò" hỏng, họp như xông hơi. [NL−]
8. Ai đó để "status: 🌴 OOO" mà vẫn reply Slack. [hài]
9. Laptop công ty là MacBook đời 2019, pin còn 40 phút. [NL−]
10. Có bánh sinh nhật trong pantry, không ai biết của ai. [NL+]
11. PR được approve trong 2 phút. Nghi ngờ người duyệt không đọc. [UT±]
12. Jira chậm như rùa đúng giờ planning. [NL−]
13. Figma comment: "Cái này em thấy chưa 'wow'." (CEO) [NL−]
14. Có người gửi meme "It's not a bug, it's a feature" lần thứ 300. [hài]
15. QA tìm ra bug 30 phút trước release. [DR+]
16. Chị Hằng QA mua trà sữa cho cả team vì release êm. [NL+]
17. Server staging bị ai đó tắt "cho đỡ tốn tiền". [NL−]
18. Ticket bị đổi assignee 4 lần trong 1 ngày. [hài]
19. Kênh #random bàn chuyện công ty khác vừa layoff, không ai nói gì về công ty mình. [DR+]
20. Bị "@channel" lúc 7h sáng Chủ nhật. [NL−]
21. Khách Nhật gửi mail cảm ơn có emoji, cả team chụp màn hình lưu niệm. [NL+]
22. Mentor đổi lịch 1:1 lần thứ ba. [QH(mentor)−]
23. HR gửi khảo sát "mức độ hạnh phúc" ẩn danh, link có kèm email người làm. [hài]
24. Ai đó quên mute mic, cả họp nghe tiếng xào rau. [hài]
25. Thư viện open-source nâng phiên bản, nửa project đỏ lòm. [NL−]
26. CEO đổi ảnh đại diện Slack thành ảnh với một nhà đầu tư nổi tiếng. [hài]
27. Pizza happy hour hết trước khi intern tới. [NL−]
28. Anh Phong DevOps xin nghỉ ốm, cả công ty run rẩy. [DR+]
29. App bị đánh giá 1 sao: "App đi chợ mà không bán rau muống?" [hài]
30. Intern được thêm vào kênh #leadership nhầm, bị xoá sau 2 phút. [DR+]
31. Confluence page "Onboarding" cập nhật lần cuối năm 2022. [NL−]
32. Mật khẩu Wi-Fi đổi, chỉ có lễ tân biết, lễ tân nghỉ phép. [hài]
33. CTO khen một dòng code của intern trong #general. [UT++]
34. Có bạn đồng nghiệp đi onsite Nhật về, mang KitKat vị trà xanh. [NL+]
35. Ticket intern làm 3 ngày bị đóng "Won't do". [NL−]
36. Họp all-hands chiếu slide "Runway: 18 tháng" (tháng trước là 12). [DR+]
37. Bị dev hỏi "spec ở đâu?" và không có spec. [NL−]
38. Slack hiện "Minh is typing…" suốt 5 phút, rồi gửi "ok". [hài]
39. Máy pha cà phê văn phòng bị ghi tên "BEDROCK INFRASTRUCTURE – KHÔNG ĐƯỢC TẮT". [hài]
40. LinkedIn báo: "Chị Vân đã cập nhật hồ sơ: Open to work". [DR++]
41. Release êm, không ai nhắc tới, như chưa từng xảy ra. [NL+]
42. Có người gửi link "Công ty Bắp Labs review" trên một trang đánh giá công ty. [DR+]
43. HR tổ chức "Wellness Wednesday": yoga 15 phút trong phòng họp "Cơm Tấm". [hài]
44. Đổi bàn ngồi theo "squad mới", intern không có bàn. [NL−]
45. Intern được cấp quyền admin production nhầm. [DR+]

---

## 6. Nghỉ việc, layoff và "lên chính thức"

### 6.1 Lý do nghỉ / bị layoff sau khi lên chính thức

1. **Layoff sau vòng gọi vốn thất bại:** thị trường vốn mạo hiểm co lại (năm 2025 ước khoảng 215 triệu USD, 41 thương vụ, giảm khoảng 30% theo một báo cáo được trích dẫn), startup cắt "bộ phận không cốt lõi" trước: Growth, CS, squad thử nghiệm.
2. **Pivot:** cả squad bị giải thể vì công ty đổi hướng. "Không phải do em, do chiến lược."
3. **Mất khách outsource:** khách Nhật hoặc Úc cắt hợp đồng, team Solutions giảm mạnh. Báo chí ghi nhận có công ty outsource cắt tới 90% nhân sự.
4. **Lương:** khảo sát ngành IT nhiều năm cho thấy "muốn lương cao hơn" là lý do số 1 để nhảy việc, tiếp theo là thăng tiến.
5. **Burnout vì OT, on-call và "ship nhanh":** làm thêm như một "huy chương" (người về nước kể lại cú sốc văn hoá này), cuối cùng nghỉ.
6. **Quản lý tệ hoặc mentor vắng mặt:** không được ghi nhận, không có lộ trình. Gen Z hay nghỉ vì cảm giác không được lắng nghe hơn là vì lương.
7. **Văn hoá "phẳng" chỉ trên khẩu hiệu:** quyết định đến từ hai người, mọi retro đều lặp lại vấn đề cũ.
8. **Lương trễ hoặc ESOP vô giá trị:** công ty khó khăn, cổ phần không có lối ra.
9. **Bị "săn":** công ty lớn hoặc nước ngoài trả hơn 30–50%, remote.
10. **AI làm thay một phần việc:** dự án outsource ít đi, budget giảm (dân trong nghề than trên diễn đàn), headcount QA test thủ công bị cắt.

### 6.2 Kịch bản "intern lên chính thức" thực tế

- **Tuần 6–8 thực tập:** mentor được HR hỏi "có muốn giữ bạn này không?". Câu trả lời phụ thuộc headcount chứ không phải năng lực.
- **Buổi review cuối kỳ (30 phút):** mentor đọc form 360, khen 3 điểm, góp ý 2 điểm "để phát triển". HR nói "bên mình sẽ gửi offer trong tuần".
- **Offer:** chức danh **Fresher** (dev/QA/BA), lương fresher thị trường, 2 tháng thử việc (lương 85%), cộng gói "phúc lợi": bảo hiểm sức khoẻ, MacBook, 12 ngày phép, "ESOP sau 1 năm".
- **Rủi ro thực tế:** offer có thể bị "tạm hoãn" nếu đúng lúc công ty freeze tuyển dụng. Có trường hợp hủy vào ngày bắt đầu.
- **Sau khi lên chính thức:** nhận ngay on-call, nhận ticket của người vừa nghỉ, được add vào kênh #incident với quyền thật.
- **Biến thể kết thúc cho game:**
  - *"Fresher trung thành":* ở lại, sống sót qua layoff, lên Junior.
  - *"Đi đày vĩnh viễn":* chuyển sang team outsource Nhật, đi onsite Tokyo.
  - *"Theo CTO ra riêng":* CTO nghỉ lập startup mới, rủ theo.
  - *"Layoff trong tuần đầu chính thức":* cuộc gọi "quick sync 15 phút", mở chương mới.

---

## 7. Nguồn tham khảo

> **[đọc]**: đã mở và đọc nội dung. **[trích]**: chỉ xem trích đoạn qua công cụ tìm kiếm. Phần không có nguồn (câu cửa miệng, nhân vật, tên kênh Slack…) là **kinh nghiệm phổ biến, chưa có nguồn**.

1. VnExpress International: "Tech layoff wave spreads to Vietnam". Công ty outsource cắt tới 90% nhân sự, offer bị huỷ lúc sắp ký, phỏng vấn xong im lặng tới khi có hợp đồng khách. **[đọc]** https://e.vnexpress.net/news/business/economy/tech-layoff-wave-spreads-to-vietnam-4672046.html
2. VnExpress: "Bất ngờ bị sa thải" (Lê Văn Thành). Email layoff tối 29 Tết, nhân viên chỉ biết khi không quẹt được thẻ, 272 công ty công nghệ sa thải 86.882 người trong tháng 1/2023. **[đọc]** https://vnexpress.net/bat-ngo-bi-sa-thai-4566953.html
3. VnExpress International: "Work culture shocks returning overseas Vietnamese". OT bình thường hoá, năng suất bị đo bằng thời gian ngồi văn phòng, tâm lý ngại hỏi, nhậu bàn công việc, "OT như huy chương" ở một startup Hà Nội. **[đọc]** https://e.vnexpress.net/news/life/trend/work-culture-shocks-returning-overseas-vietnamese-4917476.html
4. VnExpress International: "Most Vietnamese IT staff want to switch jobs". Trên 60% muốn đổi việc trong 6 tháng, 47,5% vì lương, 15,7% vì thăng tiến (khảo sát VietnamWorks 2018). **[đọc]** https://e.vnexpress.net/news/business/data-speaks/most-vietnamese-it-staff-want-to-switch-jobs-3894639.html
5. VnExpress: "Bội thực chat nhóm". Nhân viên ở 15–20+ nhóm chat, sếp nghĩ "online là sẵn sàng nhận việc", không trả lời ngay bị coi là thiếu chuyên nghiệp. **[đọc]** https://vnexpress.net/boi-thuc-chat-nhom-4500761.html
6. Viblo: "Khi các practice Agile bị hiểu sai". Story point bị dùng như giờ hoặc chỉ tiêu, quá nhiều buổi họp, báo cáo cho quá nhiều người. **[đọc]** https://viblo.asia/p/khi-cac-practice-agile-bi-hieu-sai-m2vJPeOqLeK
7. Viblo: "Đặc trưng mô hình Scrum: những sai lầm thường mắc phải khi tiến hành một buổi daily stand-up meeting". Timebox bị trượt khi người ngoài sprint góp ý kỹ thuật. **[trích]** https://viblo.asia/p/dac-trung-mo-hinh-scrum-nhung-sai-lam-thuong-mac-phai-khi-tien-hanh-mot-buoi-daily-stand-up-meeting-va-mot-so-huong-khac-phuc-PwRGgWKAGEd
8. Bizhub / Vietnam News: "Việt Nam's start-up market enters restructuring phase". Vốn mạo hiểm năm 2025 ước khoảng 215 triệu USD, 41 thương vụ, giảm khoảng 30% (theo VinVentures). **[trích]** https://bizhub.vietnamnews.vn/viet-nams-start-up-market-enters-restructuring-phase-post396261.html
9. VnEconomy: "Các công ty khởi nghiệp ở Đông Nam Á khó khăn sau mùa đông gọi vốn". Ưu tiên lợi nhuận hơn tăng trưởng, cắt bộ phận kém hiệu quả. **[trích]** https://vneconomy.vn/techconnect/cac-cong-ty-khoi-nghiep-o-dong-nam-a-kho-khan-sau-mua-dong-goi-von.htm
10. VnReview: Better.com sa thải qua Zoom, nhân viên sợ mỗi lần nhận lời mời họp. **[trích]** https://vnreview.vn/thread/fintech-unicorn-my-sa-thai-tho-bao-den-noi-nhan-vien-sang-chan-moi-khi-nhan-loi-moi-hop-zoom.562949953571261
11. VnExpress International: "Poor training makes up to 200,000 IT engineers unemployable: report" (dẫn báo cáo TopDev). **[trích]** https://e.vnexpress.net/news/business/economy/poor-training-makes-up-to-200-000-it-engineers-unemployable-report-4653509.html
12. TopDev: Vietnam Tech Talents Report 2024 (trang giới thiệu, số liệu đầy đủ phải đăng ký). **[đọc, chỉ trang giới thiệu]** https://topdev.vn/vietnam-tech-talents-report-topdev-2024
13. Diễn đàn VOZ: bình luận về công ty outsource khách Nhật "OT sấp mặt", từ 2025 AI làm việc outsource ít đi và budget giảm. Ý kiến cá nhân, không kiểm chứng. **[trích]** https://voz.vn/p/43144980/
14. Glints: hướng dẫn tuyển dụng tại Việt Nam, giới hạn làm thêm giờ (tối đa 40 giờ/tháng, 200 giờ/năm). **[trích]** https://talenthub.glints.com/hiring-guide/vietnam
15. Tuổi Trẻ: "'Tôi thực tập, thử việc, đâu phải người hầu mà bị sai vặt?'". Intern bị sai vặt, câu "khi bạn không tạo ra giá trị, bạn chính là chi phí" của một chủ doanh nghiệp. **[đọc]** https://tuoitre.vn/toi-thuc-tap-thu-viec-dau-phai-nguoi-hau-ma-bi-sai-vat-20250207114530262.htm
16. VietnamWorks HR Insider: Gen Z bị bắt nạt công sở. Ba lý do nghỉ việc chính là sếp, lộ trình sự nghiệp và môi trường. Gen Z hay nghỉ vì không được ghi nhận. **[trích]** https://www.vietnamworks.com/hrinsider/la-gen-z-chung-ta-bi-bat-nat-cong-so-va-thao-tung-tam-ly-nhu-the-nao.html
