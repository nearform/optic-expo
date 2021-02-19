import React from 'react'
import colorUtility from 'color'
import { Text } from 'react-native-paper'
import { StyleSheet } from 'react-native'

import theme from '../lib/defaultTheme'

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
  headline5: {
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    fontSize: 24,
  },
  caption: {
    fontFamily: 'DidactGothic_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
})

export function Headline({ children, color, alpha, style, level, ...props }) {
  const textColor = colorUtility(color).alpha(alpha).rgb().string()
  const headlineStyles = styles[level ? `headline${level}` : 'headline']
  return (
    <Text style={[headlineStyles, { color: textColor }, style]} {...props}>
      {children}
    </Text>
  )
}

Headline.defaultProps = {
  color: theme.colors.text,
  alpha: 1,
}

export function BodyText({ children, color, alpha, style, ...props }) {
  const textColor = colorUtility(color).alpha(alpha).rgb().string()
  return (
    <Text style={[styles.bodyText, { color: textColor }, style]} {...props}>
      {children}
    </Text>
  )
}

BodyText.defaultProps = {
  color: theme.colors.text,
  alpha: 1,
}

export function Caption({ children, color, alpha, style, ...props }) {
  const textColor = colorUtility(color).alpha(alpha).rgb().string()
  return (
    <Text style={[styles.caption, { color: textColor }, style]} {...props}>
      {children}
    </Text>
  )
}

Caption.defaultProps = {
  color: theme.colors.text,
  alpha: 1,
}
