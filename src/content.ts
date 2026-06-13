/* eslint-disable */
// @ts-nocheck -- ported content data (HTML strings)
/* Site content: in-depth documentation, guides, and articles.
   Authored from the real KernelCMS API surface (packages/core/src/types.ts,
   config.ts, plugins.ts, conventions.md). Code blocks are tagged with a language
   and highlighted at render time - see assets/app.js. */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  const code = (lang, src) => `<pre data-lang="${lang}"><code>${esc(src.replace(/^\n/, '').replace(/\n$/, ''))}</code></pre>`;
  const tip = (h) => `<div class="callout tip">__ICON_bolt__<div>${h}</div></div>`;
  const note = (h) => `<div class="callout">__ICON_info__<div>${h}</div></div>`;
  const warn = (h) => `<div class="callout warn">__ICON_lock__<div>${h}</div></div>`;

  // ===========================================================================
  // DOCS
  // ===========================================================================
  const DOCS = [
    // ---- Getting started ----------------------------------------------------
    {
      slug: 'introduction', group: 'Getting started', nav: 'Introduction', title: 'Introduction to KernelCMS',
      lead: 'KernelCMS is a config-as-code, end-to-end TypeScript headless CMS that never hijacks your framework.',
      html: `
<p>You describe your content in a single <code>kernel.config.ts</code>. From that one file KernelCMS gives you a typed content engine, a REST and GraphQL API, a fully typed in-process Local API, a polished React admin panel, and a CLI. You pick your own database, storage, email, image processor, cache, search, and auth providers through small adapter contracts, and you run the whole thing self-hosted on a single container.</p>

<h2 id="mental-model">The mental model</h2>
<p>There is exactly one pipeline. Every operation - whether it arrives over REST, over GraphQL, through the typed client, or from your own server code via the Local API - runs through the same stages:</p>
${code('text', `defaults → access → hooks → validation → serialize → adapter → populate`)}
<p>That is the whole architecture. Because there is only one path, a rule you write once (an access check, a hook, a computed field) holds no matter how the data is touched. There is no second code path to keep in sync.</p>

<h2 id="philosophy">The lean-core rule</h2>
<p>The guiding rule of the codebase: <strong>heavy or opinionated dependencies live behind optional adapters, never in <code>@kernel/core</code></strong>. The default database is SQLite via Node's built-in <code>node:sqlite</code> - zero native dependencies, nothing to compile. Image processing, Redis, S3, OAuth: all opt-in packages you add only when you need them.</p>
${tip(`<strong>One config, full inference.</strong> <code>defineConfig(...)</code> is an identity helper - it adds nothing at runtime but gives you complete type inference across collections, fields, hooks, and the typed client.`)}

<h2 id="next">Where to go next</h2>
<ul>
<li><a href="#/docs/installation">Installation</a> - requirements, scaffolding, and project layout.</li>
<li><a href="#/docs/quickstart">Quickstart</a> - a working CMS in three steps.</li>
<li><a href="#/docs/fields">Fields</a> - the full field reference, the part you will read most.</li>
<li><a href="#/docs/custom-endpoints">Custom endpoints</a> - when CRUD is not enough.</li>
</ul>`
    },
    {
      slug: 'installation', group: 'Getting started', nav: 'Installation', title: 'Installation',
      lead: 'Requirements, the scaffolder, and what a KernelCMS project looks like on disk.',
      html: `
<h2 id="requirements">Requirements</h2>
<ul>
<li><strong>Node 22.18+ or 24.</strong> KernelCMS runs your TypeScript config directly with no build step. On Node 23.6+ TypeScript types are stripped automatically; on 22.6–23.5 the CLI passes <code>--experimental-strip-types</code> for you.</li>
<li>Any package manager - npm, pnpm, or yarn. The CLI detects which one you used.</li>
</ul>

<h2 id="scaffold">Scaffold a new project</h2>
<p>The fastest path is the scaffolder, which writes a ready-to-run config and installs dependencies:</p>
${code('bash', `npm create kernel my-app
# or: pnpm create kernel my-app`)}

<h2 id="manual">Add to an existing project</h2>
${code('bash', `npm install kernelcms`)}
<p>Then create a <code>kernel.config.ts</code> (see <a href="#/docs/quickstart">Quickstart</a>) or generate one:</p>
${code('bash', `npx kernel init`)}

<h2 id="layout">Project layout</h2>
<p>A typical project is small - the engine lives in <code>node_modules</code>, your content model is the code you own:</p>
${code('text', `my-app/
├─ kernel.config.ts      # your content model + adapters
├─ .env                  # KERNEL_SECRET, DATABASE_URL, …
├─ content.db            # the default SQLite database (gitignored)
└─ kernel/
   └─ schema-snapshot.json  # migration baseline (commit this)`)}
${note(`A project <code>.env</code> is loaded automatically by the CLI before your config is imported, so <code>process.env</code> is populated when <code>kernel.config.ts</code> runs.`)}`
    },
    {
      slug: 'quickstart', group: 'Getting started', nav: 'Quickstart', title: 'Quickstart',
      lead: 'A working CMS, an admin panel, and a typed REST + GraphQL API in three steps.',
      html: `
<h2 id="install">1. Install</h2>
${code('bash', `npm install kernelcms`)}

<h2 id="configure">2. Add a kernel.config.ts</h2>
${code('ts', `import { defineConfig } from 'kernelcms'
import { sqliteAdapter } from 'kernelcms/sqlite'

export default defineConfig({
  // Set KERNEL_SECRET in production; anything works locally.
  secret: process.env.KERNEL_SECRET ?? 'dev-only-secret',
  db: sqliteAdapter({ url: 'file:./content.db' }),
  collections: [
    {
      slug: 'users',
      auth: true, // email + password sign-in, included
      fields: [{ name: 'name', type: 'text' }],
    },
    {
      slug: 'posts',
      access: { read: () => true }, // public reads
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'author', type: 'relationship', relationTo: 'users' },
      ],
    },
  ],
})`)}

<h2 id="run">3. Run it</h2>
${code('bash', `npx kernel dev`)}
<p>That creates the database tables, starts the server, and gives you:</p>
<ul>
<li><strong>Admin panel</strong> - <code>http://localhost:3000/admin</code> (the first visit asks you to create your admin account).</li>
<li><strong>REST API</strong> - <code>http://localhost:3000/api/posts</code></li>
<li><strong>GraphQL</strong> - <code>http://localhost:3000/api/graphql</code></li>
<li><strong>API reference</strong> - <code>http://localhost:3000/api/docs</code> (OpenAPI at <code>/api/openapi</code>)</li>
</ul>

<h2 id="try">Try the API</h2>
${code('bash', `curl http://localhost:3000/api/health
curl "http://localhost:3000/api/posts?where[title][like]=hello&depth=1"`)}
${tip(`Edit <code>kernel.config.ts</code>, refresh, and both the admin and the APIs update with it. In <code>dev</code> the schema auto-migrates additively on boot.`)}`
    },
    {
      slug: 'configuration', group: 'Getting started', nav: 'Configuration', title: 'Configuration & env',
      lead: 'How the config file is loaded, the rules type-stripping imposes, and every environment variable.',
      html: `
<h2 id="ts-loading">Config files are .ts, loaded with type stripping</h2>
<p>Node imports <code>kernel.config.ts</code> directly and <em>erases</em> the type syntax rather than compiling it. That means the config must use only <strong>erasable</strong> TypeScript:</p>
<ul>
<li>No <code>enum</code> - use <code>as const</code> objects or union types.</li>
<li>No <code>namespace</code>/<code>module</code> with runtime members.</li>
<li>No constructor parameter properties (<code>constructor(private x: T)</code>).</li>
<li>Use <code>import type { … }</code> for type-only imports.</li>
</ul>
<p>Export the config as the <strong>default export</strong> (or a named <code>config</code> export); the CLI looks for <code>default</code> first, then <code>config</code>.</p>

<h2 id="importing">Importing the config from a TS app</h2>
<p>Node requires <strong>.ts extensions on relative imports</strong> inside the config graph. TypeScript under <code>moduleResolution: "bundler"</code> (Next.js's default) rejects those unless you allow them:</p>
${code('json', `{ "compilerOptions": { "allowImportingTsExtensions": true, "noEmit": true } }`)}

<h2 id="env">Environment variables</h2>
<table class="compare"><thead><tr><th>Variable</th><th class="us">Used by</th><th>Notes</th></tr></thead><tbody>
<tr><td><code>KERNEL_SECRET</code></td><td>token signing</td><td>Long random value in prod; <code>doctor</code> errors if unset.</td></tr>
<tr><td><code>DATABASE_URL</code></td><td>Postgres adapter</td><td>Scaffolded configs use Postgres when set, else local SQLite.</td></tr>
<tr><td><code>KERNEL_API_KEY</code></td><td><code>start</code></td><td><code>Authorization: Bearer &lt;key&gt;</code> runs as a trusted system caller.</td></tr>
<tr><td><code>KERNEL_CORS</code></td><td><code>start</code></td><td>Comma-separated origin allow-list.</td></tr>
<tr><td><code>KERNEL_OPENAPI</code></td><td><code>start</code></td><td><code>true</code> re-enables OpenAPI + docs (off in prod by default).</td></tr>
<tr><td><code>KERNEL_GRAPHQL</code></td><td><code>start</code></td><td><code>true</code> re-enables GraphQL (off in prod by default).</td></tr>
<tr><td><code>KERNEL_LOG_LEVEL</code></td><td>logger</td><td><code>debug</code> | <code>info</code> | <code>warn</code> | <code>error</code>.</td></tr>
<tr><td><code>PORT</code></td><td><code>dev</code> / <code>start</code></td><td>Default <code>3000</code>; override with <code>--port</code>.</td></tr>
<tr><td><code>NODE_ENV</code></td><td><code>doctor</code></td><td><code>production</code> escalates several warnings to errors.</td></tr>
</tbody></table>
${warn(`OpenAPI and GraphQL are <strong>off by default in production</strong> - they map every collection and field, an unbounded attack surface for most apps. Re-enable explicitly with <code>KERNEL_OPENAPI=true</code> / <code>KERNEL_GRAPHQL=true</code> if you need them.`)}`
    },

    // ---- Content modeling ---------------------------------------------------
    {
      slug: 'collections', group: 'Content modeling', nav: 'Collections & globals', title: 'Collections & globals',
      lead: 'Collections are typed document types; globals are singletons. Both are defined as code.',
      html: `
<h2 id="collection">The collection config</h2>
<p>Every option on a collection, with the defaults that apply when you omit it:</p>
${code('ts', `{
  slug: 'posts',                       // required - URL + table name
  labels: { singular: 'Post', plural: 'Posts' },
  timestamps: true,                    // adds created_at / updated_at (default true)
  fields: [/* … */],                   // required
  access: { read: () => true },        // deny-by-default if omitted
  hooks: { /* beforeChange, afterChange, … */ },
  admin: {
    useAsTitle: 'title',               // which field labels a row
    defaultColumns: ['title', 'author', 'updatedAt'],
    defaultSort: '-createdAt',         // newest first; '-' = desc
    group: 'Content',                  // sidebar grouping
    description: 'Blog posts',
    hidden: false,                     // hide from the admin nav
    livePreview: { url: 'https://site.com/preview' },
  },
}`)}

<h2 id="admin-presentation">Admin presentation</h2>
<p><code>admin.useAsTitle</code> picks the field shown as a document's title in lists and relationship pickers. <code>admin.defaultColumns</code> sets the initial list columns. <code>admin.group</code> buckets collections under a sidebar heading. See <a href="#/docs/querying">Querying</a> for how <code>defaultSort</code> interacts with explicit sorts.</p>

<h2 id="globals">Globals (singletons)</h2>
<p>A global is a single document - site settings, a header, a footer. Same field system, no list view:</p>
${code('ts', `globals: [
  {
    slug: 'settings',
    label: 'Site settings',
    access: { read: () => true, update: ({ req }) => Boolean(req.user) },
    fields: [
      { name: 'siteName', type: 'text', required: true },
      { name: 'social', type: 'group', fields: [
        { name: 'twitter', type: 'text' },
        { name: 'github', type: 'text' },
      ] },
    ],
  },
]`)}
<p>Read and write globals through the Local API with <code>findGlobal</code> / <code>updateGlobal</code>, or over REST at <code>/api/globals/settings</code>.</p>
${note(`Globals support <code>beforeChange</code>, <code>afterChange</code>, and <code>afterRead</code> hooks - the same shapes as collections, minus the delete hooks.`)}`
    },
    {
      slug: 'fields', group: 'Content modeling', nav: 'Fields', title: 'Field reference',
      lead: 'Every field type and every option. This is the page you will return to most.',
      html: `
<h2 id="shared">Options every field shares</h2>
<p>These come from <code>FieldBase</code> and apply to any storage-bearing field:</p>
${code('ts', `{
  name: 'title',          // required, becomes the column name
  label: 'Title',         // admin label (defaults from name)
  required: true,
  unique: true,           // enforced with a unique index
  localized: true,        // per-locale values (needs config.localization)
  index: true,            // add a database index
  defaultValue: 'Draft',  // value | () => value
  admin: {
    description: 'Shown under the input',
    placeholder: 'e.g. Hello world',
    readOnly: false,
    hidden: false,
    position: 'sidebar',  // 'main' | 'sidebar'
    tab: 'Content',       // group under an editor tab
    section: 'Meta',      // sub-section within a tab
    width: 50,            // % width on a row
    condition: (data) => data.type === 'link', // show conditionally
    component: 'ColorPicker', // custom admin component key
  },
  access: { read, create, update }, // field-level access (see Access control)
  validate: ({ value }) => value.length < 80 || 'Too long',
}`)}

<h2 id="text">Text family</h2>
<p><code>type</code> can be <code>text</code>, <code>textarea</code>, <code>email</code>, <code>code</code>, or <code>slug</code>. They share <code>minLength</code>, <code>maxLength</code>, and <code>pattern</code>:</p>
${code('ts', `{ name: 'title', type: 'text', required: true, maxLength: 120 },
{ name: 'summary', type: 'textarea' },
{ name: 'contact', type: 'email' },
{ name: 'snippet', type: 'code' },
{ name: 'slug', type: 'slug', unique: true }, // auto-kebab-cases as you type`)}

<h2 id="number">Number, boolean, date</h2>
${code('ts', `{ name: 'price', type: 'number', min: 0, integer: false },
{ name: 'featured', type: 'boolean' },
{ name: 'agree', type: 'checkbox' },     // boolean rendered as a checkbox
{ name: 'publishedAt', type: 'date' }`)}

<h2 id="choice">Select & radio</h2>
${code('ts', `{
  name: 'status', type: 'select',
  options: [
    'draft',                                // shorthand
    { label: 'In review', value: 'review' },// explicit label/value
    { label: 'Published', value: 'published' },
  ],
  hasMany: false, // true → stores an array of values
}`)}

<h2 id="structured">json & point</h2>
${code('ts', `{ name: 'metadata', type: 'json' },
{ name: 'location', type: 'point' } // { lat, lng }`)}

<h2 id="richtext">Rich text</h2>
<p>A structured rich-text field. Control the toolbar with a <code>preset</code> (<code>minimal</code>, <code>standard</code>, <code>full</code>) or an explicit ordered <code>features</code> allow-list:</p>
${code('ts', `{ name: 'body', type: 'richText', preset: 'full' },
{ name: 'bio',  type: 'richText',
  features: ['bold', 'italic', 'link', 'heading', 'list'] }`)}

<h2 id="nested">group, array, blocks</h2>
<p><strong>group</strong> nests named fields under one object. <strong>array</strong> is a repeatable list of the same shape. <strong>blocks</strong> is the page builder - a repeatable list of typed variants:</p>
${code('ts', `{ name: 'seo', type: 'group', fields: [
  { name: 'title', type: 'text' },
  { name: 'description', type: 'textarea' },
] },

{ name: 'gallery', type: 'array', minRows: 1, maxRows: 12, fields: [
  { name: 'image', type: 'upload', relationTo: 'media' },
  { name: 'caption', type: 'text' },
] },

{ name: 'layout', type: 'blocks', blocks: [
  { slug: 'hero',
    labels: { singular: 'Hero' },
    admin: { group: 'Sections', description: 'Big banner' },
    fields: [{ name: 'heading', type: 'text' }] },
  { slug: 'cta',
    fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
] }`)}
<p>Blocks are stored as a JSON array of <code>{ blockType, ...fields }</code>. Each block can declare an admin <code>group</code>, <code>description</code>, and <code>thumbnail</code> for its card in the section library.</p>

<h2 id="layout-containers">Presentational containers: row, tabs, ui</h2>
<p>These organise the editor without storing anything - their children persist at the parent level:</p>
${code('ts', `{ type: 'row', fields: [
  { name: 'firstName', type: 'text', admin: { width: 50 } },
  { name: 'lastName',  type: 'text', admin: { width: 50 } },
] },
{ type: 'tabs', tabs: [
  { label: 'Content', fields: [/* … */] },
  { label: 'SEO', description: 'Search metadata', fields: [/* … */] },
] },
{ type: 'ui', name: 'previewButton' } // renders a custom admin component, stores nothing`)}
<p>Relationship, upload, computed, and join fields each have their own page - see <a href="#/docs/relationships">Relationships & joins</a> and <a href="#/docs/computed-fields">Computed fields</a>.</p>`
    },
    {
      slug: 'relationships', group: 'Content modeling', nav: 'Relationships & joins', title: 'Relationships & joins',
      lead: 'Single, many, and polymorphic relationships - plus virtual reverse-relationship join fields.',
      html: `
<h2 id="basic">A simple relationship</h2>
${code('ts', `{ name: 'author', type: 'relationship', relationTo: 'users' }`)}
<p>Stored as the related document's id. Set <code>hasMany: true</code> to store an array of ids. The foreign-key column is <strong>indexed by default</strong>, so lookups and <code>depth</code> population stay fast without you adding <code>index: true</code> by hand.</p>

<h2 id="on-delete">What happens when the target is deleted</h2>
<p><code>onDelete</code> decides how a relationship reacts when the document it points at is removed. The default leaves the reference dangling (<code>populate</code> tolerates a missing target):</p>
${code('ts', `{ name: 'author', type: 'relationship', relationTo: 'users',
  onDelete: 'setNull' }   // 'setNull' | 'cascade' | 'restrict'`)}
<ul>
<li><strong><code>setNull</code></strong> - clear the reference (or pull the id from a <code>hasMany</code> list) when the target is deleted.</li>
<li><strong><code>cascade</code></strong> - delete the referring document too.</li>
<li><strong><code>restrict</code></strong> - block the delete while any document still references the target.</li>
</ul>
${note(`<code>onDelete</code> runs through the normal delete pipeline - a <code>cascade</code> still applies the referring collection's delete access and hooks, never a raw row drop.`)}

<h2 id="polymorphic">Polymorphic relationships</h2>
<p>Point a field at more than one collection. Polymorphic values are stored and returned as <code>{ relationTo, value }</code> so the target is always explicit:</p>
${code('ts', `{ name: 'related', type: 'relationship',
  relationTo: ['posts', 'pages'], hasMany: true }`)}
${code('json', `{ "related": [
  { "relationTo": "posts", "value": "p_01" },
  { "relationTo": "pages", "value": "pg_07" }
] }`)}

<h2 id="depth">Population & depth</h2>
<p>Relationships return ids by default. Ask the server to expand them with <code>depth</code> - each level decrements, so nested relationships keep expanding while depth remains:</p>
${code('http', `GET /api/posts?depth=2

{
  "docs": [
    { "id": "p_01", "title": "Hello",
      "author": { "id": "u_1", "name": "Ada" } }
  ]
}`)}
<p>At <code>depth: 0</code> you get raw ids. From the Local API, pass <code>{ depth: 1 }</code> on the operation options.</p>

<h2 id="join">Join fields (reverse relationships)</h2>
<p>A <code>join</code> field is a <strong>virtual reverse relationship</strong> - nothing is stored. It is resolved at read time by querying the related collection for documents that point back:</p>
${code('ts', `// on 'authors': list the author's posts (posts.author → this author)
{ type: 'join', name: 'posts', collection: 'posts', on: 'author', limit: 100 }`)}
<ul>
<li><strong>When:</strong> populated only when request <code>depth &gt; 0</code>. At <code>depth: 0</code> the field is absent.</li>
<li><strong>Order:</strong> follows the related collection's <code>admin.defaultSort</code> - set it to make join order deterministic.</li>
<li><strong>Limit:</strong> at most <code>limit</code> rows (default 100).</li>
<li><strong>Access:</strong> related rows go through the normal access-checked read path; rows the caller can't read are simply omitted, never an error.</li>
</ul>
${tip(`Joins compose: at <code>depth: 2</code> an author's joined posts can themselves populate <em>their</em> relationships, all access-checked the whole way down.`)}`
    },
    {
      slug: 'computed-fields', group: 'Content modeling', nav: 'Computed fields', title: 'Computed fields',
      lead: 'Derive a value in one place - virtual (on read) or stored (on write).',
      html: `
<p>A field with a <code>compute</code> function derives its own value instead of taking it from input. It comes in two flavours, and the difference is entirely about <em>when</em> the value is produced and whether it is persisted.</p>

<h2 id="virtual">Virtual: derived on read</h2>
<p><code>virtual: true</code> means the value is computed on every read from the resolved document. It lives only in memory, so it is <strong>never stored</strong> and <strong>cannot be sorted or filtered</strong>:</p>
${code('ts', `{
  name: 'word_count', type: 'number', virtual: true,
  compute: ({ doc }) => String(doc.body ?? '').split(/\\s+/).length,
}`)}

<h2 id="stored">Stored: derived on write</h2>
<p>Drop <code>virtual</code> and the same <code>compute</code> runs at <strong>write</strong> time, persisting to a real column - so the value <strong>is</strong> sortable and filterable. The computed value always overrides client input:</p>
${code('ts', `{
  name: 'sort_key', type: 'number', index: true,
  compute: ({ doc }) => new Date(doc.starts_at).getTime(),
}`)}

<h2 id="choosing">Which one?</h2>
<table class="compare"><thead><tr><th></th><th class="us">virtual</th><th>stored</th></tr></thead><tbody>
<tr><td>Runs</td><td class="us-col">every read</td><td>every write</td></tr>
<tr><td>Persisted</td><td class="us-col">no</td><td>yes (real column)</td></tr>
<tr><td>Sort / filter</td><td class="us-col">no</td><td>yes</td></tr>
<tr><td>Use when</td><td class="us-col">cheap, presentational</td><td>you must order/filter by it</td></tr>
</tbody></table>
${warn(`Both render <strong>read-only</strong> in the admin, and <code>compute</code> runs <em>after</em> field-read access - a computed value can never leak a field the caller isn't allowed to read.`)}`
    },
    {
      slug: 'localization', group: 'Content modeling', nav: 'Localization', title: 'Localization',
      lead: 'Per-field translations with a configurable locale set and fallbacks.',
      html: `
<h2 id="enable">Enable locales</h2>
${code('ts', `export default defineConfig({
  localization: {
    locales: ['en', 'sv', 'de'],
    defaultLocale: 'en',
    fallback: true, // fall back to defaultLocale when a value is missing
  },
  // …
})`)}

<h2 id="mark">Mark fields localized</h2>
${code('ts', `{ name: 'title', type: 'text', localized: true },
{ name: 'body',  type: 'richText', localized: true }`)}
<p>A localized field stores one value per locale. Non-localized fields are shared across all locales.</p>

<h2 id="read-write">Reading & writing a locale</h2>
<p>Over REST, pass <code>?locale=sv</code>. From the Local API, set it on the request context:</p>
${code('ts', `await kernel.find({
  collection: 'posts',
  req: { locale: 'sv', fallbackLocale: 'en' },
})`)}
${note(`<code>fallbackLocale</code> can be a locale string or <code>false</code> to disable fallback for a single call and see exactly which values are missing.`)}`
    },

    // ---- Access & auth ------------------------------------------------------
    {
      slug: 'access-control', group: 'Access & auth', nav: 'Access control', title: 'Access control',
      lead: 'Deny-by-default authorization at the collection and field level - booleans or row filters.',
      html: `
<h2 id="deny">Deny by default</h2>
<p>A collection with no <code>access</code> rules denies everything (the admin and <code>doctor</code> flag this as <code>no-access</code>). Declare what is allowed explicitly:</p>
${code('ts', `access: { read: () => true }                       // public reads
access: { read: ({ req }) => Boolean(req.user) }   // authenticated reads`)}

<h2 id="signature">The access function</h2>
<p>Every rule receives <code>{ req, id?, data? }</code> and returns a boolean, a <code>Where</code> filter, or a promise of either:</p>
${code('ts', `type AccessFn = (args: {
  req: RequestContext  // { user, locale, fallbackLocale, context }
  id?: string          // present for update / delete / read-by-id
  data?: Row           // present for create / update
}) => boolean | Where | Promise<boolean | Where>`)}

<h2 id="row-level">Row-level filters</h2>
<p>Return a <code>Where</code> instead of a boolean to scope a query to the rows a caller may see. The filter is merged into every read, update, and delete:</p>
${code('ts', `access: {
  // users only ever see and edit their own posts
  read:   ({ req }) => ({ author: { equals: req.user?.id } }),
  update: ({ req }) => ({ author: { equals: req.user?.id } }),
  delete: ({ req }) => req.user?.roles?.includes('admin') ?? false,
}`)}

<h2 id="field-level">Field-level access</h2>
<p>Fields take their own <code>access</code> with <code>read</code>, <code>create</code>, and <code>update</code>. A field with no rule inherits the collection decision:</p>
${code('ts', `{ name: 'internal_notes', type: 'textarea',
  access: { read: ({ req }) => req.user?.roles?.includes('staff') ?? false } }`)}

<h2 id="publish">The publish rule</h2>
<p>On a drafts-enabled collection, moving a document to <code>published</code> is its own access-controlled transition, separate from <code>update</code>. Add a <code>publish</code> rule to gate it - a principal who can <em>edit</em> a draft still cannot make it live unless this returns true:</p>
${code('ts', `access: {
  update:  ({ req }) => Boolean(req.user),                       // editors can edit
  publish: ({ req }) => req.user?.roles?.includes('admin') ?? false, // only admins go live
}`)}
<p>It fires for any move to <code>published</code> - <code>publish()</code>, a raw <code>_status</code> write, or a scheduled publish.</p>

<h2 id="agents">Agent principals</h2>
<p>A request carries a <code>principalType</code> of <code>user</code> or <code>agent</code>. An AI agent (see <a href="#/docs/mcp">AI agents & MCP</a>) runs through this exact same pipeline as a human, with two extra, engine-enforced brakes layered on top:</p>
<ul>
<li><strong><code>fieldScope</code></strong> - an agent only ever writes the fields in its <code>fieldScope.allow</code> (deny-by-default); unlisted fields are stripped from every write before per-field rules even run.</li>
<li><strong>Draft-only</strong> - agents can never publish, regardless of the <code>publish</code> rule. A born-published create, a <code>_status: 'published'</code> write, a <code>publish()</code>, or scheduling via <code>_scheduled_at</code> are all rejected for an agent principal.</li>
</ul>
${note(`Granting an agent the <code>admin</code> role is rejected at startup - it would silently widen every role-gated rule for a non-human caller. An agent's real guard is its <code>fieldScope</code> plus the draft-only brake.`)}

<h2 id="override">overrideAccess</h2>
<p>Every Local API operation accepts <code>overrideAccess: true</code>, which <strong>bypasses all access checks</strong> and runs as a trusted system caller (it also lets you set server-managed auth fields). Use it in seeds, migrations, jobs, and trusted server code - never with untrusted input. Over HTTP, the equivalent is the API-key bearer token. The MCP agent path <strong>never</strong> sets it.</p>
${warn(`<strong>Privilege-escalation guard.</strong> On an auth collection, authority fields (<code>roles</code>, <code>role</code>, <code>permissions</code>, <code>is_admin</code>, <code>is_staff</code>, <code>is_superuser</code>) are admin-write by default - even a user who can update their own record cannot promote themselves. An explicit field-level <code>access.update</code> rule overrides the default; trusted paths using <code>overrideAccess</code> still set them.`)}`
    },
    {
      slug: 'authentication', group: 'Access & auth', nav: 'Authentication', title: 'Authentication',
      lead: 'Auth collections, sessions, API keys, password reset, email verification, 2FA, and OAuth.',
      html: `
<h2 id="enable">Turn a collection into an auth collection</h2>
${code('ts', `{ slug: 'users', auth: true, fields: [{ name: 'name', type: 'text' }] }`)}
<p>This injects email + password handling (scrypt hashing) and login routes. Pass an options object to enable more:</p>
${code('ts', `{
  slug: 'users',
  auth: {
    loginField: 'email',     // identifier field (default 'email')
    tokenExpiration: 7200,   // seconds
    useAPIKey: true,         // per-document API keys for machine clients
    forgotPassword: true,    // email-based password reset
    verify: true,            // require email verification before login
    twoFactor: true,         // TOTP two-factor
  },
  fields: [{ name: 'name', type: 'text' }],
}`)}

<h2 id="login">Logging in</h2>
${code('ts', `const { user, token, exp } = await kernel.login({
  collection: 'users',
  email: 'admin@example.com',
  password: 'secret',
  code: '123456', // required only when the account has 2FA enabled
})`)}
<p>Over HTTP, <code>POST /api/users/login</code> returns the same shape and (by default) sets an <code>HttpOnly</code> session cookie. <code>GET /api/users/me</code> resolves the current user.</p>

<h2 id="api-keys">API keys for machine clients</h2>
${code('ts', `const { key } = await kernel.createAPIKey({ collection: 'users', id: user.id })
// later, the holder authenticates as that user:
const u = await kernel.authenticateAPIKey('users', key)`)}

<h2 id="reset">Password reset & email verification</h2>
${code('ts', `await kernel.forgotPassword({ collection: 'users', email })
await kernel.resetPassword({ collection: 'users', token, password })
await kernel.requestEmailVerification({ collection: 'users', email })
await kernel.verifyEmail({ collection: 'users', token })`)}
${note(`Reset and verification flows do <strong>not</strong> reveal whether an email exists (no user-enumeration). Tokens are emailed through your configured email adapter - a console adapter is used in dev if none is set.`)}

<h2 id="2fa">Two-factor (TOTP)</h2>
${code('ts', `const { secret, otpauthURL } = await kernel.setupTwoFactor({ collection: 'users', id })
// show otpauthURL as a QR code, then confirm a code to enable:
await kernel.enableTwoFactor({ collection: 'users', id, code: '123456' })`)}

<h2 id="oauth">OAuth sign-in</h2>
${code('ts', `import { googleOAuth, githubOAuth } from 'kernelcms'

export default defineConfig({
  oauth: [
    googleOAuth({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
    githubOAuth({ clientId: process.env.GH_ID, clientSecret: process.env.GH_SECRET }),
  ],
  // …
})`)}
<p>The built-in server exposes start + callback routes; complete sign-in with <code>kernel.loginWithOAuth(...)</code>.</p>

<h2 id="csrf">Sessions & CSRF</h2>
<p>By default login sets the token in an <code>HttpOnly</code>, <code>SameSite=Lax</code> cookie (<code>Secure</code> over HTTPS), so an XSS cannot read it. <code>Authorization: Bearer &lt;token&gt;</code> still works for API clients. CSRF is covered by <code>SameSite=Lax</code> plus a same-origin <code>Origin</code> check on cookie-authed writes; Bearer callers are exempt.</p>`
    },

    {
      slug: 'mcp', group: 'Access & auth', nav: 'AI agents & MCP', title: 'AI agents & the MCP server',
      lead: 'Serve your headless CMS over the Model Context Protocol so an AI agent becomes a first-class, access-controlled principal - scoped to the fields you allow, and unable to publish.',
      html: `
<p>KernelCMS speaks the <a href="https://modelcontextprotocol.io" rel="noopener">Model Context Protocol</a> (MCP), the open standard for connecting AI agents to tools and data. Point a client like Claude Desktop or Cursor at your kernel and it can list, read, and write your content - but only ever as an <strong>access-controlled principal</strong>, never as a privileged back door. There is a dedicated <a href="/mcp">MCP overview page</a> if you want the high-level pitch first.</p>

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

<h2 id="guarantees">The guarantees</h2>
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
    },

    // ---- Data & APIs --------------------------------------------------------
    {
      slug: 'local-api', group: 'Data & APIs', nav: 'Local API', title: 'The Local API',
      lead: 'The same operations as REST, in-process, fully typed, with no HTTP round-trip.',
      html: `
<p>The <code>kernel</code> instance exposes every operation directly. This is the API you use inside hooks, jobs, custom endpoints, server functions, and seeds. It is the same engine REST and GraphQL call - same access rules, same hooks, same validation.</p>

<h2 id="read">Reading</h2>
${code('ts', `const { docs, totalDocs, page } = await kernel.find({
  collection: 'posts',
  where: { status: { equals: 'published' } },
  sort: '-createdAt',
  limit: 20,
  page: 1,
  depth: 1,
})

const post = await kernel.findByID({ collection: 'posts', id })
const total = await kernel.count({ collection: 'posts', where: { featured: { equals: true } } })`)}

<h2 id="write">Writing</h2>
${code('ts', `const created = await kernel.create({
  collection: 'posts',
  data: { title: 'Hello', body: '…', author: ada.id },
})

const updated = await kernel.update({ collection: 'posts', id, data: { title: 'Edited' } })
const removed = await kernel.delete({ collection: 'posts', id })`)}

<h2 id="bulk">Bulk operations</h2>
${code('ts', `const { docs, count } = await kernel.updateMany({
  collection: 'posts',
  where: { status: { equals: 'review' } },
  data: { status: 'published' },
  limit: 1000, // safety cap (default 1000)
})

await kernel.deleteMany({ collection: 'comments', where: { spam: { equals: true } } })`)}

<h2 id="options">Shared operation options</h2>
<p>Every operation accepts these on top of its own arguments:</p>
${code('ts', `{
  req: { user, locale, fallbackLocale, context }, // request context
  overrideAccess: true,  // bypass access checks (trusted code only)
  depth: 1,              // relationship population depth
  draft: true,           // read latest content incl. drafts (drafts collections)
}`)}
${tip(`The Local API is generically typed: <code>kernel.find&lt;Post&gt;({ … })</code> returns <code>PaginatedResult&lt;Post&gt;</code>. Run <code>kernel generate:types</code> to emit interfaces for your collections.`)}`
    },
    {
      slug: 'rest-api', group: 'Data & APIs', nav: 'REST API', title: 'REST API',
      lead: 'Auto-generated endpoints for every collection and global, access-checked end to end.',
      html: `
<h2 id="endpoints">Endpoints</h2>
${code('http', `GET    /api/posts            # list (filter, sort, paginate)
POST   /api/posts            # create
GET    /api/posts/:id        # read one
PATCH  /api/posts/:id        # update
DELETE /api/posts/:id        # delete
GET    /api/globals/settings # read a global
POST   /api/globals/settings # update a global`)}

<h2 id="response">List response shape</h2>
${code('json', `{
  "docs": [{ "id": "p_01", "title": "Hello" }],
  "totalDocs": 42,
  "page": 1,
  "totalPages": 3,
  "limit": 20
}`)}

<h2 id="params">Query parameters</h2>
<ul>
<li><code>where[field][operator]=value</code> - filtering (see <a href="#/docs/querying">Querying</a>).</li>
<li><code>sort=-createdAt,title</code> - ordering; <code>-</code> for descending.</li>
<li><code>limit</code> &amp; <code>page</code> - pagination.</li>
<li><code>depth</code> - how deep to populate relationships and joins.</li>
<li><code>locale</code> &amp; <code>fallback-locale</code> - localization.</li>
</ul>
${code('bash', `curl "http://localhost:3000/api/posts?where[status][equals]=published&sort=-createdAt&depth=1&limit=10"`)}

<h2 id="auth">Authenticating requests</h2>
${code('http', `Authorization: Bearer <token-or-api-key>`)}
<p>Cookie sessions are sent automatically by the browser; API clients use the Bearer header.</p>

<h2 id="errors">Error envelope</h2>
<p>Errors are localized and structured, rendered for the request's locale at the boundary:</p>
${code('json', `{ "error": { "code": "VALIDATION", "message": "title is required" } }`)}`
    },
    {
      slug: 'querying', group: 'Data & APIs', nav: 'Querying & filters', title: 'Querying & the Where syntax',
      lead: 'The operator set, sorting, pagination, and how default sort is resolved.',
      html: `
<h2 id="operators">Where operators</h2>
<p>A <code>Where</code> maps a field to one or more operators. The same object works in REST (<code>where[field][op]=…</code>) and the Local API:</p>
${code('ts', `where: {
  status:    { equals: 'published' },
  title:     { like: 'hello' },          // case-insensitive contains
  views:     { greater_than: 100 },
  rating:    { greater_than_equal: 4 },
  stock:     { less_than: 10 },
  category:  { in: ['news', 'guides'] },
  archived:  { not_equals: true },
  deletedAt: { exists: false },
}`)}
<p>Available operators: <code>equals</code>, <code>not_equals</code>, <code>like</code>, <code>in</code>, <code>not_in</code>, <code>greater_than</code>, <code>greater_than_equal</code>, <code>less_than</code>, <code>less_than_equal</code>, <code>exists</code>.</p>

<h2 id="combining">Combining with and / or</h2>
${code('ts', `where: {
  and: [
    { status: { equals: 'published' } },
    { or: [
      { featured: { equals: true } },
      { views: { greater_than: 1000 } },
    ] },
  ],
}`)}
<p>Over REST: <code>?where[and][0][status][equals]=published&where[and][1][featured][equals]=true</code>.</p>

<h2 id="sort">Sorting & pagination</h2>
${code('ts', `kernel.find({ collection: 'posts', sort: ['-featured', 'title'], limit: 20, page: 2 })`)}

<h2 id="default-sort">How default sort is resolved</h2>
<p>Precedence: an explicit <code>sort</code> argument → the collection's <code>admin.defaultSort</code> → newest-first by <code>createdAt</code> (or <code>id</code> when timestamps are off).</p>
${tip(`Join-field order has no explicit sort, so it follows the <em>related</em> collection's <code>admin.defaultSort</code>. Set it there to make joined lists deterministic.`)}`
    },
    {
      slug: 'graphql', group: 'Data & APIs', nav: 'GraphQL', title: 'GraphQL',
      lead: 'An auto-generated GraphQL endpoint over the same model and access rules.',
      html: `
<h2 id="enable">Enabling it</h2>
<p>GraphQL is on in <code>dev</code> and available at <code>/api/graphql</code>. In production it is <strong>off by default</strong> - set <code>KERNEL_GRAPHQL=true</code> to re-enable it.</p>

<h2 id="query">Querying</h2>
${code('graphql', `query {
  Posts(where: { status: { equals: published } }, sort: "-createdAt", limit: 10) {
    docs { id title author { name } }
    totalDocs
  }
}`)}

<h2 id="mutations">Mutations</h2>
${code('graphql', `mutation {
  createPost(data: { title: "Hello", body: "…" }) { id title }
}`)}
${note(`Every query and mutation runs through the same access pipeline as REST and the Local API - GraphQL never exposes a document the caller couldn't read another way.`)}`
    },
    {
      slug: 'hooks', group: 'Data & APIs', nav: 'Lifecycle hooks', title: 'Lifecycle hooks',
      lead: 'Run logic at well-defined points in the operation pipeline.',
      html: `
<h2 id="available">The hooks</h2>
<p>Collections support five hook arrays; each runs in order and can be async:</p>
${code('ts', `hooks: {
  beforeChange: [({ data, operation, req }) => data],       // mutate input pre-write
  afterChange:  [({ doc, operation, req }) => doc],          // react after a write
  afterRead:    [({ doc, req }) => doc],                     // shape data on the way out
  beforeDelete: [({ id, req }) => { /* guard / cascade */ }],
  afterDelete:  [({ id, doc, req }) => { /* cleanup */ }],
}`)}

<h2 id="beforechange">beforeChange - derive and normalize</h2>
${code('ts', `beforeChange: [
  ({ data, req }) => ({
    ...data,
    slug: data.slug ?? slugify(String(data.title)),
    updatedBy: req.user?.id,
  }),
]`)}

<h2 id="afterchange">afterChange - side effects</h2>
${code('ts', `afterChange: [
  async ({ doc, operation, req }) => {
    if (operation === 'create') {
      await req.context.notify?.(doc) // e.g. enqueue a job, ping a webhook
    }
    return doc
  },
]`)}

<h2 id="afterread">afterRead - outgoing shaping</h2>
${code('ts', `afterRead: [({ doc }) => ({ ...doc, excerpt: String(doc.body).slice(0, 140) })]`)}
${warn(`Hooks run <em>inside</em> the access-checked pipeline. Don't use them to leak fields - field-read access still applies after <code>afterRead</code>. For heavy work in <code>afterChange</code>, enqueue a <a href="#/docs/background-jobs">background job</a> rather than blocking the write.`)}`
    },

    // ---- Build your own -----------------------------------------------------
    {
      slug: 'custom-endpoints', group: 'Build your own', nav: 'Custom endpoints', title: 'Custom endpoints',
      lead: 'Typed, validated, access-controlled HTTP handlers that extend the REST surface.',
      html: `
<p>When CRUD is not enough, add an endpoint with <code>defineEndpoint</code>. It flows through the same access, validation, and error pipeline as the generated routes, and shows up in the OpenAPI docs and the typed client.</p>

<h2 id="basic">A minimal endpoint</h2>
${code('ts', `import { defineEndpoint } from 'kernelcms'

export default defineConfig({
  endpoints: [
    defineEndpoint({
      method: 'POST',
      path: '/posts/:id/publish',
      access: ({ req }) => Boolean(req.user), // secure by default
      handler: async ({ input, ctx }) =>
        ctx.local.update({ collection: 'posts', id: input.params.id, data: { _status: 'published' } }),
    }),
  ],
  // …
})`)}

<h2 id="ctx">The handler context</h2>
<p>Every handler receives <code>{ input, ctx }</code>. <code>ctx</code> is your toolbox:</p>
${code('ts', `handler: async ({ input, ctx }) => {
  ctx.req      // RequestContext: { user, locale, fallbackLocale, context }
  ctx.user     // the authenticated user (or null) - shorthand for ctx.req.user
  ctx.local    // the full typed Local API (kernel)
  ctx.logger   // request-scoped logger
  ctx.request  // the raw web-standard Request (headers, streaming, …)
  // return JSON-serializable data (sent as 200) or a Response
}`)}

<h2 id="validation">Typed input validation</h2>
<p>Validate <code>params</code>, <code>query</code>, and <code>body</code> with any Zod-compatible schema - anything with a <code>parse(value)</code> method. No Zod dependency is forced on the core, yet Zod schemas drop straight in. A parse failure becomes a standard ValidationError:</p>
${code('ts', `import { z } from 'zod'

defineEndpoint({
  method: 'POST',
  path: '/comments/:postId',
  input: {
    params: z.object({ postId: z.string() }),
    body: z.object({ author: z.string().min(1), text: z.string().min(1).max(2000) }),
  },
  access: ({ req }) => Boolean(req.user),
  summary: 'Add a comment',
  tags: ['comments'],
  handler: async ({ input, ctx }) => {
    // input is fully typed: input.params.postId, input.body.text
    return ctx.local.create({
      collection: 'comments',
      data: { post: input.params.postId, ...input.body, by: ctx.user?.id },
    })
  },
})`)}

<h2 id="mcp">Expose an endpoint to AI agents</h2>
<p>Set <code>mcp: true</code> and the endpoint joins the <a href="#/docs/mcp">MCP agent tool surface</a> alongside the generated CRUD tools. It runs through the same <code>invokeEndpoint</code> path as the HTTP route and stays gated by its own <code>access</code> rule - so opting in never widens who can call it:</p>
${code('ts', `defineEndpoint({
  method: 'POST',
  path: '/posts/:id/summarize',
  access: ({ req }) => Boolean(req.user),
  mcp: true, // also callable as an agent tool, still access-gated
  handler: async ({ input, ctx }) => { /* … */ },
})`)}
${warn(`Endpoints are <strong>authenticated-only until you set <code>access</code></strong>, share the same error envelope as core routes, and <strong>cannot shadow</strong> built-in auth or system routes.`)}`
    },
    {
      slug: 'modules', group: 'Build your own', nav: 'Modules', title: 'Modules',
      lead: 'Bundle a collection, endpoints, globals, and jobs into one installable, conflict-checked unit.',
      html: `
<p>A module is a vertical slice - collections + globals + endpoints + jobs that ship and install as one unit. It compiles to a plugin, so it joins the same dependency-ordered, conflict-checked fold. Any duplicate slug, path, or job is a <strong>fatal conflict</strong>, never a silent last-write.</p>

<h2 id="define">Defining a module</h2>
${code('ts', `import { defineModule, defineEndpoint } from 'kernelcms'

export const comments = defineModule({
  name: 'comments',
  version: '1.0.0',
  dependsOn: ['posts'], // optional: ordering by module name
  collections: [
    { slug: 'comments', access: { read: () => true }, fields: [
      { name: 'post', type: 'relationship', relationTo: 'posts' },
      { name: 'text', type: 'textarea', required: true },
      { name: 'approved', type: 'boolean', defaultValue: false },
    ] },
  ],
  endpoints: [
    defineEndpoint({ method: 'POST', path: '/comments/:postId',
      access: ({ req }) => Boolean(req.user),
      handler: async ({ input, ctx }) =>
        ctx.local.create({ collection: 'comments', data: { post: input.params.postId } }) }),
  ],
  jobs: [
    { slug: 'moderate-comments', handler: async ({ local }) => {
      await local.updateMany({ collection: 'comments',
        where: { approved: { equals: false } }, data: { approved: true } })
    } },
  ],
})`)}

<h2 id="install">Installing it</h2>
${code('ts', `export default defineConfig({
  plugins: [comments],
  // …
})`)}

<h2 id="scaffold">Scaffold one</h2>
${code('bash', `npx kernel generate:module comments`)}
${tip(`Because modules are conflict-checked, two modules that both try to define a <code>comments</code> collection fail loudly at boot - you find the clash immediately, not in production.`)}`
    },
    {
      slug: 'plugins', group: 'Build your own', nav: 'Plugins', title: 'Plugins',
      lead: 'Config transformers applied in dependency order - the lowest-level extension point.',
      html: `
<p>A plugin is a function that receives the config-so-far and returns the next config. Modules compile to plugins; reach for a raw plugin when you want to transform <em>existing</em> collections rather than only add new ones (the SEO plugin is the canonical example).</p>

<h2 id="define">definePlugin</h2>
${code('ts', `import { definePlugin } from 'kernelcms'

export const audit = definePlugin<{ collections: string[] }>((options) => ({
  name: 'audit-fields',
  version: '1.0.0',
  setup: ({ config, extend, log }) => {
    log.info('adding audit fields')
    // extend is the only sanctioned mutation path - it is conflict-checked
    return extend.addFieldsToCollections(options.collections, [
      { name: 'updatedBy', type: 'relationship', relationTo: 'users',
        admin: { readOnly: true, position: 'sidebar' } },
    ])
  },
}))`)}

<h2 id="order">Ordering & dependencies</h2>
<p>List <code>dependsOn: ['other-plugin']</code> and KernelCMS resolves a topological order before running any <code>setup</code>. Cycles and missing dependencies are fatal errors, surfaced at boot.</p>

<h2 id="builtin">A built-in example: SEO</h2>
${code('ts', `import { seoPlugin } from 'kernelcms/plugin-seo'

plugins: [
  seoPlugin({ collections: ['posts'], generateTitleFrom: 'title' }),
]`)}
<p>It appends <code>meta_title</code> and <code>meta_description</code> as <strong>top-level</strong> fields (grouped under an "SEO" tab but stored as their own columns, so you can query and sort on them), and won't double-add a field you already declared.</p>`
    },
    {
      slug: 'background-jobs', group: 'Build your own', nav: 'Background jobs', title: 'Background jobs',
      lead: 'Define handlers, enqueue work, and drain due jobs from a cron.',
      html: `
<h2 id="define">Define a job</h2>
<p>Adding any <code>jobs</code> injects a reserved <code>kernel_jobs</code> collection that tracks attempts and run times:</p>
${code('ts', `export default defineConfig({
  jobs: [
    {
      slug: 'send-digest',
      maxAttempts: 3, // retries before marked failed (default 3)
      handler: async ({ input, local, email, job }) => {
        const { docs } = await local.find({ collection: 'posts',
          where: { featured: { equals: true } }, limit: 5 })
        await email?.send({ to: input.to, subject: 'Weekly digest', html: render(docs) })
      },
    },
  ],
  // …
})`)}

<h2 id="enqueue">Enqueue work</h2>
${code('ts', `await kernel.enqueue({
  task: 'send-digest',
  input: { to: 'reader@example.com' },
  runAt: Date.now() + 60_000, // eligible in 1 minute (default: now)
  maxAttempts: 5,
})`)}

<h2 id="drain">Drain due jobs</h2>
<p>Run due jobs in-process, or from a cron with the CLI:</p>
${code('ts', `const { ran, failed } = await kernel.runDueJobs({ limit: 100 })`)}
${code('bash', `# crontab: every minute
* * * * * cd /app && npx kernel jobs:run`)}
${note(`The handler context exposes a focused Local API (<code>find</code>, <code>create</code>, <code>update</code>, <code>updateMany</code>, <code>delete</code>, globals, …) plus the email adapter - enough to do real work without re-importing the kernel.`)}`
    },
    {
      slug: 'admin-customization', group: 'Build your own', nav: 'Admin customization', title: 'Customizing the admin',
      lead: 'Register custom field inputs, list cells, and dashboard widgets - without forking the panel.',
      html: `
<p>The admin is extensible through <code>window.KernelCMS</code> registries. You inject a small script via the server's <code>admin.scripts</code> option and register components by key.</p>

<h2 id="register">Register components</h2>
${code('ts', `// admin-extensions.js - loaded via admin: { scripts: ['/admin-extensions.js'] }
window.KernelCMS.fields.register('ColorPicker', ColorPickerComponent)
window.KernelCMS.cells.register('StatusBadge', StatusBadgeCell)
window.KernelCMS.widgets.register(RecentActivityWidget)`)}

<h2 id="use">Use a custom field component</h2>
<p>Point a field at a registered component by key with <code>admin.component</code>:</p>
${code('ts', `{ name: 'brandColor', type: 'text', admin: { component: 'ColorPicker' } }`)}

<h2 id="ui">UI-only fields</h2>
<p>A <code>ui</code> field renders a component and stores nothing - perfect for a custom button or inline help:</p>
${code('ts', `{ type: 'ui', name: 'syncButton', admin: { component: 'SyncButton' } }`)}

<h2 id="presentation">Presentation without code</h2>
<p>Much of the editor is configurable without custom components: <code>admin.position: 'sidebar'</code>, <code>admin.condition</code> for conditional fields, <code>admin.tab</code> / <code>admin.section</code> for grouping, <code>admin.width</code> on a <code>row</code>, and per-collection <code>admin.defaultColumns</code>.</p>
${code('ts', `{ name: 'externalUrl', type: 'text',
  admin: { condition: (data) => data.type === 'link', width: 50 } }`)}`
    },

    // ---- Media & operations -------------------------------------------------
    {
      slug: 'uploads-and-storage', group: 'Media & operations', nav: 'Uploads & storage', title: 'Uploads & storage',
      lead: 'Upload collections, storage adapters, image variants, and focal points.',
      html: `
<h2 id="collection">An upload collection</h2>
${code('ts', `{
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    maxFileSize: 10 * 1024 * 1024, // 10 MB, enforced server-side
    focalPoint: true,              // editable crop anchor
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, fit: 'cover', format: 'webp', quality: 80 },
      { name: 'og', width: 1200, height: 630, fit: 'cover' },
    ],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}`)}
<p>System fields (<code>filename</code>, <code>mime_type</code>, <code>filesize</code>, <code>checksum</code>, <code>url</code>, …) are injected automatically. Reference uploads from other collections with an <code>upload</code> field:</p>
${code('ts', `{ name: 'cover', type: 'upload', relationTo: 'media' }`)}

<h2 id="storage">Storage adapters</h2>
${code('ts', `import { localStorage, s3Storage, r2, memoryStorage } from 'kernelcms/storage'

storage: localStorage({ rootDir: './.uploads', servePath: '/files' })
// storage: s3Storage({ bucket, region, accessKeyId, secretAccessKey })
// storage: r2({ bucket, accountId, accessKeyId, secretAccessKey })`)}
${warn(`<code>memoryStorage()</code> is great for tests and previews but <strong>loses bytes on restart and isn't shared across nodes</strong>. <code>doctor</code> warns when an upload collection uses it, and errors in production. Use <code>localStorage</code>, S3, or R2 for real deployments.`)}

<h2 id="images">Image variants</h2>
<p>Resized derivatives require an image processor. Install the optional sharp adapter and set it on the config - without it, originals are stored as-is (the lean default):</p>
${code('ts', `import { sharpImageProcessor } from '@kernel/image-sharp'

export default defineConfig({
  image: sharpImageProcessor(),
  // imageSizes on upload collections now generate on upload
})`)}`
    },
    {
      slug: 'versions-and-drafts', group: 'Media & operations', nav: 'Versions & drafts', title: 'Versions & drafts',
      lead: 'Version history, a draft/publish lifecycle, scheduled publishing, and autosave.',
      html: `
<h2 id="enable">Enable versions</h2>
${code('ts', `{ slug: 'posts', versions: true }                       // history only
{ slug: 'posts', versions: { drafts: true, maxPerDoc: 100 } } // + draft/publish`)}
<p>Snapshots are stored in a separate <code>_versions_&lt;slug&gt;</code> table, capped at <code>maxPerDoc</code> (default 100, <code>0</code> = unlimited).</p>

<h2 id="drafts">The draft lifecycle</h2>
<p>With <code>drafts: true</code>, new and edited documents are drafts by default and a <code>_status</code> column tracks <code>draft</code> / <code>published</code>. <code>find()</code> returns <strong>published documents only</strong> unless you pass <code>draft: true</code> (the admin always requests drafts):</p>
${code('ts', `await kernel.publish({ collection: 'posts', id })
await kernel.unpublish({ collection: 'posts', id })

// schedule a future publish - stays a draft until then
await kernel.publish({ collection: 'posts', id, publishAt: '2026-07-01T09:00:00Z' })`)}
${note(`Publishing is a <strong>distinct, access-controlled transition</strong>, gated by the collection's <code>access.publish</code> rule (see <a href="#/docs/access-control">access control</a>) - separate from <code>update</code>, so you can let editors save drafts while only admins go live. <strong>Agent principals are draft-only:</strong> any move to <code>published</code>, including a scheduled <code>_scheduled_at</code>, is rejected for an <a href="#/docs/mcp">AI agent</a>.`)}

<h2 id="scheduled">Driving scheduled publishes</h2>
${code('bash', `# a cron that flips due scheduled publishes
* * * * * cd /app && node -e "require('./run').processScheduledPublishes()"`)}
${code('ts', `await kernel.processScheduledPublishes() // → { published: [ids] }`)}

<h2 id="history">Browsing & restoring history</h2>
${code('ts', `const { docs } = await kernel.findVersions({ collection: 'posts', id, limit: 20 })
await kernel.restoreVersion({ collection: 'posts', id, versionId: docs[1].id })`)}
${note(`Saves can be flagged <code>autosave: true</code> so the version snapshot records that it was auto-saved - the admin uses this to distinguish auto-saved drafts from manual ones.`)}`
    },
    {
      slug: 'caching-and-search', group: 'Media & operations', nav: 'Caching & search', title: 'Caching & search',
      lead: 'Read-through caching and access-checked full-text search, both adapter-based.',
      html: `
<h2 id="cache">Caching</h2>
<p>Set a cache adapter on the config, then opt a collection in. Reads are served read-through and invalidated automatically on any write to that collection:</p>
${code('ts', `import { memoryCache, dbCache, redisCache } from 'kernelcms'

export default defineConfig({
  cache: memoryCache(),           // or dbCache() / redisCache({ url })
  cacheDefaults: { ttl: 60_000 }, // ms; 0 = live until invalidated
  collections: [
    { slug: 'posts', cache: true, fields: [/* … */] },
    { slug: 'pages', cache: { ttl: 300_000 }, fields: [/* … */] },
  ],
})`)}

<h2 id="search">Full-text search</h2>
<p>Set a search adapter and list the searchable fields per collection. The index is updated on write:</p>
${code('ts', `import { memorySearch } from 'kernelcms'

export default defineConfig({
  search: memorySearch(),
  collections: [
    { slug: 'posts', search: { fields: ['title', 'body'] }, fields: [/* … */] },
  ],
})`)}
${code('ts', `const { docs } = await kernel.searchDocs({ collection: 'posts', query: 'headless cms', limit: 25 })`)}
${warn(`Search hits are loaded through the <strong>access-checked read path</strong>, so search never surfaces a document the caller cannot read - results are filtered, not just ranked.`)}`
    },
    {
      slug: 'webhooks', group: 'Media & operations', nav: 'Webhooks', title: 'Webhooks',
      lead: 'Fire signed HTTP POSTs when documents change.',
      html: `
<h2 id="configure">Configure webhooks</h2>
${code('ts', `export default defineConfig({
  webhooks: [
    {
      url: 'https://hooks.example.com/kernel',
      secret: process.env.WEBHOOK_SECRET, // HMAC-SHA256 signing key
      collections: ['posts'],             // default: all non-system collections
      events: ['create', 'update'],       // default: create, update, delete
      headers: { 'x-source': 'kernel' },
      timeoutMs: 5000,
    },
  ],
})`)}

<h2 id="verify">Verifying the signature</h2>
<p>When <code>secret</code> is set, each delivery carries <code>x-kernel-signature: sha256=&lt;hex&gt;</code>. Recompute it over the raw body on your receiver:</p>
${code('ts', `import { createHmac } from 'node:crypto'

const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex')
if (header !== expected) return res.status(401).end()`)}
${warn(`Read the secret from the environment - never hardcode it. Restrict to the specific collections and events you need to keep the delivery surface tight.`)}`
    },
    {
      slug: 'migrations', group: 'Media & operations', nav: 'Migrations', title: 'Migrations',
      lead: 'Diff-based, risk-classified, deterministic - and additive, so you cannot lose data by surprise.',
      html: `
<h2 id="additive">Additive by default</h2>
<p><code>kernel migrate</code> (and <code>dev</code>'s auto-migrate) <strong>only create tables and add columns</strong> - they never drop or retype. You can't lose data by editing your config.</p>

<h2 id="status">Preview before applying</h2>
${code('bash', `npx kernel migrate:status   # exactly what would change, diffed against the snapshot
npx kernel migrate          # apply additive changes`)}
<p>Destructive changes (dropped, renamed, or retyped columns) are <em>reported</em> by <code>migrate:status</code> and by <code>migrate</code> when a snapshot exists, but must be applied by hand - a deliberate guardrail.</p>

<h2 id="snapshot">The schema snapshot</h2>
${code('bash', `npx kernel migrate:snapshot   # record kernel/schema-snapshot.json`)}
<p>Commit <code>kernel/schema-snapshot.json</code>. It is the baseline future drift checks diff against, so your team sees exactly what a deploy will alter.</p>
${tip(`Make <code>kernel doctor</code> your deploy preflight - it runs the static config checks <em>and</em> opens the database to confirm it's reachable, exiting non-zero if either fails.`)}`
    },
    {
      slug: 'cli', group: 'Media & operations', nav: 'CLI reference', title: 'CLI reference',
      lead: 'Every command and the flags they share.',
      html: `
<h2 id="commands">Commands</h2>
<table class="compare"><thead><tr><th>Command</th><th class="us">Does</th></tr></thead><tbody>
<tr><td><code>kernel init</code></td><td>Scaffold a <code>kernel.config.ts</code>.</td></tr>
<tr><td><code>kernel dev</code></td><td>Auto-migrate, start the server + admin, watch the config.</td></tr>
<tr><td><code>kernel start</code></td><td>Production server (no auto-migrate, prod toggles).</td></tr>
<tr><td><code>kernel migrate</code></td><td>Apply additive schema changes.</td></tr>
<tr><td><code>kernel migrate:status</code></td><td>Show pending + destructive changes vs the snapshot.</td></tr>
<tr><td><code>kernel migrate:snapshot</code></td><td>Record the current schema as the baseline.</td></tr>
<tr><td><code>kernel seed</code></td><td>Auto-migrate, then run your exported <code>seed</code>.</td></tr>
<tr><td><code>kernel import</code></td><td>Auto-migrate, then bulk-import data.</td></tr>
<tr><td><code>kernel generate:types</code></td><td>Emit TypeScript interfaces for your collections.</td></tr>
<tr><td><code>kernel generate:module</code></td><td>Scaffold a new module.</td></tr>
<tr><td><code>kernel jobs:run</code></td><td>Drain due background jobs (drive from cron).</td></tr>
<tr><td><code>kernel mcp</code></td><td>Serve the kernel to <a href="#/docs/mcp">AI agents</a> over MCP (stdio by default; <code>--http</code> for multi-agent).</td></tr>
<tr><td><code>kernel doctor</code></td><td>Config + connectivity preflight (non-zero on failure).</td></tr>
<tr><td><code>kernel info</code></td><td>Print resolved config + system facts.</td></tr>
</tbody></table>

<h2 id="flags">Shared flags</h2>
<ul>
<li><code>--config &lt;path&gt;</code> - config path (default <code>./kernel.config.ts</code>). Every data command accepts it.</li>
<li><code>--port &lt;number&gt;</code> - port for <code>dev</code>/<code>start</code> (default <code>$PORT</code> or 3000).</li>
<li><code>--out &lt;path&gt;</code> - output for <code>generate:*</code> / snapshot path for <code>migrate:*</code>.</li>
<li><code>--agent &lt;id&gt;</code> / <code>--http</code> / <code>--host &lt;host&gt;</code> - for <code>kernel mcp</code>: pick the stdio agent principal (required when more than one is configured), serve over HTTP for multiple agents, and bind to a host (default <code>127.0.0.1</code>).</li>
</ul>

<h2 id="seed">The seed convention</h2>
${code('ts', `export const seed = async (kernel) => {
  await kernel.create({
    collection: 'users',
    data: { email: 'admin@example.com', password: 'password123' },
    overrideAccess: true,
  })
}
export default defineConfig({ /* … */ })`)}`
    },
    {
      slug: 'deployment', group: 'Media & operations', nav: 'Deployment', title: 'Deployment',
      lead: 'One container, anywhere - plus embedding the whole CMS inside another app.',
      html: `
<h2 id="docker">A single container</h2>
${code('text', `FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
CMD ["sh", "-c", "npx kernel migrate && npx kernel start"]`)}

<h2 id="env">Production environment</h2>
${code('bash', `KERNEL_SECRET=<long-random-value>
DATABASE_URL=postgres://user:pass@host:5432/db
KERNEL_CORS=https://app.example.com
# opt back in only if you need them:
# KERNEL_OPENAPI=true
# KERNEL_GRAPHQL=true`)}
${warn(`Set <code>KERNEL_SECRET</code> in every non-local environment (doctor errors without it). For CORS, use an explicit origin allow-list - never a wildcard with credentials.`)}

<h2 id="embed">Embed in Next.js (or any framework)</h2>
<p>KernelCMS is a web-standard <code>Request → Response</code> server, so it mounts in a single catch-all route:</p>
${code('ts', `// app/api/[...kernel]/route.ts
import { kernel } from '@/lib/kernel'
export const runtime = 'nodejs'
const handler = (req: Request) => kernel.server.fetch(req)
export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE }`)}
<p>Keep one kernel singleton, run it on the Node.js runtime, and let your platform proxy handle rate limiting. See the <a href="#/guides/embed-nextjs">Next.js guide</a> for the full setup.</p>`
    },
  ];

  // Substitute the config snippet placeholder is no longer needed (inlined above).

  // ===========================================================================
  // GUIDES
  // ===========================================================================
  const GUIDES = [
    {
      slug: 'add-a-backend-to-any-site', tag: 'Tutorial', icon: 'rocket', read: '12 min',
      title: 'Add a Backend to Any Website (Including AI-Generated Sites)',
      excerpt: 'A complete, copy-paste guide to giving any site - static HTML, Next.js, or an AI-generated page from v0, Lovable, Bolt, or Cursor - a real backend, CMS, database, and editable content with KernelCMS. Includes a ready-made AI prompt.',
      faq: [
        { q: 'How do I add a backend to my AI-generated website?', a: 'Install KernelCMS, model your content in a kernel.config.ts file, run kernel dev, and fetch the content from its REST or GraphQL API in your existing frontend. You keep your design and markup; only the data source changes. The ready-made prompt above does it for you with an AI assistant.' },
        { q: 'Can I add a CMS to a static HTML site?', a: 'Yes. KernelCMS runs as a standalone API and admin, so static pages fetch content from /api/<collection> at build time or at runtime. No framework is required.' },
        { q: 'How do I make a v0, Lovable, Bolt, or Cursor site editable?', a: 'Paste the ready-made prompt into the same AI tool (or Claude, Cursor, or ChatGPT) and point it at https://kernelcms.com/llms-full.txt. It will model your content, wire up the API, and replace hardcoded text and images with editable content.' },
        { q: 'What is the best backend for an AI-generated site?', a: 'One that is framework-agnostic, typed, self-hosted, and fast to set up. KernelCMS adds a REST + GraphQL API, a database, authentication, and a no-code admin from a single config file, without locking you into a framework.' },
        { q: 'Do I have to rebuild my site to add a backend?', a: 'No. You keep your existing markup and design and only swap hardcoded content for API calls. KernelCMS sits alongside your frontend rather than replacing it.' },
        { q: 'Can non-developers edit the content afterwards?', a: 'Yes. KernelCMS ships a React admin with live preview and a blocks page builder, so editors change pages, copy, and media with no code.' },
        { q: 'What database does KernelCMS use?', a: 'SQLite by default, via Node\'s built-in node:sqlite with zero native dependencies. Switch to PostgreSQL, MySQL, or MongoDB with a one-line change.' },
      ],
      html: `
<p>You have a website - maybe a static HTML page, a Next.js app, or something an AI tool like <strong>v0, Lovable, Bolt, or Cursor</strong> generated for you. It looks great, but the content is hardcoded. You cannot edit it without touching code, there is no database, no API, and no way for a non-developer to update a heading or add a blog post.</p>
<p>This guide gives that site a real <strong>backend</strong>: a database, a REST and GraphQL API, authentication, and a no-code admin panel - using <a href="#/docs/introduction">KernelCMS</a>, an open-source (MIT) TypeScript headless CMS. You keep your existing design; you only move the content into a backend and read it back. There is a <a href="#prompt">ready-made AI prompt</a> that does the whole thing for you, and a manual walkthrough if you prefer.</p>

<h2 id="how-it-works">How KernelCMS works in one minute</h2>
<p>You describe your content in a single <code>kernel.config.ts</code> file. From that one file, KernelCMS generates everything:</p>
<ul>
<li>A <strong>typed content engine</strong> and a <strong>database</strong> (SQLite by default, zero native dependencies; or Postgres, MySQL, MongoDB).</li>
<li>An auto-generated <strong>REST API</strong> and <strong>GraphQL API</strong>, plus a typed in-process <strong>Local API</strong>.</li>
<li>A polished <strong>React admin panel</strong> with live preview and a page builder, so editors work with no code.</li>
<li>A <strong>CLI</strong> for migrations, seeding, and running the server.</li>
</ul>
<p>It runs on web standards (a <code>Request</code> goes in, a <code>Response</code> comes out), so it has <strong>no framework lock-in</strong> - it sits next to any frontend and deploys as a single container.</p>

<h2 id="prompt">The ready-made prompt (let your AI do it)</h2>
<p>If you built your site with an AI tool, the fastest path is to let the same tool add the backend. Copy this prompt into Claude, Cursor, ChatGPT, v0, Lovable, or Bolt, fill in the two placeholders at the bottom, and run it:</p>
${code('text', `You are adding a backend and CMS to my website using KernelCMS, an open-source
(MIT) TypeScript headless CMS. First, read the full KernelCMS reference here:
https://kernelcms.com/llms-full.txt

How KernelCMS works:
- I define my content model in ONE file, kernel.config.ts (collections + fields).
- From that, KernelCMS generates a REST API, a GraphQL API, a typed in-process
  Local API, a React admin panel, and a CLI. It runs on web standards
  (Request -> Response) with NO framework lock-in, self-hosted on one container.
- Default database is SQLite via node:sqlite (zero native deps). Postgres/MySQL/
  Mongo are a one-line swap.

Do this, step by step, and show me the exact files to create or edit:
1. Install: npm install kernelcms
2. Look at my site and list every piece of content that should be editable
   (headings, paragraphs, images, and repeating items like posts/products/FAQs).
3. Create kernel.config.ts that models each as a collection or a singleton global,
   using the right field types (text, textarea, richText, number, date, upload,
   relationship, array, blocks). Put access: { read: () => true } on anything the
   public site shows. Add one auth collection (auth: true) so I can log in.
4. Run: npx kernel dev   then confirm the admin at /admin and the API at /api work.
5. Seed my CURRENT hardcoded content into the database: write an exported seed
   function (or use kernel import) that creates today's content as documents, using
   overrideAccess: true.
6. In my frontend, replace the hardcoded content with data fetched from KernelCMS.
   Use the typed client from 'kernelcms/client', or plain fetch('/api/<collection>').
   Do NOT change my visual design or markup - only swap the data source.
7. Show me production: npx kernel migrate then npx kernel start, with KERNEL_SECRET
   and DATABASE_URL set.

Constraints: use TypeScript, keep the config minimal and typed, explain each step.

MY SITE (framework / files / description): [paste here]
WHAT SHOULD BE EDITABLE: [list headings, sections, and lists here]`)}
<p>Because the prompt points the assistant at <a href="/llms-full.txt">kernelcms.com/llms-full.txt</a>, it reads the entire KernelCMS reference before writing a line - so the config and API calls it generates are accurate.</p>

<h2 id="manual">Step by step (the manual way)</h2>

<h3 id="install">1. Install</h3>
${code('bash', `npm install kernelcms`)}

<h3 id="model">2. Model your content</h3>
<p>Look at your page and decide what should be editable. A heading and intro become a <strong>global</strong> (a singleton); a list of posts or products becomes a <strong>collection</strong>. Create <code>kernel.config.ts</code>:</p>
${code('ts', `import { defineConfig } from 'kernelcms'
import { sqliteAdapter } from 'kernelcms/sqlite'

export default defineConfig({
  secret: process.env.KERNEL_SECRET ?? 'dev-only-secret',
  db: sqliteAdapter({ url: 'file:./content.db' }),
  collections: [
    { slug: 'users', auth: true, fields: [{ name: 'name', type: 'text' }] },
    {
      slug: 'posts',
      access: { read: () => true }, // public site can read these
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'slug', unique: true },
        { name: 'body', type: 'richText' },
        { name: 'cover', type: 'upload', relationTo: 'media' },
      ],
    },
    { slug: 'media', upload: true, fields: [{ name: 'alt', type: 'text' }] },
  ],
  globals: [
    { slug: 'home', access: { read: () => true }, fields: [
      { name: 'headline', type: 'text' },
      { name: 'intro', type: 'textarea' },
    ] },
  ],
})`)}

<h3 id="run">3. Run it</h3>
${code('bash', `npx kernel dev`)}
<p>This creates the database, starts the API at <code>http://localhost:3000/api</code>, and the admin at <code>http://localhost:3000/admin</code> (the first visit asks you to create your login).</p>

<h3 id="seed">4. Move your existing content in</h3>
<p>Get today's hardcoded content into the database once. Export a <code>seed</code> function next to your config and run <code>npx kernel seed</code>:</p>
${code('ts', `export const seed = async (kernel) => {
  await kernel.updateGlobal({ slug: 'home', overrideAccess: true,
    data: { headline: 'My site', intro: 'The intro that used to be hardcoded.' } })
  await kernel.create({ collection: 'posts', overrideAccess: true,
    data: { title: 'Hello world', slug: 'hello-world', body: '...' } })
}`)}

<h3 id="connect">5. Read it back in your frontend</h3>
<p>Replace the hardcoded values with data from the API. Keep your markup exactly as it is - only the source changes. Plain fetch works anywhere:</p>
${code('ts', `// any frontend - static, React, Vue, Astro, Next.js
const home = await fetch('http://localhost:3000/api/globals/home').then((r) => r.json())
const { docs: posts } = await fetch('http://localhost:3000/api/posts?depth=1').then((r) => r.json())

// render home.headline, home.intro, and posts exactly where the hardcoded text was`)}
<p>Prefer types? Use the typed client:</p>
${code('ts', `import { createClient } from 'kernelcms/client'
const kernel = createClient({ baseURL: 'http://localhost:3000/api' })
const { docs } = await kernel.find({ collection: 'posts', depth: 1 })`)}

<h3 id="edit">6. Hand it to your team (no code)</h3>
<p>That is it - the content now lives in the admin. Anyone you invite can edit headings, copy, images, and add posts at <code>/admin</code>, with live preview and a page builder. No code, no redeploy for content changes.</p>

<h3 id="deploy">7. Deploy</h3>
${code('bash', `# one container, anywhere. set KERNEL_SECRET and DATABASE_URL in production
npx kernel migrate && npx kernel start`)}
<p>Swap the SQLite adapter for <code>postgresAdapter()</code> and set <code>DATABASE_URL</code> when you outgrow a single file. See <a href="#/docs/deployment">Deployment</a>.</p>

<h2 id="migrating">Migrating an existing or AI-generated site</h2>
<p>The pattern is always the same, whatever generated the site:</p>
<ol>
<li><strong>Inventory the content.</strong> Walk the page and list every bit of text, every image, and every repeating block. Repeating blocks (posts, products, testimonials, FAQs) become collections; one-off page content becomes globals.</li>
<li><strong>Model it</strong> in <code>kernel.config.ts</code> with matching field types.</li>
<li><strong>Seed</strong> the current values so nothing visually changes on day one.</li>
<li><strong>Swap the data source</strong> - replace hardcoded JSX/HTML values with API reads, keeping the design identical.</li>
<li><strong>Invite editors.</strong> From now on, content changes happen in the admin, not in code.</li>
</ol>
${tip(`Doing this with an AI assistant? Use the <a href="#prompt">ready-made prompt</a> and point it at <a href="/llms-full.txt">kernelcms.com/llms-full.txt</a> so it has the full reference. It will inventory, model, seed, and rewire your frontend in one pass.`)}

<h2 id="faq">Frequently asked questions</h2>
<h3>How do I add a backend to my AI-generated website?</h3>
<p>Install KernelCMS, model your content in a <code>kernel.config.ts</code> file, run <code>kernel dev</code>, and fetch the content from its REST or GraphQL API in your existing frontend. You keep your design and markup; only the data source changes. The ready-made prompt above does it for you with an AI assistant.</p>
<h3>Can I add a CMS to a static HTML site?</h3>
<p>Yes. KernelCMS runs as a standalone API and admin, so static pages fetch content from <code>/api/&lt;collection&gt;</code> at build time or at runtime. No framework is required.</p>
<h3>How do I make a v0, Lovable, Bolt, or Cursor site editable?</h3>
<p>Paste the ready-made prompt into the same AI tool (or Claude, Cursor, or ChatGPT) and point it at <a href="/llms-full.txt">kernelcms.com/llms-full.txt</a>. It will model your content, wire up the API, and replace hardcoded text and images with editable content.</p>
<h3>What is the best backend for an AI-generated site?</h3>
<p>One that is framework-agnostic, typed, self-hosted, and fast to set up. KernelCMS adds a REST + GraphQL API, a database, authentication, and a no-code admin from a single config file, without locking you into a framework.</p>
<h3>Do I have to rebuild my site to add a backend?</h3>
<p>No. You keep your existing markup and design and only swap hardcoded content for API calls. KernelCMS sits alongside your frontend rather than replacing it.</p>
<h3>Can non-developers edit the content afterwards?</h3>
<p>Yes. KernelCMS ships a React admin with live preview and a blocks page builder, so editors change pages, copy, and media with no code.</p>
<h3>What database does KernelCMS use?</h3>
<p>SQLite by default, via Node's built-in <code>node:sqlite</code> with zero native dependencies. Switch to PostgreSQL, MySQL, or MongoDB with a one-line change.</p>`
    },
    {
      slug: 'embed-nextjs', tag: 'Integration', icon: 'globe', read: '8 min',
      title: 'Embed KernelCMS in Next.js',
      excerpt: 'Mount the full CMS - REST, GraphQL, and admin - inside an existing Next.js app behind a single route.',
      html: `<p>KernelCMS is a web-standard <code>Request → Response</code> server, so it drops into any Next.js route handler. You keep one kernel singleton, run it on the Node.js runtime, and let the platform proxy handle rate limiting.</p>
<h2 id="singleton">A kernel singleton</h2>
${code('ts', `// lib/kernel.ts
import { initKernel } from 'kernelcms'
import config from '../kernel.config.ts'
export const kernel = await initKernel(config)`)}
<h2 id="route">A single catch-all route</h2>
${code('ts', `// app/api/[...kernel]/route.ts
import { kernel } from '@/lib/kernel'
export const runtime = 'nodejs'
const handler = (req: Request) => kernel.server.fetch(req)
export { handler as GET, handler as POST, handler as PUT, handler as DELETE }`)}
<h2 id="tsconfig">Allow .ts imports</h2>
<p>The config graph uses <code>.ts</code> import extensions, so allow them in the tsconfig that covers it:</p>
${code('json', `{ "compilerOptions": { "allowImportingTsExtensions": true, "noEmit": true } }`)}`
    },
    {
      slug: 'uploads-images', tag: 'Media', icon: 'box', read: '6 min',
      title: 'Uploads & image variants',
      excerpt: 'Add S3 or R2 storage and auto-generate resized image variants with focal points.',
      html: `<p>Add a storage adapter, an image processor, and an <code>imageSizes</code> list, then reference uploads with an <code>upload</code> field.</p>
${code('ts', `import { s3Storage } from 'kernelcms/storage'
import { sharpImageProcessor } from '@kernel/image-sharp'

export default defineConfig({
  storage: s3Storage({ bucket: process.env.S3_BUCKET }),
  image: sharpImageProcessor(),
  collections: [
    { slug: 'media', upload: {
      focalPoint: true,
      imageSizes: [
        { name: 'thumb', width: 400, fit: 'cover', format: 'webp' },
        { name: 'hero', width: 1600 },
      ],
    }, fields: [{ name: 'alt', type: 'text', required: true }] },
  ],
})`)}`
    },
    {
      slug: 'auth-2fa', tag: 'Auth', icon: 'lock', read: '7 min',
      title: 'Password reset & two-factor',
      excerpt: 'Turn on email password reset and TOTP two-factor with one config flag each.',
      html: `<p>Auth features are opt-in on the collection. No user-enumeration, scrypt hashing, and TOTP built on <code>node:crypto</code> with zero extra dependencies.</p>
${code('ts', `{ slug: 'users', auth: { forgotPassword: true, twoFactor: true, verify: true } }`)}
<h2 id="reset">Wire the reset flow</h2>
${code('ts', `await kernel.forgotPassword({ collection: 'users', email })
// user clicks the emailed link → your page calls:
await kernel.resetPassword({ collection: 'users', token, password })`)}`
    },
    {
      slug: 'commerce', tag: 'Commerce', icon: 'rocket', read: '10 min',
      title: 'Add products & checkout',
      excerpt: 'The commerce module gives you products, orders, a server-side checkout, and signed Stripe webhooks.',
      html: `<p>Add the <code>commerce()</code> plugin with a payment adapter and you get <code>products</code> + <code>orders</code> collections, a <code>POST /commerce/checkout</code> that recomputes totals from real prices server-side, and a signature-verified webhook.</p>
${code('ts', `import { commerce, stripePayment } from 'kernelcms'

export default defineConfig({
  plugins: [commerce({ payment: stripePayment({ secret: process.env.STRIPE_KEY }) })],
})`)}
${note(`A deterministic <code>testPayment()</code> adapter ships alongside Stripe so you can test the full checkout in CI without network calls.`)}`
    },
    {
      slug: 'deploy-railway', tag: 'Deploy', icon: 'globe', read: '5 min',
      title: 'Deploy to a single container',
      excerpt: 'One Dockerfile, one container, anywhere - with Postgres via DATABASE_URL.',
      html: `<p>KernelCMS ships as one container. Set <code>KERNEL_SECRET</code> and <code>DATABASE_URL</code>, run <code>migrate</code> on boot, then <code>start</code>.</p>
${code('text', `CMD ["sh", "-c", "npx kernel migrate && npx kernel start"]`)}
${code('bash', `KERNEL_SECRET=<long-random>
DATABASE_URL=postgres://user:pass@host:5432/db`)}`
    },
    {
      slug: 'custom-fields', tag: 'Admin', icon: 'feather', read: '6 min',
      title: 'Custom admin field components',
      excerpt: 'Register custom field inputs, list cells, and dashboard widgets via window.KernelCMS.',
      html: `<p>The admin exposes registries for extension without forking it. Load a script via the server's <code>admin.scripts</code> option, then register by key.</p>
${code('ts', `window.KernelCMS.fields.register('ColorPicker', ColorPicker)
window.KernelCMS.cells.register('StatusBadge', StatusBadge)
window.KernelCMS.widgets.register(RecentActivity)`)}
${code('ts', `{ name: 'brandColor', type: 'text', admin: { component: 'ColorPicker' } }`)}`
    },
  ];

  // ===========================================================================
  // BLOG
  // ===========================================================================
  const cmp = (head, rows) => `<table class="compare"><thead><tr><th></th><th class="us">KernelCMS</th><th>${head}</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td class="us-col">${r[1]}</td><td class="meh">${r[2]}</td></tr>`).join('')}</tbody></table>`;
  const asof = note(`<strong>Facts current as of June 2026.</strong> Headless-CMS pricing, ownership, and feature sets change quickly - verify the specifics against each vendor before you decide. This is KernelCMS's own blog, so we have skin in the game; we've tried to keep the comparisons fair and to say plainly where the others are better.`);

  const BLOG = [
    {
      slug: 'kernelcms-vs-payload', tag: 'Comparison', read: '9 min', date: 'Jun 11, 2026', author: 'Robbin Pilhede', cover: 'payload',
      title: 'KernelCMS vs Payload: two code-first CMSs, one big difference',
      excerpt: 'They share a philosophy - TypeScript, config-as-code, a typed Local API, auto-generated REST and GraphQL. The real split is framework coupling: Payload 3 lives inside Next.js; KernelCMS runs on bare web standards.',
      html: `
