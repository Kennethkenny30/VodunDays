import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { create, getAll, getById, remove, update } from "./answers.controller.js";

const router = Router();

const createSchema = Joi.object({
  response: Joi.string().required(),
  questionId: Joi.string().uuid().required(),
  // uuid festivalier (optionnel, côté anonyme)
  uuid: Joi.string().uuid().optional(),
});
const updateSchema = Joi.object({
  response: Joi.string().optional(),
  questionId: Joi.string().uuid().optional(),
});

// Les festivaliers peuvent soumettre des réponses (public)
router.get("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getAll);
router.get("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getById);
router.post("/", validate(createSchema), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), update);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), remove);

export default router;
