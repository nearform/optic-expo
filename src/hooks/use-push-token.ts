import * as Notifications from 'expo-notifications'
import { useAsync } from 'react-async-hook'
import Constants from 'expo-constants'

async function getToken() {
  let token = ''

  try {
    const notification = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })
    token = notification.data
  } catch (error) {
    console.error(error)
  }

  return token
}

const usePushToken = () => useAsync(getToken, []).result
export default usePushToken
