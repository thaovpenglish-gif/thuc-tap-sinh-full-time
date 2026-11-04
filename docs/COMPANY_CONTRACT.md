# Company content contract (Solo)

Every company in Solo is one folder: `site/js/companies/<id>/` with an `index.js` whose **default export** is a plain
object described below. The engine (`site/js/modes/solo.js`) reads only this object. Content is pure data + small
predicate functions; **no DOM, no imports from Three.js, no network**.

Check your work with:

```bash
node tests/validate-companies.mjs <id>     # must print OK (warnings are hints)
node --check site/js/companies/<id>/*.js
```

The T&M module (`site/js/companies/tm/`) and its story files (`site/js/story/tm/prologue.js`, `day1.js`) are the
reference examples — read them first.

## 1. Tone (most important)

- Satirical Vietnamese office comedy: funny, "đời", a little mean when it fits the character. Never cruel to the
  player, never punching down at real groups. Mixed Vietnamese–English corporate jargon is welcome where it fits.
- Each character has ONE strong comic trait + one human moment. Keep their way of speaking consistent
  (xưng hô: sếp nữ lớn tuổi → "chị/em"; đồng nghiệp ngang tuổi intern → "mình/bạn" hoặc "tao/mày" nếu rất thân).
- Lines ≤ 200 characters. Short beats. A scene = 4–12 lines + 1 choice. Every choice has a consequence (fx) and no
  option is a dead end. Avoid "trick" choices with no good answer, except rare satirical ones.
- All names, companies and brands are fictional. No real people, no real brands, no slurs, nothing sexual.
- Legal/tax/insurance lines: simplified, add "(thông tin giải trí, không phải tư vấn pháp lý)" when you state a rule.
- Player is an intern ("bạn" in narration, "em"/"mình" in dialogue). `{ten}` is replaced by the player's name.

## 2. The object

```js
export default {
  id: 'bama',                       // folder name; matches site/js/companies/index.js
  manager: 'hang',                  // cast id doing the Friday review (must have a body)
  officialSalary: 10_000_000,       // monthly salary if promoted
  catName: 'Mèo Khô Gà',            // the office cat (optional; default 'Mèo KPI')
  cast: { ... },                    // §3
  idle: { castId: ['line', ...] },  // 3+ random lines per person when you talk outside the story
  theme: { ... },                   // §4 office look
  interview: { title, subtitle, intro, pos, steps, diary(run) },   // day 0, must include { salary: true }
  episodes: [ ... ],                // §6 10–20 intern drama days + 3–5 official-only episodes
  routine: [ ... ],                 // §7 ≥ 24 short beats for ordinary days
  sideTasks: [ ... ],               // §8 ≥ 8 errand templates
  review: { A: [...], B: [...], C: [...], D: [...] },              // §9 ≥ 4 lines each, said by the manager
  promotion: { salary, when(run), offer: [...], arc: ['ep_id', ...] }, // §10 the ONE way to become official
  endings: { finish(run) | {title,text}, quit: {title,text}, layoff: {title,text} },
  objLines: { printer: [...scene], okr: [...], ... },              // optional: what objects say in this office
  food: [ { t, fx, then } ],         // optional: extra pantry option (max 1), e.g. free company product
  lifeEvents: [ ... ],              // optional: company-flavoured after-work events (same shape as game/career.js LIFE_EVENTS)
  ties: [ { id, text } ],           // optional: hidden relationships; 2 are drawn per run → flags tie_<id> = true
};
```

## 3. Cast

```js
cast: {
  hang: { name: 'Cô Hằng', role: 'CFO kiêm COO · "Má"', emoji: '🧮', color: '#ffb3c7', spot: 'boss',
          look: { shirt: '#ffb3c7', pants: '#8a6a8f', hair: 'bun', hairColor: '#2a2a2a', glasses: true } },
  shipper: { name: 'Anh Shipper', role: '…', emoji: '🛵', color: '#ddd', body: false },  // Teams/phone only
}
```

- 8–16 people with a body. Each has a unique `spot` (a slot in the office, see §5). `body: false` = never in the
  office (calls, chat only), no spot.
- `look` keys: `shirt, pants, skin, hair ('short'|'long'|'bun'|'pony'|'curly'|'wavy'|'quiff'|'side'|'cap'|'beanie'|'bald'), hairColor,
  glasses, clip, pods, cat, tie ('#color'), notes, mug, phone, tote` (all optional; booleans).
- `role` text before the first `·` is shown on the name tag.

## 4. Theme (office look)

All fields optional; anything missing falls back to the T&M look.

