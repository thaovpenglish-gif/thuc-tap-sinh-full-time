// Feature flags. The legacy "Ba Mẹ & Partners" story is hidden from the menu (decision: hide for now)
// but can be opened for testing with ?legacy=1 in the URL.
const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');

export const FLAGS = {
  legacyStory: params.get('legacy') === '1',
  // preview Chị Giáo (the developer's donation corner) even when SUPPORT_URL is empty
  giao: params.get('giao') === '1',
  // per-company office styles/layouts: in progress, approved one company at a time — preview with ?styles=1
  officeStyles: params.get('styles') === '1',
};
