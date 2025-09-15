import store from '../store';
import { proctoringReportApiSlice } from '../slices/proctoringReportApiSlice';

export const generateProctoringReportOnSubmission = async (examData, userInfo, cheatingLog, startTime) => {
  try {
    console.log('Generating proctoring report with data:', {
      examData,
      userInfo,
      cheatingLog,
      startTime
    });
    
    const endTime = new Date().toISOString();
    
    const reportData = {
      candidateName: userInfo.name,
      candidateEmail: userInfo.email,
      examId: examData.examId || examData._id,
      startTime: startTime,
      endTime: endTime,
      focusLostCount: cheatingLog.focusLostCount || 0
    };

    console.log('Report data to send:', reportData);

    // Dispatch the mutation to generate the report
    const result = await store.dispatch(
      proctoringReportApiSlice.endpoints.generateProctoringReport.initiate(reportData)
    ).unwrap();

    console.log('Proctoring report generated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error generating proctoring report:', error);
    console.error('Error details:', error?.data || error?.message);
    // Don't throw error to prevent test submission failure
    return null;
  }
};