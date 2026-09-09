import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { subscribe, unsubscribe } from "./push.controller.js";

const router = Router();

const subscribeSchema = Joi.object({
  uuid: Joi.string().uuid().required(),
  subscription: Joi.object({
    endpoint: Joi.string().uri().required(),
    keys: Joi.object({
      p256dh: Joi.string().required(),
      auth:   Joi.string().required(),
    }).required(),
  }).required(),
});

const unsubscribeSchema = Joi.object({
  endpoint: Joi.string().uri().required(),
});

// Public, identifie par l'uuid festivalier client (meme logique que /answers
// et /onboarding) : pas de compte utilisateur pour un festivalier.
router.post("/subscribe",   validate(subscribeSchema),   subscribe);
router.post("/unsubscribe", validate(unsubscribeSchema), unsubscribe);

export default router;
