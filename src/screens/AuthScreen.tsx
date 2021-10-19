import React, { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Platform, View, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-paper'

import theme from '../lib/defaultTheme'
import { useAuth } from '../context/AuthContext'
import { Typography } from '../components/Typography'
import Spacer from '../components/Spacer'
import Logo from '../components/Logo'

const UI_STRINGS = {
  headline: 'Optic',
  subheading: 'Grant your favorite automated tools an OTP when they need it!',
  button: 'Sign in with Google',
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing(7),
  },
  button: {
    textAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing(),
  },
})

type AuthScreenProps = unknown

export const AuthScreen: React.FC<AuthScreenProps> = () => {
  const { handleLogin } = useAuth()

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
      <View>
        <Typography
          variant="h2"
          style={styles.text}
          color={theme.colors.surface}
        >
          {UI_STRINGS.headline}
        </Typography>
        <Spacer size={4} />
        <Typography variant="body1" style={styles.text}>
          {UI_STRINGS.subheading}
        </Typography>
      </View>
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
      <Logo />
    </View>
  )
}
