/* eslint-disable */
// @ts-nocheck
import { createFileRoute, Link } from '@tanstack/react-router'
import { highlight } from '../lib'
import { Icon, Prose, useHead } from '../ui'
import { btnPrimary, btnGhost } from '../cls'

export const Route = createFileRoute('/mcp')({ component: Mcp })

const wrap = 'w-full max-w-[var(--maxw)] mx-auto px-[clamp(18px,4vw,36px)]'
const eyebrow = 'font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] m-0 [&_.c]:text-[var(--faint)]'

const Eyebrow = ({ children }: any) => <p className={eyebrow}><span className="c">//</span> {children}</p>

// Same highlighter the home page + docs use, so code matches /docs exactly.
const Code = ({ src, lang }: { src: string; lang?: string }) => (
  <pre data-lang={lang} className="m-0"><code dangerouslySetInnerHTML={{ __html: highlight(src, lang) }} /></pre>
)

// Same HTML helpers the docs content uses, so the deep-dive prose highlights
// and its callouts render identically to /docs.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const code = (lang: string, src: string) =>
  `<pre data-lang="${lang}"><code>${esc(src.replace(/^\n/, '').replace(/\n$/, ''))}</code></pre>`
const note = (h: string) => `<div class="callout">__ICON_info__<div>${h}</div></div>`
const warn = (h: string) => `<div class="callout warn">__ICON_lock__<div>${h}</div></div>`

// ── The leash, made visual ────────────────────────────────────────────────
// What an agent CAN do (read/draft/review) vs what it physically CANNOT.
const CAN: [string, string][] = [
  ['List & read', 'Paginated, access-filtered finds and findByID across every non-hidden collection it has read rights to.'],
  ['Count & query', 'Aggregate counts behind an optional where filter - the same row-level rules a human gets.'],
  ['Draft new content', 'create() and update() that land as drafts only, scoped to the fields in fieldScope.allow.'],
  ['Review history', 'Read prior versions of versioned collections to understand what changed and why.'],
]
const CANNOT: [string, string][] = [
  ['Publish anything', 'A born-published create, a _status: published write, a publish() call, or a scheduled publish are all rejected.'],
  ['Touch unscoped fields', 'Fields outside fieldScope.allow are stripped before per-field rules even run - it cannot set roles.'],
  ['Escalate privileges', 'The admin role is rejected at startup; nothing on the MCP path ever sets overrideAccess.'],
  ['See secrets', 'Auth and hidden collections - email, api_key, reset_token - are excluded from tools and resources entirely.'],
]

// ── The pipeline, as a flow ───────────────────────────────────────────────
const PIPELINE: [string, string, string][] = [
  ['hash', 'Agent token', 'A bearer credential from the environment, resolved per-request in constant time.'],
  ['sparkles', 'Principal', 'The token binds to an agent principal carrying its roles and fieldScope - never admin.'],
  ['shield', 'Access rules', 'The collection read / create / update / delete rules run against the agent, with row filters.'],
  ['layers', 'Field scope', 'Writes are narrowed to fieldScope.allow; unlisted fields are stripped, deny-by-default.'],
  ['lock', 'Draft brake', 'Any attempt to publish or schedule is rejected. Agents author drafts, full stop.'],
  ['box', 'Local API', 'The request reaches @kernel/core in-process - the same engine a browser or REST client hits.'],
]

// ── The tool surface, as a palette ────────────────────────────────────────
// badge: 'read' = read-only, 'write' = idempotent write, 'danger' = destructive.
const TOOLS: [string, string, 'read' | 'write' | 'danger'][] = [
  ['posts_list', 'paginated, access-filtered find', 'read'],
  ['posts_get', 'findByID - reads the latest draft', 'read'],
  ['posts_count', 'count matching an optional filter', 'read'],
  ['posts_versions', 'review change history', 'read'],
  ['posts_create', 'create a draft', 'write'],
  ['posts_update', 'update by id', 'write'],
  ['posts_delete', 'delete by id', 'danger'],
  ['settings_get_global', 'read a global', 'read'],
  ['settings_update_global', 'update a global', 'write'],
  ['posts_summarize', 'opt-in custom endpoint (mcp: true)', 'write'],
]
const BADGE: Record<string, [string, string]> = {
  read: ['read-only', 'var(--ok)'],
  write: ['idempotent', 'var(--text)'],
  danger: ['destructive', 'var(--danger)'],
}

