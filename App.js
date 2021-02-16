import * as React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet } from 'react-native'

import {
  AuthenticationProvider,
  useAuthenticationContext,
} from './context/authentication'
import Auth from './components/Auth'
import Home from './components/Home'

import theme from './default-theme'

function Main() {
  const { user } = useAuthenticationContext()
  return (
    <View style={styles.container}>
      {user ? <Home user={user} /> : <Auth />}
      <StatusBar style="auto" />
    </View>
  )
}

export default function App() {
  return (
    <AuthenticationProvider>
      <PaperProvider theme={theme}>
        <Main />
      </PaperProvider>
    </AuthenticationProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
