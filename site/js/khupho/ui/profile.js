// Khu phố T&M · hồ sơ cá nhân screen (DESIGN.md 5). Reads kp.profile (+ live kp.player); renders into root.
import { ensureBase, ensureStyle, esc, money, LAW_NOTE } from './night.js';
import { averageGrade, KIND_LABEL } from '../sim/profile.js';
import { SKILL_NAMES } from '../sim/player.js';
import { PLACE } from '../data/places.js';

const CSS = `
.kp-entry { border: 2px solid var(--ink, #1d1d1f); border-radius: 16px; background: #fff; padding: 10px 12px; margin-top: 10px; }
.kp-entry.open { background: #f4fff9; }
.kp-entry h4 { margin: 0; font-size: 16px; font-weight: 900; line-height: 1.3; }
.kp-entry .kp-meta { font-size: 13px; color: var(--muted, #6a6f80); font-weight: 700; margin: 2px 0 6px; }
.kp-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
@media (min-width: 480px) { .kp-stats { grid-template-columns: repeat(4, 1fr); } }
.kp-stat { background: var(--cream, #fff8ef); border: 2px solid var(--ink, #1d1d1f); border-radius: 12px; padding: 6px 8px; text-align: center; }
.kp-stat b { display: block; font-size: 18px; font-variant-numeric: tabular-nums; }
.kp-stat span { font-size: 11.5px; font-weight: 800; color: var(--muted, #6a6f80); }
.kp-grades { font-size: 13.5px; margin-top: 6px; font-weight: 700; }
.kp-ladder { display: grid; gap: 6px; font-size: 14px; }
.kp-step { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; }
.kp-step .kp-track { grid-column: 1 / -1; }
.kp-tabs { display: flex; gap: 8px; margin-top: 12px; }
.kp-tabs .kp-btn { flex: 1 1 0; min-height: 44px; font-size: 14px; padding: 8px 10px; box-shadow: 2px 2px 0 var(--ink, #1d1d1f); }
.kp-tabs .kp-btn[aria-selected="true"] { background: var(--butter, #ffe9a0); }
`;

// Trà sữa ladder (DESIGN 4.2.k): days worked needed for each step, shown openly ("điều kiện hiện sẵn trên hồ sơ").
const TEA_LADDER = [
  { rank: 2, name: 'Nhân viên', days: 8, need: 'điểm ca trung bình từ C' },
  { rank: 3, name: 'Nhân viên chính', days: 20, need: 'trung bình từ B + giấy khám sức khỏe (160.000đ)' },
  { rank: 4, name: 'Ca trưởng', days: 40, need: '2 tuần liền từ B + xác nhận kiến thức an toàn thực phẩm' },
  { rank: 5, name: 'Quản lý cửa hàng', days: 60, need: 'nguyên liệu ≤ 35% doanh thu 2 tuần liền, từ 4,3 sao' },
];
const BADGES = [
  { id: 'nguoikhupho', name: 'Người của khu phố', test: (p) => p.totals.places >= 8, hint: 'làm ở 8 nơi khác nhau' },
  { id: 'motdoi', name: 'Một đời một nghề', test: (p) => p.entries.some((e) => e.daysWorked >= 365), hint: '365 ngày ở cùng một nơi' },
];

