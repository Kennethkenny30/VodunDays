import { verifyToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

// ─── authenticate ─────────────────────────────────────────────────────────────
// Accepte le token depuis :
//   1. Cookie HttpOnly  "vd_token"  (dashboard web)
//   2. Header           "Authorization: Bearer <token>"  (clients API / mobile)

export const authenticate = (req, res, next) => {
  try {
    let token = null;

    // 1. Cookie HttpOnly (priorité)
    if (req.cookies && req.cookies.vd_token) {
      token = req.cookies.vd_token;
    }

    // 2. Header Authorization
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return errorResponse(res, "Authentification requise", 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return errorResponse(res, "Token expiré ou invalide", 401);
  }
};

// ─── authorize ────────────────────────────────────────────────────────────────
// Usage : authorize("SUPER_ADMIN")  ou  authorize("SUPER_ADMIN", "ADMIN")

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Authentification requise", 401);
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        "Vous n'avez pas les droits nécessaires pour cette action",
        403
      );
    }
    next();
  };
};
