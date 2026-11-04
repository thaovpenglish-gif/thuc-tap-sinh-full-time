# Thực Tập Sinh Full-Time — Game Design (Solo)

Live: https://thaovpenglish-gif.github.io/thuc-tap-sinh-full-time/ · Repo: `thaovpenglish-gif/thuc-tap-sinh-full-time`
Static site in `site/` (Three.js via CDN import map, vanilla ES modules, no build). Deployed by GitHub Actions on push
to `main` (`.github/workflows/deploy.yml`; `scripts/stamp-version.mjs` stamps `?v=<sha>` on every import).
This file is the reference for continuing the project in a new chat. Diary of changes: `docs/DEVLOG.md`.

## 1. What the game is

A satirical Vietnamese office game. The player is an **intern** ("thực tập sinh") seen in **first person** in a pastel
3D office. Tone: funny, "đời", a little mean when it fits; Vietnamese–English corporate jargon. No game over: when a
job ends you apply somewhere else.

Modes: **Solo** (this document) · **Multiplayer** (button shows "Sắp ra mắt"; planned with an elevated third-person
camera, Supabase host-authoritative) · **Legacy story** "Ba Mẹ & Partners" kept intact at `?legacy=1`.

## 2. Solo flow (every screen has a way back)

```
Main menu ──Solo──► Hồ sơ sự nghiệp (career runs + cloud save) ──"Ứng tuyển công ty mới"──► Company picker (7 cards)
   ▲  ◄──"← Menu chính"──┘        ▲  ◄──"← Hồ sơ sự nghiệp"──────────────────────────────┘     │ apply (name + company)
   │                              │                                                              ▼
   │                              ├─◄ "📋 Hồ sơ sự nghiệp" on every day card / pause card      Day 0: Interview + salary deal
   │                              │                                                              ▼
   └──◄ "🏠 Về menu chính" (pause)│                            Day intro card (mood, title) → 3D day or "⏩ Tua nhanh" (routine days)
                                  │                                                              ▼
                                  │                Day-end card → [life event] → [payslip day 30 / last day] → [weekend on Friday]
                                  │                                                              ▼
                                  └──────────────── … up to day 45 → Ending card → "Ứng tuyển công ty khác" → Company picker
```

- **Career profile** (`game/save.js`, localStorage key `tm_profile_v1`, profile `v: 2`): up to 16 runs side by side.
  "Nhảy công ty" = apply elsewhere → a new run; old runs stay resumable ("Chơi tiếp") or viewable ("Xem kết thúc").
  Pending end-of-day cards are saved, so quitting mid-sequence resumes at the same card.
- **Cloud save** (`net/cloud.js`, `ui/cloudpanel.js`, `supabase/cloud_saves.sql`): in the career menu,
  (a) email + *game* password (no email is ever sent; first login creates the account; auto-push 5 s after each save;
  pull + merge on opening the menu), (b) 8-character save code valid 30 days (snapshot; claim on any device; runs are
  merged keeping the newer copy).

## 3. A run (one company, max 45 calendar days)

- **Day 0 – interview** (company-specific): includes the **salary deal** — 4 cards: 0 đồng (Easy) · 1 triệu (Normal) ·
  3 triệu (Hard) · 5 triệu (Consulting Hell). Tier sets side tasks per day, deadline multiplier, mini-game review bar
  (`qa` .34/.5/.67/.84) and money (`game/difficulty.js`).
- **Calendar** (`game/career.js`): day 1 = Monday; weekends auto-skip with a weekend card; Friday = weekly review.
  45 calendar days ≈ 33 workdays.
- **Workday types**: *episode* (scripted drama day, played in 3D) scheduled from each episode's `day` / `minDay–maxDay`
  after the interview (`scheduleEpisodes`); otherwise a *routine day* = 2 (3 at 3/5 triệu) short beats drawn from the
  company's pool without repeats; routine days can be **fast-forwarded** (dialogue only; side tasks resolved by one choice).
- **Morning mood** (10 moods): changes hunger speed, mini-game time and starting energy.
- **Side tasks** (`game/tasks.js`): spawn during 09:15–16:30, at most 3 open; deadline = base × tier multiplier × 2 in
  game minutes; the game clock runs 1 game-minute per real second while walking; story scenes pause deadlines
  (clock jumps shift tasks). Done: +2 Uy tín, +1 relation; late: −3 Uy tín, −1 relation.
- **Energy = hunger**: drains ~0.07/game-minute × mood; each story step −3. Below 35 = *Đói* (walk 28% slower,
  mini-games 25% shorter, HUD warns); at 8 you faint (−30 min, −3 Uy tín). Eat at the pantry (`coffee` object):
  free snack once a day (+12), coffee (+15, a third one backfires), office lunch 35.000đ (+35, 20 min),
  eat out 65.000đ (+55, 45 min, the boss may notice). Overnight +45; weekend → 100.
