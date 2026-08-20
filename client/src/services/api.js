import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

/**
 * Upload a resume file + job description and get AI analysis.
 * @param {File} file
 * @param {string} jobDescription
 * @returns {Promise<{matchScore, missingSkills, suggestions, fileName, id}>}
 */
export async function analyzeResume(file, jobDescription) {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);

  const { data } = await api.post('/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

/**
 * Request AI to generate an updated resume incorporating missing skills.
 * @param {Object} params
 * @param {string} params.resumeText
 * @param {string} params.jobDescription
 * @param {string[]} params.missingSkills
 * @param {string[]} params.suggestions
 * @returns {Promise<Object>}
 */
export async function generateTailoredResume({ resumeText, jobDescription, missingSkills, suggestions }) {
  const { data } = await api.post('/resume/tailor', {
    resumeText,
    jobDescription,
    missingSkills,
    suggestions,
  });
  return data;
}

/**
 * Download ATS-compliant PDF for the provided resume data.
 * @param {Object} resumeData
 * @param {string} [customFileName]
 */
export async function downloadResumePdf(resumeData, customFileName) {
  const response = await api.post('/resume/download-pdf', resumeData, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const safeName = (customFileName || resumeData.name || 'Updated_Resume')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `${safeName}_Tailored_Resume.pdf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Fetch analysis history
 * @returns {Promise<Array>}
 */
export async function getHistory() {
  const { data } = await api.get('/resume/history');
  return data;
}

export default api;

