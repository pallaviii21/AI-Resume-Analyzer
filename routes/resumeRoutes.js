const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadAndAnalyze, getHistory } = require('../controllers/resumeController');

// POST /api/resume/analyze
router.post('/analyze', upload.single('resume'), uploadAndAnalyze);

// GET /api/resume/history
router.get('/history', getHistory);

module.exports = router;
