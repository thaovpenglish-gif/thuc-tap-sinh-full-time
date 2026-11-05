// Career systems shared by every company (pure, no DOM): 45-day calendar, episode scheduling, morning moods,
// after-work life events, hunger, money & payroll, weekly performance review.
// Numbers are first-pass and meant to be tuned. Legal numbers are simplified for entertainment.
import { rng } from './tasks.js';
import { tier as tierInfo, TAX_THRESHOLD, TAX_RATE } from './difficulty.js';

export const MAX_DAYS = 45;              // an internship run lasts at most 45 calendar days
export const WORKDAYS_PER_MONTH = 22;
export const PAYDAY = 30;                // first payslip at the end of day 30; the rest at the end of the run
export const START_MONEY = 4_000_000;    // pocket money from home + savings (rent is due on day 1)
export const RENT = 1_800_000;           // shared rented room, paid at the start of each month of the run (day 1, day 31)
export const LOAN = 500_000;             // what a colleague lends you when your wallet is empty
export const MOM_HELP = 1_000_000;       // calling home, once per run
export const COMMUTE_COST = 30_000;      // petrol + parking, every workday
export const OFFICIAL_INSURANCE = 0.105; // employee share: 8% retirement + 1.5% health + 1% unemployment
export const PERSONAL_DEDUCTION = 15_500_000; // personal deduction per month used in-game (2026)

// ---------- calendar ----------
const WD = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
/** Day 1 is a Monday. weekday 0 = Monday … 6 = Sunday. */
export const weekday = (day) => ((Math.max(1, day) - 1) % 7);
export const weekdayName = (day) => WD[weekday(day)];
export const isWeekend = (day) => weekday(day) >= 5;
export const isFriday = (day) => weekday(day) === 4;
export const weekOf = (day) => Math.floor((Math.max(1, day) - 1) / 7) + 1;
/** Next workday after `day` (skips the weekend). */
export function nextWorkday(day) { let d = day + 1; while (isWeekend(d)) d++; return d; }
export function workdaysBetween(a, b) { let n = 0; for (let d = a; d <= b; d++) if (!isWeekend(d)) n++; return n; }

/**
 * Assign intern episodes to workdays. Episodes: [{ id, day?, minDay?, maxDay?, official? }].
 * Returns { [day]: episodeId }. Official-only episodes are scheduled later, at promotion time.
 */
export function scheduleEpisodes(episodes, seed = 1, maxDay = MAX_DAYS) {
  const r = rng(seed);
  const plan = {};
  const taken = new Set();
  const list = episodes.filter((e) => !e.official);
  // fixed days first, then ranged ones in order, then the rest spread over free workdays
  const fixed = list.filter((e) => Number.isFinite(e.day));
  const loose = list.filter((e) => !Number.isFinite(e.day));
  for (const e of fixed) {
    let d = e.day;
    while ((isWeekend(d) || taken.has(d)) && d < maxDay) d++;
    if (d <= maxDay) { plan[d] = e.id; taken.add(d); }
  }
  for (const e of loose) {
    const lo = Math.max(1, e.minDay || 2), hi = Math.min(maxDay, e.maxDay || maxDay);
    const free = [];
    for (let d = lo; d <= hi; d++) if (!isWeekend(d) && !taken.has(d)) free.push(d);
    if (!free.length) continue;
    const d = free[Math.floor(r() * free.length)];
    plan[d] = e.id; taken.add(d);
  }
  return plan;
}

/**
 * Schedule the post-promotion arc after `fromDay`: one episode every `gap` workdays. The arc has priority over intern
 * episodes on those days. If there are not enough workdays left, the gap shrinks to 1; if still not enough, the middle
 * episodes are dropped but the first and the final one (the ending) always play.
 */
export function scheduleArc(arcIds, fromDay, plan, gap = 2, maxDay = MAX_DAYS) {
  const out = { ...plan };
  const all = [];
  for (let d = fromDay + 1; d <= maxDay; d++) if (!isWeekend(d)) all.push(d);
  // prefer days without an intern episode; fall back to every workday when there are not enough
  const empty = all.filter((d) => !plan[d]);
  const free = empty.length >= Math.min(arcIds.length, all.length) ? empty : all;
  if (!free.length || !arcIds.length) return out;
  let ids = [...arcIds];
  if (ids.length > free.length) ids = free.length >= 2 ? [...ids.slice(0, free.length - 1), ids[ids.length - 1]] : [ids[ids.length - 1]];
  // first arc episode on the first official workday, then every `g` workdays (shrinks to fit)
  const g = ids.length > 1 ? Math.max(1, Math.min(gap, Math.floor((free.length - 1) / (ids.length - 1)))) : 1;
  ids.forEach((id, i) => { out[free[Math.min(free.length - 1, i * g)]] = id; });
  return out;
}

