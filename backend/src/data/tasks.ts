import { CareTask, TaskStatus } from "../types/task";

export const tasks: CareTask[] = [
  {
    id: 1,
    residentId: 1,
    assignedTo: 3,
    description: "Assist resident with morning hygiene and dressing",
    dueDate: "2026-03-13",
    status: TaskStatus.Pending,
  },
  {
    id: 2,
    residentId: 2,
    assignedTo: 2,
    description: "Measure and record resident’s blood pressure and pulse",
    dueDate: "2026-03-12",
    status: TaskStatus.InProgress,
  },
  {
    id: 3,
    residentId: 3,
    assignedTo: 3,
    description: "Assist resident with lunch feeding",
    dueDate: "2026-03-12",
    status: TaskStatus.Done,
  },
];
