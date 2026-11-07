// Khu phố T&M · calendar. Game day 1 = Thứ Hai 02/11/2026. Real Gregorian dates (UTC math, no time zones).
// Game time = { day, min }: min = minutes since 00:00 of that game day. After midnight the game day does not
// change until the player sleeps, so min can run past 1440 (up to 26:00 = 2h sáng, when the player dozes off).

const DAY_MS = 86_400_000;
const EPOCH = Date.UTC(2026, 10, 2); // 02/11/2026, a Monday
export const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const pad = (n) => String(n).padStart(2, '0');

/** → { y, m, d, weekday: 0..6 (0 = CN), label: 'Thứ Hai 02/11/2026', iso: '2026-11-02', md: '11-02' } */
export function dateOf(day) {
  const t = new Date(EPOCH + (Math.floor(day) - 1) * DAY_MS);
  const y = t.getUTCFullYear(), m = t.getUTCMonth() + 1, d = t.getUTCDate(), weekday = t.getUTCDay();
  return { y, m, d, weekday, label: `${WEEKDAYS[weekday]} ${pad(d)}/${pad(m)}/${y}`, short: `${pad(d)}/${pad(m)}`, iso: `${y}-${pad(m)}-${pad(d)}`, md: `${pad(m)}-${pad(d)}` };
}

/** Inverse of dateOf: the game day of a real date (may be ≤ 0 for dates before the start). */
export function dayOf(y, m, d) { return Math.round((Date.UTC(y, m - 1, d) - EPOCH) / DAY_MS) + 1; }
export const dayOfIso = (iso) => { const [y, m, d] = iso.split('-').map(Number); return dayOf(y, m, d); };

export const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const weekdayOf = (day) => dateOf(day).weekday;
export const weekdayName = (day) => WEEKDAYS[weekdayOf(day)];
export const isSunday = (day) => weekdayOf(day) === 0;
export const isWeekend = (day) => { const w = weekdayOf(day); return w === 0 || w === 6; };

/** Day-of-month 30 (or the last day of a shorter month): the 7 companies pay salaries. */
export function isPayday(day) {
  const { y, m, d } = dateOf(day);
  return d === Math.min(30, daysInMonth(y, m));
}
/** Day-of-month 5: rent, electricity, water at the dãy trọ. */
export const isRentDay = (day) => dateOf(day).d === 5;
/** Day-of-month 15: phone + internet. */
export const isPhoneBillDay = (day) => dateOf(day).d === 15;
/** Days 1-5 after payday: people spend more (design 6.3). */
export const isAfterPayday = (day) => dateOf(day).d <= 5;
/** Days 25-30: wallets thin out. */
export const isBeforePayday = (day) => { const { d } = dateOf(day); return d >= 25 && !isPayday(day); };
export const monthKey = (day) => { const { y, m } = dateOf(day); return `${y}-${pad(m)}`; };

/** "08:05" for a minute count (wraps past midnight). */
export const clockLabel = (min) => { const m = ((Math.floor(min) % 1440) + 1440) % 1440; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };
/** "8h" / "8h30" as Vietnamese signs write it. */
export const hourLabel = (min) => { const m = ((Math.floor(min) % 1440) + 1440) % 1440; const h = Math.floor(m / 60), r = m % 60; return r ? `${h}h${pad(r)}` : `${h}h`; };

/** Real (day, min) of a game time whose min may be ≥ 1440 (after midnight, before sleeping). */
export function realTime(t) {
  const extra = Math.floor(t.min / 1440);
  return { day: t.day + extra, min: t.min - extra * 1440 };
}

/** Business electricity peak hours: 17h30-22h30, Thứ Hai to Thứ Bảy (none on Sunday). Off-peak 0h-6h. */
export function powerPeriod(day, min) {
  const m = ((min % 1440) + 1440) % 1440;
  if (m < 360) return 'low';
  if (!isSunday(day) && m >= 1050 && m < 1350) return 'peak';
  return 'normal';
}

