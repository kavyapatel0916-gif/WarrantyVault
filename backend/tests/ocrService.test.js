'use strict';
const { parseCandidates } = require('../src/services/ocrService');

describe('OCR Candidate Parsing', () => {
  it('extracts merchant, date, amount, and product hint from receipt text', () => {
    const sampleText = `
      CROMA ELECTRONICS STORE
      Date: 2024-11-15
      Item: Apple MacBook Air M2
      Total Amount: ₹ 89,990.00
      Thank you for shopping with us!
    `;

    const candidates = parseCandidates(sampleText);
    expect(candidates.merchantHint).toBeDefined();
    expect(candidates.merchantHint.value).toContain('CROMA ELECTRONICS STORE');
    expect(candidates.merchantHint.uncertain).toBe(true);

    expect(candidates.dateHint).toBeDefined();
    expect(candidates.dateHint.value).toBe('2024-11-15');
    expect(candidates.dateHint.uncertain).toBe(true);

    expect(candidates.amountHint).toBeDefined();
    expect(candidates.amountHint.value).toBe(89990);
    expect(candidates.amountHint.uncertain).toBe(true);

    expect(candidates.productHint).toBeDefined();
    expect(candidates.productHint.value).toContain('MacBook Air');
    expect(candidates.productHint.uncertain).toBe(true);
  });

  it('handles empty or unrecognized receipt text gracefully', () => {
    const emptyText = '';
    const candidates = parseCandidates(emptyText);
    expect(candidates.merchantHint).toBeUndefined();
    expect(candidates.dateHint).toBeUndefined();
    expect(candidates.amountHint).toBeUndefined();
  });

  it('extracts slash formatted dates and Rs. currency symbols', () => {
    const text = `
      RELIANCE DIGITAL
      Purchase Date: 12/08/2024
      Model: Sony WH-1000XM5
      Paid: Rs. 24999.00
    `;
    const candidates = parseCandidates(text);
    expect(candidates.dateHint.value).toBe('12/08/2024');
    expect(candidates.amountHint.value).toBe(24999);
  });
});
