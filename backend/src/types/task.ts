export enum TaskStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Done = "DONE",
}
export interface Task {
  id: number;
  name: string;
  residentId?: number;
  assignedTo?: number;
  description: string;
  dueDate?: string;
  status?: TaskStatus;
}
