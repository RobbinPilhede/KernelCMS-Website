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
      slug: 'content-templates', group: 'Content modeling', nav: 'Content templates', title: 'Content templates',
      lead: 'Reusable document skeletons - define a landing-page layout or a standard article shell once, and give editors a "New from template" that pre-fills a document in one click.',
      html: `
<p>A <strong>content template</strong> is a reusable document skeleton: a landing-page block <code>layout</code>, a standard article shell, a pre-filled brief. Define it once and editors instantiate it with one "New from template" click - with all your access rules and validation intact, because creating from a template <strong>is</strong> a normal create.</p>

<h2 id="opt-in">Opt in</h2>
<p>Templates are off until you declare a <code>templates</code> array. Each entry names a target <code>collection</code> and a <code>data</code> object of default field values - which may include a blocks <code>layout</code>, default text, anything a document body holds:</p>
${code('ts', `export default defineConfig({
  templates: [
    {
      slug: 'landing_page',        // unique, snake_case
      collection: 'pages',         // the collection it creates into
      name: 'Landing page',        // optional admin label
      description: 'Hero + feature grid + CTA',
      data: {
        title: 'Untitled landing page',
        layout: [
          { blockType: 'hero', heading: 'Headline goes here' },
          { blockType: 'features', items: [] },
          { blockType: 'cta', label: 'Get started', href: '/signup' },
        ],
      },
    },
  ],
  // … a 'pages' collection with a blocks 'layout' field …
})`)}
${note(`<code>data</code> is <strong>deep-frozen</strong> at config load, so one instantiation can never mutate the skeleton the next one starts from - every "New from template" begins from the same pristine defaults.`)}

<h2 id="list">List templates (metadata only)</h2>
<p><code>kernel.listTemplates</code> is what the admin's picker reads. It returns only <strong>metadata</strong> - <code>slug</code>, <code>collection</code>, <code>name</code>, <code>description</code> - and <strong>never</strong> the raw <code>data</code>. Pass <code>collection</code> to scope the list:</p>
${code('ts', `const pageTemplates = await kernel.listTemplates({ collection: 'pages' })
// → [{ slug: 'landing_page', collection: 'pages', name: 'Landing page', description: '…' }]`)}

<h2 id="create">Create from a template</h2>
<p><code>kernel.createFromTemplate</code> looks up the template, <strong>deep-merges</strong> its defaults with the caller's <code>data</code> (the caller wins on conflicts; nested objects merge), and creates the document through the <strong>normal create pipeline</strong>. Returns the created document:</p>
${code('ts', `const page = await kernel.createFromTemplate({
  template: 'landing_page',
  data: { title: 'Spring launch' }, // overrides the default; the layout is inherited
  req,
})`)}

<h2 id="rest">REST</h2>
${code('bash', `# list template metadata - admin/editor only:
curl "http://localhost:3000/api/_admin/templates?collection=pages"

# create from a template as the request principal - :collection must match the template's:
curl -X POST "http://localhost:3000/api/pages/from-template" \\
  -d '{"template":"landing_page","data":{"title":"Spring launch"}}'`)}

<h2 id="guarantees">The guarantees</h2>
${tip(`Creating from a template is a <strong>normal create</strong>, not a side door: the collection's <code>access.create</code> rule runs (a caller who can't create can't use a template), validation and hooks fire, an agent's result is still a <strong>draft</strong> (a template setting <code>_status: 'published'</code> never publishes for an agent), and out-of-scope fields are stripped by field scope. A template only ever creates into its configured <code>collection</code> - the REST <code>:collection</code> must match.`)}
${warn(`The caller's <code>data</code> override is <strong>prototype-pollution-guarded</strong> (<code>__proto__</code> / <code>constructor</code> / <code>prototype</code> rejected), and the template's config is <strong>frozen</strong> so one instantiation can't change the next. Red-teamed to Risk LOW.`)}`
    },
    {
      slug: 'content-comments', group: 'Content modeling', nav: 'Editorial comments', title: 'Editorial comments',
      lead: 'Threaded review annotations on a document - anchored to a field or left document-level - gated by the target document’s read access, with the author recorded from the authenticated principal.',
      html: `
<p><strong>Editorial comments</strong> are threaded review notes that live <em>beside</em> the content - "tighten this intro", "ready to publish?" - instead of in a separate chat or spreadsheet. A comment anchors to a specific field or to the document, replies thread under it, and a reviewer resolves it when the feedback is addressed. They’re gated by the <strong>target document’s read access</strong>: you only ever see or add comments on a document you can already read.</p>

<h2 id="opt-in">Opt in</h2>
<p>Comments are off until you enable them. Set <code>comments: true</code> on the config - this registers a private <code>_comments</code> system table that is <strong>not</strong> reachable through generic CRUD:</p>
${code('ts', `export default defineConfig({ comments: true, collections: [/* … */] })`)}

<h2 id="add">Add &amp; reply</h2>
<p><code>kernel.addComment</code> adds a comment (or a threaded reply via <code>parentId</code>, validated to the same document) to a document you can read. <code>body</code> is trimmed and length-bounded; <code>field</code> must name a real field. The author comes from the principal - a forged <code>authorId</code> in the call is ignored:</p>
${code('ts', `const comment = await kernel.addComment({
  collection: 'articles',
  id: article.id,
  body: 'tighten the intro',
  field: 'summary',   // optional anchor (omit for a document-level comment)
  req,                // the principal authors the comment
})
// comment.authorId === req.user.id, comment.resolved === false`)}

<h2 id="list">List &amp; count</h2>
<p><code>listComments</code> returns a document’s comments oldest → newest (resolved hidden unless <code>includeResolved</code>); <code>commentCount</code> powers an "N comments" badge:</p>
${code('ts', `const open = await kernel.listComments({ collection: 'articles', id: article.id, req })
const badge = await kernel.commentCount({ collection: 'articles', id: article.id, req })`)}

<h2 id="resolve">Resolve &amp; delete</h2>
<p>Resolve is allowed for the comment’s <strong>author</strong> or a <strong>reviewer</strong> (<code>admin</code>/<code>editor</code>); delete is stricter - the <strong>author</strong> or an <strong>admin</strong> only:</p>
${code('ts', `await kernel.resolveComment({ commentId: comment.id, req })                 // resolve
await kernel.resolveComment({ commentId: comment.id, resolved: false, req }) // reopen
await kernel.deleteComment({ commentId: comment.id, req })                   // delete`)}

<h2 id="rest">REST</h2>
${code('bash', `# add a comment as the authenticated user (anonymous → 401):
curl -X POST "http://localhost:3000/api/articles/$ID/comments" \\
  -H "Authorization: Bearer $TOKEN" -d '{"body":"ready to publish?","field":"summary"}'

# resolve it:
curl -X PATCH "http://localhost:3000/api/_admin/comments/$COMMENT_ID" \\
  -H "Authorization: Bearer $TOKEN" -d '{"resolved":true}'`)}

<h2 id="guarantees">The guarantees</h2>
${tip(`Every op (add / list / count / resolve / delete) checks the target document’s <code>access.read</code> rule <strong>and</strong> its row-scope before returning a comment, a count, or mutating - so the comment surface can never leak a document you can’t read, or even hint it exists. This holds for the anonymous Local-API path too: a null-user caller is held to the read rule, with no "no user = trusted" shortcut. Every REST route requires auth up front.`)}
${warn(`The author is recorded from the authenticated principal, never the client body. Resolve/delete re-gate on the <em>live</em> document before the author/role check; threading stays within one document; ids are prototype-pollution-guarded; <code>_comments</code> is unreachable via generic CRUD; create/resolve/delete are audited. Red-teamed to Risk LOW.`)}`
    },
    {
      slug: 'saved-views', group: 'Content modeling', nav: 'Saved views', title: 'Saved views',
      lead: 'Named query presets for one collection - a stored where + sort + columns, saved per-user and re-applied in one click - where applying runs the normal access-checked find, so a view can only ever narrow within the caller’s access.',
      html: `
<p>A <strong>saved view</strong> (a <em>smart collection</em>) is a named query preset for one collection - a stored <code>where</code> + <code>sort</code> + display <code>columns</code> that an editor saves once and re-applies in a single click: "Published this month", "My drafts", "Out of stock". A view is <strong>owned</strong> by its creator and <strong>private</strong> unless <code>shared</code>. It’s <em>just a stored query</em>: applying it runs the <strong>normal, access-checked <code>find</code></strong>, so a view can only ever <strong>narrow</strong> results within the caller’s own access - never widen or bypass it.</p>

<h2 id="opt-in">Opt in</h2>
<p>Saved views are off until you enable them. Set <code>views: true</code> on the config - this registers a private <code>_views</code> system table that is <strong>not</strong> reachable through generic CRUD:</p>
${code('ts', `export default defineConfig({ views: true, collections: [/* … */] })`)}

<h2 id="save">Save &amp; apply</h2>
<p><code>kernel.saveView</code> stores a named preset for a collection you can read. The <code>name</code> is trimmed and length-bounded; <code>where</code>/<code>sort</code>/<code>columns</code> are validated against the collection. The owner comes from the principal - a forged <code>ownerId</code> in the call is ignored:</p>
${code('ts', `const view = await kernel.saveView({
  collection: 'products',
  name: 'Out of stock',
  where: { stock: { equals: 0 } },
  sort: '-updatedAt',
  columns: ['title', 'stock', 'updatedAt'],
  shared: false,   // private to the owner (the default)
  req,             // the principal owns the view
})
// view.ownerId === req.user.id, view.shared === false`)}
<p><code>kernel.applyView</code> runs the stored query through the <strong>normal <code>find</code> pipeline</strong>. A per-call <code>where</code> is AND-ed on (it can only narrow further); a per-call <code>sort</code> overrides the stored one. It returns a <code>PaginatedResult</code>:</p>
${code('ts', `const page = await kernel.applyView({
  viewId: view.id,
  where: { price: { greater_than: 100 } }, // narrows the stored where (AND)
  sort: '-price',
  limit: 20, page: 1,
  req,
})
// page.docs, page.totalDocs, page.page, page.totalPages …`)}

<h2 id="list">List</h2>
<p><code>listViews</code> returns the views the caller can see - their <strong>own</strong> plus <strong>shared</strong> views on collections they can read - optionally scoped to one collection. <code>getView</code> reads a single one:</p>
${code('ts', `const mine = await kernel.listViews({ collection: 'products', req })
const one = await kernel.getView({ viewId: view.id, req })`)}

<h2 id="update">Update &amp; delete</h2>
<p>Editing or removing a view is <strong>owner-or-admin only</strong> - an editor can’t touch someone else’s view. Any <code>where</code>/<code>sort</code> on an update is re-validated against the collection:</p>
${code('ts', `await kernel.updateView({ viewId: view.id, name: 'Sold out', shared: true, req }) // edit + share
await kernel.deleteView({ viewId: view.id, req })                                 // delete -> { id }`)}

<h2 id="rest">REST</h2>
${code('bash', `# save a view as the authenticated user (owner comes from the token, not the body):
curl -X POST "http://localhost:3000/api/_admin/views" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"collection":"products","name":"Out of stock","where":{"stock":{"equals":0}},"sort":"-updatedAt"}'

# apply it, narrowing further for this call:
curl -X POST "http://localhost:3000/api/_admin/views/$VIEW_ID/apply" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"where":{"price":{"greater_than":100}},"limit":20,"page":1}'`)}

<h2 id="guarantees">The guarantees</h2>
${tip(`Applying a view is a <strong>normal, access-checked <code>find</code></strong>: the collection’s <code>access.read</code> rule and row-scope run every time, and the stored <code>where</code>/<code>sort</code> are validated against the collection on save <strong>and</strong> apply. A per-call <code>where</code> is AND-ed on, so a view can only ever <strong>narrow</strong> results within the caller’s access - never widen, bypass, or escalate it. Applying a shared view never returns a row you couldn’t already read.`)}
${warn(`The owner is recorded from the authenticated principal, never the client body (a forged <code>ownerId</code> is ignored). A view is private unless <code>shared</code>, and a shared view is visible only to principals who can read its collection. Update/delete are <strong>owner-or-admin only</strong>; <code>_views</code> is unreachable via generic CRUD; ids/fields are prototype-pollution-guarded; create/update/delete are audited (<code>view.create</code> / <code>view.update</code> / <code>view.delete</code>). Every REST route requires auth up front. Red-teamed to Risk LOW.`)}`
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

    {
      slug: 'ai-translation', group: 'Content modeling', nav: 'AI translation', title: 'AI-assisted translation',
      lead: 'Auto-fill every locale of your localized content with the translation provider of your choice - while keeping access control, strict validation, and human review intact.',
      html: `
