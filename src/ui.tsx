/* eslint-disable */
// @ts-nocheck -- UI components ported from the vanilla site
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ICONS } from './icons'
import { markSVG, coverSVG, highlight, getTheme, applyTheme } from './lib'
import { DOCS, GUIDES, BLOG } from './content'
import { btn, btnPrimary, btnSm, iconLink } from './cls'

const html = (s: string) => ({ __html: s })

export function Icon({ name }: { name: string }) {
  return <span aria-hidden="true" style={{ display: 'inline-flex' }} dangerouslySetInnerHTML={html(ICONS[name] || '')} />
}
export function Mark({ cls }: { cls?: string }) {
  return <span aria-hidden="true" style={{ display: 'inline-flex' }} dangerouslySetInnerHTML={html(markSVG(cls))} />
}
export function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-[11px] leading-none text-inherit">
      <Mark />
      <span className="font-[family-name:var(--display)] text-xl font-light tracking-[0.03em] leading-none text-[var(--text)]">Kernel<b className="font-medium">CMS</b></span>
    </Link>
  )
}
export function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="pixels" />
    </div>
  )
}
export function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme)
  const dark = theme === 'dark'
  return (
    <button className="theme-toggle" data-dark={dark} role="switch" aria-checked={dark} aria-label="Toggle theme"
      onClick={() => { const n = dark ? 'light' : 'dark'; applyTheme(n); setTheme(n) }}>
      <span className="theme-knob" dangerouslySetInnerHTML={html(dark ? ICONS.moon : ICONS.sun)} />
    </button>
  )
}

const GITHUB = 'https://github.com/RobbinPilhede/KernelCMS'
// Bump when the demo videos are re-recorded so browsers/CDN fetch the new file
// instead of a cached copy at the same path.
const VIDEO_VERSION = 'cc-2026-06-13b'
const openCmdk = () => window.dispatchEvent(new Event('kcmdk'))

