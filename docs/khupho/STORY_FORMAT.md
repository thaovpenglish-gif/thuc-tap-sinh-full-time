# Khu phố T&M · story and drama data format

Owner request 20 (2026-11-08): "nhớ cho tất cả mấy cái drama vào nha, và có cốt truyện, ko để cho người chơi đi lang
thang quá nhiều để bị chán". So the neighbourhood has:

1. **A main story** (`site/js/khupho/data/story.js`): chapters of beats. The current beat is always on the HUD
   ("📌 Việc chính: …") with an arrow to the place. The player is never without a next step.
2. **Dramas** (`site/js/khupho/data/dramas_a.js` for dramas 1-14, `dramas_b.js` for 15-28): the 28 scripts of
   `docs/khupho/DESIGN.md` section 8.3, each in 2-4 acts at a place and time. A new one starts every few days (at most 2
   at once). The current act shows on the HUD ("🔥 Có biến: …") with an arrow. Missed acts go to Xóm Ơi.

Both files are plain data (ES modules, no functions, no imports). `node scripts/check-kp-story.mjs` validates them.

## Writing rules (from DESIGN.md 1.2 and 8.1, all apply)

- Vietnamese, warm, funny, "đời"; teasing habits, prices, paperwork; **never** mocking vulnerable people.
- **No em dash** (—) anywhere. No real people, no real brands, no hateful content.
- Children (Tôm, Mít, Cua, Bắp, Đậu, Su, … anyone under 18) are **never** in romance. Children only eat, sleep, study,
  exercise, play games, sneak khô gà.
- "Đánh ghen" = shouting, borrowing the loudspeaker, livestream, spilled trà sữa. No real violence, no injuries.
- Consequences are light and fixable. Nobody loses a home or a job forever.
- Any line about a law or a rule ends with "(thông tin giải trí, không phải tư vấn pháp lý)".
- Keep lines short (one or two sentences, ≤ 220 characters). A scene is 3-9 lines then 2-4 choices (or no choices).
- `{ten}` is replaced by the player's name.

## Ids you may use

