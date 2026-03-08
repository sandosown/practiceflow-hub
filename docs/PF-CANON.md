# PracticeFlow Working Canon
Version Timestamp: 03/07/2026 — Session Rewrite  
Status: Authoritative Working Canon (Repo-Ready)

Future updates must be versioned and appended with a new Version Timestamp and Change Log entry. This document must not be overwritten without version increment. Canon > Chat. Always.

---

# 0. Canon Governance Rules

1. **Canon > Chat.** Architectural truth lives in repo documentation only. No architectural decision lives in conversation alone.
2. **No speculative expansion.** If not explicitly locked, it is not Canon.
3. **Reconciliation Rule.** When artifacts conflict, the most recent explicit lock governs.
4. **No obsolete platform references.** CodeSpring, CSV2, and legacy platform references are permanently removed.
5. **Structural Stability Rule.** Architecture does not collapse to match implementation limitations. If implementation conflicts with architecture — record it, resolve it, do not silently shrink scope.
6. **Scope containment is mandatory.** Do not expand scope beyond the node under review.
7. **Prefix Discipline:**
   - PF = Runtime / Architecture / Repo / System Canon
   - SF = Brand / Identity / Visual Governance
8. **Canon Update Protocol.** All updates must: add new Version Timestamp, add Change Log entry, reconcile contradictions, remove obsolete statements, preserve architectural intent. Canon must never be silently overwritten.

---

# 1. App Identity & Purpose

## Product Identity

PracticeFlow (PF) is the runtime and architectural system.
SympoFlo (SF) is the brand identity overlay.

**Architectural definition:**
A multi-workspace operating system for entrepreneurs who wear multiple hats.

**Brand definition:**
A Life-Role Operating System — structured support across every domain you operate in.

PracticeFlow is a Radar-based awareness and resolution system designed to provide a calm, structured command experience across selected domains.

**PracticeFlow tracks reality — not records.**

Core interaction loop:
Recognize → Tap → Understand → Act

It is a control center — not a traditional dashboard.
It must feel like an assistant — not a filing cabinet.

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
- A wellness or productivity app
- A replacement for SimplePractice or any EHR system

The system does not eliminate necessary work. It structures it.
Manual entry is required in therapist workflows. PracticeFlow enhances manual entry — it does not eliminate it.

---

## Who It Serves

**Primary:**
Entrepreneurs and operators running multiple domains (workspaces/hats).

**Secondary:**
Staff roles operating within scoped responsibilities. Staff must never be burdened by owner-only configuration flows.

---

## Emotional Objective

Non-negotiable outcome: **Calm Command Center**

- Structured
- High-signal
- Low anxiety
- No shame language
- No aggressive urgency styling
- Assistant-like support without loss of agency
- Operational, structured, high-signal interface character

Outside the app: command attention.
Inside the app: calm structured support begins.

---

# 2. Core System Philosophy

## Radar Model

Radar is the awareness layer.

Radar must:
- Surface only actionable signals
- Avoid becoming a browsing surface
- Remain calm and scannable
- Keep modules visible even when empty
- Avoid dominant hero modules
- Avoid red-first urgency styling
- Never expose a global task list on open

**Radar is role-scoped. There is no global radar across all roles.**

Radar answers three questions:
1. What needs my attention right now?
2. Who is stuck?
3. What is entering the practice?

Radar density preference is selected by the owner during onboarding.

---

## Resolution Model

Radar routes into Resolution Surfaces.

Resolution Surfaces:
- Minimize browsing
- Minimize branching
- Confirm completion
- Return user to Radar

**Radar does not solve. It routes.**

Resolution pattern: Tap → guided flow → resolve → return. No deep browsing.

---

## Structural Stability Rule

Architecture does not collapse to match implementation limitations.

If implementation conflicts with architecture:
- Record it.
- Resolve it.
- Do not silently shrink scope.

The current implementation role model (OWNER / THERAPIST / INTERN) is a collapsed snapshot — not the architectural ceiling. Architecture must not be reduced to match it.

---

