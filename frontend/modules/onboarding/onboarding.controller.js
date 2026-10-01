import { successResponse } from "../../utils/response.js";
import * as onboardingService from "./onboarding.service.js";

export const getByUuid = async (req, res, next) => {
  try {
    const result = await onboardingService.findByUuid(req.params.uuid);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const complete = async (req, res, next) => {
  try {
    const result = await onboardingService.upsert(req.params.uuid, req.body);
    return successResponse(res, result, "Onboarding enregistré avec succès", 201);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const result = await onboardingService.getStats();
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
