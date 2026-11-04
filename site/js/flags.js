// Feature flags. The legacy "Ba Mẹ & Partners" story is hidden from the menu (decision: hide for now)
// but can be opened for testing with ?legacy=1 in the URL.
const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');

export const FLAGS = {
  legacyStory: params.get('legacy') === '1',
};
