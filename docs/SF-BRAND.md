| [← 06 — Current Dev State](06_CURRENT_DEVELOPMENT_STATE.md) | [📚 Index](README.md) | [Changelog →](CHANGELOG.md) |
|---|---|---|

---

# SF — SympoFlo Brand Governance
Version Timestamp: 03/07/2026 — Canon Rewrite Session
Authoritative brand governance document. All SF visual and identity decisions live here.
See PF-CANON.md for system architecture. When brand and architecture conflict, architecture governs.

---

## Product Naming

- **Full name:** SympoFlo
- **Capitalization locked:** Capital S and capital F only — `SympoFlo` — no exceptions
- **Runtime system:** PracticeFlow (PF)
- **Brand overlay:** SympoFlo (SF)
- **Prefix discipline:** PF = architecture/system, SF = brand/identity/visual

**Brand positioning:**
A Life-Role Operating System — structured support across every domain you operate in.

---

## App Icon (SF-LOGO-001) — Locked. No further redesign permitted.

**Specifications:**
- Deep midnight navy rounded square background
- White dominant flowing "S" ribbon mark
- Aqua/blue accent stroke following lower curve only
- Accent does NOT intrude into the center of the white S
- Slight dimensional depth preserved — not fully flat
- Clean, sharp silhouette
- Icon must remain recognizable at small sizes

Dark mode glow variant: SF-LOGO-001-DARK locked.

---

## Wordmark

Direction locked: **Option D — Slightly Bold and Grounded**
Wordmark refinement must align to locked icon — brand system built around icon, not vice versa.

---

## Brand Build Sequence (Locked)

- A → Icon ✅ Complete
- B → Wordmark (direction locked, refinement in progress)
- C → Full brand system (pending)

No looping once an element is locked. No further iteration on the locked icon.

---

## Theme System

### Dark Mode
- **Default experience** — dark mode loads by default
- Base: deep midnight navy-charcoal (not black)
- Aqua accent consistent

### Light Mode
- **Fully supported** — user toggle visible and simple
- Base: cool neutral off-white (not pure white)
- Aqua accent consistent
- No psychological behavior tied to theme selection
- Design must work equally well in both modes

### Accent
- Aqua consistent across both modes
- Aqua supports structure — does not dominate

---

## Color Philosophy

- Aqua/Teal — primary accent, supports structure, does not dominate
- **Red — rejected.** Conflicts with therapist calm philosophy. No red urgency styling.
- Color conveys meaning — never decoration

---

## Two UI Archetypes

### Hat Card Archetype (entry/navigation)
- Centered
- Square or near-square
- 60–70% Lovable scale
- Identifies workspace clearly without being oversized

### Operational Panel Archetype (data-driven content)
- Horizontal
- Compact — 50–60% height
- Scroll internally; page scroll minimized

Clear separation between archetypes is required. No mixing.

---

## Density & Layout Rules

- Compact density standard: 60–70% scale for cards
- Operational panels: 50–60% height
- Max 2 visual depth levels in layout
- Horizontal operational panels preferred
- No masonry or chaotic floating panel layouts
- No oversized marketing tiles inside app
- No landing-page feature tile aesthetic inside app
- No oversized accessibility-template panels
- Executive clarity over oversized accessibility scaling

---

## Visual Anti-Patterns (Locked — Never Use)

- No gradients
- No haze backgrounds
- No cotton-candy gradient backgrounds
- No full-card pastel tinting
- No decorative glow (glow = activation only)
- No persistent ambient glow
- No heavy stylization or excessive flourishes
- No Canva-style white base adoption
- No marketing-style hero dashboards
- No visual noise (dotted lines, decorative flourishes)
- No masonry or chaotic floating panel layouts
- No per-screen custom styling overrides

---

## Glow Rule

**Glow = activation signal only.**
Never decorative. Never ambient. Never persistent.
Activated states may use glow. Idle states must not.

---

## Alert Visual Rule

Alerts use border-emphasis — not full-bleed color blocks.
Early warning model — escalate gradually.
No punitive tone.
No panic-style visual urgency.

---

## Empty State Rule

**Empty ≠ Error.**
Empty states must never look like error states.
Modules remain visible when empty.

---

## Token Discipline

- All UI must reference centralized design tokens — no hardcoded hex values
- Update tokens at source — not screens individually
- Update shared components before screen-level edits
- No component forks permitted
- Token-first policy enforced
- Component-first policy enforced

---

## Implementation Discipline

- New screens must begin from defined layout templates
- Dark mode and light mode verification required for every screen
- Control Mode and Action Mode verification required for every screen
- No ad-hoc UI invention
- No per-screen styling overrides
- No patch-loop refactors
- Structured velocity: speed with validation

---

## Navigation Philosophy

- No deep menu trees
- Breadcrumbs only when navigation depth exceeds 2 levels
- Pagination preferred over infinite scroll for tables
- Filter-first before pagination when possible
- Tooltips limited to informational use — critical states use Alerts

---

## Interface Character

The interface must feel:
- Operational
- Structured
- High-signal
- Calm
- Assistant-like

It must NOT feel:
- Clinical or hospital-style
- Corporate and cold
- Playful or childish
- SaaS-bloated
- Marketing-forward

---

End of SF-BRAND.md

---

| [← 06 — Current Dev State](06_CURRENT_DEVELOPMENT_STATE.md) | [📚 Index](README.md) | [Changelog →](CHANGELOG.md) |
|---|---|---|
