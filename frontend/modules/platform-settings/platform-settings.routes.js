import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { list, update } from "./platform-settings.controller.js";

const router = Router();

const updateSchema = Joi.object({
  enabled: Joi.boolean().required(),
});

// Réglages plateforme (modules activables + interrupteurs d'urgence).
// Lecture ouverte à ADMIN/SUPER_ADMIN, bascule réservée à SUPER_ADMIN vu
// l'impact direct sur tous les festivaliers connectés (coupure GPS/push,
// mode maintenance).
router.use(authenticate);

router.get("/",       authorize("ADMIN", "SUPER_ADMIN"), list);
router.patch("/:key",  authorize("SUPER_ADMIN"), validate(updateSchema), update);

export default router;
