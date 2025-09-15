export const generateProctoringReportPDF = (report) => {
  console.log('Generating PDF for report:', report);
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'EXCELLENT';
    if (score >= 60) return 'GOOD';
    return 'NEEDS ATTENTION';
  };

  // Calculate deductions
  const deductions = {
    focusLost: report.focusLostCount * 2,
    multipleFaces: report.suspiciousEvents.multipleFaces * 10,
    noFaceDetected: report.suspiciousEvents.noFaceDetected * 3,
    phoneDetected: report.suspiciousEvents.phoneDetected * 15,
    notesDetected: report.suspiciousEvents.notesDetected * 10
  };
  
  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);

  const content = `


📋 CANDIDATE INFORMATION
────────────────────────────────────────────────────────────────
Name:           ${report.candidateName}
Email:          ${report.candidateEmail}
Exam:           ${report.examName}
Duration:       ${formatDuration(report.interviewDuration)}
Date:           ${new Date(report.startTime).toLocaleDateString()}
Time:           ${new Date(report.startTime).toLocaleTimeString()} - ${new Date(report.endTime).toLocaleTimeString()}

 MONITORING SUMMARY
────────────────────────────────────────────────────────────────

 FOCUS & ATTENTION:
   • Focus Lost Events:        ${report.focusLostCount} times
   • Deduction:               -${deductions.focusLost} points (${report.focusLostCount} × 2 pts)

 FACE DETECTION:
   • Multiple Faces:          ${report.suspiciousEvents.multipleFaces} detections
   • Deduction:               -${deductions.multipleFaces} points (${report.suspiciousEvents.multipleFaces} × 10 pts)
   
   • No Face Visible:         ${report.suspiciousEvents.noFaceDetected} instances
   • Deduction:               -${deductions.noFaceDetected} points (${report.suspiciousEvents.noFaceDetected} × 3 pts)

 PROHIBITED ITEMS:
   • Phone Detected:          ${report.suspiciousEvents.phoneDetected} times
   • Deduction:               -${deductions.phoneDetected} points (${report.suspiciousEvents.phoneDetected} × 15 pts)
   
   • Notes/Books Detected:    ${report.suspiciousEvents.notesDetected} times
   • Deduction:               -${deductions.notesDetected} points (${report.suspiciousEvents.notesDetected} × 10 pts)

INTEGRITY ASSESSMENT
────────────────────────────────────────────────────────────────
Starting Score:             100 points
Total Deductions:          -${totalDeductions} points

FINAL INTEGRITY SCORE:      ${report.integrityScore}% (${getScoreStatus(report.integrityScore)})

 DETAILED ANALYSIS
────────────────────────────────────────────────────────────────

 VIOLATION BREAKDOWN:
   1. Focus Loss (Tab Switching):     ${report.focusLostCount} incidents
   2. Multiple Person Detection:      ${report.suspiciousEvents.multipleFaces} occurrences
   3. Face Not Visible:               ${report.suspiciousEvents.noFaceDetected} instances
   4. Mobile Phone Usage:             ${report.suspiciousEvents.phoneDetected} detections
   5. Unauthorized Materials:         ${report.suspiciousEvents.notesDetected} instances
 SCORING CRITERIA:
   • Focus Loss:              2 points per incident
   • Multiple Faces:          10 points per detection (High Risk)
   • No Face Visible:         3 points per instance
   • Phone Detection:         15 points per occurrence (Critical)
   • Notes/Books:             10 points per detection (High Risk)

 PERFORMANCE EVALUATION:
${report.integrityScore >= 80 ? 
   '    EXCELLENT: Candidate demonstrated outstanding exam integrity\n      with minimal violations. Highly trustworthy performance.' :
   report.integrityScore >= 60 ?
   '     GOOD: Candidate showed acceptable exam behavior with some\n      minor concerns. Generally trustworthy with room for improvement.' :
   '    NEEDS ATTENTION: Multiple violations detected that require\n      investigation. Exam integrity may be compromised.'}

 RECOMMENDATIONS:
${report.integrityScore >= 80 ? 
   '   • No action required - excellent performance\n   • Candidate can be trusted for future assessments' :
   report.integrityScore >= 60 ?
   '   • Review specific violations with candidate\n   • Provide guidance on proper exam protocols\n   • Monitor closely in future assessments' :
   '   • Immediate review required\n   • Consider re-examination under stricter supervision\n   • Implement additional security measures'}

────────────────────────────────────────────────────────────────

 Report Date: ${new Date().toLocaleString()}
 Confidential - For Authorized Personnel Only
════════════════════════════════════════════════════════════════
  `;

  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Proctoring_Report_${report.candidateName.replace(/\s+/g, '_')}_${report.examName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('PDF download initiated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error downloading report: ' + error.message);
  }
};