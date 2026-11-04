// LEGACY MODE: the original "Ba Mẹ & Partners" 5-day story, ported onto the shared modules
// (elevated camera, shared dialogue engine, phone, physics). Hidden from the menu; open with ?legacy=1.
import * as THREE from 'three';
import { $, clamp, esc, angleLerp, store } from '../core/util.js';
import { sfx, tone, unlockAudio, isSoundOn, setSound } from '../core/audio.js';
import { isTouch } from '../core/input.js';
import { moveActor } from '../core/physics.js';
import { makePerson, nameTag, makeMarker } from '../art/people.js';
import { buildWorld, SPOTS, PLAYER_START, MEETING_SEAT } from '../maps/legacy-office.js';
import { CHARS, DAYS, DEFAULT_POS, IDLE, FORTUNES, MEETING, ENDINGS, computeEnding } from '../story/legacy/ba-me-partners.js';
import { createDialogue } from '../story/dialogue.js';
import { createPhone } from '../ui/phone.js';
import { toast } from '../ui/toast.js';
import { overlay, hideOverlay } from '../ui/overlay.js';
import { net, clean } from '../net/legacy-net.js';

const SAVE_KEY = 'tts_save_v1';
const BOUNDS = { minX: -14.7, maxX: 14.7, minZ: -9.7, maxZ: 9.85 };

