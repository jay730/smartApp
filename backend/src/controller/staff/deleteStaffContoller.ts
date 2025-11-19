import { Request, Response } from "express";
import { StaffRepository } from "../../repository/staffRepository";

export const deleteStaffController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await StaffRepository.deleteStaff(id);
    res.status(204).send(); // No content
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
