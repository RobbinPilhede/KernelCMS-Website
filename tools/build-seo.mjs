/* Static SEO / GEO (Generative Engine Optimization) generator.
 *
 * The site is a JS-rendered SPA, which is invisible to most crawlers and AI
 * retrieval. This script reads the SAME content source (assets/content.js) and
 * emits a crawlable, quotable static mirror plus machine-readable text:
 *
 *   /docs/<slug>.html, /guides/<slug>.html, /articles/<slug>.html   (static pages)
 *   /sitemap.xml
 *   /llms.txt        (curated index for LLMs - llmstxt.org convention)
 *   /llms-full.txt   (entire content as markdown, for direct AI ingestion)
 *
 * Run: node tools/build-seo.mjs   (set SEO_BASE to your real domain)
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.SEO_BASE || 'https://kernelcms.com').replace(/\/$/, '');

// --- load content.js in a Node sandbox (it only touches `window`) ------------
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/content.js'), 'utf8'), sandbox);
const { DOCS, GUIDES, BLOG, articleTop, articleBottom, seoMeta } = sandbox.window.KCMS_CONTENT;

// Parse "Jun 13, 2026" as a UTC calendar date (avoids local-midnight off-by-one).
const iso = (d) => new Date(d + ' 00:00:00 UTC').toISOString().slice(0, 10);

// Competitor entities referenced by comparison articles (for JSON-LD `about`).
const ABOUT = {
  payload: { name: 'Payload CMS', url: 'https://payloadcms.com' },
  sanity: { name: 'Sanity', url: 'https://www.sanity.io' },
  strapi: { name: 'Strapi', url: 'https://strapi.io' },
  contentful: { name: 'Contentful', url: 'https://www.contentful.com' },
  directus: { name: 'Directus', url: 'https://directus.io' },
};
function blogJsonld(b, canonical) {
  const isTeam = !b.author || b.author === 'KernelCMS Team';
  const pub = { '@type': 'Organization', name: 'KernelCMS', url: BASE, logo: { '@type': 'ImageObject', url: `${BASE}/brand/kernelcms-logo.svg` } };
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: b.title,
    description: b.excerpt,
    articleSection: b.cover && ABOUT[b.cover] ? 'CMS comparison' : 'Engineering',
    author: isTeam
      ? { '@type': 'Organization', name: 'KernelCMS', url: BASE }
      : { '@type': 'Person', name: b.author, description: b.authorBio, url: BASE },
    publisher: pub,
    datePublished: iso(b.date),
    dateModified: iso(b.updated || b.date),
    mainEntityOfPage: canonical,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'KernelCMS', url: BASE },
    about: [{ '@type': 'SoftwareApplication', name: 'KernelCMS', applicationCategory: 'DeveloperApplication', url: BASE }]
      .concat(b.cover && ABOUT[b.cover] ? [{ '@type': 'SoftwareApplication', name: ABOUT[b.cover].name, url: ABOUT[b.cover].url }] : []),
  };
  if (b.sources && b.sources.length) article.citation = b.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url }));
  const nodes = [article];
  if (b.faq && b.faq.length) {
    nodes.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: b.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  }
  return nodes;
}

// --- helpers -----------------------------------------------------------------
const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#160;|&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…').replace(/&amp;/g, '&');
const stripIcons = (s) => s.replace(/__ICON_\w+__/g, '');
const textOf = (h) => decode(stripIcons(h).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const inlineMd = (t) =>
  decode(stripIcons(t)
    .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
    .replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
    .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`')
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/g, '$1')
    .replace(/<[^>]+>/g, '')
  ).replace(/[ \t]+/g, ' ').trim();

function tableToMd(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) =>
    [...m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((c) => textOf(c[1]) || ' '));
  if (!rows.length) return '';
  const head = rows[0].map((h) => h || ' ');
  let md = '\n| ' + head.join(' | ') + ' |\n| ' + head.map(() => '---').join(' | ') + ' |\n';
  for (const r of rows.slice(1)) md += '| ' + r.join(' | ') + ' |\n';
  return md + '\n';
}

function htmlToMd(html) {
  let s = stripIcons(html);
  s = s.replace(/<table[\s\S]*?<\/table>/g, (t) => tableToMd(t));
  s = s.replace(/<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/g, (m, c) => '\n```\n' + decode(c) + '\n```\n');
  s = s.replace(/<div class="callout[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g, (m, t) => '\n> ' + textOf(t) + '\n');
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (m, t) => '\n## ' + textOf(t) + '\n');
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (m, t) => '\n### ' + textOf(t) + '\n');
  s = s.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (m, t) => '\n> ' + textOf(t) + '\n');
  s = s.replace(/<li>([\s\S]*?)<\/li>/g, (m, t) => '- ' + inlineMd(t) + '\n');
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (m, t) => '\n' + inlineMd(t) + '\n');
  s = s.replace(/<\/?(ul|ol|div|article|section)[^>]*>/g, '\n');
  s = inlineMd(s);
  return s.replace(/\n{3,}/g, '\n\n').trim();
}

const HEAD = (title, desc, canonical, jsonld, image) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${desc.replace(/"/g, '&quot;')}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${image}" />
<link rel="icon" href="/brand/favicon.svg" />
<script>(function(){try{if(localStorage.getItem('kernel-theme')!=='light')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})()</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Jost:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/site.css" />
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head><body>
<div class="bg" aria-hidden="true"><div class="aurora aurora-1"></div><div class="aurora aurora-2"></div><div class="pixels"></div></div>`;

const NAVBAR = `<header class="topbar"><div class="topbar-inner">
  <a class="logo" href="/"><span class="logo-word">Kernel<b>CMS</b></span></a>
  <nav class="nav-links"><a href="/#/docs">Docs</a><a href="/#/guides">Guides</a><a href="/#/blog">Blog</a></nav>
  <div class="nav-spacer"></div>
  <a class="btn primary sm" href="/#/docs/quickstart">Get started</a>
</div></header>`;

const FOOTER = `<footer class="footer"><div class="wrap"><div class="footer-bottom">
  <span>© 2026 KernelCMS · MIT licensed core</span>
  <span><a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">sitemap</a> · <a href="https://github.com/RobbinPilhede/KernelCMS">GitHub</a></span>
</div></div></footer></body></html>`;

const faqNode = (faq) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

function page({ dir, slug, title, desc, lead, html, kind, author, date, appHash, jsonld: jsonldOverride, metaTitle, metaDesc, faq }) {
  const canonical = `${BASE}/${dir}/${slug}.html`;
  let jsonld = jsonldOverride || {
    '@context': 'https://schema.org',
    '@type': kind === 'articles' ? 'TechArticle' : 'TechArticle',
    headline: title,
    description: metaDesc || desc,
    author: { '@type': author === 'KernelCMS Team' || !author ? 'Organization' : 'Person', name: author || 'KernelCMS' },
    publisher: { '@type': 'Organization', name: 'KernelCMS', url: BASE },
    mainEntityOfPage: canonical,
    ...(date ? { datePublished: new Date(date).toISOString().slice(0, 10) } : {}),
    isPartOf: { '@type': 'WebSite', name: 'KernelCMS', url: BASE },
    about: { '@type': 'SoftwareApplication', name: 'KernelCMS', applicationCategory: 'DeveloperApplication' },
  };
  if (!jsonldOverride && faq && faq.length) jsonld = [jsonld, faqNode(faq)];
  const body = stripIcons(html);
  const image = `${BASE}/og/${kind === 'articles' ? slug : 'default'}.png`;
  const out = `${HEAD(metaTitle || `${title} | KernelCMS`, metaDesc || desc, canonical, jsonld, image)}
${NAVBAR}
<main class="wrap" style="max-width:840px;padding-block:48px 80px">
  <p style="font-family:var(--mono);font-size:13px;color:var(--muted);margin:0 0 8px">${kind === 'articles' ? 'KernelCMS · Comparison' : kind === 'guides' ? 'KernelCMS · Guide' : 'KernelCMS · Docs'}</p>
  <h1 style="font-size:clamp(2rem,1.4rem+2vw,2.8rem);font-weight:600;margin:0 0 10px">${title}</h1>
  <p class="doc-lead" style="font-size:18px;color:var(--muted);margin:0 0 14px">${lead}</p>
  ${author ? `<p style="font-size:13px;color:var(--faint);margin:0 0 28px">By ${author}${date ? ' · ' + date : ''}</p>` : ''}
  <div class="prose">${body}</div>
  <p style="margin-top:48px"><a class="btn ghost" href="/#/${appHash}">Open in the interactive app →</a></p>
</main>
${FOOTER}`;
  const odir = path.join(ROOT, dir);
  fs.mkdirSync(odir, { recursive: true });
  fs.writeFileSync(path.join(odir, `${slug}.html`), out);
  return canonical;
}

// --- generate static pages ---------------------------------------------------
const urls = [{ loc: `${BASE}/`, pri: '1.0' }];

for (const d of DOCS) {
  const m = seoMeta(d, 'doc');
  const u = page({ dir: 'docs', slug: d.slug, title: d.title, desc: d.lead, lead: d.lead, html: d.html, kind: 'docs', appHash: `docs/${d.slug}`, metaTitle: m.title, metaDesc: m.description });
  urls.push({ loc: u, pri: '0.8' });
}
for (const g of GUIDES) {
  const m = seoMeta(g, 'guide');
  const u = page({ dir: 'guides', slug: g.slug, title: g.title, desc: g.excerpt, lead: g.excerpt, html: g.html, kind: 'guides', appHash: `guides/${g.slug}`, metaTitle: m.title, metaDesc: m.description, faq: g.faq });
  urls.push({ loc: u, pri: '0.7' });
}
for (const b of BLOG) {
  const m = seoMeta(b, 'article');
  const u = page({
    dir: 'articles', slug: b.slug, title: b.title, desc: b.excerpt, lead: b.excerpt,
    html: articleTop(b) + b.html + articleBottom(b), kind: 'articles', author: b.author, date: b.date,
    appHash: `blog/${b.slug}`, jsonld: blogJsonld(b, `${BASE}/articles/${b.slug}.html`),
    metaTitle: m.title, metaDesc: m.description,
  });
  urls.push({ loc: u, pri: '0.9' });
}

// --- sitemap.xml -------------------------------------------------------------
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

// --- llms-full.txt (everything, as markdown) ---------------------------------
let full = `# KernelCMS - full documentation & comparisons

> KernelCMS is an open-source (MIT), TypeScript-native, config-as-code headless CMS. You model content in a single kernel.config.ts and get a typed engine, auto-generated REST + GraphQL APIs, a typed in-process Local API, a React admin panel, and a CLI. Database, storage, auth, email, cache, and search are swappable adapters. It runs on web standards (Request → Response) with no framework lock-in, self-hosted on a single container. Developers own the model in code; editors change content in a no-code admin with live preview and a page builder.

Source: ${BASE}  ·  License: MIT  ·  Language: TypeScript

---

## Documentation
`;
for (const d of DOCS) full += `\n### ${d.title}\n${d.lead}\n\n${htmlToMd(d.html)}\n\n---\n`;
full += `\n## Guides\n`;
for (const g of GUIDES) full += `\n### ${g.title}\n${g.excerpt}\n\n${htmlToMd(g.html)}\n\n---\n`;
full += `\n## Comparisons & articles\n`;
for (const b of BLOG) full += `\n### ${b.title}\n${b.excerpt}\n\n${htmlToMd(articleTop(b) + b.html + articleBottom(b))}\n\n---\n`;
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), full.replace(/\n{3,}/g, '\n\n'));

// --- llms.txt (curated index) ------------------------------------------------
const link = (dir, slug, title, blurb) => `- [${title}](${BASE}/${dir}/${slug}.html): ${blurb}`;
const llms = `# KernelCMS

> KernelCMS is an open-source (MIT), TypeScript-native, config-as-code headless CMS. Model content in one kernel.config.ts and get a typed engine, auto-generated REST + GraphQL, a typed in-process Local API, a React admin, and a CLI. Database, storage, auth, email, cache, and search are swappable adapters. Runs on web standards with no framework lock-in; self-host on a single container. Developers own the model in code; non-technical editors change content with no code, with live preview and a page builder.

Key facts:
- License: MIT (core). Language: TypeScript, config-as-code.
- No framework coupling - a web-standard Request → Response server that runs on Node, edge, or any container. (Unlike Payload 3, which runs inside Next.js.)
- Default database is SQLite via Node's built-in node:sqlite (zero native dependencies). Also Postgres, MySQL, MongoDB.
- Three APIs from one model: REST, GraphQL, and a typed in-process Local API - same access rules across all three.
- Secure by default: deny-by-default access control, row-level filters, field-level redaction, and a privilege-escalation guard.
- No-code editing for content teams: React admin, live preview, a blocks page builder, drafts, versions, scheduled publish.
- Self-host and own your data (no SaaS lock-in, unlike Sanity/Contentful).

## Documentation
${DOCS.map((d) => link('docs', d.slug, d.title, d.lead)).join('\n')}

## Guides
${GUIDES.map((g) => link('guides', g.slug, g.title, g.excerpt)).join('\n')}

## Comparisons
${BLOG.map((b) => link('articles', b.slug, b.title, b.excerpt)).join('\n')}

## Full content
- [Complete content as markdown](${BASE}/llms-full.txt): every doc, guide, and comparison in one file.
`;
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms);

console.log(`Generated ${DOCS.length} docs + ${GUIDES.length} guides + ${BLOG.length} articles`);
console.log(`Wrote: sitemap.xml, llms.txt, llms-full.txt`);
console.log(`Base URL: ${BASE}  (set SEO_BASE to override)`);
