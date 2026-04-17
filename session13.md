You're right. That was the wrong session. Scrapping the generics content — we're on **Session 13A: Classes Syntax**.

---

## Session 13A — Classes: Syntax

Five concepts.

---

### Concept 1 — Class Basics

A class is a blueprint for creating objects with shared structure and behavior:

```typescript
class Resident {
  id: number;
  name: string;
  roomNumber: string;

  constructor(id: number, name: string, roomNumber: string) {
    this.id = id;
    this.name = name;
    this.roomNumber = roomNumber;
  }

  greet(): string {
    return `Hello, my name is ${this.name}`;
  }
}

const resident = new Resident(1, "Ada Lovelace", "101A");
```

`constructor` runs once when you call `new`. `this` refers to the instance being created.

---

### Concept 2 — Access Modifiers

TypeScript has three access modifiers:

```typescript
class Staff {
  public name: string; // accessible anywhere (default)
  private password: string; // only accessible inside this class
  protected role: string; // accessible inside this class AND subclasses
}
```

`private` is enforced at **compile time** only. At runtime (JavaScript), it doesn't exist — you can still access it with bracket notation:

```typescript
const staff = new Staff();
staff["password"]; // works at runtime — TypeScript compiled away the protection
```

This is why sensitive data should never live on a class property.

---

### Concept 3 — Parameter Property Shorthand

Instead of declaring fields and assigning them manually in the constructor:

```typescript
// Long way
class Resident {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
```

Use parameter property shorthand — add the modifier directly in the constructor params:

```typescript
// Shorthand
class Resident {
  constructor(
    public id: number,
    public name: string,
    private careLevel: number = 1,
  ) {}
}
```

TypeScript declares the field and assigns it in one step. The constructor body is empty.

---

### Concept 4 — `readonly` and Inheritance

`readonly` fields can only be set in the constructor. Not after:

```typescript
class Resident {
  readonly id: number;

  constructor(id: number) {
    this.id = id; // fine
  }

  updateId(newId: number) {
    this.id = newId; // Error — cannot assign to readonly
  }
}
```

When extending a class, you must call `super()` first in the child constructor:

```typescript
class BaseEntity {
  constructor(
    public id: number,
    public createdAt: string,
  ) {}
}

class Resident extends BaseEntity {
  constructor(
    id: number,
    createdAt: string,
    public name: string,
  ) {
    super(id, createdAt); // must come first
    // now you can use this
  }
}
```

Forget `super()` and TypeScript errors immediately.

---

### Concept 5 — Detached `this` and Getters/Setters

When you pass a method as a callback, `this` loses its binding:

```typescript
class StaffService {
  private staff: Staff[] = [];

  getAll(): Staff[] {
    return this.staff;
  }
}

const service = new StaffService();
const fn = service.getAll;
fn(); // Error at runtime — this is undefined, this.staff fails
```

Fix with an arrow function property:

```typescript
class StaffService {
  private staff: Staff[] = [];

  getAll = (): Staff[] => {
    return this.staff; // arrow captures this from the class instance
  };
}
```

Getters and setters control read/write access to a field:

```typescript
class Resident {
  private _careLevel: number = 1;

  get careLevel(): number {
    return this._careLevel;
  }

  set careLevel(value: number) {
    if (value < 1 || value > 5) throw new Error("Care level must be 1–5");
    this._careLevel = value;
  }
}
```

The getter and setter must agree on type. A `get` that returns `number` and a `set` that accepts `string` is a TypeScript error.

---

**Teach It Back — answer all five:**

1. What does the `constructor` do? When does it run?

2. What are the three access modifiers and what does each one allow?

3. What is parameter property shorthand? Rewrite this the short way:

```typescript
class Task {
  id: number;
  title: string;
  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }
}
```

4. What is detached `this`? When does it happen and how do you fix it?

5. You have a getter that returns `number` and a setter that accepts `string` on the same field. What happens?

Jay -

1. a constructor runs one time when the new term is called on the class to initialize the instance.
2. public - accessible anywhere
   private - accesses only within the class
   protected - accessible within a class and subclasses
3. class Task{
   constructor(
   public id: number;
   public title: string
   ){}
   }
4. when a method defined as a regular function is used in a callback, the this binding is detached. This can be fixed by defining the function as a arrow function.
5. They need to agree on the same type. this will give a typescript error.

````

**Q1 — Pass.**
**Q2 — Pass.**
**Q4 — Pass.**
**Q5 — Pass.**

**Q3 — Concept right, syntax issue.**

Semicolons inside the constructor parameter list should be commas:

```typescript
// Your version — invalid syntax
constructor(
  public id: number;   // semicolon — wrong
  public title: string
){}

// Correct
constructor(
  public id: number,   // comma
  public title: string
){}
````

Parameters are always comma-separated regardless of where they appear. Semicolons are for interface and object body fields.

---

**Break Round**

Five broken snippets. Name the problem in each — don't fix the code.

```typescript
// 1
class StaffService {
  private staff: Staff[] = [];

  getAll(): Staff[] {
    return this.staff;
  }
}

