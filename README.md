# 📄 AI Resume Analyzer

A full-stack web application designed to help users analyze their resumes against specific job descriptions using AI. It provides a detailed match score, identifies missing skills, and offers personalized tips for improvement.

## ✨ Features

- **Resume Upload**: Supports parsing resumes in PDF, DOCX, and image formats (PNG, JPG) using `multer`, `pdf-parse`, and `mammoth`.
- **Job Description Parsing**: Extracts key requirements and skills from a provided job description.
- **AI-Powered Analysis**: Integrates neatly with the **Groq API** (or OpenAI fallbacks) to process text and evaluate the compatibility between the resume and the job description.
- **Detailed Insights**: Returns a matched score, missing skills outline, and custom recommendations.
- **Cloud Database**: Optionally persists analysis results using **Supabase**.
- **Modern UI**: A responsive, fast React frontend built with Vite.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Axios
- React-Dropzone

**Backend:**
- Node.js & Express
- Groq SDK / OpenAI 
- Supabase JS
- Multer (File Handling)
- `pdf-parse` & `mammoth` (Document Parsing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- API Key from [Groq](https://console.groq.com/) or another AI provider
- API URL and Key from [Supabase](https://supabase.com/) (optional, for DB storage)

### Installation

1. Clone the repository and install dependencies concurrently:
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   # API Configuration
   PORT=5000
   CLIENT_URL=http://localhost:5173

   # Groq API for AI Analysis
   GROQ_API_KEY=your_groq_api_key_here

   # Supabase Configuration
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Run the Application locally:**
   Start both the Vite frontend and Express server concurrently:
   ```bash
   npm run dev
   ```
   - Client will be available at: `http://localhost:5173`
   - Server will be available at: `http://localhost:5000`

## 📁 Project Structure

```text
ai-resume-analyzer/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (ResultCard, JobDescription, etc.)
│   │   ├── services/       # API configuration
│   │   └── App.jsx
│   └── package.json
├── routes/                 # Express API routes definition
├── services/               # Backend logic (AI Integration, Parser)
├── server.js               # Express application entry point
├── package.json            # Contains concurrent dev scripts and root dependencies
└── .env.example            # Example environment configurations
```

## 📜 License
This project is licensed under the ISC License.