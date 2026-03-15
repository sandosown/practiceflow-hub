| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|

---

# SF-BRAND.md — SympoFlo Brand & Language Doctrine

**Version:** 03/13/2026 — Light/Dark Mode + Navigation Visual System Update (previously 03/08/2026 — Phase 6 Pre-Build Update)
**Serial:** SF-BRAND-005
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

## Theme System — Light Mode + Dark Mode

**LOG-070 — LOCKED**

### Mode Rule
- **Light Mode is the default experience** for all users
- **Dark Mode is user-selectable** via Settings
- All domain accent colors are **mode-agnostic** — identical in both modes
- The `#2dd4bf` primary accent is unchanged in both modes
- Mode toggle lives in Settings only — never exposed in primary nav

### Light Mode Token System
| Token | Value | Usage |
|---|---|---|
| Page background | `#f1f4f8` | All screen backgrounds |
| Surface (cards) | `#ffffff` | All card interiors |
| Header / Nav bar | `#1a2a5e` | Top bar, bottom nav bar |
| Text Primary | `#1a2a5e` | Headings, card labels |
| Text Secondary | `#94a3b8` | Subtitles, metadata |
| Section labels | `#94a3b8` | UPPERCASE section headers |
| Accent / Primary | `#2dd4bf` | Active states, CTAs, highlights |

### Dark Mode Token System
| Token | Value | Usage |
|---|---|---|
| Page background | `#1e3a5f` | All screen backgrounds |
| Surface (cards) | `#1a3254` | All card interiors |
| Header / Nav bar | `#152d4e` | Top bar, bottom nav bar |
| Top bar | `#243f6a` | Secondary header surfaces |
| Text Primary | `#f1f5f9` | Headings, card labels |
| Text Secondary | `#7ea8c9` | Subtitles, metadata |
| Section labels | `#5a8ab0` | UPPERCASE section headers |
| Accent / Primary | `#2dd4bf` | Active states, CTAs, highlights |

---

## Visual Doctrine

### Legacy Dark Mode Primary Palette (current build — preserved)

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

### Card Border System — Updated (LOG-071)

**Asymmetric Accent Border (replaces 5-layer left-stripe-only doctrine)**

Every card uses an asymmetric accent border where the left edge is bold and the remaining edges are subtle — creating a directional depth effect.

```
border-left:   4px solid [domain accent]           — full opacity
border-top:    1px solid [domain accent at 25%]    — subtle
border-bottom: 1px solid [domain accent at 25%]    — subtle
border-right:  1px solid [domain accent at 15%]    — whisper
```

Rules:
- The left stripe is preserved and extended — this is an evolution, not a replacement
- Interior of card stays clean — color lives in the border only
- No colored card fills — ever
- Applies in both Light Mode and Dark Mode
- Accent color used is always the domain accent of the module the card belongs to

### Legacy 5-Layer Card System (Dark Mode — current build)
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

### Color Variety Rule (LOG-100)

Color blocks, chips, tags, filter elements, and appointment entries must always use varied colors from the domain accent map. Never default to one or two colors across a set of items.

Rules:

- Every distinct item type must have its own unique accent color

- No two adjacent or related items should share the same color where avoidable

