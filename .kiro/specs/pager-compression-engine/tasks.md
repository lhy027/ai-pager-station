# Implementation Plan: Pager Compression Engine

- [x] 1. Create code dictionary `src/codes.js`
  - Chinese numeric codes + English pager codes (143, 911, 07734)
  - _Requirements: 3.2_
- [x] 2. Implement `clip` / `pagerLength` with code-point counting
  - _Requirements: 1.1, 1.2_
- [x] 3. Implement `triage` keyword scoring
  - _Requirements: 2.1, 2.2_
- [x] 4. Implement `ruleCompress` with filler removal and code prefix
  - _Requirements: 1.1, 3.1, 4.3_
- [x] 5. Implement `splitMessages` and `buildDigest`
  - _Requirements: 2.3, 2.4_
- [x] 6. Implement AI wrapper `src/ai.js` and `parseAI` fallback
  - _Requirements: 4.1, 4.2_
- [x] 7. Write unit tests in `test/engine.test.js`
  - _Requirements: 1.1, 2.1, 2.2, 3.1, 4.1, 4.2, 4.3_