// ---------- morning moods ----------
// drain: hunger speed multiplier · mini: mini-game time multiplier · nl: energy at start of day
export const MOODS = [
  { id: 'hype', emoji: '🚀', name: 'Hăng hái', text: 'Hôm nay bạn thấy mình có thể làm lại cả bộ slide của công ty.', drain: 0.9, mini: 1.15, nl: 5 },
  { id: 'meh', emoji: '😐', name: 'Bình thường', text: 'Không vui, không buồn. Một ngày "ok em".', drain: 1, mini: 1, nl: 0 },
  { id: 'sleepy', emoji: '😴', name: 'Thiếu ngủ', text: 'Tối qua group chat công ty nổ tới 1 giờ sáng. Mắt bạn mở được 60%.', drain: 1.25, mini: 0.85, nl: -15 },
  { id: 'broke', emoji: '💸', name: 'Cháy túi', text: 'Số dư tài khoản có ba chữ số. Hôm nay bạn mang cơm hộp.', drain: 1, mini: 1, nl: 0, needsLowMoney: true },
  { id: 'rent', emoji: '🏠', name: 'Sắp tới hạn tiền nhà', text: 'Chủ trọ nhắn "em ơi" lúc 6 giờ sáng. Không có dấu chấm.', drain: 1.1, mini: 0.95, nl: -5 },
  { id: 'monday', emoji: '🌧️', name: 'Mưa và kẹt xe', text: 'Bạn tới văn phòng với ống quần ướt và một tâm hồn khô héo.', drain: 1.15, mini: 1, nl: -10 },
  { id: 'coffee', emoji: '☕', name: 'Đã uống cà phê', text: 'Một ly cà phê sữa đá. Bạn yêu tất cả mọi người, trong khoảng hai tiếng.', drain: 0.85, mini: 1.1, nl: 10 },
  { id: 'anxious', emoji: '😰', name: 'Lo lắng mơ hồ', text: 'Sếp đổi ảnh đại diện Teams lúc nửa đêm. Không biết có ý gì không.', drain: 1.05, mini: 0.9, nl: 0 },
  { id: 'payday', emoji: '🤑', name: 'Vừa có tiền', text: 'Tài khoản vừa ting ting. Hôm nay bạn là đại gia trà sữa.', drain: 0.95, mini: 1.05, nl: 5, needsPaid: true },
  { id: 'homesick', emoji: '🥲', name: 'Nhớ nhà', text: 'Mẹ gửi ảnh nồi canh chua lúc 7 giờ sáng. Không kèm chữ nào.', drain: 1.05, mini: 1, nl: -5 },
];
export function pickMood(run, seed) {
  const r = rng(seed);
  const pool = MOODS.filter((m) => (!m.needsLowMoney || run.money < 300_000) && (!m.needsPaid || (run.payslips || []).length));
  return pool[Math.floor(r() * pool.length)].id;
}
export const moodInfo = (id) => MOODS.find((m) => m.id === id) || MOODS[1];

