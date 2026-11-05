// Đi Đâu Cũng Được — event organising & travel company (see docs/COMPANY_CONTRACT.md).
// "Có Plan B chưa em?" All people, clients, vendors and brands are fictional.
import { CAST, IDLE, THEME, OBJ_LINES, TIES, CAT_NAME } from './cast.js';
import { INTERVIEW } from './interview.js';
import { EPISODES } from './episodes.js';
import { ROUTINE, SIDE_TASKS } from './routine.js';
import { REVIEW, PROMOTION, ENDINGS, FOOD, LIFE_EVENTS } from './extras.js';
import { DESK } from './desk.js';

export default {
  id: 'event',
  manager: 'duy',
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
  objLines: OBJ_LINES,
  food: FOOD,
  lifeEvents: LIFE_EVENTS,
  ties: TIES,
  desk: DESK,
};
