// Khu phố T&M · one shift at Trà Sữa Full Topping: a top-down 2D (DOM) counter, 4-6 real minutes = 4 game hours.
// playShift({ root, shop, kp, ctx, onEnd, realSeconds?, startMin? }) renders into `root` (a full-screen overlay) and calls
// onEnd(result) with teashop.closeShift()'s result once the player taps "Xong" on the summary.
// Stations (design 4.2.b): cốc M/L, topping jars, trà nền from the bình ủ, sữa nền, đường % pump (hold, stop at the
// line, like Solo's "scale"), đá %, lắc (hold and keep the needle in the green, like "stir"), máy dập nắp (timing),
// tem, giao. Plus the pearl pots with a re-cook action, chores, waves, app vs counter tickets.
// Debug: if window.__kpDebug === null when the shift starts, it becomes
//   { answer(order) → cup, state(), deliver(orderId, cup?), cook(kind), chore(id), open(), close(), select(id) }.
import * as T from '../sim/teashop.js';
import { MENU, MENU_ORDER, TOPPINGS, TOPPING_ORDER, TEAS, MILKS, SUGAR_STEPS, ICE_STEPS, PEARLS, INGREDIENTS, SIZES } from '../data/teamenu.js';
import { sfx } from '../../core/audio.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const play = (k, ...a) => { try { sfx[k] && sfx[k](...a); } catch { /* audio is optional */ } };
const snap = (steps, v) => steps.reduce((b, s) => (Math.abs(s - v) < Math.abs(b - v) ? s : b), steps[0]);

