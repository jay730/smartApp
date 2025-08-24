import { Resident } from "../model/residentInterface";

import knex from "../db";
function normalizeFileRefs(resident: Resident): Resident {
  if (typeof resident.fileRefs === "string") {
    try {
      resident.fileRefs = JSON.parse(resident.fileRefs);
    } catch {
      resident.fileRefs = [];
    }
  }
  return resident;
}

export class ResidentRepository {
  static async createResident(data: Omit<Resident, "id">): Promise<Resident> {
    const [newResident] = await knex<Resident>("residents")
      .insert(data)
      .returning("*");

    return normalizeFileRefs(newResident);
  }

  static async getAllResidents(): Promise<Resident[]> {
    const residents = await knex<Resident>("residents").select("*");
    return residents.map(normalizeFileRefs);
  }

  static async getResidentById(id: number): Promise<Resident | undefined> {
    const resident = await knex<Resident>("residents").where({ id }).first();
    return resident ? normalizeFileRefs(resident) : undefined;
  }

  static async updateResident(
    id: number,
    data: Partial<Omit<Resident, "id">>
  ): Promise<Resident | undefined> {
    const [updated] = await knex<Resident>("residents")
      .where({ id })
      .update(data)
      .returning("*");
    return updated ? normalizeFileRefs(updated) : undefined;
  }

  static async deleteResident(id: number): Promise<void> {
    await knex<Resident>("residents").where({ id }).delete();
  }
}
