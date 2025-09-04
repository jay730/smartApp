export interface Task {
  id: number; // random 6-digit number
  title: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  assignedTo?: number; // Staff ID
  assignedBy?: number; // Staff ID who created the task
  residentId?: number; // Associated resident
  dueDate?: Date;
  completedAt?: Date;
  category?:
    | "medical"
    | "personal_care"
    | "housekeeping"
    | "maintenance"
    | "social"
    | "other";
  tags?: string[];
  fileRefs?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// For creation
// export type TaskCreateData = Omit<Task, "id" | "createdAt" | "updatedAt">;

// For updates
// export type TaskUpdateData = Partial<
//   Omit<Task, "id" | "createdAt" | "updatedAt">
// >;
