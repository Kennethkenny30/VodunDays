import { successResponse } from "../../utils/response.js";
import * as pushService from "./push.service.js";

export const subscribe = async (req, res, next) => {
  try {
    const { uuid, subscription } = req.body;
    const result = await pushService.subscribe(uuid, subscription);
    return successResponse(res, result, "Abonnement push enregistré", 201);
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    await pushService.unsubscribe(endpoint);
    return successResponse(res, null, "Abonnement push supprimé");
  } catch (error) {
    next(error);
  }
};
