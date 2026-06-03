import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { create, getAll, getById, remove, update } from "./quiz.controller.js";

const router = Router();

const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  active: Joi.boolean().optional(),
  eventId: Joi.string().uuid().required(),
});
const updateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  active: Joi.boolean().optional(),
  eventId: Joi.string().uuid().optional(),
});

// Lecture : festivaliers (quiz actifs) + admins (tous)
router.get("/", getAll);
router.get("/:id", getById);

// Écriture : ADMIN et SUPER_ADMIN
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), update);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), remove);

export default router;