- **Money**: start 2.000.000đ pocket money; −30.000đ commute every workday; food; fines and life events.
  Pay accrues per workday (salary / 22). **Payslip** at the end of day 30 and at the end of the run:
  interns ≥ 5.000.000đ/payment without the commitment form → 10% withheld (flag `tax_commit` from the interview);
  official employees → 10,5% insurance, PIT 0 under the 15,5 tr personal deduction (2026). Disclaimer shown.
- **After-work life events** (55% of evenings, never the same twice in a row): CSGT fines (amounts from
  NĐ 168/2024), spoiled food, rent increase, mom calls, cancelled rides, floods, side gigs… some with choices.
- **Weekly review** (Friday 16:30, the company's `manager`): grade A/B/C/D from tasks done/late, mini-games, Uy tín
  change, relation with the manager, Drama. Two D in a row → warning (PIP).
- **Promotion**: each company has exactly one demanding, story-driven `promotion.when(run)` checked after reviews.
  Accept → official, salary 10 or 15 triệu, then the **post-promotion arc** (3–5 episodes, every ~2 workdays) that
  ends in **quit** or **layoff** → ending → pick another company.
- **Endings**: `finish` (45 days without promotion: certificate/recommendation by relations), `quit`, `layoff`.
- **Hidden ties** (T&M): 2 of 6 family/secret relationships drawn per run → `flags.tie_<id>`; episodes branch on them.

## 4. Companies (`site/js/companies/<id>/`, registry `site/js/companies/index.js`)

| id | Name | Industry · scale | Manager | Official salary |
|---|---|---|---|---|
| tm | T&M Partners | Strategy consulting · ~20 | Chị Tuyết | 15 tr |
| bama | Ba & Má | Family dried-food producer (khô gà/heo/bò, trái cây sấy) · ~20 + workshop; reuses the legacy cast | (see module) | 10 tr |
| tech | Nợ Kỹ Thuật Labs | Tech startup · ~80 | (see module) | 15 tr |
| agency | Trend Trễ Agency | Marketing agency · ~30 | (see module) | 10 tr |
| audit | Cân Đối & Cộng Sự | Accounting & audit · ~300 | (see module) | 15 tr |
| event | Đi Đâu Cũng Được | Events & travel · ~15 | (see module) | 10 tr |
| hr | Người Đúng Chỗ HR | HR consulting & headhunting · ~10 | (see module) | 10 tr |

Each module follows **`docs/COMPANY_CONTRACT.md`** (cast, idle lines, office theme, interview, 10–20 episodes,
≥ 24 routine beats, side tasks, review lines, promotion + arc, endings, food, life events). A company with
`ready: false` shows "Sắp mở tuyển". Research behind the content: `docs/research/*.md` (industry culture, workflows,
30 drama cases each, daily events, laws & daily life numbers with sources).

## 5. Code map

```
site/js/main.js              renderer, loop, main menu → Solo (modes/solo.js) or legacy (?legacy=1)
site/js/modes/solo.js        Solo engine: menus, day composition, story flow, reviews, payroll cards, hunger, tasks, HUD
site/js/game/career.js       calendar, scheduling, moods, life events, hunger constants, payroll, weekly grade (pure)
site/js/game/save.js         career profile v2 (+ v1 migration), runs, labels, validate/merge (pure)
site/js/game/tasks.js        side tasks: plan/tick/visit/shift/resolve (pure)
site/js/game/difficulty.js   salary tiers, 10% withholding rule (pure)
site/js/companies/           registry + one folder per company (content only)
site/js/maps/office.js       themed office builder (signs, nameplates, palette, props); maps/slots.js = spots (pure)
site/js/story/dialogue.js    scene language runner (lines, choices, if, fx, chat, extra nodes)
site/js/ui/                  minigame (pick/quiz/order), cloudpanel, phone (Teams + confessions), toast, overlay
site/js/net/                 cloud.js (save RPCs), legacy-net.js (votes, confessions, presence)
tests/                       unit tests (npm test), validate-companies.mjs, e2e/solo-career.cjs, e2e/legacy-playthrough.cjs
```

## 6. Testing

```bash
npm test                                   # unit tests (save, tasks, difficulty, career, sim)
node tests/validate-companies.mjs          # content contract for every ready company
cd site && python3 -m http.server 8765     # then, in another shell:
node tests/e2e/solo-career.cjs tm t5 first 45 routine tasks   # full run; perfect mini-game play must pass
node tests/e2e/legacy-playthrough.cjs first
```

`?debug=1` exposes `window.__tm.skipTo(day)` and `window.__tm.fx({...})`; setting `window.__miniDebug = null` before
a mini-game makes it publish its answer key (used by the e2e to check that a perfect play always passes).

## 7. Open decisions / ideas

- Real email verification (OTP) needs custom SMTP in Supabase; current cloud save uses email + game password.
- Family-tie proposals for T&M are random per run (Game Owner OK'd "random"); revisit if canon is fixed.
- Company-specific 3D props are light (themes + a few prop types); bespoke maps per company could come later.
- Multiplayer (Office Chaos) is deferred.