export function Topbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const navLink = 'px-3 py-2 rounded-lg text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)]'
  return (
    <header className="sticky top-[10px] sm:top-[14px] z-[60] mt-[10px] sm:mt-[14px] px-[clamp(14px,4vw,36px)]" id="topbar">
      <div className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-[18px] max-w-[var(--maxw)] mx-auto py-2 sm:py-[9px] pl-3 pr-2 sm:pl-4 sm:pr-[10px] rounded-2xl border bg-[var(--glass)] [backdrop-filter:blur(16px)_saturate(1.1)] transition-[box-shadow,border-color] duration-200 ${scrolled ? 'border-[color-mix(in_srgb,var(--text)_12%,var(--glass-border))] shadow-[0_14px_40px_-18px_rgba(0,0,0,0.45)]' : 'border-[var(--glass-border)] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]'}`}>
        <div className="flex items-center justify-self-start min-w-0"><Logo /></div>
        <nav className="flex items-center gap-1 justify-self-center max-[920px]:hidden">
          <Link to="/docs" className={navLink} activeProps={{ className: '!text-[var(--text)]' }}>Docs</Link>
          <Link to="/guides" className={navLink} activeProps={{ className: '!text-[var(--text)]' }}>Guides</Link>
          <Link to="/blog" className={navLink} activeProps={{ className: '!text-[var(--text)]' }}>Blog</Link>
          <Link to="/about" className={navLink} activeProps={{ className: '!text-[var(--text)]' }}>About</Link>
          <Link to="/safety" className={navLink} activeProps={{ className: '!text-[var(--text)]' }}>Safety</Link>
          <Link to="/mcp" className={navLink} activeProps={{ className: '!text-[var(--text)]' }}>MCP</Link>
          <Link to="/prompts" className={navLink} activeProps={{ className: '!text-[var(--text)]' }}>Prompts</Link>
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-[10px] justify-self-end">
          <button className="hidden sm:inline-flex items-center gap-2 px-[10px] py-[7px] rounded-[9px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] text-[13px] cursor-pointer transition-[border-color,color] hover:text-[var(--text)] hover:border-[color-mix(in_srgb,var(--text)_22%,var(--border))] [&>svg]:w-[15px] [&>svg]:h-[15px]" onClick={openCmdk}>
            <Icon name="search" /><span className="max-[920px]:hidden">Search</span>
            <kbd className="font-[family-name:var(--mono)] text-[11px] px-[5px] py-px rounded-[5px] bg-[color-mix(in_srgb,var(--text)_8%,transparent)] text-[var(--muted)]">⌘K</kbd>
          </button>
          <ThemeToggle />
          <a className={`${iconLink} hidden sm:grid`} href={GITHUB} target="_blank" rel="noopener" aria-label="GitHub"><Icon name="github" /></a>
          <Link className={`${btnPrimary} ${btnSm} hidden sm:inline-flex`} to="/docs/$slug" params={{ slug: 'quickstart' }}>Get started</Link>
          <button className={`${iconLink} hidden max-[920px]:grid`} onClick={() => setOpen(true)} aria-label="Menu"><Icon name="menu" /></button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[90]" onClick={(e) => { if ((e.target as HTMLElement).closest('[data-close]') || (e.target as HTMLElement).dataset.scrim) setOpen(false) }}>
          <div className="absolute inset-0 bg-[rgba(8,10,16,0.5)] backdrop-blur-[2px]" data-scrim="1" />
          <div className="absolute right-0 top-0 bottom-0 w-[min(82vw,340px)] bg-[var(--surface)] border-l border-[var(--border)] p-[18px] flex flex-col gap-[6px] [animation:slidein_.2s_var(--ease-out)] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <Logo />
              <button data-close className={iconLink} aria-label="Close menu"><Icon name="x" /></button>
            </div>
            <button
              onClick={() => { setOpen(false); openCmdk() }}
              className="flex items-center gap-3 px-[14px] py-3 min-h-[44px] rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] text-[14px] mb-1 [&_svg]:w-[16px] [&_svg]:h-[16px]"
            >
              <Icon name="search" /> Search<kbd className="ml-auto font-[family-name:var(--mono)] text-[11px] px-[5px] py-px rounded-[5px] bg-[color-mix(in_srgb,var(--text)_8%,transparent)]">⌘K</kbd>
            </button>
            {[['Docs', '/docs'], ['Guides', '/guides'], ['Blog', '/blog'], ['About', '/about'], ['Safety', '/safety'], ['MCP', '/mcp'], ['Prompts', '/prompts']].map(([t, to]) => (
              <Link key={to} to={to} data-close className="px-[14px] py-3 min-h-[44px] flex items-center rounded-[10px] font-medium text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)]">{t}</Link>
            ))}
            <Link to="/docs/$slug" params={{ slug: 'quickstart' }} className={`${btnPrimary} mt-2 justify-center`} data-close>Get started</Link>
            <a href={GITHUB} target="_blank" rel="noopener" data-close className="px-[14px] py-3 min-h-[44px] flex items-center rounded-[10px] font-medium text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)]">GitHub ↗</a>
          </div>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  const fcol = 'block text-[var(--muted)] text-sm py-[5px] transition-colors hover:text-[var(--text)]'
  const col = (h: string, links: [string, any][]) => (
    <div key={h}>
      <h2 className="text-xs uppercase tracking-[0.1em] text-[var(--muted)] mb-4">{h}</h2>
      {links.map(([label, to]) =>
        typeof to === 'string' && to.startsWith('http')
          ? <a key={label} href={to} className={fcol}>{label}</a>
          : <Link key={label} to={to.to} params={to.params} className={fcol}>{label}</Link>)}
    </div>
  )
  const L = (to: string, params?: any) => ({ to, params })
  return (
    <footer className="border-t border-[var(--border)] mt-[clamp(64px,9vw,120px)] pt-14 pb-10">
      <div className="w-full max-w-[var(--maxw)] mx-auto px-[clamp(18px,4vw,36px)]">
        <div className="grid grid-cols-[1.6fr_repeat(4,1fr)] gap-10 max-[920px]:grid-cols-2 max-[920px]:gap-8">
          <div className="max-[920px]:col-span-full"><Logo /><p className="text-[var(--muted)] text-sm max-w-[30ch] mt-4">The lightweight, standalone, type-safe headless CMS that does not hijack your framework.</p></div>
          {col('Product', [['Features', L('/')], ['Docs', L('/docs')], ['Guides', L('/guides')], ['Quickstart', L('/docs/$slug', { slug: 'quickstart' })]])}
          {col('Resources', [['Blog', L('/blog')], ['Changelog', L('/changelog')], ['CLI', L('/docs/$slug', { slug: 'cli' })], ['API reference', L('/docs/$slug', { slug: 'rest-api' })]])}
          {col('Company', [['About', L('/about')], ['Modules', L('/docs/$slug', { slug: 'modules' })], ['Access control', L('/docs/$slug', { slug: 'access-control' })], ['Embedding', L('/guides/$slug', { slug: 'embed-nextjs' })]])}
          {col('Community', [['GitHub', GITHUB], ['Safety', L('/safety')], ['MCP server', L('/mcp')], ['Prompts', L('/prompts')], ['llms.txt', 'https://kernelcms.com/llms.txt'], ['Sitemap', 'https://kernelcms.com/sitemap.xml']])}
        </div>
        <div className="flex items-center justify-between gap-4 mt-12 pt-6 border-t border-[var(--border)] text-[var(--faint)] text-[13px] flex-wrap">
          <span>© 2026 KernelCMS · MIT licensed core</span><span>Built on web standards · Runs on Node, edge, any container</span>
        </div>
      </div>
    </footer>
  )
}

// HTML content (docs/guides/articles) with code highlighting + icon placeholders
export function Prose({ content, className }: { content: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const withIcons = content.replace(/__ICON_(\w+)__/g, (_, n) => ICONS[n] || '')
  useEffect(() => {
    ref.current?.querySelectorAll('pre code').forEach((el) => {
      const lang = el.closest('pre')?.getAttribute('data-lang') || ''
      el.innerHTML = highlight(el.textContent || '', lang)
    })
  }, [content])
  return <div ref={ref} className={className || 'prose'} dangerouslySetInnerHTML={html(withIcons)} />
}

const COVER_ALT: Record<string, string> = {
  payload: 'KernelCMS vs Payload comparison cover art',
  sanity: 'KernelCMS vs Sanity comparison cover art',
  strapi: 'KernelCMS vs Strapi comparison cover art',
  contentful: 'KernelCMS vs Contentful comparison cover art',
  directus: 'KernelCMS vs Directus comparison cover art',
  brand: 'KernelCMS guide cover art',
}
export function CoverArt({ kind, label, alt }: { kind?: string; label?: boolean; alt?: string }) {
  return (
    <div role="img" aria-label={alt || COVER_ALT[kind || ''] || 'KernelCMS article cover art'}
      style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={html(coverSVG(kind, { label }))} />
  )
}

const DEMO_ALT: Record<string, string> = {
  demo: 'KernelCMS demo: a developer pastes a prompt into Claude Code to add a backend to a website. Claude reads kernelcms.com, creates a kernel.config.ts with a cakes collection, installs KernelCMS, and wires the frontend to the API. The KernelCMS no-code admin then appears and a new cake is published live to the site.',
  walkthrough: 'KernelCMS full walkthrough: turning a hardcoded, AI-generated website into one with a real backend, database, REST and GraphQL API, and a no-code React admin using a single kernel.config.ts file.',
}
export function DemoPlayer({ url, caption, base, autoplay, alt }: { url: string; caption: string; base: string; autoplay?: boolean; alt?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const label = alt || DEMO_ALT[base] || caption
  useEffect(() => {
    const demo = ref.current!; const v = demo.querySelector('video') as HTMLVideoElement
    const show = () => demo.classList.add('playing')
    const start = () => { const p = v.play(); if (p && (p as any).then) (p as any).then(show).catch(() => {}) }
    demo.querySelector('.demo-play')?.addEventListener('click', start)
    demo.querySelector('.demo-poster')?.addEventListener('click', start)
    v.addEventListener('click', () => { if (!v.paused) { v.pause(); demo.classList.remove('playing') } })
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (autoplay && !reduce) { v.addEventListener('playing', show, { once: true }); start() }
  }, [])
  return (
    <figure className="demo m-0" ref={ref} role="group" aria-label={label}>
      <div className="demo-chrome"><span /><span /><span /><div className="demo-url">{url}</div></div>
      <div className="demo-stage">
        <video className="demo-video" muted loop playsInline aria-label={label} title={caption} preload={autoplay ? 'auto' : 'metadata'} autoPlay={autoplay}>
          <source src={`/assets/video/${base}.webm?v=${VIDEO_VERSION}`} type="video/webm" />
          <source src={`/assets/video/${base}.mp4?v=${VIDEO_VERSION}`} type="video/mp4" />
        </video>
        <span className="demo-badge">DEMO</span>
        <div className="demo-poster">
          <div className="demo-poster-art" />
          <button className="demo-play" aria-label="Play the demo video"><Icon name="play" /></button>
          <div className="demo-cap">{caption}</div>
        </div>
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  )
}

// Count-up animation for a number (eases to the target when mounted)
export function CountUp({ to, dur = 1200 }: { to: number; dur?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0, start: number | undefined
    const ease = (p: number) => 1 - Math.pow(1 - p, 3)
    const tick = (t: number) => {
      if (start === undefined) start = t
      const p = Math.min(1, (t - start) / dur)
      setN(Math.round(ease(p) * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, dur])
  return <>{n.toLocaleString()}</>
}

// Live npm stats for the published package (version + downloads). Degrades to an
// install strip if the package isn't on npm yet or the API is unreachable.
export function NpmStats({ pkg = 'kernelcms' }: { pkg?: string }) {
  const [d, setD] = useState<any>(undefined) // undefined = loading, null = unavailable
  useEffect(() => {
    let on = true
    const j = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null)
    Promise.all([
      j(`https://registry.npmjs.org/${pkg}/latest`),
      j(`https://api.npmjs.org/downloads/point/last-week/${pkg}`),
      j(`https://api.npmjs.org/downloads/range/last-year/${pkg}`),
    ]).then(([latest, week, year]) => {
      if (!on) return
      const weekly = typeof week?.downloads === 'number' ? week.downloads : null
      const version = latest?.version ?? null
      if (version == null && weekly == null) { setD(null); return }
      const total = Array.isArray(year?.downloads) ? year.downloads.reduce((a: number, x: any) => a + (x.downloads || 0), 0) : null
      setD({ version, weekly, total })
    })
    return () => { on = false }
  }, [pkg])

  const card = 'border border-[var(--border)] bg-[var(--surface)] rounded-[16px] overflow-hidden'
  const cell = 'px-7 py-5 flex flex-col gap-1 min-w-[150px]'
  const label = 'font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]'
  const num = 'font-[family-name:var(--mono)] text-[clamp(1.4rem,1rem+1.4vw,2rem)] font-medium tracking-[-0.02em] leading-none text-[var(--text)]'
  const live = (
    <span className="inline-flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
      <span className="w-[7px] h-[7px] rounded-full bg-[var(--ok)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--ok)_22%,transparent)] animate-pulse" /> live from npm
    </span>
  )

  if (d === null) {
    // not published yet / unreachable: clean install strip
    return (
      <div className={`${card} flex items-center gap-5 flex-wrap p-5`}>
        <span className="inline-flex items-center gap-3 font-[family-name:var(--mono)] text-sm">
          <span className="text-[var(--faint)]">$</span> npm install {pkg}
          <button className="grid place-items-center w-7 h-7 rounded-[7px] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] [&>svg]:w-[14px]" aria-label="Copy"
            onClick={(e) => { navigator.clipboard?.writeText('npm install ' + pkg); const b = e.currentTarget; const o = b.innerHTML; b.innerHTML = ICONS.check; setTimeout(() => (b.innerHTML = o), 1200) }}><Icon name="copy" /></button>
        </span>
        <span className="flex-1" />
        <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--faint)]">open source · MIT · stats go live on publish</span>
      </div>
    )
  }
  return (
    <div className={`${card} flex items-stretch flex-wrap divide-x divide-[var(--border)] max-[680px]:divide-x-0 max-[680px]:divide-y`}>
      <div className={`${cell} justify-center !gap-2`}>{live}<span className="font-[family-name:var(--mono)] text-sm text-[var(--text)]">{pkg}{d?.version ? <span className="text-[var(--muted)]"> v{d.version}</span> : null}</span></div>
      <div className={cell}><span className={label}>Weekly installs</span><span className={num}>{d?.weekly != null ? <CountUp to={d.weekly} /> : '-'}</span></div>
      <div className={cell}><span className={label}>Downloads / year</span><span className={num}>{d?.total != null ? <CountUp to={d.total} /> : '-'}</span></div>
      <div className={cell}><span className={label}>License</span><span className={num}>MIT</span></div>
    </div>
  )
}

