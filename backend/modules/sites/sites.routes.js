import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, getZone, remove, update, updateZone } from "./sites.controller.js";

const router = Router();

const CATEGORIES = ["SITE", "TOILETTES", "URGENCES", "TRANSPORT", "ASSISTANCE", "PRA", "SCENE"];

const createSchema = Joi.object({
  name:        Joi.string().required(),
  description: Joi.string().optional().allow(""),
  latitude:    Joi.number().required(),
  longitude:   Joi.number().required(),
  type:        Joi.string().required(),
  category:    Joi.string().valid(...CATEGORIES).default("SITE"),
  capacity:    Joi.number().integer().min(0).default(0),
  // Champs PRA - optionnels, pertinents uniquement si category === "PRA"
  // (null, pas seulement absents : un site non-PRA les renvoie tels quels
  // depuis le formulaire d'édition)
  arLabel:     Joi.string().allow("", null).optional(),
  arContent:   Joi.string().allow("", null).optional(),
  arRadius:    Joi.number().positive().allow(null).optional(),
});

const updateSchema = Joi.object({
  name:        Joi.string().optional(),
  description: Joi.string().allow("", null).optional(),
  latitude:    Joi.number().optional(),
  longitude:   Joi.number().optional(),
  type:        Joi.string().optional(),
  category:    Joi.string().valid(...CATEGORIES).optional(),
  capacity:    Joi.number().integer().min(0).optional(),
  arLabel:     Joi.string().allow("", null).optional(),
  arContent:   Joi.string().allow("", null).optional(),
  arRadius:    Joi.number().positive().allow(null).optional(),
});

const ringSchema = Joi.array()
  .items(Joi.array().items(Joi.number()).length(2))
  .min(4); // anneau fermé : premier point = dernier point

const zoneSchema = Joi.object({
  zoneGeo: Joi.alternatives().try(
    Joi.object({
      type:        Joi.string().valid("Polygon").required(),
      coordinates: Joi.array().items(ringSchema).min(1).required(),
    }),
    Joi.valid(null),
  ).required(),
});

// Lecture publique (festivaliers + carte)
// GET /api/sites             → tous les sites
// GET /api/sites?category=PRA → filtrage par catégorie
router.get("/", getAll);
router.get("/:id", getById);
router.get("/:id/zone", getZone);

// ── Écriture : SUPER_ADMIN uniquement ────────────────────────────────────────
router.post("/",      authenticate, authorize("SUPER_ADMIN"), validate(createSchema), auditLog("sites", "CREATE"), create);
router.patch("/:id",  authenticate, authorize("SUPER_ADMIN"), validate(updateSchema), auditLog("sites", "UPDATE"), update);
router.put("/:id",    authenticate, authorize("SUPER_ADMIN"), validate(updateSchema), auditLog("sites", "UPDATE"), update);
router.patch("/:id/zone", authenticate, authorize("SUPER_ADMIN"), validate(zoneSchema), auditLog("sites", "UPDATE"), updateZone);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), auditLog("sites", "DELETE"), remove);

export default router;