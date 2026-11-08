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
import * as office from '../khupho/sim/office.js';
import * as story from '../khupho/sim/story.js';
import { STORY } from '../khupho/data/story.js';
import { DRAMAS as DRAMAS_A } from '../khupho/data/dramas_a.js';
import { DRAMAS as DRAMAS_B } from '../khupho/data/dramas_b.js';
import { showScene } from '../khupho/ui/scene.js';

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
  if (kp) story.ensureStory(kp);
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
  const objEl = document.createElement('div'); objEl.id = 'kpObj'; objEl.hidden = true; document.body.appendChild(objEl);
  injectCSS();
  const isTouch = matchMedia('(pointer: coarse)').matches;

  const touchUI = (on) => { const m = $('#mobile'); if (m) m.hidden = !(on && isTouch); const ch = $('#crosshair'); if (ch) ch.hidden = !(on && !isTouch); };
  function openOverlay() { mode = 'overlay'; fp.unlock(); ov.hidden = false; ov.innerHTML = ''; ov.scrollTop = 0; ov.classList.remove('kp-full'); prompt.hidden = true; touchUI(false); const t = $('#kpToast'); if (t) t.hidden = true; return ov; }
  function closeOverlay() { ov.hidden = true; ov.innerHTML = ''; ov.scrollTop = 0; mode = 'play'; renderHud(); touchUI(true); if (!isTouch) fp.lock(); }
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
  function openXomoi() { if (!kp) return; const r = openOverlay(); showXomoi({ root: r, kp, onClose: () => { save(); closeOverlay(); did('xomoi'); } }); }
  function openProfile() { if (!kp) return; const r = openOverlay(); showProfile({ root: r, kp, onClose: () => { closeOverlay(); did('profile'); } }); }
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
    renderObjectives();
  }

  // ---------- story + dramas (sim/story.js): the HUD always says what to do next ----------
  const DRAMAS = [...DRAMAS_A, ...DRAMAS_B];
  const nameOf = (id) => (PEOPLE.find((x) => x.id === id) || {}).name || id;
  const fill = (t) => String(t || '').replaceAll('{ten}', kp ? kp.player.name : 'bạn');
  const doorOf = (placeId) => street.doors[placeId] || null;
  const placeName = (id) => (placeOf(id).short || placeOf(id).name || id);
  const cardQueue = [];
  function roles() {
    const r = ['any'];
    if ((kp.counters && kp.counters.shift > 0) || (kp.job && kp.job.placeId === 'trasua')) r.push('trasua');
    for (const co of Object.keys(office.OFFICES)) if (soloRunAt(co)) r.push(co);
    return r;
  }
  function did(type, place) { if (!kp) return; story.count(kp, type, place); storyEvents(story.progress(kp, STORY)); save(); }
  function storyEvents(ev = []) {
    for (const e of ev) {
      if (e.type === 'beat') toast(`✅ Xong: ${fill(e.task)}`);
      else if (e.type === 'chapter') cardQueue.push({ kicker: 'CHƯƠNG MỚI', title: e.title, text: fill(e.intro) });
      else if (e.type === 'chapter_done' && e.done) cardQueue.push({ kicker: 'XONG CHƯƠNG', title: e.title, text: fill(e.done) });
      else if (e.type === 'story_end') cardQueue.push({ kicker: 'HẾT CỐT TRUYỆN CHÍNH', title: 'Khu phố 7 giờ là nhà', text: 'Câu chuyện chính đã khép lại, nhưng khu phố thì không: drama vẫn nổ, quán vẫn mở, Xóm Ơi vẫn rung. Sống tiếp nhé.' });
      else if (e.type === 'drama_start') toast(`🔥 Có biến mới: ${e.title}`);
      else if (e.type === 'drama_end') toast(`🎬 Hết drama "${e.title}". Biên bản khu phố có thêm một dòng.`);
      else if (e.type === 'drama_missed') toast(`📱 Bạn lỡ một hồi "${e.title}". Xóm Ơi đang kể lại.`);
    }
    renderObjectives();
  }
  function showQueuedCard() {
    const q = cardQueue.shift(); if (!q) return;
    const c = card(`<div class="kp-kicker">${esc(q.kicker)}</div><h2>${esc(q.title)}</h2><p>${esc(q.text)}</p><div class="kp-btns"><button class="btn primary" id="kpOk">Đi thôi →</button></div>`);
    c.querySelector('#kpOk').onclick = () => { closeOverlay(); if (where !== 'street') playScenes(where === 'room' ? 'phongtro' : where); };
  }
  /** Play the first scene waiting at this door (story beat or drama act). then() runs after it. → true if one played. */
  function playScenes(placeId, then) {
    if (!kp) return false;
    const items = story.scenesAt(kp, placeId, STORY, DRAMAS);
    if (!items.length) return false;
    const item = items[0];
    const r = openOverlay();
    showScene({ root: r, item, choices: story.choicesFor(kp, item.scene, roles()), nameOf, fill,
      onChoose: (i) => { const res = story.finishScene(kp, item, i, STORY, DRAMAS); storyEvents(res.events); save(); renderHud(); return res.lines; },
      onDone: () => { closeOverlay(); if (then) then(); } });
    return true;
  }
  // a floating diamond over the door the story points at (and one for today's drama)
  const mkMarker = (color) => { const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), new THREE.MeshBasicMaterial({ color })); m.scale.y = 1.5; m.visible = false; street.root.add(m); return m; };
  const markers = { story: mkMarker('#b18cff'), drama: mkMarker('#ff6b4a') };
  const hm = (t) => (t ? t.replace(':00', 'h').replace(':', 'h') : '');
  function renderObjectives() {
    if (!kp || hud.hidden) { objEl.hidden = true; return; }
    const obs = story.objectives(kp, STORY, DRAMAS);
    const st = obs.find((o) => o.kind === 'story');
    const dr = obs.filter((o) => o.kind === 'drama' && o.today && kp.time.min <= toMinutes(o.to));
    const row = (o, cls, icon, title) => `<div class="kp-obj ${cls}" data-where="${o.where}"><span class="kp-arrow">${icon}</span><div><small>${esc(title)}</small><b>${esc(fill(o.task))}</b><em>${o.hint && cls === 'story' && fill(o.hint).startsWith(placeName(o.where)) ? '' : esc(placeName(o.where))}${o.waiting ? ` · từ ${esc(dateOf(o.minDay).label.replace(/\/\d{4}$/, ''))}` : ''}${o.from ? ` · ${hm(o.from)}-${hm(o.to)}` : ''}${o.hint && cls === 'story' ? `${fill(o.hint).startsWith(placeName(o.where)) ? '' : ' · '}${esc(fill(o.hint))}` : ''}<span class="kp-dist"></span></em></div></div>`;
    const html = (st ? row(st, 'story', '➤', `📌 ${st.chapter}`) : '') + dr.slice(0, 2).map((o) => row(o, 'drama', '➤', `🔥 Có biến · ${o.title}`)).join('');
    if (objEl.dataset.html !== html) { objEl.innerHTML = html; objEl.dataset.html = html; }
    objEl.hidden = !html;
    markers.story.userData.where = st ? st.where : null;
    markers.drama.userData.where = dr[0] ? dr[0].where : null;
  }
  const toMinutes = (hhmm) => { const [h, m] = String(hhmm || '23:59').split(':').map(Number); return h * 60 + (m || 0); };
  function updateObjectives(t) {
    for (const m of Object.values(markers)) {
      const d = m.userData.where && doorOf(m.userData.where);
      m.visible = !!(d && where === 'street' && mode !== 'menu');
      if (m.visible) { m.position.set(d.x, 4.3 + Math.sin(t * 2.4) * 0.18, d.z); m.rotation.y = t * 1.6; }
    }
    if (objEl.hidden) return;
    objEl.querySelectorAll('.kp-obj').forEach((el) => {
      const d = doorOf(el.dataset.where), arrow = el.querySelector('.kp-arrow'), dist = el.querySelector('.kp-dist');
      if (!d) return;
      const here = (where === 'room' ? 'phongtro' : where) === el.dataset.where;
      if (where !== 'street') { arrow.style.transform = 'none'; arrow.textContent = here ? '📍' : '🚪'; dist.textContent = here ? ' · ngay đây' : ' · ra phố trước'; return; }
      const a = fp.arrowTo({ x: d.x, z: d.z }); arrow.textContent = '➤'; arrow.style.transform = `rotate(${a.deg}deg)`;
      dist.textContent = a.dist < 3 ? ' · tới rồi, bấm E' : ` · ${Math.round(a.dist)} m`;
    });
  }

  // ---------- start screen ----------
  let oldProfile = null;
  function showStart() {
    mode = 'menu'; hud.hidden = true; prompt.hidden = true; objEl.hidden = true; show('street');
    const lastName = Object.values(profile.runs || {}).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).map((r) => r.name).find(Boolean) || '';
    const c = card(`<div class="kp-kicker">BẢN THỬ · GIAI ĐOẠN 1</div><h2>Khu phố T&amp;M</h2>
      <p>Khu phố 7, phường Tâm Mỹ. Bạn thuê một phòng ở Dãy trọ Bình An, sáng đi làm ở một trong 7 công ty (hoặc Trà Sữa Full Topping), ăn bánh mì đầu hẻm, đọc nhóm Xóm Ơi, và sống tiếp, mãi mãi.</p>
      ${kp ? `<p class="kp-muted">Đang ở: ${esc(dateOf(kp.time.day).label)} · ${fmtVND(kp.player.money)}</p>` : `<label class="kp-field">Tên của bạn<input id="kpName" maxlength="16" value="${esc(lastName)}" placeholder="VD: Linh" autocomplete="off"></label>`}
      <div class="kp-btns">${kp ? '<button class="btn primary" id="kpGo">Về khu phố →</button><button class="btn ghost" id="kpNew">Bắt đầu lại</button>' : '<button class="btn primary" id="kpGo">Dọn vào ở →</button>'}<button class="btn ghost" id="kpBack">← Menu chính</button></div>
      <p class="kp-note">Một số luật, giá cả được dùng làm chất liệu chơi (thông tin giải trí, không phải tư vấn pháp lý).</p>`);
    c.querySelector('#kpGo').onclick = () => {
      if (!kp) { const name = (c.querySelector('#kpName').value || '').trim() || 'Bạn'; kp = world.newGame({ name, seed: (Date.now() % 2147483646) + 1, now: Date.now(), profile: oldProfile || undefined, soloRuns: profile.runs, companyName }); story.ensureStory(kp); storyEvents(story.newDay(kp, DRAMAS)); save(); }
      storyEvents(story.progress(kp, STORY));
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
    if (k !== 'street') { const pid = k === 'room' ? 'phongtro' : k; story.count(kp, 'visit', pid); storyEvents(story.progress(kp, STORY)); setTimeout(() => { if (mode === 'play' && where === k) playScenes(pid); }, 250); }
    if (morning) {
      const job = ['tm', 'tech', 'audit', 'bama', 'agency', 'event', 'hr'].map(soloRunAt).filter(Boolean)[0];
      const wd = dateOf(kp.time.day).weekday, o = job && office.OFFICES[job.company];
      toast(`Chào buổi sáng. ${dateOf(kp.time.day).label}.${o && wd > 0 && wd < 6 ? ` 💼 ${office.hoursText(job.company).split('-')[0]} vào làm ở ${companyName(job.company)} (${o.where}).` : ''}`);
    }
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
      const entering = t.id === 'phongtro' || (t.id === 'trasua' && world.isOpen(kp, 'trasua'));
      if (!entering) { did('visit', t.id); if (playScenes(t.id, () => streetDoor(t.id))) return; }
      return streetDoor(t.id);
    }
  }
  function streetDoor(id) {
    if (id === 'phongtro') return enterPlace('room');
    if (id === 'noithat') return openFurniture();
    if (id === 'trasua' && world.isOpen(kp, 'trasua')) return enterPlace('trasua');
    return doorPanel(id);
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
    const cos = office.officesAt(placeId);
    const coInfo = cos.map((co) => {
      const run = soloRunAt(co), o = office.OFFICES[co];
      return `<p class="kp-muted">💼 <b>${esc(companyName(co))}</b> · ${esc(o.where)} · giờ làm ${office.hoursText(co)} · ${run ? `bạn đang thực tập (ngày ${run.day}/45)` : 'đang tuyển thực tập sinh'}</p>`;
    }).join('');
    actions += cos.map((co) => `<button class="btn${office.canGoToWork(kp, co).ok ? ' primary' : ''}" data-work="${co}">💼 ${soloRunAt(co) ? 'Vào làm' : 'Ứng tuyển'} ở ${esc(companyName(co))}</button>`).join('');
    if (placeId === 'xeom') actions += '<button class="btn" id="kpRide">Gọi xe ôm đi…</button>';
    if (placeId === 'congan' && !kp.player.tamTru) actions += '<button class="btn" id="kpTamTru">Đăng ký tạm trú</button>';
    const c = card(`<div class="kp-kicker">${esc(p.kindLabel || '')}</div><h3>${esc(p.name)}</h3>
      <p>${esc(p.desc || '')}</p>
      <p class="kp-muted">${open ? '🟢 Đang mở cửa' : '🔴 Đang đóng cửa'}${p.hoursText ? ' · ' + esc(p.hoursText) : ''}</p>
      ${staff ? `<p class="kp-muted">Ở đây có: ${esc(staff)}</p>` : ''}
      ${coInfo}
      ${work && !work.ok && work.reason ? `<p class="kp-hint">💼 ${esc(work.reason)}</p>` : ''}
      <div class="kp-btns kp-wrap">${actions}<button class="btn ghost" id="kpClose">Đi tiếp</button></div>`);
    c.querySelectorAll('[data-food]').forEach((b) => { b.onclick = () => eatAt(placeId, b.dataset.food); });
    c.querySelectorAll('[data-work]').forEach((b) => { b.onclick = () => goToWork(b.dataset.work); });
    c.querySelector('#kpClose').onclick = closeOverlay;
    const ride = c.querySelector('#kpRide'); if (ride) ride.onclick = () => rideMenu();
    const tt = c.querySelector('#kpTamTru'); if (tt) tt.onclick = () => { const r = world.registerTamTru(kp); toast(r.ok ? r.text : r.reason); save(); closeOverlay(); storyEvents(story.progress(kp, STORY)); };
  }
  // Nội Thất Nhà Mình + Sắp xếp phòng (sim/home.js): buying changes money and the room, both saved right away
  function openFurniture() {
    const r = openOverlay();
    showFurnitureShop({ root: r, kp, open: world.isOpen(kp, 'noithat'), toast, onChange: () => { room.applyDecor(ensureHome(kp).placed); did('furniture'); renderHud(); }, onClose: () => { save(); closeOverlay(); } });
  }
  function openDecor() {
    const r = openOverlay();
    showDecor({ root: r, kp, onChange: () => { room.applyDecor(ensureHome(kp).placed); save(); }, onClose: () => { save(); closeOverlay(); } });
  }
  // ---------- going to work at the 7 companies (sim/office.js): the day itself is played in Solo ----------
  const soloRunAt = (co) => Object.values(profile.runs || {}).filter((r) => r && r.company === co && !r.ended).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0] || null;
  function goToWork(co) {
    const g = office.canGoToWork(kp, co);
    if (!g.ok) { toast(g.reason); return; }
    office.leaveForWork(kp, co); save();
    const dbg = /[?&]debug=1/.test(location.search) ? '&debug=1' : '';
    location.href = `${location.pathname}?kp=1&open=work&co=${co}&name=${encodeURIComponent(kp.player.name || '')}${dbg}`;
  }
  function backFromWork() {
    let h = null;
    try { h = JSON.parse(localStorage.getItem('kp_handoff_v1') || 'null'); localStorage.removeItem('kp_handoff_v1'); } catch { /* private mode */ }
    if (!kp || !kp.work) return false;
    const co = kp.work.co;
    const r = office.finishWorkday(kp, h || {}, { now: Date.now() });
    if (r.ok && h && h.worked) { story.count(kp, 'office'); storyEvents(story.progress(kp, STORY)); }
    storyEvents(story.tickDramas(kp, DRAMAS));
    world.importSoloRuns(kp, profile.runs, companyName);
    save();
    show('street');
    const d = street.doors[(office.OFFICES[co] || {}).place];
    if (d) fp.teleport(d.x, d.z + (d.ry === PI ? 0.9 : -0.9), d.ry);
    hud.hidden = false; mode = 'play'; renderHud(); touchUI(true);
    const c = card(`<div class="kp-kicker">${esc(dateOf(kp.time.day).label)} · ${hhmm(kp.time.min)}</div><h3>${h && h.worked ? 'Tan làm' : 'Về lại khu phố'} · ${esc(companyName(co))}</h3>
      <ul class="kp-list">${(r.lines.length ? r.lines : ['Bạn về lại khu phố.']).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
      <p class="kp-muted">Buổi tối là của bạn: ăn gì đó, ghé trà sữa làm thêm ca, hoặc về phòng ngủ.</p>
      <div class="kp-btns"><button class="btn primary" id="kpOk">Ra phố →</button></div>`);
    c.querySelector('#kpOk').onclick = () => { closeOverlay(); (r.events || []).forEach(handleEvent); };
    return true;
  }
  function eatAt(placeId, foodId) {
    const r = world.buyFood(kp, foodId);
    toast(r.ok ? `${(FOOD[foodId] || {}).name}${r.price ? ': ' + fmtVND(-r.price) : ''}${r.tab ? ' (ghi sổ)' : ''}. ${r.line || ''}` : r.reason);
    (r.events || []).forEach(handleEvent);
    save(); closeOverlay();
    if (r.ok) did('eat');
  }
  function rideMenu() {
    const dests = ['trasua', 'phongtro', 'cho', 'toanha', 'tramyte', 'bama', 'comtam', 'daumoi', 'noithat'].filter((id) => street.doors[id]);
    const c = card(`<h3>Đi xe ôm</h3><p class="kp-muted">Chú Lương chở trong khu phố 15.000đ/cuốc, khoảng 3 phút.</p><div class="kp-btns kp-wrap">${dests.map((id) => `<button class="btn" data-go="${id}">${esc(placeOf(id).name)}</button>`).join('')}<button class="btn ghost" id="kpClose">Thôi, đi bộ</button></div>`);
    c.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => {
      const fee = 15000; if (kp.player.money < fee) { toast('Không đủ tiền đi xe ôm.'); return closeOverlay(); }
      world.addMoney(kp, -fee, 'xeom', 'Xe ôm chú Lương');
      (world.advance(kp, 4, 'idle') || []).forEach(handleEvent);
      const d = street.doors[b.dataset.go]; closeOverlay(); fp.teleport(d.x, d.z + (d.ry === PI ? 0.9 : -0.9), d.ry); save(); did('ride');
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
      did('shift');
    } });
  }
  function goSleep() {
    const report = world.sleep(kp);
    story.count(kp, 'sleep');
    const dramaEv = story.newDay(kp, DRAMAS);
    for (const e of dramaEv) if (e.type === 'drama_start') (report.notes = report.notes || []).push(`🔥 Có biến mới trong khu phố: "${e.title}". Mai xem góc trái màn hình để biết đi đâu.`);
    const cozy = cozyScore(kp), bonus = morningMood(kp);
    if (bonus > 0) {
      kp.player.needs.mood = Math.min(100, Math.round((kp.player.needs.mood || 0) + bonus));
      if (report.needs) report.needs.mood = kp.player.needs.mood;
      (report.notes = report.notes || []).push(`Phòng ${cozyLabel(cozy).toLowerCase()} (ấm cúng ${cozy}/30): sáng mai tâm trạng +${bonus}.`);
    }
    save();
    const r = openOverlay();
    showNight({ root: r, report, onNext: () => { save(); enterPlace('room', true); storyEvents(dramaEv.filter((e) => e.type !== 'drama_start')); storyEvents(story.progress(kp, STORY)); } });
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
        storyEvents(story.tickDramas(kp, DRAMAS));
        if (elapsed - lastSave > 10) { lastSave = elapsed; save(); }
        renderHud();
      }
      if (cardQueue.length) showQueuedCard();
      updateObjectives(elapsed);
      target = fp.pick(candidates());
      prompt.hidden = !target;
      if (isTouch) { const ab = $('#actBtn'); if (ab) ab.hidden = !target; }
      if (target) prompt.textContent = `${isTouch ? '👆' : 'E'} · ${target.label}`;
    }
  };

  // debug hooks for the e2e tests
  window.__kp = { get kp() { return kp; }, get mode() { return mode; }, get where() { return where; }, fp, street, PLACES3D, world, interact: () => interact(), enter: enterPlace, exit: exitToStreet, doorPanel, sleep: goSleep, openFurniture, openDecor, room, startShift, save };

  window.__kp.goToWork = goToWork;
  window.__kp.story = { objectives: () => story.objectives(kp, STORY, DRAMAS), beat: () => { const c = story.currentBeat(kp, STORY); return c && { ...c.beat, chapter: c.chapter.title, chIndex: c.chIndex, seen: !!kp.story.seen[c.beat.id] }; }, scenesAt: (pid) => story.scenesAt(kp, pid, STORY, DRAMAS).map((x) => ({ kind: x.kind, ref: x.ref, task: x.task })), playScenes, startShift, rideMenu, openXomoi, openProfile };
  if (!backFromWork()) showStart();
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
#kpObj { position: fixed; top: 112px; left: 10px; z-index: 40; display: grid; gap: 6px; width: min(340px, calc(100vw - 20px)); pointer-events: none; }
.kp-obj { display: grid; grid-template-columns: 30px 1fr; gap: 8px; align-items: center; background: rgba(255, 250, 243, .95); border: 2px solid var(--ink, #1d1d1f); border-left: 8px solid #b18cff; border-radius: 14px; padding: 6px 10px; box-shadow: 3px 3px 0 var(--ink, #1d1d1f); }
.kp-obj.drama { border-left-color: #ff6b4a; }
.kp-obj small { display: block; font-size: 11px; font-weight: 900; color: #6b6257; letter-spacing: .03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kp-obj b { display: block; font-size: 14.5px; line-height: 1.25; } .kp-obj em { display: block; font-style: normal; font-size: 12px; color: #6b6257; line-height: 1.3; }
.kp-arrow { width: 30px; height: 30px; border-radius: 50%; background: #1d1d1f; color: #fff; display: grid; place-items: center; font-size: 15px; transition: transform .12s linear; }
@media (max-width: 560px) { #kpObj { top: 168px; width: min(320px, calc(100vw - 20px)); } .kp-obj b { font-size: 13.5px; } .kp-obj em { font-size: 11px; } }
#kpToast { position: fixed; left: 50%; bottom: 150px; transform: translateX(-50%); z-index: 60; pointer-events: none; background: #1d1d1f; color: #fff; border-radius: 12px; padding: 8px 14px; font-weight: 700; font-size: 14px; max-width: 90vw; }
@media (max-width: 560px) { .kp-needs { flex-wrap: wrap; } #kpPrompt { bottom: 150px; } }
`;
  document.head.appendChild(s);
}
