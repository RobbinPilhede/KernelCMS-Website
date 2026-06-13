/* eslint-disable */
// @ts-nocheck
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { highlight } from '../lib'
import { HOME_SEO } from '../content'
import { Icon, DemoPlayer, NpmStats, useHead, SITE_URL } from '../ui'
import { btn, btnPrimary, btnGhost } from '../cls'
import { BrandLogo, DARK_BRANDS } from '../brand-logos'

export const Route = createFileRoute('/')({ component: Home })

const wrap = 'w-full max-w-[var(--maxw)] mx-auto px-[clamp(18px,4vw,36px)]'

const HOME_JSONLD = [
  {
    '@type': 'SoftwareApplication',
    name: 'KernelCMS',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Node.js (Linux, macOS, Windows)',
    description: HOME_SEO.description,
    url: SITE_URL,
    softwareRequirements: 'Node.js 22+',
    license: 'https://opensource.org/licenses/MIT',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'KernelCMS', url: SITE_URL },
  },
  {
    '@type': 'VideoObject',
    name: 'Add a backend to any website with KernelCMS and Claude Code',
    description:
      'A developer pastes a prompt into Claude Code to add a backend to a website with KernelCMS. Claude models the content, creates a kernel.config.ts, installs KernelCMS, and wires the frontend to the API, then the no-code admin publishes a new item live.',
    thumbnailUrl: [SITE_URL + '/og/default.png'],
    uploadDate: '2026-06-13',
    contentUrl: SITE_URL + '/assets/video/demo.webm',
    embedUrl: SITE_URL + '/',
    publisher: { '@type': 'Organization', name: 'KernelCMS', url: SITE_URL },
  },
]
const eyebrow = 'font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] m-0 mb-5 [&_.c]:text-[var(--faint)]'
const leadH2 = 'text-[clamp(1.6rem,1.1rem+1.8vw,2.3rem)] font-semibold mt-3 tracking-[-0.025em]'

const Code = ({ src, lang }: { src: string; lang?: string }) => (
  <pre data-lang={lang}><code dangerouslySetInnerHTML={{ __html: highlight(src, lang) }} /></pre>
)

const SNIPPETS = {
  config: `import { defineConfig } from 'kernelcms'
import { sqliteAdapter } from 'kernelcms/sqlite'

export default defineConfig({
  secret: process.env.KERNEL_SECRET,
  db: sqliteAdapter({ url: 'file:./content.db' }),
  collections: [
    { slug: 'users', auth: true,
      fields: [{ name: 'name', type: 'text' }] },
    { slug: 'posts',
      access: { read: () => true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'author', type: 'relationship', relationTo: 'users' },
      ] },
  ],
})`,
  rest: `# Auto-generated REST, filtered + paginated + access-checked
GET /api/posts?where[status][equals]=published&sort=-createdAt&depth=1

{
  "docs": [
    { "id": "p_01", "title": "Hello", "author": { "name": "Ada" } }
  ],
  "totalDocs": 1,
  "page": 1
}`,
  local: `// The same operations in-process, fully typed, no HTTP hop
const post = await kernel.local.create({
  collection: 'posts',
  data: { title: 'Hello', body: '…', author: ada.id },
})

const list = await kernel.local.find({
  collection: 'posts',
  where: { status: { equals: 'published' } },
})`,
}

const MODULE = `export const comments = defineModule({
  name: 'comments',
  version: '1.0.0',
  collections: [
    { slug: 'comments', access: { read: () => true },
      fields: [/* … */] },
  ],
  endpoints: [
    defineEndpoint({
      method: 'POST', path: '/comments/:postId',
      access, handler,
    }),
  ],
  jobs: [{ slug: 'moderate-comments', handler }],
})`

