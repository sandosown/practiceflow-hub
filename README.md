# SympoFlo (PracticeFlow)

SympoFlo is a multi-domain operating system for entrepreneurs who wear multiple hats.

It provides structured control surfaces, domain-isolated engines, and architectural governance for complex operational environments (e.g., Group Practice, Coaching, Home, Growth).

---

## 🏗 Architectural Source of Truth

All architectural decisions are governed by the Working Canon located in `/docs`.

### Master Canon
- [PF-CANON.md](./docs/PF-CANON.md)

### Structured Canon Sections
- [00 — App Identity](./docs/00_APP_IDENTITY.md)
- [01 — Core System Philosophy](./docs/01_CORE_SYSTEM_PHILOSOPHY.md)
- [02 — Global Architecture](./docs/02_GLOBAL_ARCHITECTURE.md)
- [03 — Operating Profile Engine](./docs/03_OPERATING_PROFILE_ENGINE.md)
- [04 — Group Practice Domain](./docs/04_GROUP_PRACTICE_DOMAIN.md)
- [05 — Development Governance](./docs/05_DEVELOPMENT_GOVERNANCE.md)
- [06 — Current Development State](./docs/06_CURRENT_DEVELOPMENT_STATE.md)

All implementation must reconcile against Canon before execution.

---

## 💻 Local Development

This project uses:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

### Run Locally

```bash
git clone <YOUR_REPO_URL>
cd practiceflow-hub
npm install
npm run dev
