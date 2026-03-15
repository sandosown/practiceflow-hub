| [← 01 — Core System Philosophy](01_CORE_SYSTEM_PHILOSOPHY.md) | [📚 Index](README.md) | [03 — Operating Profile →](03_OPERATING_PROFILE_ENGINE.md) |
|---|---|---|

---

# 02 — Global Architecture
Derived from: PF-CANON.md
Version Timestamp: 03/13/2026 — Calendar & Appointments Update (previously 03/08/2026 — Engine Philosophy + Major Moments Canon Update)
See CHANGELOG.md for full version history.

---

## Multi-Hat (Workspace) Model

The system supports multiple Workspaces (Domains/Hats).
Workspaces are user-selected during onboarding and named by the owner.
Default workspace labels are fallbacks only — the owner replaces them with their actual company or context name.
Names can be set during onboarding or changed anytime in Settings.

**Workspace Naming Rules:**
- Owner enters company/context name during onboarding (e.g. "Good Health LLC", "Johnson Family")
- Name appears on the workspace card on the opening Owner dashboard
- Owner may upload a logo — logo appears on the workspace card alongside the company name
- Default label (e.g. "Group Practice") is the fallback until a name is entered
- Employees see the actual company name, not the default category label
- Name is changeable anytime in Settings — no locks

**Built-in Workspaces:**
- GROUP_PRACTICE — first-class workspace, pre-selected on first load, user may deselect if not applicable
- COACHING — optional
- HOME — optional
- CUSTOM_1 — optional, Coming Soon (non-routable)
- CUSTOM_2 — optional, Coming Soon (non-routable)

**Custom workspace rules:**
- Stored in domains array
- Labeled via domain_labels
- Included in domain_priority ordering
- Rendered as "Coming Soon" tiles in Workspaces hub
- Non-clickable — no routing attached in V1
- Removable during onboarding
- Maximum 2 custom workspaces

---

## Identity → Mode → Workspace Layers

Runtime separation — three structurally independent layers:

1. **Identity** (Role) — who the user is
2. **Mode** (Control vs Action) — behavioral interface state
3. **Workspace** (Domain/Hat) — operating domain

Role and Workspace are explicitly different concepts and must never be treated as interchangeable.

**Macro architecture order:**
Identity → Mode → Workspace → Attention → Action

---

## Boot Sequence

Mode 0: Identity Gate

```
Authentication
→ Role Resolve
→ Mode Assignment
→ Workspace Load
→ Interface Render
```

Boot loading state must display: **"Preparing your workspace…"**
White screen during auth load is unacceptable. Loading state must be visible — never a silent null render.

**Session context must include:**
- user_id
- practice_id
- role
- intern_subtype (if applicable)
- clinician_subtype (if applicable)
- mode (CONTROL | ACTION)
- visibility_scope
- workflow_scope

---

## Role System

### Two-Tier Role Model

**Tier 1 — System Roles** (Canon-locked, drive routing and access):

| System Role | Description |
|---|---|
| OWNER | CEO / Owner — full system visibility |
| ADMIN | Admin / Management — operational oversight |
| SUPERVISOR | Clinical supervision authority |
| CLINICIAN | Licensed therapist — has caseload |
| INTERN | Clinical or Business subtype |
| STAFF | Non-clinical operational staff |
| PARTNER | Co-owner level — full system access by default, self-configures visible tabs per hat |

**Tier 2 — Display Labels:** Configurable per workspace. Not locked in Canon.

### Partner Role (LOG-089)

- PARTNER is a co-owner level system role with full access by default
- Each Partner self-manages their own visible tabs per hat — they choose what they want to see
- Hat-scoped — Partner configuration is independent per hat, no cross-hat bleed
- Applies universally across all engines — GP, Coaching, Home, and all future hats
- Stored in Operating Profile per hat
- Multiple Partners supported per hat
- Partners are invited via the Invitation System (LOG-091)

### Permission Grant System (LOG-090)

