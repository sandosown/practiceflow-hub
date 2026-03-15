# SESSION_CONTEXT.md — SympoFlo / PracticeFlow

**App:** SympoFlo / PracticeFlow

**Last Updated:** 03/15/2026

**Repo:** github.com/sandosount/practiceflow-hub

**Build Tool:** Lovable (lovable.dev)

**Canon Location:** /docs folder in repo

---

## HOW TO USE THIS FILE

This is a handoff document. A new Claude chat should:

1. Read this file fully

2. Request all canon files from /docs before doing anything else:

   - 00_APP_IDENTITY.md

   - 01_CORE_SYSTEM_PHILOSOPHY.md

   - 02_GLOBAL_ARCHITECTURE.md

   - 03_OPERATING_PROFILE_ENGINE.md

   - 04_GROUP_PRACTICE_DOMAIN.md

   - 05_DEVELOPMENT_GOVERNANCE.md

   - 06_CURRENT_DEVELOPMENT_STATE.md

   - SF-BRAND.md

   - CHANGELOG.md

3. Confirm full alignment before any build prompts are written

4. This is a continuation session — do not restart, do not reintroduce, do not re-ask decisions already made

Say: "I have read SESSION_CONTEXT.md. Please share the canon files so I can get fully aligned before we continue."

Canon > Chat. Always.

---

## WHAT THIS APP IS

SympoFlo is a multi-hat personal operating system for entrepreneurs and small business owners.

It is not a productivity app. It is not a project manager. It is a calm command center.

**Core promise:**

> "SympoFlo turns complex responsibility into calm command."

**Emotional target:**

The user should feel: "I'm stepping into command." — not "I'm checking another productivity app."

**Capitalization rule:**

SympoFlo — S and F capitalized only. Always. No exceptions.

---

## WHAT WE ARE BUILDING

SympoFlo is being built in Lovable (lovable.dev) connected to a GitHub repo and Supabase backend. The build workflow is:

1. Claude generates a Lovable prompt in a code block

2. User pastes prompt into Lovable

3. Lovable renders the result

4. User takes a screenshot and shares with Claude

5. Claude reviews and approves or flags issues

6. If approved → push to GitHub

7. If issues → Claude generates fix prompt → repeat

**Build rules:**

- Surgical patches only — never broad rewrites

- One fix at a time — complete and verify before moving to next

- Always pull before pushing: git pull --no-rebase origin main

- Canon > Chat. Always.

- Back buttons: arrow only — no "Back" text — apply to every page touched

- No red, rose, or pink anywhere — ever

- Resolve/action buttons: border-only in accent color — no solid fill

- Proactive canon flagging: Claude must flag all canon-worthy decisions immediately (LOG-099)

---

## ENGINE PHILOSOPHY

Hats are contextual lenses. Engines are structural systems.

Hats never generate engines. Engines power hats.

Full hierarchy: User → Hats → Engines → Radars → Actions

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

| Phase 7 | Module Pages — Real Content | 🔜 PENDING |

| Phase 8 | Action Mode | 🔜 PENDING |

| Phase 9 | Navigation System + Light/Dark Mode | ✅ COMPLETE |

| Phase 10 | Calendar & Appointments | ✅ COMPLETE |

| Phase 11 | People Engine + Worker Profiles | 🔜 NEXT |

---

## NEXT BUILD — Phase 11

**Resume at:** Phase 11 — People Engine + Worker Profiles

**Pending items to complete before Phase 11:**

1. Verify duplicate appointment detection in live environment (was in build mode during session — save button inactive)

2. Verify Supervisor auto-assign rule in live environment — Supervision Session created by Supervisor appears on supervisee calendar

3. Verify Manage Access pre-selection routing from Management Center — person should be pre-loaded when clicking Manage Access from staff row

**Phase 11 build order:**

1. Worker Profile pages — full 7-section wizard with real data

2. Client Database — real client records, search, status lifecycle

3. Treatment Plan Tracker — real data, approve/review flow

4. Charts Requiring Action — real data