<p>Configure a <strong>pluggable</strong> translation provider and KernelCMS auto-translates your <a href="#/docs/localization"><code>localized</code></a> fields into every locale. The provider is yours - DeepL, OpenAI, Google, a local model - KernelCMS has no hard translation dependency. Requires <code>localization</code>.</p>

<h2 id="provider">Configure a provider</h2>
<p>A provider is one function: N source strings (all in <code>from</code>) → N translations (in <code>to</code>), in order.</p>
${code('ts', `export default defineConfig({
  localization: { locales: ['en', 'sv', 'de'], defaultLocale: 'en' },
  translation: {
    translate: async ({ texts, from, to }) => {
      const res = await deepl.translateText(texts, from, to)
      return res.map((r) => r.text)
    },
  },
  // …
})`)}

<h2 id="translate-document">Translate one document</h2>
<p><code>kernel.translateDocument</code> reads a document's <code>from</code>-locale values for its localized text fields, translates them, and <strong>merges</strong> them into the <code>to</code> locale - other locales are never touched. By default it fills only <strong>missing</strong> values; <code>overwrite: true</code> replaces existing ones.</p>
${code('ts', `// Fill only the empty 'sv' values; existing 'sv' stays
await kernel.translateDocument({ collection: 'posts', id, from: 'en', to: 'sv', req })

// Re-translate: replace existing 'sv' values too
await kernel.translateDocument({ collection: 'posts', id, from: 'en', to: 'sv', overwrite: true, req })`)}
${note(`Pass <code>fields: ['title', 'body']</code> to restrict; omit it to translate every localized text field. With nothing to translate, no provider call and no write happen.`)}

<h2 id="translate-missing">Bulk-fill a collection</h2>
<p><code>kernel.translateMissing</code> finds documents whose <code>to</code> locale is incomplete and translates each, bounded by <code>limit</code> (default 50). <code>from</code> defaults to the default locale.</p>
${code('ts', `const { translated, skipped } = await kernel.translateMissing({ collection: 'posts', to: 'de' })
// translated / skipped are arrays of document ids`)}

<h2 id="rest">REST</h2>
${code('bash', `# one document - gated like an update:
curl -X POST "http://localhost:3000/api/posts/<id>/translate" -d '{"from":"en","to":"sv"}'

# batch-fill a collection - admin/editor only:
curl -X POST "http://localhost:3000/api/_admin/translate-missing" -d '{"collection":"posts","to":"de"}'`)}

<h2 id="guarantees">The guarantees</h2>
${tip(`A translation is a <strong>normal access-checked write</strong>: the caller must be able to update the doc, strict per-locale validation still applies, and the agent draft-only brake still holds - a translation <strong>never auto-publishes</strong>. A read-denied localized field is never sent to the provider or written.`)}
${warn(`The provider closure may hold an API key: its text and errors <strong>never leak</strong> (a failure surfaces a generic message; source/target text is never logged), and a provider fault can't corrupt the doc (no partial write). <code>from</code>/<code>to</code> must be configured locales (unknown / <code>__proto__</code> rejected). Red-teamed to Risk LOW.`)}`
    },

    {
      slug: 'personalization', group: 'Content modeling', nav: 'Personalization & A/B', title: 'Personalization & A/B experiments',
      lead: 'Audience variants from the same typed model - content that adapts to who is asking, plus built-in A/B testing.',
      html: `
<p>A <code>personalized</code> field works exactly like a <code>localized</code> one, but keyed by <strong>audience segment</strong> instead of locale. It stores a <code>{ [segment]: value }</code> map and resolves to the segment on the request - so one model serves many micro-experiences without a separate personalization platform.</p>

<h2 id="audiences">Configure audiences</h2>
${code('ts', `export default defineConfig({
  audiences: {
    segments: ['default', 'vip', 'returning'],
    default: 'default', // must be one of segments
  },
  // …
})`)}

<h2 id="mark">Mark fields personalized</h2>
${code('ts', `{ name: 'headline', type: 'text',     personalized: true },
{ name: 'offer',    type: 'richText', personalized: true }`)}
<p>A personalized field stores one value per segment. Non-personalized fields are shared across all audiences.</p>
${warn(`A field cannot be both <code>localized</code> and <code>personalized</code> - that combination is rejected at config load. Personalized fields also require <code>audiences</code> to be configured.`)}

<h2 id="read-write">Reading & writing a segment</h2>
<p>Over REST, pass <code>?audience=vip</code>; from the Local API, set <code>req.audience</code>. A personalized field resolves to that segment's value, falls back to the <strong>default segment</strong>, then <code>null</code>.</p>
${code('ts', `// Read the VIP variant
await kernel.find({ collection: 'posts', req: { audience: 'vip' } })

// Write merges into the 'vip' slot WITHOUT clobbering other segments
await kernel.update({ collection: 'posts', id, req: { audience: 'vip' },
  data: { headline: 'Welcome back' } })`)}
${note(`An unknown or untrusted <code>audience</code> is only honored if it is a configured segment - otherwise it resolves to the default. Per-segment writes merge, so no other variant is lost.`)}

<h2 id="experiments">A/B experiments</h2>
<p>Declare experiments whose variants are configured segments. <code>kernel.assignVariant</code> does deterministic, sticky bucketing of a visitor <code>key</code> (FNV hash, weight-proportional) - the same key always gets the same variant.</p>
${code('ts', `export default defineConfig({
  audiences: { segments: ['default', 'a', 'b'], default: 'default' },
  experiments: [
    { slug: 'cta', variants: ['a', 'b'], weights: [50, 50], seed: 1 },
  ],
})`)}
${code('ts', `const { variant } = kernel.assignVariant({ experiment: 'cta', key: visitorId })
// the assigned variant IS a segment - serve its content
const doc = await kernel.findByID({ collection: 'pages', id, req: { audience: variant } })`)}
<p>Over REST the assignment endpoint is public (an assignment is not secret):</p>
${code('bash', `curl -X POST "http://localhost:3000/api/_experiments/cta/assign" -d '{"key":"visitor-123"}'
# → { "experiment": "cta", "variant": "a", "segment": "a" }`)}

<h2 id="guarantees">The guarantees</h2>
${tip(`Personalized fields still go through <strong>field read-access</strong>: a read-denied personalized field is stripped for every audience - variant resolution never bypasses access checks.`)}
${warn(`Segment keys are guarded against <code>__proto__</code> / <code>constructor</code> / <code>prototype</code>, so a crafted audience can't pollute the prototype. Bucketing records only a <strong>hash of the key</strong> - no raw visitor key or PII at rest. Red-teamed to Risk LOW.`)}`
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
      slug: 'multi-tenancy', group: 'Access & auth', nav: 'Multi-tenancy', title: 'Multi-tenancy',
      lead: 'Run many clients, sites, or workspaces on one KernelCMS instance with airtight per-tenant data isolation - and no per-collection access boilerplate.',
      html: `
<p>Opt into <code>tenancy</code> and one KernelCMS instance hosts many tenants - customers, sites, workspaces - each fully isolated, all in one database. For every scoped collection KernelCMS auto-adds a server-managed <code>tenant</code> field and AND-combines a tenant scope into its access rules, so every read and write is silently filtered to the caller's tenant. Zero per-collection boilerplate. This is the SaaS-on-KernelCMS and agency enabler.</p>

<h2 id="opt-in">Opt in</h2>
<p>Tenancy is off until you enable it. Everything below is a default:</p>
${code('ts', `export default defineConfig({
  tenancy: {
    field: 'tenant',           // server-managed scope field (default 'tenant')
    // collections: ['posts'], // scoped collections (default: all non-system, non-auth)
    requireTenant: true,       // tenant-less principal → denied scoped content (fail-closed)
    resolve: (req) => req.user?.tenant ?? null, // how the acting tenant is derived (the DEFAULT)
  },
  collections: [/* … */],
})`)}

<h2 id="resolve">How the tenant is resolved</h2>
<p>The acting tenant comes from the <strong>authenticated principal</strong> - by default <code>req.user.tenant</code>. Put a <code>tenant</code> value on each user record and it flows into <code>req.user.tenant</code> on auth. A custom <code>resolve</code> (e.g. a verified subdomain → tenant mapping) is allowed, but it must derive from trusted, authenticated state.</p>
${warn(`<strong>The whole security model.</strong> The acting tenant is resolved from the authenticated principal - <strong>NEVER</strong> a client query param, body field, or header. A tenant A principal can never read, list, count, update, or delete tenant B's content (cross-tenant access → nothing / <code>NotFound</code>); a client can never create or move a document into another tenant (<code>tenant</code> is auto-stamped on create, immutable on update); a tenant-less principal sees nothing (fail-closed). Cross-tenant content is never leaked through relationship populate - it resolves to a bare id. Only <code>overrideAccess</code> / a trusted system caller (migrations, admin tooling) bypasses it. Red-teamed across 35 cross-tenant attacks to Risk LOW, zero leaks.`)}

<h2 id="auto">Auto-field, auto-scope, auto-stamp</h2>
<p>For each scoped collection KernelCMS does three things for you: it <strong>auto-adds</strong> the server-managed <code>tenant</code> field; it <strong>auto-injects</strong> a tenant scope into read/create/update/delete access, <strong>AND-combined</strong> with your own rules (it narrows them, never widens); and it <strong>auto-stamps</strong> the tenant on create from the caller, treating it as immutable on update. Because the scope rides the existing access pipeline, every <code>find</code> / <code>findByID</code> / <code>update</code> / <code>delete</code> / <code>count</code> is filtered the same way, with no second code path.</p>

<h2 id="example">Two tenants on one instance</h2>
${code('ts', `tenancy: {}, // defaults are fine
collections: [
  { slug: 'users', auth: true,
    // the tenant claim lives on the user; it flows into req.user.tenant on auth
    fields: [{ name: 'tenant', type: 'text', required: true }] },
  { slug: 'posts', // scoped automatically - no tenant field/rule needed
    access: { read: ({ req }) => Boolean(req.user) },
    fields: [{ name: 'title', type: 'text', required: true }] },
]`)}
${code('ts', `// the tenant is auto-stamped from the caller - no need to pass it
await kernel.create({ collection: 'posts', data: { title: 'Acme launch' }, req: acmeReq })   // tenant 'acme'
await kernel.create({ collection: 'posts', data: { title: 'Globex memo'  }, req: globexReq }) // tenant 'globex'

await kernel.find({ collection: 'posts', req: acmeReq })   // → only the Acme post
await kernel.find({ collection: 'posts', req: globexReq }) // → only the Globex post

// cross-tenant access by id resolves to nothing:
await kernel.findByID({ collection: 'posts', id: acmePostId, req: globexReq }) // → null

// a client cannot move a doc into another tenant - 'tenant' is stripped on update:
await kernel.update({ collection: 'posts', id: acmePostId, data: { tenant: 'globex' }, req: acmeReq }) // still 'acme'`)}
${note(`Trusted server code - migrations, admin tooling, cross-tenant maintenance - steps outside the per-tenant view with <code>overrideAccess: true</code> (over HTTP, the API-key bearer token). It is the <strong>only</strong> bypass - never reachable from a client request.`)}`
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
    {
      slug: 'agentic-workflows', group: 'Access & auth', nav: 'Agentic workflows', title: 'Agentic workflows',
      lead: 'Hand a job to an AI agent and let it run a multi-step content pipeline - draft, quality gate, human review - without it ever being able to push something live.',
      html: `
<p>This is the <em>agentic CMS</em>: autonomous content pipelines with hard guardrails baked into the engine. A <strong>workflow</strong> is orchestration plus guardrails. KernelCMS schedules the steps, pins every operation to a <a href="#/docs/mcp">scoped agent principal</a>, records a durable run log, and gates content advancement on quality checks and human approval. The actual generation - the LLM call that writes the draft - is <strong>your</strong> code inside a step. KernelCMS never calls a model for you; it makes sure that whatever the model produces cannot go live unchecked.</p>

