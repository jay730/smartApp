import { Request, Response } from "express";
import { StaffRepository } from "../../repository/staffRepository";

export const getStaffController = async (req: Request, res: Response) => {
  try {
    const staffs = await StaffRepository.getAllStaff();
    res.json(staffs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
