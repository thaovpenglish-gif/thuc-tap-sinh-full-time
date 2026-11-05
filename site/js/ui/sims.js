// Work simulations for desk mini-games (DOM, text-first so documents stay readable on a phone):
//   doc  · read a real work document (CV, invoice, contract, code, post…), tap every line that is a problem, then make
//          the call (verdict). Afterwards each problem line shows WHY — players learn the trade.
//   chat · a messenger thread with a candidate / client / vendor: they write, you pick a reply, they react, a
//          rapport meter moves, the ending depends on how you handled it.
// startSim(host, foot, cfg, { onDone }) -> { score(): 0..1, stop(), reveal(), info() }   (used by ui/minigame.js)
// cfg (one scenario, already drawn from the bank by game/desk.js sampleMini):
//   doc:  { kind, head, meta?, lines: ['text' | { h: 'SECTION' } | { t: 'text', bad: 'why' }], verdict?: { q, options[], correct } }
//   chat: { who: { name, emoji, role?, app? }, start?: ['msg'…], turns: [{ them?: 'msg', options: [{ t, s: 0|1|2, react? }] }],
//           end: { good: 'msg', bad: 'msg' } }
import { esc } from '../core/util.js';
import { sfx } from '../core/audio.js';

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------------------------- doc
function doc(host, foot, cfg, { onDone }) {
  const lines = cfg.lines.map((l) => (typeof l === 'string' ? { t: l } : l));
  const nBad = lines.filter((l) => l.bad).length;
  const flags = new Set();
  let verdictPick = null, stage = 'flag', stopped = false;
  host.innerHTML = `<div class="doc doc-${esc(cfg.kind || 'paper')}">
      <div class="doc-head"><b>${esc(cfg.head || '')}</b>${cfg.meta ? `<small>${esc(cfg.meta)}</small>` : ''}</div>
      <div class="doc-lines">${lines.map((l, i) => (l.h ? `<div class="doc-h">${esc(l.h)}</div>`
        : `<button class="doc-line" data-i="${i}"><span class="doc-t">${esc(l.t)}</span><span class="doc-flag">🚩</span></button>`)).join('')}</div>
    </div>`;
  const count = () => { const c = foot.querySelector('.mini-count'); if (c) c.textContent = `🚩 Đã đánh dấu ${flags.size}`; };
  const toVerdict = () => {
    if (stopped) return;
    if (!cfg.verdict) { stage = 'done'; onDone(); return; }
    stage = 'verdict';
    host.querySelectorAll('.doc-line').forEach((b) => { b.disabled = true; });
    foot.innerHTML = `<div class="doc-verdict"><b>${esc(cfg.verdict.q)}</b><div class="doc-vopts">${cfg.verdict.options.map((o, k) => `<button class="btn${k ? '' : ' primary'}" data-v="${k}"><span class="num">${k + 1}</span> ${esc(o)}</button>`).join('')}</div></div>`;
    foot.querySelectorAll('[data-v]').forEach((b) => { b.onclick = () => { verdictPick = Number(b.dataset.v); sfx.choose(); stage = 'done'; onDone(); }; });
  };
  host.querySelectorAll('.doc-line').forEach((b) => { b.onclick = () => {
    if (stage !== 'flag') return;
    const i = Number(b.dataset.i);
    if (flags.has(i)) flags.delete(i); else flags.add(i);
    b.classList.toggle('on', flags.has(i)); sfx.blip(flags.has(i) ? 1.3 : 0.9); count();
  }; });
  foot.innerHTML = `<span class="mini-count"></span><button class="btn primary mini-go">${cfg.verdict ? 'Xong, ra quyết định ↵' : 'Xong ↵'}</button>`;
  foot.querySelector('.mini-go').onclick = toVerdict; count();
  const onKey = (e) => {
    if (e.code === 'Enter' && stage === 'flag') { e.preventDefault(); e.stopPropagation(); toVerdict(); }
    else if (stage === 'verdict' && /^Digit[1-4]$/.test(e.code)) { const b = foot.querySelector(`[data-v="${Number(e.code.slice(5)) - 1}"]`); if (b) { e.preventDefault(); e.stopPropagation(); b.click(); } }
  };
  window.addEventListener('keydown', onKey, true);
  const flagScore = () => {
    let hits = 0, wrong = 0;
    for (const i of flags) if (lines[i].bad) hits++; else wrong++;
    return nBad ? Math.max(0, Math.min(1, (hits - wrong * 0.5) / nBad)) : Math.max(0, 1 - wrong * 0.34);
  };
  return {
    score: () => (cfg.verdict ? flagScore() * 0.7 + (verdictPick === cfg.verdict.correct ? 0.3 : 0) : flagScore()),
    stop: () => { stopped = true; window.removeEventListener('keydown', onKey, true); },
    reveal: () => {
      host.querySelectorAll('.doc-line').forEach((b) => {
        const i = Number(b.dataset.i), l = lines[i], f = flags.has(i);
        b.disabled = true; b.classList.remove('on');
        if (l.bad) { b.classList.add(f ? 'right' : 'missed'); b.insertAdjacentHTML('beforeend', `<em class="doc-why">${f ? '✓' : 'Bỏ sót'}: ${esc(l.bad)}</em>`); }
        else if (f) b.classList.add('wrong');
      });
      if (cfg.verdict) host.insertAdjacentHTML('beforeend', `<div class="doc-answer">${verdictPick === cfg.verdict.correct ? '✅' : '❌'} Quyết định đúng: <b>${esc(cfg.verdict.options[cfg.verdict.correct])}</b>${cfg.verdict.why ? ` · ${esc(cfg.verdict.why)}` : ''}</div>`);
      const first = host.querySelector('.doc-line.missed, .doc-line.wrong'); if (first) first.scrollIntoView({ block: 'nearest' });
    },
    info: () => ({ kind: 'doc', bad: lines.map((l, i) => (l.bad ? i : -1)).filter((i) => i >= 0), verdict: cfg.verdict ? cfg.verdict.correct : null, stage }),
  };
}

