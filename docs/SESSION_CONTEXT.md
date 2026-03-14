# SESSION_CONTEXT.md — SympoFlo / PracticeFlow

**App:** SympoFlo / PracticeFlow

**Last Updated:** 03/14/2026

**Repo:** github.com/sandosount/practiceflow-hub

**Build Tool:** Lovable (lovable.dev)

**Canon Location:** /docs folder in repo

---

## HOW TO USE THIS FILE

Copy the full contents of this file and paste into a new Claude chat with:

> "Read this and orient yourself before we continue."

Claude will confirm it has read the file and is ready to continue.

---

## WHAT THIS APP IS

SympoFlo is a multi-hat personal operating system for entrepreneurs and small business owners.

It is not a productivity app. It is not a project manager. It is a calm command center.

**Core promise:**

> "SympoFlo turns complex responsibility into calm command."

**Emotional target:**

The user should feel: "I'm stepping into command." — not "I'm checking another productivity app."

SympoFlo should feel like walking into a command center that's ON — not one that's powered down.

**Capitalization rule:**

SympoFlo — S and F capitalized only. Always. No exceptions.

**The 10-Second Trust Moment:**

Within the first seconds, the user asks:

1. "Does this system understand what I actually do?"

2. "Do I know where to start?"

3. "Is this calm or chaotic?"

If answered correctly: "This system understands my work. I can rely on this."

---

## ENGINE PHILOSOPHY

**Foundational doctrine:**

Hats are contextual lenses. Engines are structural systems.

Hats never generate engines. Engines power hats.

**Full hierarchy:** User → Hats (context lenses — named by the user) → Engines (fixed, predefined universal infrastructure) → Radars (awareness panels) → Actions (execution flows) ### 6 Universal Engines (user-selectable per hat)

| # | Engine | Core Purpose |

|---|---|---|

| 1 | People Engine | Worker profiles, roles, status, responsibilities |

| 2 | Operations Engine | Tasks, workflows, events, asset tracker, Calendar & Appointments |

| 3 | Revenue Engine | Income, lightweight expenses, simple profit snapshot |

| 4 | Growth Engine | Goals, KPIs, pipeline awareness, marketing visibility |

| 5 | Compliance Engine | Contracts, licenses, expiration tracking, renewal reminders |

| 6 | Personal/Life Engine | Household tasks, family events, personal goals, lightweight health |

### 2 Specialized Engines (not user-selectable)

| # | Engine | Scope |

|---|---|---|

| 7 | Document Control System | Cross-hat infrastructure, always active, hat-isolated UX |

| 8 | Training Engine | Group Practice only — clinical intern lifecycle |

### Context Isolation Principle (Non-Negotiable)

Everything in SympoFlo is hat-scoped at the UI layer.

No cross-hat bleed in the user experience.

Rule: Hat → Radar → Engine → Objects. Only.

Every object must store: hat_id + engine_source. No floating objects.

---

## WORKSPACES

| Workspace | Status | Accent |

|---|---|---|

| Group Practice | ✅ Active — first-class workspace | #2dd4bf |

| Coaching | 🔜 Coming Soon | #f59e0b |

| Home | 🔜 Coming Soon | #4ade80 |

| Custom 1 | 🔜 Coming Soon (non-routable) | — |

| Custom 2 | 🔜 Coming Soon (non-routable) | — |

### Workspace Naming Rules

- Owner names each workspace to reflect actual company/life context

- Default labels (e.g. "Group Practice") are fallbacks only

- Employees see the actual company name — not the default category label

- Name is editable anytime in Settings — no locks

- Owner may upload a logo per workspace — appears on workspace card alongside company name

- If no logo uploaded: "S" placeholder renders as fallback

---

## ROLE SYSTEM

| System Role | Description |

|---|---|

| OWNER | CEO / Owner — full system visibility |

| ADMIN | Admin / Management — operational oversight |

| SUPERVISOR | Clinical supervision authority |

| CLINICIAN | Licensed therapist — has caseload |

| INTERN | Clinical or Business subtype |

| STAFF | Non-clinical operational staff |

### Clinician Subtypes