- Owner can grant any staff member access to any module outside their default role scope
- Grant types: View Only or Full Access — Owner chooses at time of granting
- Grants are per-person, per-module, per-hat
- Revocable at any time by Owner
- Grant access surface lives in More drawer — visible to Owner only
- Applies across all engines and all hats
- Granted access appears on the recipient's dashboard automatically
- Grants are stored in a permission_grants table: grant_id, hat_id, granted_by, granted_to, module, access_type (view | full), created_at, revoked_at

### Invitation System (LOG-091)

- Invitations are the only entry point for staff into the system — no self-signup ever
- Who can invite: Owner, Admin, or any role the Owner explicitly designates as an inviter
- Invitation flow: inviter enters first name, last name, email, role → system sends invitation link → recipient clicks link → completes onboarding for their role
- Invitation is hat-scoped — recipient joins the specific hat they were invited to
- Invitation link is single-use and expires after 72 hours
- Invitation status tracked: PENDING / ACCEPTED / EXPIRED / REVOKED
- Owner and Admin can revoke pending invitations at any time
- Invitation management surface lives in Management Center

### Staff Deactivation / Removal (LOG-094)

- Owner and Admin can remove a staff member from a hat
- Removal is never a hard delete — status changes to INACTIVE
- INACTIVE staff disappear from all active views, dashboards, and directories
- INACTIVE staff records are retained permanently for audit trail and historical assignment purposes
- Removal flow: Owner/Admin navigates to person's profile → "Remove from Practice" button (border-only accent, never red) → confirmation dialog: "Are you sure you want to remove [Name] from this practice? This cannot be undone without contacting support." → Owner chooses: Remove Immediately or Set End Date → confirm → access revokes on chosen date
- If staff member has active clients, active supervision assignments, or open compliance records — system blocks removal and displays what must be resolved before removal can proceed
- No hard deletes ever — all data preserved
- Reinstatement in V1 requires Owner to contact support
- Access revocation is automatic on the chosen date — no manual follow-up required

### Clinician Subtypes
- **LICENSED** — full licensure, standard clinical routing
- **LP (Limited Permit)** — state-regulated compliance, routes to Compliance Engine

### Intern Subtypes
- **CLINICAL** — has caseload, routes to Training Engine, clinical supervision required
- **BUSINESS** — no caseload, operational staff only, routes to People Engine

### Critical Distinction
- Clinical Intern ≠ Limited Permit Therapist (LP)
- LP is a compliance classification on CLINICIAN — not an intern type
- Business Intern is an operational staff subtype — not clinical

### Permission Model
- Security model: deny by default
- Data-layer enforcement required. UI-only gating is insufficient and explicitly rejected.
- Escalation direction: upward via events only. Never downward.
- Single active role rule: the system handles one identity at a time.

---

## Mode System

### Control Mode
- Monitor → Prioritize → Assign → Verify
- Desktop-first orientation
- Attention layer appears before tools
- Dense multi-panel overview
- Strategic and clinical oversight behavior
- Must immediately answer: "What needs my attention right now?"
- No motivational or celebratory language

### Action Mode
- See → Do → Confirm → Done
- Mobile-first orientation
- Clarity over density
- Focused single-task layout
- Guided assistant experience

### Attention Layer (Control Mode)

Mandatory top section of all Control Mode dashboards.
Must answer: "What needs my attention right now?"
Information must appear before navigation tools.
Navigation cannot precede critical information in Control Mode.
No shared universal dashboard serving both modes.

**Canonical Attention Layer signals:**
- Clinicians missing credentials
- License expiring soon
- Unassigned referrals
- Onboarding stuck
- Discharge deadline approaching
- LP verification overdue

---

## Engine Philosophy (Foundational Doctrine)

This is the core architectural principle governing all of SympoFlo.

**Hats are contextual lenses. Engines are structural systems.**
**Hats never generate engines. Engines power hats.**

The full hierarchy:
```
User
→ Hats (context lenses — named by the user)
  → Engines (fixed, predefined universal infrastructure)
    → Radars (awareness panels)
      → Actions (execution flows)
```

### What an Engine Is
An Engine is a universal system capability that powers functionality inside any Hat.
Engines are fixed. They do not change based on who the user is or what industry they work in.
A yoga instructor and a group practice owner use the same engine infrastructure — what differs is the content they bring to it.

