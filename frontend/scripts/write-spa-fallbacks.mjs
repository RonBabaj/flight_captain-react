/**
 * After `expo export -p web`, copy index.html into each client-side route directory.
 * Nginx-based hosts ignore `.htaccess`; without a `try_files` SPA fallback,
 * refreshing `/search/results` returns 404. Physical `.../index.html` route shells fix that
 * for common paths.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
const indexPath = path.join(dist, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('[spa-fallback] dist/index.html not found — run expo export first');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');

/** Must match App.tsx linking.config screens paths */
const SPA_ROUTES = [
  'search',
  'search/results',
  'monthly-deals',
  'monthly-deals/results',
  'hotel-deals',
  'hotel-deals/results',
  // Legacy bookmarks / old links (.htaccess redirected these on Apache only)
  'results',
  'deals',
];

for (const route of SPA_ROUTES) {
  const dir = path.join(dist, ...route.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, 'index.html');
  fs.writeFileSync(out, indexHtml);
  console.log(`[spa-fallback] wrote ${route}/index.html`);
}

// 404.html identical to index — some hosts use it as SPA fallback
fs.writeFileSync(path.join(dist, '404.html'), indexHtml);
console.log('[spa-fallback] wrote 404.html');
