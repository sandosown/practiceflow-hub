| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|

---

# SF-BRAND.md — SympoFlo Brand & Language Doctrine

**Version:** 03/08/2026 — Phase 6 Pre-Build Update
**Serial:** SF-BRAND-004
**Status:** LOCKED

---

## Emotional Target

> "SympoFlo turns complex responsibility into calm command."

> "SympoFlo should feel like walking into a command center that's ON — not one that's powered down."

The user should feel: **"I'm stepping into command."**
Not: "I'm checking another productivity app."

---

## Psychological Doctrine — Calm Command Alive

The calm lives in hierarchy and clarity — not in muting everything.
Aliveness is part of the promise — relief from sterile legacy tools.

### The 10-Second Trust Moment
Within the first seconds, the user asks:
1. "Does this system understand what I actually do?"
2. "Do I know where to start?"
3. "Is this calm or chaotic?"

If answered correctly, the user feels: **"This system understands my work. I can rely on this."**

---

## Language Doctrine — LOCKED

### The Single-Sentence Rule
Every piece of UI text does one job in one sentence.
No paragraphs. No stacked explanations. No motivational filler.

### Three Pattern Types

**1. Orientation** — helps user choose context
- "Which role are you stepping into?"
- "Where would you like to focus?"

**2. Operational** — describes real work
- "Review open referrals."
- "Check therapist capacity."
- "Approve onboarding."

**3. Resolution** — directs action on a signal
- "Resolve scheduling conflict."
- "Credential renewal approaching."

### Supporting Micro-Text Rule
One short supporting line permitted if needed.
Primary text must still be a single sentence.

### What Is BANNED From Language
- Life coach tone: "Stay on top of things" / "Keep crushing it"
- Gamified language: "Hit your goals!" / "Let's get productive!"
- Motivational copy of any kind
- Vague non-operational phrases
- Multi-sentence explanations in UI

### Major Moments — Language Exception
Major Moments is the only module where reflective, human language is permitted.
This is intentional and canon-approved.

Permitted in Major Moments context:
- "Look at how far you've come."
- "This moment mattered."
- "Take a moment to remember it."
- "Let's Capture This Moment" (primary CTA — locked copy)
- "What happened on this day?" (core prompt — locked copy)
- "Your milestones and achievements." (subtitle — locked copy)

This language exception does NOT extend to any other module or surface.

### The Trust Sequence
**Role → Radar → Action**

### Required Tone
Mission control. Operations dashboard. Executive decision surface.

---

## Logo — Brand Kit SF-001 (LOCKED)

**Status:** SVG recreation deferred (LOG-017). Placeholder in use.

### Official Colors
- Navy: #1B2D5B
- Aqua: #30B8C9
- White: #FFFFFF

### Official Versions
- Full Color — light backgrounds
- White Version — dark backgrounds (preferred in-app nav)
- Outlined/Glowing — login hero

### Wordmark
Font: Georgia, serif. Not bold. Not sans-serif.

---

## Visual Doctrine

### Primary Palette

| Token | Value |
|---|---|
| Background (opening) | #060e1e |
| Background (app) | #0a1628 |
| Surface | #1a2a4a |
| Border subtle | #1e3a5f |
| Accent/Primary | #2dd4bf |
| Text Primary | #f1f5f9 |
| Text Secondary | #94a3b8 |
| Text Muted | #64748b |

### 5-Layer Card System
1. Base surface: #1a2a4a
2. Depth gradient: base → accent at 8–12% opacity
3. Border: 1px accent at 40–50% opacity
4. Left stripe: 4px solid accent at full opacity
5. Glow: box-shadow in accent at low opacity

### Glow Intensity Scale
- Resting: border 40%, faint ambient glow
- Hover: border 70%, glow spreads
- Active: border 100%, glow fully expressed

### Landing Screen Energy System
- Background: #060e1e
- 90 twinkling stars (CSS keyframe, randomized, useMemo)
- 5 nebula glow pools (teal, blue, amber, green, center)
- Flow connectors with animated pulse nodes between cards
- Greeting: Georgia serif, shimmer gradient animation
- Cards: 240×210px, border-radius 24px, float animation

