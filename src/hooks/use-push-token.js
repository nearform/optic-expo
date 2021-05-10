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

    token = (await Notifications.getExpoPushTokenAsync()).data
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
  const [token, setToken] = useState(null)

  useEffect(() => {
    const fn = async () => {
      const aaa = await getToken()
      setToken(aaa)
    }

    if (!token) fn()
  }, [token])

  return token
}
