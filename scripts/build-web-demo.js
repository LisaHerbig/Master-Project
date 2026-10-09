#!/usr/bin/env node
// Builds the web demo into docs/demo for GitHub Pages:
//   docs/demo/            landing page with the phone frame (web-demo/index.html)
//   docs/demo/embed.html  phone frame only, for embedding in the portfolio
//   docs/demo/app/        the Expo web export of the app
// docs/index.html (the page the NFC stickers point to) is never touched.
//
// Usage: npm run build:web-demo

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'web-demo');
const DOCS = path.join(ROOT, 'docs');
const OUT = path.join(DOCS, 'demo');
const APP_OUT = path.join(OUT, 'app');

const DEMO_BASE = process.env.WEB_DEMO_BASE ?? '/Master-Project/demo';
const APP_BASE = `${DEMO_BASE}/app`;

fs.rmSync(OUT, { recursive: true, force: true });

execSync(`npx expo export -p web --clear --output-dir "${APP_OUT}"`, {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, WEB_DEMO: '1', WEB_DEMO_BASE_URL: APP_BASE },
});

// Expo Router bundles the native screens as fallbacks, which pulls in the audio files.
// The web demo has no audio, so drop them (about 70 MB).
fs.rmSync(path.join(APP_OUT, 'assets', 'assets', 'audio'), { recursive: true, force: true });

// Runs before the app starts:
// - restores a deep link handed over by docs/404.html (reload on /demo/app/book/1)
// - sends wide desktop windows that open the app directly to the page with the phone frame
const bootScript = `<script>
(function () {
  var p = new URLSearchParams(location.search).get('p');
  if (p) history.replaceState(null, '', '${APP_BASE}' + p);
  if (window.top === window.self && window.innerWidth > 860) location.replace('${DEMO_BASE}/');
})();
</script>`;
const indexPath = path.join(APP_OUT, 'index.html');
fs.writeFileSync(indexPath, fs.readFileSync(indexPath, 'utf8').replace('<head>', `<head>${bootScript}`));

for (const file of ['index.html', 'embed.html', 'phone.css', 'phone.js']) {
  fs.copyFileSync(path.join(SRC, file), path.join(OUT, file));
}

// Site-wide files GitHub Pages needs for the demo:
// 404.html hands deep links back to the app, .nojekyll keeps the _expo folder from being dropped.
fs.writeFileSync(
  path.join(DOCS, '404.html'),
  fs.readFileSync(path.join(SRC, '404.html'), 'utf8').replace('__APP_BASE__', APP_BASE)
);
fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');

console.log(`\nWeb demo built into ${path.relative(ROOT, OUT)} (base ${DEMO_BASE}/)`);
