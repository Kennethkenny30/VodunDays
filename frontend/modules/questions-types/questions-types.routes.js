import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, remove, update } from "./questions-types.controller.js";

const router = Router();

const VALID_KINDS = ["RATING", "SINGLE", "MULTIPLE", "TEXT"];

const createSchema = Joi.object({
  types: Joi.string().required(),
  kind: Joi.string().valid(...VALID_KINDS).default("TEXT"),
});
const updateSchema = Joi.object({
  types: Joi.string().optional(),
  kind: Joi.string().valid(...VALID_KINDS).optional(),
});

router.get("/", getAll);
router.get("/:id", getById);
router.post("/",     authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), auditLog("questions-types", "CREATE", (req) => `Type de question créé : "${req.body.types}" (${req.body.kind})`), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("questions-types", "UPDATE"), update);
router.put("/:id",   authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("questions-types", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), auditLog("questions-types", "DELETE"), remove);

export default router;
