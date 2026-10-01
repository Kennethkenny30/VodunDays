import { successResponse } from "../../utils/response.js";
import * as authService from "./auth.service.js";

// Helpers cookie

const COOKIE_NAME = "vd_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, { ...COOKIE_OPTIONS, maxAge: COOKIE_MAX_AGE });
}

function clearAuthCookie(res) {
  // Les attributs doivent correspondre à ceux de setAuthCookie, sinon le
  // navigateur ne supprime pas le cookie.
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
}

// Controllers

// POST /api/auth/register  (SUPER_ADMIN uniquement via middleware)
export const register = async (req, res, next) => {
  try {
    // createdBy = l'utilisateur connecté qui crée le compte
    const createdBy = req.user?.id || null;
    const result = await authService.register({ ...req.body, createdBy });
    return successResponse(res, result, "Compte créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);

    // Pose le cookie HttpOnly
    setAuthCookie(res, token);

    // Retourne aussi le token dans le body pour les clients API (ex : mobile)
    return successResponse(res, { user, token }, "Connexion réussie");
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  clearAuthCookie(res);
  return successResponse(res, null, "Déconnexion réussie");
};

// GET /api/auth/me
export const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return successResponse(res, user, "Profil récupéré");
  } catch (error) {
    next(error);
  }
};

// PATCH /api/auth/me
export const updateMe = async (req, res, next) => {
  try {
    const result = await authService.updateMe({ userId: req.user.id, ...req.body });
    return successResponse(res, result, "Profil mis à jour");
  } catch (error) {
    next(error);
  }
};
