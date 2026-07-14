---
name: StevenNaviaux.com
description: A systems engineer's living field manual, built from evidence and operating practice.
colors:
  blueprint-ink: "#12141a"
  console-slate: "#58616f"
  runbook-paper: "#f6f4ef"
  clean-sheet: "#ffffff"
  drafting-line: "#d9d3c8"
  hardware-edge: "#b9afa1"
  signal-forest: "#285b48"
  rack-charcoal: "#18201f"
  warm-band: "#efece4"
  terminal-signal: "#8fd4b4"
  live-green: "#2f9e6e"
  incident-red: "#c0392b"
  terminal-ink: "#cfe8db"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.8vw, 4.625rem)"
    fontWeight: 880
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3.8vw, 2.875rem)"
    fontWeight: 870
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  hairline: "2px"
  skip-link: "6px"
  compact: "7px"
  control: "8px"
  badge: "9px"
  surface: "10px"
  feature: "12px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "26px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.rack-charcoal}"
    textColor: "{colors.clean-sheet}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.blueprint-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    height: "44px"
  card:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.blueprint-ink}"
    rounded: "{rounded.surface}"
    padding: "26px"
  input:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.blueprint-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.compact}"
    padding: "10px 12px"
---

# Design System: StevenNaviaux.com

## 1. Overview

**Creative North Star: "The Systems Field Manual"**

The site should feel like a well-used operating manual laid open beside a live system. Warm paper, precise rules, restrained forest signals, and small monospaced annotations create technical character without turning the portfolio into terminal cosplay. Large, plainspoken type carries the argument; outcomes, diagrams, screenshots, and failure language provide the proof.

The system is substantial but never theatrical. It rejects glossy SaaS marketing, generic AI hype, resume-wall layouts, and decorative developer tropes. A visitor should sense that every visual device exists because it helps explain, operate, or trust the work.

**Key Characteristics:**

- Warm, paper-like surfaces with dark working ink.
- One restrained forest signal for state, evidence, and emphasis.
- Strong typographic hierarchy with compact monospaced annotations.
- Flat-by-default surfaces that lift only when interactive.
- Touch-safe, progressively enhanced interactions with durable fallbacks.

## 2. Colors

The palette resembles paper, drafting ink, hardware labels, and a single live status signal.

### Primary

- **Signal Forest** (`#285b48`): Active state, evidence labels, links, focus, and the few words that carry the central promise.
- **Rack Charcoal** (`#18201f`): Primary controls, brand marks, and high-confidence surfaces.

### Neutral

- **Blueprint Ink** (`#12141a`): Main text and the strongest rule.
- **Console Slate** (`#58616f`): Supporting copy and quiet metadata.
- **Runbook Paper** (`#f6f4ef`): The continuous page surface.
- **Clean Sheet** (`#ffffff`): Cards, inputs, and contained evidence.
- **Drafting Line** (`#d9d3c8`): Default borders and section divisions.
- **Hardware Edge** (`#b9afa1`): Controls, chips, and stronger boundaries.

### Operational States

- **Warm Band** (`#efece4`): A warmer section band and terminal foreground.
- **Terminal Signal** (`#8fd4b4`): Legible live-state text on Rack Charcoal.
- **Live Green** (`#2f9e6e`): Small live-status dots only.
- **Incident Red** (`#c0392b`): Failure-drill and incident states only.
- **Terminal Ink** (`#cfe8db`): Supporting terminal copy on Rack Charcoal.

**The Signal Rule.** Signal Forest identifies meaning or state. It is never decorative fill spread across a section.

**The Warm Neutral Rule.** Pure black and cold gray page backgrounds are prohibited. Every neutral belongs to the field-manual atmosphere.

## 3. Typography

**Display Font:** Inter with system sans fallbacks

**Body Font:** Inter with system sans fallbacks

**Label/Mono Font:** JetBrains Mono with system monospace fallbacks

**Character:** Inter keeps long technical copy legible and direct. JetBrains Mono is reserved for status, evidence, navigation metadata, and operating labels where its meaning is earned.

### Hierarchy

