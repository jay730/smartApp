# CareOS Learning Curriculum
**Project:** SmartApp → CareOS Multi-Tenant Care Facility SaaS
**Total:** 65 sessions · ~44 hours
**Goal:** Build CareOS while earning proficiency across Levels 1–3

---

## How Sessions Work
1. Each session = one focused topic + one deliverable
2. You write the code — not copy/paste
3. Questions are asked to confirm understanding
4. Learning objectives are confirmed before moving on

---

## Session Progress Tracker

| # | Session | Status | File |
|---|---------|--------|------|
| 9 | Primitive Types & Variables | ✅ Complete | `backend/src/primitives.ts` |
| 10 | Arrays, Tuples & Enums | 🔄 In Progress | `backend/src/collections.ts` |
| 11 | Functions & Clean Code | ⬜ Pending | — |
| 12 | Interfaces & Objects | ⬜ Pending | — |
| 13 | Classes & Access Modifiers | ⬜ Pending | — |
| 14 | JSON & Parsing | ⬜ Pending | — |

> Update this file as you complete each session. Change ⬜ to 🔄 when started, ✅ when complete.

---

## Key Concepts Locked (Session 9)

| Concept | What You Know |
|---------|--------------|
| 5 primitive types | `string`, `number`, `boolean`, `null`, `undefined` |
| `const` | Default — binding cannot be reassigned |
| `let` | Use only when value will change |
| Type annotations | `: type` syntax tells TypeScript what a variable holds |
| `null` vs `undefined` | `null` = no value (intentional) · `undefined` = unknown/not yet set |
| Type inference | TypeScript figures out the type from the assigned value |
| Union types | `string \| null` means the variable can hold either type |

---

## Full Curriculum — All 65 Sessions

### PHASE 1 — Tools & Workflow (Sessions 1–8)

| # | Session | What You Do | Learning Items |
|---|---------|-------------|----------------|
| 1 | Terminal Navigation | Navigate project using only terminal. Create, move, delete files. | `ls`, `pwd`, `cd`, `mkdir`, `rmdir`, `mv`, `rm`, `cp`, `touch`, `cat`, `grep` |
| 2 | Git Part 1 — Local | Create a practice repo. Make commits. Inspect the log. | `clone`, `branch`, `status`, `add`, `commit`, `log` |
| 3 | Git Part 2 — Remote & Branching | Work with branches, push, pull, simulate a merge conflict, resolve it | `push`, `pull`, `fetch`, `merge`, `rebase`, `log --graph` |
| 4 | GitLab & Merge Requests | Push a branch, open an MR, understand CI/CD pipeline stages | GitLab MR workflow, CI/CD overview |
| 5 | Agile vs Waterfall + DevSecOps | Read + discussion. Answer comprehension questions. | Agile methodology, waterfall comparison, DevSecOps philosophy |
| 6 | Balanced Team & Meeting Cadence | Discussion + role-play scenarios for each meeting type | 3 disciplines (PM/Designer/Eng), standup, IPM, pre-IPM, retro, battle rhythm |
| 7 | Tickets & Product Backlog | Write 5 User Stories for CareOS in proper format | SPIKE, User Story, Requirement, UI ticket, PM/Dev acceptance tests, Linear, backlog |
| 8 | Story Points & Estimation | Estimate complexity for the first 10 CareOS build tasks | Quantitative estimation scale, engineer responsibilities |

---

### PHASE 2 — TypeScript Foundations (Sessions 9–14)

| # | Session | What You Do | Learning Items |
|---|---------|-------------|----------------|
| 9 ✅ | Primitive Types & Variables | One variable per primitive type. const vs let. Type annotations. | string, number, boolean, null, undefined, immutability, const vs let, type annotations |
| 10 🔄 | Arrays, Tuples & Enums | Model resident status as enum, room assignment as tuple, certs as array | Typed arrays, tuples, enumerated types |
| 11 | Functions & Clean Code | Write 5 typed functions. No unclear names. No nested conditionals. | Function signatures, return types, descriptive naming, cognitive complexity |
| 12 | Interfaces & Objects | Write the Resident, Staff, and Task interfaces for CareOS | Interfaces, typed objects, optional properties, readonly |
| 13 | Classes & Access Modifiers | Convert one interface into a class with methods | Classes, constructor, public/private/readonly, generics intro |
| 14 | JSON & Parsing | Manually write JSON for a facility + resident. Write TS to parse and type each. | JSON structure, serialization, parsing, JSON vs XML |

---

### PHASE 3 — Node.js & Backend Foundation (Sessions 15–22)

