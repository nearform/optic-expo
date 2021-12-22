import { useEffect, useState } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'

export function useCanUseBiometric() {
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    async function fn() {
      const hardware = await LocalAuthentication.hasHardwareAsync()
      const enrolled = await LocalAuthentication.isEnrolledAsync()
      setFlag(hardware && enrolled)
    }
    fn()
  }, [])

  return flag
}
