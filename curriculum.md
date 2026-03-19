## PHASE 1 — Tools & Workflow
Session	Depth	Est. Length
1	Terminal Navigation	Practice-heavy. You navigate the actual CareOS folder structure, create/move/delete real files, and recover from mistakes.	75 min
2	Git Part 1 — Local	You make real commits with meaningful messages. We inspect the object model — what Git is actually storing.	75 min
3	Git Part 2 — Remote & Branching	We simulate a real merge conflict using two branches you both edit. You resolve it manually, no shortcuts.	90 min
4	GitLab & Merge Requests	You open a real MR, trace CI/CD stages, and write an actual MR description as if a senior is reviewing it.	60 min
5	Agile vs Waterfall + DevSecOps	Discussion + written comprehension answers. I push back on vague answers until concepts are precise.	60 min
6	Balanced Team & Meeting Cadence	Role-play 3 meeting types. You play the engineer role in each.	60 min
7	Tickets & Product Backlog	You write 5 User Stories, then I critique them and you rewrite. Acceptance tests must be specific and testable.	90 min
8	Story Points & Estimation	You estimate 10 tasks, explain each number, and we debate the hardest ones.	60 min
Phase 1 total: ~9 hrs

# PHASE 2 — TypeScript Foundations
## Session	Depth	Est. Length
9	Primitive Types & Variables	You annotate every variable, explain every const vs let choice. I ask "why" until you can defend it.	60 min
10	Arrays, Tuples & Enums	You build out the enums you already have + add tuples for room/bed. We discuss when NOT to use an enum.	75 min
Session 11A — Functions: Mechanics
Break: optional param before required, return type mismatch, this in arrow vs regular, bad rest param placement
Apply: redesign a 5-flag function signature, decide arrow vs regular, decide overload vs separate
Gate: write getStaffByRole cold, explain this in arrow vs regular, explain ? vs default
Session 11B — Functions: Design
Break: processResident violating SRP, boolean flag smell, console.log in utility, nested ifs vs early returns
Apply: audit a messy 35-line function, rename handleData cold, identify pure vs impure without labels
Gate: fix a deliberately dirtied taskService.ts with no hints
Session 12 — Interfaces
Break: mutate a readonly field, prove shallow readonly with nested object, optional without null check, conflicting extends, index signature conflict
Apply: design MedicationRecord from plain English, replace any, extract a shared base interface
Gate: write AuditLogEntry cold, explain interface vs type alias, explain shallow readonly
Session 13A — Classes: Syntax
Break: access private at runtime, set readonly after constructor, forget super(), detached this, getter/setter type mismatch
Apply: convert a plain object literal, fix missing constructor injection, fix public password
Gate: write ResidentService cold, explain parameter property shorthand, explain detached this
Session 13B — Classes: Design & Generics
Break: infer T without argument, call static via this, incompatible return type override, demonstrate duplication pain
Apply: extract BaseService<T> from 3 duplicate classes, split a 12-method class, decide class vs functions on a module
Gate: build BaseService<T> with all 3 services cold, explain T, explain class vs functions with a CareOS example
14	JSON & Parsing	You write facility JSON by hand, parse it in TypeScript with type guards, and explain why JSON.parse returns any.	75 min
Phase 2 total: ~10 hrs

PHASE 3 — Node.js & Backend Foundation
#	Session	Depth	Est. Length
15	Node.js Architecture	You write blocking vs non-blocking scripts, observe the difference, and explain the event loop in your own words.	75 min
16	Promises & Async/Await	You write the same function 3 ways: callbacks, .then, async/await. Error handling in all 3.	90 min
17	Project Setup & Env Files	You scaffold the full CareOS folder structure and explain what each folder is for before writing a single file.	75 min
18	Knex Setup & DB Config	You write knexfile.ts, wire up db.ts, and verify the connection prints success — nothing copy-pasted.	75 min
19	Migration 1 — Facilities Table	You write the migration, explain every column + constraint, run it, and inspect the table in psql.	75 min
20	Migration 2 — Users Table	You write the FK, explain referential integrity, and intentionally break it to see the DB error.	75 min
21	SQL — Single Table Queries	You write all 4 CRUD operations in raw SQL, run them in psql, and read the output.	75 min
22	SQL — JOINs	You write 3 JOIN queries from scratch. I give you the business question; you figure out the SQL.	90 min
Phase 3 total: ~10 hrs