<p>Of every CMS in this series, Payload is the one KernelCMS resembles most. Both are open-source, MIT-licensed, and TypeScript-native. Both model content as code, expose an in-process Local API alongside auto-generated REST and GraphQL, and lean on access functions and lifecycle hooks. If you squint at a collection definition, you could mistake one for the other.</p>
<p>So this comparison is less about features and more about a single architectural decision - and what it costs you.</p>

<h2 id="facts">The hard facts</h2>
${cmp('Payload', [
  ['License', 'MIT', 'MIT'],
  ['Language', 'TypeScript, config-as-code', 'TypeScript, config-as-code'],
  ['Framework', 'None - web-standard Request → Response', 'Next.js (Payload 3 runs in the App Router)'],
  ['Databases', 'SQLite (node:sqlite), Postgres, MySQL, Mongo', 'MongoDB, Postgres, SQLite (Drizzle)'],
  ['APIs', 'REST, GraphQL, typed Local API', 'REST, GraphQL, Local API'],
  ['Rich text', 'Structured richText', 'Lexical (deep block/inline support)'],
  ['Admin', 'React on TanStack', 'React inside Next.js'],
  ['Default install', 'Zero native deps (node:sqlite)', 'Heavier; Next.js toolchain'],
  ['Hosting', 'Self-host single container; Cloud', 'Self-host; Payload Cloud (Figma-owned)'],
  ['Maturity', 'New (2026)', 'Mature, large community'],
])}