export const SHIFT_CSS = `
.kp-shift{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--cream,#fff8ef);color:var(--ink,#1d1d1f);font-family:'Be Vietnam Pro',system-ui,sans-serif;overflow:hidden;z-index:1;-webkit-user-select:none;user-select:none}
.kp-shift *{box-sizing:border-box}
.kp-shift button{font-family:inherit;color:var(--ink,#1d1d1f);cursor:pointer;min-height:44px;min-width:44px;border:2.5px solid var(--ink,#1d1d1f);border-radius:12px;background:#fff;box-shadow:2px 2px 0 var(--ink,#1d1d1f);font-weight:800;font-size:13px;line-height:1.1;padding:4px 6px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.kp-shift button:active{transform:translate(1px,1px);box-shadow:1px 1px 0 var(--ink,#1d1d1f)}
.kp-shift button.off{opacity:.38;filter:grayscale(.7)}
.kp-shift button.on{background:var(--mint,#b8f0d8)}
.kp-shift button.hint{animation:kpPulse .8s ease-in-out infinite alternate}
@keyframes kpPulse{from{box-shadow:2px 2px 0 var(--ink,#1d1d1f),0 0 0 0 #ffb400}to{box-shadow:2px 2px 0 var(--ink,#1d1d1f),0 0 0 5px #ffb400}}
.kp-sh-top{display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--lilac-2,#e3d9ff);border-bottom:2.5px solid var(--ink,#1d1d1f);flex:none}
.kp-sh-clock{font-weight:900;font-size:17px;background:var(--butter,#ffe9a0);border:2px solid var(--ink,#1d1d1f);border-radius:99px;padding:2px 10px;font-variant-numeric:tabular-nums}
.kp-sh-prog{flex:1;min-width:40px;height:10px;border:2px solid var(--ink,#1d1d1f);border-radius:99px;background:#fff;overflow:hidden}
.kp-sh-prog i{display:block;height:100%;background:var(--sky,#bfe3ff);width:0}
.kp-sh-stat{font-size:12px;font-weight:800;white-space:nowrap}
.kp-sh-msg{flex:none;height:24px;line-height:22px;padding:0 10px;font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-bottom:2px solid var(--ink,#1d1d1f);background:#fff}
.kp-sh-msg.good{background:var(--mint,#b8f0d8)}.kp-sh-msg.bad{background:var(--peach,#ffc2b3)}.kp-sh-msg.warn{background:var(--butter,#ffe9a0)}
.kp-sh-rail{flex:none;display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;padding:6px 10px;min-height:108px;background:#f4ecdf;border-bottom:2.5px solid var(--ink,#1d1d1f);scrollbar-width:thin}
.kp-sh-empty{align-self:center;color:var(--muted,#6a6f80);font-weight:700;font-size:13px}
.kp-shift button.kp-tk{flex:none;width:146px;height:94px;text-align:left;display:flex;flex-direction:column;gap:2px;padding:5px 7px;background:#fff;position:relative;overflow:hidden}
.kp-shift button.kp-tk.app{background:#eef6ff}
.kp-shift button.kp-tk.sel{outline:3px solid #ff8a00;outline-offset:1px;background:var(--butter,#ffe9a0)}
.kp-tk b{font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kp-tk small{font-size:11px;font-weight:700;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kp-tk .who{color:var(--muted,#6a6f80)}
.kp-tk em{font-size:10.5px;font-weight:600;color:#8a3b8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.kp-tk .pat{position:absolute;left:0;right:0;bottom:0;height:7px;background:#eee;border-top:2px solid var(--ink,#1d1d1f)}
.kp-tk .pat i{display:block;height:100%;background:var(--mint,#b8f0d8)}
.kp-tk .pat i.mid{background:var(--butter,#ffe9a0)}.kp-tk .pat i.low{background:#ff8a8a}
.kp-sh-body{flex:1;min-height:0;display:flex;flex-direction:column}
.kp-sh-cup{flex:none;display:flex;align-items:center;gap:8px;padding:5px 10px;background:#fff;border-bottom:2px solid var(--ink,#1d1d1f);min-height:58px}
.kp-cupic{flex:none;width:40px;height:48px;border:2.5px solid var(--ink,#1d1d1f);border-top:none;border-radius:0 0 10px 10px;position:relative;overflow:hidden;background:#fff}
.kp-cupic i{position:absolute;left:0;right:0;bottom:0;background:#d9a066;transition:height .2s}
.kp-cupic s{position:absolute;left:-2px;right:-2px;top:0;height:6px;background:transparent}
.kp-cupic.sealed s{background:repeating-linear-gradient(90deg,#9ad 0 4px,#cde 4px 8px)}
.kp-cupic.wrinkled s{background:repeating-linear-gradient(60deg,#c99 0 3px,#fdd 3px 6px)}
.kp-cupchips{flex:1;display:flex;flex-wrap:wrap;gap:3px;min-width:0}
.kp-chip{font-size:11px;font-weight:800;border:2px solid var(--ink,#1d1d1f);border-radius:99px;padding:1px 6px;background:#f4f4f4;white-space:nowrap}
.kp-chip.ok{background:var(--mint,#b8f0d8)}.kp-chip.bad{background:var(--peach,#ffc2b3)}
.kp-st{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:6px 10px 10px;display:flex;flex-direction:column;gap:7px;-webkit-overflow-scrolling:touch}
.kp-menu{display:flex;gap:4px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;flex:none}.kp-menu::-webkit-scrollbar{display:none}
.kp-menu span{flex:none;white-space:nowrap;font-size:10.5px;font-weight:800;border:2px solid var(--ink,#1d1d1f);border-radius:8px;padding:1px 5px;background:#fff}
.kp-menu span.out{opacity:.35;text-decoration:line-through;background:#ddd}
.kp-row{display:flex;gap:8px}
.kp-grp{display:flex;flex-direction:column;gap:3px;min-width:0}
.kp-grp>span{font-size:11px;font-weight:900;letter-spacing:.02em;color:#4a4a58;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kp-g{display:grid;gap:5px}
.kp-shift button.kp-t{height:48px;padding:2px 3px;font-size:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;overflow:hidden}
.kp-t .e{font-size:17px;line-height:1}
.kp-t small{font-size:10.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.kp-shift button.kp-t.warn{background:var(--peach,#ffc2b3)}
.kp-mech{display:flex;gap:8px;align-items:stretch;border:2.5px solid var(--ink,#1d1d1f);border-radius:14px;background:#fff;padding:6px;box-shadow:2px 2px 0 var(--ink,#1d1d1f)}
.kp-mech .lbl{font-size:11px;font-weight:900}
.kp-mech .val{font-size:12px;font-weight:800}
.kp-gauge{position:relative;height:30px;border:2px solid var(--ink,#1d1d1f);border-radius:8px;background:#fbf4e8;overflow:hidden;margin-top:3px}
.kp-gauge .fill{position:absolute;left:0;top:0;bottom:0;background:#c98a45;width:0}
.kp-gauge .mk{position:absolute;top:0;bottom:0;width:2px;background:var(--ink,#1d1d1f)}
.kp-gauge .mk.tg{width:4px;background:#ff3b6b}
.kp-gauge .mk b{position:absolute;bottom:0;left:3px;font-size:9.5px;font-weight:900}
.kp-gauge .band{position:absolute;top:0;bottom:0;background:var(--mint,#b8f0d8)}
.kp-gauge .ndl{position:absolute;top:-2px;bottom:-2px;width:5px;margin-left:-2px;background:var(--ink,#1d1d1f);border-radius:3px}
.kp-bar{height:8px;border:2px solid var(--ink,#1d1d1f);border-radius:99px;overflow:hidden;background:#eee;margin-top:3px}
.kp-bar i{display:block;height:100%;background:var(--mint,#b8f0d8);width:0}
.kp-shift button.kp-hold{flex:none;width:96px;height:auto;min-height:56px;background:var(--butter,#ffe9a0);font-size:12.5px;touch-action:none}
.kp-shift button.kp-hold.down{background:#ffcf4a;transform:translate(1px,1px)}
.kp-half{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.kp-shift .kp-half button.kp-hold{width:100%;min-height:48px}
.kp-pot{flex:1;min-width:0;display:flex;align-items:center;gap:6px;border:2.5px solid var(--ink,#1d1d1f);border-radius:12px;padding:4px 6px;background:#fff}
.kp-pot.fresh{background:#e3fbef}.kp-pot.ok{background:#fff6d6}.kp-pot.hard{background:#ffd9d0}.kp-pot.cooking{background:#e6efff}
.kp-pot div{flex:1;min-width:0;font-size:11px;font-weight:800;line-height:1.25}
.kp-pot div b{font-size:12px}
.kp-shift .kp-pot button{flex:none;font-size:11.5px;padding:2px 6px;width:70px}
.kp-chores{display:flex;gap:6px;flex-wrap:wrap;align-items:center;min-height:44px}
.kp-chores .none{font-size:12px;color:var(--muted,#6a6f80);font-weight:700}
.kp-shift .kp-chores button{background:var(--sky,#bfe3ff);font-size:12px}
.kp-foot{flex:none;display:flex;gap:8px;padding:7px 10px calc(7px + env(safe-area-inset-bottom,0px));background:var(--lilac-2,#e3d9ff);border-top:2.5px solid var(--ink,#1d1d1f)}
.kp-foot button{height:52px;flex:1;font-size:13.5px}
.kp-shift .kp-foot button.go{flex:1.6;background:var(--mint,#b8f0d8);font-size:15px}
.kp-screen{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;align-items:center}
.kp-card{width:100%;max-width:560px;background:#fff;border:2.5px solid var(--ink,#1d1d1f);border-radius:18px;box-shadow:4px 4px 0 var(--ink,#1d1d1f);padding:14px 16px;margin-bottom:12px}
.kp-card h2{margin:0 0 6px;font-size:20px}.kp-card h3{margin:10px 0 6px;font-size:15px}
.kp-card p{margin:4px 0;font-size:13.5px;line-height:1.45}
.kp-card .muted,.kp-muted{color:var(--muted,#6a6f80);font-size:12px}
.kp-list{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.kp-shift .kp-list button{text-align:left;min-height:52px;font-size:14px;padding:8px 12px}
.kp-shift .kp-list button.done{background:var(--mint,#b8f0d8)}
.kp-shift button.kp-big{width:100%;min-height:54px;font-size:16px;background:var(--butter,#ffe9a0);margin-top:10px}
.kp-shift button.kp-big[disabled]{opacity:.4}
.kp-grade{font-size:64px;font-weight:900;line-height:1;text-align:center;margin:4px 0}
.kp-kv{display:grid;grid-template-columns:1fr auto;gap:3px 10px;font-size:13.5px}
.kp-kv b{text-align:right;font-variant-numeric:tabular-nums}
.kp-checks{list-style:none;padding:0;margin:6px 0;font-size:13px}
.kp-checks li{margin:3px 0}
@media (min-width:860px){
 .kp-st{display:grid;grid-template-columns:1fr 1fr;grid-template-areas:"menu menu" "cup top" "milk top" "sugar mech" "pots chores";align-content:start;gap:8px 14px;max-width:1100px;width:100%;margin:0 auto}
 .kp-st>.kp-menu{grid-area:menu}.kp-st>.a-cup{grid-area:cup}.kp-st>.a-top{grid-area:top}.kp-st>.a-milk{grid-area:milk}.kp-st>.a-sugar{grid-area:sugar}.kp-st>.a-mech{grid-area:mech}.kp-st>.a-pots{grid-area:pots}.kp-st>.a-chores{grid-area:chores}.kp-st>.a-sugar,.kp-st>.a-mech{align-self:start}
 .kp-sh-cup,.kp-foot{justify-content:center}
 .kp-foot button{max-width:220px}
 .kp-shift button.kp-t{height:56px}
}
`;
export function injectCss(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const st = document.createElement('style'); st.id = id; st.textContent = css; document.head.appendChild(st);
}

function newCup() { return { size: null, toppings: [], tea: null, milk: null, sugar: 0, sugarLevel: 0, ice: null, shaken: false, sealed: null, labeled: false }; }

