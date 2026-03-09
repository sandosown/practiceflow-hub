# SympoFlo / PracticeFlow — Session Context
**Last Updated:** 03/08/2026
**Repo:** github.com/sandosown/practiceflow-hub
**Build Tool:** Lovable (lovable.dev) — connected to repo
**Canon Location:** `/docs` folder in repo

---

## HOW TO USE THIS FILE

Paste the contents of this file at the start of any new Claude session and say:
**"Read this and orient yourself on the project before we continue."**

Claude will be immediately up to speed. No re-explaining needed.

---

## WHAT THIS APP IS

**SympoFlo** (brand name) / **PracticeFlow** (system name) is a multi-workspace Life-Role Operating System for entrepreneurs. It is not a business dashboard. It is not a productivity tracker. It is a **personal operating assistant** for people who wear multiple hats in life and business.

**Emotional target:** Calm Command Center.

**The core promise:** "Wow, thank God I finally have a personal assistant — because I truly couldn't afford to pay someone to do this."

**Capitalization rule:** Always **SympoFlo** (S and F capitalized only). Never Sympoflo, sympoflo, or SYMPOFLO.

---

## ENGINE PHILOSOPHY (FOUNDATIONAL — NEVER VIOLATE)

**Hats are contextual lenses. Engines are structural systems. Hats never generate engines. Engines power hats.**

```
User
→ Hats (context lenses — named by the user)
  → Engines (fixed, universal infrastructure)
    → Radars (awareness panels)
      → Actions (execution flows)
```

**6 Universal Engines (user-selectable per hat):**
1. People Engine — relational identity, worker profiles only
2. Operations Engine — tasks, events (3-phase), assets, recurring logic
3. Revenue Engine — income + lightweight expenses + profit snapshot
4. Growth Engine — goals, KPIs, pipeline, marketing visibility
5. Compliance Engine — contracts, licenses, expiration tracking
6. Personal/Life Engine — household, personal goals, lightweight health

**2 Specialized Engines:**
- Document Control System — system infrastructure, always active, not user-selectable
- Training Engine — Group Practice only

**Context Isolation Principle:** No cross-hat bleed in UI. Hat → Radar → Engine → Objects. Only.

---

## WORKSPACES (HATS)

| Workspace | Status | Notes |
|---|---|---|
| GROUP_PRACTICE | Active | First-class, pre-selected |
| COACHING | Coming Soon | Not yet routable |
| HOME | Coming Soon | Not yet routable |
| CUSTOM_1 | Coming Soon | Max 2 custom |
| CUSTOM_2 | Coming Soon | Max 2 custom |

**Workspace naming rule:** Owner names each workspace with their actual company name (e.g. "Good Health LLC"). Default labels are fallbacks only. Logo appears on workspace card on Owner opening dashboard. Employees see actual company name — not default category label.

---

## ROLE SYSTEM

| Role | Description |
|---|---|
| OWNER | Full system visibility |
| ADMIN | Operational oversight |
| SUPERVISOR | Clinical supervision authority |
| CLINICIAN | Licensed therapist — has caseload |
| INTERN | Clinical or Business subtype |
| STAFF | Non-clinical operational staff |

**Clinician subtypes:** LICENSED, LP (Limited Permit)
**Intern subtypes:** CLINICAL (has caseload), BUSINESS (operational only)

---

## DEMO USERS (Current)

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

## VISUAL DOCTRINE (NON-NEGOTIABLE)

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

- 5-layer card system: base surface + depth gradient + border + 4px left stripe + glow
- Glow states: resting / hover / active
- No red, rose, pink — ever
- Radar signal cards have accent-tinted gradient backgrounds — this is intentional and approved
- Section labels are always UPPERCASE
- Resolve buttons are always border-only in accent color — never solid fill
- Light/Dark mode is a planned future feature — current dark doctrine stays until client review session

**Domain Accent Map (GP Modules):**

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

## PHASE STATUS

| Phase | Name | Status |
|---|---|---|
| Phase 1 | Boot Engine | ✅ COMPLETE |
| Phase 2 | Dark Navy Dashboard | ✅ COMPLETE |
| Phase 3 | Structural Fixes | ✅ COMPLETE |
| Phase 4 | Visual Overhaul | ✅ COMPLETE |
| Phase 5 | Landing Energy + Language Doctrine | ✅ COMPLETE |
| Phase 6 | Role-Specific Dashboard Content | ✅ COMPLETE |
| Phase 7 | Module Pages — Real Content | 🔄 NEXT |
| Phase 8 | Action Mode | 🔜 PENDING |

---

## PHASE 7 — NEXT BUILD

Build out the 10 Group Practice module pages with real content, one at a time.
Office Board is already built — do not touch.

**Build order:**
1. Charts Requiring Action — #d97706
2. Management Center — #7c3aed
3. Client Database — #0d9488
4. Caseload Integration — #3b82f6
5. Treatment Plan Tracker — #059669
6. Supervision Structure — #4f46e5
7. Insurance Database — #78716c
8. Vendor Database — #92764a
9. Major Moments — #a78bfa
10. Office Board — already built ✅

---

## MAJOR MOMENTS (Locked Feature Spec)