// ---------- life events after work ----------
// fx: money (VND, negative = spend), nl (energy tomorrow morning), uy/dr; mood forces tomorrow's mood.
export const LIFE_EVENTS = [
  { id: 'csgt_license', emoji: '🚔', text: 'Trên đường về, chú CSGT vẫy xe. Bạn để bằng lái ở nhà, trong cái ví "đi chơi".', choices: [
    { t: 'Xin lỗi, chấp nhận nộp phạt', fx: { money: -250_000, nl: -5 }, after: 'Không mang bằng lái: phạt 200–300 nghìn (thông tin giải trí, không phải tư vấn pháp lý). Biên bản rất đẹp. Ví của bạn thì không.' },
    { t: 'Gọi bạn cùng phòng mang bằng ra', fx: { money: -50_000, nl: -10 }, after: 'Bạn cùng phòng tới sau 40 phút, kèm một ly trà sữa và hóa đơn ship.' },
  ] },
  { id: 'csgt_lane', emoji: '🚦', text: 'Bạn đi nhầm làn ô tô vì mải đọc tin nhắn "em ơi" của sếp. Còi tuýt.', fx: { money: -700_000, dr: 2 }, after: 'Tin nhắn của sếp chỉ là "ok em". Phạt 700 nghìn. Đắt nhất năm.' },
  { id: 'csgt_alcohol', emoji: '🍺', text: 'Sau buổi "liên hoan nhẹ" của team, bạn gặp chốt kiểm tra nồng độ cồn.', when: (r) => !!r.flags.drank_today, choices: [
    { t: 'Để xe lại, đặt xe về', fx: { money: -120_000 }, after: 'Quyết định khôn ngoan nhất trong tuần.' },
  ] },
  { id: 'food_spoiled', emoji: '🤢', text: 'Hộp cơm để tủ lạnh từ thứ Hai có mùi "đang tự phát triển bản thân".', fx: { nl: -15, money: -45_000 }, after: 'Sáng mai bạn đi làm với cái bụng rỗng và một bài học.' },
  { id: 'rent_up', emoji: '🏠', text: 'Chủ trọ thông báo tăng giá 300 nghìn "vì giá điện". Phòng bạn không có điều hòa.', fx: { money: -300_000, dr: 1 }, after: 'Bạn mở Excel tính lại chi tiêu. Excel cũng thở dài.' },
  { id: 'mom_call', emoji: '📞', text: 'Mẹ gọi: "Đi làm có lương chưa con? Con nhà cô Hoa được lên trưởng phòng rồi đấy."', choices: [
    { t: 'Kể thật mức phụ cấp', fx: { nl: -5, money: 200_000 }, after: 'Mẹ im ba giây rồi chuyển khoản 200 nghìn "ăn sáng".' },
    { t: '"Dạ con sắp lên chính thức rồi ạ"', fx: { dr: 2 }, after: 'Giờ cả họ đều biết bạn sắp lên chính thức.' },
  ] },
  { id: 'grab_cancel', emoji: '🛵', text: 'Trời mưa, cuốc xe bị hủy bốn lần liên tiếp.', fx: { nl: -10, money: -70_000 }, after: 'Bạn về tới nhà lúc 20:15, ướt như một chiếc deck bị reject.' },
  { id: 'blackout', emoji: '🕯️', text: 'Khu trọ mất điện. Bạn ngồi quạt tay và đọc lại tin nhắn của sếp bằng 9% pin.', fx: { nl: -8 }, after: 'Đêm nay ngủ kém.' },
  { id: 'flood', emoji: '🌊', text: 'Đường về ngập tới yên xe. Xe bạn chết máy giữa phố.', fx: { money: -150_000, nl: -12 }, after: 'Tiệm sửa xe ven đường cười rất tươi.' },
  { id: 'friend_salary', emoji: '📱', text: 'Bạn đại học khoe offer 25 triệu trên story.', fx: { dr: 1, nl: -3 }, after: 'Bạn tắt điện thoại. Rồi mở lại xem thêm lần nữa.' },
  { id: 'street_food', emoji: '🍢', text: 'Gánh xiên bẩn đầu ngõ đang giảm giá.', choices: [
    { t: 'Ăn luôn', fx: { money: -30_000, nl: 10 }, after: 'Ngon. Hy vọng sáng mai vẫn ngon.' },
    { t: 'Về nấu mì', fx: { nl: 3 }, after: 'Gói mì thứ tư trong tuần.' },
  ] },
  { id: 'nothing', emoji: '🌙', text: 'Một buổi tối yên bình hiếm hoi. Không ai nhắn tin. Bạn hơi lo.', fx: { nl: 8 }, after: 'Bạn ngủ một mạch tới sáng.' },
  { id: 'side_gig', emoji: '🧾', text: 'Bạn bè nhờ làm một bộ slide "nhanh thôi" với giá hữu nghị.', choices: [
    { t: 'Nhận, làm tới 1 giờ sáng', fx: { money: 300_000, nl: -18 }, after: '"Nhanh thôi" mất bốn tiếng.' },
    { t: 'Từ chối, đi ngủ', fx: { nl: 5 }, after: 'Giấc ngủ là khoản đầu tư sinh lời nhất.' },
  ] },
];

/** 55% chance of an event; never the same as yesterday. Company events are mixed in. */
export function pickLifeEvent(run, seed, extra = []) {
  const r = rng(seed);
  if (r() > 0.55) return null;
  const pool = [...LIFE_EVENTS, ...extra].filter((e) => e.id !== run.flags.last_life && (!e.when || e.when(run)));
  return pool.length ? pool[Math.floor(r() * pool.length)] : null;
}

// ---------- hunger ----------
export const HUNGRY = 35;   // below: walk slower, mini-games shorter, terse dialogue
export const FAINT = 8;     // below: you must eat now
export const DRAIN_PER_MIN = 0.07;
export function hungerState(nl) { return nl < FAINT ? 'faint' : nl < HUNGRY ? 'hungry' : 'ok'; }

