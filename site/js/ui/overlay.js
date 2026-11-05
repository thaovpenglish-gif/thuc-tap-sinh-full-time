// Full-screen card overlay used for day intros, day ends, results and endings.
// While a card is open, toasts move to the bottom of the screen so they never cover the card's text.
import { $ } from '../core/util.js';

export function overlay(html) {
  $('#ovCard').innerHTML = html;
  $('#overlay').hidden = false;
  if (!document.body.classList.contains('ov-open')) $('#toasts').innerHTML = ''; // stale toasts would cover the card
  document.body.classList.add('ov-open');
  $('#overlay').scrollTop = 0;
}
export function hideOverlay() { $('#overlay').hidden = true; document.body.classList.remove('ov-open'); }
