import React, { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'

import { Platform, View, StyleSheet } from 'react-native'
import { Button, Title, Subheading } from 'react-native-paper'
import { useAuthenticationContext } from '../context/authentication'

import theme from '../default-theme'

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
      <Title style={styles.title}>{UI_STRINGS.title}</Title>
      <Subheading style={styles.subheading}>{UI_STRINGS.subheading}</Subheading>
      <View>
        <Button
          style={styles.button}
          accessibilityLabel="login"
          mode="contained"
          icon="google"
          onPress={() => handleLogin()}
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
    display: 'flex',
  },
  button: {
    textAlign: 'center',
    alignItems: 'center',
    padding: 8,
  },
  title: {
    fontSize: theme.text.small,
    marginBottom: theme.spacing.tiny,
  },
  subheading: {
    marginBottom: theme.spacing.medium,
  },
})
