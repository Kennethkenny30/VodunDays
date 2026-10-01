import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getAll, create, remove } from "./questions-impressions.controller.js";

const router = Router();

// Lecture : INSTAD (page de création) + ADMIN/SUPER_ADMIN (consultation)
const READ_ROLES  = ["INSTAD", "ADMIN", "SUPER_ADMIN"];
// Écriture (lier/délier une réaction à une question) : INSTAD uniquement
const WRITE_ROLES = ["INSTAD"];

const createSchema = Joi.object({
  questionId: Joi.string().uuid().required(),
  impressionId: Joi.string().uuid().required(),
});

router.get("/", authenticate, authorize(...READ_ROLES), getAll);
router.post("/", authenticate, authorize(...WRITE_ROLES), validate(createSchema), create);
router.delete("/:questionId/:impressionId", authenticate, authorize(...WRITE_ROLES), remove);

export default router;