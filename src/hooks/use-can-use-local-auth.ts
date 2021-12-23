import { useEffect, useState } from 'react'
import { getEnrolledLevelAsync, SecurityLevel } from 'expo-local-authentication'

export function useCanUseLocalAuth() {
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    async function fn() {
      const level = await getEnrolledLevelAsync()
      setFlag(level > SecurityLevel.NONE)
    }
    fn()
  })

  return flag
}
