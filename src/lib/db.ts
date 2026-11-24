import type {
  ChallengeDay,
  ChallengeDayDoc,
  ChallengeDoc,
  ChallengeMetaDoc,
  ChallengeRules,
  ChallengeType,
  GritDbDoc,
  PhotoDoc,
} from '@/types';
import { getLocalDateString } from '@/utils/date';
import PouchDB from 'pouchdb';
import { v4 as uuidv4 } from 'uuid';

const PHOTO_ATTACHMENT_NAME = 'photo';

let dbInstance: PouchDB.Database<GritDbDoc> | null = null;
let dbInitPromise: Promise<PouchDB.Database<GritDbDoc> | null> | null = null;

const initialTaskState: ChallengeDay['tasks'] = {
  diet: false,
  workout1: false,
  workout2: false,
  water: false,
  reading: false,
  progressPhoto: false,
};

/**
 * Formats a 1-based day number into a zero-padded 3-digit key (e.g. "001").
 */
export const formatDayKey = (day: number): string => String(day).padStart(3, '0');

/**
 * Builds the deterministic composite ID for a ChallengeDayDoc.
 */
export const getDayDocId = (challengeId: string, day: number): string =>
  `day:${challengeId}:${formatDayKey(day)}`;

/**
 * Builds the deterministic composite ID for a PhotoDoc.
 */
export const getPhotoDocId = (challengeId: string, day: number): string =>
  `photo:${challengeId}:${formatDayKey(day)}`;

const isNotFoundError = (err: unknown): boolean =>
  typeof err === 'object' && err !== null && (err as { status?: number }).status === 404;

const stripDayDocMetadata = (dayDoc: ChallengeDayDoc): ChallengeDay => ({
  completed: dayDoc.completed,
  photoAttached: dayDoc.photoAttached,
  ...(dayDoc.journal !== undefined ? { journal: dayDoc.journal } : {}),
  ...(dayDoc.weight !== undefined ? { weight: dayDoc.weight } : {}),
  ...(dayDoc.measurements !== undefined ? { measurements: dayDoc.measurements } : {}),
  ...(dayDoc.waterConsumed !== undefined ? { waterConsumed: dayDoc.waterConsumed } : {}),
  tasks: dayDoc.tasks,
});

const toAggregatedChallenge = (
  meta: ChallengeMetaDoc,
  dayDocs: ChallengeDayDoc[]
): ChallengeDoc => {
  const days: Record<number, ChallengeDay> = {};
  for (const dayDoc of dayDocs) {
    days[dayDoc.day] = stripDayDocMetadata(dayDoc);
  }

  return {
    _id: meta._id,
    _rev: meta._rev,
    docType: 'challenge',
    name: meta.name,
    startDate: meta.startDate,
    status: meta.status,
    type: meta.type,
    duration: meta.duration,
    ...(meta.completionDate !== undefined ? { completionDate: meta.completionDate } : {}),
    rules: meta.rules,
    days,
  };
};

const extractMetaFields = (
  challenge: Pick<
    ChallengeDoc,
    'name' | 'startDate' | 'status' | 'type' | 'duration' | 'completionDate' | 'rules'
  >
): Omit<ChallengeMetaDoc, '_id' | '_rev' | 'docType'> => ({
  name: challenge.name,
  startDate: challenge.startDate,
  status: challenge.status,
  type: challenge.type,
  duration: challenge.duration,
  ...(challenge.completionDate !== undefined ? { completionDate: challenge.completionDate } : {}),
  rules: challenge.rules,
});

/**
 * Migrates any legacy v1 monolithic ChallengeDoc documents into atomic
 * ChallengeMetaDoc, ChallengeDayDoc, and PhotoDoc records.
 */
