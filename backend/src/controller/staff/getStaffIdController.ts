import { Request, Response } from "express";
import { StaffRepository } from "../../repository/staffRepository";

export const getStaffByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID. Must be a number." });
  }

  const staff = await StaffRepository.getStaffById(id);

  if (!staff) {
    return res.status(404).json({ error: "Staff not found." });
  }

  res.status(200).json(staff);
};