### What an Engine Is NOT
- Engines are not generated by user input
- Engines are not hat-specific
- Engines do not change per industry or business type
- Engines do not require redesign to serve new user types

### Hat Activation Rule
Users select which engines power each hat during onboarding.
Engines can be activated or deactivated per hat at any time — no locks.
Activating a new engine inside a hat always triggers a guided setup wizard — never a blank screen.

### Context Isolation Principle (Non-Negotiable)
Everything in SympoFlo is hat-scoped at the UI layer.
No cross-hat bleed in the user experience.
When a user is inside a hat, they see only what belongs to that hat.

The rule: **Hat → Radar → Engine → Objects. Only.**

This preserves the Calm Command Center experience.
Users are never overwhelmed by information from other hats.

### Universal Object Rule
Every object in the system must store:
- `hat_id` (required)
- `engine_source` (required)

No floating objects are permitted. All objects are workspace-scoped and engine-attributed.

---

## Engine Architecture

### Universal Engines (6) — User-Selectable Per Hat

| # | Engine | Core Purpose | V1 Scope | Explicitly Excluded in V1 |
|---|---|---|---|---|
| 1 | People Engine | Relational identity & responsibility | Profiles, roles, status, linked docs/contracts/events, responsibilities | CRM communication logs, email tracking, call logs |
| 2 | Operations Engine | Execution & coordination | Tasks, projects, workflows, 3-phase event lifecycle, asset/product tracker, recurring logic (suggestive), **Calendar & Appointments** | Full PM suite, POS logic, barcode scanning |
| 3 | Revenue Engine | Financial awareness | Income, lightweight expenses, simple profit snapshot, offer/event/product revenue, milestones | Accounting ledger, tax system, payroll, bank sync, invoicing |
| 4 | Growth Engine | Forward momentum | Goals, KPIs, milestones, skill development, marketing visibility, pipeline awareness (New→Contacted→Proposal→Won→Lost) | CRM automation, sales forecasting, complex funnel builders |
| 5 | Compliance Engine | Obligation & legitimacy | Contracts, licenses, certifications, insurance, expiration tracking, renewal reminders, assigned responsibility | Risk scoring, e-signature platform, legal drafting |
| 6 | Personal/Life Engine | Household & personal operating | Household tasks, family events, home contractors, personal goals, lightweight health tracking | Medical records vault, wearable integrations, advanced health analytics |

### Specialized Engines (2) — Domain-Specific, Not in Universal Selection

| # | Engine | Scope | Available To |
|---|---|---|---|
| 7 | Document Control System | Centralized document registry — cross-hat infrastructure, hat-isolated UX | All hats (system layer — always active, not user-facing as a selectable engine) |
| 8 | Training Engine | Clinical intern lifecycle, supervision assignment, caseload tracking | Group Practice only |

### Engine Activation Matrix
Engine enablement is stored per-hat.
Engine Activation Matrix governs engine-per-hat state.

### "Need a Tool?" Assist Panel
Available inside every workspace.
When user cannot find what they need, this panel suggests enabling engines not currently active for that hat.
Shows available engine capabilities in plain language.
User-controlled activation only — no AI guessing.
Activating an engine from this panel triggers the Guided Setup Wizard.

### Guided Setup Wizard (Engine Activation)
When a user enables a new engine inside a hat, PF does NOT drop them into a blank screen.
A short guided setup flow launches, specific to that engine and hat context.
Steps are simple and conversational — not a technical configuration form.
This protects the user from feeling lost and reinforces the personal assistant identity.

---

## Engine Scope Boundaries (Canonical Rules)

- People Engine = Worker Profiles only. Clients live under Operations Engine — not People.
- Strategy is folded into Growth Engine — no separate Strategy Engine exists or will be created
- No risk scoring in Compliance Engine (V1)
- No CRM communication logs in People Engine (V1)
- No POS logic in Operations Engine
- No barcode scanning in Asset Tracker (V1)
- Document Control System is infrastructure — it is not a user-selectable engine
- Training Engine is Group Practice-only — it is not a universal engine

---

## Calendar & Appointments (Operations Engine — Universal)

