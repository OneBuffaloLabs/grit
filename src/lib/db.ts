import type { ChallengeDoc, ChallengeType, ChallengeRules } from '@/types';
import PouchDB from 'pouchdb';
import { v4 as uuidv4 } from 'uuid';

let dbInstance: PouchDB.Database<ChallengeDoc> | null = null;

// Define a properly typed initial state for tasks
const initialTaskState: ChallengeDoc['days'][number]['tasks'] = {
  diet: false,
  workout1: false,
  workout2: false,
  water: false,
  reading: false,
  progressPhoto: false,
};

/**
 * Dynamically initializes the PouchDB database instance.
 */
const getDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }
  if (typeof window !== 'undefined') {
    const PouchDBConstructor = (await import('pouchdb')).default;
    await import('uuid');
    dbInstance = new PouchDBConstructor<ChallengeDoc>('grit-challenge');
    return dbInstance;
  }
  return null;
};

/**
 * Creates a new challenge with the specific ruleset.
 * Replaces the old "startNewChallenge".
 */
export const createChallenge = async (
  name: string,
  type: ChallengeType,
  rules: ChallengeRules,
  duration: number = 75
): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const newChallenge: ChallengeDoc = {
    _id: uuidv4(),
    docType: 'challenge',
    name,
    startDate: new Date().toISOString(),
    status: 'active',
    type,
    duration,
    rules,
    days: {},
  };

  try {
    const response = await db.put(newChallenge);
    newChallenge._rev = response.rev;
    return newChallenge;
  } catch (err) {
    console.error('Error starting new challenge:', err);
    throw err;
  }
};

/**
 * Helper to get the currently active challenge.
 */
export const getActiveChallenge = async (): Promise<ChallengeDoc | null> => {
  const challenges = await getAllChallenges();
  return challenges.find((doc) => doc.status === 'active') || null;
};

/**
 * Fetches all challenges from the database.
 */
export const getAllChallenges = async (): Promise<ChallengeDoc[]> => {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.allDocs({
      include_docs: true,
    });

    const challenges = result.rows
      .map((row) => row.doc)
      .filter((doc) => !!doc && doc.docType === 'challenge') as ChallengeDoc[];

    return challenges;
  } catch (err) {
    console.error('Error fetching all challenges:', err);
    return [];
  }
};

/**
 * Fetches a single challenge by its document ID.
 */
export const getChallengeById = async (id: string): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  try {
    return await db.get(id);
  } catch (err) {
    if ((err as PouchDB.Core.Error).status === 404) {
      return null;
    }
    console.error(`Error fetching challenge with id ${id}:`, err);
    throw err;
  }
};

/**
 * Updates an existing challenge document in the database.
 */
export const updateChallenge = async (challenge: ChallengeDoc): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const response = await db.put(challenge);
  challenge._rev = response.rev;
  return challenge;
};

/**
 * Adds a photo as an attachment.
 */
export const addPhotoAttachment = async (
  doc: ChallengeDoc,
  day: number,
  photo: File
): Promise<ChallengeDoc> => {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const rev = doc._rev;
  if (!rev) throw new Error('Document revision is missing');

  await db.putAttachment(doc._id, `day-${day}.jpg`, rev, photo, photo.type);
  const latestDoc = await db.get(doc._id);

  // Initialize day if missing
  if (!latestDoc.days[day]) {
    latestDoc.days[day] = {
      completed: false,
      photoAttached: false,
      tasks: { ...initialTaskState },
    };
  }

  latestDoc.days[day].photoAttached = true;
  latestDoc.days[day].tasks.progressPhoto = true;

  const finalResponse = await db.put(latestDoc);
  return { ...latestDoc, _rev: finalResponse.rev };
};

/**
 * Retrieves a photo attachment.
 */
export const getPhotoAttachment = async (
  challengeId: string,
  day: number
): Promise<string | null> => {
  const db = await getDb();
  if (!db) return null;

  try {
    const blob = (await db.getAttachment(challengeId, `day-${day}.jpg`)) as Blob;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

/**
 * DANGER: Deletes all challenges from the database.
 * Used for the "Reset App" functionality.
 */
export const deleteAllChallenges = async (): Promise<void> => {
  const db = await getDb();
  if (!db) return;

  try {
    const result = await db.allDocs({ include_docs: true });

    // Filter out rows that might be undefined
    // Map to an object that includes { _deleted: true }
    const deletedDocs = result.rows
      .filter((row) => row.doc)
      .map((row) => ({
        ...row.doc!,
        _deleted: true,
      }));

    if (deletedDocs.length > 0) {
      // Use PouchDB's specific type instead of 'any'
      await db.bulkDocs(deletedDocs as PouchDB.Core.PutDocument<ChallengeDoc>[]);
    }
  } catch (err) {
    console.error('Error deleting all challenges:', err);
    throw err;
  }
};
