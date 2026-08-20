import { useState, useRef } from 'react';
import UploadResume from '../components/UploadResume';
import JobDescription from '../components/JobDescription';
import ResultCard from '../components/ResultCard';
import { analyzeResume } from '../services/api';

export default function Dashboard() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const workspaceRef = useRef(null);

  const handleScrollToWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileSelected = (file) => {
    setResumeFile(file);
    setError(null);
  };

  const handleAnalyze = async (jdText) => {
    if (!resumeFile) return;
    setJobDescription(jdText);
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeResume(resumeFile, jdText);
      setResult(data);
      handleScrollToWorkspace();
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

  const handleReset = () => {
    setResult(null);
    handleScrollToWorkspace();
  };

  return (
    <main>
      {/* ─── Hero Section (Minimalist Split Inspired by Reference) ─── */}
      <section className="hero-section container">
        <div className="hero-grid">
          
          {/* Left Hero Column */}
          <div className="hero-content">
            <div className="ai-badge">
              <span>✨</span>
              <span>AI Powered</span>
            </div>

            <h1 className="hero-title">Resume analyser</h1>
            <p className="hero-subtitle">See how your resume performs against any target role</p>

            <ul className="hero-features-list">
              <li className="hero-feature-item">
                <span className="hero-check">✓</span>
                <span>Get resume strength backed by AI insights</span>
              </li>
              <li className="hero-feature-item">
                <span className="hero-check">✓</span>
                <span>Find key improvement areas & missing skill gaps</span>
              </li>
              <li className="hero-feature-item">
                <span className="hero-check">✓</span>
                <span>Improve shortlisting chances with ATS readiness score</span>
              </li>
              <li className="hero-feature-item">
                <span className="hero-check">✓</span>
                <span>Generate updated tailored resume & export PDF</span>
              </li>
            </ul>

            <div className="hero-cta-group">
              <button className="btn-hero-upload" onClick={handleScrollToWorkspace}>
                <span>Upload CV</span>
                <span>→</span>
              </button>
              <span className="hero-formats-hint">File formats: pdf, docx | upto 10 mb</span>
            </div>
          </div>

          {/* Right Hero Visual Mockup */}
          <div className="hero-visual-container">
            <div className="mockup-cv-sheet">
              {/* Top Floating Badge: CV Strength */}
              <div className="floating-badge badge-top-right">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#92400e' }}>CV Strength</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#fef3c7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    High (88%)
                  </span>
                </div>
                <div className="strength-bar-bg">
                  <div className="strength-bar-fill"></div>
                </div>
              </div>

              {/* Skeleton CV Content */}
              <div className="mockup-skeleton-header">
                <div className="mockup-avatar"></div>
                <div className="mockup-lines">
                  <div className="mockup-line short"></div>
                  <div className="mockup-line med"></div>
                </div>
              </div>

              <div className="mockup-skeleton-body">
                <div className="mockup-line full"></div>
                <div className="mockup-line full"></div>
                <div className="mockup-line med"></div>
              </div>

              <div className="mockup-skeleton-body" style={{ marginTop: '0.8rem' }}>
                <div className="mockup-line short" style={{ background: '#e2e8f0' }}></div>
                <div className="mockup-line full"></div>
                <div className="mockup-line med"></div>
              </div>

              {/* Middle Right Floating Badge */}
              <div className="floating-badge badge-mid-right">
                <span>✓</span>
                <span>What's working</span>
              </div>

              {/* Bottom Left Floating Badge */}
              <div className="floating-badge badge-bottom-left">
                <span>⊘</span>
                <span>Improvement areas</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── "Here's how it works" Section ─── */}
      <section className="how-it-works-section container">
        <div className="section-heading-center">
          <h2>Here's how resume analyser works</h2>
        </div>

        <div className="how-it-works-grid">
          <div className="how-card">
            <div className="how-card-num">1</div>
            <h3>Upload your CV</h3>
            <p>Upload your most recent resume in PDF or DOCX format to begin your AI analysis.</p>
          </div>

          <div className="how-card">
            <div className="how-card-num">2</div>
            <h3>We analyse against JD</h3>
            <p>AI compares your resume across key parameters like keyword gaps, skills, and relevance.</p>
          </div>

          <div className="how-card">
            <div className="how-card-num">3</div>
            <h3>Get updated resume & PDF</h3>
            <p>View detailed insights and download a refreshed, tailored resume with missing skills added.</p>
          </div>
        </div>
      </section>

      {/* ─── Interactive Workspace Section ─── */}
      <section ref={workspaceRef} className="workspace-section container" id="workspace">
        <div className="workspace-card-main">
          
          <div className="workspace-header">
            <div className="workspace-header-title">
              <h2>{result ? 'Analysis & Tailored PDF Report' : 'Analyze Your Resume'}</h2>
              <p>{result ? 'Review your score and download your updated CV' : 'Provide your resume and job description to get started'}</p>
            </div>
            {result && (
              <button className="btn btn-secondary" onClick={handleReset} style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
                ← Analyze another job
              </button>
            )}
          </div>

          <div className="workspace-body">
            {!result ? (
              <div>
                <div className="workspace-grid-inputs">
                  {/* Upload Block */}
                  <div>
                    <div className="input-block-header">
                      <label>1. Upload Resume</label>
                      {resumeFile && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--clr-success)', fontWeight: 700 }}>
                          ✓ Loaded
                        </span>
                      )}
                    </div>
                    <UploadResume
                      onFileSelected={handleFileSelected}
                      selectedFile={resumeFile}
                    />
                  </div>

                  {/* Job Description Block */}
                  <div>
                    <JobDescription
                      onAnalyze={handleAnalyze}
                      loading={loading}
                      disabled={!resumeFile}
                      initialValue={jobDescription}
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-banner">
                    <span>❌</span>
                    <span>{error}</span>
                  </div>
                )}
              </div>
            ) : (
              <ResultCard
                result={result}
                jobDescription={jobDescription}
                onAnalyzeAnother={handleReset}
              />
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