| Element | Value |
|---|---|
| Feature name | Major Moments |
| Subtitle | Your milestones and achievements. |
| Core prompt | What happened on this day? |
| Supporting prompt | Take a moment to reflect and record it. You'll be glad you did. |
| Primary CTA | Let's Capture This Moment |
| Accent | #a78bfa |

**Capture form fields:**
1. Name Your Moment — required
2. Date It Happened — required
3. Time It Happened — required (NOT optional)
4. Why Was This Moment Important? — required
5. Did You Receive an Award or Recognition? — required Yes/No; if Yes → "What award?"
6. Anything Else You'd Like to Remember? — optional

**Engine-specific reflection messaging:**
- Business engines: "You've come a long way. Take a moment to appreciate what you've built and achieved."
- Life engine: "These are the moments that made you who you are. Take a moment and reflect."

**Reflection Banner:** Workspace owner only. Session-dismissible. Links to Major Moments radar.
**Auto-capture:** Silent background only — no prompts, no chips, no interruption.
**Visual:** Subtle scrapbook aesthetic within dark navy doctrine.

---

## AUTOMATION MODEL

Structured. Guided. Suggestive. Never intrusive.
- 2-3 suggestion chips max, appear at bottom of screen
- Disappear on navigation
- Never interrupt active workflow
- Template-based — not rule-builder

---

## BUILD WORKFLOW (How We Work)

1. Claude writes Lovable prompt
2. Paste into Lovable chat
3. Lovable builds
4. Take screenshots and share with Claude
5. Claude checks against canon → approves or writes fix
6. If approved → push to GitHub
7. Repeat

**Important rules:**
- Never let Lovable suggest its own builds — always use Claude-written prompts
- Never implement color changes without explicit canon approval
- Always push to GitHub after each approved phase or fix pass
- Canon files in `/docs` are the source of truth — not Lovable chat history

---

## GIT WORKFLOW

```
cd ~/Desktop/practiceflow-hub
git pull --no-rebase origin main
git add .
git commit -m "Description — date"
git push origin main
```

If conflicts:
```
git checkout --ours docs/[filename]
git add .
git commit -m "Resolve conflicts"
git push origin main
```

---

## KEY FILES IN CODEBASE

| File | Purpose |
|---|---|
| src/App.tsx | All routes — do not modify routing without Claude prompt |
| src/context/SessionContext.tsx | Session shape, demo users, device-mode detection |
| src/lib/routing.ts | Role → route mapping, onboarding gate |
| src/pages/dashboard/OwnerDashboard.tsx | Opening screen — stars, nebula, workspace cards |
| src/pages/dashboard/GroupPracticeDashboard.tsx | GP radar + 10 module cards |
| src/pages/dashboard/ClinicianDashboard.tsx | Phase 6 built ✅ |
| src/pages/dashboard/AdminDashboard.tsx | Phase 6 built ✅ |
| src/pages/dashboard/SupervisorDashboard.tsx | Phase 6 built ✅ |
| src/pages/dashboard/InternClinicalDashboard.tsx | Phase 6 built ✅ |
| src/pages/dashboard/InternBusinessDashboard.tsx | Phase 6 built ✅ |
| src/pages/dashboard/StaffDashboard.tsx | Phase 6 built ✅ |

---

## CANON FILES (Source of Truth)

All architectural decisions live in `/docs`:

| File | Contents |
|---|---|
| 02_GLOBAL_ARCHITECTURE.md | Engine philosophy, role system, boot sequence, Major Moments spec |
| 03_OPERATING_PROFILE_ENGINE.md | Onboarding, workspace naming, profile schema |
| 04_GROUP_PRACTICE_DOMAIN.md | GP modules, domain accents, GP-specific rules |
| 05_DEVELOPMENT_GOVERNANCE.md | Canon update protocol, structural integrity rules |
| 06_CURRENT_DEVELOPMENT_STATE.md | Phase status, full decision log (LOG-009 through LOG-067) |
| SF-BRAND.md | Visual doctrine, brand rules, color tokens |

**Canon rule:** Canon > Chat. Always. No architectural decision lives only in conversation.

---

## LOCKED COPY (Never Change Without Canon Update)

| Element | Copy |
|---|---|
| Boot loading state | "Preparing your workspace…" |
| Owner onboarding line 1 | "Where in your life do you need steady support right now?" |
| Owner onboarding line 2 | "Choose the areas you'd like help managing. We organize these as your hats." |
| Workspace orientation | "WHICH ROLE ARE YOU STEPPING INTO?" |
| Office Board subtitle | "Announcements, safety protocols & updates" |
| Major Moments CTA | "Let's Capture This Moment" |

---

## OUTSTANDING DECISIONS (Unsettled)

| ID | Topic | Status |
|---|---|---|
| LOG-039 | Thin executive layer above Radar (hat-level KPI summary) | Deferred to later features phase |
| LOG-066 | Light/Dark mode | Planned — deferred to client color review session |
| Radar gradient spec | Exact gradient treatment on signal cards | Approved but spec not yet documented — retrieve in future session |

---

## DESIGN SCOPE REFERENCE (Not Official — Marketing Consideration Only)

Entrepreneur types SympoFlo is designed to serve:
Group Practice, Coaching, Content Creator, Yoga Teacher, Outdoor Guide, Consultant, Freelancer, Home

This list is illustrative scope — not canon, not official, not limiting.

---

End of SESSION_CONTEXT.md
