| [← 04 — Group Practice Domain](04_GROUP_PRACTICE_DOMAIN.md) | [📚 Index](README.md) | [06 — Current Dev State →](06_CURRENT_DEVELOPMENT_STATE.md) |
|---|---|---|

---

# 05 — Development Governance
Derived from: PF-CANON.md
Version Timestamp: 03/13/2026 — Navigation System Governance Update (previously 03/08/2026 — Phase 6 Pre-Build Canon Update)
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

## Proactive Canon Flagging Rule (LOG-099)

**LOG-099 — LOCKED**

This rule governs how cross-platform and architectural decisions are handled during active development sessions.

### Rule

During any development session, Claude must proactively flag any decision, change, or pattern that is canon-worthy or cross-platform applicable — without waiting to be asked.

### Trigger Conditions

Flag immediately when any of the following occur:

- A decision affects multiple hats or engines
- A universal component behavior is changed or added
- A new system-level feature is introduced
- An architectural decision is made on the fly during building
- A UI pattern is established that should be consistent everywhere
- A visual doctrine decision is made that affects other modules
- A naming or language decision is made that should be universal
- A data model decision is made that affects multiple surfaces

### Flag Format

When a trigger condition is met, Claude must immediately surface:

> 🔒 Canon-worthy — [brief reason why this applies beyond current context] — recommend locking as LOG-XXX before continuing.

### Rule

- Canon flagging takes priority over continuing the build
- The flag must appear before the next build prompt is written
- Owner decides whether to lock immediately or defer
- If deferred, it must be added to OUTSTANDING DECISIONS in SESSION_CONTEXT.md
- Nothing architectural lives only in conversation — ever

### Why This Exists

The owner may not always know when a decision has cross-platform implications. Claude is responsible for catching these moments and surfacing them proactively. This protects the integrity of the canon and prevents rework across engines and hats.

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
- Workspace context (center) — visible inside workspace only, not on opening dashboard. Displays the owner's company name as entered in Operating Profile (e.g. "Clarity Counseling Group"). It never displays the default workspace category label ("Group Practice", "Coaching", "Home"). The words "Group Practice" and "Workspaces" do not appear anywhere in the app UI — not in breadcrumbs, headers, nav labels, page titles, or any surface.
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

## Bottom Navigation Bar Governance

**LOG-064 — LOCKED**

### Rule
A persistent bottom navigation bar lives on all GP workspace screens for all roles.

**Exception:** Owner opening dashboard (hat selector screen) — no bottom nav appears here. This screen is pre-workspace and must remain clean.

### Standard 5-Item Bottom Nav
| Position | Label | Purpose |
|---|---|---|
| 1 | Home | Radar — role-scoped priority signals |
| 2 | Board | Message Board — practice-wide communication |
| 3 | My Work | Role-aware work surface |
| 4 | Calendar | Appointments — role-scoped |
| 5 | More | Role-filtered drawer |

### Nav Bar Visual Rules
- Background: Header/Nav bar token (`#1a2a5e` light / `#152d4e` dark)
- Active item: `#2dd4bf` — icon + label both highlighted
- Active item background tint: `rgba(45,212,191,0.12)` — subtle
- Inactive items: `rgba(255,255,255,0.55)`
- Notification badge: `#2dd4bf` pill with count
- Labels always visible below icons — never icon-only
- 5 items always visible — no scrolling nav bar
- Height: consistent with platform standard tap targets

### My Work — Role-Aware Content Rule
Same nav label for all roles. Content inside is role-scoped:
| Role | My Work Shows |
|---|---|
| Owner | Full GP module access |
| Admin | Workflow queue + management items |
| Supervisor | Supervision queue + pending approvals |
| Clinician | Caseload + treatment plans |
| Clinical Intern | Caseload + supervision hours |
| Business Intern | Assigned tasks + operations |
| Staff | Assigned tasks |

### More Drawer Governance

#### Drawer Section Order (LOG-079)

**Section: PRACTICE** (Owner + Admin only)
- Management Center
- Client Database
- Insurance Database
- Vendor Database
- Compliance

**Section: CLINICAL** (new — LOG-079)
- Supervision Structure

**Section: TEAM** (visible to all roles)
- Directory
- Recognition

**Section: PERSONAL** (visible to all roles)
- Major Moments

**Section: COMMUNICATION** (visible to all roles)
- Messages (direct — GP-scoped only)
- Feed

**Section: SYSTEM** (visible to all roles)
- Guide Center (two tabs: Written Guides + Video Tutorials — LOG-080)
- Settings

#### Role-Scoped Visibility Rules

**Supervisor adds:**
- Supervision Structure (CLINICAL section)
- Client Database (own supervisees only)
- Compliance (own supervisees only)
- Treatment Plans (own supervisees only)

**Clinician + Clinical Intern adds:**
- Supervision (own sessions only)
- Treatment Plans (own clients only)
- Compliance (own records only)

**Business Intern + Staff:**
- TEAM, PERSONAL, COMMUNICATION, SYSTEM sections only — no PRACTICE or CLINICAL items visible ever

### Drawer Visual Rules
- Slides up from bottom
- Same background color as bottom nav bar
- User profile + role visible at top of drawer
- Items grouped by section with section labels
- Role-filtered: items not applicable to role are completely absent — never grayed out, never locked, never visible
- Dismiss: tap outside drawer or swipe down

### Structural Integrity Rule
Navigation cannot precede critical information in Control Mode.
The Radar (Home) must always be the first nav item.
No nav item may bypass the Radar-first doctrine.

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
| Office Board | Message Board |

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
