/* eslint-disable */
// @ts-nocheck
//
// Prompts & agent skills - a browsable library of the "KernelCMS Skills"
// knowledge base. The catalog below is SYNCED from the KernelCMS-Skills repo:
//
//   https://github.com/RobbinPilhede/KernelCMS-Skills
//
// To refresh it, run `node scripts/build-catalog.mjs` in that repo and copy the
// generated catalog.json over src/data/prompts-catalog.json (vite imports JSON).
//
// SSG note: every skill card is rendered unconditionally so the full library is
// present in the prerendered HTML (tools/prerender.mjs captures the DOM). The
// client only *enhances* - search + category filter toggle visibility of cards
// that are already in the markup, and the copy / preview actions hydrate on top.
//
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon, useHead } from '../ui'
import { btnPrimary, btnGhost } from '../cls'
import catalog from '../data/prompts-catalog.json'

export const Route = createFileRoute('/prompts')({ component: Prompts })

const REPO = 'https://github.com/RobbinPilhede/KernelCMS-Skills'
const blob = (p: string) => `${REPO}/blob/main/${p}`

const wrap = 'w-full max-w-[var(--maxw)] mx-auto px-[clamp(18px,4vw,36px)]'
const eyebrow = 'font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] m-0 [&_.c]:text-[var(--faint)]'
const Eyebrow = ({ children }: any) => <p className={eyebrow}><span className="c">//</span> {children}</p>

const inlineCode = 'font-[family-name:var(--mono)] text-[0.88em] px-[5px] py-px rounded bg-[color-mix(in_srgb,var(--text)_8%,transparent)]'
const sectionTitle = 'text-[clamp(1.5rem,1.1rem+1.5vw,2.1rem)] font-semibold tracking-[-0.025em] mt-3'
const card = 'border border-[var(--border)] rounded-[14px] bg-[var(--surface)] overflow-hidden'
const link = 'text-[var(--text)] underline underline-offset-[3px] decoration-[var(--border)] hover:decoration-[var(--text)]'

type Skill = {
  name: string; title: string; description: string; category: string
  tags: string[]; difficulty: 'starter' | 'intermediate' | 'advanced'; path: string; prompt: string
}
const SKILLS: Skill[] = catalog.skills
const CATEGORIES: string[] = [...catalog.categories].sort()

// Icon + accent token per category, so the filter reads as a legend.
const CAT_META: Record<string, { icon: string }> = {
  'Page design': { icon: 'layers' },
  'Content modeling': { icon: 'db' },
  'Agent workflows': { icon: 'sparkles' },
  'Quality': { icon: 'check' },
}
// Difficulty chip color (re-using the existing token palette only).
const DIFF: Record<string, [string, string]> = {
  starter: ['Starter', 'var(--ok)'],
  intermediate: ['Intermediate', 'var(--text)'],
  advanced: ['Advanced', 'var(--danger)'],
}

const COUNT_BY_CAT: Record<string, number> = SKILLS.reduce((a, s) => ((a[s.category] = (a[s.category] || 0) + 1), a), {} as Record<string, number>)

