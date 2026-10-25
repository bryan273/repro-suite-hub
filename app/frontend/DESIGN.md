# Repro Suite — Design

## Direction & Layout
- Purpose: one hub for five research-reproducibility apps. The mood is calm, academic, and trustworthy, like a well-edited journal. It should not look like a flashy AI startup.
- First visual signal: a large serif question, "Does the research claim really hold?", set left-aligned in an asymmetric 7/5 hero. The right column holds a "claim ledger" panel that lists the five tools as numbered rows. This is the defining idea: a claim being checked line by line.
- Reference: the typographic restraint of journal landing pages (for example, Nature's article headers).
- Max width 1120px. Page padding is 20px on mobile, 32px on tablet, and 40px on desktop. Sections are separated by 96px on desktop and 64px on mobile. Card gap is 20px.
- Breakpoints: below 640px everything is one column, the hero buttons stack full width, and the header keeps only the logo and two compact toggles. From 640px the cards use 2 columns. From 1024px the hero uses a 7/5 split and the cards use 3 columns (the last row is left-aligned).
- Do: serif headlines, thin 1px rules, numbered tool indexes (01–05), and a blue accent used only sparingly.
- Don't: emoji, gradients, glow, glassmorphism, colored left borders, purple, or anything wider than the viewport (no horizontal scroll at 390px; long URLs must wrap).

## Tokens
- Light: bg #F7F8FA, surface #FFFFFF, surface-2 #EEF2F7, border #DCE2EA, text #14202E, text-2 #4A5868, text-3 #6B7787, primary #1F4E8C, primary-hover #183E70, on-primary #FFFFFF, accent-soft #E3ECF7.
- Dark: bg #0E141B, surface #151D27, surface-2 #1B2531, border #2A3644, text #E7ECF2, text-2 #A9B5C3, text-3 #8794A4, primary #7DA7DD, primary-hover #9BBCE6, on-primary #0E141B, accent-soft #1A2A3F.
- Fonts: "Source Serif 4" (headlines; 600 weight, tight line height 1.08, letter spacing -0.01em) and "IBM Plex Sans" (body 16/1.6, weight 400/500). Chinese falls back to "Noto Serif SC" / "Noto Sans SC".
- Type scale: H1 clamp(2.25rem, 6vw, 4rem); H2 2rem; card title 1.25rem serif; button 15px/500; caption 13px uppercase tracking 0.08em.
- Spacing uses a 4px base (8, 12, 16, 20, 24, 32, 48, 64, 96). Radii: buttons 8px, cards 12px, toggles 8px.
- Elevation: 1px borders by default. Cards get a hover shadow of 0 8px 24px -12px rgba(20,32,46,.18). The sticky header uses the bg color at 90% opacity with a bottom border.

## Shared Patterns & States
- Button: primary (filled primary color, on-primary text) and secondary (transparent, border, text color). Height 44px, padding 0 20px. Hover darkens the primary or tints the background with surface-2. Focus ring is 2px primary with a 2px offset.
- Tool card: surface background, border, 24px padding, radius 12px. Each card shows its index, name, one-line description, an "For" audience line, and an Open button with an external-link icon (target _blank, rel noopener). On hover the border becomes primary and the card lifts 2px over 180ms ease-out.
- Toggles: segmented EN/中文 control plus an icon button for the theme, both 40px tall with aria-labels.
- Motion is limited to subtle hover transitions. Content is never hidden on first render.
- Accessibility: tap targets of at least 40px, AA contrast in both themes, and a visible focus ring.

## Media
- No photography. The hero ledger panel is typographic and the tools are explained through text, so imagery is unnecessary. No SVG illustrations or gradient substitutes.
