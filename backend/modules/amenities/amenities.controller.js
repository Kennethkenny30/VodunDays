import { successResponse } from "../../utils/response.js";
import * as amenitiesService from "./amenities.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await amenitiesService.findAll(req.query.siteId);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await amenitiesService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await amenitiesService.create(req.body);
    return successResponse(res, result, "Équipement créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await amenitiesService.update(req.params.id, req.body);
    return successResponse(res, result, "Équipement mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await amenitiesService.remove(req.params.id);
    return successResponse(res, null, "Équipement supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
