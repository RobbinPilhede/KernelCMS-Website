import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Background, Topbar, Footer, CommandPalette } from '../ui'
import '../styles.css'

export const Route = createRootRoute({ component: RootComponent })

function RootComponent() {
  return (
    <>
      <Background />
      <Topbar />
      <Outlet />
      <Footer />
      <CommandPalette />
    </>
  )
}