// ---------- fixed dates ----------
// Solar dates that repeat every year (research: economy.md, school.md, civic.md, design 9.3).
export const ANNUAL = [
  { md: '01-01', id: 'namluat', name: 'Năm mới: lương tối thiểu vùng mới, thuế bia tăng theo lộ trình' },
  { md: '01-31', id: 'handoanhthu', name: 'Hạn thông báo doanh thu năm trước của hộ kinh doanh' },
  { md: '03-08', id: '8-3', name: 'Ngày Quốc tế Phụ nữ' },
  { md: '04-30', id: '30-4', name: 'Lễ 30/4 (nghỉ)' },
  { md: '05-01', id: '1-5', name: 'Quốc tế Lao động (nghỉ)' },
  { md: '06-01', id: 'thieunhi', name: 'Ngày Quốc tế Thiếu nhi' },
  { md: '07-01', id: 'luongcoso', name: 'Hay có điều chỉnh lương cơ sở, mức BHYT' },
  { md: '09-02', id: 'quockhanh', name: 'Quốc khánh 2/9 (nghỉ)' },
  { md: '09-05', id: 'khaigiang', name: 'Khai giảng năm học mới' },
  { md: '10-20', id: '20-10', name: 'Ngày Phụ nữ Việt Nam' },
  { md: '11-18', id: 'daidoanket', name: 'Ngày hội Đại đoàn kết ở khu dân cư' },
  { md: '11-20', id: 'nhagiao', name: 'Ngày Nhà giáo Việt Nam' },
  { md: '12-25', id: 'giangsinh', name: 'Giáng sinh' },
];
// Lunar new year. 2027 is research-confirmed (economy.md: mùng 1 = 06/02/2027, giao thừa 05/02).
// Later years follow the published lunar calendar so the endless game still gets a Tết (verify before release).
export const TET = { 2027: '2027-02-06', 2028: '2028-01-26', 2029: '2029-02-13', 2030: '2030-02-03' };

/** Concrete dated events for the first year+ of play (research-confirmed only, as in the contract). */
export const EVENTS = (() => {
  const out = [];
  for (const y of [2026, 2027]) {
    for (const a of ANNUAL) {
      const iso = `${y}-${a.md}`;
      if (dayOfIso(iso) >= 1) out.push({ date: iso, id: a.id, name: a.name });
    }
  }
  out.push({ date: '2027-02-05', id: 'giaothua', name: 'Giao thừa Tết Đinh Mùi' });
  out.push({ date: '2027-02-06', id: 'tet', name: 'Tết Nguyên đán (mùng 1 Tết Đinh Mùi)' });
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
})();

/** Events falling on a game day (annual solar dates for any year + Tết). */
export function eventsOn(day) {
  const { y, md, iso } = dateOf(day);
  const out = ANNUAL.filter((a) => a.md === md).map((a) => ({ date: iso, id: a.id, name: a.name }));
  const tet = TET[y];
  if (tet) {
    const td = dayOfIso(tet);
    if (day === td - 1) out.push({ date: iso, id: 'giaothua', name: 'Giao thừa' });
    if (day === td) out.push({ date: iso, id: 'tet', name: 'Tết Nguyên đán (mùng 1)' });
    if (day === td + 1 || day === td + 2) out.push({ date: iso, id: 'tet', name: `Mùng ${day - td + 1} Tết` });
  }
  return out;
}

/** Days from Tết (negative before). null when that year's Tết is unknown. */
export function tetOffset(day) {
  const { y } = dateOf(day);
  for (const yy of [y, y + 1]) {
    const iso = TET[yy];
    if (!iso) continue;
    const off = day - dayOfIso(iso);
    if (off >= -30 && off <= 15) return off;
  }
  return null;
}
/** Tết holiday week (giao thừa - 1 → mùng 4): offices closed. */
export const isTetHoliday = (day) => { const o = tetOffset(day); return o !== null && o >= -2 && o <= 3; };
/** Week before Tết: markets, Ba & Má, tiện lợi boom. */
export const isPreTet = (day) => { const o = tetOffset(day); return o !== null && o >= -9 && o <= -3; };

/** School day: Mon-Fri, not in summer break (01/06 → 04/09), not during the Tết holiday. */
export function isSchoolDay(day) {
  const { m, d, weekday } = dateOf(day);
  if (weekday === 0 || weekday === 6) return false;
  if (m >= 6 && m <= 8) return false;
  if (m === 9 && d < 5) return false;
  const o = tetOffset(day);
  if (o !== null && o >= -4 && o <= 6) return false;
  return true;
}

/** Season label used by weather and demand. */
export function seasonOf(day) {
  const { m, d } = dateOf(day);
  if (m === 3 || m === 4) return 'hot';
  if ((m >= 5 && m <= 10) || (m === 11 && d <= 15)) return 'rainy';
  return 'dry';
}