const SPECS = [
  ['01', 'Config as code', 'Collections, globals, and 20+ field types in TypeScript, with end-to-end type inference.'],
  ['02', 'REST, GraphQL & a typed API', 'REST, GraphQL, and a typed in-process Local API from one model - identical operations and access rules.'],
  ['03', 'Swappable adapters', 'Database, storage, auth, email, cache, and search are swappable adapters. The core stays tiny.'],
  ['04', 'Secure by default', 'Deny-by-default access, row-level filters, field redaction, and a privilege-escalation guard.'],
  ['05', 'Migrations you trust', 'Diff-based, additive, deterministic. Preview every change before it touches the database.'],
  ['06', 'Built to extend', 'Typed endpoints, feature modules, background jobs, and custom admin components.'],
]
const COMPARE = [
  ['Framework coupling', 'None - web-standard Request → Response', 'Often welded to one framework'],
  ['Default database', 'SQLite via node:sqlite, zero native deps', 'Mongo or Postgres, heavier setup'],
  ['Install & cold start', 'Light and fast', 'Large dependency tree, slow boots'],
  ['Dev loop', 'npx kernel dev + inlined admin', 'A full framework build pipeline'],
  ['Migrations', 'Diff-based, risk-classified, deterministic', 'Frequently a pain point'],
  ['Deploy', 'One container, anywhere', 'Often tied to one host shape'],
  ['Heavy features', 'Optional adapters; core stays tiny', 'Batteries baked into the core'],
]

// Competitor CMSs we ship a "Migrate from X" skill for. Logos render monochrome
// and warm to the brand color on hover (reduced-motion users get the brand color
// without the transition). Payload's hex is pure black, so it stays on --text.
const MIGRATE_BRANDS: { slug: string; name: string; color: string }[] = [
  { slug: 'sanity', name: 'Sanity', color: '#F03E2F' },
  { slug: 'contentful', name: 'Contentful', color: '#2478CC' },
  { slug: 'strapi', name: 'Strapi', color: '#4945FF' },
  { slug: 'payload', name: 'Payload', color: '#000000' },
  { slug: 'wordpress', name: 'WordPress', color: '#21759B' },
  { slug: 'directus', name: 'Directus', color: '#6644FF' },
]

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

const Eyebrow = ({ children }: any) => <p className={eyebrow}><span className="c">//</span> {children}</p>

