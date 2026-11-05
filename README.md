# Thực Tập Sinh Full-Time 🐱

Game 3D góc nhìn thứ nhất chơi trên trình duyệt về một sự nghiệp đi qua nhiều công ty. Không có game over: hết công ty này thì sang công ty khác. Công ty #1: tuần đầu làm intern ở **Ba Mẹ & Partners**, một công ty tư vấn quản lý (management consulting) gia đình 10 người vô cùng drama. Phong cách pastel, nét viền đen kiểu sticker.

- Level 1: 5 ngày (thứ Hai → Sprint Retro thứ Sáu), 12 nhân vật + Mèo KPI, mỗi lựa chọn ảnh hưởng Uy tín / Drama / Năng lượng và quan hệ.
- Daily stand-up mỗi sáng quanh bảng Scrum, Teams call từ sếp (nghe hoặc từ chối), group chat Teams.
- 7 kết thúc khác nhau (có 1 kết thúc bí mật).
- **Online qua Supabase**: thấy người chơi khác đi lại trong văn phòng theo thời gian thực, "Hội Intern ẩn danh" để đăng confession, và thống kê "x% người chơi chọn giống bạn".
- Chạy được trên máy tính (WASD + chuột) và điện thoại (cần điều khiển cảm ứng).

## Cấu trúc

```
site/                       web tĩnh, deploy thẳng lên GitHub Pages (không cần build)
  index.html, style.css
  js/main.js                điểm vào: renderer, vòng lặp, chọn chế độ
  js/flags.js               cờ tính năng (?legacy=1 mở cốt truyện cũ đang ẩn)
  js/core/                  util, audio, input (phím + joystick), physics, fpcontrols (góc nhìn thứ nhất cho Solo), camera nhìn từ trên (cho Multiplayer)
  js/art/                   kit.js (vật liệu toon, viền sticker), people.js (nhân vật chibi)
  js/maps/                  bản đồ văn phòng
  js/game/sim.js            mô phỏng thuần (item, cầm/đặt/chuyền đồ) dùng chung Solo + host multiplayer
  js/game/difficulty.js     mức lương = độ khó (0 / 1 / 3 / 5 triệu), thuế khấu trừ 10%
  js/game/save.js           hồ sơ sự nghiệp: nhiều lượt chơi lưu song song
  js/game/tasks.js          việc vặt có deadline theo đồng hồ trong game
  js/game/desk.js           ngồi vào bàn làm việc: mini-game theo nghề, thưởng năng suất, drama nhóm chat, thăng chức nhờ chăm chỉ
  js/story/dialogue.js      engine hội thoại
  js/story/tm/              Solo T&M Partners: nhân vật, Buổi đầu tiên (phỏng vấn + deal lương), Ngày 1
  js/story/legacy/          cốt truyện cũ "Ba Mẹ & Partners" (mở bằng ?legacy=1)
  js/ui/                    toast, overlay, điện thoại, mini-game
  js/modes/solo.js          Solo T&M (góc nhìn thứ nhất)
  js/modes/legacy.js        chế độ cốt truyện cũ
  js/modes/multi.js         Multiplayer "Overdeadline & Overburnout" (SOS Advisory, co-op, bản thử trên menu chính)
  js/game/mp/               luật chơi Multiplayer (engine.js) và dữ liệu màn (levels.js)
  js/maps/mp-room.js        dựng phòng 3D cho màn Multiplayer
  js/net/                   kết nối Supabase (mp-net.js: phòng chơi Multiplayer)
supabase/schema.sql         cấu trúc database
tests/                      unit test (npm test) + test tự chơi (tests/e2e)
```

## Chạy thử trên máy

```bash
cd site && python3 -m http.server 8000
```

Mở http://localhost:8000 (thêm `?legacy=1` để mở cốt truyện cũ, `?mp=1&net=local` để thử Multiplayer
2 người để thử 2 người bằng 2 tab trên cùng máy, không cần mạng).

## Kiểm thử

```bash
npm test
# test tự chơi (cần server ở cổng 8765): mức lương t0|t1|t3|t5, chiến lược first|last|rand, thêm "tasks" để làm việc vặt
node tests/e2e/solo-tm-playthrough.cjs t5 last tasks
node tests/e2e/solo-career.cjs tm t3 first 3 routine desk   # có ngồi bàn làm việc
node tests/e2e/action-games.cjs                             # bot chơi thử mọi mini-game tay chân (xé gà, hàn túi…)
node tests/e2e/legacy-playthrough.cjs first
npm run test:mp   # Multiplayer: 2 người trong 1 trình duyệt (cần server ở cổng 8765)
```

## Kiểm duyệt confession

Vào Supabase → Table editor → `confessions` → đặt `hidden = true` cho bài muốn ẩn.

## Cache khi deploy

GitHub Pages cho trình duyệt giữ file cũ khoảng 10 phút. Khi deploy, `scripts/stamp-version.mjs` tự gắn `?v=<mã commit>` vào `style.css`, `js/main.js` và **mọi** lệnh `import` giữa các file JS, nên người chơi luôn tải trọn một bộ file khớp nhau (không bị trộn bản đồ cũ với code mới, không bị màn hình trắng). Không cần sửa số `?v=` bằng tay.
