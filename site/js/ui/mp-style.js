// Styles for Overdeadline & Overburnout, injected by modes/multi.js (kept in JS so the deploy version stamp covers it).
export const MP_CSS = `
#mpRoot { position: fixed; inset: 0; pointer-events: none; z-index: 8; font-family: 'Be Vietnam Pro', system-ui, sans-serif; }
#mpRoot .mp-screen { pointer-events: auto; position: fixed; inset: 0; display: grid; place-items: center; padding: 18px; overflow: auto; background: rgba(255,248,239,.82); backdrop-filter: blur(3px); }
.mp-card { width: min(560px, 100%); background: #fff; border: 3px solid var(--ink); border-radius: 26px; box-shadow: var(--pop-lg); padding: 22px 20px; }
.mp-card h2 { margin: 2px 0 6px; font-size: 26px; font-weight: 900; line-height: 1.15; }
.mp-card .kicker { font-size: 11px; letter-spacing: .14em; font-weight: 900; color: var(--muted); }
.mp-logo { font-size: clamp(26px, 6vw, 38px); font-weight: 900; line-height: 1.02; color: #fff; -webkit-text-stroke: 2px var(--ink); paint-order: stroke fill; text-shadow: 3px 3px 0 var(--ink); margin: 6px 0 4px; }
.mp-logo span { color: var(--peach); display: block; }
.mp-card p { margin: 6px 0; line-height: 1.5; }
.mp-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 14px; }
.mp-row .btn { flex: 1 1 auto; }
.mp-input { font: 800 18px 'Be Vietnam Pro', sans-serif; padding: 11px 14px; border-radius: 14px; border: var(--line); box-shadow: var(--pop); outline: none; width: 100%; }
.mp-input:focus { background: var(--butter); }
.mp-code-in { text-transform: uppercase; letter-spacing: .3em; text-align: center; max-width: 180px; }
.mp-field { display: grid; gap: 6px; font-size: 13px; font-weight: 800; margin-top: 12px; }
.mp-or { text-align: center; font-size: 12px; font-weight: 800; color: var(--muted); margin: 14px 0 0; }
.mp-err { background: var(--peach); border: 2px solid var(--ink); border-radius: 12px; padding: 8px 12px; font-weight: 800; font-size: 14px; margin-top: 12px; }
.mp-code { font-size: 44px; font-weight: 900; letter-spacing: .18em; background: var(--butter); border: 3px solid var(--ink); border-radius: 18px; box-shadow: var(--pop); padding: 6px 14px; display: inline-block; margin: 6px 0; }
.mp-members { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.mp-member { border: 2px solid var(--ink); border-radius: 14px; padding: 9px 10px; font-weight: 800; display: flex; align-items: center; gap: 8px; min-height: 46px; }
.mp-member i { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--ink); flex: none; }
.mp-member.empty { border-style: dashed; color: var(--muted); font-weight: 700; }
.mp-member small { margin-left: auto; font-size: 11px; color: var(--muted); }
.mp-client { display: flex; gap: 12px; align-items: center; background: var(--lilac-2); border: 2px solid var(--ink); border-radius: 16px; padding: 10px 12px; margin-top: 12px; }
.mp-client b { display: block; }
.mp-client .ico { font-size: 34px; }
.mp-recipes { display: grid; gap: 6px; margin-top: 10px; font-size: 13.5px; }
.mp-recipes div { background: #fff8ef; border: 2px solid var(--ink); border-radius: 12px; padding: 6px 10px; }
.mp-recipes b { margin-right: 6px; }
.mp-help { font-size: 12.5px; color: var(--muted); margin-top: 10px; line-height: 1.6; }
.mp-link { background: none; border: none; text-decoration: underline; font-weight: 800; font-size: 14px; padding: 6px; }

/* HUD */
#mpHud { position: fixed; inset: 0; pointer-events: none; }
.mp-top { position: absolute; top: 10px; left: 10px; right: 10px; display: flex; gap: 10px; align-items: flex-start; }
.mp-clock { background: #fff; border: var(--line); border-radius: 16px; box-shadow: var(--pop); padding: 8px 12px; min-width: 112px; flex: none; }
.mp-clock .t { font-size: 24px; font-weight: 900; font-variant-numeric: tabular-nums; line-height: 1; }
.mp-clock .t.low { color: #e0405a; }
.mp-clock .m { font-size: 13px; font-weight: 800; margin-top: 4px; white-space: nowrap; }
.mp-clock .s { font-size: 11px; font-weight: 700; color: var(--muted); white-space: nowrap; }
.mp-orders { display: flex; gap: 8px; flex: 1; min-width: 0; overflow: hidden; }
.mp-ticket { background: #fff; border: var(--line); border-radius: 14px; box-shadow: var(--pop); padding: 7px 9px 8px; width: 150px; flex: none; animation: tin .25s ease; }
.mp-ticket b { display: block; font-size: 13px; font-weight: 900; line-height: 1.2; }
.mp-ticket .st { font-size: 11px; font-weight: 700; color: #3a3f55; margin: 3px 0 5px; line-height: 1.35; }
.mp-ticket .tb { height: 8px; border: 2px solid var(--ink); border-radius: 99px; overflow: hidden; background: #f2ede4; }
.mp-ticket .tb i { display: block; height: 100%; background: var(--mint); }
.mp-ticket.hot { background: #fff0ec; }
.mp-ticket.hot .tb i { background: #ff6f8a; }
.mp-side { position: absolute; top: 10px; right: 10px; display: grid; gap: 8px; justify-items: end; pointer-events: auto; }
.mp-team { background: #fff; border: var(--line); border-radius: 14px; box-shadow: var(--pop); padding: 7px 10px; display: grid; gap: 5px; min-width: 150px; pointer-events: none; }
.mp-team div { display: grid; grid-template-columns: 12px 1fr 52px; gap: 6px; align-items: center; font-size: 12px; font-weight: 800; }
.mp-team i.dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--ink); }
.mp-team .bb { height: 8px; border: 2px solid var(--ink); border-radius: 99px; overflow: hidden; background: #f2ede4; }
.mp-team .bb i { display: block; height: 100%; }
.mp-team span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mp-hint { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); background: #fff; border: var(--line); box-shadow: var(--pop); border-radius: 99px; padding: 8px 16px; font-weight: 800; font-size: 14px; white-space: nowrap; max-width: 92vw; overflow: hidden; text-overflow: ellipsis; }
.mp-hint.on { background: var(--butter); }
.mp-banner { position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%); background: #fff; border: 3px solid var(--ink); border-radius: 22px; box-shadow: var(--pop-lg); padding: 14px 22px; font-weight: 900; font-size: 22px; text-align: center; }
.mp-banner.big { font-size: 64px; padding: 10px 34px; }
.mp-banner small { display: block; font-size: 13px; font-weight: 700; color: var(--muted); margin-top: 4px; }
#mpAct { position: absolute; right: 22px; bottom: 34px; width: 92px; height: 92px; border-radius: 50%; border: 3px solid var(--ink); background: var(--butter); box-shadow: var(--pop); font-size: 15px; font-weight: 900; pointer-events: auto; touch-action: none; line-height: 1.1; }
#mpAct:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); }
.mp-stars { font-size: 46px; letter-spacing: 6px; margin: 6px 0; }
.mp-stars .off { filter: grayscale(1); opacity: .3; }
.mp-quote { background: var(--lilac-2); border: 2px solid var(--ink); border-radius: 14px; padding: 10px 12px; font-weight: 700; margin-top: 10px; }
.mp-res { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; text-align: center; }
.mp-res div { border: 2px solid var(--ink); border-radius: 12px; padding: 8px 4px; font-size: 12px; font-weight: 700; }
.mp-res b { display: block; font-size: 20px; font-weight: 900; }
body.mp-touch .mp-hint { bottom: auto; top: 118px; }
@media (max-width: 760px) {
  .mp-top { flex-wrap: wrap; right: 10px; }
  .mp-clock { min-width: 96px; padding: 6px 9px; }
  .mp-clock .t { font-size: 20px; }
  .mp-orders { order: 3; flex-basis: 100%; }
  .mp-ticket { width: 124px; padding: 5px 7px 6px; }
  .mp-ticket b { font-size: 12px; } .mp-ticket .st { font-size: 10px; }
  .mp-top { right: 66px; }
  .mp-spacer { display: none; }
  .mp-side { top: 10px; }
  .mp-team { position: fixed; left: 10px; bottom: 172px; }
  .mp-team { min-width: 128px; padding: 5px 8px; }
  .mp-team div { grid-template-columns: 10px 1fr 40px; font-size: 11px; }
  .mp-members { grid-template-columns: 1fr; }
  .mp-code { font-size: 36px; }
  body.mp-touch .mp-hint { top: auto; bottom: 150px; }
}
`;