| # | Session | What You Do | Learning Items |
|---|---------|-------------|----------------|
| 15 | Node.js Architecture | Write a script that demos blocking vs non-blocking behavior | Event-driven model, non-blocking I/O, sync vs async |
| 16 | Promises & Async/Await | Rewrite promise chains as async/await. Understand the difference. | Promises, .then/.catch, async/await |
| 17 | Project Setup & Env Files | Create CareOS folder structure, .env, install dependencies | .env files, store/retrieve env vars, Node project structure |
| 18 | Knex Setup & DB Config | Write knexfile.ts, connect to PostgreSQL, verify connection | Knex library, connection config, db.ts |
| 19 | Migration 1 — Facilities Table | Write and run the facilities migration | Knex migrations, timestamp naming convention, SQL table structure |
| 20 | Migration 2 — Users Table | Write and run users migration with facility_id FK | Foreign keys, table relationships, migration ordering |
| 21 | SQL — Single Table Queries | Write raw SQL: SELECT, INSERT, UPDATE, DELETE with WHERE/ORDER BY | SQL fundamentals, single-table queries |
| 22 | SQL — JOINs | Write JOIN queries across facilities + users + residents | INNER JOIN, LEFT JOIN, FK relationships in queries |

---

### PHASE 4 — Express.js & Authentication (Sessions 23–30)

| # | Session | What You Do | Learning Items |
|---|---------|-------------|----------------|
| 23 | Express Core | Build a barebones Express app with 2 routes. Trace a request through the middleware chain. | Express routing, middleware, req/res lifecycle |
| 24 | Error Handling | Add try/catch, custom AppError class, error middleware | try/catch, custom errors, HTTP status codes, error middleware |
| 25 | Knex Queries in Code | Write Knex SELECT/INSERT inside a repository file (not raw SQL) | Knex library query builder, async Knex patterns |
| 26 | Controllers & Repositories Pattern | Build the facilities route → controller → repository stack | Route/controller/repo separation of concerns |
| 27 | JWT Concepts | Decode a JWT manually. Explain each of the 3 parts. | Auth vs authz, JWT structure, payload, expiry |
| 28 | Auth Route — Login | Build POST /auth/login: hash password, sign JWT | bcrypt, login endpoint, token signing |
| 29 | Authenticate Middleware | Build authenticate.ts, test it with Postman or curl | JWT verification middleware, req.user, protecting routes |
| 30 | facilityScope Middleware | Build the facilityScope query wrapper. Understand why client-supplied IDs are dangerous. | Multi-tenancy, query scoping, security model |

---

### PHASE 5 — CareOS Core Features (Sessions 31–40)

| # | Session | What You Do | Learning Items |
|---|---------|-------------|----------------|
| 31 | Role-Based Authorization | Build authorize() middleware factory, protect routes by role | Role model, 401 vs 403, middleware factory pattern |
| 32 | Residents CRUD — Routes & Controller | Build all 5 residents endpoints with controller | REST conventions, HTTP verbs, response body standards |
| 33 | Residents Repository | Build residentsRepo using facilityScope and Knex | Knex patterns, scoped queries, CRUD in repo layer |
| 34 | Staff CRUD | Build full staff routes → controller → repo | Reinforcing the full stack pattern |
| 35 | Tasks CRUD | Build tasks routes → controller → repo with status filters | Complex data model, filtering, status transitions |
| 36 | Care Notes + Handoff Flag | Build care notes endpoint with is_handoff boolean filter | Boolean flags, filtered queries, JOIN across tables |
| 37 | Audit Logging Middleware | Build auditLogger.ts, wrap all mutation routes | Middleware wrapping mutations, compliance trail, old/new value diff |
| 38 | Input Validation | Add JSON schema validation middleware to 3 key routes | Validation middleware, JSON schemas, regex input checking |
| 39 | Invitation System | Build invitation creation + token validation endpoint | Token generation, expiry, staff onboarding flow |
| 40 | Remaining Migrations | Write migrations for medications, incidents, audit_logs, attachments | Migration dependency order, FK references across migrations |

---

### PHASE 6 — Frontend (Sessions 41–51)

| # | Session | What You Do | Learning Items |
|---|---------|-------------|----------------|
| 41 | HTML Foundations | Build a static resident intake form in pure HTML | HTML structure, semantic elements, forms, attributes |
| 42 | CSS Fundamentals | Style the resident form with CSS | Selectors, box model, specificity, element styling |
| 43 | Flexbox | Build a task card layout using flexbox | Flex container/items, direction, alignment, wrapping |
| 44 | CSS Grid & Responsive Design | Build a shift dashboard grid. Add breakpoints. | Grid template, areas, media queries, responsive design |
| 45 | JavaScript Core | Write exercises using destructuring, spread, ES modules | Arrays, objects, control flow, destructuring, spread, ES modules |
| 46 | Native JS — Map, Filter, Reduce | Rewrite 3 loops using map/filter/reduce | Array.map, Array.filter, Array.reduce |
| 47 | React Intro — Components & Props | Create a ResidentCard component | React structure, functional components, JSX, props |
| 48 | React — useState | Build a task status toggle component | useState hook, state updates, re-renders |
| 49 | React — useEffect & API Calls | Fetch and display residents list from CareOS API | useEffect, fetch, loading/error states |
| 50 | React — useContext | Build an AuthContext holding current user + facilityId | useContext, global state, auth context pattern |
| 51 | Material UI | Replace raw HTML with MUI components in 2-3 views | MUI setup, pre-built components, theming |