**LOG-072 — LOCKED**

### Architectural Home
Calendar and Appointments live in the **Operations Engine**.
This is a universal capability available across all hats where the Operations Engine is active.
It is NOT a GP-specific feature.

### Universal Appointment Types (Base — All Hats)
- Personal
- Meeting
- Session
- Other

Each hat domain layer adds its own types on top of this base.
No hat may remove the base types.

### Universal Rules
- Every role gets a Calendar surface scoped to their active hat
- Any role can create their own appointments
- Owner / Admin (or equivalent authority role per hat) can create appointments for any member of their workspace
- When an authority role schedules an appointment with a specific member, it appears on that member's calendar automatically
- Calendar is always hat-scoped — no cross-hat calendar bleed ever
- Every appointment object requires: `hat_id` + `engine_source: operations`

### Calendar Visibility by Authority Level (Universal)
| Role Type | Sees |
|---|---|
| Owner / Admin | Full workspace calendar — all appointments |
| Supervisory roles | Own appointments + all supervisee appointments (read only) |
| Individual contributors | Own appointments only |

### Recurring Appointments
Supported via Operations Engine recurring logic.
V1: suggestive prompts only — not automatic.

### Calendar Nav Placement
Calendar earns a **permanent bottom nav slot** across all workspaces where the Operations Engine is active.
It is position 4 in the standard 5-item bottom nav.

### Appointment Creation Rules
- Any role creates their own appointments freely
- Authority roles (Owner, Admin, Supervisor equivalents) may create appointments assigned to other members
- Assigned appointments appear on the recipient's calendar with a label indicating who created them
- No silent appointment creation — recipient always sees the source

### Calendar Universal Component Architecture (LOG-096)

**LOG-096 — LOCKED**

The Calendar is built as a single universal component that is reused across all hats and all engines where the Operations Engine is active.

**Architecture rules:**
- One calendar component — not a separate calendar per hat
- Appointment types are passed as configuration per hat — not hardcoded
- The base universal types (Personal, Meeting, Session, Other) are always present
- Each hat domain layer adds its own types via a `hat_appointment_types` configuration
- The calendar shell, layout, search, side panel, role-scoped visibility, and all UX behavior are identical across all hats
- Only the appointment type list changes per hat context

**Hat appointment type configuration pattern:**
```
BASE_TYPES = [Personal, Meeting, Session, Other]

GP_TYPES = BASE_TYPES + [Client Session, Supervision Session, Staff Meeting, Intake]
COACHING_TYPES = BASE_TYPES + [Coaching Session, Discovery Call]
HOME_TYPES = BASE_TYPES
```

- Hat-specific types are additive only — no hat may remove or override the base types
- Type configuration is resolved at runtime based on active hat context
- Color coding per type is defined once in the calendar component — not per hat

### Appointment Status System (LOG-097)

**LOG-097 — LOCKED**

Every appointment has a status field. Status is universal across all hats — no hat-specific status additions.

**Universal appointment statuses:**

- Confirmed — default state on creation
- Completed — appointment occurred
- Cancelled — appointment did not occur, preserved in record
- Rescheduled — linked to a replacement appointment, original marked rescheduled
- No Show — participant did not appear

**Status rules:**

- Default status on creation: Confirmed
- Status is updatable inline from the appointment card — no full edit required
- Cancelled and Rescheduled appointments are preserved in record — never hard deleted
- Completed appointments feed into activity history and engine-specific tracking
- No Show is clinically significant in GP — surfaces in clinician caseload and supervisor awareness
- Status changes are logged with user + timestamp
- Visual treatment: muted/neutral for Cancelled and No Show — never red, never alarm-style
- Completed: subtle teal indicator
- Rescheduled: subtle muted indicator with link to new appointment

**Storage:**

- status field on appointments table: confirmed | completed | cancelled | rescheduled | no_show
- status_updated_at (timestamp)
- status_updated_by (uuid)

### Calendar Filter System (LOG-098)

**LOG-098 — LOCKED**

The Calendar includes a smart filter system universal across all hats and engines where the Calendar is active.

**Filter criteria (all universal):**