<h2 id="concept">Autonomous, but governed</h2>
<p>A normal automation runs as a trusted system caller - it can write anything, publish anything. That is exactly what you do <em>not</em> want when an LLM is in the loop. A KernelCMS workflow inverts it: every step runs as the workflow's scoped agent, never as a system caller. The agent physically <strong>cannot publish</strong> and <strong>cannot write outside its <code>fieldScope</code></strong>, and there is no <code>overrideAccess</code> anywhere on the path. Content moves forward <strong>only</strong> through two explicit gates - <code>evalGate</code> (your quality CI) and <code>requestReview</code> (a human approving in the inbox).</p>

<h2 id="define">Defining a workflow</h2>
<p>Workflows live on your config under <code>workflows</code>. A definition names a <code>slug</code> (snake_case), the <code>agent</code> to run as, an optional <code>trigger</code>, and the ordered <code>steps</code>:</p>
${code('ts', `export default defineConfig({
  agents: [
    {
      id: 'writer',
      token: process.env.WRITER_TOKEN,            // bearer credential, from env
      roles: ['editor'],
      fieldScope: { allow: ['title', 'body', 'excerpt'] }, // deny-by-default
    },
  ],
  workflows: [
    {
      slug: 'draft_from_brief',
      agent: 'writer',                            // every step runs as this principal
      trigger: { on: 'create', collection: 'briefs' },
      maxAttempts: 3,
      steps: [
        {
          name: 'draft',
          async run(ctx) {
            // ctx.input is the brief that triggered the run.
            const body = await generateWithYourLLM(ctx.input.brief)

            // A DRAFT - the agent principal cannot create a published doc.
            const post = await ctx.kernel.create({
              collection: 'posts',
              data: { title: ctx.input.title, body },
            })
            ctx.log(\`drafted post \${post.id}\`)

            // Quality CI. Runs the collection's evals; THROWS -> the run fails.
            await ctx.evalGate({ collection: 'posts', id: post.id })

            // Pause the run as awaiting_review; a human approves in the inbox.
            await ctx.requestReview({ collection: 'posts', id: post.id }, 'ready for review')
          },
        },
      ],
    },
  ],
})`)}
<p>A new <code>brief</code> fires this workflow, the agent drafts a <code>posts</code> document, the draft must pass your evals, and then it parks in the review inbox for a human. At no point could the agent publish.</p>

<h2 id="context">The WorkflowContext &amp; the two gates</h2>
<p>Each step's <code>run(ctx)</code> receives a <code>WorkflowContext</code>:</p>
<ul>
<li><strong><code>ctx.kernel</code></strong> - a Local-API subset (<code>find</code>, <code>findByID</code>, <code>create</code>, <code>update</code>, <code>delete</code>, <code>count</code>, <code>composePage</code>, <code>findVersions</code>) where every call is <strong>pinned to the scoped agent principal</strong>. A step cannot pass <code>overrideAccess</code> or swap in a different principal.</li>
<li><strong><code>ctx.input</code></strong> - the trigger document on a create/update run, or the manual input passed to <code>runWorkflow</code>.</li>
<li><strong><code>ctx.log(msg)</code></strong> - append a line to the run log; <strong><code>ctx.step</code></strong> - <code>{ name, index }</code> for the current step.</li>
</ul>
<p>Content advancement is not something a step does by writing data. It happens only through these two awaited calls:</p>
${code('ts', `// Quality CI: runs the collection's configured evals against the doc.
// A blocking eval failure THROWS, which fails the run - the draft does not advance.
await ctx.evalGate({ collection: 'posts', id })

// Submits the doc to the review inbox and PAUSES the run as awaiting_review.
await ctx.requestReview({ collection: 'posts', id }, 'optional note for the reviewer')`)}
${note(`The engine does <strong>not</strong> block-wait for a person. <code>requestReview</code> pauses the run as <code>awaiting_review</code> and returns. The human then approves the doc in the inbox, and <strong>that</strong> inbox-approval path is what publishes it.`)}

<h2 id="triggers">Triggers, manual runs &amp; durable execution</h2>
<p><strong>Triggered runs</strong> (<code>on: 'create'</code> / <code>'update'</code>) enqueue a <strong>durable</strong> run onto the <a href="#/docs/background-jobs">background jobs</a> queue when a matching document is written - they never run inline with the content write, so a slow agent step never blocks the editor saving. The queued run is drained by your jobs runner:</p>
${code('bash', `kernel jobs:run        # drain due jobs once (drive it from a cron)`)}
<p><strong>Manual runs</strong> (<code>on: 'manual'</code>, or no trigger) never fire on a write - you start them explicitly. <code>runWorkflow</code> executes the steps <strong>inline</strong> and returns the resulting run:</p>
${code('ts', `const run = await kernel.runWorkflow({ slug: 'draft_from_brief', input, req })`)}

<h2 id="runs">The run log &amp; REST routes</h2>
<p>Every run is durable and inspectable. <code>_workflow_runs</code> records the run plus per-step status and errors - stored as <strong>messages only</strong>, never stack traces, never secrets.</p>
${code('ts', `const { docs } = await kernel.workflowRuns({
  slug: 'draft_from_brief',
  status: 'awaiting_review',
  limit: 20,
  page: 1,
})`)}
<p>The same surface is exposed over REST, gated to admin/editor callers:</p>
${code('http', `GET  /api/_admin/workflow-runs?slug=draft_from_brief&status=awaiting_review
POST /api/_admin/workflows/draft_from_brief/run`)}
<p>Decisions are recorded for audit on every outcome: <code>workflow.completed</code>, <code>workflow.failed</code>, and <code>workflow.awaiting_review</code>.</p>

<h2 id="states">The run-state machine</h2>
${code('text', `pending -> running -> completed
                  |-> failed
                  \\-> awaiting_review`)}
<ul>
<li><strong>pending</strong> - enqueued (a triggered run waiting for the jobs runner).</li>
<li><strong>running</strong> - steps are executing.</li>
<li><strong>completed</strong> - every step finished without a gate pausing or failing it.</li>
<li><strong>failed</strong> - a step threw (including a blocking <code>evalGate</code>); the per-step error message is recorded and <code>maxAttempts</code> governs retries.</li>
<li><strong>awaiting_review</strong> - a step called <code>requestReview</code> and parked the run. A human approval (which publishes) closes the loop outside the workflow.</li>
</ul>

<h2 id="guarantees">The guardrail guarantees</h2>
<p>These hold because they are enforced by <code>@kernel/core</code>, not by the workflow code you write:</p>
${warn(`<ul>
<li><strong>Scoped principal.</strong> Every step runs as the workflow's agent; <code>ctx.kernel</code> is pinned to it - no <code>overrideAccess</code>, no swapping principals.</li>
<li><strong>Draft-only.</strong> The agent physically cannot publish - a born-published create, a <code>_status: 'published'</code> write, a <code>publish()</code>, or scheduling are all rejected. Publishing stays a human decision.</li>
<li><strong>Field-scoped.</strong> Writes are limited to the agent's <code>fieldScope.allow</code> (deny-by-default); an agent scoped to <code>['title', 'body']</code> cannot touch <code>roles</code>, whatever a step tries.</li>
<li><strong>Gates are the only advancement.</strong> A draft reaches the public read path only after <code>evalGate</code> passes <em>and</em> a human approves in the inbox. KernelCMS orchestrates and guards; the generation is your agent/LLM, and the publish is the human's approval.</li>
<li><strong>Loop-guarded.</strong> An agent's own write into its trigger collection will not re-fire the workflow.</li>
</ul>`)}
${tip(`The net effect: you can point a capable, autonomous agent at your content and trust that nothing it produces goes live unchecked. Workflows build on agent principals, the review inbox, content-CI evals, and the jobs system.`)}`
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
    {
      slug: 'semantic-search', group: 'Data & APIs', nav: 'Semantic search', title: 'Semantic & hybrid search',
      lead: 'RAG-native retrieval: bring any embedder, and your CMS becomes the vector knowledge base - access-checked, real-time, and hybrid-ranked.',
      html: `
<p>On top of adapter-based full-text search, KernelCMS embeds your content into a vector store on every write, so you can query it by <strong>meaning</strong> (semantic) and by a <strong>fusion of keyword + meaning</strong> (hybrid). Both run through the same access-checked read path as every other operation - a vector hit for a document the caller can't read is dropped, never leaked. The point: your CMS <em>is</em> your RAG knowledge base, instead of a CMS plus a sync Lambda plus a separate vector database you keep in step by hand.</p>

<h2 id="embedder">Configure a pluggable embedder</h2>
<p>KernelCMS has <strong>no embedding dependency of its own</strong>. You supply an <code>embed</code> function - the whole contract is <code>string[] → number[][]</code> - so OpenAI, Cohere, Voyage, or a local model all work the same way:</p>
${code('ts', `import OpenAI from 'openai'
const openai = new OpenAI() // reads OPENAI_API_KEY from the environment

export default defineConfig({
  search: memorySearch(),       // full-text; hybrid fuses this with the vector store
  embeddings: {
    embed: async (texts) => {
      const res = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
      })
      return res.data.map((d) => d.embedding)
    },
    dimensions: 1536,           // optional; helps a backing store size its column
  },
  collections: [/* … */],
})`)}
${note(`When <code>embeddings</code> is set, <code>vector</code> defaults to the built-in in-process <code>memoryVector()</code> (cosine store). It's ideal for development; a pgvector-backed adapter is the documented production follow-up - the interface is ready, the adapter is not yet shipped.`)}

<h2 id="enable">Enable semantic on a collection</h2>
<p>Full-text needs <code>search: { fields }</code>. Add <code>semantic: true</code> to also embed those fields - on <strong>every write</strong>, on the same real-time path as the full-text index:</p>
${code('ts', `{
  slug: 'posts',
  access: { read: () => true },
  search: { fields: ['title', 'body'], semantic: true },
  fields: [/* … */],
}`)}
<p>Indexing is real-time: a write re-embeds and upserts the document's vector, a delete removes it. There is no batch job and no stale window - a governance requirement for AI agents, which must never retrieve a deleted or stale document.</p>

<h2 id="query">Semantic vs. hybrid</h2>
<p>Two Local API ops, each returning <code>{ docs }</code> already loaded through the access-checked read path:</p>
${code('ts', `// Pure vector top-K - best for paraphrased, conversational queries.
const { docs } = await kernel.semanticSearch({
  collection: 'posts',
  query: 'how do I deploy to a single container?',
  limit: 10,                          // clamped to a max of 100
  filter: { _status: 'published' },   // validated against real columns
  req,                                // the request principal - access is enforced
})

// Hybrid - full-text + vector, fused with Reciprocal Rank Fusion (RRF, k = 60).
const { docs } = await kernel.hybridSearch({
  collection: 'posts', query: 'kernel deploy container', limit: 10, req,
})`)}
<p><strong>Hybrid</strong> is the 2026 default for most retrieval: it runs both searches and fuses their rankings so you get keyword precision (exact terms, names, codes) <em>and</em> semantic recall (synonyms, paraphrase) in one ranked list, no blend weight to tune. Reach for <strong>semantic</strong> alone when queries are conversational and the user's words won't match the document's. Both degrade gracefully - semantic-only when a collection has no full-text fields, full-text-only when no embedder is configured.</p>

<h2 id="rest">The REST surface</h2>
<p>The same two ops over HTTP, access-checked to the request principal:</p>
${code('bash', `curl "http://localhost:3000/api/posts/semantic?q=how%20do%20I%20deploy&limit=10"
curl "http://localhost:3000/api/posts/hybrid?q=how%20do%20I%20deploy"`)}
${warn(`Results <strong>always</strong> go through the access-checked read path: a vector hit for a document the caller can't read is dropped, never leaked. <code>limit</code> is clamped (max 100) and <code>filter</code> is validated to real columns (no injection / prototype pollution). An embed failure is logged - never with the text or key - and never breaks a content write.`)}`
    },
    {
      slug: 'knowledge-graph', group: 'Data & APIs', nav: 'Knowledge graph', title: 'Knowledge graph & GraphRAG',
      lead: 'Your typed relationships are a graph: walk a document and its neighbors, or do GraphRAG - semantic seeds expanded into their connected context to ground an LLM.',
      html: `
<p>Every <code>relationship</code> and <code>upload</code> field is a typed edge between documents, and every <code>join</code> field is that edge read backwards. KernelCMS exposes that graph two ways: <code>kernel.graph(...)</code> walks a document and its connected neighbors, and <code>kernel.graphSearch(...)</code> does <strong>GraphRAG</strong> - it finds seed documents by meaning, then expands each through the graph to gather the <em>connected context</em> an LLM needs. The win over plain <a href="#/docs/semantic-search">semantic search</a>: you retrieve not just the matching document but its connected context, straight from the relationships you already modeled. This is the <strong>retrieval</strong> half - the LLM generation stays yours.</p>

