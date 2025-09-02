import { Request, Response } from "express";
import { TaskService } from "../../service/taskService";

// ---------- Get all tasks ----------
export const getAllTasksController = async (req: Request, res: Response) => {
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
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID. Must be a number." });
    }

    const task = await TaskService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get tasks by status ----------
export const getTasksByStatusController = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const tasks = await TaskService.getTasksByStatus(status as any);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get tasks by priority ----------
export const getTasksByPriorityController = async (req: Request, res: Response) => {
  try {
    const { priority } = req.params;
    if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({ error: "Invalid priority." });
    }

    const tasks = await TaskService.getTasksByPriority(priority as any);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get tasks by category ----------
export const getTasksByCategoryController = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    if (!['medical', 'personal_care', 'housekeeping', 'maintenance', 'social', 'other'].includes(category)) {
      return res.status(400).json({ error: "Invalid category." });
    }

    const tasks = await TaskService.getTasksByCategory(category as any);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get tasks by staff ----------
export const getTasksByStaffController = async (req: Request, res: Response) => {
  try {
    const staffId = Number(req.params.staffId);
    if (isNaN(staffId)) {
      return res.status(400).json({ error: "Invalid staff ID." });
    }

    const tasks = await TaskService.getTasksByStaff(staffId);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get tasks by resident ----------
export const getTasksByResidentController = async (req: Request, res: Response) => {
  try {
    const residentId = Number(req.params.residentId);
    if (isNaN(residentId)) {
      return res.status(400).json({ error: "Invalid resident ID." });
    }

    const tasks = await TaskService.getTasksByResident(residentId);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get overdue tasks ----------
export const getOverdueTasksController = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getOverdueTasks();
    res.json(tasks);
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

    const task = await TaskService.createTask(taskData);
    res.status(201).json(task);
  } catch (err: any) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes("Invalid") || err.message.includes("required")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
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
    const updatedTask = await TaskService.updateTask(id, updateData);
    
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(updatedTask);
  } catch (err: any) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes("Invalid") || err.message.includes("required")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// ---------- Delete task ----------
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID. Must be a number." });
    }

    await TaskService.deleteTask(id);
    res.status(204).send(); // No content
  } catch (err: any) {
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes("Cannot delete")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// ---------- Get task statistics ----------
export const getTaskStatsController = async (req: Request, res: Response) => {
  try {
    const stats = await TaskService.getTaskStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Bulk update task status ----------
export const bulkUpdateTaskStatusController = async (req: Request, res: Response) => {
  try {
    const { taskIds, status } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: "Task IDs array is required." });
    }

    if (!status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Valid status is required." });
    }

    const updatedTasks = await TaskService.bulkUpdateTaskStatus(taskIds, status);
    res.json({ 
      message: `Updated ${updatedTasks.length} tasks to ${status}`,
      updatedTasks 
    });
  } catch (err: any) {
    if (err.message.includes("Invalid")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