## Domain Isolation Principle

Workspaces are isolated.

- No cross-workspace UI bleed.
- No cross-domain operational contamination.
- Containment is a structural integrity rule.
- Engines operate per-hat context.
- Users only see data belonging to the active hat.

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

Alert philosophy: border-emphasis, not full-bleed color blocks. Early warning, gradual escalation, no punitive tone.

---

## Permission Model

- **Deny-by-default** permission policy enforced.
- Data-layer enforcement required — UI-only gating is explicitly rejected.
- Escalate upward via events, never downward.
- Single active role rule: the system handles one identity at a time. No mental context mixing across roles.

---

## Interruptible Workflows Rule

No workflow may lose partial progress. All multi-step flows must support interruption and resumption without data loss. This applies universally across all modules and engines.

---

# 3. Global Architecture

## Multi-Hat (Workspace) Model

The system supports multiple Workspaces (Domains/Hats).

Workspaces are user-selected during onboarding.

GROUP_PRACTICE is a first-class workspace but is NOT universally required.

**Built-in Workspaces:**
- GROUP_PRACTICE — first-class workspace, pre-selected on first load, user may deselect if Group Practice is not their domain
- COACHING — optional
- HOME — optional
- CUSTOM_1 — optional, Coming Soon (non-routable)
- CUSTOM_2 — optional, Coming Soon (non-routable)

Custom workspaces are stored in the domains array, labeled via domain_labels, included in domain_priority ordering, rendered as "Coming Soon" tiles, and are non-clickable. Maximum 2 custom workspaces.

---

## Identity → Mode → Workspace Layers

Runtime separation:

1. **Identity** (Role) — who the user is
2. **Mode** (Control vs Action) — behavioral interface state
3. **Workspace** (Domain/Hat) — operating domain

These must remain structurally independent. Role and Workspace are not interchangeable concepts.

**Macro architecture order:**
Identity → Mode → Workspace → Attention → Action

---

## Boot Sequence

Mode 0: Identity Gate

Authentication
→ Role Resolve
→ Mode Assignment
→ Workspace Load
→ Interface Render

Boot loading state must display: **"Preparing your workspace…"**
White screen during auth load is unacceptable. Loading state must be visible — never a silent null render.

Session context must include:
- user_id
- practice_id
- role
- mode (CONTROL | ACTION)
- visibility_scope
- workflow_scope

---

## Role System

### Two-Tier Role Model

**Tier 1 — System Roles** (Canon-locked, drive routing and access):

| System Role | Description |
|---|---|
| OWNER | CEO / Owner — full system visibility |
| ADMIN | Admin / Management — operational oversight |
| SUPERVISOR | Clinical supervision authority |
| CLINICIAN | Licensed therapist — has caseload |
| INTERN | Clinical or Business subtype |
| STAFF | Non-clinical operational staff |

**Tier 2 — Display Labels** (configurable per workspace, not locked in Canon)

### Clinician Subtypes
- **LICENSED** — full licensure
- **LP (Limited Permit)** — state-regulated, routes to Compliance Engine

### Intern Subtypes
- **CLINICAL** — has caseload, routes to Training Engine
- **BUSINESS** — no caseload, operational staff only, routes to People Engine

**Critical distinction:**
- Clinical Intern ≠ Limited Permit Therapist (LP)
- LP is a compliance classification on CLINICIAN — not an intern type
- Business Intern is an operational staff subtype — not clinical

---

## Mode System

### Control Mode
- Monitor → Prioritize → Assign → Verify
- Desktop-first orientation
- Attention layer appears before tools
- Dense multi-panel overview
- Strategic and clinical oversight behavior

### Action Mode
- See → Do → Confirm → Done
- Mobile-first orientation
- Focused single-task layout
- Clarity over density
- Operational and execution behavior

**Behavioral Guidance Rule:**
The app's behavioral personality is determined automatically by Role + Mode combination. Interface density, language, hierarchy, and focus adjust based on who is logged in and what mode they are in. Users do not select cognitive modes — the system determines them.

