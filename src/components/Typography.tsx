import React from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { Text } from 'react-native-paper'

import theme, { TypographyVariant } from '../lib/theme'

export type TypographyProps = {
  children: React.ReactNode
  variant?: TypographyVariant
  color?: string
  style?: StyleProp<TextStyle>
  gutterBottom?: number | boolean
  testID?: string
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = theme.colors.text,
  style,
  gutterBottom = 0,
  testID,
}) => {
  return (
    <Text
      testID={testID}
      style={[
        theme.typography[variant],
        {
          color,
          marginBottom: theme.spacing(+gutterBottom),
          display: 'flex',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
