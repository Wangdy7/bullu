import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved === null ? fallback : (JSON.parse(saved) as T)
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private browsing or blocked storage should not break the preview.
    }
  }, [key, value])

  return [value, setValue] as const
}
