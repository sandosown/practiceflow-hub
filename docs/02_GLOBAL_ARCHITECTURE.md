# 02 — Global Architecture
Derived from: PF-CANON.md
Version Timestamp: 03/07/2026 — Canon Rewrite Session
See CHANGELOG.md for full version history.

---

## Multi-Hat (Workspace) Model

The system supports multiple Workspaces (Domains/Hats).
Workspaces are user-selected during onboarding.
Group Practice is a first-class workspace but is NOT universally required.

**Built-in Workspaces:**
- GROUP_PRACTICE — first-class workspace, pre-selected on first load, user may deselect if Group Practice is not their domain
- COACHING — optional
- HOME — optional
- CUSTOM_1 — optional, Coming Soon (non-routable)
- CUSTOM_2 — optional, Coming Soon (non-routable)

**Custom workspace rules:**
- Stored in domains array
- Labeled via domain_labels
- Included in domain_priority ordering
- Rendered as "Coming Soon" tiles in Workspaces hub
- Non-clickable — no routing attached in V1
- Removable during onboarding
- Maximum 2 custom workspaces

---

## Identity → Mode → Workspace Layers

Runtime separation — three structurally independent layers:

1. **Identity** (Role) — who the user is
2. **Mode** (Control vs Action) — behavioral interface state
3. **Workspace** (Domain/Hat) — operating domain

Role and Workspace are explicitly different concepts and must never be treated as interchangeable.

**Macro architecture order:**
Identity → Mode → Workspace → Attention → Action

---

## Boot Sequence

Mode 0: Identity Gate

```
Authentication
→ Role Resolve
→ Mode Assignment
→ Workspace Load
→ Interface Render
```

Boot loading state must display: **"Preparing your workspace…"**
White screen during auth load is unacceptable. Loading state must be visible — never a silent null render.

**Session context must include:**
- user_id
- practice_id
- role
- intern_subtype (if applicable)
- clinician_subtype (if applicable)
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

**Tier 2 — Display Labels:** Configurable per workspace. Not locked in Canon.

### Clinician Subtypes
- **LICENSED** — full licensure, standard clinical routing
- **LP (Limited Permit)** — state-regulated compliance, routes to Compliance Engine

### Intern Subtypes
- **CLINICAL** — has caseload, routes to Training Engine, clinical supervision required
- **BUSINESS** — no caseload, operational staff only, routes to People Engine

### Critical Distinction
- Clinical Intern ≠ Limited Permit Therapist (LP)
- LP is a compliance classification on CLINICIAN — not an intern type
- Business Intern is an operational staff subtype — not clinical

### Permission Model
- Security model: deny by default
- Data-layer enforcement required. UI-only gating is insufficient and explicitly rejected.
- Escalation direction: upward via events only. Never downward.
- Single active role rule: the system handles one identity at a time.

---

## Mode System

### Control Mode
- Monitor → Prioritize → Assign → Verify
- Desktop-first orientation
- Attention layer appears before tools
- Dense multi-panel overview
- Strategic and clinical oversight behavior
- Must immediately answer: "What needs my attention right now?"
- No motivational or celebratory language

### Action Mode
- See → Do → Confirm → Done
- Mobile-first orientation
- Clarity over density
- Focused single-task layout
- Guided assistant experience

### Attention Layer (Control Mode)

Mandatory top section of all Control Mode dashboards.
Must answer: "What needs my attention right now?"
Information must appear before navigation tools.
Navigation cannot precede critical information in Control Mode.
No shared universal dashboard serving both modes.

**Canonical Attention Layer signals:**
- Clinicians missing credentials
- License expiring soon
- Unassigned referrals
- Onboarding stuck
- Discharge deadline approaching
- LP verification overdue

---

## Engine Architecture (Universal Infrastructure)

Engines are universal infrastructure. Workspaces are contextual containers.
Engine activation is configurable per workspace and can be enabled anytime.
Engine activation must trigger guided setup — no blank dashboards.

**Universal object fields rule:**
Every object in the system must store:
- `hat_id` (required)
- `engine_source` (required)

No floating objects are permitted. All objects are workspace-scoped and engine-attributed.

### V1 Engine Registry (8 Engines)

| # | Engine | Scope | Excluded in V1 |
|---|---|---|---|
| 1 | People Engine | Relational identity — Worker Profiles only | No CRM communication logs. Clients live under Operations, not People. |
| 2 | Operations Engine | Tasks, workflows, 3-phase event lifecycle, asset tracker, recurring logic (suggestive) | — |
| 3 | Revenue Engine | Income + lightweight expenses + simple profit snapshot | — |
| 4 | Growth Engine | Goals, KPIs, pipeline awareness (New → Contacted → Proposal → Won → Lost), marketing visibility | Strategy folded into Growth |
| 5 | Compliance Engine | Contracts, licenses, expiration tracking, LP compliance lifecycle | No risk scoring in V1 |
| 6 | Personal/Life Engine | Household ops + personal goals + lightweight health tracking | — |
| 7 | Document Control System | Centralized registry — cross-hat infrastructure, hat-isolated UX | No orphan documents |
| 8 | Training Engine | Clinical Intern lifecycle, supervision assignment, caseload tracking | Business Intern excluded |

### Engine Activation Matrix
Engine enablement is stored per-hat. Engine Activation Matrix governs engine-per-hat state.

### "Need a Tool?" Assist Panel
Available inside each workspace. Suggests enabling engines not currently active. User-controlled activation only. No AI guessing.

---

## Engine Scope Boundaries

- Clients live under Operations Engine — not People Engine
- People Engine = Worker Profiles only
- Strategy is folded into Growth Engine — no separate Strategy Engine
- No risk scoring in Compliance Engine (V1)
- No CRM communication logs in People Engine
- No POS logic in Operations Engine
- No barcode scanning in Asset Tracker (V1)

---

## Event Lifecycle (Operations Engine)

Pre-Event → During Event → Post-Event

Events are universal across workspaces.
Events are not calendar replacements.
Events are not projects.

- Event logging is append-only
- Cross-engine audit index required
- Audit index must be role-scoped
- Future engines require index mapping only — no redesign

---

## Asset & Product Tracker (Operations Engine)

- Lightweight SKU tracking
- Quantity tracking
- Reorder threshold
- Event-based reconciliation
- No POS logic
- No barcode scanning in V1

---

## Document Control System

Document metadata must include:
- `hat_id`
- `engine_source`
- `assigned_responsibility`
- `status`

Documents may link to objects OR live at workspace level.
No orphan documents allowed.
Cross-workspace infrastructure with workspace-isolated user experience.

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

## Compliance Constraint

HIPAA-level compliance is a required architectural constraint.

The following are NOT canonically locked:
- Multi-tenant SaaS assumption
- Marketplace/plugin ecosystem
- Stripe/scheduling as first-class V1 systems
- White-label SaaS intent

---

## Extensibility Rules

- Solo-to-multi-tier growth must not require redesign
- Do not build enterprise complexity prematurely
- Architecture must be scalable beyond current implementation
- Future engines require index mapping only

---

End of 02_GLOBAL_ARCHITECTURE.md
