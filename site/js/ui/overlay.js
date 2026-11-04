// Full-screen card overlay used for day intros, day ends, results and endings.
import { $ } from '../core/util.js';

export function overlay(html) {
  $('#ovCard').innerHTML = html;
  $('#overlay').hidden = false;
}
export function hideOverlay() { $('#overlay').hidden = true; }