function entryHtml(e) {
  const open = !e.endDay && !e.endDate && !e.soloRunId;
  const where = e.soloRunId ? 'Thực tập 45 ngày (chế độ Solo)' : KIND_LABEL[e.kind] || 'Chỗ làm';
  const dates = e.soloRunId ? (e.soloDays ? `Tới ngày ${e.soloDays}/45` : '') : `${e.startDate || '?'} → ${open ? 'đang làm' : e.endDate || '?'}`;
  const r = e.ratings || {};
  const avg = averageGrade(e);
  return `<div class="kp-entry${open ? ' open' : ''}">
    <h4>${esc(e.placeName)}</h4>
    <div class="kp-meta">${esc(where)} · ${esc(e.role || '')}${e.rankHighest ? ` · bậc cao nhất ${e.rankHighest}` : ''}${dates ? ` · ${esc(dates)}` : ''}</div>
    <div class="kp-stats">
      <div class="kp-stat"><b>${e.daysWorked || 0}</b><span>ngày làm</span></div>
      <div class="kp-stat"><b>${e.shifts || 0}</b><span>ca</span></div>
      ${e.hours ? `<div class="kp-stat"><b>${Math.round(e.hours)}</b><span>giờ</span></div>` : ''}
      ${e.earned ? `<div class="kp-stat"><b>${money(e.earned)}</b><span>đã kiếm</span></div>` : ''}
    </div>
    ${avg ? `<div class="kp-grades">Đánh giá: A ${r.A || 0} · B ${r.B || 0} · C ${r.C || 0} · D ${r.D || 0} · trung bình <b>${esc(avg)}</b></div>` : ''}
    ${e.reasonLeft ? `<div class="kp-grades">Lý do nghỉ: ${esc(e.reasonLeft.text)}</div>` : ''}
    ${(e.highlights || []).length ? `<div class="kp-chips" style="margin-top:6px">${e.highlights.map((h) => `<span class="kp-chip">${esc(h)}</span>`).join('')}</div>` : ''}
    ${(e.comments || []).length ? `<p class="kp-quote" style="margin-top:6px">${e.comments.map(esc).join('<br>')}</p>` : ''}
    ${(e.contacts || []).length ? `<div class="kp-grades">Người quen: ${e.contacts.map((c) => `${esc(c.name || c.id)}${c.hearts ? ` (${'♥'.repeat(Math.min(5, c.hearts))})` : ''}`).join(', ')}</div>` : ''}
  </div>`;
}

function ladderHtml(profile) {
  const days = profile.entries.filter((e) => e.placeId === 'trasua').reduce((s, e) => s + (e.daysWorked || 0), 0);
  return `<div class="kp-ladder">${TEA_LADDER.map((s) => {
    const pct = Math.min(100, Math.round((days / s.days) * 100));
    return `<div class="kp-step"><span><b>${esc(s.name)}</b>: ${s.days} ngày, ${esc(s.need)}</span><span class="kp-v">${Math.min(days, s.days)}/${s.days}</span><span class="kp-track"><i style="width:${pct}%"></i></span></div>`;
  }).join('')}</div>`;
}

