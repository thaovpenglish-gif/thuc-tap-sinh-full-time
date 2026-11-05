# DEVLOG — Thực Tập Sinh Full-Time

Diary of what was built, decided and fixed, newest first. Design reference: `docs/GAME_DESIGN.md`.
Content format: `docs/COMPANY_CONTRACT.md`.

## 2026-11-05 — Multiplayer prototype: Overdeadline & Overburnout

**Asked by the Game Owner:** a multiplayer mode where the players are a consultancy that fixes crises for the 7 Solo
companies, played like a co-op order-rush game; name **SOS Advisory**, **co-op only**, feel of the co-op cooking games
played inside Messenger (tap a link, short rounds, phones). Built in parallel with Solo, behind `?mp=1`.

- Design: `docs/MULTIPLAYER_DESIGN.md` (7 levels = 7 client companies, one signature mechanic each).
- Prototype level **T&M**: 3 recipes (slide, report, signed deck), laptop work, printer that ruins prints left too long,
  boss sign-off with "vài ý nhỏ", stand-up bell that traps players near the Scrum board, per-player burnout
  (coffee, collapse, dropped items), 3-minute round, 1–3 stars, Tuyết's verdict.
- Rooms: 5-character code + invite link (`?mp=1&room=CODE`), Supabase Realtime presence/broadcast, host-authoritative
  rules (`game/mp/engine.js`), positions sent by each client. `?net=local` uses BroadcastChannel for 2-tab tests;
  "Tập một mình" needs no network.
- New files only (plus additive hooks in `main.js`, `flags.js`); Solo code untouched. 10 unit tests + 2-player e2e.
- Game Owner feedback "chưa giống văn phòng nhiều phòng, chưa thấy khách": the T&M level is now a multi-room office
  (work area, print room, glass chairperson's office, corridor with the Scrum board, pantry, meeting room, client
  lobby with reception) and every order is a T&M person who walks into the lobby, waits with a bubble + patience bar,
  and leaves happy or angry. Orders carry `client` and `spot`; engine emits `served` / `gone`.
- Deployed to `main` (behind `?mp=1`) and tested over real Supabase on the live site.
- More tasks (asked by the Game Owner): tea (pantry), Excel reconciliation, meeting minutes (new huddle table in the
  meeting room), signed contract (contract shelf → printer → boss). Station rules moved from the engine into a
  per-level `process` table (`DEFAULT_PROCESS` as fallback) so each company can define its own stations.
- Pacing by team size (Game Owner: alone should be slower than 4 players): per-level `pace` rows for 1–4 players
  (gap between clients, patience multiplier, clients waiting at once, opening orders); an empty lobby refills in 5 s.
- Game Owner: show it on the main menu. The `mp` flag is now on by default (beta card); `?mp=0` hides it.

## 2026-11-05 — QC round 1 and publish

**Story QC** (one picky-player agent per company read every scene; ~250 fixes in total): times that contradicted each
other, people talking in person while "on the phone" or "out of the office", mini-game fail lines that named a mistake the
player may not have made, ambiguous quiz answers (e.g. tech "Hourensou", HR CV screening), a discriminatory pick that could
pass the HR job-description game (now needs a perfect score), endings that did not match the player's last choice,
intern-only wording in episodes that can run after promotion, missing legal disclaimers, severance claims under 12 months.