// ---------- money & payroll ----------
/** Rent is due when a new month of the run starts: before day 1 and before day 31. */
export function rentDue(fromDay, nextDay) { return fromDay === 0 ? nextDay >= 1 : fromDay < 31 && nextDay >= 31; }
/** Who lends you money: the friendliest colleague in the office (relationship ≥ 1), else null. */
export function lender(run, castIds) {
  const best = castIds.map((id) => [id, (run.rel || {})[id] || 0]).filter(([, v]) => v >= 1).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : null;
}
/** One workday of pay accrues salary / 22. Status decides which bucket it goes to. */
export function accrue(run) {
  const per = Math.round((run.salary || 0) / WORKDAYS_PER_MONTH);
  const acc = { ...(run.accrued || { intern: 0, official: 0 }) };
  acc[run.status === 'official' ? 'official' : 'intern'] += per;
  return acc;
}

/**
 * Build a payslip from accrued pay.
 * Intern: 10% withheld on a payment ≥ 5,000,000 without the commitment form.
 * Official: employee insurance 10.5%; personal income tax after the personal deduction (≈0 for 10–15 million).
 */
export function payslip({ accrued, tierId, commit, officialSalary = 0, penalties = 0 }) {
  const lines = [];
  const intern = Math.round(accrued.intern || 0);
  const official = Math.round(accrued.official || 0);
  const bonus = Math.round(accrued.bonus || 0); // performance bonus from desk work (game/desk.js), paid as-is
  if (intern) lines.push({ k: `Phụ cấp thực tập (${tierInfo(tierId).label}/tháng)`, v: intern });
  let deduct = 0;
  if (intern >= TAX_THRESHOLD && !commit) { const w = Math.round(intern * TAX_RATE); lines.push({ k: 'Khấu trừ thuế TNCN 10% (không có bản cam kết)', v: -w }); deduct += w; }
  if (official) {
    lines.push({ k: 'Lương chính thức', v: official });
    const ins = Math.round(official * OFFICIAL_INSURANCE);
    lines.push({ k: 'BHXH + BHYT + BHTN (10,5%)', v: -ins });
    deduct += ins;
    const monthly = officialSalary || official;
    const taxable = monthly * (1 - OFFICIAL_INSURANCE) - PERSONAL_DEDUCTION;
    if (taxable > 0) { const t = Math.round(taxable * 0.05 * (official / monthly)); lines.push({ k: 'Thuế TNCN', v: -t }); deduct += t; }
    else lines.push({ k: 'Thuế TNCN (dưới mức giảm trừ gia cảnh)', v: 0 });
  }
  if (bonus) lines.push({ k: `Thưởng năng suất (${accrued.deskOk || 0} lần làm tốt ở bàn)`, v: bonus });
  if (penalties) { lines.push({ k: 'Phạt đi muộn / quên chấm công', v: -penalties }); deduct += penalties; }
  const gross = intern + official + bonus;
  return { lines, gross, net: gross - deduct };
}

// ---------- weekly performance review ----------
export function emptyWeek(run) { return { from: run.day, uy0: run.st.uy, done: 0, late: 0, minis: 0, minisOk: 0, lateIn: 0, desk: 0, deskOk: 0 }; }

/** Score 0..100 → grade A/B/C/D. relBoss = relationship with the reviewer. */
export function gradeWeek(week, run, relBoss = 0) {
  const uyGain = run.st.uy - (week.uy0 ?? run.st.uy);
  const miniRate = week.minis ? week.minisOk / week.minis : 0.6;
  // desk work: +2 per good session, capped at +12 a week (the review notices steady work, not grinding)
  const desk = Math.min(12, (week.deskOk || 0) * 2);
  let score = 55 + uyGain * 1.5 + week.done * 5 - week.late * 8 + (miniRate - 0.5) * 30 + relBoss * 2 - run.st.dr * 0.15 - (week.lateIn || 0) * 6 + desk;
  score = Math.max(0, Math.min(100, Math.round(score)));
  const grade = score >= 78 ? 'A' : score >= 58 ? 'B' : score >= 40 ? 'C' : 'D';
  return { score, grade };
}
export const GRADE_FX = { A: { uy: 5 }, B: { uy: 2 }, C: { uy: -2, dr: 2 }, D: { uy: -5, dr: 4 } };
export const countGrades = (run, g) => (run.reviews || []).filter((x) => x.grade === g).length;