```js
theme: {
  logo: ['BA & MÁ', 'Khô gà · Khô bò · Trái cây sấy', '"Ăn là ghiền. Làm là… ghiền."'],  // reception wall, 3 lines
  skyline: 'KHÔ GÀ BA & MÁ', bossWall: 'Gia đình', banner: 'CHỐT ĐƠN · CHỐT ĐƠN',
  signs: { boss: 'PHÒNG BA', finance: 'PHÒNG MÁ (KẾ TOÁN)', meeting: 'PHÒNG HỌP', standup: 'HỌP SÁNG 8:15', pantry: 'PANTRY · Ăn thử free' },
  desks: { // slot → [nameplate, [screen line 1, screen line 2], screen color]; slots: me c1 c2 c3 n1..n6 hr senior
    c1: ['Tâm · Livestream', ['Đơn hôm nay', '1.204 đơn'], '#ff7a6b'], me: ['Intern · Bạn', ['Excel', 'Tồn kho_FINAL'], '#e07a5f'] },
  whiteboard: ['KPI THÁNG 11', '10.000 đơn', '(đang có 3.200)'],   // the corner whiteboard (max 5 lines)
  scrum: { cols: ['CẦN LÀM', 'ĐANG LÀM', 'XONG'], notes: [['…', '…'], ['…'], ['…']] },   // max 4 notes per column
  board: ['TẾT 2027 🧧', 'Chỉ tiêu: x3', 'Sinh nhật Má'],          // south wall board
  palette: { wall: '#fff4e6', lilac: '#e3d9ff', peach: '#ffe0d6', mint: '#d6f5e8', butter: '#fff1b8' }, // floors/walls
  labels: { coffee: 'Pantry: ăn thử khô gà', okr: 'Đọc bảng KPI', altar: 'Thắp hương Thần Tài', safe: 'Nhìn két của Má' },
  props: [ { type: 'crates', slot: 'p1', label: 'KHÔ GÀ LÁ CHANH' }, { type: 'dryer', slot: 'p3', label: 'MÁY SẤY #2' } ],
}
```

Prop types: `crates, rack, ringlight, balloons, cabinet, dryer, standee` (standee label uses `|` for line breaks).
Prop slots: `p1 p2` (south-west corner), `p3 p4` (south-east), `p5` (finance room corner), `p6` (boss room corner).

## 5. Places

**Spots** (where people stand; use in `cast.spot` and `pos`):
`boss` (corner office NW) · `n1…n6` (window desks, north) · `c1 c2` (centre cluster front) · `c3` (desk facing the
intern) · `senior` (desk east of centre) · `corner` (whiteboard corner) · `corner2` (next to it) · `finance` (finance
room NE) · `reception` (front desk) · `it` (IT corner by the printer) · `hr` (desk by the entrance) · `coach` (by the
board in the middle) · `pantry` (east) · `x1 x2` (free spots east) · `x3` (near the entrance) · `window` ·
`meeting_head mr_n1 mr_n2` (meeting room) · `su1…su10` (circle around the board, for stand-ups) ·
`lunch1…lunch5` (pantry table) · `scrum` (in front of the board).

**Objects** (`who: 'obj:<id>'`, side-task legs `{ obj }`): `desk` (the intern's desk) · `printer` · `okr` (corner
whiteboard) · `coffee` (pantry; when not a story target it opens the food menu) · `redchair` · `plant` · `safe` ·
`interview` (meeting room chair; use with `seat: 'mr_seat'` to sit the player down) · `altar` (Thần Tài).

## 6. Episodes (drama days)

```js
{ id: 'livestream_fail', title: 'Livestream 3 tiếng', intro: 'Thứ Năm. …',      // intro shown on the day card
  day: 8 | minDay: 6, maxDay: 14,     // fixed day (1–45; weekends move to Monday) or a range; omit for "any"
  official: true,                     // only after promotion (then list it in promotion.arc)
  end: 'quit' | 'layoff' | (run) => 'quit'|'layoff'|null,  // the run ends after this day (last arc episode);
                                      // a function lets the player's choices decide (null = the run continues)
  when: (run) => bool,                // optional: checked the morning of its day; false → a routine day instead
  internOnly: true,                   // optional: skipped (routine day) if the player is already official
  noReview: true,                     // optional: skip the Friday review on this day
  pos: { tam: 'x1' },                 // where people stand all day (optional)
  chatStart: [['tam', 'tin nhắn', true]],  // optional: messages at 08:30
  sideTasks: true,                    // default true
  steps: [ { who, obj, time, pos, seat, call, scene, when } ... ],
  diary: (run) => 'Nhật ký cuối ngày, 1–3 câu, có thể đổi theo flags.' }
```