<h2 id="walk">Walk the neighborhood</h2>
<p><code>kernel.graph(...)</code> runs a breadth-first walk from a seed document, following outbound relationship/upload fields <strong>and</strong> inbound reverse-relationship (<code>join</code>) fields:</p>
${code('ts', `const { nodes, edges, truncated } = await kernel.graph({
  collection: 'posts',
  id,
  depth: 2,        // hops from the seed; default 1, clamped to a max of 10
  maxNodes: 100,   // node budget; default 100, hard cap 500
  req,             // the request principal - access is enforced
})`)}
<p>You get two flat arrays. A <code>GraphNode</code> is <code>{ ref: '&lt;collection&gt;:&lt;id&gt;', collection, id, label }</code>; a <code>GraphEdge</code> is <code>{ from, to, field, relationTo, kind }</code> where <code>kind</code> is <code>'relationship'</code> (an outbound field) or <code>'reverse'</code> (an inbound join). The walk is <strong>bounded and cycle-safe</strong>: <code>depth</code> clamps to 10, <code>maxNodes</code> caps at 500, at most 200 edges are followed out of any one node, and each node is visited once - <code>truncated</code> is <code>true</code> when a bound clips the result.</p>

<h2 id="graphrag">GraphRAG retrieval</h2>
<p><code>kernel.graphSearch(...)</code> is the grounding flow: <strong>semantic seeds → graph expansion → context</strong>.</p>
${code('ts', `const { seeds, nodes, edges, context, truncated } = await kernel.graphSearch({
  collection: 'posts',   // required when more than one collection is searchable
  query: 'who wrote about single-container deploys?',
  depth: 1,              // how far to expand each seed; same clamp as graph()
  limit: 5,              // number of seed documents to retrieve
  req,
})
// context: Array<{ ref, label, text }> - drop straight into an LLM prompt`)}
<p>It finds the seed documents by meaning through the same retrieval stack as <a href="#/docs/semantic-search">semantic search</a>, walks each seed through the graph (outbound + reverse edges, up to <code>depth</code>), and returns the seeds, the merged subgraph, and a <code>context</code> array of label + text snippets to ground a model.</p>
${note(`<strong>graphSearch needs <code>embeddings</code>.</strong> The seed step is semantic/hybrid search, so it wants a configured embedder. Without one it degrades gracefully - full-text, then a plain <code>find</code> - so you still get seeds, just keyword-ranked. The expansion and the access guarantee are identical either way.`)}

<h2 id="rest">The REST surface</h2>
<p>Both ops over HTTP, access-checked to the request principal:</p>
${code('bash', `curl "http://localhost:3000/api/posts/<id>/graph?depth=2&maxNodes=100"
curl "http://localhost:3000/api/graph-search?q=who%20wrote%20about%20deploys&collection=posts&depth=1"`)}
${tip(`Every node loads through the same access-checked read path. A node the caller can't read is dropped <strong>and the edge to it is omitted</strong>, so the relationship's existence never leaks; read-denied fields never appear in a <code>label</code> or <code>context</code>; and the bounds (<code>depth</code>, <code>maxNodes</code>, fan-out, de-dupe) make traversal DoS-safe. It is the retrieval half - the LLM generation stays yours.`)}`
    },
    {
      slug: 'content-intelligence', group: 'Data & APIs', nav: 'Content intelligence', title: 'Content intelligence (related & dedupe)',
      lead: 'The embeddings that power search also power "more like this" recommendations and automatic near-duplicate detection - access-checked, straight from the vectors you already index.',
      html: `
<p>Your embeddings power more than <a href="#/docs/semantic-search">search</a>. The same vectors KernelCMS writes on every write also drive two <strong>content-intelligence</strong> operations: <code>kernel.relatedContent(...)</code> returns the documents most semantically <em>like</em> a given one - "more like this" for internal-linking and recommendations - and <code>kernel.findDuplicates(...)</code> finds <strong>near-duplicate / redundant</strong> documents across a collection for content-quality and dedupe cleanups. Both run through the <strong>same access-checked read path</strong> as every other operation, so a related or duplicate result never surfaces - or even implies the existence of - a document the caller can't read. Once your content is embedded, recommendations and dedupe sweeps come for free, off the index you already maintain.</p>

<h2 id="prereqs">Prerequisites: embeddings + a vector store</h2>
<p>Content intelligence is built on the vector index, so it needs exactly the <a href="#/docs/semantic-search">semantic-search</a> setup: a pluggable <code>embeddings: { embed }</code> and a collection whose <code>search</code> sets <code>semantic: true</code>. With no embedder configured, these ops have nothing to compare and don't apply.</p>
${code('ts', `{
  slug: 'posts',
  access: { read: () => true },
  search: { fields: ['title', 'body'], semantic: true }, // embedded on every write
  fields: [/* … */],
}`)}

<h2 id="related">Related content - more like this</h2>
<p>Given one document, return the others most like it. KernelCMS <strong>re-embeds the seed from its current content</strong>, runs a vector nearest-neighbor search, drops the seed itself, and loads the rest through the access-checked read path:</p>
${code('ts', `const { docs } = await kernel.relatedContent({
  collection: 'posts',
  id,                                  // the seed document
  limit: 5,                            // how many neighbors to return (clamped)
  filter: { _status: 'published' },    // optional; validated against real columns
  req,                                 // the request principal - access is enforced
})`)}
<p>The seed is embedded from how it reads <em>now</em> (not a stored vector argument) and never returns itself. <code>limit</code> and <code>filter</code> behave exactly as in <code>semanticSearch</code>. This is the engine behind internal-linking and "you might also like" rails - and a related result the caller can't read is simply dropped from <code>docs</code>.</p>

<h2 id="duplicates">Near-duplicate detection</h2>
<p>Sweep a collection for pairs of documents whose embeddings are close enough to be near-duplicates or redundant content - the heart of a content-QA / dedupe pass:</p>
${code('ts', `const { pairs } = await kernel.findDuplicates({
  collection: 'posts',
  threshold: 0.92,   // min cosine similarity for a pair; default 0.9, clamped to [0, 1]
  limit: 50,         // max pairs returned (clamped)
  req,
})
// pairs: Array<{ a, b, score }> - a and b are the two docs, score the cosine similarity`)}
<p>Raise <code>threshold</code> (<code>0.95</code>+) for only the closest copies; lower it to catch looser redundancy. <code>score</code> lets you sort and triage. Similarity is computed over each document's <strong>last-indexed content</strong> within a <strong>bounded scan</strong> - it's an admin operation, not a hot path, so it caps both the docs scanned and the pairs returned rather than running an unbounded all-pairs comparison.</p>

<h2 id="rest">The REST surface</h2>
<p>Both ops over HTTP, access-checked to the request principal:</p>
${code('bash', `curl "http://localhost:3000/api/posts/<id>/related?limit=5"
curl "http://localhost:3000/api/_admin/duplicates?collection=posts&threshold=0.92&limit=50"  # admin/editor-gated`)}
<p>The <code>related</code> route resolves the caller like every other read route; the <code>duplicates</code> route is <strong>admin/editor-gated</strong> - near-duplicate detection is an administrative content-quality operation - and <code>threshold</code> / <code>limit</code> are clamped at the boundary.</p>
${tip(`Every result goes through the same access-checked read path: a related or duplicate result never surfaces (or implies the existence of) a document the caller can't read. A duplicate <strong>pair is returned only when the caller can read both documents</strong> - a pair touching a hidden doc is dropped whole, never revealing its id or existence. <code>threshold</code> is clamped to <code>[0, 1]</code>, <code>limit</code> is clamped, <code>filter</code> is validated to real columns (no injection), the dedup scan is bounded, and the embedding provider's key and text never leak. Red-teamed to Risk LOW.`)}`
    },
    {
      slug: 'ai-discoverability', group: 'Data & APIs', nav: 'AI discoverability', title: 'AI discoverability (llms.txt & GEO)',
      lead: 'Make your content ingestible and citable by AI answer engines - llms.txt, a full corpus, RAG chunks, and per-document GEO markdown, all published-only.',
      html: `
<p>KernelCMS can publish your content for <strong>AI answer engines</strong> - ChatGPT, Claude, Perplexity, Google AI - to ingest and cite. This is <strong>GEO</strong> (Generative Engine Optimization): the SEO-for-LLMs discipline of making content easy for a model to read, retrieve, and attribute. The lever is one optional <code>discoverability</code> block, and the surface it produces follows the emerging <strong>llms.txt</strong> standard. Everything is generated from your live content through the <strong>same access-checked read path</strong> as every other read - so there's no separate file to hand-maintain and watch drift.</p>

<h2 id="config">Configure discoverability</h2>
<p>The feature is <strong>off until you add the block</strong>. Defaults are conservative: only collections with a public read and a title are exposed, and auth/upload/system collections are never exposed unless you set <code>include: true</code>.</p>
${code('ts', `export default defineConfig({
  discoverability: {
    title: 'Acme Blog',
    description: 'Guides and changelog from the Acme team.',
    baseUrl: 'https://acme.com',          // builds absolute canonical URLs
    collections: [
      {
        slug: 'posts',
        titleField: 'title',
        descriptionField: 'excerpt',        // per-link summary
        bodyField: 'body',                  // rendered into the corpus / GEO markdown
        urlPattern: '/blog/:slug',          // :token resolves against the document
      },
    ],
    maxDocsPerCollection: 1000,             // default 1000
    maxDocsTotal: 5000,                     // default 5000
  },
  collections: [/* … */],
})`)}

<h2 id="ops">The four operations</h2>
<p>All on the Local API, all reading as an anonymous principal:</p>
${code('ts', `// (a) The llms.txt index - title, description, per-collection \`- [title](url): summary\`.
const indexTxt = await kernel.llmsTxt()

// (b) The full corpus - every exposed doc as a \`##\` markdown section + citation footer.
const corpusTxt = await kernel.llmsFullTxt()

// (c) Retrieval-ready chunks for RAG / GEO ingestion.
const chunks = await kernel.contentChunks({ collection: 'posts', limit: 200 })
//   -> { id, collection, title, url, text, tokensEstimate, updatedAt, provenance? }[]

// (d) One published doc as GEO markdown with a citation block, or null.
const md = await kernel.geoDocument({ collection: 'posts', id })`)}

<h2 id="rest">The REST surface</h2>
<p>Each op has a public route. These take <strong>no auth</strong> and <strong>only ever emit published, publicly readable content</strong>:</p>
${code('bash', `curl http://localhost:3000/api/llms.txt                       # text/plain  - the index
curl http://localhost:3000/api/llms-full.txt                  # text/plain  - the corpus
curl "http://localhost:3000/api/content-chunks?collection=posts&limit=50"  # JSON chunks
curl http://localhost:3000/api/posts/<id>/geo                 # text/markdown - one doc`)}
<p>The convention is that the index lives at your site root, not under <code>/api</code>. Proxy <code>/llms.txt</code> to <code>/api/llms.txt</code> (e.g. a Next.js <code>rewrites()</code> entry, or a reverse-proxy location block) so answer engines find it where they expect.</p>

<h2 id="geo">GEO citations &amp; provenance</h2>
<p><code>geoDocument</code> renders one published document as markdown with a <strong>citation block</strong> - author, last-updated date, and the canonical URL from <code>baseUrl</code> + <code>urlPattern</code>. The corpus and each chunk carry the same provenance footer. This builds on KernelCMS's <a href="#/docs/semantic-search">content-credentials</a> work: when a document is signed, its citation additionally carries a <strong>signature-verified note</strong>; when signing isn't configured, the citation still carries author, date, and URL and simply omits that line. Rich text is rendered with <code>toMarkdown(richTextDoc)</code>, exported from <code>kernelcms/richtext</code>.</p>
${warn(`<strong>Published-only guarantee.</strong> Every generator runs through the access-checked pipeline as an <em>anonymous</em> principal filtering <code>_status === 'published'</code>, with no <code>overrideAccess</code>. Drafts, scheduled-but-unpublished docs, access-restricted documents, and read-denied fields <strong>never</strong> appear. Output is size-bounded by <code>maxDocsPerCollection</code> (default 1000) and <code>maxDocsTotal</code> (default 5000).`)}`
    },
    {
      slug: 'structured-data', group: 'Data & APIs', nav: 'Structured data', title: 'Structured data (JSON-LD)',
      lead: 'Emit schema.org JSON-LD for your documents straight from your typed model - rich results for search engines, machine-understandable facts for AI answer engines, access-checked and XSS-safe.',
      html: `
