| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) | [SF — Brand Governance →](SF-BRAND.md) |
|---|---|---|

---

# 06 — Current Development State
Derived from: PF-CANON.md
Version Timestamp: 03/07/2026 — Canon Rewrite Session
See CHANGELOG.md for full version history.

---

## Version Reference

03/07/2026 — Canon Rewrite Session

---

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

---

## Structurally Defined but Pending

- Full Radar weighting integration
- Settings-based workspace reconfiguration
- Full Management Center expansion
- Complete referral matching UI
- Full employee onboarding system wiring (all 7 tabs)
- Advanced drift detection calibration
- Mode system (CONTROL / ACTION) full implementation
- Session context completion (practice_id, mode, visibility_scope, workflow_scope)
- 6-role system expansion (currently 3-role snapshot)
- Intern subtype routing (Clinical / Business)
- Clinician LP subtype routing
- Training Engine implementation
- LP Compliance subsystem implementation
- domain_priority → Radar integration
- Onboarding State Machine completion gate
- Upload to Autofill extraction engine (feature flag ready)
- Attention Layer implementation in Control Mode dashboard
- Deny-by-default permission enforcement at data layer
- Audit trail for all workflow transitions
- Assignment History table
- Termination Request table
- Transfer Request table
- Pre-Canon profile schema fields reconciliation (practice_mode, uses_referrals, has_staff, has_interns, notification_style)

---

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

---

## Implementation Phase Sequence

**Phase 1 — Identity & Mode Boot Engine**
- Finalize session object shape
- Role resolve logic with 6-role model
- Mode assignment logic
- Workspace resolver
- Silent boot loader ("Preparing your workspace…")

**Phase 2 — Control Mode Dashboard**
- Remove menu-first structure
- Add Attention Layer
- Move navigation under insight
- Group Practice Dashboard rename

**Phase 3 — Action Mode Simplification**
- Strip density
- Remove control-level visibility
- Guided task architecture
- Mobile-optimized flow

**Phase 4 — Operating Profile Isolation**
- Move onboarding configuration fully into settings
- Ensure no login routing interference

---

## Rename Decisions (Locked — Pending Code Implementation)

| Old Name | Canonical Name |
|---|---|
| Role Hub | Workspaces |
| "Select a role to get started" | "Choose a workspace" |
| Group Practice Radar | Group Practice Dashboard |
| Comms | Office Board |

---

## Stability Status

The system is architecturally defined.
Core philosophy is locked.
Governance framework is established.
Future development must extend — not alter — structural foundations.

---

End of 06_CURRENT_DEVELOPMENT_STATE.md

---

| [← 05 — Development Governance](05_DEVELOPMENT_GOVERNANCE.md) | [📚 Index](README.md) | [SF — Brand Governance →](SF-BRAND.md) |
|---|---|---|
