import { useState } from 'react';
import UploadResume from '../components/UploadResume';
import JobDescription from '../components/JobDescription';
import ResultCard from '../components/ResultCard';
import { analyzeResume } from '../services/api';

export default function Dashboard() {
  const [step, setStep] = useState(1); // 1=upload, 2=describe, 3=results
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelected = (file) => {
    setResumeFile(file);
    setStep(2);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (jobDescription) => {
    if (!resumeFile) return;
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeResume(resumeFile, jobDescription);
      setResult(data);
      setStep(3);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err.message ||
          'Something went wrong. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="hero container">
        <div className="hero-badge">
          <span>⚡</span>
          <span>AI-Powered</span>
        </div>
        <h1>Analyze Your Resume<br />Against Any Job</h1>
        <p>
          Upload your resume, paste a job description, and get an instant AI analysis —
          match score, skill gaps, and actionable tips.
        </p>

        {/* Step pills */}
        <div className="steps-row">
          <div className={`step-pill ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>
            <span className="step-num">{step > 1 ? '✓' : '1'}</span>
            Upload Resume
          </div>
          <span className="step-arrow">›</span>
          <div className={`step-pill ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
            <span className="step-num">{step > 2 ? '✓' : '2'}</span>
            Job Description
          </div>
          <span className="step-arrow">›</span>
          <div className={`step-pill ${step === 3 ? 'done' : ''}`}>
            <span className="step-num">{step === 3 ? '✓' : '3'}</span>
            AI Analysis
          </div>
        </div>
      </section>

      {/* Main input area */}
      {!result && (
        <section className="container" style={{ paddingBottom: '3rem' }}>
          <div className="two-col">
            {/* Upload card */}
            <div className="card fade-up">
              <div className="card-header">
                <div className="card-icon purple">📄</div>
                <div>
                  <h3>Your Resume</h3>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.1rem' }}>PDF or DOCX</p>
                </div>
              </div>
              <div className="card-body">
                <UploadResume
                  onFileSelected={handleFileSelected}
                  selectedFile={resumeFile}
                />
              </div>
            </div>

            {/* Job description card */}
            <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-header">
                <div className="card-icon cyan">💼</div>
                <div>
                  <h3>Job Description</h3>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.1rem' }}>
                    Paste the full JD
                  </p>
                </div>
              </div>
              <div className="card-body">
                <JobDescription
                  onAnalyze={handleAnalyze}
                  loading={loading}
                  disabled={!resumeFile}
                />
                {!resumeFile && (
                  <p style={{ fontSize: '0.8rem', marginTop: '0.7rem', textAlign: 'center' }}>
                    ← Upload your resume first
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner" style={{ marginTop: '1.5rem' }}>
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}
        </section>
      )}

      {/* Results */}
      {result && (
        <section className="container" style={{ paddingBottom: '4rem' }}>
          <ResultCard result={result} />
        </section>
      )}
    </main>
  );
}
