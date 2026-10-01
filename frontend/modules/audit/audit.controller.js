import { successResponse } from "../../utils/response.js";
import * as service from "./audit.service.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await service.findAll(req.query);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const getStats = async (req, res, next) => {
  try {
    const result = await service.getStats();
    return successResponse(res, result);
  } catch (e) { next(e); }
};
