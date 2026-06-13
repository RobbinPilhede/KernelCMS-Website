/* eslint-disable */
// @ts-nocheck
//
// Inline brand marks for the "Migrate from X" cards and the homepage band.
// One <svg> per slug, 24x24 viewBox, rendered with `fill: currentColor` so the
// caller controls the color (brand hex on /prompts, var(--text) on hover in the
// homepage band). Each carries an accessible <title> for screen readers.
//
// Marks are the official wordless logos from simple-icons (simpleicons.org,
// CC0), except Payload, which has no simple-icons entry and is drawn here as a
// clean monogram of its three-cube mark in the brand's geometric style.
//
import type { CSSProperties } from 'react'

// Single-path icons keyed by slug. Each path renders correctly with
// fill-rule:evenodd (the simple-icons default) so counters/cut-outs show.
const PATHS: Record<string, string> = {
  // simple-icons: Sanity
  sanity:
    'M5.358 2.182c0 2.43 1.515 3.876 4.546 4.635l3.212.735c2.869.653 4.617 2.272 4.617 4.897a4.679 4.679 0 0 1-.973 2.928c0-2.636-1.378-4.054-4.698-4.904l-3.152-.71C6.293 9.886 4.394 8.39 4.394 5.539a4.713 4.713 0 0 1 .964-3.357M16.84 14.12c1.34.848 1.922 2.024 1.922 3.708-1.111 1.409-3.061 2.211-5.353 2.211-3.856 0-6.557-1.892-7.156-5.174h3.524c.477 1.508 1.74 2.205 3.603 2.205 2.276 0 3.787-1.202 3.792-2.95M7.169 9.443C5.92 8.652 5.207 7.42 5.207 5.74c1.05-1.347 2.926-2.182 5.156-2.182 3.927 0 6.198 2.058 6.755 4.943h-3.39c-.39-1.137-1.369-2.024-3.323-2.024-2.087 0-3.51 1.205-3.516 2.967',
  // simple-icons: Contentful
  contentful:
    'M7.111 16.853a4.486 4.486 0 0 1 0-6.346c.65-.65.65-1.704 0-2.353a1.665 1.665 0 0 0-2.353 0c-3.275 3.275-3.275 8.583 0 11.858a8.39 8.39 0 0 0 11.858 0 1.665 1.665 0 0 0 0-2.353 1.665 1.665 0 0 0-2.353 0 4.486 4.486 0 0 1-6.346 0M7.111 7.111a4.486 4.486 0 0 1 6.346 0c.65.65 1.704.65 2.353 0a1.665 1.665 0 0 0 0-2.353A8.39 8.39 0 0 0 4.758 4.758a1.665 1.665 0 0 0 0 2.353c.65.65 1.704.65 2.353 0M4.74 13.516a1.665 1.665 0 1 0 0-3.33 1.665 1.665 0 0 0 0 3.33',
  // simple-icons: Strapi
  strapi:
    'M16.672 0v7.328H24L16.672 0Zm-.336.336H7.625c-2.305 0-3.457 0-4.336.448a4.116 4.116 0 0 0-1.793 1.793c-.448.88-.448 2.031-.448 4.336v8.711c0 2.305 0 3.457.448 4.336.395.773 1.02 1.398 1.793 1.793.879.448 2.031.448 4.336.448h8.711c2.305 0 3.457 0 4.336-.448a4.116 4.116 0 0 0 1.793-1.793c.448-.879.448-2.031.448-4.336V7.664h-7.16c-.55 0-.824 0-1.034-.107a.984.984 0 0 1-.43-.43c-.107-.21-.107-.485-.107-1.035V.336ZM7.937 7.664h8.399v8.399H8.273c-.156 0-.234 0-.246-.094v-.012-8.293Zm8.399 0v.011h.011v-.011h-.011Zm0 8.41h.011v.012c0 .156 0 .234-.093.246h-8.31c.156 0 .234 0 .246-.094h7.926c.156 0 .234 0 .246-.094v-.058l-.026-.011Z',
  // simple-icons: WordPress
  wordpress:
    'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.11A10.89 10.89 0 0 1 22.89 12 10.89 10.89 0 0 1 12 22.89 10.89 10.89 0 0 1 1.11 12 10.89 10.89 0 0 1 12 1.11zM2.382 12c0 3.804 2.21 7.094 5.414 8.654L3.214 8.5A9.567 9.567 0 0 0 2.382 12zm16.169-.487c0-1.19-.427-2.013-.793-2.653-.488-.793-.945-1.464-.945-2.256 0-.884.671-1.708 1.617-1.708.043 0 .083.005.124.008A9.57 9.57 0 0 0 12 2.382a9.578 9.578 0 0 0-8.016 4.32c.21.006.408.011.577.011.94 0 2.394-.115 2.394-.115.486-.028.543.685.058.742 0 0-.488.057-1.03.085l3.276 9.745 1.97-5.905-1.403-3.84c-.485-.028-.944-.085-.944-.085-.486-.03-.43-.77.056-.742 0 0 1.484.115 2.366.115.94 0 2.394-.115 2.394-.115.487-.028.544.685.058.742 0 0-.489.057-1.03.085l3.252 9.673.897-2.999c.39-1.246.685-2.14.685-2.911zm-6.39 1.342l-2.7 7.847a9.018 9.018 0 0 0 2.538.362c1.057 0 2.07-.183 3.013-.515a.85.85 0 0 1-.066-.127l-2.785-7.567zm8.205-5.41c.039.286.06.594.06.924 0 .912-.17 1.938-.683 3.22l-2.746 7.94c2.673-1.558 4.47-4.454 4.47-7.769a9.555 9.555 0 0 0-1.101-4.315z',
  // simple-icons: Directus
  directus:
    'M12.058.002a11.94 11.94 0 0 0-9.221 4.181 11.937 11.937 0 0 0-1.96 11.625 11.94 11.94 0 0 0 8.954 7.764 11.943 11.943 0 0 0 11.296-3.788 11.937 11.937 0 0 0 2.762-11.486A11.94 11.94 0 0 0 14.27.18a12.06 12.06 0 0 0-2.212-.178zm.043 3.193a8.738 8.738 0 0 1 1.62.142 2.143 2.143 0 0 1 1.741 2.114 2.144 2.144 0 0 1-2.146 2.144 2.144 2.144 0 0 1-2.144-2.144 2.143 2.143 0 0 1 .263-1.027 8.79 8.79 0 0 0-.93-.05 8.755 8.755 0 0 0-3.522.736 1.072 1.072 0 0 0 .43 2.054 1.072 1.072 0 0 0 .603-.187 6.61 6.61 0 0 1 2.486-.52 6.624 6.624 0 0 1 6.622 6.623 6.624 6.624 0 0 1-6.622 6.622 6.624 6.624 0 0 1-6.623-6.622 1.072 1.072 0 0 0-1.072-1.072 1.072 1.072 0 0 0-1.072 1.072 8.768 8.768 0 0 0 8.767 8.766 8.768 8.768 0 0 0 8.766-8.766 8.768 8.768 0 0 0-7.456-8.665 8.737 8.737 0 0 0-1.31-.099l.026.001a8.768 8.768 0 0 0-1.61.147z',
  // Payload — drawn here (no simple-icons entry): the three-prism diamond mark,
  // rendered in a neutral color by the card because the brand hex is pure black.
  payload:
    'M11.967 0 22 6.017v8.4l-7.13-4.282V3.018L8.04 6.98 11.967 0ZM2 15.6 14.13 8.4v8.967l-3.46 2.07L2 15.6Z',
}

const TITLES: Record<string, string> = {
  sanity: 'Sanity',
  contentful: 'Contentful',
  strapi: 'Strapi',
  wordpress: 'WordPress',
  directus: 'Directus',
  payload: 'Payload',
}

export function BrandLogo({
  slug,
  className,
  style,
  title,
}: {
  slug: string
  className?: string
  style?: CSSProperties
  title?: string
}) {
  const d = PATHS[slug]
  if (!d) return null
  const label = title || TITLES[slug] || slug
  return (
    <svg
      role="img"
      aria-label={`${label} logo`}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      className={className}
      style={style}
    >
      <title>{label}</title>
      <path d={d} />
    </svg>
  )
}

// Slugs of every brand we have a mark for (handy for the homepage band).
export const BRAND_SLUGS = ['sanity', 'contentful', 'strapi', 'payload', 'wordpress', 'directus'] as const

// Brands whose hex is too dark to read on the dark theme: render in --text and
// use a neutral accent instead of the brand color.
export const DARK_BRANDS = new Set(['payload'])
