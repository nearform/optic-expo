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
  secretsLoading: boolean
  add: (_: Omit<Secret, '_id'>) => Promise<void>
  update: (_: Secret) => Promise<void>
  remove: (_: Secret) => Promise<void>
  replace: (_: Secret[]) => Promise<void>
}

const initialContext: ContextType = {
  secrets: [],
  secretsLoading: false,
  add: async () => {
    // @todo
  },
  update: async () => {
    // @todo
  },
  remove: async () => {
    // @todo
  },
  replace: async () => {
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
  const [secretsLoading, setSecretsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    let mounted = true
    async function initialize() {
      if (user) {
        setSecretsLoading(true)
        const items = await secretsManager.getAllByUser(user.uid)

        if (mounted) {
          setSecrets(items)
        }

        setSecretsLoading(false)
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

  const replace = useCallback<ContextType['replace']>(async allSecrets => {
    await secretsManager.replace(allSecrets)
    setSecrets(allSecrets)
  }, [])

  const value = useMemo<ContextType>(
    () => ({ secrets, secretsLoading, add, update, remove, replace }),
    [secrets, secretsLoading, add, update, remove, replace]
  )

  return (
    <SecretsContext.Provider value={value}>{children}</SecretsContext.Provider>
  )
}

export function useSecrets() {
  return useContext(SecretsContext)
}
