import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { IconButton } from 'react-native-paper'

import theme from '../lib/theme'
import { MainStackParamList } from '../Main'

export default function HomeHeaderRight() {
  const { navigate } = useNavigation<StackNavigationProp<MainStackParamList>>()

  return (
    <IconButton
      icon="cog"
      color={theme.colors.surface}
      onPress={() => navigate('Settings')}
    />
  )
}
