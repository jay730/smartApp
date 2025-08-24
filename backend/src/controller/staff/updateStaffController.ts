import { Request, Response } from "express";
import { StaffService } from "../../service/staffService";

export const updateStaffController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Ensure req.body always exists
    const data = req.body || {};

    // Handle optional files
    if (req.files && Array.isArray(req.files)) {
      const fileRefs = req.files.map((f: Express.Multer.File) => f.filename);
      data.fileRefs = JSON.stringify(fileRefs);
    }

    const updatedStaff = await StaffService.updateStaff(id, data);

    if (!updatedStaff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.json(updatedStaff);
  } catch (err: any) {
    console.error("Update staff error:", err);
    res.status(400).json({ error: err.message });
  }
};