**Engine additions driven by QC**
- Episode `when` / `internOnly`; `end` may be a function (the player's last choice decides quit vs layoff).
- Side-task `when`; errands are not planned for people who are away that day.
- Cast `present(run)` (people who quit leave the office); `pos: 'away'`; Teams callers are hidden from their desks.
- Routine beats `once: true`; optional company `reviewer(run)`; a step can host the Friday review (`review: true`).
- Promotion arc: first episode on the first official workday, prefers days without an intern episode, compresses when
  late and always keeps the final episode. Ranged episodes are spread uniformly over their range.
- `when` is never re-evaluated in the middle of a scene (a mid-scene flag change used to skip the next scene).
- Mini-game bars: t0 .33 · t1 .5 · t3 .66 · t5 .8 (2/3 passes at 3 triệu; 5/6 at 5 triệu). Order games are scored
  by the longest correctly ordered run. Pick games score right picks only.
- Random seeds are scrambled (nearby seeds gave the same first number: a run had a life event every evening or never,
  and the same mood every day).

**Automated checks**: validator OK for all 7 companies; 32 unit tests; full 45-day e2e runs for every company
(perfect-play, worst-play and random strategies, fast-forward and 3D) with no JS errors, no covered buttons, and every
perfect mini-game play passing.

**Also**: letter from the developer before Solo (what the game is, how saving works, disclaimer); Chị Giáo (developer
NPC for donations, hidden until `SUPPORT_URL` is set; preview `?giao=1`).

## 2026-11-04 (night) — Solo v2: 7 companies, 45-day careers

**Asked by the Game Owner (Thảo):** keep T&M and bring back the old family company as a second company
(Ba & Má, dried foods), add tech / marketing agency / accounting-audit / events-travel / HR consulting companies;
Solo = pick a company and apply; max 45 days per company unless you jump; weekly performance review; one scripted way
to become official (10–15 triệu) followed by pressure and quitting/layoff; daily mood; after-work events (CSGT,
spoiled food…); energy should mean something (hunger, food from the pantry or outside); salary saved across months;
save by email; research agents for culture/workflow/drama; QC passes as a picky, logical player; side tasks expired
too fast; display bugs (prompt over the pause card); a mini-game always scoring 33%.

**Built**
- Engine (`modes/solo.js` rewrite): company picker, interview per company, day composition (episode vs routine),
  fast-forward routine days, Friday review, promotion + arc, payslips, weekends, life events, endings, pending-card
  queue saved on the run, hunger (slower walk, shorter mini-games, faint), pantry food menu, money HUD + mood HUD.
- Pure systems: `game/career.js` (+ `tests/career.test.mjs`), save v2 with v1 migration, task shifting/limits.
- Themed office (`maps/office.js`), pure slots (`maps/slots.js`), 7 prop types, generic slot aliases.
- Content contract + validator (`tests/validate-companies.mjs`: format, references, times, choice ids, mini-game
  solvability, flags read-but-never-set).
- Research: `docs/research/*.md` (6 industries + laws & daily life, with sources).
- Writers: one agent per company wrote `site/js/companies/<id>/` following the contract.
- Cloud save: Supabase migration `solo_cloud_saves` (tables locked, SECURITY DEFINER RPCs), `net/cloud.js`,
  `ui/cloudpanel.js`. Email + game password (no email sent) and 8-character save codes (30 days).
- E2E `tests/e2e/solo-career.cjs`: full run to the ending; audits that every visible button in the open modal is
  really clickable; perfect mini-game play (answer key in debug mode) must pass; MOBILE=1 for phone size.

**Fixed**
- Side tasks: deadlines ×2, clock 1.0 game-min/s (was 1.5), deadlines pause when the story jumps the clock,
  max 3 open tasks.
- Mini-game "pick": a wrong pick no longer subtracts (2 right + 1 wrong was 33%, now 67%); the pass bar shown on
  the card is the same one the game uses (scene bar raised by the salary tier); answers are revealed afterwards.
- Interaction prompt / task list / crosshair hidden whenever a modal (pause, phone, cards) is open.
- Toasts move to the bottom while a card is open (they covered card titles).
- Tall cards were clipped at the top (`align-items: safe center`).
- Phone opened from a day-end card was hidden under the card (z-index).

**Decisions**
- Email save without verification (Supabase's built-in SMTP only mails project members); real OTP later needs SMTP.
- T&M hidden family ties: 2 of 6 drawn at random per run (Owner: "random cũng được").
- Ba & Má reuses the legacy cast (Bác Hùng, Cô Hằng, Kevin Tuấn, Anh Dũng, Chị Mai, Anh Khoa, Cô Tư, Chú Bảy, Ngân…);
  the legacy story itself stays untouched at `?legacy=1`.

## 2026-11-04 (evening) — T&M Solo: interview + Day 1
- New Solo for T&M Partners (Character Bible v3.0 + Đạt), salary deal, Day 1, consistency-agent fixes, published.
- Another session fixed pause/HUD clickability and added "Về menu chính" for the legacy mode.

## Earlier
- Phase 0: legacy "Ba Mẹ & Partners" story, first-person office, Supabase votes/confessions/presence, GitHub Pages.