- Keyword — searches appointment titles
- Date Range — from/to date picker
- Month / Year — picker that updates calendar view
- Appointment Type — multiselect dropdown, options vary per hat context
- Status — multiselect: Confirmed, Completed, Cancelled, Rescheduled, No Show
- Assigned To — staff member dropdown, visible to authority roles only (Owner, Admin, equivalent per hat)

**Filter behavior:**

- All filters work in combination — AND logic
- Calendar grid and Appointments side panel update in real time
- Active filters show a clear indicator
- "Clear all" resets to unfiltered view
- On mobile: filters collapse behind a "Filters" button that expands a filter sheet
- Active filters show a teal indicator dot on the Filters button on mobile

**Placement:**

- Main calendar: filter bar below header row, above calendar grid
- Appointments side panel: same filters in compact vertical stack

**Access rules:**

- Keyword, Date Range, Month/Year, Type, Status: visible to all roles
- Assigned To: visible to authority roles only (Owner, Admin, Supervisor equivalents per hat)

### Appointment Context Fields (LOG-102)

**LOG-102 — LOCKED**

Universal appointment fields available across all hats and all appointment types.

**Additional fields on every appointment:**

**PARTICIPANTS (With):**

- Multi-select field — "Who is this with?"
- Options vary by role:
  - Owner/Admin/Partner: any active staff member or client in the hat
  - Supervisor: own supervisees + colleagues
  - Clinician: clients from own caseload + colleagues
  - Staff/Intern: colleagues only
  - All roles: can type in external name not in system
- Stored as participants array on appointment object

**MEETING FORMAT:**

- Required field — "In-person or Virtual?"
- Two options: In-Person | Virtual

**IN-PERSON:**

- Location field appears: dropdown of saved locations + "Add new location" option
- Default saved locations: Office, External Location
- User can add custom locations — stored per hat in Settings
- Free text entry also permitted

**VIRTUAL:**

- Platform field appears: dropdown of video/call platforms
- Options: Zoom, SimplePractice, Google Meet, Microsoft Teams, FaceTime, Phone Call, Other
- Link field appears (optional): paste meeting link
- User can add custom platforms — stored per hat in Settings

**STORAGE:**

Add to appointments table:

- participants (array of uuids + optional external name strings)
- meeting_format (text — in_person | virtual)
- location (text, nullable — for in-person)
- virtual_platform (text, nullable — for virtual)
- meeting_link (text, nullable — for virtual)

**RULES:**

- All fields are universal — not GP specific
- Meeting format is required on appointment creation
- Location and platform fields are conditional based on meeting format selection
- Participants field is optional — appointments can exist without participants
- Custom locations and platforms are hat-scoped and editable in Settings

### Location Management System (LOG-103)

**LOG-103 — LOCKED**

Universal location management for in-person appointments across all hats and engines.

**Saved Locations:**

- Locations are stored per hat in Supabase
- Each location record contains:
  - location_id (uuid, primary key)
  - hat_id (required)
  - name (text, required — e.g. "Main Office", "Downtown Branch", "Studio A")
  - address (text, optional)
  - type (text — office | studio | clinic | venue | home | other)
  - created_by (uuid)
  - created_at (timestamp)
  - is_active (boolean, default: true)

**Location selection at appointment creation:**

- Dropdown shows all saved active locations for current hat
- "+ Add New Location" option at bottom of dropdown
- Selecting a saved location completes the field
- Selecting "+ Add New Location" opens inline form:
  - Location Name (required)
  - Address (optional)
  - Type (dropdown: Office, Studio, Clinic, Venue, Home, Other)
  - "Save for future use?" toggle — default: on
  - If saved: stored to hat locations, appears in all future dropdowns
  - If not saved: used for this appointment only, not stored

**Location management in Settings:**

- Owner and Admin can manage saved locations in Settings
- Add, edit, deactivate locations
- Deactivated locations no longer appear in dropdown but historical appointments retain their location data

**Rules:**

- Locations are hat-scoped — no cross-hat location bleed
- Universal across all hats — GP, Coaching, Home, all future hats
- Multiple locations supported per hat — no limit
- Default location can be set per hat in Settings
- Historical appointment location data is never deleted

