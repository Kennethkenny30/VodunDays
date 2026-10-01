import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getAll, getStats } from "./audit.controller.js";

const router = Router();

// Lecture seule - SUPER_ADMIN uniquement
router.use(authenticate, authorize("SUPER_ADMIN"));

router.get("/",       getAll);
router.get("/stats",  getStats);

export default router;
