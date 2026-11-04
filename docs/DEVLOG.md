# DEVLOG — Thực Tập Sinh Full-Time

Diary of what was built, decided and fixed, newest first. Design reference: `docs/GAME_DESIGN.md`.
Content format: `docs/COMPANY_CONTRACT.md`.

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