const migrateLegacyChallenges = async (db: PouchDB.Database<GritDbDoc>): Promise<void> => {
  try {
    const result = await db.allDocs({ include_docs: true });
    const legacyDocs = result.rows
      .map((row) => row.doc)
      .filter((doc): doc is PouchDB.Core.ExistingDocument<ChallengeDoc> =>
        Boolean(doc && doc.docType === 'challenge')
      );

    for (const legacyDoc of legacyDocs) {
      const challengeId = legacyDoc._id;

      // 1. Migrate legacy attachments (e.g., "day-1.jpg") to isolated PhotoDoc records
      const attachments = (legacyDoc as { _attachments?: Record<string, unknown> })._attachments;
      if (attachments) {
        for (const attachmentName of Object.keys(attachments)) {
          const match = /^day-(\d+)\./.exec(attachmentName);
          if (!match) continue;

          const day = Number(match[1]);
          const photoDocId = getPhotoDocId(challengeId, day);
          try {
            const blob = (await db.getAttachment(challengeId, attachmentName)) as Blob;
            const mimeType = blob.type || 'image/jpeg';
            let existingPhotoRev: string | undefined;
            try {
              const existingPhoto = await db.get(photoDocId);
              existingPhotoRev = existingPhoto._rev;
            } catch (err) {
              if (!isNotFoundError(err)) throw err;
            }

            const photoDoc: PhotoDoc = {
              _id: photoDocId,
              ...(existingPhotoRev ? { _rev: existingPhotoRev } : {}),
              docType: 'photo',
              challengeId,
              day,
              mimeType,
              updatedAt: new Date().toISOString(),
            };
            const putRes = await db.put(photoDoc);
            await db.putAttachment(photoDocId, PHOTO_ATTACHMENT_NAME, putRes.rev, blob, mimeType);
          } catch (err) {
            console.error(`Failed to migrate attachment ${attachmentName} for ${challengeId}:`, err);
          }
        }
      }

      // 2. Migrate embedded days to atomic ChallengeDayDoc records (idempotent)
      const dayEntries = Object.entries(legacyDoc.days ?? {});
      if (dayEntries.length > 0) {
        const existingDaysResult = await db.allDocs({
          include_docs: true,
          startkey: `day:${challengeId}:`,
          endkey: `day:${challengeId}:\uffff`,
        });
        const existingRevById = new Map<string, string>();
        for (const row of existingDaysResult.rows) {
          if (row.doc?._rev) {
            existingRevById.set(row.id, row.doc._rev);
          }
        }

        const dayDocsToPut: ChallengeDayDoc[] = dayEntries.map(([dayKey, dayData]) => {
          const day = Number(dayKey);
          const id = getDayDocId(challengeId, day);
          const existingRev = existingRevById.get(id);
          return {
            _id: id,
            ...(existingRev ? { _rev: existingRev } : {}),
            docType: 'challenge_day',
            challengeId,
            day,
            ...dayData,
          };
        });
        await db.bulkDocs(dayDocsToPut);
      }

      // 3. Replace monolithic root doc with clean ChallengeMetaDoc (drops days & _attachments)
      const metaDoc: ChallengeMetaDoc = {
        _id: challengeId,
        _rev: legacyDoc._rev,
        docType: 'challenge_meta',
        ...extractMetaFields(legacyDoc),
      };
      await db.put(metaDoc);
    }
  } catch (err) {
    console.error('Error migrating legacy challenge documents:', err);
  }
};

/**
 * Dynamically initializes the PouchDB database instance once and runs v1 migration.
 */
const getDb = async (): Promise<PouchDB.Database<GritDbDoc> | null> => {
  if (dbInstance) {
    return dbInstance;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      const PouchDBConstructor = (await import('pouchdb')).default;
      await import('uuid');
      const db = new PouchDBConstructor<GritDbDoc>('grit-challenge');
      await migrateLegacyChallenges(db);
      dbInstance = db;
      return db;
    })().catch((err) => {
      dbInitPromise = null;
      throw err;
    });
  }

  return dbInitPromise;
};

/**
 * Creates a new challenge meta document in PouchDB and returns the aggregated ChallengeDoc.
 */
export const createChallenge = async (
  name: string,
  type: ChallengeType,
  rules: ChallengeRules,
  duration: number = 75
): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const metaDoc: ChallengeMetaDoc = {
    _id: uuidv4(),
    docType: 'challenge_meta',
    name,
    startDate: getLocalDateString(),
    status: 'active',
    type,
    duration,
    rules,
  };

  try {
    const response = await db.put(metaDoc);
    metaDoc._rev = response.rev;
    return toAggregatedChallenge(metaDoc, []);
  } catch (err) {
    console.error('Error starting new challenge:', err);
    throw err;
  }
};

/**
 * Fetches all challenges by aggregating ChallengeMetaDoc and ChallengeDayDoc records.
 */
export const getAllChallenges = async (): Promise<ChallengeDoc[]> => {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.allDocs({ include_docs: true });
    const metas: ChallengeMetaDoc[] = [];
    const daysByChallenge = new Map<string, ChallengeDayDoc[]>();

    for (const row of result.rows) {
      const doc = row.doc;
      if (!doc) continue;

      if (doc.docType === 'challenge_meta') {
        metas.push(doc);
      } else if (doc.docType === 'challenge_day') {
        const list = daysByChallenge.get(doc.challengeId) ?? [];
        list.push(doc);
        daysByChallenge.set(doc.challengeId, list);
      }
    }

    return metas.map((meta) => toAggregatedChallenge(meta, daysByChallenge.get(meta._id) ?? []));
  } catch (err) {
    console.error('Error fetching all challenges:', err);
    return [];
  }
};

/**
 * Aggregates the active challenge from its meta and day documents.
 */
