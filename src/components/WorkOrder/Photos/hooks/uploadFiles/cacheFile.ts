import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'

const DB_NAME = 'repairs-hub-files'
const STORE_NAME = 'files'
const DB_VERSION = 1

function fileCacheKey(file: File): string {
  return `cached-${file.name}`
}

let cachedDb: IDBPDatabase | null = null

async function getDb() {
  if (cachedDb) return cachedDb
  cachedDb = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
  return cachedDb
}

function fileDetails(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  }
}

export async function cachedFileExists(file: File): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    const db = await getDb()
    const cacheKey = fileCacheKey(file)
    const allDbKeys = await db.getAllKeys(STORE_NAME)
    return allDbKeys.includes(cacheKey)
  } catch (err) {
    console.error(
      `Error checking existence of ${fileCacheKey(file)} in IndexedDB cache:`,
      err
    )
    return false
  }
}

export async function getCachedFile(originalFile: File): Promise<File | null> {
  if (typeof window === 'undefined') return null

  try {
    const db = await getDb()
    const cacheKey = fileCacheKey(originalFile)
    const cachedFile = (await db.get(STORE_NAME, cacheKey)) as File | undefined
    if (!cachedFile) return null

    const originalName = cacheKey.replace('cached-', '')
    const reconstructedFile = new File([cachedFile], originalName, {
      type: cachedFile.type,
    })

    return reconstructedFile
  } catch (err) {
    console.error(
      `Error reading ${fileCacheKey(originalFile)} from IndexedDB cache:`,
      err
    )
    return null
  }
}

export async function setCachedFile(file: File): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const cacheKey = fileCacheKey(file)
    const db = await getDb()

    // if key already in cache - abort
    const existing = await db.get(STORE_NAME, cacheKey)
    if (existing) {
      console.log('File already cached:', fileDetails(file))
      return
    }
    await db.put(STORE_NAME, file, cacheKey)
  } catch (err) {
    console.error('Error caching file to IndexedDB:', err)
  }
}

export async function clearIndexedDb(): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    const db = await getDb()
    await db.clear(STORE_NAME)
    console.log('Cleared all cached files from IndexedDB')
  } catch (err) {
    console.error('Error clearing IndexedDB cache:', err)
  }
}
