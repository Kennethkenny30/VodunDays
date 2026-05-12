import { successResponse } from "../../utils/response.js";
import * as programsService from "./programs.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await programsService.findAll(req.query.eventId);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await programsService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await programsService.create(req.body);
    return successResponse(res, result, "Programme créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await programsService.update(req.params.id, req.body);
    return successResponse(res, result, "Programme mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await programsService.remove(req.params.id);
    return successResponse(res, null, "Programme supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
