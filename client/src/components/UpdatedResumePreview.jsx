import { useState } from 'react';
import { downloadResumePdf } from '../services/api';

export default function UpdatedResumePreview({ resumeData, onClose, fileName }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'json'

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadResumePdf(resumeData, fileName?.replace(/\.[^/.]+$/, ''));
    } catch (err) {
      alert('Failed to download PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyText = () => {
    let plainText = `${resumeData.name || 'Candidate'}\n`;
    
    const contact = resumeData.contact || {};
    const contactLine = [contact.email, contact.phone, contact.location, contact.linkedin, contact.github]
      .filter(Boolean)
      .join(' | ');
    if (contactLine) plainText += `${contactLine}\n\n`;

    if (resumeData.summary) {
      plainText += `PROFESSIONAL SUMMARY\n${resumeData.summary}\n\n`;
    }

    const skills = resumeData.skills || {};
    plainText += `SKILLS\n`;
    if (skills.technical?.length) plainText += `• Technical Skills: ${skills.technical.join(', ')}\n`;
    if (skills.toolsAndCloud?.length) plainText += `• Tools & Cloud: ${skills.toolsAndCloud.join(', ')}\n`;
    if (skills.softSkills?.length) plainText += `• Core Competencies: ${skills.softSkills.join(', ')}\n`;
    plainText += `\n`;

    if (resumeData.experience?.length) {
      plainText += `PROFESSIONAL EXPERIENCE\n`;
      resumeData.experience.forEach((exp) => {
        plainText += `${exp.role || 'Role'} - ${exp.company || 'Company'} (${exp.period || ''})\n`;
        if (exp.location) plainText += `${exp.location}\n`;
        (exp.highlights || []).forEach((h) => {
          plainText += `  • ${h}\n`;
        });
        plainText += `\n`;
      });
    }

    if (resumeData.projects?.length) {
      plainText += `KEY PROJECTS\n`;
      resumeData.projects.forEach((proj) => {
        plainText += `${proj.title || 'Project'} [${proj.technologies || ''}]\n`;
        (proj.highlights || []).forEach((h) => {
          plainText += `  • ${h}\n`;
        });
        plainText += `\n`;
      });
    }

    if (resumeData.education?.length) {
      plainText += `EDUCATION\n`;
      resumeData.education.forEach((edu) => {
        plainText += `${edu.degree || ''} - ${edu.institution || ''} (${edu.year || ''})\n`;
      });
      plainText += `\n`;
    }

    if (resumeData.certifications?.length) {
      plainText += `CERTIFICATIONS\n`;
      resumeData.certifications.forEach((c) => {
        plainText += `• ${typeof c === 'string' ? c : c.name || c.title}\n`;
      });
    }

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const addedSkills = resumeData.addedSkills || [];
  const isSkillAdded = (skillName) => {
    return addedSkills.some(
      (s) => s.toLowerCase() === skillName.toLowerCase() || skillName.toLowerCase().includes(s.toLowerCase())
    );
  };

  return (
    <div className="tailored-modal-overlay fade-in">
      <div className="tailored-modal-content scale-in">
        
        {/* Modal Header */}
        <div className="tailored-header">
          <div className="tailored-header-info">
            <div className="badge-pulse">
              <span className="badge-dot"></span>
              <span>Updated Resume Ready</span>
            </div>
            <h2>Tailored Resume with Missing Skills</h2>
            <p>
              {resumeData.changesSummary ||
                'Missing skills have been seamlessly incorporated into your summary, skills, and experience sections.'}
            </p>
          </div>

          <button className="close-btn" onClick={onClose} aria-label="Close preview">
            ✕
          </button>
        </div>

        {/* Added Skills Highlights */}
        {addedSkills.length > 0 && (
          <div className="added-skills-banner">
            <span className="added-skills-label">⚡ Incorporated Skills:</span>
            <div className="added-skills-chips">
              {addedSkills.map((sk, idx) => (
                <span key={idx} className="added-skill-chip">
                  <span className="plus-icon">+</span> {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modal Top Actions */}
        <div className="modal-toolbar">
          <div className="toolbar-tabs">
            <button
              className={`toolbar-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              📄 ATS Document View
            </button>
            <button
              className={`toolbar-tab ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveTab('json')}
            >
              ⚙️ Raw Data View
            </button>
          </div>

          <div className="toolbar-actions">
            <button className="btn btn-secondary" onClick={handleCopyText}>
              {copied ? '✅ Copied to Clipboard!' : '📋 Copy Text'}
            </button>
            <button
              className="btn btn-primary download-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <span className="spinner-sm"></span> Generating PDF...
                </>
              ) : (
                <>📥 Download Updated PDF</>
              )}
            </button>
          </div>
        </div>

        {/* Resume Preview Body */}
        <div className="resume-preview-container">
          {activeTab === 'preview' ? (
            <div className="ats-resume-paper">
              {/* Name & Contact */}
              <div className="ats-resume-header">
                <h1 className="ats-name">{resumeData.name || 'Candidate Name'}</h1>
                {resumeData.contact && (
                  <div className="ats-contact-row">
                    {[
                      resumeData.contact.email,
                      resumeData.contact.phone,
                      resumeData.contact.location,
                      resumeData.contact.linkedin,
                      resumeData.contact.github,
                    ]
                      .filter(Boolean)
                      .map((info, i) => (
                        <span key={i} className="ats-contact-item">
                          {i > 0 && <span className="ats-separator">•</span>}
                          {info}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Professional Summary */}
              {resumeData.summary && (
                <div className="ats-section">
                  <h3 className="ats-section-title">PROFESSIONAL SUMMARY</h3>
                  <div className="ats-divider"></div>
                  <p className="ats-text">{resumeData.summary}</p>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills && (
                <div className="ats-section">
                  <h3 className="ats-section-title">SKILLS & COMPETENCIES</h3>
                  <div className="ats-divider"></div>
                  <div className="ats-skills-list">
                    {resumeData.skills.technical?.length > 0 && (
                      <div className="ats-skill-group">
                        <strong>Technical Skills: </strong>
                        {resumeData.skills.technical.map((sk, idx) => (
                          <span
                            key={idx}
                            className={`ats-skill-pill ${isSkillAdded(sk) ? 'highlight-added' : ''}`}
                          >
                            {sk}
                            {idx < resumeData.skills.technical.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                    {resumeData.skills.toolsAndCloud?.length > 0 && (
                      <div className="ats-skill-group">
                        <strong>Tools, Frameworks & Cloud: </strong>
                        {resumeData.skills.toolsAndCloud.map((sk, idx) => (
                          <span
                            key={idx}
                            className={`ats-skill-pill ${isSkillAdded(sk) ? 'highlight-added' : ''}`}
                          >
                            {sk}
                            {idx < resumeData.skills.toolsAndCloud.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                    {resumeData.skills.softSkills?.length > 0 && (
                      <div className="ats-skill-group">
                        <strong>Core Competencies: </strong>
                        <span>{resumeData.skills.softSkills.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience?.length > 0 && (
                <div className="ats-section">
                  <h3 className="ats-section-title">PROFESSIONAL EXPERIENCE</h3>
                  <div className="ats-divider"></div>
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="ats-item">
                      <div className="ats-item-header">
                        <div className="ats-role-company">
                          <span className="ats-role">{exp.role || exp.title}</span>
                          {exp.company && <span className="ats-company"> — {exp.company}</span>}
                        </div>
                        <span className="ats-period">{exp.period || exp.duration}</span>
                      </div>
                      {exp.location && <div className="ats-location">{exp.location}</div>}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="ats-bullets">
                          {exp.highlights.map((h, idx) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resumeData.projects?.length > 0 && (
                <div className="ats-section">
                  <h3 className="ats-section-title">KEY PROJECTS</h3>
                  <div className="ats-divider"></div>
                  {resumeData.projects.map((proj, i) => (
                    <div key={i} className="ats-item">
                      <div className="ats-item-header">
                        <span className="ats-role">
                          {proj.title || proj.name}
                          {proj.technologies && (
                            <span className="ats-tech"> ({proj.technologies})</span>
                          )}
                        </span>
                      </div>
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="ats-bullets">
                          {proj.highlights.map((h, idx) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {resumeData.education?.length > 0 && (
                <div className="ats-section">
                  <h3 className="ats-section-title">EDUCATION</h3>
                  <div className="ats-divider"></div>
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="ats-item-header" style={{ marginBottom: '0.3rem' }}>
                      <span className="ats-role">
                        {edu.degree} {edu.institution ? `— ${edu.institution}` : ''}
                      </span>
                      <span className="ats-period">{edu.year || edu.period}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {resumeData.certifications?.length > 0 && (
                <div className="ats-section">
                  <h3 className="ats-section-title">CERTIFICATIONS</h3>
                  <div className="ats-divider"></div>
                  <ul className="ats-bullets">
                    {resumeData.certifications.map((c, i) => (
                      <li key={i}>{typeof c === 'string' ? c : c.name || c.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="raw-json-view">
              <pre>{JSON.stringify(resumeData, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="tailored-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Back to Analysis
          </button>
          <button
            className="btn btn-primary download-btn"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Generating PDF...' : '📥 Download Updated Resume (PDF)'}
          </button>
        </div>

      </div>
    </div>
  );
}
