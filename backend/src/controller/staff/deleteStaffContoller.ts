import { Request, Response } from "express";
import { StaffService } from "../../service/staffService";

export const deleteStaffController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await StaffService.deleteStaff(id);
    res.status(204).send(); // No content
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
