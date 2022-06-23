import { useCallback, useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

export function useSplashScreen(isReady: boolean) {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync()
      } catch (e) {
        console.warn(e)
      }
    }

    prepare()
  }, [])

  return useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync()
    }
  }, [isReady])
}
