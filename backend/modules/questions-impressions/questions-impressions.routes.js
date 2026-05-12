import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  getAll,
  create,
  remove,
} from "./questions-impressions.controller.js";

const router = Router();

const createSchema = Joi.object({
  questionId: Joi.string().uuid().required(),
  impressionId: Joi.string().uuid().required(),
});

router.get("/", getAll);
router.post("/", validate(createSchema), create);
router.delete("/:questionId/:impressionId", remove);

export default router;
