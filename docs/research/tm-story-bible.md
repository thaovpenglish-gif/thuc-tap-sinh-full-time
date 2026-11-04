# T&M Partners — story notes for writers (from the Solo Story Bible doc)

Character Bible v3.0 rules (from the Game Owner): do NOT change titles, reporting lines, genders or core traits of the
T&M cast in `site/js/story/tm/characters.js`. Gấm = receptionist (Lễ tân kiêm Hành chính). Names are fictional.
Already played: Buổi đầu tiên (interview, `story/tm/prologue.js`) and Ngày 1 Onboarding (`story/tm/day1.js`).
Canon lines: Tuyết "Chị chỉ có một vài ý nhỏ thôi." · "Đây là phân tích, nhưng đâu là business implication?" ·
"Chị nghĩ các em cần nhìn vấn đề này ở góc độ chiến lược hơn." · Thư "Cái này không phải việc của em, nhưng mà…" ·
Linh "Chị không phản đối chiến lược. Chị phản đối việc triển khai chiến lược bằng một nhân viên rưỡi." ·
Hân mixes up buzzwords ("big pitcher", "aligment strategry với perfomance") · Khang "Actually, when I was overseas…" ·
Bình "Em restart máy thử chưa?" · Quỳnh "Để chị kiểm tra lại file đã nhé." / "bản gốc" · Gấm slow, writes in pencil ·
Bảo: Senior Intern 3 years · Long translates Hân → Vietnamese, says tao/mày with peers · Trang over-accepts work
("mình làm kịp mà") · Mai: youngest, Senior, asks "khách thật sự cần gì" · Đạt: Agile Coach hired by Hân, loves rituals ·
Hạ: research director, long "một ý nhỏ về phương pháp" · An: Strategy Associate, the only full-timer in Linh's team ·
Minh part-time (exams), Bảo Ngọc freelance (offline) · Phương HR & Culture, team building every Saturday ·
Mèo KPI = Employee of the Month. Xưng hô with the intern: Thư, Nhi, Trang, Long use "mình/bạn" (Long: "tao/mày" OK);
An "anh/em"; directors "chị/em".

## Planned episode list (from the doc; ✱ = uses a hidden relationship)
| # | Episode | Level | Cast | Conflict | Gameplay | Choices / resolution |
|---|---|---|---|---|---|---|
| 1 | Phòng họp ma ✱ | 1 | Gấm, Mai, khách | Gấm double-books the meeting room, client arrives 47 min early | Clear the room, make tea, move an internal meeting in 5 min | Cover for Gấm or tell Thư; Mai handles the client if asked |
| 2 | 27 ý nhỏ | 1 | Tuyết, Mai | Deck gets red comments at 23:00 | Mini-game: sort comments must / should / later | Pick the right 5 → Tuyết: "business implication rõ rồi" |
| 3 | Khách đã chuyển tiền chưa? | 1 | Quỳnh, Mai, Nhi | Client asks for invoice, nobody knows if paid | Reconcile Quỳnh's 3 Excel files with the bank statement | Find the match → Quỳnh trusts you |
| 4 | Literature review 200 trang | 1 | Hạ, Long, Trang | Report too academic, due to client tomorrow | Mini-game: 200 pages → 5 key points | Help Hạ write the exec summary, she thanks you sincerely |
| 5 | Sprint 0 vô tận | 1 | Đạt, Linh, An | Đạt makes Linh's team attend 4 rituals per sprint | Schedule the week: how many real work hours remain | Help Đạt build a real Kanban; he reveals his ex-developer past |
| 6 | Big Pitcher (phần 2) | 1 | Hân, Khang, Long | Day-1 brief misunderstood, Hân changes her mind before deadline | Get sign-off from 3 people before deadline | If you clarified on Day 1 (flag brief_clarified) you're exempt from redoing |
| 7 | Team building thứ Bảy ✱ | 2 | Phương, juniors | 7th Saturday team building in a row, clashes with deadline | Prepare games while a deck is unfinished | Convince Phương to move it to Friday afternoon |
| 8 | When I was overseas ✱ | 2 | Khang, An | Khang wants to change the analysis method when almost done | Mini-game: compare Khang's method with real data | Push back with numbers, Khang backs off |
| 9 | Một nhân viên rưỡi | 2 | Linh, Tuyết, An | Tuyết gives Linh's team another project, Minh off for exams | Prepare workload numbers for Linh | Linh wins half a headcount or a later deadline |
| 10 | Trang học nói không | 2 | Trang, Hạ, Long | Trang falls ill from overwork | Redistribute Trang's tasks on the board | Trang says "no" for the first time, everyone claps |
| 11 | Máy in và ngày nộp hồ sơ | 2 | Bình, Gấm | Printer jams on tender submission day | Clear jam, switch printer, print 3 originals | Bảo knows the spare printer in storage |
| 12 | Bình và Quỳnh ✱ | 2 | Bình, Quỳnh | You see them lunching alone together | Keep the secret when Phương fishes | Keep it → Quỳnh approves your expenses faster |
| 13 | Bảo, ba năm vẫn intern ✱ | 3 | Bảo, Tuyết, Thư | Bảo wants a contract, nobody does the paperwork | Gather evidence of 3 years of Bảo's work from emails | Bảo becomes official, or leaves and gives you his secret notebook |
| 14 | Lời mời thứ ba | 3 | Mai | A big firm invites Mai for the 3rd time | Help Mai compare the two options | Mai stays on new terms, or leaves and hands you her role |
| 15 | Đánh giá cuối kỳ | 4 | Tuyết, all | Intern promotion review | Sum up reputation, relations, work | Many endings, no game over |

## Hidden relationships (proposals; the Game Owner said: draw them at random per run)
1. `gam_tuyet` Gấm là em họ chị Tuyết — why nobody dares to criticise Gấm's slowness; drama: the player complains about Gấm in front of Tuyết. Reveal: "Phòng họp ma".
2. `khang_han` Khang gọi Hân bằng dì — why Khang meddles and is protected; criticising Khang = criticising Hân.
3. `phuong_friend` Phương là con gái bạn thân chị Tuyết — why Saturday team building always gets approved; refusing it = refusing "culture".
4. `binh_quynh` Bình và Quỳnh đang hẹn hò bí mật — why Quỳnh's PC is always fixed first; the player discovers it and must keep the secret.
5. `bao_driver` Bảo là con của bác tài xế cũ của chị Tuyết — why Bảo is still an intern after 3 years: Tuyết promised to "take care of him" but nobody did the paperwork.
6. `dat_mba` Đạt là bạn học MBA của Hân — why Hân hired an Agile Coach without Quỳnh approving the budget; Đạt's contract has no payment voucher.

Each run draws 2 → flags `tie_<id>` = true. Episodes must work whether or not the tie is active: use
`{ if: (r) => r.flags.tie_gam_tuyet, then: [...reveal...], else: [...normal...] }`.
