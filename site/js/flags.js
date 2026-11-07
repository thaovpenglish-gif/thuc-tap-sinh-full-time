// Feature flags. The legacy "Ba Mẹ & Partners" story is hidden from the menu (decision: hide for now)
// but can be opened for testing with ?legacy=1 in the URL.
const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');

export const FLAGS = {
  legacyStory: params.get('legacy') === '1',
  // preview Chị Giáo (the developer's donation corner) even when SUPPORT_URL is empty
  giao: params.get('giao') === '1',
  // per-company office styles/layouts: in progress, approved one company at a time — preview with ?styles=1
  officeStyles: params.get('styles') === '1',
  // Multiplayer "Overdeadline & Overburnout" (SOS Advisory): open on the main menu as a beta (Game Owner, 2026-11-05).
  // ?mp=0 hides it again (back to "Sắp ra mắt").
  mp: params.get('mp') !== '0',
  // Khu phố T&M (endless neighbourhood life sim): phase 1 in progress. ?kp=1 shows its card on the main menu
  // and opens it directly; the card goes public once the Game Owner approves phase 1.
  kp: params.get('kp') === '1',
};
