// Khu phố T&M · the main storyline and the drama scheduler (docs/khupho/STORY_FORMAT.md). Pure, JSON-safe.
// State: kp.story { ch, beat, base, seen, chDone, finished }, kp.dramas { active, done, lastStart }, kp.counters, kp.rel.
// The mode calls count() when the player does things, sceneAt() when a door opens, finishScene() after a choice,
// progress() after anything (story beats complete themselves), and newDay() each morning (dramas start or move on).
import { addMoney } from './world.js';
import { dateOf } from './calendar.js';
import { cozyScore } from './home.js';

const COUNTERS = ['shift', 'office', 'eat', 'furniture', 'sleep', 'ride', 'drama', 'xomoi', 'profile'];
const toMin = (hhmm) => { const [h, m] = String(hhmm || '0:0').split(':').map(Number); return h * 60 + (m || 0); };
const snapshot = (c) => JSON.parse(JSON.stringify(c));

export function ensureStory(kp) {
  if (!kp.counters || typeof kp.counters !== 'object') kp.counters = {};
  for (const k of COUNTERS) if (typeof kp.counters[k] !== 'number') kp.counters[k] = 0;
  if (!kp.counters.visit || typeof kp.counters.visit !== 'object') kp.counters.visit = {};
  if (!kp.rel || typeof kp.rel !== 'object') kp.rel = {};
  if (!kp.story || typeof kp.story !== 'object') kp.story = { ch: 0, beat: 0, base: snapshot(kp.counters), seen: {}, chDone: [], finished: false, started: false };
  if (!kp.story.seen) kp.story.seen = {};
  if (!kp.story.flags) kp.story.flags = {};
  if (!kp.dramas || typeof kp.dramas !== 'object') kp.dramas = { active: [], done: [], lastStart: 0 };
  return kp.story;
}

/** Count something the player did (type: shift | office | eat | furniture | sleep | ride | drama | xomoi | profile | visit). */
export function count(kp, type, place) {
  ensureStory(kp);
  if (type === 'visit') { if (place) kp.counters.visit[place] = (kp.counters.visit[place] || 0) + 1; return; }
  if (COUNTERS.includes(type)) kp.counters[type] += 1;
}

export const hasFlag = (kp, f) => !f || !!(kp.story && kp.story.flags && kp.story.flags[f]);
const roleOk = (c, roles) => !c.role || c.role === 'any' || (roles && roles.includes(c.role));
/** The choices of a scene this player can pick (role and flag filters). Keeps the original index as `i`. */
export function choicesFor(kp, scene, roles = []) {
  return (scene.choices || []).map((c, i) => ({ ...c, i })).filter((c) => roleOk(c, roles) && hasFlag(kp, c.needFlag));
}

// ---------- main story ----------
function beatAt(STORY, ch, beat) { const c = STORY[ch]; return c ? { chapter: c, beat: c.beats[beat] || null } : null; }
/** → { chapter, beat, chIndex } for the current beat, or null when the story is finished. Skips beats whose flag is not set. */
export function currentBeat(kp, STORY) {
  ensureStory(kp);
  const s = kp.story;
  while (s.ch < STORY.length) {
    const at = beatAt(STORY, s.ch, s.beat);
    if (at && at.beat) {
      if (!hasFlag(kp, at.beat.needFlag)) { s.beat++; s.base = snapshot(kp.counters); continue; }
      return { chapter: at.chapter, beat: at.beat, chIndex: s.ch };
    }
    s.ch++; s.beat = 0;
  }
  s.finished = true;
  return null;
}

function needMet(kp, b) {
  const n = b.need; if (!n) return !!kp.story.seen[b.id];
  const c = kp.counters, base = kp.story.base || {};
  const d = (k) => (c[k] || 0) - (base[k] || 0);
  const want = n.count || 1;
  switch (n.type) {
    case 'tamtru': return !!kp.player.tamTru;
    case 'work': return d('shift') + d('office') >= want;
    case 'visit': return ((c.visit || {})[b.where] || 0) - ((base.visit || {})[b.where] || 0) >= 1;
    case 'cozy': return cozyScore(kp) >= (n.atLeast || 1);
    case 'money': return kp.player.money >= (n.atLeast || 0);
    case 'day': return kp.time.day >= (n.atLeast || 1);
    default: return COUNTERS.includes(n.type) ? d(n.type) >= want : false;
  }
}

