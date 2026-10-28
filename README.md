# The Nightingale Pledge — Pronunciation & Rhythm Studio
### 赤十字看護学校 発音・リズム練習スタジオ

An interactive, responsive audio practice web application designed for nursing school students to practice the rhythm, pronunciation, and cadence of **The Nightingale Pledge** using a native speaker reference recording.

Built for **iPads, tablets, smartphones, and desktop computers**.

---

## Key Features

- **Audacity-Style Waveform & Minimap**: Dual-tone (Peak + RMS) visual display with real-time playhead, overview track, and high-DPI canvas rendering.
- **Stop & Ready Practice Mode (Default)**: Highlight any clause, phrase, or word. When played, playback stops at the end of the selection and resets the playhead to the beginning of the selection—ready to replay on command.
- **Shadow Pause Mode**: Plays the highlighted section and automatically pauses for the same duration with a visual countdown so students can practice speaking out loud.
- **Continuous Loop Mode**: Traditional repeat loop for focused listening.
- **Pitch-Preserving Speed Adjustment**: Slow down (`0.50×`–`0.85×`) or speed up (`1.0×`–`1.40×`) with natural voice pitch preserved across all browsers (including iOS Safari).
- **Interactive Synchronized Script**: Tap any of the 4 sentence parts or 13 individual clauses to automatically highlight and play them.
- **Bilingual Interface**: Seamlessly switch between Japanese (`日本語`, default) and English (`English`) while keeping the English pledge text and pronunciation guides in English.
- **Touch-Friendly Controls**: Large handles (`IN ◄` / `► OUT`), nudge buttons (`-0.1s` / `+0.1s`), zoom controls, and custom student bookmarking saved to `localStorage`.
- **Voice Mirror**: Built-in audio recorder enabling students to record and compare their own reciting against the teacher's voice.

---

## Architecture

This project is built following **Clean / Hexagonal Architecture** principles:

- **Domain Layer (`src/Domain/`)**:
  - `PledgeSegment`: Entity representing timed clauses, sentences, and pronunciation cues.
  - `AudioMetadata`: Entity encapsulating audio track specifications and waveform envelope data.
  - `PledgeRepositoryInterface`: Repository port for retrieving metadata and phrase segments.
- **Application Layer (`src/Application/`)**:
  - `GetPracticeStudioSessionUseCase`: Orchestrates data required for the practice studio session.
- **Infrastructure Layer (`src/Infrastructure/`)**:
  - `ServiceContainer`: Dependency injection container enforcing `declare(strict_types=1);` without static god classes.
  - `LocalPledgeRepository`: Persistence adapter reading waveform peaks and audio metadata.
  - `HtmlSanitizer`: Context-aware sanitizer preventing XSS across HTML elements, attributes, and JSON blocks.
- **Presentation Layer**:
  - `index.php`: Main entrypoint.
  - `assets/css/studio.css`: Responsive, accessible stylesheet.
  - `assets/js/studio.js`: Pure JavaScript audio/canvas waveform engine.

---

## Local Setup

### Requirements
- PHP 8.1+
- Apache (e.g., XAMPP)

### Installation
1. Clone or place this repository inside your web root (e.g., `htdocs/nightingalepledge`).
2. Open your browser and navigate to:
   ```
   http://localhost/nightingalepledge/
   ```
