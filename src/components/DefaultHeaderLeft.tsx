import React from 'react'
import { IconButton } from 'react-native-paper'

import theme from '../lib/theme'

export default function DefaultHeaderLeft(props) {
  return <IconButton {...props} color={theme.colors.surface} icon="close" />
}
