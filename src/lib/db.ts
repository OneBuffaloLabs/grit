import type { ChallengeDoc } from '@/types';
import PouchDB from 'pouchdb';
import { v4 as uuidv4 } from 'uuid';

let dbInstance: PouchDB.Database<ChallengeDoc> | null = null;

/**
 * Dynamically initializes the PouchDB database instance.
 * This ensures PouchDB is only ever loaded on the client-side.
 */
const getDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }
  if (typeof window !== 'undefined') {
    // Dynamically import PouchDB and uuid only on the client
    const PouchDBConstructor = (await import('pouchdb')).default;
    await import('uuid');
    dbInstance = new PouchDBConstructor<ChallengeDoc>('grit-challenge');
    return dbInstance;
  }
  return null;
};

/**
 * Starts a new challenge with a unique ID.
 * @param type The type of challenge to start, e.g., '75 Hard'.
 * @returns The newly created challenge document.
 */
export const startNewChallenge = async (
  type: '75 Hard' | '75 Soft'
): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const newChallenge: ChallengeDoc = {
    _id: `challenge_${uuidv4()}`, // Use a UUID for a unique ID
    startDate: new Date().toISOString(),
    status: 'active',
    type: type,
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
 * Fetches all challenges from the database (active, failed, completed).
 * @returns An array of all challenge documents.
 */
export const getAllChallenges = async (): Promise<ChallengeDoc[]> => {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.allDocs({
      include_docs: true,
      startkey: 'challenge_',
      endkey: 'challenge_\ufff0',
    });
    const challenges = result.rows.map((row) => row.doc).filter((doc) => !!doc) as ChallengeDoc[];
    return challenges;
  } catch (err) {
    console.error('Error fetching all challenges:', err);
    return [];
  }
};

/**
 * Fetches a single challenge by its document ID.
 * @param id The _id of the challenge to fetch.
 * @returns The challenge document or null if not found.
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
 * @param challenge The challenge document with updated data.
 * @returns The updated challenge document with a new _rev.
 */
export const updateChallenge = async (challenge: ChallengeDoc): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const response = await db.put(challenge);
  challenge._rev = response.rev;
  return challenge;
};

/**
 * Adds a photo as an attachment to a specific challenge document.
 * @param doc The challenge document.
 * @param day The day number for the photo.
 * @param photo The photo file to attach.
 * @returns The updated challenge document.
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

  if (!latestDoc.days[day]) {
    latestDoc.days[day] = {
      completed: false,
      photoAttached: false,
      tasks: {} as any,
    };
  }

  latestDoc.days[day].photoAttached = true;
  latestDoc.days[day].tasks.progressPhoto = true;

  const finalResponse = await db.put(latestDoc);
  return { ...latestDoc, _rev: finalResponse.rev };
};

/**
 * Retrieves a photo attachment for a specific day from a specific challenge.
 * @param challengeId The _id of the challenge.
 * @param day The day number of the photo.
 * @returns A local object URL for the image or null if not found.
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
