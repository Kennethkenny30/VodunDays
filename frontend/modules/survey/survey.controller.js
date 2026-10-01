import { successResponse } from "../../utils/response.js";
import * as service from "./survey.service.js";

export const getStats = async (req, res, next) => {
  try {
    const result = await service.getStats(req.query);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const getComments = async (req, res, next) => {
  try {
    const result = await service.getComments(req.query);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const exportCsv = async (req, res, next) => {
  try {
    const csv = await service.exportCsv(req.query);
    const filename = `survey_export_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send("\uFEFF" + csv); // BOM UTF-8 pour Excel
  } catch (e) { next(e); }
};
