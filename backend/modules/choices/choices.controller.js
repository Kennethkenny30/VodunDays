import { successResponse } from "../../utils/response.js";
import * as choicesService from "./choices.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await choicesService.findAll(req.query.questionId);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await choicesService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await choicesService.create(req.body);
    return successResponse(res, result, "Choix créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await choicesService.update(req.params.id, req.body);
    return successResponse(res, result, "Choix mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await choicesService.remove(req.params.id);
    return successResponse(res, null, "Choix supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
