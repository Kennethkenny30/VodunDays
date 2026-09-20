import { successResponse } from "../../utils/response.js";
import * as instadService from "./instad.service.js";

export const getOverview = async (req, res, next) => {
  try {
    const result = await instadService.getOverview(req.query);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getPresencePoints = async (req, res, next) => {
  try {
    const result = await instadService.getPresencePoints(req.query);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (req, res, next) => {
  try {
    const csv = await instadService.exportCsv(req.query);
    const filename = `instad_vodundays_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send("\uFEFF" + csv); // BOM UTF-8 pour Excel
  } catch (error) {
    next(error);
  }
};

export const listQuizzes = async (req, res, next) => {
  try {
    const result = await instadService.listQuizzes();
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getQuizStatistics = async (req, res, next) => {
  try {
    const result = await instadService.getQuizStatistics(req.params.id, req.query);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const exportQuizCsv = async (req, res, next) => {
  try {
    const csv = await instadService.exportQuizCsv(req.params.id, req.query);
    const filename = `instad_questionnaire_${req.params.id}_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send("\uFEFF" + csv);
  } catch (error) {
    next(error);
  }
};
