import { useEffect, useState } from 'react'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'

async function getToken() {
  let token

  try {
    const notification = await Notifications.getExpoPushTokenAsync({
      experienceId: `@${Constants.expoConfig.owner}/${Constants.expoConfig.slug}`,
    })
    token = notification.data
  } catch (e) {
    return console.error(e)
  }

  return token
}

export default function usePushToken() {
  const [expoToken, setExpoToken] = useState('')

  useEffect(() => {
    const fn = async () => {
      const token = await getToken()
      if (token) setExpoToken(token)
    }

    if (!expoToken) fn()
  }, [expoToken])

  return expoToken
}
