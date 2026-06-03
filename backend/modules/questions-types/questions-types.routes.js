import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { create, getAll, getById, remove, update } from "./questions-types.controller.js";

const router = Router();

const createSchema = Joi.object({ types: Joi.string().required() });
const updateSchema = Joi.object({ types: Joi.string().optional() });

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), update);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), remove);

export default router;
