import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// The page may arrive prerendered (static HTML per route, written by
// tools/prerender.mjs for crawlers). React still mounts and takes over so the
// app stays a fully interactive SPA - createRoot re-renders the identical tree
// over the prerendered DOM, then client-side routing runs as normal.
const rootElement = document.getElementById('app')!
ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />)
