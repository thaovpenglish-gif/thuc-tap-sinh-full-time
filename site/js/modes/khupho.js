// Khu phố T&M (beta): the endless neighbourhood mode. First-person street + interiors (3D), DOM overlays for
// shifts, shop management, the night report, the personal profile and the Xóm Ơi resident group.
// Pure rules live in site/js/khupho/sim/*; this file only wires them to the screen. Docs: docs/khupho/*.
import * as THREE from 'three';
import { $, esc, store } from '../core/util.js';
import { createFPControls } from '../core/fpcontrols.js';
import { makePerson, nameTag } from '../art/people.js';
import { validateProfile, emptyProfile } from '../game/save.js';
import { buildStreet } from '../khupho/map/street.js';
import { buildRoom, buildTeaShop } from '../khupho/map/interiors.js';
import * as world from '../khupho/sim/world.js';
import * as econ from '../khupho/sim/economy.js';
import * as player from '../khupho/sim/player.js';
import { dateOf } from '../khupho/sim/calendar.js';
import { PLACE } from '../khupho/data/places.js';
import * as teashop from '../khupho/sim/teashop.js';
import { hashSeed } from '../khupho/sim/rng.js';
import { companyName } from '../companies/index.js';
import { FOOD } from '../khupho/data/food.js';
import { PEOPLE } from '../khupho/data/people.js';
import { playShift } from '../khupho/ui/shift.js';
import { openShopPanel } from '../khupho/ui/shop.js';
import { showNight } from '../khupho/ui/night.js';
import { showProfile } from '../khupho/ui/profile.js';
import { showXomoi } from '../khupho/ui/xomoi.js';
import { showFurnitureShop, showDecor } from '../khupho/ui/furniture.js';
import { ensureHome, morningMood, cozyScore, cozyLabel } from '../khupho/sim/home.js';

