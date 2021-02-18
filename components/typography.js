import React from 'react'
import { Text } from 'react-native-paper'
import { StyleSheet } from 'react-native'

export function Headline({ children, color, style, ...props }) {
  return (
    <Text
      style={[styles.headline, color && { color }, color && { color }, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

export function BodyText({ children, color, style, ...props }) {
  return (
    <Text
      style={[styles.bodyText, color && { color }, color && { color }, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  headline: {
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    fontSize: 60,
  },
  bodyText: {
    fontFamily: 'DidactGothic_400Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
  },
})