// ── Serve it: four labeled transports ─────────────────────────────────────
const SERVE = {
  stdio: `# stdio (default) - for Claude Desktop / Cursor
# the client spawns the process and speaks JSON-RPC over stdin/stdout
npx kernel mcp --agent content-bot`,
  desktop: `{
  "mcpServers": {
    "kernelcms": {
      "command": "npx",
      "args": ["kernel", "mcp", "--agent", "content-bot"],
      "env": { "CONTENT_BOT_TOKEN": "…" }
    }
  }
}`,
  http: `# multi-agent HTTP - principal resolved per-request from the bearer token
kernel mcp --http --port 4000 --host 127.0.0.1

curl -X POST http://127.0.0.1:4000/mcp \\
  -H "Authorization: Bearer $CONTENT_BOT_TOKEN" \\
  -H "Content-Type: application/json" -d '{ … }'`,
  embed: `import { initKernel } from 'kernelcms'
import { serveStdio, serveHttp } from 'kernelcms/mcp'
import config from './kernel.config'

const kernel = await initKernel(config, { autoMigrate: true })

// single principal, over stdio
await serveStdio(kernel, {
  principal: { id: 'content-bot', roles: ['editor'], fieldScope: { allow: ['title', 'body'] } },
})

// or multi-agent over HTTP (principals resolved per-request from the token)
serveHttp(kernel, { port: 4000, host: '127.0.0.1' })`,
}
const SERVE_TABS: [keyof typeof SERVE, string, string, string][] = [
  ['stdio', 'bash', 'A. stdio', 'Single desktop client'],
  ['desktop', 'json', 'B. claude_desktop_config.json', 'Register the server'],
  ['http', 'bash', 'C. HTTP', 'Many agents, per-request auth'],
  ['embed', 'ts', 'D. Programmatic', 'Embed in your own process'],
]

const DEFINE = `export default defineConfig({
  agents: [
    {
      id: 'content-bot',
      token: process.env.CONTENT_BOT_TOKEN,   // bearer credential, from env
      roles: ['editor'],                       // never 'admin' - rejected at startup
      fieldScope: { allow: ['title', 'body', 'excerpt'] }, // deny-by-default
    },
  ],
  // …
})`

const ENDPOINT = `defineEndpoint({
  method: 'POST',
  path: '/posts/:id/summarize',
  access: ({ req }) => Boolean(req.user),
  mcp: true, // opt this endpoint into the agent tool surface
  handler: async ({ input, ctx }) => { /* … */ },
})`

// ── Deep-dive prose (the longer-form argument; code moved into bespoke
// sections above is not repeated here). ───────────────────────────────────
const BODY = `
<h2 id="agent-native">Agent-native, not bolted-on</h2>
<p>Most CMS "AI" is one of two things: a writing assistant that drafts copy in a side panel, or a thin MCP server holding one broad token that can do anything the API can. KernelCMS is neither. An AI agent here is a real principal that flows through the <em>exact same</em> per-operation permission pipeline as a human - see <a href="#/docs/access-control">access control</a>. Every tool call runs the collection's <code>read</code> / <code>create</code> / <code>update</code> / <code>delete</code> rules against the agent, with row-level filters and field-level access applied.</p>
<p>The crucial property: <strong>the MCP layer enforces nothing on its own.</strong> It stamps the request with an agent principal and forwards it to the in-process Local API; <code>overrideAccess</code> is never set. Access control, field scoping, and the draft-only brake all live in <code>@kernel/core</code> and run identically whether the caller is a browser, a REST client, or an agent. There is no parallel permission system to keep in sync.</p>

<h2 id="resources">Resources: model introspection</h2>
<p>Before calling a single tool, an agent can discover your content model through MCP resources:</p>
${code('text', `kernel://schema                    # the full content-model descriptor
kernel://collections/<slug>        # one collection's fields and labels`)}
<p>Both expose only <strong>visible</strong> collections - hidden and auth collections are never introspectable, so no <code>email</code> / <code>api_key</code> / <code>reset_token</code> field names ever leak. The descriptor served is the secret-stripped one, matching the tool surface exactly.</p>