- **Display** (880, `clamp(2.5rem, 5.8vw, 4.625rem)`, 1.04): One dominant argument per page opening.
- **Headline** (870, `clamp(1.875rem, 3.8vw, 2.875rem)`, 1.08): Major section propositions.
- **Title** (800, `1.3125rem`, 1.2): Build, card, and component titles.
- **Body** (400, `1rem`, 1.55): Explanatory prose, normally capped near 70 characters per line.
- **Label** (600, `0.75rem`, `0.14em` tracking): Short uppercase eyebrows, state names, and evidence categories only.

The implemented pages retain a compact operational type ladder between 11px and 21px for status rows, navigation, controls, metadata, leads, and card titles. Those closely spaced utility sizes support dense technical scanning; display and section headlines provide the contrast that establishes page hierarchy.

**The Mono Earns Its Place Rule.** Monospace must communicate status, structure, evidence, or machine context. It is forbidden as a costume for ordinary prose.

## 4. Elevation

The system is flat by default. Borders and warm tonal shifts establish most structure. A broad ambient shadow (`0 18px 45px rgba(18, 20, 26, 0.09)`) appears only on featured system surfaces and as a response to hover.

### Shadow Vocabulary

- **Ambient lift** (`0 18px 45px rgba(18, 20, 26, 0.09)`): Status boards, screenshots, open mobile navigation, and interactive hover state.
- **Selected build ring** (`0 0 0 1px #285b48`): Reinforces the selected chooser item without relying on color alone.

**The Flat-By-Default Rule.** If every card is floating, none of them carries meaning. Resting content uses borders; elevation indicates feature or interaction.

## 5. Components

### Buttons

- **Shape:** Compact working controls with an 8px radius and at least 44px height.
- **Primary:** Rack Charcoal with Clean Sheet text, used for the next meaningful step toward evidence or conversation.
- **Hover / Focus:** A 2px upward shift and ambient lift on hover; a 3px Signal Forest outline with 3px offset for keyboard focus.
- **Secondary:** Clean Sheet with Blueprint Ink text and a Hardware Edge border.

### Chips

- **Style:** Transparent or Clean Sheet surfaces, Hardware Edge border, pill radius, and monospaced 12px labels.
- **State:** Chips classify evidence. They are not decorative badges and do not compete with the primary action.

### Cards / Containers

- **Corner Style:** Gently curved working surfaces with a 10px radius.
- **Background:** Clean Sheet over Runbook Paper or its warmer band variant.
- **Shadow Strategy:** Flat at rest, ambient lift on interactive hover only.
- **Border:** One-pixel Drafting Line.
- **Internal Padding:** 22 to 26px, tightened only on narrow screens.

### Inputs / Fields

- **Style:** Clean Sheet, Hardware Edge stroke, 7px radius, and 10px by 12px padding.
- **Focus:** The global Signal Forest focus ring remains visible and is never replaced by color alone.
- **Error / Disabled:** Specific text appears in the adjacent live status region; buttons visibly disable while sending.

### Navigation

Desktop navigation is quiet text with a Signal Forest underline for hover, focus, and current location. Mobile navigation collapses into one 44px control in a 64px-or-shorter header, then opens an inline full-width list with 44px rows. It is never a modal and always retains a plain-link fallback.

### Status Board

The status board combines short monospaced state rows, dashed rules, a restrained live dot, and one failure-drill control. It may show personality, but it must never block initial content or imply live telemetry that is not real.

## 6. Do's and Don'ts

### Do:

- **Do** pair important claims with outcomes, public writing, sanitized artifacts, or a request-walkthrough action.
- **Do** keep Signal Forest rare and semantic.
- **Do** preserve 44px touch targets, visible keyboard focus, reduced-motion behavior, and useful no-JavaScript fallbacks.
- **Do** let large type make one clear argument while smaller evidence answers why it should be trusted.
- **Do** use the exact shared tokens before introducing a new color, radius, or shadow.

### Don't:

- **Don't** use glossy SaaS marketing that substitutes polish for evidence.
- **Don't** use generic AI hype, glowing gradients, glassmorphism, or vague transformation claims.
- **Don't** build resume-wall layouts that force visitors to decode chronology before understanding the work.
- **Don't** use terminal cosplay or developer aesthetics as decoration.
- **Don't** present hollow dashboard metrics or vanity counters that cannot explain what changed.
- **Don't** expose hostnames, network paths, secrets, or private dashboards to manufacture credibility.
- **Don't** add side-stripe accents, gradient text, nested cards, or modal-first interactions.
