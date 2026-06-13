/* Record the animated demo scene (tools/demo-scene.html) to video files.
 * Produces public/assets/video/demo.webm and walkthrough.webm.
 *
 * Loads the scene over file:// (no server needed; fonts load from Google Fonts).
 * Run: node tools/record-demo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SCENE_URL = pathToFileURL(path.join(HERE, 'demo-scene.html')).href;
const require = createRequire('C:/Users/robin/Desktop/KernelCMS/');
const { chromium } = require('@playwright/test');

const SIZE = { width: 1200, height: 750 };
// One full cycle of the scene timeline (so the looped hero video has no cut-off act).
// demo:  chat6 + term3 + admin6 + site3.4 + end2.8 + ~0.4 lead = ~21.6s
// walk:  before3.4 + (demo cycle) = ~25.0s
const SCENES = [
  { name: 'demo', ms: 21600 },
  { name: 'walkthrough', ms: 25000 },
];

const outDir = path.join(ROOT, 'public', 'assets', 'video');
fs.mkdirSync(outDir, { recursive: true });
const tmp = path.join(ROOT, 'tools', '.rec');
fs.mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch();
for (const sc of SCENES) {
  const ctx = await browser.newContext({ viewport: SIZE, recordVideo: { dir: tmp, size: SIZE } });
  const page = await ctx.newPage();
  await page.goto(`${SCENE_URL}?scene=${sc.name}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready, { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(sc.ms);
  await ctx.close();
  const dest = path.join(outDir, `${sc.name}.webm`);
  await page.video().saveAs(dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`Wrote assets/video/${sc.name}.webm (${kb} KB, ${sc.ms / 1000}s @ ${SIZE.width}x${SIZE.height})`);
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log('Done.');
