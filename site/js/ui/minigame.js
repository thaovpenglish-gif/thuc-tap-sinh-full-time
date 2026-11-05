// Small, repeatable mini-games shown as a sticker card (keyboard 1–9 / Enter, or tap).
// Types: 'pick' (choose N right items), 'quiz' (one question at a time), 'order' (tap items in the right order),
// 'sort' (one card at a time, tap its bin: { bins: ['A', 'B'], items: [{ text, sub?, bin: index }] }),
// 'action' (hands-on canvas game from ui/action.js: { game: 'shred'|'hold'|'whack'|'conveyor'|'align', ...params }).
// runMinigame(config) -> Promise<{ score: 0..1 }>. config.pass = the bar shown to the player AND used by the caller.
// pick: score = right picks / min(pick, #correct) — a wrong pick costs the slot it took, nothing more.
// After finishing, the answers are revealed (right = green, wrong pick = red, missed = dashed) so players learn.
import { esc } from '../core/util.js';
import { sfx } from '../core/audio.js';
import { startAction } from './action.js';

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function shell(cfg) {
  let el = document.getElementById('mini');
  if (!el) { el = document.createElement('div'); el.id = 'mini'; document.body.appendChild(el); }
  el.innerHTML = `<div class="mini-card">
    <div class="mini-head"><span class="mini-ico">${cfg.icon || '🧩'}</span><b>${esc(cfg.title)}</b><span class="mini-time"><i></i></span></div>
    <div class="mini-prompt">${esc(cfg.prompt || '')}</div>
    ${cfg.barNote ? `<div class="mini-bar">${esc(cfg.barNote)}</div>` : ''}
    <div class="mini-body"></div>
    <div class="mini-foot"></div>
  </div>`;
  el.hidden = false;
  return el;
}

