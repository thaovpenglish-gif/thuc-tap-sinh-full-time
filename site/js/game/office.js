// Office equipment mini-games, shared by every company (pure data + choice, no DOM). Side-task legs that use the
// printer or the pantry play one of these (modes/solo.js handleTaskVisit); two of them also join every company's
// desk rotation (game/desk.js content + these). Mechanics live in ui/action.js.
import { rng } from './tasks.js';

export const PRINTER_GAMES = [
  { id: 'off_jam', type: 'action', game: 'printjam', title: 'Máy in kẹt giấy', icon: '🖨️', time: 35, pass: 0.6, jams: 3,
    prompt: 'Máy in lại kẹt. Kéo từng mẩu giấy ra theo mũi tên. Kéo TỪ TỪ: giật mạnh là rách, mẩu nhỏ còn kẹt lại.',
    hint: 'Nhìn thanh lực phía trên mẩu giấy: xanh là vừa tay, đỏ là sắp rách.' },
  { id: 'off_collate', type: 'action', game: 'collate', title: 'Xếp trang và bấm ghim', icon: '📑', time: 40, pass: 0.6, sets: 2, pages: 5,
    prompt: 'Máy in nhả trang lộn xộn. Bấm các trang theo thứ tự 1 → 5 (trang úp ↺ thì lật trước), rồi bấm ghim khi vòng đỏ khớp vòng xanh.',
    hint: 'Bấm sai thứ tự hay ghim lệch đều bị trừ điểm.' },
  { id: 'off_net', type: 'action', game: 'wires', title: 'Máy in mất mạng', icon: '🔌', time: 35, pass: 0.6, count: 4, label: 'MÁY IN', from: 'SWITCH',
    prompt: 'Máy in báo "offline". Ai đó rút dây để sạc điện thoại. Cắm lại từng dây vào cổng cùng màu, cùng hình.',
    hint: 'Kéo từ đầu dây bên trái sang cổng bên phải. Cắm sai là chập.' },
];

const DRINKS = [
  { test: /trà sữa/i, color: '#c9a27a', label: 'TRÀ SỮA', orders: ['Ít đá', 'Nhiều sữa', 'Đầy ly'] },
  { test: /trà/i, color: '#b5701e', label: 'TRÀ', orders: ['Khách quý', 'Sếp: nóng', 'Nửa ly thôi'] },
  { test: /.*/, color: '#6b3f22', label: 'CÀ PHÊ', orders: ['Sếp: ít đường', 'Khách: đầy ly', 'Chị kế toán: đậm'] },
];
/** Pour game for a pantry leg; the drink follows the leg's text (trà / trà sữa / cà phê). */
export function pourGame(text = '') {
  const d = DRINKS.find((x) => x.test.test(text));
  return { id: 'off_pour', type: 'action', game: 'hold', skin: 'cup', title: `Pha ${d.label.toLowerCase()}`, icon: '☕', time: 35, pass: 0.6,
    rounds: 3, zone: 0.14, color: d.color, label: d.label, orders: d.orders,
    prompt: 'Giữ để rót, thả ra khi mặt nước nằm giữa hai vạch xanh. Rót quá là tràn ra bàn, lau mất thêm 10 phút.',
    hint: 'Giữ chuột / chạm giữ màn hình (hoặc giữ Space), thả ra đúng lúc.' };
}

/** Which mini-game a side-task leg plays, or null (only the printer and the pantry have one). */
export function officeGameFor(leg, seed = 1) {
  if (!leg || !leg.obj) return null;
  if (leg.obj === 'printer') return PRINTER_GAMES[Math.floor(rng(seed)() * PRINTER_GAMES.length)];
  if (leg.obj === 'coffee') return pourGame(leg.line ? leg.line[1] : '');
  return null;
}

/** Two equipment games that join every company's desk rotation (so not every desk session is reading or chatting). */
export const DESK_OFFICE_GAMES = [
  { id: 'off_shred', type: 'action', game: 'shredder', title: 'Dọn bàn: hủy hay lưu?', icon: '🗂️', time: 40, pass: 0.6, count: 8,
    prompt: 'Bàn bạn ngập giấy. Kéo tờ có thông tin nhạy cảm hoặc hết hạn XUỐNG máy hủy, tờ cần giữ SANG tủ lưu.',
    hint: 'Kéo tờ giấy xuống dưới để hủy, sang phải để lưu.' },
  { ...PRINTER_GAMES[2], id: 'off_net_desk', title: 'Cắm lại dây mạng cả phòng', label: 'SWITCH', from: 'MÁY BÀN', count: 5,
    prompt: 'Cả phòng mất mạng đúng lúc sếp đang họp online. Cắm lại 5 dây vào đúng cổng trước khi sếp quay lại.' },
];
