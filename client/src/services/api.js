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
 * Fetch analysis history
 * @returns {Promise<Array>}
 */
export async function getHistory() {
  const { data } = await api.get('/resume/history');
  return data;
}

export default api;
