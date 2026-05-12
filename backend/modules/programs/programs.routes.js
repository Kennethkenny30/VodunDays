import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "./programs.controller.js";

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

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validate(createSchema), create);
router.patch("/:id", validate(updateSchema), update);
router.delete("/:id", remove);

export default router;