export function playShift({ root, shop, kp, ctx, onEnd, realSeconds, startMin } = {}) {
  injectCss('kp-tea-css', SHIFT_CSS);
  const c = T.resolveCtx(kp, ctx);
  let secs = Number(realSeconds) > 0 ? Number(realSeconds) : 300;
  const food = kp && kp.player && kp.player.needs ? kp.player.needs.food : 80;
  if (!(Number(realSeconds) > 0) && food < 35) secs *= 0.75; // đói: ca ngắn hơn 25% (design 3.2)
  const shift = T.openShift(shop, c, { startMin: Number.isFinite(startMin) ? startMin : c.min, rank: c.rank });
  const tired = shift.energy < 20;
  const gamePerSec = (shift.endMin - shift.startMin) / secs;
  const rank = shift.rank;
  const S = { phase: 'open', cup: null, sel: null, pump: { held: false }, shake: { v: 0, prog: 0, held: false, splashes: 0 }, seal: { t0: 0 }, msg: '', paused: false, cardEls: new Map(), hint: rank === 1, prepDone: {}, closeDone: {}, result: null, ended: false, lastUi: 0 };
  let raf = 0, last = 0;
  const debugOwned = typeof window !== 'undefined' && window.__kpDebug === null;
  root.innerHTML = '';
  const el = document.createElement('div'); el.className = 'kp-shift'; root.appendChild(el);
  const nowAbs = () => T.absMin(shift.day, shift.now);

  // ------------------------------------------------------------------------------------------- opening checklist
  function renderOpen() {
    S.phase = 'open';
    const pot = T.activeBatch(shop, 'den', T.absMin(shift.day, shift.startMin), 50);
    const potTxt = pot ? (pot.cookedMin < T.absMin(shift.day, shift.startMin) ? `Kiểm nồi trân châu (mẻ ${T.fmtTime(T.splitAbs(pot.cookedMin).min)} của Tú, cứng lúc ${T.fmtTime(T.splitAbs(pot.cookedMin + 480).min)})` : 'Nấu mẻ trân châu đầu (tươi từ 0 giờ)') : 'Nấu mẻ trân châu đầu';
    const steps = [['tc', '🍡', potTxt], ['tra', '🫖', 'Ủ trà vào bình ủ: trà đen, ô long, trà lài'], ['sua', '🥛', 'Pha sữa nền (bột béo + nước nóng)'], ['dem', '🔪', 'Cắt trái cây, kiểm topping, đếm tiền đầu ca']];
    const R = T.RANK[rank];
    const av = T.menuAvailability(shop);
    const outs = MENU_ORDER.filter((id) => !av[id].ok).map((id) => MENU[id].short);
    el.innerHTML = `<div class="kp-screen"><div class="kp-card">
      <h2>🧋 Trà Sữa Full Topping</h2>
      <p><b>${esc(T.fmtTime(shift.startMin))}-${esc(T.fmtTime(shift.endMin))}</b> · ${esc(R.name)} · ${esc(T.fmtMoney(R.wage))}/giờ</p>
      <p class="muted">Mở ca: chạm từng việc trong danh sách (khoảng 30 giây). Ca dài 4 giờ game, khoảng ${Math.round(secs / 60 * 10) / 10} phút thật.</p>
      ${outs.length ? `<p class="muted">Hết hàng, món xám trên thực đơn: ${esc(outs.join(', '))}</p>` : ''}
      <div class="kp-list">${steps.map(([k, e, t]) => `<button data-k="${k}">${e} ${esc(t)}</button>`).join('')}</div>
      <button class="kp-big" data-go disabled>Mở cửa đón khách</button>
      <p class="muted" style="margin-top:10px">Cách pha: chọn phiếu, lấy cốc, topping, trà, sữa, giữ bơm đường tới vạch rồi thả, múc đá, giữ lắc trong vùng xanh, dập nắp đúng lúc, dán tem, giao.</p>
    </div></div>`;
    const go = el.querySelector('[data-go]');
    el.querySelectorAll('[data-k]').forEach((b) => {
      b.onclick = () => { S.prepDone[b.dataset.k] = true; b.classList.add('done'); b.textContent = `✅ ${b.textContent.replace(/^\S+ /, '')}`; play('blip'); go.disabled = Object.keys(S.prepDone).length < steps.length; };
    });
    go.onclick = () => startPlay();
  }

  // ------------------------------------------------------------------------------------------- the counter
  function tile(id, emoji, label, attrs = '') { return `<button class="kp-t" data-id="${id}" ${attrs}><span class="e">${emoji}</span><small>${esc(label)}</small></button>`; }
  function renderPlay() {
    S.phase = 'play';
    const potRow = Object.keys(PEARLS).map((k) => `<div class="kp-pot" data-pot="${k}"><div></div><button data-cook="${k}">Nấu mẻ mới</button></div>`).join('');
    el.innerHTML = `
      <div class="kp-sh-top"><span class="kp-sh-clock">--:--</span><div class="kp-sh-prog"><i></i></div><span class="kp-sh-stat"></span><button data-pause aria-label="Tạm dừng">❚❚</button></div>
      <div class="kp-sh-msg">Mở cửa! Khách đầu tiên sắp tới.</div>
      <div class="kp-sh-rail"><span class="kp-sh-empty">Chưa có phiếu. Lau quầy chờ khách...</span></div>
      <div class="kp-sh-body">
        <div class="kp-sh-cup"><div class="kp-cupic"><i></i><s></s></div><div class="kp-cupchips"></div></div>
        <div class="kp-st">
          <div class="kp-menu"></div>
          <div class="kp-row a-cup">
            <div class="kp-grp" style="flex:2"><span>Kệ cốc</span><div class="kp-g" style="grid-template-columns:1fr 1fr">${tile('size:M', '🥤', 'Cốc M')}${tile('size:L', '🥤', 'Cốc L')}</div></div>
            <div class="kp-grp" style="flex:3"><span>Trà nền (bình ủ)</span><div class="kp-g" style="grid-template-columns:1fr 1fr 1fr">${Object.entries(TEAS).map(([k, t]) => tile(`tea:${k}`, '🫖', t.name)).join('')}</div></div>
          </div>
          <div class="kp-grp a-top"><span>Topping (múc vào đáy ly)</span><div class="kp-g" style="grid-template-columns:repeat(4,1fr)">${TOPPING_ORDER.map((k) => tile(`top:${k}`, TOPPINGS[k].emoji, TOPPINGS[k].short)).join('')}<button class="kp-t" data-id="undo-top"><span class="e">↩️</span><small>Bỏ muỗng</small></button></div></div>
          <div class="kp-row a-milk">
            <div class="kp-grp" style="flex:2"><span>Sữa</span><div class="kp-g" style="grid-template-columns:1fr 1fr">${Object.entries(MILKS).map(([k, m]) => tile(`milk:${k}`, '🥛', m.short)).join('')}</div></div>
            <div class="kp-grp" style="flex:3"><span>Đá %</span><div class="kp-g" style="grid-template-columns:1fr 1fr 1fr">${ICE_STEPS.map((v) => tile(`ice:${v}`, '🧊', `${v}%`)).join('')}</div></div>
          </div>
          <div class="kp-mech a-sugar" data-m="sugar"><div style="flex:1;min-width:0"><span class="lbl">Đường: giữ bơm, thả đúng vạch</span> <span class="val" data-v="sugar"></span>
            <div class="kp-gauge" data-g="sugar"><div class="fill"></div>${SUGAR_STEPS.map((v) => `<div class="mk" data-mk="${v}" style="left:${v / 110 * 100}%"><b>${v}</b></div>`).join('')}</div></div>
            <button class="kp-hold" data-hold="sugar">🍯 GIỮ<br>để bơm</button></div>
          <div class="kp-row a-mech">
            <div class="kp-mech kp-half" data-m="shake"><span class="lbl">Lắc: giữ trong vùng xanh</span>
              <div class="kp-gauge" data-g="shake"><div class="band" style="left:45%;width:33%"></div><div class="ndl"></div></div><div class="kp-bar"><i data-b="shake"></i></div>
              <button class="kp-hold" data-hold="shake">🍹 GIỮ để lắc</button></div>
            <div class="kp-mech kp-half" data-m="seal"><span class="lbl">Dập nắp: bấm khi ở giữa</span>
              <div class="kp-gauge" data-g="seal"><div class="band" style="left:${tired ? 44 : 40}%;width:${tired ? 12 : 20}%"></div><div class="ndl"></div></div><div class="kp-bar" style="visibility:hidden"><i></i></div>
              <button data-id="seal" style="background:var(--sky,#bfe3ff);min-height:48px">🔨 DẬP</button></div>
          </div>
          <div class="kp-grp a-pots"><span>Nồi trân châu (ngon nhất 4 giờ đầu, quá 8 giờ thì cứng)</span><div class="kp-row">${potRow}</div></div>
          <div class="kp-grp a-chores"><span>Việc vặt</span><div class="kp-chores"></div></div>
        </div>
      </div>
      <div class="kp-foot"><button data-id="label">🏷️ Dán tem</button><button data-id="trash">🗑️ Đổ ly</button>${rank >= 4 ? '<button data-id="bong">🙋 Nhờ Bông</button>' : ''}<button class="go" data-id="give">🛎️ GIAO</button></div>`;
    el.querySelector('[data-pause]').onclick = pause;
    el.querySelectorAll('.kp-st [data-id], .kp-foot [data-id]').forEach((b) => { b.onclick = () => act(b.dataset.id); });
    el.querySelectorAll('[data-cook]').forEach((b) => { b.onclick = () => cook(b.dataset.cook); });
    for (const h of el.querySelectorAll('[data-hold]')) bindHold(h, h.dataset.hold);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    S.cardEls.clear();
    updateAll(true);
  }
  function bindHold(btn, what) {
    const down = (e) => { e.preventDefault(); try { btn.setPointerCapture(e.pointerId); } catch { /* synthetic */ } holdStart(what); btn.classList.add('down'); };
    const up = () => { if (btn.classList.contains('down')) { btn.classList.remove('down'); holdEnd(what); } };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up); btn.addEventListener('lostpointercapture', up);
    btn.addEventListener('keydown', (e) => { if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) { e.preventDefault(); holdStart(what); btn.classList.add('down'); } });
    btn.addEventListener('keyup', (e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); up(); } });
  }

  // ------------------------------------------------------------------------------------------- actions
  function say(text, kind = '') {
    S.msg = text;
    const m = el.querySelector('.kp-sh-msg');
    if (m) { m.textContent = text; m.className = `kp-sh-msg ${kind}`; }
  }
  const selTicket = () => shift.tickets.find((t) => t.id === S.sel) || null;
  function ensureSel() { if (!selTicket()) S.sel = shift.tickets.length ? shift.tickets[0].id : null; }
  function needCup() { if (!S.cup) { say('Lấy cốc trước đã (kệ cốc M hoặc L)', 'warn'); play('bad'); return false; } if (S.cup.sealed) { say('Ly đã dập nắp: chỉ còn dán tem và giao', 'warn'); play('bad'); return false; } return true; }
  function act(id) {
    if (S.phase !== 'play' || S.paused) return;
    const [k, v] = id.split(':');
    const size = (S.cup && S.cup.size) || 'M';
    const at = nowAbs();
    if (k === 'size') {
      if (S.cup) { say('Đang có ly trên quầy: giao hoặc đổ ly trước', 'warn'); play('bad'); return; }
      if (!T.canPortion(shop, { cup: true })) { say('Hết ly nhựa!', 'bad'); play('bad'); return; }
      S.cup = newCup(); S.cup.size = v; play('blip'); say(`Lấy cốc ${v}`);
    } else if (k === 'top') {
      if (!needCup()) return;
      if (!T.canPortion(shop, { topping: v }, size, at)) { say(TOPPINGS[v].pearl ? `Hết ${TOPPINGS[v].name}: nấu mẻ mới!` : `Hết ${TOPPINGS[v].name}`, 'bad'); play('bad'); return; }
      S.cup.toppings.push(v); play('blip', 1.1);
      const b = TOPPINGS[v].pearl && T.activeBatch(shop, TOPPINGS[v].pearl, at, TOPPINGS[v].g);
      if (b && T.pearlState(b, at) === 'hard') say('Trân châu này cứng rồi: khách sẽ chê "nhai như bi"', 'bad');
    } else if (id === 'undo-top') {
      if (!needCup()) return;
      if (!S.cup.toppings.length) return;
      const top = S.cup.toppings.pop(); T.wasteTopping(shop, shift, top, shift.now); play('blip', 0.8); say('Bỏ muỗng topping vừa múc (tính hao hụt)');
    } else if (k === 'tea') {
      if (!needCup()) return;
      if (S.cup.tea) { say('Ly đã có trà rồi', 'warn'); play('bad'); return; }
      if (!T.canPortion(shop, { tea: v }, size)) { say(`Hết ${TEAS[v].name}`, 'bad'); play('bad'); return; }
      S.cup.tea = v; play('blip', 0.9);
    } else if (k === 'milk') {
      if (!needCup()) return;
      if (S.cup.milk) { say('Ly đã có sữa rồi', 'warn'); play('bad'); return; }
      if (!T.canPortion(shop, { milk: v }, size)) { say(`Hết ${MILKS[v].short}`, 'bad'); play('bad'); return; }
      S.cup.milk = v; play('blip', 0.95);
    } else if (k === 'ice') {
      if (!needCup()) return;
      if (S.cup.ice != null) { say('Ly đã có đá rồi', 'warn'); play('bad'); return; }
      if (Number(v) > 0 && !T.canPortion(shop, { ice: Number(v) }, size)) { say('Hết đá!', 'bad'); play('bad'); return; }
      S.cup.ice = Number(v); play('blip', 1.2);
    } else if (id === 'seal') {
      if (!needCup()) return;
      const p = sealPos();
      const lo = tired ? 0.44 : 0.4, hi = tired ? 0.56 : 0.6;
      S.cup.sealed = p >= lo && p <= hi ? true : 'wrinkled';
      if (S.cup.sealed === true) { play('good'); say('Nắp kín, đẹp!', 'good'); } else { play('bad'); say('Nắp nhăn rồi, dễ đổ khi giao', 'bad'); }
    } else if (id === 'label') {
      if (!S.cup) { say('Chưa có ly để dán tem', 'warn'); return; }
      if (S.cup.labeled) return;
      if (!T.canPortion(shop, { label: true })) { say('Hết tem!', 'bad'); return; }
      S.cup.labeled = true; play('blip', 1.3); ensureSel();
      const t = selTicket(); say(t ? `Dán tem: ${t.client}` : 'Dán tem');
    } else if (id === 'trash') {
      if (!S.cup) return;
      const cost = T.trashCup(shop, shift, cupForServe(), shift.now);
      S.cup = null; play('bad'); say(`Đổ ly: ${T.fmtMoney(cost)} vào hao hụt`, 'warn');
    } else if (id === 'bong') {
      ensureSel(); const t = selTicket();
      if (!t) return;
      const r = T.askBong(shift, t.id);
      if (r.ok) { say(`Bông làm ly của ${t.client}, xong lúc ${T.fmtTime(r.until)}`); S.sel = null; ensureSel(); } else say('Bông đang bận', 'warn');
    } else if (id === 'give') {
      give();
    }
    updateAll();
  }
  function cupForServe() {
    const cup = { ...S.cup, sugar: snap(SUGAR_STEPS, S.cup.sugarLevel || 0), ice: S.cup.ice == null ? 0 : S.cup.ice };
    if ((S.cup.sugarLevel || 0) < 8) cup.sugar = 0;
    return cup;
  }
  function give(cupOverride) {
    ensureSel();
    const t = selTicket();
    if (!t) { say('Chưa có phiếu nào để giao', 'warn'); return { ok: false }; }
    if (!cupOverride && !S.cup) { say('Chưa có ly', 'warn'); play('bad'); return { ok: false }; }
    const cup = cupOverride || cupForServe();
    const r = T.serveOrder(shop, shift, t.id, cup, shift.now);
    if (!r.ok) { say(r.reason, 'bad'); play('bad'); return r; }
    if (!cupOverride) S.cup = null;
    S.hint = false;
    const g = r.score.grade;
    play(g === 'A' || g === 'B' ? 'good' : 'bad');
    say(`${t.source === 'app' ? '🛵' : '🧍'} ${t.client}: ${g} · ${Math.round(r.score.points)} điểm${r.tip ? ` · tip ${T.fmtMoney(r.tip)}` : ''}${r.score.faults.length ? ` · ${r.score.faults.slice(0, 2).join(', ')}` : ''}`, g === 'A' || g === 'B' ? 'good' : 'bad');
    S.sel = null; ensureSel();
    updateAll();
    return r;
  }
  function cook(kind) {
    if (S.phase !== 'play') return { ok: false };
    const r = T.recookPearls(shop, shift, kind, shift.now);
    if (r.ok) { play('choose'); say(`Nấu ${PEARLS[kind].name}: xong lúc ${T.fmtTime(r.readyMin)}`); } else { play('bad'); say(r.reason, 'bad'); }
    updateAll();
    return r;
  }
  function chore(id) {
    const r = T.doChore(shop, shift, id);
    const ch = shift.chores.find((x) => x.id === id);
    play(r.done ? 'good' : 'blip');
    if (r.done && ch) say(`Xong: ${ch.label}`, 'good');
    updateAll();
    return r;
  }

  // ------------------------------------------------------------------------------------------- hold mechanics
  function holdStart(what) {
    if (S.phase !== 'play' || S.paused) return;
    if (what === 'sugar') {
      if (!needCup()) return;
      if (!T.canPortion(shop, { sugar: true }, S.cup.size)) { say('Hết đường!', 'bad'); return; }
      S.pump.held = true;
    } else if (what === 'shake') {
      if (!needCup()) return;
      if (S.cup.shaken) { say('Lắc rồi, đều rồi', 'good'); return; }
      S.shake.held = true;
    }
  }
  function holdEnd(what) {
    if (what === 'sugar' && S.pump.held) {
      S.pump.held = false;
      if (!S.cup) return;
      const lv = S.cup.sugarLevel, s = snap(SUGAR_STEPS, lv);
      const off = Math.abs(lv - s);
      say(off <= 5 ? `Đường ${s}%: chuẩn vạch!` : `Đường lệch vạch (${Math.round(lv)}%), tính ${s}%`, off <= 5 ? 'good' : 'warn');
      play(off <= 5 ? 'good' : 'blip');
      updateCup();
    }
    if (what === 'shake') S.shake.held = false;
  }
  const sealPos = () => { const t = (performance.now() - S.seal.t0) / 1000; return (Math.sin(t * Math.PI * 2 / 1.5 - Math.PI / 2) + 1) / 2; };
  function stepMech(dt) {
    if (S.pump.held && S.cup && !S.cup.sealed) {
      S.cup.sugarLevel = Math.min(110, (S.cup.sugarLevel || 0) + dt * (tired ? 52 : 40));
    }
    const sh = S.shake;
    if (S.cup && !S.cup.shaken && !S.cup.sealed) {
      sh.v = Math.max(0, Math.min(1, sh.v + (sh.held ? 1.25 : -1.05) * dt));
      if (sh.v >= 0.45 && sh.v <= 0.78) sh.prog = Math.min(1, sh.prog + dt / 1.3);
      if (sh.v > 0.95) { sh.v = 0.55; sh.splashes++; play('bad'); say('Lắc mạnh quá, văng ra ngoài!', 'bad'); }
      if (sh.prog >= 1) { S.cup.shaken = true; sh.held = false; play('good'); say('Lắc đều rồi!', 'good'); updateCup(); }
    } else if (!S.cup) { sh.v = 0; sh.prog = 0; sh.held = false; }
  }

  // ------------------------------------------------------------------------------------------- rendering
  function updateAll(force) { updateTickets(force); updateCup(); updateTiles(); updatePots(); updateChores(); updateHeader(); }
  function ticketHtml(t) {
    const m = MENU[t.item];
    const tops = t.toppings.map((x) => TOPPINGS[x].emoji).join('');
    return `<b>${t.source === 'app' ? '🛵' : '🧍'} ${esc(m.short)}</b><small>${t.size} · đường ${t.sugar}%</small><small>đá ${t.ice}% · ${tops}</small>${t.note ? `<em>"${esc(t.note)}"</em>` : ''}<small class="who">${esc(t.client)}</small><span class="pat"><i></i></span>`;
  }
  function updateTickets(force) {
    const rail = el.querySelector('.kp-sh-rail'); if (!rail) return;
    ensureSel();
    const ids = new Set(shift.tickets.map((t) => t.id));
    for (const [id, node] of S.cardEls) if (!ids.has(id) || force) { node.remove(); S.cardEls.delete(id); }
    for (const t of shift.tickets) {
      let node = S.cardEls.get(t.id);
      if (!node) {
        node = document.createElement('button'); node.className = `kp-tk${t.source === 'app' ? ' app' : ''}`; node.dataset.ticket = t.id;
        node.innerHTML = ticketHtml(t);
        node.onclick = () => { S.sel = t.id; play('blip'); updateTickets(); updateTiles(); updateCup(); };
        rail.appendChild(node); S.cardEls.set(t.id, node);
      }
      node.classList.toggle('sel', t.id === S.sel);
      const left = Math.max(0, 1 - (shift.now - t.at) / t.patience);
      const bar = node.querySelector('.pat i');
      bar.style.width = `${left * 100}%`; bar.className = left < 0.25 ? 'low' : left < 0.5 ? 'mid' : '';
    }
    const empty = rail.querySelector('.kp-sh-empty');
    if (empty) empty.style.display = shift.tickets.length ? 'none' : '';
  }
  function updateCup() {
    const box = el.querySelector('.kp-cupchips'); if (!box) return;
    const ic = el.querySelector('.kp-cupic');
    const cup = S.cup;
    const t = selTicket();
    if (!cup) {
      box.innerHTML = `<span class="kp-chip">${t ? `Phiếu: ${esc(t.client)} · ${esc(MENU[t.item].short)} ${t.size}` : 'Chưa có ly'}</span><span class="kp-chip">Bắt đầu: lấy cốc ở kệ</span>`;
      ic.querySelector('i').style.height = '0'; ic.className = 'kp-cupic'; return;
    }
    const sug = snap(SUGAR_STEPS, cup.sugarLevel || 0) * ((cup.sugarLevel || 0) >= 8 ? 1 : 0);
    const chip = (txt, ok) => `<span class="kp-chip${ok === true ? ' ok' : ok === false ? ' bad' : ''}">${esc(txt)}</span>`;
    const want = t ? T.answerFor(t) : null;
    const cmp = (a, b) => (want ? a === b : undefined);
    const tops = cup.toppings.map((x) => TOPPINGS[x].emoji).join('') || 'không topping';
    box.innerHTML = [
      chip(`Cốc ${cup.size}`, cmp(cup.size, want && want.size)),
      chip(tops, want ? [...cup.toppings].sort().join() === [...want.toppings].sort().join() : undefined),
      chip(cup.tea ? TEAS[cup.tea].name : 'không trà', cmp(cup.tea, want && want.tea)),
      chip(cup.milk ? MILKS[cup.milk].short : 'không sữa', cmp(cup.milk, want && want.milk)),
      chip(`đường ${sug}%`, cmp(sug, want && want.sugar)),
      chip(`đá ${cup.ice == null ? 0 : cup.ice}%`, cmp(cup.ice == null ? 0 : cup.ice, want && want.ice)),
      chip(cup.shaken ? 'đã lắc' : 'chưa lắc', cup.shaken),
      chip(cup.sealed === true ? 'nắp kín' : cup.sealed ? 'nắp nhăn' : 'chưa nắp', cup.sealed === true ? true : cup.sealed ? false : undefined),
      chip(cup.labeled ? 'có tem' : 'chưa tem', cup.labeled || undefined),
    ].join('');
    const parts = (cup.tea ? 1 : 0) + (cup.milk ? 1 : 0) + (cup.ice ? 1 : 0) + cup.toppings.length * 0.4;
    ic.querySelector('i').style.height = `${Math.min(100, parts / 3.4 * 100)}%`;
    ic.querySelector('i').style.background = cup.milk ? '#e0b98a' : cup.tea ? TEAS[cup.tea].color : '#cfe8ff';
    ic.className = `kp-cupic${cup.sealed === true ? ' sealed' : cup.sealed ? ' wrinkled' : ''}`;
  }
  function nextHint() {
    const t = selTicket(); if (!t || !S.hint) return null;
    const w = T.answerFor(t), cup = S.cup;
    if (!cup) return `size:${w.size}`;
    if (!cup.sealed) {
      const missing = [...w.toppings]; for (const x of cup.toppings) { const i = missing.indexOf(x); if (i >= 0) missing.splice(i, 1); }
      if (missing.length) return `top:${missing[0]}`;
      if (w.tea && !cup.tea) return `tea:${w.tea}`;
      if (w.milk && !cup.milk) return `milk:${w.milk}`;
      if (w.sugar && snap(SUGAR_STEPS, cup.sugarLevel || 0) !== w.sugar) return 'hold:sugar';
      if (cup.ice == null) return `ice:${w.ice}`;
      if (!cup.shaken) return 'hold:shake';
      return 'seal';
    }
    if (!cup.labeled) return 'label';
    return 'give';
  }
  function updateTiles() {
    const at = nowAbs();
    const size = (S.cup && S.cup.size) || 'M';
    const locked = !S.cup || !!S.cup.sealed;
    const hint = nextHint();
    el.querySelectorAll('.kp-st [data-id], .kp-foot [data-id], [data-hold]').forEach((b) => {
      const id = b.dataset.id || `hold:${b.dataset.hold}`;
      const [k, v] = id.split(':');
      let off = false, warn = false;
      if (k === 'size') off = !!S.cup || !T.canPortion(shop, { cup: true });
      else if (k === 'top') { off = locked || !T.canPortion(shop, { topping: v }, size, at); const P = TOPPINGS[v].pearl; if (P) { const bt = T.activeBatch(shop, P, at, 50); warn = !!bt && T.pearlState(bt, at) === 'hard'; } }
      else if (k === 'tea') off = locked || !!S.cup.tea || !T.canPortion(shop, { tea: v }, size);
      else if (k === 'milk') off = locked || !!S.cup.milk || !T.canPortion(shop, { milk: v }, size);
      else if (k === 'ice') off = locked || S.cup.ice != null || (Number(v) > 0 && !T.canPortion(shop, { ice: Number(v) }, size));
      else if (id === 'undo-top') off = locked || !S.cup.toppings.length;
      else if (id === 'hold:sugar') off = locked;
      else if (id === 'hold:shake') off = locked || S.cup.shaken;
      else if (id === 'seal') off = locked;
      else if (id === 'label') off = !S.cup || S.cup.labeled;
      else if (id === 'trash') off = !S.cup;
      else if (id === 'give') off = !S.cup || !shift.tickets.length;
      else if (id === 'bong') off = !!shift.bongBusy || !shift.tickets.length;
      b.classList.toggle('off', off);
      b.classList.toggle('warn', warn);
      b.classList.toggle('hint', id === hint);
      const done = S.cup && ((k === 'size' && S.cup.size === v) || (k === 'tea' && S.cup.tea === v) || (k === 'milk' && S.cup.milk === v) || (k === 'ice' && S.cup.ice === Number(v)));
      b.classList.toggle('on', !!done);
    });
    const t = selTicket();
    el.querySelectorAll('[data-mk]').forEach((m) => m.classList.toggle('tg', !!t && Number(m.dataset.mk) === t.sugar));
    const menu = el.querySelector('.kp-menu');
    if (menu) {
      const av = T.menuAvailability(shop);
      menu.innerHTML = MENU_ORDER.map((id) => `<span class="${av[id].ok ? '' : 'out'}" title="${esc(av[id].ok ? '' : `Hết ${av[id].missing.map((x) => INGREDIENTS[x].name).join(', ')}`)}">${MENU[id].emoji} ${esc(MENU[id].short)}</span>`).join('');
    }
  }
  function updatePots() {
    const at = nowAbs();
    el.querySelectorAll('[data-pot]').forEach((box) => {
      const kind = box.dataset.pot;
      const cooking = shop.pearls.find((b) => b.kind === kind && b.cookedMin > at);
      const b = T.activeBatch(shop, kind, at, 50);
      const st = b ? T.pearlState(b, at) : null;
      let html, cls;
      if (b) {
        const age = at - b.cookedMin, cookedAt = T.splitAbs(b.cookedMin).min;
        html = `<b>${esc(PEARLS[kind].name)}</b><br>${st === 'hard' ? 'CỨNG rồi' : st === 'fresh' ? 'Tươi' : 'Còn ngon'} · nấu ${T.fmtTime(cookedAt)} · ${Math.round(b.grams / 50)} muỗng${st !== 'hard' ? ` · cứng lúc ${T.fmtTime(cookedAt + 480)}` : ''}`;
        cls = st; if (age > 7 * 60 && st !== 'hard') cls = 'hard';
      } else { html = `<b>${esc(PEARLS[kind].name)}</b><br>Hết trân châu chín`; cls = 'hard'; }
      if (cooking) { html += `<br>Mẻ mới xong lúc ${T.fmtTime(T.splitAbs(cooking.cookedMin).min)}`; if (!b) cls = 'cooking'; }
      box.className = `kp-pot ${cls}`;
      const d = box.querySelector('div'); if (d.innerHTML !== html) d.innerHTML = html;
      const btn = box.querySelector('button');
      btn.classList.toggle('off', !!cooking);
      btn.textContent = cooking ? 'Đang nấu' : 'Nấu mẻ mới';
    });
  }
  function updateChores() {
    const box = el.querySelector('.kp-chores'); if (!box) return;
    const open = shift.chores.filter((x) => x.status === 'open');
    const key = open.map((x) => `${x.id}:${x.left}`).join('|');
    if (box.dataset.key === key) return;
    box.dataset.key = key;
    if (!open.length) { box.innerHTML = '<span class="none">Không có việc vặt</span>'; return; }
    box.innerHTML = open.map((x) => `<button data-chore="${x.id}">${x.kind === 'kynhan' ? '📦' : x.kind === 'viahe' ? '🪑' : '🧽'} ${esc(x.label)} (${x.left})</button>`).join('');
    box.querySelectorAll('[data-chore]').forEach((b) => { b.onclick = () => chore(b.dataset.chore); });
  }
  function updateHeader() {
    const ck = el.querySelector('.kp-sh-clock'); if (!ck) return;
    ck.textContent = T.fmtTime(shift.now);
    el.querySelector('.kp-sh-prog i').style.width = `${Math.min(100, (shift.now - shift.startMin) / (shift.endMin - shift.startMin) * 100)}%`;
    const tips = shift.served.reduce((a, s) => a + s.tip, 0);
    el.querySelector('.kp-sh-stat').textContent = `☕ ${shift.served.length} · ❌ ${shift.missed.length}${tips ? ` · tip ${T.fmtMoney(tips)}` : ''}`;
  }
  function updateGauges() {
    const g = el.querySelector('[data-g="sugar"] .fill');
    if (g) g.style.width = `${((S.cup && S.cup.sugarLevel) || 0) / 110 * 100}%`;
    const v = el.querySelector('[data-v="sugar"]');
    if (v) { const lv = (S.cup && S.cup.sugarLevel) || 0; v.textContent = S.cup ? `${Math.round(lv)}% → tính ${lv >= 8 ? snap(SUGAR_STEPS, lv) : 0}%` : ''; }
    const n = el.querySelector('[data-g="shake"] .ndl'); if (n) n.style.left = `${S.shake.v * 100}%`;
    const b = el.querySelector('[data-b="shake"]'); if (b) b.style.width = `${(S.cup && S.cup.shaken ? 1 : S.shake.prog) * 100}%`;
    const s = el.querySelector('[data-g="seal"] .ndl'); if (s) s.style.left = `${(S.cup && S.cup.sealed ? 0.5 : sealPos()) * 100}%`;
  }

  // ------------------------------------------------------------------------------------------- loop
  function startPlay() {
    renderPlay();
    S.seal.t0 = performance.now();
    last = performance.now();
    for (const e of shift.events) say(e.text);
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', onVis);
  }
  function onVis() { if (document.hidden && S.phase === 'play' && !S.paused) pause(); }
  function loop(now) {
    if (S.ended || S.phase !== 'play') return;
    const dt = Math.min(0.25, (now - last) / 1000); last = now;
    if (!S.paused) {
      stepMech(dt);
      const target = Math.min(shift.endMin + 20, shift.now + dt * gamePerSec);
      for (const e of T.shiftTick(shop, shift, target)) onEvent(e);
      updateGauges();
      if (now - S.lastUi > 200) { S.lastUi = now; updateAll(); }
      else updateTickets();
      if (shift.now >= shift.endMin && (!shift.tickets.length || shift.now >= shift.endMin + 20) && !S.cup) return toClose();
      if (shift.now >= shift.endMin + 20) return toClose();
    }
    raf = requestAnimationFrame(loop);
  }
  function onEvent(e) {
    if (e.type === 'arrive') { say(`${e.order.source === 'app' ? '🛵 Đơn app' : '🧍 Khách'}: ${e.order.client} gọi ${MENU[e.order.item].short} ${e.order.size}`); play('blip', 1.4); }
    else if (e.type === 'leave') { say(e.text, 'bad'); play('bad'); }
    else if (e.type === 'chore') { say(`Việc mới: ${e.text}`, 'warn'); }
    else if (e.type === 'chore_missed' || e.type === 'pearl_hard') { say(e.text, 'bad'); }
    else if (e.type === 'pearl_soon' || e.type === 'melt') { say(e.text, 'warn'); }
    else if (e.text) say(e.text);
    updateAll();
  }
  function pause() {
    if (S.phase !== 'play') return;
    S.paused = true;
    const ov = document.createElement('div');
    ov.className = 'kp-screen'; ov.style.cssText = 'position:absolute;inset:0;background:rgba(255,248,239,.97);z-index:5;justify-content:center';
    ov.innerHTML = `<div class="kp-card"><h2>⏸ Tạm dừng</h2><p>${esc(T.fmtTime(shift.now))} · đã giao ${shift.served.length} ly</p><button class="kp-big" data-r>▶ Làm tiếp</button><button class="kp-big" data-q style="background:#fff">Nghỉ ca sớm (chỉ tính giờ đã làm)</button></div>`;
    el.appendChild(ov);
    ov.querySelector('[data-r]').onclick = () => { ov.remove(); S.paused = false; last = performance.now(); };
    ov.querySelector('[data-q]').onclick = () => { ov.remove(); S.paused = false; shift.endedEarly = true; toClose(); };
  }

  // ------------------------------------------------------------------------------------------- closing + summary
  function toClose() {
    if (S.phase !== 'play') return;
    cancelAnimationFrame(raf);
    S.phase = 'close';
    if (S.cup) { T.trashCup(shop, shift, cupForServe(), shift.now); S.cup = null; }
    const steps = [['tc', '🍡', 'Đổ trân châu và trà quá giờ (tính vào hao hụt)'], ['may', '🧼', 'Vệ sinh máy dập nắp'], ['kk', '📋', 'Kiểm kê topping, ly, đá'], ['tien', '💵', 'Chốt tiền ca']];
    el.innerHTML = `<div class="kp-screen"><div class="kp-card"><h2>🔚 Đóng ca ${esc(T.fmtTime(shift.startMin))}-${esc(T.fmtTime(shift.endMin))}</h2>
      <p class="muted">Chạm từng việc để chốt ca.</p>
      <div class="kp-list">${steps.map(([k, e, t]) => `<button data-k="${k}">${e} ${esc(t)}</button>`).join('')}</div>
      <button class="kp-big" data-go disabled>Chốt ca</button></div></div>`;
    const go = el.querySelector('[data-go]');
    el.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => { S.closeDone[b.dataset.k] = true; b.classList.add('done'); play('blip'); go.disabled = Object.keys(S.closeDone).length < steps.length; }; });
    go.onclick = () => summary();
  }
  function summary() {
    S.phase = 'summary';
    const res = T.closeShift(shop, shift, kp && kp.time ? kp : c, { ...c, day: shift.day, min: shift.endMin });
    S.result = res;
    const prog = res.rankProgress;
    const tick = (ok) => (ok ? '✅' : '⬜');
    el.innerHTML = `<div class="kp-screen"><div class="kp-card">
      <h2>Tổng kết ca ${esc(T.fmtTime(res.startMin))}-${esc(T.fmtTime(res.endMin))}</h2>
      <div class="kp-grade">${esc(res.grade)}</div>
      <p style="text-align:center" class="muted">Điểm ly trung bình ${res.points} x hệ số tốc độ ${String(res.speedFactor).replace('.', ',')}${res.choresMissed ? ` − ${res.choresMissed * 3} (việc vặt bỏ sót)` : ''} = ${String(res.score).replace('.', ',')}</p>
      <div class="kp-kv">
        <span>Ly đã giao</span><b>${res.cups}${res.cupsBong ? ` (+${res.cupsBong} Bông)` : ''}</b>
        <span>Khách bỏ về / hủy đơn</span><b>${res.missed}</b>
        <span>Điểm từng ly</span><b>A ${res.grades.A} · B ${res.grades.B} · C ${res.grades.C} · D ${res.grades.D}</b>
        <span>Doanh thu ca</span><b>${esc(T.fmtMoney(res.revenue))}</b>
        <span>Tip</span><b>${esc(T.fmtMoney(res.tips))}</b>
        <span>Hao hụt</span><b>${esc(T.fmtMoney(res.waste))}</b>
        <span>Lương ca (${String(res.hours).replace('.', ',')} giờ x ${esc(T.fmtMoney(res.wage))}${res.nightHours ? ' + phụ cấp đêm' : ''})</span><b>${esc(T.fmtMoney(res.pay))}</b>
      </div>
      ${res.wasteNotes.length ? `<p class="muted">Hao hụt: ${esc([...new Set(res.wasteNotes)].join('; '))}</p>` : ''}
      ${res.events.filter((e) => e.text).map((e) => `<p><b>${esc(e.text)}</b></p>`).join('')}
      <h3>Nấc thang: ${esc(T.RANK[res.newRank].name)}${prog.next ? ` → ${esc(prog.next.name)}` : ''}</h3>
      <ul class="kp-checks">${prog.checks.map((x) => `<li>${tick(x.ok)} ${esc(x.label)} <span class="muted">(${esc(x.have)}${x.need !== 1 ? ` / ${esc(x.need)}` : ''})</span></li>`).join('')}</ul>
      <p class="kp-muted">Lương giờ không dưới mức tối thiểu vùng I 2026: 25.500đ/giờ ${esc(T.LAW_NOTE)}</p>
      <button class="kp-big" data-done>Xong</button></div></div>`;
    el.querySelector('[data-done]').onclick = finish;
  }
  function finish() {
    if (S.ended) return;
    S.ended = true;
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVis);
    if (debugOwned && typeof window !== 'undefined') window.__kpDebug = null;
    const res = S.result;
    root.innerHTML = '';
    if (onEnd) onEnd(res);
  }

  // ------------------------------------------------------------------------------------------- debug key
  if (debugOwned) {
    window.__kpDebug = {
      answer: (order) => T.answerFor(typeof order === 'string' ? shift.tickets.find((t) => t.id === order) : order),
      state: () => ({
        phase: S.phase, paused: S.paused, now: shift.now, startMin: shift.startMin, endMin: shift.endMin, rank,
        tickets: shift.tickets.map((t) => ({ ...t })), sel: S.sel, cup: S.cup ? { ...S.cup, toppings: [...S.cup.toppings] } : null,
        pump: S.cup ? S.cup.sugarLevel : 0, shake: { v: S.shake.v, prog: S.shake.prog }, seal: sealPos(), sealZone: tired ? [0.44, 0.56] : [0.4, 0.6],
        pearls: Object.keys(PEARLS).map((k) => { const at = nowAbs(); const b = T.activeBatch(shop, k, at, 50); return { kind: k, state: b ? T.pearlState(b, at) : null, age: b ? at - b.cookedMin : null, grams: b ? b.grams : 0, cooking: shop.pearls.some((x) => x.kind === k && x.cookedMin > at) }; }),
        chores: shift.chores.map((x) => ({ ...x })), served: shift.served.length, missed: shift.missed.length, last: shift.served.length ? { ...shift.served[shift.served.length - 1] } : null,
        result: S.result,
      }),
      deliver: (orderId, cup) => { if (S.phase !== 'play') return { ok: false }; S.sel = orderId; const t = shift.tickets.find((x) => x.id === orderId); if (!t) return { ok: false }; return give(cup || T.answerFor(t)); },
      select: (orderId) => { S.sel = orderId; updateAll(); },
      cook, chore: (id) => { let r; do { r = chore(id); } while (r && !r.done && shift.chores.find((x) => x.id === id && x.status === 'open')); return r; },
      open: () => { if (S.phase === 'open') startPlay(); },
      close: () => { if (S.phase === 'play') { shift.now = Math.max(shift.now, shift.endMin); toClose(); } if (S.phase === 'close') summary(); return S.result; },
      finish: () => { if (S.phase === 'summary') finish(); },
    };
  }
  renderOpen();
  return { shift, stop: () => { S.ended = true; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); } };
}