export const getActiveChallenge = async (): Promise<ChallengeDoc | null> => {
  const challenges = await getAllChallenges();
  return challenges.find((doc) => doc.status === 'active') || null;
};

/**
 * Fetches a single challenge by ID, aggregating its meta doc and day docs via composite keys.
 */
export const getChallengeById = async (id: string): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  try {
    const meta = await db.get(id);
    if (meta.docType !== 'challenge_meta') {
      return null;
    }

    const dayResult = await db.allDocs({
      include_docs: true,
      startkey: `day:${id}:`,
      endkey: `day:${id}:\uffff`,
    });

    const dayDocs = dayResult.rows
      .map((row) => row.doc)
      .filter((doc): doc is PouchDB.Core.ExistingDocument<ChallengeDayDoc> =>
        Boolean(doc && doc.docType === 'challenge_day')
      );

    return toAggregatedChallenge(meta, dayDocs);
  } catch (err) {
    if (isNotFoundError(err)) {
      return null;
    }
    console.error(`Error fetching challenge with id ${id}:`, err);
    throw err;
  }
};

/**
 * Atomically updates only the ChallengeMetaDoc fields.
 */
export const updateChallengeMeta = async (
  challengeId: string,
  updates: Partial<Omit<ChallengeMetaDoc, '_id' | '_rev' | 'docType'>>
): Promise<ChallengeMetaDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const existing = await db.get(challengeId);
  if (existing.docType !== 'challenge_meta') {
    throw new Error(`Document ${challengeId} is not a challenge_meta document`);
  }

  const updatedMeta: ChallengeMetaDoc = {
    ...existing,
    ...updates,
  };
  const response = await db.put(updatedMeta);
  return { ...updatedMeta, _rev: response.rev };
};

/**
 * Atomically upserts a single ChallengeDayDoc using its composite key.
 */
export const updateChallengeDay = async (
  challengeId: string,
  day: number,
  dayData: ChallengeDay
): Promise<ChallengeDayDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const dayDocId = getDayDocId(challengeId, day);
  let existingRev: string | undefined;

  try {
    const existing = await db.get(dayDocId);
    existingRev = existing._rev;
  } catch (err) {
    if (!isNotFoundError(err)) throw err;
  }

  const dayDoc: ChallengeDayDoc = {
    _id: dayDocId,
    ...(existingRev ? { _rev: existingRev } : {}),
    docType: 'challenge_day',
    challengeId,
    day,
    ...dayData,
  };

  const response = await db.put(dayDoc);
  return { ...dayDoc, _rev: response.rev };
};

/**
 * Diffs an aggregated ChallengeDoc against persisted Meta and Day docs,
 * writing only the documents that actually changed.
 */
export const updateChallenge = async (challenge: ChallengeDoc): Promise<ChallengeDoc | null> => {
  const db = await getDb();
  if (!db) return null;

  const existingMeta = await db.get(challenge._id);
  if (existingMeta.docType !== 'challenge_meta') {
    throw new Error(`Document ${challenge._id} is not a challenge_meta document`);
  }

  let latestMetaRev = existingMeta._rev;
  const nextMetaFields = extractMetaFields(challenge);
  const currentMetaFields = extractMetaFields(existingMeta);

  if (JSON.stringify(nextMetaFields) !== JSON.stringify(currentMetaFields)) {
    const nextMetaDoc: ChallengeMetaDoc = {
      _id: challenge._id,
      _rev: existingMeta._rev,
      docType: 'challenge_meta',
      ...nextMetaFields,
    };
    const metaRes = await db.put(nextMetaDoc);
    latestMetaRev = metaRes.rev;
  }

  const existingDaysResult = await db.allDocs({
    include_docs: true,
    startkey: `day:${challenge._id}:`,
    endkey: `day:${challenge._id}:\uffff`,
  });

  const existingDaysByNum = new Map<number, ChallengeDayDoc>();
  for (const row of existingDaysResult.rows) {
    const doc = row.doc;
    if (doc && doc.docType === 'challenge_day') {
      existingDaysByNum.set(doc.day, doc);
    }
  }

  const changedDayDocs: ChallengeDayDoc[] = [];
  for (const [dayKey, dayData] of Object.entries(challenge.days)) {
    const day = Number(dayKey);
    const existingDay = existingDaysByNum.get(day);
    const existingData = existingDay ? stripDayDocMetadata(existingDay) : null;

    if (!existingData || JSON.stringify(dayData) !== JSON.stringify(existingData)) {
      changedDayDocs.push({
        _id: getDayDocId(challenge._id, day),
        ...(existingDay?._rev ? { _rev: existingDay._rev } : {}),
        docType: 'challenge_day',
        challengeId: challenge._id,
        day,
        ...dayData,
      });
    }
  }

  if (changedDayDocs.length > 0) {
    await db.bulkDocs(changedDayDocs);
  }

  return { ...challenge, _rev: latestMetaRev };
};

