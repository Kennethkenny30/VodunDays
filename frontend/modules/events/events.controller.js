import { successResponse } from "../../utils/response.js";
import * as eventsService from "./events.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await eventsService.findAll(req.query);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await eventsService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    // createdBy est injecté depuis le token JWT, pas depuis le body
    const result = await eventsService.create({ ...req.body, createdBy: req.user.id });
    return successResponse(res, result, "Événement créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await eventsService.update(req.params.id, req.body);
    return successResponse(res, result, "Événement mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await eventsService.remove(req.params.id);
    return successResponse(res, null, "Événement supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
