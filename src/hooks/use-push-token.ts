import * as Notifications from 'expo-notifications'
import { useAsync } from 'react-async-hook'
import Constants from 'expo-constants'

async function getToken() {
  try {
    const notification = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })
    const token = notification.data
    return token
  } catch (error) {
    console.error(error)
    return ''
  }
}

const usePushToken = () => useAsync(getToken, []).result
export default usePushToken
