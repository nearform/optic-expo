import React from 'react'
import { StyleSheet, View } from 'react-native'

import theme from '../lib/theme'

import { Typography } from './Typography'

const styles = StyleSheet.create({
  noPendingNotifications: {
    paddingTop: theme.spacing(8),
    paddingHorizontal: theme.spacing(3),
    alignItems: 'center',
    flex: 1,
  },
})

export const NoPendingNotifications = () => (
  <View style={styles.noPendingNotifications}>
    <Typography variant="h5" gutterBottom={4}>
      No Pending Notifications
    </Typography>
    <Typography>New notifications will appear here.</Typography>
  </View>
)

export const NotificationCard = () => <></>
