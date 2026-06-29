/**
 * Copy repo /public and /uploads references into apps/web/public for Next.js static serving.
 * Run after clone: npm run sync:public
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const srcPublic = path.join(ROOT, 'public');
const destPublic = path.join(ROOT, 'apps', 'web', 'public');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(srcPublic, destPublic);
console.log('Synced public assets to apps/web/public');
