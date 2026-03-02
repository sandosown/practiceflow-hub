# 03 — Operating Profile Engine

Derived from: PF-CANON.md (Section 4)

---

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
