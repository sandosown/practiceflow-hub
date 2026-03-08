| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|

---

# 06 — Current Development State

**Canon Version:** 03/08/2026 — Engine Philosophy + Major Moments + Workspace Naming Update
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

## Phase 6 Build Order

| # | Role | Status |
|---|---|---|
| 1 | CLINICIAN | ✅ APPROVED |
| 2 | ADMIN | ✅ APPROVED |
| 3 | SUPERVISOR | ✅ APPROVED |
| 4 | INTERN CLINICAL | 🔄 NEXT |
| 5 | INTERN BUSINESS | 🔜 PENDING |
| 6 | STAFF | 🔜 PENDING |

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
- Avatar dropdown: Profile → Settings → Log out (in that order)
- "Log out" labeled clearly

### Group Practice
- Surface name: "Group Practice" (no second word — LOG-018)
- Radar section with signal-specific accent cards
- 9 module cards with domain accent colors and glow
- All breadcrumbs: "Group Practice › [Module]"

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

### Phase 6 Role Dashboards (Built)
- ClinicianDashboard.tsx — Radar (3 signals) + My Caseload (4 clients + search) ✅
- AdminDashboard.tsx — Radar (4 signals) + Workflow Queue + Office Board ✅
- SupervisorDashboard.tsx — Radar (4 signals) + Supervision Queue + Office Board ✅

---

## What Is NOT Built Yet (Phase 6+)

- INTERN CLINICAL dashboard (Phase 6 — next)
- INTERN BUSINESS dashboard
- STAFF dashboard
- The 9 module pages with real data and actions
- Major Moments module (Phase 7)
- Workspace naming / logo upload (Phase 7)
- Action Mode (mobile-first, device-detected)
- Operating Profile Engine
- Training Engine (Clinical Intern lifecycle)
- Supervision structure
- People Engine
- Revenue Engine
- Insurance/Vendor databases
- "Need a Tool?" assist panel
- Engine activation guided setup wizard

---

## Locked Decisions — Full Log

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
| LOG-019 | Major Moments = 10th canonical GP module |
| LOG-020 | Major Moments accent: #a78bfa |
| LOG-021 | Reflection Banner — workspace owner only, session-dismissible |
| LOG-022 | Major Moments lives inside each engine as engine-specific module |
| LOG-023 | Avatar dropdown pattern locked: Profile → Settings → Log out |
| LOG-024 | No persistent sidebar |
| LOG-025 | Settings = dedicated full page, role-scoped |
| LOG-026 | Setup Assistance = combination approach (checklist + contextual guidance) |
| LOG-027 | Owner checklist = essentials only, disappears on completion |
| LOG-028 | Staff self-onboard independently — owner does NOT configure staff |
| LOG-029 | Help & Guide = Option C (contextual "?" icons + Guide Center, both V1) |
| LOG-030 | Local search standard for all database modules V1 |
| LOG-031 | Global search deferred to future phase |
| LOG-032 | Resolve buttons: border-only in accent color — no solid fill. All roles, all surfaces. |
| LOG-033 | Attention layer section label must be "Radar" with 4px teal left border — never "Attention" |
| LOG-034 | Office Board accessible to ALL roles — every employee dashboard includes Office Board access |
| LOG-035 | Office Board subtitle locked: "Announcements, safety protocols & updates" |
| LOG-036 | Clinician caseload requires local search bar at top of My Caseload section |
| LOG-037 | Admin Radar cards missing bold name/detail separation (type uppercase + bold detail below) |
| LOG-038 | Resolve buttons on Supervisor Radar have solid fills — global fix pass needed end of Phase 6 |
| LOG-039 | Thin executive layer (hat-level goal summary + KPI snapshot) — decision unsettled, deferred to later features phase |
| LOG-040 | Engine philosophy locked: Hats are lenses. Engines are infrastructure. Hats never generate engines. |
| LOG-041 | 6 Universal Engines locked: People, Operations, Revenue, Growth, Compliance, Personal/Life |
| LOG-042 | Document Control System = system infrastructure layer, not user-selectable engine |
| LOG-043 | Training Engine = Group Practice specialized engine only, not universal |
| LOG-044 | Workspace naming: owner names each hat, default labels are fallbacks, names editable anytime in Settings |
| LOG-045 | Company logo appears on workspace card on Owner opening dashboard alongside company name |
| LOG-046 | Employees see actual company name — not default category label |
| LOG-047 | Major Moments feature name locked: "Major Moments" |
| LOG-048 | Major Moments subtitle locked: "Your milestones and achievements." |
| LOG-049 | Major Moments core prompt locked: "What happened on this day? Take a moment to reflect and record it. You'll be glad you did." |
| LOG-050 | Major Moments CTA locked: "Let's Capture This Moment" |
| LOG-051 | Major Moments — Time It Happened is REQUIRED (not optional) |
| LOG-052 | Major Moments — Award/Recognition is REQUIRED Yes/No field; if Yes → follow-up: "What award or recognition?" |
| LOG-053 | Major Moments — automatic capture is silent background only, no prompts, no chips, no interruption |
| LOG-054 | Major Moments — Reflection Banner visible to workspace owner only (solo = logged-in user, GP = OWNER role) |
| LOG-055 | Major Moments — scrapbook aesthetic within dark navy doctrine |
| LOG-056 | Major Moments — business engine reflection: "You've come a long way. Take a moment to appreciate what you've built and achieved." |
| LOG-057 | Major Moments — life engine reflection: "These are the moments that made you who you are. Take a moment and reflect." |
| LOG-058 | Major Moments — no tagging required, engine context defines category automatically |
| LOG-059 | Engine activation model: engines selectable per hat + user-controlled enable-anytime + "Need a Tool?" panel |
| LOG-060 | Engine activation triggers Guided Setup Wizard — never blank screen |
| LOG-061 | Suggestive automation: 2-3 chips max, disappear on navigation, never interrupt workflow |
| LOG-062 | Recurring logic supported in V1 via suggestive prompts |
| LOG-063 | Context Isolation Principle: no cross-hat bleed in UI — hat → radar → engine → objects only |

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

| Token | Value |
|---|---|
| Background (opening screen) | #060e1e |
| Background (app) | #0a1628 |
| Surface | #1a2a4a |
| Accent/Primary | #2dd4bf |
| Text Primary | #f1f5f9 |
| Text Secondary | #94a3b8 |
| Text Muted | #64748b |
| Major Moments accent | #a78bfa |

Card system: 5-layer (surface, depth gradient, border, 4px left stripe, glow)
Glow states: resting / hover / active
No red, rose, pink anywhere — ever

## Domain Accent Map (GP Modules)

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

---

End of 06_CURRENT_DEVELOPMENT_STATE.md

---

| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|
