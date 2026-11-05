// SOLO (first person): pick a company, interview + salary deal, then up to 45 calendar days of work.
// Each workday = a scripted drama episode or a routine day (2–3 short beats), side tasks with deadlines, hunger,
// money, a weekly review every Friday, payday on day 30 and at the end, after-work life events.
// The career profile keeps several runs side by side ("nhảy công ty" never deletes the old run).
// Content contract for companies: docs/COMPANY_CONTRACT.md.
import * as THREE from 'three';
import { $, clamp, esc, angleLerp, store } from '../core/util.js';
import { sfx, unlockAudio, isSoundOn, setSound } from '../core/audio.js';
import { isTouch } from '../core/input.js';
import { createFPControls } from '../core/fpcontrols.js';
import { makePerson, nameTag, makeMarker, makeCat } from '../art/people.js';
import { buildWorld, SPOTS, PLAYER_START, MEETING_SEAT, CAT_PATH } from '../maps/office.js';
import { createDialogue } from '../story/dialogue.js';
import { createPhone } from '../ui/phone.js';
import { toast } from '../ui/toast.js';
import { overlay, hideOverlay } from '../ui/overlay.js';
import { runMinigame } from '../ui/minigame.js';
import { TIERS, TIER_ORDER, tier, fmtVND } from '../game/difficulty.js';
import { emptyProfile, newRun, addRun, updateRun, removeRun, listRuns, runLabel, validateProfile } from '../game/save.js';
import { planTasks, tick, visit, active, summary, currentLeg, shiftTasks, resolveAll, rng } from '../game/tasks.js';
import * as C from '../game/career.js';
import { COMPANY_LIST, companyMeta, companyName, loadCompany } from '../companies/index.js';
import { net, clean } from '../net/legacy-net.js';
import { createCloudPanel } from '../ui/cloudpanel.js';
import { SUPPORT_URL } from '../config.js';
import { FLAGS } from '../flags.js';