<p>KernelCMS can generate <strong>schema.org JSON-LD</strong> for your documents - the structured-data format search engines read to render rich results, and AI answer engines read to understand <em>what a page is</em>. The lever is one optional <code>structuredData</code> block, and the output is built from your typed content model through the <strong>same access-checked read path</strong> as every other read - so there's no <code>&lt;script type="application/ld+json"&gt;</code> to hand-write per template and watch drift. It completes the discoverability trio with <a href="#/docs/semantic-search">semantic search</a> (retrievable) and <a href="#/docs/ai-discoverability">llms.txt / GEO</a> (ingestible &amp; citable). The whole feature is <strong>off until you add the block</strong>.</p>

<h2 id="config">Configure structuredData</h2>
<p>Each entry names a collection, the schema.org <code>type</code> to emit, and optionally a <code>mapping</code> and a <code>urlPattern</code>.</p>
${code('ts', `export default defineConfig({
  structuredData: {
    baseUrl: 'https://acme.com',          // builds absolute canonical @id / image URLs
    collections: [
      // Smart defaults: fields are mapped automatically.
      { slug: 'posts', type: 'BlogPosting', urlPattern: '/blog/:slug' },
      // Explicit mapping: schema.org property -> your field name.
      { slug: 'authors', type: 'Person', mapping: { name: 'full_name', email: 'contact' } },
    ],
  },
  collections: [/* … */],
})`)}

<h2 id="defaults">Smart-default mapping</h2>
<p>With no explicit <code>mapping</code>, KernelCMS infers properties from your field set: the title / <code>useAsTitle</code> field -> <code>name</code> + <code>headline</code>; the first richText/textarea -> <code>articleBody</code> (plus a truncated <code>description</code>); a <code>date</code> named publish/posted/created -> <code>datePublished</code> (else <code>createdAt</code>) and updated/modified -> <code>dateModified</code> (else <code>updatedAt</code>); <code>email</code> -> <code>email</code>; an image/upload -> <code>image</code> (URL); an author-ish relationship -> <code>author</code> (<code>{ '@type': 'Person', name }</code>). An explicit <code>mapping</code> <strong>replaces</strong> the defaults entirely.</p>

<h2 id="ops">The two operations &amp; embedding</h2>
<p>Both are on the Local API and both read through the access-checked pipeline, with the principal taken from <code>req</code>:</p>
${code('ts', `// (a) The JSON-LD object, or null if missing / not readable / disabled.
const ld = await kernel.jsonLd({ collection: 'posts', id, req })
//   -> { '@context': 'https://schema.org', '@type': 'BlogPosting',
//        '@id': 'https://acme.com/blog/hello', name, headline, articleBody,
//        datePublished, author: { '@type': 'Person', name } }

// (b) The ready-to-embed <script> string, HTML-escaped; '' when there's no doc.
const script = await kernel.jsonLdScript({ collection: 'posts', id, req })
//   -> '<script type="application/ld+json">{…}</script>'`)}
<p>Drop the <code>jsonLdScript</code> string into your page <code>&lt;head&gt;</code> as raw HTML - it's a complete, escaped <code>&lt;script&gt;</code> element, so the content cannot break out of the tag.</p>

<h2 id="rest">The REST surface</h2>
<p>Each document's JSON-LD is also available over HTTP - access-checked, principal from the request:</p>
${code('bash', `curl http://localhost:3000/api/posts/<id>/jsonld   # application/ld+json (404 when null/disabled)`)}

${tip(`<strong>Access-checked &amp; XSS-safe.</strong> Reads go through the same pipeline as every live read: a draft, private, or read-denied document or field is <strong>never</strong> emitted (a public/anonymous caller sees only published, publicly readable content). <code>jsonLdScript</code> HTML-escapes <code>&lt;</code>/<code>&gt;</code>/<code>&amp;</code> so content can't break out of the <code>&lt;script&gt;</code> tag, and the <code>@id</code> / <code>image</code> URLs are injection-safe (no <code>javascript:</code> / <code>data:</code> / traversal). Red-teamed to Risk LOW. The standalone op is the surface - it is not auto-injected into the GEO output.`)}`
    },
    {
      slug: 'realtime', group: 'Data & APIs', nav: 'Real-time', title: 'Real-time change feed',
      lead: 'Opt in and every content write lands on a durable, access-filtered feed - pull it for CDC, stream it over SSE for live UIs, or subscribe in-process. Metadata only, never a leaked body.',
      html: `
<p>KernelCMS can emit a change event for every content write onto one durable feed, served in two shapes: a <strong>pull feed</strong> you poll with a cursor (CDC), and a <strong>live push stream</strong> over Server-Sent Events (reactive UIs). The same events are also delivered <strong>in-process</strong> for server code, workflows, and live re-indexing. It runs through the same access-checked engine as every other read - the feed is a view into it, never a side channel around it. The whole feature is <strong>off by default</strong>.</p>

<h2 id="enable">Enable it</h2>
<p>Opt in on your config. <code>retain</code> bounds the change outbox - once full, the oldest rows drop (a clamped maximum applies, so the outbox is never unbounded):</p>
${code('ts', `export default defineConfig({
  realtime: {
    enabled: true,   // default false - the whole feature is opt-in
    retain: 50000,   // max change rows kept in the outbox (default 10000, clamped)
  },
  collections: [/* … */],
})`)}

<h2 id="event">The event shape</h2>
<p>Every change - over any surface - is the same metadata record. There is <strong>no document body</strong>, only that a document changed and how:</p>
${code('ts', `type ChangeEvent = {
  seq: number          // monotonic sequence (per node); also the SSE event id
  at: string           // ISO timestamp
  collection: string
  documentId: string
  event: 'create' | 'update' | 'delete' | 'publish' | 'unpublish'
  principalType: 'user' | 'agent'  // who caused it
}`)}
<p>To act on the new content, re-fetch it through the normal access-checked API - the event tells you <em>that</em> something changed, not <em>what</em> it now says.</p>

<h2 id="pull">The pull feed (cursor polling)</h2>
<p><code>kernel.changes(...)</code> returns a batch plus the cursor to resume from. Persist the cursor and a restarted consumer picks up exactly where it left off:</p>
${code('ts', `let cursor = 0 // or a value you persisted

const { changes, cursor: next } = await kernel.changes({
  since: cursor,         // exclusive: events with seq > since
  collection: 'posts',   // optional: filter to one collection
  limit: 100,            // optional: batch size
  req,                   // the request principal - access is enforced
})
for (const e of changes) await handle(e)
cursor = next            // poll again with since: cursor`)}
<p>Over HTTP the same feed is a single authenticated GET - there is no anonymous change feed:</p>
${code('bash', `curl "http://localhost:3000/api/changes?since=0&collection=posts&limit=100"`)}

<h2 id="sse">The live SSE stream</h2>
<p><code>GET /api/changes/stream</code> upgrades to <code>text/event-stream</code> and emits one frame per change as it happens, plus <code>: ping</code> heartbeats. Each frame carries <code>id: &lt;seq&gt;</code>, so the stream is resumable:</p>
${code('text', `id: 41
data: {"seq":41,"collection":"posts","documentId":"p_07","event":"create","principalType":"user"}

: ping`)}
<p>The browser <code>EventSource</code> API consumes it directly:</p>
${code('ts', `const es = new EventSource('/api/changes/stream?collection=posts', {
  withCredentials: true, // send the session cookie - the stream requires auth
})
es.onmessage = (msg) => {
  const e = JSON.parse(msg.data) // a ChangeEvent (metadata only)
  if (e.event !== 'delete') refetch(e.collection, e.documentId)
}`)}
<p><code>EventSource</code> reconnects automatically and sends the last id it saw as <code>Last-Event-ID</code>; the server replays the changes after that <code>seq</code> (within retention) before going live, so a brief drop loses nothing. A non-browser client sets the header itself:</p>
${code('bash', `curl -N -H "Last-Event-ID: 41" "http://localhost:3000/api/changes/stream?collection=posts"`)}

<h2 id="subscribe">In-process subscribe</h2>
<p>For server code in the same process - a workflow step, a live re-indexer, a cache invalidator - subscribe directly. <code>kernel.subscribe(fn)</code> returns an <strong>unsubscribe function</strong>:</p>
${code('ts', `const unsubscribe = kernel.subscribe((e) => {
  if (e.collection === 'posts') reindex(e.documentId)
})
// when you're done (shutdown, teardown):
unsubscribe()`)}

<h2 id="security">The security property</h2>
<p>Two guarantees make the feed safe to expose, both enforced by the engine: events are <strong>metadata only</strong> (never the body), and the feed is <strong>access-filtered per subscriber</strong> - before an event reaches a subscriber, their read access for that document is checked, and if they can't read it the event is <strong>dropped entirely</strong>. They're never even told it changed. The client re-fetches the real document through the normal access-checked read path, which strips fields they may not see.</p>
${warn(`The filter <strong>fails closed</strong>. For a <code>delete</code> (the doc is gone) and for row-scoped reads where access depends on the row's data, the filter can't re-check the specific document, so it requires a <strong>fully-public read rule</strong> on the collection before delivering the event - anything narrower drops it. Both endpoints require auth; retention and connection counts are bounded; and a feed-write failure <strong>never</strong> breaks the content write.`)}

<h2 id="notes">Honest notes</h2>
<ul>
<li><strong>Publish currently reads as <code>update</code>.</strong> The feed is driven by <code>afterChange</code>, whose args don't carry the prior <code>_status</code>. The <code>event</code> type includes <code>'publish'</code>/<code>'unpublish'</code>, but a publish today surfaces as <code>update</code> - treat it as "content moved" and re-fetch to read <code>_status</code>.</li>
<li><strong><code>seq</code> is per-node.</strong> The sequence counter is local to one node - correct ordering for a single-node deployment. Multi-node needs a shared sequence; until then, run the feed from one node.</li>
</ul>
${tip(`Real-time pairs with the rest of the engine: <a href="#/docs/agentic-workflows">workflows</a> react to a change, <a href="#/docs/semantic-search">search</a> stays live by re-indexing on each event, and a CDC pipeline streams changes downstream without re-scanning everything.`)}`
    },
    {
      slug: 'edge-delivery', group: 'Data & APIs', nav: 'Edge delivery', title: 'Edge delivery & CDN caching',
      lead: 'Cache public reads aggressively at the CDN with cache tags, then invalidate exactly the changed content on every write - provider-agnostically. The "real-time at the edge" the market wants, done safely.',
      html: `
<p>KernelCMS turns your public reads into <strong>edge-cacheable</strong> responses and tells a CDN <em>exactly</em> what to invalidate on every write. Two halves: a cacheable read carries your <code>Cache-Control</code> plus a <code>Surrogate-Key</code> header listing the response's <strong>cache tags</strong>; a change-driven <strong>purge feed</strong> maps recent writes back to those same tags, so a worker purges only what actually changed. KernelCMS emits the tags and the purge list - <strong>the CDN integration is yours</strong> (Cloudflare, Fastly, Vercel). It is <strong>off by default</strong>, and the purge feed requires <a href="#/docs/realtime">real-time</a>.</p>

<h2 id="enable">Enable it</h2>
${code('ts', `export default defineConfig({
  realtime: { enabled: true }, // the purge feed reads the change feed
  edge: {
    enabled: true,             // default false - the whole feature is opt-in
    // the Cache-Control sent on a cacheable content read:
    cacheControl: 'public, s-maxage=31536000, stale-while-revalidate=60',
    tagHeader: 'Surrogate-Key',  // surrogate-key header name (default 'Surrogate-Key')
    includeRelationships: true,  // also tag a doc with its relationship targets (default true)
  },
  collections: [/* … */],
})`)}