<h2 id="install">Install</h2>
${note(`Import from <code>kernelcms/mcp</code>. The <code>@modelcontextprotocol/sdk</code> is an <strong>optional peer dependency</strong> - it is loaded lazily only when you run <code>kernel mcp</code>, so the base install stays lean. If it is missing, the CLI tells you to install it: <code>npm install @modelcontextprotocol/sdk</code>.`)}
${warn(`<strong>Bind to loopback.</strong> Token resolution is constant-time and the HTTP transport binds to <code>127.0.0.1</code> by default. Do not expose it on a public interface without a TLS proxy in front.`)}`

// Shared bits ──────────────────────────────────────────────────────────────
const inlineCode = 'font-[family-name:var(--mono)] text-[0.88em] px-[5px] py-px rounded bg-[color-mix(in_srgb,var(--text)_8%,transparent)]'
const sectionTitle = 'text-[clamp(1.5rem,1.1rem+1.5vw,2.1rem)] font-semibold tracking-[-0.025em] mt-3'
const card = 'border border-[var(--border)] rounded-[14px] bg-[var(--surface)] overflow-hidden'

function Mcp() {
  useHead(
    'AI agents & the MCP server - KernelCMS',
    'Serve your headless CMS over the Model Context Protocol. In KernelCMS an AI agent is a first-class, access-controlled principal on the same pipeline as a human - field-scoped, draft-only, and never able to bypass access. Connect Claude Desktop or Cursor.',
    {
      keywords: [
        'MCP server', 'AI agent CMS', 'Model Context Protocol', 'agent-native CMS',
        'Claude Desktop CMS', 'access-controlled AI agent', 'headless CMS MCP',
      ],
      faq: [
        { q: 'What is the KernelCMS MCP server?', a: 'It serves a KernelCMS instance over the Model Context Protocol so an AI agent like Claude Desktop or Cursor can list, read, and write your content. Tools are auto-generated from your content model, and every call runs through the same access pipeline as a human - the agent is a real, scoped principal, never a privileged back door.' },
        { q: 'Can an AI agent publish content in KernelCMS?', a: 'No. Agents are draft-only, enforced by the core engine. A born-published create, a _status published write, a publish() call, or a scheduled publish are all rejected for an agent principal. Publishing stays a human decision.' },
        { q: 'How are AI agents kept secure?', a: 'An agent flows through the exact same per-operation access rules as a human, with row- and field-level access applied. Its writes are scoped to fieldScope.allow (deny-by-default), it never runs with overrideAccess, auth and hidden collections are excluded from the tool surface, and every change it authors is attributed in version history.' },
        { q: 'How do I connect Claude Desktop to KernelCMS?', a: 'Define an agent in your config, then run npx kernel mcp --agent <id> over stdio and register it in claude_desktop_config.json. For multiple agents, serve over HTTP with kernel mcp --http; each request is authenticated independently from its bearer token.' },
      ],
    },
  )
  return (
    <main>
      {/* ── HERO: asymmetric split, leash idea up front ───────────────── */}
      <section className="pt-[clamp(48px,7vw,96px)] pb-[clamp(36px,5vw,64px)]"><div className={`${wrap} grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-[clamp(32px,5vw,64px)] items-center max-[940px]:grid-cols-1`}>
        <div>
          <Eyebrow>ai agents &amp; the mcp server</Eyebrow>
          <h1 className="text-[clamp(2.1rem,1.4rem+2.8vw,3.4rem)] font-semibold tracking-[-0.03em] leading-[1.05] mt-5 max-w-[15ch]">Give an AI agent your CMS, on a leash.</h1>
          <p className="text-[clamp(1.02rem,0.9rem+0.5vw,1.2rem)] leading-[1.7] text-[var(--muted)] max-w-[54ch] mt-6">
            KernelCMS speaks the <a className="text-[var(--text)] underline underline-offset-[3px] decoration-[var(--border)] hover:decoration-[var(--text)]" href="https://modelcontextprotocol.io" target="_blank" rel="noopener">Model Context Protocol</a>, so a client like Claude Desktop
            or Cursor can list, read, and write your content. But an agent here is a first-class,
            <strong className="text-[var(--text)] font-semibold"> access-controlled principal</strong> on the same pipeline as a human - field-scoped, draft-only
            and engine-enforced, never <code className={inlineCode}>overrideAccess</code>.
          </p>
          <div className="flex items-center gap-3 mt-8 flex-wrap">
            <Link className={btnPrimary} to="/docs/$slug" params={{ slug: 'mcp' }}><Icon name="book" /> Read the docs</Link>
            <a className={btnGhost} href="#serve">See it served <Icon name="arrow" /></a>
          </div>
        </div>

        {/* Compact "MCP connection" panel: Agent <=> kernel, with a mock tool call */}
        <div className={`${card} bg-[var(--surface-2)] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.6)]`} aria-hidden="true">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
            <span className="w-[10px] h-[10px] rounded-full bg-[color-mix(in_srgb,var(--text)_14%,transparent)]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[color-mix(in_srgb,var(--text)_14%,transparent)]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[color-mix(in_srgb,var(--text)_14%,transparent)]" />
            <span className="ml-2 font-[family-name:var(--mono)] text-[12px] text-[var(--faint)]">mcp · content-bot</span>
            <span className="ml-auto inline-flex items-center gap-[6px] font-[family-name:var(--mono)] text-[11px] text-[var(--muted)]">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--ok)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--ok)_24%,transparent)]" /> connected
            </span>
          </div>
          <div className="p-[clamp(18px,3vw,26px)] flex flex-col gap-4">
            {/* Agent <=> kernel handshake */}
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-[10px] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[14px] py-[11px]">
                <span className="grid place-items-center w-8 h-8 rounded-[9px] bg-[color-mix(in_srgb,var(--text)_7%,transparent)] [&_svg]:w-[17px] [&_svg]:h-[17px]"><Icon name="sparkles" /></span>
                <span className="font-[family-name:var(--mono)] text-[13px]">Agent</span>
              </div>
              <span className="font-[family-name:var(--mono)] text-[var(--faint)] text-sm">⇄</span>
              <div className="flex-1 flex items-center gap-[10px] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[14px] py-[11px]">
                <span className="grid place-items-center w-8 h-8 rounded-[9px] bg-[color-mix(in_srgb,var(--text)_7%,transparent)] [&_svg]:w-[17px] [&_svg]:h-[17px]"><Icon name="box" /></span>
                <span className="font-[family-name:var(--mono)] text-[13px]">kernel</span>
              </div>
            </div>
            {/* Mock tool call */}
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden font-[family-name:var(--mono)] text-[12.5px] leading-[1.7]">
              <div className="flex items-center justify-between gap-2 px-[14px] py-[9px] border-b border-[var(--border)]">
                <span className="text-[var(--text)]">posts_create</span>
                <span className="inline-flex items-center gap-[5px] text-[11px] text-[var(--ok)] px-[7px] py-[2px] rounded-full border border-[color-mix(in_srgb,var(--ok)_38%,var(--border))] bg-[color-mix(in_srgb,var(--ok)_8%,transparent)] [&_svg]:w-[12px] [&_svg]:h-[12px]"><Icon name="check" /> draft</span>
              </div>
              <div className="px-[14px] py-[11px] text-[var(--muted)] whitespace-pre-wrap break-words">
                <span className="text-[var(--faint)]">→</span> {`{ title: "Q3 launch", body: "…" }`}{'\n'}
                <span className="text-[var(--faint)]">←</span> 201 · <span className="text-[var(--text)]">_status: draft</span> · createdByType: <span className="text-[var(--text)]">agent</span>
              </div>
            </div>
            {/* The brake, stated */}
            <div className="flex items-start gap-[10px] text-[12.5px] text-[var(--muted)] leading-[1.5]">
              <span className="grid place-items-center w-[18px] h-[18px] mt-px text-[var(--danger)] [&_svg]:w-[15px] [&_svg]:h-[15px] flex-none"><Icon name="lock" /></span>
              <span><code className="font-[family-name:var(--mono)] text-[var(--text)]">publish()</code> · <code className="font-[family-name:var(--mono)] text-[var(--text)]">_status: published</code> · <code className="font-[family-name:var(--mono)] text-[var(--text)]">roles</code> — rejected by the engine.</span>
            </div>
          </div>
        </div>
      </div></section>

      {/* ── THE LEASH: Can / Cannot split (signature section) ─────────── */}
      <section className="py-[clamp(40px,6vw,80px)]"><div className={wrap}>
        <div className="max-w-[680px] mb-9">
          <Eyebrow>the leash</Eyebrow>
          <h2 className={sectionTitle}>One bound principal. Two very different sides.</h2>
          <p className="text-[var(--muted)] text-base mt-3 max-w-[58ch] text-pretty">
            An agent inherits the row- and field-level rules you already wrote for people. What it can reach is real
            work; what it cannot reach is enforced by <code className={inlineCode}>@kernel/core</code>, not by the adapter.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[clamp(14px,2vw,22px)] max-[760px]:grid-cols-1">
          {/* CAN */}
          <div className="rounded-[16px] border border-[color-mix(in_srgb,var(--ok)_24%,var(--border))] bg-[color-mix(in_srgb,var(--ok)_4%,var(--surface))] overflow-hidden">
            <div className="flex items-center gap-[10px] px-[clamp(18px,3vw,26px)] py-[18px] border-b border-[color-mix(in_srgb,var(--ok)_18%,var(--border))]">
              <span className="grid place-items-center w-9 h-9 rounded-[10px] text-[var(--ok)] bg-[color-mix(in_srgb,var(--ok)_12%,transparent)] [&_svg]:w-[19px] [&_svg]:h-[19px]"><Icon name="check" /></span>
              <h3 className="text-[17px] font-semibold">What it <span className="text-[var(--ok)]">can</span> do</h3>
            </div>
            <ul className="list-none m-0 p-0">
              {CAN.map(([t, d]) => (
                <li key={t} className="flex gap-[13px] px-[clamp(18px,3vw,26px)] py-[15px] border-b border-[color-mix(in_srgb,var(--ok)_10%,var(--border))] last:border-b-0">
                  <span className="grid place-items-center w-5 h-5 mt-[2px] rounded-full text-[var(--ok)] bg-[color-mix(in_srgb,var(--ok)_14%,transparent)] flex-none [&_svg]:w-[13px] [&_svg]:h-[13px]"><Icon name="check" /></span>
                  <span><span className="font-semibold text-[15px]">{t}</span><span className="block text-[var(--muted)] text-[13.5px] leading-[1.5] mt-1 text-pretty">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
          {/* CANNOT */}
          <div className="rounded-[16px] border border-[color-mix(in_srgb,var(--danger)_22%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_4%,var(--surface))] overflow-hidden">
            <div className="flex items-center gap-[10px] px-[clamp(18px,3vw,26px)] py-[18px] border-b border-[color-mix(in_srgb,var(--danger)_16%,var(--border))]">
              <span className="grid place-items-center w-9 h-9 rounded-[10px] text-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] [&_svg]:w-[19px] [&_svg]:h-[19px]"><Icon name="lock" /></span>
              <h3 className="text-[17px] font-semibold">What it <span className="text-[var(--danger)]">cannot</span> do</h3>
            </div>
            <ul className="list-none m-0 p-0">
              {CANNOT.map(([t, d]) => (
                <li key={t} className="flex gap-[13px] px-[clamp(18px,3vw,26px)] py-[15px] border-b border-[color-mix(in_srgb,var(--danger)_9%,var(--border))] last:border-b-0">
                  <span className="grid place-items-center w-5 h-5 mt-[2px] rounded-full text-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_14%,transparent)] flex-none [&_svg]:w-[12px] [&_svg]:h-[12px]"><Icon name="lock" /></span>
                  <span><span className="font-semibold text-[15px]">{t}</span><span className="block text-[var(--muted)] text-[13.5px] leading-[1.5] mt-1 text-pretty">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div></section>

      {/* ── THE PIPELINE: a constrained tool call, as a flow ──────────── */}
      <section className="py-[clamp(40px,6vw,80px)]"><div className={wrap}>
        <div className="max-w-[680px] mb-9">
          <Eyebrow>the pipeline</Eyebrow>
          <h2 className={sectionTitle}>Every tool call runs the same gauntlet.</h2>
          <p className="text-[var(--muted)] text-base mt-3 max-w-[58ch] text-pretty">
            From bearer token to the in-process Local API, an agent's request passes through the exact stages a human
            request does. Nothing here is MCP-specific - the adapter only sets the principal.
          </p>
        </div>
        <ol className="list-none m-0 p-0 grid grid-cols-6 gap-0 max-[980px]:grid-cols-3 max-[560px]:grid-cols-1">
          {PIPELINE.map(([icon, title, desc], i) => (
            <li key={title} className="relative">
              <div className="h-full flex flex-col gap-3 p-[clamp(16px,2vw,20px)] border border-[var(--border)] bg-[var(--surface)] -ml-px -mt-px first:ml-0 max-[980px]:[&:nth-child(3n+1)]:ml-0 max-[560px]:ml-0">
                <div className="flex items-center justify-between">
                  <span className="grid place-items-center w-9 h-9 rounded-[10px] bg-[color-mix(in_srgb,var(--text)_7%,transparent)] text-[var(--text)] [&_svg]:w-[18px] [&_svg]:h-[18px]"><Icon name={icon} /></span>
                  <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--faint)]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-[14.5px] font-semibold leading-[1.25]">{title}</h3>
                <p className="text-[var(--muted)] text-[12.5px] leading-[1.5] m-0 text-pretty">{desc}</p>
              </div>
              {i < PIPELINE.length - 1 && (
                <span className="absolute top-1/2 -right-[9px] z-[2] grid place-items-center w-[18px] h-[18px] -translate-y-1/2 rounded-full bg-[var(--bg)] text-[var(--faint)] [&_svg]:w-[15px] [&_svg]:h-[15px] max-[980px]:hidden" aria-hidden="true"><Icon name="arrow" /></span>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-5 flex items-center gap-[10px] text-[13px] text-[var(--muted)] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:text-[var(--text)] [&_svg]:flex-none">
          <Icon name="shield" /> The MCP layer never sets <code className={inlineCode}>overrideAccess</code> - the engine in <code className={inlineCode}>@kernel/core</code> decides everything.
        </div>
      </div></section>

      {/* ── DEFINE AN AGENT ───────────────────────────────────────────── */}
      <section className="py-[clamp(40px,6vw,80px)]"><div className={wrap}>
        <div className="grid grid-cols-[1fr_1.15fr] gap-[clamp(28px,4vw,56px)] items-center max-[920px]:grid-cols-1">
          <div>
            <Eyebrow>define an agent</Eyebrow>
            <h2 className={sectionTitle}>A token, some roles, and a field scope.</h2>
            <p className="text-[var(--muted)] text-base mt-4 max-w-[52ch] text-pretty">
              Register agents on your config. Each authenticates with a bearer <code className={inlineCode}>token</code> from the
              environment and may carry <code className={inlineCode}>roles</code> and a <code className={inlineCode}>fieldScope</code>. The
              <code className={inlineCode}> admin</code> role is rejected at startup - granting it would widen every role-gated rule
              for a non-human caller, so the config sanitizer fails fast.
            </p>
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <Link className={btnGhost} to="/docs/$slug" params={{ slug: 'access-control' }}><Icon name="shield" /> Access control</Link>
            </div>
          </div>
          <div className={`${card} bg-[var(--surface-2)] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.55)]`}>
            <div className="flex items-center gap-2 px-4 py-[10px] border-b border-[var(--border)] bg-[var(--surface)]">
              <span className="w-[10px] h-[10px] rounded-full bg-[color-mix(in_srgb,var(--text)_14%,transparent)]" />
              <span className="w-[10px] h-[10px] rounded-full bg-[color-mix(in_srgb,var(--text)_14%,transparent)]" />
              <span className="w-[10px] h-[10px] rounded-full bg-[color-mix(in_srgb,var(--text)_14%,transparent)]" />
              <span className="ml-2 font-[family-name:var(--mono)] text-[12px] text-[var(--faint)]">kernel.config.ts</span>
            </div>
            <div className="p-[clamp(16px,2.5vw,22px)] overflow-x-auto [&_code]:font-[family-name:var(--mono)] [&_code]:text-[13px] [&_code]:leading-[1.7] [&_code]:whitespace-pre">
              <Code src={DEFINE} lang="ts" />
            </div>
          </div>
        </div>
      </div></section>

      {/* ── THE TOOL SURFACE: a mono tool palette ─────────────────────── */}
      <section className="py-[clamp(40px,6vw,80px)]"><div className={wrap}>
        <div className="max-w-[680px] mb-9">
          <Eyebrow>the tool surface</Eyebrow>
          <h2 className={sectionTitle}>Auto-generated tools, never drifting from your model.</h2>
          <p className="text-[var(--muted)] text-base mt-3 max-w-[60ch] text-pretty">
            Tools are generated from the same content-model descriptor that drives the OpenAPI spec, so the agent surface
            never drifts from the HTTP surface. Auth and hidden collections are excluded entirely. Each tool carries an
            MCP safety annotation a client can group on.
          </p>
        </div>
        <div className={`${card} bg-[var(--surface-2)] shadow-[0_30px_80px_-52px_rgba(0,0,0,0.5)]`}>
          <div className="flex items-center gap-2 px-4 py-[10px] border-b border-[var(--border)] bg-[var(--surface)]">
            <Icon name="terminal" /><span className="ml-1 font-[family-name:var(--mono)] text-[12px] text-[var(--faint)]">tools · auto-generated from collection &lt;posts&gt;</span>
          </div>
          <ul className="list-none m-0 p-0 font-[family-name:var(--mono)] text-[13px]">
            {TOOLS.map(([name, desc, kind]) => {
              const [label, col] = BADGE[kind]
              return (
                <li key={name} className="grid grid-cols-[minmax(0,auto)_1fr_auto] items-center gap-[clamp(10px,2vw,20px)] px-[clamp(14px,2.5vw,22px)] py-[12px] border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[color-mix(in_srgb,var(--text)_3%,transparent)]">
                  <span className="text-[var(--faint)] select-none">$</span>
                  <span className="min-w-0 flex items-baseline gap-3 max-[640px]:flex-col max-[640px]:gap-[3px]">
                    <span className="text-[var(--text)]">{name}</span>
                    <span className="text-[var(--muted)] text-[12px] truncate font-[family-name:var(--font)]">{desc}</span>
                  </span>
                  <span className="inline-flex items-center text-[10.5px] uppercase tracking-[0.06em] px-[8px] py-[3px] rounded-full whitespace-nowrap"
                    style={{ color: col, border: `1px solid color-mix(in srgb, ${col} 34%, var(--border))`, background: `color-mix(in srgb, ${col} 8%, transparent)` }}>
                    {label}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <p className="text-[var(--muted)] text-[14px] leading-[1.6] mt-5 max-w-[68ch] text-pretty">
          <code className={inlineCode}>&lt;slug&gt;_list</code>, <code className={inlineCode}>_get</code>, <code className={inlineCode}>_count</code>, <code className={inlineCode}>_versions</code>, <code className={inlineCode}>_create</code> (draft), <code className={inlineCode}>_update</code>, and <code className={inlineCode}>_delete</code> are
          generated for each non-hidden collection; globals get <code className={inlineCode}>_get_global</code> and <code className={inlineCode}>_update_global</code>.
          Input schemas come from the shared JSON-Schema mapper, matching your fields exactly and omitting server-managed
          columns (<code className={inlineCode}>hash</code>, <code className={inlineCode}>api_key</code>, <code className={inlineCode}>_status</code>).
        </p>
        {/* Opt-in endpoint tools */}
        <div className="grid grid-cols-[1.1fr_1fr] gap-[clamp(20px,3vw,40px)] items-center mt-9 max-[860px]:grid-cols-1">
          <div>
            <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Your own logic can join the surface</h3>
            <p className="text-[var(--muted)] text-[15px] leading-[1.6] mt-3 max-w-[50ch] text-pretty">
              Set <code className={inlineCode}>mcp: true</code> on a <Link className="text-[var(--text)] underline underline-offset-[3px] decoration-[var(--border)] hover:decoration-[var(--text)]" to="/docs/$slug" params={{ slug: 'custom-endpoints' }}>custom endpoint</Link> to expose it as a tool -
              gated by that endpoint's own <code className={inlineCode}>access</code> rule, run through the same <code className={inlineCode}>invokeEndpoint</code> path as
              the HTTP route. The MCP annotations (<code className={inlineCode}>readOnlyHint</code>, <code className={inlineCode}>destructiveHint</code>, <code className={inlineCode}>idempotentHint</code>) are
              advisory; the access pipeline is what actually enforces anything.
            </p>
          </div>
          <div className={`${card} bg-[var(--surface-2)]`}>
            <div className="flex items-center gap-2 px-4 py-[10px] border-b border-[var(--border)] bg-[var(--surface)]">
              <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--faint)]">endpoint.ts</span>
            </div>
            <div className="p-[clamp(16px,2.5vw,20px)] overflow-x-auto [&_code]:font-[family-name:var(--mono)] [&_code]:text-[12.5px] [&_code]:leading-[1.7] [&_code]:whitespace-pre">
              <Code src={ENDPOINT} lang="ts" />
            </div>
          </div>
        </div>
      </div></section>

      {/* ── SERVE IT: four labeled transport cards ────────────────────── */}
      <section id="serve" className="py-[clamp(40px,6vw,80px)] scroll-mt-[90px]"><div className={wrap}>
        <div className="max-w-[680px] mb-9">
          <Eyebrow>serve it</Eyebrow>
          <h2 className={sectionTitle}>Four ways to connect, one principal model.</h2>
          <p className="text-[var(--muted)] text-base mt-3 max-w-[58ch] text-pretty">
            Spawn it over stdio for a single desktop client, or serve HTTP for many agents - each request authenticated
            independently from its bearer token, never sharing a principal.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[clamp(16px,2.5vw,24px)] max-[860px]:grid-cols-1">
          {SERVE_TABS.map(([key, lang, label, sub]) => (
            <div key={key} className={`${card} bg-[var(--surface-2)] flex flex-col`}>
              <div className="flex items-center gap-3 px-[clamp(16px,2.5vw,20px)] py-[13px] border-b border-[var(--border)] bg-[var(--surface)]">
                <span className="font-[family-name:var(--mono)] text-[13px] text-[var(--text)] font-semibold">{label}</span>
                <span className="ml-auto text-[12px] text-[var(--muted)]">{sub}</span>
              </div>
              <div className="p-[clamp(16px,2.5vw,22px)] overflow-x-auto flex-1 [&_code]:font-[family-name:var(--mono)] [&_code]:text-[12.5px] [&_code]:leading-[1.7] [&_code]:whitespace-pre">
                <Code src={SERVE[key]} lang={lang} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[var(--muted)] text-[13.5px] leading-[1.6] mt-5 flex items-start gap-[10px] [&_svg]:w-[17px] [&_svg]:h-[17px] [&_svg]:text-[var(--text)] [&_svg]:flex-none [&_svg]:mt-[2px]">
          <Icon name="info" /> With exactly one configured agent, <code className={inlineCode}>--agent</code> is optional; with several it is required.
        </p>
      </div></section>

      {/* ── DEEP DIVE: the longer argument + resources + install ──────── */}
      <section className="py-[clamp(40px,6vw,80px)]"><div className={`${wrap} max-w-[820px]`}>
        <Eyebrow>the deep dive</Eyebrow>
        <Prose content={BODY} className="prose mt-2" />
      </div></section>

      {/* ── CLOSING CTA ───────────────────────────────────────────────── */}
      <section className="pb-[clamp(56px,9vw,110px)] pt-[clamp(8px,2vw,24px)]"><div className={`${wrap} max-w-[860px]`}>
        <div className="relative overflow-hidden border border-[var(--border)] rounded-[20px] bg-[var(--surface)] p-[clamp(28px,5vw,52px)]">
          <div className="bg-local"><div className="pixels" /></div>
          <div className="relative z-[1] max-w-[60ch]">
            <h2 className="text-[clamp(1.5rem,1.1rem+1.4vw,2.1rem)] font-semibold tracking-[-0.02em]">One model for humans and agents.</h2>
            <p className="text-[var(--muted)] leading-[1.65] mt-3 text-pretty">
              The reason this is safe is the same reason it is simple: there is no second permission system. An agent
              inherits the row- and field-level rules you already wrote for people, and the draft-only brake lives in
              <code className={inlineCode}> @kernel/core</code>, not the MCP adapter. An agent can never read or write something a
              human in its role could not.
            </p>
            <div className="flex items-center gap-3 mt-7 flex-wrap">
              <Link className={btnPrimary} to="/docs/$slug" params={{ slug: 'mcp' }}><Icon name="book" /> MCP docs</Link>
              <Link className={btnGhost} to="/safety"><Icon name="shield" /> How access control works</Link>
            </div>
          </div>
        </div>
      </div></section>
    </main>
  )
}
