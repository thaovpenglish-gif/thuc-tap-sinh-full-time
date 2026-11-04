import * as THREE from 'three';
import { buildWorld, makePerson, nameTag, makeMarker, SPOTS, PLAYER_START, MEETING_SEAT } from './world.js';
import { CHARS, DAYS, DEFAULT_POS, IDLE, FORTUNES, MEETING, ENDINGS, computeEnding } from './story.js';
import { net, clean } from './net.js';

const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ================= State & persistence =================
const SAVE_KEY = 'tts_save_v1';
let S = null;
function newState(name) {
  return { v: 1, name, day: 0, step: 0, st: { uy: 50, dr: 0, nl: 100 }, rel: {}, flags: {}, chat: [], unread: 0, altar: {}, coffee: {}, desk: {}, done: false };
}
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* */ } },
};
function save() { if (S) store.set(SAVE_KEY, JSON.stringify(S)); }
function loadSave() { try { const s = JSON.parse(store.get(SAVE_KEY)); return s && s.v === 1 ? s : null; } catch { return null; } }
function unlockedEndings() { try { return JSON.parse(store.get('tts_endings')) || []; } catch { return []; } }
const fmt = (t) => String(t).replaceAll('{ten}', S ? S.name : 'bạn');

// ================= Renderer / scene =================
const canvas = $('#game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#cfe3ef');
const camera = new THREE.PerspectiveCamera(72, 1, 0.05, 80);
camera.rotation.order = 'YXZ';
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < h ? 85 : 72;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

let world = null;
const npcs = {};
const objMarker = makeMarker();
objMarker.visible = false;
scene.add(objMarker);

// ================= Player =================
const player = { pos: new THREE.Vector3(PLAYER_START[0], 1.6, PLAYER_START[1]), yaw: PLAYER_START[2], pitch: 0, eye: 1.6, bob: 0 };
let mode = 'title'; // title | intro | play | dialog | phone | overlay | pause
const keys = {};
const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
const joy = { active: false, id: null, x: 0, y: 0, cx: 0, cy: 0 };
let lookTouch = null;
let focusTarget = null; // Vector3 the camera eases toward during dialog

// ================= Audio =================
let actx = null;
let soundOn = store.get('tts_sound') !== '0';
function audio() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch { /* */ } } return actx; }
function tone(freq, dur, type = 'square', vol = 0.025, when = 0) {
  if (!soundOn) return;
  const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, a.currentTime + when);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + when + dur);
  o.connect(g); g.connect(a.destination);
  o.start(a.currentTime + when); o.stop(a.currentTime + when + dur + 0.02);
}
const sfx = {
  blip(pitch = 1) { tone(380 * pitch + Math.random() * 60, 0.035, 'square', 0.012); },
  ding() { tone(880, 0.12, 'sine', 0.05); tone(1320, 0.18, 'sine', 0.04, 0.1); },
  choose() { tone(600, 0.06, 'triangle', 0.04); tone(900, 0.08, 'triangle', 0.035, 0.05); },
  good() { tone(660, 0.1, 'sine', 0.04); tone(990, 0.14, 'sine', 0.035, 0.08); },
  bad() { tone(300, 0.15, 'sawtooth', 0.02); },
};
function setSound(on) { soundOn = on; store.set('tts_sound', on ? '1' : '0'); $('#soundBtn').textContent = on ? '🔊' : '🔇'; }

// ================= UI helpers =================
function toast(html, cls = '', life = 2.6) {
  const el = document.createElement('div');
  el.className = 'toast ' + cls;
  el.style.setProperty('--life', life + 's');
  el.innerHTML = html;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), (life + 0.5) * 1000);
  const all = $('#toasts').children;
  if (all.length > 5) all[0].remove();
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
function charInfo(id) {
  if (id === 'me') return { name: S.name, role: 'Thực tập sinh (bạn)', emoji: '🙂', color: '#2f7ae5' };
  if (id === 'think') return { name: S.name, role: 'nghĩ thầm…', emoji: '💭', color: '#2f7ae5' };
  if (id === 'nar') return { name: '', role: '', emoji: '📖', color: '#e7e1d3' };
  return CHARS[id] || { name: id, role: '', emoji: '❔', color: '#777' };
}