- LICENSED — full licensure, standard clinical routing

- LP (Limited Permit) — state-regulated compliance, routes to Compliance Engine

### Intern Subtypes

- CLINICAL — has caseload, routes to Training Engine, clinical supervision required

- BUSINESS — no caseload, operational staff only, routes to People Engine

---

## DEMO USERS

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

## VISUAL DOCTRINE

### Light Mode Token System (Default — LOG-070)

| Token | Value | Usage |

|---|---|---|

| Page background | #f1f4f8 | All screen backgrounds |

| Surface (cards) | #ffffff | All card interiors |

| Header / Nav bar | #1a2a5e | Top bar, bottom nav bar |

| Text Primary | #1a2a5e | Headings, card labels |

| Text Secondary | #94a3b8 | Subtitles, metadata |

| Section labels | #94a3b8 | UPPERCASE section headers |

| Accent / Primary | #2dd4bf | Active states, CTAs, highlights |

### Dark Mode Token System (User-selectable via Settings — LOG-070)

| Token | Value | Usage |

|---|---|---|

| Page background | #1e3a5f | All screen backgrounds |

| Surface (cards) | #1a3254 | All card interiors |

| Header / Nav bar | #152d4e | Top bar, bottom nav bar |

| Top bar | #243f6a | Secondary header surfaces |

| Text Primary | #f1f5f9 | Headings, card labels |

| Text Secondary | #7ea8c9 | Subtitles, metadata |

| Section labels | #5a8ab0 | UPPERCASE section headers |

| Accent / Primary | #2dd4bf | Active states, CTAs, highlights |

### Legacy Dark Mode (current build — preserved until fully replaced)

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

### Card Border System — Asymmetric Accent Border (LOG-071)

border-left:   4px solid [domain accent] — full opacity

border-top:    1px solid [domain accent at 25%] — subtle

border-bottom: 1px solid [domain accent at 25%] — subtle

border-right:  1px solid [domain accent at 15%] — whisper

Interior stays clean — color lives in border only. No colored card fills. Ever.

### Non-Negotiable Visual Rules

- No red, rose, or pink — anywhere — ever

- Section labels: UPPERCASE, muted color

- Resolve buttons: border-only in accent color — no solid fill

- Radar section label: "Radar" with 4px teal left border — never "Attention"

- Glow states: resting / hover / active

- No decorative glow with no function

- Back buttons: arrow only — no "Back" text label anywhere in the app

### Domain Accent Map — GP Modules

| Module | Accent |

|---|---|

| Charts Requiring Action | #d97706 |

| Message Board | #0ea5e9 |

| Management Center | #7c3aed |

| Client Database | #0d9488 |

| Referral Pipeline | #0ea5e9 |

| Treatment Plan Tracker | #059669 |

| Supervision Structure | #4f46e5 |

| Insurance Database | #78716c |

| Vendor Database | #92764a |

| Major Moments | #a78bfa |

| Finance | #059669 |

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

## PHASE STATUS

| Phase | Name | Status |

|---|---|---|

| Phase 1 | Boot Engine | ✅ COMPLETE |

| Phase 2 | Dark Navy Dashboard | ✅ COMPLETE |

| Phase 3 | Structural Fixes | ✅ COMPLETE |

| Phase 4 | Visual Overhaul | ✅ COMPLETE |

| Phase 5 | Landing Energy + Language Doctrine | ✅ COMPLETE |

| Phase 6 | Role-Specific Dashboard Content | ✅ COMPLETE |

| Phase 7 | Module Pages — Real Content | ✅ COMPLETE |

| Phase 8 | Action Mode | ✅ COMPLETE |

| Phase 9 | Navigation System + Light/Dark Mode | ✅ COMPLETE |

| Phase 10 | Calendar & Appointments | 🔜 PENDING |

---

## NEXT BUILD

**Resume at:** Phase 10 — Calendar & Appointments (PENDING)

---

## MAJOR MOMENTS SPEC

### Locked Copy

| Element | Copy |

|---|---|

| Feature name | Major Moments |

| Subtitle | Your milestones and achievements. |

| Core prompt | What happened on this day? |

