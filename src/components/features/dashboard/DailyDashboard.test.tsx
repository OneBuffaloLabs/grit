import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DailyDashboard from '@/components/features/dashboard/DailyDashboard';
import type { ChallengeDoc } from '@/types';

vi.mock('@/lib/db', () => ({
  updateChallenge: vi.fn(),
}));

const mockDispatch = vi.fn();
let mockChallengeState: { challenge: ChallengeDoc | null; isLoading: boolean } = {
  challenge: null,
  isLoading: false,
};

vi.mock('@/context/ChallengeContext', () => ({
  useChallengeState: () => mockChallengeState,
  useChallengeDispatch: () => mockDispatch,
}));

const sampleChallenge: ChallengeDoc = {
  _id: 'test-chal-1',
  docType: 'challenge',
  name: '75 Hard Test',
  startDate: '2026-02-09',
  status: 'active',
  type: 'hard',
  duration: 75,
  rules: {
    workouts: 2,
    workoutDuration: 45,
    workoutDurations: [45, 45],
    outdoorWorkout: true,
    water: 128,
    reading: 10,
    readingType: 'non_fiction',
    dietRule: 'strict',
    alcoholRule: 'none',
    photoRule: 'daily',
    trackWeight: true,
    trackMeasurements: true,
    useDailyJournal: true,
  },
  days: {},
};

describe('DailyDashboard dynamic dates and countdown', () => {
  const onFinishChallenge = vi.fn();
  const onDaySelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockChallengeState = {
      challenge: sampleChallenge,
      isLoading: false,
    };
  });

  it('renders dynamic calendar date and days remaining for Day 7 (Feb 15th)', () => {
    // startDate: 2026-02-09 + 6 days = 2026-02-15 ("Feb 15th")
    render(
      <DailyDashboard
        onFinishChallenge={onFinishChallenge}
        onDaySelect={onDaySelect}
        selectedDay={7}
      />
    );

    expect(screen.getByText(/Tasks for Day 7/i)).toBeDefined();
    expect(screen.getByText(/Feb 15th/i)).toBeDefined();
    expect(screen.getByText(/68/i)).toBeDefined();
    expect(screen.getByText(/days left/i)).toBeDefined();
  });

  it('renders different calendar date and remaining days when selecting Day 1', () => {
    render(
      <DailyDashboard
        onFinishChallenge={onFinishChallenge}
        onDaySelect={onDaySelect}
        selectedDay={1}
      />
    );

    expect(screen.getByText(/Tasks for Day 1/i)).toBeDefined();
    expect(screen.getByText(/Feb 9th/i)).toBeDefined();
    expect(screen.getByText(/74/i)).toBeDefined();
    expect(screen.getByText(/days left/i)).toBeDefined();
  });

  it('renders "Final day" when the last day is selected', () => {
    render(
      <DailyDashboard
        onFinishChallenge={onFinishChallenge}
        onDaySelect={onDaySelect}
        selectedDay={75}
      />
    );

    expect(screen.getByText(/Tasks for Day 75/i)).toBeDefined();
    expect(screen.getByText(/Final day/i)).toBeDefined();
  });
});