// ================= Effects =================
function applyFx(fx) {
  if (!fx) return;
  const lbl = { uy: 'Uy tín', dr: 'Drama', nl: 'Năng lượng' };
  for (const k of ['uy', 'dr', 'nl']) {
    if (!fx[k]) continue;
    const before = S.st[k];
    S.st[k] = clamp(S.st[k] + fx[k], 0, 100);
    const d = S.st[k] - before;
    if (!d) continue;
    const cls = k === 'dr' ? 'drama' : d > 0 ? 'good' : 'bad';
    toast(`${d > 0 ? '▲' : '▼'} ${lbl[k]} ${d > 0 ? '+' : ''}${d}`, cls, 2);
  }
  if (fx.rel) for (const [id, n] of Object.entries(fx.rel)) {
    S.rel[id] = (S.rel[id] || 0) + n;
    toast(`${n > 0 ? '❤️' : '💔'} ${CHARS[id].name} ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'good' : 'bad', 2);
  }
  if (fx.set) Object.assign(S.flags, fx.set);
  updateHUD();
}

// ================= Dialogue engine =================
let advanceFn = null;
let typing = null;

function showDialog(spk, text) {
  const info = charInfo(spk);
  const d = $('#dialog');
  d.hidden = false;
  d.className = spk === 'nar' ? 'nar' : spk === 'think' ? 'think' : spk === 'me' ? 'me' : '';
  $('#dlgPortrait').textContent = info.emoji;
  $('#dlgPortrait').style.background = info.color;
  $('#dlgName').textContent = info.name;
  $('#dlgRole').textContent = info.role;
  $('#choices').innerHTML = '';
  // focus camera on the speaking NPC if they are close enough
  if (npcs[spk]) {
    const n = npcs[spk];
    if (n.mesh.position.distanceTo(player.pos) < 10) {
      focusTarget = n.mesh.position.clone().setY(1.55);
      n.talking = true;
    }
  }
  return typeText(text);
}
function typeText(text) {
  const el = $('#dlgText');
  el.textContent = '';
  $('#dlgHint').hidden = false;
  return new Promise((resolve) => {
    let i = 0;
    const chars = Array.from(text);
    const finish = () => { clearInterval(typing); typing = null; el.textContent = text; };
    typing = setInterval(() => {
      i += 2;
      el.textContent = chars.slice(0, i).join('');
      if (i % 4 === 0) sfx.blip();
      if (i >= chars.length) finish();
    }, 22);
    advanceFn = () => {
      if (typing) { finish(); return; }
      advanceFn = null;
      resolve();
    };
  });
}
function say(spk, text) { return showDialog(spk, fmt(text)); }

function choose(opts) {
  return new Promise((resolve) => {
    $('#dlgHint').hidden = true;
    const box = $('#choices');
    box.innerHTML = '';
    advanceFn = null;
    opts.forEach((o, k) => {
      const b = document.createElement('button');
      b.innerHTML = `<span class="num">${k + 1}</span><span>${esc(fmt(o.t))}</span>`;
      b.onclick = (e) => { e.stopPropagation(); pick(k); };
      box.appendChild(b);
    });
    const pick = (k) => {
      if (!opts[k]) return;
      choiceKeyFn = null;
      sfx.choose();
      box.innerHTML = '';
      resolve(opts[k]);
    };
    choiceKeyFn = pick;
  });
}
let choiceKeyFn = null;

async function voteToast(id, idx) {
  const rows = await net.vote(id, idx);
  if (!rows || !rows.length) return;
  const total = rows.reduce((a, r) => a + Number(r.n), 0);
  const mine = Number((rows.find((r) => r.option_idx === idx) || {}).n || 0);
  if (total <= 1) toast('📊 Bạn là người chơi đầu tiên chọn như vậy!', 'stat', 3);
  else toast(`📊 ${Math.round((mine / total) * 100)}% người chơi cũng chọn như bạn`, 'stat', 3);
}

async function runNodes(nodes) {
  for (const n of nodes) {
    if (Array.isArray(n)) {
      if (n[0] === 'me') { await say('me', n[1]); continue; }
      await say(n[0], n[1]);
    } else if (n.c) {
      const opts = n.o.map((o, i) => ({ ...o, i })).filter((o) => !o.when || o.when(S));
      if (!opts.length) continue;
      const p = await choose(opts);
      voteToast(n.c, p.i);
      applyFx(p.fx);
      if (p.then) await runNodes(p.then);
    } else if (n.if) {
      if (n.if(S)) { if (n.then) await runNodes(n.then); } else if (n.else) await runNodes(n.else);
    } else if (n.fx) {
      applyFx(n.fx);
    } else if (n.chat) {
      pushChat(n.chat);
    }
  }
}

function startDialogMode() {
  mode = 'dialog';
  $('#prompt').hidden = true;
  $('#crosshair').hidden = true;
  $('#actBtn').hidden = true;
  $('#mobile').hidden = true;
  if (document.pointerLockElement) document.exitPointerLock();
}
function endDialogMode() {
  $('#dialog').hidden = true;
  focusTarget = null;
  Object.values(npcs).forEach((n) => { n.talking = false; });
  if (mode === 'dialog') {
    mode = 'play';
    $('#crosshair').hidden = isTouch;
    $('#mobile').hidden = !isTouch;
    lockPointer();
  }
}

// ================= Story flow =================
function currentStep() {
  if (!S) return null;
  const day = DAYS[S.day];
  while (day.steps[S.step] && day.steps[S.step].when && !day.steps[S.step].when(S)) S.step++;
  return day.steps[S.step] || null;
}

function altarScene() {
  const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  return [
    ['nar', 'Bạn thắp ba nén hương, vái ba vái. Ông Địa cười tươi rói. Thần Tài nhìn bạn như biết bạn chưa đóng tiền cơm.'],
    ['nar', f],
    { fx: { uy: 2 } },
  ];
}
const SLEEP_SCENE = [
  ['nar', 'Mắt bạn díp lại. Bạn gục xuống bàn phím. Màn hình hiện: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"'],
  ['phat', 'Ngủ trưa là tốt. Nhưng ngủ lúc ba giờ chiều là… mất lộc.'],
  ['think', 'Lần sau nhớ ghé pantry pha cà phê.'],
  { fx: { uy: -5, nl: 45 } },
];

async function runStep(step) {
  startDialogMode();
  if (step.who === 'obj:seat') {
    // sit down in the meeting room
    player.pos.set(MEETING_SEAT[0], 1.2, MEETING_SEAT[1] + 0.25);
    player.eye = 1.2; player.yaw = 0; player.pitch = -0.1;
  }
  const nodes = step.scene === 'altar' ? altarScene() : step.scene === 'meeting' ? MEETING : step.scene;
  await runNodes(nodes);
  if (step.who === 'obj:altar') S.altar[S.day] = true;
  S.step++;
  if (step.scene !== 'meeting') {
    applyFx({ nl: -8 });
    if (S.st.nl <= 0) await runNodes(SLEEP_SCENE);
  }
  save();
  endDialogMode();
  if (step.scene === 'meeting') { finishGame(); return; }
  if (!currentStep()) { dayEnd(); return; }
  onStepStart();
}

function onStepStart() {
  placeNPCs(false);
  updateHUD();
  save();
}

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

function pushChat(list, delayStart = 400) {
  list.forEach(([from, text, dm], k) => {
    setTimeout(() => {
      const step = currentStep();
      const m = { from, t: fmt(text), dm: !!dm, time: step ? step.time : '17:30' };
      S.chat.push(m);
      if (S.chat.length > 120) S.chat.shift();
      if (mode !== 'phone' || paneTab !== 'zalo') S.unread++;
      const info = charInfo(from);
      if (from !== 'nar') toast(`📱 <b>${esc(info.name)}</b>${dm ? ' (nhắn riêng)' : ''}: ${esc(m.t)}`, 'msg', 3.4);
      sfx.ding();
      $('#phoneBtn').classList.remove('ring'); void $('#phoneBtn').offsetWidth; $('#phoneBtn').classList.add('ring');
      updateHUD();
      if (mode === 'phone') renderChat();
      save();
    }, delayStart + k * 1100);
  });
}

// ---------- Overlays ----------
function overlay(html) {
  $('#ovCard').innerHTML = html;
  $('#overlay').hidden = false;
  if (document.pointerLockElement) document.exitPointerLock();
}
function hideOverlay() { $('#overlay').hidden = true; }

function relChips() {
  return Object.entries(S.rel).filter(([, v]) => v !== 0).sort((a, b) => b[1] - a[1])
    .map(([id, v]) => `<span>${CHARS[id].emoji} ${esc(CHARS[id].name)} ${v > 0 ? '❤️'.repeat(Math.min(v, 5)) : '💔'.repeat(Math.min(-v, 3))}</span>`).join('');
}
function statGrid() {
  return `<div class="stat-grid"><div><b>${S.st.uy}</b><span>Uy tín</span></div><div><b>${S.st.dr}</b><span>Drama</span></div><div><b>${S.st.nl}</b><span>Năng lượng</span></div></div>`;
}

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
    ${isTouch ? '' : '<div class="help"><div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> đi · chuột nhìn · <kbd>E</kbd> nói chuyện · <kbd>Q</kbd> điện thoại · <kbd>Esc</kbd> tạm dừng</div></div>'}
  `);
  $('#goDay').onclick = () => {
    hideOverlay();
    startDay();
  };
}
function startDay() {
  const d = DAYS[S.day];
  player.pos.set(PLAYER_START[0], 1.6, PLAYER_START[1]);
  player.yaw = PLAYER_START[2]; player.pitch = 0; player.eye = 1.6;
  if (S.step === 0) S.coffee[S.day] = 0;
  placeNPCs(true);
  if (S.step === 0 && d.chatStart) pushChat(d.chatStart, 900);
  mode = 'play';
  $('#hud').hidden = false;
  $('#crosshair').hidden = isTouch;
  $('#mobile').hidden = !isTouch;
  updateHUD();
  save();
  lockPointer();
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
    <div class="btns"><button class="btn primary" id="nextDay">Ngày tiếp theo →</button><button class="btn" id="dayPhone">📱 Xem điện thoại</button></div>
  `);
  S.st.nl = clamp(S.st.nl + 60, 0, 100);
  $('#nextDay').onclick = () => { S.day++; S.step = 0; save(); hideOverlay(); showDayIntro(); };
  $('#dayPhone').onclick = () => { openPhone(); };
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
    <div class="ov-kicker">KẾT THÚC · ${got.length}/${Object.keys(ENDINGS).length} ĐÃ MỞ</div>
    <h2>${esc(E.title)}</h2>
    <p class="ov-text">${esc(fmt(E.text(S)))}</p>
    <div class="pct" id="endPct">📊 Đang đếm xem bao nhiêu người chơi có cùng kết thúc…</div>
    ${statGrid()}
    <div class="rels">${relChips()}</div>
    <div class="endings-list">${list}</div>
    <div class="btns"><button class="btn primary" id="againBtn">Chơi lại, chọn khác đi 🔁</button><button class="btn" id="endPhone">👻 Hội TTS ẩn danh</button><button class="btn" id="shareBtn">Chia sẻ</button></div>
  `);
  $('#againBtn').onclick = () => { const name = S.name; S = newState(name); save(); hideOverlay(); showDayIntro(); };
  $('#endPhone').onclick = () => { openPhone('tts'); };
  $('#shareBtn').onclick = async () => {
    const text = `Mình vừa đạt kết thúc "${E.title}" trong game Thực Tập Sinh. Còn bạn sống sót tới thứ Sáu không?`;
    try { if (navigator.share) await navigator.share({ title: 'Thực Tập Sinh', text, url: location.href }); else { await navigator.clipboard.writeText(text + ' ' + location.href); toast('Đã copy link!', 'good'); } } catch { /* cancelled */ }
  };
  const rows = await net.vote('ending', E.idx);
  if (rows && rows.length) {
    const total = rows.reduce((a, r) => a + Number(r.n), 0);
    const mine = Number((rows.find((r) => r.option_idx === E.idx) || {}).n || 0);
    $('#endPct').textContent = `📊 ${Math.round(mine / total * 100)}% trong ${total} lượt chơi có cùng kết thúc này`;
  } else $('#endPct').textContent = '📊 (Không kết nối được máy chủ thống kê)';
}

