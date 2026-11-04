// Người Đúng Chỗ HR — company module (see docs/COMPANY_CONTRACT.md for every field).
// An HR consulting & headhunting firm whose own internal HR is the messiest thing it touches.
import { CAST, IDLE, THEME, CAT_NAME } from './cast.js';
import { INTERVIEW } from './interview.js';
import { EPISODES, OFFICIAL_EPISODES } from './episodes.js';
import { ROUTINE, SIDE_TASKS } from './routine.js';
import { REVIEW, PROMOTION, ENDINGS, FOOD, LIFE_EVENTS, OBJ_LINES, TIES } from './extras.js';

export default {
  id: 'hr',
  manager: 'ngan',
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
