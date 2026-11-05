// Overdeadline & Overburnout — SOS Advisory co-op multiplayer (2–4 players, also playable alone for practice).
// The room creator is the HOST: it runs game/mp/engine.js and broadcasts snapshots. Everyone moves their own
// character locally and broadcasts its position; actions go to the host. Behind the ?mp=1 flag for now.
import * as THREE from 'three';
import { $, esc, store, angleLerp } from '../core/util.js';
import { sfx, unlockAudio } from '../core/audio.js';
import { isTouch } from '../core/input.js';
import { moveActor } from '../core/physics.js';
import { makePerson, nameTag } from '../art/people.js';
import { textTexture } from '../art/kit.js';
import { buildRoom, makeItem, makeBar, makeClient, itemIcon } from '../maps/mp-room.js';
import { LEVELS, COMING_SOON, ITEMS, PLAYER_COLORS, clientName, createGame, addPlayer, removePlayer, act, answerQuiz, step, setPlayerPos, hintFor, targetOf, speedOf, isFrozen, isTired, starsFor, starGoals } from '../game/mp/engine.js';
import { joinRoom, myId, newRoomCode, normCode, cleanName } from '../net/mp-net.js';
import { toast } from '../ui/toast.js';
import { MP_CSS } from '../ui/mp-style.js';

const LEVEL_ORDER = ['tm', 'bama', 'hr', 'agency']; // client companies available in the picker
const MAX_PLAYERS = 4;
const SPEED = 3.7;
const SNAP_EVERY = 0.2;   // host snapshot interval (s)
const POS_EVERY = 0.125;  // position broadcast interval (s)
const COUNTDOWN = 3.5;
const HAIR = ['bun', 'short', 'pony', 'curly'];

const QUOTES = [
  'Chị Tuyết: "Chị nghĩ các em cần nhìn vấn đề này ở góc độ chiến lược hơn."',
  'Chị Tuyết: "Đây là phân tích, nhưng đâu là business implication?"',
  'Chị Tuyết: "Ổn. Chị chỉ có một vài ý nhỏ thôi."',
  'Chị Tuyết: "Business implication rõ rồi. Lần sau T&M lại gọi SOS Advisory."',
];

