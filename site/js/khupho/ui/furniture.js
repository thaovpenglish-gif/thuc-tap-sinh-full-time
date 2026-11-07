// Khu phố T&M · Nội Thất Nhà Mình (anh Tín) and "Sắp xếp phòng": buy furniture, choose what sits in each slot.
// Rules live in sim/home.js; this file only draws the two panels. Both re-render in place after every action.
import { ensureBase, ensureStyle, esc, money } from './night.js';
import { FURNITURE, SLOTS, DELIVERY_FEE } from '../data/furniture.js';
import { ensureHome, buyFurniture, placeItem, cozyScore, cozyLabel, morningMood, COZY_MAX } from '../sim/home.js';

const CSS = `
.kp-furn { display: grid; gap: 8px; }
.kp-item { display: grid; grid-template-columns: 34px 1fr auto; gap: 10px; align-items: center; background: #fff; border: 2px solid var(--ink, #1d1d1f); border-radius: 14px; padding: 8px 10px; }
.kp-item.on { background: #f1fff7; }
.kp-sw { width: 34px; height: 34px; border-radius: 10px; border: 2px solid var(--ink, #1d1d1f); }
.kp-item b { display: block; font-size: 15px; line-height: 1.25; }
.kp-item small { display: block; color: var(--muted, #6a6f80); font-size: 12.5px; line-height: 1.35; }
.kp-item .kp-price { font-weight: 900; font-size: 14px; color: var(--ink, #1d1d1f); }
.kp-item .kp-btn { flex: none; min-height: 44px; padding: 8px 12px; font-size: 14px; }
.kp-item .kp-btn[disabled] { opacity: .55; cursor: default; box-shadow: none; }
.kp-cozy { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; font-weight: 800; font-size: 14px; }
.kp-cozy .kp-track { grid-column: 1 / -1; }
.kp-slotname { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; font-weight: 900; color: var(--muted, #6a6f80); margin: 6px 2px 0; }
@media (max-width: 420px) { .kp-item { grid-template-columns: 28px 1fr; } .kp-item .kp-btn { grid-column: 1 / -1; } .kp-sw { width: 28px; height: 28px; } }
`;

function cozyHtml(kp) {
  const s = cozyScore(kp);
  return `<div class="kp-sec"><div class="kp-cozy"><span>Độ ấm cúng: ${s}/${COZY_MAX} · ${esc(cozyLabel(s))}</span><span>+${morningMood(kp)} tâm trạng mỗi sáng</span>
    <span class="kp-track"><i style="width:${Math.round((s / COZY_MAX) * 100)}%"></i></span></div></div>`;
}
const bySlot = () => Object.keys(SLOTS).map((slot) => ({ slot, items: FURNITURE.filter((f) => f.slot === slot) })).filter((g) => g.items.length);