5. Insurance Database — real data

6. Vendor Database — real data

7. Management Center — complete staff profile pages with credentials

---

## DEMO USERS

| Name | Role | Subtype |

|---|---|---|

| Dr. Sarah Mitchell | OWNER | — |

| Jordan Mitchell | PARTNER | — |

| Marcus Chen | ADMIN | — |

| Dr. Angela Torres | SUPERVISOR | — |

| James Rivera LCSW | CLINICIAN | LICENSED |

| Priya Patel | INTERN | CLINICAL |

| Alex Nguyen | INTERN | BUSINESS |

| Taylor Brooks | STAFF | — |

---

## WORKSPACES

| Workspace | Status | Accent |

|---|---|---|

| Group Practice (Clarity Counseling Group) | ✅ Active | #2dd4bf |

| Coaching | 🔜 Coming Soon | #f59e0b |

| Home | 🔜 Coming Soon | #4ade80 |

| Custom 1 | 🔜 Coming Soon | — |

| Custom 2 | 🔜 Coming Soon | — |

---

## VISUAL DOCTRINE SUMMARY

- Light Mode is default — Dark Mode user-selectable via Settings only

- No red, rose, pink — ever

- No "Group Practice" or "Workspaces" anywhere in UI — ever (LOG-087)

- Breadcrumbs show page name only — no parent prefix

- Back buttons: arrow only — no text

- Resolve/action buttons: border-only — no solid fill

- Asymmetric accent border system (LOG-071): 4px left full, 1px top/bottom 25%, 1px right 15%

- UI Color Variety System (LOG-100/101): 23 approved colors, varied sets, no monotone

- Section labels: UPPERCASE, muted color

- Radar section label: "Radar" with 4px teal left border — never "Attention"

- Wordmark font: Georgia, serif — not bold

---

## DECISION LOG — THIS SESSION (03/14/2026 — 03/15/2026)

| ID | Description | Status |

|---|---|---|

| LOG-087 | "Group Practice" and "Workspaces" permanently banned from all UI surfaces | LOCKED |

| LOG-088 | Finance data pipeline future-proofed — source field on all entries from V1 | LOCKED |

| LOG-089 | Partner role — co-owner level, full access, self-configures visible tabs per hat | LOCKED |

| LOG-090 | Permission Grant System — Owner grants View Only or Full Access per module per staff | LOCKED |

| LOG-091 | Invitation System — only entry point for staff, single-use link, 72hr expiry | LOCKED |

| LOG-092 | Custom Pipeline Stages — Owner adds stages anywhere, drag-reorderable, names editable | LOCKED |

| LOG-093 | Referral Pipeline outcome bucket entry — Outcome button on all cards, all stages | LOCKED |

| LOG-094 | Staff Deactivation — INACTIVE status, never hard delete, immediate or date-set removal | LOCKED |

| LOG-095 | Management Center Recent Activity — live feed, Owner + Admin only, 10 items max | LOCKED |

| LOG-096 | Calendar universal component — hat-configurable appointment types, same shell all hats | LOCKED |

| LOG-097 | Appointment Status System — Confirmed, Completed, Cancelled, Rescheduled, No Show | LOCKED |

| LOG-098 | Calendar Filter System — keyword, date range, month/year, type, status, assigned to | LOCKED |

| LOG-099 | Proactive Canon Flagging Rule — Claude flags all canon-worthy decisions immediately | LOCKED |

| LOG-100 | Color Variety Rule — varied colors required on all chip sets and grouped elements | LOCKED |

| LOG-101 | UI Color Variety System — 23 approved UI colors, pairing rules, not brand palette | LOCKED |

| LOG-102 | Appointment Context Fields — participants, meeting format, location, virtual platform | LOCKED |

| LOG-103 | Location Management System — saved locations per hat, multiple offices, Settings management | LOCKED |

| LOG-104 | Appointment Shared Ownership Rule — equal ownership for all participants, linked via group_id | LOCKED |

---

## APPROVED THIS SESSION

- Finance module — manual entry, Supabase persistence, custom categories ✅