### Appointment Shared Ownership Rule (LOG-104)

**LOG-104 — LOCKED**

Every person on an appointment owns it equally — regardless of who created it.

**Rule:**

When an appointment is created and participants are added via the "With" field:

- The appointment appears on every participant's calendar automatically
- Every participant has full ownership of their copy:
  - Can edit title, notes, location, platform
  - Can update their own status independently
  - Can cancel their own copy
  - Can add their own notes
  - Appears in their appointment history and search
- There is no "creator" vs "participant" distinction in the UI
- Every copy is a first-class independent record

**Linking:**

- All copies of the same appointment are linked via a shared appointment_group_id
- If one participant cancels their copy — only their copy is affected
- Other participants are not affected unless they choose to update their own
- No silent changes — if the original creator deletes their copy, other participants keep theirs

**Storage:**

Add to appointments table:

- appointment_group_id (uuid, nullable — links related appointment copies)
- is_linked (boolean, default: false)

**Rules:**

- Universal across all hats and all engines
- No role hierarchy on appointment ownership — all participants equal
- Hat-scoped — appointment copies only exist within the hat they were created in
- No cross-hat appointment sharing ever

---

## Event Lifecycle (Operations Engine)

Universal across all workspaces.
Events are not calendar replacements.
Events are not projects.

**Three-phase structure:**
- Pre-Event — preparation, logistics, contacts, assets to bring, checklists
- During Event — notes, sales logging, quick metrics
- Post-Event — inventory reconciliation, revenue log, follow-up tasks, reorder alerts

Event logging is append-only.
Cross-engine audit index required.
Audit index must be role-scoped.

---

## Asset & Product Tracker (Operations Engine)

Lightweight SKU tracking for entrepreneurs carrying physical products.
Designed for speakers, coaches, and small-batch product owners — not warehouse operations.

- Simple SKU (manual or auto-generated)
- Quantity tracking
- Reorder threshold
- Cost/price per unit (optional)
- Event-based reconciliation (quantity taken vs. quantity returned)
- No POS logic
- No barcode scanning in V1

---

## Document Control System (System Infrastructure)

Cross-hat infrastructure with hat-isolated user experience.
Always active — not user-selectable.

**Every document must have:**
- `hat_id` (required)
- `engine_source` (required)
- `assigned_responsibility` (required — no orphan documents)
- `status` (required)

Documents may:
- Link to an object (Person, Event, Contract, etc.)
- OR live at hat level (templates, SOPs, general assets)

Both are valid. No document may exist without hat_id and assigned_responsibility.

**Document state awareness:**
Documents carry status tracking, expiration tracking, signature status, and suggestive follow-up prompts.
This enables the system to surface alerts like "Sara has 1 unsigned document."

---

## Automation Model

Automation is: Structured. Guided. Suggestive.

Never:
- Intrusive
- Modal-heavy
- Auto-flooding
- Agency-removing
- Forced popup confirmation

**Suggestion chips:**
- Maximum 2–3 chips displayed contextually at bottom of screen
- Disappear on navigation — no guilt, no stacking
- Template-based — not rule-builder
- User always remains in control
- Never interrupt active workflow

**Recurring logic:** Supported in V1 via suggestive prompts only.
When a user creates something that could recur, a suggestion chip appears:
"Make this recurring?"
If ignored, it disappears on next navigation.

---

## Major Moments (Cross-Engine Feature)

Major Moments is a radar that lives **inside each engine** as an engine-specific module.
It is not a global radar. It is not above other radars.
Each engine maintains its own Major Moments timeline.
The engine context defines the category automatically — no tagging required from the user.

### Identity of the Feature
Major Moments is a structured memory archive, not a journal and not a productivity tracker.
It answers one question: **"What happened on this day?"**
The emotional tone is reflective, proud, and human.
The system acts as a quiet personal assistant helping the entrepreneur preserve meaningful moments.

### Locked Copy

| Element | Copy |
|---|---|
| Feature name | Major Moments |
| Subtitle | Your milestones and achievements. |
| Core prompt | What happened on this day? |
| Supporting prompt | Take a moment to reflect and record it. You'll be glad you did. |
| Primary CTA | Let's Capture This Moment |

