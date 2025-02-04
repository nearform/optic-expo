import React from 'react'
import { StyleSheet, View } from 'react-native'

import theme from '../lib/theme'

import { Typography } from './Typography'

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing(10),
    paddingHorizontal: theme.spacing(3),
    width: 300,
    marginHorizontal: 'auto',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: theme.colors.primary,
    textAlign: 'center',
  },
})

export const NoSecrets: React.FC = () => {
  return (
    <View style={styles.container}>
      <Typography variant="h4" gutterBottom={2} style={styles.text}>
        No Secrets
      </Typography>
      <Typography style={styles.text}>
        Add a new secret and it will appear here.
      </Typography>
    </View>
  )
}