**Control Dashboard structural rule:**
Information (Attention Layer) must appear before navigation tools.
The Control Dashboard must immediately answer: "What needs my attention right now?"

**Attention Layer canonical examples:**
- Clinicians missing credentials
- License expiring soon
- Unassigned referrals
- Onboarding stuck

Navigation cannot precede critical information in Control Mode.
No shared universal dashboard serving both modes.

---

## Engine Architecture (Universal Infrastructure)

Engines are universal infrastructure. Workspaces are contextual containers.

Every object in the system must store:
- `hat_id` (required)
- `engine_source` (required)

No floating objects are permitted. All objects are workspace-scoped and engine-attributed.

### V1 Engine Registry

| # | Engine | Scope | Excluded in V1 |
|---|---|---|---|
| 1 | People Engine | Relational identity — Worker Profiles only | No CRM communication logs. Clients live under Operations, not People. |
| 2 | Operations Engine | Tasks, workflows, 3-phase event lifecycle, asset tracker, recurring logic (suggestive) | — |
| 3 | Revenue Engine | Income + lightweight expenses + simple profit snapshot | — |
| 4 | Growth Engine | Goals, KPIs, pipeline awareness (New/Contacted/Proposal/Won/Lost), marketing visibility | Strategy folded into Growth |
| 5 | Compliance Engine | Contracts, licenses, expiration tracking, LP compliance lifecycle | No risk scoring in V1 |
| 6 | Personal/Life Engine | Household ops + personal goals + lightweight health tracking | — |
| 7 | Document Control System | Centralized registry — cross-hat infrastructure, hat-isolated UX | No orphan documents |
| 8 | Training Engine | Clinical Intern lifecycle, supervision assignment, caseload tracking | Business Intern excluded |

Engine activation must trigger guided setup. No blank dashboards.

Engine enablement is stored per-hat (Engine Activation Matrix governs engine-per-hat state).

**"Need a Tool?" Assist Panel:**
Available inside each Hat. Suggests enabling engines not currently active. User-controlled activation only. No AI guessing.

---

## Event Lifecycle (Operations Engine)

Pre-Event → During Event → Post-Event

Events are not calendars. Events are not projects. Events are universal across hats.

**Event logging is append-only.**
Cross-engine audit index required. Audit index must be role-scoped.
Future engines require index mapping only — no redesign.

---

## Asset & Product Tracker (Operations Engine)

- Lightweight SKU
- Quantity tracking
- Reorder threshold
- Event-based reconciliation
- No POS logic
- No barcode scanning in V1

---

## Automation Model

Automation is: Structured. Guided. Suggestive.

Never:
- Intrusive
- Modal-heavy
- Auto-flooding
- Agency-removing
- Forced popup confirmation

**Suggestion chips:**
- Maximum 2–3 chips displayed contextually
- Disappear on navigation
- Template-based — not rule-builder
- User always remains in control

**Recurring logic:** Supported in V1 via suggestive prompts only.

---

## Document Control System

Document metadata must include:
- `hat_id`
- `engine_source`
- `assigned_responsibility`
- `status`

Documents may link to objects OR live at Hat level. No orphan documents allowed.

---

## Compliance Constraint

HIPAA-level compliance is a required architectural constraint.

The following are NOT canonically locked:
- Multi-tenant SaaS assumption
- Marketplace/plugin ecosystem
- Stripe/scheduling as first-class V1 systems
- White-label SaaS intent

---

## Solo-to-Multi-Tier Growth Rule

The system must support growth from solo operator to multi-tier organization without requiring architectural redesign. Do not build enterprise complexity prematurely.

---

# 4. Operating Profile Engine

## Purpose

Owner-only configuration layer.

Stores:
- Workspace selection
- Workspace priority
- Notification intensity
- Radar density preference
- Onboarding completion

Influences interpretation without mutating structure.

---

## Owner vs Staff Rules

- Operating Profile is owner-only.
- Staff never see onboarding.
- Staff never depend on owner configuration logic.
- Staff routing is independent of Operating Profile state.

