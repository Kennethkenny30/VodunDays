import { successResponse } from "../../utils/response.js";
import * as artistsService from "./artists.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await artistsService.findAll(req.query.eventId);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await artistsService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await artistsService.create(req.body);
    return successResponse(res, result, "Artiste créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await artistsService.update(req.params.id, req.body);
    return successResponse(res, result, "Artiste mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await artistsService.remove(req.params.id);
    return successResponse(res, null, "Artiste supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