/** Render the personal profile. kp: world state (uses kp.profile, kp.player). onClose() when dismissed. */
export function showProfile({ root, kp, onClose }) {
  ensureBase(); ensureStyle('kp-ui-profile', CSS);
  const prof = kp.profile, pl = kp.player || {};
  const t = prof.totals || { days: 0, shifts: 0, hours: 0, earned: 0, places: 0 };
  const entries = [...prof.entries].sort((a, b) => {
    const ao = !a.endDay && !a.soloRunId, bo = !b.endDay && !b.soloRunId;
    if (ao !== bo) return ao ? -1 : 1;
    return (b.lastDay || b.endDay || 0) - (a.lastDay || a.endDay || 0) || (b.updatedAt || 0) - (a.updatedAt || 0);
  });
  const home = PLACE[(pl.home || prof.home || {}).place];
  const skills = Object.entries({ ...prof.skills, ...(pl.skills || {}) }).filter(([, v]) => v > 0);
  const badges = BADGES.map((b) => ({ ...b, got: b.test(prof) }));
  const tamTru = pl.tamTru ? 'Đã đăng ký tạm trú' : 'Chưa đăng ký tạm trú';
  const bhyt = pl.bhyt === 'job' ? 'BHYT qua nơi làm' : pl.bhyt === 'self' ? 'BHYT tự mua hộ gia đình' : 'Chưa có BHYT';
  const tabs = { all: 'Tất cả', street: 'Khu phố', solo: 'Solo' };
  let tab = 'all';

  const listHtml = () => {
    const list = entries.filter((e) => tab === 'all' || (tab === 'solo' ? !!e.soloRunId : !e.soloRunId));
    return list.length ? list.map(entryHtml).join('') : `<p class="kp-empty" style="margin-top:10px">${tab === 'solo' ? 'Chưa có lượt thực tập Solo nào kết thúc.' : 'Chưa làm ở đâu. Trà Sữa Full Topping đang tuyển, không cần kinh nghiệm.'}</p>`;
  };

  root.innerHTML = `<div class="kp-screen" role="dialog" aria-modal="true" aria-labelledby="kpProfTitle"><div class="kp-card">
    <div class="kp-head"><div><div class="kp-kicker">Hồ sơ cá nhân</div><h2 id="kpProfTitle">${esc(prof.name || pl.name || 'Bạn')}</h2>
      <p class="kp-sub">${esc(home ? home.short : 'Dãy trọ Bình An')}, phòng ${esc((pl.home || prof.home || {}).room ?? 5)} · ${esc(tamTru)} · ${esc(bhyt)}</p></div>
      <button class="kp-x" type="button" data-kp="close" aria-label="Đóng hồ sơ">✕</button></div>
    <div class="kp-stats" style="margin-top:6px">
      <div class="kp-stat"><b>${t.days}</b><span>ngày làm</span></div>
      <div class="kp-stat"><b>${t.shifts}</b><span>ca</span></div>
      <div class="kp-stat"><b>${t.places}</b><span>nơi đã làm</span></div>
      <div class="kp-stat"><b>${pl.reputation ?? prof.reputation ?? 50}</b><span>uy tín khu phố</span></div>
    </div>
    ${t.earned ? `<p class="kp-sub" style="margin-top:8px">Tổng đã kiếm: <b>${money(t.earned)}</b>. Số ngày làm chỉ tăng, không bao giờ giảm.</p>` : '<p class="kp-sub" style="margin-top:8px">Số ngày làm chỉ tăng, không bao giờ giảm. Nhà tuyển dụng nào cũng đọc trang này.</p>'}

    <div class="kp-sec"><h3>Kỹ năng</h3>${skills.length ? `<div class="kp-chips">${skills.map(([k, v]) => `<span class="kp-chip soft">${esc(SKILL_NAMES[k] || k)} ${Math.floor(v)}</span>`).join('')}</div>` : '<p class="kp-empty">Chưa có. Làm ca đầu tiên là có liền.</p>'}</div>
    ${(prof.certs || []).length ? `<div class="kp-sec"><h3>Giấy tờ</h3><div class="kp-chips">${prof.certs.map((c) => `<span class="kp-chip soft">${esc(typeof c === 'string' ? c : c.name || c.id)}</span>`).join('')}</div></div>` : ''}
    <div class="kp-sec"><h3>Nấc thang Trà Sữa Full Topping</h3>${ladderHtml(prof)}</div>
    <div class="kp-sec"><h3>Huy hiệu</h3><div class="kp-chips">${badges.map((b) => `<span class="kp-chip${b.got ? '' : ' soft'}">${b.got ? '★ ' : ''}${esc(b.name)}${b.got ? '' : `: ${esc(b.hint)}`}</span>`).join('')}</div></div>

    <div class="kp-tabs" role="tablist">${Object.entries(tabs).map(([k, v]) => `<button class="kp-btn" type="button" role="tab" data-tab="${k}" aria-selected="${k === tab}">${v}</button>`).join('')}</div>
    <div data-kp="list">${listHtml()}</div>

    <p class="kp-note">BHYT qua nơi làm khi có hợp đồng từ 1 tháng; tạm trú đăng ký trên VNeID, miễn phí ${LAW_NOTE}.</p>
    <div class="kp-btns"><button class="kp-btn primary" type="button" data-kp="close2">Đóng hồ sơ</button></div>
  </div></div>`;

  const close = () => { root.innerHTML = ''; if (onClose) onClose(); };
  root.querySelector('[data-kp="close"]').addEventListener('click', close, { once: true });
  root.querySelector('[data-kp="close2"]').addEventListener('click', close, { once: true });
  root.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
    tab = b.dataset.tab;
    root.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.tab === tab)));
    root.querySelector('[data-kp="list"]').innerHTML = listHtml();
  }));
  return { close };
}
