import type { ChallengeDoc } from '@/types';

let dbInstance: PouchDB.Database<ChallengeDoc> | null = null;

/**
 * Dynamically imports PouchDB and initializes the database instance.
 * This ensures PouchDB is only ever loaded on the client-side.
 */
const getDb = async () => {
  // Return the existing instance if it's already created
  if (dbInstance) {
    return dbInstance;
  }
  // Check if we are in a browser environment
  if (typeof window !== 'undefined') {
    const PouchDB = (await import('pouchdb')).default;
    dbInstance = new PouchDB<ChallengeDoc>('grit-challenge');
    return dbInstance;
  }
  // Return null on the server-side to prevent errors during build
  return null;
};

/**
 * Starts a new 75 Hard challenge in the database.
 */
export const startNewChallenge = async (): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const newChallenge: ChallengeDoc = {
    _id: 'current_challenge',
    startDate: new Date().toISOString(),
    days: {},
  };

  try {
    const response = await db.put(newChallenge);
    newChallenge._rev = response.rev;
    return newChallenge;
  } catch (err) {
    if ((err as PouchDB.Core.Error).status === 409) {
      return db.get('current_challenge');
    }
    console.error('Error starting new challenge:', err);
    throw err;
  }
};

/**
 * Fetches the current challenge from the database.
 */
export const getCurrentChallenge = async (): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  try {
    return await db.get('current_challenge');
  } catch (err) {
    if ((err as PouchDB.Core.Error).status === 404) {
      return null; // No challenge started yet
    }
    console.error('Error fetching challenge:', err);
    throw err;
  }
};

/**
 * Updates the current challenge document in the database.
 */
export const updateChallenge = async (challenge: ChallengeDoc): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const response = await db.put(challenge);
  challenge._rev = response.rev;
  return challenge;
};
