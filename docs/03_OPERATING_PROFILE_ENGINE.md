# 03 — Operating Profile Engine
Derived from: PF-CANON.md
Version Timestamp: 03/07/2026 — Canon Rewrite Session
See CHANGELOG.md for full version history.

---

## Purpose

Owner-only configuration layer.

Stores:
- Workspace selection
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

## Onboarding Model

### Owner Onboarding Emotional Tone (Locked Copy)
- "Where in your life do you need steady support right now?"
- "Choose the areas you'd like help managing. We organize these as your hats."

### Owner Onboarding Wizard — 3-Step Flow

**Step 1 — Workspace Selection**
Card-based toggles. GROUP_PRACTICE is pre-selected but may be deselected if not applicable to the user's domain.

**Step 2 — Workspace Priority Ordering**
Explicit up/down movement ordering.

**Step 3 — Notification Intensity Selection**
LOW / MEDIUM / HIGH selection.

Custom workspaces limited to maximum of 2.
Onboarding configuration is profile-stored and settings-editable only.

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
3-step wizard (above). The wizard drives HAT_SELECTION and RADAR_CONFIGURATION states. ENGINE_CONFIGURATION, ROLE_INITIALIZATION, and INVITE_STAGING are system-resolved — not user-facing steps.

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

End of 03_OPERATING_PROFILE_ENGINE.md
