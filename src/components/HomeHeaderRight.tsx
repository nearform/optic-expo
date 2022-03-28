import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'

import theme from '../lib/theme'
import { usePendingNotifications } from '../context/PendingNotificationsContext'
import { MainStackParamList } from '../Main'

export default function HomeHeaderRight() {
  const { navigate } = useNavigation<StackNavigationProp<MainStackParamList>>()
  const { pendingNotifications } = usePendingNotifications()

  const hasPendingNotifications = pendingNotifications.length > 0

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <IconButton
        icon="bell"
        color={
          hasPendingNotifications
            ? theme.colors.notification
            : theme.colors.surface
        }
        onPress={() => navigate('Notifications')}
      />
      <IconButton
        icon="cog"
        color={theme.colors.surface}
        onPress={() => navigate('Settings')}
      />
    </View>
  )
}
