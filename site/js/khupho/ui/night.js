// Khu phố T&M · "Tối nay ở phòng trọ": the night report shown after world.sleep (DESIGN.md 3.7).
// Also hosts the small shared UI kit (CSS + helpers) used by ui/profile.js and ui/xomoi.js.

export const LAW_NOTE = '(thông tin giải trí, không phải tư vấn pháp lý)';
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const money = (v) => `${Math.round(v) < 0 ? '−' : ''}${Math.abs(Math.round(v)).toLocaleString('vi-VN').replace(/,/g, '.')}đ`;
export const signed = (v) => (v > 0 ? '+' : '') + money(v);

const BASE_CSS = `
.kp-screen { position: absolute; inset: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 16px 12px 28px; display: flex; justify-content: center; align-items: flex-start;
  background: rgba(29,29,31,.55); font-family: 'Be Vietnam Pro', system-ui, sans-serif; color: var(--ink, #1d1d1f); pointer-events: auto; z-index: 1; }
.kp-card { width: min(560px, 100%); margin: auto; background: var(--cream, #fff8ef); border: 3px solid var(--ink, #1d1d1f); border-radius: 24px; box-shadow: 5px 5px 0 var(--ink, #1d1d1f); padding: 18px 16px 16px; }
.kp-kicker { font-size: 11px; letter-spacing: .14em; font-weight: 900; color: var(--muted, #6a6f80); text-transform: uppercase; }
.kp-card h2 { margin: 4px 0 2px; font-size: 24px; line-height: 1.15; font-weight: 900; }
.kp-sub { color: var(--muted, #6a6f80); font-size: 14px; font-weight: 700; margin: 0 0 6px; }
.kp-sec { background: #fff; border: 2px solid var(--ink, #1d1d1f); border-radius: 16px; padding: 10px 12px; margin-top: 12px; }
.kp-sec h3 { margin: 0 0 6px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; font-weight: 900; }
.kp-rows { display: grid; gap: 4px; font-size: 15px; line-height: 1.4; }
.kp-row { display: flex; justify-content: space-between; gap: 10px; }
.kp-row span:first-child { min-width: 0; overflow-wrap: anywhere; }
.kp-row b, .kp-row .kp-v { white-space: nowrap; font-variant-numeric: tabular-nums; font-weight: 800; }
.kp-row.total { border-top: 2px dashed #d9d2c6; padding-top: 6px; margin-top: 2px; font-weight: 900; }
.kp-in { color: #157a4b; } .kp-out { color: #b3261e; }
.kp-list { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 15px; line-height: 1.45; }
.kp-quote { margin: 0; font-size: 15px; line-height: 1.5; }
.kp-quote b { display: block; font-size: 13px; color: var(--muted, #6a6f80); }
.kp-needs { display: grid; gap: 6px; }
.kp-need { display: grid; grid-template-columns: 92px 1fr 34px; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; }
.kp-track { height: 12px; background: #f2ede4; border: 2px solid var(--ink, #1d1d1f); border-radius: 99px; overflow: hidden; }
.kp-track i { display: block; height: 100%; background: var(--mint, #b8f0d8); }
.kp-track.low i { background: var(--peach, #ffc2b3); }
.kp-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.kp-chip { border: 2px solid var(--ink, #1d1d1f); border-radius: 99px; padding: 3px 10px; font-size: 13px; font-weight: 800; background: var(--butter, #ffe9a0); }
.kp-chip.soft { background: #fff; }
.kp-note { font-size: 12.5px; color: var(--muted, #6a6f80); margin: 10px 2px 0; line-height: 1.45; }
.kp-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
.kp-btn { flex: 1 1 auto; min-height: 48px; min-width: 44px; border: 2.5px solid var(--ink, #1d1d1f); background: #fff; box-shadow: 3px 3px 0 var(--ink, #1d1d1f);
  font: 900 16px 'Be Vietnam Pro', system-ui, sans-serif; color: var(--ink, #1d1d1f); padding: 10px 18px; border-radius: 14px; cursor: pointer; touch-action: manipulation; }
.kp-btn.primary { background: var(--mint, #b8f0d8); }
.kp-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink, #1d1d1f); }
.kp-btn:focus-visible { outline: 3px solid var(--lilac, #c9b6ff); outline-offset: 2px; }
.kp-x { flex: none; width: 48px; height: 48px; border-radius: 50%; border: 2.5px solid var(--ink, #1d1d1f); background: #fff; font-size: 20px; font-weight: 900; cursor: pointer; }
.kp-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.kp-empty { color: var(--muted, #6a6f80); font-size: 14px; margin: 0; }
@media (min-width: 640px) { .kp-screen { padding: 32px 20px; } .kp-card { padding: 22px 22px 18px; } }
`;

/** Inject a stylesheet once (by id). */
export function ensureStyle(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const st = document.createElement('style');
  st.id = id; st.textContent = css;
  document.head.appendChild(st);
}
export const ensureBase = () => ensureStyle('kp-ui-base', BASE_CSS);