/* =========================================================================
   SEO head management for the SPA. Per route this sets the title, canonical,
   description, keywords, robots, Open Graph + Twitter cards, and a JSON-LD
   graph (BreadcrumbList + the page's main entity + optional FAQ).
   ========================================================================= */
export const SITE_URL = 'https://kernelcms.com'
const SITE_NAME = 'KernelCMS'
const TWITTER = '@kernelcms'
const ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const BASE_KEYWORDS = [
  'KernelCMS', 'headless CMS', 'open source CMS', 'TypeScript CMS',
  'self-hosted CMS', 'Node.js CMS', 'config-as-code CMS', 'REST and GraphQL CMS',
]

type HeadOpts = {
  keywords?: string[]
  image?: string // path under /og or absolute
  imageAlt?: string
  type?: 'website' | 'article'
  section?: string
  author?: string
  published?: string // ISO
  modified?: string // ISO
  breadcrumb?: { name: string; path: string }[]
  faq?: { q: string; a: string }[]
  jsonld?: any | any[]
  noindex?: boolean
}

const abs = (u: string) => (u.startsWith('http') ? u : SITE_URL + (u.startsWith('/') ? u : '/' + u))
const canonOf = (path: string) => SITE_URL + (path === '/' ? '/' : path.replace(/\/+$/, ''))

