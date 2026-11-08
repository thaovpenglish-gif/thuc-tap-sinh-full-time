// Khu phố T&M · main story + dramas (sim/story.js) and the content files (data/story.js, dramas_a.js, dramas_b.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as W from '../site/js/khupho/sim/world.js';
import * as S from '../site/js/khupho/sim/story.js';
import { STORY } from '../site/js/khupho/data/story.js';
import { DRAMAS as DA } from '../site/js/khupho/data/dramas_a.js';
import { DRAMAS as DB } from '../site/js/khupho/data/dramas_b.js';
import { checkStory, checkDramas } from '../scripts/check-kp-story.mjs';

const fresh = () => { const kp = W.newGame({ name: 'Thảo', seed: 5, now: 0 }); S.ensureStory(kp); return kp; };
const sc = (who = 'kp:lanh') => ({ lines: [[who, 'Chào con.']], choices: [{ t: 'Dạ', fx: { mood: 2, hearts: { [who]: 1 }, flag: 'chao' } }, { t: 'Ờ', fx: { mood: -1 } }] });
const MINI = [
  { id: 'c1', title: 'Chương 1', intro: 'Mở đầu.', done: 'Xong chương 1.', beats: [
    { id: 'b1', task: 'Chào cô Ba', where: 'phongtro', scene: sc() },
    { id: 'b2', task: 'Làm 2 ngày', where: 'trasua', need: { type: 'work', count: 2 } },
    { id: 'b2x', task: 'Chỉ khi đã chào', where: 'cho', needFlag: 'khongco', scene: sc() },
  ] },
  { id: 'c2', title: 'Chương 2', intro: 'Tiếp.', beats: [{ id: 'b3', task: 'Ghé chợ', where: 'cho', need: { type: 'visit' } }] },
];
const DR = [
  { id: 'd90', no: 90, title: 'Drama thử', who: ['kp:ly'], minDay: 2, acts: [
    { gap: 0, place: 'cho', from: '07:00', to: '11:00', task: 'Hồi 1', scene: sc('kp:ly'), missed: 'Bà Phấn: Hồi 1 xảy ra rồi.' },
    { gap: 1, place: 'quannhau', from: '18:00', to: '21:00', task: 'Hồi 2', scene: sc('kp:ly'), missed: 'Bà Phấn: Hồi 2 xong.' },
  ], end: 'Biên bản: xong.' },
  { id: 'd91', no: 91, title: 'Drama sau', who: ['kp:ly'], minDay: 2, needFlag: 'd90_done', acts: [
    { gap: 0, place: 'cho', from: '07:00', to: '11:00', task: 'A', scene: sc('kp:ly'), missed: 'X: a' },
    { gap: 0, place: 'cho', from: '12:00', to: '13:00', task: 'B', scene: sc('kp:ly'), missed: 'X: b' },
  ], end: 'Hết.' },
];

test('story: scene beats complete when played, need beats count from the beat start, flags skip branches', () => {
  const kp = fresh();
  let ev = S.progress(kp, MINI);
  assert.ok(ev.some((e) => e.type === 'chapter' && e.title === 'Chương 1'));
  assert.equal(S.currentBeat(kp, MINI).beat.id, 'b1');
  S.count(kp, 'shift'); // before b2 starts: must not count
  const items = S.scenesAt(kp, 'phongtro', MINI, []);
  assert.equal(items.length, 1);
  const r = S.finishScene(kp, items[0], 0, MINI, []);
  assert.equal(kp.rel['kp:lanh'], 1); assert.ok(kp.story.flags.chao); assert.ok(r.lines.length >= 2);
  assert.equal(S.currentBeat(kp, MINI).beat.id, 'b2');
  S.count(kp, 'shift'); assert.equal(S.progress(kp, MINI).length, 0);
  S.count(kp, 'office'); ev = S.progress(kp, MINI);
  assert.ok(ev.some((e) => e.type === 'chapter_done')); assert.ok(ev.some((e) => e.type === 'chapter' && e.title === 'Chương 2'));
  assert.equal(S.currentBeat(kp, MINI).beat.id, 'b3', 'b2x skipped: its flag is not set');
  S.count(kp, 'visit', 'cho'); ev = S.progress(kp, MINI);
  assert.ok(ev.some((e) => e.type === 'story_end')); assert.equal(S.currentBeat(kp, MINI), null);
});

