// Ba & Má — company module (see docs/COMPANY_CONTRACT.md for every field).
// Family dried-food company (khô gà, khô heo, khô bò, trái cây sấy). Reuses the legacy "Ba Mẹ & Partners" cast.
import { CAST, IDLE, CAT_NAME } from './cast.js';
import { INTERVIEW } from './interview.js';
import { EPISODES } from './episodes.js';
import { ROUTINE, SIDE_TASKS } from './routine.js';
import { THEME, REVIEW, PROMOTION, ENDINGS, TIES, OBJ_LINES, FOOD, LIFE_EVENTS } from './extras.js';
import { DESK } from './desk.js';

export default {
  id: 'bama',
  manager: 'hang',
  officialSalary: 10_000_000,
  catName: CAT_NAME,
  cast: CAST,
  idle: IDLE,
  theme: THEME,
  interview: INTERVIEW,
  episodes: EPISODES,
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
