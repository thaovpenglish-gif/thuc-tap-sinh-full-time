// Khu phố T&M · manager panels of Trà Sữa Full Topping (design 4.2.f-k):
//   Kho & nhập hàng (stock, expiry, the 5 suppliers), Truyền thông (8 channels, max 3), Lời lỗ (today's P&L + 7 days),
//   Nấc thang (ranks, conditions, progress). What is clickable depends on the player's rank at the shop.
// openShopPanel({ root, shop, kp, ctx, tab: 'stock'|'channels'|'pnl'|'ranks', onClose })
import * as T from '../sim/teashop.js';
import { INGREDIENTS, MENU, MENU_ORDER, PEARLS } from '../data/teamenu.js';
import { SUPPLIERS, SUPPLIER } from '../data/suppliers.js';
import { CHANNELS, CHANNEL, MAX_CHANNELS } from '../data/channels.js';
import { injectCss } from './shift.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const WD = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
export const dayLabel = (day) => { const d = T.dateOfDay(day); return `${WD[T.weekdayOf(day)]} ${String(d.d).padStart(2, '0')}/${String(d.m).padStart(2, '0')}`; };
const amount = (id, v) => { const u = INGREDIENTS[id].unit; if (u !== 'g') return `${Math.floor(v)} ${u === 'bo' ? 'bộ' : 'cái'}`; return v >= 1000 ? `${String(Math.round(v / 100) / 10).replace('.', ',')} kg` : `${Math.round(v)} g`; };
const TABS = [['stock', '📦 Kho & nhập hàng'], ['channels', '📣 Truyền thông'], ['pnl', '📊 Lời lỗ'], ['ranks', '🪜 Nấc thang']];
const ALIAS = { kho: 'stock', nhaphang: 'stock', marketing: 'channels', truyenthong: 'channels', loilo: 'pnl', ranks: 'ranks', nacthang: 'ranks' };

