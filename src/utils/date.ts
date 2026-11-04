/**
 * Local date utilities for Grit.
 * Uses strictly formatted local YYYY-MM-DD calendar strings
 * to avoid UTC/timezone shifting and Daylight Saving Time (DST) anomalies.
 */

/**
 * Returns a date formatted as YYYY-MM-DD in the local timezone.
 * Defaults to the current local date.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string (or legacy ISO string) into local year, month, and day components.
 */
export function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (match) {
    return {
      year: parseInt(match[1], 10),
      month: parseInt(match[2], 10),
      day: parseInt(match[3], 10),
    };
  }

  // Fallback for legacy timestamps
  const d = new Date(dateStr);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
}

/**
 * Calculates calendar days elapsed between two dates (ignoring time-of-day and DST).
 * If targetDateStr is omitted, it compares against today's local calendar date.
 * Returns 0 if targetDateStr is the same calendar day as startDateStr.
 */
export function calculateDaysElapsed(
  startDateStr: string,
  targetDateStr: string = getLocalDateString()
): number {
  const start = parseDateParts(startDateStr);
  const target = parseDateParts(targetDateStr);

  // UTC epoch calculation ensures whole calendar-day diff without DST or timezone offsets
  const utcStart = Date.UTC(start.year, start.month - 1, start.day);
  const utcTarget = Date.UTC(target.year, target.month - 1, target.day);

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.floor((utcTarget - utcStart) / MS_PER_DAY);
}

/**
 * Calculates the 1-based current challenge day based on calendar elapsed days.
 * - Same calendar day as startDate = Day 1
 * - Next calendar day (immediately at 12:00 AM local time) = Day 2
 * Clamped between 1 and duration (default: 75).
 */
export function calculateCurrentDay(
  startDateStr: string,
  duration: number = 75,
  currentDateStr: string = getLocalDateString()
): number {
  const elapsed = calculateDaysElapsed(startDateStr, currentDateStr);
  const currentDay = elapsed + 1;
  return Math.min(Math.max(1, currentDay), duration);
}

/**
 * Adds an integer number of calendar days to a YYYY-MM-DD string.
 */
export function addDaysToDate(startDateStr: string, daysToAdd: number): string {
  const { year, month, day } = parseDateParts(startDateStr);
  const utcDate = new Date(Date.UTC(year, month - 1, day + daysToAdd));
  const y = utcDate.getUTCFullYear();
  const m = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(utcDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates the end date of a challenge (Day 1 + duration - 1 days).
 */
export function calculateEndDate(startDateStr: string, duration: number = 75): string {
  return addDaysToDate(startDateStr, duration - 1);
}

/**
 * Formats a date string (YYYY-MM-DD or legacy ISO) to MM/DD/YYYY for input or display.
 */
export function formatToMMDDYYYY(dateStr: string): string {
  const { year, month, day } = parseDateParts(dateStr);
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${mm}/${dd}/${year}`;
}

/**
 * Converts a MM/DD/YYYY string into a canonical YYYY-MM-DD local string.
 */
export function parseMMDDYYYYToLocalDateString(formattedStr: string): string {
  const [month, day, year] = formattedStr.split('/').map(Number);
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Formats a date string for user-facing display.
 */
export function formatDisplayDate(dateStr: string): string {
  return formatToMMDDYYYY(dateStr);
}
