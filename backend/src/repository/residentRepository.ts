import { Resident } from "../model/residentInterface";

import pool from "../db";
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
    const { name, dateOfBirth, roomNumber, fileRefs } = data;

    const result = await pool.query<Resident>(
      `INSERT INTO residents (name, dateOfBirth, roomNumber, fileRefs)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, dateOfBirth ?? null, roomNumber ?? null, JSON.stringify(fileRefs ?? [])]
    );

    return normalizeFileRefs(result.rows[0]);
  }

  static async getAllResidents(): Promise<Resident[]> {
    const result = await pool.query<Resident>(`SELECT * FROM residents`);
    return result.rows.map(normalizeFileRefs);
  }

  static async getResidentById(id: number): Promise<Resident | undefined> {
    const result = await pool.query<Resident>(
      `SELECT * FROM residents WHERE id = $1 LIMIT 1`,
      [id]
    );
    const resident = result.rows[0];
    return resident ? normalizeFileRefs(resident) : undefined;
  }

  static async updateResident(
    id: number,
    data: Partial<Omit<Resident, "id">>
  ): Promise<Resident | undefined> {
    const { name, dateOfBirth, roomNumber, fileRefs } = data;
    const result = await pool.query<Resident>(
      `UPDATE residents
       SET
         name = COALESCE($2, name),
         dateOfBirth = COALESCE($3, dateOfBirth),
         roomNumber = COALESCE($4, roomNumber),
         fileRefs = COALESCE($5, fileRefs)
       WHERE id = $1
       RETURNING *`,
      [
        id,
        name ?? null,
        dateOfBirth ?? null,
        roomNumber ?? null,
        fileRefs ? JSON.stringify(fileRefs) : null,
      ]
    );
    const updated = result.rows[0];
    return updated ? normalizeFileRefs(updated) : undefined;
  }

  static async deleteResident(id: number): Promise<void> {
    await pool.query(`DELETE FROM residents WHERE id = $1`, [id]);
  }
}
