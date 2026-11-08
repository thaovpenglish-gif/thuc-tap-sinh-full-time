// Khu phố T&M · a story or drama scene: lines appear one by one (click / Space / E), then choices, then the reply
// and what changed. Used for the main story beats and the drama acts (sim/story.js).
import { ensureBase, ensureStyle, esc } from './night.js';

const CSS = `
.kp-scene { display: grid; gap: 8px; max-height: min(52vh, 420px); overflow-y: auto; padding: 2px; margin-top: 10px; }
.kp-say { background: #fff; border: 2px solid var(--ink, #1d1d1f); border-radius: 14px; padding: 8px 12px; font-size: 15.5px; line-height: 1.45; animation: kpIn .18s ease-out; }
.kp-say b { display: block; font-size: 12px; letter-spacing: .04em; color: var(--muted, #6a6f80); text-transform: uppercase; }
.kp-say.nar { background: transparent; border-style: dashed; font-style: italic; color: #4b4f5c; }
.kp-say.me { background: var(--mint, #b8f0d8); margin-left: 18%; }
.kp-say.res { background: var(--butter, #ffe9a0); font-weight: 800; font-size: 14px; }
.kp-choices { display: grid; gap: 8px; margin-top: 12px; }
.kp-choices .kp-btn { text-align: left; font-size: 15px; }
.kp-tag { display: inline-block; border: 2px solid var(--ink, #1d1d1f); border-radius: 99px; padding: 1px 9px; font-size: 12px; font-weight: 900; background: #fff; margin-right: 6px; }
.kp-tag.drama { background: #ffc2b3; } .kp-tag.story { background: var(--lilac, #c9b6ff); }
@keyframes kpIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
`;

/**
 * item: { kind: 'story'|'drama', title, task, scene, act?, acts? }. choices: the filtered choices (each with original index i).
 * nameOf(id) → display name. fill(text) → text with {ten}. onChoose(i) → result lines (strings or {id, v}). onDone().
 */
export function showScene({ root, item, choices, nameOf, fill = (t) => t, onChoose, onDone }) {
  ensureBase(); ensureStyle('kp-ui-scene', CSS);
  const kicker = item.kind === 'drama' ? `<span class="kp-tag drama">🔥 Có biến</span>${esc(item.title)}${item.acts ? ` · hồi ${item.act + 1}/${item.acts}` : ''}` : `<span class="kp-tag story">📌 Cốt truyện</span>${esc(item.title)}`;
  root.innerHTML = `<div class="kp-screen" role="dialog" aria-modal="true" aria-labelledby="kpSceneTitle"><div class="kp-card">
    <div class="kp-kicker">${kicker}</div><h2 id="kpSceneTitle">${esc(fill(item.task))}</h2>
    <div class="kp-scene" id="kpSceneLog" aria-live="polite"></div>
    <div class="kp-choices" id="kpSceneAct"></div></div></div>`;
  const log = root.querySelector('#kpSceneLog'), act = root.querySelector('#kpSceneAct');
  const bubble = ([who, text], cls = '') => {
    const el = document.createElement('div');
    const kind = who === 'nar' ? 'nar' : who === 'me' ? 'me' : '';
    el.className = `kp-say ${kind} ${cls}`.trim();
    el.innerHTML = `${who === 'nar' ? '' : `<b>${esc(who === 'me' ? 'Bạn' : nameOf(who))}</b>`}${esc(fill(text))}`;
    log.appendChild(el); log.scrollTop = log.scrollHeight;
  };
  let queue = [...(item.scene.lines || [])], after = null, keyHandler = null, picked = false;
  const setKeys = (fn) => { if (keyHandler) document.removeEventListener('keydown', keyHandler, true); keyHandler = fn; if (fn) document.addEventListener('keydown', fn, true); };
  const nextBtn = (label, fn, primary = true) => {
    act.innerHTML = `<button class="kp-btn${primary ? ' primary' : ''}" type="button" id="kpSceneNext">${esc(label)}</button>`;
    const b = act.querySelector('#kpSceneNext'); b.onclick = fn;
    setKeys((e) => { if (['Space', 'Enter', 'KeyE'].includes(e.code)) { e.preventDefault(); e.stopPropagation(); fn(); } });
    try { b.focus({ preventScroll: true }); } catch { /* old browsers */ }
  };
  function step() {
    if (queue.length) { bubble(queue.shift()); return queue.length ? nextBtn('Tiếp ▸', step) : (choices.length ? showChoices() : end([])); }
  }
  function showChoices() {
    setKeys((e) => { const m = e.code.match(/^Digit([1-4])$/); if (m && choices[+m[1] - 1]) { e.preventDefault(); e.stopPropagation(); pick(choices[+m[1] - 1]); } });
    act.innerHTML = choices.map((c, k) => `<button class="kp-btn" type="button" data-c="${k}"><span class="kp-tag">${k + 1}</span>${esc(fill(c.t))}</button>`).join('');
    act.querySelectorAll('[data-c]').forEach((b) => { b.onclick = () => pick(choices[+b.dataset.c]); });
  }
  function pick(c) {
    if (picked) return; picked = true;
    bubble(['me', c.t]);
    const res = onChoose ? onChoose(c.i) : [];
    queue = [...(c.say || [])]; after = res;
    const drain = () => { if (queue.length) { bubble(queue.shift()); return queue.length ? nextBtn('Tiếp ▸', drain) : end(after); } end(after); };
    drain();
  }
  function end(res) {
    if (!picked) { picked = true; res = onChoose ? onChoose(-1) : []; } // a scene without choices still completes
    const parts = (res || []).map((x) => (typeof x === 'string' ? x : `${x.v > 0 ? '❤️'.repeat(Math.min(3, x.v)) : '💔'.repeat(Math.min(3, -x.v))} ${nameOf(x.id)}`));
    if (parts.length) bubble(['nar', parts.join(' · ')], 'res');
    nextBtn('Xong', () => { setKeys(null); onDone && onDone(); });
  }
  if (!queue.length) queue = [['nar', '…']];
  step();
}
