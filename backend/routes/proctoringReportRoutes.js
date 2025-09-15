import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generateProctoringReport,
  getProctoringReport,
  getProctoringReportsByExam
} from "../controllers/proctoringReportController.js";

const proctoringReportRoutes = express.Router();

proctoringReportRoutes.route("/").post(protect, generateProctoringReport);
proctoringReportRoutes.route("/:examId/:candidateEmail").get(protect, getProctoringReport);
proctoringReportRoutes.route("/exam/:examId").get(protect, getProctoringReportsByExam);

export default proctoringReportRoutes;