import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ChallengeDoc, ChallengeRules, GritDbDoc } from '@/types';

const sampleRules: ChallengeRules = {
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
};

interface StoredRecord {
  doc: Record<string, unknown>;
  attachments: Map<string, Blob>;
}

function createInMemoryPouchMock(initialDocs: Array<{ doc: Record<string, unknown>; attachments?: Record<string, Blob> }> = []) {
  const store = new Map<string, StoredRecord>();
  let revCounter = 1;

  for (const item of initialDocs) {
    const id = String(item.doc._id);
    store.set(id, {
      doc: { ...item.doc, _rev: String(item.doc._rev ?? `${revCounter++}-init`) },
      attachments: new Map(Object.entries(item.attachments ?? {})),
    });
  }

  const put = vi.fn(async (doc: Record<string, unknown>) => {
    const id = String(doc._id);
    const existing = store.get(id);
    if (existing && doc._rev !== existing.doc._rev) {
      const err = new Error('Document update conflict') as Error & { status: number };
      err.status = 409;
      throw err;
    }
    const rev = `${revCounter++}-mock`;
    store.set(id, {
      doc: { ...doc, _rev: rev },
      attachments: existing?.attachments ?? new Map(),
    });
    return { ok: true, id, rev };
  });

  const get = vi.fn(async (id: string) => {
    const record = store.get(id);
    if (!record) {
      const err = new Error('missing') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return { ...record.doc };
  });

  const allDocs = vi.fn(async (opts?: { include_docs?: boolean; startkey?: string; endkey?: string }) => {
    const keys = Array.from(store.keys()).sort();
    const filtered = keys.filter((k) => {
      if (opts?.startkey && k < opts.startkey) return false;
      if (opts?.endkey && k > opts.endkey) return false;
      return true;
    });

    return {
      rows: filtered.map((k) => ({
        id: k,
        key: k,
        value: { rev: String(store.get(k)!.doc._rev) },
        doc: opts?.include_docs ? { ...store.get(k)!.doc } : undefined,
      })),
    };
  });

  const bulkDocs = vi.fn(async (docs: Array<Record<string, unknown>>) => {
    return docs.map((doc) => {
      const id = String(doc._id);
      if (doc._deleted) {
        store.delete(id);
        return { ok: true, id, rev: `${revCounter++}-deleted` };
      }
      const rev = `${revCounter++}-bulk`;
      const existing = store.get(id);
      store.set(id, {
        doc: { ...doc, _rev: rev },
        attachments: existing?.attachments ?? new Map(),
      });
      return { ok: true, id, rev };
    });
  });

  const putAttachment = vi.fn(
    async (docId: string, attachmentId: string, _rev: string, blob: Blob) => {
      const record = store.get(docId);
      if (!record) throw new Error(`Doc ${docId} not found`);
      record.attachments.set(attachmentId, blob);
      const rev = `${revCounter++}-att`;
      record.doc._rev = rev;
      return { ok: true, id: docId, rev };
    }
  );

  const getAttachment = vi.fn(async (docId: string, attachmentId: string) => {
    const record = store.get(docId);
    const blob = record?.attachments.get(attachmentId);
    if (!blob) {
      const err = new Error('missing attachment') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return blob;
  });

  return {
    store,
    db: { put, get, allDocs, bulkDocs, putAttachment, getAttachment },
  };
}

describe('db composite keys and non-browser guard', () => {
  it('formats composite day and photo document IDs deterministically', async () => {
    const { formatDayKey, getDayDocId, getPhotoDocId } = await import('@/lib/db');
    expect(formatDayKey(1)).toBe('001');
    expect(formatDayKey(12)).toBe('012');
    expect(formatDayKey(75)).toBe('075');
    expect(getDayDocId('chal-1', 1)).toBe('day:chal-1:001');
    expect(getPhotoDocId('chal-1', 75)).toBe('photo:chal-1:075');
  });

  it('returns false when database is unavailable in non-browser environment', async () => {
    vi.resetModules();
    const originalWindow = globalThis.window;
    // @ts-expect-error simulating non-browser environment
    delete globalThis.window;

    try {
      const { deleteChallengeById } = await import('@/lib/db');
      const result = await deleteChallengeById('sample-challenge-id');
      expect(result).toBe(false);
    } finally {
      globalThis.window = originalWindow;
    }
  });
});

describe('db atomic meta, day, and photo operations', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('creates a ChallengeMetaDoc and aggregates day docs in getActiveChallenge and getChallengeById', async () => {
    const mockPouch = createInMemoryPouchMock();
    vi.doMock('pouchdb', () => ({
      default: vi.fn(function () {
        return mockPouch.db;
      }),
    }));

    const { createChallenge, updateChallengeDay, getActiveChallenge, getChallengeById, getDayDocId } =
      await import('@/lib/db');

    const created = await createChallenge('Atomic 75', 'hard', sampleRules, 75);
    expect(created).not.toBeNull();
    expect(mockPouch.store.get(created!._id)?.doc.docType).toBe('challenge_meta');

    await updateChallengeDay(created!._id, 3, {
      completed: true,
      photoAttached: false,
      waterConsumed: 128,
      tasks: {
        diet: true,
        workout1: true,
        workout2: true,
        water: true,
        reading: true,
        progressPhoto: false,
      },
    });

    const dayDocKey = getDayDocId(created!._id, 3);
    expect(mockPouch.store.get(dayDocKey)?.doc.docType).toBe('challenge_day');

    const active = await getActiveChallenge();
    expect(active?._id).toBe(created!._id);
    expect(active?.days[3]?.completed).toBe(true);
    expect(active?.days[3]?.waterConsumed).toBe(128);

    const byId = await getChallengeById(created!._id);
    expect(byId?.days[3]?.tasks.diet).toBe(true);
  });

  it('writes only changed day docs in updateChallenge without rewriting unchanged meta or days', async () => {
    const mockPouch = createInMemoryPouchMock();
    vi.doMock('pouchdb', () => ({
      default: vi.fn(function () {
        return mockPouch.db;
      }),
    }));

    const { createChallenge, updateChallenge } = await import('@/lib/db');
    const created = await createChallenge('Diff Test', 'soft', sampleRules, 75);

    mockPouch.db.put.mockClear();
    mockPouch.db.bulkDocs.mockClear();

    const updated: ChallengeDoc = {
      ...created!,
      days: {
        1: {
          completed: false,
          photoAttached: false,
          journal: 'Day 1 log',
          tasks: {
            diet: true,
            workout1: false,
            workout2: false,
            water: false,
            reading: false,
            progressPhoto: false,
          },
        },
      },
    };

    await updateChallenge(updated);

    // Meta did not change -> put should NOT be called
    expect(mockPouch.db.put).not.toHaveBeenCalled();
    // Only day 1 should be written via bulkDocs
    expect(mockPouch.db.bulkDocs).toHaveBeenCalledTimes(1);
    const writtenDocs = mockPouch.db.bulkDocs.mock.calls[0][0] as unknown as Array<GritDbDoc>;
    expect(writtenDocs).toHaveLength(1);
    expect(writtenDocs[0]._id).toBe(`day:${created!._id}:001`);
  });

  it('isolates photo attachments onto PhotoDoc and updates day doc', async () => {
    const mockPouch = createInMemoryPouchMock();
    vi.doMock('pouchdb', () => ({
      default: vi.fn(function () {
        return mockPouch.db;
      }),
    }));

    const createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-photo');
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURLSpy, writable: true });

    const { createChallenge, addPhotoAttachment, getPhotoAttachment, getPhotoDocId, getDayDocId } =
      await import('@/lib/db');

    const created = await createChallenge('Photo Isolation', 'hard', sampleRules, 75);
    const blob = new Blob([new Uint8Array(100)], { type: 'image/webp' });

    const afterPhoto = await addPhotoAttachment(created!, 2, blob);
    expect(afterPhoto.days[2]?.photoAttached).toBe(true);
    expect(afterPhoto.days[2]?.tasks.progressPhoto).toBe(true);

    const photoDoc = mockPouch.store.get(getPhotoDocId(created!._id, 2));
    expect(photoDoc?.doc.docType).toBe('photo');
    expect(photoDoc?.attachments.has('photo')).toBe(true);

    const dayDoc = mockPouch.store.get(getDayDocId(created!._id, 2));
    expect(dayDoc?.doc.docType).toBe('challenge_day');

    const url = await getPhotoAttachment(created!._id, 2);
    expect(url).toBe('blob:mock-photo');
  });

  it('auto-migrates legacy v1 monolithic ChallengeDoc and attachments on db init', async () => {
    const legacyBlob = new Blob([new Uint8Array(64)], { type: 'image/jpeg' });
    const legacyDoc = {
      _id: 'legacy-chal-1',
      _rev: '1-legacy',
      docType: 'challenge',
      name: 'Legacy 75',
      startDate: '2026-01-01',
      status: 'active',
      type: 'hard',
      duration: 75,
      rules: sampleRules,
      _attachments: { 'day-1.jpg': { content_type: 'image/jpeg' } },
      days: {
        1: {
          completed: true,
          photoAttached: true,
          journal: 'Migrated day 1',
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
    };

    const mockPouch = createInMemoryPouchMock([
      { doc: legacyDoc, attachments: { 'day-1.jpg': legacyBlob } },
    ]);

    vi.doMock('pouchdb', () => ({
      default: vi.fn(function () {
        return mockPouch.db;
      }),
    }));

    const { getActiveChallenge, getDayDocId, getPhotoDocId } = await import('@/lib/db');

    // Simulate concurrent callers on initial mount (e.g. React Strict Mode)
    const [active, activeSecond] = await Promise.all([
      getActiveChallenge(),
      getActiveChallenge(),
    ]);
    expect(active).not.toBeNull();
    expect(activeSecond?._id).toBe(active?._id);
    expect(active?.name).toBe('Legacy 75');
    expect(active?.days[1]?.journal).toBe('Migrated day 1');

    expect(mockPouch.store.get('legacy-chal-1')?.doc.docType).toBe('challenge_meta');
    expect(mockPouch.store.get(getDayDocId('legacy-chal-1', 1))?.doc.docType).toBe('challenge_day');
    expect(mockPouch.store.get(getPhotoDocId('legacy-chal-1', 1))?.doc.docType).toBe('photo');
    expect(mockPouch.store.get(getPhotoDocId('legacy-chal-1', 1))?.attachments.has('photo')).toBe(
      true
    );
  });

  it('deleteChallengeById removes meta, day, and photo docs together', async () => {
    const mockPouch = createInMemoryPouchMock();
    vi.doMock('pouchdb', () => ({
      default: vi.fn(function () {
        return mockPouch.db;
      }),
    }));

    const { createChallenge, addPhotoAttachment, deleteChallengeById } = await import('@/lib/db');
    const created = await createChallenge('To Delete', 'hard', sampleRules, 75);
    await addPhotoAttachment(created!, 1, new Blob([new Uint8Array(10)], { type: 'image/webp' }));

    expect(mockPouch.store.size).toBe(3); // meta + day + photo

    const deleted = await deleteChallengeById(created!._id);
    expect(deleted).toBe(true);
    expect(mockPouch.store.size).toBe(0);
  });
});