const PROFILE_KEY = 'tm_profile_v1';
const GAME_MIN_PER_SEC = 1; // 1 real second = 1 game minute while walking around (shifts run on their own clock)
const fmtVND = (n) => (n < 0 ? '−' : '') + Math.abs(Math.round(n)).toLocaleString('vi-VN') + 'đ';
const hhmm = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(Math.floor(min % 60)).padStart(2, '0')}`;
const placeOf = (id) => PLACE[id] || { id, name: id, short: id };

// The milk-tea shop plugs into the world clock: deliveries arrive while time passes, the day closes when you sleep.
let shopRegistered = false;
function registerTeaShop() {
  if (shopRegistered) return; shopRegistered = true;
  teashop.useEconomy(econ);
  world.registerShop('trasua', {
    create: (seed, kp) => teashop.createTeaShop(hashSeed(String(seed)), { day: kp && kp.time ? kp.time.day : 1 }),
    onAdvance: (shop, kp, from, to) => teashop.receiveDeliveries(shop, to.day, to.min).map((d) => ({ type: 'delivery', placeId: 'trasua', text: `Hàng đã giao tới Trà Sữa Full Topping${d.supplierName ? ' (' + d.supplierName + ')' : ''}.` })),
    onSleep: (shop, kp, day) => { const r = teashop.closeDay(shop, day, teashop.ctxFromKp(kp)); return { events: r.events || [] }; },
  });
}

export function startKhupho({ scene, camera, input, onExit }) {
  // ---------- save ----------
  registerTeaShop();
  let profile = validateProfile(store.json(PROFILE_KEY)) || emptyProfile();
  let kp = profile.kp ? world.loadGame(profile.kp, { now: Date.now() }) : null;
  if (kp) world.importSoloRuns(kp, profile.runs, companyName);
  const save = () => {
    if (!kp) return;
    world.stamp(kp);
    profile = validateProfile(store.json(PROFILE_KEY)) || profile; // Solo may have written meanwhile: keep its runs
    profile.kp = kp;
    try { store.set(PROFILE_KEY, JSON.stringify(profile)); } catch { /* storage full */ }
  };

  // ---------- 3D places ----------
  scene.fog = new THREE.Fog('#bfe3ff', 40, 115);
  const street = buildStreet(scene);
  const room = buildRoom(scene, [200, 0]);
  const shop = buildTeaShop(scene, [300, 0]);
  const PLACES3D = { street, room, trasua: shop };
  let where = 'street';
  const show = (k) => { for (const [name, w] of Object.entries(PLACES3D)) w.root.visible = name === k; where = k; };

  // people standing at their doors (owners), from the people data
  const npcs = [];
  const looks = ['#c9b6ff', '#b8f0d8', '#ffc2b3', '#bfe3ff', '#ffe08a', '#ff9fb2', '#9ee8c8'];
  Object.entries(street.doors).forEach(([placeId, d], i) => {
    const pid = (PLACE[placeId] && PLACE[placeId].people || [])[0]; const p = (PEOPLE || []).find((x) => x.id === pid);
    if (!p || placeId === 'phongtro' || placeId.startsWith('house')) return;
    const mesh = makePerson({ shirt: looks[i % looks.length], hair: i % 3 ? '#2b1d14' : '#5a3a26', pants: '#4a5568' });
    const out = d.ry === Math.PI ? 1 : -1; // door faces +z when ry = PI
    mesh.position.set(d.x + 1.8, 0, d.z + out * 0.2);
    mesh.rotation.y = out > 0 ? 0 : Math.PI;
    mesh.add(nameTag(p.name, String(p.role || '').split('·')[0].trim(), { color: '#ffe9a0' }));
    street.root.add(mesh);
    npcs.push({ id: pid, placeId, mesh, person: p });
  });

  // ---------- controls + overlay ----------
  let mode = 'menu'; // menu | play | overlay | pause
  // Esc only frees the mouse (the click hint shows); the pause card opens from the ⏸ button.
  const fp = createFPControls({ camera, input, getMode: () => mode, onPause: () => {}, start: street.spawn });
  const ov = document.createElement('div'); ov.id = 'kpOverlay'; ov.hidden = true; document.body.appendChild(ov);
  const hud = document.createElement('div'); hud.id = 'kpHud'; hud.hidden = true; document.body.appendChild(hud);
  const prompt = document.createElement('div'); prompt.id = 'kpPrompt'; prompt.hidden = true; document.body.appendChild(prompt);
  injectCSS();
  const isTouch = matchMedia('(pointer: coarse)').matches;

  const touchUI = (on) => { const m = $('#mobile'); if (m) m.hidden = !(on && isTouch); const ch = $('#crosshair'); if (ch) ch.hidden = !(on && !isTouch); };
  function openOverlay() { mode = 'overlay'; fp.unlock(); ov.hidden = false; ov.innerHTML = ''; prompt.hidden = true; touchUI(false); const t = $('#kpToast'); if (t) t.hidden = true; return ov; }
  function closeOverlay() { ov.hidden = true; ov.innerHTML = ''; mode = 'play'; renderHud(); touchUI(true); if (!isTouch) fp.lock(); }
  function card(html) { const r = openOverlay(); r.innerHTML = `<div class="kp-card">${html}</div>`; return r.firstChild; }

  // ---------- HUD ----------
  // HUD is built once; every tick only its text and bar widths change (rebuilding it would eat clicks).
  let hudBuilt = false;
  function buildHud() {
    hud.innerHTML = `<div class="kp-hud-l"><b id="kpClock"></b><span id="kpMoney"></span>
      <div class="kp-needs"><label>🍚<span class="kp-bar"><i id="kpNeedFood" style="background:#f2a65a"></i></span></label><label>⚡<span class="kp-bar"><i id="kpNeedEnergy" style="background:#3fa37a"></i></span></label><label>🙂<span class="kp-bar"><i id="kpNeedMood" style="background:#c77dff"></i></span></label></div></div>
      <div class="kp-hud-r"><button id="kpXomoi" aria-label="Nhóm Xóm Ơi (phím P)" title="Nhóm Xóm Ơi (P)">📱<em id="kpUnread" hidden></em></button><button id="kpProf" aria-label="Hồ sơ cá nhân (phím H)" title="Hồ sơ cá nhân (H)">📇</button><button id="kpPause" aria-label="Tạm dừng" title="Tạm dừng">⏸</button></div>`;
    $('#kpXomoi').onclick = () => openXomoi();
    $('#kpProf').onclick = () => openProfile();
    $('#kpPause').onclick = () => pause();
    hudBuilt = true;
  }
  function openXomoi() { if (!kp) return; const r = openOverlay(); showXomoi({ root: r, kp, onClose: () => { save(); closeOverlay(); } }); }
  function openProfile() { if (!kp) return; const r = openOverlay(); showProfile({ root: r, kp, onClose: closeOverlay }); }
  function renderHud() {
    if (!kp) return;
    if (!hudBuilt) buildHud();
    const t = kp.time, dt = dateOf(t.day), p = kp.player;
    $('#kpClock').textContent = `${dt.label.split(' ').slice(0, 2).join(' ')} · ${hhmm(t.min)}`;
    $('#kpMoney').textContent = fmtVND(p.money);
    const w = (v) => `${Math.max(0, Math.min(100, v))}%`;
    $('#kpNeedFood').style.width = w(p.needs.food); $('#kpNeedEnergy').style.width = w(p.needs.energy); $('#kpNeedMood').style.width = w(p.needs.mood);
    const unread = (kp.xomoi && kp.xomoi.unread) || 0, u = $('#kpUnread');
    u.hidden = !unread; u.textContent = unread;
  }

  // ---------- start screen ----------
  let oldProfile = null;
  function showStart() {
    mode = 'menu'; hud.hidden = true; prompt.hidden = true; show('street');
    const lastName = Object.values(profile.runs || {}).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).map((r) => r.name).find(Boolean) || '';
    const c = card(`<div class="kp-kicker">BẢN THỬ · GIAI ĐOẠN 1</div><h2>Khu phố T&amp;M</h2>
      <p>Khu phố 7, phường Tâm Mỹ. Bạn thuê một phòng ở Dãy trọ Bình An, đi làm ở Trà Sữa Full Topping, ăn bánh mì đầu hẻm, đọc nhóm Xóm Ơi, và sống tiếp, mãi mãi.</p>
      ${kp ? `<p class="kp-muted">Đang ở: ${esc(dateOf(kp.time.day).label)} · ${fmtVND(kp.player.money)}</p>` : `<label class="kp-field">Tên của bạn<input id="kpName" maxlength="16" value="${esc(lastName)}" placeholder="VD: Linh" autocomplete="off"></label>`}
      <div class="kp-btns">${kp ? '<button class="btn primary" id="kpGo">Về khu phố →</button><button class="btn ghost" id="kpNew">Bắt đầu lại</button>' : '<button class="btn primary" id="kpGo">Dọn vào ở →</button>'}<button class="btn ghost" id="kpBack">← Menu chính</button></div>
      <p class="kp-note">Một số luật, giá cả được dùng làm chất liệu chơi (thông tin giải trí, không phải tư vấn pháp lý).</p>`);
    c.querySelector('#kpGo').onclick = () => {
      if (!kp) { const name = (c.querySelector('#kpName').value || '').trim() || 'Bạn'; kp = world.newGame({ name, seed: (Date.now() % 2147483646) + 1, now: Date.now(), profile: oldProfile || undefined, soloRuns: profile.runs, companyName }); save(); }
      enterPlace('room', true);
    };
    const nb = c.querySelector('#kpNew'); if (nb) nb.onclick = () => { oldProfile = kp.profile; kp = null; showStart(); }; // the hồ sơ cá nhân is kept
    c.querySelector('#kpBack').onclick = () => { onExit && onExit(); };
  }

  // ---------- moving between places ----------
  function enterPlace(k, morning = false) {
    ov.hidden = true; ov.innerHTML = '';
    show(k);
    const w = PLACES3D[k];
    if (k === 'room' && room.applyDecor) room.applyDecor(ensureHome(kp).placed);
    const sp = w.spawn;
    fp.teleport(sp[0], sp[1], sp[2] ?? 0);
    hud.hidden = false; mode = 'play'; renderHud(); touchUI(true); save();
    if (!isTouch) fp.lock();
    if (morning) toast(`Chào buổi sáng. ${dateOf(kp.time.day).label}.`);
  }
  function exitToStreet(fromPlaceId) {
    const d = street.doors[fromPlaceId];
    show('street');
    if (d) fp.teleport(d.x, d.z + (d.ry === PI ? 0.9 : -0.9), d.ry);
    mode = 'play'; renderHud(); if (!isTouch) fp.lock();
  }
  const PI = Math.PI;

  // ---------- interactions ----------
  const candidates = () => {
    const w = PLACES3D[where];
    const objs = w.interactables.map((it) => ({ kind: 'obj', id: it.id, pos: it.pos, label: it.label }));
    if (where === 'street') npcs.forEach((n) => objs.push({ kind: 'npc', id: n.id, pos: n.mesh.position, label: `Nói chuyện với ${n.person.name}` }));
    return objs;
  };
  let target = null;
  function interact() {
    if (mode !== 'play' || !target) return;
    const t = target;
    if (where === 'room') {
      if (t.id === 'door') return exitToStreet('phongtro');
      if (t.id === 'bed') return goSleep();
      if (t.id === 'profile') { const r = openOverlay(); return showProfile({ root: r, kp, onClose: closeOverlay }); }
      if (t.id === 'cook') return eatAt('phongtro', 'tunau');
      if (t.id === 'decor') return openDecor();
    }
    if (where === 'trasua') {
      if (t.id === 'door') return exitToStreet('trasua');
      if (t.id === 'shift') return startShift();
      if (t.id === 'manage') { const r = openOverlay(); return openShopPanel({ root: r, shop: kp.shops.trasua, kp, ctx: ctxNow(), tab: 'stock', onClose: () => { save(); closeOverlay(); } }); }
    }
    if (where === 'street') {
      if (t.kind === 'npc') return talk(t.id);
      if (t.id === 'phongtro') return enterPlace('room');
      if (t.id === 'noithat') return openFurniture();
      if (t.id === 'trasua') { if (!world.isOpen(kp, 'trasua')) return doorPanel('trasua'); return enterPlace('trasua'); }
      return doorPanel(t.id);
    }
  }
  function talk(pid) {
    const n = npcs.find((x) => x.id === pid); if (!n) return;
    const lines = (n.person.note ? [n.person.note] : []).concat([`${n.person.role}.`]);
    const c = card(`<h3>${esc(n.person.name)}</h3><p class="kp-muted">${esc(n.person.role || '')}</p><p>"${esc(lines[0])}"</p><div class="kp-btns"><button class="btn primary" id="kpOk">Chào</button></div>`);
    c.querySelector('#kpOk').onclick = closeOverlay;
  }
  function doorPanel(placeId) {
    const p = placeOf(placeId);
    const open = world.isOpen(kp, placeId);
    const foods = Object.values(FOOD).filter((f) => f.place === placeId);
    const staff = (p.people || []).map((id) => (PEOPLE.find((x) => x.id === id) || {}).name).filter(Boolean).slice(0, 6).join(', ');
    const work = world.canWork(kp, placeId);
    let actions = '';
    if (open && foods.length) actions += foods.map((f) => `<button class="btn kp-food" data-food="${f.id}">${esc(f.name)} · ${fmtVND(econ.priceOf(kp.economy, f.id) ?? f.price)}</button>`).join('');
    if (placeId === 'xeom') actions += '<button class="btn" id="kpRide">Gọi xe ôm đi…</button>';
    if (placeId === 'congan' && !kp.player.tamTru) actions += '<button class="btn" id="kpTamTru">Đăng ký tạm trú</button>';
    const c = card(`<div class="kp-kicker">${esc(p.kindLabel || '')}</div><h3>${esc(p.name)}</h3>
      <p>${esc(p.desc || '')}</p>
      <p class="kp-muted">${open ? '🟢 Đang mở cửa' : '🔴 Đang đóng cửa'}${p.hoursText ? ' · ' + esc(p.hoursText) : ''}</p>
      ${staff ? `<p class="kp-muted">Ở đây có: ${esc(staff)}</p>` : ''}
      ${work && !work.ok && work.reason ? `<p class="kp-hint">💼 ${esc(work.reason)}</p>` : ''}
      <div class="kp-btns kp-wrap">${actions}<button class="btn ghost" id="kpClose">Đi tiếp</button></div>`);
    c.querySelectorAll('[data-food]').forEach((b) => { b.onclick = () => eatAt(placeId, b.dataset.food); });
    c.querySelector('#kpClose').onclick = closeOverlay;
    const ride = c.querySelector('#kpRide'); if (ride) ride.onclick = () => rideMenu();
    const tt = c.querySelector('#kpTamTru'); if (tt) tt.onclick = () => { const r = world.registerTamTru(kp); toast(r.ok ? r.text : r.reason); save(); closeOverlay(); };
  }
  // Nội Thất Nhà Mình + Sắp xếp phòng (sim/home.js): buying changes money and the room, both saved right away
  function openFurniture() {
    const r = openOverlay();
    showFurnitureShop({ root: r, kp, open: world.isOpen(kp, 'noithat'), toast, onChange: () => { room.applyDecor(ensureHome(kp).placed); save(); renderHud(); }, onClose: () => { save(); closeOverlay(); } });
  }
  function openDecor() {
    const r = openOverlay();
    showDecor({ root: r, kp, onChange: () => { room.applyDecor(ensureHome(kp).placed); save(); }, onClose: () => { save(); closeOverlay(); } });
  }
  function eatAt(placeId, foodId) {
    const r = world.buyFood(kp, foodId);
    toast(r.ok ? `${(FOOD[foodId] || {}).name}${r.price ? ': ' + fmtVND(-r.price) : ''}${r.tab ? ' (ghi sổ)' : ''}. ${r.line || ''}` : r.reason);
    (r.events || []).forEach(handleEvent);
    save(); closeOverlay();
  }
  function rideMenu() {
    const dests = ['trasua', 'phongtro', 'cho', 'toanha', 'tramyte', 'bama', 'comtam', 'daumoi', 'noithat'].filter((id) => street.doors[id]);
    const c = card(`<h3>Đi xe ôm</h3><p class="kp-muted">Chú Lương chở trong khu phố 15.000đ/cuốc, khoảng 3 phút.</p><div class="kp-btns kp-wrap">${dests.map((id) => `<button class="btn" data-go="${id}">${esc(placeOf(id).name)}</button>`).join('')}<button class="btn ghost" id="kpClose">Thôi, đi bộ</button></div>`);
    c.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => {
      const fee = 15000; if (kp.player.money < fee) { toast('Không đủ tiền đi xe ôm.'); return closeOverlay(); }
      world.addMoney(kp, -fee, 'xeom', 'Xe ôm chú Lương');
      (world.advance(kp, 4, 'idle') || []).forEach(handleEvent);
      const d = street.doors[b.dataset.go]; closeOverlay(); fp.teleport(d.x, d.z + (d.ry === PI ? 0.9 : -0.9), d.ry); save();
    }; });
    c.querySelector('#kpClose').onclick = closeOverlay;
  }

  // ---------- shift, sleep ----------
  function ctxNow() {
    return { day: kp.time.day, min: kp.time.min, priceOf: (item) => econ.priceOf(kp.economy, item), demand: (g, min = kp.time.min, day = kp.time.day) => econ.demand(kp.economy, day, min, g), outage: econ.outageAt(kp.economy, kp.time.day, kp.time.min) };
  }
  function startShift() {
    const can = world.canWork(kp, 'trasua');
    if (!can.ok) { const c = card(`<h3>Trà Sữa Full Topping</h3><p>${esc(can.reason || 'Chưa vào ca được lúc này.')}</p><div class="kp-btns"><button class="btn primary" id="kpOk">Ừ</button></div>`); c.querySelector('#kpOk').onclick = closeOverlay; return; }
    const r = openOverlay(); r.classList.add('kp-full');
    playShift({ root: r, shop: kp.shops.trasua, kp, ctx: ctxNow(), realSeconds: window.__kpShiftSecs, onEnd: (result) => {
      r.classList.remove('kp-full');
      const out = world.workShift(kp, 'trasua', result) || {};
      save(); renderHud();
      if (out.events) out.events.forEach((e) => e.text && toast(e.text));
      closeOverlay();
    } });
  }
  function goSleep() {
    const report = world.sleep(kp);
    const cozy = cozyScore(kp), bonus = morningMood(kp);
    if (bonus > 0) {
      kp.player.needs.mood = Math.min(100, Math.round((kp.player.needs.mood || 0) + bonus));
      if (report.needs) report.needs.mood = kp.player.needs.mood;
      (report.notes = report.notes || []).push(`Phòng ${cozyLabel(cozy).toLowerCase()} (ấm cúng ${cozy}/30): sáng mai tâm trạng +${bonus}.`);
    }
    save();
    const r = openOverlay();
    showNight({ root: r, report, onNext: () => { save(); enterPlace('room', true); } });
  }
  function pause() {
    if (mode === 'menu') return;
    const c = card(`<h3>Tạm dừng</h3><div class="kp-btns kp-col"><button class="btn primary" id="kpRes">Chơi tiếp</button><button class="btn" id="kpX">📱 Nhóm Xóm Ơi</button><button class="btn" id="kpP">📇 Hồ sơ cá nhân</button><button class="btn ghost" id="kpHome">Lưu và về menu chính</button></div>`);
    c.querySelector('#kpRes').onclick = closeOverlay;
    c.querySelector('#kpP').onclick = () => openProfile();
    c.querySelector('#kpX').onclick = () => openXomoi();
    c.querySelector('#kpHome').onclick = () => { save(); onExit && onExit(); };
  }

  function handleEvent(e) {
    if (!e) return;
    if (e.type === 'must_sleep') { toast(e.text || 'Khuya quá, bạn ngủ gục.'); if (mode === 'play') goSleep(); return; }
    if (e.type === 'faint') {
      toast(e.text || 'Bạn xỉu nhẹ, tỉnh dậy ở trạm y tế.');
      const d = street.doors.tramyte; show('street'); if (d) fp.teleport(d.x, d.z + 0.9, Math.PI); renderHud(); save(); return;
    }
    if (e.type === 'xomoi') { renderHud(); return; }
    if (e.text && e.type !== 'open' && e.type !== 'close') toast(e.text);
  }
  let toastT = null;
  function toast(text) {
    let el = $('#kpToast'); if (!el) { el = document.createElement('div'); el.id = 'kpToast'; document.body.appendChild(el); }
    el.textContent = text; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 3200);
  }

  input.onKey((e, { inField }) => {
    if (inField) return;
    if (mode === 'play' && (e.code === 'KeyE' || e.code === 'Enter')) { e.preventDefault(); interact(); }
    if (mode === 'overlay' && e.code === 'Escape') { const x = ov.querySelector('#kpClose, #kpRes, #kpOk, [data-kp="close"]'); if (x) { e.preventDefault(); x.click(); } }
    if (mode === 'play' && e.code === 'KeyP') { e.preventDefault(); openXomoi(); }
    if (mode === 'play' && e.code === 'KeyH') { e.preventDefault(); openProfile(); }
  });
  $('#game').addEventListener('click', () => { if (mode === 'play') fp.lock(); });
  if (isTouch) { const b = $('#actBtn'); if (b) b.addEventListener('click', () => interact()); }

  // ---------- loop ----------
  let acc = 0, elapsed = 0, lastSave = 0;
  const update = (dt) => {
    elapsed += dt;
    const w = PLACES3D[where];
    w.update(elapsed, dt);
    if (where === 'street' && kp) street.setTime(kp.time.min);
    fp.update(dt, { colliders: w.colliders, others: [], bounds: w.bounds || { minX: -60, maxX: 60, minZ: -60, maxZ: 60 }, canMove: mode === 'play', idleSpin: mode === 'menu' });
    if (mode === 'play' && kp) {
      acc += dt * GAME_MIN_PER_SEC;
      if (acc >= 1) {
        const m = Math.floor(acc); acc -= m;
        const events = world.advance(kp, m, where === 'street' ? 'walk' : 'idle') || [];
        events.forEach(handleEvent);
        if (elapsed - lastSave > 10) { lastSave = elapsed; save(); }
        renderHud();
      }
      target = fp.pick(candidates());
      prompt.hidden = !target;
      if (isTouch) { const ab = $('#actBtn'); if (ab) ab.hidden = !target; }
      if (target) prompt.textContent = `${isTouch ? '👆' : 'E'} · ${target.label}`;
    }
  };

  // debug hooks for the e2e tests
  window.__kp = { get kp() { return kp; }, get mode() { return mode; }, get where() { return where; }, fp, street, PLACES3D, world, interact: () => interact(), enter: enterPlace, exit: exitToStreet, doorPanel, sleep: goSleep, openFurniture, openDecor, room, startShift, save };

  showStart();
  return { update, debug: window.__kp };
}

function injectCSS() {
  if (document.getElementById('kpCss')) return;
  const s = document.createElement('style'); s.id = 'kpCss';
  s.textContent = `
