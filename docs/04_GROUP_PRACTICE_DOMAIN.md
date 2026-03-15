| [← 03 — Operating Profile](03_OPERATING_PROFILE_ENGINE.md) | [📚 Index](README.md) | [05 — Development Governance →](05_DEVELOPMENT_GOVERNANCE.md) |
|---|---|---|

---

# 04 — Group Practice Domain
Derived from: PF-CANON.md
Version Timestamp: 03/13/2026 — Navigation System + Calendar + Message Board Update (previously 03/08/2026 — Phase 6 Pre-Build Canon Update)
See CHANGELOG.md for full version history.

---

## Domain Scope

First-class workspace. Exemplar implementation of PF structure.

**Sub-Engines in Group Practice:**
- PeopleHub (Worker Profiles)
- Operations (Clients, Caseload, Events, Calendar & Appointments)
- Referral Engine
- Compliance Engine (LP)
- Training Engine (Clinical Intern)
- Message Board (Communications)

---

## Control Surface Structure

- Destination control surface
- Equal-weight modules
- 2–3 column grid
- Large tap targets
- Visible empty states
- No dominant hero modules

---

## Canonical Modules (10)

1. Charts Requiring Action
2. Message Board (formerly Office Board — LOG-065)
3. Management Center
4. Client Database
5. Referral Pipeline (formerly Caseload Integration — LOG-076)
6. Treatment Plan Tracker
7. Finance Tab (LOG-077 — replaces Supervision Structure on grid)
8. Insurance Database
9. Vendor Database
10. Major Moments

**Note:** Major Moments was added as the 10th canonical module in the 03/08/2026 Phase 6 Pre-Build Canon Update. The previous locked list of 9 is superseded.
**Note:** Supervision Structure moved to More drawer — CLINICAL section (LOG-078). Finance Tab takes its grid position (LOG-077).

### Major Moments — Group Practice
- Accent: `#a78bfa` (soft violet — distinct from all operational module accents)
- Subtitle: "Your milestones and achievements."
- Core prompt: "What happened on this day?"
- Unique visual treatment: subtle scrapbook-inspired card aesthetic within dark navy doctrine
- No light or paper backgrounds — scrapbook feel achieved through card layering, typography, and soft shadow treatment
- Reflection Banner (Owner only): appears at top of GP engine dashboard, dismissible per session
- Auto-capture triggers in GP context: hire event, license approval, certification completion, first client added, client count milestones

---

## Module Name Change — LOCKED

**LOG-065**

| Old Name | New Canon Name |
|---|---|
| Office Board | Message Board |

Message Board replaces Office Board everywhere: nav label, module name, breadcrumbs, section headers, all canon references, all code.
Accent color unchanged: `#0ea5e9`

---

## Message Board — GP

**LOG-065 — LOCKED**

### Access Rule
All roles can read AND post to the Message Board.
Owner + Admin can pin posts and manage the board.
No role is read-only — everyone has a voice on the board.

### Post Types
- Announcement — practice-wide notice (pinnable)
- Reminder — recurring or deadline-based notice (pinnable)
- Notice — informational, non-urgent

### Visual Concept
Physical bulletin board metaphor.
Grid of pinned cards within the light/dark mode doctrine.
Each card has a colored pin-dot indicator using `#0ea5e9`.
Pinned cards remain at top until unpinned by Owner or Admin.

### Posting Rules
- Owner / Admin: post any type, pin any post, remove any post
- All other roles: post freely, cannot pin or remove others' posts

---

## Management Center — GP

### Management Center — Recent Activity (LOG-095)

A live activity feed appears on the Management Center page below the Staff Overview section.

Purpose: gives Owner and Admin a real-time pulse on practice activity without navigating to individual modules.

#### Feed Items

- New hire added — name, role, timestamp
- Referral received — source, status, timestamp
- Client assigned — client name, clinician name, timestamp
- Staff credential updated — name, credential type, timestamp
- Invitation accepted — name, role, timestamp
- Staff removed — name, timestamp

#### Rules

- Visible to Owner and Admin only
- Role-scoped — shows activity relevant to the practice level only
- Operational activity only — calm command center tone
- Most recent items appear first
- Maximum 10 items shown — "View all activity →" link expands full history
- This is separate from the Feed in the More drawer (which is role-scoped per individual)

