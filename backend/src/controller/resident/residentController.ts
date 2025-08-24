// src/controller/resident/residentController.ts
import { Request, Response } from "express";
import { ResidentService } from "../../service/residentService";
import { ResidentRepository } from "../../repository/residentRepository";
import { Readable } from "stream";
import { VirusScanner, ScanResult } from "../../service/virusScanner";

// ---------- Get all residents ----------
export const getResidentsController = async (req: Request, res: Response) => {
  try {
    const residents = await ResidentService.getAllResidents();
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
// Instantiate Virus Scanner (assumes ClamAV is running on localhost:3310)
const scanner = new VirusScanner();

export const createResidentController = async (req: Request, res: Response) => {
  try {
    const { name, dateOfBirth, roomNumber } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!name || !dateOfBirth || !roomNumber) {
      return res
        .status(400)
        .json({ error: "Name, DOB, and room number are required" });
    }

    let fileRefs: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        // Create a readable stream from the file buffer
        const stream = Readable.from(file.buffer);

        // Scan the file with mock virus scanner
        const result = await scanner.scanStream(stream);

        if (result.isInfected) {
          console.log(`🚨 VIRUS DETECTED! File "${file.originalname}" is infected with ${result.signature}`);
          return res
            .status(400)
            .json({
              error: `File "${file.originalname}" is infected with ${result.signature}`,
            });
        }

        // Log clean file
        console.log(`✅ File "${file.originalname}" is clean - no viruses detected`);

        // Add filename to fileRefs after clean scan
        fileRefs.push(file.filename);
      }
    }

    // Create resident
    const resident = await ResidentService.createResident({
      name,
      dateOfBirth,
      roomNumber,
      fileRefs,
    });

    res.status(201).json(resident);
  } catch (err: any) {
    console.error("Error creating resident with files:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Update a resident ----------
export const updateResidentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body || {};

    if (req.files && Array.isArray(req.files)) {
      const scanner = new VirusScanner();
      for (const file of req.files as Express.Multer.File[]) {
        const bufferStream = Readable.from(file.buffer);
        const result: ScanResult = await scanner.scanStream(bufferStream);
        if (result.isInfected) {
          console.log(`🚨 VIRUS DETECTED! File "${file.originalname}" is infected with ${result.signature}`);
          return res.status(400).json({
            error: `File ${file.originalname} is infected with ${result.signature}`,
          });
        }

        // Log clean file
        console.log(`✅ File "${file.originalname}" is clean - no viruses detected`);
      }
      

      data.fileRefs = JSON.stringify(
        (req.files as Express.Multer.File[]).map((f) => f.filename)
      );
    }

    const updatedResident = await ResidentService.updateResident(id, data);
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
    await ResidentService.deleteResident(id);
    res.status(204).send(); // No content
  } catch (err: any) {
    console.error("Delete resident error:", err);
    res.status(500).json({ error: err.message });
  }
};