// ================= Interaction =================
const tmpV = new THREE.Vector3();
let currentInteract = null;
function findInteract() {
  const fwd = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  let best = null, bestScore = Infinity;
  const consider = (kind, id, pos, label) => {
    tmpV.set(pos.x - player.pos.x, 0, pos.z - player.pos.z);
    const d = tmpV.length();
    if (d > 2.6) return;
    const dot = d > 0.001 ? tmpV.normalize().dot(fwd) : 1;
    if (dot < 0.45 && d > 1.1) return;
    const score = d * (1.6 - dot);
    if (score < bestScore) { bestScore = score; best = { kind, id, label }; }
  };
  for (const [id, n] of Object.entries(npcs)) consider('npc', id, n.mesh.position, `Nói chuyện với ${CHARS[id].name}`);
  for (const it of world.interactables) consider('obj', it.id, it.pos, it.label);
  return best;
}

async function interact() {
  if (mode !== 'play' || !currentInteract) return;
  const it = currentInteract;
  const step = currentStep();
  const isTarget = step && ((it.kind === 'npc' && step.who === it.id) || (it.kind === 'obj' && step.who === 'obj:' + it.id));
  if (isTarget) { runStep(step); return; }
  startDialogMode();
  if (it.kind === 'npc') {
    const lines = IDLE[it.id];
    const line = lines[Math.floor(Math.random() * lines.length)];
    await say(it.id, line);
    if (step && step.who !== it.id && !step.who.startsWith('obj:')) await say('think', `(Việc cần làm bây giờ: ${fmt(step.obj).toLowerCase()})`);
  } else {
    await runNodes(objectScene(it.id));
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
      return [['nar', 'Bạn mở laptop. Bạn làm việc cực kỳ chăm chỉ được chín phút trước khi máy báo pin yếu.'], ['think', 'Ít nhất thì chú Phát đi ngang qua và thấy mình đang gõ phím.'], { fx: { uy: 2, nl: -4 } }];
    case 'printer':
      return [['nar', 'Máy in kẹt giấy. Như mọi khi. Bạn vỗ nhẹ vào hông nó hai cái.'], ['nar', 'Nó chạy. Bạn vừa học được kỹ năng IT quan trọng nhất của Phát Đạt Lộc.']];
    case 'safe':
      return [['nar', 'Két sắt hiệu "Việt Tiệp 1998". Dán một lá bùa đỏ chữ "Phát". Có vẻ lá bùa không chống trộm được.'], S.day >= 1 ? ['think', 'Năm mươi triệu… ai mà dám nhỉ?'] : ['think', 'Chắc trong này nhiều tiền lắm.']];
    case 'plant':
      return [['nar', 'Cây kim tiền héo vàng. Có một tờ giấy nhớ dán trên chậu: "ĐỪNG TƯỚI NỮA — Khoa".'], ['think', 'Hóa ra không phải do năng lượng xấu. Là do tưới quá nhiều.']];
    case 'okr':
      return [['nar', 'Bảng trắng ghi: "OKR Q4: 10X REVENUE. Digital Transformation. TikTok???". Ở góc dưới có ai đó viết thêm bằng bút đỏ: "Bố: để mẹ con quyết".']];
    case 'redchair':
      return [['nar', 'Chiếc ghế nhựa đỏ duy nhất trong pantry. Không ai ngồi. Không ai dám.'], ['tu', '(từ xa) Đừng có nghĩ tới chuyện đó nha con.']];
    case 'seat':
      return [['nar', 'Phòng họp trống. Trên bàn có một vết trà khô hình… châu Úc.']];
    default:
      return [['nar', '…']];
  }
}