// ── Skill card ─────────────────────────────────────────────────────────────
function SkillCard({ s, onPreview }: { s: Skill; onPreview: (s: Skill) => void }) {
  const [copied, setCopied] = useState(false)
  const tRef = useRef<number | undefined>(undefined)

  const copy = async () => {
    const text = s.prompt
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else {
        // Graceful fallback for non-secure contexts / older clients.
        const ta = document.createElement('textarea')
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
      }
      setCopied(true)
      window.clearTimeout(tRef.current)
      tRef.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked - the View on GitHub action still works */
    }
  }
  useEffect(() => () => window.clearTimeout(tRef.current), [])

  const [diffLabel, diffCol] = DIFF[s.difficulty] || DIFF.intermediate

  return (
    <article
      data-skill
      data-title={s.title.toLowerCase()}
      data-desc={s.description.toLowerCase()}
      data-tags={s.tags.join(' ').toLowerCase()}
      data-category={s.category}
      className={`${card} flex flex-col bg-[var(--surface)] transition-[border-color,transform,box-shadow] duration-150 hover:border-[color-mix(in_srgb,var(--text)_18%,var(--border))] hover:-translate-y-px`}
    >
      <div className="p-[clamp(18px,2.5vw,24px)] flex flex-col gap-[14px] flex-1">
        {/* meta row: category + difficulty */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-[6px] font-[family-name:var(--mono)] text-[11px] text-[var(--muted)] border border-[var(--border)] rounded-full px-[9px] py-[3px] [&_svg]:w-[13px] [&_svg]:h-[13px]">
            <Icon name={CAT_META[s.category]?.icon || 'hash'} /> {s.category}
          </span>
          <span
            className="inline-flex items-center text-[10.5px] uppercase tracking-[0.06em] px-[8px] py-[3px] rounded-full whitespace-nowrap"
            style={{ color: diffCol, border: `1px solid color-mix(in srgb, ${diffCol} 34%, var(--border))`, background: `color-mix(in srgb, ${diffCol} 8%, transparent)` }}
          >
            {diffLabel}
          </span>
        </div>

        <div>
          <h3 className="text-[16.5px] font-semibold tracking-[-0.01em] leading-[1.25] m-0">{s.title}</h3>
          <p className="text-[var(--muted)] text-[13.5px] leading-[1.55] mt-[8px] mb-0 text-pretty">{s.description}</p>
        </div>

        <ul className="list-none p-0 m-0 mt-auto flex flex-wrap gap-[6px]">
          {s.tags.slice(0, 5).map((t) => (
            <li key={t} className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--faint)] bg-[color-mix(in_srgb,var(--text)_5%,transparent)] rounded-[6px] px-[7px] py-[3px]">{t}</li>
          ))}
        </ul>
      </div>

      {/* actions */}
      <div className="grid grid-cols-[1fr_auto_auto] items-stretch border-t border-[var(--border)] divide-x divide-[var(--border)]">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy the ${s.title} prompt to your clipboard`}
          className="inline-flex items-center justify-center gap-[7px] min-h-[44px] px-[14px] text-[13px] font-medium text-[var(--text)] cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)] [&_svg]:w-[15px] [&_svg]:h-[15px]"
        >
          {copied
            ? <span className="inline-flex items-center gap-[7px] text-[var(--ok)]"><Icon name="check" /> Copied</span>
            : <span className="inline-flex items-center gap-[7px]"><Icon name="copy" /> Copy prompt</span>}
        </button>
        <button
          type="button"
          onClick={() => onPreview(s)}
          aria-label={`Preview the full ${s.title} prompt`}
          className="grid place-items-center min-h-[44px] min-w-[44px] px-[12px] text-[var(--muted)] cursor-pointer transition-colors hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)] [&_svg]:w-[16px] [&_svg]:h-[16px]"
          title="Preview prompt"
        >
          <Icon name="terminal" />
        </button>
        <a
          href={blob(s.path)}
          target="_blank"
          rel="noopener"
          aria-label={`View the ${s.title} skill on GitHub`}
          className="grid place-items-center min-h-[44px] min-w-[44px] px-[12px] text-[var(--muted)] transition-colors hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)] [&_svg]:w-[16px] [&_svg]:h-[16px]"
          title="View on GitHub"
        >
          <Icon name="github" />
        </a>
      </div>
    </article>
  )
}

// ── Full-prompt preview modal (native <dialog>) ────────────────────────────
function PreviewModal({ skill, onClose }: { skill: Skill | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (skill && !d.open) d.showModal()
    if (!skill && d.open) d.close()
    setCopied(false)
  }, [skill])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onCancel = (e: Event) => { e.preventDefault(); onClose() }
    d.addEventListener('cancel', onCancel)
    return () => d.removeEventListener('cancel', onCancel)
  }, [onClose])

  const copy = async () => {
    if (!skill) return
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(skill.prompt)
      else {
        const ta = document.createElement('textarea')
        ta.value = skill.prompt; ta.style.position = 'fixed'; ta.style.opacity = '0'
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch { /* ignore */ }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="prompt-modal-title"
      onClick={(e) => { if (e.target === ref.current) onClose() }}
      className="m-auto w-[min(760px,calc(100vw-32px))] max-h-[min(86vh,900px)] p-0 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] backdrop:bg-[rgba(8,10,16,0.55)] backdrop:backdrop-blur-[2px]"
    >
      {skill && (
        <div className="flex flex-col max-h-[inherit]">
          <header className="flex items-start gap-3 px-[clamp(18px,3vw,26px)] py-[16px] border-b border-[var(--border)] bg-[var(--surface-2)]">
            <div className="min-w-0">
              <p className="font-[family-name:var(--mono)] text-[11px] text-[var(--faint)] m-0">{skill.category} · {skill.difficulty}</p>
              <h2 id="prompt-modal-title" className="text-[18px] font-semibold tracking-[-0.01em] mt-[3px] mb-0 truncate">{skill.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="ml-auto grid place-items-center w-9 h-9 rounded-[9px] text-[var(--muted)] cursor-pointer transition-colors hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_7%,transparent)] [&_svg]:w-[18px] [&_svg]:h-[18px] flex-none"
            >
              <Icon name="x" />
            </button>
          </header>

          <div className="overflow-y-auto px-[clamp(18px,3vw,26px)] py-[clamp(16px,2.5vw,22px)]">
            <p className="text-[var(--muted)] text-[14px] leading-[1.6] mt-0 mb-[16px] text-pretty">{skill.description}</p>
            <pre className="m-0 p-[clamp(14px,2vw,18px)] rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] overflow-x-auto whitespace-pre-wrap break-words font-[family-name:var(--mono)] text-[12.5px] leading-[1.65] text-[var(--text)]">{skill.prompt}</pre>
          </div>

          <footer className="flex items-center gap-3 px-[clamp(18px,3vw,26px)] py-[14px] border-t border-[var(--border)] bg-[var(--surface-2)] flex-wrap">
            <button type="button" onClick={copy} className={btnPrimary}>
              {copied ? <><Icon name="check" /> Copied</> : <><Icon name="copy" /> Copy prompt</>}
            </button>
            <a href={blob(skill.path)} target="_blank" rel="noopener" className={btnGhost}><Icon name="github" /> View on GitHub</a>
          </footer>
        </div>
      )}
    </dialog>
  )
}

// ── Library: server-rendered grid + client search/filter overlay ───────────
function Library() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')
  const [preview, setPreview] = useState<Skill | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(SKILLS.length)

  // Filter by toggling visibility of already-rendered cards (keeps SSG markup
  // intact and avoids re-mounting the whole grid on every keystroke).
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const needle = q.trim().toLowerCase()
    let visible = 0
    grid.querySelectorAll<HTMLElement>('[data-skill]').forEach((el) => {
      const matchCat = cat === 'all' || el.dataset.category === cat
      const hay = `${el.dataset.title} ${el.dataset.desc} ${el.dataset.tags}`
      const matchText = !needle || hay.includes(needle)
      const show = matchCat && matchText
      el.hidden = !show
      if (show) visible++
    })
    setShown(visible)
  }, [q, cat])

  const tab = 'inline-flex items-center gap-[7px] px-[13px] py-[8px] rounded-[10px] text-[13px] font-medium border transition-colors cursor-pointer min-h-[40px] [&_svg]:w-[14px] [&_svg]:h-[14px]'
  const tabOff = 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[color-mix(in_srgb,var(--text)_22%,var(--border))]'
  const tabOn = 'border-[color-mix(in_srgb,var(--text)_26%,var(--border))] bg-[var(--surface-2)] text-[var(--text)]'

  return (
    <section id="library" className="py-[clamp(40px,6vw,80px)] scroll-mt-[90px]"><div className={wrap}>
      <div className="max-w-[680px] mb-[clamp(22px,4vw,34px)]">
        <Eyebrow>the library</Eyebrow>
        <h2 className={sectionTitle}>{SKILLS.length} skills, grouped the way you build.</h2>
        <p className="text-[var(--muted)] text-base mt-3 max-w-[60ch] text-pretty">
          Each card is a ready-to-use prompt and a drop-in Claude Agent Skill. Copy the prompt straight into Claude
          Desktop or Cursor, or drop the folder into <code className={inlineCode}>.claude/skills/</code>. Filter by what
          you're working on, or search across every title, description, and tag.
        </p>
      </div>

      {/* Controls: search + category filter */}
      <div className="flex flex-col gap-[14px] mb-[clamp(20px,3vw,28px)]">
        <div className="flex items-center gap-[10px] rounded-[11px] border border-[var(--border)] bg-[var(--surface)] px-[14px] focus-within:border-[color-mix(in_srgb,var(--text)_28%,var(--border))] transition-colors [&_svg]:w-[17px] [&_svg]:h-[17px] [&_svg]:text-[var(--faint)] [&_svg]:flex-none">
          <Icon name="search" />
          <label htmlFor="skills-search" className="sr-only">Search skills by title, description, or tag</label>
          <input
            id="skills-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search skills - try 'hero', 'seo', 'blocks'…"
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none py-[12px] text-[15px] text-[var(--text)] placeholder:text-[var(--faint)]"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="grid place-items-center w-7 h-7 rounded-[7px] text-[var(--faint)] hover:text-[var(--text)] cursor-pointer [&_svg]:!w-[15px] [&_svg]:!h-[15px]"><Icon name="x" /></button>
          )}
        </div>

        <div className="flex items-center gap-[8px] flex-wrap" role="group" aria-label="Filter skills by category">
          <button type="button" onClick={() => setCat('all')} aria-pressed={cat === 'all'} className={`${tab} ${cat === 'all' ? tabOn : tabOff}`}>
            All <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--faint)]">{SKILLS.length}</span>
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={`${tab} ${cat === c ? tabOn : tabOff}`}>
              <Icon name={CAT_META[c]?.icon || 'hash'} /> {c} <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--faint)]">{COUNT_BY_CAT[c]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* aria-live count for assistive tech */}
      <p aria-live="polite" className="sr-only">{shown} of {SKILLS.length} skills shown.</p>

      {/* The grid - all cards rendered for SSG; filter toggles [hidden]. */}
      <div ref={gridRef} className="grid grid-cols-3 gap-[clamp(14px,2vw,20px)] max-[1040px]:grid-cols-2 max-[680px]:grid-cols-1">
        {SKILLS.map((s) => <SkillCard key={s.name} s={s} onPreview={setPreview} />)}
      </div>

      {/* Empty state (shown via JS when a search matches nothing) */}
      {shown === 0 && (
        <div className="text-center border border-dashed border-[var(--border)] rounded-[14px] py-[clamp(36px,6vw,60px)] px-6 mt-2">
          <p className="text-[var(--text)] font-semibold m-0">No skills match "{q}".</p>
          <p className="text-[var(--muted)] text-[14px] mt-[6px] mb-0">Try a broader term, or <button type="button" onClick={() => { setQ(''); setCat('all') }} className="underline underline-offset-[3px] text-[var(--text)] cursor-pointer">reset the filters</button>.</p>
        </div>
      )}

      <PreviewModal skill={preview} onClose={() => setPreview(null)} />
    </div></section>
  )
}

const HOW: [string, string, React.ReactNode][] = [
  ['sparkles', 'Paste into your agent', <>Copy a prompt into Claude Desktop or Cursor with a <Link className={link} to="/mcp">KernelCMS MCP connection</Link>, and let the agent draft against your real content model.</>],
  ['layers', 'Drop in as a Skill', <>Clone the repo and drop a skill folder into <code className={inlineCode}>.claude/skills/</code>. Claude loads it as a first-class Agent Skill, invoked by name when the task fits.</>],
  ['book', 'Read it as a reference', <>Every skill is plain Markdown. Open one to learn the pattern - how to model a block library, design a hero, or scope an agent - and adapt it by hand.</>],
]

function Prompts() {
  useHead(
    'Prompts & agent skills - KernelCMS',
    'A knowledge base of ready-to-use AI agent prompts and drop-in Claude Agent Skills for KernelCMS. Copy a prompt into Claude Desktop or Cursor to design beautiful pages, model content, and drive agents over MCP - all within draft-only guardrails.',
    {
      keywords: [
        'AI agent prompts', 'KernelCMS skills', 'Claude Desktop', 'Claude Agent Skills',
        'design beautiful pages', 'CMS prompts', 'agent skills library', 'MCP prompts', 'Cursor prompts',
      ],
      faq: [
        { q: 'What are KernelCMS Skills?', a: 'A free, open-source knowledge base of ready-to-use prompts and drop-in Claude Agent Skills for building beautiful products on KernelCMS - covering page design, content modeling, agent workflows, and quality. Each skill is plain Markdown you can copy as a prompt, install into .claude/skills/, or read as a reference.' },
        { q: 'How do I use a prompt?', a: 'Copy the prompt and paste it into an AI agent - Claude Desktop or Cursor - that has a KernelCMS MCP connection. The agent then works against your real content model. Or clone the KernelCMS-Skills repo and drop a skill folder into .claude/skills/ to load it as a first-class Claude Agent Skill.' },
        { q: 'Can these prompts publish or break my content?', a: 'No. Agents drive KernelCMS over the MCP server, where they are draft-only, field-scoped principals on the same access pipeline as a human. The skills design pages and draft content; a human still reviews and publishes. The guardrails are enforced by the engine, not the prompt.' },
        { q: 'Can I contribute a skill?', a: 'Yes. The library is open source on GitHub. Add a new SKILL.md under the right category, follow the contributing guide, and open a pull request - new skills and whole new sections are welcome.' },
      ],
    },
  )

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="pt-[clamp(48px,7vw,96px)] pb-[clamp(32px,5vw,56px)]"><div className={`${wrap} max-w-[920px]`}>
        <Eyebrow>prompts &amp; agent skills</Eyebrow>
        <h1 className="text-[clamp(2.1rem,1.4rem+2.8vw,3.4rem)] font-semibold tracking-[-0.03em] leading-[1.05] mt-5 max-w-[18ch]">Skills for agents that build beautiful products.</h1>
        <p className="text-[clamp(1.02rem,0.9rem+0.5vw,1.2rem)] leading-[1.7] text-[var(--muted)] max-w-[62ch] mt-6">
          A knowledge base of ready-to-use prompts and drop-in <a className={link} href="https://www.anthropic.com/news/skills" target="_blank" rel="noopener">Claude Agent Skills</a> for
          designing pages, modeling content, and driving agents over MCP - all within KernelCMS's
          <strong className="text-[var(--text)] font-semibold"> draft-only guardrails</strong>. Copy a prompt, drop in a skill, or read one as a reference.
        </p>
        <div className="flex items-center gap-3 mt-8 flex-wrap">
          <a className={btnPrimary} href={REPO} target="_blank" rel="noopener"><Icon name="github" /> Get the library</a>
          <Link className={btnGhost} to="/mcp">How agents connect <Icon name="arrow" /></Link>
        </div>

        {/* quick stat strip */}
        <ul className="list-none p-0 m-0 mt-[clamp(28px,4vw,44px)] grid grid-cols-[repeat(3,auto)] gap-[clamp(20px,4vw,52px)] max-[560px]:grid-cols-1 max-[560px]:gap-4">
          {[[String(SKILLS.length), 'skills'], [String(CATEGORIES.length), 'categories'], ['Draft-only', 'by design']].map(([n, l]) => (
            <li key={l} className="flex flex-col gap-[3px]">
              <span className="font-[family-name:var(--mono)] text-[clamp(1.4rem,1rem+1.2vw,1.9rem)] font-medium tracking-[-0.02em] leading-none text-[var(--text)]">{n}</span>
              <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]">{l}</span>
            </li>
          ))}
        </ul>
      </div></section>

      {/* ── LIBRARY (search + filter + grid) ──────────────────────────── */}
      <Library />

      {/* ── HOW TO USE ────────────────────────────────────────────────── */}
      <section className="py-[clamp(40px,6vw,80px)]"><div className={wrap}>
        <div className="max-w-[680px] mb-9">
          <Eyebrow>how to use</Eyebrow>
          <h2 className={sectionTitle}>Three ways to put a skill to work.</h2>
          <p className="text-[var(--muted)] text-base mt-3 max-w-[58ch] text-pretty">
            A skill is just a prompt plus a little metadata - so it travels anywhere an agent does. Pick the path that
            fits your workflow.
          </p>
        </div>
        <ol className="list-none p-0 m-0 grid grid-cols-3 gap-[clamp(14px,2vw,20px)] max-[760px]:grid-cols-1">
          {HOW.map(([icon, title, body], i) => (
            <li key={title} className="flex flex-col gap-[12px] p-[clamp(18px,2.5vw,24px)] border border-[var(--border)] rounded-[14px] bg-[var(--surface)]">
              <div className="flex items-center justify-between">
                <span className="grid place-items-center w-10 h-10 rounded-[11px] bg-[color-mix(in_srgb,var(--text)_7%,transparent)] text-[var(--text)] [&_svg]:w-[19px] [&_svg]:h-[19px]"><Icon name={icon} /></span>
                <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--faint)]">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="text-[15.5px] font-semibold leading-[1.25] m-0">{title}</h3>
              <p className="text-[var(--muted)] text-[13.5px] leading-[1.55] m-0 text-pretty">{body}</p>
            </li>
          ))}
        </ol>
        <p className="text-[var(--muted)] text-[13.5px] leading-[1.6] mt-6 flex items-start gap-[10px] [&_svg]:w-[17px] [&_svg]:h-[17px] [&_svg]:text-[var(--text)] [&_svg]:flex-none [&_svg]:mt-[2px]">
          <Icon name="info" /> Every skill drives KernelCMS over the <Link className={link} to="/mcp">MCP server</Link>, where agents are draft-only, field-scoped principals - so they design freely and a human still publishes.
        </p>
      </div></section>

      {/* ── CONTRIBUTE ────────────────────────────────────────────────── */}
      <section className="py-[clamp(24px,4vw,48px)]"><div className={`${wrap} max-w-[860px]`}>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-[clamp(16px,3vw,28px)] p-[clamp(20px,3vw,30px)] border border-[var(--border)] rounded-[16px] bg-[var(--surface)] max-[640px]:grid-cols-1 max-[640px]:text-left">
          <span className="grid place-items-center w-12 h-12 rounded-[13px] bg-[color-mix(in_srgb,var(--text)_7%,transparent)] text-[var(--text)] [&_svg]:w-[23px] [&_svg]:h-[23px]"><Icon name="branch" /></span>
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.01em] m-0">The library is open - add yours.</h2>
            <p className="text-[var(--muted)] text-[14px] leading-[1.55] mt-[6px] mb-0 text-pretty">
              Anyone can contribute a skill or a whole new section. Add a <code className={inlineCode}>SKILL.md</code>, follow the guide, open a pull request.
            </p>
          </div>
          <a className={btnGhost} href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener">Contributing guide <Icon name="arrow" /></a>
        </div>
      </div></section>

      {/* ── CLOSING CTA ───────────────────────────────────────────────── */}
      <section className="pb-[clamp(56px,9vw,110px)] pt-[clamp(8px,2vw,24px)]"><div className={`${wrap} max-w-[860px]`}>
        <div className="relative overflow-hidden border border-[var(--border)] rounded-[20px] bg-[var(--surface)] p-[clamp(28px,5vw,52px)]">
          <div className="bg-local"><div className="pixels" /></div>
          <div className="relative z-[1] max-w-[60ch]">
            <h2 className="text-[clamp(1.5rem,1.1rem+1.4vw,2.1rem)] font-semibold tracking-[-0.02em]">Hand an agent a skill, keep the leash.</h2>
            <p className="text-[var(--muted)] leading-[1.65] mt-3 text-pretty">
              These prompts make agents genuinely good at building on KernelCMS - composing pages from your block
              library, modeling content, drafting at scale. And because every skill runs over the MCP server, the agent
              stays draft-only and field-scoped. You get the speed; you keep the final say.
            </p>
            <div className="flex items-center gap-3 mt-7 flex-wrap">
              <a className={btnPrimary} href={REPO} target="_blank" rel="noopener"><Icon name="github" /> Browse the library</a>
              <Link className={btnGhost} to="/mcp"><Icon name="plug" /> Connect an agent</Link>
            </div>
          </div>
        </div>
      </div></section>
    </main>
  )
}
