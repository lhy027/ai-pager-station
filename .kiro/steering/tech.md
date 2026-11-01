---
inclusion: always
---
# Tech
- Node >= 18, ES modules, **zero runtime dependencies**. Plain HTML/CSS/JS frontend; `node:http` server locally; `/api/page.js` as a Vercel serverless function.
- `src/engine.js` is shared by browser and server — no Node-only APIs in it.
- AI: OpenAI-compatible `/chat/completions` via `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`. Any failure falls back to `ruleCompress`.
- Tests: `node --test`. Every page must satisfy `pagerLength(page) <= 20` (counted in code points).
- Persistence: browser `localStorage` only.
