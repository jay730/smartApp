import express from "express";
import {
  getResidentsController,
  getResidentByIdController,
  createResidentController,
  updateResidentController,
  deleteResidentController,
} from "../controller/resident/residentController";

import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createResidentSchema } from "../validation/residentSchema";


const router = express.Router();

// GET /residents - get all residents
router.get("/", authenticate, getResidentsController);

// GET /residents/:id - get one resident by ID
router.get("/:id", (req, res, next) => {
  Promise.resolve(getResidentByIdController(req, res)).catch(next);
});

// PUT /residents/:id - update a resident
router.put("/:id", (req, res, next) => {
  Promise.resolve(updateResidentController(req, res)).catch(next);
});

// DELETE /residents/:id - delete a resident
router.delete("/:id", (req, res, next) => {
  Promise.resolve(deleteResidentController(req, res)).catch(next);
});

// POST /residents - create a resident
router.post("/", (req, res, next) => {
  Promise.resolve(createResidentController(req, res)).catch(next);
});


// router.post("/", authenticate, validate(createResidentSchema), createResident);
// router.delete("/:id", authenticate, deleteResident);
//router.post("/",validate(createResidentSchema),createResident);

export default router;
