/* eslint-disable */
// @ts-nocheck
import { createFileRoute, Link } from '@tanstack/react-router'
import { Icon, useHead } from '../ui'
import { btnPrimary, btnGhost } from '../cls'

export const Route = createFileRoute('/safety')({ component: Safety })

const wrap = 'w-full max-w-[var(--maxw)] mx-auto px-[clamp(18px,4vw,36px)]'

const PRACTICES: [string, string, string][] = [
  ['shield', 'Deny by default', 'Every collection denies all access until you declare what is allowed. Nothing is public by accident; the doctor and admin flag any collection with no access rules.'],
  ['lock', 'Row- and field-level control', 'Access rules return a boolean or a row filter, at the collection and the field level. A caller only ever sees the rows and the fields they are allowed to, on every read, update, and delete.'],
  ['shield', 'Privilege-escalation guard', 'On auth collections, authority fields (roles, permissions, is_admin) are admin-write by default. A user who can edit their own record still cannot promote themselves.'],
  ['lock', 'Hardened authentication', 'Scrypt password hashing, HttpOnly SameSite cookies, a same-origin check on cookie-authed writes, no user-enumeration on reset and verify flows, and TOTP two-factor built on node:crypto.'],
  ['terminal', 'No injection', 'SQL identifiers are validated and every value is parameterized. There is no string concatenation into queries, anywhere.'],
  ['feather', 'Secrets stay secret', 'Passwords are never returned. Reset, verification, and TOTP secrets never leave the server and are kept out of the OpenAPI spec. Nothing sensitive appears in errors, logs, or client code.'],
  ['sparkles', 'One model for humans and agents', 'AI agents enter through the same access pipeline as people and inherit the same row- and field-level rules. An agent can never read or write something a human in its role could not.'],
  ['gauge', 'Migrations cannot lose data', 'kernel migrate only creates tables and adds columns; it never drops or retypes. Destructive changes are reported by migrate:status and applied by hand, never silently.'],
]

function Safety() {
  useHead(
    'Safety & security - KernelCMS',
    'How KernelCMS keeps your content safe: deny-by-default access, row- and field-level control, hardened auth, no injection, and the same access model for humans and AI agents.',
    { keywords: ['CMS security', 'headless CMS access control', 'deny by default', 'field-level permissions', 'responsible disclosure'] },
  )
  return (
    <main>
      <section className="pt-[clamp(56px,8vw,104px)] pb-[clamp(32px,5vw,56px)] text-center"><div className={`${wrap} max-w-[760px]`}>
        <div className="inline-grid place-items-center w-16 h-16 rounded-[18px] bg-[color-mix(in_srgb,var(--text)_7%,transparent)] [&>svg]:w-7 [&>svg]:h-7"><Icon name="shield" /></div>
        <p className="font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] mt-7 mb-4">// safety &amp; security</p>
        <h1 className="text-[clamp(2.1rem,1.4rem+2.8vw,3.4rem)] font-semibold tracking-[-0.03em] leading-[1.05] max-w-[20ch] mx-auto">Security you can verify, not just trust.</h1>
        <p className="text-[clamp(1.05rem,0.9rem+0.6vw,1.25rem)] leading-[1.7] text-[var(--muted)] max-w-[60ch] mx-auto mt-6">
          KernelCMS is built so the safe path is the default path. Access is denied until you allow it, every value
          is parameterized, secrets never leave the server, and humans and AI agents are held to the exact same
          rules. Here is how, in detail.
        </p>
      </div></section>

      <section className="pb-[clamp(40px,6vw,80px)]"><div className={wrap}>
        <div className="grid grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[16px] overflow-hidden max-[760px]:grid-cols-1">
          {PRACTICES.map(([icon, title, desc]) => (
            <div key={title} className="bg-[var(--surface)] p-[28px] flex flex-col gap-3 transition-colors hover:bg-[var(--surface-2)]">
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-[color-mix(in_srgb,var(--text)_7%,transparent)] text-[var(--text)] [&>svg]:w-[21px] [&>svg]:h-[21px]"><Icon name={icon} /></div>
              <h3 className="text-[17px] font-semibold">{title}</h3>
              <p className="text-[var(--muted)] text-[14.5px] leading-[1.55] text-pretty m-0">{desc}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="pb-[clamp(56px,9vw,110px)]"><div className={`${wrap} max-w-[760px]`}>
        <div className="border border-[var(--border)] rounded-[18px] bg-[var(--surface)] p-[clamp(24px,4vw,40px)]">
          <h2 className="text-[clamp(1.4rem,1.1rem+1.2vw,1.9rem)] font-semibold tracking-[-0.02em]">Reporting a vulnerability</h2>
          <p className="text-[var(--muted)] leading-[1.65] mt-3 text-pretty">
            We take security reports seriously and practice responsible disclosure. If you believe you have found a
            vulnerability, please do not open a public issue. Email <a className="text-[var(--text)] underline underline-offset-[3px] decoration-[var(--border)] hover:decoration-[var(--text)]" href="mailto:security@kernelcms.com">security@kernelcms.com</a> or open a private
            advisory on the <a className="text-[var(--text)] underline underline-offset-[3px] decoration-[var(--border)] hover:decoration-[var(--text)]" href="https://github.com/RobbinPilhede/KernelCMS/security/advisories/new" target="_blank" rel="noopener">GitHub Security Advisories</a> page. We will
            acknowledge your report, work with you on a fix, and credit you in the release notes if you would like.
          </p>
          <p className="text-[var(--muted)] leading-[1.65] mt-4 text-pretty">
            Production checklist: set a long random <code className="font-[family-name:var(--mono)] text-[0.88em] px-[5px] py-px rounded bg-[color-mix(in_srgb,var(--text)_8%,transparent)]">KERNEL_SECRET</code>, serve over HTTPS, use an explicit CORS
            allow-list (never a wildcard with credentials), and run <code className="font-[family-name:var(--mono)] text-[0.88em] px-[5px] py-px rounded bg-[color-mix(in_srgb,var(--text)_8%,transparent)]">kernel doctor</code> as a deploy preflight.
          </p>
          <div className="flex items-center gap-3 mt-7 flex-wrap">
            <Link className={btnPrimary} to="/docs/$slug" params={{ slug: 'access-control' }}><Icon name="shield" /> Read about access control</Link>
            <Link className={btnGhost} to="/docs/$slug" params={{ slug: 'authentication' }}>Authentication docs <Icon name="arrow" /></Link>
          </div>
        </div>
      </div></section>
    </main>
  )
}
