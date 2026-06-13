/* eslint-disable */
// @ts-nocheck -- ported, framework-agnostic helpers (syntax highlighter + SVG art)

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- syntax highlighting (multi-language) ----------------------------------
export function highlight(src: string, lang?: string) {
  lang = lang || detectLang(src);
  if (lang === 'text') return esc(src);
  if (lang === 'bash' || lang === 'shell' || lang === 'sh') return hlBash(src);
  if (lang === 'json' || lang === 'jsonc') return hlJson(src);
  if (lang === 'http') return hlHttp(src);
  if (lang === 'graphql' || lang === 'gql') return hlGql(src);
  return hlTs(src);
}
function detectLang(s: string) {
  const t = s.trim();
  if (/^(GET|POST|PUT|PATCH|DELETE)\s/.test(t)) return 'http';
  if (/^(npm|npx|pnpm|yarn|node|curl|docker|kernel|cd|git)\b/.test(t)) return 'bash';
  if (/^\{[\s\S]*\}$/.test(t) && !/=>/.test(t)) return 'json';
  if (/^(query|mutation|subscription|fragment)\b/.test(t)) return 'graphql';
  return 'ts';
}
const TS_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(true|false|null|undefined)\b|\b(import|from|export|default|const|let|var|return|async|await|function|type|interface|class|extends|implements|new|typeof|instanceof|of|in|if|else|for|while|switch|case|break|continue|throw|try|catch|finally|as|satisfies|readonly|void|yield|this)\b(?!\s*:)|\b([A-Z][A-Za-z0-9_]*)\b|\b([a-z_$][A-Za-z0-9_$]*)(?=\s*\()|\b(\d[\d_]*(?:\.\d+)?)\b/g;
function hlTs(src: string) {
  return esc(src).replace(TS_RE, (m, com, str, bool, kw, type, fn, num) => {
    if (com) return `<span class="t-com">${com}</span>`;
    if (str) return `<span class="t-str">${str}</span>`;
    if (bool) return `<span class="t-bool">${bool}</span>`;
    if (kw) return `<span class="t-key">${kw}</span>`;
    if (type) return `<span class="t-type">${type}</span>`;
    if (fn) return `<span class="t-fn">${fn}</span>`;
    if (num) return `<span class="t-num">${num}</span>`;
    return m;
  });
}
function jsonTok(e: string) {
  return e.replace(/("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\b\d[\d.eE+-]*\b)/g,
    (m, str, colon, bool, num) => {
      if (str != null) return colon != null ? `<span class="t-prop">${str}</span>${colon}` : `<span class="t-str">${str}</span>`;
      if (bool) return `<span class="t-bool">${bool}</span>`;
      if (num) return `<span class="t-num">${num}</span>`;
      return m;
    });
}
function hlJson(src: string) { return jsonTok(esc(src)); }
function hlBash(src: string) {
  let e = esc(src).replace(/(#[^\n]*)|("(?:[^"\\]|\\.)*"|'[^']*')|(\s--?[A-Za-z][\w-]*)|(\$\w+|\$\{[^}]+\})/g,
    (m, com, str, flag, varr) => {
      if (com) return `<span class="t-com">${com}</span>`;
      if (str) return `<span class="t-str">${str}</span>`;
      if (flag) return `<span class="t-key">${flag}</span>`;
      if (varr) return `<span class="t-num">${varr}</span>`;
      return m;
    });
  e = e.replace(/(^|\n)(\s*)([a-z][\w.:-]*)/g, (mm, br, sp, cmd) => `${br}${sp}<span class="t-fn">${cmd}</span>`);
  return e;
}
function hlHttp(src: string) {
  let body = false;
  return esc(src).split('\n').map((line) => {
    if (body) return jsonTok(line);
    if (!line.trim()) { body = true; return line; }
    const mm = line.match(/^(GET|POST|PUT|PATCH|DELETE)(\s+)(.*)$/);
    if (mm) return `<span class="t-key">${mm[1]}</span>${mm[2]}<span class="t-fn">${mm[3]}</span>`;
    const h = line.match(/^([\w-]+)(:\s*)(.*)$/);
    if (h) return `<span class="t-prop">${h[1]}</span>${h[2]}<span class="t-str">${h[3]}</span>`;
    return line;
  }).join('\n');
}
function hlGql(src: string) {
  return esc(src).replace(/(#[^\n]*)|\b(query|mutation|subscription|fragment|type|input|enum|scalar|interface|on|true|false|null)\b|("(?:[^"\\]|\\.)*")|\b([A-Z][A-Za-z0-9_]*)\b/g,
    (m, com, kw, str, type) => {
      if (com) return `<span class="t-com">${com}</span>`;
      if (kw) return `<span class="t-key">${kw}</span>`;
      if (str) return `<span class="t-str">${str}</span>`;
      if (type) return `<span class="t-type">${type}</span>`;
      return m;
    });
}

// ---- brand mark + article cover art ----------------------------------------
export const STAR = `M50 0 L53 34 L68 3 L55 36 L90 12 L58 40 L98 38 L59 46 L100 50 L59 55 L96 68 L57 58 L88 90 L54 62 L65 98 L51 64 L50 100 L48 62 L32 96 L45 60 L8 85 L42 56 L2 65 L41 52 L0 50 L42 46 L4 35 L44 42 L12 14 L46 38 L35 5 L48 36 Z`;

const COMPETITORS = {
  payload: { name: 'Payload', accent: '#9db0ff', tag: 'Next.js · MIT' },
  sanity: { name: 'Sanity', accent: '#fb6a59', tag: 'SaaS · GROQ' },
  strapi: { name: 'Strapi', accent: '#a594ff', tag: 'Node · plugins' },
  contentful: { name: 'Contentful', accent: '#5aa9e6', tag: 'SaaS · enterprise' },
  directus: { name: 'Directus', accent: '#8b7bff', tag: 'DB-first · BSL' },
};
export function coverSVG(kind?: string, opts?: { label?: boolean }) {
  const showLabel = !opts || opts.label !== false;
  const c = COMPETITORS[kind as keyof typeof COMPETITORS];
  const defs = `<defs>
    <linearGradient id="cvbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101216"/><stop offset="1" stop-color="#0a0b0e"/></linearGradient>
    <pattern id="cvdot" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1.4" cy="1.4" r="1.4" fill="#ffffff" fill-opacity="0.05"/></pattern>
    <radialGradient id="cvglow" cx="0.5" cy="0.12" r="0.75"><stop offset="0" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  </defs>`;
  const base = `<rect width="1200" height="630" fill="url(#cvbg)"/><rect width="1200" height="630" fill="url(#cvdot)"/><rect width="1200" height="630" fill="url(#cvglow)"/>`;
  const star = (cx, cy, s, fill) => `<path transform="translate(${cx - 50 * s} ${cy - 50 * s}) scale(${s})" d="${STAR}" fill="${fill}"/>`;
  const word = (x, y, size) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Jost, sans-serif" font-size="${size}" letter-spacing="1" fill="#f4f4f6"><tspan font-weight="300">Kernel</tspan><tspan font-weight="500">CMS</tspan></text>`;
  const label = `<text x="64" y="82" font-family="ui-monospace, monospace" font-size="22" letter-spacing="3" fill="#6a6a76">KERNELCMS&#160;&#160;/&#160;&#160;COMPARISON</text>`;
  if (c) {
    const fs = Math.min(98, Math.round(480 / (c.name.length * 0.58)));
    return `<svg class="cover" viewBox="0 0 1200 630" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name} versus KernelCMS">
      ${defs}${base}${showLabel ? label : ''}
      <text x="330" y="322" text-anchor="middle" font-family="Inter, sans-serif" font-size="${fs}" font-weight="600" fill="${c.accent}">${c.name}</text>
      <text x="330" y="368" text-anchor="middle" font-family="ui-monospace, monospace" font-size="21" letter-spacing="1" fill="#7b7b86">${c.tag}</text>
      <line x1="600" y1="158" x2="600" y2="462" stroke="${c.accent}" stroke-opacity="0.3" stroke-width="2"/>
      <circle cx="600" cy="298" r="38" fill="#0b0c0f" stroke="${c.accent}" stroke-width="2"/>
      <text x="600" y="307" text-anchor="middle" font-family="ui-monospace, monospace" font-size="24" font-weight="700" letter-spacing="1" fill="${c.accent}">VS</text>
      ${star(874, 244, 0.92, '#f4f4f6')}${word(874, 372, 54)}
      <text x="874" y="410" text-anchor="middle" font-family="ui-monospace, monospace" font-size="21" letter-spacing="1" fill="#7b7b86">config-as-code · MIT</text>
      <rect x="0" y="624" width="1200" height="6" fill="${c.accent}"/>
    </svg>`;
  }
  return `<svg class="cover" viewBox="0 0 1200 630" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KernelCMS">
    ${defs}${base}${showLabel ? label : ''}${star(600, 250, 1.6, '#f4f4f6')}${word(600, 450, 70)}
    <rect x="0" y="624" width="1200" height="6" fill="#3a3a44"/>
  </svg>`;
}

export function markSVG(cls?: string) {
  return `<svg class="logo-mark${cls ? ' ' + cls : ''}" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <defs><linearGradient id="km" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop offset="0" class="mk-edge"/><stop offset="0.5" class="mk-mid"/><stop offset="1" class="mk-edge"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-70 -70; 70 70; -70 -70" dur="4.5s" repeatCount="indefinite"/>
    </linearGradient></defs>
    <path d="${STAR}" fill="url(#km)"/></svg>`;
}

export type Theme = 'light' | 'dark';
export function getTheme(): Theme {
  try {
    const v = localStorage.getItem('kernel-theme');
    if (v === 'light' || v === 'dark') return v;
  } catch (e) {}
  return 'dark';
}
export function applyTheme(t: Theme) {
  document.documentElement.classList.toggle('dark', t === 'dark');
  try { localStorage.setItem('kernel-theme', t); } catch (e) {}
}
