import { successResponse } from "../../utils/response.js";
import * as service from "./notifications.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await service.findAll(req.query);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
  try {
    const result = await service.findById(req.params.id);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const result = await service.create(req.body);
    return successResponse(res, result, "Notification créée avec succès", 201);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const result = await service.update(req.params.id, req.body);
    return successResponse(res, result, "Notification mise à jour");
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    return successResponse(res, null, "Notification supprimée");
  } catch (e) { next(e); }
};

export const getStats = async (req, res, next) => {
  try {
    const result = await service.getStats();
    return successResponse(res, result);
  } catch (e) { next(e); }
};
