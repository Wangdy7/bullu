import { createContext, useContext } from 'react'
import type { User, View } from './types'
import type { Language } from './i18n'

export interface NavigateOptions {
  search?: string
  targetId?: string
}

export interface AppContextValue {
  view: View
  navigate: (view: View, options?: NavigateOptions) => void
  user: User | null
  login: (user: User) => void
  logout: () => void
  openAuth: () => void
  toast: (message: string) => void
  searchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  initialSearch: string
  targetId: string | null
  clearTarget: () => void
  language: Language
  setLanguage: (language: Language) => void
  t: (source: string, vars?: Record<string, string | number>) => string
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used within AppContext')
  return value
}
