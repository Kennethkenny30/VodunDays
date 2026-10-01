import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, remove, update } from "./amenities.controller.js";

const router = Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  siteId: Joi.string().uuid().required(),
});
const updateSchema = Joi.object({
  name: Joi.string().optional(),
  siteId: Joi.string().uuid().optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authenticate, authorize("SUPER_ADMIN"), validate(createSchema), auditLog("amenities", "CREATE"), create);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN"), validate(updateSchema), auditLog("amenities", "UPDATE"), update);
router.put("/:id", authenticate, authorize("SUPER_ADMIN"), validate(updateSchema), auditLog("amenities", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), auditLog("amenities", "DELETE"), remove);

export default router;