/** The shop. onChange() after a purchase (re-apply decor, save); onClose() when the player leaves. toast(text) for feedback. */
export function showFurnitureShop({ root, kp, open = true, onChange, onClose, toast }) {
  ensureBase(); ensureStyle('kp-ui-furniture', CSS);
  const render = () => {
    const home = ensureHome(kp);
    const placedIds = new Set(Object.values(home.placed));
    const groups = bySlot().map(({ slot, items }) => `<div class="kp-slotname">${esc(SLOTS[slot])}</div>${items.map((f) => {
      const owned = home.owned.includes(f.id), total = f.price + (f.big ? DELIVERY_FEE : 0);
      const btn = owned ? `<button class="kp-btn" type="button" disabled>${placedIds.has(f.id) ? 'Đang ở phòng' : 'Đã có'}</button>`
        : `<button class="kp-btn primary" type="button" data-buy="${esc(f.id)}"${open ? '' : ' disabled'}>Mua ${money(total)}</button>`;
      return `<div class="kp-item${owned ? ' on' : ''}"><span class="kp-sw" style="background:${esc(f.color)}"></span>
        <span><b>${esc(f.name)}</b><small>${esc(f.desc)}</small><small class="kp-price">${money(f.price)}${f.big ? ` + ${money(DELIVERY_FEE)} ba gác` : ''} · ấm cúng +${f.cozy}</small></span>${btn}</div>`;
    }).join('')}`).join('');
    root.innerHTML = `<div class="kp-screen" role="dialog" aria-modal="true" aria-labelledby="kpFurnTitle"><div class="kp-card">
      <div class="kp-head"><div><div class="kp-kicker">Nội Thất Nhà Mình · anh Tín</div><h2 id="kpFurnTitle">Trang trí phòng 5</h2>
        <p class="kp-sub">Trong ví: ${money(kp.player.money)}${open ? '' : ' · Tiệm đang đóng, chỉ xem được thôi'}</p></div>
        <button class="kp-x" type="button" data-kp="close" aria-label="Đóng">✕</button></div>
      ${cozyHtml(kp)}
      <div class="kp-furn">${groups}</div>
      <p class="kp-note">Đồ to do Chú Bảy chở ba gác về tận phòng, thêm ${money(DELIVERY_FEE)}. Món mới tự đặt vào chỗ còn trống; đổi qua lại ở góc tủ đồ trong phòng (Sắp xếp phòng). Giá là số thiết kế.</p>
      <div class="kp-btns"><button class="kp-btn" type="button" data-kp="close2">Về thôi</button></div>
    </div></div>`;
    root.querySelectorAll('[data-buy]').forEach((b) => { b.onclick = () => {
      const r = buyFurniture(kp, b.dataset.buy);
      if (toast) toast(r.ok ? `${r.line}${r.placed ? '' : ' (Cất trong tủ, vào Sắp xếp phòng để đổi.)'}` : r.reason);
      if (r.ok && onChange) onChange();
      render();
    }; });
    root.querySelectorAll('[data-kp="close"],[data-kp="close2"]').forEach((b) => { b.onclick = () => onClose && onClose(); });
  };
  render();
}

/** "Sắp xếp phòng": for every slot with owned items, pick which one is out (or put it away). */
export function showDecor({ root, kp, onChange, onClose }) {
  ensureBase(); ensureStyle('kp-ui-furniture', CSS);
  const render = () => {
    const home = ensureHome(kp);
    const groups = bySlot().map(({ slot, items }) => ({ slot, items: items.filter((f) => home.owned.includes(f.id)) })).filter((g) => g.items.length);
    const body = groups.length ? groups.map(({ slot, items }) => `<div class="kp-slotname">${esc(SLOTS[slot])}</div>${items.map((f) => {
      const on = home.placed[slot] === f.id;
      return `<div class="kp-item${on ? ' on' : ''}"><span class="kp-sw" style="background:${esc(f.color)}"></span><span><b>${esc(f.name)}</b><small>ấm cúng +${f.cozy}</small></span>
        ${on ? `<button class="kp-btn" type="button" data-off="${esc(slot)}">Cất đi</button>` : `<button class="kp-btn primary" type="button" data-slot="${esc(slot)}" data-put="${esc(f.id)}">Bày ra</button>`}</div>`;
    }).join('')}`).join('')
      : '<p class="kp-empty">Phòng chưa có món nào ngoài cái nệm và cái quạt trần. Ghé Nội Thất Nhà Mình trên đường Tâm Mỹ (cạnh tiệm tóc) nha.</p>';
    root.innerHTML = `<div class="kp-screen" role="dialog" aria-modal="true" aria-labelledby="kpDecorTitle"><div class="kp-card">
      <div class="kp-head"><div><div class="kp-kicker">Phòng 5 · Dãy trọ Bình An</div><h2 id="kpDecorTitle">Sắp xếp phòng</h2></div>
        <button class="kp-x" type="button" data-kp="close" aria-label="Đóng">✕</button></div>
      ${cozyHtml(kp)}
      <div class="kp-furn">${body}</div>
      <div class="kp-btns"><button class="kp-btn primary" type="button" data-kp="close2">Xong</button></div>
    </div></div>`;
    root.querySelectorAll('[data-put]').forEach((b) => { b.onclick = () => { placeItem(kp, b.dataset.slot, b.dataset.put); if (onChange) onChange(); render(); }; });
    root.querySelectorAll('[data-off]').forEach((b) => { b.onclick = () => { placeItem(kp, b.dataset.off, null); if (onChange) onChange(); render(); }; });
    root.querySelectorAll('[data-kp="close"],[data-kp="close2"]').forEach((b) => { b.onclick = () => onClose && onClose(); });
  };
  render();
}
