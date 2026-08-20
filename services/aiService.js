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

  const candidateModels = [
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'groq/compound-mini',
    'llama-3.3-70b-versatile',
  ];

  let content = '';
  let apiSucceeded = false;

  for (const model of candidateModels) {
    try {
      const response = await groq.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });
      content = response.choices[0].message.content;
      apiSucceeded = true;
      break;
    } catch (err) {
      console.warn(`⚠️  Groq model ${model} attempt failed:`, err.message);
    }
  }

  if (!apiSucceeded || !content) {
    console.warn('⚠️  All Groq model attempts failed. Falling back to mock analysis.');
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

/**
 * Generate an updated resume incorporating missing skills and aligning with the job description.
 * Returns structured resume data along with a list of integrated skills.
 */
async function generateUpdatedResume(resumeText, jobDescription, missingSkills = [], suggestions = []) {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    console.warn('⚠️  No Groq key — returning mock updated resume.');
    return getMockUpdatedResume(resumeText, jobDescription, missingSkills);
  }

  const prompt = `
You are an expert ATS resume optimizer and executive career writer.

Your task is to rewrite and optimize the candidate's resume to align with the provided Job Description, seamlessly incorporating the identified missing skills into the relevant sections (Summary, Skills, and Experience bullet points / Projects) in an authentic, ATS-optimized manner.

MISSING SKILLS TO INCORPORATE:
${JSON.stringify(missingSkills)}

SUGGESTIONS:
${JSON.stringify(suggestions)}

RESUME ORIGINAL TEXT:
${resumeText.slice(0, 4500)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2500)}

Output ONLY a single valid JSON object (no markdown quotes, no extra conversational text) with this exact schema:
{
  "name": "<Candidate Full Name extracted or inferred from resume>",
  "contact": {
    "email": "<email if found, or placeholder>",
    "phone": "<phone if found, or placeholder>",
    "location": "<location if found, or placeholder>",
    "linkedin": "<linkedin if found, or empty string>",
    "github": "<github if found, or empty string>"
  },
  "summary": "<Compelling 2-3 sentence professional summary tailored to the target job description and highlighting key competencies including target skills>",
  "skills": {
    "technical": ["<languages and core technologies including relevant missing skills>"],
    "toolsAndCloud": ["<cloud, databases, frameworks, CI/CD, tools including relevant missing skills>"],
    "softSkills": ["<key leadership and domain skills>"]
  },
  "experience": [
    {
      "role": "<Job Title>",
      "company": "<Company Name>",
      "location": "<Location>",
      "period": "<Dates/Years>",
      "highlights": [
        "<Strong action-verb bullet point tailored with quantifiable results and incorporating relevant skills>"
      ]
    }
  ],
  "projects": [
    {
      "title": "<Project Title>",
      "technologies": "<Comma-separated tech stack used>",
      "highlights": [
        "<Project accomplishment bullet point showing practical application of skills>"
      ]
    }
  ],
  "education": [
    {
      "degree": "<Degree>",
      "institution": "<University / Institution>",
      "year": "<Graduation Year / Range>"
    }
  ],
  "certifications": ["<Relevant certification or course>"],
  "addedSkills": [<array of missing skill strings that were successfully integrated>],
  "changesSummary": "<1-2 sentences summarizing what was improved in this resume>"
}
`;

  const candidateModels = [
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'groq/compound-mini',
    'llama-3.3-70b-versatile',
  ];

  let content = '';
  let apiSucceeded = false;

  for (const model of candidateModels) {
    try {
      const response = await groq.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });
      content = response.choices[0].message.content;
      apiSucceeded = true;
      break;
    } catch (err) {
      console.warn(`⚠️  Groq model ${model} attempt failed for resume update:`, err.message);
    }
  }

  if (!apiSucceeded || !content) {
    console.warn('⚠️  All Groq model attempts failed. Falling back to mock updated resume.');
    return getMockUpdatedResume(resumeText, jobDescription, missingSkills);
  }

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return getMockUpdatedResume(resumeText, jobDescription, missingSkills);
  }
}

