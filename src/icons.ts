/* eslint-disable */
// @ts-nocheck
/* Inline SVG icon set - stroke icons share the admin's 2px feather-style look. */

  const s = (p, o) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${(o && o.w) || 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  export const ICONS: Record<string,string> = {
    moon: s('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>', { w: 2.5 }),
    sun: s('<circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2M12 20.5v2M3.5 12h-2M22.5 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"/>', { w: 2.5 }),
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>',
    search: s('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
    menu: s('<path d="M3 6h18M3 12h18M3 18h18"/>'),
    x: s('<path d="M18 6 6 18M6 6l12 12"/>'),
    copy: s('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),
    check: s('<path d="M20 6 9 17l-5-5"/>'),
    arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    arrowLeft: s('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
    bolt: s('<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>'),
    layers: s('<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>'),
    shield: s('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    plug: s('<path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8zM12 16v6"/>'),
    code: s('<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'),
    db: s('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'),
    box: s('<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>'),
    sparkles: s('<path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3zM19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2zM5 15l.6 1.5L7 17l-1.4.5L5 19l-.6-1.5L3 17l1.4-.5L5 15z"/>'),
    book: s('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
    compass: s('<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2z"/>'),
    feather: s('<path d="M20.2 3.8a5.5 5.5 0 0 0-7.8 0L4 12.2V20h7.8l8.4-8.4a5.5 5.5 0 0 0 0-7.8zM16 8 2 22M17.5 15H9"/>'),
    globe: s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>'),
    terminal: s('<path d="m4 17 6-6-6-6M12 19h8"/>'),
    rocket: s('<path d="M5 13c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0zM12 15l-3-3a14 14 0 0 1 3-7c1.9-1.9 4-2 5-2s.9 3-2 5a14 14 0 0 1-3 3z"/>'),
    gauge: s('<path d="M12 14 9 9M3.3 17a9 9 0 1 1 17.4 0"/>'),
    lock: s('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    branch: s('<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 2-6 7"/>'),
    info: s('<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>'),
    hash: s('<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>'),
    star: s('<path d="m12 2 3 7 7 .5-5.3 4.6L18 21l-6-3.8L6 21l1.3-6.9L2 9.5 9 9z"/>'),
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  };
