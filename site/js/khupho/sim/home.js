// Khu phố T&M · your room: furniture you own, what is placed in each slot, and how cosy it is. Pure, JSON-safe.
// State lives at kp.home = { owned: [itemId], placed: { slot: itemId } }.
import { FURN, DELIVERY_FEE } from '../data/furniture.js';
import { addMoney } from './world.js';

export const COZY_MAX = 30;

export function ensureHome(kp) {
  if (!kp.home || typeof kp.home !== 'object') kp.home = { owned: [], placed: {} };
  if (!Array.isArray(kp.home.owned)) kp.home.owned = [];
  if (!kp.home.placed || typeof kp.home.placed !== 'object') kp.home.placed = {};
  return kp.home;
}

/** Buy an item at Nội Thất Nhà Mình. Big items come by Chú Bảy's ba gác (+fee). Places it right away if its slot is empty. */
export function buyFurniture(kp, itemId) {
  const f = FURN[itemId]; if (!f) return { ok: false, reason: 'Anh Tín không có món này.' };
  const home = ensureHome(kp);
  if (home.owned.includes(itemId)) return { ok: false, reason: 'Bạn có món này rồi.' };
  const total = f.price + (f.big ? DELIVERY_FEE : 0);
  if (kp.player.money < total) return { ok: false, reason: `Thiếu tiền. Món này ${fmt(total)}${f.big ? ' (gồm 30.000đ ba gác)' : ''}.` };
  addMoney(kp, -f.price, 'noithat', `Nội thất: ${f.name}`);
  if (f.big) addMoney(kp, -DELIVERY_FEE, 'bagac', 'Ba gác Chú Bảy chở đồ về trọ');
  home.owned.push(itemId);
  const placed = !home.placed[f.slot];
  if (placed) home.placed[f.slot] = itemId;
  return { ok: true, total, placed, line: f.big ? `Chú Bảy chở ${f.name.toLowerCase()} về tận phòng, còn khen phòng sáng sủa.` : `Bạn ôm ${f.name.toLowerCase()} về phòng.` };
}

/** Put an owned item in its slot (null clears the slot). */
export function placeItem(kp, slot, itemId) {
  const home = ensureHome(kp);
  if (itemId == null) { delete home.placed[slot]; return { ok: true }; }
  const f = FURN[itemId];
  if (!f || f.slot !== slot || !home.owned.includes(itemId)) return { ok: false, reason: 'Món này không đặt ở đó được.' };
  home.placed[slot] = itemId;
  return { ok: true };
}

/** Cosy score 0..COZY_MAX from what is placed (a fuller room adds a small bonus). */
export function cozyScore(kp) {
  const home = ensureHome(kp);
  const items = Object.values(home.placed).map((id) => FURN[id]).filter(Boolean);
  const base = items.reduce((a, f) => a + (f.cozy || 0), 0);
  const variety = items.length >= 6 ? 3 : items.length >= 4 ? 1 : 0;
  return Math.min(COZY_MAX, base + variety);
}

/** Mood bonus applied on waking up: up to +10 from a cosy room. */
export function morningMood(kp) {
  return Math.round(cozyScore(kp) / 3);
}

export function cozyLabel(score) {
  return score >= 24 ? 'Phòng như tạp chí' : score >= 16 ? 'Ấm cúng thật sự' : score >= 8 ? 'Bắt đầu có hơi người' : score >= 1 ? 'Hơi trống' : 'Bốn bức tường và một cái quạt';
}

const fmt = (v) => `${Math.round(v).toLocaleString('vi-VN').replace(/,/g, '.')}đ`;
