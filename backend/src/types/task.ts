import { BaseEntity } from "./base";
export enum TaskStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Done = "DONE",
}
export interface Task extends BaseEntity {
  residentId?: number;
  assignedTo?: number;
  description: string;
  dueDate?: string;
  status?: TaskStatus;
}
