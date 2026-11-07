# Khu phố T&M · Phase 1 build contract

Design source of truth: `docs/khupho/DESIGN.md` (sections 3, 4.1, 4.2, 5, 6, 10). Research: `docs/research/khupho/`.
Owner decisions (defaults accepted 07/11/2026): a game day passes when the player sleeps; shop shifts are a
top-down 2D mini-game (DOM), the street is first-person 3D; Solo internships are imported into the profile;
kids grow up yearly (not in phase 1); satire targets procedures, never public servants.

Everything lives in `site/js/khupho/` (plus tests in `tests/kp-*.test.mjs`). Do not edit Solo or multiplayer files except
the two shared hooks named below. No em dash "—" in Vietnamese UI text. No real brand names. Every law line in UI
carries "(thông tin giải trí, không phải tư vấn pháp lý)" somewhere visible (a footnote is fine).

## Ownership (parallel work, disjoint files)

| Owner | Files |
|---|---|
| A · core sim + save | `khupho/sim/{rng,calendar,economy,player,profile,xomoi,world}.js`, `khupho/data/{places,food,people}.js`, `khupho/ui/{night,profile,xomoi}.js`, additive change to `site/js/game/save.js` (keep `kp`), `tests/kp-{core,economy,profile,save}.test.mjs` |
| B · trà sữa | `khupho/sim/teashop.js`, `khupho/data/{teamenu,suppliers,channels}.js`, `khupho/ui/{shift,shop}.js` (+ their CSS injected from JS), `tests/kp-teashop.test.mjs`, `tests/e2e/kp-shift.cjs` |
| C · lead | `modes/khupho.js` (3D street, interiors, HUD, wiring), `khupho/map/*.js`, `site/index.html` + `main.js` menu card, `tests/e2e/kp-*.cjs` (except kp-shift) |

`npm test` runs `node --test tests/*.test.mjs`, so unit tests are `tests/kp-*.test.mjs`.

## Pure modules (no DOM, no Three.js; deterministic given the seed)

All money in VND integers. Game time = `{ day, min }`: `day` 1 = Thứ Hai 02/11/2026; `min` = minutes since 00:00.

```js
// rng.js
export function rng(seed)            // → () => float in [0,1), mulberry32; never Math.random in sims
export function pick(r, arr); export function int(r, a, b)
// calendar.js
export function dateOf(day)          // → { y, m, d, weekday: 0..6 (0 = CN), label: 'Thứ Hai 02/11/2026' }
export function isPayday(day)        // day-of-month 30 (or last day of a shorter month): 7 companies pay
export function isRentDay(day)       // day-of-month 5
export const EVENTS                  // [{ date:'2027-02-06', id:'tet', name:'Tết Nguyên đán' }, ...] only research-confirmed dates
// economy.js
export function createEconomy(seed)  // → econ (JSON-safe)
export function economyDay(econ, day)// mutates; → events[] e.g. {type:'weather', v:'rain'|'heavy'|'sun'|'hot'}, {type:'outage_notice', day, from, to}, {type:'price', item, pct}
export function priceOf(econ, item)  // current price of an ingredient or food item (base from data × index)
export function demand(econ, day, min, group) // multiplier ≥ 0 for a customer group: 'hocsinh','vanphong','cudan','app','khachvanglai'
export function outageAt(econ, day, min)      // true during a scheduled power cut
// player.js
export function createPlayer(name)   // { name, money: 3_000_000, needs:{ food:80, energy:90, mood:70 }, home:{place:'phongtro', room:5}, tamTru:false, bhyt:false, rentDebt:0, certs:[], skills:{}, reputation:50 }
export function spend(player, minutes, activity) // needs decay by activity ('walk','work','rest','sleep'); clamps 0..100
export function eat(player, foodId, price)       // from data/food.js (design 3.3)
export const NEED_LOW = 25
// profile.js  (design section 5; personal profile stored at kp.profile)
export function emptyKpProfile()
export function logShift(profile, { placeId, placeName, kind, role, rank, day, hours, grade, pay })  // creates/extends the open entry
export function endEntry(profile, placeId, { day, reasonCode, reasonText })
export function importSolo(profile, soloRuns, companyName) // one entry per finished Solo run (idempotent by run id)
export function mergeKp(a, b)        // days/shifts/hours only go up; entries merged by entryId; newest state wins for non-history fields
// xomoi.js  (resident Zalo-like group "Xóm Ơi")
export function messagesFor(events, ctx, r) // → [{ min, from, text }] ; no messages 23:00–06:00 unless ctx.drama
// world.js  (orchestrator; this is what the 3D mode calls)
export function newGame({ name, seed })      // → kp state (JSON-safe), see "State"
export function advance(kp, minutes, activity) // moves the clock, needs, deliveries, opens/closes places; → events[]
export function sleep(kp)                    // ends the day: bills, economy tick, payroll, xomoi digest; → nightReport
export function isOpen(kp, placeId)          // using data/places.js hours
export function canWork(kp, placeId)         // → { ok, reason }
export function workShift(kp, placeId, result) // apply a finished shift (from teashop.endShift) to pay, profile, needs, clock
```

