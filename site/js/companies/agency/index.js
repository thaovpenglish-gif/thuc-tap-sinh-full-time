// Trend Trễ Agency — company module (see docs/COMPANY_CONTRACT.md for every field).
// A ~30-person Vietnamese marketing agency: clients revise "lần cuối" 14 times, KOLs flake, viral goes the wrong way.
import { CAST, IDLE, THEME, CAT_NAME, TIES, OBJ_LINES } from './cast.js';
import { INTERVIEW } from './interview.js';
import { EPISODES } from './episodes.js';
import { ROUTINE } from './routine.js';
import { SIDE_TASKS, REVIEW, PROMOTION, OFFICIAL_EPISODES, ENDINGS, FOOD, LIFE_EVENTS } from './extras.js';

export default {
  id: 'agency',
  manager: 'diep',
  officialSalary: 10_000_000,
  catName: CAT_NAME,
  cast: CAST,
  idle: IDLE,
  theme: THEME,
  interview: INTERVIEW,
  episodes: [...EPISODES, ...OFFICIAL_EPISODES],
  routine: ROUTINE,
  sideTasks: SIDE_TASKS,
  review: REVIEW,
  promotion: PROMOTION,
  endings: ENDINGS,
  objLines: OBJ_LINES,
  food: FOOD,
  lifeEvents: LIFE_EVENTS,
  ties: TIES,
};
