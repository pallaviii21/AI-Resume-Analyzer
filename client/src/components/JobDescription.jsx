import { useState, useEffect } from 'react';

const MAX_LEN = 3000;

const SAMPLE_JDS = [
  {
    label: 'Full Stack Engineer',
    icon: '💻',
    text: `We are looking for a Senior Full Stack Engineer.
Requirements:
- Strong experience with React, TypeScript, and Node.js.
- Hands-on experience with Docker, Kubernetes, and AWS cloud services.
- Familiarity with CI/CD automation pipelines, PostgreSQL, and Redis.
- Solid background in building scalable RESTful and GraphQL APIs.`,
  },
  {
    label: 'Cloud & DevOps Architect',
    icon: '☁️',
    text: `Looking for a Senior Cloud & DevOps Engineer.
Key Requirements:
- Deep expertise in AWS (EC2, S3, ECS, Lambda, IAM) or GCP.
- Production container orchestration with Kubernetes, Docker, and Helm.
- Infrastructure as Code using Terraform and automated CI/CD workflows with GitHub Actions.
- Monitoring & logging with Prometheus, Grafana, and ELK stack.`,
  },
  {
    label: 'Frontend Developer',
    icon: '🎨',
    text: `Seeking a skilled Frontend Software Engineer.
Requirements:
- 3+ years experience with React, Next.js, and TypeScript.
- Strong proficiency in modern CSS, Tailwind, state management, and performance optimization.
- Experience writing automated unit and integration tests (Jest, Playwright).
- Passion for crafting accessible, high-performance user interfaces.`,
  },
];

export default function JobDescription({ onAnalyze, loading, disabled, initialValue = '' }) {
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    if (initialValue) setText(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    if (text.trim().length >= 20) onAnalyze(text.trim());
  };

  const handleSampleClick = (sampleText) => {
    setText(sampleText);
  };

  return (
    <div>
      <div className="jd-header-row">
        <label className="textarea-label" htmlFor="job-desc-input">
          Target Job Description
        </label>
        <span className="char-count">
          {text.length} / {MAX_LEN} chars
        </span>
      </div>

      {/* Quick Fill Samples */}
      <div className="sample-presets-row">
        <span className="presets-label">Quick test presets:</span>
        <div className="preset-buttons">
          {SAMPLE_JDS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-btn"
              onClick={() => handleSampleClick(sample.text)}
              disabled={loading}
            >
              <span>{sample.icon}</span>
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      <textarea
        id="job-desc-input"
        placeholder="Paste target job description or click a preset above…&#10;&#10;e.g. We are looking for a Senior Engineer with experience in Docker, AWS, TypeScript..."
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
        disabled={loading}
      />

      <button
        id="analyze-btn"
        className="btn btn-primary btn-full analyze-action-btn"
        onClick={handleSubmit}
        disabled={disabled || loading || text.trim().length < 20}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Analyzing Resume with AI…
          </>
        ) : (
          <>
            <span>⚡</span>
            <span>Analyze Resume & Check Match</span>
          </>
        )}
      </button>
    </div>
  );
}
