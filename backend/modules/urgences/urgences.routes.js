import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { getAll, getById, getStats, create, updateStatus, getByUuid } from "./urgences.controller.js";

const router = Router();

const createSchema = Joi.object({
  uuid:        Joi.string().uuid().required(),
  displayName: Joi.string().min(2).max(100).required(),
  type:        Joi.string().valid("MEDICAL", "SECURITY", "FIRE", "LOST", "TECHNICAL", "OTHER").required(),
  description: Joi.string().min(5).max(500).required(),
  siteId:      Joi.string().uuid().optional(),
  latitude:    Joi.number().min(-90).max(90).optional(),
  longitude:   Joi.number().min(-180).max(180).optional(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED").required(),
  note:   Joi.string().max(300).optional().allow(""),
});

// ─── Public (festivaliers) ────────────────────────────────────────────────────
router.post("/", validate(createSchema), create);

// ─── Protégées (admins) ───────────────────────────────────────────────────────
router.get("/",         authenticate, authorize("ADMIN", "SUPER_ADMIN"), getAll);
router.get("/stats",    authenticate, authorize("ADMIN", "SUPER_ADMIN"), getStats);
router.get("/:id",      authenticate, authorize("ADMIN", "SUPER_ADMIN"), getById);
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(updateStatusSchema),
  auditLog("urgences", "UPDATE", (req) => `Alerte ${req.params.id.slice(0, 8)} → ${req.body.status}`),
  updateStatus
);
// Public — festivalier suit son alerte via son uuid
router.get("/track/:uuid", getByUuid);

export default router;
