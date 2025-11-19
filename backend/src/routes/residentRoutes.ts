import express from "express";
import {
  getResidentsController,
  getResidentByIdController,
  createResidentController,
  updateResidentController,
  deleteResidentController,
} from "../controller/resident/residentController";

const router = express.Router();

// GET /residents - get all residents
router.get("/", getResidentsController);

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

export default router;
