import React, { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Platform, View, StyleSheet } from 'react-native'
import { Button, Title, Subheading } from 'react-native-paper'

import theme from '../lib/defaultTheme'

import Spacer from './Spacer'

const UI_STRINGS = {
  heading: 'Optic',
  subheading: 'Grant your favorite automated tools an OTP when they need it!',
  button: 'Login',
}

export default function Auth({ handleLogin }) {
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
      <Spacer size={2} />
      <Title style={styles.title}>{UI_STRINGS.heading}</Title>
      <Subheading style={styles.subheading}>{UI_STRINGS.subheading}</Subheading>
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
    backgroundColor: theme.colors.primary,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: theme.colors.surface,
  },
  subheading: {
    textAlign: 'center',
    color: theme.colors.surface,
  },
  button: {
    textAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing(),
  },
})
