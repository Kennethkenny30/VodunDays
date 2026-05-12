import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import {
    create,
    getAll,
    getById,
    remove,
    update,
} from "./quiz.controller.js";

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

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validate(createSchema), create);
router.patch("/:id", validate(updateSchema), update);
router.put("/:id", validate(updateSchema), update);
router.delete("/:id", remove);

export default router;
