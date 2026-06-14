import { Router } from "express";
import { residentController } from "../controllers/residentController";

const router = Router({ mergeParams: true });

router.get("/", residentController.getAll);
router.get("/:id", residentController.getById);
router.post("/", residentController.create);
router.put("/:id", residentController.update);
router.delete("/:id", residentController.delete);

export default router;
