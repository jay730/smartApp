import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create tasks table
  await knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description");
    table.enum("status", ["pending", "in_progress", "completed", "cancelled"]).defaultTo("pending");
    table.enum("priority", ["low", "medium", "high", "urgent"]).defaultTo("medium");
    table.integer("assignedTo").unsigned().references("id").inTable("staff").onDelete("SET NULL");
    table.integer("assignedBy").unsigned().references("id").inTable("staff").onDelete("SET NULL");
    table.integer("residentId").unsigned().references("id").inTable("residents").onDelete("SET NULL");
    table.date("dueDate");
    table.timestamp("completedAt");
    table.enum("category", ["medical", "personal_care", "housekeeping", "maintenance", "social", "other"]).notNullable();
    table.json("tags"); // Array of tags
    table.json("fileRefs"); // Array of file references
    table.text("notes");
    table.timestamps(true, true);
  });

  // Create indexes for better performance
  await knex.raw('CREATE INDEX idx_tasks_status ON tasks(status)');
  await knex.raw('CREATE INDEX idx_tasks_priority ON tasks(priority)');
  await knex.raw('CREATE INDEX idx_tasks_category ON tasks(category)');
  await knex.raw('CREATE INDEX idx_tasks_assigned_to ON tasks("assignedTo")');
  await knex.raw('CREATE INDEX idx_tasks_resident_id ON tasks("residentId")');
  await knex.raw('CREATE INDEX idx_tasks_due_date ON tasks("dueDate")');
  await knex.raw('CREATE INDEX idx_tasks_created_at ON tasks(created_at)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("tasks");
}
