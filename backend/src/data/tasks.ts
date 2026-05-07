import { Task, TaskStatus } from "../types/task";

export const tasks: Task[] = [
  {
    id: 1,
    name: "x",
    residentId: 1,
    assignedTo: 3,
    description: "Assist resident with morning hygiene and dressing",
    dueDate: "2026-03-13",
    status: TaskStatus.Pending,
  },
  {
    id: 2,
    name: "y",
    residentId: 2,
    assignedTo: 2,
    description: "Measure and record resident’s blood pressure and pulse",
    dueDate: "2026-03-12",
    status: TaskStatus.InProgress,
  },
  {
    id: 3,
    name: "z",
    residentId: 3,
    assignedTo: 3,
    description: "Assist resident with lunch feeding",
    dueDate: "2026-03-12",
    status: TaskStatus.Done,
  },
];
