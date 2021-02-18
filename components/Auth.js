import React, { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Platform, View, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-paper'

import theme from '../lib/defaultTheme'

import { Headline, BodyText } from './typography'
import Spacer from './Spacer'
import Logo from './Logo'

const UI_STRINGS = {
  heading: 'Optic',
  subheading: 'Grant your favorite automated tools an OTP when they need it!',
  button: 'Sign in with Google',
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
      <Spacer size={12} />
      <Headline color={theme.colors.surface}>{UI_STRINGS.heading}</Headline>
      <Spacer size={4} />
      <BodyText style={styles.subheading}>{UI_STRINGS.subheading}</BodyText>
      <Spacer size={12} />
      <Button
        style={styles.button}
        accessibilityLabel="login"
        mode="contained"
        icon={({ size }) => (
          <Image
            source={require('../assets/google.png')}
            style={{ width: size, height: size }}
          />
        )}
        onPress={handleLogin}
        color={theme.colors.surface}
      >
        {UI_STRINGS.button}
      </Button>
      <Spacer size={18} />
      <Logo />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: theme.colors.surface,
  },
  subheading: {
    textAlign: 'center',
    color: theme.colors.surface,
    paddingHorizontal: theme.spacing(7),
  },
  button: {
    textAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing(),
  },
})
