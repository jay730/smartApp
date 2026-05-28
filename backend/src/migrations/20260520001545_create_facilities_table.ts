import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("facilities", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.string("address").nullable();
    table.string("phone").nullable();
    table.integer("capacity").nullable();
    table.boolean("active").nullable().defaultTo(true);
    // add the rest here
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("facilities");
}

