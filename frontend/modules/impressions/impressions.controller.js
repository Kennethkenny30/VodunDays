import { successResponse } from "../../utils/response.js";
import * as impressionsService from "./impressions.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await impressionsService.findAll();
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await impressionsService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await impressionsService.create(req.body);
    return successResponse(res, result, "Impression créée avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await impressionsService.update(req.params.id, req.body);
    return successResponse(res, result, "Impression mise à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await impressionsService.remove(req.params.id);
    return successResponse(res, null, "Impression supprimée avec succès");
  } catch (error) {
    next(error);
  }
};
