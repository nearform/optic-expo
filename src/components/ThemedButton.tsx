import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, ButtonProps } from 'react-native-paper'

import theme from '../lib/theme'

const styles = StyleSheet.create({
  common: {
    borderRadius: 100,
    height: 44,
  },
  content: {
    height: 44,
  },
  label: {
    letterSpacing: 0.5,
    fontSize: 18,
    ...theme.fonts.regular,
    color: theme.colors.primary,
  },
  primary: {
    backgroundColor: theme.colors.secondary,
  },
  secondary: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
})

type ThemedButtonProps = ButtonProps & {
  variant?: 'primary' | 'secondary'
}

export function ThemedButton({
  variant = 'primary',
  style,
  contentStyle,
  labelStyle,
  ...props
}: ThemedButtonProps) {
  return (
    <Button
      uppercase={false}
      mode={variant === 'primary' ? 'contained' : 'outlined'}
      {...props}
      style={[styles.common, styles[variant], style]}
      contentStyle={[styles.content, contentStyle]}
      labelStyle={[styles.label, labelStyle]}
    />
  )
}
