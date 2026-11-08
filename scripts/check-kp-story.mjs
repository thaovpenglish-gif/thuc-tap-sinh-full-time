// Validates the Khu phố story and drama data (docs/khupho/STORY_FORMAT.md). Usage: node scripts/check-kp-story.mjs
// Exit 1 with a list of problems, or prints a short summary. Also imported by tests/kp-story.test.mjs.
import { PEOPLE } from '../site/js/khupho/data/people.js';

export const DOOR_PLACES = ['phongtro', 'hem', 'chungcu', 'dienluc', 'congan', 'khupho', 'truong_th', 'tramyte', 'congvien', 'cho', 'daumoi',
  'trasua', 'caphe', 'comtam', 'banhmi', 'tienloi', 'photo', 'net', 'cattoc', 'quannhau', 'xeom', 'bagac', 'toanha', 'bama', 'event', 'agency', 'noithat'];
export const ROLES = ['any', 'trasua', 'tm', 'tech', 'audit', 'bama', 'agency', 'event', 'hr'];
export const NEED_TYPES = ['tamtru', 'work', 'shift', 'office', 'eat', 'furniture', 'cozy', 'sleep', 'money', 'visit', 'xomoi', 'profile', 'ride', 'drama', 'day'];
const FX_KEYS = ['money', 'mood', 'energy', 'food', 'hearts', 'flag', 'xomoi'];
const PEOPLE_IDS = new Set(PEOPLE.map((p) => p.id));
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const BRANDS = /\b(Shopee|Lazada|Grab|Gojek|Be\b|Highlands|Starbucks|Phúc Long|Gong Cha|Koi Th|Facebook|Zalo|TikTok|YouTube|Instagram|Circle K|Bách Hóa Xanh|Vinmart|WinMart|Co\.op|GS25|Ministop|7-Eleven|Coca|Pepsi|Samsung|iPhone|Apple|Honda|Yamaha)\b/i;

function checkText(where, s, out) {
  if (typeof s !== 'string' || !s.trim()) { out.push(`${where}: empty text`); return; }
  if (s.includes('—')) out.push(`${where}: em dash`);
  if (s.length > 260) out.push(`${where}: line too long (${s.length})`);
  const b = s.match(BRANDS); if (b) out.push(`${where}: real brand "${b[0]}"`);
}
function checkLines(where, lines, out) {
  if (!Array.isArray(lines)) { out.push(`${where}: lines must be an array`); return; }
  lines.forEach((l, i) => {
    if (!Array.isArray(l) || l.length !== 2) { out.push(`${where}[${i}]: a line is [speaker, text]`); return; }
    const [sp, t] = l;
    if (sp !== 'nar' && sp !== 'me' && !PEOPLE_IDS.has(sp)) out.push(`${where}[${i}]: unknown speaker "${sp}"`);
    checkText(`${where}[${i}]`, t, out);
  });
}
function checkFx(where, fx, out) {
  if (fx == null) return;
  if (typeof fx !== 'object') { out.push(`${where}: fx must be an object`); return; }
  for (const k of Object.keys(fx)) if (!FX_KEYS.includes(k)) out.push(`${where}: unknown fx "${k}"`);
  if (fx.money != null && (typeof fx.money !== 'number' || fx.money < -500000 || fx.money > 500000)) out.push(`${where}: money out of range`);
  for (const k of ['mood', 'energy', 'food']) if (fx[k] != null && (typeof fx[k] !== 'number' || Math.abs(fx[k]) > 30)) out.push(`${where}: ${k} out of range`);
  if (fx.hearts) for (const [id, v] of Object.entries(fx.hearts)) { if (!PEOPLE_IDS.has(id)) out.push(`${where}: hearts for unknown "${id}"`); if (typeof v !== 'number' || v < -3 || v > 3) out.push(`${where}: hearts value`); }
  if (fx.flag != null && (typeof fx.flag !== 'string' || !/^[a-z0-9_]+$/.test(fx.flag))) out.push(`${where}: flag must be snake_case`);
  if (fx.xomoi != null) checkText(`${where}.xomoi`, fx.xomoi, out);
}
function checkScene(where, sc, out) {
  if (!sc || typeof sc !== 'object') { out.push(`${where}: scene missing`); return; }
  checkLines(`${where}.lines`, sc.lines, out);
  if ((sc.lines || []).length < 1 || (sc.lines || []).length > 14) out.push(`${where}: 1-14 lines`);
  if (sc.choices != null) {
    if (!Array.isArray(sc.choices) || sc.choices.length < 2 || sc.choices.length > 4) out.push(`${where}: 2-4 choices`);
    else {
      if (sc.choices.filter((c) => !c.role || c.role === 'any').length < 2) out.push(`${where}: at least 2 choices without a role`);
      sc.choices.forEach((c, i) => {
        checkText(`${where}.choices[${i}].t`, c.t, out);
        if (c.role && !ROLES.includes(c.role)) out.push(`${where}.choices[${i}]: unknown role "${c.role}"`);
        if (c.needFlag != null && typeof c.needFlag !== 'string') out.push(`${where}.choices[${i}]: needFlag`);
        checkFx(`${where}.choices[${i}].fx`, c.fx, out);
        if (c.say) checkLines(`${where}.choices[${i}].say`, c.say, out);
      });
    }
  }
}

