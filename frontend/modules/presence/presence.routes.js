import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getOnlineNow, ping } from "./presence.controller.js";

const router = Router();

const pingSchema = Joi.object({
  // uuid festivalier côté client (localStorage vd_uuid), même identifiant
  // que celui utilisé dans Answers.uuid / Festivaliers.uuid
  uuid:      Joi.string().uuid().required(),
  latitude:  Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

// Ping de présence envoyé périodiquement par l'app festivalier (public,
// identifié uniquement par son uuid client, même logique que /answers)
router.post("/", validate(pingSchema), ping);

// Vue agrégée pour le dashboard superadmin
router.get("/online", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getOnlineNow);

export default router;