<h2 id="modeling">Modeling the same content</h2>
<p>Here is a posts collection in Payload:</p>
${code('ts', `import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } }),
  collections: [
    {
      slug: 'posts',
      access: { read: () => true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'author', type: 'relationship', relationTo: 'users' },
      ],
    },
  ],
})`)}
<p>And the same thing in KernelCMS:</p>
${code('ts', `import { defineConfig } from 'kernelcms'
import { postgresAdapter } from 'kernelcms/postgres'

export default defineConfig({
  db: postgresAdapter(), // reads DATABASE_URL
  collections: [
    {
      slug: 'posts',
      access: { read: () => true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'author', type: 'relationship', relationTo: 'users' },
      ],
    },
  ],
})`)}
<p>Near-identical, by design. The field set, access shape, and relationship model are deliberately familiar. Querying is the same story:</p>
${code('ts', `// Payload
const { docs } = await payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, depth: 1 })

// KernelCMS
const { docs } = await kernel.find({ collection: 'posts', where: { status: { equals: 'published' } }, depth: 1 })`)}

<h2 id="difference">The one big difference</h2>
<p>Payload 3 is built <em>on</em> Next.js - it installs into your Next app and runs inside the App Router. If you are already a Next.js shop, that is a genuine advantage: one app, one build, one deploy, server components that read content directly.</p>
<p>KernelCMS takes the opposite stance. It is a web-standard <code>Request → Response</code> server with no framework opinion. It runs on bare Node, on the edge, or in any container, and it embeds into Next.js, Nuxt, Astro, or nothing at all - through one catch-all route:</p>
${code('ts', `// app/api/[...kernel]/route.ts - KernelCMS inside Next, by choice not by requirement
import { kernel } from '@/lib/kernel'
export const runtime = 'nodejs'
const handler = (req: Request) => kernel.server.fetch(req)
export { handler as GET, handler as POST, handler as PUT, handler as DELETE }`)}

