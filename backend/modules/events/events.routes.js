import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import {
    create,
    getAll,
    getById,
    remove,
    update,
} from "./events.controller.js";

const router = Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  status: Joi.string().required(),
  siteId: Joi.string().uuid().required(),
  eventTypeId: Joi.string().uuid().required(),
  createdBy: Joi.string().uuid().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  status: Joi.string().optional(),
  siteId: Joi.string().uuid().optional(),
  eventTypeId: Joi.string().uuid().optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validate(createSchema), create);
router.patch("/:id", validate(updateSchema), update);
router.put("/:id", validate(updateSchema), update);
router.delete("/:id", remove);

export default router;
