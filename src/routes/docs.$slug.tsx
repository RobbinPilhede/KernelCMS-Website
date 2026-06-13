import { createFileRoute } from '@tanstack/react-router'
import { DocPage } from '../views'

export const Route = createFileRoute('/docs/$slug')({ component: () => <DocPage slug={Route.useParams().slug} /> })