- Teal (#2dd4bf) is the primary accent — it must not dominate chip sets or block groups

- Color variety is a visual doctrine requirement — monotone chip sets are explicitly rejected

- Applies to: calendar appointment chips, filter chips, status badges, tag chips, module cards, radar cards, and any grouped visual elements

---

## UI Color Variety System (LOG-101)

This is NOT a brand palette. SympoFlo's brand colors are locked in Brand Kit SF-001 (navy, aqua, white).

This is a UI vitality doctrine — a set of approved colors for UI elements like chips, status badges, appointment type indicators, filter tags, radar signals, and any grouped interface elements that need variety to feel modern and alive.

### Purpose

SympoFlo must never feel boring, stale, or generic. A narrow color set on UI elements creates a flat, monotone experience that contradicts the Calm Command Center philosophy. Calm does not mean colorless. Alive and structured can coexist.

### Approved UI Variety Colors

| Color Name | Hex |
|---|---|
| Teal (primary accent) | #2dd4bf |
| Indigo | #4f46e5 |
| Purple | #7c3aed |
| Violet | #a78bfa |
| Fuchsia | #d946ef |
| Magenta | #c026d3 |
| Sky Blue | #0ea5e9 |
| Cyan | #06b6d4 |
| Blue | #3b82f6 |
| Royal Blue | #1d4ed8 |
| Emerald | #059669 |
| Lime | #84cc16 |
| Green | #22c55e |
| Amber | #d97706 |
| Yellow | #eab308 |
| Orange | #f97316 |
| Burnt Orange | #ea580c |
| Brown/Tan | #92764a |
| Slate | #64748b |
| Steel | #475569 |
| Warm Gray | #78716c |
| Rose Gold | #fb7185 |
| Pink | #ec4899 |

### Permanently Banned UI Colors

- Red (any tone) — BANNED
- Rose / warm pink — BANNED
- Hot Pink (#f43f5e) — BANNED
- Pastel washes as card fills — BANNED

### Color Variety Rules

- Never place the same or visually similar colors adjacent in a chip set, status row, or grouped element
- Spread across the full spectrum — mix warm, cool, neutral, vivid
- Teal (#2dd4bf) is the primary accent — do not overuse in chip sets
- No two greens, no two blues, no two purples next to each other in a sequence
- When assigning colors to any new set (appointment types, status badges, filter chips, tags) — always pick maximally varied options from this list

### What This Is NOT

- This is not the SympoFlo brand palette
- This is not for logos, wordmarks, or marketing materials
- Brand identity lives in SF-BRAND Kit SF-001
- This palette is for UI element vitality only

---

## Bottom Navigation Bar — Visual Spec

**LOG-064 — LOCKED**

### Structure
5 items. Always visible. No scrolling. Labels always shown below icons.

| Position | Label |
|---|---|
| 1 | Home |
| 2 | Board |
| 3 | My Work |
| 4 | Calendar |
| 5 | More |

### Visual Rules
- Background: `#1a2a5e` (light mode) / `#152d4e` (dark mode)
- Active item icon + label: `#2dd4bf`
- Active item background tint: `rgba(45,212,191,0.12)` — subtle
- Inactive items: `rgba(255,255,255,0.55)`
- Notification badge: `#2dd4bf` pill, dark text `#0f172a`
- Icon size: 22×22px
- Label size: 8–9px
- Nav bar height: consistent with platform tap target standards
- Never icon-only — labels always present

### More Drawer Visual Rules
- Slides up from bottom — not a full-screen takeover
- Background: `#1a2a5e` (light) / `#152d4e` (dark) — matches nav bar
- Drawer handle: `32px × 3px`, `rgba(255,255,255,0.2)`, centered at top
- User profile + role label visible at top of drawer
- Items grouped in labeled sections
- Item background: `rgba(255,255,255,0.07)`
- Item label: `#e2eaf4`
- Section labels: `#5a8ab0`, `9px`, uppercase, tracked
- Role-filtered: absent items are completely invisible — never grayed, never locked
- Dismiss: tap outside or swipe down

---

## Domain Accent Map

### Group Practice Modules
| Module | Accent |
|---|---|
| Charts Requiring Action | #d97706 |
| Message Board (formerly Office Board) | #0ea5e9 |
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

### Bottom Navigation Bar (LOG-064)
- See Bottom Navigation Bar — Visual Spec section above
- Mode toggle (Light/Dark) lives in Settings — never in nav

---

## Naming Conventions — LOCKED

| Banned | Correct |
|---|---|
| Choose a workspace | Which role are you stepping into? |
| Your workspaces are ready | (removed — greeting only) |
| Comms | Office Board |
| Office Board | Message Board |
| Attention Required | Radar |
| PracticeFlow | SympoFlo |
| Group Practice Dashboard | Group Practice |
| [Any workspace] Dashboard | [Workspace name only] |
| Add Entry / Log Event / Record Milestone | Let's Capture This Moment |

---

## Navigation Rules — LOCKED

- Breadcrumbs show the current page name only. No parent workspace prefix ever. "Group Practice", "Coaching", "Home", and "Workspaces" never appear in any breadcrumb, header, page title, or any UI surface anywhere in the app.
- Back button on every sub-page
- No role badge in persistent nav
- No mode badge in persistent nav
- Logout: "Log out" label — not icon only
- Workspace context: inside workspace only — displays owner's company name, never default category label
- Opening dashboard: no Radar, no workspace bleed
- Surface names: workspace name only, no qualifier
- Avatar dropdown: Profile, Settings, Log out — always in that order
- Bottom nav: 5 items persistent on all workspace screens — exception: Owner opening dashboard
- More drawer: role-filtered, absent items invisible
- Mode toggle: Settings only — never in nav

---

End of SF-BRAND.md

---

| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|
