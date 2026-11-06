// Phá Án Công Sở: detective mode (DOM only, no 3D). Read the files, listen to testimony, break a statement with
// the evidence that contradicts it, then lock in the conclusion. Rules: game/detective.js. Cases: content/cases.js.
import { esc } from '../core/util.js';
import { CASES } from '../content/cases.js';
import {
  newState, evidenceOf, testimonyOf, isBroken, isClosed, present, takeHint, submit, stars, RANKS, MAX_SUBMITS,
} from '../game/detective.js';

const SAVE_KEY = 'tts_cases_v1';
const MISS_LINES = [
  'Cái đó thì liên quan gì tới mình?',
  'Bằng chứng này đâu có nói ngược lại lời mình.',
  'Em đọc kỹ lại đi rồi hẵng nói.',
  'Ừ. Thì sao?',
  'Cái này mình biết rồi. Không có gì sai cả.',
];
const LEVEL = ['', 'Dễ', 'Vừa', 'Khó'];

function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } }
function persist(all) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(all)); } catch { /* private mode */ } }
const starStr = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);
// Options are shown in a stable shuffled order (per question), so the right answer has no favourite position.
function order(id, n) {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; const j = h % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx;
}

export function startDetective({ root, onExit }) {
  const all = load();
  let c = null;        // current case
  let s = null;        // its state
  let tab = 'files';
  let pending = null;  // statement id being challenged
  const answers = {};  // draft answers for the current case (kept in s.answers too)

  const save = () => { if (c) all[c.id] = s; persist(all); };
  const person = (id) => (id === 'nar' ? { name: '', emoji: '🕵️' } : c.people[id]);

  // ───────── case list ─────────
  function showList() {
    c = null; pending = null;
    root.hidden = false;
    root.innerHTML = `
      <div class="dt-wrap">
        <div class="dt-top"><button class="dt-btn ghost" data-act="exit">← Menu chính</button></div>
        <header class="dt-hero">
          <div class="dt-kicker">CHẾ ĐỘ MỚI · SUY LUẬN</div>
          <h1>Phá Án<span>Công Sở</span></h1>
          <p>Không có mũi tên chỉ đường, không có đáp án đánh dấu sẵn. Đọc hồ sơ, nghe lời khai, tìm chỗ không khớp.</p>
          <ol class="dt-how">
            <li><b>📁 Hồ sơ</b>: log, tin nhắn, hóa đơn. Đọc kỹ cả dòng chữ nhỏ.</li>
            <li><b>🗣️ Lời khai</b>: có người nói thật, có người không. Thấy lời nào sai với bằng chứng thì bấm <b>⚡ Phản bác</b> rồi đưa bằng chứng ra. Đúng thì mở ra manh mối mới.</li>
            <li><b>🧩 Kết luận</b>: trả lời hết câu hỏi rồi chốt. Chỉ được báo đúng mấy câu, không báo câu nào. Sai ${MAX_SUBMITS} lần là hết vụ.</li>
          </ol>
          <p class="dt-small">Phản bác sai, xem gợi ý hay chốt sai đều bị trừ sao. Có 📝 Sổ tay để ghi nháp.</p>
        </header>
        <div class="dt-cases">
          ${CASES.map((k) => {
            const st = all[k.id];
            const badge = st && st.solved ? `<em class="dt-stars">${starStr(stars(st))}</em>` : st && st.gaveUp ? '<em class="dt-fail">Bỏ dở</em>' : st ? '<em>Đang điều tra</em>' : '<em class="go">Mở hồ sơ →</em>';
            return `<button class="dt-case lv${k.level}" data-case="${k.id}">
              <span class="dt-no">Vụ ${k.no}</span>
              <b>${esc(k.title)}</b>
              <span class="dt-co">${esc(k.company)} · ${LEVEL[k.level]} ${'🧠'.repeat(k.level)}</span>
              <span class="dt-tag">${esc(k.tagline)}</span>
              ${badge}
            </button>`;
          }).join('')}
        </div>
        <p class="dt-small dt-center">Mọi nhân vật, công ty, số liệu đều hư cấu. Vụ mới sẽ được thêm dần.</p>
      </div>`;
  }

  // ───────── one case ─────────
  function openCase(id, fresh = false) {
    c = CASES.find((k) => k.id === id);
    if (!c) return showList();
    if (fresh || !all[id]) { all[id] = newState(); }
    s = all[id];
    Object.keys(answers).forEach((k) => delete answers[k]);
    Object.assign(answers, s.answers || {});
    pending = null;
    tab = isClosed(s) ? 'end' : 'files';
    save();
    render();
    if (!s.seenIntro) showIntro();
  }

  function showIntro() {
    s.seenIntro = true; save();
    modal(`<div class="dt-file-no">HỒ SƠ VỤ ${c.no} · ${esc(c.company)}</div><h2>${esc(c.title)}</h2>${c.intro.map((p) => `<p>${esc(p)}</p>`).join('')}`, 'Mở hồ sơ');
  }

  function stats() {
    return `<span title="Phản bác đúng">⚡ ${s.found.length}/${c.contradictions.length}</span><span title="Phản bác sai">❌ ${s.misses}</span><span title="Gợi ý đã xem">💡 ${s.hints}</span><span title="Chốt sai">🔒 ${s.wrong}/${MAX_SUBMITS}</span>`;
  }

  function render() {
    const files = evidenceOf(c, s), talk = testimonyOf(c, s);
    const newIn = (list) => list.filter((x) => s.fresh.includes(x.id)).length;
    const tabs = [
      ['files', `📁 Hồ sơ <i>${files.length}</i>`, newIn(files)],
      ['talk', `🗣️ Lời khai <i>${talk.length}</i>`, newIn(talk)],
      ['notes', '📝 Sổ tay', 0],
      [isClosed(s) ? 'end' : 'solve', isClosed(s) ? '🏁 Kết quả' : '🧩 Kết luận', 0],
    ];
    root.innerHTML = `
      <div class="dt-wrap">
        <div class="dt-top">
          <button class="dt-btn ghost" data-act="list">← Các vụ án</button>
          <div class="dt-stat">${stats()}</div>
          <button class="dt-btn" data-act="intro">📜 Đề bài</button>
          ${isClosed(s) ? '' : `<button class="dt-btn" data-act="hint">💡 Gợi ý ${s.hints}/${c.hints.length}</button>`}
        </div>
        <div class="dt-title"><span class="dt-no">Vụ ${c.no}</span> ${esc(c.title)} <small>${esc(c.company)}</small></div>
        <nav class="dt-tabs">${tabs.map(([k, label, n]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${label}${n ? `<b class="dt-new">${n} mới</b>` : ''}</button>`).join('')}</nav>
        ${pending ? pendingBar() : ''}
        <main class="dt-panel">${panel(files, talk)}</main>
      </div>`;
    if (tab === 'notes') {
      const ta = root.querySelector('textarea');
      ta.value = s.notes || '';
      ta.oninput = () => { s.notes = ta.value; save(); };
    }
  }

  function pendingBar() {
    const t = c.testimony.find((x) => x.id === pending);
    const p = person(t.who);
    return `<div class="dt-pending"><div><div class="dt-q-text">⚡ Phản bác lời của <b>${esc(p.name)}</b>: “${esc(t.text)}”</div><small>Chọn bằng chứng mâu thuẫn với lời này rồi bấm <b>👉 Đưa ra</b>.</small></div><button class="dt-btn ghost" data-act="cancel">Hủy</button></div>`;
  }

  function panel(files, talk) {
    if (tab === 'files') return `<div class="dt-grid">${files.map(evCard).join('')}</div>`;
    if (tab === 'talk') return `<div class="dt-list">${talk.map(talkCard).join('')}</div>`;
    if (tab === 'notes') return `<div class="dt-notes"><p class="dt-small">Ghi nháp: đổi giờ, gạch tên người đã có bằng chứng ngoại phạm… Sổ tay được lưu lại trên máy này.</p><textarea placeholder="Ví dụ: 19:04 UTC = ? giờ VN"></textarea></div>`;
    if (tab === 'solve') return solvePanel();
    return endPanel();
  }

  function evCard(e) {
    const isNew = s.fresh.includes(e.id);
    const body = (e.lines || []).map((l) => `<p>${esc(l)}</p>`).join('')
      + (e.table ? `<div class="dt-tbl"><table><thead><tr>${e.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${e.table.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '')
      + (e.note ? `<p class="dt-note">ⓘ ${esc(e.note)}</p>` : '');
    return `<article class="dt-ev${isNew ? ' new' : ''}" data-ev="${e.id}">
      <h3><span>${e.icon}</span>${esc(e.title)}${isNew ? '<b class="dt-new">MỚI</b>' : ''}</h3>
      ${body}
      ${pending ? `<button class="dt-btn hot" data-present="${e.id}">👉 Đưa ra bằng chứng này</button>` : ''}
    </article>`;
  }

  function talkCard(t) {
    const p = person(t.who);
    const broken = isBroken(c, s, t.id);
    const isNew = s.fresh.includes(t.id);
    return `<article class="dt-talk${broken ? ' broken' : ''}${isNew ? ' new' : ''}">
      <div class="dt-av">${p.emoji}</div>
      <div class="dt-say">
        <div class="dt-who"><b>${esc(p.name)}</b> <small>${esc(p.role || '')}</small>${isNew ? '<b class="dt-new">MỚI</b>' : ''}</div>
        <q>${esc(t.text)}</q>
        ${broken ? '<div class="dt-broke">✔ Đã bị phản bác</div>' : isClosed(s) ? '' : `<button class="dt-btn hot" data-challenge="${t.id}">⚡ Phản bác</button>`}
      </div>
    </article>`;
  }

  function solvePanel() {
    return `<div class="dt-solve">
      <p class="dt-small">Trả lời hết rồi bấm chốt. Bạn chỉ được biết đúng bao nhiêu câu. Còn <b>${MAX_SUBMITS - s.wrong}</b> lần chốt.</p>
      ${c.questions.map((q, qi) => `<fieldset class="dt-q"><legend>${qi + 1}. ${esc(q.q)}</legend>
        ${order(44 + c.id + q.id, q.options.length).map((i) => `<button class="dt-opt${answers[q.id] === i ? ' on' : ''}" data-q="${q.id}" data-o="${i}">${esc(q.options[i])}</button>`).join('')}
      </fieldset>`).join('')}
      <button class="dt-btn big" data-act="submit">🔒 Chốt kết luận</button>
    </div>`;
  }

  function endPanel() {
    const n = stars(s);
    return `<div class="dt-end">
      <div class="dt-verdict ${s.solved ? 'win' : 'lose'}">
        <div class="dt-big-stars">${s.solved ? starStr(n) : '✖'}</div>
        <h2>${s.solved ? 'PHÁ ÁN THÀNH CÔNG' : 'HỒ SƠ BỊ ĐÓNG'}</h2>
        <p>Danh hiệu: <b>${RANKS[n]}</b></p>
        <p class="dt-small">Phản bác sai ${s.misses} · gợi ý ${s.hints} · chốt sai ${s.wrong}</p>
      </div>
      ${s.solved ? `<p class="dt-epi">${esc(c.epilogue)}</p>` : '<p class="dt-epi">Sếp thở dài và tự phá án. Đây là lời giải:</p>'}
      <h3>Lời giải</h3>
      ${c.questions.map((q, i) => `<div class="dt-why"><b>${i + 1}. ${esc(q.q)}</b><span>→ ${esc(q.options[q.answer])}</span><p>${esc(q.why)}</p></div>`).join('')}
      <div class="dt-row">
        <button class="dt-btn" data-act="restart">↻ Chơi lại vụ này</button>
        ${nextCase() ? `<button class="dt-btn big" data-case="${nextCase().id}">Vụ tiếp theo →</button>` : '<button class="dt-btn big" data-act="list">Về danh sách vụ án</button>'}
      </div>
    </div>`;
  }

  const nextCase = () => CASES.find((k) => k.no === c.no + 1);

  // ───────── modal ─────────
  function modal(html, okLabel = 'Tiếp tục', after) {
    const m = document.createElement('div');
    m.className = 'dt-modal';
    m.innerHTML = `<div class="dt-card">${html}<button class="dt-btn big" data-ok>${okLabel}</button></div>`;
    root.appendChild(m);
    const close = () => { m.remove(); document.removeEventListener('keydown', key); if (after) after(); };
    const key = (e) => { if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); close(); } };
    document.addEventListener('keydown', key);
    m.querySelector('[data-ok]').onclick = close;
    m.querySelector('[data-ok]').focus();
  }

  const speech = (lines) => lines.map(([who, text]) => {
    if (who === 'nar') return `<p class="dt-nar">${esc(text)}</p>`;
    const p = person(who);
    return `<div class="dt-line"><span class="dt-av sm">${p.emoji}</span><div><b>${esc(p.name)}</b><p>${esc(text)}</p></div></div>`;
  }).join('');

  function doPresent(evId) {
    const stmt = pending;
    pending = null;
    const t = c.testimony.find((x) => x.id === stmt);
    const res = present(c, s, stmt, evId);
    save();
    if (res.ok) {
      const opened = res.unlocked.map((id) => {
        const e = c.evidence.find((x) => x.id === id);
        return e ? `📁 Hồ sơ mới: <b>${esc(e.title)}</b>` : `🗣️ Lời khai mới của <b>${esc(person(c.testimony.find((x) => x.id === id).who).name)}</b>`;
      });
      modal(`<div class="dt-bang">⚡ MÂU THUẪN!</div>${speech(res.k.reveal)}${opened.length ? `<div class="dt-unlock">${opened.join('<br>')}</div>` : ''}`, 'Ghi vào hồ sơ', () => {
        tab = res.unlocked.some((id) => c.evidence.some((e) => e.id === id)) ? 'files' : 'talk';
        render();
      });
    } else if (res.invalid) {
      tab = 'talk'; render();
    } else {
      const p = person(t.who);
      const line = MISS_LINES[(s.misses + c.no) % MISS_LINES.length];
      modal(`<div class="dt-bang miss">❌ Không khớp</div>${speech([[t.who, line]])}<p class="dt-small">${esc(p.name)} vẫn giữ nguyên lời khai. Phản bác sai bị tính 1 lỗi.</p>`, 'Xem lại', () => { tab = 'talk'; render(); });
    }
  }

  function doSubmit() {
    const res = submit(c, s, answers);
    s.answers = { ...answers };
    save();
    if (res.missing) { modal(`<p>Còn <b>${res.missing}</b> câu chưa trả lời.</p>`, 'Làm tiếp'); return; }
    if (res.solved) { tab = 'end'; render(); return; }
    if (res.gaveUp) { modal(`<div class="dt-bang miss">🔒 Sai lần thứ ${MAX_SUBMITS}</div><p>Đúng ${res.correct}/${res.total} câu. Hồ sơ bị đóng.</p>`, 'Xem lời giải', () => { tab = 'end'; render(); }); return; }
    modal(`<div class="dt-bang miss">🤨 Chưa đúng hết</div><p>Bạn đúng <b>${res.correct}/${res.total}</b> câu. Không ai nói cho bạn biết là câu nào.</p><p class="dt-small">Còn ${res.left} lần chốt. Quay lại hồ sơ, tìm thêm mâu thuẫn rồi hẵng chốt.</p>`, 'Điều tra tiếp', () => render());
  }

  function doHint() {
    if (s.hints >= c.hints.length) {
      modal(`<h2>💡 Gợi ý</h2>${c.hints.map((h, i) => `<p><b>${i + 1}.</b> ${esc(h)}</p>`).join('')}<p class="dt-small">Hết gợi ý rồi. Phần còn lại là của bạn.</p>`, 'Đóng');
      return;
    }
    const m = document.createElement('div');
    m.className = 'dt-modal';
    m.innerHTML = `<div class="dt-card"><h2>💡 Xem gợi ý ${s.hints + 1}/${c.hints.length}?</h2><p>Mỗi gợi ý bị tính 1 lỗi.</p>${c.hints.slice(0, s.hints).map((h, i) => `<p><b>${i + 1}.</b> ${esc(h)}</p>`).join('')}<div class="dt-row"><button class="dt-btn ghost" data-no>Thôi, tự nghĩ</button><button class="dt-btn big" data-yes>Xem gợi ý</button></div></div>`;
    root.appendChild(m);
    m.querySelector('[data-no]').onclick = () => m.remove();
    m.querySelector('[data-yes]').onclick = () => {
      m.remove();
      const hs = takeHint(c, s);
      save();
      modal(`<h2>💡 Gợi ý</h2>${hs.map((h, i) => `<p><b>${i + 1}.</b> ${esc(h)}</p>`).join('')}`, 'Đã hiểu', () => render());
    };
  }

  // ───────── events ─────────
  root.onclick = (ev) => {
    const b = ev.target.closest('button');
    if (!b || !root.contains(b) || b.closest('.dt-modal')) return;
    const d = b.dataset;
    if (d.case) return openCase(d.case);
    if (d.tab) {
      if (d.tab !== tab) { s.fresh = s.fresh.filter((id) => !(tab === 'files' ? c.evidence : tab === 'talk' ? c.testimony : []).some((x) => x.id === id)); save(); }
      tab = d.tab;
      return render();
    }
    if (d.challenge) { pending = d.challenge; tab = 'files'; render(); root.querySelector('.dt-panel').scrollIntoView({ block: 'start' }); return; }
    if (d.present) return doPresent(d.present);
    if (d.q) { answers[d.q] = Number(d.o); s.answers = { ...answers }; save(); return render(); }
    switch (d.act) {
      case 'exit': root.hidden = true; root.innerHTML = ''; onExit(); break;
      case 'list': showList(); break;
      case 'intro': showIntro(); break;
      case 'hint': doHint(); break;
      case 'cancel': pending = null; tab = 'talk'; render(); break;
      case 'submit': doSubmit(); break;
      case 'restart': openCase(c.id, true); break;
      default: break;
    }
  };

  showList();
  window.__detective = { open: openCase, list: showList, state: () => s, cases: CASES }; // e2e hooks
  return { show: showList };
}
