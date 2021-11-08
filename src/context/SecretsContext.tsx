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

import { useAuth } from './AuthContext'

export type ContextType = {
  secrets: Secret[]
  add: (_: Omit<Secret, '_id'>) => Promise<void>
  update: (_: Secret) => Promise<void>
  remove: (_: Secret) => Promise<void>
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
}

const SecretsContext = createContext<ContextType>(initialContext)

type SecretsProviderProps = {
  children: React.ReactNode
}

export const SecretsProvider: React.FC<SecretsProviderProps> = ({
  children,
}) => {
  const [secrets, setSecrets] = useState<Secret[]>([])
  const { user } = useAuth()

  useEffect(() => {
    let mounted = true
    async function initialize() {
      if (user) {
        const secrets = await secretsManager.getAllByUser(user.uid)

        if (mounted) {
          setSecrets(secrets)
        }
      }
    }

    initialize()
    return () => {
      mounted = false
    }
  }, [user])

  const add = useCallback<ContextType['add']>(
    async secret => {
      await secretsManager.upsert(secret, user.uid)
      setSecrets(await secretsManager.getAllByUser(user.uid))
    },
    [user]
  )

  const remove = useCallback<ContextType['remove']>(
    async secret => {
      await secretsManager.remove(secret._id)
      setSecrets(await secretsManager.getAllByUser(user.uid))
    },
    [user]
  )

  const update = useCallback<ContextType['update']>(
    async secret => {
      await secretsManager.upsert(secret, user.uid)
      setSecrets(await secretsManager.getAllByUser(user.uid))
    },
    [user]
  )

  const value = useMemo<ContextType>(
    () => ({ secrets, add, update, remove }),
    [secrets, add, update, remove]
  )

  return (
    <SecretsContext.Provider value={value}>{children}</SecretsContext.Provider>
  )
}

export function useSecrets() {
  return useContext(SecretsContext)
}