| Supporting prompt | Take a moment to reflect and record it. You'll be glad you did. |

| Primary CTA | Let's Capture This Moment |

### Capture Form Fields (in order)

| Field | Required |

|---|---|

| Name Your Moment | Yes |

| Date It Happened | Yes |

| Time It Happened | Yes — not optional |

| Why Was This Moment Important? | Yes |

| Did You Receive an Award or Recognition? | Yes — Yes/No; if Yes → "What award or recognition?" |

| Anything Else You'd Like to Remember? | No — optional |

### Engine-Specific Reflection Messaging

**Business engines:**

> "You've come a long way. Take a moment to appreciate what you've built and achieved."

**Life/Personal engine:**

> "These are the moments that made you who you are. Take a moment and reflect."

### Behavioral Rules

- Automatic capture is silent background only — no prompts, no chips, no interruption

- Reflection Banner visible to workspace owner only

- Reflection Banner is session-dismissible — never persistent across sessions

- No tagging required — engine context defines category automatically

- Visual treatment: scrapbook aesthetic within dark navy doctrine — no light backgrounds ever

- Accent: #a78bfa throughout

- Lives in More drawer under PERSONAL section — not on main module grid

---

## AUTOMATION MODEL

### Suggestion Chip Rules

- Maximum 2–3 chips displayed contextually at bottom of screen

- Disappear on navigation — no guilt, no stacking

- Template-based — not a rule-builder

- User always remains in control

- Never interrupt active workflow

### Recurring Logic

Supported in V1 via suggestive prompts only.

When a user creates something that could recur, a suggestion chip appears: "Make this recurring?"

If ignored, disappears on next navigation.

---

## BUILD WORKFLOW

1. Claude generates the prompt

2. Paste prompt into Lovable

3. Lovable renders the result

4. Take a screenshot

5. Paste screenshot back to Claude for review

6. Claude approves or flags issues

7. If approved → push to GitHub

8. If issues → Claude generates fix → repeat from step 2

### Important Protection Rules

- Never paste a broad rewrite prompt into Lovable — surgical patches only

- One fix at a time — complete and verify before moving to the next

- Always pull before pushing: git pull --no-rebase origin main

- Canon > Chat. Always. If something in chat contradicts a canon file, the canon file wins.

- No architectural decisions live only in conversation — everything goes into /docs

- Back buttons: arrow only — no "Back" text — apply to every page touched in every prompt

---

## GIT WORKFLOW

### Standard Push ---

## KEY FILES IN CODEBASE

| File | Purpose | Status |

|---|---|---|

| src/pages/Index.tsx | Opening dashboard — Owner hat selector | ✅ Built |

| src/pages/GroupPractice.tsx | GP workspace surface | ✅ Built |

| src/pages/Login.tsx | Login page — all 7 demo users — Light Mode | ✅ Built |

| src/components/SympoFloIcon.tsx | Logo SVG placeholder | ✅ Built (placeholder) |

| src/components/BottomNavBar.tsx | Persistent 5-item bottom nav | ✅ Built |

| src/components/MoreDrawer.tsx | More drawer — grid layout, role sections | ✅ Built |

| src/context/SessionContext.tsx | Session + role context | ✅ Built |

| src/dashboards/ClinicianDashboard.tsx | Clinician role dashboard | ✅ Approved |

| src/dashboards/AdminDashboard.tsx | Admin role dashboard | ✅ Approved |

| src/dashboards/SupervisorDashboard.tsx | Supervisor role dashboard | ✅ Approved |

| src/dashboards/InternClinicalDashboard.tsx | Clinical Intern dashboard | ✅ Approved |

| src/dashboards/InternBusinessDashboard.tsx | Business Intern dashboard | ✅ Approved |

| src/dashboards/StaffDashboard.tsx | Staff dashboard | ✅ Approved |

| src/pages/dashboard/modules/ChartsRequiringAction.tsx | Charts module | ✅ Built |

| src/pages/dashboard/modules/ClientDatabase.tsx | Client database module | ✅ Built |

| src/pages/dashboard/modules/ReferralPipeline.tsx | Referral Pipeline — kanban board | ✅ Built |

