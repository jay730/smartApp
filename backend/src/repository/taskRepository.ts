import { Task, CreateTaskRequest, UpdateTaskRequest } from "../model/taskInterface";
import pool from "../db";

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
      const result = await pool.query<Task>(
        `INSERT INTO tasks (
           title, description, status, priority, assignedTo, assignedBy, residentId,
           dueDate, category, tags, fileRefs, notes
         )
         VALUES (
           $1, $2, $3, $4, $5, $6, $7,
           $8, $9, $10, $11, $12
         )
         RETURNING *`,
        [
          insertData.title,
          insertData.description ?? null,
          insertData.status,
          insertData.priority,
          insertData.assignedTo ?? null,
          insertData.assignedBy ?? null,
          insertData.residentId ?? null,
          insertData.dueDate ?? null,
          insertData.category,
          insertData.tags,
          insertData.fileRefs,
          insertData.notes ?? null,
        ]
      );

    return normalizeTask(result.rows[0]);
    } catch(err){
      console.log("DB insert error:", err);
      throw err;
    }
  }

  static async getAllTasks(): Promise<Task[]> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks ORDER BY created_at DESC`
    );
    return result.rows.map(normalizeTask);
  }

  static async getTaskById(id: number): Promise<Task | undefined> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks WHERE id = $1 LIMIT 1`,
      [id]
    );
    const task = result.rows[0];
    return task ? normalizeTask(task) : undefined;
  }

  static async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC`,
      [status]
    );
    return result.rows.map(normalizeTask);
  }

  static async getTasksByPriority(priority: Task['priority']): Promise<Task[]> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks WHERE priority = $1 ORDER BY created_at DESC`,
      [priority]
    );
    return result.rows.map(normalizeTask);
  }

  static async getTasksByCategory(category: Task['category']): Promise<Task[]> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks WHERE category = $1 ORDER BY created_at DESC`,
      [category]
    );
    return result.rows.map(normalizeTask);
  }

  static async getTasksByStaff(staffId: number): Promise<Task[]> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks WHERE assignedTo = $1 ORDER BY created_at DESC`,
      [staffId]
    );
    return result.rows.map(normalizeTask);
  }

  static async getTasksByResident(residentId: number): Promise<Task[]> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks WHERE residentId = $1 ORDER BY created_at DESC`,
      [residentId]
    );
    return result.rows.map(normalizeTask);
  }

  static async getOverdueTasks(): Promise<Task[]> {
    const now = new Date();
    const result = await pool.query<Task>(
      `SELECT * FROM tasks
       WHERE dueDate < $1 AND status NOT IN ($2, $3)
       ORDER BY dueDate ASC`,
      [now, "completed", "cancelled"]
    );
    return result.rows.map(normalizeTask);
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

    const result = await pool.query<Task>(
      `UPDATE tasks
       SET
         title = COALESCE($2, title),
         description = COALESCE($3, description),
         status = COALESCE($4, status),
         priority = COALESCE($5, priority),
         assignedTo = COALESCE($6, assignedTo),
         assignedBy = COALESCE($7, assignedBy),
         residentId = COALESCE($8, residentId),
         dueDate = COALESCE($9, dueDate),
         completedAt = COALESCE($10, completedAt),
         category = COALESCE($11, category),
         tags = COALESCE($12, tags),
         fileRefs = COALESCE($13, fileRefs),
         notes = COALESCE($14, notes)
       WHERE id = $1
       RETURNING *`,
      [
        id,
        updateData.title ?? null,
        updateData.description ?? null,
        updateData.status ?? null,
        updateData.priority ?? null,
        updateData.assignedTo ?? null,
        updateData.assignedBy ?? null,
        updateData.residentId ?? null,
        updateData.dueDate ?? null,
        updateData.completedAt ?? null,
        updateData.category ?? null,
        updateData.tags ?? null,
        updateData.fileRefs ? JSON.stringify(updateData.fileRefs) : null,
        updateData.notes ?? null,
      ]
    );
    
    const updated = result.rows[0];
    return updated ? normalizeTask(updated) : undefined;
  }

  static async deleteTask(id: number): Promise<void> {
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
  }

  static async getTaskStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
  }> {
    const now = new Date();
    const result = await pool.query(
      `SELECT
         COUNT(*) as total,
         COUNT(CASE WHEN status = $1 THEN 1 END) as pending,
         COUNT(CASE WHEN status = $2 THEN 1 END) as inProgress,
         COUNT(CASE WHEN status = $3 THEN 1 END) as completed,
         COUNT(CASE WHEN status = $4 THEN 1 END) as cancelled,
         COUNT(CASE WHEN dueDate < $5 AND status NOT IN ($3, $4) THEN 1 END) as overdue
       FROM tasks`,
      ["pending", "in_progress", "completed", "cancelled", now]
    );

    return result.rows[0] as any;
  }
}