// ================= Phone =================
let paneTab = 'zalo';
let ttsLoaded = false;
function openPhone(tab) {
  if (tab) setTab(tab);
  $('#phone').hidden = false;
  if (mode === 'play' || mode === 'pause') mode = 'phone';
  if (document.pointerLockElement) document.exitPointerLock();
  $('#pause').hidden = true;
  if (paneTab === 'zalo') { S.unread = 0; updateHUD(); }
  renderChat();
  if (paneTab === 'tts') loadTts();
}
function closePhone() {
  $('#phone').hidden = true;
  if (mode === 'phone') { mode = 'play'; lockPointer(); }
}
function setTab(tab) {
  paneTab = tab;
  document.querySelectorAll('.phone-tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  $('#paneZalo').hidden = tab !== 'zalo';
  $('#paneTts').hidden = tab !== 'tts';
  if (tab === 'zalo' && S) { S.unread = 0; updateHUD(); renderChat(); }
  if (tab === 'tts') loadTts();
}
function renderChat() {
  const list = $('#chatList');
  if (!S || !S.chat.length) { list.innerHTML = '<div class="empty">Chưa có tin nhắn nào. Yên bình… quá yên bình.</div>'; return; }
  list.innerHTML = S.chat.map((m) => {
    if (m.from === 'nar') return `<div class="sys">${esc(m.t)}</div>`;
    const c = charInfo(m.from);
    return `<div class="msg"><div class="av" style="background:${c.color}">${c.emoji}</div><div class="bub"><div class="who" style="color:${c.color}">${esc(c.name)}${m.dm ? '<span class="dm">nhắn riêng</span>' : ''}</div><div class="txt">${esc(m.t)}</div><div class="tm">${esc(m.time)}</div></div></div>`;
  }).join('');
  list.scrollTop = list.scrollHeight;
}
function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'vừa xong';
  if (s < 3600) return Math.floor(s / 60) + ' phút trước';
  if (s < 86400) return Math.floor(s / 3600) + ' giờ trước';
  return Math.floor(s / 86400) + ' ngày trước';
}
function confHTML(c, isNew) {
  return `<div class="conf${isNew ? ' new' : ''}"><div class="meta"><span>👻 ${esc(c.nickname)}</span><span>${timeAgo(c.created_at)}</span></div><div class="txt">${esc(c.body)}</div></div>`;
}
async function loadTts() {
  if (ttsLoaded) return;
  ttsLoaded = true;
  const list = $('#ttsList');
  list.innerHTML = '<div class="empty">Đang tải…</div>';
  if (!net.ok) { list.innerHTML = '<div class="empty">Không kết nối được. Thử lại sau nhé.</div>'; return; }
  const rows = await net.loadConfessions();
  list.innerHTML = rows.length ? rows.map((r) => confHTML(r)).join('') : '<div class="empty">Chưa ai than thở. Bạn mở bát đi!</div>';
}
net.onConfession((row) => {
  if (!ttsLoaded) return;
  const list = $('#ttsList');
  const empty = list.querySelector('.empty'); if (empty) empty.remove();
  list.insertAdjacentHTML('afterbegin', confHTML(row, true));
});
$('#ttsBody').addEventListener('input', () => { $('#ttsLeft').textContent = 280 - $('#ttsBody').value.length; });
$('#ttsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = $('#ttsBody').value.trim();
  if (!body) return;
  const btn = $('#ttsForm button');
  btn.disabled = true;
  try {
    const nick = $('#ttsAnon').checked ? 'TTS ẩn danh' : `TTS ${S ? S.name : 'ẩn danh'}`;
    await net.postConfession(nick, body);
    $('#ttsBody').value = ''; $('#ttsLeft').textContent = '280';
    toast('Đã đăng lên Hội TTS 👻', 'good');
  } catch (err) {
    toast('Không đăng được: ' + esc(err.message || 'lỗi mạng'), 'bad', 3);
  }
  btn.disabled = false;
});

