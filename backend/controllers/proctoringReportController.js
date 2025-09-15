import asyncHandler from "express-async-handler";
import ProctoringReport from "../models/proctoringReportModel.js";
import CheatingLog from "../models/cheatingLogModel.js";

// @desc Generate and save proctoring report
// @route POST /api/proctoring-report
// @access Private
const generateProctoringReport = asyncHandler(async (req, res) => {
  try {
    console.log('Generating proctoring report with body:', req.body);
    const { candidateName, candidateEmail, examId, startTime, endTime, focusLostCount } = req.body;

    // Calculate interview duration in minutes
    const duration = Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60));

    // Use default suspicious events for now
    const suspiciousEvents = {
      multipleFaces: 1,
      noFaceDetected: 2,
      phoneDetected: 0,
      notesDetected: 1
    };

    // Calculate integrity score
    const deductions = {
      focusLost: (focusLostCount || 0) * 2,
      multipleFaces: suspiciousEvents.multipleFaces * 10,
      noFaceDetected: suspiciousEvents.noFaceDetected * 3,
      phoneDetected: suspiciousEvents.phoneDetected * 15,
      notesDetected: suspiciousEvents.notesDetected * 10
    };
    
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
    const integrityScore = Math.max(0, 100 - totalDeductions);

    const reportData = {
      candidateName,
      candidateEmail,
      examId,
      examName: `Exam ${examId}`,
      interviewDuration: duration,
      focusLostCount: focusLostCount || 0,
      suspiciousEvents,
      integrityScore,
      startTime,
      endTime
    };

    console.log('Creating report with data:', reportData);
    const report = new ProctoringReport(reportData);
    const savedReport = await report.save();
    console.log('Report saved successfully:', savedReport);
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error in generateProctoringReport:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc Get proctoring report by exam and candidate
// @route GET /api/proctoring-report/:examId/:candidateEmail
// @access Private
const getProctoringReport = asyncHandler(async (req, res) => {
  const { examId, candidateEmail } = req.params;
  
  const report = await ProctoringReport.findOne({ examId, candidateEmail });
  
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }
  
  res.status(200).json(report);
});

// @desc Get all proctoring reports for an exam
// @route GET /api/proctoring-report/exam/:examId
// @access Private
const getProctoringReportsByExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  
  try {
    const reports = await ProctoringReport.find({ examId });
    res.status(200).json(reports || []);
  } catch (error) {
    console.error('Error fetching proctoring reports:', error);
    res.status(200).json([]);
  }
});

export { generateProctoringReport, getProctoringReport, getProctoringReportsByExam };