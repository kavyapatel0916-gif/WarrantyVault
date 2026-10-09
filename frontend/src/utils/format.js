/**
 * Format a YYYY-MM-DD date string for display.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    return dateStr
  }
}

/**
 * Format a currency amount.
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format file size in human-readable form.
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/**
 * Return Tailwind badge class for warranty status.
 * @param {string} status
 * @returns {string}
 */
export function statusBadgeClass(status) {
  if (status === 'active') return 'badge-active'
  if (status === 'expiring') return 'badge-expiring'
  if (status === 'expired') return 'badge-expired'
  return 'badge bg-slate-100 text-slate-600'
}

/**
 * Capitalize a status string for display.
 */
export function statusLabel(status) {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

/**
 * Format days remaining as a human-readable string.
 */
export function formatDaysRemaining(days) {
  if (days === null || days === undefined) return '—'
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`
  if (days === 0) return 'Expires today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

/**
 * Get today as YYYY-MM-DD in UTC.
 */
export function todayString() {
  return new Date().toISOString().slice(0, 10)
}
