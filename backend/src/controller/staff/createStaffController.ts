import { Request, Response } from "express";
import { StaffRepository } from "../../repository/staffRepository";

export const createStaffController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, role, assignedResidents } = req.body;

    // Optional file handling
    const files = (req.files as Express.Multer.File[]) || [];
    const fileRefsJson = JSON.stringify(files.map((f) => f.filename));

    const newStaff = await StaffRepository.createStaff({
      name,
      role,
      assignedResidents,
      fileRefs: fileRefsJson,
    });

    res.status(201).json(newStaff);
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({
      error: "Failed to create staff",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
