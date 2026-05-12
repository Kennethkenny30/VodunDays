import { successResponse } from "../../utils/response.js";
import * as sitesService from "./sites.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await sitesService.findAll();
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await sitesService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await sitesService.create(req.body);
    return successResponse(res, result, "Site créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await sitesService.update(req.params.id, req.body);
    return successResponse(res, result, "Site mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await sitesService.remove(req.params.id);
    return successResponse(res, null, "Site supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
