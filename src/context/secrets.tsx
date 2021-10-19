import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from 'react'

import SecretsManager from '../lib/secretsManager'
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

  const secretsManager = useMemo(() => new SecretsManager(), [])

  useEffect(() => {
    async function initialize() {
      await secretsManager.initialize()
      setSecrets(await secretsManager.find())
      setInitialization(true)
    }

    initialize()
  }, [secretsManager])

  const add = useCallback<ContextType['add']>(
    async secret => {
      await secretsManager.upsert(secret)
      setSecrets(await secretsManager.find({ uid: secret.uid }))
    },
    [secretsManager]
  )

  const remove = useCallback<ContextType['remove']>(
    async secret => {
      await secretsManager.remove(secret._id)
      setSecrets(await secretsManager.find({ uid: secret.uid }))
    },
    [secretsManager]
  )

  const update = useCallback<ContextType['update']>(
    async secret => {
      await secretsManager.upsert(secret)
      setSecrets(await secretsManager.find({ uid: secret.uid }))
    },
    [secretsManager]
  )

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
