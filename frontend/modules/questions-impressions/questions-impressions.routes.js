import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getAll, create, remove } from "./questions-impressions.controller.js";

const router = Router();

const createSchema = Joi.object({
  questionId: Joi.string().uuid().required(),
  impressionId: Joi.string().uuid().required(),
});

router.get("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getAll);
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), create);
router.delete("/:questionId/:impressionId", authenticate, authorize("ADMIN", "SUPER_ADMIN"), remove);

export default router;
