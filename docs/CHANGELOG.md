| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|

---

# SympoFlo Changelog

---

## 03/08/2026 — Phase 5 Session

### Phase 5 — Visual Overhaul & Language Doctrine

#### LOG-009 — Opening dashboard workspace cards redesigned
Stacked rectangular rows replaced with horizontal rounded square cards (240×210px, border-radius 24px).

#### LOG-010 — Landing screen ambient energy system
Deep space background (#060e1e), 90 twinkling stars, 5 nebula glow pools, flow connector lines with pulsing nodes between cards, ambient radial glow. Landing screen must feel alive.

#### LOG-011 — Landing screen language overhaul
"Choose a workspace" removed. Replaced with: "Which role are you stepping into?" (uppercase, muted, 13px). Supporting line: "Choose the role you want to step into."

#### LOG-012 — "Your workspaces are ready." removed
Replaced with serif greeting: "Good [morning/afternoon/evening], Dr. Sarah." with shimmer gradient animation.

#### LOG-013 — "Workspaces" terminology under review
Too corporate for the app philosophy. Pending resolution when earlier chat notes are located.

#### LOG-014 — Deep page color consistency enforced
Every page at every depth maintains domain accent color system. No page reverts to flat navy. GPModulePlaceholder uses module-specific accent. Role shells maintain teal card system.

#### LOG-015 — SympoFlo logo brand kit confirmed (DEFERRED)
Real logo confirmed: Serial SF-001, locked design. Navy rounded square, flowing S with white upper sweep and teal/aqua lower sweep. White version for dark backgrounds. SVG recreation deferred — hand-drawn paths cannot accurately reproduce the mark. Revisit when proper PNG export or original SVG file is available.

#### LOG-016 — Language Doctrine LOCKED
Full language system locked. See SF-BRAND.md and 01_CORE_SYSTEM_PHILOSOPHY.md.
- Single-Sentence Rule: every UI text does one job in one sentence
- Three pattern types: Orientation / Operational / Resolution
- Trust sequence: Role → Radar → Action
- Banned: life coach tone, gamified language, motivational copy
- Required tone: mission control / operations dashboard / executive decision surface

#### LOG-017 — Logo SVG deferred
Current placeholder stays. Real brand mark cannot be recreated from hand-drawn SVG paths. Return when original vector file or clean PNG export is available.

#### LOG-018 — "Group Practice Dashboard" renamed to "Group Practice" — LOCKED
No second word on any workspace surface name. The workspace name IS the surface name.
- "Group Practice Dashboard" → "Group Practice"
- Pattern applies to all future workspaces: "Coaching", "Home" — no qualifier
- All breadcrumbs, headers, back buttons updated
- Route paths unchanged

---

## 03/08/2026 — Phases 1–4 Session

### Phase 1 — Boot Engine
- Session context, 7 demo users, routing, login page, Supabase RLS
- Demo users: Dr. Sarah Mitchell (OWNER), Marcus Chen (ADMIN), Dr. Angela Torres (SUPERVISOR), James Rivera LCSW (CLINICIAN/LICENSED), Priya Patel (INTERN/CLINICAL), Alex Nguyen (INTERN/BUSINESS), Taylor Brooks (STAFF)

### Phase 2 — Dark Navy Dashboard
- Dark navy theme (#0f1a2e background, #1a2a4a cards)
- Owner Dashboard with Radar + workspace cards
- Group Practice with 9 module cards
- Office Board with 3 working tabs

### Phase 3 — Structural Fixes
- Opening dashboard cleaned: no Radar, no workspace context, warm greeting
- Nav bar: removed role badge, removed mode badge, added "Log out" label
- Radar moved into Group Practice (renamed from "Attention Required")
- Login page: solid dark background, all 7 demo users listed
- Workspace cards: accent left borders applied

### Phase 4 — Visual Overhaul
- Background deepened to #0a1628
- 5-layer card system applied everywhere
- Domain accent colors on all module cards
- Glow system: resting/hover/active states
- Radar cards each have signal-specific accent color
- Greeting fixed: "Good morning, Dr. Sarah." (no double period)
- Placeholder pages: "Coming in Phase 5"

---

## 03/07/2026 — Full Canon Rewrite
- 11 files, 1867 insertions
- Navigation bars added to all split files
- SF-BRAND.md created and locked

---

End of CHANGELOG.md

---

| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|
