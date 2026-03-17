require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Analyze resume against a job description using Groq API.
 * Returns { matchScore, missingSkills, suggestions }
 */
async function analyzeResume(resumeText, jobDescription) {
  // If no API key, return demo data so the app still works
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    console.warn('⚠️  No Groq key — returning mock analysis data.');
    return getMockAnalysis(resumeText, jobDescription);
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) and career coach.

Analyze the following resume against the given job description.

Return ONLY a valid JSON object (no markdown, no extra text) with exactly these fields:
{
  "matchScore": <integer 0-100>,
  "missingSkills": [<array of missing skill strings>],
  "suggestions": [<array of actionable improvement tip strings>]
}

RESUME:
${resumeText.slice(0, 4000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}
`;

  let content = '';

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });
    content = response.choices[0].message.content;
  } catch (apiError) {
    console.warn('⚠️  Groq API failed. Falling back to mock analysis.', apiError.message);
    return getMockAnalysis(resumeText, jobDescription);
  }

  try {
    const parsed = JSON.parse(content);
    return {
      matchScore: Math.min(100, Math.max(0, Number(parsed.matchScore) || 0)),
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
  } catch {
    throw new Error('Failed to parse AI response as JSON.');
  }
}

/** Realistic mock analysis when no API key is present */
function getMockAnalysis(resumeText, jobDescription) {
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  const skillKeywords = [
    'docker', 'kubernetes', 'graphql', 'typescript', 'aws', 'azure', 'gcp',
    'redis', 'postgresql', 'mongodb', 'react', 'vue', 'angular', 'node',
    'python', 'java', 'go', 'rust', 'ci/cd', 'terraform', 'microservices',
  ];

  const missingSkills = skillKeywords.filter(
    (sk) => jdLower.includes(sk) && !resumeLower.includes(sk)
  );

  const presentCount = skillKeywords.filter(
    (sk) => jdLower.includes(sk) && resumeLower.includes(sk)
  ).length;

  const totalRequired = skillKeywords.filter((sk) => jdLower.includes(sk)).length || 1;
  const matchScore = Math.round((presentCount / totalRequired) * 100);

  return {
    matchScore: Math.max(30, Math.min(95, matchScore)),
    missingSkills: missingSkills.slice(0, 5).length
      ? missingSkills.slice(0, 5)
      : ['Docker', 'CI/CD', 'Cloud Deployment'],
    suggestions: [
      'Add measurable achievements with specific metrics (e.g., "Reduced load time by 40%").',
      'Include deployment and DevOps experience if applicable.',
      'Tailor your professional summary to match the job title.',
      'List relevant certifications prominently near the top.',
      'Use action verbs to start each bullet point (Led, Built, Optimized).',
    ],
  };
}

module.exports = { analyzeResume };