### Engine-Specific Reflection Messaging

**Business engines** (Group Practice, Coaching, Revenue, Compliance, Growth):
> "You've come a long way. Take a moment to appreciate what you've built and achieved."

**Life/Personal engine:**
> "These are the moments that made you who you are. Take a moment and reflect."

Reflection messaging is consistent within engine type. It does not change per individual entry.

### Capture Entry Form (Field Rules)

| Field | Required | Notes |
|---|---|---|
| Name Your Moment | Yes | Becomes the headline of the moment in the timeline |
| Date It Happened | Yes | Powers chronological org and "On This Day" feature |
| Time It Happened | Yes | Not optional — locked 03/08/2026 |
| Why Was This Moment Important? | Yes | Brief reflection on the meaning of the event |
| Did You Receive an Award or Recognition? | Yes | Yes/No — if Yes, follow-up: "What award or recognition?" |
| Anything Else You'd Like to Remember? | No | Optional additional context |

### Automatic Capture (Silent Background)
The system detects significant events during normal data entry and records them as Major Moments silently.
**No prompts. No suggestion chips. No confirmation dialogs. No workflow interruption.**
Automatic capture is invisible to the user.

**GP auto-capture triggers:**
- New hire added → "Hired [Name]"
- License approved → "License Approved"
- Certification completed → "Certification Earned"
- First client added → "First Client"
- Client milestone reached → engine-specific milestone

Additional auto-capture triggers may be defined per engine during future phases.

### Reflection Banner
Appears at the top of the engine dashboard when a Major Moment occurred on the same date in a prior year.

**Visibility rule:** Reflection Banner is visible to the **workspace owner only**.
- In solo contexts (Coaching, Home): the logged-in user is always the owner — they always see it
- In multi-user contexts (Group Practice): OWNER role only sees the banner — employees do not

**Banner behavior:**
- Appears at top of engine dashboard
- Session-dismissible — disappears for that session when dismissed
- Not animated aggressively
- Links to Major Moments radar inside that engine

**Banner copy pattern:**
> "On this day you [moment title]."
> "See more in your Major Moments →"
> [Dismiss]

### Radar Layout
The Major Moments radar screen structure:

1. **Search bar** — top of screen. Searches by keyword, date, person, event name
2. **Reflection message** — engine-specific, below search bar
3. **"On This Day" cards** — top 3 moments from this date in prior years, displayed as rounded rectangular cards centered on screen
4. **"See More Moments"** — below the 3 cards, expands to full timeline

### Visual Style
Subtle scrapbook aesthetic within the dark navy visual doctrine.
The radar should feel like opening a personal memory archive — not reviewing a database.

Design characteristics:
- Soft paper-like texture (very subtle — moments remain the focus)
- Rounded rectangular cards with slight elevation/shadow
- Accent: #a78bfa (soft violet — Major Moments only)
- No light backgrounds — dark navy doctrine maintained throughout

### "On This Day" Display
Shows the top 3 moments from the same calendar date in previous years.
Each card shows: year, moment title, short description.
"See More" expands to full timeline browsing.

---

## Compliance Constraint

HIPAA-level compliance is a required architectural constraint.

The following are NOT canonically locked:
- Multi-tenant SaaS assumption
- Marketplace/plugin ecosystem
- Stripe/scheduling as first-class V1 systems
- White-label SaaS intent

---

## Extensibility Rules

- Solo-to-multi-tier growth must not require redesign
- Do not build enterprise complexity prematurely
- Architecture must be scalable beyond current implementation
- Future engines require index mapping only — no redesign
- New entrepreneur types (yoga instructor, outdoor guide, consultant, etc.) are served by existing engines — no new engines needed

---

End of 02_GLOBAL_ARCHITECTURE.md

---

| [← 01 — Core System Philosophy](01_CORE_SYSTEM_PHILOSOPHY.md) | [📚 Index](README.md) | [03 — Operating Profile →](03_OPERATING_PROFILE_ENGINE.md) |
|---|---|---|
