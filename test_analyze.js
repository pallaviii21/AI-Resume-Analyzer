/**
 * Quick CLI test: send the resume image + JD to the backend and print results.
 * Usage: node test_analyze.js
 */
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

const RESUME_PATH = path.join(
  'C:/Users/palla/.gemini/antigravity/brain/d9568907-3be4-41d1-8059-0b35f5ddf6dd',
  'resume_ai_full_page_1773654862227.png'
);

const JOB_DESCRIPTION = `We are looking for a motivated and detail-oriented Frontend Developer Intern with 1-2 years of experience in modern web development. In this role, you will work on building and improving user interfaces for our web applications using Angular and React. You will collaborate with product managers, designers, and backend engineers to deliver responsive, user-friendly, and high-quality applications.

Primary Responsibilities:
- Develop and maintain responsive web applications using Angular (14+) and/or React.js.
- Write clean, maintainable, and efficient code using JavaScript/TypeScript, HTML5, and CSS3.
- Implement responsive UI designs using modern CSS frameworks such as Bootstrap and Tailwind CSS.
- Work with backend APIs to integrate frontend components with application services.
- Use AI code assistance tools (e.g., GitHub Copilot) to support development and improve efficiency.

You Should Have:
- 1-2 years of professional or internship experience in frontend development.
- Basic to intermediate experience with Angular (14+) and/or React.js.
- Working knowledge of HTML5, CSS3, JavaScript, and/or TypeScript.
- Experience with CSS frameworks such as Bootstrap or Tailwind CSS.
- Basic familiarity with frontend development tools like npm/yarn, Webpack.
- Basic understanding of Git and collaborative development workflows.`;

async function main() {
  console.log('📤 Sending resume image to backend...\n');

  const form = new FormData();
  form.append('resume', fs.createReadStream(RESUME_PATH), {
    filename: 'pallavi_kumari_resume.png',
    contentType: 'image/png',
  });
  form.append('jobDescription', JOB_DESCRIPTION);

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/resume/analyze',
    method: 'POST',
    headers: form.getHeaders(),
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            console.error('❌ Server error:', result.error);
          } else {
            console.log('✅ Analysis complete!\n');
            console.log(`🎯 Match Score: ${result.matchScore}%\n`);
            console.log('🚫 Missing Skills:');
            (result.missingSkills || []).forEach(s => console.log(`  • ${s}`));
            console.log('\n💡 Improvement Suggestions:');
            (result.suggestions || []).forEach((s, i) => console.log(`  ${i+1}. ${s}`));
          }
          resolve(result);
        } catch (e) {
          console.error('Parse error:', e.message, '\nRaw:', data);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    form.pipe(req);
  });
}

main().catch(console.error);
