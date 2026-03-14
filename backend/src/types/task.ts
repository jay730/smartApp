export enum TaskStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Done = "DONE",
}
export interface Task {
  id: number;
  residentId: number;
  assignedTo: number;
  description: string;
  dueDate: string;
  status: TaskStatus;
}
