import { createJSONStorage } from 'zustand/middleware'

const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
  const req = indexedDB.open('matchmaker', 1)
  req.onupgradeneeded = () => req.result.createObjectStore('kv')
  req.onsuccess = () => resolve(req.result)
  req.onerror = () => reject(req.error)
})

function store(mode: IDBTransactionMode) {
  return dbPromise.then(db => db.transaction('kv', mode).objectStore('kv'))
}

const idb = {
  async getItem(key: string): Promise<string | null> {
    const s = await store('readonly')
    return new Promise((res, rej) => {
      const r = s.get(key)
      r.onsuccess = () => res(r.result ?? null)
      r.onerror = () => rej(r.error)
    })
  },
  async setItem(key: string, value: string): Promise<void> {
    const s = await store('readwrite')
    return new Promise((res, rej) => {
      const r = s.put(value, key)
      r.onsuccess = () => res()
      r.onerror = () => rej(r.error)
    })
  },
  async removeItem(key: string): Promise<void> {
    const s = await store('readwrite')
    return new Promise((res, rej) => {
      const r = s.delete(key)
      r.onsuccess = () => res()
      r.onerror = () => rej(r.error)
    })
  },
}

export const idbStorage = createJSONStorage(() => idb)
