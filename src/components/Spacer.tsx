import React from 'react'
import { View } from 'react-native'

import theme from '../lib/theme'

export default function Spacer({
  horizontal,
  size,
  flex,
  style,
  surface,
  ...props
}) {
  return (
    <View
      style={[
        {
          ...(flex ? { flex: 1 } : null),
          [horizontal ? 'minWidth' : 'minHeight']: theme.spacing(size),
        },
        style,
      ]}
      {...props}
    />
  )
}
