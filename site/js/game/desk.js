// "Ngồi vào bàn" (desk work): pure rules, no DOM. The player can sit at their own desk between story beats and do
// one short mini-game of real work. It costs game time and energy (side tasks keep ticking), pays a small
// performance bonus on the next payslip, counts in the Friday review, and, done often enough, opens a second,
// engine-level path to promotion ("làm chăm chỉ"). Drama cannot be dodged: group-chat drama bursts in while you
// work ("chatter"), less often with headphones on, but a missed ping hurts more.
// Content per company lives in companies/<id>/desk.js ({ games, chatter }); see docs/COMPANY_CONTRACT.md §12.
import { rng } from './tasks.js';

export const DESK_MINUTES = 30;          // game minutes one session takes (side-task deadlines keep running)
export const DESK_ENERGY = 6;            // energy cost of one session
export const DESK_PER_DAY = 3;           // rewarded sessions per day
export const CHATTER_CHANCE = 0.45;      // a group-chat drama interrupts a session…
export const CHATTER_CHANCE_HEADPHONES = 0.15; // …less often with headphones on
export const BONUS = { intern: [20_000, 30_000], official: [80_000, 120_000] }; // [pass, perfect]
export const WORK_PROMO = { deskOk: 18, minDay: 22, uy: 65, aReviews: 2 };

/** Performance bonus for one passed session (0 when failed). */
export function deskBonus(status, score, ok) {
  if (!ok) return 0;
  const b = BONUS[status === 'official' ? 'official' : 'intern'];
  return score >= 1 - 1e-9 ? b[1] : b[0];
}

/** How many sessions the player already did today (stored on run.today). */
export const sessionsToday = (run) => (run && run.today && run.today.desk) || 0;
export const canWork = (run) => sessionsToday(run) < DESK_PER_DAY;

/**
 * Pick the next game: never one already played in this run until the pool runs out, then the least recent.
 * Games may carry `when(run)` and `official: true`. Returns a game object or null.
 */
export const ACTION_SHARE = 0.65;        // hands-on games (type 'action') come up this often when the company has any
export function pickGame(games, run, seed) {
  const all = (games || []).filter((g) => { try { return (!g.when || g.when(run)) && (!g.official || run.status === 'official'); } catch { return false; } });
  if (!all.length) return null;
  const seen = run.deskSeen || [];
  // the hands-on games are the fun ones: they repeat freely (like a cooking game); the rest rotate without repeats
  const acts = all.filter((g) => g.type === 'action'), rest = all.filter((g) => g.type !== 'action');
  const r0 = rng(seed + 7)();
  if (acts.length && (r0 < ACTION_SHARE || !rest.length)) {
    const last = seen[seen.length - 1];
    const pool = acts.length > 1 ? acts.filter((g) => g.id !== last) : acts;
    return [...pool].sort((a, b) => seen.lastIndexOf(a.id) - seen.lastIndexOf(b.id))[0];
  }
  const ok = rest;
  const fresh = ok.filter((g) => !seen.includes(g.id));
  const r = rng(seed);
  if (fresh.length) return fresh[Math.floor(r() * fresh.length)];
  // all seen: the one seen longest ago
  return [...ok].sort((a, b) => seen.lastIndexOf(a.id) - seen.lastIndexOf(b.id))[0];
}

/** Pick a chatter (group-chat drama) the same way, avoiding repeats. */
export function pickChatter(list, run, seed) {
  const ok = (list || []).filter((c) => { try { return !c.when || c.when(run); } catch { return false; } });
  if (!ok.length) return null;
  const seen = run.chatSeen || [];
  const fresh = ok.filter((c) => !seen.includes(c.id));
  const r = rng(seed);
  const src = fresh.length ? fresh : ok;
  return src[Math.floor(r() * src.length)];
}

