# 01 — Core System Philosophy
Derived from: PF-CANON.md
Version Timestamp: 03/07/2026 — Canon Rewrite Session
See CHANGELOG.md for full version history.

---

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

## Behavioral Personality Rule

The app's behavioral personality is determined automatically by Role + Mode combination.
Interface density, language, hierarchy, and focus adjust based on who is logged in and what mode they are in.
Users do not select cognitive modes. The system applies them.

---

## Universal UX Rules

- Interruptible workflows: never lose partial progress.
- No dead-end screens. Every nested navigation includes a Back path.
- No global task list exposed on first load.
- Empty states must never appear as error states. Empty does not equal Error.
- No motivational or celebratory language in Control Mode.
- Configuration flows must never appear during normal daily workflow.
- Feature readiness test — every feature must answer:
  1. Which Mode does it belong to?
  2. Does it appear differently in Control vs Action Mode?
  3. Does it require workspace scoping?
  4. Does it surface in the Attention Layer?

---

End of 01_CORE_SYSTEM_PHILOSOPHY.md