export const SHOP_CSS = `
.kp-panel{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--cream,#fff8ef);color:var(--ink,#1d1d1f);font-family:'Be Vietnam Pro',system-ui,sans-serif;z-index:1}
.kp-panel *{box-sizing:border-box}
.kp-panel button{font-family:inherit;color:var(--ink,#1d1d1f);cursor:pointer;min-height:44px;min-width:44px;border:2.5px solid var(--ink,#1d1d1f);border-radius:12px;background:#fff;box-shadow:2px 2px 0 var(--ink,#1d1d1f);font-weight:800;font-size:13px;padding:4px 10px;touch-action:manipulation}
.kp-panel button:active{transform:translate(1px,1px);box-shadow:1px 1px 0 var(--ink,#1d1d1f)}
.kp-panel button[disabled]{opacity:.4;cursor:not-allowed}
.kp-panel button.pri{background:var(--butter,#ffe9a0)}
.kp-panel button.sel{background:var(--mint,#b8f0d8)}
.kp-pn-top{flex:none;display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--lilac-2,#e3d9ff);border-bottom:2.5px solid var(--ink,#1d1d1f)}
.kp-pn-top h2{flex:1;margin:0;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kp-pn-tabs{flex:none;display:flex;gap:6px;overflow-x:auto;padding:8px 10px;border-bottom:2px solid var(--ink,#1d1d1f);background:#fff}
.kp-pn-tabs button{flex:none;white-space:nowrap}
.kp-pn-body{flex:1;min-height:0;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:10px;align-items:center}
.kp-pn-body>*{width:100%;max-width:820px}
.kp-box{background:#fff;border:2.5px solid var(--ink,#1d1d1f);border-radius:16px;box-shadow:3px 3px 0 var(--ink,#1d1d1f);padding:10px 12px}
.kp-box h3{margin:0 0 6px;font-size:15px}
.kp-box p{margin:3px 0;font-size:13px;line-height:1.4}
.kp-mut{color:var(--muted,#6a6f80);font-size:12px}
.kp-msg{padding:8px 12px;border:2.5px solid var(--ink,#1d1d1f);border-radius:12px;font-weight:800;font-size:13px;background:var(--mint,#b8f0d8)}
.kp-msg.bad{background:var(--peach,#ffc2b3)}
.kp-tbl{width:100%;border-collapse:collapse;font-size:12.5px}
.kp-tbl td,.kp-tbl th{padding:5px 4px;border-bottom:1px solid #e4dccd;vertical-align:top;text-align:left}
.kp-tbl th{font-size:11.5px;color:#4a4a58}
.kp-tbl td.n{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;font-weight:800}
.kp-tbl td.neg{color:#b3261e}
.kp-tbl tr.b td{font-weight:900;background:#fff6d6}
.kp-tbl small{display:block;color:var(--muted,#6a6f80);font-weight:600;font-size:11px}
.kp-lvl{height:9px;border:2px solid var(--ink,#1d1d1f);border-radius:99px;overflow:hidden;background:#eee;min-width:60px}
.kp-lvl i{display:block;height:100%;background:var(--mint,#b8f0d8)}
.kp-lvl i.low{background:#ff8a8a}.kp-lvl i.mid{background:var(--butter,#ffe9a0)}
.kp-sups{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
.kp-sup{border:2.5px solid var(--ink,#1d1d1f);border-radius:14px;padding:8px 10px;background:#fff;display:flex;flex-direction:column;gap:3px;font-size:12.5px}
.kp-sup b{font-size:13.5px}
.kp-sup.on{background:#fff6d6}
.kp-sup button{margin-top:4px}
.kp-ord{display:grid;grid-template-columns:1fr auto auto auto;gap:6px 8px;align-items:center;font-size:12.5px}
.kp-ord .q{min-width:28px;text-align:center;font-weight:900}
.kp-chs{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}
.kp-ch{border:2.5px solid var(--ink,#1d1d1f);border-radius:14px;padding:8px 10px;background:#fff;display:flex;flex-direction:column;gap:3px;font-size:12.5px}
.kp-ch.act{background:#e3fbef}
.kp-ranks{display:flex;flex-direction:column;gap:8px}
.kp-rk{border:2.5px solid var(--ink,#1d1d1f);border-radius:14px;padding:8px 10px;background:#fff;font-size:12.5px}
.kp-rk.cur{background:var(--butter,#ffe9a0)}.kp-rk.lock{opacity:.6}
.kp-rk ul{margin:4px 0 0;padding-left:0;list-style:none}
.kp-chart{width:100%;height:120px}
.kp-menu2{display:flex;flex-wrap:wrap;gap:4px}
.kp-menu2 span{font-size:11px;font-weight:800;border:2px solid var(--ink,#1d1d1f);border-radius:8px;padding:1px 6px}
.kp-menu2 span.out{opacity:.35;text-decoration:line-through;background:#ddd}
`;

