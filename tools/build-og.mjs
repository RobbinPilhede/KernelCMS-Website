/* Render a real 1200x630 PNG Open Graph image per article (and a default brand
 * card). Social platforms and many link-preview/AI fetchers ignore SVG og:image,
 * so we rasterize the same "versus" cover composition used on the site.
 *
 * Run: node tools/build-og.mjs   (after content changes)
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire('C:/Users/robin/Desktop/KernelCMS/');
const { chromium } = require('@playwright/test');

// content (for slugs + cover kinds)
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/content.js'), 'utf8'), sandbox);
const { BLOG } = sandbox.window.KCMS_CONTENT;

const STAR = `M50 0 L53 34 L68 3 L55 36 L90 12 L58 40 L98 38 L59 46 L100 50 L59 55 L96 68 L57 58 L88 90 L54 62 L65 98 L51 64 L50 100 L48 62 L32 96 L45 60 L8 85 L42 56 L2 65 L41 52 L0 50 L42 46 L4 35 L44 42 L12 14 L46 38 L35 5 L48 36 Z`;
const COMPETITORS = {
  payload: { name: 'Payload', accent: '#9db0ff', tag: 'Next.js · MIT' },
  sanity: { name: 'Sanity', accent: '#fb6a59', tag: 'SaaS · GROQ' },
  strapi: { name: 'Strapi', accent: '#a594ff', tag: 'Node · plugins' },
  contentful: { name: 'Contentful', accent: '#5aa9e6', tag: 'SaaS · enterprise' },
  directus: { name: 'Directus', accent: '#8b7bff', tag: 'DB-first · BSL' },
};

function coverSVG(kind) {
  const c = COMPETITORS[kind];
  const defs = `<defs>
    <linearGradient id="cvbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101216"/><stop offset="1" stop-color="#0a0b0e"/></linearGradient>
    <pattern id="cvdot" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1.4" cy="1.4" r="1.4" fill="#ffffff" fill-opacity="0.05"/></pattern>
    <radialGradient id="cvglow" cx="0.5" cy="0.12" r="0.75"><stop offset="0" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  </defs>`;
  const base = `<rect width="1200" height="630" fill="url(#cvbg)"/><rect width="1200" height="630" fill="url(#cvdot)"/><rect width="1200" height="630" fill="url(#cvglow)"/>`;
  const star = (cx, cy, s, fill) => `<path transform="translate(${cx - 50 * s} ${cy - 50 * s}) scale(${s})" d="${STAR}" fill="${fill}"/>`;
  const word = (x, y, size) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Jost, sans-serif" font-size="${size}" letter-spacing="1" fill="#f4f4f6"><tspan font-weight="300">Kernel</tspan><tspan font-weight="500">CMS</tspan></text>`;
  const label = `<text x="64" y="82" font-family="ui-monospace, monospace" font-size="22" letter-spacing="3" fill="#6a6a76">KERNELCMS&#160;&#160;/&#160;&#160;COMPARISON</text>`;
  if (c) {
    const fs2 = Math.min(98, Math.round(480 / (c.name.length * 0.58)));
    return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">${defs}${base}${label}
      <text x="330" y="322" text-anchor="middle" font-family="Inter, sans-serif" font-size="${fs2}" font-weight="600" fill="${c.accent}">${c.name}</text>
      <text x="330" y="368" text-anchor="middle" font-family="ui-monospace, monospace" font-size="21" letter-spacing="1" fill="#7b7b86">${c.tag}</text>
      <line x1="600" y1="158" x2="600" y2="462" stroke="${c.accent}" stroke-opacity="0.3" stroke-width="2"/>
      <circle cx="600" cy="298" r="38" fill="#0b0c0f" stroke="${c.accent}" stroke-width="2"/>
      <text x="600" y="307" text-anchor="middle" font-family="ui-monospace, monospace" font-size="24" font-weight="700" letter-spacing="1" fill="${c.accent}">VS</text>
      ${star(874, 244, 0.92, '#f4f4f6')}${word(874, 372, 54)}
      <text x="874" y="410" text-anchor="middle" font-family="ui-monospace, monospace" font-size="21" letter-spacing="1" fill="#7b7b86">config-as-code · MIT</text>
      <rect x="0" y="624" width="1200" height="6" fill="${c.accent}"/></svg>`;
  }
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">${defs}${base}${label}${star(600, 250, 1.6, '#f4f4f6')}${word(600, 450, 70)}
    <rect x="0" y="624" width="1200" height="6" fill="#3a3a44"/></svg>`;
}

const html = (svg) => `<!doctype html><html><head>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>html,body{margin:0;padding:0;width:1200px;height:630px;overflow:hidden}</style>
  </head><body>${svg}</body></html>`;

const outDir = path.join(ROOT, 'og');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

async function shot(svg, file) {
  await page.setContent(html(svg), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(outDir, file), clip: { x: 0, y: 0, width: 1200, height: 630 } });
}

await shot(coverSVG(null), 'default.png');
for (const b of BLOG) await shot(coverSVG(b.cover), `${b.slug}.png`);

await browser.close();
console.log(`Wrote og/default.png + ${BLOG.length} per-article OG images (1200x630).`);
