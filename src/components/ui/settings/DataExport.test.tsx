import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DataExport } from './DataExport';

// Mock getAllChallenges from db
vi.mock('@/lib/db', () => ({
  getAllChallenges: vi.fn(async () => [
    {
      _id: 'chal-1',
      docType: 'challenge',
      name: '75 Hard Test',
      startDate: '2026-02-01',
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
          journal: 'Felt amazing today!',
          weight: 180,
          waterConsumed: 128,
          tasks: {
            diet: true,
            workout1: true,
            workout2: true,
            water: true,
            reading: true,
            progressPhoto: true,
          },
        },
      },
    },
  ]),
}));

describe('DataExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders export buttons', () => {
    render(<DataExport />);
    expect(screen.getByText('Download JSON Backup')).toBeDefined();
    expect(screen.getByText('Download Markdown (.md)')).toBeDefined();
  });

  it('triggers JSON export on click', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<DataExport />);

    const jsonBtn = screen.getByText('Download JSON Backup');
    fireEvent.click(jsonBtn);

    await waitFor(() => {
      expect(clickSpy).toHaveBeenCalled();
    });
    clickSpy.mockRestore();
  });

  it('triggers Markdown export on click', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<DataExport />);

    const mdBtn = screen.getByText('Download Markdown (.md)');
    fireEvent.click(mdBtn);

    await waitFor(() => {
      expect(clickSpy).toHaveBeenCalled();
    });
    clickSpy.mockRestore();
  });
});
