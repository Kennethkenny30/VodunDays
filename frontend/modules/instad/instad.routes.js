import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import {
  getOverview, getPresencePoints, exportCsv,
  listQuizzes, getQuizStatistics, exportQuizCsv,
} from "./instad.controller.js";

const router = Router();

// Dashboard réservé à l'INStaD - le rôle est attribué exclusivement par un
// SUPER_ADMIN (voir /api/auth/register et /api/users), l'INStaD ne crée
// jamais son propre compte. Le SUPER_ADMIN garde un accès de supervision.
router.use(authenticate, authorize("INSTAD", "SUPER_ADMIN"));

router.get("/overview",              getOverview);
router.get("/presence/points",       getPresencePoints);
router.get("/export",                exportCsv);
router.get("/quizzes",               listQuizzes);
router.get("/quizzes/:id/stats",     getQuizStatistics);
router.get("/quizzes/:id/export",    exportQuizCsv);

export default router;