// ================= Multiplayer ghosts =================
const ghosts = {};
let lastSent = 0, lastSentPos = { x: 0, z: 0, r: 0 };
function ghostFor(id, name) {
  if (ghosts[id]) return ghosts[id];
  const palette = ['#6aa0ff', '#ff8fb1', '#7bd389', '#ffb35c', '#b48cff'];
  const col = palette[Math.abs([...id].reduce((a, c) => a + c.charCodeAt(0), 0)) % palette.length];
  const mesh = makePerson({ shirt: col, pants: '#3a3f55', hair: 'short', hairColor: '#2a2a2a' }, { ghost: true });
  const tag = nameTag('TTS ' + (name || '???'), 'người chơi khác', { ghost: true });
  mesh.add(tag);
  scene.add(mesh);
  ghosts[id] = { mesh, tag, target: new THREE.Vector3(), rot: 0, seen: performance.now(), name };
  return ghosts[id];
}
function removeGhost(id) {
  const g = ghosts[id]; if (!g) return;
  scene.remove(g.mesh); delete ghosts[id];
}
let peerCount = 1;
function setOnline(n) {
  peerCount = Math.max(1, n);
  $('#online').textContent = `👥 ${peerCount}`;
  $('#titleOnline').textContent = `👥 ${peerCount} người đang ở văn phòng`;
}
net.joinOffice(null, {
  onPeers(peers) {
    setOnline(Object.keys(peers).length);
    for (const id of Object.keys(ghosts)) if (!peers[id]) removeGhost(id);
  },
  onPos(p) {
    if (!S || mode === 'title') return;
    const g = ghostFor(p.id, clean(p.n || ''));
    if (p.n && p.n !== g.name) { g.mesh.remove(g.tag); g.tag = nameTag('TTS ' + clean(p.n), 'người chơi khác', { ghost: true }); g.mesh.add(g.tag); g.name = p.n; }
    if (!g.mesh.visible || g.mesh.position.lengthSq() === 0) g.mesh.position.set(p.x, 0, p.z);
    g.target.set(p.x, 0, p.z); g.rot = p.r; g.seen = performance.now(); g.mesh.visible = true;
  },
  onLeave(id) { removeGhost(id); },
});
if (!net.ok) $('#titleOnline').textContent = '👥 chế độ ngoại tuyến';

