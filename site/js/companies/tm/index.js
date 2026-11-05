// T&M Partners — company module (see docs/COMPANY_CONTRACT.md for every field).
// Story data for the interview and Day 1 lives in story/tm/*.js (kept where it was written).
import { CAST, IDLE } from '../../story/tm/characters.js';
import { PROLOGUE } from '../../story/tm/prologue.js';
import { DAY1 } from '../../story/tm/day1.js';
import { EPISODES, ROUTINE, SIDE_TASKS, REVIEW, PROMOTION, ENDINGS, TIES, OBJ_LINES, FOOD, LIFE_EVENTS } from './content.js';
import { DESK } from './desk.js';

const cast = {};
for (const [id, c] of Object.entries(CAST)) cast[id] = { ...c, spot: c.body === false ? null : id };

export default {
  id: 'tm',
  manager: 'tuyet',
  officialSalary: 15_000_000,
  catName: 'Mèo KPI',
  cast, idle: IDLE,
  theme: {}, // the office map's default theme is T&M
  interview: PROLOGUE,
  episodes: [
    { id: 'onboarding', day: 1, title: DAY1.subtitle, intro: DAY1.intro, pos: DAY1.pos, steps: DAY1.steps, diary: DAY1.diary, sideTasks: true },
    ...EPISODES,
  ],
  routine: ROUTINE,
  sideTasks: SIDE_TASKS,
  review: REVIEW,
  promotion: PROMOTION,
  endings: ENDINGS,
  ties: TIES,
  objLines: OBJ_LINES,
  food: FOOD,
  lifeEvents: LIFE_EVENTS,
  desk: DESK,
};
