import { describe, it, expect } from 'vitest';
import { deleteChallengeById } from '@/lib/db';

describe('deleteChallengeById', () => {
  it('returns false when database is unavailable in non-browser environment', async () => {
    const result = await deleteChallengeById('sample-challenge-id');
    expect(result).toBe(false);
  });
});