- 4–7 steps per episode, times `HH:MM` increasing between 08:30 and 18:00. `who` = cast id with a body (the player
  walks to them and presses E), `obj:<id>`, or `call:<castId>` (a Teams call rings; needs
  `call: { title, people: ['castId', 'me', ...] }`).
- `obj` is the objective text shown in the HUD ("Qua kho kiểm hàng với chú Bảy").
- Episodes need a clear arc: setup → complication → a choice that matters → consequence that may come back later
  (set flags, read them with `when`/`if` in later episodes and in `promotion.when`).
- Day 1 must be the onboarding episode (`day: 1`). Spread the rest over days 2–40. 10–20 intern episodes.

## 7. Routine beats (ordinary days)

Same shape as one step, plus an `id`. The engine picks 2 (3 at high salary tiers) per ordinary day and does not
repeat until the pool runs out. `time` optional (defaults 10:00 / 14:00 / 15:30). `official: true` = only for
official employees. `when(run)` to gate. Keep them short (3–8 lines + one choice), funny, varied:
small requests, gossip, a process absurdity, a customer call, a mini-game (use sparingly), a kindness.

## 8. Side tasks

```js
{ id: 'label', title: 'Dán lại 200 tem nhãn hạn sử dụng', from: 'hang', base: 60,
  legs: [ { npc: 'hang', line: ['hang', '…'] }, { obj: 'printer', line: ['nar', '…'] }, { npc: 'hang', line: ['hang', '…'] } ] }
```

`base` = minutes before the deadline (30–120; the engine scales it by salary tier). 2–3 legs. ≥ 8 templates.

## 9. Scene language

```js
['castId' | 'me' | 'think' | 'nar' | 'kpi', 'text']                 // a line
{ c: 'unique_vote_id', o: [ { t: 'option', fx: {...}, then: [...], when: (run) => bool } ] }  // 2–4 options
{ c: '_private_id', o: [...] }      // id starting with _ = not shown in the global "x% chose this" poll
{ if: (run) => bool, then: [...], else: [...] }
{ fx: { uy: +3, dr: +2, nl: -5, money: -50_000, clock: 30, rel: { hang: 2 }, set: { flag: true } } }
{ chat: [['castId', 'text', true /* DM */]] }
{ mini: { type: 'pick'|'quiz'|'order', ... }, good: [...], bad: [...] }   // see site/js/ui/minigame.js + T&M examples
{ salary: true }                     // interview only: the 4 salary cards
```

Stats: `uy` Uy tín (reputation), `dr` Drama, `nl` Năng lượng (energy/hunger, 0–100). `money` in VND.
`run` fields you may read: `tier ('t0'|'t1'|'t3'|'t5')`, `status ('intern'|'official')`, `day`, `st.{uy,dr,nl}`,
`money`, `rel[castId]`, `flags[...]`, `reviews[] {grade}`, `ties[]`. Choice ids must be unique within the company.

Mini-game examples: `pick` `{ type:'pick', title, icon, prompt, pick: 3, time: 35, pass: .66, items: [{text, sub?, correct?}] }`
· `quiz` `{ type:'quiz', title, prompt, time, pass, questions: [{ q, options:[…], correct: index }] }`
· `order` `{ type:'order', title, prompt, time, pass, items: [{ text, order: 0..n-1 }] }`.

## 10. Weekly review, promotion, endings

- `review.A…D`: what the manager says on Friday. Grade comes from the week (tasks on time, mini-games, Uy tín,
  relation with the manager, Drama).
- `promotion.when(run)`: the ONE path to become official, checked after each Friday review. Make it demanding and
  story-driven, e.g. `(r) => r.reviews.filter(x => x.grade === 'A').length >= 2 && r.flags.saved_livestream && r.day >= 15`.
  Must be false for a new run.
- `promotion.offer`: scene; must set `{ fx: { set: { accept_official: true } } }` on accept and `false` on decline.
- `promotion.arc`: 3–5 official-only episode ids, played every ~2 workdays after promotion: the honeymoon ends,
  pressure / toxic colleague / unfair boss grows, and the last one has `end: 'quit'` or `end: 'layoff'`
  (ideally with a choice that decides which — set it via two different final episodes gated by `when`, or one
  episode whose `end` fits both outcomes).
- `endings.finish(run)`: 45 days done without promotion (or declined). Vary the text by `rel[manager]`, `st.uy`, flags.

## 11. Checklist before you hand back

- `node tests/validate-companies.mjs <id>` → OK, and fix every warning you reasonably can.
- Read every scene once as the player: is it funny? logical? Does each step's `who` stand where the player can
  reach (a body + spot)? Does the time make sense? Does anyone mention something the player hasn't seen yet?
- Do not edit files outside `site/js/companies/<id>/` (except: set `ready: true` for your company in
  `site/js/companies/index.js` — only that one field).
