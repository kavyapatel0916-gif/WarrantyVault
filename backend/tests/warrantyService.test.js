'use strict';
const { addMonths, daysRemaining, getWarrantyStatus, computeWarranty } = require('../src/services/warrantyService');

describe('addMonths - calendar month arithmetic', () => {
  test('Jan 31 + 1 month = Feb 28 (2025, not leap year)', () => {
    expect(addMonths('2025-01-31', 1)).toBe('2025-02-28');
  });

  test('Jan 31 + 1 month = Feb 29 (2024, leap year)', () => {
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
  });

  test('Dec 31 + 1 month = Jan 31 next year', () => {
    expect(addMonths('2024-12-31', 1)).toBe('2025-01-31');
  });

  test('0 months = same date (expires on purchase day)', () => {
    expect(addMonths('2025-06-15', 0)).toBe('2025-06-15');
  });

  test('12 months = same day next year', () => {
    expect(addMonths('2024-03-15', 12)).toBe('2025-03-15');
  });

  test('24 months = same day two years later', () => {
    expect(addMonths('2024-06-01', 24)).toBe('2026-06-01');
  });

  test('Mar 31 + 1 month = Apr 30 (clamp)', () => {
    expect(addMonths('2025-03-31', 1)).toBe('2025-04-30');
  });

  test('throws on invalid date format', () => {
    expect(() => addMonths('not-a-date', 1)).toThrow();
  });

  test('throws on negative months', () => {
    expect(() => addMonths('2025-01-01', -1)).toThrow();
  });
});

describe('daysRemaining', () => {
  test('today is expiry day = 0 days remaining', () => {
    const today = '2025-06-15';
    expect(daysRemaining('2025-06-15', today)).toBe(0);
  });

  test('expiry is tomorrow = 1 day remaining', () => {
    expect(daysRemaining('2025-06-16', '2025-06-15')).toBe(1);
  });

  test('expired yesterday = -1 days remaining', () => {
    expect(daysRemaining('2025-06-14', '2025-06-15')).toBe(-1);
  });

  test('30 days remaining', () => {
    expect(daysRemaining('2025-07-15', '2025-06-15')).toBe(30);
  });

  test('31 days remaining', () => {
    expect(daysRemaining('2025-07-16', '2025-06-15')).toBe(31);
  });
});

describe('getWarrantyStatus', () => {
  test('expired: yesterday expiry', () => {
    expect(getWarrantyStatus('2025-06-14', '2025-06-15')).toBe('expired');
  });

  test('expiring: today is expiry day (0 days)', () => {
    expect(getWarrantyStatus('2025-06-15', '2025-06-15')).toBe('expiring');
  });

  test('expiring: 15 days remaining', () => {
    expect(getWarrantyStatus('2025-06-30', '2025-06-15')).toBe('expiring');
  });

  test('expiring: exactly 30 days remaining', () => {
    expect(getWarrantyStatus('2025-07-15', '2025-06-15')).toBe('expiring');
  });

  test('active: 31 days remaining', () => {
    expect(getWarrantyStatus('2025-07-16', '2025-06-15')).toBe('active');
  });
});

describe('computeWarranty - full calculation', () => {
  test('leap year handling', () => {
    const result = computeWarranty('2024-01-31', 1, '2024-02-29');
    expect(result.expiryDate).toBe('2024-02-29');
    expect(result.daysRemaining).toBe(0);
    expect(result.status).toBe('expiring');
  });

  test('reminder fires at exactly 30 days', () => {
    const result = computeWarranty('2025-01-01', 12, '2025-12-02');
    // expiry = 2026-01-01; days from 2025-12-02 = 30
    expect(result.expiryDate).toBe('2026-01-01');
    expect(result.daysRemaining).toBe(30);
    expect(result.reminderDays).toContain(30);
  });

  test('reminder fires at exactly 7 days', () => {
    const result = computeWarranty('2025-01-01', 12, '2025-12-25');
    expect(result.expiryDate).toBe('2026-01-01');
    expect(result.daysRemaining).toBe(7);
    expect(result.reminderDays).toContain(7);
  });

  test('no reminder at 29 days', () => {
    const result = computeWarranty('2025-01-01', 12, '2025-12-03');
    expect(result.reminderDays).toHaveLength(0);
  });
});
