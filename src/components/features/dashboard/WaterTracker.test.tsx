import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WaterTracker from './WaterTracker';

describe('WaterTracker', () => {
  it('displays current water consumed vs total goal and progress bar', () => {
    render(
      <WaterTracker
        currentWater={64}
        waterGoal={128}
        isCompleted={false}
        onUpdateWater={vi.fn()}
      />
    );

    expect(screen.getByText('Water Intake')).toBeDefined();
    expect(screen.getByText('64')).toBeDefined();
    expect(screen.getByText('/ 128 oz')).toBeDefined();

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('64');
    expect(progressBar.getAttribute('aria-valuemax')).toBe('128');
  });

  it('renders quick-add buttons and triggers onUpdateWater with incremented value', () => {
    const handleUpdate = vi.fn();
    render(
      <WaterTracker
        currentWater={32}
        waterGoal={128}
        isCompleted={false}
        onUpdateWater={handleUpdate}
      />
    );

    const add16Btn = screen.getByRole('button', { name: /\+16 oz/i });
    fireEvent.click(add16Btn);
    expect(handleUpdate).toHaveBeenCalledWith(48);

    const add32Btn = screen.getByRole('button', { name: /\+32 oz/i });
    fireEvent.click(add32Btn);
    expect(handleUpdate).toHaveBeenCalledWith(64);
  });

  it('dynamically adjusts quick-add buttons when near the goal to prevent overshooting', () => {
    const handleUpdate = vi.fn();
    // 120 oz consumed out of 128 -> only 8 oz remaining
    render(
      <WaterTracker
        currentWater={120}
        waterGoal={128}
        isCompleted={false}
        onUpdateWater={handleUpdate}
      />
    );

    // Only +8 oz should be rendered (16, 24, 32 clamp to 8 and are deduplicated)
    const add8Btn = screen.getByRole('button', { name: /\+8 oz/i });
    expect(add8Btn).toBeDefined();
    expect(screen.queryByRole('button', { name: /\+16 oz/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /\+32 oz/i })).toBeNull();

    fireEvent.click(add8Btn);
    expect(handleUpdate).toHaveBeenCalledWith(128);
  });

  it('shows Goal Met badge and completion text when goal is reached', () => {
    render(
      <WaterTracker
        currentWater={128}
        waterGoal={128}
        isCompleted={true}
        onUpdateWater={vi.fn()}
      />
    );

    expect(screen.getByText('Goal Met')).toBeDefined();
    expect(screen.getByText('Daily goal accomplished!')).toBeDefined();
    expect(screen.queryByRole('button', { name: /\+8 oz/i })).toBeNull();
  });

  it('allows decreasing and resetting water intake', () => {
    const handleUpdate = vi.fn();
    render(
      <WaterTracker
        currentWater={40}
        waterGoal={128}
        isCompleted={false}
        onUpdateWater={handleUpdate}
      />
    );

    const decreaseBtn = screen.getByRole('button', { name: /-8 oz/i });
    fireEvent.click(decreaseBtn);
    expect(handleUpdate).toHaveBeenCalledWith(32);

    const resetBtn = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetBtn);
    expect(handleUpdate).toHaveBeenCalledWith(0);
  });

  it('disables quick-add buttons when disabled prop is true', () => {
    render(
      <WaterTracker
        currentWater={32}
        waterGoal={128}
        isCompleted={false}
        disabled={true}
        onUpdateWater={vi.fn()}
      />
    );

    const add16Btn = screen.getByRole('button', { name: /\+16 oz/i });
    expect(add16Btn.hasAttribute('disabled')).toBe(true);
    expect(screen.queryByRole('button', { name: /reset/i })).toBeNull();
  });
});