export function startLegacy({ scene, rig, input }) {
  let S = null;
  let mode = 'title'; // title | intro | play | dialog | phone | overlay | pause | ringing
  const newState = (name) => ({ v: 1, name, day: 0, step: 0, st: { uy: 50, dr: 0, nl: 100 }, rel: {}, flags: {}, chat: [], unread: 0, altar: {}, coffee: {}, desk: {}, done: false });
  const save = () => { if (S) store.set(SAVE_KEY, JSON.stringify(S)); };
  const loadSave = () => { const s = store.json(SAVE_KEY); return s && s.v === 1 ? s : null; };
  const unlockedEndings = () => store.json('tts_endings', []);
  const fmt = (t) => String(t).replaceAll('{ten}', S ? S.name : 'bạn');

  // ---------- world ----------
  const world = buildWorld(scene);
  const npcs = {};
  for (const [id, def] of Object.entries(CHARS)) {
    if (def.noBody) continue;
    const mesh = makePerson(def);
    const tag = nameTag(def.name, def.role.split('·')[0].trim(), { color: def.color });
    mesh.add(tag);
    const marker = makeMarker();
    marker.position.y = 2.35; marker.visible = false;
    mesh.add(marker);
    scene.add(mesh);
    npcs[id] = { mesh, tag, marker, target: new THREE.Vector3(), rest: 0, walk: 0, phase: Math.random() * 6, talking: false };
  }
  const objMarker = makeMarker();
  objMarker.visible = false;
  scene.add(objMarker);

  // the player is now visible (elevated camera)
  const player = { pos: new THREE.Vector3(PLAYER_START[0], 0, PLAYER_START[1]), face: Math.PI, walk: 0, mesh: null, tag: null };
  player.mesh = makePerson({ shirt: '#fff1b8', pants: '#6b7a99', hair: 'short', hairColor: '#1d1d1f' });
  scene.add(player.mesh);
  function setPlayerTag(name) {
    if (player.tag) player.mesh.remove(player.tag);
    player.tag = nameTag(name || 'Bạn', 'bạn', { color: '#fff1b8' });
    player.mesh.add(player.tag);
  }
  setPlayerTag('Bạn');

  // ---------- HUD ----------
  function charInfo(id) {
    if (id === 'me') return { name: S.name, role: 'Thực tập sinh (bạn)', emoji: '🙂', color: '#bfe3ff' };
    if (id === 'think') return { name: S.name, role: 'nghĩ thầm…', emoji: '💭', color: '#e3d9ff' };
    if (id === 'nar') return { name: '', role: '', emoji: '📖', color: '#fff1b8' };
    return CHARS[id] || { name: id, role: '', emoji: '❔', color: '#777' };
  }
  function updateHUD() {
    if (!S) return;
    const day = DAYS[S.day];
    $('#hudDay').textContent = `Ngày ${S.day + 1}/5 · ${day.title}`;
    $('#barUy').style.width = S.st.uy + '%';
    $('#barDr').style.width = S.st.dr + '%';
    $('#barNl').style.width = S.st.nl + '%';
    const step = currentStep();
    $('#hudTime').textContent = step ? step.time : '17:30';
    $('#phoneClock').textContent = step ? step.time : '17:30';
    $('#objText').textContent = step ? fmt(step.obj) : 'Hết giờ làm!';
    const b = $('#badge');
    b.hidden = !S.unread; b.textContent = S.unread > 9 ? '9+' : S.unread;
  }

  function applyFx(fx) {
    if (!fx) return;
    const lbl = { uy: 'Uy tín', dr: 'Drama', nl: 'Năng lượng' };
    for (const k of ['uy', 'dr', 'nl']) {
      if (!fx[k]) continue;
      const before = S.st[k];
      S.st[k] = clamp(S.st[k] + fx[k], 0, 100);
      const d = S.st[k] - before;
      if (!d) continue;
      toast(`${d > 0 ? '▲' : '▼'} ${lbl[k]} ${d > 0 ? '+' : ''}${d}`, k === 'dr' ? 'drama' : d > 0 ? 'good' : 'bad', 2);
    }
    if (fx.rel) for (const [id, n] of Object.entries(fx.rel)) {
      S.rel[id] = (S.rel[id] || 0) + n;
      toast(`${n > 0 ? '❤️' : '💔'} ${CHARS[id].name} ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'good' : 'bad', 2);
    }
    if (fx.set) Object.assign(S.flags, fx.set);
    updateHUD();
  }

  async function voteToast(id, idx) {
    const rows = await net.vote(id, idx);
    if (!rows || !rows.length) return;
    const total = rows.reduce((a, r) => a + Number(r.n), 0);
    const mine = Number((rows.find((r) => r.option_idx === idx) || {}).n || 0);
    if (total <= 1) toast('📊 Bạn là người chơi đầu tiên chọn như vậy!', 'stat', 3);
    else toast(`📊 ${Math.round((mine / total) * 100)}% người chơi cũng chọn như bạn`, 'stat', 3);
  }

  // ---------- dialogue ----------
  let callMode = null;
  const dialogue = createDialogue({
    charInfo, fmt, applyFx,
    getState: () => S,
    pushChat: (list) => pushChat(list),
    onChoice: (id, i) => voteToast(id, i),
    onSpeaker(spk) {
      if (callMode) {
        document.querySelectorAll('#callTiles .tile').forEach((t) => t.classList.toggle('speaking', t.dataset.id === spk || (spk === 'think' && t.dataset.id === 'me')));
      } else if (npcs[spk] && npcs[spk].mesh.position.distanceTo(player.pos) < 10) {
        rig.focus = npcs[spk].mesh.position;
        npcs[spk].talking = true;
      }
    },
  });

  function startDialogMode() {
    mode = 'dialog';
    $('#prompt').hidden = true;
    $('#actBtn').hidden = true;
    $('#mobile').hidden = true;
  }
  function endDialogMode() {
    dialogue.hide();
    rig.focus = null;
    Object.values(npcs).forEach((n) => { n.talking = false; });
    if (mode === 'dialog') { mode = 'play'; $('#mobile').hidden = !isTouch; }
  }

  // ---------- story flow ----------
  function currentStep() {
    if (!S) return null;
    const day = DAYS[S.day];
    while (day.steps[S.step] && day.steps[S.step].when && !day.steps[S.step].when(S)) S.step++;
    return day.steps[S.step] || null;
  }
  function altarScene() {
    const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    return [['nar', 'Bạn thắp ba nén hương, vái ba vái. Ông Địa cười tươi rói. Thần Tài nhìn bạn như biết bạn chưa đóng tiền cơm.'], ['nar', f], { fx: { uy: 2 } }];
  }
  const SLEEP_SCENE = [
    ['nar', 'Mắt bạn díp lại. Bạn gục xuống bàn phím. Màn hình hiện: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"'],
    ['hung', 'Ngủ trưa là tốt. Nhưng ngủ lúc ba giờ chiều là… mất lộc.'],
    ['think', 'Lần sau nhớ ghé pantry pha cà phê.'],
    { fx: { uy: -5, nl: 45 } },
  ];

  async function runStep(step) {
    startDialogMode();
    if (step.who === 'obj:seat') {
      player.pos.set(MEETING_SEAT[0], 0, MEETING_SEAT[1] + 0.35);
      player.face = Math.PI;
    }
    if (step.call) openCallFrame(step.call);
    const nodes = step.scene === 'altar' ? altarScene() : step.scene === 'meeting' ? MEETING : step.scene;
    await dialogue.run(nodes);
    if (step.call) closeCallFrame();
    if (step.who === 'obj:altar') S.altar[S.day] = true;
    S.step++;
    if (step.scene !== 'meeting') {
      applyFx({ nl: -8 });
      if (S.st.nl <= 0) await dialogue.run(SLEEP_SCENE);
    }
    save();
    endDialogMode();
    if (step.scene === 'meeting') { finishGame(); return; }
    if (!currentStep()) { dayEnd(); return; }
    onStepStart();
  }
  function onStepStart() { placeNPCs(false); updateHUD(); save(); maybeScheduleCall(); }

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
    mode = 'ringing';
    $('#prompt').hidden = true; $('#mobile').hidden = true;
    $('#incAvatar').textContent = caller.emoji;
    $('#incAvatar').style.background = caller.color;
    $('#incName').textContent = caller.name;
    $('#incTitle').textContent = step.call.title;
    $('#incoming').hidden = false;
    sfx.ring(); clearInterval(ringLoop); ringLoop = setInterval(() => sfx.ring(), 1600);
  }
  function stopRing() { clearInterval(ringLoop); ringLoop = null; $('#incoming').hidden = true; }
  function acceptCall() {
    const step = currentStep();
    stopRing();
    mode = 'play';
    if (step && step.who.startsWith('call:')) runStep(step);
  }
  function declineCall() {
    stopRing();
    mode = 'play';
    $('#mobile').hidden = !isTouch;
    applyFx({ uy: -2 });
    toast('📵 Bạn từ chối cuộc gọi. Họ sẽ gọi lại… và nhớ chuyện này.', 'bad', 3);
    maybeScheduleCall(9000);
  }
  function openCallFrame(call) {
    callMode = call;
    $('#callTitle').textContent = call.title;
    $('#callTiles').innerHTML = call.people.map((id) => {
      const c = charInfo(id);
      const label = id === 'me' ? `${esc(S.name)} (bạn)` : esc(c.name);
      return `<div class="tile" data-id="${id}"><div class="av" style="background:${c.color}">${c.emoji}</div><div class="nm">${label}</div><div class="mic">${id === 'mai' ? '🎙️' : '🔇'}</div></div>`;
    }).join('');
    $('#callFrame').hidden = false;
    let sec = 0; $('#callTime').textContent = '00:00';
    clearInterval(callClock);
    callClock = setInterval(() => { sec += 7; $('#callTime').textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`; }, 1000);
  }
  function closeCallFrame() { callMode = null; clearInterval(callClock); $('#callFrame').hidden = true; }

  function spotFor(id) {
    const day = DAYS[S.day];
    const step = currentStep();
    return (step && step.pos && step.pos[id]) || (day.pos && day.pos[id]) || DEFAULT_POS[id];
  }
  function placeNPCs(instant) {
    for (const id of Object.keys(npcs)) {
      const sp = SPOTS[spotFor(id)];
      const n = npcs[id];
      n.target.set(sp[0], 0, sp[1]);
      n.rest = sp[2];
      if (instant) { n.mesh.position.copy(n.target); n.mesh.rotation.y = sp[2]; }
    }
  }

  // ---------- phone ----------
  const phone = createPhone({
    net, charInfo,
    getChat: () => (S ? S.chat : []),
    getName: () => (S ? S.name : ''),
    onReadChat: () => { if (S) { S.unread = 0; updateHUD(); } },
    onOpen: () => { if (mode === 'play' || mode === 'pause') mode = 'phone'; $('#pause').hidden = true; },
    onClose: () => { if (mode === 'phone') mode = 'play'; },
  });
  function pushChat(list, delayStart = 400) {
    list.forEach(([from, text, dm], k) => {
      setTimeout(() => {
        const step = currentStep();
        const m = { from, t: fmt(text), dm: !!dm, time: step ? step.time : '17:30' };
        S.chat.push(m);
        if (S.chat.length > 120) S.chat.shift();
        if (!phone.isOpen || phone.tab !== 'zalo') S.unread++;
        if (from !== 'nar') toast(`📱 <b>${esc(charInfo(from).name)}</b>${dm ? ' (nhắn riêng)' : ''}: ${esc(m.t)}`, 'msg', 3.4);
        sfx.ding();
        $('#phoneBtn').classList.remove('ring'); void $('#phoneBtn').offsetWidth; $('#phoneBtn').classList.add('ring');
        updateHUD();
        phone.refresh();
        save();
      }, delayStart + k * 1100);
    });
  }

  // ---------- overlays ----------
  const relChips = () => Object.entries(S.rel).filter(([, v]) => v !== 0).sort((a, b) => b[1] - a[1])
    .map(([id, v]) => `<span>${CHARS[id].emoji} ${esc(CHARS[id].name)} ${v > 0 ? '❤️'.repeat(Math.min(v, 5)) : '💔'.repeat(Math.min(-v, 3))}</span>`).join('');
  const statGrid = () => `<div class="stat-grid"><div><b>${S.st.uy}</b><span>Uy tín</span></div><div><b>${S.st.dr}</b><span>Drama</span></div><div><b>${S.st.nl}</b><span>Năng lượng</span></div></div>`;

  function showDayIntro() {
    mode = 'intro';
    const d = DAYS[S.day];
    $('#hud').hidden = true;
    overlay(`
      <div class="ov-kicker">NGÀY ${S.day + 1} / 5</div>
      <h2>${d.title}: ${d.subtitle}</h2>
      <div class="ov-sub">Thực tập sinh: ${esc(S.name)}</div>
      <p class="ov-text">${esc(fmt(d.intro))}</p>
      <div class="btns"><button class="btn primary" id="goDay">${S.day === 4 ? 'Bước vào phòng họp →' : 'Vào làm →'}</button></div>
      ${isTouch ? '' : '<div class="help"><div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> đi · <kbd>Shift</kbd> chạy · <kbd>E</kbd> nói chuyện · <kbd>Q</kbd> Teams · <kbd>Esc</kbd> tạm dừng</div></div>'}
    `);
    $('#goDay').onclick = () => { hideOverlay(); startDay(); };
  }
  function startDay() {
    const d = DAYS[S.day];
    player.pos.set(PLAYER_START[0], 0, PLAYER_START[1]);
    player.face = Math.PI;
    if (S.step === 0) S.coffee[S.day] = 0;
    placeNPCs(true);
    if (S.step === 0 && d.chatStart) pushChat(d.chatStart, 900);
    mode = 'play';
    $('#hud').hidden = false;
    $('#mobile').hidden = !isTouch;
    updateHUD();
    save();
    rig.target.copy(player.pos); rig.snap();
    maybeScheduleCall(3500);
  }
  function dayEnd() {
    mode = 'overlay';
    const d = DAYS[S.day];
    overlay(`
      <div class="ov-kicker">17:30 · TAN LÀM</div>
      <h2>Hết ngày ${S.day + 1}: ${d.title}</h2>
      <div class="diary">📓 ${esc(d.diary(S))}</div>
      ${statGrid()}
      <div class="rels">${relChips()}</div>
      <div class="btns"><button class="btn primary" id="nextDay">Ngày tiếp theo →</button><button class="btn" id="dayPhone">💬 Xem Teams</button></div>
    `);
    S.st.nl = clamp(S.st.nl + 60, 0, 100);
    $('#nextDay').onclick = () => { S.day++; S.step = 0; save(); hideOverlay(); showDayIntro(); };
    $('#dayPhone').onclick = () => phone.open();
  }
  async function finishGame() {
    mode = 'overlay';
    const key = computeEnding(S);
    const E = ENDINGS[key];
    S.done = true; S.ending = key; save();
    const got = unlockedEndings();
    if (!got.includes(key)) { got.push(key); store.set('tts_endings', JSON.stringify(got)); }
    sfx.good();
    const list = Object.entries(ENDINGS).map(([k, e]) => got.includes(k) ? `<div>${e.emoji} ${esc(e.title)}</div>` : '<div class="locked">🔒 ???</div>').join('');
    overlay(`
      <div class="ending-emoji">${E.emoji}</div>
      <div class="ov-kicker">HẾT CHƯƠNG: CÔNG TY #1 · ${got.length}/${Object.keys(ENDINGS).length} KẾT THÚC ĐÃ MỞ</div>
      <h2>${esc(E.title)}</h2>
      <p class="ov-text">${esc(fmt(E.text(S)))}</p>
      <div class="next-card"><div class="next-k">CHƯƠNG TIẾP THEO · COMING SOON</div><div>${esc(E.next)}</div></div>
      <div class="pct" id="endPct">📊 Đang đếm xem bao nhiêu người chơi có cùng kết thúc…</div>
      ${statGrid()}
      <div class="rels">${relChips()}</div>
      <div class="endings-list">${list}</div>
      <div class="btns"><button class="btn primary" id="againBtn">Chơi lại công ty này, chọn khác đi 🔁</button><button class="btn" id="endPhone">👻 Hội Intern ẩn danh</button></div>
    `);
    $('#againBtn').onclick = () => { const name = S.name; S = newState(name); save(); hideOverlay(); showDayIntro(); };
    $('#endPhone').onclick = () => phone.open('tts');
    const rows = await net.vote('ending', E.idx);
    if (rows && rows.length) {
      const total = rows.reduce((a, r) => a + Number(r.n), 0);
      const mine = Number((rows.find((r) => r.option_idx === E.idx) || {}).n || 0);
      $('#endPct').textContent = `📊 ${Math.round(mine / total * 100)}% trong ${total} lượt chơi có cùng kết thúc này`;
    } else $('#endPct').textContent = '📊 (Không kết nối được máy chủ thống kê)';
  }

  // ---------- interaction ----------
  let currentInteract = null;
  function findInteract() {
    const fx = Math.sin(player.face), fz = Math.cos(player.face);
    let best = null, bestScore = Infinity;
    const consider = (kind, id, pos, label) => {
      const dx = pos.x - player.pos.x, dz = pos.z - player.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > 1.9) return;
      const dot = d > 0.001 ? (dx * fx + dz * fz) / d : 1;
      const score = d * (1.6 - 0.6 * dot);
      if (score < bestScore) { bestScore = score; best = { kind, id, label }; }
    };
    for (const [id, n] of Object.entries(npcs)) consider('npc', id, n.mesh.position, `Nói chuyện với ${CHARS[id].name}`);
    for (const it of world.interactables) consider('obj', it.id, it.pos, it.label);
    return best;
  }
  const isTargetOf = (step, it) => step && it && ((it.kind === 'npc' && step.who === it.id) || (it.kind === 'obj' && step.who === 'obj:' + it.id));

  async function interact() {
    if (mode !== 'play' || !currentInteract) return;
    const it = currentInteract;
    const step = currentStep();
    if (isTargetOf(step, it)) { runStep(step); return; }
    startDialogMode();
    if (it.kind === 'npc') {
      const lines = IDLE[it.id];
      await dialogue.say(it.id, lines[Math.floor(Math.random() * lines.length)]);
      if (step && step.who !== it.id && !step.who.startsWith('obj:')) await dialogue.say('think', `(Việc cần làm bây giờ: ${fmt(step.obj).toLowerCase()})`);
    } else {
      await dialogue.run(objectScene(it.id));
    }
    save();
    endDialogMode();
  }
  function objectScene(id) {
    switch (id) {
      case 'altar':
        if (S.altar[S.day]) return [['nar', 'Bạn đã thắp hương hôm nay rồi. Thần Tài cũng cần không gian riêng.']];
        S.altar[S.day] = true;
        return altarScene();
      case 'coffee': {
        S.coffee[S.day] = (S.coffee[S.day] || 0) + 1;
        const c = S.coffee[S.day];
        if (c > 3) return [['nar', `Ly cà phê gói thứ ${c} trong ngày. Tim bạn đập theo nhịp nhạc EDM.`], { fx: { nl: 10, dr: 2 } }];
        return [['nar', ['Cà phê gói 3in1. Vị ngọt của sự cam chịu.', 'Bạn pha một ly cà phê gói. Cô Tư nhìn bạn: "Uống ít thôi con, đường nhiều lắm."', 'Máy pha cà phê kêu như máy cày. Nhưng nó chạy.'][c - 1] || 'Cà phê gói.'], { fx: { nl: 25 } }];
      }
      case 'desk':
        if (S.desk[S.day]) return [['nar', 'Laptop của bạn hết pin rồi. Mười một phút, đúng như anh Khoa nói.']];
        S.desk[S.day] = true;
        return [['nar', 'Bạn mở laptop. Bạn làm việc cực kỳ chăm chỉ được chín phút trước khi máy báo pin yếu.'], ['think', 'Ít nhất thì bác Hùng đi ngang qua và thấy mình đang gõ phím.'], { fx: { uy: 2, nl: -4 } }];
      case 'printer':
        return [['nar', 'Máy in kẹt giấy. Như mọi khi. Bạn vỗ nhẹ vào hông nó hai cái.'], ['nar', 'Nó chạy. Bạn vừa học được kỹ năng IT quan trọng nhất của văn phòng này.']];
      case 'safe':
        return [['nar', 'Két sắt hiệu "Việt Tiệp 1998". Dán một lá bùa đỏ chữ "Phát". Có vẻ lá bùa không chống trộm được.'], S.day >= 1 ? ['think', 'Năm mươi triệu… ai mà dám nhỉ?'] : ['think', 'Chắc trong này nhiều tiền lắm.']];
      case 'plant':
        return [['nar', 'Cây kim tiền héo vàng. Có một tờ giấy nhớ dán trên chậu: "ĐỪNG TƯỚI NỮA — Khoa".'], ['think', 'Hóa ra không phải do năng lượng xấu. Là do tưới quá nhiều.']];
      case 'okr':
        return [['nar', 'Bảng trắng ghi: "OKR Q4: 10X REVENUE. Agile Transformation. Innovation Lab???". Ở góc dưới có ai đó viết thêm bằng bút đỏ: "Bố: để mẹ con quyết".']];
      case 'redchair':
        return [['nar', 'Chiếc ghế nhựa đỏ duy nhất trong pantry. Không ai ngồi. Không ai dám.'], ['tu', '(từ xa) Đừng có nghĩ tới chuyện đó nha con.']];
      case 'seat':
        return [['nar', 'Phòng họp trống. Trên bàn có một vết trà khô hình… châu Úc.']];
      default:
        return [['nar', '…']];
    }
  }

  // ---------- multiplayer ghosts (decorative presence, legacy) ----------
  const ghosts = {};
  let lastSent = 0, lastSentPos = { x: 0, z: 0, r: 0 };
  function ghostFor(id, name) {
    if (ghosts[id]) return ghosts[id];
    const palette = ['#6aa0ff', '#ff8fb1', '#7bd389', '#ffb35c', '#b48cff'];
    const col = palette[Math.abs([...id].reduce((a, c) => a + c.charCodeAt(0), 0)) % palette.length];
    const mesh = makePerson({ shirt: col, pants: '#3a3f55', hair: 'short', hairColor: '#2a2a2a' }, { ghost: true });
    const tag = nameTag('Intern ' + (name || '???'), 'người chơi khác', { ghost: true });
    mesh.add(tag);
    scene.add(mesh);
    ghosts[id] = { mesh, tag, target: new THREE.Vector3(), rot: 0, seen: performance.now(), name };
    return ghosts[id];
  }
  function removeGhost(id) { const g = ghosts[id]; if (!g) return; scene.remove(g.mesh); delete ghosts[id]; }
  function setOnline(n) {
    const c = Math.max(1, n);
    $('#online').textContent = `👥 ${c}`;
    $('#titleOnline').textContent = `👥 ${c} người đang ở văn phòng`;
  }
  net.joinOffice(null, {
    onPeers(peers) { setOnline(Object.keys(peers).length); for (const id of Object.keys(ghosts)) if (!peers[id]) removeGhost(id); },
    onPos(p) {
      if (!S || mode === 'title') return;
      const g = ghostFor(p.id, clean(p.n || ''));
      if (p.n && p.n !== g.name) { g.mesh.remove(g.tag); g.tag = nameTag('Intern ' + clean(p.n), 'người chơi khác', { ghost: true }); g.mesh.add(g.tag); g.name = p.n; }
      if (!g.mesh.visible || g.mesh.position.lengthSq() === 0) g.mesh.position.set(p.x, 0, p.z);
      g.target.set(p.x, 0, p.z); g.rot = p.r; g.seen = performance.now(); g.mesh.visible = true;
    },
    onLeave(id) { removeGhost(id); },
  });
  if (!net.ok) $('#titleOnline').textContent = '👥 chế độ ngoại tuyến';

  // ---------- controls ----------
  const pause = () => { if (mode === 'play') { mode = 'pause'; $('#pause').hidden = false; } };
  const resume = () => { $('#pause').hidden = true; if (mode === 'pause') mode = 'play'; };
  $('#resumeBtn').onclick = resume;
  $('#pause').addEventListener('click', (e) => { if (e.target.id === 'pause') resume(); });
  $('#pausePhone').onclick = () => { resume(); phone.open(); };
  $('#menuBtn').onclick = pause;
  $('#restartBtn').onclick = () => {
    if (!confirm('Chơi lại từ đầu? Tiến trình hiện tại sẽ mất.')) return;
    const name = S ? S.name : '';
    S = newState(name); save();
    $('#pause').hidden = true; showDayIntro();
  };
  $('#phoneBtn').onclick = () => { if (mode === 'play' || mode === 'pause') phone.open(); };
  $('#soundBtn').onclick = () => { setSound(!isSoundOn()); $('#soundBtn').textContent = isSoundOn() ? '🔊' : '🔇'; };
  $('#soundBtn').textContent = isSoundOn() ? '🔊' : '🔇';
  $('#incAccept').onclick = acceptCall;
  $('#incDecline').onclick = declineCall;
  $('#actBtn').addEventListener('click', () => interact());
  document.addEventListener('pointerdown', (e) => {
    // tap anywhere (outside UI) advances dialogue
    if (mode === 'dialog' && e.target === $('#game')) dialogue.advance();
  });

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
      if (e.code === 'Escape') pause();
    } else if (mode === 'pause' && e.code === 'Escape') resume();
    else if (phone.isOpen && (e.code === 'KeyQ' || e.code === 'Escape' || e.code === 'Tab')) { e.preventDefault(); phone.close(); }
  });

  // ---------- title ----------
  function refreshTitle() {
    const sv = loadSave();
    const cont = $('#continueBtn');
    if (sv && !sv.done) { cont.hidden = false; cont.textContent = `Tiếp tục: Ngày ${sv.day + 1} (${DAYS[sv.day].title})`; }
    if (sv) { $('#nameInput').value = sv.name; $('#badgeName').textContent = sv.name; }
    const got = unlockedEndings();
    $('#titleEndings').textContent = got.length ? `🏁 Đã mở ${got.length}/${Object.keys(ENDINGS).length} kết thúc` : '';
  }
  $('#nameInput').addEventListener('input', (e) => { $('#badgeName').textContent = e.target.value.trim() || 'INTERN'; });
  $('#nameInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#startBtn').click(); });
  $('#startBtn').onclick = () => {
    const name = clean($('#nameInput').value.trim()).slice(0, 16);
    if (!name) { $('#nameInput').focus(); $('#nameInput').placeholder = 'Nhập tên đã nào!'; return; }
    unlockAudio();
    S = newState(name); save();
    net.setName(name); setPlayerTag(name);
    $('#title').hidden = true;
    showDayIntro();
  };
  $('#continueBtn').onclick = () => {
    unlockAudio();
    S = loadSave();
    net.setName(S.name); setPlayerTag(S.name);
    $('#title').hidden = true;
    if (S.step === 0) showDayIntro(); else startDay();
  };

  // initial layout: NPCs at day-1 spots behind the title screen
  S = loadSave() || newState('');
  placeNPCs(true);
  S = null;
  $('#title').hidden = false;
  refreshTitle();
  if (!isTouch) setTimeout(() => $('#nameInput').focus(), 100);
  rig.bounds = { minX: -11, maxX: 11, minZ: -7.5, maxZ: 5.5 };
  rig.target.set(0, 0, 0); rig.zoom = 1.5; rig.snap();

  // ---------- per-frame ----------
  let elapsed = 0;
  function update(dt) {
    elapsed += dt;
    world.update(elapsed);
    const step = S ? currentStep() : null;

    // player movement (screen-relative: up = north = -z)
    const ax = mode === 'play' ? input.axis() : { x: 0, y: 0 };
    const moving = Math.hypot(ax.x, ax.y) > 0.05;
    if (moving) {
      const speed = (input.running() ? 5.4 : 3.4);
      const others = Object.values(npcs).map((n) => n.mesh.position);
      moveActor(player.pos, ax.x * speed * dt, -ax.y * speed * dt, { colliders: world.colliders, others, bounds: BOUNDS });
      player.face = angleLerp(player.face, Math.atan2(ax.x, -ax.y), 0.3);
      player.walk += dt * 10;
    }
    const pp = player.mesh.userData.parts;
    player.mesh.position.copy(player.pos);
    player.mesh.rotation.y = player.face;
    pp.legL.rotation.x = moving ? Math.sin(player.walk) * 0.6 : pp.legL.rotation.x * 0.8;
    pp.legR.rotation.x = moving ? -Math.sin(player.walk) * 0.6 : pp.legR.rotation.x * 0.8;
    pp.armL.rotation.x = moving ? -Math.sin(player.walk) * 0.5 : pp.armL.rotation.x * 0.8;
    pp.armR.rotation.x = moving ? Math.sin(player.walk) * 0.5 : pp.armR.rotation.x * 0.8;
    player.mesh.visible = mode !== 'title';

    // camera
    if (mode === 'title') { rig.zoom = 1.5; rig.target.set(Math.sin(elapsed * 0.1) * 4, 0, Math.cos(elapsed * 0.1) * 2); }
    else { rig.zoom = 1; rig.target.copy(player.pos); }
    rig.update(dt);

    // NPCs
    for (const [id, n] of Object.entries(npcs)) {
      const m = n.mesh;
      const dx = n.target.x - m.position.x, dz = n.target.z - m.position.z;
      const d = Math.hypot(dx, dz);
      const parts = m.userData.parts;
      if (d > 0.05) {
        const s = Math.min(d, 1.5 * dt);
        m.position.x += dx / d * s; m.position.z += dz / d * s;
        m.rotation.y = angleLerp(m.rotation.y, Math.atan2(dx, dz), 0.2);
        n.walk += dt * 8;
        parts.legL.rotation.x = Math.sin(n.walk) * 0.5; parts.legR.rotation.x = -Math.sin(n.walk) * 0.5;
        parts.armL.rotation.x = -Math.sin(n.walk) * 0.4; parts.armR.rotation.x = Math.sin(n.walk) * 0.4;
      } else {
        parts.legL.rotation.x *= 0.8; parts.legR.rotation.x *= 0.8;
        const pdx = player.pos.x - m.position.x, pdz = player.pos.z - m.position.z;
        const pd = Math.hypot(pdx, pdz);
        const faceYaw = (n.talking || pd < 2.2) && mode !== 'title' ? Math.atan2(pdx, pdz) : n.rest;
        m.rotation.y = angleLerp(m.rotation.y, faceYaw, n.talking ? 0.15 : 0.05);
        if (n.talking && dialogue.isTyping) { parts.armR.rotation.x = -0.6 + Math.sin(elapsed * 9) * 0.25; parts.armR.rotation.z = 0.2; }
        else { parts.armR.rotation.x *= 0.85; parts.armR.rotation.z *= 0.85; parts.armL.rotation.x *= 0.85; }
      }
      parts.torso.scale.y = 1 + Math.sin(elapsed * 2 + n.phase) * 0.012;
      parts.head.rotation.y = Math.sin(elapsed * 0.6 + n.phase) * 0.15;
      n.tag.visible = m.position.distanceTo(player.pos) < 7 || (step && step.who === id);
      const isTarget = step && step.who === id && mode !== 'dialog';
      n.marker.visible = !!isTarget;
      if (isTarget) { n.marker.position.y = 2.35 + Math.sin(elapsed * 3) * 0.06; n.marker.rotation.y += dt * 2; }
    }
    if (step && step.who.startsWith('obj:') && mode !== 'dialog') {
      const it = world.interactables.find((x) => 'obj:' + x.id === step.who);
      objMarker.visible = !!it;
      if (it) { objMarker.position.set(it.pos.x, it.pos.y + 0.75 + Math.sin(elapsed * 3) * 0.06, it.pos.z); objMarker.rotation.y += dt * 2; }
    } else objMarker.visible = false;
    const catNode = npcs.khoa && npcs.khoa.mesh.userData.cat;
    if (catNode) { catNode.userData.tail.rotation.z = -0.3 + Math.sin(elapsed * 2.5) * 0.3; catNode.rotation.y = -0.3 + Math.sin(elapsed * 0.7) * 0.25; }

    // ghosts + presence broadcast
    const now = performance.now();
    for (const g of Object.values(ghosts)) {
      if (now - g.seen > 15000) { g.mesh.visible = false; continue; }
      const dx = g.target.x - g.mesh.position.x, dz = g.target.z - g.mesh.position.z;
      const d = Math.hypot(dx, dz);
      g.mesh.position.x += dx * Math.min(1, dt * 6); g.mesh.position.z += dz * Math.min(1, dt * 6);
      g.mesh.rotation.y = angleLerp(g.mesh.rotation.y, g.rot, 0.2);
      const w = d > 0.05 ? Math.sin(elapsed * 10) * 0.5 : 0;
      g.mesh.userData.parts.legL.rotation.x = w; g.mesh.userData.parts.legR.rotation.x = -w;
    }
    if (S && (mode === 'play' || mode === 'dialog') && now - lastSent > 200) {
      const movedNet = Math.abs(player.pos.x - lastSentPos.x) + Math.abs(player.pos.z - lastSentPos.z) > 0.05 || Math.abs(player.face - lastSentPos.r) > 0.1;
      if (movedNet || now - lastSent > 3000) {
        net.sendPos(player.pos.x, player.pos.z, player.face, S.name);
        lastSent = now; lastSentPos = { x: player.pos.x, z: player.pos.z, r: player.face };
      }
    }

    // prompt + objective arrow
    if (mode === 'play') {
      currentInteract = findInteract();
      const pr = $('#prompt');
      if (currentInteract) {
        const isT = isTargetOf(step, currentInteract);
        pr.hidden = false;
        pr.classList.toggle('target', !!isT);
        $('#promptText').textContent = (isT ? '⭐ ' : '') + currentInteract.label;
        $('#prompt kbd').hidden = isTouch;
      } else pr.hidden = true;
      if (isTouch) $('#actBtn').hidden = !currentInteract;
    }
    if (step && S && (mode === 'play' || mode === 'pause')) {
      let tp = null;
      if (step.who.startsWith('call:')) { $('#objArrow').style.transform = 'rotate(0deg)'; $('#objArrow').textContent = '📞'; $('#objDist').textContent = '· Teams'; }
      else {
        $('#objArrow').textContent = '➤';
        if (step.who.startsWith('obj:')) { const it = world.interactables.find((x) => 'obj:' + x.id === step.who); if (it) tp = it.pos; }
        else if (npcs[step.who]) tp = npcs[step.who].mesh.position;
      }
      if (tp) {
        const dx = tp.x - player.pos.x, dz = tp.z - player.pos.z;
        // screen space: up = north (-z); ➤ glyph points right at 0deg
        $('#objArrow').style.transform = `rotate(${Math.atan2(dx, -dz) * 180 / Math.PI - 90}deg)`;
        $('#objDist').textContent = `· ${Math.round(Math.hypot(dx, dz))}m`;
      }
    }
  }

  // test hook (headless playthrough tests)
  window.__tts = {
    get S() { return S; }, get mode() { return mode; }, player, npcs, currentStep, interact,
    get world() { return world; }, place: (i) => placeNPCs(i), ring: () => tryRing(),
  };
  void tone;
  return { update };
}
