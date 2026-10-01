import { successResponse } from "../../utils/response.js";
import * as questionsImpressionsService from "./questions-impressions.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await questionsImpressionsService.findAll(
      req.query.questionId,
      req.query.impressionId
    );
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await questionsImpressionsService.create(req.body);
    return successResponse(res, result, "Lien question-impression créé avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { questionId, impressionId } = req.params;
    await questionsImpressionsService.remove(questionId, impressionId);
    return successResponse(res, null, "Lien question-impression supprimé avec succès");
  } catch (error) {
    next(error);
  }
};
