| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|

---

# 06 — Current Development State

**Canon Version:** 03/08/2026 — Phase 6 Pre-Build Canon Update
**Repo:** github.com/sandosown/practiceflow-hub
**Connected to Lovable:** ✅

---

## Phase Status

| Phase | Name | Status |
|---|---|---|
| Phase 1 | Boot Engine | ✅ COMPLETE |
| Phase 2 | Dark Navy Dashboard | ✅ COMPLETE |
| Phase 3 | Structural Fixes | ✅ COMPLETE |
| Phase 4 | Visual Overhaul | ✅ COMPLETE |
| Phase 5 | Landing Energy + Language Doctrine | ✅ COMPLETE |
| Phase 6 | Role-Specific Dashboard Content | 🔄 IN PROGRESS |
| Phase 7 | Module Pages — Real Content | 🔜 PENDING |
| Phase 8 | Action Mode | 🔜 PENDING |

---

## What Is Built

### Boot & Auth
- Supabase RLS session system
- 7 demo users with correct role/subtype assignment
- Route protection by role
- Login page: solid dark background, all 7 demo users listed
- Loading state: "Preparing your workspace…"

### Opening Dashboard (Owner)
- Background: #060e1e deep space
- 90 twinkling stars
- 5 nebula glow pools (teal, blue, amber, green, center)
- Serif greeting with shimmer gradient animation
- Subline: "Which role are you stepping into?" (uppercase, muted)
- 3 horizontal rounded square cards (240×210px, border-radius 24px)
- Flow connectors with pulsing nodes between cards
- Cards: Group Practice (active/teal), Coaching (coming/amber), Home (coming/green)
- Card hover: lifts, outer glow intensifies, inner nebula brightens
- Entrance animation on mount

### Navigation
- SympoFloIcon SVG component (placeholder — logo deferred, LOG-017)
- "SympoFlo" wordmark in Georgia serif
- Workspace context shown only inside workspace
- No role badge, no mode badge
- "Log out" labeled clearly

### Group Practice
- Surface name: "Group Practice" (no second word — LOG-018)
- Radar section with signal-specific accent cards
- 9 module cards with domain accent colors and glow
- All breadcrumbs: "Group Practice › [Module]"
- **Note:** Canon now defines 10 modules. Major Moments is the 10th. Not yet built.

### Module Placeholder Pages
- Each uses its domain accent color
- Page title has 4px left border in accent
- "Coming in Phase 6" card with full 5-layer system
- Breadcrumb and back button present on every page

### Office Board
- Sky blue (#0ea5e9) accent throughout
- 3 working tabs: Announcements, Staff Updates, Resources
- Announcements: create, pin, list
- Staff Updates: post, list
- Resources: add, filter by category, link out

### Role Shells (All Roles)
- All 7 roles have dashboard shells
- Teal card system maintained
- Background: #0a1628

---

## What Is NOT Built Yet (Phase 6+)

- Role-specific dashboard content (what each role actually sees)
- The 10 module pages with real data and actions (9 existing + Major Moments)
- Major Moments module (10th GP module — V1 feature)
- Settings page (all roles, role-scoped)
- Avatar dropdown in TopNavBar (Profile, Settings, Log out)
- Setup Assistance checklist (Owner dashboard)
- Help & Guide system (contextual "?" icons + Guide Center)
- Local search in all database modules
- Action Mode (mobile-first, device-detected)
- Operating Profile Engine
- Training Engine (Clinical Intern lifecycle)
- Supervision structure
- People Engine
- Revenue Engine
- Insurance/Vendor databases

---

## Phase 6 Build Order

Role-specific dashboard content built in this sequence:
1. CLINICIAN dashboard — caseload, charts due, schedule awareness
2. ADMIN dashboard — operational oversight, staff status, workflow queue
3. SUPERVISOR dashboard — intern oversight, LP verification queue
4. INTERN CLINICAL dashboard — caseload, supervision, hour tracking
5. INTERN BUSINESS dashboard — operational tasks, no caseload
6. STAFF dashboard — lightest, task and comms focused

---

## Locked Decisions — 03/08/2026 Phase 6 Pre-Build Session

| ID | Decision |
|---|---|
| LOG-019 | Major Moments added as 10th canonical GP module — V1 build |
| LOG-020 | Major Moments accent: #a78bfa (soft violet) |
| LOG-021 | Major Moments Reflection Banner — Owner only, session-dismissible |
| LOG-022 | Major Moments lives inside each engine — not globally above system |
| LOG-023 | Avatar dropdown pattern locked — top-right, contains Profile / Settings / Log out |
| LOG-024 | No persistent sidebar navigation — explicitly rejected |
| LOG-025 | Settings page — dedicated full page, role-scoped for every role |
| LOG-026 | Setup Assistance — combination approach (checklist + contextual first-visit guidance) |
| LOG-027 | Owner setup checklist — essentials only, disappears permanently on completion |
| LOG-028 | Staff self-onboard independently — owner does not configure staff |
| LOG-029 | Help & Guide system — Option C (contextual "?" icons + Guide Center) — both V1 |
| LOG-030 | Search — local search standard for all database modules in V1 |
| LOG-031 | Global search deferred to future phase |

---

## Previously Locked Decisions

| ID | Decision |
|---|---|
| LOG-009 | Rounded square cards on landing — not rectangles |
| LOG-010 | Landing screen ambient energy system (stars, nebula, connectors) |
| LOG-011 | "Which role are you stepping into?" — orientation language |
| LOG-012 | Serif greeting with shimmer gradient |
| LOG-013 | "Workspaces" terminology under review |
| LOG-014 | Deep page color consistency enforced at all levels |
| LOG-015 | Logo brand kit confirmed — SVG recreation deferred |
| LOG-016 | Language Doctrine fully locked |
| LOG-017 | Logo fix deferred — needs original vector/PNG |
| LOG-018 | "Group Practice Dashboard" → "Group Practice" locked |

---

## Current Demo Users

| Name | Role | Subtype |
|---|---|---|
| Dr. Sarah Mitchell | OWNER | — |
| Marcus Chen | ADMIN | — |
| Dr. Angela Torres | SUPERVISOR | — |
| James Rivera LCSW | CLINICIAN | LICENSED |
| Priya Patel | INTERN | CLINICAL |
| Alex Nguyen | INTERN | BUSINESS |
| Taylor Brooks | STAFF | — |

---

## Visual Doctrine (Current)

- Background (opening screen): #060e1e
- Background (app): #0a1628
- Surface: #1a2a4a
- Accent/Primary: #2dd4bf
- Text Primary: #f1f5f9
- Text Secondary: #94a3b8
- Text Muted: #64748b
- Card system: 5-layer (surface, depth gradient, border, left stripe, glow)
- Glow states: resting / hover / active
- No red, rose, pink anywhere — ever
- Major Moments accent: #a78bfa (soft violet)

---

## Build Workflow (Active)

1. Claude writes Lovable prompt
2. Prompt pasted into Lovable
3. Lovable builds
4. Screenshots + output shared with Claude
5. Claude checks against canon → fix immediately or log for later
6. Repeat

---

End of 06_CURRENT_DEVELOPMENT_STATE.md

---

| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|
