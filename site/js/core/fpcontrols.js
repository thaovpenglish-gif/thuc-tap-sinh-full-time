// First-person controls for Solo: pointer-lock mouse look, touch-drag look, WASD/joystick walking,
// collision, dialogue framing and the interaction target in front of the player.
import * as THREE from 'three';
import { $, clamp, angleLerp } from './util.js';
import { isTouch } from './input.js';
import { moveActor } from './physics.js';

/**
 * opts: { camera, input, getMode() -> string, onPause(), start: [x, z, yaw], eye }
 */
export function createFPControls({ camera, input, getMode, onPause, start = [0, 0, 0], eye = 1.38 }) {
  const canvas = $('#game');
  const player = { pos: new THREE.Vector3(start[0], eye, start[1]), yaw: start[2], pitch: 0, eye, bob: 0 };
  let focusTarget = null;
  let lookTouch = null;
  camera.rotation.order = 'YXZ';

  // A touch-capable laptop or an embedded browser still has a mouse: remember what the player last pressed with,
  // so a mouse click can capture the pointer even when isTouch is true, and mouse-drag looks around without a lock.
  let lastPointer = isTouch ? 'touch' : 'mouse';
  let wasLocked = false;
  let drag = null;
  function lock() {
    if (getMode() !== 'play' || (isTouch && lastPointer !== 'mouse')) return;
    try { const pr = canvas.requestPointerLock(); if (pr && pr.catch) pr.catch(() => {}); } catch { /* needs a user gesture */ }
  }
  function unlock() { if (document.pointerLockElement) document.exitPointerLock(); }

  document.addEventListener('pointerlockchange', () => {
    const lost = wasLocked && !document.pointerLockElement;
    wasLocked = document.pointerLockElement === canvas;
    if (lost && getMode() === 'play') onPause();
    // a lock that lands after we already left play mode (e.g. a phone opened from the pause card) hides the cursor: drop it
    else if (document.pointerLockElement && getMode() !== 'play') document.exitPointerLock();
  });
  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== canvas || getMode() !== 'play') return;
    player.yaw -= e.movementX * 0.0022;
    player.pitch = clamp(player.pitch - e.movementY * 0.0022, -1.25, 1.25);
  });
  // mouse drag (hold the left button and drag) turns the view when the pointer is not captured
  window.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType || 'mouse'; }, true);
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button === 0 && document.pointerLockElement !== canvas) drag = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerType !== 'mouse') return;
    if (document.pointerLockElement === canvas || getMode() !== 'play' || !(e.buttons & 1)) { drag = null; return; }
    player.yaw -= (e.clientX - drag.x) * 0.006;
    player.pitch = clamp(player.pitch - (e.clientY - drag.y) * 0.005, -1.25, 1.25);
    drag.x = e.clientX; drag.y = e.clientY;
  });
  window.addEventListener('pointerup', () => { drag = null; });
  if (isTouch) {
    canvas.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      if (!lookTouch) lookTouch = { id: t.identifier, x: t.clientX, y: t.clientY };
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) if (lookTouch && t.identifier === lookTouch.id && getMode() === 'play') {
        player.yaw -= (t.clientX - lookTouch.x) * 0.0055;
        player.pitch = clamp(player.pitch - (t.clientY - lookTouch.y) * 0.0045, -1.2, 1.2);
        lookTouch.x = t.clientX; lookTouch.y = t.clientY;
      }
    }, { passive: true });
    const end = (e) => { for (const t of e.changedTouches) if (lookTouch && t.identifier === lookTouch.id) lookTouch = null; };
    window.addEventListener('touchend', end); window.addEventListener('touchcancel', end);
  }
  // hint for desktop players when the mouse is not captured
  setInterval(() => { const h = $('#clickHint'); if (h) h.hidden = !(getMode() === 'play' && lastPointer === 'mouse' && document.pointerLockElement !== canvas); }, 250);

  return {
    player,
    lock, unlock,
    focus(pos) { focusTarget = pos ? pos.clone().setY(1.12) : null; },
    teleport(x, z, yaw = player.yaw, eyeH = eye) { player.pos.set(x, eyeH, z); player.yaw = yaw; player.pitch = 0; player.eye = eyeH; },

    /** Nearest interactable roughly in front of the player. candidates: [{kind,id,pos,label}] */
    pick(candidates, maxDist = 2.6) {
      const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw);
      let best = null, bestScore = Infinity;
      for (const c of candidates) {
        const dx = c.pos.x - player.pos.x, dz = c.pos.z - player.pos.z;
        const d = Math.hypot(dx, dz);
        if (d > maxDist) continue;
        const dot = d > 0.001 ? (dx * fx + dz * fz) / d : 1;
        if (dot < 0.45 && d > 1.1) continue;
        const score = d * (1.6 - dot);
        if (score < bestScore) { bestScore = score; best = c; }
      }
      return best;
    },

    /** Screen-arrow rotation (deg) for a world target, relative to the view direction. */
    arrowTo(tp) {
      const dx = tp.x - player.pos.x, dz = tp.z - player.pos.z;
      let rel = Math.atan2(-dx, -dz) - player.yaw;
      rel = Math.atan2(Math.sin(rel), Math.cos(rel));
      return { deg: -90 - rel * 180 / Math.PI, dist: Math.hypot(dx, dz) };
    },

    update(dt, { colliders, others = [], bounds, canMove, idleSpin = false, speed = 1 }) {
      const ax = canMove ? input.axis() : { x: 0, y: 0 };
      const len = Math.hypot(ax.x, ax.y);
      if (len > 0.05) {
        const sp = (input.running() ? 5.2 : 3.2) * speed;
        const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw);
        const rx = Math.cos(player.yaw), rz = -Math.sin(player.yaw);
        moveActor(player.pos, (fx * ax.y + rx * ax.x) * sp * dt, (fz * ax.y + rz * ax.x) * sp * dt, { colliders, others, bounds });
        player.bob += dt * 9;
      }
      if (idleSpin) player.yaw += dt * 0.09;
      if (focusTarget) {
        const dx = focusTarget.x - player.pos.x, dz = focusTarget.z - player.pos.z;
        const k = 1 - Math.pow(0.002, dt);
        player.yaw = angleLerp(player.yaw, Math.atan2(-dx, -dz), k);
        player.pitch += (Math.atan2(focusTarget.y - player.eye, Math.hypot(dx, dz)) * 0.8 - player.pitch) * k;
      }
      const wantFov = window.innerWidth < window.innerHeight ? 85 : 72;
      if (camera.fov !== wantFov || camera.near !== 0.05) { camera.fov = wantFov; camera.near = 0.05; camera.updateProjectionMatrix(); }
      const bobY = len > 0.05 ? Math.sin(player.bob) * 0.035 : 0;
      camera.position.set(player.pos.x, player.eye + bobY, player.pos.z);
      camera.rotation.set(player.pitch, player.yaw, 0);
    },
  };
}
