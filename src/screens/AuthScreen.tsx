import React, { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Platform, View, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-paper'

import theme from '../lib/theme'
import { useAuth } from '../context/AuthContext'
import { Typography } from '../components/Typography'
import Logo from '../components/Logo'

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
    padding: theme.spacing(1),
  },
})

type AuthScreenProps = {
  onReady: () => void
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onReady }) => {
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
    <View style={styles.container} onLayout={onReady}>
      <View>
        <Typography
          variant="h2"
          style={styles.text}
          color={theme.colors.surface}
          gutterBottom={4}
        >
          Optic
        </Typography>
        <Typography
          variant="body1"
          style={styles.text}
          color={theme.colors.surface}
        >
          Grant your favorite automated tools an OTP when they need it!
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
        Sign in with Google
      </Button>
      <Logo />
    </View>
  )
}
