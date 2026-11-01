# Design: Pager Compression Engine

## Overview
Pure functions in `src/engine.js`, importable in browser and Node. `src/ai.js` wraps an OpenAI-compatible call.

## Components
- `triage(text) -> {score 0-100, priority}`: base 50, +25 per high keyword, +8 per medium, -20 per low, +10 for "!!". ≥70 high, ≥45 normal, else low.
- `detectCode(text)`: first dictionary entry whose keywords match.
- `ruleCompress(text, {sender})`: pick the most important sentence → strip filler (EN/ZH) and punctuation → uppercase Latin text → prefix `code` and sender (max 4 chars) → `clip` to 20.
- `splitMessages(dump)`: split chat dumps on blank lines or `name:` lines.
- `buildDigest(items, lang)`: one page "DIGEST:n LOW MSGS" / "日报:n条闲讯 已归档".
- `parseAI(content, text)`: extract JSON `{page, code, score}`; on error → `ruleCompress`.

## Data model
`Page = { page, code|null, priority: high|normal|low|digest, score, mode: ai|rules, day, time }`

## Error handling
AI timeout 15s; any error → fallback flagged `note: ai_failed_fallback`.

## Testing
`node --test`: length invariant over long EN/ZH/emoji input, triage, codes, determinism, AI parse fallback.
