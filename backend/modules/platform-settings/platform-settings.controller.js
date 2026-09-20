import { successResponse } from "../../utils/response.js";
import * as settingsService from "./platform-settings.service.js";

export const list = async (req, res, next) => {
  try {
    const result = await settingsService.list();
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    // req.user vient du JWT décodé (voir auth.middleware.js) : { id, email, role }.
    // Pas de nom en clair dans le token, donc on trace l'email dans AuditLogs -
    // suffisant pour identifier l'auteur, pas besoin d'aller chercher
    // firstname/lastname en base pour ça.
    const actor = req.user ? { id: req.user.id, name: req.user.email } : {};
    const result = await settingsService.setEnabled(req.params.key, req.body.enabled, actor);
    return successResponse(res, result, "Réglage mis à jour");
  } catch (error) {
    next(error);
  }
};
