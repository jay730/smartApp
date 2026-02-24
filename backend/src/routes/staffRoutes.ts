import express from "express";
import { getStaffController } from "../controller/staff/staffController";
import { getStaffByIdController } from "../controller/staff/staffController";
import { createStaffController } from "../controller/staff/staffController";
import { updateStaffController } from "../controller/staff/staffController";
import { deleteStaffController } from "../controller/staff/staffController";

const router = express.Router();

// GET /staffs - get all staffs
router.get("/", getStaffController);

// GET /staff/:id - get one staff by ID
router.get("/:id", (req, res, next) => {
  Promise.resolve(getStaffByIdController(req, res)).catch(next);
});

// PUT /staffs/:id - update a staff
router.put("/:id", (req, res, next) => {
  Promise.resolve(updateStaffController(req, res)).catch(next);
});

//DELETE /staffs/:id - delete a staff
router.delete("/:id", (req, res, next) => {
  Promise.resolve(deleteStaffController(req, res)).catch(next);
});

// POST /staffs - Create staff
router.post("/", (req, res, next) => {
  Promise.resolve(createStaffController(req, res)).catch(next);
});

export default router;
