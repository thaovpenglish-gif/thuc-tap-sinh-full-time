// Side tasks ("việc vặt") with in-game deadlines. Pure: every function returns new arrays + events.
// A task is a chain of legs; each leg is "go talk to <npc>" or "use <obj>". Templates live in story data.
import { deadlineFor } from './difficulty.js';

/** Small deterministic RNG so a day's tasks are reproducible from a seed. */
export function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/**
 * Pick `count` templates and schedule them inside [startMin, endMin).
 * templates: [{ id, title, from, base, legs:[{npc|obj, line}] , reward?, penalty? }]
 */
export function planTasks({ templates, count, tierId, startMin, endMin, seed = 1, scale = 1 }) {
  const r = rng(seed);
  const pool = [...templates];
  const picked = [];
  while (picked.length < count && pool.length) picked.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  const span = Math.max(1, endMin - startMin);
  return picked.map((t, i) => {
    const spawnAt = Math.round(startMin + span * ((i + 0.3 + r() * 0.4) / Math.max(1, count)) * 0.85);
    return { id: `${t.id}#${i}`, tpl: t.id, title: t.title, from: t.from, legs: t.legs, leg: 0, spawnAt, deadline: spawnAt + deadlineFor(tierId, (t.base || 60) * scale), status: 'pending' };
  });
}

export const active = (tasks) => tasks.filter((t) => t.status === 'open');
export const currentLeg = (t) => t.legs[t.leg];

/** Advance time: spawn tasks whose time has come, mark overdue ones late. */
export function tick(tasks, clock, maxOpen = Infinity) {
  const events = [];
  let open = tasks.filter((t) => t.status === 'open').length;
  const next = tasks.map((t) => {
    if (t.status === 'pending' && clock >= t.spawnAt) {
      // too many open tasks: postpone this one by 20 minutes (keeps its time window)
      if (open >= maxOpen) return { ...t, spawnAt: clock + 20, deadline: t.deadline + (clock + 20 - t.spawnAt) };
      open++;
      events.push({ type: 'spawned', task: t }); return { ...t, status: 'open' };
    }
    if (t.status === 'open' && clock > t.deadline) { events.push({ type: 'late', task: t }); return { ...t, status: 'late' }; }
    return t;
  });
  return { tasks: next, events };
}

/** The player interacted with `target` ({npc} or {obj}); advance every open task whose current leg matches. */
export function visit(tasks, target) {
  const events = [];
  const next = tasks.map((t) => {
    if (t.status !== 'open') return t;
    const leg = currentLeg(t);
    const hit = (target.npc && leg.npc === target.npc) || (target.obj && leg.obj === target.obj);
    if (!hit) return t;
    const leg2 = t.leg + 1;
    if (leg2 >= t.legs.length) { events.push({ type: 'done', task: t, leg }); return { ...t, leg: leg2, status: 'done' }; }
    events.push({ type: 'leg', task: t, leg });
    return { ...t, leg: leg2 };
  });
  return { tasks: next, events };
}

export function decline(tasks, id) {
  return tasks.map((t) => (t.id === id && (t.status === 'open' || t.status === 'pending') ? { ...t, status: 'declined' } : t));
}

export function summary(tasks) {
  const c = { done: 0, late: 0, declined: 0, open: 0, pending: 0 };
  for (const t of tasks) c[t.status] = (c[t.status] || 0) + 1;
  return c;
}

/** The clock jumped (a story scene took time): push every unfinished task's times by `delta` minutes. */
export function shiftTasks(tasks, delta) {
  if (!delta) return tasks;
  return tasks.map((t) => (t.status === 'open' || t.status === 'pending' ? { ...t, spawnAt: t.spawnAt + delta, deadline: t.deadline + delta } : t));
}

/** Resolve every unfinished task at once (fast-forwarded days). n done, the rest late. */
export function resolveAll(tasks, nDone) {
  let k = 0;
  return tasks.map((t) => (t.status === 'open' || t.status === 'pending' ? { ...t, status: k++ < nDone ? 'done' : 'late' } : t));
}