---

## Onboarding Model

### Owner Onboarding Wizard — 3-Step Flow

**Step 1 — Workspace Selection**
Card-based toggles. GROUP_PRACTICE is pre-selected but may be deselected if not applicable to the user's domain.

**Step 2 — Workspace Priority Ordering**
Explicit up/down movement ordering.

**Step 3 — Notification Intensity Selection**
LOW / MEDIUM / HIGH selection.

**Onboarding emotional tone (locked copy):**
- "Where in your life do you need steady support right now?"
- "Choose the areas you'd like help managing. We organize these as your hats."

### Onboarding State Machine

The State Machine governs system-level boot completion — not user-visible wizard steps. These operate at different layers.

**System layer (backend completion contract):**
```
HAT_SELECTION
→ ENGINE_CONFIGURATION
→ ROLE_INITIALIZATION
→ RADAR_CONFIGURATION
→ INVITE_STAGING
→ ACTIVATION_COMPLETE
```

**Owner-facing layer (wizard UI):**
3-step wizard (see above). The wizard drives HAT_SELECTION and RADAR_CONFIGURATION states. ENGINE_CONFIGURATION, ROLE_INITIALIZATION, and INVITE_STAGING are system-resolved — not user-facing steps.

No dashboard release before ACTIVATION_COMPLETE.
Role context must initialize before first dashboard load.
Radar must not emit signals before activation is complete.

### First Login Behavior
- Ask which workspaces user operates.
- Store in profile.
- Do not re-ask during normal workflow.

### Returning Login Behavior
- Load last-used workspace automatically.

### Configuration Isolation Rule
Onboarding and configuration flows must never appear during normal daily workflow. Configuration is profile-stored and settings-editable only.

---

## Profile Schema

**Canon-locked fields:**
```
workspaces (array)
domain_priority (ordered array)
domain_labels (record)
notifications_pref: LOW | MEDIUM | HIGH
radar_density_pref
onboarding_complete: boolean
```

**Pre-Canon fields (present in codebase — pending architectural reconciliation):**
```
practice_mode (solo | group)
uses_referrals (boolean)
has_staff (boolean)
has_interns (boolean)
notification_style (realtime | daily_digest)
```
These fields exist in the current implementation. They are not yet formally reconciled into Canon architecture. They must not be removed without a Canon Update Protocol entry. Reconciliation is a future governance task.

---

## Radar Interpretation Influence

Owner profile may influence:
- Weight scaling
- Escalation sensitivity
- Reminder timing
- Drift detection sensitivity
- Radar density

Profile may NOT:
- Alter structural layout
- Override containment rules
- Break role/mode gating
- Mutate engine structure

---

## Drift / Stress Detection

Owner-only tracking:
- Ignored items counter
- View relief logic
- Neglected high-impact surfacing

Purpose: Correct avoidance patterns without creating anxiety.

---

## Notification Intensity

LOW / MEDIUM / HIGH

Adjusts:
- Reminder cadence
- Escalation intervals
- Treatment plan prompts
- Supervision alerts

Never intrusive.

---

## Persistence

- Local storage (demo / no session)
- DB-backed (authenticated session)

Automatic migration merges old localStorage profiles with DEFAULT_VALUES. No manual clearing required.

---

# 5. Group Practice Domain

## Domain Scope

First-class workspace. Exemplar implementation of PF structure.

**Sub-Engines in Group Practice:**
- PeopleHub (Worker Profiles)
- Operations (Clients, Caseload, Events)
- Referral Engine
- Compliance Engine (LP)
- Training Engine (Clinical Intern)
- Office Board (Communications)

---

## Control Surface Structure

- Destination control surface
- Equal-weight modules
- 2–3 column grid
- Large tap targets
- Visible empty states
- No dominant hero modules

---

## Canonical Modules

1. Charts Requiring Action
2. Office Board (formerly Comms)
3. Management Center
4. Client Database
5. Caseload Integration
6. Treatment Plan Tracker
7. Supervision Structure
8. Insurance Database
9. Vendor Database