export function openShopPanel({ root, shop, kp, ctx, tab = 'stock', onClose } = {}) {
  injectCss('kp-shop-css', SHOP_CSS);
  const c = T.resolveCtx(kp, ctx);
  T.catchUp(shop, c.day, c);
  T.receiveDeliveries(shop, c.day, c.min);
  const st = { tab: ALIAS[tab] || (TABS.some(([k]) => k === tab) ? tab : 'stock'), sup: null, qty: {}, msg: null, pnlDay: null };
  root.innerHTML = '';
  const el = document.createElement('div'); el.className = 'kp-panel'; root.appendChild(el);
  el.innerHTML = `<div class="kp-pn-top"><h2>🧋 Trà Sữa Full Topping · quản lý</h2><button data-close aria-label="Đóng">✕</button></div>
    <div class="kp-pn-tabs">${TABS.map(([k, t]) => `<button data-tab="${k}">${t}</button>`).join('')}</div><div class="kp-pn-body"></div>`;
  const body = el.querySelector('.kp-pn-body');
  el.querySelector('[data-close]').onclick = () => { root.innerHTML = ''; if (onClose) onClose(); };
  el.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => { st.tab = b.dataset.tab; st.msg = null; render(); body.scrollTop = 0; }; });
  const rank = () => c.rank || shop.me.rank;
  const perm = () => T.permissions(shop, rank());
  const msgHtml = () => (st.msg ? `<div class="kp-msg${st.msg.bad ? ' bad' : ''}">${esc(st.msg.text)}</div>` : '');

  function render() {
    el.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('sel', b.dataset.tab === st.tab));
    body.innerHTML = msgHtml() + ({ stock: stockTab, channels: channelTab, pnl: pnlTab, ranks: rankTab }[st.tab])();
    wire();
  }
  const head = () => `<div class="kp-box"><p><b>${esc(dayLabel(c.day))} ${esc(T.fmtTime(c.min))}</b> · Bậc của bạn: <b>${esc(T.RANK[rank()].name)}</b> · Quỹ quán ${esc(T.fmtMoney(shop.cash))} · ⭐ ${String(shop.rating.stars.toFixed(1)).replace('.', ',')} trên Chấm Đỏ</p></div>`;

  // ---------------------------------------------------------------------------------------- Kho & nhập hàng
  function stockTab() {
    const av = T.menuAvailability(shop);
    const at = T.absMin(c.day, c.min);
    const rows = Object.entries(INGREDIENTS).map(([id, I]) => {
      const v = shop.stock[id] || 0, f = Math.min(1, v / I.par);
      const lots = shop.lots[id] || [];
      const exp = lots.length ? `hết hạn ${dayLabel(lots[0].exp)}` : I.shelfDays ? '-' : 'để lâu';
      return `<tr><td>${I.emoji} ${esc(I.name)}</td><td class="n">${esc(amount(id, v))}</td><td><div class="kp-lvl"><i class="${f < 0.25 ? 'low' : f < 0.5 ? 'mid' : ''}" style="width:${f * 100}%"></i></div></td><td>${esc(exp)}</td></tr>`;
    }).join('');
    const pots = shop.pearls.map((b) => { const s = T.pearlState(b, at); return `<li>${esc(PEARLS[b.kind].name)}: ${b.grams} g · nấu ${esc(T.fmtTime(T.splitAbs(b.cookedMin).min))} · <b>${({ cooking: 'đang nấu', fresh: 'tươi', ok: 'còn ngon', hard: 'cứng (quá 8 giờ)' })[s]}</b></li>`; }).join('') || '<li class="kp-mut">Chưa có nồi trân châu nào (nấu khi mở ca)</li>';
    const pend = shop.deliveries.filter((d) => d.status === 'pending').map((d) => `<li>${SUPPLIER[d.supplierId].icon} ${esc(SUPPLIER[d.supplierId].name)}: ${esc(Object.entries(d.items).map(([id, a]) => `${INGREDIENTS[id].name} ${amount(id, a)}`).join(', '))} · tới ${esc(T.fmtTime(d.etaMin))} ${esc(dayLabel(d.etaDay))}${d.auto ? ' (chị Nhung đặt)' : ''}</li>`).join('') || '<li class="kp-mut">Không có đơn đang chờ</li>';
    const p = perm();
    const sups = SUPPLIERS.map((s) => {
      const ok = p.suppliers[s.id];
      return `<div class="kp-sup${st.sup === s.id ? ' on' : ''}"><b>${s.icon} ${esc(s.name)}</b><span class="kp-mut">${esc(s.who)}</span>
        <span>💰 ${esc(s.priceText)}</span><span>⭐ ${esc(s.quality)}</span><span>🚚 ${esc(s.etaText)}</span><span class="kp-mut">⚠️ ${esc(s.risk)}</span>
        <button data-sup="${s.id}" ${ok ? '' : 'disabled'}>${ok ? (st.sup === s.id ? 'Đang chọn' : 'Đặt hàng ở đây') : `Từ bậc ${esc(T.RANK[s.minRank].name)}`}</button></div>`;
    }).join('');
    let form = '';
    if (st.sup && p.suppliers[st.sup]) {
      const S = SUPPLIER[st.sup];
      let total = 0;
      const lines = S.items.map((id) => {
        const price = T.packPrice(st.sup, id, c), q = st.qty[id] || 0; total += price * q;
        return `<span>${INGREDIENTS[id].emoji} ${esc(INGREDIENTS[id].name)} <span class="kp-mut">(${esc(INGREDIENTS[id].packName)}, ${esc(T.fmtMoney(price))})</span></span><button data-q="${id}" data-d="-1" aria-label="Bớt">−</button><span class="q">${q}</span><button data-q="${id}" data-d="1" aria-label="Thêm">+</button>`;
      }).join('');
      form = `<div class="kp-box"><h3>Đơn ở ${esc(S.name)}</h3><div class="kp-ord">${lines}</div>
        <p style="margin-top:8px">Tổng: <b>${esc(T.fmtMoney(total))}</b>${S.minOrder ? ` <span class="kp-mut">(tối thiểu ${esc(T.fmtMoney(S.minOrder))})</span>` : ''}</p>
        <button class="pri" data-place style="width:100%">Đặt hàng</button></div>`;
    }
    return `${head()}
      <div class="kp-box"><h3>Thực đơn hôm nay</h3><div class="kp-menu2">${MENU_ORDER.map((id) => `<span class="${av[id].ok ? '' : 'out'}">${MENU[id].emoji} ${esc(MENU[id].short)}</span>`).join('')}</div>
        <p class="kp-mut">Hết một nguyên liệu thì món dùng nó tự xám.</p></div>
      <div class="kp-box"><h3>Kho</h3><table class="kp-tbl"><tr><th>Nguyên liệu</th><th>Tồn</th><th>Mức</th><th>Hạn dùng</th></tr>${rows}</table></div>
      <div class="kp-box"><h3>Nồi trân châu</h3><ul>${pots}</ul></div>
      <div class="kp-box"><h3>Hàng đang về</h3><ul>${pend}</ul>
        ${p.autoRestockToggle ? `<button data-auto>${shop.autoRestock ? '✅ Chị Nhung tự nhập hàng mỗi tối (bấm để tự quyết)' : '⬜ Tự quyết nhập hàng (bấm để nhờ chị Nhung)'}</button>` : '<p class="kp-mut">Chị Nhung tự nhập hàng mỗi tối. Từ bậc Nhân viên chính bạn được nhờ đi chợ, từ Ca trưởng thì tự quyết.</p>'}</div>
      <div class="kp-box"><h3>Nhập hàng: 5 nhà cung cấp</h3><div class="kp-sups">${sups}</div></div>${form}`;
  }

  // ---------------------------------------------------------------------------------------- Truyền thông
  function channelTab() {
    const p = perm();
    const act = T.activeChannels(shop, c.day);
    const cards = CHANNELS.map((ch) => {
      const on = act.includes(ch.id);
      const info = shop.channels[ch.id];
      let btn;
      if (on) btn = ch.days == null ? `<button data-stop="${ch.id}" ${p.channels ? '' : 'disabled'}>Dừng kênh</button>` : `<button disabled>Đang chạy tới ${esc(dayLabel(info.until))}</button>`;
      else if (ch.needsOwnShop) btn = '<button disabled>Chỉ khi mở quán riêng (giai đoạn 2)</button>';
      else if (!p.channels) btn = '<button disabled>Từ bậc Quản lý (hoặc khi chị Nhung nhờ)</button>';
      else btn = `<button class="pri" data-run="${ch.id}" ${act.length >= MAX_CHANNELS ? 'disabled' : ''}>${act.length >= MAX_CHANNELS ? `Đã đủ ${MAX_CHANNELS} kênh` : `Chạy kênh (${esc(T.fmtMoney(ch.cost))})`}</button>`;
      return `<div class="kp-ch${on ? ' act' : ''}"><b>${ch.icon} ${esc(ch.name)}</b><span class="kp-mut">${esc(ch.how)}</span>
        <span>💰 ${esc(ch.costText)}</span><span>📈 ${esc(ch.effectText)}</span><span class="kp-mut">⚠️ ${esc(ch.risk)}</span>${info && info.note ? `<span><b>${esc(info.note)}</b></span>` : ''}${btn}</div>`;
    }).join('');
    const ex = 38_000;
    return `${head()}
      <div class="kp-box"><h3>Đang chạy: ${act.length}/${MAX_CHANNELS} kênh</h3><p>${act.map((id) => `${CHANNEL[id].icon} ${esc(CHANNEL[id].name)}`).join(' · ') || 'Chưa chạy kênh nào'}</p>
        <p class="kp-mut">Chi truyền thông gợi ý 5-10% chi phí vận hành. 48% người mua đọc đánh giá trước: sao trên Chấm Đỏ nhân thẳng vào lượng khách mới (x0,7 ở 3 sao tới x1,3 ở 4,8 sao).</p>
        <p class="kp-mut">Đơn app: thực nhận = giá app − chiết khấu − 10% x chiết khấu − voucher. Ví dụ ${esc(T.fmtMoney(ex))} → ${esc(T.fmtMoney(T.appNet(ex, 0.25, 5000)))}.</p></div>
      <div class="kp-chs">${cards}</div>`;
  }

  // ---------------------------------------------------------------------------------------- Lời lỗ
  function pnlTab() {
    if (!perm().pnl) return `${head()}<div class="kp-box"><h3>📊 Lời lỗ</h3><p>Từ bậc <b>Ca trưởng</b> mới được xem bảng lời lỗ của quán.</p><p class="kp-mut">Hiện bạn là ${esc(T.RANK[rank()].name)}. Xem điều kiện ở tab Nấc thang.</p></div>`;
    const days = Object.keys(shop.days).map(Number).filter((d) => d <= c.day).sort((a, b) => a - b);
    const day = st.pnlDay && days.includes(st.pnlDay) ? st.pnlDay : days.includes(c.day) ? c.day : days[days.length - 1];
    const p = day != null ? T.dayPnL(shop, day) : null;
    const last7 = days.slice(-7).map((d) => ({ d, p: T.dayPnL(shop, d) }));
    const tbl = p ? `<table class="kp-tbl"><tr><th>Dòng</th><th>Tiền</th></tr>${p.rows.map((r) => `<tr class="${r.bold ? 'b' : ''}"><td>${esc(r.label)}${r.calc ? `<small>${esc(r.calc)}</small>` : ''}</td><td class="n${r.v < 0 ? ' neg' : ''}">${esc(T.fmtMoney(r.v))}</td></tr>`).join('')}</table>
      <p class="kp-mut">${p.closed ? 'Đã chốt ngày.' : 'Ngày chưa chốt: số ly của các giờ còn lại sẽ cộng khi đóng cửa 22h.'} Chi phí nguyên liệu = ${Math.round(p.foodCostPct * 100)}% doanh thu.</p>
      ${p.notes.map((n) => `<p class="kp-mut">${esc(n)}</p>`).join('')}` : '<p>Chưa có sổ ngày nào.</p>';
    const y = T.yearOf(c.day), yr = shop.yearRevenue[y] || 0, tax = T.taxFor(shop, yr, y);
    return `${head()}
      <div class="kp-box"><h3>Lời lỗ ${p ? esc(dayLabel(day)) : ''}</h3>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">${days.slice(-7).map((d) => `<button data-pday="${d}" class="${d === day ? 'sel' : ''}">${esc(dayLabel(d).replace(/^Thứ /, 'T').replace('Chủ nhật', 'CN'))}</button>`).join('')}</div>${tbl}</div>
      <div class="kp-box"><h3>7 ngày gần nhất (lời trong ngày)</h3>${chart(last7)}</div>
      <div class="kp-box"><h3>Thuế hộ kinh doanh ${y}</h3><p>Doanh thu cộng dồn năm: <b>${esc(T.fmtMoney(yr))}</b> / 1 tỷ</p><div class="kp-lvl"><i class="${yr > 1e9 ? 'low' : ''}" style="width:${Math.min(100, yr / 1e7)}%"></i></div>
        <p>${esc(tax.reminder)}</p><p class="kp-mut">Thuế khoán đã bỏ từ 01/01/2026, hộ kinh doanh tự kê khai, tự nộp ${esc(T.LAW_NOTE)}</p></div>`;
  }
  function chart(list) {
    if (!list.length) return '<p class="kp-mut">Chưa có dữ liệu.</p>';
    const W = 320, H = 120, pad = 18, bw = (W - 20) / 7;
    const max = Math.max(1, ...list.map((x) => Math.abs(x.p.profit)));
    const zero = H / 2;
    const bars = list.map((x, i) => {
      const h = Math.abs(x.p.profit) / max * (H / 2 - pad);
      const y = x.p.profit >= 0 ? zero - h : zero;
      const d = T.dateOfDay(x.d);
      return `<rect x="${10 + i * bw + 4}" y="${y}" width="${bw - 8}" height="${Math.max(1, h)}" rx="4" fill="${x.p.profit >= 0 ? '#b8f0d8' : '#ffc2b3'}" stroke="#1d1d1f" stroke-width="2"/>
        <text x="${10 + i * bw + bw / 2}" y="${H - 3}" font-size="10" font-weight="800" text-anchor="middle">${d.d}/${d.m}</text>
        <text x="${10 + i * bw + bw / 2}" y="${x.p.profit >= 0 ? y - 3 : y + h + 11}" font-size="9" text-anchor="middle">${Math.round(x.p.profit / 1000)}k</text>`;
    }).join('');
    return `<svg class="kp-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ lời lỗ 7 ngày"><line x1="6" x2="${W - 6}" y1="${zero}" y2="${zero}" stroke="#1d1d1f" stroke-width="1.5"/>${bars}</svg>`;
  }

  // ---------------------------------------------------------------------------------------- Nấc thang
  function rankTab() {
    const prog = T.rankProgress(shop, c);
    const r = rank();
    const items = T.RANKS.map((R) => {
      const pay = R.monthly ? `${T.fmtMoney(R.monthly)}/tháng` : R.wage ? `${T.fmtMoney(R.wage)}/giờ${R.wageEvening ? `; ca tối, cuối tuần ${T.fmtMoney(R.wageEvening)}` : ''}${R.revenuePct ? ` + ${R.revenuePct * 100}% doanh thu ca` : ''}` : R.id === 7 ? 'Chia lời 40%' : 'Lời của quán';
      const need = Object.entries(R.need).map(([k, v]) => ({ shifts: `${v} ca`, days: `${v} ngày làm`, avg: `điểm ca TB ≥ ${T.gradeOf(v)}`, avg2w: '2 tuần liền TB ≥ B', cert: v === 'khamsuckhoe' ? 'giấy khám sức khỏe' : 'xác nhận kiến thức an toàn thực phẩm', trained: 'đào tạo Bông 1 ca', foodCost: 'chi phí nguyên liệu ≤ 35% doanh thu 2 tuần liền', stars: `${String(v).replace('.', ',')} sao`, capital: R.text, hearts: R.text }[k])).join(', ') || 'Vào làm là có';
      const isNext = prog.next && prog.next.id === R.id;
      return `<div class="kp-rk${R.id === r ? ' cur' : ''}${R.phase2 ? ' lock' : ''}"><b>${R.id}. ${esc(R.name)}</b>${R.id === r ? ' · <b>bậc hiện tại</b>' : ''}${R.phase2 ? ' · giai đoạn 2' : ''}
        <p>💵 ${esc(pay)}</p><p>📋 Điều kiện: ${esc(need)}</p><p>🔓 ${esc(R.unlock)}</p>
        ${isNext ? `<ul>${prog.checks.map((x) => `<li>${x.ok ? '✅' : '⬜'} ${esc(x.label)} <span class="kp-mut">(${esc(x.have)}${x.need !== 1 ? ` / ${esc(x.need)}` : ''})</span></li>`).join('')}</ul>${prog.canPromote ? '<button class="pri" data-promote>Xin lên bậc</button>' : ''}` : ''}</div>`;
    }).join('');
    const train = r >= 3 && !shop.me.trainedBong ? `<button data-train>${shop.me.trainNext ? '✅ Ca tới kèm Bông (đạt B trở lên là xong)' : '⬜ Ca tới kèm Bông để đào tạo'}</button>` : '';
    return `${head()}
      <div class="kp-box"><h3>Hồ sơ ở quán</h3><p>${shop.me.shifts} ca · ${shop.me.days.length} ngày làm · điểm ca gần nhất: ${esc(shop.me.scores.slice(-5).map((s) => s.pts).join(', ') || 'chưa có')}</p>${train}</div>
      <div class="kp-ranks">${items}</div>
      <div class="kp-box"><p class="kp-mut">Lương giờ không dưới lương tối thiểu vùng I 2026: 25.500đ/giờ (Nghị định 293/2025); giờ làm trong khung 22h-6h cộng 30% ${esc(T.LAW_NOTE)}</p>
        <p class="kp-mut">Người trực tiếp chế biến cần giấy khám sức khỏe còn hạn và xác nhận kiến thức an toàn thực phẩm ${esc(T.LAW_NOTE)}</p></div>`;
  }

  // ---------------------------------------------------------------------------------------- wiring
  function wire() {
    body.querySelectorAll('[data-sup]').forEach((b) => { b.onclick = () => { st.sup = b.dataset.sup; st.qty = {}; st.msg = null; render(); }; });
    body.querySelectorAll('[data-q]').forEach((b) => { b.onclick = () => { const id = b.dataset.q; st.qty[id] = Math.max(0, Math.min(99, (st.qty[id] || 0) + Number(b.dataset.d))); const top = body.scrollTop; render(); body.scrollTop = top; }; });
    const place = body.querySelector('[data-place]');
    if (place) place.onclick = () => {
      const r = T.placeOrder(shop, st.sup, st.qty, c, null);
      st.msg = r.ok ? { text: `Đã đặt ${SUPPLIER[st.sup].name}: ${T.fmtMoney(r.cost)}. ${r.travelMin ? `Đi chợ mất ${r.travelMin} phút, hàng đã vào kho.` : r.etaDay === c.day && r.etaMin === c.min ? 'Hàng đã vào kho.' : `Hàng tới ${T.fmtTime(r.etaMin)} ${dayLabel(r.etaDay)}.`}${r.missing && r.missing.length ? ' (App báo thiếu một món, đã hoàn tiền món đó.)' : ''}` } : { text: r.reason, bad: true };
      if (r.ok) st.qty = {};
      render(); body.scrollTop = 0;
    };
    const auto = body.querySelector('[data-auto]');
    if (auto) auto.onclick = () => { shop.autoRestock = !shop.autoRestock; render(); };
    body.querySelectorAll('[data-run]').forEach((b) => { b.onclick = () => { const r = T.runChannel(shop, b.dataset.run, c, null); st.msg = r.ok ? { text: `Đã chạy ${CHANNEL[b.dataset.run].name}${r.until ? ` tới ${dayLabel(r.until)}` : ''}. ${r.note || r.effectText}` } : { text: r.reason, bad: true }; render(); body.scrollTop = 0; }; });
    body.querySelectorAll('[data-stop]').forEach((b) => { b.onclick = () => { T.stopChannel(shop, b.dataset.stop, c.day); st.msg = { text: `Đã dừng ${CHANNEL[b.dataset.stop].name}` }; render(); }; });
    body.querySelectorAll('[data-pday]').forEach((b) => { b.onclick = () => { st.pnlDay = Number(b.dataset.pday); render(); }; });
    const pr = body.querySelector('[data-promote]');
    if (pr) pr.onclick = () => { const r = T.promote(shop, c); st.msg = r.ok ? { text: `Chị Nhung gật đầu: bạn lên ${T.RANK[r.rank].name}!` } : { text: 'Chưa đủ điều kiện', bad: true }; render(); };
    const tr = body.querySelector('[data-train]');
    if (tr) tr.onclick = () => { shop.me.trainNext = !shop.me.trainNext; render(); };
  }
  render();
  return { render, close: () => el.querySelector('[data-close]').click() };
}
