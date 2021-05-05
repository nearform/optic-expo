import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from 'react'

import SecretsManager from '../lib/secretsManager'

const SecretsContext = createContext({})

export function useSecrets() {
  return useContext(SecretsContext)
}

export function SecretsProvider({ children }) {
  const [isInitialized, setInitialization] = useState(false)
  const [secrets, setSecrets] = useState([])

  const secretsManager = useMemo(() => new SecretsManager(), [])

  useEffect(() => {
    async function initialize() {
      await secretsManager.initialize()
      setSecrets(await secretsManager.find())
      setInitialization(true)
    }

    initialize()
  }, [secretsManager])

  const add = useCallback(
    async secret => {
      await secretsManager.upsert(secret)
      setSecrets(await secretsManager.find({ uid: secret.uid }))
    },
    [secretsManager]
  )

  const remove = useCallback(
    async secret => {
      await secretsManager.remove(secret._id)
      setSecrets(await secretsManager.find({ uid: secret.uid }))
    },
    [secretsManager]
  )

  const update = useCallback(
    async secret => {
      await secretsManager.upsert(secret)
      setSecrets(await secretsManager.find({ uid: secret.uid }))
    },
    [secretsManager]
  )

  return (
    <SecretsContext.Provider
      value={useMemo(() => ({ isInitialized, secrets, add, update, remove }), [
        isInitialized,
        secrets,
        add,
        update,
        remove,
      ])}
    >
      {children}
    </SecretsContext.Provider>
  )
}
