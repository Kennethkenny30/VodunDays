import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getAll, getById, create, update, remove } from "./programs.controller.js";

const router = Router();

const createSchema = Joi.object({
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().min(Joi.ref("startTime")).required(),
  eventId: Joi.string().uuid().required(),
});

const updateSchema = Joi.object({
  startTime: Joi.date().iso().optional(),
  endTime: Joi.date().iso().optional(),
  eventId: Joi.string().uuid().optional(),
});

// Lecture publique
router.get("/", getAll);
router.get("/:id", getById);

// Écriture : ADMIN et SUPER_ADMIN
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), remove);

export default router;