// ---------------------------------------------------------------------------------------------- chat
function chat(host, foot, cfg, { onDone }) {
  const who = cfg.who || { name: '…', emoji: '💬' };
  let got = 0, max = 0, turn = -1, stopped = false, current = null;
  host.innerHTML = `<div class="chat">
      <div class="chat-top"><span class="chat-av">${esc(who.emoji || '💬')}</span><span><b>${esc(who.name)}</b><small>${esc(who.role || '')}${who.app ? ` · ${esc(who.app)}` : ''}</small></span><span class="chat-mood" title="Thiện cảm">😐</span></div>
      <div class="chat-log"></div>
    </div>`;
  const log = host.querySelector('.chat-log'), mood = host.querySelector('.chat-mood');
  const scroll = () => { log.scrollTop = log.scrollHeight; };
  const bubble = (side, text) => { log.insertAdjacentHTML('beforeend', `<div class="cb ${side}">${esc(text)}</div>`); scroll(); };
  const typing = async (text, ms) => {
    log.insertAdjacentHTML('beforeend', '<div class="cb them typing"><i></i><i></i><i></i></div>'); scroll();
    await sleep(ms ?? Math.min(1400, 380 + text.length * 14));
    const t = log.querySelector('.typing'); if (t) t.remove();
    if (stopped) return; bubble('them', text); sfx.blip(0.9);
  };
  const setMood = () => { const r = max ? got / max : 0.5; mood.textContent = r >= 0.8 ? '😍' : r >= 0.55 ? '🙂' : r >= 0.3 ? '😐' : '😠'; mood.classList.remove('bump'); void mood.offsetWidth; mood.classList.add('bump'); };
  const showOptions = (t) => {
    current = shuffle(t.options.map((o, i) => ({ ...o, i })));
    foot.innerHTML = `<div class="chat-opts">${current.map((o, k) => `<button class="mini-opt chat-opt" data-k="${k}"><span class="num">${k + 1}</span><span>${esc(o.t)}</span></button>`).join('')}</div>`;
    foot.querySelectorAll('.chat-opt').forEach((b) => { b.onclick = () => answer(Number(b.dataset.k)); });
  };
  async function answer(k) {
    if (stopped || !current || !current[k]) return;
    const o = current[k]; current = null;
    foot.innerHTML = '';
    const s = Math.max(0, Math.min(2, o.s ?? 0));
    got += s; max += 2; (s === 2 ? sfx.choose : s === 0 ? sfx.bad : sfx.blip)();
    bubble('me', o.t); setMood();
    if (o.react) await typing(o.react);
    next();
  }
  async function next() {
    if (stopped) return;
    turn++;
    const t = cfg.turns[turn];
    if (!t) {
      const good = max ? got / max >= (cfg.pass ?? 0.5) - 1e-9 : true;
      const end = good ? (cfg.end && cfg.end.good) : (cfg.end && cfg.end.bad);
      if (end) await typing(end, 700);
      if (!stopped) setTimeout(onDone, 500);
      return;
    }
    if (t.them) await typing(t.them);
    if (!stopped) showOptions(t);
  }
  const onKey = (e) => { if (current && /^Digit[1-4]$/.test(e.code)) { e.preventDefault(); e.stopPropagation(); answer(Number(e.code.slice(5)) - 1); } };
  window.addEventListener('keydown', onKey, true);
  (async () => { for (const m of cfg.start || []) await typing(m, 600); next(); })();
  return {
    // unanswered turns count as 0 when time runs out
    score: () => { const all = cfg.turns.length * 2; return all ? got / all : 1; },
    stop: () => { stopped = true; window.removeEventListener('keydown', onKey, true); },
    reveal: () => { host.querySelector('.chat').classList.add('over'); },
    info: () => ({ kind: 'chat', options: current ? current.map((o) => o.s ?? 0) : null }),
  };
}

const SIMS = { doc, chat };
export const SIM_TYPES = Object.keys(SIMS);
export function startSim(host, foot, cfg, opts) { return SIMS[cfg.type](host, foot, cfg, opts); }
