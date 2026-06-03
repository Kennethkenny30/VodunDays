import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, remove, update } from "./events.controller.js";

const router = Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED").required(),
  siteId: Joi.string().uuid().required(),
  eventTypeId: Joi.string().uuid().required(),
  imageUrl: Joi.string().optional().allow("", null),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED").optional(),
  siteId: Joi.string().uuid().optional(),
  eventTypeId: Joi.string().uuid().optional(),
  imageUrl: Joi.string().optional().allow("", null),
});

// Lecture publique (programme festivalier)
router.get("/", getAll);
router.get("/:id", getById);

// Écriture : ADMIN et SUPER_ADMIN
router.post("/",    authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), auditLog("events", "CREATE"), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("events", "UPDATE"), update);
router.put("/:id",   authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("events", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), auditLog("events", "DELETE"), remove);

export default router;