<h2 id="payload-wins">Where Payload wins</h2>
<ul>
<li><strong>Maturity.</strong> Years in production, a large community, and a deep plugin ecosystem. KernelCMS is new; Payload is proven.</li>
<li><strong>The editor.</strong> Payload's Lexical-based rich text supports inline blocks, custom nodes, and a mature extension API. It is the single biggest gap for any newcomer, KernelCMS included.</li>
<li><strong>Next.js integration.</strong> If your product <em>is</em> a Next app, Payload's in-app model is a feature, not a constraint.</li>
<li><strong>Backing.</strong> Figma acquired Payload in 2025 - resources and longevity behind it.</li>
</ul>

<h2 id="kernel-wins">Where KernelCMS wins</h2>
<ul>
<li><strong>No framework coupling.</strong> Run the whole CMS - engine, admin, APIs - without adopting Next.js or any framework. Deploy it as one lean container.</li>
<li><strong>Lean by default.</strong> The default database is <code>node:sqlite</code>: zero native dependencies, nothing to compile, boots in seconds.</li>
<li><strong>Portability.</strong> Web-standard request handling means Node, edge, on-prem, or embedded in whatever framework you already use.</li>
</ul>

<h2 id="verdict">Verdict</h2>
<p>If your stack is Next.js and you want the most mature editor and ecosystem available in open source, <strong>Payload is an excellent, safe choice</strong> - and its Next integration will feel like a superpower. If you want a CMS that stays out of your stack - embeddable anywhere, deployable as a single lean container, with no framework opinion - that is precisely the gap KernelCMS was built to fill.</p>
${asof}`
    },
    {
      slug: 'kernelcms-vs-sanity', tag: 'Comparison', read: '8 min', date: 'Jun 9, 2026', author: 'Robbin Pilhede', cover: 'sanity',
      title: 'KernelCMS vs Sanity: own your data, or rent best-in-class editing',
      excerpt: 'Sanity gives you real-time collaboration and a zero-ops hosted backend - at the cost of lock-in to the Content Lake and a usage-based bill. KernelCMS gives you the whole stack, self-hosted, MIT.',
      html: `
