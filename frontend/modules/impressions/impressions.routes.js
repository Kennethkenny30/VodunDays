import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, remove, update } from "./impressions.controller.js";

const router = Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  emoji: Joi.string().required(),
});
const updateSchema = Joi.object({
  name: Joi.string().optional(),
  emoji: Joi.string().optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), auditLog("impressions", "CREATE"), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("impressions", "UPDATE"), update);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("impressions", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), auditLog("impressions", "DELETE"), remove);

export default router;
