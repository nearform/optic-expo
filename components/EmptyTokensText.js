import React from 'react'
import { StyleSheet, View } from 'react-native'

import theme from '../lib/defaultTheme'

import { Headline, BodyText } from './typography'
import Spacer from './Spacer'

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
      <Headline level="5" color={theme.colors.grey}>
        {UI_STRINGS.heading}
      </Headline>
      <Spacer size={2} />
      <BodyText color={theme.colors.grey}>{UI_STRINGS.description}</BodyText>
      <Spacer size={2} />
    </View>
  )
}
