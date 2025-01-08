import { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'

async function getToken() {
  let token

  try {
    // FIXME: check push notifications work
    const notification = await Notifications.getExpoPushTokenAsync()
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