| src/pages/dashboard/modules/TreatmentPlanTracker.tsx | Treatment plan module | ✅ Built |

| src/pages/dashboard/modules/SupervisionStructure.tsx | Supervision module — More drawer | ✅ Built |

| src/pages/dashboard/modules/ManagementCenter.tsx | Management center module | ✅ Built |

| src/pages/dashboard/modules/InsuranceDatabase.tsx | Insurance module | ✅ Built |

| src/pages/dashboard/modules/VendorDatabase.tsx | Vendor database module | ✅ Built |

| src/pages/dashboard/modules/MajorMoments.tsx | Major Moments — More drawer | ✅ Built |

| src/pages/dashboard/modules/Finance.tsx | Finance module — Owner + Admin only | ✅ Built |

| src/pages/dashboard/MessageBoard.tsx | Message Board | ✅ Built |

| supabase/ | Supabase RLS config | ✅ Built |

---

## CANON FILES

| File | Contains | Status |

|---|---|---|

| 00_APP_IDENTITY.md | App name, emotional target, capitalization rules | ✅ Locked |

| 01_CORE_SYSTEM_PHILOSOPHY.md | Core philosophy, language doctrine | ✅ Locked |

| 02_GLOBAL_ARCHITECTURE.md | Engine architecture, role system, Calendar & Appointments | ✅ Updated 03/13/2026 |

| 03_OPERATING_PROFILE_ENGINE.md | Owner config layer, onboarding, Owner Active Workload Flag | ✅ Updated 03/13/2026 |

| 04_GROUP_PRACTICE_DOMAIN.md | GP modules, Referral Pipeline, Finance, Calendar layer | ✅ Updated 03/14/2026 |

| 05_DEVELOPMENT_GOVERNANCE.md | Canon protocol, nav governance, More drawer rules | ✅ Updated 03/14/2026 |

| 06_CURRENT_DEVELOPMENT_STATE.md | Phase status, what's built, full LOG table | ✅ Updated 03/14/2026 |

| CHANGELOG.md | Full version history, all LOG entries through LOG-080 | ✅ Updated 03/14/2026 |

| SF-BRAND.md | Visual doctrine, Light/Dark tokens, nav visual spec | ✅ Updated 03/13/2026 |

| PF-CANON.md | Master canon source | ✅ Locked |

| README.md | Repo index | ✅ Locked |

| SESSION_CONTEXT.md | This file — session continuity | ✅ Updated 03/14/2026 |

**Canon rule:** Canon > Chat. Always. Nothing architectural lives only in conversation.

---

## LOCKED COPY

| Element | Locked Copy |

|---|---|

| Onboarding orientation | "Which role are you stepping into?" |

| Onboarding support line | "Choose the role you want to step into." |

| Owner onboarding tone 1 | "Where in your life do you need steady support right now?" |

| Owner onboarding tone 2 | "Choose the areas you'd like help managing. We organize these as your hats." |

| Boot loading state | "Preparing your workspace…" |

| Major Moments feature name | Major Moments |

| Major Moments subtitle | Your milestones and achievements. |

| Major Moments core prompt | What happened on this day? |

| Major Moments support prompt | Take a moment to reflect and record it. You'll be glad you did. |

| Major Moments CTA | Let's Capture This Moment |

| Business engine reflection | You've come a long way. Take a moment to appreciate what you've built and achieved. |

| Life engine reflection | These are the moments that made you who you are. Take a moment and reflect. |

| Owner workload flag question | Do you personally carry an active workload in this practice — such as clients, cases, or sessions? |

| Radar section label | Radar |

| Wordmark font | Georgia, serif — not bold, not sans-serif |

| Referral Pipeline subtitle | Referral intake to assignment. |

| Finance subtitle | Income, expenses & practice health. |

| Greeting banner format | "Good [morning/afternoon/evening], Dr. [First Name]. — You currently have [X] signals requiring your attention." |

---

## DECISION LOG — THIS SESSION (03/14/2026)

| ID | Description | Status |

|---|---|---|

