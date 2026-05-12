import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import {
    create,
    getAll,
    getById,
    remove,
    update,
} from "./sites.controller.js";

const router = Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  type: Joi.string().required(),
  capacity: Joi.number().integer().min(0).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  type: Joi.string().optional(),
  capacity: Joi.number().integer().min(0).optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validate(createSchema), create);
router.patch("/:id", validate(updateSchema), update);
router.put("/:id", validate(updateSchema), update);
router.delete("/:id", remove);

export default router;
