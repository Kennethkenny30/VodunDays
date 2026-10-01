import { successResponse } from "../../utils/response.js";
import * as eventsTypesService from "./events-types.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await eventsTypesService.findAll();
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await eventsTypesService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await eventsTypesService.create(req.body);
    return successResponse(res, result, "Type d'événement créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await eventsTypesService.update(req.params.id, req.body);
    return successResponse(res, result, "Type d'événement mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await eventsTypesService.remove(req.params.id);
    return successResponse(res, null, "Type d'événement supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
