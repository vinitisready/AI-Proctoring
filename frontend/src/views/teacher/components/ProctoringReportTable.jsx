import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { Download } from '@mui/icons-material';

const ProctoringReportTable = ({ reports, onDownloadPDF }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Candidate Name</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Focus Lost</TableCell>
            <TableCell>Multiple Faces</TableCell>
            <TableCell>No Face</TableCell>
            <TableCell>Phone Detected</TableCell>
            <TableCell>Notes Detected</TableCell>
            <TableCell>Integrity Score</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report._id}>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {report.candidateName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {report.candidateEmail}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{formatDuration(report.interviewDuration)}</TableCell>
              <TableCell>{report.focusLostCount}</TableCell>
              <TableCell>{report.suspiciousEvents.multipleFaces}</TableCell>
              <TableCell>{report.suspiciousEvents.noFaceDetected}</TableCell>
              <TableCell>{report.suspiciousEvents.phoneDetected}</TableCell>
              <TableCell>{report.suspiciousEvents.notesDetected}</TableCell>
              <TableCell>
                <Chip
                  label={`${report.integrityScore}%`}
                  color={getScoreColor(report.integrityScore)}
                  variant="filled"
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Download PDF Report">
                  <IconButton 
                    onClick={() => onDownloadPDF(report)}
                    color="primary"
                    size="small"
                  >
                    <Download />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProctoringReportTable;