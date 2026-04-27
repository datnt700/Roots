/**
 * IndexedDB helper for persisting parent QR recordings across network failures.
 *
 * When the parent records audio and the network drops before callDialogue()
 * succeeds, the blob is saved here first and retried on reconnect.
 */

const DB_NAME = 'roots-recording-cache'
const STORE = 'pending'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export interface PendingRecording {
  /** Slot token — unique per QR page */
  id: string
  blob: Blob
  mimeType: string
  savedAt: number
}

export async function savePendingRecording(
  data: PendingRecording,
): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(data)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadPendingRecording(
  token: string,
): Promise<PendingRecording | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(token)
    req.onsuccess = () => resolve((req.result as PendingRecording) ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function deletePendingRecording(token: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(token)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
