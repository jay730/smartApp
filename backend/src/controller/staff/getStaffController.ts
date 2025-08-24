import { Request, Response } from "express";
import { StaffService } from "../../service/staffService";

export const getStaffController = async (req: Request, res: Response) => {
  try {
    const staffs = await StaffService.getAllStaff();
    res.json(staffs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
