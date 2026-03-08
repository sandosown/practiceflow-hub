# 04 — Group Practice Domain
Derived from: PF-CANON.md
Version Timestamp: 03/07/2026 — Canon Rewrite Session
See CHANGELOG.md for full version history.

---

## Domain Scope

First-class workspace. Exemplar implementation of PF structure.

**Sub-Engines in Group Practice:**
- PeopleHub (Worker Profiles)
- Operations (Clients, Caseload, Events)
- Referral Engine
- Compliance Engine (LP)
- Training Engine (Clinical Intern)
- Office Board (Communications)

---

## Control Surface Structure

- Destination control surface
- Equal-weight modules
- 2–3 column grid
- Large tap targets
- Visible empty states
- No dominant hero modules

---

## Canonical Modules (9)

1. Charts Requiring Action
2. Office Board (formerly Comms)
3. Management Center
4. Client Database
5. Caseload Integration
6. Treatment Plan Tracker
7. Supervision Structure
8. Insurance Database
9. Vendor Database

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