---

## People Engine — Group Practice

People Engine = Worker Profiles only.
Clients live under Operations Engine — not People Engine.

---

## Worker Profile Wizard (Employee Onboarding)

A structured questionnaire — not loose profile tabs. Sections are questions being answered, not navigational browsing tabs.

### Wizard Sections (locked)
1. Basics
2. Credentials
3. Address
4. Preferred Populations
5. Presenting Issues
6. Clinical Disorders
7. Specialty Areas / Treatment Modalities

### Credentials Structure
- License Type (multiple — repeatable license cards)
- License Number
- License State
- Expiration Date
- Status
- CAQH #
- NPI #

### Multi-select UI Patterns
- Preferred Populations → Chips
- Presenting Issues → Checklist
- Clinical Disorders → Checklist
- Specialty Areas / Modalities → Checklist

### EAP Classification
EAP lives inside Specialty Areas / Treatment Modalities — not as a presenting issue.

### Save Draft Rule
Save Draft is mandatory. Must persist partial progress and allow resumption without data loss.

### Role Scoping
- Owner sees all profile fields
- Employee sees only their own permitted fields

---

## Tag Taxonomy

Four tag categories — locked:

| Category | Referral Matching Weight |
|---|---|
| PRESENTING ISSUE | +3 |
| POPULATION | +2 |
| DISORDER | +2 |
| SPECIALTY / MODALITY | +1 |
| Missing required EAP | Exclude therapist |

---

## Upload to Autofill

**Placement:** Button appears at the START of onboarding (Basics screen). Not a tab. Not global. Not a separate import page.

**Accepted formats:** PDF, DOC/DOCX, CSV, XLS/XLSX, TXT

**Flow:**
Upload → Extract → Hydrate draft → Review & Confirm → Write into draft → Return to wizard

**Unified data pipeline:**
```
Manual:   UI → form_state → validation → save → DB
Autofill: file → extraction → draft_answers → form_state → validation → save → DB
```

Both paths feed the same pipeline. Questionnaire is single source of truth until submission.

**Extraction output shape:**
- answers (key/value)
- repeatables (licenses/tags)
- confidence per field
- filename + file_url

Low-confidence fields must be visually highlighted for user review.

**Rules:**
- Never blocks manual entry
- No direct record creation from upload
- No background import jobs creating employees
- No silent DB writes — confirmation required before any DB write
- Upload hydrates questionnaire draft state only

**V1 Visibility:** Behind feature flag. Disabled by default at launch. Enabled per account when extraction quality is validated.

**Future categories (architected for):** Employees, Clients, Vendors, Insurance Companies.

---

## Referral Matching Logic (V1)

- Minimum 1 overlapping tag qualifies a therapist
- Ranking based on weighted tag overlap (see Tag Taxonomy)
- No auto-assignment in V1 — recommendation only
- If no match: display "Add more details to see recommendations"
- No alert-style urgency in matching
- Recommendations are assistive, never controlling

---

## Client Status Lifecycle

```
ACTIVE
→ PENDING_TRANSFER
→ PENDING_TERMINATION
→ DISCHARGED
→ ARCHIVED
```

Archive = status-based, never delete. "Delete Client" language must never be exposed in UI.
Archived clients are searchable under Archive filter.
Archived rows visually grayed out.
Reactivation = Admin only, requires therapist reassignment.

---

## Therapist Profile — Capacity Fields

- `capacity_max`
- `capacity_current` (recommended computed from ACTIVE assignments)
- `availability_status`: AVAILABLE | AT_CAPACITY | ON_LEAVE

**Capacity Rule:**
Therapist eligible only if `availability_status = AVAILABLE` AND `active_caseload_count < capacity_max`.

**Override Rule:**
Admin may override capacity block. Override requires reason entry.

---

## Assignment History Table (Required)

| Field | Description |
|---|---|
| assignment_id | Unique ID |
| client_id | Client reference |
| therapist_id | Therapist reference |
| status | ACTIVE / ENDED / TRANSFERRED |
| start_date | Assignment start |
| end_date | Assignment end |
| end_reason | Reason for ending |
| created_by | Who created the assignment |