<p>Sanity and KernelCMS sit on opposite ends of the headless spectrum. Sanity is a hosted platform: your content lives in its proprietary <em>Content Lake</em>, you query it with GROQ, and editors collaborate in real time in the open-source Studio. KernelCMS is software you run: your content lives in your database, and you own every byte.</p>
<p>The choice is less "which has more features" than "what do you want to own."</p>

<h2 id="facts">The hard facts</h2>
${cmp('Sanity', [
  ['License', 'MIT (core)', 'Studio MIT; Content Lake proprietary'],
  ['Where content lives', 'Your database', 'Hosted Content Lake (no self-host)'],
  ['Query', 'REST, GraphQL, typed Local API', 'GROQ + GraphQL'],
  ['Real-time collaboration', 'Not yet', 'Yes - best-in-class'],
  ['Hosting', 'Self-host anywhere', 'SaaS; data lives in Sanity'],
  ['Pricing', 'Free (OSS) + your infra', 'Usage-based SaaS; free tier, scales up'],
  ['Image CDN', 'Bring your own (S3/R2 + sharp)', 'Hosted pipeline + CDN included'],
  ['Lock-in', 'None - portable content', 'Content Lake + GROQ'],
])}

<h2 id="modeling">Modeling content</h2>
<p>A Sanity schema is JavaScript/TypeScript using its <code>defineType</code> helpers:</p>
${code('ts', `import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }), // Portable Text
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
  ],
})`)}
<p>KernelCMS models the same thing in its config, and the field types map to real database columns rather than documents in a hosted lake:</p>
${code('ts', `{
  slug: 'posts',
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    { name: 'author', type: 'relationship', relationTo: 'authors' },
  ],
}`)}

