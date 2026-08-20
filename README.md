# 📄 AI Resume Analyzer & Tailored PDF Generator

An AI-powered web application that analyzes resumes against target job descriptions, detects missing skills and keyword gaps, provides ATS compatibility scores, and automatically generates an **updated, tailored ATS-friendly resume available for instant PDF download**.

---

## ✨ Features

- **Multi-Format Resume Ingestion**: Upload resumes in PDF, DOCX, PNG, or JPG formats with text extraction.
- **AI-Powered Gap Analysis**: Leverages LLMs (via Groq SDK) to compare resumes against target job descriptions, computing an ATS match score, missing skills list, and actionable improvement recommendations.
- **1-Click Updated Resume Generation**: Seamlessly integrates missing competencies, target skills, and quantifiable impact bullets into an updated resume structure tailored to the JD.
- **Server-Side ATS-Compliant PDF Export**: Uses `PDFKit` to dynamically generate clean, printable, vector-based PDF resumes with custom margins, contact headers, categorized skills, experience highlights, and dividers.
- **Live Interactive ATS Paper Previewer**: Review the updated resume right in the browser with newly incorporated skills highlighted before downloading or copying plain text.
- **Modern Minimalist Light Interface**: Designed with an airy light aesthetic, frosted glassmorphism navbar, quick 1-click test presets, and responsive layout.
- **Database Persistence (Optional)**: Connects with **Supabase** for persisting analysis history.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** & **Vite**
- **Vanilla CSS** (Custom Design System with Frosted Glassmorphism)
- **Axios** (Multipart uploads & Blob streaming)
- **React Dropzone** (Drag-and-drop file ingestion)

### Backend
- **Node.js** & **Express**
- **Groq SDK** / **OpenAI** (LLM inference with multi-model fallback & mock modes)
- **PDFKit** (Dynamic ATS-compliant PDF document generation)
- **Supabase JS** (Database storage)
- **Multer**, **Mammoth**, and **unpdf** (File processing and document text parsing)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **Groq API Key**: (Optional for live LLM inference; includes realistic fallback simulation)
- **Supabase Account**: (Optional for storing analysis history)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/pallaviii21/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer

# Install backend dependencies
npm install

# Install frontend dependencies
npm install --prefix client
```

### 2. Environment Variables Setup

Create a `.env` file in the root directory:

```env
# Server Port
PORT=5000
CLIENT_URL=http://localhost:5173

# Groq API for LLM Analysis & Resume Tailoring
GROQ_API_KEY=your_groq_api_key_here

# Supabase Configuration (Optional)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Run Locally

Start both the Vite client and Express server concurrently:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/analyze` | Accepts `multipart/form-data` with `resume` file and `jobDescription` text. Returns match score, missing skills, and suggestions. |
| `POST` | `/api/resume/tailor` | Generates a structured updated resume incorporating missing skills into summary, skills, and experience sections. |
| `POST` | `/api/resume/download-pdf` | Generates and streams a formatted ATS-compliant `.pdf` binary attachment. |
| `GET` | `/api/resume/history` | Fetches previous resume analysis runs from Supabase. |
| `GET` | `/api/health` | Health check endpoint. |

---

## 📁 Project Architecture

```text
AI-Resume-Analyzer/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # UI Components
│   │   │   ├── JobDescription.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── UpdatedResumePreview.jsx
│   │   │   └── UploadResume.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx   # Main workspace dashboard
│   │   ├── services/
│   │   │   └── api.js          # API client helpers & PDF downloader
│   │   ├── App.jsx             # Shell with frosted glass navbar
│   │   └── index.css           # Global design system
│   └── package.json
├── controllers/
│   └── resumeController.js     # Analysis, tailor, and PDF controllers
├── services/
│   ├── aiService.js            # LLM prompts & resume rewrite logic
│   ├── parserService.js        # PDF, DOCX, and text extraction
│   └── pdfService.js           # PDFKit ATS document renderer
├── routes/
│   └── resumeRoutes.js         # Express routes
├── server.js                   # Application entry point
├── package.json
└── README.md
```

---

## 📜 License

This project is licensed under the ISC License.