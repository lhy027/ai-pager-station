# How Kiro was used (DRAFT — to be updated after Kiro iteration)

> Status: draft. This describes the project honestly as of the initial commit and will be rewritten once development continues inside the Kiro IDE.

**Initial scaffold.** The first version of the code (engine, retro UI, tests) was generated with an AI assistant outside of Kiro.

**Spec-driven plan (`.kiro/`).** The `.kiro` folder was authored as the project's spec-driven plan:
- **Specs** (`.kiro/specs/`): *pager-compression-engine* and *retro-pager-ui*, each with EARS-style `requirements.md`, a `design.md`, and a `tasks.md` implementation plan.
- **Steering** (`.kiro/steering/`): `product.md`, `tech.md`, `structure.md` — the 20-character invariant, zero runtime dependencies, shared engine for browser and server, and a no-API-key fallback.
- **Hooks** (`.kiro/hooks/`): update engine tests on engine edits, audit that every returned page respects the 20-char limit, and keep EN/中文 strings in sync.

**Next steps.** Further development will continue in the Kiro IDE using these specs, steering files and hooks (e.g. wiring up a real AI provider and improving English compression). This section will be updated with what actually happened during that iteration.
