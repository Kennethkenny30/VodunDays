import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { create, getAll, getById, remove, update } from "./events-types.controller.js";

const router = Router();

const createSchema = Joi.object({ name: Joi.string().required() });
const updateSchema = Joi.object({ name: Joi.string().optional() });

// Lecture publique
router.get("/", getAll);
router.get("/:id", getById);

// Écriture : SUPER_ADMIN et ADMIN
router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(createSchema), create);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(updateSchema), update);
router.put("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(updateSchema), update);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), remove);

export default router;