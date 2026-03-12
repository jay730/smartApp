export enum TaskStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Done = "DONE",
}
export interface CareTask {
  id: number;
  residentId: number;
  assignedTo: number;
  description: string;
  dueDate: string;
  status: TaskStatus;
}
