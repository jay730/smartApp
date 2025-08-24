import express from "express";
// import { getResidentsController } from "../controller/resident/getResidentsController";
// import { getResidentByIdController } from "../controller/resident/getResidentByIdController";
// import { createResidentController } from "../controller/resident/createResidentController";
// import { updateResidentController } from "../controller/resident/updateResidentController";
// import { deleteResidentController } from "../controller/resident/deleteResidentController";
import {
  getResidentsController,
  getResidentByIdController,
  createResidentController,
  updateResidentController,
  deleteResidentController,
} from "../controller/resident/residentController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// GET /residents - get all residents
router.get("/", getResidentsController);

// GET /residents/:id - get one resident by ID
router.get("/:id", (req, res, next) => {
  Promise.resolve(getResidentByIdController(req, res)).catch(next);
});

// PUT /residents/:id - update a resident
router.put("/:id", (req, res, next) => {
  upload.any()(req, res, async (err) => {
    if (err) return next(err);
    try {
      req.body.files = req.files;
      await updateResidentController(req, res);
    } catch (e) {
      next(e);
    }
  });
});

// DELETE /residents/:id - delete a resident
router.delete("/:id", deleteResidentController);

// POST /residents - create a resident with possible file uploads
router.post("/", (req, res, next) => {
  upload.any()(req, res, async (err) => {
    if (err) return next(err);
    try {
      // Attach files to body for the service
      req.body.files = req.files;
      await createResidentController(req, res);
    } catch (e) {
      next(e);
    }
  });
});

export default router;
