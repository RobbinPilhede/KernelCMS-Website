import { createFileRoute } from '@tanstack/react-router'
import { GuidesIndex } from '../views'

export const Route = createFileRoute('/guides/')({ component: GuidesIndex })
