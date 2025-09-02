export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: number; // Staff ID
  assignedBy?: number; // Staff ID who created the task
  residentId?: number; // Associated resident
  dueDate?: Date;
  completedAt?: Date;
  category: 'medical' | 'personal_care' | 'housekeeping' | 'maintenance' | 'social' | 'other';
  tags?: string[];
  fileRefs?: string[] | string; // Associated files
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: number;
  assignedBy?: number;
  residentId?: number;
  dueDate?: string;
  category: 'medical' | 'personal_care' | 'housekeeping' | 'maintenance' | 'social' | 'other';
  tags?: string[];
  notes?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  completedAt?: string;
}
