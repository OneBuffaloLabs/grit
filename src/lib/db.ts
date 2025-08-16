import type { ChallengeDoc } from '@/types';

let dbInstance: PouchDB.Database<ChallengeDoc> | null = null;

const getDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }
  if (typeof window !== 'undefined') {
    const PouchDB = (await import('pouchdb')).default;
    dbInstance = new PouchDB<ChallengeDoc>('grit-challenge');
    return dbInstance;
  }
  return null;
};

// --- (Existing functions: startNewChallenge, getCurrentChallenge, updateChallenge) ---
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

export const getCurrentChallenge = async (): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  try {
    return await db.get('current_challenge');
  } catch (err) {
    if ((err as PouchDB.Core.Error).status === 404) {
      return null;
    }
    console.error('Error fetching challenge:', err);
    throw err;
  }
};

export const updateChallenge = async (challenge: ChallengeDoc): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const response = await db.put(challenge);
  challenge._rev = response.rev;
  return challenge;
};

/**
 * Adds a photo as an attachment and updates the document to reflect the upload.
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

  // First, add the attachment to the document
  const attachmentResponse = await db.putAttachment(
    doc._id,
    `day-${day}.jpg`,
    rev,
    photo,
    photo.type
  );

  // Now, fetch the latest version of the doc to update its properties
  const latestDoc = await db.get(doc._id);

  // Ensure the day object exists
  if (!latestDoc.days[day]) {
    latestDoc.days[day] = {
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
    };
  }

  // **FIX:** Mark photo as attached AND check off the corresponding task
  latestDoc.days[day].photoAttached = true;
  latestDoc.days[day].tasks.progressPhoto = true;

  // Save the updated document
  const finalResponse = await db.put(latestDoc);
  return { ...latestDoc, _rev: finalResponse.rev };
};

/**
 * Retrieves a photo attachment for a specific day.
 */
export const getPhotoAttachment = async (day: number): Promise<string | null> => {
  const db = await getDb();
  if (!db) return null;

  try {
    const blob = (await db.getAttachment('current_challenge', `day-${day}.jpg`)) as Blob;
    return URL.createObjectURL(blob);
  } catch (err) {
    return null; // No attachment found
  }
};
