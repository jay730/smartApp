const express = require("express");
import {
  getAllTasksController,
  getTaskByIdController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controller/task/taskController";

const router = express.Router();

// GET /tasks - get all tasks
router.get("/", getAllTasksController);

// GET /tasks/:id - get one task by ID
router.get("/:id", getTaskByIdController);

// POST /tasks - create a new task
router.post("/", createTaskController);

// PUT /tasks/:id - update a task
router.put("/:id", updateTaskController);

// DELETE /tasks/:id - delete a task
router.delete("/:id", deleteTaskController);

export default router;