- Referral Pipeline — drag and drop, column collapse, arrows, Outcome button, Edit Mode, custom stages, outcome buckets, instructional text ✅

- Mobile hamburger menu ✅

- Settings page + Dark Mode toggle + persistence ✅

- LOG-071 asymmetric border system ✅

- LOG-087 applied — Group Practice and Workspaces removed from all UI ✅

- More drawer role-filtered for all 8 roles ✅

- Invitation System — Management Center ✅

- Permission Grant System — Access & Permissions search-first redesign ✅

- Partner role — dashboard, Customize My View, direct hat routing ✅

- Staff Removal flow — INACTIVE status, confirmation modal, blocking check ✅

- Management Center — search-first, rich staff rows, Recent Activity, Remove button ✅

- Opening dashboard — workspace name only, no subtitle ✅

- Calendar Phase 10 — full build: month/week/day views, appointments panel, smart filters, live search, color-coded chips, status system, shared ownership, duplicate detection, location management, participant fields, meeting format ✅

- SF-BRAND.md — UI Color Variety System added ✅

- Phase 9 ✅ Phase 10 ✅

---

## OUTSTANDING DECISIONS

| ID | Description | Status |

|---|---|---|

| LOG-013 | "Workspaces" terminology — too corporate, under review | OPEN |

| LOG-039 | Thin executive layer (hat-level goal summary + KPI snapshot) | DEFERRED |

| LOG-017 | Logo SVG recreation | DEFERRED — needs original vector/PNG |

---

## ITEMS TO VERIFY NEXT SESSION

1. Duplicate appointment detection — verify in live environment (save was inactive during build)

2. Supervisor auto-assign — verify Supervision Session appears on supervisee calendar automatically

3. Manage Access pre-selection routing from Management Center staff rows

4. Finance Supabase persistence — confirm entries save and compute correctly in live environment

---

## BUILD WORKFLOW

1. Claude generates prompt in a code block

2. Paste into Lovable

3. Lovable renders

4. Screenshot back to Claude

5. Claude approves or flags

6. If approved → push to GitHub

7. If issues → fix prompt → repeat

**Important Protection Rules:**

- Never paste a broad rewrite — surgical patches only

- One fix at a time

- Always pull before pushing: git pull --no-rebase origin main

- Canon > Chat. Always.

- Nothing architectural lives only in conversation

---

## CANON FILES

| File | Contains | Status |

|---|---|---|

| 00_APP_IDENTITY.md | App name, emotional target, capitalization rules | ✅ Locked |

| 01_CORE_SYSTEM_PHILOSOPHY.md | Core philosophy, language doctrine | ✅ Locked |

| 02_GLOBAL_ARCHITECTURE.md | Engine architecture, role system, Calendar, LOG-089 through LOG-104 | ✅ Updated 03/15/2026 |

| 03_OPERATING_PROFILE_ENGINE.md | Owner config layer, onboarding, Owner Active Workload Flag | ✅ Updated 03/13/2026 |

| 04_GROUP_PRACTICE_DOMAIN.md | GP modules, Referral Pipeline, Finance, Calendar layer, LOG-092 through LOG-095 | ✅ Updated 03/15/2026 |

| 05_DEVELOPMENT_GOVERNANCE.md | Canon protocol, nav governance, Proactive Canon Flagging Rule (LOG-099) | ✅ Updated 03/15/2026 |

| 06_CURRENT_DEVELOPMENT_STATE.md | Phase status, full LOG table through LOG-104 | ✅ Updated 03/15/2026 |

| CHANGELOG.md | Full version history | ✅ Updated 03/15/2026 |

| SF-BRAND.md | Visual doctrine, Light/Dark tokens, UI Color Variety System (LOG-100/101) | ✅ Updated 03/15/2026 |

| SESSION_CONTEXT.md | This file — session continuity and handoff | ✅ Updated 03/15/2026 |

**Canon rule:** Canon > Chat. Always. Nothing architectural lives only in conversation.

---

End of SESSION_CONTEXT.md
