import React from 'react'
import { StyleSheet, View } from 'react-native'

import theme from '../lib/theme'

import Spacer from './Spacer'
import { Typography } from './Typography'

const UI_STRINGS = {
  heading: 'No Secrets',
  description: 'Add a new secret and it will appear here.',
}

const styles = StyleSheet.create({
  description: {
    paddingVertical: theme.spacing(4),
    paddingHorizontal: theme.spacing(3),
    alignItems: 'center',
    flex: 1,
  },
})

export default function EmptyTokensText() {
  return (
    <View style={styles.description}>
      <Typography variant="h5" color={'#AAA' /* TODO: */}>
        {UI_STRINGS.heading}
      </Typography>
      <Spacer size={2} />
      <Typography color={'#AAA' /* TODO: */}>
        {UI_STRINGS.description}
      </Typography>
      <Spacer size={2} />
    </View>
  )
}
