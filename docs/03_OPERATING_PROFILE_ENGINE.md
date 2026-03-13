| [← 02 — Global Architecture](02_GLOBAL_ARCHITECTURE.md) | [📚 Index](README.md) | [04 — Group Practice Domain →](04_GROUP_PRACTICE_DOMAIN.md) |
|---|---|---|

---

# 03 — Operating Profile Engine
Derived from: PF-CANON.md
Version Timestamp: 03/13/2026 — Owner Active Workload Flag Update (previously 03/08/2026 — Engine Philosophy + Workspace Naming Canon Update)
See CHANGELOG.md for full version history.

---

## Purpose

Owner-only configuration layer.

Stores:
- Workspace selection
- Workspace names (company/context names entered by owner)
- Workspace logo (per workspace)
- Workspace priority
- Notification intensity
- Radar density preference
- Onboarding completion

Influences interpretation without mutating structure.
Configuration flows must never appear during normal daily workflow.

---

## Owner vs Staff Rules

- Operating Profile is owner-only.
- Staff never see onboarding.
- Staff never depend on owner configuration logic.
- Staff routing is independent of Operating Profile state.

---

## Workspace Naming (Canon-Locked)

The owner names each workspace to reflect their actual company or life context.
Default labels are fallbacks only — they are never the final intended experience.

**Naming rules:**
- Owner enters a company/context name per workspace during onboarding (optional at that step)
- Name can be entered or changed anytime in Settings
- Employees see the actual company name, not the default category label
- Default label (e.g. "Group Practice", "Coaching", "Home") shows until a name is entered
- No locks — names are always editable

**Logo rules:**
- Owner may upload a logo per workspace during onboarding or in Settings
- Logo appears on the workspace card on the opening Owner dashboard alongside the company name
- Logo is optional — if none uploaded, the "S" placeholder renders as fallback
- No logo size restrictions locked in V1 (to be defined in SF-BRAND.md)

**Why this matters:**
No entrepreneur wants to log in and see "Group Practice" — they want to see "Good Health LLC."
This is a core expression of the personal assistant philosophy: the system knows who you are.

---

## Onboarding Model

### Owner Onboarding Emotional Tone (Locked Copy)
- "Where in your life do you need steady support right now?"
- "Choose the areas you'd like help managing. We organize these as your hats."

### Owner Onboarding Wizard — 3-Step Flow

**Step 1 — Workspace Selection**
Card-based toggles. GROUP_PRACTICE is pre-selected but may be deselected if not applicable.
Each workspace card includes an optional field: "What do you call this? (optional)" — owner may name it now or later.

**Step 2 — Workspace Priority Ordering**
Explicit up/down movement ordering.

**Step 3 — Notification Intensity Selection**
LOW / MEDIUM / HIGH selection.

Custom workspaces limited to maximum of 2.
Onboarding configuration is profile-stored and settings-editable only.

### Onboarding State Machine

The State Machine governs system-level boot completion — not user-visible wizard steps.

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
3-step wizard (above). The wizard drives HAT_SELECTION and RADAR_CONFIGURATION states.
ENGINE_CONFIGURATION, ROLE_INITIALIZATION, and INVITE_STAGING are system-resolved — not user-facing steps.

- No dashboard release before ACTIVATION_COMPLETE
- Role context must initialize before first dashboard load
- Radar must not emit signals before ACTIVATION_COMPLETE

### First Login Behavior
- Ask which workspaces user operates
- Store selection in profile
- Do not re-ask during normal workflow

### Returning Login Behavior
- Load last-used workspace automatically

### Configuration Isolation Rule
Onboarding and configuration flows must never appear during normal daily workflow.
Configuration is profile-stored and settings-editable only.

---

## Profile Schema

**Canon-locked fields:**
```
workspaces (array)
workspace_names (record — key: workspace_id, value: custom name string)
workspace_logos (record — key: workspace_id, value: logo asset reference)
domain_priority (ordered array)
domain_labels (record)
notifications_pref: LOW | MEDIUM | HIGH
radar_density_pref
onboarding_complete: boolean
owner_carries_workload (record — key: hat_id, value: boolean)
owner_supervision_structure (record — key: hat_id, value: supervision_type)
```

**Pre-Canon fields (present in codebase — pending architectural reconciliation):**
```
practice_mode (solo | group)
uses_referrals (boolean)
has_staff (boolean)
has_interns (boolean)
notification_style (realtime | daily_digest)
```
These fields exist in the current implementation. They are not yet formally reconciled into Canon architecture.
They must not be removed without a Canon Update Protocol entry. Reconciliation is a future governance task.

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
- Alert sensitivity

---

## Owner Active Workload Flag

**LOG-074 — LOCKED**

### Purpose
Determines whether the Owner personally carries an active workload within a given hat — such as a caseload, client sessions, or teaching slots.
This flag is per-hat, not global.

### Onboarding Question (Locked Copy)
> "Do you personally carry an active workload in this practice — such as clients, cases, or sessions?"

Presented during hat onboarding. Answerable during onboarding or changeable anytime in Settings.

### Answer: Yes
- Owner gets a personal workload tab on their dashboard scoped to this hat
- In GP hat: Owner Caseload tab appears — functions identically to Clinician caseload but owner-scoped
- In Coaching hat: Owner Sessions tab appears
- In other hats: equivalent workload surface renders per hat domain rules
- Owner's personal workload is private — never visible to other staff unless hat-specific supervision rules explicitly permit it

### Answer: No
- Clean leadership / CEO view only
- No personal workload tab rendered
- No caseload or session items appear on Owner dashboard

### Flag Storage Rules
- Stored per hat in Operating Profile: `owner_carries_workload: boolean`
- Owner may carry workload in one hat but not another — flags are independent
- Changeable anytime in Settings — no re-onboarding required
- Default value: **No** (leadership view) unless Owner selects Yes

### GP-Specific Follow-Up Question (when workload flag = Yes in GP hat)
> "Who provides clinical oversight for your caseload?"

Options presented:
1. I am self-supervising (licensed independent practitioner)
2. Another supervisor in this practice
3. External supervisor (outside this system)

**This question is not locked to one answer.**
Different owner-operators run GP practices differently.
The system must flex for solo licensed practitioners, group practice owners who also see clients, and owner-operators who delegate all clinical supervision.

### Supervision Visibility Rule (GP)
| Supervision Type | Supervisor visibility into Owner caseload |
|---|---|
| SELF_SUPERVISED | No other role has visibility |
| INTERNAL_SUPERVISOR | Named supervisor has same visibility as any supervisee |
| EXTERNAL_SUPERVISOR | No internal role has visibility |

---

End of 03_OPERATING_PROFILE_ENGINE.md

---

| [← 02 — Global Architecture](02_GLOBAL_ARCHITECTURE.md) | [📚 Index](README.md) | [04 — Group Practice Domain →](04_GROUP_PRACTICE_DOMAIN.md) |
|---|---|---|
