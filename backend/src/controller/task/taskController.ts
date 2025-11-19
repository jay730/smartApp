import { Request, Response } from "express";
import { TaskRepository } from "../../repository/taskRepository";

// ---------- Get all tasks ----------
export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskRepository.getAllTasks();
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get task by ID ----------
export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID. Must be a number." });
    }

    const task = await TaskRepository.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Create task ----------
export const createTaskController = async (req: Request, res: Response) => {
  try {
    const taskData = req.body;

    // Validate required fields
    if (!taskData.title || !taskData.category) {
      return res.status(400).json({ 
        error: "Title and category are required fields." 
      });
    }

    const task = await TaskRepository.createTask(taskData);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Update task ----------
export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID. Must be a number." });
    }

    const updateData = req.body;
    const updatedTask = await TaskRepository.updateTask(id, updateData);
    
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Delete task ----------
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID. Must be a number." });
    }

    await TaskRepository.deleteTask(id);
    res.status(204).send(); // No content
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};