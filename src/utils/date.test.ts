import { describe, it, expect } from 'vitest';
import {
  getLocalDateString,
  parseDateParts,
  calculateDaysElapsed,
  calculateCurrentDay,
  addDaysToDate,
  calculateEndDate,
  formatToMMDDYYYY,
  parseMMDDYYYYToLocalDateString,
  formatDisplayDate,
  formatFriendlyDate,
  getChallengeDayDate,
  calculateDaysRemaining,
} from '@/utils/date';

describe('Date Utilities (Local YYYY-MM-DD)', () => {
  describe('getLocalDateString', () => {
    it('formats a provided Date object as YYYY-MM-DD in local time', () => {
      const fixedDate = new Date(2026, 10, 4); // Nov 4, 2026
      expect(getLocalDateString(fixedDate)).toBe('2026-11-04');
    });

    it('pads single-digit month and day with zeros', () => {
      const earlyDate = new Date(2026, 0, 5); // Jan 5, 2026
      expect(getLocalDateString(earlyDate)).toBe('2026-01-05');
    });
  });

  describe('parseDateParts', () => {
    it('parses YYYY-MM-DD strings accurately', () => {
      const { year, month, day } = parseDateParts('2026-11-04');
      expect(year).toBe(2026);
      expect(month).toBe(11);
      expect(day).toBe(4);
    });

    it('parses legacy ISO strings with timezone info accurately', () => {
      const { year, month, day } = parseDateParts('2026-03-15T00:00:00.000Z');
      expect(year).toBe(2026);
      expect(month).toBe(3);
      expect(day).toBe(15);
    });
  });

  describe('calculateDaysElapsed', () => {
    it('returns 0 for the same calendar day', () => {
      const elapsed = calculateDaysElapsed('2026-11-04', '2026-11-04');
      expect(elapsed).toBe(0);
    });

    it('returns 1 for the following day at 12:00 AM regardless of time', () => {
      const elapsed = calculateDaysElapsed('2026-11-04', '2026-11-05');
      expect(elapsed).toBe(1);
    });

    it('returns exact days elapsed across month and year boundaries', () => {
      const elapsed = calculateDaysElapsed('2025-12-30', '2026-01-02');
      expect(elapsed).toBe(3);
    });

    it('handles Daylight Saving Time (DST) spring-forward without altering day count', () => {
      // In 2026, US Spring DST transition occurs on March 8
      const elapsed = calculateDaysElapsed('2026-03-01', '2026-03-15');
      expect(elapsed).toBe(14);
    });

    it('handles Daylight Saving Time (DST) fall-back without altering day count', () => {
      // In 2026, US Fall DST transition occurs on November 1
      const elapsed = calculateDaysElapsed('2026-10-25', '2026-11-05');
      expect(elapsed).toBe(11);
    });
  });

  describe('calculateCurrentDay', () => {
    it('identifies Day 1 on the start date', () => {
      const currentDay = calculateCurrentDay('2026-11-04', 75, '2026-11-04');
      expect(currentDay).toBe(1);
    });

    it('correctly identifies Day 2 immediately at 12:00 AM local time on the next day', () => {
      const currentDay = calculateCurrentDay('2026-11-04', 75, '2026-11-05');
      expect(currentDay).toBe(2);
    });

    it('clamps to challenge duration when elapsed days exceed duration', () => {
      const currentDay = calculateCurrentDay('2026-01-01', 75, '2026-06-01');
      expect(currentDay).toBe(75);
    });

    it('never drops below Day 1 even if start date is in the future', () => {
      const currentDay = calculateCurrentDay('2026-11-10', 75, '2026-11-04');
      expect(currentDay).toBe(1);
    });
  });

  describe('addDaysToDate and calculateEndDate', () => {
    it('adds days accurately across month boundary', () => {
      const result = addDaysToDate('2026-10-30', 3);
      expect(result).toBe('2026-11-02');
    });

    it('calculates the 75-day challenge end date accurately (Day 1 + 74 days)', () => {
      const endDate = calculateEndDate('2026-01-01', 75);
      expect(endDate).toBe('2026-03-16');
    });
  });

  describe('Formatting and Parsing', () => {
    it('converts YYYY-MM-DD to MM/DD/YYYY display format without timezone shift', () => {
      expect(formatToMMDDYYYY('2026-11-04')).toBe('11/04/2026');
      expect(formatDisplayDate('2026-11-04')).toBe('11/04/2026');
    });

    it('converts MM/DD/YYYY input back to YYYY-MM-DD local string', () => {
      expect(parseMMDDYYYYToLocalDateString('11/04/2026')).toBe('2026-11-04');
      expect(parseMMDDYYYYToLocalDateString('01/09/2026')).toBe('2026-01-09');
    });
  });

  describe('formatFriendlyDate', () => {
    it('formats dates with correct ordinal suffixes', () => {
      expect(formatFriendlyDate('2026-02-15')).toBe('Feb 15th');
      expect(formatFriendlyDate('2026-01-01')).toBe('Jan 1st');
      expect(formatFriendlyDate('2026-03-02')).toBe('Mar 2nd');
      expect(formatFriendlyDate('2026-04-03')).toBe('Apr 3rd');
      expect(formatFriendlyDate('2026-05-04')).toBe('May 4th');
      expect(formatFriendlyDate('2026-06-11')).toBe('Jun 11th');
      expect(formatFriendlyDate('2026-07-12')).toBe('Jul 12th');
      expect(formatFriendlyDate('2026-08-13')).toBe('Aug 13th');
      expect(formatFriendlyDate('2026-09-21')).toBe('Sep 21st');
      expect(formatFriendlyDate('2026-10-22')).toBe('Oct 22nd');
      expect(formatFriendlyDate('2026-11-23')).toBe('Nov 23rd');
      expect(formatFriendlyDate('2026-12-31')).toBe('Dec 31st');
    });
  });

  describe('getChallengeDayDate', () => {
    it('returns startDate for Day 1', () => {
      expect(getChallengeDayDate('2026-02-09', 1)).toBe('2026-02-09');
    });

    it('calculates the exact calendar date for Day 7 (Feb 15th)', () => {
      const day7Date = getChallengeDayDate('2026-02-09', 7);
      expect(day7Date).toBe('2026-02-15');
      expect(formatFriendlyDate(day7Date)).toBe('Feb 15th');
    });

    it('calculates the date for Day 75', () => {
      expect(getChallengeDayDate('2026-01-01', 75)).toBe('2026-03-16');
    });
  });

  describe('calculateDaysRemaining', () => {
    it('returns 68 days left when today is Day 7 of 75', () => {
      // Start Feb 9, today Feb 15 (Day 7)
      const remaining = calculateDaysRemaining('2026-02-09', 75, '2026-02-15');
      expect(remaining).toBe(68);
    });

    it('returns 74 days left on Day 1', () => {
      const remaining = calculateDaysRemaining('2026-01-01', 75, '2026-01-01');
      expect(remaining).toBe(74);
    });

    it('returns 0 days left on the final day', () => {
      const remaining = calculateDaysRemaining('2026-01-01', 75, '2026-03-16');
      expect(remaining).toBe(0);
    });
  });
});
