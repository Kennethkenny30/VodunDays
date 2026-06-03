import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { getAll, getById, remove, update } from "./users.controller.js";

const router = Router();

const updateSchema = Joi.object({
  email:     Joi.string().email().optional(),
  role:      Joi.string().valid("SUPER_ADMIN", "ADMIN").optional(),
  active:    Joi.boolean().optional(),
  firstname: Joi.string().optional(),
  lastname:  Joi.string().optional(),
  phone:     Joi.string().optional().allow(""),
});

// Toutes les routes users : SUPER_ADMIN uniquement
router.get("/",      authenticate, authorize("SUPER_ADMIN"), getAll);
router.get("/:id",   authenticate, authorize("SUPER_ADMIN"), getById);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN"), validate(updateSchema), auditLog("users", "UPDATE"), update);
router.put("/:id",   authenticate, authorize("SUPER_ADMIN"), validate(updateSchema), auditLog("users", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), auditLog("users", "DELETE"), remove);

export default router;
