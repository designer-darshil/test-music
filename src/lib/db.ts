import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

// Add necessary plugins for devmode validation
if (process.env.NODE_ENV !== 'production') {
  import('rxdb/plugins/dev-mode').then(module => {
    addRxPlugin(module.RxDBDevModePlugin);
  });
}

const matchCacheSchema = {
  version: 0,
  primaryKey: 'spotifyId',
  type: 'object',
  properties: {
    spotifyId: { type: 'string', maxLength: 100 },
    youtubeId: { type: 'string' },
    confidenceScore: { type: 'number' },
    isManualOverride: { type: 'boolean' },
    timestamp: { type: 'number' },
  },
  required: ['spotifyId', 'youtubeId', 'timestamp']
} as const;

let dbPromise: Promise<any> | null = null;

export async function getDb() {
  if (dbPromise) return dbPromise;
  
  dbPromise = (async () => {
    const db = await createRxDatabase({
      name: 'hybridmusicdb',
      storage: getRxStorageDexie(),
      ignoreDuplicate: true, // Handle HMR
    });

    await db.addCollections({
      matchcache: {
        schema: matchCacheSchema,
      }
    });
    
    return db;
  })();

  return dbPromise;
}
