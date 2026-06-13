import { createFileRoute } from '@tanstack/react-router'
import { ArticleReader } from '../views'

export const Route = createFileRoute('/blog/$slug')({ component: () => <ArticleReader slug={Route.useParams().slug} /> })
