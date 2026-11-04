// Nợ Kỹ Thuật Labs — company module (see docs/COMPANY_CONTRACT.md for every field).
import { CAST, IDLE, THEME, OBJ_LINES, CAT_NAME } from './cast.js';
import { INTERVIEW } from './interview.js';
import { EPISODES, ARC } from './episodes.js';
import { ROUTINE } from './routine.js';
import { SIDE_TASKS, REVIEW, PROMOTION, ENDINGS, FOOD, LIFE_EVENTS, TIES } from './extras.js';

export default {
  id: 'tech',
  manager: 'diep',
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
  objLines: OBJ_LINES,
  food: FOOD,
  lifeEvents: LIFE_EVENTS,
  ties: TIES,
};
