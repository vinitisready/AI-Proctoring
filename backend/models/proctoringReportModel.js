import mongoose from "mongoose";

const proctoringReportSchema = new mongoose.Schema(
  {
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    examId: { type: String, required: true },
    examName: { type: String, required: true },
    interviewDuration: { type: Number, required: true }, // in minutes
    focusLostCount: { type: Number, default: 0 },
    suspiciousEvents: {
      multipleFaces: { type: Number, default: 0 },
      noFaceDetected: { type: Number, default: 0 },
      phoneDetected: { type: Number, default: 0 },
      notesDetected: { type: Number, default: 0 }
    },
    integrityScore: { type: Number, default: 100 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
  },
  {
    timestamps: true,
  }
);

const ProctoringReport = mongoose.model("ProctoringReport", proctoringReportSchema);

export default ProctoringReport;