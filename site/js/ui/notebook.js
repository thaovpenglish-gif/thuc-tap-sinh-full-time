// "Sổ tay nhật ký": the intern's notebook (HUD 📓 button or key N). Four tabs built from the run:
// Suy nghĩ (inner thoughts logged during play), Kinh nghiệm (lessons, memorable decisions, reviews, relationships),
// Ví tiền (balance, ledger, rent, pay, debt), Nhật ký (one page per finished day).
import { $, esc } from '../core/util.js';
import { fmtVND } from '../game/difficulty.js';
import { RENT, weekdayName } from '../game/career.js';

const TABS = [['think', '💭 Suy nghĩ'], ['xp', '🧠 Kinh nghiệm'], ['money', '💰 Ví tiền'], ['diary', '📖 Nhật ký']];

/** Lessons unlocked by what happened in the run (engine-level, works for every company). */
export function lessonsFor(r) {
  const f = r.flags || {};
  const reviews = r.reviews || [];
  const L = [];
  const add = (ok, icon, text) => { if (ok) L.push({ icon, text }); };
  add(f.contract_fixed, '📄', 'Đọc kỹ từng điều khoản trước khi ký. "OT tự nguyện" không có nghĩa là tự nguyện.');
  add(f.contract_blind, '✍️', 'Đã từng ký mà không đọc. Lần sau đọc.');
  add(f.tax_commit, '🧾', 'Biết về bản cam kết thu nhập: khoản từ 5 triệu không có hợp đồng lao động sẽ bị khấu trừ 10% nếu không nộp.');
  add((f.minis_ok || 0) >= 5, '⏱️', 'Làm tốt dưới áp lực thời gian (qua ít nhất 5 mini-game).');
  add((f.minis || 0) - (f.minis_ok || 0) >= 4, '🧩', 'Trượt vài bài kiểm tra. Đọc đề kỹ hơn, đừng đoán.');
  add(reviews.some((x) => x.grade === 'A'), '🌟', 'Đã có một tuần được xếp loại A. Sếp có nhớ tên mình.');
  add(reviews.filter((x) => x.grade === 'D').length >= 2, '📉', 'Hai tuần loại D. Ở công sở, "chưa thấy kết quả" là một câu rất nặng.');
  add(f.mom_help, '📞', 'Gọi về nhà xin tiền một lần. Mẹ vẫn chuyển. Kèm mười bốn câu hỏi.');
  add(f.noodles, '🍜', 'Đã sống bằng mì gói. Biết giá trị của một hộp cơm 35 nghìn.');
  add(r.debt || f.debt_repaid, '🤝', 'Mượn tiền đồng nghiệp: trả đúng hẹn thì quan hệ tốt hơn.');
  add(f.last_life && String(f.last_life).startsWith('csgt'), '🚔', 'Luôn mang bằng lái. Và đừng đọc tin nhắn sếp khi đang chạy xe.');
  add(r.status === 'official', '🎓', 'Lên chính thức: từ giờ không còn ai tha lỗi vì "em là intern".');
  add(r.money < 0, '💸', 'Ví âm. Tiền trọ đến đúng hẹn, lương thì không.');
  add((r.st && r.st.dr) >= 60, '🔥', 'Drama đang cao. Mình đã thành một phần của câu chuyện.');
  add((r.st && r.st.nl) < 20, '😵', 'Đói và mệt thì làm gì cũng chậm. Ăn trưa là một kỹ năng.');
  return L;
}

