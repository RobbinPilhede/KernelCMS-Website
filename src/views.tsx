/* eslint-disable */
// @ts-nocheck
import { Link } from '@tanstack/react-router'
import { DOCS, GUIDES, BLOG, seoMeta, articleTop, articleBottom, BLOG_INDEX_SEO, GUIDES_INDEX_SEO, DOCS_INDEX_SEO } from './content'
import { Prose, CoverArt, Icon, useHead } from './ui'

const Dot = () => <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />

function Card({ to, params, tag, title, excerpt, meta, cover, featured, eyebrow }: any) {
  const thumb = <div className="card-thumb"><CoverArt kind={cover} /></div>
  if (featured) {
    return (
      <Link className="card card-feature" to={to} params={params}>
        {thumb}
        <div className="card-body">
          <span className="card-eyebrow">{eyebrow}</span>
          <h3>{title}</h3><p>{excerpt}</p>
          <div className="card-meta"><span>{meta}</span></div>
          <span className="card-cta">Read more <Icon name="arrow" /></span>
        </div>
      </Link>
    )
  }
  return (
    <Link className="card" to={to} params={params}>
      {thumb}
      <div className="card-body"><span className="card-tag">{tag}</span><h3>{title}</h3><p>{excerpt}</p>
        <div className="card-meta"><span>{meta}</span></div></div>
    </Link>
  )
}

