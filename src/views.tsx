/* eslint-disable */
// @ts-nocheck
import { Link } from '@tanstack/react-router'
import { DOCS, GUIDES, BLOG, seoMeta, articleTop, articleBottom, BLOG_INDEX_SEO, GUIDES_INDEX_SEO, DOCS_INDEX_SEO } from './content'
import { Prose, CoverArt, Icon, useHead } from './ui'

const wrap = 'w-full max-w-[var(--maxw)] mx-auto px-[clamp(18px,4vw,36px)]'
const eyebrow = 'font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] m-0 mb-2 [&_.c]:text-[var(--faint)]'
const Dot = () => <span className="w-[3px] h-[3px] rounded-full bg-current inline-block" />

function Card({ to, params, tag, title, excerpt, meta, cover, featured, eyebrow: ey }: any) {
  const base = 'group overflow-hidden cursor-pointer bg-[var(--surface)] border border-[var(--border)] transition-[border-color,transform,box-shadow] duration-200 hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:-translate-y-[3px] hover:shadow-[0_18px_50px_-30px_color-mix(in_srgb,var(--primary)_70%,transparent)]'
  if (featured) {
    return (
      <Link to={to} params={params} className={`${base} col-[1/-1] grid grid-cols-1 min-[860px]:grid-cols-[1.15fr_1fr] items-stretch rounded-[24px] mb-2`}>
        <div className="card-thumb !aspect-auto min-h-[320px] max-[860px]:min-h-[220px]"><CoverArt kind={cover} alt={`${title} - cover art`} /></div>
        <div className="flex flex-col justify-center gap-[14px] p-[clamp(28px,4vw,48px)]">
          <span className="font-[family-name:var(--mono)] text-xs text-[var(--faint)]">{ey}</span>
          <h3 className="text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-semibold tracking-[-0.02em] leading-tight">{title}</h3>
          <p className="text-base text-[var(--muted)] text-pretty">{excerpt}</p>
          <div className="flex items-center gap-[10px] text-[13px] text-[var(--faint)] mt-[6px]"><span>{meta}</span></div>
          <span className="inline-flex items-center gap-2 mt-[6px] font-semibold text-sm text-[var(--text)] [&>svg]:w-4 [&>svg]:h-4 [&>svg]:transition-transform group-hover:[&>svg]:translate-x-1">Read more <Icon name="arrow" /></span>
        </div>
      </Link>
    )
  }
  return (
    <Link to={to} params={params} className={`${base} flex flex-col rounded-[18px]`}>
      <div className="card-thumb"><CoverArt kind={cover} alt={`${title} - cover art`} /></div>
      <div className="flex flex-col gap-[11px] p-6 pb-[26px]">
        <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--muted)]">{tag}</span>
        <h3 className="text-[19px] font-semibold leading-[1.25]">{title}</h3>
        <p className="text-[14.5px] leading-[1.5] text-[var(--muted)] text-pretty flex-1">{excerpt}</p>
        <div className="flex items-center gap-[10px] text-[13px] text-[var(--faint)]"><span>{meta}</span></div>
      </div>
    </Link>
  )
}

const cardGrid = 'grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-[26px]'

