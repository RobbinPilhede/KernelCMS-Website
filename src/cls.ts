/* Reusable Tailwind class strings for repeated component patterns.
   Brand colors are referenced via the CSS custom properties (so dark mode still
   flips through the .dark token overrides in styles.css). */

export const btn =
  'inline-flex items-center justify-center gap-2 px-[18px] py-[11px] rounded-[10px] ' +
  'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold ' +
  'cursor-pointer whitespace-nowrap transition-[background-color,border-color,transform,box-shadow] duration-150 ' +
  'hover:-translate-y-px active:translate-y-0 hover:border-[color-mix(in_srgb,var(--text)_26%,var(--border))] ' +
  '[&>svg]:w-4 [&>svg]:h-4'

export const btnPrimary = `${btn} !bg-[var(--primary)] !text-[var(--primary-fg)] !border-[var(--primary)]`
export const btnGhost = `${btn} !bg-transparent hover:!border-[color-mix(in_srgb,var(--text)_26%,var(--border))]`
export const btnSm = '!px-3 !py-[7px] !text-[13px] !rounded-lg'

export const iconLink =
  'grid place-items-center w-9 h-9 rounded-[9px] text-[var(--muted)] border border-transparent ' +
  'transition-colors duration-150 hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)] [&>svg]:w-[18px] [&>svg]:h-[18px]'

export const monoEyebrow = "font-[family-name:var(--mono)] text-[12.5px] text-[var(--muted)] m-0 mb-5 [&_.c]:text-[var(--faint)]"
