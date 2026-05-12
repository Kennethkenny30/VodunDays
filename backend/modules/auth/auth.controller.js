import { successResponse } from "../../utils/response.js";
import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, "Compte créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result, "Connexion réussie");
  } catch (error) {
    next(error);
  }
};
