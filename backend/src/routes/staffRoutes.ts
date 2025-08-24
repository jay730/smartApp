import express from "express";
import { getStaffController } from "../controller/staff/getStaffController";
import { getStaffByIdController } from "../controller/staff/getStaffIdController";
import { createStaffController } from "../controller/staff/createStaffController";
import { updateStaffController } from "../controller/staff/updateStaffController";
import upload from "../middleware/uploadMiddleware";
import { deleteStaffController } from "../controller/staff/deleteStaffContoller";

const router = express.Router();

// GET /staffs - get all staffs
router.get("/", getStaffController);

// GET /staff/:id - get one staff by ID
router.get("/:id", (req, res, next) => {
  Promise.resolve(getStaffByIdController(req, res)).catch(next);
});

// PUT /staffs/:id - update a staff
router.put("/:id", (req, res, next) => {
  if (req.is("multipart/form-data")) {
    // For form-data requests with possible files
    upload.any()(req, res, (err) => {
      if (err) return next(err);
      Promise.resolve(updateStaffController(req, res)).catch(next);
    });
  } else {
    // For JSON requests
    express.json()(req, res, (err) => {
      if (err) return next(err);
      Promise.resolve(updateStaffController(req, res)).catch(next);
    });
  }
});

//DELETE /staffs/:id - delete a staff
router.delete("/:id", deleteStaffController);

// POST /staffs/upload - Create staff with a file
router.post("/", upload.array("file"), createStaffController);

export default router;
