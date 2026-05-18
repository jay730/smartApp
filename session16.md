Session 16 — Promises & Async/Await
Five concepts. Deep dive.

Concept 1 — Why Callbacks Fall Apart
You already used callbacks in Session 15. They work for one async operation. The problem is real applications chain multiple operations together.

Imagine loading a CareOS resident, then loading their assigned tasks, then loading the staff assigned to those tasks:

```typescript
getResident(1, (err, resident) => {
  if (err) return console.log(err);

  getTasksForResident(resident.id, (err, tasks) => {
    if (err) return console.log(err);

    getStaffForTask(tasks[0].assignedTo, (err, staff) => {
      if (err) return console.log(err);

      getShiftForStaff(staff.id, (err, shift) => {
        if (err) return console.log(err);
        // finally do something
      });
    });
  });
});
```

Four problems with this:

Readability — indentation keeps growing right
Error handling — you repeat if (err) at every level
Control flow — hard to run two things in parallel
Debugging — stack traces are confusing in nested callbacks
This is callback hell. Promises were invented to solve it.

Concept 2 — What a Promise Actually Is
A Promise is an object that wraps an async operation and lets you attach handlers to it later.

Three states:

Pending — operation is still running
Fulfilled — operation succeeded, value is available
Rejected — operation failed, error is available
Once a Promise is fulfilled or rejected it never changes state. It's final.

Creating a Promise manually:

```typescript
function wait(ms: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject("Cannot wait negative milliseconds");
      return;
    }
    setTimeout(() => {
      resolve(`Waited ${ms}ms`);
    }, ms);
  });
}
```

The Promise constructor takes a function with two parameters:

resolve(value) — call this when the operation succeeds
reject(error) — call this when it fails
You can only call one. Calling both does nothing — first one wins.

Concept 3 — Handling Promises with .then() and .catch()
.then() runs when the Promise fulfills. .catch() runs when it rejects:

```typescript
wait(1000)
  .then((message) => {
    console.log(message); // "Waited 1000ms"
    return "next step"; // you can return a value to chain
  })
  .then((value) => {
    console.log(value); // "next step"
  })
  .catch((error) => {
    console.log(error); // runs if ANY .then() above throws or rejects
  })
  .finally(() => {
    console.log("always runs — success or failure");
  });
```

Key rules:

.then() returns a new Promise — you can chain them
One .catch() at the end catches errors from any step above
.finally() always runs regardless of outcome
Concept 4 — Async/Await
async/await is syntactic sugar over Promises. It doesn't change how Promises work — it just makes them look synchronous.

```typescript
// With .then()
function loadResident(): void {
  fetchResident(1)
    .then((resident) => {
      console.log(resident.name);
      return fetchTasksForResident(resident.id);
    })
    .then((tasks) => {
      console.log(tasks);
    })
    .catch((err) => console.log(err));
}

// With async/await — same logic, linear reading
async function loadResident(): Promise<void> {
  try {
    const resident = await fetchResident(1);
    console.log(resident.name);

    const tasks = await fetchTasksForResident(resident.id);
    console.log(tasks);
  } catch (err) {
    console.log(err);
  }
}
```

Three rules about async/await:

Rule 1 — await can only be used inside an async function:

```typescript
// Error — await outside async
const result = await fetchResident(1);

// Correct
async function load() {
  const result = await fetchResident(1);
}
```

Rule 2 — async functions always return a Promise:

```typescript
async function getName(): Promise<string> {
return "Mary Johnson"; // wrapped in Promise automatically
}
// Caller must await it or use .then()
const name = await getName();
Rule 3 — await pauses the function, not Node.js:

async function loadTwo() {
const a = await fetchResident(1); // pauses here until done
const b = await fetchResident(2); // then pauses here
// these run sequentially — total time = time(a) + time(b)
}
//If you need both at the same time, use Promise.all:

async function loadTwo() {
const [a, b] = await Promise.all([
fetchResident(1),
fetchResident(2)
]);
// both run in parallel — total time = max(time(a), time(b))
}
```

Concept 5 — Error Handling Compared
Same operation, three error handling styles:

Callback:

```typescript
fs.readFile("residents.json", "utf-8", (err, data) => {
if (err) {
console.log("Failed:", err.message);
return;
}
console.log(data);
});
Promise (.then/.catch):

fs.promises.readFile("residents.json", "utf-8")
.then(data => console.log(data))
.catch(err => console.log("Failed:", err.message));
Async/Await:

async function loadResidents(): Promise<void> {
try {
const data = await fs.promises.readFile("residents.json", "utf-8");
console.log(data);
} catch (err) {
console.log("Failed:", err);
}
}
fs.promises.readFile is the Promise-based version of fs.readFile — no callback needed.
```

Teach It Back — answer all five:

What are the three states of a Promise? Can a Promise go from fulfilled back to pending?
pending, fulfilled, rejected. No it cannot go from fulfilled to pending.  
What is the difference between resolve and reject inside a new Promise()?
resolved is when the promise is successful and returns what is expected. reject is where it does not work and an error is thrown. 
What does .catch() catch — only the last .then(), or all of them?
.catch catches all of the .then errors. 
What does await do inside an async function? Does it pause Node.js or just the function?
it tells node to run the next line of code since it pauses the function until the callback is returned. 
You need to fetch a resident and their tasks at the same time, not one after the other. What do you use and why?
you can use a promise.all and run them in parallel. 

Break Round

Five broken snippets. Name the problem in each — don't fix the code.
```typescript
// 1
function loadFacility(id: number) {
  const result = await fetchFacility(id);
  return result;
}

// 2
async function saveResident(resident: Resident): Promise<void> {
  try {
    await insertResident(resident);
  } catch (err) {
    console.log(err);
  }
}

saveResident(newResident).then(result => {
  console.log(result.id);
});
// 3
function fetchData(): Promise<string> {
  return new Promise((resolve, reject) => {
    resolve("data ready");
    reject("something failed");
  });
}
// 4
async function loadAll() {
  const residents = await fetchResidents();
  const staff = await fetchStaff();
  const tasks = await fetchTasks();
  return { residents, staff, tasks };
}
// 5
async function getResident(id: number): Promise<Resident> {
  const resident = await fetchResident(id);
  if (!resident) {
    throw new Error("Resident not found");
  }
  return resident;
}

getResident(99);
//Name the problem in each. Paste back.

//1. only async functions can await
//2. it needs to be awaited not 
//3 you can't have resolve reject like this, it needs to have some argument like an if statement. 
//4 this needs to have a promise all 
//5 the if is running without the awaited being fulfilled and may error. 

**Q1 — Pass.** `await` outside an `async` function is a TypeScript error.
**Q2 — Partial.** You said "it needs to be awaited" — close but not precise. The function returns `Promise<void>`. `void` means no value. So `.then(result => result.id)` will always fail — `result` is `undefined`. The problem is accessing `.id` on a void return.
**Q3 — Partial.** You can have both `resolve` and `reject` in a Promise — that's normal. The problem is calling **both** in the same execution path. Once `resolve("data ready")` is called, the Promise is settled. `reject` is called right after but does nothing — it's silently ignored. This is a logic bug, not a syntax error.
**Q4 — Pass.** Three sequential awaits when all three could run in parallel with `Promise.all`.
**Q5 — Wrong.** The `await` is fulfilled before the `if` runs — that's not the issue. The real problem is that `getResident(99)` is called without `await` and without `.catch()`. If the resident isn't found, the function throws — but nobody is handling that error. It becomes an unhandled Promise rejection.

Fix your understanding on Q2, Q3, Q5. Answer these:

**Q2.** What is the actual return type of an `async` function that returns `Promise<void>`? What does that mean for `.then(result => result.id)`?
id cannot be accessed since we have a void for return. 
**Q3.** Both `resolve` and `reject` are called in the same function with no condition. What actually happens when you call `resolve` first and then `reject` immediately after?
this is a bug since reject is ignored when resolved is called, as the promise is settled. both of them are in the same execution path, probably need to put in an if else.  
**Q5.** `getResident(99)` is called with no `await` and no `.catch()`. What happens when the Promise rejects?
getresident is called without any await or try catch. 

**Q5 — Pass.** More precisely: Node.js throws an **UnhandledPromiseRejection** warning and in newer versions of Node it crashes the entire process. One unhandled rejection can take down your whole CareOS server.

---

**Apply Round**

Three tasks. Write the code.

**A.** Write the same function three ways. The function reads `facility.json` and returns the raw string content:

- Version 1 — using `fs.readFile` callback style with error handling
fs.readFile("residents.json", "utf-8", (data) => {
  console.log(data);
});
console.log("this runs immediately, before the file is ready");
- Version 2 — using `fs.promises.readFile` with `.then()` and `.catch()`
- Version 3 — using `fs.promises.readFile` with `async/await` and `try/catch`

Use the same file path you used in Session 15.

**B.** Write an `async` function called `loadTwoFiles` that reads both `facility.json` and `residents.json` at the same time using `Promise.all`. Log both results. Handle errors with `try/catch`.

**C.** Write a function called `findResidentAsync` that:
- Takes `id: number`
- Returns `Promise<Resident>`
- Simulates a delay with `setTimeout` wrapped in a `new Promise`
- Resolves with a fake resident object if `id === 1`
- Rejects with `"Resident not found"` for any other id
- Call it twice — once with id `1` and once with id `99`, handle both with `async/await`

Write all three, paste back.

Blocking code — stops everything while it waits:

// Blocking — nothing else can run while this reads the file
const data = fs.readFileSync("residents.json", "utf-8");
console.log(data);
console.log("this runs after");
Non-blocking code — hands off and moves on:

// Non-blocking — Node moves on, comes back when file is ready
fs.readFile("residents.json", "utf-8", (data) => {
  console.log(data);
});
console.log("this runs immediately, before the file is ready");