import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, remove, update } from "./artists.controller.js";

const router = Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  eventId: Joi.string().uuid().required(),
});
const updateSchema = Joi.object({
  name: Joi.string().optional(),
  eventId: Joi.string().uuid().optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), auditLog("artists", "CREATE"), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("artists", "UPDATE"), update);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("artists", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), auditLog("artists", "DELETE"), remove);

export default router;