const service = new StaffService();
const fn = service.getAll;
setTimeout(fn, 1000);
```

```typescript
// 2
class Resident {
  readonly id: number;

  constructor(id: number) {
    this.id = id;
  }

  updateRoom(roomNumber: string) {
    this.id = this.id + 1;
    this.roomNumber = roomNumber;
  }
}
```

```typescript
// 3
class Staff {
  public password: string;

  constructor(password: string) {
    this.password = password;
  }
}
```

```typescript
// 4
class BaseEntity {
  constructor(public id: number) {}
}

class Task extends BaseEntity {
  constructor(
    id: number,
    public title: string,
  ) {
    this.title = title;
    super(id);
  }
}
```

```typescript
// 5
class Resident {
  private _careLevel: number = 1;

  get careLevel(): number {
    return this._careLevel;
  }

  set careLevel(value: string) {
    this._careLevel = Number(value);
  }
}
```

Name the problem in each. Paste back.
Jay -

1.  This needs to be an arrow function since the callback will fail.
2.  roomNumber is not declared in the constructor and cannot be added like this.
3.  password should be private since we do not want to expose this to anyone.
4.  id is already in the BaseEntity, not need to have it again in task
5.  get and set need to agree on a type. this will throw a typescript error.

**1 — Pass.** Detached `this` — needs arrow function.
**3 — Pass.** `public` on a password exposes it — needs `private`.
**5 — Pass.** Getter returns `number`, setter accepts `string` — type mismatch, TypeScript error.

**2 — Partial.** You caught `roomNumber` not being declared, but missed the main problem. Look at this line:

```typescript
this.id = this.id + 1;
```

`id` is `readonly`. What happens when you try to reassign it outside the constructor?

**4 — Wrong.** You can still pass `id` as a parameter — that's fine. Look at the order of these two lines:

```typescript
this.title = title; // line 1
super(id); // line 2
```

What rule does this break?

---

Answer both corrections before we move to Apply.
Jay - 2. we cannot do a this.id = this.id+1. Id is readonly and cannot be changed like this. 4. the super(id) needs to be before the this.title since id comes first. roomNumber is also not declared in the constructor.

**2 — Pass.** Correct. `readonly` fields cannot be reassigned after the constructor. Any attempt is a TypeScript error.

**4 — Partial.** You got `super(id)` must come first — that's the main problem. But `roomNumber` isn't in this snippet. `title` is the field here, and it is declared (`public title: string` in the constructor params). Don't add problems that aren't there.

The one issue: `super()` must be the first line in any child constructor. Anything before it is a TypeScript error.

---

**Apply Round**

Three tasks. Write the code.

**A.** Convert this plain object into a class using parameter property shorthand. Add `private` to `password`, make `id` readonly, and add a getter for `careLevel` that throws if the value is ever below 1:

```typescript
const staff = {
  id: number,
  name: string,
  password: string,
  careLevel: number,
  role: "nurse" | "doctor" | "caregiver",
};
```

**B.** Fix this broken class:

```typescript
class Task extends BaseEntity {
  constructor(
    id: number,
    public title: string,
    public assignedTo?: number,
  ) {
    this.title = title;
    super(id);
  }
}
```

**C.** This class exposes data it shouldn't and has a detached `this` problem. Fix both:

```typescript
class ResidentService {
  public residents: Resident[] = [];

  getAll(): Resident[] {
    return this.residents;
  }

  getById(id: number): Resident | undefined {
    return this.residents.find((r) => r.id === id);
  }
}
```

Write all three, paste back.
Jay -
A.

```typescript
class Staff{
    constructor(
        public readonly id: number;
        public name: string;
        private password: string,
        public careLevel: number=1,
    ){}
}
```

B.

```typescript
class Task extends BaseEntity {
  constructor(
    id: number,
    public title: string,
    public assignedTo?: number,
  ) {
    super(id);
    this.title = title;
  }
}
```

C.

```typescript
class ResidentService {
  private residents: Resident[] = [];

  getAll(): Resident[] {
    return this.residents;
  }

  getById(id: number): Resident | undefined {
    return this.residents.find((r) => r.id === id);
  }
}
```

**B — Pass.** `super(id)` first. Note: `this.title = title` is redundant — `public title: string` in the params already assigns it. Remove that line.

**A — Three issues.**

1. Semicolons again in constructor params — commas only.
2. Missing `role` field from the original object.
3. You didn't add the getter for `careLevel` — the spec asked for one that throws if value is below 1.

**C — Half fixed.** `residents` is now `private` — correct. But the detached `this` problem is still there. Both methods are still regular functions. If passed as callbacks, `this` breaks. Convert them to arrow function properties:

```typescript
getAll = (): Resident[] => {
  return this.residents;
};

getById = (id: number): Resident | undefined => {
  return this.residents.find((r) => r.id === id);
};
```

---

Fix all three — paste back.

A.

```typescript
class Staff{
    constructor(
        public readonly id: number,
        public name: string,
        private password: string,
        public careLevel: number=1,
        public role: "nurse" | "doctor" | "caregiver",
    ){}

     get careLevel(): number {
    return this._careLevel;
  }
}
```

C.
