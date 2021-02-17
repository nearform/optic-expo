import React, { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'

import { Platform, View, StyleSheet } from 'react-native'
import { Button, Title, Subheading } from 'react-native-paper'
import { useAuthenticationContext } from '../context/authentication'

import theme from '../defaultTheme'
import Spacer from './Spacer'

const UI_STRINGS = {
  title: 'Optic',
  subheading: 'Grant your favorite automated tools an OTP when they need it!',
  button: 'Login',
}

export default function Auth() {
  const { handleLogin } = useAuthenticationContext()

  useEffect(() => {
    if (Platform.OS === 'web') {
      return
    }

    WebBrowser.warmUpAsync()

    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [])

  return (
    <View style={styles.container}>
      <Title>{UI_STRINGS.title}</Title>
      <Spacer size={2} />
      <Subheading>{UI_STRINGS.subheading}</Subheading>
      <Spacer size={2} />
      <View>
        <Button
          style={styles.button}
          accessibilityLabel="login"
          mode="contained"
          icon="google"
          onPress={handleLogin}
        >
          {UI_STRINGS.button}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    textAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing(),
  },
})
