/* eslint-disable */
// @ts-nocheck
import { createFileRoute, Link } from '@tanstack/react-router'
import { Icon, Prose, useHead } from '../ui'
import { btnPrimary, btnGhost } from '../cls'

export const Route = createFileRoute('/mcp')({ component: Mcp })

const wrap = 'w-full max-w-[var(--maxw)] mx-auto px-[clamp(18px,4vw,36px)]'

// Same HTML helpers the docs content uses, so code blocks highlight and
// callouts render identically to /docs.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const code = (lang: string, src: string) =>
  `<pre data-lang="${lang}"><code>${esc(src.replace(/^\n/, '').replace(/\n$/, ''))}</code></pre>`
const tip = (h: string) => `<div class="callout tip">__ICON_bolt__<div>${h}</div></div>`
const note = (h: string) => `<div class="callout">__ICON_info__<div>${h}</div></div>`
const warn = (h: string) => `<div class="callout warn">__ICON_lock__<div>${h}</div></div>`

// Why an agent is different here, surfaced as a scannable grid above the deep dive.
const GUARANTEES: [string, string, string][] = [
  ['sparkles', 'One pipeline, humans and agents', 'An agent is a real principal on the exact same per-operation access pipeline as a person. Every tool call runs the collection read / create / update / delete rules against the agent, with row- and field-level access applied.'],
  ['layers', 'Field-scoped, deny by default', 'An agent only ever writes the fields in its fieldScope.allow. Unlisted fields are stripped from every write before per-field rules even run, so an agent scoped to title can never set roles.'],
  ['lock', 'Draft-only, enforced by the engine', 'Agents cannot publish. A born-published create, a _status published write, a publish() call, or scheduling via _scheduled_at are all rejected for an agent principal. Publishing stays a human decision.'],
  ['shield', 'Never overrideAccess', 'Nothing on the MCP path can bypass the access pipeline. The layer stamps the request with the agent principal and forwards it to the Local API; the engine in @kernel/core decides everything.'],
  ['db', 'Attributed in version history', "Every snapshot an agent authors records createdByType 'agent', so “review the agent’s changes” is a queryable filter, not a guess."],
  ['hash', 'No secrets ever leak', 'Auth and hidden collections are excluded from the tool set and from kernel:// resources, so no email, api_key, or reset_token field names are ever introspectable. Errors are clean tool errors, never stacks.'],
]

const BODY = `
<h2 id="agent-native">Agent-native, not bolted-on</h2>
<p>Most CMS "AI" is one of two things: a writing assistant that drafts copy in a side panel, or a thin MCP server holding one broad token that can do anything the API can. KernelCMS is neither. An AI agent here is a real principal that flows through the <em>exact same</em> per-operation permission pipeline as a human - see <a href="#/docs/access-control">access control</a>. Every tool call runs the collection's <code>read</code> / <code>create</code> / <code>update</code> / <code>delete</code> rules against the agent, with row-level filters and field-level access applied.</p>
<p>The crucial property: <strong>the MCP layer enforces nothing on its own.</strong> It stamps the request with an agent principal and forwards it to the in-process Local API; <code>overrideAccess</code> is never set. Access control, field scoping, and the draft-only brake all live in <code>@kernel/core</code> and run identically whether the caller is a browser, a REST client, or an agent. There is no parallel permission system to keep in sync.</p>

<h2 id="define">Define an agent</h2>
<p>Register agents on your config. Each authenticates with a bearer <code>token</code> (sourced from the environment, never hardcoded) and may carry <code>roles</code> and a <code>fieldScope</code>:</p>
${code('ts', `export default defineConfig({
  agents: [
    {
      id: 'content-bot',
      token: process.env.CONTENT_BOT_TOKEN,   // bearer credential, from env
      roles: ['editor'],                       // never 'admin' - rejected at startup
      fieldScope: { allow: ['title', 'body', 'excerpt'] }, // deny-by-default
    },
  ],
  // …
})`)}
${warn(`<strong>The 'admin' role is rejected at startup.</strong> Granting an agent <code>admin</code> would widen every role-gated access rule for a non-human caller, so the config sanitizer fails fast. An agent's real guard is its <code>fieldScope.allow</code> plus the hard draft-only brake.`)}

<h2 id="guarantees">The guarantees in detail</h2>
<p>These hold because they are enforced by the engine, not by the adapter:</p>
${warn(`<ul>
<li><strong>Writes are scoped to <code>fieldScope.allow</code> (deny-by-default).</strong> Unlisted fields are stripped from every write before per-field rules even run. An agent scoped to <code>['title']</code> simply cannot set <code>roles</code>, regardless of any field rule.</li>
<li><strong>Agents cannot publish - drafts only.</strong> A born-published <code>create</code>, a <code>_status: 'published'</code> write, a <code>publish()</code>, or scheduling via <code>_scheduled_at</code> are all rejected for an agent principal. Publishing stays a human decision.</li>
<li><strong>Never runs with <code>overrideAccess</code>.</strong> Nothing in the MCP path can bypass the access pipeline.</li>
<li><strong>Attributed in version history.</strong> Every snapshot an agent authors records <code>createdByType: 'agent'</code>, so "review the agent's changes" is a queryable filter.</li>
</ul>`)}

