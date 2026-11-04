// Keyboard + on-screen joystick. Movement is screen-relative (elevated camera, north is "up").
import { $ } from './util.js';

export const isTouch = (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches) || (typeof window !== 'undefined' && 'ontouchstart' in window);

export function createInput() {
  const keys = {};
  const joy = { active: false, id: null, x: 0, y: 0, cx: 0, cy: 0 };
  const keyHandlers = new Set();

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      for (const h of keyHandlers) h(e, { inField: true });
      return;
    }
    keys[e.code] = true;
    for (const h of keyHandlers) h(e, { inField: false });
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });
  window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

  if (isTouch) {
    const joyEl = $('#joy');
    const knob = $('#joyKnob');
    const moveJoy = (t) => {
      let dx = t.clientX - joy.cx, dy = t.clientY - joy.cy;
      const L = Math.hypot(dx, dy), max = 52;
      if (L > max) { dx = dx / L * max; dy = dy / L * max; }
      joy.x = dx / max; joy.y = dy / max;
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    joyEl.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      const r = joyEl.getBoundingClientRect();
      joy.active = true; joy.id = t.identifier; joy.cx = r.left + r.width / 2; joy.cy = r.top + r.height / 2;
      moveJoy(t); e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', (e) => { for (const t of e.changedTouches) if (joy.active && t.identifier === joy.id) moveJoy(t); }, { passive: true });
    const end = (e) => { for (const t of e.changedTouches) if (joy.active && t.identifier === joy.id) { joy.active = false; joy.x = joy.y = 0; knob.style.transform = ''; } };
    window.addEventListener('touchend', end); window.addEventListener('touchcancel', end);
  }

  return {
    keys,
    onKey(fn) { keyHandlers.add(fn); return () => keyHandlers.delete(fn); },
    // x: right (+) / left (-), y: up on screen (+) / down (-)
    axis() {
      let x = 0, y = 0;
      if (keys.KeyW || keys.ArrowUp) y += 1;
      if (keys.KeyS || keys.ArrowDown) y -= 1;
      if (keys.KeyA || keys.ArrowLeft) x -= 1;
      if (keys.KeyD || keys.ArrowRight) x += 1;
      if (joy.active) { x += joy.x; y -= joy.y; }
      const L = Math.hypot(x, y);
      if (L > 1) { x /= L; y /= L; }
      return { x, y };
    },
    running() { return !!(keys.ShiftLeft || keys.ShiftRight); },
  };
}
