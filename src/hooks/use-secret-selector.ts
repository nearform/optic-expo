import { useMemo } from 'react'

import { useSecrets } from '../context/SecretsContext'

export function useSecretSelector(secretId: string) {
  const { secrets } = useSecrets()
  return useMemo(
    () => secrets.find(item => item._id === secretId),
    [secretId, secrets]
  )
}
