import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getStats, getActivity, getHealth } from "./platform.controller.js";

const router = Router();

// Health check public (pour les outils de monitoring)
router.get("/health", getHealth);

// Tout le reste : SUPER_ADMIN uniquement
router.get("/stats",    authenticate, authorize("SUPER_ADMIN"), getStats);
router.get("/activity", authenticate, authorize("SUPER_ADMIN"), getActivity);

export default router;
