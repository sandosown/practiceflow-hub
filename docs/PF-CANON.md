# PracticeFlow Working Canon  
Version Timestamp: 03/02/2026 — 10:00 AM EST  
Status: Authoritative Working Canon (Repo-Ready)

Future updates must be versioned and appended with a new Version Timestamp and Change Log. This document must not be overwritten without version increment.

---

# 0. Canon Governance Rules

1. Canon > Chat. Architectural truth lives in repo documentation.
2. No speculative expansion. If not explicitly locked, it is not canon.
3. Reconciliation Rule: When artifacts conflict, the most recent explicit lock governs.
4. No obsolete platform references remain in Canon.
5. Extraction archives are immutable. Consolidation happens only in Canon files.
6. Prefix Discipline:
   - PF = Runtime / Architecture / Repo / System Canon
   - SF = Brand / Identity / Visual Governance
   - PH = Retired (Do not use)

---

# 1. App Identity & Purpose

## Product Identity

PracticeFlow (PF) is the runtime and architectural system.  
SympoFlo (SF) is the brand identity overlay.

The product is a multi-workspace operating system for entrepreneurs who wear multiple hats.

It is a Radar-based awareness and resolution system designed to provide a calm, structured command experience across selected domains.

Core loop:
Recognize → Tap → Understand → Act

It is a control center — not a traditional dashboard.

---

## What PracticeFlow Is Not

PracticeFlow is NOT:

- A task manager
- A CRM
- An EHR
- A calendar replacement
- A messaging platform
- A POS system
- A red-alert urgency dashboard
- An intrusive notification-first system

The system does not eliminate necessary work.
It structures it.

---

## Who It Serves

Primary:
Entrepreneurs/operators running multiple domains (workspaces/hats).

Secondary:
Staff roles operating within scoped responsibilities.
Staff must never be burdened by owner-only configuration flows.

---

## Emotional Objective

Non-negotiable outcome: Calm Command Center

- Structured
- High-signal
- Low anxiety
- No shame language
- No aggressive urgency styling
- Assistant-like support without loss of agency

---

# 2. Core System Philosophy

## Radar Model

Radar is the awareness layer.

It must:

- Surface only actionable signals
- Avoid becoming a browsing surface
- Remain calm and scannable
- Keep modules visible even when empty
- Avoid dominant hero modules
- Avoid red-first urgency styling

---

## Resolution Model

Radar routes into Resolution Surfaces.

Resolution Surfaces:

- Minimize browsing
- Minimize branching
- Confirm completion
- Return user to Radar

Radar does not solve.
It routes.

---

## Structural Stability Rule

Architecture does not collapse to match implementation limitations.

If implementation conflicts with architecture:
- Record it.
- Resolve it.
- Do not silently shrink scope.

---

## Domain Isolation Principle

Workspaces are isolated.

- No cross-workspace UI bleed.
- No cross-domain operational contamination.
- Containment is a structural integrity rule.

---

## Urgency vs Layout

Urgency lives in:

- Data state
- Queues
- Routing

Urgency does NOT live in:

- Aggressive red layouts
- Visual panic signals
- Overwhelming density

---

# 3. Global Architecture

## Multi-Hat (Workspace) Model

The system supports multiple Workspaces (Domains/Hats).

Workspaces are user-selected during onboarding.

Group Practice is a first-class workspace but is NOT universally required.

---

## Identity → Mode → Workspace Layers

Runtime separation:

1. Identity (Role)
2. Mode (Control vs Action)
3. Workspace (Domain/Hat)

These must remain structurally independent.

---

## Boot Sequence

Mode 0: Identity Gate

Authentication  
→ Role Resolve  
→ Mode Assignment  
→ Workspace Load  
→ Interface Render

Session context must include:

- user_id
- practice_id
- role
- mode (CONTROL | ACTION)
- visibility_scope
- workflow_scope

---

## Mode System

### Control Mode

- Monitor
- Prioritize
- Assign
- Verify

Desktop-first orientation.  
Attention layer appears before tools.

### Action Mode

- See
- Do
- Confirm
- Done

Mobile-first orientation.  
Clarity > density.

---

## Engine Architecture (Universal Infrastructure)

Engines are universal.  
Workspaces are contextual containers.

V1 Engines:

1. People Engine — relational identity only  
2. Operations Engine — workflows + event lifecycle + asset tracker  
3. Revenue Engine — income + lightweight expenses  
4. Growth Engine — KPIs + pipeline awareness  
5. Compliance Engine — contracts + expiration tracking  
6. Personal/Life Engine — household + goals  
7. Document Control System — centralized registry  

