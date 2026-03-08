# SympoFlo / PracticeFlow — Architecture Documentation

**Canon Version:** 03/07/2026
**Status:** Authoritative Working Canon

> Canon > Chat. Always. No architectural decision lives only in conversation.

---

## How to Use These Docs

**`PF-CANON.md`** is the master document. It is the single source of truth for all architectural decisions. When in doubt, this file governs.

The numbered files are split versions of the master Canon — one file per section — for faster developer reference. They derive from `PF-CANON.md` and must stay in sync with it.

**`SF-BRAND.md`** covers all SympoFlo visual identity and brand decisions. It is separate from the architecture Canon by design.

---

## File Index

| File | Contents |
|---|---|
| `PF-CANON.md` | Master architecture document — all sections |
| `00_APP_IDENTITY.md` | Product identity, positioning, emotional objective |
| `01_CORE_SYSTEM_PHILOSOPHY.md` | Radar model, resolution model, UX rules, permission model |
| `02_GLOBAL_ARCHITECTURE.md` | Workspaces, role system, mode system, engine registry |
| `03_OPERATING_PROFILE_ENGINE.md` | Owner onboarding, profile schema, radar influence |
| `04_GROUP_PRACTICE_DOMAIN.md` | Full Group Practice domain — modules, workflows, compliance |
| `05_DEVELOPMENT_GOVERNANCE.md` | Canon protocol, structural rules, naming conventions, git workflow |
| `06_CURRENT_DEVELOPMENT_STATE.md` | Implementation phases, active constraints, pending work |
| `SF-BRAND.md` | SympoFlo brand governance — icon, theme, UI archetypes, tokens |
| `CHANGELOG.md` | Full version history of all Canon changes |

---

## Core Principles

- **PracticeFlow tracks reality — not records.**
- **Radar does not solve. It routes.**
- **Architecture does not collapse to match implementation limitations.**
- **Canon > Chat. Always.**

---

## Canon Update Protocol

All updates to Canon must:
1. Add a new Version Timestamp
2. Add a Change Log entry in `CHANGELOG.md`
3. Reconcile contradictions
4. Remove obsolete statements
5. Preserve architectural intent

Canon must never be silently overwritten.

---

*PF = Runtime / Architecture / System. SF = Brand / Identity / Visual.*