export function startMulti({ scene, rig, input, onExit, params }) {
  // ---------- DOM ----------
  if (!document.getElementById('mpStyle')) {
    const st = document.createElement('style'); st.id = 'mpStyle'; st.textContent = MP_CSS; document.head.appendChild(st);
  }
  const root = document.createElement('div');
  root.id = 'mpRoot';
  root.innerHTML = '<div id="mpHud" hidden></div><div id="mpScreen" class="mp-screen" hidden></div><div id="mpBook" class="mp-book" hidden></div><div id="mpQuiz" class="mp-quiz" hidden></div>';
  document.body.appendChild(root);
  const screen = $('#mpScreen');
  const hud = $('#mpHud');
  if (isTouch) document.body.classList.add('mp-touch');
  $('#hud').hidden = true;

  const netKind = params.get('net') === 'local' ? 'local' : 'supabase';
  let name = cleanName(store.get('mp_name') || store.get('tts_name') || '');
  if (name === 'SOS') name = '';

  // ---------- session state ----------
  let net = null;          // room connection
  let code = '';
  let isHost = false;
  let members = {};        // id -> { name, color, host, joinedAt }
  let mode = 'home';       // home | room | play
  let game = null;         // host: authoritative state · guest: latest snapshot
  let countdown = 0;
  let evQueue = [];        // host: events waiting for the next snapshot
  let lastEvSeq = 0, evSeq = 0;
  let hostTimer = null, snapT = 0, lastHostTick = 0;
  let roster = [];         // players of the current/last game [{id,name,color}]
  let joinTimeout = null;

  // ---------- world (one client company = one level; switching rebuilds the office) ----------
  let levelId = LEVELS[store.get('mp_level')] ? store.get('mp_level') : 'tm';
  let L = LEVELS[levelId];
  let world = buildRoom(scene, L);
  function setLevel(id) {
    if (!LEVELS[id] || id === levelId) return;
    levelId = id; L = LEVELS[id];
    store.set('mp_level', id);
    world.dispose();
    world = buildRoom(scene, L);
    for (const k of Object.keys(placed)) { placed[k].removeFromParent(); delete placed[k]; }
    for (const k of Object.keys(floorItems)) { floorItems[k].removeFromParent(); delete floorItems[k]; }
    for (const k of Object.keys(npcs)) { scene.remove(npcs[k].mesh); delete npcs[k]; }
    me.x = L.spawns[0].x; me.z = L.spawns[0].z;
    if (!$('#mpBook').hidden) toggleBook(true);
  }
  function levelPicker(canPick) {
    return `<div class="mp-levels">${LEVEL_ORDER.map((id) => {
      const X = LEVELS[id];
      return `<button class="mp-level${id === levelId ? ' on' : ''}" data-level="${id}" ${canPick ? '' : 'disabled'}><span class="ico">${X.emoji}</span><b>${esc(X.client)}</b><small>${esc(X.title)}</small></button>`;
    }).join('')}${COMING_SOON.map((X) => `<button class="mp-level soon" data-soon-level="${X.id}"><span class="ico">${X.emoji}</span><b>${esc(X.client)}</b><small>${esc(X.title)}</small><em>🚧 Đang phát triển</em></button>`).join('')}</div>
    <div class="mp-soon-note" id="mpSoonNote" hidden></div>`;
  }
  function wirePicker(after) {
    screen.querySelectorAll('[data-level]').forEach((b) => { b.onclick = () => { setLevel(b.dataset.level); after(); }; });
    // demo cards: show the teaser, nothing to play yet
    screen.querySelectorAll('[data-soon-level]').forEach((b) => {
      b.onclick = () => {
        const X = COMING_SOON.find((c) => c.id === b.dataset.soonLevel);
        const note = screen.querySelector('#mpSoonNote');
        if (!X || !note) return;
        note.innerHTML = `<b>${X.emoji} ${esc(X.client)} · ${esc(X.title)}</b> <span class="tag">🚧 Đang phát triển</span><br>${esc(X.teaser)}<br><span class="muted">Màn này chưa chơi được. Trong lúc chờ, thử 4 khách hàng ở trên nhé!</span>`;
        note.hidden = false;
      };
    });
  }
  rig.bounds = null;
  const me = { x: L.spawns[0].x, z: L.spawns[0].z, r: Math.PI, moving: 0 };
  const remote = {};       // id -> { x, z, r, tx, tz, tr, moving }
  const avatars = {};      // id -> { mesh, tag, bar, status, statusText, item }
  const placed = {};       // station id -> item mesh
  const floorItems = {};   // item id -> mesh
  let posT = 0, lastSent = '';

  // ---------- helpers ----------
  const fmtTime = (s) => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const inviteUrl = () => {
    const u = new URL(location.href);
    u.search = '';
    u.searchParams.set('mp', '1');
    u.searchParams.set('room', code);
    if (netKind === 'local') u.searchParams.set('net', 'local');
    return u.toString();
  };
  const orderedMembers = () => Object.values(members).sort((a, b) => (b.host ? 1 : 0) - (a.host ? 1 : 0) || (a.joinedAt || 0) - (b.joinedAt || 0));
  const hostMember = () => Object.values(members).find((m) => m.host);

  function show(html) { screen.innerHTML = html; screen.hidden = false; }
  function hideScreen() { screen.hidden = true; screen.innerHTML = ''; }

  // ---------- screens ----------
  function homeScreen(err = '', presetCode = '') {
    mode = 'home';
    hud.hidden = true; $('#mobile').hidden = true;
    show(`<div class="mp-card">
      <div class="kicker">MULTIPLAYER · CO-OP 1–4 NGƯỜI · BẢN THỬ</div>
      <div class="mp-logo">Overdeadline <span>& Overburnout</span></div>
      <p>Bạn và đồng đội là nhân viên <b>SOS Advisory</b> <i>· Gọi là tới, tới là trễ</i>. Các công ty bên Solo gọi tới khi cháy deadline. Chạy qua lại, làm file, in, xin chữ ký, nộp cho khách trước khi hết giờ. Và nhớ nghỉ, không là burnout.</p>
      <label class="mp-field">Tên của bạn<input class="mp-input" id="mpName" maxlength="14" placeholder="VD: Linh" value="${esc(name)}" autocomplete="off"></label>
      <div class="mp-field">Khách hàng (màn chơi)${levelPicker(true)}</div>
      <div class="mp-row"><button class="btn primary" id="mpCreate">🚨 Tạo phòng</button><button class="btn" id="mpSolo">🧑‍💻 Tập một mình</button></div>
      <p class="mp-or">— hoặc vào phòng của bạn bè —</p>
      <div class="mp-row"><input class="mp-input mp-code-in" id="mpCode" maxlength="5" placeholder="MÃ" value="${esc(presetCode)}" autocomplete="off"><button class="btn" id="mpJoin">Vào phòng →</button></div>
      ${err ? `<div class="mp-err">${esc(err)}</div>` : ''}
      <div class="mp-help">💻 <kbd>WASD</kbd>/mũi tên đi · <kbd>Space</kbd>/<kbd>E</kbd> làm mọi thứ (lấy, đặt, làm việc, nộp).<br>📱 Cần điều khiển bên trái, nút tròn bên phải.</div>
      <div class="mp-row"><button class="mp-link" id="mpBack">← Menu chính</button></div>
    </div>`);
    const readName = () => { name = cleanName($('#mpName').value); store.set('mp_name', name); return name; };
    $('#mpCreate').onclick = () => { unlockAudio(); readName(); createRoom(); };
    $('#mpSolo').onclick = () => { unlockAudio(); readName(); practice(); };
    $('#mpJoin').onclick = () => { unlockAudio(); readName(); const c = normCode($('#mpCode').value); if (c.length < 5) { homeScreen('Mã phòng có 5 ký tự.', c); return; } join(c); };
    $('#mpCode').onkeydown = (e) => { if (e.key === 'Enter') $('#mpJoin').click(); };
    $('#mpBack').onclick = () => leaveAll(true);
    wirePicker(() => { const n = $('#mpName').value, c = $('#mpCode').value; homeScreen(err, c); $('#mpName').value = n; });
    if (!presetCode) $('#mpName').focus();
  }

  function roomScreen(note = '') {
    mode = 'room';
    hud.hidden = true; $('#mobile').hidden = true;
    const ms = orderedMembers();
    const slots = [];
    for (let i = 0; i < MAX_PLAYERS; i++) {
      const m = ms[i];
      slots.push(m ? `<div class="mp-member"><i style="background:${m.color || PLAYER_COLORS[i]}"></i>${esc(m.name)}${m.id === myId ? ' (bạn)' : ''}<small>${m.host ? 'host' : ''}</small></div>` : '<div class="mp-member empty">Chỗ trống… mời thêm bạn</div>');
    }
    const recipes = Object.values(L.recipes).map((r) => `<div><b>${esc(r.title)}</b>${r.steps.map(esc).join(r.join || ' → ')} <span class="muted">· ${r.reward}k</span></div>`).join('');
    show(`<div class="mp-card">
      <div class="kicker">SOS ADVISORY · PHÒNG CHỜ</div>
      <h2>Mã phòng</h2>
      <div class="mp-code" id="mpCodeShow">${esc(code)}</div>
      <div class="mp-row"><button class="btn" id="mpInvite">📨 Mời bạn (gửi link)</button></div>
      <div class="mp-members">${slots.join('')}</div>
      ${isHost ? `<div class="mp-field">Khách hàng (host chọn)${levelPicker(true)}</div>` : ''}
      <div class="mp-client"><span class="ico">${L.emoji}</span><div><b>Khách hàng: ${esc(L.client)} · ${esc(L.title)}</b><span class="muted">${esc(L.blurb)}</span></div></div>
      <div class="mp-recipes">${recipes}</div>
      <div class="mp-row"><button class="btn ghost" id="mpBookRoom">📖 Xem cách làm từng việc</button></div>
      ${note ? `<div class="mp-err">${esc(note)}</div>` : ''}
      <div class="mp-row">${isHost ? '<button class="btn primary" id="mpStart">Bắt đầu ▶</button>' : '<span class="muted" style="font-weight:800">⏳ Chờ host bấm bắt đầu…</span>'}</div>
      <div class="mp-row"><button class="mp-link" id="mpLeave">← Rời phòng</button></div>
    </div>`);
    $('#mpInvite').onclick = invite;
    $('#mpBookRoom').onclick = () => toggleBook(true);
    if (isHost) wirePicker(() => { roomScreen(note); hostBroadcastLobby(); });
    $('#mpLeave').onclick = () => leaveAll(false);
    if (isHost) $('#mpStart').onclick = () => hostStart();
  }

  async function invite() {
    const url = inviteUrl();
    const text = `Vào SOS Advisory cứu deadline với mình! Mã phòng ${code}`;
    try {
      if (navigator.share && isTouch) { await navigator.share({ title: 'Overdeadline & Overburnout', text, url }); return; }
    } catch { /* cancelled */ }
    try { await navigator.clipboard.writeText(url); toast('📋 Đã chép link mời. Dán vào Messenger / Zalo nhé!', 'good'); }
    catch { toast(`Link mời: ${esc(url)}`, 'msg', 8); }
  }

  // ---------- rooms ----------
  async function connect(roomCode, host) {
    code = roomCode; isHost = host;
    show('<div class="mp-card"><h2>Đang kết nối…</h2><p class="muted">Gọi điện cho khách hàng 📞</p></div>');
    try {
      net = await joinRoom(netKind, code, { name, host, joinedAt: Date.now() });
    } catch (e) {
      console.warn('room failed', e);
      net = null;
      homeScreen('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại nhé.', host ? '' : code);
      return false;
    }
    net.on('lobby', onLobby);
    net.on('start', onStart);
    net.on('st', onSnapshot);
    net.on('pos', onPos);
    net.on('act', onAct);
    net.on('answer', onAnswer);
    net.on('back', () => { if (!isHost) { endPlay(); roomScreen(); } });
    net.onMembers(onMembers);
    window.addEventListener('pagehide', () => net && net.leave());
    return true;
  }

  async function createRoom() {
    if (!(await connect(newRoomCode(), true))) return;
    roomScreen();
    hostBroadcastLobby();
  }

  async function join(c) {
    if (!(await connect(c, false))) return;
    show(`<div class="mp-card"><h2>Đang tìm phòng ${esc(c)}…</h2><p class="muted">Chờ host trả lời</p></div>`);
    clearTimeout(joinTimeout);
    joinTimeout = setTimeout(() => {
      if (!hostMember()) { leaveNet(); homeScreen(`Không tìm thấy phòng ${c}. Kiểm tra lại mã, hoặc host đã rời phòng.`, c); }
    }, netKind === 'local' ? 4000 : 8000);
  }

  async function practice() {
    code = 'SOLO'; isHost = true;
    net = await joinRoom('none', code, { name, host: true, joinedAt: Date.now() });
    net.onMembers(onMembers);
    hostStart();
  }

  function onMembers(m) {
    const before = members;
    members = {};
    for (const [id, v] of Object.entries(m)) members[id] = { ...v, id };
    // colours by join order
    orderedMembers().forEach((x, i) => { x.color = PLAYER_COLORS[i % PLAYER_COLORS.length]; });
    if (isHost) {
      // someone left mid-game
      if (game && mode === 'play') {
        for (const id of Object.keys(game.players)) if (!members[id] && id !== myId) { pushEvents(removePlayer(game, id)); removeAvatar(id); }
      }
      hostBroadcastLobby();
      if (mode === 'room') roomScreen();
      return;
    }
    // guest
    const hadHost = Object.values(before).some((x) => x.host);
    if (hadHost && !hostMember()) { leaveNet(); endPlay(); homeScreen('Host đã rời phòng. Tạo phòng mới hoặc vào phòng khác nhé.'); return; }
    if (hostMember() && Object.keys(members).length > MAX_PLAYERS && orderedMembers().findIndex((x) => x.id === myId) >= MAX_PLAYERS) {
      leaveNet(); homeScreen(`Phòng ${code} đã đủ ${MAX_PLAYERS} người.`); return;
    }
    if (mode === 'room') roomScreen();
  }

  function hostBroadcastLobby() {
    if (!isHost || !net) return;
    net.send('lobby', { mode, level: levelId, players: roster.map((p) => p.id) });
  }

  function onLobby(msg) {
    if (isHost) return;
    clearTimeout(joinTimeout);
    if (mode !== 'play' && msg.level) setLevel(msg.level);
    if (mode !== 'play') roomScreen(msg.mode === 'play' ? 'Nhóm đang chơi dở. Ván sau bạn vào cùng nhé!' : '');
  }

  // ---------- game start / end ----------
  function hostStart() {
    const ms = orderedMembers().slice(0, MAX_PLAYERS);
    roster = ms.map((m, i) => ({ id: m.id, name: m.name, color: PLAYER_COLORS[i] }));
    game = createGame(levelId, { seed: (Math.random() * 2 ** 31) | 0, players: roster });
    countdown = COUNTDOWN;
    evQueue = [];
    net.send('start', { level: levelId, players: roster });
    beginPlay();
    sendSnapshot();
    hostBroadcastLobby();
    lastHostTick = performance.now();
    clearInterval(hostTimer);
    // the host simulates on a timer, not on animation frames, so a hidden host tab keeps the game going
    hostTimer = setInterval(hostTick, 50);
  }

  function onStart(msg) {
    if (isHost) return;
    clearTimeout(joinTimeout);
    roster = msg.players;
    if (!roster.some((p) => p.id === myId)) { if (mode !== 'play') roomScreen('Nhóm đang chơi dở. Ván sau bạn vào cùng nhé!'); return; }
    if (msg.level) setLevel(msg.level);
    game = null;
    beginPlay();
  }

  function beginPlay() {
    mode = 'play';
    document.body.classList.add('mp-play'); // toasts move to the bottom so they never cover the stations
    round++;
    hideScreen();
    hud.hidden = false;
    $('#mobile').hidden = !isTouch;
    const ab = $('#actBtn'); if (ab) ab.hidden = true;
    for (const id of Object.keys(avatars)) removeAvatar(id);
    for (const k of Object.keys(placed)) { placed[k].removeFromParent(); delete placed[k]; }
    for (const k of Object.keys(floorItems)) { floorItems[k].removeFromParent(); delete floorItems[k]; }
    for (const k of Object.keys(npcs)) { scene.remove(npcs[k].mesh); delete npcs[k]; }
    const idx = Math.max(0, roster.findIndex((p) => p.id === myId));
    const sp = L.spawns[idx % L.spawns.length];
    me.x = sp.x; me.z = sp.z; me.r = Math.PI;
    lastEvSeq = 0;
    buildHud();
  }

  function endPlay() {
    document.body.classList.remove('mp-play');
    clearInterval(hostTimer); hostTimer = null;
    mode = mode === 'play' ? 'room' : mode;
    hud.hidden = true; $('#mobile').hidden = true;
  }

  function resultsScreen(g) {
    const stars = starsFor(g);
    const goals = starGoals(g);
    const starHtml = [0, 1, 2].map((i) => `<span class="${i < stars ? '' : 'off'}">⭐</span>`).join('');
    show(`<div class="mp-card" style="text-align:center">
      <div class="kicker">HẾT GIỜ · ${esc(L.client.toUpperCase())}</div>
      <h2>${stars === 3 ? 'Khách quá hài lòng!' : stars === 2 ? 'Ổn áp!' : stars === 1 ? 'Tạm qua…' : 'Khách đang soạn email complain'}</h2>
      <div class="mp-stars">${starHtml}</div>
      <div class="mp-res"><div><b>${g.money}k</b>doanh thu</div><div><b>${g.done}</b>việc đã nộp</div><div><b>${g.failed}</b>trễ deadline</div></div>
      <p class="muted" style="font-size:12.5px">Mốc sao: ${goals.map((x) => x + 'k').join(' · ')}</p>
      <div class="mp-quote">${esc((L.quotes || QUOTES)[stars])}</div>
      <div class="mp-row">${isHost ? `<button class="btn primary" id="mpAgain">🔁 Chơi lại</button>${code !== 'SOLO' ? '<button class="btn" id="mpRoom">Về phòng chờ</button>' : ''}` : '<span class="muted" style="font-weight:800">⏳ Chờ host chọn chơi lại…</span>'}</div>
      <div class="mp-row"><button class="mp-link" id="mpQuit">${code === 'SOLO' ? '← Về sảnh Multiplayer' : '← Rời phòng'}</button></div>
    </div>`);
    sfx[stars >= 2 ? 'good' : 'bad']();
    if (isHost) {
      $('#mpAgain').onclick = () => hostStart();
      const back = $('#mpRoom');
      if (back) back.onclick = () => { endPlay(); net.send('back', {}); roomScreen(); hostBroadcastLobby(); };
    }
    $('#mpQuit').onclick = () => leaveAll(false);
  }

  // ---------- host loop ----------
  // host: events get a sequence number, are shown here at once and ride along with the next few snapshots
  function pushEvents(evs) {
    if (!evs.length) return;
    const fresh = evs.map((e) => ({ ...e, seq: ++evSeq }));
    evQueue = evQueue.concat(fresh).slice(-20);
    handleEvents(fresh);
  }

  function hostTick() {
    if (!game) return;
    const now = performance.now();
    const dt = Math.min(1, (now - lastHostTick) / 1000);
    lastHostTick = now;
    setPlayerPos(game, myId, me.x, me.z);
    if (countdown > 0) {
      countdown = Math.max(0, countdown - dt);
    } else if (game.phase === 'play') {
      pushEvents(step(game, dt));
    }
    snapT += dt;
    if (snapT >= SNAP_EVERY) { snapT = 0; sendSnapshot(); }
  }

  function sendSnapshot() {
    if (!game) return;
    net.send('st', { g: game, cd: countdown, ev: evQueue });
  }

  function onAct(msg) {
    if (!isHost || !game || countdown > 0) return;
    if (!game.players[msg.id]) return;
    setPlayerPos(game, msg.id, msg.x, msg.z);
    pushEvents(act(game, msg.id));
    snapT = SNAP_EVERY; // send right away
  }

  function onAnswer(msg) {
    if (!isHost || !game || !game.players[msg.id]) return;
    pushEvents(answerQuiz(game, msg.id, !!msg.pass));
    snapT = SNAP_EVERY;
  }

  // ---------- interview card (HR): pass or reject the candidate ----------
  let quizShown = null; // "station:q" of the card on screen
  function answer(pass) {
    if (!quizShown) return;
    quizShown = null; $('#mpQuiz').hidden = true;
    unlockAudio();
    if (isHost) { pushEvents(answerQuiz(game, myId, pass)); snapT = SNAP_EVERY; }
    else net.send('answer', { id: myId, pass });
  }
  function updateQuiz() {
    const el = $('#mpQuiz');
    const qz = mode === 'play' && game && game.quizzes && game.quizzes[myId];
    const Q = qz && L.quiz && L.quiz[qz.q];
    if (!Q) { if (!el.hidden) el.hidden = true; quizShown = null; return; }
    const key = `${qz.station}:${qz.q}`;
    if (quizShown !== key && quizShown !== 'answered:' + key) {
      quizShown = key;
      el.innerHTML = `<div class="mp-quiz-k">🎤 PHỎNG VẤN · bạn hỏi</div>
        <div class="mp-quiz-q">"${esc(Q.q)}"</div>
        <div class="mp-quiz-a"><span>🙋 Ứng viên:</span> "${esc(Q.a)}"</div>
        <div class="mp-quiz-bar"><i id="mpQuizT"></i></div>
        <div class="mp-quiz-btns"><button class="btn primary" id="mpPass">✅ Cho qua vòng${isTouch ? '' : ' <kbd>1</kbd>'}</button><button class="btn" id="mpReject">❌ Loại${isTouch ? '' : ' <kbd>2</kbd>'}</button></div>`;
      $('#mpPass').onclick = () => answer(true);
      $('#mpReject').onclick = () => answer(false);
      el.hidden = false;
    }
    const bar = $('#mpQuizT');
    if (bar) { const k = Math.max(0, qz.t / qz.total); bar.style.width = (k * 100).toFixed(1) + '%'; bar.style.background = k < 0.35 ? '#ff6f8a' : '#9be7c4'; }
  }

  // ---------- guest ----------
  function onSnapshot(msg) {
    if (isHost) return;
    if (!msg.g.players[myId]) return; // not in this game (joined late): wait in the room
    if (msg.g.level !== levelId) { setLevel(msg.g.level); game = null; if (mode === 'play') beginPlay(); }
    // the roster always follows the host's snapshot (also covers a missed 'start' message)
    roster = Object.values(msg.g.players).map((p) => ({ id: p.id, name: p.name, color: p.color }));
    if (mode !== 'play' || (game && game.phase === 'over' && msg.g.phase === 'play')) { game = null; beginPlay(); }
    const wasOver = game && game.phase === 'over';
    game = msg.g; countdown = msg.cd;
    handleEvents(msg.ev || []);
    if (game.phase === 'over' && !wasOver) finishView();
  }

  function onPos(msg) {
    if (msg.id === myId) return;
    const r = remote[msg.id] || (remote[msg.id] = { x: msg.x, z: msg.z, r: msg.r, tx: msg.x, tz: msg.z, tr: msg.r, moving: 0 });
    r.tx = msg.x; r.tz = msg.z; r.tr = msg.r; r.moving = msg.m ? 1 : 0;
    if (isHost && game) setPlayerPos(game, msg.id, msg.x, msg.z);
  }

  // ---------- events ----------
  function handleEvents(evs) {
    for (const e of evs) {
      if (e.seq <= lastEvSeq) continue;
      lastEvSeq = e.seq;
      if (e.to && e.to !== myId) continue;
      if (e.type === 'served' || e.type === 'gone') { moods[e.order] = e.type === 'served' ? 'happy' : 'angry'; continue; }
      if (e.type === 'toast') toast(esc(e.text), e.cls || '', 3.2);
      else if (e.type === 'sfx' && sfx[e.name]) sfx[e.name]();
      else if (e.type === 'over' && isHost) finishView();
    }
  }

  // guests get a new state object with every snapshot, so the round is tracked with a counter, not by identity
  let round = 0;
  function finishView() {
    const r = round;
    setTimeout(() => {
      if (mode === 'play' && r === round && game && game.phase === 'over') { hud.hidden = true; $('#mobile').hidden = true; resultsScreen(game); }
    }, 900);
  }

  // ---------- my action ----------
  function useAction() {
    if (mode !== 'play' || !game || countdown > 0 || game.phase !== 'play') return;
    const p = game.players[myId];
    if (!p || isFrozen(p)) return;
    unlockAudio();
    if (isHost) { setPlayerPos(game, myId, me.x, me.z); pushEvents(act(game, myId)); snapT = SNAP_EVERY; }
    else net.send('act', { id: myId, x: +me.x.toFixed(2), z: +me.z.toFixed(2) });
  }
  const offKey = input.onKey((e, { inField }) => {
    if (inField) return;
    if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') { if (mode === 'play') { e.preventDefault(); useAction(); } }
    if (quizShown && (e.code === 'Digit1' || e.code === 'Numpad1')) { answer(true); return; }
    if (quizShown && (e.code === 'Digit2' || e.code === 'Numpad2')) { answer(false); return; }
    if (e.code === 'KeyH') { toggleBook(); return; }
    if (e.code === 'Escape' && !$('#mpBook').hidden) { toggleBook(false); return; }
    if (e.code === 'Escape' && mode === 'play') confirmLeave();
  });

  function confirmLeave() {
    if (confirm(code === 'SOLO' ? 'Bỏ ván tập này?' : 'Rời phòng? Đồng đội sẽ phải gánh phần của bạn 🥲')) leaveAll(false);
  }

  // ---------- 📖 recipe book (the game keeps running: it is online) ----------
  function bookHtml() {
    const items = Object.values(L.recipes).map((r) => `<div class="mp-rec">
      <div class="mp-rec-h"><b>${ITEMS[r.item].icon} ${esc(r.title)}</b><span>${r.reward}k</span></div>
      <ol>${(r.how || r.steps).map((x) => `<li>${esc(x)}</li>`).join('')}</ol></div>`).join('');
    const tips = (L.tips || []).map((t) => `<li>${esc(t)}</li>`).join('');
    return `<div class="mp-book-head"><b>📖 Công thức · ${esc(L.client)}</b><button class="icon-btn" id="mpBookClose" title="Đóng (H)">✕</button></div>
      <p class="muted mp-book-sub">Game vẫn chạy khi mở sổ này. Bấm ${isTouch ? '✕' : '<kbd>H</kbd> hoặc ✕'} để đóng.</p>
      ${items}
      ${tips ? `<div class="mp-rec tips"><div class="mp-rec-h"><b>💡 Mẹo</b></div><ul>${tips}</ul></div>` : ''}`;
  }
  function toggleBook(force) {
    const el = $('#mpBook');
    const open = force === undefined ? el.hidden : force;
    if (open) { el.innerHTML = bookHtml(); $('#mpBookClose').onclick = () => toggleBook(false); el.scrollTop = 0; }
    el.hidden = !open;
    const b = $('#mpBookBtn'); if (b) b.classList.toggle('on', open);
  }

  // ---------- HUD ----------
  function buildHud() {
    hud.innerHTML = `
      <div class="mp-top">
        <div class="mp-clock"><div class="t" id="mpTime">3:00</div><div class="m" id="mpMoney">💰 0k</div><div class="s" id="mpGoal"></div></div>
        <div class="mp-orders" id="mpOrders"></div>
        <div style="width:170px;flex:none" class="mp-spacer"></div>
      </div>
      <div class="mp-side"><div class="mp-btns"><button class="icon-btn mp-book-btn" id="mpBookBtn" title="Công thức (H)">📖</button><button class="icon-btn" id="mpExit" title="Rời phòng (Esc)">🚪</button></div><div class="mp-team" id="mpTeam"></div></div>
      <div class="mp-hint" id="mpHint" hidden></div>
      <div class="mp-banner" id="mpBanner" hidden></div>
      ${isTouch ? '<button id="mpAct">LÀM<br>✋</button>' : ''}`;
    $('#mpExit').onclick = confirmLeave;
    $('#mpBookBtn').onclick = () => toggleBook();
    const ab = $('#mpAct');
    if (ab) ab.addEventListener('touchstart', (e) => { e.preventDefault(); useAction(); }, { passive: false });
    lastOrdersKey = '';
  }

  let lastOrdersKey = '', hudT = 0;
  function updateHud(dt) {
    if (!game) return;
    hudT += dt;
    const p = game.players[myId];
    // countdown / stand-up banner
    const banner = $('#mpBanner');
    if (countdown > 0) {
      banner.hidden = false; banner.className = 'mp-banner big';
      banner.innerHTML = (countdown > 0.5 ? String(Math.ceil(countdown - 0.5)) : 'GO!') + `<small>Không biết làm sao? Bấm 📖${isTouch ? '' : ' (H)'} xem công thức</small>`;
    } else if (p && p.meeting > 0) {
      banner.hidden = false; banner.className = 'mp-banner';
      banner.innerHTML = `📋 Đang stand-up… ${Math.ceil(p.meeting)}s<small>Anh Đạt: "15 phút thôi."</small>`;
    } else if (p && p.collapsed > 0) {
      banner.hidden = false; banner.className = 'mp-banner';
      banner.innerHTML = `🫠 BURNOUT · ${Math.ceil(p.collapsed)}s<small>Lần sau ghé Pantry uống cà phê nhé</small>`;
    } else banner.hidden = true;

    if (hudT < 0.1) return;
    hudT = 0;
    const t = $('#mpTime');
    t.textContent = fmtTime(game.time);
    t.classList.toggle('low', game.time <= 30);
    $('#mpMoney').textContent = `💰 ${game.money}k`;
    const goals = starGoals(game);
    const got = goals.filter((x) => game.money >= x).length;
    $('#mpGoal').textContent = `${'⭐'.repeat(got)}${got < 3 ? ` tới ${goals[got]}k` : ' max!'}`;

    // tickets
    const key = game.orders.map((o) => o.id).join(',');
    const box = $('#mpOrders');
    if (key !== lastOrdersKey) {
      lastOrdersKey = key;
      box.innerHTML = game.orders.map((o) => {
        const R = L.recipes[o.recipe];
        return `<div class="mp-ticket" data-o="${o.id}"><small class="who">${esc(clientName(game, o))} cần</small><b>${ITEMS[R.item].icon} ${esc(R.title)}</b><div class="st">${R.steps.map(esc).join(R.join || ' → ')}</div><div class="tb"><i></i></div></div>`;
      }).join('') || '<div class="mp-ticket"><b>☕ Chưa có việc</b><div class="st">Tranh thủ uống cà phê…</div></div>';
    }
    for (const o of game.orders) {
      const el = box.querySelector(`[data-o="${o.id}"]`);
      if (!el) continue;
      const k = Math.max(0, o.t / o.total);
      el.querySelector('i').style.width = (k * 100).toFixed(1) + '%';
      el.classList.toggle('hot', k < 0.3);
    }
    // team burnout
    $('#mpTeam').innerHTML = roster.filter((r) => game.players[r.id]).map((r) => {
      const q = game.players[r.id];
      const b = Math.round(q.burnout);
      const col = b >= 70 ? '#ff6f8a' : b >= 40 ? '#ffd25a' : '#9be7c4';
      const tag = q.collapsed > 0 ? '🫠' : q.meeting > 0 ? '📋' : '';
      return `<div><i class="dot" style="background:${r.color}"></i><span>${esc(r.name)}${r.id === myId ? ' (bạn)' : ''} ${tag}</span><div class="bb" title="Burnout ${b}%"><i style="width:${b}%;background:${col}"></i></div></div>`;
    }).join('');
    // action hint
    const hint = $('#mpHint');
    const h = p && countdown <= 0 ? hintFor(game, { ...p, x: me.x, z: me.z }) : null;
    hint.hidden = !h;
    if (h) { hint.innerHTML = `${isTouch ? '✋' : '<kbd>Space</kbd>'} ${esc(h)}`; hint.classList.add('on'); }
    const ab = $('#mpAct');
    if (ab) ab.style.opacity = h ? '1' : '.55';
  }

  // ---------- rendering ----------
  const statusTex = {};
  function statusSprite(text) {
    if (!statusTex[text]) statusTex[text] = textTexture([text], { w: 256, h: 96, sizes: [48], bg: '#ffffff', radius: 40 });
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: statusTex[text], transparent: true, depthWrite: false }));
    sp.scale.set(0.8, 0.3, 1); sp.renderOrder = 12;
    return sp;
  }

  function avatarFor(id, info, i) {
    if (avatars[id]) return avatars[id];
    const mesh = makePerson({ shirt: info.color, pants: '#3a3f55', hair: HAIR[i % HAIR.length], hairColor: ['#2b1d1d', '#1d1d1f', '#5a3a2a', '#2a2a2a'][i % 4], pods: i === 1, glasses: i === 3 });
    const tag = nameTag(info.name + (id === myId ? ' (bạn)' : ''), null, { size: 'top', color: info.color });
    tag.position.y = 2.05; tag.scale.multiplyScalar(0.85);
    mesh.add(tag);
    const bar = makeBar(0.8, 0.1);
    bar.position.y = 2.38;
    mesh.add(bar);
    scene.add(mesh);
    const a = { mesh, tag, bar, status: null, statusText: '', item: null, itemType: null };
    avatars[id] = a;
    return a;
  }
  function removeAvatar(id) {
    const a = avatars[id];
    if (!a) return;
    scene.remove(a.mesh);
    delete avatars[id];
    delete remote[id];
  }

  function syncItem(holder, existing, type, setter) {
    if (!type) { if (existing) existing.removeFromParent(); setter(null); return; }
    if (existing) { existing.setType(type); return; }
    const m = makeItem(type);
    holder.add(m);
    setter(m);
  }

  // ---------- clients in the lobby (visual only, driven by the host's order list) ----------
  const npcs = {};   // order id -> { mesh, phase: in|wait|out, path, line, bubble, said }
  const moods = {};  // order id -> happy | angry (from served / gone events)
  function sayOver(npc, text) {
    if (npc.said === text) return;
    if (npc.line) npc.mesh.remove(npc.line);
    npc.line = text ? speechSprite(text) : null;
    if (npc.line) { npc.line.position.y = 3.05; npc.mesh.add(npc.line); }
    npc.said = text;
  }
  const speechTex = {};
  function speechSprite(text) {
    if (!speechTex[text]) speechTex[text] = textTexture([text], { w: 512, h: 120, sizes: [50], bg: '#ffffff', radius: 50 });
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: speechTex[text], transparent: true, depthWrite: false }));
    sp.scale.set(1.7, 0.4, 1); sp.renderOrder = 12;
    return sp;
  }
  function updateClients(dt) {
    const pick = (arr, k) => arr[Math.abs(k) % arr.length];
    const lines = L.clientLines || { wait: [''], happy: [''], angry: [''] };
    const live = new Set();
    for (const o of game.orders) {
      live.add(String(o.id));
      let n = npcs[o.id];
      if (!n) {
        const c = (L.clients || [])[o.client] || { name: 'Khách', look: { shirt: '#ddd' } };
        const mesh = makeClient(c);
        const [door0, door1] = L.clientDoor;
        mesh.position.set(door0.x, 0, door0.z);
        scene.add(mesh);
        const bubble = itemIcon(L.recipes[o.recipe].item);
        bubble.position.y = 2.62; bubble.scale.set(0.55, 0.55, 1);
        mesh.add(bubble);
        const spot = L.clientSpots[o.spot % L.clientSpots.length];
        n = npcs[o.id] = { mesh, phase: 'in', path: [door1, spot], bubble, line: null, said: '' };
      }
      // patience
      const k = Math.max(0, o.t / o.total);
      n.mesh.userData.bar.set(Math.max(0.02, k), k < 0.3 ? (Math.sin(animT * 10) > 0 ? '#ff6f8a' : '#ffd25a') : k < 0.6 ? '#ffd25a' : '#9be7c4');
      if (n.phase === 'wait') sayOver(n, k < 0.35 ? pick(lines.wait, o.id) : '');
    }
    for (const [id, n] of Object.entries(npcs)) {
      if (!live.has(id) && n.phase !== 'out') {
        const happy = moods[id] !== 'angry';
        n.phase = 'out';
        n.path = [L.clientDoor[1], L.clientDoor[0]];
        n.mesh.remove(n.bubble);
        n.mesh.userData.bar.set(0);
        sayOver(n, (happy ? '😍 ' : '😤 ') + pick(happy ? lines.happy : lines.angry, +id));
      }
      // walk along the path
      const target = n.path[0];
      const parts = n.mesh.userData.parts;
      if (target) {
        const dx = target.x - n.mesh.position.x, dz = target.z - n.mesh.position.z;
        const d = Math.hypot(dx, dz), v = 2.4 * dt;
        if (d <= v) { n.mesh.position.x = target.x; n.mesh.position.z = target.z; n.path.shift(); }
        else { n.mesh.position.x += dx / d * v; n.mesh.position.z += dz / d * v; n.mesh.rotation.y = Math.atan2(dx, dz); }
        if (parts) { const sw = Math.sin(animT * 10) * 0.5; parts.legL.rotation.x = sw; parts.legR.rotation.x = -sw; }
      } else {
        if (parts) { parts.legL.rotation.x = 0; parts.legR.rotation.x = 0; }
        if (n.phase === 'in') { n.phase = 'wait'; }
        if (n.phase === 'wait') n.mesh.rotation.y = angleLerp(n.mesh.rotation.y, Math.PI, 0.15); // face the counter
        if (n.phase === 'out') { scene.remove(n.mesh); delete npcs[id]; delete moods[id]; }
      }
    }
  }

  // an item about to "ghost" (HR: candidates left lying around) blinks
  function ghostBlink(mesh, it) {
    const D = L.decay, icon = mesh.userData.icon;
    if (!icon) return;
    const warn = D && it && D.types.includes(it.type) && (it.idle || 0) > D.after * 0.55;
    icon.material.opacity = warn ? (Math.sin(animT * 12) > 0 ? 1 : 0.25) : 1;
  }

  let animT = 0;
  function render(dt) {
    animT += dt;
    world.animate(animT);
    if (!game) return;
    updateClients(dt);
    // stations
    const myP = game.players[myId];
    const myTarget = myP && !isFrozen(myP) ? targetOf(game, { ...myP, x: me.x, z: me.z }).station : null;
    const anyOff = Object.values(game.stations).some((x) => x.off);
    for (const s of Object.values(game.stations)) {
      const m = world.stations[s.id];
      const it = s.item && game.items[s.item];
      syncItem(m.userData.slot, placed[s.id], it && it.type, (v) => { if (v) placed[s.id] = v; else delete placed[s.id]; });
      if (placed[s.id]) ghostBlink(placed[s.id], it);
      if (m.userData.seats) {
        const n = it ? parseInt(String(it.id).replace(/\D/g, ''), 10) || 0 : -1;
        const sit = it && ['cv_ok', 'interviewed', 'bad_hire'].includes(it.type);
        m.userData.seats.forEach((c, i) => { c.visible = sit && i === n % m.userData.seats.length; });
      }
      let v = 0, col = '#9be7c4';
      if (s.busy) { v = s.progress; col = s.kind === 'boss' ? '#ff8fb1' : '#bfe3ff'; }
      else if (s.overdue > 0) { v = s.overdue / 8; col = Math.sin(animT * 14) > 0 ? '#ff6f8a' : '#ffd25a'; }
      else if (s.progress > 0) v = s.progress; // someone working on it
      m.userData.bar.set(v, col);
      m.userData.ring.visible = !!myTarget && myTarget.id === s.id;
      // power cut: dryers show "mất điện", the breaker blinks
      if (m.userData.off) m.userData.off.visible = s.kind === 'breaker' ? anyOff && Math.sin(animT * 8) > -0.2 : !!s.off;
      if (m.userData.heat) m.userData.heat.material.color.set(s.off ? '#8d93a6' : s.busy ? (Math.sin(animT * 9) > 0 ? '#ff8a3d' : '#ffb46b') : '#ffd9b0');
    }
    // floor items
    for (const it of Object.values(game.items)) {
      if (!it.floor) continue;
      let fm = floorItems[it.id];
      if (!fm) { fm = floorItems[it.id] = makeItem(it.type); scene.add(fm); }
      fm.setType(it.type);
      fm.position.set(it.floor.x, 0.02, it.floor.z);
      ghostBlink(fm, it);
    }
    for (const id of Object.keys(floorItems)) {
      const it = game.items[id];
      if (!it || !it.floor) { floorItems[id].removeFromParent(); delete floorItems[id]; }
    }
    // stand-up zone pulses during the warning
    if (world.standup) {
      const warn = game.standup && game.standup.warn;
      world.standup.zone.material.opacity = warn ? 0.35 + 0.25 * Math.sin(animT * 12) : game.standup && game.standup.ring > 0 ? 0.45 : 0.18;
      world.standup.zone.material.color.set(warn || (game.standup && game.standup.ring > 0) ? '#ff6f8a' : '#ffc2b3');
    }
    // players
    roster.forEach((r, i) => {
      const p = game.players[r.id];
      if (!p) { removeAvatar(r.id); return; }
      const a = avatarFor(r.id, r, i);
      let x, z, rot, moving;
      if (r.id === myId) { x = me.x; z = me.z; rot = me.r; moving = me.moving; }
      else {
        const rm = remote[r.id];
        if (rm) {
          const k = 1 - Math.pow(0.0005, dt);
          rm.x += (rm.tx - rm.x) * k; rm.z += (rm.tz - rm.z) * k; rm.r = angleLerp(rm.r, rm.tr, k);
          x = rm.x; z = rm.z; rot = rm.r; moving = rm.moving;
        } else { x = p.x; z = p.z; rot = Math.PI; moving = 0; }
      }
      a.mesh.position.set(x, 0, z);
      a.mesh.rotation.y = rot;
      const parts = a.mesh.userData.parts;
      const collapsed = p.collapsed > 0;
      a.mesh.rotation.x = collapsed ? -0.9 : 0;
      a.mesh.position.y = collapsed ? 0.25 : 0;
      if (parts) {
        const sw = moving && !isFrozen(p) ? Math.sin(animT * 11) * 0.55 : 0;
        parts.legL.rotation.x = sw; parts.legR.rotation.x = -sw;
        const working = p.working ? Math.sin(animT * 22) * 0.25 : 0;
        parts.armL.rotation.x = p.held ? -1.1 : -sw * 0.6 + working;
        parts.armR.rotation.x = p.held ? -1.1 : sw * 0.6 - working;
      }
      // burnout bar
      const b = p.burnout / 100;
      a.bar.set(Math.max(0.02, b), b >= 0.7 ? (Math.sin(animT * 10) > 0 ? '#ff6f8a' : '#ffd25a') : b >= 0.4 ? '#ffd25a' : '#9be7c4');
      // my own tag fades while I stand at a station, so it never hides that station's label
      if (r.id === myId) { const fade = myTarget ? 0.2 : 1; a.tag.material.opacity += (fade - a.tag.material.opacity) * Math.min(1, dt * 10); a.bar.visible = !myTarget; }
      // status bubble
      const st = collapsed ? '🫠 burnout' : p.meeting > 0 ? '📋 đang họp' : p.working ? '💻 đang làm' : isTired(p) ? '🔥 mệt' : p.jitter > 0 ? '💓 run tay' : '';
      if (st !== a.statusText) {
        if (a.status) a.mesh.remove(a.status);
        a.status = st ? statusSprite(st) : null;
        if (a.status) { a.status.position.y = 2.7; a.mesh.add(a.status); }
        a.statusText = st;
      }
      // carried item
      const ht = p.held && game.items[p.held] ? game.items[p.held].type : null;
      if (ht !== a.itemType) {
        if (a.item) { a.item.removeFromParent(); a.item = null; }
        if (ht) { a.item = makeItem(ht); a.item.position.set(0, 0.78, 0.42); a.mesh.add(a.item); }
        a.itemType = ht;
      }
    });
  }

  // ---------- movement ----------
  function moveMe(dt) {
    const p = game && game.players[myId];
    me.moving = 0;
    if (!p || countdown > 0 || game.phase !== 'play') return;
    const sp = speedOf(p);
    if (!sp) return;
    const ax = input.axis();
    const L2 = Math.hypot(ax.x, ax.y);
    if (L2 < 0.05) return;
    const v = SPEED * sp * (input.running() ? 1.2 : 1);
    const others = Object.entries(remote).filter(([id]) => game.players[id]).map(([, r]) => ({ x: r.x, z: r.z }));
    moveActor(me, ax.x * v * dt, -ax.y * v * dt, { colliders: world.colliders, bounds: world.bounds, others, radius: 0.3, otherRadius: 0.62 });
    me.r = angleLerp(me.r, Math.atan2(ax.x, -ax.y), 1 - Math.pow(0.0001, dt));
    me.moving = 1;
  }

  function broadcastPos(dt) {
    if (!net || mode !== 'play') return;
    posT += dt;
    if (posT < POS_EVERY) return;
    posT = 0;
    const msg = { id: myId, x: +me.x.toFixed(2), z: +me.z.toFixed(2), r: +me.r.toFixed(2), m: me.moving };
    const key = `${msg.x},${msg.z},${msg.r},${msg.m}`;
    if (key === lastSent && Math.random() > 0.1) return; // idle: send only now and then
    lastSent = key;
    net.send('pos', msg);
  }

  // ---------- camera ----------
  const look = new THREE.Vector3();
  function updateCamera(dt) {
    const portrait = innerWidth < innerHeight;
    // landscape: the whole room on screen; portrait: follow me inside the room
    if (portrait) {
      rig.zoom = 1.0;
      rig.target.set(Math.max(-5, Math.min(5, me.x)), 0, Math.max(-3, Math.min(3, me.z)) + 0.6);
    } else {
      const aspect = innerWidth / innerHeight;
      rig.zoom = Math.max(1.2, Math.min(1.85, 1.95 / Math.max(1, aspect) + 0.42));
      look.set(me.x * 0.1, 0, me.z * 0.06 + 1.0);
      rig.target.copy(look);
    }
    rig.update(dt);
  }

  // ---------- leave ----------
  function leaveNet() {
    document.body.classList.remove('mp-play');
    clearTimeout(joinTimeout);
    clearInterval(hostTimer); hostTimer = null;
    if (net) { try { net.leave(); } catch { /* gone */ } }
    net = null; isHost = false; members = {}; roster = []; game = null;
    for (const id of Object.keys(avatars)) removeAvatar(id);
  }
  function leaveAll(toMainMenu) {
    leaveNet();
    if (toMainMenu) { offKey(); onExit(); return; }
    endPlay();
    homeScreen();
  }

  // ---------- start ----------
  const roomParam = normCode(params.get('room'));
  if (roomParam.length === 5 && name) join(roomParam);
  else homeScreen('', roomParam);
  rig.snap();

  return {
    update(dt) {
      if (mode === 'play') { moveMe(dt); broadcastPos(dt); updateHud(dt); }
      updateQuiz();
      render(dt);
      updateCamera(dt);
    },
    // test hooks (e2e)
    debug: { get game() { return game; }, get mode() { return mode; }, get level() { return levelId; }, get levelData() { return L; }, get code() { return code; }, me, useAction, get isHost() { return isHost; } },
  };
}
