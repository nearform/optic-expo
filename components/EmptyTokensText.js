import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Subheading } from 'react-native-paper'

import theme from '../defaultTheme'

import Spacer from './Spacer'

const UI_STRINGS = {
  default: {
    heading: `You don't have a secret set up yet.`,
    description:
      'Add one by scanning or uploading a QR code, or even enter the details manually.',
  },
}

export default function EmptyTokensText() {
  return (
    <View style={styles.description}>
      <Subheading>{UI_STRINGS.default.heading}</Subheading>
      <Spacer size={2} />
      <Subheading>{UI_STRINGS.default.description}</Subheading>
      <Spacer size={2} />
    </View>
  )
}

const styles = StyleSheet.create({
  description: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
})