/** opts: { getRun(), charInfo(id), companyName(id), castIds(), onOpen(), onClose() } */
export function createNotebook(opts) {
  const el = $('#notebook');
  let tab = 'think';
  let open = false;

  function page(r) {
    if (tab === 'think') {
      const th = (r.thoughts || []).slice().reverse();
      return th.length ? th.map((t) => `<div class="nb-line"><span class="nb-when">Ngày ${t.day} · ${esc(t.time)}</span>${esc(t.text)}</div>`).join('')
        : '<p class="nb-empty">Chưa có suy nghĩ nào được ghi lại. Mỗi câu "nghĩ thầm" trong ngày sẽ hiện ở đây.</p>';
    }
    if (tab === 'xp') {
      const lessons = lessonsFor(r);
      const choices = (r.decisions || []).slice(-12).reverse();
      const rel = Object.entries(r.rel || {}).filter(([id, v]) => v && opts.castIds().includes(id)).sort((a, b) => b[1] - a[1]);
      const reviews = r.reviews || [];
      return `<h4>Bài học</h4>${lessons.length ? lessons.map((l) => `<div class="nb-line">${l.icon} ${esc(l.text)}</div>`).join('') : '<p class="nb-empty">Chưa có. Đi làm thêm vài ngày nữa.</p>'}
        <h4>Review hằng tuần</h4>${reviews.length ? `<div class="nb-grades">${reviews.map((x) => `<span class="g-${x.grade}">Tuần ${x.week}: <b>${x.grade}</b></span>`).join('')}</div>` : '<p class="nb-empty">Chưa đến thứ Sáu nào.</p>'}
        <h4>Quan hệ</h4>${rel.length ? `<div class="nb-rel">${rel.map(([id, v]) => `<span>${opts.charInfo(id).emoji} ${esc(opts.charInfo(id).name)} <b class="${v > 0 ? 'up' : 'down'}">${v > 0 ? '+' : ''}${v}</b></span>`).join('')}</div>` : '<p class="nb-empty">Chưa thân, chưa ghét ai.</p>'}
        <h4>Những quyết định gần đây</h4>${choices.length ? choices.map((c) => `<div class="nb-line"><span class="nb-when">Ngày ${c.day}</span>${esc(c.text)}</div>`).join('') : '<p class="nb-empty">Chưa có.</p>'}`;
    }
    if (tab === 'money') {
      const acc = r.accrued || { intern: 0, official: 0 };
      const pending = Math.round((acc.intern || 0) + (acc.official || 0));
      const nextRent = (r.pending || []).some((c) => c.type === 'rent') ? 'ngay bây giờ (thẻ tiền trọ)' : r.day < 31 ? 'ngày 31 (đầu tháng thứ hai)' : 'đã trả đủ cho lượt này';
      const ledger = (r.ledger || []).slice(-15).reverse();
      return `<div class="nb-wallet ${r.money < 0 ? 'neg' : ''}">💰 ${r.money < 0 ? '−' : ''}${fmtVND(Math.abs(Math.round(r.money)))}</div>
        <div class="nb-kv"><span>Lương đang tích lũy (chưa trả)</span><b>${fmtVND(pending)}</b></div>
        <div class="nb-kv"><span>Lương tháng hiện tại</span><b>${r.salary ? fmtVND(r.salary) : '0 đồng'}${r.status === 'official' ? ' (chính thức)' : ''}</b></div>
        <div class="nb-kv"><span>Tiền trọ tiếp theo (${fmtVND(RENT)})</span><b>${nextRent}</b></div>
        <div class="nb-kv"><span>Ngày nhận lương</span><b>cuối ngày 30 và ngày cuối lượt</b></div>
        ${r.debt ? `<div class="nb-kv warn"><span>Đang nợ ${esc(opts.charInfo(r.debt.who).name)}</span><b>${fmtVND(r.debt.amount)}</b></div>` : ''}
        <h4>Phiếu lương đã nhận</h4>${(r.payslips || []).length ? r.payslips.map((p) => `<div class="nb-kv"><span>Ngày ${p.day}</span><b>${fmtVND(p.net)}</b></div>`).join('') : '<p class="nb-empty">Chưa nhận đồng nào.</p>'}
        <h4>Thu chi gần đây</h4>${ledger.length ? ledger.map((x) => `<div class="nb-kv"><span>Ngày ${x.day} · ${esc(x.k)}</span><b class="${x.v < 0 ? 'down' : 'up'}">${x.v < 0 ? '−' : '+'}${fmtVND(Math.abs(x.v))}</b></div>`).join('') : '<p class="nb-empty">Chưa có.</p>'}`;
    }
    const days = (r.diary || []).slice().reverse();
    return days.length ? days.map((d) => `<div class="nb-day"><div class="nb-when">${d.day === 0 ? 'Buổi phỏng vấn' : `Ngày ${d.day} · ${weekdayName(d.day)}`} · ${esc(d.title || '')}</div><p>${esc(d.text)}</p></div>`).join('')
      : '<p class="nb-empty">Trang đầu tiên sẽ được viết khi bạn hết buổi phỏng vấn.</p>';
  }

  function render() {
    const r = opts.getRun();
    if (!r) return;
    el.innerHTML = `<div class="nb-book"><div class="nb-head"><b>📓 Sổ tay của ${esc(r.name)}</b><span>${esc(opts.companyName(r.company))} · ${r.day === 0 ? 'Phỏng vấn' : `Ngày ${r.day}/45`}</span><button class="nb-close" aria-label="Đóng sổ tay">✕</button></div>
      <div class="nb-tabs">${TABS.map(([id, label]) => `<button data-tab="${id}" class="${tab === id ? 'on' : ''}">${label}</button>`).join('')}</div>
      <div class="nb-page">${page(r)}</div><div class="nb-foot">Phím <kbd>N</kbd> hoặc <kbd>Esc</kbd> để đóng</div></div>`;
    el.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => { tab = b.dataset.tab; render(); }; });
    el.querySelector('.nb-close').onclick = close;
  }
  function show(t) { if (t) tab = t; open = true; render(); el.hidden = false; document.body.classList.add('nb-open'); opts.onOpen && opts.onOpen(); }
  function close() { if (!open) return; open = false; el.hidden = true; document.body.classList.remove('nb-open'); opts.onClose && opts.onClose(); }
  el.addEventListener('click', (e) => { if (e.target === el) close(); });
  return { show, close, render, get isOpen() { return open; } };
}
