import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, getPublic, remove, update } from "./quiz.controller.js";

const router = Router();

const VALID_SCOPES = ["FESTIVAL", "ALL_EVENTS", "ALL_SITES", "EVENT"];

const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  active: Joi.boolean().optional(),
  scope: Joi.string().valid(...VALID_SCOPES).default("FESTIVAL"),
  eventId: Joi.when("scope", {
    is: "EVENT",
    then: Joi.string().uuid().required(),
    otherwise: Joi.string().uuid().optional().allow(null, ""),
  }),
});

const updateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  active: Joi.boolean().optional(),
  scope: Joi.string().valid(...VALID_SCOPES).optional(),
  eventId: Joi.string().uuid().optional().allow(null, ""),
});

// Route publique (sans auth) pour la consommation par les festivaliers.
// Déclarée avant /:id pour éviter la collision de paramètre.
router.get("/public", getPublic);

// Lecture : festivaliers (quiz actifs) + admins (tous)
router.get("/", getAll);
router.get("/:id", getById);

// Ecriture : ADMIN et SUPER_ADMIN
router.post("/",    authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createSchema), auditLog("quiz", "CREATE", (req) => `Quiz créé : "${req.body.title}"`), create);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("quiz", "UPDATE"), update);
router.put("/:id",   authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateSchema), auditLog("quiz", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), auditLog("quiz", "DELETE"), remove);

export default router;
