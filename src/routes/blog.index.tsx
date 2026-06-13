import { createFileRoute } from '@tanstack/react-router'
import { BlogIndex } from '../views'

export const Route = createFileRoute('/blog/')({ component: BlogIndex })
