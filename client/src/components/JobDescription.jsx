import { useState } from 'react';

const MAX_LEN = 3000;

export default function JobDescription({ onAnalyze, loading, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim().length >= 20) onAnalyze(text.trim());
  };

  return (
    <div>
      <label className="textarea-label" htmlFor="job-desc-input">
        Job Description
      </label>
      <textarea
        id="job-desc-input"
        placeholder="Paste the full job description here…&#10;&#10;e.g. We're looking for a Senior React Developer with experience in TypeScript, GraphQL, Docker and AWS..."
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
        disabled={loading}
      />
      <div className="char-count">
        {text.length} / {MAX_LEN}
      </div>

      <button
        id="analyze-btn"
        className="btn btn-primary btn-full"
        style={{ marginTop: '1rem' }}
        onClick={handleSubmit}
        disabled={disabled || loading || text.trim().length < 20}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Analyzing with AI…
          </>
        ) : (
          <>
            ✨ Analyze Resume
          </>
        )}
      </button>
    </div>
  );
}
