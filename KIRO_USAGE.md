# How Kiro was used (Devpost write-up draft)

**Spec-driven development.** I started in Kiro by describing the idea — "revive the 1990s pager station with an AI operator". Kiro turned it into two specs under `.kiro/specs/`: *pager-compression-engine* and *retro-pager-ui*. Each has `requirements.md` in EARS format (e.g. "WHEN the engine produces a page THEN the system SHALL ensure the page length is at most 20 code points"), a `design.md` with components and data model, and a `tasks.md` implementation plan that Kiro executed task by task, linking each task to requirement IDs.

**Steering.** `product.md`, `tech.md` and `structure.md` encode the non-negotiables: the 20-character invariant, zero runtime dependencies, an engine shared between browser and server, and that the app must work with no API key so judges can run it. This kept every generated change consistent.

**Agent hooks.** Three hooks in `.kiro/hooks/`:
1. *Update engine tests* — on edits to `src/engine.js`/`codes.js`/`ai.js`, Kiro updates `test/engine.test.js` and runs `npm test`.
2. *Check 20-char pager limit* — on edits to `src/` or `api/`, Kiro audits every path returning a `page` to ensure it goes through `clip()`. This caught emoji/CJK length bugs (counting UTF-16 units vs. code points).
3. *Sync i18n strings* — on UI edits, Kiro keeps the EN and 中文 string tables aligned.

**Vibe coding.** The LCD look, marquee scroll, WebAudio beep and vibrate animation were iterated conversationally ("make it feel like a 1996 Motorola"), as was the bilingual operator copy ("请问您要呼几号？").

**What worked best.** Specs gave a clear contract for the engine; hooks turned the core invariant into something continuously enforced instead of remembered.
