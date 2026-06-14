import { Router } from "express";
import { facilityController } from "../controllers/facilityController";

const router = Router();

router.get("/", facilityController.getAll);
router.get("/:id", facilityController.getById);
router.post("/", facilityController.create);
router.put("/:id", facilityController.update);
router.delete("/:id", facilityController.delete);

export default router;
