import { useCallback, useMemo } from 'react'

import { useAuth } from '../context/AuthContext'
import { useSecrets } from '../context/SecretsContext'
import apiFactory from '../lib/api'

export const useDeleteAccount = () => {
  const { user, handleDeleteAccount } = useAuth()
  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])
  const { secrets, replace } = useSecrets()

  const deleteAllTokens = useCallback(async () => {
    const deletePromises = []

    secrets.forEach(({ tokens }) => {
      if (Array.isArray(tokens)) {
        tokens.forEach(t => {
          deletePromises.push(api.revokeToken(t.token))
        })
      }
    })
    await Promise.all(deletePromises)
  }, [api, secrets])

  const deleteAllSecrets = useCallback(async () => {
    await replace([])
  }, [replace])

  const deleteAccount = useCallback(async () => {
    await deleteAllTokens()
    await deleteAllSecrets()
    await handleDeleteAccount()
  }, [deleteAllTokens, deleteAllSecrets, handleDeleteAccount])

  return {
    deleteAccount,
  }
}