const CRUMB_FIX: Record<string, string> = {
  kernelcms: 'KernelCMS', vs: 'vs', api: 'API', cli: 'CLI', rest: 'REST', graphql: 'GraphQL',
  '2fa': '2FA', nextjs: 'Next.js', faq: 'FAQ', seo: 'SEO', totp: 'TOTP', sqlite: 'SQLite', ai: 'AI',
}
function titleCaseSegment(seg: string) {
  return seg.split('-').map((w) => CRUMB_FIX[w] || w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
function autoBreadcrumb(path: string): { name: string; path: string }[] {
  const crumbs = [{ name: 'Home', path: '/' }]
  let acc = ''
  for (const seg of path.split('/').filter(Boolean)) {
    acc += '/' + seg
    crumbs.push({ name: titleCaseSegment(seg), path: acc })
  }
  return crumbs
}
function buildKeywords(title: string, extra?: string[]) {
  const lead = title.split(/[:|(]/)[0].trim() // e.g. "KernelCMS vs Payload"
  const set = new Set<string>([lead, ...(extra || []), ...BASE_KEYWORDS])
  return [...set].filter(Boolean).slice(0, 12).join(', ')
}

function upsert(create: () => HTMLElement, sel: string, attr: string, val: string) {
  let el = document.head.querySelector(sel) as HTMLElement | null
  if (!el) { el = create(); document.head.appendChild(el) }
  el.setAttribute(attr, val)
  return el
}
const meta = (key: 'name' | 'property', val: string, content: string) =>
  upsert(() => { const m = document.createElement('meta'); m.setAttribute(key, val); return m }, `meta[${key}="${val}"]`, 'content', content)
const link = (rel: string, href: string) =>
  upsert(() => { const l = document.createElement('link'); l.setAttribute('rel', rel); return l }, `link[rel="${rel}"]`, 'href', href)

export function useHead(title: string, description: string, opts: HeadOpts = {}) {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const o = JSON.stringify(opts)
  useEffect(() => {
    const canonical = canonOf(path)
    const type = opts.type || 'website'
    const image = abs(opts.image || '/og/default.png')
    const imageAlt = opts.imageAlt || title
    const robots = opts.noindex ? 'noindex, follow' : ROBOTS

    document.title = title
    meta('name', 'description', description)
    meta('name', 'keywords', buildKeywords(title, opts.keywords))
    meta('name', 'robots', robots)
    meta('name', 'googlebot', robots)
    link('canonical', canonical)

    // Open Graph
    meta('property', 'og:type', type)
    meta('property', 'og:site_name', SITE_NAME)
    meta('property', 'og:locale', 'en_US')
    meta('property', 'og:title', title)
    meta('property', 'og:description', description)
    meta('property', 'og:url', canonical)
    meta('property', 'og:image', image)
    meta('property', 'og:image:alt', imageAlt)
    meta('property', 'og:image:width', '1200')
    meta('property', 'og:image:height', '630')

    // Twitter
    meta('name', 'twitter:card', 'summary_large_image')
    meta('name', 'twitter:site', TWITTER)
    meta('name', 'twitter:creator', TWITTER)
    meta('name', 'twitter:title', title)
    meta('name', 'twitter:description', description)
    meta('name', 'twitter:image', image)
    meta('name', 'twitter:image:alt', imageAlt)

    // Article-specific OG
    const setArticle = (k: string, v?: string) => { if (v) meta('property', k, v) }
    if (type === 'article') {
      setArticle('article:published_time', opts.published)
      setArticle('article:modified_time', opts.modified || opts.published)
      setArticle('article:author', opts.author || SITE_NAME)
      setArticle('article:section', opts.section)
    }

    // JSON-LD graph: breadcrumb + main entity + optional FAQ + extras
    const crumbs = opts.breadcrumb || autoBreadcrumb(path)
    const graph: any[] = [
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem', position: i + 1, name: c.name, item: canonOf(c.path),
        })),
      },
    ]
    if (type === 'article') {
      graph.push({
        '@type': 'TechArticle',
        headline: title,
        description,
        image,
        url: canonical,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        author: { '@type': opts.author ? 'Person' : 'Organization', name: opts.author || SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: abs('/brand/kernelcms-icon.svg') } },
        ...(opts.published ? { datePublished: opts.published } : {}),
        ...(opts.modified || opts.published ? { dateModified: opts.modified || opts.published } : {}),
        ...(opts.section ? { articleSection: opts.section } : {}),
        keywords: buildKeywords(title, opts.keywords),
        inLanguage: 'en',
      })
    }
    if (opts.faq?.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: opts.faq.map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })
    }
    if (opts.jsonld) graph.push(...(Array.isArray(opts.jsonld) ? opts.jsonld : [opts.jsonld]))

    const ld = { '@context': 'https://schema.org', '@graph': graph }
    let script = document.getElementById('kc-jsonld') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script'); script.id = 'kc-jsonld'; script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(ld)
  }, [title, description, path, o])
}

