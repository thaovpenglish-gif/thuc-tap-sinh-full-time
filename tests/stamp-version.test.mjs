import test from 'node:test';
import assert from 'node:assert/strict';
import { stampJs, stampHtml } from '../scripts/stamp-version.mjs';

test('every local module import gets the deploy version', () => {
  const src = [
    "import * as THREE from 'three';",
    "import { $ } from './core/util.js';",
    'import { buildWorld } from "../maps/legacy-office.js?v=old";',
    "const m = await import('./modes/legacy.js');",
    "import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';",
    "db.from('confessions');",
  ].join('\n');
  const out = stampJs(src, 'abc123');
  assert.match(out, /'three'/);
  assert.match(out, /'\.\/core\/util\.js\?v=abc123'/);
  assert.match(out, /"\.\.\/maps\/legacy-office\.js\?v=abc123"/);
  assert.match(out, /import\('\.\/modes\/legacy\.js\?v=abc123'\)/);
  assert.match(out, /supabase-js@2\.45\.4\/\+esm'/);
  assert.match(out, /from\('confessions'\)/);
});

test('index.html links to the stylesheet and entry module with the deploy version', () => {
  const out = stampHtml('<link rel="stylesheet" href="style.css?v=1"><script type="module" src="js/main.js?v=1"></script><link href="https://fonts.googleapis.com/x.css">', 'abc123');
  assert.match(out, /href="style\.css\?v=abc123"/);
  assert.match(out, /src="js\/main\.js\?v=abc123"/);
  assert.match(out, /href="https:\/\/fonts\.googleapis\.com\/x\.css"/);
});
