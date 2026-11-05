// Company registry. Metadata is static (fast menu); each company's content is loaded lazily from ./<id>/index.js,
// so one broken company never breaks the others. `ready: false` shows "Sắp mở tuyển" on the card.
export const COMPANY_LIST = [
  { id: 'tm', style: 'tm', name: 'T&M Partners', emoji: '📊', color: '#c9b6ff', industry: 'Tư vấn chiến lược & quản lý', scale: '~20 người',
    blurb: '"We deliver excellence. Eventually." Buzzword, Scrum Master và những "ý nhỏ" của chị Chủ tịch.', toxic: 3, ready: true },
  { id: 'bama', style: 'workshop', map: 'bama', styleLive: true, name: 'Ba & Má', emoji: '🍖', color: '#ffd3b8', industry: 'Sản xuất & bán khô gà, khô bò, trái cây sấy', scale: '~20 người + xưởng',
    blurb: 'Công ty gia đình. Ba là CEO, Má giữ két, con trai làm "Head of Innovation". Livestream mỗi tối.', toxic: 4, ready: true },
  { id: 'tech', style: 'startup', map: 'tech', styleLive: true, name: 'Nợ Kỹ Thuật Labs', emoji: '💻', color: '#bfe3ff', industry: 'Công nghệ · startup app', scale: '~80 người',
    blurb: 'Văn hóa "flat", deploy chiều thứ Sáu, on-call cuối tuần và một vòng gọi vốn "sắp xong".', toxic: 3, ready: true },
  { id: 'agency', style: 'studio', map: 'agency', name: 'Trend Trễ Agency', emoji: '📣', color: '#ffc8dd', industry: 'Marketing agency', scale: '~30 người',
    blurb: 'Khách sửa "lần cuối" lần thứ 14. KOL bùng. Viral thì có, nhưng viral ngược.', toxic: 4, ready: true },
  { id: 'audit', style: 'corporate', name: 'Cân Đối & Cộng Sự', emoji: '🧮', color: '#b8f0d8', industry: 'Kế toán · kiểm toán', scale: '~300 người',
    blurb: 'Busy season, kiểm kê kho lúc 2 giờ sáng và những con số "rất sáng tạo" của khách hàng.', toxic: 4, ready: true },
  { id: 'event', style: 'warehouse', name: 'Đi Đâu Cũng Được', emoji: '🎪', color: '#ffe9a0', industry: 'Tổ chức sự kiện & du lịch', scale: '~15 người',
    blurb: 'Mưa giữa sự kiện ngoài trời, khách đổi ý lúc 23h, team building bắt buộc vui.', toxic: 3, ready: true },
  { id: 'hr', style: 'cozy', name: 'Người Đúng Chỗ HR', emoji: '🧲', color: '#e3d9ff', industry: 'Tư vấn nhân sự · headhunt', scale: '~10 người',
    blurb: 'Công ty tư vấn nhân sự có quy trình nhân sự nội bộ… tệ nhất mà bạn từng thấy.', toxic: 2, ready: true },
];
export const companyMeta = (id) => COMPANY_LIST.find((c) => c.id === id) || { id, name: id, emoji: '🏢', color: '#ddd', ready: false };
export const companyName = (id) => companyMeta(id).name;

const cache = {};
export async function loadCompany(id) {
  if (!cache[id]) cache[id] = import(`./${id}/index.js`).then((m) => ({ ...m.default, meta: companyMeta(id) }));
  return cache[id];
}