<h2 id="headers">The cache headers - cacheable vs. private</h2>
<p>With <code>edge.enabled</code>, <code>GET /api/:collection/:id</code> and <code>GET /api/:collection</code> branch on whether the response is cacheable at a shared edge. It is cacheable <strong>only when all</strong> hold: the caller is <strong>anonymous</strong>, the read is <strong>not access-scoped</strong> (a fully-public read rule, not a row filter), every returned doc is <strong>published</strong>, it is <strong>not a time-travel</strong> read (<code>asOf</code>), and it does <strong>not</strong> use <code>overrideAccess</code>. A cacheable response gets your <code>Cache-Control</code> plus the surrogate key:</p>
${code('http', `Cache-Control: public, s-maxage=31536000, stale-while-revalidate=60
Surrogate-Key: posts posts:p_07 users:u_1 media:m_3`)}
<p>Anything else - authenticated, access-scoped, draft, <code>asOf</code>, or <code>overrideAccess</code> - instead gets <code>Cache-Control: private, no-store</code> and <strong>no</strong> surrogate key.</p>

<h2 id="tags">Cache tags</h2>
<p>A response's tags are <code>&lt;collection&gt;</code>, each <code>&lt;collection&gt;:&lt;id&gt;</code>, and - with <code>includeRelationships</code> - the <code>&lt;collection&gt;:&lt;id&gt;</code> of each doc a returned doc references, so the embedding doc carries the tag of what it embeds. <code>kernel.cacheTags(...)</code> computes them, sanitized to CDN-safe tokens:</p>
${code('ts', `// tags for one document (own + collection + relationship-target tags):
const tags = kernel.cacheTags({ collection: 'posts', id: 'p_07', doc })
// or for a whole list response:
const listTags = kernel.cacheTags({ collection: 'posts', docs })`)}

<h2 id="purge">The purge feed (change-driven invalidation)</h2>
<p><code>kernel.purgeFeed(...)</code> reads the change feed and maps recent writes to the tags to invalidate - <strong>including the tags of docs that reference a changed doc</strong> (bounded), so editing a referenced record purges every doc that embeds it. A worker polls it and purges the keys:</p>
${code('ts', `let cursor = 0 // or a value you persisted
const { tags, cursor: next } = await kernel.purgeFeed({ since: cursor })
await purgeAtYourCDN(tags) // your provider's purge-by-key call
cursor = next             // persist; poll again with since: cursor`)}
<p>Over HTTP it is one <strong>admin-gated</strong> GET (it reveals changed ids), so it is never public:</p>
${code('bash', `curl "http://localhost:3000/api/_edge/purge?since=0" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"
# -> { "tags": ["posts", "posts:p_07", "users:u_1"], "cursor": 41 }`)}
<p>For a push model, <code>kernel.onPurge(fn)</code> delivers tags over the realtime bus as changes happen. Both paths require <code>realtime</code>.</p>

<h2 id="wiring">Wiring it to a CDN</h2>
<p>KernelCMS produces the header on reads and the tags to purge; you connect them. For Fastly, set the surrogate key on the purge call; for Cloudflare Enterprise, set <code>tagHeader: 'Cache-Tag'</code> and purge by tag:</p>
${code('ts', `// a worker draining the purge feed into a provider
const { tags, cursor } = await kernel.purgeFeed({ since })
await fetch(\`https://api.fastly.com/service/\${SERVICE}/purge\`, {
  method: 'POST',
  headers: { 'Fastly-Key': FASTLY_TOKEN, 'surrogate-key': tags.join(' ') },
})`)}
<p>Run it on a short interval, persist the returned <code>cursor</code>, and the CDN caches public reads for as long as your <code>s-maxage</code> allows while dropping exactly the changed content within seconds of a write.</p>

