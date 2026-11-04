import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DangerZone } from '@/components/ui/settings/DangerZone';
import { deleteAllChallenges, updateChallenge } from '@/lib/db';
import type { ChallengeDoc } from '@/types';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/db', () => ({
  updateChallenge: vi.fn(),
  deleteAllChallenges: vi.fn(),
}));

const mockDispatch = vi.fn();
vi.mock('@/context/ChallengeContext', () => ({
  useChallengeDispatch: () => mockDispatch,
}));

const mockChallenge: ChallengeDoc = {
  _id: 'active-challenge-123',
  docType: 'challenge',
  name: '75 Hard Test',
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
  days: {},
};

describe('DangerZone', () => {
  const mockOnClose = vi.fn();
  let reloadSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });
  });

  describe('Global Settings (no active challenge)', () => {
    it('deletes all challenges, dispatches null challenge, closes modal, and routes to /app without reloading', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      vi.mocked(deleteAllChallenges).mockResolvedValue(undefined);

      render(<DangerZone onClose={mockOnClose} />);

      const deleteBtn = screen.getByRole('button', { name: /delete all data/i });
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        expect(deleteAllChallenges).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_CHALLENGE', payload: null });
        expect(mockOnClose).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/app');
        expect(reloadSpy).not.toHaveBeenCalled();
      });
    });

    it('does nothing when confirmation dialog is canceled', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<DangerZone onClose={mockOnClose} />);

      const deleteBtn = screen.getByRole('button', { name: /delete all data/i });
      fireEvent.click(deleteBtn);

      expect(deleteAllChallenges).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Challenge-Specific Settings', () => {
    it('marks challenge as failed and navigates to /app', async () => {
      vi.mocked(updateChallenge).mockResolvedValue({ ...mockChallenge, status: 'failed' });

      render(
        <DangerZone
          challenge={mockChallenge}
          contextChallengeId="active-challenge-123"
          onClose={mockOnClose}
        />
      );

      const failBtn = screen.getByRole('button', { name: /mark as failed/i });
      fireEvent.click(failBtn);

      // Confirm in FailModal
      const confirmFailBtn = screen.getByRole('button', { name: /confirm & start over/i });
      fireEvent.click(confirmFailBtn);

      await waitFor(() => {
        expect(updateChallenge).toHaveBeenCalledWith(
          expect.objectContaining({ _id: 'active-challenge-123', status: 'failed' })
        );
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_CHALLENGE', payload: null });
        expect(mockPush).toHaveBeenCalledWith('/app');
        expect(mockOnClose).toHaveBeenCalled();
        expect(reloadSpy).not.toHaveBeenCalled();
      });
    });
  });
});
