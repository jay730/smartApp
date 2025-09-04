import knex from "knex";
import * as dotenv from "dotenv";
dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "toDoList",
  },
});

export default db;
