import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, remove, update } from "./choices.controller.js";

const router = Router();

const createSchema = Joi.object({
  wording: Joi.string().required(),
  questionId: Joi.string().uuid().required(),
});
const updateSchema = Joi.object({
  wording: Joi.string().optional(),
  questionId: Joi.string().uuid().optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), auditLog("choices", "CREATE"), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("choices", "UPDATE"), update);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("choices", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), auditLog("choices", "DELETE"), remove);

export default router;
