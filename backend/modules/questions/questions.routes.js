import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import {
    create,
    getAll,
    getById,
    remove,
    update,
} from "./questions.controller.js";

const router = Router();

const createSchema = Joi.object({
  wording: Joi.string().required(),
  questionTypeId: Joi.string().uuid().required(),
  quizId: Joi.string().uuid().required(),
});

const updateSchema = Joi.object({
  wording: Joi.string().optional(),
  questionTypeId: Joi.string().uuid().optional(),
  quizId: Joi.string().uuid().optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validate(createSchema), create);
router.patch("/:id", validate(updateSchema), update);
router.put("/:id", validate(updateSchema), update);
router.delete("/:id", remove);

export default router;