<h2 id="querying">Querying</h2>
<p>Sanity's GROQ is genuinely powerful - a concise, projection-first query language:</p>
${code('text', `*[_type == "post" && defined(slug.current)] | order(_createdAt desc) [0...10] {
  title,
  "author": author->name
}`)}
<p>KernelCMS uses a structured <code>Where</code> object across REST, GraphQL, and the Local API - less expressive than GROQ, but typed and uniform:</p>
${code('ts', `await kernel.find({
  collection: 'posts',
  where: { slug: { exists: true } },
  sort: '-createdAt',
  limit: 10,
  depth: 1,
})`)}

<h2 id="sanity-wins">Where Sanity wins</h2>
<ul>
<li><strong>Real-time collaboration.</strong> Multiple editors in the same document, live - the best in the category. KernelCMS has no equivalent today.</li>
<li><strong>Portable Text.</strong> A serious, well-specified model for structured rich content.</li>
<li><strong>Zero-ops backend + image CDN.</strong> No database to run, no media pipeline to build - it is all hosted and fast.</li>
<li><strong>GROQ.</strong> For complex content shaping, GROQ is more expressive than a structured filter object.</li>
</ul>

<h2 id="kernel-wins">Where KernelCMS wins</h2>
<ul>
<li><strong>You own the data.</strong> It lives in your Postgres/SQLite/MySQL/Mongo - no Content Lake, no export step to leave.</li>
<li><strong>Self-host anywhere,</strong> including on-prem and air-gapped, where a hosted SaaS simply can't go.</li>
<li><strong>Predictable cost.</strong> No per-seat or usage billing that grows with traffic and team size.</li>
<li><strong>One uniform API surface</strong> - REST, GraphQL, and a typed Local API over the same access rules - without learning a query language.</li>
</ul>

<h2 id="verdict">Verdict</h2>
<p>Choose <strong>Sanity</strong> when collaborative editing and a managed, scalable backend are worth lock-in and a usage bill - for many content teams, they are. Choose <strong>KernelCMS</strong> when data ownership, self-hosting, and predictable cost matter more than hosted convenience.</p>
${asof}`
    },
    {
      slug: 'kernelcms-vs-strapi', tag: 'Comparison', read: '7 min', date: 'Jun 5, 2026', author: 'KernelCMS Team', cover: 'strapi',
      title: 'KernelCMS vs Strapi: code-first vs admin-first modeling',
      excerpt: 'Strapi models content in an admin UI and ships a huge plugin marketplace. KernelCMS models content in typed code you can review and version. The difference shows up the day your schema changes.',
      html: `
<p>Strapi is one of the most popular open-source headless CMSs, and for good reason: a friendly admin, a big plugin marketplace, and broad database support. Its defining trait is that you build your content model primarily in a UI - the Content-Type Builder - which writes schema files behind the scenes.</p>
<p>KernelCMS inverts that: the model is code first, always. Which you prefer depends on who edits your schema, and how.</p>

<h2 id="facts">The hard facts</h2>
${cmp('Strapi', [
  ['License', 'MIT', 'Community Edition (open source) + paid Enterprise'],
  ['Language', 'TypeScript-first', 'JavaScript/TypeScript'],
  ['Content model', 'Typed code (kernel.config.ts)', 'Admin UI (Content-Type Builder) + schema files'],
  ['Databases', 'SQLite, Postgres, MySQL, Mongo', 'SQLite, Postgres, MySQL, MariaDB'],
  ['APIs', 'REST, GraphQL, typed Local API', 'REST, GraphQL'],
  ['Ecosystem', 'Plugins + modules (new)', 'Large, mature plugin marketplace'],
  ['Framework', 'None (web-standard server)', 'Node.js (Koa-based)'],
])}

<h2 id="modeling">Modeling content</h2>
<p>In Strapi, a content type is typically created in the admin; the generated schema looks like this:</p>
${code('json', `{
  "kind": "collectionType",
  "collectionName": "posts",
  "info": { "singularName": "post", "pluralName": "posts" },
  "attributes": {
    "title": { "type": "string", "required": true },
    "body": { "type": "richtext" },
    "author": { "type": "relation", "relation": "manyToOne", "target": "api::author.author" }
  }
}`)}
<p>KernelCMS keeps the model in typed code that lives in version control and gets code-reviewed like anything else:</p>
${code('ts', `{
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    { name: 'author', type: 'relationship', relationTo: 'authors' },
  ],
}`)}

<h2 id="querying">Querying</h2>
${code('http', `# Strapi REST
GET /api/posts?filters[status][$eq]=published&populate=author`)}
${code('http', `# KernelCMS REST
GET /api/posts?where[status][equals]=published&depth=1`)}

<h2 id="strapi-wins">Where Strapi wins</h2>
<ul>
<li><strong>Plugin marketplace.</strong> A large catalogue of community plugins - the deepest in open-source CMS land.</li>
<li><strong>Admin-first modeling.</strong> Non-developers can build content types without touching code.</li>
<li><strong>Maturity and community.</strong> Battle-tested, widely deployed, lots of tutorials and hires who know it.</li>
</ul>