<h2 id="serve">Serve it</h2>
<p>For a single desktop client, run the stdio transport - the client spawns the process and speaks JSON-RPC over stdin/stdout:</p>
${code('bash', `# stdio (default) - for Claude Desktop / Cursor
npx kernel mcp --agent content-bot`)}
<p>With exactly one configured agent, <code>--agent</code> is optional; with several it is required. Wire it into Claude Desktop's <code>claude_desktop_config.json</code>:</p>
${code('json', `{
  "mcpServers": {
    "kernelcms": {
      "command": "npx",
      "args": ["kernel", "mcp", "--agent", "content-bot"],
      "env": { "CONTENT_BOT_TOKEN": "…" }
    }
  }
}`)}
<p>For multiple agents, serve over HTTP. Each request is authenticated independently from its bearer token, so different agents connect with different scoped tokens and never share a principal:</p>
${code('bash', `# multi-agent HTTP - principal resolved per-request from the token
kernel mcp --http --port 4000 --host 127.0.0.1`)}
${code('bash', `curl -X POST http://127.0.0.1:4000/mcp \\
  -H "Authorization: Bearer $CONTENT_BOT_TOKEN" \\
  -H "Content-Type: application/json" -d '{ … }'`)}
<p>Token resolution is constant-time and binds to loopback by default - do not expose the HTTP transport on a public interface without a TLS proxy in front. For programmatic embedding, call <code>serveStdio</code> / <code>serveHttp</code> directly:</p>
${code('ts', `import { initKernel } from 'kernelcms'
import { serveStdio, serveHttp } from 'kernelcms/mcp'
import config from './kernel.config'

const kernel = await initKernel(config, { autoMigrate: true })

// single principal, over stdio
await serveStdio(kernel, {
  principal: { id: 'content-bot', roles: ['editor'], fieldScope: { allow: ['title', 'body'] } },
})

// or multi-agent over HTTP (principals resolved per-request from the token)
serveHttp(kernel, { port: 4000, host: '127.0.0.1' })`)}

<h2 id="tools">The tool surface</h2>
<p>Tools are <strong>auto-generated</strong> from the same content-model descriptor that drives the OpenAPI spec, so the agent surface never drifts from the HTTP surface. For each non-hidden, non-auth collection:</p>
<table class="compare"><thead><tr><th>Tool</th><th class="us">Operation</th></tr></thead><tbody>
<tr><td><code>&lt;slug&gt;_list</code></td><td class="us-col">paginated, access-filtered <code>find</code></td></tr>
<tr><td><code>&lt;slug&gt;_get</code></td><td class="us-col"><code>findByID</code> (reads the latest draft)</td></tr>
<tr><td><code>&lt;slug&gt;_count</code></td><td class="us-col"><code>count</code> matching an optional filter</td></tr>
<tr><td><code>&lt;slug&gt;_versions</code></td><td class="us-col">review change history (versioned collections)</td></tr>
<tr><td><code>&lt;slug&gt;_create</code></td><td class="us-col"><code>create</code> (a draft)</td></tr>
<tr><td><code>&lt;slug&gt;_update</code></td><td class="us-col"><code>update</code> by id</td></tr>
<tr><td><code>&lt;slug&gt;_delete</code></td><td class="us-col"><code>delete</code> by id</td></tr>
</tbody></table>
<p>Globals get <code>&lt;slug&gt;_get_global</code> and <code>&lt;slug&gt;_update_global</code>. Auth and hidden collections are excluded entirely - handing an agent user or credential CRUD is a footgun closed here, even though the access pipeline would also gate it. Input schemas come from the shared JSON-Schema mapper, so they match your fields exactly and omit server-managed columns (<code>hash</code>, <code>api_key</code>, <code>_status</code>).</p>
<p>Your own business logic can join the surface too. Set <code>mcp: true</code> on a <a href="#/docs/custom-endpoints">custom endpoint</a> to expose it as a tool - gated by that endpoint's own <code>access</code> rule, run through the same <code>invokeEndpoint</code> path as the HTTP route:</p>
${code('ts', `defineEndpoint({
  method: 'POST',
  path: '/posts/:id/summarize',
  access: ({ req }) => Boolean(req.user),
  mcp: true, // opt this endpoint into the agent tool surface
  handler: async ({ input, ctx }) => { /* … */ },
})`)}
${note(`Each tool carries MCP safety annotations (<code>readOnlyHint</code>, <code>destructiveHint</code>, <code>idempotentHint</code>) so a client can label and group calls for the human in the loop. They are advisory: the core access pipeline is what actually enforces anything.`)}

