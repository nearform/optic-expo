import { useMemo } from 'react'

import { useSecretSelector } from './use-secret-selector'

export function useTokenDataSelector(secretId: string, token: string) {
  const secret = useSecretSelector(secretId)

  return useMemo(() => {
    const tokens = secret ? secret.tokens : []
    return tokens.find(item => item.token === token)
  }, [secret, token])
}