Prevents loss of historical therapist relationships. Atomic reassignment rule enforced — no client may exist without an active assignment.

---

## Termination Request Table (Required)

| Field | Description |
|---|---|
| request_id | Unique ID |
| client_id | Client reference |
| therapist_id | Therapist reference |
| supervisor_id | Supervisor reference |
| termination_date | Requested termination date |
| reason_category | Dropdown reason |
| reason_detail | Free text for "Other" |
| status | DRAFT / SUBMITTED / APPROVED / DENIED / COMPLETED / OVERDUE |
| denial_reason | Required if denied |
| discharge_due_date | approval_date + 3 days (system-generated) |
| discharge_status | UNDER_DISCUSSION / COMPLETED / NOT_COMPLETED_YET |
| discharge_not_completed_reason | Required if not completed |

**Termination Reason Categories (locked):**
- Client requested new therapist
- Client no longer requires services
- Client non-adherent / repeated no-shows
- Insurance / financial
- Higher level of care needed
- Other (requires text entry)

**3-Day Discharge Rule:**
Discharge deadline = approval_date + 3 days (system-generated).
Overdue status auto-triggered after due date.
Reminder sent to therapist. Alert sent to supervisor.

---

## Transfer Request Table (Required)

| Field | Description |
|---|---|
| transfer_id | Unique ID |
| client_id | Client reference |
| from_therapist_id | Current therapist |
| to_therapist_id | Receiving therapist |
| initiated_by | Who initiated |
| status | DRAFT / SUBMITTED / CONFIRMED / COMPLETED / CANCELED |
| match_score | Optional weighted match summary |
| notes | Transfer notes |

---

## Permission Boundaries — Group Practice

| Role | Permissions |
|---|---|
| Therapist/Clinician | Request termination, update discharge status only |
| Supervisor | Approve/deny termination requests |
| Admin/Owner | Reassign clients, override capacity, archive/reactivate |

**UI Placement:**
- Reassign: Client Database → Client Profile → Actions
- Termination: Therapist Caseload view
- Supervisor approval: Supervisor inbox (approval control node)

---

## Audit Trail

Audit trail required for all workflow transitions. Assignment history is the permanent record. Verified records are immutable — audit lock enforced.

---

## LP Compliance Subsystem (Compliance Engine)

Full LP system architecture is defined and flagged for implementation. Key principles locked:

- LP Tracking lives in the Compliance Engine — not in the Training Engine or People Engine
- LP awareness surfaces in Radar — routes only, never edits in Radar
- Official compliance record = weekly log only
- Daily Quick Log = draft only, does not count toward eligibility
- Hours count only after Supervisor Verification
- Verified weeks are immutable — audit locked
- State-aware rule engine required — no hardcoded hour requirements
- Compliance Lockdown Flag = warning-first model, not hard block in V1

**Weekly lifecycle:**
```
Draft → Submitted → Pending Verification → Verified (locked)
```

Compliance metrics computed from VERIFIED weeks only.

**Core outputs:** Weekly Log Report, Supervisor Verification Summary, Therapist Progress Transcript, Board/Eligibility Packet, Admin Compliance Audit Report.

---

## Training Engine — Group Practice

Manages Clinical Intern lifecycle:
- Supervision assignment
- Caseload tracking
- Connects to Compliance Engine when Clinical Intern transitions to LP status

Business Intern does not route to Training Engine.

---

# 6. SF Brand Governance

All SF brand governance decisions live in **SF-BRAND.md**.

See `SF-BRAND.md` in `/docs` for:
- App icon specifications (SF-LOGO-001)
- Wordmark direction
- Brand build sequence
- Theme system (dark/light)
- UI archetypes (Hat Card / Operational Panel)
- Visual anti-patterns
- Token discipline
- Implementation discipline
- Interface character rules

