import React, { useState } from 'react'
import { IconButton, Menu } from 'react-native-paper'

import { useAuth } from '../context/AuthContext'
import theme from '../lib/defaultTheme'

const UI_STRINGS = {
  menu: {
    logoutButton: {
      label: 'Logout',
    },
  },
}

export default function HomeHeaderRight() {
  const [isMenuActive, setMenuActive] = useState(false)
  const { handleLogout } = useAuth()

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
      <Menu.Item
        onPress={handleLogout}
        title={UI_STRINGS.menu.logoutButton.label}
      />
    </Menu>
  )
}
