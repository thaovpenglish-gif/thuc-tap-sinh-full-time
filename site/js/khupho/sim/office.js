// Khu phố T&M · going to work at the 7 Solo companies (DESIGN.md 4.4). Pure, JSON-safe.
// The workday itself is played in Solo (same run, same office map). The neighbourhood only decides when you may go
// in, and on the way back adds the day: the clock jumps to closing time, a day's pay lands in the wallet and the
// hồ sơ cá nhân gets +1 day at that company (entry `solo-<runId>`, the same id importSolo uses when the run ends).
import { dateOf } from './calendar.js';
import { addMoney, advance } from './world.js';
import { recomputeTotals } from './profile.js';

const H = (h, m = 0) => h * 60 + m;
/** company id → where it is in the neighbourhood and its office hours (game minutes). */
export const OFFICES = {
  tm: { place: 'toanha', where: 'Cao ốc Tâm Mỹ, tầng 12', start: H(8, 30), end: H(17, 30) },
  tech: { place: 'toanha', where: 'Cao ốc Tâm Mỹ, tầng 7', start: H(9, 30), end: H(18) },
  audit: { place: 'toanha', where: 'Cao ốc Tâm Mỹ, tầng 3-5', start: H(8), end: H(17, 30) },
  bama: { place: 'bama', where: 'Nhà phố Ba & Má (cửa hàng + xưởng)', start: H(8), end: H(17) },
  agency: { place: 'agency', where: 'Loft sân thượng', start: H(10), end: H(19) },
  event: { place: 'event', where: 'Văn phòng + kho đầu đường Chợ', start: H(8, 30), end: H(18) },
  hr: { place: 'chungcu', where: 'Chung cư Lô C, tầng 4 (leo bộ)', start: H(8, 30), end: H(18) },
};
export const officesAt = (placeId) => Object.keys(OFFICES).filter((id) => OFFICES[id].place === placeId);
export const LATE_LIMIT = 150;      // up to 2 h 30 late you can still go in (and get teased)
export const EARLY_DOOR = 90;       // the building lets you in 1 h 30 before work starts
export const WORKDAYS_PER_MONTH = 22;
const hhmm = (m) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`;
export const hoursText = (id) => { const o = OFFICES[id]; return o ? `${hhmm(o.start)}-${hhmm(o.end)}` : ''; };

/** May the player go into work at company `coId` right now? → { ok, reason?, late? } */
export function canGoToWork(kp, coId) {
  const o = OFFICES[coId];
  if (!o) return { ok: false, reason: 'Công ty này chưa có ở khu phố.' };
  const wd = dateOf(kp.time.day).weekday;
  if (wd === 0 || wd === 6) return { ok: false, reason: 'Cuối tuần công ty nghỉ. Thứ Hai quay lại nhé.' };
  if (kp.flags.officeDay === kp.time.day) return { ok: false, reason: 'Hôm nay bạn đi làm rồi. Mai đi tiếp.' };
  const m = kp.time.min;
  if (m < o.start - EARLY_DOOR) return { ok: false, reason: `Còn sớm quá, bảo vệ chưa mở cửa. Giờ làm ${hoursText(coId)}.` };
  if (m > o.start + LATE_LIMIT) return { ok: false, reason: `Trễ quá rồi (giờ vào ${hhmm(o.start)}). Mai đi sớm nha.` };
  return { ok: true, late: Math.max(0, m - o.start) };
}

/** Remember that the player left for work (saved with kp so the way back knows which day it was). */
export function leaveForWork(kp, coId) {
  kp.work = { co: coId, day: kp.time.day, startMin: kp.time.min };
  return kp.work;
}

/**
 * Back from a Solo workday. info: { co, runId, worked, interview, ended, salary, status, soloDay, coName }.
 * worked = the day was played to its end in Solo. → { ok, lines, pay, events }.
 */
export function finishWorkday(kp, info = {}, { now } = {}) {
  const w = kp.work;
  kp.work = null;
  if (!w || !info || info.co !== w.co) return { ok: false, lines: [], pay: 0, events: [] };
  const o = OFFICES[w.co];
  const lines = [], events = [];
  const coName = info.coName || w.co;
  if (!info.worked) {
    // left halfway (menu, closed the tab): an hour passes, nothing is paid
    events.push(...(advance(kp, 60, 'idle') || []));
    lines.push(`Bạn rời ${coName} giữa chừng. Hôm nay chưa tính công.`);
    return { ok: true, lines, pay: 0, events };
  }
  // the clock moves to closing time (at least 4 hours after you went in)
  const end = Math.max(o.end, w.startMin + 240);
  // in chunks: the office feeds you (pantry, cơm hộp trưa, cà phê) so nobody faints at their desk
  for (let guard = 0; guard < 12 && kp.time.day === w.day && kp.time.min < end; guard++) {
    const n = kp.player.needs;
    n.food = Math.max(n.food, 45); n.energy = Math.max(n.energy, 20);
    const evs = advance(kp, Math.min(180, end - kp.time.min), 'idle') || [];
    events.push(...evs);
    if (evs.some((e) => e.type === 'must_sleep' || e.type === 'faint')) break;
  }
  kp.player.needs.food = Math.max(kp.player.needs.food, 45);
  kp.flags.officeDay = w.day;
  let pay = 0;
  if (info.interview) lines.push(`Xong buổi phỏng vấn ở ${coName}. Từ ngày mai bạn là thực tập sinh ở đây.`);
  else {
    pay = Math.round((Number(info.salary) || 0) / WORKDAYS_PER_MONTH / 1000) * 1000;
    if (pay > 0) { addMoney(kp, pay, 'pay', `Phụ cấp 1 ngày ở ${coName}`); lines.push(`+${pay.toLocaleString('vi-VN').replace(/,/g, '.')}đ phụ cấp một ngày làm (chia đều theo tháng).`); }
    else lines.push('Thực tập không lương: hôm nay bạn đổi công sức lấy kinh nghiệm và một dòng trong hồ sơ.');
    if (w.startMin > o.start + 5) lines.push(`Bạn tới trễ ${w.startMin - o.start} phút. Có người đã nhìn đồng hồ.`);
  }
  if (info.ended) lines.push(`Lượt làm ở ${coName} đã khép lại. Hồ sơ cá nhân giữ lại tất cả.`);
  logOfficeDay(kp.profile, { ...info, day: w.day, hours: Math.max(4, (end - w.startMin) / 60), pay, now });
  return { ok: true, lines, pay, events };
}

/** +1 day (once per game day) at the company entry for this Solo run. */
export function logOfficeDay(profile, { co, coName, runId, day, hours = 9, pay = 0, interview, status, now } = {}) {
  if (!profile || !Array.isArray(profile.entries) || !runId) return null;
  const entryId = `solo-${runId}`;
  const official = status === 'official';
  let e = profile.entries.find((x) => x.entryId === entryId);
  if (!e) {
    e = { entryId, placeId: co, placeName: coName || co, kind: 'company', role: 'Thực tập sinh', rank: 1, rankHighest: 1,
      status: 'intern', daysWorked: 0, soloDays: 0, shifts: 0, hours: 0, earned: 0, lastDay: 0,
      startDay: day, startDate: dateOf(day).label.split(' ').pop(), startReal: now ?? null, endDay: null, endDate: '', endReal: null,
      ratings: { A: 0, B: 0, C: 0, D: 0 }, comments: [], reasonLeft: null, contacts: [], highlights: [], reference: null,
      soloRunId: runId, rev: 0, updatedAt: now ?? 0 };
    profile.entries.push(e);
  }
  if (official) { e.role = 'Nhân viên chính thức'; e.status = 'official'; e.rank = 2; e.rankHighest = Math.max(e.rankHighest || 1, 2); }
  if (!interview && day > (e.lastDay || 0)) { e.daysWorked += 1; e.lastDay = day; }
  e.shifts += interview ? 0 : 1;
  e.hours = Math.round((e.hours + (interview ? 0 : hours)) * 100) / 100;
  e.earned += Math.round(pay);
  e.rev = (e.rev || 0) + 1; if (now != null) e.updatedAt = now;
  profile.rev = (profile.rev || 0) + 1;
  recomputeTotals(profile);
  return e;
}
