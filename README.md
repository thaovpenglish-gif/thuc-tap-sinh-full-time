# Thực Tập Sinh Full-Time 🐱

Game 3D góc nhìn thứ nhất chơi trên trình duyệt về một sự nghiệp đi qua nhiều công ty. Không có game over: hết công ty này thì sang công ty khác. Công ty #1: tuần đầu làm intern ở **Ba Mẹ & Partners**, một công ty tư vấn quản lý (management consulting) gia đình 10 người vô cùng drama. Phong cách pastel, nét viền đen kiểu sticker.

- Level 1: 5 ngày (thứ Hai → Sprint Retro thứ Sáu), 12 nhân vật + Mèo KPI, mỗi lựa chọn ảnh hưởng Uy tín / Drama / Năng lượng và quan hệ.
- Daily stand-up mỗi sáng quanh bảng Scrum, Teams call từ sếp (nghe hoặc từ chối), group chat Teams.
- 7 kết thúc khác nhau (có 1 kết thúc bí mật).
- **Online qua Supabase**: thấy người chơi khác đi lại trong văn phòng theo thời gian thực, "Hội Intern ẩn danh" để đăng confession, và thống kê "x% người chơi chọn giống bạn".
- Chạy được trên máy tính (WASD + chuột) và điện thoại (cần điều khiển cảm ứng).

## Cấu trúc

```
site/                 ← toàn bộ web tĩnh, deploy thẳng lên GitHub Pages
  index.html, style.css
  js/main.js          ← vòng lặp game, điều khiển, hội thoại, điện thoại, HUD
  js/world.js         ← dựng văn phòng 3D (Three.js) + nhân vật
  js/story.js         ← TOÀN BỘ cốt truyện: nhân vật, 5 ngày, lựa chọn, kết thúc
  js/net.js           ← Supabase: presence, confession, vote
  js/config.js        ← URL + anon key Supabase (an toàn để công khai, đã có RLS)
supabase/schema.sql   ← schema database
.github/workflows/deploy.yml ← tự động deploy khi push lên main
```

Không cần build. Muốn sửa cốt truyện thì sửa `site/js/story.js` rồi push, GitHub Actions tự deploy.

## Chạy thử trên máy

```bash
cd site && python3 -m http.server 8000
```

Mở http://localhost:8000

## Kiểm duyệt confession

Vào Supabase → Table editor → `confessions` → đặt `hidden = true` cho bài muốn ẩn.
