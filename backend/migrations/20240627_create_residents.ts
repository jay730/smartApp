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
    table.string("role").notNullable(); // caregiver, nurse, admin, etc.
    table.specificType("assignedResidents", "integer[]"); // array of resident IDs
    table.json("fileRefs");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("residents");
  await knex.schema.dropTableIfExists("caregivers");
}
