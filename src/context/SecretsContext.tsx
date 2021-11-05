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

export type ContextType = {
  secrets: Secret[]
  add: (_: Omit<Secret, '_id'>) => Promise<void>
  update: (_: Secret) => Promise<void>
  remove: (_: Secret) => Promise<void>
  updateUserId: (_: string) => void
}

const initialContext: ContextType = {
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
  updateUserId: async () => {
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
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    async function initialize() {
      if (userId) {
        setSecrets(await secretsManager.getAllByUser(userId))
      }
    }

    initialize()
  }, [userId])

  const add = useCallback<ContextType['add']>(
    async secret => {
      await secretsManager.upsert(secret, userId)
      setSecrets(await secretsManager.getAllByUser(userId))
    },
    [userId]
  )

  const remove = useCallback<ContextType['remove']>(
    async secret => {
      await secretsManager.remove(secret._id)
      setSecrets(await secretsManager.getAllByUser(userId))
    },
    [userId]
  )

  const update = useCallback<ContextType['update']>(
    async secret => {
      await secretsManager.upsert(secret, userId)
      setSecrets(await secretsManager.getAllByUser(userId))
    },
    [userId]
  )

  const updateUserId = useCallback<ContextType['updateUserId']>(
    async userId => {
      setUserId(userId)
    },
    []
  )

  const value = useMemo<ContextType>(
    () => ({ secrets, add, update, remove, updateUserId }),
    [secrets, add, update, remove, updateUserId]
  )

  return (
    <SecretsContext.Provider value={value}>{children}</SecretsContext.Provider>
  )
}

export function useSecrets() {
  return useContext(SecretsContext)
}
