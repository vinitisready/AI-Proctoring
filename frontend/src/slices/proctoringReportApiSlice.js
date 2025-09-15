import { apiSlice } from './apiSlice';

const PROCTORING_REPORT_URL = '/api/proctoring-report';

export const proctoringReportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateProctoringReport: builder.mutation({
      query: (data) => ({
        url: PROCTORING_REPORT_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getProctoringReport: builder.query({
      query: ({ examId, candidateEmail }) => ({
        url: `${PROCTORING_REPORT_URL}/${examId}/${candidateEmail}`,
      }),
    }),
    getProctoringReportsByExam: builder.query({
      query: (examId) => ({
        url: `${PROCTORING_REPORT_URL}/exam/${examId}`,
      }),
    }),
  }),
});

export const {
  useGenerateProctoringReportMutation,
  useGetProctoringReportQuery,
  useGetProctoringReportsByExamQuery,
} = proctoringReportApiSlice;