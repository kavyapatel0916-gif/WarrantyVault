'use strict';

/**
 * Canonical warranty calculation helper.
 * All date arithmetic uses UTC calendar-day semantics.
 * Uses calendar-month addition with end-of-month clamping.
 * Never uses months * 30 days.
 */

/**
 * Add N calendar months to a YYYY-MM-DD date string with end-of-month clamping.
 * Examples:
 *   addMonths('2025-01-31', 1) => '2025-02-28'  (Feb has 28 days in 2025)
 *   addMonths('2024-01-31', 1) => '2024-02-29'  (leap year: Feb has 29 days)
 *   addMonths('2024-12-31', 1) => '2025-01-31'
 *   addMonths('2025-01-31', 0) => '2025-01-31'  (zero months: expires on purchase day)
 *
 * @param {string} dateStr - YYYY-MM-DD
 * @param {number} months - non-negative integer
 * @returns {string} YYYY-MM-DD
 */
function addMonths(dateStr, months) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  if (!Number.isInteger(months) || months < 0) {
    throw new Error(`Invalid months value: ${months}`);
  }

  const [year, month, day] = dateStr.split('-').map(Number);

  // Add months
  let newYear = year + Math.floor((month - 1 + months) / 12);
  let newMonth = ((month - 1 + months) % 12) + 1; // 1-12

  // Clamp day to last day of resulting month (end-of-month clamping)
  const daysInNewMonth = new Date(Date.UTC(newYear, newMonth, 0)).getUTCDate();
  const newDay = Math.min(day, daysInNewMonth);

  return `${String(newYear).padStart(4, '0')}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;
}

/**
 * Get today's UTC date as YYYY-MM-DD string.
 * @returns {string}
 */
function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Compare two YYYY-MM-DD strings lexicographically (safe for calendar dates).
 * Returns negative if a < b, 0 if equal, positive if a > b.
 */
function compareDates(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Calculate whole calendar days remaining from today (UTC) until expiryDate (inclusive).
 * Expiry day counts as covered (daysRemaining = 0 on expiry day, status = 'expiring').
 * Returns negative number if expired.
 *
 * @param {string} expiryDate - YYYY-MM-DD
 * @param {string} [referenceDate] - YYYY-MM-DD (defaults to todayUTC())
 * @returns {number}
 */
function daysRemaining(expiryDate, referenceDate) {
  const today = referenceDate || todayUTC();
  const expiryMs = Date.UTC(...expiryDate.split('-').map((v, i) => i === 1 ? Number(v) - 1 : Number(v)));
  const todayMs = Date.UTC(...today.split('-').map((v, i) => i === 1 ? Number(v) - 1 : Number(v)));
  return Math.round((expiryMs - todayMs) / (1000 * 60 * 60 * 24));
}

/**
 * Determine warranty status string.
 * - 'expired': expiryDate < today
 * - 'expiring': 0 <= daysRemaining <= 30 (inclusive)
 * - 'active': daysRemaining > 30
 *
 * @param {string} expiryDate - YYYY-MM-DD
 * @param {string} [referenceDate] - YYYY-MM-DD
 * @returns {'active'|'expiring'|'expired'}
 */
function getWarrantyStatus(expiryDate, referenceDate) {
  const days = daysRemaining(expiryDate, referenceDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  return 'active';
}

/**
 * Full warranty computation from purchase date and warranty months.
 *
 * @param {string} purchaseDate - YYYY-MM-DD
 * @param {number} warrantyMonths - integer >= 0
 * @param {string} [referenceDate] - YYYY-MM-DD (for testing)
 * @returns {{ expiryDate: string, daysRemaining: number, status: string, reminderDays: number[] }}
 */
function computeWarranty(purchaseDate, warrantyMonths, referenceDate) {
  const expiryDate = addMonths(purchaseDate, warrantyMonths);
  const days = daysRemaining(expiryDate, referenceDate);
  const status = getWarrantyStatus(expiryDate, referenceDate);

  // Reminder days: notify on exactly 30, 15, 7 days remaining
  const REMINDER_THRESHOLDS = [30, 15, 7];
  const activeReminders = REMINDER_THRESHOLDS.filter((d) => days === d);

  return {
    expiryDate,
    daysRemaining: days,
    status,
    reminderDays: activeReminders,
  };
}

module.exports = {
  addMonths,
  todayUTC,
  compareDates,
  daysRemaining,
  getWarrantyStatus,
  computeWarranty,
};
