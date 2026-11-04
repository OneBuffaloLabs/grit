import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deleteChallengeById } from '../src/lib/db.ts';

describe('deleteChallengeById', () => {
  it('returns false when database is unavailable in non-browser environment', async () => {
    const result = await deleteChallengeById('sample-challenge-id');
    assert.equal(result, false);
  });
});
