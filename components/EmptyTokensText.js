import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Subheading } from 'react-native-paper'

import theme from '../lib/defaultTheme'

import Spacer from './Spacer'

const UI_STRINGS = {
  heading: `You don't have a secret set up yet.`,
  description:
    'Add one by scanning or uploading a QR code, or even enter the details manually.',
}

export default function EmptyTokensText() {
  return (
    <View style={styles.description}>
      <Subheading>{UI_STRINGS.heading}</Subheading>
      <Spacer size={2} />
      <Subheading>{UI_STRINGS.description}</Subheading>
      <Spacer size={2} />
    </View>
  )
}

const styles = StyleSheet.create({
  description: {
    paddingVertical: theme.spacing(4),
    paddingHorizontal: theme.spacing(3),
  },
})
