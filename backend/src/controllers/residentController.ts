import { Request, Response, NextFunction } from "express";
import { residentRepository } from "../repositories/residentRepository";

export const residentController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility_id = Number(req.params.facility_id);
      const residents = await residentRepository.getAll(facility_id);
      res.json(residents);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility_id = Number(req.params.facility_id);
      const resident = await residentRepository.getById(Number(req.params.id), facility_id);
      if (!resident) {
        res.status(404).json({ error: "Resident not found" });
        return;
      }
      res.json(resident);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility_id = Number(req.params.facility_id);
      const resident = await residentRepository.create({ ...req.body, facility_id });
      res.status(201).json(resident);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility_id = Number(req.params.facility_id);
      const resident = await residentRepository.update(Number(req.params.id), facility_id, req.body);
      if (!resident) {
        res.status(404).json({ error: "Resident not found" });
        return;
      }
      res.json(resident);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility_id = Number(req.params.facility_id);
      const deleted = await residentRepository.delete(Number(req.params.id), facility_id);
      if (!deleted) {
        res.status(404).json({ error: "Resident not found" });
        return;
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
