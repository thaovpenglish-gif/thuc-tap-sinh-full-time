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
  js/core/                  util, audio, input (phím + joystick), physics, camera nhìn từ trên (cho Multiplayer; Solo dùng góc nhìn thứ nhất)
  js/art/                   kit.js (vật liệu toon, viền sticker), people.js (nhân vật chibi)
  js/maps/                  bản đồ văn phòng
  js/game/sim.js            mô phỏng thuần (item, cầm/đặt/chuyền đồ) dùng chung Solo + host multiplayer
  js/story/dialogue.js      engine hội thoại
  js/story/legacy/          cốt truyện cũ "Ba Mẹ & Partners" (đang ẩn)
  js/ui/                    toast, overlay, điện thoại
  js/modes/legacy.js        chế độ cốt truyện cũ
  js/net/                   kết nối Supabase
supabase/schema.sql         cấu trúc database
tests/                      unit test (npm test) + test tự chơi (tests/e2e)
```

## Chạy thử trên máy

```bash
cd site && python3 -m http.server 8000
```

Mở http://localhost:8000 (thêm `?legacy=1` để mở cốt truyện cũ).

## Kiểm thử

```bash
npm test
```

## Kiểm duyệt confession

Vào Supabase → Table editor → `confessions` → đặt `hidden = true` cho bài muốn ẩn.

## Cache khi deploy

GitHub Pages cho trình duyệt giữ file cũ khoảng 10 phút. Khi deploy, `scripts/stamp-version.mjs` tự gắn `?v=<mã commit>` vào `style.css`, `js/main.js` và **mọi** lệnh `import` giữa các file JS, nên người chơi luôn tải trọn một bộ file khớp nhau (không bị trộn bản đồ cũ với code mới, không bị màn hình trắng). Không cần sửa số `?v=` bằng tay.
