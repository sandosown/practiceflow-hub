# 04 — Group Practice Domain

Derived from: PF-CANON.md (Section 5)

---

## Domain Scope

First-class workspace.  
Exemplar implementation of PF structure.

---

## Control Surface Structure

- Destination control surface
- Equal-weight modules
- 2–3 column grid
- Large tap targets
- Visible empty states

---

## Canonical Modules

- Charts Requiring Action
- Office Board
- Management Center
- Client Database
- Caseload Integration
- Treatment Plan Tracker
- Supervision Structure
- Insurance Database
- Vendor Database

---

## Client Transfer & Termination

Status lifecycle:

ACTIVE  
PENDING_TRANSFER  
PENDING_TERMINATION  
DISCHARGED  
ARCHIVED  

Archive = status-based, not delete.  
Atomic reassignment rule enforced.  
Audit trail required.  
Matching logic = recommendation-only (V1).

---

## Employee Onboarding System

Worker Profile Wizard includes:

- Basics
- Credentials
- Address
- Structured multi-select inputs
- Save Draft without data loss

Database persistence required.

---

## Upload to Autofill

Located in Basics step.

Accepted:

- PDF
- DOC/DOCX
- CSV
- XLS/XLSX
- TXT

Flow:

Upload  
→ Parse  
→ Review & Confirm  
→ Write into draft  
→ Return to wizard  

Never blocks manual entry.

---

## Referral Matching Logic (V1)

- At least one overlapping tag qualifies.
- Ranking is weighted overlap.
- No auto-assignment.

Recommendation-only.