export function runMinigame(cfg) {
  return new Promise((resolve) => {
    const el = shell(cfg);
    const body = el.querySelector('.mini-body');
    const foot = el.querySelector('.mini-foot');
    const bar = el.querySelector('.mini-time i');
    const total = (cfg.time || 30) * 1000;
    const t0 = performance.now();
    let done = false;
    let onKey = null;
    const timer = setInterval(() => {
      const left = Math.max(0, 1 - (performance.now() - t0) / total);
      bar.style.width = (left * 100) + '%';
      bar.classList.toggle('low', left < 0.25);
      if (left <= 0) finish();
    }, 100);

    let evaluate = () => 0;
    let reveal = () => {};
    function finish() {
      if (done) return;
      done = true;
      clearInterval(timer);
      window.removeEventListener('keydown', onKey, true);
      const score = Math.max(0, Math.min(1, evaluate()));
      const need = cfg.pass ?? 0.5;
      const ok = score >= need - 1e-9;
      (ok ? sfx.good : sfx.bad)();
      reveal();
      foot.innerHTML = `<div class="mini-result ${ok ? 'ok' : 'no'}">${ok ? '✅ Qua' : '❌ Chưa qua'} · ${Math.round(score * 100)}% <small>(cần ${Math.round(need * 100)}%)</small></div>`;
      setTimeout(() => { el.hidden = true; if (window.__miniDebug) window.__miniDebug = null; resolve({ score }); }, 1900);
    }

    if (cfg.type === 'pick') {
      const items = shuffle(cfg.items.map((it, i) => ({ ...it, i })));
      const picked = new Set();
      const need = cfg.pick || 1;
      const nCorrect = cfg.items.filter((x) => x.correct).length || 1;
      body.innerHTML = items.map((it, k) => `<button class="mini-opt" data-k="${k}"><span class="num">${k + 1}</span><span><b>${esc(it.text)}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span></button>`).join('');
      foot.innerHTML = need > 1 ? `<span class="mini-count">Đã chọn 0/${need}</span><button class="btn primary mini-go">Xong ↵</button>` : '';
      evaluate = () => {
        let hits = 0;
        for (const k of picked) if (items[k].correct) hits++;
        return hits / Math.min(need, nCorrect);
      };
      reveal = () => body.querySelectorAll('.mini-opt').forEach((b) => {
        const it = items[Number(b.dataset.k)];
        const was = picked.has(Number(b.dataset.k));
        b.classList.remove('on');
        if (it.correct) b.classList.add(was ? 'right' : 'missed'); else if (was) b.classList.add('wrong');
        b.disabled = true;
      });
      if (window.__miniDebug !== undefined) window.__miniDebug = { type: 'pick', answer: items.map((it, k) => (it.correct ? k : -1)).filter((k) => k >= 0).slice(0, need) };
      const toggle = (k) => {
        if (done || !items[k]) return;
        if (picked.has(k)) picked.delete(k); else if (picked.size < need) picked.add(k);
        sfx.choose();
        body.querySelectorAll('.mini-opt').forEach((b) => b.classList.toggle('on', picked.has(Number(b.dataset.k))));
        const c = foot.querySelector('.mini-count'); if (c) c.textContent = `Đã chọn ${picked.size}/${need}`;
        if (need === 1 && picked.size === 1) finish();
      };
      body.querySelectorAll('.mini-opt').forEach((b) => { b.onclick = () => toggle(Number(b.dataset.k)); });
      const go = foot.querySelector('.mini-go'); if (go) go.onclick = finish;
      onKey = (e) => {
        if (/^Digit[1-9]$/.test(e.code)) { e.preventDefault(); e.stopPropagation(); toggle(Number(e.code.slice(5)) - 1); }
        else if (e.code === 'Enter') { e.preventDefault(); e.stopPropagation(); finish(); }
      };
    } else if (cfg.type === 'quiz') {
      let qi = 0, right = 0;
      const render = () => {
        const q = cfg.questions[qi];
        const opts = shuffle(q.options.map((t, i) => ({ t, i })));
        if (window.__miniDebug !== undefined) window.__miniDebug = { type: 'quiz', answer: [opts.findIndex((o) => o.i === q.correct)] };
        body.innerHTML = `<div class="mini-q"><small>Câu ${qi + 1}/${cfg.questions.length}</small><b>${esc(q.q)}</b></div>` +
          opts.map((o, k) => `<button class="mini-opt" data-i="${o.i}"><span class="num">${k + 1}</span><span>${esc(o.t)}</span></button>`).join('');
        const answer = (i) => {
          if (done) return;
          const good = i === q.correct;
          if (good) right++;
          (good ? sfx.choose : sfx.bad)();
          body.querySelectorAll('.mini-opt').forEach((b) => { const bi = Number(b.dataset.i); if (bi === q.correct) b.classList.add('right'); else if (bi === i) b.classList.add('wrong'); b.disabled = true; });
          setTimeout(() => { qi++; if (qi >= cfg.questions.length) finish(); else render(); }, 450);
        };
        body.querySelectorAll('.mini-opt').forEach((b) => { b.onclick = () => answer(Number(b.dataset.i)); });
        onKey = (e) => {
          if (/^Digit[1-9]$/.test(e.code)) { const b = body.querySelectorAll('.mini-opt')[Number(e.code.slice(5)) - 1]; if (b && !b.disabled) { e.preventDefault(); e.stopPropagation(); b.click(); } }
        };
        window.removeEventListener('keydown', currentKey, true);
        currentKey = onKey;
        window.addEventListener('keydown', currentKey, true);
      };
      let currentKey = () => {};
      evaluate = () => right / cfg.questions.length;
      render();
      return; // quiz manages its own key listener
    } else if (cfg.type === 'action') {
      el.querySelector('.mini-card').classList.add('act');
      const game = startAction(body, cfg, { onDone: () => finish() });
      evaluate = () => game.score();
      reveal = () => game.stop();
      if (window.__miniDebug !== undefined) window.__miniDebug = { type: 'action', win: () => game.win() };
    } else if (cfg.type === 'sort') {
      // one card at a time, tap the right bin (keys 1–n); score = right / all cards (unanswered = wrong)
      const items = shuffle(cfg.items);
      const got = [];
      let qi = 0, busy = false;
      body.innerHTML = `<div class="mini-sort"><small class="mini-sort-n"></small><div class="mini-sort-card"></div></div>
        <div class="mini-bins">${cfg.bins.map((b, k) => `<button class="mini-opt mini-bin" data-b="${k}"><span class="num">${k + 1}</span><span>${esc(b)}</span></button>`).join('')}</div>`;
      const card = body.querySelector('.mini-sort-card'), num = body.querySelector('.mini-sort-n');
      const show = () => {
        card.className = 'mini-sort-card';
        card.innerHTML = `<b>${esc(items[qi].text)}</b>${items[qi].sub ? `<small>${esc(items[qi].sub)}</small>` : ''}`;
        num.textContent = `Thẻ ${qi + 1}/${items.length}`;
        if (window.__miniDebug !== undefined) window.__miniDebug = { type: 'sort', answer: [items[qi].bin] };
      };
      const answer = (b) => {
        if (done || busy || !items[qi] || !cfg.bins[b]) return;
        const good = items[qi].bin === b;
        got.push(good); (good ? sfx.choose : sfx.bad)();
        card.classList.add(good ? 'right' : 'wrong');
        if (!good) card.insertAdjacentHTML('beforeend', `<em>→ ${esc(cfg.bins[items[qi].bin])}</em>`);
        busy = true;
        setTimeout(() => { busy = false; qi++; if (qi >= items.length) finish(); else show(); }, good ? 260 : 650);
      };
      evaluate = () => got.filter(Boolean).length / items.length;
      reveal = () => {
        card.className = 'mini-sort-card';
        card.innerHTML = `<b>${got.filter(Boolean).length}/${items.length} thẻ đúng chỗ</b>`;
        body.querySelectorAll('.mini-bin').forEach((x) => { x.disabled = true; });
      };
      body.querySelectorAll('.mini-bin').forEach((x) => { x.onclick = () => answer(Number(x.dataset.b)); });
      onKey = (e) => { if (/^Digit[1-9]$/.test(e.code)) { e.preventDefault(); e.stopPropagation(); answer(Number(e.code.slice(5)) - 1); } };
      show();
    } else if (cfg.type === 'order') {
      const items = shuffle(cfg.items.map((it, i) => ({ ...it, i })));
      const seq = [];
      body.innerHTML = items.map((it, k) => `<button class="mini-opt" data-k="${k}"><span class="num">${k + 1}</span><span>${esc(it.text)}</span><em class="pos"></em></button>`).join('');
      foot.innerHTML = '<button class="btn mini-undo">↺ Làm lại</button>';
      // score = longest run of items already in the right relative order (one misplaced item costs one point, not two)
      const inOrder = () => {
        const vals = seq.map((k) => items[k].order);
        const len = vals.map(() => 1), prev = vals.map(() => -1);
        vals.forEach((v, i) => { for (let j = 0; j < i; j++) if (vals[j] < v && len[j] + 1 > len[i]) { len[i] = len[j] + 1; prev[i] = j; } });
        let best = -1; len.forEach((l, i) => { if (best < 0 || l > len[best]) best = i; });
        const keep = new Set(); for (let i = best; i >= 0; i = prev[i]) keep.add(seq[i]);
        return keep;
      };
      evaluate = () => (seq.length ? inOrder().size : 0) / items.length;
      reveal = () => { const keep = inOrder(); body.querySelectorAll('.mini-opt').forEach((b) => {
        const k = Number(b.dataset.k), pos = seq.indexOf(k), ok = keep.has(k);
        b.classList.remove('on'); b.classList.add(ok ? 'right' : 'wrong');
        b.querySelector('.pos').textContent = pos < 0 ? `→ #${items[k].order + 1}` : `#${pos + 1}${ok ? '' : ` → #${items[k].order + 1}`}`;
        b.disabled = true;
      }); };
      if (window.__miniDebug !== undefined) window.__miniDebug = { type: 'order', answer: items.map((it, k) => [it.order, k]).sort((a, b) => a[0] - b[0]).map((x) => x[1]) };
      const paint = () => body.querySelectorAll('.mini-opt').forEach((b) => { const k = Number(b.dataset.k); const p = seq.indexOf(k); b.classList.toggle('on', p >= 0); b.querySelector('.pos').textContent = p >= 0 ? `#${p + 1}` : ''; });
      const tap = (k) => {
        if (done || !items[k] || seq.includes(k)) return;
        seq.push(k); sfx.choose(); paint();
        if (seq.length === items.length) setTimeout(finish, 250);
      };
      body.querySelectorAll('.mini-opt').forEach((b) => { b.onclick = () => tap(Number(b.dataset.k)); });
      foot.querySelector('.mini-undo').onclick = () => { seq.length = 0; paint(); };
      onKey = (e) => { if (/^Digit[1-9]$/.test(e.code)) { e.preventDefault(); e.stopPropagation(); tap(Number(e.code.slice(5)) - 1); } };
    }
    window.addEventListener('keydown', onKey, true);
  });
}
