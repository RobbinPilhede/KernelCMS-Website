/* eslint-disable */
// @ts-nocheck
import { createFileRoute, Link } from '@tanstack/react-router'
import { Mark, Icon, useHead } from '../ui'
import { btnPrimary, btnGhost } from '../cls'

export const Route = createFileRoute('/about')({ component: About })

const wrap = 'w-full max-w-[820px] mx-auto px-[clamp(18px,4vw,36px)]'
const eyebrow = 'font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] mb-4'
const lead = 'text-[clamp(1.05rem,0.9rem+0.6vw,1.35rem)] leading-[1.7] text-[color-mix(in_srgb,var(--text)_88%,var(--muted))]'
const h2 = 'text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] font-semibold tracking-[-0.025em] mt-20 mb-5'

function Principle({ n, title, children }: any) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-5 py-6 border-t border-[var(--border)]">
      <span className="font-[family-name:var(--mono)] text-sm text-[var(--faint)] pt-1">{n}</span>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-[var(--muted)] leading-[1.65] text-pretty">{children}</p>
      </div>
    </div>
  )
}

function About() {
  useHead(
    'About KernelCMS — content infrastructure you own',
    'Our belief: every site and app should be able to get a real backend in minutes, owned by you, with no framework lock-in and no SaaS rent. This is how content infrastructure should work.',
  )
  return (
    <main>
      {/* Hero */}
      <section className="pt-[clamp(56px,9vw,120px)] pb-[clamp(32px,5vw,64px)] relative overflow-hidden">
        <div className="bg" aria-hidden="true" style={{ position: 'absolute' }}><div className="pixels" /></div>
        <div className={`${wrap} relative`}>
          <Mark cls="lg" />
          <p className={`${eyebrow} mt-8`}>// the future of content infrastructure</p>
          <h1 className="text-[clamp(2.3rem,1.4rem+3.4vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em] max-w-[18ch]">
            The backend should belong to <span className="text-[var(--muted)]">you</span>.
          </h1>
          <p className={`${lead} mt-7 max-w-[58ch]`}>
            Anyone can build a website now. AI writes the front end in minutes. But the moment you need real
            content — a database, an API, a way for your team to edit it — you hit a wall: rent a hosted CMS and
            accept the lock-in and the bill, or bolt on a heavyweight framework that swallows your whole app. We
            think that wall shouldn't exist.
          </p>
        </div>
      </section>

      <section className="pb-[clamp(48px,8vw,110px)]"><div className={wrap}>
        <h2 className={h2}>Content infrastructure is broken</h2>
        <p className={lead}>
          For twenty years the deal has been the same. The hosted platforms make editing easy and then own your
          data, meter your traffic, and raise the price. The self-hosted frameworks give you control and then
          couple you to one runtime, one database, one way of building. You are always trading ownership for
          convenience, or convenience for ownership. You should never have to choose.
        </p>
        <p className={`${lead} mt-5`}>
          Meanwhile the way software gets built has changed completely. A founder spins up a landing page with an
          AI tool over coffee. A designer ships a marketing site without a developer. They don't have a backend
          team. They have a beautiful, hardcoded front end and no way to make it real. The hardest part of
          shipping is no longer the front end — it's everything behind it.
        </p>

        <h2 className={h2}>What we believe</h2>
        <p className={lead}>
          Every site and every app deserves a real backend it owns — a database, an API, authentication, and a
          place for people to edit content — and getting one should take minutes, not a migration. It should run
          on web standards, sit beside whatever you already built, and never ask you to adopt a framework or hand
          over your data. The content layer should be infrastructure you control, not a service you rent.
        </p>
        <p className={`${lead} mt-5`}>
          And it should serve everyone at once. Developers should describe the model in code they can review and
          version. Editors — and increasingly, the AI agents working alongside them — should change content
          through the same access rules, with no second system to get wrong. <strong className="text-[var(--text)] font-semibold">Code where it matters; no-code
          where it counts.</strong> One model, owned by you, shared by your whole team.
        </p>

        <h2 className={h2}>How it should work</h2>
        <div className="mt-2">
          <Principle n="01" title="You own the data, always">
            Content lives in your database, on your infrastructure, under a permissive license. No Content Lake, no
            export step to leave, no vendor that can change the terms. Portability isn't a feature — it's the default.
          </Principle>
          <Principle n="02" title="No framework lock-in">
            A backend should be a plain server you can run anywhere — Node, the edge, a single container — and embed
            into any front end or none. It joins your stack; it doesn't become your stack.
          </Principle>
          <Principle n="03" title="One model, three surfaces">
            You describe your content once. From that, the database, a REST and GraphQL API, a typed in-process API,
            and a no-code admin all follow — enforcing the same access rules everywhere. Define it once; never keep
            two systems in sync.
          </Principle>
          <Principle n="04" title="Lean by default, powerful on demand">
            A fresh project should boot in seconds with nothing to compile. Heavy choices — Postgres, S3, Redis,
            OAuth, image processing — are adapters you add when you need them, never weight you carry from day one.
          </Principle>
          <Principle n="05" title="Secure and honest by construction">
            Deny by default. Row-level and field-level access. No accidental privilege escalation. The safe path is
            the default path, so the easy thing to build is also the right thing to ship.
          </Principle>
        </div>

        <h2 className={h2}>The bet</h2>
        <p className={lead}>
          The number of people who can build a front end just went up by orders of magnitude. The number who can
          stand up a backend did not. That gap is the opportunity of this decade — and it closes only if the
          backend becomes something you can add to any site, in minutes, and truly own. That is the thing we are
          building. Not a CMS with an API. A content layer that humans and agents share, with one access model
          over both, that belongs to the people who use it.
        </p>
        <p className={`${lead} mt-5`}>
          That's the future we believe in, and the standard we hold ourselves to. If it resonates, the fastest way
          to feel it is to give one of your own sites a backend and see how little it takes.
        </p>

        <div className="flex items-center gap-3 mt-10 flex-wrap">
          <Link className={btnPrimary} to="/guides/$slug" params={{ slug: 'add-a-backend-to-any-site' }}><Icon name="bolt" /> Add a backend to your site</Link>
          <Link className={btnGhost} to="/docs">Read the docs <Icon name="arrow" /></Link>
        </div>
      </div></section>
    </main>
  )
}
