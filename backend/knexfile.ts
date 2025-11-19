// knexfile.ts
import type { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASS || "postgres123",
      database: process.env.DB_NAME || "toDoList",
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },
};

export default config;