const PROFILE_KEY = 'tm_profile_v1'; // key kept from v1 so existing saves carry over (the data itself is migrated)
const BOUNDS = { minX: -14.7, maxX: 14.7, minZ: -9.7, maxZ: 9.85 };
const CLOCK_RATE = 1.0;   // in-game minutes per real second while walking around
const TASK_SCALE = 2;     // side-task deadline = template.base × tier multiplier × this
const MAX_OPEN_TASKS = 3;
const toMin = (hhmm) => { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + (m || 0); };
const fmtClock = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(Math.floor(min % 60)).padStart(2, '0')}`;
const hash = (str) => [...String(str)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const pickOne = (arr, r) => arr[Math.floor(r() * arr.length)];

const DEFAULT_REVIEW = {
  A: ['Tuần này em làm tốt. Tốt đến mức chị hơi nghi.', 'Cứ thế mà phát huy. Đừng để ai biết em giỏi, họ sẽ giao thêm việc.'],
  B: ['Ổn. Không có gì để khen, cũng không có gì để chê. Như cơm trắng.', 'Em làm đúng việc. Giờ làm nhanh hơn một chút.'],
  C: ['Tuần này chị thấy em bận. Nhưng chưa thấy em làm ra cái gì.', 'Em cần chủ động hơn. Và đúng giờ hơn. Và… thôi, hai cái đó trước.'],
  D: ['Em có định tiếp tục ở đây không? Chị hỏi thật.', 'Tuần này là tuần chị phải giải thích với cấp trên vì sao mình nhận intern.'],
};
const WEEKEND_LINES = [
  'Cuối tuần. Bạn ngủ tới 11 giờ trưa, rồi giật mình vì mơ thấy deadline.',
  'Thứ Bảy có "team building tự nguyện". Bạn tự nguyện vắng mặt. Chủ nhật bạn đi chợ và nấu cơm cho cả tuần.',
  'Cuối tuần bạn về nhà. Mẹ hỏi lương. Bố hỏi bao giờ chính thức. Bà hỏi có người yêu chưa.',
  'Group chat công ty im lặng suốt cuối tuần. Đến 21:58 tối Chủ nhật thì sếp gửi một file "để thứ Hai mình bàn".',
];

// Chị Giáo: the developer, standing by the entrance of every company. Talk to her to buy her a coffee (donation).
const GIAO = { name: 'Chị Giáo', role: 'Người làm game · khách mời', emoji: '☕', color: '#ffd6a5', spot: 'giao',
  look: { shirt: '#ffd6a5', pants: '#6b5a7a', hair: 'long', hairColor: '#2b1b14', glasses: true, mug: true } };
const GIAO_ON = !!SUPPORT_URL || FLAGS.giao;
const GIAO_LINES = [
  ['giao', 'Ơ, bạn tìm ra chị rồi à? Chị là Giáo, người làm ra cái game này. Chị đứng đây, không thuộc phòng ban nào cả.'],
  ['giao', 'Cảm ơn bạn đã chơi tới đây. Thật đấy. Mỗi lần có người deal lương 0 đồng là chị lại thấy mình có ích.'],
  ['giao', 'Nếu bạn thấy vui, cho chị xin một cốc cà phê nhé. Không có cũng không sao, chị không trừ lương ai cả.'],
];

export function startSolo({ scene, camera, input, onExit }) {
  let profile = validateProfile(store.json(PROFILE_KEY)) || emptyProfile();
  let R = null;          // active run
  let CO = null;         // active company module
  let mode = 'menu';     // menu | companies | intro | play | dialog | ringing | phone | pause | overlay | away
  const save = () => { if (R) profile = updateRun(profile, R.id, R); try { store.set(PROFILE_KEY, JSON.stringify(profile)); } catch { /* storage full */ } document.dispatchEvent(new CustomEvent('solo:saved')); };
  const fmt = (t) => String(t).replaceAll('{ten}', R ? R.name : 'bạn');
  $('#phoneWifi').textContent = '📶 Office-WiFi-5G';

  // ---------- world (rebuilt when the company changes) ----------
  let world = null, worldCo = null;
  let npcs = {};
  const objMarker = makeMarker(); objMarker.visible = false; scene.add(objMarker);
  const cat = makeCat(); cat.scale.setScalar(1.8); scene.add(cat);
  const catState = { i: 0, nap: 4 };
  cat.position.set(CAT_PATH[0][0], 0, CAT_PATH[0][1]);
  const fp = createFPControls({ camera, input, getMode: () => mode, onPause: () => pause(), start: PLAYER_START });
  const player = fp.player;

  function enterCompany(co) {
    if (worldCo === co.id && world) return;
    if (world) world.dispose();
    for (const n of Object.values(npcs)) scene.remove(n.mesh);
    npcs = {};
    world = buildWorld(scene, co.theme || {});
    worldCo = co.id;
    const people = { ...co.cast, ...(GIAO_ON ? { giao: GIAO } : {}) };
    for (const [id, def] of Object.entries(people)) {
      if (def.body === false || !def.look) continue;
      const mesh = makePerson(def.look);
      mesh.add(nameTag(def.name, String(def.role || '').split('·')[0].trim(), { color: def.color }));
      const marker = makeMarker(); marker.position.y = 2.05; marker.visible = false; mesh.add(marker);
      scene.add(mesh);
      npcs[id] = { mesh, marker, tag: mesh.children.find((c) => c.isSprite), target: new THREE.Vector3(), rest: 0, walk: 0, phase: Math.random() * 6, talking: false };
    }
    placeNPCs(true);
  }

  // ---------- helpers ----------
  function charInfo(id) {
    if (id === 'me') return { name: R ? R.name : 'Bạn', role: R && R.status === 'official' ? 'Nhân viên (bạn)' : 'Intern (bạn)', emoji: '🙂', color: '#bfe3ff' };
    if (id === 'think') return { name: R ? R.name : 'Bạn', role: 'nghĩ thầm…', emoji: '💭', color: '#e3d9ff' };
    if (id === 'nar') return { name: '', role: '', emoji: '📖', color: '#fff1b8' };
    if (id === 'kpi') return { name: (CO && CO.catName) || 'Mèo KPI', role: 'Employee of the Month', emoji: '🐱', color: '#d9d9d9' };
    if (id === 'giao') return GIAO;
    return (CO && CO.cast[id]) || { name: id, role: '', emoji: '❔', color: '#ccc' };
  }
  const reviewer = () => { try { return (CO.reviewer && CO.reviewer(R)) || CO.manager; } catch { return CO.manager; } };
  const mood = () => C.moodInfo(R && R.today ? R.today.mood : 'meh');
  const hungry = () => !!R && R.day > 0 && C.hungerState(R.st.nl) !== 'ok';

  // Today's definition: computed from the run (R.today is decided once per day and saved, so reloads are stable).
  function today() {
    if (!R || !CO) return null;
    if (R.day === 0) return { kind: 'interview', title: CO.interview.title, subtitle: CO.interview.subtitle, intro: CO.interview.intro, pos: CO.interview.pos, steps: CO.interview.steps, sideTasks: false };
    const t = R.today || {};
    const ep = t.ep && CO.episodes.find((e) => e.id === t.ep);
    let steps;
    if (ep) steps = [...ep.steps];
    else steps = (t.beats || []).map((id) => (CO.routine || []).find((b) => b.id === id)).filter(Boolean).map((b, i) => ({ ...b, time: b.time || ['10:00', '14:00', '15:30'][i] }));
    if (!ep) steps.sort((a, b) => toMin(a.time) - toMin(b.time));
    if (C.isFriday(R.day) && !(ep && ep.noReview) && !steps.some((s) => s.review)) {
      const mgr = reviewer();
      const rv = { who: mgr, obj: `16:30 Review tuần với ${charInfo(mgr).name}`, time: '16:30', review: true, scene: [] };
      const k = steps.findIndex((s) => toMin(s.time || '00:00') > toMin('16:30'));
      if (k < 0) steps.push(rv); else steps.splice(k, 0, rv);
    }
    return {
      kind: ep ? 'episode' : 'routine', ep,
      title: ep ? ep.title : 'Ngày thường',
      intro: ep ? ep.intro : 'Một ngày làm việc bình thường. "Bình thường" theo tiêu chuẩn của công ty này.',
      pos: (ep && ep.pos) || {}, steps, sideTasks: ep ? ep.sideTasks !== false : true,
    };
  }
  let todayCache = null;
  const day = () => { const key = R ? `${R.id}:${R.day}:${R.today ? R.today.day : '-'}` : ''; if (!todayCache || todayCache.key !== key) todayCache = { key, def: today() }; return todayCache.def; };
  let stepLocked = false; // while a step plays, its own effects must not make currentStep() skip ahead
  function currentStep() {
    const d = R && day();
    if (!d) return null;
    while (!stepLocked && d.steps[R.step] && d.steps[R.step].when && !d.steps[R.step].when(R)) R.step++;
    return d.steps[R.step] || null;
  }

  function updateHUD() {
    if (!R) return;
    const off = R.status === 'official';
    const t = off ? ' · Chính thức' : R.tier ? ` · ${TIERS[R.tier].label}` : '';
    const wd = innerWidth < 560 ? C.weekdayName(R.day).replace('Thứ ', 'T').replace('Hai', '2').replace('Ba', '3').replace('Tư', '4').replace('Năm', '5').replace('Sáu', '6').replace('Bảy', '7').replace('Chủ Nhật', 'CN') : C.weekdayName(R.day);
    $('#hudDay').textContent = R.day === 0 ? `Phỏng vấn${t}` : `Ngày ${R.day}/45 · ${wd}${t}`;
    $('#barUy').style.width = R.st.uy + '%';
    $('#barDr').style.width = R.st.dr + '%';
    $('#barNl').style.width = Math.max(0, R.st.nl) + '%';
    $('#barNl').parentElement.classList.toggle('low', hungry());
    $('#hudTime').textContent = fmtClock(R.clock);
    $('#phoneClock').textContent = fmtClock(R.clock);
    $('#hudMoney').textContent = `💰 ${fmtVND(Math.round(R.money))}`;
    $('#hudMoney').classList.toggle('neg', R.money < 0);
    const m = mood();
    $('#hudMood').textContent = R.day === 0 ? '' : `${m.emoji} ${m.name}${hungry() ? ' · 🍜 Đói' : ''}`;
    const step = currentStep();
    $('#objText').textContent = step ? fmt(step.obj) : 'Hết việc chính hôm nay';
    const b = $('#badge'); b.hidden = !R.unread; b.textContent = R.unread > 9 ? '9+' : R.unread;
    renderTasks();
  }
  function renderTasks() {
    const box = $('#taskList');
    const list = R ? active(R.tasks) : [];
    box.hidden = !list.length || mode !== 'play';
    if (box.hidden) return;
    box.innerHTML = '<div class="tl-head">📋 Việc vặt</div>' + list.map((t) => {
      const leg = currentLeg(t);
      const who = leg.npc ? charInfo(leg.npc).name : ((world && world.interactables.find((x) => x.id === leg.obj)) || {}).label || leg.obj;
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
      const d = Math.round(R.st[k] - before);
      if (d) toast(`${d > 0 ? '▲' : '▼'} ${lbl[k]} ${d > 0 ? '+' : ''}${d}`, k === 'dr' ? 'drama' : d > 0 ? 'good' : 'bad', 2);
    }
    if (fx.money) { R.money += fx.money; toast(`${fx.money > 0 ? '💰 +' : '💸 −'}${fmtVND(Math.abs(fx.money))}`, fx.money > 0 ? 'good' : 'bad', 2.4); }
    if (fx.clock) R.clock += fx.clock;
    if (fx.rel) for (const [id, n] of Object.entries(fx.rel)) {
      R.rel[id] = (R.rel[id] || 0) + n;
      toast(`${n > 0 ? '❤️' : '💔'} ${charInfo(id).name} ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'good' : 'bad', 2);
    }
    if (fx.set) Object.assign(R.flags, fx.set);
    updateHUD();
  }
  async function voteToast(id, idx) {
    if (String(id).startsWith('_')) return; // private choices (food, routine…) are not polled
    const rows = await net.vote(`${R.company}_${id}`, idx);
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
      el.innerHTML = `<div class="sal-wrap"><div class="ov-kicker">DEAL LƯƠNG · BẮT BUỘC</div><h2>Em muốn mức phụ cấp nào?</h2><p class="muted">Lương nào việc nấy. Mức này quyết định độ khó của cả lượt chơi. (Phím 1–4 · bấm 2 lần để chốt)</p><div class="sal-grid">${TIER_ORDER.map(card).join('')}</div><p class="sal-note">Thuế, bảo hiểm trong game được đơn giản hóa để giải trí, không phải tư vấn pháp lý.</p></div>`;
      el.hidden = false;
      let chosen = null;
      const choose = (id) => {
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
      const onKey = (e) => { if (/^Digit[1-4]$/.test(e.code)) { e.preventDefault(); e.stopPropagation(); choose(TIER_ORDER[Number(e.code.slice(5)) - 1]); } };
      window.addEventListener('keydown', onKey, true);
      el.querySelectorAll('.sal-card').forEach((b) => { b.onclick = () => choose(b.dataset.id); });
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
      if (node.donate) { if (SUPPORT_URL) { try { window.open(SUPPORT_URL, '_blank', 'noopener'); } catch { /* popup blocked */ } } return; }
      if (node.salary) {
        $('#dialog').hidden = true;
        R.tier = await salaryPick();
        R.salary = TIERS[R.tier].salary;
        save(); updateHUD();
        return;
      }
      if (node.mini) {
        $('#dialog').hidden = true;
        // one bar for display and for the outcome: the scene's own bar, raised by the salary tier's review strictness
        const bar = Math.max(node.mini.pass ?? 0.5, R.tier ? tier(R.tier).qa : 0);
        const barNote = R.tier && tier(R.tier).qa > (node.mini.pass ?? 0.5) ? `Mức ${TIERS[R.tier].label} duyệt khắt khe: cần ≥ ${Math.round(bar * 100)}% để qua.` : `Cần ≥ ${Math.round(bar * 100)}% để qua.`;
        const cfg = { ...node.mini, pass: bar, barNote, time: Math.round((node.mini.time || 30) * mood().mini * (hungry() ? 0.75 : 1)) };
        const { score } = await runMinigame(cfg);
        const ok = score >= bar - 1e-9;
        R.flags.minis = (R.flags.minis || 0) + 1;
        if (ok) R.flags.minis_ok = (R.flags.minis_ok || 0) + 1;
        if (R.week) { R.week.minis++; if (ok) R.week.minisOk++; }
        await run(ok ? node.good || [] : node.bad || []);
      }
    },
  });
  function startDialogMode() { mode = 'dialog'; $('#prompt').hidden = true; $('#crosshair').hidden = true; $('#mobile').hidden = true; $('#taskList').hidden = true; fp.unlock(); }
  function endDialogMode() {
    dialogue.hide();
    fp.focus(null);
    Object.values(npcs).forEach((n) => { n.talking = false; });
    if (mode === 'dialog') { mode = 'play'; $('#mobile').hidden = !isTouch; $('#crosshair').hidden = isTouch; fp.lock(); renderTasks(); }
  }

  // ---------- story flow ----------
  async function playStep(step) {
    stepLocked = true;
    // a reload in the middle of this step must not apply its effects twice: keep the state from before it
    try { const { stepSnap, ...plain } = R; void stepSnap; R.stepSnap = JSON.parse(JSON.stringify(plain)); } catch { R.stepSnap = null; }
    startDialogMode();
    if (step.seat === 'mr_seat') fp.teleport(MEETING_SEAT[0], MEETING_SEAT[1], 0, 1.05);
    if (step.call) { openCallFrame(step.call); placeNPCs(true); }
    await dialogue.run(step.scene || []);
    if (step.review) await runReview();
    stepLocked = false;
    if (step.call) { closeCallFrame(); for (const id of step.call.people) if (npcs[id]) npcs[id].mesh.visible = isPresent(id) && spotFor(id) !== 'away'; }
    if (step.seat) player.eye = 1.38;
    R.step++;
    R.stepSnap = null;
    if (R.day > 0) applyFx({ nl: -3 });
    if (R.day > 0 && R.st.nl <= C.FAINT) await faint();
    save();
  }
  async function runStep(step) {
    await playStep(step);
    if (R.today && R.today.quick) { await quickNext(); return; }
    endDialogMode();
    if (!currentStep()) { dayEnd(); return; }
    onStepStart();
  }
  function onStepStart() {
    const step = currentStep();
    if (step && step.time) {
      const target = toMin(step.time);
      if (target > R.clock) { const delta = target - R.clock; R.clock = target; R.tasks = shiftTasks(R.tasks, delta); }
    }
    placeNPCs(false); updateHUD(); save(); maybeScheduleCall();
  }
  function spotFor(id) {
    if (id === 'giao') return 'giao';
    const def = CO && CO.cast[id];
    if (!R || !day()) return (def && def.spot) || id;
    const step = currentStep();
    return (step && step.pos && step.pos[id]) || (day().pos && day().pos[id]) || (def && def.spot) || id;
  }
  const isPresent = (id) => { const def = CO && CO.cast[id]; if (!def || !def.present || !R) return true; try { return !!def.present(R); } catch { return true; } };
  function placeNPCs(instant) {
    const step = R && CO ? currentStep() : null;
    const onCall = new Set(step && step.call && mode !== 'play' ? step.call.people : []);
    for (const [id, n] of Object.entries(npcs)) {
      n.mesh.visible = isPresent(id) && spotFor(id) !== 'away' && !onCall.has(id);
      const sp = SPOTS[spotFor(id)] || SPOTS[(CO && CO.cast[id] && CO.cast[id].spot) || id];
      if (!sp) continue;
      n.target.set(sp[0], 0, sp[1]); n.rest = sp[2];
      if (instant) { n.mesh.position.copy(n.target); n.mesh.rotation.y = sp[2]; }
    }
  }
  let fainting = false;
  async function faint() {
    fainting = true;
    await dialogue.run([
      ['nar', 'Mắt bạn hoa lên. Màn hình laptop hiện chữ "aaaaaaaaaaa". Bạn chưa ăn gì tử tế từ sáng.'],
      ['think', 'Không ổn. Phải đi ăn thôi.'],
      ['nar', 'Bạn xuống pantry, ăn vội gói bánh cuối cùng. Mất ba mươi phút và một chút hình tượng.'],
      { fx: { nl: 30, uy: -3, clock: 30 } },
    ]);
    fainting = false;
  }

  // ---------- weekly review (Friday) ----------
  async function runReview() {
    const mgr = reviewer();
    const wk = R.week || C.emptyWeek(R);
    const { grade, score } = C.gradeWeek(wk, R, R.rel[mgr] || 0);
    const r = rng(hash(R.id) + R.day);
    const lines = (CO.review && CO.review[grade] && CO.review[grade].length ? CO.review[grade] : DEFAULT_REVIEW[grade]);
    const l1 = pickOne(lines, r); let l2 = pickOne(lines, r); if (l2 === l1) l2 = null;
    const prev = (R.reviews || []).slice(-1)[0];
    await dialogue.run([
      ['nar', `Thứ Sáu, 16:30. 1:1 với ${charInfo(mgr).name}. Lịch ghi mười lăm phút.`],
      ['nar', `Tuần này: ${wk.done} việc vặt xong, ${wk.late} trễ hạn, mini-game qua ${wk.minisOk}/${wk.minis}.`],
      [mgr, l1], ...(l2 ? [[mgr, l2]] : []),
      ...(grade === 'D' && prev && prev.grade === 'D' ? [[mgr, 'Hai tuần liền rồi đấy. Từ tuần sau em vào diện theo dõi. Chị gửi email sau.']] : []),
      { fx: C.GRADE_FX[grade] },
      ['nar', `📋 Xếp loại tuần ${C.weekOf(R.day)}: ${grade} (${score}/100)`],
    ]);
    R.reviews = [...(R.reviews || []), { day: R.day, week: C.weekOf(R.day), grade, score }];
    R.week = C.emptyWeek(R);
    // the one path to becoming official
    const pr = CO.promotion;
    if (R.status === 'intern' && pr && !R.flags.promo_offered && pr.when && pr.when(R)) {
      R.flags.promo_offered = true;
      await dialogue.run(pr.offer || []);
      if (R.flags.accept_official) becomeOfficial();
    }
  }
  function becomeOfficial() {
    const pr = CO.promotion;
    R.status = 'official';
    R.salary = pr.salary || CO.officialSalary || 10_000_000;
    R.flags.official_day = R.day;
    R.plan = C.scheduleArc(pr.arc || [], R.day, R.plan || {});
    toast(`🎉 Bạn là nhân viên chính thức! Lương ${fmtVND(R.salary)}/tháng`, 'good', 4);
    sfx.good();
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
    $('#prompt').hidden = true; $('#mobile').hidden = true; $('#taskList').hidden = true;
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
    toast('📵 Bạn từ chối cuộc gọi. Họ sẽ gọi lại… và nhớ chuyện này.', 'bad', 3);
    fp.lock(); renderTasks(); maybeScheduleCall(9000);
  }
  function openCallFrame(call) {
    callMode = call;
    document.body.classList.add('in-call');
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
  function closeCallFrame() { document.body.classList.remove('in-call'); callMode = null; clearInterval(callClock); $('#callFrame').hidden = true; }

  // ---------- phone ----------
  const phone = createPhone({
    net, charInfo,
    getChat: () => (R ? R.chat : []),
    getName: () => (R ? R.name : ''),
    onReadChat: () => { if (R) { R.unread = 0; updateHUD(); } },
    onOpen: () => { if (mode === 'play' || mode === 'pause') mode = 'phone'; fp.unlock(); $('#pause').hidden = true; $('#prompt').hidden = true; $('#taskList').hidden = true; },
    onClose: () => { if (mode === 'phone') { mode = 'play'; $('#crosshair').hidden = isTouch; fp.lock(); renderTasks(); } },
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
    if (!d.sideTasks || !R.tier || !CO.sideTasks || !CO.sideTasks.length) { R.tasks = []; return; }
    const count = R.status === 'official' ? Math.min(5, tier(R.tier).sideTasks + 1) : tier(R.tier).sideTasks;
    const absent = (id) => !isPresent(id) || (d.pos && d.pos[id] === 'away') || (d.steps || []).some((st) => st.pos && st.pos[id] === 'away');
    const templates = CO.sideTasks.filter((t) => { try { return (!t.when || t.when(R)) && !absent(t.from) && !(t.legs || []).some((l) => l.npc && absent(l.npc)); } catch { return false; } });
    R.tasks = planTasks({ templates, count, tierId: R.tier, startMin: 9 * 60 + 15, endMin: 16 * 60 + 30, seed: hash(R.id) + R.day * 7, scale: TASK_SCALE });
  }
  function taskTick() {
    if (!R || !R.tasks.length) return;
    const { tasks, events } = tick(R.tasks, R.clock, MAX_OPEN_TASKS);
    R.tasks = tasks;
    for (const e of events) {
      if (e.type === 'spawned') { sfx.ding(); toast(`📋 <b>${esc(charInfo(e.task.from).name)}</b> nhờ: ${esc(e.task.title)}`, 'msg', 3.5); }
      if (e.type === 'late') { applyFx({ uy: -3, rel: { [e.task.from]: -1 } }); if (R.week) R.week.late++; toast(`⏰ Trễ việc: ${esc(e.task.title)}`, 'bad', 3); }
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
      if (e.type === 'done') { applyFx({ uy: 2, nl: -2, rel: { [e.task.from]: 1 } }); if (R.week) R.week.done++; toast(`✅ Xong việc: ${esc(e.task.title)}`, 'good', 2.5); }
    }
    save();
    return true;
  }

  // ---------- Chị Giáo (donation corner) ----------
  async function giaoTalk() {
    const met = !!R.flags.giao_met;
    R.flags.giao_met = true;
    await dialogue.run([
      ...(met ? [['giao', 'Lại là bạn à? Hôm nay ở công ty này thế nào, có ai "vài ý nhỏ" với bạn không?']] : GIAO_LINES),
      { c: '_giao', o: [
        { t: '☕ Mời chị Giáo một cốc cà phê', then: [
          ['giao', SUPPORT_URL ? 'Cảm ơn bạn nhiều lắm! Cốc cà phê này sẽ biến thành… thêm một công ty mới để bạn bị bóc lột.' : 'Quầy nhận cà phê của chị chưa mở. Nhưng chị nhận lời cảm ơn của bạn rồi nhé!'],
          { donate: true },
        ] },
        { t: 'Để lần sau nhé chị', then: [['giao', 'Ok luôn. Đi làm tiếp đi, hình như sếp đang tìm bạn kìa 🙂']] },
        { t: '"Chị ơi, game có bug…"', then: [['giao', 'Chị biết. Chị đang sửa. Như mọi công ty khác thôi: "để chị check lại nhé".']] },
      ] },
    ]);
  }

  // ---------- food (pantry) ----------
  async function pantry() {
    const ate = R.flags.snack_day === R.day;
    const coffees = R.flags.coffee_day === R.day ? (R.flags.coffees || 0) : 0;
    const opts = [
      ...(CO.food || []).map((f) => ({ ...f })),
      { t: ate ? 'Lục hộp bánh trong pantry (hình như hết rồi)' : 'Ăn vặt trong pantry (miễn phí, +12)', fx: ate ? { nl: 1 } : { nl: 12, set: { snack_day: R.day } }, then: [['nar', ate ? 'Hộp bánh trống trơn. Có ai đó để lại tờ giấy: "Đã ăn. Xin lỗi. —Không phải mình".' : 'Một gói bánh quy và nửa hộp mứt từ Tết năm ngoái. Tạm ổn.']] },
      { t: coffees >= 2 ? 'Pha cà phê lần thứ ba (tim bắt đầu đập nhanh)' : 'Pha cà phê gói (miễn phí, +15)', fx: coffees >= 2 ? { nl: 4, dr: 1, set: { coffee_day: R.day, coffees: coffees + 1 } } : { nl: 15, set: { coffee_day: R.day, coffees: coffees + 1 } }, then: [['nar', coffees >= 2 ? 'Tay bạn hơi run. Bạn gõ "Kính gửi anh chị" thành "Kính gửi anh chịiiii".' : 'Cà phê 3in1. Vị ngọt của sự cam chịu.']] },
      ...(R.tier === 't0' ? [{ t: 'Cơm trưa miễn phí của công ty (quyền lợi mức 0 đồng, +30)', when: (s) => s.flags.lunch_day !== s.day, fx: { nl: 30, clock: 20, set: { lunch_day: R.day } }, then: [['nar', 'Một hộp cơm "suất nhân viên". Không có thịt kho, nhưng có lòng tốt.']] }] : []),
      { t: 'Đặt cơm văn phòng (35.000đ, +35, chờ 20 phút)', when: (s) => s.money >= 35_000, fx: { money: -35_000, nl: 35, clock: 20 }, then: [['nar', 'Shipper gọi bốn lần vì không tìm thấy tòa nhà. Cơm nguội nhưng no.']] },
      { t: 'Ra ngoài ăn tử tế (65.000đ, +55, mất 45 phút)', when: (s) => s.money >= 65_000, fx: { money: -65_000, nl: 55, clock: 45 }, then: [
        ['nar', 'Một tô bún đầy đủ topping. Bạn thấy mình là người lớn.'],
        { if: (s) => (hash(s.id) + s.clock) % 3 === 0, then: [[CO.manager, 'Em đi ăn lâu thế? Chị tìm em nãy giờ.'], { fx: { uy: -2 } }] },
      ] },
    ].filter((o) => !o.when || o.when(R)).slice(0, 4);
    const broke = R.money < 35_000;
    await dialogue.run([['nar', broke ? `Pantry. Ví còn ${R.money < 0 ? '−' : ''}${fmtVND(Math.abs(Math.round(R.money)))}. Không đủ tiền đặt cơm hay ra ngoài ăn, chỉ còn đồ miễn phí.` : `Pantry. Ví còn ${fmtVND(Math.round(R.money))}. Bụng thì còn ít hơn.`], { c: '_food', o: opts }]);
  }

  // ---------- day intro / end ----------
  const statGrid = () => `<div class="stat-grid"><div><b>${Math.round(R.st.uy)}</b><span>Uy tín</span></div><div><b>${Math.round(R.st.dr)}</b><span>Drama</span></div><div><b>${Math.round(R.st.nl)}</b><span>Năng lượng</span></div></div>`;
  const relChips = () => Object.entries(R.rel).filter(([id, v]) => v !== 0 && CO && CO.cast[id]).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([id, v]) => `<span>${charInfo(id).emoji} ${esc(charInfo(id).name)} ${v > 0 ? '❤️'.repeat(Math.min(v, 5)) : '💔'.repeat(Math.min(-v, 3))}</span>`).join('');
  const navBtn = '<button class="btn ghost" data-nav="menu">📋 Hồ sơ sự nghiệp</button>';
  function wireNav() { document.querySelectorAll('#ovCard [data-nav="menu"]').forEach((b) => { b.onclick = () => { save(); hideOverlay(); showMenu(); }; }); }

  function beginDay() {
    // decide today's content once (stable across reloads)
    if (R.day > 0 && (!R.today || R.today.day !== R.day)) {
      const seed = hash(R.id) + R.day * 101;
      let epId = (R.plan || {})[R.day] || null;
      const epDef = epId && CO.episodes.find((e) => e.id === epId);
      if (epDef && epDef.when) { try { if (!epDef.when(R)) epId = null; } catch (err) { console.error(err); epId = null; } }
      if (epDef && !epDef.official && epDef.internOnly && R.status === 'official') epId = null;
      const beats = [];
      if (!epId) {
        const seen = R.seen || [];
        const pool = (CO.routine || []).filter((b) => { try { return (!b.when || b.when(R)) && (!b.official || R.status === 'official') && !(b.once && seen.includes(b.id)); } catch { return false; } });
        const fresh = pool.filter((b) => !(R.seen || []).includes(b.id));
        const src = fresh.length >= 2 ? fresh : pool;
        const r = rng(seed);
        const n = R.tier === 't5' || R.tier === 't3' ? 3 : 2;
        const copy = [...src];
        while (beats.length < n && copy.length) beats.push(copy.splice(Math.floor(r() * copy.length), 1)[0].id);
        R.seen = [...(R.seen || []), ...beats].slice(-200);
      }
      R.today = { day: R.day, ep: epId, beats, mood: R.money < 0 ? 'broke' : C.pickMood(R, seed), quick: false };
      const m = C.moodInfo(R.today.mood);
      R.st.nl = clamp(R.st.nl + m.nl, 5, 100);
      R.flags.drank_today = false;
      if (!R.week) R.week = C.emptyWeek(R);
      R.step = 0;
    }
    todayCache = null;
  }

  function showDayIntro() {
    mode = 'intro'; fp.unlock();
    beginDay(); save();
    const d = day();
    hideGameUI();
    const m = mood();
    const kicker = R.day === 0 ? 'BUỔI ĐẦU TIÊN' : `NGÀY ${R.day}/45 · ${C.weekdayName(R.day).toUpperCase()}${C.isFriday(R.day) ? ' · CÓ REVIEW TUẦN' : ''}`;
    const quickable = d.kind === 'routine' && R.step === 0;
    overlay(`
      <div class="ov-kicker">${kicker}</div>
      <h2>${esc(d.title)}${d.subtitle ? `: ${esc(d.subtitle)}` : ''}</h2>
      <div class="ov-sub">${esc(companyName(R.company))} · ${esc(R.name)}${R.status === 'official' ? ' · Nhân viên chính thức' : R.tier ? ` · ${TIERS[R.tier].label}` : ''}${R.day > 0 ? ` · 💰 ${fmtVND(Math.round(R.money))}` : ''}</div>
      ${R.day > 0 ? `<div class="mood-card"><b>${m.emoji} Mood hôm nay: ${esc(m.name)}</b><span>${esc(m.text)}</span></div>` : ''}
      <p class="ov-text">${esc(fmt(d.intro || ''))}</p>
      <div class="btns"><button class="btn primary" id="goDay">${R.step > 0 ? 'Làm tiếp →' : 'Vào văn phòng →'}</button>${quickable ? '<button class="btn" id="quickDay" title="Đọc nhanh các cảnh, việc vặt quyết định bằng một lựa chọn">⏩ Tua nhanh ngày thường</button>' : ''}${navBtn}</div>
      ${isTouch ? '' : '<div class="help"><div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> đi · chuột nhìn · <kbd>E</kbd> nói chuyện · <kbd>Q</kbd> Teams · <kbd>Esc</kbd> tạm dừng</div><div>🍜 Đói thì ghé pantry · 📋 việc vặt hiện ở góc phải</div></div>'}
    `);
    wireNav();
    $('#goDay').onclick = () => { hideOverlay(); startDay(false); };
    if ($('#quickDay')) $('#quickDay').onclick = () => { hideOverlay(); startDay(true); };
  }
  function startDay(quick) {
    const d = day();
    enterCompany(CO);
    fp.teleport(PLAYER_START[0], PLAYER_START[1], PLAYER_START[2]);
    if (R.step === 0) {
      R.clock = R.day === 0 ? toMin((d.steps[0] && d.steps[0].time) || '14:00') - 5 : toMin('08:25');
      startSideTasks();
      if (d.ep && d.ep.chatStart) pushChat(d.ep.chatStart, 900);
    }
    if (R.today) R.today.quick = !!quick;
    placeNPCs(true);
    $('#hud').hidden = false;
    updateHUD(); save();
    if (quick) { startDialogMode(); quickNext(); return; }
    mode = 'play';
    $('#crosshair').hidden = isTouch; $('#mobile').hidden = !isTouch;
    fp.lock(); onStepStart();
  }
  async function quickNext() {
    const st = currentStep();
    if (!st) { await quickTasks(); R.today.quick = false; mode = 'dialog'; endDialogMode(); dayEnd(); return; }
    if (st.time) { const target = toMin(st.time); if (target > R.clock) R.clock = target; }
    const sp = !st.call && !st.who.startsWith('obj:') && SPOTS[spotFor(st.who)];
    placeNPCs(true);
    if (sp) fp.teleport(sp[0] + Math.sin(sp[2]) * 1.3, sp[1] + Math.cos(sp[2]) * 1.3, sp[2]);
    updateHUD();
    await runStep(st);
  }
  async function quickTasks() {
    const open = R.tasks.filter((t) => t.status === 'open' || t.status === 'pending');
    if (!open.length) return;
    const n = open.length;
    startDialogMode();
    await dialogue.run([
      ['nar', `Trong ngày, mọi người nhờ bạn ${n} việc vặt: ${open.map((t) => t.title.charAt(0).toLowerCase() + t.title.slice(1)).join('; ')}.`],
      { c: '_quick_tasks', o: [
        { t: `Làm hết cả ${n} việc (−${n * 6} năng lượng)`, fx: { nl: -n * 6, uy: n * 2, set: { _qt: n } } },
        { t: 'Làm một nửa, từ chối khéo phần còn lại', fx: { nl: -Math.ceil(n / 2) * 6, uy: Math.ceil(n / 2), dr: 1, set: { _qt: Math.ceil(n / 2) } } },
        { t: 'Giả vờ không thấy tin nhắn', fx: { dr: 3, uy: -n * 2, set: { _qt: 0 } } },
      ] },
    ]);
    const k = R.flags._qt || 0; delete R.flags._qt;
    R.tasks = resolveAll(R.tasks, k);
    if (R.week) { R.week.done += k; R.week.late += n - k; }
  }

  function endingFor(type) {
    const e = CO.endings && CO.endings[type];
    const v = typeof e === 'function' ? e(R) : e;
    if (v) return v;
    if (type === 'finish') return { title: 'Hết 45 ngày thực tập', text: 'Bạn ôm giấy xác nhận thực tập và một thùng carton nhỏ. Thùng carton là của công ty, bạn phải trả lại.' };
    if (type === 'quit') return { title: 'Bạn nghỉ việc', text: 'Bạn bấm gửi email nghỉ việc. Lần đầu tiên trong nhiều tuần, bạn ngủ ngon.' };
    return { title: 'Bạn bị cho thôi việc', text: '"Tái cấu trúc." Một từ, một tháng lương, và một buổi chiều rất dài.' };
  }

  function dayEnd() {
    mode = 'overlay'; fp.unlock(); clearTimeout(ringTimer);
    hideGameUI();
    const d = day();
    const sum = summary(R.tasks);
    const isInterview = R.day === 0;
    let diary = '';
    try { diary = d.ep && d.ep.diary ? d.ep.diary(R) : isInterview ? (CO.interview.diary ? CO.interview.diary(R) : '') : routineDiary(); } catch (err) { console.error(err); }
    const pending = [];
    let ended = null;
    const fromDay = R.day;
    if (!isInterview) {
      // pay accrues per workday; commute costs money; tasks still open count as late
      R.accrued = C.accrue(R);
      R.money -= C.COMMUTE_COST;
      if (R.week) R.week.late += R.tasks.filter((t) => t.status === 'open').length;
      if (d.ep && d.ep.end) { try { ended = typeof d.ep.end === 'function' ? d.ep.end(R) : d.ep.end; } catch (err) { console.error(err); ended = 'quit'; } }
      if (ended && !['quit', 'layoff'].includes(ended)) ended = null;
      const ev = C.pickLifeEvent(R, hash(R.id) + R.day * 13, CO.lifeEvents || []);
      if (ev) { pending.push({ type: 'life', id: ev.id }); R.flags.last_life = ev.id; }
      const next = C.nextWorkday(R.day);
      const finalDay = !ended && next > C.MAX_DAYS;
      if (finalDay) ended = 'finish';
      if (R.day >= C.PAYDAY && !R.flags.paid30 && !ended) { R.flags.paid30 = true; pending.push({ type: 'pay', day: R.day }); }
      else if (ended) pending.push({ type: 'pay', day: R.day });
      if (!ended && C.rentDue(R.day, next)) pending.push({ type: 'rent' });
      if (!ended) pending.push({ type: 'broke' }); // shown only if the wallet is negative by then
      if (ended) pending.push({ type: 'ending' });
      else if (C.isFriday(R.day)) pending.push({ type: 'weekend' });
    } else {
      // after the interview: plan the internship and draw this run's hidden family ties
      R.plan = C.scheduleEpisodes(CO.episodes || [], hash(R.id));
      if (CO.ties && CO.ties.length) {
        const r = rng(hash(R.id) + 5);
        const pool = [...CO.ties]; R.ties = [];
        while (R.ties.length < 2 && pool.length) R.ties.push(pool.splice(Math.floor(r() * pool.length), 1)[0].id);
        for (const t of R.ties) R.flags['tie_' + t] = true;
      }
    }
    if (isInterview) pending.push({ type: 'rent' });
    if (!ended) R.day = isInterview ? 1 : C.nextWorkday(R.day);
    R.step = 0; R.today = null;
    const endStats = statGrid(); // before the overnight rest
    R.st.nl = clamp(R.st.nl + 45, 0, 100);
    if (ended) { R.ended = { type: ended, day: fromDay }; R.done = true; }
    R.pending = pending;
    save();
    overlay(`
      <div class="ov-kicker">${isInterview ? 'HẾT BUỔI PHỎNG VẤN' : `HẾT NGÀY ${fromDay} · ${C.weekdayName(fromDay).toUpperCase()}`}</div>
      <h2>${esc(d.title)}: xong!</h2>
      ${diary ? `<div class="diary">📓 ${esc(fmt(diary))}</div>` : ''}
      ${endStats}
      ${isInterview ? '' : '<p class="muted small-note">🌙 Ngủ một đêm: +45 năng lượng.</p>'}
      ${isInterview ? `<div class="pct">💰 Mức đã deal: ${R.tier ? `${TIERS[R.tier].label}/tháng (${TIERS[R.tier].name})` : '—'} · Ví: ${fmtVND(Math.round(R.money))}</div>` : `<div class="pct">📋 Việc vặt: ${sum.done} xong · ${sum.late + (sum.open || 0)} trễ · 🚌 Đi lại −${fmtVND(C.COMMUTE_COST)} · 💰 Ví: ${fmtVND(Math.round(R.money))}</div>`}
      <div class="rels">${relChips()}</div>
      <p class="muted">💾 Đã lưu: ${esc(runLabel(R, (t) => TIERS[t].label, companyName))}</p>
      <div class="btns"><button class="btn primary" id="nextCard">Tiếp tục →</button><button class="btn" id="dayPhone">💬 Xem Teams</button>${navBtn}</div>
    `);
    R.tasks = [];
    wireNav();
    $('#nextCard').onclick = () => showNextPending();
    $('#dayPhone').onclick = () => phone.open();
  }
  function routineDiary() {
    const m = mood();
    const lines = [`Một ngày thường. Mood: ${m.name.toLowerCase()}.`];
    if (R.st.nl < 30) lines.push('Mình đói gần hết ngày. Mai phải mang đồ ăn.');
    if (R.st.dr > 50) lines.push('Drama đang lên cao. Mình bắt đầu thấy mình là một phần của nó.');
    if (R.money < 300_000) lines.push(`Trong ví còn ${fmtVND(Math.round(R.money))}. Mì gói, mình đến đây.`);
    return lines.join(' ');
  }

  // Cards after a day: life event → payslip → weekend → ending → next day's intro.
  // The queue is saved on the run, so quitting halfway resumes at the same card.
  function showNextPending() {
    mode = 'overlay';
    const q = R.pending || [];
    if (!q.length) { hideOverlay(); if (R.ended) showEnding(); else showDayIntro(); return; }
    const card = q[0];
    const done = (fx) => { if (fx) applyFx(fx); R.pending = (R.pending || []).slice(1); save(); showNextPending(); };
    if (card.type === 'life') {
      const ev = [...C.LIFE_EVENTS, ...(CO.lifeEvents || [])].find((e) => e.id === card.id);
      if (!ev) { done(); return; }
      const good = ev.fx && ((ev.fx.money || 0) >= 0 && (ev.fx.nl || 0) >= 0);
      const choices = ev.choices || [{ t: good ? 'Tuyệt, tận hưởng thôi' : 'Ừ thì… đời mà', fx: ev.fx, after: ev.after }];
      overlay(`<div class="ov-kicker">SAU GIỜ LÀM</div><h2>${ev.emoji} Trên đường về…</h2><p class="ov-text">${esc(fmt(ev.text))}</p>
        <div class="btns life-choices">${choices.map((c, i) => `<button class="btn${i ? '' : ' primary'}" data-i="${i}">${esc(c.t)}</button>`).join('')}</div>`);
      document.querySelectorAll('.life-choices [data-i]').forEach((b) => { b.onclick = () => {
        const c = choices[Number(b.dataset.i)];
        const fx = c.fx || {};
        const bits = [];
        if (fx.money) bits.push(`${fx.money > 0 ? '+' : '−'}${fmtVND(Math.abs(fx.money))}`);
        if (fx.nl) bits.push(`Năng lượng ${fx.nl > 0 ? '+' : ''}${fx.nl}`);
        if (fx.uy) bits.push(`Uy tín ${fx.uy > 0 ? '+' : ''}${fx.uy}`);
        if (fx.dr) bits.push(`Drama ${fx.dr > 0 ? '+' : ''}${fx.dr}`);
        overlay(`<div class="ov-kicker">SAU GIỜ LÀM</div><h2>${ev.emoji}</h2><p class="ov-text">${esc(fmt(c.after || ''))}</p>${bits.length ? `<div class="pct">${esc(bits.join(' · '))}</div>` : ''}<div class="btns"><button class="btn primary" id="lifeOk">Tiếp tục →</button></div>`);
        $('#lifeOk').onclick = () => done(fx);
      }; });
      return;
    }
    if (card.type === 'rent') {
      const after = R.money - C.RENT;
      overlay(`<div class="ov-kicker">${R.day <= 1 ? 'TRƯỚC NGÀY ĐẦU ĐI LÀM' : 'ĐẦU THÁNG MỚI'}</div><h2>🏠 Tiền trọ tháng này</h2>
        <p class="ov-text">Chủ trọ nhắn: "Em ơi, tiền nhà tháng này nha em 🙂". Phòng ở ghép, quạt trần, wifi "có lúc".</p>
        <table class="payslip"><tr><td>Tiền phòng (ở ghép) + điện nước</td><td>−${fmtVND(C.RENT)}</td></tr><tr class="total"><td>Ví còn</td><td>${after < 0 ? '−' : ''}${fmtVND(Math.abs(Math.round(after)))}</td></tr></table>
        ${after < 0 ? '<p class="muted">Ví âm. Đi làm vẫn phải đi, ăn vẫn phải ăn. Sẽ có cách… hoặc có drama.</p>' : ''}
        <div class="btns"><button class="btn primary" id="rentOk">Chuyển khoản →</button></div>`);
      $('#rentOk').onclick = () => done({ money: -C.RENT });
      return;
    }
    if (card.type === 'broke') {
      if (R.money >= 0) { done(); return; }
      const ids = Object.keys(CO.cast).filter((id) => CO.cast[id].body !== false && CO.cast[id].look && isPresent(id));
      const who = R.debt ? null : C.lender(R, ids);
      const opts = [];
      if (who) opts.push({ t: `Mượn ${charInfo(who).name} ${fmtVND(C.LOAN)}`, fx: { money: C.LOAN }, after: `${charInfo(who).name} chuyển khoản ngay, kèm sticker "nhớ trả nha 🙂". Lương về sẽ tự trừ để trả.`, debt: { who, amount: C.LOAN } });
      if (!R.flags.mom_help) opts.push({ t: 'Gọi về nhà', fx: { money: C.MOM_HELP, dr: 2, nl: -5, set: { mom_help: true } }, after: 'Mẹ chuyển một triệu, kèm mười bốn tin nhắn hỏi bao giờ lên chính thức, và một tấm ảnh nồi thịt kho.' });
      opts.push({ t: 'Nhịn. Mì gói tới cuối tháng', fx: { nl: -15, set: { noodles: true } }, after: 'Bạn mua một thùng mì. Ngày mai bạn đi làm với năng lượng của một gói mì.' });
      overlay(`<div class="ov-kicker">VÍ ÂM</div><h2>💸 Ví còn −${fmtVND(Math.abs(Math.round(R.money)))}</h2>
        <p class="ov-text">Khi ví âm: không đặt cơm hay ăn ngoài được, chỉ còn đồ miễn phí ở pantry, và sáng nào mood cũng là "Cháy túi".${R.debt ? ` Bạn còn nợ ${esc(charInfo(R.debt.who).name)} ${fmtVND(R.debt.amount)}.` : ''}</p>
        <div class="btns life-choices">${opts.map((o, i) => `<button class="btn${i ? '' : ' primary'}" data-i="${i}">${esc(o.t)}</button>`).join('')}</div>`);
      document.querySelectorAll('.life-choices [data-i]').forEach((b) => { b.onclick = () => {
        const o = opts[Number(b.dataset.i)];
        if (o.debt) { R.debt = { ...o.debt, day: R.day }; R.rel[o.debt.who] = (R.rel[o.debt.who] || 0); }
        overlay(`<div class="ov-kicker">VÍ ÂM</div><h2>💸</h2><p class="ov-text">${esc(o.after)}</p><div class="btns"><button class="btn primary" id="brokeOk">Tiếp tục →</button></div>`);
        $('#brokeOk').onclick = () => done(o.fx);
      }; });
      return;
    }
    if (card.type === 'pay') {
      const slip = C.payslip({ accrued: R.accrued || { intern: 0, official: 0 }, tierId: R.tier, commit: !!R.flags.tax_commit, officialSalary: R.status === 'official' ? R.salary : 0 });
      overlay(`<div class="ov-kicker">PHIẾU LƯƠNG</div><h2>💰 ${slip.net > 0 ? 'Ting ting!' : 'Phiếu lương… 0 đồng'}</h2>
        <table class="payslip">${slip.lines.map((l) => `<tr><td>${esc(l.k)}</td><td>${l.v < 0 ? '−' : ''}${fmtVND(Math.abs(l.v))}</td></tr>`).join('')}
        <tr class="total"><td>Thực nhận</td><td>${fmtVND(slip.net)}</td></tr>
        ${R.debt ? `<tr><td>Trả nợ ${esc(charInfo(R.debt.who).name)}</td><td>−${fmtVND(R.debt.amount)}</td></tr>` : ''}</table>
        <p class="muted">${slip.net === 0 ? 'Phụ cấp 0 đồng. Bạn nhận được… kinh nghiệm. Và giấy xác nhận.' : `Tiền vào ví. Ví sẽ có ${fmtVND(Math.round(R.money + slip.net))}.`}</p>
        <p class="sal-note">Thuế, bảo hiểm được đơn giản hóa để giải trí, không phải tư vấn pháp lý.</p>
        <div class="btns"><button class="btn primary" id="payOk">Nhận lương →</button></div>`);
      sfx.good();
      $('#payOk').onclick = () => {
        R.payslips = [...(R.payslips || []), { day: card.day || R.day, net: slip.net, gross: slip.gross }];
        R.accrued = { intern: 0, official: 0 };
        R.money += slip.net;
        if (R.debt) {
          const d0 = R.debt; R.debt = null; R.money -= d0.amount;
          R.rel[d0.who] = (R.rel[d0.who] || 0) + 1;
          toast(`🤝 Đã trả ${esc(charInfo(d0.who).name)} ${fmtVND(d0.amount)}. Uy tín trong mắt người ta +1.`, 'good', 3);
        }
        done();
      };
      return;
    }
    if (card.type === 'weekend') {
      const line = WEEKEND_LINES[hash(R.id + R.day) % WEEKEND_LINES.length];
      overlay(`<div class="ov-kicker">CUỐI TUẦN</div><h2>🛌 Thứ Bảy, Chủ Nhật</h2><p class="ov-text">${esc(line)}</p><p class="muted">Hai ngày nghỉ: +40 năng lượng. Tuần mới bắt đầu.</p><div class="btns"><button class="btn primary" id="wkOk">Sang thứ Hai →</button>${navBtn}</div>`);
      wireNav();
      $('#wkOk').onclick = () => { R.st.nl = clamp(R.st.nl + 40, 0, 100); done(); };
      return;
    }
    // ending
    R.pending = q.slice(1); save(); hideOverlay(); showEnding();
  }
  function showEnding() {
    mode = 'overlay'; fp.unlock();
    hideGameUI();
    const e = endingFor((R.ended && R.ended.type) || 'finish');
    const paid = (R.payslips || []).reduce((a, p) => a + (p.net || 0), 0);
    overlay(`<div class="ov-kicker">KẾT THÚC · ${esc(companyName(R.company)).toUpperCase()}</div><h2>${esc(e.title)}</h2>
      <p class="ov-text">${esc(fmt(e.text))}</p>
      ${statGrid()}
      <div class="pct">📅 ${R.ended ? R.ended.day : R.day} ngày · 📋 Review: ${(R.reviews || []).map((x) => x.grade).join(' ') || 'chưa có'} · 💰 Tổng lương: ${fmtVND(paid)} · Ví: ${fmtVND(Math.round(R.money))}</div>
      <div class="rels">${relChips()}</div>
      <p class="muted">Lượt chơi này đã khép lại và vẫn nằm trong hồ sơ sự nghiệp. Công ty tiếp theo đang tuyển.</p>
      <div class="btns"><button class="btn primary" id="toCompanies">Ứng tuyển công ty khác →</button>${navBtn}</div>`);
    wireNav();
    $('#toCompanies').onclick = () => { hideOverlay(); showCompanies(R.name); };
  }

  // ---------- interaction ----------
  let currentInteract = null;
  const candidates = () => [
    ...Object.entries(npcs).filter(([, n]) => n.mesh.visible).map(([id, n]) => ({ kind: 'npc', id, pos: n.mesh.position, label: id === 'giao' ? '☕ Nói chuyện với Chị Giáo (người làm game)' : `Nói chuyện với ${CO.cast[id].name}` })),
    ...(world ? world.interactables.map((it) => ({ kind: 'obj', id: it.id, pos: it.pos, label: it.label })) : []),
    { kind: 'npc', id: 'kpi', pos: cat.position, label: `Vuốt ve ${(CO && CO.catName) || 'Mèo KPI'}` },
  ];
  const isTargetOf = (step, it) => step && it && ((it.kind === 'npc' && step.who === it.id) || (it.kind === 'obj' && step.who === 'obj:' + it.id));
  const OBJ_LINES = {
    printer: [['nar', 'Máy in đang nghỉ ngơi. Trên máy dán tờ giấy: "Kẹt giấy thì đừng giật. Hỏi IT".']],
    desk: [['nar', 'Bàn của bạn. Một laptop, một chậu xương rồng ai đó để lại, và tờ giấy nhớ "Đừng tin chữ FINAL".']],
    okr: [['nar', 'Bảng trắng đầy chữ. Bạn đọc ba lần và hiểu ít hơn sau mỗi lần.']],
    altar: [['nar', 'Bàn thờ Thần Tài đèn nhấp nháy. Có ai đó đặt một gói sticky note làm lễ vật.'], { fx: { uy: 1 } }],
    safe: [['nar', 'Két sắt. Tờ giấy dán: "Muốn hỏi tiền, hỏi kế toán. Đừng hỏi két."']],
    plant: [['nar', 'Cây kim tiền héo. Thẻ treo: "Phụ trách tưới: (chưa rõ)".']],
    redchair: [['nar', 'Một chiếc ghế đỏ không ai ngồi. Người ta bảo đó là ghế của con mèo.']],
    interview: [['nar', 'Phòng họp. Trên bảng trắng còn dòng chữ chưa xóa từ cuộc họp trước.']],
  };
  async function interact() {
    if (mode !== 'play' || !currentInteract) return;
    const it = currentInteract;
    const step = currentStep();
    startDialogMode();
    const progressed = await handleTaskVisit(it.kind === 'npc' ? { npc: it.id } : { obj: it.id });
    if (isTargetOf(step, it)) { mode = 'play'; runStep(step); return; }
    if (!progressed) {
      if (it.id === 'giao') await giaoTalk();
      else if (it.id === 'kpi') await dialogue.run([['nar', `${(CO && CO.catName) || 'Mèo KPI'} mở một mắt, nhìn bạn như nhìn một slide không có executive summary, rồi ngủ tiếp.`], { fx: { nl: 3 } }]);
      else if (it.id === 'coffee') await pantry();
      else if (it.kind === 'npc') {
        const lines = (CO.idle && CO.idle[it.id]) || ['…'];
        await dialogue.say(it.id, lines[Math.floor(Math.random() * lines.length)]);
        if (step && step.who !== it.id && !step.who.startsWith('obj:') && !step.who.startsWith('call:')) await dialogue.say('think', `(Việc chính bây giờ: ${fmt(step.obj).toLowerCase()})`);
      } else await dialogue.run((CO.objLines && CO.objLines[it.id]) || OBJ_LINES[it.id] || [['nar', '…']]);
    }
    save();
    endDialogMode();
  }

  // ---------- menus ----------
  function hideGameUI() {
    $('#hud').hidden = true; $('#taskList').hidden = true; $('#mobile').hidden = true; $('#crosshair').hidden = true; $('#prompt').hidden = true;
    $('#pause').hidden = true; $('#companyMenu').hidden = true; $('#clickHint').hidden = true; stopRing(); closeCallFrame(); dialogue.hide();
    if (phone.isOpen) phone.close();
  }
  function showMenu() {
    mode = 'menu'; fp.unlock(); clearTimeout(ringTimer);
    hideGameUI(); hideOverlay();
    const runs = listRuns(profile);
    $('#soloRuns').innerHTML = runs.length ? runs.map((r) => {
      const meta = companyMeta(r.company);
      return `<div class="run-row${r.ended ? ' ended' : ''}"><div class="run-ico" style="background:${meta.color}">${meta.emoji}</div><div class="run-info"><b>${esc(r.name)}</b><small>${esc(runLabel(r, (t) => TIERS[t].label, companyName))}</small></div>
        <div class="run-btns"><button class="btn primary" data-play="${r.id}">${r.ended ? 'Xem kết thúc' : 'Chơi tiếp'}</button><button class="btn ghost" data-del="${r.id}" title="Xóa lượt này" aria-label="Xóa lượt này">🗑</button></div></div>`;
    }).join('') : '<p class="muted">Chưa có lượt chơi nào. Ứng tuyển công ty đầu tiên ở dưới nhé!</p>';
    $('#soloRuns').querySelectorAll('[data-play]').forEach((b) => { b.onclick = () => resumeRun(b.dataset.play); });
    $('#soloRuns').querySelectorAll('[data-del]').forEach((b) => { b.onclick = () => { if (confirm('Xóa lượt chơi này? Không lấy lại được.')) { profile = removeRun(profile, b.dataset.del); if (R && R.id === b.dataset.del) R = null; save(); showMenu(); } }; });
    if (!$('#soloName').value && runs[0]) $('#soloName').value = runs[0].name;
    $('#soloNew').textContent = runs.length ? 'Ứng tuyển công ty mới →' : 'Chọn công ty để ứng tuyển →';
    $('#soloMenu').hidden = false;
    document.dispatchEvent(new CustomEvent('solo:menu'));
  }
  function showCompanies(name) {
    mode = 'companies';
    hideGameUI(); hideOverlay(); $('#soloMenu').hidden = true;
    if (name) $('#soloName').value = name;
    $('#companyName').value = $('#soloName').value;
    const playing = new Set(listRuns(profile).filter((r) => !r.ended).map((r) => r.company));
    $('#companyCards').innerHTML = COMPANY_LIST.map((c) => `<button class="co-card${c.ready ? '' : ' soon'}" data-co="${c.id}" style="--co:${c.color}">
        <div class="co-top"><span class="co-emoji">${c.emoji}</span><span class="co-scale">${esc(c.scale)}</span></div>
        <b>${esc(c.name)}</b><span class="co-ind">${esc(c.industry)}</span>
        <span class="co-blurb">${esc(c.blurb)}</span>
        <span class="co-meta">Độ toxic: ${'☠️'.repeat(c.toxic)}${playing.has(c.id) ? ' · có lượt đang dở' : ''}</span>
        <em>${c.ready ? 'Ứng tuyển →' : 'Sắp mở tuyển'}</em></button>`).join('');
    $('#companyCards').querySelectorAll('[data-co]').forEach((b) => { b.onclick = () => applyTo(b.dataset.co); });
    $('#companyMenu').hidden = false;
  }
  let applying = false;
  async function applyTo(id) {
    const meta = companyMeta(id);
    if (!meta.ready) { toast(`🚧 ${esc(meta.name)} đang tuyển dụng… nội bộ. Sắp mở cho bạn!`, 'msg', 3); return; }
    const name = clean($('#companyName').value.trim()).slice(0, 16);
    if (!name) { $('#companyName').focus(); $('#companyName').placeholder = 'Nhập tên đã nào!'; toast('✍️ Nhập tên trên thẻ nhân viên trước nhé', 'bad', 2.5); return; }
    if (applying) return;
    const open = listRuns(profile).find((r) => r.company === id && !r.ended);
    if (open && !confirm(`Bạn đang có một lượt dở ở ${meta.name} (${open.name}, ngày ${open.day}). Vẫn bắt đầu lượt mới? Lượt cũ vẫn được giữ trong hồ sơ.`)) return;
    applying = true;
    unlockAudio();
    let co;
    try { co = await loadCompany(id); } catch (err) { console.error(err); applying = false; toast('😵 Không tải được công ty này. Thử lại sau nhé.', 'bad', 3); return; }
    applying = false;
    CO = co;
    $('#soloName').value = name;
    const run = newRun({ name, company: id });
    profile = addRun(profile, run);
    R = profile.runs[run.id];
    save();
    $('#companyMenu').hidden = true;
    enterCompany(CO);
    showDayIntro();
  }
  async function resumeRun(id) {
    unlockAudio();
    const r = profile.runs[id];
    if (!r) return;
    let co;
    try { co = await loadCompany(r.company); } catch (err) { console.error(err); toast('😵 Không tải được công ty của lượt này.', 'bad', 3); return; }
    if (r.stepSnap) { profile = updateRun(profile, id, { ...r.stepSnap, stepSnap: null }); }
    CO = co; R = profile.runs[id];
    profile = { ...profile, activeId: id };
    $('#soloMenu').hidden = true;
    enterCompany(CO);
    if (R.pending && R.pending.length) { showNextPending(); return; }
    if (R.ended) { showEnding(); return; }
    showDayIntro();
  }
  $('#soloNew').onclick = () => showCompanies($('#soloName').value.trim());
  $('#soloName').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#soloNew').click(); });
  $('#companyBack').onclick = () => { $('#companyMenu').hidden = true; showMenu(); };
  $('#companyName').addEventListener('input', () => { $('#soloName').value = $('#companyName').value; });
  $('#soloBack').onclick = () => { hideGameUI(); $('#soloMenu').hidden = true; mode = 'away'; onExit && onExit(); };

  // cloud saves (email + game password, or an 8-character code)
  createCloudPanel({
    getProfile: () => profile,
    setProfile: (p) => {
      profile = p;
      if (R) R = profile.runs[R.id] || null;
      try { store.set(PROFILE_KEY, JSON.stringify(profile)); } catch { /* storage full */ }
    },
    onChanged: () => { if (mode === 'menu') showMenu(); },
  });

  // ---------- controls ----------
  function pause() { if (mode === 'play') { mode = 'pause'; fp.unlock(); $('#pause').hidden = false; $('#crosshair').hidden = true; $('#prompt').hidden = true; $('#taskList').hidden = true; $('#mobile').hidden = true; } }
  function resume() { $('#pause').hidden = true; if (mode === 'pause') { mode = 'play'; $('#crosshair').hidden = isTouch; $('#mobile').hidden = !isTouch; fp.lock(); renderTasks(); } }
  $('#resumeBtn').onclick = resume;
  $('#pause').addEventListener('click', (e) => { if (e.target.id === 'pause') resume(); });
  $('#pausePhone').onclick = () => phone.open();
  $('#menuBtn').onclick = () => { if (mode === 'pause') resume(); else if (mode === 'play') pause(); };
  const leaveRun = () => { save(); $('#pause').hidden = true; clearTimeout(ringTimer); stopRing(); };
  $('#restartBtn').textContent = '📋 Hồ sơ sự nghiệp (đổi lượt / nhảy công ty)';
  $('#restartBtn').onclick = () => { leaveRun(); showMenu(); };
  $('#homeBtn').onclick = () => { leaveRun(); hideGameUI(); mode = 'away'; onExit && onExit(); };
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
  let elapsed = 0, clockAcc = 0, taskAcc = 0, hungryWarned = false, lastReal = performance.now();
  function update(dt) {
    const now = performance.now();
    const realDt = Math.min(1, Math.max(0, (now - lastReal) / 1000)); lastReal = now; // game time follows real time even at low fps
    elapsed += dt;
    if (world) world.update(elapsed);
    const step = R && CO ? currentStep() : null;

    if (mode === 'play' && R) {
      clockAcc += realDt * CLOCK_RATE;
      if (clockAcc >= 1) { R.clock += Math.floor(clockAcc); clockAcc -= Math.floor(clockAcc); $('#hudTime').textContent = fmtClock(R.clock); }
      if (R.day > 0) {
        R.st.nl = Math.max(0, R.st.nl - realDt * CLOCK_RATE * C.DRAIN_PER_MIN * mood().drain);
        $('#barNl').style.width = R.st.nl + '%';
        const h = hungry();
        $('#barNl').parentElement.classList.toggle('low', h);
        if (h && !hungryWarned) { hungryWarned = true; toast('🍜 Bạn bắt đầu đói: đi chậm hơn, mini-game ít thời gian hơn. Ghé pantry ăn gì đi!', 'bad', 4.5); updateHUD(); }
        if (!h) hungryWarned = false;
        if (R.st.nl <= C.FAINT && !fainting) { startDialogMode(); faint().then(() => { save(); endDialogMode(); updateHUD(); }); }
      }
      taskAcc += realDt;
      if (taskAcc > 1) { taskAcc = 0; taskTick(); }
    }

    const others = Object.values(npcs).filter((n) => n.mesh.visible).map((n) => n.mesh.position);
    fp.update(dt, { colliders: world ? world.colliders : [], others, bounds: BOUNDS, canMove: mode === 'play', idleSpin: mode === 'menu' || mode === 'companies' || mode === 'away', speed: hungry() ? 0.72 : 1 });

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
      const isTarget = ((step && step.who === id) || taskTarget) && mode === 'play';
      n.marker.visible = !!isTarget;
      if (isTarget) {
        n.marker.material.color.set(step && step.who === id ? '#ffd25a' : '#8fd6ff');
        n.marker.position.y = 2.05 + Math.sin(elapsed * 3) * 0.06; n.marker.rotation.y += dt * 2;
      }
    }
    if (step && step.who.startsWith('obj:') && mode === 'play' && world) {
      const it = world.interactables.find((x) => 'obj:' + x.id === step.who);
      objMarker.visible = !!it;
      if (it) { objMarker.position.set(it.pos.x, it.pos.y + 0.75 + Math.sin(elapsed * 3) * 0.06, it.pos.z); objMarker.rotation.y += dt * 2; }
    } else objMarker.visible = false;

    // the office cat: walk the loop, nap at each stop
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
    } else if (!$('#prompt').hidden) $('#prompt').hidden = true;
    if (step && R && (mode === 'play' || mode === 'pause')) {
      if (step.who.startsWith('call:')) { $('#objArrow').style.transform = 'rotate(0deg)'; $('#objArrow').textContent = '📞'; $('#objDist').textContent = '· Teams'; }
      else {
        $('#objArrow').textContent = '➤';
        let tp = null;
        if (step.who.startsWith('obj:')) { const it = world && world.interactables.find((x) => 'obj:' + x.id === step.who); if (it) tp = it.pos; }
        else if (npcs[step.who]) tp = npcs[step.who].mesh.position;
        if (tp) { const a = fp.arrowTo(tp); $('#objArrow').style.transform = `rotate(${a.deg}deg)`; $('#objDist').textContent = `· ${Math.round(a.dist)}m`; }
      }
    }
  }

  // test / debug hook (used by e2e and QC): ?debug=1 adds fast-forward helpers
  window.__tm = {
    get R() { return R; }, get mode() { return mode; }, get profile() { return profile; }, get CO() { return CO; },
    get fp() { return fp; }, get npcs() { return npcs; }, get world() { return world; },
    currentStep, interact, cat, place: (i) => placeNPCs(i), day: () => day(),
    showMenu, showCompanies, save,
    replaceProfile(p) { const v = validateProfile(p); if (!v) return false; profile = v; R = null; save(); showMenu(); return true; },
  };
  if (/[?&]debug=1/.test(location.search)) {
    window.__tm.skipTo = (d) => { if (!R) return; R.day = d; R.step = 0; R.today = null; R.pending = []; save(); showDayIntro(); };
    window.__tm.fx = applyFx;
  }
  showMenu();
  return { update, showMenu };
}
