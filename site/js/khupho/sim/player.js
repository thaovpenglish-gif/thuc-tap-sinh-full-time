// Khu phố T&M · the player: money, needs, papers (DESIGN.md 3.2, 3.3). Pure, JSON-safe.
import { FOOD } from '../data/food.js';

export const NEED_LOW = 25;
export const START_MONEY = 3_000_000;
export const MIN_WAGE_HOUR = 25_500; // lương tối thiểu vùng I 2026 theo giờ (Nghị định 293/2025)

export function createPlayer(name) {
  return {
    name: String(name || 'Bạn').slice(0, 24),
    money: START_MONEY,
    needs: { food: 80, energy: 90, mood: 70 },
    home: { place: 'phongtro', room: 5 },
    tamTru: false, tamTruDay: null,   // tạm trú registered (on VNeID, free) and on which game day
    bhyt: false,                       // false | 'job' | 'self'
    rentDebt: 0,                       // what you owe cô Ba Lành (rent + bills she covered)
    certs: [], skills: {}, reputation: 50,
    at: 'phongtro',                    // place id the player is in/near (the 3D mode may update it)
    pantry: 0,                         // meals worth of groceries in the room
    today: { coffee: 0, shifts: 0, ate: 0 },
  };
}

const clamp = (x) => Math.max(0, Math.min(100, x));
const r1 = (x) => Math.round(x * 10) / 10;

// Per game minute. food ~0.07/phút like Solo; a 4h shift costs ~26 energy (design: −20 to −35).
export const DECAY = {
  walk:  { food: 0.07, energy: 0.04, mood: 0 },
  idle:  { food: 0.06, energy: 0.03, mood: 0 },
  work:  { food: 0.09, energy: 0.11, mood: -0.005 },
  rest:  { food: 0.05, energy: -0.08, mood: -0.01 },   // negative = gains (ngồi nghỉ ở sân chơi)
  sleep: { food: 0.025, energy: 0, mood: 0 },          // sleeping energy is restored by world.sleep
};

/** Needs decay over `minutes` of `activity` ('walk' | 'work' | 'rest' | 'sleep' | 'idle'). opts.foodMul (hot noon walk ×1.5). */
export function spend(player, minutes, activity = 'walk', opts = {}) {
  const d = DECAY[activity] || DECAY.walk;
  const n = player.needs;
  n.food = r1(clamp(n.food - d.food * minutes * (opts.foodMul || 1)));
  n.energy = r1(clamp(n.energy - d.energy * minutes * (opts.energyMul || 1)));
  // mood drifts slowly toward 60 and sinks when hungry or exhausted
  let dm = -d.mood * minutes + (60 - n.mood) * 0.0008 * minutes;
  if (n.food < NEED_LOW) dm -= 0.02 * minutes;
  if (n.energy < 20) dm -= 0.01 * minutes;
  n.mood = r1(clamp(n.mood + dm));
  return player;
}

/** Can the player eat this now (pantry, food known)? → { ok, reason } */
export function canEat(player, foodId) {
  const f = FOOD[foodId];
  if (!f) return { ok: false, reason: 'Món này khu phố chưa bán.' };
  if (f.needsPantry && player.pantry <= 0) return { ok: false, reason: 'Phòng hết đồ nấu. Ra chợ mua trước đã.' };
  return { ok: true };
}

/** Eat (or buy groceries). price comes from economy.priceOf; portion < 1 when the owner trimmed the portion.
 *  → { ok, reason?, minutes, food, energy, mood, price } */
export function eat(player, foodId, price = 0, portion = 1) {
  const f = FOOD[foodId];
  const can = canEat(player, foodId);
  if (!can.ok) return { ok: false, reason: can.reason, minutes: 0 };
  price = Math.max(0, Math.round(price || 0));
  player.money -= price;
  if (f.pantry) { player.pantry += f.pantry; return { ok: true, minutes: f.min, food: 0, energy: 0, mood: 0, price, pantry: player.pantry }; }
  if (f.needsPantry) player.pantry -= 1;
  let energy = f.energy, mood = f.mood;
  if (f.coffee) {
    player.today.coffee = (player.today.coffee || 0) + 1;
    if (player.today.coffee >= 3) { energy = -5; mood = -3; } // ly thứ ba phản tác dụng
  }
  const food = Math.round(f.food * portion);
  const n = player.needs;
  n.food = r1(clamp(n.food + food));
  n.energy = r1(clamp(n.energy + energy));
  n.mood = r1(clamp(n.mood + mood));
  player.today.ate = (player.today.ate || 0) + 1;
  return { ok: true, minutes: f.min, food, energy, mood, price };
}

/** Status words for the HUD. */
export function needLabel(v) { return v >= 70 ? 'ổn' : v >= 45 ? 'tạm' : v >= NEED_LOW ? 'thấp' : 'báo động'; }

/** Skill gain helper: skills are 0..10 with one decimal. → the new value. */
export function gainSkill(player, id, amount) {
  const cur = player.skills[id] || 0;
  player.skills[id] = Math.min(10, Math.round((cur + amount) * 100) / 100);
  return player.skills[id];
}
export const SKILL_NAMES = { phache: 'Pha chế', banhang: 'Bán hàng', nuong: 'Nướng', suamay: 'Sửa máy', cattoc: 'Cắt tóc', laixe: 'Lái xe', dayhoc: 'Dạy học', cando: 'Cân đo', chamsoc: 'Chăm sóc' };
