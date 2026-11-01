# Requirements: Retro Pager UI

## Introduction
A browser UI that looks and feels like a 1990s pager plus a pager-station hotline call screen.

## Requirements

### Requirement 1: Pager device
**User Story:** As a user, I want a realistic pager, so that the revival feels authentic.
#### Acceptance Criteria
1. The system SHALL render a green LCD with a pixel font, clock and message counter.
2. WHEN a page longer than the LCD width is displayed THEN the system SHALL scroll it horizontally.
3. WHEN a new page arrives THEN the system SHALL play a beep via WebAudio AND play a vibrate animation.
4. WHEN the user presses ◀ / ▶ THEN the system SHALL show the previous / next page.

### Requirement 2: Operator call screen
**User Story:** As a sender, I want to "call the pager station", so that I can send a page like in the 90s.
#### Acceptance Criteria
1. The system SHALL greet the user with "请问您要呼几号？" (ZH) or its English equivalent.
2. WHEN the user submits text THEN the system SHALL call `/api/page` and, IF the API is unreachable, compress in the browser.
3. WHERE "group chat dump" is checked, the system SHALL split the text into messages and triage each.

### Requirement 3: Bilingual and persistent
#### Acceptance Criteria
1. WHEN the user toggles language THEN the system SHALL switch all UI strings between EN and 中文.
2. The system SHALL persist pages and language in localStorage.
3. The system SHALL show the numeric code dictionary.