// ⌘K command palette
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const openIt = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o) }
    }
    window.addEventListener('kcmdk', openIt)
    document.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('kcmdk', openIt); document.removeEventListener('keydown', onKey) }
  }, [])
  if (!open) return null
  return <Palette close={() => setOpen(false)} />
}

function Palette({ close }: { close: () => void }) {
  const navigate = useNavigate()
  const items = [
    { g: 'Pages', t: 'Home', to: '/', params: undefined, i: 'star' },
    { g: 'Pages', t: 'Documentation', to: '/docs', params: undefined, i: 'book' },
    { g: 'Pages', t: 'Guides', to: '/guides', params: undefined, i: 'compass' },
    { g: 'Pages', t: 'Blog', to: '/blog', params: undefined, i: 'feather' },
    { g: 'Pages', t: 'Prompts', to: '/prompts', params: undefined, i: 'sparkles' },
    ...DOCS.map((d: any) => ({ g: 'Docs', t: d.title, to: '/docs/$slug', params: { slug: d.slug }, i: 'hash' })),
    ...GUIDES.map((d: any) => ({ g: 'Guides', t: d.title, to: '/guides/$slug', params: { slug: d.slug }, i: 'compass' })),
    ...BLOG.map((d: any) => ({ g: 'Blog', t: d.title, to: '/blog/$slug', params: { slug: d.slug }, i: 'feather' })),
  ]
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const view = q ? items.filter((it) => it.t.toLowerCase().includes(q.toLowerCase()) || it.g.toLowerCase().includes(q.toLowerCase())) : items
  const go = (it: any) => { close(); navigate({ to: it.to, params: it.params }) }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, view.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
      if (e.key === 'Enter') { e.preventDefault(); view[active] && go(view[active]) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })
  let lastG = ''
  return (
    <div className="cmdk-overlay" onClick={(e) => { if (e.target === e.currentTarget) close() }}>
      <div className="cmdk" role="dialog" aria-modal="true">
        <div className="cmdk-input"><Icon name="search" /><input autoFocus placeholder="Search docs, guides, articles…" value={q} onChange={(e) => { setQ(e.target.value); setActive(0) }} /></div>
        <div className="cmdk-results">
          {view.map((it, i) => {
            const head = it.g !== lastG ? (lastG = it.g, <div className="cmdk-group" key={'g' + i}>{it.g}</div>) : null
            return <div key={i}>{head}<div className={`cmdk-item${i === active ? ' active' : ''}`} onClick={() => go(it)}><Icon name={it.i} /><span>{it.t}</span><span className="k">↵</span></div></div>
          })}
          {!view.length && <div className="cmdk-group">No results</div>}
        </div>
      </div>
    </div>
  )
}
