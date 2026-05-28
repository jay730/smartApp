import knex from "knex";
import dotenv from "dotenv";

dotenv.config()

const db = knex({
  client: 'pg',
  connection: {
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
},
});

export default db

db.raw("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Connection failed:", err));