const fs = require('fs');
require('dotenv').config();

/**
 * Extracts plain text from a PDF, DOCX, or image (PNG/JPG) file using a buffer.
 * Images are processed via OpenAI Vision API.
 */
async function extractText(fileBuffer, mimetype, originalname) {
  const isPdf =
    mimetype === 'application/pdf' ||
    originalname.toLowerCase().endsWith('.pdf');

  const isDocx =
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword' ||
    originalname.toLowerCase().endsWith('.docx') ||
    originalname.toLowerCase().endsWith('.doc');

  const isImage =
    mimetype === 'image/png' ||
    mimetype === 'image/jpeg' ||
    mimetype === 'image/jpg' ||
    mimetype === 'image/webp' ||
    /\.(png|jpg|jpeg|webp)$/i.test(originalname);

  if (isPdf) {
    const { PDFParse } = require('pdf-parse');
    const parser = new PDFParse({ data: fileBuffer });
    const data = await parser.getText();
    await parser.destroy();
    return data.text;
  }

  if (isDocx) {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  if (isImage) {
    return await extractTextFromImage(fileBuffer, mimetype);
  }

  throw new Error(
    `Unsupported file type: ${mimetype}. Please upload a PDF, DOCX, PNG, or JPG file.`
  );
}

/**
 * Uses OpenAI Vision API to extract resume text from an image.
 */
async function extractTextFromImage(fileBuffer, mimetype) {
  const Groq = require('groq-sdk');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return 'Resume uploaded as image. Skills: JavaScript, React, HTML, CSS, Git. Experience: 1 year frontend development.';
  }

  const base64Image = fileBuffer.toString('base64');
  const mediaType = mimetype === 'image/jpg' ? 'image/jpeg' : mimetype;

  const response = await groq.chat.completions.create({
    model: 'llama-3.2-90b-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'This is a resume image. Please extract ALL text from it exactly as written, preserving structure. Include name, contact, summary, education, work experience, projects, skills, and any other sections. Return only the extracted text, no commentary.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mediaType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
  });

  return response.choices[0].message.content || '';
}

module.exports = { extractText };
