import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { Background, Topbar, Footer, CommandPalette } from '../ui'
import '../styles.css'

export const Route = createRootRoute({ component: RootComponent })

function RootComponent() {
  // Key the outlet on the path so each route mounts fresh and replays the
  // page-enter animation (fade + staggered section rise).
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <>
      <Background />
      <Topbar />
      <div key={pathname} className="page-enter">
        <Outlet />
      </div>
      <Footer />
      <CommandPalette />
    </>
  )
}
