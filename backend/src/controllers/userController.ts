import { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories/userRepository";

export const userController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const facility_id = Number(req.params.facility_id);
      const users = await userRepository.getAll(facility_id);
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userRepository.getById(Number(req.params.id), Number(req.params.facility_id));
      if (!user) {
        res.status(404).json({ error: "user not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userRepository.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userRepository.update(Number(req.params.id), Number(req.params.facility_id), req.body);

      if (!user) {
        res.status(404).json({ error: "user not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await userRepository.delete(Number(req.params.id), Number(req.params.facility_id));
      if (!deleted) {
        res.status(404).json({ error: "user not found" });
        return;
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
