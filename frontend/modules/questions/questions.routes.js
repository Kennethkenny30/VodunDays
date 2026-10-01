import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, remove, reorder, update } from "./questions.controller.js";

const router = Router();

const createSchema = Joi.object({
  wording: Joi.string().required(),
  questionTypeId: Joi.string().uuid().required(),
  quizId: Joi.string().uuid().required(),
});
const updateSchema = Joi.object({
  wording: Joi.string().optional(),
  questionTypeId: Joi.string().uuid().optional(),
  quizId: Joi.string().uuid().optional(),
});
const reorderSchema = Joi.object({
  ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

// La route /reorder doit être déclarée avant /:id pour éviter la collision
router.patch("/reorder", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(reorderSchema), auditLog("questions", "UPDATE", (req) => `Réordonnancement de ${req.body.ids?.length ?? 0} questions`), reorder);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/",     authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), auditLog("questions", "CREATE", (req) => `Question créée dans le quiz [${req.body.quizId?.slice(0, 8)}...]`), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("questions", "UPDATE"), update);
router.put("/:id",   authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("questions", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), auditLog("questions", "DELETE"), remove);

export default router;
