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
  reviewer: (run) => 'dung' | null, // optional: who reviews this Friday instead (e.g. after the manager leaves)
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
  desk: { games: [...], chatter: [...], promoOffer: [...] },     // §12 desk work (own file desk.js)
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

- Optional `present: (run) => bool` on a cast member: false = they are no longer in the office (e.g. after quitting).
  Do not use them as a step `who` / side-task leg after that (gate those with `when`).
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
  pos: { tam: 'x1', duy: 'away' },    // where people stand all day (optional); 'away' = out of the office
                                      // (people on a Teams call step are hidden automatically while it plays)
  chatStart: [['tam', 'tin nhắn', true]],  // optional: messages at 08:30
  sideTasks: true,                    // default true
  steps: [ { who, obj, time, pos, seat, call, scene, when, review } ... ],  // review: true on a Friday step = the weekly
                                      // review happens right after this step's scene (instead of the automatic 16:30 one)
                                      // `when` is checked before a step starts (never in the middle of its scene)
  diary: (run) => 'Nhật ký cuối ngày, 1–3 câu, có thể đổi theo flags.' }
```

- 4–7 steps per episode, times `HH:MM` increasing between 08:30 and 18:00. `who` = cast id with a body (the player
  walks to them and presses E), `obj:<id>`, or `call:<castId>` (a Teams call rings; needs
  `call: { title, people: ['castId', 'me', ...] }`).
- `obj` is the objective text shown in the HUD ("Qua kho kiểm hàng với chú Bảy").
- Episodes need a clear arc: setup → complication → a choice that matters → consequence that may come back later
  (set flags, read them with `when`/`if` in later episodes and in `promotion.when`).
- Intern episodes can still play after a promotion. If an episode only makes sense for an intern, add
  `internOnly: true` (it becomes a routine day for official employees).
- Day 1 must be the onboarding episode (`day: 1`). Spread the rest over days 2–40. 10–20 intern episodes.

## 7. Routine beats (ordinary days)

Same shape as one step, plus an `id`. The engine picks 2 (3 at high salary tiers) per ordinary day and does not
repeat until the pool runs out. `time` optional (defaults 10:00 / 14:00 / 15:30). `official: true` = only for
official employees. `when(run)` to gate. `once: true` = never repeats in a run (birthdays, one-off events). Keep them short (3–8 lines + one choice), funny, varied:
small requests, gossip, a process absurdity, a customer call, a mini-game (use sparingly), a kindness.

## 8. Side tasks

```js
{ id: 'label', title: 'Dán lại 200 tem nhãn hạn sử dụng', from: 'hang', base: 60,
  legs: [ { npc: 'hang', line: ['hang', '…'] }, { obj: 'printer', line: ['nar', '…'] }, { npc: 'hang', line: ['hang', '…'] } ] }
