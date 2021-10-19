import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from 'react'

import secretsManager from '../lib/secretsManager'
import { Secret } from '../types'

type ContextType = {
  isInitialized: boolean
  secrets: Secret[]
  add: (_: Secret) => Promise<void>
  update: (_: Secret) => Promise<void>
  remove: (_: Secret) => Promise<void>
}

const initialContext: ContextType = {
  isInitialized: false,
  secrets: [],
  add: async () => {
    // @todo
  },
  update: async () => {
    // @todo
  },
  remove: async () => {
    // @todo
  },
}

const SecretsContext = createContext<ContextType>(initialContext)

type SecretsProviderProps = {
  children: React.ReactNode
}

export const SecretsProvider: React.FC<SecretsProviderProps> = ({
  children,
}) => {
  const [isInitialized, setInitialization] = useState(false)
  const [secrets, setSecrets] = useState<Secret[]>([])

  useEffect(() => {
    async function initialize() {
      setSecrets(await secretsManager.getAll())
      setInitialization(true)
    }

    initialize()
  }, [])

  const add = useCallback<ContextType['add']>(async secret => {
    await secretsManager.upsert(secret)
    setSecrets(await secretsManager.getAll())
  }, [])

  const remove = useCallback<ContextType['remove']>(async secret => {
    await secretsManager.remove(secret._id)
    setSecrets(await secretsManager.getAll())
  }, [])

  const update = useCallback<ContextType['update']>(async secret => {
    await secretsManager.upsert(secret)
    setSecrets(await secretsManager.getAll())
  }, [])

  const value = useMemo<ContextType>(
    () => ({ isInitialized, secrets, add, update, remove }),
    [isInitialized, secrets, add, update, remove]
  )

  return (
    <SecretsContext.Provider value={value}>{children}</SecretsContext.Provider>
  )
}

export function useSecrets() {
  return useContext(SecretsContext)
}