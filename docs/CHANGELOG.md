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

## 03/13/2026 — Navigation System, Light/Dark Mode, Calendar & Appointments Session

### LOG-064 — Global Navigation System (Bottom Nav) — LOCKED
Persistent bottom navigation bar added to all GP workspace screens for all roles.
Exception: Owner opening dashboard (hat selector) — no bottom nav.
5 items: Home, Board, My Work, Calendar, More.
Content inside each item is role-scoped. Nav bar itself is identical for all roles.

### LOG-065 — Message Board (replaces Office Board) — LOCKED
Office Board renamed to Message Board everywhere — nav, module name, breadcrumbs, code.
Accent color unchanged: #0ea5e9.
All roles can read AND post. Owner + Admin can pin and manage.

### LOG-066 — Recognition System — LOCKED
Owner, Admin, Supervisor can give recognition.
All roles can receive recognition.
No peer-to-peer in V1.
Lives in More drawer — visible to all roles.

### LOG-067 — Direct Messages — LOCKED
GP-scoped internal direct messaging utility.
Lives in More drawer — visible to all roles.
Separate from Message Board (practice-wide broadcast).
Cross-hat messaging not permitted.

### LOG-068 — Feed — LOCKED
Live practice activity stream. Role-scoped per user lane.
Operational activity only — not a social feed.
Moved to More drawer (was previously a bottom nav candidate).

### LOG-069 — Directory — LOCKED
Lives in More drawer — visible to all roles.
Role-scoped visibility: Owner/Admin see all staff. Clinical roles see clinical staff only.
Operational roles see operational staff only.

### LOG-070 — Light Mode + Dark Mode Token System — LOCKED
Light Mode is the default experience.
Dark Mode is user-selectable via Settings.
Domain accent colors are mode-agnostic.
Full token tables in SF-BRAND.md.

### LOG-071 — Card Border System (Asymmetric Accent Border) — LOCKED
Replaces previous 4px left-stripe-only doctrine.
Left: 4px solid accent at full opacity.
Top/Bottom: 1px solid accent at 25% opacity.
Right: 1px solid accent at 15% opacity.
Interior stays clean — color lives in border only.

### LOG-072 — Calendar & Appointments (Operations Engine — Universal) — LOCKED
Calendar and Appointments live in the Operations Engine.
Universal capability across all hats where Operations Engine is active.
Base appointment types: Personal, Meeting, Session, Other.
Each hat adds domain-specific types on top.
Calendar earns permanent bottom nav slot across all workspaces.

### LOG-073 — GP Calendar Layer (GP-Specific Rules) — LOCKED
GP appointment types extend universal base: Client Session, Supervision Session, Staff Meeting, Intake.
Supervisor can view supervisee calendars (read only, own supervisees only).
Supervision appointments created by Supervisor appear on supervisee calendar automatically.
Completed supervision sessions feed into LP Compliance verification records.

### LOG-074 — Owner Active Workload Flag (Operating Profile — Per Hat) — LOCKED
Onboarding question: "Do you personally carry an active workload in this practice — such as clients, cases, or sessions?"
Yes = personal workload tab on dashboard for that hat.
No = clean leadership/CEO view.
Stored per hat. Changeable in Settings. Default: No.
GP follow-up: supervision oversight structure question if Yes.

### LOG-075 — Bottom Nav Update: Calendar Replaces Feed — LOCKED
Final bottom nav: Home, Board, My Work, Calendar, More.
Feed moved to More drawer — not removed, repositioned.

---

End of CHANGELOG.md

---

| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|
