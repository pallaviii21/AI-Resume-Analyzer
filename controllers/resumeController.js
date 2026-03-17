const supabase = require('../config/supabase');
const { extractText } = require('../services/parserService');
const { analyzeResume } = require('../services/aiService');
const fs = require('fs');

/**
 * POST /api/resume/analyze
 * Accepts: multipart/form-data { resume: File, jobDescription: string }
 */
const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res
        .status(400)
        .json({ error: 'Job description must be at least 20 characters.' });
    }

    // 1. Extract text from the uploaded file
    const rawText = await extractText(req.file.path, req.file.mimetype);

    if (!rawText || rawText.trim().length < 50) {
      return res
        .status(422)
        .json({ error: 'Could not extract meaningful text from the resume.' });
    }

    // 2. Run AI analysis
    const { matchScore, missingSkills, suggestions } = await analyzeResume(
      rawText,
      jobDescription
    );

    // 3. Save to Supabase (skip if not configured)
    let savedId = null;
    let savedAt = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('resumes')
        .insert([
          {
            file_name: req.file.originalname,
            raw_text: rawText.slice(0, 10000),
            job_description: jobDescription,
            match_score: matchScore,
            missing_skills: missingSkills,
            suggestions,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
      } else {
        savedId = data?.id || null;
        savedAt = data?.created_at || savedAt;
      }
    } else {
      console.warn('Supabase not configured — skipping DB save.');
    }

    // 4. Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (_) {}

    return res.status(200).json({
      id: savedId,
      fileName: req.file.originalname,
      matchScore,
      missingSkills,
      suggestions,
      createdAt: savedAt,
    });
  } catch (err) {
    console.error('uploadAndAnalyze error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
};

/**
 * GET /api/resume/history
 * Returns all past analyses from Supabase, newest first.
 */
const getHistory = async (_req, res) => {
  try {
    if (!supabase) {
      return res.status(200).json([]);
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('id, file_name, match_score, missing_skills, suggestions, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return res.status(200).json(data || []);
  } catch (err) {
    console.error('getHistory error:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadAndAnalyze, getHistory };