// ================= Input =================
function lockPointer() {
  if (isTouch || mode !== 'play') return;
  try { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch { /* */ }
}
document.addEventListener('pointerlockchange', () => {
  if (!document.pointerLockElement && mode === 'play' && !isTouch) {
    mode = 'pause';
    $('#pause').hidden = false;
  }
});
canvas.addEventListener('click', () => {
  if (mode === 'dialog' && advanceFn) { advanceFn(); return; }
  if (mode === 'play') lockPointer();
});
$('#dialog').addEventListener('click', () => { if (advanceFn) advanceFn(); });
$('#resumeBtn').onclick = () => { $('#pause').hidden = true; mode = 'play'; lockPointer(); };
$('#pause').addEventListener('click', (e) => { if (e.target.id === 'pause') { $('#pause').hidden = true; mode = 'play'; lockPointer(); } });
$('#pausePhone').onclick = () => { $('#pause').hidden = true; mode = 'play'; openPhone(); };
$('#menuBtn').onclick = () => { if (mode === 'play') { if (document.pointerLockElement) document.exitPointerLock(); mode = 'pause'; $('#pause').hidden = false; } };
$('#restartBtn').onclick = () => {
  if (!confirm('Chơi lại từ đầu? Tiến trình hiện tại sẽ mất.')) return;
  const name = S ? S.name : '';
  S = newState(name); save();
  $('#pause').hidden = true; showDayIntro();
};
$('#phoneBtn').onclick = () => { if (mode === 'play' || mode === 'pause') openPhone(); };
$('#phoneClose').onclick = closePhone;
$('#phone').addEventListener('click', (e) => { if (e.target.id === 'phone') closePhone(); });
document.querySelectorAll('.phone-tabs button').forEach((b) => { b.onclick = () => setTab(b.dataset.tab); });
$('#soundBtn').onclick = () => setSound(!soundOn);
setSound(soundOn);

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    if (e.key === 'Escape' && mode === 'phone') closePhone();
    return;
  }
  keys[e.code] = true;
  if (mode === 'dialog') {
    if (e.repeat) return;
    if (choiceKeyFn && /^Digit[1-4]$/.test(e.code)) { choiceKeyFn(Number(e.code.slice(5)) - 1); return; }
    if (advanceFn && (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter' || e.code === 'KeyF')) { e.preventDefault(); advanceFn(); }
    return;
  }
  if (mode === 'play') {
    if (e.code === 'KeyE' || e.code === 'KeyF') interact();
    if (e.code === 'KeyQ' || e.code === 'Tab') { e.preventDefault(); openPhone(); }
  } else if (mode === 'phone' && (e.code === 'KeyQ' || e.code === 'Escape' || e.code === 'Tab')) { e.preventDefault(); closePhone(); }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== canvas || mode !== 'play') return;
  player.yaw -= e.movementX * 0.0022;
  player.pitch = clamp(player.pitch - e.movementY * 0.0022, -1.25, 1.25);
});

// ---- touch ----
if (isTouch) {
  const joyEl = $('#joy');
  joyEl.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    const r = joyEl.getBoundingClientRect();
    joy.active = true; joy.id = t.identifier; joy.cx = r.left + r.width / 2; joy.cy = r.top + r.height / 2;
    moveJoy(t); e.preventDefault();
  }, { passive: false });
  const moveJoy = (t) => {
    let dx = t.clientX - joy.cx, dy = t.clientY - joy.cy;
    const L = Math.hypot(dx, dy), max = 52;
    if (L > max) { dx = dx / L * max; dy = dy / L * max; }
    joy.x = dx / max; joy.y = dy / max;
    $('#joyKnob').style.transform = `translate(${dx}px, ${dy}px)`;
  };
  window.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
      if (joy.active && t.identifier === joy.id) moveJoy(t);
      else if (lookTouch && t.identifier === lookTouch.id && mode === 'play') {
        player.yaw -= (t.clientX - lookTouch.x) * 0.0055;
        player.pitch = clamp(player.pitch - (t.clientY - lookTouch.y) * 0.0045, -1.2, 1.2);
        lookTouch.x = t.clientX; lookTouch.y = t.clientY;
      }
    }
  }, { passive: true });
  const endT = (e) => {
    for (const t of e.changedTouches) {
      if (joy.active && t.identifier === joy.id) { joy.active = false; joy.x = joy.y = 0; $('#joyKnob').style.transform = ''; }
      if (lookTouch && t.identifier === lookTouch.id) lookTouch = null;
    }
  };
  window.addEventListener('touchend', endT); window.addEventListener('touchcancel', endT);
  canvas.addEventListener('touchstart', (e) => {
    if (mode === 'dialog' && advanceFn) { advanceFn(); return; }
    const t = e.changedTouches[0];
    if (!lookTouch) lookTouch = { id: t.identifier, x: t.clientX, y: t.clientY };
  }, { passive: true });
  $('#actBtn').addEventListener('click', () => interact());
}

