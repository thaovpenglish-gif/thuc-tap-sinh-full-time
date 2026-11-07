// Khu phố T&M · Xóm Ơi: the residents' group chat on the in-game phone (DESIGN.md 3.8). Renders into root.
import { ensureBase, ensureStyle, esc, LAW_NOTE } from './night.js';
import { GROUP_NAME } from '../sim/xomoi.js';
import { markXomoiRead } from '../sim/world.js';
import { dateOf, clockLabel } from '../sim/calendar.js';

const CSS = `
.kp-chat { display: grid; gap: 8px; margin-top: 10px; }
.kp-day { text-align: center; font-size: 12px; font-weight: 900; color: var(--muted, #6a6f80); margin: 8px 0 2px; }
.kp-bubble { background: #fff; border: 2px solid var(--ink, #1d1d1f); border-radius: 16px 16px 16px 4px; padding: 8px 12px; max-width: 92%; }
.kp-bubble.new { background: var(--butter, #ffe9a0); }
.kp-bubble.drama { background: var(--pink, #ffc8dd); }
.kp-bubble b { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; }
.kp-bubble b small { font-weight: 700; color: var(--muted, #6a6f80); font-variant-numeric: tabular-nums; }
.kp-bubble p { margin: 3px 0 0; font-size: 15px; line-height: 1.45; overflow-wrap: anywhere; }
`;

/** Render the Xóm Ơi feed (delivered messages only) and mark everything read. */
export function showXomoi({ root, kp, onClose }) {
  ensureBase(); ensureStyle('kp-ui-xomoi', CSS);
  const msgs = kp.xomoi.msgs.filter((m) => m.delivered).slice(-80);
  const law = msgs.some((m) => m.law);
  let lastDay = null;
  const items = msgs.map((m) => {
    const head = m.day !== lastDay ? `<div class="kp-day">${esc(dateOf(m.day).label)}</div>` : '';
    lastDay = m.day;
    return `${head}<div class="kp-bubble${m.seen ? '' : ' new'}${m.drama ? ' drama' : ''}"><b>${esc(m.from)}<small>${clockLabel(m.min)}</small></b><p>${esc(m.text)}</p></div>`;
  }).join('');
  root.innerHTML = `<div class="kp-screen" role="dialog" aria-modal="true" aria-labelledby="kpXomoiTitle"><div class="kp-card">
    <div class="kp-head"><div><div class="kp-kicker">Xóm Ơi</div><h2 id="kpXomoiTitle">${esc(GROUP_NAME)}</h2>
      <p class="kp-sub">Quản trị: bà Phấn · tối không làm phiền, trừ khi có drama</p></div>
      <button class="kp-x" type="button" data-kp="close" aria-label="Đóng nhóm chat">✕</button></div>
    <div class="kp-chat">${items || '<p class="kp-empty">Nhóm im re. Chắc mọi người đang bận đi chợ.</p>'}</div>
    ${law ? `<p class="kp-note">Tin nhắn nhắc luật trong nhóm là tóm tắt cho vui ${LAW_NOTE}.</p>` : ''}
    <div class="kp-btns"><button class="kp-btn primary" type="button" data-kp="close2">Xong, cất điện thoại</button></div>
  </div></div>`;
  markXomoiRead(kp);
  const card = root.querySelector('.kp-screen');
  if (card) card.scrollTop = card.scrollHeight;
  const close = () => { root.innerHTML = ''; if (onClose) onClose(); };
  root.querySelector('[data-kp="close"]').addEventListener('click', close, { once: true });
  root.querySelector('[data-kp="close2"]').addEventListener('click', close, { once: true });
  return { close };
}
