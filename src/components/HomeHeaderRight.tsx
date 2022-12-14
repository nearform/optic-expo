import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { Badge, IconButton } from 'react-native-paper'

import theme from '../lib/theme'
import { usePendingNotifications } from '../context/PendingNotificationsContext'
import { MainStackParamList } from '../Main'

export default function HomeHeaderRight() {
  const { navigate } = useNavigation<StackNavigationProp<MainStackParamList>>()
  const { pendingNotifications } = usePendingNotifications()

  const hasPendingNotifications = pendingNotifications.length > 0

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <View>
        <Badge
          visible={hasPendingNotifications}
          size={16}
          style={{
            backgroundColor: theme.colors.notification,
            position: 'absolute',
            top: 5,
            right: 5,
          }}
          onPress={() => undefined}
        >
          {pendingNotifications.length}
        </Badge>
        <IconButton
          icon="bell"
          iconColor={theme.colors.surface}
          onPress={() => navigate('Notifications')}
        />
      </View>
      <IconButton
        icon="cog"
        iconColor={theme.colors.surface}
        onPress={() => navigate('Settings')}
      />
    </View>
  )
}