test('choicesFor: role-only and flag-only choices are filtered', () => {
  const kp = fresh();
  const scene = { lines: [['nar', '.']], choices: [{ t: 'a' }, { t: 'b' }, { t: 'c', role: 'trasua' }, { t: 'd', needFlag: 'x' }] };
  assert.deepEqual(S.choicesFor(kp, scene, ['any']).map((c) => c.t), ['a', 'b']);
  kp.story.flags.x = true;
  assert.deepEqual(S.choicesFor(kp, scene, ['any', 'trasua']).map((c) => c.i), [0, 1, 2, 3]);
});

test('dramas: start on a new day, act windows, missed acts go to Xóm Ơi, the end sets <id>_done and unlocks the next', () => {
  const kp = fresh();
  assert.equal(S.newDay(kp, DR).length, 0, 'day 1: too early (minDay 2)');
  W.sleep(kp); // day 2, 6h
  let ev = S.newDay(kp, DR);
  assert.ok(ev.some((e) => e.type === 'drama_start' && e.id === 'd90'));
  assert.equal(S.newDay(kp, DR).filter((e) => e.type === 'drama_start').length, 0, 'd91 needs d90_done; one drama at a time per spacing');
  assert.equal(S.scenesAt(kp, 'cho', [], DR).length, 0, '6h: before the 7h window');
  W.advance(kp, 90, 'idle');
  const it = S.scenesAt(kp, 'cho', [], DR);
  assert.equal(it.length, 1); assert.equal(it[0].act, 0);
  S.finishScene(kp, it[0], 1, [], DR);
  assert.equal(kp.dramas.active[0].act, 1);
  assert.equal(S.scenesAt(kp, 'quannhau', [], DR).length, 0, 'act 2 is tomorrow');
  const objs = S.objectives(kp, [], DR); assert.equal(objs[0].kind, 'drama'); assert.equal(objs[0].today, false);
  // skip act 2 entirely: next morning + after 21h → missed, drama ends
  W.sleep(kp); W.sleep(kp);
  const before = kp.xomoi.msgs.length;
  ev = S.tickDramas(kp, DR);
  assert.ok(ev.some((e) => e.type === 'drama_missed')); assert.ok(ev.some((e) => e.type === 'drama_end'));
  assert.ok(kp.xomoi.msgs.length >= before + 2, 'missed line + end line posted');
  assert.ok(kp.story.flags.d90_done); assert.equal(kp.counters.drama, 1);
  kp.dramas.lastStart = 0;
  ev = S.newDay(kp, DR);
  assert.ok(ev.some((e) => e.type === 'drama_start' && e.id === 'd91'));
});

test('content: the story and the 28 dramas pass the checker', () => {
  assert.deepEqual(checkStory(STORY), []);
  const all = [...DA, ...DB];
  assert.deepEqual(checkDramas(all), []);
  assert.equal(all.length, 28, '28 dramas from DESIGN.md 8.3');
  assert.deepEqual(all.map((d) => d.no).sort((a, b) => a - b), Array.from({ length: 28 }, (_, i) => i + 1));
  const beats = STORY.reduce((n, c) => n + c.beats.length, 0);
  assert.ok(STORY.length >= 5 && beats >= 30, `${STORY.length} chapters, ${beats} beats`);
  // the first beat of the story happens at home on day 1
  assert.equal(STORY[0].beats[0].where, 'phongtro');
  // dramas whose needFlag points at another drama: that drama exists
  for (const d of all) if (d.needFlag && /^d\d\d_done$/.test(d.needFlag)) assert.ok(all.some((x) => `${x.id}_done` === d.needFlag), d.id);
});

test('playing 60 days with the real content: dramas keep coming, none gets stuck', () => {
  const kp = fresh(); const all = [...DA, ...DB];
  let started = 0;
  for (let d = 0; d < 60; d++) { W.sleep(kp); started += S.newDay(kp, all).filter((e) => e.type === 'drama_start').length; S.tickDramas(kp, all); kp.player.money = 3_000_000; }
  assert.ok(started >= 12, `only ${started} dramas started in 60 days`);
  assert.ok(kp.dramas.done.length >= 10, `only ${kp.dramas.done.length} finished`);
});