<h2 id="guarantees">The guarantees</h2>
<p>Cache tags only ever contain ids from the <strong>access-checked returned documents</strong> (a doc the caller can't read is never in the response, so its id is never in a tag); tag and header values are sanitized to CDN-safe tokens (no header injection); and the purge feed is admin-gated and reference-fan-out bounded. The CDN integration is yours. Red-teamed to Risk LOW.</p>
${warn(`<strong>Private content is never edge-cached.</strong> A private, authenticated, access-scoped, draft, time-travel (<code>asOf</code>), or <code>overrideAccess</code> response is <strong>never</strong> given a public/<code>s-maxage</code> <code>Cache-Control</code> or a surrogate key - it gets <code>private, no-store</code>. A wrong header would cache private content at a shared edge, so this is the make-or-break invariant; no configuration relaxes it.`)}`
    },
    {
      slug: 'analytics', group: 'Data & APIs', nav: 'Analytics', title: 'Content analytics & insights',
      lead: 'Record a content event for every view, search, conversion - and every AI retrieval - then roll them up into aggregate insights. Privacy-first, opt-in, no PII.',
      html: `
<p>KernelCMS can record a content event for every meaningful interaction and roll those events up into aggregate insights. You see how your content performs and, uniquely, <strong>how AI answer engines retrieve it</strong> - from the same model that already serves your content. There is <strong>no third-party analytics, no PII</strong>, and the whole feature is <strong>off by default</strong>.</p>

<h2 id="enable">Enable it</h2>
<p>Opt in on your config. <code>retain</code> bounds the event table; <code>autoCapture</code> turns on the zero-touch AI-retrieval and experiment signals (off by default):</p>
${code('ts', `export default defineConfig({
  analytics: {
    enabled: true,        // default false - the whole feature is opt-in
    retain: 100000,       // max event rows kept (default ~100k, clamped)
    autoCapture: false,   // default false - see "Auto-capture" below
  },
  collections: [/* … */],
})`)}

<h2 id="track">Capturing an event</h2>
<p><code>kernel.track(...)</code> records one content event. Every field but <code>type</code> is optional - attach only the dimensions that fit. Tracking is <strong>resilient</strong>: a failure is logged and swallowed, never thrown into your handler, so analytics can't take down a content request.</p>
${code('ts', `await kernel.track({
  type: 'view',             // required - the event type (below)
  collection: 'posts',      // optional - which collection
  documentId: 'p_07',       // optional - which document
  query: 'how do I deploy', // optional - the search/retrieval terms
  experiment: 'cta',        // optional - experiment slug
  variant: 'b',             // optional - assigned variant
  value: 1,                 // optional - numeric value (e.g. a conversion)
  meta: { source: 'blog' }, // optional - extra scalar, non-PII dimensions
})`)}
<p><code>type</code> is one of <code>'view'</code>, <code>'search'</code>, <code>'ai_retrieval'</code> (a doc returned by semantic/hybrid/graph search to ground an AI answer), <code>'citation'</code>, <code>'variant_impression'</code>, <code>'conversion'</code>, or <code>'custom'</code>. Over HTTP it is one POST - auth required unless the server sets <code>publicTrack</code>:</p>
${code('bash', `curl -X POST http://localhost:3000/api/_analytics/track \\
  -d '{"type":"view","collection":"posts","documentId":"p_07"}'`)}

<h2 id="auto-capture">Auto-capture - the AI-retrieval signal</h2>
<p>Set <code>autoCapture: true</code> and KernelCMS records the two events you'd otherwise wire by hand, <strong>fire-and-forget with zero added latency</strong> and a complete no-op when off:</p>
<ul>
<li><strong>AI retrieval.</strong> <code>semanticSearch</code> / <code>hybridSearch</code> / <code>graphSearch</code> emit one <code>ai_retrieval</code> event per returned <em>access-checked</em> document, with the search terms as <code>query</code>. A document the caller couldn't read is never returned, so it's never tracked. This is the "how AI uses your content" signal.</li>
<li><strong>Variant impressions.</strong> <code>assignVariant</code> emits a <code>variant_impression</code> for the experiment and bucketed variant.</li>
</ul>

<h2 id="insights">Insights - aggregate queries</h2>
<p><code>kernel.insights(...)</code> rolls the event table up into one of five metrics. Insights are <strong>aggregates only</strong> - counts and rates, never a replay of individual events:</p>
${code('ts', `const result = await kernel.insights({
  metric: 'ai_retrieval_leaderboard', // which roll-up (below)
  collection: 'posts',  // optional - scope to one collection
  type: 'view',         // optional - scope to one event type
  from: '2026-06-01',   // optional - ISO lower bound
  to: '2026-06-14',     // optional - ISO upper bound
  limit: 20,            // optional - result size (clamped)
})`)}
<ul>
<li><strong><code>top_content</code></strong> - documents ranked by event count.</li>
<li><strong><code>top_queries</code></strong> - the most frequent search / AI-retrieval terms.</li>
<li><strong><code>variant_performance</code></strong> - impressions, conversions, and conversion rate per experiment/variant.</li>
<li><strong><code>activity</code></strong> - event counts over time and per type.</li>
<li><strong><code>ai_retrieval_leaderboard</code></strong> - the content AI retrieves most to answer questions. The signal page-view analytics can't give you.</li>
</ul>
<p>The insights route is <strong>admin/editor-gated</strong> - there is no public insights endpoint:</p>
${code('bash', `curl "http://localhost:3000/api/_admin/insights?metric=top_content&from=2026-06-01&limit=20"`)}

<h2 id="privacy">Privacy, access & safety</h2>
${tip(`<strong>No PII, ever.</strong> There is <strong>no user, IP, visitor, email, or token column</strong> on the event row - the schema has nowhere to put a person, and the authenticated principal who called <code>track</code> is <strong>never recorded</strong>. <code>track</code> strips PII-ish and prototype-pollution keys from <code>meta</code>, keeping only scalar, non-PII dimensions. You measure content, not people.`)}
${warn(`<code>track</code> can only ever write the <code>_analytics</code> table - <code>collection</code> is <strong>inert data</strong> describing the event, not a write target. <code>insights</code> returns <strong>aggregates only</strong> (no raw-row replay), is <strong>filtered to collections the caller can read</strong> (a hidden collection's counts never leak), and is admin/editor-gated on top. Retention, the insights scan, and the result <code>limit</code> are all bounded. Red-teamed to Risk LOW (zero findings).`)}

<h2 id="fits">Where it fits</h2>
<p>Auto-capture turns every <a href="#/docs/semantic-search">semantic, hybrid</a>, or <a href="#/docs/knowledge-graph">graph</a> retrieval into an <code>ai_retrieval</code> signal, so the leaderboard shows what your RAG actually uses; <a href="#/docs/personalization">A/B</a> impressions are captured by <code>assignVariant</code> and a tracked <code>conversion</code> gives you the lift; and a <code>citation</code> event closes the loop with <a href="#/docs/ai-discoverability">llms.txt/GEO</a>. Analytics is a view into the same access-checked engine - never a side channel around it, and never a PII store.`
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
      slug: 'time-machine', group: 'Media & operations', nav: 'Time-machine', title: 'Content time-machine',
      lead: 'Read, diff, and restore your content at any point in time - git-for-content, built on the version history KernelCMS already keeps.',
      html: `
<p>Every collection with <a href="#/docs/versions-and-drafts">versions</a> enabled already snapshots each write. The time-machine turns that history into a queryable surface: read a document - or a whole list - as it existed at any past instant, walk its complete change timeline, diff any two points field-by-field, and revert in one call. No extra storage, no second access path.</p>
${warn(`Every time-machine operation requires <code>versions</code> on the collection. A point-in-time read or restore on a collection without it raises a <code>BadRequestError</code> - there is no history to reconstruct from.`)}

<h2 id="as-of">Point-in-time reads (asOf)</h2>
<p>Pass <code>asOf</code> (an ISO-8601 timestamp) to <code>findByID</code> or <code>find</code> and the engine reconstructs the document(s) from history - the latest snapshot whose <code>createdAt</code> is <code>&lt;= asOf</code>. Omit <code>asOf</code> and you get the current document, unchanged:</p>
${code('ts', `// a single document, as it stood at an instant
const post = await kernel.findByID({
  collection: 'posts', id, asOf: '2025-12-31T23:59:59Z',
})

// null when the document did not exist yet at that instant
await kernel.findByID({ collection: 'posts', id, asOf: '2020-01-01T00:00:00Z' }) // -> null

// a point-in-time LIST - honours where / limit / page
const { docs } = await kernel.find({
  collection: 'posts', asOf: '2026-01-15T00:00:00Z',
  where: { author: { equals: authorId } }, limit: 20,
})`)}

<h2 id="history">The history timeline</h2>
<p><code>history</code> returns the full change timeline for one document, oldest -> newest. <code>changedFields</code> are the fields that differ from the previous snapshot (all of them on the first, create snapshot):</p>
${code('ts', `const timeline = await kernel.history({ collection: 'posts', id })
// Array<{ versionId, at, by, byType, status, autosave, changedFields }>`)}
${note(`<code>by</code> / <code>byType</code> attribute each snapshot to a <code>user</code> or <code>agent</code>, so "show me what the agent changed" is a filter over the timeline. <code>status</code> is the <code>_status</code> at that point on a drafts-enabled collection.`)}

<h2 id="diff">Field-level diffs</h2>
<p><code>diffVersions</code> compares two points and returns only the changed fields, each as a <code>{ from, to }</code> pair. <code>from</code> and <code>to</code> are independent - each may be a <strong>versionId</strong> <em>or</em> an <strong>ISO timestamp</strong> (resolved to the snapshot at-or-before it):</p>
${code('ts', `// two version ids
await kernel.diffVersions({
  collection: 'posts', id,
  from: timeline[0].versionId, to: timeline[2].versionId,
})
// -> { title: { from: 'Draft', to: 'Hello world' }, body: { from, to } }

// or two instants - "what changed between last Monday and now"
await kernel.diffVersions({
  collection: 'posts', id,
  from: '2026-06-08T00:00:00Z', to: '2026-06-13T00:00:00Z',
})`)}

<h2 id="restore">Restore as-of</h2>
<p><code>restoreAsOf</code> reverts a document to its state at a past instant by writing that historical content back through the <strong>normal update path</strong>:</p>
${code('ts', `await kernel.restoreAsOf({ collection: 'posts', id, asOf: '2026-06-01T00:00:00Z' })`)}
<p>The guardrails all follow from "it's a normal update":</p>
${warn(`<ul>
<li><strong>Content fields only.</strong> <code>_status</code> and system columns are excluded from the restored payload, so a restore writes <em>content</em> - it can never flip a draft to published. A restore is not a publish.</li>
<li><strong>No access bypass.</strong> It runs the validated update path with no <code>overrideAccess</code>, so the caller's update access, field-level access, and validation all apply.</li>
<li><strong>The agent draft-only brake still holds.</strong> An <a href="#/docs/mcp">AI agent</a> can restore content but, like any other write, cannot use a restore to publish.</li>
<li><strong>It records a new version.</strong> The revert is itself a snapshot at the head of the timeline - history is append-only, so you can always restore forward again.</li>
</ul>`)}

<h2 id="rest">The REST surface</h2>
<p>Reads take <code>asOf</code> as a query parameter; the restore route is gated exactly like a normal update:</p>
${code('http', `GET  /api/:collection/:id?asOf=<iso>          # one document, as of an instant
GET  /api/:collection?asOf=<iso>              # point-in-time list
GET  /api/:collection/:id/history             # the change timeline
GET  /api/:collection/:id/diff?from=&to=      # field-level diff (versionId or iso)
POST /api/:collection/:id/restore-as-of?asOf= # revert (gated like an update)`)}

<h2 id="security">History reads exactly like the present</h2>
<p>Time-travel is <strong>not</strong> a way around access control. Every historical read, diff, and timeline runs through the <em>same</em> read-check and field stripping as a live read, evaluated against the caller's <strong>current</strong> access - there is no traveling back to a moment when access was wider:</p>
${tip(`<ul>
<li>A caller who cannot read the document <strong>now</strong> cannot read its <code>asOf</code> state, its <code>history</code>, or any <code>diff</code> of it. Revoked access stays revoked for the past too.</li>
<li>A read-denied field never appears in an <code>asOf</code> document, in a snapshot's <code>changedFields</code>, or in a <code>diff</code>.</li>
<li>Historical <strong>draft</strong> states are hidden unless you pass <code>draft: true</code> - the same rule as a live read.</li>
<li><code>restoreAsOf</code> writes through the normal validated update with no <code>overrideAccess</code>, so it can never write content the caller couldn't write directly.</li>
</ul>`)}`
    },
    {
      slug: 'releases', group: 'Media & operations', nav: 'Content releases', title: 'Content releases',
      lead: 'Bundle a set of draft documents and publish them together, atomically - optionally on a schedule - for coordinated launches and campaigns.',
      html: `
<p>A <strong>release</strong> is a named bundle of draft documents that go live <strong>together</strong>, in one step. Instead of publishing a launch one document at a time and hoping nothing slips, you gather the changes - a new landing page, three posts, an updated pricing global - into a release, preview the whole bundle as it will read, and ship it as a single unit with an all-or-nothing safety net. It is the practical heart of "content environments": coordinate a launch or a campaign, then publish it atomically.</p>
${code('ts', `export default defineConfig({
  releases: true, // opt-in; provisions _releases + _release_items
  collections: [/* … drafts-enabled collections … */],
})`)}
${note(`Releases are <strong>off until you opt in</strong>. Setting <code>releases: true</code> provisions two system tables - <code>_releases</code> and <code>_release_items</code> - and unlocks the ops below. Members must be real, non-system, <a href="#/docs/versions-and-drafts">drafts-enabled</a> collection documents.`)}

<h2 id="lifecycle">Create, add members, preview, publish</h2>
<p>Open a release, add the draft documents that belong to it, preview the bundle, then publish (or schedule) it:</p>
${code('ts', `// 1. open a release (status: 'open' - editable)
const release = await kernel.createRelease({ name: 'Spring launch' })

// 2. add draft members (access-checked - you can't add a doc you can't read)
await kernel.addToRelease({ release: release.id, collection: 'posts', id: postId })
await kernel.addToRelease({ release: release.id, collection: 'pages', id: pageId })
// …and remove one again while still open
await kernel.removeFromRelease({ release: release.id, collection: 'pages', id: pageId })

// 3. preview the whole bundle in its current draft state
const { docs } = await kernel.previewRelease({ release: release.id })

// 4. publish every member together, atomically
const result = await kernel.publishRelease({ release: release.id })
// -> { status: 'published' | 'failed', published: [...], failed: [...] }`)}
${note(`<code>previewRelease</code> returns the member documents in their <strong>current draft state</strong>, each loaded through the access-checked read path - a member the caller can't read is simply dropped from the preview, never leaked.`)}

<h2 id="ops">The operations</h2>
${code('ts', `kernel.createRelease({ name })                              // -> a new 'open' release
kernel.addToRelease({ release, collection, id })            // add a draft member
kernel.removeFromRelease({ release, collection, id })       // remove a member
kernel.listReleases({ status })                             // status? filters open/scheduled/published/failed
kernel.getRelease({ release })                              // the release + its items
kernel.previewRelease({ release })                          // member docs, current draft state (access-checked)
kernel.publishRelease({ release })                          // -> { status, published, failed }
kernel.scheduleRelease({ release, at })                     // publish at an instant
kernel.cancelRelease({ release })                           // cancel a scheduled release
kernel.processScheduledReleases()                           // drain due releases (from cron)`)}

<h2 id="state-machine">The state machine</h2>
<p>A release moves through a small, explicit set of states. Only an <code>open</code> release is editable; once published it is immutable:</p>
${code('text', `open  ──publishRelease──▶ published      (all members live, publishedAt set)
  │
  ├──scheduleRelease──▶ scheduled ──drain──▶ published
  │
  └──(a member fails mid-publish)──▶ failed`)}
<ul>
<li><strong>open</strong> - editable. Add and remove members freely.</li>
<li><strong>published</strong> - every member is live, <code>publishedAt</code> is set, and the release is <strong>immutable</strong>.</li>
<li><strong>scheduled</strong> - awaiting the cron drain; flips to <code>published</code> when due.</li>
<li><strong>failed</strong> - a member errored partway through publishing (see the all-or-nothing note below).</li>
</ul>

<h2 id="all-or-nothing">All-or-nothing pre-flight</h2>
<p><code>publishRelease</code> does not publish member-by-member and hope. It first <strong>dry-runs the publish gate for every member</strong> - the per-document publish access check, the agent draft-only brake, and the blocking eval / content-CI gate against each member's current draft content. If <em>any</em> member would fail, it publishes <strong>none</strong>: the call returns <code>{ status: 'failed', failed: [...] }</code> with the reasons, and the release stays <code>open</code> so you can fix and retry. Only when all members pass does it publish each one through the normal <code>publish</code> op.</p>
${warn(`<strong>The guarantee.</strong> Publishing a release goes through the <strong>same per-document publish gate as a direct publish</strong>. A caller can only publish a release whose every member they could publish directly; an <a href="#/docs/mcp">AI agent</a> can never publish a release; and the eval gate still applies to each member. The pre-flight makes go-live all-or-nothing - it never half-launches. <em>(Honest note: the pre-flight is a full dry-run, so a fault that only surfaces mid-publish leaves the release <code>failed</code> rather than rolled back - best-effort atomic, not a transaction.)</em>`)}

<h2 id="scheduling">Scheduling (the cron drain)</h2>
<p>Instead of publishing now, schedule the whole bundle for a future instant. The release moves to <code>scheduled</code> and a cron drains it when due - call <code>processScheduledReleases()</code> alongside <code>processScheduledPublishes()</code>:</p>
${code('ts', `await kernel.scheduleRelease({ release: release.id, at: '2026-07-01T09:00:00Z' })
await kernel.cancelRelease({ release: release.id }) // back to 'open' before it fires`)}
${code('bash', `# a cron that drains due scheduled releases (and per-doc publishes)
* * * * * cd /app && node -e "const k=require('./run'); k.processScheduledPublishes(); k.processScheduledReleases()"`)}
${note(`A scheduled release is <strong>gate-checked at schedule time</strong> - the same model as a scheduled per-document publish - and the drain <strong>re-checks the eval gate</strong> against the then-current draft content before it goes live.`)}

<h2 id="rest">The REST surface</h2>
<p>Every release route is admin/editor-gated:</p>
${code('http', `GET    /api/_admin/releases                                   # list (status filter)
POST   /api/_admin/releases                                   # create { name }
GET    /api/_admin/releases/:id                               # the release + items
DELETE /api/_admin/releases/:id                               # delete a release
POST   /api/_admin/releases/:id/items                         # add { collection, id }
DELETE /api/_admin/releases/:id/items/:collection/:docId      # remove a member
GET    /api/_admin/releases/:id/preview                       # the bundle, current draft state
POST   /api/_admin/releases/:id/publish                       # publish atomically
POST   /api/_admin/releases/:id/schedule                      # schedule { at }`)}

<h2 id="security">Same gate as a direct publish</h2>
${tip(`<ul>
<li><strong>Per-document publish gate.</strong> A member is published through the normal <code>publish</code> op, so the collection's <code>access.publish</code> rule applies to each one. You can only publish a release whose every member you could publish directly.</li>
<li><strong>Agents can never publish a release.</strong> The agent draft-only brake holds at the bundle level too - an <a href="#/docs/mcp">AI agent</a> principal can curate a release but cannot make it live.</li>
<li><strong>Member management is access-checked.</strong> You cannot pull a document you can't read into a release, and the preview drops members you can't read.</li>
<li><strong>Eval gates still apply.</strong> The blocking content-CI eval runs in the pre-flight and again on the scheduled drain - a member that fails its evals blocks the whole release.</li>
</ul>`)}
<p>Red-teamed to Risk LOW. Pairs naturally with the <a href="#/docs/versions-and-drafts">draft/publish lifecycle</a> and <a href="#/docs/time-machine">time-machine</a>.</p>`
    },
    {
      slug: 'content-lifecycle', group: 'Media & operations', nav: 'Content lifecycle', title: 'Content lifecycle (expiry & archival)',
      lead: 'The inverse of scheduled publish - put an expiry on a published document and KernelCMS automatically unpublishes, archives, or deletes it when the date passes.',
      html: `
<p>Scheduled publish makes a draft go live at a future instant. <strong>Content lifecycle</strong> is the inverse: give a <em>published</em> document an expiry date, and when it passes KernelCMS retires it for you - unpublishing, archiving, or deleting it on the next cron drain. It is built for embargoes, time-limited campaigns, retention / compliance, and auto-retiring stale content. You set the expiry on content you can already edit; KernelCMS handles the rest on a schedule.</p>

<h2 id="opt-in">Opt in</h2>
<p>Lifecycle is off until you configure it. List the collections that should expire content, and how:</p>
${code('ts', `export default defineConfig({
  lifecycle: {
    collections: [
      { slug: 'promos', expireField: 'expire_at', onExpire: 'unpublish' },
      { slug: 'press',  expireField: 'embargo_until', onExpire: 'archive' },
      { slug: 'tmp',    onExpire: 'delete' }, // expireField defaults to 'expire_at'
    ],
  },
  collections: [/* … */],
})`)}
<table class="compare"><thead><tr><th>Key</th><th class="us">Meaning</th><th>Default</th></tr></thead><tbody>
<tr><td><code>slug</code></td><td>The collection that expires content - must be <strong>drafts-enabled</strong>.</td><td>—</td></tr>
<tr><td><code>expireField</code></td><td>The <code>date</code> field holding when a document expires.</td><td><code>'expire_at'</code></td></tr>
<tr><td><code>onExpire</code></td><td><code>'unpublish'</code> | <code>'archive'</code> | <code>'delete'</code>.</td><td><code>'unpublish'</code></td></tr>
</tbody></table>
${warn(`Each <code>slug</code> must be a real, <a href="#/docs/versions-and-drafts">drafts-enabled</a> collection, and <code>expireField</code> must already be a <strong>declared <code>date</code> field</strong> on it. <strong>You own the schema</strong> - KernelCMS never auto-adds the column.`)}
${code('ts', `{
  slug: 'promos',
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'expire_at', type: 'date' }, // YOU declare the expiry field
  ],
}`)}

<h2 id="actions">The three actions</h2>
<p>When a <strong>published</strong> document's <code>expireField</code> date has passed, the next drain retires it per <code>onExpire</code>:</p>
<ul>
<li><strong><code>unpublish</code></strong> (default) - the document goes <strong>back to draft</strong>. The inverse of a publish: it leaves the read view, the content stays put.</li>
<li><strong><code>archive</code></strong> - draft <strong>plus</strong> a server-managed <code>_archived_at</code> timestamp. Hidden from public reads like any draft, but the stamp makes it <strong>distinguishable from a plain draft</strong> - "expired and retired" reads differently from "never published".</li>
<li><strong><code>delete</code></strong> - the document is <strong>removed</strong>.</li>
</ul>
<p><code>unpublish</code> and <code>archive</code> are recoverable; <code>delete</code> is not. <code>_archived_at</code> is written <em>only</em> by the drain when it archives, and is the marker that separates an archived document from a draft that simply hasn't been published yet.</p>

<h2 id="drain">Running the drain</h2>
<p>Expiry is applied by one Local-API operation. It scans the configured collections for published documents whose <code>expireField</code> is at or before <code>now</code> and retires each:</p>
${code('ts', `const { processed } = await kernel.processContentLifecycle({ now, limit })
// processed: Array<{ collection, id, action }>`)}
<p>Both arguments are optional: <code>now</code> defaults to the current time (validated), and <code>limit</code> bounds how many documents one drain retires (clamped). Like <code>processScheduledPublishes</code>, it is a <strong>trusted, cron-driven</strong> maintenance op that runs under override - there is <strong>no HTTP trigger</strong>. Drive it from a cron:</p>
${code('bash', `# the dedicated lifecycle drain
* * * * * cd /app && npx kernel lifecycle:run

# or jobs:run - now drains scheduled publishes, releases, AND lifecycle in one pass
* * * * * cd /app && npx kernel jobs:run`)}
${note(`<code>kernel lifecycle:run</code> runs only the lifecycle drain; <code>kernel jobs:run</code> drains everything due in one line. Each retire is audited with a <code>content.expire</code> entry, so an expiry is as traceable as a publish or a delete.`)}

<h2 id="guarantees">The guarantees</h2>
${tip(`The drain is <strong>cron / operator-only</strong> - <code>processContentLifecycle</code> has <strong>no HTTP trigger</strong> and is never reachable from an untrusted caller. That is exactly why it can run under <code>overrideAccess</code> safely: the only way to invoke it is operator code or a cron you control. It also <strong>only ever touches the configured lifecycle collections</strong>, and <code>now</code> / <code>limit</code> are validated and clamped.`)}
${warn(`<code>_archived_at</code> is <strong>server-managed and client-immutable</strong> - a normal user can never set it (to fake an archive) or clear it (to un-archive) through the API; only the trusted drain writes it. The <code>expireField</code> itself is an <strong>ordinary editor field</strong>: setting an expiry is a normal write, so you can only expire content you can already write. The privilege lives entirely in the drain that <em>applies</em> the expiry, not in scheduling it.`)}`
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
      slug: 'webhooks', group: 'Media & operations', nav: 'Webhooks', title: 'Outbound webhooks',
      lead: 'Push a signed HTTP POST to an external URL when documents change - inline best-effort or durable at-least-once with retry + backoff - behind a default-deny SSRF egress guard, with an admin delivery log and secrets that never leave the server.',
      html: `
<p><strong>Outbound webhooks</strong> push a signed <code>POST</code> to an external URL whenever a document changes, so a downstream system, a static-site rebuild, or a Slack relay can react without polling. Each delivery carries a small JSON payload and an HMAC signature the receiver verifies. A webhook <code>url</code> is <strong>default-deny on egress</strong> - it must be <code>http(s)</code> and may not target a loopback, private, link-local, or cloud-metadata host - and the signing <strong>secret</strong> and custom <strong>headers</strong> never leave the server. Durable delivery is <strong>at-least-once</strong> with bounded retries, so a receiver just verifies and dedupes.</p>

<h2 id="opt-in">Opt in</h2>
<p>Register one or more webhooks on the config. Each has a <code>url</code> and optional signing, filtering, and delivery options. Pick <strong>inline</strong> (best-effort, fires immediately) or <strong>durable</strong> (enqueued and retried) per endpoint:</p>
${code('ts', `export default defineConfig({
  webhooks: [
    // Inline (default): best-effort, fires immediately on the write.
    {
      slug: 'search-reindex',
      url: 'https://hooks.example.com/reindex',
      secret: process.env.REINDEX_SECRET, // HMAC-SHA256 signing key
      collections: ['posts'],             // default: all non-system collections
      events: ['create', 'update', 'delete'],
      headers: { 'x-source': 'kernel' },  // never returned by the admin surface
      timeoutMs: 5000,
    },
    // Durable: enqueued to the outbox and drained by the cron with retry + backoff.
    {
      slug: 'billing-sync',
      url: 'https://billing.internal.example.com/kernel',
      secret: process.env.BILLING_SECRET,
      collections: ['orders'],
      events: ['create', 'update'],
      durable: true,        // survives a down receiver — retried, never dropped
      maxAttempts: 5,       // default 5; exponential backoff, capped at 1h
    },
  ],
  collections: [/* … */],
})`)}
<p>Omit <code>collections</code> and the webhook fires for every non-system collection; omit <code>events</code> and it fires on <code>create</code>, <code>update</code>, and <code>delete</code>. A durable webhook registers a private <code>_webhook_deliveries</code> outbox table that is <strong>not</strong> reachable through generic CRUD.</p>

<h2 id="inline-vs-durable">Inline vs. durable delivery</h2>
<p>One config, two delivery modes - pick per endpoint with <code>durable</code>:</p>
<ul>
<li><strong>Inline (the default).</strong> A write fires a best-effort signed <code>POST</code> immediately. The document is committed first, so a slow or down receiver <strong>never fails the write</strong> - but if the receiver is down the event is <strong>dropped</strong>. Use it for non-critical fan-out.</li>
<li><strong>Durable (<code>durable: true</code>).</strong> The write enqueues the event to the outbox and returns. The cron drain delivers it with retry + exponential backoff (capped at 1h) up to <code>maxAttempts</code> (default 5), so a briefly-down receiver no longer drops events.</li>
</ul>
${note(`Durable delivery is <strong>at-least-once</strong>: a slow ACK or a retried partial success can deliver the same event twice. The payload is <code>{ event, collection, id, doc?, timestamp }</code> (<code>doc</code> omitted on delete) - receivers should <strong>dedupe</strong> on <code>id</code> + <code>event</code> + <code>timestamp</code>.`)}

<h2 id="verify">Verify the signature</h2>
<p>When a <code>secret</code> is set, each delivery carries <code>x-kernel-signature: sha256=&lt;hmac-of-body&gt;</code> (plus <code>x-kernel-event</code> and <code>x-kernel-timestamp</code>). Recompute the HMAC over the <strong>raw body bytes</strong> and compare in constant time:</p>
${code('js', `import { createHmac, timingSafeEqual } from 'node:crypto'

function verify(rawBody, header, secret) {
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(header ?? ''), b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
// reject with 401 if it doesn't match; dedupe on id+event+timestamp before acting.`)}

<h2 id="drain">The cron drain</h2>
<p>Durable deliveries sit in the outbox until a drain runs. <code>kernel.processWebhooks()</code> claims due deliveries, sends them, and reschedules failures with backoff. It is wired into the shared jobs runner:</p>
${code('bash', `kernel jobs:run        # drains background jobs + due webhook deliveries
kernel webhooks:run    # drain only webhook deliveries (standalone)`)}
<p>A delivery moves <code>pending → delivered</code> on success, or <code>pending → failed</code> while attempts remain, and lands on <code>exhausted</code> once it has used <code>maxAttempts</code> without a <code>2xx</code>. Every attempt is audited (<code>webhook.deliver</code> / <code>webhook.fail</code>) when auditing is on.</p>

<h2 id="admin">Admin surface</h2>
<p>Webhook management is <strong>admin-only</strong>, and the summaries are <strong>redacted</strong> - the admin surface never returns the signing <code>secret</code> or your custom <code>headers</code>:</p>
${code('http', `GET  /api/_admin/webhooks                                                  # registered webhooks (redacted)
GET  /api/_admin/webhooks/deliveries?webhook=&status=&since=&limit=&page=  # the durable delivery log
POST /api/_admin/webhooks/deliveries/:id/retry                             # requeue a failed/exhausted delivery`)}
<p>The same operations are on the Local API: <code>kernel.processWebhooks({ now?, limit? })</code>, <code>kernel.listWebhooks()</code> (redacted), <code>kernel.webhookDeliveries({ webhook?, status?, since?, limit?, page? })</code>, and <code>kernel.retryWebhookDelivery({ deliveryId })</code>. Statuses are <code>pending</code>, <code>delivered</code>, <code>failed</code>, <code>exhausted</code>.</p>
${code('bash', `# the delivery log for one webhook, exhausted only:
curl "http://localhost:3000/api/_admin/webhooks/deliveries?webhook=billing-sync&status=exhausted" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"

# requeue an exhausted delivery for the next drain:
curl -X POST "http://localhost:3000/api/_admin/webhooks/deliveries/$DELIVERY_ID/retry" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"`)}

<h2 id="guarantees">The guarantees</h2>
${warn(`<strong>SSRF: default-deny egress.</strong> A <code>url</code> must be <code>http(s)</code> and its host may <strong>not</strong> be loopback/private/link-local/cloud-metadata - <code>127.x</code>, <code>10.x</code>, <code>172.16–31.x</code>, <code>192.168.x</code>, <code>169.254.x</code> (incl. the metadata endpoint), <code>localhost</code>, <code>*.local</code>, <code>::1</code>, <code>fc/fd/fe8…</code>. Such a <code>url</code> is <strong>rejected at config load</strong>, before anything fires. The only way to target an internal host is <code>allowPrivateNetwork: true</code> on that one webhook - an explicit, per-endpoint opt-in for a trusted receiver or local dev.`)}
${tip(`The signing <code>secret</code> and custom <code>headers</code> are <strong>never returned</strong> by the admin surface (<code>listWebhooks</code> / <code>GET /api/_admin/webhooks</code> are redacted) and <strong>never logged</strong>. Durable delivery is <strong>at-least-once</strong> with bounded retries (backoff capped at 1h, then <code>exhausted</code>) - dedupe on <code>id</code> + <code>event</code> + <code>timestamp</code>. Inline delivery is best-effort on top of a committed write and never breaks it. The <code>_webhook_deliveries</code> outbox is unreachable via generic CRUD, management is admin-only, and attempts are audited. Red-teamed to Risk LOW.`)}`
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
    'personalization': { metaTitle: 'Personalization & A/B | KernelCMS Audience Variants', metaDesc: 'Personalize content in KernelCMS with per-field audience variants and built-in, deterministic A/B experiments - all from the same typed model. Access-checked and PII-free.' },
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
    'releases': { metaTitle: 'Content Releases | KernelCMS Atomic Publishing', metaDesc: 'Bundle draft documents and publish them together atomically in KernelCMS - optionally scheduled - for coordinated launches. All-or-nothing pre-flight, same per-doc publish gate.' },
    'content-lifecycle': { metaTitle: 'Content Lifecycle | KernelCMS Expiry & Archival', metaDesc: 'Set an expiry on published content and KernelCMS auto-unpublishes, archives, or deletes it when the date passes. Embargoes, campaigns, retention, and stale-content cleanup on a cron drain.' },
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