/** Complete every satisfied beat. → events [{ type: 'beat', task } | { type: 'chapter', title, intro, done } | { type: 'story_end' }] */
export function progress(kp, STORY) {
  const ev = [];
  const s = ensureStory(kp);
  if (!s.started && STORY.length) { s.started = true; ev.push({ type: 'chapter', title: STORY[0].title, intro: STORY[0].intro }); }
  for (let guard = 0; guard < 200; guard++) {
    const cur = currentBeat(kp, STORY);
    if (!cur) { if (!s.endShown && STORY.length) { s.endShown = true; ev.push({ type: 'story_end' }); } break; }
    const { beat, chapter } = cur;
    if (beat.scene && beat.need && !s.seen[beat.id] && !needMet(kp, beat)) break;
    if (!needMet(kp, beat)) break;
    ev.push({ type: 'beat', task: beat.task });
    s.beat++; s.base = snapshot(kp.counters);
    while (s.beat < chapter.beats.length && !hasFlag(kp, chapter.beats[s.beat].needFlag)) s.beat++; // branch not taken
    if (s.beat >= chapter.beats.length) {
      s.chDone.push(chapter.id);
      const next = STORY[s.ch + 1];
      ev.push({ type: 'chapter_done', title: chapter.title, done: chapter.done || '' });
      s.ch++; s.beat = 0;
      if (next) ev.push({ type: 'chapter', title: next.title, intro: next.intro });
    }
  }
  return ev;
}

// ---------- dramas ----------
const actDay = (a, d, i) => a.start + d.acts.slice(0, i + 1).reduce((n, x) => n + (x.gap || 0), 0);
function postXomoi(kp, line) {
  if (!line || !kp.xomoi) return;
  const m = String(line).match(/^([^:]{2,30}):\s*(.+)$/);
  kp.xomoi.msgs.push({ day: kp.time.day, min: kp.time.min, from: m ? m[1] : 'Xóm Ơi', fromId: null, text: m ? m[2] : String(line), seen: false, delivered: false });
}
function closeDrama(kp, d, a, ev) {
  kp.dramas.active = kp.dramas.active.filter((x) => x.id !== a.id);
  if (!kp.dramas.done.includes(d.id)) kp.dramas.done.push(d.id);
  kp.story.flags[`${d.id}_done`] = true;
  kp.counters.drama += 1;
  if (d.end) postXomoi(kp, `Chú Cường: ${d.end}`);
  ev.push({ type: 'drama_end', id: d.id, title: d.title, end: d.end || '' });
}
/** Missed acts → Xóm Ơi, the drama moves on. Call after the clock moves. → events */
export function tickDramas(kp, DRAMAS) {
  ensureStory(kp);
  const ev = [];
  for (const a of [...kp.dramas.active]) {
    const d = DRAMAS.find((x) => x.id === a.id); if (!d) { kp.dramas.active = kp.dramas.active.filter((x) => x !== a); continue; }
    for (let guard = 0; guard < 6 && a.act < d.acts.length; guard++) {
      const act = d.acts[a.act], day = actDay(a, d, a.act);
      const over = kp.time.day > day || (kp.time.day === day && kp.time.min > toMin(act.to));
      if (!over) break;
      postXomoi(kp, act.missed);
      ev.push({ type: 'drama_missed', id: d.id, title: d.title, task: act.task });
      a.act++;
      if (a.act >= d.acts.length) closeDrama(kp, d, a, ev);
    }
  }
  return ev;
}
/** Each morning: maybe start a new drama (at most 2 at once, one every 3-5 days). → events */
export function newDay(kp, DRAMAS) {
  ensureStory(kp);
  const ev = tickDramas(kp, DRAMAS);
  const D = kp.dramas, day = kp.time.day;
  const spacing = 3 + (day % 3);
  if (D.active.length >= 2 || (D.lastStart && day - D.lastStart < spacing)) return ev;
  const wd = dateOf(day).weekday;
  const pick = [...DRAMAS].sort((a, b) => a.minDay - b.minDay || a.no - b.no).find((d) =>
    !D.done.includes(d.id) && !D.active.some((x) => x.id === d.id) && d.minDay <= day && hasFlag(kp, d.needFlag) && (!d.startOn || d.startOn.includes(wd)));
  if (!pick) return ev;
  D.active.push({ id: pick.id, start: day, act: 0 });
  D.lastStart = day;
  ev.push({ type: 'drama_start', id: pick.id, title: pick.title, task: pick.acts[0].task, place: pick.acts[0].place });
  return ev;
}

