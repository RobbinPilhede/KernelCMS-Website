/* eslint-disable */
// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useHead } from '../ui'

export const Route = createFileRoute('/changelog')({ component: Changelog })

const RELEASES = [
  {
    version: '0.3.8', date: 'June 7, 2026', latest: true,
    summary: 'Stability fixes for the published CLI.',
    changes: [
      { type: 'Fixed', items: ['Suppressed the MODULE_TYPELESS_PACKAGE_JSON warning in the published bin', 'Clean process exit after kernel dev and kernel start'] },
    ],
  },
  {
    version: '0.3.0', date: 'June 6, 2026',
    summary: 'Commerce, OAuth, two-factor auth, caching, and search.',
    changes: [
      { type: 'Added', items: [
        'Commerce module: products + orders collections, a POST /commerce/checkout that recomputes totals server-side, and a signature-verified Stripe webhook (with a deterministic testPayment adapter)',
        'OAuth sign-in with Google and GitHub presets',
        'TOTP two-factor auth, built on node:crypto with no extra dependencies',
        'Read-through caching adapters (memory, database, Redis) and access-checked full-text search',
      ] },
    ],
  },
  {
    version: '0.2.0', date: 'June 2, 2026',
    summary: 'The admin panel, live preview, the page builder, and versions.',
    changes: [
      { type: 'Added', items: [
        'The React admin on TanStack Router/Query/Table: list views with filters and bulk actions, a config-driven editor for every field type, a slash-menu rich text editor, a command palette, and light/dark themes',
        'Live preview with click-to-edit between the editor and your frontend',
        'A blocks page builder with a section library',
        'Versions, drafts, scheduled publishing, and autosave',
      ] },
      { type: 'Improved', items: ['Diff-based, risk-classified, deterministic migrations with a committed schema snapshot baseline'] },
    ],
  },
  {
    version: '0.1.0', date: 'May 30, 2026',
    summary: 'The first release: the typed content engine and three APIs.',
    changes: [
      { type: 'Added', items: [
        'Config-as-code content modeling - collections, globals, and 20+ field types - with full type inference',
        'Auto-generated REST and GraphQL APIs plus a typed in-process Local API, all over one access pipeline',
        'Deny-by-default access control with boolean or row-level rules, plus a privilege-escalation guard',
        'Database adapters: SQLite (node:sqlite, zero native deps), PostgreSQL, MySQL, and MongoDB',
        'Lifecycle hooks, typed custom endpoints, conflict-checked feature modules, and background jobs',
        'The kernel CLI: init, dev, start, migrate, seed, generate:types, generate:module, doctor',
      ] },
    ],
  },
]

const TAG: Record<string, string> = {
  Added: 'text-[var(--ok)] border-[color-mix(in_srgb,var(--ok)_35%,var(--border))] bg-[color-mix(in_srgb,var(--ok)_8%,transparent)]',
  Improved: 'text-[#88b6f5] border-[color-mix(in_srgb,#88b6f5_35%,var(--border))] bg-[color-mix(in_srgb,#88b6f5_8%,transparent)]',
  Fixed: 'text-[var(--num,#f0c070)] border-[color-mix(in_srgb,#f0c070_35%,var(--border))] bg-[color-mix(in_srgb,#f0c070_8%,transparent)]',
  Changed: 'text-[#c4a6f5] border-[color-mix(in_srgb,#c4a6f5_35%,var(--border))] bg-[color-mix(in_srgb,#c4a6f5_8%,transparent)]',
}

function Changelog() {
  useHead('Changelog - KernelCMS', 'Release notes for KernelCMS: every release with what was added, improved, fixed, and changed across the open-source TypeScript headless CMS, newest first.', { keywords: ['KernelCMS changelog', 'release notes', 'headless CMS updates'] })
  const wrap = 'w-full max-w-[820px] mx-auto px-[clamp(18px,4vw,36px)]'
  return (
    <main><section className="pt-[clamp(48px,7vw,88px)] pb-[clamp(56px,9vw,110px)]"><div className={wrap}>
      <p className="font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] mb-3">// release history</p>
      <h1 className="text-[clamp(2rem,1.4rem+2.4vw,3rem)] font-semibold tracking-[-0.03em]">Changelog</h1>
      <p className="text-[var(--muted)] text-lg mt-3 max-w-[54ch]">Every KernelCMS release, with what was added, improved, and fixed. The core follows semantic versioning.</p>

      <div className="mt-14 relative">
        {/* timeline rail */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)] max-[640px]:hidden" />
        {RELEASES.map((r) => (
          <div key={r.version} className="relative pl-9 pb-12 last:pb-0 max-[640px]:pl-0">
            <span className="absolute left-0 top-[6px] w-[15px] h-[15px] rounded-full border-2 border-[var(--border)] bg-[var(--surface)] max-[640px]:hidden">
              {r.latest && <span className="absolute inset-[3px] rounded-full bg-[var(--ok)]" />}
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-[family-name:var(--mono)] text-2xl font-medium tracking-[-0.02em]">v{r.version}</h2>
              {r.latest && <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.1em] font-bold text-[var(--primary-fg)] bg-[var(--primary)] px-2 py-[3px] rounded-full">latest</span>}
              <span className="text-sm text-[var(--faint)]">{r.date}</span>
            </div>
            <p className="text-[var(--muted)] mt-2">{r.summary}</p>
            <div className="mt-5 border border-[var(--border)] rounded-[14px] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
              {r.changes.map((g) => (
                <div key={g.type} className="p-5 flex gap-4 max-[520px]:flex-col max-[520px]:gap-2">
                  <span className={`shrink-0 self-start font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] px-[9px] py-1 rounded-full border ${TAG[g.type] || ''}`}>{g.type}</span>
                  <ul className="flex flex-col gap-[10px] m-0 p-0 list-none">
                    {g.items.map((it, i) => <li key={i} className="text-[14.5px] leading-[1.55] text-[color-mix(in_srgb,var(--text)_86%,var(--muted))] text-pretty">{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div></section></main>
  )
}
