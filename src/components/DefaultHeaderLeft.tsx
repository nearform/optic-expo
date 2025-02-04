import React from 'react'
import { IconButton } from 'react-native-paper'
import type { StackHeaderLeftProps } from '@react-navigation/stack/lib/typescript/commonjs/src/types'

import theme from '../lib/theme'

export default function DefaultHeaderLeft(props: StackHeaderLeftProps) {
  return (
    <IconButton {...props} iconColor={theme.colors.secondary} icon="close" />
  )
}