**Summary rule:** PF-CANON.md owns architecture and system behavior. SF-BRAND.md owns all visual, identity, and brand decisions. When brand and architecture conflict, architecture governs. When the conflict is visual-only, SF-BRAND.md governs.

---

# 7. Development Governance

## Canon Update Protocol

All updates must:
1. Add new Version Timestamp
2. Add Change Log entry
3. Reconcile contradictions
4. Remove obsolete statements
5. Preserve architectural intent

Canon must never be silently overwritten.

---

## Governance Principles

- Canon > Chat. Always.
- No architectural decisions live only in conversation.
- Scope containment is mandatory.
- Domain isolation must be preserved.
- Emotional objective (Calm Command Center) must never be compromised.
- Any UI behavior contradicting architecture must be recorded before continuing development.

---

## Structural Integrity Rules

- Identity → Mode → Workspace separation must remain intact.
- Workspaces must not bleed into each other.
- Engines remain universal infrastructure.
- Automation must remain suggestive, not intrusive.
- No dead-end screens. Every nested navigation must include back navigation.
- Configuration flows must never appear during normal daily workflow.

---

## Feature Readiness Rule

Before any feature is built, it must answer:
1. Which Mode does it belong to?
2. Does it appear differently in Control vs Action Mode?
3. Does it require workspace scoping?
4. Does it surface in the Attention Layer?

---

## Documentation Discipline

- All architectural decisions must live in `/docs`.
- All Canon updates must be versioned.
- No legacy platform references (CodeSpring, CSV2) may be reintroduced.
- Prefix discipline must be maintained: PF / SF.

---

## Git Workflow

- `main` = stable branch
- Feature work requires new branch from main
- Feature branches merged into main via PR
- Each fix must be completed and verified before moving to the next
- Commit message discipline required — explicit fix naming
- Surgical patch strategy favored over broad rewrites

---

# 8. Current Development State

Version Reference: 03/07/2026 — Canon Rewrite Session

## Implemented

- Owner Operating Profile framework
- Workspace hub naming and gating logic
- Group Practice control surface structural direction
- SympoFlo brand identity lock
- Canon governance structure
- Documentation split architecture
- Worker Profile Wizard (partial)
- Upload to Autofill (scaffolding — extraction not yet live)
- Client Transfer + Termination (architecture defined, implementation in progress)
- Auth system (Supabase-backed)
- Role-based routing (3-role implementation snapshot)

## Structurally Defined but Pending

- Full Radar weighting integration
- Settings-based workspace reconfiguration
- Full Management Center expansion
- Complete referral matching UI
- Full employee onboarding system wiring (expanded 7-tab structure)
- Advanced drift detection calibration
- Mode system (CONTROL / ACTION) full implementation
- Session context completion (practice_id, mode, visibility_scope, workflow_scope)
- 6-role system expansion (currently 3-role snapshot)
- Training Engine implementation
- LP Compliance subsystem implementation
- domain_priority → Radar integration
- Onboarding State Machine completion gate
- Upload to Autofill extraction engine
- Pre-Canon profile schema fields reconciliation (practice_mode, uses_referrals, has_staff, has_interns, notification_style)

## Active Architectural Constraints

- Identity → Mode → Workspace separation
- Domain isolation enforcement
- Suggestive automation only
- No red-first urgency styling
- No persistent decorative glow
- No structural mutation via Operating Profile
- Deny-by-default permission policy
- No dead-end screens — every nested navigation must include back navigation
- Interruptible workflows — no partial progress loss
- No global radar across roles
- hat_id + engine_source required on all objects
- No client permanent deletion — archive only
- No auto-assignment of clinicians
- No silent DB writes from file upload
- HIPAA-level compliance throughout Group Practice domain

## Rename Decisions (Locked — Pending Code Implementation)

| Old Name | New Canon Name |
|---|---|
| Role Hub | Workspaces |
| "Select a role to get started" | "Choose a workspace" |
| Group Practice Radar | Group Practice Dashboard |
| Comms | Office Board |

## Future development must extend — not alter — structural foundations.

See `CHANGELOG.md` for full version history.

---

End of PF-CANON.md
