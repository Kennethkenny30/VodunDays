import { successResponse, errorResponse } from "../../utils/response.js";
import * as questionsService from "./questions.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await questionsService.findAll(req.query.quizId);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await questionsService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await questionsService.create(req.body);
    return successResponse(res, result, "Question créée avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await questionsService.update(req.params.id, req.body);
    return successResponse(res, result, "Question mise à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await questionsService.remove(req.params.id);
    return successResponse(res, null, "Question supprimée avec succès");
  } catch (error) {
    next(error);
  }
};

export const reorder = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, "ids doit être un tableau non vide", 400);
    }
    await questionsService.reorder(ids);
    return successResponse(res, null, "Ordre mis à jour");
  } catch (error) {
    next(error);
  }
};
