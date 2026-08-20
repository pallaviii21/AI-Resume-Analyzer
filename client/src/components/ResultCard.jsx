import { useEffect, useState } from 'react';
import UpdatedResumePreview from './UpdatedResumePreview';
import { generateTailoredResume, downloadResumePdf } from '../services/api';

/* Score color & label helpers */
function scoreColor(score) {
  if (score >= 70) return '#10b981';
  if (score >= 45) return '#f59e0b';
  return '#ef4444';
}
function scoreClass(score) {
  if (score >= 70) return 'score-high';
  if (score >= 45) return 'score-mid';
  return 'score-low';
}
function scoreLabel(score) {
  if (score >= 80) return '🎉 Excellent match!';
  if (score >= 70) return '✅ Good match';
  if (score >= 50) return '⚡ Decent — work on the gaps';
  if (score >= 30) return '🔧 Needs improvement';
  return '📉 Low match — consider tailoring';
}

/* Animated ring gauge */
function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(0);
  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 120);
    return () => clearTimeout(timer);
  }, [score]);

  const dashOffset = circumference - (animated / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="score-ring-container">
      <svg className="score-ring-svg" viewBox="0 0 160 160">
        <circle className="score-ring-bg" cx="80" cy="80" r={radius} />
        <circle
          className="score-ring-fill"
          cx="80"
          cy="80"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="score-center">
        <span className={`score-number ${scoreClass(score)}`}>{score}%</span>
        <span className="score-label">MATCH</span>
      </div>
    </div>
  );
}

export default function ResultCard({ result, jobDescription, onAnalyzeAnother }) {
  const { matchScore, missingSkills = [], suggestions = [], fileName, rawText } = result;

  const [tailoring, setTailoring] = useState(false);
  const [tailorError, setTailorError] = useState(null);
  const [tailoredResumeData, setTailoredResumeData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadingDirect, setDownloadingDirect] = useState(false);

  const handleGenerateTailored = async () => {
    setTailoring(true);
    setTailorError(null);

    try {
      const data = await generateTailoredResume({
        resumeText: rawText || 'Candidate Resume Details',
        jobDescription: jobDescription || 'Target Job Description',
        missingSkills,
        suggestions,
      });

      setTailoredResumeData(data);
      setShowModal(true);
    } catch (err) {
      setTailorError(
        err?.response?.data?.error ||
          err.message ||
          'Failed to generate tailored resume. Please try again.'
      );
    } finally {
      setTailoring(false);
    }
  };

  const handleDirectDownload = async () => {
    setDownloadingDirect(true);
    setTailorError(null);

    try {
      let data = tailoredResumeData;
      if (!data) {
        data = await generateTailoredResume({
          resumeText: rawText || 'Candidate Resume Details',
          jobDescription: jobDescription || 'Target Job Description',
          missingSkills,
          suggestions,
        });
        setTailoredResumeData(data);
      }

      await downloadResumePdf(data, fileName?.replace(/\.[^/.]+$/, ''));
    } catch (err) {
      setTailorError(
        err?.response?.data?.error ||
          err.message ||
          'Failed to download PDF. Please try again.'
      );
    } finally {
      setDownloadingDirect(false);
    }
  };

  return (
    <div className="result-section fade-up">
      {/* Header bar */}
      <div className="result-header-bar">
        <div>
          <div className="result-status-pill">
            <span className="live-pulse green"></span>
            <span>Analysis Complete</span>
          </div>
          <h2>ATS Compatibility Report</h2>
          {fileName && <p className="result-filename">📄 {fileName}</p>}
        </div>
        <button
          className="btn btn-secondary btn-analyze-another"
          onClick={onAnalyzeAnother || (() => window.location.reload())}
        >
          ← Analyze Another Job
        </button>
      </div>


      {/* TAILORED RESUME GENERATION HERO BANNER */}
      <div className="tailor-banner card fade-up">
        <div className="tailor-banner-glow"></div>
        <div className="tailor-banner-content">
          <div className="tailor-badge">
            <span className="sparkle">✨</span> Next-Gen Feature
          </div>
          <div className="tailor-text">
            <h3>Generate Updated Resume with Missing Skills</h3>
            <p>
              {missingSkills.length > 0
                ? `Incorporate ${missingSkills.slice(0, 4).join(', ')}${
                    missingSkills.length > 4 ? ` and ${missingSkills.length - 4} more` : ''
                  } naturally into your summary, technical skills, and experience bullets to maximize your ATS match score.`
                : 'Optimize and refresh your resume for this role with tailored summary and quantifiable achievements.'}
            </p>
          </div>

          <div className="tailor-actions">
            <button
              className="btn btn-primary generate-cta-btn"
              onClick={handleGenerateTailored}
              disabled={tailoring || downloadingDirect}
            >
              {tailoring ? (
                <>
                  <span className="spinner-sm"></span> AI Rewriting Resume...
                </>
              ) : (
                <>✨ Preview Updated Resume</>
              )}
            </button>

            <button
              className="btn btn-download-quick"
              onClick={handleDirectDownload}
              disabled={tailoring || downloadingDirect}
            >
              {downloadingDirect ? (
                <>
                  <span className="spinner-sm"></span> Generating PDF...
                </>
              ) : (
                <>📥 Instant PDF</>
              )}
            </button>
          </div>
        </div>

        {tailorError && (
          <div className="error-banner" style={{ marginTop: '0.8rem' }}>
            <span>❌</span>
            <span>{tailorError}</span>
          </div>
        )}
      </div>

      {/* Three-column result layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.2rem', marginTop: '1.2rem' }}>
        {/* Score card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon purple">🎯</div>
            <div>
              <h3>Match Score</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="score-wrap">
              <ScoreRing score={matchScore} />
              <p className={`score-desc ${scoreClass(matchScore)}`}>
                {scoreLabel(matchScore)}
              </p>
            </div>
          </div>
        </div>

        {/* Right column — skills + suggestions stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Missing skills */}
          <div className="card" style={{ flex: '0 0 auto' }}>
            <div className="card-header">
              <div className="card-icon" style={{ background: 'rgba(239,68,68,0.15)' }}>
                🚫
              </div>
              <div>
                <h3>Missing Skills</h3>
              </div>
            </div>
            <div className="card-body">
              {missingSkills.length === 0 ? (
                <p style={{ color: 'var(--clr-success)', fontSize: '0.88rem' }}>
                  ✅ No major skill gaps detected!
                </p>
              ) : (
                <div className="skills-grid">
                  {missingSkills.map((skill, i) => (
                    <span key={i} className="skill-tag missing">
                      <span>⊘</span> {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="card" style={{ flex: '1 1 auto' }}>
            <div className="card-header">
              <div className="card-icon cyan">💡</div>
              <div>
                <h3>Improvement Tips</h3>
              </div>
            </div>
            <div className="card-body">
              {suggestions.length === 0 ? (
                <p style={{ fontSize: '0.88rem' }}>No suggestions at this time.</p>
              ) : (
                <ul className="suggestions-list">
                  {suggestions.map((tip, i) => (
                    <li key={i} className="suggestion-item">
                      <div className="suggestion-bullet">{i + 1}</div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Updated Resume Preview Modal */}
      {showModal && tailoredResumeData && (
        <UpdatedResumePreview
          resumeData={tailoredResumeData}
          onClose={() => setShowModal(false)}
          fileName={fileName}
        />
      )}
    </div>
  );
}

