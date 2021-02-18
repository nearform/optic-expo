import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider as PaperProvider } from 'react-native-paper'
import {
  useFonts as usePoppins,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import {
  useFonts as useDidactGothic,
  DidactGothic_400Regular,
} from '@expo-google-fonts/didact-gothic'

import { AuthenticationProvider } from './context/authentication'
import { SecretsProvider } from './context/secrets'
import Main from './components/Main'
import theme from './lib/defaultTheme'

export default function App() {
  usePoppins({
    Poppins_700Bold,
  })

  useDidactGothic({
    DidactGothic_400Regular,
  })

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
