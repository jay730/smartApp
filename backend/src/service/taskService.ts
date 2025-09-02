import { Task, CreateTaskRequest, UpdateTaskRequest } from "../model/taskInterface";
import { TaskRepository } from "../repository/taskRepository";
import { ResidentRepository } from "../repository/residentRepository";
import { StaffRepository } from "../repository/staffRepository";

export class TaskService {
  static async createTask(data: CreateTaskRequest): Promise<Task> {
    // Validate required fields
    if (!data.title || data.title.trim() === "") {
      throw new Error("Task title is required");
    }

    if (!data.category) {
      throw new Error("Task category is required");
    }

    // Validate assignedTo staff exists
    if (data.assignedTo) {
      const staff = await StaffRepository.getStaffById(data.assignedTo);
      if (!staff) {
        throw new Error("Assigned staff member not found");
      }
    }

    // Validate assignedBy staff exists
    if (data.assignedBy) {
      const staff = await StaffRepository.getStaffById(data.assignedBy);
      if (!staff) {
        throw new Error("Staff member creating the task not found");
      }
    }

    // Validate resident exists
    if (data.residentId) {
      const resident = await ResidentRepository.getResidentById(data.residentId);
      if (!resident) {
        throw new Error("Associated resident not found");
      }
    }

    // Validate due date is in the future
    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      if (dueDate < new Date()) {
        throw new Error("Due date must be in the future");
      }
    }

    // Validate priority
    if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
      throw new Error("Invalid priority level");
    }

    // Validate status
    if (data.status && !['pending', 'in_progress', 'completed', 'cancelled'].includes(data.status)) {
      throw new Error("Invalid status");
    }

    // Validate category
    if (!['medical', 'personal_care', 'housekeeping', 'maintenance', 'social', 'other'].includes(data.category)) {
      throw new Error("Invalid category");
    }

    return TaskRepository.createTask(data);
  }

  static async getAllTasks(): Promise<Task[]> {
    return TaskRepository.getAllTasks();
  }

  static async getTaskById(id: number): Promise<Task | undefined> {
    if (isNaN(id)) {
      throw new Error("Invalid task ID");
    }
    return TaskRepository.getTaskById(id);
  }

  static async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    return TaskRepository.getTasksByStatus(status);
  }

  static async getTasksByPriority(priority: Task['priority']): Promise<Task[]> {
    return TaskRepository.getTasksByPriority(priority);
  }

  static async getTasksByCategory(category: Task['category']): Promise<Task[]> {
    return TaskRepository.getTasksByCategory(category);
  }

  static async getTasksByStaff(staffId: number): Promise<Task[]> {
    if (isNaN(staffId)) {
      throw new Error("Invalid staff ID");
    }
    return TaskRepository.getTasksByStaff(staffId);
  }

  static async getTasksByResident(residentId: number): Promise<Task[]> {
    if (isNaN(residentId)) {
      throw new Error("Invalid resident ID");
    }
    return TaskRepository.getTasksByResident(residentId);
  }

  static async getOverdueTasks(): Promise<Task[]> {
    return TaskRepository.getOverdueTasks();
  }

  static async updateTask(id: number, data: UpdateTaskRequest): Promise<Task | undefined> {
    if (isNaN(id)) {
      throw new Error("Invalid task ID");
    }

    // Validate assignedTo staff exists
    if (data.assignedTo) {
      const staff = await StaffRepository.getStaffById(data.assignedTo);
      if (!staff) {
        throw new Error("Assigned staff member not found");
      }
    }

    // Validate resident exists
    if (data.residentId) {
      const resident = await ResidentRepository.getResidentById(data.residentId);
      if (!resident) {
        throw new Error("Associated resident not found");
      }
    }

    // Validate due date is in the future (unless completing/cancelling)
    if (data.dueDate && data.status !== 'completed' && data.status !== 'cancelled') {
      const dueDate = new Date(data.dueDate);
      if (dueDate < new Date()) {
        throw new Error("Due date must be in the future for active tasks");
      }
    }

    // Validate priority
    if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
      throw new Error("Invalid priority level");
    }

    // Validate status
    if (data.status && !['pending', 'in_progress', 'completed', 'cancelled'].includes(data.status)) {
      throw new Error("Invalid status");
    }

    // Validate category
    if (data.category && !['medical', 'personal_care', 'housekeeping', 'maintenance', 'social', 'other'].includes(data.category)) {
      throw new Error("Invalid category");
    }

    // Handle status change to completed
    if (data.status === 'completed') {
      data.completedAt = new Date().toISOString();
    }

    return TaskRepository.updateTask(id, data);
  }

  static async deleteTask(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new Error("Invalid task ID");
    }

    const task = await TaskRepository.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Prevent deletion of completed tasks (for audit purposes)
    if (task.status === 'completed') {
      throw new Error("Cannot delete completed tasks");
    }

    return TaskRepository.deleteTask(id);
  }

  static async getTaskStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
  }> {
    return TaskRepository.getTaskStats();
  }

  static async bulkUpdateTaskStatus(taskIds: number[], status: Task['status']): Promise<Task[]> {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error("Task IDs array is required");
    }

    if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      throw new Error("Invalid status");
    }

    const updatedTasks: Task[] = [];
    
    for (const id of taskIds) {
      try {
        const updatedTask = await this.updateTask(id, { status });
        if (updatedTask) {
          updatedTasks.push(updatedTask);
        }
      } catch (error) {
        console.error(`Failed to update task ${id}:`, error);
      }
    }

    return updatedTasks;
  }
}
