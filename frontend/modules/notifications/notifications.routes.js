import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { getAll, getById, create, update, remove, getStats, getPublic } from "./notifications.controller.js";

const router = Router();

const createSchema = Joi.object({
  title:       Joi.string().required(),
  message:     Joi.string().required(),
  target:      Joi.string().valid("ALL", "SITE", "EVENT_TYPE").default("ALL"),
  targetId:    Joi.string().uuid().optional(),
  scheduledAt: Joi.date().iso().optional(),
});

const updateSchema = Joi.object({
  status: Joi.string().valid("PENDING", "SENT", "FAILED").optional(),
  sentAt: Joi.date().iso().optional(),
});

// Route publique pour les festivaliers - pas d'auth requise
router.get("/public", getPublic);

// Toutes les routes suivantes nécessitent ADMIN ou SUPER_ADMIN
router.use(authenticate, authorize("ADMIN", "SUPER_ADMIN"));

router.get("/",          getAll);
router.get("/stats",     getStats);
router.get("/:id",       getById);
router.post("/",      validate(createSchema), auditLog("notifications", "CREATE", (req) => `Notification créée : "${req.body.title}"`), create);
router.patch("/:id",  validate(updateSchema), auditLog("notifications", "UPDATE"), update);
router.delete("/:id", auditLog("notifications", "DELETE"), remove);

export default router;
