# 02 — Global Architecture

Derived from: PF-CANON.md (Section 3)

---

## Multi-Hat (Workspace) Model

The system supports multiple Workspaces (Domains/Hats).

Workspaces are user-selected during onboarding.

Group Practice is a first-class workspace but is NOT universally required.

---

## Identity → Mode → Workspace Layers

Runtime separation:

1. Identity (Role)
2. Mode (Control vs Action)
3. Workspace (Domain/Hat)

These must remain structurally independent.

---

## Boot Sequence

Mode 0: Identity Gate

Authentication  
→ Role Resolve  
→ Mode Assignment  
→ Workspace Load  
→ Interface Render

Session context must include:

- user_id
- practice_id
- role
- mode (CONTROL | ACTION)
- visibility_scope
- workflow_scope

---

## Mode System

### Control Mode

- Monitor
- Prioritize
- Assign
- Verify

Desktop-first orientation.  
Attention layer appears before tools.

### Action Mode

- See
- Do
- Confirm
- Done

Mobile-first orientation.  
Clarity > density.

---

## Engine Architecture (Universal Infrastructure)

Engines are universal.  
Workspaces are contextual containers.

V1 Engines:

1. People Engine — relational identity only  
2. Operations Engine — workflows + event lifecycle + asset tracker  
3. Revenue Engine — income + lightweight expenses  
4. Growth Engine — KPIs + pipeline awareness  
5. Compliance Engine — contracts + expiration tracking  
6. Personal/Life Engine — household + goals  
7. Document Control System — centralized registry  

Engine activation must trigger guided setup.  
No blank dashboards.

---

## Event Lifecycle (Operations Engine)

Pre-Event  
During Event  
Post-Event  

Events are not calendars.  
Events are not projects.

---

## Automation Model

Automation is:

Structured  
Guided  
Suggestive  

Never:

- Intrusive
- Modal-heavy
- Auto-flooding
- Agency-removing

---

## Compliance Constraint

HIPAA-level compliance is a required architectural constraint.

The following are NOT canonically locked:

- Multi-tenant SaaS assumption
- Marketplace/plugin ecosystem
- Stripe/scheduling as first-class V1 systems
- White-label SaaS intent