<h2 id="kernel-wins">Where KernelCMS wins</h2>
<ul>
<li><strong>The model is code.</strong> Versioned, reviewable, diffable - no drift between what the UI built and what's in git.</li>
<li><strong>No-code editing too.</strong> The model is code, but your team still edits pages, copy, and media in a no-code admin with live preview and a page builder. You don't trade editor-friendliness for code-first modeling; you keep both.</li>
<li><strong>TypeScript-first inference</strong> across collections, the Local API, and the generated client.</li>
<li><strong>Lighter and framework-agnostic</strong> - a web-standard server, not a Node framework you boot into.</li>
<li><strong>Deterministic migrations</strong> generated from the model, previewable before they run.</li>
</ul>

<h2 id="verdict">Verdict</h2>
<p>Choose <strong>Strapi</strong> if you value an admin-driven workflow for non-developers and the largest plugin ecosystem in open source. Choose <strong>KernelCMS</strong> if your content model belongs in code - typed, reviewed, and versioned alongside the rest of your application.</p>
${asof}`
    },
    {
      slug: 'kernelcms-vs-contentful', tag: 'Comparison', read: '6 min', date: 'Jun 2, 2026', author: 'KernelCMS Team', cover: 'contentful',
      title: 'KernelCMS vs Contentful: self-hosted code vs enterprise SaaS',
      excerpt: 'Contentful is the enterprise API-first standard - global CDN, environments, SLAs. KernelCMS is the self-hosted, MIT, code-first alternative without the bill or the lock-in.',
      html: `
<p>Contentful helped define the headless category and remains the default for large enterprises: an API-first, fully hosted platform with a global CDN, content environments, and the operational guarantees big companies require. KernelCMS competes on a different axis - ownership and cost - rather than trying to out-enterprise the enterprise.</p>

<h2 id="facts">The hard facts</h2>
${cmp('Contentful', [
  ['License', 'MIT', 'Proprietary SaaS'],
  ['Hosting', 'Self-host (your infra)', 'SaaS only'],
  ['Content model', 'Typed code', 'Web UI / Content Management API'],
  ['Delivery API', 'REST + GraphQL + Local', 'Content Delivery API (REST) + GraphQL'],
  ['CDN', 'Bring your own', 'Global CDN included'],
  ['Environments', 'Branches via your own infra', 'First-class spaces + environments'],
  ['Pricing', 'Free (OSS) + your infra', 'SaaS; enterprise pricing at scale'],
])}

<h2 id="modeling">Modeling content</h2>
<p>Contentful content types are usually defined in the web app or via the management API; you then read content over the Delivery API:</p>
${code('http', `# Contentful Content Delivery API
GET https://cdn.contentful.com/spaces/{space}/environments/master/entries?content_type=post
Authorization: Bearer <delivery-token>`)}
<p>KernelCMS defines the model in code and serves it from your own infrastructure:</p>
${code('ts', `{ slug: 'posts', access: { read: () => true }, fields: [
  { name: 'title', type: 'text', required: true },
  { name: 'body', type: 'richText' },
] }`)}
${code('http', `# KernelCMS REST, from your own domain
GET /api/posts?where[status][equals]=published&depth=1`)}

<h2 id="contentful-wins">Where Contentful wins</h2>
<ul>
<li><strong>Enterprise scale and reliability.</strong> A proven global CDN, uptime SLAs, and the operational maturity large orgs need.</li>
<li><strong>Environments and spaces.</strong> First-class content branching and staging built in.</li>
<li><strong>Integrations and governance.</strong> A deep marketplace plus roles, audit, and compliance tooling.</li>
</ul>

<h2 id="kernel-wins">Where KernelCMS wins</h2>
<ul>
<li><strong>You own the data and the deployment</strong> - no SaaS dependency, no vendor outage you can't fix.</li>
<li><strong>Cost.</strong> No platform bill that scales with API calls, seats, and records.</li>
<li><strong>Code-first model</strong> with full type inference and a typed Local API.</li>
<li><strong>No lock-in.</strong> Standard databases, portable content, MIT license.</li>
</ul>

<h2 id="verdict">Verdict</h2>
<p>Choose <strong>Contentful</strong> when you need enterprise-grade hosted infrastructure, environments, and SLAs, and the budget is there. Choose <strong>KernelCMS</strong> when you'd rather own the stack, control the cost, and keep the content model in code.</p>
${asof}`
    },
    {
      slug: 'kernelcms-vs-directus', tag: 'Comparison', read: '7 min', date: 'May 28, 2026', author: 'KernelCMS Team', cover: 'directus',
      title: 'KernelCMS vs Directus: config-first vs database-first',
      excerpt: 'Directus wraps an existing SQL database and gives you an instant API. KernelCMS defines the model in typed code and generates the database. Two philosophies - and a licensing difference worth knowing.',
      html: `
<p>Directus is the standout database-first option: point it at an existing SQL database and it mirrors your tables into an instant REST and GraphQL API with a polished data studio. KernelCMS goes the other way - you describe the model in code, and it owns and migrates the schema for you.</p>
<p>If you already have a database full of data, that difference is the whole decision.</p>

<h2 id="facts">The hard facts</h2>
${cmp('Directus', [
  ['License', 'MIT', 'BSL 1.1 (converts to GPL; not OSI-approved)'],
  ['Approach', 'Config-first (model in code)', 'Database-first (model in the database)'],
  ['Databases', 'SQLite, Postgres, MySQL, Mongo', 'Postgres, MySQL, SQLite, MS SQL, Oracle'],
  ['Admin', 'React on TanStack', 'Vue "Data Studio"'],
  ['APIs', 'REST, GraphQL, typed Local API', 'REST, GraphQL, SDK'],
  ['Best for', 'New, code-owned schemas', 'Wrapping existing/legacy databases'],
])}
${warn(`One concrete licensing fact: KernelCMS is <strong>MIT</strong>; Directus moved to the <strong>Business Source License (BSL 1.1)</strong>, which is source-available but not OSI-approved open source (each version converts to GPL after a delay). For some teams and procurement processes, that distinction matters.`)}

<h2 id="modeling">Modeling content</h2>
<p>With Directus, the database is the source of truth - you define tables (in SQL or the studio) and Directus exposes them:</p>
${code('text', `-- Directus: your database table IS the content model
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  author INTEGER REFERENCES authors(id)
);`)}
<p>With KernelCMS, the code is the source of truth and the schema is generated from it:</p>
${code('ts', `{ slug: 'posts', fields: [
  { name: 'title', type: 'text', required: true },
  { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' },
  { name: 'author', type: 'relationship', relationTo: 'authors' },
] }`)}

<h2 id="querying">Querying</h2>
${code('ts', `// Directus SDK
import { createDirectus, rest, readItems } from '@directus/sdk'
const client = createDirectus('https://example.com').with(rest())
const posts = await client.request(readItems('posts', { filter: { status: { _eq: 'published' } } }))`)}
${code('ts', `// KernelCMS Local API
const { docs } = await kernel.find({ collection: 'posts', where: { status: { equals: 'published' } } })`)}

<h2 id="directus-wins">Where Directus wins</h2>
<ul>
<li><strong>Existing databases.</strong> Point it at a database you already have and get an API in minutes - no remodeling.</li>
<li><strong>SQL-native.</strong> Your data stays in plain tables you can query directly with any SQL tool.</li>
<li><strong>The Data Studio.</strong> A flexible, no-code admin for exploring and editing arbitrary data.</li>
</ul>

<h2 id="kernel-wins">Where KernelCMS wins</h2>
<ul>
<li><strong>The model lives in version control</strong> - typed, reviewed, and diffable, not implied by table structure.</li>
<li><strong>MIT vs BSL.</strong> A permissive, OSI-approved license with no conversion clause.</li>
<li><strong>Typed Local API</strong> and end-to-end inference from the same config.</li>
<li><strong>Deterministic, additive migrations</strong> generated from code - preview every change before it runs.</li>
</ul>

<h2 id="verdict">Verdict</h2>
<p>Choose <strong>Directus</strong> when you have an existing SQL database to expose, or you want SQL-native data with a no-code studio on top. Choose <strong>KernelCMS</strong> when you're building a new model you'd rather own in typed code, under an MIT license, with migrations derived from that code.</p>
${asof}`
    },
    {
      slug: 'agent-native-cms', tag: 'Vision', read: '6 min', date: 'Jun 12, 2026', author: 'KernelCMS Team', cover: 'brand',
      title: 'The content layer agents and humans share',
      excerpt: 'Every company is wiring agents into their content. Almost nobody is doing it with a real permission model. Here is how KernelCMS treats an agent as a first-class, access-controlled actor.',
      html: `<p>In 2026, the interesting question about a CMS is no longer "how do editors put words on a page." It is "who - or <em>what</em> - is allowed to read and write this content, and under which rules." Agents are now writers, summarizers, and moderators. They need the same thing humans have always needed: scoped, audited access.</p>
<h2 id="api-glue">The problem with API glue</h2>
<p>Most teams bolt an agent onto their CMS through a pile of hand-rolled API calls and a service token with god-mode. That token can read every draft, every user record, every secret field. There is no row-level scoping, no field-level redaction, no audit trail.</p>
<blockquote>An agent should not be able to read or write a field that a human in the same role could not.</blockquote>
<h2 id="same-model">One access model over both</h2>
<p>KernelCMS already runs every operation - human or machine - through the same pipeline: defaults, access, hooks, validation, serialize, adapter, populate. Because an agent enters through the exact same Local API and the exact same access engine, it inherits the exact same guarantees. No second authorization path to get wrong.</p>
<h2 id="why-now">Why this matters now</h2>
<p>The auto-generated, typed, access-checked surface that already exists in every KernelCMS instance is one short step from a permissioned tool surface any agent can use. Payload is a CMS with an API. We want KernelCMS to be a content layer that agents and humans share - with one access model over both.</p>`
    },
    {
      slug: 'lean-by-default', tag: 'Engineering', read: '5 min', date: 'Jun 6, 2026', author: 'KernelCMS Team',
      title: 'Lean by default: why node:sqlite is the default database',
      excerpt: 'A fresh CMS should boot in seconds with nothing to compile. Here is the design rule that keeps the core tiny.',
      html: `<p>The guiding rule of the whole codebase is simple: heavy or opinionated dependencies live behind optional adapters, never in <code>@kernel/core</code>. The lean default is the product.</p>
<h2 id="sqlite">node:sqlite, zero native deps</h2>
<p>The default database adapter is built on Node's own <code>node:sqlite</code>. No compile step, no <code>node-gyp</code>, no platform-specific binaries. A new project boots in seconds and a single file is your database. When you outgrow it, swap one line for Postgres, MySQL, or MongoDB.</p>
<h2 id="adapters">Everything else is opt-in</h2>
<p>Image processing pulls in <code>sharp</code> - so it is a separate package you install only if you need it. Redis caching, S3 storage, OAuth: all adapters. The core stays native-dependency-free, which keeps installs fast and cold starts light.</p>`
    },
    {
      slug: 'migrations-that-dont-scare', tag: 'Engineering', read: '4 min', date: 'May 30, 2026', author: 'KernelCMS Team',
      title: 'Migrations that do not scare you',
      excerpt: 'Diff-based, risk-classified, deterministic. How KernelCMS turns schema change from a chore into a preview.',
      html: `<p>Schema migrations are where a lot of CMSs quietly fall apart. KernelCMS diffs your content model against the live database and produces a deterministic plan, classified by risk, that you can read before you run it.</p>