PHASE 4 — Express.js & Authentication
#	Session	Depth	Est. Length
23	Express Core	You build the app, trace a request through every middleware by hand using console.log, then remove the logs.	90 min
24	Error Handling	You build AppError, write the error middleware, and test every HTTP status code path deliberately.	90 min
25	Knex Queries in Code	You write real Knex queries inside a repo file and explain why the repo layer exists separately from the controller.	75 min
26	Controllers & Repositories Pattern	You build the full facilities stack — route → controller → repo — and explain the responsibility of each layer.	90 min
27	JWT Concepts	You decode a real JWT at jwt.io, explain header/payload/signature, then explain why the signature matters.	60 min
28	Auth Route — Login	You build the full login endpoint: find user, compare bcrypt hash, sign JWT, return token.	90 min
29	Authenticate Middleware	You build authenticate.ts, test valid + expired + missing tokens, explain req.user.	75 min
30	facilityScope Middleware	You build the scope wrapper, then I show you what happens without it — you explain the security hole.	90 min
Phase 4 total: ~11 hrs

PHASE 5 — CareOS Core Features
#	Session	Depth	Est. Length
31	Role-Based Authorization	You build the authorize() factory, test it for every role, and explain 401 vs 403 precisely.	75 min
32	Residents CRUD — Routes & Controller	You build all 5 endpoints. I test them with curl and you fix anything that doesn't return the right shape.	90 min
33	Residents Repository	You write the full repo with facilityScope on every query. I verify there's no unscoped query.	75 min
34	Staff CRUD	You build the full stack independently. Less guidance than residents — this is reinforcement.	75 min
35	Tasks CRUD	You add status filter logic. I give you filter requirements as plain English; you translate to Knex.	90 min
36	Care Notes + Handoff Flag	You build the endpoint, add the boolean filter, and explain the JOIN required to include resident data.	75 min
37	Audit Logging Middleware	You build auditLogger.ts that captures before/after state of every mutation.	90 min
38	Input Validation	You add JSON schema validation to 3 routes and explain why you validate at the boundary not inside services.	75 min
39	Invitation System	You build token generation, email invite flow, and token validation from scratch.	90 min
40	Remaining Migrations	You write all 4 remaining migrations in dependency order and explain why that order is required.	75 min
Phase 5 total: ~13 hrs

PHASE 6 — Frontend
#	Session	Depth	Est. Length
41	HTML Foundations	You build a complete resident intake form with all field types. No divs where semantic elements belong.	75 min
42	CSS Fundamentals	You style the form, explain specificity conflicts, and fix 2 bugs I deliberately introduce.	75 min
43	Flexbox	You build the task card layout. I give you a screenshot; you match it using only flexbox.	75 min
44	CSS Grid & Responsive Design	You build the shift dashboard. Must work at 3 breakpoints.	90 min
45	JavaScript Core	You do 10 exercises using only the new syntax. No loops where destructuring/spread applies.	90 min
46	Native JS — Map, Filter, Reduce	You rewrite 3 loops. Then I give you a new problem and you pick the right method and explain why.	75 min
47	React Intro — Components & Props	You build ResidentCard. I change the props interface; you update the component to match.	75 min
48	React — useState	You build the task toggle. You explain what triggers a re-render and what doesn't.	75 min
49	React — useEffect & API Calls	You fetch real CareOS data, handle loading + error states, and explain the dependency array.	90 min
50	React — useContext	You build AuthContext, wire it to login, and consume it in 2 components.	90 min
51	Material UI	You replace raw HTML in 3 views with MUI. You explain what theming does and how to override a component.	75 min
Phase 6 total: ~14 hrs

