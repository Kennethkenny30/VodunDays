import { successResponse } from "../../utils/response.js";
import * as service from "./platform.service.js";

export const getStats = async (req, res, next) => {
  try {
    const result = await service.getStats();
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const getActivity = async (req, res, next) => {
  try {
    const result = await service.getActivity(req.query);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const getHealth = async (req, res, next) => {
  try {
    const result = await service.getHealth();
    return successResponse(res, result);
  } catch (e) { next(e); }
};
