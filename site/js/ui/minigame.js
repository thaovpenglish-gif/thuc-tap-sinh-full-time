// Small, repeatable mini-games shown as a sticker card (keyboard 1–9 / Enter, or tap).
// Types: 'pick' (choose N right items), 'quiz' (one question at a time), 'order' (tap items in the right order).
// runMinigame(config) -> Promise<{ score: 0..1 }>
import { esc } from '../core/util.js';
import { sfx } from '../core/audio.js';

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function shell(cfg) {
  let el = document.getElementById('mini');
  if (!el) { el = document.createElement('div'); el.id = 'mini'; document.body.appendChild(el); }
  el.innerHTML = `<div class="mini-card">
    <div class="mini-head"><span class="mini-ico">${cfg.icon || '🧩'}</span><b>${esc(cfg.title)}</b><span class="mini-time"><i></i></span></div>
    <div class="mini-prompt">${esc(cfg.prompt || '')}</div>
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
    function finish() {
      if (done) return;
      done = true;
      clearInterval(timer);
      window.removeEventListener('keydown', onKey, true);
      const score = Math.max(0, Math.min(1, evaluate()));
      const ok = score >= (cfg.pass ?? 0.5);
      (ok ? sfx.good : sfx.bad)();
      foot.innerHTML = `<div class="mini-result ${ok ? 'ok' : 'no'}">${ok ? '✅ Qua' : '❌ Chưa qua'} · ${Math.round(score * 100)}%</div>`;
      setTimeout(() => { el.hidden = true; resolve({ score }); }, 1100);
    }

    if (cfg.type === 'pick') {
      const items = shuffle(cfg.items.map((it, i) => ({ ...it, i })));
      const picked = new Set();
      const need = cfg.pick || 1;
      const nCorrect = cfg.items.filter((x) => x.correct).length || 1;
      body.innerHTML = items.map((it, k) => `<button class="mini-opt" data-k="${k}"><span class="num">${k + 1}</span><span><b>${esc(it.text)}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span></button>`).join('');
      foot.innerHTML = need > 1 ? `<span class="mini-count">Đã chọn 0/${need}</span><button class="btn primary mini-go">Xong ↵</button>` : '';
      evaluate = () => {
        let s = 0;
        for (const k of picked) s += items[k].correct ? 1 : -1;
        return s / nCorrect;
      };
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
    } else if (cfg.type === 'order') {
      const items = shuffle(cfg.items.map((it, i) => ({ ...it, i })));
      const seq = [];
      body.innerHTML = items.map((it, k) => `<button class="mini-opt" data-k="${k}"><span class="num">${k + 1}</span><span>${esc(it.text)}</span><em class="pos"></em></button>`).join('');
      foot.innerHTML = '<button class="btn mini-undo">↺ Làm lại</button>';
      evaluate = () => seq.reduce((a, k, pos) => a + (items[k].order === pos ? 1 : 0), 0) / items.length;
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
