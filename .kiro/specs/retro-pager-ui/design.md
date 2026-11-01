# Design: Retro Pager UI

## Layout
Header (title, tabs Pager / Operator Call, language toggle) → Pager view (device + today's pages list with quota) or Call view (operator greeting, recipient, textarea, batch checkbox, send, code dictionary).

## Visual
`VT323` pixel font; LCD colors `#9bbc0f` / `#0f380f`; CSS marquee animation for scrolling; `.vibrate` keyframes for buzz; priority color bars (high red, normal green, digest blue).

## Behaviour
- `I18N` table in `public/app.js` keyed by `data-i18n` attributes.
- `beep()`: three 2400 Hz square-wave chirps via WebAudio; `navigator.vibrate` on mobile.
- State `pages[]` in `localStorage['aps.pages.v1']`; quota 5 important pages/day, rest merged into the digest page.
- Footer shows AI vs rule-based operator from `/api/health`.
