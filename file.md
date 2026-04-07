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
  id: number;           // required — every task must have this
  title: string;        // required
  assignedTo?: number;  // optional — task might be unassigned
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