// ================= Title screen =================
function refreshTitle() {
  const sv = loadSave();
  const cont = $('#continueBtn');
  if (sv && !sv.done) {
    cont.hidden = false;
    cont.textContent = `Tiếp tục: Ngày ${sv.day + 1} (${DAYS[sv.day].title})`;
    $('#nameInput').value = sv.name;
    $('#badgeName').textContent = sv.name;
  } else if (sv) {
    $('#nameInput').value = sv.name;
    $('#badgeName').textContent = sv.name;
  }
  const got = unlockedEndings();
  $('#titleEndings').textContent = got.length ? `🏁 Đã mở ${got.length}/${Object.keys(ENDINGS).length} kết thúc` : '';
}
$('#nameInput').addEventListener('input', (e) => { $('#badgeName').textContent = e.target.value.trim() || 'THỰC TẬP SINH'; });
$('#nameInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#startBtn').click(); });
$('#startBtn').onclick = () => {
  const name = clean($('#nameInput').value.trim()).slice(0, 16);
  if (!name) { $('#nameInput').focus(); $('#nameInput').placeholder = 'Nhập tên đã nào!'; return; }
  audio();
  S = newState(name); save();
  net.setName(name);
  $('#title').hidden = true;
  showDayIntro();
};
$('#continueBtn').onclick = () => {
  audio();
  S = loadSave();
  net.setName(S.name);
  $('#title').hidden = true;
  if (S.step === 0) showDayIntro(); else { startDay(); }
};

// ================= Main loop =================
const clock = new THREE.Clock();
let elapsed = 0;
function tryMove(dx, dz) {
  const p = player.pos;
  p.x += dx; p.z += dz;
  const r = 0.28;
  for (const c of world.colliders) {
    if (p.x > c.minX - r && p.x < c.maxX + r && p.z > c.minZ - r && p.z < c.maxZ + r) {
      const dl = p.x - (c.minX - r), dr = (c.maxX + r) - p.x, dt = p.z - (c.minZ - r), db = (c.maxZ + r) - p.z;
      const m = Math.min(dl, dr, dt, db);
      if (m === dl) p.x = c.minX - r; else if (m === dr) p.x = c.maxX + r; else if (m === dt) p.z = c.minZ - r; else p.z = c.maxZ + r;
    }
  }
  for (const n of Object.values(npcs)) {
    const ddx = p.x - n.mesh.position.x, ddz = p.z - n.mesh.position.z;
    const d = Math.hypot(ddx, ddz);
    if (d < 0.55 && d > 0.0001) { p.x = n.mesh.position.x + ddx / d * 0.55; p.z = n.mesh.position.z + ddz / d * 0.55; }
  }
  p.x = clamp(p.x, -14.7, 14.7); p.z = clamp(p.z, -9.7, 9.85);
}
function angleLerp(a, b, t) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  elapsed += dt;
  if (!world) return;
  world.update(elapsed);

  // --- player movement ---
  let mx = 0, mz = 0;
  if (mode === 'play') {
    if (keys.KeyW || keys.ArrowUp) mz += 1;
    if (keys.KeyS || keys.ArrowDown) mz -= 1;
    if (keys.KeyA || keys.ArrowLeft) mx -= 1;
    if (keys.KeyD || keys.ArrowRight) mx += 1;
    if (joy.active) { mx += joy.x; mz += -joy.y; }
  }
  const len = Math.hypot(mx, mz);
  if (len > 0.05) {
    const sp = (keys.ShiftLeft || keys.ShiftRight ? 5.2 : 3.2) * Math.min(len, 1) / len;
    const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw);
    const rx = Math.cos(player.yaw), rz = -Math.sin(player.yaw);
    tryMove((fx * mz + rx * mx) * sp * dt, (fz * mz + rz * mx) * sp * dt);
    player.bob += dt * 9;
  }
  // dialog camera focus
  if (focusTarget && mode === 'dialog') {
    const dx = focusTarget.x - player.pos.x, dz = focusTarget.z - player.pos.z;
    const yawT = Math.atan2(-dx, -dz);
    const pitchT = Math.atan2(focusTarget.y - player.eye, Math.hypot(dx, dz)) * 0.8;
    player.yaw = angleLerp(player.yaw, yawT, 1 - Math.pow(0.002, dt));
    player.pitch += (pitchT - player.pitch) * (1 - Math.pow(0.002, dt));
  }
  const bobY = len > 0.05 && mode === 'play' ? Math.sin(player.bob) * 0.035 : 0;
  camera.position.set(player.pos.x, player.eye + bobY, player.pos.z);
  camera.rotation.set(player.pitch, player.yaw, 0);

  // --- NPCs ---
  const step = S ? currentStep() : null;
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
      const faceYaw = (n.talking || pd < 2.2) ? Math.atan2(pdx, pdz) : n.rest;
      m.rotation.y = angleLerp(m.rotation.y, faceYaw, n.talking ? 0.15 : 0.05);
      // gestures while talking
      if (n.talking && typing) { parts.armR.rotation.x = -0.6 + Math.sin(elapsed * 9) * 0.25; parts.armR.rotation.z = 0.2; }
      else { parts.armR.rotation.x *= 0.85; parts.armR.rotation.z *= 0.85; parts.armL.rotation.x *= 0.85; }
    }
    parts.torso.scale.y = 1 + Math.sin(elapsed * 2 + n.phase) * 0.012;
    parts.head.rotation.y = Math.sin(elapsed * 0.6 + n.phase) * 0.15;
    const isTarget = step && step.who === id && mode !== 'dialog';
    n.marker.visible = !!isTarget;
    if (isTarget) { n.marker.position.y = 2.42 + Math.sin(elapsed * 3) * 0.06; n.marker.rotation.y += dt * 2; }
  }
  // object marker
  if (step && step.who.startsWith('obj:') && mode !== 'dialog') {
    const it = world.interactables.find((x) => 'obj:' + x.id === step.who);
    objMarker.visible = !!it;
    if (it) { objMarker.position.set(it.pos.x, it.pos.y + 0.75 + Math.sin(elapsed * 3) * 0.06, it.pos.z); objMarker.rotation.y += dt * 2; }
  } else objMarker.visible = false;

  // --- ghosts ---
  const now = performance.now();
  for (const [id, g] of Object.entries(ghosts)) {
    if (now - g.seen > 15000) { g.mesh.visible = false; continue; }
    const dx = g.target.x - g.mesh.position.x, dz = g.target.z - g.mesh.position.z;
    const d = Math.hypot(dx, dz);
    g.mesh.position.x += dx * Math.min(1, dt * 6); g.mesh.position.z += dz * Math.min(1, dt * 6);
    g.mesh.rotation.y = angleLerp(g.mesh.rotation.y, g.rot + Math.PI, 0.2);
    const parts = g.mesh.userData.parts;
    const w = d > 0.05 ? Math.sin(elapsed * 10) * 0.5 : 0;
    parts.legL.rotation.x = w; parts.legR.rotation.x = -w;
    void id;
  }
  if (S && (mode === 'play' || mode === 'dialog') && now - lastSent > 200) {
    const moved = Math.abs(player.pos.x - lastSentPos.x) + Math.abs(player.pos.z - lastSentPos.z) > 0.05 || Math.abs(player.yaw - lastSentPos.r) > 0.1;
    if (moved || now - lastSent > 3000) {
      net.sendPos(player.pos.x, player.pos.z, player.yaw, S.name);
      lastSent = now; lastSentPos = { x: player.pos.x, z: player.pos.z, r: player.yaw };
    }
  }

  // --- interaction prompt & objective arrow ---
  if (mode === 'play') {
    currentInteract = findInteract();
    const pr = $('#prompt');
    if (currentInteract) {
      const isT = step && ((currentInteract.kind === 'npc' && step.who === currentInteract.id) || (currentInteract.kind === 'obj' && step.who === 'obj:' + currentInteract.id));
      pr.hidden = false;
      pr.classList.toggle('target', !!isT);
      $('#promptText').textContent = (isT ? '⭐ ' : '') + currentInteract.label;
      $('#prompt kbd').hidden = isTouch;
    } else pr.hidden = true;
    if (isTouch) $('#actBtn').hidden = !currentInteract;
  }
  if (step && S && (mode === 'play' || mode === 'pause')) {
    let tp = null;
    if (step.who.startsWith('obj:')) { const it = world.interactables.find((x) => 'obj:' + x.id === step.who); if (it) tp = it.pos; }
    else if (npcs[step.who]) tp = npcs[step.who].mesh.position;
    if (tp) {
      const dx = tp.x - player.pos.x, dz = tp.z - player.pos.z;
      const yawT = Math.atan2(-dx, -dz);
      let rel = yawT - player.yaw;
      rel = Math.atan2(Math.sin(rel), Math.cos(rel));
      $('#objArrow').style.transform = `rotate(${-90 - rel * 180 / Math.PI}deg)`;
      $('#objDist').textContent = `· ${Math.round(Math.hypot(dx, dz))}m`;
    }
  }

  $('#clickHint').hidden = !(mode === 'play' && !isTouch && document.pointerLockElement !== canvas);
  renderer.render(scene, camera);
}

