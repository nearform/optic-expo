import React, { useState } from 'react'
import { IconButton, Menu } from 'react-native-paper'

import { useAuthentication } from '../context/authentication'
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
  const { handleLogout } = useAuthentication()

  const logout = async () => {
    try {
      await handleLogout()
    } catch (err) {
      console.log(err)
    }
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
      <Menu.Item onPress={logout} title={UI_STRINGS.menu.logoutButton.label} />
    </Menu>
  )
}
