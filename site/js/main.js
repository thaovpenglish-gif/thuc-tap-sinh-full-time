// Entry point: renderer + loop + mode routing.
// Modes: main menu (T&M Partners, new game — under construction), legacy story (?legacy=1).
import * as THREE from 'three';
import { $, sleep } from './core/util.js';
import { CameraRig } from './core/camera.js';
import { createInput } from './core/input.js';
import { FLAGS } from './flags.js';

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

function showMainMenu() {
  $('#mainMenu').hidden = false;
  document.querySelectorAll('[data-soon]').forEach((b) => {
    b.onclick = () => { $('#menuNote').hidden = false; };
  });
}

async function boot() {
  try { await Promise.race([document.fonts.load('900 40px "Be Vietnam Pro"'), sleep(2500)]); } catch { /* fonts optional */ }
  if (FLAGS.legacyStory) {
    const { startLegacy } = await import('./modes/legacy.js');
    active = startLegacy({ scene, rig, input });
  } else {
    showMainMenu();
  }
  $('#loading').hidden = true;
  frame();
}
boot();

window.__engine = { renderer, scene, rig };
