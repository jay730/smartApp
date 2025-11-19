import { Request, Response } from "express";
import { StaffRepository } from "../../repository/staffRepository";

export const updateStaffController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Ensure req.body always exists
    const data = req.body || {};

    const updatedStaff = await StaffRepository.updateStaff(id, data);

    if (!updatedStaff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.json(updatedStaff);
  } catch (err: any) {
    console.error("Update staff error:", err);
    res.status(400).json({ error: err.message });
  }
};
