import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PhotoGallery from './PhotoGallery';
import { getPhotoAttachment } from '@/lib/db';
import type { ChallengeDoc } from '@/types';

vi.mock('@/lib/db', () => ({
  getPhotoAttachment: vi.fn(),
  addPhotoAttachment: vi.fn(),
}));

const mockDispatch = vi.fn();
let mockChallengeState: { challenge: ChallengeDoc | null } = {
  challenge: null,
};

vi.mock('@/context/ChallengeContext', () => ({
  useChallengeState: () => mockChallengeState,
  useChallengeDispatch: () => mockDispatch,
}));

const baseChallenge: ChallengeDoc = {
  _id: 'photo-test-chal',
  docType: 'challenge',
  name: 'Photo Test Challenge',
  startDate: '2026-11-01',
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
  days: {
    1: {
      completed: true,
      photoAttached: true,
      tasks: {
        diet: true,
        workout1: true,
        workout2: true,
        water: true,
        reading: true,
        progressPhoto: true,
      },
    },
    2: {
      completed: false,
      photoAttached: false,
      tasks: {
        diet: false,
        workout1: false,
        workout2: false,
        water: false,
        reading: false,
        progressPhoto: false,
      },
    },
  },
};

describe('PhotoGallery - Issue #29', () => {
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    revokeObjectURLSpy = vi.fn();
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      value: revokeObjectURLSpy,
      writable: true,
    });
  });

  it('fetches photo on initial mount for days with photoAttached=true', async () => {
    mockChallengeState = { challenge: { ...baseChallenge } };
    vi.mocked(getPhotoAttachment).mockResolvedValue('blob:http://localhost/photo-day-1');

    render(<PhotoGallery currentDay={2} />);

    await waitFor(() => {
      expect(getPhotoAttachment).toHaveBeenCalledTimes(1);
      expect(getPhotoAttachment).toHaveBeenCalledWith('photo-test-chal', 1);
      expect(screen.getByAltText('Progress for day 1')).toBeDefined();
    });
  });

  it('does NOT re-fetch photos or recreate blob URLs when non-photo habit state updates', async () => {
    mockChallengeState = { challenge: { ...baseChallenge } };
    vi.mocked(getPhotoAttachment).mockResolvedValue('blob:http://localhost/photo-day-1');

    const { rerender } = render(<PhotoGallery currentDay={2} />);

    await waitFor(() => {
      expect(getPhotoAttachment).toHaveBeenCalledTimes(1);
    });

    // Simulate updating habits (drinking water, workout, weight) on day 2 without attaching a photo
    const updatedChallenge: ChallengeDoc = {
      ...baseChallenge,
      days: {
        ...baseChallenge.days,
        2: {
          ...baseChallenge.days[2],
          waterConsumed: 64,
          tasks: {
            ...baseChallenge.days[2].tasks,
            water: false,
            diet: true,
          },
        },
      },
    };
    mockChallengeState = { challenge: updatedChallenge };

    // Re-render with updated challenge context
    rerender(<PhotoGallery currentDay={2} />);

    // getPhotoAttachment should STILL have been called only once from initial load
    expect(getPhotoAttachment).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();
  });

  it('fetches only the new photo when a photo is newly attached to another day', async () => {
    mockChallengeState = { challenge: { ...baseChallenge } };
    vi.mocked(getPhotoAttachment).mockImplementation(async (_id, day) => {
      return `blob:http://localhost/photo-day-${day}`;
    });

    const { rerender } = render(<PhotoGallery currentDay={2} />);

    await waitFor(() => {
      expect(getPhotoAttachment).toHaveBeenCalledWith('photo-test-chal', 1);
    });

    // Attach a photo to day 2
    const withDay2Photo: ChallengeDoc = {
      ...baseChallenge,
      days: {
        ...baseChallenge.days,
        2: {
          ...baseChallenge.days[2],
          photoAttached: true,
          tasks: {
            ...baseChallenge.days[2].tasks,
            progressPhoto: true,
          },
        },
      },
    };
    mockChallengeState = { challenge: withDay2Photo };

    rerender(<PhotoGallery currentDay={2} />);

    await waitFor(() => {
      // Called once for day 1, once for day 2 = total 2 times (day 1 was NOT re-fetched)
      expect(getPhotoAttachment).toHaveBeenCalledTimes(2);
      expect(getPhotoAttachment).toHaveBeenCalledWith('photo-test-chal', 2);
    });
  });

  it('revokes blob URLs upon component unmount', async () => {
    mockChallengeState = { challenge: { ...baseChallenge } };
    vi.mocked(getPhotoAttachment).mockResolvedValue('blob:http://localhost/photo-day-1');

    const { unmount } = render(<PhotoGallery currentDay={2} />);

    await waitFor(() => {
      expect(getPhotoAttachment).toHaveBeenCalledTimes(1);
    });

    unmount();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://localhost/photo-day-1');
  });
});
