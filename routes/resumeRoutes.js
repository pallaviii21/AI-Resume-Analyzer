const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadAndAnalyze,
  generateTailoredResumeController,
  downloadResumePdfController,
  getHistory,
} = require('../controllers/resumeController');

// POST /api/resume/analyze
router.post('/analyze', upload.single('resume'), uploadAndAnalyze);

// POST /api/resume/tailor
router.post('/tailor', generateTailoredResumeController);

// POST /api/resume/download-pdf
router.post('/download-pdf', downloadResumePdfController);

// GET /api/resume/history
router.get('/history', getHistory);

module.exports = router;