/** Mock updated resume generator */
function getMockUpdatedResume(resumeText, jobDescription, missingSkills = []) {
  const lines = resumeText.split('\n').map((l) => l.trim()).filter(Boolean);
  const potentialName = lines[0] && lines[0].length < 40 ? lines[0] : 'Alex Morgan';

  const defaultMissing = missingSkills.length > 0 ? missingSkills : ['Docker', 'TypeScript', 'AWS', 'CI/CD'];

  return {
    name: potentialName,
    contact: {
      email: 'alex.morgan@email.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexmorgan-dev',
      github: 'github.com/alexmorgandev',
    },
    summary: `Results-driven Software Engineer with proven expertise in building robust, high-performance web applications and distributed systems. Adept in modern full-stack development, cloud architecture, and containerized deployments leveraging ${defaultMissing.slice(0, 3).join(', ')}. Passionate about writing maintainable code, optimizing CI/CD workflows, and driving measurable impact.`,
    skills: {
      technical: [
        'JavaScript (ES6+)',
        'TypeScript',
        'Node.js',
        'React',
        'Python',
        'RESTful APIs',
        'GraphQL',
        ...defaultMissing.filter((s) => !['Docker', 'AWS', 'CI/CD'].includes(s)),
      ],
      toolsAndCloud: [
        'Docker',
        'Kubernetes',
        'AWS (EC2, S3, Lambda)',
        'PostgreSQL',
        'MongoDB',
        'Redis',
        'Git & GitHub Actions',
        'CI/CD Pipelines',
        ...defaultMissing.filter((s) => ['Docker', 'AWS', 'Kubernetes', 'CI/CD'].includes(s)),
      ],
      softSkills: [
        'Agile / Scrum Methodologies',
        'Cross-Functional Collaboration',
        'Technical Architecture & Code Reviews',
        'Problem Solving & Performance Tuning',
      ],
    },
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'Apex Cloud Solutions',
        location: 'San Francisco, CA',
        period: '2022 - Present',
        highlights: [
          `Architected and containerized scalable microservices using ${defaultMissing[0] || 'Docker'} and Node.js, reducing deployment rollback rates by 45%.`,
          `Streamlined continuous integration and delivery using modern CI/CD pipelines, accelerating release cycles from bi-weekly to daily deployments.`,
          `Engineered responsive, highly performant front-end interfaces in React & TypeScript, boosting user engagement and session duration by 28%.`,
          `Optimized database query performance across PostgreSQL and Redis caching layers, cutting median API response latency by 35%.`,
        ],
      },
      {
        role: 'Full Stack Developer',
        company: 'Nexus Digital Technologies',
        location: 'San Jose, CA',
        period: '2020 - 2022',
        highlights: [
          `Developed end-to-end RESTful APIs and modern web applications serving 100K+ monthly active users.`,
          `Integrated cloud storage and event-driven background processing utilizing AWS cloud infrastructure.`,
          `Collaborated with UI/UX designers and product managers in an Agile team to deliver customer-facing features on schedule.`,
        ],
      },
    ],
    projects: [
      {
        title: 'Cloud-Native Automated Workflow Hub',
        technologies: `${defaultMissing.join(', ')}, React, Node.js`,
        highlights: [
          `Built a scalable automation pipeline with real-time status monitoring, automated health checks, and containerized deployment with ${defaultMissing[0] || 'Docker'}.`,
        ],
      },
      {
        title: 'High-Throughput Analytics Dashboard',
        technologies: 'TypeScript, React, Node.js, Redis, PostgreSQL',
        highlights: [
          'Implemented real-time telemetry charting with WebSocket data feeds and optimized query caching.',
        ],
      },
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2016 - 2020',
      },
    ],
    certifications: [
      'AWS Certified Solutions Architect / Cloud Practitioner',
      'Certified Kubernetes Application Developer (CKAD) Prep',
    ],
    addedSkills: defaultMissing,
    changesSummary: `Incorporated missing skills (${defaultMissing.join(', ')}) into the Professional Summary, categorized Skills sections, and updated Experience & Project highlights with quantifiable achievements.`,
  };
}

module.exports = { analyzeResume, generateUpdatedResume };
