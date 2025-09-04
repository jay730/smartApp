import { Request, Response } from "express";
import { TaskService } from "../../service/taskService";

// ---------- Get all tasks ----------
export const getAllTasksController = async (_req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getAllTasks();
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get task by ID ----------
export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const task = await TaskService.getTaskById(id);

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Create task ----------
export const createTaskController = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ---------- Update task ----------
export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedTask = await TaskService.updateTask(id, req.body);

    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ---------- Delete task ----------
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await TaskService.deleteTask(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