<h2 id="resources">Resources: model introspection</h2>
<p>Before calling a single tool, an agent can discover your content model through MCP resources:</p>
${code('text', `kernel://schema                    # the full content-model descriptor
kernel://collections/<slug>        # one collection's fields and labels`)}
<p>Both expose only <strong>visible</strong> collections - hidden and auth collections are never introspectable, so no <code>email</code> / <code>api_key</code> / <code>reset_token</code> field names ever leak. The descriptor served is the secret-stripped one, matching the tool surface exactly.</p>

<h2 id="install">Install</h2>
${note(`Import from <code>kernelcms/mcp</code>. The <code>@modelcontextprotocol/sdk</code> is an <strong>optional peer dependency</strong> - it is loaded lazily only when you run <code>kernel mcp</code>, so the base install stays lean. If it is missing, the CLI tells you to install it: <code>npm install @modelcontextprotocol/sdk</code>.`)}`

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
      <section className="pt-[clamp(56px,8vw,104px)] pb-[clamp(32px,5vw,56px)] text-center"><div className={`${wrap} max-w-[760px]`}>
        <div className="inline-grid place-items-center w-16 h-16 rounded-[18px] bg-[color-mix(in_srgb,var(--text)_7%,transparent)] [&_svg]:w-7 [&_svg]:h-7"><Icon name="sparkles" /></div>
        <p className="font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] mt-7 mb-4">// ai agents &amp; the mcp server</p>
        <h1 className="text-[clamp(2.1rem,1.4rem+2.8vw,3.4rem)] font-semibold tracking-[-0.03em] leading-[1.05] max-w-[20ch] mx-auto">Give an AI agent your CMS, on a leash.</h1>
        <p className="text-[clamp(1.05rem,0.9rem+0.6vw,1.25rem)] leading-[1.7] text-[var(--muted)] max-w-[62ch] mx-auto mt-6">
          KernelCMS speaks the <a className="text-[var(--text)] underline underline-offset-[3px] decoration-[var(--border)] hover:decoration-[var(--text)]" href="https://modelcontextprotocol.io" target="_blank" rel="noopener">Model Context Protocol</a>, so a client like Claude Desktop
          or Cursor can list, read, and write your content. But an agent here is a first-class,
          <strong className="text-[var(--text)] font-semibold"> access-controlled principal</strong> on the same pipeline as a human - field-scoped, draft-only
          and engine-enforced, never <code className="font-[family-name:var(--mono)] text-[0.88em] px-[5px] py-px rounded bg-[color-mix(in_srgb,var(--text)_8%,transparent)]">overrideAccess</code>.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Link className={btnPrimary} to="/docs/$slug" params={{ slug: 'mcp' }}><Icon name="book" /> Read the docs</Link>
          <a className={btnGhost} href="#serve">See it in action <Icon name="arrow" /></a>
        </div>
      </div></section>

      <section className="pb-[clamp(40px,6vw,80px)]"><div className={wrap}>
        <div className="grid grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[16px] overflow-hidden max-[760px]:grid-cols-1">
          {GUARANTEES.map(([icon, title, desc]) => (
            <div key={title} className="bg-[var(--surface)] p-[28px] flex flex-col gap-3 transition-colors hover:bg-[var(--surface-2)]">
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-[color-mix(in_srgb,var(--text)_7%,transparent)] text-[var(--text)] [&_svg]:w-[21px] [&_svg]:h-[21px]"><Icon name={icon} /></div>
              <h2 className="text-[17px] font-semibold">{title}</h2>
              <p className="text-[var(--muted)] text-[14.5px] leading-[1.55] text-pretty m-0">{desc}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="pb-[clamp(40px,6vw,80px)]"><div className={`${wrap} max-w-[820px]`}>
        <Prose content={BODY} />
      </div></section>

      <section className="pb-[clamp(56px,9vw,110px)]"><div className={`${wrap} max-w-[760px]`}>
        <div className="border border-[var(--border)] rounded-[18px] bg-[var(--surface)] p-[clamp(24px,4vw,40px)]">
          <h2 className="text-[clamp(1.4rem,1.1rem+1.2vw,1.9rem)] font-semibold tracking-[-0.02em]">One model for humans and agents</h2>
          <p className="text-[var(--muted)] leading-[1.65] mt-3 text-pretty">
            The reason this is safe is the same reason it is simple: there is no second permission
            system. An agent inherits the row- and field-level rules you already wrote for people, and
            the draft-only brake is enforced in <code className="font-[family-name:var(--mono)] text-[0.88em] px-[5px] py-px rounded bg-[color-mix(in_srgb,var(--text)_8%,transparent)]">@kernel/core</code>, not in the MCP adapter. An agent can never
            read or write something a human in its role could not.
          </p>
          <div className="flex items-center gap-3 mt-7 flex-wrap">
            <Link className={btnPrimary} to="/docs/$slug" params={{ slug: 'mcp' }}><Icon name="book" /> MCP docs</Link>
            <Link className={btnGhost} to="/safety"><Icon name="shield" /> How access control works</Link>
          </div>
        </div>
      </div></section>
    </main>
  )
}