PHASE 7 — Testing
#	Session	Depth	Est. Length
52	Testing Concepts + Jest Basics	You write 3 tests, explain unit vs integration vs e2e, and set up Jest in CareOS.	75 min
53	TDD — Test First	You write failing tests first, then implement. I verify you didn't write implementation first and backfill tests.	90 min
54	Testing TypeScript Functions	You write type-safe tests for 2 real repo functions.	75 min
55	Testing React Components	You test ResidentCard with RTL. You explain what queryBy vs getBy means and when to use each.	75 min
56	Mocking in Tests	You mock the database layer, explain why, and show the test still has value without a real DB.	90 min
57	Testing Backend Controllers	You write tests for the residents controller using mocked repos. I check for false positives.	90 min
58	Cypress E2E Testing	You write the login flow test end-to-end. You add an intercept assertion to verify the API was called.	90 min
Phase 7 total: ~9 hrs

PHASE 8 — Advanced & DevOps
#	Session	Depth	Est. Length
59	Docker & Docker Compose	You write the Dockerfile and compose file. CareOS must boot with one command. You explain each instruction.	90 min
60	CI/CD Pipeline	You write the full GitLab CI config with lint/test/build stages. You trace what happens on a failed test.	90 min
61	VSCode Debugger	I give you a real bug in CareOS (wrong data returned). You find it using only breakpoints — no console.log.	75 min
62	Code Reviews & Pair Programming	You review a sample diff I provide. Your feedback must be specific, kind, and actionable — not vague.	60 min
63	VIM Basics	You complete vimtutor. Then edit a real CareOS file using only VIM — no mouse.	75 min
64	Web Workers	You move a background CareOS task (e.g., report generation) into a worker thread.	75 min
65	Self-Documenting Code	You audit 3 CareOS files, rename unclear variables, and add comments only where the logic can't speak for itself.	75 min
Phase 8 total: ~9 hrs

Grand Total
Phase	Sessions	No-Limit Est.
Tools & Workflow	1–8	~9 hrs
TypeScript	9–14	~10 hrs
Node + DB	15–22	~10 hrs
Express + Auth	23–30	~11 hrs
CareOS Features	31–40	~13 hrs
Frontend	41–51	~14 hrs
Testing	52–58	~9 hrs
Advanced	59–65	~9 hrs
Total	65	~85 hrs

Level 1 — Current Standard
"You can defend what you built before we move on."

You built it, it works, you can explain your choices if I ask. I'm driving the questions.

Level 2 — Teach It Back
"Explain this concept to me as if I've never seen it. No notes."

You're not answering my questions anymore — you're generating the explanation unprompted. If your explanation has gaps, you don't know it yet. Based on the Feynman technique: if you can't teach it simply, you only think you understand it.

Level 3 — Break It Deliberately
"Introduce the exact bug that would cause this to fail. Explain precisely why it breaks."

Anyone can write working code by following a pattern. Breaking it on purpose in the right way proves you understand the mechanism, not just the outcome. This is how senior engineers think — they know every failure mode before writing a line.

Level 4 — Apply It Without Being Told To
"I give you a new problem. You recognize which concept applies and use it — without me pointing to it."

The hardest real-world skill. I stop labeling sessions. I give you a feature request in plain English and you figure out: this needs a middleware, this needs a JOIN, this needs a class. No scaffolding, no hints.

The Highest Standard
Combine all three:

"You can teach it cold, break it on purpose, and apply it in a context you've never seen — without notes, without prompting, and without me asking."

That's the standard used in medical residency (see one, do one, teach one), military training, and law school Socratic method. It's also the standard a senior engineer holds themselves to before they'd put code in production on a system where failure has real consequences — which, for a healthcare app, it does.