// ---- Docs -------------------------------------------------------------------
export function DocPage({ slug }: { slug: string }) {
  const idx = Math.max(0, DOCS.findIndex((d: any) => d.slug === slug))
  const d = DOCS[idx]
  const meta = seoMeta(d, 'doc')
  useHead(meta.title, meta.description)
  const groups: Record<string, any[]> = {}
  DOCS.forEach((x: any) => { (groups[x.group] = groups[x.group] || []).push(x) })
  const prev = DOCS[idx - 1], next = DOCS[idx + 1]
  const toc = [...d.html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map((m: any) => ({ id: m[1], text: m[2] }))
  return (
    <div className="wrap"><div className="doc-layout">
      <aside className="doc-aside"><nav className="doc-nav">
        {Object.keys(groups).map((g) => (
          <div className="doc-nav-group" key={g}><span>{g}</span>
            {groups[g].map((x: any) => (
              <Link key={x.slug} to="/docs/$slug" params={{ slug: x.slug }} className={x.slug === slug ? 'active' : ''}>{x.nav}</Link>
            ))}
          </div>
        ))}
      </nav></aside>
      <article className="doc-main">
        <div className="crumbs">Docs · {d.group}</div>
        <h1>{d.title}</h1><p className="doc-lead">{d.lead}</p>
        <Prose content={d.html} />
        <div className="doc-pager">
          {prev ? <Link className="prev" to="/docs/$slug" params={{ slug: prev.slug }}><div className="small">← Previous</div><div className="big">{prev.nav}</div></Link> : <span />}
          {next ? <Link className="next" to="/docs/$slug" params={{ slug: next.slug }}><div className="small">Next →</div><div className="big">{next.nav}</div></Link> : <span />}
        </div>
      </article>
      {toc.length > 0 && (
        <aside className="doc-toc"><span>On this page</span>{toc.map((h: any) => <a key={h.id} href={'#' + h.id}>{h.text}</a>)}</aside>
      )}
    </div></div>
  )
}

// ---- Guides -----------------------------------------------------------------
export function GuidesIndex() {
  useHead(GUIDES_INDEX_SEO.title, GUIDES_INDEX_SEO.description)
  const [first, ...rest] = GUIDES
  return (
    <main><section className="section index-section"><div className="wrap">
      <div className="section-head left" style={{ maxWidth: 760, marginBottom: 44 }}>
        <p className="mono-eyebrow"><span className="c">//</span> guides</p>
        <h1 className="section-title" style={{ textAlign: 'left' }}>KernelCMS guides &amp; tutorials</h1>
        <p className="section-sub" style={{ marginInline: 0 }}>Focused, end-to-end walkthroughs for the things teams actually build - from adding a backend to any site to deploying in production.</p>
      </div>
      <div className="card-grid">
        <Card featured to="/guides/$slug" params={{ slug: first.slug }} cover="brand" title={first.title} excerpt={first.excerpt} meta={first.read} eyebrow={'Featured · ' + first.tag} />
        {rest.map((g: any) => <Card key={g.slug} to="/guides/$slug" params={{ slug: g.slug }} cover="brand" tag={g.tag} title={g.title} excerpt={g.excerpt} meta={g.read} />)}
      </div>
    </div></section></main>
  )
}

export function GuideReader({ slug }: { slug: string }) {
  const g = GUIDES.find((x: any) => x.slug === slug) || GUIDES[0]
  const meta = seoMeta(g, 'guide')
  useHead(meta.title, meta.description)
  const toc = [...g.html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map((m: any) => ({ id: m[1], text: m[2] }))
  return (
    <div className="wrap"><div className="doc-layout"><div />
      <article className="doc-main">
        <div className="crumbs"><Link to="/guides">Guides</Link> · {g.tag}</div>
        <h1>{g.title}</h1><p className="doc-lead">{g.excerpt}</p>
        <Prose content={g.html} />
        <div className="doc-pager"><Link className="prev" to="/guides"><div className="small">← All guides</div><div className="big">Back to guides</div></Link><span /></div>
      </article>
      {toc.length > 0 && <aside className="doc-toc"><span>On this page</span>{toc.map((h: any) => <a key={h.id} href={'#' + h.id}>{h.text}</a>)}</aside>}
    </div></div>
  )
}

// ---- Blog -------------------------------------------------------------------
export function BlogIndex() {
  useHead(BLOG_INDEX_SEO.title, BLOG_INDEX_SEO.description)
  const [first, ...rest] = BLOG
  return (
    <main><section className="section index-section"><div className="wrap">
      <div className="section-head left" style={{ maxWidth: 760, marginBottom: 44 }}>
        <p className="mono-eyebrow"><span className="c">//</span> blog</p>
        <h1 className="section-title" style={{ textAlign: 'left' }}>Headless CMS comparisons &amp; engineering notes</h1>
        <p className="section-sub" style={{ marginInline: 0 }}>KernelCMS vs Payload, Sanity, Strapi, Contentful, and Directus, compared with hard facts and code - plus engineering decisions and where headless content is going.</p>
      </div>
      <div className="card-grid">
        <Card featured to="/blog/$slug" params={{ slug: first.slug }} cover={first.cover} title={first.title} excerpt={first.excerpt} meta={first.read + ' · ' + first.date} eyebrow={'Featured · ' + first.tag} />
        {rest.map((b: any) => <Card key={b.slug} to="/blog/$slug" params={{ slug: b.slug }} cover={b.cover} tag={b.tag} title={b.title} excerpt={b.excerpt} meta={b.read + ' · ' + b.date} />)}
      </div>
    </div></section></main>
  )
}

export function ArticleReader({ slug }: { slug: string }) {
  const b = BLOG.find((x: any) => x.slug === slug) || BLOG[0]
  const meta = seoMeta(b, 'article')
  useHead(meta.title, meta.description)
  return (
    <main><div className="wrap">
      <div className="article-head">
        <div className="card-tag">{b.tag}</div><h1>{b.title}</h1>
        <div className="byline"><span>{b.author}</span><Dot /><span>{b.date}</span><Dot /><span>{b.read} read</span></div>
      </div>
      <div className="article-hero"><CoverArt kind={b.cover} label={false} /></div>
      <Prose className="article-body prose" content={articleTop(b) + b.html + articleBottom(b)} />
      <div className="wrap" style={{ maxWidth: 840, marginTop: 48, textAlign: 'center' }}><Link className="btn ghost" to="/blog"><Icon name="arrowLeft" /> All articles</Link></div>
    </div></main>
  )
}

export { DOCS_INDEX_SEO }