export function checkStory(STORY) {
  const out = [], ids = new Set();
  if (!Array.isArray(STORY) || !STORY.length) return ['STORY must be a non-empty array'];
  for (const ch of STORY) {
    const w = `chapter ${ch.id}`;
    if (!ch.id || ids.has(ch.id)) out.push(`${w}: id missing or duplicate`); ids.add(ch.id);
    checkText(`${w}.title`, ch.title, out); checkText(`${w}.intro`, ch.intro, out);
    if (ch.done != null) checkText(`${w}.done`, ch.done, out);
    if (!Array.isArray(ch.beats) || !ch.beats.length) { out.push(`${w}: no beats`); continue; }
    for (const b of ch.beats) {
      const wb = `beat ${b.id}`;
      if (!b.id || ids.has(b.id)) out.push(`${wb}: id missing or duplicate`); ids.add(b.id);
      checkText(`${wb}.task`, b.task, out);
      if (b.task && b.task.length > 70) out.push(`${wb}: task too long for the HUD (${b.task.length})`);
      if (b.hint != null) checkText(`${wb}.hint`, b.hint, out);
      if (!DOOR_PLACES.includes(b.where)) out.push(`${wb}: where "${b.where}" is not a street door`);
      for (const k of ['from', 'to']) if (b[k] != null && !TIME.test(b[k])) out.push(`${wb}: ${k} must be HH:MM`);
      if (!b.need && !b.scene) out.push(`${wb}: needs a scene or a need`);
      if (b.need) { if (!NEED_TYPES.includes(b.need.type)) out.push(`${wb}: unknown need "${b.need.type}"`); }
      if (b.scene) checkScene(`${wb}.scene`, b.scene, out);
    }
  }
  return out;
}

export function checkDramas(DRAMAS, label = 'dramas') {
  const out = [], ids = new Set();
  if (!Array.isArray(DRAMAS)) return [`${label}: DRAMAS must be an array`];
  for (const d of DRAMAS) {
    const w = `drama ${d.id}`;
    if (!d.id || !/^d\d\d$/.test(d.id) || ids.has(d.id)) out.push(`${w}: id must be dNN and unique`); ids.add(d.id);
    if (typeof d.no !== 'number') out.push(`${w}: no`);
    checkText(`${w}.title`, d.title, out);
    if (!Array.isArray(d.who) || !d.who.length) out.push(`${w}: who`); else d.who.forEach((id) => { if (!PEOPLE_IDS.has(id)) out.push(`${w}: unknown person "${id}"`); });
    if (typeof d.minDay !== 'number' || d.minDay < 1) out.push(`${w}: minDay`);
    if (d.startOn != null && (!Array.isArray(d.startOn) || !d.startOn.length || d.startOn.some((x) => !Number.isInteger(x) || x < 0 || x > 6))) out.push(`${w}: startOn must be weekdays 0-6`);
    if (!Array.isArray(d.acts) || d.acts.length < 2 || d.acts.length > 4) { out.push(`${w}: 2-4 acts`); continue; }
    d.acts.forEach((a, i) => {
      const wa = `${w}.acts[${i}]`;
      if (typeof a.gap !== 'number' || a.gap < 0 || a.gap > 4) out.push(`${wa}: gap 0-4`);
      if (!DOOR_PLACES.includes(a.place)) out.push(`${wa}: place "${a.place}" is not a street door`);
      if (!TIME.test(a.from || '') || !TIME.test(a.to || '') || a.from >= a.to) out.push(`${wa}: from/to HH:MM with from < to`);
      checkText(`${wa}.task`, a.task, out); if (a.task && a.task.length > 70) out.push(`${wa}: task too long`);
      checkText(`${wa}.missed`, a.missed, out);
      checkScene(`${wa}.scene`, a.scene, out);
    });
    checkText(`${w}.end`, d.end, out);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problems = [];
  let story = [], dramas = [];
  try { ({ STORY: story } = await import('../site/js/khupho/data/story.js')); problems.push(...checkStory(story)); } catch (e) { problems.push('story.js: ' + e.message); }
  for (const f of ['dramas_a', 'dramas_b']) {
    try { const { DRAMAS } = await import(`../site/js/khupho/data/${f}.js`); problems.push(...checkDramas(DRAMAS, f)); dramas = dramas.concat(DRAMAS); } catch (e) { problems.push(`${f}.js: ${e.message}`); }
  }
  const dupNo = dramas.map((d) => d.id).filter((id, i, a) => a.indexOf(id) !== i);
  if (dupNo.length) problems.push('duplicate drama ids across files: ' + dupNo.join(', '));
  const beats = story.reduce((n, c) => n + (c.beats || []).length, 0), acts = dramas.reduce((n, d) => n + (d.acts || []).length, 0);
  console.log(`story: ${story.length} chapters, ${beats} beats · dramas: ${dramas.length}, ${acts} acts`);
  if (problems.length) { console.log('PROBLEMS (' + problems.length + '):\n  ' + problems.slice(0, 80).join('\n  ')); process.exit(1); }
  console.log('OK');
}
