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

export function Headline({
  children,
  color = theme.colors.text,
  alpha = 1,
  style,
  level,
  ...props
}) {
  const textColor = colorUtility(color).alpha(alpha).rgb().string()
  const headlineStyles = styles[level ? `headline${level}` : 'headline']
  return (
    <Text style={[headlineStyles, { color: textColor }, style]} {...props}>
      {children}
    </Text>
  )
}

export function BodyText({
  children,
  color = theme.colors.text,
  alpha = 1,
  style,
  ...props
}) {
  const textColor = colorUtility(color).alpha(alpha).rgb().string()
  return (
    <Text style={[styles.bodyText, { color: textColor }, style]} {...props}>
      {children}
    </Text>
  )
}

export function Caption({
  children,
  color = theme.colors.text,
  alpha = 1,
  style,
  ...props
}) {
  const textColor = colorUtility(color).alpha(alpha).rgb().string()
  return (
    <Text style={[styles.caption, { color: textColor }, style]} {...props}>
      {children}
    </Text>
  )
}