```

`base` = minutes before the deadline (30–120; the engine scales it by salary tier). 2–3 legs. ≥ 8 templates.
Optional `when: (run) => bool` — e.g. hide a colleague's errands after they quit.

## 9. Scene language

```js
['castId' | 'me' | 'think' | 'nar' | 'kpi', 'text']                 // a line
{ c: 'unique_vote_id', o: [ { t: 'option', fx: {...}, then: [...], when: (run) => bool } ] }  // 2–4 options
{ c: '_private_id', o: [...] }      // id starting with _ = not shown in the global "x% chose this" poll
{ if: (run) => bool, then: [...], else: [...] }
{ fx: { uy: +3, dr: +2, nl: -5, money: -50_000, clock: 30, rel: { hang: 2 }, set: { flag: true } } }
{ chat: [['castId', 'text', true /* DM */]] }
{ mini: { type: 'pick'|'quiz'|'order'|'sort', ... }, good: [...], bad: [...] }   // see site/js/ui/minigame.js + T&M examples
{ salary: true }                     // interview only: the 4 salary cards
```

Stats: `uy` Uy tín (reputation), `dr` Drama, `nl` Năng lượng (energy/hunger, 0–100). `money` in VND.
`run` fields you may read: `tier ('t0'|'t1'|'t3'|'t5')`, `status ('intern'|'official')`, `day`, `st.{uy,dr,nl}`,
`money`, `rel[castId]`, `flags[...]`, `reviews[] {grade}`, `ties[]`. Choice ids must be unique within the company.

Mini-game examples: `pick` `{ type:'pick', title, icon, prompt, pick: 3, time: 35, pass: .66, items: [{text, sub?, correct?}] }`
· `quiz` `{ type:'quiz', title, prompt, time, pass, questions: [{ q, options:[…], correct: index }] }`
· `order` `{ type:'order', title, prompt, time, pass, items: [{ text, order: 0..n-1 }] }`
· `sort` `{ type:'sort', title, prompt, time, pass, bins: ['⚡ Làm ngay', '🗑️ Bỏ qua'], items: [{ text, sub?, bin: index }] }`
(one card at a time, tap its bin; 2–4 bins).

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
- Desk work (§12): `desk.js` exported as `desk` from `index.js`; the validator prints `deskGames` / `deskChatter`.

## 12. Desk work ("Ngồi vào bàn") — `desk.js`

Between story beats the player can sit at their own desk (`desk` object) and do one short mini-game of real work
for this company (the 5 games rotate, never the same twice in a row): ~30 game minutes, −6 energy, side tasks keep ticking. A good session = +1 Uy tín, a small
performance bonus on the payslip, points in the Friday review. 3 sessions a day. Enough good sessions open a second
road to promotion (engine: `game/desk.js` `workPromoReady`). **Drama cannot be dodged**: a group-chat burst
(`chatter`) lands in the middle of the work (45%; 15% with headphones on, but then the missed ping costs Uy tín
and a relation point), and the player reacts with one choice.

```js
export const DESK = {
  games: [   // exactly 5: 2 HANDS-ON (type 'action', ui/action.js) + 3 WORK SIMS (type 'doc' / 'chat', ui/sims.js)
    // hands-on: physical work of the trade, skill + timing
    { id: '…', type: 'action', game: 'shred', title, icon, prompt, hint, time: 45, pass: 0.6, pieces: 2, strips: 5, item: 'Ức gà luộc' },
    { id: '…', type: 'action', game: 'hold', skin: 'seal' | 'balloon', rounds: 5, label, color },   // hold → release in the green zone
    { id: '…', type: 'action', game: 'whack', count: 16, slotText, bg, slot,                     // tap targets, never the avoid ones
      target: { emoji, labels: [...], hit, miss, color }, avoid: { emoji, labels: [...], hit } },
    { id: '…', type: 'action', game: 'conveyor', mode: 'stamp', count: 12, stampText, hit, wrongHit, miss, rule,
      target: { emoji, labels }, avoid: { labels } },   // stamp only the valid sheets (same icon: the label must be read)
    { id: '…', type: 'action', game: 'conveyor', mode: 'beat', count: 14, target: { emoji } },  // rhythm: tap on the line
    { id: '…', type: 'action', game: 'align', blocks: [3–5 labels], twist: true, twistLine },   // drag into outlines
    // work sims: the trade's real documents and conversations — need REAL professional knowledge to win
    { id: '…', type: 'doc', title, icon, prompt, time: 80, pass: 0.6, docs: [          // 2–3 documents, one per play
      { kind: 'cv' | 'invoice' | 'contract' | 'code' | 'post' | 'paper', head: 'Document title', meta: 'the brief / JD / rule to check against',
        lines: [ { h: 'SECTION' }, 'a normal line', { t: 'a problem line', bad: 'WHY it is a problem (the lesson)' }, … ],  // 6–18 lines, 2–4 problems
        verdict: { q: 'Bước tiếp theo?', options: ['…', '…', '…'], correct: 0, why: 'one-line explanation' } },
    ] },
    { id: '…', type: 'chat', title, icon, prompt, time: 85, pass: 0.6, convos: [       // 2–3 conversations, one per play
      { who: { name, emoji, role, app: 'Zalo' | 'Teams' | 'LinkedIn' | … }, start: ['their first message'],
        turns: [ { them?: 'their next message', options: [ { t: 'reply', s: 2 | 1 | 0, react: 'their reaction' }, … ] }, … ],  // 3–5 turns, 3 options
        end: { good: 'how it ends well', bad: 'how it ends badly' } },
    ] },
  ],
  chatter: [ // ≥ 6 group-chat dramas, funny, in character, 3–5 messages each
    { id: 'co_ch_x', chat: [['castId', 'tin nhắn'], ['castId', 'tin nhắn', true /* DM */]],
      scene: [['think', 'one line'], { c: 'co_desk_x', o: [ 2–3 options with fx ] }],
      when: (run) => bool },  // optional; chatter whose speakers have left (present() false) is skipped automatically
  ],
  tasks: [ { id, title, from, base, legs: [ { npc }, { obj | npc, play: '<desk game id>', line }, { npc } ] } ],
                        // optional: errands that lead into the hands-on games (merged into sideTasks)
  promoOffer: [ ... ],  // optional: the manager's offer when the player is promoted for hard work; must set
                        // accept_official true/false (like promotion.offer). Without it a generic offer is used.
};
```

- Work sims are where the trade knowledge lives (reference: `site/js/companies/hr/desk.js`): a document full of
  realistic, specific details (names, numbers, dates) where 2–4 lines are real professional red flags, plus traps that
  LOOK suspicious but are fine (flagging them costs points); chats where the best reply is what a good professional
  would actually write. **The best reply must not be the longest**: keep it concise, make wrong replies long and
  plausible-sounding (the validator warns). Each `bad` reason / verdict `why` teaches one real rule of the trade.
- Hands-on games should feel like the industry's physical work (khô gà: xé gà, hàn túi; sự kiện: bơm bóng, soát vé…).
  New mechanics go in `ui/action.js` (+ a bot in `tests/e2e/action-games.cjs`). Labels ≤ 32 characters.
- Games must be fair: one clearly right answer a working person would agree on; jokes go in the wrong options.
  Doc lines ≤ 140 characters, chat replies ≤ 140, messages ≤ 200. No `{ten}` inside mini-games.
- Bots: `node tests/e2e/work-sims.cjs <id>` and `node tests/e2e/action-games.cjs <id>` (server on :8765) must print ok.
- Shared office games (engine, not per company): side-task legs `{ obj: 'printer' }` and `{ obj: 'coffee' }` play a
  mini-game (game/office.js), and the desk adds a shredder and a network-cable game. Write printer / pantry legs freely;
  the pantry leg's text picks the drink (trà / trà sữa / cà phê).
- Chatter choices: small fx (±1–3), one option usually helps a relation, one feeds Drama, one is "tắt thông báo".
  Choice ids unique within the company (they are polled: "x% người chơi chọn giống bạn").