### Hard Color Prohibitions — ABSOLUTE
- Red (any tone) — BANNED
- Rose / warm pink — BANNED
- Pastel washes (full card fills) — BANNED
- Flat uniform navy on all cards — BANNED
- Decorative glow with no function — BANNED

---

## Domain Accent Map

### Group Practice Modules
| Module | Accent |
|---|---|
| Charts Requiring Action | #d97706 |
| Office Board | #0ea5e9 |
| Management Center | #7c3aed |
| Client Database | #0d9488 |
| Caseload Integration | #3b82f6 |
| Treatment Plan Tracker | #059669 |
| Supervision Structure | #4f46e5 |
| Insurance Database | #78716c |
| Vendor Database | #92764a |
| Major Moments | #a78bfa |

### Workspace Accents
| Workspace | Accent |
|---|---|
| Group Practice | #2dd4bf |
| Coaching | #f59e0b |
| Home | #4ade80 |

### Radar Signal Accents
| Signal | Accent |
|---|---|
| License/Credential | #d97706 |
| Verification overdue | #ea580c |
| Unassigned referral | #0ea5e9 |
| Discharge deadline | #7c3aed |
| Onboarding stuck | #3b82f6 |
| Missing credentials | #78716c |

---

## Major Moments — Visual Treatment

Major Moments is the only module with a unique visual treatment distinct from operational modules.

**Design intent:** Opening a personal memory scrapbook — quiet, warm, reflective.
**Constraint:** Must remain within dark navy doctrine. No light backgrounds. No paper textures that break visual system.

**Scrapbook aesthetic achieved through:**
- Softer card borders (less hard-edged than operational cards)
- Subtle layered shadow treatment on moment cards
- Slightly warmer surface tone on moment cards (surface tinted toward violet, not blue)
- Georgia serif font for moment titles and dates
- Soft violet (#a78bfa) as the primary accent throughout
- Moment cards use rounded rectangular shape — distinct from operational square cards
- "On This Day" cards: centered, 3 cards maximum displayed, breathing room between them

**What is NOT permitted in Major Moments:**
- Light or paper backgrounds
- Beige, cream, or warm neutral fills
- Texture overlays that contradict the dark navy system
- Celebratory iconography (confetti, badges, stars-as-achievements)
- Any tone that feels like a productivity tracker

**Reflection Banner (Owner only):**
- Appears at top of engine dashboard
- Calm presentation — soft violet left border, muted background
- One line of reflective text + "See more in your Major Moments →" link
- Dismiss button — disappears for session on dismiss
- Never persistent across sessions

---

## Navigation Visual Rules — LOCKED

### Top Navigation Bar
- Logo left, workspace context center, user/avatar right
- Workspace context: inside workspace only
- No role badge, no mode badge
- "Log out" text label — never icon only

### Avatar Dropdown (Top-Right) — LOCKED
- Triggered by user name / avatar click
- Dropdown items: Profile, Settings, Log out
- Clean dark surface dropdown — matches app surface color (#1a2a4a)
- Subtle border, no heavy shadow
- No persistent sidebar — sidebar navigation is explicitly rejected

### Settings Page Visual
- Full page — not modal, not slide-over
- Consistent with app surface and card system
- Section headers use 4px left border in primary accent
- Role-scoped content — no visible sections that don't apply to current role

---

## Naming Conventions — LOCKED

| Banned | Correct |
|---|---|
| Choose a workspace | Which role are you stepping into? |
| Your workspaces are ready | (removed — greeting only) |
| Comms | Office Board |
| Attention Required | Radar |
| PracticeFlow | SympoFlo |
| Group Practice Dashboard | Group Practice |
| [Any workspace] Dashboard | [Workspace name only] |
| Add Entry / Log Event / Record Milestone | Let's Capture This Moment |

---

## Navigation Rules — LOCKED

- Breadcrumb on every sub-page
- Back button on every sub-page
- No role badge in persistent nav
- No mode badge in persistent nav
- Logout: "Log out" label — not icon only
- Workspace context: inside workspace only
- Opening dashboard: no Radar, no workspace bleed
- Surface names: workspace name only, no qualifier
- Avatar dropdown: Profile, Settings, Log out — always in that order

---

End of SF-BRAND.md

---

| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|
