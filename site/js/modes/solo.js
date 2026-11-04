// SOLO · T&M Partners (first person). Story beats + side tasks with deadlines + mini-games + salary tiers,
// with a career profile that keeps several runs ("lượt chơi") side by side.
import * as THREE from 'three';
import { $, clamp, esc, angleLerp, store } from '../core/util.js';
import { sfx, unlockAudio, isSoundOn, setSound } from '../core/audio.js';
import { isTouch } from '../core/input.js';
import { createFPControls } from '../core/fpcontrols.js';
import { makePerson, nameTag, makeMarker, makeCat } from '../art/people.js';
import { buildWorld, SPOTS, PLAYER_START, MEETING_SEAT, PLAYER_DESK, CAT_PATH } from '../maps/tm-office.js';
import { CAST, IDLE, COMPANY } from '../story/tm/characters.js';
import { PROLOGUE } from '../story/tm/prologue.js';
import { DAY1, SIDE_TASKS } from '../story/tm/day1.js';
import { createDialogue } from '../story/dialogue.js';
import { createPhone } from '../ui/phone.js';
import { toast } from '../ui/toast.js';
import { overlay, hideOverlay } from '../ui/overlay.js';
import { runMinigame } from '../ui/minigame.js';
import { TIERS, TIER_ORDER, tier, withholding, netPay, fmtVND } from '../game/difficulty.js';
import { emptyProfile, newRun, addRun, updateRun, removeRun, listRuns, runLabel, validateProfile } from '../game/save.js';
import { planTasks, tick, visit, active, summary, currentLeg } from '../game/tasks.js';
import { net, clean } from '../net/legacy-net.js';

