import { Task } from "../model/taskInterface";
import { TaskRepository } from "../repository/taskRepository";

export class TaskService {
  static async createTask(data: Omit<Task, "id">): Promise<Task> {
    if (!data.title?.trim()) throw new Error("Task title is required");
    return TaskRepository.createTask(data);
  }

  static async getAllTasks(): Promise<Task[]> {
    return TaskRepository.getAllTasks();
  }

  static async getTaskById(id: number): Promise<Task | undefined> {
    return TaskRepository.getTaskById(id);
  }

  static async updateTask(
    id: number,
    data: Partial<Omit<Task, "id">>
  ): Promise<Task | undefined> {
    if (data.title !== undefined && data.title.trim() === "") {
      throw new Error("Task title cannot be empty");
    }
    return TaskRepository.updateTask(id, data);
  }

  static async deleteTask(id: number): Promise<void> {
    return TaskRepository.deleteTask(id);
  }
}
