const PDFDocument = require('pdfkit');

/**
 * Generate a clean, ATS-compliant PDF buffer from structured resume data.
 * @param {Object} resumeData
 * @returns {Promise<Buffer>}
 */
function createResumePdf(resumeData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 36, bottom: 36, left: 40, right: 40 },
        info: {
          Title: `${resumeData.name || 'Candidate'} - Tailored Resume`,
          Author: resumeData.name || 'AI Resume Analyzer',
          Subject: 'Tailored Resume with Updated Skills',
        },
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#1e293b'; // Slate 800
      const accentColor = '#4f46e5';  // Indigo 600
      const darkColor = '#0f172a';    // Slate 900
      const mutedColor = '#64748b';   // Slate 500

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const leftMargin = doc.page.margins.left;

      // Helper for Section Titles
      const renderSectionTitle = (title) => {
        doc.moveDown(0.6);
        const y = doc.y;
        doc
          .font('Helvetica-Bold')
          .fontSize(11)
          .fillColor(accentColor)
          .text(title.toUpperCase(), leftMargin, y, { characterSpacing: 1 });
        
        doc.moveDown(0.2);
        // Horizontal divider line
        doc
          .strokeColor('#cbd5e1')
          .lineWidth(0.75)
          .moveTo(leftMargin, doc.y)
          .lineTo(leftMargin + pageWidth, doc.y)
          .stroke();
        doc.moveDown(0.3);
      };

      // --- HEADER ---
      const name = (resumeData.name || 'Candidate Name').trim();
      doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor(darkColor)
        .text(name, { align: 'center' });

      // Contact Line
      const contact = resumeData.contact || {};
      const contactItems = [
        contact.email,
        contact.phone,
        contact.location,
        contact.linkedin,
        contact.github,
        contact.portfolio,
      ].filter(Boolean);

      if (contactItems.length > 0) {
        doc.moveDown(0.2);
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor(mutedColor)
          .text(contactItems.join('  •  '), { align: 'center' });
      }

      doc.moveDown(0.4);

      // --- PROFESSIONAL SUMMARY ---
      if (resumeData.summary) {
        renderSectionTitle('Professional Summary');
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor(primaryColor)
          .text(resumeData.summary, { align: 'justify', lineGap: 2 });
      }

      // --- SKILLS ---
      const skills = resumeData.skills || {};
      const hasSkills =
        (Array.isArray(skills.technical) && skills.technical.length > 0) ||
        (Array.isArray(skills.toolsAndCloud) && skills.toolsAndCloud.length > 0) ||
        (Array.isArray(skills.softSkills) && skills.softSkills.length > 0) ||
        (Array.isArray(skills) && skills.length > 0);

      if (hasSkills) {
        renderSectionTitle('Skills & Competencies');

        if (Array.isArray(skills)) {
          doc
            .font('Helvetica')
            .fontSize(9)
            .fillColor(primaryColor)
            .text(skills.join(', '), { lineGap: 2 });
        } else {
          if (skills.technical && skills.technical.length > 0) {
            doc.font('Helvetica-Bold').fontSize(9).fillColor(darkColor).text('Technical Skills: ', { continued: true });
            doc.font('Helvetica').fillColor(primaryColor).text(skills.technical.join(', '));
          }
          if (skills.toolsAndCloud && skills.toolsAndCloud.length > 0) {
            doc.font('Helvetica-Bold').fontSize(9).fillColor(darkColor).text('Tools, Frameworks & Cloud: ', { continued: true });
            doc.font('Helvetica').fillColor(primaryColor).text(skills.toolsAndCloud.join(', '));
          }
          if (skills.softSkills && skills.softSkills.length > 0) {
            doc.font('Helvetica-Bold').fontSize(9).fillColor(darkColor).text('Core Competencies: ', { continued: true });
            doc.font('Helvetica').fillColor(primaryColor).text(skills.softSkills.join(', '));
          }
        }
      }

      // --- EXPERIENCE ---
      if (Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
        renderSectionTitle('Professional Experience');

        resumeData.experience.forEach((exp, idx) => {
          if (idx > 0) doc.moveDown(0.3);

          const role = exp.role || exp.title || 'Role';
          const company = exp.company || '';
          const location = exp.location || '';
          const period = exp.period || exp.duration || exp.dates || '';

          // Role and Period
          const roleCompanyText = company ? `${role} — ${company}` : role;
          const currentY = doc.y;

          doc
            .font('Helvetica-Bold')
            .fontSize(9.5)
            .fillColor(darkColor)
            .text(roleCompanyText, leftMargin, currentY, { width: pageWidth * 0.7 });

          if (period) {
            doc
              .font('Helvetica')
              .fontSize(8.5)
              .fillColor(mutedColor)
              .text(period, leftMargin + pageWidth * 0.7, currentY, {
                width: pageWidth * 0.3,
                align: 'right',
              });
          }

          if (location) {
            doc
              .font('Helvetica-Oblique')
              .fontSize(8.5)
              .fillColor(mutedColor)
              .text(location);
          }

          // Bullet highlights
          const highlights = Array.isArray(exp.highlights)
            ? exp.highlights
            : Array.isArray(exp.responsibilities)
            ? exp.responsibilities
            : [];

          if (highlights.length > 0) {
            doc.moveDown(0.15);
            highlights.forEach((bullet) => {
              doc
                .font('Helvetica')
                .fontSize(9)
                .fillColor(primaryColor)
                .text(`•  ${bullet}`, leftMargin + 8, doc.y, {
                  width: pageWidth - 8,
                  lineGap: 1.5,
                });
            });
          }
        });
      }

      // --- PROJECTS ---
      if (Array.isArray(resumeData.projects) && resumeData.projects.length > 0) {
        renderSectionTitle('Key Projects');

        resumeData.projects.forEach((proj, idx) => {
          if (idx > 0) doc.moveDown(0.25);

          const title = proj.title || proj.name || 'Project';
          const technologies = proj.technologies ? ` (${proj.technologies})` : '';
          const currentY = doc.y;

          doc
            .font('Helvetica-Bold')
            .fontSize(9.5)
            .fillColor(darkColor)
            .text(`${title}${technologies}`, leftMargin, currentY, { width: pageWidth });

          const highlights = Array.isArray(proj.highlights)
            ? proj.highlights
            : proj.description
            ? [proj.description]
            : [];

          highlights.forEach((bullet) => {
            doc
              .font('Helvetica')
              .fontSize(9)
              .fillColor(primaryColor)
              .text(`•  ${bullet}`, leftMargin + 8, doc.y, {
                width: pageWidth - 8,
                lineGap: 1.5,
              });
          });
        });
      }

      // --- EDUCATION ---
      if (Array.isArray(resumeData.education) && resumeData.education.length > 0) {
        renderSectionTitle('Education');

        resumeData.education.forEach((edu) => {
          const degree = edu.degree || edu.title || '';
          const institution = edu.institution || edu.school || edu.university || '';
          const year = edu.year || edu.dates || edu.period || '';
          const details = [degree, institution].filter(Boolean).join(' — ');

          const currentY = doc.y;
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor(darkColor)
            .text(details, leftMargin, currentY, { width: pageWidth * 0.75 });

          if (year) {
            doc
              .font('Helvetica')
              .fontSize(8.5)
              .fillColor(mutedColor)
              .text(year, leftMargin + pageWidth * 0.75, currentY, {
                width: pageWidth * 0.25,
                align: 'right',
              });
          }
        });
      }

      // --- CERTIFICATIONS ---
      if (Array.isArray(resumeData.certifications) && resumeData.certifications.length > 0) {
        renderSectionTitle('Certifications');
        resumeData.certifications.forEach((cert) => {
          doc
            .font('Helvetica')
            .fontSize(9)
            .fillColor(primaryColor)
            .text(`•  ${typeof cert === 'string' ? cert : cert.name || cert.title}`, leftMargin + 8, doc.y, {
              width: pageWidth - 8,
              lineGap: 1,
            });
        });
      }

      // End PDF
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { createResumePdf };
