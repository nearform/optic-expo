import 'react-native-get-random-values'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider as PaperProvider } from 'react-native-paper'

import { AuthenticationProvider } from './context/authentication'
import { SecretsProvider } from './context/secrets'
import theme from './lib/defaultTheme'
import Main from './Main'

export default function App() {
  return (
    <AuthenticationProvider>
      <SecretsProvider>
        <PaperProvider theme={theme}>
          <Main />
          <StatusBar style="auto" />
        </PaperProvider>
      </SecretsProvider>
    </AuthenticationProvider>
  )
}
