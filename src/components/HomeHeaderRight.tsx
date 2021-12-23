import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { IconButton, Menu } from 'react-native-paper'

import { useAuth } from '../context/AuthContext'
import theme from '../lib/theme'
import { MainStackParamList } from '../Main'

export default function HomeHeaderRight() {
  const [isMenuActive, setMenuActive] = useState(false)
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>()
  const { handleLogout } = useAuth()

  const handleSettingsClick = () => {
    setMenuActive(false)
    navigation.navigate('Settings')
  }

  return (
    <Menu
      visible={isMenuActive}
      onDismiss={() => setMenuActive(false)}
      anchor={
        <IconButton
          icon="account"
          color={theme.colors.surface}
          onPress={() => setMenuActive(true)}
        />
      }
    >
      <Menu.Item onPress={handleSettingsClick} title="Settings" />
      <Menu.Item onPress={handleLogout} title="Logout" />
    </Menu>
  )
}
