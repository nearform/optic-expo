import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Appbar, Text, Menu } from 'react-native-paper'

import { useAuthenticationContext } from '../context/authentication'
import theme from '../defaultTheme'

const UI_STRINGS = {
  logout: 'Logout',
}

export default function AppBar() {
  const [isMenuActive, setMenuActive] = useState(false)
  const { handleLogout } = useAuthenticationContext()
  return (
    <Appbar>
      <Appbar.Content title={<Text style={styles.title}>Optic</Text>} />
      <View>
        <Menu
          visible={isMenuActive}
          onDismiss={() => setMenuActive(false)}
          anchor={
            <Appbar.Action
              icon="account"
              onPress={() => setMenuActive(true)}
              color={theme.colors.white}
            />
          }
        >
          <Menu.Item onPress={handleLogout} title={UI_STRINGS.logout} />
        </Menu>
      </View>
    </Appbar>
  )
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.white,
  },
})
