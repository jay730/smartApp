// src/controller/resident/residentController.ts
import { Request, Response } from "express";
import { ResidentRepository } from "../../repository/residentRepository";

// ---------- Get all residents ----------
export const getResidentsController = async (req: Request, res: Response) => {
  try {
    const residents = await ResidentRepository.getAllResidents();
    res.json(residents);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get a single resident by ID ----------
export const getResidentByIdController = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "Invalid ID. Must be a number." });

  const resident = await ResidentRepository.getResidentById(id);
  if (!resident) return res.status(404).json({ error: "Resident not found." });

  res.status(200).json(resident);
};

// ---------- Create a resident ----------
export const createResidentController = async (req: Request, res: Response) => {
  try {
    const { name, dateOfBirth, roomNumber } = req.body;

    if (!name || !dateOfBirth || !roomNumber) {
      return res
        .status(400)
        .json({ error: "Name, DOB, and room number are required" });
    }

    // Create resident
    const resident = await ResidentRepository.createResident({
      name,
      dateOfBirth,
      roomNumber,
      fileRefs: [],
    });

    res.status(201).json(resident);
  } catch (err: any) {
    console.error("Error creating resident:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Update a resident ----------
export const updateResidentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body || {};

    const updatedResident = await ResidentRepository.updateResident(id, data);
    if (!updatedResident)
      return res.status(404).json({ error: "Resident not found" });

    res.json(updatedResident);
  } catch (err: any) {
    console.error("Update resident error:", err);
    res.status(400).json({ error: err.message });
  }
};

// ---------- Delete a resident ----------
export const deleteResidentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await ResidentRepository.deleteResident(id);
    res.status(204).send(); // No content
  } catch (err: any) {
    console.error("Delete resident error:", err);
    res.status(500).json({ error: err.message });
  }
};