/**
 * Stores a photo attachment on an isolated PhotoDoc and marks the day's ChallengeDayDoc.
 */
export const addPhotoAttachment = async (
  doc: ChallengeDoc,
  day: number,
  photo: Blob
): Promise<ChallengeDoc> => {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const photoDocId = getPhotoDocId(doc._id, day);
  const mimeType = photo.type || 'image/jpeg';

  let existingPhotoRev: string | undefined;
  try {
    const existingPhoto = await db.get(photoDocId);
    existingPhotoRev = existingPhoto._rev;
  } catch (err) {
    if (!isNotFoundError(err)) throw err;
  }

  const photoDoc: PhotoDoc = {
    _id: photoDocId,
    ...(existingPhotoRev ? { _rev: existingPhotoRev } : {}),
    docType: 'photo',
    challengeId: doc._id,
    day,
    mimeType,
    updatedAt: new Date().toISOString(),
  };

  const photoPutRes = await db.put(photoDoc);
  await db.putAttachment(photoDocId, PHOTO_ATTACHMENT_NAME, photoPutRes.rev, photo, mimeType);

  const dayDocId = getDayDocId(doc._id, day);
  let existingDayDoc: ChallengeDayDoc | null = null;
  try {
    const fetched = await db.get(dayDocId);
    if (fetched.docType === 'challenge_day') {
      existingDayDoc = fetched;
    }
  } catch (err) {
    if (!isNotFoundError(err)) throw err;
  }

  const baseDayData: ChallengeDay = existingDayDoc
    ? stripDayDocMetadata(existingDayDoc)
    : doc.days[day] ?? {
        completed: false,
        photoAttached: false,
        tasks: { ...initialTaskState },
      };

  const updatedDayData: ChallengeDay = {
    ...baseDayData,
    photoAttached: true,
    tasks: {
      ...baseDayData.tasks,
      progressPhoto: true,
    },
  };

  await updateChallengeDay(doc._id, day, updatedDayData);

  return {
    ...doc,
    days: {
      ...doc.days,
      [day]: updatedDayData,
    },
  };
};

/**
 * Retrieves a photo attachment from its isolated PhotoDoc as an object URL.
 */
export const getPhotoAttachment = async (
  challengeId: string,
  day: number
): Promise<string | null> => {
  const db = await getDb();
  if (!db) return null;

  try {
    const blob = (await db.getAttachment(
      getPhotoDocId(challengeId, day),
      PHOTO_ATTACHMENT_NAME
    )) as Blob;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

/**
 * Hard deletes a challenge meta doc and all associated day and photo docs by ID.
 */
export const deleteChallengeById = async (id: string): Promise<boolean> => {
  const db = await getDb();
  if (!db) return false;

  try {
    const metaDoc = await db.get(id);
    const [dayRows, photoRows] = await Promise.all([
      db.allDocs({ include_docs: true, startkey: `day:${id}:`, endkey: `day:${id}:\uffff` }),
      db.allDocs({ include_docs: true, startkey: `photo:${id}:`, endkey: `photo:${id}:\uffff` }),
    ]);

    const docsToDelete: Array<PouchDB.Core.PutDocument<GritDbDoc>> = [
      { ...metaDoc, _deleted: true },
      ...dayRows.rows
        .map((r) => r.doc)
        .filter((d): d is PouchDB.Core.ExistingDocument<GritDbDoc> => Boolean(d))
        .map((d) => ({ ...d, _deleted: true })),
      ...photoRows.rows
        .map((r) => r.doc)
        .filter((d): d is PouchDB.Core.ExistingDocument<GritDbDoc> => Boolean(d))
        .map((d) => ({ ...d, _deleted: true })),
    ];

    await db.bulkDocs(docsToDelete);
    return true;
  } catch (err) {
    if (isNotFoundError(err)) {
      return false;
    }
    console.error(`Error deleting challenge with id ${id}:`, err);
    throw err;
  }
};

/**
 * DANGER: Deletes all documents from the database.
 * Used for the "Reset App" functionality.
 */
export const deleteAllChallenges = async (): Promise<void> => {
  const db = await getDb();
  if (!db) return;

  try {
    const result = await db.allDocs({ include_docs: true });

    const deletedDocs = result.rows
      .filter((row) => row.doc)
      .map((row) => ({
        ...row.doc!,
        _deleted: true,
      }));

    if (deletedDocs.length > 0) {
      await db.bulkDocs(deletedDocs as PouchDB.Core.PutDocument<GritDbDoc>[]);
    }
  } catch (err) {
    console.error('Error deleting all challenges:', err);
    throw err;
  }
};
