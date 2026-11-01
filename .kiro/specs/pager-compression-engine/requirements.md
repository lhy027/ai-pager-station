# Requirements: Pager Compression Engine

## Introduction
The engine turns arbitrary text into pager pages of at most 20 characters, rates importance, and maps sentiments to classic numeric pager codes.

## Requirements

### Requirement 1: Length limit
**User Story:** As a pager owner, I want every page to fit a 20-character LCD, so that I can read it at a glance.
#### Acceptance Criteria
1. WHEN the engine produces a page THEN the system SHALL ensure the page length is at most 20 Unicode code points.
2. IF the compressed text exceeds the limit THEN the system SHALL truncate it and end it with "…".
3. WHEN the input is empty THEN the system SHALL return an empty page with priority "low".

### Requirement 2: Importance triage
**User Story:** As a busy person, I want only important messages to buzz me, so that I am not interrupted constantly.
#### Acceptance Criteria
1. WHEN the input contains urgency keywords (e.g. "urgent", "ASAP", "紧急", "马上") THEN the system SHALL assign priority "high".
2. WHEN the input contains promotional keywords (e.g. "sale", "unsubscribe", "促销") THEN the system SHALL assign priority "low".
3. WHILE the daily quota of 5 important pages is used up, the system SHALL route new pages into the daily digest.
4. WHEN one or more messages are low priority THEN the system SHALL merge them into a single digest page per day.

### Requirement 3: Numeric codes
**User Story:** As a nostalgic user, I want classic codes like 520 and 9958, so that pages feel authentic.
#### Acceptance Criteria
1. WHEN the input expresses a sentiment in the code dictionary THEN the system SHALL prefix the page with that code.
2. The system SHALL provide a dictionary of at least 15 codes with Chinese and English meanings.

### Requirement 4: AI with deterministic fallback
**User Story:** As a judge without an API key, I want the app to fully work, so that I can evaluate it.
#### Acceptance Criteria
1. IF `AI_API_KEY` is not set THEN the system SHALL use the rule-based compressor.
2. IF the AI call fails or returns invalid JSON THEN the system SHALL fall back to the rule-based compressor.
3. WHEN given the same input THEN the rule-based compressor SHALL return identical output.
