import { Request, Response } from "express";
import { StaffRepository } from "../../repository/staffRepository";

//create
export const createStaffController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, role, assignedResidents } = req.body;

    const newStaff = await StaffRepository.createStaff({
      name,
      role,
      assignedResidents,
      fileRefs: [],
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

//Get
export const getStaffController = async (req: Request, res: Response) => {
  try {
    const staffs = await StaffRepository.getAllStaff();
    res.json(staffs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

//GetById
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

//Update
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

//Delete
export const deleteStaffController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await StaffRepository.deleteStaff(id);
    res.status(204).send(); // No content
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