```js
// teashop.js  (B)
export function createTeaShop(seed)          // shop state: stock (grams/units), pearl batches [{cookedMin, grams}], cash, ratings, channels, orders
export function openShift(shop, kp, opts)    // → shift (orders queue etc.); uses economy demand + channels
export function makeOrder(shift, r)          // → { id, item, size:'M'|'L', sugar:0|30|50|70|100, ice:0|50|100, toppings:[], patience, source:'quay'|'app', client }
export function scoreCup(order, cup)         // cup = { size, toppings, tea, milk, sugar, ice, shaken, sealed, labeled } → { points 0..100, grade 'A'..'D', faults[] }
export function useStock(shop, cup)          // deducts exact recipe amounts (design T4)
export function pearlState(batch, nowMin)    // 'fresh' | 'ok' | 'hard' (> 8h)
export function placeOrder(shop, supplierId, items, kp) // → delivery {etaDay, etaMin} per data/suppliers.js rules (T6)
export function runChannel(shop, channelId, kp)        // marketing effect + cost
export function closeShift(shop, shift, kp)  // → result { hours, cups, grades, revenue, tips, waste, pay, grade }
export function dayPnL(shop, day)            // → rows per design 4.2.i (T8)
export function taxFor(shop, yearRevenue)    // 2026 rules (T9)
export const RANKS                           // design 4.2.k
```

## State (`kp`, saved inside the career profile as `profile.kp`)

```js
{ v: 1, seed, created, time: { day, min }, player, economy, profile, xomoi: { msgs: [], unread: 0 },
  job: { placeId, rank, since } | null, shops: { trasua: TeaShop }, ledger: [{ day, min, k, v }], flags: {} }
```

`game/save.js`: `validateProfile` and `mergeProfiles` must keep `kp` (merge with `mergeKp` rules: never lose days
worked; otherwise the newer `kp` by `kp.saved` timestamp wins). Existing Solo tests must keep passing.

## UI contracts (DOM, mobile-first, 44px touch targets, no buttons covered by other elements)

```js
// shift.js (B)  — top-down shift mini-game, 4–6 real minutes
export function playShift({ root, shop, kp, onEnd })   // renders into root (a full-screen overlay the lead provides); calls onEnd(result)
//   debug: when window.__kpDebug === null before start, sets window.__kpDebug = { answer(order) → cup } so e2e can play perfectly
// shop.js (B)   — manager panels: stock + suppliers, marketing channels, P&L, ranks
export function openShopPanel({ root, shop, kp, tab, onClose })
// night.js / profile.js / xomoi.js (A)
export function showNight({ root, report, onNext }); export function showProfile({ root, kp, onClose }); export function showXomoi({ root, kp, onClose })
```

The lead's mode supplies one overlay root (`#kpOverlay`), pauses the 3D controls while it is open, and calls these.
