import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create residents table
  await knex.schema.createTable("residents", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.date("dateOfBirth");
    table.string("roomNumber");
    table.json("fileRefs");
    table.timestamps(true, true);
  });

  // Create staff table
  await knex.schema.createTable("staff", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("role").notNullable();
    table.specificType("assignedResidents", "integer[]"); // array of resident IDs
    table.json("fileRefs");
    table.timestamps(true, true);
  });

  // Create tasks table with random 6-digit ID (manually supplied)
  await knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary(); // manually supplied 6-digit number
    table.string("title").notNullable();
    table.text("description");
    table
      .enum("status", ["pending", "inProgress", "completed", "cancelled"])
      .defaultTo("pending");
    table
      .enum("priority", ["low", "medium", "high", "urgent"])
      .defaultTo("medium");
    table
      .integer("assignedTo")
      .unsigned()
      .references("id")
      .inTable("staff")
      .onDelete("SET NULL");
    table
      .integer("assignedBy")
      .unsigned()
      .references("id")
      .inTable("staff")
      .onDelete("SET NULL");
    table
      .integer("residentId")
      .unsigned()
      .references("id")
      .inTable("residents")
      .onDelete("SET NULL");
    table.date("dueDate");
    table.timestamp("completedAt");
    table
      .enum("category", [
        "medical",
        "personalCare",
        "housekeeping",
        "maintenance",
        "social",
        "other",
      ])
      .notNullable()
      .defaultTo("other");
    table.json("tags");
    table.json("fileRefs");
    table.text("notes");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("tasks");
  await knex.schema.dropTableIfExists("staff");
  await knex.schema.dropTableIfExists("residents");
}
