import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import {
  NoPendingNotifications,
  NotificationCard,
} from '../components/NotificationCard'
import { usePendingNotifications } from '../context/PendingNotificationsContext'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
})

export const NotificationsScreen = () => {
  const { pendingNotifications } = usePendingNotifications()

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {pendingNotifications.length === 0
          ? NoPendingNotifications()
          : pendingNotifications.map(notification => (
              <NotificationCard
                key={notification.request.identifier}
                notification={notification}
              />
            ))}
      </ScrollView>
    </View>
  )
}
