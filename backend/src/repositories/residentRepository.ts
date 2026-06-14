import db from "../config/db";
import { Resident } from "../types/resident";

export const residentRepository = {
  getAll: async (facility_id: number): Promise<Resident[]> => {
    return db("residents").where({ facility_id }).select("*");
  },

  getById: async (id: number, facility_id: number): Promise<Resident | undefined> => {
    return db("residents").where({ id, facility_id }).first();
  },

  create: async (data: Omit<Resident, "id">): Promise<Resident> => {
    const [row] = await db("residents").insert(data).returning("*");
    return row;
  },

  update: async (id: number, facility_id: number, data: Partial<Resident>): Promise<Resident | undefined> => {
    const [row] = await db("residents").where({ id, facility_id }).update(data).returning("*");
    return row;
  },

  delete: async (id: number, facility_id: number): Promise<boolean> => {
    const count = await db("residents").where({ id, facility_id }).delete();
    return count > 0;
  },
};
