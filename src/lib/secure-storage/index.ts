import { getItem, setItem, clearAll } from './storage'

export async function getObject<T>(key: string): Promise<T | null> {
  try {
    const value = await getItem(key)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export async function saveObject(key: string, obj: unknown): Promise<void> {
  return setItem(key, JSON.stringify(obj))
}

export { getItem, setItem, clearAll }
