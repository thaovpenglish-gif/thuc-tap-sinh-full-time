// Stacking toast notifications.
import { $ } from '../core/util.js';

export function toast(html, cls = '', life = 2.6) {
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast ' + cls;
  el.style.setProperty('--life', life + 's');
  el.innerHTML = html;
  box.appendChild(el);
  setTimeout(() => el.remove(), (life + 0.5) * 1000);
  if (box.children.length > 5) box.children[0].remove();
}
