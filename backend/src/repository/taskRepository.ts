import { Task } from "../model/taskInterface";
import knex from "../db";

// Generate random 6-digit ID
function generateId(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export class TaskRepository {
  static async createTask(data: Omit<Task, "id">): Promise<Task> {
    const task: Task = {
      id: generateId(),
      ...data,
    };

    const [newTask] = await knex<Task>("tasks").insert(task).returning("*");
    return newTask;
  }

  static async getAllTasks(): Promise<Task[]> {
    return knex<Task>("tasks").select("*").orderBy("created_at", "desc");
  }

  static async getTaskById(id: number): Promise<Task | undefined> {
    return knex<Task>("tasks").where({ id }).first();
  }

  static async updateTask(
    id: number,
    data: Partial<Omit<Task, "id">>
  ): Promise<Task | undefined> {
    const [updated] = await knex<Task>("tasks")
      .where({ id })
      .update(data)
      .returning("*");

    return updated;
  }

  static async deleteTask(id: number): Promise<void> {
    await knex<Task>("tasks").where({ id }).delete();
  }
}
