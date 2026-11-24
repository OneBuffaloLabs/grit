import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChallengeEditForm } from '@/components/ui/settings/ChallengeEditForm';
import { updateChallenge } from '@/lib/db';
import type { ChallengeDoc } from '@/types';

vi.mock('@/lib/db', () => ({
  updateChallenge: vi.fn(),
}));

const mockDispatch = vi.fn();
vi.mock('@/context/ChallengeContext', () => ({
  useChallengeDispatch: () => mockDispatch,
}));

const mockChallenge: ChallengeDoc = {
  _id: 'test-challenge-123',
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

describe('ChallengeEditForm', () => {
  const mockOnClose = vi.fn();
  const mockShowNotification = vi.fn();
  let reloadSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadSpy },
      writable: true,
    });
  });

  it('renders with the formatted start date', () => {
    render(
      <ChallengeEditForm
        challenge={mockChallenge}
        contextChallengeId="test-challenge-123"
        onClose={mockOnClose}
        showNotification={mockShowNotification}
      />
    );

    const input = screen.getByLabelText(/Challenge Start Date/i) as HTMLInputElement;
    expect(input.value).toBe('11/01/2026');
  });

  it('updates start date and dispatches reactive state without reloading the page when active in context', async () => {
    const updatedDoc: ChallengeDoc = {
      ...mockChallenge,
      startDate: '2026-11-04',
      _rev: '2-abc',
    };
    vi.mocked(updateChallenge).mockResolvedValueOnce(updatedDoc);

    render(
      <ChallengeEditForm
        challenge={mockChallenge}
        contextChallengeId="test-challenge-123"
        onClose={mockOnClose}
        showNotification={mockShowNotification}
      />
    );

    const input = screen.getByLabelText(/Challenge Start Date/i);
    fireEvent.change(input, { target: { value: '11/04/2026' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateChallenge).toHaveBeenCalledWith({
        ...mockChallenge,
        startDate: '2026-11-04',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_CHALLENGE',
        payload: updatedDoc,
      });
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your challenge start date has been updated.',
      });
      expect(mockOnClose).toHaveBeenCalled();
      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });

  it('does not dispatch to global context when editing an archived challenge different from context', async () => {
    const updatedDoc: ChallengeDoc = {
      ...mockChallenge,
      startDate: '2026-11-04',
      _rev: '2-abc',
    };
    vi.mocked(updateChallenge).mockResolvedValueOnce(updatedDoc);

    render(
      <ChallengeEditForm
        challenge={mockChallenge}
        contextChallengeId="other-challenge-456"
        onClose={mockOnClose}
        showNotification={mockShowNotification}
      />
    );

    const input = screen.getByLabelText(/Challenge Start Date/i);
    fireEvent.change(input, { target: { value: '11/04/2026' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateChallenge).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });
});
