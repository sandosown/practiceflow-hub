# SESSION_CONTEXT.md — End of Session Update Prompt

Use this prompt at the end of every work session to generate an updated SESSION_CONTEXT.md.
Download the file and push it to docs/ in the repo to replace the previous version.

---

## THE PROMPT (copy and paste at end of every session)

---

Please generate an updated SESSION_CONTEXT.md for the SympoFlo / PracticeFlow project.

Use everything from our conversation this session plus the existing SESSION_CONTEXT.md already in the repo. The new file should completely replace the old one.

Include the following sections in this exact order:

**1. FILE HEADER**
- App name: SympoFlo / PracticeFlow
- Last updated: [today's date]
- Repo: github.com/sandosown/practiceflow-hub
- Build tool: Lovable
- Canon location: /docs folder in repo

**2. HOW TO USE THIS FILE**
- Instructions for pasting into a new Claude session
- Exact opening line to use: "Read this and orient yourself before we continue."

**3. WHAT THIS APP IS**
- Core concept and emotional target
- SympoFlo capitalization rule
- The core promise quote

**4. ENGINE PHILOSOPHY**
- The foundational doctrine statement
- Full hierarchy diagram
- All 6 universal engines with descriptions
- 2 specialized engines
- Context Isolation Principle

**5. WORKSPACES**
- Full workspace table with status
- Workspace naming rules

**6. ROLE SYSTEM**
- Full role table
- Subtypes for Clinician and Intern

**7. DEMO USERS**
- Full current demo user roster as a table

**8. VISUAL DOCTRINE**
- Full color token table
- Card system rules
- All non-negotiable rules (no red/rose/pink, uppercase labels, border-only buttons)
- Radar card gradient note
- Light/Dark mode deferred status
- Full domain accent map for GP modules

**9. PHASE STATUS**
- Full phase table with current statuses
- What phase is NEXT and what it involves

**10. NEXT BUILD**
- The exact next task to pick up
- Any prompts already written and ready to paste
- Build order if applicable

**11. MAJOR MOMENTS SPEC**
- Full locked copy table
- Capture form fields in order
- Engine-specific reflection messaging
- All behavioral rules

**12. AUTOMATION MODEL**
- Suggestion chip rules
- Template-based approach

**13. BUILD WORKFLOW**
- Step by step Claude → Lovable → screenshot → approve → push
- Important protection rules

**14. GIT WORKFLOW**
- Full git commands
- Conflict resolution commands

**15. KEY FILES IN CODEBASE**
- Table of all important files and their purpose
- Build status per dashboard file

**16. CANON FILES**
- Table of all canon files and what they contain
- Canon rule statement

**17. LOCKED COPY**
- Table of all UI copy that is canon-locked and must never change

**18. DECISION LOG — THIS SESSION**
- All new LOG entries made this session with their ID, description, and status
- Any previously open logs that were resolved or voided this session

**19. OUTSTANDING DECISIONS**
- All unresolved items from the full decision log
- Items deferred to future sessions

**20. APPROVED THIS SESSION**
- List every component or feature that was screenshot-verified and approved this session

**21. DESIGN SCOPE REFERENCE**
- Entrepreneur types note (marketing consideration only, not canon)

Format the output as a clean .md file I can download and push directly to docs/SESSION_CONTEXT.md in the repo to replace the existing file. Do not summarize — write the full file with all details populated.

---

## HOW TO PUSH THE UPDATED FILE

After downloading the generated SESSION_CONTEXT.md:

```
cd ~/Desktop/practiceflow-hub
cp ~/Downloads/SESSION_CONTEXT.md docs/
git add .
git commit -m "Update SESSION_CONTEXT.md — [today's date]"
git push origin main
```

---

## HOW TO START THE NEXT SESSION

Open docs/SESSION_CONTEXT.md from your GitHub repo.
Copy the full contents.
Paste into a new Claude chat with:

"Read this and orient yourself before we continue."

Claude will confirm it has read the file and is ready to build.
