import { FileUploadError } from '.'
import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'

const DB_NAME = 'repairs-hub-files'
const STORE_NAME = 'files'
const DB_VERSION = 1

type StoredFile = {
  blob: Blob
  name: string
  type: string
  lastModified?: number
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

export function fileCacheKey(file: File): string {
  return `compressed-${file.name}`
}

async function storedToFile(
  stored: StoredFile,
  fallbackName: string
): Promise<File> {
  return new File([stored.blob], stored.name || fallbackName, {
    type: stored.type || 'application/octet-stream',
    lastModified: stored.lastModified || Date.now(),
  })
}

export async function getCachedFile(
  cacheKey: string,
  originalFile: File
): Promise<File | null> {
  if (typeof window === 'undefined') return null

  try {
    const db = await getDb()
    const stored = (await db.get(STORE_NAME, cacheKey)) as
      | StoredFile
      | undefined
    if (!stored) return null

    const cachedFile = await storedToFile(stored, originalFile.name)
    console.log('Retrieved cached file:', fileDetails(cachedFile))

    try {
      // Attempt to read the first kilobyte of the file to ensure it is valid and accessible
      await cachedFile.slice(0, 1024).arrayBuffer()
    } catch (err) {
      const errorMessage = `Could not read the file "${
        originalFile.name
      }". Please remove and re-select it. Error: ${(err as Error).message}`
      console.error(errorMessage, err)
      throw new FileUploadError(errorMessage)
    }

    return cachedFile
  } catch (err) {
    console.error('Error reading from IndexedDB cache:', err)
    return null
  }
}

export async function setCachedFile(
  cacheKey: string,
  file: File
): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const db = await getDb()
    const toStore: StoredFile = {
      blob: file,
      name: file.name,
      type: file.type,
      lastModified: (file as File).lastModified || Date.now(),
    }
    await db.put(STORE_NAME, toStore, cacheKey)
    console.log('Cached compressed file in IndexedDB:', fileDetails(file))
  } catch (err) {
    console.error('Error caching file to IndexedDB:', err)
  }
}

export async function clearSessionStorage(): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    const db = await getDb()
    await db.clear(STORE_NAME)
    console.log('Cleared all cached files from IndexedDB')
  } catch (err) {
    console.error('Error clearing IndexedDB cache:', err)
  }
}