---

### PHASE 7 — Testing (Sessions 52–58)

| # | Session | What You Do | Learning Items |
|---|---------|-------------|----------------|
| 52 | Testing Concepts + Jest Basics | Write 3 unit tests for a utility function from scratch | Unit vs integration vs e2e, Jest setup, test anatomy |
| 53 | TDD — Test First | Write failing tests for a new function. Then make them pass. | Red/green/refactor TDD cycle |
| 54 | Testing TypeScript Functions | Write unit tests for 2 repository functions | Jest + TypeScript, type-safe tests, assertions |
| 55 | Testing React Components | Write tests for ResidentCard | React Testing Library, render, queryBy, userEvent |
| 56 | Mocking in Tests | Mock the database in a controller test | When to mock, jest.mock, mocking fetch/Knex |
| 57 | Testing Backend Controllers | Write tests for the residents controller | Controller test structure, mocking repos, asserting responses |
| 58 | Cypress E2E Testing | Write an e2e test for the login flow | Cypress setup, cy.visit, cy.get, cy.intercept |

---

### PHASE 8 — Advanced & DevOps (Sessions 59–65)

| # | Session | What You Do | Learning Items |
|---|---------|-------------|----------------|
| 59 | Docker & Docker Compose | Containerize CareOS backend + PostgreSQL | Containers vs VMs, Dockerfile, docker-compose, networking |
| 60 | CI/CD Pipeline | Write a GitLab CI config for CareOS. Trace each stage. | Pipeline stages (lint/test/build/deploy), Platform One pipeline |
| 61 | VSCode Debugger | Debug a real bug in CareOS using breakpoints + call stack | Breakpoints, watch variables, call stack, stack traces |
| 62 | Code Reviews & Pair Programming | Review a sample diff. Write structured feedback. | Code review responsibilities, leading pair programming |
| 63 | VIM Basics | Complete vimtutor exercises | hjkl, gg/G, i/a/o/esc, dd/yy/p, u/ctrl+R, /, w/q |
| 64 | Web Workers | Create a Node worker thread for a background CareOS task | Worker threads, browser service workers, main thread isolation |
| 65 | Self-Documenting Code | Review CareOS code. Improve naming. Add strategic comments only. | Documentation types, when to comment, clean code principles |

---

## CareOS Build Roadmap

### Phase A — Foundation (MVP)
| Feature | Tables |
|---------|--------|
| Facility registration | facilities, users |
| Staff invitation | invitations, users |
| Resident intake | residents |
| Task management | tasks |
| Care notes | care_notes |
| Basic auth (JWT) | users, audit_logs |

### Phase B — Daily Operations
| Feature | Tables |
|---------|--------|
| Shift dashboard | tasks, shifts, residents |
| Med-pass log | medications, med_administrations |
| Shift handoff notes | care_notes (is_handoff=true) |
| Resident face sheet | residents + all linked tables |
| Incident reporting | incidents |
| Recurring tasks | task_templates, tasks |

### Phase C — Management & Compliance
| Feature | Tables |
|---------|--------|
| Audit trail viewer | audit_logs |
| Reporting dashboard | all tables |
| Family portal | users (FAMILY role), residents |
| Alerts & notifications | tasks, med_administrations |
| File attachments | attachments |
| Subscription & billing | facilities + Stripe |

---

## Role Model

| Role | Who | Key Permissions |
|------|-----|-----------------|
| SUPER_ADMIN | Platform owner | Manage facilities, billing, platform config |
| FACILITY_ADMIN | Facility manager | Create staff, configure facility, view all reports |
| NURSE / CLINICIAN | Licensed nursing staff | Full resident records, care notes, med tasks |
| CAREGIVER | Direct care workers | View assigned residents, complete tasks, add notes |
| FAMILY_PORTAL | Resident family members | Read-only: resident status, selected notes |
| AUDITOR | Compliance / inspector | Read-only: full audit trail and logs |

---

## Architecture Notes

### Multi-Tenancy
- **Logical Isolation** — single database, `facility_id` on every table
- All queries go through `facilityScope(knex, facilityId)` helper
- Never trust client-supplied facility IDs — always pull from JWT

### JWT Payload
```json
{
  "userId": "...",
  "facilityId": "...",
  "role": "CAREGIVER",
  "exp": 900
}
```

### Backend Folder Structure
```
/src
  /config       db.ts, auth.ts
  /middleware   authenticate.ts, authorize.ts, facilityScope.ts, auditLogger.ts
  /routes       auth, facilities, residents, staff, tasks, notes, medications
  /controllers  validate input, call repos, return JSON
  /repositories ONLY place Knex queries live
  /services     email.ts, scheduler.ts, alerts.ts
  /migrations   source of truth for schema
  /seeds        demo data for dev only
  app.ts
  server.ts
```
