/**
 * Middleware d'audit automatique.
 *
 * À appliquer sur les routes de mutation (POST, PATCH, PUT, DELETE).
 * Usage :  router.post("/", authenticate, auditLog("events", "CREATE"), validate(...), create)
 *
 * Il enregistre APRÈS la réponse (event "finish") pour ne pas bloquer la requête
 * et ne capturer que les succès (statusCode < 400).
 */

import { log } from "../modules/audit/audit.service.js";

/**
 * @param {string} module  - Nom du module (ex: "events", "sites", "users")
 * @param {string} action  - "CREATE" | "UPDATE" | "DELETE" | "AUTH" | "CONFIG" | "INCIDENT"
 * @param {Function} [descriptionFn] - Optionnel : fonction (req, res) => string pour personnaliser la description
 */
export const auditLog = (module, action, descriptionFn) => {
  return (req, res, next) => {
    res.on("finish", () => {
      // On ne logge que les succès
      if (res.statusCode >= 400) return;

      const userId   = req.user?.id   || null;
      const userName = req.user
        ? `${req.user.firstname ?? ""} ${req.user.lastname ?? ""}`.trim() || req.user.email
        : null;

      const ipAddress =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        null;

      const description = descriptionFn
        ? descriptionFn(req, res)
        : buildDefaultDescription(action, module, req);

      log({ action, module, description, userId, userName, ipAddress });
    });

    next();
  };
};

function buildDefaultDescription(action, module, req) {
  const id = req.params?.id ? ` [${req.params.id.slice(0, 8)}…]` : "";
  const names = {
    CREATE: `Création dans ${module}${id}`,
    UPDATE: `Modification dans ${module}${id}`,
    DELETE: `Suppression dans ${module}${id}`,
    AUTH:   `Authentification (${module})`,
    CONFIG: `Configuration modifiée (${module})`,
    INCIDENT: `Incident signalé (${module})`,
  };
  return names[action] || `Action ${action} sur ${module}${id}`;
}
