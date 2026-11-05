// "Phòng luyện tập: toxic people" — short rounds of workplace scenarios (content/snakes.js PRACTICE).
// Each scenario: setup, 3 choices; after a pick the card explains why every option works or backfires,
// shows the rule, and the matching handbook section's ready-to-say sentences. Opens from the Solo menu
// and from the notebook's handbook tab. Best score is kept in localStorage (optional).
import { $, esc } from '../core/util.js';
import { HANDBOOK, PRACTICE } from '../content/snakes.js';
import { handbookHTML } from './notebook.js';

const ROUND = 6;
const KEY = 'tts_practice_v1';
const sectionOf = (id) => HANDBOOK.sections.find((s) => s.id === id) || { title: '', icon: '🐍', sayThis: [] };

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
function persist(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* private mode */ } }

export function createPractice({ onOpen, onClose } = {}) {
  let el = $('#practice');
  if (!el) { el = document.createElement('div'); el.id = 'practice'; el.hidden = true; document.body.appendChild(el); }
  let queue = [], i = 0, score = 0, picked = null, open = false, learned = [];

  const shuffle = (a) => { const b = a.slice(); for (let k = b.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [b[k], b[j]] = [b[j], b[k]]; } return b; };
  const frame = (inner) => `<div class="pr-card"><div class="pr-head"><b>🎯 ${esc(PRACTICE.title)}</b><button class="pr-close" aria-label="Đóng phòng luyện tập">✕</button></div><div class="pr-body">${inner}</div></div>`;

  function wire() {
    el.querySelector('.pr-close').onclick = close;
    el.querySelectorAll('[data-act]').forEach((b) => { b.onclick = () => act(b.dataset.act, b.dataset.i); });
    el.querySelectorAll('[data-practice]').forEach((b) => { b.onclick = () => act('start'); });
  }
  function intro() {
    const best = load();
    el.innerHTML = frame(`<p class="pr-intro">${esc(PRACTICE.intro)}</p>
      <p class="pr-meta">Mỗi lượt ${ROUND} tình huống ngắn. Không có điểm trừ vào lượt chơi, chỉ có bài học.${best.best != null ? ` Điểm cao nhất của bạn: <b>${best.best}/${ROUND * 2}</b>.` : ''}</p>
      <div class="pr-btns"><button class="btn primary" data-act="start">Bắt đầu luyện →</button><button class="btn ghost" data-act="all">Làm cả ${PRACTICE.scenarios.length} tình huống</button><button class="btn ghost" data-act="book">📘 Đọc cẩm nang trước</button></div>`);
    wire();
  }
  function card() {
    const s = queue[i], sec = sectionOf(s.snake);
    const done = picked != null;
    const choices = s.choices.map((c, k) => {
      const cls = !done ? '' : c.score === 2 ? ' best' : c.score === 1 ? ' mid' : ' bad';
      const mark = !done ? '' : c.score === 2 ? '✅ ' : c.score === 1 ? '🤔 ' : '❌ ';
      return `<button class="pr-opt${cls}${done && k === picked ? ' picked' : ''}" data-act="pick" data-i="${k}" ${done ? 'disabled' : ''}>${mark}${esc(c.text)}${done ? `<span class="pr-fb">${esc(c.feedback)}</span>` : ''}</button>`;
    }).join('');
    const after = done ? `<div class="pr-rule">📌 <b>Quy luật:</b> ${esc(s.rule)}</div>
      ${sec.sayThis && sec.sayThis.length ? `<div class="pr-say"><b>Câu có thể nói</b>${sec.sayThis.map((x) => `<div>${esc(x)}</div>`).join('')}</div>` : ''}
      <div class="pr-btns"><button class="btn primary" data-act="next">${i + 1 < queue.length ? 'Tình huống tiếp →' : 'Xem kết quả →'}</button></div>` : '';
    el.innerHTML = frame(`<div class="pr-meta">Tình huống ${i + 1}/${queue.length} · ${sec.icon} ${esc(sec.title)} · điểm ${score}</div>
      <h3 class="pr-title">${esc(s.title)}</h3><p class="pr-setup">${esc(s.setup)}</p>
      <div class="pr-opts">${choices}</div>${after}`);
    wire();
    const body = el.querySelector('.pr-body'); if (body && !done) body.scrollTop = 0;
  }
  function result() {
    const max = queue.length * 2;
    const st = load();
    if (queue.length === ROUND && (st.best == null || score > st.best)) { st.best = score; persist(st); }
    const verdict = score >= max * 0.8 ? 'Bạn bình tĩnh như người đã đi làm mười năm. Rắn nào cũng phải dè chừng.'
      : score >= max * 0.5 ? 'Khá ổn. Vài lần bạn chọn đường dễ chịu trước mắt, nhưng hiểu lý do rồi thì lần sau sẽ khác.'
        : 'Không sao cả. Ai mới đi làm cũng muốn im lặng hoặc nổ tung. Đọc lại quy luật bên dưới nhé.';
    el.innerHTML = frame(`<div class="pr-score">${score}/${max}</div><p class="pr-intro">${esc(verdict)}</p>
      <h4>Những quy luật vừa luyện</h4>${learned.map((r) => `<div class="pr-learn">📌 ${esc(r)}</div>`).join('')}
      <div class="pr-btns"><button class="btn primary" data-act="start">Luyện lượt khác →</button><button class="btn ghost" data-act="close">Xong</button></div>`);
    wire();
  }
  function act(a, k) {
    if (a === 'start' || a === 'all') {
      queue = a === 'all' ? shuffle(PRACTICE.scenarios) : shuffle(PRACTICE.scenarios).slice(0, ROUND);
      queue = queue.map((s) => ({ ...s, choices: shuffle(s.choices) }));
      i = 0; score = 0; picked = null; learned = []; card();
    } else if (a === 'pick' && picked == null) {
      picked = +k; score += queue[i].choices[picked].score; learned.push(queue[i].rule); card();
      const r = el.querySelector('.pr-rule'); if (r) r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else if (a === 'next') { i++; picked = null; if (i < queue.length) card(); else result(); }
    else if (a === 'close') close();
    else if (a === 'book') { el.innerHTML = frame(`${handbookHTML()}<div class="pr-btns"><button class="btn ghost" data-act="back">← Quay lại</button></div>`); wire(); }
    else if (a === 'back') intro();
  }
  function show() { open = true; intro(); el.hidden = false; onOpen && onOpen(); }
  function close() { if (!open) return; open = false; el.hidden = true; onClose && onClose(); }
  el.addEventListener('click', (e) => { if (e.target === el) close(); });
  return { show, close, get isOpen() { return open; } };
}
