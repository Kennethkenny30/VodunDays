import { verifyToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Token manquant ou invalide", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, "Token expiré ou invalide", 401);
  }
};

// Middleware de vérification des rôles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, "Accès non autorisé", 403);
    }
    next();
  };
};