Engine activation must trigger guided setup.  
No blank dashboards.

---

## Event Lifecycle (Operations Engine)

Pre-Event  
During Event  
Post-Event  

Events are not calendars.  
Events are not projects.

---

## Automation Model

Automation is:

Structured  
Guided  
Suggestive  

Never:

- Intrusive
- Modal-heavy
- Auto-flooding
- Agency-removing

---

## Compliance Constraint

HIPAA-level compliance is a required architectural constraint.

The following are NOT canonically locked:

- Multi-tenant SaaS assumption
- Marketplace/plugin ecosystem
- Stripe/scheduling as first-class V1 systems
- White-label SaaS intent

---

# 4. Operating Profile Engine

## Purpose

Owner-only configuration layer.

Stores:

- Workspace selection
- Workspace priority
- Notification intensity
- Onboarding completion

Influences interpretation without mutating structure.

---

## Owner vs Staff Rules

- Operating Profile is owner-only.
- Staff never see onboarding.
- Staff never depend on owner configuration logic.

---

## Onboarding Model

First login:

- Ask which workspaces user operates.
- Store selection.
- Do not re-ask during normal workflow.

Returning login:

- Load last-used workspace.

---

## Profile Schema

- workspaces
- domain_priority
- domain_labels
- notifications_pref (LOW | MEDIUM | HIGH)
- onboarding_complete = true

---

## Radar Interpretation Influence

Owner profile may influence:

- Weight scaling
- Escalation sensitivity
- Reminder timing
- Drift detection sensitivity

Profile may NOT:

- Alter structural layout
- Override containment rules
- Break role/mode gating

---

## Drift / Stress Detection

Owner-only tracking:

- Ignored items counter
- View relief logic
- Neglected high-impact surfacing

Purpose:
Correct avoidance patterns without creating anxiety.

---

## Notification Intensity

LOW  
MEDIUM  
HIGH  

Adjusts:

- Reminder cadence
- Escalation intervals
- Treatment plan prompts
- Supervision alerts

Never intrusive.

---

## Persistence

- Local storage (demo)
- DB-backed (authenticated)

---

# 5. Group Practice Domain

## Domain Scope

First-class workspace.  
Exemplar implementation of PF structure.

---

## Control Surface Structure

- Destination control surface
- Equal-weight modules
- 2–3 column grid
- Large tap targets
- Visible empty states

---

## Canonical Modules

- Charts Requiring Action
- Office Board
- Management Center
- Client Database
- Caseload Integration
- Treatment Plan Tracker
- Supervision Structure
- Insurance Database
- Vendor Database

---

## Client Transfer & Termination

Status lifecycle:

ACTIVE  
PENDING_TRANSFER  
PENDING_TERMINATION  
DISCHARGED  
ARCHIVED  

Archive = status-based, not delete.  
Atomic reassignment rule enforced.  
Audit trail required.  
Matching logic = recommendation-only (V1).

---

## Employee Onboarding System

Worker Profile Wizard includes:

- Basics
- Credentials
- Address
- Structured multi-select inputs
- Save Draft without data loss

Database persistence required.

---

## Upload to Autofill

Located in Basics step.

Accepted:

- PDF
- DOC/DOCX
- CSV
- XLS/XLSX
- TXT

Flow:

Upload  
→ Parse  
→ Review & Confirm  
→ Write into draft  
→ Return to wizard  

Never blocks manual entry.

---

## Referral Matching Logic (V1)

- At least one overlapping tag qualifies.
- Ranking is weighted overlap.
- No auto-assignment.

Recommendation-only.

---

# 6. Development Governance

## Canon Update Protocol

All updates must:

1. Add new Version Timestamp
2. Add Change Log
3. Reconcile contradictions
4. Remove obsolete statements

---

## Governance Principles

- No architectural decisions live only in chat.
- Scope containment is mandatory.
- Domain isolation preserved.
- Calm command center objective never sacrificed.

---

# 7. Current Development State

## Implemented

- Owner Operating Profile framework
- Workspaces hub naming + gating logic
- Group Practice control surface direction
- SympoFlo brand identity lock

---

## Structurally Defined but Pending

- Full radar weighting integration
- Settings-based workspace reconfiguration
- Full Management Center expansion
- Full referral matching UI
- Complete employee onboarding wiring

---

## Active Constraints

- Identity → Mode → Workspace separation
- Domain isolation
- Suggestive automation only
- No red urgency styling
- No decorative constant glow

---

End of Document.
