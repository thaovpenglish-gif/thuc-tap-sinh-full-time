// Dialogue engine: typewriter lines, numbered choices and a small scene language.
// Scene node formats (content lives in story files, never here):
//   ['speakerId', 'text']                         a line ('me' = player, 'think' = inner voice, 'nar' = narrator)
//   { c:'vote_id', o:[{ t, fx, then:[...], when:(s)=>bool }] }   a choice
//   { if:(s)=>bool, then:[...], else:[...] }      branch
//   { fx:{...} }                                  effects (applied by the host mode)
//   { chat:[[from, text, dm?], ...] }             phone messages
import { $, esc } from '../core/util.js';
import { sfx } from '../core/audio.js';

/**
 * hooks: {
 *   charInfo(id) -> {name, role, emoji, color}
 *   fmt(text) -> text            (placeholder substitution)
 *   getState() -> state passed to `when` / `if` predicates
 *   applyFx(fx), pushChat(list), onChoice(voteId, optionIndex)
 *   onSpeaker(id)                (camera framing / call tile highlight)
 *   extra(node, run) -> Promise  (optional: custom node types for a mode)
 * }
 */
export function createDialogue(hooks) {
  let advanceFn = null;
  let choiceFn = null;
  let typing = null;

  function show(spk, text) {
    const info = hooks.charInfo(spk);
    const d = $('#dialog');
    d.hidden = false;
    d.className = spk === 'nar' ? 'nar' : spk === 'think' ? 'think' : spk === 'me' ? 'me' : '';
    $('#dlgPortrait').textContent = info.emoji;
    $('#dlgPortrait').style.background = info.color;
    $('#dlgName').textContent = info.name;
    $('#dlgRole').textContent = info.role;
    $('#choices').innerHTML = '';
    hooks.onSpeaker && hooks.onSpeaker(spk);
    return type(text);
  }

  function type(text) {
    const el = $('#dlgText');
    el.textContent = '';
    $('#dlgHint').hidden = false;
    return new Promise((resolve) => {
      let i = 0;
      const chars = Array.from(text);
      const finish = () => { clearInterval(typing); typing = null; el.textContent = text; };
      typing = setInterval(() => {
        i += 2;
        el.textContent = chars.slice(0, i).join('');
        if (i % 4 === 0) sfx.blip();
        if (i >= chars.length) finish();
      }, 22);
      advanceFn = () => {
        if (typing) { finish(); return; }
        advanceFn = null;
        resolve();
      };
    });
  }

  const say = (spk, text) => show(spk, hooks.fmt(text));

  function choose(opts) {
    return new Promise((resolve) => {
      $('#dlgHint').hidden = true;
      const box = $('#choices');
      box.innerHTML = '';
      advanceFn = null;
      const pick = (k) => {
        if (!opts[k]) return;
        choiceFn = null;
        sfx.choose();
        box.innerHTML = '';
        resolve(opts[k]);
      };
      opts.forEach((o, k) => {
        const b = document.createElement('button');
        b.innerHTML = `<span class="num">${k + 1}</span><span>${esc(hooks.fmt(o.t))}</span>`;
        b.onclick = (e) => { e.stopPropagation(); pick(k); };
        box.appendChild(b);
      });
      choiceFn = pick;
    });
  }

  async function run(nodes) {
    for (const n of nodes) {
      if (Array.isArray(n)) {
        await say(n[0], n[1]);
      } else if (n.c) {
        const st = hooks.getState();
        const opts = n.o.map((o, i) => ({ ...o, i })).filter((o) => !o.when || o.when(st));
        if (!opts.length) continue;
        const p = await choose(opts);
        hooks.onChoice && hooks.onChoice(n.c, p.i);
        hooks.applyFx(p.fx);
        if (p.then) await run(p.then);
      } else if (n.if) {
        if (n.if(hooks.getState())) { if (n.then) await run(n.then); } else if (n.else) await run(n.else);
      } else if (n.fx) {
        hooks.applyFx(n.fx);
      } else if (n.chat) {
        hooks.pushChat(n.chat);
      } else if (hooks.extra) {
        // mode-specific nodes (mini-games, salary cards, task spawns…); may run sub-scenes via `run`
        await hooks.extra(n, run);
      }
    }
  }

  function hide() { $('#dialog').hidden = true; }

  // click/tap anywhere on the dialog advances
  $('#dialog').addEventListener('click', () => { if (advanceFn) advanceFn(); });

  return {
    say, choose, run, hide,
    advance() { if (advanceFn) { advanceFn(); return true; } return false; },
    pickChoice(k) { if (choiceFn) { choiceFn(k); return true; } return false; },
    get canAdvance() { return !!advanceFn; },
    get isTyping() { return !!typing; },
  };
}
