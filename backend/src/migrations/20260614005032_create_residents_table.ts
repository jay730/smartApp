import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("residents", (table) => {
    table.increments("id");
    table.integer("facility_id").unsigned().notNullable()
      .references("id").inTable("facilities").onDelete("CASCADE");
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.date("date_of_birth").nullable();
    table.date("move_in_date").nullable();
    table.date("move_out_date").nullable();
    table.string("room_number").nullable();
    table.string("status").notNullable().defaultTo("active");
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("residents");
}


