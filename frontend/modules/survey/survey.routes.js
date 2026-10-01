import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getStats, getComments, exportCsv } from "./survey.controller.js";

const router = Router();

// Lecture : ADMIN et SUPER_ADMIN
router.use(authenticate, authorize("ADMIN", "SUPER_ADMIN"));

router.get("/stats",    getStats);
router.get("/comments", getComments);
router.get("/export",   exportCsv);

export default router;
