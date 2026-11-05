// Cân Đối & Cộng Sự — accounting & audit firm. Company module (see docs/COMPANY_CONTRACT.md for every field).
import { CAST, IDLE, CAT_NAME } from './cast.js';
import { INTERVIEW } from './interview.js';
import { EPISODES, ARC } from './episodes.js';
import { ROUTINE, SIDE_TASKS } from './routine.js';
import { THEME, REVIEW, PROMOTION, ENDINGS, TIES, OBJ_LINES, FOOD, LIFE_EVENTS } from './extras.js';
import { DESK } from './desk.js';

export default {
  id: 'audit',
  manager: 'thao',
  officialSalary: 15_000_000,
  catName: CAT_NAME,
  cast: CAST,
  idle: IDLE,
  theme: THEME,
  interview: INTERVIEW,
  episodes: EPISODES,
  routine: ROUTINE,
  sideTasks: SIDE_TASKS,
  review: REVIEW,
  promotion: { ...PROMOTION, arc: ARC },
  endings: ENDINGS,
  ties: TIES,
  objLines: OBJ_LINES,
  food: FOOD,
  lifeEvents: LIFE_EVENTS,
  desk: DESK,
};
