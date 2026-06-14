import db from "../config/db";
import { Facility } from "../types/facility";

export const facilityRepository = {
  getAll: async (): Promise<Facility[]> => {
    return db("facilities").select("*");
  },

  getById: async (id: number): Promise<Facility | undefined> => {
    return db("facilities").where({ id }).first();
  },

  create: async (data: Omit<Facility, "id">): Promise<Facility> => {
    const [row] = await db("facilities").insert(data).returning("*");
    return row;
  },

  update: async (id: number, data: Partial<Facility>): Promise<Facility | undefined> => {
    const [row] = await db("facilities").where({ id }).update(data).returning("*");
    return row;
  },

  delete: async (id: number): Promise<boolean> => {
    const count = await db("facilities").where({ id }).delete();
    return count > 0;
  },
};
