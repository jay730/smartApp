## Session 12 — TypeScript Interfaces and Type Design

Four concepts. I teach, you work.

---

### Concept 1 — `interface` vs `type`

Both define the shape of an object. In most cases they're interchangeable. The difference that matters:

```typescript
// interface — can be extended, merged, implemented by classes
interface Resident {
  id: number;
  name: string;
}

interface Resident {
  roomNumber: string; // merges with the above — both declarations combine
}

// type — cannot merge, but can do unions and intersections
type ID = number | string;
type ResidentOrStaff = Resident | Staff;
```

**Rule of thumb:** Use `interface` for object shapes. Use `type` for unions, intersections, and aliases.

---

### Concept 2 — Required vs Optional Fields

```typescript
interface Task {
  id: number; // required — every task must have this
  title: string; // required
  assignedTo?: number; // optional — task might be unassigned
  completedAt?: string; // optional — not complete yet
}
```

Optional means the field can be missing entirely — not just `null`. If it exists, it must match the type.

---

### Concept 3 — Extending Interfaces

```typescript
interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

interface Resident extends BaseEntity {
  name: string;
  roomNumber: string;
  careLevel: number;
}
```

`Resident` now has all fields from `BaseEntity` plus its own. Avoids repeating `id`, `createdAt`, `updatedAt` on every type.

---

### Concept 4 — Utility Types

TypeScript gives you built-in ways to transform interfaces:

```typescript
// Partial — makes all fields optional
type UpdateResidentInput = Partial<Resident>;

// Readonly — makes all fields immutable
type FrozenResident = Readonly<Resident>;

// Omit — removes specific fields
type NewResident = Omit<Resident, "id" | "createdAt">;

// Pick — keeps only specific fields
type ResidentSummary = Pick<Resident, "id" | "name" | "roomNumber">;
```

---

**Teach It Back — answer all four:**

1. When do you use `interface` vs `type`? Give one case for each.

2. What is the difference between a required field and an optional field in an interface? What does TypeScript do if you try to create an object missing a required field?

3. You have three interfaces: `Resident`, `Staff`, `Task`. All three need `id`, `createdAt`, `updatedAt`. How do you avoid repeating those fields three times?

4. You have a full `Resident` interface but you're building an update endpoint — the caller should be able to change any field except `id`. What utility type do you use and how?

Jay-

1. interface is for object shapes. type is for unions, intersections, aliases.
2. optional means it does not have to be provided, required fields will through a 3. ts error if it is not inputted.
3. We are use a baseShape interface and extend baseShape into each of these other interfaces.
4. we would use Partial<Omit<Resident,"id">>

**Q1 — Pass.**

**Q2 — Pass.** Correct. Missing required field = TypeScript error at compile time, not runtime.

**Q3 — Pass.** Correct. `BaseEntity` extended into all three.

**Q4 — Pass.** `Partial<Omit<Resident, "id">>` — removes `id` first, then makes everything else optional. Exactly right.

---

**Break Round**

Four interfaces below. Each has a design problem. Name the problem — don't fix the code.

```typescript
// 1
interface Resident {
  id: number;
  name: string;
  roomNumber: string;
  createdAt: string;
  updatedAt: string;
  age: number;
}
```

```typescript
// 2
interface Staff {
  id: number;
  name: string;
  role: string;
  supervisorId: number;
}
```

```typescript
// 3
interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  dueDate: string;
  completedAt: string;
  notes: string;
}
```

```typescript
// 4
interface ShiftReport {
  id: number;
  shiftId: number;
  residentCount: number;
  incidentCount: number;
  createdAt: string;
}

interface IncidentReport {
  id: number;
  shiftId: number;
  residentCount: number;
  incidentCount: number;
  createdAt: string;
  severity: string;
}
```

Name the problem in each. Paste back.

Jay -

1. updatedAt needs to be optional.
2. some people will not have supervisors, optional.
3. completedAt also needs to be optional.
4. why are there two ids, maybe just have shift id. createdAt is optional.
5. why are there two ids, maybe just one id. createdAt is optional.

**2 — Pass.** `supervisorId` optional. Top-level staff have no supervisor.

**3 — Pass.** `completedAt` optional. Task isn't complete when created.

**1 — Partial.** `updatedAt` optional is valid, but you missed the bigger problem. Look at this field:

```typescript
age: number;
```

Why is storing `age` a design problem?

**4 — Partial.** You spotted duplication, but described it as "two ids." Both `id` fields are correct — each entity needs its own id. The real problem is that `IncidentReport` repeats every field from `ShiftReport` instead of extending it. What should the fix look like?

**5 — Same issue as 4.** You're looking at the wrong problem. These are two separate interfaces — one for shift reports, one for incident reports. The issue is the repeated fields, not the ids.

---

Answer these two before we move on:

**Q1.** Why is storing `age: number` on a `Resident` interface a design problem?

**Q2.** `ShiftReport` and `IncidentReport` share 5 identical fields. What's the correct TypeScript fix?

Jay -

1. not sure about age. I think this is since the age will change according do what the date is and it may show the wrong age of a person.
2. incidentReport can extend shiftReport.

**Q1 — Pass.** Exactly. `age` is derived from `dateOfBirth` — it changes every year automatically. If you store `age: 82` today, it's wrong next year. Store `dateOfBirth` and calculate age when needed.

**Q2 — Pass.** `IncidentReport extends ShiftReport` and only adds `severity`.

---

**Apply Round**

Three design tasks. Written answers only — no need to write full code, just the interface shapes and your reasoning.

**A.** Design the `Resident` interface for CareOS from scratch. Requirements:

- Must have: id, name, roomNumber, dateOfBirth, careLevel
- Should share common fields (id, createdAt, updatedAt) with other entities via a base interface
- `careLevel` defaults to 1 if not provided — reflect this correctly in the interface
- `updatedAt` can be missing on brand new records

**B.** You're building a `CreateResidentInput` type — what the caller passes in when admitting a new resident. It should not include `id`, `createdAt`, or `updatedAt`. `careLevel` should be optional. What utility types do you chain together and in what order?

**C.** You have this:

```typescript
interface Staff {
  role: string;
}
```

`role` should only ever be `"caregiver"`, `"nurse"`, or `"doctor"`. A plain `string` allows anything. What's the correct TypeScript fix and why is it better?

Jay - 

A.  interface Resident{
    id: number;
    name: string;
    roomNumber: number;
    dateOfBirth: string;
    careLevel: number | 1;
    updatedAt?: string;
}

B. 