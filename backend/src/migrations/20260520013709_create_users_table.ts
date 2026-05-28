import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("email").notNullable();
    table.string("password_hash").nullable();
    table.string("role").nullable();
    table.integer("capacity").nullable();
    table.boolean("active").nullable().defaultTo(true);
    // add the rest here
    table.timestamps(true, true);
}


export async function down(knex: Knex): Promise<void> {
}