const NEED_NAMES = { food: 'No bụng', energy: 'Năng lượng', mood: 'Tâm trạng' };
export function needsHtml(needs = {}) {
  return `<div class="kp-needs">${Object.entries(NEED_NAMES).map(([k, label]) => {
    const v = Math.round(needs[k] ?? 0);
    return `<div class="kp-need"><span>${label}</span><span class="kp-track${v < 25 ? ' low' : ''}"><i style="width:${Math.max(0, Math.min(100, v))}%"></i></span><span>${v}</span></div>`;
  }).join('')}</div>`;
}
const rows = (list, cls) => list.map((l) => `<div class="kp-row"><span>${esc(l.text)}</span><b class="${cls}">${signed(l.v)}</b></div>`).join('');

/** Render the night report into root. report: world.sleep() result. onNext() when the player starts the new day. */
export function showNight({ root, report, onNext }) {
  ensureBase();
  const r = report || {};
  const m = r.money || { start: 0, in: [], out: [], end: 0, rentDebt: 0 };
  const inSum = (m.in || []).reduce((s, l) => s + l.v, 0), outSum = (m.out || []).reduce((s, l) => s + l.v, 0);
  const bills = (r.bills || []).filter((b) => b.v || b.owed);
  const html = `<div class="kp-screen" role="dialog" aria-modal="true" aria-labelledby="kpNightTitle"><div class="kp-card">
    <div class="kp-kicker">Tối nay ở phòng trọ</div>
    <h2 id="kpNightTitle">${esc(r.date || '')}</h2>
    <p class="kp-sub">Ngủ ${esc(String(r.slept ?? '').replace('.', ','))} tiếng. Sáng mai là ${esc(r.nextDate || '')}${r.weather ? `, trời ${esc(r.weather)}` : ''}.</p>

    <div class="kp-sec"><h3>Tiền hôm nay</h3><div class="kp-rows">
      <div class="kp-row"><span>Đầu ngày</span><b>${money(m.start || 0)}</b></div>
      ${rows(m.in || [], 'kp-in')}${rows(m.out || [], 'kp-out')}
      ${!(m.in || []).length && !(m.out || []).length ? '<p class="kp-empty">Hôm nay ví đứng yên. Hiếm có.</p>' : ''}
      <div class="kp-row total"><span>Vào ${money(inSum)} · Ra ${money(-outSum)}</span><b>${signed(inSum + outSum)}</b></div>
      ${bills.length ? `<div class="kp-row"><span><b>Sáng mai tự trừ</b></span><span></span></div>${bills.map((b) => `<div class="kp-row"><span>${esc(b.text)}</span><b class="${b.v < 0 ? 'kp-out' : ''}">${b.v ? signed(b.v) : `nợ ${money(b.owed)}`}</b></div>`).join('')}` : ''}
      <div class="kp-row total"><span>Còn lại trong ví</span><b>${money(m.end ?? 0)}</b></div>
      ${m.rentDebt ? `<div class="kp-row"><span>Sổ nợ cô Ba Lành</span><b class="kp-out">${money(m.rentDebt)}</b></div>` : ''}
    </div></div>

    ${r.week ? `<div class="kp-sec"><h3>Tuần này</h3><div class="kp-rows"><div class="kp-row"><span>Kiếm được</span><b class="kp-in">${money(r.week.in)}</b></div><div class="kp-row"><span>Đã tiêu</span><b class="kp-out">${money(r.week.out)}</b></div></div></div>` : ''}

    <div class="kp-sec"><h3>Sức khỏe</h3>${needsHtml(r.needs)}</div>

    ${(r.skills || []).length ? `<div class="kp-sec"><h3>Kỹ năng tăng</h3><ul class="kp-list">${r.skills.map((s) => `<li>${esc(s.name)} ${s.from} → <b>${s.to}</b></li>`).join('')}</ul></div>` : ''}
    ${(r.profile || []).length ? `<div class="kp-sec"><h3>Hồ sơ cá nhân</h3><ul class="kp-list">${r.profile.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
    ${(r.shops || []).length ? `<div class="kp-sec"><h3>Ở quán</h3><ul class="kp-list">${r.shops.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
    ${r.story ? `<div class="kp-sec"><h3>Chuyện khu phố hôm nay</h3><p class="kp-quote"><b>${esc(r.story.from)} trong nhóm Xóm Ơi</b>${esc(r.story.text)}</p></div>` : ''}
    <div class="kp-sec"><h3>Tin cho ngày mai</h3>${(r.tomorrow || []).length ? `<ul class="kp-list">${r.tomorrow.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : '<p class="kp-empty">Mai chưa nghe tin gì đặc biệt. Khu phố đang nín thở chờ chuyện.</p>'}</div>
    ${(r.notes || []).length ? `<div class="kp-sec"><h3>Ghi chú</h3><ul class="kp-list">${r.notes.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}

    <p class="kp-note">Game tự lưu khi bạn sang ngày mới${r.law ? `. Các dòng về luật, giá điện, BHYT ở trên là tóm tắt cho vui ${LAW_NOTE}` : ''}.</p>
    <div class="kp-btns"><button class="kp-btn primary" type="button" data-kp="next">Ngủ ngon, sang ngày mới</button></div>
  </div></div>`;
  root.innerHTML = html;
  const btn = root.querySelector('[data-kp="next"]');
  btn.addEventListener('click', () => { root.innerHTML = ''; if (onNext) onNext(); }, { once: true });
  try { btn.focus({ preventScroll: true }); } catch { /* old browsers */ }
  return { close() { root.innerHTML = ''; } };
}
