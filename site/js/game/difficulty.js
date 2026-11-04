// Salary tiers = difficulty. Pure data + helpers (no DOM). Numbers are first-pass and meant to be tuned.
// Tax rule used in-game (entertainment, not legal advice): from 1/7/2026, payments
// >= 5,000,000 VND per payment to someone without a labour contract (or one under 3 months) are withheld at 10%,
// unless the person files a commitment form (cam kết) that their yearly taxable income stays below the threshold.

export const TAX_THRESHOLD = 5_000_000;
export const TAX_RATE = 0.10;

export const TIERS = {
  t0: {
    id: 't0', salary: 0, label: '0 đồng', name: 'Easy', emoji: '🌱',
    sideTasks: 1, deadlineMult: 1.5, qa: 0.34, otPressure: 0,
    expectation: 'Không ai nhớ tên em. Cũng không ai giao việc khó.',
    perks: ['Giấy xác nhận thực tập', 'Cơm trưa miễn phí ở pantry', 'Về đúng giờ'],
    costs: ['Không có phụ cấp', 'Ít cơ hội được ghi nhận'],
  },
  t1: {
    id: 't1', salary: 1_000_000, label: '1 triệu', name: 'Normal', emoji: '🙂',
    sideTasks: 2, deadlineMult: 1.2, qa: 0.5, otPressure: 0,
    expectation: 'Có việc thật, có người hướng dẫn.',
    perks: ['Phụ cấp 1 triệu/tháng', 'Vé gửi xe'],
    costs: ['Thỉnh thoảng bị nhờ ở lại'],
  },
  t3: {
    id: 't3', salary: 3_000_000, label: '3 triệu', name: 'Hard', emoji: '🔥',
    sideTasks: 3, deadlineMult: 1.0, qa: 0.67, otPressure: 1,
    expectation: 'Em được giao việc độc lập. Sai thì em chịu.',
    perks: ['Phụ cấp 3 triệu/tháng', 'Được ghi tên trên deck gửi khách', 'Được dự họp khách'],
    costs: ['"Em ở lại xíu được không?"', 'Sai thì em tự chịu'],
  },
  t5: {
    id: 't5', salary: 5_000_000, label: '5 triệu', name: 'Consulting Hell', emoji: '💀',
    sideTasks: 5, deadlineMult: 0.8, qa: 0.84, otPressure: 2,
    expectation: 'Em là gương mặt của đợt intern này. Chị Tuyết sẽ nhớ tên em.',
    perks: ['Phụ cấp 5 triệu/tháng', 'Laptop mới (không phải đời 2015)', 'Được đi gặp khách', 'Xét chính thức sớm'],
    costs: ['Bị khấu trừ 10% thuế nếu không nộp tờ cam kết', '"OT tự nguyện bắt buộc"', 'Duyệt việc rất khắt khe'],
  },
};
export const TIER_ORDER = ['t0', 't1', 't3', 't5'];

export const tier = (id) => TIERS[id] || TIERS.t1;

/** Amount withheld per monthly payment. */
export function withholding(tierId, hasCommitment) {
  const t = tier(tierId);
  if (hasCommitment || t.salary < TAX_THRESHOLD) return 0;
  return Math.round(t.salary * TAX_RATE);
}
export const netPay = (tierId, hasCommitment) => tier(tierId).salary - withholding(tierId, hasCommitment);

/** A mini-game score (0..1) passes the review bar of this tier. */
export const passes = (tierId, score) => score >= tier(tierId).qa;

/** Deadline length (game minutes) for a side task of `base` minutes at this tier. */
export const deadlineFor = (tierId, base) => Math.round(base * tier(tierId).deadlineMult);

export const fmtVND = (n) => (n === 0 ? '0 đồng' : n.toLocaleString('vi-VN') + ' đ');
