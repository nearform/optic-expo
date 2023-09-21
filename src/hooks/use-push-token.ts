import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { isDevice } from 'expo-device'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'

async function getToken() {
  let token

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      return console.log('No permission for push')
    }

    try {
      const notification = await Notifications.getExpoPushTokenAsync({
        experienceId: `@${Constants.expoConfig.owner}/${Constants.expoConfig.slug}`,
      })
      token = notification.data
    } catch (e) {
      return console.error(e)
    }
  } else {
    console.log('Must use physical device for Push Notifications')
  }

  return token
}

export default function usePushToken() {
  const [token, setToken] = useState('')

  const fetchToken = async () => {
    const expoToken = await getToken()
    if (expoToken) {
      setToken(expoToken)
    }
  }

  useEffect(() => {
    if (!token) {
      fetchToken()
    }
  }, [token])

  return { token, refetchToken: fetchToken }
}
