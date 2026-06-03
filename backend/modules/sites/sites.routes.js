import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { create, getAll, getById, remove, update } from "./sites.controller.js";

const router = Router();

const CATEGORIES = ["SITE", "TOILETTES", "URGENCES", "TRANSPORT", "ASSISTANCE", "PRA"];

const createSchema = Joi.object({
  name:        Joi.string().required(),
  description: Joi.string().optional().allow(""),
  latitude:    Joi.number().required(),
  longitude:   Joi.number().required(),
  type:        Joi.string().required(),
  category:    Joi.string().valid(...CATEGORIES).default("SITE"),
  capacity:    Joi.number().integer().min(0).default(0),
  // Champs PRA — optionnels, pertinents uniquement si category === "PRA"
  arLabel:     Joi.string().optional().allow(""),
  arContent:   Joi.string().optional().allow(""),
  arRadius:    Joi.number().positive().optional(),
});

const updateSchema = Joi.object({
  name:        Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  latitude:    Joi.number().optional(),
  longitude:   Joi.number().optional(),
  type:        Joi.string().optional(),
  category:    Joi.string().valid(...CATEGORIES).optional(),
  capacity:    Joi.number().integer().min(0).optional(),
  arLabel:     Joi.string().optional().allow(""),
  arContent:   Joi.string().optional().allow(""),
  arRadius:    Joi.number().positive().optional(),
});

// Lecture publique (festivaliers + carte)
// GET /api/sites             → tous les sites
// GET /api/sites?category=PRA → filtrage par catégorie
router.get("/", getAll);
router.get("/:id", getById);

// ── Écriture : SUPER_ADMIN uniquement ────────────────────────────────────────
router.post("/",      authenticate, authorize("SUPER_ADMIN"), validate(createSchema), auditLog("sites", "CREATE"), create);
router.patch("/:id",  authenticate, authorize("SUPER_ADMIN"), validate(updateSchema), auditLog("sites", "UPDATE"), update);
router.put("/:id",    authenticate, authorize("SUPER_ADMIN"), validate(updateSchema), auditLog("sites", "UPDATE"), update);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), auditLog("sites", "DELETE"), remove);

export default router;