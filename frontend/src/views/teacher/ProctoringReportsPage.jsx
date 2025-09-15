import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import ProctoringReportTable from './components/ProctoringReportTable';
import { useGetExamsQuery } from '../../slices/examApiSlice';
import { useGetProctoringReportsByExamQuery, useGenerateProctoringReportMutation } from '../../slices/proctoringReportApiSlice';
import { generateProctoringReportPDF } from '../../utils/pdfGenerator';
import { useSelector } from 'react-redux';

const ProctoringReportsPage = () => {
  const [selectedExamId, setSelectedExamId] = useState('');
  
  const { userInfo } = useSelector((state) => state.auth);
  const { data: exams, isLoading: examsLoading, error: examsError } = useGetExamsQuery();
  const { 
    data: reports, 
    isLoading: reportsLoading, 
    error: reportsError 
  } = useGetProctoringReportsByExamQuery(selectedExamId, {
    skip: !selectedExamId
  });
  const [generateReport] = useGenerateProctoringReportMutation();

  const handleDownloadPDF = (report) => {
    generateProctoringReportPDF(report);
  };

  const handleGenerateTestReport = async () => {
    if (!selectedExamId) {
      alert('Please select an exam first');
      return;
    }
    
    try {
      // Test API connectivity first
      const testResponse = await fetch('/api/test-proctoring');
      const testData = await testResponse.json();
      console.log('API Test:', testData);
      
      const testReportData = {
        candidateName: 'Test Student',
        candidateEmail: 'test@example.com',
        examId: selectedExamId,
        startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        endTime: new Date().toISOString(),
        focusLostCount: 3
      };
      
      console.log('Sending test report data:', testReportData);
      const result = await generateReport(testReportData).unwrap();
      console.log('Test report generated:', result);
      alert('Test report generated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error generating test report:', error);
      alert('Error: ' + (error?.data?.message || error?.message || 'Unknown error'));
    }
  };

  // Debug logging
  React.useEffect(() => {
    console.log('Exams:', exams);
    console.log('Selected Exam ID:', selectedExamId);
    console.log('Reports:', reports);
    if (reportsError) console.error('Reports Error:', reportsError);
    if (examsError) console.error('Exams Error:', examsError);
  }, [exams, selectedExamId, reports, reportsError, examsError]);

  return (
    <PageContainer title="Proctoring Reports" description="View exam proctoring reports">
      <DashboardCard title="Proctoring Reports">
        {examsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading exams: {examsError?.data?.message || examsError?.message || 'Unknown error'}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Exam</InputLabel>
            <Select
              value={selectedExamId}
              label="Select Exam"
              onChange={(e) => setSelectedExamId(e.target.value)}
              disabled={examsLoading}
            >
              {exams?.map((exam) => (
                <MenuItem key={exam.examId || exam._id} value={exam.examId || exam._id}>
                  {exam.examName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {selectedExamId && (
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleGenerateTestReport}
              >
                Generate Test Report (Debug)
              </Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  const testReport = {
                    candidateName: 'Test Student',
                    candidateEmail: 'test@example.com',
                    examName: 'Sample Exam',
                    interviewDuration: 60,
                    focusLostCount: 3,
                    suspiciousEvents: {
                      multipleFaces: 1,
                      noFaceDetected: 2,
                      phoneDetected: 0,
                      notesDetected: 1
                    },
                    integrityScore: 75,
                    startTime: new Date(Date.now() - 60*60*1000).toISOString(),
                    endTime: new Date().toISOString()
                  };
                  handleDownloadPDF(testReport);
                }}
              >
                Test Download PDF
              </Button>
            </Box>
          )}
        </Box>

        {reportsLoading && (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        )}

        {reportsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading reports: {reportsError?.data?.message || reportsError?.message || 'Unknown error occurred'}
          </Alert>
        )}

        {reports && reports.length > 0 && (
          <ProctoringReportTable reports={reports} onDownloadPDF={handleDownloadPDF} />
        )}

        {reports && reports.length === 0 && selectedExamId && !reportsLoading && (
          <Box textAlign="center" p={3}>
            <Typography variant="body1" color="textSecondary">
              No proctoring reports found for this exam.
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Reports are generated automatically when students complete exams.
            </Typography>
          </Box>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default ProctoringReportsPage;