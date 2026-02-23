import { Task, CreateTaskRequest, UpdateTaskRequest } from "../model/taskInterface";
import knex from "../db";

function normalizeTask(task: Task): Task {
  // Normalize fileRefs if it's a string
  if (typeof task.fileRefs === "string") {
    try {
      task.fileRefs = JSON.parse(task.fileRefs);
    } catch {
      task.fileRefs = [];
    }
  }

  // Normalize tags if it's a string
  if (typeof task.tags === "string") {
    try {
      task.tags = JSON.parse(task.tags);
    } catch {
      task.tags = [];
    }
  }

  return task;
}

export class TaskRepository {
  static async createTask(data: CreateTaskRequest): Promise<Task> {
    
    const insertData: any = {
      ...data,
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      tags: data.tags ? JSON.stringify(data.tags) : '[]',
      fileRefs: '[]'
    };
    console.log("Insert data:", insertData);
    try{
      const [newTask] = await knex<Task>("tasks")
      .insert(insertData)
      .returning("*");

    return normalizeTask(newTask);
    } catch(err){
      console.log("DB insert error:", err);
      throw err;
    }
  }

  static async getAllTasks(): Promise<Task[]> {
    const tasks = await knex<Task>("tasks")
      .select("*")
      .orderBy("created_at", "desc");
    
    return tasks.map(normalizeTask);
  }

  static async getTaskById(id: number): Promise<Task | undefined> {
    const task = await knex<Task>("tasks").where({ id }).first();
    return task ? normalizeTask(task) : undefined;
  }

  static async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    const tasks = await knex<Task>("tasks")
      .where({ status })
      .orderBy("created_at", "desc");
    
    return tasks.map(normalizeTask);
  }

  static async getTasksByPriority(priority: Task['priority']): Promise<Task[]> {
    const tasks = await knex<Task>("tasks")
      .where({ priority })
      .orderBy("created_at", "desc");
    
    return tasks.map(normalizeTask);
  }

  static async getTasksByCategory(category: Task['category']): Promise<Task[]> {
    const tasks = await knex<Task>("tasks")
      .where({ category })
      .orderBy("created_at", "desc");
    
    return tasks.map(normalizeTask);
  }

  static async getTasksByStaff(staffId: number): Promise<Task[]> {
    const tasks = await knex<Task>("tasks")
      .where({ assignedTo: staffId })
      .orderBy("created_at", "desc");
    
    return tasks.map(normalizeTask);
  }

  static async getTasksByResident(residentId: number): Promise<Task[]> {
    const tasks = await knex<Task>("tasks")
      .where({ residentId })
      .orderBy("created_at", "desc");
    
    return tasks.map(normalizeTask);
  }

  static async getOverdueTasks(): Promise<Task[]> {
    const now = new Date();
    const tasks = await knex<Task>("tasks")
      .where("dueDate", "<", now)
      .whereNot("status", "completed")
      .whereNot("status", "cancelled")
      .orderBy("dueDate", "asc");
    
    return tasks.map(normalizeTask);
  }

  static async updateTask(id: number, data: UpdateTaskRequest): Promise<Task | undefined> {
    const updateData: any = { ...data };
    
    // Handle tags array
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags);
    }

    // Handle completedAt for status changes
    if (data.status === 'completed' && !data.completedAt) {
      updateData.completedAt = new Date();
    }

    const [updated] = await knex<Task>("tasks")
      .where({ id })
      .update(updateData)
      .returning("*");
    
    return updated ? normalizeTask(updated) : undefined;
  }

  static async deleteTask(id: number): Promise<void> {
    await knex<Task>("tasks").where({ id }).delete();
  }

  static async getTaskStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
  }> {
    const [stats] = await knex("tasks")
      .select(
        knex.raw('COUNT(*) as total'),
        knex.raw('COUNT(CASE WHEN status = ? THEN 1 END) as pending', ['pending']),
        knex.raw('COUNT(CASE WHEN status = ? THEN 1 END) as inProgress', ['in_progress']),
        knex.raw('COUNT(CASE WHEN status = ? THEN 1 END) as completed', ['completed']),
        knex.raw('COUNT(CASE WHEN status = ? THEN 1 END) as cancelled', ['cancelled']),
        knex.raw('COUNT(CASE WHEN due_date < ? AND status NOT IN (?, ?) THEN 1 END) as overdue', [
          new Date(),
          'completed',
          'cancelled'
        ])
      );

    return stats as any;
  }
}
