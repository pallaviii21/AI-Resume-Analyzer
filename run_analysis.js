require('dotenv').config();
const { analyzeResume } = require('./services/aiService');

const resumeText = `
PALLAVI KUMARI
Summary: Self-motivated and detail-oriented Web Developer skilled in building scalable, responsive, and user-friendly applications using the MERN stack, TailwindCSS, and modern JavaScript libraries. Experienced in open-source contributions and hackathon participation, with a strong foundation in clean UI/UX design and problem-solving.
Education: Central University of Haryana (B.Tech in Computer Science & Engineering) Aug 2023 - July 2027
Experience:
- Labmentix (Full-Stack Developer Intern) May 2025 - July 2025: React.js frontends, Node.js/Express, MongoDB. Enhanced UI/UX using TailwindCSS.
- GirlScript Summer of Code (Open-Source Contributor) Sep 2024 - Nov 2024: Improved responsiveness, revamped UI elements, Git and GitHub.
- Smart India Hackathon (Frontend Developer) March 2024.
Projects: Signify - Document Signing Platform (React, Node.js, Express, MongoDB, TailwindCSS). Built a secure, browser-based PDF document signing platform. Implemented drag-and-drop signatures.
Technical Skills:
Languages: C/C++, SQL, JavaScript, HTML/CSS, Python
Frameworks: Node.js, Express.js, Flask, Bootstrap, Next.JS
Libraries: React, TailwindCSS
Tools: Git, GitHub, VS Code, Postman
Databases: MongoDB, PostgreSQL
`;

const jdText = `
Frontend Developer Intern 
We are looking for a motivated and detail-oriented Frontend Developer Intern with 1–2 years of experience in modern web development. In this role, you will work on building and improving user interfaces for our web applications using Angular and React. You will collaborate with product managers, designers, and backend engineers to deliver responsive, user-friendly, and high-quality applications. This role is ideal for someone who is eager to learn, grow their frontend expertise, and adopt modern development practices, including the use of AI code assistance tools such as GitHub Copilot to improve productivity and code quality.

Work from Office (Hybrid) Location - Newtown Rajarhat, Kolkata Working Days - Monday to Friday Office Timings - 9:30AM to 6PM Duration - 6 Months Stipend - Rs. 15,000/- Per Month Laptop will be provided by the company

Primary Responsibilities
Develop and maintain responsive web applications using Angular (14+) and/or React.js.
Collaborate with cross-functional teams to implement new features and improve existing functionality.
Write clean, maintainable, and efficient code using JavaScript/TypeScript, HTML5, and CSS3.
Implement responsive UI designs using modern CSS frameworks such as Bootstrap and Tailwind CSS.
Work with backend APIs to integrate frontend components with application services.
Assist in troubleshooting, debugging, and resolving frontend issues.
Follow established coding standards and contribute to maintaining code quality.
Use AI code assistance tools (e.g., GitHub Copilot) to support development and improve efficiency.
Stay updated with the latest frontend technologies and best practices.

You Should Have
Experience: 1–2 years of professional or internship experience in frontend development.
Frameworks: Basic to intermediate experience with Angular (14+) and/or React.js. Familiarity with REST APIs.
Languages: Working knowledge of HTML5, CSS3, JavaScript, and/or TypeScript.
Styling: Experience with CSS frameworks such as Bootstrap or Tailwind CSS.
Tooling: Basic familiarity with frontend development tools like npm/yarn, Webpack, or similar build tools.
Version Control: Basic understanding of Git and collaborative development workflows.
Problem-Solving: Good analytical and debugging skills with attention to detail.
Collaboration: Ability to work effectively within a team and communicate clearly.
Location: Must be able to work from our Kolkata office. This is a mandatory on-site role.

Education
B.E/B.Tech/BCA/B.Sc/Masters in Computer Science, IT, or related field
Strong academic foundation in programming and algorithms
`;

async function main() {
  try {
    const result = await analyzeResume(resumeText, jdText);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(err);
  }
}
main();
