/* Static prerender: render every route of the built SPA in a headless browser
 * and write the fully-rendered HTML (with the route's injected SEO head -
 * canonical, meta, Open Graph, Twitter, JSON-LD) to dist/<route>/index.html.
 *
 * Why: the app is client-rendered, so crawlers that don't run JS would only see
 * the empty shell. Emitting real HTML per route guarantees search engines and
 * AI answer-engines read the content and tags directly. The pages still ship
 * the module script, so they hydrate into the live SPA after first paint.
 *
 * Static hosts serve dist/docs/installation/index.html for /docs/installation
 * (a real file) before the SPA catch-all fallback ever applies.
 *
 * Run after `vite build`:  node tools/prerender.mjs   (or: pnpm build:static)
 */
import { preview } from 'vite'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const require = createRequire('C:/Users/robin/Desktop/KernelCMS/')
const { chromium } = require('@playwright/test')

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html not found - run `vite build` first.')
  process.exit(1)
}

// Routes come straight from the sitemap (the canonical list of indexable URLs).
const xml = fs.readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8')
const routes = [...xml.matchAll(/<loc>https:\/\/kernelcms\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/')
if (!routes.includes('/')) routes.unshift('/')

const PORT = 4178
const server = await preview({ preview: { port: PORT, strictPort: true } })
const base = `http://localhost:${PORT}`

const browser = await chromium.launch()
const failed = []
// Capture every route into memory FIRST. We must not overwrite dist/index.html
// mid-crawl: it is the SPA fallback the preview server returns for every deep
// route, so writing the home page into it would poison later captures.
const captures = []
for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const expected = 'https://kernelcms.com' + (route === '/' ? '/' : route)
  try {
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('#app h1', { timeout: 10000 }).catch(() => {})
    // Wait until the router has settled on this route (canonical reflects it).
    await page.waitForFunction(
      (exp) => document.querySelector('link[rel="canonical"]')?.href === exp,
      expected, { timeout: 8000 },
    ).catch(() => {})
    await page.waitForTimeout(200)

    const got = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.href)
    if (got !== expected) { failed.push(`${route}: rendered ${got} (expected ${expected})`); continue }
    captures.push([route, await page.content()])
  } catch (e) {
    failed.push(`${route}: ${e.message}`)
  } finally {
    await page.close()
  }
}
await browser.close()
await (server.close?.() ?? new Promise((r) => server.httpServer.close(r)))

// Now write everything (home last is fine - nothing reads it after this).
for (const [route, html] of captures) {
  const outPath = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.replace(/^\//, ''), 'index.html')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, html)
}

console.log(`Prerendered ${captures.length}/${routes.length} routes to dist/`)
if (failed.length) {
  console.error('Failed:\n  ' + failed.join('\n  '))
  process.exit(1)
}
