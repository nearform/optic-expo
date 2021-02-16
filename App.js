import * as React from 'react'
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'

import {
  AuthenticationProvider,
  useAuthenticationContext,
} from './context/authentication'
import Auth from './components/Auth'
import Home from './components/Home'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}

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
