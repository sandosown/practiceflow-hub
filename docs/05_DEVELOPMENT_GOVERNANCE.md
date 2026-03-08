| [← 04 — Group Practice Domain](04_GROUP_PRACTICE_DOMAIN.md) | [📚 Index](README.md) | [06 — Current Dev State →](06_CURRENT_DEVELOPMENT_STATE.md) |
|---|---|---|

---

# 05 — Development Governance
Derived from: PF-CANON.md
Version Timestamp: 03/08/2026 — Phase 6 Pre-Build Canon Update
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

## Navigation & Settings Governance

### Top Navigation Bar (Locked)
- Logo (left) — SympoFlo wordmark in Georgia serif
- Workspace context (center) — visible inside workspace only, not on opening dashboard
- User name + avatar dropdown (top-right)
- Log out — clearly labeled, never icon-only
- No role badge
- No mode badge

### Avatar Dropdown Pattern (Locked)
- Triggered by clicking user name / avatar in top-right
- Contains: Profile, Settings, Log out
- No persistent sidebar navigation
- Sidebar navigation is explicitly rejected — adds visual noise against calm command center doctrine

### Settings Page (Locked)
- Dedicated full page — not a modal, not a slide-over
- Accessible via avatar dropdown from any screen
- Every role gets a Settings surface scoped to their role
- Owner settings: workspace config, domain priority, notification intensity, radar density, Operating Profile
- All roles: personal profile (name, email, password), role-relevant notification preferences
- No role sees settings belonging to another role
- Settings page is the only place where configuration flows may appear

---

## Help & Guide System Governance

### Contextual Help Icons ("?" Icons)
- Small "?" icons appear next to complex fields, workflow steps, or sections that require explanation
- On interaction: brief plain-language explanation — one to two sentences maximum
- Positioned at exact point of potential confusion
- Never blocks workflow, never requires dismissal of critical content
- Applied across: Worker Profile Wizard, LP Compliance flows, Referral Matching, Transfer/Termination flows, and any multi-step process

### Guide Center
- Dedicated page accessible from Settings and nav
- Searchable
- Organized by role — users see only guides relevant to their role
- Organized by engine/module
- Content built progressively as modules are completed
- Examples of guide topics: "How do I add a clinician", "How does LP tracking work", "How do I transfer a client", "What is the 3-day discharge rule"
- Guide Center is NOT a marketing surface — operational, plain-language only

### Both systems are active in V1.
Contextual "?" icons handle in-the-moment confusion.
Guide Center handles deeper reference needs.

---

## Search Governance

### V1 Standard: Local Search
- Every database module includes a local search bar scoped to that module
- Search bar positioned at top of module surface, above record list
- No cross-module or global search in V1
- Global search is a future phase feature

### Modules requiring local search (V1):
- Client Database
- Worker Profiles
- Insurance Database
- Vendor Database
- Document Control System
- Major Moments Radar
- Compliance Records

---

## Major Moments Governance

- Major Moments is a V1 feature — not deferred
- Lives inside each engine as an engine-level module
- Not a global feature above the system
- GP module list updated from 9 to 10 to include Major Moments
- Visual treatment must be unique and distinct from operational modules
- Scrapbook aesthetic must be achieved within dark navy doctrine — no light backgrounds, no paper textures that contradict visual doctrine
- Reflection Banner is Owner-only — no other role sees it
- Auto-capture must never interrupt user workflow — silent background capture only
- Manual capture via "Let's Capture This Moment" button

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
- Major Moments accent color
- Avatar dropdown pattern

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
