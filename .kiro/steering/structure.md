---
inclusion: always
---
# Structure
- `src/engine.js` compression, triage, digest, AI response parsing
- `src/codes.js` numeric code dictionary
- `src/ai.js` AI call + fallback (server only)
- `api/page.js` POST /api/page handler
- `server.js` local server (static + API)
- `public/` UI (`index.html`, `style.css`, `app.js` incl. I18N table)
- `test/` unit tests; `scripts/build.js` static build to `dist/`
