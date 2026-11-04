// Deploy-time cache busting. GitHub Pages lets browsers keep every file for 10 minutes, and ES module
// imports like '../maps/legacy-office.js' carry no version, so a returning player could run a fresh
// main.js with a stale map or mode file (old cutaway walls, missing ceiling, broken camera).
// This stamps one version onto every local module import and onto the links in index.html, so a new
// deploy always loads a complete, matching set of files.
// Usage: node scripts/stamp-version.mjs <siteDir> <version>
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const [dir = 'site', version = Date.now().toString(36)] = process.argv.slice(2);
const v = encodeURIComponent(version);

// './x.js' or '../x.js' (optionally already carrying ?v=...) after `from`, `import`, or `import(`
const IMPORT_RE = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"?]+\.js)(\?v=[^'"]*)?\2/g;

export function stampJs(src, ver = v) {
  return src.replace(IMPORT_RE, (_, kw, q, path) => `${kw}${q}${path}?v=${ver}${q}`);
}

export function stampHtml(src, ver = v) {
  return src.replace(/((?:href|src)=")((?!https?:)[^"?]+\.(?:css|js))(\?v=[^"]*)?"/g, (_, attr, path) => `${attr}${path}?v=${ver}"`);
}

function walk(d) {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let n = 0;
  for (const file of walk(dir)) {
    if (!/\.(js|mjs|html)$/.test(file)) continue;
    const src = readFileSync(file, 'utf8');
    const out = file.endsWith('.html') ? stampHtml(src) : stampJs(src);
    if (out !== src) { writeFileSync(file, out); n++; }
  }
  console.log(`stamped v=${version} into ${n} files under ${dir}`);
}
