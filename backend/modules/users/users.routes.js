import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import {
    getAll,
    getById,
    remove,
    update,
} from "./users.controller.js";

const router = Router();

const updateSchema = Joi.object({
  email: Joi.string().email().optional(),
  role: Joi.string().valid("ADMIN", "SUPER_ADMIN").optional(),
  active: Joi.boolean().optional(),
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  phone: Joi.string().optional().allow(""),
});

router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", validate(updateSchema), update);
router.put("/:id", validate(updateSchema), update);
router.delete("/:id", remove);

export default router;
