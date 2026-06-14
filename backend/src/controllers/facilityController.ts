import { Request, Response, NextFunction } from "express";
import { facilityRepository } from "../repositories/facilityRepository";

export const facilityController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facilities = await facilityRepository.getAll();
      res.json(facilities);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility = await facilityRepository.getById(Number(req.params.id));
      if (!facility) {
        res.status(404).json({ error: "Facility not found" });
        return;
      }
      res.json(facility);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility = await facilityRepository.create(req.body);
      res.status(201).json(facility);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility = await facilityRepository.update(Number(req.params.id), req.body);
      if (!facility) {
        res.status(404).json({ error: "Facility not found" });
        return;
      }
      res.json(facility);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await facilityRepository.delete(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ error: "Facility not found" });
        return;
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