const PROFILE_KEY = 'tm_profile_v1';
const DAYS = [PROLOGUE, DAY1]; // index = run.day; days not written yet show "sắp ra mắt"
const BOUNDS = { minX: -14.7, maxX: 14.7, minZ: -9.7, maxZ: 9.85 };
const CLOCK_RATE = 1.5; // in-game minutes per real second while walking around
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const fmtClock = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(Math.floor(min % 60)).padStart(2, '0')}`;
const hash = (str) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function startSolo({ scene, camera, input, onExit }) {
  let profile = validateProfile(store.json(PROFILE_KEY)) || emptyProfile();
  let R = null;          // the active run
  let mode = 'menu';     // menu | intro | play | dialog | ringing | phone | pause | overlay
  const save = () => { if (R) profile = updateRun(profile, R.id, R); store.set(PROFILE_KEY, JSON.stringify(profile)); };
  const fmt = (t) => String(t).replaceAll('{ten}', R ? R.name : 'bạn');

  $('#phoneWifi').textContent = '📶 TM-Excellence-5G';

  // ---------- world ----------
  const world = buildWorld(scene);
  const npcs = {};
  for (const [id, def] of Object.entries(CAST)) {
    if (def.body === false || !def.look) continue;
    const mesh = makePerson(def.look);
    mesh.add(nameTag(def.name, def.role.split('·')[0].trim(), { color: def.color }));
    const marker = makeMarker(); marker.position.y = 2.05; marker.visible = false; mesh.add(marker);
    scene.add(mesh);
    npcs[id] = { mesh, marker, tag: mesh.children.find((c) => c.isSprite), target: new THREE.Vector3(), rest: 0, walk: 0, phase: Math.random() * 6, talking: false };
  }
  const objMarker = makeMarker(); objMarker.visible = false; scene.add(objMarker);
  // Mèo KPI wanders around (sometimes naps)
  const cat = makeCat(); cat.scale.setScalar(1.8); scene.add(cat);
  const catState = { i: 0, pos: new THREE.Vector3(CAT_PATH[0][0], 0, CAT_PATH[0][1]), nap: 4 };
  cat.position.copy(catState.pos);

  const fp = createFPControls({ camera, input, getMode: () => mode, onPause: () => pause(), start: PLAYER_START });
  const player = fp.player;

  // ---------- helpers ----------
  function charInfo(id) {
    if (id === 'me') return { name: R ? R.name : 'Bạn', role: 'Intern (bạn)', emoji: '🙂', color: '#bfe3ff' };
    if (id === 'think') return { name: R ? R.name : 'Bạn', role: 'nghĩ thầm…', emoji: '💭', color: '#e3d9ff' };
    if (id === 'nar') return { name: '', role: '', emoji: '📖', color: '#fff1b8' };
    return CAST[id] || { name: id, role: '', emoji: '❔', color: '#ccc' };
  }
  const day = () => DAYS[R.day];
  function currentStep() {
    if (!R || !day()) return null;
    const d = day();
    while (d.steps[R.step] && d.steps[R.step].when && !d.steps[R.step].when(R)) R.step++;
    return d.steps[R.step] || null;
  }
  function updateHUD() {
    if (!R) return;
    const d = day();
    const t = R.tier ? ` · ${TIERS[R.tier].label}` : '';
    $('#hudDay').textContent = `${R.day === 0 ? 'Phỏng vấn' : `L${R.level} · Ngày ${R.day}`}${t}`;
    $('#barUy').style.width = R.st.uy + '%';
    $('#barDr').style.width = R.st.dr + '%';
    $('#barNl').style.width = R.st.nl + '%';
    $('#hudTime').textContent = fmtClock(R.clock);
    $('#phoneClock').textContent = fmtClock(R.clock);
    const step = currentStep();
    $('#objText').textContent = step ? fmt(step.obj) : (d ? 'Hết ngày!' : '');
    const b = $('#badge'); b.hidden = !R.unread; b.textContent = R.unread > 9 ? '9+' : R.unread;
    renderTasks();
  }
  function renderTasks() {
    const box = $('#taskList');
    const list = R ? active(R.tasks) : [];
    box.hidden = !list.length || mode === 'menu';
    box.innerHTML = '<div class="tl-head">📋 Việc vặt</div>' + list.map((t) => {
      const leg = currentLeg(t);
      const who = leg.npc ? charInfo(leg.npc).name : leg.obj === 'printer' ? 'Máy in' : leg.obj === 'coffee' ? 'Pantry' : leg.obj;
      const left = Math.max(0, Math.round(t.deadline - R.clock));
      return `<div class="tl-item${left < 15 ? ' urgent' : ''}"><div class="tl-t">${esc(t.title)}</div><div class="tl-s">→ ${esc(who)} · còn ${left} phút</div></div>`;
    }).join('');
  }
  function applyFx(fx) {
    if (!fx || !R) return;
    const lbl = { uy: 'Uy tín', dr: 'Drama', nl: 'Năng lượng' };
    for (const k of ['uy', 'dr', 'nl']) {
      if (!fx[k]) continue;
      const before = R.st[k];
      R.st[k] = clamp(R.st[k] + fx[k], 0, 100);
      const d = R.st[k] - before;
      if (d) toast(`${d > 0 ? '▲' : '▼'} ${lbl[k]} ${d > 0 ? '+' : ''}${d}`, k === 'dr' ? 'drama' : d > 0 ? 'good' : 'bad', 2);
    }
    if (fx.rel) for (const [id, n] of Object.entries(fx.rel)) {
      R.rel[id] = (R.rel[id] || 0) + n;
      toast(`${n > 0 ? '❤️' : '💔'} ${charInfo(id).name} ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'good' : 'bad', 2);
    }
    if (fx.set) Object.assign(R.flags, fx.set);
    updateHUD();
  }
  async function voteToast(id, idx) {
    const rows = await net.vote('tm_' + id, idx);
    if (!rows || !rows.length) return;
    const total = rows.reduce((a, r) => a + Number(r.n), 0);
    const mine = Number((rows.find((r) => r.option_idx === idx) || {}).n || 0);
    toast(total <= 1 ? '📊 Bạn là người chơi đầu tiên chọn như vậy!' : `📊 ${Math.round((mine / total) * 100)}% người chơi cũng chọn như bạn`, 'stat', 3);
  }

  // ---------- salary cards ----------
  function salaryPick() {
    return new Promise((resolve) => {
      const el = document.getElementById('salary') || Object.assign(document.createElement('div'), { id: 'salary' });
      document.body.appendChild(el);
      const card = (id) => {
        const t = TIERS[id];
        return `<button class="sal-card" data-id="${id}"><div class="sal-emoji">${t.emoji}</div><div class="sal-amt">${t.label}</div><div class="sal-name">${t.name}</div>
          <div class="sal-exp">${esc(t.expectation)}</div>
          <ul>${t.perks.map((p) => `<li class="plus">${esc(p)}</li>`).join('')}${t.costs.map((p) => `<li class="minus">${esc(p)}</li>`).join('')}</ul>
          <div class="sal-meta">Việc vặt/ngày: ${t.sideTasks} · Deadline ×${t.deadlineMult}</div></button>`;
      };
      el.innerHTML = `<div class="sal-wrap"><div class="ov-kicker">DEAL LƯƠNG · BẮT BUỘC</div><h2>Em muốn mức phụ cấp nào?</h2><p class="muted">Lương nào việc nấy. Mức này quyết định độ khó của cả lượt chơi. (1–4 để chọn)</p><div class="sal-grid">${TIER_ORDER.map(card).join('')}</div><p class="sal-note">Thuế, bảo hiểm trong game được đơn giản hóa để giải trí, không phải tư vấn pháp lý.</p></div>`;
      el.hidden = false;
      let chosen = null;
      const pick = (id) => {
        if (chosen !== id) {
          chosen = id; sfx.choose();
          el.querySelectorAll('.sal-card').forEach((b) => b.classList.toggle('on', b.dataset.id === id));
          el.querySelectorAll('.sal-card .sal-confirm').forEach((x) => x.remove());
          el.querySelector(`.sal-card[data-id="${id}"]`).insertAdjacentHTML('beforeend', '<div class="sal-confirm">Bấm lần nữa để chốt ✍️</div>');
          return;
        }
        window.removeEventListener('keydown', onKey, true);
        el.hidden = true;
        resolve(id);
      };
      const onKey = (e) => { if (/^Digit[1-4]$/.test(e.code)) { e.preventDefault(); e.stopPropagation(); pick(TIER_ORDER[Number(e.code.slice(5)) - 1]); } };
      window.addEventListener('keydown', onKey, true);
      el.querySelectorAll('.sal-card').forEach((b) => { b.onclick = () => pick(b.dataset.id); });
    });
  }

  // ---------- dialogue ----------
  let callMode = null;
  const dialogue = createDialogue({
    charInfo, fmt, applyFx,
    getState: () => R,
    pushChat: (list) => pushChat(list),
    onChoice: (id, i) => voteToast(id, i),
    onSpeaker(spk) {
      if (callMode) document.querySelectorAll('#callTiles .tile').forEach((t) => t.classList.toggle('speaking', t.dataset.id === spk || (spk === 'think' && t.dataset.id === 'me')));
      else if (npcs[spk] && npcs[spk].mesh.position.distanceTo(player.pos) < 10) { fp.focus(npcs[spk].mesh.position); npcs[spk].talking = true; }
    },
    async extra(node, run) {
      if (node.salary) {
        $('#dialog').hidden = true;
        R.tier = await salaryPick();
        save(); updateHUD();
        return;
      }
      if (node.mini) {
        $('#dialog').hidden = true;
        const { score } = await runMinigame(node.mini);
        const bar = Math.max(node.mini.pass ?? 0.5, R.tier ? tier(R.tier).qa : 0);
        const ok = score >= bar;
        R.flags.minis = (R.flags.minis || 0) + 1;
        if (ok) R.flags.minis_ok = (R.flags.minis_ok || 0) + 1;
        await run(ok ? node.good || [] : node.bad || []);
      }
    },
  });
  function startDialogMode() { mode = 'dialog'; $('#prompt').hidden = true; $('#crosshair').hidden = true; $('#mobile').hidden = true; fp.unlock(); }
  function endDialogMode() {
    dialogue.hide();
    fp.focus(null);
    Object.values(npcs).forEach((n) => { n.talking = false; });
    if (mode === 'dialog') { mode = 'play'; $('#mobile').hidden = !isTouch; $('#crosshair').hidden = isTouch; fp.lock(); }
  }

  // ---------- story flow ----------
  async function runStep(step) {
    startDialogMode();
    if (step.seat === 'mr_seat') { fp.teleport(MEETING_SEAT[0], MEETING_SEAT[1], 0, 1.05); }
    if (step.call) openCallFrame(step.call);
    await dialogue.run(step.scene);
    if (step.call) closeCallFrame();
    if (step.seat) player.eye = 1.38;
    R.step++;
    applyFx({ nl: -5 });
    if (R.st.nl <= 0) await dialogue.run([['nar', 'Mắt bạn díp lại. Bạn gục xuống bàn phím một phút. Màn hình hiện "aaaaaaaaaaa".'], ['tuyet', 'Em mệt thì nghỉ năm phút. Chị cần em tỉnh, không cần em có mặt.'], { fx: { uy: -4, nl: 40 } }]);
    save();
    endDialogMode();
    if (!currentStep()) { dayEnd(); return; }
    onStepStart();
  }
  function onStepStart() {
    const step = currentStep();
    if (step) R.clock = Math.max(R.clock, toMin(step.time));
    placeNPCs(false); updateHUD(); save(); maybeScheduleCall();
  }
  function spotFor(id) {
    if (!R || !day()) return id;
    const step = currentStep();
    return (step && step.pos && step.pos[id]) || (day().pos && day().pos[id]) || id;
  }
  function placeNPCs(instant) {
    for (const [id, n] of Object.entries(npcs)) {
      const sp = SPOTS[spotFor(id)] || SPOTS[id];
      if (!sp) continue;
      n.target.set(sp[0], 0, sp[1]); n.rest = sp[2];
      if (instant) { n.mesh.position.copy(n.target); n.mesh.rotation.y = sp[2]; }
    }
  }

  // ---------- Teams calls ----------
  let ringTimer = null, ringLoop = null, callClock = null;
  function maybeScheduleCall(delay = 2600) {
    clearTimeout(ringTimer);
    const step = currentStep();
    if (step && step.who.startsWith('call:')) ringTimer = setTimeout(tryRing, delay);
  }
  function tryRing() {
    const step = currentStep();
    if (!step || !step.who.startsWith('call:')) return;
    if (mode !== 'play') { ringTimer = setTimeout(tryRing, 1500); return; }
    const caller = charInfo(step.who.slice(5));
    mode = 'ringing'; fp.unlock();
    $('#prompt').hidden = true; $('#mobile').hidden = true;
    $('#incAvatar').textContent = caller.emoji; $('#incAvatar').style.background = caller.color;
    $('#incName').textContent = caller.name; $('#incTitle').textContent = step.call.title;
    $('#incoming').hidden = false;
    sfx.ring(); clearInterval(ringLoop); ringLoop = setInterval(() => sfx.ring(), 1600);
  }
  function stopRing() { clearInterval(ringLoop); ringLoop = null; $('#incoming').hidden = true; }
  function acceptCall() { const step = currentStep(); stopRing(); mode = 'play'; if (step && step.who.startsWith('call:')) runStep(step); }
  function declineCall() {
    stopRing(); mode = 'play'; $('#mobile').hidden = !isTouch;
    applyFx({ uy: -2 });
    toast('📵 Bạn từ chối cuộc gọi. Chị ấy sẽ gọi lại… và nhớ chuyện này.', 'bad', 3);
    fp.lock(); maybeScheduleCall(9000);
  }
  function openCallFrame(call) {
    callMode = call;
    $('#callTitle').textContent = call.title;
    $('#callTiles').innerHTML = call.people.map((id) => {
      const c = charInfo(id);
      return `<div class="tile" data-id="${id}"><div class="av" style="background:${c.color}">${c.emoji}</div><div class="nm">${id === 'me' ? esc(R.name) + ' (bạn)' : esc(c.name)}</div><div class="mic">🔇</div></div>`;
    }).join('');
    $('#callFrame').hidden = false;
    let sec = 0; $('#callTime').textContent = '00:00';
    clearInterval(callClock);
    callClock = setInterval(() => { sec += 7; $('#callTime').textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`; }, 1000);
  }
  function closeCallFrame() { callMode = null; clearInterval(callClock); $('#callFrame').hidden = true; }

  // ---------- phone ----------
  const phone = createPhone({
    net, charInfo,
    getChat: () => (R ? R.chat : []),
    getName: () => (R ? R.name : ''),
    onReadChat: () => { if (R) { R.unread = 0; updateHUD(); } },
    onOpen: () => { if (mode === 'play' || mode === 'pause') mode = 'phone'; fp.unlock(); $('#pause').hidden = true; },
    onClose: () => { if (mode === 'phone') { mode = 'play'; $('#crosshair').hidden = isTouch; fp.lock(); } },
  });
  function pushChat(list, delayStart = 400) {
    const runId = R.id;
    list.forEach(([from, text, dm], k) => {
      setTimeout(() => {
        if (!R || R.id !== runId) return;
        const m = { from, t: fmt(text), dm: !!dm, time: fmtClock(R.clock) };
        R.chat.push(m); if (R.chat.length > 150) R.chat.shift();
        if (!phone.isOpen || phone.tab !== 'zalo') R.unread++;
        if (from !== 'nar') toast(`💬 <b>${esc(charInfo(from).name)}</b>${dm ? ' (nhắn riêng)' : ''}: ${esc(m.t)}`, 'msg', 3.4);
        sfx.ding();
        $('#phoneBtn').classList.remove('ring'); void $('#phoneBtn').offsetWidth; $('#phoneBtn').classList.add('ring');
        updateHUD(); phone.refresh(); save();
      }, delayStart + k * 1100);
    });
  }

  // ---------- side tasks ----------
  function startSideTasks() {
    const d = day();
    if (!d.sideTasks || !R.tier) { R.tasks = []; return; }
    R.tasks = planTasks({ templates: SIDE_TASKS, count: tier(R.tier).sideTasks, tierId: R.tier, startMin: 9 * 60 + 10, endMin: 17 * 60, seed: hash(R.id) + R.day });
  }
  function taskTick() {
    if (!R || !R.tasks.length) return;
    const { tasks, events } = tick(R.tasks, R.clock);
    R.tasks = tasks;
    for (const e of events) {
      if (e.type === 'spawned') { sfx.ding(); toast(`📋 <b>${esc(charInfo(e.task.from).name)}</b> nhờ: ${esc(e.task.title)}`, 'msg', 3.5); }
      if (e.type === 'late') { applyFx({ uy: -3, rel: { [e.task.from]: -1 } }); toast(`⏰ Trễ việc: ${esc(e.task.title)}`, 'bad', 3); }
    }
    if (events.length) save();
    renderTasks();
  }
  async function handleTaskVisit(target) {
    const { tasks, events } = visit(R.tasks, target);
    if (!events.length) return false;
    R.tasks = tasks;
    for (const e of events) {
      if (e.leg.line) await dialogue.say(e.leg.line[0], e.leg.line[1]);
      if (e.type === 'done') { applyFx({ uy: 2, nl: -2, rel: { [e.task.from]: 1 } }); toast(`✅ Xong việc: ${esc(e.task.title)}`, 'good', 2.5); }
    }
    save(); renderTasks();
    return true;
  }

  // ---------- day intro / end ----------
  const statGrid = () => `<div class="stat-grid"><div><b>${R.st.uy}</b><span>Uy tín</span></div><div><b>${R.st.dr}</b><span>Drama</span></div><div><b>${R.st.nl}</b><span>Năng lượng</span></div></div>`;
  const relChips = () => Object.entries(R.rel).filter(([, v]) => v !== 0).sort((a, b) => b[1] - a[1])
    .map(([id, v]) => `<span>${charInfo(id).emoji} ${esc(charInfo(id).name)} ${v > 0 ? '❤️'.repeat(Math.min(v, 5)) : '💔'.repeat(Math.min(-v, 3))}</span>`).join('');

  function showDayIntro() {
    mode = 'intro'; fp.unlock();
    const d = day();
    $('#hud').hidden = true; $('#taskList').hidden = true;
    overlay(`
      <div class="ov-kicker">${R.day === 0 ? 'BUỔI ĐẦU TIÊN' : `LEVEL ${R.level} · NGÀY ${R.day}`}</div>
      <h2>${esc(d.title)}: ${esc(d.subtitle)}</h2>
      <div class="ov-sub">${esc(COMPANY.name)} · Intern: ${esc(R.name)}${R.tier ? ` · ${TIERS[R.tier].label} (${TIERS[R.tier].name})` : ''}</div>
      <p class="ov-text">${esc(fmt(d.intro))}</p>
      <div class="btns"><button class="btn primary" id="goDay">Bắt đầu →</button></div>
      ${isTouch ? '' : '<div class="help"><div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> đi · chuột nhìn · <kbd>E</kbd> nói chuyện · <kbd>Q</kbd> Teams · <kbd>Esc</kbd> tạm dừng</div></div>'}
    `);
    $('#goDay').onclick = () => { hideOverlay(); startDay(); };
  }
  function startDay() {
    const d = day();
    fp.teleport(PLAYER_START[0], PLAYER_START[1], PLAYER_START[2]);
    if (R.step === 0) {
      R.clock = toMin(d.steps[0].time) - 5;
      startSideTasks();
      if (d.chatStart) pushChat(d.chatStart, 900);
    }
    placeNPCs(true);
    mode = 'play';
    $('#hud').hidden = false; $('#crosshair').hidden = isTouch; $('#mobile').hidden = !isTouch;
    updateHUD(); save(); fp.lock(); maybeScheduleCall(3500);
  }
  function dayEnd() {
    mode = 'overlay'; fp.unlock();
    const d = day();
    const sum = summary(R.tasks);
    const isPrologue = R.day === 0;
    const commit = !!R.flags.tax_commit;
    const wh = R.tier ? withholding(R.tier, commit) : 0;
    const taxNote = wh ? ` · khấu trừ 10%: ${fmtVND(wh)} · thực nhận ${fmtVND(netPay(R.tier, commit))}`
      : R.tier && TIERS[R.tier].salary >= 5_000_000 ? ' · không bị khấu trừ (đã nộp bản cam kết)' : '';
    const pay = R.tier ? `<div class="pct">💰 Phụ cấp: ${fmtVND(TIERS[R.tier].salary)}/tháng${taxNote}</div>` : '';
    R.day += 1; R.step = 0; R.tasks = [];
    R.st.nl = clamp(R.st.nl + 50, 0, 100);
    const next = DAYS[R.day];
    save();
    overlay(`
      <div class="ov-kicker">${isPrologue ? 'HẾT BUỔI PHỎNG VẤN' : '17:45 · HẾT NGÀY'}</div>
      <h2>${esc(d.title)}: xong!</h2>
      <div class="diary">📓 ${esc(d.diary(R))}</div>
      ${pay}
      ${statGrid()}
      ${isPrologue ? '' : `<div class="pct">📋 Việc vặt: ${sum.done} xong · ${sum.late} trễ</div>`}
      <div class="rels">${relChips()}</div>
      <p class="muted">💾 Đã lưu: ${esc(runLabel(R, (t) => TIERS[t].label))}</p>
      <div class="btns">${next ? '<button class="btn primary" id="nextDay">Ngày tiếp theo →</button>' : '<button class="btn primary" id="toMenu">Về menu</button>'}<button class="btn" id="dayPhone">💬 Xem Teams</button></div>
      ${next ? '' : '<p class="menu-note">🚧 Ngày tiếp theo đang được viết. Tiến trình của bạn đã được lưu, quay lại sau là chơi tiếp đúng chỗ này!</p>'}
    `);
    if (next) $('#nextDay').onclick = () => { hideOverlay(); showDayIntro(); };
    else $('#toMenu').onclick = () => { hideOverlay(); showMenu(); };
    $('#dayPhone').onclick = () => phone.open();
  }

  // ---------- interaction ----------
  let currentInteract = null;
  const candidates = () => [
    ...Object.entries(npcs).map(([id, n]) => ({ kind: 'npc', id, pos: n.mesh.position, label: `Nói chuyện với ${CAST[id].name}` })),
    ...world.interactables.map((it) => ({ kind: 'obj', id: it.id, pos: it.pos, label: it.label })),
    { kind: 'npc', id: 'kpi', pos: cat.position, label: 'Vuốt ve Mèo KPI' },
  ];
  const isTargetOf = (step, it) => step && it && ((it.kind === 'npc' && step.who === it.id) || (it.kind === 'obj' && step.who === 'obj:' + it.id));
  const objLines = {
    coffee: [['nar', 'Cà phê gói 3in1. Vị ngọt của sự cam chịu.'], { fx: { nl: 15 } }],
    printer: [['nar', 'Máy in đang nghỉ ngơi. Trên máy dán tờ giấy: "Mật khẩu: hỏi anh Bảo".']],
    desk: [['nar', 'Bàn của bạn. Một laptop, một chậu xương rồng ai đó để lại, và một tờ giấy ghi "Đừng tin chữ FINAL".']],
    okr: [['nar', 'Bảng trắng ghi: "BIG PITCHER 🚀 · Aligment strategry với perfomance". Ở góc dưới, nét chữ của Long: "big PICTURE ạ".']],
    altar: [['nar', 'Bàn thờ Thần Tài đèn nhấp nháy. Có ai đó đặt một gói sticky note màu hồng làm lễ vật.'], { fx: { uy: 1 } }],
    safe: [['nar', 'Két sắt phòng Kế toán. Chị Quỳnh dán giấy: "Muốn hỏi tiền, hỏi chị. Đừng hỏi két."']],
    plant: [['nar', 'Cây kim tiền héo. Thẻ treo: "Phụ trách tưới: (chưa rõ)". Bên dưới, chữ của Thư: "Không phải việc của em, nhưng…"']],
    redchair: [['nar', 'Một chiếc ghế đỏ không ai ngồi. Anh Bảo bảo đó là ghế của Mèo KPI.']],
    interview: [['nar', 'Phòng họp. Trên bảng trắng còn dòng chữ chưa xóa: "Agenda: 1. Excellence. 2. Eventually."']],
  };
  async function interact() {
    if (mode !== 'play' || !currentInteract) return;
    const it = currentInteract;
    const step = currentStep();
    startDialogMode();
    const progressed = await handleTaskVisit(it.kind === 'npc' ? { npc: it.id } : { obj: it.id });
    if (isTargetOf(step, it)) { mode = 'play'; runStep(step); return; }
    if (!progressed) {
      if (it.id === 'kpi') await dialogue.run([['nar', 'Mèo KPI mở một mắt, nhìn bạn như nhìn một slide không có executive summary, rồi ngủ tiếp.'], { fx: { nl: 3 } }]);
      else if (it.kind === 'npc') {
        const lines = IDLE[it.id] || ['…'];
        await dialogue.say(it.id, lines[Math.floor(Math.random() * lines.length)]);
        if (step && step.who !== it.id && !step.who.startsWith('obj:') && !step.who.startsWith('call:')) await dialogue.say('think', `(Việc chính bây giờ: ${fmt(step.obj).toLowerCase()})`);
      } else await dialogue.run(objLines[it.id] || [['nar', '…']]);
    }
    save();
    endDialogMode();
  }

  // ---------- menus ----------
  function showMenu() {
    mode = 'menu'; fp.unlock();
    $('#hud').hidden = true; $('#taskList').hidden = true; $('#mobile').hidden = true; $('#crosshair').hidden = true;
    const runs = listRuns(profile);
    $('#soloRuns').innerHTML = runs.length ? runs.map((r) => {
      const playable = !!DAYS[r.day];
      return `<div class="run-row"><div><b>${esc(r.name)}</b><small>${esc(runLabel(r, (t) => TIERS[t].label))}${playable ? '' : ' · ngày tiếp theo sắp ra mắt'}</small></div>
        <div class="run-btns"><button class="btn primary" data-play="${r.id}" ${playable ? '' : 'disabled'}>${playable ? 'Chơi tiếp' : 'Đợi cập nhật'}</button><button class="btn ghost" data-del="${r.id}" title="Xóa lượt này">🗑</button></div></div>`;
    }).join('') : '<p class="muted">Chưa có lượt chơi nào. Bắt đầu lượt đầu tiên ở dưới nhé!</p>';
    $('#soloRuns').querySelectorAll('[data-play]').forEach((b) => { b.onclick = () => resumeRun(b.dataset.play); });
    $('#soloRuns').querySelectorAll('[data-del]').forEach((b) => { b.onclick = () => { if (confirm('Xóa lượt chơi này? Không lấy lại được.')) { profile = removeRun(profile, b.dataset.del); store.set(PROFILE_KEY, JSON.stringify(profile)); showMenu(); } }; });
    if (!$('#soloName').value && runs[0]) $('#soloName').value = runs[0].name;
    $('#soloNew').textContent = runs.length ? 'Nhảy việc: bắt đầu lượt mới →' : 'Đi phỏng vấn →';
    $('#soloMenu').hidden = false;
    placeNPCs(true);
  }
  function resumeRun(id) {
    unlockAudio();
    R = profile.runs[id];
    if (!R) return;
    profile = { ...profile, activeId: id };
    $('#soloMenu').hidden = true;
    if (R.step === 0) showDayIntro(); else startDay();
  }
  $('#soloNew').onclick = () => {
    const name = clean($('#soloName').value.trim()).slice(0, 16);
    if (!name) { $('#soloName').focus(); $('#soloName').placeholder = 'Nhập tên đã nào!'; return; }
    unlockAudio();
    const run = newRun({ name });
    profile = addRun(profile, run);
    R = profile.runs[run.id];
    save();
    $('#soloMenu').hidden = true;
    showDayIntro();
  };
  $('#soloName').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#soloNew').click(); });
  $('#soloBack').onclick = () => { $('#soloMenu').hidden = true; mode = 'away'; onExit && onExit(); };

  // ---------- controls ----------
  function pause() { if (mode === 'play') { mode = 'pause'; fp.unlock(); $('#pause').hidden = false; $('#crosshair').hidden = true; } }
  function resume() { $('#pause').hidden = true; if (mode === 'pause') { mode = 'play'; $('#crosshair').hidden = isTouch; fp.lock(); } }
  $('#resumeBtn').onclick = resume;
  $('#pause').addEventListener('click', (e) => { if (e.target.id === 'pause') resume(); });
  $('#pausePhone').onclick = () => phone.open(); // the phone takes over from pause; closing it returns to play
  $('#menuBtn').onclick = () => { if (mode === 'pause') resume(); else pause(); };
  const leaveRun = () => { save(); $('#pause').hidden = true; clearTimeout(ringTimer); stopRing(); };
  $('#restartBtn').textContent = '📋 Hồ sơ sự nghiệp (đổi lượt chơi)';
  $('#restartBtn').onclick = () => { leaveRun(); showMenu(); };
  $('#homeBtn').onclick = () => { leaveRun(); showMenu(); $('#soloMenu').hidden = true; mode = 'away'; onExit && onExit(); };
  $('#phoneBtn').onclick = () => { if (mode === 'play' || mode === 'pause') phone.open(); };
  $('#soundBtn').onclick = () => { setSound(!isSoundOn()); $('#soundBtn').textContent = isSoundOn() ? '🔊' : '🔇'; };
  $('#soundBtn').textContent = isSoundOn() ? '🔊' : '🔇';
  $('#incAccept').onclick = acceptCall;
  $('#incDecline').onclick = declineCall;
  $('#actBtn').addEventListener('click', () => interact());
  $('#game').addEventListener('click', () => { if (mode === 'dialog') dialogue.advance(); else if (mode === 'play') fp.lock(); });
  if (isTouch) $('#game').addEventListener('touchstart', () => { if (mode === 'dialog') dialogue.advance(); }, { passive: true });

  input.onKey((e, { inField }) => {
    if (inField) { if (e.key === 'Escape' && phone.isOpen) phone.close(); return; }
    if (mode === 'ringing') {
      if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); acceptCall(); }
      if (e.code === 'Escape' || e.code === 'KeyX') declineCall();
      return;
    }
    if (mode === 'dialog') {
      if (e.repeat) return;
      if (/^Digit[1-4]$/.test(e.code) && dialogue.pickChoice(Number(e.code.slice(5)) - 1)) return;
      if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter' || e.code === 'KeyF') { e.preventDefault(); dialogue.advance(); }
      return;
    }
    if (mode === 'play') {
      if (e.code === 'KeyE' || e.code === 'KeyF') interact();
      if (e.code === 'KeyQ' || e.code === 'Tab') { e.preventDefault(); phone.open(); }
    } else if (mode === 'pause' && e.code === 'Escape') resume();
    else if (phone.isOpen && (e.code === 'KeyQ' || e.code === 'Escape' || e.code === 'Tab')) { e.preventDefault(); phone.close(); }
  });

  // ---------- per-frame ----------
  let elapsed = 0, clockAcc = 0, taskAcc = 0;
  function update(dt) {
    elapsed += dt;
    world.update(elapsed);
    const step = R ? currentStep() : null;

    // game clock only runs while you are free to walk
    if (mode === 'play' && R) {
      clockAcc += dt * CLOCK_RATE;
      if (clockAcc >= 1) { R.clock += Math.floor(clockAcc); clockAcc -= Math.floor(clockAcc); $('#hudTime').textContent = fmtClock(R.clock); }
      taskAcc += dt;
      if (taskAcc > 1) { taskAcc = 0; taskTick(); }
    }

    const others = Object.values(npcs).map((n) => n.mesh.position);
    fp.update(dt, { colliders: world.colliders, others, bounds: BOUNDS, canMove: mode === 'play', idleSpin: mode === 'menu' });

    for (const [id, n] of Object.entries(npcs)) {
      const m = n.mesh, parts = m.userData.parts;
      const dx = n.target.x - m.position.x, dz = n.target.z - m.position.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.05) {
        const s = Math.min(d, 1.6 * dt);
        m.position.x += dx / d * s; m.position.z += dz / d * s;
        m.rotation.y = angleLerp(m.rotation.y, Math.atan2(dx, dz), 0.2);
        n.walk += dt * 8;
        parts.legL.rotation.x = Math.sin(n.walk) * 0.5; parts.legR.rotation.x = -Math.sin(n.walk) * 0.5;
        parts.armL.rotation.x = -Math.sin(n.walk) * 0.4; parts.armR.rotation.x = Math.sin(n.walk) * 0.4;
      } else {
        parts.legL.rotation.x *= 0.8; parts.legR.rotation.x *= 0.8;
        const pdx = player.pos.x - m.position.x, pdz = player.pos.z - m.position.z;
        const near = Math.hypot(pdx, pdz) < 2.2 && mode !== 'menu';
        m.rotation.y = angleLerp(m.rotation.y, (n.talking || near) ? Math.atan2(pdx, pdz) : n.rest, n.talking ? 0.15 : 0.05);
        if (n.talking && dialogue.isTyping) { parts.armR.rotation.x = -0.6 + Math.sin(elapsed * 9) * 0.25; parts.armR.rotation.z = 0.2; }
        else { parts.armR.rotation.x *= 0.85; parts.armR.rotation.z *= 0.85; parts.armL.rotation.x *= 0.85; }
      }
      parts.torso.scale.y = 1 + Math.sin(elapsed * 2 + n.phase) * 0.012;
      parts.head.rotation.y = Math.sin(elapsed * 0.6 + n.phase) * 0.15;
      const taskTarget = R && active(R.tasks).some((t) => currentLeg(t).npc === id);
      if (n.tag) n.tag.visible = m.position.distanceTo(player.pos) < 9 || (step && step.who === id) || taskTarget;
      const isTarget = ((step && step.who === id) || taskTarget) && mode !== 'dialog' && mode !== 'menu';
      n.marker.visible = !!isTarget;
      if (isTarget) {
        n.marker.material.color.set(step && step.who === id ? '#ffd25a' : '#8fd6ff');
        n.marker.position.y = 2.05 + Math.sin(elapsed * 3) * 0.06; n.marker.rotation.y += dt * 2;
      }
    }
    if (step && step.who.startsWith('obj:') && mode !== 'dialog') {
      const it = world.interactables.find((x) => 'obj:' + x.id === step.who);
      objMarker.visible = !!it;
      if (it) { objMarker.position.set(it.pos.x, it.pos.y + 0.75 + Math.sin(elapsed * 3) * 0.06, it.pos.z); objMarker.rotation.y += dt * 2; }
    } else objMarker.visible = false;

    // Mèo KPI: walk the loop, nap at each stop
    if (catState.nap > 0) catState.nap -= dt;
    else {
      const [tx, tz] = CAT_PATH[(catState.i + 1) % CAT_PATH.length];
      const dx = tx - cat.position.x, dz = tz - cat.position.z, d = Math.hypot(dx, dz);
      if (d < 0.1) { catState.i = (catState.i + 1) % CAT_PATH.length; catState.nap = 5 + Math.random() * 10; }
      else { const s = Math.min(d, 0.7 * dt); cat.position.x += dx / d * s; cat.position.z += dz / d * s; cat.rotation.y = angleLerp(cat.rotation.y, Math.atan2(dx, dz) - Math.PI / 2, 0.2); }
    }
    cat.userData.tail.rotation.z = -0.3 + Math.sin(elapsed * 2.5) * 0.3;

    if (mode === 'play') {
      currentInteract = fp.pick(candidates());
      const pr = $('#prompt');
      if (currentInteract) {
        const isT = isTargetOf(step, currentInteract);
        pr.hidden = false; pr.classList.toggle('target', !!isT);
        $('#promptText').textContent = (isT ? '⭐ ' : '') + currentInteract.label;
        $('#prompt kbd').hidden = isTouch;
      } else pr.hidden = true;
      if (isTouch) $('#actBtn').hidden = !currentInteract;
    }
    if (step && R && (mode === 'play' || mode === 'pause')) {
      if (step.who.startsWith('call:')) { $('#objArrow').style.transform = 'rotate(0deg)'; $('#objArrow').textContent = '📞'; $('#objDist').textContent = '· Teams'; }
      else {
        $('#objArrow').textContent = '➤';
        let tp = null;
        if (step.who.startsWith('obj:')) { const it = world.interactables.find((x) => 'obj:' + x.id === step.who); if (it) tp = it.pos; }
        else if (npcs[step.who]) tp = npcs[step.who].mesh.position;
        if (tp) { const a = fp.arrowTo(tp); $('#objArrow').style.transform = `rotate(${a.deg}deg)`; $('#objDist').textContent = `· ${Math.round(a.dist)}m`; }
      }
    }
  }

  window.__tm = {
    get R() { return R; }, get mode() { return mode; }, get profile() { return profile; },
    fp, npcs, currentStep, interact, world, cat, place: (i) => placeNPCs(i),
  };
  void PLAYER_DESK;
  placeNPCs(true);
  showMenu();
  return { update, showMenu };
}
