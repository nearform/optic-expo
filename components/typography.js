import React from 'react'
import { Text } from 'react-native-paper'
import { StyleSheet } from 'react-native'

export function Headline({ children, color, style, level, ...props }) {
  const headlineStyles = styles[level ? `headline${level}` : 'headline']
  return (
    <Text style={[headlineStyles, color && { color }, style]} {...props}>
      {children}
    </Text>
  )
}

export function BodyText({ children, color, style, ...props }) {
  return (
    <Text style={[styles.bodyText, color && { color }, style]} {...props}>
      {children}
    </Text>
  )
}

export function Caption({ children, color, style, ...props }) {
  return (
    <Text style={[styles.caption, color && { color }, style]} {...props}>
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
  headline5: {
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    fontSize: 24,
  },
  bodyText: {
    fontFamily: 'DidactGothic_400Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'DidactGothic_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
})
