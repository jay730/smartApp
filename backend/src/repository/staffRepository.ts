// repository/staffRepository.ts
import type { Staff } from "../model/staffInterface";
import pool from "../db";
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
    const { name, role, assignedResidents, fileRefs } = data;
    const result = await pool.query<Staff>(
      `INSERT INTO staff (name, role, assignedResidents, fileRefs)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        name,
        role,
        assignedResidents ?? null,
        JSON.stringify(fileRefs ?? []),
      ]
    );
    return normalizeFileRefs(result.rows[0]);
  }

  static async getAllStaff(): Promise<Staff[]> {
    const result = await pool.query<Staff>(`SELECT * FROM staff`);
    return result.rows.map(normalizeFileRefs);
  }

  static async getStaffById(id: number): Promise<Staff | undefined> {
    const result = await pool.query<Staff>(
      `SELECT * FROM staff WHERE id = $1 LIMIT 1`,
      [id]
    );
    const staff = result.rows[0];
    return staff ? normalizeFileRefs(staff) : undefined;
  }

  static async updateStaff(
    id: number,
    data: Partial<Omit<Staff, "id">>
  ): Promise<Staff | undefined> {
    const { name, role, assignedResidents, fileRefs } = data;
    const result = await pool.query<Staff>(
      `UPDATE staff
       SET
         name = COALESCE($2, name),
         role = COALESCE($3, role),
         assignedResidents = COALESCE($4, assignedResidents),
         fileRefs = COALESCE($5, fileRefs)
       WHERE id = $1
       RETURNING *`,
      [
        id,
        name ?? null,
        role ?? null,
        assignedResidents ?? null,
        fileRefs ? JSON.stringify(fileRefs) : null,
      ]
    );
    const updated = result.rows[0];
    return updated ? normalizeFileRefs(updated) : undefined;
  }

  static async deleteStaff(id: number): Promise<void> {
    await pool.query(`DELETE FROM staff WHERE id = $1`, [id]);
  }
}
