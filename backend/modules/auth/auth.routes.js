import { Router } from "express";
import Joi from "joi";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { auditLog } from "../../middlewares/audit.middleware.js";
import { login, logout, me, register, updateMe } from "./auth.controller.js";

const router = Router();

// ─── Schémas de validation ────────────────────────────────────────────────────

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  phone: Joi.string().optional().allow(""),
  // Seul un SUPER_ADMIN peut créer un compte, et peut choisir le rôle
  role: Joi.string().valid("SUPER_ADMIN", "ADMIN").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateMeSchema = Joi.object({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  phone: Joi.string().optional().allow(""),
  email: Joi.string().email().optional(),
  currentPassword: Joi.string().optional(),
  newPassword: Joi.string().min(8).optional(),
}).with("newPassword", "currentPassword");

// ─── Routes ───────────────────────────────────────────────────────────────────

// Publiques
router.post("/login",
  validate(loginSchema),
  auditLog("auth", "AUTH", (req) => `Connexion : ${req.body.email}`),
  login
);
router.post("/logout", logout);

// Protégées
router.get("/me", authenticate, me);
router.patch("/me", authenticate, validate(updateMeSchema), updateMe);

// Création de compte : réservée au SUPER_ADMIN
router.post(
  "/register",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(registerSchema),
  auditLog("users", "CREATE", (req) => `Création du compte : ${req.body.email} (${req.body.role || "ADMIN"})`),
  register
);

export default router;
