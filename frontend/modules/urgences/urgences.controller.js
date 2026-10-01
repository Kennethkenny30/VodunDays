import { successResponse } from "../../utils/response.js";
import * as service from "./urgences.service.js";

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

export const getByUuid = async (req, res, next) => {
  try {
    const result = await service.findByUuid(req.params.uuid);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const getStats = async (req, res, next) => {
  try {
    const result = await service.getStats();
    return successResponse(res, result);
  } catch (e) { next(e); }
};

// POST public - festivalier anonyme
export const create = async (req, res, next) => {
  try {
    const result = await service.create(req.body);
    return successResponse(res, result, "Alerte envoyée avec succès", 201);
  } catch (e) { next(e); }
};

// PATCH admin - changement de statut
export const updateStatus = async (req, res, next) => {
  try {
    const result = await service.updateStatus(req.params.id, req.body, req.user);
    return successResponse(res, result, "Statut mis à jour");
  } catch (e) { next(e); }
};