#kpOverlay { position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; padding: 14px; background: rgba(20, 24, 33, .38); overflow-y: auto; }
#kpOverlay.kp-full { padding: 0; background: #fffaf3; place-items: stretch; }
.kp-card { width: min(520px, 100%); background: #fffaf3; border: 3px solid var(--ink, #1d1d1f); border-radius: 18px; box-shadow: 6px 6px 0 var(--ink, #1d1d1f); padding: 18px 18px 16px; line-height: 1.5; }
.kp-card h2 { margin: 4px 0 6px; font-size: 26px; } .kp-card h3 { margin: 2px 0 6px; font-size: 20px; }
.kp-kicker { font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; color: #8a7a68; }
.kp-muted { color: #6b6257; font-size: 14px; } .kp-note { color: #8a7a68; font-size: 12px; margin-top: 10px; }
.kp-hint { background: #fff1b8; border-radius: 10px; padding: 6px 10px; font-weight: 700; font-size: 14px; }
.kp-field { display: grid; gap: 4px; font-weight: 800; margin: 8px 0; } .kp-field input { font: inherit; padding: 10px 12px; border: 2px solid var(--ink, #1d1d1f); border-radius: 12px; }
.kp-btns { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; } .kp-btns .btn { min-height: 44px; } .kp-col { flex-direction: column; } .kp-wrap .btn { flex: 1 1 200px; }
#kpHud { position: fixed; top: 10px; left: 10px; right: 10px; z-index: 40; display: flex; justify-content: space-between; align-items: flex-start; pointer-events: none; }
#kpHud > div { pointer-events: auto; }
.kp-hud-l { background: rgba(255, 250, 243, .94); border: 2px solid var(--ink, #1d1d1f); border-radius: 14px; padding: 6px 10px; display: grid; gap: 2px; font-size: 13px; font-variant-numeric: tabular-nums; }
.kp-hud-l b { font-size: 14px; } .kp-needs { display: flex; gap: 8px; } .kp-needs label { display: flex; align-items: center; gap: 3px; font-size: 12px; }
.kp-bar { width: 46px; height: 8px; border-radius: 99px; background: #e6ddd0; overflow: hidden; display: inline-block; } .kp-bar i { display: block; height: 100%; }
.kp-hud-r { display: flex; gap: 6px; } .kp-hud-r button { width: 44px; height: 44px; border-radius: 12px; border: 2px solid var(--ink, #1d1d1f); background: #fffaf3; font-size: 18px; position: relative; cursor: pointer; }
.kp-hud-r em { position: absolute; top: -6px; right: -6px; background: #e63946; color: #fff; border-radius: 99px; font-style: normal; font-size: 11px; font-weight: 900; padding: 1px 6px; }
#kpPrompt { position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%); z-index: 41; background: #fffaf3; border: 2px solid var(--ink, #1d1d1f); border-radius: 99px; padding: 8px 16px; font-weight: 800; font-size: 14px; max-width: 92vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
#kpToast { position: fixed; left: 50%; bottom: 150px; transform: translateX(-50%); z-index: 60; pointer-events: none; background: #1d1d1f; color: #fff; border-radius: 12px; padding: 8px 14px; font-weight: 700; font-size: 14px; max-width: 90vw; }
@media (max-width: 560px) { .kp-needs { flex-wrap: wrap; } #kpPrompt { bottom: 150px; } }
`;
  document.head.appendChild(s);
}
