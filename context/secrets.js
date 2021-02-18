import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useCallback,
} from 'react'

import { upsert, find } from '../lib/secretsManager'

const SecretsContext = createContext({})

export function useSecretsContext() {
  return useContext(SecretsContext)
}

export function SecretsProvider({ children }) {
  const [secrets, setSecrets] = useState([])

  const add = useCallback(async secret => {
    await upsert(secret)
    setSecrets(await find({ uid: secret.uid }))
  }, [])

  return (
    <SecretsContext.Provider
      value={useMemo(() => ({ secrets, add }), [secrets, add])}
    >
      {children}
    </SecretsContext.Provider>
  )
}
