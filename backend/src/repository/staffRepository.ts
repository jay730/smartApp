// repository/staffRepository.ts
import db from "../db";
import type { Staff } from "../model/staffInterface";

import knex from "../db";
function normalizeFileRefs(staff: Staff): Staff {
  if (typeof staff.fileRefs === "string") {
    try {
      staff.fileRefs = JSON.parse(staff.fileRefs);
    } catch {
      staff.fileRefs = [];
    }
  }
  return staff;
}

export class StaffRepository {
  static async createStaff(data: Omit<Staff, "id">): Promise<Staff> {
    const [newStaff] = await knex<Staff>("staff").insert(data).returning("*");

    return normalizeFileRefs(newStaff);
  }

  static async getAllStaff(): Promise<Staff[]> {
    const staffs = await knex<Staff>("staff").select("*");
    return staffs.map(normalizeFileRefs);
  }

  static async getStaffById(id: number): Promise<Staff | undefined> {
    const staff = await knex<Staff>("staff").where({ id }).first();
    return staff ? normalizeFileRefs(staff) : undefined;
  }

  static async updateStaff(
    id: number,
    data: Partial<Omit<Staff, "id">>
  ): Promise<Staff | undefined> {
    const [updated] = await knex<Staff>("staff")
      .where({ id })
      .update(data)
      .returning("*");
    return updated;
  }

  static async deleteStaff(id: number): Promise<void> {
    await knex<Staff>("staff").where({ id }).delete();
  }
}