- **Places** (`where` / `place`): street doors only:
  `phongtro` (your dãy trọ: the scene plays when you enter your room), `hem`, `chungcu` (Lô C, HR on floor 4), `dienluc`,
  `congan`, `khupho` (Văn phòng Khu phố 7), `truong_th` (the school, primary + THCS), `tramyte`, `congvien`, `cho`,
  `daumoi`, `trasua`, `caphe`, `comtam`, `banhmi` (cart at hẻm 42), `tienloi`, `photo`, `net`, `cattoc`, `quannhau`,
  `xeom`, `bagac` (Chú Bảy's ba gác in front of Ba & Má), `toanha` (Cao ốc: T&M, Tech, Cân Đối), `bama`, `event`,
  `agency`, `noithat`.
- **Speakers**: a person id from `site/js/khupho/data/people.js` (e.g. `kp:lanh`, `kp:nhung`, `bama:bay`, `tm:tuyet`),
  or `nar` (narration), or `me` (the player, thinking or speaking).
- **Roles** for role-only choices (`role`): `trasua` (the player has worked a shift at Trà Sữa Full Topping), a company
  id `tm` `tech` `audit` `bama` `agency` `event` `hr` (the player is interning there), `any` (default).

## Scene

```js
{
  lines: [['kp:lanh', 'Con là {ten} hả? Phòng 5 nha, cửa hơi kẹt, đẩy mạnh là vô.'], ['nar', '...'], ['me', '...']],
  choices: [ // optional, 2-4; at least 2 must have no `role` (anyone can pick them)
    { t: 'Dạ, con cảm ơn cô', fx: { mood: 3, hearts: { 'kp:lanh': 1 } }, say: [['kp:lanh', 'Ngoan.']] },
    { t: 'Đẩy cửa bằng vai', fx: { energy: -3 }, say: [['nar', 'Cửa mở. Vai bạn thì chưa.']] },
    { t: '(Trà sữa) Mời cô một ly', role: 'trasua', fx: { money: -25000, hearts: { 'kp:lanh': 2 } }, say: [['kp:lanh', 'Ít đường nha con.']] },
  ],
}
```

`fx` keys (all optional): `money` (đ, −50.000..+200.000), `mood`, `energy`, `food` (−20..+20), `hearts`
(`{ personId: −2..+3 }`), `flag` (a string; later beats/dramas may require it with `needFlag`), `xomoi` (a line posted
to the Xóm Ơi group, like `'Bà Phấn: Ai thấy hai đứa nhỏ ở quán net không?'`).

## Main story: `export const STORY = [chapter, ...]`

```js
{
  id: 'c1', title: 'Chương 1 · Phòng số 5', intro: 'One or two sentences shown when the chapter starts.',
  beats: [
    { id: 'c1_chao', task: 'Chào cô Ba Lành', hint: 'Cô ở dãy trọ Bình An, đường Chợ.', where: 'phongtro', scene: { ... } },
    { id: 'c1_tamtru', task: 'Đăng ký tạm trú', hint: '...', where: 'congan', need: { type: 'tamtru' } },
    { id: 'c1_viec', task: 'Kiếm một việc làm', hint: 'Trà sữa (9h) hoặc ứng tuyển 1 trong 7 công ty (8h-10h30).',
      where: 'trasua', need: { type: 'work', count: 1 }, scene: { ... } },
  ],
  done: 'One line when the chapter ends (shown as a card).',
}
```

- A beat with `need` is done when the need is met (counted **from the moment the beat starts**). If it also has a
  `scene`, the scene plays the first time the player opens that door, and does not block the need.
- A beat without `need` is done when its scene has been played.
- Optional on any beat: `from` / `to` ('HH:MM', the scene only plays in that window), `minDay` (game day ≥),
  `needFlag` (skip the beat unless the flag is set; use for branches).
- `need.type`: `tamtru` · `work` {count} (trà sữa shift or company day) · `shift` {count} (trà sữa) · `office`
  {count} (company workday) · `eat` {count} · `furniture` {count} · `cozy` {atLeast 0-30} · `sleep` {count} ·
  `money` {atLeast} · `visit` (open that place's door) · `xomoi` (open the Xóm Ơi group) · `profile` (open the hồ sơ) ·
  `ride` (a xe ôm ride) · `drama` {count} (dramas finished) · `day` {atLeast} (game day).
- Day 1 is Thứ Hai 02/11/2026; the player wakes at 6h. Trà sữa opens 9h; companies take people 8h-10h30.

## Dramas: `export const DRAMAS = [drama, ...]`

```js
{
  id: 'd03', no: 3, title: 'Đánh ghen bằng loa khu phố', who: ['kp:ly', 'kp:manh', 'kp:man', 'kp:cuong'],
  minDay: 4,                 // earliest game day it may start
  startOn: [1, 2, 3, 4],     // optional: weekdays it may start on (0 = Chủ nhật, 1 = Thứ Hai … 6 = Thứ Bảy)
  needFlag: 'd04_done',      // optional: only after another drama (each drama sets `<id>_done` when it ends)
  acts: [
    { gap: 0, place: 'cho', from: '07:00', to: '11:00', task: 'Chị Ly hỏi khéo cả chợ', scene: { lines: [...], choices: [...] },
      missed: 'Bà Phấn: Sáng nay chị Ly hỏi cả chợ chuyện biên lai tiệm tóc, ai biết gì không?' },
    { gap: 1, place: 'khupho', from: '17:00', to: '19:30', task: 'Loa khu phố bị mượn', scene: {...}, missed: '...' },
  ],
  end: 'Biên bản khu phố: Từ nay loa không dùng việc riêng.',
}
```

- Dramas start in order of `minDay` (then `no`), one every 3-5 game days. Spread `minDay` from 2 to ~45 so the first
  weeks already have the funniest ones.
- `gap`: days after the previous act (first act: after the drama starts, usually 0). `from`/`to` is the act's window
  on that day. If the player does not come, the act is missed: its `missed` line goes to Xóm Ơi and the next act
  still happens. Choices in later acts may differ if a flag was set earlier (`needFlag` on a choice).
- 2-4 acts per drama, following the acts, roles and consequences of DESIGN.md 8.3 closely but playable in a few
  minutes. Use the drama's people exactly (ids in people.js). Role-only choices (`role`) for the roles the script
  lists that exist in the game (trà sữa staff, company intern); other roles become normal choices for a neighbour.
