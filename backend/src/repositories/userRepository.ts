import db from "../config/db";
import { User } from "../types/user";

export const userRepository = {
  getAll: async (facility_id: number): Promise<User[]> => {
    return db("users").where({ facility_id }).select("*");
  },

  getById: async (id: number, facility_id: number): Promise<User | undefined> => {
    return db("users").where({ id, facility_id }).first();
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    return db("users").where({ email }).first();
  },

  create: async (data: Omit<User, "id">): Promise<User> => {
    const [row] = await db("users").insert(data).returning("*");
    return row;
  },

  update: async (id: number, facility_id: number, data: Partial<User>): Promise<User | undefined> => {
    const [row] = await db("users").where({ id, facility_id }).update(data).returning("*");
    return row;
  },

  delete: async (id: number, facility_id: number): Promise<boolean> => {
    const count = await db("users").where({ id, facility_id }).delete();
    return count > 0;
  },
};
