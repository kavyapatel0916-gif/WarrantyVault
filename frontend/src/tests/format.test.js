import { describe, test, expect } from 'vitest'
import { formatDate, formatCurrency, formatDaysRemaining, statusBadgeClass } from '../utils/format'

describe('formatDate', () => {
  test('formats valid date', () => {
    const result = formatDate('2025-06-15')
    expect(result).toContain('2025')
    expect(result).toContain('Jun')
  })

  test('returns dash for null', () => {
    expect(formatDate(null)).toBe('—')
  })

  test('returns dash for empty string', () => {
    expect(formatDate('')).toBe('—')
  })
})

describe('formatCurrency', () => {
  test('formats INR amount', () => {
    const result = formatCurrency(79999, 'INR')
    expect(result).toContain('79,999')
  })

  test('returns dash for null', () => {
    expect(formatCurrency(null)).toBe('—')
  })
})

describe('formatDaysRemaining', () => {
  test('0 days = expires today', () => {
    expect(formatDaysRemaining(0)).toBe('Expires today')
  })

  test('1 day remaining', () => {
    expect(formatDaysRemaining(1)).toBe('1 day left')
  })

  test('30 days remaining', () => {
    expect(formatDaysRemaining(30)).toBe('30 days left')
  })

  test('negative days = expired', () => {
    expect(formatDaysRemaining(-5)).toContain('Expired')
  })
})

describe('statusBadgeClass', () => {
  test('active returns active class', () => {
    expect(statusBadgeClass('active')).toBe('badge-active')
  })

  test('expiring returns expiring class', () => {
    expect(statusBadgeClass('expiring')).toBe('badge-expiring')
  })

  test('expired returns expired class', () => {
    expect(statusBadgeClass('expired')).toBe('badge-expired')
  })
})
