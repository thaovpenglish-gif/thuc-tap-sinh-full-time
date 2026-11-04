# Thực Tập Sinh 🪪

Game 3D góc nhìn thứ nhất chơi trên trình duyệt: tuần đầu tiên làm thực tập sinh ở **Phát Đạt Lộc**, một công ty gia đình 10 người vô cùng drama.

- 5 ngày (thứ Hai → thứ Sáu), 10 nhân vật, mỗi lựa chọn đều ảnh hưởng Uy tín / Drama / Năng lượng và quan hệ.
- 7 kết thúc khác nhau (có 1 kết thúc bí mật).
- **Online qua Supabase**: thấy người chơi khác đi lại trong văn phòng theo thời gian thực, "Hội TTS ẩn danh" để đăng confession, và thống kê "x% người chơi chọn giống bạn".
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
