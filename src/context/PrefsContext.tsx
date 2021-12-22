import React, {
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from 'react'

import * as storage from '../lib/secure-storage'

type Prefs = {
  useBiometricAuth: boolean
}

type ContextType = {
  prefs: Prefs
  save: (_: keyof Prefs, __: boolean) => Promise<void>
}

const defaultPrefs: Prefs = {
  useBiometricAuth: false,
}

const initialContext: ContextType = {
  prefs: defaultPrefs,
  save: async () => {
    // @todo
  },
}

const PrefsContext = React.createContext<ContextType>(initialContext)

type PrefsProviderProps = {
  children: React.ReactNode
}

export const PrefsProvider: React.FC<PrefsProviderProps> = ({ children }) => {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs)

  useEffect(() => {
    async function fn() {
      const s = await storage.getObject<Prefs>('prefs')
      if (s) setPrefs(s)
    }

    fn()
  }, [])

  const save = useCallback<ContextType['save']>(
    async (key, value) => {
      const newPrefs = { ...prefs, [key]: value }
      setPrefs(newPrefs)
      storage.saveObject('prefs', newPrefs)
    },
    [prefs]
  )

  const value = useMemo<ContextType>(() => ({ prefs, save }), [prefs, save])

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs() {
  return useContext(PrefsContext)
}
