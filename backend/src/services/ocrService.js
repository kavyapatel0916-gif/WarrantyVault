'use strict';
const Tesseract = require('tesseract.js');
const path = require('path');

/**
 * Run Tesseract OCR on an image file and return raw text + parsed candidates.
 * Only works on raster images (JPEG, PNG, WEBP). PDF OCR is not supported in MVP.
 *
 * @param {string} filePath - absolute path to the image file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<{rawText: string, candidates: object, confidence: number}>}
 */
async function runOCR(filePath, mimeType) {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!supportedTypes.includes(mimeType)) {
    throw new Error(`OCR is not supported for file type: ${mimeType}. Only JPEG, PNG, and WEBP images are supported.`);
  }

  let result;
  try {
    result = await Tesseract.recognize(filePath, 'eng', {
      logger: () => {}, // Suppress progress logs
    });
  } catch (err) {
    throw new Error(`OCR processing failed: ${err.message}`);
  }

  const rawText = result.data.text || '';
  const confidence = result.data.confidence || 0;

  const candidates = parseCandidates(rawText);

  return { rawText, candidates, confidence };
}

/**
 * Parse OCR raw text into tentative field candidates.
 * These are SUGGESTIONS for user review, not ground truth.
 * All values are marked as uncertain.
 *
 * @param {string} text - raw OCR output
 * @returns {object} candidates with confidence notes
 */
function parseCandidates(text) {
  const candidates = {};

  // Attempt to find a date (common formats: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY)
  const datePatterns = [
    /(\d{4}[-\/]\d{2}[-\/]\d{2})/,     // YYYY-MM-DD or YYYY/MM/DD
    /(\d{2}[-\/]\d{2}[-\/]\d{4})/,     // DD-MM-YYYY or MM/DD/YYYY
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      candidates.dateHint = { value: match[1], uncertain: true };
      break;
    }
  }

  // Attempt to find a monetary amount (common: Rs., INR, ₹, $)
  const amountPatterns = [
    /(?:Rs\.?|INR|₹|\$)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+(?:\.\d{2}))\s*(?:Rs\.?|INR|₹|\$)?/i,
  ];
  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      const cleaned = match[1].replace(/,/g, '');
      const num = parseFloat(cleaned);
      if (!isNaN(num) && num > 0 && num < 10000000) {
        candidates.amountHint = { value: num, uncertain: true };
        break;
      }
    }
  }

  // Attempt merchant / store name (look for common patterns near top of receipt)
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 2);
  if (lines.length > 0) {
    // Take first non-empty line as possible merchant name (very tentative)
    candidates.merchantHint = { value: lines[0].substring(0, 80), uncertain: true };
  }

  // Try to find a product name - look for lines containing model-like strings
  const productLine = lines.find((l) => /model|item|product|description/i.test(l));
  if (productLine) {
    candidates.productHint = { value: productLine.substring(0, 120), uncertain: true };
  }

  return candidates;
}

module.exports = { runOCR, parseCandidates };