/** The objectives to show on the HUD: the story beat, then today's drama acts. */
export function objectives(kp, STORY, DRAMAS) {
  const out = [];
  const cur = currentBeat(kp, STORY);
  if (cur) out.push({ kind: 'story', task: cur.beat.task, hint: cur.beat.hint || '', where: cur.beat.where, chapter: cur.chapter.title, from: cur.beat.from, to: cur.beat.to, minDay: cur.beat.minDay || 0, waiting: (cur.beat.minDay || 0) > kp.time.day });
  for (const a of kp.dramas.active) {
    const d = DRAMAS.find((x) => x.id === a.id); if (!d || a.act >= d.acts.length) continue;
    const act = d.acts[a.act], day = actDay(a, d, a.act);
    out.push({ kind: 'drama', task: act.task, where: act.place, title: d.title, from: act.from, to: act.to, today: day === kp.time.day, day });
  }
  return out;
}

const inWindow = (kp, from, to) => (!from || kp.time.min >= toMin(from)) && (!to || kp.time.min <= toMin(to));
/** Scenes waiting at this door right now. → [{ kind, ref, title, task, scene }] */
export function scenesAt(kp, placeId, STORY, DRAMAS) {
  const out = [];
  const cur = currentBeat(kp, STORY);
  if (cur && cur.beat.where === placeId && cur.beat.scene && !kp.story.seen[cur.beat.id] && inWindow(kp, cur.beat.from, cur.beat.to) && kp.time.day >= (cur.beat.minDay || 0))
    out.push({ kind: 'story', ref: cur.beat.id, title: cur.chapter.title, task: cur.beat.task, scene: cur.beat.scene });
  for (const a of kp.dramas.active) {
    const d = DRAMAS.find((x) => x.id === a.id); if (!d || a.act >= d.acts.length) continue;
    const act = d.acts[a.act];
    if (act.place === placeId && actDay(a, d, a.act) === kp.time.day && inWindow(kp, act.from, act.to))
      out.push({ kind: 'drama', ref: d.id, title: d.title, task: act.task, scene: act.scene, act: a.act, acts: d.acts.length });
  }
  return out;
}

/** Apply a choice's fx. → short result lines for the screen. */
export function applyFx(kp, fx = {}, label = 'Chuyện khu phố') {
  const lines = [];
  const n = kp.player.needs, clamp = (v) => Math.max(0, Math.min(100, v));
  if (fx.money) { addMoney(kp, fx.money, 'story', label); lines.push(`${fx.money > 0 ? '+' : '−'}${Math.abs(fx.money).toLocaleString('vi-VN').replace(/,/g, '.')}đ`); }
  for (const [k, name] of [['mood', 'tâm trạng'], ['energy', 'năng lượng'], ['food', 'no bụng']]) if (fx[k]) { n[k] = clamp((n[k] || 0) + fx[k]); lines.push(`${fx[k] > 0 ? '+' : ''}${fx[k]} ${name}`); }
  if (fx.hearts) for (const [id, v] of Object.entries(fx.hearts)) { kp.rel[id] = Math.max(-5, Math.min(10, (kp.rel[id] || 0) + v)); lines.push({ id, v }); }
  if (fx.flag) kp.story.flags[fx.flag] = true;
  if (fx.xomoi) postXomoi(kp, fx.xomoi);
  return lines;
}

/** The player finished a scene (choice index into scene.choices, or -1 for none). → { lines, events } */
export function finishScene(kp, item, choiceIdx, STORY, DRAMAS) {
  ensureStory(kp);
  const ev = [];
  const choice = choiceIdx >= 0 && item.scene.choices ? item.scene.choices[choiceIdx] : null;
  const lines = choice ? applyFx(kp, choice.fx || {}, item.kind === 'drama' ? `Drama: ${item.title}` : 'Cốt truyện') : [];
  if (item.kind === 'story') kp.story.seen[item.ref] = true;
  else {
    const a = kp.dramas.active.find((x) => x.id === item.ref), d = DRAMAS.find((x) => x.id === item.ref);
    if (a && d) { a.act++; if (a.act >= d.acts.length) closeDrama(kp, d, a, ev); }
  }
  ev.push(...progress(kp, STORY));
  return { lines, events: ev };
}
