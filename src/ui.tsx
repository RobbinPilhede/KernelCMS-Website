/* eslint-disable */
// @ts-nocheck -- UI components ported from the vanilla site
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ICONS } from './icons'
import { markSVG, coverSVG, highlight, getTheme, applyTheme } from './lib'
import { DOCS, GUIDES, BLOG } from './content'

const html = (s: string) => ({ __html: s })

export function Icon({ name }: { name: string }) {
  return <span style={{ display: 'inline-flex' }} dangerouslySetInnerHTML={html(ICONS[name] || '')} />
}
export function Mark({ cls }: { cls?: string }) {
  return <span style={{ display: 'inline-flex' }} dangerouslySetInnerHTML={html(markSVG(cls))} />
}
export function Logo() {
  return (
    <Link to="/" className="logo">
      <Mark />
      <span className="logo-word">Kernel<b>CMS</b></span>
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
const openCmdk = () => window.dispatchEvent(new Event('kcmdk'))

export function Topbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`topbar${scrolled ? ' scrolled' : ''}`} id="topbar">
      <div className="topbar-inner">
        <Logo />
        <nav className="nav-links">
          <Link to="/docs" activeProps={{ className: 'active' }}>Docs</Link>
          <Link to="/guides" activeProps={{ className: 'active' }}>Guides</Link>
          <Link to="/blog" activeProps={{ className: 'active' }}>Blog</Link>
        </nav>
        <div className="nav-spacer" />
        <div className="nav-actions">
          <button className="cmdk-trigger" onClick={openCmdk}><Icon name="search" /><span className="label">Search</span><kbd>⌘K</kbd></button>
          <ThemeToggle />
          <a className="icon-link" href={GITHUB} target="_blank" rel="noopener" aria-label="GitHub"><Icon name="github" /></a>
          <Link className="btn primary sm" to="/docs/$slug" params={{ slug: 'quickstart' }}>Get started</Link>
          <button className="icon-link nav-toggle" onClick={() => setOpen(true)} aria-label="Menu"><Icon name="menu" /></button>
        </div>
      </div>
      {open && (
        <div className="drawer open" onClick={(e) => { if ((e.target as HTMLElement).closest('[data-close]') || (e.target as HTMLElement).classList.contains('drawer-scrim')) setOpen(false) }}>
          <div className="drawer-scrim" />
          <div className="drawer-panel">
            <Link to="/docs" data-close>Docs</Link>
            <Link to="/guides" data-close>Guides</Link>
            <Link to="/blog" data-close>Blog</Link>
            <Link to="/docs/$slug" params={{ slug: 'quickstart' }} className="btn primary" data-close style={{ marginTop: 8, justifyContent: 'center' }}>Get started</Link>
            <a href={GITHUB} target="_blank" rel="noopener" data-close>GitHub ↗</a>
          </div>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  const col = (h: string, links: [string, any][]) => (
    <div className="footer-col" key={h}>
      <h4>{h}</h4>
      {links.map(([label, to]) =>
        typeof to === 'string' && to.startsWith('http')
          ? <a key={label} href={to}>{label}</a>
          : <Link key={label} to={to.to} params={to.params}>{label}</Link>)}
    </div>
  )
  const L = (to: string, params?: any) => ({ to, params })
  return (
    <footer className="footer"><div className="wrap">
      <div className="footer-grid">
        <div className="footer-brand"><Logo /><p>The lightweight, standalone, type-safe headless CMS that does not hijack your framework.</p></div>
        {col('Product', [['Features', L('/')], ['Docs', L('/docs')], ['Guides', L('/guides')], ['Quickstart', L('/docs/$slug', { slug: 'quickstart' })]])}
        {col('Resources', [['Blog', L('/blog')], ['Adapters', L('/docs/$slug', { slug: 'adapters' })], ['CLI', L('/docs/$slug', { slug: 'cli' })], ['API reference', L('/docs/$slug', { slug: 'rest-api' })]])}
        {col('Develop', [['Modules', L('/docs/$slug', { slug: 'modules' })], ['Access control', L('/docs/$slug', { slug: 'access-control' })], ['Migrations', L('/docs/$slug', { slug: 'migrations' })], ['Embedding', L('/guides/$slug', { slug: 'embed-nextjs' })]])}
        {col('Community', [['GitHub', GITHUB], ['llms.txt', 'https://kernelcms.com/llms.txt'], ['Sitemap', 'https://kernelcms.com/sitemap.xml']])}
      </div>
      <div className="footer-bottom"><span>© 2026 KernelCMS · MIT licensed core</span><span>Built on web standards · Runs on Node, edge, any container</span></div>
    </div></footer>
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

export function CoverArt({ kind, label }: { kind?: string; label?: boolean }) {
  return <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={html(coverSVG(kind, { label }))} />
}

export function DemoPlayer({ url, caption, base, autoplay }: { url: string; caption: string; base: string; autoplay?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
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
    <div className="demo" ref={ref}>
      <div className="demo-chrome"><span /><span /><span /><div className="demo-url">{url}</div></div>
      <div className="demo-stage">
        <video className="demo-video" muted loop playsInline preload={autoplay ? 'auto' : 'metadata'} autoPlay={autoplay}>
          <source src={`/assets/video/${base}.webm`} type="video/webm" />
          <source src={`/assets/video/${base}.mp4`} type="video/mp4" />
        </video>
        <span className="demo-badge">DEMO</span>
        <div className="demo-poster">
          <div className="demo-poster-art" />
          <button className="demo-play" aria-label="Play the demo video"><Icon name="play" /></button>
          <div className="demo-cap">{caption}</div>
        </div>
      </div>
    </div>
  )
}

// Set document title + meta description per route (SPA head management)
export function useHead(title: string, description: string) {
  useEffect(() => {
    document.title = title
    const set = (sel: string, attr: string, val: string) => {
      let el = document.head.querySelector(sel) as HTMLMetaElement | null
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr.split('=')[0], attr.split('=')[1]); document.head.appendChild(el) }
      el.setAttribute('content', val)
    }
    set('meta[name="description"]', 'name=description', description)
    set('meta[property="og:title"]', 'property=og:title', title)
    set('meta[property="og:description"]', 'property=og:description', description)
  }, [title, description])
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