// ================= Boot =================
async function boot() {
  try { await Promise.race([document.fonts.load('900 40px "Be Vietnam Pro"'), sleep(2500)]); } catch { /* */ }
  world = buildWorld(scene);
  for (const [id, def] of Object.entries(CHARS)) {
    const mesh = makePerson(def);
    const tag = nameTag(def.name, def.role.split('·')[0].trim(), { color: def.color });
    mesh.add(tag);
    const marker = makeMarker();
    marker.position.y = 2.42; marker.visible = false;
    mesh.add(marker);
    scene.add(mesh);
    npcs[id] = { mesh, marker, target: new THREE.Vector3(), rest: 0, walk: 0, phase: Math.random() * 6, talking: false };
  }
  const sv = loadSave();
  S = sv || newState('');
  placeNPCs(true);
  S = null;
  // a slow idle camera for the title screen
  player.pos.set(-1, 1.7, 7); player.yaw = 0.35; player.pitch = -0.08;
  $('#loading').hidden = true;
  refreshTitle();
  if (!isTouch) setTimeout(() => $('#nameInput').focus(), 100);
  frame();
}
boot();

// title-screen camera drift
setInterval(() => { if (mode === 'title') player.yaw += 0.0015; }, 16);

// debug/test hook (harmless in production)
window.__tts = { get S() { return S; }, get mode() { return mode; }, player, npcs, currentStep, interact, get world() { return world; } };
