| [← 04 — Group Practice Domain](04_GROUP_PRACTICE_DOMAIN.md) | [📚 Index](README.md) | [06 — Current Dev State →](06_CURRENT_DEVELOPMENT_STATE.md) |
|---|---|---|

---

# 05 — Development Governance
Derived from: PF-CANON.md
Version Timestamp: 03/07/2026 — Canon Rewrite Session
See CHANGELOG.md for full version history.

---

## Canon Update Protocol

All updates must:
1. Add new Version Timestamp
2. Add Change Log entry
3. Reconcile contradictions
4. Remove obsolete statements
5. Preserve architectural intent

Canon must never be silently overwritten.
Canon > Chat. Always.

---

## Governance Principles

- No architectural decisions live only in conversation.
- Scope containment is mandatory.
- Domain isolation must be preserved.
- Emotional objective (Calm Command Center) must never be compromised.
- Any UI behavior contradicting architecture must be recorded before continuing development.
- Architecture does not collapse to match implementation limitations.

---

## Structural Integrity Rules

- Identity → Mode → Workspace separation must remain intact.
- Workspaces must not bleed into each other.
- Engines remain universal infrastructure.
- Automation must remain suggestive — never intrusive.
- Role model must not be collapsed to match current implementation.
- Deny-by-default permission policy enforced at data layer.
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

## SF Brand Governance

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

**Ownership rule:** PF-CANON.md owns architecture and system behavior. SF-BRAND.md owns all visual, identity, and brand decisions. When brand and architecture conflict, architecture governs. When the conflict is visual-only, SF-BRAND.md governs.

---

## Documentation Discipline

- All architectural decisions must live in `/docs`.
- All Canon updates must be versioned.
- No legacy platform references (CodeSpring, CSV2) may be reintroduced.
- Prefix discipline must be maintained: PF (system) / SF (brand).
- Split files derive from PF-CANON.md — master file is always authoritative.

---

## Naming Conventions (Locked)

| Old Name | Canonical Name |
|---|---|
| Role Hub | Workspaces |
| "Select a role to get started" | "Choose a workspace" |
| Group Practice Radar | Group Practice Dashboard |
| Comms | Office Board |

---

## Git Workflow

- `main` = stable branch
- Feature work requires new branch from main
- Feature branches merged into main via PR
- Each fix must be completed and verified before moving to the next
- Commit message discipline required — explicit fix naming
- Surgical patch strategy favored over broad rewrites

---

End of 05_DEVELOPMENT_GOVERNANCE.md

---

| [← 04 — Group Practice Domain](04_GROUP_PRACTICE_DOMAIN.md) | [📚 Index](README.md) | [06 — Current Dev State →](06_CURRENT_DEVELOPMENT_STATE.md) |
|---|---|---|
