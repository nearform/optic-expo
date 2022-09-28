import * as AppleAuthentication from 'expo-apple-authentication'
import * as WebBrowser from 'expo-web-browser'
import React, { useEffect, useState } from 'react'
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'

import { Login } from '../components/Login'
import Logo from '../components/Logo'
import { Typography } from '../components/Typography'
import { useAuth } from '../context/AuthContext'
import theme from '../lib/theme'

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
    alignItems: 'flex-start',
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
})

type AuthScreenProps = unknown

export const AuthScreen: React.FC<AuthScreenProps> = () => {
  const [appleLoginEnabled, setAppleLoginEnabled] = useState(false)
  const { handleLoginGoogle, handleLoginApple, handleLoginPassword } = useAuth()
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleLoginEnabled)

    if (Platform.OS === 'web') {
      return
    }

    WebBrowser.warmUpAsync()

    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [])

  const authButtons = (
    <>
      <Button
        style={styles.button}
        accessibilityLabel="login with google"
        mode="contained"
        icon={({ size }) => (
          <Image
            source={require('../assets/google.png')}
            style={{ width: size, height: size }}
          />
        )}
        onPress={handleLoginGoogle}
        color={theme.colors.surface}
      >
        Sign in with Google
      </Button>
      {appleLoginEnabled && (
        <Button
          style={styles.button}
          accessibilityLabel="login with apple"
          mode="contained"
          icon={({ size }) => (
            <Image
              source={require('../assets/apple.png')}
              style={{ width: size, height: size }}
            />
          )}
          onPress={handleLoginApple}
          color={theme.colors.surface}
        >
          Sign in with Apple
        </Button>
      )}
    </>
  )

  return (
    <View style={styles.container}>
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
      <View>
        {showPasswordForm ? (
          <Login onLogin={handleLoginPassword} />
        ) : (
          authButtons
        )}
      </View>
      <Pressable
        onLongPress={() => setShowPasswordForm(form => !form)}
        delayLongPress={3000}
      >
        <Logo />
      </Pressable>
    </View>
  )
}