/** Does a chatter interrupt this session? */
export function chatterHits(headphones, seed) {
  return rng(seed)() < (headphones ? CHATTER_CHANCE_HEADPHONES : CHATTER_CHANCE);
}

const shuffleWith = (arr, r) => { const b = [...arr]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/**
 * Turn a game definition (a bank) into one concrete mini-game: banks can be bigger than what is shown.
 * pick: `show` items, always keeping at least `pick` correct ones · quiz: `ask` questions · sort: `show` items.
 * order games are shown whole (the order is the puzzle).
 */
export function sampleMini(game, seed) {
  const r = rng(seed);
  const { id, when, official, show, ask, good, bad, ...m } = game; // good/bad = reaction scenes, played by solo.js
  void id; void when; void official; void good; void bad;
  if (m.type === 'action') return m;
  if (m.type === 'pick' && show && m.items.length > show) {
    const need = m.pick || 1;
    const right = shuffleWith(m.items.filter((x) => x.correct), r);
    const wrong = shuffleWith(m.items.filter((x) => !x.correct), r);
    const nRight = Math.min(right.length, Math.max(need, Math.round(show * right.length / m.items.length)));
    const items = [...right.slice(0, nRight), ...wrong.slice(0, Math.max(0, show - nRight))];
    return { ...m, items };
  }
  if (m.type === 'quiz' && ask && m.questions.length > ask) return { ...m, questions: shuffleWith(m.questions, r).slice(0, ask) };
  if (m.type === 'sort' && show && m.items.length > show) return { ...m, items: shuffleWith(m.items, r).slice(0, show) };
  return m;
}

/** The second road to an official contract: steady work at the desk, good reviews, a solid reputation. */
export function workPromoReady(run) {
  const a = (run.reviews || []).filter((x) => x.grade === 'A').length;
  return run.status === 'intern' && (run.flags.desk_ok_total || 0) >= WORK_PROMO.deskOk && run.day >= WORK_PROMO.minDay
    && run.st.uy >= WORK_PROMO.uy && a >= WORK_PROMO.aReviews;
}

// ---------- fallback content (a company without its own desk.js) ----------
export const GENERIC_DESK = {
  games: [
    { id: 'g_inbox', type: 'sort', title: 'Dọn inbox sáng thứ Hai', icon: '📥', prompt: 'Mỗi email đi đâu? Làm nhanh, inbox không chờ ai.',
      bins: ['⚡ Làm ngay', '🗄️ Lưu lại', '🗑️ Bỏ qua'], time: 40, pass: 0.6, show: 7, items: [
        { text: 'Sếp: "Em gửi chị file số liệu trước 10h nhé"', bin: 0 },
        { text: 'HR: Quy định mới về giờ nghỉ trưa (đính kèm 14 trang)', bin: 1 },
        { text: 'Khuyến mãi: Giảm 50% khóa học "Làm giàu từ con số 0"', bin: 2 },
        { text: 'Đồng nghiệp: "Ai lấy nhầm hộp cơm màu xanh không?"', bin: 2 },
        { text: 'Khách hàng: "Bên em gửi lại bản có số trang được không?"', bin: 0 },
        { text: 'Biên bản họp tuần trước (để tham khảo)', bin: 1 },
        { text: 'IT: "Đổi mật khẩu trong hôm nay, nếu không sẽ bị khóa"', bin: 0 },
        { text: 'Chuỗi thư "Reply all: Cảm ơn ạ" lần thứ 27', bin: 2 },
        { text: 'Hợp đồng mẫu đã ký, bản scan', bin: 1 },
      ] },
    { id: 'g_typo', type: 'pick', title: 'Soát email trước khi gửi', icon: '✉️', prompt: 'Chọn 3 lỗi phải sửa trước khi bấm Gửi.', pick: 3, time: 35, pass: 0.66, show: 6, items: [
      { text: '"Kính gửi anh Tuấn" nhưng khách tên Tùng', correct: true },
      { text: 'Ghi "file đính kèm" nhưng chưa đính kèm', correct: true },
      { text: 'Đang CC cả group "Hội độc thân công ty"', correct: true },
      { text: 'Tiêu đề viết "[GẤP] [QUAN TRỌNG] [FINAL]"', correct: true },
      { text: 'Có câu "Trân trọng cảm ơn anh"', sub: 'Lịch sự, không sao' },
      { text: 'Chữ ký có số điện thoại công ty', sub: 'Bình thường' },
      { text: 'Gửi lúc 10 giờ sáng', sub: 'Giờ hành chính, ổn' },
    ] },
    { id: 'g_priority', type: 'order', title: 'Sắp xếp việc trong ngày', icon: '🗓️', prompt: 'Việc nào làm trước? Xếp từ gấp nhất đến ít gấp nhất.', time: 35, pass: 0.6, items: [
      { text: 'Sếp cần số liệu cho cuộc họp 10h', order: 0 },
      { text: 'Trả lời khách hỏi từ hôm qua', order: 1 },
      { text: 'Cập nhật file theo dõi công việc tuần', order: 2 },
      { text: 'Dọn thư mục Download 4.000 file', order: 3 },
    ] },
    { id: 'g_excel', type: 'quiz', title: 'Excel buổi chiều', icon: '📊', prompt: 'Ba câu hỏi nhanh. Sai thì file sai, file sai thì bạn sai.', time: 40, pass: 0.66, ask: 3, questions: [
      { q: 'Cột tổng ra #VALUE!. Thường là do?', options: ['Có ô chứa chữ thay vì số', 'Máy tính hết pin', 'Excel giận'], correct: 0 },
      { q: 'Muốn cố định ô A1 khi kéo công thức, viết thế nào?', options: ['$A$1', 'A1!', '(A1)'], correct: 0 },
      { q: 'Tên file nào dễ tìm lại nhất?', options: ['2026-11-05_BaoCaoTuan_v2', 'final_final_moinhat', 'Untitled (3)'], correct: 0 },
      { q: 'Số tiền 1.250.000 bị hiểu thành 1,25. Vì sao?', options: ['Định dạng dấu chấm/phẩy khác vùng', 'Do mạng chậm', 'Do sếp xem'], correct: 0 },
    ] },
  ],
  chatter: [
    // '@1', '@2', '@3' = random colleagues present today (generic content only; company content uses cast ids)
    { id: 'g_cake', chat: [['@1', 'Ai ăn miếng bánh sinh nhật cuối cùng trong tủ lạnh vậy ạ? 🙂'], ['@2', 'Không phải em nha'], ['@3', 'Camera pantry có quay không nhỉ 🤔']],
      scene: [
        ['think', 'Group chat lại nổ. Mình chưa ăn miếng bánh nào cả.'],
        { c: '_desk_g_cake', o: [
          { t: 'Thả sticker "hóng" rồi làm tiếp', fx: { dr: 1 } },
          { t: '"Em không ăn, em xin làm chứng" 🙋', fx: { dr: 2, nl: -2 } },
          { t: 'Tắt thông báo group, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'g_meeting', chat: [['@1', 'Ủa họp 3h đổi sang 2h hả? Sao không ai báo 😳'], ['@2', 'Báo trong thread hôm qua rồi mà'], ['@1', 'Thread nào??'], ['@3', 'Thread trong thread á']],
      scene: [
        ['think', 'Mình cũng không biết có cái thread trong thread nào.'],
        { c: '_desk_g_meeting', o: [
          { t: 'Lục lại thread, ghim tin nhắn cho cả nhóm', fx: { uy: 2, nl: -3, clock: 5 } },
          { t: 'Lặng lẽ đổi lịch của mình, không nói gì', fx: {} },
          { t: '"Hay mình lập thêm một group để báo lịch họp ạ?"', fx: { dr: 2 } },
        ] },
      ] },
  ],
};
