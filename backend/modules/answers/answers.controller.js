import { successResponse } from "../../utils/response.js";
import * as answersService from "./answers.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await answersService.findAll(req.query.questionId);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await answersService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await answersService.create(req.body);
    return successResponse(res, result, "Réponse créée avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await answersService.update(req.params.id, req.body);
    return successResponse(res, result, "Réponse mise à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await answersService.remove(req.params.id);
    return successResponse(res, null, "Réponse supprimée avec succès");
  } catch (error) {
    next(error);
  }
};
