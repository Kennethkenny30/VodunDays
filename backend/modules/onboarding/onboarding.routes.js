import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getByUuid, complete, getStats } from "./onboarding.controller.js";

const router = Router();

const completeSchema = Joi.object({
  language:             Joi.string().valid("fr", "en").required(),
  notificationsEnabled: Joi.boolean().required(),
  gender:               Joi.string().valid("MALE", "FEMALE", "UNDISCLOSED").required(),
  ageRange:             Joi.string().valid(
    "UNDER_18", "FROM_18_TO_24", "FROM_25_TO_34",
    "FROM_35_TO_44", "FROM_45_TO_54", "FROM_55_AND_ABOVE"
  ).required(),
  // Code pays ISO 3166-1 alpha-2 (ex: "BJ", "FR") - fiabilise les stats et
  // correspond a la selection par recherche cote frontend.
  nationality: Joi.string().length(2).uppercase().required(),
  edition:     Joi.string().valid("FIRST", "SECOND", "THIRD", "FOURTH_AND_ABOVE").required(),
});

// Statistiques d'audience pour le dashboard admin (avant /:uuid pour eviter
// que "stats" soit interprete comme un uuid).
router.get("/stats", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getStats);

// Les festivaliers consultent et completent leur propre profil (public,
// identifie uniquement par leur uuid client, meme logique que /answers).
router.get("/:uuid", getByUuid);
router.post("/:uuid", validate(completeSchema), complete);

export default router;
