import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import {
    create,
    getAll,
    getById,
    remove,
    update,
} from "./impressions.controller.js";

const router = Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  emoji: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  emoji: Joi.string().optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validate(createSchema), create);
router.patch("/:id", validate(updateSchema), update);
router.put("/:id", validate(updateSchema), update);
router.delete("/:id", remove);

export default router;
