import { createFileRoute } from '@tanstack/react-router'
import { GuideReader } from '../views'

export const Route = createFileRoute('/guides/$slug')({ component: () => <GuideReader slug={Route.useParams().slug} /> })