function Home() {
  useHead(HOME_SEO.title, HOME_SEO.description, {
    keywords: ['add a backend to any site', 'CMS for AI-generated sites', 'backend for v0 Lovable Bolt Cursor', 'agent-native CMS', 'best headless CMS'],
    jsonld: HOME_JSONLD,
  })
  const [tab, setTab] = useState('config')
  const langs = { config: 'ts', rest: 'http', local: 'ts' }
  return (
    <main>
      {/* HERO */}
      <section className="py-[clamp(52px,8vw,100px)] pb-[clamp(40px,6vw,80px)]"><div className={`${wrap} grid grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] gap-[clamp(32px,5vw,68px)] items-center max-[920px]:grid-cols-1`}>
        <div>
          <Eyebrow>backend &amp; cms for any website</Eyebrow>
          <h1 className="text-[clamp(2.1rem,1.3rem+2.7vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.03em] m-0">Add a backend to your website. <span className="text-[var(--muted)]">No code required.</span></h1>
          <p className="text-[var(--muted)] text-[clamp(15px,1vw,17px)] max-w-[48ch] mt-[22px] leading-[1.65]">KernelCMS gives any site - even one generated by AI with v0, Lovable, Bolt, or Cursor - a database, an API, and a no-code admin to edit it. Open-source, self-hosted, and ready in minutes.</p>
          <div className="flex items-center gap-3 mt-[30px] flex-wrap">
            <Link className={btnPrimary} to="/guides/$slug" params={{ slug: 'add-a-backend-to-any-site' }}><Icon name="bolt" /> Add a backend</Link>
            <button className={btnGhost} onClick={() => scrollToId('watch')}><Icon name="play" /> Watch the demo</button>
          </div>
          <p className="mt-7 font-[family-name:var(--mono)] text-[12.5px] text-[var(--faint)]">Open-source (MIT) · TypeScript · works with any frontend or AI-generated site</p>
        </div>
        <div><DemoPlayer url="localhost:3000/admin" caption="See how easy it is" base="demo" autoplay /></div>
      </div></section>

      {/* LIVE NPM STATS */}
      <section className="pb-[clamp(16px,3vw,40px)] -mt-2"><div className={wrap}>
        <NpmStats pkg="kernelcms" />
      </div></section>

      {/* STEPS */}
      <section className="py-[clamp(28px,4vw,52px)] relative"><div className={wrap}>
        <div className="max-w-[640px] mb-9"><Eyebrow>how it works</Eyebrow><h2 className={leadH2}>From a hardcoded page to fully editable, in three steps.</h2></div>
        <div className="grid grid-cols-3 gap-[18px] max-[760px]:grid-cols-1">
          {[
            ['1', 'Describe your content', 'List what is on your page - headings, text, images, and lists like posts or products - in one config file. Or let your AI assistant do it for you.'],
            ['2', 'Get an API and an admin', 'KernelCMS instantly builds a database, a REST and GraphQL API, and a polished admin panel from that description. No backend to write.'],
            ['3', 'Edit with no code', 'You and your team edit content live in the admin, with preview. Your site reads it from the API. No redeploys to change a word.'],
          ].map(([n, t, d], i, a) => (
            <div className="relative p-[28px_26px] rounded-[18px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-[border-color,transform] duration-200 hover:border-[color-mix(in_srgb,var(--primary)_28%,var(--border))] hover:-translate-y-[3px]" key={n}>
              <div className="grid place-items-center w-[38px] h-[38px] rounded-[11px] mb-4 bg-[var(--primary)] text-[var(--primary-fg)] font-bold text-base">{n}</div>
              <h3 className="text-[17px] font-semibold mb-[7px]">{t}</h3><p className="text-[var(--muted)] text-[14.5px] leading-[1.55] m-0">{d}</p>
              {i < a.length - 1 && <span className="absolute top-10 -right-[11px] z-[2] text-[var(--faint)] bg-[var(--bg)] rounded-full [&>svg]:w-[22px] [&>svg]:h-[22px] max-[760px]:hidden"><Icon name="arrow" /></span>}
            </div>
          ))}
        </div>
      </div></section>

      {/* WALKTHROUGH */}
      <section id="watch" className="py-[clamp(64px,9vw,128px)] pt-[clamp(20px,3vw,36px)] relative"><div className={`${wrap} max-w-[1040px]`}>
        <div className="text-center mx-auto max-w-[640px] mb-9"><Eyebrow>watch the walkthrough</Eyebrow><h2 className={leadH2}>See a real site get a backend in minutes.</h2></div>
        <DemoPlayer url="kernelcms.com · full walkthrough" caption="Watch the full walkthrough" base="walkthrough" />
      </div></section>

      {/* DEV SHOWCASE */}
      <section className="py-[clamp(64px,9vw,128px)] relative"><div className={wrap}>
        <div className="grid grid-cols-[1fr_1.15fr] gap-[clamp(28px,4vw,56px)] items-center max-[920px]:grid-cols-1">
          <div>
            <Eyebrow>for developers</Eyebrow>
            <h2 className={leadH2}>Prefer code? One typed config, three APIs.</h2>
            <p className="text-[var(--muted)] text-base mt-4 max-w-[52ch]">Define your model in <code>kernel.config.ts</code> and get REST, GraphQL, and a typed in-process Local API over the same access rules, with end-to-end TypeScript inference.</p>
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <Link className={btnPrimary} to="/docs/$slug" params={{ slug: 'quickstart' }}><Icon name="terminal" /> Quickstart</Link>
              <Link className={btnGhost} to="/docs">Read the docs <Icon name="arrow" /></Link>
            </div>
          </div>
          <div className="code">
            <div className="code-tabs"><div className="code-dots"><span className="code-dot" /><span className="code-dot" /><span className="code-dot" /></div>
              {['config', 'rest', 'local'].map((id) => (
                <button key={id} className={`code-tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>{id === 'config' ? 'kernel.config.ts' : id === 'rest' ? 'REST' : 'Local API'}</button>
              ))}
            </div>
            <div className="code-body"><Code src={SNIPPETS[tab]} lang={langs[tab]} /></div>
          </div>
        </div>
      </div></section>

      {/* DUO */}
      <section className="py-[clamp(64px,9vw,128px)] pt-0 relative"><div className={wrap}>
        <div className="max-w-[640px] mb-9"><Eyebrow>built for the whole team</Eyebrow><h2 className={leadH2}>Code stays code. Content stays editable.</h2><p className="text-[var(--muted)] text-base mt-3 max-w-[56ch]">Developers own the model in typed config, versioned in git. Editors change pages, copy, and media in a polished no-code admin with live preview and a page builder.</p></div>
        <div className="grid grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[14px] overflow-hidden max-[720px]:grid-cols-1">
          {[
            ['// for developers', 'Lives in code', ['The content model in a typed kernel.config.ts', 'Access rules, hooks, and computed fields', 'Deterministic migrations, reviewed in pull requests', 'End-to-end type inference and a typed client']],
            ['// for editors', 'Stays no-code', ['Edit pages, copy, and media with zero code', 'A blocks page builder for layouts', 'Live preview as you type', 'Drafts, version history, and scheduled publish']],
          ].map(([k, h, items]) => (
            <div key={h} className="bg-[var(--surface)] p-[30px_28px]">
              <span className="font-[family-name:var(--mono)] text-xs text-[var(--faint)]">{k}</span>
              <h3 className="text-lg font-semibold mt-3 mb-4">{h}</h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-[11px]">
                {(items as string[]).map((it) => <li key={it} className="flex gap-[11px] text-[14.5px] text-[var(--muted)] leading-[1.5] [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-[var(--text)] [&>svg]:flex-none [&>svg]:mt-[3px]"><Icon name="check" /> {it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div></section>

      {/* MIGRATE FROM ANYWHERE */}
      <section className="py-[clamp(56px,8vw,104px)] relative"><div className={wrap}>
        <div className="relative overflow-hidden border border-[var(--border)] rounded-[20px] bg-[var(--surface)] p-[clamp(28px,5vw,52px)]">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-[clamp(28px,5vw,64px)] items-center max-[860px]:grid-cols-1">
            <div>
              <Eyebrow>migrate from anywhere</Eyebrow>
              <h2 className={leadH2}>Bring your content. Keep your sanity.</h2>
              <p className="text-[var(--muted)] text-base mt-3 max-w-[52ch] text-pretty">
                Move from Sanity, Contentful, Strapi, Payload, WordPress, or Directus - mapped field-by-field and
                imported as drafts you review before anything goes live.
              </p>
              <div className="flex items-center gap-3 mt-6 flex-wrap">
                <Link className={btnPrimary} to="/prompts"><Icon name="branch" /> Migration prompts</Link>
                <Link className={btnGhost} to="/prompts">Browse all skills <Icon name="arrow" /></Link>
              </div>
            </div>

            <ul className="list-none p-0 m-0 grid grid-cols-3 gap-[clamp(10px,1.6vw,16px)] max-[420px]:grid-cols-2">
              {MIGRATE_BRANDS.map(({ slug, name, color }) => {
                const ink = DARK_BRANDS.has(slug) ? 'var(--text)' : color
                return (
                  <li key={slug}>
                    <Link
                      to="/prompts"
                      aria-label={`Migrate from ${name} to KernelCMS`}
                      title={`Migrate from ${name}`}
                      className="group grid place-items-center gap-[9px] min-h-[44px] py-[clamp(16px,2.4vw,22px)] px-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--faint)] transition-[color,border-color,background-color] duration-200 hover:border-[color-mix(in_srgb,var(--text)_18%,var(--border))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] [&_svg]:w-[clamp(26px,3vw,32px)] [&_svg]:h-[clamp(26px,3vw,32px)] [&_svg]:transition-colors [&_svg]:duration-200"
                      style={{ ['--brand' as any]: ink }}
                    >
                      <span className="text-[var(--faint)] group-hover:text-[var(--brand)] group-focus-visible:text-[var(--brand)] motion-reduce:text-[var(--brand)]">
                        <BrandLogo slug={slug} title={name} />
                      </span>
                      <span className="font-[family-name:var(--mono)] text-[11px] tracking-[0.02em] text-[var(--faint)] group-hover:text-[var(--muted)]">{name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div></section>

      {/* SPECS */}
      <section className="py-[clamp(64px,9vw,128px)] relative"><div className={wrap}>
        <div className="max-w-[640px] mb-9"><Eyebrow>what you get</Eyebrow><h2 className={leadH2}>One config file. Your whole headless CMS backend, generated.</h2></div>
        <div className="grid grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[14px] overflow-hidden max-[920px]:grid-cols-2 max-[560px]:grid-cols-1">
          {SPECS.map(([n, t, d]) => <div className="bg-[var(--surface)] p-[26px_24px] transition-colors hover:bg-[var(--surface-2)]" key={n}><span className="font-[family-name:var(--mono)] text-xs text-[var(--faint)]">{n}</span><h3 className="text-base font-semibold mt-4 mb-2">{t}</h3><p className="text-[var(--muted)] text-sm leading-[1.55] m-0 text-pretty">{d}</p></div>)}
        </div>
      </div></section>

      {/* BUILD YOUR OWN */}
      <section className="py-[clamp(64px,9vw,128px)] relative"><div className={wrap}>
        <div className="grid grid-cols-[1fr_1.15fr] gap-[clamp(28px,4vw,56px)] items-center max-[920px]:grid-cols-1">
          <div className="code">
            <div className="code-tabs"><div className="code-dots"><span className="code-dot" /><span className="code-dot" /><span className="code-dot" /></div><span className="code-tab active">comments.module.ts</span></div>
            <div className="code-body"><Code src={MODULE} lang="ts" /></div>
          </div>
          <div>
            <Eyebrow>build your own</Eyebrow>
            <h2 className={leadH2}>When CRUD isn't enough, you don't drop down a layer.</h2>
            <p className="text-[var(--muted)] text-base mt-4 max-w-[52ch]">Add typed endpoints, computed fields, and whole feature modules - a collection, endpoints, and jobs bundled into one conflict-checked unit. Same access pipeline, same validation, auto-documented.</p>
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <Link className={btn} to="/docs/$slug" params={{ slug: 'modules' }}>Modules <Icon name="arrow" /></Link>
              <Link className={btnGhost} to="/docs/$slug" params={{ slug: 'custom-endpoints' }}>Custom endpoints</Link>
            </div>
          </div>
        </div>
      </div></section>

      {/* COMPARE + CLOSER */}
      <section className="py-[clamp(64px,9vw,128px)] pt-[clamp(40px,6vw,72px)] relative"><div className={wrap}>
        <div className="max-w-[640px] mb-9"><Eyebrow>how it compares</Eyebrow><h2 className={leadH2}>Most headless CMSs make you adopt their whole world.</h2><p className="text-[var(--muted)] text-base mt-3 max-w-[56ch]">KernelCMS doesn't. Here is the difference, line by line.</p></div>
        <table className="compare"><thead><tr><th></th><th className="us">KernelCMS</th><th>Typical heavyweight CMS</th></tr></thead><tbody>
          {COMPARE.map(([dim, us, them]) => (
            <tr key={dim}><td>{dim}</td><td className="us-col"><span className="chk yes"><Icon name="check" /> {us}</span></td><td className="meh">{them}</td></tr>
          ))}
        </tbody></table>
        <div className="flex items-center justify-between gap-7 py-11 mt-0 border-t border-[var(--border)] flex-wrap">
          <div><h2 className="text-[clamp(1.4rem,1rem+1.6vw,2rem)] font-semibold m-0 tracking-[-0.02em]">Ready in three steps.</h2><p className="text-[var(--muted)] mt-2">Install, write a config, run <code className="font-[family-name:var(--mono)] text-[0.85em]">npx kernel dev</code>.</p></div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link className={btnPrimary} to="/docs/$slug" params={{ slug: 'quickstart' }}>Read the quickstart</Link>
            <a className={btnGhost} href="https://github.com/RobbinPilhede/KernelCMS" target="_blank" rel="noopener"><Icon name="github" /> GitHub</a>
          </div>
        </div>
      </div></section>
    </main>
  )
}