<h2 id="additive">Additive, so you can't lose data</h2>
<p><code>kernel migrate</code> only creates tables and adds columns - it never drops or retypes. Destructive changes are reported, not silently applied.</p>
<h2 id="preview">Preview, then apply</h2>
${code('bash', `npx kernel migrate:status   # exactly what would change, and how risky
npx kernel migrate          # apply the additive plan`)}
<p>Because the plan is derived from your config, it is reproducible across environments - the same model always yields the same migration.</p>`
    },
  ];

  // --- Trust / E-E-A-T metadata for the comparison & thought articles --------
  // Real citations, author attribution, methodology, and extractable summaries.
  const METHOD = 'Each comparison is based on the competitor\'s official documentation and hands-on use of both tools, weighing architecture, licensing, hosting, APIs, and the developer and editor experience. We revise them as the tools change.';
  const BIO_ROBBIN = 'Robbin Pilhede is the creator and maintainer of KernelCMS. These comparisons draw on hands-on experience building the engine and on each competitor\'s official documentation.';
  const BIO_TEAM = 'Written by the KernelCMS team, based on each tool\'s official documentation and hands-on use of the software.';
  const KCMS_DOCS = { title: 'KernelCMS documentation', url: 'https://kernelcms.com/docs' };

  const BLOG_META = {
    'kernelcms-vs-payload': {
      updated: 'Jun 13, 2026', authorBio: BIO_ROBBIN, methodology: METHOD,
      tldr: 'Payload and KernelCMS share a TypeScript, config-as-code design and a typed Local API. Choose Payload for maturity, the Lexical editor, and tight Next.js integration; choose KernelCMS to avoid framework coupling and ship a lean single container.',
      sources: [{ title: 'Payload documentation', url: 'https://payloadcms.com/docs' }, { title: 'Payload: what is Payload (runs on Next.js)', url: 'https://payloadcms.com/docs/getting-started/what-is-payload' }, KCMS_DOCS],
      faq: [
        { q: 'Is KernelCMS a good Payload alternative?', a: 'If you want the same TypeScript, config-as-code workflow and a typed Local API without coupling your CMS to Next.js, yes. Payload remains the more mature option, with a richer rich-text editor and a larger ecosystem.' },
        { q: 'Does Payload require Next.js?', a: 'Payload 3 runs inside the Next.js App Router. KernelCMS runs on a web-standard Request-to-Response server and deploys as a standalone container or embeds into any framework.' },
      ],
    },
    'kernelcms-vs-sanity': {
      updated: 'Jun 13, 2026', authorBio: BIO_ROBBIN, methodology: METHOD,
      tldr: 'Sanity offers best-in-class real-time editing on a hosted backend; KernelCMS lets you self-host and own your data under MIT. Pick based on whether you value managed collaboration or data ownership and predictable cost.',
      sources: [{ title: 'Sanity documentation', url: 'https://www.sanity.io/docs' }, { title: 'GROQ query language', url: 'https://www.sanity.io/docs/groq' }, KCMS_DOCS],
      faq: [
        { q: 'Can I self-host Sanity?', a: 'No. Sanity stores content in its hosted Content Lake. KernelCMS is self-hosted and keeps content in your own database.' },
        { q: 'Is KernelCMS a good Sanity alternative?', a: 'If you want to own your data, self-host, and avoid usage-based pricing, yes. Sanity still leads on real-time collaboration and managed infrastructure.' },
      ],
    },
    'kernelcms-vs-strapi': {
      updated: 'Jun 13, 2026', authorBio: BIO_TEAM, methodology: METHOD,
      tldr: 'Strapi models content in an admin UI with a large plugin marketplace; KernelCMS models it in typed, version-controlled code while still giving editors a no-code admin with live preview and a page builder.',
      sources: [{ title: 'Strapi documentation', url: 'https://docs.strapi.io' }, KCMS_DOCS],
      faq: [
        { q: 'Is KernelCMS lighter than Strapi?', a: 'Yes. The default database is Node\'s built-in node:sqlite with zero native dependencies, and there is no framework to boot into.' },
        { q: 'Can non-developers edit content in KernelCMS like in Strapi?', a: 'Yes. Editors get a no-code admin with live preview and a blocks page builder; only the content model lives in code.' },
      ],
    },
    'kernelcms-vs-contentful': {
      updated: 'Jun 13, 2026', authorBio: BIO_TEAM, methodology: METHOD,
      tldr: 'Contentful is enterprise SaaS with a global CDN, environments, and SLAs; KernelCMS is the self-hosted, MIT, code-first alternative without the per-seat bill or the lock-in.',
      sources: [{ title: 'Contentful developer documentation', url: 'https://www.contentful.com/developers/docs/' }, KCMS_DOCS],
      faq: [
        { q: 'Is KernelCMS cheaper than Contentful?', a: 'It is MIT-licensed and self-hosted, so there is no per-seat or per-API-call SaaS bill - you pay only for your own infrastructure.' },
        { q: 'Can I self-host instead of using Contentful?', a: 'Yes. KernelCMS runs on a single container and stores content in your own database, with no SaaS dependency.' },
      ],
    },
    'kernelcms-vs-directus': {
      updated: 'Jun 13, 2026', authorBio: BIO_TEAM, methodology: METHOD,
      tldr: 'Directus wraps an existing database (database-first, BSL); KernelCMS defines the model in typed code (config-first, MIT) and generates the schema. Pick Directus for existing SQL data, KernelCMS for a new code-owned model.',
      sources: [{ title: 'Directus documentation', url: 'https://docs.directus.io' }, { title: 'Directus license (BSL 1.1)', url: 'https://github.com/directus/directus/blob/main/license' }, KCMS_DOCS],
      faq: [
        { q: 'What is the difference between config-first and database-first?', a: 'Directus is database-first: it mirrors an existing SQL database into an API. KernelCMS is config-first: you define the model in typed code and it generates and migrates the schema.' },
        { q: 'Is KernelCMS\'s license more permissive than Directus?', a: 'Yes. KernelCMS is MIT. Directus uses the Business Source License (BSL 1.1), which is source-available but not OSI-approved open source.' },
      ],
    },
    'agent-native-cms': { updated: 'Jun 13, 2026', authorBio: BIO_TEAM },
    'lean-by-default': { updated: 'Jun 13, 2026', authorBio: BIO_TEAM },
    'migrations-that-dont-scare': { updated: 'Jun 13, 2026', authorBio: BIO_TEAM },
  };
  BLOG.forEach((b) => Object.assign(b, BLOG_META[b.slug] || {}));

  // Rendered extras, shared by the live app (app.js) and the static SEO build.
  function articleTop(b) {
    if (!b.tldr) return '';
    return `<div class="callout tip" style="margin:0 0 30px">__ICON_bolt__<div><strong>Bottom line.</strong> ${b.tldr}</div></div>`;
  }
  function articleBottom(b) {
    let out = '';
    if (b.faq && b.faq.length) {
      out += `<h2 id="faq">Frequently asked questions</h2>` + b.faq.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join('');
    }
    if (b.sources && b.sources.length) {
      out += `<h2 id="sources">Sources &amp; further reading</h2><ul>` +
        b.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join('') + `</ul>`;
    }
    if (b.methodology || b.authorBio || b.updated) {
      out += `<div class="callout" style="margin-top:30px">__ICON_info__<div>` +
        (b.methodology ? `<strong>How we compare.</strong> ${b.methodology} ` : '') +
        (b.authorBio || '') +
        (b.updated ? ` <em>Last reviewed ${b.updated}.</em>` : '') + `</div></div>`;
    }
    return out;
  }

  // --- Per-page SEO: bespoke <title> + meta description for every page --------
  // Titles target the search query (kept ~60 chars); descriptions front-load the
  // primary keyword and read as a compelling result (~150-160 chars).
  const HOME_SEO = {
    title: 'KernelCMS: Headless CMS & Backend for AI-Generated Sites',
    description: 'Add a backend and CMS to any site, including AI-generated ones. KernelCMS is an open-source TypeScript headless CMS with REST + GraphQL and no lock-in.',
  };
  const BLOG_INDEX_SEO = {
    title: 'Headless CMS Comparisons & Engineering Notes | KernelCMS',
    description: 'KernelCMS vs Payload, Sanity, Strapi, Contentful, and Directus, compared with hard facts and code, plus notes on building an open-source headless CMS.',
  };
  const GUIDES_INDEX_SEO = {
    title: 'KernelCMS Guides & Tutorials | Headless CMS',
    description: 'Step-by-step KernelCMS guides: embed the CMS in Next.js, add uploads, enable auth and two-factor, wire up commerce, and deploy a single container.',
  };
  const DOCS_INDEX_SEO = {
    title: 'KernelCMS Documentation | TypeScript Headless CMS',
    description: 'KernelCMS documentation: model content in one kernel.config.ts and get a typed engine, REST + GraphQL, a Local API, a React admin, and a CLI.',
  };

  const SEO = {
    // Comparisons (the highest-value, highest-intent pages)
    'kernelcms-vs-payload': { metaTitle: 'KernelCMS vs Payload: TypeScript CMS Comparison (2026)', metaDesc: 'KernelCMS vs Payload, compared: two open-source, TypeScript, config-as-code CMSs. The big difference is framework lock-in. Hard facts, code, and a verdict.' },
    'kernelcms-vs-sanity': { metaTitle: 'KernelCMS vs Sanity: Self-Hosted vs Hosted CMS (2026)', metaDesc: 'KernelCMS vs Sanity, compared: self-hosted and MIT with full data ownership vs Sanity\'s hosted Content Lake and real-time editing. When to pick each.' },
    'kernelcms-vs-strapi': { metaTitle: 'KernelCMS vs Strapi: Code-First vs Admin-First CMS', metaDesc: 'KernelCMS vs Strapi, compared: typed, code-first content modeling vs Strapi\'s admin UI and plugin marketplace. Hard facts, code, and a clear verdict.' },
    'kernelcms-vs-contentful': { metaTitle: 'KernelCMS vs Contentful: Self-Hosted CMS Alternative', metaDesc: 'KernelCMS vs Contentful, compared: the self-hosted, MIT, code-first alternative to Contentful\'s enterprise SaaS. Hard facts on cost, lock-in, APIs, and hosting.' },
    'kernelcms-vs-directus': { metaTitle: 'KernelCMS vs Directus: Config-First vs Database-First', metaDesc: 'KernelCMS vs Directus, compared: config-first and MIT vs database-first and BSL. Which headless CMS fits a new code-owned model vs an existing SQL database.' },
    'agent-native-cms': { metaTitle: 'The Content Layer Agents and Humans Share | KernelCMS', metaDesc: 'How KernelCMS gives AI agents and human editors one access-controlled content model with the same permissions. The case for an agent-native CMS.' },
    'lean-by-default': { metaTitle: 'Why node:sqlite Is the Default Database | KernelCMS', metaDesc: 'How KernelCMS stays lean: a zero-dependency default database via Node\'s built-in node:sqlite, with Postgres, MySQL, and Mongo one line away.' },
    'migrations-that-dont-scare': { metaTitle: 'Headless CMS Migrations That Don\'t Scare You | KernelCMS', metaDesc: 'Diff-based, additive, deterministic schema migrations in KernelCMS. Preview every change before it runs and never lose data by surprise.' },
    // Docs
    'introduction': { metaTitle: 'Introduction to KernelCMS | TypeScript Headless CMS', metaDesc: 'Introduction to KernelCMS, the open-source, config-as-code TypeScript headless CMS: the one-pipeline mental model and what you get from one config.' },
    'installation': { metaTitle: 'Install KernelCMS | TypeScript Headless CMS Setup', metaDesc: 'Install KernelCMS: requirements (Node 22+), the create-kernel scaffolder, and what a config-as-code headless CMS project looks like on disk.' },
    'quickstart': { metaTitle: 'KernelCMS Quickstart: a Headless CMS in 3 Steps', metaDesc: 'Quickstart: install KernelCMS, write one kernel.config.ts, and run kernel dev to get a typed engine, REST + GraphQL, a React admin, and a CLI in three steps.' },
    'configuration': { metaTitle: 'KernelCMS Configuration & Environment Variables', metaDesc: 'Configure KernelCMS: how kernel.config.ts loads with TypeScript type-stripping, the rules it imposes, and every production environment variable.' },
    'collections': { metaTitle: 'Collections & Globals | KernelCMS Content Modeling', metaDesc: 'Model content in KernelCMS with collections and singleton globals, defined as typed code, and how globals differ from collections.' },
    'fields': { metaTitle: 'Field Types Reference | KernelCMS Headless CMS', metaDesc: 'Every KernelCMS field type and option: text, number, relationship, upload, array, blocks, rich text, and more, with the shared options every field supports.' },
    'relationships': { metaTitle: 'Relationships & Joins | KernelCMS Content Model', metaDesc: 'Single, many, and polymorphic relationships in KernelCMS, plus virtual reverse-relationship join fields, population depth, and access-checked related data.' },
    'computed-fields': { metaTitle: 'Computed Fields | KernelCMS Derived Values', metaDesc: 'Computed fields in KernelCMS: virtual (derived on read) vs stored (derived on write and sortable). Keep business logic in one place, read-only in the admin.' },
    'localization': { metaTitle: 'Localization | KernelCMS Multi-Language Content', metaDesc: 'Per-field localization in KernelCMS: configure locales, mark fields localized, and read or write a locale with fallbacks. Build multi-language content models.' },
    'access-control': { metaTitle: 'Access Control | KernelCMS Headless CMS Security', metaDesc: 'Deny-by-default access control in KernelCMS: boolean or row-level rules at the collection and field level, plus the privilege-escalation guard.' },
    'authentication': { metaTitle: 'Authentication | KernelCMS Headless CMS Auth', metaDesc: 'Auth in KernelCMS: email/password auth collections, sessions, API keys, password reset, email verification, TOTP two-factor, and OAuth with Google and GitHub.' },
    'local-api': { metaTitle: 'The Local API | KernelCMS Typed In-Process API', metaDesc: 'The KernelCMS Local API: the same create, read, update, and delete operations as REST and GraphQL, in-process and fully typed, with no HTTP round-trip.' },
    'rest-api': { metaTitle: 'REST API | KernelCMS Auto-Generated Endpoints', metaDesc: 'The auto-generated KernelCMS REST API: endpoints for every collection and global with filtering, sorting, pagination, relationship depth, and bulk operations.' },
    'querying': { metaTitle: 'Querying & the Where Syntax | KernelCMS', metaDesc: 'Query KernelCMS content: the full Where operator set (equals, like, in, greater_than, and/or), sorting, pagination, and how default sort is resolved.' },
    'graphql': { metaTitle: 'GraphQL API | KernelCMS Headless CMS', metaDesc: 'The auto-generated KernelCMS GraphQL API over the same content model and access rules as REST and the Local API. Enabling it, queries, and mutations.' },
    'hooks': { metaTitle: 'Lifecycle Hooks | KernelCMS Headless CMS', metaDesc: 'KernelCMS lifecycle hooks: beforeChange, afterChange, afterRead, beforeDelete, and afterDelete. Derive fields, run side effects, and shape data in the pipeline.' },
    'custom-endpoints': { metaTitle: 'Custom Endpoints | Extend the KernelCMS API', metaDesc: 'Add typed, validated, access-controlled HTTP endpoints to KernelCMS with defineEndpoint. Zod-compatible input validation and the full Local API in your handler.' },
    'modules': { metaTitle: 'Modules | Bundle Features in KernelCMS', metaDesc: 'Bundle a collection, endpoints, globals, and jobs into one installable, conflict-checked KernelCMS module with defineModule. Build and ship features as a unit.' },
    'plugins': { metaTitle: 'Plugins | Extend KernelCMS Config', metaDesc: 'KernelCMS plugins: config transformers applied in dependency order. Add fields to existing collections, compose features, and use the built-in SEO plugin.' },
    'background-jobs': { metaTitle: 'Background Jobs | KernelCMS Task Queue', metaDesc: 'Define background job handlers in KernelCMS, enqueue work, and drain due jobs from a cron with kernel jobs:run. Retries, scheduling, and a focused Local API.' },
    'admin-customization': { metaTitle: 'Customize the Admin | KernelCMS React Panel', metaDesc: 'Customize the KernelCMS admin: register custom field components, list cells, and dashboard widgets, plus conditional fields and editor tabs.' },
    'uploads-and-storage': { metaTitle: 'Uploads & Storage | KernelCMS Media', metaDesc: 'Upload collections, storage adapters (local disk, S3, R2), image variants, and focal points in KernelCMS, with sharp-powered image resizing.' },
    'versions-and-drafts': { metaTitle: 'Versions & Drafts | KernelCMS Publishing', metaDesc: 'Version history, a draft and publish lifecycle, scheduled publishing, and autosave in KernelCMS. Restore previous versions and control what readers see.' },
    'caching-and-search': { metaTitle: 'Caching & Search | KernelCMS Performance', metaDesc: 'Read-through caching (memory, database, Redis) and access-checked full-text search in KernelCMS. Opt collections in, serve reads fast, and invalidate on write.' },
    'webhooks': { metaTitle: 'Webhooks | KernelCMS Event Notifications', metaDesc: 'Fire signed HTTP POST webhooks on content change in KernelCMS. Configure URL, secret, collections, and events, and verify the HMAC-SHA256 signature.' },
    'migrations': { metaTitle: 'Migrations | KernelCMS Schema Changes', metaDesc: 'Diff-based, additive, deterministic schema migrations in KernelCMS. Preview every change with migrate:status, apply safely, and never lose data by surprise.' },
    'cli': { metaTitle: 'CLI Reference | KernelCMS Commands', metaDesc: 'The KernelCMS CLI: init, dev, start, migrate, seed, generate:types, generate:module, jobs:run, doctor, and more, with the flags they share.' },
    'deployment': { metaTitle: 'Deploy KernelCMS | Single Container & Next.js', metaDesc: 'Deploy KernelCMS as one container anywhere, set production environment variables, and embed the whole CMS inside Next.js with a single catch-all route handler.' },
    // Guides
    'add-a-backend-to-any-site': { metaTitle: 'Add a Backend to Any Website or AI-Generated Site', metaDesc: 'Add a backend, CMS, and database to any website, including AI-generated sites from v0, Lovable, Bolt, or Cursor. Step-by-step, with a ready-made AI prompt.' },
    'embed-nextjs': { metaTitle: 'Embed KernelCMS in Next.js | Headless CMS Guide', metaDesc: 'Mount the full KernelCMS headless CMS (REST, GraphQL, admin) inside a Next.js app behind one catch-all route, with a kernel singleton on the Node.js runtime.' },
    'uploads-images': { metaTitle: 'Uploads & Image Variants | KernelCMS Guide', metaDesc: 'Add S3 or R2 storage to KernelCMS and auto-generate resized image variants with focal points using the sharp image processor. A practical media how-to.' },
    'auth-2fa': { metaTitle: 'Password Reset & 2FA | KernelCMS Auth Guide', metaDesc: 'Enable email password reset and TOTP two-factor in KernelCMS with one config flag each. Scrypt hashing, no user-enumeration, built on node:crypto.' },
    'commerce': { metaTitle: 'Add Products & Checkout | KernelCMS Commerce', metaDesc: 'Add products, orders, a server-side checkout, and signature-verified Stripe webhooks to KernelCMS with the commerce module. Totals recomputed server-side.' },
    'deploy-railway': { metaTitle: 'Deploy KernelCMS to a Container | Guide', metaDesc: 'Deploy KernelCMS as a single container anywhere with one Dockerfile and Postgres via DATABASE_URL. Migrate on boot, then start. A minimal deployment how-to.' },
    'custom-fields': { metaTitle: 'Custom Admin Field Components | KernelCMS', metaDesc: 'Register custom field inputs, list cells, and dashboard widgets in the KernelCMS admin via window.KernelCMS, then point a field at your component by key.' },
  };
  [DOCS, GUIDES, BLOG].forEach((arr) => arr.forEach((p) => Object.assign(p, SEO[p.slug] || {})));

  function seoMeta(page, kind) {
    const k = (kind || '').slice(0, 3); // doc | gui | art
    const title = page.metaTitle || (k === 'gui' ? `${page.title} | KernelCMS Guide` : k === 'art' ? page.title : `${page.title} | KernelCMS Docs`);
    const description = page.metaDesc || page.lead || page.excerpt || HOME_SEO.description;
    return { title, description };
  }
export { DOCS, GUIDES, BLOG, esc as escapeHtml, articleTop, articleBottom, seoMeta, HOME_SEO, BLOG_INDEX_SEO, GUIDES_INDEX_SEO, DOCS_INDEX_SEO };