// ---- Docs -------------------------------------------------------------------
export function DocPage({ slug }: { slug: string }) {
  const idx = Math.max(0, DOCS.findIndex((d: any) => d.slug === slug))
  const d = DOCS[idx]
  const meta = seoMeta(d, 'doc')
  useHead(meta.title, meta.description, { type: 'article', section: 'Documentation', keywords: [d.title, 'KernelCMS docs'] })
  const groups: Record<string, any[]> = {}
  DOCS.forEach((x: any) => { (groups[x.group] = groups[x.group] || []).push(x) })
  const prev = DOCS[idx - 1], next = DOCS[idx + 1]
  const toc = [...d.html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map((m: any) => ({ id: m[1], text: m[2] }))
  const navItem = 'block px-[11px] py-[7px] rounded-lg text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)]'
  const pager = 'flex-1 px-[18px] py-4 border border-[var(--border)] rounded-xl transition-[border-color,transform] duration-150 hover:border-[color-mix(in_srgb,var(--text)_24%,var(--border))] hover:-translate-y-[2px]'
  return (
    <div className={wrap}>
      <div className="grid grid-cols-[240px_minmax(0,1fr)_200px] gap-[clamp(24px,4vw,56px)] items-start pt-12 pb-24 max-[1080px]:grid-cols-[220px_minmax(0,1fr)] max-[720px]:grid-cols-1">
        <aside className="sticky top-[84px] max-h-[calc(100vh-100px)] overflow-y-auto pr-2 max-[720px]:hidden">
          <nav>
            {Object.keys(groups).map((g) => (
              <div className="mb-[22px]" key={g}>
                <span className="block text-[11px] uppercase tracking-[0.08em] text-[var(--muted)] px-[10px] mb-1">{g}</span>
                {groups[g].map((x: any) => (
                  <Link key={x.slug} to="/docs/$slug" params={{ slug: x.slug }} className={`${navItem} ${x.slug === slug ? '!text-[var(--text)] font-semibold bg-[color-mix(in_srgb,var(--text)_8%,transparent)]' : ''}`}>{x.nav}</Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>
        <article className="min-w-0">
          <div className="text-[13px] text-[var(--muted)] mb-4">Docs · {d.group}</div>
          <h1 className="text-[clamp(2rem,1.4rem+2vw,2.8rem)] font-semibold mb-2">{d.title}</h1>
          <p className="text-lg text-[var(--muted)] mb-9 text-pretty">{d.lead}</p>
          <Prose content={d.html} />
          <div className="flex justify-between gap-4 mt-16 pt-7 border-t border-[var(--border)]">
            {prev ? <Link className={pager} to="/docs/$slug" params={{ slug: prev.slug }}><div className="text-xs text-[var(--muted)]">← Previous</div><div className="font-semibold mt-[3px]">{prev.nav}</div></Link> : <span />}
            {next ? <Link className={`${pager} text-right`} to="/docs/$slug" params={{ slug: next.slug }}><div className="text-xs text-[var(--muted)]">Next →</div><div className="font-semibold mt-[3px]">{next.nav}</div></Link> : <span />}
          </div>
        </article>
        {toc.length > 0 && (
          <aside className="sticky top-[84px] self-start text-[13px] max-[1080px]:hidden">
            <span className="block uppercase tracking-[0.08em] text-[11px] text-[var(--muted)] mb-3">On this page</span>
            {toc.map((h: any) => <a key={h.id} href={'#' + h.id} className="block py-[5px] pl-3 text-[var(--muted)] border-l-2 border-[var(--border)] transition-colors hover:text-[var(--text)] hover:border-l-[var(--text)]">{h.text}</a>)}
          </aside>
        )}
      </div>
    </div>
  )
}

// ---- Guides -----------------------------------------------------------------
function IndexHead({ kicker, title, sub }: any) {
  return (
    <div className="max-w-[760px] mb-11">
      <p className={eyebrow}><span className="c">//</span> {kicker}</p>
      <h1 className="text-[clamp(1.9rem,1.2rem+2.6vw,3rem)] font-semibold tracking-[-0.025em] mt-3">{title}</h1>
      <p className="text-[var(--muted)] text-[clamp(15px,1.1vw,18px)] mt-3 text-pretty">{sub}</p>
    </div>
  )
}
const indexSection = `${wrap} pt-[clamp(40px,6vw,72px)] pb-[clamp(56px,9vw,110px)]`

export function GuidesIndex() {
  useHead(GUIDES_INDEX_SEO.title, GUIDES_INDEX_SEO.description, { keywords: ['KernelCMS guides', 'headless CMS tutorial', 'add a backend'] })
  const [first, ...rest] = GUIDES
  return (
    <main><section><div className={indexSection}>
      <IndexHead kicker="guides" title="KernelCMS guides & tutorials" sub="Focused, end-to-end walkthroughs for the things teams actually build - from adding a backend to any site to deploying in production." />
      <div className={cardGrid}>
        <Card featured to="/guides/$slug" params={{ slug: first.slug }} cover="brand" title={first.title} excerpt={first.excerpt} meta={first.read} eyebrow={'Featured · ' + first.tag} />
        {rest.map((g: any) => <Card key={g.slug} to="/guides/$slug" params={{ slug: g.slug }} cover="brand" tag={g.tag} title={g.title} excerpt={g.excerpt} meta={g.read} />)}
      </div>
    </div></section></main>
  )
}

function Reader({ kicker, tag, title, lead, html, back }: any) {
  const toc = [...html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map((m: any) => ({ id: m[1], text: m[2] }))
  return (
    <div className={wrap}>
      <div className="grid grid-cols-[240px_minmax(0,1fr)_200px] gap-[clamp(24px,4vw,56px)] items-start pt-12 pb-24 max-[1080px]:grid-cols-[1fr] ">
        <div className="max-[1080px]:hidden" />
        <article className="min-w-0">
          <div className="text-[13px] text-[var(--muted)] mb-4">{kicker} · {tag}</div>
          <h1 className="text-[clamp(2rem,1.4rem+2vw,2.8rem)] font-semibold mb-2">{title}</h1>
          <p className="text-lg text-[var(--muted)] mb-9 text-pretty">{lead}</p>
          <Prose content={html} />
          <div className="flex justify-between gap-4 mt-16 pt-7 border-t border-[var(--border)]">{back}<span /></div>
        </article>
        {toc.length > 0 && (
          <aside className="sticky top-[84px] self-start text-[13px] max-[1080px]:hidden">
            <span className="block uppercase tracking-[0.08em] text-[11px] text-[var(--muted)] mb-3">On this page</span>
            {toc.map((h: any) => <a key={h.id} href={'#' + h.id} className="block py-[5px] pl-3 text-[var(--muted)] border-l-2 border-[var(--border)] transition-colors hover:text-[var(--text)] hover:border-l-[var(--text)]">{h.text}</a>)}
          </aside>
        )}
      </div>
    </div>
  )
}

export function GuideReader({ slug }: { slug: string }) {
  const g = GUIDES.find((x: any) => x.slug === slug) || GUIDES[0]
  const meta = seoMeta(g, 'guide')
  useHead(meta.title, meta.description, { type: 'article', section: 'Guide', faq: g.faq, keywords: [g.title, g.tag] })
  return <Reader kicker={<Link to="/guides" className="hover:text-[var(--text)]">Guides</Link>} tag={g.tag} title={g.title} lead={g.excerpt} html={g.html}
    back={<Link className="px-[18px] py-4 border border-[var(--border)] rounded-xl flex-1 hover:border-[color-mix(in_srgb,var(--text)_24%,var(--border))]" to="/guides"><div className="text-xs text-[var(--muted)]">← All guides</div><div className="font-semibold mt-[3px]">Back to guides</div></Link>} />
}

// ---- Blog -------------------------------------------------------------------
export function BlogIndex() {
  useHead(BLOG_INDEX_SEO.title, BLOG_INDEX_SEO.description, { keywords: ['headless CMS comparison', 'KernelCMS vs Payload', 'KernelCMS vs Sanity', 'best headless CMS'] })
  const [first, ...rest] = BLOG
  return (
    <main><section><div className={indexSection}>
      <IndexHead kicker="blog" title="Headless CMS comparisons & engineering notes" sub="KernelCMS vs Payload, Sanity, Strapi, Contentful, and Directus, compared with hard facts and code - plus engineering decisions and where headless content is going." />
      <div className={cardGrid}>
        <Card featured to="/blog/$slug" params={{ slug: first.slug }} cover={first.cover} title={first.title} excerpt={first.excerpt} meta={first.read + ' · ' + first.date} eyebrow={'Featured · ' + first.tag} />
        {rest.map((b: any) => <Card key={b.slug} to="/blog/$slug" params={{ slug: b.slug }} cover={b.cover} tag={b.tag} title={b.title} excerpt={b.excerpt} meta={b.read + ' · ' + b.date} />)}
      </div>
    </div></section></main>
  )
}

export function ArticleReader({ slug }: { slug: string }) {
  const b = BLOG.find((x: any) => x.slug === slug) || BLOG[0]
  const meta = seoMeta(b, 'article')
  // Parse "Jun 11, 2026" as a UTC calendar date so datePublished doesn't drift a day.
  let published: string | undefined
  try { published = new Date(b.date + ' UTC').toISOString() } catch { published = undefined }
  useHead(meta.title, meta.description, {
    type: 'article', section: b.tag, author: b.author, published,
    image: `/og/${b.slug}.png`, imageAlt: b.title, keywords: [b.title, b.tag, 'headless CMS comparison'],
  })
  return (
    <main><div className={wrap}>
      <div className="max-w-[820px] mx-auto text-center pt-6 pb-2">
        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--muted)]">{b.tag}</div>
        <h1 className="text-[clamp(2rem,1.3rem+3vw,3.4rem)] font-semibold my-4">{b.title}</h1>
        <div className="flex items-center justify-center gap-[10px] text-[var(--muted)] text-sm"><span>{b.author}</span><Dot /><span>{b.date}</span><Dot /><span>{b.read} read</span></div>
      </div>
      <div className="article-hero max-w-[1000px] mx-auto my-10 aspect-[21/9] rounded-[24px] overflow-hidden relative border border-[var(--border)] bg-[#0c0d10]"><CoverArt kind={b.cover} label={false} alt={`${b.title} - article cover image`} /></div>
      <Prose className="prose max-w-[840px] mx-auto mt-10" content={articleTop(b) + b.html + articleBottom(b)} />
      <div className={`${wrap} max-w-[840px] mt-12 text-center`}><Link className="inline-flex items-center gap-2 px-[18px] py-[11px] rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-sm font-semibold hover:border-[color-mix(in_srgb,var(--text)_26%,var(--border))] [&>svg]:w-4 [&>svg]:h-4" to="/blog"><Icon name="arrowLeft" /> All articles</Link></div>
    </div></main>
  )
}

export { DOCS_INDEX_SEO }
