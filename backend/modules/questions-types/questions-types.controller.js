import { successResponse } from "../../utils/response.js";
import * as questionsTypesService from "./questions-types.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await questionsTypesService.findAll();
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await questionsTypesService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await questionsTypesService.create(req.body);
    return successResponse(res, result, "Type de question créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await questionsTypesService.update(req.params.id, req.body);
    return successResponse(res, result, "Type de question mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await questionsTypesService.remove(req.params.id);
    return successResponse(res, null, "Type de question supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