---

## Referral Pipeline — GP

LOG-076 — LOCKED

Replaces Caseload Integration. The Referral Pipeline is a manual kanban workflow tracking potential clients from first contact through to active enrollment.

### Pipeline Stages

Default stages (in order):

1. New Referral
2. Contact Made
3. Pre-Screening Complete
4. Insurance Verified
5. Assigned

Custom stages (LOG-092):

- Owner can add custom stages anywhere in the chain — before, after, or between existing stages
- Custom stages are hat-scoped
- Stage order is drag-reorderable by Owner
- Default stages cannot be removed — only custom stages can be deleted. However, default stage names ARE editable — Owner can rename any stage to fit their workflow. The stage structure and position of default stages is preserved even if renamed.
- A + button appears in the stage header bar to add a new stage at that position
- Custom stage name is user-defined, max 30 characters
- All stage names — default and custom — are editable by Owner at any time. Rename is done inline on the stage column header. Stage name max 30 characters.

### Outcome Bucket Entry (LOG-093)

- Cards can be moved to outcome buckets via two methods:
  1. Drag and drop card directly into outcome bucket column
  2. Forward/back arrows on each card — desktop and mobile
- Forward arrow moves card to next stage or outcome bucket
- Back arrow moves card to previous stage
- All movements logged with user + timestamp
- Outcome buckets: Declined (muted), No Response (muted), Intake Complete (#059669)

### Outcome Buckets

- Declined
- No Response
- Intake Complete (#059669 — Active badge)

### Rules

- Manual workflow only — nothing moves automatically
- Owner + Admin: full access
- Supervisor: read only
- Clinician: own assigned referrals only
- All other roles: not visible
- Every stage movement logged with user + timestamp

### Future Phase

- Web form webhook integration
- Automated client confirmation messaging
- Insurance verification integration
- Referral source analytics

---

## Finance Tab — GP

LOG-077 — LOCKED

Financial health snapshot for practice owners and administrators.

Accent: #059669

Access: Owner + Admin only.

### V1 Scope

- Monthly Income total
- Monthly Expenses total
- Profit (auto-computed)
- What's Due (manually entered upcoming payments)
- Category breakdown for income and expenses
- Time toggle: Day / Week / Month

### Rules

- All data manually entered — no bank sync
- Not an accounting system
- Owner + Admin only — all other roles never see this

### Finance Data Architecture (Future-Proof Pipeline)

All finance entries — regardless of source — feed the same data pipeline and produce the same entry object structure. The display layer and computation logic never change based on source.

Every income and expense entry must store:

- entry_id
- hat_id (required — all objects are workspace-scoped)
- engine_source: revenue
- type: income | expense
- amount
- category
- date
- notes (optional)
- source: manual | spreadsheet_import | bank_sync | api_pull | other

V1 source is manual only. Future sources write to the identical entry object structure.

Pipeline rule:

```
Manual entry       → entry object → Finance totals → Display
Spreadsheet import → entry object → Finance totals → Display
Bank sync          → entry object → Finance totals → Display
API pull           → entry object → Finance totals → Display
```

This means:

- No restructuring of the data model when new sources are added
- No changes to display layer or computation logic when new sources are added
- Source field is present from V1 even though only manual is active
- Future phases add new source ingestion methods only — the pipeline is unchanged

### Future Phase

- Vendor-level expense breakdown
- Revenue by therapist
- Insurance reimbursement tracking
- Accountant export
- Spreadsheet import (CSV, XLSX)
- Bank sync integration
- API pull from external accounting tools
- Multi-source reconciliation view

---

## GP Calendar Layer

**LOG-073 — LOCKED**

GP Calendar is an instance of the universal Calendar component (LOG-096) with GP-specific appointment types passed as configuration. The calendar shell is not GP-specific — it is the same universal component used across all hats.

### GP Appointment Types (extends universal Operations Engine base)
Universal base types (inherited): Personal, Meeting, Session, Other
GP-specific additions:
- Client Session
- Supervision Session
- Staff Meeting
- Intake

### GP Visibility Rules
| Role | Calendar Sees |
|---|---|
| Owner (workload = No) | Full practice calendar — all appointments |
| Owner (workload = Yes) | Full practice calendar + own client sessions |
| Admin | Full practice calendar — all appointments |
| Supervisor | Own appointments + all supervisee appointments (read only) |
| Clinician | Own appointments only |
| Clinical Intern | Own appointments only |
| Business Intern | Own appointments only — non-clinical |
| Staff | Own appointments only — non-clinical |

### Supervisor Supervisee Calendar Rule
- Supervisor can tap any supervisee in their supervision list and view that person's full appointment calendar
- Read only — Supervisor cannot edit supervisee appointments
- Scoped to own supervisees only — not the full practice
- Purpose: supervision load awareness, gap identification

### Supervision Appointment Auto-Assign Rule
When a Supervisor creates a Supervision Session appointment and assigns it to a Clinician or Clinical Intern:
- Appointment appears on Supervisor's calendar
- Appointment appears on supervisee's calendar simultaneously
- Supervisee's calendar entry is labeled: "Added by [Supervisor name]"
- Supervisee cannot delete a supervisor-assigned appointment — they may only mark it as needing reschedule (which notifies Supervisor)

### Appointment → LP Compliance Linkage
Completed Supervision Session appointments may be linked to LP Compliance weekly verification records.
This is optional in V1 — not required.
Linked sessions surface in the LP Compliance audit trail.

### Appointment → Client Session Linkage
A Client Session appointment may be linked to a specific client record.
Optional in V1 — not required to create an appointment.
Linked appointments surface in the client record activity trail.

---

## Recognition System — GP

**LOG-066 — LOCKED**

### Rule
- Owner, Admin, Supervisor can give recognition
- All roles can receive recognition
- No peer-to-peer recognition in V1
- Lives in More drawer — visible to all roles
- Recognition is GP-scoped — does not appear in other hats

---

## Direct Messages — GP

**LOG-067 — LOCKED**

### Rule
- GP-scoped internal direct messaging utility
- One-to-one or small group messaging within GP workspace
- Lives in More drawer — visible to all roles
- Completely separate from Message Board (which is practice-wide broadcast)
- Cross-hat messaging is not permitted — GP messages stay in GP
- PracticeFlow is not a messaging platform — this is a scoped utility serving the virtual office communication need

---

## Feed — GP

**LOG-068 — LOCKED**

### Rule
- Live GP practice activity stream
- Role-scoped — each role sees activity relevant to their lane only
- Operational activity only — not a social feed
- Calm command center tone maintained throughout
- Lives in More drawer — visible to all roles
- Examples of feed items:
  - New client assigned to clinician
  - Supervision session logged
  - Intern hours submitted
  - Document uploaded
  - New Message Board post
  - Treatment plan updated

---

## Directory — GP

**LOG-069 — LOCKED**

### Rule
- Lives in More drawer — visible to all roles
- Role-scoped visibility:

| Role | Directory Shows |
|---|---|
| Owner | All staff |
| Admin | All staff |
| Supervisor | Clinical staff only |
| Clinician | Clinical staff only |
| Clinical Intern | Clinical staff only |
| Business Intern | Operational staff only |
| Staff | Operational staff only |

---

## People Engine — Group Practice

People Engine = Worker Profiles only.
Clients live under Operations Engine — not People Engine.

---

## Worker Profile Wizard (Employee Onboarding)

A structured questionnaire — not loose profile tabs. Sections are questions being answered, not navigational browsing tabs.

### Wizard Sections (7 — locked)
1. Basics
2. Credentials
3. Address
4. Preferred Populations
5. Presenting Issues
6. Clinical Disorders
7. Specialty Areas / Treatment Modalities

### Credentials Structure (per license card — repeatable)
- License Type
- License Number
- License State
- Expiration Date
- Status
- CAQH #
- NPI #

Multiple licenses supported. Add / edit / remove UI required.

### Multi-Select UI Patterns
- Preferred Populations → Chips
- Presenting Issues → Checklist
- Clinical Disorders → Checklist
- Specialty Areas / Modalities → Checklist

### EAP Classification
EAP lives inside Specialty Areas / Treatment Modalities — not as a presenting issue.

### Save Draft Rule
Save Draft is mandatory. Must persist partial progress and allow resumption without data loss. Database persistence required.

### Role Scoping
- Owner sees all profile fields
- Employee sees only their own permitted fields

---

## Tag Taxonomy (4 Categories — Locked)

| Category | Referral Matching Weight |
|---|---|
| PRESENTING ISSUE | +3 |
| POPULATION | +2 |
| DISORDER | +2 |
| SPECIALTY / MODALITY | +1 |
| Missing required EAP (when applicable) | Exclude clinician |

---

## Upload to Autofill

**Placement:** Button appears at the START of the Basics step. Not a tab. Not global. Not a separate import page.

**Accepted formats:** PDF, DOC/DOCX, CSV, XLS/XLSX, TXT

**Flow:**
Upload → Extract → Hydrate draft → Review & Confirm → Write into draft → Return to wizard

**Unified data pipeline:**
```
Manual:   UI → form_state → validation → save → DB
Autofill: file → extraction → draft_answers → form_state → validation → save → DB
```

Both paths feed the same pipeline. Questionnaire is the single source of truth until submission.

**Extraction output shape:**
- answers (key/value)
- repeatables (licenses/tags)
- confidence per field
- filename + file_url

Low-confidence fields must be visually highlighted for user review.

**Rules:**
- Never blocks manual entry
- No direct record creation from upload
- No background import jobs creating employees
- No silent DB writes — confirmation required before any DB write
- Upload hydrates questionnaire draft state only

**V1 Visibility:** Behind feature flag. Disabled by default at launch. Enabled per account when extraction quality is validated.

**Future categories (architected for, not V1):** Clients, Vendors, Insurance Companies.

---

## Referral Matching Logic (V1)

Uses: Populations Served, Presenting Issues, Clinical Disorders, Specialty Areas / Modalities.

- Minimum 1 overlapping tag required to qualify a clinician
- Ranking based on weighted overlap (see Tag Taxonomy)
- No auto-assignment in V1 — recommendation only
- If no match: display "Add more details to see recommendations"
- No alert-style urgency in matching display
- Recommendations are assistive, never controlling

---

## Client Status Lifecycle

```
ACTIVE
→ PENDING_TRANSFER
→ PENDING_TERMINATION
→ DISCHARGED
→ ARCHIVED
```

- Archive = status-based, never delete
- "Delete Client" language must never be exposed in UI
- Archived clients are searchable under Archive filter
- Archived rows visually grayed out
- Reactivation = Admin only, requires therapist reassignment

---

## Search — Group Practice Modules

All database modules within Group Practice include local search.
Search is scoped to the module — no cross-module search in V1.

Modules with required local search:
- Client Database (keyword, name, status, therapist)
- Worker Profiles / People Engine (name, role, credential status)
- Insurance Database (payer name, status)
- Vendor Database (vendor name, category)
- Major Moments (keyword, date, event name)
- Compliance Records (clinician name, week, status)

Search bar placement: top of module surface, above the record list.

---

## Therapist / Clinician Capacity Fields

- `capacity_max`
- `capacity_current` (computed from ACTIVE assignments)
- `availability_status`: AVAILABLE | AT_CAPACITY | ON_LEAVE

**Capacity Rule:**
Clinician eligible for assignment only if:
- `availability_status = AVAILABLE`
- `active_caseload_count < capacity_max`

**Override Rule:**
Admin may override capacity block. Override requires reason entry.
Recommended clinicians tiered above others in reassignment UI.
At-capacity clinicians hidden unless override is triggered.

---

## Assignment History Table (Required)

| Field | Description |
|---|---|
| assignment_id | Unique ID |
| client_id | Client reference |
| therapist_id | Therapist reference |
| status | ACTIVE / ENDED / TRANSFERRED |
| start_date | Assignment start |
| end_date | Assignment end |
| end_reason | Reason for ending |
| created_by | Who created the assignment |

Prevents loss of historical therapist relationships.
**Atomic transfer rule:** No client may exist without an active assignment. Reassignment must be all-or-nothing.

---

## Termination Request Table (Required)

| Field | Description |
|---|---|
| request_id | Unique ID |
| client_id | Client reference |
| therapist_id | Therapist reference |
| supervisor_id | Supervisor reference |
| termination_date | Requested termination date |
| reason_category | Dropdown reason |
| reason_detail | Free text for "Other" |
| status | DRAFT / SUBMITTED / APPROVED / DENIED / COMPLETED / OVERDUE |
| denial_reason | Required if denied |
| discharge_due_date | approval_date + 3 days (system-generated) |
| discharge_status | UNDER_DISCUSSION / COMPLETED / NOT_COMPLETED_YET |
| discharge_not_completed_reason | Required if not completed |

**Termination Reason Categories (locked):**
- Client requested new therapist
- Client no longer requires services
- Client non-adherent / repeated no-shows
- Insurance / financial
- Higher level of care needed
- Other (requires free-text entry)

**3-Day Discharge Rule:**
Discharge deadline = approval_date + 3 days (system-generated).
Overdue status auto-triggered after due date.
Reminder sent to clinician. Alert sent to supervisor.

---

## Transfer Request Table (Required)

| Field | Description |
|---|---|
| transfer_id | Unique ID |
| client_id | Client reference |
| from_therapist_id | Current therapist |
| to_therapist_id | Receiving therapist |
| initiated_by | Who initiated |
| status | DRAFT / SUBMITTED / CONFIRMED / COMPLETED / CANCELED |
| match_score | Optional weighted match summary |
| notes | Transfer notes |

---

## Permission Boundaries — Group Practice

| Role | Permissions |
|---|---|
| Clinician / Therapist | Request termination, update discharge status only |
| Supervisor | Approve / deny termination requests |
| Admin / Owner | Reassign clients, override capacity, archive / reactivate |

**UI Placement:**
- Reassign: Client Database → Client Profile → Actions
- Termination initiation: Clinician Caseload view
- Supervisor approval: Supervisor inbox (approval control node)

---

## Audit Trail

Audit trail required for all workflow transitions.
Assignment history is the permanent record.
Verified records are immutable — audit lock enforced.

---

## LP Compliance Subsystem (Compliance Engine)

LP (Limited Permit) Tracking System — end-to-end compliance lifecycle.
Lives under Compliance Engine within Group Practice domain.

**LP is a State-Regulated Compliance system — not an intern classification.**
Clinical Intern ≠ Limited Permit Therapist. These are separate roles with separate engines.

### Core Rules
- Official compliance record = weekly log only
- Daily Quick Log = optional, draft-only, does not count toward eligibility
- Hours count only after Supervisor Verification
- Verified weeks are immutable (audit lock enforced)
- Calendar-based weekly selection required (no rolling-only system)
- Backdated entries allowed — entry timestamp logged separately
- Compliance metrics computed from VERIFIED weeks only
- State-aware rule engine required — do not hardcode hour requirements
- State rules stored in configurable table keyed by State + License Track

### Weekly Lifecycle
```
Draft → Submitted → Pending Verification → Verified (locked)
```

### Supervisor Verification Records
- Supervisor ID
- Verification timestamp
- Verification type (Individual / Group)

### No Hours This Week Markers
Vacation / Illness / LOA / Holiday / Other

### Compliance Lockdown Flag
Warning-first model. Not a hard block in V1.

### Core Outputs
- Weekly Log Report
- Supervisor Verification Summary
- Therapist Progress Transcript
- Board / Eligibility Packet
- Admin Compliance Audit Report

### LP UX Rules
- Supervisor experience optimized for under 60 seconds per week review
- Admin dashboard optimized for 5-second compliance visibility
- Therapist experience must feel guided, not bureaucratic
- Daily Quick Log labeled as "Quick Log" — not compliance language

---

## Training Engine — Group Practice

Manages Clinical Intern lifecycle:
- Supervision assignment
- Caseload tracking
- Connects to Compliance Engine when Clinical Intern transitions to LP status

Business Intern does not route to Training Engine.

---

End of 04_GROUP_PRACTICE_DOMAIN.md

---

| [← 03 — Operating Profile](03_OPERATING_PROFILE_ENGINE.md) | [📚 Index](README.md) | [05 — Development Governance →](05_DEVELOPMENT_GOVERNANCE.md) |
|---|---|---|
