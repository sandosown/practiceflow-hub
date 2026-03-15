| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|

---

# 06 — Current Development State

**Canon Version:** 03/13/2026 — Navigation System + Light/Dark Mode + Calendar Update (previously 03/08/2026 — Engine Philosophy + Major Moments + Workspace Naming Update)
**Repo:** github.com/sandosount/practiceflow-hub
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
| Phase 9 | Navigation System + Light/Dark Mode | 🔜 PENDING — Canon locked, build pending |
| Phase 10 | Calendar & Appointments | 🔜 PENDING — Canon locked, build pending |

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

- Bottom navigation bar (all roles) — **canon now locked (LOG-064)**
- Light Mode — **canon now locked (LOG-070)**
- Dark Mode toggle in Settings — **canon now locked (LOG-070)**
- Message Board (renamed from Office Board) — **canon now locked (LOG-065)**
- Calendar & Appointments (Operations Engine) — **canon now locked (LOG-072, LOG-073)**
- Recognition system — **canon now locked (LOG-066)**
- Direct Messages (GP-scoped) — **canon now locked (LOG-067)**
- Feed (More drawer) — **canon now locked (LOG-068)**
- Directory (More drawer) — **canon now locked (LOG-069)**
- Owner Active Workload Flag — **canon now locked (LOG-074)**
- More drawer (role-filtered) — **canon now locked (LOG-064)**
- INTERN CLINICAL dashboard (Phase 6 — next)
- INTERN BUSINESS dashboard
- STAFF dashboard
- The 10 module pages with real data and actions
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
- Referral Pipeline — **canon locked (LOG-076)**
- Finance Tab — **canon locked (LOG-077)**
- Guide Center Video Tutorials tab — **canon locked (LOG-080)**

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
| LOG-064 | Bottom nav system locked: Home, Board, My Work, Calendar, More — all GP screens all roles |
| LOG-065 | Office Board renamed to Message Board — all roles read + post, Owner/Admin pin + manage |
| LOG-066 | Recognition: Owner/Admin/Supervisor give, all roles receive, no peer-to-peer V1 |
| LOG-067 | Direct Messages: GP-scoped utility, More drawer, separate from Message Board |
| LOG-068 | Feed: live practice activity stream, role-scoped, More drawer |
| LOG-069 | Directory: More drawer, role-scoped visibility per role type |
| LOG-070 | Light Mode (default) + Dark Mode (user-selectable) token system locked |
| LOG-071 | Asymmetric accent border system: 4px left full opacity, 1px top/bottom at 25%, 1px right at 15% |
| LOG-072 | Calendar & Appointments in Operations Engine — universal across all hats |
| LOG-073 | GP Calendar layer: GP appointment types, supervisor/supervisee visibility rules |
| LOG-074 | Owner Active Workload Flag: per-hat, onboarding question locked, supervision structure options |
| LOG-075 | Calendar replaces Feed in bottom nav — Feed moves to More drawer |
| LOG-076 | Referral Pipeline replaces Caseload Integration — kanban, 5 stages, 3 outcome buckets, manual workflow only |
| LOG-077 | Finance Tab — Owner + Admin only, replaces Supervision Structure on GP grid, income/expenses/profit/due |
| LOG-078 | Supervision Structure moves from GP grid to More drawer CLINICAL section |
| LOG-079 | More drawer CLINICAL section added between PRACTICE and TEAM |
| LOG-080 | Guide Center Video Tutorials tab added as second tab alongside Written Guides |
| LOG-087 | "Group Practice" and "Workspaces" are permanently banned from all UI surfaces. Breadcrumbs show page name only. Top bar center shows owner's company name only. |
| LOG-088 | Finance data pipeline future-proofed — source field on all entries from V1, manual is first source only |
| LOG-089 | Partner role — co-owner level, full access by default, self-configures visible tabs per hat, hat-scoped, universal across all engines |
| LOG-090 | Permission Grant System — Owner grants View Only or Full Access to any module for any staff member, per-hat, revocable |
| LOG-091 | Invitation System — only entry point for staff, Owner/Admin/designated roles can invite, single-use link expires 72hrs, hat-scoped |
| LOG-092 | Custom Pipeline Stages — Owner adds stages anywhere in chain, drag-reorderable, default stages cannot be removed. LOG-092 amended — default stage names are editable by Owner. Structure preserved, labels are not locked. |
| LOG-093 | Referral Pipeline outcome bucket entry — drag or forward/back arrows, desktop and mobile, all movements logged |
| LOG-094 | Staff Deactivation — INACTIVE status, never hard delete, immediate or date-set removal, blocked if active assignments exist |
| LOG-095 | Management Center Recent Activity — live practice activity feed, Owner + Admin only, 10 items max, practice-level operational events only |
| LOG-096 | Calendar is a universal component — hat-configurable appointment types, same shell across all hats and engines, no redesign needed for new hats | LOCKED |
| LOG-097 | Appointment Status System — Confirmed, Completed, Cancelled, Rescheduled, No Show — universal across all hats, inline update, logged | LOCKED |
| LOG-098 | Calendar Filter System — keyword, date range, month/year, type, status, assigned to — universal across all hats, real-time filtering, mobile-responsive | LOCKED |
| LOG-099 | Proactive Canon Flagging Rule — Claude must flag all canon-worthy decisions during sessions without waiting to be asked | LOCKED |
| LOG-100 | Color Variety Rule — varied colors required on all chip sets, blocks, and grouped visual elements — monotone sets rejected | LOCKED |
| LOG-101 | UI Color Variety System — 23 approved UI colors, variety rules, banned colors, distinct from brand palette | LOCKED |
| LOG-102 | Appointment Context Fields — participants, in-person/virtual, location, platform, meeting link — universal across all hats | LOCKED |
| LOG-103 | Location Management System — saved locations per hat, multiple offices supported, save for future use, universal across all hats | LOCKED |
| LOG-104 | Appointment Shared Ownership Rule — every participant owns their copy equally, full edit rights, linked via appointment_group_id, universal | LOCKED |

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

## Visual Doctrine

### Note on Visual Doctrine (03/13/2026)
Light Mode and Dark Mode token systems are now locked (LOG-070). The dark navy tokens below remain the canonical Dark Mode system. Light Mode is the new default. See SF-BRAND.md for full token tables for both modes.

### Dark Mode Tokens (current build / user-selectable)

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

### Light Mode Tokens (new default — LOG-070)

| Token | Value |
|---|---|
| Page background | #f1f4f8 |
| Surface (cards) | #ffffff |
| Header / Nav bar | #1a2a5e |
| Text Primary | #1a2a5e |
| Text Secondary | #94a3b8 |
| Section labels | #94a3b8 |
| Accent / Primary | #2dd4bf |

Card system: 5-layer (surface, depth gradient, border, 4px left stripe, glow) — Dark Mode
Asymmetric accent border (LOG-071) — Light Mode and Dark Mode going forward
Glow states: resting / hover / active
No red, rose, pink anywhere — ever

---

## Domain Accent Map (GP Modules)

| Module | Accent |
|---|---|
| Charts Requiring Action | #d97706 |
| Message Board (formerly Office Board) | #0ea5e9 |
| Management Center | #7c3aed |
| Client Database | #0d9488 |
| Referral Pipeline | #0ea5e9 |
| Treatment Plan Tracker | #059669 |
| Finance Tab | #059669 |
| Supervision Structure | #4f46e5 |
| Insurance Database | #78716c |
| Vendor Database | #92764a |
| Major Moments | #a78bfa |

---

End of 06_CURRENT_DEVELOPMENT_STATE.md

---

| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) |  |
|---|---|---|
