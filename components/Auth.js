import React, { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'

import { Button, Platform, View } from 'react-native'
import { Title, Subheading } from 'react-native-paper'
import { useAuthenticationContext } from '../context/authentication'

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
    <View>
      <Title>Optic</Title>
      <Subheading>
        Grant your favorite automated tools an OTP when they need it!
      </Subheading>
      <View>
        <Button title="Login" onPress={() => handleLogin()} />
      </View>
    </View>
  )
}
