import React from 'react'
import { StyleSheet, View } from 'react-native'

import theme from '../lib/theme'

import { Typography } from './Typography'

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing(8),
    paddingHorizontal: theme.spacing(3),
    alignItems: 'center',
    flex: 1,
  },
})

export const NoSecrets: React.FC = () => {
  return (
    <View style={styles.container}>
      <Typography variant="h5" gutterBottom={4}>
        No Secrets
      </Typography>
      <Typography>Add a new secret and it will appear here.</Typography>
    </View>
  )
}
