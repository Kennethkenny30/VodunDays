import { successResponse } from "../../utils/response.js";
import * as quizService from "./quiz.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await quizService.findAll(req.query.eventId, req.query.active);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await quizService.findById(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await quizService.create(req.body);
    return successResponse(res, result, "Quiz créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await quizService.update(req.params.id, req.body);
    return successResponse(res, result, "Quiz mis à jour avec succès");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await quizService.remove(req.params.id);
    return successResponse(res, null, "Quiz supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
