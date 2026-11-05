// Entry point: renderer + loop + mode routing.
// Modes: main menu → Solo (T&M Partners, first person); legacy story (?legacy=1).
import * as THREE from 'three';
import { $, sleep } from './core/util.js';
import { CameraRig } from './core/camera.js';
import { createInput } from './core/input.js';
import { FLAGS } from './flags.js';
import { SUPPORT_URL } from './config.js';

const canvas = $('#game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#fff1e3');
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
const rig = new CameraRig(camera);
const input = createInput();

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  rig.resize(w, h);
}
window.addEventListener('resize', resize);
resize();

let active = null; // { update(dt) }
const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (active) active.update(dt);
  renderer.render(scene, camera);
}

let solo = null; // the T&M Solo mode is built once, then reused (its menu lists the saved runs)
async function startSolo() {
  $('#mainMenu').hidden = true;
  if (solo) { active = solo; solo.showMenu(); return; }
  const { startSolo: start } = await import('./modes/solo.js');
  solo = start({ scene, camera, input, onExit: () => showMainMenu() });
  active = solo;
}

// Multiplayer "Overdeadline & Overburnout" (behind ?mp=1). Leaving it reloads the page: the room scene is torn down cleanly.
async function startMulti() {
  $('#mainMenu').hidden = true;
  const { startMulti: start } = await import('./modes/multi.js');
  active = start({
    scene, camera, rig, input,
    params: new URLSearchParams(location.search),
    onExit: () => { location.href = location.pathname + '?mp=1'; },
  });
  window.__mp = active.debug; // e2e hooks (tests/e2e/mp-local.cjs)
}

async function startLegacy() {
  // The original story (Ba Mẹ & Partners), kept intact at ?legacy=1.
  $('#mainMenu').hidden = true;
  const { startLegacy: start } = await import('./modes/legacy.js');
  active = start({ scene, camera, input });
}

// Letter from the developer: what the game is, how saving works, disclaimer. Shown once before Solo.
const LETTER_KEY = 'tts_letter_v1';
function showLetter(thenPlay) {
  $('#mainMenu').hidden = true;
  $('#devLetter').hidden = false;
  $('#devLetter').scrollTop = 0;
  $('#letterGiao').hidden = !(SUPPORT_URL || FLAGS.giao);
  $('#letterMp').hidden = !FLAGS.mp;
  $('#letterMpGo').hidden = !FLAGS.mp;
  $('#letterGo').textContent = thenPlay ? 'Đã hiểu, vào chơi →' : 'Vào chơi Solo →';
  const close = () => { $('#devLetter').hidden = true; try { localStorage.setItem(LETTER_KEY, '1'); } catch { /* private mode */ } };
  $('#letterGo').onclick = () => { close(); startSolo(); };
  $('#letterClose').onclick = () => { close(); showMainMenu(); };
  $('#letterMpGo').onclick = () => { close(); startMulti(); };
}
const letterSeen = () => { try { return !!localStorage.getItem(LETTER_KEY); } catch { return false; } };

function showMainMenu() {
  $('#mainMenu').hidden = false;
  $('#soloBtn').onclick = () => (letterSeen() ? startSolo() : showLetter(true));
  $('#letterBtn').onclick = () => showLetter(false);
  document.querySelectorAll('[data-soon]').forEach((b) => {
    b.onclick = () => { $('#menuNote').hidden = false; };
  });
  const mp = document.querySelector('[data-soon="mp"]');
  if (FLAGS.mp && mp) {
    mp.innerHTML = '<span class="mode-ico">🚨🏃‍♀️🏃</span><b>Overdeadline<br>&amp; Overburnout</b><span>SOS Advisory · co-op 1–4 người</span><em class="go">Bản thử →</em>';
    mp.onclick = () => startMulti();
    $('#letterBtn').textContent = '💌 Thư từ người làm game · cách lưu tiến trình · 🚨 Multiplayer mới';
  }
}

async function boot() {
  try { await Promise.race([document.fonts.load('900 40px "Be Vietnam Pro"'), sleep(2500)]); } catch { /* fonts optional */ }
  if (FLAGS.legacyStory) {
    await startLegacy();
  } else if (FLAGS.mp && new URLSearchParams(location.search).get('room')) {
    await startMulti(); // opened from an invite link
  } else {
    showMainMenu();
  }
  $('#loading').hidden = true;
  frame();
}
boot();

window.__engine = { renderer, scene, rig };
