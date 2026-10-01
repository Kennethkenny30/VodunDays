import { successResponse } from "../../utils/response.js";
import * as usersService from "./users.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await usersService.findAll(req.query.role, req.query.active);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await usersService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await usersService.update(req.params.id, req.body);
    return successResponse(res, result, "Utilisateur mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await usersService.remove(req.params.id);
    return successResponse(res, null, "Utilisateur supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
