---
last_updated: 2026-10-25T07:20:04Z
---

# Architecture Design

## System Overview
Static single-page hub "Repro Suite" that links to five external apps (new tab). No backend, no keys.

## Tech Stack
Vite + React + TypeScript + Tailwind (shadcn template). Fonts: Source Serif 4, IBM Plex Sans (Google Fonts).

## Module Design
| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| Content | EN/ZH copy + tool data | src/lib/content.ts |
| Page | Header toggles, hero + ledger, tool cards, footer | src/pages/Index.tsx |
| Theme | Light/dark CSS tokens | src/index.css |

## Tech Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| i18n | Local state + COPY dictionary, persisted to localStorage | Two languages, static content |
| Theme | `.dark` class on html, persisted | Matches tailwind darkMode: class |
| Demo button | Opens Paper Repro Agent in new tab | No separate demo URL supplied |

## File Tree Plan
app/frontend/src/{lib/content.ts, pages/Index.tsx, index.css}, app/frontend/DESIGN.md

## Implementation Guide
Edit tools/copy only in content.ts; keep layout free of horizontal overflow at 390px.
v3 (refocus): Inter/Noto Sans SC/JetBrains Mono, palette tokens (--bg/--card/--soft/--text/--text2/--line/--accent/--tint) in index.css matching paperrepro /repro design; theme key "repro.theme2" (light default).
Layout: 248px sticky sidebar (drawer + top bar <900px), hero, two main product cards (Explainer video from Supabase explainer-render?recent=1 feed videos.en + "#t=2", count = list length; Repro Agent screenshot + facts), flow diagram, 4 supporting tool cards, footer. All in src/pages/Index.tsx.
Screenshots: public/shots/*.webp captured by scripts/capture_shots.py (Python Playwright + Pillow, 1440x900, retry then placeholder).

