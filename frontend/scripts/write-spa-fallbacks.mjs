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

/** Must match App.tsx linking.config screens paths (plus legacy capitalised Explore URLs). */
const SPA_ROUTES = [
  'search',
  'search/results',
  'search/explore',
  // React Navigation previously used the screen name "Explore" when linking omitted it
  'search/Explore',
  'monthly-deals',
  'monthly-deals/results',
  'monthly-deals/explore',
  'monthly-deals/Explore',
  'dynamic-destinations',
  'dynamic-destinations/results',
  'settings',
  'admin/settings',
  'login',
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
