| [← 02 — Global Architecture](02_GLOBAL_ARCHITECTURE.md) | [📚 Index](README.md) | [04 — Group Practice Domain →](04_GROUP_PRACTICE_DOMAIN.md) |
|---|---|---|

---

# 03 — Operating Profile Engine
Derived from: PF-CANON.md
Version Timestamp: 03/08/2026 — Phase 6 Pre-Build Canon Update
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
- Staff self-onboard independently — they receive access, create their own credentials, and go through their own role-scoped onboarding flow. The owner does not configure staff profiles.

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

## Setup Assistance — Owner Checklist

The Setup Assistance system provides a structured checklist to guide the Owner through essential configuration required to activate system routing.

### Checklist Philosophy
- Contains **essentials only** — the minimum the system needs to begin routing correctly
- Non-essential configuration (engine setup, insurance database, staff profiles) is available at any time through Settings — no checklist pressure
- Checklist **disappears permanently** once all essential items are marked complete
- Checklist does NOT represent a full practice setup — it represents system activation readiness

### Essential Checklist Items (Owner)
1. Workspace selection complete
2. Domain priority set
3. Notification intensity selected
4. Radar density selected

These four items correspond directly to the onboarding wizard steps. Once `onboarding_complete = true`, the checklist is dismissed permanently.

### Checklist Visibility
- Appears on Owner dashboard until essentials are complete
- Calm, non-intrusive presentation — never blocks workflow
- Does not reappear after dismissal via completion
- Lives as a dashboard element — not a modal, not a blocking flow

### Staff Onboarding
Staff self-onboard independently. They are not part of the Owner checklist.
Staff receive access credentials, create their own login, and are guided through their own role-scoped onboarding flow.
Owner does not configure staff profiles as part of setup.

---

## Contextual First-Visit Guidance

On first visit to each engine or module, the system may display a brief contextual orientation card.

**Behavior:**
- Appears once on first visit only
- Dismissed on interaction or navigation
- Plain language — one sentence describing what the surface does
- Never blocks the primary content
- Never re-appears after dismissal

This is distinct from the Help & Guide system (see 02_GLOBAL_ARCHITECTURE.md). First-visit guidance is automatic and passive. The Guide Center is active and user-initiated.

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

---

| [← 02 — Global Architecture](02_GLOBAL_ARCHITECTURE.md) | [📚 Index](README.md) | [04 — Group Practice Domain →](04_GROUP_PRACTICE_DOMAIN.md) |
|---|---|---|