| LOG-076 | Referral Pipeline replaces Caseload Integration — kanban, 5 stages, 3 outcome buckets, manual workflow only, accent #0ea5e9 | LOCKED |

| LOG-077 | Finance module — Owner + Admin only, replaces Supervision Structure on GP grid, income/expenses/profit/due, accent #059669 | LOCKED |

| LOG-078 | Supervision Structure moves from GP grid to More drawer CLINICAL section | LOCKED |

| LOG-079 | More drawer CLINICAL section added between PRACTICE and TEAM — V1 contents: Supervision Structure | LOCKED |

| LOG-080 | Guide Center Video Tutorials tab — second tab alongside Written Guides, grid of tutorial cards | LOCKED |

| LOG-081 | Greeting banner added to GP dashboard — centered, single line, dynamic time of day, live signal count in teal | LOCKED |

| LOG-082 | Major Moments moved from GP module grid to More drawer PERSONAL section | LOCKED |

| LOG-083 | Avatar dropdown — DS initials in teal circle, chevron indicator, Profile/Settings/Log out in correct order | LOCKED |

| LOG-084 | Back buttons app-wide — arrow only, no "Back" text label, apply to every page touched | LOCKED |

| LOG-085 | Referral Pipeline outcome buckets — Declined (muted), No Response (muted), Intake Complete (#059669 Active badge) | LOCKED |

| LOG-086 | Add Referral modal — source field is dropdown: Web Form, Phone Call, Email, Walk-in, Referral from provider, Other | LOCKED |

| LOG-087 | "Group Practice" and "Workspaces" permanently banned from all UI surfaces. Breadcrumbs show page name only. Top bar center shows owner's company name only. | LOCKED |

| LOG-089 | Partner role — co-owner level, full access by default, self-configures visible tabs per hat, hat-scoped, universal across all engines | LOCKED |

| LOG-090 | Permission Grant System — Owner grants View Only or Full Access to any module for any staff member, per-hat, revocable | LOCKED |

| LOG-091 | Invitation System — only entry point for staff, Owner/Admin/designated roles can invite, single-use link expires 72hrs, hat-scoped | LOCKED |

| LOG-092 | Custom Pipeline Stages — Owner adds stages anywhere in chain, drag-reorderable, default stages cannot be removed | LOCKED |

| LOG-093 | Referral Pipeline outcome bucket entry — drag or forward/back arrows, desktop and mobile, all movements logged | LOCKED |

| LOG-094 | Staff Deactivation — INACTIVE status, never hard delete, immediate or date-set removal, blocked if active assignments exist | LOCKED |

---

## OUTSTANDING DECISIONS

| ID | Description | Status |

|---|---|---|

| LOG-013 | "Workspaces" terminology — too corporate, under review | OPEN |

| LOG-039 | Thin executive layer (hat-level goal summary + KPI snapshot) | DEFERRED |

| LOG-017 | Logo SVG recreation | DEFERRED — needs original vector/PNG file |

---

## APPROVED THIS SESSION

- LOG-086 verified — Add Referral source dropdown confirmed ✅

- Finance module page — approved ✅

- Redundant page labels removed app-wide ✅

- Back button text removed app-wide ✅

- Referral Pipeline drag and drop + column collapse (2 cards max, +X more) ✅

- Mobile hamburger menu ✅

- Settings page built + 404 route fixed ✅

- Dark Mode toggle in Settings ✅

- Dark Mode persistence across sessions (Supabase) ✅

- LOG-071 asymmetric border system applied and approved ✅

- LOG-087 applied to codebase — Group Practice and Workspaces removed from all UI surfaces ✅

- More drawer role-filtered for all 7 roles ✅

- Phase 9 complete ✅

---

## DESIGN SCOPE REFERENCE

SympoFlo is built for entrepreneurs and small business operators across many types:

group practice owners, coaches, consultants, speakers, outdoor guides, yoga instructors, and others.

**This is a marketing and positioning consideration — not a canon architectural concern.**

The engine architecture already serves all of these user types without modification.

New entrepreneur types do not require new engines — they bring their own content to the existing infrastructure.

---

End of SESSION_CONTEXT.md
