import { successResponse } from "../../utils/response.js";
import * as presenceService from "./presence.service.js";

export const ping = async (req, res, next) => {
  try {
    const { uuid, latitude, longitude } = req.body;
    const result = await presenceService.record(uuid, { latitude, longitude });
    return successResponse(res, result, "Présence enregistrée", 201);
  } catch (error) {
    next(error);
  }
};

export const getOnlineNow = async (req, res, next) => {
  try {
    const result = await presenceService.getOnlineNow();
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
