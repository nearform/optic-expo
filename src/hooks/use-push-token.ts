import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'

async function getToken() {
  let token

  if (Constants.isDevice) {
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

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token
}

export default function usePushToken() {
  const [token, setToken] = useState('')

  useEffect(() => {
    const fn = async () => {
      const expoToken = await getToken()
      if (expoToken) setToken(expoToken)
    }

    if (!token) fn()
  }, [token])

  return token
}
